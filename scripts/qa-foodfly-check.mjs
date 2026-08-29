/**
 * Диагностика полёта фишки еды: доходим до фазы питания, берём еду и следим
 * за элементом .food-fly — где он оказывается сразу после вставки и двигается
 * ли анимация. node scripts/qa-foodfly-check.mjs
 */
import { chromium } from "playwright";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

try {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Начать год" }).click();

  // Доходим до фазы питания: пасуем в развитии.
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    const txt = await page.evaluate(() => document.body.innerText);
    if (txt.includes("Питание")) break;
    const pass = page.getByRole("button", { name: "Пас", exact: true });
    if ((await pass.isVisible().catch(() => false)) && (await pass.isEnabled().catch(() => false))) {
      await pass.click();
    }
    await page.waitForTimeout(250);
  }
  console.log("фаза питания достигнута");

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
  const hadFood = (await take.isVisible().catch(() => false)) && (await take.isEnabled().catch(() => false));
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
