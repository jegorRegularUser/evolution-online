import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalDevActions } from "./engine.ts";
import { liveScore } from "./queries.ts";
import type { Animal, GameState, TraitId, TraitInstance } from "./types.ts";

function trait(type: TraitId): TraitInstance {
  return { id: `trait-${type}`, cardId: `card-${type}`, type, hidden: false, playSeq: 1 };
}

function animal(id: string, ownerId: number, traits: TraitInstance[] = []): Animal {
  return { id, ownerId, cardId: `body-${id}`, traits, food: 0, blueFood: 0,
    fatTokens: 0, hibernating: false, hibernatedLastYear: false,
    receivedFoodThisYear: false, poisoned: false, seed: 1, zoneId: "laurasia" };
}

function scenario(regenerate: boolean, randomMutations = false): GameState {
  const g = createGame(2, "normal", 7, undefined, { continents: true, plants: true, randomMutations });
  g.phase = "feeding";
  g.currentPlayerId = 1;
  g.players[0]!.animals = [animal("survivor", 0)];
  if (regenerate) g.players[0]!.animals.push(animal("prey", 0, [trait("regeneration"), trait("migration")]));
  g.players[1]!.animals = [animal("hunter", 1, [trait("carnivore")])];
  for (const p of g.players) {
    p.hand = randomMutations ? [] : [{ id: `replacement-${p.id}`, faces: ["running"] }];
    if (randomMutations) p.blindDeck = [{ id: `replacement-${p.id}`, faces: ["running"] }];
  }
  return g;
}

function eaten(randomMutations = false): GameState {
  const g = applyAction(scenario(true, randomMutations), { type: "feedHunt", carnivoreId: "hunter", preyId: "prey" });
  assert.ok(!g.players[0]!.animals.some(a => a.id === "prey"));
  assert.equal(g.pendingRegeneration?.length, 1);
  return g;
}

function extinction(g: GameState): GameState {
  // Isolate the public extinction/growth transition from unrelated starvation.
  g.phase = "extinction";
  g.extinctionDeaths = [];
  return applyAction(g, { type: "continueExtinction" });
}

function roundtrip(g: GameState): GameState {
  return JSON.parse(JSON.stringify(g)) as GameState;
}

function draws(g: GameState): number[] {
  const event = g.lastEvents.find(e => e.kind === "cardsDrawn");
  assert.ok(event?.kind === "cardsDrawn");
  return event.counts;
}

describe("regeneration regression", () => {
  it("uses a deck card for the body before the ordinary draw when the hand is empty", () => {
    const dead = eaten();
    dead.modules.plants = false;
    dead.players[0]!.hand = [];
    const body = dead.deck.at(-1)!.id;
    const deckSize = dead.deck.length;
    const next = extinction(dead);
    assert.equal(next.phase, "development");
    assert.ok(next.players[0]!.animals.some(a => a.cardId === body && a.traits.length === 2));
    assert.deepEqual(draws(next), [2, 2]);
    assert.equal(next.deck.length, deckSize - 5);
  });

  it("processes pending bodies in FIFO order and retains unfunded entries", () => {
    const dead = eaten();
    const first = dead.pendingRegeneration![0]!;
    const second = { ...structuredClone(first), animalId: "second-prey",
      traits: first.traits!.map(t => ({ ...t, id: `second-${t.id}`, cardId: `second-${t.cardId}` })) };
    dead.pendingRegeneration!.push(second);
    dead.deck = [];
    const next = extinction(roundtrip(dead));
    assert.deepEqual(next.players[0]!.animals.find(a => a.cardId === "replacement-0")!.traits, first.traits);
    assert.deepEqual(next.pendingRegeneration, [second]);
    assert.equal(next.lastEvents.filter(e => e.kind === "regenerated").length, 1);
  });

  it("does not restore a regenerating animal listed as a starvation death", () => {
    const g = scenario(true);
    g.phase = "extinction";
    g.extinctionDeaths = ["prey"];
    const next = applyAction(g, { type: "continueExtinction" });
    assert.equal(next.players[0]!.animals.length, 1);
    assert.equal(next.players[0]!.discardCount, 3);
    assert.equal(next.pendingRegeneration?.length ?? 0, 0);
    assert.equal(next.players[0]!.hand.length, 1);
  });

  it("counts un-restored properties but not a body at game end", () => {
    const dead = eaten();
    dead.players[0]!.hand = [];
    dead.deck = [];
    dead.lastYear = true;
    const finished = extinction(dead);
    assert.equal(finished.phase, "gameOver");
    const score = finished.scores!.find(s => s.playerId === 0)!;
    assert.equal(score.animals, 2);
    assert.equal(score.traits, 2);
    assert.equal(score.total, 4);
    assert.equal(liveScore(finished, 0), 4);
  });

  it("counts pair traits toward the two-trait regeneration limit on both endpoints", () => {
    const g = scenario(true);
    g.phase = "development";
    g.currentPlayerId = 0;
    g.players[0]!.hand = [{ id: "pair-card", faces: ["cooperation"] }];
    const legal = legalDevActions(g, 0);
    assert.equal(legal.some(a => a.type === "devPlayPair"), false);
    const prey = g.players[0]!.animals[1]!;
    prey.traits.pop();
    assert.ok(legalDevActions(g, 0).some(a => a.type === "devPlayPair"));
  });

  for (const randomMutations of [false, true]) {
    it(`isolates interleaved games across JSON growth snapshots (mutations=${randomMutations})`, () => {
      const a = roundtrip(extinction(eaten(randomMutations)));
      assert.equal(a.phase, "growth");
      const b = extinction(scenario(false, randomMutations));
      const before = JSON.stringify(a);
      const nextA = applyAction(a, { type: "continueGrowth" });
      const nextB = applyAction(b, { type: "continueGrowth" });
      assert.deepEqual(draws(nextA), randomMutations ? [3, 3] : [2, 2]);
      assert.deepEqual(draws(nextB), randomMutations ? [3, 3] : [2, 2]);
      assert.equal(JSON.stringify(a), before, "applyAction must not mutate its input snapshot");
      assert.deepEqual(applyAction(roundtrip(a), { type: "continueGrowth" }), nextA, "snapshot replay is deterministic");
      const nextYear = extinction(nextA);
      assert.deepEqual(draws(applyAction(nextYear, { type: "continueGrowth" })), randomMutations ? [4, 3] : [3, 2]);
    });
  }

  it("retains trait cards and metadata through eating, JSON and restoration", () => {
    const initial = scenario(true);
    initial.players[0]!.animals[1]!.traits[1]!.disabled = true;
    const expected = structuredClone(initial.players[0]!.animals[1]!.traits);
    const dead = applyAction(initial, { type: "feedHunt", carnivoreId: "hunter", preyId: "prey" });
    assert.equal(dead.players[0]!.discardCount, 1, "only the body is discarded");
    const g = extinction(roundtrip(dead));
    const restored = g.players[0]!.animals.find(a => a.cardId === "replacement-0");
    assert.ok(restored);
    assert.deepEqual(restored.traits, expected);
    assert.equal(g.players[0]!.hand.length, 0);
    assert.equal(g.players[0]!.discardCount, 1);
    assert.equal(g.pendingRegeneration?.length ?? 0, 0);
  });

  it("keeps both ends of a surviving pair connected after regeneration", () => {
    const initial = scenario(true);
    const survivor = initial.players[0]!.animals[0]!;
    const prey = initial.players[0]!.animals[1]!;
    prey.traits[1] = { ...trait("cooperation"), pairWith: survivor.id, pairRole: "a" };
    survivor.traits = [{ ...trait("cooperation"), id: "mirror", pairWith: prey.id, pairRole: "b" }];
    const g = extinction(applyAction(initial, { type: "feedHunt", carnivoreId: "hunter", preyId: "prey" }));
    const restored = g.players[0]!.animals.find(a => a.cardId === "replacement-0")!;
    const partner = g.players[0]!.animals.find(a => a.id === survivor.id)!;
    assert.equal(partner.traits[0]!.pairWith, restored.id);
    assert.equal(restored.traits[1]!.pairWith, partner.id);
    assert.equal(restored.traits[1]!.cardId, partner.traits[0]!.cardId);
  });

  it("does not resurrect a pair discarded when its other animal dies", () => {
    const initial = scenario(true);
    const survivor = initial.players[0]!.animals[0]!;
    const prey = initial.players[0]!.animals[1]!;
    prey.traits[1] = { ...trait("cooperation"), pairWith: survivor.id, pairRole: "a" };
    survivor.traits = [{ ...trait("cooperation"), id: "mirror", pairWith: prey.id, pairRole: "b" }];
    const dead = applyAction(initial, { type: "feedHunt", carnivoreId: "hunter", preyId: "prey" });
    dead.phase = "extinction";
    dead.extinctionDeaths = [survivor.id];
    const g = applyAction(dead, { type: "continueExtinction" });
    const restored = g.players[0]!.animals.find(a => a.cardId === "replacement-0")!;
    assert.deepEqual(restored.traits.map(t => t.type), ["regeneration"]);
  });

  it("retains legacy card-id-only snapshots without spending a replacement or inventing traits", () => {
    const g = scenario(false);
    g.pendingRegeneration = [{ ownerId: 0, cardIds: ["legacy-property"] }];
    const next = extinction(roundtrip(g));
    assert.deepEqual(next.pendingRegeneration, g.pendingRegeneration);
    assert.deepEqual(next.players[0]!.hand, g.players[0]!.hand);
    assert.equal(next.players[0]!.animals.length, 1);
  });

  it("preserves the location of properties rather than moving an ocean animal to land", () => {
    const initial = scenario(true);
    initial.players[0]!.animals[1]!.zoneId = "ocean";
    initial.players[0]!.animals[1]!.traits[1] = trait("swimming");
    initial.players[1]!.animals[0]!.zoneId = "ocean";
    initial.players[1]!.animals[0]!.traits.push(trait("swimming"));
    const dead = applyAction(initial, { type: "feedHunt", carnivoreId: "hunter", preyId: "prey" });
    assert.equal(dead.pendingRegeneration?.length, 1);
    const restored = extinction(dead).players[0]!.animals.find(a => a.cardId === "replacement-0")!;
    assert.equal(restored.zoneId, "ocean");
    assert.deepEqual(restored.traits.map(t => t.type), ["regeneration", "swimming"]);
  });

  it("does not lose the queued trait cards when no replacement card exists", () => {
    const dead = eaten();
    dead.players[0]!.hand = [];
    dead.deck = [];
    const waiting = extinction(roundtrip(dead));
    assert.deepEqual(waiting.pendingRegeneration, dead.pendingRegeneration);
    assert.equal(waiting.players[0]!.animals.length, 1);
    waiting.deck = [{ id: "later-body", faces: ["running"] }];
    const restored = extinction(waiting);
    assert.equal(restored.players[0]!.animals.length, 2);
    assert.equal(restored.pendingRegeneration?.length ?? 0, 0);
  });
});
