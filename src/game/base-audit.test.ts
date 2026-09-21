import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalDefenseActions, legalFeedActions } from "./engine.ts";
import { canAttack, canReceiveFood } from "./queries.ts";
import type { Animal, GameState, TraitId, TraitInstance } from "./types.ts";

let seq = 0;
function trait(type: TraitId, extra: Partial<TraitInstance> = {}): TraitInstance {
  return { id: `audit-t${++seq}`, cardId: `audit-c${seq}`, type, hidden: false, playSeq: seq, ...extra };
}
function animal(id: string, ownerId = 0, types: TraitId[] = []): Animal {
  return { id, ownerId, cardId: id, traits: types.map(type => trait(type)), food: 0, blueFood: 0,
    fatTokens: 0, hibernating: false, hibernatedLastYear: false, receivedFoodThisYear: false,
    poisoned: false, seed: 1 };
}
function pair(a: Animal, b: Animal, type: TraitId) {
  const t = trait(type, { pairWith: b.id, pairRole: "a" });
  a.traits.push(t);
  b.traits.push(trait(type, { cardId: t.cardId, pairWith: a.id, pairRole: "b" }));
}
function feeding(animals: Animal[]): GameState {
  const g = createGame(2, "normal", 7);
  g.phase = "feeding";
  g.currentPlayerId = 0;
  g.foodBank = 20;
  // Keep the phase alive so automatic extinction cannot obscure assertions.
  for (const p of g.players) p.animals = [...animals.filter(a => a.ownerId === p.id), animal(`reserve-${p.id}`, p.id, ["parasite"])];
  return g;
}

describe("base audit: pair chains", () => {
  for (const kind of ["cooperation", "communication"] as const) it(`${kind} reaches third animal once per card`, () => {
    const a = animal("a", 0, ["parasite"]), b = animal("b", 0, ["parasite"]), c = animal("c", 0, ["parasite"]);
    pair(a, b, kind); pair(b, c, kind);
    const next = applyAction(feeding([a, b, c]), { type: "feedTake", animalId: a.id });
    assert.deepEqual(next.players[0]!.animals.slice(0, 3).map(x => [x.food, x.blueFood]),
      [[1, 0], [1, kind === "cooperation" ? 1 : 0], [1, kind === "cooperation" ? 1 : 0]]);
    assert.equal(next.foodBank, kind === "cooperation" ? 19 : 17);
  });
  for (const kind of ["cooperation", "communication"] as const) for (const sleeping of ["source", "partner"]) {
    it(`${kind} is inactive with sleeping ${sleeping}`, () => {
      const a = animal("a"), b = animal("b"); pair(a, b, kind);
      (sleeping === "source" ? a : b).marks = ["sleep"];
      const next = applyAction(feeding([a, b]), { type: "feedTake", animalId: a.id });
      assert.equal(next.players[0]!.animals[1]!.food, 0);
      assert.equal(next.foodBank, 19);
    });
  }
});

describe("base audit: sleep is not hibernation", () => {
  for (const sleeping of ["host", "dependent"]) {
    it(`symbiosis does not block food with sleeping ${sleeping}`, () => {
      const a = animal("a"), b = animal("b"); pair(a, b, "symbiosis");
      (sleeping === "host" ? a : b).marks = ["sleep"];
      assert.equal(canReceiveFood(feeding([a, b]), b), true);
    });
    it(`symbiosis does not protect with sleeping ${sleeping}`, () => {
      const a = animal("a"), b = animal("b"), h = animal("hunter", 1, ["carnivore"]);
      pair(a, b, "symbiosis"); (sleeping === "host" ? a : b).marks = ["sleep"];
      assert.equal(canAttack(feeding([a, b, h]), h, b), true);
    });
  }
  it("sleeping scavenger is skipped in favour of active scavenger", () => {
    const h = animal("hunter", 0, ["carnivore"]), prey = animal("prey", 1);
    const asleep = animal("asleep", 0, ["scavenger"]), awake = animal("awake", 1, ["scavenger"]);
    asleep.marks = ["sleep"];
    const next = applyAction(feeding([h, asleep, prey, awake]), { type: "feedHunt", carnivoreId: h.id, preyId: prey.id });
    assert.equal(next.players[0]!.animals.find(a => a.id === asleep.id)!.food, 0);
    assert.equal(next.players[1]!.animals.find(a => a.id === awake.id)!.blueFood, 1);
  });
  it("sleeping poisonous prey does not poison hunter, but transfers marks", () => {
    const h = animal("hunter", 0, ["carnivore"]), prey = animal("prey", 1, ["poisonous"]);
    prey.marks = ["sleep", "poison"];
    const g = feeding([h, prey]); g.modules.fungi = true;
    const next = applyAction(g, { type: "feedHunt", carnivoreId: h.id, preyId: prey.id });
    const hunter = next.players[0]!.animals[0]!;
    assert.equal(hunter.poisoned, false);
    assert.ok(hunter.marks?.includes("poison"));
  });
  it("sleep disables fat conversion without consuming stored tokens", () => {
    const a = animal("a", 0, ["fatTissue"]); a.fatTokens = 1; a.marks = ["sleep"];
    const g = feeding([a]);
    assert.equal(legalFeedActions(g, 0).some(x => x.type === "feedConvertFat"), false);
    const next = applyAction(g, { type: "feedConvertFat", animalId: a.id, amount: 1 });
    assert.equal(next.players[0]!.animals[0]!.fatTokens, 1);
    assert.equal(next.players[0]!.animals[0]!.food, 0);
  });
});

describe("base audit: mimicry recalculates ignored defense", () => {
  for (const mode of ["haze", "developmentDefects"] as const) it(`new target's ${mode} suppresses its tail`, () => {
    const h = animal("hunter", 0, ["carnivore"]), a = animal("a", 1, ["mimicry"]);
    const b = animal("b", 1, ["tailLoss", "running", ...(mode === "developmentDefects" ? [mode] : [])]);
    if (mode === "haze") b.marks = ["haze"];
    let g = applyAction(feeding([h, a, b]), { type: "feedHunt", carnivoreId: h.id, preyId: a.id });
    assert.ok(legalDefenseActions(g, 1).some(x => x.type === "chooseDefense" && x.kind === "mimicry" && x.mimicryTargetId === b.id));
    g = applyAction(g, { type: "chooseDefense", kind: "mimicry", mimicryTargetId: b.id });
    assert.equal(g.pendingAttack?.ignoredTraitId, b.traits[0]!.id);
    assert.equal(legalDefenseActions(g, 1).some(x => x.type === "chooseDefense" && x.kind === "tailLoss"), false);
    assert.ok(legalDefenseActions(g, 1).some(x => x.type === "chooseDefense" && x.kind === "running"));
  });
});

describe("base audit: communication territory bank", () => {
  for (const available of [1, 2]) it(`uses only local food (${available} tokens)`, () => {
    const a = animal("a"), b = animal("b");
    a.zoneId = b.zoneId = "laurasia";
    pair(a, b, "communication");
    const g = feeding([a, b]);
    g.modules.continents = true;
    for (const p of g.players) p.animals.find(x => x.id === `reserve-${p.id}`)!.zoneId = "gondwana";
    g.territoryFood = { laurasia: available, gondwana: 5, ocean: 0 };
    g.foodBank = available + 5;
    const next = applyAction(g, { type: "feedTake", animalId: a.id });
    assert.equal(next.players[0]!.animals.find(x => x.id === b.id)!.food, available - 1);
    assert.deepEqual(next.territoryFood, { laurasia: 0, gondwana: 5, ocean: 0 });
    assert.equal(next.foodBank, 5);
    assert.equal(g.foodBank, available + 5, "input snapshot stays unchanged");
  });
});
