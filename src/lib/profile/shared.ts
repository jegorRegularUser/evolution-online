/**
 * Общий контракт профиля игрока: zod-схемы входа, коды ошибок и слоты
 * косметики. Импортируется и клиентом, и сервером — как net/shared.ts;
 * серверного импорта здесь быть не должно.
 */
import { z } from "zod";

/** Минимальная поверхность SQL: удовлетворяется `Sql` из @/lib/db и тестовым PGlite. */
export interface SqlLike {
  <T = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]>;
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

/**
 * Слоты экипировки — витрина косметики v1 из дизайн-пакета (§3.1):
 * рубашки карт/колод, сукно стола, кубик, аватар, рамка, медальон.
 * Все слоты видимы сопернику (видимость = ценность). Новый слот — правка
 * этого списка, миграция не нужна (в БД slot — текст с PK (user_id, slot)).
 */
export const COSMETIC_SLOTS = ["cardback", "felt", "dice", "avatar", "frame", "medal"] as const;

export type CosmeticSlot = (typeof COSMETIC_SLOTS)[number];

export const cosmeticSlotSchema = z.enum(COSMETIC_SLOTS);

/**
 * Идентификатор предмета: машинное имя каталога магазина (волна 3б), например
 * "cardback.fossils-amber" или "felt.glacial". Свободный состав справочника —
 * в БД item_id без FK на каталог; здесь только форма.
 */
export const cosmeticItemIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9_.-]*$/, "bad-item");

/** Машинные коды отказов профиля: клиент переводит их в локализованный текст. */
export type ProfileErrorCode =
  | "bad-amount"
  | "bad-item"
  | "bad-slot"
  | "not-owned"
  | "insufficient-funds";

/** Вход cosmeticsEquip: itemId === null — снять экипировку слота. */
export const equipInputSchema = z.object({
  slot: cosmeticSlotSchema,
  itemId: cosmeticItemIdSchema.nullable(),
});

export type EquipInput = z.infer<typeof equipInputSchema>;

export interface OwnedItem {
  itemId: string;
  source: string;
  acquiredAt: string;
}

export interface EquippedItem {
  slot: CosmeticSlot;
  itemId: string;
}

/** Полный кадр профиля для ответа profileGet. */
export interface ProfileSnapshot {
  userId: string;
  balance: number;
  owned: OwnedItem[];
  equipped: EquippedItem[];
}

// ── Волна 3а: «Вызовы» ─────────────────────────────────────────────────────

/** Метрики одной партии (GameRunStats в сообщении). */
export interface ChallengeReportInput {
  stats: {
    preyEaten: number;
    defended: number;
    fatStored: number;
    traitsPlaced: number;
    animalsPlaced: number;
    animalsLost: number;
    maxTraitsOnAnimal: number;
    scavenges: number;
    wildYearsSurvived: number;
    games: number;
    wins: number;
    bestPlace: number;
    winsModule?: Record<string, number>;
    bigCarnivoreWin?: boolean;
  };
  /** Подвиги этой партии (id из каталога feat-вызовов). */
  feats: string[];
  /** Старые достижения (stats.ts) — миграция задним числом, один раз. */
  retro?: string[];
}

export interface ChallengeClaimResult {
  id: string;
  tier: number;
  coins: number;
}

export interface ChallengesReportResult {
  balance: number;
  claimed: ChallengeClaimResult[];
  /** Дневной кап: часть тиров осталась на завтра (§3.2 анти-фарм). */
  capped: boolean;
}

/** Zod-форма отчёта партии: белые списки полей метрик и id-подвигов. */
export const challengeReportInputSchema = z.object({
  stats: z.object({
    preyEaten: z.number().int().min(0).max(500),
    defended: z.number().int().min(0).max(500),
    fatStored: z.number().int().min(0).max(500),
    traitsPlaced: z.number().int().min(0).max(500),
    animalsPlaced: z.number().int().min(0).max(500),
    animalsLost: z.number().int().min(0).max(500),
    maxTraitsOnAnimal: z.number().int().min(0).max(20),
    scavenges: z.number().int().min(0).max(500),
    wildYearsSurvived: z.number().int().min(0).max(100),
    games: z.number().int().min(0).max(5),
    wins: z.number().int().min(0).max(5),
    bestPlace: z.number().int().min(1).max(9),
    winsModule: z.record(z.string(), z.number().int().min(0).max(5)).optional(),
    bigCarnivoreWin: z.boolean().optional(),
  }),
  feats: z.array(z.string().regex(/^[a-z][a-zA-Z]+$/)).max(8),
  retro: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(32).optional(),
});

/** Прогресс вызовов: накопленные значения по id вызова + полученные тиры. */
export interface ChallengesSnapshot {
  /** challenge_id → накопленное значение (для cumulative-вызовов). */
  progress: Record<string, number>;
  /** Ключ "id:tier" уже оплаченных тиров. */
  claimed: string[];
  /** Подвиги, засчитанные хоть раз (для галочек феатов). */
  featsDone: string[];
}
