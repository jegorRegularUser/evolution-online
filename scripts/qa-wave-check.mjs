/**
 * Приёмка волны 1108 (F1/F2/F6/F8). Запуск: node scripts/qa-wave-check.mjs
 * Печатает PASS/FAIL по чек-листу, скриншоты кладёт в EVO_SHOTS (вне репо).
 */
import { chromium } from "playwright";
import {
  gotoUrl,
  newRuPage,
  shotsDir,
  sleep,
  warmupServer,
  isVisible,
  safeClick,
  dismissSpotlight,
  fillName,
} from "./qa-lib.mjs";

const SHOTS = shotsDir();
const BASE = (process.env.EVO_URL ?? "http://127.0.0.1:8099").replace(/\/+$/, "");
const results = [];
const pass = (name, cond, detail = "") => {
  results.push(`${cond ? "PASS" : "FAIL"}: ${name}${detail ? ` (${detail})` : ""}`);
};
const shot = (page, name) => page.screenshot({ path: `${SHOTS}/wave-${name}.png`, fullPage: false });
const scrollToTop = (page) => page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});

/** Запуск миссии кликом по блоку «Обучение» в меню (как игрок). */
async function startTutorialViaUi(page) {
  await fillName(page, "QA");
  const btn = page.getByRole("button", { name: "Первые шаги" }).first();
  if (!(await isVisible(btn))) return false;
  await safeClick(btn, 5000);
  await sleep(2000);
  const start = page.getByRole("button", { name: "Начать год" });
  for (let i = 0; i < 6 && !(await isVisible(start)); i++) await sleep(800);
  await safeClick(start, 5000);
  await sleep(4500);
  await dismissSpotlight(page);
  await scrollToTop(page);
  await sleep(600);
  return true;
}

/** Метрики шапки: все иконочные кнопки. */
const topbarButtons = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("header button")].map((b) => {
      const r = b.getBoundingClientRect();
      return {
        label: b.getAttribute("aria-label") ?? b.textContent?.trim().slice(0, 12) ?? "?",
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    }),
  );

const browser = await chromium.launch();
await warmupServer(browser);

// ══ A. Учебная миссия: HUD, крестик, пилюля, F5, «Прервать» (десктоп 1280) ══
{
  const { ctx, page } = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
  await gotoUrl(page);
  pass("A0: миссия запущена из меню", await startTutorialViaUi(page));
  const phase = await page.evaluate(() => globalThis.__evoStore?.getState?.().state?.phase);
  pass("A0: партия в развитии", phase === "development", String(phase));

  const hudVisible = await isVisible(page.locator("aside[aria-label='Обучение']"));
  pass("A1: HUD виден", hudVisible);
  await shot(page, "a1-hud-desktop");

  // Плашка соперника не перекрыта: пересечение боксов HUD и плашки пустое.
  const overlap = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { l: r.left, t: r.top, r: r.right, b: r.bottom };
    };
    const hud = box("aside[aria-label='Обучение']");
    const plate = [...document.querySelectorAll(".player-section")].map((el) => {
      const r = el.getBoundingClientRect();
      return { l: r.left, t: r.top, r: r.right, b: r.bottom };
    });
    if (!hud) return { hud: null };
    const hit = plate.some(
      (p) => p.l < hud.r && p.r > hud.l && p.t < hud.b && p.b > hud.t,
    );
    return { hud, hit };
  });
  pass("A2: HUD не перекрывает плашки соперников", overlap.hud && !overlap.hit, JSON.stringify(overlap));

  // F2-проверка на том же экране: в DOM шапки нет «Обучение».
  const tutInBar = await page.evaluate(() =>
    [...document.querySelectorAll("header button")].some((b) =>
      (b.getAttribute("aria-label") ?? b.textContent ?? "").includes("Обучение"),
    ),
  );
  pass("A3: в шапке стола нет кнопки «Обучение»", !tutInBar);

  // Крестик: HUD сворачивается, стол остаётся.
  await page.locator("aside[aria-label='Обучение']").getByRole("button").first().click();
  await sleep(500);
  const hiddenOk =
    !(await isVisible(page.locator("aside[aria-label='Обучение']"))) &&
    (await page.evaluate(() => globalThis.__evoStore?.getState?.().net?.code ?? null)) !== null &&
    (await page.evaluate(() => globalThis.__evoStore?.getState?.().tutorialMission)) === "firstSteps";
  pass("A4: крестик сворачивает HUD, миссия и стол живы", hiddenOk);
  const pillVisible = await isVisible(page.getByRole("button", { name: "Показать цели обучения" }));
  pass("A5: пилюля «Обучение» на месте", pillVisible);
  await shot(page, "a5-pill-desktop");

  // F5: сверток переживает перезагрузку (та же партия). Флаг tutorialMission
  // в сторе после F5 легитимно теряется — HUD восстанавливается по записи
  // evo-tutorial-active (adoptedId), а сверток — по коду стола.
  await page.reload({ waitUntil: "networkidle" }).catch(() => {});
  await sleep(4000);
  await dismissSpotlight(page);
  await scrollToTop(page);
  await sleep(400);
  const stillHidden =
    !(await isVisible(page.locator("aside[aria-label='Обучение']"))) &&
    (await isVisible(page.getByRole("button", { name: "Показать цели обучения" }))) &&
    (await page.evaluate(() => globalThis.__evoStore?.getState?.().net?.code ?? null)) !== null;
  pass("A6: после F5 сверток помнится (та же партия)", stillHidden);

  // Развернуть обратно.
  await safeClick(page.getByRole("button", { name: "Показать цели обучения" }), 4000);
  await sleep(500);
  pass("A7: пилюля разворачивает HUD", await isVisible(page.locator("aside[aria-label='Обучение']")));

  // «Прервать обучение»: миссия уходит, стол остаётся.
  await safeClick(page.getByRole("button", { name: "Прервать обучение" }), 4000);
  await sleep(700);
  const aborted =
    (await page.evaluate(() => globalThis.__evoStore?.getState?.().tutorialMission)) === null &&
    (await page.evaluate(() => globalThis.__evoStore?.getState?.().net?.code ?? null)) !== null &&
    (await page.evaluate(() => globalThis.__evoStore?.getState?.().state?.phase)) !== null;
  pass("A8: «Прервать» гасит миссию, стол остаётся", aborted);
  await shot(page, "a8-after-abort-desktop");
  await ctx.close();
}

// ══ B. Топбар: одинаковые иконочные кнопки на 1280 и 390 ════════════════════
for (const [label, width, height] of [["1280", 1280, 900], ["390", 390, 844]]) {
  const { ctx, page } = await newRuPage(browser, { viewport: { width, height } });
  await gotoUrl(page);
  await startTutorialViaUi(page);
  const btns = await topbarButtons(page);
  const icons = btns.filter((b) => b.w > 0 && !/язык/.test(b.label));
  const uniq = [...new Set(icons.map((b) => `${b.w}x${b.h}`))];
  pass(
    `B${label}: все иконочные кнопки шапки одного размера`,
    uniq.length === 1 && icons.length >= 4,
    `${icons.length} шт: ${uniq.join(", ")}`,
  );
  const tut = btns.some((b) => b.label.includes("Обучение"));
  pass(`B${label}: кнопки «Обучение» в шапке нет`, !tut);
  await scrollToTop(page);
  await sleep(300);
  await shot(page, `b-topbar-${label}`);
  await ctx.close();
}

// ══ C. Строка реакций/ожидания: одна полоса на 390, одна линия на 1280 ══════
{
  const { ctx, page } = await newRuPage(browser, { viewport: { width: 390, height: 844 } });
  await gotoUrl(page);
  await startTutorialViaUi(page);
  await scrollToTop(page);
  await sleep(400);
  const row = await page.evaluate(() => {
    const el = document.querySelector("[data-reactions]")?.parentElement;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { h: Math.round(r.height), y: Math.round(r.y), w: Math.round(r.width), cls: el.className };
  });
  pass(
    "C390: строка реакций — одна компактная полоса (высота < 60, в кадре)",
    row && row.h > 0 && row.h < 60 && row.y > 0,
    JSON.stringify(row),
  );
  await shot(page, "c-strip-390");
  await ctx.close();

  // 1280: notice+реакции в одну линию (desktop preserved).
  const { ctx: c2, page: p2 } = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
  await gotoUrl(p2);
  await startTutorialViaUi(p2);
  await scrollToTop(p2);
  await sleep(400);
  const row1280 = await p2.evaluate(() => {
    const el = document.querySelector("[data-reactions]")?.parentElement;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const kids = [...el.children].map((c) => Math.round(c.getBoundingClientRect().height));
    return { h: Math.round(r.height), w: Math.round(r.width), kids };
  });
  pass(
    "C1280: строка одна линия (высота < 60), реакции слева",
    row1280 && row1280.h > 0 && row1280.h < 60,
    JSON.stringify(row1280),
  );
  await shot(p2, "c-row-1280");
  await c2.close();
}

// ══ D. Диалоги: высокие кнопки и красный destructive на 390; норма на 1280 ══
for (const [label, width, height] of [["390", 390, 844], ["1280", 1280, 900]]) {
  const { ctx, page } = await newRuPage(browser, { viewport: { width, height } });
  await gotoUrl(page);
  await startTutorialViaUi(page);
  // Диалог «Покинуть стол».
  await safeClick(page.getByRole("button", { name: "Покинуть стол", exact: true }), 4000);
  await sleep(800);
  const leaveDlg = await page.evaluate(() => {
    const dlg = [...document.querySelectorAll("[role='dialog']")].find((d) =>
      d.textContent.includes("Покинуть стол"),
    );
    if (!dlg) return null;
    return [...dlg.querySelectorAll("button")].map((b) => {
      const r = b.getBoundingClientRect();
      return {
        text: b.textContent?.trim().slice(0, 22),
        w: Math.round(r.width),
        h: Math.round(r.height),
        danger: b.className.includes("bg-danger"),
      };
    });
  });
  pass(
    `D${label}: диалог «Покинуть стол» открыт`,
    Boolean(leaveDlg) && leaveDlg.length >= 2,
  );
  if (leaveDlg) {
    const cancel = leaveDlg.find((b) => b.text.includes("Остаться"));
    const confirm = leaveDlg.find((b) => b.text.includes("Выйти") || b.text.includes("Покинуть"));
    if (label === "390") {
      pass(
        "D390: кнопки диалога высокие (>=48px) и во всю ширину",
        cancel?.h >= 48 && confirm?.h >= 48 && cancel.w > 280 && confirm.w > 280,
        `cancel ${cancel?.w}x${cancel?.h}, confirm ${confirm?.w}x${confirm?.h}`,
      );
    } else {
      pass(
        "D1280: кнопки диалога в ряд разумной высоты (44-52px)",
        cancel?.h >= 44 && cancel.h <= 52 && confirm?.h >= 44 && confirm.h <= 52,
        `cancel ${cancel?.w}x${cancel?.h}, confirm ${confirm?.w}x${confirm?.h}`,
      );
    }
    pass("D: destructive «Выйти…» красный", confirm?.danger === true);
    await shot(page, `d-leave-dialog-${label}`);
    await page.keyboard.press("Escape");
    await sleep(500);
  }
  // Диалог «Закрыть стол» (учебный стол = одни боты → кнопка есть).
  await safeClick(page.getByRole("button", { name: "Закрыть стол", exact: true }), 4000);
  await sleep(800);
  const closeDlg = await page.evaluate(() => {
    const dlg = [...document.querySelectorAll("[role='dialog']")].find((d) =>
      d.textContent.includes("Закрыть стол?"),
    );
    if (!dlg) return null;
    return [...dlg.querySelectorAll("button")].map((b) => {
      const r = b.getBoundingClientRect();
      return { text: b.textContent?.trim().slice(0, 22), w: Math.round(r.width), h: Math.round(r.height), danger: b.className.includes("bg-danger") };
    });
  });
  pass(`D${label}: диалог «Закрыть стол» открыт`, Boolean(closeDlg) && closeDlg.length >= 2);
  if (closeDlg) {
    const confirm = closeDlg.find((b) => b.text === "Закрыть стол");
    if (label === "390") {
      pass(
        "D390: кнопки «Закрыть стол» высокие",
        closeDlg.every((b) => b.h >= 48),
        closeDlg.map((b) => `${b.text} ${b.w}x${b.h}`).join(", "),
      );
    }
    pass("D: подтверждение закрытия красное", confirm?.danger === true);
    await shot(page, `d-close-dialog-${label}`);
    await page.keyboard.press("Escape");
    await sleep(400);
  }
  await ctx.close();
}

await browser.close();
console.log("\n=== Итог приёмки волны 1108 ===");
for (const r of results) console.log(r);
const fails = results.filter((r) => r.startsWith("FAIL")).length;
console.log(`\nИтого: ${results.length - fails}/${results.length} прошло${fails ? `, ПРОВАЛОВ: ${fails}` : ""}`);
process.exit(fails ? 1 : 0);
