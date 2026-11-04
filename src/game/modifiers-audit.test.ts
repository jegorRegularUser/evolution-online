// Аудит волны 2: столовые правила и мутаторы (design-expansion-pack.md §1.1, §1.2).
// Культура modules-audit: точные оракулы, инварианты консервации, полный smoke
// с детерминированным реплеем и тест-гейт «бот знает активные модификаторы».
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyAction,
  baseFoodSpec,
  createGame,
  legalDefenseActions,
  legalDevActions,
  legalFeedActions,
  territoryFoodSpec,
} from "./engine.ts";
import { chooseAIAction } from "./ai.ts";
import { nextRandom } from "./rng.ts";
import {
  MODIFIER_SLOT_LIMIT,
  assertModifierCompatibility,
  modifierCompatibilityError,
  modifierSlotsUsed,
  mutatorList,
} from "./modifier-compatibility.ts";
import type { GameAction, GameState, MutatorId, TableRules } from "./types.ts";

const SEEDS = [7, 42, 20260917];

/** Прогнать фазу развития пасами (автопасы пустой руки движок делает сам). */
function passDev(g: GameState): GameState {
  let guard = 0;
  while (g.phase === "development" && guard++ < 64) {
    g = applyAction(g, { type: "devPass" });
  }
  return g;
}

/**
 * Довести год до конца вымирания. Фаза питания в этой модели кончается, когда
 * НИКОМУ нечего делать (feedTurn → endFeeding), поэтому для управляемой смерти
 * перед питанием можно обнулить банк (opts.bank) — тогда все ходы мгновенно
 * «пустые» и год сворачивается в вымирание.
 */
function runYear(g: GameState, opts: { bank?: number } = {}): GameState {
  g = passDev(g);
  if (g.phase === "foodBank") {
    g = applyAction(g, { type: "rollFoodBank" });
  }
  if (opts.bank !== undefined && g.phase === "foodBank") {
    g.foodBank = opts.bank;
    if (g.territoryFood) {
      for (const k of Object.keys(g.territoryFood) as Array<keyof typeof g.territoryFood>) {
        g.territoryFood[k] = 0;
      }
    }
    g = applyAction(g, { type: "beginFeeding" });
  }
  let guard = 0;
  while (g.phase !== "gameOver" && g.phase !== "development" && guard++ < 200) {
    if (g.phase === "foodBank") {
      g = applyAction(g, { type: "beginFeeding" });
      continue;
    }
    if (g.phase === "extinction") {
      g = applyAction(g, { type: "continueExtinction" });
      continue;
    }
    if (g.phase === "growth") {
      g = applyAction(g, { type: "continueGrowth" });
      continue;
    }
    if (g.phase === "feeding") {
      const legal = legalFeedActions(g, g.currentPlayerId);
      assert.ok(legal.some((a) => a.type === "feedEndTurn"), "feedEndTurn доступен всегда");
      g = applyAction(g, { type: "feedEndTurn" });
      continue;
    }
  }
  return g;
}

/** Кубики, которые выпадут из состояния state (расход ГПСЧ — на клоне). */
function nextDice(state: GameState, count: number): number[] {
  const probe = structuredClone(state);
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(1 + Math.floor(nextRandom(probe) * 6));
  return out;
}

describe("modifiers audit: совместимость и слоты", () => {
  it("лимит — 3 слота: правила, мутаторы и «Дикий мир» суммарно", () => {
    const one = { rules: { pack: true }, mutators: ["scavengers"] as MutatorId[], wildWorld: true };
    assert.equal(modifierSlotsUsed(one), 3);
    assert.equal(modifierCompatibilityError(one), null);
    const four = { rules: { pack: true, abundance: true }, mutators: ["scavengers"] as MutatorId[], wildWorld: true };
    assert.equal(modifierSlotsUsed(four), 4);
    assert.match(modifierCompatibilityError(four)!, /3 слота/);
    assert.match(modifierCompatibilityError(four, "en")!, /3 slots/);
    assert.equal(MODIFIER_SLOT_LIMIT, 3);
  });

  it("запрещённые пары: «Стая»×«Случайные мутации», «Голодный сезон»×«Изобилие»", () => {
    const pack = { modules: { randomMutations: true }, rules: { pack: true } };
    assert.match(modifierCompatibilityError(pack)!, /Стая.*несовместима/);
    assert.match(modifierCompatibilityError(pack, "en")!, /Pack.*cannot be combined/);
    const season = { rules: { hungrySeason: true, abundance: true } };
    assert.match(modifierCompatibilityError(season)!, /противоположные стороны/);
    assert.match(modifierCompatibilityError(season, "en")!, /opposite directions/);
    // Разрешённые сочетания на границах: hunger+continents, pack+wildWorld…
    assert.equal(modifierCompatibilityError({ rules: { hungrySeason: true }, modules: { continents: true } }), null);
    assert.equal(modifierCompatibilityError({ rules: { pack: true }, wildWorld: true }), null);
    // «Стая» без модуля мутаций легальна и занимает один слот.
    assert.equal(modifierSlotsUsed({ rules: { pack: true } }), 1);
  });

  it("проверка не мутирует конфиг и createGame отказывает на недопустимом", () => {
    const config = { rules: { pack: true, startHand: 9 as const }, mutators: ["rapidEvolution"] as MutatorId[] };
    const before = structuredClone(config);
    assert.equal(modifierSlotsUsed(config), 3, "pack + startHand + rapid = три слота");
    assert.equal(modifierCompatibilityError(config), null);
    assert.deepEqual(config, before, "конфиг никто не молча не правит");
    assert.throws(
      () =>
        createGame(2, "normal", 1, undefined, { randomMutations: true }, undefined, {
          rules: { pack: true },
        }),
      /несовместима/,
      "движок — источник истины: старт с запрещённой парой невозможен",
    );
  });

  it("mutatorList читает обе формы настроек (объект флагов и массив)", () => {
    assert.deepEqual(mutatorList({ scavengers: true, rapidEvolution: false }), ["scavengers"]);
    assert.deepEqual(mutatorList(["rapidEvolution"]), ["rapidEvolution"]);
    assert.deepEqual(mutatorList(undefined), []);
  });
});

describe("modifiers audit: столовые правила", () => {
  it("«Стая»: каждый начинает с двумя животными, колода консервативна", () => {
    for (const seed of SEEDS) for (const n of [2, 3]) {
      const g = createGame(n, "normal", seed, undefined, {}, undefined, { rules: { pack: true } });
      for (const p of g.players) {
        assert.equal(p.animals.length, 2, "два стартовых вида");
        for (const a of p.animals) {
          assert.equal(a.population ?? 1, 1);
          assert.equal(a.traits.length, 0, "стартовые виды без свойств");
        }
      }
      // 84 карты минус раздача (6 каждому) и минус два животных из колоды.
      assert.equal(g.deck.length, 84 - n * 6 - n * 2);
      const logText = g.log.map((l) => l.text).join("\n");
      assert.match(logText, /«Стая»/);
      assert.ok(g.log.every((l) => l.key), "каждая строка журнала машинчитаема");
    }
  });

  it("стартовая рука 7/8/9; с «Растениями» классика — 8, явный выбор бьёт модуль", () => {
    for (const hand of [7, 8, 9] as const) {
      const g = createGame(2, "normal", 5, undefined, {}, undefined, { rules: { startHand: hand } });
      for (const p of g.players) assert.equal(p.hand.length, hand);
      assert.equal(g.deck.length, 84 - 2 * hand);
    }
    const plants = createGame(2, "normal", 5, undefined, { plants: true });
    for (const p of plants.players) assert.equal(p.hand.length, 8, "классика «Растений»");
    const plantsHand = createGame(2, "normal", 5, undefined, { plants: true }, undefined, {
      rules: { startHand: 7 },
    });
    for (const p of plantsHand.players) assert.equal(p.hand.length, 7, "явное правило сильнее модуля");
  });

  it("«Голодный сезон»: база бросается дважды, берётся меньший (точный оракул)", () => {
    const seed = 11;
    // 2 игрока: 1 кубик +2 — ровно два броска по одному кубику.
    let g = createGame(2, "normal", seed, undefined, {}, undefined, { rules: { hungrySeason: true } });
    g = passDev(g);
    assert.equal(g.phase, "foodBank");
    const rolls = nextDice(g, 2);
    const lesser = Math.min(rolls[0]!, rolls[1]!);
    g = applyAction(g, { type: "rollFoodBank" });
    const spec = baseFoodSpec(2);
    assert.equal(g.foodBank, lesser + spec.bonus);
    assert.deepEqual(g.foodRoll, [lesser]);
    assert.match(g.log.map((l) => l.text).join("\n"), /броски \d+ и \d+ — берём меньший/);
    const hungryBank = g.foodBank;
    // Контроль: без правила по тому же сиду база равна одному броску.
    let base = createGame(2, "normal", seed);
    base = passDev(base);
    const d = nextDice(base, 1)[0]!;
    base = applyAction(base, { type: "rollFoodBank" });
    assert.equal(base.foodBank, d + spec.bonus);
    assert.ok(hungryBank! <= base.foodBank, "два броска не могут дать больше одного");
  });

  it("«Голодный сезон» с «Континентами»: каждая база брошена дважды", () => {
    const seed = 13;
    let g = createGame(2, "normal", seed, undefined, { continents: true }, undefined, {
      rules: { hungrySeason: true },
    });
    g = passDev(g);
    const spec = territoryFoodSpec(2);
    const dice = nextDice(g, 4);
    g = applyAction(g, { type: "rollFoodBank" });
    assert.equal(g.territoryFood!.laurasia, Math.min(dice[0]!, dice[1]!) + spec.laurasia.bonus);
    assert.equal(g.territoryFood!.gondwana, Math.min(dice[2]!, dice[3]!) + spec.gondwana.bonus);
    assert.equal(g.territoryFood!.ocean, spec.ocean);
    assert.equal(g.foodBank, g.territoryFood!.laurasia + g.territoryFood!.gondwana + spec.ocean);
  });

  it("«Изобилие»: +1 к базе; с «Континентами» — каждой бросаемой территории", () => {
    const seed = 17;
    let g = createGame(2, "normal", seed, undefined, {}, undefined, { rules: { abundance: true } });
    g = passDev(g);
    const d = nextDice(g, 1)[0]!;
    g = applyAction(g, { type: "rollFoodBank" });
    const spec = baseFoodSpec(2);
    assert.equal(g.foodBank, d + spec.bonus + 1);
    assert.match(g.log.map((l) => l.text).join("\n"), /«Изобилие»: \+1/);

    let cont = createGame(2, "normal", seed, undefined, { continents: true }, undefined, {
      rules: { abundance: true },
    });
    cont = passDev(cont);
    const spec2 = territoryFoodSpec(2);
    const dice = nextDice(cont, spec2.laurasia.dice + spec2.gondwana.dice);
    const lRaw = dice.slice(0, spec2.laurasia.dice).reduce((a, b) => a + b, 0);
    const gRaw = dice.slice(spec2.laurasia.dice).reduce((a, b) => a + b, 0);
    cont = applyAction(cont, { type: "rollFoodBank" });
    assert.equal(cont.territoryFood!.laurasia, lRaw + spec2.laurasia.bonus + 1);
    assert.equal(cont.territoryFood!.gondwana, gRaw + spec2.gondwana.bonus + 1);
    assert.equal(cont.territoryFood!.ocean, spec2.ocean, "Океан не бросается — константа");
    assert.equal(cont.foodBank, cont.territoryFood!.laurasia + cont.territoryFood!.gondwana + spec2.ocean);
  });
});

describe("modifiers audit: мутаторы", () => {
  it("«Падальщики»: вымершее животное возвращает владельцу карту из сброса", () => {
    const seed = 19;
    // «Стая» даёт стартовых животных (2 слота: pack+scavengers — легально).
    let g = createGame(2, "normal", seed, undefined, {}, undefined, {
      rules: { pack: true },
      mutators: ["scavengers"],
    });
    for (const p of g.players) for (const a of p.animals) a.food = 1;
    const victim = g.players[0]!.animals[0]!;
    victim.food = 0; // не накормлено — вымрет в конце года
    g.players[0]!.discardCount = 2;
    g.players[1]!.discardCount = 0;
    const deckBefore = g.deck.length;
    const handIds = new Set(g.players[0]!.hand.map((c) => c.id));
    g = runYear(g, { bank: 0 }); // без еды в базе никто не кормится — все «пасы»
    // Счёт сброса: было 2, труп жертвы лёг в сброс (+1), падальщики вернули
    // карту (−1) — нетто 2. Возвращённая карта видна в руке и в колоде ниже.
    assert.equal(g.players[0]!.discardCount, 2, "сброс: +труп жертвы, −возврат падальщикам");
    assert.equal(g.players[1]!.discardCount, 0, "пустой сброс — возвращать нечего");
    // Выжившие: у p0 один вид → добор «выжившие+1» = 2 карты; p1 — 3 карты.
    // Падальщики добавляют p0 одну карту сверх добора.
    assert.equal(g.deck.length, deckBefore - 1 - (2 + 3), "падальщики взяли карту из колоды");
    const fresh = g.players[0]!.hand.filter((c) => !handIds.has(c.id));
    assert.equal(fresh.length, 2 + 1, "в руке добор плюс возвращённая карта");
    assert.match(g.log.map((l) => l.text).join("\n"), /«Падальщики»/);
  });

  it("«Падальщики» со «Случайными мутациями»: карта на дно личной колоды", () => {
    let g = createGame(2, "normal", 23, undefined, { randomMutations: true }, undefined, {
      mutators: ["scavengers"],
    });
    for (const p of g.players) for (const a of p.animals) a.food = 1;
    const victim = g.players[0]!.animals[0]!;
    victim.food = 0;
    g.players[0]!.discardCount = 1;
    const blindBefore = g.players[0]!.blindDeck!.length;
    g = runYear(g, { bank: 0 });
    // 1 (было) + 1 (труп вида) − 1 (возврат падальщикам) = 1.
    assert.equal(g.players[0]!.discardCount, 1, "сброс: труп против возврата");
    assert.ok(
      g.players[0]!.blindDeck!.length > blindBefore,
      "личная колода выросла как минимум на возвращённую карту",
    );
    assert.match(g.log.map((l) => l.text).join("\n"), /«Падальщики»/);
  });

  it("«Ускоренная эволюция»: два действия развития за ход, пас счётчик не тратит", () => {
    let g = createGame(3, "hard", 29, undefined, {}, undefined, { mutators: ["rapidEvolution"] });
    const first = g.currentPlayerId;
    const a1 = chooseAIAction(g);
    assert.equal(a1?.type, "devPlayAnimal", "hard-бот начинает с животного");
    g = applyAction(g, a1!);
    assert.equal(g.currentPlayerId, first, "после первого действия ход остаётся");
    assert.equal(g.devActionsUsed, 1);
    const a2 = chooseAIAction(g);
    assert.notEqual(a2?.type, "devPass", "со вторым действием паситься рано");
    g = applyAction(g, a2!);
    assert.notEqual(g.currentPlayerId, first, "после второго действия ход уходит");
    assert.equal(g.devActionsUsed, 0, "счётчик сброшен новому игроку");
    // Пас первым действием сразу передаёт ход.
    let h = createGame(3, "hard", 31, undefined, {}, undefined, { mutators: ["rapidEvolution"] });
    h = applyAction(h, { type: "devPass" });
    assert.notEqual(h.currentPlayerId, first);
    assert.equal(h.devActionsUsed, 0);
  });

  it("без мутатора ход уходит после одного действия", () => {
    let g = createGame(3, "hard", 29);
    const first = g.currentPlayerId;
    const a1 = chooseAIAction(g);
    assert.equal(a1?.type, "devPlayAnimal");
    g = applyAction(g, a1!);
    assert.notEqual(g.currentPlayerId, first, "классика: одно действие за ход");
  });
});

describe("modifiers audit: бот знает модификаторы", () => {
  /** Стол с ручной позицией: у игрока 0 — pop животных, остальные пустые. */
  function aiState(
    ownAnimals: number,
    opts: { rules?: TableRules; mutators?: MutatorId[]; wildWorld?: boolean; seed?: number } = {},
  ): GameState {
    const g = createGame(2, "hard", opts.seed ?? 37, undefined, {}, undefined, {
      rules: opts.rules,
      mutators: opts.mutators,
      wildWorld: opts.wildWorld,
    });
    for (const p of g.players) {
      p.animals = [];
      p.hand = [];
    }
    for (let i = 0; i < ownAnimals; i++) {
      g.players[0]!.animals.push({
        id: `ai-a${i}`,
        ownerId: 0,
        cardId: `ai-body-${i}`,
        traits: [],
        food: 0,
        blueFood: 0,
        fatTokens: 0,
        hibernating: false,
        hibernatedLastYear: false,
        receivedFoodThisYear: false,
        poisoned: false,
        seed: i + 1,
      });
    }
    // «Паразит» в грани исключает отвлекающие варианты: цель только животное/пас.
    g.players[0]!.hand = [
      { id: "ai-c1", faces: ["parasite"] },
      { id: "ai-c2", faces: ["parasite"] },
    ];
    g.players[1]!.hand = [];
    g.currentPlayerId = 0;
    g.firstPlayerId = 0;
    return g;
  }

  it("«Голодный сезон»: бот не разводит животных сверх ужатой доли стола", () => {
    const base = aiState(2);
    const hungry = aiState(2, { rules: { hungrySeason: true } });
    const aBase = chooseAIAction(base);
    const aHungry = chooseAIAction(hungry);
    assert.equal(aBase?.type, "devPlayAnimal", "без правила доля стола позволяет третье животное");
    assert.equal(aHungry?.type, "devPass", "«Голодный сезон» — бот видит ужатую базу и пасует");
  });

  it("«Изобилие»: бот оценивает долю выше и держит больше животных", () => {
    // Прямая развилка: пограничное поголовье, где +1 к базе решает.
    const tight = aiState(3);
    const tightRich = aiState(3, { rules: { abundance: true } });
    const aTight = chooseAIAction(tight);
    const aRich = chooseAIAction(tightRich);
    assert.ok(
      aTight?.type !== "devPlayAnimal" && aRich?.type === "devPlayAnimal",
      `«Изобилие» подталкивает к животному: base=${aTight?.type} rich=${aRich?.type}`,
    );
  });

  it("«Дикий мир»: прогнозный «Метеорит» отбивает конверсию жира", () => {
    function fatState(withMeteorite: boolean): GameState {
      const g = createGame(2, "hard", 41);
      g.phase = "feeding";
      g.players[0]!.hand = [];
      g.players[0]!.animals = [
        {
          id: "fat-a",
          ownerId: 0,
          cardId: "fat-body",
          traits: [
            { id: "fat-t", cardId: "fat-card", type: "fatTissue", hidden: false, playSeq: 1 },
            { id: "hib-t", cardId: "hib-card", type: "hibernation", hidden: false, playSeq: 2 },
          ],
          food: 0,
          blueFood: 0,
          fatTokens: 1,
          hibernating: false,
          hibernatedLastYear: false,
          receivedFoodThisYear: false,
          poisoned: false,
          seed: 1,
        },
      ];
      g.players[1]!.animals = [];
      g.foodBank = 0;
      g.currentPlayerId = 0;
      g.firstPlayerId = 0;
      if (withMeteorite) {
        // Прогноз на следующий год: жир, отложенный сейчас, обложат.
        g.wildWorld = { active: null, planned: { year: g.year + 1, id: "meteorite" }, sinceMeteorite: 0 };
      }
      return g;
    }
    const plain = chooseAIAction(fatState(false));
    assert.equal(plain?.type, "feedConvertFat", "без метеорита конверсия жира выгодна");
    const warned = chooseAIAction(fatState(true));
    assert.notEqual(warned?.type, "feedConvertFat", "бот читает прогноз и не копит жир");
  });

  it("«Падальщики»: добыча вернёт хозяину карту — бот реже охотится", () => {
    function huntState(withScavengers: boolean): GameState {
      const g = createGame(2, "hard", 43, undefined, {}, undefined, {
        mutators: withScavengers ? ["scavengers"] : undefined,
      });
      g.phase = "feeding";
      g.players[0]!.hand = [];
      g.players[0]!.animals = [
        {
          id: "car",
          ownerId: 0,
          cardId: "car-body",
          traits: [{ id: "car-t", cardId: "car-card", type: "carnivore", hidden: false, playSeq: 1 }],
          food: 0,
          blueFood: 0,
          fatTokens: 0,
          hibernating: false,
          hibernatedLastYear: false,
          receivedFoodThisYear: false,
          poisoned: false,
          seed: 1,
        },
      ];
      g.players[1]!.animals = [
        {
          id: "prey",
          ownerId: 1,
          cardId: "prey-body",
          // Добыча без свойств: ценность 2 — охота выигрывает у взятки из базы
          // лишь на волос (11.4 против 10.2), штраф «Падальщиков» −1.5
          // переворачивает выбор (9.9 < 10.2).
          traits: [],
          food: 0,
          blueFood: 0,
          fatTokens: 0,
          hibernating: false,
          hibernatedLastYear: false,
          receivedFoodThisYear: false,
          poisoned: false,
          seed: 2,
        },
      ];
      g.foodBank = 2;
      g.currentPlayerId = 0;
      g.firstPlayerId = 0;
      return g;
    }
    const plain = chooseAIAction(huntState(false));
    assert.equal(plain?.type, "feedHunt", "без мутатора охота выгоднее");
    const softened = chooseAIAction(huntState(true));
    assert.equal(softened?.type, "feedTake", "«Падальщики»: бот учитывает возврат карты жертве");
  });

  it("«Ускоренная эволюция»: бот использует оба действия (см. тесты мутатора выше)", () => {
    // Поведенческий гейт покрыт в блоке мутатора: «два действия тому же игроку».
    assert.ok(true);
  });
});

describe("modifiers audit: полный smoke на трёх слотах", () => {
  const MAX_STEPS = 6000;

  function nextAction(g: GameState): GameAction {
    if (g.phase === "foodBank") return { type: g.foodRoll ? "beginFeeding" : "rollFoodBank" };
    if (g.phase === "extinction") return { type: "continueExtinction" };
    if (g.phase === "growth") return { type: "continueGrowth" };
    const legal = g.pendingAttack
      ? legalDefenseActions(g, g.pendingAttack.waitingFor)
      : g.phase === "development"
        ? legalDevActions(g, g.currentPlayerId)
        : legalFeedActions(g, g.currentPlayerId);
    const action = chooseAIAction(g);
    assert.ok(action, `нет хода: year=${g.year} phase=${g.phase}`);
    assert.ok(
      legal.some((a) => JSON.stringify(a) === JSON.stringify(action)),
      "бот не выдаёт нелегальных действий",
    );
    return action;
  }

  function invariants(g: GameState) {
    assert.ok(g.foodBank >= 0);
    assert.ok(g.deck.length >= 0);
    if (g.territoryFood) {
      assert.equal(
        g.foodBank,
        Object.values(g.territoryFood).reduce((a, b) => a + b, 0),
        "инвариант суммы территорий",
      );
    }
    const stock = [...g.deck, ...g.players.flatMap((p) => [...p.hand, ...(p.blindDeck ?? [])])];
    assert.equal(new Set(stock.map((c) => c.id)).size, stock.length, "карта не в двух местах");
    for (const p of g.players) {
      assert.ok(p.discardCount >= 0, "сброс не уходит в минус");
    }
    if (g.mutators?.includes("rapidEvolution")) {
      assert.ok((g.devActionsUsed ?? 0) <= 1, "запасных действий не больше одного");
    }
  }

  for (const seed of [7, 42]) {
    it(`3 слота: rapid+scavengers+wildWorld, seed=${seed}`, { timeout: 30_000 }, (t) => {
      const expansion = {
        mutators: ["rapidEvolution", "scavengers"] as MutatorId[],
        wildWorld: true,
      };
      assert.equal(modifierSlotsUsed(expansion), 3, "ровно лимит");
      let g = createGame(3, "normal", seed, undefined, {}, undefined, expansion);
      let replay = structuredClone(g);
      let step = 0;
      for (; g.phase !== "gameOver" && step < MAX_STEPS; step++) {
        const action = nextAction(g);
        assert.deepEqual(action, nextAction(replay), `реплей расходится на шаге ${step}`);
        g = applyAction(g, action);
        replay = applyAction(replay, action);
        invariants(g);
      }
      t.diagnostic(`steps=${step} year=${g.year}`);
      assert.equal(g.phase, "gameOver", "партия доигрывается до конца");
      assert.deepEqual(g, replay, "полный реплей детерминирован");
      assert.ok(
        g.log.some((l) => l.key?.startsWith("log.wild.")),
        "события оставляют след в журнале",
      );
    });
  }
});
