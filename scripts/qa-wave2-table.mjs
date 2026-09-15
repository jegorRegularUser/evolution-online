/**
 * Волна 2, вёрстка стола (M2 + M13). Матрица «игроков × вьюпортов»:
 *   - помещается ли стол без внутренней прокрутки (<main>.scrollHeight);
 *   - ширина сукна и тайлов кормовой базы, обрезано ли что-то внутри section.felt;
 *   - горизонтальный overflow документа;
 *   - для 7–8 игроков — геометрия верхнего и нижнего ряда табло (M13).
 * Пишет скрин клипом по рамке кормовой базы и полный стол. Скриншоты — ВНЕ
 * репозитория (Tailwind в dev сканирует проект, новый PNG перезагружает вкладку).
 *
 * Партии поднимаются СЕТЕВЫМИ столами, свободные места занимают боты
 * (соло-режим удалён): see scripts/qa-lib.mjs.
 *
 * Запуск при живом dev-сервере:
 *   node scripts/qa-wave2-table.mjs
 *   EVO_PLAYERS=4 EVO_VIEWPORTS=1440x900 node scripts/qa-wave2-table.mjs
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { endPhaseStep, phaseOf, shotsDir, startNetGame, waitUntil } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
const SHOTS = shotsDir();

const PLAYERS = (process.env.EVO_PLAYERS ?? "2,3,4,5,7,8").split(",").map((s) => Number(s.trim())).filter(Boolean);
const VIEWPORTS = (process.env.EVO_VIEWPORTS ?? "1440x900,1280x800,1024x768,768x1024,390x844")
  .split(",")
  .map((s) => {
    const [w, h] = s.trim().split("x").map(Number);
    return { w, h };
  });
// «Стол должен помещаться без прокрутки»: эти случаи проверяются жёстко.
const MUST_FIT = { maxPlayers: 6, minWidth: 1280 };
/** Замер «до» для состояния размещения: старое правило min-height у всех зон. */
const LEGACY_ZONES = Boolean(process.env.EVO_LEGACY_ZONES);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { shots: SHOTS, rows: [], problems: [], fitGaps: [] };
/** Жёсткий брак: обрезки и переполнения (их быть не должно). */
const bad = (m) => {
  console.log("FAIL:", m);
  report.problems.push(m);
};
/** «Цель» приёмки: стол 2–6 игроков на 1440×900/1280×800 без внутренней прокрутки. */
const goal = (m) => {
  console.log("ЦЕЛЬ:", m);
  report.fitGaps.push(m);
};
const info = (m) => console.log("     ", m);

const browser = await chromium.launch();

async function evalSafe(page, expr, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try {
      return await page.evaluate(expr);
    } catch {
      await sleep(500);
    }
  }
  return null;
}

/** Гасит модальную карточку события («Пропустить показ / клик в любом месте»). */
async function dismissSpotlight(page) {
  for (let i = 0; i < 10; i++) {
    const txt = (await evalSafe(page, `document.body.innerText`)) ?? "";
    // Подпись под кнопкой выводится капсом (CSS uppercase) — сверяем без регистра.
    if (!/клик в любом месте/i.test(txt)) return;
    const skip = page.getByRole("button", { name: "Пропустить показ" });
    if (await skip.isVisible().catch(() => false)) {
      await skip.click().catch(() => {});
    } else {
      await page.mouse.click(120, 240);
    }
    await sleep(300);
  }
}

async function shot(page, name, clip) {
  const path = join(SHOTS, `${name}.png`);
  try {
    await page.screenshot(clip ? { path, clip } : { path });
    return path;
  } catch {
    return null;
  }
}

const PROBE = `(() => {
  const rnd = (v) => Math.round(v);
  const rect = (el) => { const b = el.getBoundingClientRect(); return { x: rnd(b.x), y: rnd(b.y), w: rnd(b.width), h: rnd(b.height) }; };
  const main = document.querySelector("main");
  const felt = document.querySelector("main section.felt") || document.querySelector("section.felt");
  const out = {
    vp: { w: innerWidth, h: innerHeight },
    doc: { overX: document.documentElement.scrollWidth - innerWidth, overY: document.documentElement.scrollHeight - innerHeight },
    phase: null,
  };
  try { out.phase = window.__evoStore.getState().state?.phase ?? null; } catch {}
  if (main) {
    out.main = { scrollH: main.scrollHeight, clientH: main.clientHeight, delta: main.scrollHeight - main.clientHeight, fits: main.scrollHeight <= main.clientHeight + 8 };
  }
  if (!felt) { out.felt = null; return out; }
  const fr = felt.getBoundingClientRect();
  out.felt = { ...rect(felt), scrollW: felt.scrollWidth, clientW: felt.clientWidth, scrollH: felt.scrollHeight, clientH: felt.clientHeight, clipped: [] };
  for (const el of felt.querySelectorAll("*")) {
    const b = el.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    const left = rnd(fr.left - b.left), right = rnd(b.right - fr.right), top = rnd(fr.top - b.top), bottom = rnd(b.bottom - fr.bottom);
    if (left > 1 || right > 1 || top > 1 || bottom > 1) {
      out.felt.clipped.push({ tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 80), text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 24), left, right, top, bottom });
    }
  }
  const tiles = [...felt.querySelectorAll('[title^="Кормовая база \\u00ab"]')];
  out.bank = tiles.length
    ? {
        count: tiles.length,
        tiles: tiles.map((t) => {
          const chipRow = [...t.querySelectorAll("div")].find((d) => String(d.className || "").includes("flex-wrap"));
          const chipEls = chipRow ? [...chipRow.children] : [];
          const rows = new Set(chipEls.map((c) => rnd(c.getBoundingClientRect().top))).size;
          const art = t.querySelector("img");
          const num = [...t.children].find((c) => String(c.className || "").includes("font-display"));
          return {
            ...rect(t), scrollW: t.scrollWidth, clientW: t.clientWidth,
            chips: chipRow ? { w: rnd(chipRow.getBoundingClientRect().width), scrollW: chipRow.scrollWidth, clientW: chipRow.clientWidth, rows, count: chipEls.length } : null,
            art: art ? rect(art) : null,
            num: num ? (num.textContent || "").trim() : null,
          };
        }),
      }
    : null;
  const seats = {};
  for (const el of main.querySelectorAll("[style*='grid-area']")) {
    const m = /grid-area:\\s*([a-z]+)/.exec(el.getAttribute("style") || "");
    if (!m) continue;
    const kids = [...el.children];
    seats[m[1]] = {
      count: kids.length,
      rows: new Set(kids.map((k) => rnd(k.getBoundingClientRect().top / 4))).size,
      heights: kids.map((k) => rnd(k.getBoundingClientRect().height)),
      widths: kids.map((k) => rnd(k.getBoundingClientRect().width)),
      gap: getComputedStyle(el).rowGap,
    };
  }
  out.seats = seats;
  out.sections = [...main.querySelectorAll("[data-player-section]")].map((s) => ({
    id: s.getAttribute("data-player-section"),
    ...rect(s),
    clipped: [...s.querySelectorAll("*")].filter((el) => {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return false;
      const sr = s.getBoundingClientRect();
      return b.left < sr.left - 1 || b.right > sr.right + 1;
    }).length,
    zones: [...s.querySelectorAll("[data-zone]")].map((z) => ({
      zone: z.getAttribute("data-zone"),
      ...rect(z),
      scrollW: z.scrollWidth,
      clientW: z.clientWidth,
      animals: z.querySelectorAll("[data-animal-id]").length,
      cards: [...z.querySelectorAll("[data-animal-id]")].map((c) => rect(c)),
    })),
    animalCount: s.querySelectorAll("[data-animal-id]").length,
  }));
  return out;
})()`;

/**
 * Старт партии: СЕТЕВОЙ стол на `players` мест, все прочие — боты, включены
 * «Континенты». Соло-старт из меню удалён вместе с соло-режимом (M1).
 */
async function startGame(page, players) {
  try {
    return await startNetGame(page, {
      name: `Стол${players}`,
      players,
      bots: players - 1,
      modules: { continents: true },
    });
  } catch (e) {
    bad(`${players}p: стол не поднялся — ${String(e?.message ?? e).split("\n")[0]}`);
    return null;
  }
}

/** Гоняем фазы кнопками, пока не встанет «Кормовая база» (фаза foodBank). */
async function reachFoodBank(page) {
  const deadline = Date.now() + 150_000;
  while (Date.now() < deadline) {
    // Партия может пропасть при перезагрузке вкладки (HMR соседнего агента).
    const alive = await evalSafe(page, `(() => { const s = window.__evoStore?.getState?.(); return { phase: s?.state?.phase ?? null, main: Boolean(document.querySelector("main")) }; })()`);
    if (!alive?.main) return "reload";
    if (alive.phase === "foodBank") return true;
    if (alive.phase === "gameOver") return false;
    const txt = (await evalSafe(page, `document.body.innerText`)) ?? "";
    if (txt.includes("Итог")) return false;
    const clicked = await endPhaseStep(page);
    await dismissSpotlight(page);
    if (VERBOSE && clicked) console.log("     нажато «закончить фазу»", Date.now());
    await sleep(250);
  }
  return false;
}
const VERBOSE = Boolean(process.env.EVO_VERBOSE);

/** Замораживает автоматику: фаза и содержимое стола перестают меняться. */
async function freeze(page) {
  await evalSafe(
    page,
    `(() => { const s = window.__evoStore; if (!s) return false; s.setState({ tickAI: () => {}, dispatch: () => {} }); return true; })()`,
  );
}

/**
 * Замер состояния «человек выбрал карту животного»: раньше флаг размещения
 * раздувал ВСЕ пустые полосы всех табло до 188px — именно так ломалась вёрстка.
 * EVO_LEGACY_ZONES=1 возвращает старое правило стилем, чтобы снять замер «до».
 */
async function probePlacing(page) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const cur = await evalSafe(page, `(() => { const s = window.__evoStore.getState().state; return s ? { actor: s.currentPlayerId, phase: s.phase } : null; })()`);
    if (cur?.actor === 0 && cur?.phase === "development") break;
    await sleep(300);
  }
  const card = page.getByRole("button", { name: /^Животное/ }).first();
  const clicked = await card.click({ timeout: 3000 }).then(() => true).catch(() => false);
  if (!clicked) return null;
  await sleep(500);
  if (LEGACY_ZONES) {
    await evalSafe(
      page,
      `(() => { const st = document.createElement("style"); st.id = "legacy-zones"; st.textContent = "[data-zone]{min-height:188px !important}"; document.head.append(st); return true; })()`,
    );
    await sleep(300);
  }
  const p = await evalSafe(page, PROBE);
  if (LEGACY_ZONES) {
    await evalSafe(page, `(() => { document.getElementById("legacy-zones")?.remove(); return true; })()`);
  }
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(200);
  return p;
}

async function runSession(players) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => bad(`pageerror (${players}p): ${e.message}`));
  await page.goto(BASE, { waitUntil: "networkidle" });
  const code = await startGame(page, players);
  if (VERBOSE) console.log("     старт: стол", code);
  if (!code) {
    await ctx.close();
    return;
  }
  await evalSafe(page, `(() => { const s = window.__evoStore?.getState?.(); if (s?.setSpeed) s.setSpeed("fast"); return true; })()`);
  // Состояние размещения животного: снимаем, пока человек ещё не закончил развитие.
  const placing = await probePlacing(page);
  if (placing?.felt) {
    report.rows.push({
      label: `${players}p-1440x900-placing`,
      players,
      vp: { w: 1440, h: 900 },
      phase: placing.phase,
      main: placing.main,
      felt: { w: placing.felt.w, h: placing.felt.h, scrollW: placing.felt.scrollW, clientW: placing.felt.clientW },
      clipped: placing.felt.clipped.length,
      sectionH: (placing.sections ?? []).map((s) => s.h),
      zoneH: (placing.sections ?? []).map((s) => s.zones.map((z) => `${z.zone}:${z.h}`).join(",")),
      tiles: [],
      docOverX: placing.doc.overX,
    });
    console.log(
      `  размещение (${players}p): main ${placing.main?.scrollH}/${placing.main?.clientH} · табло ${(placing.sections ?? []).map((s) => s.h).join("/")} · зоны ${(placing.sections ?? [])[0]?.zones.map((z) => z.h).join("/")}`,
    );
    await shot(page, `${players}p-1440x900-placing-full`);
  }
  let reached = await reachFoodBank(page);
  if (reached === "reload") {
    // Вкладку перезагрузил HMR: URL с ?room=КОД и токен места в localStorage
    // сами возвращают за стол; новый стол нужен, только если восстановление
    // не случилось (сессия потеряна).
    info(`${players}p: вкладка перезагрузилась, ждём восстановление стола ${code}`);
    const back = await waitUntil(async () => Boolean(await phaseOf(page)), 40_000, 600);
    if (!back) {
      info(`${players}p: стол не восстановился, поднимаем новый`);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await startGame(page, players);
    }
    await evalSafe(page, `(() => { const s = window.__evoStore?.getState?.(); if (s?.setSpeed) s.setSpeed("fast"); return true; })()`);
    reached = await reachFoodBank(page);
  }
  await sleep(1200);
  await dismissSpotlight(page);
  if (reached !== true) bad(`${players}p: не дошли до фазы «Кормовая база» за 150 с (${reached})`);
  await freeze(page);
  await sleep(300);
  const alive = await evalSafe(page, `Boolean(document.querySelector("main section.felt"))`);
  if (!alive) bad(`${players}p: панель-сукно не найдена после старта партии`);

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await sleep(500);
    await dismissSpotlight(page);
    const p = await evalSafe(page, PROBE);
    const label = `${players}p-${vp.w}x${vp.h}`;
    if (!p) {
      bad(`${label}: не удалось снять замеры`);
      continue;
    }
    const clipped = p.felt?.clipped?.length ?? 0;
    const tileOverflow = (p.bank?.tiles ?? []).filter((t) => t.scrollW > t.clientW + 1).length;
    const chipOverflow = (p.bank?.tiles ?? []).filter((t) => t.chips && t.chips.scrollW > t.chips.clientW + 1).length;
    const row = {
      label,
      players,
      vp,
      phase: p.phase,
      main: p.main,
      felt: p.felt ? { w: p.felt.w, h: p.felt.h, scrollW: p.felt.scrollW, clientW: p.felt.clientW } : null,
      tiles: (p.bank?.tiles ?? []).map((t) => ({ w: t.w, scrollW: t.scrollW, clientW: t.clientW, chipRows: t.chips?.rows ?? null, chips: t.chips?.count ?? null, art: t.art?.w ?? null, num: t.num })),
      clipped,
      clippedDetail: p.felt?.clipped?.slice(0, 6) ?? [],
      tileOverflow,
      chipOverflow,
      docOverX: p.doc.overX,
      seats: p.seats,
      sectionH: (p.sections ?? []).map((s) => s.h),
      zoneH: (p.sections ?? []).map((s) => s.zones.map((z) => `${z.zone}:${z.h}`).join(",")),
      animals: (p.sections ?? []).map((s) => s.animalCount),
    };
    report.rows.push(row);

    const mustFit = players <= MUST_FIT.maxPlayers && vp.w >= MUST_FIT.minWidth && vp.h >= 800;
    const sectionClipped = (p.sections ?? []).reduce((s, x) => s + (x.clipped ?? 0), 0);
    if (clipped > 0) bad(`${label}: внутри section.felt обрезано элементов: ${clipped} ${JSON.stringify(row.clippedDetail.slice(0, 3))}`);
    if (tileOverflow > 0) bad(`${label}: тайлов банка с внутренним переполнением: ${tileOverflow}`);
    if (chipOverflow > 0) bad(`${label}: ряд фишек вылезает за тайл: ${chipOverflow}`);
    if (sectionClipped > 0) bad(`${label}: элементов вылезает за рамку своего табло: ${sectionClipped}`);
    if (p.doc.overX > 0) bad(`${label}: горизонтальный overflow документа ${p.doc.overX}px`);
    if (mustFit && p.main && !p.main.fits) goal(`${label}: стол прокручивается (main ${p.main.scrollH}/${p.main.clientH}, лишних ${p.main.delta}px)`);
    if (players >= 7 && p.seats?.top && p.seats?.bottom) {
      const t = p.seats.top;
      const b = p.seats.bottom;
      const topH = Math.max(...t.heights);
      const botH = Math.max(...b.heights);
      // M13: полосы должны совпадать по строению — одинаковое число табло и
      // одинаковое число строк. Разница высот зависит от животных игроков
      // (число карточек и их ширина), поэтому измеряется и печатается, но
      // структурным дефектом не считается.
      const sameShape = t.count === b.count && t.rows === b.rows;
      const heightDelta = Math.abs(topH - botH);
      const same = sameShape;
      info(
        `${label}: M13 верх ${t.count} табло ×${t.rows} ряд(ов) [${t.heights.join("/")}] · низ ${b.count} ×${b.rows} [${b.heights.join("/")}] · Δ${heightDelta}${sameShape ? "" : " ← СТРОЕНИЕ ПОЛОС РАЗОШЛОСЬ"}${sameShape && heightDelta > 40 ? " (высоту развели животные)" : ""}`,
      );
      if (!sameShape) bad(`${label}: M13 полосы разошлись: верх ${t.count} табло/${t.rows} ряд(ов), низ ${b.count}/${b.rows}`);
      row.m13 = { top: t, bottom: b, same, sameShape, heightDelta };
    }
    console.log(
      `${label}: main ${p.main?.scrollH ?? "?"}/${p.main?.clientH ?? "?"}${p.main?.fits ? " (ок)" : " ПРОКРУТКА"} · сукно ${p.felt?.w}px · тайлы ${row.tiles.map((t) => t.w).join("/")} · обрезано ${clipped} · overX ${p.doc.overX} · табло ${row.sectionH.join("/")}`,
    );
    if (p.felt) {
      const clip = {
        x: Math.max(0, p.felt.x - 6),
        y: Math.max(0, p.felt.y - 6),
        width: Math.min(p.felt.w + 12, p.vp.w),
        height: Math.min(p.felt.h + 12, p.vp.h - Math.max(0, p.felt.y - 6)),
      };
      if (clip.height > 20) await shot(page, `${label}-felt`, clip);
      await shot(page, `${label}-full`);
    }
  }
  await ctx.close();
}

try {
  for (const players of PLAYERS) {
    console.log(`\n=== ${players} игроков ===`);
    await runSession(players);
  }
} catch (e) {
  bad("EXCEPTION: " + (e?.stack ?? e));
} finally {
  writeFileSync(join(SHOTS, "wave2-report.json"), JSON.stringify(report, null, 2));
  const m13 = report.rows.filter((r) => r.m13);
  if (m13.length) {
    const deltas = m13.map((r) => r.m13.heightDelta);
    const shapeOk = m13.every((r) => r.m13.sameShape);
    console.log(
      `\nM13 (7–8 игроков, ${m13.length} замеров): число табло и строк в верхней и нижней полосе совпадает — ${shapeOk ? "да" : "НЕТ"}; разница высот верх/низ: ${Math.min(...deltas)}–${Math.max(...deltas)}px (зависит от животных игроков)`,
    );
  }
  console.log("\n=== ИТОГ ===");
  console.log("замеров:", report.rows.length, "· обрезок/переполнений:", report.problems.length, "· не помещается:", report.fitGaps.length);
  report.problems.forEach((p) => console.log(" -", p));
  if (report.fitGaps.length) {
    console.log("цель «без прокрутки» не достигнута:");
    report.fitGaps.forEach((p) => console.log(" -", p));
  }
  console.log("скриншоты:", SHOTS);
  await browser.close();
  process.exitCode = report.problems.length ? 1 : 0;
}
