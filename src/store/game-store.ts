import { create } from "zustand";
import { legalDefenseActions, legalDevActions, legalFeedActions } from "@/game/engine";
import type { Difficulty, GameAction, GameScenario, GameSpeed, GameState, ModuleId, MutatorId, TableRules } from "@/game/types";
import {
  TUTORIAL_MISSIONS,
  loadActiveMission,
  loadDoneMissions,
  saveActiveMission,
  saveDoneMission,
  type TutorialMissionId,
} from "@/game/tutorial";
import type { CampaignEraId } from "@/game/campaign";
import {
  applyReward,
  clearCurrentNode,
  createCampaignRun,
  loadCampaignRun,
  loseRun,
  saveCampaignRun,
  type CampaignRun,
  type RunReward,
} from "@/game/campaign-run";
import { CampaignHost, speedFactorOf } from "@/game/campaign-host";
import { t, type TParams, type TKey } from "@/lib/i18n";
import { NetClientError, NetSession, fetchRoomList, forgetSession, hasStoredSeatSession, hasStoredSession, loadName, type NetHooks, type NetStatus, type PendingNetItem } from "@/lib/net/session";
import type {
  ChatMessage,
  EventBatch,
  PlayerColor,
  ReactionEmoji,
  ReactionMessage,
  RoomSettings,
  RoomSummary,
  SeatInfo,
  SpectatorInfo,
  TurnTimerMs,
  WaiterInfo,
} from "@/lib/net/shared";
import { colorForSeat } from "@/lib/net/shared";

export type UiIntent =
  | { kind: "none" }
  | { kind: "playAnimal"; cardId: string }
  | { kind: "placeAnimal"; cardId: string }
  | { kind: "playTrait"; cardId: string; face: number }
  | { kind: "playPair"; cardId: string; face: number; first?: string }
  | { kind: "playPlantTrait"; cardId: string; face: number }
  | { kind: "playPlantPair"; cardId: string; face: number; first?: string }
  | { kind: "hunt"; carnivoreId?: string }
  | { kind: "pirate"; pirateId?: string }
  | { kind: "take" }
  /** «Растения»: взять еду — животное, затем растение. */
  | { kind: "takePlant"; animalId?: string }
  /** «Трава и грибы»: взять еду — животное, затем карту флоры. */
  | { kind: "takeFlora"; animalId?: string }
  /** «Растения»: занять убежище — животное, затем растение. */
  | { kind: "shelter"; animalId?: string }
  /** «Растения»: направить хищное растение — растение, затем жертва. */
  | { kind: "plantAttack"; plantId?: string }
  /** «Растения»: перекинуть фишку хозяина на растение-паразит. */
  | { kind: "parasitize" }
  | { kind: "hibernate" }
  | { kind: "fat" }
  | { kind: "graze"; animalId?: string }
  /** «Случайные мутации»: объявление розыгрыша верхней карты личной колоды. */
  | { kind: "mutateNew" }
  | { kind: "mutateTrait" }
  | { kind: "mutatePop" }
  | { kind: "mutatePlant" };

/**
 * Событие стола для журнала/чата: «вошёл», «вышел», «сдался», «наблюдает».
 * Локализация (волна 8): ключ + параметры; `text` собирается в момент
 * создания на текущем языке (его показывает лобби, которому ключей не нужно),
 * а партия при lang=en перерисовывает записи прямо по key.
 */
export interface TableNote {
  id: string;
  text: string;
  at: number;
  /** Ключ словаря (ru.ts/en.ts) — рендер журнала переводит по нему. */
  key?: TKey;
  /** Параметры подстановки (имена игроков). */
  params?: TParams;
}

/** Отклонённая оптимистичная реакция: лента должна вернуть исходный вид. */
export interface ReactionFailure {
  chatId: number | null;
  emoji: ReactionEmoji;
  at: number;
}

// ── локализация сетевых сообщений стора ─────────────────────────────────────

/**
 * Код сетевой ошибки/фатала → ключ словаря. Сервер не знает языка клиента и
 * присылает код; стор подставляет перевод в момент показа. Неизвестный код —
 * показываем исходный текст сервера (русский).
 */
const NET_ERR_KEYS: Record<string, TKey> = {
  kicked: "netErr.kicked",
  "seat-taken": "netErr.seatTaken",
  "room-gone": "netErr.roomGoneCheck",
  "password-required": "netErr.passwordRequired",
  "password-wrong": "netErr.passwordWrong",
  "password-format": "netErr.passwordFormat",
  "move-illegal": "netErr.moveIllegal",
  resigned: "netErr.resigned",
  "not-playing": "netErr.notPlaying",
  "reorder-phase": "netErr.reorderPhase",
  "reorder-turn": "netErr.reorderTurn",
  "reorder-owner": "netErr.reorderOwner",
  "rename-phase": "netErr.renamePhase",
  "rename-turn": "netErr.renameTurn",
  "rename-owner": "netErr.renameOwner",
  "rename-length": "netErr.renameLength",
  "color-taken": "netErr.colorTaken",
  "chat-empty": "netErr.chatEmpty",
  "rate-limit": "netErr.rateLimit",
  "rate-fast": "netErr.rateFast",
  "reaction-limit": "netErr.reactionLimit",
  "reaction-missing": "netErr.reactionMissing",
  "probe-limit": "netErr.probeLimit",
  "entry-limit": "netErr.entryLimit",
  "create-limit": "netErr.createLimit",
  "queue-full": "netErr.queueFull",
  "host-only": "netErr.hostOnly",
  "lobby-only": "netErr.lobbyOnly",
  "game-started": "netErr.gameStarted",
  "game-finished": "netErr.gameFinished",
  "game-running": "netErr.gameRunning",
  "seats-unfinished": "netErr.seatsUnfinished",
  "no-free-seats": "netErr.noFreeSeats",
  "seat-race": "netErr.seatRace",
  retry: "netErr.retry",
  "not-in-queue": "netErr.notInQueue",
  "started-without-you": "netErr.startedWithoutYou",
  "too-many-bots": "netErr.tooManyBots",
  "code-failed": "netErr.codeFailed",
  "kick-self": "netErr.kickSelf",
  "seat-free": "netErr.seatFree",
  "kick-bot": "netErr.kickBot",
  "bad-color": "netErr.badColor",
  "color-seat": "netErr.colorSeat",
  "bot-color": "netErr.botColor",
  "host-human": "netErr.hostHuman",
  "waiter-gone": "netErr.waiterGone",
  "players-offline": "netErr.playersOffline",
  "player-online": "netErr.playerOnline",
  "bot-chat": "netErr.botChat",
  "bot-resign": "netErr.botResign",
  "bot-rename": "netErr.botRename",
  "empty-name": "netErr.emptyName",
  "seat-missing": "netErr.seatMissing",
  "modules-incompatible": "netErr.modulesIncompatible",
  "close-people": "netErr.closePeople",
  generic: "netErr.generic",
  offline: "netErr.offline",
  invalidResponse: "netErr.invalidResponse",
};

/** Текст ошибки для показа: известный код переводим, неизвестный не пропускаем игроку. */
function netErrorText(_error: string, code?: string): string {
  const key = code ? NET_ERR_KEYS[code] : undefined;
  if (key) return t(key);
  return code ? t("netErr.generic") : t("netErr.invalidResponse");
}

/**
 * Исключение клиентского сетевого слоя → безопасный текст без stack/Zod плюс
 * машинный код ошибки. Код нужен веткам UI (например, плашке «игроки не в
 * сети» в лобби): они не должны парсить локализованный текст.
 */
function caughtNetError(e: unknown): { text: string; code: string | null } {
  if (e instanceof NetClientError) return { text: netErrorText(e.message, e.code), code: e.code ?? null };
  const code = e instanceof TypeError ? "offline" : "invalidResponse";
  return { text: netErrorText("", code), code };
}

/** Повтор неотправленного хода обязан сохранить actionId для идемпотентности. */
function sameNetAction(left: GameAction | undefined, right: GameAction): boolean {
  return Boolean(left && JSON.stringify(left) === JSON.stringify(right));
}

/** Тост именно про потерю отправки, а не только про состояние соединения. */
function unsentNetErrorText(): string {
  return `${t("net.unsent")} ${t("netErr.offline")}`;
}

/** Пояснение экрана ожидания по коду из сессии. */
function waitNoteText(code: string): string {
  if (code === "capacity-shrunk") return t("net.waitNote.capacityShrunk");
  return code;
}

/** Предыдущий срез состава — по нему считаем, кто пришёл и кто ушёл. */
let prevTable: {
  seats: SeatInfo[];
  waiters: WaiterInfo[];
  spectators: SpectatorInfo[];
} | null = null;

/** Забыть состав: при входе за новый стол события не должны «догонять» старые. */
export function resetTableNotes(): void {
  prevTable = null;
}

/**
 * Системные сообщения о составе стола: клиентский дифф кадров — сервер про
 * вход и выход ничего не пишет, а игрокам это важно видеть в чате, как лог.
 * Первый кадр пропускаем: иначе при заходе в стол сыпались бы «вошёл» на всех.
 */
function diffTableNotes(
  prev: typeof prevTable,
  next: { seats: SeatInfo[]; waiters: WaiterInfo[]; spectators: SpectatorInfo[] },
  mySeat: number,
): TableNote[] {
  if (!prev) return [];
  const at = Date.now();
  const notes: TableNote[] = [];
  /** Запись с ключом словаря: text — перевод на текущем языке (для лобби). */
  const push = (key: TKey, params: TParams, id: string) =>
    notes.push({ id: `sys-${id}-${at}-${notes.length}`, text: t(key, params), at, key, params });

  const prevSeats = new Map(prev.seats.map((s) => [s.name, s]));
  for (const s of next.seats) {
    const was = prevSeats.get(s.name);
    if (!was) {
      if (s.seat !== mySeat) push("tableNote.joined", { name: s.name }, `in-${s.name}`);
      continue;
    }
    if (was.online && !s.online) push("tableNote.lostConnection", { name: s.name }, `off-${s.name}`);
    else if (!was.online && s.online) push("tableNote.back", { name: s.name }, `on-${s.name}`);
    if (!was.resigned && s.resigned) push("tableNote.resigned", { name: s.name }, `res-${s.name}`);
  }
  for (const s of prev.seats) {
    if (!next.seats.some((x) => x.name === s.name)) push("tableNote.left", { name: s.name }, `out-${s.name}`);
  }

  const prevWaiters = new Set(prev.waiters.map((w) => w.name));
  for (const w of next.waiters) {
    if (!prevWaiters.has(w.name)) push("tableNote.queued", { name: w.name }, `wait-${w.name}`);
  }
  for (const w of prev.waiters) {
    if (!next.waiters.some((x) => x.name === w.name)) push("tableNote.unqueued", { name: w.name }, `unwait-${w.name}`);
  }

  const prevSpectators = new Set(prev.spectators.map((s) => s.name));
  for (const s of next.spectators) {
    if (!prevSpectators.has(s.name)) push("tableNote.watching", { name: s.name }, `spec-${s.name}`);
  }

  return notes;
}

/** Сетевой стол в UI: что показывают лобби и баннер соединения. */
export interface NetUiState {
  code: string;
  seat: number;
  /** Своё имя на этом столе (лобби/очередь/зритель); меняется экшеном netSetName. */
  name: string;
  status: NetStatus;
  error: string | null;
  /** Машинный код той же ошибки (players-offline, player-online, offline…): UI ветвит по нему, не по тексту. */
  errorCode: string | null;
  /** Последний action/chat без ACK; после transport-error остаётся для повтора. */
  pending: PendingNetItem | null;
  /** Что сейчас реально ждёт сервер; pending после ошибки уже не «в полёте». */
  sending: "action" | "chat" | "reaction" | null;
  seats: SeatInfo[];
  hostSeat: number;
  capacity: number;
  /** Клиент сдался: ходы за него пропускает сервер, кнопка сдачи гаснет. */
  resigned: boolean;
  /** Мест не хватило — клиент ждёт в очереди. */
  waiting: boolean;
  /** 1-based позиция в очереди; null — не в очереди. */
  waiterPosition: number | null;
  /** Пояснение к экрану ожидания (например, «хост уменьшил число мест»). */
  waitNote: string | null;
  /** Очередь ожидающих (без токенов) — хост видит её в лобби. */
  waiters: WaiterInfo[];
  /** Эффективные настройки стола: модули/сложность/размер колоды. */
  settings: RoomSettings;
  /** Стол приватный: вход по паролю, колонка «Закрытые» в меню. */
  isPrivate: boolean;
  /** Пароль приватного стола — приходит только хосту (см. RoomMeta.password). */
  password: string | null;
  /** Последние ~200 сообщений чата. */
  chat: ChatMessage[];
  /** Системные события стола: вход, выход, сдача, наблюдение — для журнала. */
  system: TableNote[];
  /** Батчи событий по версиям — очередь воспроизведения для UI. */
  events: EventBatch[];
  /** Клиент — зритель: ходы и действия запрещены, вид только публичный. */
  spectating: boolean;
  /** Зрители стола (без токенов). */
  spectators: SpectatorInfo[];
  /** Последние реакции (буфер для всплывающих пузырей и чипов под репликами). */
  reactions: ReactionMessage[];
  /** Последний отказ сервера: optimistic-реакция под этой репликой откатывается. */
  reactionFailure: ReactionFailure | null;
  /**
   * M10: когда сервер сам закончит ход человека без действий (epoch ms по
   * серверным часам) или null — таймера нет. Круговой отсчёт у имени ходящего.
   */
  turnDeadlineAt: number | null;
  /**
   * Следующий автошаг сервера, когда ходит БОТ (epoch ms по серверным часам);
   * null — сейчас не ход бота. По ней тикает бейдж на табло активного бота:
   * у ботов нет дедлайна конца хода, есть только темп шагов.
   */
  botStepAt: number | null;
  /**
   * Смещение часов клиента относительно сервера (serverNow − Date.now()):
   * отсчёт считается по серверной метке, а не по часам устройства.
   */
  serverOffsetMs: number;
}

/**
 * Сравнить два значения сетевого среза по содержимому, а не по ссылке.
 * Сервер отдаёт новый массив даже для неизменившегося кадра; глубокое
 * сравнение здесь дешевле лишнего рендера стола и не меняет публичные поля.
 */
function netValueEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object") {
    return false;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
    return left.every((value, index) => netValueEqual(value, right[index]));
  }
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every(
    (key) => Object.prototype.hasOwnProperty.call(rightRecord, key) && netValueEqual(leftRecord[key], rightRecord[key]),
  );
}

/**
 * Наложить патч на срез стола, сохранив ссылку, если логических изменений
 * нет. Это защищает подписчиков `s.net` от каждого unchanged-кадра.
 */
export function mergeNetState(current: NetUiState, patch: Partial<NetUiState>): NetUiState {
  let next: NetUiState | null = null;
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    const typedKey = key as keyof NetUiState;
    if (netValueEqual(current[typedKey], value)) continue;
    next ??= { ...current };
    (next as unknown as Record<string, unknown>)[key] = value;
  }
  return next ?? current;
}

/**
 * Кто сейчас печатает (кроме меня) — для строки «Аня печатает…» над
 * композером. Метки `typing` приходят с каждым кадром (окно ~4 с у сервера),
 * поэтому индикатор гаснет сам, без отдельного таймера на клиенте. Своё имя
 * исключаем: свои же пинги возвращаются в кадре, и «вы печатаете» ни к чему.
 */
export function typingNamesOf(net: NetUiState): string[] {
  const names: string[] = [];
  const push = (name: string) => {
    if (name && name !== net.name && !names.includes(name)) names.push(name);
  };
  for (const s of net.seats) if (!s.isAI && s.typing) push(s.name);
  for (const w of net.waiters) if (w.typing) push(w.name);
  for (const s of net.spectators) if (s.typing) push(s.name);
  return names;
}

/**
 * Стол, где человек играет ТОЛЬКО с ботами (обучение, кампания, соло с ботами):
 * все остальные места — ИИ, клиент занимает своё место и не зритель/не ожидающий.
 * Такой стол закрывается целиком при любом уходе (#3) — возвращаться за ним
 * некому, а висящая «идущая» комната в меню и есть та самая жалоба. Пустой
 * состав (кадра ещё не было) закрывать нельзя: за столом могут появиться люди.
 */
export function isSoloBotTable(net: NetUiState | null): boolean {
  if (!net || net.spectating || net.waiting || net.seat < 0) return false;
  const others = net.seats.filter((s) => s.seat !== net.seat);
  return others.length > 0 && others.every((s) => s.isAI);
}

export interface NetCreateConfig {
  name: string;
  capacity: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  botSeats: number;
  difficulty: Difficulty;
  /** Включённые дополнения стола (пока «Континенты»). */
  modules?: Partial<Record<ModuleId, boolean>>;
  /** Целевой размер колоды свойств (по умолчанию — полный состав). */
  deckSize?: number;
  /** Волна 2: модификаторы стола — правила, мутаторы, «Дикий мир». */
  rules?: TableRules;
  mutators?: Partial<Record<MutatorId, boolean>>;
  wildWorld?: boolean;
  /** Волна 4а: сценарий изверга (кампания) — сервер валидирует сид. */
  scenario?: GameScenario;
  /** Приватный стол: вход по паролю, колонка «Закрытые» в меню. */
  isPrivate?: boolean;
  /** Пароль приватного стола; пусто — сервер сгенерирует 4 цифры. */
  password?: string;
  /** Таймер хода (мс, TURN_TIMER_CHOICES; 0 = «Выкл»); правится в лобби. */
  turnTimerMs?: TurnTimerMs;
}

/** Пустое состояние стола до первого кадра сервера (create/join/watch). */
function netStartState(patch: Partial<NetUiState> = {}): NetUiState {
  return {
    code: "",
    seat: -1,
    name: loadName(),
    status: "connecting",
    error: null,
    errorCode: null,
    pending: null,
    sending: null,
    seats: [],
    // -1, а не 0: до первого кадра место/хост неизвестны, и «я хост» не
    // должно мелькать у гостя (хостом он станет только по кадру сервера).
    hostSeat: -1,
    capacity: 0,
    resigned: false,
    waiting: false,
    waiterPosition: null,
    waitNote: null,
    waiters: [],
    settings: {},
    isPrivate: false,
    password: null,
    chat: [],
    system: [],
    events: [],
    spectating: false,
    spectators: [],
    reactions: [],
    reactionFailure: null,
    turnDeadlineAt: null,
    botStepAt: null,
    serverOffsetMs: 0,
    ...patch,
  };
}

interface GameStore {
  state: GameState | null;
  intent: UiIntent;
  rulesOpen: boolean;
  logOpen: boolean;
  /** Непрочитанные записи журнала: бейдж на кнопке журнала в шапке. */
  logUnread: number;
  setLogUnread: (n: number) => void;
  /**
   * Темп локального воспроизведения событий стола (множитель в spotlight).
   * Ходы ботов и автофазы двигает сервер — на них скорость не влияет.
   */
  speed: GameSpeed;
  /**
   * Режим анимаций (волна 1, дизайн-пакет §2.3): «full» — все живые эффекты,
   * «fast» — укороченные, «off» — выключены (CSS читает [data-anim] на <html>,
   * атрибут ставит GameApp). Настольная аудитория старше среднего — настройка
   * обязана существовать.
   */
  animMode: AnimMode;
  net: NetUiState | null;
  /** Текст фатальной сетевой ошибки (кик/закрытый стол) после выхода в меню. */
  netFatal: string | null;
  /** Список публичных столов для главного меню (поллинг панели меню). */
  rooms: RoomSummary[];
  dispatch: (action: GameAction) => void;
  setIntent: (intent: UiIntent) => void;
  setRulesOpen: (v: boolean) => void;
  setLogOpen: (v: boolean) => void;
  setSpeed: (v: GameSpeed) => void;
  setAnimMode: (v: AnimMode) => void;
  /** Экипированная косметика (волна 3б): слот → item id; грузится profileGet. */
  equippedCosmetics: Partial<Record<string, string>>;
  setEquippedCosmetics: (v: Partial<Record<string, string>>) => void;
  /** Обучение (волна 1.5): активная миссия поверх обычной сетевой партии. */
  tutorialMission: TutorialMissionId | null;
  /** Пройденные миссии (localStorage evo-tutorial) — галочки в меню. */
  doneMissions: TutorialMissionId[];
  startTutorial: (id: TutorialMissionId, name: string) => Promise<void>;
  clearTutorial: () => void;
  completeTutorial: (id: TutorialMissionId) => void;
  /** Кампания-рогалик (фундамент): локальный забег за эпоху на чистом движке. */
  campaignRun: CampaignRun | null;
  /** Новый забег за эпоху и сразу бой первого узла. */
  startCampaignRun: (era: CampaignEraId, name: string) => void;
  /** Возобновить сохранённый матч забега (кнопка «Продолжить» и F5). */
  continueCampaignRun: () => void;
  /** Начать бой текущего боевого узла (после награды или потери матча). */
  campaignStartBattle: () => void;
  /** Выбрать награду узла: усиление в заначку, курсор — на следующий узел. */
  campaignApplyReward: (reward: RunReward) => void;
  /** Удалить забег целиком (сдаться навсегда). */
  abandonCampaignRun: () => void;
  startNetCreate: (cfg: NetCreateConfig) => Promise<void>;
  /** Войти за стол; password — только для приватного (см. NetClientError). */
  startNetJoin: (code: string, name: string, password?: string) => Promise<void>;
  /** Возврат за сохранённое место по ссылке ?room=КОД; false — не вышло. */
  resumeNetFromUrl: (code: string) => Promise<boolean>;
  /** Обновить список публичных столов в меню (поллинг раз в ~4 с). */
  netRefreshRooms: () => Promise<void>;
  netAddBots: (delta: number) => Promise<void>;
  netStart: () => Promise<void>;
  netAgain: () => Promise<void>;
  /** Кик игрока (хост, лобби) или превращение в бота (в партии). */
  netKick: (seat: number) => Promise<void>;
  netSetCapacity: (capacity: number) => Promise<void>;
  netSetSettings: (patch: RoomSettings) => Promise<void>;
  /** Доступ к столу (хост): открытый/приватный и новый пароль. */
  netSetRoomPrivacy: (isPrivate: boolean, regenerate?: boolean) => Promise<void>;
  /** Сменить пароль стола (хост, лобби, 4 цифры); ok=false — текст ошибки. */
  netSetPassword: (password: string) => Promise<{ ok: boolean; error?: string }>;
  /** Смена цвета своего места в лобби (цвет из PLAYER_COLORS). */
  netSetColor: (color: PlayerColor) => Promise<void>;
  netTransferHost: (seat: number) => Promise<void>;
  /** Убрать ожидающего по индексу в очереди. */
  netKickWaiter: (index: number) => Promise<void>;
  /** Выйти из очереди ожидающих (в меню). */
  netLeaveQueue: () => Promise<void>;
  /** Занять освободившееся место (обычно автоматически, кнопка — на всякий). */
  netClaimSeat: () => Promise<void>;
  /** Сдаться в идущей партии: место остаётся, ходы пропускаются, счёт идёт. */
  netResign: () => Promise<void>;
  /** Закрыть стол целиком (#4): сервер снесёт комнату, если остальные места — боты. */
  netCloseTable: () => Promise<void>;
  /** Сменить имя (лобби/очередь/зритель); итог сервера ложится в net.name. */
  netSetName: (name: string) => Promise<void>;
  /** Отправить сообщение в чат стола. */
  sendChat: (text: string) => Promise<void>;
  /** Сигнал «печатает…» — троттлинг в сессии, ответ никого не ждёт. */
  sendTyping: () => void;
  /** Войти зрителем по коду стола. */
  startNetWatch: (code: string, name: string) => Promise<void>;
  /**
   * Реакция/поощрение (игрок или зритель). `chatId` — реплика, на которую
   * ставится реакция (M12); без него реакция уходит «в стол».
   */
  sendReaction: (
    emoji: ReactionEmoji,
    kind: "reaction" | "cheer",
    targetSeat?: number | null,
    chatId?: number | null,
  ) => Promise<void>;
  /**
   * Выйти в меню. `soft` сохраняет player-token и ?room для возврата;
   * обычный выход и выход после сдачи удаляют сохранённую сессию.
   */
  leaveNet: (mode?: unknown) => void;
  /** Погасить сетевую ошибку после показа тостом (чтобы не мигала повторно). */
  clearNetError: () => void;
  /** Погасить текст фатальной ошибки после показа. */
  clearNetFatal: () => void;
}

/** Активная сетевая сессия (одна на вкладку). */
let netSession: NetSession | null = null;

/**
 * Поколение сетевой сессии: хуки старой сессии (её in-flight ответы) не
 * должны перезаписывать стор нового стола. Растёт при каждом create/join/
 * resume/watch и при выходе в меню.
 */
let netGeneration = 0;

/** Код из ?room, по которому уже пробовали вернуться: страховка от цикла меню. */
let urlResumeTried: string | null = null;

// ── кампания-рогалик: локальный забег на чистом движке ──────────────────────

/**
 * Хост идущего матча кампании. Ровно один на вкладку; не нулевой — значит
 * dispatch/leaveNet/resign работают с локальной партией, а не с сетевой
 * комнатой (netSession при этом всегда null).
 */
let campaignHost: CampaignHost | null = null;

/** Шим сетевого стола под кампанию: стол рендерится по тем же полям. */
function campaignNetShim(run: CampaignRun, name: string): NetUiState {
  const node = run.nodes[run.match?.nodeId ?? run.currentNodeId];
  const b = node?.battle;
  return netStartState({
    code: `CAMP-${run.era.slice(0, 4).toUpperCase()}`,
    seat: 0,
    name,
    status: "playing",
    hostSeat: 0,
    capacity: 2,
    settings: {
      difficulty: b?.difficulty,
      modules: b?.modules ?? {},
      ...(b?.mutators ? { mutators: b.mutators } : {}),
      ...(b?.wildWorld ? { wildWorld: true } : {}),
    },
    seats: [
      { seat: 0, name, isAI: false, online: true, disconnected: false, resigned: false, color: colorForSeat(0), typing: false },
      {
        seat: 1,
        name: b ? t(b.nameKey) : "Evo",
        isAI: true,
        online: true,
        disconnected: false,
        resigned: false,
        color: colorForSeat(1),
        typing: false,
      },
    ],
  });
}

/**
 * Мост CampaignHost → стор: кадры ложатся в state/net (батчи — как от
 * сервера), персист пишет полный стейт в забег, финал двигает курсор пути.
 */
function campaignHooks(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
): import("@/game/campaign-host").CampaignHostHooks {
  return {
    onFrame: (view, batch) => {
      const cur = get().net;
      if (!cur) return;
      const nextNet = batch
        ? mergeNetState(cur, { events: [...cur.events, batch].slice(-40) })
        : cur;
      set({ state: view, net: nextNet });
    },
    onPersist: (full, version) => {
      const run = get().campaignRun;
      if (!run) return;
      run.match = { nodeId: run.match?.nodeId ?? run.currentNodeId, state: full, version };
      // Сохраняем ссылку без set(): кадры и так рендерят стол, а подписчикам
      // campaignRun новый объект нужен только при смене узла/статуса.
      saveCampaignRun(run);
    },
    onFinished: (won) => {
      const run = get().campaignRun;
      if (!run) return;
      campaignHost = null;
      if (won) {
        run.match = null;
        clearCurrentNode(run);
      } else {
        loseRun(run);
      }
      saveCampaignRun(run);
      set({ campaignRun: { ...run } });
    },
  };
}

/** Запустить бой текущего боевого узла (шим стола ставится до первого кадра). */
function campaignStartNode(set: (partial: Partial<GameStore>) => void, get: () => GameStore): void {
  const run = get().campaignRun;
  if (!run || run.status !== "active") return;
  const node = run.nodes[run.currentNodeId];
  if (!node?.battle) return;
  const name = get().net?.name || loadName() || "Evo";
  set({ net: campaignNetShim({ ...run, match: null }, name), state: null, intent: { kind: "none" } });
  const host = CampaignHost.startNode(run, node, name, t(node.battle.nameKey), campaignHooks(set, get), speedFactorOf(get().speed));
  if (host) campaignHost = host;
}

/**
 * Мост NetSession → стор: кадры сервера ложатся в state/net, статус
 * соединения — в баннер переподключения, события/чат — в буферы UI.
 * gen — поколение сессии: кадры заменённой/остановленной сессии
 * отбрасываются, иначе её in-flight ответ мог перезаписать новый стол.
 */
function netHooks(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
  gen: number,
): NetHooks {
  const stale = () => gen !== netGeneration;
  const updateNet = (patch: Partial<NetUiState>): NetUiState | null => {
    const current = get().net;
    if (!current) return null;
    const next = mergeNetState(current, patch);
    if (next !== current) set({ net: next });
    return next;
  };
  return {
    onSnapshot: (snap) => {
      if (stale()) return;
      // Код стола из кадра — единственный надёжный источник для адреса:
      // на момент возврата create()/join() снапшот ещё не приходил.
      if (snap.room.code !== syncedRoomCode) {
        syncedRoomCode = snap.room.code;
        syncRoomUrl(snap.room.code);
      }
      const cur = get().net;
      if (!cur) return;
      const own = snap.seats.find((x) => x.seat === snap.seat);
      const nextNet = mergeNetState(cur, {
        code: snap.room.code,
        seat: snap.seat,
        name: own?.name ?? cur.name,
        resigned: snap.state?.players[snap.seat]?.resigned ?? false,
        capacity: snap.room.capacity,
        seats: snap.seats,
        hostSeat: snap.room.hostSeat,
        settings: snap.room.settings,
        isPrivate: snap.room.isPrivate,
        // Пароль приходит только хосту; остальным сервер отдаёт null.
        password: snap.room.password,
        waiters: snap.waiters,
        // Зрители — из полного кадра: по ним игроки видят, кто наблюдает,
        // и «печатает…» зрителя (SpectatorInfo.typing).
        spectators: snap.spectators,
        // Отсчёт авто-конца хода (M10) и смещение часов: кадр несёт метку
        // сервера, поэтому устройство с ушедшими часами не соврёт.
        turnDeadlineAt: snap.turnDeadlineAt,
        // Отсчёт до следующего шага бота — для бейджа на его табло (T1).
        botStepAt: snap.botStepAt,
        serverOffsetMs: snap.serverNow - Date.now(),
        waiting: false,
        waiterPosition: null,
        waitNote: null,
      });
      if (nextNet !== cur || get().state !== snap.state) {
        set({ state: snap.state, net: nextNet });
      }
    },
    onSeats: (seats, hostSeat, capacity, waiters, spectators) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      const notes = diffTableNotes(prevTable, { seats, waiters, spectators }, cur.seat);
      prevTable = { seats, waiters, spectators };
      updateNet({
        seats,
        hostSeat,
        capacity,
        waiters,
        // Зрители едут и в unchanged-кадре: без этого игроки не видели
        // ни «Наблюдают · N», ни «печатает…» зрителя.
        spectators,
        system: notes.length ? [...cur.system, ...notes].slice(-60) : cur.system,
      });
    },
    onStatus: (status) => {
      if (stale()) return;
      updateNet({
        status,
        error: status === "reconnecting" ? get().net?.error ?? null : null,
        errorCode: status === "reconnecting" ? get().net?.errorCode ?? null : null,
      });
    },
    onEvents: (batches) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur || !batches.length) return;
      updateNet({ events: [...cur.events, ...batches].slice(-40) });
    },
    onChat: (messages) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur || !messages.length) return;
      // Дедупликация по id: история приходит и в снапшоте, и поллингом.
      const seen = new Set(cur.chat.map((m) => m.id));
      const fresh = messages.filter((m) => !seen.has(m.id));
      if (!fresh.length) return;
      updateNet({ chat: [...cur.chat, ...fresh].slice(-200) });
    },
    onReactions: (messages) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur || !messages.length) return;
      const seen = new Set(cur.reactions.map((m) => m.id));
      const fresh = messages.filter((m) => !seen.has(m.id));
      if (!fresh.length) return;
      // Реакции — поток: здесь он хранится целиком, а лента сама собирает из
      // него агрегат по сообщению (chatId). Хвост щедрый: первый кадр отдаёт
      // последние 60 реакций, и по ним чипы должны появиться у вошедшего.
      updateNet({ reactions: [...cur.reactions, ...fresh].slice(-200) });
    },
    onSpectatorSnapshot: (snap) => {
      if (stale()) return;
      // Кадр зрителя: публичный вид без прав. state.feedActions и т.п. пусты.
      const cur = get().net;
      if (!cur) return;
      const nextNet = mergeNetState(cur, {
        code: snap.room.code,
        // Место зрителя — сентинел -2 (как при входе по кнопке «Смотреть»):
        // после F5 здесь оставался -1 от ожидающего, и UI путался в режимах.
        seat: -2,
        // Из ожидающего стали зрителем: очередь больше не ждём.
        waiting: false,
        waiterPosition: null,
        waitNote: null,
        resigned: false,
        capacity: snap.room.capacity,
        seats: snap.seats,
        hostSeat: snap.room.hostSeat,
        settings: snap.room.settings,
        isPrivate: snap.room.isPrivate,
        spectators: snap.spectators,
        turnDeadlineAt: snap.turnDeadlineAt,
        botStepAt: snap.botStepAt,
        serverOffsetMs: snap.serverNow - Date.now(),
        status: get().net?.status === "reconnecting" ? "reconnecting" : statusOfNet(snap.room.status),
      });
      if (nextNet !== cur || get().state !== snap.state) {
        set({ state: snap.state, net: nextNet });
      }
    },
    onSpectators: (spectators) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      updateNet({ spectators });
    },
    onSpectating: (on) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      updateNet({ spectating: on });
    },
    onWaiting: (info, note) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      if (!info) {
        updateNet({ waiting: false, waiterPosition: null, waitNote: null });
        return;
      }
      updateNet({
        // У ожидающего места нет: старый номер места остался бы от лобби, и
        // SeatList пометил бы «это вы» чужую строку после уплотнения.
        seat: -1,
        waiting: true,
        waiterPosition: info.position,
        waitNote: note ? waitNoteText(note) : null,
        capacity: info.room.capacity,
        seats: info.seats,
        hostSeat: info.room.hostSeat,
        settings: info.room.settings,
        isPrivate: info.room.isPrivate,
        waiters: info.waiters,
      });
    },
    onPending: (pending) => {
      if (stale()) return;
      updateNet({ pending });
    },
    onFatal: (code) => {
      if (stale()) return;
      // Место исчезло: дальше переподключаться некуда — выходим в меню.
      // Фатал приходит кодом: текст храню уже переведённым (его показывает
      // меню, которое о кодах не знает; живёт сообщение до первого показа).
      const s = netSession;
      netSession = null;
      netGeneration += 1;
      s?.stop();
      syncedRoomCode = null;
      syncRoomUrl(null);
      set({
        net: null,
        state: null,
        netFatal: netErrorText(code, code),
        intent: { kind: "none" },
      });
    },
  };
}

/** Общий прогон сетевого действия: ошибку показываем в net.error (переводим по коду). */
function runNet(
  session: NetSession | null,
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
  fn: (s: NetSession) => Promise<void>,
): Promise<void> {
  if (!session) return Promise.resolve();
  return fn(session).catch((e: unknown) => {
    const cur = get().net;
    const { text, code } = caughtNetError(e);
    if (cur) set({ net: { ...cur, error: text, errorCode: code } });
  });
}

/**
 * Новая сетевая сессия на вкладку: прошлая гасится, её поколение хуков
 * устаревает — in-flight кадры старого стола не могут перезаписать новый.
 */
function beginNetSession(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
): NetSession {
  netSession?.stop();
  netSession = null;
  netGeneration += 1;
  const s = new NetSession(netHooks(set, get, netGeneration));
  netSession = s;
  return s;
}

export function loadSpeed(): GameSpeed {
  try {
    const v = localStorage.getItem("evo-speed");
    if (v === "slow" || v === "normal" || v === "fast") return v;
  } catch {
    // localStorage может быть недоступен — нормальная скорость по умолчанию.
  }
  return "normal";
}

/** Режим живых анимаций стола (волна 1): полный, быстрый, выключенный. */
export type AnimMode = "full" | "fast" | "off";

export function loadAnimMode(): AnimMode {
  try {
    const v = localStorage.getItem("evo-anim");
    if (v === "full" || v === "fast" || v === "off") return v;
  } catch {
    // localStorage может быть недоступен — полные анимации по умолчанию.
  }
  return "full";
}

/** RoomStatus → NetStatus для кадров зрителя (в session.ts та же логика). */
function statusOfNet(status: "lobby" | "playing" | "finished"): NetStatus {
  if (status === "playing") return "playing";
  if (status === "finished") return "finished";
  return "lobby";
}

/**
 * Последние настройки запущенной хостом сетевой партии: при создании нового
 * стола они подставляются автоматически — выбирать всё заново не нужно,
 * всё меняется и в лобби до старта.
 */
const NET_LAST_KEY = "evo-net-last-config";

export function loadLastNetConfig(): Partial<NetCreateConfig> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NET_LAST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<NetCreateConfig>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveLastNetConfig(cfg: Partial<NetCreateConfig>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NET_LAST_KEY, JSON.stringify(cfg));
  } catch {
    // приватный режим — просто не сохранится
  }
}

/**
 * Код стола в адресе страницы: ссылку из адресной строки можно скинуть
 * кому угодно в любой момент. replaceState — без лишней записи в историю.
 */
/** Код стола, уже отражённый в адресе (чтобы не дёргать replaceState на каждом кадре). */
let syncedRoomCode: string | null = null;

function syncRoomUrl(code: string | null) {
  if (typeof window === "undefined") return;
  const url = code ? `?room=${code}` : window.location.pathname;
  try {
    window.history.replaceState(null, "", url);
  } catch {
    // Некоторые окружения запрещают replaceState — не критично.
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  intent: { kind: "none" },
  rulesOpen: false,
  logOpen: false,
  logUnread: 0,
  speed: "normal",
  animMode: loadAnimMode(),
  /** Экипированная косметика (волна 3б): слот → item id; грузится профилем. */
  equippedCosmetics: {},
  setEquippedCosmetics: (v) => set({ equippedCosmetics: v }),
  tutorialMission: null,
  doneMissions: loadDoneMissions(),
  campaignRun: loadCampaignRun(),
  net: null,
  netFatal: null,
  rooms: [],

  dispatch: (action) => {
    // Локальная партия кампании: ход применяется хостом в браузере, без сети.
    if (campaignHost) {
      set({ intent: { kind: "none" } });
      campaignHost.act(action);
      return;
    }
    const cur = get().net;
    // Меню (стола нет), зритель (стол read-only) и предыдущий запрос хода.
    if (!cur || cur.spectating || cur.sending) return;
    const s = netSession;
    if (!s) return;
    const generation = netGeneration;
    const retryId =
      cur.pending?.kind === "action" && sameNetAction(cur.pending.action, action)
        ? cur.pending.id
        : undefined;
    set({ intent: { kind: "none" } });
    set({ net: { ...cur, sending: "action" } });
    void s
      .act(action, retryId)
      .then((err) => {
        if (generation !== netGeneration) return;
        const after = get().net;
        if (err && after) set({ net: { ...after, error: netErrorText(err.error, err.code), errorCode: err.code ?? null } });
      })
      .catch(() => {
        if (generation !== netGeneration) return;
        const after = get().net;
        // pending намеренно не очищаем: следующий такой же клик повторит
        // действие с тем же actionId, не создавая вторую серверную операцию.
        if (after) set({ net: { ...after, error: unsentNetErrorText(), errorCode: "offline" } });
      })
      .finally(() => {
        if (generation !== netGeneration) return;
        const after = get().net;
        if (after?.sending === "action") set({ net: { ...after, sending: null } });
      });
  },

  setIntent: (intent) => set({ intent }),
  setRulesOpen: (rulesOpen) => set({ rulesOpen }),
  setLogOpen: (logOpen) => set({ logOpen }),
  setLogUnread: (logUnread) => set({ logUnread }),
  setSpeed: (speed) => {
    try {
      localStorage.setItem("evo-speed", speed);
    } catch {
      // приватный режим — скорость просто не сохранится
    }
    campaignHost?.setSpeedFactor(speedFactorOf(speed));
    set({ speed });
  },

  setAnimMode: (animMode) => {
    try {
      localStorage.setItem("evo-anim", animMode);
    } catch {
      // приватный режим — режим анимаций просто не сохранится
    }
    set({ animMode });
  },

  // ── обучение (волна 1.5) ────────────────────────────────────────────────
  startTutorial: async (id, name) => {
    const m = TUTORIAL_MISSIONS[id];
    set({ tutorialMission: id });
    // Миссия = обычная комната с лёгким ботом и настройками миссии: никакого
    // отдельного оффлайн-контура (соло удалено by design, коммит bcd54b0).
    try {
      await get().startNetCreate({
        name: name || "Evo",
        capacity: 2,
        botSeats: 1,
        difficulty: "easy",
        modules: m.modules,
        mutators: m.mutators,
        wildWorld: m.wildWorld,
      });
    } catch (e) {
      set({ tutorialMission: null });
      throw e;
    }
  },

  clearTutorial: () => set({ tutorialMission: null }),

  completeTutorial: (id) => {
    set({ doneMissions: saveDoneMission(id) });
  },

  // ── кампания-рогалик (фундамент): локальный забег ───────────────────────
  startCampaignRun: (era, name) => {
    // Новый забег затирает прежний (даже незавершённый): явное намерение.
    campaignHost?.stop();
    campaignHost = null;
    const run = createCampaignRun(era);
    saveCampaignRun(run);
    syncedRoomCode = null;
    syncRoomUrl(null);
    urlResumeTried = null;
    set({
      campaignRun: run,
      net: campaignNetShim(run, name || loadName() || "Evo"),
      state: null,
      intent: { kind: "none" },
      netFatal: null,
    });
    campaignStartNode(set, get);
  },

  continueCampaignRun: () => {
    const run = get().campaignRun;
    if (!run || run.status !== "active") return;
    // Хост уже работает или шим стоит — возобновлять нечего (повторный вызов,
    // например повторное монтирование GameApp).
    if (campaignHost || get().net) return;
    if (!run.match) return; // между узлами: страница кампании ведёт сама
    set({
      net: campaignNetShim({ ...run, match: null }, loadName() || "Evo"),
      state: null,
      intent: { kind: "none" },
      netFatal: null,
    });
    const host = CampaignHost.resumeMatch(run, campaignHooks(set, get), speedFactorOf(get().speed));
    if (host) {
      campaignHost = host;
      return;
    }
    // Матч не восстановился (битый стейт) — сбрасываем: страница покажет узел.
    run.match = null;
    saveCampaignRun(run);
    set({ campaignRun: { ...run }, net: null, state: null });
  },

  campaignStartBattle: () => {
    campaignStartNode(set, get);
  },

  campaignApplyReward: (reward) => {
    const run = get().campaignRun;
    if (!run || run.status !== "active") return;
    const node = run.nodes[run.currentNodeId];
    if (!node || node.kind !== "reward") return;
    applyReward(run, reward);
    clearCurrentNode(run);
    saveCampaignRun(run);
    set({ campaignRun: { ...run } });
  },

  abandonCampaignRun: () => {
    campaignHost?.stop();
    campaignHost = null;
    saveCampaignRun(null);
    syncedRoomCode = null;
    syncRoomUrl(null);
    set({ campaignRun: null, net: null, state: null, intent: { kind: "none" } });
  },

  // ── сетевой стол ──────────────────────────────────────────────────────────

  startNetCreate: async (cfg) => {
    const s = beginNetSession(set, get);
    // Старый ?room не должен пережить начало создания: иначе ошибка создания
    // вернёт меню с прежним кодом в адресе, и оно тут же откроет старый стол.
    syncedRoomCode = null;
    syncRoomUrl(null);
    urlResumeTried = null;
    let created: Awaited<ReturnType<NetSession["create"]>>;
    try {
      created = await s.create(cfg);
    } catch (e) {
      // Ошибка создания оставляет меню и заполненную форму на месте: в стол
      // (и в режим net) переходим только после успешного ответа сервера.
      s.stop();
      netSession = null;
      netGeneration += 1;
      throw e;
    }
    // Код стола в адрес — сразу, не дожидаясь первого снапшота: F5 в первую
    // секунду иначе терял бы новый стол и возвращал по старому ?room.
    syncedRoomCode = created.code;
    syncRoomUrl(created.code);
    set({
      state: null,
      intent: { kind: "none" },
      netFatal: null,
      net: netStartState({
        code: created.code,
        seat: created.seat,
        name: cfg.name,
        hostSeat: created.seat,
        capacity: cfg.capacity,
        settings: {
          modules: cfg.modules ?? {},
          difficulty: cfg.difficulty,
          ...(cfg.turnTimerMs !== undefined ? { turnTimerMs: cfg.turnTimerMs } : {}),
        },
        isPrivate: created.isPrivate,
        password: created.password,
      }),
    });
  },

  startNetJoin: async (code, name, password) => {
    const codeUp = code.toUpperCase();
    const s = beginNetSession(set, get);
    // Прежний ?room (например, из открытой ссылки) не должен вернуть в меню
    // старый стол, если вход по коду не удастся.
    syncedRoomCode = null;
    syncRoomUrl(null);
    urlResumeTried = null;
    try {
      await s.join(codeUp, name, password);
    } catch (e) {
      // Неверный пароль/код оставляет форму входа как была: ошибку показывает
      // сама форма (NetClientError с кодом password-required/password-wrong).
      s.stop();
      netSession = null;
      netGeneration += 1;
      throw e;
    }
    const waiting = s.isWaiting();
    // Стол в адресе сразу: и для занятого места, и для очереди (F5 вернёт
    // ожидающего в очередь по сохранённому токену).
    syncedRoomCode = codeUp;
    syncRoomUrl(codeUp);
    set({
      state: null,
      intent: { kind: "none" },
      netFatal: null,
      net: netStartState({
        code: codeUp,
        // Место до первого кадра неизвестно: ожидающий — -1, игрок — 0.
        seat: waiting ? -1 : 0,
        name,
        capacity: 0,
        status: waiting ? "lobby" : "connecting",
        waiting,
      }),
    });
  },

  resumeNetFromUrl: async (code) => {
    const codeUp = code.toUpperCase();
    // Ссылку мог открыть новый человек: если на устройстве нет ни места, ни
    // очереди, ни зрительского токена — восстанавливать нечего. Выходим, НЕ
    // переключая режим: панель меню остаётся смонтированной, а её форма входа
    // уже подставлена кодом из ссылки (и ?room остаётся в адресе).
    if (!hasStoredSession(codeUp)) return false;
    // Панель меню перемонтируется после каждой неудачи, поэтому без метки
    // один и тот же ?room запускал бы resume бесконечным циклом.
    if (urlResumeTried === codeUp) return false;
    urlResumeTried = codeUp;
    const s = beginNetSession(set, get);
    // Сначала объявляем стол в сторе, потом уходим в сеть: во время resume
    // сессия уже принимает первый снапшот, и без готового `net` хук его
    // отбрасывает, а следующий poll приходит как `unchanged` — вкладка
    // навсегда залипала на «Открываем стол…». Порядок как в startNetCreate.
    set({
      state: null,
      intent: { kind: "none" },
      netFatal: null,
      net: netStartState({ code: codeUp, name: loadName() }),
    });
    try {
      await s.resume(code);
    } catch {
      // Возврата за стол по ссылке не случилось — уходим в меню без ошибки.
      s.stop();
      netSession = null;
      netGeneration += 1;
      syncedRoomCode = null;
      // И убираем ?room: с ним панель меню при перемонтировании снова звала бы
      // resume и вкладка крутилась бы бесконечно (особенно после сброса
      // зрительского токена при F5).
      if (typeof window !== "undefined") {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("room");
          window.history.replaceState(null, "", url.toString());
        } catch {
          // без history просто вернёмся в меню
        }
      }
      set({ net: null });
      return false;
    }
    // Заход удался — следующая неудача снова получит право на попытку.
    urlResumeTried = null;
    return true;
  },

  /** Список столов меню: тихо обновляем, при сбое оставляем прошлый. */
  netRefreshRooms: async () => {
    const rooms = await fetchRoomList();
    if (rooms) set({ rooms });
  },

  netAddBots: async (delta) => {
    const n = get().net;
    if (!n || !netSession || n.status !== "lobby") return;
    const bots = n.seats.filter((x) => x.isAI).length;
    const humans = n.seats.length - bots;
    const count = Math.max(0, Math.min(bots + delta, n.capacity - humans));
    const s = netSession;
    await runNet(s, set, get, (x) => x.setBots(count));
    s.refresh();
  },

  netStart: async () => {
    if (!netSession) return;
    await netSession.start().catch((e: unknown) => {
      const cur = get().net;
      const { text, code } = caughtNetError(e);
      if (cur) set({ net: { ...cur, error: text, errorCode: code } });
    });
    // Хост запустил партию — запоминаем настройки стола: следующее создание
    // откроется с ними же (вместимость, сложность, колода, дополнения).
    const n = get().net;
    if (n && n.seat === n.hostSeat) {
      saveLastNetConfig({
        capacity: (n.capacity || 2) as NetCreateConfig["capacity"],
        difficulty: n.settings.difficulty,
        deckSize: n.settings.deckSize,
        modules: n.settings.modules,
        // Волна 2: модификаторы тоже открываются в следующий раз сами.
        rules: n.settings.rules,
        mutators: n.settings.mutators,
        wildWorld: n.settings.wildWorld,
        // Таймер хода запоминается наравне с прочими настройками лобби.
        turnTimerMs: n.settings.turnTimerMs,
      });
    }
  },

  netAgain: async () => {
    const s = netSession;
    if (!s) return;
    await runNet(s, set, get, (x) => x.again());
    s.refresh();
  },

  netKick: (seat) => runNet(netSession, set, get, (s) => s.kick(seat)),

  netSetCapacity: (capacity) =>
    runNet(netSession, set, get, (s) => s.setCapacity(capacity)),

  netSetSettings: (patch) => runNet(netSession, set, get, (s) => s.setSettings(patch)),

  netSetRoomPrivacy: async (isPrivate, regenerate = false) => {
    const s = netSession;
    if (!s) return;
    try {
      const r = await s.setRoomPrivacy(isPrivate, regenerate);
      const cur = get().net;
      // Пароль возвращает сам вызов: хосту не нужно ждать кадра, чтобы
      // показать/переслать новый пароль гостям.
      if (cur) set({ net: { ...cur, isPrivate: r.isPrivate, password: r.password, error: null, errorCode: null } });
    } catch (e) {
      const cur = get().net;
      const { text, code } = caughtNetError(e);
      if (cur) set({ net: { ...cur, error: text, errorCode: code } });
    }
  },

  /**
   * Смена пароля стола хостом. Возвращает результат, чтобы форма inline-правки
   * показала подпись и не потеряла введённое при ошибке (черновик чистит сама).
   */
  netSetPassword: async (password) => {
    const s = netSession;
    if (!s) return { ok: false, error: t("netErr.noSession") };
    try {
      const r = await s.setPassword(password);
      const cur = get().net;
      // Сервер вернул принятый пароль: показываем его хосту сразу, не ждём кадра.
      if (cur) set({ net: { ...cur, password: r.password, error: null, errorCode: null } });
      return { ok: true };
    } catch (e) {
      const { text, code } = caughtNetError(e);
      const cur = get().net;
      if (cur) set({ net: { ...cur, error: text, errorCode: code } });
      return { ok: false, error: text };
    }
  },

  netSetColor: async (color) => {
    const s = netSession;
    if (!s) return;
    try {
      await s.setColor(color);
      // Свежие места придут первым же кадром после refresh() в NetSession.
    } catch (e) {
      const cur = get().net;
      const { text, code } = caughtNetError(e);
      if (cur) set({ net: { ...cur, error: text, errorCode: code } });
    }
  },

  netTransferHost: (seat) => runNet(netSession, set, get, (s) => s.transferHost(seat)),

  netKickWaiter: (index) => runNet(netSession, set, get, (s) => s.kickWaiter(index)),

  netClaimSeat: () =>
    runNet(netSession, set, get, async (s) => {
      await s.claimSeat();
    }),

  netResign: async () => {
    // Кампания: сдача = проигрыш забега (мягко — мета вне забега не страдает).
    if (campaignHost || get().net?.code?.startsWith("CAMP-")) {
      campaignHost?.stop();
      campaignHost = null;
      const run = get().campaignRun;
      if (run && run.status === "active") {
        loseRun(run);
        saveCampaignRun(run);
        set({ campaignRun: { ...run } });
      }
      return;
    }
    const code = get().net?.code ?? "";
    await runNet(netSession, set, get, (s) => s.resign());
    // Сдача — явное намерение покинуть место: даже если UI затем вызовет
    // leaveNet(), player-token не должен выглядеть как сохранённый для возврата.
    if (code) forgetSession(code);
  },

  netCloseTable: async () => {
    const code = get().net?.code ?? "";
    await runNet(netSession, set, get, (s) => s.closeTable());
    // Стол закрыт — сессии возврата быть не должно (F5 по ?room обязан
    // показывать меню, а не упираться в мёртвый код).
    if (code) forgetSession(code);
  },

  netSetName: async (name) => {
    const s = netSession;
    if (!s) return;
    try {
      const final = await s.setName(name);
      const cur = get().net;
      // Сервер мог добавить номер (тёзка) — показываем именно итоговое имя.
      if (cur) set({ net: { ...cur, name: final, error: null, errorCode: null } });
    } catch (e) {
      const cur = get().net;
      const { text, code } = caughtNetError(e);
      if (cur) set({ net: { ...cur, error: text, errorCode: code } });
    }
  },

  netLeaveQueue: async () => {
    const s = netSession;
    const code = get().net?.code ?? "";
    netSession = null;
    netGeneration += 1;
    if (s) await s.leaveQueue().catch(() => {});
    // Добровольный уход — токен очереди (и заодно места/зрителя) забываем:
    // иначе по ?room=CODE на этом же устройстве входишь за ушедшего (S9).
    if (code) forgetSession(code);
    syncedRoomCode = null;
    syncRoomUrl(null);
    set({
      net: null,
      state: null,
      intent: { kind: "none" },
    });
  },

  sendChat: async (text) => {
    const s = netSession;
    const cur = get().net;
    if (!s || !cur || cur.sending) return;
    const generation = netGeneration;
    set({ net: { ...cur, sending: "chat" } });
    try {
      const err = await s.sendChat(text);
      if (generation !== netGeneration) return;
      const after = get().net;
      if (err && after) set({ net: { ...after, error: netErrorText(err.error, err.code) } });
    } catch {
      if (generation !== netGeneration) return;
      const after = get().net;
      // Черновик остаётся в EventFeed, а pending — маркер для явного повтора.
      if (after) set({ net: { ...after, error: unsentNetErrorText() } });
    } finally {
      if (generation === netGeneration) {
        const after = get().net;
        if (after?.sending === "chat") set({ net: { ...after, sending: null } });
      }
    }
  },

  /** «Печатает…»: без ожидания ответа — индикатор не должен тормозить ввод. */
  sendTyping: () => {
    void netSession?.sendTyping();
  },

  startNetWatch: async (code, name) => {
    const codeUp = code.toUpperCase();
    const s = beginNetSession(set, get);
    try {
      await s.watch(codeUp, name);
    } catch (e) {
      // Ошибка входа зрителем тоже не должна выбрасывать из формы меню.
      s.stop();
      netSession = null;
      netGeneration += 1;
      throw e;
    }
    syncedRoomCode = codeUp;
    syncRoomUrl(codeUp);
    set({
      state: null,
      intent: { kind: "none" },
      netFatal: null,
      // Место зрителя — сентинел -2: ходы запрещены, стол read-only.
      net: netStartState({ code: codeUp, name, seat: -2, spectating: true }),
    });
  },

  sendReaction: async (emoji, kind, targetSeat, chatId) => {
    const s = netSession;
    const cur = get().net;
    if (!s || !cur || cur.sending) return;
    const generation = netGeneration;
    set({ net: { ...cur, sending: "reaction" } });
    try {
      const err = await s.sendReaction(emoji, kind, targetSeat, chatId);
      if (generation !== netGeneration) return;
      const after = get().net;
      if (!after) return;
      if (err) {
        set({
          net: {
            ...after,
            error: netErrorText(err.error, err.code),
            errorCode: err.code ?? null,
            reactionFailure: { chatId: chatId ?? null, emoji, at: Date.now() },
          },
        });
      } else {
        set({ net: { ...after, reactionFailure: null } });
      }
    } catch {
      if (generation !== netGeneration) return;
      const after = get().net;
      if (after) {
        set({
          net: {
            ...after,
            error: unsentNetErrorText(),
            errorCode: "offline",
            reactionFailure: { chatId: chatId ?? null, emoji, at: Date.now() },
          },
        });
      }
    } finally {
      if (generation === netGeneration) {
        const after = get().net;
        if (after?.sending === "reaction") set({ net: { ...after, sending: null } });
      }
    }
  },

  leaveNet: (mode = "hard") => {
    // Кампания: локальная партия, никакой сети. Ветка срабатывает и когда хост
    // жив (матч пауза — вернуться с /campaign или F5), и после финала (хоста
    // уже нет, но шим стола ещё стоит): признак — код стола CAMP-*.
    if (campaignHost || get().net?.code?.startsWith("CAMP-")) {
      campaignHost?.stop();
      campaignHost = null;
      set({ net: null, state: null, intent: { kind: "none" } });
      return;
    }
    const s = netSession;
    const cur = get().net;
    const wasWaiting = cur?.waiting ?? false;
    const code = cur?.code ?? "";
    // #3: стол, где человек играет только с ботами, закрывается ЦЕЛИКОМ при
    // любом уходе (сдача, верхняя панель, финал «В меню», «Прервать» миссию).
    // Возвращаться за таким столом некому, а висящая в меню «идущая» комната —
    // именно та жалоба, из-за которой появилось это правило; поэтому «мягкий»
    // выход для соло-ботов превращается в обычный (жёсткий).
    const soloBots = isSoloBotTable(cur);
    const soft = mode === "soft" && !soloBots;
    netSession = null;
    // Поколение растёт: поздние кадры закрытой сессии стор не трогают.
    netGeneration += 1;
    syncedRoomCode = null;
    // События состава забываем: за новым столом лог начнётся с чистого листа.
    resetTableNotes();
    // Пока меню текущего монтирования не должно автоматически вернуть нас
    // за только что закрытый стол. F5 снимет этот запрет — и ?room снова
    // выполнит обещанный возврат по player-token.
    urlResumeTried = code || null;
    if (!soft && code) forgetSession(code);
    if (soft && code) syncRoomUrl(code);

    if (soloBots && s) {
      // Сервер удаляет комнату со всеми строками (места/чат/очередь/зрители/
      // реакции) — closeTable идемпотентен, гонка с двойным вызовом безопасна.
      // Токен уже забыт выше, поэтому ни ?room, ни F5 не вернут за мёртвый код.
      void s.closeTable().catch(() => {});
      urlResumeTried = null;
      syncRoomUrl(null);
    } else if (!soft && code) {
      // Совместимость с текущим экраном партии: он ещё не умеет передавать
      // режим в leaveNet(), но синхронно восстанавливает player-token после
      // вызова, сохраняя копию для мягкого выхода. Проверяем результат после
      // возврата управления: восстановленный токен означает именно soft-exit.
      queueMicrotask(() => {
        if (hasStoredSeatSession(code)) {
          syncRoomUrl(code);
          return;
        }
        urlResumeTried = null;
        syncRoomUrl(null);
      });
    } else if (!code) {
      urlResumeTried = null;
      syncRoomUrl(null);
    }

    // Ожидающий при явном уходе освобождает место в очереди. Мягкий выход из
    // партии этим путём не используется, но очередь не должна оставаться занята.
    if (s && wasWaiting && !soft) void s.leaveQueue().catch(() => {});
    s?.stop();
    // Миссии (обучение/кампания) не переживают уход со стола — каноническое
    // место, чтобы HUD не всплывал над следующей обычной партией. Запись
    // evo-tutorial-active чистим только «свою» (без кода или с кодом этого
    // стола): чужая может принадлежать живой миссии в другой вкладке.
    const state = get();
    if (state.tutorialMission) {
      const rec = loadActiveMission();
      if (!rec || rec.code === null || rec.code === code) saveActiveMission(null);
      state.clearTutorial();
    }
    set({
      net: null,
      state: null,
      intent: { kind: "none" },
    });
  },

  clearNetError: () => {
    const cur = get().net;
    if (cur?.error) set({ net: { ...cur, error: null, errorCode: null } });
  },

  clearNetFatal: () => {
    if (get().netFatal) set({ netFatal: null });
  },
}));

export { legalDevActions, legalFeedActions, legalDefenseActions };

// QA-скрипты читают стор из браузера. Динамический import() после HMR отдаёт
// другой экземпляр модуля, поэтому в dev кладём ссылку на живой стор в globalThis.
if (import.meta.env.DEV) {
  (globalThis as typeof globalThis & { __evoStore?: typeof useGameStore }).__evoStore = useGameStore;
}
