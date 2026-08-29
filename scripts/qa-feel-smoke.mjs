/**
 * Smoke-прогон «оживления» интерфейса: меню → тумблер счёта → экран
 * статистики → старт партии → тумблер звука. Запускать при поднятом
 * dev-сервере: node scripts/qa-feel-smoke.mjs
 */
import { chromium } from "playwright";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => {
    console.error("PAGEERROR:", e.message);
    process.exitCode = 1;
  });

  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Начать год" }).waitFor({ timeout: 20000 });
  console.log("OK: меню отрендерилось");

  await page.getByRole("button", { name: /Показывать счёт/ }).click();
  console.log("OK: тумблер счёта кликабелен");

  await page.getByRole("button", { name: "Статистика" }).click();
  await page.getByText("Партий").first().waitFor({ timeout: 5000 });
  console.log("OK: экран статистики открывается");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Начать год" }).waitFor({ timeout: 5000 });
  console.log("OK: Esc закрывает статистику");

  await page.getByRole("button", { name: "Начать год" }).click();
  await page.getByText("Развитие").first().waitFor({ timeout: 20000 });
  console.log("OK: партия стартовала");

  await page.getByRole("button", { name: /Включить звук|Выключить звук/ }).first().click();
  console.log("OK: тумблер звука кликабелен");

  // Начатый выбор отменяется: выбрать грань карты как свойство, снять по Esc.
  const traitButton = await page
    .locator('[data-hand-row] button, [data-hand-row] [role="button"]')
    .first();
  if (await traitButton.count()) {
    await traitButton.click();
    const cancel = page.getByRole("button", { name: "Отмена" });
    if (await cancel.count()) {
      await cancel.first().click();
      console.log("OK: отмена выбора в доке развития");
    }
  }

  console.log("SMOKE PASSED");
} finally {
  await browser.close();
}
