// Локальная браузерная QA дополнения «Растения»: тумблер, партия с растениями
// (отдельно и вместе с «Континентами»), проверка растений на столе и фаз роста.
// Использование: node qa-plants.mjs [baseUrl]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
mkdirSync(OUT, { recursive: true });

const problems = [];
function note(kind, text) {
  problems.push(`[${kind}] ${text}`);
  console.error(`[plants-qa] ${kind}: ${text}`);
}

async function track(page, label) {
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("ERR_BLOCKED_BY_RESPONSE")) note(`${label}/console`, m.text());
  });
  page.on("pageerror", (e) => note(`${label}/pageerror`, String(e)));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (u.startsWith("http://127.0.0.1") || u.includes("fonts.g") || u.includes("grok.com")) return;
    note(`${label}/request`, `${r.failure()?.errorText} ${u}`);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: false });
  console.log(`[plants-qa] screenshot ${name}`);
}

async function startGame(page, { players = 3, plants = true, continents = false } = {}) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  const start = page.getByRole("button", { name: /Начать год/i });
  await start.waitFor({ state: "visible", timeout: 20000 });
  const nBtn = page.getByRole("button", { name: String(players), exact: true }).first();
  if (await nBtn.isVisible().catch(() => false)) await nBtn.click();
  await page.waitForTimeout(150);
  // Тумблеры дополнений в меню
  const plantsToggle = page.getByRole("button", { name: /Растения/i }).first();
  const continentsToggle = page.getByRole("button", { name: /Континенты/i }).first();
  const plantsOn = (await plantsToggle.getAttribute("aria-pressed")) === "true";
  if (plants !== plantsOn) await plantsToggle.click();
  if (continents) {
    const contOn = (await continentsToggle.getAttribute("aria-pressed")) === "true";
    if (!contOn) await continentsToggle.click();
  }
  await page.waitForTimeout(150);
  const fast = page.getByRole("button", { name: "Быстро" }).first();
  if (await fast.isVisible().catch(() => false)) await fast.click();
  await start.click();
}

/** Шаг автоигрока за человека; растения добавляют «Взять еду» по цепочке. */
let lastLabel = "";
async function click(page, locator) {
  try {
    await locator.click({ timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

/** Один evaluate на шаг: какие кнопки видны, есть ли подсвеченные цели. */
async function uiSnapshot(page) {
  return page.evaluate(() => {
    const visible = (el) => el.offsetParent !== null;
    const modal = [...document.querySelectorAll(".fixed.inset-0.z-40 button")]
      .filter((b) => visible(b) && !b.disabled)
      .map((b) => b.textContent.trim());
    const footer = [...document.querySelectorAll("footer button")]
      .filter((b) => visible(b) && !b.disabled)
      .map((b) => b.textContent.trim());
    return {
      modal,
      footer,
      hasTarget: Boolean(document.querySelector("[data-animal-id].ring-accent, [data-plant-id].ring-accent")),
      hasTerritory: Boolean(document.querySelector('[data-zone][role="button"]')),
      gameOver: document.body.innerText.includes("Конец эволюции"),
    };
  });
}

async function autoStep(page) {
  const snap = await uiSnapshot(page);
  const modalPick = (re) => snap.modal.find((t) => re.test(t));
  let pick = modalPick(/Не защищаться/);
  if (pick) return (await click(page, page.getByRole("button", { name: pick, exact: true }).first())) ? "surrender" : null;
  pick = modalPick(/Быстрое — бросок кубика/);
  if (pick) return (await click(page, page.getByRole("button", { name: pick, exact: true }).first())) ? "running" : null;
  pick = modalPick(/Мимикрия/);
  if (pick) return (await click(page, page.getByRole("button", { name: pick }).first())) ? "mimicry" : null;
  pick = modalPick(/^Отбросить/);
  if (pick) return (await click(page, page.getByRole("button", { name: pick }).first())) ? "tail" : null;
  // «Континенты»: размещение животного — клик по полосе территории.
  if (snap.hasTerritory) {
    if (await click(page, page.locator('[data-zone][role="button"]').first())) return "territory";
  }
  // Подсвеченное животное/растение — валидная цель интента.
  if (snap.hasTarget) {
    if (await click(page, page.locator("[data-animal-id].ring-accent, [data-plant-id].ring-accent").first())) return "target";
  }
  // Развитие: половину карт выкладываем животными.
  if (snap.footer.includes("Животное") && Math.random() < 0.5) {
    if (await click(page, page.getByRole("button", { name: "Животное", exact: true }).first())) return "animal";
  }
  for (const label of [
    "Взять еду",
    "Убежище",
    "Хищное растение",
    "Жир",
    "Спячка",
    "Охота",
    "Топотун",
    "Закончить ход",
    "Пас",
  ]) {
    if (label === lastLabel && label !== "Охота") continue;
    if (snap.footer.includes(label)) {
      if (await click(page, page.getByRole("button", { name: label, exact: true }).first())) {
        lastLabel = label;
        return label;
      }
    }
  }
  return null;
}

async function runGame(page, label, opts, shots) {
  await startGame(page, opts);
  await page.waitForTimeout(800);
  let sawPlants = false;
  let sawGrowth = false;
  let sawPlantsInteraction = false;
  for (let i = 0; i < 900; i++) {
    const phaseText = await page.evaluate(() => document.body.innerText);
    if (i % 25 === 0) console.log(`[plants-qa] ${label} i=${i} phase=${(phaseText.match(/Год \d+ · [А-Яа-яё]+/) ?? ["?"])[0]}`);
    if (!sawPlants) {
      const n = await page.locator("[data-plant-id]").count();
      if (n > 0) sawPlants = true;
    }
    if (phaseText.includes("Рост")) sawGrowth = true;
    if (phaseText.includes("Убежище") || phaseText.includes("Хищное растение")) sawPlantsInteraction = true;
    if (phaseText.includes("Конец эволюции") || phaseText.includes("Ещё партия")) break;
    if (i === 30 && shots[0]) await shot(page, shots[0]);
    if (i === 120 && shots[1]) await shot(page, shots[1]);
    const did = await autoStep(page);
    if (!did) await sleep(250);
  }
  await sleep(600);
  if (shots[2]) await shot(page, shots[2]);
  if (!sawPlants) note(label, "растения не появились на столе");
  if (!sawGrowth) note(label, "фаза роста не показана");
  console.log(
    `[plants-qa] ${label}: plants=${sawPlants} growth=${sawGrowth} plantActions=${sawPlantsInteraction}`,
  );
  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflowX > 2) note(label, `горизонтальный overflow ${overflowX}px`);
  return { sawPlants, sawGrowth, sawPlantsInteraction };
}

const browser = await chromium.launch();

(async () => {
  // ---------- «Растения» отдельно (desktop) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
    const page = await ctx.newPage();
    await track(page, "plants");
    try {
      await runGame(page, "plants", { players: 3, plants: true }, ["plants-01-dev", "plants-02-feed", "plants-03-end"]);
    } catch (e) {
      note("plants", String(e?.message ?? e));
      await shot(page, "plants-error").catch(() => {});
    }
    await ctx.close();
  }

  // ---------- «Растения» + «Континенты» (desktop) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
    const page = await ctx.newPage();
    await track(page, "plants-continents");
    try {
      const r = await runGame(
        page,
        "plants-continents",
        { players: 3, plants: true, continents: true },
        ["plantscont-01-dev", "plantscont-02-feed", "plantscont-03-end"],
      );
      // Растения должны лежать на континентах (полосы) — проверяем наличие подписей.
      await page.waitForTimeout(300);
      const labels = await page.evaluate(() => [...document.querySelectorAll("section[aria-label]")].map((s) => s.getAttribute("aria-label")));
      if (!labels.some((l) => /Лаврази|Гондван/.test(String(l)))) {
        note("plants-continents", "полосы растений континентов не найдены");
      }
      void r;
    } catch (e) {
      note("plants-continents", String(e?.message ?? e));
      await shot(page, "plantscont-error").catch(() => {});
    }
    await ctx.close();
  }

  // ---------- «Растения» на мобиле ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await track(page, "plants-mobile");
    try {
      await runGame(page, "plants-mobile", { players: 2, plants: true }, ["plantsmob-01", "plantsmob-02", "plantsmob-03"]);
    } catch (e) {
      note("plants-mobile", String(e?.message ?? e));
      await shot(page, "plantsmob-error").catch(() => {});
    }
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify({ problems, count: problems.length }, null, 2));
  process.exit(problems.length ? 1 : 0);
})();
