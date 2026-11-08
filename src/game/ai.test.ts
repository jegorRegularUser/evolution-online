import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyAction,
  createGame,
  legalDefenseActions,
  legalDevActions,
  legalFeedActions,
} from "./engine.ts";
import { chooseAIAction } from "./ai.ts";
import { liveScore } from "./queries.ts";
import type { Animal, GameAction, GameState, TraitId, TraitInstance } from "./types.ts";

let fixtureSeq = 0;
function trait(type: TraitId, extra: Partial<TraitInstance> = {}): TraitInstance {
  fixtureSeq += 1;
  return {
    id: `ai-t${fixtureSeq}`,
    cardId: `ai-c${fixtureSeq}`,
    type,
    hidden: false,
    playSeq: fixtureSeq,
    ...extra,
  };
}

function animal(
  id: string,
  ownerId: number,
  types: TraitId[] = [],
  zoneId?: "laurasia" | "gondwana" | "ocean",
): Animal {
  return {
    id,
    ownerId,
    cardId: `ai-body-${id}`,
    traits: types.map((type) => trait(type)),
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: 1,
    ...(zoneId ? { zoneId } : {}),
  };
}

function stateWithAnimals(
  animals: Animal[][],
  difficulty: GameState["difficulty"] = "normal",
  modules: { continents?: boolean } = {},
): GameState {
  const state = createGame(Math.max(2, animals.length), difficulty, 7, undefined, modules);
  for (const p of state.players) {
    p.hand = [];
    p.animals = [];
  }
  animals.forEach((list, id) => {
    state.players[id]!.animals = list;
  });
  state.currentPlayerId = 0;
  state.firstPlayerId = 0;
  return state;
}

function sameAction(left: GameAction, right: GameAction): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

describe("AI: решения по картам", () => {
  it("не отдаёт «Паразита» хозяину соперника", () => {
    const state = stateWithAnimals([[animal("own", 0)], [animal("enemy", 1)]]);
    state.phase = "development";
    state.players[0]!.hand = [{ id: "parasite-card", faces: ["parasite"] }];
    const legal = legalDevActions(state, 0);
    assert.ok(
      legal.some((action) => action.type === "devPlayTrait" && action.animalId === "enemy"),
    );
    const action = chooseAIAction(state);
    assert.ok(action);
    assert.notEqual(action.type, "devPlayTrait", "Паразит не должен быть выбран чужая цель");
  });

  it("не ломает сотрудничество и симбиоз на своей паре", () => {
    const state = stateWithAnimals([[animal("left", 0), animal("right", 0)], []]);
    state.phase = "development";
    state.players[0]!.hand = [{ id: "coop-card", faces: ["cooperation"] }];
    const action = chooseAIAction(state);
    assert.equal(action?.type, "devPlayPair");
    const next = applyAction(state, action!);
    assert.equal(
      next.players[0]!.animals.filter((a) => a.traits.some((t) => t.type === "cooperation")).length,
      2,
    );
  });

  it("выбирает пару в normal/hard, но редко в easy", () => {
    for (const difficulty of ["easy", "normal", "hard"] as const) {
      const state = stateWithAnimals([[animal("left", 0), animal("right", 0)], []], difficulty);
      state.phase = "development";
      state.players[0]!.hand = [{ id: "symbiosis-card", faces: ["symbiosis"] }];
      const action = chooseAIAction(state);
      assert.equal(action?.type === "devPlayPair", difficulty !== "easy", difficulty);
    }
  });
});

describe("AI: миграция и прилипала", () => {
  it("уезжает из пустой территории к реальной еде", () => {
    const state = stateWithAnimals([[animal("migrant", 0, ["migration"], "ocean")], []], "normal", {
      continents: true,
    });
    state.phase = "feeding";
    state.territoryFood = { laurasia: 8, gondwana: 0, ocean: 0 };
    state.foodBank = 8;
    const action = chooseAIAction(state);
    assert.equal(action?.type, "feedMigrate");
    if (action?.type === "feedMigrate") assert.equal(action.moves[0]?.to, "laurasia");
  });

  it("отправляет прилипалу за мигрантом, когда это даёт еду", () => {
    const state = stateWithAnimals(
      [
        [
          animal("migrant", 0, ["migration"], "ocean"),
          animal("remora", 0, ["remora", "swimming"], "ocean"),
        ],
        [],
      ],
      "normal",
      { continents: true },
    );
    state.phase = "feeding";
    state.territoryFood = { laurasia: 8, gondwana: 0, ocean: 0 };
    state.foodBank = 8;
    const first = chooseAIAction(state);
    assert.equal(first?.type, "feedMigrate");
    const pending = applyAction(state, first!);
    assert.ok(pending.pendingMigration);
    const response = chooseAIAction(pending);
    assert.equal(response?.type, "feedRemora");
    if (response?.type === "feedRemora") {
      assert.equal(response.animalId, "remora");
      assert.equal(response.migrantId, "migrant");
    }
  });

  it("не переезжает в пустую зону без угрозы", () => {
    const state = stateWithAnimals([[animal("migrant", 0, ["migration"], "ocean")], []], "normal", {
      continents: true,
    });
    state.phase = "feeding";
    state.territoryFood = { laurasia: 0, gondwana: 0, ocean: 0 };
    state.foodBank = 0;
    assert.notEqual(chooseAIAction(state)?.type, "feedMigrate");
  });
});

describe("AI: кормовая база", () => {
  it("предпочитает действительно голодное животное", () => {
    const plain = animal("plain", 0);
    const hungry = animal("hungry", 0, ["highBodyWeight"]);
    const state = stateWithAnimals([[plain, hungry], []]);
    state.phase = "feeding";
    state.foodBank = 4;
    const legal = legalFeedActions(state, 0).filter((a) => a.type === "feedTake");
    assert.ok(legal.some((a) => a.animalId === "hungry"));
    const action = chooseAIAction(state);
    assert.equal(action?.type, "feedTake");
    if (action?.type === "feedTake") assert.equal(action.animalId, "hungry");
  });

  it("не выбирает еду из пустой базы", () => {
    const state = stateWithAnimals([[animal("plain", 0)], []]);
    state.phase = "feeding";
    state.foodBank = 0;
    const action = chooseAIAction(state);
    assert.notEqual(action?.type, "feedTake");
  });
});

describe("AI: сложность", () => {
  it("hard целится в лидера, а не в своё животное", () => {
    const hunter = animal("hunter", 0, ["carnivore"]);
    const ownPrey = animal("own-prey", 0);
    const leader = animal("leader", 1, ["fatTissue", "fatTissue", "fatTissue"]);
    const state = stateWithAnimals([[hunter, ownPrey], [leader]], "hard");
    state.phase = "feeding";
    state.foodBank = 0;
    const action = chooseAIAction(state);
    assert.equal(action?.type, "feedHunt");
    if (action?.type === "feedHunt") {
      assert.equal(action.preyId, "leader");
      assert.notEqual(action.preyId, "own-prey");
    }
  });
});

interface BenchResult {
  scores: number[];
  actions: number;
  illegal: number;
  nullActions: number;
  passes: number;
  needlessPasses: number;
  migrations: number;
  remoras: number;
  selfHunts: number;
  foreignHunts: number;
  duplicateBodies: number;
  bodyStockOverlap: number;
}

function driveBenchmark(seed: number, difficulty: GameState["difficulty"]): BenchResult {
  const seats = [
    { name: "Человек", isAI: false },
    ...Array.from({ length: 3 }, (_, i) => ({ name: `Бот ${i + 1}`, isAI: true })),
  ];
  let state = createGame(4, difficulty, seed, seats);
  const result: BenchResult = {
    scores: [],
    actions: 0,
    illegal: 0,
    nullActions: 0,
    passes: 0,
    needlessPasses: 0,
    migrations: 0,
    remoras: 0,
    selfHunts: 0,
    foreignHunts: 0,
    duplicateBodies: 0,
    bodyStockOverlap: 0,
  };
  for (let step = 0; step < 12_000 && state.phase !== "gameOver"; step++) {
    if (state.phase === "foodBank") {
      state = applyAction(
        state,
        state.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" },
      );
      continue;
    }
    if (state.phase === "extinction") {
      state = applyAction(state, { type: "continueExtinction" });
      continue;
    }
    if (state.phase === "growth") {
      state = applyAction(state, { type: "continueGrowth" });
      continue;
    }
    const legal = state.pendingAttack
      ? legalDefenseActions(state, state.pendingAttack.waitingFor)
      : state.phase === "development"
        ? legalDevActions(state, state.currentPlayerId)
        : legalFeedActions(state, state.currentPlayerId);
    const originalDifficulty = state.difficulty;
    if (state.currentPlayerId === 0) state.difficulty = "normal";
    const action = chooseAIAction(state);
    state.difficulty = originalDifficulty;
    if (!action) {
      result.nullActions += 1;
      break;
    }
    result.actions += 1;
    if (!legal.some((candidate) => sameAction(candidate, action))) result.illegal += 1;
    if (action.type === "devPass" || action.type === "feedSkip") result.passes += 1;
    if (action.type === "feedMigrate") result.migrations += 1;
    if (action.type === "feedRemora") result.remoras += 1;
    if (action.type === "feedHunt") {
      const prey = state.players
        .flatMap((p) => p.animals)
        .find((candidate) => candidate.id === action.preyId);
      if (prey?.ownerId === state.currentPlayerId) result.selfHunts += 1;
      else result.foreignHunts += 1;
    }
    if (action.type === "devPass" && legal.some((candidate) => candidate.type !== "devPass")) {
      result.needlessPasses += 1;
    }
    if (action.type === "feedSkip") {
      const canFeed = legal.some((candidate) =>
        [
          "feedTake",
          "feedTakePlant",
          "feedTakeFlora",
          "feedHunt",
          "feedGraze",
          "feedMigrate",
        ].includes(candidate.type),
      );
      if (canFeed) result.needlessPasses += 1;
    }
    state = applyAction(state, action);
  }
  assert.equal(state.phase, "gameOver", `seed ${seed}/${difficulty} did not finish`);
  const scores = state.scores ?? [];
  result.scores = scores.filter((score) => score.playerId > 0).map((score) => score.total);
  const bodies = state.players.flatMap((p) => p.animals.map((a) => a.cardId));
  result.duplicateBodies = bodies.length - new Set(bodies).size;
  const stock = new Set([
    ...state.deck.map((card) => card.id),
    ...state.players.flatMap((p) => [...p.hand, ...(p.blindDeck ?? [])].map((card) => card.id)),
  ]);
  result.bodyStockOverlap = bodies.filter((id) => stock.has(id)).length;
  return result;
}

function migrationProbe(
  seed: number,
  difficulty: GameState["difficulty"],
): { migration: boolean; remora: boolean } {
  const state = createGame(2, difficulty, seed, undefined, { continents: true });
  for (const p of state.players) {
    p.hand = [];
    p.animals = [];
  }
  state.players[0]!.animals = [
    animal(`probe-migrant-${seed}`, 0, ["migration"], "ocean"),
    animal(`probe-remora-${seed}`, 0, ["remora", "swimming"], "ocean"),
  ];
  state.phase = "feeding";
  state.currentPlayerId = 0;
  state.firstPlayerId = 0;
  state.territoryFood = { laurasia: 2 + (seed % 3), gondwana: 0, ocean: 0 };
  state.foodBank = state.territoryFood.laurasia!;
  const first = chooseAIAction(state);
  if (first?.type !== "feedMigrate") return { migration: false, remora: false };
  const pending = applyAction(state, first);
  const response = chooseAIAction(pending);
  return { migration: true, remora: response?.type === "feedRemora" };
}

describe("AI: пары сидов", () => {
  it("даёт hard > normal > easy и не выдаёт нелегальных действий", () => {
    const difficulties = ["easy", "normal", "hard"] as const;
    const summaries = {} as Record<
      (typeof difficulties)[number],
      { average: number; sigma: number; rows: BenchResult[] }
    >;
    for (const difficulty of difficulties) {
      const rows = Array.from({ length: 12 }, (_, i) => driveBenchmark(i + 1, difficulty));
      const gameAverages = rows.map(
        (row) => row.scores.reduce((sum, score) => sum + score, 0) / row.scores.length,
      );
      const average = gameAverages.reduce((sum, score) => sum + score, 0) / gameAverages.length;
      const sigma = Math.sqrt(
        gameAverages.reduce((sum, score) => sum + (score - average) ** 2, 0) / gameAverages.length,
      );
      summaries[difficulty] = { average, sigma, rows };
      for (const row of rows) {
        assert.equal(row.illegal, 0, `${difficulty}: illegal action`);
        assert.equal(row.nullActions, 0, `${difficulty}: null action`);
        assert.equal(row.duplicateBodies, 0, `${difficulty}: duplicate body card`);
        assert.equal(row.bodyStockOverlap, 0, `${difficulty}: body card left in stock`);
      }
    }
    const probes = difficulties.map((difficulty) => {
      const rows = Array.from({ length: 12 }, (_, i) => migrationProbe(i + 1, difficulty));
      return {
        difficulty,
        migrations: rows.filter((row) => row.migration).length,
        remoras: rows.filter((row) => row.remora).length,
      };
    });
    console.log(
      "AI benchmark",
      JSON.stringify({
        easy: { average: summaries.easy.average, sigma: summaries.easy.sigma },
        normal: { average: summaries.normal.average, sigma: summaries.normal.sigma },
        hard: { average: summaries.hard.average, sigma: summaries.hard.sigma },
        migrations: difficulties.map((difficulty) => {
          const rows = summaries[difficulty].rows;
          const passes = rows.reduce((sum, row) => sum + row.passes, 0);
          const needlessPasses = rows.reduce((sum, row) => sum + row.needlessPasses, 0);
          return {
            difficulty,
            count: rows.reduce((sum, row) => sum + row.migrations, 0),
            remoras: rows.reduce((sum, row) => sum + row.remoras, 0),
            selfHunts: rows.reduce((sum, row) => sum + row.selfHunts, 0),
            foreignHunts: rows.reduce((sum, row) => sum + row.foreignHunts, 0),
            passes,
            needlessPasses,
            needlessShare: passes ? needlessPasses / passes : 0,
          };
        }),
        migrationProbes: probes,
      }),
    );
    for (const probe of probes) {
      assert.equal(probe.migrations, 12, `${probe.difficulty}: migration probe`);
      assert.equal(probe.remoras, 12, `${probe.difficulty}: remora probe`);
    }
    assert.ok(summaries.normal.average > summaries.easy.average, "normal должен быть сильнее easy");
    assert.ok(summaries.hard.average > summaries.normal.average, "hard должен быть сильнее normal");
  });
});
