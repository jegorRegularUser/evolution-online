import { applyAction, createGame, legalDefenseActions, legalFeedActions, currentActor } from "../src/game/engine.ts";
import { chooseAIAction } from "../src/game/ai.ts";

let g = createGame(3, "normal", 304, undefined, { fungi: true, plants: true, continents: true });
let prev = g;
for (let i = 0; i < 20000 && g.phase !== "gameOver"; i++) {
  if (g.phase === "foodBank") {
    prev = g;
    g = applyAction(g, g.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" });
    continue;
  }
  if (g.phase === "extinction") {
    prev = g;
    g = applyAction(g, { type: "continueExtinction" });
    continue;
  }
  if (g.phase === "growth") {
    prev = g;
    g = applyAction(g, { type: "continueGrowth" });
    continue;
  }
  if (g.pendingAttack) {
    prev = g;
    const acts = legalDefenseActions(g, g.pendingAttack.waitingFor);
    g = applyAction(g, acts[0] ?? { type: "chooseDefense", kind: "none" });
    continue;
  }
  const act = chooseAIAction(g);
  if (!act) {
    console.log("NO ACTION at iter", i, "phase", g.phase, "current", g.currentPlayerId, "mad", g.madTurn, "rage", JSON.stringify(g.rageTurn));
    break;
  }
  prev = g;
  g = applyAction(g, act);
}
console.log("FINAL phase", g.phase, "iter-limit reached?", g.phase !== "gameOver");
if (g.phase === "feeding") {
  const actor = currentActor(g);
  console.log("actor", actor?.id, actor?.name, "isAI", actor?.isAI, "madTurn", g.madTurn);
  console.log("legal for current:", JSON.stringify(legalFeedActions(g, g.currentPlayerId).map((a) => a.type)));
  console.log("year", g.year, "players:", g.players.map((p) => ({ id: p.id, animals: p.animals.length, passed: p.passedFeed, marks: p.animals.map((a) => a.marks) })));
  console.log("turnUse", JSON.stringify(g.turnUse), "rageTurn", JSON.stringify(g.rageTurn));
  console.log("last log:", g.log.slice(-6).map((l) => l.text));
}
