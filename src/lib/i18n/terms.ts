/**
 * СЛОВАРЬ ТЕРМИНОВ «Эволюции» для английской локализации.
 *
 * Зачем: русские названия и описания живут в данных игры
 * (`src/game/traits.ts`, `src/game/flora.ts`, `src/game/plants.ts`,
 * `src/game/types.ts`, `src/lib/stats.ts`) — там же остаются источником
 * правды для ru. Этот файл — английские соответствия: имена и описания
 * свойств, видов флоры, растений, меток последствий, территорий и
 * достижений. Терминология следует англоязычным изданиям настольной
 * «Эволюции» (Carnivorous, Camouflage, Sharp Vision, High Body Weight,
 * Fat Tissue, Running, Swimming, Tail Loss, Hibernation, Mimicry,
 * Scavenger, Piracy, Symbiosis, Communication, Cooperation, Burrowing;
 * «Континенты»: Migration, Herding, Nematocysts, Remora, Regeneration,
 * Recombination, Edificator, Neoplasia; и т.д.).
 *
 * КАК ПОЛЬЗОВАТЬСЯ (следующий агент): не тащите переводы в данные игры —
 * берите готовые хелперы из `src/lib/i18n/index.ts`:
 *   traitName(id) / traitDesc(id) / traitShort(id) / floraName(k) / floraDesc(k) /
 *   plantName(k) / plantDesc(k) / markName(k) / markDesc(k) / markShort(k) /
 *   territoryName(id) / achievementName(id) / achievementDesc(id) /
 *   scientistName(name) — имена ботов-учёных (Дарвин → Darwin).
 * Они читают текущий язык из стора и сами возвращают русский текст из
 * данных игры, если английского нет. Для строк стора/сервера
 * (системные записи, ошибки) кладите ключи в ru.ts/en.ts, а имена
 * свойств внутри шаблонов подставляйте этими хелперами.
 *
 * Если добавляется новое свойство в src/game/traits.ts — добавьте
 * запись и сюда, иначе правила/тултипы покажут русское название.
 */
import { FLORA, MARKS } from "@/game/flora";
import { PLANTS } from "@/game/plants";
import { TRAITS } from "@/game/traits";
import { TERRITORIES } from "@/game/types";
import { ACHIEVEMENTS } from "@/lib/stats";
import { currentLang, type Lang } from "./store";

/** Английское имя + описание игрового термина. */
export interface TermEn {
  name: string;
  desc: string;
}

// ── Свойства животных и растений ────────────────────────────────────────────
// Ключи совпадают с TraitId из src/game/types.ts.

export const TRAIT_EN: Record<string, TermEn> = {
  carnivore: {
    name: "Carnivorous",
    desc: "Instead of taking food, a carnivore attacks another animal and, on success, gets 2 blue tokens. Hunting and eating from the food bank can't be combined in one turn; each carnivore attacks once per turn. A fed carnivore doesn't hunt. Food requirement +1.",
  },
  swimming: {
    name: "Swimming",
    desc: "Only a swimming carnivore can eat this animal — and a swimming carnivore can only hunt swimming prey. With “Continents”, the animal moves to the Ocean right away.",
  },
  camouflage: {
    name: "Camouflage",
    desc: "A carnivore cannot see this animal: only a carnivore with “Sharp Vision” can attack it.",
  },
  sharpVision: {
    name: "Sharp Vision",
    desc: "Spots the hidden: a carnivore with sharp vision can attack animals with “Camouflage”.",
  },
  burrowing: {
    name: "Burrowing",
    desc: "While the animal is fed, carnivores leave it alone. Fat tissue doesn't count as being fed: a hungry animal in a burrow is defenseless.",
  },
  scavenger: {
    name: "Scavenger",
    desc: "Whenever any carnivore eats an animal whole, one scavenger on the table gets 1 blue token: searched in turn order starting from the carnivore's owner. Can't be combined with “Carnivorous” or “Obligate Carnivore”.",
  },
  symbiosis: {
    name: "Symbiosis",
    desc: "The card is placed between two of your animals. The first animal, the symbiont, protects the second: while the symbiont is alive, nothing can eat the second one, but it can only be fed after the symbiont has eaten.",
  },
  piracy: {
    name: "Piracy",
    desc: "Once per turn a hungry pirate steals 1 token from any unfed animal, yours or an opponent's. The token keeps its color; after stealing, food from the bank is unavailable this turn. A fed pirate doesn't steal.",
  },
  tailLoss: {
    name: "Tail Loss",
    desc: "When this animal is attacked, discard this card: the animal survives and the carnivore gets 1 blue token instead of two. Also saves from a carnivorous plant.",
  },
  grazing: {
    name: "Grazing",
    desc: "Once per turn the animal can trample 1 food token: from the food bank, a plant, or a flora card. Trampling can be combined with eating in the same turn.",
  },
  cooperation: {
    name: "Cooperation",
    desc: "A card between two animals: when one gets food (from the bank, by hunting, or stolen), the other immediately gets 1 blue token. Converting fat into food doesn't trigger it.",
  },
  running: {
    name: "Running",
    desc: "When attacked, roll a die: 4, 5 or 6 and the animal escapes. The carnivore's attack is wasted: it cannot hunt for the rest of this turn (it can try again next turn).",
  },
  highBodyWeight: {
    name: "High Body Weight",
    desc: "Only a carnivore that also has “High Body Weight” can eat this animal. Food requirement +1.",
  },
  parasite: {
    name: "Parasite",
    desc: "Can only be placed on another player's animal. Its food requirement is +2, and at the end of the game 2 extra points go to the animal's owner.",
  },
  fatTissue: {
    name: "Fat Tissue",
    desc: "The only trait that can be placed on an animal multiple times. A fed animal's extra food goes into fat, one token per card. A hungry animal can convert fat into blue tokens at any moment: it's a free action and doesn't spend a turn.",
  },
  communication: {
    name: "Communication",
    desc: "A card between two animals: when one takes a red token from the food bank, the other immediately takes one too. With “Plants” and “Grass and Mushrooms” the partner takes a token from the same plant or flora card.",
  },
  poisonous: {
    name: "Poisonous",
    desc: "A carnivore that eats this animal whole is poisoned and dies in the extinction phase. A mere tail or prey of an “Insectivore” doesn't poison the carnivore.",
  },
  hibernation: {
    name: "Hibernation",
    desc: "The animal sleeps and counts as fed until the end of the year: it no longer takes food, not even into fat tissue. It cannot sleep two years in a row or in the final year; only one of your animals can hibernate per turn.",
  },
  mimicry: {
    name: "Mimicry",
    desc: "When a carnivore attacks, redirect it to another of your animals that it could eat. Redirection can go down a chain, but an animal that has already escaped this attack cannot escape a second time.",
  },

  // ── «Континенты» ────────────────────────────────────────────────────────
  migration: {
    name: "Migration",
    desc: "Declared instead of a normal turn: this turn is only travel — no food, no hunting. Your animals with this trait travel from the Ocean to any continent, and from a continent to the Ocean (swimmers only). There's no direct route between continents; each animal migrates once per feeding phase.",
  },
  remora: {
    name: "Remora",
    desc: "Doesn't travel on its own. When a migration is declared, each remora of the same area may follow the migrant at its owner's choice, resolved in turn order. In the Ocean only swimmers follow. Sleeping remoras stay behind.",
  },
  herding: {
    name: "Herding",
    desc: "Herding animals cannot be attacked while their number is equal to or greater than the number of carnivores in the same territory. The count is shared: all herding animals, even other players', against all carnivores and carnivorous plants of that territory.",
  },
  nematocysts: {
    name: "Nematocysts",
    desc: "Even after an unsuccessful attack, all the attacking carnivore's traits stop working until feeding ends and its food requirement becomes 1. Cards remain and traits recover after starvation is determined. If the attack happened in the Ocean, the paralyzed carnivore is also washed ashore onto a continent.",
  },
  regeneration: {
    name: "Regeneration",
    desc: "Can only be placed on an animal with no traits or one trait that doesn't increase food requirement. Its food requirement can no longer be increased, and it will never have more than two traits. An animal eaten by a carnivore returns to play: in the extinction phase you'll place a card from your hand (or from the deck) as a new animal, with no extra draw for it.",
  },
  recombination: {
    name: "Recombination",
    desc: "A pair card between two animals of the same territory. Once per year, during its owner's feeding turn, each partner gives the other one unpaired trait. A duplicate goes to the discard; a one-shot trait already used by its previous owner (hibernation this year, piracy/grazing this turn) stays spent. A swimmer that loses “Swimming” in the Ocean moves to a continent.",
  },
  edificator: {
    name: "Edificator",
    desc: "Every year each edificator adds 2 food tokens to the bank of the continent it stands on; one standing in the Ocean feeds the Ocean bank. With “Plants” and “Grass and Mushrooms”, continental edificators fertilize the plants and flora of their area instead: 1 token to each card. A sleeping edificator adds nothing.",
  },
  neoplasia: {
    name: "Neoplasia",
    desc: "A virus: placed under all traits of an opponent's animal. Every year at food supply determination it rises and disables another unpaired trait (paired ones are untouched). A disabled trait doesn't work and gives no points; when there's nothing left to disable, the animal dies immediately. “Swimming” in the Ocean is untouched by the virus.",
  },

  // ── «Растения»: свойства растений ────────────────────────────────────────
  plantWater: {
    name: "Water Plant",
    desc: "Plant trait. Only swimming animals can feed from it.",
  },
  thorny: {
    name: "Thorny",
    desc: "Plant trait. Brings 3 shelter tokens to the plant. Nothing touches an animal under shelter until the end of the feeding phase: neither carnivores nor carnivorous plants.",
  },
  rootVegetable: {
    name: "Root Vegetable",
    desc: "Plant trait. The tasty roots go to burrowing animals only.",
  },
  medicinal: {
    name: "Medicinal",
    desc: "Plant trait. The animal gets a token but is sedated until the end of the feeding phase: its traits don't work, only a shelter token can save it. A fed animal's token goes into fat tissue.",
  },
  plantParasite: {
    name: "Plant Parasite",
    desc: "Plant trait. Settles on a host plant and lives as a separate plant: with its own traits and even its own parasites. On your turn, instead of eating, you may move 1 token from the host to the parasite (not the last one). A parasite survives without tokens but dies without its host; it doesn't count toward the plant limit.",
  },
  micorrhiza: {
    name: "Micorrhiza",
    desc: "A trait of two plants at once, placed between them. The link doesn't die of hunger while at least one of its plants has food, and emptied plants get 1 token at the end of the growth phase. One plant can be linked to several.",
  },
  tree: {
    name: "Tree",
    desc: "Plant trait. The branches are high up: only high body weight animals can take food from it. Brings 1 shelter token to the plant.",
  },
  nutritious: {
    name: "Nutritious",
    desc: "Plant trait. Having taken a token, the animal gets one more. Carnivores may eat from this plant.",
  },
  honeyPlant: {
    name: "Honey Plant",
    desc: "Plant trait. Your animal has eaten and draws a random card from the opponent with the fullest hand, if that opponent has more cards than you. No such opponents: no card is drawn.",
  },

  // ── «Трава и грибы»: свойства животных ───────────────────────────────────
  transparent: {
    name: "Transparent",
    desc: "A carnivore won't touch this animal while it has no red or blue token. Fat tissue doesn't count.",
  },
  insectivore: {
    name: "Insectivore",
    desc: "Small prey: for an animal without traits (including one with the “Sleep” mark) the carnivore gets 1 blue token instead of two.",
  },

  // ── «Случайные мутации» ─────────────────────────────────────────────────
  obligateCarnivore: {
    name: "Obligate Carnivore",
    desc: "Hunts once per turn and feeds only on prey: it takes no food from the bank, plants or other players' traits, but a successful attack fills it up completely. Food requirement +1. Can't be combined with “Carnivorous” or “Scavenger”.",
  },
  budding: {
    name: "Budding",
    desc: "At the start of each of your turns in the development phase the species buds one more animal: its card comes from your personal deck. Budding bypasses the usual population limit of “no more than the number of your species”.",
  },
  metabolicSyndrome: {
    name: "Metabolic Syndrome",
    desc: "A harmful mutation: the metabolism is too fast, each animal of the species requires 2 food tokens more. But at the end of the game the mutation brings 2 extra points.",
  },
  barkBeetle: {
    name: "Bark Beetle",
    desc: "A harmful mutation. A hungry animal can't hide in a shelter: instead of protection it gets a blue food token, and the shelter token stays on the plant. For fed animals and obligate carnivores the shelter works as usual.",
  },
  extremophile: {
    name: "Extremophile",
    desc: "A harmful mutation. Species growth comes at a price: each new animal costs an extra card, discarded from your personal deck. If one card is left in the deck, the animal can't be added.",
  },
  developmentDefects: {
    name: "Development Defects",
    desc: "A harmful mutation. A carnivore attacking this species ignores one of its traits: the online version disables whichever defense hinders the attack the most.",
  },
  simplification: {
    name: "Simplification",
    desc: "A harmful mutation. The last trait played on the species separates and becomes a new mutant species, and the “Simplification” card itself becomes yet another species.",
  },
};

// ── Флора «Травы и грибов» ──────────────────────────────────────────────────
// Ключи совпадают с FloraKind из src/game/types.ts.

export const FLORA_EN: Record<string, TermEn> = {
  toadstool: {
    name: "Death Cap",
    desc: "The animal that takes a token gets the “Poison” mark (when the “Poison” mark is received, this animal's “Parasite” trait is discarded). In the extinction phase an animal with the “Poison” mark dies unless it has an “Antidote”.",
  },
  mold: {
    name: "Mold",
    desc: "The animal that takes a token gets the “Antidote” mark: it doesn't die in extinction from the “Poison” mark or from eating an animal with the “Poisonous” trait.",
  },
  madCap: {
    name: "Mad Cap",
    desc: "The animal that takes a token gets the “Madness” mark: at the start of the next round of the feeding phase its owner removes the mark. A bot controls their animals for that round; the neighbor does not participate — control by the right-hand neighbor is not yet implemented in the online version.",
  },
  flyAgaric: {
    name: "Fly Agaric",
    desc: "The animal that takes a token gets the “Rage” mark: at the start of the next round of the feeding phase its owner removes the mark and must attack another animal with it, as a carnivore — even a fed one. The enraged animal doesn't eat its prey and gets no tokens; whatever the outcome, the round ends.",
  },
  insight: {
    name: "Mushroom of Insight",
    desc: "Having taken a token, the animal's owner discards their whole hand to the discard pile. Looking at other players' cards (as the board game rule allows) is not yet implemented in the online version.",
  },
  soaring: {
    name: "Soaring Mushroom",
    desc: "Having taken a token, the animal discards all its paired traits and then gets 1 blue token of extra food.",
  },
  sleepGrass: {
    name: "Sleep Grass",
    desc: "The animal that takes a token gets the “Sleep” mark: it counts as an animal without traits (all traits, including paired ones, don't work) and its food requirement is 1. Marks on it keep working. “Insectivore” triggers when eating an animal with “Sleep”.",
  },
  thryn: {
    name: "Tryn-Grass",
    desc: "The animal that takes a token gets the “Tryn” mark: it receives no marks when taking tokens from any grass or fungi, and a carnivore with “Tryn” receives no marks from eaten prey. A carnivore without “Tryn” that eats prey with “Tryn” and other marks receives all those marks at once.",
  },
  datura: {
    name: "Jimson Weed",
    desc: "The animal that takes a token gets the “Haze” mark: a carnivore (or enraged animal) attacking it may ignore one of its traits (in the online version it's chosen automatically — the one that hinders the attack most).",
  },
  smile: {
    name: "Smile Grass",
    desc: "The animal that takes a token gets the “Pacifism” mark: it cannot attack using the “Carnivorous” trait or under the “Rage” mark, and cannot use “Piracy”.",
  },
  cleanser: {
    name: "Cleansing Grass",
    desc: "Having taken a token, the animal loses all its other red and blue tokens (fat tissue remains) and all consequence marks.",
  },
  passionflower: {
    name: "Passionflower",
    desc: "Having taken a token, the owner must take one trait of this animal (except “Parasite”) and play it as a new animal (in the online version the trait is chosen automatically — the topmost valid one).",
  },
};

// ── Метки последствий ───────────────────────────────────────────────────────
// Ключи совпадают с MarkKind из src/game/types.ts.

export const MARK_EN: Record<string, TermEn> = {
  poison: {
    name: "Poison",
    desc: "In the extinction phase an animal with the “Poison” mark dies if it doesn't have the “Antidote” mark. When the “Poison” mark is received, the animal's “Parasite” trait is discarded.",
  },
  antidote: {
    name: "Antidote",
    desc: "An animal with the “Antidote” mark doesn't die in extinction from the “Poison” mark or from the consequences of eating an animal with the “Poisonous” trait.",
  },
  madness: {
    name: "Madness",
    desc: "At the start of the next round of the feeding phase the owner removes the mark from one of their animals. A bot controls their animals for that round; the neighbor does not participate — control by the right-hand neighbor is not yet implemented in the online version.",
  },
  rage: {
    name: "Rage",
    desc: "At the start of the next round of the feeding phase the owner removes the mark from one of their animals and must attack another animal with it, as a carnivore (even a fed one). It doesn't eat its prey and gets no tokens; whatever the outcome, the round ends.",
  },
  sleep: {
    name: "Sleep",
    desc: "The animal counts as an animal without traits: all traits, including paired ones, don't work, and its food requirement is 1. Marks on it keep working.",
  },
  thryn: {
    name: "Tryn",
    desc: "The animal receives no marks when taking tokens from grass and fungi; a carnivore with “Tryn” receives no marks from eaten prey. A carnivore without “Tryn” that eats prey with “Tryn” and other marks receives all the marks at once.",
  },
  haze: {
    name: "Haze",
    desc: "A carnivore (or enraged animal) about to attack this animal may ignore one of its traits.",
  },
  pacifism: {
    name: "Pacifism",
    desc: "The animal cannot attack with the “Carnivorous” trait or in rage, and cannot use “Piracy”.",
  },
};

// ── Виды растений «Растений» ────────────────────────────────────────────────
// Ключи совпадают с PlantKind из src/game/types.ts.

export const PLANT_EN: Record<string, TermEn> = {
  perennial: {
    name: "Perennial",
    desc: "Grows by the scheme 1→2, 2→3, 3+→5 (5 tokens max). Appears with 3 tokens.",
  },
  annual: {
    name: "Annual",
    desc: "Grows by the scheme 0→1, 1→2, 2+→3 (3 max). The only plant that survives without tokens: it gets 1 token at the end of the growth phase.",
  },
  fruit: {
    name: "Fruit Plant",
    desc: "Grows by the scheme 1→5, 2→4, 3+→3 (5 max): at 3–4 tokens it waits out a bad season. Gives 1 shelter. Carnivores may take food from it.",
  },
  succulent: {
    name: "Succulent",
    desc: "Grows by the scheme 1→2, 2→3, 3+→4 (4 max). Gives 1 shelter. Carnivores may take food from it.",
  },
  legume: {
    name: "Legume",
    desc: "Grows by the scheme 1→3, 2→4, 3+→5 (5 max) — always +2.",
  },
  grass: {
    name: "Grass",
    desc: "Grows by the scheme 1→2, 2→4, 3+→5 (5 max). Appears with 2 tokens (scheme reconstructed from the rulebook illustration).",
  },
  liana: {
    name: "Liana",
    desc: "In the growth phase it gets as many tokens as there are non-liana plants on the table (parasites counted). 6 max (reconstruction).",
  },
  fungus: {
    name: "Fungus",
    desc: "Whenever any animal dies, each fungus gets 1 token (6 max — reconstruction). Carnivores may take food from it.",
  },
  carnivorous: {
    name: "Carnivorous Plant",
    desc: "Once per feeding phase it attacks: it counterattacks the animal taking food from it (ignoring one of its defenses), or one of the players directs it at another player's animal. Eats an animal — 2 tokens, gets a tail — 1, eats a poisonous one — dies in extinction. 6 tokens max, starts empty. Carnivores may take food from it.",
  },
  parasite: {
    name: "Plant Parasite",
    desc: "A standalone plant with its own traits. Doesn't count toward the plant limit. Feeding turn: instead of eating you may move 1 token from the host to the parasite (not the last one). Survives without tokens; dies together with its host.",
  },
};

// ── Территории «Континентов» ────────────────────────────────────────────────

export const TERRITORY_EN: Record<string, string> = {
  laurasia: "Laurasia",
  gondwana: "Gondwana",
  ocean: "Ocean",
};

// ── Достижения ──────────────────────────────────────────────────────────────
// Ключи совпадают с id из ACHIEVEMENTS (src/lib/stats.ts).

export const ACHIEVEMENT_EN: Record<string, TermEn> = {
  "first-win": { name: "First Victory", desc: "Win a game" },
  "wins-5": { name: "Natural Selection", desc: "5 wins in total" },
  "streak-3": { name: "Dominant Species", desc: "3 wins in a row" },
  apex: { name: "Apex Predator", desc: "Declare 5 or more attacks in a game" },
  gourmet: { name: "Abundance", desc: "Collect 15 or more food tokens in a game" },
  "clean-pop": { name: "Clean Population", desc: "Win without losing a single animal" },
  "hard-win": { name: "Environmental Pressure", desc: "Win on “Harder” difficulty" },
  "big-table": { name: "Overpopulation", desc: "A game at an 8-player table" },
  "win-continents": { name: "Pangaea", desc: "Win with the “Continents” expansion" },
  "win-plants": { name: "Gardener", desc: "Win with the “Plants” expansion" },
  "win-fungi": { name: "Mushroomer", desc: "Win with the “Grass and Mushrooms” expansion" },
  "win-mutations": { name: "Radiation", desc: "Win with the “Random Mutations” expansion" },
  "all-modules": { name: "Full Ecosystem", desc: "A game with all four expansions" },
  darwin: { name: "Darwinism", desc: "Play 25 games" },
  escape: { name: "Narrow Escape", desc: "3 successful defenses in a game" },
  "five-traits": { name: "Complex Organism", desc: "An animal with five traits" },
};

// ── Короткие подписи (чипы на карточках) ────────────────────────────────────
// Чипы на столе и кнопки граней карты руки узкие: полное имя (Carnivorous,
// Symbiosis) не влезает, поэтому для en — отдельные короткие подписи.
// Русские shorts всегда берутся из данных игры.

export const TRAIT_SHORT_EN: Record<string, string> = {
  carnivore: "Carnivore",
  swimming: "Water",
  camouflage: "Camouflage",
  sharpVision: "Vision",
  burrowing: "Burrow",
  scavenger: "Scavenger",
  symbiosis: "Symbiosis",
  piracy: "Pirate",
  tailLoss: "Tail",
  grazing: "Grazer",
  cooperation: "Co-op",
  running: "Running",
  highBodyWeight: "Big",
  parasite: "Parasite",
  fatTissue: "Fat",
  communication: "Comm.",
  poisonous: "Poison",
  hibernation: "Sleep",
  mimicry: "Mimicry",
  migration: "Migr.",
  remora: "Remora",
  herding: "Herding",
  nematocysts: "Stings",
  regeneration: "Regen.",
  recombination: "Recomb.",
  edificator: "Edifice",
  neoplasia: "Neoplasia",
  plantWater: "Water",
  thorny: "Thorny",
  rootVegetable: "Root",
  medicinal: "Medic.",
  plantParasite: "P-parasite",
  micorrhiza: "Micorrhiza",
  tree: "Tree",
  nutritious: "Rich",
  honeyPlant: "Honey",
  transparent: "Transp.",
  insectivore: "Insect.",
  obligateCarnivore: "Obligate",
  budding: "Budding",
  metabolicSyndrome: "Metab.",
  barkBeetle: "Beetle",
  extremophile: "Extreme",
  developmentDefects: "Defects",
  simplification: "Simple",
};

export const MARK_SHORT_EN: Record<string, string> = {
  poison: "Poison",
  antidote: "Antidote",
  madness: "Madness",
  rage: "Rage",
  sleep: "Sleep",
  thryn: "Tryn",
  haze: "Haze",
  pacifism: "Pacifism",
};

// ── Имена учёных (ботов) ─────────────────────────────────────────────────────
// AI_NAMES живут в src/game/engine.ts и хранятся в БД по-русски — переводим
// только при отображении. Неизвестные имена возвращаются как есть (люди
// называли себя сами); основа с суффиксом («Дарвин 2») переводится, суффикс
// сохраняется.

const SCIENTIST_EN: Record<string, string> = {
  "Дарвин": "Darwin",
  "Уоллес": "Wallace",
  "Мендель": "Mendel",
  "Линней": "Linnaeus",
  "Кювье": "Cuvier",
  "Ламарк": "Lamarck",
  "Геккель": "Haeckel",
};

/** Отображаемое имя игрока: боты-учёные переводятся, люди — как есть. */
export function scientistName(name: string, lang: Lang = currentLang()): string {
  if (lang !== "en") return name;
  const direct = SCIENTIST_EN[name];
  if (direct) return direct;
  // Основа + суффикс: «Дарвин 2» → «Darwin 2».
  const m = /^(.+?)\s+(\d+)$/.exec(name);
  if (m) {
    const base = SCIENTIST_EN[m[1]!];
    if (base) return `${base} ${m[2]}`;
  }
  return name;
}

// ── Хелперы: имя/описание термина на заданном языке ────────────────────────
// Русский текст всегда берётся из данных игры; английский — из словарей выше.
// Если английской записи нет (новое свойство без перевода), честно показываем
// русскую — так переводчик сразу увидит, чего не хватает.
//
// ВАЖНО (hydration): параметр `lang` в рендере передавайте из СНАПШОТА хука
// useLang() — живой currentLang() во время гидратации поздних границ SSR
// уже мог переключиться и разойдётся с серверной разметкой. Без параметра
// хелпер читает живой язык — это для обработчиков и кода вне рендера.

export function traitName(id: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? TRAIT_EN[id]?.name : undefined) ?? TRAITS[id as keyof typeof TRAITS]?.name ?? id;
}

export function traitDesc(id: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? TRAIT_EN[id]?.desc : undefined) ?? TRAITS[id as keyof typeof TRAITS]?.description ?? "";
}

/** Короткая подпись свойства для чипов/кнопок граней карты руки. */
export function traitShort(id: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? TRAIT_SHORT_EN[id] : undefined) ?? TRAITS[id as keyof typeof TRAITS]?.short ?? id;
}

export function floraName(kind: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? FLORA_EN[kind]?.name : undefined) ?? FLORA[kind as keyof typeof FLORA]?.name ?? kind;
}

export function floraDesc(kind: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? FLORA_EN[kind]?.desc : undefined) ?? FLORA[kind as keyof typeof FLORA]?.description ?? "";
}

export function plantName(kind: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? PLANT_EN[kind]?.name : undefined) ?? PLANTS[kind as keyof typeof PLANTS]?.name ?? kind;
}

export function plantDesc(kind: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? PLANT_EN[kind]?.desc : undefined) ?? PLANTS[kind as keyof typeof PLANTS]?.description ?? "";
}

export function markName(kind: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? MARK_EN[kind]?.name : undefined) ?? MARKS[kind as keyof typeof MARKS]?.name ?? kind;
}

export function markDesc(kind: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? MARK_EN[kind]?.desc : undefined) ?? MARKS[kind as keyof typeof MARKS]?.description ?? "";
}

/** Короткая подпись метки последствий для чипов на животном. */
export function markShort(kind: string, lang: Lang = currentLang()): string {
  return (lang === "en" ? MARK_SHORT_EN[kind] : undefined) ?? MARKS[kind as keyof typeof MARKS]?.short ?? kind;
}

export function territoryName(id: string, lang: Lang = currentLang()): string {
  if (lang === "en") {
    const en = TERRITORY_EN[id];
    if (en) return en;
  }
  return TERRITORIES.find((t) => t.id === id)?.name ?? id;
}

export function achievementName(id: string, lang: Lang = currentLang()): string {
  const ruName = ACHIEVEMENTS.find((a) => a.id === id)?.name;
  return (lang === "en" ? ACHIEVEMENT_EN[id]?.name : undefined) ?? ruName ?? id;
}

export function achievementDesc(id: string, lang: Lang = currentLang()): string {
  const ruDesc = ACHIEVEMENTS.find((a) => a.id === id)?.desc;
  return (lang === "en" ? ACHIEVEMENT_EN[id]?.desc : undefined) ?? ruDesc ?? "";
}
