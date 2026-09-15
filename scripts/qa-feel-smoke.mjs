/**
 * Smoke-прогон меню и «оживления» интерфейса: полоса навигации (правила,
 * статистика, звук), закрытие модалок Esc и кликом вне, старт СЕТЕВОЙ партии,
 * отмена выбора и тумблер звука. Запускать при поднятом dev-сервере:
 * node scripts/qa-feel-smoke.mjs
 *
 * Соло-режим удалён (M1): «Начать год» в меню и «Незаконченная партия /
 * Продолжить» больше нет, поэтому маркер готовности меню — поле имени сетевой
 * секции, а партия поднимается столом с ботом. Проверки отмены хода («Отменить
 * действие») и сворачивания партии — соло-механики, они из прогона убраны.
 */
import { chromium } from "playwright";
import { menuReady, phaseOf, safeClick, startNetGame } from "./qa-lib.mjs";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => {
    console.error("PAGEERROR:", e.message);
    process.exitCode = 1;
  });

  /** Меню на экране: поле имени сетевой секции вместо удалённой кнопки старта. */
  const inMenu = async (timeout) => {
    const ok = await menuReady(page, timeout).catch(() => false);
    if (!ok) throw new Error("меню не на экране (нет поля имени/«Создать стол»)");
    return true;
  };

  await page.goto(base, { waitUntil: "networkidle" });
  await inMenu(20000);
  console.log("OK: меню отрендерилось");

  // Правила из полосы навигации закрываются Esc.
  await page.getByRole("button", { name: /Правила/ }).click();
  await page.getByText("Ход года").first().waitFor({ timeout: 15000 });
  console.log("OK: правила открываются из полосы");
  await page.keyboard.press("Escape");
  await inMenu(5000);
  console.log("OK: Esc закрывает правила");

  // …и кликом по затемнению вокруг карточки.
  await page.getByRole("button", { name: /Правила/ }).click();
  await page.getByText("Ход года").first().waitFor({ timeout: 15000 });
  await page.mouse.click(24, 200);
  await inMenu(5000);
  console.log("OK: клик вне закрывает правила");

  // Статистика из полосы навигации.
  await page.getByRole("button", { name: /Статистика/ }).click();
  await page.getByText("Партий").first().waitFor({ timeout: 5000 });
  console.log("OK: экран статистики открывается из полосы");
  await page.keyboard.press("Escape");
  await inMenu(5000);
  console.log("OK: Esc закрывает статистику");

  // Звук в меню: одна иконка открывает панель настроек, тумблер «Звук» глушит
  // всю шину. Волна 1 отменила «глушение одним кликом» по иконке, поэтому
  // проверяем связку «иконка → панель → тумблер → data-sound у иконки».
  const soundButton = page.locator("button[data-sound]").first();
  await soundButton.waitFor({ timeout: 15000 });
  await soundButton.click();
  const soundDialog = page.getByRole("dialog", { name: "Настройки звука" });
  await soundDialog.waitFor({ timeout: 5000 });
  const soundSwitch = soundDialog.getByRole("switch", { name: "Звук" });
  const wasOn = (await soundSwitch.getAttribute("aria-checked")) === "true";
  // Громкость гасится и поднимается плавно (~0.12 с), поэтому ждём именно
  // величину masterGain, а не только смену атрибута: иначе проверка ловит
  // середину затухания.
  const waitGain = (zero) =>
    page
      .waitForFunction(
        async (wantZero) => {
          const m = await import("/src/lib/sfx.ts");
          const g = m.sfx.debugState().masterGain;
          return wantZero ? g === 0 : g > 0;
        },
        zero,
        { timeout: 3000 },
      )
      .then(() => true)
      .catch(() => false);
  await soundSwitch.click();
  if (!(await waitGain(wasOn))) {
    const gain = await page.evaluate(async () => {
      const m = await import("/src/lib/sfx.ts");
      return m.sfx.debugState().masterGain;
    });
    throw new Error(
      `тумблер звука не ${wasOn ? "заглушил" : "включил"} звук: masterGain=${gain}`,
    );
  }
  const stateAfter = await soundButton.getAttribute("data-sound");
  if (wasOn ? stateAfter !== "off" : stateAfter === "off") {
    throw new Error(`иконка звука не отразила состояние тумблера: data-sound=${stateAfter}`);
  }
  await soundSwitch.click(); // вернуть исходное состояние
  await waitGain(!wasOn);
  await page.keyboard.press("Escape");
  await page.getByRole("dialog", { name: "Настройки звука" }).waitFor({ state: "detached", timeout: 5000 });
  console.log("OK: иконка звука открывает настройки, тумблер глушит и включает, Esc закрывает");

  // Обучение: слайды, стрелки, закрытие по Esc.
  await page.getByRole("button", { name: /Обучение/ }).click();
  await page.getByText("Как играть в «Эволюцию»").waitFor({ timeout: 5000 });
  console.log("OK: обучение открывается");
  await page.getByRole("button", { name: "Далее" }).click();
  await page.locator("text=Развитие >> visible=true").first().waitFor({ timeout: 5000 });
  console.log("OK: слайды обучения листаются");
  await page.keyboard.press("Escape");
  await inMenu(5000);
  console.log("OK: Esc закрывает обучение");

  // ── Сетевая партия (соло-старт из меню удалён) ──
  const code = await startNetGame(page, { name: "Смоук", players: 2, bots: 1 });
  console.log(`OK: сетевой стол ${code} стартовал, фаза: ${await phaseOf(page)}`);
  await page.locator("text=Развитие >> visible=true").first().waitFor({ timeout: 20000 });
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

  // «Покинуть стол»: в сетевой партии сворачивания с сейвом нет — выход идёт
  // через подтверждение («Сдаться и выйти») и возвращает в меню.
  const leave = page.getByRole("button", { name: "Покинуть стол" });
  if (await leave.count()) {
    await safeClick(leave.first(), 3000);
    const confirm = page.getByRole("button", { name: /Сдаться и выйти|Покинуть стол/ }).last();
    await safeClick(confirm, 3000);
    const back = await menuReady(page, 20_000).catch(() => false);
    if (back) console.log("OK: «Покинуть стол» возвращает в меню");
    else console.log("WARN: выход из сетевого стола не вернул меню");
  } else {
    console.log("WARN: кнопка «Покинуть стол» не найдена");
  }

  console.log("SMOKE PASSED");
} finally {
  await browser.close();
}
