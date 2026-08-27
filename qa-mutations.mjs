// Локальная браузерная QA дополнения «Случайные мутации»: тумблер, партия
// с мутациями (отдельно и в комбинации с «Континентами» и «Растениями»),
// проверка дока мутаций, численности видов и завершения партии.
// Использование: node qa-mutations.mjs [baseUrl]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
mkdirSync(OUT, { recursive: true });

const problems = [];
function note(kind, text) {
  problems.push(`[${kind}] ${text}`);
  console.error(`[mutations-qa] ${kind}: ${text}`);
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
  console.log(`[mutations-qa] screenshot ${name}`);
}

async function startGame(page, { players = 3, mutations = true, continents = false, plants = false } = {}) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  const start = page.getByRole("button", { name: /Начать год/i });
  await start.waitFor({ state: "visible", timeout: 20000 });
  const nBtn = page.getByRole("button", { name: String(players), exact: true }).first();
  if (await nBtn.isVisible().catch(() => false)) await nBtn.click();
  await page.waitForTimeout(150);
  const toggle = async (name, want) => {
    const btn = page.getByRole("button", { name: new RegExp(name, "i") }).first();
    const on = (await btn.getAttribute("aria-pressed")) === "true";
    if (want !== on) await btn.click();
  };
  await toggle("Континенты", continents);
  await toggle("Растения", plants);
  await toggle("Случайные мутации", mutations);
  await page.waitForTimeout(150);
  const fast = page.getByRole("button", { name: "Быстро" }).first();
  if (await fast.isVisible().catch(() => false)) await fast.click();
  await start.click();
}

let lastLabel = "";
async function click(page, locator) {
  try {
    await locator.click({ timeout: 2500 });
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
      hasTarget: Boolean(document.querySelector("[data-animal-id].ring-accent, [data-plant-id].ring-accent")),
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
  // Развитие мутаций: объявление розыгрыша верхней карты колоды.
  if (snap.footer.some((t) => t.includes("Новый вид"))) {
    const roll = Math.random();
    const label =
      roll < 0.45
        ? "Новый вид"
        : roll < 0.75
          ? "Свойство"
          : roll < 0.9
            ? "+1 животное виду"
            : snap.footer.some((t) => t.includes("Свойство растения"))
              ? "Свойство растения"
              : "Свойство";
    const btn = page.getByRole("button", { name: label, exact: false }).first();
    if (label === "Новый вид") {
      // Две кнопки континентов — любая.
      const any = page.getByRole("button", { name: /Новый вид/ }).first();
      if (await click(page, any)) return "newAnimal";
      return null;
    }
    if (await click(page, btn)) {
      // После «Свойство»/«+1 животное» — клик по подсвеченному виду.
      await sleep(200);
      const target = page.locator("[data-animal-id].ring-accent, [data-plant-id].ring-accent").first();
      if (await click(page, target)) return `mutate:${label}`;
      return "mutate-intent";
    }
    return null;
  }
  // Подсвеченная цель интента (питание).
  if (snap.hasTarget) {
    if (await click(page, page.locator("[data-animal-id].ring-accent, [data-plant-id].ring-accent").first())) return "target";
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
    // «Закончить ход» и «Пас» можно жать подряд: иногда это единственные кнопки.
    if (label === lastLabel && label !== "Охота" && label !== "Закончить ход" && label !== "Пас") continue;
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
  let sawMutateDock = false;
  let sawPopulation = false;
  let sawMutationLog = false;
  let sawDeckCounter = false;
  for (let i = 0; i < 9000; i++) {
    const text = await page.evaluate(() => document.body.innerText);
    if (i % 100 === 0) console.log(`[mutations-qa] ${label} i=${i} phase=${(text.match(/Год \d+ · [А-Яа-яё]+/) ?? ["?"])[0]}`);
    if (!sawMutateDock) {
      sawMutateDock = await page.getByRole("button", { name: /Новый вид/ }).first().isVisible().catch(() => false);
    }
    if (!sawPopulation) {
      sawPopulation = await page.locator('[title^="Численность вида"]').count().then((n) => n > 0);
    }
    if (!sawMutationLog && /мутация|вредная мутация|Почкование|Короед/i.test(text)) sawMutationLog = true;
    if (!sawDeckCounter && /колода \d+/i.test(text)) sawDeckCounter = true;
    if (text.includes("Конец эволюции") || text.includes("Ещё партия")) break;
    if (i === 30 && shots[0]) await shot(page, shots[0]);
    if (i === 400 && shots[1]) await shot(page, shots[1]);
    const did = await autoStep(page);
    if (!did) await sleep(200);
  }
  await sleep(600);
  if (shots[2]) await shot(page, shots[2]);
  const finalText = await page.evaluate(() => document.body.innerText);
  const finished = finalText.includes("Конец эволюции") || finalText.includes("Ещё партия");
  if (!finished) note(label, "партия не дошла до конца за лимит шагов");
  if (!sawMutateDock) note(label, "док мутаций («Новый вид») не появился");
  if (!sawDeckCounter) note(label, "счётчик слепой колоды не показан");
  console.log(
    `[mutations-qa] ${label}: finished=${finished} dock=${sawMutateDock} population=${sawPopulation} mutationLog=${sawMutationLog} deck=${sawDeckCounter}`,
  );
  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflowX > 2) note(label, `горизонтальный overflow ${overflowX}px`);
  return { finished, sawMutateDock, sawPopulation };
}

const browser = await chromium.launch();

(async () => {
  // ---------- «Случайные мутации» отдельно (desktop) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
    const page = await ctx.newPage();
    await track(page, "mutations");
    try {
      await runGame(page, "mutations", { players: 2 }, ["mut-01-dev", "mut-02-feed", "mut-03-end"]);
    } catch (e) {
      note("mutations", String(e?.message ?? e));
      await shot(page, "mut-error").catch(() => {});
    }
    await ctx.close();
  }

  // ---------- Мутации + Континенты + Растения (desktop) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
    const page = await ctx.newPage();
    await track(page, "mutations-combo");
    try {
      await runGame(
        page,
        "mutations-combo",
        { players: 2, continents: true, plants: true },
        ["mutcombo-01-dev", "mutcombo-02-feed", "mutcombo-03-end"],
      );
    } catch (e) {
      note("mutations-combo", String(e?.message ?? e));
      await shot(page, "mutcombo-error").catch(() => {});
    }
    await ctx.close();
  }

  // ---------- Мутации на мобиле ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await track(page, "mutations-mobile");
    try {
      await runGame(page, "mutations-mobile", { players: 2 }, ["mutmob-01", "mutmob-02", "mutmob-03"]);
    } catch (e) {
      note("mutations-mobile", String(e?.message ?? e));
      await shot(page, "mutmob-error").catch(() => {});
    }
    await ctx.close();
  }

  await browser.close();
  if (problems.length) {
    console.log(`[mutations-qa] FAIL: ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log("[mutations-qa] OK");
})();
