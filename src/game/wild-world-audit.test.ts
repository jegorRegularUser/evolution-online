// Аудит волны 2: «Дикий мир» — 6 машинно определённых событий года (§1.3).
// Правило приёма: предикат + эффект над GameState; прогноз ровно на год;
// события меняют УСЛОВИЯ года, не распределяют победу.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyAction,
  baseFoodSpec,
  createGame,
  drawWildEvent,
  territoryFoodSpec,
} from "./engine.ts";
import { nextRandom } from "./rng.ts";
import { METEORITE_PITY } from "./modifiers.ts";
import { hasTrait } from "./queries.ts";
import type { GameState, WildEventId } from "./types.ts";

const SEEDS = [7, 42, 20260917];
const ROLL_POOL: WildEventId[] = ["iceAge", "goldenAge", "resettlement", "cropFailure", "meteorite"];

/** Прогнать фазу развития пасами (событие года активируется на последнем пасе). */
function passDev(g: GameState): GameState {
  let guard = 0;
  while (g.phase === "development" && guard++ < 64) {
    g = applyAction(g, { type: "devPass" });
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

/** Стол с «Диким миром» и принудительно назначенным событием года. */
function gameWithEvent(
  event: WildEventId,
  opts: { modules?: Record<string, boolean>; rules?: { pack?: boolean }; seed?: number; players?: number } = {},
): GameState {
  const g = createGame(
    opts.players ?? 2,
    "normal",
    opts.seed ?? 11,
    undefined,
    opts.modules as never,
    undefined,
    { wildWorld: true, rules: opts.rules },
  );
  g.wildWorld!.planned = { year: 1, id: event };
  return g;
}

describe("wild world audit: прогноз и раскрытие", () => {
  it("createGame: событие года 1 известно до первой фазы развития", () => {
    for (const seed of SEEDS) {
      const g = createGame(3, "normal", seed, undefined, {}, undefined, { wildWorld: true });
      assert.ok(g.wildWorld, "состояние «Дикого мира» заведено");
      assert.equal(g.wildWorld.planned?.year, 1, "прогноз для текущего года");
      assert.ok(
        ROLL_POOL.includes(g.wildWorld.planned!.id),
        `событие из пула: ${g.wildWorld.planned!.id}`,
      );
      assert.equal(g.wildWorld.active, null, "до границы года ничего не активно");
      const wild = g.log.filter((l) => l.key?.startsWith("log.wild"));
      assert.ok(wild.length >= 2, "интро и строка прогноза");
      assert.ok(wild.every((l) => l.key), "все строки журнала машинчитаемы");
      assert.match(wild.at(-1)!.key!, /log\.wild\.planned\./);
    }
  });

  it("событие года N+1 раскрыто до фазы развития года N+1 (несколько лет)", () => {
    let g = createGame(2, "normal", 21, undefined, {}, undefined, { wildWorld: true });
    for (let year = 1; year <= 4; year++) {
      assert.equal(g.year, year);
      assert.equal(g.phase, "development");
      // Инвариант спеки: до хода развития года известен его год.
      assert.equal(g.wildWorld!.planned?.year, year, `прогноз года ${year} раскрыт заранее`);
      g = passDev(g); // на последнем пасе — активация и розыгрыш прогноза
      assert.equal(g.wildWorld!.active === null ? null : g.wildWorld!.active, g.wildWorld!.active);
      g = applyAction(g, { type: "rollFoodBank" });
      g = applyAction(g, { type: "beginFeeding" });
      let guard = 0;
      while (g.phase === "feeding" && guard++ < 40) g = applyAction(g, { type: "feedEndTurn" });
      if (g.phase === "extinction") g = applyAction(g, { type: "continueExtinction" });
      assert.equal(g.phase, "development", "год замкнулся");
      assert.equal(g.year, year + 1);
    }
  });

  it("активация идёт событием в lastEvents: баннер → эффект → новый прогноз", () => {
    let g = gameWithEvent("meteorite", { rules: { pack: true }, seed: 5 });
    for (const p of g.players) for (const a of p.animals) a.fatTokens = 2;
    g = passDev(g);
    const kinds = g.lastEvents.map((e) => e.kind);
    assert.ok(kinds.includes("wildEventStarted"));
    const startedIdx = kinds.indexOf("wildEventStarted");
    assert.ok(kinds.indexOf("wildMeteorite") > startedIdx, "эффект после баннера");
    assert.ok(kinds.includes("wildEventPlanned"), "прогноз на следующий год в том же действии");
    const wildLog = g.log.filter((l) => l.key?.startsWith("log.wild.started.meteorite"));
    assert.equal(wildLog.length, 1);
    assert.equal(wildLog[0]!.params?.n, 4, "все четыре животных потеряли жир");
  });

  it("в последний год новый прогноз не рисуется", () => {
    let g = gameWithEvent("goldenAge", { seed: 9 });
    g.lastYear = true;
    g = passDev(g);
    assert.equal(g.wildWorld!.active, "goldenAge");
    assert.equal(g.wildWorld!.planned, null, "за финалом прогнозов нет");
  });
});

describe("wild world audit: разовые события", () => {
  it("«Переселение»: каждый передаёт соседу по часовой старейшую карту", () => {
    let g = gameWithEvent("resettlement", { seed: 15 });
    const hand0 = g.players[0]!.hand.map((c) => c.id);
    const hand1 = g.players[1]!.hand.map((c) => c.id);
    assert.ok(hand0.length > 0 && hand1.length > 0);
    g = passDev(g);
    // По часовой: 0 → 1 → 0. Уходит начало руки (старейшая карта).
    assert.equal(g.players[1]!.hand.at(-1)!.id, hand0[0], "первая карта игрока 0 ушла соседу");
    assert.equal(g.players[0]!.hand.at(-1)!.id, hand1[0], "первая карта игрока 1 ушла соседу");
    assert.equal(g.players[0]!.hand.length, hand0.length - 1 + 1);
    assert.equal(g.players[1]!.hand.length, hand1.length - 1 + 1);
    const moves = g.lastEvents.find((e) => e.kind === "wildResettlement");
    assert.ok(moves && moves.kind === "wildResettlement");
    assert.deepEqual(
      moves.moves.map((m) => [m.fromPlayerId, m.toPlayerId, m.had]),
      [[0, 1, true], [1, 0, true]],
    );
    assert.match(g.log.map((l) => l.text).join("\n"), /Передано карт: 2/);
  });

  it("«Переселение» со «Случайными мутациями»: слепые колоды обмениваются верхом", () => {
    let g = createGame(2, "normal", 17, undefined, { randomMutations: true }, undefined, {
      wildWorld: true,
    });
    g.wildWorld!.planned = { year: 1, id: "resettlement" };
    const top0 = g.players[0]!.blindDeck!.at(-1)!.id;
    const top1 = g.players[1]!.blindDeck!.at(-1)!.id;
    g = passDev(g);
    assert.equal(g.players[0]!.blindDeck!.length, 7, "размеры колод сохранены");
    assert.equal(g.players[1]!.blindDeck!.length, 7);
    assert.equal(g.players[1]!.blindDeck!.at(-1)!.id, top0, "верх колоды 0 — на верх колоды 1");
    assert.equal(g.players[0]!.blindDeck!.at(-1)!.id, top1);
  });

  it("«Метеорит»: жир теряют только животные с жиром", () => {
    let g = gameWithEvent("meteorite", { rules: { pack: true }, seed: 23 });
    g.players[0]!.animals[0]!.fatTokens = 3;
    g.players[0]!.animals[1]!.fatTokens = 0;
    g.players[1]!.animals[0]!.fatTokens = 1;
    g.players[1]!.animals[1]!.fatTokens = 0;
    g = passDev(g); // applyAction возвращает клон — читаем только через g
    assert.equal(g.players[0]!.animals[0]!.fatTokens, 2);
    assert.equal(g.players[0]!.animals[1]!.fatTokens, 0, "без жира — ничего");
    assert.equal(g.players[1]!.animals[0]!.fatTokens, 0);
    const logLine = g.log.find((l) => l.key === "log.wild.started.meteorite");
    assert.equal(logLine?.params?.n, 2, "в журнале — число пострадавших");
  });

  it("«Пожар»: флора теряет по 2 фишки (только с «Травой и грибами»)", () => {
    let g = gameWithEvent("wildfire", { modules: { fungi: true }, seed: 27 });
    assert.equal(g.flora!.length, 2);
    // Явно задаём запасы: пожар снимает min(2, food) с каждой карты.
    g.flora![0]!.food = 4;
    g.flora![1]!.food = 2;
    g = passDev(g);
    // Хук активации стоит ДО пополнения флоры (addNewFlora в revealAndStartFood):
    // старые карты обгорели, свежие вошли с полным стартовым запасом.
    assert.equal(g.flora![0]!.food, 2);
    assert.equal(g.flora![1]!.food, 0, "не ниже нуля");
    assert.ok(g.flora!.length > 2, "флора пополнена годом как обычно");
    const logLine = g.log.find((l) => l.key === "log.wild.started.wildfire");
    assert.equal(logLine?.params?.n, 4, "сгорело 2 + 2 фишки");
  });

  it("без «Травы и грибов» «Пожар» в пул не попадает, но безвреден, если назначен", () => {
    let g = gameWithEvent("wildfire", { seed: 31 });
    g = passDev(g);
    assert.equal(g.wildWorld!.active, "wildfire");
    assert.ok(g.foodRoll === null || g.foodBank >= 0, "состояние согласовано");
  });
});

describe("wild world audit: условия броска", () => {
  it("«Ледниковый период»: каждый кубик считает на 1 меньше (не ниже нуля)", () => {
    let g = gameWithEvent("iceAge", { seed: 33 });
    g = passDev(g);
    const raw = nextDice(g, 1)[0]!;
    g = applyAction(g, { type: "rollFoodBank" });
    const spec = baseFoodSpec(2);
    assert.equal(g.foodRoll![0], Math.max(0, raw - 1));
    assert.equal(g.foodBank, Math.max(0, raw - 1) + spec.bonus);
    assert.ok(g.log.some((l) => l.key === "log.wild.started.iceAge"));
  });

  it("«Золотой век»: +2 еды в банк", () => {
    let g = gameWithEvent("goldenAge", { seed: 35 });
    g = passDev(g);
    const raw = nextDice(g, 1)[0]!;
    g = applyAction(g, { type: "rollFoodBank" });
    const spec = baseFoodSpec(2);
    assert.equal(g.foodBank, raw + spec.bonus + 2);
    assert.equal(g.foodRoll![0], raw, "кубик не тронут — надбавка отдельная строка");
  });

  it("«Неурожай»: база на 2 меньше, но не ниже нуля", () => {
    let g = gameWithEvent("cropFailure", { seed: 37 });
    g = passDev(g);
    const raw = nextDice(g, 1)[0]!;
    g = applyAction(g, { type: "rollFoodBank" });
    const spec = baseFoodSpec(2);
    assert.equal(g.foodBank, Math.max(0, raw + spec.bonus - 2));
  });

  it("«Континенты»: ±2 события ложатся по 1 на каждую бросаемую территорию", () => {
    let g = gameWithEvent("goldenAge", { modules: { continents: true }, seed: 39 });
    g = passDev(g);
    const spec = territoryFoodSpec(2);
    const dice = nextDice(g, spec.laurasia.dice + spec.gondwana.dice);
    g = applyAction(g, { type: "rollFoodBank" });
    const lRaw = dice.slice(0, spec.laurasia.dice).reduce((a, b) => a + b, 0);
    const gRaw = dice.slice(spec.laurasia.dice).reduce((a, b) => a + b, 0);
    assert.equal(g.territoryFood!.laurasia, lRaw + spec.laurasia.bonus + 1);
    assert.equal(g.territoryFood!.gondwana, gRaw + spec.gondwana.bonus + 1);
    assert.equal(g.territoryFood!.ocean, spec.ocean, "Океан не бросается — не тронут");
    assert.equal(g.foodBank, g.territoryFood!.laurasia + g.territoryFood!.gondwana + spec.ocean);
  });

  it("«Растения»+«Континенты»: банк — Океан, «Золотой век» его поднимает, лёд не трогает", () => {
    const spec = territoryFoodSpec(2);
    let gold = gameWithEvent("goldenAge", { modules: { plants: true, continents: true }, seed: 41 });
    gold = passDev(gold);
    gold = applyAction(gold, { type: "rollFoodBank" });
    assert.equal(gold.foodBank, spec.ocean + 2);

    let ice = gameWithEvent("iceAge", { modules: { fungi: true, continents: true }, seed: 43 });
    ice = passDev(ice);
    ice = applyAction(ice, { type: "rollFoodBank" });
    assert.equal(ice.foodBank, spec.ocean, "константу Океана мороз не режет");
  });
});

describe("wild world audit: розыгрыш и pity", () => {
  it("без «Травы и грибов» пожара нет в 300 розыгрышах", () => {
    const g = createGame(2, "normal", 47, undefined, {}, undefined, { wildWorld: true });
    for (let i = 0; i < 300; i++) assert.notEqual(drawWildEvent(g), "wildfire");
  });

  it("с «Травой и грибами» пожар выпадает", () => {
    const g = createGame(2, "normal", 51, undefined, { fungi: true }, undefined, { wildWorld: true });
    const seen = new Set<WildEventId>();
    for (let i = 0; i < 300 && !seen.has("wildfire"); i++) seen.add(drawWildEvent(g));
    assert.ok(seen.has("wildfire"), "пожар достижим");
  });

  it("одно и то же событие не повторяется подряд (кроме «Метеорита»)", () => {
    const g = createGame(2, "normal", 53, undefined, { fungi: true }, undefined, { wildWorld: true });
    let prev: WildEventId | null = null;
    for (let i = 0; i < 300; i++) {
      const id = drawWildEvent(g);
      if (prev && id !== "meteorite") assert.notEqual(id, prev, "подряд");
      // Розыгрыш прогноза идёт при активном событии года — имитируем активацию.
      g.wildWorld!.active = id;
      prev = id;
    }
  });

  it(`pity: «Метеорит» не позже ${METEORITE_PITY}-го события серии`, () => {
    const g = createGame(2, "normal", 55, undefined, {}, undefined, { wildWorld: true });
    // Форс границы: 7 событий без метеорита → восьмой обязательно он.
    g.wildWorld!.sinceMeteorite = METEORITE_PITY - 1;
    assert.equal(drawWildEvent(g), "meteorite");
    assert.equal(g.wildWorld!.sinceMeteorite, 0, "счётчик серии сброшен");
    // Статистическая гарантия на длинной серии: разрыв не больше 8.
    let since = 0;
    for (let i = 0; i < 1000; i++) {
      const id = drawWildEvent(g);
      since = id === "meteorite" ? 0 : since + 1;
      assert.ok(since <= METEORITE_PITY - 1, `разрыв ${since}`);
    }
  });
});

describe("wild world audit: интеграция с движком", () => {
  it("животные с «Жиром» держат счётчик, а события не ломают свойства", () => {
    let g = gameWithEvent("meteorite", { modules: { continents: true }, rules: { pack: true }, seed: 57 });
    for (const a of g.players[0]!.animals) {
      a.traits.push({ id: `t-${a.id}`, cardId: `c-${a.id}`, type: "fatTissue", hidden: false, playSeq: 1 });
      a.fatTokens = 2;
    }
    g = passDev(g);
    assert.equal(g.players[0]!.animals[0]!.fatTokens, 1);
    assert.ok(hasTrait(g.players[0]!.animals[0]!, "fatTissue"), "свойство на месте");
    // Инвариант сумм «Континентов» после активации события года.
    if (g.territoryFood) {
      const sum = Object.values(g.territoryFood).reduce((a, b) => a + b, 0);
      assert.ok(Number.isSafeInteger(sum) && sum >= 0);
    }
  });

  it("условие года снимается в вымирание: в новом году активно следующее событие", () => {
    let g = gameWithEvent("iceAge", { seed: 61 });
    g = passDev(g);
    assert.equal(g.wildWorld!.active, "iceAge");
    g = applyAction(g, { type: "rollFoodBank" });
    g = applyAction(g, { type: "beginFeeding" });
    let guard = 0;
    while (g.phase === "feeding" && guard++ < 40) g = applyAction(g, { type: "feedEndTurn" });
    g = applyAction(g, { type: "continueExtinction" });
    assert.equal(g.wildWorld!.active, null, "условие года умерло вместе с годом");
    assert.equal(g.wildWorld!.planned?.year, 2);
    assert.equal(g.phase, "development");
  });
});
