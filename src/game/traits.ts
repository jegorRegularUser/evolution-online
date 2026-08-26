import type { TraitId } from "./types.ts";

/** Защита жертвы: проверяется на каждом видимом активном свойстве добычи. */
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
  /** Защита числом в локации (стадность «Континентов»). */
  herdingProtection?: boolean;
  /** Симметричное водное правило: водный хищник ест только водных и наоборот. */
  symmetricAquatic?: boolean;
  /** Парный эффект: срабатывает у партнёра, когда носитель получает еду. */
  onPartnerFed?: "cooperation" | "communication";
  /** Реакция любого игрока после успешной охоты (первый по кругу от хищника). */
  onAnyKill?: "scavenger";
  /** Съевший это свойство целиком погибает в вымирание (ядовитое). */
  killsKiller?: boolean;
  /** Атаковавший носителя хищник парализуется до конца фазы питания. */
  paralyzesAttacker?: boolean;
  /**
   * Свойство увеличивает потребность, поэтому несовместимо с «регенерацией»
   * и не может лечь на животное с ней.
   */
  limitsRegeneration?: boolean;
  /** Эвристическая ценность для ИИ (защита/размещение). */
  aiValue: number;
}

export const TRAITS: Record<TraitId, TraitDef> = {
  carnivore: {
    id: "carnivore",
    name: "Хищник",
    short: "Хищник",
    description:
      "В свой ход вместо фишки еды может напасть на любое животное. При успехе получает 2 синие фишки. Голодный хищник может нападать в каждый свой ход; накормленный не нападает вовсе. +1 к потребности в еде.",
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
      "Парное. Карта кладётся между двумя животными (на пару — одна парная карта). Первое животное — симбионт: второе нельзя съесть, пока симбионт жив, и кормить его можно только после симбионта.",
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
      "Раз за ход: забрать 1 фишку — красную или синюю — у любого не накормленного полностью животного, своего или чужого. Цвет фишки сохраняется. Ход при этом не заканчивается, но еду из базы в этот ход уже не взять. Накормленный пират не пиратствует.",
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
      "При атаке можно сбросить эту карту — животное выживает, а хищник получает только 1 синюю фишку вместо двух.",
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
      "Парное, карта кладётся между двумя животными. Когда одно получает красную или синюю еду, второе сразу получает 1 синюю. Не срабатывает от жирового запаса.",
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
      "Парное, карта кладётся между двумя животными. Когда одно берёт фишку из кормовой базы, второе сразу берёт фишку из базы вне очереди.",
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
  // ── Дополнение «Континенты» (Правильные игры, 2012) ──────────────────────
  migration: {
    id: "migration",
    name: "Миграция",
    short: "Мигр.",
    description:
      "Объявите «Миграцию»: в этот ход не берите еду и не используйте других свойств — только миграцию и прилипал. Сколько угодно своих мигрирующих животных переезжает между континентами и из океана на континент (не наоборот). Сухопутное с континента на континент — нельзя, минуя океан.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  remora: {
    id: "remora",
    name: "Прилипала",
    short: "Прилипала",
    description:
      "Переезжает вместе с чужим или своим мигрирующим животным — даже с континента на континент. Сама по себе не мигрирует. Если в игре несколько прилипал, право первой объявляет игрок, начавший миграцию, дальше по часовой.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  herding: {
    id: "herding",
    name: "Стадность",
    short: "Стадность",
    description:
      "Защита числом: в своей локации считается отношение хищников к животным со «стадностью». Пока хищников не больше, чем стадных, — стадных нельзя атаковать. Считаются все хищники и все стадные локации, даже чужие.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    herdingProtection: true,
    aiValue: 3,
  },
  nematocysts: {
    id: "nematocysts",
    name: "Стрекательные клетки",
    short: "Стрекат.",
    description:
      "Атаковавший это животное хищник парализован до конца фазы питания: теряет все свойства, остаётся лишь базовая потребность 1. В океане он теряет и «водоплавающее» — уплывает на континент.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    paralyzesAttacker: true,
    aiValue: 4,
  },
  regeneration: {
    id: "regeneration",
    name: "Регенерация",
    short: "Регенер.",
    description:
      "Только на животное без свойств либо с одним свойством без +к еде. Других свойств (кроме повышающих потребность) на него играть нельзя — всего не больше двух. Съеденное хищником регенерирует: в вымирание владелец кладёт карту из руки как животное поверх оставленных свойств, без добора за него.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  recombination: {
    id: "recombination",
    name: "Рекомбинация",
    short: "Рекомб.",
    description:
      "Парная, кладётся между двумя животными. Каждое обязано передать напарнику одно своё свойство; дубликаты сбрасываются. Потеряло «водоплавающее» — переезжает на континент. Свойство, уже использованное прежним владельцем в этот ход, повторно не работает.",
    isPair: true,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  edificator: {
    id: "edificator",
    name: "Эдификатор",
    short: "Эдифик.",
    description:
      "В начале определения кормовой базы добавляет 2 красные фишки в банк своей территории. Эдификаторов несколько — добавляют каждый за себя.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  neoplasia: {
    id: "neoplasia",
    name: "Неоплазия",
    short: "Неоплазия",
    description:
      "Только на непарные свойства. Кладётся под свойства животного и каждый год поднимается: выключает лежащее выше непарное свойство (оно перестаёт действовать, но очки даёт). Выключать нечего — животное немедленно погибает.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: -6,
  },
};

export const TRAIT_ORDER: TraitId[] = Object.keys(TRAITS) as TraitId[];
