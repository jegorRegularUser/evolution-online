import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TUTORIAL_MISSIONS,
  absorbState,
  makeMissionProgress,
  missionComplete,
} from "./tutorial.ts";
import type { GameEvent, GameState } from "./types.ts";

/** Минимальный срез GameState: абсорбция читает eventSeq, lastEvents,
 *  humanId, players, year — остальное не трогает. */
function fakeState(opts: {
  eventSeq: number;
  events: GameEvent[];
  humanId?: number;
  myTraits?: number;
  year?: number;
}): GameState {
  return {
    eventSeq: opts.eventSeq,
    lastEvents: opts.events,
    humanId: opts.humanId ?? 0,
    year: opts.year ?? 1,
    players: [
      {
        id: 0,
        name: "Ученик",
        animals: opts.myTraits === undefined ? [] : [{ id: "a1", traits: Array(opts.myTraits).fill(null) }],
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
