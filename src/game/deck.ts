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

/**
 * «Растения» (Правильные игры, 2016): 36 двусторонних карт свойств
 * «свойство растения / альтернативное свойство животного». Состав пар —
 * по официальной распечатке издательского состава (по 4 копии каждой).
 */
const PLANTS_DUALS: Array<[TraitId, TraitId, number]> = [
  ["nutritious", "swimming", 4],
  ["micorrhiza", "swimming", 4],
  ["rootVegetable", "fatTissue", 4],
  ["honeyPlant", "highBodyWeight", 4],
  ["thorny", "cooperation", 4],
  ["plantWater", "burrowing", 4],
  ["medicinal", "carnivore", 4],
  ["tree", "carnivore", 4],
  ["plantParasite", "parasite", 4],
];

/**
 * «Трава и грибы» (Правильные игры, 2019): 8 карт свойств животных
 * «Прозрачное» и «Насекомоядное» — по 4 копии (состав по комплекту).
 * Сами 24 длинные карты флоры ходят отдельной колодой (см. flora.ts).
 */
const FUNGI_SINGLES: Array<[TraitId, number]> = [
  ["transparent", 4],
  ["insectivore", 4],
];

/**
 * «Случайные мутации» (Правильные игры, 2013): 7 новых свойств, по 4 копии
 * (точный состав коробки из 90 карт не опубликован — реконструкция).
 * Разница с остальными колодами не в картах, а в раздаче: личные слепые
 * колоды игроков вместо руки (см. engine.ts, devMutate).
 */
const MUTATIONS_SINGLES: Array<[TraitId, number]> = [
  ["obligateCarnivore", 4],
  ["budding", 4],
  ["metabolicSyndrome", 4],
  ["barkBeetle", 4],
  ["extremophile", 4],
  ["developmentDefects", 4],
  ["simplification", 4],
];

export function plantsDeckSize(): number {
  return PLANTS_DUALS.reduce((n, [, , c]) => n + c, 0);
}

export function fungiDeckSize(): number {
  return FUNGI_SINGLES.reduce((n, [, c]) => n + c, 0);
}

export function mutationsDeckSize(): number {
  return MUTATIONS_SINGLES.reduce((n, [, c]) => n + c, 0);
}

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
  if (modules?.plants) {
    // Двусторонние карты: свойство растения либо свойство животного.
    for (const [a, b, n] of PLANTS_DUALS) {
      for (let i = 0; i < n; i++) {
        cards.push({ id: nextId("c"), faces: [a, b] });
      }
    }
  }
  if (modules?.fungi) {
    for (const [trait, n] of FUNGI_SINGLES) {
      for (let i = 0; i < n; i++) {
        cards.push({ id: nextId("c"), faces: [trait] });
      }
    }
  }
  if (modules?.randomMutations) {
    for (const [trait, n] of MUTATIONS_SINGLES) {
      for (let i = 0; i < n; i++) {
        cards.push({ id: nextId("c"), faces: [trait] });
      }
    }
  }
  return cards;
}

