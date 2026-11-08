import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TUTORIAL_MISSIONS, absorbState, makeMissionProgress, missionComplete, type MissionProgress } from "./tutorial.ts";
import { CAMPAIGN_MISSIONS } from "./campaign.ts";

/**
 * Миссия «Камбрийский рост» (#5): раньше она переиспользовала все цели обучения
 * «Первые шаги» и была его клоном. Теперь — самостоятельный сценарий
 * «прокорми стадо + разведи разнородное стадо», предикаты живут в tutorial.ts
 * (общий аккумулятор MissionProgress), здесь — только их поведение.
 */

/** Срез состояния с одним своим животным (остальное абсорбция не читает). */
function frame(
  progress: MissionProgress,
  eventSeq: number,
  animals: Array<{ traits?: string[]; food?: number }>,
  year = 1,
): void {
  absorbState(
    progress,
    {
      eventSeq,
      lastEvents: [],
      humanId: 0,
      year,
      players: [
        {
          id: 0,
          name: "Естествоиспытатель",
          animals: animals.map((a, i) => ({
            id: `a${i + 1}`,
            cardId: `card-a${i + 1}`,
            traits: (a.traits ?? []).map((type) => ({
              id: `i-${type}`,
              cardId: `c-${type}`,
              type,
              hidden: false,
              disabled: false,
              paralyzed: false,
              playSeq: 0,
            })),
            food: a.food ?? 0,
            blueFood: 0,
            fatTokens: 0,
            hibernating: false,
            poisoned: false,
            seed: 1,
          })),
        },
        { id: 1, name: "Бот", animals: [] },
      ],
    } as unknown as Parameters<typeof absorbState>[1],
  );
}

describe("кампания «Эры»: миссия «Камбрийский рост»", () => {
  it("это не клон «Первых шагов»: общая с учебной миссией — максимум одна цель", () => {
    const growth = CAMPAIGN_MISSIONS["cambrian-growth"];
    const firstStepsKeys = new Set(TUTORIAL_MISSIONS.firstSteps.objectives.map((o) => o.textKey));
    const shared = growth.objectives.filter((o) => firstStepsKeys.has(o.textKey));
    assert.ok(shared.length <= 1, `сценарий повторяет ${shared.length} цели «Первых шагов»`);
    const ids = new Set(growth.objectives.map((o) => o.id));
    assert.equal(ids.size, growth.objectives.length, "цели уникальны внутри миссии");
  });

  it("цели «Роста» не выполнены на старте партии", () => {
    const m = CAMPAIGN_MISSIONS["cambrian-growth"];
    assert.equal(missionComplete(m, makeMissionProgress()), false);
  });

  it("«прокорми стадо»: сыты одновременно трое — еда обнуляется, максимум остаётся", () => {
    const p = makeMissionProgress();
    frame(p, 1, [{ food: 1 }, { food: 1 }, { food: 0 }]);
    const m = CAMPAIGN_MISSIONS["cambrian-growth"];
    const fed = m.objectives.find((o) => o.id === "fedHerd")!;
    assert.equal(fed.done(p), false);
    frame(p, 2, [{ food: 1 }, { food: 1 }, { food: 1 }]);
    assert.equal(fed.done(p), true);
    frame(p, 3, [{ food: 0 }]);
    assert.equal(fed.done(p), true, "год сменился, максимум не откатился");
  });

  it("«разнородное стадо»: два вида с разными наборами свойств", () => {
    const p = makeMissionProgress();
    const m = CAMPAIGN_MISSIONS["cambrian-growth"];
    const distinct = m.objectives.find((o) => o.id === "distinctHerd")!;
    frame(p, 1, [{ traits: ["swimming"] }, { traits: ["swimming"] }]);
    assert.equal(distinct.done(p), false, "дубль набора — один вид");
    frame(p, 2, [{ traits: ["swimming"] }, { traits: ["tailLoss"] }]);
    assert.equal(distinct.done(p), true);
  });

  it("миссия закрывается только всеми тремя целями сразу (стадо + год)", () => {
    const m = CAMPAIGN_MISSIONS["cambrian-growth"];
    const p = makeMissionProgress();
    frame(p, 1, [
      { traits: ["swimming"], food: 1 },
      { traits: ["tailLoss"], food: 1 },
    ]);
    // year >= 2 ещё нет — миссия не закрыта, хоть стадо и готово.
    assert.equal(missionComplete(m, p), false);
    frame(p, 2, [
      { traits: ["swimming"], food: 1 },
      { traits: ["tailLoss"], food: 1 },
      { traits: [], food: 1 },
    ], 2);
    assert.equal(missionComplete(m, p), true);
  });
});
