/**
 * Разведка «как оно выглядит сейчас» под список правок владельца (14.09.2026):
 * меню (десктоп/мобилка), лобби в три колонки, ожидающий стол, партия
 * с «Континентами» — развитие, кормовая база, питание. Плюс замеры, которых
 * не видно на картинке: переполнение содержимым панели-сукна (кормовая база
 * «Континентов»), число табло в верхнем и нижнем ряду, overflow документа.
 *
 * Запуск при живом dev-сервере: node scripts/qa-issues-probe.mjs
 *
 * Партии поднимаются СЕТЕВЫМИ столами (соло-режим удалён): see scripts/qa-lib.mjs.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  advancePhase,
  dismissSpotlight as libDismissSpotlight,
  menuReady,
  phaseOf,
  shotsDir,
  startNetGame,
} from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
// Скриншоты — ВНЕ репозитория: Tailwind в dev сканирует проект, и каждый новый
// PNG может вызвать перезагрузку вкладок (см. qa-net-lobby.mjs).
const SHOTS = shotsDir();

const report = { shots: SHOTS, steps: [], problems: [] };
const ok = (m) => {
  console.log("OK:", m);
  report.steps.push(m);
};
const fail = (m) => {
  console.log("FAIL:", m);
  report.problems.push(m);
  report.steps.push("FAIL: " + m);
};
const info = (m) => {
  console.log("   ", m);
  report.steps.push(m);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async (page, name) => {
  const path = join(SHOTS, `${name}.png`);
  await page.screenshot({ path });
  console.log("  скрин:", path);
  return path;
};

const browser = await chromium.launch();

async function evalSafe(page, expr, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try {
      return await page.evaluate(expr);
    } catch {
      await sleep(600);
    }
  }
  return null;
}

/** Гасит модальную карточку события («Клик в любом месте — дальше»). */
async function dismissSpotlight(page) {
  await libDismissSpotlight(page);
}

/**
 * Ключевой замер: что внутри панели-сукна вылезает за её границы. Панель имеет
 * `overflow-hidden`, поэтому такой выход = обрезанный на экране контент.
 */
const FELT_PROBE = `(() => {
  const felt = document.querySelector("main section.felt") || document.querySelector("section.felt");
  if (!felt) return null;
  const fr = felt.getBoundingClientRect();
  const out = {
    felt: { w: Math.round(fr.width), x: Math.round(fr.x), scrollW: felt.scrollWidth, clientW: felt.clientWidth },
    docOverflow: document.documentElement.scrollWidth - window.innerWidth,
    clipped: [],
    bank: null,
    tiles: [],
  };
  for (const el of felt.querySelectorAll("*")) {
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    const left = Math.round(fr.left - b.left);
    const right = Math.round(b.right - fr.right);
    if (left > 1 || right > 1) {
      out.clipped.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 90),
        text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 30),
        left, right,
      });
    }
  }
  const grid = [...felt.querySelectorAll("div")].find((d) => String(d.className).includes("grid-cols-3"));
  if (grid) {
    const gr = grid.getBoundingClientRect();
    out.bank = { w: Math.round(gr.width), x: Math.round(gr.x), scrollW: grid.scrollWidth, clientW: grid.clientWidth };
    for (const t of [...grid.children]) {
      const tr = t.getBoundingClientRect();
      out.tiles.push({ text: (t.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 24), w: Math.round(tr.width), scrollW: t.scrollWidth, clientW: t.clientWidth });
    }
  }
  return out;
})()`;

/** Сколько табло в каждой зоне раскладки (grid-area). */
const SEATS_PROBE = `(() => {
  const main = document.querySelector("main");
  if (!main) return null;
  const areas = {};
  for (const el of main.querySelectorAll("[style*='grid-area']")) {
    const m = /grid-area:\\s*([a-z]+)/.exec(el.getAttribute("style") || "");
    if (m) areas[m[1]] = [...el.children].length;
  }
  const widths = {};
  for (const el of main.querySelectorAll("[style*='grid-area']")) {
    const m = /grid-area:\\s*([a-z]+)/.exec(el.getAttribute("style") || "");
    if (m) widths[m[1]] = Math.round(el.getBoundingClientRect().width);
  }
  return { areas, widths };
})()`;

/**
 * Кликает «продолжить фазу», пока не наступит нужная ФАЗА (по стору) или не
 * появится текст-маркер (кнопка «Закончить питание»). Подписи вроде
 * «Кормовая база» для этого не годятся: это подпись панели-сукна, она видна
 * уже в развитии.
 */
async function advanceUntil(page, needle, ms) {
  const check =
    typeof needle === "function"
      ? needle
      : needle === "Кормовая база"
        ? () => phaseOf(page).then((p) => p === "foodBank" || p === "feeding")
        : () =>
            page
              .evaluate((n) => (document.body.innerText ?? "").includes(n), needle)
              .catch(() => false);
  const found = await advancePhase(page, check, { timeout: ms });
  if (found) return true;
  await dismissSpotlight(page);
  return false;
}

try {
  // ── 1. Меню ──
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => fail("PAGEERROR: " + e.message));
  await page.goto(BASE, { waitUntil: "networkidle" });
  if (!(await menuReady(page, 25_000))) fail("меню не дождалось гидратации");
  await sleep(400);
  await shot(page, "01-menu-desktop");
  const menu = await evalSafe(
    page,
    `(() => {
      const card = [...document.querySelectorAll("div")].find((d) => d.className.includes("panel") || d.className.includes("paper"));
      return {
        docOverflow: document.documentElement.scrollWidth - window.innerWidth,
        fieldsets: [...document.querySelectorAll("fieldset")].map((f) => f.querySelector("legend")?.textContent?.trim()),
        bodyText: document.body.innerText.replace(/\\n+/g, " | ").slice(0, 900),
        cardH: card ? Math.round(card.getBoundingClientRect().height) : null,
      };
    })()`,
  );
  info("меню: " + JSON.stringify(menu));
  report.menu = menu;

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mpage = await mctx.newPage();
  await mpage.goto(BASE, { waitUntil: "networkidle" });
  if (!(await menuReady(mpage, 25_000))) fail("мобильное меню не дождалось гидратации");
  await shot(mpage, "02-menu-mobile");
  info("мобилка меню: " + JSON.stringify(await evalSafe(mpage, `({ docOverflow: document.documentElement.scrollWidth - window.innerWidth, h: document.body.scrollHeight })`)));
  await mctx.close();

  // ── 2. Сетевой стол с континентами, 8 мест (все прочие — боты) ──
  try {
    await startNetGame(page, { name: "Разведка", players: 8, bots: 7, modules: { continents: true } });
  } catch (e) {
    fail("стол 8p с «Континентами» не поднялся: " + String(e?.message ?? e).split("\n")[0]);
  }
  await sleep(1500);
  await shot(page, "03-net-dev-8p-continents");
  const devSeats = await evalSafe(page, SEATS_PROBE);
  info("ряды (развитие, 1440px): " + JSON.stringify(devSeats));
  report.devSeats = devSeats;

  // ── 3. Развитие → кормовая база ──
  const reached = await advanceUntil(page, "Кормовая база", 90_000);
  reached ? ok(`дошли до фазы броска (${await phaseOf(page)})`) : fail("не дошли до фазы броска за 90 с");
  await sleep(2800);
  await dismissSpotlight(page);
  await sleep(500);
  await shot(page, "04-net-foodbank-8p-continents");

  // ── 4. Свип ширин на кормовой базе: ищем обрезанный контент ──
  const widths = [1600, 1440, 1280, 1100, 1024, 900, 820, 768, 560, 430];
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await sleep(450);
    const p = await evalSafe(page, FELT_PROBE);
    if (!p) {
      info(`${w}px: панель-сукно не найдена`);
      continue;
    }
    const flagged = p.clipped.filter((c) => c.left > 1 || c.right > 1);
    console.log(`  ${w}px → felt ${p.felt.w}px (scroll ${p.felt.scrollW}/${p.felt.clientW}), обрезано: ${flagged.length}, docOverflow ${p.docOverflow}`);
    if (flagged.length) {
      info(`${w}px обрезано: ` + JSON.stringify(flagged.slice(0, 6)));
      await shot(page, `05-clip-${w}px`);
    }
    report[`felt_${w}`] = p;
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(300);

  // ── 5. Питание: замеры + скрин ──
  const fed = await advanceUntil(page, "Закончить питание", 60_000);
  fed ? ok("дошли до фазы «Питание»") : info("фаза питания не поймана за 60 с (боты ещё ходят)");
  await sleep(800);
  await dismissSpotlight(page);
  await shot(page, "06-net-feeding-8p-continents");
  const feedProbe = await evalSafe(page, FELT_PROBE);
  info("питание: " + JSON.stringify(feedProbe?.felt) + " обрезано " + (feedProbe?.clipped?.length ?? "?"));
  report.feeding = feedProbe;

  // ── 6. Мобильная партия ──
  {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await c.newPage();
    await p.goto(BASE, { waitUntil: "networkidle" });
    try {
      await startNetGame(p, { name: "Моб", players: 8, bots: 7, modules: { continents: true } });
    } catch (e) {
      fail("мобильный стол 8p не поднялся: " + String(e?.message ?? e).split("\n")[0]);
    }
    await sleep(1800);
    await shot(p, "07-mobile-dev-8p");
    const dev = await evalSafe(p, FELT_PROBE);
    info("мобилка развитие: " + JSON.stringify(dev?.felt) + " обрезано " + (dev?.clipped?.length ?? "?"));
    if (dev?.clipped?.length) info("мобилка обрезано: " + JSON.stringify(dev.clipped.slice(0, 6)));
    report.mobile = dev;
    await c.close();
  }

  await ctx.close();
} catch (e) {
  fail("EXCEPTION: " + (e?.stack ?? e));
} finally {
  writeFileSync(join(SHOTS, "report.json"), JSON.stringify(report, null, 2));
  console.log("\n=== ИТОГ ===");
  console.log("проблем:", report.problems.length);
  report.problems.forEach((p) => console.log(" -", p));
  console.log("скриншоты:", SHOTS);
  await browser.close();
}
