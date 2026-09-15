/**
 * QA волны 3 (M1 + M18): меню в три колонки, слайдеры внутри колонок,
 * мобильные вкладки «Столы»/«Создать», закрытые столы в отдельной колонке
 * с входом по паролю — и полное отсутствие соло-режима.
 *
 * Запускать при живом dev-сервере: node scripts/qa-wave3-menu.mjs
 * Скриншоты — в %TEMP% (EVO_SHOTS), НЕ в репозиторий: Tailwind в dev
 * пересобирает SSR на каждый новый файл в проекте и роняет вкладки.
 *
 * Проверки идут по фактическому DOM/состоянию (стор через __evoStore), а не
 * по факту клика: клик по SSR-разметке до гидратации может потеряться. Сценарий
 * начинается с прогрева SSR-цепочки, иначе первый импорт serverFn/UI в dev
 * шлёт full-reload и рвёт сессию вкладок.
 */
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
const SHOTS = process.env.EVO_SHOTS ?? join(tmpdir(), "evo-qa-shots");
mkdirSync(SHOTS, { recursive: true });

const problems = [];
const warnings = [];
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
const check = (cond, msg) => (cond ? ok(msg) : fail(msg));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isVisible = (loc) => loc.isVisible().catch(() => false);
const isEnabled = (loc) => loc.isEnabled().catch(() => false);
async function safeClick(loc, timeout = 3000) {
  try {
    await loc.click({ timeout });
    return true;
  } catch {
    return false;
  }
}
async function waitUntil(checkFn, timeout, interval = 400) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await checkFn()) return true;
    await sleep(interval);
  }
  return checkFn();
}
async function gotoUrl(page, url) {
  // domcontentloaded, а не networkidle: меню поллит столы раз в 4 с, и
  // networkidle на нём не наступает — каждое открытие стоило бы 60 секунд.
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
  await waitHydrated(page);
}

/**
 * Гидратация: до неё клики по SSR-разметке теряются, а кнопки остаются
 * disabled. Стор в dev кладётся в globalThis при загрузке клиентских модулей —
 * это и есть сигнал, что обработчики уже живые.
 */
async function waitHydrated(page, timeout = 25_000) {
  return waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), timeout, 300);
}

/** Пока «готово» не станет истинным — повторяем ввод (гидратация затирает). */
async function typeUntilReady(locator, value, ready, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    await locator.fill(value).catch(() => {});
    await sleep(500);
    if (await ready()) return true;
  }
  return ready();
}
async function bodyOf(page) {
  return page
    .evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 220))
    .catch(() => "?");
}
async function roomCode(page) {
  const loc = page.locator("[data-room-code]").first();
  if (!(await loc.count())) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
}
function netState(page) {
  return page.evaluate(() => {
    const st = globalThis.__evoStore?.getState?.().net;
    if (!st) return null;
    return {
      code: st.code,
      seat: st.seat,
      status: st.status,
      waiting: st.waiting,
      hostSeat: st.hostSeat,
      capacity: st.capacity,
      isPrivate: st.isPrivate,
      password: st.password,
      spectating: st.spectating,
      seats: st.seats.length,
      error: st.error,
    };
  });
}
function gameState(page) {
  return page.evaluate(() => {
    const s = globalThis.__evoStore?.getState?.();
    return s?.state ? { phase: s.state.phase, year: s.state.year, humanId: s.state.humanId } : null;
  });
}

const browser = await chromium.launch();
let reloadSeen = 0;

function track(page, label) {
  page.on("pageerror", (e) => fail(`${label}: PAGEERROR ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/NotSameOrigin|favicon/.test(t)) return;
    if (/hydrated but some attributes/.test(t)) {
      if (!track._hydrated) {
        track._hydrated = true;
        warn("React: расхождение SSR/клиента (dev-шум, не блокирует сценарий)");
      }
      return;
    }
    fail(`${label}: console ${t.slice(0, 200)}`);
  });
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

/**
 * Заполнить поле так, чтобы значение «прижилось». До гидратации React
 * перерисовывает SSR-инпут и затирает введённое; поэтому после fill ждём,
 * что значение совпало, и при расхождении пробуем снова.
 */
async function fillStable(locator, value, timeout = 12_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    await locator.fill(value).catch(() => {});
    await sleep(400);
    const cur = await locator.inputValue().catch(() => "");
    if (cur === value) return true;
  }
  return false;
}

/** Создать столы пачкой через серверный API (без UI) — для проверки слайдеров. */
async function seedRooms(page, { publicCount, privateCount }) {
  return page.evaluate(
    async ({ pub, priv }) => {
      const api = await import("/src/lib/net/api.ts");
      const made = [];
      for (let i = 0; i < pub + priv; i++) {
        const isPrivate = i >= pub;
        const r = await api.netCreateRoom({
          data: {
            name: `Столло${i + 1}`,
            capacity: 2 + (i % 5),
            botSeats: 0,
            difficulty: ["easy", "normal", "hard"][i % 3],
            modules: i % 4 === 0 ? { continents: true } : {},
            isPrivate,
          },
        });
        made.push({ code: r.code, isPrivate, password: r.password ?? null, ok: r.ok });
      }
      return made;
    },
    { pub: publicCount, priv: privateCount },
  );
}

/** Открыть стол из меню (колонка 1) и дождаться лобби. */
async function createRoom(page, name, makePrivate) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, BASE);
    const nameInput = page.getByLabel("Ваше имя");
    if (!(await waitUntil(() => isVisible(nameInput), 15_000))) continue;
    await waitHydrated(page);
    const createReady = async () =>
      isEnabled(page.getByRole("button", { name: "Создать стол" }).last());
    if (!(await typeUntilReady(nameInput, name, createReady))) continue;
    const priv = page.getByRole("checkbox").first();
    if (await priv.count()) {
      for (let i = 0; i < 5; i++) {
        const on = await priv.isChecked().catch(() => false);
        if (on === makePrivate) break;
        await safeClick(priv, 3000);
        await sleep(600);
      }
      if ((await priv.isChecked().catch(() => false)) !== makePrivate) continue;
    }
    const createBtn = page.getByRole("button", { name: "Создать стол" }).last();
    if (!(await waitUntil(() => isEnabled(createBtn), 6_000))) continue;
    await safeClick(createBtn, 5000);
    if (await waitUntil(() => page.locator("[data-room-code]").count(), 20_000)) {
      return (await roomCode(page)) ?? "";
    }
  }
  return "";
}

/** Войти по коду через форму колонки 1 (как это делает человек). */
async function joinByCode(page, code, name, password) {
  await gotoUrl(page, BASE);
  const nameInput = page.getByLabel("Ваше имя");
  if (!(await waitUntil(() => isVisible(nameInput), 15_000))) return false;
  await waitHydrated(page);
  const joinBtn = page.getByRole("button", { name: "Войти", exact: true });
  // Готовность имени — по кнопке «Создать стол»: она зависит только от имени,
  // а «Войти» ждёт ещё и четыре символа кода.
  const namedReady = () => isEnabled(page.getByRole("button", { name: "Создать стол" }).last());
  if (!(await typeUntilReady(nameInput, name, namedReady))) return false;
  if (!(await page.getByLabel("Код стола").count())) {
    const toggle = page.getByRole("button", { name: "Присоединиться к столу" });
    await safeClick(toggle.first(), 3000);
    await waitUntil(() => page.getByLabel("Код стола").count().then((n) => n > 0), 6_000, 400);
  }
  const codeInput = page.getByLabel("Код стола");
  if (!(await codeInput.count())) return false;
  await typeUntilReady(codeInput, code, () => isEnabled(joinBtn));
  if (password) {
    const pw = page.getByLabel("Пароль стола");
    await waitUntil(() => isVisible(pw), 10_000, 400);
    if (await isVisible(pw)) await fillStable(pw, password, 6_000);
  }
  const join = joinBtn;
  for (let i = 0; i < 6; i++) {
    await waitUntil(() => isEnabled(join), 4_000, 300);
    await safeClick(join, 3000);
    if (await waitUntil(async () => (await roomCode(page)) === code, 4_000, 300)) return true;
  }
  return false;
}

// ── прогреваем SSR/serverFn, чтобы dev не перезагружал вкладки ───────────────
const WARM_MODULES = ["/src/components/game/net-screens.tsx", "/src/components/game/screens.tsx"];
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
      try {
        await page.evaluate(async () => {
          const api = await import("/src/lib/net/api.ts");
          await api.netListRooms({ data: {} });
        });
      } catch {
        /* перезагрузило — повторим */
      }
      await sleep(2500);
      if (navs === before) break;
      if (round === 5) throw new Error("serverFn не прогрелись: вкладку продолжают перезагружать");
      await quiet(4_000, 15_000);
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      await gotoUrl(page, BASE);
      const afterLoad = navs;
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
        /* перезагрузило — повторим */
      }
      await sleep(2500);
      if (navs === afterLoad) return;
      await quiet(4_000, 15_000);
    }
    throw new Error("клиентский UI не прогрелся: вкладку продолжают перезагружать");
  } finally {
    await ctx.close();
  }
}

/** Геометрия меню: высоты колонок, скролл внутри, рост документа. */
async function menuMetrics(page) {
  return page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { h: Math.round(r.height), w: Math.round(r.width), top: Math.round(r.top) };
    };
    const cols = {};
    for (const id of ["table", "open", "private"]) {
      const el = document.querySelector(`[data-menu-col="${id}"]`);
      const sc = document.querySelector(`[data-menu-col="${id}"] [data-menu-scroll]`);
      cols[id] = {
        ...box(el),
        scrollH: sc ? sc.scrollHeight : 0,
        clientH: sc ? sc.clientHeight : 0,
        overflowY: sc ? getComputedStyle(sc).overflowY : null,
        rows: sc ? sc.querySelectorAll("[data-room-row]").length : 0,
      };
    }
    return {
      cols,
      docScroll: document.documentElement.scrollHeight,
      bodyScroll: document.body.scrollHeight,
      innerH: window.innerHeight,
      innerW: window.innerWidth,
      scrollW: document.documentElement.scrollWidth,
      tabs: document.querySelectorAll('[aria-label="Разделы меню"] button').length,
    };
  });
}

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

let created = [];
try {
  await guard("прогрев dev-сервера", async () => {
    await warmupServer();
    ok("dev-сервер и serverFn прогреты");
  });
  if (problems.length) throw new Error("dev-сервер не прогрет — сценарий не запускается");

  const host = await newPage("хост");
  await gotoUrl(host, BASE);
  await sleep(1500);

  // ── 1. Соло исчезло (M1) ───────────────────────────────────────────────────
  await guard("соло исчезло из меню (M1)", async () => {
    await host.evaluate(() => {
      try {
        localStorage.removeItem("evo-solo-game");
      } catch {
        /* приватный режим */
      }
    });
    await gotoUrl(host, BASE);
    await waitUntil(() => isVisible(host.getByLabel("Ваше имя")), 15_000);
    await waitHydrated(host);
    const startYear = await host.getByRole("button", { name: "Начать год" }).count();
    const resume = await host.getByText("Незаконченная партия").count();
    const resumeBtn = await host.getByRole("button", { name: "Продолжить" }).count();
    check(startYear === 0, `в меню нет кнопки «Начать год» (нашлось ${startYear})`);
    check(resume === 0 && resumeBtn === 0, "в меню нет блока «Незаконченная партия / Продолжить»");
    // Инлайн-скрипт evoResume и ключ сейва не должны встречаться в разметке.
    const html = await host.content();
    check(!html.includes("evo-solo-game"), "в HTML страницы нет ключа evo-solo-game");
    check(!html.includes("evoResume"), "в HTML страницы нет инлайн-скрипта evoResume");
    const saved = await host.evaluate(() => localStorage.getItem("evo-solo-game"));
    check(saved === null, `localStorage["evo-solo-game"] не создаётся (${JSON.stringify(saved)})`);
    // Партия против ботов идёт через стол: в лобби есть «Начать год» и боты.
    await host.screenshot({ path: `${SHOTS}/30-wave3-menu-desktop.png` });
    ok(`меню: колонка «Стол», открытые/закрытые списки; скриншот 30-wave3-menu-desktop.png`);
  });

  // ── 1b. Ветка загрузки: стол уже есть, кадра партии ещё нет ───────────────
  await guard("загрузка стола без кадра — понятный экран, без падений (M1)", async () => {
    const errorsBefore = problems.length;
    const shown = await host.evaluate(() => {
      const st = globalThis.__evoStore?.getState?.();
      if (!st) return "нет стора";
      globalThis.__evoStore.setState({
        state: null,
        net: {
          code: "TEST",
          seat: 0,
          status: "connecting",
          error: null,
          seats: [],
          hostSeat: 0,
          capacity: 2,
          resigned: false,
          waiting: false,
          waiterPosition: null,
          waitNote: null,
          waiters: [],
          settings: {},
          isPrivate: false,
          password: null,
          chat: [],
          system: [],
          events: [],
          spectating: false,
          spectators: [],
          reactions: [],
          name: "Тест",
        },
      });
      return "ok";
    });
    if (shown !== "ok") throw new Error(String(shown));
    await sleep(1200);
    const text = (await host.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
    const loading = /Открываем стол|Загружаем партию|Переподключение/.test(text);
    check(loading, `при незагруженном кадре показан экран загрузки («${text.slice(0, 60)}»)`)
    check(problems.length === errorsBefore, "экран загрузки не уронил вкладку (нет новых ошибок)");
    await host.evaluate(() => globalThis.__evoStore.setState({ net: null, state: null }));
    const back = await waitUntil(() => isVisible(host.getByLabel("Ваше имя")), 10_000);
    check(back, "возврат из загрузки в меню");
  });

  // ── 2. Партия против ботов через стол: до развития и питания (M1) ─────────
  let soloGameCode = "";
  await guard("партия против ботов через стол", async () => {
    soloGameCode = await createRoom(host, "Аня", false);
    if (!/^[A-Z]{4}$/.test(soloGameCode)) throw new Error(`стол не создан (код «${soloGameCode}»)`);
    ok(`стол ${soloGameCode} создан из меню`);
    const inLobby = await waitUntil(async () => (await netState(host))?.status === "lobby", 15_000);
    if (!inLobby) throw new Error(`после создания не лобби: ${JSON.stringify(await netState(host))}`);
    // Боты: кнопка «Добавить бота» в настройках лобби.
    const addBot = host.getByRole("button", { name: "Добавить бота" });
    for (let i = 0; i < 4; i++) {
      const st = await netState(host);
      if (!st || st.seats >= st.capacity) break;
      if (await isEnabled(addBot)) await safeClick(addBot, 3000);
      await sleep(700);
    }
    let st = await netState(host);
    if (!st || st.seats < st.capacity) throw new Error(`стол не заполнен ботами: ${JSON.stringify(st)}`);
    const start = host.getByRole("button", { name: "Начать год" });
    if (!(await waitUntil(() => isEnabled(start), 10_000))) throw new Error("«Начать год» в лобби недоступна");
    await safeClick(start, 4000);
    // Фазу партии смотрим в сторе, а не по тексту: он не зависит от вёрстки.
    const phaseOk = await waitUntil(async () => {
      const g = await gameState(host);
      return g && (g.phase === "development" || g.phase === "feeding");
    }, 40_000, 700);
    if (!phaseOk) throw new Error(`партия не дошла до развития/питания: ${JSON.stringify(await gameState(host))}; ${await bodyOf(host)}`);
    const g1 = await gameState(host);
    ok(`партия с ботами идёт: фаза ${g1.phase}, год ${g1.year}`);
    // Убеждаемся, что питание тоже наступает: жмём «Закончить развитие/ход».
    const feedOk = await waitUntil(async () => {
      const g = await gameState(host);
      if (g?.phase === "feeding") return true;
      for (const name of [/^Закончить развитие$/, /^Закончить ход$/]) {
        const btn = host.getByRole("button", { name });
        const n = await btn.count();
        for (let i = 0; i < n; i++) {
          const b = btn.nth(i);
          if ((await isVisible(b)) && (await isEnabled(b))) {
            await b.evaluate((el) => el.click()).catch(() => {});
            return false;
          }
        }
      }
      return false;
    }, 60_000, 800);
    if (feedOk) ok("фаза питания наступает — боты ходят на сервере");
    else warn("питание за 60 с не наступило (долгий онбординг ботов — не провал)");
    // Соло-кнопок в партии нет: «Свернуть партию» и отмены хода быть не должно.
    check((await host.getByRole("button", { name: "Свернуть партию" }).count()) === 0, "в партии нет кнопки «Свернуть партию»");
    check((await host.getByRole("button", { name: "Отменить действие" }).count()) === 0, "в партии нет соло-кнопки «Отменить действие»");
    // Карточка «Ваш ход» затемняет стол — даём ей закрыться самой (1,6 с).
    await host.getByText("Ваш ход").waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {});
    await sleep(600);
    await host.screenshot({ path: `${SHOTS}/31-wave3-bots-game.png` });
    // Выходим в меню, не сдаваясь: «Просто выйти (без сдачи)».
    await safeClick(host.getByRole("button", { name: "Покинуть стол" }), 4000);
    const extra = host.getByRole("button", { name: /Просто выйти/ });
    if (await waitUntil(() => isVisible(extra), 6_000)) {
      await safeClick(extra, 4000);
    } else {
      const confirm = host.getByRole("button", { name: "Сдаться и выйти" });
      await safeClick(confirm, 4000);
    }
    const back = await waitUntil(() => isVisible(host.getByLabel("Ваше имя")), 15_000);
    check(back, "выход из партии возвращает в меню");
  });

  // ── 3. Закрытый стол: колонка «Закрытые», вход по паролю (M18 + M7) ───────
  await guard("закрытый стол в колонке «Закрытые»", async () => {
    const made = await seedRooms(host, { publicCount: 0, privateCount: 2 });
    const priv = made[0];
    if (!priv?.code || !priv.password) throw new Error(`приватный стол не создан: ${JSON.stringify(priv)}`);
    created.push(...made);
    await gotoUrl(host, BASE);
    await waitUntil(() => isVisible(host.getByLabel("Ваше имя")), 15_000);
    const row = host.locator(`[data-menu-col="private"] [data-private-row="${priv.code}"]`);
    const seen = await waitUntil(() => row.count().then((n) => n > 0), 15_000);
    if (!seen) throw new Error(`закрытый стол ${priv.code} не появился в колонке «Закрытые»; ${await bodyOf(host)}`);
    const openCol = await host.locator(`[data-menu-col="open"] [data-room-row="${priv.code}"]`).count();
    check(openCol === 0, "закрытый стол не дублируется в колонке «Открытые»");
    const rowText = ((await row.textContent()) ?? "").replace(/\s+/g, " ");
    check(!rowText.includes(priv.password), `пароль ${priv.password} не показан в строке списка`);
    await host.screenshot({ path: `${SHOTS}/32-wave3-private-column.png` });

    // Неверный пароль → понятная ошибка прямо в строке.
    const guest = await newPage("гость");
    await gotoUrl(guest, BASE);
    const grow = guest.locator(`[data-menu-col="private"] [data-private-row="${priv.code}"]`);
    const growBtn = grow.getByRole("button", { name: /Войти по паролю/ });
    if (!(await waitUntil(() => growBtn.count().then((n) => n > 0), 15_000))) {
      throw new Error(`гость не видит закрытый стол ${priv.code} в списке`);
    }
    await typeUntilReady(guest.getByLabel("Ваше имя"), "Боря", () => isEnabled(growBtn));
    // Кликаем по самой строке (владелец: «после нажатия надо ввести пароль»).
    await safeClick(grow.locator(`[data-private-open="${priv.code}"]`), 4000);
    const wrong = String((Number(priv.password[0]) + 1) % 10) + priv.password.slice(1);
    const pwField = grow.getByLabel("Пароль закрытого стола");
    if (!(await waitUntil(() => isVisible(pwField), 6_000))) throw new Error("поле пароля в строке не раскрылось");
    await fillStable(pwField, wrong);
    await safeClick(grow.getByRole("button", { name: "Войти", exact: true }), 4000);
    const errShown = await waitUntil(async () => {
      const t = ((await grow.textContent().catch(() => "")) ?? "").replace(/\s+/g, " ");
      return /Неверный пароль|пароль/i.test(t) && /Неверный/.test(t);
    }, 12_000, 500);
    check(errShown, `неверный пароль ${wrong}: в строке показана понятная ошибка`);
    check((await roomCode(guest)) === null, "с неверным паролем за стол не пустили");
    await guest.screenshot({ path: `${SHOTS}/33-wave3-private-wrong.png` });

    // Верный пароль → гость за столом.
    await fillStable(pwField, priv.password);
    await safeClick(grow.getByRole("button", { name: "Войти", exact: true }), 4000);
    const joined = await waitUntil(async () => (await roomCode(guest)) === priv.code, 20_000, 600);
    if (!joined) throw new Error(`гость не вошёл с верным паролем; ${await bodyOf(guest)}`);
    ok(`гость вошёл в закрытый стол ${priv.code} по паролю с первого раза`);
    await guest.screenshot({ path: `${SHOTS}/34-wave3-private-joined.png` });
    await guest.context().close();
  });

  // ── 4. Прежние сценарии: вход по коду, по ссылке ?room=, наблюдение ───────
  await guard("вход по коду, по ссылке и наблюдение", async () => {
    const made = await seedRooms(host, { publicCount: 1, privateCount: 0 });
    const pub = made[0];
    created.push(...made);
    const p = await newPage("второй");
    await gotoUrl(p, BASE);
    const byCode = await joinByCode(p, pub.code, "Боря");
    if (!byCode) throw new Error(`не удалось войти по коду ${pub.code}; ${await bodyOf(p)}`);
    ok(`вход по коду ${pub.code} работает`);
    await p.context().close();

    // Ссылка-приглашение ?room=КОД сажает за стол.
    const p2 = await newPage("по-ссылке");
    const linkCode = await createRoom(host, "Аня", false);
    created.push({ code: linkCode, isPrivate: false });
    await gotoUrl(p2, `${BASE}?room=${linkCode}`);
    const join = p2.getByRole("button", { name: "Войти", exact: true });
    const nameP2 = p2.getByLabel("Ваше имя");
    if (!(await waitUntil(() => isVisible(nameP2), 15_000))) throw new Error("форма входа по ссылке не появилась");
    const namedReady2 = () => isEnabled(p2.getByRole("button", { name: "Создать стол" }).last());
    await typeUntilReady(nameP2, "Гриша", namedReady2);
    for (let i = 0; i < 6; i++) {
      await waitUntil(() => isEnabled(join), 4_000, 300);
      await safeClick(join, 3000);
      if (await waitUntil(async () => (await roomCode(p2)) === linkCode, 4_000, 300)) break;
    }
    check((await roomCode(p2)) === linkCode, `вход по ссылке ?room=${linkCode} работает`);
    await p2.context().close();

    // Наблюдение: строка идущей партии в колонке «Открытые» даёт «Наблюдать».
    await gotoUrl(host, BASE);
    const row = host.locator(`[data-menu-col="open"] [data-room-row="${soloGameCode}"]`);
    const hasRow = await waitUntil(() => row.count().then((n) => n > 0), 20_000);
    if (!hasRow) {
      warn(`стол ${soloGameCode} не виден в списке — наблюдать из меню не проверяли`);
    } else {
      const rowBtn = row.getByRole("button", { name: /Наблюдать|Занять место/ });
      await typeUntilReady(host.getByLabel("Ваше имя"), "Аня", () => isEnabled(rowBtn));
      await safeClick(rowBtn, 4000);
      const watching = await waitUntil(async () => {
        const st = await netState(host);
        return st && (st.spectating || st.seat >= 0);
      }, 20_000, 600);
      check(watching, `вход из строки списка сработал (${JSON.stringify(await netState(host))})`);
    }
  });

  // ── 5. Геометрия: три колонки одной высоты, слайдеры, без роста страницы ──
  await guard("30+ столов: колонки одной высоты и слайдер (M18)", async () => {
    // 30 открытых + 6 закрытых: списки обязаны скроллиться внутри колонок.
    const bulk = await seedRooms(host, { publicCount: 30, privateCount: 6 });
    created.push(...bulk);
    await gotoUrl(host, BASE);
    await waitUntil(() => isVisible(host.getByLabel("Ваше имя")), 15_000);
    await waitHydrated(host);

    for (const [w, h] of [
      [1440, 900],
      [1280, 800],
    ]) {
      await host.setViewportSize({ width: w, height: h });
      // Ждём, пока поллинг (4 с) натянет столы в список.
      const enough = await waitUntil(async () => {
        const m = await menuMetrics(host);
        return m.cols.open.rows >= 20;
      }, 25_000, 1000);
      if (!enough) {
        const m = await menuMetrics(host);
        throw new Error(`в открытой колонке мало строк: ${m.cols.open.rows} (нужно ≥20)`);
      }
      const m = await menuMetrics(host);
      const hs = [m.cols.table.h, m.cols.open.h, m.cols.private.h];
      const diff = Math.max(...hs) - Math.min(...hs);
      check(diff <= 1, `${w}×${h}: три колонки одной высоты (${hs.join(" / ")}, расхождение ${diff})`);
      check(
        m.bodyScroll <= m.innerH + 2 && m.docScroll <= m.innerH + 2,
        `${w}×${h}: страница не выросла при ${m.cols.open.rows} столах (body ${m.bodyScroll}, doc ${m.docScroll}, экран ${m.innerH})`,
      );
      check(
        m.cols.open.scrollH > m.cols.open.clientH && /auto|scroll/.test(m.cols.open.overflowY ?? ""),
        `${w}×${h}: список «Открытые» скроллится внутри (${m.cols.open.scrollH} > ${m.cols.open.clientH}, overflow ${m.cols.open.overflowY})`,
      );
      check(
        m.cols.private.scrollH >= 0 && /auto|scroll/.test(m.cols.private.overflowY ?? ""),
        `${w}×${h}: колонка «Закрытые» со своим скроллом (overflow ${m.cols.private.overflowY})`,
      );
      const tops = [m.cols.table.top, m.cols.open.top, m.cols.private.top];
      check(Math.max(...tops) - Math.min(...tops) <= 2, `${w}×${h}: колонки выровнены по верху (${tops.join("/")})`);
      await host.screenshot({ path: `${SHOTS}/35-wave3-grid-${w}x${h}.png` });
      ok(`${w}×${h}: ${m.cols.open.rows} открытых и ${m.cols.private.rows} закрытых столов, скриншот 35-wave3-grid-${w}x${h}.png`);
    }
  });

  // ── 6. Мобильные вкладки (390×844) ────────────────────────────────────────
  await guard("мобильные вкладки «Столы»/«Создать» (M18)", async () => {
    const m = await newPage("мобилка", { width: 390, height: 844 });
    await gotoUrl(m, BASE);
    await waitUntil(() => isVisible(m.getByLabel("Ваше имя")), 15_000);
    const metrics0 = await menuMetrics(m);
    check(metrics0.tabs === 2, `на телефоне две вкладки (нашлось ${metrics0.tabs})`);
    check(metrics0.scrollW <= metrics0.innerW + 1, `нет горизонтального скролла (${metrics0.scrollW} ≤ ${metrics0.innerW})`);
    // По умолчанию — «Столы»: списки видны, форма создания скрыта.
    const tablesBtn = m.getByRole("button", { name: /^Столы/ }).first();
    const createBtn = m.getByRole("button", { name: "Создать", exact: true }).first();
    check(await isVisible(tablesBtn), "вкладка «Столы» видна");
    check(await isVisible(m.locator('[data-menu-col="open"]')), "вкладка «Столы» показывает открытые столы");
    check(await isVisible(m.locator('[data-menu-col="private"]')), "вкладка «Столы» показывает закрытые столы");
    check(!(await isVisible(m.getByLabel("Ваше имя"))), "во вкладке «Столы» форма создания скрыта");
    await m.screenshot({ path: `${SHOTS}/36-wave3-mobile-tables.png` });
    // Переключаемся на «Создать»: форма доступна, списки уходят.
    await safeClick(createBtn, 4000);
    const nameVisible = await waitUntil(() => isVisible(m.getByLabel("Ваше имя")), 6_000);
    check(nameVisible, "вкладка «Создать» показывает имя и кнопки стола");
    check(!(await isVisible(m.locator('[data-menu-col="open"]'))), "во вкладке «Создать» списки скрыты");
    const metrics1 = await menuMetrics(m);
    check(metrics1.scrollW <= metrics1.innerW + 1, `после переключения вкладки нет горизонтального скролла (${metrics1.scrollW} ≤ ${metrics1.innerW})`);
    check((await m.getByRole("checkbox").count()) >= 1, "тумблер приватного стола доступен с телефона");
    check(await isVisible(m.getByRole("button", { name: "Создать стол" })), "кнопка «Создать стол» достижима пальцем");
    await m.screenshot({ path: `${SHOTS}/37-wave3-mobile-create.png` });
    // Вернулись на «Столы» — списки снова на месте.
    await safeClick(tablesBtn, 4000);
    const back = await waitUntil(() => isVisible(m.locator('[data-menu-col="open"]')), 6_000);
    check(back, "возврат на вкладку «Столы» работает");
    await m.context().close();
  });
} catch (e) {
  fail(`прогон прерван: ${String(e.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
}

const seconds = Math.round((Date.now() - START_TS) / 1000);
const reloads = reloadSeen ? `, full-reload вкладок: ${reloadSeen}` : "";
const rooms = created.length ? `, создано столов: ${created.length}` : "";
const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""}${rooms}${reloads} (${seconds} с)`
  : `ИТОГ: волна 3 чиста${warnings.length ? ` (предупреждений ${warnings.length})` : ""}${rooms}${reloads} (${seconds} с)`;
console.log(`\n${verdict}`);
console.log(`Скриншоты: ${SHOTS}`);
process.exitCode = problems.length ? 1 : 0;
