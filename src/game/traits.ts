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
  /** Играется на любое животное — своё или чужое (неоплазия). */
  anyTarget?: boolean;
  /** Вирусная природа: в UI выделяется ядовито-фиолетовым (паразит, неоплазия). */
  virusLike?: boolean;
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
  /**
   * «Растения»: свойство разыгрывается на общее растение, а не на животное.
   * Вторая грань такой карты — обычное свойство животного.
   */
  plantTrait?: boolean;
  /**
   * «Случайные мутации»: вредная мутация (тёмная сторона карты). Разыгрывается
   * как обычное свойство — отказаться нельзя, можно только объявить карту
   * новым видом, пока у вида нет других свойств.
   */
  harmful?: boolean;
}

export const TRAITS: Record<TraitId, TraitDef> = {
  carnivore: {
    id: "carnivore",
    name: "Хищник",
    short: "Хищник",
    description:
      "Вместо еды хищник нападает на другое животное и при успехе получает 2 синие фишки. Охота и еда из базы в одном ходу не сочетаются, каждый хищник атакует раз за ход. Накормленный хищник не охотится. Потребность в еде +1.",
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
      "Съесть это животное может только водоплавающий хищник, но и сам водоплавающий хищник охотится только на водоплавающих. С «Континентами» животное сразу уезжает в Океан.",
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
    description: "Хищник это животное не видит: напасть может только хищник с «Острым зрением».",
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
    description: "Замечает замаскированных: хищник с острым зрением может нападать на животных с «Камуфляжем».",
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
    description:
      "Пока животное накормлено, хищники его не трогают. Жировой запас сытостью не считается: голодное животное в норе беззащитно.",
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
      "Когда любой хищник целиком съедает животное, один падальщик на столе получает 1 синюю фишку: ищут по кругу, начиная с владельца хищника. С «Хищником» и «Облигатным хищником» не сочетается.",
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
      "Карта кладётся между двумя вашими животными. Первое животное, симбионт, охраняет второе: пока симбионт жив, второе никто не съест, но и кормить второе можно только после того, как наелся симбионт.",
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
      "Раз за ход голодный пират крадёт 1 фишку у любого не накормленного животного, своего или чужого. Цвет фишки сохраняется; после кражи еда из базы в этот ход недоступна. Накормленный пират не ворует.",
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
      "Когда на животное напали, сбросьте эту карту: животное выживает, а хищник получает 1 синюю фишку вместо двух. Спасает и от хищного растения.",
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
    description:
      "Раз за свой ход животное может затоптать 1 фишку еды: из кормовой базы, с растения или карты флоры. Топтать можно и в тот ход, когда берёте еду.",
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
      "Карта между двумя животными: когда одно получает еду (из базы, с охоты, краденую), второе сразу получает 1 синюю фишку. Перевод жира в еду эффекта не запускает.",
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
      "При нападении бросьте кубик: 4, 5 или 6, и животное убегает. Атака хищника потрачена зря: до конца этого хода он не охотится (в следующий ход сможет снова).",
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
      "Съесть это животное может только хищник, у которого тоже есть «Большой». Потребность в еде +1.",
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
      "Кладётся только на чужое животное. Его потребность в еде +2, а в конце игры 2 дополнительных очка достанутся хозяину животного.",
    isPair: false,
    opponentOnly: true,
    virusLike: true,
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
      "Единственное свойство, которое можно класть на животное многократно. Лишняя еда сытого животного уходит в жир, по фишке на каждую карту. Голодное животное в любой момент превращает жир в синие фишки: это свободное действие, ход не тратится.",
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
      "Карта между двумя животными: когда одно берёт красную фишку из кормовой базы, второе тут же берёт свою. С «Растениями» и «Травой и грибами» напарник берёт фишку с того же растения или карты флоры.",
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
      "Хищник, целиком съевший это животное, отравлен и погибнет в фазу вымирания. За один лишь хвост или добычу «Насекомоядного» хищник не травится.",
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
      "Животное засыпает и до конца года считается накормленным: еду больше не берёт даже в жировой запас. Нельзя спать два года подряд и в последний год; за ход в спячку уходит только одно ваше животное.",
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
      "Когда хищник напал, направьте его на другое своё животное, которое он мог бы съесть. Перенаправлять можно по цепочке, но уже спасавшееся от этой атаки животное второй раз не спасается.",
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
      "Объявляется вместо обычного хода: в этот ход только переезды, ни еды, ни охоты. Ваши животные с этим свойством едут из Океана на любой континент, а с континента в Океан (только водоплавающие). Напрямую между континентами проехать нельзя; каждое животное мигрирует раз за фазу питания.",
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
      "Сама по себе не переезжает. Зато когда вы объявляете миграцию, все ваши прилипалы из местности, которую покидает мигрант, едут вместе с ним. Спящие прилипалы остаются на месте.",
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
      "Стадных нельзя атаковать, пока их на одной территории больше, чем хищников. Пересчёт общий: все стадные, даже чужие, против всех хищников и хищных растений этой территории.",
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
      "Хищник, напавший на это животное, парализован до конца фазы питания: не может охотиться, воровать еду и мигрировать. Если нападение случилось в Океане, парализованного хищника ещё и выбрасывает на континент.",
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
      "Кладётся только на животное без свойств или с одним свойством, не повышающим потребность. Повышать потребность такому животному дальше нельзя, всего свойств у него будет не больше двух. Съеденное хищником животное вернётся в игру: в фазу вымирания вы выложите карту из руки (или из колоды) новым животным, добора карт за него не будет.",
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
      "Парная карта между двумя животными одной территории. По правилам настолки партнёры обмениваются по одному свойству, но в онлайн-версии обмен пока не выполняется: карта только связывает пару.",
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
      "Каждый эдификатор ежегодно добавляет 2 фишки еды в базу континента, на котором стоит; стоящий в Океане кормит базу Океана. С «Растениями» и «Травой и грибами» эдификаторы континентов вместо этого удобряют растения и флору своей местности: по фишке каждой карте. Спящий эдификатор ничего не добавляет.",
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
      "Вирус: кладётся на любое животное, своё или чужое, под все свойства. Каждый год при определении кормовой базы поднимается и выключает очередное непарное свойство (парные не трогает). Выключенное не работает и очков не даёт; когда выключать станет нечего, животное погибнет. «Водоплавающее» в Океане вирус не трогает.",
    isPair: false,
    opponentOnly: false,
    anyTarget: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    virusLike: true,
    aiValue: -6,
  },
  // ── Дополнение «Растения» (Правильные игры, 2016): свойства растений ──────
  plantWater: {
    id: "plantWater",
    name: "Водное",
    short: "Водное",
    description:
      "Свойство растения. Кормиться с него могут только водоплавающие животные.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  thorny: {
    id: "thorny",
    name: "Колючее",
    short: "Колючее",
    description:
      "Свойство растения. Приносит на растение 3 жетона убежища. Животное под убежищем никто не трогает до конца фазы питания: ни хищники, ни хищные растения.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  rootVegetable: {
    id: "rootVegetable",
    name: "Корнеплод",
    short: "Корнеплод",
    description:
      "Свойство растения. Вкусные корешки достанутся только норным животным.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  medicinal: {
    id: "medicinal",
    name: "Лекарственное",
    short: "Лекарств.",
    description:
      "Свойство растения. Животное получает фишку, но до конца фазы питания усыплено: его свойства не действуют, спасти может только жетон убежища. Сытому животному фишка уйдёт в жировой запас.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  plantParasite: {
    id: "plantParasite",
    name: "Растение-Паразит",
    short: "Паразит-раст.",
    description:
      "Свойство растения. Селится на растение-хозяина и живёт как отдельное растение: со своими свойствами и даже своими паразитами. В свой ход вместо еды можно перекинуть с хозяина на паразита 1 фишку (не последнюю). Без фишек паразит выживает, а без хозяина гибнет; в максимум растений на столе он не входит.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  micorrhiza: {
    id: "micorrhiza",
    name: "Микориза",
    short: "Микориза",
    description:
      "Свойство двух растений сразу, кладётся между ними. Связка не гибнет от голода, пока хотя бы на одном её растении осталась еда, а опустевшие растения получают по фишке в конце фазы роста. Одно растение можно связать с несколькими.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  tree: {
    id: "tree",
    name: "Дерево",
    short: "Дерево",
    description:
      "Свойство растения. Ветви высоко: еду с него берут только большие животные. Приносит на растение 1 жетон убежища.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 2,
  },
  nutritious: {
    id: "nutritious",
    name: "Питательное",
    short: "Питат.",
    description:
      "Свойство растения. Взяв фишку, животное получает ещё одну. Хищникам с этого растения есть можно.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 4,
  },
  honeyPlant: {
    id: "honeyPlant",
    name: "Медонос",
    short: "Медонос",
    description:
      "Свойство растения. Ваше животное поело и вытягивает случайную карту у соперника с самой полной рукой, если у того карт больше, чем у вас. Таких соперников нет: карта не достаётся.",
    isPair: false,
    opponentOnly: false,
    plantTrait: true,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  // ── Дополнение «Трава и грибы» (Правильные игры, 2019): свойства животных ──
  transparent: {
    id: "transparent",
    name: "Прозрачное",
    short: "Прозр.",
    description:
      "Хищник не трогает это животное, пока на нём нет ни красной, ни синей фишки. Жировой запас не считается.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 4,
  },
  insectivore: {
    id: "insectivore",
    name: "Насекомоядное",
    short: "Насеком.",
    description:
      "Мелкая добыча: за животное без свойств (в том числе с меткой «Сон») хищник получает 1 синюю фишку вместо двух.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 3,
  },
  // ── Дополнение «Случайные мутации» (Правильные игры, 2013) ────────────────
  obligateCarnivore: {
    id: "obligateCarnivore",
    name: "Облигатный хищник",
    short: "Облигат",
    description:
      "Охотится раз в ход и кормится только добычей: из кормовой базы, с растений и чужих свойств еду не берёт, зато удачная атака сразу наедает его досыта. Потребность в еде +1. С «Хищником» и «Падальщиком» не сочетается.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 1,
    scoreBonus: 1,
    aiValue: 5,
  },
  budding: {
    id: "budding",
    name: "Почкование",
    short: "Почков.",
    description:
      "В начале каждого вашего хода фазы развития вид почкует ещё одно животное: карта на него уходит из личной колоды. Обычный предел численности «не больше числа ваших видов» почкование обходит.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    aiValue: 4,
  },
  metabolicSyndrome: {
    id: "metabolicSyndrome",
    name: "Метаболический синдром",
    short: "Метабол.",
    description:
      "Вредная мутация: обмен веществ слишком быстрый, каждое животное вида требует на 2 фишки еды больше. Зато в конце игры мутация приносит 2 дополнительных очка.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 2,
    scoreBonus: 2,
    harmful: true,
    aiValue: -6,
  },
  barkBeetle: {
    id: "barkBeetle",
    name: "Короед",
    short: "Короед",
    description:
      "Вредная мутация. Голодное животное прятаться в убежище не может: вместо защиты оно получает синюю фишку еды, а жетон остаётся на растении. Накормленным животным и облигатным хищникам убежище работает как положено.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    harmful: true,
    aiValue: -2,
  },
  extremophile: {
    id: "extremophile",
    name: "Экстрофил",
    short: "Экстрофил",
    description:
      "Вредная мутация. Рост вида в цене: каждое новое животное стоит дополнительную карту, она уходит из личной колоды в сброс. Если в колоде осталась одна карта, животное не добавить.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    harmful: true,
    aiValue: -2,
  },
  developmentDefects: {
    id: "developmentDefects",
    name: "Дефекты развития",
    short: "Дефекты",
    description:
      "Вредная мутация. Хищник, напавший на этот вид, игнорирует одно его свойство: онлайн-версия сама гасит ту защиту, которая сильнее всего мешает атаке.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    harmful: true,
    aiValue: -3,
  },
  simplification: {
    id: "simplification",
    name: "Упрощение",
    short: "Упрощ.",
    description:
      "Вредная мутация. Последнее сыгранное на вид свойство отделяется и становится новым видом-мутантом, а сама карта «Упрощение» ложится ещё одним видом.",
    isPair: false,
    opponentOnly: false,
    stackable: false,
    extraFood: 0,
    scoreBonus: 0,
    harmful: true,
    aiValue: -2,
  },
};

export const TRAIT_ORDER: TraitId[] = Object.keys(TRAITS) as TraitId[];

/** Свойства из дополнения «Континенты»; всё прочее — базовая игра. */
export const CONTINENTS_TRAIT_IDS: ReadonlySet<TraitId> = new Set([
  "migration",
  "remora",
  "herding",
  "nematocysts",
  "regeneration",
  "recombination",
  "edificator",
  "neoplasia",
]);

/** Свойства растений из дополнения «Растения». */
export const PLANTS_TRAIT_IDS: ReadonlySet<TraitId> = new Set([
  "plantWater",
  "thorny",
  "rootVegetable",
  "medicinal",
  "plantParasite",
  "micorrhiza",
  "tree",
  "nutritious",
  "honeyPlant",
]);

/** Свойства животных из дополнения «Трава и грибы». */
export const FUNGI_TRAIT_IDS: ReadonlySet<TraitId> = new Set([
  "transparent",
  "insectivore",
]);

/** Свойства из дополнения «Случайные мутации». */
export const MUTATIONS_TRAIT_IDS: ReadonlySet<TraitId> = new Set([
  "obligateCarnivore",
  "budding",
  "metabolicSyndrome",
  "barkBeetle",
  "extremophile",
  "developmentDefects",
  "simplification",
]);

/** Свойства-мутанты, дающие виду статус хищника (для проверок атак и питания). */
export const CARNIVORE_LIKE: ReadonlySet<TraitId> = new Set(["carnivore", "obligateCarnivore"]);

/** Свойства, несовместимые друг с другом на одном животном (пары «мясной» специализации). */
export const CARNIVORE_EXCLUSIVE: ReadonlySet<TraitId> = new Set([
  "carnivore",
  "obligateCarnivore",
  "scavenger",
]);
