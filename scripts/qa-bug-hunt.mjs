/**
 * Охота за багом «после фазы питания игра сбрасывается в меню», версия 2:
 * логируем все console-сообщения (Vite сообщает о page reload через log),
 * навигации фрейма и снимаем скриншот в момент сброса.
 * node scripts/qa-bug-hunt.mjs
 */
import { chromium } from "playwright";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";
const browser = await chromium.launch();
const page = await browser.newPage();
const notes = [];
// Перехват перезагрузки: если страница сама зовёт location.reload — увидим стектрейс.
await page.addInitScript(() => {
  const origReload = Location.prototype.reload;
  Location.prototype.reload = function () {
    console.warn("SCRIPT RELOAD CALL:\n" + new Error("stack").stack);
    return origReload.call(this);
  };
});
page.on("pageerror", (e) => notes.push("PAGEERROR: " + e.message));
page.on("console", (m) => {
  const t = m.text();
  if (t.includes("WebGL") || t.includes("Download the React DevTools")) return;
  notes.push(`CONSOLE[${m.type()}]: ` + t.slice(0, 200));
});
page.on("framenavigated", (f) => {
  if (f === page.mainFrame()) notes.push("NAVIGATED: " + f.url());
});

try {
  await page.goto(base, { waitUntil: "networkidle" });
  // Теперь load-события — только настоящие перезагрузки после старта.
  page.on("load", () => notes.push("PAGE RELOADED: " + page.url()));
  await page.getByRole("button", { name: "Начать год" }).click();
  console.log("партия запущена");

  const deadline = Date.now() + 240_000;
  let actions = 0;
  let phaseSeen = "";
  while (Date.now() < deadline) {
    if (await page.getByText("Конец эволюции").first().isVisible().catch(() => false)) {
      console.log("OK: партия дошла до финала без сброса в меню");
      break;
    }
    if (await page.getByRole("button", { name: "Начать год" }).isVisible().catch(() => false)) {
      // В dev модули грузятся медленно: даём восстановлению партии 6 секунд,
      // чтобы не принять SSR-меню за сброс.
      await page.waitForTimeout(6000);
      if (!(await page.getByRole("button", { name: "Начать год" }).isVisible().catch(() => false))) {
        console.log("OK: после перезагрузки партия восстановилась");
        continue;
      }
      console.log("BUG: игра сбросилась в главное меню. Действий сделано:", actions);
      const nav = await page.evaluate(() =>
        JSON.stringify(performance.getEntriesByType("navigation").map((n) => ({ type: n.type, activationStart: n.activationStart }))),
      ).catch(() => "n/a");
      console.log("navigation entries:", nav);
      const solo = await page
        .evaluate(() => {
          const raw = localStorage.getItem("evo-solo-game");
          if (!raw) return null;
          try {
            const p = JSON.parse(raw);
            return { savedAt: p.savedAt, phase: p.state?.phase, year: p.state?.year, ageMs: Date.now() - p.savedAt };
          } catch {
            return "broken json";
          }
        })
        .catch((e) => "eval error: " + e.message);
      console.log("evo-solo-game:", JSON.stringify(solo));
      await page.screenshot({ path: "scripts/qa-bug-menu.png" });
      break;
    }
    const noDefense = page.getByRole("button", { name: "Не защищаться" });
    if (await noDefense.isVisible().catch(() => false)) {
      await noDefense.click();
      actions++;
      continue;
    }
    const spotlight = page.locator(".spotlight-backdrop");
    if (await spotlight.isVisible().catch(() => false)) {
      await spotlight.click({ position: { x: 40, y: 40 } }).catch(() => {});
      continue;
    }
    // Текущая фаза — для понимания момента сброса.
    const phase = await page.locator("header .text-xs").first().textContent().catch(() => "");
    if (phase && phase !== phaseSeen) {
      phaseSeen = phase;
      console.log("фаза:", phase.trim().replace(/\s+/g, " "));
    }
    const pass = page.getByRole("button", { name: "Пас", exact: true });
    if ((await pass.isVisible().catch(() => false)) && (await pass.isEnabled().catch(() => false))) {
      await pass.click();
      actions++;
      await page.waitForTimeout(220);
      continue;
    }
    const endTurn = page.getByRole("button", { name: "Закончить ход" });
    if ((await endTurn.isVisible().catch(() => false)) && (await endTurn.isEnabled().catch(() => false))) {
      await endTurn.click();
      actions++;
      await page.waitForTimeout(220);
      continue;
    }
    await page.waitForTimeout(200);
  }
  console.log("итераций действий:", actions);
} finally {
  console.log("── события страницы ──\n" + notes.join("\n"));
  await browser.close();
}
