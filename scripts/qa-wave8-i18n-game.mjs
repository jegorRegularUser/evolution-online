/**
 * QA волны 8 (i18n): локализация ПАРТИИ — журнал движка, доки, spotlight,
 * чат и серверные сообщения.
 *
 * Проверяет (при живом dev-сервере, node scripts/qa-wave8-i18n-game.mjs):
 *  (а) русская партия с ботом («Континенты»+«Растения»+«Трава и грибы»):
 *      фазы развитие/кормовая база/питание, журнал с событиями (охота,
 *      фишки с растений/флоры), карточки spotlight, чат с быстрыми фразами,
 *      таймер хода, диалог выхода — всё по-русски, скриншоты;
 *  (б) переключение языка ПРЯМО В ПАРТИИ (без перезагрузки): шапка, фильтры
 *      журнала, кнопки доков и сами записи журнала меняются на английский;
 *      записи читаются как текст, а не как ключи (нет «log.», нет «{param}»);
 *  (в) английская партия с ботом (чистый localStorage evo-lang=en): фазы,
 *      доки, журнал, spotlight, быстрые фразы — по-английски, скриншоты;
 *  (г) сетевая ошибка в партии показывается переведённой: двойная отправка
 *      чата подряд ловит лимит «слишком часто» и рисует EN-тост.
 *
 * Язык задаётся ЯВНО через localStorage["evo-lang"] (не полагаемся на locale
 * машины). Фазы жмутся локализованными кнопками доков (RU и EN), с запасным
 * проходом через экшены стора — те же действия, что делают кнопки.
 * Скриншоты — в %TEMP% (EVO_SHOTS), НЕ в репозиторий.
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  dismissSpotlight,
  expectText,
  isEnabled,
  isVisible,
  phaseOf,
  safeClick,
  trackPage,
  waitPhase,
  waitUntil,
  warmupServer,
} from "./qa-lib.mjs";

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
const shot = (page, name) => page.screenshot({ path: join(SHOTS, `wave8-${name}.png`) }).catch(() => {});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Открыть меню с явно заданным языком (localStorage, не locale машины).
 *  Готовность меню меряем по колонкам [data-menu-col] — языконезависимо
 *  (menuReady из qa-lib ждёт русские подписи полей). */
async function openMenuLang(browser, lang) {
  const ctx = await browser.newContext({
    locale: lang === "en" ? "en-US" : "ru-RU",
    viewport: { width: 1440, height: 900 },
    storageState: {
      cookies: [],
      origins: [
        {
          origin: new URL(BASE).origin,
          localStorage: [{ name: "evo-lang", value: lang }],
        },
      ],
    },
  });
  const page = await ctx.newPage();
  const errs = trackPage(page, `ctx-${lang}`);
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
  await waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), 25_000, 300);
  await waitUntil(() => page.locator("[data-menu-col]").count().then((n) => n > 0).catch(() => false), 30_000, 400);
  await sleep(600);
  return { ctx, page, errs };
}

/** Текст записей журнала в DOM (data-feed-item без чата). */
function logTexts(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-feed-item]")]
      .filter((el) => el.getAttribute("data-feed-item") !== "chat")
      .map((el) => (el.textContent ?? "").trim()),
  );
}

/** Кнопка журнала в шапке — по локализованной подписи. */
const journalButton = (page, lang) =>
  page.getByRole("button", { name: lang === "en" ? "Journal & chat" : "Журнал и чат" }).first();

/** Английские формулировки журнала (имена ботов остаются кириллическими —
 *  это имена собственные, поэтому проверяем слова, а не «нет кириллицы»). */
const EN_PHRASES =
  /places a new animal|plays first|takes food|passes\.|eats |hunts|steals|ends the turn|Year \d|trait|token|dies|Extinction|Growth|deck|Food bank|New plant|New flora|flora card|mark|species|animal/i;
/** Русские формулировки журнала — их в EN-ленте быть не должно. */
const RU_PHRASES =
  /выкладывает новое животное|пасует\.|заканчивает ход|Первым ходит|Кормовая база:|атакует животное|берёт еду/i;

/** Открыть журнал экшеном стора (кнопка — toggle, повторный клик закрывает). */
async function openJournal(page) {
  await page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      if (s && !s.logOpen) s.setLogOpen(true);
    })
    .catch(() => {});
  await sleep(500);
}

/**
 * Поднять сетевую партию БЕЗ русской UI-проводки (qa-lib ждёт русские подписи):
 * создание стола экшеном кнопки «Создать стол» и старт экшеном «Начать год».
 * Принимает те же { players, bots, modules }, что startNetGame из qa-lib.
 * Возвращает код стола.
 */
async function startNetGameViaStore(page, cfg) {
  const { createRoomViaStore } = await import("./qa-lib.mjs");
  const players = cfg.players ?? 2;
  const bots = cfg.bots == null ? players - 1 : cfg.bots;
  const r = await createRoomViaStore(page, {
    name: cfg.name,
    capacity: players,
    botSeats: bots,
    difficulty: cfg.difficulty ?? "normal",
    modules: cfg.modules ?? {},
  });
  if (!r.ok) throw new Error(`стол не создан: ${r.error}`);
  await waitUntil(() => page.locator("[data-room-code]").count().then((n) => n > 0).catch(() => false), 20_000, 400);
  for (let i = 0; i < 3; i++) {
    await page
      .evaluate(() => {
        const s = globalThis.__evoStore?.getState?.();
        if (s?.net) void s.netStart();
      })
      .catch(() => {});
    if (await waitPhase(page, ["development", "foodBank", "feeding"], 25_000)) {
      await dismissSpotlight(page);
      return r.code;
    }
  }
  throw new Error(`партия не началась (стол ${r.code})`);
}

/** Свой ход в фазе (по стору — не зависит от того, чья сейчас очередь). */
function ownTurn(page, phase) {
  return page
    .evaluate(
      (wantPhase) => {
        const s = globalThis.__evoStore?.getState?.();
        const st = s?.state;
        return Boolean(
          s &&
            st &&
            st.phase === wantPhase &&
            s.net &&
            !s.net.spectating &&
            st.currentPlayerId === s.net.seat &&
            !st.pendingAttack,
        );
      },
      phase,
    )
    .catch(() => false);
}

/** Выложить животное из руки (кнопка «Животное» на карте руки); с «Континентами» —
 *  затем клик по полосе Лавразии. Кнопка карты руки локализуется волной cards,
 *  поэтому подпись здесь языконезависимая. */
async function placeAnimal(page) {
  const animal = page.locator("[data-hand-row] button", { hasText: "Животное" }).first();
  if (!(await isEnabled(animal))) return false;
  if (!(await safeClick(animal))) return false;
  await sleep(600);
  const zone = page.locator('[data-zone="laurasia"][role="button"]').first();
  if (await isVisible(zone)) {
    await safeClick(zone);
    await sleep(800);
    return true;
  }
  // Без «Континентов» животное ложится сразу.
  return true;
}

/** Карточка «Ваш ход» появляется в двух языках — снимаем её кликом мимо. */
async function dismissTurnCardAny(page) {
  const card = page.locator("div[role='status']").filter({ hasText: /Ваш ход|Your turn/ }).first();
  if (await isVisible(card)) {
    await page.mouse.click(6, 6).catch(() => {});
    await card.waitFor({ state: "detached", timeout: 4000 }).catch(() => {});
  }
}

/**
 * Один шаг «закончить фазу» на текущем языке: кнопки дока, подтверждение
 * «Закончить питание», отказ от защиты; запасной проход — экшены стора
 * (те же действия, что делают кнопки).
 */
async function driveStep(page, lang) {
  await dismissTurnCardAny(page);
  const noDef = page.getByRole("button", { name: lang === "en" ? "Don't defend" : "Не защищаться" });
  if (await isVisible(noDef)) {
    await safeClick(noDef);
    return true;
  }
  const names = lang === "en" ? [/^End development$/, /^End turn$/, /^Pass$/] : [/^Закончить развитие$/, /^Закончить ход$/, /^Пас$/];
  for (const name of names) {
    const btns = page.getByRole("button", { name });
    const n = await btns.count().catch(() => 0);
    for (let i = 0; i < n; i++) {
      const b = btns.nth(i);
      if ((await isVisible(b)) && (await b.isEnabled().catch(() => false))) {
        if (await safeClick(b, 2500)) return true;
      }
    }
  }
  const skipName = lang === "en" ? "End feeding" : "Закончить питание";
  const skip = page.getByRole("button", { name: skipName, exact: true });
  if ((await isVisible(skip.first())) && (await skip.first().isEnabled().catch(() => false))) {
    await safeClick(skip.first());
    const confirm = page.locator('[role="dialog"]').getByRole("button", { name: skipName, exact: true });
    await waitUntil(() => isVisible(confirm.first()), 5000, 200);
    await safeClick(confirm.first());
    return true;
  }
  // Запасной проход: те же действия кнопок через стор (языконезависимо).
  // Только в свой ход — иначе сервер ответит «ход недопустим» и на столе
  // всплывёт лишний тост об ошибке.
  return page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      const st = s?.state;
      if (!s || !st || !s.net) return false;
      const mine = st.currentPlayerId === s.net.seat;
      if (st.pendingAttack && st.pendingAttack.waitingFor === s.net.seat) {
        s.dispatch({ type: "chooseDefense", kind: "none" });
        return true;
      }
      if (st.phase === "development" && mine) {
        s.dispatch({ type: "devPass" });
        return true;
      }
      if (st.phase === "feeding" && mine) {
        s.dispatch({ type: "feedEndTurn" });
        return true;
      }
      return false;
    })
    .catch(() => false);
}

/**
 * Дожать фазы человека до одной из `want`, попутно снимая первый spotlight
 * (кубики базы/убийство) и таймер хода. Возвращает достигнутую фазу.
 */
async function driveToPhase(page, want, lang, { timeout = 180_000, spotlightShot, timerShot } = {}) {
  const wanted = Array.isArray(want) ? want : [want];
  const deadline = Date.now() + timeout;
  let spotDone = false;
  let timerSeen = false;
  let last = null;
  while (Date.now() < deadline) {
    last = await phaseOf(page);
    if (last && wanted.includes(last)) return { phase: last, timerSeen };
    if (!timerSeen && (await page.locator("[data-turn-timer]").count().catch(() => 0))) {
      timerSeen = true;
      if (timerShot) {
        await shot(page, timerShot);
        ok(`таймер хода снят (${timerShot})`);
      }
    }
    if (!spotDone) {
      const card = page.locator(".spotlight-card");
      if (await isVisible(card)) {
        if (spotlightShot) {
          await shot(page, spotlightShot);
          const title = (await card.locator("h2").first().textContent().catch(() => ""))?.trim() ?? "";
          ok(`spotlight снят: «${title}» (${spotlightShot})`);
        }
        spotDone = true;
      }
    }
    await dismissSpotlight(page);
    await dismissTurnCardAny(page);
    await driveStep(page, lang);
    await sleep(450);
  }
  return { phase: await phaseOf(page), timerSeen };
}

/** Играть, пока в журнале не появится шаблон (или таймаут); снимает показы. */
async function playUntil(page, pattern, lang, { timeout = 240_000, spotlightShot, timerShot } = {}) {
  const deadline = Date.now() + timeout;
  let timerSeen = false;
  let spotDone = false;
  while (Date.now() < deadline) {
    const texts = await logTexts(page);
    if (texts.some((t) => pattern.test(t))) return { found: true, timerSeen };
    if (!timerSeen && (await page.locator("[data-turn-timer]").count().catch(() => 0))) {
      timerSeen = true;
      if (timerShot) {
        await shot(page, timerShot);
        ok(`таймер хода снят (${timerShot})`);
      }
    }
    if (!spotDone) {
      const card = page.locator(".spotlight-card");
      if (await isVisible(card)) {
        if (spotlightShot) {
          await shot(page, spotlightShot);
          const title = (await card.locator("h2").first().textContent().catch(() => ""))?.trim() ?? "";
          ok(`spotlight снят: «${title}» (${spotlightShot})`);
        }
        spotDone = true;
      }
    }
    await dismissSpotlight(page);
    await dismissTurnCardAny(page);
    await driveStep(page, lang);
    await sleep(450);
  }
  const texts = await logTexts(page);
  return { found: texts.some((t) => pattern.test(t)), timerSeen };
}

const browser = await chromium.launch();

// Прогрев: первый импорт модулей и serverFn в dev шлёт full-reload вкладкам.
{
  const warmed = await warmupServer(browser, { log: (m) => console.log(`     ${m}`) });
  check(warmed, "dev-сервер прогрет (перезагрузки прекратились)");
}

// ── (а) русская партия: «Континенты» + «Растения» + «Трава и грибы» ────────
{
  const { ctx, page, errs } = await openMenuLang(browser, "ru");
  const { startNetGame } = await import("./qa-lib.mjs");
  const code = await startNetGame(page, {
    name: "QA-Русский",
    players: 2,
    bots: 1,
    modules: { continents: true, plants: true, fungi: true },
  });
  ok(`русская партия поднята (стол ${code})`);
  await dismissSpotlight(page);
  await dismissTurnCardAny(page);
  await waitUntil(async () => (await phaseOf(page)) === "development", 20_000, 300);
  await expectText(page, /Закончить развитие/, 10_000, "док развития (ru)");
  await expectText(page, /Год 1 · Развитие/, 10_000, "шапка: год и фаза (ru)");
  await expectText(page, /Лавразия|Гондвана/, 10_000, "территории в табло (ru)");
  // Своё животное на столе: док питания и табло станут содержательнее.
  await waitUntil(() => ownTurn(page, "development"), 30_000, 400);
  await dismissTurnCardAny(page);
  if (await placeAnimal(page)) ok("животное выложено из руки (Лавразия)");
  await shot(page, "01-ru-development.png");

  // Журнал в развитии: записи движка по-русски.
  await safeClick(journalButton(page, "ru"));
  await expectText(page, /выкладывает новое животное|Первым ходит/, 10_000, "журнал: записи развития (ru)");
  await shot(page, "02-ru-journal-dev.png");
  const ruDev = await logTexts(page);
  check(ruDev.length > 0, `журнал (ru): ${ruDev.length} записей движка`);
  check(
    ruDev.every((t) => !/^\s*log\./.test(t) && !/\{[a-z]+\}/.test(t)),
    "журнал (ru): без сырых ключей и неподставленных параметров",
  );

  // Чат: быстрые фразы по-русски, сообщение доезжает в ленту.
  await safeClick(page.getByRole("button", { name: "Привет!", exact: true }).first());
  await expectText(page, /QA-Русский: Привет!/, 10_000, "быстрая фраза ушла в чат (ru)");
  await shot(page, "03-ru-chat.png");

  // Кормовая база: spotlight с кубиками Океана, затем питание.
  const toBank = await driveToPhase(page, "foodBank", "ru", { timeout: 120_000, spotlightShot: "04-ru-spotlight-bank.png" });
  check(toBank.phase === "foodBank", `партия дошла до кормовой базы (фаза ${toBank.phase})`);
  const toFeed = await driveToPhase(page, "feeding", "ru", { timeout: 120_000, timerShot: "07-ru-turn-timer.png" });
  check(toFeed.phase === "feeding", `партия дошла до питания (фаза ${toFeed.phase})`);
  // Док питания — в СВОЙ ход (пока ходит бот, в футере «Дарвин ходит…»).
  const myFeed = await waitUntil(() => ownTurn(page, "feeding"), 90_000, 500);
  await dismissTurnCardAny(page);
  await expectText(page, /Взять еду|Закончить ход/, 10_000, "док питания (ru)");
  await shot(page, "05-ru-feeding.png");
  if (!myFeed) warn("свой ход питания не наступил за 90 с — скриншот дока мог снять чужой ход");

  // Таймер хода: кормим своё животное (экшеном кнопки «Взять еду» — с
  // растениями кнопка при нескольких целях лишь ставит намерение) — действий
  // не остаётся, сервер ставит 30-секундный дедлайн, у имени появляется отсчёт.
  {
    const ate = await page
      .evaluate(async () => {
        const s = globalThis.__evoStore?.getState?.();
        const st = s?.state;
        if (!s || !st || !s.net) return false;
        const eng = await import("/src/game/engine.ts");
        const acts = eng.legalFeedActions(st, s.net.seat);
        const eat = acts.find(
          (a) => a.type === "feedTake" || a.type === "feedTakePlant" || a.type === "feedTakeFlora",
        );
        if (!eat) return false;
        s.dispatch(eat);
        return true;
      })
      .catch(() => false);
    if (ate) {
      const timer = await waitUntil(
        () => page.locator("[data-turn-timer]").count().then((n) => n > 0).catch(() => false),
        45_000,
        500,
      );
      if (timer) {
        await shot(page, "07-ru-turn-timer.png");
        ok("таймер хода снят (07-ru-turn-timer.png)");
      } else {
        warn("таймер хода не появился после кормления (остались действия)");
      }
    } else {
      warn("взять еду было нечем — таймер хода не форсируется");
    }
  }

  // Играем до событий охоты/фишек в журнале; попутно ловим spotlight убийства.
  const hunt = await playUntil(page, /атакует|охотится|пиратствует|съедает|отравлен|тратит жировой/, "ru", {
    timeout: 300_000,
    spotlightShot: "06-ru-spotlight-kill.png",
  });
  if (hunt.found) ok("журнал (ru): события охоты/питания пойманы");
  else warn("журнал (ru): событий охоты за таймаут не случилось (бот без хищника)");

  // Журнал с событиями питания.
  await openJournal(page);
  await shot(page, "08-ru-journal-events.png");
  const ruFeed = await logTexts(page);
  check(ruFeed.length > 0 && ruFeed.some((t) => /[а-яё]/i.test(t)), `журнал (ru): ${ruFeed.length} записей на русском`);
  check(
    ruFeed.every((t) => !/^\s*log\./.test(t) && !/\{[a-z]+\}/.test(t)),
    "журнал (ru после игры): без ключей и неподставленных параметров",
  );

  // Диалог выхода — по-русски.
  await safeClick(page.getByRole("button", { name: "Покинуть стол" }).first());
  await expectText(page, /Покинуть стол\?/, 8_000, "диалог выхода (ru)");
  await shot(page, "09-ru-leave-dialog.png");
  await safeClick(page.getByRole("button", { name: "Остаться", exact: true }).first());

  // ── (б) переключение языка прямо в партии, без перезагрузки ─────────────
  await safeClick(page.locator("[data-lang-toggle]").first());
  await expectText(page, /Year \d+ · (Development|Feeding)/, 8_000, "шапка сменилась на EN без перезагрузки");
  await expectText(page, /Laurasia|Gondwana/, 8_000, "территории сменились на EN");
  await waitUntil(() => ownTurn(page, "feeding") || ownTurn(page, "development"), 90_000, 500);
  await dismissTurnCardAny(page);
  await expectText(page, /End development|End turn|Take food/, 10_000, "док сменился на EN");
  await shot(page, "10-en-table-toggled.png");

  // Журнал: записи движка перерисовались по-английски (по key, не по text).
  // Имена ботов остаются кириллическими (имена собственные) — поэтому проверяем
  // английские формулировки и отсутствие русских фраз журнала, а не «нет
  // кириллицы вовсе».
  await openJournal(page);
  await expectText(page, /All|Events|Chat/, 8_000, "фильтры журнала на EN");
  await shot(page, "11-en-journal-toggled.png");
  const enToggled = await logTexts(page);
  if (!enToggled.some((t) => EN_PHRASES.test(t))) {
    console.log("DEBUG html.lang:", await page.evaluate(() => document.documentElement.lang).catch(() => "?"));
    console.log("DEBUG localStorage:", await page.evaluate(() => localStorage.getItem("evo-lang")).catch(() => "?"));
    console.log("DEBUG store logOpen:", await page.evaluate(() => globalThis.__evoStore?.getState?.().logOpen).catch(() => "?"));
    console.log("DEBUG первые записи:", JSON.stringify(enToggled.slice(0, 10), null, 1));
  }
  check(
    enToggled.length > 0 && enToggled.some((t) => EN_PHRASES.test(t)),
    `журнал после переключения: ${enToggled.length} записей, английские формулировки на месте`,
  );
  check(
    !enToggled.some((t) => RU_PHRASES.test(t)),
    "журнал (EN): русских формулировок журнала нет",
  );
  check(
    enToggled.every((t) => !/^\s*log\./.test(t) && !/\{[a-z]+\}/.test(t)),
    "журнал (EN): читается текстом — без ключей «log.*» и «{param}»",
  );
  // Быстрые фразы чата — тоже сменились.
  check(
    await isVisible(page.getByRole("button", { name: "Hi!", exact: true }).first()),
    "быстрые фразы чата сменились на EN",
  );

  // Сетевая ошибка в партии: двойная отправка чата ловит лимит «слишком часто»
  // и показывает переведённый тост.
  await page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      if (!s) return false;
      void s.sendChat("one");
      void s.sendChat("two");
      return true;
    })
    .catch(() => false);
  const toast = page.locator("[data-sonner-toast]").filter({ hasText: /Too fast/i }).first();
  let toastSeen = await waitUntil(() => isVisible(toast), 8_000, 300);
  let toastText = "";
  if (toastSeen) toastText = ((await toast.textContent().catch(() => "")) ?? "").trim();
  // Тост мог уйти до прочтения — пробуем ещё раз второй отправкой.
  if (!toastSeen) {
    await page
      .evaluate(() => {
        const s = globalThis.__evoStore?.getState?.();
        if (s) void s.sendChat("three");
      })
      .catch(() => false);
    toastSeen = await waitUntil(() => isVisible(toast), 8_000, 300);
    if (toastSeen) toastText = ((await toast.textContent().catch(() => "")) ?? "").trim();
  }
  check(
    toastSeen && /Too fast|wait a second/i.test(toastText),
    `сетевая ошибка в партии показана по-английски: «${toastText}»`,
  );
  await shot(page, "12-en-net-error-toast.png");

  errs.forEach(fail);
  await ctx.close();
}

// ── (в) английская партия с чистого входа (evo-lang=en) ────────────────────
{
  const { ctx, page, errs } = await openMenuLang(browser, "en");
  const code = await startNetGameViaStore(page, { name: "QA-English", players: 2, bots: 1, modules: {} });
  ok(`английская партия поднята (стол ${code})`);
  await dismissSpotlight(page);
  await dismissTurnCardAny(page);
  await waitUntil(async () => (await phaseOf(page)) === "development", 20_000, 300);
  await expectText(page, /End development/, 10_000, "док развития (en)");
  await expectText(page, /Year 1 · Development/, 10_000, "шапка: год и фаза (en)");
  await waitUntil(() => ownTurn(page, "development"), 30_000, 400);
  await dismissTurnCardAny(page);
  if (await placeAnimal(page)) ok("животное выложено из руки (en-партия)");
  await shot(page, "13-en-development.png");

  await openJournal(page);
  await expectText(page, /places a new animal|plays first/, 10_000, "журнал: записи развития (en)");
  await shot(page, "14-en-journal-dev.png");

  // Кормовая база без дополнений: кубики + карточка spotlight.
  const toBank = await driveToPhase(page, "foodBank", "en", { timeout: 120_000, spotlightShot: "15-en-spotlight-bank.png" });
  check(toBank.phase === "foodBank", `EN-партия дошла до кормовой базы (фаза ${toBank.phase})`);
  const toFeed = await driveToPhase(page, "feeding", "en", { timeout: 120_000 });
  check(toFeed.phase === "feeding", `EN-партия дошла до питания (фаза ${toFeed.phase})`);
  await waitUntil(() => ownTurn(page, "feeding"), 90_000, 500);
  await dismissTurnCardAny(page);
  await expectText(page, /Take food|End turn/, 10_000, "док питания (en)");
  await shot(page, "16-en-feeding.png");

  // Хищничество: в базовой игре боты охотятся куда охотнее — ловим атаку
  // в журнале и карточку spotlight убийства (гарант не обязателен: карта
  // бота — случайность).
  const huntEn = await playUntil(page, /eats |attacks |hunts|steals from|loses an animal/i, "en", {
    timeout: 150_000,
    spotlightShot: "17-en-spotlight-kill.png",
  });
  if (huntEn.found) ok("журнал (en): хищничество поймано");
  else warn("журнал (en): хищничество за таймаут не случилось (карта бота)");

  // Журнал с событиями питания — английские формулировки (имена ботов
  // остаются кириллическими — это имена собственные).
  await openJournal(page);
  await shot(page, "18-en-journal-events.png");
  const enFeed = await logTexts(page);
  if (!enFeed.some((t) => EN_PHRASES.test(t))) {
    console.log("DEBUG html.lang:", await page.evaluate(() => document.documentElement.lang).catch(() => "?"));
    console.log("DEBUG localStorage:", await page.evaluate(() => localStorage.getItem("evo-lang")).catch(() => "?"));
    console.log(
      "DEBUG store log (конец):",
      JSON.stringify(
        await page
          .evaluate(() =>
            (globalThis.__evoStore?.getState?.().state?.log ?? []).slice(-6).map((e) => ({ key: e.key, text: e.text })),
          )
          .catch(() => "?"),
      ),
    );
    console.log("DEBUG DOM записи:", JSON.stringify(enFeed.slice(-10), null, 1));
  }
  check(
    enFeed.length > 0 && enFeed.some((t) => EN_PHRASES.test(t)),
    `журнал (en): ${enFeed.length} записей с английскими формулировками`,
  );
  check(
    !enFeed.some((t) => RU_PHRASES.test(t)),
    "журнал (en): русских формулировок журнала нет",
  );
  check(
    enFeed.every((t) => !/^\s*log\./.test(t) && !/\{[a-z]+\}/.test(t)),
    "журнал (en): без ключей и неподставленных параметров",
  );

  // Быстрая фраза по-английски.
  await safeClick(page.getByRole("button", { name: "Nice move!", exact: true }).first());
  await expectText(page, /QA-English: Nice move!/, 10_000, "быстрая фраза ушла в чат (en)");
  await shot(page, "19-en-chat.png");

  errs.forEach(fail);
  await ctx.close();
}

await browser.close();

// ── вердикт ─────────────────────────────────────────────────────────────────

console.log("");
if (problems.length) {
  console.log(`VERDICT: FAIL — ${problems.length} проблем(а)`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
if (warnings.length) {
  console.log(`VERDICT: PASS с предупреждениями (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
  process.exit(0);
}
console.log("VERDICT: PASS — партия локализована целиком: журнал, доки, spotlight, чат, ошибки");
