/**
 * QA зрительского флоу (фича «зрители и реакции»). Запускать при живом
 * dev-сервере: node scripts/qa-net-spectate.mjs
 *
 * Сценарий: хост создаёт сетевой стол и заполняет места ботами; второй
 * браузерный контекст входит зрителем через кнопку «Смотреть» (меню —
 * без перехода на ?room=, потому что такой переход при неудачном resume
 * способен зациклить вкладку, см. баг №1 в отчёте). Дальше проверяются:
 * read-only стол, пузырь реакции и звук, инкрементальная доставка реакций
 * в поллинге (без повторов), рейт-лимит 700 мс, F5 зрителя и выход в меню.
 *
 * Устойчивость к дев-серверу: прогрев SSR-цепочки и клиентских модулей до
 * сценарных вкладок (qa-net-lobby), ретраи кликов до гидратации, обязательные
 * таймауты на каждый evaluate (зависшая вкладка не должна вешать прогон) и
 * общий сторож на 10 минут. Скриншоты пишутся сначала во временный каталог:
 * свежий PNG внутри проекта Tailwind в dev принимает за изменение контента
 * и шлёт full-reload, который перезагружает вкладки посреди сценария.
 */
import { copyFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
const SHOTS_TMP = join(tmpdir(), "evo-qa-spectate");
// Куда копировать итоговые снимки: по умолчанию %TEMP% вне репозитория
// (PNG в проекте дёргал Tailwind в dev и шлёт full-reload). Переопределяется
// переменной EVO_SHOTS.
const SHOTS_OUT = process.env.EVO_SHOTS ?? join(tmpdir(), "evo-qa-shots");
mkdirSync(SHOTS_TMP, { recursive: true });
mkdirSync(SHOTS_OUT, { recursive: true });
// Временный каталог живёт между прогонами: чистим старые кадры, чтобы в
// screenshots/ копировались только скриншоты этого запуска.
for (const f of readdirSync(SHOTS_TMP)) {
  if (f.startsWith("qa-spectate-") && f.endsWith(".png")) rmSync(join(SHOTS_TMP, f), { force: true });
}

const problems = [];
const warnings = [];
const findings = [];
const consoleErrors = [];
const verdicts = [];
const START_TS = Date.now();
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
/** Вердикт отдельного пункта задания. */
const pass = (id, msg) => {
  console.log(`PASS ${id}: [${rel()}] ${msg}`);
  verdicts.push({ id, ok: true, msg });
};
const checkFail = (id, msg) => {
  console.log(`FAIL ${id}: [${rel()}] ${msg}`);
  verdicts.push({ id, ok: false, msg });
  problems.push(`пункт ${id}: ${msg}`);
};
/** Найденный баг продукта (в src/** не правим — только описываем). */
const bug = (msg) => {
  console.log(`БАГ: [${rel()}] ${msg}`);
  findings.push(msg);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Сторож: если вкладка зависла в бесконечном цикле, выходим с диагнозом. */
const WATCHDOG_MS = 10 * 60 * 1000;
const watchdog = setTimeout(() => {
  console.log(
    `\nFAIL: сценарий не завершился за ${WATCHDOG_MS / 1000} с — вкладка, вероятно, зависла ` +
      `(последний шаг: ${lastStep})`,
  );
  process.exit(2);
}, WATCHDOG_MS);
watchdog.unref?.();

let lastStep = "старт";

/** Жёсткий таймаут на любое обещание Playwright: зависший evaluate не вешает прогон. */
const race = (p, ms, label = "операция") =>
  Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`${label}: нет ответа за ${ms} мс`)), ms)),
  ]);
const safeEval = (page, fn, arg, ms = 8000) => race(page.evaluate(fn, arg), ms, "evaluate");

const browser = await chromium.launch();
let reloadSeen = 0;

function track(page, label) {
  page.on("pageerror", (e) => fail(`${label}: PAGEERROR ${e.message.split("\n")[0].slice(0, 200)}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // Шум дев-окружения: grok-расширение, vite-клиент, favicon.
    if (/NotSameOrigin|favicon|grok\.com|\[vite\]/i.test(t)) return;
    consoleErrors.push(`${label}: ${t.slice(0, 200)}`);
  });
  // Полная перезагрузка вкладки (dev full-reload) рвёт сессию: считаем и
  // предупреждаем, чтобы флаки сервера были видны в отчёте.
  page.on("websocket", (ws) => {
    ws.on("framereceived", (f) => {
      if (!String(f.payload).includes("full-reload")) return;
      reloadSeen += 1;
      if (reloadSeen === 1) warn("dev-сервер перезагружает вкладки (full-reload) — счётчик в сводке");
    });
  });
}

async function newPage(label, viewport = { width: 1280, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  track(page, label);
  return page;
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

/** Клик из DOM: пузырь/док может перекрываться оверлеями, а хендлер — тот же. */
async function domClick(loc) {
  try {
    await loc.first().evaluate((el) => el.click());
    return true;
  } catch {
    return false;
  }
}

/** Ждём выполнения проверки; каждая проверка ограничена по времени. */
async function waitUntil(check, timeout, interval = 500) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      if (await race(Promise.resolve(check()), 5000, "проверка")) return true;
    } catch {
      /* проверка не удалась или вкладка не ответила — подождём ещё */
    }
    await sleep(interval);
  }
  try {
    return !!(await race(Promise.resolve(check()), 5000, "проверка"));
  } catch {
    return false;
  }
}

/** Переход с ожиданием разметки; networkidle не годится: у стола вечный поллинг. */
async function gotoUrl(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 }).catch(async () => {
    await page.goto(url, { waitUntil: "commit", timeout: 30_000 }).catch(() => {});
  });
}

/** Короткий текст экрана — для сообщений о падении. */
async function bodyOf(page) {
  return (
    (await safeEval(page, () => document.body.innerText.replace(/\s+/g, " ").slice(0, 220)).catch(
      () => "вкладка не отвечает",
    )) ?? "?"
  );
}

async function screenshot(page, name) {
  try {
    await race(page.screenshot({ path: join(SHOTS_TMP, name), timeout: 10_000 }), 12_000, "скриншот");
    ok(`скриншот ${name}`);
  } catch (e) {
    warn(`не удалось снять ${name}: ${String(e.message ?? e).split("\n")[0]}`);
  }
}

/** Секция «Игра по сети» открыта в меню сразу (кнопки-входа больше нет). */
async function openNetMenu(page) {
  const nameInput = page.getByLabel("Ваше имя");
  return waitUntil(() => isVisible(nameInput), 25_000);
}

/** Создать стол и вернуть код комнаты; при дев-перезагрузке — ещё попытка. */
async function createRoom(page, name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, BASE);
    if (!(await openNetMenu(page))) continue;
    const nameInput = page.getByLabel("Ваше имя");
    const createBtn = page.getByRole("button", { name: "Создать стол" }).last();
    // Fill по недогидратированной SSR-разметке ставит DOM-значение, но React
    // его не видит (input-event повисает) — кнопка остаётся disabled. Поэтому
    // гейт — активность кнопки: перезаполняем имя, пока она не оживёт.
    let ready = false;
    for (let i = 0; i < 12 && !ready; i++) {
      await nameInput.fill(name, { timeout: 3000 }).catch(() => {});
      ready = await isEnabled(createBtn);
      if (!ready) await sleep(700);
    }
    if (!ready) continue;
    await safeClick(createBtn, 5000);
    if (await waitUntil(() => page.locator("[data-room-code]").count(), 25_000)) {
      return ((await page.locator("[data-room-code]").first().textContent().catch(() => "")) ?? "").trim();
    }
  }
  // Запасной путь: экшен стора — ровно тот же вызов, что делает кнопка
  // «Создать стол» (startNetCreate). Спасает от потерянных кликов по
  // недогидратированной разметке.
  await gotoUrl(page, BASE);
  if (await openNetMenu(page)) {
    const code = await safeEval(page, async (nm) => {
      const store = globalThis.__evoStore ?? (await import("/src/store/game-store.ts")).useGameStore;
      await store.getState().startNetCreate({ name: nm, capacity: 2, botSeats: 0, difficulty: "normal" });
      return store.getState().net?.code ?? null;
    }, name).catch(() => null);
    if (code && (await waitUntil(() => page.locator("[data-room-code]").count(), 20_000))) {
      return ((await page.locator("[data-room-code]").first().textContent().catch(() => "")) ?? "").trim();
    }
  }
  return "";
}

/** Заполнить свободные места ботами и начать партию (хост в лобби). */
async function startGameAsHost(page) {
  const start = page.getByRole("button", { name: "Начать год" });
  const addBot = page.getByRole("button", { name: "Добавить бота" });
  if (!(await waitUntil(() => isVisible(start), 20_000))) {
    throw new Error(`нет кнопки «Начать год»: ${await bodyOf(page)}`);
  }
  for (let i = 0; i < 8; i++) {
    if (await isEnabled(start)) break;
    if (!(await isEnabled(addBot))) break;
    await safeClick(addBot, 5000);
    await sleep(1200);
  }
  if (!(await isEnabled(start))) throw new Error(`«Начать год» недоступна: ${await bodyOf(page)}`);
  await safeClick(start, 5000);
  const started = await waitUntil(() => page.getByText(/Год 1/).count().then((n) => n > 0), 60_000, 700);
  if (!started) throw new Error(`партия не началась: ${await bodyOf(page)}`);
}

/**
 * Войти зрителем через меню (кнопка «Смотреть»). Именно этот путь и есть
 * пользовательский: переход на ?room= здесь не используется намеренно —
 * при неудачном resume он зацикливает вкладку (баг №1).
 * Возвращаем не только «получилось», но и диагноз: если токен уже выдан и
 * spectating=true, а стол так и не открылся — это залипание поллинга.
 */
async function watchRoom(page, code, name) {
  let lastBody = "";
  let navs = 0;
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) navs += 1;
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    const t0 = Date.now();
    const stage = (s) => console.log(`  зритель: попытка ${attempt + 1}, ${s} [${Math.round((Date.now() - t0) / 1000)}с]`);
    stage("открытие меню");
    await gotoUrl(page, BASE);
    if (!(await openNetMenu(page))) {
      stage("меню не открылось");
      continue;
    }
    stage("открытие формы входа");
    const joinTab = page.getByRole("button", { name: "Присоединиться к столу", exact: true });
    if (!(await waitUntil(() => isVisible(joinTab), 12_000))) {
      stage("кнопка «Присоединиться к столу» не найдена");
      continue;
    }
    // Клик по недогидратированной разметке теряется: гейт — поле «Код стола»
    // появилось (форма реально раскрыта), с повторными кликами.
    const codeInput = page.getByLabel("Код стола");
    let formOpen = false;
    for (let i = 0; i < 4 && !formOpen; i++) {
      await safeClick(joinTab, 4000);
      formOpen = await waitUntil(() => isVisible(codeInput), 5000, 400);
    }
    if (!formOpen) {
      stage("форма входа не раскрылась после кликов");
      continue;
    }
    // canJoin = имя + код из 4 символов. Fill до гидратации ставит DOM-значение,
    // но React его не видит — кнопка остаётся disabled. Гейт — активность
    // кнопки «Смотреть»: перезаполняем поля, пока она не оживёт.
    stage("заполнение кода и имени");
    const nameInput = page.getByLabel("Ваше имя");
    const watch = page.getByRole("button", { name: "Смотреть" });
    let ready = false;
    for (let i = 0; i < 12 && !ready; i++) {
      await codeInput.fill(code, { timeout: 3000 }).catch(() => {});
      await nameInput.fill(name, { timeout: 3000 }).catch(() => {});
      ready = await isEnabled(watch);
      if (!ready) await sleep(700);
    }
    if (!ready) {
      stage("кнопка «Смотреть» так и не активировалась");
      continue;
    }
    stage("кнопка «Смотреть» активна");
    const navsAtClick = navs;
    stage("клик «Смотреть»");
    await safeClick(watch, 5000);
    const attached = await waitUntil(
      () => page.getByText("Вы смотрите").count().then((n) => n > 0),
      15_000,
      700,
    );
    const reloaded = navs > navsAtClick;
    if (attached) {
      stage("зритель за столом");
      return { ok: true, reloaded };
    }
    stage("бейджа «Вы смотрите» нет — диагностика");
    lastBody = await bodyOf(page);
    const token = await safeEval(page, (c) => localStorage.getItem(`evo-watch-${c}`), code).catch(
      () => null,
    );
    const st = await netState(page);
    if (token && st?.spectating) {
      return { ok: false, stuck: true, body: lastBody, token, st, reloaded };
    }
    warn(`вход зрителем не удался (попытка ${attempt + 1}): ${lastBody}`);
  }
  return { ok: false, stuck: false, body: lastBody, reloaded: false };
}

/**
 * Аварийное возвращение в зрителя тем же токеном — ровно то, что делает F5
 * (resumeWatch запускает поллинг, в отличие от watch). Нужно, чтобы после
 * зафиксированного провала пункта 1 всё-таки проверить остальную фичу.
 */
async function reviveViewer(page, code) {
  try {
    await race(page.reload({ waitUntil: "domcontentloaded", timeout: 30_000 }), 40_000, "reload");
  } catch (e) {
    warn(`аварийный reload не завершился: ${String(e.message ?? e).split("\n")[0]}`);
    return false;
  }
  const badge = await waitUntil(
    () => page.getByText("Вы смотрите").count().then((n) => n > 0),
    30_000,
    700,
  );
  const st = await netState(page);
  const token = await safeEval(page, (c) => localStorage.getItem(`evo-watch-${c}`), code).catch(
    () => null,
  );
  return badge && st?.spectating && Boolean(token);
}

/** Снимок состояния клиента из стора — доказательство режима зрителя. */
async function netState(page) {
  return safeEval(page, async () => {
    // Живой стор приложения (game-store отдаёт его в dev как __evoStore):
    // после HMR динамический import() возвращал бы другой экземпляр модуля.
    const g = window.__evoStore ?? (await import("/src/store/game-store.ts")).useGameStore;
    const st = g.getState();
    const n = st.net;
    return {
      seat: n?.seat,
      spectating: n?.spectating,
      status: n?.status,
      code: n?.code,
      hasState: Boolean(st.state),
    };
  }).catch(() => null);
}

/**
 * Прогрев dev-сервера: первый вызов каждого serverFn компилирует SSR-модуль,
 * первый импорт клиентских модулей партии — тоже; Vite шлёт full-reload всем
 * вкладкам, и они теряют сессию. Прогоняем все нужные вызовы с негодными
 * данными (ответ неважен) и рендерим соло-стол до сценарных вкладок.
 */
const WARM_CALLS = 16;

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
      () => api.netSetCapacity({ data: { code, token, capacity: 3 } }),
      () => api.netSetSettings({ data: { code, token, settings: { difficulty: "hard" } } }),
      () => api.netRoomInfo({ data: { code, token } }),
      () => api.netLeaveQueue({ data: { code, token } }),
      () => api.netChat({ data: { code, token, text: "прогрев" } }),
      () => api.netStart({ data: { code, token } }),
      () => api.netAction({ data: { code, token, action: { type: "devPass" } } }),
      () => api.netPoll({ data: { code, token } }),
      () => api.netSpectate({ data: { code, name: "Прогрев" } }),
      () => api.netSpectatorPoll({ data: { code, token } }),
      () => api.netReaction({ data: { code, token, emoji: "👏", kind: "cheer" } }),
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
];

async function warmupServer() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  let navs = 0;
  let lastNavAt = Date.now();
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) {
      navs += 1;
      lastNavAt = Date.now();
    }
  });
  const quiet = async (ms, timeout) => {
    lastNavAt = Date.now();
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline && Date.now() - lastNavAt < ms) await sleep(400);
  };
  try {
    await gotoUrl(page, BASE);
    for (let round = 0; round < 6; round++) {
      const before = navs;
      let done = 0;
      try {
        done = await race(warmBatch(page), 30_000, "прогрев serverFn");
      } catch {
        done = 0; // вкладку перезагрузило или она не ответила
      }
      await sleep(2000);
      if (navs !== before) done = 0;
      if (done === WARM_CALLS) {
        const before2 = navs;
        try {
          done = await race(warmBatch(page), 30_000, "прогрев serverFn");
        } catch {
          done = 0;
        }
        await sleep(2000);
        if (navs === before2 && done === WARM_CALLS) break;
      }
      if (round === 5) throw new Error("serverFn не прогрелись: вкладку продолжают перезагружать");
      await quiet(3_500, 12_000);
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      await gotoUrl(page, BASE);
      const afterLoad = navs;
      try {
        await race(
          page.evaluate(async (mods) => {
            for (const m of mods) {
              try {
                await import(m);
              } catch {
                /* не критичный для прогрева модуль */
              }
            }
          }, WARM_MODULES),
          30_000,
          "прогрев модулей",
        );
      } catch {
        /* вкладку перезагрузило — повторим */
      }
      const start = page.getByRole("button", { name: "Начать год" });
      if (await waitUntil(() => isVisible(start), 10_000)) {
        await safeClick(start, 5000);
        await waitUntil(() => page.getByText(/Год 1/).count().then((n) => n > 0), 20_000);
        await safeClick(page.getByRole("button", { name: /Журнал/ }).first(), 5000);
      }
      await sleep(2000);
      if (navs === afterLoad) return;
      await quiet(3_500, 12_000);
    }
    throw new Error("клиентский UI партии не прогрелся");
  } finally {
    await ctx.close();
  }
}

// ── Диагностические помощники зрительского стола ─────────────────────────────

/** Видимые кнопки: подпись (aria-label или текст) и disabled. */
const buttonInventory = (page) =>
  safeEval(page, () =>
    [...document.querySelectorAll("button")]
      .filter((b) => b.offsetParent !== null)
      .map((b) => ({
        label: (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").trim(),
        disabled: b.disabled,
      }))
      .filter((b) => b.label),
  ).catch(() => []);

/** Логгер сетевых вызовов клиента: тела и ответы serverFn для проверок. */
async function installFetchLog(page) {
  await safeEval(page, () => {
    if (window.__evoNetCalls) return;
    window.__evoNetCalls = [];
    const orig = window.fetch;
    window.fetch = function (input, init) {
      let rec = null;
      try {
        const url = typeof input === "string" ? input : input?.url ?? "";
        const body = typeof init?.body === "string" ? init.body.slice(0, 600) : "";
        if (url.includes("_serverFn")) {
          rec = { url, body, t: Date.now(), resp: null };
          window.__evoNetCalls.push(rec);
        }
      } catch {
        /* тело недоступно */
      }
      const pr = orig.apply(this, arguments);
      if (rec) {
        pr.then((r) => r.clone().text())
          .then((t) => {
            rec.resp = t.slice(0, 500);
          })
          .catch(() => {
            /* ответ недоступен */
          });
      }
      return pr;
    };
  });
}

const clearFetchLog = (page) =>
  safeEval(page, () => {
    if (window.__evoNetCalls) window.__evoNetCalls.length = 0;
  }).catch(() => {});

/** Запросы реакций (тело содержит emoji), отправленные после момента `since`. */
const reactionCallsSince = (page, since) =>
  safeEval(
    page,
    (_t) =>
      (window.__evoNetCalls ?? [])
        .filter((c) => c.t >= since && /"emoji"/.test(c.body))
        .map((c) => ({ body: c.body, resp: c.resp ?? "" })),
    since,
  ).catch(() => null);

const netActionsSince = (page, since) =>
  safeEval(
    page,
    (t) =>
      (window.__evoNetCalls ?? []).filter((c) => c.t >= t && /"action"\s*:/.test(c.body)).length,
    since,
  ).catch(() => -1);

/** Наблюдатель пузырей реакций: фиксирует КАЖДОЕ добавление, а не текущий DOM. */
async function installBubbleObserver(page) {
  await safeEval(page, () => {
    window.__evoBubbles = [];
    if (window.__evoBubbleObs) return;
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1 && n.classList && n.classList.contains("reaction-bubble")) {
            window.__evoBubbles.push({ t: Date.now(), text: (n.textContent ?? "").trim() });
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    window.__evoBubbleObs = obs;
  });
}

const bubbles = (page) =>
  safeEval(page, () => (window.__evoBubbles ?? []).map((b) => b.text)).catch(() => null);

/** Обёртка sfx.play: доказательство звукового вызова без прослушивания. */
async function installSfxSpy(page) {
  await safeEval(page, async () => {
    const m = await import("/src/lib/sfx.ts");
    if (window.__evoSfxSpy) return;
    window.__evoSfx = [];
    const orig = m.sfx.play.bind(m.sfx);
    m.sfx.play = (id, delay, opts) => {
      window.__evoSfx.push(id);
      return orig(id, delay, opts);
    };
    window.__evoSfxSpy = true;
  });
}

const sfxCalls = (page) => safeEval(page, () => window.__evoSfx ?? []).catch(() => null);

async function clickReaction(page, emoji) {
  const btn = page.getByRole("button", { name: `Реакция ${emoji}` });
  if (await safeClick(btn, 2500)) return true;
  return domClick(btn);
}

// ── Сценарий ────────────────────────────────────────────────────────────────

try {
  // 0. Прогрев dev-сервера (не критичен, но сильно снижает флаки).
  lastStep = "прогрев dev-сервера";
  try {
    await warmupServer();
    ok("dev-сервер прогрет");
  } catch (e) {
    warn(`прогрев не удался (${String(e.message ?? e).split("\n")[0]}) — продолжаем`);
  }

  const host = await newPage("хост");
  const viewer = await newPage("зритель");
  // Последовательно: одновременный первый рендер двух вкладок перегружает дев-сервер.
  await gotoUrl(host, BASE);
  await gotoUrl(viewer, BASE);
  await sleep(800);

  // ── Пункт 1. Стол с ботом и вход зрителем кнопкой «Смотреть» ─────────────
  lastStep = "создание стола хостом";
  let code = "";
  try {
    code = await createRoom(host, "Аня");
    if (!/^[A-Z]{4}$/.test(code)) throw new Error(`странный код стола: "${code}"`);
    ok(`стол ${code} создан хостом`);
    await startGameAsHost(host);
    ok("хост заполнил стол ботами и начал партию");
    await screenshot(host, "qa-spectate-00-host.png");
  } catch (e) {
    checkFail("1", `хост не создал стол/не начал партию: ${String(e.message ?? e).split("\n")[0]}`);
  }

  let viewerReady = false;
  if (code) {
    lastStep = "вход зрителем через «Смотреть»";
    const res = await watchRoom(viewer, code, "Зритель");
    if (res.ok) {
      const st = await netState(viewer);
      const token = await safeEval(viewer, (c) => localStorage.getItem(`evo-watch-${c}`), code).catch(
        () => null,
      );
      const badge = await safeEval(viewer, () =>
        document.body.innerText.includes("Вы смотрите · реакции доступны"),
      ).catch(() => false);
      if (badge && token && st?.spectating && st?.hasState) {
        if (res.reloaded) {
          warn(
            "пункт 1: вкладку зрителя перезагрузил дев-сервер (full-reload) — " +
              "стол открылся через resume, а не напрямую; чистота проверки ниже",
          );
        }
        if (st.seat !== -2) {
          warn(`пункт 1: net.seat=${st.seat} вместо -2 после resume (мелочь, видимого вреда нет)`);
        }
        pass(
          "1",
          `зритель вошёл по кнопке «Смотреть»: бейдж на экране, стол с state виден, ` +
            `net.seat=${st.seat}, spectating=${st.spectating}, токен evo-watch-${code} в localStorage`,
        );
        viewerReady = true;
      } else {
        checkFail(
          "1",
          `после «Смотреть» нет полного зрительского состояния: badge=${badge}, token=${Boolean(token)}, ` +
            `store=${JSON.stringify(st)}; экран: ${await bodyOf(viewer)}`,
        );
      }
      await screenshot(viewer, "qa-spectate-01-table.png");
    } else if (res.stuck) {
      // Токен выдан, spectating=true — но стол не открывается: сессия зрителя
      // не запускает поллинг (watch не зовёт schedule). Фиксируем баг пунктом 1,
      // дальше продолжаем после аварийного F5 тем же токеном.
      bug(
        "кнопка «Смотреть»: netSpectate проходит, токен сохранён, net.spectating=true, " +
          `но экран навсегда остаётся «Открываем стол…» (${res.body}) — NetSession.watch() ` +
          "не запускает поллинг (нет schedule(0), в отличие от resumeWatch)",
      );
      checkFail(
        "1",
        `стол не открылся после «Смотреть»: экран «${res.body}», при этом token=${Boolean(res.token)}, ` +
          `store=${JSON.stringify(res.st)}`,
      );
      await screenshot(viewer, "qa-spectate-01-stuck.png");
      lastStep = "аварийный F5 зрителя (продолжение проверок)";
      if (await reviveViewer(viewer, code)) {
        viewerReady = true;
        warn(
          "пункты 2–5, 7 проверяются после F5 тем же зрительским токеном " +
            "(resumeWatch запускает поллинг) — сам вход по кнопке сломан (баг №2)",
        );
        await screenshot(viewer, "qa-spectate-01b-table-after-f5.png");
      } else {
        warn("аварийный F5 не вернул зрителя — пункты 2–7 не проверить");
      }
    } else {
      checkFail("1", `не удалось войти зрителем: ${res.body}`);
    }
  }

  // ── Пункт 2. Read-only стол: бейдж есть, действий нет ────────────────────
  lastStep = "проверка read-only стола";
  if (viewerReady) {
    const cur = await safeEval(viewer, () => document.body.innerText).catch(() => "");
    const badge = cur.includes("Вы смотрите · реакции доступны");
    const inv = await buttonInventory(viewer);
    const ACTION_RE = /Начать год|Закончить ход|Закончить развитие|Закончить питание|^Пас$|Не защищаться|Пропустить ход|Убрать игрока|Передать хост|Добавить бота|Убрать бота|Скопировать ссылку/;
    const actionButtons = inv.filter((b) => !b.disabled && ACTION_RE.test(b.label));
    // Поведенческая проверка: клик по «действию» (или вызов dispatch) не
    // должен порождать ни одного запроса netAction (тело с "action").
    await installFetchLog(viewer);
    const t0 = Date.now();
    let clicked = null;
    if (actionButtons.length) {
      clicked = actionButtons[0].label;
      await safeEval(viewer, (label) => {
        const b = [...document.querySelectorAll("button")].find(
          (x) => (x.getAttribute("aria-label") || x.innerText || "").replace(/\s+/g, " ").trim() === label,
        );
        b?.click();
      }, clicked).catch(() => {});
    } else {
      // Кнопок действий нет — дёргаем dispatch напрямую (то же, что делает UI).
      await safeEval(viewer, async () => {
        const s = await import("/src/store/game-store.ts");
        s.useGameStore.getState().dispatch({ type: "devPass" });
      }).catch(() => {});
      clicked = "dispatch(devPass) из стора";
    }
    await sleep(1500);
    const actionCalls = await netActionsSince(viewer, t0);
    const stAfter = await netState(viewer);
    const list = inv.map((b) => `${b.label}${b.disabled ? " (disabled)" : ""}`).join(" | ");
    if (!badge) {
      checkFail("2", `бейджа «Вы смотрите» нет; кнопки: ${list || "нет"}`);
    } else if (actionButtons.length) {
      bug(
        "зритель видит включённые кнопки действий (" +
          actionButtons.map((b) => b.label).join(", ") +
          ") и карточку «Ваш ход» — read-only не enforced визуально; клики инертны " +
          "(guard в store: netAction не уходит), но интерфейс предлагает недоступное",
      );
      checkFail(
        "2",
        `зритель видит активные кнопки действий: ${actionButtons.map((b) => b.label).join(", ")} ` +
          `(попытка «${clicked}»: запросов netAction ${actionCalls}; spectating=${stAfter?.spectating}). ` +
          `Кнопки: ${list}`,
      );
    } else if (actionCalls > 0) {
      checkFail("2", `после «${clicked}» ушёл запрос netAction (${actionCalls}) — зритель может действовать`);
    } else if (actionCalls < 0) {
      warn("пункт 2: сетевой лог вкладки не прочитался — поведенческая проверка неполная");
      pass(
        "2",
        `read-only по DOM: бейдж на экране, кнопок действий нет; спектатор-флаг spectating=${stAfter?.spectating}`,
      );
    } else {
      pass(
        "2",
        `read-only: бейдж на экране, кнопок действий нет; попытка «${clicked}» не отправила netAction; ` +
          `spectating=${stAfter?.spectating}`,
      );
    }
  }

  // ── Пункт 3. Реакция зрителя: пузырь и звук ─────────────────────────────
  lastStep = "реакция зрителя";
  let bubbleBase = 0;
  if (viewerReady) {
    await installBubbleObserver(viewer);
    await installSfxSpy(viewer);
    await sleep(900); // гарантированный зазор от предыдущих реакций (лимит 700 мс)
    const clicked = await clickReaction(viewer, "👏");
    let got = false;
    if (clicked) {
      got = await waitUntil(async () => ((await bubbles(viewer)) ?? []).length >= 1, 10_000, 400);
    }
    const list = (await bubbles(viewer)) ?? [];
    const sfx = (await sfxCalls(viewer)) ?? [];
    const own = list.find((t) => t.includes("👏") && t.includes("Зритель"));
    if (got && own) {
      pass(
        "3",
        `реакция 👏 доехала: пузырь «${own}», вызовы sfx: ${JSON.stringify(sfx)} ` +
          `(👏 озвучивается как cheer)`,
      );
      await screenshot(viewer, "qa-spectate-02-reaction.png");
    } else {
      checkFail(
        "3",
        `пузырь не появился (клик=${clicked}, пузыри=${JSON.stringify(list)}, sfx=${JSON.stringify(sfx)}); ` +
          `экран: ${await bodyOf(viewer)}`,
      );
    }
    bubbleBase = list.length;
  }

  // ── Пункт 4. Инкрементальность: старые реакции не приходят повторно ──────
  lastStep = "проверка инкрементальности реакций";
  if (viewerReady) {
    // 2-3 цикла поллинга (700 мс) — за 4,5 с их проходит не меньше шести.
    await sleep(4500);
    const afterIdle = (await bubbles(viewer)) ?? [];
    if (afterIdle.length !== bubbleBase) {
      checkFail(
        "4",
        `за время простоя число пузырей выросло с ${bubbleBase} до ${afterIdle.length} — ` +
          `старые реакции доставляются повторно: ${JSON.stringify(afterIdle)}`,
      );
    } else {
      // Реакция ДРУГОГО участника: шлём с вкладки хоста (игрок, не зритель).
      const beforeOther = afterIdle.length;
      let hostHow = "клик по панели реакций";
      let hostClicked = await clickReaction(host, "🌿");
      if (!hostClicked) hostHow = "netReaction из вкладки хоста";
      if (hostClicked) {
        const arrived = await waitUntil(
          async () => ((await bubbles(viewer)) ?? []).length >= beforeOther + 1,
          10_000,
          400,
        );
        if (!arrived) hostClicked = false;
      }
      if (!hostClicked) {
        // Резерв: прямой вызов API с токеном места хоста (сеть та же).
        hostHow = "netReaction из вкладки хоста";
        await safeEval(host, async (c) => {
          const api = await import("/src/lib/net/api.ts");
          const token = localStorage.getItem(`evo-seat-${c}`);
          await api.netReaction({ data: { code: c, token, emoji: "🌿", kind: "reaction" } });
        }, code).catch(() => {});
      }
      const grew = await waitUntil(
        async () => ((await bubbles(viewer)) ?? []).length >= beforeOther + 1,
        12_000,
        400,
      );
      await sleep(4000); // ещё несколько поллингов: повторов быть не должно
      const finalList = (await bubbles(viewer)) ?? [];
      const fresh = finalList.slice(beforeOther);
      const exactlyOne = finalList.length === beforeOther + 1;
      if (!grew) {
        checkFail("4", `реакция другого участника не доехала (${hostHow}); пузыри: ${JSON.stringify(finalList)}`);
      } else if (!exactlyOne) {
        checkFail(
          "4",
          `после реакции другого участника пузырей стало ${finalList.length} вместо ${beforeOther + 1} — ` +
            `есть повторная доставка: ${JSON.stringify(finalList)}`,
        );
      } else if (!(fresh[0] ?? "").includes("Аня")) {
        checkFail("4", `пузырь другого участника без имени: «${fresh[0]}»`);
      } else {
        pass(
          "4",
          `за 4,5 с простоя новых пузырей нет (${beforeOther}); реакция «${fresh[0]}» (${hostHow}) дала ` +
            `ровно один пузырь, за следующие 4 с повторов не было`,
        );
      }
    }
  }

  // ── Пункт 5. Рейт-лимит 700 мс между реакциями одного участника ─────────
  lastStep = "рейт-лимит реакций";
  if (viewerReady) {
    await sleep(1100); // свой прошлый зазор истёк — первая реакция должна пройти
    const before = ((await bubbles(viewer)) ?? []).length;
    await clearFetchLog(viewer);
    const t0 = Date.now();
    // Два клика подряд из DOM: интервал между ними — миллисекунды.
    const clickInfo = await safeEval(viewer, () => {
      const g = document.querySelector('[role="group"][aria-label="Реакции"]');
      const btns = g ? [...g.querySelectorAll("button")] : [];
      const s = performance.now();
      btns[2]?.click(); // 🔥
      const gap = performance.now() - s;
      btns[3]?.click(); // 😮
      return { n: btns.length, gapMs: Math.round(gap) };
    }).catch(() => null);
    const toast = await waitUntil(
      async () => {
        const txt =
          (await safeEval(viewer, () => {
            const t = [...document.querySelectorAll("[data-sonner-toast]")]
              .map((e) => e.textContent ?? "")
              .join(" ");
            return t || document.body.innerText;
          }).catch(() => "")) ?? "";
        return txt.includes("Слишком часто");
      },
      12_000,
      500,
    );
    await sleep(1500);
    const list = (await bubbles(viewer)) ?? [];
    const added = list.slice(before);
    // Детерминированная проверка серверного лимита: два вызова API подряд тем
    // же зрительским токеном. UI-клики выше проверяют путь и тост, а этот
    // зонд не зависит от перехвата fetch (в некоторых вкладках он не видит
    // запросы TanStack Start).
    const probe = await safeEval(viewer, async (c) => {
      const api = await import("/src/lib/net/api.ts");
      const token = localStorage.getItem(`evo-watch-${c}`);
      const first = await api.netReaction({ data: { code: c, token, emoji: "💚", kind: "reaction" } });
      const second = await api.netReaction({ data: { code: c, token, emoji: "😮", kind: "reaction" } });
      return { first, second };
    }, code).catch(() => null);
    const calls = (await reactionCallsSince(viewer, t0)) ?? [];
    const respShorts = calls.map((c) => (c.resp ?? "").slice(0, 100)).join(" || ") || "перехват fetch пуст";
    if (!clickInfo?.n) {
      checkFail("5", "панель реакций не найдена — проверить лимит не удалось");
    } else if (added.length !== 1) {
      checkFail(
        "5",
        `после двух быстрых кликов пузырей добавилось ${added.length} вместо 1 ` +
          `(тост=${toast}, клики: ${JSON.stringify(clickInfo)}): ${JSON.stringify(added)}`,
      );
    } else if (!toast) {
      bug("рейт-лимит сервер отрабатывает, но ошибка «Слишком часто» не показана тостом");
      checkFail("5", `вторая реакция отклонена, но тоста/ошибки на экране нет (ответы: ${respShorts})`);
    } else if (!probe?.first?.ok) {
      checkFail("5", `контрольный вызов API не прошёл: ${JSON.stringify(probe?.first).slice(0, 200)}`);
    } else if (probe.second?.ok) {
      checkFail(
        "5",
        `сервер принял вторую реакцию подряд (<700 мс): ${JSON.stringify(probe.second).slice(0, 200)}`,
      );
    } else if (!String(probe.second?.error ?? "").includes("Слишком часто")) {
      checkFail("5", `вторая реакция отклонена не лимитом: ${JSON.stringify(probe.second).slice(0, 200)}`);
    } else {
      pass(
        "5",
        `два клика с зазором ${clickInfo.gapMs} мс: принят один (пузырь «${added[0]}»), ` +
          `показан тост «Слишком часто»; контрольные вызовы API: первый ok, второй — «${probe.second.error}»`,
      );
      await screenshot(viewer, "qa-spectate-03-ratelimit.png");
    }
  }

  // ── Пункт 6. F5 зрителя: режим и стол восстанавливаются ─────────────────
  lastStep = "F5 зрителя";
  if (viewerReady) {
    const tokenBefore = await safeEval(viewer, (c) => localStorage.getItem(`evo-watch-${c}`), code).catch(
      () => null,
    );
    const urlBefore = viewer.url();
    let reloadOk = true;
    try {
      await race(viewer.reload({ waitUntil: "domcontentloaded", timeout: 30_000 }), 40_000, "reload");
    } catch (e) {
      reloadOk = false;
      warn(`reload не завершился: ${String(e.message ?? e).split("\n")[0]}`);
    }
    const badge = await waitUntil(
      () => viewer.getByText("Вы смотрите").count().then((n) => n > 0),
      30_000,
      700,
    );
    const st = await netState(viewer);
    const tokenAfter = await safeEval(viewer, (c) => localStorage.getItem(`evo-watch-${c}`), code).catch(
      () => null,
    );
    if (badge && st?.spectating && tokenAfter && reloadOk) {
      if (st.seat !== -2) {
        bug(
          `мелкий: после resume (F5) net.seat=${st.seat} вместо -2 — resumeNetFromUrl заводит ` +
            "seat:-1 (сентинел ожидающего), и зрительский поллинг его не перезаписывает",
        );
      }
      pass(
        "6",
        `после F5 зритель остался зрителем (spectating=${st.spectating}, seat=${st.seat}), ` +
          `токен evo-watch-${code} на месте; URL ${urlBefore} → ${viewer.url()}`,
      );
      await screenshot(viewer, "qa-spectate-04-f5.png");
      // Токен, кстати, должен совпасть с тем, что был до перезагрузки.
      if (tokenBefore !== tokenAfter) warn("токен зрителя после F5 изменился (сервер выдал новый?)");
    } else {
      checkFail(
        "6",
        `после F5 зрительский режим не восстановился: badge=${badge}, store=${JSON.stringify(st)}, ` +
          `token=${Boolean(tokenAfter)}, reload=${reloadOk}; экран: ${await bodyOf(viewer)}`,
      );
    }
  }

  // ── Пункт 7. Выход: меню и очистка зрительского токена ──────────────────
  lastStep = "выход в меню";
  if (viewerReady) {
    const leave = viewer.getByRole("button", { name: "Покинуть стол" }).first();
    await safeClick(leave, 4000);
    const dialog = viewer.getByRole("dialog");
    const dialogOk = await waitUntil(() => isVisible(dialog), 6000, 300);
    if (dialogOk) {
      await safeClick(dialog.getByRole("button", { name: "Покинуть стол", exact: true }), 4000);
    }
    const inMenu = await waitUntil(
      () => viewer.getByRole("button", { name: "Создать стол" }).count().then((n) => n > 0),
      20_000,
      500,
    );
    const keys = await safeEval(viewer, (c) => ({
      watch: localStorage.getItem(`evo-watch-${c}`),
      watchCode: localStorage.getItem("evo-net-watch-code"),
      room: new URLSearchParams(location.search).get("room"),
    }), code).catch(() => null);
    if (inMenu && keys && !keys.watch && !keys.watchCode && !keys.room) {
      pass(
        "7",
        `выход в меню: кнопка «Создать стол» на экране, evo-watch-${code} и evo-net-watch-code очищены, ` +
          `?room из адреса убран`,
      );
      await screenshot(viewer, "qa-spectate-05-menu.png");
    } else {
      checkFail(
        "7",
        `после выхода не всё чисто: меню=${inMenu}, токены=${JSON.stringify(keys)}, dialog=${dialogOk}; ` +
          `экран: ${await bodyOf(viewer)}`,
      );
    }
  }
} catch (e) {
  fail(`прогон прерван на шаге «${lastStep}»: ${String(e.message ?? e).split("\n")[0]}`);
} finally {
  try {
    await race(browser.close(), 15_000, "закрытие браузера");
  } catch {
    /* браузер уже мог упасть */
  }
  clearTimeout(watchdog);
}

// Скриншоты копируем в EVO_SHOTS (по умолчанию %TEMP%) в самом конце: пока
// браузер жив, свежий PNG в дереве проекта может вызвать full-reload Vite.
for (const f of readdirSync(SHOTS_TMP).filter((n) => n.startsWith("qa-spectate-") && n.endsWith(".png"))) {
  try {
    copyFileSync(join(SHOTS_TMP, f), join(SHOTS_OUT, f));
    console.log(`скриншот сохранён: ${join(SHOTS_OUT, f)}`);
  } catch (e) {
    warn(`не удалось сохранить ${f}: ${String(e.message ?? e).split("\n")[0]}`);
  }
}

const seconds = Math.round((Date.now() - START_TS) / 1000);
console.log("\n── Вердикты ─────────────────────────────────────────────");
for (const id of ["1", "2", "3", "4", "5", "6", "7"]) {
  const v = verdicts.find((x) => x.id === id);
  console.log(`${v ? (v.ok ? "PASS" : "FAIL") : "НЕ ПРОВЕРЕН"}  пункт ${id}: ${v?.msg ?? "проверка не выполнялась"}`);
}
if (consoleErrors.length) {
  console.log(`\nОшибки консоли браузера (${consoleErrors.length}):`);
  for (const e of consoleErrors.slice(0, 20)) console.log(`  ${e}`);
} else {
  console.log("\nОшибок консоли браузера нет.");
}
if (findings.length) {
  console.log(`\nНайденные баги (${findings.length}):`);
  for (const f of findings) console.log(`  • ${f}`);
}
const reloads = reloadSeen ? `, full-reload вкладок: ${reloadSeen}` : "";
const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""}${reloads} (${seconds} с)`
  : `ИТОГ: зрительский прогон чист${warnings.length ? ` (предупреждений ${warnings.length})` : ""}${reloads} (${seconds} с)`;
console.log(`\n${verdict}`);
process.exitCode = problems.length ? 1 : 0;
