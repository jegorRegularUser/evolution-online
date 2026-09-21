import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalDevActions, legalFeedActions } from "./engine.ts";
import { canAttack, canMigrate, foodNeeded, hasTrait, herdingBalance, findAnimal } from "./queries.ts";
import type { Animal, GameState, TraitId, TraitInstance } from "./types.ts";
import { chooseAIAction } from "./ai.ts";
import { buildDeck } from "./deck.ts";
import { CONTINENTS_TRAIT_IDS } from "./traits.ts";

let seq = 0;
function trait(type: TraitId): TraitInstance {
  const n = ++seq;
  return { id: `t${n}`, cardId: `c${n}`, type, hidden: false, playSeq: n };
}
function animal(id: string, ownerId: number, types: TraitId[]): Animal {
  return { id, ownerId, cardId: `body-${id}`, traits: types.map(trait), zoneId: "laurasia",
    food: 0, blueFood: 0, fatTokens: 0, hibernating: false, hibernatedLastYear: false,
    receivedFoodThisYear: false, poisoned: false, seed: 1 };
}
function scenario(animals: Animal[]): GameState {
  const g = createGame(2, "normal", 7, undefined, { continents: true });
  for (const p of g.players) {
    p.animals = animals.filter(a => a.ownerId === p.id);
    p.hand = [];
  }
  g.currentPlayerId = g.firstPlayerId = 0;
  g.phase = "feeding";
  g.foodBank = 30;
  g.territoryFood = { laurasia: 10, gondwana: 10, ocean: 10 };
  return g;
}
function roll(g: GameState): GameState {
  return applyAction({ ...g, phase: "foodBank", foodRoll: null }, { type: "rollFoodBank" });
}

describe("integration: AI piracy liveness", () => {
  for (const difficulty of ["easy", "normal", "hard"] as const) {
    it(`passes instead of cycling food between own hungry species (${difficulty})`, () => {
      const pirates = [animal("p1", 0, ["piracy"]), animal("p2", 0, ["piracy"])];
      for (const pirate of pirates) { pirate.population = 3; pirate.food = pirate.blueFood = 1; }
      const g = scenario(pirates);
      g.modules.randomMutations = true;
      g.difficulty = difficulty;
      g.foodBank = 0;
      g.territoryFood = { laurasia: 0, gondwana: 0, ocean: 0 };
      assert.ok(legalFeedActions(g, 0).some(a => a.type === "feedPirate"), "rules still permit own piracy");
      assert.equal(chooseAIAction(g)?.type, "feedSkip");
    });
  }
});

describe("continents audit: nematocysts (PDF p.2)", () => {
  it("successful attack suppresses need, defense and all active traits without deleting cards", () => {
    let g = scenario([animal("hunter", 0, ["carnivore", "highBodyWeight", "camouflage", "piracy", "hibernation", "grazing"]),
      animal("sting", 1, ["nematocysts"]), animal("other", 1, ["carnivore"])]);
    g = applyAction(g, { type: "feedHunt", carnivoreId: "hunter", preyId: "sting" });
    const hunter = findAnimal(g, "hunter")!;
    assert.ok(g.paralyzed?.includes(hunter.id));
    assert.equal(foodNeeded(hunter), 1);
    assert.equal(hunter.traits.length, 6);
    for (const t of hunter.traits) assert.equal(hasTrait(hunter, t.type), false, t.type);
    assert.equal(canAttack(g, findAnimal(g, "other")!, hunter), true);
    hunter.food = hunter.blueFood = 0;
    g.currentPlayerId = 0;
    const actions = legalFeedActions(g, 0);
    assert.ok(!actions.some(a => ["feedHibernate", "feedGraze", "feedPirate"].includes(a.type)));
  });

  it("one token keeps the paralyzed hunter alive and properties recover after feeding", () => {
    let g = scenario([animal("hunter", 0, ["carnivore", "parasite"]),
      animal("sting", 1, ["nematocysts"]), animal("other", 1, [])]);
    g = applyAction(g, { type: "feedHunt", carnivoreId: "hunter", preyId: "sting" });
    assert.equal(findAnimal(g, "hunter")!.food, 1);
    for (let i = 0; i < 8 && g.phase === "feeding"; i++) g = applyAction(g, { type: "feedSkip" });
    assert.equal(g.phase, "extinction");
    assert.ok(!g.extinctionDeaths.includes("hunter"));
    assert.deepEqual(g.paralyzed, []);
    assert.equal(hasTrait(findAnimal(g, "hunter")!, "carnivore"), true);
    g = applyAction(g, { type: "continueExtinction" });
    assert.equal(foodNeeded(findAnimal(g, "hunter")!), 4);
  });

  it("tail-loss escape also paralyzes the attacker", () => {
    let g = scenario([animal("hunter", 0, ["carnivore", "parasite"]),
      animal("sting", 1, ["nematocysts", "tailLoss"]), animal("other", 1, [])]);
    g = applyAction(g, { type: "feedHunt", carnivoreId: "hunter", preyId: "sting" });
    assert.ok(g.pendingAttack);
    const tail = findAnimal(g, "sting")!.traits.find(t => t.type === "tailLoss")!;
    g = applyAction(g, { type: "chooseDefense", kind: "tailLoss", discardTraitId: tail.id });
    assert.ok(findAnimal(g, "sting"), "prey survives");
    assert.ok(g.paralyzed?.includes("hunter"));
    assert.equal(foodNeeded(findAnimal(g, "hunter")!), 1);
  });

  it("suppressed nematocysts do not paralyze the attacker", () => {
    const prey = animal("sting", 1, ["nematocysts"]);
    prey.sedated = true;
    const g = applyAction(scenario([animal("hunter", 0, ["carnivore"]), prey, animal("other", 1, [])]),
      { type: "feedHunt", carnivoreId: "hunter", preyId: "sting" });
    assert.ok(!g.paralyzed?.includes("hunter"));
  });

  it("paralyzed symbiosis neither blocks feeding nor protects its recipient", () => {
    const hunter = animal("hunter", 0, ["carnivore"]);
    const host = animal("host", 0, []);
    const pair = trait("symbiosis");
    hunter.traits.push({ ...pair, pairRole: "b", pairWith: host.id });
    host.traits.push({ ...pair, id: `${pair.id}-a`, pairRole: "a", pairWith: hunter.id });
    let g = applyAction(scenario([hunter, host, animal("sting", 1, ["nematocysts"]), animal("enemy", 1, ["carnivore"])]),
      { type: "feedHunt", carnivoreId: "hunter", preyId: "sting" });
    assert.equal(findAnimal(g, "hunter")!.food, 1);
    assert.equal(canAttack(g, findAnimal(g, "enemy")!, findAnimal(g, "hunter")!), true);
  });

  it("paralyzed fat tissue cannot convert stored fat", () => {
    const hunter = animal("hunter", 0, ["carnivore", "fatTissue"]);
    hunter.fatTokens = 1;
    let g = applyAction(scenario([hunter, animal("sting", 1, ["nematocysts"]), animal("other", 1, [])]),
      { type: "feedHunt", carnivoreId: "hunter", preyId: "sting" });
    findAnimal(g, "hunter")!.food = 0;
    g.currentPlayerId = 0;
    assert.ok(g.paralyzed?.includes("hunter"));
    assert.ok(!legalFeedActions(g, 0).some(a => a.type === "feedConvertFat"));
  });

  it("ocean paralysis expels swimmer and discards cross-territory pairs", () => {
    const hunter = animal("hunter", 0, ["carnivore", "swimming"]);
    const partner = animal("partner", 0, ["swimming"]);
    const sting = animal("sting", 1, ["swimming", "nematocysts"]);
    for (const a of [hunter, partner, sting]) a.zoneId = "ocean";
    const pair = trait("cooperation");
    hunter.traits.push({ ...pair, pairWith: partner.id, pairRole: "a" });
    partner.traits.push({ ...pair, id: "pair-b", pairWith: hunter.id, pairRole: "b" });
    const g = applyAction(scenario([hunter, partner, sting, animal("other", 1, [])]),
      { type: "feedHunt", carnivoreId: "hunter", preyId: "sting" });
    const after = findAnimal(g, "hunter")!;
    assert.notEqual(after.zoneId, "ocean");
    assert.equal(hasTrait(after, "swimming"), false);
    assert.ok(!after.traits.some(t => t.pairWith));
    assert.ok(!findAnimal(g, "partner")!.traits.some(t => t.pairWith));
  });
});

function recombinationScenario(aTypes: TraitId[], bTypes: TraitId[]): GameState {
  const a = animal("a", 0, aTypes);
  const b = animal("b", 0, bTypes);
  const pair = trait("recombination");
  a.traits.push({ ...pair, pairWith: b.id, pairRole: "a" });
  b.traits.push({ ...pair, id: `${pair.id}-b`, pairWith: a.id, pairRole: "b" });
  return scenario([a, b, animal("enemy", 1, ["parasite"])]);
}

function exchanges(g: GameState) {
  return legalFeedActions(g, 0).filter(a => a.type === "feedRecombine");
}

describe("continents audit: recombination (rules p.2, property card p.1)", () => {
  it("exchanges both nonpairwise properties atomically and only once per year", () => {
    const g = recombinationScenario(["parasite"], ["herding"]);
    const acts = exchanges(g);
    assert.equal(acts.length, 1);
    const next = applyAction(g, acts[0]!);
    assert.equal(hasTrait(findAnimal(next, "a")!, "herding"), true);
    assert.equal(hasTrait(findAnimal(next, "a")!, "parasite"), false);
    assert.equal(hasTrait(findAnimal(next, "b")!, "parasite"), true);
    assert.equal(exchanges(next).length, 0);
    assert.deepEqual(applyAction(next, acts[0]!).players, next.players, "replay changes nothing");
    next.year++;
    assert.equal(exchanges(next).length, 1);
  });

  it("discards incoming duplicates but permits multiple fat tissues", () => {
    for (const type of ["herding", "fatTissue"] as const) {
      const g = recombinationScenario(["parasite", type], [type]);
      const selected = exchanges(g).find(a => a.traitId === findAnimal(g, "a")!.traits[0]!.id);
      assert.ok(selected);
      const next = applyAction(g, selected);
      assert.equal(findAnimal(next, "a")!.traits.filter(t => t.type === type).length, type === "fatTissue" ? 2 : 1);
      assert.equal(next.players[0]!.discardCount - g.players[0]!.discardCount, type === "fatTissue" ? 0 : 1);
    }
  });

  it("moves used piracy with the card so the recipient cannot reuse it", () => {
    let g = recombinationScenario(["piracy", "parasite"], ["herding", "parasite"]);
    findAnimal(g, "enemy")!.food = 1;
    g = applyAction(g, { type: "feedPirate", pirateId: "a", targetId: "enemy" });
    const act = exchanges(g).find(a => a.traitId === findAnimal(g, "a")!.traits.find(t => t.type === "piracy")!.id);
    assert.ok(act);
    g = applyAction(g, act);
    assert.equal(hasTrait(findAnimal(g, "b")!, "piracy"), true);
    findAnimal(g, "enemy")!.food = 1;
    assert.ok(!legalFeedActions(g, 0).some(a => a.type === "feedPirate" && a.pirateId === "b"));
  });

  it("offers both continents when exchanging away swimming and removes split pairs", () => {
    const g = recombinationScenario(["swimming"], ["herding", "swimming"]);
    findAnimal(g, "a")!.zoneId = findAnimal(g, "b")!.zoneId = "ocean";
    const acts = exchanges(g).filter(a => a.otherTraitId === findAnimal(g, "b")!.traits[0]!.id);
    assert.deepEqual(acts.map(a => a.to).sort(), ["gondwana", "laurasia"]);
    const next = applyAction(g, acts.find(a => a.to === "gondwana")!);
    assert.equal(findAnimal(next, "a")!.zoneId, "gondwana");
    assert.equal(hasTrait(findAnimal(next, "a")!, "swimming"), false);
    assert.ok(!findAnimal(next, "a")!.traits.some(t => t.pairWith));
    assert.ok(!findAnimal(next, "b")!.traits.some(t => t.pairWith));
  });

  it("unused hibernation stays available after an exchange in year one", () => {
    const g = recombinationScenario(["hibernation"], ["herding"]);
    g.year = 1;
    const next = applyAction(g, exchanges(g)[0]!);
    assert.ok(legalFeedActions(next, 0).some(a => a.type === "feedHibernate" && a.animalId === "b"));
  });

  it("transferred hibernation cannot be reused later in the same year", () => {
    let g = recombinationScenario(["hibernation"], ["herding"]);
    g = applyAction(g, { type: "feedHibernate", animalId: "a" });
    const exchange = exchanges(g)[0];
    assert.ok(exchange);
    g = applyAction(g, exchange);
    g = applyAction(g, { type: "feedEndTurn" });
    if (g.currentPlayerId !== 0) g = applyAction(g, { type: "feedEndTurn" });
    assert.equal(g.currentPlayerId, 0);
    assert.ok(!legalFeedActions(g, 0).some(a => a.type === "feedHibernate" && a.animalId === "b"));
    assert.equal(findAnimal(applyAction(g, { type: "feedHibernate", animalId: "b" }), "b")!.hibernating, false);
  });

  it("rejects invalid exchanges before changing cards or pair usage", () => {
    const g = recombinationScenario(["parasite"], ["herding"]);
    const valid = exchanges(g)[0]!;
    for (const invalid of [{ ...valid, otherTraitId: valid.traitId }, { ...valid, takerId: "enemy" },
      { ...valid, to: "gondwana" as const }]) {
      const next = applyAction(g, invalid);
      assert.deepEqual(next.players, g.players);
      assert.equal(exchanges(next).length, 1);
    }
    assert.equal(exchanges({ ...g, currentPlayerId: 1 }).length, 0);
    assert.equal(exchanges({ ...g, phase: "development" }).length, 0);
  });

  it("places transferred neoplasia under the recipient's properties", () => {
    const g = recombinationScenario(["neoplasia", "herding"], ["piracy", "fatTissue"]);
    const act = exchanges(g).find(a => a.traitId === findAnimal(g, "a")!.traits[0]!.id);
    assert.ok(act);
    const next = applyAction(g, act);
    assert.equal(findAnimal(next, "b")!.traits[0]!.type, "neoplasia");
    assert.equal(findAnimal(next, "a")!.neoplasia, undefined);
    assert.equal(findAnimal(next, "b")!.neoplasia?.type, "neoplasia");
  });

  it("offers no exchange without two active, local partners and two nonpairwise cards", () => {
    assert.equal(exchanges(recombinationScenario([], ["herding"])).length, 0);
    const g = recombinationScenario(["parasite"], ["herding"]);
    assert.ok(exchanges(g).length);
    findAnimal(g, "b")!.zoneId = "gondwana";
    assert.equal(exchanges(g).length, 0);
    findAnimal(g, "b")!.zoneId = "laurasia";
    findAnimal(g, "b")!.sedated = true;
    assert.equal(exchanges(g).length, 0);
  });

  it("AI avoids an exchange that makes its only fed partner starve", () => {
    const g = recombinationScenario(["parasite"], ["herding"]);
    findAnimal(g, "b")!.food = 1;
    g.foodBank = 0;
    g.territoryFood = { laurasia: 0, gondwana: 0, ocean: 0 };
    g.difficulty = "hard";
    assert.notEqual(chooseAIAction(g)?.type, "feedRecombine");
  });

  it("AI uses the exchange once, then the pair stays quiet for the rest of the year", () => {
    const g = recombinationScenario(["parasite"], ["herding"]);
    // A can survive with one token after giving parasite to its well-fed partner.
    findAnimal(g, "a")!.food = 1;
    findAnimal(g, "b")!.food = 3;
    g.foodBank = 0;
    g.territoryFood = { laurasia: 0, gondwana: 0, ocean: 0 };
    g.difficulty = "hard";
    const picks = new Set<string>();
    let cur = g;
    for (let i = 0; i < 12; i++) {
      const act = chooseAIAction(cur);
      if (!act || act.type === "feedSkip" || act.type === "feedEndTurn") break;
      if (act.type === "feedRecombine") picks.add(`${act.traitId}->${act.otherTraitId}`);
      cur = applyAction(cur, act);
    }
    assert.equal(picks.size, 1);
    assert.equal(exchanges(cur).length, 0);
  });
});

describe("continents audit: neoplasia (PDF p.2)", () => {
  it("is playable only on opponents, including direct engine calls", () => {
    const g = scenario([animal("own", 0, []), animal("enemy", 1, [])]);
    g.phase = "development";
    g.players[0]!.hand = [{ id: "neo", faces: ["neoplasia"] }];
    const targets = legalDevActions(g, 0).filter(a => a.type === "devPlayTrait");
    assert.deepEqual(targets.map(a => a.animalId), ["enemy"]);
    const after = applyAction(g, { type: "devPlayTrait", cardId: "neo", face: 0, animalId: "own" });
    assert.equal(findAnimal(after, "own")!.traits.length, 0);
    assert.equal(after.players[0]!.hand.length, 1);
  });

  it("disables bottommost unpaired first, then dies immediately on disabling the last", () => {
    let g = scenario([animal("infected", 1, ["neoplasia", "fatTissue", "herding"])]);
    g = roll(g);
    const infected = findAnimal(g, "infected")!;
    assert.ok(infected.traits.find(t => t.type === "fatTissue")!.disabled);
    assert.equal(hasTrait(infected, "herding"), true);
    g = roll(g);
    assert.equal(findAnimal(g, "infected"), undefined);
    assert.ok(g.lastEvents.some(e => e.kind === "animalDied" && e.cause === "neoplasia"));
  });

  it("one property above neoplasia means death at the very first resource phase", () => {
    const g = roll(scenario([animal("infected", 1, ["neoplasia", "swimming"])]));
    assert.equal(findAnimal(g, "infected"), undefined);
  });
});

describe("continents audit: migration, herding, edificator", () => {
  it("mutation decks include only herding and edificator from Continents", () => {
    const deck = buildDeck(prefix => `${prefix}${++seq}`, { continents: true, randomMutations: true });
    const ids = [...new Set(deck.flatMap(c => c.faces).filter(t => CONTINENTS_TRAIT_IDS.has(t)))].sort();
    assert.deepEqual(ids, ["edificator", "herding"]);
  });
  it("cannot migrate an opponent through a direct action", () => {
    const g = scenario([animal("enemy", 1, ["migration", "swimming"])]);
    const next = applyAction(g, { type: "feedMigrate", moves: [{ animalId: "enemy", to: "ocean" }] });
    assert.equal(findAnimal(next, "enemy")!.zoneId, "laurasia");
  });
  it("remoras choose to follow their own or another player's migrant, in owner order", () => {
    const migrant = animal("migrant", 0, ["migration", "swimming"]);
    const mine = animal("mine", 0, ["remora", "swimming"]);
    const foreign = animal("foreign", 1, ["remora", "swimming"]);
    const dry = animal("dry", 1, ["remora"]);
    let g = applyAction(scenario([migrant, mine, foreign, dry]),
      { type: "feedMigrate", moves: [{ animalId: "migrant", to: "ocean" }] });
    assert.equal(findAnimal(g, "mine")!.zoneId, "laurasia", "following is optional");
    let acts = legalFeedActions(g, 0);
    assert.ok(acts.some(a => a.type === "feedRemora"));
    assert.ok(!acts.some(a => a.type === "feedTake"));
    g = applyAction(g, acts.find(a => a.type === "feedFinishMigration")!);
    assert.equal(g.currentPlayerId, 1);
    acts = legalFeedActions(g, 1);
    const follows = acts.filter(a => a.type === "feedRemora");
    assert.deepEqual(follows.map(a => a.animalId), ["foreign"]);
    g = applyAction(g, follows[0]!);
    assert.equal(findAnimal(g, "foreign")!.zoneId, "ocean");
    assert.equal(findAnimal(g, "mine")!.zoneId, "laurasia");
    assert.equal(findAnimal(g, "dry")!.zoneId, "laurasia");
    assert.equal(g.pendingMigration, undefined);
  });

  it("splitting a pair does not undo the swimmer's migration to land", () => {
    const migrant = animal("migrant", 0, ["migration", "swimming"]);
    const partner = animal("partner", 0, ["swimming"]);
    migrant.zoneId = partner.zoneId = "ocean";
    const link = trait("cooperation");
    migrant.traits.push({ ...link, pairWith: partner.id });
    partner.traits.push({ ...link, id: "other-half", pairWith: migrant.id });
    const g = applyAction(scenario([migrant, partner, animal("enemy", 1, [])]),
      { type: "feedMigrate", moves: [{ animalId: migrant.id, to: "gondwana" }] });
    assert.equal(findAnimal(g, migrant.id)!.zoneId, "gondwana");
    assert.ok(!findAnimal(g, migrant.id)!.traits.some(t => t.pairWith));
    assert.ok(!findAnimal(g, partner.id)!.traits.some(t => t.pairWith));
  });

  it("sleeping and sedated migrants cannot use migration", () => {
    const a = animal("migrant", 0, ["migration", "swimming"]);
    const g = scenario([a]);
    a.marks = ["sleep"];
    assert.equal(canMigrate(g, a), false);
    a.marks = [];
    a.sedated = true;
    assert.equal(canMigrate(g, a), false);
  });
  it("migration cannot follow food, even through direct engine calls", () => {
    const g = scenario([animal("migrant", 0, ["migration", "swimming"])]);
    g.turnUse.foodTaken = true;
    assert.ok(!legalFeedActions(g, 0).some(a => a.type === "feedMigrate"));
    const after = applyAction(g, { type: "feedMigrate", moves: [{ animalId: "migrant", to: "ocean" }] });
    assert.equal(findAnimal(after, "migrant")!.zoneId, "laurasia");
  });
  it("herding counts both owners but only the local active herd", () => {
    const a = animal("herd", 0, ["herding"]);
    const b = animal("ally", 1, ["herding"]);
    const hunter = animal("hunter", 1, ["carnivore"]);
    const g = scenario([a, b, hunter]);
    assert.deepEqual(herdingBalance(g, "laurasia"), { herding: 2, carnivores: 1 });
    assert.equal(canAttack(g, hunter, a), false);
    b.zoneId = "gondwana";
    assert.equal(canAttack(g, hunter, a), false, "C-card p.1: equality protects (1:1)");
    b.zoneId = "laurasia";
    a.marks = ["sleep"];
    assert.equal(canAttack(g, hunter, a), true);
  });
  for (const [herds, hunters, protectedByHerd] of [[1, 1, true], [2, 2, true], [1, 2, false]] as const) {
    it(`herding C-card p.1: ${herds}:${hunters} protection=${protectedByHerd}`, () => {
      const herd = Array.from({ length: herds }, (_, i) => animal(`herd-${i}`, 0, ["herding"]));
      const predators = Array.from({ length: hunters }, (_, i) => animal(`hunter-${i}`, 1, ["carnivore"]));
      const g = scenario([...herd, ...predators]);
      assert.deepEqual(herdingBalance(g, "laurasia"), { herding: herds, carnivores: hunters });
      assert.equal(canAttack(g, predators[0]!, herd[0]!), !protectedByHerd);
    });
  }
  it("edificators add two per active carrier in their territory", () => {
    const animals = [animal("e1", 0, ["edificator"]), animal("e2", 1, ["edificator"]), animal("sleep", 1, ["edificator"])];
    animals[1]!.zoneId = "ocean";
    animals[2]!.marks = ["sleep"];
    const base = roll(scenario([]));
    const g = roll(scenario(animals));
    assert.equal(g.territoryFood!.laurasia, base.territoryFood!.laurasia! + 2);
    assert.equal(g.territoryFood!.ocean, base.territoryFood!.ocean! + 2);
    assert.equal(g.territoryFood!.gondwana, base.territoryFood!.gondwana);
  });
});
