/**
 * Сервер комнат сетевой «Эволюции»: канонический GameState живёт в БД,
 * клиенты шлют действия и опрашивают состояние. Движок вызывается только
 * здесь — клиент получает персональный вид через viewFor().
 *
 * Конкурентность без транзакций: обёртка БД не отдаёт rowCount, а пул pg
 * не держит транзакцию между запросами, поэтому все записи состояния идут
 * оптимистично — условный UPDATE по version с RETURNING (см. casUpdate).
 * Составные операции (create) проверяют вход и подчищают за собой при сбое.
 */
import {
  AI_NAMES,
  applyAction,
  createGame,
  currentActor,
  legalDefenseActions,
  legalDevActions,
  legalFeedActions,
} from "../../game/engine.ts";
import { chooseAIAction } from "../../game/ai.ts";
import type {
  Difficulty,
  GameAction,
  GameEvent,
  GameState,
  ModuleId,
  Player,
} from "../../game/types.ts";
import type {
  ChatMessage,
  CreateRoomInput,
  EventBatch,
  JoinResult,
  PollResult,
  RoomInfo,
  RoomMeta,
  RoomSettings,
  RoomSummary,
  ReactionEmoji,
  ReactionMessage,
  RoomStatus,
  SeatInfo,
  SpectatorInfo,
  SpectatorSnapshot,
  SqlLike,
  UnchangedPoll,
  WaiterInfo,
} from "./shared.ts";
import { PLAYER_COLORS, PACE, ROOM_PASSWORD_LEN, CODE_ALPHABET, colorForSeat } from "./shared.ts";
import { redactEvents, viewFor } from "./views.ts";

/**
 * Машиночитаемый код ошибки: клиент по нему решает, чинить связь или выходить,
 * и переводит текст на язык игрока (сервер языка клиента не знает и шлёт
 * русский текст + код; словарь кодов — netErr.* в src/lib/i18n).
 * password-required/password-wrong — не фатальны: форма входа показывает их
 * на месте и просит пароль, из стола при этом никого не выкидывает.
 */
export type NetErrorCode =
  | "kicked"
  | "seat-taken"
  | "room-gone"
  | "password-required"
  | "password-wrong"
  | "password-format"
  | "move-illegal"
  | "resigned"
  | "not-playing"
  | "reorder-phase"
  | "reorder-turn"
  | "reorder-owner"
  | "chat-empty"
  | "rate-limit"
  | "rate-fast"
  | "reaction-limit"
  | "reaction-missing"
  | "probe-limit"
  | "entry-limit"
  | "create-limit"
  | "queue-full"
  | "too-many-bots"
  | "code-failed"
  | "game-started"
  | "game-finished"
  | "game-running"
  | "host-only"
  | "lobby-only"
  | "kick-self"
  | "seat-free"
  | "kick-bot"
  | "bad-color"
  | "color-taken"
  | "color-seat"
  | "bot-color"
  | "host-human"
  | "waiter-gone"
  | "no-free-seats"
  | "seat-race"
  | "seats-unfinished"
  | "bot-chat"
  | "bot-resign"
  | "bot-rename"
  | "empty-name"
  | "seat-missing"
  | "retry"
  | "rename-phase"
  | "rename-turn"
  | "rename-owner"
  | "rename-length"
  | "generic";

export class NetError extends Error {
  readonly code: NetErrorCode;
  constructor(message: string, code: NetErrorCode = "generic") {
    super(message);
    this.name = "NetError";
    this.code = code;
  }
}

// Алфавит кодов комнат — общий с валидацией входа (shared.ts, S11).
const CODE_ALPHABET_LEN = CODE_ALPHABET.length;

/** Сколько батчей событий хранить в комнате и сколько отдавать за один poll. */
const MAX_EVENT_BATCHES = 40;
const POLL_MAX_BATCHES = 30;
const POLL_MAX_EVENTS = 60;
/** Чат: история при подключении, порция поллинга, длина и лимиты отправки. */
const CHAT_HISTORY = 50;
const CHAT_POLL_LIMIT = 100;
const CHAT_MAX_LEN = 400;
const CHAT_PER_MINUTE = 20;
const CHAT_MIN_GAP_MS = 700;
/** Реакции зрителей и болельщиков: тот же принцип, что у чата. */
const REACTION_PER_MINUTE = 20;
const REACTION_MIN_GAP_MS = 700;
/**
 * «Печатает…»: отметка живёт 4 секунды (клиент поллингом сам гасит индикатор),
 * а пинги чаще раза в секунду не пишутся — нажатия не долбят БД.
 */
const TYPING_FRESH_MS = 4000;
const TYPING_MIN_GAP_MS = 1000;
/** Очередь ожидающих: предел роста и TTL строки. */
const MAX_WAITERS = 16;
const WAITER_TTL_MS = 2 * 60 * 60 * 1000;
/** Сколько столов отдавать в список меню за один запрос. */
const LIST_ROOMS_LIMIT = 40;

/**
 * Мягкие лимиты жизненного цикла (S7) и анти-перебора (S2). Хранятся в
 * памяти сервиса (см. rateHits): это защита от спама и брутфорса, а не
 * суточная квота — при нескольких инстансах счётчик становится «на инстанс».
 * Источник запроса (IP) передаёт api.ts — сам сервис контекста запроса не знает.
 */
/** Перебор кода комнаты/пароля: не больше 10 неудач за 5 минут на код+источник. */
const PROBE_FAIL_MAX = 10;
const PROBE_WINDOW_MS = 5 * 60 * 1000;
/** Вход/наблюдение/переподключение: 30 запросов в минуту на источник. */
const ENTRY_PER_MINUTE = 30;
/**
 * Создание столов: 10 в час на источник — спам комнатами раздувает БД.
 * `EVO_CREATE_PER_HOUR` поднимает порог для браузерных QA-прогонов (они
 * создают десятки комнат); защита по умолчанию не ослабляется, потому что
 * переменная читается только при явной установке в окружении сервера.
 */
const CREATE_PER_HOUR = 10;

/** Порог создания столов с учётом окружения (значение по умолчанию — 10). */
function createPerHourLimit(): number {
  const raw = typeof process !== "undefined" ? Number(process.env?.EVO_CREATE_PER_HOUR) : NaN;
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : CREATE_PER_HOUR;
}
/** Коды ошибок, которые считаются «неудачной попыткой доступа» (S2). */
const PROBE_FAIL_CODES = new Set<NetErrorCode>([
  "room-gone",
  "password-required",
  "password-wrong",
  // rejoin с чужим/протухшим токеном: перебор токенов тоже ограничиваем.
  "seat-taken",
]);

interface SeatRow {
  seat: number;
  name: string;
  is_ai: boolean;
  /** Игрок сдался: ходы пропускаются, место остаётся до конца партии. */
  resigned: boolean;
  last_seen_at: unknown;
  /** Время последнего сигнала «печатает…» (netTyping); null — не печатал. */
  typing_at: unknown;
  /** Цвет места (hex из PLAYER_COLORS); null у строк до миграции 0007. */
  color: string | null;
  /** Внутреннее поле: нужно для evo_kicks. Наружу не отдаётся (seatsInfo и т.п.). */
  token: string;
}

interface RoomRow {
  code: string;
  status: RoomStatus;
  capacity: number;
  difficulty: Difficulty;
  modules: Partial<Record<ModuleId, boolean>> | null;
  settings: RoomSettings | null;
  host_seat: number | null;
  version: number;
  state: GameState | null;
  events: EventBatch[];
  auto_step_at: unknown;
  /**
   * M10: когда сервер сам закончит ход человека, у которого не осталось
   * действий. Отдельно от auto_step_at: тот держит темп ботов и автофаз, а
   * этот — только 30-секундное окно на осмотр стола (иначе остаток пейсинга
   * предыдущего шага обрывал бы ход человека).
   */
  turn_deadline_at: unknown;
  created_at: unknown;
  /** Приватный стол: вход по паролю; в списке меню виден как «закрытый». */
  is_private: boolean;
  /** Пароль приватного стола (4 цифры); наружу отдаётся только хосту. */
  password: string | null;
}

interface WaiterRow {
  token: string;
  name: string;
  at: number;
  typing_at: unknown;
}

interface SpectatorRow {
  token: string;
  name: string;
  last_seen_at: unknown;
  typing_at: unknown;
}

/** Криптостойкое целое [0, max): Math.random для кодов комнат не годится (S2). */
function randomInt(max: number): number {
  // Отбраковка хвоста: без неё остаток от деления даёт смещение к началу алфавита.
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buf = new Uint32Array(1);
  let v = 0;
  do {
    crypto.getRandomValues(buf);
    v = buf[0]!;
  } while (v >= limit);
  return v % max;
}

function makeCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += CODE_ALPHABET[randomInt(CODE_ALPHABET_LEN)];
  }
  return s;
}

function makeToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/**
 * Цвета, занятые местами этого стола (в нижнем регистре): null у старых строк
 * даёт детерминированный фолбэк colorForSeat — он тоже считается занятым,
 * иначе визуально совпал бы с цветом нового игрока.
 */
function takenColors(seats: SeatRow[]): Set<string> {
  return new Set(seats.map((s) => (s.color ?? colorForSeat(s.seat)).toLowerCase()));
}

/**
 * Случайный СВОБОДНЫЙ цвет места из палитры (см. PLAYER_COLORS в shared.ts):
 * цвет эксклюзивен в пределах стола. Если заняты все 16 (за столом максимум
 * 8 мест — не случится, но код не должен падать) — фолбэк на любой.
 */
function pickColor(taken: Iterable<string>): string {
  const used = new Set([...taken].map((c) => c.toLowerCase()));
  const free = PLAYER_COLORS.filter((c) => !used.has(c.toLowerCase()));
  const pool = free.length ? free : ([...PLAYER_COLORS] as string[]);
  return pool[randomInt(pool.length)]!;
}

/**
 * Детерминированный СВОБОДНЫЙ цвет для бота: первый незанятый из палитры,
 * начиная с индекса места. После перезапуска сервера и пересборки стола боты
 * выглядят одинаково, но не совпадают с цветами, выбранными людьми.
 */
function botColor(seatNo: number, taken: Set<string>): string {
  for (let i = 0; i < PLAYER_COLORS.length; i++) {
    const c = PLAYER_COLORS[(seatNo + i) % PLAYER_COLORS.length]!;
    if (!taken.has(c.toLowerCase())) return c;
  }
  return colorForSeat(seatNo); // все 16 заняты (не случится за 8-местным столом)
}

/** Копия массива в случайном порядке (Фишер—Йетс): выбор жертв при M14. */
function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Пароль приватного стола: 4 цифры без ведущего нуля — его диктуют голосом
 * и пересылают в мессенджере, поэтому «0123» и «123» путались бы.
 */
function makePassword(): string {
  return String(1000 + Math.floor(Math.random() * 9000));
}

/** Пароль из формы создания: пусто — сгенерируем, иначе ровно 4 цифры. */
function normalizePassword(raw?: string): string {
  const clean = raw?.trim() ?? "";
  if (!clean) return makePassword();
  if (!/^\d{4}$/.test(clean)) throw new NetError("Пароль стола — 4 цифры", "password-format");
  return clean;
}

/** Присланный хостом пароль: только ровно ROOM_PASSWORD_LEN цифр, без генерации. */
function checkPassword(raw: string): string {
  const clean = raw.trim();
  if (clean.length !== ROOM_PASSWORD_LEN || !/^\d+$/.test(clean)) {
    throw new NetError(`Пароль стола — ${ROOM_PASSWORD_LEN} цифры`, "password-format");
  }
  return clean;
}

/**
 * Сравнение секрета в постоянном времени (S2): длины выравниваем нулями и
 * сравниваем через crypto.timingSafeEqual — побайтовое время не зависит от
 * числа совпавших символов. node:crypto берём динамически: модуль серверный,
 * а server.ts импортируется и клиентской сборкой (там ветка не исполняется,
 * есть чистый JS-запасной вариант — он тоже без ранних выходов).
 */
async function secretEquals(a: string, b: string): Promise<boolean> {
  const len = Math.max(a.length, b.length);
  const av = new Uint8Array(len);
  const bv = new Uint8Array(len);
  for (let i = 0; i < a.length; i++) av[i] = a.charCodeAt(i) & 0xff;
  for (let i = 0; i < b.length; i++) bv[i] = b.charCodeAt(i) & 0xff;
  const sameLen = a.length === b.length;
  try {
    const { timingSafeEqual } = await import("node:crypto");
    return sameLen && timingSafeEqual(av, bv);
  } catch {
    let diff = sameLen ? 0 : 1;
    for (let i = 0; i < len; i++) diff |= av[i]! ^ bv[i]!;
    return diff === 0;
  }
}

/**
 * Проверка пароля приватного стола. Ошибки машиночитаемые: форма входа
 * показывает пароль и текст, не выбрасывая человека в меню.
 */
async function requirePassword(room: RoomRow, given?: string): Promise<void> {
  if (!room.is_private) return;
  const clean = given?.trim() ?? "";
  if (!clean) throw new NetError("Стол приватный — введите пароль", "password-required");
  if (!(await secretEquals(clean, room.password ?? ""))) {
    throw new NetError("Неверный пароль стола", "password-wrong");
  }
}

function toMs(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  const t = Date.parse(String(v));
  return Number.isNaN(t) ? 0 : t;
}

function isUniqueViolation(e: unknown): boolean {
  return String((e as { code?: string }).code) === "23505";
}

interface RoomRowRaw {
  code: string;
  status: string;
  capacity: number;
  difficulty: string;
  modules: Partial<Record<ModuleId, boolean>> | null;
  host_seat: number | null;
  version: number;
  state_json: unknown;
  events_json: unknown;
  settings_json: unknown;
  auto_step_at: unknown;
  turn_deadline_at: unknown;
  created_at: unknown;
  is_private: boolean | null;
  password: string | null;
}

async function readRoom(sql: SqlLike, code: string): Promise<RoomRow | null> {
  const rows = await sql.query<RoomRowRaw>(
    `select code, status, capacity, difficulty, modules, settings as settings_json,
            host_seat, version, state as state_json, events as events_json,
            auto_step_at, turn_deadline_at, created_at, is_private, password
       from evo_rooms where code = $1`,
    [code],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    code: r.code,
    status: r.status as RoomStatus,
    capacity: r.capacity,
    difficulty: r.difficulty as Difficulty,
    modules: r.modules ?? {},
    settings: (r.settings_json as RoomSettings | null) ?? {},
    host_seat: r.host_seat ?? null,
    version: r.version,
    state: (r.state_json as GameState | null) ?? null,
    events: (r.events_json as EventBatch[] | null) ?? [],
    auto_step_at: r.auto_step_at,
    turn_deadline_at: r.turn_deadline_at,
    created_at: r.created_at,
    is_private: Boolean(r.is_private),
    password: r.password ?? null,
  };
}

async function readSeats(sql: SqlLike, code: string): Promise<SeatRow[]> {
  return sql.query<SeatRow>(
    `select seat, name, is_ai, resigned, last_seen_at, typing_at, color, token
       from evo_seats where room_code = $1 order by seat`,
    [code],
  );
}

async function readWaiters(sql: SqlLike, code: string): Promise<WaiterRow[]> {
  return sql.query<WaiterRow>(
    `select token, name, (extract(epoch from created_at) * 1000)::float8 as at, typing_at
       from evo_waiters where room_code = $1 order by created_at, token`,
    [code],
  );
}

function waiterInfos(rows: WaiterRow[], now: () => number): WaiterInfo[] {
  return rows.map((w) => ({
    name: w.name,
    at: w.at,
    typing: now() - toMs(w.typing_at) < TYPING_FRESH_MS,
  }));
}

/** Эффективные настройки: settings приоритетнее колонок (обратная совместимость). */
function effectiveSettings(room: RoomRow): RoomSettings {
  const s = room.settings ?? {};
  return {
    ...s,
    modules: s.modules ?? room.modules ?? {},
    difficulty: s.difficulty ?? room.difficulty,
  };
}

/**
 * Хост: сохранённый host_seat, если это место человека (сдавшиеся не в счёт);
 * иначе минимальное место среди людей онлайн, иначе минимальное место человека,
 * иначе 0. Передача хоста при выходе сохраняется через persistHost (см. poll).
 *
 * viewerSeat — место запрашивающего: пароль приватного стола отдаётся только
 * хосту. Все прочие вызовы (ожидающий, зритель) пароль не получают.
 */
function metaOf(room: RoomRow, seats: SeatRow[], now: () => number, viewerSeat?: number): RoomMeta {
  const humans = seats.filter((s) => !s.is_ai && !s.resigned).map((s) => s.seat);
  const onlineHumans = seats
    .filter((s) => !s.is_ai && !s.resigned && now() - toMs(s.last_seen_at) < PACE.onlineMs)
    .map((s) => s.seat);
  const saved = room.host_seat;
  const hostSeat =
    saved !== null && humans.includes(saved)
      ? saved
      : onlineHumans.length
        ? Math.min(...onlineHumans)
        : humans.length
          ? Math.min(...humans)
          : 0;
  return {
    code: room.code,
    status: room.status,
    capacity: room.capacity,
    hostSeat,
    settings: effectiveSettings(room),
    isPrivate: room.is_private,
    password: viewerSeat !== undefined && viewerSeat === hostSeat ? room.password : null,
  };
}

function seatsInfo(seats: SeatRow[], now: () => number): SeatInfo[] {
  return seats.map((s) => ({
    seat: s.seat,
    name: s.name,
    isAI: s.is_ai,
    online: now() - toMs(s.last_seen_at) < PACE.onlineMs,
    resigned: s.resigned,
    // Старые строки без цвета получают детерминированный из палитры.
    color: colorForSeat(s.seat, s.color),
    typing: now() - toMs(s.typing_at) < TYPING_FRESH_MS,
  }));
}

/** Включённые дополнения — белым списком и в фиксированном порядке. */
function enabledModules(
  settings: RoomSettings | null,
  modules: Partial<Record<ModuleId, boolean>> | null,
): ModuleId[] {
  const effective = settings?.modules ?? modules ?? {};
  return (["continents", "plants", "fungi", "randomMutations"] as const).filter(
    (id) => effective[id],
  ) as ModuleId[];
}

/** Свободные места по возрастанию: люди занимают низ, боты — хвост. */
function freeSeatList(capacity: number, seats: SeatRow[]): number[] {
  const taken = new Set(seats.map((s) => s.seat));
  const free: number[] = [];
  for (let i = 0; i < capacity; i++) if (!taken.has(i)) free.push(i);
  return free;
}

/** Первое свободное место или -1. */
function firstFreeSeat(capacity: number, seats: SeatRow[]): number {
  const free = freeSeatList(capacity, seats);
  return free.length ? free[0]! : -1;
}

function countFreeSeats(capacity: number, seats: SeatRow[]): number {
  return freeSeatList(capacity, seats).length;
}

// ── журнал событий и чат: чтение порциями ──────────────────────────────────

/** Батчи с version > sinceVersion; жёсткий лимит, чтобы кадр не распухал. */
function batchesSince(all: EventBatch[], sinceVersion: number): EventBatch[] {
  const out: EventBatch[] = [];
  let total = 0;
  for (const b of all) {
    if (b.version <= sinceVersion) continue;
    if (out.length >= POLL_MAX_BATCHES) break;
    if (out.length > 0 && total + b.events.length > POLL_MAX_EVENTS) break;
    out.push(b);
    total += b.events.length;
  }
  return out;
}

/** Те же события, но уже без чужой скрытой информации. */
function viewEventBatches(batches: EventBatch[], seat: number, full: GameState): EventBatch[] {
  return batches.map((b) => ({ version: b.version, events: redactEvents(b.events, seat, full) }));
}

/** sinceId не задан — последние сообщения (подключение/возврат за стол). */
async function readChat(sql: SqlLike, code: string, sinceId?: number): Promise<ChatMessage[]> {
  if (sinceId === undefined) {
    const rows = await sql.query<ChatMessage>(
      `select id::int as id, seat, name, text,
              (extract(epoch from created_at) * 1000)::float8 as at
         from evo_chat where room_code = $1 order by id desc limit ${CHAT_HISTORY}`,
      [code],
    );
    return rows.reverse();
  }
  return sql.query<ChatMessage>(
    `select id::int as id, seat, name, text,
            (extract(epoch from created_at) * 1000)::float8 as at
       from evo_chat where room_code = $1 and id > $2 order by id limit ${CHAT_POLL_LIMIT}`,
    [code, sinceId],
  );
}

async function readSpectators(
  sql: SqlLike,
  code: string,
  now: () => number,
): Promise<SpectatorInfo[]> {
  const rows = await sql.query<SpectatorRow>(
    `select token, name, last_seen_at, typing_at
       from evo_spectators where room_code = $1 order by created_at`,
    [code],
  );
  return rows.map((s) => ({
    name: s.name,
    online: now() - toMs(s.last_seen_at) < PACE.onlineMs,
    typing: now() - toMs(s.typing_at) < TYPING_FRESH_MS,
  }));
}

async function readReactions(
  sql: SqlLike,
  code: string,
  sinceId?: number,
): Promise<ReactionMessage[]> {
  const clause = sinceId === undefined ? "" : "and id > $2";
  const params: unknown[] = sinceId === undefined ? [code] : [code, sinceId];
  const rows = await sql.query<{
    id: number;
    name: string;
    emoji: string;
    kind: "reaction" | "cheer";
    target_seat: number | null;
    chat_id: number | null;
    at: number;
  }>(
    `select id::int as id, name, emoji, kind, target_seat, chat_id::int as chat_id,
            (extract(epoch from created_at) * 1000)::float8 as at
       from evo_reactions where room_code = $1 ${clause} order by id desc limit 60`,
    params,
  );
  return rows.reverse().map((r) => ({
    id: r.id,
    name: r.name,
    // Эмодзи приходят только из reactionInput (белый список) — приводим честно.
    emoji: r.emoji as ReactionEmoji,
    kind: r.kind,
    targetSeat: r.target_seat,
    chatId: r.chat_id,
    at: r.at,
  }));
}

/** Публичный вид для зрителя: humanId=-1 — все руки/скрытые свойства обезличены. */
function spectatorView(full: GameState): GameState {
  const view = viewFor(full, -1);
  // Табличный UI ожидает существующего humanId. Берём место 0 только как
  // визуальный якорь; руки уже скрыты viewFor(..., -1), а клиентский стор
  // помечает режим spectating и не разрешает игровые действия.
  view.humanId = 0;
  return view;
}

/**
 * Условная запись состояния: применяется только если версия не сменилась.
 * Возвращает true при успехе (ровно одна строка обновлена).
 *
 * eventsAppend дописывает батч текущего шага с version = version + 1 (ровно
 * та версия, которую выставит этот же UPDATE) и хранит последние
 * MAX_EVENT_BATCHES записей. events — полная замена (нужна при сбросе в лобби).
 *
 * Запись state автоматически снимает turn_deadline_at (M10): дедлайн всегда
 * относится к конкретному положению партии, и любой шаг/действие/сдача/кик,
 * меняющие состояние, обязаны начать отсчёт заново. Ставить метку можно
 * только отдельным UPDATE без state — так она не переживёт смену хода.
 */
async function casUpdate(
  sql: SqlLike,
  code: string,
  version: number,
  fields: {
    state?: GameState | null;
    status?: RoomStatus;
    autoStepAt?: number | null;
    /** M10: дедлайн авто-конца хода человека (epoch ms; null — снять). */
    turnDeadlineAt?: number | null;
    capacity?: number;
    difficulty?: Difficulty;
    modules?: Partial<Record<ModuleId, boolean>>;
    settings?: RoomSettings;
    hostSeat?: number | null;
    events?: EventBatch[];
    eventsAppend?: GameEvent[];
    /** Доступ к столу: приватность и пароль (null — пароля нет). */
    isPrivate?: boolean;
    password?: string | null;
  },
): Promise<boolean> {
  const set: string[] = ["version = version + 1", "updated_at = now()"];
  const params: unknown[] = [];
  const push = (clause: string, value: unknown, cast = "") => {
    params.push(value);
    set.push(`${clause} $${params.length}${cast}`);
  };
  if (fields.state !== undefined) push("state =", JSON.stringify(fields.state), "::jsonb");
  if (fields.status !== undefined) push("status =", fields.status);
  if (fields.state !== undefined && fields.turnDeadlineAt === undefined) {
    set.push("turn_deadline_at = null");
  }
  if (fields.turnDeadlineAt !== undefined) {
    push(
      "turn_deadline_at =",
      fields.turnDeadlineAt === null ? null : new Date(fields.turnDeadlineAt).toISOString(),
    );
  }
  if (fields.autoStepAt !== undefined) {
    push(
      "auto_step_at =",
      fields.autoStepAt === null ? null : new Date(fields.autoStepAt).toISOString(),
    );
  }
  if (fields.capacity !== undefined) push("capacity =", fields.capacity);
  if (fields.difficulty !== undefined) push("difficulty =", fields.difficulty);
  if (fields.modules !== undefined) push("modules =", JSON.stringify(fields.modules), "::jsonb");
  if (fields.settings !== undefined) push("settings =", JSON.stringify(fields.settings), "::jsonb");
  if (fields.hostSeat !== undefined) push("host_seat =", fields.hostSeat);
  if (fields.isPrivate !== undefined) push("is_private =", fields.isPrivate);
  if (fields.password !== undefined) push("password =", fields.password);
  if (fields.events !== undefined) push("events =", JSON.stringify(fields.events), "::jsonb");
  if (fields.eventsAppend !== undefined) {
    params.push(JSON.stringify(fields.eventsAppend));
    const p = params.length;
    // events/version в правой части — старые значения строки: батч получает
    // ровно ту версию, которую выставит этот UPDATE, и хранится последним 40.
    set.push(
      `events = (select coalesce(jsonb_agg(e order by ord), '[]'::jsonb) from (` +
        `select e, ord from jsonb_array_elements(` +
        `events || jsonb_build_array(jsonb_build_object('version', version + 1, 'events', $${p}::jsonb))` +
        `) with ordinality as t(e, ord) order by ord desc limit ${MAX_EVENT_BATCHES}` +
        `) recent)`,
    );
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
    if (!fresh) throw new NetError("Стол не найден — проверьте код", "room-gone");
    v = fresh.version;
  }
  throw new NetError("Стол изменился, попробуйте ещё раз", "retry");
}

async function janitor(sql: SqlLike): Promise<void> {
  await sql.query(
    `delete from evo_seats where room_code in
       (select code from evo_rooms where created_at < now() - interval '12 hours')`,
  );
  await sql.query(`delete from evo_rooms where created_at < now() - interval '12 hours'`);
  // Ожидающие и следы киков не должны переживать свои комнаты и TTL.
  await sql.query(
    `delete from evo_waiters where room_code not in (select code from evo_rooms)
        or created_at < now() - interval '2 hours'`,
  );
  await sql.query(`delete from evo_kicks where created_at < now() - interval '12 hours'`);
}

// ── автошаги: боты и автоматические фазы ───────────────────────────────────

/**
 * Шаг за игрока, у которого не осталось действий: «закончить ход» в его
 * текущем смысле. В развитие это пас, в защите — отказ, в питании — именно
 * завершение ХОДА (feedEndTurn), а не пас до конца фазы: игрок не теряет
 * следующий ход раунда, если к нему снова появятся действия (то же, что
 * кнопка «Закончить ход» в доке). feedSkip в «Растениях» бывает и запрещён.
 */
export function endTurnStepFor(state: GameState, _actorId: number): GameAction {
  if (state.phase === "development") return { type: "devPass" };
  if (state.pendingAttack) return { type: "chooseDefense", kind: "none" };
  return { type: "feedEndTurn" };
}

/**
 * Шаг за сдавшегося: тот же набор, но в питании — пас до конца фазы (feedSkip):
 * сдавшийся не должен возвращаться в круг, даже если еда ещё осталась.
 */
function resignedStepFor(state: GameState): GameAction {
  if (state.phase === "development") return { type: "devPass" };
  if (state.pendingAttack) return { type: "chooseDefense", kind: "none" };
  return { type: "feedSkip" };
}

/**
 * M10: у ходящего человека не осталось осмысленных действий — доступны только
 * завершение хода/пас, а в защите единственный вариант «не защищаться».
 * Боты и сдавшиеся не в счёт: у них свои автошаги. Пока есть хоть одно
 * действие (карта, еда, охота, защита) — таймера нет (решение владельца Q2).
 */
export function noChoicesLeft(state: GameState, actor: Player): boolean {
  if (actor.isAI || actor.resigned) return false;
  if (state.pendingAttack) {
    return legalDefenseActions(state, actor.id).every(
      (a) => a.type === "chooseDefense" && a.kind === "none",
    );
  }
  if (state.phase === "development") {
    return legalDevActions(state, actor.id).every((a) => a.type === "devPass");
  }
  if (state.phase === "feeding") {
    return legalFeedActions(state, actor.id).every(
      (a) => a.type === "feedEndTurn" || a.type === "feedSkip",
    );
  }
  return false;
}

/**
 * Дедлайн авто-конца хода человека без действий (epoch ms) — клиент рисует по
 * нему круговой отсчёт у имени. null: таймера нет (бот, автофаза, есть ходы).
 */
function turnDeadlineOf(room: RoomRow): number | null {
  if (room.status !== "playing" || !room.state || room.turn_deadline_at === null) return null;
  if (nextAutoStep(room.state) !== null) return null;
  const actor = currentActor(room.state);
  if (!actor || !noChoicesLeft(room.state, actor)) return null;
  return toMs(room.turn_deadline_at);
}

/** Следующий шаг, который сервер делает сам; null — ждём ход человека. */
export function nextAutoStep(state: GameState): GameAction | null {
  if (state.phase === "foodBank") {
    return state.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" };
  }
  if (state.phase === "extinction") return { type: "continueExtinction" };
  if (state.phase === "growth") return { type: "continueGrowth" };
  const actor = currentActor(state);
  if (!actor) return null;
  // Сдавшийся не ходит: место и имя остаются, но сервер сам пасует и
  // пропускает питание за него — животные гибнут от голода в вымирание.
  if (actor.resigned && !actor.isAI) return resignedStepFor(state);
  // «Трава и грибы»: раунд безумца проводит сосед справа — логика ботов.
  if (!actor.isAI && state.madTurn !== actor.id) return null;
  const pick = chooseAIAction(state);
  if (pick) return pick;
  // Страховка от зависания: у бота всегда есть пас/скип/сдаться.
  return state.phase === "development" ? { type: "devPass" } : resignedStepFor(state);
}

// ── пауза на модальные показы клиента ────────────────────────────────────────

/**
 * Длительности модальных карточек клиента (spotlight.tsx, обычная скорость).
 * После «драматических» шагов — бросок кубика базы, шаг, завершивший фазу с
 * событиями (вымирание, убийство) — сервер держит паузу, пока клиент
 * проигрывает карточки. Без паузы следующее состояние накрывало модалку, и
 * владелец видел «обрыв после последнего хода фазы»: карточка не показывалась
 * или срезалась на середине, а следующий этап начинался резко. Значения —
 * зеркало buildItems в spotlight.tsx: меняются там — правятся и здесь.
 */
const SPOTLIGHT_MS: Partial<Record<GameEvent["kind"], number>> = {
  diceRoll: 2900,
  preyKilled: 3000,
  plantAttack: 2500,
  paralyzed: 2300,
};
/** Защита добычи: бросок «Быстрого» — самый длинный показ с вердиктом. */
const SPOTLIGHT_DEFENSE_MS: Record<"running" | "mimicry" | "tailLoss" | "none", number> = {
  running: 3400,
  tailLoss: 2800,
  mimicry: 2400,
  none: 0,
};
/** Сводка «Вымирание» — одна карточка на всех погибших в шаге. */
const SPOTLIGHT_EXTINCTION_MS = 2700;
/** Хвост паузы: доставка кадра поллингом (до 0.7 с) + анимация закрытия (0.28 с). */
const SPOTLIGHT_TAIL_MS = 900;

/** Сколько клиент будет показывать модальные карточки событий этого шага (мс). */
export function spotlightMsOf(events: GameEvent[]): number {
  let ms = 0;
  let deaths = 0;
  for (const e of events) {
    if (e.kind === "defenseUsed") ms += SPOTLIGHT_DEFENSE_MS[e.defense];
    else if (e.kind === "animalDied") deaths += 1;
    else ms += SPOTLIGHT_MS[e.kind] ?? 0;
  }
  if (deaths) ms += SPOTLIGHT_EXTINCTION_MS;
  return ms;
}

/**
 * Пауза после шага, завершившего фазу: покрывает показ карточек его событий.
 * Пустые переходы (без модальных событий) не растягиваем — паузы нет вовсе.
 */
function phaseGapMs(before: GameState, after: GameState): number {
  if (before.phase === after.phase) return 0;
  const show = spotlightMsOf(after.lastEvents);
  return show > 0 ? show + SPOTLIGHT_TAIL_MS : 0;
}

function stepDelay(before: GameState, step: GameAction, after: GameState): number {
  const j = () => Math.round((Math.random() * 2 - 1) * PACE.jitterMs);
  if (step.type === "rollFoodBank") {
    // Бросок базы — сам по себе показ: кубик крутится и ложится значением,
    // пауза должна покрывать карточку целиком, иначе начало питания срезает её.
    return Math.max(PACE.diceMs, spotlightMsOf(after.lastEvents) + SPOTLIGHT_TAIL_MS) + j();
  }
  if (step.type === "continueExtinction") return PACE.extinctMs + j();
  if (step.type === "continueGrowth") return PACE.extinctMs + j();
  const changedTurn = before.currentPlayerId !== after.currentPlayerId;
  return Math.max(PACE.botMs + (changedTurn ? PACE.turnGapMs : 0), phaseGapMs(before, after)) + j();
}

// ── проверка присланного действия против легального списка ─────────────────

/**
 * Сравнение значений действия: undefined и отсутствие поля равнозначны
 * (клиент шлёт `zoneId: undefined` из кода карт), массивы и вложенные объекты
 * сравниваются поэлементно/пополево — лишнее или подменённое поле присланного
 * не должно пройти незамеченным.
 */
function valueSame(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => valueSame(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object" && a !== null && b !== null) {
    const ao = a as Record<string, unknown>;
    const bo = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(ao), ...Object.keys(bo)]);
    for (const k of keys) if (!valueSame(ao[k], bo[k])) return false;
    return true;
  }
  return false;
}

/**
 * S4: полная сверка присланного действия с легальным вариантом. Раньше
 * сверялись только ID_KEYS — `feedConvertFat.amount`, `feedMigrate.moves`,
 * `feedGraze.plantId/floraId`, `devMutate.intent/zoneId`, `devPlayAnimal.zoneId`
 * проходили невалидированными и применялись как есть (конвертация всего жира
 * вместо min(fat, need), топтун по чужому растению в обход зональных гейтов).
 * Теперь сервер применяет именно канонический объект из легального списка.
 */
function sameAction(a: GameAction, b: GameAction): boolean {
  return valueSame(a, b);
}

// ── фабрика сервиса ─────────────────────────────────────────────────────────

/**
 * Источник запроса (IP) для мягких лимитов S2/S7. Передаёт api.ts из заголовков
 * запроса; без источника (внутренние вызовы, тесты) лимиты не применяются.
 * Параметр необязательный и всегда последний — старые вызовы не ломаются.
 */
type Source = string | undefined;

export interface RoomService {
  create(
    input: CreateRoomInput,
    source?: Source,
  ): Promise<{
    code: string;
    seat: number;
    token: string;
    /** Приватность и (для хоста) пароль — сразу, не дожидаясь первого кадра. */
    isPrivate: boolean;
    password: string | null;
  }>;
  join(input: { code: string; name: string; password?: string }, source?: Source): Promise<JoinResult>;
  /**
   * Список столов для меню: живые комнаты, включая закрытые (меню делит их
   * на колонки «Открытые» и «Закрытые»). Без токенов и паролей: пароль тут
   * не выбирается из БД вообще, вход в закрытый стол проверяет `join`.
   */
  listRooms(): Promise<RoomSummary[]>;
  setBots(input: { code: string; token: string; count: number }): Promise<void>;
  /** Кик игрока хостом: в лобби место освобождается, в партии становится ботом. */
  kick(code: string, token: string, seat: number): Promise<void>;
  setCapacity(code: string, token: string, capacity: number): Promise<void>;
  /** Настройки до старта: модули/сложность/размер колоды. */
  setSettings(code: string, token: string, settings: RoomSettings): Promise<void>;
  /**
   * Доступ к столу (хост, только лобби): сделать приватным/открытым и при
   * необходимости перегенерировать пароль. Возвращает актуальные значения.
   */
  setRoomPrivacy(
    code: string,
    token: string,
    isPrivate: boolean,
    regenerate?: boolean,
  ): Promise<{ isPrivate: boolean; password: string | null }>;
  /**
   * Смена пароля стола (хост, только лобби): ровно ROOM_PASSWORD_LEN цифр.
   * Приватность не трогает — открытый стол с паролем остаётся открытым.
   */
  setPassword(code: string, token: string, password: string): Promise<{ password: string }>;
  /** Своё имя на столе: цвет — из PLAYER_COLORS, пока идёт лобби. */
  setColor(code: string, token: string, color: string): Promise<{ color: string }>;
  transferHost(code: string, token: string, seat: number): Promise<void>;
  /** Убрать ожидающего по индексу в очереди (см. RoomInfo.waiters). */
  kickWaiter(code: string, token: string, index: number): Promise<void>;
  /**
   * Состояние лобби для ожидающего: место появилось — можно занимать.
   * S1: только подтверждённому участнику (место / очередь / зритель) —
   * произвольный токен кадра лобби не получает.
   */
  waiterInfo(
    code: string,
    token: string,
    sinceChatId?: number,
    sinceReactionId?: number,
  ): Promise<RoomInfo>;
  claimSeat(code: string, token: string): Promise<{ seat: number; token: string }>;
  leaveQueue(code: string, token: string): Promise<void>;
  /** Сдаться в идущей партии: место остаётся, ходы пропускаются, счёт идёт. */
  resign(code: string, token: string): Promise<PollResult>;
  /** Сменить имя до старта партии (место), в очереди или зрителем. */
  setName(code: string, token: string, name: string): Promise<{ name: string }>;
  chat(code: string, token: string, text: string): Promise<ChatMessage>;
  /**
   * Зритель не занимает место игрока; вид — только публичный.
   * S5: для приватного стола нужен пароль (тот же, что в join).
   */
  spectate(code: string, name: string, password?: string, source?: Source): Promise<{ token: string }>;
  spectatorPoll(
    code: string,
    token: string,
    sinceChatId?: number,
    sinceReactionId?: number,
  ): Promise<SpectatorSnapshot>;
  /**
   * Реакция на стол/игрока (targetSeat) либо на реплику чата (chatId, M12).
   * chatId проверяется на принадлежность ЭТОЙ комнате; всё остальное — как было.
   */
  reaction(
    code: string,
    token: string,
    emoji: ReactionEmoji,
    kind: "reaction" | "cheer",
    targetSeat?: number | null,
    chatId?: number | null,
  ): Promise<ReactionMessage>;
  /**
   * «Печатает…»: отметка времени набора текста для места, ожидающего или
   * зрителя. Лёгкий троттлинг (не чаще раза в секунду) — без ошибок клиенту.
   */
  typing(code: string, token: string): Promise<void>;
  rejoin(code: string, token: string, source?: Source): Promise<PollResult>;
  start(code: string, token: string): Promise<PollResult>;
  action(code: string, token: string, action: GameAction): Promise<PollResult>;
  poll(
    code: string,
    token: string,
    sinceVersion?: number,
    sinceChatId?: number,
    sinceReactionId?: number,
  ): Promise<PollResult | UnchangedPoll>;
  again(input: { code: string; token: string }): Promise<void>;
}

export function createRoomService(sql: SqlLike, opts: { now?: () => number } = {}): RoomService {
  const now = opts.now ?? (() => Date.now());

  /**
   * Мягкие лимиты жизненного цикла (S7) и анти-перебора (S2): скользящее окно
   * в памяти сервиса. Лимит «на инстанс» — осознанно мягкая защита от спама
   * комнатами и брутфорса, а не суточная квота. Источник запроса (IP) приходит
   * параметром от api.ts: сам сервис контекста запроса не знает, а внутренние
   * вызовы и тесты передают источник явно (без источника лимиты не считаются).
   */
  const rateHits = new Map<string, number[]>();

  /** Окно ключа без записей: заодно чистим окно от старых отметок. */
  function rateWindow(key: string, windowMs: number): number[] {
    const t = now();
    let arr = rateHits.get(key);
    if (!arr) {
      arr = [];
      rateHits.set(key, arr);
    }
    while (arr.length && t - arr[0]! >= windowMs) arr.shift();
    return arr;
  }

  /** Бросает, если лимит уже исчерпан; сам ничего не записывает. Код — для перевода на клиенте. */
  function rateAssert(key: string, max: number, windowMs: number, message: string, code: NetErrorCode = "generic"): void {
    if (rateWindow(key, windowMs).length >= max) throw new NetError(message, code);
  }

  /** Отмечает попытку; редкая чистка не даёт карте расти от разовых ключей. */
  function rateHit(key: string, windowMs: number): void {
    rateWindow(key, windowMs).push(now());
    if (rateHits.size > 2000) {
      for (const [k, v] of rateHits) {
        if (!v.length || now() - v[v.length - 1]! >= windowMs) rateHits.delete(k);
      }
    }
  }

  /**
   * Ключ анти-перебора для join/rejoin/spectate: код стола + источник.
   * Без источника (внутренние вызовы, тесты) лимит не применяется.
   */
  function probeKey(kind: string, code: string, source?: string): string | null {
    return source ? `${kind}:${code.trim().toUpperCase()}:${source}` : null;
  }

  /**
   * S2: не больше PROBE_FAIL_MAX неудачных попыток за окно на код+источник.
   * Считаются только «попытки доступа» (room-gone, password-required,
   * password-wrong, seat-taken), успех попытки не сбрасывает — после
   * блокировки ждём окно целиком.
   */
  async function withProbeGuard<T>(key: string | null, run: () => Promise<T>): Promise<T> {
    if (key) {
      rateAssert(key, PROBE_FAIL_MAX, PROBE_WINDOW_MS, "Слишком много попыток — подождите", "probe-limit");
    }
    try {
      return await run();
    } catch (e) {
      if (key && e instanceof NetError && PROBE_FAIL_CODES.has(e.code)) {
        rateHit(key, PROBE_WINDOW_MS);
      }
      throw e;
    }
  }

  /** S7: общий потолок входа/наблюдения/переподключения на источник. */
  function entryGuard(source?: string): void {
    if (!source) return;
    rateAssert(
      `entry:${source}`,
      ENTRY_PER_MINUTE,
      60_000,
      "Слишком много подключений — подождите минуту", "entry-limit",
    );
    rateHit(`entry:${source}`, 60_000);
  }

  async function requireRoom(code: string): Promise<RoomRow> {
    const room = await readRoom(sql, code);
    if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
    return room;
  }

  /** Токен без места: сначала проверяем, не кикнут ли он — сообщение важнее. */
  async function goneReason(code: string, token: string): Promise<never> {
    const kicked = await sql.query(
      `select 1 from evo_kicks where room_code = $1 and token = $2 limit 1`,
      [code, token],
    );
    if (kicked.length) throw new NetError("Вас удалили из-за стола", "kicked");
    throw new NetError(
      "Место больше не существует — вероятно, вас удалили или стол закрылся",
      "seat-taken",
    );
  }

  async function seatByToken(code: string, token: string): Promise<SeatRow> {
    const rows = await sql.query<SeatRow>(
      `select seat, name, is_ai, resigned, last_seen_at, token from evo_seats
        where room_code = $1 and token = $2`,
      [code, token],
    );
    const seat = rows[0];
    if (!seat) await goneReason(code, token);
    return seat;
  }

  /** Участник стола: место по токену либо ожидающий (seat = -1). */
  async function participantSeat(
    code: string,
    token: string,
  ): Promise<{ seat: number; name: string; isAi: boolean }> {
    const rows = await sql.query<{ seat: number; name: string; is_ai: boolean }>(
      `select seat, name, is_ai from evo_seats where room_code = $1 and token = $2`,
      [code, token],
    );
    const seat = rows[0];
    if (seat) return { seat: seat.seat, name: seat.name, isAi: seat.is_ai };
    const w = await sql.query<{ name: string }>(
      `select name from evo_waiters where room_code = $1 and token = $2`,
      [code, token],
    );
    if (w[0]) return { seat: -1, name: w[0].name, isAi: false };
    const spec = await sql.query<{ name: string }>(
      `select name from evo_spectators where room_code = $1 and token = $2`,
      [code, token],
    );
    if (spec[0]) return { seat: -2, name: spec[0].name, isAi: false };
    return goneReason(code, token);
  }

  /** Участник чата: место по токену либо ожидающий (seat = -1). */
  async function participant(code: string, token: string): Promise<{ seat: number; name: string }> {
    const p = await participantSeat(code, token);
    if (p.isAi) throw new NetError("Боты не пишут в чат", "bot-chat");
    return { seat: p.seat, name: p.name };
  }

  /**
   * Хост-методы принимают и место, и ожидающего: вызывающий резолвится как
   * «место ИЛИ очередь», и ожидающий получает внятное «только хост», а не
   * «места не существует». Кикнутый токен по-прежнему получает код kicked.
   */
  async function requireHost(
    code: string,
    token: string,
    deny: string,
    denyCode: NetErrorCode = "host-only",
  ): Promise<{ room: RoomRow; seats: SeatRow[]; me: { seat: number; name: string } }> {
    const room = await requireRoom(code);
    const me = await participantSeat(code, token);
    const seats = await readSeats(sql, code);
    if (metaOf(room, seats, now).hostSeat !== me.seat) throw new NetError(deny, denyCode);
    return { room, seats, me };
  }

  /**
   * Уникальное имя в комнате: если «Дима» уже занят (места и очередь), новому
   * достаётся «Дима 1», затем «Дима 2» и так далее — с учётом лимита в 16
   * символов. Тёзки недопустимы: по name сервер считает лимит реакций, а UI
   * показывает имена без номеров мест. excludeToken исключает из проверки
   * собственную строку (переименование, занятие места из очереди).
   */
  async function uniqueName(code: string, name: string, excludeToken?: string): Promise<string> {
    const rows = await sql.query<{ name: string }>(
      `select name from evo_seats where room_code = $1 and ($2::text is null or token <> $2)
        union all
       select name from evo_waiters where room_code = $1 and ($2::text is null or token <> $2)
        union all
       select name from evo_spectators where room_code = $1 and ($2::text is null or token <> $2)`,
      [code, excludeToken ?? null],
    );
    const taken = new Set(rows.map((r) => r.name.trim().toLowerCase()));
    const base = name.trim().slice(0, 16);
    if (!taken.has(base.toLowerCase())) return base;
    for (let n = 1; n <= 99; n++) {
      const suffix = ` ${n}`;
      const candidate = base.slice(0, 16 - suffix.length) + suffix;
      if (!taken.has(candidate.toLowerCase())) return candidate;
    }
    return base.slice(0, 13) + " 99";
  }

  async function insertBots(code: string, capacity: number, count: number): Promise<void> {
    // Боты занимают свободные хвостовые места: люди остаются на нижних.
    // Чтение мест перед вставкой защищает от дыр после киков: вставка в
    // занятое место с on conflict do nothing молча теряла бы бота.
    const seats = await readSeats(sql, code);
    const target = freeSeatList(capacity, seats).slice(-count);
    // Цвет бота детерминирован по месту, но не должен совпадать с цветами
    // людей и уже вставленных ботов: набор накапливаем по ходу вставки.
    const taken = takenColors(seats);
    for (let i = 0; i < target.length; i++) {
      // Имена ботов — как у учёных (AI_NAMES), а не «Бот N»: номер добавит
      // uniqueName, только если имя уже занято человеком.
      const name = await uniqueName(code, AI_NAMES[i % AI_NAMES.length]!);
      const color = botColor(target[i]!, taken);
      taken.add(color.toLowerCase());
      await sql.query(
        `insert into evo_seats (room_code, seat, name, token, is_ai, color)
         values ($1, $2, $3, '', true, $4) on conflict do nothing`,
        [code, target[i], name, color],
      );
    }
  }

  /** Постановка в очередь ожидающих с ограничением роста. */
  async function enqueueWaiter(code: string, name: string): Promise<JoinResult> {
    const rows = await sql.query<{ n: number }>(
      `select count(*)::int as n from evo_waiters where room_code = $1`,
      [code],
    );
    if ((rows[0]?.n ?? 0) >= MAX_WAITERS) {
      throw new NetError("Очередь на этот стол переполнена — попробуйте позже", "queue-full");
    }
    const token = makeToken();
    const unique = await uniqueName(code, name);
    await sql.query(
      `insert into evo_waiters (room_code, token, name) values ($1, $2, $3)
       on conflict (room_code, token) do update set name = excluded.name`,
      [code, token, unique],
    );
    return { seat: -1, token, waiting: true };
  }

  /**
   * Хост не должен «зависать» на вышедшем или сдавшемся игроке: если
   * сохранённый хост не онлайн (или сдался), передаём место следующему
   * онлайн-человеку и сохраняем это. Best-effort: гонку версий разрешает
   * следующий poll.
   */
  async function persistHost(code: string, room: RoomRow, seats: SeatRow[]): Promise<RoomRow> {
    const onlineHumans = seats
      .filter((s) => !s.is_ai && !s.resigned && now() - toMs(s.last_seen_at) < PACE.onlineMs)
      .map((s) => s.seat);
    const saved = room.host_seat;
    if (saved !== null && onlineHumans.includes(saved)) return room;
    if (!onlineHumans.length) return room;
    const next = Math.min(...onlineHumans);
    if (next === saved) return room;
    const ok = await casUpdate(sql, code, room.version, { hostSeat: next }).catch(() => false);
    if (!ok) return room;
    return { ...room, host_seat: next, version: room.version + 1 };
  }

  async function advance(code: string): Promise<void> {
    for (let i = 0; i < PACE.maxStepsPerTick; i++) {
      const room = await readRoom(sql, code);
      if (!room?.state || room.status !== "playing") return;
      const before = room.state;
      const step = nextAutoStep(before);
      if (!step) {
        // Ход человека. M10: если действий у него не осталось — держим для
        // него окно PACE.idleTurnMs и затем заканчиваем ход сами; если
        // действия есть — таймера нет вовсе (решение владельца Q2).
        const actor = currentActor(before);
        const idle = actor && noChoicesLeft(before, actor) ? actor : null;
        if (!idle) {
          // Действия есть: ждать нечего, метки автошагов снимаем.
          if (room.auto_step_at !== null || room.turn_deadline_at !== null) {
            await casUpdate(sql, code, room.version, {
              autoStepAt: null,
              turnDeadlineAt: null,
            }).catch(() => false);
          }
          return;
        }
        const due = room.turn_deadline_at === null ? 0 : toMs(room.turn_deadline_at);
        if (due === 0) {
          // Начало бездействия: метка (turnDeadlineAt) видна клиентам — по
          // ней они рисуют круговой отсчёт.
          await casUpdate(sql, code, room.version, {
            autoStepAt: null,
            turnDeadlineAt: now() + PACE.idleTurnMs,
          }).catch(() => false);
          return;
        }
        if (due - now() > 0) return; // ещё есть время на осмотр стола
        // Время вышло — сервер заканчивает ход сам, как за сдавшегося.
        // Запись state сама снимет turn_deadline_at (см. casUpdate).
        const forced = endTurnStepFor(before, idle.id);
        const after = applyAction(before, forced);
        const finished = after.phase === "gameOver";
        const ok = await casUpdate(sql, code, room.version, {
          state: after,
          status: finished ? "finished" : undefined,
          autoStepAt: finished ? null : now() + stepDelay(before, forced, after),
          eventsAppend: after.lastEvents.length ? after.lastEvents : undefined,
        });
        if (!ok) return; // обогнали — следующий запрос доведёт
        if (finished) return;
        continue;
      }
      const due = room.auto_step_at === null ? 0 : toMs(room.auto_step_at);
      if (due - now() > 0) return; // ещё рано — темп держит auto_step_at
      const after = applyAction(before, step);
      const finished = after.phase === "gameOver";
      const ok = await casUpdate(sql, code, room.version, {
        state: after,
        status: finished ? "finished" : undefined,
        autoStepAt: finished ? null : now() + stepDelay(before, step, after),
        eventsAppend: after.lastEvents.length ? after.lastEvents : undefined,
      });
      if (!ok) return; // обогнали — следующий запрос доведёт
      if (finished) return;
    }
  }

  async function snapshot(
    code: string,
    seat: number,
    opts: { sinceVersion?: number; sinceChatId?: number; sinceReactionId?: number } = {},
  ): Promise<PollResult> {
    const [room, seats, waiters, spectators, reactions] = await Promise.all([
      readRoom(sql, code),
      readSeats(sql, code),
      readWaiters(sql, code),
      readSpectators(sql, code, now),
      readReactions(sql, code, opts.sinceReactionId),
    ]);
    if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
    const full = room.state;
    // Первый кадр после подключения/реконнекта историю не вываливает:
    // батчи отдаются только при явном sinceVersion.
    const events =
      opts.sinceVersion !== undefined && full
        ? viewEventBatches(batchesSince(room.events, opts.sinceVersion), seat, full)
        : [];
    const chat = await readChat(sql, code, opts.sinceChatId);
    return {
      version: room.version,
      // viewerSeat = seat: пароль приватного стола видит только хост.
      room: metaOf(room, seats, now, seat),
      seats: seatsInfo(seats, now),
      seat,
      state: full && room.status !== "lobby" ? viewFor(full, seat) : null,
      events,
      chat,
      waiters: waiterInfos(waiters, now),
      spectators,
      reactions,
      turnDeadlineAt: turnDeadlineOf(room),
      serverNow: now(),
    };
  }

  const service: RoomService = {
    async create(input, source) {
      // S7: мягкая квота на источнике — спам комнатами раздувает БД.
      // Порог настраивается EVO_CREATE_PER_HOUR (QA-прогоны создают десятки
      // столов); без переменной окружения действует прежний лимит.
      if (source) {
        rateAssert(
          `create:${source}`,
          createPerHourLimit(),
          60 * 60 * 1000,
          "Слишком много созданных столов — попробуйте позже", "create-limit",
        );
        rateHit(`create:${source}`, 60 * 60 * 1000);
      }
      // Боты не могут занять место хоста — иначе комната остаётся без людей.
      if (input.botSeats > input.capacity - 1) {
        throw new NetError("Ботов больше, чем свободных мест", "too-many-bots");
      }
      const token = makeToken();
      const isPrivate = input.isPrivate ?? false;
      // Обратная совместимость: без флага приватности стол открытый, как раньше.
      const password = isPrivate ? normalizePassword(input.password) : null;
      const settings: RoomSettings = {
        modules: input.modules ?? {},
        difficulty: input.difficulty,
        ...(input.deckSize ? { deckSize: input.deckSize } : {}),
      };
      for (let attempt = 0; attempt < 6; attempt++) {
        const code = makeCode();
        try {
          await sql.query(
            `insert into evo_rooms
               (code, capacity, difficulty, seed, modules, settings, host_seat, is_private, password)
             values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, 0, $7, $8)`,
            [
              code,
              input.capacity,
              input.difficulty,
              Math.floor(Math.random() * 1_000_000),
              JSON.stringify(input.modules ?? {}),
              JSON.stringify(settings),
              isPrivate,
              password,
            ],
          );
          try {
            await sql.query(
              // Цвет хоста: первый случайный из палитры — больше мест нет,
              // коллизий не с кем (эксклюзивность проверяет pickColor).
              `insert into evo_seats (room_code, seat, name, token, color)
               values ($1, 0, $2, $3, $4)`,
              [code, await uniqueName(code, input.name), token, pickColor([])],
            );
            if (input.botSeats > 0) await insertBots(code, input.capacity, input.botSeats);
          } catch (e) {
            // Подчищаем недостроенную комнату (места уйдут каскадом).
            await sql.query(`delete from evo_rooms where code = $1`, [code]).catch(() => {});
            throw e;
          }
          return { code, seat: 0, token, isPrivate, password };
        } catch (e) {
          if (!isUniqueViolation(e)) throw e;
        }
      }
      throw new NetError("Не удалось выдать код стола — попробуйте ещё раз", "code-failed");
    },

    async join({ code, name, password }, source) {
      entryGuard(source);
      // S2: перебор пароля/кодов ограничен на пару «код + источник».
      return withProbeGuard(probeKey("join", code, source), async () => {
        for (let attempt = 0; attempt < 3; attempt++) {
          const room = await requireRoom(code);
          // Пароль — ДО проверки статуса и мест: «приватный, нужен пароль»
          // полезнее, чем «партия уже началась» человеку с улицы.
          await requirePassword(room, password);
          if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
          const seats = await readSeats(sql, code);
          const free = firstFreeSeat(room.capacity, seats);
          if (free < 0) return enqueueWaiter(code, name);
          const token = makeToken();
          const inserted = await sql.query<{ seat: number }>(
            `insert into evo_seats (room_code, seat, name, token, color)
             values ($1, $2, $3, $4, $5)
             on conflict (room_code, seat) do nothing
             returning seat`,
            [code, free, await uniqueName(code, name), token, pickColor(takenColors(seats))],
          );
          if (inserted.length === 1) return { seat: free, token, waiting: false };
          // Место заняли между чтением и вставкой — перечитываем.
        }
        // Все попытки уперлись в гонку: лучше очередь, чем потерянный игрок.
        return enqueueWaiter(code, name);
      });
    },

    async listRooms() {
      // Живые столы, включая закрытые: меню показывает их в отдельной колонке,
      // а пароль спрашивается при входе (join). Токены и пароли не выбираются
      // вообще — утечь им неоткуда.
      const rows = await sql.query<{
        code: string;
        status: string;
        capacity: number;
        difficulty: string;
        modules: Partial<Record<ModuleId, boolean>> | null;
        settings: RoomSettings | null;
        taken: number;
        host_name: string | null;
        is_private: boolean;
        created_at: unknown;
      }>(
        `select r.code, r.status, r.capacity, r.difficulty, r.modules, r.settings,
                (select count(*)::int from evo_seats s where s.room_code = r.code) as taken,
                (select s.name from evo_seats s
                  where s.room_code = r.code
                    and s.seat = coalesce(r.host_seat,
                      (select min(s2.seat) from evo_seats s2
                        where s2.room_code = r.code and not s2.is_ai))) as host_name,
                r.is_private,
                r.created_at
           from evo_rooms r
          where r.status in ('lobby', 'playing')
          order by r.created_at desc
          limit $1`,
        [LIST_ROOMS_LIMIT],
      );
      return rows.map((r) => ({
        code: r.code,
        status: r.status as RoomStatus,
        capacity: r.capacity,
        taken: r.taken,
        free: Math.max(0, r.capacity - r.taken),
        hostName: r.host_name ?? "Хост",
        difficulty: (r.settings?.difficulty ?? r.difficulty) as Difficulty,
        modules: enabledModules(r.settings, r.modules),
        createdAt: toMs(r.created_at),
        isPrivate: Boolean(r.is_private),
      }));
    },

    async setBots({ code, token, count }) {
      const { room, seats } = await requireHost(code, token, "Ботов добавляет хост", "host-only");
      if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
      const humans = seats.filter((s) => !s.is_ai).length;
      const clamped = Math.max(0, Math.min(count, room.capacity - humans));
      await sql.query(`delete from evo_seats where room_code = $1 and is_ai`, [code]);
      if (clamped > 0) await insertBots(code, room.capacity, clamped);
    },

    async kick(code, token, seatNo) {
      const { room, seats, me } = await requireHost(
        code,
        token,
        "Кикать игроков может только хост", "host-only",
      );
      if (seatNo === me.seat) throw new NetError("Себя удалить нельзя", "kick-self");
      const victim = seats.find((s) => s.seat === seatNo);
      if (!victim) throw new NetError("Это место уже свободно", "seat-free");
      if (victim.is_ai) throw new NetError("Ботов убирают кнопкой «Бот»", "kick-bot");
      if (room.status === "lobby") {
        await sql.query(`delete from evo_seats where room_code = $1 and seat = $2`, [code, seatNo]);
      } else if (room.status === "playing" && room.state) {
        // Место в идущей партии освободить нельзя — движок ждал бы его вечно.
        // Превращаем игрока в бота: партия продолжается, клиент получает «kicked».
        const state = structuredClone(room.state);
        // Имя бота-замены — из AI_NAMES, с нумерацией от уже занятых имён.
        const botName = await uniqueName(code, AI_NAMES[seatNo % AI_NAMES.length]!, victim.token);
        const p = state.players[seatNo];
        if (p) {
          p.isAI = true;
          p.name = botName;
          p.resigned = false;
        }
        await casUpdateStrict(sql, code, room.version, { state });
        await sql.query(
          // Замена ботом: имя из списка учёных, цвет — прежний цвет места
          // остаётся его же (эксклюзивность не нарушается), меняется только
          // владелец. До волны 10 цвет места не был уникальным, поэтому на
          // всякий случай берём свободный, если прежний кому-то совпал.
          `update evo_seats set is_ai = true, name = $3, token = '', resigned = false,
                  color = $4, last_seen_at = now()
            where room_code = $1 and seat = $2`,
          [code, seatNo, botName, botColor(seatNo, takenColors(seats))],
        );
      } else {
        throw new NetError("Партия уже закончена", "game-finished");
      }
      await sql.query(
        `insert into evo_kicks (room_code, token) values ($1, $2) on conflict do nothing`,
        [code, victim.token],
      );
    },

    async setCapacity(code, token, capacity) {
      const { room, seats } = await requireHost(code, token, "Менять число мест может только хост", "host-only");
      if (room.status !== "lobby") throw new NetError("Места меняют до начала партии", "lobby-only");

      // M14: уменьшение мест не должно «съедать» бота, если внутри новой
      // границы есть пустое место. Порядок: убрать лишних (боты, затем
      // случайные люди в очередь ожидающих), затем уплотнить занятые места
      // к минимальным. Прежний delete «is_ai and seat >= capacity» уносил
      // бота даже тогда, когда в границе оставалось пустое место.
      const ordered = [...seats].sort((a, b) => a.seat - b.seat);
      const excess = ordered.length - capacity;
      const victims: SeatRow[] = [];
      if (excess > 0) {
        // Сначала боты — случайные, чтобы снижение не било по людям.
        victims.push(...shuffled(ordered.filter((s) => s.is_ai)).slice(0, excess));
        const left = excess - victims.length;
        // Ботов не хватило: случайные люди уходят в очередь ожидающих
        // (лимит MAX_WAITERS здесь не применяем: выгонять участника в никуда
        // из-за переполненной очереди хуже, чем превысить её на пару строк).
        if (left > 0) victims.push(...shuffled(ordered.filter((s) => !s.is_ai)).slice(0, left));
      }
      const removedSeats = new Set(victims.map((v) => v.seat));
      const survivors = ordered.filter((s) => !removedSeats.has(s.seat));

      // Ушедшие — до уплотнения, иначе их место конфликтует с переездом
      // выживших. Боты удаляются, люди встают в очередь со СВОИМ токеном:
      // клиент продолжает сессию ожидающим, а не теряет место.
      for (const v of victims) {
        if (!v.is_ai) {
          await sql.query(
            `insert into evo_waiters (room_code, token, name) values ($1, $2, $3)
             on conflict (room_code, token) do update set name = excluded.name`,
            [code, v.token, v.name],
          );
        }
        await sql.query(`delete from evo_seats where room_code = $1 and seat = $2`, [code, v.seat]);
      }

      // Уплотнение: выжившие занимают места 0..n-1, свободные остаются в
      // хвосте. Обход по возрастанию: цель всегда ниже текущего места и уже
      // свободна. Цвета, имена, флаги сдачи и токены не трогаем — переезжает
      // только номер места.
      const compacted = new Map<number, number>();
      survivors.forEach((s, i) => compacted.set(s.seat, i));
      for (const s of survivors) {
        const to = compacted.get(s.seat)!;
        if (to === s.seat) continue;
        await sql.query(`update evo_seats set seat = $3 where room_code = $1 and seat = $2`, [
          code,
          s.seat,
          to,
        ]);
      }

      // Хост: если переехал — host_seat следует за ним; если его убрали —
      // передаём место следующему онлайн-человеку (как persistHost/transferHost).
      const hostBefore = metaOf(room, seats, now).hostSeat;
      const hostRow = seats.find((s) => s.seat === hostBefore);
      let hostSeat = hostRow && compacted.has(hostRow.seat) ? compacted.get(hostRow.seat)! : null;
      if (hostSeat === null) {
        const humansAlive = survivors.filter((s) => !s.is_ai);
        const online = humansAlive.filter((s) => now() - toMs(s.last_seen_at) < PACE.onlineMs);
        const nextHost = (online.length ? online : humansAlive)[0];
        hostSeat = nextHost ? compacted.get(nextHost.seat)! : 0;
      }

      const patch: { capacity: number; hostSeat?: number } = { capacity };
      if (hostSeat !== room.host_seat) patch.hostSeat = hostSeat;
      await casUpdateStrict(sql, code, room.version, patch);

      // Системное сообщение: состав изменился не по своей воле.
      if (victims.length) {
        const movedHumans = victims.filter((v) => !v.is_ai).map((v) => v.name);
        const parts: string[] = [];
        if (victims.length - movedHumans.length) {
          parts.push(`убраны боты: ${victims.length - movedHumans.length}`);
        }
        if (movedHumans.length) parts.push(`в очередь ожидающих: ${movedHumans.join(", ")}`);
        await sql.query(
          `insert into evo_chat (room_code, seat, name, text) values ($1, -1, $2, $3)`,
          [code, "Стол", `Мест стало ${capacity}: ${parts.join("; ")}`],
        );
      }
    },

    async setSettings(code, token, patch) {
      const { room } = await requireHost(code, token, "Менять настройки может только хост", "host-only");
      if (room.status !== "lobby") throw new NetError("Настройки меняют до начала партии", "lobby-only");
      const next: RoomSettings = { ...effectiveSettings(room) };
      if (patch.modules !== undefined) next.modules = { ...patch.modules };
      if (patch.difficulty !== undefined) next.difficulty = patch.difficulty;
      if (patch.deckSize !== undefined) next.deckSize = patch.deckSize;
      await casUpdateStrict(sql, code, room.version, {
        settings: next,
        difficulty: next.difficulty ?? room.difficulty,
        modules: next.modules ?? room.modules ?? {},
      });
    },

    async setRoomPrivacy(code, token, isPrivate, regenerate = false) {
      const { room } = await requireHost(code, token, "Менять доступ может только хост", "host-only");
      if (room.status !== "lobby") throw new NetError("Доступ меняют до начала партии", "lobby-only");
      // Приватность без пароля не бывает: если пароля ещё нет или хост просит
      // новый — генерируем 4 цифры. Открытому столу пароль не нужен, но и не
      // мешает: он останется на случай возврата в приватный режим.
      const password = isPrivate && (regenerate || !room.password) ? makePassword() : room.password;
      await casUpdateStrict(sql, code, room.version, { isPrivate, password });
      return { isPrivate, password: isPrivate ? password : null };
    },

    async setPassword(code, token, password) {
      const { room } = await requireHost(code, token, "Менять пароль может только хост", "host-only");
      if (room.status !== "lobby") throw new NetError("Пароль меняют до начала партии", "lobby-only");
      const clean = checkPassword(password);
      // Приватность не трогаем: у открытого стола пароль просто лежит про запас
      // (как и после setRoomPrivacy с isPrivate=false) и в кадры никому, кроме
      // хоста, не попадает.
      await casUpdateStrict(sql, code, room.version, { password: clean });
      return { password: clean };
    },

    async setColor(code, token, color) {
      const room = await requireRoom(code);
      if (!(PLAYER_COLORS as readonly string[]).includes(color)) {
        throw new NetError("Такого цвета нет в палитре стола", "bad-color");
      }
      const rows = await sql.query<{ seat: number; is_ai: boolean }>(
        `select seat, is_ai from evo_seats where room_code = $1 and token = $2`,
        [code, token],
      );
      const me = rows[0];
      // Цвет — свойство места: у ожидающего и зрителя места нет.
      if (!me) {
        const waiter = await sql.query(
          `select 1 from evo_waiters where room_code = $1 and token = $2`,
          [code, token],
        );
        if (waiter.length) throw new NetError("Цвет выбирают за столом, а не в очереди", "color-seat");
        return goneReason(code, token);
      }
      if (me.is_ai) throw new NetError("Ботам цвет назначает стол", "bot-color");
      if (room.status !== "lobby") throw new NetError("Цвет меняют до начала партии", "lobby-only");
      // Свой текущий цвет — no-op/успех, без запроса к БД.
      const seat = await sql.query<{ color: string | null }>(
        `select color from evo_seats where room_code = $1 and seat = $2`,
        [code, me.seat],
      );
      const mine = seat[0]?.color ?? colorForSeat(me.seat);
      if (mine.toLowerCase() === color.toLowerCase()) return { color: mine };
      // Эксклюзивность: цвет не должен принадлежать другому месту этого стола.
      const others = await readSeats(sql, code);
      const busy = others.find(
        (s) => s.seat !== me.seat && (s.color ?? colorForSeat(s.seat)).toLowerCase() === color.toLowerCase(),
      );
      if (busy) {
        throw new NetError("Этот цвет уже занят — выберите другой", "color-taken");
      }
      await sql.query(`update evo_seats set color = $3 where room_code = $1 and seat = $2`, [
        code,
        me.seat,
        color,
      ]);
      return { color };
    },

    async transferHost(code, token, seatNo) {
      const { room, seats } = await requireHost(code, token, "Передавать хоста может только хост", "host-only");
      if (room.status !== "lobby") throw new NetError("Хоста передают до начала партии", "lobby-only");
      const target = seats.find((s) => s.seat === seatNo);
      if (!target || target.is_ai)
        throw new NetError("Хостом может стать только человек за столом", "host-human");
      await casUpdateStrict(sql, code, room.version, { hostSeat: seatNo });
    },

    async kickWaiter(code, token, index) {
      await requireHost(code, token, "Убирать ожидающих может только хост", "host-only");
      const waiters = await readWaiters(sql, code);
      const target = waiters[index];
      if (!target) throw new NetError("Такого ожидающего уже нет", "waiter-gone");
      await sql.query(`delete from evo_waiters where room_code = $1 and token = $2`, [
        code,
        target.token,
      ]);
      // Чтобы удалённый из очереди увидел понятную причину, а не «места нет».
      await sql.query(
        `insert into evo_kicks (room_code, token) values ($1, $2) on conflict do nothing`,
        [code, target.token],
      );
    },

    async waiterInfo(code, token, sinceChatId) {
      const room = await requireRoom(code);
      // Заодно подчищаем задержавшихся в очереди (TTL, мс → интервал).
      await sql
        .query(
          `delete from evo_waiters
            where room_code = $1 and created_at < now() - ($2::int * interval '1 millisecond')`,
          [code, WAITER_TTL_MS],
        )
        .catch(() => {});
      const [seats, waiters] = await Promise.all([readSeats(sql, code), readWaiters(sql, code)]);
      const idx = waiters.findIndex((w) => w.token === token);
      if (idx < 0) {
        // S1: RoomInfo (состав, зрители, чат, реакции) отдаётся только
        // подтверждённому участнику — место по токену, очередь или зритель.
        // Раньше произвольная строка ≥10 символов читала любой стол, включая
        // приватный: токен нигде не сверялся. Кикнутый по-прежнему получает
        // понятный kick, все прочие — отказ без подробностей.
        const [seat, spectator] = await Promise.all([
          sql.query(
            `select 1 from evo_seats where room_code = $1 and token = $2 limit 1`,
            [code, token],
          ),
          sql.query(
            `select 1 from evo_spectators where room_code = $1 and token = $2 limit 1`,
            [code, token],
          ),
        ]);
        if (!seat.length && !spectator.length) {
          const kicked = await sql.query(
            `select 1 from evo_kicks where room_code = $1 and token = $2 limit 1`,
            [code, token],
          );
          if (kicked.length) throw new NetError("Вас удалили из-за стола", "kicked");
          throw new NetError("Вас нет за этим столом", "seat-taken");
        }
      }
      const free = firstFreeSeat(room.capacity, seats);
      return {
        room: metaOf(room, seats, now),
        seats: seatsInfo(seats, now),
        waiters: waiterInfos(waiters, now),
        freeSeats: countFreeSeats(room.capacity, seats),
        queued: idx >= 0,
        position: idx >= 0 ? idx + 1 : null,
        freeSeat: free >= 0 ? free : null,
        chat: await readChat(sql, code, sinceChatId),
        spectators: await readSpectators(sql, code, now),
        reactions: await readReactions(sql, code),
      };
    },

    async claimSeat(code, token) {
      const room = await requireRoom(code);
      if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
      const w = await sql.query<{ name: string }>(
        `select name from evo_waiters where room_code = $1 and token = $2`,
        [code, token],
      );
      if (!w[0]) return goneReason(code, token);
      for (let attempt = 0; attempt < 3; attempt++) {
        const seats = await readSeats(sql, code);
        const free = firstFreeSeat(room.capacity, seats);
        if (free < 0) throw new NetError("Свободных мест пока нет", "no-free-seats");
        const seatToken = makeToken();
        // Свою строку очереди из проверки имени исключаем: место занимает
        // ровно то имя, что ждало, если его не перехватил кто-то другой.
        const name = await uniqueName(code, w[0].name, token);
        const inserted = await sql.query<{ seat: number }>(
          `insert into evo_seats (room_code, seat, name, token, color)
           values ($1, $2, $3, $4, $5)
           on conflict (room_code, seat) do nothing
           returning seat`,
          [code, free, name, seatToken, pickColor(takenColors(seats))],
        );
        if (inserted.length === 1) {
          await sql.query(`delete from evo_waiters where room_code = $1 and token = $2`, [
            code,
            token,
          ]);
          return { seat: free, token: seatToken };
        }
      }
      throw new NetError("Место только что заняли — попробуйте ещё раз", "seat-race");
    },

    async leaveQueue(code, token) {
      // Выход из очереди — идемпотентный и не требует живой комнаты.
      await sql
        .query(`delete from evo_waiters where room_code = $1 and token = $2`, [code, token])
        .catch(() => {});
    },

    async chat(code, token, text) {
      await requireRoom(code);
      const author = await participant(code, token);
      const clean = text.trim().slice(0, CHAT_MAX_LEN);
      if (!clean) throw new NetError("Пустое сообщение", "chat-empty");
      // Лимит по часам БД: клиентские часы не участвуют.
      const rows = await sql.query<{ recent: number; since_ms: number }>(
        `select
           (select count(*)::int from evo_chat
             where room_code = $1 and seat = $2 and created_at > now() - interval '1 minute') as recent,
           (select coalesce((extract(epoch from (now() - max(created_at))) * 1000)::int, 1000000)
              from evo_chat where room_code = $1 and seat = $2) as since_ms`,
        [code, author.seat],
      );
      const r = rows[0];
      if (r && r.recent >= CHAT_PER_MINUTE) {
        throw new NetError("Слишком много сообщений — подождите минуту", "rate-limit");
      }
      if (r && r.since_ms < CHAT_MIN_GAP_MS) {
        throw new NetError("Слишком часто — подождите секунду", "rate-fast");
      }
      const inserted = await sql.query<ChatMessage>(
        `insert into evo_chat (room_code, seat, name, text)
         values ($1, $2, $3, $4)
         returning id::int as id, seat, name, text,
                   (extract(epoch from created_at) * 1000)::float8 as at`,
        [code, author.seat, author.name, clean],
      );
      return inserted[0]!;
    },

    async spectate(code, name, password, source) {
      entryGuard(source);
      return withProbeGuard(probeKey("spectate", code, source), async () => {
        const room = await requireRoom(code);
        // S5: приватный стол закрыт и для наблюдения — тот же пароль, что в join.
        await requirePassword(room, password);
        const clean = name.trim().slice(0, 16);
        if (!clean) throw new NetError("Введите имя зрителя", "empty-name");
        const token = makeToken();
        await sql.query(
          `insert into evo_spectators (room_code, token, name) values ($1, $2, $3)`,
          // Нумерация общая с местами и очередью: по name считается лимит реакций.
          [code, token, await uniqueName(code, clean)],
        );
        return { token };
      });
    },

    async spectatorPoll(code, token, sinceChatId, sinceReactionId) {
      const room = await requireRoom(code);
      const rows = await sql.query<SpectatorRow>(
        `update evo_spectators set last_seen_at = now()
          where room_code = $1 and token = $2
          returning token, name, last_seen_at`,
        [code, token],
      );
      if (!rows[0]) throw new NetError("Зритель больше не подключён", "seat-taken");
      await advance(code);
      const fresh = (await readRoom(sql, code)) ?? room;
      const [seats, spectators, chat, reactions] = await Promise.all([
        readSeats(sql, code),
        readSpectators(sql, code, now),
        readChat(sql, code, sinceChatId),
        readReactions(sql, code, sinceReactionId),
      ]);
      return {
        version: fresh.version,
        room: metaOf(fresh, seats, now),
        seats: seatsInfo(seats, now),
        state: fresh.state && fresh.status !== "lobby" ? spectatorView(fresh.state) : null,
        spectators,
        chat,
        reactions,
        turnDeadlineAt: turnDeadlineOf(fresh),
        serverNow: now(),
      };
    },

    async reaction(code, token, emoji, kind, targetSeat, chatId) {
      await requireRoom(code);
      const author = await participant(code, token);
      // Реакция на реплику (M12): сообщение обязано быть из ЭТОЙ комнаты —
      // иначе по chatId можно было бы цепляться к чужой переписке (и утечь
      // фактом своего id). Проверяем до лимитов и вставки.
      let messageId: number | null = null;
      if (chatId !== undefined && chatId !== null) {
        const msg = await sql.query<{ id: number }>(
          `select id::int as id from evo_chat where room_code = $1 and id = $2`,
          [code, chatId],
        );
        if (!msg[0]) throw new NetError("Сообщение не найдено в этом столе", "reaction-missing");
        messageId = msg[0].id;
      }
      // Лимит по часам БД, как у чата: клиентские часы не участвуют.
      const limits = await sql.query<{ recent: number; since_ms: number }>(
        `select
           (select count(*)::int from evo_reactions
             where room_code = $1 and name = $2 and created_at > now() - interval '1 minute') as recent,
           (select coalesce((extract(epoch from (now() - max(created_at))) * 1000)::int, 1000000)
              from evo_reactions where room_code = $1 and name = $2) as since_ms`,
        [code, author.name],
      );
      const lim = limits[0];
      if (lim && lim.recent >= REACTION_PER_MINUTE) {
        throw new NetError("Слишком много реакций — подождите минуту", "reaction-limit");
      }
      if (lim && lim.since_ms < REACTION_MIN_GAP_MS) {
        throw new NetError("Слишком часто — подождите секунду", "rate-fast");
      }
      const rows = await sql.query<{
        id: number;
        name: string;
        emoji: string;
        kind: "reaction" | "cheer";
        target_seat: number | null;
        chat_id: number | null;
        at: number;
      }>(
        `insert into evo_reactions (room_code, name, emoji, kind, target_seat, chat_id)
         values ($1, $2, $3, $4, $5, $6)
         returning id::int as id, name, emoji, kind, target_seat, chat_id::int as chat_id,
                   (extract(epoch from created_at) * 1000)::float8 as at`,
        [code, author.name, emoji, kind, targetSeat ?? null, messageId],
      );
      const r = rows[0]!;
      return {
        id: r.id,
        name: r.name,
        emoji: r.emoji as ReactionEmoji,
        kind: r.kind,
        targetSeat: r.target_seat,
        chatId: r.chat_id,
        at: r.at,
      };
    },

    async typing(code, token) {
      await requireRoom(code);
      // Резолвер сам скажет «вас удалили»/«места нет» и найдёт ожидающего
      // (seat = -1) или зрителя (seat = -2): отметка ложится в свою таблицу.
      const me = await participantSeat(code, token);
      const table =
        me.seat >= 0 ? "evo_seats" : me.seat === -1 ? "evo_waiters" : "evo_spectators";
      // Троттлинг в самом апдейте: пинг на каждое нажатие не нужен, а
      // повторная запись в пределах TYPING_MIN_GAP_MS пропускается без ошибки.
      await sql.query(
        `update ${table} set typing_at = now()
          where room_code = $1 and token = $2
            and (typing_at is null
                 or typing_at < now() - ($3::int * interval '1 millisecond'))`,
        [code, token, TYPING_MIN_GAP_MS],
      );
    },

    async rejoin(code, token, source) {
      entryGuard(source);
      // S2: серия неудачных токенов/кодов блокируется на окно (по коду+источнику).
      return withProbeGuard(probeKey("rejoin", code, source), async () => {
        const me = await seatByToken(code, token);
        // История чата — чтобы F5 не терял переписку; батчи событий не отдаём.
        return snapshot(code, me.seat);
      });
    },

    async start(code, token) {
      const { room, seats, me } = await requireHost(code, token, "Начать партию может хост", "host-only");
      if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
      if (seats.length !== room.capacity) {
        throw new NetError("Заполните все места — людьми или ботами", "seats-unfinished");
      }
      const cfg = effectiveSettings(room);
      const defs = seats.map((s) => ({ name: s.name, isAI: s.is_ai }));
      const state = createGame(
        room.capacity,
        cfg.difficulty ?? room.difficulty,
        Math.floor(Math.random() * 1_000_000),
        defs,
        cfg.modules ?? room.modules ?? {},
        cfg.deckSize,
      );
      // Ожидающие при старте автоматически становятся зрителями: место не
      // занимают, но стол видят. Токен и имя сохраняются — клиент продолжает
      // сессию и после F5, а очередь очищается.
      await sql.query(
        `insert into evo_spectators (room_code, token, name)
         select room_code, token, name from evo_waiters where room_code = $1
         on conflict (room_code, token) do nothing`,
        [code],
      );
      await sql.query(`delete from evo_waiters where room_code = $1`, [code]);
      await casUpdateStrict(sql, code, room.version, {
        state,
        status: "playing",
        autoStepAt: now() + PACE.initialMs,
        events: [],
      });
      return snapshot(code, me.seat);
    },

    async resign(code, token) {
      const me = await seatByToken(code, token);
      if (me.is_ai) throw new NetError("Боты не сдаются", "bot-resign");
      // Пишем флаг в СВЕЖЕЕ состояние: при гонке версий casUpdate повторится
      // на новом снимке, а не перезапишет только что сделанный чужой шаг.
      for (let attempt = 0; attempt < 3; attempt++) {
        const room = await requireRoom(code);
        if (room.status !== "playing" || !room.state) throw new NetError("Партия не идёт", "not-playing");
        if (room.state.players[me.seat]?.resigned) {
          // Уже сдан: страховочно повторяем запись флага у места (мог не дойти).
          await sql.query(
            `update evo_seats set resigned = true where room_code = $1 and seat = $2`,
            [code, me.seat],
          );
          break;
        }
        const state = structuredClone(room.state);
        const p = state.players[me.seat];
        if (!p) throw new NetError("Ваше место не найдено в партии", "seat-missing");
        p.resigned = true;
        if (await casUpdate(sql, code, room.version, { state })) {
          // Флаг у места — для хоста и запрета действий; состояние пишем первым.
          await sql.query(
            `update evo_seats set resigned = true where room_code = $1 and seat = $2`,
            [code, me.seat],
          );
          break;
        }
        if (attempt === 2) throw new NetError("Стол изменился, попробуйте ещё раз", "retry");
      }
      return snapshot(code, me.seat);
    },

    async setName(code, token, name) {
      const room = await requireRoom(code);
      const clean = name.trim().slice(0, 16);
      if (!clean) throw new NetError("Введите имя", "empty-name");
      const seat = await sql.query<{ seat: number; is_ai: boolean }>(
        `select seat, is_ai from evo_seats where room_code = $1 and token = $2`,
        [code, token],
      );
      if (seat[0]?.is_ai) throw new NetError("Боты не переименовываются", "bot-rename");
      // Имя в идущей партии не меняем: место уже подписано в состоянии.
      if (seat[0] && room.status !== "lobby") {
        throw new NetError("Имя меняют до начала партии", "lobby-only");
      }
      const final = await uniqueName(code, clean, token);
      if (seat[0]) {
        await sql.query(`update evo_seats set name = $3 where room_code = $1 and token = $2`, [
          code,
          token,
          final,
        ]);
      }
      const waiter = await sql.query(
        `update evo_waiters set name = $3 where room_code = $1 and token = $2 returning token`,
        [code, token, final],
      );
      const spectator = await sql.query(
        `update evo_spectators set name = $3 where room_code = $1 and token = $2 returning token`,
        [code, token, final],
      );
      if (!seat[0] && !waiter.length && !spectator.length) await goneReason(code, token);
      return { name: final };
    },

    async action(code, token, sent) {
      const room = await requireRoom(code);
      const me = await seatByToken(code, token);
      if (room.status !== "playing" || !room.state) throw new NetError("Партия не идёт", "not-playing");
      const st = room.state;
      // Сдавшийся наблюдает: сервер сам пропускает его ходы, ручные — отказ.
      if (me.resigned || st.players[me.seat]?.resigned) {
        throw new NetError("Вы сдались — ваши ходы пропускаются автоматически", "resigned");
      }
      // M6: перестановка своего животного (в ряду или перенос между
      // территориями «Континентов») — структурное действие, которого нет и не
      // должно быть в legalDevActions/legalFeedActions: те списки гоняет UI
      // карт, а перетаскивание идёт мимо них. Пропускаем её отдельно: фаза
      // development/feeding, ход свой, животное своё; владельца и фазу движок
      // проверяет повторно (reorderAnimal/moveAnimalToZoneHuman по humanId).
      const isReorder =
        sent.type === "reorderAnimal" &&
        (st.phase === "development" || st.phase === "feeding") &&
        st.currentPlayerId === me.seat &&
        (st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId);
      // Кличка своего животного — та же косметика мимо легальных списков:
      // фаза development/feeding, ход свой, животное своё, имя 1–24 символа
      // после трима (пустое — допустимый сброс на дефолт). Движок триммит и
      // режет длину повторно (renameOwnAnimal по humanId).
      const isRename =
        sent.type === "renameAnimal" &&
        typeof sent.name === "string" &&
        sent.name.trim().length <= 24 &&
        (st.phase === "development" || st.phase === "feeding") &&
        st.currentPlayerId === me.seat &&
        (st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId);
      // Каноническое действие: применяем ровно тот объект из легального
      // списка, который совпал с присланным (S4). Присланные поля не участвуют —
      // подменённые amount/moves/plantId/floraId/zoneId/intent не проходят.
      let action: GameAction = sent;
      if (!isReorder && !isRename) {
        const allowed =
          st.pendingAttack && st.pendingAttack.waitingFor === me.seat
            ? legalDefenseActions(st, me.seat)
            : st.phase === "development"
              ? legalDevActions(st, me.seat)
              : st.phase === "feeding"
                ? legalFeedActions(st, me.seat)
                : [];
        const canonical = allowed.find((a) => sameAction(a, sent));
        if (!canonical) {
          // Перестановка и переименование — структурные косметические
          // действия без легального списка: причина отказа объясняется по шагам.
          if (sent.type === "reorderAnimal") {
            if (st.phase !== "development" && st.phase !== "feeding") {
              throw new NetError("Сейчас нельзя переставлять животных", "reorder-phase");
            }
            if (st.currentPlayerId !== me.seat) {
              throw new NetError(
                "Переставлять животных можно только в свой ход (сейчас ход другого игрока)",
                "reorder-turn",
              );
            }
            if (!(st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId)) {
              throw new NetError("Переставлять можно только своих животных", "reorder-owner");
            }
          }
          if (sent.type === "renameAnimal") {
            if (st.phase !== "development" && st.phase !== "feeding") {
              throw new NetError("Сейчас нельзя переименовывать животных", "rename-phase");
            }
            if (st.currentPlayerId !== me.seat) {
              throw new NetError(
                "Переименовывать животных можно только в свой ход (сейчас ход другого игрока)",
                "rename-turn",
              );
            }
            if (!(st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId)) {
              throw new NetError("Переименовывать можно только своих животных", "rename-owner");
            }
            if (typeof sent.name !== "string" || sent.name.trim().length > 24) {
              throw new NetError("Имя животного — до 24 символов", "rename-length");
            }
          }
          throw new NetError("Такой ход сейчас недопустим", "move-illegal");
        }
        action = canonical;
      }
      // Каноническое состояние живёт с humanId=0, а движок сверяет с humanId
      // владельца животного: косметике (перестановка/кличка) на время применения
      // подставляем место ходящего и возвращаем канонический humanId обратно.
      const cosmetic = isReorder || isRename;
      const next = applyAction(cosmetic ? { ...st, humanId: me.seat } : st, action);
      if (cosmetic && next.humanId !== st.humanId) next.humanId = st.humanId;
      const finished = next.phase === "gameOver";
      const needsAuto = !finished && nextAutoStep(next) !== null;
      // Ход человека завершил фазу (например, «Закончить питание»): карточки
      // его событий — сводка вымирания и т.п. — должны проиграться ДО того,
      // как сервер двинет автошаги следующего этапа, иначе переход срезает
      // показ (см. spotlightMsOf).
      const humanGap = phaseGapMs(st, next);
      await casUpdateStrict(sql, code, room.version, {
        state: next,
        status: finished ? "finished" : undefined,
        // Таймер нужен только когда дальше идёт бот/автофаза; иначе лишний
        // пустой тик делал бы второй инкремент версии без события.
        autoStepAt: finished ? null : needsAuto ? now() + humanGap : null,
        eventsAppend: next.lastEvents.length ? next.lastEvents : undefined,
      });
      // Шаг бота НЕ делаем здесь: сначала клиент должен увидеть свой ход
      // (lastEvents своего действия), а автошаг произойдёт на следующем poll —
      // autoStepAt его и разбудит (сразу, либо после паузы на показ карточек).
      return snapshot(code, me.seat);
    },

    async poll(code, token, sinceVersion, sinceChatId, sinceReactionId) {
      if (Math.random() < 0.05) await janitor(sql).catch(() => {});
      const me = await seatByToken(code, token);
      // Метка присутствия до advance: свои же авточаги видят свежий онлайн.
      await sql
        .query(`update evo_seats set last_seen_at = now() where room_code = $1 and seat = $2`, [
          code,
          me.seat,
        ])
        .catch(() => {});
      let room = await readRoom(sql, code);
      if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
      room = await persistHost(code, room, await readSeats(sql, code));
      await advance(code);
      room = await readRoom(sql, code);
      if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
      if (sinceVersion !== undefined && sinceVersion === room.version) {
        const [seats, waiters, spectators, reactions] = await Promise.all([
          readSeats(sql, code),
          readWaiters(sql, code),
          readSpectators(sql, code, now),
          // Реакции отдаются инкрементально и в unchanged-кадре: иначе зритель
          // видит весь список заново и пузыри дублируются.
          readReactions(sql, code, sinceReactionId),
        ]);
        return {
          unchanged: true,
          seats: seatsInfo(seats, now),
          hostSeat: metaOf(room, seats, now, me.seat).hostSeat,
          capacity: room.capacity,
          waiters: waiterInfos(waiters, now),
          spectators,
          reactions,
          chat: await readChat(sql, code, sinceChatId),
        };
      }
      return snapshot(code, me.seat, { sinceVersion, sinceChatId, sinceReactionId });
    },

    async again({ code, token }) {
      // S8: новую партию инициирует только хост — иначе любой за столом
      // сбрасывал бы идущий финал остальным.
      const { room } = await requireHost(
        code,
        token,
        "Начать новую партию может только хост",
        "host-only",
      );
      if (room.status !== "finished") throw new NetError("Партия ещё не закончена", "game-running");
      // Новая партия — чистые места: флаги сдачи снимаются со всех.
      await sql.query(`update evo_seats set resigned = false where room_code = $1`, [code]);
      await casUpdateStrict(sql, code, room.version, {
        state: null,
        status: "lobby",
        autoStepAt: null,
        // Старые события не должны доехать до новой партии/лобби.
        events: [],
      });
    },
  };

  return service;
}

type GlobalRef = typeof globalThis & {
  __evoNetService__?: Promise<RoomService>;
};

/**
 * Методы-маркеры актуальности сервиса: по ним проверяем, что в кэше лежит
 * объект ТЕКУЩЕЙ версии кода, а не оставшийся от прошлой правки server.ts.
 * Пополняйте список вместе с RoomService — метод, которого здесь нет, от
 * старого объекта не защищён.
 */
const SERVICE_METHODS = [
  "create",
  "join",
  "listRooms",
  "setBots",
  "setName",
  "setColor",
  "setRoomPrivacy",
  "setPassword",
  "poll",
  "spectate",
  "typing",
] as const;

function hasServiceMethods(s: RoomService): boolean {
  const obj = s as unknown as Record<string, unknown>;
  return SERVICE_METHODS.every((m) => typeof obj[m] === "function");
}

/** Свежий сервис поверх общей БД (схема гарантируется на месте, см. DDL). */
function makeRoomService(): Promise<RoomService> {
  return import("@/lib/db").then(async ({ getSql }) => {
    const sql = await getSql();
    for (const statement of splitStatements(NET_TABLES_DDL)) await sql.query(statement);
    return createRoomService(sql as SqlLike);
  });
}

/**
 * Та же схема, что в migrations/0002_net_rooms.sql … 0008_chat_reactions_typing.sql,
 * но исполняется и в рантайме: на Vercel `db:migrate` выполняется на этапе
 * билда и молча пропускается, если DATABASE_URL не был виден процессу сборки.
 * Идемпотентно — можно вызывать всегда. Колонка M10 turn_deadline_at добавлена
 * здесь же через `add column if not exists`: миграции волны уже отыграны, а
 * alter идемпотентен и для живых, и для новых баз.
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
alter table evo_seats add column if not exists resigned boolean not null default false;
alter table evo_seats add column if not exists color text;
alter table evo_rooms add column if not exists modules jsonb not null default '{}';
alter table evo_rooms add column if not exists host_seat int;
alter table evo_rooms add column if not exists settings jsonb not null default '{}';
alter table evo_rooms add column if not exists events jsonb not null default '[]';
alter table evo_rooms add column if not exists is_private boolean not null default false;
alter table evo_rooms add column if not exists password text;
alter table evo_rooms add column if not exists turn_deadline_at timestamptz;
create index if not exists evo_rooms_public_idx on evo_rooms (is_private, created_at desc);
alter table evo_rooms drop constraint if exists evo_rooms_capacity_check;
alter table evo_rooms add constraint evo_rooms_capacity_check check (capacity between 2 and 8);
alter table evo_seats drop constraint if exists evo_seats_seat_check;
alter table evo_seats add constraint evo_seats_seat_check check (seat between 0 and 7);
create table if not exists evo_waiters (
  room_code  text not null references evo_rooms(code) on delete cascade,
  token      text not null,
  name       text not null,
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);
create table if not exists evo_chat (
  room_code  text not null references evo_rooms(code) on delete cascade,
  id         bigserial primary key,
  seat       int not null,
  name       text not null,
  text       text not null,
  created_at timestamptz not null default now()
);
create index if not exists evo_chat_room_id_idx on evo_chat (room_code, id);
create table if not exists evo_kicks (
  room_code  text not null references evo_rooms(code) on delete cascade,
  token      text not null,
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);
create table if not exists evo_spectators (
  room_code text not null references evo_rooms(code) on delete cascade,
  token text not null,
  name text not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);
create table if not exists evo_reactions (
  room_code text not null references evo_rooms(code) on delete cascade,
  id bigserial primary key,
  name text not null,
  emoji text not null,
  kind text not null default 'reaction' check (kind in ('reaction', 'cheer')),
  target_seat int,
  created_at timestamptz not null default now()
);
create index if not exists evo_reactions_room_id_idx on evo_reactions (room_code, id);
alter table evo_seats add column if not exists typing_at timestamptz;
alter table evo_waiters add column if not exists typing_at timestamptz;
alter table evo_spectators add column if not exists typing_at timestamptz;
alter table evo_reactions add column if not exists chat_id integer references evo_chat(id) on delete cascade;
`;

/**
 * Разбить DDL на отдельные команды: PGlite (локальный фолбэк) отказывается
 * исполнять мультизапрос через query() — «cannot insert multiple commands into
 * a prepared statement». Точка с запятой внутри строк/скобок в нашей схеме не
 * встречается, поэтому деления по «;» достаточно.
 */
export function splitStatements(ddl: string): string[] {
  return ddl
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Общий экземпляр для прод-сервера. @/lib/db импортируется динамически:
 * node-тесты подставляют свой SqlLike и никогда не трогают Vite-специфику db.ts.
 * Перед первым использованием гарантируем схему (см. NET_TABLES_DDL).
 *
 * Кэш в globalThis переживает HMR: без проверки актуальности после правок
 * server.ts клиент получал «s.setName is not a function» — старый объект
 * сервиса оставался без новых методов, и это стоило нескольких часов отладки.
 * Поэтому у закэшированного сервиса проверяем ключевые методы и пересоздаём
 * его при расхождении (плюс сброс кэша на import.meta.hot.dispose ниже).
 */
export function getRoomService(): Promise<RoomService> {
  const g = globalThis as GlobalRef;
  const cached = g.__evoNetService__;
  if (!cached) {
    // Сбой инициализации в кэше не оставляем: иначе одна ошибка БД ломала бы
    // сетевую игру до перезапуска процесса, хотя следующий запрос мог успеть.
    const fresh = makeRoomService().catch((e: unknown) => {
      if (g.__evoNetService__ === fresh) g.__evoNetService__ = undefined;
      throw e;
    });
    g.__evoNetService__ = fresh;
    return fresh;
  }
  return cached.then(
    (s) => {
      if (hasServiceMethods(s)) return s;
      const fresh = makeRoomService();
      g.__evoNetService__ = fresh;
      return fresh;
    },
    (e: unknown) => {
      if (g.__evoNetService__ === cached) g.__evoNetService__ = undefined;
      throw e;
    },
  );
}

// Vite-HMR перезагружает модуль, но globalThis остаётся: сбрасываем кэш сразу,
// не дожидаясь первого запроса (страховка к проверке методов в getRoomService).
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    delete (globalThis as GlobalRef).__evoNetService__;
  });
}

/** Для тестов: прямая проверка оптимистичной записи, чтения и кэша сервиса. */
export const _internals = { casUpdate, readRoom, hasServiceMethods };
