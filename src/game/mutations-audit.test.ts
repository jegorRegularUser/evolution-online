import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalDefenseActions, legalDevActions, legalFeedActions } from "./engine.ts";
import { canAttack, foodNeeded, hasTrait, isFed } from "./queries.ts";
import { MUTATIONS_TRAIT_IDS, TRAITS } from "./traits.ts";
import type { Animal, GameState, ModuleId, TraitId, TraitInstance } from "./types.ts";

let seq = 0;
const card = (type: TraitId) => ({ id: `audit-c${++seq}`, faces: [type] });
function trait(type: TraitId, extra: Partial<TraitInstance> = {}): TraitInstance {
  const c = card(type);
  return { id: `audit-t${++seq}`, cardId: c.id, type, hidden: false, playSeq: seq, ...extra };
}
function animal(id: string, ownerId: number, types: TraitId[] = [], extra: Partial<Animal> = {}): Animal {
  return { id, ownerId, cardId: `body-${id}`, traits: types.map(t => trait(t)), population: 1,
    food: 0, blueFood: 0, fatTokens: 0, hibernating: false, hibernatedLastYear: false,
    receivedFoodThisYear: false, poisoned: false, seed: 1, ...extra };
}
function scenario(animals: Animal[][], decks: TraitId[][] = [], modules: Partial<Record<ModuleId, boolean>> = {}): GameState {
  const g = createGame(2, "normal", 7, undefined, { randomMutations: true, ...modules });
  g.currentPlayerId = g.firstPlayerId = 0;
  g.players.forEach((p, i) => {
    p.animals = animals[i] ?? [];
    p.blindDeck = (decks[i] ?? []).map(card);
    p.passedDev = false;
  });
  return g;
}
function extinction(g: GameState): GameState {
  g.phase = "feeding";
  g.players.forEach(p => { p.passedFeed = true; });
  return applyAction(g, { type: "feedSkip" });
}

describe("mutations audit: population", () => {
  // Characterization only: aggregate legacy behavior is NOT official per-individual feeding.
  // No floor(food / need) allocation policy is introduced; see the audit's model/UI gap.
  for (const [food, survivors] of [[0, 0], [2, 0], [3, 0], [5, 0], [6, 0], [8, 2], [9, 3]]) {
    it(`legacy aggregate metabolicSyndrome: food=${food}, survive=${survivors}`, () => {
      const a = animal("a", 0, ["metabolicSyndrome"], { population: 3, food, blueFood: food });
      let g = extinction(scenario([[a], []]));
      assert.equal(g.extinctionDeaths.includes("a"), survivors === 0);
      if (survivors) {
        const live = g.players[0]!.animals[0]!;
        assert.equal(live.population, survivors);
        assert.ok(isFed(live));
        assert.ok(live.blueFood <= live.food);
      }
      g = applyAction(g, { type: "continueExtinction" });
      assert.equal(g.players[0]!.animals.find(a => a.id === "a")?.population ?? 0, survivors);
    });
  }  it("hibernation preserves all hungry individuals", () => {
    const a = animal("a", 0, ["hibernation", "metabolicSyndrome"], { population: 3, hibernating: true });
    const g = extinction(scenario([[a], []]));
    assert.deepEqual(g.extinctionDeaths, []);
    assert.equal(g.players[0]!.animals[0]!.population, 3);
  });
  it("poison loss keeps food colours bounded", () => {
    const a = animal("a", 0, [], { population: 3, food: 3, blueFood: 3, poisoned: true });
    const g = extinction(scenario([[a], []]));
    const live = g.players[0]!.animals[0]!;
    assert.equal(live.population, 2);
    assert.ok(live.blueFood <= live.food);
    assert.deepEqual(g.extinctionDeaths, []);
  });
});

describe("mutations audit: budding and extremophile", () => {
  for (const remaining of [1, 2]) {
    it(`legacy budding + extremophile with ${remaining} cards keeps its one-card cost (rules gap)`, () => {
      let g = scenario([[animal("a", 0, ["budding", "extremophile"])], []],
        [Array.from({ length: remaining + 1 }, () => "camouflage" as const), []]);
      g = applyAction(g, { type: "devMutate", intent: "newAnimal" });
      assert.equal(g.players[0]!.animals[0]!.population, 2);
      assert.equal(g.players[0]!.blindDeck!.length, remaining - 1);
      assert.equal(g.players[0]!.discardCount, 0);
    });
  }
  it("budding triggers once per year, not once per development turn", () => {
    let g = scenario([[animal("a", 0, ["budding"])], []], [Array(8).fill("camouflage")]);
    g = applyAction(g, { type: "devMutate", intent: "newAnimal" });
    assert.equal(g.players[0]!.animals[0]!.population, 2);
    g = applyAction(g, { type: "devMutate", intent: "newAnimal" });
    assert.equal(g.players[0]!.animals[0]!.population, 2);
    g.year += 1;
    g = applyAction(g, { type: "devMutate", intent: "newAnimal" });
    assert.equal(g.players[0]!.animals[0]!.population, 3);
  });
  it("ordinary growth is unavailable with one card for extremophile", () => {
    const g = scenario([[animal("a", 0, ["extremophile"]), animal("b", 0)], []], [["camouflage"]]);
    assert.ok(!legalDevActions(g, 0).some(a => a.type === "devMutate" && a.intent === "population" && a.animalId === "a"));
  });
});

describe("mutations audit: obligateCarnivore", () => {
  it("successful hunt has only blue food, even with a large species need", () => {
    const h = animal("h", 0, ["obligateCarnivore", "metabolicSyndrome"], { population: 3 });
    let g = scenario([[h, animal("spare", 0)], [animal("prey", 1), animal("spare2", 1)]]);
    g.phase = "feeding"; g.foodBank = 10;
    assert.ok(!legalFeedActions(g, 0).some(a => a.type === "feedTake" && a.animalId === "h"));
    g = applyAction(g, { type: "feedHunt", carnivoreId: "h", preyId: "prey" });
    const fed = g.players[0]!.animals.find(a => a.id === "h")!;
    assert.equal(fed.food, 1);
    assert.equal(fed.blueFood, 1);
    assert.ok(isFed(fed));
    assert.ok(!legalFeedActions(g, 0).some(a => a.type === "feedHunt" && a.carnivoreId === "h"));
  });
  it("one blue token preserves a fed obligate species through extinction", () => {
    const a = animal("h", 0, ["obligateCarnivore"], { population: 3, food: 1, blueFood: 1 });
    const g = extinction(scenario([[a], []]));
    assert.deepEqual(g.extinctionDeaths, []);
    assert.equal(g.players[0]!.animals[0]!.population, 3);
  });
  for (const population of [1, 3]) {
    it(`poisonous prey kills one hunter immediately, population=${population}`, () => {
      let g = scenario([[animal("h", 0, ["carnivore"], { population }), animal("spare", 0)],
        [animal("p", 1, ["poisonous"]), animal("other", 1)]]);
      g.phase = "feeding"; g.foodBank = 10;
      g = applyAction(g, { type: "feedHunt", carnivoreId: "h", preyId: "p" });
      assert.equal(g.phase, "feeding");
      const h = g.players[0]!.animals.find(a => a.id === "h");
      assert.equal(h?.population ?? 0, population - 1);
      if (h) assert.equal(h.poisoned, false);
    });
  }
  it("tail loss does not feed the obligate hunter", () => {
    let g = scenario([[animal("h", 0, ["obligateCarnivore"])], [animal("p", 1, ["tailLoss"])]]);
    g.phase = "feeding"; g.foodBank = 10;
    g = applyAction(g, { type: "feedHunt", carnivoreId: "h", preyId: "p" });
    const defense = legalDefenseActions(g, 1).find(a => a.type === "chooseDefense" && a.kind === "tailLoss")!;
    assert.ok(defense);
    g = applyAction(g, defense);
    assert.equal(g.players[0]!.animals[0]!.food, 0);
    assert.equal(g.players[1]!.animals.length, 1);
  });
});

describe("mutations audit: developmentDefects", () => {
  for (const defense of ["camouflage", "highBodyWeight", "swimming", "tailLoss", "running", "mimicry"] as const) {
    it(`ignores exactly one ${defense} defense`, () => {
      const h = animal("h", 0, ["carnivore"]);
      const p = animal("p", 1, ["developmentDefects", defense]);
      let g = scenario([[h, animal("spare", 0)], [p, animal("other", 1)]]);
      g.phase = "feeding"; g.foodBank = 10;
      assert.equal(canAttack(g, h, p), true);
      g = applyAction(g, { type: "feedHunt", carnivoreId: "h", preyId: "p" });
      assert.equal(g.players[1]!.animals.some(a => a.id === "p"), false);
    });
  }
  it("cannot ignore two independent passive protections", () => {
    const h = animal("h", 0, ["carnivore"]);
    const p = animal("p", 1, ["developmentDefects", "camouflage", "highBodyWeight"]);
    assert.equal(canAttack(scenario([[h], [p]]), h, p), false);
  });
  it("ignores herding but not the territory boundary", () => {
    const h = animal("h", 0, ["carnivore"], { zoneId: "laurasia" });
    const p = animal("p", 1, ["developmentDefects", "herding"], { zoneId: "laurasia", population: 2 });
    const g = scenario([[h], [p]], [], { continents: true });
    assert.equal(canAttack(g, h, p), true);
    p.zoneId = "gondwana";
    assert.equal(canAttack(g, h, p), false);
  });
});

describe("mutations audit: simplification", () => {
  it("settles the separated swimming mutant into the ocean", () => {
    let g = scenario([[animal("a", 0, ["camouflage", "swimming"], { zoneId: "ocean" })], []], [["simplification"]], { continents: true });
    g = applyAction(g, { type: "devMutate", intent: "trait", animalId: "a" });
    const mutant = g.players[0]!.animals.find(a => a.id !== "a" && hasTrait(a, "swimming"))!;
    assert.ok(mutant);
    assert.equal(mutant.zoneId, "ocean");
    assert.equal(mutant.population, 1);
    assert.equal(g.players[0]!.animals.find(a => a.id === "a")!.zoneId, "ocean");
    assert.equal(g.players[0]!.animals.length, 3);
  });
});

describe("mutations audit: compatibility characterization (not new rules)", () => {
  for (const pair of ["cooperation", "communication", "symbiosis"] as const) {
    it(`legacy ${pair} mutation becomes a bare species, not a dangling pair`, () => {
      let g = scenario([[animal("a", 0)], []], [[pair]]);
      g = applyAction(g, { type: "devMutate", intent: "trait", animalId: "a" });
      assert.equal(g.players[0]!.animals.length, 2);
      assert.ok(g.players[0]!.animals.every(a => a.traits.length === 0));
    });
  }
  it("legacy micorrhiza mutation creates a species without an unpaired plant trait", () => {
    let g = scenario([[], []], [["micorrhiza"]], { plants: true });
    const plantId = g.plants![0]!.id;
    g = applyAction(g, { type: "devMutate", intent: "plant", plantId });
    assert.equal(g.players[0]!.animals.length, 1);
    assert.deepEqual(g.players[0]!.animals[0]!.traits, []);
    assert.ok(!g.plants!.some(p => p.traits.some(t => t.type === "micorrhiza")));
  });
  for (const mutation of ["metabolicSyndrome", "barkBeetle", "extremophile", "developmentDefects"] as const) {
    it(`applicable harmful ${mutation} attaches to the declared single-individual species`, () => {
      let g = scenario([[animal("a", 0)], []], [[mutation]]);
      g = applyAction(g, { type: "devMutate", intent: "trait", animalId: "a" });
      assert.equal(g.players[0]!.animals.length, 1);
      assert.ok(hasTrait(g.players[0]!.animals[0]!, mutation));
    });
  }
});

describe("mutations audit: all seven properties and barkBeetle", () => {
  it("registry contains exactly seven properties", () => {
    assert.equal(MUTATIONS_TRAIT_IDS.size, 7);
    assert.equal(foodNeeded(animal("a", 0, ["metabolicSyndrome"])), 3);
    assert.equal(TRAITS.metabolicSyndrome.scoreBonus, 2);
  });
  for (const fed of [false, true]) {
    it(`barkBeetle ${fed ? "fed takes shelter" : "hungry takes blue food without spending shelter"}`, () => {
      let g = scenario([[animal("a", 0, ["barkBeetle"], { food: fed ? 1 : 0 }), animal("spare", 0)], []], [], { plants: true });
      g.phase = "feeding";
      const pl = g.plants![0]!; pl.shelters = 2;
      g = applyAction(g, { type: "feedShelter", animalId: "a", plantId: pl.id });
      const a = g.players[0]!.animals[0]!;
      assert.equal(Boolean(a.sheltered), fed);
      assert.equal(a.food, 1);
      assert.equal(a.blueFood, fed ? 0 : 1);
      assert.equal(g.plants!.find(p => p.id === pl.id)!.shelters, fed ? 1 : 2);
    });
  }
});
