// Проверка иллюстраций экрана правил: базовая игра (3D-кубики, жетоны,
// животные), «Континенты» (карточки территорий), «Растения» (виды).
// Все <img> должны загрузиться, у кубиков должен быть canvas.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
mkdirSync(OUT, { recursive: true });

const problems = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", (e) => problems.push(`pageerror: ${e}`));

await page.goto(BASE, { waitUntil: "networkidle" });
// Правила можно открыть прямо из меню — партию начинать не нужно.
await page.getByRole("button", { name: /Правила/i }).first().click();
await page.waitForTimeout(500);

const broken = () =>
  page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((el) => el.src.includes("/img/"))
      .filter((el) => !el.complete || el.naturalWidth === 0)
      .map((el) => el.src),
  );

async function checkTab(name, shot) {
  await page.getByRole("tab", { name }).click();
  await sleep(700);
  const bad = await broken();
  if (bad.length) problems.push(`${name}: не загрузилось ${bad.length}: ${bad.slice(0, 3).join(", ")}`);
  await page.screenshot({ path: `${OUT}${shot}.png`, fullPage: false });
  console.log(`[rules-qa] ${name}: скриншот ${shot}, битых картинок ${bad.length}`);
}

// Базовая игра: 3D-кубики (canvas) + кубики-фишки еды (SVG FoodCube).
await checkTab("Базовая игра", "rules-base");
const dice = await page.locator("canvas[role='img']").count();
console.log(`[rules-qa] базовая: canvas кубиков = ${dice}`);
if (dice === 0) problems.push("базовая: 3D-кубики не отрисованы (нет canvas)");
const foodCubes = await page.evaluate(
  () => [...document.querySelectorAll('svg[viewBox="0 0 20 21"]')].length,
);
console.log(`[rules-qa] базовая: кубиков-фишек еды (SVG) = ${foodCubes}`);
if (foodCubes < 4) problems.push(`базовая: ожидалось ≥4 кубиков-фишек, найдено ${foodCubes}`);
const baseImgs = await page.evaluate(() => [...document.querySelectorAll("img")].filter((i) => i.src.includes("/img/")).length);
console.log(`[rules-qa] базовая: иллюстраций = ${baseImgs}`);
if (baseImgs < 8) problems.push(`базовая: ожидалось ≥8 иллюстраций (карты/животные), найдено ${baseImgs}`);

// Континенты: 3 карточки территорий с описаниями.
await checkTab("Континенты", "rules-continents");
const terrImgs = await page.evaluate(() => [...document.querySelectorAll("img")].filter((i) => i.src.includes("/img/world/")).length);
console.log(`[rules-qa] континенты: артов территорий = ${terrImgs}`);
if (terrImgs !== 3) problems.push(`континенты: ожидалось 3 арта территорий, найдено ${terrImgs}`);
for (const t of ["Лавразия", "Гондвана", "Океан"]) {
  const has = await page.getByText(t, { exact: true }).first().isVisible().catch(() => false);
  if (!has) problems.push(`континенты: нет названия «${t}»`);
}

// Растения: 10 видов с артами.
await checkTab("Растения", "rules-plants");
const plantImgs = await page.evaluate(() => [...document.querySelectorAll("img")].filter((i) => i.src.includes("/img/plant/")).length);
console.log(`[rules-qa] растения: артов видов = ${plantImgs}`);
if (plantImgs !== 10) problems.push(`растения: ожидалось 10 артов видов, найдено ${plantImgs}`);

// Трава и грибы + Мутации: прежние списки не сломались.
await checkTab("Трава и грибы", "rules-fungi");
await checkTab("Мутации", "rules-mutations");

await browser.close();
if (problems.length) {
  console.error(`FAIL: ${problems.length} проблем(ы)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("OK: все вкладки правил с иллюстрациями, битых картинок нет");
