/**
 * Клиентский драйвер сетевой партии: держит код стола и токен места,
 * тянет состояние циклом опроса с бэкоффом, переживает обрывы (токен
 * сохранён в localStorage — F5 и закрытие вкладки безболезненны).
 * Никакого React: стор подписывается через хуки NetHooks.
 */
import {
  netAction,
  netAgain,
  netCreateRoom,
  netJoinRoom,
  netPoll,
  netRejoin,
  netSetBots,
  netStart,
} from "./api";
import type { CreateRoomInput, PollResult, SeatInfo } from "./shared";
import type { GameAction } from "@/game/types";

export type NetStatus = "connecting" | "lobby" | "playing" | "reconnecting";

export interface NetHooks {
  onSnapshot: (snap: PollResult) => void;
  /** Обновление состава/онлайна/хоста без смены версии партии. */
  onSeats: (seats: SeatInfo[], hostSeat: number) => void;
  onStatus: (status: NetStatus) => void;
}

const NAME_KEY = "evo-net-name";
const tokKey = (code: string) => `evo-seat-${code}`;

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

export class NetSession {
  private code = "";
  private token = "";
  private lastVersion: number | undefined;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private failCount = 0;
  private stopped = false;
  private lastOwnMoveAt = 0;
  /** Последний полный кадр показывал идущую партию (для выхода из reconecting). */
  private seenPlaying = false;
  private wasReconnecting = false;

  constructor(private hooks: NetHooks) {}

  async create(input: CreateRoomInput): Promise<void> {
    saveName(input.name);
    const r = await netCreateRoom({ data: input });
    if (!r.ok) throw new Error(r.error);
    this.attach(r.code, r.token);
    this.hooks.onStatus("connecting");
    this.schedule(0);
  }

  async join(code: string, name: string): Promise<void> {
    saveName(name);
    const r = await netJoinRoom({ data: { code: code.toUpperCase(), name } });
    if (!r.ok) throw new Error(r.error);
    this.attach(code.toUpperCase(), r.token);
    this.hooks.onStatus("connecting");
    this.schedule(0);
  }

  /** Вернуться на стол по сохранённому токену (F5, обрыв, закрытая вкладка). */
  async resume(code: string): Promise<void> {
    const codeUp = code.toUpperCase();
    const token = loadToken(codeUp);
    if (!token) throw new Error("На этом устройстве нет места за этим столом");
    const r = await netRejoin({ data: { code: codeUp, token } });
    if (!r.ok) {
      try {
        localStorage.removeItem(tokKey(codeUp));
      } catch {
        // ignore
      }
      throw new Error(r.error);
    }
    this.attach(codeUp, token);
    this.accept(r.snapshot);
    this.schedule(0);
  }

  /** Ход: сервер проверяет и применяет, свежий кадр приходит в ответе. */
  async act(action: GameAction): Promise<string | null> {
    const r = await netAction({ data: { code: this.code, token: this.token, action } });
    if (!r.ok) return r.error;
    this.lastOwnMoveAt = Date.now();
    this.accept(r.snapshot);
    this.schedule(0);
    return null;
  }

  async setBots(count: number): Promise<void> {
    const r = await netSetBots({ data: { code: this.code, token: this.token, count } });
    if (!r.ok) throw new Error(r.error);
  }

  async start(): Promise<void> {
    const r = await netStart({ data: { code: this.code, token: this.token } });
    if (!r.ok) throw new Error(r.error);
    this.accept(r.snapshot);
  }

  async again(): Promise<void> {
    const r = await netAgain({ data: { code: this.code, token: this.token } });
    if (!r.ok) throw new Error(r.error);
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

  private attach(code: string, token: string): void {
    this.code = code;
    this.token = token;
    saveToken(code, token);
    this.stopped = false;
    this.failCount = 0;
  }

  private accept(snap: PollResult): void {
    this.lastVersion = snap.version;
    this.failCount = 0;
    this.seenPlaying = snap.room.status === "playing";
    const status: NetStatus = this.seenPlaying ? "playing" : "lobby";
    this.wasReconnecting = false;
    this.hooks.onSnapshot(snap);
    this.hooks.onStatus(status);
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
    try {
      const r = await netPoll({
        data: { code: this.code, token: this.token, sinceVersion: this.lastVersion },
      });
      if (!r.ok) throw new Error(r.error);
      if ("unchanged" in r) {
        // Онлайн-метки обновились без смены версии партии.
        this.failCount = 0;
        this.hooks.onSeats(r.seats, r.hostSeat);
      } else {
        this.accept(r);
      }
      if (this.wasReconnecting) {
        // Связь вернулась: баннер можно снимать уже сейчас.
        this.wasReconnecting = false;
        this.hooks.onStatus(this.seenPlaying ? "playing" : "lobby");
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
