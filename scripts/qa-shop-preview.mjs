/**
 * QA витрины магазина (/shop, волна «переработка вёрстки»): все 7 предметов
 * рендерятся с НЕПУСТОЙ и ПОПАРНО РАЗЛИЧНОЙ витриной (сукно — свой фон с
 * фельт-текстурой, кости — живой WebGL-канвас своего цвета), превью-панель
 * открывается по одному на страницу (сукно — со скином предмета и нейтральными
 * костями, кубик — на классическом сукне), покупка/экипировка, мобильная
 * вёрстка 390px без горскролла, переход из меню. Скриншоты — в каталог вне
 * репозитория (см. qa-lib).
 * Запуск при живом dev-сервере: node scripts/qa-shop-preview.mjs
 */
import { chromium } from "playwright";
import { SHOTS, bodyOf, gotoUrl, menuReady, newRuPage, sleep, trackPage, waitUntil } from "./qa-lib.mjs";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";

/** Названия предметов в каталоге (ru) — по ним ищем карточки. */
const ITEMS = {
  felt: ["Классическое сукно", "Тундра", "Саванна", "Ледниковое озеро"],
  dice: ["Кость (классика)", "Янтарь", "Вулканическое стекло"],
};
const ALL_ITEMS = [...ITEMS.felt, ...ITEMS.dice];

const browser = await chromium.launch();

// ── прогрев dev-компиляции /shop ─────────────────────────────────────────────
{
  const warm = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
  await gotoUrl(warm.page, `${base}/shop`);
  await sleep(1200);
  await warm.ctx.close().catch(() => {});
}

const { ctx, page } = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
const problems = trackPage(page, "shop");
const ok = (m) => console.log("OK:", m);
const fail = (m) => {
  console.log("FAIL:", m);
  problems.push(m);
};
const noHScroll = () =>
  page
    .evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
    .catch(() => false);

const cardOf = (name) => page.locator("article", { has: page.getByText(name, { exact: true }) }).first();

// ── 1. прямой заход: все 7 предметов с непустой витриной ────────────────────
await gotoUrl(page, `${base}/shop`);
const h1 = page.getByRole("heading", { level: 1, name: "Магазин" });
if (!(await waitUntil(() => h1.isVisible().catch(() => false), 20000))) {
  fail(`h1 «Магазин» не появился; экран: ${await bodyOf(page)}`);
}

// Витрина сукна: span с классом felt-skin-* и фон с текстурой фельта.
async function feltShowcaseOk(name) {
  const swatch = cardOf(name).locator("[aria-hidden].absolute.inset-0");
  if (!(await swatch.count())) return false;
  return page.evaluate((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    const r = el.getBoundingClientRect();
    return /texture-felt\.jpg/.test(bg) && r.width >= 200 && r.height >= 100;
  }, (await swatch.elementHandle()) ?? null);
}

// WebGL-канвас с отрисованными гранями (не пустой) в scope заданного локатора.
async function canvasRendered(scope) {
  const canvas = scope.locator("canvas");
  if (!(await canvas.count())) return false;
  const handle = await canvas.first().elementHandle();
  if (!handle) return false;
  return page.evaluate((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 50 || r.height < 30) return false;
    try {
      // preserveDrawingBuffer в Dice3D — пиксели читаются после укладки.
      const url = el.toDataURL("image/png");
      // Пустой прозрачный канвас даёт короткий однотонный data-URL.
      return url.length > 2000;
    } catch {
      return false;
    }
  }, handle);
}

// Витрина кубика: живой канвас в карточке предмета.
async function diceShowcaseOk(name) {
  return canvasRendered(cardOf(name));
}

// Средний цвет непрозрачных пикселей канваса (кости) — для проверки РАЗЛИЧИЯ
// скинов: три материала должны отличаться не только наличием канваса.
async function canvasMeanColor(scope) {
  const handle = await scope.locator("canvas").first().elementHandle();
  if (!handle) return null;
  return page.evaluate((el) => {
    try {
      const img = new Image();
      img.src = el.toDataURL("image/png");
      return new Promise((res, rej) => {
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = img.width;
          c.height = img.height;
          const g = c.getContext("2d");
          g.drawImage(img, 0, 0);
          const d = g.getImageData(0, 0, c.width, c.height).data;
          let r = 0, gr = 0, b = 0, n = 0;
          for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] < 32) continue; // прозрачный фон сукна не считаем
            r += d[i];
            gr += d[i + 1];
            b += d[i + 2];
            n += 1;
          }
          return n ? res([Math.round(r / n), Math.round(gr / n), Math.round(b / n)]) : rej(new Error("пустой кадр"));
        };
        img.onerror = () => rej(new Error("toDataURL не декодировался"));
      });
    } catch {
      return null;
    }
  }, handle).catch(() => null);
}

// Евклидово расстояние между цветами.
const colorDist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

await waitUntil(() => cardOf("Вулканическое стекло").isVisible().catch(() => false), 20000);

// Кости под фолдом Dice3D строит лениво (IntersectionObserver, как на экране
// правил): прокатываем карточки костей в кадр и ждём укладки физики, иначе
// проверки и скриншоты поймают пустые канвасы.
for (const name of ITEMS.dice) {
  await cardOf(name).scrollIntoViewIfNeeded().catch(() => {});
}
await sleep(2800); // IO → бумага → сцена → физика уложила кости

let shopItemsOk = true;
for (const name of ITEMS.felt) {
  const visible = await cardOf(name).isVisible().catch(() => false);
  const swatch = visible ? await waitUntil(() => feltShowcaseOk(name), 6000, 400) : false;
  if (visible && swatch) ok(`витрина сукна «${name}» рендерится`);
  else {
    fail(`витрина сукна «${name}»: visible=${visible} swatchOk=${swatch}; экран: ${await bodyOf(page)}`);
    shopItemsOk = false;
  }
}
for (const name of ITEMS.dice) {
  const visible = await cardOf(name).isVisible().catch(() => false);
  const canvas = visible ? await waitUntil(() => diceShowcaseOk(name), 8000, 500) : false;
  if (visible && canvas) ok(`витрина костей «${name}» рендерится (WebGL не пустой)`);
  else {
    fail(`витрина костей «${name}»: visible=${visible} canvasOk=${canvas}`);
    shopItemsOk = false;
  }
}

// РАЗЛИЧИЕ скинов: фон каждого сукна — своя строка background-image (у
// классики явный .felt-skin-classic), средний цвет каждой кости — свой.
// Попарно, чтобы «рендерится» не засчитывало два одинаковых свотча.
{
  const feltBgs = [];
  for (const name of ITEMS.felt) {
    const swatch = cardOf(name).locator("[aria-hidden].absolute.inset-0").first();
    const bg = await page
      .evaluate((el) => getComputedStyle(el).backgroundImage, (await swatch.elementHandle()) ?? null)
      .catch(() => "");
    feltBgs.push([name, bg]);
  }
  let feltDistinct = true;
  for (let i = 0; i < feltBgs.length; i++) {
    for (let j = i + 1; j < feltBgs.length; j++) {
      if (feltBgs[i][1] === feltBgs[j][1]) {
        fail(`сукна «${feltBgs[i][0]}» и «${feltBgs[j][0]}» неразличимы (одинаковый фон)`);
        feltDistinct = false;
      }
    }
  }
  if (feltDistinct) ok("сукна попарно различны (4 разных background-image)");
}
{
  const colors = [];
  for (const name of ITEMS.dice) {
    const c = await canvasMeanColor(cardOf(name));
    if (c) colors.push([name, c]);
    else fail(`кости «${name}»: не удалось снять цвет канваса`);
  }
  let diceDistinct = true;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const d = colorDist(colors[i][1], colors[j][1]);
      // Порог 15: сломанный тон (скин не применён) даёт дистанцию ~0..5,
      // а поза костей после физики гуляет на единицы — 15 не ловит её.
      if (d < 15) {
        fail(`кости «${colors[i][0]}» и «${colors[j][0]}» слишком близки по цвету (${Math.round(d)})`);
        diceDistinct = false;
      }
    }
  }
  if (diceDistinct && colors.length === ITEMS.dice.length) {
    ok(
      `кости попарно различны по цвету: ` +
        colors.map(([n, c]) => `${n} rgb(${c.join(",")})`).join("; "),
    );
  }
}

// Крупные карточки ≥200px и вёрстка без горскролла на 1280px.
const minCardW = await page.evaluate(() =>
  Math.min(...[...document.querySelectorAll("article")].map((a) => a.getBoundingClientRect().width)),
);
if (minCardW >= 200) ok(`карточки крупные (мин ширина ${Math.round(minCardW)}px)`);
else fail(`карточки узкие: ${Math.round(minCardW)}px`);
if (await noHScroll()) ok("1280px: без горизонтального скролла");
else fail("1280px: горизонтальный скролл");

// Полный скриншот — после сборки канвасов: кости видны и в fullPage-кадре.
await page.screenshot({ path: `${SHOTS}/shop-desktop-full.png`, fullPage: true });

// Скриншоты карточек: сравнить сукна между собой и увидеть кости.
for (const name of ALL_ITEMS) {
  const card = cardOf(name);
  if (await card.isVisible().catch(() => false)) {
    await card.screenshot({ path: `${SHOTS}/shop-card-${name.replace(/[^\wа-яё]+/gi, "-").toLowerCase()}.png` });
  }
}

// ── 2. превью сукна: моковый стол с классическим сукном + нейтральные кости ─
function previewPanel() {
  return page.locator("[role=region]", { hasText: "Так будет выглядеть стол" }).first();
}
const previewBtn = (name) => cardOf(name).getByRole("button", { name: /Показать превью/ });

const classicBtn = previewBtn("Классическое сукно");
if (await classicBtn.isVisible().catch(() => false)) {
  await classicBtn.click();
  const panel = previewPanel();
  const opened = await waitUntil(() => panel.isVisible().catch(() => false), 8000);
  if (!opened) {
    fail(`превью «Классическое сукно» не открылось; экран: ${await bodyOf(page)}`);
  } else {
    // Фон панели — сукно с фельт-текстурой И со скином самого предмета
    // (felt-skin-classic); кости в панели нейтральные.
    const feltOk = await page.evaluate(() => {
      const regions = [...document.querySelectorAll("[role=region]")];
      const felt = regions
        .find((r) => r.textContent.includes("Так будет выглядеть стол"))
        ?.querySelector(".felt");
      if (!felt) return false;
      return (
        /texture-felt\.jpg/.test(getComputedStyle(felt).backgroundImage) &&
        felt.classList.contains("felt-skin-classic")
      );
    });
    const canvasOk = await waitUntil(() => canvasRendered(panel), 8000, 500);
    if (feltOk && canvasOk) ok("превью сукна: фельт-фон со скином предмета + живые нейтральные кости");
    else fail(`превью сукна: feltOk=${feltOk} canvasOk=${canvasOk}`);
    await sleep(2200);
    await page
      .locator("section", { has: page.getByText("Сукно стола") })
      .first()
      .screenshot({ path: `${SHOTS}/shop-preview-felt-classic.png` });
  }
} else {
  fail("кнопки «Превью» на карточке классического сукна нет");
}

// ── 3. превью кубика: прежнее закрыто, сукно классическое, кости тонированы ─
const amberBtn = previewBtn("Янтарь");
if (await amberBtn.isVisible().catch(() => false)) {
  await amberBtn.click();
  const panel = previewPanel();
  const opened = await waitUntil(() => panel.isVisible().catch(() => false), 8000);
  const stillOpen = await page
    .locator("[role=region]", { hasText: "Превью: Классическое сукно" })
    .isVisible()
    .catch(() => false);
  if (!opened) fail(`превью «Янтарь» не открылось; экран: ${await bodyOf(page)}`);
  else if (stillOpen) fail("открыто два превью сразу (должен быть один на страницу)");
  else {
    const diceOk = await waitUntil(() => canvasRendered(panel), 8000, 500);
    if (diceOk) ok("превью кубика «Янтарь»: одно на страницу, канвас отрисован");
    else fail("превью «Янтарь»: канвас пуст");
    await sleep(2200);
    await page
      .locator("section", { has: page.getByText("Кубик кормовой базы") })
      .first()
      .screenshot({ path: `${SHOTS}/shop-preview-dice-amber.png` });
  }
} else {
  fail("кнопки «Превью» на карточке «Янтарь» нет");
}

// ── 4. покупка/экипировка ────────────────────────────────────────────────────
// Порядок: платные (если хватает баланса) → классика (цена 0, всегда куплена):
// у dev-профиля баланс может быть 0, но «Экипировать» на классике проверит
// тот же серверный cosmeticsEquip.
const balanceText = async () =>
  (await page.getByText(/Ископаемые:/).first().textContent().catch(() => "")) ?? "";
const before = await balanceText();
let flowDone = false;
for (const name of ["Тундра", "Янтарь", "Классическое сукно", "Кость (классика)"]) {
  const card = cardOf(name);
  const buy = card.getByRole("button", { name: "Купить", exact: true });
  const equip = card.getByRole("button", { name: "Экипировать", exact: true });
  if (await buy.isEnabled().catch(() => false)) {
    await buy.click();
    const equipped = await waitUntil(
      () => card.getByText("Надето").isVisible().catch(() => false),
      10000,
      400,
    );
    const after = await balanceText();
    if (equipped && after !== before) ok(`${name}: куплено и экипировано (${before} → ${after})`);
    else fail(`${name}: equipped=${equipped} баланс ${before} → ${after}`);
    flowDone = true;
    break;
  }
  if (await equip.isVisible().catch(() => false)) {
    await equip.click();
    const equipped = await waitUntil(
      () => card.getByText("Надето").isVisible().catch(() => false),
      10000,
      400,
    );
    if (equipped) ok(`${name}: экипировка работает (${before})`);
    else fail(`${name}: «Экипировать» не дал состояние «Надето»`);
    flowDone = true;
    break;
  }
}
if (!flowDone) ok("покупка/экипировка: всё уже экипировано — состояний для клика нет (не падение)");

await page.screenshot({ path: `${SHOTS}/shop-desktop-after-flow.png`, fullPage: true });

// ── 5. мобильная вёрстка 390px ───────────────────────────────────────────────
{
  const m = await newRuPage(browser, { viewport: { width: 390, height: 844 } });
  const mProblems = trackPage(m.page, "shop-mobile");
  problems.push(...mProblems);
  await gotoUrl(m.page, `${base}/shop`);
  await waitUntil(() => m.page.getByText("Вулканическое стекло").isVisible().catch(() => false), 20000);
  // Канвасы костей на телефоне строятся при прокрутке в кадр: прокатываем и
  // ждём укладки, иначе fullPage-скриншот поймает пустые витрины.
  for (const name of ITEMS.dice) {
    await m.page
      .locator("article", { has: m.page.getByText(name, { exact: true }) })
      .scrollIntoViewIfNeeded()
      .catch(() => {});
  }
  await sleep(2800);
  const mNoHScroll = await m.page
    .evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
    .catch(() => false);
  if (mNoHScroll) ok("390px: без горизонтального скролла");
  else fail("390px: горизонтальный скролл");
  const mobileMinW = await m.page.evaluate(() =>
    Math.min(...[...document.querySelectorAll("article")].map((a) => a.getBoundingClientRect().width)),
  );
  if (mobileMinW >= 200) ok(`390px: карточки ${Math.round(mobileMinW)}px — витрина крупная`);
  else fail(`390px: карточки ${Math.round(mobileMinW)}px`);
  await m.page.screenshot({ path: `${SHOTS}/shop-mobile-full.png`, fullPage: true });
  const mPreview = m.page.locator("article", { has: m.page.getByText("Тундра", { exact: true }) }).getByRole("button", { name: /Показать превью/ }).first();
  if (await mPreview.isVisible().catch(() => false)) {
    await mPreview.click();
    await m.page.waitForTimeout(3200);
    await m.page.screenshot({ path: `${SHOTS}/shop-mobile-preview.png`, fullPage: true });
  }
  await m.ctx.close().catch(() => {});
}

// ── 6. переход из меню ───────────────────────────────────────────────────────
await gotoUrl(page, `${base}/`);
if (await menuReady(page, 30000)) {
  const btn = page.getByRole("button", { name: "Магазин", exact: true }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    const navigated = await waitUntil(
      () => new URL(page.url()).pathname === "/shop" && h1.isVisible().catch(() => false),
      15000,
      300,
    );
    if (navigated) ok("меню → «Магазин» ведёт на /shop");
    else fail(`меню → «Магазин»: url=${page.url()}`);
  } else fail("в меню нет кнопки «Магазин»");
} else fail("меню не открылось для проверки навигации");

await ctx.close().catch(() => {});
await browser.close();

if (problems.length) {
  console.log("\nПРОБЛЕМЫ:");
  for (const p of problems) console.log(" -", p);
  process.exit(1);
}
console.log("\nВсе проверки магазина прошли.");
