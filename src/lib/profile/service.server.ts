/**
 * Сервис серверной идентичности игрока (волна 0 дизайн-пакета расширения).
 *
 * Всё, что принадлежит игроку между партиями: профиль, кошелёк «Ископаемых»
 * (единственная earned-валюта, §3.2 дизайн-пакета), владение косметикой и
 * экипировка по слотам. Инварианты держит сервер: клиент не может ни
 * присвоить валюту, ни экипировать невладеемое (составной FK в БД + проверка
 * владения в equipItem). Выдача наград — только серверный код (волны 3а/3б);
 * отдельного «админского» API здесь нет намеренно.
 *
 * Фабрика принимает SqlLike и часы — как createRoomService: тестируется на
 * живом PGlite без сетевого контекста TanStack Start. Вызывается из
 * server functions (api.ts) с user_id, проверенным authMiddleware; сам сервис
 * контекстом запроса не располагает и userId трактует как уже проверенный.
 */
import {
  cosmeticItemIdSchema,
  cosmeticSlotSchema,
  type CosmeticSlot,
  type EquippedItem,
  type OwnedItem,
  type ProfileErrorCode,
  type ProfileSnapshot,
  type SqlLike,
} from "./shared.ts";

/** Ошибка сервиса с машинным кодом: клиент переводит код в локальный текст. */
export class ProfileError extends Error {
  readonly code: ProfileErrorCode;

  constructor(code: ProfileErrorCode, message: string) {
    super(message);
    this.name = "ProfileError";
    this.code = code;
  }
}

/** Границы одной выдачи валюты: награды приходят порциями, не залпом. */
const GRANT_MIN = 1;
const GRANT_MAX = 10_000;
/** Верхняя граница источника выдачи («daily-first-win», «challenge», …). */
const SOURCE_MAX = 32;

export type GrantSource = string;

export interface ProfileServiceOptions {
  now?: () => Date;
}

interface WalletRow {
  balance: number;
}

interface OwnedRow {
  item_id: string;
  source: string;
  acquired_at: Date | string;
}

interface EquippedRow {
  slot: string;
  item_id: string;
}

/** timestamptz приходит от pg как Date, от тестового PGlite тоже как Date —
 * но контракт наружу фиксированный: ISO-строка в поле снапшота. */
function toIso(value: Date | string): string {
  return typeof value === "string" ? value : value.toISOString();
}

function assertItemId(itemId: string): string {
  const parsed = cosmeticItemIdSchema.safeParse(itemId);
  if (!parsed.success) {
    throw new ProfileError("bad-item", `Плохой item_id: ${JSON.stringify(itemId)}`);
  }
  return parsed.data;
}

function assertSource(source: GrantSource): string {
  const trimmed = source.trim();
  if (trimmed.length < 1 || trimmed.length > SOURCE_MAX) {
    throw new ProfileError("bad-amount", `Плохой источник выдачи: ${JSON.stringify(source)}`);
  }
  return trimmed;
}

export function createProfileService(sql: SqlLike, options: ProfileServiceOptions = {}) {
  const now = options.now ?? (() => new Date());

  /** Создаёт профиль и кошелёк, если их ещё нет. Идемпотентно. */
  async function ensurePlayer(userId: string): Promise<void> {
    const stamp = now();
    await sql.query(
      "insert into evo_profiles (user_id, created_at, updated_at, last_seen_at) values ($1, $2, $2, $2) on conflict (user_id) do nothing",
      [userId, stamp],
    );
    await sql.query(
      "insert into evo_wallets (user_id, updated_at) values ($1, $2) on conflict (user_id) do nothing",
      [userId, stamp],
    );
  }

  return {
    /**
     * Полный кадр профиля: баланс, владение, экипировка. Читается часто
     * (каждый заход в профиль/магазин), поэтому без лишних апдейтов —
     * last_seen трогать здесь нельзя, чтобы чтение не блокировалось записью.
     */
    async getProfile(userId: string): Promise<ProfileSnapshot> {
      await ensurePlayer(userId);
      const wallet = await sql.query<WalletRow>(
        "select balance from evo_wallets where user_id = $1",
        [userId],
      );
      const ownedRows = await sql.query<OwnedRow>(
        "select item_id, source, acquired_at from evo_cosmetics_owned where user_id = $1 order by acquired_at, item_id",
        [userId],
      );
      const equippedRows = await sql.query<EquippedRow>(
        "select slot, item_id from evo_cosmetics_equipped where user_id = $1 order by slot",
        [userId],
      );
      const owned: OwnedItem[] = ownedRows.map((row) => ({
        itemId: row.item_id,
        source: row.source,
        acquiredAt: toIso(row.acquired_at),
      }));
      const equipped: EquippedItem[] = equippedRows.map((row) => ({
        slot: cosmeticSlotSchema.parse(row.slot) as CosmeticSlot,
        itemId: row.item_id,
      }));
      return { userId, balance: Number(wallet[0]?.balance ?? 0), owned, equipped };
    },

    /**
     * Начисление «Ископаемых». Границы порции — защита от опечатки в правиле
     * награды: промах на порядок падает на assert, а не на баланс игрока.
     * Журнал валютных выдач в волне 0 не ведётся (ledger — кандидат в волну
     * 3а, когда появятся правила начисления за вызовы и «первую победу дня»).
     */
    async grantCoins(userId: string, amount: number, source: GrantSource): Promise<number> {
      if (!Number.isInteger(amount) || amount < GRANT_MIN || amount > GRANT_MAX) {
        throw new ProfileError("bad-amount", `Начисление вне границ: ${amount}`);
      }
      assertSource(source);
      await ensurePlayer(userId);
      const rows = await sql.query<WalletRow>(
        "update evo_wallets set balance = balance + $2, updated_at = $3 where user_id = $1 returning balance",
        [userId, amount, now()],
      );
      return Number(rows[0]?.balance ?? 0);
    },

    /**
     * Списание. Атомарное CAS-обновление (как casUpdate у комнат): условие
     * `balance >= amount` в WHERE не даёт уйти в минус при гонке двух списаний
     * — проигравшая гонка просто не найдёт строку и получит отказ.
     */
    async spendCoins(userId: string, amount: number, source: GrantSource): Promise<number> {
      if (!Number.isInteger(amount) || amount < GRANT_MIN || amount > GRANT_MAX) {
        throw new ProfileError("bad-amount", `Списание вне границ: ${amount}`);
      }
      assertSource(source);
      const rows = await sql.query<WalletRow>(
        "update evo_wallets set balance = balance - $2, updated_at = $3 where user_id = $1 and balance >= $2 returning balance",
        [userId, amount, now()],
      );
      if (!rows.length) {
        throw new ProfileError("insufficient-funds", "Недостаточно «Ископаемых»");
      }
      return Number(rows[0].balance);
    },

    /**
     * Выдача предмета косметики. Повторная выдача того же — не ошибка и не
     * дубль строки (PK (user_id, item_id) + on conflict do nothing): правила
     * наград в волнах 3а/3б не обязаны помнить, что уже выдавали.
     */
    async grantItem(
      userId: string,
      itemId: string,
      source: GrantSource = "grant",
    ): Promise<{ alreadyOwned: boolean }> {
      const item = assertItemId(itemId);
      const cleanSource = assertSource(source);
      await ensurePlayer(userId);
      const inserted = await sql.query<{ item_id: string }>(
        "insert into evo_cosmetics_owned (user_id, item_id, source, acquired_at) values ($1, $2, $3, $4) on conflict (user_id, item_id) do nothing returning item_id",
        [userId, item, cleanSource, now()],
      );
      return { alreadyOwned: inserted.length === 0 };
    },

    /**
     * Экипировать слот. Владение проверяется до записи; составной FK страхует
     * от прямых записей мимо сервиса. item в слоте заменяется — последняя
     * экипировка выигрывает.
     */
    async equipItem(userId: string, slot: CosmeticSlot, itemId: string): Promise<void> {
      const item = assertItemId(itemId);
      const parsedSlot = cosmeticSlotSchema.safeParse(slot);
      if (!parsedSlot.success) {
        throw new ProfileError("bad-slot", `Неизвестный слот: ${String(slot)}`);
      }
      await ensurePlayer(userId);
      const owned = await sql.query<{ item_id: string }>(
        "select item_id from evo_cosmetics_owned where user_id = $1 and item_id = $2",
        [userId, item],
      );
      if (!owned.length) {
        throw new ProfileError("not-owned", `Предмет не принадлежит игроку: ${item}`);
      }
      await sql.query(
        "insert into evo_cosmetics_equipped (user_id, slot, item_id, updated_at) values ($1, $2, $3, $4) on conflict (user_id, slot) do update set item_id = excluded.item_id, updated_at = excluded.updated_at",
        [userId, parsedSlot.data, item, now()],
      );
    },

    /** Снять экипировку слота. Отсутствующая строка — не ошибка (идемпотентно). */
    async unequipSlot(userId: string, slot: CosmeticSlot): Promise<void> {
      const parsedSlot = cosmeticSlotSchema.safeParse(slot);
      if (!parsedSlot.success) {
        throw new ProfileError("bad-slot", `Неизвестный слот: ${String(slot)}`);
      }
      await sql.query("delete from evo_cosmetics_equipped where user_id = $1 and slot = $2", [
        userId,
        parsedSlot.data,
      ]);
    },
  };
}

export type ProfileService = ReturnType<typeof createProfileService>;
