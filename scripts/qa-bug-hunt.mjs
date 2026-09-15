/**
 * Охота за багом «игра сбрасывается в главное меню» (раньше ловили сброс после
 * фазы питания в соло; теперь то же самое ловим на СЕТЕВОМ столе — потеря
 * сессии у активного игрока): логируем все console-сообщения (Vite сообщает о
 * page reload через log), навигации фрейма, крах рендер-процесса, потерю
 * WebGL-контекста и рост кучи JS; в момент сброса снимаем скриншот и лог.
 * node scripts/qa-bug-hunt.mjs   (EVO_URL=http://127.0.0.1:8099 для dev)
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { endPhaseStep, phaseOf, shotsDir, startNetGame } from "./qa-lib.mjs";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";
// Улики (скриншот и лог) — вне репозитория: запись PNG в scripts/ дёргала
// Tailwind в dev и сама могла провоцировать перезагрузку вкладки, которую
// этот скрипт расследует. Переопределяется переменной EVO_SHOTS.
const SHOTS = shotsDir();
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
  const code = await startNetGame(page, { name: "Охота", players: 2, bots: 1 });
  console.log(`партия запущена (стол ${code})`);

  /** Игра выпала в главное меню? В партии фаза есть, в меню — нет. */
  const inMenu = async () =>
    (await phaseOf(page)) === null &&
    (await page.getByLabel("Ваше имя").isVisible().catch(() => false));

  const deadline = Date.now() + 240_000;
  let actions = 0;
  let phaseSeen = "";
  while (Date.now() < deadline) {
    if (await page.getByText("Конец эволюции").first().isVisible().catch(() => false)) {
      console.log("OK: партия дошла до финала без сброса в меню");
      break;
    }
    if (await inMenu()) {
      // В dev модули грузятся медленно: даём восстановлению партии 6 секунд,
      // чтобы не принять SSR-меню за сброс.
      await page.waitForTimeout(6000);
      if (!(await inMenu())) {
        console.log("OK: после перезагрузки партия восстановилась");
        continue;
      }
      console.log(`BUG [${stamp()}]: игра сбросилась в главное меню. Действий сделано:`, actions);
      const nav = await page.evaluate(() =>
        JSON.stringify(performance.getEntriesByType("navigation").map((n) => ({ type: n.type, activationStart: n.activationStart }))),
      ).catch(() => "n/a");
      console.log("navigation entries:", nav);
      const seat = await page
        .evaluate((c) => {
          const raw = localStorage.getItem(`evo-seat-${c}`);
          return raw ? { code: c, tokenLen: raw.length } : null;
        }, code)
        .catch((e) => "eval error: " + e.message);
      console.log(`evo-seat-${code}:`, JSON.stringify(seat));
      await page.screenshot({ path: join(SHOTS, "qa-bug-menu.png") });
      writeFileSync(join(SHOTS, "qa-bug-notes.txt"), notes.join("\n"));
      console.log(`лог сохранён: ${join(SHOTS, "qa-bug-notes.txt")}`);
      break;
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
    // Ход двигает общий endPhaseStep: «Не защищаться», «Закончить развитие»,
    // «Закончить ход» и «Закончить питание» с подтверждением диалога.
    if (await endPhaseStep(page)) actions++;
    await page.waitForTimeout(220);
  }
  console.log("итераций действий:", actions);
} finally {
  clearInterval(heapTimer);
  writeFileSync(join(SHOTS, "qa-bug-notes.txt"), notes.join("\n"));
  console.log("── события страницы ──\n" + notes.join("\n"));
  await browser.close();
}
