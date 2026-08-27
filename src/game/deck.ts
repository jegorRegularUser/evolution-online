import type { Card, ModuleId, TraitId } from "./types.ts";

const SINGLES: Array<[TraitId, number]> = [
  ["mimicry", 4],
  ["swimming", 8],
  ["poisonous", 4],
  ["running", 4],
  ["piracy", 4],
  ["tailLoss", 4],
  ["scavenger", 4],
  ["symbiosis", 4],
];

const DUALS: Array<[TraitId, TraitId, number]> = [
  ["parasite", "carnivore", 4],
  ["parasite", "fatTissue", 4],
  ["highBodyWeight", "carnivore", 4],
  ["highBodyWeight", "fatTissue", 4],
  ["communication", "carnivore", 4],
  ["cooperation", "carnivore", 4],
  ["cooperation", "fatTissue", 4],
  ["burrowing", "fatTissue", 4],
  ["camouflage", "fatTissue", 4],
  ["sharpVision", "fatTissue", 4],
  ["grazing", "fatTissue", 4],
  ["hibernation", "carnivore", 4],
];

/**
 * Карты «Континентов» (Правильные игры, 2012): 42 карты восьми новых свойств.
 * Миграция крупнее всех, прилипала идёт в комплекте к ней.
 * Миграция, прилипала и часть паразитов идут с гранью «водоплавающее»:
 * карта даёт выбор одного из двух свойств.
 */
const CONTINENTS_SINGLES: Array<[TraitId, number]> = [
  ["herding", 4],
  ["nematocysts", 6],
  ["edificator", 6],
  ["regeneration", 4],
];

/** [лицо 1, лицо 2, количество] — две грани на выбор. */
const CONTINENTS_DUALS: Array<[TraitId, TraitId, number]> = [
  ["migration", "swimming", 8],
  ["remora", "swimming", 6],
  ["parasite", "swimming", 2],
];

/** Рекомбинация — парная карта; неоплазия кладётся «под» свойства. */
const CONTINENTS_PAIRS: Array<[TraitId, number]> = [
  ["recombination", 4],
  ["neoplasia", 2],
];

export const DECK_SIZE = SINGLES.reduce((n, [, c]) => n + c, 0) + DUALS.reduce((n, [, , c]) => n + c, 0);

export function continentsDeckSize(): number {
  return (
    CONTINENTS_SINGLES.reduce((n, [, c]) => n + c, 0) +
    CONTINENTS_DUALS.reduce((n, [, , c]) => n + c, 0) +
    CONTINENTS_PAIRS.reduce((n, [, c]) => n + c, 0)
  );
}

export const BASE_DECK_SIZE = DECK_SIZE;

export function buildDeck(nextId: (prefix: string) => string, modules?: Partial<Record<ModuleId, boolean>>): Card[] {
  const cards: Card[] = [];
  for (const [trait, n] of SINGLES) {
    for (let i = 0; i < n; i++) {
      cards.push({ id: nextId("c"), faces: [trait] });
    }
  }
  for (const [a, b, n] of DUALS) {
    for (let i = 0; i < n; i++) {
      cards.push({ id: nextId("c"), faces: [a, b] });
    }
  }
  if (modules?.continents) {
    for (const [trait, n] of CONTINENTS_SINGLES) {
      for (let i = 0; i < n; i++) {
        cards.push({ id: nextId("c"), faces: [trait] });
      }
    }
    // Карты с гранью «водоплавающее»: игрок выбирает одну из двух граней.
    for (const [a, b, n] of CONTINENTS_DUALS) {
      for (let i = 0; i < n; i++) {
        cards.push({ id: nextId("c"), faces: [a, b] });
      }
    }
    for (const [trait, n] of CONTINENTS_PAIRS) {
      for (let i = 0; i < n; i++) {
        cards.push({ id: nextId("c"), faces: [trait] });
      }
    }
  }
  return cards;
}

