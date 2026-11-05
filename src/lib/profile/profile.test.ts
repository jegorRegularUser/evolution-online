import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { createProfileService, ProfileError } from "./service.server.ts";
import type { CosmeticSlot, SqlLike } from "./shared.ts";

/**
 * Сервис профиля живёт на живом PGlite с реальной миграцией 0012: здесь
 * проверяются и инварианты сервиса, и сама DDL (FK «экипировано только
 * владеемое», check баланса, PK слотов).
 */

let sql: SqlLike;

const FIXED_NOW = new Date("2026-11-04T12:00:00Z");

before(async () => {
  const pg = new PGlite();
  await pg.waitReady;
  const ddl = readFileSync(
    fileURLToPath(new URL("../../../migrations/0012_player_identity.sql", import.meta.url)),
    "utf8",
  );
  await pg.exec(ddl);
  const ddl2 = readFileSync(
    fileURLToPath(new URL("../../../migrations/0013_challenges.sql", import.meta.url)),
    "utf8",
  );
  await pg.exec(ddl2);
  const run = async <T>(text: string, params: unknown[] = []): Promise<T[]> =>
    (await pg.query<T>(text, params)).rows as T[];
  sql = { query: run } as unknown as SqlLike;
});

const svc = (opts: Parameters<typeof createProfileService>[1] = {}) =>
  createProfileService(sql, { now: () => FIXED_NOW, ...opts });

const USER = "dev-user";
const OTHER = "user-2";

/** Ожидание отказа с конкретным кодом (сервис кидает ProfileError). */
async function rejectsCode(run: () => Promise<unknown>, code: string) {
  await assert.rejects(run, (e: unknown) => {
    assert.ok(e instanceof ProfileError, `ожидали ProfileError, получили ${String(e)}`);
    assert.equal((e as ProfileError).code, code);
    return true;
  });
}

describe("профиль: создание и чтение", () => {
  it("свежий профиль: баланс 0, владение и экипировка пусты", async () => {
    const s = svc();
    const p = await s.getProfile(USER);
    assert.equal(p.userId, USER);
    assert.equal(p.balance, 0);
    assert.deepEqual(p.owned, []);
    assert.deepEqual(p.equipped, []);
  });

  it("ensure идемпотентен: повторное чтение не плодит строк", async () => {
    const s = svc();
    await s.getProfile(USER);
    await s.getProfile(USER);
    const wallets = await sql.query("select user_id from evo_wallets where user_id = $1", [USER]);
    const profiles = await sql.query("select user_id from evo_profiles where user_id = $1", [USER]);
    assert.equal(wallets.length, 1);
    assert.equal(profiles.length, 1);
  });

  it("профили разных пользователей не пересекаются", async () => {
    const s = svc();
    await s.grantCoins(OTHER, 10, "test");
    const p = await s.getProfile(USER);
    assert.equal(p.balance, 0, "чужое начисление не течёт в dev-user");
  });
});

describe("кошелёк: начисление и списание", () => {
  it("начисления суммируются", async () => {
    const s = svc();
    assert.equal(await s.grantCoins(USER, 100, "test"), 100);
    assert.equal(await s.grantCoins(USER, 50, "test"), 150);
  });

  it("границы порции: 0, отрицательное, дробное и слишком большое — bad-amount", async () => {
    const s = svc();
    await rejectsCode(() => s.grantCoins(USER, 0, "test"), "bad-amount");
    await rejectsCode(() => s.grantCoins(USER, -5, "test"), "bad-amount");
    await rejectsCode(() => s.grantCoins(USER, 1.5, "test"), "bad-amount");
    await rejectsCode(() => s.grantCoins(USER, 10_001, "test"), "bad-amount");
  });

  it("пустой и слишком длинный источник выдачи — bad-amount", async () => {
    const s = svc();
    await rejectsCode(() => s.grantCoins(USER, 1, "   "), "bad-amount");
    await rejectsCode(() => s.grantCoins(USER, 1, "x".repeat(33)), "bad-amount");
  });

  it("списание уменьшает баланс", async () => {
    const s = svc();
    assert.equal(await s.spendCoins(USER, 80, "test"), 70);
  });

  it("списание сверх баланса — insufficient-funds, баланс не тронут", async () => {
    const s = svc();
    await rejectsCode(() => s.spendCoins(USER, 100, "test"), "insufficient-funds");
    const p = await s.getProfile(USER);
    assert.equal(p.balance, 70);
  });

  it("CAS-инвариант: списание из пустого кошелька отклоняется", async () => {
    const s = svc();
    await rejectsCode(() => s.spendCoins(OTHER + "-fresh", 1, "test"), "insufficient-funds");
  });
});

describe("косметика: владение и экипировка", () => {
  it("выдача предмета: первая создаёт строку, повтор — нет дубля", async () => {
    const s = svc();
    assert.deepEqual(await s.grantItem(USER, "cardback.fossils"), { alreadyOwned: false });
    assert.deepEqual(await s.grantItem(USER, "cardback.fossils"), { alreadyOwned: true });
    const rows = await sql.query("select item_id from evo_cosmetics_owned where user_id = $1", [
      USER,
    ]);
    assert.equal(rows.length, 1);
  });

  it("предмет в снапшоте несёт источник и время выдачи", async () => {
    const s = svc();
    await s.grantItem(USER, "felt.glacial", "test-source");
    const p = await s.getProfile(USER);
    const felt = p.owned.find((o) => o.itemId === "felt.glacial");
    assert.ok(felt, "felt.glacial во владении");
    assert.equal(felt.source, "test-source");
    assert.equal(new Date(felt.acquiredAt).toISOString(), FIXED_NOW.toISOString());
  });

  it("экипировать невладеемое — not-owned", async () => {
    const s = svc();
    await rejectsCode(() => s.equipItem(USER, "dice", "dice.amber"), "not-owned");
  });

  it("экипировка владеемого видна в снапшоте", async () => {
    const s = svc();
    await s.equipItem(USER, "cardback", "cardback.fossils");
    const p = await s.getProfile(USER);
    assert.ok(
      p.equipped.some((e) => e.slot === "cardback" && e.itemId === "cardback.fossils"),
      `cardback экипирован: ${JSON.stringify(p.equipped)}`,
    );
  });

  it("повторная экипировка слота заменяет предмет, строка одна", async () => {
    const s = svc();
    await s.grantItem(USER, "cardback.ice");
    await s.equipItem(USER, "cardback", "cardback.ice");
    const p = await s.getProfile(USER);
    const cardbacks = p.equipped.filter((e) => e.slot === "cardback");
    assert.equal(cardbacks.length, 1);
    assert.equal(cardbacks[0].itemId, "cardback.ice");
  });

  it("снятие экипировки идемпотентно", async () => {
    const s = svc();
    await s.unequipSlot(USER, "cardback");
    await s.unequipSlot(USER, "cardback");
    const p = await s.getProfile(USER);
    assert.ok(!p.equipped.some((e) => e.slot === "cardback"));
  });

  it("неизвестный слот и плохой item_id — отказ с кодом", async () => {
    const s = svc();
    await rejectsCode(
      () => s.equipItem(USER, "pet" as CosmeticSlot, "cardback.fossils"),
      "bad-slot",
    );
    await rejectsCode(() => s.grantItem(USER, "Not Valid!"), "bad-item");
    await rejectsCode(
      () => s.unequipSlot(USER, "pet" as CosmeticSlot),
      "bad-slot",
    );
  });

  it("сервис не позволяет экипировать чужое даже при совпадении item_id", async () => {
    const s = svc();
    // OTHER владеет только валютой — карточки нет.
    await rejectsCode(() => s.equipItem(OTHER, "cardback", "cardback.fossils"), "not-owned");
  });
});

describe("персистентность", () => {
  it("новый экземпляр сервиса над той же базой видит те же данные", async () => {
    const s2 = createProfileService(sql, { now: () => FIXED_NOW });
    const p = await s2.getProfile(USER);
    assert.equal(p.balance, 70);
    assert.ok(p.owned.some((o) => o.itemId === "cardback.fossils"));
  });
});

// ── Волна 3а: «Вызовы» ─────────────────────────────────────────────────────

const baseStats = {
  preyEaten: 0,
  defended: 0,
  fatStored: 0,
  traitsPlaced: 0,
  animalsPlaced: 0,
  animalsLost: 0,
  maxTraitsOnAnimal: 0,
  scavenges: 0,
  wildYearsSurvived: 0,
  games: 1,
  wins: 1,
  bestPlace: 1,
};

describe("вызовы: отчёт партии", () => {
  it("победа открывает тир 0 вызова «Победы» и платит ископаемыми", async () => {
    const s = svc();
    const res = await s.reportChallenges("ch-user-1", { stats: { ...baseStats }, feats: [] });
    const winClaim = res.claimed.find((c) => c.id === "wins" && c.tier === 0);
    assert.ok(winClaim, "тир 0 «Побед» получен");
    assert.ok(res.balance >= winClaim.coins, "баланс вырос на награду");
  });

  it("повторный отчёт той же партии не платит дважды (PK claims)", async () => {
    const s = svc();
    const first = await s.reportChallenges("ch-user-2", { stats: { ...baseStats }, feats: [] });
    const second = await s.reportChallenges("ch-user-2", { stats: { ...baseStats }, feats: [] });
    const firstWins = first.claimed.filter((c) => c.id === "wins").length;
    const secondWins = second.claimed.filter((c) => c.id === "wins").length;
    assert.equal(firstWins, 1);
    assert.equal(secondWins, 0, "тир уже оплачен");
  });

  it("метрики суммируются между партиями: 5 побед открывают тир 1", async () => {
    const s = svc({ challengeDailyCoins: 100_000 });
    const user = "ch-user-3";
    for (let i = 0; i < 5; i++) {
      await s.reportChallenges(user, { stats: { ...baseStats }, feats: [] });
    }
    const snap = await s.getChallenges(user);
    assert.equal(snap.progress["wins"], 5);
    assert.ok(snap.claimed.includes("wins:1"), "тир 1 «Побед» открыт");
  });

  it("подвиг платит один раз и помечается в featsDone", async () => {
    const s = svc({ challengeDailyCoins: 100_000 });
    const user = "ch-user-4";
    const stats = { ...baseStats, bigCarnivoreWin: true };
    const first = await s.reportChallenges(user, { stats, feats: ["bigCarnivoreWin"] });
    const second = await s.reportChallenges(user, { stats, feats: ["bigCarnivoreWin"] });
    const f1 = first.claimed.filter((c) => c.id === "bigCarnivoreWin").length;
    const f2 = second.claimed.filter((c) => c.id === "bigCarnivoreWin").length;
    assert.equal(f1, 1);
    assert.equal(f2, 0);
    const snap = await s.getChallenges(user);
    assert.ok(snap.featsDone.includes("bigCarnivoreWin"));
  });

  it("ретро-достижение открывает соответствующий тир задним числом", async () => {
    const s = svc();
    const s2 = svc({ challengeDailyCoins: 100_000 });
    const res = await s2.reportChallenges("ch-user-5", {
      stats: { ...baseStats },
      feats: [],
      retro: ["first-win", "wins-5"],
    });
    const snap = await s2.getChallenges("ch-user-5");
    assert.ok(snap.claimed.includes("wins:0"), "first-win → тир 0 «Побед»");
    assert.ok(snap.claimed.includes("wins:1"), "wins-5 → тир 1 «Побед»");
    assert.ok(res.balance > 0);
  });

  it("дневной кап останавливает выплаты, тиры остаются неснятыми", async () => {
    const s = svc();
    const user = "ch-user-6";
    // Много побед подряд: кап 300/день упирается после нескольких тиров.
    let capped = false;
    let claimedCoins = 0;
    for (let i = 0; i < 40 && !capped; i++) {
      const res = await s.reportChallenges(user, { stats: { ...baseStats }, feats: [] });
      claimedCoins = res.claimed.reduce((sum, c) => sum + c.coins, 0);
      capped = res.capped;
    }
    assert.ok(claimedCoins <= 300, `в день не больше 300, выдано ${claimedCoins}`);
    assert.equal(capped, true, "кап сработал");
    const snap = await s.getChallenges(user);
    assert.ok(snap.progress["wins"] > 0, "прогресс копится несмотря на кап");
  });
});
