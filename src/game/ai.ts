import { TRAITS } from "./traits.ts";
import type { Animal, GameAction, GameState } from "./types.ts";
import {
  legalDefenseActions,
  legalDevActions,
  legalFeedActions,
} from "./engine.ts";
import { nextRandom } from "./rng.ts";
import {
  animalValue,
  findAnimal,
  foodNeeded,
  hasTrait,
  isFed,
  player,
} from "./queries.ts";

/**
 * Случайность сложности берётся из состояния партии (nextRandom),
 * поэтому ходы ботов воспроизводимы по сиду вместе со всей игрой.
 */
function jitter(state: GameState): number {
  const r = nextRandom(state);
  if (state.difficulty === "easy") return (r - 0.5) * 8;
  if (state.difficulty === "normal") return (r - 0.5) * 2;
  return 0;
}

export function chooseAIAction(state: GameState): GameAction | null {
  if (state.pendingAttack) {
    const acts = legalDefenseActions(state, state.pendingAttack.waitingFor);
    if (!acts.length) return { type: "chooseDefense", kind: "none" };
    return pickDefense(state, acts);
  }
  if (state.phase === "development") {
    const acts = legalDevActions(state, state.currentPlayerId);
    return pickDev(state, acts);
  }
  if (state.phase === "feeding") {
    const acts = legalFeedActions(state, state.currentPlayerId);
    return pickFeed(state, acts);
  }
  return null;
}

function pickDefense(state: GameState, acts: GameAction[]): GameAction {
  const running = acts.find((a) => a.type === "chooseDefense" && a.kind === "running");
  if (running) return running;
  const mimic = acts
    .filter((a): a is Extract<GameAction, { type: "chooseDefense" }> => a.type === "chooseDefense" && a.kind === "mimicry")
    .sort((a, b) => {
      const va = animalValue(findAnimal(state, a.mimicryTargetId!)!);
      const vb = animalValue(findAnimal(state, b.mimicryTargetId!)!);
      return va - vb;
    });
  if (mimic[0]) return mimic[0];
  const tails = acts.filter(
    (a): a is Extract<GameAction, { type: "chooseDefense" }> => a.type === "chooseDefense" && a.kind === "tailLoss",
  );
  const prey = findAnimal(state, state.pendingAttack!.preyId);
  if (prey && tails.length) {
    const ranked = tails.slice().sort((a, b) => {
      const ta = prey.traits.find((t) => t.id === a.discardTraitId);
      const tb = prey.traits.find((t) => t.id === b.discardTraitId);
      // Отключённые свойства (шов под мутации) сбрасывать выгоднее всего.
      const sa = ta ? (ta.disabled ? -99 : (TRAITS[ta.type].aiValue ?? 1)) : 0;
      const sb = tb ? (tb.disabled ? -99 : (TRAITS[tb.type].aiValue ?? 1)) : 0;
      return sa - sb;
    });
    return ranked[0]!;
  }
  return acts.find((a) => a.type === "chooseDefense" && a.kind === "none") ?? acts[0]!;
}

function pickDev(state: GameState, acts: GameAction[]): GameAction {
  const p = player(state, state.currentPlayerId);
  let best = acts[0]!;
  let bestScore = -Infinity;
  for (const a of acts) {
    let s = 0;
    if (a.type === "devPass") {
      const keep = state.lastYear ? 0 : p.animals.length === 0 ? 0 : 1;
      s = p.hand.length <= keep ? 4 : p.hand.length <= 2 && !state.lastYear ? 1.5 : -1;
      if (p.animals.length === 0 && p.hand.length) s = -20;
    }
    if (a.type === "devPlayAnimal") {
      s = 6 - p.animals.length * 1.4;
      if (p.animals.length === 0) s = 14;
      if (state.lastYear) s = 8;
    }
    if (a.type === "devPlayTrait") {
      const card = p.hand.find((c) => c.id === a.cardId);
      const trait = card?.faces[a.face] ?? card?.faces[0];
      const animal = findAnimal(state, a.animalId);
      if (trait && animal) {
        s = (TRAITS[trait].aiValue ?? 2) + (animal.ownerId === p.id ? 1 : 0);
        if (trait === "parasite") {
          s = 7 + foodNeeded(animal) - (animal.ownerId === p.id ? 20 : 0);
          if (state.difficulty === "easy") s -= 3;
        }
        if (trait === "carnivore" && animal.ownerId === p.id) s += 3;
        if (trait === "fatTissue" && animal.ownerId === p.id) s += 2;
        if (state.lastYear) s += TRAITS[trait].scoreBonus * 2 + 1;
      }
    }
    if (a.type === "devPlayPair") {
      s = 5;
      if (state.lastYear) s += 2;
    }
    s += jitter(state);
    if (s > bestScore) {
      bestScore = s;
      best = a;
    }
  }
  return best;
}

function hunger(a: Animal): number {
  return Math.max(0, foodNeeded(a) - a.food);
}

function pickFeed(state: GameState, acts: GameAction[]): GameAction {
  const p = player(state, state.currentPlayerId);
  let best = acts[0]!;
  let bestScore = -Infinity;
  const myHungry = p.animals.filter((a) => !isFed(a)).length;
  const oppHungry = state.players
    .filter((x) => x.id !== p.id)
    .reduce((n, x) => n + x.animals.filter((a) => !isFed(a)).length, 0);

  for (const a of acts) {
    let s = 0;
    if (a.type === "feedTake") {
      const an = findAnimal(state, a.animalId)!;
      s = 10 + (3 - hunger(an)) + (hasTrait(an, "burrowing") ? 1.5 : 0);
      if (hasTrait(an, "carnivore") && hunger(an) <= 2) s -= 0.5;
    }
    if (a.type === "feedHunt") {
      const prey = findAnimal(state, a.preyId)!;
      const car = findAnimal(state, a.carnivoreId)!;
      s = animalValue(prey) + (prey.ownerId !== p.id ? 4 : -6);
      s += hunger(car) * 1.2;
      if (hasTrait(prey, "poisonous")) s -= 5;
      if (state.difficulty === "easy") s -= 4;
      if (state.difficulty === "hard" && prey.ownerId === 0) s += 2;
    }
    if (a.type === "feedPirate") {
      const pirate = findAnimal(state, a.pirateId)!;
      s = 6 + hunger(pirate);
    }
    if (a.type === "feedHibernate") {
      s = 5;
      if (state.foodBank > 3 && myHungry <= 1) s -= 2;
    }
    if (a.type === "feedConvertFat") {
      // Свободное действие: конверсия почти всегда выгодна, но не срочно.
      s = 7;
    }
    if (a.type === "feedGraze") {
      // Топтун тратит ход: полезен, только если соперники голоднее нас.
      s = oppHungry > myHungry ? 2.5 : -1;
      if (state.foodBank <= 1) s -= 1;
    }
    if (a.type === "feedSkip") {
      s = myHungry === 0 ? 4 : -3;
    }
    s += jitter(state);
    if (s > bestScore) {
      bestScore = s;
      best = a;
    }
  }
  return best;
}
