/**
 * Каталог косметики v1 (волна 3б, дизайн-пакет §3). Продаётся только ВИДИМОЕ
 * за столом: сукно и кубик — купил/экипировал/все видят (видимость = ценность).
 * Рубашки карт, аватары и рамки появятся вместе со своими рендер-пайплайнами;
 * продавать невидимое — из саботаж-листа §3.3.
 *
 * Рендер — CSS-классы (перекраска переменными = «5 скинов из 1 файла», §3.4),
 * для кубика — id материала three.js (dice-3d). Никаких новых артов: это
 * аксессуары к настолке, а не контент.
 *
 * Цены в «Ископаемых» (только заработок, §3.2): обычный 150, редкий 400.
 */
// Импорты только ТИПОВЫЕ (стираются): модуль читается и серверным сервисом
// (тесты на голом node без алиасов "@"), и клиентским экраном магазина.
import type { CosmeticSlot } from "./profile/shared.ts";
import type { TKey } from "./i18n";

export type CosmeticRarity = "common" | "rare";

export interface CosmeticItem {
  id: string;
  slot: CosmeticSlot;
  rarity: CosmeticRarity;
  /** Цена в «Ископаемых» (только earned-валюта, §3.2). */
  price: number;
  titleKey: TKey;
  /** CSS-класс предмета (сукно: фон сукна; кубик — индикатор скина). */
  cssClass: string;
  /** Материал кубика для dice-3d (только слот dice). */
  diceMaterial?: "bone" | "amber" | "obsidian";
  /**
   * Тон граней кубика для Dice3D (только слот dice); undefined — дефолтный
   * красный кормовой базы. Значения копируют DICE_TINTS в game-app.tsx —
   * тот там не экспортируется, менять надо синхронно в обоих местах.
   */
  diceTint?: string;
}

export const COSMETIC_ITEMS: CosmeticItem[] = [
  // ── сукно стола (слот felt) ──
  {
    id: "felt.classic",
    slot: "felt",
    rarity: "common",
    price: 0,
    titleKey: "shop.felt.classic",
    cssClass: "felt-skin-classic",
  },
  {
    id: "felt.tundra",
    slot: "felt",
    rarity: "common",
    price: 150,
    titleKey: "shop.felt.tundra",
    cssClass: "felt-skin-tundra",
  },
  {
    id: "felt.savanna",
    slot: "felt",
    rarity: "common",
    price: 150,
    titleKey: "shop.felt.savanna",
    cssClass: "felt-skin-savanna",
  },
  {
    id: "felt.glacial",
    slot: "felt",
    rarity: "rare",
    price: 400,
    titleKey: "shop.felt.glacial",
    cssClass: "felt-skin-glacial",
  },
  // ── кубик (слот dice) ──
  {
    id: "dice.bone",
    slot: "dice",
    rarity: "common",
    price: 0,
    titleKey: "shop.dice.bone",
    cssClass: "dice-skin-bone",
    diceMaterial: "bone",
    diceTint: undefined, // классика — дефолтный красный кормовой базы
  },
  {
    id: "dice.amber",
    slot: "dice",
    rarity: "common",
    price: 150,
    titleKey: "shop.dice.amber",
    cssClass: "dice-skin-amber",
    diceMaterial: "amber",
    diceTint: "#c9861f",
  },
  {
    id: "dice.obsidian",
    slot: "dice",
    rarity: "rare",
    price: 400,
    titleKey: "shop.dice.obsidian",
    cssClass: "dice-skin-obsidian",
    diceMaterial: "obsidian",
    diceTint: "#4a4452",
  },
];

/** «Классика» каждого слота — бесплатна и экипирована по умолчанию. */
export function defaultItemForSlot(slot: CosmeticSlot): CosmeticItem | undefined {
  return COSMETIC_ITEMS.find((item) => item.slot === slot && item.price === 0);
}

export function cosmeticById(id: string): CosmeticItem | undefined {
  return COSMETIC_ITEMS.find((item) => item.id === id);
}

/** Серверный белый список покупки: id каталога + цена на сервере, не в клиенте. */
export const COSMETIC_PRICES: Record<string, number> = Object.fromEntries(
  COSMETIC_ITEMS.map((item) => [item.id, item.price]),
);
