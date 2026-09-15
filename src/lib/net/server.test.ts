import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import {
  createRoomService,
  endTurnStepFor,
  NetError,
  NET_TABLES_DDL,
  nextAutoStep,
  noChoicesLeft,
  splitStatements,
  _internals,
} from "./server.ts";
import { PACE, PLAYER_COLORS, joinRoomInput, setPasswordInput } from "./shared.ts";
import type { PollResult, SqlLike } from "./shared.ts";
import type { Animal, GameState } from "../../game/types.ts";

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
  for (const f of [
    "0002_net_rooms.sql",
    "0003_room_modules.sql",
    "0004_room_host.sql",
    "0005_spectators.sql",
    "0006_resign.sql",
    "0007_room_privacy_color.sql",
    "0008_chat_reactions_typing.sql",
  ]) {
    const ddl = readFileSync(
      fileURLToPath(new URL(`../../../migrations/${f}`, import.meta.url)),
      "utf8",
    );
    await pg.exec(ddl);
  }
  // Рантайм-схема добирает то, чего нет в отыгранных миграциях (M10:
  // turn_deadline_at добавляется идемпотентным alter из NET_TABLES_DDL).
  for (const statement of splitStatements(NET_TABLES_DDL)) await pg.exec(statement);
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

  it("join в заполненную комнату ставит в очередь, а не падает", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    await s.join({ code: host.code, name: "Боря" });
    const waiter = await s.join({ code: host.code, name: "Вася" });
    assert.equal(waiter.waiting, true);
    assert.equal(waiter.seat, -1);
    // Ожидающий не занимает место и видит себя в очереди.
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.seats.length, 2);
    const info = await s.waiterInfo(host.code, waiter.token);
    assert.equal(info.queued, true);
    assert.equal(info.position, 1);
    assert.equal(info.freeSeat, null);
    assert.equal(info.freeSeats, 0);
    assert.deepEqual(
      snap.waiters.map((w) => w.name),
      ["Вася"],
    );
  });

  it("join по чужому коду — ошибка", async () => {
    const s = svc();
    await assert.rejects(() => s.join({ code: "ZZZZ", name: "Кто" }), NetError);
  });

  it("create с ботами на все места — ошибка, комната не создаётся", async () => {
    const s = svc();
    const countRooms = async (): Promise<number> => {
      const rows = await sql.query<{ n: number }>(`select count(*)::int as n from evo_rooms`);
      return rows[0]!.n;
    };
    const before = await countRooms();
    await assert.rejects(
      () => s.create({ name: "Аня", capacity: 2, botSeats: 2, difficulty: "normal" }),
      /Ботов/,
    );
    // Комната не должна оставаться «осиротевшей» без места хоста.
    assert.equal(await countRooms(), before, "недостроенная комната не должна создаваться");
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

describe("хост-контроль", () => {
  it("кик: только хост, себя нельзя; кикнутый получает код kicked", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await assert.rejects(() => s.kick(host.code, g.token, 0), /хост/);
    await assert.rejects(() => s.kick(host.code, host.token, host.seat), /Себя/);
    await s.kick(host.code, host.token, g.seat);
    const snap = await s.rejoin(host.code, host.token);
    assert.deepEqual(
      snap.seats.map((x) => x.seat),
      [0],
    );
    await assert.rejects(
      () => s.rejoin(host.code, g.token),
      (e: unknown) => e instanceof NetError && e.code === "kicked",
    );
    // Освободившееся место занимает новый игрок.
    const g2 = await s.join({ code: host.code, name: "Вася" });
    assert.equal(g2.seat, 1);
  });

  it("кик в идущей партии: место становится ботом, кикнутый получает kicked", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await s.start(host.code, host.token);
    await s.kick(host.code, host.token, g.seat);
    const snap = full(await s.poll(host.code, host.token));
    // Партия не прервалась: место продолжает играть под управлением ИИ.
    assert.equal(snap.room.status, "playing");
    assert.equal(snap.seats.find((x) => x.seat === g.seat)!.isAI, true);
    assert.equal(snap.state!.players[g.seat]!.isAI, true);
    await assert.rejects(
      () => s.poll(host.code, g.token),
      (e: unknown) => e instanceof NetError && e.code === "kicked",
    );
    await assert.rejects(
      () => s.action(host.code, g.token, { type: "devPass" }),
      (e: unknown) => e instanceof NetError && e.code === "kicked",
    );
  });

  it("уменьшение мест: сначала пустое место, состав сохраняется (сценарий M14)", async () => {
    const s = svc();
    // 8 мест, хост + 6 ботов: одно место свободно (боты садятся на хвост).
    const host = await s.create({ name: "Аня", capacity: 8, botSeats: 6, difficulty: "normal" });
    const before = await s.rejoin(host.code, host.token);
    assert.equal(before.seats.length, 7);
    const colors = new Map(before.seats.map((x) => [x.name, x.color]));
    // Снижаем до 7: уходить должно ПУСТОЕ место, а не бот.
    await s.setCapacity(host.code, host.token, 7);
    const after = await s.rejoin(host.code, host.token);
    assert.equal(after.room.capacity, 7);
    assert.equal(after.seats.length, 7, "все участники обязаны сохраниться");
    assert.equal(after.seats.filter((x) => x.isAI).length, 6, "ни один бот не удалён");
    assert.deepEqual(
      after.seats.map((x) => x.seat),
      [0, 1, 2, 3, 4, 5, 6],
      "занятые места уплотнены к низу",
    );
    assert.equal(after.seats.find((x) => x.seat === 0)!.name, "Аня");
    // Цвета/имена не перепутались: переезжал только номер места.
    assert.equal(
      after.seats.every((x) => colors.get(x.name) === x.color),
      true,
    );
    assert.equal(after.waiters.length, 0);
    assert.equal(after.room.hostSeat, 0);
    // Ради чего всё: стол заполнен ровно и партию можно начать.
    assert.equal((await s.start(host.code, host.token)).room.status, "playing");
  });

  it("уменьшение мест: боты уходят первыми, лишние люди — в очередь, хост передаётся", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 5, botSeats: 2, difficulty: "normal" });
    const g1 = await s.join({ code: host.code, name: "Боря" });
    const g2 = await s.join({ code: host.code, name: "Вася" });
    void g2; // остался за столом на новом месте — важно лишь, что он выжил
    // Жертв выбирает жребий: фиксируем Math.random, чтобы жертвой стал хост
    // (первый человек по порядку мест) — так проверяется и передача хоста.
    const realRandom = Math.random;
    Math.random = () => 0.999_999;
    try {
      await s.setCapacity(host.code, host.token, 3);
    } finally {
      Math.random = realRandom;
    }
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.room.capacity, 3);
    assert.deepEqual(
      snap.seats.map((x) => x.seat),
      [0, 1, 2],
    );
    assert.equal(
      snap.seats.every((x) => !x.isAI),
      true,
      "два бота убраны первыми",
    );
    assert.equal(snap.waiters.length, 0, "до людей дело не дошло");
    const chat = full(await s.poll(host.code, host.token)).chat;
    assert.equal(
      chat.some((m) => m.text.includes("Мест стало 3")),
      true,
      "система пишет в чат",
    );

    Math.random = () => 0.999_999;
    try {
      await s.setCapacity(host.code, host.token, 2);
    } finally {
      Math.random = realRandom;
    }
    // Хост ушёл в очередь ожидающих; стол смотрим глазами выжившего Бори.
    const alive = full(await s.poll(host.code, g1.token));
    assert.equal(alive.room.capacity, 2);
    assert.equal(alive.waiters.length, 1, "лишний человек переведён в ожидающие");
    assert.equal(alive.waiters[0]!.name, "Аня");
    assert.equal(alive.seat, 0, "выживший уплотнён на минимальное место");
    // Токен бывшего хоста теперь ждёт в очереди — сессия не потеряна.
    const info = await s.waiterInfo(host.code, host.token);
    assert.equal(info.queued, true);
    assert.equal(info.position, 1);
    // Новый хост — выживший онлайн-человек на самом низком месте (Боря, 0).
    assert.equal(alive.room.hostSeat, 0);
    assert.equal(alive.seats.find((x) => x.seat === alive.room.hostSeat)!.name, "Боря");
    // Системное сообщение называет переведённых в очередь.
    assert.equal(
      alive.chat.some((m) => m.text.includes("в очередь ожидающих: Аня")),
      true,
    );
  });

  it("настройки (модули/сложность/колода) — только хост и только в лобби", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 1, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    assert.equal(g.seat, 1); // бот занял хвостовое место 2, стол заполнен
    const w = await s.join({ code: host.code, name: "Вася" });
    assert.equal(w.waiting, true);
    // Не-хост за столом получает отказ по правам.
    await assert.rejects(() => s.setSettings(host.code, g.token, { deckSize: 60 }), /хост/);
    // Ожидающий — тоже «только хост», а не «место не существует»: host-методы
    // резолвят вызывающего и как место, и как очередь.
    await assert.rejects(
      () => s.setSettings(host.code, w.token, { deckSize: 60 }),
      (e: unknown) => e instanceof NetError && e.code !== "seat-taken" && /хост/.test(e.message),
    );
    await s.setSettings(host.code, host.token, {
      deckSize: 60,
      difficulty: "hard",
      modules: { plants: true },
    });
    const lobby = await s.rejoin(host.code, host.token);
    assert.equal(lobby.room.settings.deckSize, 60);
    assert.equal(lobby.room.settings.difficulty, "hard");
    assert.equal(lobby.room.settings.modules?.plants, true);
    await s.start(host.code, host.token);
    const playing = await s.rejoin(host.code, host.token);
    assert.equal(playing.room.settings.deckSize, 60);
    // viewFor отдаёт остаток колоды и счётчики рук: с «Растениями» раздают
    // по 8 карт (3 места), поэтому всего 36 + 24 = 60 — колода собрана ровно.
    const st = playing.state!;
    const totalCards =
      st.deckCount! + st.players.reduce((n, p) => n + (p.handCount ?? p.hand.length), 0);
    assert.equal(st.deckCount, 36);
    assert.equal(totalCards, 60);
    await assert.rejects(() => s.setSettings(host.code, host.token, { deckSize: 80 }), /до начала/);
  });

  it("передача хоста: старый хост теряет права, новый получает", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await assert.rejects(() => s.transferHost(host.code, g.token, g.seat), /хост/);
    await s.transferHost(host.code, host.token, g.seat);
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.room.hostSeat, g.seat);
    await assert.rejects(() => s.setBots({ code: host.code, token: host.token, count: 1 }), /хост/);
    await s.setBots({ code: host.code, token: g.token, count: 1 });
    // Бота нельзя назначить хостом.
    await assert.rejects(() => s.transferHost(host.code, g.token, 2), /человек/);
  });

  it("ушедший хост передаётся онлайн-игроку и это сохраняется", async () => {
    fixedNow = Date.now();
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    // Хост «вышел»: его метка онлайна устарела.
    await sql.query(
      `update evo_seats set last_seen_at = now() - interval '1 hour'
        where room_code = $1 and seat = 0`,
      [host.code],
    );
    const snap = full(await s.poll(host.code, g.token));
    assert.equal(snap.room.hostSeat, g.seat);
    // Сохранено в БД, а не вычислено на один кадр.
    const row = await sql.query<{ host_seat: number }>(
      `select host_seat from evo_rooms where code = $1`,
      [host.code],
    );
    assert.equal(row[0]!.host_seat, g.seat);
  });
});

describe("ожидающие", () => {
  it("место освободилось — ожидающий занимает его одним действием", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w = await s.join({ code: host.code, name: "Вася" });
    assert.equal(w.waiting, true);
    // Хост видит ожидающего в кадре лобби.
    let snap = full(await s.poll(host.code, host.token));
    assert.deepEqual(
      snap.waiters.map((x) => x.name),
      ["Вася"],
    );
    // Освобождаем место: убираем бота.
    await s.setBots({ code: host.code, token: host.token, count: 0 });
    const info = await s.waiterInfo(host.code, w.token);
    assert.equal(info.freeSeat, 1);
    const claimed = await s.claimSeat(host.code, w.token);
    assert.equal(claimed.seat, 1);
    const seatSnap = await s.rejoin(host.code, claimed.token);
    assert.equal(seatSnap.seat, 1);
    assert.equal(
      seatSnap.seats.some((x) => x.name === "Вася"),
      true,
    );
    snap = full(await s.poll(host.code, claimed.token));
    assert.equal(snap.waiters.length, 0);
  });

  it("хост удаляет ожидающего; удалённый получает код kicked", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w = await s.join({ code: host.code, name: "Вася" });
    await assert.rejects(() => s.kickWaiter(host.code, w.token, 0), /хост/);
    await s.kickWaiter(host.code, host.token, 0);
    await assert.rejects(
      () => s.waiterInfo(host.code, w.token),
      (e: unknown) => e instanceof NetError && e.code === "kicked",
    );
    const snap = full(await s.poll(host.code, host.token));
    assert.equal(snap.waiters.length, 0);
  });

  it("очередь ограничена по размеру", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    for (let i = 0; i < 16; i++) await s.join({ code: host.code, name: `Гость${i}` });
    await assert.rejects(() => s.join({ code: host.code, name: "Лишний" }), /переполнен/);
  });

  it("просроченный ожидающий вычищается по TTL", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w = await s.join({ code: host.code, name: "Вася" });
    // Имитируем старую заявку: TTL очереди — 2 часа.
    await sql.query(
      `update evo_waiters set created_at = now() - interval '3 hours' where room_code = $1`,
      [host.code],
    );
    // S1: строку ожидающего вычистили — токен больше не участник, кадра нет.
    await assert.rejects(
      () => s.waiterInfo(host.code, w.token),
      (e: unknown) => e instanceof NetError && e.code === "seat-taken",
    );
    assert.equal(full(await s.poll(host.code, host.token)).waiters.length, 0);
  });

  it("leaveQueue убирает из очереди", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w = await s.join({ code: host.code, name: "Вася" });
    assert.equal((await s.waiterInfo(host.code, w.token)).queued, true);
    await s.leaveQueue(host.code, w.token);
    // Добровольный выход из очереди — тоже потеря участия: кадр лобби больше
    // не отдаётся (S1), а очередь пуста для остальных.
    await assert.rejects(
      () => s.waiterInfo(host.code, w.token),
      (e: unknown) => e instanceof NetError && e.code === "seat-taken",
    );
    assert.equal(full(await s.poll(host.code, host.token)).waiters.length, 0);
  });

  it("токены мест и очереди не утекают в кадры", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w = await s.join({ code: host.code, name: "Вася" });
    const snap = full(await s.poll(host.code, host.token));
    const info = await s.waiterInfo(host.code, w.token);
    const json = JSON.stringify({ snap, info });
    assert.equal(json.includes(host.token), false, "токен места не должен попадать в кадр");
    assert.equal(json.includes(w.token), false, "токен очереди не должен попадать в кадр");
    // В очереди виден только псевдоним, время постановки и «печатает…».
    assert.deepEqual(Object.keys(snap.waiters[0]!).sort(), ["at", "name", "typing"]);
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
    assert.equal(
      snap.state!.players.every((p) => !p.isAI),
      true,
    );
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
      st.phase === "foodBank" || st.phase === "extinction" || st.pendingAttack !== null
        ? false
        : !st.players[st.currentPlayerId]!.isAI;
    assert.ok(waitingHuman || st.phase === "gameOver");
  });

  it(
    "человек + бот: партия доходит до gameOver при пасах человека",
    { timeout: 60000 },
    async () => {
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
          continue;
        }
        // Пас в питании тоже теперь за человеком (feedSkip всегда доступен).
        if (st.phase === "feeding" && st.currentPlayerId === 0) {
          try {
            await s.action(host.code, host.token, { type: "feedSkip" });
          } catch {
            /* уже скипнул/ход ушёл */
          }
        }
      }
      assert.equal(finished, true, "стол из человека-пасовщика и бота должен закончиться");
    },
  );

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

  it("одно действие = один инкремент версии (шаг бота отложен)", async () => {
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

  it("M6: перестановка своего животного проходит, чужого и не в свой ход — отказ", async () => {
    const { s, host, g } = await startedTable();
    await s.start(host.code, host.token);
    // Ручной расклад: у каждого места по два животных, ход у места 0.
    const room = await _internals.readRoom(sql, host.code);
    const st = structuredClone(room!.state!);
    const animal = (id: string, ownerId: number) => ({
      id,
      ownerId,
      cardId: "c1",
      traits: [],
      food: 0,
      blueFood: 0,
      fatTokens: 0,
      hibernating: false,
      hibernatedLastYear: false,
      receivedFoodThisYear: false,
      poisoned: false,
      seed: 1,
    });
    st.phase = "development";
    st.pendingAttack = null;
    st.currentPlayerId = 0;
    st.players[0]!.animals = [animal("a-1", 0), animal("a-2", 0)];
    st.players[1]!.animals = [animal("b-1", 1), animal("b-2", 1)];
    await _internals.casUpdate(sql, host.code, room!.version, { state: st });

    // Своё животное — вперёд: сервер пропускает ход, движок меняет порядок.
    await s.action(host.code, host.token, {
      type: "reorderAnimal",
      animalId: "a-2",
      beforeId: "a-1",
    });
    let snap = full(await s.poll(host.code, host.token));
    assert.deepEqual(
      snap.state!.players[0]!.animals.map((a) => a.id),
      ["a-2", "a-1"],
    );
    // Канонический снимок не «запоминает» ходящего: humanId по-прежнему 0.
    assert.equal((await _internals.readRoom(sql, host.code))!.state!.humanId, 0);

    // Чужое животное своим ходом и своё — в чужой ход: по-прежнему отказ
    // (с понятной причиной, см. отдельный тест S4 про текст отказа).
    await assert.rejects(
      () =>
        s.action(host.code, host.token, {
          type: "reorderAnimal",
          animalId: "b-1",
          beforeId: "b-2",
        }),
      /только своих животных/,
    );
    await assert.rejects(
      () =>
        s.action(host.code, g.token, {
          type: "reorderAnimal",
          animalId: "a-1",
          beforeId: "a-2",
        }),
      /недопустим|только в свой ход/,
    );
    // Второе место тоже переставляет своё: сервер подставляет humanId = место.
    const room2 = await _internals.readRoom(sql, host.code);
    const st2 = structuredClone(room2!.state!);
    st2.currentPlayerId = 1;
    await _internals.casUpdate(sql, host.code, room2!.version, { state: st2 });
    await s.action(host.code, g.token, { type: "reorderAnimal", animalId: "b-2", beforeId: "b-1" });
    snap = full(await s.poll(host.code, g.token));
    assert.deepEqual(
      snap.state!.players[1]!.animals.map((a) => a.id),
      ["b-2", "b-1"],
    );
    // Питание: косметическая перестановка в ряду разрешена так же.
    const room3 = await _internals.readRoom(sql, host.code);
    const st3 = structuredClone(room3!.state!);
    st3.phase = "feeding";
    st3.pendingAttack = null;
    st3.currentPlayerId = 0;
    await _internals.casUpdate(sql, host.code, room3!.version, { state: st3 });
    await s.action(host.code, host.token, {
      type: "reorderAnimal",
      animalId: "a-1",
      beforeId: "a-2",
    });
    snap = full(await s.poll(host.code, host.token));
    assert.deepEqual(
      snap.state!.players[0]!.animals.map((a) => a.id),
      ["a-1", "a-2"],
      "в фазе питания перестановка тоже работает",
    );
  });

  it("M6: перенос животного между территориями («Континенты») проходит в развитии", async () => {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 2,
      botSeats: 0,
      difficulty: "normal",
      modules: { continents: true },
    });
    await s.join({ code: host.code, name: "Боря" });
    await s.start(host.code, host.token);
    const room = await _internals.readRoom(sql, host.code);
    const st = structuredClone(room!.state!);
    st.phase = "development";
    st.pendingAttack = null;
    st.currentPlayerId = 0;
    st.players[0]!.animals = [
      {
        id: "a-1",
        ownerId: 0,
        cardId: "c1",
        traits: [],
        food: 0,
        blueFood: 0,
        fatTokens: 0,
        hibernating: false,
        hibernatedLastYear: false,
        receivedFoodThisYear: false,
        poisoned: false,
        seed: 1,
        zoneId: "laurasia",
      },
    ];
    await _internals.casUpdate(sql, host.code, room!.version, { state: st });
    await s.action(host.code, host.token, {
      type: "reorderAnimal",
      animalId: "a-1",
      toZoneId: "gondwana",
    });
    const snap = full(await s.poll(host.code, host.token));
    assert.equal(snap.state!.players[0]!.animals[0]!.zoneId, "gondwana");
  });

  it("финал: finished отдаётся клиенту, poll/again не ломаются", async () => {
    const { s, host } = await startedTable();
    await s.start(host.code, host.token);
    const room = await _internals.readRoom(sql, host.code);
    await _internals.casUpdate(sql, host.code, room!.version, { status: "finished" });
    const snap = full(await s.poll(host.code, host.token));
    assert.equal(snap.room.status, "finished");
    assert.ok(snap.state); // финальное состояние игроку видно
    await assert.rejects(() => s.action(host.code, host.token, { type: "devPass" }), /не идёт/);
    await s.again({ code: host.code, token: host.token });
    assert.equal(full(await s.poll(host.code, host.token)).room.status, "lobby");
  });
});

describe("журнал событий", () => {
  it("батчи: только с sinceVersion; скрытое свойство обезличено", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await s.start(host.code, host.token);
    const first = full(await s.poll(host.code, host.token));
    // Первый кадр после подключения истории не вываливает.
    assert.deepEqual(first.events, []);
    const room = await _internals.readRoom(sql, host.code);
    const nextVersion = room!.version + 1;
    await _internals.casUpdate(sql, host.code, room!.version, {
      eventsAppend: [
        { kind: "traitPlaced", animalId: "нет-такого", type: "parasite", hidden: true },
      ],
    });
    const seen = full(await s.poll(host.code, host.token, first.version));
    assert.equal(seen.events.length, 1);
    assert.equal(seen.events[0]!.version, nextVersion);
    const ev = seen.events[0]!.events[0]!;
    assert.ok(ev.kind === "traitPlaced" && ev.type !== "parasite");
    // Повторный запрос с той же sinceVersion батч уже не отдаёт: либо
    // unchanged-кадр, либо пустой список событий.
    const repeat = await s.poll(host.code, host.token, nextVersion);
    if ("unchanged" in repeat) {
      assert.equal(repeat.unchanged, true);
    } else {
      assert.deepEqual(repeat.events, []);
    }
    void g;
  });

  it("автошаги (боты/фазы) пишут батчи событий в журнал", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const snap = await s.start(host.code, host.token);
    // Первый ходящий выбирается сидом: если человек — пасуем, его действие
    // тоже обязано оставить батч (проверяем оба пути записи).
    if (snap.state!.phase === "development" && snap.state!.currentPlayerId === 0) {
      await s.action(host.code, host.token, { type: "devPass" });
    }
    fixedNow += 60 * 60 * 1000; // автошаги созрели
    await s.poll(host.code, host.token);
    const room = await _internals.readRoom(sql, host.code);
    assert.ok(room!.events.length > 0, "шаг должен оставить батч событий");
    const versions = room!.events.map((b) => b.version);
    assert.deepEqual(
      versions,
      [...versions].sort((a, b) => a - b),
    );
  });

  it("хранит только последние 40 батчей", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    await s.start(host.code, host.token);
    for (let i = 0; i < 45; i++) {
      const room = await _internals.readRoom(sql, host.code);
      await _internals.casUpdate(sql, host.code, room!.version, {
        eventsAppend: [{ kind: "passed", playerId: 0 }],
      });
    }
    const room = await _internals.readRoom(sql, host.code);
    assert.equal(room!.events.length, 40);
    // Порядок по возрастанию версий.
    const versions = room!.events.map((b) => b.version);
    assert.deepEqual(
      versions,
      [...versions].sort((a, b) => a - b),
    );
  });
});

describe("чат", () => {
  it("валидация, обрезка, автор из БД", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    const m = await s.chat(host.code, host.token, "  Привет!  ");
    assert.equal(m.text, "Привет!");
    assert.equal(m.name, "Аня");
    assert.equal(m.seat, 0);
    assert.ok(m.at > 0);
    await assert.rejects(() => s.chat(host.code, host.token, "   "), /Пустое/);
    // rate-limit: сразу второе сообщение нельзя (лимит 1 в 700 мс).
    await assert.rejects(() => s.chat(host.code, host.token, "Ещё"), /часто|много/);
    // Длинный текст обрезается, а не отвергается; имя берётся из места.
    const long = await s.chat(host.code, g.token, "x".repeat(600));
    assert.equal(long.text.length, 400);
    assert.equal(long.name, "Боря");
    assert.equal(long.seat, 1);
  });

  it("сообщения доезжают в unchanged-кадре", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    await s.join({ code: host.code, name: "Боря" });
    const m = await s.chat(host.code, host.token, "Раз");
    const snap = full(await s.poll(host.code, host.token));
    const un = await s.poll(host.code, host.token, snap.version, 0);
    assert.ok("unchanged" in un);
    if ("unchanged" in un) {
      assert.deepEqual(
        un.chat.map((x) => x.id),
        [m.id],
      );
    }
  });

  it("человек вне стола писать не может", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    await assert.rejects(
      () => s.chat(host.code, "чужой-токен-123456", "привет"),
      (e: unknown) => e instanceof NetError && e.code === "seat-taken",
    );
  });
});

describe("история чата при входе", () => {
  it("вошедший позже участник видит предыдущие сообщения (очередь, зритель, место)", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 1, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    const m1 = await s.chat(host.code, host.token, "Первое");
    const m2 = await s.chat(host.code, g.token, "Второе");
    const want = [m1.id, m2.id];
    // Мест нет (хост, Боря, бот) — третий попадает в очередь, но историю видит сразу.
    const waiter = await s.join({ code: host.code, name: "Вася" });
    assert.equal(waiter.waiting, true);
    assert.deepEqual(
      (await s.waiterInfo(host.code, waiter.token)).chat.map((m) => m.id),
      want,
    );
    // Зритель — тот же контракт.
    const { token: spec } = await s.spectate(host.code, "Зоя");
    assert.deepEqual(
      (await s.spectatorPoll(host.code, spec)).chat.map((m) => m.id),
      want,
    );
    // Ожидающий занимает освободившееся место — переписка остаётся с ним.
    await s.setBots({ code: host.code, token: host.token, count: 0 });
    const seat = await s.claimSeat(host.code, waiter.token);
    const late = await s.rejoin(host.code, seat.token);
    assert.deepEqual(late.chat.map((m) => m.id), want, "вошедший позже видит историю");
    assert.deepEqual(
      late.chat.map((m) => [m.name, m.text]),
      [
        ["Аня", "Первое"],
        ["Боря", "Второе"],
      ],
      "автор и текст сохранены",
    );
  });

  it("история ограничена 50 последними и идёт по возрастанию id", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    // Пишем мимо сервиса: лимит 700 мс не дал бы набить 60 сообщений подряд.
    for (let i = 1; i <= 60; i++) {
      await sql.query(
        `insert into evo_chat (room_code, seat, name, text) values ($1, 0, 'Аня', $2)`,
        [host.code, `#${i}`],
      );
    }
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.chat.length, 50);
    assert.equal(snap.chat[0]!.text, "#11");
    assert.equal(snap.chat[49]!.text, "#60");
    const ids = snap.chat.map((m) => m.id);
    assert.deepEqual(ids, [...ids].sort((a, b) => a - b), "старые сверху, по возрастанию id");
  });
});

describe("инициализация схемы на чистом PGlite", () => {
  it("NET_TABLES_DDL исполняется по одной команде — стол создаётся", async () => {
    // Локальный фолбэк (без DATABASE_URL) — это PGlite, а он не принимает
    // мультизапросный DDL через query(): раньше getRoomService падал, и
    // сетевая игра локально не поднималась вообще.
    const pg = new PGlite();
    await pg.waitReady;
    const run = async <T>(text: string, params: unknown[] = []): Promise<T[]> =>
      (await pg.query<T>(text, params)).rows as T[];
    const fresh = { query: run } as unknown as SqlLike;
    for (const statement of splitStatements(NET_TABLES_DDL)) await fresh.query(statement);
    const s = createRoomService(fresh, { now: () => fixedNow });
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.room.capacity, 2);
    assert.deepEqual(
      snap.seats.map((x) => x.name),
      ["Аня", "Дарвин"],
    );
    await pg.close();
  });
});

describe("зрители и реакции", () => {
  it("зритель входит без места, видит публичный стол и не может действовать", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    await s.start(host.code, host.token);
    const { token } = await s.spectate(host.code, "Зритель Зоя");
    assert.notEqual(token, host.token);
    // Первое место не занято зрителем: rejoin хоста работает, состав прежний.
    const snap = full(await s.poll(host.code, host.token));
    assert.equal(snap.seats.length, 2);
    assert.deepEqual(
      snap.spectators.map((x) => x.name),
      ["Зритель Зоя"],
    );
    // Кадр зрителя: humanId замаскирован, руки обезличены viewFor'ом.
    const view = await s.spectatorPoll(host.code, token);
    assert.equal(view.room.code, host.code);
    assert.ok(view.state);
    assert.deepEqual(
      view.state!.players.map((p) => p.hand),
      [[], []],
    );
    // Ходить зритель не может: токен не совпадает ни с одним местом.
    await assert.rejects(
      () => s.action(host.code, token, { type: "devPass" }),
      (e: unknown) => e instanceof NetError,
    );
  });

  it("реакции: лимит, рассылка в unchanged-кадре, типы reaction/cheer", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const { token } = await s.spectate(host.code, "Зоя");
    const r1 = await s.reaction(host.code, token, "🔥", "reaction");
    assert.equal(r1.emoji, "🔥");
    assert.equal(r1.kind, "reaction");
    const cheer = await s.reaction(host.code, host.token, "👏", "cheer");
    assert.equal(cheer.kind, "cheer");
    // Реакции отдаются инкрементально: sinceReactionId отсекает уже доставленное.
    const snap = full(await s.poll(host.code, host.token));
    assert.equal(snap.reactions.length, 2);
    const since = snap.reactions[0]!.id;
    const un = await s.poll(host.code, host.token, snap.version, undefined, since);
    assert.ok("unchanged" in un);
    if ("unchanged" in un) {
      assert.equal(un.reactions.length, 1); // только та, что после since
      assert.equal(un.reactions[0]!.kind, "cheer");
    }
    // Rate-limit: серия реакций подряд ограничивается.
    await assert.rejects(() => s.reaction(host.code, token, "🌿", "reaction"), /подождите/);
  });

  it("чужая реакция доезжает другому игроку: полный кадр и unchanged", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    const r1 = await s.reaction(host.code, host.token, "🔥", "reaction");
    // Полный кадр (poll без sinceVersion): реакция соперника видна второму игроку.
    const snap = full(await s.poll(host.code, g.token));
    assert.deepEqual(
      snap.reactions.map((r) => r.id),
      [r1.id],
    );
    assert.equal(snap.reactions[0]!.name, "Аня");
    // Пока новых реакций нет, unchanged-кадр не вываливает историю заново.
    const quiet = await s.poll(host.code, g.token, snap.version, undefined, r1.id);
    assert.ok("unchanged" in quiet);
    if ("unchanged" in quiet) assert.deepEqual(quiet.reactions, []);
    // Новая реакция (от зрителя, чтобы не упереться в лимит по имени)
    // приходит в unchanged-кадре строго после sinceReactionId.
    const { token: specToken } = await s.spectate(host.code, "Зоя");
    const r2 = await s.reaction(host.code, specToken, "👏", "cheer");
    const un = await s.poll(host.code, g.token, snap.version, undefined, r1.id);
    assert.ok("unchanged" in un);
    if ("unchanged" in un) {
      assert.deepEqual(
        un.reactions.map((r) => r.id),
        [r2.id],
      );
    }
  });
});

describe("реакции на сообщения", () => {
  it("реакция на реплику сохраняется и возвращается с chatId", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    const msg = await s.chat(host.code, host.token, "Привет!");
    const r = await s.reaction(host.code, g.token, "🔥", "reaction", null, msg.id);
    assert.equal(r.chatId, msg.id);
    assert.equal(r.targetSeat, null);
    // Реакция доезжает до автора сообщения полным кадром и в unchanged тоже.
    const snap = full(await s.poll(host.code, host.token));
    const seen = snap.reactions.find((x) => x.id === r.id)!;
    assert.equal(seen.chatId, msg.id);
    assert.equal(seen.name, "Боря");
    const un = await s.poll(host.code, host.token, snap.version, undefined, r.id - 1);
    assert.ok("unchanged" in un);
    if ("unchanged" in un) {
      assert.equal(un.reactions.find((x) => x.id === r.id)!.chatId, msg.id);
    }
    // Реакция без chatId — прежнее поведение «в стол»: chatId = null.
    const toTable = await s.reaction(host.code, host.token, "👏", "cheer");
    assert.equal(toTable.chatId, null);
  });

  it("реакция на сообщение из другой комнаты отклоняется и не пишется", async () => {
    const s = svc();
    const a = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const b = await s.create({ name: "Боря", capacity: 2, botSeats: 0, difficulty: "normal" });
    const foreign = await s.chat(b.code, b.token, "Чужая реплика");
    const count = async (): Promise<number> =>
      (await sql.query<{ n: number }>(`select count(*)::int as n from evo_reactions`))[0]!.n;
    const before = await count();
    await assert.rejects(
      () => s.reaction(a.code, a.token, "💚", "reaction", null, foreign.id),
      /не найдено/,
    );
    assert.equal(await count(), before, "отклонённая реакция не должна попадать в БД");
  });

  it("удаление сообщения не ломает чтение реакций (своя уходит каскадом)", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    const m1 = await s.chat(host.code, host.token, "Раз");
    const m2 = await s.chat(host.code, g.token, "Два");
    await s.reaction(host.code, g.token, "🔥", "reaction", null, m1.id);
    const r2 = await s.reaction(host.code, host.token, "🌿", "reaction", null, m2.id);
    await sql.query(`delete from evo_chat where id = $1`, [m1.id]);
    const list = (await s.rejoin(host.code, host.token)).reactions;
    assert.deepEqual(
      list.map((x) => [x.id, x.chatId]),
      [[r2.id, m2.id]],
      "реакция удалённого сообщения уходит с ним, остальные читаются",
    );
  });
});

describe("«печатает…»", () => {
  it("netTyping чужим токеном и по чужому коду отклоняется", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    await assert.rejects(
      () => s.typing(host.code, "чужой-токен-123456"),
      (e: unknown) => e instanceof NetError && e.code === "seat-taken",
    );
    await assert.rejects(() => s.typing("ZZZZ", host.token), /не найден/);
  });

  it("свежая отметка даёт typing=true в кадре места, старая — false", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    // Прошлые тесты могли увести fixedNow вперёд: выравниваем инжектированные
    // часы с часами БД, от которых считается свежесть.
    fixedNow = Date.now();
    await s.typing(host.code, host.token);
    const fresh = full(await s.poll(host.code, g.token));
    assert.equal(fresh.seats.find((x) => x.seat === host.seat)!.typing, true);
    assert.equal(fresh.seats.find((x) => x.seat === g.seat)!.typing, false, "молчащий не печатает");
    // Троттлинг: повторный пинг сразу — без ошибки, картина не портится.
    await s.typing(host.code, host.token);
    assert.equal(full(await s.poll(host.code, g.token)).seats[0]!.typing, true);
    // Отметка старше окна (~4 с) — индикатор гаснет.
    fixedNow += 60_000;
    const stale = full(await s.poll(host.code, g.token));
    assert.equal(stale.seats.find((x) => x.seat === host.seat)!.typing, false);
  });

  it("печатающие ожидающий и зритель видны в своих списках, не подмешиваясь в места", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    // Мест нет: третий — ожидающий со своим токеном.
    const waiter = await s.join({ code: host.code, name: "Вася" });
    assert.equal(waiter.waiting, true);
    fixedNow = Date.now();
    await s.typing(host.code, waiter.token);
    const info = await s.waiterInfo(host.code, host.token);
    assert.equal(info.waiters.find((w) => w.name === "Вася")!.typing, true);
    assert.equal(info.seats.find((x) => x.seat === 0)!.typing, false);
    // Зритель — отдельный список присутствия.
    const { token: spec } = await s.spectate(host.code, "Зоя");
    await s.typing(host.code, spec);
    const view = await s.spectatorPoll(host.code, spec);
    assert.equal(view.spectators.find((x) => x.name === "Зоя")!.typing, true);
    // Окно истекает и у ожидающего.
    fixedNow += 60_000;
    const later = await s.waiterInfo(host.code, host.token);
    assert.equal(later.waiters.find((w) => w.name === "Вася")!.typing, false);
  });
});

describe("сдача игрока", () => {
  it("сдавшийся: место и имя остаются, ходы отклоняются, хост передаётся", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 1, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await s.start(host.code, host.token);
    const snap = await s.resign(host.code, host.token);
    // Место и имя на месте, в состоянии — флаг сдачи.
    assert.equal(snap.room.status, "playing");
    assert.equal(snap.seats.length, 3);
    assert.equal(snap.seats.find((x) => x.seat === host.seat)!.name, "Аня");
    assert.equal(snap.seats.find((x) => x.seat === host.seat)!.resigned, true);
    assert.equal(snap.state!.players[host.seat]!.resigned, true);
    // Сдавшийся больше не хост: права уходят следующему человеку.
    assert.equal(snap.room.hostSeat, g.seat);
    // Ходы от сдавшегося отклоняются понятной ошибкой.
    await assert.rejects(() => s.action(host.code, host.token, { type: "devPass" }), /сдал/i);
    // Повторная сдача идемпотентна.
    const again = await s.resign(host.code, host.token);
    assert.equal(again.state!.players[host.seat]!.resigned, true);
    // Сдача до старта невозможна.
    const lobby = svc();
    const lh = await lobby.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    await assert.rejects(() => lobby.resign(lh.code, lh.token), /не идёт/);
  });

  it("nextAutoStep пасует за сдавшегося в развитии и питании", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const snap = await s.start(host.code, host.token);
    const st = structuredClone(snap.state!);
    st.players[0]!.resigned = true;
    st.players[1]!.resigned = false;
    st.pendingAttack = null;
    st.phase = "development";
    st.currentPlayerId = 0;
    assert.deepEqual(nextAutoStep(st), { type: "devPass" });
    st.phase = "feeding";
    assert.deepEqual(nextAutoStep(st), { type: "feedSkip" });
    // Сдавшийся-жертва атаки без защиты: партия не ждёт его решения.
    st.phase = "feeding";
    st.pendingAttack = {
      carnivoreId: st.players[1]!.animals[0]?.id ?? "нет",
      preyId: st.players[0]!.animals[0]?.id ?? "нет",
      mimicryChain: [],
      waitingFor: 0,
      usedDefenses: [],
    };
    assert.deepEqual(nextAutoStep(st), { type: "chooseDefense", kind: "none" });
  });

  it(
    "сдавшийся не ходит: партия доходит до финала, его очки в счёте",
    { timeout: 60000 },
    async () => {
      const s = svc();
      const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "easy" });
      await s.start(host.code, host.token);
      await s.resign(host.code, host.token);
      let finished = false;
      let consecutiveErrors = 0;
      for (let i = 0; i < 600 && !finished; i++) {
        fixedNow += 2500; // созревают авточаги
        try {
          const snap = full(await s.poll(host.code, host.token));
          if (snap.room.status === "finished") {
            finished = true;
            // Финальный счёт считает всех: сдавшийся остаётся участником.
            assert.equal(snap.state!.scores!.length, 2);
            assert.ok(snap.state!.scores!.some((x) => x.name === "Аня"));
            break;
          }
        } catch {
          if (++consecutiveErrors > 50) throw new Error("сервер сломался надолго");
        }
      }
      assert.equal(finished, true, "партия со сдавшимся человеком и ботом должна закончиться");
      await assert.rejects(() => s.action(host.code, host.token, { type: "devPass" }), /не идёт/);
    },
  );

  it("again снимает флаги сдачи со всех мест", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    await s.start(host.code, host.token);
    await s.resign(host.code, host.token);
    const room = await _internals.readRoom(sql, host.code);
    await _internals.casUpdate(sql, host.code, room!.version, { status: "finished" });
    await s.again({ code: host.code, token: host.token });
    const rows = await sql.query<{ n: number }>(
      `select count(*)::int as n from evo_seats where room_code = $1 and resigned`,
      [host.code],
    );
    assert.equal(rows[0]!.n, 0);
    const back = await s.rejoin(host.code, host.token);
    assert.equal(back.room.status, "lobby");
    assert.equal(
      back.seats.every((x) => !x.resigned),
      true,
    );
  });
});

describe("имена", () => {
  it("setName: смена в лобби, обрезка, отказ в партии и чужой токен", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 1, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    const long = await s.setName(host.code, host.token, "  ОченьДлинноеИмяИгрока  ");
    assert.equal(long.name.length, 16);
    assert.equal(long.name, "ОченьДлинноеИмяИ");
    const renamedHost = await s.setName(host.code, g.token, "Вася");
    assert.equal(renamedHost.name, "Вася");
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.seats.find((x) => x.seat === g.seat)!.name, "Вася");
    await assert.rejects(
      () => s.setName(host.code, "чужой-токен-123456", "Кто"),
      (e: unknown) => e instanceof NetError && e.code === "seat-taken",
    );
    await assert.rejects(() => s.setName(host.code, host.token, "   "), /имя/i);
    // В идущей партии место не переименовывается.
    await s.start(host.code, host.token);
    await assert.rejects(() => s.setName(host.code, host.token, "Новое"), /до начала/);
  });

  it("тёзки нумеруются: места, очередь и боты", async () => {
    const s = svc();
    const host = await s.create({ name: "Дима", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Дима" });
    assert.equal(g.seat, 1);
    let snap = await s.rejoin(host.code, host.token);
    assert.deepEqual(
      snap.seats.map((x) => x.name),
      ["Дима", "Дима 1"],
    );
    // Третий тёзка не влезает — уходит в очередь с номером 2.
    const w = await s.join({ code: host.code, name: "Дима" });
    assert.equal(w.waiting, true);
    snap = await s.rejoin(host.code, host.token);
    assert.deepEqual(
      snap.waiters.map((x) => x.name),
      ["Дима 2"],
    );
    // Боты не конфликтуют с людьми: имя учёного у человека сдвигает бота.
    const s2 = svc();
    const h2 = await s2.create({ name: "Дарвин", capacity: 2, botSeats: 1, difficulty: "normal" });
    const snap2 = await s2.rejoin(h2.code, h2.token);
    assert.deepEqual(
      snap2.seats.map((x) => x.name),
      ["Дарвин", "Дарвин 1"],
    );
    // Занятие места из очереди сохраняет своё имя и не дублирует номер.
    const s3 = svc();
    const h3 = await s3.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w3 = await s3.join({ code: h3.code, name: "Вася" });
    assert.equal(w3.waiting, true);
    await s3.join({ code: h3.code, name: "Вася" }); // второй тёзка: «Вася 1»
    await s3.setBots({ code: h3.code, token: h3.token, count: 0 });
    const claimed = await s3.claimSeat(h3.code, w3.token);
    const seatSnap = await s3.rejoin(h3.code, claimed.token);
    assert.equal(seatSnap.seats.find((x) => x.seat === claimed.seat)!.name, "Вася");
  });

  it("setBots и замена кикнутого дают имена учёных без конфликтов", async () => {
    const s = svc();
    const host = await s.create({ name: "Дарвин", capacity: 3, botSeats: 0, difficulty: "normal" });
    await s.setBots({ code: host.code, token: host.token, count: 2 });
    let snap = await s.rejoin(host.code, host.token);
    assert.deepEqual(
      snap.seats.map((x) => x.name),
      ["Дарвин", "Дарвин 1", "Уоллес"],
    );
    // Кик в партии: место становится ботом с именем из списка учёных.
    await s.setBots({ code: host.code, token: host.token, count: 0 });
    const g = await s.join({ code: host.code, name: "Боря" });
    assert.equal(g.seat, 1);
    await s.setBots({ code: host.code, token: host.token, count: 1 });
    await s.start(host.code, host.token);
    await s.kick(host.code, host.token, g.seat);
    snap = full(await s.poll(host.code, host.token));
    const bot = snap.seats.find((x) => x.seat === g.seat)!;
    assert.equal(bot.isAI, true);
    assert.equal(bot.name, "Уоллес");
    assert.equal(snap.state!.players[g.seat]!.isAI, true);
    assert.equal(snap.state!.players[g.seat]!.resigned, false);
  });
});

describe("ожидающие при старте", () => {
  it("становятся зрителями с тем же токеном, очередь очищается", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w = await s.join({ code: host.code, name: "Вася" });
    assert.equal(w.waiting, true);
    await s.start(host.code, host.token);
    // Очередь пуста, а бывший ожидающий виден в зрителях.
    const hostSnap = full(await s.poll(host.code, host.token));
    assert.equal(hostSnap.waiters.length, 0);
    assert.deepEqual(
      hostSnap.spectators.map((x) => x.name),
      ["Вася"],
    );
    // Тот же токен работает в зрительском поллинге: сессия не потеряна.
    const view = await s.spectatorPoll(host.code, w.token);
    assert.equal(view.room.status, "playing");
    assert.ok(view.state);
    assert.deepEqual(
      view.spectators.map((x) => x.name),
      ["Вася"],
    );
    // Информация ожидающего тоже честно говорит: очередь кончилась, партия идёт.
    const info = await s.waiterInfo(host.code, w.token);
    assert.equal(info.queued, false);
    assert.equal(info.position, null);
    assert.equal(info.room.status, "playing");
  });

  it("setName работает для ожидающего и зрителя", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const w = await s.join({ code: host.code, name: "Вася" });
    const renamed = await s.setName(host.code, w.token, "Василий");
    assert.equal(renamed.name, "Василий");
    const snap = await s.rejoin(host.code, host.token);
    assert.deepEqual(
      snap.waiters.map((x) => x.name),
      ["Василий"],
    );
    await s.start(host.code, host.token);
    const again = await s.setName(host.code, w.token, "Василий Великий");
    assert.equal(again.name, "Василий Великий");
    const view = await s.spectatorPoll(host.code, w.token);
    assert.deepEqual(
      view.spectators.map((x) => x.name),
      ["Василий Великий"],
    );
  });
});

describe("приватные столы", () => {
  it("create с паролем: без пароля и с неверным — машиночитаемые коды", async () => {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 3,
      botSeats: 0,
      difficulty: "normal",
      isPrivate: true,
    });
    assert.equal(host.isPrivate, true);
    assert.match(host.password ?? "", /^\d{4}$/, "пустой пароль — сервер генерирует 4 цифры");
    // Без пароля и с неверным — разные коды: форма входа покажет поле пароля.
    await assert.rejects(
      () => s.join({ code: host.code, name: "Боря" }),
      (e: unknown) => e instanceof NetError && e.code === "password-required",
    );
    await assert.rejects(
      () => s.join({ code: host.code, name: "Боря", password: "0000" }),
      (e: unknown) => e instanceof NetError && e.code === "password-wrong",
    );
    const g = await s.join({ code: host.code, name: "Боря", password: host.password! });
    assert.equal(g.seat, 1);
    // Приватность публична, а пароль отдаётся только хосту.
    const hostSnap = await s.rejoin(host.code, host.token);
    assert.equal(hostSnap.room.isPrivate, true);
    assert.equal(hostSnap.room.password, host.password);
    const guestSnap = await s.rejoin(host.code, g.token);
    assert.equal(guestSnap.room.isPrivate, true);
    assert.equal(guestSnap.room.password, null, "пароль не должен утекать гостям");
    // S5: наблюдение приватного стола — только с паролем (того же, что в join).
    await assert.rejects(
      () => s.spectate(host.code, "Зоя"),
      (e: unknown) => e instanceof NetError && e.code === "password-required",
    );
    await assert.rejects(
      () => s.spectate(host.code, "Зоя", "0000"),
      (e: unknown) => e instanceof NetError && e.code === "password-wrong",
    );
    const { token } = await s.spectate(host.code, "Зоя", host.password!);
    const view = await s.spectatorPoll(host.code, token);
    assert.equal(view.room.isPrivate, true);
    assert.equal(view.room.password, null);
  });

  it("create без isPrivate остаётся открытым (обратная совместимость)", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    assert.equal(host.isPrivate, false);
    assert.equal(host.password, null);
    const snap = await s.rejoin(host.code, host.token);
    assert.equal(snap.room.isPrivate, false);
    assert.equal(snap.room.password, null);
    const g = await s.join({ code: host.code, name: "Боря" });
    assert.equal(g.seat, 1);
  });

  it("setRoomPrivacy: только хост, только лобби, пароль перегенерируется", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 4, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await assert.rejects(() => s.setRoomPrivacy(host.code, g.token, true), /хост/);
    const made = await s.setRoomPrivacy(host.code, host.token, true);
    assert.equal(made.isPrivate, true);
    assert.match(made.password ?? "", /^\d{4}$/);
    assert.equal((await s.rejoin(host.code, host.token)).room.password, made.password);
    // «Новый пароль»: старый перестаёт работать, новый пускает.
    const rotated = await s.setRoomPrivacy(host.code, host.token, true, true);
    assert.notEqual(rotated.password, made.password);
    await assert.rejects(
      () => s.join({ code: host.code, name: "Вася", password: made.password! }),
      (e: unknown) => e instanceof NetError && e.code === "password-wrong",
    );
    const v = await s.join({ code: host.code, name: "Вася", password: rotated.password! });
    assert.equal(v.seat, 2);
    // Снова открытый: вход без пароля работает.
    await s.setRoomPrivacy(host.code, host.token, false);
    assert.equal((await s.rejoin(host.code, host.token)).room.isPrivate, false);
    const last = await s.join({ code: host.code, name: "Гена" });
    assert.equal(last.seat, 3);
    // В идущей партии доступ не меняют.
    await s.start(host.code, host.token);
    await assert.rejects(() => s.setRoomPrivacy(host.code, host.token, true), /до начала/);
  });

  it("setPassword: хост задаёт пароль в лобби, гость входит только с новым", async () => {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 3,
      botSeats: 0,
      difficulty: "normal",
      isPrivate: true,
      password: "1234",
    });
    const g = await s.join({ code: host.code, name: "Боря", password: "1234" });
    assert.equal(g.seat, 1);
    // Не-хост пароль не меняет.
    await assert.rejects(() => s.setPassword(host.code, g.token, "5678"), /хост/);
    // Хост задаёт произвольный пароль — он же приходит в кадре хоста.
    assert.deepEqual(await s.setPassword(host.code, host.token, "5678"), { password: "5678" });
    assert.equal((await s.rejoin(host.code, host.token)).room.password, "5678");
    // Старый пароль больше не работает, новый пускает.
    await assert.rejects(
      () => s.join({ code: host.code, name: "Вася", password: "1234" }),
      (e: unknown) => e instanceof NetError && e.code === "password-wrong",
    );
    const v = await s.join({ code: host.code, name: "Вася", password: "5678" });
    assert.equal(v.seat, 2);
    // Формат — ровно 4 цифры; неверный формат пароль не меняет.
    await assert.rejects(() => s.setPassword(host.code, host.token, "12"), /4 цифры/);
    await assert.rejects(() => s.setPassword(host.code, host.token, "abcd"), /4 цифры/);
    await assert.rejects(() => s.setPassword(host.code, "чужой-токен-123456", "4321"), NetError);
    assert.equal((await s.rejoin(host.code, host.token)).room.password, "5678");
  });

  it("setPassword: в идущей партии отказ", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    await s.start(host.code, host.token);
    await assert.rejects(() => s.setPassword(host.code, host.token, "4321"), /до начала/);
  });

  it("setPasswordInput принимает только 4 цифры", () => {
    const base = { code: "ABCD", token: "x".repeat(10) };
    assert.equal(setPasswordInput.safeParse({ ...base, password: "0000" }).success, true);
    assert.equal(setPasswordInput.safeParse({ ...base, password: "123" }).success, false);
    assert.equal(setPasswordInput.safeParse({ ...base, password: "12345" }).success, false);
    assert.equal(setPasswordInput.safeParse({ ...base, password: "12a4" }).success, false);
  });

  it("приватный стол виден в списке как закрытый, а вход — по паролю", async () => {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 2,
      botSeats: 0,
      difficulty: "normal",
      isPrivate: true,
      password: "7777",
    });
    assert.equal(host.password, "7777", "заданный пароль сохраняется");
    const own = (await s.listRooms()).find((r) => r.code === host.code)!;
    assert.ok(own, "закрытый стол виден в списке — меню показывает колонку «Закрытые»");
    assert.equal(own.isPrivate, true);
    // Пароль в строку списка не попадает ни при каких условиях.
    assert.equal(JSON.stringify(own).includes("7777"), false, "пароль не должен утекать в список");
    assert.equal("password" in own, false, "поля password в строке списка нет");
    // И вход по-прежнему только с паролем.
    await assert.rejects(
      () => s.join({ code: host.code, name: "Боря" }),
      (e: unknown) => e instanceof NetError && e.code === "password-required",
    );
    const g = await s.join({ code: host.code, name: "Боря", password: "7777" });
    assert.equal(g.seat, 1);
  });
});

describe("список столов", () => {
  it("отдаёт живые лобби и партии (включая закрытые), без токенов и паролей", async () => {
    const s = svc();
    const pub = await s.create({ name: "Аня", capacity: 3, botSeats: 1, difficulty: "normal" });
    const priv = await s.create({
      name: "Пётр",
      capacity: 3,
      botSeats: 0,
      difficulty: "normal",
      isPrivate: true,
      password: "1234",
    });
    const rooms = await s.listRooms();
    const own = rooms.find((r) => r.code === pub.code)!;
    assert.ok(own, "публичный стол обязан быть в списке");
    const closed = rooms.find((r) => r.code === priv.code);
    assert.ok(closed, "закрытый стол тоже в списке — меню делит их по колонкам");
    assert.equal(closed.isPrivate, true);
    assert.equal(own.isPrivate, false);
    assert.equal(own.status, "lobby");
    assert.equal(own.capacity, 3);
    assert.equal(own.taken, 2, "человек и бот считаются занятыми местами");
    assert.equal(own.free, 1);
    assert.equal(own.hostName, "Аня");
    assert.equal(own.createdAt > 0, true);
    // Никаких токенов и паролей: состав полей жёстко зафиксирован.
    assert.deepEqual(Object.keys(own).sort(), [
      "capacity",
      "code",
      "createdAt",
      "difficulty",
      "free",
      "hostName",
      "isPrivate",
      "modules",
      "status",
      "taken",
    ]);
    const json = JSON.stringify(rooms);
    assert.equal(json.includes(pub.token), false, "токен места не должен утекать в список");
    assert.equal(json.includes(priv.token), false);
    assert.equal(json.includes("1234"), false, "пароль закрытого стола не должен утекать в список");
  });

  it("идущая партия видна со статусом playing и модулями", async () => {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 2,
      botSeats: 1,
      difficulty: "hard",
      modules: { plants: true },
    });
    await s.start(host.code, host.token);
    const own = (await s.listRooms()).find((r) => r.code === host.code)!;
    assert.equal(own.status, "playing");
    assert.equal(own.difficulty, "hard");
    assert.deepEqual(own.modules, ["plants"]);
    assert.equal(own.free, 0);
    assert.equal(own.taken, 2);
  });
});

describe("цвета игроков", () => {
  it("цвет места: случайный у людей, детерминированный у ботов, публичный", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 3, botSeats: 1, difficulty: "normal" });
    const snap = await s.rejoin(host.code, host.token);
    const hostSeat = snap.seats.find((x) => x.seat === 0)!;
    const botSeat = snap.seats.find((x) => x.isAI)!;
    assert.ok((PLAYER_COLORS as readonly string[]).includes(hostSeat.color));
    assert.equal(botSeat.color, PLAYER_COLORS[botSeat.seat % PLAYER_COLORS.length]);
    const g = await s.join({ code: host.code, name: "Боря" });
    const after = await s.rejoin(host.code, host.token);
    assert.ok(
      (PLAYER_COLORS as readonly string[]).includes(
        after.seats.find((x) => x.seat === g.seat)!.color,
      ),
    );
    // Цвет — публичная информация: он есть и в кадре зрителя, маскировать нечего.
    const { token } = await s.spectate(host.code, "Зоя");
    const view = await s.spectatorPoll(host.code, token);
    assert.equal(
      view.seats.every((x) => typeof x.color === "string" && x.color.length > 0),
      true,
    );
  });

  it("setColor: своё место и только лобби; чужая палитра отклоняется", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    const before = (await s.rejoin(host.code, host.token)).seats.find((x) => x.seat === 0)!.color;
    const want = PLAYER_COLORS.find((c) => c !== before)!;
    const r = await s.setColor(host.code, host.token, want);
    assert.equal(r.color, want);
    assert.equal(
      (await s.rejoin(host.code, host.token)).seats.find((x) => x.seat === 0)!.color,
      want,
    );
    // Чужой токен и цвет вне палитры — отказ, цвет не меняется.
    await assert.rejects(
      () => s.setColor(host.code, "чужой-токен-123456", PLAYER_COLORS[0]),
      (e: unknown) => e instanceof NetError,
    );
    await assert.rejects(() => s.setColor(host.code, g.token, "#000000"), NetError);
    assert.equal(
      (await s.rejoin(host.code, host.token)).seats.find((x) => x.seat === g.seat)!.color !==
        "#000000",
      true,
    );
    // Цвет меняют до старта: в идущей партии — отказ.
    await s.start(host.code, host.token);
    await assert.rejects(() => s.setColor(host.code, g.token, PLAYER_COLORS[1]), /до начала/);
  });

  it("палитра: 8 различимых семейств с контрастом ≥ 4.5:1 на подложке места", () => {
    // Страж подбора (M3): цвета различаются по тону и светлоте, а сам цвет
    // читается как текст поверх подложки места — `color-mix(in oklab,
    // <цвет> 12%, var(--color-surface))` (см. seatTint в game-app).
    const surface = "#1c2119"; // --color-surface из src/styles.css
    const toRgb = (hex: string): [number, number, number] => {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const toLinear = (v: number): number => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const fromLinear = (c: number): number =>
      255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
    const luminance = (hex: string): number => {
      const [r, g, b] = toRgb(hex).map(toLinear) as [number, number, number];
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a: string, b: string): number => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
      return (hi + 0.05) / (lo + 0.05);
    };
    // OKLab — тот же аппарат, что у CSS color-mix(in oklab, …).
    const toOklab = (hex: string): [number, number, number] => {
      const [r, g, b] = toRgb(hex).map(toLinear) as [number, number, number];
      const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
      ];
    };
    const oklabToHex = ([L, a, b]: [number, number, number]): string => {
      const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
      const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
      const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
      const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
      const hex = (v: number) => clamp(v).toString(16).padStart(2, "0");
      return (
        "#" +
        hex(fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)) +
        hex(fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)) +
        hex(fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s))
      );
    };
    /** Подложка места: 12% цвета, смешанные с surface в OKLab (как браузер). */
    const seatTint = (hex: string): string => {
      const a = toOklab(hex);
      const b = toOklab(surface);
      return oklabToHex([
        a[0] * 0.12 + b[0] * 0.88,
        a[1] * 0.12 + b[1] * 0.88,
        a[2] * 0.12 + b[2] * 0.88,
      ]);
    };

    assert.equal(PLAYER_COLORS.length, 8);
    assert.equal(new Set(PLAYER_COLORS).size, 8, "цвета не должны повторяться");
    for (const color of PLAYER_COLORS) {
      assert.ok(contrast(color, surface) >= 5, `${color}: контраст на --color-surface`);
      assert.ok(contrast(color, seatTint(color)) >= 4.5, `${color}: контраст на подложке места`);
    }
    // Различимость: ближайшая пара в OKLab не должна сливаться (≈2 JND и выше).
    let min = Number.POSITIVE_INFINITY;
    for (let i = 0; i < PLAYER_COLORS.length; i++) {
      for (let j = i + 1; j < PLAYER_COLORS.length; j++) {
        const a = toOklab(PLAYER_COLORS[i]!);
        const b = toOklab(PLAYER_COLORS[j]!);
        min = Math.min(min, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
      }
    }
    assert.ok(min >= 0.05, `ближайшая пара палитры слишком похожа: ${min.toFixed(3)}`);
  });
});

describe("кэш сервиса комнат", () => {
  it("объект без новых методов считается устаревшим (s.setName is not a function)", () => {
    const s = svc();
    assert.equal(_internals.hasServiceMethods(s), true);
    // Так выглядел сервис из прошлой версии модуля после HMR: методы есть,
    // а новых (listRooms/setColor) нет — его нельзя отдавать клиенту.
    const stale: Record<string, unknown> = { ...s };
    delete stale.listRooms;
    delete stale.setColor;
    assert.equal(_internals.hasServiceMethods(stale as unknown as typeof s), false);
  });
});

// ── M16/S1…S11: закрытые находки аудита ─────────────────────────────────────

/** Животное для ручных раскладов (те же поля, что в M6-тестах). */
function testAnimal(id: string, ownerId: number, patch: Partial<Animal> = {}): Animal {
  return {
    id,
    ownerId,
    cardId: "c1",
    traits: [],
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: 1,
    ...patch,
  };
}

describe("S1: чужой стол по произвольному токену", () => {
  it("waiterInfo отдаёт кадр только участнику; произвольный токен — отказ", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const waiter = await s.join({ code: host.code, name: "Вася" });
    assert.equal(waiter.waiting, true, "мест нет — гость в очереди");
    await s.chat(host.code, host.token, "секрет стола");
    // Произвольный токен, валидный по форме (мин. 10 символов) — отказано.
    for (const bogus of ["0".repeat(32), "произвольный-токен-123456"]) {
      await assert.rejects(
        () => s.waiterInfo(host.code, bogus),
        (e: unknown) => e instanceof NetError && e.code === "seat-taken",
        `токен ${bogus.slice(0, 8)}… не должен видеть стол`,
      );
    }
    // Приватный стол по чужому токену — тот же отказ (пароль не при чём).
    const priv = await s.create({
      name: "Пётр",
      capacity: 2,
      botSeats: 1,
      difficulty: "normal",
      isPrivate: true,
      password: "1234",
    });
    await assert.rejects(
      () => s.waiterInfo(priv.code, "x".repeat(32)),
      (e: unknown) => e instanceof NetError && e.code === "seat-taken",
    );
    // Настоящие участники видят кадр как раньше: место, очередь, зритель.
    assert.equal((await s.waiterInfo(host.code, host.token)).room.code, host.code);
    const queued = await s.waiterInfo(host.code, waiter.token);
    assert.equal(queued.queued, true);
    assert.equal(queued.position, 1);
    assert.equal(
      queued.chat.some((m) => m.text === "секрет стола"),
      true,
      "ожидающий видит переписку своего стола",
    );
    const { token: spec } = await s.spectate(host.code, "Зоя");
    assert.equal((await s.waiterInfo(host.code, spec)).room.code, host.code);
    // Кикнутый получает свой машиночитаемый код, а не общий отказ.
    await s.kickWaiter(host.code, host.token, 0);
    await assert.rejects(
      () => s.waiterInfo(host.code, waiter.token),
      (e: unknown) => e instanceof NetError && e.code === "kicked",
    );
  });
});

describe("S2: перебор пароля и генерация кода", () => {
  it("после 10 неудач источник блокируется, верный пароль в пределах лимита работает", async () => {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 3,
      botSeats: 0,
      difficulty: "normal",
      isPrivate: true,
      password: "1234",
    });
    const src = "10.0.0.7";
    // 9 неудач: отказ по паролю, но не по лимиту.
    for (let i = 0; i < 9; i++) {
      await assert.rejects(
        () => s.join({ code: host.code, name: `Гость${i}`, password: "0000" }, src),
        (e: unknown) => e instanceof NetError && e.code === "password-wrong",
      );
    }
    // Верный пароль ещё проходит — лимит не «съедает» легитимный вход.
    const g = await s.join({ code: host.code, name: "Боря", password: "1234" }, src);
    assert.equal(g.seat, 1);
    // Десятая неудача закрывает окно для этого кода+источника.
    await assert.rejects(
      () => s.join({ code: host.code, name: "Вася", password: "9999" }, src),
      (e: unknown) => e instanceof NetError && e.code === "password-wrong",
    );
    await assert.rejects(
      () => s.join({ code: host.code, name: "Гена", password: "1234" }, src),
      /Слишком много попыток/,
      "после лимита не пускает даже с верным паролем",
    );
    // Другой источник не заблокирован.
    const other = await s.join({ code: host.code, name: "Дима", password: "1234" }, "10.0.0.8");
    assert.equal(other.seat, 2);
    // Окно истекает — источник снова работает.
    fixedNow += 5 * 60 * 1000 + 1;
    const later = await s.join({ code: host.code, name: "Егор", password: "1234" }, src);
    assert.equal(later.waiting, true, "мест нет — легитимный вход снова доходит до очереди");
  });

  it("rejoin с чужими токенами тоже ограничен по коду+источнику", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const src = "10.0.0.9";
    for (let i = 0; i < 10; i++) {
      await assert.rejects(
        () => s.rejoin(host.code, `чужой-токен-${i}${"0".repeat(10)}`, src),
        (e: unknown) => e instanceof NetError && e.code === "seat-taken",
      );
    }
    await assert.rejects(
      () => s.rejoin(host.code, "чужой-токен-1234567", src),
      /Слишком много попыток/,
    );
    // Настоящий токен с другого источника работает.
    const snap = await s.rejoin(host.code, host.token, "10.0.0.10");
    assert.equal(snap.room.code, host.code);
  });

  it("код стола не зависит от Math.random (crypto.getRandomValues)", async () => {
    const s = svc();
    const real = Math.random;
    Math.random = () => 0.42;
    try {
      const codes = new Set<string>();
      for (let i = 0; i < 8; i++) {
        const r = await s.create({ name: `Хост${i}`, capacity: 2, botSeats: 1, difficulty: "normal" });
        assert.match(r.code, /^[ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/);
        codes.add(r.code);
      }
      assert.ok(
        codes.size > 1,
        "при фиксированном Math.random коды обязаны различаться — их выдаёт crypto",
      );
    } finally {
      Math.random = real;
    }
  });
});

describe("S4: канонизация легального действия", () => {
  /** Стол с ручным раскладом: ход первого места в фазе питания. */
  async function feedingTable() {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 2,
      botSeats: 0,
      difficulty: "normal",
      modules: { continents: true, fungi: true },
    });
    const g = await s.join({ code: host.code, name: "Боря" });
    await s.start(host.code, host.token);
    const room = await _internals.readRoom(sql, host.code);
    const st = structuredClone(room!.state!);
    st.phase = "feeding";
    st.pendingAttack = null;
    st.rageTurn = undefined;
    st.currentPlayerId = 0;
    st.humanId = 0;
    st.turnTerritory = undefined;
    st.turnUse = {
      carnivores: [],
      pirates: [],
      grazers: [],
      foodTaken: false,
      combatUsed: false,
      sheltered: false,
      migrated: false,
      hibernated: [],
    };
    st.foodBank = 0;
    st.territoryFood = { laurasia: 0, gondwana: 0, ocean: 0 };
    st.plants = [];
    st.flora = [];
    st.players[0]!.animals = [testAnimal("a-1", 0, { fatTokens: 3, zoneId: "laurasia" })];
    st.players[1]!.animals = [];
    await _internals.casUpdate(sql, host.code, room!.version, { state: st });
    return { s, host, g };
  }

  it("feedConvertFat: завышенный amount отклоняется, легальный даёт min(fat, need)", async () => {
    const { s, host } = await feedingTable();
    // Легально: жира 3, потребность вида 1 → amount = 1. Присланный amount=3
    // раньше применялся как есть и конвертировал весь жир.
    await assert.rejects(
      () => s.action(host.code, host.token, { type: "feedConvertFat", animalId: "a-1", amount: 3 }),
      /недопустим/,
    );
    let st = (await _internals.readRoom(sql, host.code))!.state!;
    assert.equal(st.players[0]!.animals[0]!.fatTokens, 3, "отклонённый ход не должен менять жир");
    assert.equal(st.players[0]!.animals[0]!.food, 0);
    // Канонический ход применяется: ровно min(fat, need) = 1.
    await s.action(host.code, host.token, { type: "feedConvertFat", animalId: "a-1", amount: 1 });
    st = (await _internals.readRoom(sql, host.code))!.state!;
    assert.equal(st.players[0]!.animals[0]!.fatTokens, 2);
    assert.equal(st.players[0]!.animals[0]!.food, 1);
  });

  it("feedGraze: чужой/незаселённый floraId отклоняется, свой — работает (зональный гейт)", async () => {
    const { s, host } = await feedingTable();
    const room = await _internals.readRoom(sql, host.code);
    const st = structuredClone(room!.state!);
    st.modules.fungi = true;
    st.modules.continents = true;
    // Ход привязан к Лавразии: топтать можно только её флору.
    st.turnTerritory = "laurasia";
    st.flora = [
      { id: "fl-lau", kind: "toadstool", food: 1, zoneId: "laurasia", playSeq: 1 },
      { id: "fl-gon", kind: "toadstool", food: 1, zoneId: "gondwana", playSeq: 2 },
    ];
    st.players[0]!.animals = [
      testAnimal("a-1", 0, {
        zoneId: "laurasia",
        traits: [{ id: "t-1", cardId: "c1", type: "grazing", hidden: false, playSeq: 1 }],
      }),
    ];
    await _internals.casUpdate(sql, host.code, room!.version, { state: st });
    // Подставленная флора из чужой зоны: в легальном списке только fl-lau.
    await assert.rejects(
      () =>
        s.action(host.code, host.token, {
          type: "feedGraze",
          animalId: "a-1",
          floraId: "fl-gon",
        }),
      /недопустим/,
    );
    let after = (await _internals.readRoom(sql, host.code))!.state!;
    assert.equal(after.flora!.find((f) => f.id === "fl-gon")!.food, 1, "чужую флору не топчут");
    // Своя флора — как раньше: фишка уничтожена.
    await s.action(host.code, host.token, {
      type: "feedGraze",
      animalId: "a-1",
      floraId: "fl-lau",
    });
    after = (await _internals.readRoom(sql, host.code))!.state!;
    assert.equal(after.flora!.find((f) => f.id === "fl-lau")!.food, 0);
    assert.deepEqual(after.turnUse.grazers, ["a-1"]);
  });

  it("reorderAnimal вне своего хода отвечает понятной причиной", async () => {
    const { s, host, g } = await feedingTable();
    const room = await _internals.readRoom(sql, host.code);
    const st = structuredClone(room!.state!);
    st.phase = "development";
    st.currentPlayerId = 0;
    st.players[0]!.animals = [testAnimal("a-1", 0)];
    st.players[1]!.animals = [testAnimal("b-1", 1)];
    await _internals.casUpdate(sql, host.code, room!.version, { state: st });
    // Своё животное, но чужой ход: раньше был общий «Такой ход сейчас недопустим».
    await assert.rejects(
      () => s.action(host.code, g.token, { type: "reorderAnimal", animalId: "b-1" }),
      /только в свой ход/,
    );
    // Свой ход, но чужое животное — отдельная причина.
    await assert.rejects(
      () => s.action(host.code, host.token, { type: "reorderAnimal", animalId: "b-1" }),
      /только своих животных/,
    );
    // Своё в свой ход — проходит.
    await s.action(host.code, host.token, { type: "reorderAnimal", animalId: "a-1" });
    assert.equal(
      (await _internals.readRoom(sql, host.code))!.state!.currentPlayerId,
      0,
      "ход не сломался",
    );
  });
});

describe("S5: приватный стол и зрители", () => {
  it("наблюдение закрытого стола без пароля отклоняется, с паролем — работает", async () => {
    const s = svc();
    const host = await s.create({
      name: "Аня",
      capacity: 2,
      botSeats: 0,
      difficulty: "normal",
      isPrivate: true,
      password: "4321",
    });
    await assert.rejects(
      () => s.spectate(host.code, "Зоя"),
      (e: unknown) => e instanceof NetError && e.code === "password-required",
    );
    assert.equal(
      full(await s.poll(host.code, host.token)).spectators.length,
      0,
      "отказ не должен создавать зрителя",
    );
    await assert.rejects(
      () => s.spectate(host.code, "Зоя", "0000"),
      (e: unknown) => e instanceof NetError && e.code === "password-wrong",
    );
    const { token } = await s.spectate(host.code, "Зоя", "4321");
    const view = await s.spectatorPoll(host.code, token);
    assert.equal(view.room.isPrivate, true);
    assert.equal(view.room.password, null, "пароль не утекает даже зрителю с паролем");
    // Открытый стол наблюдается без пароля, как раньше.
    const pub = await s.create({ name: "Боря", capacity: 2, botSeats: 0, difficulty: "normal" });
    const { token: t2 } = await s.spectate(pub.code, "Гость");
    assert.equal((await s.spectatorPoll(pub.code, t2)).room.code, pub.code);
  });
});

describe("S7: лимиты жизненного цикла", () => {
  it("создание столов ограничено на источник (10/час), другой источник не задет", async () => {
    const s = svc();
    const src = "10.1.1.1";
    const created: string[] = [];
    for (let i = 0; i < 10; i++) {
      const r = await s.create(
        { name: `Хозяин${i}`, capacity: 2, botSeats: 1, difficulty: "normal" },
        src,
      );
      created.push(r.code);
    }
    await assert.rejects(
      () =>
        s.create({ name: "Лишний", capacity: 2, botSeats: 1, difficulty: "normal" }, src),
      /Слишком много созданных столов/,
    );
    // Соседний источник создаёт стол без проблем.
    const ok = await s.create(
      { name: "Сосед", capacity: 2, botSeats: 1, difficulty: "normal" },
      "10.1.1.2",
    );
    assert.ok(created.includes(ok.code) === false);
    // Через час окно очищается.
    fixedNow += 60 * 60 * 1000 + 1;
    await s.create({ name: "Позже", capacity: 2, botSeats: 1, difficulty: "normal" }, src);
  });

  it("EVO_CREATE_PER_HOUR поднимает порог для QA, дефолт — прежние 10/час", async () => {
    const s = svc();
    const src = "10.1.1.9";
    process.env.EVO_CREATE_PER_HOUR = "2";
    try {
      await s.create({ name: "QA1", capacity: 2, botSeats: 1, difficulty: "normal" }, src);
      await s.create({ name: "QA2", capacity: 2, botSeats: 1, difficulty: "normal" }, src);
      await assert.rejects(
        () => s.create({ name: "QA3", capacity: 2, botSeats: 1, difficulty: "normal" }, src),
        /Слишком много созданных столов/,
        "переменная окружения должна задавать порог",
      );
    } finally {
      delete process.env.EVO_CREATE_PER_HOUR;
    }
    // Без переменной порог снова 10: три создания того же источника проходят.
    // (Ключ другой: окно первого источника уже исчерпано настройкой выше.)
    for (let i = 0; i < 3; i++) {
      await s.create(
        { name: `Деф${i}`, capacity: 2, botSeats: 1, difficulty: "normal" },
        "10.1.1.10",
      );
    }
  });

  it("вход/наблюдение/переподключение ограничены 30/мин на источник", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const src = "10.2.2.2";
    for (let i = 0; i < 30; i++) {
      await s.spectate(host.code, `Зритель${i}`, undefined, src);
    }
    await assert.rejects(
      () => s.spectate(host.code, "Лишний", undefined, src),
      /Слишком много подключений/,
    );
    // Другой источник работает.
    const { token } = await s.spectate(host.code, "Сосед", undefined, "10.2.2.3");
    assert.ok(token.length >= 10);
    // И сам лимит не мешает уже подключённому зрителю: опрос не лимитируется.
    assert.equal((await s.spectatorPoll(host.code, token)).room.code, host.code);
    // Через минуту окно снова открыто.
    fixedNow += 60_000 + 1;
    await s.spectate(host.code, "Снова", undefined, src);
  });
});

describe("S8: рестарт партии — только хост", () => {
  it("гость получает отказ, хост запускает новую партию", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await s.start(host.code, host.token);
    const room = await _internals.readRoom(sql, host.code);
    await _internals.casUpdate(sql, host.code, room!.version, { status: "finished" });
    await assert.rejects(() => s.again({ code: host.code, token: g.token }), /хост/);
    assert.equal(
      (await s.rejoin(host.code, host.token)).room.status,
      "finished",
      "отказ гостя не сбрасывает финал",
    );
    await s.again({ code: host.code, token: host.token });
    const back = await s.rejoin(host.code, host.token);
    assert.equal(back.room.status, "lobby");
    assert.equal(back.state, null);
  });
});

describe("S10: same-site сторож net-функций", () => {
  it("каждая net-функция объявлена с sameSiteGuard", () => {
    // Реальная проверка требует контекста запроса (AsyncLocalStorage), поэтому
    // здесь структурный страж: без .middleware([sameSiteGuard]) он падает.
    // Сам ответ 403 на кросс-сайтовый POST проверяется вручную (curl).
    const src = readFileSync(fileURLToPath(new URL("./api.ts", import.meta.url)), "utf8");
    const fns = src.match(/createServerFn\(\{ method: "POST" \}\)/g) ?? [];
    const guarded = src.match(
      /createServerFn\(\{ method: "POST" \}\)\s*\r?\n\s*\.middleware\(\[sameSiteGuard\]\)/g,
    );
    assert.ok(fns.length >= 20, `net-функций найдено: ${fns.length}`);
    assert.equal(
      guarded?.length ?? 0,
      fns.length,
      "у каждой net-функции должен быть same-site сторож",
    );
  });
});

describe("S11: код стола — только алфавит комнат", () => {
  it("joinRoomInput пропускает буквы алфавита и отклоняет прочие символы", () => {
    const base = { name: "Аня" };
    assert.equal(joinRoomInput.safeParse({ ...base, code: "ABCD" }).success, true);
    assert.equal(joinRoomInput.safeParse({ ...base, code: " ZXYZ " }).success, true);
    for (const code of ["ab1d", "AB1D", "AB D", "АБВГ", "ABCDE", "AB!D", ""]) {
      assert.equal(
        joinRoomInput.safeParse({ ...base, code }).success,
        false,
        `код «${code}» не должен проходить схему`,
      );
    }
  });
});

// ── M10: авто-конец хода без действий и круговой отсчёт ─────────────────────

/** Животное для ручных раскладов: минимум полей, как в M6-тесте. */
function benchAnimal(id: string, ownerId = 0): Animal {
  return {
    id,
    ownerId,
    cardId: "c1",
    no: 1,
    traits: [],
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: 1,
  };
}

/** Ручной расклад: питание, ход человека (место 0), чистая метка хода. */
function feedingForHuman(
  base: GameState,
  opts: { animal: boolean; foodBank: number },
): GameState {
  const st = structuredClone(base);
  st.phase = "feeding";
  st.pendingAttack = null;
  st.madTurn = undefined;
  st.rageTurn = null;
  st.currentPlayerId = 0;
  st.turnTerritory = undefined;
  st.foodBank = opts.foodBank;
  if (st.modules.continents) {
    st.territoryFood = { laurasia: opts.foodBank, gondwana: 0, ocean: 0 };
  }
  st.turnUse = {
    carnivores: [],
    pirates: [],
    grazers: [],
    foodTaken: false,
    combatUsed: false,
    migrated: false,
    sheltered: false,
    hibernated: [],
  };
  for (const p of st.players) p.passedFeed = false;
  st.players[0]!.animals = opts.animal ? [benchAnimal("m10-prey", 0)] : [];
  return st;
}

describe("M10: ход человека без действий закрывается сам", () => {
  it("noChoicesLeft: только пас/завершение — да; любое действие — нет", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 1, difficulty: "normal" });
    const base = (await s.start(host.code, host.token)).state!;

    // Питание: ни еды, ни животных — остались только «закончить ход»/«пас».
    const idle = feedingForHuman(base, { animal: false, foodBank: 0 });
    assert.equal(noChoicesLeft(idle, idle.players[0]!), true, "пустой ход — таймер нужен");
    // Появилась еда и голодное животное — действие есть, таймера быть не должно.
    const busy = feedingForHuman(base, { animal: true, foodBank: 3 });
    assert.equal(noChoicesLeft(busy, busy.players[0]!), false, "есть еда — таймера нет");
    // Бот не в счёт: им двигает собственный автошаг.
    assert.equal(noChoicesLeft(idle, idle.players[1]!), false);
    // Сдавшийся — тоже: за него пасует ветка автошага сдавшихся.
    idle.players[0]!.resigned = true;
    assert.equal(noChoicesLeft(idle, idle.players[0]!), false);
    idle.players[0]!.resigned = false;

    // Развитие: пустая рука — только devPass; карта в руке — есть что играть.
    const devIdle = structuredClone(idle);
    devIdle.phase = "development";
    devIdle.players[0]!.hand = [];
    assert.equal(noChoicesLeft(devIdle, devIdle.players[0]!), true);
    const devBusy = structuredClone(devIdle);
    devBusy.players[0]!.hand = [structuredClone(base.players[0]!.hand[0]!)];
    assert.equal(noChoicesLeft(devBusy, devBusy.players[0]!), false);

    // Защита: единственный вариант «не защищаться» — таймер; свойство-бег
    // даёт выбор, значит, игрок ещё решает сам.
    const def = structuredClone(idle);
    def.players[0]!.animals = [benchAnimal("m10-prey", 0)];
    def.players[1]!.animals = [benchAnimal("m10-pred", 1)];
    def.pendingAttack = {
      carnivoreId: "m10-pred",
      preyId: "m10-prey",
      mimicryChain: [],
      waitingFor: 0,
      usedDefenses: [],
    };
    assert.equal(noChoicesLeft(def, def.players[0]!), true);
    const running = structuredClone(def);
    running.players[0]!.animals[0]!.traits = [
      { id: "t-run", cardId: "c1", type: "running", hidden: false, playSeq: 1 },
    ];
    assert.equal(noChoicesLeft(running, running.players[0]!), false);

    // Шаг за игрока без действий: пас в развитие, отказ в защите, завершение
    // ХОДА (не пас до конца фазы) в питании.
    assert.deepEqual(endTurnStepFor(idle, 0), { type: "feedEndTurn" });
    assert.deepEqual(endTurnStepFor(devIdle, 0), { type: "devPass" });
    assert.deepEqual(endTurnStepFor(def, 0), { type: "chooseDefense", kind: "none" });
    // Сдавшийся пасует до конца фазы — иначе возвращался бы в круг питания.
    const resigned = structuredClone(idle);
    resigned.players[0]!.resigned = true;
    assert.deepEqual(nextAutoStep(resigned), { type: "feedSkip" });
  });

  it("дедлайн виден в кадре, через 30 с ход уходит дальше, метка снимается", async () => {
    const s = svc();
    const host = await s.create({ name: "Аня", capacity: 2, botSeats: 0, difficulty: "normal" });
    const g = await s.join({ code: host.code, name: "Боря" });
    await s.start(host.code, host.token);
    const room = (await _internals.readRoom(sql, host.code))!;
    const idle = feedingForHuman(room.state!, { animal: false, foodBank: 0 });
    assert.equal(await _internals.casUpdate(sql, host.code, room.version, { state: idle }), true);

    // Первый poll планирует авто-конец и отдаёт метку клиентам.
    const planned = full(await s.poll(host.code, host.token));
    assert.equal(planned.turnDeadlineAt, fixedNow + PACE.idleTurnMs);
    assert.equal(planned.serverNow, fixedNow);
    assert.equal(planned.state!.phase, "feeding");
    // Соперник видит ту же метку (индикатор показывается всем за столом).
    assert.equal(full(await s.poll(host.code, g.token)).turnDeadlineAt, planned.turnDeadlineAt);

    // За секунду до срока ход ещё у человека: метка та же, версия та же.
    fixedNow += PACE.idleTurnMs - 1000;
    const waiting = full(await s.poll(host.code, host.token));
    assert.equal(waiting.version, planned.version);
    assert.equal(waiting.turnDeadlineAt, planned.turnDeadlineAt);

    // Срок вышел — сервер сам заканчивает ход, метка снимается.
    fixedNow += 1500;
    const after = full(await s.poll(host.code, host.token));
    assert.ok(after.version > waiting.version, "автошаг должен применить ход");
    assert.equal(after.turnDeadlineAt, null, "после автошага таймера быть не должно");
    const moved =
      after.state!.phase !== "feeding" ||
      after.state!.currentPlayerId !== 0 ||
      after.state!.players[0]!.passedFeed;
    assert.ok(moved, "через 30 с ход должен уйти дальше");
    // Ход человека снова с действиями: метки нет вовсе (и старую сняли).
    const busy = feedingForHuman(after.state!, { animal: true, foodBank: 3 });
    assert.equal(
      await _internals.casUpdate(sql, host.code, (await _internals.readRoom(sql, host.code))!.version, {
        state: busy,
      }),
      true,
    );
    const fresh = full(await s.poll(host.code, host.token));
    assert.equal(fresh.turnDeadlineAt, null);
  });
});
