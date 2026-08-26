// Континентальная QA: включает модуль «Континенты» в меню, играет партию
// с ботами, проверяет зоны/базы, скриншоты, консоль.
// Использование: node qa-continents.mjs [baseUrl]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
mkdirSync(OUT, { recursive: true });

const problems = [];
function note(kind, text) {
  problems.push(`[${kind}] ${text}`);
  console.error(`[cont] ${kind}: ${text}`);
}

async function track(page, label) {
  page.on("console", (m) => {
    if (m.type() === "error") note(`${label}/console`, m.text());
  });
  page.on("pageerror", (e) => note(`${label}/pageerror`, String(e)));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (u.startsWith("http://127.0.0.1") || u.includes("fonts.g")) return;
    note(`${label}/request`, `${r.failure()?.errorText} ${u}`);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: false });
  console.log(`[cont] screenshot ${name}`);
}

async function startGame(page, players = 3) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  const start = page.getByRole("button", { name: /Начать год/i });
  await start.waitFor({ state: "visible", timeout: 20000 });
  // Включаем «Континенты» в меню.
  const contBtn = page.getByRole("button", { name: /Континенты/i }).first();
  await contBtn.waitFor({ state: "visible", timeout: 5000 });
  const pressed = (await contBtn.getAttribute("aria-pressed")) === "true";
  if (!pressed) await contBtn.click();
  await page.waitForTimeout(150);
  const nBtn = page.getByRole("button", { name: String(players), exact: true }).first();
  if (await nBtn.isVisible().catch(() => false)) await nBtn.click();
  await sleep(150);
  const fast = page.getByRole("button", { name: "Быстро" }).first();
  if (await fast.isVisible().catch(() => false)) await fast.click();
  await shot(page, "cont-menu");
  await start.click();
}

let lastLabel = "";
async function autoStep(page) {
  const surrender = page.getByRole("button", { name: /Не защищаться/i });
  if (await surrender.isVisible().catch(() => false)) return (await surrender.click(), "surrender");
  const running = page.getByRole("button", { name: /Быстрое — бросок кубика/i });
  if (await running.isVisible().catch(() => false)) return (await running.click(), "running");
  const mimic = page.getByRole("button", { name: /Мимикрия на другое животное/i }).first();
  if (await mimic.isVisible().catch(() => false)) return (await mimic.click(), "mimicry");
  const tail = page.getByRole("button", { name: /^Отбросить /i }).first();
  if (await tail.isVisible().catch(() => false)) return (await tail.click(), "tail");

  // Миграция: континентальные кнопки-направления
  for (const label of ["↑ Лавразия", "↓ Гондвана", "≈ Океан"]) {
    const mb = page.getByRole("button", { name: label }).first();
    if ((await mb.count()) > 0 && (await mb.isEnabled().catch(() => false))) {
      if (lastLabel !== label || Math.random() < 0.5) {
        await mb.click();
        lastLabel = label;
        return `migrate ${label}`;
      }
    }
  }

  const target = page.locator("[data-animal-id].ring-accent").first();
  if ((await target.count()) > 0) {
    await target.click();
    return "target";
  }
  const animalBtn = page.getByRole("button", { name: "Животное" }).first();
  if (await animalBtn.isEnabled().catch(() => false)) {
    if (Math.random() < 0.55) {
      await animalBtn.click();
      // Если открылось меню выбора континента — жмём «Лавразия».
      const zoneBtn = page
        .locator("[data-hand-row] button", { hasText: /Лавразия|Гондвана/ })
        .first();
      if ((await zoneBtn.count()) > 0 && (await zoneBtn.isVisible().catch(() => false))) {
        await zoneBtn.click();
        return "animal+zone";
      }
      return "animal";
    }
  }
  for (const label of ["Взять еду", "Жир", "Спячка", "Охота", "Топтун", "Закончить ход", "Пас"]) {
    if (label === lastLabel && label !== "Охота") continue;
    const b = page.getByRole("button", { name: label, exact: true });
    if ((await b.count()) > 0 && (await b.first().isEnabled().catch(() => false))) {
      await b.first().click();
      lastLabel = label;
      return label;
    }
  }
  return null;
}

const browser = await chromium.launch();

(async () => {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  await track(page, "cont");

  try {
    await startGame(page, 3);
    await sleep(1500);
    await shot(page, "cont-development");

    // Проверка 1: в меню модуль включился и игра стартовала
    const felt = page.locator(".felt");
    await felt.waitFor({ state: "visible", timeout: 10000 });

    // Проверка 2: территории есть в разметке после первого года развития,
    // либо сразу пустые полосы. Океан обязан существовать.
    let steps = 0;
    let diceShot = false;
    let zoneShot = false;
    let lastPhaseLog = "";
    let sawTerritories = false;
    let sawTerritoryBanks = false;
    const t0 = Date.now();
    while (Date.now() - t0 < 300000) {
      const over = await page
        .getByText(/Конец эволюции|Ваша популяция доминирует|Вас вытеснили/i)
        .first()
        .isVisible()
        .catch(() => false);
      if (over) break;

      const phase = await page.evaluate(() => document.body.innerText.match(/Год \d+ · [^\n]+/u)?.[0] ?? "");
      if (phase && phase !== lastPhaseLog) {
        console.log(`[cont] ${phase}`);
        lastPhaseLog = phase;
      }
      if (!diceShot && /Кормовая база/.test(phase)) {
        await sleep(700);
        await shot(page, "cont-dice");
        diceShot = true;
      }

      if (!zoneShot) {
        const hasZones = await page.evaluate(() => ({
          laurasia: document.querySelectorAll('[data-zone="laurasia"]').length,
          gondwana: document.querySelectorAll('[data-zone="gondwana"]').length,
          ocean: document.querySelectorAll('[data-zone="ocean"]').length,
        }));
        if (hasZones.ocean > 0 && hasZones.laurasia > 0 && hasZones.gondwana > 0) {
          sawTerritories = true;
          zoneShot = true;
          await shot(page, "cont-zones");
          console.log(`[cont] territories rendered: ${JSON.stringify(hasZones)}`);
        }
      }
      const banks = await page.evaluate(() =>
        [...document.querySelectorAll("img")].some((im) =>
          /\/world\/(laurasia|gondwana|ocean)\./.test(im.getAttribute("src") ?? ""),
        ),
      );
      if (banks) sawTerritoryBanks = true;

      const acted = await autoStep(page);
      if (!acted) await sleep(350);
      else steps++;
      await sleep(200);
    }
    await shot(page, "cont-end");
    console.log(
      `[cont] steps=${steps} territories=${sawTerritories} territoryArt=${sawTerritoryBanks}`,
    );
    if (!sawTerritories) note("check", "полосы территорий так и не отрисовались");
    if (!diceShot) note("check", "партия не дошла до кормовой базы");
    const overflowD = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflowD > 2) note("desktop", `горизонтальный overflow ${overflowD}px`);
  } catch (e) {
    note("fatal", String(e?.stack ?? e));
    await shot(page, "cont-fatal").catch(() => {});
  }
  await ctx.close();
  await browser.close();

  console.log(JSON.stringify({ ok: problems.length === 0, problems }, null, 2));
  process.exit(problems.length === 0 ? 0 : 1);
})();
