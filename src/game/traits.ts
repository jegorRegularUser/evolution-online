import type { TraitId } from "./types.ts";

/**
 * Правило защиты жертвы: проверяется на каждом видимом активном свойстве добычи.
 * Новые защитные свойства дополнений добавляются данными сюда, а не в код canAttack.
 */
export interface ProtectionRule {
  /** Свойство пробивается только атакующим с указанным свойством (камуфляж → острое зрение). */
  stealthBypass?: TraitId;
  /** Атакующий обязан иметь highBodyWeight (большое тело). */
  needsBulkyAttacker?: boolean;
  /** Накормленную жертву нельзя атаковать (норное). */
  safeWhenFed?: boolean;
}

export interface TraitDef {
  id: TraitId;
  name: string;
  short: string;
  description: string;
  isPair: boolean;
  opponentOnly: boolean;
  stackable: boolean;
  extraFood: number;
  scoreBonus: number;
  /** Защитная реакция при нападении. */
  defense?: "running" | "mimicry" | "tailLoss";
  /** Правило защиты, если свойство оберегает носителя от атак. */
  protection?: ProtectionRule;
  /** Симметричное водное правило: водный хищник ест только водных и наоборот. */
  symmetricAquatic?: boolean;
  /** Парный эффект: срабатывает у партнёра, когда носитель получает еду. */
  onPartnerFed?: "cooperation" | "communication";
  /** Реакция любого игрока после успешной охоты (первый по кругу от хищника). */
  onAnyKill?: "scavenger";
  /** Съевший это свойство целиком погибает в вымирание (ядовитое). */
  killsKiller?: boolean;
  /** Эвристическая ценность для ИИ (защита/размещение). */
  aiValue: number;
}

export const TRAITS: Record<TraitId, TraitDef> = {
  carnivore: {
    id: "carnivore",
    name: "Хищник",
    short: "Хищник",
    description:
      "В свой ход вместо фишки еды может напасть на любое животное. При успехе получает 2 синие фишки. Голодный хищник может нападать в каждый свой ход; сытый (без места в жире) — нет. +1 к потребности в еде.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 1,
    scoreBonus: 1,
    aiValue: 6,
  },
  swimming: {
    id: "swimming",
    name: "Водоплавающее",
    short: "Вода",
    description:
      "Может быть съедено только водоплавающим хищником. Водоплавающий хищник ест только водоплавающих.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    symmetricAquatic: true,
    aiValue: 5,
  },
  camouflage: {
    id: "camouflage",
    name: "Камуфляж",
    short: "Камуфляж",
    description: "Может быть съедено только хищником с острым зрением.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    protection: { stealthBypass: "sharpVision" },
    aiValue: 5,
  },
  sharpVision: {
    id: "sharpVision",
    name: "Острое зрение",
    short: "Зрение",
    description: "Хищник с этим свойством может атаковать животных с камуфляжем.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 4,
  },
  burrowing: {
    id: "burrowing",
    name: "Норное",
    short: "Нора",
    description: "Накормленное животное нельзя атаковать. Жировой запас не считается кормлением.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    protection: { safeWhenFed: true },
    aiValue: 4,
  },
  scavenger: {
    id: "scavenger",
    name: "Падальщик",
    short: "Падаль",
    description:
      "Когда любое животное съедено, один падальщик (по часовой от владельца хищника) получает 1 синюю фишку. Не сочетается с хищником.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    onAnyKill: "scavenger",
    aiValue: 3,
  },
  symbiosis: {
    id: "symbiosis",
    name: "Симбиоз",
    short: "Симбиоз",
    description:
      "Парное. Первое животное — симбионт. Второе нельзя съесть, пока симбионт жив, и оно получает еду только после того, как симбионт накормлен.",
    isPair: true,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 5,
  },
  piracy: {
    id: "piracy",
    name: "Пиратство",
    short: "Пират",
    description:
      "Раз за ход: забрать 1 фишку у животного, получившего еду в этом году, но ещё не накормленного. Не у самого себя и не если уже накормлен.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  tailLoss: {
    id: "tailLoss",
    name: "Отбрасывание хвоста",
    short: "Хвост",
    description:
      "При атаке сбросить это или любое другое свойство — животное выживает, хищник получает только 1 синюю фишку.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    defense: "tailLoss",
    aiValue: 5,
  },
  grazing: {
    id: "grazing",
    name: "Топотун",
    short: "Топотун",
    description: "В каждую свою фазу питания можно уничтожить 1 фишку из кормовой базы.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  cooperation: {
    id: "cooperation",
    name: "Сотрудничество",
    short: "Сотрудн.",
    description:
      "Парное. Когда одно животное получает красную или синюю еду, второе сразу получает 1 синюю. Не срабатывает от жирового запаса.",
    isPair: true,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    onPartnerFed: "cooperation",
    aiValue: 4,
  },
  running: {
    id: "running",
    name: "Быстрое",
    short: "Быстрое",
    description:
      "При атаке бросок кубика: 4–6 — спасается, хищник больше не атакует в этот год.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    defense: "running",
    aiValue: 4,
  },
  highBodyWeight: {
    id: "highBodyWeight",
    name: "Большой",
    short: "Большой",
    description:
      "Может быть съедено только большим хищником. +1 к потребности в еде.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 1,
    scoreBonus: 1,
    protection: { needsBulkyAttacker: true },
    aiValue: 5,
  },
  parasite: {
    id: "parasite",
    name: "Паразит",
    short: "Паразит",
    description:
      "Только на чужое животное. +2 к потребности в еде. В конце игры даёт владельцу животного 2 дополнительных очка.",
    isPair: false,
    opponentOnly: true,
    stackable: false,
    extraFood: 2,
    scoreBonus: 2,
    aiValue: -8,
  },
  fatTissue: {
    id: "fatTissue",
    name: "Жировой запас",
    short: "Жир",
    description:
      "Единственное свойство, которое можно класть несколько раз. Лишняя еда становится жиром. Вместо еды из базы можно превратить жир в синие фишки.",
    isPair: false,
    opponentOnly: false,
    stackable: true,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  communication: {
    id: "communication",
    name: "Взаимодействие",
    short: "Взаимод.",
    description:
      "Парное. Когда одно животное берёт фишку из кормовой базы, второе сразу берёт фишку из базы вне очереди.",
    isPair: true,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    onPartnerFed: "communication",
    aiValue: 4,
  },
  poisonous: {
    id: "poisonous",
    name: "Ядовитое",
    short: "Яд",
    description:
      "Хищник, полностью съевший это животное, погибает в фазу вымирания. Отбрасывание хвоста яд не передаёт.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    killsKiller: true,
    aiValue: 5,
  },
  hibernation: {
    id: "hibernation",
    name: "Спячка",
    short: "Спячка",
    description:
      "Животное считается накормленным. Нельзя два года подряд и в последний год. Больше не берёт еду, даже в жировой запас.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  mimicry: {
    id: "mimicry",
    name: "Мимикрия",
    short: "Мимикрия",
    description:
      "При атаке перенаправить хищника на другое своё животное, которое он мог бы съесть. Цепь мимикрии не возвращается на исходное.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    defense: "mimicry",
    aiValue: 4,
  },
};

export const TRAIT_ORDER: TraitId[] = Object.keys(TRAITS) as TraitId[];
