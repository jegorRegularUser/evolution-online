/**
 * Клиентский драйвер сетевой партии: держит код стола и токен места,
 * тянет состояние циклом опроса с бэкоффом, переживает обрывы (токен
 * сохранён в localStorage — F5 и закрытие вкладки безболезненны).
 * Никакого React: стор подписывается через хуки NetHooks.
 *
 * Ожидающий (мест не хватило) опрашивает лобби, а когда место освобождается —
 * автоматически занимает его; отдельный токен очереди хранится рядом с местом.
 */
import {
  netAction,
  netAgain,
  netChat,
  netClaimSeat,
  netCreateRoom,
  netJoinRoom,
  netKick,
  netKickWaiter,
  netLeaveQueue,
  netListRooms,
  netPoll,
  netReaction,
  netRejoin,
  netResign,
  netRoomInfo,
  netSetBots,
  netSetCapacity,
  netSetColor,
  netSetName,
  netSetPassword,
  netSetRoomPrivacy,
  netSetSettings,
  netSpectate,
  netSpectatorPoll,
  netStart,
  netTransferHost,
  netTyping,
} from "./api";
import type {
  ChatMessage,
  CreateRoomInput,
  EventBatch,
  PlayerColor,
  PollResult,
  ReactionMessage,
  RoomInfo,
  RoomSettings,
  RoomSummary,
  SeatInfo,
  SpectatorInfo,
  SpectatorSnapshot,
  WaiterInfo,
} from "./shared";
import type { GameAction } from "@/game/types";

export type NetStatus = "connecting" | "lobby" | "playing" | "finished" | "reconnecting";

export interface NetHooks {
  onSnapshot: (snap: PollResult) => void;
  /** Обновление состава/онлайна/хоста/очереди/зрителей без смены версии партии. */
  onSeats: (
    seats: SeatInfo[],
    hostSeat: number,
    capacity: number,
    waiters: WaiterInfo[],
    spectators: SpectatorInfo[],
  ) => void;
  onStatus: (status: NetStatus) => void;
  /** Батчи событий с version > sinceVersion; вызывается ДО onSnapshot. */
  onEvents: (batches: EventBatch[]) => void;
  /** Новые сообщения чата (могут приходить и в unchanged-кадре). */
  onChat: (messages: ChatMessage[]) => void;
  /** Новые реакции/поощрения (могут приходить и в unchanged-кадре). */
  onReactions: (messages: ReactionMessage[]) => void;
  /** Полный кадр зрителя: публичный вид стола + чат/реакции в самих хуках. */
  onSpectatorSnapshot: (snap: SpectatorSnapshot) => void;
  /** Обновление списка зрителей (без токенов). */
  onSpectators: (spectators: SpectatorInfo[]) => void;
  /** Клиент вошёл как зритель (место игрока не занято). */
  onSpectating?: (on: boolean) => void;
  /** Кадр ожидающего; null — очередь покинута (место занято/вышел).
   *  note — машиночитаемый код пояснения (например, «capacity-shrunk»). */
  onWaiting: (info: RoomInfo | null, note?: string | null) => void;
  /**
   * Фатальная ошибка места (кик, занятое место, закрытый стол): reconnect
   * бессмысленен — стор выходит в меню. Приходит МАШИНОЧИТАЕМЫЙ КОД
   * (kicked/seat-taken/room-gone/not-in-queue/started-without-you):
   * стор сам переводит его в текст на языке клиента.
   */
  onFatal: (code: string) => void;
}

/** Серверный сбой-ответ: code машиночитаем, error — уже готовый текст. */
type ApiFail = { ok: false; error: string; code?: string };

/** Ошибка действия для стора: текст сервера + код для перевода на клиенте. */
export interface NetFail {
  error: string;
  code?: string;
}

/**
 * Ошибка сетевого входа/создания с машиночитаемым кодом. Форма меню по коду
 * понимает, что делать: `password-required`/`password-wrong` — показать поле
 * пароля и не выбрасывать человека из формы.
 */
export class NetClientError extends Error {
  readonly code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "NetClientError";
    this.code = code;
  }
}

const NAME_KEY = "evo-net-name";
const tokKey = (code: string) => `evo-seat-${code}`;
const queueKey = (code: string) => `evo-queue-${code}`;
const watchKey = (code: string) => `evo-watch-${code}`;
/** Указатель на последний смотревшийся стол (нужен для чистки при выходе). */
const WATCH_CODE_KEY = "evo-net-watch-code";

/**
 * «Печатает…»: сигналы при наборе текста шлём не чаще этого интервала. Сервер
 * своей рукой троттлит пинги (раза в секунду хватает — метка живёт ~4 с).
 */
const TYPING_THROTTLE_MS = 1500;

/** Коды, после которых переподключение не поможет (см. fatal()). */
const FATAL_CODES = new Set(["kicked", "seat-taken", "room-gone"]);

/** Код ошибки — фатальный? По нему сессия решает, есть ли смысл reconnect'иться. */
function isFatalCode(code?: string): boolean {
  return Boolean(code && FATAL_CODES.has(code));
}

function statusOf(status: PollResult["room"]["status"]): NetStatus {
  if (status === "playing") return "playing";
  if (status === "finished") return "finished";
  return "lobby";
}

export function loadName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveName(name: string): void {
  try {
    const n = name.trim();
    if (n) localStorage.setItem(NAME_KEY, n);
  } catch {
    // приватный режим — имя просто не запомнится
  }
}

function loadToken(code: string): string | null {
  try {
    return localStorage.getItem(tokKey(code));
  } catch {
    return null;
  }
}

function saveToken(code: string, token: string): void {
  try {
    localStorage.setItem(tokKey(code), token);
  } catch {
    // без localStorage переподключение работать не будет, играть можно
  }
}

function removeToken(code: string): void {
  try {
    localStorage.removeItem(tokKey(code));
  } catch {
    // ignore
  }
}

function loadQueueToken(code: string): string | null {
  try {
    return localStorage.getItem(queueKey(code));
  } catch {
    return null;
  }
}

function saveQueueToken(code: string, token: string): void {
  try {
    localStorage.setItem(queueKey(code), token);
  } catch {
    // ignore
  }
}

function clearQueueToken(code: string): void {
  try {
    localStorage.removeItem(queueKey(code));
  } catch {
    // ignore
  }
}

/**
 * Есть ли на этом устройстве сохранённая сессия стола: место, очередь или
 * зрительский токен. Нужно, чтобы по ссылке `?room=` не пытаться «вернуться»
 * там, где возвращаться некуда, и не терять предзаполненную форму входа.
 */
export function hasStoredSession(code: string): boolean {
  const codeUp = code.toUpperCase();
  let watched: string | null = null;
  try {
    watched = localStorage.getItem(watchKey(codeUp));
  } catch {
    watched = null;
  }
  return Boolean(loadToken(codeUp) || loadQueueToken(codeUp) || watched);
}

/**
 * Добровольный уход со стола: забыть и место, и очередь, и зрительский токен
 * (S9). Иначе на общем устройстве следующий человек по `?room=CODE` молча
 * входил бы за ушедшего — пока комната жива. Перезагрузка страницы и закрытие
 * вкладки сюда не попадают: там восстановление партии обязано работать.
 */
export function forgetSession(code: string): void {
  const codeUp = code.toUpperCase();
  removeToken(codeUp);
  clearQueueToken(codeUp);
  try {
    localStorage.removeItem(watchKey(codeUp));
    if (localStorage.getItem(WATCH_CODE_KEY) === codeUp) {
      localStorage.removeItem(WATCH_CODE_KEY);
    }
  } catch {
    // без localStorage чистить нечего
  }
}

/**
 * Публичный список столов для главного меню. Без сессии и без токенов;
 * ошибка — null, чтобы стор оставил прошлый список вместо пустого экрана.
 */
export async function fetchRoomList(): Promise<RoomSummary[] | null> {
  const r = await netListRooms({ data: {} });
  return r.ok ? r.rooms : null;
}

export class NetSession {
  private code = "";
  private token = "";
  private lastVersion: number | undefined;
  private lastChatId: number | undefined;
  private lastReactionId: number | undefined;
  /** Клиент — зритель: отдельный поллинг, ходы и действия запрещены. */
  private spectating = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private failCount = 0;
  private stopped = false;
  private lastOwnMoveAt = 0;
  /** Текущий статус партии (для выхода из reconnecting). */
  private seenStatus: NetStatus = "lobby";
  private wasReconnecting = false;
  /** «Печатает…»: время последнего пинга и защита от параллельных запросов. */
  private typingAt = 0;
  private typingBusy = false;
  /** Место не досталось — опрашиваем очередь, пока не освободится. */
  private waiting = false;
  private claiming = false;
  /**
   * Пояснение к экрану ожидания (например, «хост уменьшил число мест»).
   * Хранится, пока клиент в очереди, и едет в каждый кадр ожидающего.
   */
  private waitNote: string | null = null;

  constructor(private hooks: NetHooks) {}

  /**
   * Создать стол; возвращает код и доступ (приватность + пароль для хоста) —
   * стор кладёт их в состояние сразу, не дожидаясь первого кадра.
   */
  async create(
    input: CreateRoomInput,
  ): Promise<{ code: string; seat: number; isPrivate: boolean; password: string | null }> {
    saveName(input.name);
    const r = await netCreateRoom({ data: input });
    if (!r.ok) throw new NetClientError(r.error, r.code);
    this.attach(r.code, r.token);
    this.hooks.onStatus("connecting");
    this.schedule(0);
    return { code: r.code, seat: r.seat, isPrivate: r.isPrivate, password: r.password };
  }

  /**
   * Войти за стол. password нужен только приватному столу; неверный пароль —
   * NetClientError с кодом password-required/password-wrong: форма покажет
   * поле и текст, а в меню по-прежнему останется открытой.
   */
  async join(code: string, name: string, password?: string): Promise<void> {
    saveName(name);
    const codeUp = code.toUpperCase();
    const data: { code: string; name: string; password?: string } = { code: codeUp, name };
    if (password?.trim()) data.password = password.trim();
    const r = await netJoinRoom({ data });
    if (!r.ok) throw new NetClientError(r.error, r.code);
    if (r.waiting) {
      // Мест нет — встаём в очередь; первый кадр очереди придёт из tick.
      this.attachWaiting(codeUp, r.token);
      return;
    }
    this.attach(codeUp, r.token);
    this.hooks.onStatus("connecting");
    this.schedule(0);
  }

  /** Вернуться на стол по сохранённому токену (F5, обрыв, закрытая вкладка). */
  async resume(code: string): Promise<void> {
    const codeUp = code.toUpperCase();
    // Режим зрителя восстанавливается первым: у него свой токен и поллинг.
    if (await this.resumeWatch(codeUp)) return;
    const seatToken = loadToken(codeUp);
    let failure: ApiFail | null = null;
    if (seatToken) {
      const r = await netRejoin({ data: { code: codeUp, token: seatToken } });
      if (r.ok) {
        this.attach(codeUp, seatToken);
        this.accept(r.snapshot);
        this.schedule(0);
        return;
      }
      failure = r;
      removeToken(codeUp);
    }
    // Может, мы ждали в очереди — тогда возвращаемся ожидающим.
    const queueToken = loadQueueToken(codeUp);
    if (queueToken) {
      const r = await netRoomInfo({ data: { code: codeUp, token: queueToken } });
      if (r.ok && r.info.queued) {
        this.attachWaiting(codeUp, queueToken, r.info);
        return;
      }
      // Партия началась без нас — сервер перенёс очередь в зрители с тем же
      // токеном: возвращаемся зрителем, а не теряем стол после F5.
      if (r.ok && r.info.room.status !== "lobby") {
        const watch = await netSpectatorPoll({
          data: {
            code: codeUp,
            token: queueToken,
            sinceChatId: this.lastChatId,
            sinceReactionId: this.lastReactionId,
          },
        });
        if (watch.ok) {
          clearQueueToken(codeUp);
          this.saveWatchToken(codeUp, queueToken);
          this.attachSpectator(codeUp, queueToken);
          this.acceptSpectator(watch.snapshot);
          this.schedule(0);
          return;
        }
      }
      clearQueueToken(codeUp);
      if (!r.ok && isFatalCode(r.code)) {
        this.fatal(r.code!);
        throw new Error(r.error);
      }
    }
    if (failure && isFatalCode(failure.code)) {
      this.fatal(failure.code!);
      throw new Error(failure.error);
    }
    if (failure) throw new Error(failure.error);
    throw new Error("На этом устройстве нет места за этим столом");
  }

  /** Ожидающий ли сейчас клиент (мест не хватило). */
  isWaiting(): boolean {
    return this.waiting;
  }

  /** Зрительский токен — рядом с местом, чтобы F5 возвращал в тот же режим. */
  private saveWatchToken(code: string, token: string): void {
    try {
      localStorage.setItem(watchKey(code), token);
      localStorage.setItem(WATCH_CODE_KEY, code);
    } catch {
      // без localStorage F5 потеряет режим зрителя, играть можно
    }
  }

  /** Войти зрителем: отдельный токен, место игрока не занято. */
  async watch(code: string, name: string): Promise<void> {
    saveName(name);
    const codeUp = code.toUpperCase();
    const r = await netSpectate({ data: { code: codeUp, name } });
    if (!r.ok) throw new NetClientError(r.error, r.code);
    // Зрительский токен — рядом с местом, чтобы F5 возвращал в тот же режим.
    this.saveWatchToken(codeUp, r.token);
    this.attachSpectator(codeUp, r.token);
    // Первый кадр тянем сразу: без schedule() экран навсегда остаётся
    // «Открываем стол…» (resumeWatch по сохранённому токену делает так же).
    this.schedule(0);
  }

  /** Возврат в режим зрителя по сохранённому токену (F5). */
  private async resumeWatch(code: string): Promise<boolean> {
    let token: string | null = null;
    try {
      token = localStorage.getItem(watchKey(code));
    } catch {
      token = null;
    }
    if (!token) return false;
    const r = await netSpectatorPoll({
      data: { code, token, sinceChatId: this.lastChatId, sinceReactionId: this.lastReactionId },
    });
    if (!r.ok) {
      try {
        localStorage.removeItem(watchKey(code));
      } catch {
        // ignore
      }
      return false;
    }
    this.attachSpectator(code, token);
    this.acceptSpectator(r.snapshot);
    this.schedule(0);
    return true;
  }

  /**
   * Ход: сервер проверяет и применяет, свежий кадр приходит в ответе.
   * Ошибка приходит с кодом — стор переводит её на язык клиента.
   */
  async act(action: GameAction): Promise<NetFail | null> {
    const r = await netAction({ data: { code: this.code, token: this.token, action } });
    if (!r.ok) {
      if (isFatalCode(r.code)) this.fatal(r.code!);
      return { error: r.error, code: r.code };
    }
    this.lastOwnMoveAt = Date.now();
    this.accept(r.snapshot);
    this.schedule(0);
    return null;
  }

  async setBots(count: number): Promise<void> {
    await this.call(netSetBots({ data: { code: this.code, token: this.token, count } }));
    this.refresh();
  }

  async start(): Promise<void> {
    const r = await this.call(netStart({ data: { code: this.code, token: this.token } }));
    this.accept(r.snapshot);
  }

  async again(): Promise<void> {
    await this.call(netAgain({ data: { code: this.code, token: this.token } }));
    this.refresh();
  }

  /** Сдаться в идущей партии: место остаётся, ходы пропускает сервер. */
  async resign(): Promise<void> {
    const r = await this.call(netResign({ data: { code: this.code, token: this.token } }));
    this.accept(r.snapshot);
    this.schedule(0);
  }

  /** Сменить имя (лобби/очередь/зритель); возвращает итоговое имя. */
  async setName(name: string): Promise<string> {
    const r = await this.call(netSetName({ data: { code: this.code, token: this.token, name } }));
    saveName(r.name);
    this.refresh();
    return r.name;
  }

  async kick(seat: number): Promise<void> {
    await this.call(netKick({ data: { code: this.code, token: this.token, seat } }));
    this.refresh();
  }

  async setCapacity(capacity: number): Promise<void> {
    await this.call(netSetCapacity({ data: { code: this.code, token: this.token, capacity } }));
    this.refresh();
  }

  async setSettings(settings: RoomSettings): Promise<void> {
    await this.call(netSetSettings({ data: { code: this.code, token: this.token, settings } }));
    this.refresh();
  }

  /** Доступ к столу (хост, лобби): приватность и при необходимости новый пароль. */
  async setRoomPrivacy(
    isPrivate: boolean,
    regenerate = false,
  ): Promise<{ isPrivate: boolean; password: string | null }> {
    const r = await this.call(
      netSetRoomPrivacy({ data: { code: this.code, token: this.token, isPrivate, regenerate } }),
    );
    this.refresh();
    return { isPrivate: r.isPrivate, password: r.password };
  }

  /**
   * Смена пароля стола хостом (только лобби, ровно 4 цифры). Возвращает
   * принятый сервером пароль — хосту не нужно ждать кадра, чтобы его отдать.
   */
  async setPassword(password: string): Promise<{ password: string }> {
    const r = await this.call(
      netSetPassword({ data: { code: this.code, token: this.token, password } }),
    );
    this.refresh();
    return { password: r.password };
  }

  /** Смена цвета своего места (только лобби); возвращает принятый сервером цвет. */
  async setColor(color: PlayerColor): Promise<string> {
    const r = await this.call(
      netSetColor({ data: { code: this.code, token: this.token, color } }),
    );
    this.refresh();
    return r.color;
  }

  async transferHost(seat: number): Promise<void> {
    await this.call(netTransferHost({ data: { code: this.code, token: this.token, seat } }));
    this.refresh();
  }

  async kickWaiter(index: number): Promise<void> {
    await this.call(netKickWaiter({ data: { code: this.code, token: this.token, index } }));
    this.refresh();
  }

  /** Занять освободившееся место из очереди. Возвращает true при успехе. */
  async claimSeat(): Promise<boolean> {
    if (this.claiming || this.stopped) return false;
    this.claiming = true;
    try {
      const r = await netClaimSeat({ data: { code: this.code, token: this.token } });
      if (!r.ok) {
        if (isFatalCode(r.code)) {
          this.fatal(r.code!);
          return false;
        }
        return false;
      }
      this.waiting = false;
      this.waitNote = null;
      this.attach(this.code, r.token);
      clearQueueToken(this.code);
      this.hooks.onWaiting(null);
      this.lastVersion = undefined; // первый кадр после занятия — полный
      this.schedule(0);
      return true;
    } finally {
      this.claiming = false;
    }
  }

  /** Выйти из очереди (вызывается при уходе в меню и при кике). */
  async leaveQueue(): Promise<void> {
    await netLeaveQueue({ data: { code: this.code, token: this.token } }).catch(() => null);
    clearQueueToken(this.code);
    this.waitNote = null;
    this.stop();
  }

  /** Отправка в чат; возвращает ошибку с кодом или null. */
  async sendChat(text: string): Promise<NetFail | null> {
    const r = await netChat({ data: { code: this.code, token: this.token, text } });
    if (!r.ok) {
      if (isFatalCode(r.code)) this.fatal(r.code!);
      return { error: r.error, code: r.code };
    }
    this.trackChat([r.message], false);
    this.schedule(0);
    return null;
  }

  stop(): void {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
  }

  /** Немедленный внеочередной опрос (после действий с лобби). */
  refresh(): void {
    this.schedule(0);
  }

  // ── внутреннее ────────────────────────────────────────────────────────────

  /**
   * Разворачивает ответ сервера: фатальный код уводит клиента из стола.
   * R выводится как весь union ответа, а ok-ветка достаётся Extract'ом —
   * иначе TS сузил бы R до минимального { ok: true } и потерял поля кадра.
   */
  private async call<R extends { ok: true } | ApiFail>(
    p: Promise<R>,
  ): Promise<Extract<R, { ok: true }>> {
    const r = await p;
    if (!r.ok) {
      const fail = r as ApiFail;
      if (isFatalCode(fail.code)) this.fatal(fail.code!);
      // Код ошибки сохраняем в исключении: стор переводит текст на язык клиента.
      throw new NetClientError(fail.error, fail.code);
    }
    return r as Extract<R, { ok: true }>;
  }

  private fatal(reason: string): void {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.hooks.onFatal(reason);
  }

  private attach(code: string, token: string): void {
    this.code = code;
    this.token = token;
    this.waiting = false;
    this.waitNote = null;
    this.spectating = false;
    saveToken(code, token);
    this.failCount = 0;
  }

  private attachSpectator(code: string, token: string): void {
    this.code = code;
    this.token = token;
    this.waiting = false;
    this.spectating = true;
    this.lastVersion = undefined; // первый кадр — полный
    this.failCount = 0;
    this.hooks.onStatus("connecting");
    this.hooks.onSpectating?.(true);
  }

  private acceptSpectator(snap: SpectatorSnapshot): void {
    if (this.stopped) return; // сессию заменили/остановили — кадр не наш
    this.failCount = 0;
    this.seenStatus = statusOf(snap.room.status);
    this.wasReconnecting = false;
    this.trackChat(snap.chat);
    this.trackReactions(snap.reactions);
    this.hooks.onSpectatorSnapshot(snap);
    this.hooks.onStatus(this.seenStatus);
  }

  /** Точечный ACK отображаем, но курсор двигает только кадр с историей. */
  private trackReactions(messages: ReactionMessage[], advanceCursor = true): void {
    if (this.stopped) return;
    if (!messages.length) return;
    if (advanceCursor) {
      for (const m of messages) {
        this.lastReactionId = Math.max(this.lastReactionId ?? 0, m.id);
      }
    }
    this.hooks.onReactions(messages);
  }

  private attachWaiting(code: string, token: string, info?: RoomInfo, note?: string | null): void {
    this.code = code;
    this.token = token;
    this.waiting = true;
    this.waitNote = note ?? null;
    // Токен места устарел (место ушло другому при уменьшении мест) — держим
    // только очередь, иначе F5 сначала пытался бы вернуться мёртвым местом.
    removeToken(code);
    saveQueueToken(code, token);
    this.failCount = 0;
    if (info) this.hooks.onWaiting(info, this.waitNote);
    this.hooks.onStatus("lobby");
    this.schedule(0);
  }

  private trackChat(messages: ChatMessage[], advanceCursor = true): void {
    if (this.stopped) return;
    if (!messages.length) return;
    if (advanceCursor) {
      for (const m of messages) {
        this.lastChatId = Math.max(this.lastChatId ?? 0, m.id);
      }
    }
    this.hooks.onChat(messages);
  }

  private accept(snap: PollResult): void {
    if (this.stopped) return; // сессию заменили/остановили — кадр не наш
    this.waiting = false;
    this.lastVersion = snap.version;
    this.failCount = 0;
    this.seenStatus = statusOf(snap.room.status);
    this.wasReconnecting = false;
    // События — до снапшота: UI успевает поставить их в очередь воспроизведения.
    if (snap.events.length) this.hooks.onEvents(snap.events);
    this.trackChat(snap.chat);
    // Реакции из полного кадра: без этого чужие реакции пропадали совсем —
    // их не досылал ни unchanged-кадр (там свой вызов), ни этот.
    this.trackReactions(snap.reactions);
    this.hooks.onSnapshot(snap);
    this.hooks.onStatus(this.seenStatus);
  }

  private schedule(delay?: number): void {
    if (this.stopped) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.tick(), delay ?? this.nextDelay());
  }

  private nextDelay(): number {
    if (this.failCount > 0) return Math.min(5000, 400 * 2 ** this.failCount);
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return 3000;
    // Сразу после своего хода тянем чаще — увидеть последствия побыстрее.
    return Date.now() - this.lastOwnMoveAt < 3000 ? 350 : 700;
  }

  private async tick(): Promise<void> {
    if (this.stopped) return;
    if (this.spectating) {
      await this.tickSpectator();
      return;
    }
    if (this.waiting) {
      await this.tickWaiting();
      return;
    }
    try {
      const r = await netPoll({
        data: {
          code: this.code,
          token: this.token,
          sinceVersion: this.lastVersion,
          sinceChatId: this.lastChatId,
          // Без sinceReactionId сервер присылал бы ВСЮ историю реакций: старые
          // пузыри всплывали бы повторно на каждом кадре.
          sinceReactionId: this.lastReactionId,
        },
      });
      if (!r.ok) {
        // Место могло исчезнуть не из-за кика: хост уменьшил число мест, и
        // сервер перевёл игрока в очередь с тем же токеном. Проверяем очередь
        // ДО выхода в меню — иначе игрока выбрасывало с «seat-taken».
        // Текст ошибки — страховка: в dev машиночитаемый код иногда теряется.
        const seatGone = r.code === "seat-taken" || /Место больше не существует/.test(r.error);
        if (seatGone && (await this.tryBecomeWaiting("capacity-shrunk"))) {
          return;
        }
        if (isFatalCode(r.code)) {
          this.fatal(r.code!);
          return;
        }
        throw new Error(r.error);
      }
      if ("unchanged" in r) {
        // Онлайн-метки обновились без смены версии партии; чат и реакции
        // доезжают и здесь — иначе они «залипают» при паузе партии. Зрители
        // нужны игрокам для «печатает…» и списка наблюдателей.
        this.failCount = 0;
        this.hooks.onSeats(r.seats, r.hostSeat, r.capacity, r.waiters, r.spectators);
        this.trackChat(r.chat);
        this.trackReactions(r.reactions);
      } else {
        this.accept(r);
      }
      if (this.wasReconnecting) {
        // Связь вернулась: баннер можно снимать уже сейчас.
        this.wasReconnecting = false;
        this.hooks.onStatus(this.seenStatus);
      }
      this.schedule();
    } catch {
      this.failCount += 1;
      if (this.failCount >= 3) {
        this.wasReconnecting = true;
        this.hooks.onStatus("reconnecting");
      }
      this.schedule();
    }
  }

  /** Поллинг зрителя: публичный вид стола, чат и реакции. */
  private async tickSpectator(): Promise<void> {
    try {
      const r = await netSpectatorPoll({
        data: {
          code: this.code,
          token: this.token,
          sinceChatId: this.lastChatId,
          sinceReactionId: this.lastReactionId,
        },
      });
      if (!r.ok) {
        if (isFatalCode(r.code)) {
          this.fatal(r.code!);
          return;
        }
        throw new Error(r.error);
      }
      this.failCount = 0;
      this.wasReconnecting = false;
      this.trackChat(r.snapshot.chat);
      this.trackReactions(r.snapshot.reactions);
      this.hooks.onSpectators(r.snapshot.spectators);
      // Статус — из свежего кадра. Раньше seenStatus оставался стартовым
      // «lobby» и затирал верный статус снапшота: зритель навсегда видел лобби.
      this.seenStatus = statusOf(r.snapshot.room.status);
      this.hooks.onSpectatorSnapshot(r.snapshot);
      this.hooks.onStatus(this.seenStatus);
      this.schedule();
    } catch {
      this.failCount += 1;
      if (this.failCount >= 3) {
        this.wasReconnecting = true;
        this.hooks.onStatus("reconnecting");
      }
      this.schedule();
    }
  }

  /**
   * Реакция игрока или зрителя; возвращает текст ошибки или null.
   * `chatId` — id реплики (M12): реакция ляжет под конкретное сообщение.
   * Без него — прежняя реакция «в стол»/игроку.
   */
  async sendReaction(
    emoji: ReactionMessage["emoji"],
    kind: "reaction" | "cheer",
    targetSeat?: number | null,
    chatId?: number | null,
  ): Promise<NetFail | null> {
    const r = await netReaction({
      data: {
        code: this.code,
        token: this.token,
        emoji,
        kind,
        targetSeat,
        ...(chatId != null ? { chatId } : {}),
      },
    });
    if (!r.ok) {
      if (isFatalCode(r.code)) this.fatal(r.code!);
      return { error: r.error, code: r.code };
    }
    this.trackReactions([r.reaction], false);
    this.schedule(0);
    return null;
  }

  /**
   * «Печатает…»: сигнал при наборе текста. Троттлинг клиентский (не чаще
   * ~1.5 с) плюс защита от параллельных запросов; ошибки глотаем — индикатор
   * необязателен, а состояние связи проверит обычный поллинг. Поллинг лишний
   * раз не дёргаем: соседи увидят метку сами, в своём кадре.
   */
  async sendTyping(): Promise<void> {
    if (this.stopped || this.typingBusy) return;
    const now = Date.now();
    if (now - this.typingAt < TYPING_THROTTLE_MS) return;
    this.typingAt = now;
    this.typingBusy = true;
    try {
      await netTyping({ data: { code: this.code, token: this.token } });
    } catch {
      // «Печатает…» — необязательная роскошь: связь проверит обычный поллинг.
    } finally {
      this.typingBusy = false;
    }
  }

  /**
   * Ожидающий при старте партии становится зрителем: сервер перенёс строку
   * очереди в evo_spectators с тем же токеном — продолжаем сессию в
   * зрительском тракте, а не уходим с «партия началась без вас».
   */
  private async becomeSpectator(): Promise<void> {
    const r = await netSpectatorPoll({
      data: {
        code: this.code,
        token: this.token,
        sinceChatId: this.lastChatId,
        sinceReactionId: this.lastReactionId,
      },
    });
    if (!r.ok) {
      if (isFatalCode(r.code)) {
        this.fatal(r.code!);
        return;
      }
      throw new Error(r.error);
    }
    clearQueueToken(this.code);
    this.saveWatchToken(this.code, this.token);
    this.attachSpectator(this.code, this.token);
    this.acceptSpectator(r.snapshot);
    this.schedule(0);
  }

  /**
   * Место исчезло (обычно хост уменьшил число мест и сервер перевёл игрока в
   * очередь ожидающих с тем же токеном). Проверяем очередь и, если токен там,
   * переходим на экран ожидания с пояснением, а не выходим в меню. Возвращает
   * true, если клиент снова при деле. note — код пояснения для стора.
   */
  private async tryBecomeWaiting(note: string): Promise<boolean> {
    const r = await netRoomInfo({ data: { code: this.code, token: this.token } }).catch(() => null);
    if (!r || !r.ok || !r.info.queued) return false;
    this.attachWaiting(this.code, this.token, r.info, note);
    return true;
  }

  /** Поллинг очереди: ждём место и занимаем его, как только оно появится. */
  private async tickWaiting(): Promise<void> {
    try {
      const r = await netRoomInfo({
        data: { code: this.code, token: this.token, sinceChatId: this.lastChatId },
      });
      if (!r.ok) {
        if (isFatalCode(r.code)) {
          this.fatal(r.code!);
          return;
        }
        throw new Error(r.error);
      }
      const info = r.info;
      this.failCount = 0;
      this.wasReconnecting = false;
      this.hooks.onWaiting(info, this.waitNote);
      this.trackChat(info.chat);
      if (info.room.status !== "lobby") {
        // Партия началась без нас: переключаемся в зрительский тракт
        // (сервер уже перенёс токен очереди в зрители).
        await this.becomeSpectator();
        return;
      }
      if (!info.queued && info.freeSeat === null) {
        // Токена в очереди нет и место не светит: кик либо партия началась.
        this.fatal(
          info.room.status === "lobby" ? "not-in-queue" : "started-without-you",
        );
        return;
      }
      if (info.freeSeat !== null) {
        await this.claimSeat();
        if (this.stopped) return;
      }
      this.schedule();
    } catch {
      this.failCount += 1;
      if (this.failCount >= 3) {
        this.wasReconnecting = true;
        this.hooks.onStatus("reconnecting");
      }
      this.schedule();
    }
  }
}
