/**
 * Общий контракт сетевой партии: типы кадров опроса, zod-схемы входа и
 * серверные константы темпа. Импортируется и клиентом, и сервером;
 * единственный игровой тип здесь — сам GameState.
 */
import { z } from "zod";
import type { Difficulty, GameAction, GameState } from "../../game/types.ts";

/** Минимальная поверхность SQL: удовлетворяется `Sql` из @/lib/db и тестовым PGlite. */
export interface SqlLike {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

export type RoomStatus = "lobby" | "playing" | "finished";

export interface SeatInfo {
  seat: number;
  name: string;
  isAI: boolean;
  /** Активен за последнюю минуту (last_seen_at обновляется poll'ом). */
  online: boolean;
}

export interface RoomMeta {
  code: string;
  status: RoomStatus;
  capacity: number;
  /** Минимальное место среди людей онлайн; создатель — место 0. */
  hostSeat: number;
}

/** Полный снимок комнаты для клиента; state === null в лобби. */
export interface PollResult {
  version: number;
  room: RoomMeta;
  seats: SeatInfo[];
  state: GameState | null;
  /** Место запрашивающего (по токену). */
  seat: number;
}

/** Ответ poll'а «ничего не изменилось»: онлайны обновляются без смены версии. */
export interface UnchangedPoll {
  unchanged: true;
  seats: SeatInfo[];
  hostSeat: number;
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
} as const;

const NAME = z.string().trim().min(1).max(16);
const CODE = z.string().trim().length(4);

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
  difficulty: z.enum(["easy", "normal", "hard"]) satisfies z.ZodType<Difficulty>,
  /** Включённые дополнения; ключи валидируются строго (белый список). */
  modules: z
    .object({
      continents: z.boolean().optional(),
      plants: z.boolean().optional(),
      fungi: z.boolean().optional(),
      randomMutations: z.boolean().optional(),
    })
    .partial()
    .default({})
    .optional(),
});
export type CreateRoomInput = z.infer<typeof createRoomInput>;

export const joinRoomInput = z.object({ code: CODE, name: NAME });
export const codeTokenInput = z.object({ code: CODE, token: z.string().min(10) });
export const botsInput = codeTokenInput.extend({ count: z.number().int().min(0).max(7) });
export const actionInput = z.object({
  code: CODE,
  token: z.string().min(10),
  action: z.custom<GameAction>((v) => typeof v === "object" && v !== null && "type" in v),
});
export const pollInput = codeTokenInput.extend({
  sinceVersion: z.number().int().optional(),
});
