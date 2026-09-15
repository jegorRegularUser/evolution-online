/**
 * Матрица «число игроков × Континенты»: как выглядит и помещается ли кормовая
 * база в панель-сукно. Пишет крупный скрин панели (clip по её рамке) и замеры
 * переполнения. Запуск при живом dev-сервере: node scripts/qa-bank-probe.mjs
 *
 * Партия — сетевой стол, все свободные места занимают боты (соло-режим удалён):
 * see scripts/qa-lib.mjs. Каждая строка матрицы — свой стол, поэтому прогон
 * тратит 8 ячеек квоты «создание столов 10/час»: при отказе сервера строка
 * помечается FAIL с текстом ошибки (перезапустите dev / поднимите порог).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { endPhaseStep, phaseOf, shotsDir, startNetGame } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
const SHOTS = shotsDir();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { rows: [], problems: [] };
const fail = (m) => {
  report.problems.push(m);
  console.log("FAIL:", m);
};

const FELT_PROBE = `(() => {
  const felt = document.querySelector("main section.felt");
  if (!felt) return null;
  const fr = felt.getBoundingClientRect();
  const clipped = [];
  for (const el of felt.querySelectorAll("*")) {
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    const left = Math.round(fr.left - b.left), right = Math.round(b.right - fr.right);
    if (left > 1 || right > 1) clipped.push({ cls: String(el.className || "").slice(0, 70), left, right, text: (el.textContent || "").trim().slice(0, 20) });
  }
  const grid = [...felt.querySelectorAll("div")].find((d) => String(d.className).includes("grid-cols-3"));
  return {
    felt: { x: Math.round(fr.x), y: Math.round(fr.y), w: Math.round(fr.width), h: Math.round(fr.height), scrollW: felt.scrollWidth, clientW: felt.clientWidth },
    docH: document.documentElement.scrollHeight, winH: window.innerHeight,
    docOverflowX: document.documentElement.scrollWidth - window.innerWidth,
    mainScrollH: (() => { const m = document.querySelector("main"); return m ? { scrollH: m.scrollHeight, clientH: m.clientHeight } : null; })(),
    bank: grid ? { w: Math.round(grid.getBoundingClientRect().width), scrollW: grid.scrollWidth, clientW: grid.clientWidth } : null,
    tiles: grid ? [...grid.children].map((t) => ({ text: (t.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 20), w: Math.round(t.getBoundingClientRect().width), scrollW: t.scrollWidth, clientW: t.clientWidth })) : [],
    clipped: clipped.slice(0, 8),
    humanBoard: (() => { const h = document.querySelector("[style*='grid-area:human']"); if (!h) return null; const r = h.getBoundingClientRect(); return { y: Math.round(r.y), h: Math.round(r.height) }; })(),
  };
})()`;

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

async function dismiss(page) {
  for (let i = 0; i < 8; i++) {
    const t = (await evalSafe(page, `document.body.innerText`)) ?? "";
    if (!t.includes("Клик в любом месте")) return;
    await page.mouse.click(100, 300);
    await sleep(350);
  }
}

async function run(cfg) {
  const ctx = await browser.newContext({ viewport: { width: cfg.w, height: cfg.h } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("  PAGEERROR:", e.message));
  await page.goto(BASE, { waitUntil: "networkidle" });
  let started = true;
  try {
    await startNetGame(page, {
      name: `База${cfg.players}`,
      players: cfg.players,
      bots: cfg.players - 1,
      modules: cfg.modules ?? {},
    });
  } catch (e) {
    started = false;
    console.log("  старт стола не удался:", String(e?.message ?? e).split("\n")[0]);
  }
  // гоняем фазы до броска кормовой базы общим хелпером (подтверждения диалогов
  // учтены). Фазу сверяем со СТОРОМ: подпись «Кормовая база» есть в панели-сукне
  // и в развитии, по тексту страницы фазу не отличить. Бюджет растёт с числом
  // мест: у стола на 8 (7 ботов) первый круг развития легитимно дольше 75 с —
  // каждый бот думает по несколько секунд, и фиксированный бюджет ронял строку
  // матрицы (8p-…: «фаза кормовой базы не достигнута»), хотя партия жива.
  const deadline = Date.now() + (75_000 + 25_000 * (cfg.players - 2));
  let reached = false;
  while (Date.now() < deadline) {
    const ph = await phaseOf(page);
    if (ph === "foodBank" || ph === "feeding") {
      reached = true;
      break;
    }
    if (ph === "gameOver") break;
    await endPhaseStep(page);
    await dismiss(page);
    await sleep(250);
  }
  await sleep(2600);
  await dismiss(page);
  await sleep(400);
  const probe = await evalSafe(page, FELT_PROBE);
  const label = `${cfg.players}p-${cfg.w}x${cfg.h}${cfg.modules?.continents ? "-cont" : ""}`;
  if (!started) fail(`${label}: стол не поднялся (лимит создания столов? смотрите строку выше)`);
  else if (!reached) fail(`${label}: фаза кормовой базы не достигнута за 75 с`);
  else if (!probe?.felt) fail(`${label}: панель-сукно (main section.felt) не найдена`);
  if (probe?.felt) {
    const clip = { x: Math.max(0, probe.felt.x - 6), y: Math.max(0, probe.felt.y - 6), width: probe.felt.w + 12, height: Math.min(probe.felt.h + 12, cfg.h - probe.felt.y + 6) };
    if (clip.height > 20) await page.screenshot({ path: join(SHOTS, `${label}-felt.png`), clip });
    await page.screenshot({ path: join(SHOTS, `${label}-full.png`) });
  }
  console.log(
    `${label}: reached=${reached} felt=${probe?.felt?.w}px h=${probe?.felt?.h} bank=${probe?.bank?.w} tiles=${JSON.stringify(probe?.tiles?.map((t) => t.w))} clipped=${probe?.clipped?.length} mainScroll=${JSON.stringify(probe?.mainScrollH)} docH=${probe?.docH} overX=${probe?.docOverflowX}`,
  );
  if (probe?.clipped?.length) console.log("   обрезано:", JSON.stringify(probe.clipped.slice(0, 4)));
  report.rows.push({ label, reached, probe });
  await ctx.close();
}

try {
  for (const players of [2, 3, 4, 5, 8]) {
    await run({ players, w: 1440, h: 900, modules: { continents: true } });
  }
  await run({ players: 4, w: 1280, h: 800, modules: { continents: true } });
  await run({ players: 4, w: 390, h: 844, modules: { continents: true } });
  await run({ players: 4, w: 1440, h: 900, modules: { continents: true, plants: true } });
} catch (e) {
  console.log("EXCEPTION:", e?.stack ?? e);
  fail("прогон прерван: " + String(e?.message ?? e).split("\n")[0]);
} finally {
  writeFileSync(join(SHOTS, "matrix.json"), JSON.stringify(report, null, 2));
  console.log("скриншоты:", SHOTS);
  console.log(`\nИтог: строк ${report.rows.length}, провалов ${report.problems.length}`);
  for (const p of report.problems) console.log(" -", p);
  await browser.close();
  process.exitCode = report.problems.length ? 1 : 0;
}
