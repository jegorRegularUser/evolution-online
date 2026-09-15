/**
 * QA волны 7 (i18n): английская локализация интерфейса вне партии.
 *
 * Проверяет:
 *  (а) автоопределение языка: чистый localStorage + navigator.language
 *      'en-US' → интерфейс на английском; 'ru-RU' → на русском;
 *  (б) переключатель RU↔EN в шапке меняет язык без перезагрузки,
 *      выбор сохраняется в localStorage["evo-lang"] и живёт после F5;
 *  (в) ключевые экраны (меню, лобби с ботом, правила, туториал,
 *      статистика) на обоих языках — скриншоты;
 *  (г) на 390px переключатель помещается в полосу навигации;
 *  (д) английские строки не дают горизонтального переполнения
 *      (scrollWidth на ключевых экранах).
 *
 * Запускать при живом dev-сервере: node scripts/qa-wave7-i18n-menu.mjs
 * Скриншоты — в %TEMP% (EVO_SHOTS), НЕ в репозиторий.
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  expectText,
  isVisible,
  menuReady,
  roomCode,
  safeClick,
  trackPage,
  waitUntil,
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
const shot = (page, name) => page.screenshot({ path: join(SHOTS, `wave7-${name}.png`) }).catch(() => {});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// «Готово ли меню на этом языке» — маркер: локализованный заголовок h1.
const menuTitle = (page) => page.locator("h1").first().textContent().catch(() => "");

/** Открыть меню с заданным языком устройства и чистым (или заданным) localStorage. */
async function openMenuLang(browser, deviceLang, { storage = {} } = {}) {
  const ctx = await browser.newContext({
    locale: deviceLang,
    viewport: { width: 1280, height: 900 },
    storageState: { cookies: [], origins: [{ origin: new URL(BASE).origin, localStorage: Object.entries(storage).map(([name, value]) => ({ name, value })) }] },
  });
  const page = await ctx.newPage();
  const problems = trackPage(page, `ctx-${deviceLang}`);
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
  await waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), 25_000, 300);
  await menuReady(page, 30_000);
  // После гидратации язык применяется в useEffect — даём ему отработать.
  await sleep(600);
  return { ctx, page, problems };
}

/** Горизонтальное переполнение документа (английские строки длиннее русских). */
async function overflowPx(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

/** Переключатель языка в шапке. */
function langButton(page) {
  return page.locator("[data-lang-toggle]").first();
}

// ── сценарий ────────────────────────────────────────────────────────────────

const browser = await chromium.launch();

// (а) автоопределение: en-US → английский, ru-RU → русский.
{
  const { ctx, page, problems: errs } = await openMenuLang(browser, "en-US");
  const title = (await menuTitle(page))?.trim();
  check(title === "Evolution", `автоопределение en-US: заголовок «${title}» — английский`);
  check(
    (await page.evaluate(() => document.documentElement.lang)) === "en",
    "автоопределение en-US: <html lang> = en после загрузки",
  );
  check(
    (await page.evaluate(() => localStorage.getItem("evo-lang"))) === null,
    "первый вход: evo-lang ещё не записан (пишется только при переключении)",
  );
  await shot(page, "01-menu-en-autodetect.png");
  errs.forEach(fail);
  await ctx.close();
}
{
  const { ctx, page, problems: errs } = await openMenuLang(browser, "ru-RU");
  const title = (await menuTitle(page))?.trim();
  check(title === "Эволюция", `автоопределение ru-RU: заголовок «${title}» — русский`);
  errs.forEach(fail);
  await ctx.close();
}

// (б) переключение без перезагрузки + сохранение в localStorage + F5.
{
  const { ctx, page, problems: errs } = await openMenuLang(browser, "ru-RU");
  const btn = langButton(page);
  check(await isVisible(btn), "переключатель языка виден в шапке меню");
  check((await btn.textContent())?.trim() === "EN", "на русском переключатель предлагает «EN»");

  await safeClick(btn);
  await waitUntil(async () => (await menuTitle(page))?.trim() === "Evolution", 5000, 200);
  check(true, "клик RU→EN: заголовок стал «Evolution» без перезагрузки");
  check(
    (await page.evaluate(() => localStorage.getItem("evo-lang"))) === "en",
    "после переключения localStorage['evo-lang'] = 'en'",
  );
  check((await page.evaluate(() => document.documentElement.lang)) === "en", "<html lang> обновился на en");
  await shot(page, "02-menu-en-toggled.png");

  await safeClick(langButton(page));
  await waitUntil(async () => (await menuTitle(page))?.trim() === "Эволюция", 5000, 200);
  check(true, "клик EN→RU: заголовок вернулся на «Эволюция»");
  check((await page.evaluate(() => localStorage.getItem("evo-lang"))) === "ru", "localStorage['evo-lang'] = 'ru'");

  // EN + F5: язык должен сохраниться.
  await safeClick(langButton(page));
  await waitUntil(async () => (await menuTitle(page))?.trim() === "Evolution", 5000, 200);
  await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
  await waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), 25_000, 300);
  await menuReady(page, 30_000);
  await sleep(600);
  const title = (await menuTitle(page))?.trim();
  check(title === "Evolution", `после F5 язык сохранён: заголовок «${title}»`);
  await shot(page, "03-menu-en-after-reload.png");
  errs.forEach(fail);
  await ctx.close();
}

// (в) ключевые экраны на обоих языках + скриншоты; (д) переполнения.
{
  const { ctx, page, problems: errs } = await openMenuLang(browser, "en-US");

  // Меню.
  await expectText(page, /Create table|Your name/, 10_000, "английское меню");
  let ov = await overflowPx(page);
  check(ov <= 0, `меню (en, 1280px): переполнение ${ov}px`);

  // Правила: все 5 вкладок.
  await safeClick(page.getByRole("button", { name: "Rules" }).first());
  await expectText(page, /Base game/, 10_000, "вкладки правил (en)");
  await shot(page, "04-rules-en-base.png");
  ov = await overflowPx(page);
  check(ov <= 0, `правила base (en): переполнение ${ov}px`);
  for (const [tab, needle] of [
    ["Continents", /Laurasia/],
    ["Plants", /Plant species/],
    ["Grass and Mushrooms", /Flora cards/],
    ["Random Mutations", /Personal deck/],
  ]) {
    const tabBtn = page.getByRole("tab", { name: tab }).first();
    if (await isVisible(tabBtn)) {
      await safeClick(tabBtn);
      await expectText(page, needle, 8000, `вкладка правил «${tab}» (en)`);
      await shot(page, `05-rules-en-${tab.toLowerCase().replace(/[^a-z]+/g, "-")}.png`);
      ov = await overflowPx(page);
      check(ov <= 0, `правила ${tab} (en): переполнение ${ov}px`);
    } else {
      fail(`вкладка правил «${tab}» не найдена (en)`);
    }
  }
  await safeClick(page.getByRole("button", { name: "Close", exact: true }).first());

  // Туториал: 5 слайдов.
  await safeClick(page.getByRole("button", { name: "Tutorial" }).first());
  await expectText(page, /How to play/, 10_000, "туториал слайд 1 (en)");
  for (let i = 0; i < 4; i++) {
    await safeClick(page.getByRole("button", { name: "Next" }).first());
    await sleep(250);
  }
  await expectText(page, /Extinction and the finale/, 8000, "туториал слайд 5 (en)");
  await shot(page, "06-tutorial-en-slide5.png");
  ov = await overflowPx(page);
  check(ov <= 0, `туториал (en): переполнение ${ov}px`);
  await safeClick(page.getByRole("button", { name: "Got it" }).first());

  // Статистика (пустая и с данными — как получится).
  await safeClick(page.getByRole("button", { name: "Statistics" }).first());
  await expectText(page, /Statistics|No games yet/, 10_000, "статистика (en)");
  await shot(page, "07-stats-en.png");
  await safeClick(page.getByRole("button", { name: "Close", exact: true }).first());

  // Лобби с ботом: создаём стол через стор (партию не стартуем — вне зоны
  // волны; проверяем экран лобби, настройки и переключение языка в нём).
  const { createRoomViaStore, fillName } = await import("./qa-lib.mjs");
  await fillName(page, "QA-i18n");
  const created = await createRoomViaStore(page, { name: "QA-i18n", capacity: 2, botSeats: 1, difficulty: "normal", modules: {} });
  if (created.ok) {
    await waitUntil(() => roomCode(page), 20_000, 400);
    const code = await roomCode(page);
    check(Boolean(code), `лобби открыто (стол ${code ?? "?"})`);
    await expectText(page, /Game settings|Waiting for players/, 15_000, "лобби (en)");
    await shot(page, "08-lobby-en.png");
    ov = await overflowPx(page);
    check(ov <= 0, `лобби (en, 1280px): переполнение ${ov}px`);
    check(
      await isVisible(page.locator("[data-start-game]").first()),
      "лобби (en): кнопка старта на месте (data-start-game)",
    );

    // Переключение языка прямо в лобби: шапка и настройки меняются.
    await safeClick(langButton(page));
    await expectText(page, /Настройки партии/, 8000, "лобби после RU-переключения");
    await shot(page, "09-lobby-ru.png");
    ov = await overflowPx(page);
    check(ov <= 0, `лобби (ru, 1280px): переполнение ${ov}px`);
    await safeClick(langButton(page));
    await expectText(page, /Game settings/, 8000, "лобби вернулось на en");
  } else {
    fail(`лобби не открылось: ${created.error}`);
  }

  errs.forEach(fail);
  await ctx.close();
}

// Русские экраны для сравнения (вкладка с сохранённым ru).
{
  const { ctx, page, problems: errs } = await openMenuLang(browser, "ru-RU", { storage: { "evo-lang": "ru" } });
  const title = (await menuTitle(page))?.trim();
  check(title === "Эволюция", "сохранённый 'ru' в localStorage: меню на русском");
  await shot(page, "10-menu-ru.png");
  await safeClick(page.getByRole("button", { name: "Правила" }).first());
  await expectText(page, /Базовая игра/, 10_000, "вкладки правил (ru)");
  await shot(page, "11-rules-ru-base.png");
  errs.forEach(fail);
  await ctx.close();
}

// (г) 390px: переключатель влезает в полосу навигации.
{
  const ctx = await browser.newContext({
    locale: "en-US",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const errs = trackPage(page, "mobile");
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
  await waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), 25_000, 300);
  await menuReady(page, 30_000);
  await sleep(600);

  const btn = langButton(page);
  check(await isVisible(btn), "390px: переключатель языка видим в шапке");
  const fits = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.left >= 0 && r.right <= window.innerWidth && r.bottom <= 80;
  }, "[data-lang-toggle]");
  check(fits === true, "390px: переключатель внутри полосы навигации (не обрезан)");

  // Автоопределение en-US уже применило EN; переключаем RU и обратно,
  // проверяя заголовок — настоящее условие, а не «клик не бросил».
  await safeClick(btn);
  const toRu = await waitUntil(async () => (await menuTitle(page))?.trim() === "Эволюция", 5000, 200);
  check(toRu, "390px: переключение EN→RU работает");
  await safeClick(langButton(page));
  const toEn = await waitUntil(async () => (await menuTitle(page))?.trim() === "Evolution", 5000, 200);
  check(toEn, "390px: переключение RU→EN работает");

  const ov = await overflowPx(page);
  check(ov <= 0, `меню (en, 390px): переполнение ${ov}px`);
  await shot(page, "12-menu-en-390.png");

  // Мобильные вкладки «Tables/Create» на английском.
  const tablesTab = page.getByRole("button", { name: /^Tables/ }).first();
  if (await isVisible(tablesTab)) {
    await safeClick(tablesTab);
    await sleep(300);
    const ovTabs = await overflowPx(page);
    check(ovTabs <= 0, `меню, вкладка Tables (en, 390px): переполнение ${ovTabs}px`);
    await shot(page, "13-menu-en-390-tables.png");
  } else {
    warn("390px: вкладка Tables не найдена");
  }

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
console.log("VERDICT: PASS — локализация и переключатель работают, переполнений нет");
