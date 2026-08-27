import type { Plant, PlantKind } from "./types.ts";

/**
 * Реестр растений дополнения «Растения» (Правильные игры, 2016).
 *
 * Схема разрастания читается как на картах: «N → M» — если в фазу роста на
 * растении N фишек, их становится M; строка «3+ → 5» значит «три и больше».
 * Золотое правило: фишек не может быть больше максимума строки.
 *
 * Официальный PDF правил не публикует стартовые значения Злака, Лианы и Гриба
 * и максимум Гриба — они восстановлены по иллюстрациям правил и картам
 * (Злак — единственный пробел) и помечены «(реконструкция)».
 */
export interface PlantDef {
  kind: PlantKind;
  name: string;
  description: string;
  /** Фишек на растении при появлении. */
  startFood: number;
  /** Максимум фишек (золотое правило). */
  maxFood: number;
  /** Строки схемы разрастания, отсортированы по убыванию «от». */
  growth: Array<[number, number]>;
  /** Значков убежища на самой карте. */
  shelters: number;
  /** Значок «плод» слева вверху: хищники могут есть с этого растения. */
  carnivoreEdible: boolean;
  /** Эвристика для ИИ: насколько это растение ценно столу. */
  aiValue: number;
}

export const PLANTS: Record<PlantKind, PlantDef> = {
  perennial: {
    kind: "perennial",
    name: "Многолетник",
    description:
      "Разрастается по схеме 1→2, 2→3, 3+→5 (максимум 5 фишек). Появляется с 3 фишками.",
    startFood: 3,
    maxFood: 5,
    growth: [
      [3, 5],
      [2, 3],
      [1, 2],
    ],
    shelters: 0,
    carnivoreEdible: false,
    aiValue: 4,
  },
  annual: {
    kind: "annual",
    name: "Однолетник",
    description:
      "Разрастается по схеме 0→1, 1→2, 2+→3 (максимум 3). Единственное растение, которое выживает без фишек: в конце фазы роста получает 1 фишку.",
    startFood: 2,
    maxFood: 3,
    growth: [
      [2, 3],
      [1, 2],
      [0, 1],
    ],
    shelters: 0,
    carnivoreEdible: false,
    aiValue: 3,
  },
  fruit: {
    kind: "fruit",
    name: "Плодовое",
    description:
      "Разрастается по схеме 1→5, 2→4, 3+→3 (максимум 5): при 3–4 фишках ждёт неурожай. Даёт 1 убежище. Хищники могут брать с него еду.",
    startFood: 2,
    maxFood: 5,
    growth: [
      [3, 3],
      [2, 4],
      [1, 5],
    ],
    shelters: 1,
    carnivoreEdible: true,
    aiValue: 4,
  },
  succulent: {
    kind: "succulent",
    name: "Суккулент",
    description:
      "Разрастается по схеме 1→2, 2→3, 3+→4 (максимум 4). Даёт 1 убежище. Хищники могут брать с него еду.",
    startFood: 3,
    maxFood: 4,
    growth: [
      [3, 4],
      [2, 3],
      [1, 2],
    ],
    shelters: 1,
    carnivoreEdible: true,
    aiValue: 4,
  },
  legume: {
    kind: "legume",
    name: "Бобовое",
    description: "Разрастается по схеме 1→3, 2→4, 3+→5 (максимум 5) — всегда на +2.",
    startFood: 2,
    maxFood: 5,
    growth: [
      [3, 5],
      [2, 4],
      [1, 3],
    ],
    shelters: 0,
    carnivoreEdible: false,
    aiValue: 4,
  },
  grass: {
    kind: "grass",
    name: "Злак",
    description:
      "Разрастается по схеме 1→2, 2→4, 3+→5 (максимум 5). Появляется с 2 фишками (реконструкция схемы по иллюстрации правил).",
    startFood: 2,
    maxFood: 5,
    growth: [
      [3, 5],
      [2, 4],
      [1, 2],
    ],
    shelters: 0,
    carnivoreEdible: false,
    aiValue: 3,
  },
  liana: {
    kind: "liana",
    name: "Лиана",
    description:
      "В фазу роста на неё кладётся столько фишек, сколько на столе растений, не являющихся лианами (паразиты учитываются). Максимум 6 (реконструкция).",
    startFood: 1,
    maxFood: 6,
    growth: [],
    shelters: 0,
    carnivoreEdible: false,
    aiValue: 3,
  },
  fungus: {
    kind: "fungus",
    name: "Гриб",
    description:
      "Всякий раз, когда погибает любое животное, на каждом грибе появляется 1 фишка (максимум 6 — реконструкция). Хищники могут брать с него еду.",
    startFood: 0,
    maxFood: 6,
    growth: [],
    shelters: 0,
    carnivoreEdible: true,
    aiValue: 3,
  },
  carnivorous: {
    kind: "carnivorous",
    name: "Хищное",
    description:
      "Раз в фазу питания атакует: контратакует животное, тянущее с него еду (игнорируя одну его защиту), либо один из игроков направляет его на чужое животное. Съело животное — 2 фишки, получило хвост — 1. Съело ядовитое — погибает в вымирание. Максимум 6 фишек, стартует пустым. Хищники могут брать с него еду.",
    startFood: 0,
    maxFood: 6,
    growth: [],
    shelters: 0,
    carnivoreEdible: true,
    aiValue: 4,
  },
  parasite: {
    kind: "parasite",
    name: "Растение-Паразит",
    description:
      "Самостоятельное растение со своими свойствами. Не считается в максимуме растений. Ход питания: вместо еды можно перекинуть с хозяина на паразита 1 фишку (не последнюю). Выживает без фишек; погибает вместе с хозяином.",
    startFood: 0,
    maxFood: 6,
    growth: [],
    shelters: 0,
    carnivoreEdible: false,
    aiValue: 2,
  },
};

/** Сколько фишек станет на растении в фазу роста по его схеме. */
export function growthTarget(def: PlantDef, current: number): number {
  for (const [from, to] of def.growth) {
    if (current >= from) return Math.min(to, def.maxFood);
  }
  return current;
}

/** Стол растений по числу игроков: старт, добавка за год, максимум на столе. */
export interface PlantTable {
  initial: number;
  add: number;
  max: number;
}

const PLANT_TABLE: Record<number, PlantTable> = {
  2: { initial: 3, add: 1, max: 6 },
  3: { initial: 4, add: 2, max: 8 },
  4: { initial: 5, add: 3, max: 10 },
  5: { initial: 6, add: 3, max: 12 },
  6: { initial: 7, add: 3, max: 14 },
  7: { initial: 8, add: 4, max: 16 },
  8: { initial: 9, add: 4, max: 18 },
};

export function plantTable(playerCount: number): PlantTable {
  return PLANT_TABLE[Math.min(Math.max(playerCount, 2), 8)]!;
}

/** Колода растений: 9 видов × 4 копии = 36 карт. */
export function plantDeckKinds(): PlantKind[] {
  const kinds: PlantKind[] = [
    "perennial",
    "annual",
    "fruit",
    "succulent",
    "legume",
    "grass",
    "liana",
    "fungus",
    "carnivorous",
  ];
  return kinds.flatMap((k) => [k, k, k, k]);
}

/** Вместимость убежищ растения: значки карты + бонусы свойств (колючее 3, дерево 1). */
export function shelterCapacity(plant: Plant): number {
  let cap = PLANTS[plant.kind].shelters;
  for (const t of plant.traits) {
    if (t.type === "thorny") cap += 3;
    if (t.type === "tree") cap += 1;
  }
  return cap;
}
