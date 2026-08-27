import type { FloraKind, PlantKind, TraitId } from "@/game/types";

/**
 * Реестр арт-ассетов (public/img, собираются scripts/build-art.mjs из assets/).
 * Стиль: винтажный натуралистический атлас — тушь и акварель на пергаменте.
 */

/**
 * Арт карт свойств. У mimicry арт — гравюра на чёрном (см. DARK_ART).
 * Свойства «Континентов» имеют собственные картинки; если какой-то ключ
 * временно без арта, UI рисует векторный глиф (см. hasTraitArt).
 */
export const TRAIT_ART: Partial<Record<TraitId, string>> = {
  carnivore: "/img/trait/carnivore.jpg",
  swimming: "/img/trait/swimming.jpg",
  camouflage: "/img/trait/camouflage.jpg",
  sharpVision: "/img/trait/sharpVision.jpg",
  burrowing: "/img/trait/burrowing.jpg",
  scavenger: "/img/trait/scavenger.jpg",
  symbiosis: "/img/trait/symbiosis.jpg",
  piracy: "/img/trait/piracy.jpg",
  tailLoss: "/img/trait/tailLoss.jpg",
  grazing: "/img/trait/grazing.jpg",
  cooperation: "/img/trait/cooperation.jpg",
  running: "/img/trait/running.jpg",
  highBodyWeight: "/img/trait/highBodyWeight.jpg",
  parasite: "/img/trait/parasite.jpg",
  fatTissue: "/img/trait/fatTissue.jpg",
  communication: "/img/trait/communication.jpg",
  poisonous: "/img/trait/poisonous.jpg",
  hibernation: "/img/trait/hibernation.jpg",
  mimicry: "/img/trait/mimicry.jpg",
  // Дополнение «Континенты»
  migration: "/img/trait/migration.jpg",
  remora: "/img/trait/remora.jpg",
  herding: "/img/trait/herding.jpg",
  nematocysts: "/img/trait/nematocysts.jpg",
  regeneration: "/img/trait/regeneration.jpg",
  recombination: "/img/trait/recombination.jpg",
  edificator: "/img/trait/edificator.jpg",
  neoplasia: "/img/trait/neoplasia.jpg",
  // Дополнение «Растения»
  plantWater: "/img/trait/plantWater.jpg",
  thorny: "/img/trait/thorny.jpg",
  rootVegetable: "/img/trait/rootVegetable.jpg",
  medicinal: "/img/trait/medicinal.jpg",
  plantParasite: "/img/trait/plantParasite.jpg",
  micorrhiza: "/img/trait/micorrhiza.jpg",
  tree: "/img/trait/tree.jpg",
  nutritious: "/img/trait/nutritious.jpg",
  honeyPlant: "/img/trait/honeyPlant.jpg",
  // Дополнение «Трава и грибы» (арта пока нет — UI рисует глифы)
  // transparent: "/img/trait/transparent.jpg",
  // insectivore: "/img/trait/insectivore.jpg",
  // Дополнение «Случайные мутации» (арта пока нет — UI рисует глифы)
  // obligateCarnivore: "/img/trait/obligateCarnivore.jpg",
  // budding: "/img/trait/budding.jpg",
  // metabolicSyndrome: "/img/trait/metabolicSyndrome.jpg",
  // barkBeetle: "/img/trait/barkBeetle.jpg",
  // extremophile: "/img/trait/extremophile.jpg",
  // developmentDefects: "/img/trait/developmentDefects.jpg",
  // simplification: "/img/trait/simplification.jpg",
};

/** Есть ли сгенерированная картинка свойства; нет — UI рисует векторный глиф. */
export function hasTraitArt(id: TraitId): boolean {
  return Boolean(TRAIT_ART[id]);
}

/**
 * Арты с чёрным фоном рисуются на тёмной плашке. Сейчас все карты сделаны
 * в одном пергаментном стиле, поэтому набор пуст — исключения добавляются сюда.
 */
export const DARK_ART: ReadonlySet<TraitId> = new Set<TraitId>();

/** Медальон вида по рациону и телосложению. */
export function speciesArt(opts: { swimming?: boolean; carnivore?: boolean; bulky?: boolean }): string {
  if (opts.swimming) return "/img/species/aquatic.jpg";
  if (opts.carnivore) return opts.bulky ? "/img/species/carn-large.jpg" : "/img/species/carn-medium.jpg";
  return opts.bulky ? "/img/species/herb-large.jpg" : "/img/species/herb-medium.jpg";
}

export const SPECIES_EXTINCT = "/img/species/extinct.jpg";

/**
 * Жетоны еды. red — фишка из кормовой базы, blue — мясо и всё, что приходит
 * от свойств (охота, сотрудничество, пиратство, падальщик, хвост, жир).
 */
export const TOKEN = {
  meat: "/img/token/meat.jpg",
  red: "/img/token/meat.jpg",
  blue: "/img/token/blue.jpg",
  plant: "/img/token/plant.jpg",
  fat: "/img/token/fat.jpg",
} as const;

/** Фоны и крупные декорации. */
export const BG = {
  menu: "/img/bg/menu.jpg",
  valley: "/img/bg/valley.jpg",
  extinction: "/img/bg/extinction.jpg",
  victory: "/img/bg/victory.jpg",
  bankBowl: "/img/bg/bank-bowl.jpg",
  cardBack: "/img/meta/card-back.jpg",
  /** Бумажная текстура: подложка всего стола («всё лежит на бумаге»). */
  paper: "/img/bg/texture-paper.jpg",
  /** Сукно: центральное поле кормовой базы. */
  felt: "/img/bg/texture-felt.jpg",
  /** Вода: полоса океана в табло игрока. */
  water: "/img/bg/texture-water.jpg",
  ocean: "/img/bg/ocean.jpg",
} as const;

export const LOGO = "/img/meta/logo-emblem.png";

/** Иконка фазы года (гравюра на чёрном). */
export const PHASE_ICON: Partial<Record<string, string>> = {
  development: "/img/phase/development.png",
  foodBank: "/img/phase/roll-food.png",
  feeding: "/img/phase/feeding.png",
  extinction: "/img/phase/extinction.png",
};

/** Арты территорий «Континентов»: фон полос и миниатюры банков. */
export const TERRITORY_ART: Record<"laurasia" | "gondwana" | "ocean", string> = {
  laurasia: "/img/world/laurasia.jpg",
  gondwana: "/img/world/gondwana.jpg",
  ocean: "/img/world/ocean.jpg",
};

/** Арты видов растений «Растений» (4:3, верх карточки растения). */
export const PLANT_ART: Partial<Record<PlantKind, string>> = {
  liana: "/img/plant/liana.jpg",
  fungus: "/img/plant/fungus.jpg",
  carnivorous: "/img/plant/carnivorous.jpg",
  annual: "/img/plant/annual.jpg",
  legume: "/img/plant/legume.jpg",
  perennial: "/img/plant/perennial.jpg",
  grass: "/img/plant/grass.jpg",
  succulent: "/img/plant/succulent.jpg",
  fruit: "/img/plant/fruit.jpg",
  parasite: "/img/plant/parasite.jpg",
};

/**
 * Арты карт флоры «Травы и грибов» (4:3). Пока картинок нет — карточка
 * рисует векторный глиф (гриб/травинка) и цветную рамку происхождения.
 */
export const FLORA_ART: Partial<Record<FloraKind, string>> = {
  // toadstool: "/img/flora/toadstool.jpg",
  // mold: "/img/flora/mold.jpg",
  // madCap: "/img/flora/madCap.jpg",
  // flyAgaric: "/img/flora/flyAgaric.jpg",
  // insight: "/img/flora/insight.jpg",
  // soaring: "/img/flora/soaring.jpg",
  // sleepGrass: "/img/flora/sleepGrass.jpg",
  // thryn: "/img/flora/thryn.jpg",
  // datura: "/img/flora/datura.jpg",
  // smile: "/img/flora/smile.jpg",
  // cleanser: "/img/flora/cleanser.jpg",
  // passionflower: "/img/flora/passionflower.jpg",
};
