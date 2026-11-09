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
  /** Путь к картинке предмета (аватары-существа: public/img/species/*). */
  imageSrc?: string;
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
  // ── рубашки карт (слот cardback) — CSS-скины поверх текстур ──
  {
    id: "cardback.classic",
    slot: "cardback",
    rarity: "common",
    price: 0,
    titleKey: "shop.cardback.classic",
    cssClass: "cardback-skin-classic",
  },
  {
    id: "cardback.malachite",
    slot: "cardback",
    rarity: "common",
    price: 150,
    titleKey: "shop.cardback.malachite",
    cssClass: "cardback-skin-malachite",
  },
  {
    id: "cardback.crimson",
    slot: "cardback",
    rarity: "rare",
    price: 400,
    titleKey: "shop.cardback.crimson",
    cssClass: "cardback-skin-crimson",
  },
  // ── аватары-существа (слот avatar) — готовые арты видов, без нового арта ──
  {
    id: "avatar.aquatic",
    slot: "avatar",
    rarity: "common",
    price: 150,
    titleKey: "shop.avatar.aquatic",
    cssClass: "avatar-skin-aquatic",
    imageSrc: "/img/species/aquatic.jpg",
  },
  {
    id: "avatar.herb-large",
    slot: "avatar",
    rarity: "common",
    price: 150,
    titleKey: "shop.avatar.herbLarge",
    cssClass: "avatar-skin-herbLarge",
    imageSrc: "/img/species/herb-large.jpg",
  },
  {
    id: "avatar.carn-medium",
    slot: "avatar",
    rarity: "common",
    price: 150,
    titleKey: "shop.avatar.carnMedium",
    cssClass: "avatar-skin-carnMedium",
    imageSrc: "/img/species/carn-medium.jpg",
  },
  {
    id: "avatar.carn-large",
    slot: "avatar",
    rarity: "rare",
    price: 400,
    titleKey: "shop.avatar.carnLarge",
    cssClass: "avatar-skin-carnLarge",
    imageSrc: "/img/species/carn-large.jpg",
  },
];

// ── Учёные: встроенный бесплатный набор аватаров (вне магазина) ──
// Ключи совпадают с AI_NAMES (engine.ts) в нижнем регистре латиницей; арты —
// public/img/avatar/<key>.svg|jpg (реестр AVATAR_ART в lib/art.ts). Портрет
// бота подбирается по имени, человеку без выбора — детерминированный по хэшу
// имени: «по умолчанию разные», как решил владелец.
export const SCIENTIST_AVATARS = [
  "darwin",
  "wallace",
  "mendel",
  "linnaeus",
  "cuvier",
  "lamarck",
  "haeckel",
  "baer",
] as const;

export type ScientistAvatar = (typeof SCIENTIST_AVATARS)[number];

/** Форма ключа аватара места: встроенный учёный или предмет каталога. */
export type SeatAvatar = `sci.${ScientistAvatar}` | string;

export function isScientistAvatarKey(key: string): key is `sci.${ScientistAvatar}` {
  if (!key.startsWith("sci.")) return false;
  return (SCIENTIST_AVATARS as readonly string[]).includes(key.slice(4));
}

/** FNV-1a по имени: стабильный выбор учёного «по умолчанию». */
function nameHash(name: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Аватар по умолчанию: боту — портрет его учёного (имя совпадает), человеку
 * без выбора — детерминированный по хэшу имени, чтобы за столом учёные
 * не повторялись у всех подряд.
 */
export function defaultAvatarForSeat(name: string, isAI: boolean): SeatAvatar {
  if (isAI) {
    const base = name.replace(/\s+\d+$/, "").toLowerCase();
    // Латинские имена локализации не совпадают с русскими AI_NAMES, поэтому
    // маппим по словарю; неизвестное имя (переименованный бот) — по хэшу.
    const map: Record<string, ScientistAvatar> = {
      "дарвин": "darwin",
      "уоллес": "wallace",
      "мендель": "mendel",
      "линней": "linnaeus",
      "кювье": "cuvier",
      "ламарк": "lamarck",
      "геккель": "haeckel",
      "darwin": "darwin",
      "wallace": "wallace",
      "mendel": "mendel",
      "linnaeus": "linnaeus",
      "cuvier": "cuvier",
      "lamarck": "lamarck",
      "haeckel": "haeckel",
      "baer": "baer",
    };
    const hit = map[base];
    if (hit) return `sci.${hit}`;
  }
  const idx = nameHash(name) % SCIENTIST_AVATARS.length;
  return `sci.${SCIENTIST_AVATARS[idx]}`;
}

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
