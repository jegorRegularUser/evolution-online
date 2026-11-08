import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyAction, createGame, legalFeedActions, legalDefenseActions, legalDevActions } from "./engine.ts";
import { PLANTS, growthTarget, plantDeckKinds, shelterCapacity } from "./plants.ts";
import { canFeedOnPlant, canPlantAttackTarget, isFed, hasTrait, canAttack } from "./queries.ts";
import type { Animal, GameState, Plant, PlantKind, TraitId, TraitInstance } from "./types.ts";

// Primary source: https://hobbygames.ru/download/rules/evo-plant_rus.pdf
let seq = 0;
function t(type: TraitId, extra: Partial<TraitInstance> = {}): TraitInstance {
  const id = `audit-t${++seq}`;
  return { id, cardId: id, type, hidden: false, playSeq: seq, ...extra };
}
function animal(id: string, ownerId = 0, traits: TraitInstance[] = []): Animal {
  return { id, cardId: id, ownerId, traits, food: 0, blueFood: 0, fatTokens: 0, hibernating: false, poisoned: false, hibernatedLastYear: false, receivedFoodThisYear: false, seed: 1 };
}
function plant(kind: PlantKind = "perennial", food = 3, traits: TraitInstance[] = [], id = "plant"): Plant {
  return { id, kind, food, traits, shelters: 0, playSeq: 1 };
}
function scenario(plants: Plant[], animals = [animal("a"), animal("b", 1)]): GameState {
  const g = createGame(2, "normal", 7, undefined, { plants: true });
  for (const p of g.players) {
    p.hand = [];
    p.animals = animals.filter((a) => a.ownerId === p.id);
    p.passedFeed = false;
  }
  g.plants = plants;
  g.plantDeck = [];
  g.phase = "feeding";
  g.currentPlayerId = 0;
  g.turnUse = { carnivores: [], pirates: [], grazers: [], foodTaken: false, combatUsed: false, migrated: false, sheltered: false, hibernated: [] };
  return g;
}
function take(g: GameState, animalId = "a", plantId = "plant") {
  return applyAction(g, { type: "feedTakePlant", animalId, plantId });
}
function grow(g: GameState): GameState {
  g.phase = "extinction";
  g.extinctionDeaths = [];
  return applyAction(g, { type: "continueExtinction" });
}
function link(a: Animal | Plant, b: Animal | Plant, type: "communication" | "micorrhiza") {
  const card = t(type);
  a.traits.push({ ...card, pairWith: b.id, pairRole: "a" });
  b.traits.push({ ...card, id: `${card.id}-b`, pairWith: a.id, pairRole: "b" });
}

describe("plants audit: kinds and growth", () => {
  it("nine deck kinds have four copies; parasite is a trait card, not in plant deck", () => {
    const deck = plantDeckKinds();
    assert.equal(deck.length, 36);
    for (const kind of Object.keys(PLANTS) as PlantKind[]) {
      assert.equal(deck.filter((k) => k === kind).length, kind === "parasite" ? 0 : 4, kind);
    }
  });
  for (const [kind, start, max, curve] of [
    ["perennial", 3, 5, [0, 2, 3, 5, 5, 5]],
    ["annual", 2, 3, [1, 2, 3, 3]],
    ["fruit", 2, 5, [0, 5, 4, 3, 3, 3]],
    ["succulent", 3, 4, [0, 2, 3, 4, 4]],
    ["legume", 2, 5, [0, 3, 4, 5, 5, 5]],
    ["grass", 2, 5, [0, 2, 3, 5, 5, 5]],
  ] as Array<[PlantKind, number, number, number[]]>) {
    it(`${kind}: initial food, cap and every growth row (printed cards)`, () => {
      assert.equal(PLANTS[kind].startFood, start);
      assert.equal(PLANTS[kind].maxFood, max);
      curve.forEach((expected, from) => {
        assert.equal(growthTarget(PLANTS[kind], from), expected, `${kind}:${from}`);
        const next = grow(scenario([plant(kind, from)]));
        const survivor = next.plants!.find((p) => p.id === "plant");
        if (from === 0 && kind !== "annual") assert.equal(survivor, undefined);
        else assert.equal(survivor?.food, expected);
      });
    });
  }
  it("fungus starts with one and cannot exceed four (printed card p.2, enlarged fragment)", () => {
    assert.equal(PLANTS.fungus.startFood, 1);
    assert.equal(PLANTS.fungus.maxFood, 4);
    const g = scenario([plant("fungus", 3)]);
    g.phase = "extinction";
    g.extinctionDeaths = ["a", "b"];
    const next = applyAction(g, { type: "continueExtinction" });
    assert.equal(next.plants![0]!.food, 4);
  });
  it("liana growth counts parasites but not other lianas, with its configured cap", () => {
    const host = plant("annual", 1, [], "host");
    const par = { ...plant("parasite", 0, [], "par"), hostId: host.id };
    const next = grow(scenario([plant("liana", 1), plant("liana", 1, [], "l2"), host, par]));
    assert.equal(next.plants!.find((p) => p.id === "plant")!.food, 2);
    const many = grow(scenario([plant("liana", 1), ...Array.from({ length: 8 }, (_, i) => plant("annual", 1, [], `p${i}`))]));
    assert.equal(many.plants![0]!.food, PLANTS.liana.maxFood);
  });
  it("carnivorous and parasite plants have no ordinary growth", () => {
    for (const kind of ["carnivorous", "parasite"] as const) {
      assert.equal(grow(scenario([plant(kind, 2)])).plants![0]!.food, 2);
    }
  });
});

describe("plants audit: nine plant traits", () => {
  for (const [restriction, required] of [["plantWater", "swimming"], ["rootVegetable", "burrowing"], ["tree", "highBodyWeight"]] as const) {
    it(`${restriction}: required animal trait, disabled trait, and independent shelter access`, () => {
      const pl = { ...plant("perennial", 2, [t(restriction)]), shelters: 1 };
      const a = animal("a", 0, [t(required)]);
      const g = scenario([pl], [a, animal("b", 1)]);
      assert.equal(canFeedOnPlant(g, a, pl), true);
      a.traits[0]!.disabled = true;
      assert.equal(canFeedOnPlant(g, a, pl), false);
      assert.ok(legalFeedActions(g, 0).some((x) => x.type === "feedShelter"));
      assert.equal(legalFeedActions(g, 0).some((x) => x.type === "feedSkip"), false);
    });
  }
  for (const [trait, added] of [["thorny", 3], ["tree", 1]] as const) {
    it(`${trait}: placement adds shelters immediately; growth restores all icons`, () => {
      const g = scenario([plant("fruit", 2)]);
      g.plants![0]!.shelters = 1;
      g.phase = "development";
      g.players[0]!.hand = [{ id: "card", faces: [trait] }];
      const action = { type: "devPlayPlantTrait", cardId: "card", face: 0, plantId: "plant" } as const;
      assert.ok(legalDevActions(g, 0).some((x) => JSON.stringify(x) === JSON.stringify(action)));
      const next = applyAction(g, action);
      assert.equal(next.plants![0]!.shelters, 1 + added);
      next.plants![0]!.shelters = 0;
      assert.equal(grow(next).plants![0]!.shelters, 1 + added);
      assert.equal(shelterCapacity(next.plants![0]!), 1 + added);
    });
  }
  it("shelter protects from animal and plant attacks and expires after feeding", () => {
    const g = scenario([{ ...plant("perennial", 2, [t("thorny")]), shelters: 3 }, plant("carnivorous", 1, [], "cp")], [animal("a"), animal("car", 1, [t("carnivore")])]);
    const next = applyAction(g, { type: "feedShelter", animalId: "a", plantId: "plant" });
    assert.equal(next.plants![0]!.shelters, 2);
    const a = next.players[0]!.animals[0]!;
    assert.equal(a.sheltered, true);
    assert.equal(canAttack(next, next.players[1]!.animals[0]!, a), false);
    assert.equal(canPlantAttackTarget(next, next.plants![1]!, a), false);
    assert.equal(grow(next).players[0]!.animals[0]!.sheltered, false);
  });
  it("medicinal makes a large animal fed and disables its properties", () => {
    const next = take(scenario([plant("perennial", 2, [t("medicinal")])], [animal("a", 0, [t("highBodyWeight"), t("camouflage")]), animal("b", 1)]));
    const a = next.players[0]!.animals[0]!;
    assert.equal(a.sedated, true);
    assert.equal(a.food, 1);
    assert.equal(isFed(a), true);
    assert.equal(hasTrait(a, "camouflage"), false);
    assert.equal(canPlantAttackTarget(next, plant("carnivorous"), a), true);
    assert.equal(grow(next).players[0]!.animals[0]!.sedated, false);
  });
  it("medicinal puts food into empty fat and does not suppress honey plant", () => {
    const a = animal("a", 0, [t("fatTissue")]);
    a.food = 1;
    const g = scenario([plant("perennial", 2, [t("medicinal"), t("honeyPlant")])], [a, animal("b", 1)]);
    g.players[1]!.hand = [{ id: "x", faces: ["running"] }];
    const next = take(g);
    assert.equal(next.players[0]!.animals[0]!.fatTokens, 1);
    assert.equal(next.players[0]!.hand.length, 1);
  });
  it("medicinal switches off communication before a partner takes food", () => {
    const a = animal("a"), b = animal("partner");
    link(a, b, "communication");
    const next = take(scenario([plant("perennial", 3, [t("medicinal")])], [a, b, animal("b", 1)]));
    assert.equal(next.players[0]!.animals[1]!.food, 0);
    assert.equal(next.plants![0]!.food, 2);
  });
  it("nutritious supplies blue food even from the last red token", () => {
    const next = take(scenario([plant("perennial", 1, [t("nutritious")])], [animal("a", 0, [t("highBodyWeight")]), animal("b", 1)]));
    assert.equal(next.players[0]!.animals[0]!.food, 2);
    assert.equal(next.players[0]!.animals[0]!.blueFood, 1);
    assert.equal(next.plants![0]!.food, 0);
  });
  it("communication partner receives nutritious and honey effects of the same source", () => {
    const a = animal("a", 0, [t("highBodyWeight")]), b = animal("partner", 0, [t("highBodyWeight")]);
    link(a, b, "communication");
    const g = scenario([plant("perennial", 4, [t("nutritious"), t("honeyPlant")])], [a, b, animal("b", 1)]);
    g.players[1]!.hand = Array.from({ length: 6 }, (_, i) => ({ id: `x${i}`, faces: ["running"] }));
    const next = take(g);
    assert.deepEqual(next.players[0]!.animals.map((a) => [a.food, a.blueFood]), [[2, 1], [2, 1]]);
    assert.equal(next.plants![0]!.food, 2);
    assert.equal(next.players[0]!.hand.length, 2);
  });
  it("communication chains through a shared plant once per pair card without loops", () => {
    const a = animal("a"), b = animal("partner"), c = animal("third");
    link(a, b, "communication"); link(b, c, "communication"); link(c, a, "communication");
    const next = take(scenario([plant("perennial", 5)], [a, b, c, animal("b", 1)]));
    assert.deepEqual(next.players[0]!.animals.map((a) => a.food), [1, 1, 1]);
    assert.equal(next.plants![0]!.food, 2);
  });
  it("communication cannot feed a partner unable to eat that plant", () => {
    const a = animal("a", 0, [t("swimming")]), b = animal("partner");
    link(a, b, "communication");
    const next = take(scenario([plant("perennial", 3, [t("plantWater")])], [a, b, animal("b", 1)]));
    assert.equal(next.players[0]!.animals[1]!.food, 0);
    assert.equal(next.plants![0]!.food, 2);
  });
  it("honey does not steal from equal or smaller hands", () => {
    const g = scenario([plant("perennial", 2, [t("honeyPlant")])]);
    g.players[0]!.hand = [{ id: "own", faces: ["running"] }];
    g.players[1]!.hand = [{ id: "other", faces: ["running"] }];
    const next = take(g);
    assert.deepEqual(next.players.map((p) => p.hand.length), [1, 1]);
  });
  it("parasite transfer respects host last token and parasite max, including direct actions", () => {
    for (const [hostFood, parFood, allowed] of [[2, 5, true], [1, 0, false], [2, 6, false]] as const) {
      const par = { ...plant("parasite", parFood, [], "par"), hostId: "host" };
      const g = scenario([plant("perennial", hostFood, [], "host"), par]);
      assert.equal(legalFeedActions(g, 0).some((x) => x.type === "feedParasitize"), allowed);
      const next = applyAction(g, { type: "feedParasitize", hostId: "host", parasiteId: "par" });
      assert.equal(next.plants![0]!.food, hostFood - Number(allowed));
      assert.equal(next.plants![1]!.food, parFood + Number(allowed));
    }
  });
  it("parasite is independent of host restrictions, survives empty and dies in host cascade", () => {
    const host = plant("perennial", 2, [t("plantWater")], "host");
    const par = { ...plant("parasite", 1, [], "par"), hostId: "host" };
    const child = { ...plant("parasite", 0, [], "child"), hostId: "par" };
    const g = scenario([host, par, child]);
    assert.equal(canFeedOnPlant(g, g.players[0]!.animals[0]!, host), false);
    assert.equal(canFeedOnPlant(g, g.players[0]!.animals[0]!, par), true);
    assert.equal(grow(g).plants!.length, 3);
    host.food = 0;
    assert.equal(grow(g).plants!.length, 0);
  });
  it("plantParasite placement creates an independent plant and does not consume table slots", () => {
    const g = scenario(Array.from({ length: 6 }, (_, i) => plant("perennial", 2, [], `p${i}`)));
    g.phase = "development";
    g.players[0]!.hand = [{ id: "card", faces: ["plantParasite"] }];
    const next = applyAction(g, { type: "devPlayPlantTrait", cardId: "card", face: 0, plantId: "p0" });
    const par = next.plants!.find((p) => p.kind === "parasite")!;
    assert.equal(par.hostId, "p0");
    assert.equal(par.food, 0);
    next.plantDeck = ["annual"];
    const full = grow(next);
    assert.equal(full.plants!.length, 7);
    assert.equal(full.plantDeck!.length, 1);
  });
  it("mycorrhiza saves a component and revives empty members only at growth end", () => {
    const a = plant("grass", 0, [], "a"), b = plant("perennial", 0, [], "b"), c = plant("annual", 1, [], "c");
    link(a, b, "micorrhiza"); link(b, c, "micorrhiza");
    assert.deepEqual(grow(scenario([a, b, c])).plants!.map((p) => p.food), [1, 1, 2]);
    c.food = 0;
    const empty = grow(scenario([a, b, c]));
    assert.deepEqual(empty.plants!.map((p) => [p.id, p.food]), [["c", 1]]);
  });
  it("mycorrhiza cannot cross continents, allows multiple different partners", () => {
    const g = scenario([plant("annual", 1, [], "a"), plant("annual", 1, [], "b"), plant("annual", 1, [], "c")]);
    g.modules.continents = true;
    g.phase = "development";
    g.plants![0]!.zoneId = "laurasia";
    g.plants![1]!.zoneId = "gondwana";
    g.plants![2]!.zoneId = "laurasia";
    g.players[0]!.hand = [{ id: "m", faces: ["micorrhiza"] }];
    const pairs = legalDevActions(g, 0).filter((x) => x.type === "devPlayPlantPair");
    assert.ok(pairs.length > 0);
    const zoneOf = (id: string) => g.plants!.find((p) => p.id === id)?.zoneId;
    for (const x of pairs) {
      if (x.type !== "devPlayPlantPair") continue;
      // Континентальный запрет: микориза не соединяет разные континенты.
      assert.equal(zoneOf(x.a), zoneOf(x.b), JSON.stringify(x));
    }
  });
});

describe("plants audit: carnivorous plant", () => {
  it("direct attack may target the current player's own animal (p.9: any animal)", () => {
    const g = scenario([plant("carnivorous", 1, [], "cp")]);
    assert.ok(legalFeedActions(g, 0).some((x) => x.type === "feedPlantAttack" && x.preyId === "a"));
  });
  it("counterattack waits for right neighbor and ignores exactly one defense after JSON restore", () => {
    const running = t("running"), tail = t("tailLoss");
    const g = scenario([plant("carnivorous", 2)], [animal("a", 0, [running, tail]), animal("b", 1)]);
    const pending = JSON.parse(JSON.stringify(take(g))) as GameState;
    assert.equal(pending.pendingAttack?.waitingFor, 1);
    assert.deepEqual(legalDefenseActions(pending, 0), []);
    assert.deepEqual(legalDefenseActions(pending, 1), [running, tail].map((trait) => ({ type: "chooseDefense", kind: "ignore", ignoredTraitId: trait.id })));
    const invalid = applyAction(pending, { type: "chooseDefense", kind: "none" });
    assert.deepEqual(invalid.pendingAttack, pending.pendingAttack);
    const next = applyAction(pending, { type: "chooseDefense", kind: "ignore", ignoredTraitId: running.id });
    assert.equal(next.pendingAttack?.waitingFor, 0);
    const options = legalDefenseActions(next, 0);
    assert.ok(options.some((x) => x.type === "chooseDefense" && x.kind === "tailLoss"));
    assert.ok(!options.some((x) => x.type === "chooseDefense" && (x.kind === "ignore" || x.kind === "running")));
  });
  it("counterattack retains a second passive defense and consumes its annual attack", () => {
    const big = t("highBodyWeight"), camouflage = t("camouflage");
    const pending = take(scenario([plant("carnivorous", 2)], [animal("a", 0, [big, camouflage]), animal("b", 1)]));
    assert.equal(pending.pendingAttack?.waitingFor, 1);
    const next = applyAction(pending, { type: "chooseDefense", kind: "ignore", ignoredTraitId: big.id });
    assert.equal(next.pendingAttack, null);
    assert.equal(next.players[0]!.animals[0]!.food, 1);
    assert.equal(next.plants![0]!.attackedThisYear, true);
    assert.equal(next.players[0]!.animals[0]!.traits[0]!.disabled, undefined);
  });
  it("mimicry requester receives food even when the redirected prey is eaten", () => {
    const a = animal("a", 0, [t("running"), t("mimicry")]);
    const g = scenario([plant("carnivorous", 2, [], "cp")], [a, animal("redirect"), animal("b", 1)]);
    const selecting = take(g, "a", "cp");
    const pending = applyAction(selecting, { type: "chooseDefense", kind: "ignore", ignoredTraitId: a.traits[0]!.id });
    assert.ok(legalDefenseActions(pending, 0).some((x) => x.type === "chooseDefense" && x.kind === "mimicry"));
    const next = applyAction(pending, { type: "chooseDefense", kind: "mimicry", mimicryTargetId: "redirect" });
    assert.equal(next.players[0]!.animals.find((a) => a.id === "a")!.food, 1);
    assert.equal(next.players[0]!.animals.some((a) => a.id === "redirect"), false);
    assert.equal(next.plants![0]!.food, 3);
  });
  it("sheltered requester is not counterattacked", () => {
    const a = animal("a"); a.sheltered = true;
    const next = take(scenario([plant("carnivorous", 2)], [a, animal("b", 1)]));
    assert.equal(next.players[0]!.animals[0]?.id, "a");
    assert.equal(next.players[0]!.animals[0]!.food, 1);
  });
  it("medicinal prey has no active poison when eaten by a plant", () => {
    const a = animal("a", 1, [t("poisonous")]); a.sedated = true;
    const next = applyAction(scenario([plant("carnivorous", 2)], [animal("hunter"), a]), { type: "feedPlantAttack", plantId: "plant", preyId: "a" });
    assert.equal(Boolean(next.plants![0]!.doomed), false);
  });
  it("poison, cap, tail reward, and attack reset at growth", () => {
    const g = scenario([plant("carnivorous", 6)], [animal("a"), animal("prey", 1, [t("tailLoss")])]);
    const pending = applyAction(g, { type: "feedPlantAttack", plantId: "plant", preyId: "prey" });
    const next = applyAction(pending, { type: "chooseDefense", kind: "tailLoss" });
    assert.equal(next.plants![0]!.food, 6);
    assert.equal(next.plants![0]!.attackedThisYear, true);
    assert.equal(grow(next).plants![0]!.attackedThisYear, false);
    const poisoned = scenario([plant("carnivorous", 1)], [animal("a"), animal("poison", 1, [t("poisonous")])]);
    const killed = applyAction(poisoned, { type: "feedPlantAttack", plantId: "plant", preyId: "poison" });
    assert.equal(killed.plants![0]!.doomed, true);
    assert.equal(grow(killed).plants!.length, 0);
  });
  it("plant traits do not let it bypass passive defenses of a directed target", () => {
    const pl = plant("carnivorous", 1, [t("plantWater"), t("tree")]);
    for (const defense of ["swimming", "highBodyWeight", "camouflage"] as const) {
      const prey = animal("prey", 1, [t(defense)]);
      assert.equal(canPlantAttackTarget(scenario([pl]), pl, prey), false);
    }
  });
});
