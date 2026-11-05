import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalFeedActions } from "./engine.ts";
import { nextRandom } from "./rng.ts";
import type { Animal, GameState, TraitId } from "./types.ts";

/** Локальные помощники (минимальные копии паттерна engine.test.ts). */
function t(type: TraitId) {
  return { id: `i-${type}`, cardId: `c-${type}`, type, logSeq: 0, hidden: false, playSeq: 0 };
}
function mkAnimal(id: string, ownerId: number, traits: TraitId[]): Animal {
  return {
    id,
    ownerId,
    cardId: `card-${id}`,
    traits: traits.map(t),
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: 1,
  } as Animal;
}
/** Состояние с животными по местам; сид подбирается под бросок защиты. */
function setup(playersAnimals: Animal[][]): GameState {
  const g = createGame(Math.max(2, playersAnimals.length), "normal", 7, undefined, undefined, undefined, undefined, {
    seat: 1,
    doubleHunt: true,
    bossFeedsExtra: true,
  });
  for (let i = 0; i < playersAnimals.length; i++) {
    g.players[i]!.animals = playersAnimals[i]!;
  }
  g.phase = "foodBank";
  g.foodRoll = [3];
  g.foodBank = 6;
  return g;
}
function seedWithRoll(kind: "high" | "low"): number {
  for (let s = 1; s < 100000; s++) {
    const probe = { rngState: s } as GameState;
    const r = nextRandom(probe);
    if ((kind === "high" && r >= 0.5) || (kind === "low" && r < 0.5)) return s;
  }
  throw new Error("no seed");
}

describe("сценарий изверга (волна 4а)", () => {
  it("createGame хранит сценарий; чужой/невалидный сид отбрасывается", () => {
    const g = createGame(2, "normal", 7, undefined, undefined, undefined, undefined, {
      seat: 1,
      doubleHunt: true,
    });
    assert.deepEqual(g.scenario, { seat: 1, doubleHunt: true, bossFeedsExtra: undefined });
    const bad = createGame(2, "normal", 7, undefined, undefined, undefined, undefined, {
      seat: 5,
      doubleHunt: true,
    });
    assert.equal(bad.scenario, undefined, "сид вне комнаты — сценария нет");
  });

  it("«Костолом»: в начале кормления животные босса получают +1 еды", () => {
    const g = setup([[], [mkAnimal("boss1", 1, [])]]);
    g.players[1]!.isAI = true;
    const before = g.players[1]!.animals[0]!.blueFood;
    const next = applyAction(g, { type: "beginFeeding" });
    assert.equal(next.players[1]!.animals[0]!.blueFood, before + 1);
    assert.ok(next.lastEvents.some((e) => e.kind === "blueFood" && e.reason === "scenario"));
    // Животные игрока не тронуты.
    for (const a of next.players[0]!.animals) assert.equal(a.blueFood, 0);
  });

  it("«Атроксабилис»: после удачной охоты ход босса не передаётся", () => {
    let g = setup([[mkAnimal("prey", 0, [])], [mkAnimal("car", 1, ["carnivore"])]]);
    g.currentPlayerId = 1;
    g.firstPlayerId = 1;
    g.players[1]!.isAI = true;
    g = applyAction(g, { type: "feedHunt", carnivoreId: "car", preyId: "prey" });
    // Беззащитная добыча гибнет в том же действии (защиты нет — «none» авто).
    assert.ok(g.lastEvents.some((e) => e.kind === "preyKilled"));
    // Ход остался у босса: вторая охота разрешена (§4.2, ломающее правило).
    assert.equal(g.currentPlayerId, 1, "ход не передан — двойная охота");
    assert.equal(g.turnUse.doubleHuntUsed, true);
    assert.equal(g.turnUse.combatUsed, false);
    assert.equal(g.players[0]!.animals.some((a) => a.id === "prey"), false);
  });

  it("двойная охота — ровно одна: после второй удачи ход уходит", () => {
    let g = setup([[mkAnimal("p1", 0, []), mkAnimal("p2", 0, [])], [mkAnimal("car", 1, ["carnivore"])]]);
    g.currentPlayerId = 1;
    g.firstPlayerId = 1;
    g.players[1]!.isAI = true;
    // Первая охота (беззащитная добыча — мгновенная).
    g = applyAction(g, { type: "feedHunt", carnivoreId: "car", preyId: "p1" });
    assert.equal(g.currentPlayerId, 1);
    assert.equal(g.turnUse.doubleHuntUsed, true);
    // Вторая охота в тот же ход — двойная отработала.
    g = applyAction(g, { type: "feedHunt", carnivoreId: "car", preyId: "p2" });
    assert.ok(g.lastEvents.some((e) => e.kind === "preyKilled"), "вторая добыча съедена");
    // Третья невозможна: в легальных действиях босса больше нет feedHunt.
    const hunts = legalFeedActions(g, 1).filter((a) => a.type === "feedHunt");
    assert.equal(hunts.length, 0, "третья охота невозможна — doubleHuntUsed");
  });
});
