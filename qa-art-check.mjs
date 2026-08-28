// Проверка подключения арта «Травы и грибов»: все <img> на карте (флора,
// чипы меток, свойства в руке) и на экране правил должны загрузиться
// (naturalWidth > 0), битых путей быть не должно.
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const failed = [];
page.on("requestfailed", (r) => {
  const u = r.url();
  if (u.includes("fonts.g") || u.includes("grok.com")) return;
  failed.push(`requestfailed ${r.failure()?.errorText} ${u}`);
});
page.on("response", (r) => {
  if (r.status() >= 400 && r.url().includes("/img/")) failed.push(`http ${r.status()} ${r.url()}`);
});

const imgReport = async (label) => {
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((el) => el.src.includes("/img/"))
      .map((el) => ({ src: el.src, ok: el.complete && el.naturalWidth > 0 })),
  );
  const bad = imgs.filter((i) => !i.ok);
  console.log(`[art-check] ${label}: img=${imgs.length} broken=${bad.length}`);
  for (const b of bad) failed.push(`${label}: не загрузилось ${b.src}`);
  return imgs.length;
};

// 1. Стол с флорой: включаем «Траву и грибы», старт.
await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Начать год/i }).waitFor({ timeout: 20000 });
const fungiToggle = page.getByRole("button", { name: /Трава и грибы/i }).first();
if (((await fungiToggle.getAttribute("aria-pressed")) ?? "false") !== "true") await fungiToggle.click();
await page.waitForTimeout(200);
await page.getByRole("button", { name: "Быстро" }).first().click().catch(() => {});
await page.getByRole("button", { name: /Начать год/i }).click();
await page.waitForTimeout(3000);

const floraArts = await page.locator("[data-flora-id] img").count();
console.log(`[art-check] стол: карт флоры с артом = ${floraArts}`);
if (floraArts === 0) failed.push("стол: ни одна карта флоры не показывает арт");
// Жетон-бейдж метки на карте флоры (alt начинается с «Метка»).
const floraBadges = await page.locator('[data-flora-id] img[alt^="Метка «"]').count();
console.log(`[art-check] стол: жетонов метки на картах флоры = ${floraBadges}`);
await imgReport("стол");

// Чип метки на животном: ждём появления хотя бы одного (метки приходят
// после питания с флоры) и проверяем, что в чипе есть жетон-картинка.
try {
  await page.locator("[data-mark-chip]").first().waitFor({ timeout: 25000 });
} catch {
  console.log("[art-check] чипы меток не появились за 25с — пропускаю проверку чипа");
}
const markChips = await page.locator("[data-mark-chip] img").count();
const markChipTotal = await page.locator("[data-mark-chip]").count();
console.log(`[art-check] чипы меток: всего=${markChipTotal} с жетоном=${markChips}`);
if (markChipTotal > 0 && markChips === 0) failed.push("чипы меток: жетон-картинка не отрисовывается");

// 2. Экран правил: вкладка «Трава и грибы» — флора и метки.
// Считаем только внутри панели правил: игровой стол за оверлеем продолжает
// жить и добавляет свои картинки.
await page.getByRole("button", { name: "Правила" }).click();
await page.getByRole("tab", { name: "Трава и грибы" }).click();
await page.waitForTimeout(800);
const panel = page.locator("div.fixed.inset-0.z-50").last();
const floraListImgs = await panel.locator('img[src*="/img/flora/"]').count();
const markListImgs = await panel.locator('img[src*="/img/mark/"]').count();
console.log(`[art-check] правила: флора=${floraListImgs}/12 метки=${markListImgs}/8`);
if (floraListImgs !== 12) failed.push(`правила: ожидалось 12 артов флоры, найдено ${floraListImgs}`);
if (markListImgs !== 8) failed.push(`правила: ожидалось 8 жетонов меток, найдено ${markListImgs}`);
await imgReport("правила");

// Вкладка «Мутации»: 7 свойств с артом.
await page.getByRole("tab", { name: "Мутации" }).click();
await page.waitForTimeout(800);
const mutTraitImgs = await panel.locator('img[src*="/img/trait/"]').count();
console.log(`[art-check] правила-мутации: артов свойств = ${mutTraitImgs}`);
if (mutTraitImgs < 7) failed.push(`правила-мутации: ожидалось ≥7 артов свойств, найдено ${mutTraitImgs}`);
await imgReport("правила-мутации");

await browser.close();
if (failed.length) {
  console.error(`FAIL: ${failed.length} проблем(ы)`);
  for (const f of failed) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("OK: все картинки загрузились, битых путей нет");
