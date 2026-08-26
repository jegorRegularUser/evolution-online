import { TRAITS } from "./traits.ts";
import type { Animal, GameState, Player, TraitId, TraitInstance } from "./types.ts";

/** Свойство активно: раскрыто и не отключено (шов под неоплазию/мутации). */
export function isActive(t: TraitInstance): boolean {
  return !t.hidden && !t.disabled;
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

/**
 * Наличие активного свойства. Скрытые свойства по умолчанию инертны;
 * отключённые (disabled) не действуют никогда.
 */
export function hasTrait(animal: Animal, type: TraitId, includeHidden = false): boolean {
  return animal.traits.some((t) => t.type === type && !t.disabled && (includeHidden || !t.hidden));
}

export function traitsOf(animal: Animal, type: TraitId, includeHidden = false) {
  return animal.traits.filter((t) => t.type === type && !t.disabled && (includeHidden || !t.hidden));
}

export function foodNeeded(animal: Animal, includeHidden = false): number {
  let n = 1;
  for (const t of animal.traits) {
    if (!includeHidden && t.hidden) continue;
    if (t.disabled) continue;
    n += TRAITS[t.type].extraFood;
  }
  return n;
}

export function isFed(animal: Animal, includeHidden = false): boolean {
  if (animal.hibernating) return true;
  return animal.food >= foodNeeded(animal, includeHidden);
}

export function emptyFatSlots(animal: Animal, includeHidden = false): number {
  const slots = traitsOf(animal, "fatTissue", includeHidden).length;
  return Math.max(0, slots - animal.fatTokens);
}

export function canReceiveFood(state: GameState, animal: Animal): boolean {
  if (animal.hibernating) return false;
  const symbionts = animal.traits.filter(
    (t) => t.type === "symbiosis" && t.pairRole === "b" && !t.hidden && !t.disabled && t.pairWith,
  );
  for (const s of symbionts) {
    const host = findAnimal(state, s.pairWith!);
    if (!host || !isFed(host)) return false;
  }
  if (isFed(animal)) return emptyFatSlots(animal) > 0;
  return true;
}

export function livingSymbiontProtects(state: GameState, prey: Animal): boolean {
  return prey.traits.some((t) => {
    if (t.hidden || t.disabled || t.type !== "symbiosis" || t.pairRole !== "b" || !t.pairWith) return false;
    return Boolean(findAnimal(state, t.pairWith));
  });
}

/**
 * Проверка атаки целиком из реестра: симметричная вода, правила защиты
 * жертвы (камуфляж/большое/норное) читаются из TraitDef.protection.
 */
export function canAttack(state: GameState, carnivore: Animal, prey: Animal): boolean {
  if (carnivore.id === prey.id) return false;
  if (!hasTrait(carnivore, "carnivore")) return false;
  if (carnivore.hibernating) return false;
  if (isFed(carnivore) && emptyFatSlots(carnivore) === 0) return false;

  // Шов под «Континенты»: зоны размещения; в базовой игре зоны нет — атака разрешена.
  if (state.modules.continents && carnivore.zoneId !== prey.zoneId) return false;

  if (livingSymbiontProtects(state, prey)) return false;
  const aquaticRule = [...carnivore.traits, ...prey.traits].some(
    (t) => isActive(t) && TRAITS[t.type].symmetricAquatic,
  );
  if (aquaticRule && hasTrait(carnivore, "swimming") !== hasTrait(prey, "swimming")) return false;
  for (const t of prey.traits) {
    if (!isActive(t)) continue;
    const rule = TRAITS[t.type].protection;
    if (!rule) continue;
    if (rule.stealthBypass && !hasTrait(carnivore, rule.stealthBypass)) return false;
    if (rule.needsBulkyAttacker && !hasTrait(carnivore, "highBodyWeight")) return false;
    if (rule.safeWhenFed && isFed(prey)) return false;
  }
  return true;
}

export function animalValue(animal: Animal): number {
  let v = 2;
  for (const t of animal.traits) {
    if (!isActive(t)) continue;
    v += 1 + TRAITS[t.type].scoreBonus;
  }
  return v;
}

export function visibleTraits(animal: Animal) {
  return animal.traits.filter((t) => !t.hidden);
}

export function nextPlayerId(state: GameState, from = state.currentPlayerId): number {
  const n = state.players.length;
  return (from + 1) % n;
}
