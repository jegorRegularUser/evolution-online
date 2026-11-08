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
import { CHALLENGES, LEGACY_ACHIEVEMENT_MAP, challengeById } from "../../game/challenges.ts";
import type { GameRunStats } from "../../game/types.ts";
import { COSMETIC_PRICES, cosmeticById } from "../cosmetics.ts";
import {
  cosmeticItemIdSchema,
  cosmeticSlotSchema,
  type ChallengesReportResult,
  type ChallengesSnapshot,
  type CosmeticSlot,
  type EquippedItem,
  type OwnedItem,
  type ProfileErrorCode,
  type ProfileSnapshot,
  type SqlLike,
  type ChallengeReportInput,
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
/**
 * Дневной кап «Ископаемых» за вызовы (анти-фарм §3.2): полный каталог
 * выкупается за квартал активной игры, фарму одной лёгкой миссии кап не даёт.
 */
const CHALLENGE_DAILY_COINS = 300;

/**
 * Операторский кредит дев-базы «Ископаемых» (EVO_CREDIT_FOSSILS, сумма).
 *
 * Локальная разработка живёт на встраиваемом PGLite БЕЗ каталога данных
 * (src/lib/db.ts): процесс сервера умер — база опустела, внешний скрипт не
 * может «открыть ту же базу» с диска. Кредит делается изнутри процесса:
 * сумма задаётся переменной окружения, и ПЕРВЫЙ профильный запрос после
 * старта (ensurePlayer) добавляет её к кошельку — ровно один раз за жизнь
 * процесса, с before/after в консоли сервера. По умолчанию выключено: без
 * переменной поведение сервиса не меняется ни на бит. Границы GRANT_* —
 * про игровые награды; это инструмент владельца дев-стенда, у него своя
 * верхняя граница.
 */
const DEV_SEED_ENV = "EVO_CREDIT_FOSSILS";
const DEV_SEED_MAX = 1_000_000_000;

function parseDevSeed(raw: string | undefined): number {
  const n = Number(raw?.trim());
  if (!raw?.trim()) return 0;
  if (!Number.isInteger(n) || n <= 0 || n > DEV_SEED_MAX) {
    console.warn(`[profile] ${DEV_SEED_ENV}="${raw}" — не похоже на сумму, начисление пропущено`);
    return 0;
  }
  return n;
}

/** Сумма читается при первом профильном запросе, не при загрузке модуля:
 *  dev-раннеры (Vite SSR) могут пересобирать окружение после старта процесса.
 *  Отметка «начислено» живёт на globalThis: HMR пересоздаёт модуль вместе с
 *  его переменными, а начисление обязано случиться РОВНО раз за процесс. */
type DevSeedGlobal = typeof globalThis & {
  __evoDevSeedCoins__?: number | null;
  __evoDevSeedDone__?: Set<string>;
};
const devSeedGlobal = globalThis as DevSeedGlobal;

function devSeedOnce(): number {
  if (devSeedGlobal.__evoDevSeedCoins__ === undefined) {
    devSeedGlobal.__evoDevSeedCoins__ = parseDevSeed(process.env[DEV_SEED_ENV]);
    if (devSeedGlobal.__evoDevSeedCoins__ > 0) {
      console.log(`[profile] ${DEV_SEED_ENV}=${devSeedGlobal.__evoDevSeedCoins__} — операторский кредит активен`);
    }
  }
  return devSeedGlobal.__evoDevSeedCoins__ ?? 0;
}

export type GrantSource = string;

export interface ProfileServiceOptions {
  now?: () => Date;
  /** Дневной кап «Ископаемых» за вызовы (по умолчанию 300, §3.2). */
  challengeDailyCoins?: number;
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
  const challengeDailyCoins = options.challengeDailyCoins ?? CHALLENGE_DAILY_COINS;

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
    // Операторский кредит дев-базы: раз за жизнь процесса (см. шапку DEV_SEED_ENV).
    const devSeed = devSeedOnce();
    if (devSeed > 0) {
      devSeedGlobal.__evoDevSeedDone__ ??= new Set<string>();
      if (devSeedGlobal.__evoDevSeedDone__!.has(userId)) return;
      devSeedGlobal.__evoDevSeedDone__!.add(userId);
      const before = await sql.query<WalletRow>(
        "select balance from evo_wallets where user_id = $1",
        [userId],
      );
      const after = await sql.query<WalletRow>(
        "update evo_wallets set balance = balance + $2, updated_at = $3 where user_id = $1 returning balance",
        [userId, devSeed, stamp],
      );
      console.log(
        `[profile] ${DEV_SEED_ENV}: ${userId} ${Number(before[0]?.balance ?? 0)} -> ` +
          `${Number(after[0]?.balance ?? 0)} (+${devSeed})`,
      );
    }
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
        // Бесплатная «классика» слота принадлежит каждому по умолчанию (buyItem
        // её не продаёт — «она и так у каждого»), поэтому при экипировке выдаём
        // владение на лету: составной FK equipped→owned требует строку во
        // владении, а без выдачи из магазина нельзя вернуться на классику
        // после покупки платного скина.
        if (cosmeticById(item)?.price !== 0) {
          throw new ProfileError("not-owned", `Предмет не принадлежит игроку: ${item}`);
        }
        await this.grantItem(userId, item, "default");
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

    // ── Волна 3б: магазин (только earned-валюта, §3.2) ────────────────────

    /**
     * Покупка предмета за «Ископаемые». Цена берётся с СЕРВЕРНОГО каталога
     * (клиентский ценник не верифицирует ничего), списание — CAS-расходом,
     * выдача — тем же grantItem. Бесплатная «классика» слота не продаётся —
     * она и так у каждого (код "free-item").
     */
    async buyItem(userId: string, itemId: string): Promise<{ balance: number; alreadyOwned: boolean }> {
      const price = COSMETIC_PRICES[itemId];
      const item = cosmeticById(itemId);
      if (!item || price === undefined) {
        throw new ProfileError("bad-item", `Предмет не продаётся: ${JSON.stringify(itemId)}`);
      }
      if (price <= 0) {
        // Классика слота бесплатна и уже у каждого — «покупка» бессмысленна.
        throw new ProfileError("free-item", `Предмет бесплатен: ${itemId}`);
      }
      await ensurePlayer(userId);
      const owned = await sql.query<{ item_id: string }>(
        "select item_id from evo_cosmetics_owned where user_id = $1 and item_id = $2",
        [userId, itemId],
      );
      if (owned.length) {
        throw new ProfileError("already-owned", `Предмет уже куплен: ${itemId}`);
      }
      await this.spendCoins(userId, price, "shop");
      const granted = await this.grantItem(userId, itemId, "shop");
      const wallet = await sql.query<{ balance: number }>(
        "select balance from evo_wallets where user_id = $1",
        [userId],
      );
      return { balance: Number(wallet[0]?.balance ?? 0), alreadyOwned: granted.alreadyOwned };
    },

    // ── Волна 3а: «Вызовы» ────────────────────────────────────────────────    /** Снимок прогресса: накопленные значения + оплаченные тиры. */
    async getChallenges(userId: string): Promise<ChallengesSnapshot> {
      await ensurePlayer(userId);
      const rows = await sql.query<{ challenge_id: string; value: number }>(
        "select challenge_id, value from evo_challenge_progress where user_id = $1",
        [userId],
      );
      const progress: Record<string, number> = {};
      for (const row of rows) progress[row.challenge_id] = Number(row.value);
      const claimedRows = await sql.query<{ challenge_id: string; tier: number }>(
        "select challenge_id, tier from evo_challenge_claims where user_id = $1",
        [userId],
      );
      const featsRows = await sql.query<{ challenge_id: string }>(
        "select distinct challenge_id from evo_challenge_claims where user_id = $1",
        [userId],
      );
      return {
        progress,
        claimed: claimedRows.map((r) => `${r.challenge_id}:${r.tier}`),
        featsDone: featsRows.map((r) => r.challenge_id),
      };
    },

    /**
     * Отчёт партии: прибавить метрики, оценить тиры, выдать «Ископаемые».
     * Идемпотентность тирам даёт PK (user_id, challenge_id, tier) — повторный
     * отчёт той же партии награду не удваивает. Кап в день: тиры сверх капа
     * остаются неснятыми и приезжают завтра (§3.2, анти-фарм).
     */
    async reportChallenges(
      userId: string,
      report: ChallengeReportInput,
    ): Promise<ChallengesReportResult> {
      await ensurePlayer(userId);
      const stats = report.stats as GameRunStats;
      const now2 = now();
      const today = `${now2.getFullYear()}-${String(now2.getMonth() + 1).padStart(2, "0")}-${String(now2.getDate()).padStart(2, "0")}`;

      // Приращение cumulative-метрик: прирост читается по counterKey отчёта.
      for (const ch of CHALLENGES) {
        if (!ch.counterKey) continue;
        const raw = stats[ch.counterKey];
        const delta = Math.max(0, Math.floor(Number(raw) || 0));
        if (delta <= 0) continue;
        await sql.query(
          "insert into evo_challenge_progress (user_id, challenge_id, value, updated_at) values ($1, $2, $3, $4) on conflict (user_id, challenge_id) do update set value = evo_challenge_progress.value + excluded.value, updated_at = excluded.updated_at",
          [userId, ch.id, delta, now2],
        );
      }

      // Дневной кап: сколько уже выдано сегодня за вызовы.
      const daily = await sql.query<{ coins: number }>(
        "select coins from evo_challenge_daily where user_id = $1 and day = $2",
        [userId, today],
      );
      let usedToday = Number(daily[0]?.coins ?? 0);
      const claimed: ChallengesReportResult["claimed"] = [];
      let total = 0;
      let capped = false;

      const tryClaim = async (challengeId: string, tier: number, coins: number): Promise<boolean> => {
        if (usedToday + coins > challengeDailyCoins) {
          capped = true;
          return false;
        }
        const inserted = await sql.query<{ challenge_id: string }>(
          "insert into evo_challenge_claims (user_id, challenge_id, tier) values ($1, $2, $3) on conflict do nothing returning challenge_id",
          [userId, challengeId, tier],
        );
        if (!inserted.length) return false; // тир уже оплачен раньше
        usedToday += coins;
        total += coins;
        claimed.push({ id: challengeId, tier, coins });
        return true;
      };

      // Тиры cumulative — по накопленным значениям прогресса.
      const progressRows = await sql.query<{ challenge_id: string; value: number }>(
        "select challenge_id, value from evo_challenge_progress where user_id = $1",
        [userId],
      );
      const valueOf = new Map(progressRows.map((r) => [r.challenge_id, Number(r.value)]));
      for (const ch of CHALLENGES) {
        if (!ch.counterKey) continue;
        const value = valueOf.get(ch.id) ?? 0;
        for (let tier = 0; tier < ch.tiers.length; tier++) {
          if (value < ch.tiers[tier]!.n) break;
          await tryClaim(ch.id, tier, ch.tiers[tier]!.coins);
          if (capped) break;
        }
        if (capped) break;
      }
      // Старые достижения → тиры задним числом (дизайн-пакет §4.1В: не
      // оставлять два непересекающихся прогресса). Через ту же кассу: кап
      // и идемпотентность общие, «первый-вход» больше не повторится.
      for (const legacy of report.retro ?? []) {
        for (const target of LEGACY_ACHIEVEMENT_MAP[legacy] ?? []) {
          const ch = challengeById(target.id);
          const coins = ch?.tiers[target.tier]?.coins;
          if (coins === undefined) continue;
          await tryClaim(target.id, target.tier, coins);
        }
      }
      // Подвиги партии: сервер проверяет форму и идемпотентность; тир — нулевой.
      for (const featId of report.feats) {
        const ch = challengeById(featId);
        if (!ch?.feat || !ch.tiers.length) continue;
        await tryClaim(ch.id, 0, ch.tiers[0]!.coins);
      }

      // «Первая победа дня» (§3.2 — основной источник дохода): выигрыш в
      // ЛЮБОЙ партии, раз в день. Отдельная таблица = по построению анти-фарм
      // (пересоздал стол с ботами — строка на день уже стоит).
      let dailyFirstWin = 0;
      if ((stats.wins ?? 0) > 0) {
        const inserted = await sql.query<{ user_id: string }>(
          "insert into evo_daily_first_win (user_id, day) values ($1, $2) on conflict (user_id, day) do nothing returning user_id",
          [userId, today],
        );
        if (inserted.length) {
          dailyFirstWin = 50;
          await this.grantCoins(userId, dailyFirstWin, "daily-first-win");
        }
      }

      if (total > 0) {
        await sql.query(
          "insert into evo_challenge_daily (user_id, day, coins) values ($1, $2, $3) on conflict (user_id, day) do update set coins = evo_challenge_daily.coins + excluded.coins",
          [userId, today, total],
        );
        await this.grantCoins(userId, total, "challenge");
      }
      const wallet = await sql.query<{ balance: number }>(
        "select balance from evo_wallets where user_id = $1",
        [userId],
      );
      return { balance: Number(wallet[0]?.balance ?? 0), claimed, capped, dailyFirstWin };
    },
  };
}

export type ProfileService = ReturnType<typeof createProfileService>;
