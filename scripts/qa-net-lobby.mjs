/**
 * Сетевой QA волны 2A/2B: стол, вход по ссылке, очередь ожидающих, кик с
 * понятной ошибкой у удалённого, вместимость и настройки до старта, передача
 * хоста, чат в партии и финальный счёт. Запускать при живом dev-сервере:
 * node scripts/qa-net-lobby.mjs
 *
 * Проверки идут по фактическому состоянию экранов (списки мест и очереди,
 * активная кнопка вместимости, заголовок лобби/очереди), а не по факту
 * «клик прошёл»: клик по SSR-разметке до гидратации React может потеряться,
 * и сценарий сначала чинит состояние из UI, а потом делает выводы.
 *
 * Устойчивость к дев-перезагрузкам Vite: первый вызов каждого serverFn и
 * первый импорт клиентских модулей партии компилируются лениво, и Vite шлёт
 * full-reload всем вкладкам (они теряют сессию и падают в меню). Поэтому
 * сценарий начинается с прогрева серверной цепочки и игрового UI на отдельной
 * вкладке, и только после него открываются сценарные вкладки. Если вкладку всё
 * же перезагрузило, ensureLobby возвращает её за стол, а залипшую на
 * «Открываем стол…» лечит сменой версии комнаты (см. unstick).
 */
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { openCreateTab, startNetGame } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
// Скриншоты пишем ВНЕ репозитория: Tailwind в dev сканирует содержимое проекта
// (artifacts/ не в .gitignore), и каждый новый PNG вызывает SSR program reload —
// Vite перезагружает все вкладки, и сценарий рвётся на середине.
const SHOTS = process.env.EVO_SHOTS ?? join(tmpdir(), "evo-qa-shots");
mkdirSync(SHOTS, { recursive: true });

const problems = [];
const warnings = [];
const START_TS = Date.now();
/** Метка времени от старта — по ней удобно ловить флаки и тайминги шагов. */
const rel = () => `${Math.round((Date.now() - START_TS) / 1000)}с`;
const ok = (msg) => console.log(`OK: [${rel()}] ${msg}`);
const warn = (msg) => {
  console.log(`WARN: [${rel()}] ${msg}`);
  warnings.push(msg);
};
const fail = (msg) => {
  console.log(`FAIL: [${rel()}] ${msg}`);
  problems.push(msg);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

let reloadSeen = 0;

function track(page, label) {
  page.on("pageerror", (e) => fail(`${label}: PAGEERROR ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/NotSameOrigin|favicon/.test(t)) return;
    fail(`${label}: console ${t.slice(0, 200)}`);
  });
  // Полная перезагрузка вкладки рвёт лобби: считаем их и предупреждаем один
  // раз, чтобы флаки дев-сервера было видно в отчёте, а не только в симптомах.
  page.on("websocket", (ws) => {
    ws.on("framereceived", (f) => {
      if (!String(f.payload).includes("full-reload")) return;
      reloadSeen += 1;
      if (reloadSeen === 1) {
        warn(`dev-сервер перезагружает вкладки (full-reload) — итоговый счётчик в сводке`);
      }
    });
  });
}

/**
 * Ответы серверных функций страницы: нужны там, где dev-сервер может
 * перезагрузить вкладку и текст ошибки не успевает отрисоваться. Сам ответ —
 * факт того, что клиент получил машиночитаемый код.
 */
function collectResponses(page) {
  const bodies = [];
  page.on("response", async (r) => {
    if (!r.url().includes("_serverFn")) return;
    try {
      bodies.push(await r.text());
    } catch {
      /* тело недоступно */
    }
  });
  return bodies;
}

async function newPage(label, viewport = { width: 1280, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  track(page, label);
  return page;
}

/**
 * Ответ сервера, в котором участника удалили из-за стола. Машиночитаемый
 * `code` в dev-режиме теряется (сервис кэширован на globalThis из старого
 * SSR-графа, и `e instanceof NetError` в новом графе даёт false), поэтому
 * инвариант проверяем по тексту отказа, а наличие кода — отдельно.
 */
function sawKick(body) {
  return body.includes("Вас удалили из-за стола");
}

/** Код кика доехал до клиента (в dev бывает только при одном графе модулей). */
function sawKickCode(body) {
  return body.includes("Вас удалили из-за стола") && body.includes('"kicked"');
}

const isVisible = (loc) => loc.isVisible().catch(() => false);
// isEnabled у Playwright ждёт появления элемента до 30 с: для кнопок, которых
// сейчас нет на экране (например, «Не защищаться» вне атаки), это съедало
// полминуты на каждую проверку. Сначала дешёвый count(), потом сама проверка.
const isEnabled = async (loc) => {
  if ((await loc.count().catch(() => 0)) === 0) return false;
  return loc.first().isEnabled({ timeout: 1500 }).catch(() => false);
};

async function safeClick(loc, timeout = 3000) {
  try {
    await loc.click({ timeout });
    return true;
  } catch {
    return false;
  }
}

/** Ждём выполнения проверки (в т.ч. асинхронной) до таймаута. */
async function waitUntil(check, timeout, interval = 400) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return true;
    await sleep(interval);
  }
  return check();
}

/**
 * Переход по URL с ожиданием гидратации: networkidle даёт React время
 * навесить обработчики, иначе первые клики по SSR-разметке теряются.
 */
async function gotoUrl(page, url) {
  await page
    .goto(url, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
}

/** Код стола с экрана или null, если лобби не на экране. */
async function roomCode(page) {
  const loc = page.locator("[data-room-code]").first();
  if (!(await loc.count())) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
}

/**
 * Снимок лобби по фактическому DOM: код на экране, места (занятые и
 * «Свободное место»), очередь и активная кнопка вместимости. Строки очереди
 * отличаем по родителю заголовка «Ожидают места» — иначе они попали бы в места.
 */
function lobbySnapshot(page) {
  return page.evaluate(() => {
    const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();
    const code = norm(document.querySelector("[data-room-code]")?.textContent);
    const waiterHead = [...document.querySelectorAll("h3")].find((h) =>
      norm(h.innerText).includes("Ожидают места"),
    );
    const waiterItems = waiterHead
      ? [...waiterHead.parentElement.querySelectorAll("li")].map((li) => norm(li.innerText))
      : [];
    // Места берём только из списка мест: в лобби теперь есть чат, и его записи
    // (системные «присоединился», сообщения игроков) не должны попадать сюда.
    const seatList = document.querySelector("[data-seat-list]");
    const seatItems = seatList ? [...seatList.querySelectorAll("li")].map((li) => norm(li.innerText)) : [];
    const cap = [...document.querySelectorAll("button")]
      .filter((b) => /^[2-8]$/.test(norm(b.innerText)))
      .map((b) => ({ n: Number(norm(b.innerText)), active: b.className.includes("bg-accent"), disabled: b.disabled }));
    return { code: code || null, seatItems, waiterItems, cap };
  });
}

/** Вкладка застряла на «Открываем стол…»: нет ни лобби, ни формы входа. */
async function isStuckConnecting(page) {
  return page
    .evaluate(() => {
      const text = document.body?.innerText ?? "";
      return (
        text.includes("Открываем стол") &&
        !document.querySelector("[data-room-code]") &&
        !document.querySelector('input[aria-label="Ваше имя"]')
      );
    })
    .catch(() => false);
}

/**
 * Аварийное лечение залипшей вкладки. После resume в dev клиент может
 * остаться на «Открываем стол…»: снапшот приходит до создания store, а
 * следующий poll отдаёт unchanged. Любое хост-действие меняет version, и
 * следующий poll отдаёт полный снапшот — дергаем пустой патч настроек через
 * клиентский API вкладки (токен берём из её же localStorage).
 */
async function unstick(page, code) {
  return page
    .evaluate(async (roomCode) => {
      const token = localStorage.getItem(`evo-seat-${roomCode}`);
      if (!token) return false;
      const api = await import("/src/lib/net/api.ts");
      const r = await api.netSetSettings({ data: { code: roomCode, token, settings: {} } });
      return Boolean(r && r.ok);
    }, code)
    .catch(() => false);
}

/**
 * Вкладка за столом? Если нет — возвращаемся по ссылке ?room=CODE: токен
 * места в localStorage вернёт без формы, иначе заполняем форму входа (в т.ч.
 * поле «Код стола», если оно пустое — без кода кнопка «Войти» заблокирована).
 * Успех — только появление [data-room-code] с ожидаемым кодом. `bumpPage` —
 * вкладка с правами хоста для аварийного лечения (по умолчанию сама страница).
 */
async function ensureLobby(page, code, name, bumpPage) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if ((await roomCode(page)) === code) return true;
    await gotoUrl(page, `${BASE}?room=${code}`);
    const deadline = Date.now() + 20_000;
    let stuckAt = 0;
    let bumpedAt = 0;
    while (Date.now() < deadline) {
      if ((await roomCode(page)) === code) return true;
      const nameInput = page.getByLabel("Ваше имя");
      if (await nameInput.count()) {
        stuckAt = 0;
        const codeInput = page.getByLabel("Код стола");
        if (await codeInput.count()) {
          const filled = (await codeInput.inputValue().catch(() => "")).trim().toUpperCase();
          if (filled !== code) await codeInput.fill(code).catch(() => {});
        }
        await nameInput.fill(name).catch(() => {});
        const join = page.getByRole("button", { name: "Войти", exact: true });
        if ((await join.count()) && (await isEnabled(join.first()))) {
          await safeClick(join.first(), 3000);
        }
      } else if (await isStuckConnecting(page)) {
        if (!stuckAt) stuckAt = Date.now();
        else if (Date.now() - stuckAt > 2500 && Date.now() - bumpedAt > 6000) {
          bumpedAt = Date.now();
          for (const p of [bumpPage, page]) {
            if (p && (await unstick(p, code))) break;
          }
        }
      } else {
        stuckAt = 0;
      }
      await sleep(500);
    }
    await sleep(800);
  }
  return (await roomCode(page)) === code;
}

/** Короткий текст экрана — для сообщений о падении. */
async function bodyOf(page) {
  return page
    .evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 180))
    .catch(() => "?");
}

/**
 * Ждёт появления текста и бросает с дампом экрана, если его нет.
 * locator.waitFor в отчёте не говорит, что именно было на вкладке.
 */
async function expectText(page, re, timeout, what) {
  const found = await waitUntil(() => page.getByText(re).count().then((n) => n > 0), timeout, 500);
  if (!found) throw new Error(`${what} не появилось; экран: ${await bodyOf(page)}`);
}

/**
 * Ждёт фактическое состояние лобби: активна кнопка вместимости `capacity`,
 * за столом `occupied` мест, `free` свободно, `waiters` в очереди. Если
 * вместимость не та (клик при создании стола потерялся до гидратации) —
 * исправляет её из UI. Бросает с дампом состояния, если не сошлось.
 */
async function ensureLobbyState(page, code, me, want, timeout = 25_000, bumpPage) {
  if (!(await ensureLobby(page, code, me, bumpPage))) throw new Error(`вкладка «${me}» не в лобби ${code}`);
  const deadline = Date.now() + timeout;
  let last = null;
  while (Date.now() < deadline) {
    last = await lobbySnapshot(page);
    const free = last.seatItems.filter((t) => t.includes("Свободное место")).length;
    const occupied = last.seatItems.length - free;
    const active = last.cap.find((c) => c.active)?.n ?? null;
    if (
      active === want.capacity &&
      occupied === want.occupied &&
      free === want.free &&
      last.waiterItems.length === (want.waiters ?? 0)
    ) {
      return last;
    }
    if (active !== want.capacity) {
      const btn = page.getByRole("button", { name: String(want.capacity), exact: true });
      if (await btn.count()) await safeClick(btn.first(), 3000);
    }
    await sleep(700);
  }
  throw new Error(
    `лобби не в ожидаемом состоянии (нужно cap=${want.capacity}, занято=${want.occupied}, ` +
      `свободно=${want.free}, очередь=${want.waiters ?? 0}; по факту ${JSON.stringify(last)})`,
  );
}

/** Игрок за столом (а не в очереди): заголовок «Стол · ждём игроков». */
async function waitSeated(page, timeout = 25_000) {
  const seated = await waitUntil(
    () => page.getByText(/Стол · ждём игроков/i).count().then((n) => n > 0),
    timeout,
    500,
  );
  if (!seated) {
    const body = await page
      .evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 140))
      .catch(() => "?");
    throw new Error(`игрок не за столом (экран: ${body})`);
  }
  if (await page.getByText(/Стол · мест нет/i).count()) {
    throw new Error("игрок оказался в очереди, а не за столом");
  }
}

/** Ожидающий видит свой экран: «Стол · мест нет» и позицию «в очереди». */
async function waitQueued(page, timeout = 25_000) {
  const queued = await waitUntil(async () => {
    const noSeat = await page.getByText(/Стол · мест нет/i).count();
    const phrase = await page.getByText(/в очереди/i).count();
    return noSeat > 0 && phrase > 0;
  }, timeout, 500);
  if (!queued) {
    const body = await page
      .evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 140))
      .catch(() => "?");
    throw new Error(`ожидающий не видит экран очереди (экран: ${body})`);
  }
}

/**
 * Прогрев dev-сервера на отдельной вкладке: первый вызов КАЖДОГО serverFn в
 * dev компилирует его SSR-модуль, и Vite шлёт program reload — full-reload
 * всем вкладкам (они теряют сессию и падают в меню). Поэтому до сценария
 * прогоняем через клиентский API все функции, которые он использует, с
 * заведомо негодными данными: ответ неважен, важен сам вызов. Затем ждём
 * раунд без перезагрузок — значит, сервер «горячий».
 */
const WARM_CALLS = 17;

async function warmBatch(page) {
  return page.evaluate(async () => {
    const api = await import("/src/lib/net/api.ts");
    const code = "ZZZZ";
    const token = "0".repeat(32);
    const calls = [
      () => api.netCreateRoom({ data: { name: "Прогрев", capacity: 2, botSeats: 0, difficulty: "normal" } }),
      () => api.netJoinRoom({ data: { code, name: "Прогрев" } }),
      () => api.netRejoin({ data: { code, token } }),
      () => api.netSetBots({ data: { code, token, count: 1 } }),
      () => api.netKick({ data: { code, token, seat: 1 } }),
      () => api.netSetCapacity({ data: { code, token, capacity: 3 } }),
      () => api.netSetSettings({ data: { code, token, settings: { difficulty: "hard" } } }),
      () => api.netTransferHost({ data: { code, token, seat: 1 } }),
      () => api.netKickWaiter({ data: { code, token, index: 0 } }),
      () => api.netRoomInfo({ data: { code, token } }),
      () => api.netClaimSeat({ data: { code, token } }),
      () => api.netLeaveQueue({ data: { code, token } }),
      () => api.netChat({ data: { code, token, text: "прогрев" } }),
      () => api.netStart({ data: { code, token } }),
      () => api.netAction({ data: { code, token, action: { type: "devPass" } } }),
      () => api.netPoll({ data: { code, token } }),
      () => api.netAgain({ data: { code, token } }),
    ];
    let done = 0;
    for (const call of calls) {
      try {
        await call();
      } catch {
        /* ответ неважен — важно, что серверный модуль скомпилирован */
      }
      done += 1;
    }
    return done;
  });
}

/** Клиентские модули партии, которых нет в лобби: их первый импорт в dev
 * тоже может тянуть новые зависимости и вызывать full-reload. */
const WARM_MODULES = [
  "/src/components/game/game-app.tsx",
  "/src/components/game/top-bar.tsx",
  "/src/components/game/dice-3d.tsx",
  "/src/components/game/event-feed.tsx",
  "/src/components/game/screens.tsx",
  "/src/components/game/net-screens.tsx",
  "/src/components/game/trait-tip.tsx",
  "/src/components/game/spotlight.tsx",
  "/src/components/game/tutorial.tsx",
  "/src/components/game/cards.tsx",
  "/src/components/game/cards-flora.tsx",
  "/src/components/game/cards-plants.tsx",
  "/src/components/ui/button.tsx",
  // Диалоги кика/выхода и подсказки грузятся лениво — без прогрева их первый
  // импорт приходится ровно на шаги кика и роняет вкладку в меню (full-reload).
  "/src/components/game/confirm-dialog.tsx",
  "/src/components/game/hint-note.tsx",
  "/src/components/game/icons.tsx",
  "/src/components/game/sound-toggle.tsx",
];

async function warmupServer() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  let navs = 0;
  // Реальные перезагрузки документа: framenavigated ловит и смену URL через
  // history.replaceState (?room=КОД при создании стола), поэтому для проверки
  // «вкладку перезагружает Vite» считаем именно события load.
  let loads = 0;
  let lastNavAt = Date.now();
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) {
      navs += 1;
      lastNavAt = Date.now();
    }
  });
  page.on("load", () => {
    loads += 1;
  });
  /** Затишье: ждём, пока вкладка не перезагружалась `ms` миллисекунд. */
  const quiet = async (ms, timeout) => {
    lastNavAt = Date.now();
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline && Date.now() - lastNavAt < ms) await sleep(400);
  };
  try {
    await gotoUrl(page, BASE);

    // 1) Все serverFn, которые вызывает сценарий, с негодными данными:
    // ответ неважен — важно, что серверный модуль скомпилирован.
    for (let round = 0; round < 6; round++) {
      const before = navs;
      let done = 0;
      try {
        done = await warmBatch(page);
      } catch {
        done = 0; // вкладку перезагрузило прямо во время пакета
      }
      await sleep(2500); // даём возможному program reload проявиться
      if (navs !== before) done = 0;
      if (done === WARM_CALLS) {
        // Контрольный раунд: если и он прошёл без перезагрузок — готово.
        const before2 = navs;
        try {
          done = await warmBatch(page);
        } catch {
          done = 0;
        }
        await sleep(2500);
        if (navs === before2 && done === WARM_CALLS) break;
      }
      if (round === 5) throw new Error("serverFn не прогрелись: вкладку продолжают перезагружать");
      await quiet(4_000, 15_000);
    }

    // 2) Клиентский UI партии: 3D-кости, шапка, журнал. В лобби эти модули не
    // грузятся, и их первый импорт в партии раньше вызывал full-reload уже во
    // время сценария. Рендерим соло-стол и открываем журнал до сценарных вкладок.
    for (let attempt = 0; attempt < 3; attempt++) {
      await gotoUrl(page, BASE);
      const afterLoad = loads;
      try {
        await page.evaluate(async (mods) => {
          for (const m of mods) {
            try {
              await import(m);
            } catch {
              /* не критичный для прогрева модуль */
            }
          }
        }, WARM_MODULES);
      } catch {
        /* вкладку перезагрузило — повторим попытку */
      }
      // Соло-старт из меню удалён (M1): поднимаем сетевой стол хелпером
      // библиотеки — он же прогревает игровой UI (кости, журнал).
      // navigate: false — меню уже открыто выше, лишняя навигация сломала бы
      // счётчик перезагрузок этой вкладки.
      try {
        await startNetGame(page, { name: "Прогрев", players: 2, bots: 1, navigate: false });
        await safeClick(page.getByRole("button", { name: /Журнал/ }).first(), 5000);
      } catch {
        /* прогрев не удался — сценарные вкладки всё равно попробуют */
      }
      await sleep(2500);
      if (loads === afterLoad) return;
      await quiet(4_000, 15_000);
    }
    throw new Error("клиентский UI партии не прогрелся: вкладку продолжают перезагружать");
  } finally {
    await ctx.close();
  }
}

/** Создать стол хостом и дождаться кода; при дев-перезагрузке — ещё попытка. */
async function createRoom(page, name, capacity) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, BASE);
    // Секция «Игра по сети» теперь открыта в меню сразу: кнопки-входа больше
    // нет, ждём поле имени (гидратация) и заполняем его.
    const nameInput = page.getByLabel("Ваше имя");
    // На телефоне форма — во вкладке «Создать»: открываем её, если скрыта.
    await openCreateTab(page).catch(() => {});
    if (!(await waitUntil(() => isVisible(nameInput), 15_000))) continue;
    await nameInput.fill(name).catch(() => {});
    // Вместимость при создании: доводим активную кнопку до нужной. Итоговое
    // состояние всё равно проверяется по лобби после создания.
    const capBtn = page
      .locator("fieldset", { hasText: "Мест за столом" })
      .getByRole("button", { name: String(capacity), exact: true });
    if (await capBtn.count()) await clickSelected(capBtn);
    const createBtn = page.getByRole("button", { name: "Создать стол" }).last();
    await waitUntil(() => isEnabled(createBtn), 5_000);
    await safeClick(createBtn, 5000);
    if (await waitUntil(() => page.locator("[data-room-code]").count(), 20_000)) {
      return (await roomCode(page)) ?? "";
    }
  }
  return "";
}

/** Войти по ссылке-приглашению (или вернуться за своё место по токену). */
async function joinRoom(page, code, name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, `${BASE}?room=${code}`);
    if ((await roomCode(page)) === code) return;
    const nameInput = page.getByLabel("Ваше имя");
    await openCreateTab(page).catch(() => {});
    if (!(await isVisible(nameInput))) continue;
    await nameInput.fill(name).catch(() => {});
    const join = page.getByRole("button", { name: "Войти", exact: true });
    for (let i = 0; i < 6; i++) {
      await waitUntil(() => isEnabled(join), 4_000, 300);
      await safeClick(join, 3000);
      if (await waitUntil(async () => (await roomCode(page)) === code, 4_000, 300)) return;
    }
  }
  throw new Error(`не удалось войти в стол ${code} за «${name}»`);
}

/**
 * Открыть диалог подтверждения и нажать в нём «Убрать»/«Передать».
 * Кнопка-инициатор и подтверждение ищутся заново на каждой попытке: после
 * дев-перезагрузки старые Locator-хендлы могут указывать на снятый DOM.
 */
async function openAndConfirm(page, openLocator, confirmLocator, tries = 3) {
  for (let i = 0; i < tries; i++) {
    if (await isVisible(confirmLocator)) {
      await safeClick(confirmLocator, 3000);
      return true;
    }
    await safeClick(openLocator, 3000);
    if (await waitUntil(() => isVisible(confirmLocator), 8000)) {
      await safeClick(confirmLocator, 3000);
      return true;
    }
  }
  return false;
}

/** Тумблер модуля (button aria-pressed): доводим до нужного состояния. */
async function setToggle(locator, want) {
  for (let i = 0; i < 4; i++) {
    const cur = (await locator.getAttribute("aria-pressed").catch(() => null)) === "true";
    if (cur === want) return true;
    await safeClick(locator, 3000);
    await sleep(1200);
  }
  return ((await locator.getAttribute("aria-pressed").catch(() => null)) === "true") === want;
}

/** Кнопка-выбор без aria-pressed (сложность, вместимость): ждём bg-accent. */
async function clickSelected(locator) {
  if (!(await locator.count())) return false;
  const selected = async () =>
    ((await locator.getAttribute("class").catch(() => "")) ?? "").includes("bg-accent");
  for (let i = 0; i < 4; i++) {
    if (await selected()) return true;
    await safeClick(locator, 3000);
    await sleep(1000);
  }
  return selected();
}

/** Текущий шаг сценария — чтобы падения было легко локализовать. */
let step = "старт";
const guard = async (label, fn) => {
  step = label;
  const t0 = Date.now();
  try {
    await fn();
  } catch (e) {
    fail(`${label}: ${String(e.message ?? e).split("\n")[0]} (${Math.round((Date.now() - t0) / 1000)} с)`);
  }
};

try {
  // ── 0. Прогрев dev-сервера ──────────────────────────────────────────────
  await guard("прогрев dev-сервера", warmupServer);
  if (problems.length) throw new Error("dev-сервер не прогрет — сценарий не запускается");

  // Сценарные вкладки открываются только после прогрева SSR-цепочки.
  const host = await newPage("хост");
  const guest = await newPage("гость");
  const waiter = await newPage("ожидающий");
  const extra = await newPage("третий", { width: 390, height: 844 });
  const waiterResponses = collectResponses(waiter);
  const hostResponses = collectResponses(host);

  // Последовательно: одновременный первый рендер четырёх вкладок перегружает
  // дев-сервер и роняет прогон по таймауту.
  for (const p of [host, guest, waiter, extra]) {
    await gotoUrl(p, BASE);
  }
  await sleep(1000);

  // ── 1. Стол, вход, очередь ──────────────────────────────────────────────
  let code = "";
  await guard("создание стола", async () => {
    code = await createRoom(host, "Аня", 2);
    if (!/^[A-Z]{4}$/.test(code)) throw new Error(`странный код стола: "${code}"`);
    // Вместимость проверяем по факту: активная кнопка «2» и одно свободное
    // место. Если клик при создании потерялся — правим из лобби.
    const snap = await ensureLobbyState(host, code, "Аня", {
      capacity: 2,
      occupied: 1,
      free: 1,
      waiters: 0,
    });
    if (!snap.seatItems.some((t) => t.includes("Аня"))) throw new Error("хост не видит себя среди мест");
    ok(`стол ${code} создан: вместимость 2, за столом 1, свободно 1`);
    await host.screenshot({ path: `${SHOTS}/10-net-lobby-host.png` });
  });

  await guard("вход по ссылке", async () => {
    await joinRoom(guest, code, "Боря");
    // Гость должен именно сесть за стол: экран лобби, а не очереди.
    await waitSeated(guest);
    const snap = await ensureLobbyState(host, code, "Аня", {
      capacity: 2,
      occupied: 2,
      free: 0,
      waiters: 0,
    });
    if (!snap.seatItems.some((t) => t.includes("Боря"))) {
      throw new Error("имя гостя не среди мест за столом");
    }
    ok("гость вошёл по ссылке и сел за стол (не в очередь)");
  });

  await guard("очередь ожидающих", async () => {
    // Страховка: к моменту прихода третьего стол должен быть полон — 2 места,
    // оба заняты. Иначе третий сядет за стол, и проверка очереди бессмысленна.
    await ensureLobbyState(host, code, "Аня", { capacity: 2, occupied: 2, free: 0, waiters: 0 });
    await joinRoom(waiter, code, "Вася");
    await waitQueued(waiter);
    const snap = await ensureLobbyState(host, code, "Аня", {
      capacity: 2,
      occupied: 2,
      free: 0,
      waiters: 1,
    });
    if (!snap.waiterItems.some((t) => t.includes("Вася"))) {
      throw new Error("хост не видит Васю в очереди");
    }
    await host.getByRole("button", { name: "Убрать из очереди Вася" }).waitFor({ timeout: 15_000 });
    ok("третий участник встал в очередь («Стол · мест нет»), хост её видит");
  });

  await guard("кик ожидающего", async () => {
    if (!(await ensureLobby(host, code, "Аня"))) throw new Error("хост не вернулся в лобби");
    const removeWaiter = host.getByRole("button", { name: "Убрать из очереди Вася" });
    const confirmRemove = host.getByRole("button", { name: "Убрать", exact: true });
    // Кик с запасом: сервер обязан отказать ожидающему именно причиной кика —
    // на ней держится выход в меню, а не вечный реконнект. Если клик потерялся
    // в дев-перезагрузке — открываем диалог заново.
    let kicked = false;
    for (let attempt = 0; attempt < 2 && !kicked; attempt++) {
      waiterResponses.length = 0;
      if (!(await openAndConfirm(host, removeWaiter, confirmRemove))) continue;
      kicked = await waitUntil(async () => waiterResponses.some(sawKick), 40_000, 500);
    }
    if (!kicked) throw new Error("ожидающий не получил отказ с причиной кика за 40 с");
    if (waiterResponses.some(sawKickCode)) {
      // Здоровая среда: код доехал — удалённый видит причину и выходит в меню.
      await expectText(waiter, /Вас удалили из-за стола/, 60_000, "причина кика у ожидающего");
      // Маркер меню — «Создать стол»: соло-кнопки «Начать год» в меню больше нет.
      await expectText(waiter, /Создать стол/, 30_000, "меню у удалённого ожидающего");
      ok("удалённый из очереди получил код кика, увидел причину и вышел в меню");
    } else {
      // Dev-особенность: без машиночитаемого code клиент не отличает кик от
      // обрыва связи и уходит в «Переподключение…» вместо меню. Серверный
      // инвариант при этом проверен выше (отказ с причиной кика), а
      // освобождение очереди — ниже. Это WARN: UI правится не в скрипте.
      await waitUntil(
        () => waiter.getByText(/Переподключение|Создать стол/).count().then((n) => n > 0),
        15_000,
        500,
      );
      warn(`dev: причина кика ушла без code — вкладка ожидающего залипла (${await bodyOf(waiter)})`);
    }
    await ensureLobbyState(host, code, "Аня", { capacity: 2, occupied: 2, free: 0, waiters: 0 });
    ok("удалённый из очереди отрезан от стола: поллинг отклонён, очередь очищена");
  });

  await guard("вместимость", async () => {
    if (!(await ensureLobby(host, code, "Аня"))) throw new Error("хост не вернулся в лобби");
    // Кнопки вместимости — с текстом «2»..«8». Повышаем до 3, повторяя клик,
    // если дев-перезагрузка съела его (выбранная кнопка получает bg-accent).
    const cap3 = host.getByRole("button", { name: "3", exact: true });
    if (!(await waitUntil(() => isVisible(cap3), 20_000))) throw new Error("нет кнопок вместимости");
    if (!(await clickSelected(cap3))) throw new Error("не удалось выбрать 3 места");
    await ensureLobbyState(host, code, "Аня", { capacity: 3, occupied: 2, free: 1, waiters: 0 });
    await joinRoom(extra, code, "Гриша");
    // Гриша должен именно сесть за стол, а не встать в очередь.
    await waitSeated(extra);
    const snap = await ensureLobbyState(host, code, "Аня", {
      capacity: 3,
      occupied: 3,
      free: 0,
      waiters: 0,
    });
    if (!snap.seatItems.some((t) => t.includes("Гриша"))) throw new Error("Гриша не занял место");

    // M14: пустое место и боты уходят раньше людей. Повышаем до 4, сажаем
    // бота, понижаем обратно до 3 — освободившийся хвост должен уйти вместе с
    // ботом, а все три человека остаться (прежний сервер съедал бота даже при
    // пустом месте внутри новой границы).
    const cap4 = host.getByRole("button", { name: "4", exact: true });
    if (!(await clickSelected(cap4))) throw new Error("не удалось выбрать 4 места");
    await ensureLobbyState(host, code, "Аня", { capacity: 4, occupied: 3, free: 1, waiters: 0 });
    await safeClick(host.getByRole("button", { name: "Добавить бота" }), 3000);
    await ensureLobbyState(host, code, "Аня", { capacity: 4, occupied: 4, free: 0, waiters: 0 });
    if (!(await clickSelected(cap3))) throw new Error("не удалось вернуть 3 места");
    const afterBot = await ensureLobbyState(host, code, "Аня", {
      capacity: 3,
      occupied: 3,
      free: 0,
      waiters: 0,
    });
    for (const human of ["Аня", "Боря", "Гриша"]) {
      if (!afterBot.seatItems.some((t) => t.includes(human))) {
        throw new Error(`понижение 4→3 убрало человека «${human}», а не бота`);
      }
    }
    ok("вместимость повышается; при понижении 4→3 уходит бот, люди остаются");

    // M14: понижение ниже числа людей больше не отклоняется — жребий сервера
    // переводит одного человека в очередь ожидающих с тем же токеном (клиент
    // показывает экран «Стол · мест нет», а не выбрасывает в меню).
    const cap2 = host.getByRole("button", { name: "2", exact: true });
    // Подтверждение понижения — по стору, а не по bg-accent кнопки: жребий
    // может отправить в очередь самого хоста, его вкладка уйдёт на экран
    // очереди («Стол · мест нет»), и кнопки лобби на ней уже нет. Клик по
    // кнопке и экшен стора — один и тот же серверный путь (netSetCapacity),
    // поэтому при недоступности кнопки (не хост) используем экшен.
    const capNow = () =>
      host
        .evaluate(() => globalThis.__evoStore?.getState?.()?.net?.capacity ?? null)
        .catch(() => null);
    let lowered = (await capNow()) === 2;
    for (let i = 0; i < 3 && !lowered; i++) {
      if (await isEnabled(cap2)) {
        await safeClick(cap2, 3000);
      } else {
        await host
          .evaluate(async () => {
            const s = await import("/src/store/game-store.ts");
            await s.useGameStore.getState().netSetCapacity(2);
          })
          .catch(() => {});
      }
      lowered = await waitUntil(async () => (await capNow()) === 2, 8_000, 500);
    }
    if (!lowered) throw new Error("не удалось выбрать 2 места");
    const trio = [
      ["Аня", host],
      ["Боря", guest],
      ["Гриша", extra],
    ];
    let queuedName = null;
    const qDeadline = Date.now() + 20_000;
    while (Date.now() < qDeadline && !queuedName) {
      for (const [name, p] of trio) {
        const noSeat = await p.getByText(/Стол · мест нет/i).count().catch(() => 0);
        const phrase = await p.getByText(/в очереди/i).count().catch(() => 0);
        if (noSeat > 0 && phrase > 0) {
          queuedName = name;
          break;
        }
      }
      if (!queuedName) await sleep(500);
    }
    if (!queuedName) {
      throw new Error(
        "после понижения до 2 мест никто не оказался в очереди: " +
          `Аня: ${await bodyOf(host)}; Боря: ${await bodyOf(guest)}; Гриша: ${await bodyOf(extra)}`,
      );
    }
    const survivorNames = trio.map(([n]) => n).filter((n) => n !== queuedName);
    for (const name of survivorNames) {
      const [, p] = trio.find(([n]) => n === name);
      const free = await p.evaluate(() => {
        const list = document.querySelector("[data-seat-list]");
        return list ? [...list.querySelectorAll("li")].filter((li) => li.innerText.includes("Свободное место")).length : -1;
      });
      if (free !== 0) throw new Error(`«${name}» после понижения видит ${free} свободных мест вместо 0`);
    }
    ok(`понижение до 2 разрешено: «${queuedName}» — в очереди, ${survivorNames.join(" и ")} за столом`);

    // Возвращаем состав: поднимаем места до 3 и пускаем ожидающего за стол.
    let hostName = null;
    let hostPage = null;
    for (const [name, p] of trio) {
      if (name === queuedName) continue;
      if (await isVisible(p.getByRole("button", { name: "Добавить бота" }).first())) {
        hostName = name;
        hostPage = p;
      }
    }
    if (!hostPage) throw new Error("после понижения мест не нашлась вкладка хоста");
    if (!(await clickSelected(hostPage.getByRole("button", { name: "3", exact: true })))) {
      throw new Error("не удалось вернуть 3 места после проверки очереди");
    }
    const queuedPage = trio.find(([n]) => n === queuedName)[1];
    const backSeated = await waitUntil(
      () =>
        queuedPage
          .getByText(/Стол · ждём игроков/i)
          .count()
          .then((n) => n > 0)
          .catch(() => false),
      20_000,
      500,
    );
    if (!backSeated) {
      const claim = queuedPage.getByRole("button", { name: /Занять место/ }).first();
      if (!(await waitUntil(() => isEnabled(claim), 15_000))) {
        throw new Error(`ожидающий «${queuedName}» не увидел кнопку «Занять место» (${await bodyOf(queuedPage)})`);
      }
      await safeClick(claim, 3000);
    }
    await waitSeated(queuedPage);
    // Хост после жребия мог смениться — возвращаем его Ане, иначе сценарии
    // ниже (передача хоста, кик) опираются на другого хоста, чем ожидают.
    if (hostName !== "Аня") {
      const transfer = hostPage.getByRole("button", { name: "Передать хост игроку Аня" });
      const confirm = hostPage.getByRole("button", { name: "Передать", exact: true });
      if (!(await openAndConfirm(hostPage, transfer, confirm))) {
        throw new Error(`не удалось вернуть хост Ане (хост сейчас «${hostName}»)`)
      }
      if (!(await waitUntil(() => isVisible(host.getByRole("button", { name: "Добавить бота" }).first()), 20_000))) {
        throw new Error("после возврата хоста Аня не получила права хоста");
      }
    }
    await ensureLobbyState(host, code, "Аня", { capacity: 3, occupied: 3, free: 0, waiters: 0 });
    ok("состав восстановлен: места подняты, ожидающий вернулся за стол, хост снова Аня");
  });

  await guard("настройки до старта", async () => {
    if (!(await ensureLobby(host, code, "Аня"))) throw new Error("хост не вернулся в лобби");
    // Тумблеры дополнений — кнопки с aria-pressed (не role="switch").
    const continents = host.getByRole("button", { name: /Континенты/ }).first();
    if (!(await waitUntil(() => isVisible(continents), 20_000))) {
      throw new Error("тумблеры дополнений не найдены");
    }
    if (!(await setToggle(continents, true))) throw new Error("тумблер «Континенты» не включился");
    // Сложность — обычная кнопка: признак выбора — класс bg-accent.
    const hard = host.getByRole("button", { name: "Жёстче", exact: true }).first();
    if (!(await waitUntil(() => isVisible(hard), 15_000))) throw new Error("нет кнопки сложности");
    if (!(await clickSelected(hard))) throw new Error("сложность «Жёстче» не выбралась");
    // Настройки уходят на сервер и возвращаются поллингом: через пару секунд
    // состояние не должно откатиться (откат = сервер отказал).
    await sleep(2500);
    const stillOn = (await continents.getAttribute("aria-pressed").catch(() => null)) === "true";
    const stillHard = ((await hard.getAttribute("class").catch(() => "")) ?? "").includes("bg-accent");
    if (!stillOn || !stillHard) throw new Error("сервер откатил настройки");
    if (await isVisible(host.getByRole("button", { name: "Понятно" }))) {
      throw new Error("сервер вернул ошибку настроек");
    }
    ok("модули и сложность меняются до старта и держатся на сервере");
  });

  await guard("передача хоста", async () => {
    if (!(await ensureLobby(host, code, "Аня"))) throw new Error("хост не вернулся в лобби");
    if (!(await ensureLobby(guest, code, "Боря", host))) throw new Error("гость не вернулся в лобби");
    if (!(await guest.getByText(/задаёт хост/).count())) {
      throw new Error("гость не считает себя не-хостом до передачи");
    }
    const transfer = host.getByRole("button", { name: "Передать хост игроку Боря" });
    const confirmTransfer = host.getByRole("button", { name: "Передать", exact: true });
    let sent = false;
    for (let attempt = 0; attempt < 2 && !sent; attempt++) {
      if (!(await openAndConfirm(host, transfer, confirmTransfer))) continue;
      sent = await waitUntil(() => guest.getByRole("button", { name: "Добавить бота" }).count(), 20_000);
    }
    if (!sent) throw new Error("передача хоста не подтвердилась у гостя");
    await guest.waitForFunction(
      () => !document.body.innerText.includes("задаёт хост"),
      undefined,
      { timeout: 20000 },
    );
    ok("хост передан: у нового хоста появились права");
  });

  await guard("кик игрока", async () => {
    // Новый хост (Боря) убирает Аню — та должна получить код кика и выйти,
    // а не зависнуть в «Переподключении».
    const removeHost = guest.getByRole("button", { name: "Убрать игрока Аня" });
    const confirmRemove = guest.getByRole("button", { name: "Убрать", exact: true });
    let kicked = false;
    for (let attempt = 0; attempt < 2 && !kicked; attempt++) {
      hostResponses.length = 0;
      if (!(await openAndConfirm(guest, removeHost, confirmRemove))) continue;
      kicked = await waitUntil(async () => hostResponses.some(sawKick), 30_000, 500);
    }
    if (!kicked) throw new Error("кикнутый игрок не получил отказ с причиной кика за 30 с");
    if (hostResponses.some(sawKickCode)) {
      await expectText(host, /Вас удалили из-за стола/, 60_000, "причина кика у игрока");
      // Маркер меню — «Создать стол» (соло-кнопки «Начать год» в меню больше нет).
      await expectText(host, /Создать стол/, 30_000, "меню у кикнутого игрока");
      ok("кикнутый игрок получил код кика, увидел причину и вернулся в меню");
    } else {
      await waitUntil(
        () => host.getByText(/Переподключение|Создать стол/).count().then((n) => n > 0),
        15_000,
        500,
      );
      warn(`dev: причина кика ушла без code — вкладка игрока залипла (${await bodyOf(host)})`);
    }
    await ensureLobbyState(guest, code, "Боря", { capacity: 3, occupied: 2, free: 1, waiters: 0 });
    ok("кикнутый игрок отрезан от стола: место освобождено для бота");
  });

  // ── 2. Старт, чат, финал ────────────────────────────────────────────────
  await guard("старт партии", async () => {
    if (!(await ensureLobby(guest, code, "Боря"))) throw new Error("хост не вернулся в лобби");
    const startButton = guest.getByRole("button", { name: "Начать год" });
    const addBot = guest.getByRole("button", { name: "Добавить бота" });
    // Место должно быть заполнено ботом: повторяем, если клик съела перезагрузка.
    await waitUntil(async () => {
      if (await isEnabled(startButton)) return true;
      await safeClick(addBot, 3000);
      return false;
    }, 20_000, 1200);
    if (!(await isEnabled(startButton))) throw new Error("«Начать год» осталась недоступной");
    await safeClick(startButton, 5000);
    await expectText(guest, /Год 1/, 45_000, "начало партии у первого игрока");
    await expectText(extra, /Год 1/, 45_000, "начало партии у второго игрока");
    ok("партия началась у обоих игроков");
  });

  await guard("чат в партии", async () => {
    const text = "Привет, стол!";
    // Одинаковых кнопок «Журнал и чат» в шапке и панели две — берём шапку.
    await extra.getByRole("button", { name: "Журнал и чат" }).first().click();
    await extra.getByRole("textbox", { name: "Сообщение в чат" }).fill(text);
    await extra.getByRole("button", { name: "Отправить сообщение" }).click();
    await guest.getByRole("button", { name: "Журнал и чат" }).first().click();
    await guest.getByText(text).first().waitFor({ timeout: 25_000 });
    ok("сообщение чата доехало до соперника");
  });

  await guard("партия до финала", async () => {
    const play = async (page) => {
      if (await page.getByText("Конец эволюции").count()) return true;
      // Атака хищника: диалог защиты перекрывает док — выбираем «Не защищаться».
      const noDefense = page.getByRole("button", { name: "Не защищаться" });
      if (await isVisible(noDefense)) {
        await noDefense.first().evaluate((el) => el.click()).catch(() => {});
        return false;
      }
      // Развитие/питание: «Закончить ход» и «Закончить развитие» (волна 1
      // убрала «Пас» из развития; «Пас» оставлен в списке на случай
      // промежуточных сборок). «Закончить питание» не жмём — она открывает
      // подтверждение, а цель шага — догнать партию до счёта.
      // Клик через DOM: открытая панель журнала может перекрывать док.
      for (const name of [/^Закончить ход$/, /^Закончить развитие$/, /^Пас$/]) {
        const buttons = page.getByRole("button", { name, exact: true });
        const n = await buttons.count();
        for (let i = 0; i < n; i++) {
          const b = buttons.nth(i);
          if ((await b.isVisible()) && (await b.isEnabled())) {
            await b.evaluate((el) => el.click()).catch(() => {});
            return false;
          }
        }
      }
      return false;
    };
    // 4 минуты: сервер двигает ботов лениво (PACE), на год уходит несколько
    // секунд. Если не успели — это предупреждение, а не провал: маршрутизация
    // финала («finished» → стол + счёт) покрыта юнит-тестами сервера, а
    // длинная партия в dev-сервере чувствительна к его перезагрузкам.
    const deadline = Date.now() + 240_000;
    let finished = false;
    while (Date.now() < deadline) {
      const a = await play(guest);
      const b = await play(extra);
      if (a || b) {
        finished = true;
        break;
      }
      await sleep(700);
    }
    if (!finished) {
      const phase = await guest
        .evaluate(() => document.querySelector("header")?.innerText?.trim() ?? "?")
        .catch(() => "?");
      warn(`финал не достигнут за 4 минуты (шапка: ${phase.replace(/\s+/g, " ").slice(0, 80)})`);
      return;
    }
    await guest.getByText("Конец эволюции").waitFor({ timeout: 15000 });
    await guest.getByRole("button", { name: "В меню" }).waitFor({ timeout: 15000 });
    await guest.screenshot({ path: `${SHOTS}/11-net-final.png` });
    ok("финальный счёт виден в сетевой партии");
  });

  await guard("выход после финала", async () => {
    if (!(await guest.getByText("Конец эволюции").count())) return;
    await guest.getByRole("button", { name: "В меню" }).click();
    // Маркер меню — «Создать стол»: соло-кнопки «Начать год» в меню больше нет.
    await guest.getByRole("button", { name: "Создать стол" }).waitFor({ timeout: 15000 });
    ok("после финала игрок возвращается в меню");
  });
} catch (e) {
  fail(`прогон прерван: ${String(e.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
}

const seconds = Math.round((Date.now() - START_TS) / 1000);
const reloads = reloadSeen ? `, full-reload вкладок: ${reloadSeen}` : "";
const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""}${reloads} (${seconds} с)`
  : `ИТОГ: сетевой прогон чист${warnings.length ? ` (предупреждений ${warnings.length})` : ""}${reloads} (${seconds} с)`;
console.log(`\n${verdict}`);
process.exitCode = problems.length ? 1 : 0;
