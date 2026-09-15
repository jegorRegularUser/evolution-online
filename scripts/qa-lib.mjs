/**
 * Общая библиотека браузерных QA «Эволюции».
 *
 * Зачем: соло-режим («человек против ботов» локально) удалён по решению
 * владельца. Единственный вход в партию — сетевой стол: меню → «Создать стол»
 * → лобби (вместимость, боты, дополнения, сложность, размер колоды) →
 * «Начать год». Скрипты, которые раньше жали «Начать год» в главном меню,
 * теперь поднимают партию здесь: `startNetGame(page, {...})`.
 *
 * Что внутри:
 *   - `startNetGame(page, cfg)` — создать стол с нужными настройками и начать
 *     партию; возвращает код стола. Все места заполняются ботами, поэтому
 *     человеку не нужны соперники-вкладки: стол полный, партия стартует сразу.
 *   - `advancePhase(page, needle)` — «Закончить развитие» / «Закончить ход» /
 *     «Закончить питание» (с подтверждением в диалоге) до появления текста.
 *   - `shotsDir()` — каталог скриншотов ВНЕ репозитория: Tailwind в dev
 *     сканирует проект, и каждый новый PNG вызывает full-reload вкладок.
 *     По умолчанию `%TEMP%/evo-qa-shots`, переопределяется `EVO_SHOTS`.
 *   - `warmupServer(browser)` — прогрев dev-сервера: первый вызов каждого
 *     serverFn и первый импорт клиентских модулей партии в dev компилируются
 *     лениво и шлют full-reload всем вкладкам. Скрипты, которым важна
 *     устойчивость, вызывают прогрев до сценарных вкладок.
 *
 * Библиотека ничего не печатает сама: статусы и вердикт остаются за скриптом.
 * Точки входа намеренно идемпотентны — повторный вызов `startNetGame` на той
 * же вкладке создаёт НОВЫЙ стол (старый надо покинуть или открыть новую
 * вкладку).
 */
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ── окружение ────────────────────────────────────────────────────────────────

/** Корень dev-сервера. Значение по умолчанию — порт, который держит проект. */
export const BASE = (process.env.EVO_URL ?? "http://127.0.0.1:8099").replace(/\/+$/, "");

/**
 * Каталог скриншотов: строго вне репозитория (см. шапку). Создаётся при
 * первом вызове; `EVO_SHOTS` переопределяет путь.
 */
export function shotsDir(env = process.env) {
  const dir = env.EVO_SHOTS ?? join(tmpdir(), "evo-qa-shots");
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Путь к скриншотам по умолчанию — удобно подставлять в шаблоны имён. */
export const SHOTS = shotsDir();

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Ключи дополнений (совпадают с RoomSettings.modules). */
export const MODULES = ["continents", "plants", "fungi", "randomMutations"];
/** Подписи кнопок дополнений в лобби (aria-pressed-тумблеры). */
export const MODULE_LABELS = {
  continents: "Континенты",
  plants: "Растения",
  fungi: "Трава и грибы",
  randomMutations: "Случайные мутации",
};

// ── базовые примитивы страницы ───────────────────────────────────────────────

/**
 * Переход по URL с ожиданием гидратации: networkidle даёт React время
 * навесить обработчики, иначе первые клики по SSR-разметке теряются.
 */
export async function gotoUrl(page, url = `${BASE}/`) {
  await page
    .goto(url, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
}

/** Дешёвая видимость: isVisible у Playwright ждёт элемент и ест секунды. */
export const isVisible = (loc) => loc.isVisible().catch(() => false);

/** Дешёвая доступность: сначала count(), потом проверка с коротким таймаутом. */
export async function isEnabled(loc) {
  if ((await loc.count().catch(() => 0)) === 0) return false;
  return loc.first().isEnabled({ timeout: 1500 }).catch(() => false);
}

export async function safeClick(loc, timeout = 3000) {
  try {
    await loc.first().click({ timeout });
    return true;
  } catch {
    return false;
  }
}

/** Ждём выполнения проверки (в т.ч. асинхронной) до таймаута. */
export async function waitUntil(check, timeout, interval = 300) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return true;
    await sleep(interval);
  }
  return check();
}

/** Код стола с экрана или null, если лобби/стол не на экране. */
export async function roomCode(page) {
  const loc = page.locator("[data-room-code]").first();
  if (!(await loc.count().catch(() => 0))) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
}

/** Короткий текст экрана — для сообщений о падении. */
export async function bodyOf(page, limit = 200) {
  return page
    .evaluate((n) => (document.body.innerText ?? "").replace(/\s+/g, " ").slice(0, n), limit)
    .catch(() => "?");
}

/**
 * Ждёт появления текста и бросает с дампом экрана, если его нет:
 * `locator.waitFor` в отчёте не говорит, что именно было на вкладке.
 */
export async function expectText(page, re, timeout, what) {
  const found = await waitUntil(() => page.getByText(re).count().then((n) => n > 0), timeout, 500);
  if (!found) throw new Error(`${what} не появилось; экран: ${await bodyOf(page)}`);
}

/** Текущая фаза по стору вкладки (dev: стор виден на globalThis). */
export function phaseOf(page) {
  return page
    .evaluate(() => globalThis.__evoStore?.getState?.().state?.phase ?? null)
    .catch(() => null);
}

/** Ждёт фазу по стору; `phases` — строка или массив. */
export async function waitPhase(page, phases, timeout = 60_000) {
  const want = Array.isArray(phases) ? phases : [phases];
  return waitUntil(async () => want.includes(await phaseOf(page)), timeout, 300);
}

/** Состояние сетевого стора вкладки (в dev стор доступен на globalThis). */
export function netState(page) {
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
      settings: st.settings ?? {},
      waiting: st.waiting,
      seats: (st.seats ?? []).map((s) => ({ seat: s.seat, name: s.name, isAI: s.isAI })),
      waiters: (st.waiters ?? []).map((w) => w.name),
    };
  });
}

/**
 * Собирает ошибки вкладки в массив: pageerror и console.error.
 * Возвращает массив — скрипт сам решает, когда его проверять.
 */
export function trackPage(page, label, { ignore = [] } = {}) {
  const problems = [];
  const skip = (t) => /NotSameOrigin|favicon|WebGL|ResizeObserver/.test(t) || ignore.some((re) => re.test(t));
  page.on("pageerror", (e) => {
    const t = String(e?.message ?? e);
    if (!skip(t)) problems.push(`${label}: PAGEERROR ${t}`);
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (!skip(t)) problems.push(`${label}: console ${t.slice(0, 200)}`);
  });
  return problems;
}

// ── меню ─────────────────────────────────────────────────────────────────────

/**
 * Меню готово к работе? Маркер — колонки меню `[data-menu-col]` (их три:
 * стол, открытые, приватные) плюс либо поле имени, либо вкладка «Создать»
 * (на телефоне форма создания живёт во вкладке). «Начать год» из меню убран
 * вместе с соло-режимом и маркером больше не является.
 */
export async function menuReady(page, timeout = 30_000) {
  return waitUntil(
    async () => {
      const cols = await page.locator("[data-menu-col]").count().catch(() => 0);
      if (!cols) return false;
      if (await isVisible(page.getByLabel("Ваше имя"))) return true;
      return isVisible(page.getByRole("button", { name: /^Создать$/ }));
    },
    timeout,
    400,
  );
}

/** Телефон: форма создания во вкладке «Создать» — открыть её, если скрыта. */
export async function openCreateTab(page) {
  if (await isVisible(page.getByLabel("Ваше имя"))) return true;
  const tab = page.getByRole("button", { name: /^Создать$/ }).first();
  if (await isVisible(tab)) {
    await safeClick(tab, 3000);
    await sleep(400);
  }
  return isVisible(page.getByLabel("Ваше имя"));
}

/** Открыть меню и дождаться гидратации; при перезагрузке — ещё попытка. */
export async function openMenu(page, { timeout = 30_000, tries = 3 } = {}) {
  for (let i = 0; i < tries; i++) {
    await gotoUrl(page, `${BASE}/`);
    if (await menuReady(page, timeout)) return true;
  }
  throw new Error(`меню не открылось; экран: ${await bodyOf(page)}`);
}

/** Вписать имя игрока в меню (поле «Ваше имя»), с проверкой значения. */
export async function fillName(page, name) {
  await openCreateTab(page);
  const input = page.getByLabel("Ваше имя");
  if (!(await waitUntil(() => isVisible(input), 15_000))) return false;
  for (let i = 0; i < 4; i++) {
    await input.fill(name).catch(() => {});
    if (((await input.inputValue().catch(() => "")) ?? "").trim() === name) return true;
    await sleep(300);
  }
  return false;
}

// ── лобби ────────────────────────────────────────────────────────────────────

/** Вкладка застряла на «Открываем стол…»: нет ни лобби, ни формы входа. */
export function isStuckConnecting(page) {
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
export function unstick(page, code) {
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
 * места в localStorage вернёт без формы, иначе заполняем форму входа.
 * `bumpPage` — вкладка с правами хоста для аварийного лечения.
 */
export async function ensureLobby(page, code, name, bumpPage) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if ((await roomCode(page)) === code) return true;
    await gotoUrl(page, `${BASE}/?room=${code}`);
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
          const filled = ((await codeInput.inputValue().catch(() => "")) ?? "").trim().toUpperCase();
          if (filled !== code) await codeInput.fill(code).catch(() => {});
        }
        await nameInput.fill(name).catch(() => {});
        const join = page.getByRole("button", { name: "Войти", exact: true });
        if ((await join.count()) && (await isEnabled(join))) await safeClick(join, 3000);
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

/** Кнопка-выбор без aria-pressed (сложность, вместимость): ждём bg-accent. */
export async function clickSelected(locator) {
  if (!(await locator.count().catch(() => 0))) return false;
  const selected = async () =>
    (((await locator.first().getAttribute("class").catch(() => "")) ?? "")).includes("bg-accent");
  for (let i = 0; i < 4; i++) {
    if (await selected()) return true;
    await safeClick(locator, 3000);
    await sleep(1000);
  }
  return selected();
}

/** Тумблер дополнения (button aria-pressed): доводим до нужного состояния. */
export async function setToggle(locator, want) {
  if (!(await locator.count().catch(() => 0))) return false;
  for (let i = 0; i < 5; i++) {
    const cur = (await locator.first().getAttribute("aria-pressed").catch(() => null)) === "true";
    if (cur === want) return true;
    await safeClick(locator, 3000);
    await sleep(900);
  }
  return ((await locator.first().getAttribute("aria-pressed").catch(() => null)) === "true") === want;
}

// ── создание стола и старт партии ────────────────────────────────────────────

/**
 * Вызов экшена стора вкладки (dev: стор виден на globalThis). `op` — имя
 * операции, `arg` — аргумент. Те же экшены вызывают кнопки UI, поэтому
 * сценарий не обходит продуктовый код, а повторяет его.
 */
function storeCall(page, op, arg) {
  return page
    .evaluate(
      async ({ op: o, arg: a }) => {
        const store = globalThis.__evoStore;
        if (!store) return { ok: false, error: "нет __evoStore" };
        const s = store.getState();
        try {
          if (o === "create") {
            await s.startNetCreate(a);
            return { ok: true, value: store.getState().net?.code ?? null };
          }
          if (o === "bots") {
            await s.netAddBots(a);
            return { ok: true, value: null };
          }
          if (o === "capacity") {
            await s.netSetCapacity(a);
            return { ok: true, value: null };
          }
          if (o === "settings") {
            await s.netSetSettings(a);
            return { ok: true, value: null };
          }
          return { ok: false, error: `неизвестная операция ${o}` };
        } catch (e) {
          return { ok: false, error: String(e?.message ?? e), net: store.getState().net?.error ?? null };
        }
      },
      { op, arg: arg ?? null },
    )
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
}

/** Создание стола через тот же экшен, что вызывает кнопка «Создать стол». */
export async function createRoomViaStore(page, cfg) {
  const r = await storeCall(page, "create", cfg);
  if (!r.ok || !r.value) return { ok: false, error: r.error ?? r.net ?? "код не выдан" };
  return { ok: true, code: r.value };
}

/** Клик по «Создать стол» в меню (UI-путь, если стор недоступен). */
async function createRoomViaUi(page, name, players) {
  if (!(await fillName(page, name))) return { ok: false, error: "поле имени не найдено" };
  // Вместимость выбирается ещё в меню (в лобби её всё равно проверим).
  const capBtn = page.getByRole("button", { name: String(players), exact: true });
  if (await capBtn.count()) await clickSelected(capBtn);
  const create = page.getByRole("button", { name: "Создать стол" }).last();
  if (!(await waitUntil(() => isEnabled(create), 8_000))) {
    return { ok: false, error: "«Создать стол» недоступна" };
  }
  for (let i = 0; i < 3; i++) {
    await safeClick(create, 5000);
    if (await waitUntil(() => roomCode(page), 20_000, 400)) return { ok: true, code: await roomCode(page) };
  }
  return { ok: false, error: `стол не создался; экран: ${await bodyOf(page)}` };
}

/**
 * Хост-настройки лобби через экшены стора — те же вызовы, что делают кнопки
 * («Мест за столом», «Добавить бота», тумблеры дополнений, сложность, слайдер
 * колоды). Порядок важен: сначала поднимаем вместимость, потом добираем ботов,
 * и только затем понижаем места (понижение выкидывает ботов, а людей — в
 * очередь). Идемпотентно: читаем фактическое состояние и правим только разницу.
 */
async function applyLobbySettings(page, want, { timeout = 30_000, log } = {}) {
  const deadline = Date.now() + timeout;
  let lastNote = "";
  while (Date.now() < deadline) {
    const st = await netState(page);
    if (!st || !st.code) {
      await sleep(500);
      continue;
    }
    const bots = st.seats.filter((s) => s.isAI).length;
    const modules = st.settings.modules ?? {};
    const needBots = want.bots != null && bots !== want.bots;
    const needDiff = want.difficulty != null && st.settings.difficulty !== want.difficulty;
    const needDeck = want.deckSize != null && st.settings.deckSize !== want.deckSize;
    const needModules =
      want.modules != null &&
      MODULES.some((m) => Boolean(modules[m]) !== Boolean(want.modules[m]));
    const needRaise = want.players != null && st.capacity < want.players;
    const needLower = want.players != null && st.capacity > want.players;
    if (!needBots && !needDiff && !needDeck && !needModules && !needRaise && !needLower) {
      return { ok: true, seats: st.seats.length, bots, capacity: st.capacity };
    }
    if (st.hostSeat !== st.seat) {
      lastNote = "вкладка не хост — настройки лобби менять нельзя";
      await sleep(700);
      continue;
    }
    let r = { ok: true };
    if (needRaise) r = await storeCall(page, "capacity", want.players);
    if (r.ok && (needModules || needDiff || needDeck)) {
      const patch = {};
      if (want.modules != null) patch.modules = want.modules;
      if (want.difficulty != null) patch.difficulty = want.difficulty;
      if (want.deckSize != null) patch.deckSize = want.deckSize;
      r = await storeCall(page, "settings", patch);
    }
    if (r.ok && needBots) r = await storeCall(page, "bots", want.bots - bots);
    if (r.ok && needLower) r = await storeCall(page, "capacity", want.players);
    if (!r.ok) lastNote = String(r.error ?? r.net ?? "настройка отклонена");
    await sleep(700);
  }
  const st = await netState(page);
  const err =
    `настройки лобби не сошлись: хотим ${JSON.stringify(want)}, по факту ` +
    `${JSON.stringify({ capacity: st?.capacity, bots: st?.seats?.filter((s) => s.isAI).length, settings: st?.settings })}` +
    (lastNote ? `; ${lastNote}` : "");
  if (log) log(`WARN: ${err}`);
  return { ok: false, error: err };
}

/**
 * Главная точка входа: поднять сетевой стол с нужными настройками и начать
 * партию. Возвращает код стола.
 *
 *   const code = await startNetGame(page, { name: "Визуал", players: 2, bots: 1 });
 *   const code = await startNetGame(page, { name: "ДНД", players: 2, bots: 1,
 *                                            modules: { continents: true } });
 *
 * `players` — вместимость стола (2..8), `bots` — сколько мест займут боты
 * (по умолчанию все свободные). Все места заполняются, поэтому «Начать год»
 * в лобби доступна сразу, а человеку не нужны вторые вкладки.
 *
 * `navigate: false` — вызывающий уже открыл меню сам (нужно прогреву, который
 * следит за числом навигаций вкладки и не должен получать лишнюю).
 *
 * Настройки выставляются ровно те, что просили: дополнения по умолчанию ВСЕ
 * выключены, сложность — `normal`, колода — полная (если не задан `deckSize`).
 * Порядок: меню → имя → создание стола (экшен кнопки, с откатом на UI-клик) →
 * доводка настроек лобби → «Начать год» → ожидание фазы развития.
 */
export async function startNetGame(page, cfg = {}) {
  const {
    name = "QA",
    players = 2,
    bots = null,
    modules = {},
    difficulty = "normal",
    deckSize = null,
    isPrivate = false,
    password,
    createVia = "auto", // auto | store | ui
    navigate = true,
    startTimeout = 60_000,
    settingsTimeout = 30_000,
    log = () => {},
  } = cfg;
  if (players < 2 || players > 8) throw new Error(`players вне 2..8: ${players}`);
  const wantBots = bots == null ? players - 1 : bots;
  if (wantBots < 0 || wantBots > players - 1) {
    throw new Error(`ботов ${wantBots} не помещается за стол на ${players} мест`);
  }

  if (navigate) await openMenu(page);

  let code = "";
  let via = "";
  if (createVia !== "ui") {
    const full = {
      name,
      capacity: players,
      botSeats: wantBots,
      difficulty,
      modules,
      ...(deckSize != null ? { deckSize } : {}),
      isPrivate,
      ...(password ? { password } : {}),
    };
    const r = await createRoomViaStore(page, full);
    if (r.ok) {
      code = r.code;
      via = "store";
      // Ждём, пока лобби отрисуется: код появляется сразу, но экран — после
      // первого снапшота/рендера.
      await waitUntil(() => roomCode(page), 20_000, 300);
    } else {
      log(`создание через стор не удалось (${r.error}) — пробую UI`);
    }
  }
  if (!code && createVia !== "store") {
    const r = await createRoomViaUi(page, name, players);
    if (!r.ok) throw new Error(`стол не создан: ${r.error}`);
    code = r.code;
    via = "ui";
  }
  // Если стор не отдал код сразу — добираем со скрина (dev-перезагрузка).
  const shown = await waitUntil(async () => (await roomCode(page)) ?? false, 20_000, 400);
  if (shown) code = (await roomCode(page)) ?? code;
  if (!/^[A-Z0-9]{4}$/.test(code)) {
    throw new Error(`странный код стола: "${code}"; экран: ${await bodyOf(page)}`);
  }

  // Доводим лобби до запрошенных настроек (эквивалент кнопок лобби).
  const applied = await applyLobbySettings(
    page,
    { players, bots: wantBots, modules, difficulty, deckSize },
    { timeout: settingsTimeout, log },
  );
  if (!applied.ok) throw new Error(applied.error);

  // «Начать год» доступна только когда все места заполнены. Если что-то
  // потерялось в дев-перезагрузке — добираем ботов и жмём снова.
  const start = page.getByRole("button", { name: "Начать год" });
  const addBot = page.getByRole("button", { name: "Добавить бота" });
  const started = await waitUntil(async () => {
    if (await isEnabled(start)) return true;
    const st = await netState(page);
    if (st && st.seats.filter((s) => s.isAI).length < st.capacity - 1) await safeClick(addBot, 2000);
    return false;
  }, 30_000, 1200);
  if (!started) {
    throw new Error(`«Начать год» недоступна; экран: ${await bodyOf(page)}`);
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    await safeClick(start, 5000);
    // Начало партии: ждём фазу по стору (экран может быть перекрыт карточкой
    // «Ваш ход»/спотлайтом, поэтому DOM-текст менее надёжен).
    if (await waitPhase(page, ["development", "foodBank", "feeding"], 45_000)) {
      // Модалки начала года (спотлайт события) закрываем: иначе они съедают
      // клики первых шагов сценария.
      await dismissSpotlight(page);
      return code;
    }
    // Не началась: если мы всё ещё в лобби — добираем ботов и пробуем снова.
    if (!(await roomCode(page))) break;
    log(`партия не началась с ${attempt + 1}-й попытки — повторяю`);
    await applyLobbySettings(page, { players, bots: wantBots, modules, difficulty, deckSize }, { timeout: 8_000, log });
  }
  throw new Error(`партия не началась (via=${via}); экран: ${await bodyOf(page)}`);
}

// ── ход партии ───────────────────────────────────────────────────────────────

/** Клик по кнопке без перехвата оверлеями (журнал/спотлайт перекрывают док). */
async function domClick(loc) {
  return loc
    .first()
    .evaluate((el) => {
      el.click();
      return true;
    })
    .catch(() => false);
}

/** Закрывает модальную карточку события («Пропустить показ / клик по карточке»). */
export async function dismissSpotlight(page) {
  for (let i = 0; i < 8; i++) {
    const txt = await page.evaluate(() => document.body.innerText ?? "").catch(() => "");
    // Волна 6: фон спотлайта прозрачен для мыши, «дальше» — только карточка.
    if (!/клик (в любом месте|по карточке)/i.test(txt)) return true;
    const card = page.locator(".spotlight-card");
    if (await isVisible(card)) {
      await domClick(card);
    } else {
      await page.mouse.click(20, 300).catch(() => {});
    }
    await sleep(300);
  }
  return false;
}

/** Снять карточку «Ваш ход» (иначе её затемнение съест клики). */
export async function dismissTurnCard(page) {
  const card = page.locator("div[role='status']", { hasText: "Ваш ход" }).first();
  if (await isVisible(card)) {
    await page.mouse.click(6, 6).catch(() => {});
    await card.waitFor({ state: "detached", timeout: 4000 }).catch(() => {});
  }
}

/** Диалог подтверждения (портал, role=dialog) — по подписи кнопки. */
export async function confirmDialog(page, label) {
  const dialog = page.locator('[role="dialog"]').filter({ hasText: label });
  if (!(await waitUntil(() => isVisible(dialog), 4000, 200))) return false;
  const btn = dialog.getByRole("button", { name: label, exact: true });
  if (await isVisible(btn)) return safeClick(btn, 3000);
  return false;
}

/**
 * Один шаг «закончить фазу»: подтверждает защиту, закрывает карточку «Ваш ход»
 * и жмёт доступную кнопку завершения — «Закончить развитие» (развитие),
 * «Закончить ход» (питание, ведёт ход дальше) или «Закончить питание»
 * (досрочный конец фазы, всегда с подтверждением).
 * Возвращает true, если что-то нажали.
 */
export async function endPhaseStep(page) {
  await dismissTurnCard(page);
  // Атака хищника: диалог защиты перекрывает док — отказываемся от защиты.
  const noDefense = page.getByRole("button", { name: "Не защищаться" });
  if (await isVisible(noDefense)) {
    await domClick(noDefense);
    return true;
  }
  // Приоритет подписей: сначала завершение хода/развития, потом «питание» —
  // она завершает фазу целиком и требует подтверждения.
  for (const re of [/^Закончить развитие$/, /^Закончить ход$/, /^Пас$/]) {
    const buttons = page.getByRole("button", { name: re });
    const n = await buttons.count().catch(() => 0);
    for (let i = 0; i < n; i++) {
      const b = buttons.nth(i);
      if ((await isVisible(b)) && (await b.isEnabled().catch(() => false))) {
        if (await domClick(b)) return true;
      }
    }
  }
  const skip = page.getByRole("button", { name: "Закончить питание", exact: true });
  if ((await isVisible(skip)) && (await skip.first().isEnabled().catch(() => false))) {
    // Кнопка дока + подтверждение в диалоге. После клика диалог всегда есть.
    await domClick(skip.first());
    await confirmDialog(page, "Закончить питание");
    return true;
  }
  return false;
}

/**
 * Крутит «закончить фазу», пока на экране (или в сторе) не появится `needle`.
 *
 *   await advancePhase(page, /Кормовая база/);
 *   await advancePhase(page, () => phaseOf(page).then(p => p === "feeding"));
 *
 * `needle` — строка/RegExp по тексту body или функция-предикат. Если за
 * `timeout` не появилось — возвращает false (скрипт сам решает, провал это
 * или SKIP). Параллельно закрывает спотлайты и защиту от атак.
 */
export async function advancePhase(page, needle, { timeout = 120_000, poll = 300 } = {}) {
  const check =
    typeof needle === "function"
      ? needle
      : (() => {
          const re = needle instanceof RegExp ? needle : new RegExp(String(needle));
          return () =>
            page
              .evaluate((p) => new RegExp(p, "i").test(document.body.innerText ?? ""), re.source)
              .catch(() => false);
        })();
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return true;
    await advanceStepSafely(page);
    await sleep(poll);
  }
  return check();
}

/** endPhaseStep с глотанием ошибок страницы (dev-перезагрузки посреди шага). */
async function advanceStepSafely(page) {
  try {
    return await endPhaseStep(page);
  } catch {
    return false;
  }
}

/** Свой ход в развитии: кнопка «Животное» на карте руки активна. */
export function humanTurn(page) {
  return page
    .evaluate(() => {
      const row = document.querySelector("[data-hand-row]");
      if (!row) return false;
      return [...row.querySelectorAll("button")].some(
        (b) => b.textContent.trim() === "Животное" && !b.disabled,
      );
    })
    .catch(() => false);
}

/** Ждёт свой ход (и снимает карточку «Ваш ход»). */
export async function waitHumanTurn(page, timeout = 90_000) {
  const ok = await waitUntil(() => humanTurn(page), timeout, 250);
  if (ok) await dismissTurnCard(page);
  return ok;
}

// ── прогрев dev-сервера ──────────────────────────────────────────────────────

/**
 * Все serverFn сценариев: вызов с заведомо негодными данными компилирует
 * модуль, но НЕ трогает лимиты сервера. Волна 4 добавила квоты: создание
 * столов 10/час, вход/наблюдение/переподключение 30/мин на источник. Поэтому:
 *   — netCreateRoom получает capacity: 1 — схема (createRoomInput) режет это
 *     ДО сервиса, стол не создаётся и квота создания не тратится (прогрев
 *     раньше занимал до 10+ созданий на скрипт и сам же выедал лимит);
 *   — join/rejoin/spectate получают невалидный код "Z": entryGuard живёт в
 *     сервисе, до него запрос с невалидным кодом не доходит, и минута на
 *     30 входов остаётся сценарию;
 *   — остальные вызовы бьют по несуществующему столу "ZZZZ" и получают
 *     room-gone/seat-taken: это чтение/проверки, квот у них нет, зато
 *     серверные модули честно компилируются.
 */
const WARM_CALLS = [
  ["netCreateRoom", { name: "Прогрев", capacity: 1, botSeats: 0, difficulty: "normal" }],
  ["netJoinRoom", { code: "Z", name: "Прогрев" }],
  ["netListRooms", {}],
  ["netRejoin", { code: "Z", token: "0".repeat(32) }],
  ["netSetBots", { code: "ZZZZ", token: "0".repeat(32), count: 1 }],
  ["netKick", { code: "ZZZZ", token: "0".repeat(32), seat: 1 }],
  ["netSetCapacity", { code: "ZZZZ", token: "0".repeat(32), capacity: 3 }],
  ["netSetSettings", { code: "ZZZZ", token: "0".repeat(32), settings: { difficulty: "hard" } }],
  ["netSetRoomPrivacy", { code: "ZZZZ", token: "0".repeat(32), isPrivate: false }],
  ["netSetPassword", { code: "ZZZZ", token: "0".repeat(32), password: "1234" }],
  ["netSetColor", { code: "ZZZZ", token: "0".repeat(32), color: 0 }],
  ["netTransferHost", { code: "ZZZZ", token: "0".repeat(32), seat: 1 }],
  ["netKickWaiter", { code: "ZZZZ", token: "0".repeat(32), index: 0 }],
  ["netRoomInfo", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netClaimSeat", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netLeaveQueue", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netResign", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netSetName", { code: "ZZZZ", token: "0".repeat(32), name: "Прогрев" }],
  ["netChat", { code: "ZZZZ", token: "0".repeat(32), text: "прогрев" }],
  ["netSpectate", { code: "Z" }],
  ["netSpectatorPoll", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netReaction", { code: "ZZZZ", token: "0".repeat(32), emoji: "👍" }],
  ["netTyping", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netStart", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netAction", { code: "ZZZZ", token: "0".repeat(32), action: { type: "devPass" } }],
  ["netPoll", { code: "ZZZZ", token: "0".repeat(32) }],
  ["netAgain", { code: "ZZZZ", token: "0".repeat(32) }],
];

/** Клиентские модули партии: их первый импорт в dev тоже шлёт full-reload. */
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
  "/src/components/game/confirm-dialog.tsx",
  "/src/components/game/hint-note.tsx",
  "/src/components/game/icons.tsx",
  "/src/components/game/sound-toggle.tsx",
];

/**
 * Прогрев dev-сервера на отдельной вкладке: первый вызов КАЖДОГО serverFn в
 * dev компилирует его SSR-модуль, и Vite шлёт program reload — full-reload
 * всем вкладкам (они теряют сессию и падают в меню). Порядок:
 *   1) пакет serverFn с негодными данными (ответ неважен — важен сам вызов);
 *   2) импорт клиентских модулей партии;
 *   3) настоящий сетевой стол с ботом до фазы развития — чтобы скомпилировался
 *      и прогрелся весь игровой UI (кости, журнал, док);
 *   4) контрольный пакет serverFn и затишье без перезагрузок.
 *
 * Возвращает true, если вкладка перестала перезагружаться. Скрипты вызывают
 * его до сценарных вкладок; вкладка прогрева закрывается.
 */
export async function warmupServer(browser, { timeout = 240_000, quietMs = 4_000, log = () => {} } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const deadline = Date.now() + timeout;
  let navs = 0;
  // Реальные перезагрузки документа. framenavigated для этого не годится:
  // клиент меняет адрес через history.replaceState (?room=КОД), и Playwright
  // тоже считает это навигацией.
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
  const quiet = async (ms, cap) => {
    lastNavAt = Date.now();
    const end = Date.now() + cap;
    while (Date.now() < end && Date.now() - lastNavAt < ms) await sleep(400);
  };
  const batch = () =>
    page
      .evaluate(async (calls) => {
        const api = await import("/src/lib/net/api.ts");
        let done = 0;
        for (const [name, data] of calls) {
          try {
            await api[name]({ data });
          } catch {
            /* ответ неважен — важно, что серверный модуль скомпилирован */
          }
          done += 1;
        }
        return done;
      }, WARM_CALLS)
      .catch(() => 0);

  try {
    await gotoUrl(page, `${BASE}/`);
    for (let round = 0; round < 6; round++) {
      const before = navs;
      let done = await batch();
      await sleep(2500);
      if (navs !== before) done = 0;
      if (done === WARM_CALLS.length && Date.now() < deadline) {
        const before2 = navs;
        done = await batch();
        await sleep(2500);
        if (navs === before2 && done === WARM_CALLS.length) break;
      }
      await quiet(quietMs, 15_000);
    }

    // Игровой UI: сетевой стол с ботом до фазы развития (в лобби эти модули
    // не грузятся, и их первый импорт в партии раньше рвал сценарий).
    for (let attempt = 0; attempt < 3 && Date.now() < deadline; attempt++) {
      await gotoUrl(page, `${BASE}/`);
      const afterLoad = loads;
      await page
        .evaluate(async (mods) => {
          for (const m of mods) {
            try {
              await import(m);
            } catch {
              /* модуль мог быть переименован параллельной волной */
            }
          }
        }, WARM_MODULES)
        .catch(() => {});
      try {
        // navigate: false — меню открыто выше; лишняя навигация сбила бы
        // счётчик перезагрузок (startNetGame сам делает goto при navigate).
        const code = await startNetGame(page, {
          name: "Прогрев",
          players: 2,
          bots: 1,
          navigate: false,
          log,
        });
        log(`прогрев: стол ${code} поднят`);
        await dismissSpotlight(page);
        const journal = page.getByRole("button", { name: /Журнал/ }).first();
        await safeClick(journal, 5000);
      } catch (e) {
        log(`прогрев: шаг партии не удался (${String(e?.message ?? e).split("\n")[0]})`);
      }
      await sleep(2500);
      if (loads === afterLoad) return true;
      await quiet(quietMs, 15_000);
    }
    return loads === 0;
  } finally {
    await ctx.close().catch(() => {});
  }
}
