import { PLANTS } from "./plants.ts";
import { TRAITS } from "./traits.ts";
import type {
  Animal,
  FloraCard,
  GameState,
  MarkKind,
  Plant,
  Player,
  TerritoryId,
  TraitId,
  TraitInstance,
} from "./types.ts";

/** Свойство активно: раскрыто и не отключено (шов под неоплазию/мутации). */
export function isActive(t: TraitInstance): boolean {
  return !t.hidden && !t.disabled && !t.paralyzed;
}

/**
 * Животное — хищник: «Хищник» или (в «Случайных мутациях») «Облигатный
 * хищник». Проверяет мясную специализацию целиком, включая запреты питания.
 */
export function isCarnivoreLike(animal: Animal): boolean {
  return hasTrait(animal, "carnivore") || hasTrait(animal, "obligateCarnivore");
}

// ── «Трава и грибы»: метки последствий ───────────────────────────────────────

export function hasMark(animal: Animal, mark: MarkKind): boolean {
  return Boolean(animal.marks?.includes(mark));
}

/**
 * Животное со меткой «Сон» считается животным без свойств: все свойства (в
 * том числе парные) не действуют, потребность в пище равна 1. Метки на нём
 * продолжают работать.
 */
export function isAsleep(animal: Animal): boolean {
  return hasMark(animal, "sleep");
}

export function player(state: GameState, id: number): Player {
  const p = state.players.find((x) => x.id === id);
  if (!p) throw new Error(`player ${id}`);
  return p;
}

export function allAnimals(state: GameState): Animal[] {
  return state.players.flatMap((p) => p.animals);
}

export function findAnimal(state: GameState, id: string): Animal | undefined {
  return allAnimals(state).find((a) => a.id === id);
}

export function mustFind(state: GameState, id: string): Animal {
  const a = findAnimal(state, id);
  if (!a) throw new Error(`animal ${id}`);
  return a;
}

export function findPlant(state: GameState, id: string): Plant | undefined {
  return state.plants?.find((p) => p.id === id);
}

export function mustFindPlant(state: GameState, id: string): Plant {
  const p = findPlant(state, id);
  if (!p) throw new Error(`plant ${id}`);
  return p;
}

/**
 * Животное «усыплено» лекарственным растением: накормлено, но все его
 * свойства не действуют до конца фазы питания (очков при этом не теряет).
 */
export function isSedated(animal: Animal): boolean {
  return Boolean(animal.sedated);
}

/**
 * Наличие активного свойства. Скрытые свойства по умолчанию инертны;
 * отключённые (disabled) не действуют никогда. «Усыпленное» лекарственным
 * растением животное тоже не использует свойства (кроме фишки убежища).
 */
export function hasTrait(animal: Animal, type: TraitId, includeHidden = false): boolean {
  if (animal.sedated || isAsleep(animal)) return false;
  return animal.traits.some((t) => t.type === type && !t.disabled && !t.paralyzed && (includeHidden || !t.hidden));
}

export function traitsOf(animal: Animal, type: TraitId, includeHidden = false) {
  if (animal.sedated || isAsleep(animal)) return [];
  return animal.traits.filter((t) => t.type === type && !t.disabled && !t.paralyzed && (includeHidden || !t.hidden));
}

export function foodNeeded(animal: Animal, includeHidden = false): number {
  // «Сон-трава»: потребность животного без свойств — 1.
  if (isAsleep(animal)) return 1;
  let n = 1;
  for (const t of animal.traits) {
    if (!includeHidden && t.hidden) continue;
    if (t.disabled || t.paralyzed) continue;
    n += TRAITS[t.type].extraFood;
  }
  return n;
}

/**
 * «Случайные мутации»: сколько фишек еды нужно виду целиком — потребность
 * одного животного, умноженная на численность. Вне модуля численность 1.
 */
export function speciesNeed(animal: Animal, includeHidden = false): number {
  return foodNeeded(animal, includeHidden) * (animal.population ?? 1);
}

/** Территория животного; вне «Континентов» зоны нет — все в одном поле. */
export function territoryOf(state: GameState, a: Animal): TerritoryId | undefined {
  return state.modules.continents ? a.zoneId : undefined;
}

/**
 * Водность животного. В «Континентах» океан сам делает животное водным:
 * пока оно в океане, свойство «водоплавающее» неотчуждаемо (его не снять
 * ни неоплазией, ни рекомбинацией, ни параличом). На континенте водность —
 * только по карте свойства.
 */
export function isAquatic(state: GameState, animal: Animal): boolean {
  if (state.modules.continents && animal.zoneId === "ocean") return true;
  return hasTrait(animal, "swimming");
}

/** Паралич стрекательными клетками: хищник теряет ВСЕ свойства до конца фазы
 * питания (остаётся базовая потребность 1), в океане ещё и водоплавающее.
 */
export function isParalyzed(state: GameState, animalId: string): boolean {
  return Boolean(state.paralyzed?.includes(animalId));
}

/**
 * Активен ли хищник как хищник: не спит, голоден, жив и не парализован.
 * Свойства сытого (и парализованного) животного не работают. «Пацифизм»
 * («Трава и грибы») запрещает атаковать свойством «Хищник».
 */
export function canHuntWith(state: GameState, carnivore: Animal): boolean {
  if (!isCarnivoreLike(carnivore)) return false;
  if (hasMark(carnivore, "pacifism")) return false;
  if (carnivore.hibernating || isFed(carnivore)) return false;
  return !isParalyzed(state, carnivore.id);
}

/** Сколько животных со «стадностью» и сколько хищников находится в локации. */
export function herdingBalance(
  state: GameState,
  zone: TerritoryId,
): { herding: number; carnivores: number } {
  let herding = 0;
  let carnivores = 0;
  for (const a of allAnimals(state)) {
    if (territoryOf(state, a) !== zone) continue;
    if (a.traits.some((t) => t.type === "herding" && isActive(t)) && !a.sedated && !isAsleep(a)) {
      herding += a.population ?? 1;
    }
    if (isCarnivoreLike(a)) carnivores += 1;
  }
  // «Растения»: хищные растения тоже хищники своей локации.
  for (const p of state.plants ?? []) {
    if (p.kind !== "carnivorous") continue;
    if (state.modules.continents && (p.zoneId ?? "laurasia") !== zone) continue;
    carnivores += 1;
  }
  return { herding, carnivores };
}

/** Защищено ли стадное животное в своей локации: стадных не меньше хищников (C-card стр.1: «равно или больше»). */
export function herdingProtects(state: GameState, prey: Animal): boolean {
  if (!state.modules.continents) return false;
  if (isAsleep(prey)) return false;
  if (!prey.traits.some((t) => t.type === "herding" && isActive(t))) return false;
  const bal = herdingBalance(state, prey.zoneId ?? "laurasia");
  return bal.herding >= bal.carnivores;
}

export function isFed(animal: Animal, includeHidden = false): boolean {
  if (animal.hibernating || animal.sedated) return true;
  if (hasTrait(animal, "obligateCarnivore", includeHidden) && animal.blueFood > 0) return true;
  return animal.food >= speciesNeed(animal, includeHidden);
}

export function emptyFatSlots(animal: Animal, includeHidden = false): number {
  const slots = traitsOf(animal, "fatTissue", includeHidden).length;
  return Math.max(0, slots - animal.fatTokens);
}

export function canReceiveFood(state: GameState, animal: Animal): boolean {
  if (animal.hibernating) return false;
  const symbionts = animal.traits.filter(
    (t) => hasTrait(animal, "symbiosis") && t.type === "symbiosis" && t.pairRole === "b" && isActive(t) && t.pairWith,
  );
  for (const s of symbionts) {
    const host = findAnimal(state, s.pairWith!);
    if (host && isAsleep(host)) continue;
    if (!host || !isFed(host)) return false;
  }
  if (isFed(animal)) return emptyFatSlots(animal) > 0;
  return true;
}

export function livingSymbiontProtects(state: GameState, prey: Animal): boolean {
  if (!hasTrait(prey, "symbiosis")) return false;
  return prey.traits.some((t) => {
    if (!isActive(t) || t.type !== "symbiosis" || t.pairRole !== "b" || !t.pairWith) return false;
    const host = findAnimal(state, t.pairWith);
    return Boolean(host) && !isAsleep(host!);
  });
}

/**
 * Проверка атаки целиком из реестра: симметричная вода, правила защиты
 * жертвы (камуфляж/большое/норное) читаются из TraitDef.protection.
 *
 * «Трава и грибы»:
 * - «Прозрачное» без фишек на теле — неуязвимо для хищника;
 * - метка «Дурь»: атакующий игнорирует одно свойство жертвы (в онлайн-
 *   версии выбирается автоматически — см. hazeIgnoreTraitId);
 * - спящее (метка «Сон») и усыпленное животное свойствами не защищается.
 */
export function canAttack(state: GameState, carnivore: Animal, prey: Animal): boolean {
  if (carnivore.id === prey.id) return false;
  if (!isCarnivoreLike(carnivore)) return false;
  if (carnivore.hibernating) return false;
  // Накормленный хищник не нападает: свойства сытого животного не работают.
  if (isFed(carnivore)) return false;
  // Парализованный стрекательными клетками — не хищник вовсе.
  if (isParalyzed(state, carnivore.id)) return false;
  // «Растения»: жетон убежища защищает даже от хищника с острым зрением.
  if (prey.sheltered) return false;
  // «Прозрачное»: без красных и синих фишек на теле жертву не атаковать.
  if (hasTrait(prey, "transparent") && prey.food === 0 && prey.blueFood === 0) return false;

  if (state.modules.continents) {
    // Атаковать можно только в своей территории.
    if (carnivore.zoneId !== prey.zoneId) return false;
    // Стадность: одно стадное уязвимо даже против одного хищника; защита
    // включается, только когда стадных в локации строго больше, чем хищников.
    const ignored = hazeIgnoreTraitId(state, carnivore, prey);
    if (herdingProtects(state, prey) && !prey.traits.some(t => t.type === "herding" && t.id === ignored)) return false;
  }

  if (livingSymbiontProtects(state, prey)) return false;
  // Свойства жертвы: спящее/усыпленное их не использует, «Дурь» гасит одно.
  const ignore = hazeIgnoreTraitId(state, carnivore, prey);
  const effective = effectivePreyTraits(prey, ignore);
  // Симметричное водное правило: водный хищник ест только водных и наоборот.
  // Водность считается с учётом океана (там она перманентна).
  const aquaticRule =
    carnivore.traits.some((t) => isActive(t) && TRAITS[t.type].symmetricAquatic) ||
    effective.some((t) => TRAITS[t.type].symmetricAquatic);
  const zoneAquatic =
    state.modules.continents && (carnivore.zoneId === "ocean" || prey.zoneId === "ocean");
  if ((aquaticRule || zoneAquatic) && isAquatic(state, carnivore) !== isAquatic(state, prey)) {
    return false;
  }
  for (const t of effective) {
    const rule = TRAITS[t.type].protection;
    if (!rule) continue;
    if (rule.stealthBypass && !hasTrait(carnivore, rule.stealthBypass)) return false;
    if (rule.needsBulkyAttacker && !hasTrait(carnivore, "highBodyWeight")) return false;
    if (rule.safeWhenFed && isFed(prey)) return false;
  }
  return true;
}

/** Свойства жертвы, работающие против атакующего: сон/усыпление гасит все. */
function effectivePreyTraits(prey: Animal, ignoreTraitId?: string): TraitInstance[] {
  if (prey.sedated || isAsleep(prey)) return [];
  return prey.traits.filter((t) => isActive(t) && t.id !== ignoreTraitId);
}

/**
 * Свойство жертвы, которое атакующий игнорирует. Источники:
 * - метка «Дурь» («Трава и грибы»);
 * - «Дефекты развития» («Случайные мутации»): хищник гасит одно свойство
 *   жертвы — выбирается автоматически (сознательное упрощение онлайн-версии):
 *   сначала свойство, реально мешающее атаке, затем «водоплавающее» жертвы
 *   против сухопутного хищника, затем сильнейшая защитная реакция.
 */
export function hazeIgnoreTraitId(state: GameState, carnivore: Animal, prey: Animal): string | undefined {
  const ignoring = hasMark(prey, "haze") || hasTrait(prey, "developmentDefects");
  if (!ignoring || prey.sedated || isAsleep(prey)) return undefined;
  for (const t of prey.traits) {
    if (!isActive(t)) continue;
    if (t.type === "herding" && hasTrait(prey, "developmentDefects") && herdingProtects(state, prey)) return t.id;
    const rule = TRAITS[t.type].protection;
    if (!rule) continue;
    const blocks =
      (rule.stealthBypass && !hasTrait(carnivore, rule.stealthBypass)) ||
      (rule.needsBulkyAttacker && !hasTrait(carnivore, "highBodyWeight")) ||
      (rule.safeWhenFed && isFed(prey));
    if (blocks) return t.id;
  }
  if (!isAquatic(state, carnivore)) {
    const swim = prey.traits.find((t) => isActive(t) && t.type === "swimming");
    if (swim) return swim.id;
  }
  for (const kind of ["tailLoss", "running", "mimicry"] as const) {
    const t = prey.traits.find((x) => isActive(x) && x.type === kind);
    if (t) return t.id;
  }
  return undefined;
}

/**
 * «Бешенство»: бешеное животное атакует, как хищник, — свойство «Хищник»
 * ему не нужно, накормленность не мешает, но «Пацифизм» и спячку правила
 * не отключают (метки работают всегда).
 */
export function canRageAttackWith(a: Animal): boolean {
  return !a.hibernating && !hasMark(a, "pacifism");
}

export function canRageAttack(state: GameState, attacker: Animal, prey: Animal): boolean {
  if (attacker.id === prey.id) return false;
  if (!canRageAttackWith(attacker)) return false;
  if (prey.sheltered) return false;
  if (hasTrait(prey, "transparent") && prey.food === 0 && prey.blueFood === 0) return false;
  if (state.modules.continents) {
    if (attacker.zoneId !== prey.zoneId) return false;
    if (herdingProtects(state, prey)) return false;
  }
  if (livingSymbiontProtects(state, prey)) return false;
  const ignore = hazeIgnoreTraitId(state, attacker, prey);
  const effective = effectivePreyTraits(prey, ignore);
  const aquaticRule =
    attacker.traits.some((t) => isActive(t) && TRAITS[t.type].symmetricAquatic) ||
    effective.some((t) => TRAITS[t.type].symmetricAquatic);
  const zoneAquatic =
    state.modules.continents && (attacker.zoneId === "ocean" || prey.zoneId === "ocean");
  if ((aquaticRule || zoneAquatic) && isAquatic(state, attacker) !== isAquatic(state, prey)) {
    return false;
  }
  for (const t of effective) {
    const rule = TRAITS[t.type].protection;
    if (!rule) continue;
    if (rule.stealthBypass && !hasTrait(attacker, rule.stealthBypass)) return false;
    if (rule.needsBulkyAttacker && !hasTrait(attacker, "highBodyWeight")) return false;
    if (rule.safeWhenFed && isFed(prey)) return false;
  }
  return true;
}

export function animalValue(animal: Animal): number {
  let v = 2 * (animal.population ?? 1);
  for (const t of animal.traits) {
    if (!isActive(t)) continue;
    v += 1 + TRAITS[t.type].scoreBonus;
  }
  return v;
}

/** Животное мигрирует само (свойство «миграция» активно, раз за фазу питания). */
export function canMigrate(state: GameState, a: Animal): boolean {
  return (
    hasTrait(a, "migration") &&
    !a.hibernating &&
    !isParalyzed(state, a.id) &&
    !(state.migratedThisPhase ?? []).includes(a.id)
  );
}

export function visibleTraits(animal: Animal) {
  return animal.traits.filter((t) => !t.hidden);
}

// ── «Растения» ───────────────────────────────────────────────────────────────

/** Есть ли у растения активное свойство указанного типа. */
export function plantHasTrait(plant: Plant, type: TraitId): boolean {
  return plant.traits.some((t) => t.type === type && !t.disabled && !t.hidden);
}

/**
 * Может ли животное брать фишку еды с растения: ограничения по свойствам
 * растения (водное/корнеплод/дерево) и правило «хищники едят только с
 * растений со значком плода или свойством „Питательное“».
 */
export function canFeedOnPlant(state: GameState, animal: Animal, plant: Plant): boolean {
  if (plant.food <= 0) return false;
  if (animal.hibernating || animal.sedated) return false;
  if (state.modules.continents) {
    // Растения живут на континентах; животные Океана с них не едят.
    if ((animal.zoneId ?? "laurasia") !== (plant.zoneId ?? "laurasia")) return false;
  }
  if (plantHasTrait(plant, "plantWater") && !isAquatic(state, animal)) return false;
  if (plantHasTrait(plant, "rootVegetable") && !hasTrait(animal, "burrowing")) return false;
  if (plantHasTrait(plant, "tree") && !hasTrait(animal, "highBodyWeight")) return false;
  if (isCarnivoreLike(animal)) {
    if (!PLANTS[plant.kind].carnivoreEdible && !plantHasTrait(plant, "nutritious")) return false;
  }
  return true;
}

/**
 * Хищное растение атакует по правилам хищника БЕЗ свойств: оно не тронет
 * водоплавающее, большое, камуфляж, накормленное норное, стадное (при
 * превосходстве стадных), симбионта под защитой и животное в убежище.
 */
export function canPlantAttackTarget(state: GameState, plant: Plant, prey: Animal): boolean {
  if (prey.sheltered || prey.hibernating) return false;
  if (isAquatic(state, prey)) return false;
  if (state.modules.continents) {
    if ((prey.zoneId ?? "laurasia") !== (plant.zoneId ?? "laurasia")) return false;
    if (herdingProtects(state, prey)) return false;
  }
  if (!prey.sedated) {
    if (hasTrait(prey, "highBodyWeight")) return false;
    if (hasTrait(prey, "camouflage")) return false;
    if (hasTrait(prey, "burrowing") && isFed(prey)) return false;
    if (livingSymbiontProtects(state, prey)) return false;
  }
  return true;
}

/** Убежище доступно с любого растения, где остались жетоны, — даже несъедобного. */
export function canTakeShelterFrom(state: GameState, animal: Animal, plant: Plant): boolean {
  if (plant.shelters <= 0) return false;
  if (animal.hibernating || animal.sheltered) return false;
  if (state.modules.continents) {
    if ((animal.zoneId ?? "laurasia") !== (plant.zoneId ?? "laurasia")) return false;
  }
  return true;
}

export function nextPlayerId(state: GameState, from = state.currentPlayerId): number {
  const n = state.players.length;
  return (from + 1) % n;
}

// ── «Трава и грибы» ───────────────────────────────────────────────────────────

export function findFlora(state: GameState, id: string): FloraCard | undefined {
  return state.flora?.find((f) => f.id === id);
}

export function mustFindFlora(state: GameState, id: string): FloraCard {
  const f = findFlora(state, id);
  if (!f) throw new Error(`flora ${id}`);
  return f;
}

/**
 * Может ли животное брать фишку с карты флоры: по правилам дополнения
 * запретов нет (даже для хищников и водных); с «Континентами» флора стоит
 * на континентах — животные Океана с неё не едят.
 */
export function canFeedOnFlora(state: GameState, animal: Animal, flora: FloraCard): boolean {
  if (flora.food <= 0) return false;
  if (animal.hibernating) return false;
  if (state.modules.continents && (animal.zoneId ?? "laurasia") !== (flora.zoneId ?? "gondwana")) {
    return false;
  }
  return true;
}

/**
 * Текущие очки игрока по живым животным — та же формула, что и финальный
 * подсчёт (finishGame): 2 очка за каждое животное вида, по очку за свойство
 * и его бонус. В настольной игре счёт скрыт до конца партии, поэтому
 * в UI он показывается опциональным тумблером.
 */
export function liveScore(state: GameState, playerId: number): number {
  const p = state.players.find((x) => x.id === playerId);
  if (!p) return 0;
  let total = 0;
  for (const a of p.animals) {
    total += 2 * (a.population ?? 1);
    for (const t of a.traits) {
      if (t.disabled) continue;
      total += 1 + TRAITS[t.type].scoreBonus;
    }
  }
  for (const pending of state.pendingRegeneration ?? []) {
    if (pending.ownerId !== playerId) continue;
    for (const t of pending.traits ?? []) {
      if (t.disabled) continue;
      total += 1 + TRAITS[t.type].scoreBonus;
    }
  }
  return total;
}
