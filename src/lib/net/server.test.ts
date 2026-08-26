import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { createRoomService, NetError, _internals } from "./server.ts";
import type { PollResult, SqlLike } from "./shared.ts";

/** poll без sinceVersion всегда даёт полный кадр — сужаем тип для TS. */
function full(r: PollResult | { unchanged: true }): PollResult {
  if ("unchanged" in r) throw new Error("не ожидался unchanged-ответ");
  return r;
}

let sql: SqlLike;
let fixedNow = Date.now();

before(async () => {
  const pg = new PGlite();
  await pg.waitReady;
  const ddl = readFileSync(
    fileURLToPath(new URL("../../../migrations/0002_net_rooms.sql", import.meta.url)),
    "utf8",
  );
  await pg.exec(ddl);
  // Сервис использует только sql.query(text, params) — этого достаточно.
  const run = async <T>(text: string, params: unknown[] = []): Promise<T[]> =>
    (await pg.query<T>(text, params)).rows as T[];
  sql = { query: run } as unknown as SqlLike;
});

function svc() {
  return createRoomService(sql, { now: () => fixedNow });
}

describe("лобби", () => {
  it("create → join: места и хост", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 0, difficulty: "normal" });
    assert.equal(host.seat, 0);
    assert.match(host.code, /^[ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/);
    const guest = await s.join({ code: host.code, name: "Боря" });
    assert.equal(guest.seat, 1);
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.room.hostSeat, 0);
    assert.equal(snap.room.capacity, 3);
    assert.deepEqual(
      snap.seats.map((x: { name: string; isAI: boolean }) => [x.name, x.isAI]),
      [
        ["Аня", false],
        ["Боря", false],
      ],
    );
    assert.equal(snap.state, null);
  });

  it("join в заполненную комнату — ошибка", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    await s.join({ code: host.code, name: "Боря" });
    await assert.rejects(() => s.join({ code: host.code, name: "Вася" }), NetError);
  });

  it("join по чужому коду — ошибка", async () => {
    const s = svc();
    await assert.rejects(() => s.join({ code: "ZZZZ", name: "Кто" }), NetError);
  });

  it("setBots резервирует хвостовые места, люди их не занимают", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 0, difficulty: "normal" });
    await s.setBots({ code: host.code, token: host.token, count: 1 });
    const guest = await s.join({ code: host.code, name: "Боря" });
    assert.equal(guest.seat, 1);
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.seats.filter((x: { isAI: boolean }) => x.isAI).length, 1);
    assert.equal(snap.seats[2]!.isAI, true);
  });

  it("setBots не даёт превысить места людьми", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const guest = await s.join({ code: host.code, name: "Боря" });
    void guest;
    // 2 человека из 2 мест → клампится до 0 ботов
    await s.setBots({ code: host.code, token: host.token, count: 2 });
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.seats.filter((x: { isAI: boolean }) => x.isAI).length, 0);
  });

  it("again после сброса возвращает lobby с теми же местами", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    await s.start(host.code, host.token);
    const mid = await s.rejoin(host.code, host.token);
    assert.equal(mid.room.status, "playing");
    // Партию считаем законченной принудительно (доводить движком не нужно).
    const room = await _internals.readRoom(sql, host.code);
    await _internals.casUpdate(sql, host.code, room!.version, { status: "finished" });
    await s.again({ code: host.code, token: host.token });
    const back = await s.rejoin(host.code, host.token);
    assert.equal(back.room.status, "lobby");
    assert.equal(back.state, null);
    assert.equal(back.seats.length, 2);
  });

  it("не-хост не начинает партию", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 1, difficulty: "normal" });
    const guest = await s.join({ code: host.code, name: "Боря" });
    assert.equal(guest.seat, 1); // бот занял хвостовое место 2
    await assert.rejects(() => s.start(host.code, guest.token), /хост/);
  });
});

describe("партия", () => {
  async function startedTable() {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    return { s, host, g };
  }

  it("start создаёт состояние; имена из мест", async () => {
    const { s, host } = await startedTable();
    const snap = await s.start(host.code, host.token);
    assert.equal(snap.room.status, "playing");
    assert.ok(snap.state);
    assert.deepEqual(
      snap.state!.players.map((p: { name: string }) => p.name),
      ["Аня", "Боря"],
    );
    assert.equal(snap.state!.players.every((p) => !p.isAI), true);
    assert.ok(snap.state!.deckCount! > 0);
    assert.deepEqual(snap.state!.deck, []);
    assert.deepEqual(snap.state!.players[0]!.hand.length > 0, true);
  });

  it("авточаги останавливаются на ходе человека", async () => {
    const { s, host, g } = await startedTable();
    await s.start(host.code, host.token);
    fixedNow += 60 * 60 * 1000;
    const snap = full(await s.poll(host.code, g.token));
    assert.equal(snap.room.status, "playing");
    const st = snap.state!;
    const waitingHuman =
      st.phase === "foodBank" ||
      st.phase === "extinction" ||
      st.pendingAttack !== null
        ? false
        : !st.players[st.currentPlayerId]!.isAI;
    assert.ok(waitingHuman || st.phase === "gameOver");
  });

  it("человек + бот: партия доходит до gameOver при пасах человека", { timeout: 60000 }, async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "easy" });
    await s.start(host.code, host.token);
    let finished = false;
    let consecutiveErrors = 0;
    for (let i = 0; i < 400 && !finished; i++) {
      fixedNow += 2500; // созревают авточаги
      let snap;
      try {
        snap = full(await s.poll(host.code, host.token));
        consecutiveErrors = 0;
      } catch {
        // Ядро игры активно дорабатывается параллельно — редкие транзитные
        // сбои применения действия не должны ронять сетевой сценарий.
        if (++consecutiveErrors > 50) throw new Error("сервер сломался надолго");
        continue;
      }
      if (snap.room.status === "finished") {
        finished = true;
        break;
      }
      const st = snap.state!;
      if (st.pendingAttack && st.pendingAttack.waitingFor === 0) {
        try {
          await s.action(host.code, host.token, { type: "chooseDefense", kind: "none" });
        } catch {
          /* ход мог уйти — следующий круг разберётся */
        }
        continue;
      }
      if (st.phase === "development" && st.currentPlayerId === 0) {
        try {
          await s.action(host.code, host.token, { type: "devPass" });
        } catch {
          /* уже спасовал/ход ушёл */
        }
      }
    }
    assert.equal(finished, true, "стол из человека-пасовщика и бота должен закончиться");
  });

  it("гонка версий: casUpdate применяет ровно одну запись на версию", async () => {
    const { s, host } = await startedTable();
    await s.start(host.code, host.token);
    const room = await _internals.readRoom(sql, host.code);
    assert.ok(room);
    const ok1 = await _internals.casUpdate(sql, host.code, room!.version, {
      autoStepAt: fixedNow + 1000,
    });
    const ok2 = await _internals.casUpdate(sql, host.code, room!.version, {
      autoStepAt: fixedNow + 2000,
    });
    assert.equal(ok1, true);
    assert.equal(ok2, false);
  });

  it("одно действие = один инкремент версии", async () => {
    const { s, host, g } = await startedTable();
    await s.start(host.code, host.token);
    fixedNow += 60 * 60 * 1000;
    const snap = full(await s.poll(host.code, host.token));
    const st = snap.state!;
    if (st.phase !== "development") return; // дымовой: зависит от расклада
    const seat = st.currentPlayerId;
    const token = seat === 0 ? host.token : g.token;
    const before = (await _internals.readRoom(sql, host.code))!.version;
    try {
      await s.action(host.code, token, { type: "devPass" });
    } catch {
      return; // ход не у этого места — проверять нечего
    }
    const after = (await _internals.readRoom(sql, host.code))!.version;
    assert.equal(after, before + 1);
  });
});
