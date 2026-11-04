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
