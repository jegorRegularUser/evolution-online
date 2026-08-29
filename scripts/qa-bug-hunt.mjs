/**
 * Охота за багом «после фазы питания игра сбрасывается в меню», версия 3:
 * логируем все console-сообщения (Vite сообщает о page reload через log),
 * навигации фрейма, крах рендер-процесса, потерю WebGL-контекста и рост
 * кучи JS; в момент сброса снимаем скриншот и пишем лог в файл.
 * node scripts/qa-bug-hunt.mjs   (EVO_URL=http://127.0.0.1:8080 для dev)
 */
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";
const browser = await chromium.launch();
const page = await browser.newPage();
const notes = [];
const t0 = Date.now();
const stamp = () => `${Math.round((Date.now() - t0) / 1000)}s`;

// Перехват всех известных механизмов перезагрузки: кто именноReload страницу —
// увидим в логе с типом и стеком вызова.
await page.addInitScript(() => {
  const mark = (msg) => console.warn("[TRAP] " + msg);
  const origReload = Location.prototype.reload;
  Location.prototype.reload = function () {
    mark("SCRIPT RELOAD CALL:\n" + new Error("stack").stack);
    return origReload.call(this);
  };
  for (const [name, fn] of [
    ["assign", Location.prototype.assign],
    ["replace", Location.prototype.replace],
  ]) {
    if (typeof fn !== "function") continue;
    Location.prototype[name] = function (url) {
      mark(`location.${name}(${url})\n` + new Error("stack").stack);
      return fn.call(this, url);
    };
  }
  // WebSocket-трафик дев-сервера: full-reload приходит именно сообщением.
  const OrigWS = window.WebSocket;
  window.WebSocket = class extends OrigWS {
    constructor(...args) {
      super(...args);
      this.addEventListener("message", (e) => {
        try {
          mark("WS<- " + String(e.data).slice(0, 300));
        } catch {
          // ignore
        }
      });
      this.addEventListener("close", () => mark("WS CLOSED"));
    }
  };
  // Потеря WebGL-контекста — частая причина краха рендер-процесса.
  for (const type of ["webglcontextlost", "webglcontextrestored"]) {
    document.addEventListener(
      type,
      (e) => {
        mark(`WEBGL ${type} on <${e.target?.tagName?.toLowerCase() ?? "?"}>`);
      },
      true,
    );
  }
});
page.on("crash", () => notes.push(`${stamp()} RENDERER CRASH: процесс вкладки упал, Chrome перезагрузит страницу`));
page.on("pageerror", (e) => notes.push(`${stamp()} PAGEERROR: ` + e.message));
page.on("console", (m) => {
  const t = m.text();
  if (t.includes("Download the React DevTools")) return;
  notes.push(`${stamp()} CONSOLE[${m.type()}]: ` + t.slice(0, 300));
});
page.on("framenavigated", (f) => {
  if (f === page.mainFrame()) notes.push(`${stamp()} NAVIGATED: ` + f.url());
});

// Куча JS раз в 5 с: линейный рост к сбою — утечка, плоская — память ни при чём.
const heapTimer = setInterval(() => {
  void page
    .evaluate(() => {
      const mem = performance.memory;
      return mem ? Math.round(mem.usedJSHeapSize / 1048576) : null;
    })
    .then((mb) => {
      if (mb !== null) notes.push(`${stamp()} HEAP: ${mb} MB`);
    })
    .catch(() => {});
}, 5000);

try {
  await page.goto(base, { waitUntil: "networkidle" });
  // Теперь load-события — только настоящие перезагрузки после старта.
  page.on("load", () => {
    void page
      .evaluate(() => String(performance.getEntriesByType("navigation")[0]?.type ?? "?"))
      .then((type) => notes.push(`${stamp()} PAGE ${type.toUpperCase()}: ` + page.url()))
      .catch(() => notes.push(`${stamp()} PAGE RELOADED: ` + page.url()));
  });
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
      console.log(`BUG [${stamp()}]: игра сбросилась в главное меню. Действий сделано:`, actions);
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
      writeFileSync("scripts/qa-bug-notes.txt", notes.join("\n"));
      console.log("лог сохранён: scripts/qa-bug-notes.txt");
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
      console.log(`[${stamp()}] фаза:`, phase.trim().replace(/\s+/g, " "));
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
  clearInterval(heapTimer);
  writeFileSync("scripts/qa-bug-notes.txt", notes.join("\n"));
  console.log("── события страницы ──\n" + notes.join("\n"));
  await browser.close();
}
