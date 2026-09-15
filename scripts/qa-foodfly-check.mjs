/**
 * Диагностика полёта фишки еды: доходим до фазы питания, берём еду и следим
 * за элементом .food-fly — где он оказывается сразу после вставки и двигается
 * ли анимация. node scripts/qa-foodfly-check.mjs
 *
 * Партия — сетевой стол с ботом (соло-режим удалён): see scripts/qa-lib.mjs.
 */
import { chromium } from "playwright";
import { advancePhase, endPhaseStep, phaseOf, startNetGame, waitHumanTurn } from "./qa-lib.mjs";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

try {
  await page.goto(base, { waitUntil: "networkidle" });
  await startNetGame(page, { name: "Еда", players: 2, bots: 1 });

  // Доходим до фазы питания: завершаем развитие и кормовую базу общим
  // хелпером («Закончить развитие» → «Закончить ход»/«Закончить питание»).
  // Сначала разыграем животное в свой ход: без животного еду взять нельзя,
  // и проверять полёт фишки будет не на чем.
  if (await waitHumanTurn(page, 60_000)) {
    const face = page.locator("[data-hand-row] button", { hasText: "Животное" }).first();
    if (await face.count()) {
      await face.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(500);
    }
  }
  const inFeed = await advancePhase(page, () => phaseOf(page).then((p) => p === "feeding"), {
    timeout: 120_000,
  });
  console.log(inFeed ? "фаза питания достигнута" : `фаза питания НЕ достигнута (${await phaseOf(page)})`);
  if (!inFeed) process.exitCode = 1;

  // Слежение за .food-fly: MutationObserver пишет в window.__flies.
  await page.evaluate(() => {
    window.__flies = [];
    const observer = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLElement && node.classList.contains("food-fly")) {
            const r = node.getBoundingClientRect();
            window.__flies.push({
              t: performance.now(),
              rect: { x: Math.round(r.x), y: Math.round(r.y) },
              pos: getComputedStyle(node).position,
              anim: getComputedStyle(node).animationName,
              transform: getComputedStyle(node).transform.slice(0, 60),
            });
            // И через 250 мс — что стало с анимацией.
            setTimeout(() => {
              const r2 = node.getBoundingClientRect();
              window.__flies.push({
                t: performance.now(),
                later: true,
                rect: { x: Math.round(r2.x), y: Math.round(r2.y) },
                anim: getComputedStyle(node).animationName,
              });
            }, 250);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

  const take = page.getByRole("button", { name: "Взять еду" });
  let hadFood = (await take.isVisible().catch(() => false)) && (await take.isEnabled().catch(() => false));
  if (!hadFood) {
    // Ход мог быть не наш: прокручиваем ходы/фазу, пока «Взять еду» не станет
    // доступна (или пока не выйдем из питания).
    for (let i = 0; i < 20 && !hadFood; i++) {
      await endPhaseStep(page);
      await page.waitForTimeout(350);
      hadFood = (await take.isVisible().catch(() => false)) && (await take.isEnabled().catch(() => false));
    }
  }
  if (hadFood) {
    await take.click();
    console.log("еда взята");
  } else {
    console.log("кнопки «Взять еду» нет — ловим фишку бота");
  }
  // Поллинг: положение фишки каждые 100 мс — анимация должна двигать её.
  const track = [];
  for (let k = 0; k < 12; k++) {
    const pos = await page.evaluate(() => {
      const el = document.querySelector(".food-fly");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y) };
    });
    if (pos) track.push(pos);
    await page.waitForTimeout(100);
  }
  console.log("трек фишки:", JSON.stringify(track));
  const moved = track.length >= 2 && (track[0].x !== track[track.length - 1].x || track[0].y !== track[track.length - 1].y);
  console.log(moved ? "OK: фишка летит (позиция меняется)" : "FAIL: фишка не двигается");
  if (!moved) process.exitCode = 1;
  const flies = await page.evaluate(() => window.__flies);
  console.log(JSON.stringify(flies, null, 1));
} finally {
  if (errors.length) console.log("── ошибки ──\n" + errors.join("\n"));
  await browser.close();
}
