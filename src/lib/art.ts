import type { TraitId } from "@/game/types";

/**
 * Реестр арт-ассетов (public/img, собираются scripts/build-art.mjs из assets/).
 * Стиль: винтажный натуралистический атлас — тушь и акварель на пергаменте.
 */

/** Арт карт свойств. У mimicry арт — гравюра на чёрном (см. DARK_ART). */
export const TRAIT_ART: Record<TraitId, string> = {
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
};

/** Арты с чёрным фоном: в пергаментных карточках кладутся на тёмную плашку. */
export const DARK_ART: ReadonlySet<TraitId> = new Set<TraitId>(["mimicry"]);

/** Медальон вида по рациону и телосложению. */
export function speciesArt(opts: { swimming?: boolean; carnivore?: boolean; bulky?: boolean }): string {
  if (opts.swimming) return "/img/species/aquatic.jpg";
  if (opts.carnivore) return opts.bulky ? "/img/species/carn-large.jpg" : "/img/species/carn-medium.jpg";
  return opts.bulky ? "/img/species/herb-large.jpg" : "/img/species/herb-medium.jpg";
}

export const SPECIES_EXTINCT = "/img/species/extinct.jpg";

/** Жетоны еды. */
export const TOKEN = {
  meat: "/img/token/meat.jpg",
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
} as const;

export const LOGO = "/img/meta/logo-emblem.png";

/** Иконка фазы года (гравюра на чёрном). */
export const PHASE_ICON: Partial<Record<string, string>> = {
  development: "/img/phase/development.png",
  foodBank: "/img/phase/roll-food.png",
  feeding: "/img/phase/feeding.png",
  extinction: "/img/phase/extinction.png",
};
