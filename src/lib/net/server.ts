/**
 * Сервер комнат сетевой «Эволюции»: канонический GameState живёт в БД,
 * клиенты шлют действия и опрашивают состояние. Движок вызывается только
 * здесь — клиент получает персональный вид через viewFor().
 *
 * Конкурентность без транзакций: обёртка БД не отдаёт rowCount, а пул pg
 * не держит транзакцию между запросами, поэтому все записи состояния идут
 * оптимистично — условный UPDATE по version с RETURNING (см. casUpdate).
 */
import {
  applyAction,
  createGame,
  currentActor,
  legalDefenseActions,
  legalDevActions,
  legalFeedActions,
} from "../../game/engine.ts";
import { chooseAIAction } from "../../game/ai.ts";
import type { Difficulty, GameAction, GameState, ModuleId } from "../../game/types.ts";
import type {
  CreateRoomInput,
  PollResult,
  RoomMeta,
  RoomStatus,
  SeatInfo,
  SqlLike,
  UnchangedPoll,
} from "./shared.ts";
import { PACE } from "./shared.ts";
import { viewFor } from "./views.ts";

export class NetError extends Error {}

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";

interface SeatRow {
  seat: number;
  name: string;
  is_ai: boolean;
  last_seen_at: unknown;
}

interface RoomRow {
  code: string;
  status: RoomStatus;
  capacity: number;
  difficulty: Difficulty;
  modules: Partial<Record<ModuleId, boolean>> | null;
  version: number;
  state: GameState | null;
  auto_step_at: unknown;
  created_at: unknown;
}

function makeCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return s;
}

function makeToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function toMs(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  const t = Date.parse(String(v));
  return Number.isNaN(t) ? 0 : t;
}

function isUniqueViolation(e: unknown): boolean {
  return String((e as { code?: string }).code) === "23505";
}

async function readRoom(sql: SqlLike, code: string): Promise<RoomRow | null> {
  const rows = await sql.query<Omit<RoomRow, "state"> & { state_json: unknown }>(
    `select code, status, capacity, difficulty, modules, version, state as state_json,
            auto_step_at, created_at
       from evo_rooms where code = $1`,
    [code],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    ...r,
    status: r.status as RoomStatus,
    difficulty: r.difficulty as Difficulty,
    modules: (r.modules as Partial<Record<ModuleId, boolean>> | null) ?? {},
    state: (r.state_json as GameState | null) ?? null,
  };
}

async function readSeats(sql: SqlLike, code: string): Promise<SeatRow[]> {
  return sql.query<SeatRow>(
    `select seat, name, is_ai, last_seen_at
       from evo_seats where room_code = $1 order by seat`,
    [code],
  );
}

/** Хост вычисляется, а не хранится: минимальное место среди людей онлайн. */
function metaOf(room: RoomRow, seats: SeatRow[], now: () => number): RoomMeta {
  const onlineHumans = seats.filter(
    (s) => !s.is_ai && now() - toMs(s.last_seen_at) < PACE.onlineMs,
  );
  const humans = seats.filter((s) => !s.is_ai).map((s) => s.seat);
  const hostSeat = onlineHumans.length
    ? Math.min(...onlineHumans.map((s) => s.seat))
    : humans.length
      ? Math.min(...humans)
      : 0;
  return { code: room.code, status: room.status, capacity: room.capacity, hostSeat };
}

function seatsInfo(seats: SeatRow[], now: () => number): SeatInfo[] {
  return seats.map((s) => ({
    seat: s.seat,
    name: s.name,
    isAI: s.is_ai,
    online: now() - toMs(s.last_seen_at) < PACE.onlineMs,
  }));
}

/**
 * Условная запись состояния: применяется только если версия не сменилась.
 * Возвращает true при успехе (ровно одна строка обновлена).
 */
async function casUpdate(
  sql: SqlLike,
  code: string,
  version: number,
  fields: { state?: GameState | null; status?: RoomStatus; autoStepAt?: number | null },
): Promise<boolean> {
  const set: string[] = ["version = version + 1", "updated_at = now()"];
  const params: unknown[] = [];
  const push = (clause: string, value: unknown, cast = "") => {
    params.push(value);
    set.push(`${clause} $${params.length}${cast}`);
  };
  if (fields.state !== undefined) push("state =", JSON.stringify(fields.state), "::jsonb");
  if (fields.status !== undefined) push("status =", fields.status);
  if (fields.autoStepAt !== undefined) {
    push("auto_step_at =", fields.autoStepAt === null ? null : new Date(fields.autoStepAt).toISOString());
  }
  params.push(code, version);
  const rows = await sql.query<{ version: number }>(
    `update evo_rooms set ${set.join(", ")}
      where code = $${params.length - 1} and version = $${params.length}
      returning version`,
    params,
  );
  return rows.length === 1;
}

/** Повторяет casUpdate на свежей версии; бросает при исчерпании попыток. */
async function casUpdateStrict(
  sql: SqlLike,
  code: string,
  version: number,
  fields: Parameters<typeof casUpdate>[3],
): Promise<void> {
  let v = version;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await casUpdate(sql, code, v, fields)) return;
    const fresh = await readRoom(sql, code);
    if (!fresh) throw new NetError("Стол не найден");
    v = fresh.version;
  }
  throw new NetError("Стол изменился, попробуйте ещё раз");
}

async function janitor(sql: SqlLike): Promise<void> {
  await sql.query(
    `delete from evo_seats where room_code in
       (select code from evo_rooms where created_at < now() - interval '12 hours')`,
  );
  await sql.query(`delete from evo_rooms where created_at < now() - interval '12 hours'`);
}

// ── автошаги: боты и автоматические фазы ───────────────────────────────────

/** Следующий шаг, который сервер делает сам; null — ждём ход человека. */
export function nextAutoStep(state: GameState): GameAction | null {
  if (state.phase === "foodBank") {
    return state.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" };
  }
  if (state.phase === "extinction") return { type: "continueExtinction" };
  const actor = currentActor(state);
  if (!actor || !actor.isAI) return null;
  const pick = chooseAIAction(state);
  if (pick) return pick;
  // Страховка от зависания: у бота всегда есть пас/скип/сдаться.
  return state.phase === "development"
    ? { type: "devPass" }
    : state.pendingAttack
      ? { type: "chooseDefense", kind: "none" }
      : { type: "feedSkip" };
}

function stepDelay(before: GameState, step: GameAction, after: GameState): number {
  const j = () => Math.round((Math.random() * 2 - 1) * PACE.jitterMs);
  if (step.type === "rollFoodBank") return PACE.diceMs + j();
  if (step.type === "continueExtinction") return PACE.extinctMs + j();
  const changedTurn = before.currentPlayerId !== after.currentPlayerId;
  return PACE.botMs + (changedTurn ? PACE.turnGapMs : 0) + j();
}

// ── проверка присланного действия против легального списка ─────────────────

const ID_KEYS = [
  "cardId",
  "face",
  "animalId",
  "a",
  "b",
  "carnivoreId",
  "preyId",
  "pirateId",
  "targetId",
] as const;

function sameAction(a: GameAction, b: GameAction): boolean {
  if (a.type !== b.type) return false;
  for (const k of ID_KEYS) {
    const av = (a as Record<string, unknown>)[k];
    if (av !== undefined && av !== (b as Record<string, unknown>)[k]) return false;
  }
  if (a.type === "chooseDefense") {
    const bb = b as typeof a;
    return (
      a.kind === bb.kind &&
      a.mimicryTargetId === bb.mimicryTargetId &&
      a.discardTraitId === bb.discardTraitId
    );
  }
  return true;
}

// ── фабрика сервиса ─────────────────────────────────────────────────────────

export interface RoomService {
  create(input: CreateRoomInput): Promise<{ code: string; seat: number; token: string }>;
  join(input: { code: string; name: string }): Promise<{ seat: number; token: string }>;
  setBots(input: { code: string; token: string; count: number }): Promise<void>;
  rejoin(code: string, token: string): Promise<PollResult>;
  start(code: string, token: string): Promise<PollResult>;
  action(code: string, token: string, action: GameAction): Promise<PollResult>;
  poll(code: string, token: string, sinceVersion?: number): Promise<PollResult | UnchangedPoll>;
  again(input: { code: string; token: string }): Promise<void>;
}

export function createRoomService(
  sql: SqlLike,
  opts: { now?: () => number } = {},
): RoomService {
  const now = opts.now ?? (() => Date.now());

  async function requireRoom(code: string): Promise<RoomRow> {
    const room = await readRoom(sql, code);
    if (!room) throw new NetError("Стол не найден — проверьте код");
    return room;
  }

  async function seatByToken(code: string, token: string): Promise<SeatRow> {
    const rows = await sql.query<SeatRow>(
      `select seat, name, is_ai, last_seen_at from evo_seats
        where room_code = $1 and token = $2`,
      [code, token],
    );
    const seat = rows[0];
    if (!seat) throw new NetError("Место не найдено — вернитесь в меню и зайдите заново");
    return seat;
  }

  async function insertBots(code: string, capacity: number, count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      const seatNo = capacity - count + i;
      await sql.query(
        `insert into evo_seats (room_code, seat, name, token, is_ai)
         values ($1, $2, $3, '', true) on conflict do nothing`,
        [code, seatNo, `Бот ${i + 1}`],
      );
    }
  }

  async function advance(code: string): Promise<void> {
    for (let i = 0; i < PACE.maxStepsPerTick; i++) {
      const room = await readRoom(sql, code);
      if (!room?.state || room.status !== "playing") return;
      const before = room.state;
      const step = nextAutoStep(before);
      if (!step) {
        // Ход человека: таймер авточагов больше не нужен.
        if (room.auto_step_at !== null) {
          await casUpdate(sql, code, room.version, { autoStepAt: null }).catch(() => false);
        }
        return;
      }
      const due = room.auto_step_at === null ? 0 : toMs(room.auto_step_at);
      if (due - now() > 0) return; // ещё рано — темп держит auto_step_at
      const after = applyAction(before, step);
      const finished = after.phase === "gameOver";
      const ok = await casUpdate(sql, code, room.version, {
        state: after,
        status: finished ? "finished" : undefined,
        autoStepAt: finished ? null : now() + stepDelay(before, step, after),
      });
      if (!ok) return; // обогнали — следующий запрос доведёт
      if (finished) return;
    }
  }

  async function snapshot(code: string, seat: number): Promise<PollResult> {
    const [room, seats] = await Promise.all([readRoom(sql, code), readSeats(sql, code)]);
    if (!room) throw new NetError("Стол не найден — проверьте код");
    return {
      version: room.version,
      room: metaOf(room, seats, now),
      seats: seatsInfo(seats, now),
      seat,
      state:
        room.state && room.status !== "lobby" ? viewFor(room.state, seat) : null,
    };
  }

  const service: RoomService = {
    async create(input) {
      const token = makeToken();
      for (let attempt = 0; attempt < 6; attempt++) {
        const code = makeCode();
        try {
          await sql.query(
            `insert into evo_rooms (code, capacity, difficulty, seed, modules)
             values ($1, $2, $3, $4, $5::jsonb)`,
            [
              code,
              input.capacity,
              input.difficulty,
              Math.floor(Math.random() * 1_000_000),
              JSON.stringify(input.modules ?? {}),
            ],
          );
          await sql.query(
            `insert into evo_seats (room_code, seat, name, token)
             values ($1, 0, $2, $3)`,
            [code, input.name, token],
          );
          if (input.botSeats > 0) await insertBots(code, input.capacity, input.botSeats);
          return { code, seat: 0, token };
        } catch (e) {
          if (!isUniqueViolation(e)) throw e;
        }
      }
      throw new NetError("Не удалось выдать код стола — попробуйте ещё раз");
    },

    async join({ code, name }) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const room = await requireRoom(code);
        if (room.status !== "lobby") throw new NetError("Партия уже началась");
        const seats = await readSeats(sql, code);
        const taken = new Set(seats.map((s) => s.seat));
        let free = -1;
        for (let i = 0; i < room.capacity; i++) {
          if (!taken.has(i)) {
            free = i;
            break;
          }
        }
        if (free < 0) throw new NetError("Мест не осталось");
        const token = makeToken();
        const inserted = await sql.query<{ seat: number }>(
          `insert into evo_seats (room_code, seat, name, token)
           values ($1, $2, $3, $4)
           on conflict (room_code, seat) do nothing
           returning seat`,
          [code, free, name, token],
        );
        if (inserted.length === 1) return { seat: free, token };
        // Место заняли между чтением и вставкой — перечитываем.
      }
      throw new NetError("Не удалось занять место — попробуйте ещё раз");
    },

    async setBots({ code, token, count }) {
      const room = await requireRoom(code);
      const me = await seatByToken(code, token);
      const seats = await readSeats(sql, code);
      if (metaOf(room, seats, now).hostSeat !== me.seat) {
        throw new NetError("Ботов добавляет хост");
      }
      if (room.status !== "lobby") throw new NetError("Партия уже началась");
      const humans = seats.filter((s) => !s.is_ai).length;
      const clamped = Math.max(0, Math.min(count, room.capacity - humans));
      await sql.query(`delete from evo_seats where room_code = $1 and is_ai`, [code]);
      if (clamped > 0) await insertBots(code, room.capacity, clamped);
    },

    async rejoin(code, token) {
      const me = await seatByToken(code, token);
      const room = await requireRoom(code);
      const seats = await readSeats(sql, code);
      return {
        version: room.version,
        room: metaOf(room, seats, now),
        seats: seatsInfo(seats, now),
        seat: me.seat,
        state: room.state && room.status !== "lobby" ? viewFor(room.state, me.seat) : null,
      };
    },

    async start(code, token) {
      const room = await requireRoom(code);
      const me = await seatByToken(code, token);
      const seats = await readSeats(sql, code);
      if (metaOf(room, seats, now).hostSeat !== me.seat) {
        throw new NetError("Начать партию может хост");
      }
      if (room.status !== "lobby") throw new NetError("Партия уже началась");
      if (seats.length !== room.capacity) {
        throw new NetError("Заполните все места — людьми или ботами");
      }
      const defs = seats.map((s) => ({ name: s.name, isAI: s.is_ai }));
      const state = createGame(
        room.capacity,
        room.difficulty,
        Math.floor(Math.random() * 1_000_000),
        defs,
        room.modules ?? {},
      );
      await casUpdateStrict(sql, code, room.version, {
        state,
        status: "playing",
        autoStepAt: now() + PACE.initialMs,
      });
      return snapshot(code, me.seat);
    },

    async action(code, token, sent) {
      const room = await requireRoom(code);
      const me = await seatByToken(code, token);
      if (room.status !== "playing" || !room.state) throw new NetError("Партия не идёт");
      const st = room.state;
      const allowed =
        st.pendingAttack && st.pendingAttack.waitingFor === me.seat
          ? legalDefenseActions(st, me.seat)
          : st.phase === "development"
            ? legalDevActions(st, me.seat)
            : st.phase === "feeding"
              ? legalFeedActions(st, me.seat)
              : [];
      if (!allowed.some((a) => sameAction(a, sent))) {
        throw new NetError("Такой ход сейчас недопустим");
      }
      // grazeIds/amount и прочее валидирует сам движок; identity сверена выше.
      const next = applyAction(st, sent);
      const finished = next.phase === "gameOver";
      const needsAuto = !finished && nextAutoStep(next) !== null;
      await casUpdateStrict(sql, code, room.version, {
        state: next,
        status: finished ? "finished" : undefined,
        // Таймер нужен только когда дальше идёт бот/автофаза; иначе лишний
        // пустой тик делал бы второй инкремент версии без события.
        autoStepAt: needsAuto ? now() : null,
      });
      await advance(code);
      return snapshot(code, me.seat);
    },

    async poll(code, token, sinceVersion) {
      if (Math.random() < 0.05) await janitor(sql).catch(() => {});
      const me = await seatByToken(code, token);
      // Метка присутствия до advance: свои же авточаги видят свежий онлайн.
      await sql
        .query(`update evo_seats set last_seen_at = now() where room_code = $1 and seat = $2`, [
          code,
          me.seat,
        ])
        .catch(() => {});
      await advance(code);
      const room = await readRoom(sql, code);
      if (!room) throw new NetError("Стол не найден — проверьте код");
      if (sinceVersion !== undefined && sinceVersion === room.version) {
        const seats = await readSeats(sql, code);
        return { unchanged: true, seats: seatsInfo(seats, now), hostSeat: metaOf(room, seats, now).hostSeat };
      }
      return snapshot(code, me.seat);
    },

    async again({ code, token }) {
      const room = await requireRoom(code);
      const me = await seatByToken(code, token);
      if (me.is_ai) throw new NetError("Только человек может начать новую партию");
      if (room.status !== "finished") throw new NetError("Партия ещё не закончена");
      await casUpdateStrict(sql, code, room.version, {
        state: null,
        status: "lobby",
        autoStepAt: null,
      });
    },
  };

  return service;
}

type GlobalRef = typeof globalThis & {
  __evoNetService__?: Promise<RoomService>;
};

/**
 * Та же схема, что в migrations/0002_net_rooms.sql, но исполняется и в рантайме:
 * на Vercel `db:migrate` выполняется на этапе билда и молча пропускается, если
 * DATABASE_URL не был виден процессу сборки. Идемпотентно — можно вызывать всегда.
 */
export const NET_TABLES_DDL = `
create table if not exists evo_rooms (
  code         text primary key,
  status       text not null default 'lobby',
  capacity     int  not null check (capacity between 2 and 8),
  difficulty   text not null default 'normal',
  seed         bigint not null,
  state        jsonb,
  version      int  not null default 0,
  auto_step_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create table if not exists evo_seats (
  room_code    text not null references evo_rooms(code) on delete cascade,
  seat         int  not null check (seat between 0 and 7),
  name         text not null,
  token        text not null,
  is_ai        boolean not null default false,
  last_seen_at timestamptz not null default now(),
  primary key (room_code, seat)
);
alter table evo_rooms add column if not exists modules jsonb not null default '{}';
alter table evo_rooms drop constraint if exists evo_rooms_capacity_check;
alter table evo_rooms add constraint evo_rooms_capacity_check check (capacity between 2 and 8);
alter table evo_seats drop constraint if exists evo_seats_seat_check;
alter table evo_seats add constraint evo_seats_seat_check check (seat between 0 and 7);
`;

/**
 * Общий экземпляр для прод-сервера. @/lib/db импортируется динамически:
 * node-тесты подставляют свой SqlLike и никогда не трогают Vite-специфику db.ts.
 * Перед первым использованием гарантируем схему (см. NET_TABLES_DDL).
 */
export function getRoomService(): Promise<RoomService> {
  const g = globalThis as GlobalRef;
  g.__evoNetService__ ??= import("@/lib/db").then(async ({ getSql }) => {
    const sql = await getSql();
    await sql.query(NET_TABLES_DDL);
    return createRoomService(sql as SqlLike);
  });
  return g.__evoNetService__;
}

/** Для тестов: прямая проверка оптимистичной записи и чтения состояния. */
export const _internals = { casUpdate, readRoom };
