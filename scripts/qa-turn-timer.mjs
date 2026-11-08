/**
 * QA «Таймер хода» (T1 + T2): живой dev-сервер (EVO_URL, по умолчанию 8099).
 *
 * Что проверяем:
 *   a) лобби: контроль «Таймер хода» (Выкл/30 с/1 мин/2 мин/3 мин), хост ставит
 *      «30 с», значение держится на сервере; после старта дедлайн хода человека
 *      ≈30 с; свой бейдж-таймер на моём табло работает как раньше; в ход бота
 *      на ЕГО табло тикает бейдж (скриншот);
 *   b) «Выкл»: ход человека стоит > 90 с БЕЗ принудительного конца
 *      (net.turnDeadlineAt === null, ход не уходит); игрок завершает сам;
 *      стол закрывается;
 *   c) стол, созданный без настройки (старый путь): дедлайн ≈ 60 с (умолчание);
 *   d) гость в лобби видит выбранное значение, но кнопки для него заперты.
 *
 * Запуск: EVO_URL=http://127.0.0.1:8099 node scripts/qa-turn-timer.mjs
 * Скриншоты — вне репозитория (%TEMP%/evo-qa-shots, см. qa-lib.shotsDir).
 */
import { chromium } from "playwright";
import {
  SHOTS,
  createRoomViaStore,
  dismissSpotlight,
  isEnabled,
  newRuContext,
  openMenu,
  safeClick,
  sleep,
  trackPage,
  waitPhase,
  warmupServer,
  waitUntil,
} from "./qa-lib.mjs";

const problems = [];
const warnings = [];
const START_TS = Date.now();
const rel = () => `${Math.round((Date.now() - START_TS) / 1000)}с`;
const ok = (msg) => console.log(`OK: [${rel()}] ${msg}`);
const warn = (msg) => {
  console.log(`WARN: [${rel()}] ${msg}`);
  warnings.push(msg);
};
const fail = (msg) => {
  console.log(`FAIL: [${rel()}] ${msg}`);
  problems.push(msg);
};

/** Полный сетевой срез вкладки: дедлайны, ходящий, фаза, настройки. */
function netFull(page) {
  return page.evaluate(() => {
    const s = globalThis.__evoStore?.getState?.();
    const net = s?.net;
    if (!net) return null;
    return {
      code: net.code,
      seat: net.seat,
      hostSeat: net.hostSeat,
      status: net.status,
      settings: net.settings ?? {},
      turnDeadlineAt: net.turnDeadlineAt,
      botStepAt: net.botStepAt ?? null,
      serverOffsetMs: net.serverOffsetMs,
      cur: s.state?.currentPlayerId ?? null,
      phase: s.state?.phase ?? null,
      year: s.state?.year ?? null,
      players: (s.state?.players ?? []).map((p) => ({ id: p.id, isAI: p.isAI })),
      error: net.error,
      errorCode: net.errorCode,
    };
  });
}

async function closeTable(page, label) {
  try {
    await page.evaluate(async () => {
      await globalThis.__evoStore?.getState?.().netCloseTable?.();
    });
    ok(`${label}: стол закрыт`);
  } catch {
    warn(`${label}: стол не закрыт (TTL подберёт)`);
  }
}

/** Ждёт ход человека (текущий игрок — не ИИ) и возвращает срез. */
async function waitMyTurn(page, timeout = 90_000) {
  const ready = await waitUntil(async () => {
    const n = await netFull(page);
    if (!n || n.phase === "gameOver") return false;
    if (n.cur === null || n.players.find((p) => p.id === n.cur)?.isAI) return false;
    return true;
  }, timeout, 500);
  if (!ready) throw new Error("ход человека не наступил");
  return netFull(page);
}

const browser = await chromium.launch();
// Прогрев: первый вызов каждого serverFn компилируется лениво и шлёт вкладкам
// full-reload — без прогрева кадры посреди сценария внезапно «сбрасываются».
await warmupServer(browser, {
  log: (m) => console.log(`[warmup] ${m}`),
});

async function guard(label, fn) {
  try {
    await fn();
  } catch (e) {
    fail(`${label}: ${String(e?.message ?? e).split("\n")[0]}`);
    if (process.env.EVO_QA_TRACE) {
      console.log(String(e?.stack ?? e).split("\n").slice(0, 6).join("\n"));
    }
  }
}

// ── a) 30 с: лобби → дедлайн → бейдж бота ───────────────────────────────────
{
  const ctx = await newRuContext(browser, {});
  const page = await ctx.newPage();
  const errors = trackPage(page, "a:30s");
  try {
    await guard("a: создать стол и поставить «30 с»", async () => {
      await openMenu(page);
      const created = await createRoomViaStore(page, {
        name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal",
      });
      if (!created.ok) throw new Error(`стол не создан: ${created.error}`);
      // Контроль в лобби: по умолчанию нажата «1 мин».
      const ready = await waitUntil(
        async () => (await page.locator('[data-timer-option="60000"][aria-pressed=true]').count()) === 1,
        20_000, 300,
      );
      if (!ready) throw new Error("контроль «Таймер хода» не показал умолчание «1 мин»");
      await page.locator('[data-timer-option="30000"]').click();
      const applied = await waitUntil(
        async () => (await page.locator('[data-timer-option="30000"][aria-pressed=true]').count()) === 1,
        10_000, 300,
      );
      if (!applied) throw new Error("«30 с» не применилось в лобби");
      // Значение держится на сервере (приходит кадром).
      const echoed = await waitUntil(async () => {
        const n = await netFull(page);
        return n?.settings?.turnTimerMs === 30_000;
      }, 10_000, 300);
      if (!echoed) throw new Error("сервер не вернул turnTimerMs=30000");
      await page.screenshot({ path: `${SHOTS}/01-lobby-timer-30s.png` });
      ok("a: «30 с» выставлено в лобби и держится на сервере (01-lobby-timer-30s.png)");
    });

    await guard("a: старт и дедлайн ≈30 с", async () => {
      await page.evaluate(async () => { await globalThis.__evoStore.getState().netStart(); });
      await waitPhase(page, ["development"], 60_000);
      await dismissSpotlight(page);
      const mine = await waitMyTurn(page);
      if (mine.settings.turnTimerMs !== 30_000) throw new Error(`в партии turnTimerMs=${mine.settings.turnTimerMs}`);
      // Дедлайн ставит первый advance после начала хода — ждём его появления.
      const armed = await waitUntil(async () => (await netFull(page))?.turnDeadlineAt !== null, 8_000, 300);
      if (!armed) throw new Error("дедлайна хода нет");
      const mine2 = await netFull(page);
      const left = mine2.turnDeadlineAt - (Date.now() + mine2.serverOffsetMs);
      if (left < 20_000 || left > 30_500) throw new Error(`дедлайн ≈${Math.round(left / 1000)} с, ждали 30 с`);
      // Свой бейдж на моём табло: как и раньше, тикает у активного места.
      const own = page.locator('[data-player-section="0"] [data-turn-timer][role="timer"]');
      if ((await own.count()) !== 1) throw new Error("свой таймер на табло не найден");
      const ownLabel = await own.getAttribute("aria-label");
      if (!/Ход завершится сам через/.test(ownLabel ?? "")) {
        throw new Error(`подпись своего таймера изменилась: ${ownLabel}`);
      }
      await page.screenshot({ path: `${SHOTS}/02-my-turn-30s.png` });
      // Крупный план своего именного ряда с тикающей монетой.
      await own.scrollIntoViewIfNeeded().catch(() => {});
      const ownBox = await own.boundingBox();
      if (ownBox) {
        await page.screenshot({
          path: `${SHOTS}/02b-my-nameplate-30s.png`,
          clip: { x: Math.max(0, ownBox.x - 240), y: Math.max(0, ownBox.y - 16), width: 460, height: 52 },
        });
      }
      ok(`a: дедлайн хода ≈${Math.round(left / 1000)} с, свой таймер прежний (02-my-turn-30s.png)`);
    });

    await guard("a: бейдж тикает на табло бота", async () => {
      // Завершаем своё развитие: ход переходит боту.
      await page.evaluate(() => {
        globalThis.__evoStore.getState().dispatch({ type: "devPass" });
      });
      const botReady = await waitUntil(async () => {
        const n = await netFull(page);
        if (!n) return false;
        if (n.cur !== 1 || n.phase === "gameOver") return false;
        if (!n.players.find((p) => p.id === 1)?.isAI) return false;
        return Boolean(n.botStepAt);
      }, 30_000, 300);
      if (!botReady) throw new Error("ход бота не наступил или botStepAt пуст");
      const botFrame = await netFull(page);
      if (!botFrame.botStepAt) throw new Error("net.botStepAt пуст в ход бота");
      const badge = page.locator('[data-player-section="1"] [data-turn-timer][role="timer"]');
      const ticked = await waitUntil(async () => {
        const label = await badge.getAttribute("aria-label").catch(() => null);
        return typeof label === "string" && /следующий шаг через/.test(label);
      }, 15_000, 200);
      if (!ticked) throw new Error("бейдж бота не тикает (нет подписи «следующий шаг»)");
      const label = await badge.getAttribute("aria-label");
      // Крупный план именного ряда бота с бейджем — сразу, пока бот ходит.
      const botBox = await badge.boundingBox().catch(() => null);
      if (botBox) {
        await page.screenshot({
          path: `${SHOTS}/03b-bot-nameplate-badge.png`,
          clip: { x: Math.max(0, botBox.x - 250), y: Math.max(0, botBox.y - 16), width: 470, height: 52 },
        });
      }
      const t1 = await badge.textContent();
      // За несколько тактов число отсчёта меняется (шаги бота ≈1-2 с).
      let t2 = t1;
      for (let i = 0; i < 12; i++) {
        await sleep(350);
        t2 = await badge.textContent();
        if (t2 !== t1) break;
      }
      if (!(await badge.isVisible())) throw new Error("бейдж бота не виден");
      await page.screenshot({ path: `${SHOTS}/03-bot-turn-badge.png` });
      ok(`a: бейдж бота тикает («${label}», ${t1}→${t2}) (03-bot-turn-badge.png)`);
    });
  } finally {
    await closeTable(page, "a");
    if (errors.length) warn(`a: ошибки страницы: ${errors.slice(0, 3).join(" | ")}`);
    await ctx.close();
  }
}

// ── b) «Выкл»: ход висит без принудительного конца ──────────────────────────
{
  const ctx = await newRuContext(browser, {});
  const page = await ctx.newPage();
  const errors = trackPage(page, "b:off");
  try {
    await guard("b: «Выкл» в лобби", async () => {
      await openMenu(page);
      const created = await createRoomViaStore(page, {
        name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal",
      });
      if (!created.ok) throw new Error(`стол не создан: ${created.error}`);
      await waitUntil(
        async () => (await page.locator('[data-timer-option="60000"][aria-pressed=true]').count()) === 1,
        20_000, 300,
      );
      await page.locator('[data-timer-option="0"]').click();
      const applied = await waitUntil(async () => {
        const n = await netFull(page);
        return (await page.locator('[data-timer-option="0"][aria-pressed=true]').count()) === 1 &&
          n?.settings?.turnTimerMs === 0;
      }, 10_000, 300);
      if (!applied) throw new Error("«Выкл» не применилось/не держится на сервере");
      await page.screenshot({ path: `${SHOTS}/04-lobby-timer-off.png` });
      ok("b: «Выкл» держится на сервере (04-lobby-timer-off.png)");
    });

    await guard("b: 92 с без дедлайна и без принудительного конца", async () => {
      await page.evaluate(async () => { await globalThis.__evoStore.getState().netStart(); });
      await waitPhase(page, ["development"], 60_000);
      const start = await waitMyTurn(page);
      if (start.turnDeadlineAt !== null) throw new Error("с «Выкл» дедлайн не null");
      const startedAt = Date.now();
      const startedYear = start.year;
      const startedPhase = start.phase;
      while (Date.now() - startedAt < 92_000) {
        await sleep(4_000);
        const n = await netFull(page);
        if (!n) throw new Error("кадр пропал");
        if (n.turnDeadlineAt !== null) throw new Error(`дедлайн появился (${n.turnDeadlineAt})`);
        if (n.cur !== start.seat || n.year !== startedYear || n.phase !== startedPhase) {
          throw new Error(`ход ушёл сам: cur=${n.cur} year=${n.year} phase=${n.phase}`);
        }
      }
      ok("b: 92 с хода без дедлайна и без авто-конца");
    });

    await guard("b: игрок завершает ход сам", async () => {
      // Действие доступно: «Закончить развитие» активна.
      const btn = page.getByRole("button", { name: "Закончить развитие", exact: true }).first();
      if (!(await isEnabled(btn))) throw new Error("«Закончить развитие» недоступна — ход застрял");
      await safeClick(btn, 5000);
      const moved = await waitUntil(async () => {
        const n = await netFull(page);
        return n && n.cur !== 0 ? n : null;
      }, 20_000, 300);
      if (!moved) throw new Error("после ручного завершения ход не ушёл");
      ok("b: ручное завершение работает, ход ушёл боту");
    });
  } finally {
    await closeTable(page, "b");
    if (errors.length) warn(`b: ошибки страницы: ${errors.slice(0, 3).join(" | ")}`);
    await ctx.close();
  }
}

// ── c) старый стол без настройки: умолчание 1 мин ───────────────────────────
{
  const ctx = await newRuContext(browser, {});
  const page = await ctx.newPage();
  const errors = trackPage(page, "c:old");
  try {
    await guard("c: стол без ключа настройки ведёт себя как «1 мин»", async () => {
      await openMenu(page);
      const created = await createRoomViaStore(page, {
        name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal",
      });
      if (!created.ok) throw new Error(`стол не создан: ${created.error}`);
      // Лобби показывает умолчание, настройка на сервере не записана.
      const shown = await waitUntil(
        async () => (await page.locator('[data-timer-option="60000"][aria-pressed=true]').count()) === 1,
        20_000, 300,
      );
      if (!shown) throw new Error("лобби не показывает умолчание «1 мин»");
      const n0 = await netFull(page);
      if (n0.settings.turnTimerMs !== undefined) {
        throw new Error(`у старого стола записан turnTimerMs=${n0.settings.turnTimerMs}`);
      }
      await page.evaluate(async () => { await globalThis.__evoStore.getState().netStart(); });
      await waitPhase(page, ["development"], 60_000);
      await waitMyTurn(page);
      // Дедлайн ставит первый advance после начала хода — ждём его появления.
      const armed = await waitUntil(async () => (await netFull(page))?.turnDeadlineAt !== null, 8_000, 300);
      if (!armed) throw new Error("дедлайна нет");
      const mine2 = await netFull(page);
      const left = mine2.turnDeadlineAt - (Date.now() + mine2.serverOffsetMs);
      if (left < 46_000 || left > 60_500) throw new Error(`дедлайн ≈${Math.round(left / 1000)} с, ждали 60 с`);
      ok(`c: старый стол — дедлайн ≈${Math.round(left / 1000)} с (legacy 1 мин)`);
    });
  } finally {
    await closeTable(page, "c");
    if (errors.length) warn(`c: ошибки страницы: ${errors.slice(0, 3).join(" | ")}`);
    await ctx.close();
  }
}

// ── d) гость видит значение, менять не может ────────────────────────────────
{
  const ctxHost = await newRuContext(browser, {});
  const host = await ctxHost.newPage();
  const ctxGuest = await newRuContext(browser, {});
  const guest = await ctxGuest.newPage();
  try {
    await guard("d: у гостя контроль заперт, значение видно", async () => {
      await openMenu(host);
      const created = await createRoomViaStore(host, {
        name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal",
      });
      if (!created.ok) throw new Error(`стол не создан: ${created.error}`);
      await waitUntil(
        async () => (await host.locator('[data-timer-option="60000"][aria-pressed=true]').count()) === 1,
        20_000, 300,
      );
      await host.locator('[data-timer-option="120000"]').click();
      await waitUntil(
        async () => (await host.locator('[data-timer-option="120000"][aria-pressed=true]').count()) === 1,
        10_000, 300,
      );
      // Гость входит по коду.
      await openMenu(guest);
      await guest.evaluate(async (c) => {
        await globalThis.__evoStore.getState().startNetJoin(c, "Боря");
      }, created.code);
      const guestReady = await waitUntil(
        async () =>
          (await guest.locator('[data-timer-option="120000"][aria-pressed=true]').count()) === 1,
        20_000, 400,
      );
      if (!guestReady) throw new Error("гость не видит значение «2 мин»");
      const disabled = await guest.locator('[data-timer-option="120000"]').isDisabled();
      if (!disabled) throw new Error("у гостя кнопка таймера активна");
      ok("d: гость видит «2 мин» нажатой, кнопки заперты");
    });
  } finally {
    await guest.evaluate(async () => { await globalThis.__evoStore?.getState?.().leaveNet?.(); }).catch(() => {});
    await ctxGuest.close().catch(() => {});
    await closeTable(host, "d");
    await ctxHost.close();
  }
}

await browser.close();
console.log(`\nИТОГ: проблем ${problems.length}, предупреждений ${warnings.length} (${rel()})`);
for (const p of problems) console.log(`  FAIL: ${p}`);
for (const w of warnings) console.log(`  WARN: ${w}`);
process.exitCode = problems.length ? 1 : 0;
