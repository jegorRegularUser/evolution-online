import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalFeedActions } from "./engine.ts";
import { fullMarksPool } from "./flora.ts";
import { canAttack, canMigrate, canReceiveFood, herdingProtects } from "./queries.ts";
import type { Animal, FloraKind, GameAction, GameState, MarkKind, TraitId, TraitInstance } from "./types.ts";

let seq = 0;
function trait(type: TraitId, extra: Partial<TraitInstance> = {}): TraitInstance {
  return { id: `t${++seq}`, cardId: `c${seq}`, type, hidden: false, playSeq: seq, ...extra };
}
function animal(id: string, ownerId: number, traits: TraitInstance[] = []): Animal {
  return { id, ownerId, cardId: `body-${id}`, traits, food: 0, blueFood: 0, fatTokens: 0,
    hibernating: false, hibernatedLastYear: false, receivedFoodThisYear: false, poisoned: false, seed: 1 };
}
function scenario(mine: Animal[], theirs: Animal[] = [animal("other", 1)], kind: FloraKind = "mold"): GameState {
  const g = createGame(2, "normal", 7, undefined, { fungi: true });
  g.players[0]!.animals = mine;
  g.players[1]!.animals = theirs;
  for (const p of g.players) { p.hand = []; p.passedFeed = false; }
  // Spare hungry animals prevent automatic extinction from erasing marks/evidence.
  g.players[0]!.animals.push(animal("spare-0", 0));
  g.players[1]!.animals.push(animal("spare-1", 1));
  g.phase = "feeding";
  g.currentPlayerId = 0;
  g.flora = [{ id: "flora", kind, food: 4, playSeq: 1 }];
  g.floraDeck = [];
  g.marksPool = fullMarksPool();
  for (const p of g.players) for (const a of p.animals) for (const m of a.marks ?? []) g.marksPool[m]! -= 1;
  g.turnUse = { carnivores: [], pirates: [], grazers: [], foodTaken: false, combatUsed: false,
    migrated: false, sheltered: false, hibernated: [] };
  return g;
}
function act(g: GameState, action: GameAction): GameState {
  assert.ok(legalFeedActions(g, g.currentPlayerId).some((a) => JSON.stringify(a) === JSON.stringify(action)), "fixture action must be legal");
  return applyAction(g, action);
}
const take: GameAction = { type: "feedTakeFlora", animalId: "a", floraId: "flora" };

describe("flora audit: regressions", () => {
  for (const marks of [["thryn", "poison", "antidote"], ["poison", "thryn", "antidote"], ["poison", "antidote", "thryn"]] satisfies MarkKind[][]) {
    it(`transfers all prey marks regardless of thryn position: ${marks.join(",")}`, () => {
      const hunter = animal("a", 0, [trait("carnivore"), trait("parasite")]);
      const prey = animal("prey", 1); prey.marks = marks;
      const g = scenario([hunter], [prey]);
      const next = act(g, { type: "feedHunt", carnivoreId: "a", preyId: "prey" });
      const a = next.players[0]!.animals[0]!;
      assert.deepEqual(new Set(a.marks), new Set(marks));
      for (const mark of marks) assert.equal(next.marksPool![mark], 3);
      assert.equal(a.traits.some((t) => t.type === "parasite"), false);
      assert.deepEqual(g.players[0]!.animals[0]!.marks, undefined, "input state is unchanged");
    });
  }
  it("an existing thryn still blocks every transferred mark", () => {
    const hunter = animal("a", 0, [trait("carnivore")]); hunter.marks = ["thryn"];
    const prey = animal("prey", 1); prey.marks = ["poison", "antidote"];
    const next = act(scenario([hunter], [prey]), { type: "feedHunt", carnivoreId: "a", preyId: "prey" });
    assert.deepEqual(next.players[0]!.animals[0]!.marks, ["thryn"]);
    assert.equal(next.marksPool!.thryn, 3);
    assert.equal(next.marksPool!.poison, 4);
    assert.equal(next.marksPool!.antidote, 4);
  });
  for (const regenerates of [false, true]) {
    it(`сохраняет пул при переносе повторяющейся метки, регенерация=${regenerates}`, () => {
      const hunter = animal("a", 0, [trait("carnivore")]); hunter.marks = ["antidote"];
      const prey = animal("prey", 1, regenerates ? [trait("regeneration")] : []);
      prey.marks = ["antidote", "haze"];
      const next = act(scenario([hunter], [prey]), { type: "feedHunt", carnivoreId: "a", preyId: "prey" });
      assert.deepEqual(new Set(next.players[0]!.animals[0]!.marks), new Set(["antidote", "haze"]));
      assert.equal(next.marksPool!.antidote, 3);
      assert.equal(next.marksPool!.haze, 3);
      assert.equal(next.pendingRegeneration?.length ?? 0, regenerates ? 1 : 0);
    });
  }
  for (const food of [1, 2]) {
    it(`cleanser leaves only its new red token with ${food} existing food`, () => {
      const a = animal("a", 0, [trait("carnivore"), trait("highBodyWeight"), trait("fatTissue")]);
      a.food = food; a.blueFood = 1; a.fatTokens = 1; a.marks = ["poison"];
      const next = act(scenario([a], undefined, "cleanser"), take);
      const result = next.players[0]!.animals[0]!;
      assert.equal(result.food, 1);
      assert.equal(result.blueFood, 0);
      assert.equal(result.fatTokens, 1);
      assert.deepEqual(result.marks, []);
      assert.equal(next.marksPool!.poison, 4);
      assert.equal(next.flora![0]!.food, 3);
    });
  }
  it("sleep disables scavenger without preventing the next awake scavenger", () => {
    const sleepy = animal("sleepy", 0, [trait("scavenger")]); sleepy.marks = ["sleep"];
    const awake = animal("awake", 0, [trait("scavenger")]);
    const g = scenario([animal("a", 0, [trait("carnivore")]), sleepy, awake], [animal("prey", 1)]);
    const next = act(g, { type: "feedHunt", carnivoreId: "a", preyId: "prey" });
    assert.equal(next.players[0]!.animals[1]!.food, 0);
    assert.equal(next.players[0]!.animals[2]!.blueFood, 1);
  });
  for (const type of ["communication", "cooperation"] as const) {
    it(`sleep disables ${type} when taking flora food`, () => {
      const a = animal("a", 0, [trait(type, { pairWith: "b", pairRole: "a" })]); a.marks = ["sleep"];
      const g = scenario([a, animal("b", 0)]);
      const next = act(g, take);
      assert.equal(next.players[0]!.animals[0]!.food, 1);
      assert.equal(next.players[0]!.animals[1]!.food, 0);
      assert.equal(next.flora![0]!.food, 3);
    });
  }
  it("sleep disables symbiosis feeding restriction", () => {
    const a = animal("a", 0, [trait("symbiosis", { pairWith: "host", pairRole: "b" })]); a.marks = ["sleep"];
    const g = scenario([a, animal("host", 0)]);
    assert.equal(canReceiveFood(g, a), true);
    assert.equal(act(g, take).players[0]!.animals[0]!.food, 1);
  });
  it("sleep disables symbiosis protection", () => {
    const prey = animal("prey", 1, [trait("symbiosis", { pairWith: "host", pairRole: "b" })]); prey.marks = ["sleep"];
    const hunter = animal("a", 0, [trait("carnivore")]);
    assert.equal(canAttack(scenario([hunter], [prey, animal("host", 1)]), hunter, prey), true);
  });
  it("sleep disables migration", () => {
    const a = animal("a", 0, [trait("migration")]); a.marks = ["sleep"];
    assert.equal(canMigrate(scenario([a]), a), false);
  });
  it("sleep disables herding protection even with an awake herd nearby", () => {
    const prey = animal("prey", 1, [trait("herding")]); prey.marks = ["sleep"];
    const hunter = animal("a", 0, [trait("carnivore")]);
    const g = scenario([hunter], [prey, animal("herd1", 1, [trait("herding")]), animal("herd2", 1, [trait("herding")])]);
    g.modules.continents = true;
    for (const p of g.players) for (const a of p.animals) a.zoneId = "laurasia";
    assert.equal(herdingProtects(g, prey), false);
    assert.equal(canAttack(g, hunter, prey), true);
  });
  for (const type of ["poisonous", "nematocysts"] as const) {
    it(`sleep disables prey's ${type} kill hook`, () => {
      const prey = animal("prey", 1, [trait(type)]); prey.marks = ["sleep"];
      const next = act(scenario([animal("a", 0, [trait("carnivore")])], [prey]), { type: "feedHunt", carnivoreId: "a", preyId: "prey" });
      assert.equal(next.players[0]!.animals[0]!.poisoned, false);
      assert.equal(next.paralyzed?.includes("a") ?? false, false);
    });
  }
});
