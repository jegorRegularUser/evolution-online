#!/usr/bin/env node
/**
 * Операторский кредит «Ископаемых» на локальном дев-стенде.
 *
 *   node scripts/credit-fossils.mjs [сумма=1000000]
 *
 * ВАЖНО про устройство базы: локальный дев-сервер живёт на встраиваемом
 * PGLite БЕЗ каталога данных (src/lib/db.ts — `new PGlite(...)` in-memory),
 * поэтому «остановить сервер и открыть ту же базу скриптом» невозможно:
 * базы на диске нет, она умирает вместе с процессом. Любой кредит извне
 * стёрся бы рестартом. Единственный честный путь — кредит изнутри процесса:
 *
 *   1. читаем текущий баланс через /shop (до убийства сервера);
 *   2. убиваем процесс на порту (netstat/taskkill);
 *   3. поднимаем `npm run dev` заново с EVO_CREDIT_FOSSILS=<сумма>
 *      (+ EVO_CREATE_PER_HOUR=200 как у живого стенда) в фоне;
 *   4. первый профильный запрос нового процесса начисляет сумму один раз
 *      (src/lib/profile/service.server.ts, DEV_SEED_ENV) и пишет
 *      before/after в лог сервера;
 *   5. ждём HTTP 200, перепроверяем баланс на /shop, скриншотим.
 *
 * Идемпотентность: начисление — раз за жизнь процесса сервера; повторный
 * запуск скрипта просто поднимает свежий процесс, где баланс снова (0 + N).
 * Сумма без переменной окружения не начисляется ничем: сервис по умолчанию
 * не меняет поведение.
 */
import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PORT = Number(process.env.EVO_PORT ?? 8099);
const BASE = process.env.EVO_URL ?? `http://127.0.0.1:${PORT}`;
const AMOUNT = (() => {
  const n = Number(process.argv[2] ?? 1_000_000);
  if (!Number.isInteger(n) || n <= 0 || n > 1_000_000_000) {
    console.error(`[credit] сумма должна быть целым 1..1e9, получено: ${process.argv[2]}`);
    process.exit(1);
  }
  return n;
})();
const LOG = join(tmpdir(), "evo-dev-server.log");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function logLine(...args) {
  console.log("[credit]", ...args);
}

/** PIDs, слушающие порт (netstat -ano; Windows-стенд проекта). */
function listeningPids(port) {
  try {
    const out = execSync(`netstat -ano -p tcp`, { encoding: "utf8", timeout: 10_000 });
    const pids = new Set();
    for (const line of out.split("\n")) {
      if (!line.includes(`:${port} `) || !/LISTENING/i.test(line)) continue;
      const pid = Number(line.trim().split(/\s+/).at(-1));
      if (Number.isInteger(pid) && pid > 0) pids.add(pid);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function killServer(port) {
  const pids = listeningPids(port);
  if (!pids.length) return false;
  for (const pid of pids) {
    try {
      execSync(`taskkill /F /T /PID ${pid}`, { encoding: "utf8", timeout: 10_000, stdio: "pipe" });
      logLine(`остановлен процесс ${pid} (порт ${port})`);
    } catch (e) {
      logLine(`taskkill ${pid} не прошёл: ${String(e).slice(0, 120)}`);
    }
  }
  return true;
}

async function httpOk(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Баланс со страницы /shop: чип «Ископаемые: N» / «Fossils: N». */
async function readBalanceViaShop() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ locale: "ru-RU" });
    await ctx.addInitScript(() => {
      try { localStorage.setItem("evo-lang", "ru"); } catch { /* приватный режим */ }
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/shop`, { waitUntil: "networkidle", timeout: 60_000 });
    const chip = page.getByText(/(Ископаемые|Fossils):\s*[\d\s\u00a0]+/).first();
    await chip.waitFor({ state: "visible", timeout: 30_000 });
    const text = await chip.textContent();
    const n = Number((text ?? "").replace(/[^\d]/g, ""));
    const shotDir = process.env.EVO_SHOTS ?? join(tmpdir(), "evo-qa-shots");
    mkdirSync(shotDir, { recursive: true });
    await page.screenshot({ path: join(shotDir, "shop-balance.png"), fullPage: false });
    if (!Number.isInteger(n)) throw new Error(`чип баланса не распознан: "${text}"`);
    return { balance: n, text: (text ?? "").trim() };
  } finally {
    await browser.close();
  }
}

/** Хвост лога сервера: строка начисления [profile] EVO_CREDIT_FOSSILS. */
function seedLogLine() {
  try {
    if (!existsSync(LOG)) return null;
    const tail = readFileSync(LOG, "utf8").slice(-20_000);
    const line = tail.split("\n").find((l) => l.includes("[profile] EVO_CREDIT_FOSSILS"));
    return line?.trim() ?? null;
  } catch {
    return null;
  }
}

// ── сценарий ─────────────────────────────────────────────────────────────────
//
// Режимы (второй аргумент):
//   full   — до-баланс → стоп сервера → старт с кредитом → ожидание → после-баланс
//   prep   — до-баланс → стоп сервера (старт делает вызывающий: фоновая задача
//            шелла надёжнее detached-spawn из короткоживущего процесса)
//   verify — ожидание HTTP 200 → после-баланс + скриншот + строка начисления
const MODE = (process.argv[3] ?? "full").toLowerCase();

function writeStarter() {
  // Лог — через редирект cmd: detached-процесс на Windows получает новую
  // консоль и переданные stdio-fd не наследует (проверено: файл пуст), а
  // составная строка `npm run dev >> лог` внутри spawn-аргументов ломается
  // экранированием кавычек. Поэтому — крошечный батник в temp и чистый вызов.
  const starter = join(tmpdir(), "start-evo-dev.cmd");
  writeFileSync(
    starter,
    [
      "@echo off",
      `cd /d "${ROOT}"`,
      "set EVO_CREATE_PER_HOUR=200",
      `set EVO_CREDIT_FOSSILS=${AMOUNT}`,
      `npm run dev >> "${LOG}" 2>&1`,
      "",
    ].join("\r\n"),
  );
  return starter;
}

async function waitForServer(timeoutS = 150) {
  for (let i = 0; i < timeoutS; i++) {
    if (await httpOk(BASE, 3000)) return true;
    await sleep(1000);
  }
  return false;
}

async function readAfter() {
  let after = null;
  for (let attempt = 0; attempt < 3 && !after; attempt++) {
    try {
      after = await readBalanceViaShop();
    } catch (e) {
      if (attempt === 2) console.error(`[credit] баланс ПОСЛЕ не прочитан: ${String(e).split("\n")[0]}`);
      await sleep(2000);
    }
  }
  if (!after) process.exit(1);
  logLine(`баланс ПОСЛЕ: ${after.text}`);
  logLine(`строка начисления в логе сервера: ${seedLogLine() ?? "(не найдена)"}`);
  logLine(`скриншот: ${join(process.env.EVO_SHOTS ?? join(tmpdir(), "evo-qa-shots"), "shop-balance.png")}`);
  const ok = after.balance >= AMOUNT;
  logLine(ok ? "OK" : `НЕДОСТАТОК: ожидалось >= ${AMOUNT}`);
  process.exit(ok ? 0 : 1);
}

if (MODE === "prep") {
  if (await httpOk(BASE)) {
    try {
      logLine(`баланс ДО: ${(await readBalanceViaShop()).text}`);
    } catch (e) {
      logLine(`баланс ДО не прочитан (/shop): ${String(e).split("\n")[0]}`);
    }
    killServer(PORT);
  } else {
    logLine(`сервер на ${BASE} не отвечал — просто освобождаем порт`);
  }
  // Порт должен освободиться, иначе новый vite упадёт с EADDRINUSE.
  for (let i = 0; i < 20 && listeningPids(PORT).length; i++) await sleep(500);
  writeStarter();
  logLine(`стартер готов: ${join(tmpdir(), "start-evo-dev.cmd")} (сумма ${AMOUNT})`);
  process.exit(0);
}

if (MODE === "verify") {
  if (!(await waitForServer())) {
    console.error(`[credit] сервер не поднялся — смотрите ${LOG}`);
    process.exit(1);
  }
  logLine(`сервер отвечает: ${BASE}`);
  await readAfter();
}

// full — автономный прогон: сам останавливает, сам поднимает, сам проверяет.
let before = null;
if (await httpOk(BASE)) {
  try {
    before = await readBalanceViaShop();
    logLine(`баланс ДО: ${before.text}`);
  } catch (e) {
    logLine(`баланс ДО не прочитан (/shop): ${String(e).split("\n")[0]}`);
  }
  killServer(PORT);
} else {
  logLine(`сервер на ${BASE} не отвечал — стартую без остановки`);
}
for (let i = 0; i < 20 && listeningPids(PORT).length; i++) await sleep(500);

const starter = writeStarter();
const child = spawn("cmd.exe", ["/d", "/c", starter], {
  stdio: "ignore",
  detached: true,
  windowsHide: true,
});
child.on("error", (e) => console.error("[credit] старт сервера не удался:", e?.message ?? e));
child.unref(); // сервер живёт независимо от этого скрипта (nohup-style)
logLine(`сервер поднимается в фоне (pid ${child.pid}), лог: ${LOG}`);

if (!(await waitForServer())) {
  console.error(`[credit] сервер не поднялся за 150 с — смотрите ${LOG}`);
  process.exit(1);
}
logLine(`сервер отвечает: ${BASE}`);
await readAfter();
