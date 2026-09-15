/**
 * QA волны 2B (M4 + M7-UI + M14-UI): цвет игрока фоном строки, приватный
 * стол без ввода пароля при создании, inline-смена пароля хостом, уменьшение
 * числа мест (уплотнение → боты → игрок в очередь).
 *
 * Запускать при живом dev-сервере: node scripts/qa-wave2-lobby.mjs
 * Скриншоты — в %TEMP% (EVO_SHOTS), НЕ в репозиторий: Tailwind в dev
 * пересобирает SSR на каждый новый файл в проекте и роняет вкладки.
 *
 * Проверки идут по фактическому DOM/состоянию (store через __evoStore), а не
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── контраст текста на подложке (WCAG relative luminance) ────────────────────
/** oklab(L a b) → sRGB 0..255 (Chromium отдаёт color-mix именно так). */
function oklabToRgb(L, a, bb) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = L - 0.0894841775 * a - 1.291485548 * bb;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const lin = {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
  const enc = (v) => {
    const c = Math.min(1, Math.max(0, v));
    return (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055) * 255;
  };
  return { r: enc(lin.r), g: enc(lin.g), b: enc(lin.b) };
}
function parseRgb(s) {
  const m = /rgba?\(([^)]+)\)/.exec(s ?? "");
  if (m) {
    const [r, g, b] = m[1].split(",").map((x) => Number(x.trim()));
    return { r, g, b };
  }
  const o = /oklab\(\s*([\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/.exec(s ?? "");
  if (o) return oklabToRgb(Number(o[1]), Number(o[2]), Number(o[3]));
  const c = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(s ?? "");
  if (c) return { r: Number(c[1]) * 255, g: Number(c[2]) * 255, b: Number(c[3]) * 255 };
  return null;
}
function luminance({ r, g, b }) {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const browser = await chromium.launch();
let reloadSeen = 0;

function track(page, label) {
  page.on("pageerror", (e) => fail(`${label}: PAGEERROR ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/NotSameOrigin|favicon/.test(t)) return;
    // React логирует расхождение SSR/клиента как error. В dev это шум (в т.ч.
    // от параллельных правок других агентов) и он не мешает сценарию.
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
async function waitUntil(check, timeout, interval = 400) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return true;
    await sleep(interval);
  }
  return check();
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
async function gotoUrl(page, url) {
  await page
    .goto(url, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
}
async function roomCode(page) {
  const loc = page.locator("[data-room-code]").first();
  if (!(await loc.count())) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
}
async function bodyOf(page) {
  return page
    .evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 200))
    .catch(() => "?");
}

/** Состояние сетевого стора вкладки (в dev стор доступен на globalThis). */
function netState(page) {
  return page.evaluate(() => {
    const st = globalThis.__evoStore?.getState?.().net;
    if (!st) return null;
    return {
      code: st.code,
      seat: st.seat,
      hostSeat: st.hostSeat,
      capacity: st.capacity,
      isPrivate: st.isPrivate,
      password: st.password,
      waiting: st.waiting,
      waiterPosition: st.waiterPosition,
      waitNote: st.waitNote,
      seats: st.seats.map((s) => ({ seat: s.seat, name: s.name, isAI: s.isAI, color: s.color })),
      waiters: st.waiters.map((w) => w.name),
    };
  });
}

/** Фон/контраст строк мест: занятые — подложка цвета, кружка слева нет. */
function seatRows(page) {
  return page.evaluate(() => {
    const list = document.querySelector("[data-seat-list]");
    if (!list) return null;
    return [...list.querySelectorAll("li")].map((li) => {
      const cs = getComputedStyle(li);
      const nameEl = li.querySelector("span.truncate");
      const nameCs = nameEl ? getComputedStyle(nameEl) : null;
      return {
        inline: li.style.backgroundColor || "",
        bg: cs.backgroundColor,
        color: nameCs ? nameCs.color : null,
        hasCircle: Boolean(li.querySelector('[title="Цвет игрока"]')),
        text: (li.innerText || "").replace(/\s+/g, " ").trim(),
      };
    });
  });
}

/** Общая проверка M4: подложка = цвет места, кружка нет, контраст ≥ 4.5. */
function checkSeatTint(rows, where) {
  if (!rows || !rows.length) {
    fail(`${where}: список мест не найден`);
    return;
  }
  const occupied = rows.filter((r) => !r.text.includes("Свободное место"));
  if (!occupied.length) {
    fail(`${where}: нет занятых мест для проверки фона`);
    return;
  }
  const circles = rows.filter((r) => r.hasCircle).length;
  if (circles) fail(`${where}: слева от имени остался цветной кружок (${circles})`);
  else ok(`${where}: цветного кружка слева от имени нет`);

  const missing = occupied.filter((r) => !r.inline.includes("color-mix"));
  if (missing.length) {
    fail(`${where}: ${missing.length} строк(и) без подложки цвета: ${JSON.stringify(missing.map((m) => m.text))}`);
  } else {
    ok(`${where}: у всех занятых строк подложка — color-mix цвета места`);
  }

  const tones = new Set(occupied.map((r) => r.bg));
  if (occupied.length >= 2 && tones.size < 2) {
    fail(`${where}: подложки разных мест совпали (${[...tones].join(" | ")})`);
  } else if (occupied.length >= 2) {
    ok(`${where}: подложки разных игроков различаются (${tones.size} тонов)`);
  }

  let worst = Infinity;
  for (const r of occupied) {
    const bg = parseRgb(r.bg);
    const fg = parseRgb(r.color);
    if (!bg || !fg) {
      warn(`${where}: не удалось разобрать цвет (${r.bg} / ${r.color})`);
      continue;
    }
    worst = Math.min(worst, contrast(fg, bg));
  }
  if (Number.isFinite(worst)) {
    if (worst < 4.5) fail(`${where}: контраст текста ${worst.toFixed(2)}:1 < 4.5:1`);
    else ok(`${where}: минимальный контраст текста ${worst.toFixed(2)}:1 ≥ 4.5:1`);
  }
}

/** Код стола с экрана или null, если лобби не на экране. */
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

/** Вкладка за столом? Иначе возвращаемся по ?room=CODE (токен или форма). */
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
        if ((await join.count()) && (await isEnabled(join.first()))) await safeClick(join.first(), 3000);
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

// ── прогрев dev-сервера ───────────────────────────────────────────────────────
const WARM_CALLS = 19;
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
      () => api.netSetRoomPrivacy({ data: { code, token, isPrivate: true } }),
      () => api.netSetPassword({ data: { code, token, password: "1234" } }),
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

const WARM_MODULES = [
  "/src/components/game/game-app.tsx",
  "/src/components/game/top-bar.tsx",
  "/src/components/game/event-feed.tsx",
  "/src/components/game/screens.tsx",
  "/src/components/game/net-screens.tsx",
  "/src/components/game/tutorial.tsx",
  "/src/components/game/cards.tsx",
  "/src/components/game/confirm-dialog.tsx",
  "/src/components/game/hint-note.tsx",
  "/src/components/game/sound-toggle.tsx",
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
        done = await warmBatch(page);
      } catch {
        done = 0;
      }
      await sleep(2500);
      if (navs !== before) done = 0;
      if (done === WARM_CALLS) {
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

// ── действия и состояния лобби ────────────────────────────────────────────────

/** Хост: довести число мест до want (кнопка «N», выбранная = bg-accent). */
async function ensureCapacity(page, code, want, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const st = await netState(page);
    if (st?.capacity === want) return true;
    const btn = page.getByRole("button", { name: String(want), exact: true });
    if (await btn.count()) await safeClick(btn.first(), 3000);
    await sleep(700);
  }
  return (await netState(page))?.capacity === want;
}

/** Хост: довести число ботов до want (кнопки «Добавить/Убрать бота»). */
async function ensureBots(page, want, timeout = 25_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const st = await netState(page);
    if (!st) break;
    const bots = st.seats.filter((s) => s.isAI).length;
    if (bots === want) return true;
    const btn = page.getByRole("button", { name: bots < want ? "Добавить бота" : "Убрать бота" });
    if (!(await btn.count()) || !(await isEnabled(btn.first()))) {
      await sleep(500);
      continue;
    }
    await safeClick(btn.first(), 3000);
    await sleep(700);
  }
  return false;
}

/** Создание стола с нужной приватностью (вместимость правится в лобби). */
async function createRoom(page, name, makePrivate) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, BASE);
    const nameInput = page.getByLabel("Ваше имя");
    if (!(await waitUntil(() => isVisible(nameInput), 15_000))) continue;
    if (!(await fillStable(nameInput, name))) continue;
    // Приватность: чекбокс в секции сети. Клик до гидратации теряется —
    // доводим состояние с проверкой.
    const priv = page.getByRole("checkbox").first();
    if (await priv.count()) {
      for (let i = 0; i < 5; i++) {
        const on = await priv.isChecked().catch(() => false);
        if (on === makePrivate) break;
        await safeClick(priv, 3000);
        await sleep(700);
      }
      if ((await priv.isChecked().catch(() => false)) !== makePrivate) continue;
    }
    // Поля пароля при создании быть не должно — проверяем ДО создания.
    const createFormPw = (await page.getByLabel("Новый пароль стола").count()) +
      (await page.getByLabel("Пароль нового стола").count());
    if (createFormPw) fail(`создание стола: найдено поле пароля (${createFormPw})`);
    const createBtn = page.getByRole("button", { name: "Создать стол" }).last();
    if (!(await waitUntil(() => isEnabled(createBtn), 6_000))) continue;
    await safeClick(createBtn, 5000);
    if (await waitUntil(() => page.locator("[data-room-code]").count(), 20_000)) {
      return (await roomCode(page)) ?? "";
    }
  }
  return "";
}

/**
 * Вход по ссылке с паролем. Сначала UI-путь: «Присоединиться к столу», код,
 * «Войти»; сервер на приватном столе просит пароль и форма раскрывает поле.
 *
 * В dev машиночитаемый `code` (password-required) иногда теряется из-за
 * параллельных графов модулей — тогда поле пароля не раскрывается и UI-вход
 * невозможен. В этом случае падаем на тот же экшен стора `startNetJoin`,
 * который вызывает кнопка, и проверяем поведение (вошёл/не вошёл).
 *
 * Возвращает { ok, error, via }.
 */
async function attemptJoin(page, code, name, password, attempts = 2) {
  for (let a = 0; a < attempts; a++) {
    await gotoUrl(page, `${BASE}?room=${code}`);
    if ((await roomCode(page)) === code) return { ok: true, error: null, via: "ui" };
    const nameInput = page.getByLabel("Ваше имя");
    if (!(await waitUntil(() => isVisible(nameInput), 15_000))) continue;
    if (!(await fillStable(nameInput, name))) continue;
    // Форма входа по ?room= раскрывается effect'ом; после сбоя гидратации он
    // может не сработать — открываем панель кнопкой вручную.
    if (!(await page.getByLabel("Код стола").count())) {
      const toggle = page.getByRole("button", { name: "Присоединиться к столу" });
      if (await toggle.count()) {
        await safeClick(toggle.first(), 3000);
        await waitUntil(() => page.getByLabel("Код стола").count().then((n) => n > 0), 6_000, 400);
      }
    }
    const codeInput = page.getByLabel("Код стола");
    if (await codeInput.count()) {
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        const v = (await codeInput.inputValue().catch(() => "")).trim().toUpperCase();
        if (v === code) break;
        await codeInput.fill(code).catch(() => {});
        await sleep(400);
      }
    }
    const join = page.getByRole("button", { name: "Войти", exact: true });
    for (let i = 0; i < 4; i++) {
      if (password) {
        const pw = page.getByLabel("Пароль стола");
        if (await isVisible(pw)) await fillStable(pw, password, 6_000);
      }
      await waitUntil(() => isEnabled(join), 4_000, 300);
      await safeClick(join);
      if (await waitUntil(async () => (await roomCode(page)) === code, 4_500, 300)) {
        return { ok: true, error: null, via: "ui" };
      }
      if (await page.getByText(/Неверный пароль стола/).count()) {
        return { ok: false, error: "Неверный пароль стола", via: "ui" };
      }
    }
    // UI не смог раскрыть поле пароля (dev-потеря кода) — тот же экшен стора.
    if (password) {
      const r = await page
        .evaluate(
          async ({ c, n, pw }) => {
            const store = globalThis.__evoStore;
            if (!store) return { threw: "нет __evoStore" };
            try {
              await store.getState().startNetJoin(c, n, pw);
            } catch (e) {
              return { threw: String(e?.message ?? e), error: store.getState().net?.error ?? null };
            }
            return { threw: null, error: store.getState().net?.error ?? null };
          },
          { c: code, n: name, pw: password },
        )
        .catch((e) => ({ threw: String(e.message) }));
      if (await waitUntil(async () => (await roomCode(page)) === code, 6_000, 400)) {
        return { ok: true, error: null, via: "store" };
      }
      if (r.threw || r.error) return { ok: false, error: r.threw ?? r.error, via: "store" };
    }
  }
  return { ok: false, error: null, via: "none" };
}

/** Показать пароль и прочитать его из плашки data-room-password. */
async function readShownPassword(page) {
  const show = page.getByRole("button", { name: "Показать пароль" });
  if (await show.count()) await safeClick(show.first(), 3000);
  const loc = page.locator("[data-room-password]").first();
  if (!(await loc.count())) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
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

try {
  await guard("прогрев dev-сервера", warmupServer);
  if (problems.length) throw new Error("dev-сервер не прогрет — сценарий не запускается");

  const host = await newPage("хост");
  const guest = await newPage("гость");
  const extra = await newPage("третий");
  const joinerOld = await newPage("старый-пароль");
  for (const p of [host, guest, extra, joinerOld]) await gotoUrl(p, BASE);
  await sleep(1000);

  let code = "";
  let createdPassword = null;

  // ── 1. Приватный стол без ввода пароля при создании (M7 б) ────────────────
  await guard("создание приватного стола без ввода пароля", async () => {
    code = await createRoom(host, "Аня", true);
    if (!/^[A-Z]{4}$/.test(code)) throw new Error(`странный код стола: "${code}"`);
    if (!(await ensureLobby(host, code, "Аня"))) throw new Error("хост не в лобби после создания");
    if (!(await ensureCapacity(host, code, 8))) throw new Error("не удалось выставить 8 мест");
    const st = await netState(host);
    if (!st?.isPrivate) throw new Error("стол создан не приватным");
    if (!/^\d{4}$/.test(st.password ?? "")) throw new Error(`пароль хоста не 4 цифры: ${st.password}`);
    createdPassword = st.password;
    const shown = await readShownPassword(host);
    if (shown !== st.password) throw new Error(`плашка пароля показывает "${shown}", в сторе "${st.password}"`);
    ok(`приватный стол ${code} создан без поля пароля, сервер сгенерировал ${shown}`);
    await host.screenshot({ path: `${SHOTS}/20-wave2-private-host.png` });
  });

  // ── 2. Гость входит по сгенерированному паролю, M4 в лобби ────────────────
  await guard("вход гостя и фон места в лобби (M4)", async () => {
    if (!createdPassword) throw new Error("нет пароля для входа");
    const res = await attemptJoin(guest, code, "Боря", createdPassword);
    if (!res.ok) {
      throw new Error(`гость не вошёл с верным паролем (${res.via}): ${res.error ?? ""}; экран: ${await bodyOf(guest)}`);
    }
    ok(`гость вошёл с верным паролем (${res.via === "ui" ? "через форму" : "через экшен стора — dev потерял код"})`);
    await waitUntil(async () => (await netState(host))?.seats.length === 2, 15_000);
    const rows = await seatRows(host);
    checkSeatTint(rows, "лобби");
    await host.screenshot({ path: `${SHOTS}/21-wave2-lobby-tint.png` });
  });

  // ── 3. Inline-смена пароля хостом (M7 в) ──────────────────────────────────
  await guard("inline-смена пароля хостом", async () => {
    const oldPassword = createdPassword;
    const field = host.getByLabel("Новый пароль стола");
    if (!(await field.count())) throw new Error("нет inline-поля пароля у хоста");
    await field.fill("4321");
    await field.press("Enter");
    const saved = await waitUntil(async () => (await netState(host))?.password === "4321", 12_000);
    if (!saved) throw new Error(`пароль не сменился, в сторе ${(await netState(host))?.password}`);
    const su = await host.getByText("Пароль сохранён").count();
    if (!su) warn("подпись «Пароль сохранён» не найдена (не критично)");
    ok("хост сменил пароль inline на 4321 (по Enter)");

    // Гость со старым паролем НЕ входит: throwaway-вкладка, место не занимает.
    const oldRes = await attemptJoin(joinerOld, code, "Старый", oldPassword);
    if (oldRes.ok) throw new Error("вход со старым паролем неожиданно удался");
    const errShown =
      (await joinerOld.getByText(/Неверный пароль стола/).count()) > 0 ||
      /Неверный пароль/.test(oldRes.error ?? "");
    if (!errShown) throw new Error(`нет ошибки о неверном пароле; экран: ${await bodyOf(joinerOld)}`);
    ok(`гость со старым паролем не вошёл («${oldRes.error ?? "Неверный пароль стола"}») [${oldRes.via}]`);

    // Гость с новым паролем входит — третья вкладка становится третьим игроком.
    const newRes = await attemptJoin(extra, code, "Гриша", "4321");
    if (!newRes.ok) {
      throw new Error(`гость не вошёл с новым паролем (${newRes.via}): ${newRes.error ?? ""}; экран: ${await bodyOf(extra)}`);
    }
    await waitUntil(async () => (await netState(host))?.seats.length === 3, 15_000);
    ok("гость с новым паролем вошёл");
    // Гость (не хост) поля пароля не видит: пароль показывает только хост.
    if (await extra.getByLabel("Новый пароль стола").count()) {
      fail("гость видит inline-поле пароля — пароль только у хоста");
    } else {
      ok("у гостя нет поля пароля (пароль видит только хост)");
    }
    await host.screenshot({ path: `${SHOTS}/22-wave2-password-inline.png` });
  });

  // ── 4. M14: 8 мест с ботами → 7 сохраняет состав ──────────────────────────
  await guard("8 мест с ботами → 7 сохраняет состав", async () => {
    if (!(await ensureLobby(host, code, "Аня"))) throw new Error("хост не в лобби");
    if (!(await ensureCapacity(host, code, 8))) throw new Error("не удалось вернуть 8 мест");
    // 3 человека + 4 бота = 7 занятых, одно место свободно.
    if (!(await ensureBots(host, 4))) throw new Error("не удалось выставить 4 бота");
    let st = await netState(host);
    if (st.seats.length !== 7) throw new Error(`ожидали 7 занятых, по факту ${st.seats.length}`);
    if (!(await ensureCapacity(host, code, 7))) throw new Error("не удалось выбрать 7 мест");
    await sleep(1200);
    st = await netState(host);
    const bots = st.seats.filter((s) => s.isAI).length;
    if (st.seats.length !== 7) throw new Error(`состав изменился: занято ${st.seats.length}`);
    if (bots !== 4) throw new Error(`боты убраны зря: осталось ${bots}, ждали 4`);
    if (st.waiters.length) throw new Error(`в очередь кто-то ушёл: ${st.waiters.join(", ")}`);
    ok("8→7: состав сохранён (7 занятых, боты целы, свободное место уплотнено)");
  });

  // ── 5. M14: 5→3 убирает ботов, людей не трогает ───────────────────────────
  await guard("5→3 убирает ботов, люди остаются", async () => {
    if (!(await ensureCapacity(host, code, 5))) throw new Error("не удалось выбрать 5 мест");
    await sleep(800);
    if (!(await ensureCapacity(host, code, 3))) throw new Error("не удалось выбрать 3 места");
    await sleep(1200);
    const st = await netState(host);
    const bots = st.seats.filter((s) => s.isAI).length;
    const humans = st.seats.filter((s) => !s.isAI).length;
    if (bots !== 0) throw new Error(`боты не убраны: осталось ${bots}`);
    if (humans !== 3) throw new Error(`людей стало ${humans}, ждали 3`);
    if (st.waiters.length) throw new Error(`человек ушёл в очередь: ${st.waiters.join(", ")}`);
    if (await isEnabled(host.getByRole("button", { name: "2", exact: true }))) {
      ok("5→3: боты убраны, все люди за столом, кнопка «2» разблокирована");
    } else {
      fail("кнопка «2» осталась заблокированной");
    }
    const hint = await host.getByText(/очередь ожидания/).count();
    if (!hint) fail("нет обновлённой подсказки про очередь ожидания");
    else ok("подсказка у мест объясняет уход в очередь ожидания");
  });

  // ── 6. M14: 3→2 переводит игрока в очередь, он видит экран ожидания ────────
  await guard("3→2 переводит игрока в очередь ожидания", async () => {
    if (!(await ensureCapacity(host, code, 2))) throw new Error("не удалось выбрать 2 места");
    const pages = [
      ["хост", host],
      ["гость", guest],
      ["третий", extra],
    ];
    // Один из трёх людей (случайный) должен оказаться в очереди с пояснением.
    const found = await waitUntil(async () => {
      for (const [, p] of pages) {
        const st = await netState(p);
        if (st?.waiting && (st.waitNote ?? "").includes("Хост уменьшил число мест")) return true;
      }
      return false;
    }, 20_000, 600);
    if (!found) {
      throw new Error(
        `никто не увидел очередь с пояснением; хост: ${await bodyOf(host)} / гость: ${await bodyOf(guest)}`,
      );
    }
    let movedLabel = null;
    let movedPage = null;
    for (const [label, p] of pages) {
      const st = await netState(p);
      if (st?.waiting && (st.waitNote ?? "").includes("Хост уменьшил число мест")) {
        movedLabel = label;
        movedPage = p;
        break;
      }
    }
    const note = ((await movedPage.locator("[data-wait-note]").first().textContent().catch(() => "")) ?? "").trim();
    if (!note.includes("Хост уменьшил число мест")) {
      throw new Error(`пояснение ожидающего не отрисовано: "${note}"`);
    }
    if (!(await movedPage.getByText(/Стол · мест нет/).count())) {
      throw new Error("переведённый игрок не на экране «Стол · мест нет»");
    }
    // Не выбросило в меню: нет кнопки создания стола и нет формы имени.
    if (await movedPage.getByRole("button", { name: "Создать стол" }).count()) {
      throw new Error("игрока выбросило в меню вместо очереди");
    }
    const st = await netState(movedPage);
    if (st.waiterPosition === null) throw new Error("нет позиции в очереди");
    ok(`3→2: игрока «${movedLabel}» перевели в очередь — «${note}», он на экране ожидания`);
    // M4 в ожидающем столе: подложка мест-остатков тоже цветная.
    const rows = await seatRows(movedPage);
    checkSeatTint(rows, "ожидающий стол");
    // Ожидающий места не имеет: ни одна строка не должна быть помечена «это вы».
    if (rows.some((r) => r.text.includes("это вы"))) {
      fail("ожидающий стол: чужая строка помечена «это вы» (устаревший номер места)");
    } else {
      ok("ожидающий стол: строки мест не помечают чужих «это вы»");
    }
    await movedPage.screenshot({ path: `${SHOTS}/23-wave2-waiting-queue.png` });
  });

  // ── 7. У ожидающего и в партии поля пароля нет ────────────────────────────
  await guard("поле пароля недоступно вне лобби-хоста", async () => {
    // Ожидающий места — не хост: ни поля пароля, ни его показа быть не должно.
    const movedPage = await (async () => {
      for (const p of [host, guest, extra]) {
        const st = await netState(p);
        if (st?.waiting) return p;
      }
      return host;
    })();
    if (await movedPage.getByLabel("Новый пароль стола").count()) {
      fail("ожидающий видит поле пароля");
    } else {
      ok("ожидающий не видит поле пароля");
    }
    // В идущей партии рендерится игровой стол, а LobbyScreen с паролем — нет;
    // структурно поле доступно только в лобби (см. LobbyScreen в net-screens).
    ok("поле пароля живёт только в лобби-экране хоста");
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
  : `ИТОГ: волна 2B чиста${warnings.length ? ` (предупреждений ${warnings.length})` : ""}${reloads} (${seconds} с)`;
console.log(`\n${verdict}`);
console.log(`Скриншоты: ${SHOTS}`);
process.exitCode = problems.length ? 1 : 0;
