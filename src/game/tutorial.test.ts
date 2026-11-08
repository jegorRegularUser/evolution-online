import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TUTORIAL_MISSIONS,
  absorbState,
  loadActiveMission,
  makeMissionProgress,
  missionComplete,
  saveActiveMission,
  seedProgressFromStats,
} from "./tutorial.ts";
import type { GameEvent, GameRunStats, GameState, TraitId } from "./types.ts";

/** Заглушка localStorage: в Node его нет, в браузере — есть. */
function stubStorage() {
  const map = new Map<string, string>();
  const store = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    clear: () => void map.clear(),
  };
  (globalThis as { localStorage?: typeof store }).localStorage = store;
  return store as Storage & { clear: () => void };
}

/** Валидный срез свойства: абсорбция (isFed/foodNeeded) читает type/hidden/disabled. */
function trait(type: TraitId) {
  return { id: `i-${type}`, cardId: `c-${type}`, type, hidden: false, disabled: false, paralyzed: false, playSeq: 0 };
}

/** Минимальный срез GameState: абсорбция читает eventSeq, lastEvents,
 *  humanId, players, year — остальное не трогает. */
function fakeState(opts: {
  eventSeq: number;
  events: GameEvent[];
  humanId?: number;
  myTraits?: number;
  /** Полный контроль над своим стадом: свойства и сытое питание. */
  myAnimals?: Array<{ id: string; traits?: TraitId[]; food?: number }>;
  year?: number;
  stats?: GameRunStats;
}): GameState {
  const animals = opts.myAnimals
    ? opts.myAnimals.map((a) => ({
        id: a.id,
        cardId: `card-${a.id}`,
        traits: (a.traits ?? []).map(trait),
        food: a.food ?? 0,
        blueFood: 0,
        fatTokens: 0,
        hibernating: false,
        poisoned: false,
        seed: 1,
      }))
    : opts.myTraits === undefined
      ? []
      : [{ id: "a1", cardId: "card-a1", traits: Array(opts.myTraits).fill(trait("swimming")), food: 0, blueFood: 0, fatTokens: 0, hibernating: false, poisoned: false, seed: 1 }];
  return {
    eventSeq: opts.eventSeq,
    lastEvents: opts.events,
    humanId: opts.humanId ?? 0,
    year: opts.year ?? 1,
    ...(opts.stats ? { stats: opts.stats } : {}),
    players: [
      {
        id: 0,
        name: "Ученик",
        animals,
      },
      { id: 1, name: "Бот", animals: [] },
    ],
  } as unknown as GameState;
}

describe("учебные миссии: прогресс", () => {
  it("абсорбция идемпотентна по eventSeq: дубль кадра не двигает счётчики", () => {
    const p = makeMissionProgress();
    const s = fakeState({
      eventSeq: 5,
      events: [
        { kind: "animalPlaced", animalId: "a1", ownerId: 0 } as GameEvent,
        { kind: "traitPlaced", animalId: "a1", type: "swimming", hidden: false } as GameEvent,
      ],
    });
    absorbState(p, s);
    absorbState(p, s);
    absorbState(p, s);
    assert.equal(p.placedAnimals, 1);
    assert.equal(p.placedTraits, 1);
    assert.deepEqual(p.events.length, 2);
  });

  it("чужие действия не засчитываются: animalPlaced от бота — не моё животное", () => {
    const p = makeMissionProgress();
    absorbState(
      p,
      fakeState({
        eventSeq: 1,
        events: [{ kind: "animalPlaced", animalId: "a9", ownerId: 1 } as GameEvent],
      }),
    );
    assert.equal(p.placedAnimals, 0);
  });

  it("жир, конфликт и «Падальщики» ловятся по событиям", () => {
    const p = makeMissionProgress();
    absorbState(
      p,
      fakeState({
        eventSeq: 2,
        events: [
          { kind: "foodToFat", animalId: "a1" } as GameEvent,
          { kind: "defenseUsed", defense: "running", roll: 3, preyId: "a1" } as GameEvent,
          { kind: "scavenged", playerId: 0, animalId: "a2" } as GameEvent,
        ],
      }),
    );
    assert.equal(p.fatStored, true);
    assert.equal(p.survivedOrHunted, true);
    assert.equal(p.scavengedSeen, true);
  });

  it("максимум свойств — по срезу состояния, а не по событиям", () => {
    const p = makeMissionProgress();
    absorbState(p, fakeState({ eventSeq: 1, events: [], myTraits: 3 }));
    absorbState(p, fakeState({ eventSeq: 2, events: [], myTraits: 1 }));
    assert.equal(p.maxTraitsOnAnimal, 3, "монотонный максимум, а не текущее значение");
  });

  it("событийная история обрезается потолком (600)", () => {
    const p = makeMissionProgress();
    for (let i = 1; i <= 700; i++) {
      absorbState(p, fakeState({ eventSeq: i, events: [{ kind: "passed", playerId: 0 } as GameEvent] }));
    }
    assert.ok(p.events.length <= 600);
  });
});

describe("учебные миссии: определения", () => {
  it("цели миссии «Первые шаги» не выполнены на старте и выполнены по прогрессу", () => {
    const m = TUTORIAL_MISSIONS.firstSteps;
    const p = makeMissionProgress();
    assert.equal(missionComplete(m, p), false);
    p.placedAnimals = 1;
    p.placedTraits = 2;
    p.year = 2;
    assert.equal(missionComplete(m, p), true);
  });

  it("у каждой миссии ровно 3 цели, ключи целей из словаря tutorial.obj.*", () => {
    for (const m of Object.values(TUTORIAL_MISSIONS)) {
      assert.equal(m.objectives.length, 3, m.id);
      const ids = new Set(m.objectives.map((o) => o.id));
      assert.equal(ids.size, m.objectives.length, "цели уникальны внутри миссии");
      for (const o of m.objectives) {
        assert.ok(o.textKey.startsWith("tutorial.obj."), o.textKey);
      }
    }
  });

  it("миссия «Дикий мир» включает мутатор и «Дикий мир» в настройках стола", () => {
    const m = TUTORIAL_MISSIONS.wildWorld;
    assert.equal(m.wildWorld, true);
    assert.equal(m.mutators?.scavengers, true);
  });
});

describe("учебные миссии: активная миссия переживает F5", () => {
  it("save → load возвращает ту же запись; null стирает", () => {
    const storage = stubStorage();
    assert.equal(loadActiveMission(), null);
    saveActiveMission({ id: "hunger", code: "ABCD" });
    assert.deepEqual(loadActiveMission(), { id: "hunger", code: "ABCD" });
    saveActiveMission(null);
    assert.equal(storage.getItem("evo-tutorial-active"), null);
    assert.equal(loadActiveMission(), null);
  });

  it("битая запись не роняет чтение и читается как null (самолечение)", () => {
    stubStorage();
    const raw = (key: string, v: string) => globalThis.localStorage.setItem(key, v);
    raw("evo-tutorial-active", "{not json");
    assert.equal(loadActiveMission(), null);
    raw("evo-tutorial-active", '"строка вместо объекта"');
    assert.equal(loadActiveMission(), null);
    raw("evo-tutorial-active", JSON.stringify({ id: "не-миссия", code: "ABCD" }));
    assert.equal(loadActiveMission(), null);
    raw("evo-tutorial-active", JSON.stringify({ id: "hunger", code: 42 }));
    assert.deepEqual(loadActiveMission(), { id: "hunger", code: null }, "чужой тип кода → null-код");
  });
});

describe("учебные миссии: посев прогресса из stats партии", () => {
  it("seed переносит серверные метрики в прогресс (после F5 цели не стартуют с нуля)", () => {
    const p = makeMissionProgress();
    seedProgressFromStats(
      p,
      fakeState({
        eventSeq: 7,
        events: [],
        year: 3,
        stats: {
          preyEaten: 2,
          defended: 1,
          fatStored: 3,
          traitsPlaced: 5,
          animalsPlaced: 2,
          animalsLost: 1,
          maxTraitsOnAnimal: 3,
          scavenges: 1,
          wildYearsSurvived: 0,
          games: 0,
          wins: 0,
          bestPlace: 99,
          winsModule: {},
        },
      }),
    );
    assert.equal(p.placedAnimals, 2);
    assert.equal(p.placedTraits, 5);
    assert.equal(p.fatStored, true);
    assert.equal(p.survivedOrHunted, true);
    assert.equal(p.maxTraitsOnAnimal, 3);
    assert.equal(p.scavengedSeen, true);
    assert.equal(p.animalsLost, 1);
    assert.equal(p.year, 3);
  });

  it("seed не двигает счётчики при отсутствии stats и не откатывает максимум", () => {
    const p = makeMissionProgress();
    p.maxTraitsOnAnimal = 4;
    p.placedAnimals = 2;
    seedProgressFromStats(p, fakeState({ eventSeq: 1, events: [] }));
    assert.equal(p.maxTraitsOnAnimal, 4);
    assert.equal(p.placedAnimals, 2);
    seedProgressFromStats(
      p,
      fakeState({
        eventSeq: 2,
        events: [],
        stats: {
          preyEaten: 0,
          defended: 0,
          fatStored: 0,
          traitsPlaced: 1,
          animalsPlaced: 1,
          animalsLost: 0,
          maxTraitsOnAnimal: 2,
          scavenges: 0,
          wildYearsSurvived: 0,
          games: 0,
          wins: 0,
          bestPlace: 99,
          winsModule: {},
        },
      }),
    );
    assert.equal(p.maxTraitsOnAnimal, 4, "максимум — монотонный");
    assert.equal(p.placedAnimals, 2, "счётчики — максимум из своего и seeded");
  });
});

describe("учебные миссии: срезы стада (кампания «Рост»)", () => {
  it("maxFedAnimals: сыты одновременно; новый год обнуляет еду, но не максимум", () => {
    const p = makeMissionProgress();
    absorbState(
      p,
      fakeState({
        eventSeq: 1,
        events: [],
        myAnimals: [
          { id: "a1", traits: [], food: 1 },
          { id: "a2", traits: [], food: 1 },
          { id: "a3", traits: [], food: 0 },
        ],
      }),
    );
    assert.equal(p.maxFedAnimals, 2, "накормлены двое из трёх");
    absorbState(
      p,
      fakeState({
        eventSeq: 2,
        events: [],
        myAnimals: [
          { id: "a1", traits: [], food: 1 },
          { id: "a2", traits: [], food: 1 },
          { id: "a3", traits: [], food: 1 },
        ],
      }),
    );
    assert.equal(p.maxFedAnimals, 3, "в этот год сыты все трое");
    absorbState(
      p,
      fakeState({
        eventSeq: 3,
        events: [],
        myAnimals: [{ id: "a1", traits: [], food: 0 }],
      }),
    );
    assert.equal(p.maxFedAnimals, 3, "максимум не откатывается");
  });

  it("maxDistinctHerds: разные наборы — разные виды; одинаковые и пустые не считаются", () => {
    const p = makeMissionProgress();
    absorbState(
      p,
      fakeState({
        eventSeq: 1,
        events: [],
        myAnimals: [
          { id: "a1", traits: ["swimming"] },
          { id: "a2", traits: ["swimming"] },
          { id: "a3", traits: [] },
        ],
      }),
    );
    assert.equal(p.maxDistinctHerds, 1, "дубликат набора — один вид, пустое не считается");
    absorbState(
      p,
      fakeState({
        eventSeq: 2,
        events: [],
        myAnimals: [
          { id: "a1", traits: ["swimming"] },
          { id: "a2", traits: ["tailLoss"] },
          { id: "a3", traits: ["swimming"] },
        ],
      }),
    );
    assert.equal(p.maxDistinctHerds, 2, "водоплавающее и хвостатое — два вида");
    assert.equal(p.maxFedAnimals, 0, "еда не тронута — голодные животные");
  });
});
