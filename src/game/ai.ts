import { TRAITS } from "./traits.ts";
import { PLANTS } from "./plants.ts";
import { FLORA } from "./flora.ts";
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

  hasMark,
  hasTrait,
  isCarnivoreLike,
  isFed,
  player,
  speciesNeed,
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
    if (state.pendingAttack.choosingPlantDefense) return acts[0]!;
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

/**
 * Сколько еды достанется одному игроку в этом году (ожидание).
 * Точный бросок будет позже — в фазе кормовой базы, — поэтому считаем по числу
 * игроков и модулям. Без этой оценки бот разводил животных больше, чем стол
 * прокормит, и вымирал в ноль: в партиях на 2–3 игроков все смерти приходились
 * на полностью опустошённую базу.
 */
function expectedBank(state: GameState): number {
  const n = state.players.length;
  // «Континенты»: сумма трёх территорий (2 игрока — 8/7/5, 3 — 11/10/7, 4 — 14/13/9).
  if (state.modules.continents) return n === 2 ? 20 : n === 3 ? 28 : 36;
  // «Растения»/«Трава и грибы»: часть еды лежит на картах флоры, база меньше.
  if (state.modules.plants || state.modules.fungi) return 6 + n;
  if (n === 2) return 3.5 + 2; // 1 кубик + 2
  if (n === 3) return 7; // 2 кубика
  return 7 + 2; // 4+ игроков — 2 кубика + 2
}

/** Свободная доля стола: сколько еды остаётся «на меня» сверх текущей популяции. */
function foodSurplus(state: GameState, p: GameState["players"][number]): number {
  const share = expectedBank(state) / Math.max(1, state.players.length);
  const need = p.animals.reduce((sum, a) => sum + speciesNeed(a), 0);
  return share - need;
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
  // «Случайные мутации»: карты в слепой колоде, а не в руке.
  const stock = state.modules.randomMutations ? (p.blindDeck?.length ?? 0) : p.hand.length;
  // Доля стола: если популяция уже съедает свою долю еды, лишние животные
  // обречены на голод — и бот терял всё поголовье подряд.
  const surplus = foodSurplus(state, p);
  let best = acts[0]!;
  let bestScore = -Infinity;
  for (const a of acts) {
    let s = 0;
    if (a.type === "devPass") {
      const keep = state.lastYear ? 0 : p.animals.length === 0 ? 0 : 1;
      s = stock <= keep ? 4 : stock <= 2 && !state.lastYear ? 1.5 : -1;
      if (p.animals.length === 0 && stock) s = -20;
    }
    if (a.type === "devPlayAnimal") {
      s = 6 - p.animals.length * 1.4;
      if (p.animals.length === 0) s = 14;
      if (state.lastYear) s = 8;
      // Третье и далее животное при дефиците еды — штраф (в последний год
      // очки важнее риска, там штраф не применяем).
      if (surplus <= 0 && !state.lastYear) s -= 5;
      // «Континенты»: бот расселяет по континентам — предпочитает менее населённый,
      // а если в руке есть водоплавающая грань, животное всё равно попадёт в океан.
      if (a.zoneId) {
        const inZone = p.animals.filter((x) => x.zoneId === a.zoneId).length;
        s -= inZone * 0.6;
        const card = p.hand.find((c) => c.id === a.cardId);
        if (card?.faces.includes("swimming")) s += 0.5; // уйдёт в океан — там свободнее
      }
    }
    // «Случайные мутации»: объявление розыгрыша верхней карты слепой колоды.
    if (a.type === "devMutate") {
      if (a.intent === "newAnimal") {
        s = 6 - p.animals.length * 1.4;
        if (p.animals.length === 0) s = 14;
        if (state.lastYear) s = 8;
        if (a.zoneId) {
          const inZone = p.animals.filter((x) => x.zoneId === a.zoneId).length;
          s -= inZone * 0.6;
        }
      }
      if (a.intent === "trait") {
        // Свойство вслепую: умеренно выгодно, лучше — на пустой вид
        // (там любая мутация ляжет) и в поздние годы (очки важнее риска).
        const target = a.animalId ? findAnimal(state, a.animalId) : undefined;
        s = 4;
        if (target) {
          s += (3 - Math.min(3, target.traits.length)) * 0.8;
          if (target.traits.some((t) => t.disabled)) s -= 1;
        }
        if (state.lastYear) s += 1.5;
      }
      if (a.intent === "population") {
        // +1 животное выгодно сильному виду (хорошая еда/защита) и в последний год.
        const target = a.animalId ? findAnimal(state, a.animalId) : undefined;
        s = 3;
        if (target) {
          const worth = target.traits.reduce((v, t) => v + (TRAITS[t.type]?.aiValue ?? 0), 0);
          s += Math.max(0, Math.min(6, worth)) * 0.5;
          if (target.traits.some((t) => t.type === "budding")) s += 2;
        }
        if (state.lastYear) s += 3;
      }
      if (a.intent === "plant") {
        // Свойство растения вслепую: помогает столу, но очков не даёт.
        s = 2.2;
        if (state.lastYear) s -= 2;
      }
    }
    if (a.type === "devPlayTrait") {
      const card = p.hand.find((c) => c.id === a.cardId);
      const trait = card?.faces[a.face] ?? card?.faces[0];
      const animal = findAnimal(state, a.animalId);
      if (trait && animal) {
        s = (TRAITS[trait].aiValue ?? 2) + (animal.ownerId === p.id ? 1 : 0);
        if (trait === "parasite") {
          s = 7 + speciesNeed(animal) - (animal.ownerId === p.id ? 20 : 0);
          if (state.difficulty === "easy") s -= 3;
        }
        if (trait === "carnivore" && animal.ownerId === p.id) s += 3;
        if (trait === "fatTissue" && animal.ownerId === p.id) s += 2;
        // Голодный стол: свойства-кормильцы дают еду сверх базы — они важнее
        // прочих, когда своей доли еды уже не хватает.
        if (animal.ownerId === p.id && surplus <= 0) {
          if (trait === "fatTissue" || trait === "symbiosis" || trait === "cooperation") s += 2;
          if (trait === "hibernation") s += 1;
        }
        // Хищника выгоднее класть туда, где больше чужих голодных жертв.
        if (trait === "carnivore" && animal.ownerId === p.id && a.face !== undefined) {
          const zone = animal.zoneId ?? "laurasia";
          const preyHere = state.players
            .flatMap((x) => x.animals)
            .filter((x) => x.ownerId !== p.id && x.zoneId === zone).length;
          s += Math.min(preyHere, 3) * 0.7;
        }
        if (state.lastYear) s += TRAITS[trait].scoreBonus * 2 + 1;
      }
    }
    if (a.type === "devPlayPair") {
      s = 5;
      if (state.lastYear) s += 2;
    }
    // «Растения»: свойство на общее растение.
    if (a.type === "devPlayPlantTrait") {
      const card = p.hand.find((c) => c.id === a.cardId);
      const trait = card?.faces[a.face] ?? card?.faces[0];
      s = 2.5;
      if (trait === "plantParasite") {
        // паразит удобнее на растение с запасом фишек
        const plant = state.plants?.find((pl) => pl.id === a.plantId);
        s = plant ? 1.5 + Math.min(plant.food, 3) * 0.4 : 1.5;
      }
      if (trait === "thorny" || trait === "nutritious") s += 1;
      if (state.lastYear) s -= 2; // свойства растений очков не дают
    }
    if (a.type === "devPlayPlantPair") {
      // микориза страхует растения от вымирания
      s = 2.8;
      if (state.lastYear) s -= 2;
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
  return Math.max(0, speciesNeed(a) - a.food);
}

/** Есть ли вообще еда, доступная этому игроку (по всем его территориям). */
function usedAllFood(state: GameState): boolean {
  if (!state.modules.continents) return state.foodBank <= 0;
  return Object.values(state.territoryFood ?? {}).every((v) => (v ?? 0) <= 0);
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
      if (isCarnivoreLike(an) && hunger(an) <= 2) s -= 0.5;
    }
    // «Растения»: фишка с растения — как обычная еда, чуть предпочитаем
    // растения с запасом (дольше проживут) и питательные.
    if (a.type === "feedTakePlant") {
      const an = findAnimal(state, a.animalId)!;
      const plant = state.plants?.find((pl) => pl.id === a.plantId);
      s = 10 + (3 - hunger(an)) + (hasTrait(an, "burrowing") ? 1.5 : 0);
      if (plant) {
        s += Math.min(plant.food, 4) * 0.2;
        if (plant.traits.some((t) => t.type === "nutritious" && !t.disabled)) s += 1.5;
        if (plant.traits.some((t) => t.type === "medicinal" && !t.disabled) && an.traits.length > 2) s -= 4;
        if (plant.kind === "carnivorous") s -= 2.5; // контратака
      }
      if (isCarnivoreLike(an) && hunger(an) <= 2) s -= 0.5;
    }
    // «Трава и грибы»: фишка с карты флоры — как еда, но способность карты
    // может быть ловушкой (яд, бешенство, потеря руки).
    if (a.type === "feedTakeFlora") {
      const an = findAnimal(state, a.animalId)!;
      const f = state.flora?.find((fl) => fl.id === a.floraId);
      s = 10 + (3 - hunger(an)) + (hasTrait(an, "burrowing") ? 1.5 : 0);
      if (f) {
        const def = FLORA[f.kind];
        s += Math.min(f.food, 4) * 0.2 + def.aiHint;
        // яд не страшен с антидотом, а выгоден сопернику без него
        if (def.mark === "poison" && hasMark(an, "antidote")) s += 3;
        // чистильщик сбрасывает уже собранную еду
        if (f.kind === "cleanser" && an.food > 1) s -= 5;
        // гриб прозрения больнее при полной руке
        if (f.kind === "insight") s -= Math.min(p.hand.length, 6) * 0.5;
        // страстоцвет разбивает ценное животное
        if (f.kind === "passionflower" && an.traits.length > 1) s -= 1.5;
      }
      if (isCarnivoreLike(an) && hunger(an) <= 2) s -= 0.5;
    }
    // «Растения»: убежище — сильная защита для голодных и ценных животных.
    if (a.type === "feedShelter") {
      const an = findAnimal(state, a.animalId)!;
      const threats = state.players.some((x) =>
        x.id !== p.id ? x.animals.some((c) => isCarnivoreLike(c) && !isFed(c)) : false,
      );
      s = threats ? 7 + Math.min(animalValue(an), 8) * 0.3 : 1.5;
      if (isFed(an)) s -= 2;
    }
    // «Растения»: направить хищное растение на чужое животное.
    if (a.type === "feedPlantAttack") {
      const prey = findAnimal(state, a.preyId)!;
      s = animalValue(prey) + 3 + (prey.ownerId !== p.id ? 0 : -12);
      if (state.difficulty === "easy") s -= 4;
    }
    // «Растения»: перекинуть фишку на паразита — припасти еду.
    if (a.type === "feedParasitize") {
      s = 1;
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
      const target = findAnimal(state, a.targetId)!;
      s = 6 + hunger(pirate);
      // Own piracy creates no food. Only consolidate it when this feeds the
      // recipient; otherwise two hungry species can steal back forever.
      if (target.ownerId === pirate.ownerId && !isFed({ ...pirate, food: pirate.food + 1, blueFood: pirate.blueFood + 1 })) {
        s = -20;
      }
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
    if (a.type === "feedFinishMigration") s = 0;
    if (a.type === "feedRemora") {
      const follower = findAnimal(state, a.animalId)!;
      const route = state.pendingMigration!.routes.find(r => r.animalId === a.migrantId)!;
      s = hunger(follower) > 0 ? (state.territoryFood?.[route.to] ?? 0) - (state.territoryFood?.[route.from ?? "laurasia"] ?? 0) - 1 : -2;
    }
    if (a.type === "feedMigrate") {
      // Миграция — запасной ход: полезна при переезде к еде, иначе избегаем.
      const mv = findAnimal(state, a.moves[0]!.animalId);
      s = 3;
      if (mv) {
        // Уезжающее голодное животное из пустой зоны — да; сытая жизнь — нет.
        s -= hunger(mv);
      }
      if (myHungry > 0 && !usedAllFood(state)) s -= 6;
    }
    if (a.type === "feedRecombine") {
      const giver = findAnimal(state, a.giverId)!;
      const taker = findAnimal(state, a.takerId)!;
      const sent = giver.traits.find(t => t.id === a.traitId)!;
      const received = taker.traits.find(t => t.id === a.otherTraitId)!;
      // Evaluate both partners, not merely the benefit of giving away a parasite.
      const project = (host: Animal, outgoing: typeof sent, incoming: typeof sent): Animal => {
        const traits = host.traits.filter(t => t.id !== outgoing.id);
        if (TRAITS[incoming.type].stackable || !traits.some(t => t.type === incoming.type)) {
          traits.push({ ...incoming, disabled: false });
        }
        return { ...host, traits };
      };
      const after = [project(giver, sent, received), project(taker, received, sent)];
      const before = [giver, taker];
      s = -4;
      for (let i = 0; i < before.length; i++) {
        s += (Number(isFed(after[i]!)) - Number(isFed(before[i]!))) * 12;
        s += hunger(before[i]!) - hunger(after[i]!);
      }
      if (a.to !== undefined) s -= 2;
    }
    if (a.type === "feedEndTurn") {
      // Завершать ход есть смысл, только если он уже чем-то занят.
      const used = state.turnUse;
      s = used.foodTaken || used.combatUsed || used.grazers.length > 0 ? 2 : -5;
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
