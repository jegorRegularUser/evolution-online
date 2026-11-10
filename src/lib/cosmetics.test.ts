import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cosmeticsPatchNeedsOwnership } from "./cosmetics.ts";

describe("cosmetics ownership routing", () => {
  it("keeps free seat cosmetics on the anonymous room path", () => {
    for (const patch of [
      {},
      { avatar: null },
      { avatar: "sci.darwin" },
      { cardback: null },
      { cardback: "cardback.classic" },
      { avatar: "sci.baer", cardback: "cardback.classic" },
    ]) {
      assert.equal(cosmeticsPatchNeedsOwnership(patch), false, JSON.stringify(patch));
    }
  });

  it("requires a profile for paid or unknown cosmetic ids", () => {
    for (const patch of [
      { avatar: "avatar.aquatic" },
      { cardback: "cardback.crimson" },
      { avatar: "sci.darwin", cardback: "cardback.malachite" },
      { avatar: "avatar.unknown" },
      { cardback: "cardback.unknown" },
    ]) {
      assert.equal(cosmeticsPatchNeedsOwnership(patch), true, JSON.stringify(patch));
    }
  });
});
