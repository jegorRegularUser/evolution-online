import { it, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { setImmediate } from "node:timers/promises";
import ts from "typescript";
import type { NetHooks, NetSession } from "./session.ts";

// Компилируем настоящий драйвер (как session-chat-cursor.test.ts): strip-only
// не поддерживает parameter properties. Транспорт подменяется целиком,
// таймеры — ручные, чтобы темп проверять без реального ожидания.
const source = ts.transpileModule(
  readFileSync(new URL("./session.ts", import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
).outputText;

function makeSession(hooks: Partial<NetHooks>): {
  session: NetSession;
  pollBodies: Array<Record<string, unknown>>;
  setNextPoll: (r: unknown) => void;
  lastDelay: () => number | undefined;
  pollOnce: () => Promise<void>;
} {
  const pollBodies: Array<Record<string, unknown>> = [];
  let nextPoll: unknown = { ok: true, unchanged: true, seats: [], hostSeat: 0, capacity: 2, waiters: [], spectators: [], chat: [], reactions: [] };
  const api = {
    netJoinRoom: async () => ({ ok: true, token: "token", waiting: false }),
    netPoll: async ({ data }: { data: Record<string, unknown> }) => {
      pollBodies.push(data);
      return nextPoll;
    },
  };
  // Таймеры — ручные (как в session-chat-cursor.test.ts): дёргаем их сами
  // и заодно читаем вычисленную задержку — она и есть предмет теста.
  const timers = new Map<number, { callback: () => void; delay: number }>();
  let timerId = 0;
  const exports_ = {} as { NetSession: typeof NetSession };
  runInNewContext(source, {
    exports: exports_,
    require: (name: string) => {
      if (name === "./api") return api;
      if (name === "@/lib/cosmetics") return { cosmeticsPatchNeedsOwnership: () => false };
      return assert.fail(`неожиданный импорт: ${name}`);
    },
    setTimeout: (callback: () => void, delay: number) => {
      timers.set(++timerId, { callback, delay });
      return timerId;
    },
    clearTimeout: (id: number) => timers.delete(id),
  });
  const noop = () => {};
  const session = new exports_.NetSession({
    onSnapshot: noop, onSeats: noop, onStatus: noop, onEvents: noop,
    onChat: noop, onReactions: noop, onSpectatorSnapshot: noop,
    onSpectators: noop, onWaiting: noop, onFatal: noop,
    ...hooks,
  });
  return {
    session,
    pollBodies,
    setNextPoll: (r: unknown) => { nextPoll = r; },
    lastDelay: () => [...timers.values()].at(-1)?.delay,
    async pollOnce() {
      assert.equal(timers.size, 1, "у сессии ровно один запланированный poll");
      const [id, timer] = timers.entries().next().value!;
      timers.delete(id);
      timer.callback();
      await setImmediate();
    },
  };
}

/** Полный кадр с состоянием и журналом заданного logSeq. */
function frame(logSeq: number, logEntries: number) {
  return {
    ok: true,
    version: 100 + logSeq,
    room: { code: "TEST", status: "playing", capacity: 2, hostSeat: 0, settings: {}, isPrivate: false, password: null },
    seats: [{ seat: 0, name: "Игрок", isAI: false, online: true, disconnected: false, resigned: false, color: "#e27641", avatar: "sci.a", cardback: "cardback.classic", typing: false }],
    seat: 0,
    logSeq,
    state: {
      phase: "development",
      pendingAttack: null,
      currentPlayerId: 0,
      players: [
        { id: 0, name: "Игрок", isAI: false, resigned: false, animals: [] },
        { id: 1, name: "Соперник", isAI: false, resigned: false, animals: [] },
      ],
      log: Array.from({ length: logEntries }, (_, i) => ({ id: logSeq - logEntries + 1 + i, text: String(i), tone: "neutral" })),
      logSeq,
    },
    events: [],
    chat: [],
    waiters: [],
    spectators: [],
    reactions: [],
    turnDeadlineAt: null as number | null,
    botStepAt: null as number | null,
    serverNow: 1_000_000,
  };
}

// ── nextDelayMs: чистая функция темпа ────────────────────────────────────────

const exports_ = {} as { nextDelayMs: (input: unknown) => number };
runInNewContext(source, {
  exports: exports_,
  require: (name: string) => {
    if (name === "./api") {
      return new Proxy({}, {
        get: (_t, prop) => async () => assert.fail(`транспорт не нужен тесту темпа: ${String(prop)}`),
      });
    }
    if (name === "@/lib/cosmetics") return { cosmeticsPatchNeedsOwnership: () => false };
    return assert.fail(`неожиданный импорт: ${name}`);
  },
  setTimeout: () => 0,
  clearTimeout: () => {},
});
const nextDelayMs = exports_.nextDelayMs;

/** Нейтральный вход: вкладка видима, давно не ходили, ничей ход не pending. */
const base = {
  failCount: 0,
  hiddenTab: false,
  msSinceOwnMove: 60_000,
  nowMs: 1_000_000,
  botStepAt: null,
  turnDeadlineAt: null,
  otherHumanTurn: false,
};

describe("nextDelayMs: адаптивный темп опроса", () => {
  it("шаг бота впереди — быстрый темп: наш poll двигает ленивый сервер", () => {
    // Бот pending даже при «думающем» человеке с дедлайном вдалеке: правило
    // бота приоритетнее, иначе партия стояла бы у всех.
    assert.equal(
      nextDelayMs({ ...base, botStepAt: 1_100_000, otherHumanTurn: true, turnDeadlineAt: 5_000_000 }),
      700,
    );
    // Просроченный шаг (poll уже запоздал) — тоже быстрый темп.
    assert.equal(nextDelayMs({ ...base, botStepAt: 900_000 }), 700);
  });

  it("чужой ход человека с дедлайном вдалеке — замедленный темп", () => {
    // 100 с до дедлайна: игрок думает, дёргать сервер каждые 700 мс незачем.
    assert.equal(
      nextDelayMs({ ...base, otherHumanTurn: true, turnDeadlineAt: 1_100_000 }),
      2500,
    );
  });

  it("дедлайн близко (<15 с) — быстрый темп, авто-конец хода показать сразу", () => {
    // 14 с — уже внутри порога; ровно 15 с — тоже быстрый темп.
    assert.equal(
      nextDelayMs({ ...base, otherHumanTurn: true, turnDeadlineAt: 1_014_000 }),
      700,
    );
    assert.equal(
      nextDelayMs({ ...base, otherHumanTurn: true, turnDeadlineAt: 1_015_000 }),
      700,
    );
    assert.equal(
      nextDelayMs({ ...base, otherHumanTurn: true, turnDeadlineAt: 1_015_001 }),
      2500,
    );
    // Дедлайн без чужого человеческого хода (свой ход, бот) — не замедляет.
    assert.equal(nextDelayMs({ ...base, turnDeadlineAt: 5_000_000 }), 700);
  });

  it("свой ход и метки без актора — быстрый темп", () => {
    // otherHumanTurn ставится только на чужой ход человека (см. otherHumanTurnOf):
    // свой ход и автофазы опрашиваются быстро.
    assert.equal(nextDelayMs(base), 700);
  });

  it("прежние правила сохранены: бэкофф, скрытая вкладка, окно после хода", () => {
    assert.equal(nextDelayMs({ ...base, failCount: 1 }), 800, "400 * 2^1");
    assert.equal(nextDelayMs({ ...base, failCount: 5 }), 5000, "потолок бэкоффа");
    assert.equal(nextDelayMs({ ...base, hiddenTab: true }), 3000);
    assert.equal(nextDelayMs({ ...base, msSinceOwnMove: 1000 }), 350, "окно после своего хода");
    assert.equal(nextDelayMs({ ...base, msSinceOwnMove: 2999 }), 350);
    assert.equal(nextDelayMs({ ...base, msSinceOwnMove: 3000 }), 700, "окно кончилось");
    // Приоритеты: бэкофф ошибок старше всего — связь сломана, темп партии
    // не важен, пока она не вернётся.
    assert.equal(
      nextDelayMs({ ...base, failCount: 2, msSinceOwnMove: 1000, botStepAt: 1_100_000 }),
      1600,
      "бэкофф старше всех",
    );
  });
});

// ── дельта журнала на клиенте ────────────────────────────────────────────────

describe("session: курсор журнала (logSeq в теле poll)", () => {
  it("кадр запоминает logSeq, poll его отправляет, лобби сбрасывает", async () => {
    const h = makeSession({});
    await h.session.join("TEST", "Игрок");
    // Первый poll без курсора: журнал ещё не видели.
    h.setNextPoll(frame(3, 3));
    await h.pollOnce();
    assert.equal(h.pollBodies[0]!.logSeq, undefined, "первый кадр — полный журнал");
    // Второй poll несёт logSeq применённого кадра.
    h.setNextPoll(frame(3, 3));
    await h.pollOnce();
    assert.equal(h.pollBodies[1]!.logSeq, 3, "после кадра шлём его logSeq");
    // Дельта-кадр (журнала нет, счётчик тот же) курсор не двигает.
    h.setNextPoll(frame(3, 0));
    await h.pollOnce();
    assert.equal(h.pollBodies[2]!.logSeq, 3, "дельта хранит тот же курсор");
    // Новый logSeq от сервера перезаписывает курсор. Запрос №4 уезжает ещё
    // со старым курсором (кадр №4 применится в его ответе), поэтому «5»
    // проверяем в следующем теле.
    h.setNextPoll(frame(5, 5));
    await h.pollOnce();
    assert.equal(h.pollBodies[3]!.logSeq, 3);
    await h.pollOnce();
    assert.equal(h.pollBodies[4]!.logSeq, 5, "кадр с новым журналом перезаписал курсор");
    // Лобби (state === null) сбрасывает: новая партия начинает счёт заново.
    const lobby = { ...frame(5, 0), state: null, room: { ...frame(5, 0).room, status: "lobby" } };
    h.setNextPoll(lobby);
    await h.pollOnce();
    assert.equal(h.pollBodies[5]!.logSeq, 5, "лобби применится в ответе запроса №6");
    await h.pollOnce();
    assert.equal(h.pollBodies[6]!.logSeq, undefined, "после лобби курсор сброшен");
    h.session.stop();
  });

  it("адаптивный темп доезжает до таймера: чужой дальний ход — 2500, бот и свой ход — 700", async () => {
    const h = makeSession({});
    await h.session.join("TEST", "Игрок");
    // Свой ход (актор — место 0): обычный быстрый темп.
    h.setNextPoll(frame(3, 3));
    await h.pollOnce();
    assert.equal(h.lastDelay(), 700, "свой ход — 700");
    // Чужой ход человека (актор — место 1) с дедлайном вдалеке — замедлились.
    const other = frame(3, 3);
    other.state.currentPlayerId = 1;
    other.turnDeadlineAt = 1_100_000; // serverNow = 1_000_000 → остаток ~100 с
    h.setNextPoll(other);
    await h.pollOnce();
    assert.equal(h.lastDelay(), 2500, "чужой дальний ход — 2500");
    // Дедлайн почти истёк — снова быстрый темп.
    const close = frame(3, 3);
    close.state.currentPlayerId = 1;
    close.turnDeadlineAt = 1_010_000; // остаток ~10 с
    h.setNextPoll(close);
    await h.pollOnce();
    assert.equal(h.lastDelay(), 700, "дедлайн близко — 700");
    // Pending шаг бота — быстрый темп (наш poll его двигает), даже при чужом ходе.
    const bot = frame(3, 3);
    bot.state.currentPlayerId = 1;
    bot.botStepAt = 1_050_000;
    bot.turnDeadlineAt = 1_100_000;
    h.setNextPoll(bot);
    await h.pollOnce();
    assert.equal(h.lastDelay(), 700, "бот pending — 700");
    h.session.stop();
  });
});
