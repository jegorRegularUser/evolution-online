import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGame } from "../../game/engine.ts";
import { viewFor } from "./views.ts";
import type { GameState } from "../../game/types.ts";

function seeded(): GameState {
  return createGame(3, "normal", 777, [
    { name: "A", isAI: false },
    { name: "B", isAI: false },
    { name: "Бот", isAI: true },
  ]);
}

/** Детерминированная заготовка: у игрока 1 животное со скрытым паразитом. */
function withHidden(): GameState {
  const s = seeded();
  s.players[1]!.animals.push({
    id: "a1",
    ownerId: 1,
    cardId: "c9",
    traits: [{ id: "t1", cardId: "c9", type: "parasite", hidden: true, playSeq: 5 }],
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: 1,
  });
  return s;
}

describe("viewFor", () => {
  it("колода: только счётчик; humanId = место", () => {
    const full = seeded();
    const v = viewFor(full, 0);
    assert.deepEqual(v.deck, []);
    assert.equal(v.deckCount, full.deck.length);
    assert.equal(v.humanId, 0);
    assert.equal(viewFor(full, 2).humanId, 2);
  });

  it("своя рука цела, чужие — пустые массивы с handCount", () => {
    const full = seeded();
    const v = viewFor(full, 1);
    assert.equal(v.players[1]!.hand.length, full.players[1]!.hand.length);
    assert.equal(v.players[1]!.handCount, full.players[1]!.hand.length);
    assert.deepEqual(v.players[0]!.hand, []);
    assert.equal(v.players[0]!.handCount, full.players[0]!.hand.length);
  });

  it("скрытое свойство чужого теряет тип, своё — сохраняет", () => {
    const full = withHidden();
    const t = full.players[1]!.animals[0]!.traits[0]!;
    assert.equal(t.hidden, true);
    const other = viewFor(full, 0).players[1]!.animals[0]!.traits[0]!;
    assert.notEqual(other.type, "parasite");
    const owner = viewFor(full, 1).players[1]!.animals[0]!.traits[0]!;
    assert.equal(owner.type, "parasite");
  });

  it("чужое скрытое размещение свойства обезличено в lastEvents", () => {
    const full = withHidden();
    full.lastEvents = [{ kind: "traitPlaced", animalId: "a1", type: "parasite", hidden: true }];
    const v = viewFor(full, 0);
    const e = v.lastEvents[0]!;
    assert.ok(e.kind === "traitPlaced" && e.type !== "parasite");
    const own = viewFor(full, 1).lastEvents[0]!;
    assert.ok(own.kind === "traitPlaced" && own.type === "parasite");
  });
});
