/**
 * Общий контракт сетевой партии: типы кадров опроса, zod-схемы входа и
 * серверные константы темпа. Импортируется и клиентом, и сервером;
 * единственный игровой тип здесь — сам GameState.
 */
import { z } from "zod";
import type {
  Difficulty,
  EnabledModules,
  GameAction,
  GameEvent,
  GameState,
  ModuleId,
} from "../../game/types.ts";

/** Минимальная поверхность SQL: удовлетворяется `Sql` из @/lib/db и тестовым PGlite. */
export interface SqlLike {
  <T = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]>;
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

export type RoomStatus = "lobby" | "playing" | "finished";

/**
 * Палитра мест — шестнадцать контрастных семейств под тёмную тему «атласа».
 * Единственный источник цвета для сетевых столов (сервер пишет его в
 * evo_seats.color) и для соло-партии: клиент раскрашивает игроков по индексу
 * места тем же набором. Цвет — публичная информация, маскировать его не нужно.
 *
 * Цвет эксклюзивен в пределах стола: сервер выдаёт при входе только свободный
 * (pickColor в server.ts) и отказывает в смене на занятый (setColor, код
 * color-taken) — за столом максимум 8 мест, поэтому 16 цветов хватает с запасом.
 *
 * Первые восемь — прежняя палитра (обратная совместимость старых строк БД):
 * терракота 45°, янтарь 83°, олива 121°, изумруд 158°, бирюза 200°, синий
 * 256°, фиолет 303°, малина 352°. Вторые восемь — «между» ними по тону,
 * с разведением по светлоте: коралл 13°, песок 56°, лайм 112°, мята 146°,
 * морская волна 184°, небесный 240°, лаванда 270°, фуксия 318°.
 *
 * Набор подобран так, чтобы цвета различались и по тону, и по светлоте
 * (различимость при дальтонизме — симуляция протанопии/дейтеранопии/
 * тританопии по Machado 2009), читались на тёмной подложке и выдерживали
 * контраст текста ≥ 4.5:1 на подложке места — `color-mix(in oklab, <цвет>
 * 12%, var(--color-surface))` (см. seatTint в game-app):
 * — OKLCH-светлота от 0.649 (фуксия) до 0.856 (песок/лайм/морская волна) —
 *   разница по светлоте сохраняется и при нарушении цветовосприятия;
 * — контраст на 12%-подложке от 4.5:1 (фуксия) до 8.8:1 (морская волна),
 *   на самой подложке --color-surface — от 5.2:1 до 11.2:1;
 * — минимум попарного OKLab-расстояния: 0.064 в норме, 0.057 при протанопии,
 *   0.049 при дейтеранопии, 0.055 при тританопии — добавление восьми новых
 *   цветов не снизило различимость исходной восьмёрки (её минимумы:
 *   0.049 дейтеранопия и 0.055 тританопия — пары янтарь/олива и изумруд/синий).
 * Тип PlayerColor, zod-enum и colorForSeat выводятся из массива: правки
 * в других местах не нужны — меняется только сам список.
 */
export const PLAYER_COLORS = [
  "#e27641", // терракота
  "#daa83b", // янтарь
  "#b2ca6a", // олива
  "#42bc80", // изумруд
  "#52d0d6", // бирюза
  "#5697ed", // синий
  "#c9a1fe", // фиолет
  "#f17cb3", // малина
  "#ffa3ad", // коралл
  "#f9c39d", // песок
  "#d2d959", // лайм
  "#63a068", // мята
  "#11efda", // морская волна
  "#81accb", // небесный
  "#b6c8ff", // лаванда
  "#ba79cf", // фуксия
] as const;
export type PlayerColor = (typeof PLAYER_COLORS)[number];

/** Цвет места: у старых строк его нет — детерминированно берём из палитры. */
export function colorForSeat(seat: number, stored?: string | null): string {
  if (stored && stored.trim()) return stored;
  return PLAYER_COLORS[Math.abs(seat) % PLAYER_COLORS.length]!;
}

export interface SeatInfo {
  seat: number;
  name: string;
  isAI: boolean;
  /** Активен за последнюю минуту (last_seen_at обновляется poll'ом). */
  online: boolean;
  /** Игрок сдался: место занято до конца партии, ходы пропускаются. */
  resigned: boolean;
  /** CSS-цвет места (hex): публичный, клиент красит имена и чат. */
  color: string;
  /**
   * Свежая отметка набора текста (netTyping, окно ~4 с): клиент поллингом
   * сам показывает «печатает…» без отдельного канала. Публично, как online.
   */
  typing: boolean;
}

/** Настройки стола, которые хост может менять до старта. */
export interface RoomSettings {
  modules?: EnabledModules;
  difficulty?: Difficulty;
  /** Целевой размер колоды свойств (см. createGame/6-й аргумент). */
  deckSize?: number;
}

/** Ожидающий места в лобби. Токен наружу не отдаётся. */
export interface WaiterInfo {
  name: string;
  /** Время постановки в очередь (мс эпохи). */
  at: number;
  /** Свежая отметка набора текста (netTyping): тот же смысл, что у SeatInfo. */
  typing: boolean;
}

export interface RoomMeta {
  code: string;
  status: RoomStatus;
  capacity: number;
  /** Сохранённый хост; если он вышел — переданный следующему онлайн-человеку. */
  hostSeat: number;
  settings: RoomSettings;
  /** Приватный стол: закрыт для входа без пароля, виден в колонке «Закрытые». */
  isPrivate: boolean;
  /**
   * Пароль стола (4 цифры) — приходит ТОЛЬКО хосту: ему его показывать и
   * пересылать гостям. Остальным null: садиться за стол и наблюдать его они
   * будут паролем, который им сообщил хост (см. join/spectate).
   */
  password: string | null;
}

/**
 * Строка списка столов в главном меню: только публичная информация о живых
 * комнатах — включая закрытые, чтобы их было видно в колонке «Закрытые»
 * (пароль сервер спрашивает при входе). Токены и пароли сюда не попадают.
 */
export interface RoomSummary {
  code: string;
  status: RoomStatus;
  capacity: number;
  /** Занято мест (люди и боты). */
  taken: number;
  /** Свободно мест: capacity - taken. */
  free: number;
  /** Имя хоста для карточки стола. */
  hostName: string;
  difficulty: Difficulty;
  /** Включённые дополнения — кратко, для бейджей. */
  modules: ModuleId[];
  /** Время создания (мс эпохи): свежие столы выше в списке. */
  createdAt: number;
  /** Закрытый стол: вход по паролю (сам пароль наружу не отдаётся). */
  isPrivate: boolean;
}

/**
 * Батч событий одного применённого шага партии: версия состояния ПОСЛЕ шага.
 * Клиент воспроизводит их по порядку, чтобы при отставании поллинга не терять
 * промежуточные анимации. Скрытые свойства обезличиваются на сервере (views).
 */
export interface EventBatch {
  version: number;
  events: GameEvent[];
}

/** Сообщение чата; seat = -1 у ожидающего места. */
export interface ChatMessage {
  id: number;
  seat: number;
  name: string;
  text: string;
  /** Время отправки (мс эпохи). */
  at: number;
}

/** Набор реакций стола (захардкожен и на сервере — см. reactionInput). */
export const REACTION_EMOJI = ["👏", "🌿", "🔥", "😮", "💚"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJI)[number];

/** Короткая реакция/поощрение зрителя или игрока. */
export interface ReactionMessage {
  id: number;
  name: string;
  emoji: ReactionEmoji;
  kind: "reaction" | "cheer";
  targetSeat: number | null;
  /**
   * Реплика чата, на которую поставлена реакция (M12); null — реакция «в стол»
   * или «болельщику». Сообщение обязано принадлежать этой же комнате.
   */
  chatId: number | null;
  at: number;
}

/** Зритель не занимает место игрока и видит только публичный вид стола. */
export interface SpectatorInfo {
  name: string;
  online: boolean;
  /** Свежая отметка набора текста (netTyping): тот же смысл, что у SeatInfo. */
  typing: boolean;
}

/** Полный снимок комнаты для клиента; state === null в лобби. */
export interface PollResult {
  version: number;
  room: RoomMeta;
  seats: SeatInfo[];
  state: GameState | null;
  /** Место запрашивающего (по токену). */
  seat: number;
  /** Батчи событий с version > sinceVersion; без sinceVersion — пусто. */
  events: EventBatch[];
  /** Сообщения чата: id > sinceChatId либо последние 50 при подключении. */
  chat: ChatMessage[];
  /** Очередь ожидающих (виден всем в лобби, токенов здесь нет). */
  waiters: WaiterInfo[];
  /** Зрители комнаты (без токенов). */
  spectators: SpectatorInfo[];
  /** Новые реакции после sinceReactionId (либо последние при подключении). */
  reactions: ReactionMessage[];
  /**
   * M10: когда сервер сам закончит ход человека, у которого не осталось
   * действий (epoch ms, серверные часы); null — таймера нет. Клиент рисует
   * по этой метке круговой отсчёт у имени ходящего.
   */
  turnDeadlineAt: number | null;
  /**
   * Серверное «сейчас» (epoch ms): клиент считает по нему смещение своих
   * часов, чтобы отсчёт не зависел от неточных часов устройства.
   */
  serverNow: number;
}

/** Ответ poll'а «ничего не изменилось»: онлайны обновляются без смены версии. */
export interface UnchangedPoll {
  unchanged: true;
  seats: SeatInfo[];
  hostSeat: number;
  capacity: number;
  waiters: WaiterInfo[];
  spectators: SpectatorInfo[];
  reactions: ReactionMessage[];
  /** Чат доезжает и в unchanged-кадре, иначе он «залипает» при паузе партии. */
  chat: ChatMessage[];
}

/** Кадр для ожидающего: лобби-информация без состояния партии. */
export interface RoomInfo {
  room: RoomMeta;
  seats: SeatInfo[];
  waiters: WaiterInfo[];
  /** Сколько мест свободно. */
  freeSeats: number;
  /** Токен ещё в очереди. */
  queued: boolean;
  /** 1-based позиция в очереди; null — токена в очереди нет. */
  position: number | null;
  /** Первое свободное место (для авто-занятия); null — свободных нет. */
  freeSeat: number | null;
  chat: ChatMessage[];
  spectators: SpectatorInfo[];
  reactions: ReactionMessage[];
}

/** Результат входа зрителем: отдельный токен, место игрока не занято. */
export interface SpectateResult {
  token: string;
}

/** Кадр зрителя: публичный viewFor с humanId=-1 и без скрытых данных. */
export interface SpectatorSnapshot {
  version: number;
  room: RoomMeta;
  seats: SeatInfo[];
  state: GameState | null;
  spectators: SpectatorInfo[];
  chat: ChatMessage[];
  reactions: ReactionMessage[];
  /** См. PollResult.turnDeadlineAt: отсчёт авто-конца хода виден и зрителям. */
  turnDeadlineAt: number | null;
  /** См. PollResult.serverNow. */
  serverNow: number;
}

/** Результат join: место занято либо человек поставлен в очередь. */
export interface JoinResult {
  /** -1, если место не досталось и клиент ждёт в очереди. */
  seat: number;
  token: string;
  waiting: boolean;
}

/**
 * Серверные паузы авточагов (мс) и прочие константы: боты и автофазы
 * двигаются лениво при любом запросе к комнате, темп не зависит от
 * клиентского переключателя скорости (тот — только для одиночной игры).
 */
export const PACE = {
  diceMs: 1600,
  extinctMs: 1800,
  botMs: 1000,
  turnGapMs: 500,
  jitterMs: 200,
  initialMs: 600,
  maxStepsPerTick: 8,
  onlineMs: 10_000,
  roomTtlHours: 12,
  /**
   * M10: ход человека без действий (остался только пас/завершение хода)
   * сервер заканчивает сам через столько миллисекунд. Пока действия есть —
   * таймера нет (решение владельца Q2). Константа общая с клиентом: по ней
   * клиент считает долю кругового индикатора.
   */
  idleTurnMs: 30_000,
} as const;

const NAME = z.string().trim().min(1).max(16);
/**
 * Алфавит кодов комнат: без похожих I/L/O/0/1 — код диктуют голосом и
 * пересылают в мессенджере. Единственный источник и для генерации
 * (makeCode в server.ts), и для валидации входа (S11: раньше пропускались
 * любые 4 символа — код уезжал в URL и localStorage как есть).
 */
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE = z
  .string()
  .trim()
  .length(4)
  .regex(new RegExp(`^[${CODE_ALPHABET}]{4}$`), {
    message: "Код стола — 4 буквы (латиница без I, L, O)",
  });
const DIFFICULTY = z.enum(["easy", "normal", "hard"]);
const MODULES = z
  .object({
    continents: z.boolean().optional(),
    plants: z.boolean().optional(),
    fungi: z.boolean().optional(),
    randomMutations: z.boolean().optional(),
  })
  .partial();

/** Настройки стола: модули проверяются белым списком. */
export const roomSettingsSchema = z.object({
  modules: MODULES.optional(),
  difficulty: DIFFICULTY.optional(),
  /** Границы — разумная вилка вокруг DECK_SIZE (84) с учётом всех модулей. */
  deckSize: z.number().int().min(20).max(400).optional(),
});

export const createRoomInput = z.object({
  name: NAME,
  capacity: z.union([
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
  ]),
  botSeats: z.number().int().min(0).max(7),
  difficulty: DIFFICULTY satisfies z.ZodType<Difficulty>,
  /** Включённые дополнения; ключи валидируются строго (белый список). */
  modules: MODULES.default({}).optional(),
  /** Целевой размер колоды на старте; хранится в settings комнаты. */
  deckSize: z.number().int().min(20).max(400).optional(),
  /** Приватный стол: вход по паролю, в меню виден в колонке «Закрытые». */
  isPrivate: z.boolean().optional(),
  /** Пароль приватного стола; пусто — сервер сгенерирует 4 цифры. */
  password: z.string().trim().max(16).optional(),
});
export type CreateRoomInput = z.infer<typeof createRoomInput>;

/** Пароль стола: ровно 4 цифры (столько генерирует сервер по умолчанию). */
export const ROOM_PASSWORD_LEN = 4;

export const joinRoomInput = z.object({
  code: CODE,
  name: NAME,
  /**
   * Пароль нужен ТОЛЬКО чтобы сесть за стол. Длина не фиксирована: неверный
   * пароль должен получить машиночитаемый `password-wrong` с понятным
   * текстом, а не ошибку валидации схемы.
   */
  password: z.string().trim().max(16).optional(),
});
export const codeTokenInput = z.object({ code: CODE, token: z.string().min(10) });
/** Смена имени в лобби/очереди/у зрителя: та же валидация, что у входа. */
export const setNameInput = codeTokenInput.extend({ name: NAME });
export const botsInput = codeTokenInput.extend({ count: z.number().int().min(0).max(7) });
export const actionInput = z.object({
  code: CODE,
  token: z.string().min(10),
  action: z.custom<GameAction>((v) => typeof v === "object" && v !== null && "type" in v),
});
export const pollInput = codeTokenInput.extend({
  sinceVersion: z.number().int().optional(),
  sinceChatId: z.number().int().optional(),
  sinceReactionId: z.number().int().optional(),
});
export const roomInfoInput = codeTokenInput.extend({
  sinceChatId: z.number().int().optional(),
  sinceReactionId: z.number().int().optional(),
});
export const spectateInput = z.object({
  code: CODE,
  name: NAME,
  /**
   * Пароль приватного стола (S5): наблюдать закрытый стол без пароля нельзя —
   * тот же механизм, что у join. Для открытого стола поле не нужно.
   */
  password: z.string().trim().max(16).optional(),
});
export const spectatorPollInput = codeTokenInput.extend({
  sinceChatId: z.number().int().optional(),
  sinceReactionId: z.number().int().optional(),
});
export const reactionInput = codeTokenInput.extend({
  emoji: z.enum(REACTION_EMOJI),
  kind: z.enum(["reaction", "cheer"]),
  targetSeat: z.number().int().min(0).max(7).nullable().optional(),
  /**
   * Реакция на конкретную реплику чата (M12): сервер проверит, что сообщение
   * принадлежит ЭТОЙ комнате. Без chatId — прежняя реакция «в стол»/игроку.
   */
  chatId: z.number().int().positive().nullable().optional(),
});
/** Сигнал «печатает…»: только факт свежести, самого текста сервер не видит. */
export const typingInput = codeTokenInput;
export const kickInput = codeTokenInput.extend({ seat: z.number().int().min(0).max(7) });
export const capacityInput = codeTokenInput.extend({
  capacity: z.number().int().min(2).max(8),
});
export const settingsInput = codeTokenInput.extend({ settings: roomSettingsSchema });
/** Доступ к столу: приватность и (опционально) новый пароль. */
export const setRoomPrivacyInput = codeTokenInput.extend({
  isPrivate: z.boolean(),
  regenerate: z.boolean().optional(),
});
/**
 * Смена пароля стола хостом (только лобби): ровно ROOM_PASSWORD_LEN цифр —
 * тот же формат, что у сгенерированного пароля (его диктуют голосом).
 */
export const setPasswordInput = codeTokenInput.extend({
  password: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${ROOM_PASSWORD_LEN}}$`), {
      message: `Пароль стола — ${ROOM_PASSWORD_LEN} цифры`,
    }),
});
/** Смена цвета своего места — только из палитры PLAYER_COLORS. */
export const setColorInput = codeTokenInput.extend({ color: z.enum(PLAYER_COLORS) });
/** Пустой валидатор листинга: createServerFn требует схему даже без полей. */
export const listRoomsInput = z.object({});
export const transferHostInput = codeTokenInput.extend({ seat: z.number().int().min(0).max(7) });
export const kickWaiterInput = codeTokenInput.extend({ index: z.number().int().min(0).max(99) });
/** Верхняя граница выше лимита в 400 символов: сервер обрезает, а не ругается. */
export const chatInput = codeTokenInput.extend({ text: z.string().trim().min(1).max(2000) });
