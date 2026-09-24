import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalFeedActions } from "./engine.ts";
import { buildDeck } from "./deck.ts";
import { liveScore } from "./queries.ts";
import type { Animal, GameAction, GameState, ModuleId, TraitId, TraitInstance } from "./types.ts";

let nextFixtureId = 0;
function fixtureId(prefix: string): string {
  nextFixtureId += 1;
  return `${prefix}${nextFixtureId}`;
}

function animal(id: string, ownerId: number, traits: TraitInstance[] = []): Animal {
  return {
    id,
    ownerId,
    cardId: fixtureId("body"),
    traits,
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: 1,
  };
}

function trait(type: TraitId, extra: Partial<TraitInstance> = {}): TraitInstance {
  return {
    id: fixtureId("trait"),
    cardId: fixtureId("card"),
    type,
    hidden: false,
    playSeq: 1,
    ...extra,
  };
}

function gameWithAnimals(
  animalsByPlayer: Animal[][],
  seed = 7,
  modules: Partial<Record<ModuleId, boolean>> = {},
): GameState {
  const state = createGame(Math.max(2, animalsByPlayer.length), "normal", seed, undefined, modules);
  for (const player of state.players) {
    player.hand = [];
    player.animals = [];
  }
  animalsByPlayer.forEach((animals, playerId) => {
    state.players[playerId]!.animals = animals;
  });
  return state;
}

function hunts(state: GameState, playerId: number): Extract<GameAction, { type: "feedHunt" }>[] {
  return legalFeedActions(state, playerId).filter(
    (action): action is Extract<GameAction, { type: "feedHunt" }> => action.type === "feedHunt",
  );
}

describe("Правила владельца: кормовая база", () => {
  it("для 2–8 игроков бросает официальное число кубиков и учитывает бонус в пищевом банке", () => {
    // A02, F-A02-1: официальная таблица «Игра с двумя наборами» для 2–8 игроков.
    const expected = [
      [1, 2],
      [2, 0],
      [2, 2],
      [3, 2],
      [3, 4],
      [4, 2],
      [4, 4],
    ] as const;

    for (const [index, [dice, bonus]] of expected.entries()) {
      const playerCount = index + 2;
      let state = createGame(playerCount, "normal", 100 + playerCount);
      state.phase = "foodBank";

      state = applyAction(state, { type: "rollFoodBank" });

      assert.equal(state.phase, "foodBank", `${playerCount} игроков: бросок должен оставаться показанным`);
      assert.equal(state.foodRoll?.length, dice, `${playerCount} игроков: число кубиков`);
      assert.equal(
        state.foodBank,
        state.foodRoll!.reduce((sum, die) => sum + die, 0) + bonus,
        `${playerCount} игроков: бонус должен попасть в банк`,
      );
    }
  });
});

describe("Правила владельца: хищничество", () => {
  it("разрешает максимум двух разных хищников за ход и запрещает третью охоту в том же году", () => {
    // A03, открытый вопрос 1 и решение владельца от 24.09.2026:
    // один ход игрока — не больше двух атак; одно животно — не чаще раза в год.
    const predators = ["hunter-1", "hunter-2", "hunter-3"].map((id) =>
      animal(id, 0, [
        {
          id: fixtureId("trait"),
          cardId: fixtureId("card"),
          type: "carnivore",
          hidden: false,
          playSeq: 1,
        },
      ]),
    );
    const prey = ["prey-1", "prey-2", "prey-3"].map((id) => animal(id, 1));
    let state = gameWithAnimals([predators, prey]);
    state.phase = "feeding";
    state.currentPlayerId = 0;
    state.firstPlayerId = 0;
    state.foodBank = 0;

    const firstTurnHunts = hunts(state, 0);
    assert.deepEqual(
      new Set(firstTurnHunts.map((action) => action.carnivoreId)),
      new Set(predators.map((predator) => predator.id)),
      "до охоты доступны все три хищника",
    );

    const preyIds = new Set(prey.map((candidate) => candidate.id));
    const usedPrey = new Set<string>();
    for (const predator of predators.slice(0, 2)) {
      const action = hunts(state, 0).find(
        (hunt) =>
          hunt.carnivoreId === predator.id && preyIds.has(hunt.preyId) && !usedPrey.has(hunt.preyId),
      );
      assert.ok(action, `${predator.id} должен иметь легальную атаку на новую добычу`);
      usedPrey.add(action.preyId);
      state = applyAction(state, action);
    }
    const thirdPrey = state.players[1]!.animals[0];
    assert.ok(thirdPrey, "для третьей атаки должна оставаться добыча");
    const thirdHunterAction: Extract<GameAction, { type: "feedHunt" }> = {
      type: "feedHunt",
      carnivoreId: "hunter-3",
      preyId: thirdPrey.id,
    };

    const afterLimit = applyAction(state, thirdHunterAction);
    assert.equal(afterLimit.pendingAttack, null, "третья атака не должна начинать охоту");
    assert.equal(afterLimit.players[1]!.animals.length, 1, "третья атака не должна убивать ещё одну добычу");
    assert.deepEqual(hunts(afterLimit, 0), [], "после двух атак легальных охот нет");

    const nextCircle = applyAction(afterLimit, { type: "feedEndTurn" });
    assert.equal(nextCircle.currentPlayerId, 0, "следующий круг возвращает ход игроку с третьим хищником");
    const nextCircleHunters = new Set(hunts(nextCircle, 0).map((action) => action.carnivoreId));
    assert.equal(nextCircleHunters.has("hunter-1"), false, "хищник не охотится второй раз в одном году");
    assert.equal(nextCircleHunters.has("hunter-2"), false, "хищник не охотится второй раз в одном году");
    assert.equal(nextCircleHunters.has("hunter-3"), true, "не охотившийся хищник может использовать новый ход");
  });
});

describe("Правила владельца: парные карты и территории", () => {
  it("убирает парное свойство в сброс после миграции одного животного в другую территорию", () => {
    // A04, F-A04-1 и A10: свойство «Континенты» не позволяет паре работать
    // между разными территориями; переехавший партнёр должен потерять карту.
    const pairCardId = fixtureId("card");
    const migrant = animal("migrant", 0, [
      trait("migration"),
      trait("swimming"),
      trait("cooperation", { cardId: pairCardId, pairWith: "partner", pairRole: "a" }),
    ]);
    const partner = animal("partner", 0, [
      trait("cooperation", { cardId: pairCardId, pairWith: "migrant", pairRole: "b" }),
    ]);
    partner.zoneId = "laurasia";
    let state = gameWithAnimals([[migrant, partner]], 7, { continents: true });
    state.phase = "feeding";
    state.currentPlayerId = 0;
    state.firstPlayerId = 0;
    state.territoryFood = { laurasia: 0, gondwana: 0, ocean: 3 };
    state.foodBank = 3;

    state = applyAction(state, {
      type: "feedMigrate",
      moves: [{ animalId: "migrant", to: "ocean" }],
    });

    const moved = state.players[0]!.animals.find((candidate) => candidate.id === "migrant")!;
    const stayed = state.players[0]!.animals.find((candidate) => candidate.id === "partner")!;
    assert.equal(moved.zoneId, "ocean");
    assert.equal(stayed.zoneId, "laurasia");
    assert.equal(moved.traits.some((candidate) => candidate.type === "cooperation"), false);
    assert.equal(stayed.traits.some((candidate) => candidate.type === "cooperation"), false);
    assert.equal(state.players[0]!.discardCount, 1, "сброшенная пара должна учитываться в сносе");
  });

  it("не восстанавливает пару регенерацией, если партнёр остался в другой территории", () => {
    // A04, F-A04-2 и A05, F-05-1: восстановленное тело не должно возродить
    // межтерриториальную парную карту, уже отправленную в сброс.
    const pairCardId = fixtureId("card");
    const partner = animal("partner", 0, [
      trait("cooperation", { cardId: pairCardId, pairWith: "regenerated-host", pairRole: "b" }),
    ]);
    let state = gameWithAnimals([[partner]], 7, { continents: true });
    state.phase = "extinction";
    state.lastYear = true;
    state.extinctionDeaths = [];
    state.players[0]!.hand = [{ id: "restore-body", faces: ["cooperation"] }];
    state.pendingRegeneration = [
      {
        ownerId: 0,
        animalId: "regenerated-host",
        zoneId: "laurasia",
        traits: [trait("cooperation", { cardId: pairCardId, pairWith: "partner", pairRole: "a" })],
      },
    ];
    partner.zoneId = "gondwana";

    state = applyAction(state, { type: "continueExtinction" });

    const restored = state.players[0]!.animals.find((candidate) => candidate.cardId === "restore-body");
    const survivingPartner = state.players[0]!.animals.find((candidate) => candidate.id === "partner");
    assert.ok(restored, "регенерирующее животное должно вернуться");
    assert.ok(survivingPartner, "партнёр должен остаться на столе");
    assert.equal(restored.zoneId, "laurasia");
    assert.equal(restored.traits.some((candidate) => candidate.pairWith), false);
    assert.equal(survivingPartner.traits.some((candidate) => candidate.pairWith), false);
  });
});

describe("Правила владельца: бешенство", () => {
  it("не даёт бешеному животному фишки за добычу и не кормит его добычей", () => {
    // A03, F-A03-1: при бешеной атаке добыча не естcя; даже «Падальщик»
    // не должен выбирать само бешеное животное.
    const mad = animal("mad", 0, [trait("scavenger")]);
    mad.marks = ["rage"];
    const prey = animal("prey", 1);
    let state = gameWithAnimals([[mad], [prey]], 7, { fungi: true });
    state.phase = "feeding";
    state.currentPlayerId = 0;
    state.firstPlayerId = 0;
    state.rageTurn = { animalId: mad.id };
    state.pendingAttack = null;

    const hunt = legalFeedActions(state, 0).find(
      (action): action is Extract<GameAction, { type: "feedHunt" }> => action.type === "feedHunt",
    );
    assert.ok(hunt, "бешеное животное должно иметь обязательную атаку");

    state = applyAction(state, hunt);
    const attacked = state.players[0]!.animals.find((candidate) => candidate.id === mad.id)!;
    assert.equal(attacked.food, 0, "бешеное животное не получает красную фишку");
    assert.equal(attacked.blueFood, 0, "бешеное животное не получает синюю фишку");
    assert.equal(state.players[1]!.animals.length, 0, "добыча убита, но не съедена");
  });

  it("не позволяет закончить раунд бешенства без обязательной атаки", () => {
    // A03, F-A03-2: если доступна жертва, «Закончить ход» не отменяет
    // обязательную атаку бешеного животного.
    const mad = animal("mad", 0);
    mad.marks = ["rage"];
    const prey = animal("prey", 1);
    let state = gameWithAnimals([[mad], [prey]], 7, { fungi: true });
    state.phase = "feeding";
    state.currentPlayerId = 0;
    state.firstPlayerId = 0;
    state.rageTurn = { animalId: mad.id };
    state.pendingAttack = null;

    const legal = legalFeedActions(state, 0);
    assert.ok(legal.some((action) => action.type === "feedHunt"), "нужна обязательная атака");
    assert.equal(
      legal.some((action) => action.type === "feedEndTurn"),
      false,
      "завершение хода не должно обходить атаку",
    );

    const attempted = applyAction(state, { type: "feedEndTurn" });
    assert.equal(attempted.rageTurn?.animalId, mad.id, "прямое завершение не должно снимать бешенство");
    assert.equal(attempted.players[1]!.animals.length, 1, "жертва должна остаться при отказе от атаки");
  });
});

describe("Правила владельца: случайные мутации", () => {
  it("выдаёт каждому игроку три стартовых вида и личную колоду", () => {
    // A14, F-A14-5: подготовка коробки — семь карт в личную колоду и
    // три стартовых вида для каждого игрока.
    for (const playerCount of [2, 3, 4, 5, 6, 7, 8]) {
      const state = createGame(playerCount, "normal", 700 + playerCount, undefined, {
        randomMutations: true,
      });
      for (const player of state.players) {
        assert.equal(player.animals.length, 3, `${playerCount} игроков: три стартовых вида`);
        assert.equal(player.blindDeck?.length ?? 0, 7, `${playerCount} игроков: личная колода из 7 карт`);
      }
    }
  });

  it("выдаёт выбывшему игроку десять карт спасения", () => {
    // A09, F-A09-4: после выбывания без животных и карт следующий год
    // возвращает ровно десять карт в личную колоду мутаций.
    let state = createGame(2, "normal", 17, undefined, { randomMutations: true });
    state.phase = "extinction";
    state.extinctionDeaths = [];
    state.players[0]!.animals = [];
    state.players[0]!.blindDeck = [];

    state = applyAction(state, { type: "continueExtinction" });

    assert.equal(state.players[0]!.hand.length, 0, "в мутациях нет обычной руки");
    assert.equal(state.players[0]!.blindDeck?.length, 10, "спасение выдаёт десять карт");
  });

  it("не создаёт повторно карту тела после случайной мутации", () => {
    // A14 и инвариант modules-audit.test.ts: карта, выложенная новым
    // видом, не должна оставаться в колоде или совпадать с другим телом.
    let state = createGame(2, "normal", 29, undefined, { randomMutations: true });
    const bodyCard = state.deck.pop()!;
    const mutationCard = state.deck.pop()!;
    state.players[0]!.animals = [animal("starter", 0)];
    state.players[0]!.animals[0]!.cardId = bodyCard.id;
    state.players[0]!.blindDeck = [mutationCard];
    state.currentPlayerId = 0;
    state.phase = "development";

    state = applyAction(state, { type: "devMutate", intent: "newAnimal" });

    const bodyIds = state.players.flatMap((player) => player.animals.map((candidate) => candidate.cardId));
    assert.equal(new Set(bodyIds).size, bodyIds.length, "карты тел уникальны");
    const stockIds = new Set([
      ...state.deck.map((card) => card.id),
      ...state.players.flatMap((player) => [...player.hand, ...(player.blindDeck ?? [])].map((card) => card.id)),
    ]);
    assert.equal(bodyIds.some((cardId) => stockIds.has(cardId)), false, "тело не остаётся в stock");
  });
});

describe("Правила владельца: сжатие колоды", () => {
  it("сохраняет каждое свойство, раздаёт карты всем и оставляет колоду после первого года", () => {
    // A09, F-A09-1 и F-A09-3: укорочение не должно выбрасывать целый
    // вид свойств или оставлять игрока без карт на первом году.
    const full = buildDeck(() => fixtureId("full-card"), undefined, 1);
    const fullProperties = new Set(full.flatMap((card) => card.faces));
    for (const deckSize of [20, 30, 40, 60, 84]) {
      for (const playerCount of [2, 3, 4, 5, 6, 7, 8]) {
        let state = createGame(playerCount, "normal", 1000 + deckSize + playerCount, undefined, {}, deckSize);
        const cards = [...state.deck, ...state.players.flatMap((player) => player.hand)];
        const properties = new Set(cards.flatMap((card) => card.faces));
        for (const property of fullProperties) {
          assert.ok(properties.has(property), `${deckSize}/${playerCount}: свойство ${property} не потеряно`);
        }
        for (const player of state.players) {
          assert.ok(player.hand.length > 0, `${deckSize}/${playerCount}: у игрока есть стартовые карты`);
        }

        for (let step = 0; step < playerCount + 2 && state.phase === "development"; step++) {
          state = applyAction(state, { type: "devPass" });
        }
        if (state.phase === "foodBank") {
          state = applyAction(state, { type: "rollFoodBank" });
          state = applyAction(state, { type: "beginFeeding" });
        }
        if (state.phase === "extinction") state = applyAction(state, { type: "continueExtinction" });
        assert.ok(state.deck.length > 0, `${deckSize}/${playerCount}: после первого года колода не пуста`);
      }
    }
  });
});

describe("Правила владельца: финальный счёт", () => {
  it("приносит одной парной карте «Симбиоз» одно очко в текущем и финальном счёте", () => {
    // A07, F-07-3: одна физическая карта пары не должна удваивать очки свойства.
    let state = gameWithAnimals([[animal("symbiont", 0), animal("host", 0)]]);
    state.phase = "development";
    state.currentPlayerId = 0;
    state.players[0]!.hand = [{ id: "symbiosis-card", faces: ["symbiosis" as TraitId] }];

    state = applyAction(state, {
      type: "devPlayPair",
      cardId: "symbiosis-card",
      face: 0,
      a: "symbiont",
      b: "host",
    });
    assert.equal(liveScore(state, 0), 5, "два животных (4) и одна парная карта (1)");

    state.phase = "extinction";
    state.lastYear = true;
    state.extinctionDeaths = [];
    state = applyAction(state, { type: "continueExtinction" });
    const score = state.scores?.find((entry) => entry.playerId === 0);
    assert.ok(score, "финальный счёт должен быть рассчитан");
    assert.equal(score.traits, 1, "пара — одна карта свойства, а не две");
    assert.equal(score.total, 5, "финальный итог пары равен 5, а не 6");
  });
});
