// Локальная браузерная QA дополнения «Трава и грибы»: тумблер, партия с флорой
// (отдельно, с «Континентами» и с «Растениями»), проверка карт флоры и меток.
// Использование: node qa-fungi.mjs [baseUrl]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
mkdirSync(OUT, { recursive: true });

const problems = [];
function note(kind, text) {
  problems.push(`[${kind}] ${text}`);
  console.error(`[fungi-qa] ${kind}: ${text}`);
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
  console.log(`[fungi-qa] screenshot ${name}`);
}

async function startGame(page, { players = 3, fungi = true, continents = false, plants = false } = {}) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  const start = page.getByRole("button", { name: /Начать год/i });
  await start.waitFor({ state: "visible", timeout: 20000 });
  const nBtn = page.getByRole("button", { name: String(players), exact: true }).first();
  if (await nBtn.isVisible().catch(() => false)) await nBtn.click();
  await page.waitForTimeout(150);
  const fungiToggle = page.getByRole("button", { name: /Трава и грибы/i }).first();
  const continentsToggle = page.getByRole("button", { name: /Континенты/i }).first();
  const plantsToggle = page.getByRole("button", { name: /^Растения/i }).first();
  const fungiOn = (await fungiToggle.getAttribute("aria-pressed")) === "true";
  if (fungi !== fungiOn) await fungiToggle.click();
  if (continents) {
    const contOn = (await continentsToggle.getAttribute("aria-pressed")) === "true";
    if (!contOn) await continentsToggle.click();
  }
  if (plants) {
    const plOn = (await plantsToggle.getAttribute("aria-pressed")) === "true";
    if (!plOn) await plantsToggle.click();
  }
  await page.waitForTimeout(150);
  const fast = page.getByRole("button", { name: "Быстро" }).first();
  if (await fast.isVisible().catch(() => false)) await fast.click();
  await start.click();
}

let lastLabel = "";
async function click(page, locator) {
  try {
    await locator.click({ timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

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
      hasTarget: Boolean(document.querySelector("[data-animal-id].ring-accent, [data-plant-id].ring-accent, [data-flora-id].ring-accent")),
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
  if (snap.hasTerritory) {
    if (await click(page, page.locator('[data-zone][role="button"]').first())) return "territory";
  }
  if (snap.hasTarget) {
    if (await click(page, page.locator("[data-animal-id].ring-accent, [data-plant-id].ring-accent, [data-flora-id].ring-accent").first())) return "target";
  }
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
    "Топтун",
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
  let sawFlora = false;
  let sawFloraTake = false;
  let sawMarks = false;
  for (let i = 0; i < 900; i++) {
    const phaseText = await page.evaluate(() => document.body.innerText);
    if (i % 25 === 0) console.log(`[fungi-qa] ${label} i=${i} phase=${(phaseText.match(/Год \d+ · [А-Яа-яё]+/) ?? ["?"])[0]}`);
    if (!sawFlora) {
      const n = await page.locator("[data-flora-id]").count();
      if (n > 0) sawFlora = true;
    }
    if (phaseText.includes("Трава и грибы · общие") || phaseText.includes("Флора ")) sawFloraTake = true;
    if (await page.locator("[data-mark-chip]").count() > 0) sawMarks = true;
    if (phaseText.includes("Конец эволюции") || phaseText.includes("Ещё партия")) break;
    if (i === 30 && shots[0]) await shot(page, shots[0]);
    if (i === 120 && shots[1]) await shot(page, shots[1]);
    const did = await autoStep(page);
    if (!did) await sleep(250);
  }
  await sleep(600);
  if (shots[2]) await shot(page, shots[2]);
  if (!sawFlora) note(label, "карты флоры не появились на столе");
  if (!sawMarks) console.log(`[fungi-qa] ${label}: меток за партию не встретилось (не ошибка)`);
  console.log(`[fungi-qa] ${label}: flora=${sawFlora} floraStrip=${sawFloraTake} marks=${sawMarks}`);
  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflowX > 2) note(label, `горизонтальный overflow ${overflowX}px`);
  return { sawFlora, sawFloraTake, sawMarks };
}

const browser = await chromium.launch();

(async () => {
  // ---------- «Трава и грибы» отдельно (desktop) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
    const page = await ctx.newPage();
    await track(page, "fungi");
    try {
      await runGame(page, "fungi", { players: 3, fungi: true }, ["fungi-01-dev", "fungi-02-feed", "fungi-03-end"]);
    } catch (e) {
      note("fungi", String(e?.message ?? e));
      await shot(page, "fungi-error").catch(() => {});
    }
    await ctx.close();
  }

  // ---------- «Трава и грибы» + «Континенты» ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
    const page = await ctx.newPage();
    await track(page, "fungi-continents");
    try {
      await runGame(
        page,
        "fungi-continents",
        { players: 3, fungi: true, continents: true },
        ["fungicont-01-dev", "fungicont-02-feed", "fungicont-03-end"],
      );
      await page.waitForTimeout(300);
      const labels = await page.evaluate(() =>
        [...document.querySelectorAll("section[aria-label]")].map((s) => s.getAttribute("aria-label")),
      );
      if (!labels.some((l) => l && l.includes("Трава и грибы"))) note("fungi-continents", "полоса флоры не найдена");
    } catch (e) {
      note("fungi-continents", String(e?.message ?? e));
      await shot(page, "fungicont-error").catch(() => {});
    }
    await ctx.close();
  }

  // ---------- «Трава и грибы» + «Растения» + «Континенты» ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
    const page = await ctx.newPage();
    await track(page, "fungi-plants");
    try {
      await runGame(
        page,
        "fungi-plants",
        { players: 3, fungi: true, plants: true, continents: true },
        ["fungiplants-01-dev", "fungiplants-02-feed", "fungiplants-03-end"],
      );
    } catch (e) {
      note("fungi-plants", String(e?.message ?? e));
      await shot(page, "fungiplants-error").catch(() => {});
    }
    await ctx.close();
  }

  // ---------- Мобильная раскладка 390×844 ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await track(page, "fungi-mobile");
    try {
      await runGame(page, "fungi-mobile", { players: 3, fungi: true }, ["fungi-mob-01", "fungi-mob-02", "fungi-mob-03"]);
    } catch (e) {
      note("fungi-mobile", String(e?.message ?? e));
      await shot(page, "fungi-mob-error").catch(() => {});
    }
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify({ problems, ok: problems.length === 0 }, null, 2));
  process.exit(problems.length ? 1 : 0);
})();
