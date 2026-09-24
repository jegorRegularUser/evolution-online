import { TRAITS } from "./traits.ts";
import { PLANTS } from "./plants.ts";
import { FLORA } from "./flora.ts";
import type { Animal, GameAction, GameState } from "./types.ts";
import {
  baseFoodSpec,
  legalDefenseActions,
  legalDevActions,
  legalFeedActions,
  territoryFoodSpec,
} from "./engine.ts";
import { nextRandom } from "./rng.ts";
import {
  animalValue,
  canAttack,
  canFeedOnPlant,
  findAnimal,
  liveScore,
  hasMark,
  hasTrait,
  isCarnivoreLike,
  isFed,
  player,
  speciesNeed,
} from "./queries.ts";

/**
 * Случайность сложности берётся из состояния партии (nextRandom), поэтому
 * ходы ботов воспроизводимы по сиду вместе со всей игрой. Hard не тратит
 * случайность и оценивает видимые варианты без шума.
 */
function decisionJitter(state: GameState): number {
  if (state.difficulty === "hard") return 0;
  const r = nextRandom(state);
  if (state.difficulty === "easy") return (r - 0.5) * 8;
  return (r - 0.5) * 2;
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
  if (state.modules.continents) {
    const spec = territoryFoodSpec(n);
    const territories =
      spec.laurasia.dice * 3.5 +
      spec.laurasia.bonus +
      spec.gondwana.dice * 3.5 +
      spec.gondwana.bonus +
      spec.ocean;
    // С растениями/флорой большая часть еды лежит на столе, а не в банке.
    if (state.modules.plants || state.modules.fungi)
      return spec.ocean + (state.modules.plants ? 8 : 0) + (state.modules.fungi ? 6 : 0);
    return territories;
  }
  // «Растения»/«Трава и грибы»: часть еды лежит на картах флоры, база меньше.
  if (state.modules.plants || state.modules.fungi) return 6 + n;
  const spec = baseFoodSpec(n);
  return spec.dice * 3.5 + spec.bonus;
}

/** Свободная доля стола: сколько еды остаётся «на меня» сверх текущей популяции. */
function foodSurplus(state: GameState, p: GameState["players"][number]): number {
  const share = expectedBank(state) / Math.max(1, state.players.length);
  const need = p.animals.reduce((sum, a) => sum + speciesNeed(a), 0);
  return share - need;
}

/** Оценка свойства с видимой ошибкой: easy иногда недооценивает сложные карты. */
function traitValue(state: GameState, trait: keyof typeof TRAITS): number {
  let value = TRAITS[trait].aiValue ?? 2;
  if (state.difficulty === "easy") {
    const error: Partial<Record<keyof typeof TRAITS, number>> = {
      highBodyWeight: -2.5,
      camouflage: -1.2,
      cooperation: -2,
      symbiosis: -2,
      communication: -1.4,
      regeneration: -1.2,
      migration: -0.8,
      remora: -0.8,
    };
    value += error[trait] ?? 0;
  }
  if (state.difficulty === "hard") {
    value += (TRAITS[trait].scoreBonus ?? 0) * 1.5;
    if (state.lastYear) value += 1.2;
    if (trait === "herding" || trait === "regeneration") value += 0.8;
  }
  return value;
}

function cardTrait(
  state: GameState,
  a: Extract<GameAction, { type: "devPlayPair" }>,
): keyof typeof TRAITS | undefined {
  return state.players[state.currentPlayerId]?.hand.find((c) => c.id === a.cardId)?.faces[a.face];
}

/** Пара оценивается по совместной еде и защите, а не по постоянной цене. */
function pairValue(state: GameState, a: Extract<GameAction, { type: "devPlayPair" }>): number {
  const p = player(state, state.currentPlayerId);
  const trait = cardTrait(state, a);
  if (state.difficulty === "easy") return state.lastYear ? 1 : -8;
  let value = 5;
  const first = findAnimal(state, a.a);
  const second = findAnimal(state, a.b);
  if (!first || !second) return value;
  const need = hunger(first) + hunger(second);
  if (trait === "cooperation") value += Math.min(6, need * 1.2);
  if (trait === "communication") {
    const zone = (first.zoneId ?? "laurasia") as "laurasia" | "gondwana" | "ocean";
    value += foodInZone(state, zone, first) > 0 ? Math.min(4, need * 0.8) : -1;
  }
  if (trait === "symbiosis") {
    const zone = (first.zoneId ?? "laurasia") as "laurasia" | "gondwana" | "ocean";
    value += Math.min(5, threatInZone(state, zone, second) * 1.5);
  }
  if (state.difficulty === "hard") {
    if (p.animals.length > 1 && need > 0) value += 1;
    if (state.lastYear) value += 1.5;
  }
  return value;
}

/** Видимая защита жертвы: hard не тратит ход на почти гарантированный промах. */
function defensePenalty(state: GameState, prey: Animal): number {
  let penalty = 0;
  if (hasTrait(prey, "poisonous")) penalty += 5;
  if (hasTrait(prey, "running")) penalty += 3;
  if (hasTrait(prey, "mimicry")) penalty += 2.5;
  if (hasTrait(prey, "tailLoss")) penalty += 5;
  if (hasTrait(prey, "nematocysts")) penalty += 1.5;
  return state.difficulty === "easy" ? penalty * 0.35 : penalty;
}

function leaderId(state: GameState, selfId: number): number {
  const opponents = state.players.filter((p) => p.id !== selfId);
  return opponents.reduce(
    (best, p) => (liveScore(state, p.id) > liveScore(state, best) ? p.id : best),
    opponents[0]?.id ?? selfId,
  );
}

function pickDefense(state: GameState, acts: GameAction[]): GameAction {
  const prey = findAnimal(state, state.pendingAttack!.preyId);
  const running = acts.find((a) => a.type === "chooseDefense" && a.kind === "running");
  const mimic = acts
    .filter(
      (a): a is Extract<GameAction, { type: "chooseDefense" }> =>
        a.type === "chooseDefense" && a.kind === "mimicry",
    )
    .sort((a, b) => {
      const va = animalValue(findAnimal(state, a.mimicryTargetId!)!);
      const vb = animalValue(findAnimal(state, b.mimicryTargetId!)!);
      return va - vb;
    });
  if (state.difficulty === "hard" && mimic[0] && prey) {
    const cheapest = animalValue(findAnimal(state, mimic[0].mimicryTargetId!) ?? prey);
    if (cheapest + 2 < animalValue(prey) || hasTrait(prey, "herding")) return mimic[0];
  }
  if (running) return running;
  if (mimic[0]) return mimic[0];
  const tails = acts.filter(
    (a): a is Extract<GameAction, { type: "chooseDefense" }> =>
      a.type === "chooseDefense" && a.kind === "tailLoss",
  );
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
      if (state.difficulty === "hard" && stock > 0 && !state.lastYear && surplus > 0) s += 1.2;
      if (state.difficulty === "easy" && stock > 0) {
        s = p.animals.length > 0 ? (state.lastYear ? 0.5 : 3.2) : s - 1.5;
      }
    }
    if (a.type === "devPlayAnimal") {
      s = 6 - p.animals.length * 1.4;
      if (p.animals.length === 0) s = 14;
      if (state.lastYear) s = 8;
      // Третье и далее животное при дефиците еды — штраф (в последний год
      // очки важнее риска, там штраф не применяем).
      if (surplus <= 0 && !state.lastYear) s -= 5;
      if (state.difficulty === "hard" && surplus > 0 && !state.lastYear) s += 1.2;
      if (state.difficulty === "easy" && !state.lastYear) s -= 1.8;
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
        if (state.difficulty !== "normal" && surplus <= 0 && !state.lastYear) s -= 5;
        if (state.difficulty === "hard" && surplus > 0 && !state.lastYear) s += 1.2;
        if (state.difficulty === "easy" && !state.lastYear) s -= 1.8;
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
          if (state.difficulty === "hard") s += Math.min(3, liveScore(state, p.id) / 5);
        }
        if (state.lastYear) s += 1.5;
        if (state.difficulty === "easy") s -= 0.6;
      }
      if (a.intent === "population") {
        // +1 животное выгодно сильному виду (хорошая еда/защита) и в последний год.
        const target = a.animalId ? findAnimal(state, a.animalId) : undefined;
        s = 3;
        if (target) {
          const worth = target.traits.reduce((v, t) => v + (TRAITS[t.type]?.aiValue ?? 0), 0);
          s += Math.max(0, Math.min(6, worth)) * 0.5;
          if (target.traits.some((t) => t.type === "budding")) s += 2;
          if (state.difficulty === "hard") s += Math.min(3, liveScore(state, p.id) / 6);
        }
        if (state.lastYear) s += 3;
        if (state.difficulty === "easy") s -= 0.5;
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
        s = traitValue(state, trait) + (animal.ownerId === p.id ? 1 : 0);
        if (trait === "parasite") {
          // По правилам карта допустима только на чужое животное, поэтому
          // выбирать её нельзя: хозяин получает +2 очка, а потребность
          // зверя вырастает на 2. Своего варианта legalDevActions не даёт.
          s = -30;
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
        if (state.difficulty === "hard") {
          const leader = leaderId(state, p.id);
          if (animal.ownerId === leader && (trait === "neoplasia" || trait === "parasite"))
            s += 1.5;
          if (animal.ownerId === p.id && state.lastYear) s += TRAITS[trait].scoreBonus * 1.5;
        }
      }
    }
    if (a.type === "devPlayPair") {
      s = pairValue(state, a);
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
    s += decisionJitter(state);
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

/** Видимая боту еда в зоне: банк и фишки на общих картах этой территории. */
function foodInZone(
  state: GameState,
  zone: "laurasia" | "gondwana" | "ocean",
  animal?: Animal,
): number {
  if (animal && hasTrait(animal, "obligateCarnivore")) {
    return (
      state.players
        .filter((p) => p.id !== animal.ownerId)
        .flatMap((p) => p.animals)
        .filter((a) => (a.zoneId ?? "laurasia") === zone && !isFed(a)).length * 2
    );
  }
  let total = state.modules.continents ? (state.territoryFood?.[zone] ?? 0) : state.foodBank;
  for (const plant of state.plants ?? []) {
    if (
      !state.modules.plants ||
      (state.modules.continents && (plant.zoneId ?? "gondwana") !== zone)
    )
      continue;
    if (animal && !canFeedOnPlant(state, animal, plant)) continue;
    total += plant.food;
  }
  for (const flora of state.flora ?? []) {
    if (state.modules.fungi && (!state.modules.continents || (flora.zoneId ?? "gondwana") === zone))
      total += flora.food;
  }
  return total;
}

function preyCount(state: GameState, hunter: Animal): number {
  const zone = (hunter.zoneId ?? "laurasia") as "laurasia" | "gondwana" | "ocean";
  return state.players
    .flatMap((p) => p.animals)
    .filter(
      (prey) =>
        prey.id !== hunter.id &&
        (prey.zoneId ?? "laurasia") === zone &&
        canAttack(state, hunter, prey),
    ).length;
}

/** Сколько доступных хищников действительно угрожает животному в зоне. */
function threatInZone(
  state: GameState,
  zone: "laurasia" | "gondwana" | "ocean",
  target?: Animal,
): number {
  return state.players
    .flatMap((p) => p.animals)
    .filter(
      (hunter) =>
        hunter.ownerId !== target?.ownerId &&
        hunter.zoneId === zone &&
        isCarnivoreLike(hunter) &&
        !isFed(hunter),
    )
    .filter((hunter) => (target ? canAttack(state, hunter, target) : true)).length;
}

function pickFeed(state: GameState, acts: GameAction[]): GameAction {
  const p = player(state, state.currentPlayerId);
  let best = acts[0]!;
  let bestScore = -Infinity;
  const myHungry = p.animals.filter((a) => !isFed(a)).length;
  const oppHungry = state.players
    .filter((x) => x.id !== p.id)
    .reduce((n, x) => n + x.animals.filter((a) => !isFed(a)).length, 0);
  const foreignHuntAvailable = acts.some(
    (a) => a.type === "feedHunt" && findAnimal(state, a.preyId)?.ownerId !== p.id,
  );
  const unpairedHuntAvailable = acts.some((a) => {
    if (a.type !== "feedHunt") return false;
    const prey = findAnimal(state, a.preyId);
    return Boolean(prey && !prey.traits.some((trait) => trait.pairWith));
  });

  for (const a of acts) {
    let s = 0;
    if (a.type === "feedTake") {
      const an = findAnimal(state, a.animalId)!;
      const zone = (an.zoneId ?? "laurasia") as "laurasia" | "gondwana" | "ocean";
      const available = state.modules.continents
        ? (state.territoryFood?.[zone] ?? 0)
        : state.foodBank;
      s = 10 + hunger(an) * 2.2 + Math.min(3, available) * 0.15;
      if (isFed(an)) s -= 3;
      if (hasTrait(an, "burrowing")) s += 0.6;
      if (isCarnivoreLike(an) && hunger(an) <= 2) s -= 0.5;
      if (isCarnivoreLike(an) && preyCount(state, an) > 0)
        s -= state.difficulty === "hard" ? 4 : 2.5;
      if (state.difficulty === "easy") s -= 0.5;
    }
    // «Растения»: фишка с растения — как обычная еда, чуть предпочитаем
    // растения с запасом (дольше проживут) и питательные.
    if (a.type === "feedTakePlant") {
      const an = findAnimal(state, a.animalId)!;
      const plant = state.plants?.find((pl) => pl.id === a.plantId);
      s = 10 + hunger(an) * 2.2 + (plant ? Math.min(3, plant.food) * 0.15 : 0);
      if (isFed(an)) s -= 3;
      if (hasTrait(an, "burrowing")) s += 0.6;
      if (plant) {
        if (plant.traits.some((t) => t.type === "nutritious" && !t.disabled)) s += 1.5;
        if (plant.traits.some((t) => t.type === "medicinal" && !t.disabled) && an.traits.length > 2)
          s -= 4;
        if (plant.kind === "carnivorous") s -= 2.5; // контратака
      }
      if (isCarnivoreLike(an) && hunger(an) <= 2) s -= 0.5;
      if (isCarnivoreLike(an) && preyCount(state, an) > 0)
        s -= state.difficulty === "hard" ? 4 : 2.5;
      if (state.difficulty === "easy") s -= 0.5;
    }
    // «Трава и грибы»: фишка с карты флоры — как еда, но способность карты
    // может быть ловушкой (яд, бешенство, потеря руки).
    if (a.type === "feedTakeFlora") {
      const an = findAnimal(state, a.animalId)!;
      const f = state.flora?.find((fl) => fl.id === a.floraId);
      s = 10 + hunger(an) * 2.2 + (f ? Math.min(3, f.food) * 0.15 : 0);
      if (isFed(an)) s -= 3;
      if (hasTrait(an, "burrowing")) s += 0.6;
      if (f) {
        const def = FLORA[f.kind];
        s += def.aiHint;
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
      if (isCarnivoreLike(an) && preyCount(state, an) > 0)
        s -= state.difficulty === "hard" ? 4 : 2.5;
      if (state.difficulty === "easy") s -= 0.5;
    }
    // «Растения»: убежище — сильная защита для голодных и ценных животных.
    if (a.type === "feedShelter") {
      const an = findAnimal(state, a.animalId)!;
      const zone = (an.zoneId ?? "laurasia") as "laurasia" | "gondwana" | "ocean";
      const threats = threatInZone(state, zone, an);
      s = threats ? 7 + Math.min(animalValue(an), 8) * 0.3 : 1.5;
      if (state.difficulty === "hard") s += Math.min(3, threats * 1.2);
      if (isFed(an)) s -= 2;
    }
    // «Растения»: направить хищное растение на чужое животное.
    if (a.type === "feedPlantAttack") {
      const prey = findAnimal(state, a.preyId)!;
      s = animalValue(prey) + 3 + (prey.ownerId !== p.id ? 0 : -12);
      if (state.difficulty === "hard") {
        if (prey.ownerId === leaderId(state, p.id)) s += 2;
        if (isCarnivoreLike(prey)) s += 2;
        s -= defensePenalty(state, prey) * 0.5;
      }
      if (state.difficulty === "easy") s -= 4;
    }
    // «Растения»: перекинуть фишку на паразита — припасти еду.
    if (a.type === "feedParasitize") {
      s = 1;
    }
    if (a.type === "feedHunt") {
      const prey = findAnimal(state, a.preyId)!;
      const car = findAnimal(state, a.carnivoreId)!;
      const foreign = prey.ownerId !== p.id;
      s = animalValue(prey) + (foreign ? 4 : -6) + hunger(car) * 1.2;
      if (state.difficulty === "hard") {
        if (prey.ownerId === p.id) s = foreignHuntAvailable ? -20 : -4;
        if (foreign && prey.ownerId === leaderId(state, p.id)) s += 3;
        if (foreign && isCarnivoreLike(prey)) s += 2.5;
        const zone = (car.zoneId ?? "laurasia") as "laurasia" | "gondwana" | "ocean";
        const herdThreat =
          p.animals.some((an) => hasTrait(an, "herding") && (an.zoneId ?? "laurasia") === zone) &&
          state.players.some(
            (x) =>
              x.id !== p.id &&
              x.animals.some(
                (an) => (an.zoneId ?? "laurasia") === zone && isCarnivoreLike(an) && !isFed(an),
              ),
          );
        if (herdThreat) s += 3;
        s -= defensePenalty(state, prey);
      } else if (state.difficulty === "easy") {
        s -= 4;
      }
      if (hasTrait(prey, "poisonous")) s -= 5;
      // Парная карта связывает животных; не охотимся на такую жертву, если
      // есть обычная добыча, чтобы не оставлять «висящую» пару после смерти.
      if (
        prey.traits.some((trait) => trait.pairWith) &&
        (state.modules.continents || unpairedHuntAvailable)
      )
        s -= 10;
    }
    if (a.type === "feedPirate") {
      const pirate = findAnimal(state, a.pirateId)!;
      const target = findAnimal(state, a.targetId)!;
      s = 4 + hunger(pirate);
      if (state.difficulty === "hard") {
        if (target.ownerId === leaderId(state, p.id)) s += 2;
        if (target.ownerId !== p.id && isCarnivoreLike(target)) s += 1;
        if (target.ownerId === p.id) s -= 2;
      }
      // Своё пиратство не даёт новой еды: не допускаем бесконечного обмена
      // фишками между собственными видами.
      if (target.ownerId === pirate.ownerId) {
        s = -20;
      }
    }
    if (a.type === "feedHibernate") {
      s = 5;
      const anyFood = state.modules.continents
        ? (["laurasia", "gondwana", "ocean"] as const).some((zone) => foodInZone(state, zone) > 0)
        : state.foodBank > 0;
      if (anyFood && myHungry <= 1) s -= 2;
    }
    if (a.type === "feedConvertFat") {
      // Свободное действие: конверсия почти всегда выгодна, но не срочно.
      s = 7;
    }
    if (a.type === "feedGraze") {
      // Топтун тратит еду, поэтому выбираем только реальный источник.
      const an = findAnimal(state, a.animalId);
      const zone = (an?.zoneId ?? "laurasia") as "laurasia" | "gondwana" | "ocean";
      const available = a.plantId
        ? (state.plants?.find((pl) => pl.id === a.plantId)?.food ?? 0)
        : a.floraId
          ? (state.flora?.find((fl) => fl.id === a.floraId)?.food ?? 0)
          : foodInZone(state, zone, an);
      s = oppHungry > myHungry ? 2.5 : -1;
      if (available <= 0) s = -20;
      else if (available <= 1) s -= 1;
      if (state.difficulty === "easy") s -= 0.5;
    }
    if (a.type === "feedFinishMigration") {
      // Завершение нужно только когда прилипал нет или переход ему невыгоден.
      s = 1;
    }
    if (a.type === "feedRemora") {
      const follower = findAnimal(state, a.animalId)!;
      const route = state.pendingMigration!.routes.find((r) => r.animalId === a.migrantId)!;
      const from = route.from ?? "laurasia";
      const to = route.to;
      const need = hunger(follower);
      const here = foodInZone(state, from, follower);
      const there = foodInZone(state, to, follower);
      const dangerHere = threatInZone(state, from, follower);
      const dangerThere = threatInZone(state, to, follower);
      s = 0;
      if (need > 0 && there > 0) s += 5 + Math.min(7, need * 1.5);
      if (there > here) s += Math.min(5, (there - here) * 0.8);
      if (there <= 0 && need > 0) s -= 8;
      if (dangerHere > 0 && dangerThere < dangerHere) s += 3;
      if (dangerThere > dangerHere) s -= 3;
      if (follower.traits.some((t) => t.pairWith && t.pairWith !== a.migrantId)) s = -20;
      if (state.difficulty === "easy") s -= 1.5;
    }
    if (a.type === "feedMigrate") {
      const mv = findAnimal(state, a.moves[0]!.animalId);
      const from = mv?.zoneId ?? "laurasia";
      const to = a.moves[0]!.to;
      const need = mv ? hunger(mv) : 0;
      const here = foodInZone(state, from, mv);
      const there = foodInZone(state, to, mv);
      const dangerHere = mv ? threatInZone(state, from, mv) : 0;
      const dangerThere = mv ? threatInZone(state, to, mv) : 0;
      s = -8;
      if (mv && need > 0 && there > here) s += 5 + Math.min(9, (there - here) * 1.25 + need * 0.8);
      if (mv && here <= 0 && there > 0 && need > 0) s += 7;
      if (dangerHere > dangerThere) s += Math.min(4, dangerHere - dangerThere);
      if (dangerThere > dangerHere) s -= 4;
      if (there <= 0 && here > 0) s -= 6;
      if (there <= 0 && dangerHere > 0 && dangerThere === 0) s += 8;
      if (mv?.traits.some((t) => t.pairWith)) {
        // Переезд разорвал бы парную карту; оставляем её животным вместе.
        s = dangerHere > dangerThere ? -2 : -20;
      }
      if (state.difficulty === "easy") s -= 1;
      if (state.difficulty === "hard" && there > 0 && here <= 0) s += 1;
      // Не переезжать ради пустой зоны: это должно быть хуже обычного паса.
      if (there <= 0 && dangerHere === 0) s = -20;
    }
    if (a.type === "feedRecombine") {
      const giver = findAnimal(state, a.giverId)!;
      const taker = findAnimal(state, a.takerId)!;
      const sent = giver.traits.find((t) => t.id === a.traitId)!;
      const received = taker.traits.find((t) => t.id === a.otherTraitId)!;
      // Evaluate both partners, not merely the benefit of giving away a parasite.
      const project = (host: Animal, outgoing: typeof sent, incoming: typeof sent): Animal => {
        const traits = host.traits.filter((t) => t.id !== outgoing.id);
        if (TRAITS[incoming.type].stackable || !traits.some((t) => t.type === incoming.type)) {
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
      if (state.difficulty === "hard" && used.foodTaken) s += 0.5;
    }
    if (a.type === "feedSkip") {
      const anyFood = state.modules.continents
        ? (["laurasia", "gondwana", "ocean"] as const).some((zone) =>
            p.animals.some((an) => foodInZone(state, zone, an) > 0),
          )
        : state.foodBank > 0;
      s = myHungry === 0 ? 4 : anyFood ? -3 : 0;
      if (state.difficulty === "easy" && myHungry > 0 && !anyFood) s -= 0.5;
    }
    s += decisionJitter(state);
    if (s > bestScore) {
      bestScore = s;
      best = a;
    }
  }
  return best;
}
