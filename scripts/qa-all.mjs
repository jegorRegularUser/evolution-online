/**
 * Единая точка входа браузерных QA против живого dev-сервера: запускает
 * набор скриптов последовательно (dev-сервер общий — параллельность ему
 * вредна), не останавливается на первом падении и печатает сводку
 * «скрипт — статус — время».
 *
 * Использование:
 *   npm run qa                      — быстрый набор по умолчанию
 *   npm run qa -- qa-visual qa-dnd  — только указанные (имя с «qa-» или без)
 *   node scripts/qa-all.mjs --full  — весь набор, включая тяжёлые прогоны
 *   EVO_QA_TIMEOUT_MS=900000 ...    — таймаут на скрипт (по умолчанию 12 мин)
 *   EVO_CREATE_PER_HOUR=200 …       — порог «создание столов в час» для ДЕВ-СЕРВЕРА
 *                                     (см. ниже); прокидывается детям, но сервер
 *                                     читает его из СВОЕГО окружения.
 *   EVO_URL, EVO_SHOTS              — прокидываются в скрипты как обычно;
 *                                     EVO_SHOTS по умолчанию — %TEMP%, чтобы
 *                                     PNG не попадали в репозиторий и не
 *                                     дёргали Tailwind в dev.
 *
 * Лимиты волны 4 и почему батч их не выедает:
 *   — сервер режет создание столов (10/час на источник) и входы/наблюдение/
 *     переподключения (30/мин). Полный набор создаёт десятки комнат, поэтому
 *     dev-сервер для пачки нужно поднимать с `EVO_CREATE_PER_HOUR=200`
 *     (`EVO_CREATE_PER_HOUR=200 npm run dev`); переменная читается сервером
 *     при каждом create, но только из окружения САМОГО сервера — проброс в
 *     дочерние скрипты её не заменяет. qa-all кладёт её в childEnv, чтобы
 *     скрипты, которые сами поднимают сервер, унаследовали порог;
 *   — прогревы скриптов (qa-lib.warmupServer) больше не создают комнат и не
 *     жгут лимит входов: негодные данные отсекаются схемой до сервиса;
 *   — если сервер всё же ответил «Слишком много созданных столов», qa-all
 *     печатает подсказку про перезапуск dev с переменной.
 *
 * Соло-режим удалён (M1): все сценарные скрипты поднимают СЕТЕВОЙ стол через
 * scripts/qa-lib.mjs (`startNetGame`), поэтому «соло» в имени файла больше не
 * значит соло — см. шапку самого скрипта. Отсутствующие файлы не роняют
 * прогон: они попадают в сводку как SKIP с причиной.
 *
 * Известные флейки перечислены ниже: если такой скрипт падает, в сводке
 * будет явная пометка с причиной, а не молчаливый красный статус.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099";
/** Быстрый дым: меню, визуал, кубики, drag&drop, еда, подсказки, сетевое лобби. */
const DEFAULT_SET = [
  "qa-feel-smoke",
  "qa-visual",
  "qa-dice-check",
  "qa-dnd",
  "qa-foodfly-check",
  "tip-smoke",
  "qa-net-lobby",
];
/** Тяжёлые прогоны: полные партии, матрицы вьюпортов, волновые сценарии. */
const FULL_SET = [
  ...DEFAULT_SET,
  "qa-wave1-docks",
  "qa-wave1-chat",
  "qa-wave1-sound",
  "qa-wave2-lobby",
  "qa-wave2-table",
  "qa-mobile-fix-check",
  "qa-bug-hunt",
  "qa-bank-probe",
  "qa-issues-probe",
  "qa-solo-full",
  "qa-walkthrough-shots",
  "qa-net-spectate",
  "qa-net-privacy",
];

/**
 * Скрипты, которые могут падать по причинам вне кода скрипта. Пометка
 * печатается в сводке рядом со статусом; провал при этом не скрывается.
 */
const KNOWN_FLAKY = {
  "qa-net-lobby":
    "сетевые сценарии: живой dev с параллельными агентами (full-reload Vite посреди прогона); " +
    "если PGlite-схема живого сервера старше migrations/ (например, «column typing_at does not exist»), " +
    "лобби не открывается до перезапуска dev — если UI блокирует понижение мест, " +
    "сценарий проверяет контракт через netSetCapacity и печатает WARN",
  "qa-mobile-fix-check":
    "сетевые проверки лобби/стола требуют свежей PGlite-схемы живого dev и отсутствия " +
    "full-reload от параллельных правок src",
  "qa-wave1-docks": "нужен живой dev без перезагрузок Vite и со свежей схемой БД",
  "qa-wave1-chat": "чат требует свежей PGlite-схемы живого dev (typing_at) и отсутствия перезагрузок",
  "qa-wave1-sound": "нужен живой dev без перезагрузок Vite от параллельных правок",
  "qa-dnd":
    "нужен живой dev без перезагрузок; драг мышью считается по координатам после прокрутки " +
    "(sticky-док перекрывает ряд животных) — если падают проверки индикатора вставки, " +
    "смотрите скриншоты dnd-*.png: там видно, что было под курсором",
  "qa-solo-full":
    "имя файла историческое: это полная партия против ботов через СЕТЕВОЙ стол; " +
    "бюджет 300 с на партию, на перегруженном dev-сервере может не уложиться",
  "qa-walkthrough-shots": "полный обход меню + партия на десктопе и мобилке; долгий, зависит от стабильности dev",
  "qa-visual": "фаза кормовой базы короткая: проверки кубиков чувствительны к перезагрузкам Vite",
  "tip-smoke": "нужны свойства на столе (карты в руке) — зависит от перезагрузок Vite",
};

/**
 * `qa-visual` / `visual` / `qa-visual.mjs` → `qa-visual`; `tip-smoke` остаётся
 * `tip-smoke`. Префикс `qa-` добавляем ТОЛЬКО если файла без него нет: в наборе
 * есть скрипты без префикса (tip-smoke), и безусловное добавление превращало
 * их в вечный SKIP «файла нет», хотя scripts/tip-smoke.mjs существует.
 */
function normalizeName(raw) {
  const base = raw.replace(/\.mjs$/i, "");
  if (base.startsWith("qa-")) return base;
  return existsSync(join("scripts", `${base}.mjs`)) ? base : `qa-${base}`;
}

const args = process.argv.slice(2);
const FULL = args.includes("--full") || process.env.EVO_QA_FULL === "1";
const names = (args.filter((a) => !a.startsWith("-")).length
  ? args.filter((a) => !a.startsWith("-"))
  : FULL
    ? FULL_SET
    : DEFAULT_SET
).map(normalizeName);
const timeoutMs = Number(process.env.EVO_QA_TIMEOUT_MS ?? 12 * 60_000);
/**
 * Порог создания столов для QA-пачки. Сервер читает его из своего окружения
 * (process.env.EVO_CREATE_PER_HOUR), поэтому здесь он только прокидывается
 * детям — и печатается подсказка, если живой dev его не унаследовал.
 */
const CREATE_PER_HOUR = process.env.EVO_CREATE_PER_HOUR ?? "200";

const childEnv = {
  ...process.env,
  EVO_URL: process.env.EVO_URL ?? BASE,
  EVO_SHOTS: process.env.EVO_SHOTS ?? join(tmpdir(), "evo-qa-shots"),
  EVO_CREATE_PER_HOUR: CREATE_PER_HOUR,
};

async function devAlive() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(5000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

/** Серверные лимиты, по которым даём подсказку в сводке (тексты NetError). */
const LIMIT_HINTS = [
  {
    re: /Слишком много созданных столов/,
    hint:
      "упёрлись в лимит создания столов (10/час): перезапустите dev с " +
      `EVO_CREATE_PER_HOUR=${CREATE_PER_HOUR} (ин-мемори счётчик сбросится вместе с процессом)`,
  },
  {
    re: /Слишком много попыток входа|подождите минуту/,
    hint: "лимит входов/наблюдения 30/мин: подождите минуту и повторите скрипт",
  },
];

function runScript(name) {
  const file = join("scripts", `${name}.mjs`);
  if (!existsSync(file)) {
    return Promise.resolve({ skipped: true, code: null, ms: 0, reason: "файла нет" });
  }
  const started = Date.now();
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [file], { stdio: ["ignore", "pipe", "pipe"], env: childEnv });
    // Вывод ребёнка льём как есть, но копим хвост: по нему ищем серверные
    // лимиты и дописываем подсказку, а не молчаливый красный статус.
    const tail = [];
    const tee = (stream, sink) => {
      stream.on("data", (buf) => {
        sink.write(buf);
        tail.push(buf.toString("utf8"));
        if (tail.length > 400) tail.shift();
      });
    };
    tee(child.stdout, process.stdout);
    tee(child.stderr, process.stderr);
    const timer = setTimeout(() => {
      console.error(`\n[qa-all] ${name}: таймаут ${Math.round(timeoutMs / 1000)} с — снимаю процесс`);
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000).unref?.();
    }, timeoutMs);
    const finish = (code, reason) => {
      clearTimeout(timer);
      const text = tail.join("");
      const limit = LIMIT_HINTS.find((h) => h.re.test(text));
      resolve({
        skipped: false,
        code: code ?? 1,
        ms: Date.now() - started,
        reason: reason ?? null,
        limitHint: code ? (limit?.hint ?? null) : null,
      });
    };
    child.on("exit", (code, signal) => finish(signal ? 1 : (code ?? 1), signal ? `снят по сигналу ${signal}` : null));
    child.on("error", (e) => finish(1, String(e.message ?? e)));
  });
}

function fmtMs(ms) {
  const s = Math.round(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}м ${String(s % 60).padStart(2, "0")}с` : `${s}с`;
}

if (!(await devAlive())) {
  console.error(
    `[qa-all] dev-сервер ${BASE} не отвечает. Поднимите его (npm run dev) — ` +
      "скрипты запускаются только против живого сервера.",
  );
  process.exit(2);
}

console.log(`[qa-all] dev: ${BASE}`);
console.log(`[qa-all] снимки: ${childEnv.EVO_SHOTS}`);
console.log(`[qa-all] скриптов: ${names.length}`);
console.log(
  `[qa-all] лимит создания столов: ${CREATE_PER_HOUR}/час (EVO_CREATE_PER_HOUR). ` +
    "Сервер читает его из СВОЕГО окружения: если dev поднят без переменной, " +
    `перезапустите его как EVO_CREATE_PER_HOUR=${CREATE_PER_HOUR} npm run dev.`,
);
console.log("");

const results = [];
for (const name of names) {
  console.log(`\n═══ ${name} ═══`);
  const r = await runScript(name);
  r.name = name;
  results.push(r);
  const status = r.skipped ? "SKIP" : r.code === 0 ? "PASS" : "FAIL";
  console.log(`─── ${name}: ${status} (${fmtMs(r.ms)})${r.reason ? ` — ${r.reason}` : ""}`);
}

// ── Сводка ──────────────────────────────────────────────────────────────────
const nameW = Math.max(4, ...results.map((r) => r.name.length));
console.log("\n════ СВОДКА ════");
console.log(`${"скрипт".padEnd(nameW)} | статус | время`);
console.log(`${"-".repeat(nameW)}-+--------+-------`);
let failed = 0;
for (const r of results) {
  const status = r.skipped ? "SKIP" : r.code === 0 ? "PASS" : "FAIL";
  if (status === "FAIL") failed++;
  let note = r.reason ?? "";
  if (status === "FAIL" && KNOWN_FLAKY[r.name]) {
    note = note ? `${note}; известный флейк: ${KNOWN_FLAKY[r.name]}` : `известный флейк: ${KNOWN_FLAKY[r.name]}`;
  } else if (status !== "FAIL" && KNOWN_FLAKY[r.name] && !r.skipped) {
    note = note ? `${note}; (известный флейк-риск: ${KNOWN_FLAKY[r.name]})` : "";
  }
  if (status === "FAIL" && r.limitHint) {
    note = note ? `${note}; ${r.limitHint}` : r.limitHint;
  }
  console.log(`${r.name.padEnd(nameW)} | ${status.padEnd(6)} | ${fmtMs(r.ms).padEnd(5)}${note ? `  — ${note}` : ""}`);
}
const passed = results.filter((r) => !r.skipped && r.code === 0).length;
const skipped = results.filter((r) => r.skipped).length;
console.log(`\nИтог: PASS ${passed}/${results.length}${failed ? `, FAIL ${failed}` : ""}${skipped ? `, SKIP ${skipped}` : ""}`);
if (failed) {
  console.log("Провалившиеся скрипты не скрыты: смотрите их вывод выше и строку «известный флейк» с причиной.");
}
process.exit(failed ? 1 : 0);
