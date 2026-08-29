/**
 * Smoke-прогон меню и «оживления» интерфейса: полоса навигации (правила,
 * статистика, звук), закрытие модалок Esc и кликом вне, старт партии,
 * отмена выбора и тумблер звука. Запускать при поднятом dev-сервере:
 * node scripts/qa-feel-smoke.mjs
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

  // Правила из полосы навигации закрываются Esc.
  await page.getByRole("button", { name: /Правила/ }).click();
  await page.getByText("Ход года").first().waitFor({ timeout: 5000 });
  console.log("OK: правила открываются из полосы");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Начать год" }).waitFor({ timeout: 5000 });
  console.log("OK: Esc закрывает правила");

  // …и кликом по затемнению вокруг карточки.
  await page.getByRole("button", { name: /Правила/ }).click();
  await page.getByText("Ход года").first().waitFor({ timeout: 5000 });
  await page.mouse.click(24, 200);
  await page.getByRole("button", { name: "Начать год" }).waitFor({ timeout: 5000 });
  console.log("OK: клик вне закрывает правила");

  // Статистика из полосы навигации.
  await page.getByRole("button", { name: /Статистика/ }).click();
  await page.getByText("Партий").first().waitFor({ timeout: 5000 });
  console.log("OK: экран статистики открывается из полосы");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Начать год" }).waitFor({ timeout: 5000 });
  console.log("OK: Esc закрывает статистику");

  // Тумблер звука прямо в меню.
  await page.getByRole("button", { name: /Включить звук|Выключить звук/ }).first().click();
  console.log("OK: тумблер звука кликабелен в меню");

  await page.getByRole("button", { name: "Начать год" }).click();
  await page.getByText("Развитие").first().waitFor({ timeout: 20000 });
  console.log("OK: партия стартовала");

  // Начатый выбор отменяется кнопкой «Отмена» в доке.
  const traitButton = await page.locator('[data-hand-row] button, [data-hand-row] [role="button"]').first();
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
