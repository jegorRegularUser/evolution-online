import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { _internals, createRoomService, NET_TABLES_DDL, splitStatements } from "./server.ts";
import type { PollResult, SqlLike } from "./shared.ts";

let sql: SqlLike;
let fixedNow = Date.now();

before(async () => {
  const pg = new PGlite();
  await pg.waitReady;
  for (const file of [
    "0002_net_rooms.sql",
    "0003_room_modules.sql",
    "0004_room_host.sql",
    "0005_spectators.sql",
    "0006_resign.sql",
    "0007_room_privacy_color.sql",
    "0008_chat_reactions_typing.sql",
  ]) {
    const ddl = readFileSync(
      fileURLToPath(new URL(`../../../migrations/${file}`, import.meta.url)),
      "utf8",
    );
    await pg.exec(ddl);
  }
  for (const statement of splitStatements(NET_TABLES_DDL)) await pg.exec(statement);
  const query = async <T>(text: string, params: unknown[] = []): Promise<T[]> =>
    (await pg.query<T>(text, params)).rows as T[];
  sql = { query } as SqlLike;
});

function service() {
  return createRoomService(sql, { now: () => fixedNow });
}

function full(result: PollResult | { unchanged: true }): PollResult {
  if ("unchanged" in result) throw new Error("ожидался полный кадр");
  return result;
}

async function startedPlayingTable() {
  const s = service();
  const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
  const guest = await s.join({ code: host.code, name: "Боря" });
  await s.start(host.code, host.token);
  return { s, host, guest };
}

describe("Правила владельца: сетевой вид не раскрывает случайность", () => {
  it("не отправляет rngSeed или rngState игроку и зрителю", async () => {
    // A16, F-16-1: скрытый сид и состояние ГПСЧ позволяют реконструировать
    // колоду и будущие броски, поэтому их не должно быть в сетевом кадре.
    const { s, host } = await startedPlayingTable();
    const playerView = full(await s.poll(host.code, host.token));
    const spectator = await s.spectate(host.code, "Зритель");
    const spectatorView = await s.spectatorPoll(host.code, spectator.token);

    assert.ok(playerView.state, "в партии должен быть player-view");
    assert.ok(spectatorView.state, "в партии должен быть spectator-view");
    assert.equal("rngSeed" in playerView.state, false, "player-view не содержит rngSeed");
    assert.equal("rngState" in playerView.state, false, "player-view не содержит rngState");
    assert.equal("rngSeed" in spectatorView.state, false, "spectator-view не содержит rngSeed");
    assert.equal("rngState" in spectatorView.state, false, "spectator-view не содержит rngState");
  });
});

describe("Правила владельца: идемпотентность сетевого действия", () => {
  it("применяет повтор действия с тем же actionId только один раз", async () => {
    // C09, F-C09-4: повтор доставки одного UUID не должен снова менять
    // состояние, версию комнаты или журнал событий.
    const { s, host } = await startedPlayingTable();
    const room = await _internals.readRoom(sql, host.code);
    assert.ok(room?.state);
    const state = structuredClone(room.state);
    state.currentPlayerId = 0;
    state.phase = "development";
    assert.equal(
      await _internals.casUpdate(sql, host.code, room.version, { state }),
      true,
    );

    const actionId = "00000000-0000-4000-8000-000000000001";
    const first = full(await s.action(host.code, host.token, { type: "devPass" }, actionId));
    const afterFirst = await _internals.readRoom(sql, host.code);
    assert.ok(afterFirst);
    const second = full(await s.action(host.code, host.token, { type: "devPass" }, actionId));
    const afterSecond = await _internals.readRoom(sql, host.code);
    assert.ok(afterSecond);

    assert.equal(first.version, afterFirst.version);
    assert.equal(second.version, afterSecond.version, "повтор не увеличивает версию");
    assert.equal(afterSecond.events.length, afterFirst.events.length, "повтор не добавляет событие");
    assert.deepEqual(afterSecond.state?.currentPlayerId, afterFirst.state?.currentPlayerId);
  });
});

describe("Правила владельца: CAS-гонка не теряет состояние", () => {
  it("сохраняет сдачу игрока при конкурентном автошаге", async () => {
    // C09, F-C09-1: сдача и автошаг конкурируют за одну версию комнаты;
    // state и evo_seats обязаны остаться согласованными после обеих записей.
    const { s, host, guest } = await startedPlayingTable();
    const room = await _internals.readRoom(sql, host.code);
    assert.ok(room?.state);
    const state = structuredClone(room.state);
    state.phase = "development";
    state.currentPlayerId = 0;
    state.players[0]!.hand = [];
    state.players[0]!.isAI = true;
    state.players[0]!.passedDev = false;
    state.players[1]!.passedDev = false;
    assert.equal(
      await _internals.casUpdate(sql, host.code, room.version, {
        state,
        autoStepAt: fixedNow,
      }),
      true,
    );

    let releaseAutoWrite!: () => void;
    const autoMayWrite = new Promise<void>((resolve) => {
      releaseAutoWrite = resolve;
    });
    let autoWriteReached!: () => void;
    const autoWriteBlocked = new Promise<void>((resolve) => {
      autoWriteReached = resolve;
    });
    let injected = false;
    const delayedAutoSql: SqlLike = {
      query: async <T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> => {
        if (
          !injected &&
          text.includes("update evo_rooms set") &&
          text.includes("state =") &&
          text.includes("version =")
        ) {
          injected = true;
          autoWriteReached();
          await autoMayWrite;
        }
        return sql.query<T>(text, params);
      },
    } as SqlLike;
    const autoService = createRoomService(delayedAutoSql, { now: () => fixedNow });

    const pollPromise = autoService.poll(host.code, host.token);
    await autoWriteBlocked;
    await s.resign(host.code, guest.token);
    releaseAutoWrite();
    await pollPromise;

    const final = full(await s.rejoin(host.code, host.token));
    assert.ok(final.state);
    assert.equal(final.state.players[guest.seat]!.resigned, true, "сдача есть в state");
    assert.equal(final.seats.find((seat) => seat.seat === guest.seat)?.resigned, true, "сдача есть в evo_seats");
  });
});
