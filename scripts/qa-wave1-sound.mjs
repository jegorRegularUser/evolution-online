/**
 * QA к M19 («верни как было со звуком»): у звука в шапке должна остаться ОДНА
 * иконка (без отдельной каретки), клик по ней открывает панель настроек, а
 * иконка снаружи сразу показывает состояние. Скрипт проверяет:
 *   — в шапке нет `lucide-chevron-down` рядом со звуком и ровно одна кнопка звука;
 *   — клик по иконке НЕ глушит звук (старое поведение), а открывает `role="dialog"`;
 *   — тумблер в панели «Звук» выключает: `localStorage["evo-sound"] === "off"`,
 *     `data-sound="off"`, SVG меняется на `lucide-volume-x`, `masterGain` → 0;
 *   — приглушение обоих слайдеров до 0 даёт `data-sound="quiet"` (`lucide-volume-1`);
 *   — панель закрывается Esc и кликом вне, состояние иконки переживает закрытие;
 *   — в игровом столе и в лобби сетевого стола иконка читает ту же шину.
 * Запускать при живом dev-сервере: node scripts/qa-wave1-sound.mjs
 *
 * Соло-режим удалён (M1): партия поднимается сетевым столом через
 * `startNetGame` из scripts/qa-lib.mjs, меню ждём `openMenu`.
 *
 * Скриншоты — ВНЕ репозитория: Tailwind в dev сканирует проект, и каждый новый
 * PNG внутри него может вызвать перезагрузку вкладок (см. qa-net-lobby.mjs).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { openMenu, roomCode, safeClick, startNetGame, waitUntil } from "./qa-lib.mjs";

const SHOTS = process.env.EVO_SHOTS ?? join(tmpdir(), "evo-wave1-sound");
mkdirSync(SHOTS, { recursive: true });

const report = { shots: SHOTS, steps: [], problems: [], evidence: {} };
const ok = (m) => {
  console.log("OK:", m);
  report.steps.push("OK: " + m);
};
const fail = (m) => {
  console.log("FAIL:", m);
  report.problems.push(m);
  report.steps.push("FAIL: " + m);
};
const info = (m) => {
  console.log("   ", m);
  report.steps.push(m);
};
/** Утверждение одной строкой: пишем OK или FAIL, прогон не роняем. */
const check = (cond, good, bad) => (cond ? ok(good) : fail(bad));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

/** Снимок состояния одной кнопки звука: атрибуты + класс SVG-иконки. */
const SOUND_STATE = `(() => {
  const b = document.querySelector("button[data-sound]");
  if (!b) return null;
  return {
    sound: b.getAttribute("data-sound"),
    pressed: b.getAttribute("aria-pressed"),
    expanded: b.getAttribute("aria-expanded"),
    haspopup: b.getAttribute("aria-haspopup"),
    label: b.getAttribute("aria-label"),
    svg: (b.querySelector("svg")?.getAttribute("class") || "").split(" ").filter((c) => c.startsWith("lucide-")).join(","),
    title: b.getAttribute("title"),
    chevrons: document.querySelectorAll("svg.lucide-chevron-down").length,
    soundButtons: document.querySelectorAll('button[aria-label="Настройки звука"]').length,
  };
})()`;

async function soundState(page) {
  return page.evaluate(SOUND_STATE);
}

/** Установить значение range-слайдера так, как это делает React (native setter). */
async function setRange(page, name, value) {
  await page.evaluate(
    ({ name, value }) => {
      const label = [...document.querySelectorAll("label")].find((l) => l.textContent === name);
      const input = label ? document.getElementById(label.htmlFor) : null;
      if (!input) throw new Error("слайдер не найден: " + name);
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    { name, value },
  );
  await sleep(120);
}

let shotN = 0;
async function shot(page, name, { zoom = true } = {}) {
  shotN += 1;
  const file = `${String(shotN).padStart(2, "0")}-${name}.png`;
  const path = join(SHOTS, file);
  await page.screenshot({ path });
  console.log("  скрин:", path);
  const paths = [path];
  if (zoom) {
    const box = await page.evaluate(() => {
      const b = document.querySelector("button[data-sound]");
      if (!b) return null;
      const r = b.closest("div.relative")?.getBoundingClientRect() ?? b.getBoundingClientRect();
      return { right: r.right, top: r.top };
    });
    if (box) {
      const clip = {
        x: Math.max(0, box.right - 330),
        y: Math.max(0, box.top - 14),
        width: 330,
        height: 290,
      };
      const zoomPath = join(SHOTS, `${String(shotN).padStart(2, "0")}-${name}-zoom.png`);
      await page.screenshot({ path: zoomPath, clip });
      console.log("  скрин:", zoomPath);
      paths.push(zoomPath);
    }
  }
  return paths;
}

try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => fail("PAGEERROR: " + e.message));

  await openMenu(page);
  await sleep(300);

  const soundBtn = page.locator("button[data-sound]");

  // ── 0. Приводим состояние к «звук включён» ──
  let st = await soundState(page);
  if (st?.sound === "off") {
    await soundBtn.click();
    await page.getByRole("switch", { name: "Звук" }).click();
    await sleep(200);
    await page.keyboard.press("Escape");
    await sleep(150);
    info("исходно звук был выключен — включили через панель");
  }

  // ── 1. Одна иконка, без каретки, постоянное доступное имя ──
  st = await soundState(page);
  report.evidence.initial = st;
  if (!st) throw new Error("кнопка звука не найдена");
  check(
    st.soundButtons === 1,
    "в шапке ровно одна кнопка звука",
    `кнопок звука: ${st.soundButtons}`,
  );
  check(
    st.chevrons === 0,
    "отдельной каретки ChevronDown больше нет",
    `в DOM осталось каретк(и): ${st.chevrons}`,
  );
  check(
    st.label === "Настройки звука",
    "доступное имя постоянное: «Настройки звука»",
    `имя кнопки: ${st.label}`,
  );
  check(st.haspopup === "dialog", "aria-haspopup=dialog", `aria-haspopup=${st.haspopup}`);
  check(
    st.expanded === "false",
    "панель закрыта: aria-expanded=false",
    `aria-expanded=${st.expanded}`,
  );
  check(
    st.sound === "on" && st.svg.includes("lucide-volume-2"),
    "звук включён: иконка Volume2, data-sound=on",
    `ожидали on/Volume2, получили ${st.sound}/${st.svg}`,
  );
  await shot(page, "menu-closed-on");

  // ── 2. Клик по иконке открывает панель и НЕ глушит звук ──
  await soundBtn.click();
  await page.getByRole("dialog", { name: "Настройки звука" }).waitFor({ timeout: 5000 });
  await sleep(200);
  const afterOpen = await soundState(page);
  const lsAfterOpen = await page.evaluate(() => localStorage.getItem("evo-sound"));
  report.evidence.afterIconClick = { ...afterOpen, localStorage: lsAfterOpen };
  check(
    afterOpen.expanded === "true",
    "клик по иконке раскрыл панель (aria-expanded=true)",
    "aria-expanded не стал true",
  );
  check(
    afterOpen.sound === "on" && lsAfterOpen !== "off",
    "клик по иконке не глушит звук (старое поведение снято)",
    `клик по иконке заглушил звук: ${afterOpen.sound}/${lsAfterOpen}`,
  );
  await shot(page, "menu-panel-open-on");

  // ── 3. Выключение из панели: иконка меняется, localStorage «off», тишина ──
  await page.getByRole("switch", { name: "Звук" }).click();
  await page
    .waitForFunction(() => localStorage.getItem("evo-sound") === "off", undefined, {
      timeout: 5000,
    })
    .catch(() => {});
  const offState = await soundState(page);
  const lsOff = await page.evaluate(() => localStorage.getItem("evo-sound"));
  report.evidence.afterSwitchOff = { ...offState, localStorage: lsOff };
  check(lsOff === "off", "localStorage evo-sound = off", `localStorage evo-sound = ${lsOff}`);
  check(
    offState.sound === "off" && offState.svg.includes("lucide-volume-x"),
    "иконка снаружи сменилась на VolumeX (data-sound=off)",
    `иконка после выключения: ${offState.sound}/${offState.svg}`,
  );
  check(
    offState.pressed === "false",
    "aria-pressed=false при выключенном звуке",
    `aria-pressed=${offState.pressed}`,
  );
  const gain = await page
    .evaluate(async () => {
      const m = await import("/src/lib/sfx.ts");
      return m.sfx.debugState().masterGain;
    })
    .catch(() => null);
  await sleep(300); // mute-рампа 0.12 с
  const gainSettled = await page
    .evaluate(async () => {
      const m = await import("/src/lib/sfx.ts");
      return m.sfx.debugState().masterGain;
    })
    .catch(() => null);
  report.evidence.masterGain = { rightAfter: gain, settled: gainSettled };
  if (gainSettled === null) {
    info("masterGain не прочитан (динамический импорт sfx недоступен) — пропускаем");
  } else {
    check(
      gainSettled === 0,
      "masterGain = 0 — звук реально заглушён",
      `masterGain после выключения: ${gainSettled}`,
    );
  }
  await shot(page, "menu-panel-open-off");

  // ── 4. Esc закрывает панель, иконка остаётся выключенной ──
  await page.keyboard.press("Escape");
  await page
    .getByRole("dialog", { name: "Настройки звука" })
    .waitFor({ state: "detached", timeout: 5000 });
  const closedOff = await soundState(page);
  report.evidence.closedOff = closedOff;
  check(
    closedOff.sound === "off" && closedOff.expanded === "false",
    "Esc закрыл панель, иконка снаружи осталась VolumeX",
    `после Esc: ${closedOff.sound}, expanded=${closedOff.expanded}`,
  );
  await shot(page, "menu-closed-off");

  // ── 5. Включение обратно + закрытие кликом вне ──
  await soundBtn.click();
  await page.getByRole("dialog", { name: "Настройки звука" }).waitFor({ timeout: 5000 });
  const sw = page.getByRole("switch", { name: "Звук" });
  check(
    (await sw.getAttribute("aria-checked")) === "false",
    "тумблер помнит выключенное состояние",
    "тумблер не выключен после переоткрытия",
  );
  await sw.click();
  await page
    .waitForFunction(() => localStorage.getItem("evo-sound") === "on", undefined, { timeout: 5000 })
    .catch(() => {});
  await page.mouse.click(30, 600);
  await page
    .getByRole("dialog", { name: "Настройки звука" })
    .waitFor({ state: "detached", timeout: 5000 });
  const backOn = await soundState(page);
  report.evidence.backOn = backOn;
  check(
    backOn.sound === "on" && backOn.svg.includes("lucide-volume-2"),
    "клик вне панели закрыл её; звук включён, иконка Volume2",
    `после включения: ${backOn.sound}/${backOn.svg}`,
  );
  await shot(page, "menu-closed-on-again");

  // ── 6. Приглушение слайдерами: промежуточная иконка Volume1 ──
  await soundBtn.click();
  await page.getByRole("dialog", { name: "Настройки звука" }).waitFor({ timeout: 5000 });
  await setRange(page, "Эффекты", 0);
  await setRange(page, "Фон", 0);
  await sleep(250);
  const quiet = await soundState(page);
  report.evidence.quiet = quiet;
  check(
    quiet.sound === "quiet" && quiet.svg.includes("lucide-volume-1"),
    "оба слайдера в 0 → иконка Volume1 (data-sound=quiet), звук всё ещё включён",
    `после приглушения: ${quiet.sound}/${quiet.svg}`,
  );
  await shot(page, "menu-panel-open-quiet");
  // Возвращаем громкости по умолчанию (1 / 0.5), чтобы не оставлять тишину.
  await setRange(page, "Эффекты", 100);
  await setRange(page, "Фон", 50);
  const restored = await soundState(page);
  check(
    restored.sound === "on",
    "громкости возвращены: иконка снова Volume2",
    `после возврата: ${restored.sound}/${restored.svg}`,
  );
  await shot(page, "menu-panel-open-restored");

  // ── 7. Второй экземпляр — в игровом столе (game-app) ──
  await page.keyboard.press("Escape");
  await startNetGame(page, { name: "QA-Звук-Игра", players: 2, bots: 1 });
  await sleep(800);
  const gameBtn = page.locator("button[data-sound]");
  const gameOn = await page.evaluate(SOUND_STATE);
  report.evidence.game = gameOn;
  check(
    gameOn?.sound === "on",
    "в столе партии иконка читает ту же шину: on/Volume2",
    `в игре: ${gameOn?.sound}/${gameOn?.svg}`,
  );
  await gameBtn.first().click();
  await page.getByRole("dialog", { name: "Настройки звука" }).first().waitFor({ timeout: 5000 });
  await page.getByRole("switch", { name: "Звук" }).first().click();
  await sleep(300);
  const gameOff = await page.evaluate(SOUND_STATE);
  const lsGame = await page.evaluate(() => localStorage.getItem("evo-sound"));
  report.evidence.gameOff = { ...gameOff, localStorage: lsGame };
  check(
    gameOff?.sound === "off" && lsGame === "off",
    "выключение в столе: evo-sound=off, иконка VolumeX",
    `в столе после выключения: ${gameOff?.sound}/${lsGame}`,
  );
  await shot(page, "game-panel-open-off");
  // Возвращаем звук включённым, чтобы не менять пользовательскую настройку.
  await page.getByRole("switch", { name: "Звук" }).first().click();
  await sleep(250);
  await page.keyboard.press("Escape");
  info("в игре звук возвращён во включённое состояние");

  await ctx.close();

  // ── 8. Мобильная шапка: одна иконка, панель влезает в экран ──
  {
    const mctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mp = await mctx.newPage();
    mp.on("pageerror", (e) => fail("MOBILE PAGEERROR: " + e.message));
    await openMenu(mp);
    await sleep(300);
    await mp.locator("button[data-sound]").click();
    await mp.getByRole("dialog", { name: "Настройки звука" }).waitFor({ timeout: 5000 });
    const geom = await mp.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-label="Настройки звука"]');
      const r = d.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        vw: window.innerWidth,
        docOverflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    report.evidence.mobile = geom;
    check(
      geom.left >= 0 && geom.right <= geom.vw,
      `мобильная панель внутри экрана (${geom.left}..${geom.right} при ${geom.vw}px)`,
      `панель вылезает за экран: ${JSON.stringify(geom)}`,
    );
    await shot(mp, "mobile-menu-panel");
    await mctx.close();
  }

  // ── 9. Третий экземпляр — сетевой стол (net-screens, NetTopBar) ──
  try {
    const nctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const np = await nctx.newPage();
    np.on("pageerror", (e) => fail("NET PAGEERROR: " + e.message));
    await openMenu(np);
    await np.getByLabel("Ваше имя").fill("QA-Звук");
    await sleep(200);
    await safeClick(np.getByRole("button", { name: "Создать стол" }).last(), 5000);
    const lobby = await waitUntil(() => roomCode(np), 25_000, 400);
    if (!lobby) throw new Error("лобби не открылось (dev-перезагрузка?)");
    await np.getByRole("button", { name: "Настройки звука" }).waitFor({ timeout: 15000 });
    await sleep(400);
    const netState = await np.evaluate(SOUND_STATE);
    report.evidence.netLobby = netState;
    check(
      netState?.soundButtons === 1 && netState?.chevrons === 0,
      "в шапке сетевого стола одна иконка звука, каретки нет",
      `в сетевом столе: кнопок ${netState?.soundButtons}, кареток ${netState?.chevrons}`,
    );
    await np.getByRole("button", { name: "Настройки звука" }).click();
    await np.getByRole("dialog", { name: "Настройки звука" }).waitFor({ timeout: 5000 });
    await shot(np, "net-lobby-panel-open");
    await np.keyboard.press("Escape");
    await np
      .getByRole("dialog", { name: "Настройки звука" })
      .waitFor({ state: "detached", timeout: 5000 });
    ok("в сетевом столе панель открывается кликом по иконке и закрывается Esc");
    // Уходим из своего стола, чтобы не держать занятое место.
    await safeClick(np.getByRole("button", { name: "Покинуть стол" }), 5000);
    await sleep(500);
    await nctx.close();
  } catch (e) {
    fail("сетевой стол не проверен: " + (e?.message ?? e));
  }
} catch (e) {
  fail("EXCEPTION: " + (e?.stack ?? e));
} finally {
  writeFileSync(join(SHOTS, "report.json"), JSON.stringify(report, null, 2));
  console.log("\n=== ИТОГ ===");
  console.log("проблем:", report.problems.length);
  report.problems.forEach((p) => console.log(" -", p));
  console.log("скриншоты:", SHOTS);
  await browser.close();
  if (report.problems.length) process.exitCode = 1;
}
