/**
 * QA правил (#7): группы вкладок с «подстрочками» + новые вкладки
 * «Модификаторы», «Ископаемые», «Кампания». Открывает правила из меню
 * (кнопка «Правила» в шапке), переключает все 8 вкладок и снимает панель
 * сверху и снизу (панель скроллится внутри). Ширины 1280 и 390; отдельно —
 * английская локаль. Запуск при живом dev-сервере: node scripts/qa-rules-tabs.mjs
 */
import { chromium } from "playwright";
import { BASE, SHOTS, bodyOf, gotoUrl, newRuPage, sleep, trackPage, waitUntil } from "./qa-lib.mjs";

const RU_TABS = [
  "Базовая",
  "Континенты",
  "Растения",
  "Трава и грибы",
  "Мутации",
  "Модификаторы",
  "Ископаемые",
  "Кампания",
];
const EN_TABS = [
  "Base",
  "Continents",
  "Plants",
  "Grass and Mushrooms",
  "Random Mutations",
  "Modifiers",
  "Fossils",
  "Campaign",
];
const CAPTIONS = {
  ru: ["Базовая игра", "Дополнения", "Режимы и механики"],
  en: ["Base game", "Expansions", "Modes and mechanics"],
};

const overlay = (page) => page.locator("div.fixed.inset-0.z-50").first();

/** Прокрутить панель модалки вниз, если ей есть куда; вернуть имя прокрутки. */
async function scrollToBottom(page) {
  return page
    .evaluate(() => {
      let el = document.querySelector('[role="tabpanel"]');
      while (el && el.scrollHeight <= el.clientHeight + 2) el = el.parentElement;
      if (!el) return false;
      el.scrollTop = el.scrollHeight;
      return true;
    })
    .catch(() => false);
}

/** Открыть правила из меню (dev может перезагрузить вкладку на компиляции). */
async function openRules(page, tries = 3) {
  for (let i = 0; i < tries; i++) {
    await gotoUrl(page);
    const opened = await waitUntil(async () => {
      const btn = page.getByRole("button", { name: "Правила", exact: true });
      if ((await btn.count()) === 0) return false;
      await btn.first().click({ timeout: 3000 }).catch(() => false);
      return (await page.getByRole("tablist").count()) > 0;
    }, 20_000, 600);
    if (opened) return true;
    await sleep(1500);
  }
  return false;
}

/** Переключить вкладку и снять панель: сверху и, если скроллится, снизу. */
async function shootTab(page, tabName, width, log, prefix = "") {
  const tab = page.getByRole("tab", { name: tabName, exact: true });
  if (!(await tab.count())) {
    log(`FAIL: вкладка «${tabName}» не найдена`);
    return false;
  }
  await tab.click({ timeout: 5000 }).catch(() => false);
  await sleep(400);
  const tag = `${prefix}${width}-${RU_TABS.includes(tabName) ? RU_TABS.indexOf(tabName) : EN_TABS.indexOf(tabName)}`;
  await overlay(page).screenshot({ path: `${SHOTS}/rules-${tag}-${tabNameToSlug(tabName)}.png` });
  if (await scrollToBottom(page)) {
    await sleep(250);
    await overlay(page).screenshot({ path: `${SHOTS}/rules-${tag}-${tabNameToSlug(tabName)}-b.png` });
  }
  log(`ok: ${width}px «${tabName}»`);
  return true;
}

const tabNameToSlug = (n) =>
  ({ "Базовая": "base", "Континенты": "continents", "Растения": "plants", "Трава и грибы": "fungi", "Мутации": "mutations", "Модификаторы": "mods", "Ископаемые": "fossils", "Кампания": "campaign", "Base": "base", "Continents": "continents", "Plants": "plants", "Grass and Mushrooms": "fungi", "Random Mutations": "mutations", "Modifiers": "mods", "Fossils": "fossils", "Campaign": "campaign" })[n] ?? "tab";

const log = (m) => console.log(m);
const problems = [];

const browser = await chromium.launch();
try {
  // ── 1280: стрип + все 8 вкладок ──
  {
    const { page } = await newRuPage(browser, { viewport: { width: 1280, height: 1400 } });
    problems.push(...trackPage(page, "ru-1280"));
    if (!(await openRules(page))) throw new Error(`правила не открылись; экран: ${await bodyOf(page)}`);
    for (const cap of CAPTIONS.ru) {
      const n = await page.getByText(cap, { exact: true }).count();
      log(`${n ? "ok" : "FAIL"}: подпись группы «${cap}» ${n ? "на месте" : "не найдена"}`);
      if (!n) problems.push(`подпись «${cap}» не найдена`);
    }
    const tabCount = await page.getByRole("tab").count();
    log(`${tabCount === 8 ? "ok" : "FAIL"}: вкладок ${tabCount}/8`);
    if (tabCount !== 8) problems.push(`вкладок ${tabCount}/8`);
    await overlay(page).screenshot({ path: `${SHOTS}/rules-1280-strip.png` });
    for (const name of RU_TABS) {
      if (!(await shootTab(page, name, 1280, log))) problems.push(`вкладка «${name}» не снята`);
    }
    await page.context().close();
  }

  // ── 390: стрип + все 8 вкладок ──
  {
    const { page } = await newRuPage(browser, { viewport: { width: 390, height: 1600 } });
    problems.push(...trackPage(page, "ru-390"));
    if (!(await openRules(page))) throw new Error(`правила не открылись (390); экран: ${await bodyOf(page)}`);
    await overlay(page).screenshot({ path: `${SHOTS}/rules-390-strip.png` });
    for (const name of RU_TABS) {
      if (!(await shootTab(page, name, 390, log))) problems.push(`вкладка «${name}» не снята (390)`);
    }
    await page.context().close();
  }

  // ── EN: одна из новых вкладок ──
  {
    const ctx = await browser.newContext({ locale: "en-US", viewport: { width: 1280, height: 1400 } });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("evo-lang", "en");
      } catch {}
    });
    const page = await ctx.newPage();
    problems.push(...trackPage(page, "en-1280"));
    // Прямой goto, не gotoUrl: тот для страниц мимо newRuPage подсевает
    // RU-инициализатор языка поверх нашего en-скрипта.
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => {});
    const opened = await waitUntil(async () => {
      const btn = page.getByRole("button", { name: "Rules", exact: true });
      if ((await btn.count()) === 0) return false;
      await btn.first().click({ timeout: 3000 }).catch(() => false);
      return (await page.getByRole("tablist").count()) > 0;
    }, 20_000, 600);
    if (!opened) throw new Error(`EN правила не открылись; экран: ${await bodyOf(page)}`);
    for (const cap of CAPTIONS.en) {
      const n = await page.getByText(cap, { exact: true }).count();
      log(`${n ? "ok" : "FAIL"}: EN group caption "${cap}"`);
      if (!n) problems.push(`EN caption "${cap}" not found`);
    }
    await shootTab(page, "Modifiers", 1280, log, "en-");
    await shootTab(page, "Campaign", 1280, log, "en-");
    await ctx.close();
  }
} finally {
  await browser.close();
}

if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log(`VERDICT: OK — скриншоты в ${SHOTS}`);
}
