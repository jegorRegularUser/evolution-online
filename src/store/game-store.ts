import { create } from "zustand";
import { legalDefenseActions, legalDevActions, legalFeedActions } from "@/game/engine";
import type { Difficulty, GameAction, GameSpeed, GameState, ModuleId } from "@/game/types";
import { t, type TParams, type TKey } from "@/lib/i18n";
import { NetClientError, NetSession, fetchRoomList, forgetSession, hasStoredSession, loadName, type NetHooks, type NetStatus } from "@/lib/net/session";
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
  WaiterInfo,
} from "@/lib/net/shared";

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
};

/** Текст ошибки для показа: знакомый код переводим, прочее — как есть. */
function netErrorText(error: string, code?: string): string {
  const key = code ? NET_ERR_KEYS[code] : undefined;
  return key ? t(key) : error;
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
  /**
   * M10: когда сервер сам закончит ход человека без действий (epoch ms по
   * серверным часам) или null — таймера нет. Круговой отсчёт у имени ходящего.
   */
  turnDeadlineAt: number | null;
  /**
   * Смещение часов клиента относительно сервера (serverNow − Date.now()):
   * отсчёт считается по серверной метке, а не по часам устройства.
   */
  serverOffsetMs: number;
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

export interface NetCreateConfig {
  name: string;
  capacity: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  botSeats: number;
  difficulty: Difficulty;
  /** Включённые дополнения стола (пока «Континенты»). */
  modules?: Partial<Record<ModuleId, boolean>>;
  /** Целевой размер колоды свойств (по умолчанию — полный состав). */
  deckSize?: number;
  /** Приватный стол: вход по паролю, колонка «Закрытые» в меню. */
  isPrivate?: boolean;
  /** Пароль приватного стола; пусто — сервер сгенерирует 4 цифры. */
  password?: string;
}

/** Пустое состояние стола до первого кадра сервера (create/join/watch). */
function netStartState(patch: Partial<NetUiState> = {}): NetUiState {
  return {
    code: "",
    seat: -1,
    name: loadName(),
    status: "connecting",
    error: null,
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
    turnDeadlineAt: null,
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
  leaveNet: () => void;
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
      set({
        state: snap.state,
        net: {
          ...cur,
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
          serverOffsetMs: snap.serverNow - Date.now(),
          waiting: false,
          waiterPosition: null,
          waitNote: null,
        },
      });
    },
    onSeats: (seats, hostSeat, capacity, waiters, spectators) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      const notes = diffTableNotes(prevTable, { seats, waiters, spectators }, cur.seat);
      prevTable = { seats, waiters, spectators };
      set({
        net: {
          ...cur,
          seats,
          hostSeat,
          capacity,
          waiters,
          // Зрители едут и в unchanged-кадре: без этого игроки не видели
          // ни «Наблюдают · N», ни «печатает…» зрителя.
          spectators,
          system: notes.length ? [...cur.system, ...notes].slice(-60) : cur.system,
        },
      });
    },
    onStatus: (status) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      set({ net: { ...cur, status, error: status === "reconnecting" ? cur.error : null } });
    },
    onEvents: (batches) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur || !batches.length) return;
      set({ net: { ...cur, events: [...cur.events, ...batches].slice(-40) } });
    },
    onChat: (messages) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur || !messages.length) return;
      // Дедупликация по id: история приходит и в снапшоте, и поллингом.
      const seen = new Set(cur.chat.map((m) => m.id));
      const fresh = messages.filter((m) => !seen.has(m.id));
      if (!fresh.length) return;
      set({ net: { ...cur, chat: [...cur.chat, ...fresh].slice(-200) } });
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
      set({ net: { ...cur, reactions: [...cur.reactions, ...fresh].slice(-200) } });
    },
    onSpectatorSnapshot: (snap) => {
      if (stale()) return;
      // Кадр зрителя: публичный вид без прав. state.feedActions и т.п. пусты.
      const cur = get().net;
      if (!cur) return;
      set({
        state: snap.state,
        net: {
          ...cur,
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
          serverOffsetMs: snap.serverNow - Date.now(),
          status: get().net?.status === "reconnecting" ? "reconnecting" : statusOfNet(snap.room.status),
        },
      });
    },
    onSpectators: (spectators) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      set({ net: { ...cur, spectators } });
    },
    onSpectating: (on) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      set({ net: { ...cur, spectating: on } });
    },
    onWaiting: (info, note) => {
      if (stale()) return;
      const cur = get().net;
      if (!cur) return;
      if (!info) {
        set({ net: { ...cur, waiting: false, waiterPosition: null, waitNote: null } });
        return;
      }
      set({
        net: {
          ...cur,
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
        },
      });
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
    const message =
      e instanceof NetClientError
        ? netErrorText(e.message, e.code)
        : e instanceof Error
          ? e.message
          : String(e);
    if (cur) set({ net: { ...cur, error: message } });
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
  net: null,
  netFatal: null,
  rooms: [],

  dispatch: (action) => {
    const cur = get().net;
    // Меню (стола нет) и зритель (стол read-only) ходов не делают.
    if (!cur || cur.spectating) return;
    const s = netSession;
    if (!s) return;
    set({ intent: { kind: "none" } });
    void s.act(action).then((err) => {
      const after = get().net;
      if (err && after) set({ net: { ...after, error: netErrorText(err.error, err.code) } });
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
    set({ speed });
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
        settings: { modules: cfg.modules ?? {}, difficulty: cfg.difficulty },
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
      const message =
        e instanceof NetClientError
          ? netErrorText(e.message, e.code)
          : String((e as Error)?.message ?? e);
      if (cur) set({ net: { ...cur, error: message } });
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
      if (cur) set({ net: { ...cur, isPrivate: r.isPrivate, password: r.password, error: null } });
    } catch (e) {
      const cur = get().net;
      const message =
        e instanceof NetClientError
          ? netErrorText(e.message, e.code)
          : e instanceof Error
            ? e.message
            : String(e);
      if (cur) set({ net: { ...cur, error: message } });
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
      if (cur) set({ net: { ...cur, password: r.password, error: null } });
      return { ok: true };
    } catch (e) {
      const message =
        e instanceof NetClientError
          ? netErrorText(e.message, e.code)
          : e instanceof Error
            ? e.message
            : String(e);
      const cur = get().net;
      if (cur) set({ net: { ...cur, error: message } });
      return { ok: false, error: message };
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
      const message =
        e instanceof NetClientError
          ? netErrorText(e.message, e.code)
          : e instanceof Error
            ? e.message
            : String(e);
      if (cur) set({ net: { ...cur, error: message } });
    }
  },

  netTransferHost: (seat) => runNet(netSession, set, get, (s) => s.transferHost(seat)),

  netKickWaiter: (index) => runNet(netSession, set, get, (s) => s.kickWaiter(index)),

  netClaimSeat: () =>
    runNet(netSession, set, get, async (s) => {
      await s.claimSeat();
    }),

  netResign: () => runNet(netSession, set, get, (s) => s.resign()),

  netSetName: async (name) => {
    const s = netSession;
    if (!s) return;
    try {
      const final = await s.setName(name);
      const cur = get().net;
      // Сервер мог добавить номер (тёзка) — показываем именно итоговое имя.
      if (cur) set({ net: { ...cur, name: final, error: null } });
    } catch (e) {
      const cur = get().net;
      const message =
        e instanceof NetClientError
          ? netErrorText(e.message, e.code)
          : e instanceof Error
            ? e.message
            : String(e);
      if (cur) set({ net: { ...cur, error: message } });
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
    if (!s) return;
    const err = await s.sendChat(text);
    if (err) {
      const cur = get().net;
      if (cur) set({ net: { ...cur, error: netErrorText(err.error, err.code) } });
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
    if (!s) return;
    const err = await s.sendReaction(emoji, kind, targetSeat, chatId);
    if (err) {
      const cur = get().net;
      if (cur) set({ net: { ...cur, error: netErrorText(err.error, err.code) } });
    }
  },

  leaveNet: () => {
    const s = netSession;
    const cur = get().net;
    const wasWaiting = cur?.waiting ?? false;
    const code = cur?.code ?? "";
    netSession = null;
    // Поколение растёт: поздние кадры закрытой сессии стор не трогают.
    netGeneration += 1;
    syncedRoomCode = null;
    // События состава забываем: за новым столом лог начнётся с чистого листа.
    resetTableNotes();
    // Осадок от прошлого захода по ссылке не должен блокировать новый.
    urlResumeTried = null;
    syncRoomUrl(null);
    // Добровольный выход («Покинуть стол», «Сдаться и выйти», «Выйти из
    // очереди») отзывает сохранённую сессию устройства: место, очередь и
    // зрительский токен. Перезагрузка и закрытие вкладки сюда не попадают —
    // там восстановление партии обязано работать (S9).
    if (code) forgetSession(code);
    // Ожидающий при уходе освобождает своё место в очереди.
    if (s && wasWaiting) void s.leaveQueue().catch(() => {});
    s?.stop();
    set({
      net: null,
      state: null,
      intent: { kind: "none" },
    });
  },

  clearNetError: () => {
    const cur = get().net;
    if (cur?.error) set({ net: { ...cur, error: null } });
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
