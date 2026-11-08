import { it } from "node:test";
import assert from "node:assert/strict";
import { createGame, applyAction, legalDevActions, legalFeedActions, legalDefenseActions, baseFoodSpec, territoryFoodSpec } from "./engine.ts";
import { chooseAIAction } from "./ai.ts";
import { FLORA, fullMarksPool } from "./flora.ts";
import { PLANTS, plantTable, shelterCapacity } from "./plants.ts";
import { TRAITS } from "./traits.ts";
import { assertModuleCompatibility, moduleCompatibilityError } from "./module-compatibility.ts";
import type { GameAction, GameState, EnabledModules, MarkKind } from "./types.ts";

const MODULES = ["continents", "plants", "fungi", "randomMutations"] as const;
const SEEDS = [7, 42, 20260917];
const MAX_STEPS = 6000;

function flags(mask: number): EnabledModules {
  return Object.fromEntries(MODULES.map((id, bit) => [id, Boolean(mask & (1 << bit))]));
}

function nextAction(g: GameState): GameAction {
  if (g.phase === "foodBank") return { type: g.foodRoll ? "beginFeeding" : "rollFoodBank" };
  if (g.phase === "extinction") return { type: "continueExtinction" };
  if (g.phase === "growth") return { type: "continueGrowth" };
  const legal = g.pendingAttack
    ? legalDefenseActions(g, g.pendingAttack.waitingFor)
    : g.phase === "development" ? legalDevActions(g, g.currentPlayerId) : legalFeedActions(g, g.currentPlayerId);
  // AI consumes the game's RNG; both replays use the same exported policy.
  const action = chooseAIAction(g);
  assert.ok(action, `No action: year=${g.year} phase=${g.phase}`);
  assert.ok(legal.some((a) => JSON.stringify(a) === JSON.stringify(action)), "AI action must be legal");
  return action;
}

function count(n: number, label: string, max = Infinity) {
  assert.ok(Number.isSafeInteger(n) && n >= 0 && n <= max, `${label}: ${n} (max ${max})`);
}

function invariants(g: GameState) {
  count(g.foodBank, "bank");
  if (g.modules.continents && g.territoryFood) {
    for (const [zone, food] of Object.entries(g.territoryFood)) count(food, `bank/${zone}`);
    assert.equal(g.foodBank, Object.values(g.territoryFood).reduce((a, b) => a + b, 0), "territory bank sum");
  }
  const animals = g.players.flatMap((p) => p.animals);
  const entities = [...animals, ...(g.plants ?? []), ...(g.flora ?? [])];
  assert.equal(new Set(entities.map((a) => a.id)).size, entities.length, "unique entity ids");
  const stock = [...g.deck, ...g.players.flatMap((p) => [...p.hand, ...(p.blindDeck ?? [])])];
  const stockIds = new Set(stock.map((c) => c.id));
  assert.equal(stockIds.size, stock.length, "no card in two decks/hands");
  const bodies = new Set(animals.map((a) => a.cardId));
  assert.equal(bodies.size, animals.length, "unique body cards");
  for (const a of entities) {
    if (!("traits" in a)) continue;
    for (const t of a.traits) {
      // A mutant's intrinsic trait shares its OWN body card by representation.
      const intrinsic = g.modules.randomMutations && "cardId" in a && a.cardId === t.cardId;
      assert.ok(!stockIds.has(t.cardId) && (!bodies.has(t.cardId) || intrinsic), `trait card reused ${t.cardId}`);
      if (!t.pairWith) continue;
      const partner = entities.find((b) => b.id === t.pairWith);
      assert.ok(partner && "traits" in partner, `dangling pair ${a.id}->${t.pairWith}`);
      assert.ok(partner.traits.some((b) => b.cardId === t.cardId && b.pairWith === a.id && b.type === t.type), `asymmetric pair ${t.cardId}`);
      if (g.modules.continents) assert.equal(a.zoneId, partner.zoneId, `cross-territory pair ${t.cardId}`);
    }
  }
  for (const p of g.players) {
    count(p.discardCount, "discard");
    if (g.modules.randomMutations) assert.equal(p.hand.length, 0, "mutations have no hand");
    for (const a of p.animals) {
      assert.equal(a.ownerId, p.id);
      assert.ok(!stockIds.has(a.cardId), "body card still in stock");
      count(a.food, "animal food");
      count(a.blueFood, "blue food", a.food);
      count(a.fatTokens, "fat");
      assert.ok(Number.isSafeInteger(a.population ?? 1) && (a.population ?? 1) >= 1);
      assert.equal(new Set(a.marks ?? []).size, a.marks?.length ?? 0, "duplicate marks");
    }
  }
  if (g.modules.plants) {
    assert.equal(g.plantDeckCount, g.plantDeck!.length);
    count(g.plants!.filter((p) => p.kind !== "parasite").length, "plant table", plantTable(g.players.length).max);
    for (const p of g.plants!) {
      count(p.food, "plant food", PLANTS[p.kind].maxFood);
      count(p.shelters, "shelters", shelterCapacity(p));
      if (p.hostId) assert.ok(g.plants!.some((host) => host.id === p.hostId), "missing parasite host");
    }
  } else assert.equal(g.plants, undefined);
  if (g.modules.fungi) {
    assert.equal(g.floraDeckCount, g.floraDeck!.length);
    count(g.flora!.length, "flora table", 8);
    assert.equal(g.flora!.length + g.floraDeck!.length + (g.floraDiscard ?? 0), 24, "flora card conservation");
    for (const f of g.flora!) count(f.food, "flora food", 4);
    for (const mark of Object.keys(fullMarksPool()) as MarkKind[]) {
      const onAnimals = animals.filter((a) => a.marks?.includes(mark)).length;
      count(g.marksPool![mark] ?? 0, `marks/${mark}`, 4);
      assert.equal((g.marksPool![mark] ?? 0) + onAnimals, 4, `mark conservation/${mark}`);
    }
  } else {
    assert.equal(g.flora, undefined);
    assert.equal(g.marksPool, undefined);
  }
}

for (let mask = 0; mask < 16; mask++) {
  const modules = flags(mask);
  const label = `mask=${mask.toString(2).padStart(4, "0")} ${MODULES.filter((id) => modules[id]).join("+") || "base"}`;
  const invalid = Boolean(modules.fungi && (modules.plants || modules.randomMutations));
  it(`module compatibility: ${label}`, () => {
    const before = structuredClone(modules);
    if (invalid) {
      assert.throws(() => assertModuleCompatibility(modules), /несовместима/);
      assert.match(moduleCompatibilityError(modules, "en")!, /cannot be combined/);
    } else {
      assert.doesNotThrow(() => assertModuleCompatibility(modules));
      assert.equal(moduleCompatibilityError(modules, "en"), null);
    }
    assert.deepEqual(modules, before, "never silently remove flags");
  });
  if (invalid) continue;
  it(`module setup / food / card counts: ${label}`, () => {
    for (const seed of SEEDS) for (const n of [2, 3, 4]) {
      let g = createGame(n, "normal", seed, undefined, modules);
      assert.deepEqual(g, createGame(n, "normal", seed, undefined, modules));
      // Mutations rules p.12: only herding and edificator from Continents (10 cards).
      const continentCards = modules.continents ? (modules.randomMutations ? 10 : 42) : 0;
      const total = 84 + continentCards + (modules.plants ? 36 : 0) + (modules.fungi ? 8 : 0) + (modules.randomMutations ? 28 : 0);
      const deal = modules.randomMutations ? 7 : modules.plants ? 8 : 6;
      const startingSpecies = modules.randomMutations ? 3 : 0;
      assert.equal(g.deck.length, total - n * (deal + startingSpecies));
      for (const p of g.players) {
        assert.equal(p.hand.length, modules.randomMutations ? 0 : deal);
        assert.equal(p.blindDeck?.length ?? 0, modules.randomMutations ? deal : 0);
        assert.equal(p.animals.length, startingSpecies);
      }
      if (modules.plants) {
        assert.equal(g.plants!.length, n + 1);
        assert.equal(g.plantDeck!.length, 36 - (n + 1));
        for (const p of g.plants!) assert.equal(p.food, PLANTS[p.kind].startFood);
      }
      if (modules.fungi) {
        assert.equal(g.flora!.length, 2);
        assert.equal(g.floraDeck!.length, 22);
        assert.deepEqual(g.marksPool, fullMarksPool());
        for (const f of g.flora!) assert.equal(f.food, FLORA[f.kind].isFungus ? 1 : 3);
      }
      invariants(g);
      // No traits/edificators: first year's food has an independent exact oracle.
      for (let i = 0; g.phase === "development" && i < n + 1; i++) g = applyAction(g, { type: "devPass" });
      assert.notEqual(g.phase, "development");
      if (modules.continents || !(modules.plants || modules.fungi)) {
        assert.equal(g.phase, "foodBank");
        g = applyAction(g, { type: "rollFoodBank" });
        assert.ok(g.foodRoll!.every((die) => Number.isInteger(die) && die >= 1 && die <= 6));
        if (modules.continents) {
          // Официальная таблица: Лавразия — белые кубики, Гондвана — цветные,
          // Океан — константа «число игроков + 1». С растениями/грибами еда на
          // континентах лежит на столе флоры, поэтому базы континентов нулевые.
          const spec = territoryFoodSpec(n);
          const flora = modules.plants || modules.fungi;
          const sum = (from: number, count: number) =>
            g.foodRoll!.slice(from, from + count).reduce((a, b) => a + b, 0);
          const laurasia = flora ? 0 : sum(0, spec.laurasia.dice) + spec.laurasia.bonus;
          const gondwana = flora
            ? 0
            : sum(spec.laurasia.dice, spec.gondwana.dice) + spec.gondwana.bonus;
          assert.deepEqual(g.territoryFood, { laurasia, gondwana, ocean: spec.ocean });
        } else {
          const spec = baseFoodSpec(n);
          assert.equal(g.foodBank, g.foodRoll!.reduce((a, b) => a + b, 0) + spec.bonus);
        }
      } else assert.equal(g.foodBank, 0);
      invariants(g);
    }
  });
  for (const seed of SEEDS) {
    it(`module full-game smoke: ${label} seed=${seed}`, { timeout: 30_000 }, (t) => {
      let g = createGame(3, "normal", seed, undefined, modules);
      let replay = structuredClone(g);
      const violations = new Map<string, string>();
      const phases = new Set([g.phase]);
      let step = 0;
      for (; g.phase !== "gameOver" && step < MAX_STEPS; step++) {
        const action = nextAction(g);
        assert.deepEqual(action, nextAction(replay), `replay action step=${step}`);
        g = applyAction(g, action);
        replay = applyAction(replay, action);
        phases.add(g.phase);
        try { invariants(g); } catch (e) {
          // Continue the game to test liveness even when a separate invariant fails.
          const message = (e as Error).message.split("\n")[0]!;
          if (!violations.has(message)) violations.set(message, `step=${step} year=${g.year} action=${JSON.stringify(action)}`);
        }
      }
      t.diagnostic(`steps=${step} year=${g.year} phase=${g.phase} phases=${[...phases].join(",")}`);
      assert.equal(g.phase, "gameOver", `step budget exceeded: ${label} seed=${seed} year=${g.year}`);
      assert.deepEqual(g, replay, "full replay is deterministic");
      assert.ok(phases.has("feeding") && phases.has("extinction"));
      assert.equal(g.scores!.length, 3 + (modules.fungi ? 1 : 0));
      for (const score of g.scores!) {
        assert.equal(score.total, score.animals + score.traits + score.extras);
        if (score.playerId >= 0) {
          const animals = g.players[score.playerId]!.animals;
          assert.equal(score.animals, animals.reduce((sum, a) => sum + 2 * (a.population ?? 1), 0));
          assert.equal(score.extras, animals.flatMap((a) => a.traits).filter((t) => !t.disabled).reduce((sum, t) => sum + TRAITS[t.type].scoreBonus, 0));
        }
      }
      assert.ok(g.winnerIds!.length > 0);
      assert.deepEqual([...violations], [], `invariant failures: ${label} seed=${seed}`);
    });
  }
}
