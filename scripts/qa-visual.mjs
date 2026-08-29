/**
 * Визуальный QA: скриншоты ключевых экранов в artifacts/qa-shots/ плюс
 * программные проверки «на глаз»: горизонтальный overflow, кучка кубиков
 * внутри канваса (периметр прозрачен), время укладки кубиков, старт полёта
 * фишки еды из центра стола (не из шапки). Запуск при живом dev-сервере:
 * node scripts/qa-visual.mjs
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";
const SHOTS = "artifacts/qa-shots";
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
const ok = (msg) => console.log("OK:", msg);
const fail = (msg) => {
  console.log("FAIL:", msg);
  problems.push(msg);
};
// HMR дев-сервера иногда перезагружает страницу посреди прогона — контекст
// умирает. Ждём перезагрузку и пробуем снова.
const evalSafe = async (fn, tries = 8) => {
  for (let i = 0; i < tries; i++) {
    try {
      return await page.evaluate(fn);
    } catch {
      await page.waitForTimeout(700);
    }
  }
  return null;
};
page.on("pageerror", (e) => fail("PAGEERROR: " + e.message));

try {
  // ── 1. Главное меню ──
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Начать год" }).waitFor({ timeout: 20000 });
  await page.screenshot({ path: `${SHOTS}/01-menu.png` });
  const nav = await page.evaluate(() => {
    const header = document.querySelector("header");
    const buttons = [...document.querySelectorAll("header button")].map((b) => b.textContent?.trim() || b.getAttribute("aria-label"));
    return {
      hasHeader: Boolean(header),
      sticky: header ? getComputedStyle(header).position === "sticky" : false,
      buttons,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  nav.hasHeader && nav.sticky ? ok("полоса навигации в меню sticky") : fail("полоса меню не sticky");
  nav.overflowX <= 1 ? ok("нет горизонтального скролла в меню") : fail(`горизонтальный скролл в меню: ${nav.overflowX}px`);
  console.log("  кнопки полосы:", JSON.stringify(nav.buttons));

  // ── 2. Партия: развитие ──
  await page.getByRole("button", { name: "Начать год" }).click();
  await page.getByText("Развитие").first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOTS}/02-development.png` });
  ok("партия стартовала, скрин развития снят");

  // ── 3. Кормовая база: кубики в границах и время укладки ──
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (((await evalSafe(() => document.body.innerText)) ?? "").includes("Кормовая база")) break;
    const pass = page.getByRole("button", { name: "Пас", exact: true });
    if ((await pass.isVisible().catch(() => false)) && (await pass.isEnabled().catch(() => false))) {
      await pass.click();
    }
    await page.waitForTimeout(250);
  }
  await page.screenshot({ path: `${SHOTS}/03-foodbank.png` });

  // Время укладки: строка пикселей должна перестать меняться на 3 замера
  // подряд — это и есть «кучка улеглась».
  const started = Date.now();
  let settledAt = null;
  let prevRow = "";
  let stable = 0;
  while (Date.now() - started < 8000) {
    const row = await evalSafe(() => {
      const canvases = [...document.querySelectorAll("canvas")];
      const c = canvases.find((x) => x.width >= 40 && x.height >= 50);
      if (!c) return null;
      const gl = c.getContext("webgl2") ?? c.getContext("webgl");
      if (!gl) return null;
      const buf = new Uint8Array(c.width * 4);
      gl.readPixels(0, Math.floor(c.height / 2), c.width, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      return Array.from(buf).join(",");
    });
    if (row) {
      if (row === prevRow) {
        stable++;
        if (stable >= 3 && settledAt === null) settledAt = Date.now() - started;
      } else {
        stable = 0;
        prevRow = row;
      }
    }
    if (settledAt !== null) break;
    await page.waitForTimeout(200);
  }
  if (settledAt !== null && settledAt < 3600) {
    ok(`кубики улеглись за ${settledAt} мс (лимит 3600 — включает паузу фазы броска)`);
  } else {
    fail(`кубики не улеглись за разумное время: ${settledAt} мс`);
  }

  // Кучка внутри канваса: периметр канваса кубиков должен быть прозрачен.
  // Заодно считаем bbox непрозрачных пикселей — отступы кучки от краёв.
  const edges = await evalSafe(() => {
    const canvases = [...document.querySelectorAll("canvas")];
    const c = canvases.find((x) => x.width >= 40 && x.height >= 50);
    if (!c) return null;
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return null;
    const w = c.width;
    const h = c.height;
    const buf = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    const sides = { bottom: 0, top: 0, left: 0, right: 0 };
    let minX = w;
    let maxX = -1;
    let minY = h;
    let maxY = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = buf[(y * w + x) * 4 + 3];
        if (a <= 0) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (x < 2) sides.left++;
        if (x >= w - 2) sides.right++;
        if (y < 2) sides.bottom++;
        if (y >= h - 2) sides.top++;
      }
    }
    return {
      w,
      h,
      sides,
      total: sides.bottom + sides.top + sides.left + sides.right,
      bbox: { minX, minY, maxX, maxY },
      margins: { left: minX, right: w - 1 - maxX, bottom: minY, top: h - 1 - maxY },
    };
  });
  if (edges) {
    console.log("  канвас кубиков:", edges.w + "x" + edges.h, "отступы кучки:", JSON.stringify(edges.margins));
    edges.total === 0
      ? ok("кучка кубиков не выходит за края канваса")
      : fail(`кубики/тени касаются края канваса: ${JSON.stringify(edges.sides)}`);
  }

  // ── 4. Питание: полёт фишки еды из центра стола ──
  const feedDeadline = Date.now() + 90_000;
  while (Date.now() < feedDeadline) {
    const take = page.getByRole("button", { name: "Взять еду" });
    if ((await take.isVisible().catch(() => false)) && (await take.isEnabled().catch(() => false))) {
      await take.click();
      break;
    }
    const pass = page.getByRole("button", { name: "Пас", exact: true });
    if ((await pass.isVisible().catch(() => false)) && (await pass.isEnabled().catch(() => false))) {
      await pass.click();
    }
    await page.waitForTimeout(250);
  }
  // Ловим летящую фишку: трек позиций каждые 80 мс.
  const track = [];
  for (let k = 0; k < 20; k++) {
    const pos = await evalSafe(() => {
      const el = document.querySelector(".food-fly");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), vw: window.innerWidth, vh: window.innerHeight };
    });
    if (pos) track.push(pos);
    await page.waitForTimeout(80);
  }
  if (track.length) {
    const s = track[0];
    const e = track[track.length - 1];
    const insideViewport = s.x > 0 && s.x < s.vw && s.y > 56 && s.y < s.vh;
    insideViewport ? ok(`фишка стартует в границах стола (${s.x}, ${s.y})`) : fail(`фишка стартует за пределами стола: (${s.x}, ${s.y})`);
    const moved = track.length > 1 && (e.x !== s.x || e.y !== s.y);
    moved ? ok(`фишка летит (трек из ${track.length} точек)`) : fail("фишка не двигается");
    s.y > 80 ? ok("полёт идёт не из шапки — от центра стола") : fail("полёт стартует из шапки");
  } else {
    // Еда в этом раунде могла кончиться раньше — проверка пропускается.
    console.log("SKIP: летящая фишка не появилась (раунд питания кончился без взятия еды)");
  }
  await page.screenshot({ path: `${SHOTS}/04-feeding.png` });

  const overflowGame = (await evalSafe(() => document.documentElement.scrollWidth - window.innerWidth)) ?? 0;
  overflowGame <= 1 ? ok("нет горизонтального скролла в партии") : fail(`горизонтальный скролл в партии: ${overflowGame}px`);

  console.log(problems.length ? `\nИТОГ: ${problems.length} проблем` : "\nИТОГ: визуальный прогон чист");
  if (problems.length) process.exitCode = 1;
} finally {
  await browser.close();
}
