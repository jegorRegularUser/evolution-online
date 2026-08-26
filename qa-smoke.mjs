// Локальная браузерная QA: прогон партии с ботами до конца, скриншоты, консоль.
// Использование: node qa-smoke.mjs [baseUrl]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
mkdirSync(OUT, { recursive: true });

const problems = [];
function note(kind, text) {
  problems.push(`[${kind}] ${text}`);
  console.error(`[smoke] ${kind}: ${text}`);
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
  console.log(`[smoke] screenshot ${name}`);
}

async function startGame(page, players = 4) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  const start = page.getByRole("button", { name: /Начать год/i });
  await start.waitFor({ state: "visible", timeout: 20000 });
  const nBtn = page.getByRole("button", { name: String(players), exact: true }).first();
  if (await nBtn.isVisible().catch(() => false)) await nBtn.click();
  await page.waitForTimeout(150);
  await shot(page, "menu");
  // Самая быстрая скорость для прогона
  const fast = page.getByRole("button", { name: "Быстро" }).first();
  if (await fast.isVisible().catch(() => false)) await fast.click();
  await start.click();
}

/** Проверка раскладки: центральное поле и порядок секций, горизонтальные слайдеры. */
async function layoutCheck(page, label, mobile) {
  const info = await page.evaluate(() => {
    const felt = document.querySelector(".felt");
    const sections = [...document.querySelectorAll("[data-player-section]")];
    const sliders = [...document.querySelectorAll(".overflow-x-auto")]
      .filter((el) => el.scrollWidth > el.clientWidth + 2)
      .filter((el) => !el.closest("[data-hand-row]"))
      .map((el) => el.className.slice(0, 60));
    return {
      feltTop: felt ? Math.round(felt.getBoundingClientRect().top) : null,
      firstSectionTop: sections.length ? Math.round(sections[0].getBoundingClientRect().top) : null,
      sliders,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  if (mobile && info.feltTop !== null && info.firstSectionTop !== null && info.feltTop > info.firstSectionTop) {
    note(label, `база должна быть выше секций игроков: felt=${info.feltTop} section=${info.firstSectionTop}`);
  }
  if (info.sliders.length) note(label, `горизонтальные слайдеры: ${info.sliders.join(" | ")}`);
  if (info.overflowX > 2) note(label, `горизонтальный overflow ${info.overflowX}px`);
  console.log(`[smoke] ${label} layout: ${JSON.stringify(info)}`);
}

/** Один шаг автоигрока за человека; возвращает true, если что-то нажало. */
let lastLabel = "";
async function autoStep(page) {
  // Защита от нападения — модалка (все варианты, включая мимикрию)
  const surrender = page.getByRole("button", { name: /Не защищаться/i });
  if (await surrender.isVisible().catch(() => false)) {
    await surrender.click();
    return "surrender";
  }
  const running = page.getByRole("button", { name: /Быстрое — бросок кубика/i });
  if (await running.isVisible().catch(() => false)) {
    await running.click();
    return "running";
  }
  const mimic = page.getByRole("button", { name: /Мимикрия на другое животное/i }).first();
  if (await mimic.isVisible().catch(() => false)) {
    await mimic.click();
    return "mimicry";
  }
  const tail = page.getByRole("button", { name: /^Отбросить /i }).first();
  if (await tail.isVisible().catch(() => false)) {
    await tail.click();
    return "tail";
  }
  // Подсвеченное животное = валидная цель текущего интента (свойство, охота, еда…)
  const target = page.locator("[data-animal-id].ring-accent").first();
  if ((await target.count()) > 0) {
    await target.click();
    return "target";
  }
  // Развитие: иногда выкладываем животное, иначе пас
  const animalBtn = page.getByRole("button", { name: "Животное" }).first();
  if (await animalBtn.isEnabled().catch(() => false)) {
    if (Math.random() < 0.55) {
      await animalBtn.click();
      return "animal";
    }
  }
  for (const label of ["Взять еду", "Жир", "Спячка", "Охота", "Топотун", "Закончить ход", "Пас"]) {
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

async function bodyHasText(page) {
  const text = await page.evaluate(() => document.body.innerText);
  return text.trim().length > 40;
}

const browser = await chromium.launch();

(async () => {
  // ---------- Desktop ----------
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
  const page = await ctx.newPage();
  await track(page, "desktop");

  try {
    await startGame(page, 4);
    await sleep(1200);
    await shot(page, "desktop-development");
    await layoutCheck(page, "desktop", false);

    let steps = 0;
    let diceShot = false;
    let extinctShot = false;
    let lastPhaseLog = "";
    const t0 = Date.now();
    while (Date.now() - t0 < 300000) {
      const over = await page.getByText(/Конец эволюции|Ваша популяция доминирует|Вас вытеснили/i).first().isVisible().catch(() => false);
      if (over) break;

      const phase = await page.evaluate(() => document.body.innerText.match(/Год \d+ · [^\n]+/u)?.[0] ?? "");
      if (phase && phase !== lastPhaseLog) {
        console.log(`[smoke] ${phase}`);
        lastPhaseLog = phase;
      }
      if (!diceShot && /Кормовая база/.test(phase)) {
        await sleep(700);
        await shot(page, "desktop-dice");
        diceShot = true;
      }
      if (!extinctShot && phase.includes("Вымирание")) {
        await shot(page, "desktop-extinction");
        extinctShot = true;
      }

      const acted = await autoStep(page);
      if (!acted) await sleep(350);
      else steps++;
      await sleep(200);
    }
    await shot(page, "desktop-end");
    const content = await bodyHasText(page);
    if (!content) note("desktop", "пустое тело страницы");
    console.log(`[smoke] desktop steps=${steps}`);

    // Горизонтальный overflow на десктопе недопустим
    const overflowD = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflowD > 2) note("desktop", `горизонтальный overflow ${overflowD}px`);
  } catch (e) {
    note("desktop/fatal", String(e?.stack ?? e));
    await shot(page, "desktop-fatal").catch(() => {});
  }
  await ctx.close();

  // ---------- Mobile (390×844) ----------
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mpage = await mctx.newPage();
  await track(mpage, "mobile");
  try {
    await startGame(mpage, 2);
    await sleep(1500);
    await shot(mpage, "mobile-development");
    await layoutCheck(mpage, "mobile", true);
    const text = await bodyHasText(mpage);
    if (!text) note("mobile", "пустое тело страницы");
  } catch (e) {
    note("mobile/fatal", String(e?.stack ?? e));
    await shot(mpage, "mobile-fatal").catch(() => {});
  }
  await mctx.close();

  await browser.close();

  console.log(JSON.stringify({ ok: problems.length === 0, problems }, null, 2));
  process.exit(problems.length === 0 ? 0 : 1);
})();
