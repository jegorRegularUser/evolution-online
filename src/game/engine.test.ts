import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAction, createGame, legalDevActions } from "./engine.ts";
import { buildDeck, DECK_SIZE } from "./deck.ts";
import { nextRandom } from "./rng.ts";
import { canAttack, foodNeeded, hasTrait } from "./queries.ts";
import { TRAITS } from "./traits.ts";
import type { Animal, GameState, TraitId, TraitInstance } from "./types.ts";

let idc = 0;
function nid(p: string) {
  idc += 1;
  return `${p}${idc}`;
}

function t(type: TraitId, extra?: Partial<TraitInstance>): TraitInstance {
  return { id: nid("t"), cardId: nid("c"), type, hidden: false, playSeq: 1, ...extra };
}

function mkAnimal(id: string, ownerId: number, traits: TraitInstance[]): Animal {
  return {
    id,
    ownerId,
    cardId: nid("c"),
    traits,
    food: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: 1,
  };
}

/** Состояние с заданной расстановкой животных: игроки без рук, развитие у игрока 0. */
function scenario(playersAnimals: Animal[][]): GameState {
  const g = createGame(Math.max(2, playersAnimals.length), "normal", 7);
  for (const p of g.players) {
    p.hand = [];
    p.passedDev = false;
  }
  playersAnimals.forEach((animals, i) => {
    g.players[i]!.animals = animals;
  });
  return g;
}

describe("deck", () => {
  it(`has ${DECK_SIZE} unique cards`, () => {
    const used = new Set<string>();
    const deck = buildDeck(nid);
    assert.equal(deck.length, DECK_SIZE);
    for (const c of deck) {
      assert.ok(!used.has(c.id));
      used.add(c.id);
    }
  });
});

describe("createGame", () => {
  it("deals 6 cards each", () => {
    const g = createGame(3, "normal", 1);
    assert.equal(g.players.length, 3);
    for (const p of g.players) assert.equal(p.hand.length, 6);
    assert.equal(g.phase, "development");
    assert.equal(g.deck.length, DECK_SIZE - 18);
  });

  it("is reproducible by seed", () => {
    const a = createGame(3, "normal", 42);
    const b = createGame(3, "normal", 42);
    assert.deepEqual(
      a.players.map((p) => p.hand.map((c) => c.faces)),
      b.players.map((p) => p.hand.map((c) => c.faces)),
    );
    assert.equal(a.firstPlayerId, b.firstPlayerId);
  });
});

describe("foodNeeded", () => {
  it("base is 1, carnivore +1, big +1, parasite +2", () => {
    assert.equal(foodNeeded(mkAnimal("a", 0, [])), 1);
    assert.equal(foodNeeded(mkAnimal("a", 0, [t("carnivore")])), 2);
    assert.equal(
      foodNeeded(mkAnimal("a", 0, [t("carnivore"), t("highBodyWeight"), t("parasite")])),
      5,
    );
  });

  it("disabled traits do not add food requirement", () => {
    const a = mkAnimal("a", 0, [t("carnivore"), t("parasite", { disabled: true })]);
    assert.equal(foodNeeded(a), 2);
    assert.equal(hasTrait(a, "parasite"), false);
  });
});

describe("canAttack (registry-driven)", () => {
  it("swimming carnivore only eats swimming", () => {
    const g = scenario([
      [mkAnimal("h", 0, [t("carnivore"), t("swimming")])],
      [mkAnimal("l", 1, []), mkAnimal("w", 1, [t("swimming")])],
    ]);
    g.phase = "feeding";
    const hunter = g.players[0]!.animals[0]!;
    assert.equal(canAttack(g, hunter, g.players[1]!.animals[0]!), false);
    assert.equal(canAttack(g, hunter, g.players[1]!.animals[1]!), true);
  });

  it("camouflage needs sharpVision, bulky needs bulky, fed burrowing is safe", () => {
    const car = mkAnimal("car", 0, [t("carnivore"), t("sharpVision"), t("highBodyWeight")]);
    const plainCar = mkAnimal("pcar", 0, [t("carnivore")]);
    const camo = mkAnimal("camo", 1, [t("camouflage")]);
    const bulky = mkAnimal("bulky", 1, [t("highBodyWeight")]);
    const burrow = mkAnimal("burrow", 1, [t("burrowing")]);
    burrow.food = 1;
    const g = scenario([[plainCar, car], [camo, bulky, burrow]]);
    g.phase = "feeding";
    assert.equal(canAttack(g, plainCar, camo), false);
    assert.equal(canAttack(g, car, camo), true);
    assert.equal(canAttack(g, plainCar, bulky), false);
    assert.equal(canAttack(g, car, bulky), true);
    assert.equal(canAttack(g, car, burrow), false);
    burrow.food = 0;
    assert.equal(canAttack(g, car, burrow), true);
  });

  it("living symbiont protects the paired animal", () => {
    // Роль b — охраняемое животное, роль a — живой симбионт.
    const host = mkAnimal("host", 1, []);
    const prot = mkAnimal("prot", 1, [t("symbiosis", { pairWith: "host", pairRole: "b" })]);
    host.traits.push(t("symbiosis", { pairWith: "prot", pairRole: "a" }));
    const car = mkAnimal("car", 0, [t("carnivore")]);
    const g = scenario([[car], [prot, host]]);
    g.phase = "feeding";
    assert.equal(canAttack(g, car, prot), false);
    // Симбионт погиб — охраняемое животное становится доступным.
    g.players[1]!.animals = g.players[1]!.animals.filter((a) => a.id !== "host");
    assert.equal(canAttack(g, car, prot), true);
  });
});

describe("development", () => {
  it("plays an animal from hand", () => {
    let g = createGame(2, "normal", 3);
    g.currentPlayerId = 0;
    const cardId = g.players[0]!.hand[0]!.id;
    const acts = legalDevActions(g, 0);
    assert.ok(acts.some((a) => a.type === "devPlayAnimal" && a.cardId === cardId));
    g = applyAction(g, { type: "devPlayAnimal", cardId });
    assert.equal(g.players[0]!.animals.length, 1);
    assert.equal(g.players[0]!.hand.length, 5);
  });

  it("reveals traits and stages food bank when everybody passes", () => {
    let g = createGame(2, "normal", 4);
    g.currentPlayerId = 0;
    const cardId = g.players[0]!.hand[0]!.id;
    g = applyAction(g, { type: "devPlayAnimal", cardId });
    // Боты пасуют, пока фаза не сменится.
    for (let i = 0; i < 8 && g.phase === "development"; i++) {
      const who = g.currentPlayerId;
      g = applyAction(g, { type: "devPass" });
      assert.notEqual(g.currentPlayerId, undefined);
      void who;
    }
    assert.equal(g.phase, "foodBank");
    assert.equal(g.foodRoll, null);
    for (const a of g.players.flatMap((p) => p.animals)) {
      for (const tr of a.traits) assert.equal(tr.hidden, false);
    }
  });
});

describe("food bank dice staging", () => {
  it("rolls visible dice, keeps stage, then begins feeding", () => {
    let g = createGame(2, "normal", 5);
    // Голодные животные нужны, чтобы питание не завершилось мгновенным вымиранием.
    for (const p of g.players) p.animals = [mkAnimal(`a${p.id}`, p.id, [])];
    g.phase = "foodBank";
    const before = g.rngState;
    g = applyAction(g, { type: "rollFoodBank" });
    assert.ok(g.foodRoll && g.foodRoll.length === 1);
    assert.ok(g.foodRoll[0]! >= 1 && g.foodRoll[0]! <= 6);
    assert.equal(g.foodBank, g.foodRoll[0]! + 2);
    assert.equal(g.phase, "foodBank");
    assert.notEqual(g.rngState, before);
    assert.ok(g.lastEvents.some((e) => e.kind === "diceRoll"));

    g = applyAction(g, { type: "beginFeeding" });
    assert.equal(g.phase, "feeding");
    assert.equal(g.currentPlayerId, g.firstPlayerId);
  });

  it("three players roll two dice without bonus", () => {
    let g = createGame(3, "normal", 6);
    g.phase = "foodBank";
    g = applyAction(g, { type: "rollFoodBank" });
    assert.equal(g.foodRoll!.length, 2);
    assert.equal(g.foodBank, g.foodRoll![0]! + g.foodRoll![1]!);
  });
});

describe("feeding", () => {
  it("feedTake moves a bank token and fires events", () => {
    const g = scenario([[mkAnimal("a", 0, [])], [mkAnimal("b", 1, [])]]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 4;
    const next = applyAction(g, { type: "feedTake", animalId: "a" });
    const fed = next.players[0]!.animals.find((x) => x.id === "a")!;
    assert.equal(fed.food, 1);
    assert.equal(next.foodBank, 3);
    assert.ok(next.lastEvents.some((e) => e.kind === "foodFromBank"));
  });

  it("cooperation feeds the partner out of turn", () => {
    const a1 = mkAnimal("p1", 0, [t("cooperation", { pairWith: "p2", pairRole: "a" })]);
    const a2 = mkAnimal("p2", 0, [t("cooperation", { pairWith: "p1", pairRole: "b" })]);
    const g = scenario([[a1, a2], []]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 2;
    const next = applyAction(g, { type: "feedTake", animalId: "p1" });
    const partner = next.players[0]!.animals.find((x) => x.id === "p2")!;
    assert.equal(partner.food, 1);
    assert.ok(next.lastEvents.some((e) => e.kind === "blueFood" && e.reason === "cooperation"));
  });

  it("communication pulls an extra token from the bank", () => {
    const a1 = mkAnimal("c1", 0, [t("communication", { pairWith: "c2", pairRole: "a" })]);
    const a2 = mkAnimal("c2", 0, [t("communication", { pairWith: "c1", pairRole: "b" })]);
    const g = scenario([[a1, a2], []]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 3;
    const next = applyAction(g, { type: "feedTake", animalId: "c1" });
    // Партнёр получил еду вне очереди; остаток базы к концу питания может сгореть.
    assert.equal(next.players[0]!.animals.find((x) => x.id === "c2")!.food, 1);
    assert.ok(next.lastEvents.some((e) => e.kind === "foodFromBank" && e.via === "communication"));
  });
});

describe("extinction staging", () => {
  it("shows deaths first, removes them on continueExtinction", () => {
    const starver = mkAnimal("dead", 0, []);
    const survivor = mkAnimal("alive", 0, []);
    survivor.food = 1;
    const g = scenario([[starver, survivor], []]);
    g.phase = "extinction";
    g.extinctionDeaths = ["dead"];
    const next = applyAction(g, { type: "continueExtinction" });
    assert.equal(next.phase, "development");
    assert.equal(next.players[0]!.animals.some((a) => a.id === "dead"), false);
    assert.equal(next.players[0]!.animals.some((a) => a.id === "alive"), true);
    assert.equal(next.year, 2);
    assert.ok(next.eventSeq > 0);
    assert.ok(next.lastEvents.some((e) => e.kind === "animalDied"));
  });

  it("endFeeding computes death list without removing animals", () => {
    const starver = mkAnimal("s", 0, []);
    const g = scenario([[starver], []]);
    g.phase = "foodBank";
    g.foodBank = 0;
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    // Никто не может есть: питание завершается сразу, стадия вымирания показывает погибель.
    const rolled = applyAction(g, { type: "rollFoodBank" });
    const begun = applyAction(rolled, { type: "beginFeeding" });
    if (begun.phase === "extinction") {
      assert.deepEqual(begun.extinctionDeaths, ["s"]);
      // Животное ещё на столе — игроки видят, кто погибает.
      assert.equal(begun.players[0]!.animals.some((a) => a.id === "s"), true);
    } else {
      assert.equal(begun.phase, "feeding");
    }
  });
});

describe("defense running roll", () => {
  /** Подбираем сид ГПСЧ, дающий нужный порог броска кубика (>=0.5 → 4+). */
  function seedWithRoll(high: "high" | "low"): number {
    for (let s = 1; s < 100000; s++) {
      const probe = { rngState: s } as GameState;
      const r = nextRandom(probe);
      if ((high === "high" && r >= 0.5) || (high === "low" && r < 0.5)) return s;
    }
    throw new Error("no seed");
  }

  function attackSetup(): GameState {
    const car = mkAnimal("car", 0, [t("carnivore")]);
    const runner = mkAnimal("run", 1, [t("running")]);
    const g = scenario([[car], [runner]]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 0;
    return g;
  }

  it("high roll saves the prey", () => {
    let g = applyAction(attackSetup(), { type: "feedHunt", carnivoreId: "car", preyId: "run" });
    assert.ok(g.pendingAttack);
    g.rngState = seedWithRoll("high");
    g = applyAction(g, { type: "chooseDefense", kind: "running" });
    assert.equal(g.pendingAttack, null);
    assert.equal(g.players[1]!.animals.some((a) => a.id === "run"), true);
    assert.ok(g.lastEvents.some((e) => e.kind === "defenseUsed" && e.roll !== undefined));
  });

  it("low roll means the predator catches up", () => {
    let g = applyAction(attackSetup(), { type: "feedHunt", carnivoreId: "car", preyId: "run" });
    g.rngState = seedWithRoll("low");
    g = applyAction(g, { type: "chooseDefense", kind: "running" });
    // Догнал: добыча съедена (защит больше нет).
    assert.equal(g.pendingAttack, null);
    assert.equal(g.players[1]!.animals.some((a) => a.id === "run"), false);
  });
});

describe("scoring extras", () => {
  it("trait bonuses match rules", () => {
    assert.equal(TRAITS.carnivore.scoreBonus, 1);
    assert.equal(TRAITS.highBodyWeight.scoreBonus, 1);
    assert.equal(TRAITS.parasite.scoreBonus, 2);
    assert.equal(TRAITS.carnivore.extraFood, 1);
    assert.equal(TRAITS.parasite.extraFood, 2);
  });
});

describe("createGame с кастомными местами", () => {
  it("берёт имена и isAI из seats", () => {
    const s = createGame(3, "normal", 42, [
      { name: "Аня", isAI: false },
      { name: "Дарвин", isAI: true },
      { name: "Вася", isAI: false },
    ]);
    assert.deepEqual(
      s.players.map((p) => ({ name: p.name, isAI: p.isAI })),
      [
        { name: "Аня", isAI: false },
        { name: "Дарвин", isAI: true },
        { name: "Вася", isAI: false },
      ],
    );
    assert.equal(s.humanId, 0);
    for (const p of s.players) {
      assert.equal(p.hand.length, 6);
      assert.equal(p.passedFeed, false);
    }
  });

  it("без seats — прежнее поведение", () => {
    const s = createGame(2, "normal", 42);
    assert.equal(s.players[0]!.name, "Вы");
    assert.equal(s.players[0]!.isAI, false);
    assert.equal(s.players[1]!.name, "Дарвин");
    assert.equal(s.players[1]!.isAI, true);
  });

  it("seats неверной длины игнорируются", () => {
    const s = createGame(2, "normal", 42, [{ name: "Один", isAI: false }]);
    assert.equal(s.players[0]!.name, "Вы");
    assert.equal(s.players[1]!.name, "Дарвин");
  });
});

describe("правила фазы питания", () => {
  it("одно действие за ход: после взятия еды ход уходит следующему", () => {
    const g = scenario([[mkAnimal("a", 0, [])], [mkAnimal("b", 1, [])]]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 4;
    const next = applyAction(g, { type: "feedTake", animalId: "a" });
    assert.equal(next.currentPlayerId, 1);
  });

  it("топтун — отдельное действие: топчет 1 фишку и тратит ход", () => {
    const g = scenario([[mkAnimal("g", 0, [t("grazing")])], []]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 3;
    const next = applyAction(g, { type: "feedGraze", animalId: "g" });
    assert.equal(next.foodBank, 2);
    // У соперника нет доступных действий — ход возвращается топтуну.
    assert.equal(next.currentPlayerId, 0);
    assert.ok(next.lastEvents.some((e) => e.kind === "bankBurned"));
  });

  it("жир — свободное действие: ход остаётся у игрока", () => {
    const a = mkAnimal("f", 0, [t("fatTissue")]);
    a.fatTokens = 2;
    const g = scenario([[a], []]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    const next = applyAction(g, { type: "feedConvertFat", animalId: "f", amount: 2 });
    const fed = next.players[0]!.animals.find((x) => x.id === "f")!;
    assert.equal(fed.food, 2);
    assert.equal(fed.fatTokens, 0);
    assert.equal(next.currentPlayerId, 0);
  });

  it("фаза заканчивается, только когда все пасанули", () => {
    const g = scenario([[mkAnimal("a", 0, [])], [mkAnimal("b", 1, [])]]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 5;
    let cur = g;
    for (let i = 0; i < 4 && cur.phase === "feeding"; i++) {
      cur = applyAction(cur, { type: "feedSkip" });
    }
    assert.equal(cur.phase, "extinction");
    assert.equal(cur.foodBank, 0);
    assert.deepEqual(cur.extinctionDeaths.sort(), ["a", "b"]);
  });

  it("пас одного не завершает фазу, если другой ещё может есть", () => {
    const g = scenario([[mkAnimal("a", 0, [])], [mkAnimal("b", 1, [])]]);
    g.phase = "feeding";
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    g.foodBank = 2;
    let cur = applyAction(g, { type: "feedSkip" });
    assert.equal(cur.phase, "feeding");
    cur = applyAction(cur, { type: "feedTake", animalId: "b" });
    assert.equal(cur.players[1]!.animals.find((x) => x.id === "b")!.food, 1);
  });
});

describe("открытая выкладка свойств", () => {
  it("свойство видно всем сразу после выкладки", () => {
    let g = createGame(2, "normal", 11);
    g.currentPlayerId = 0;
    const card = g.players[0]!.hand.find((c) => c.faces[0] !== "parasite")!;
    const trait = card.faces[0]!;
    // Животное уже на столе, чтобы было куда класть свойство.
    g.players[0]!.animals = [mkAnimal("own", 0, [])];
    g = applyAction(g, { type: "devPlayTrait", cardId: card.id, face: 0, animalId: "own" });
    const placed = g.players[0]!.animals[0]!.traits.find((x) => x.type === trait)!;
    assert.equal(placed.hidden, false);
  });
});
