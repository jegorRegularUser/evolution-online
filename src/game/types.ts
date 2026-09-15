export type TraitId =
  | "carnivore"
  | "swimming"
  | "camouflage"
  | "sharpVision"
  | "burrowing"
  | "scavenger"
  | "symbiosis"
  | "piracy"
  | "tailLoss"
  | "grazing"
  | "cooperation"
  | "running"
  | "highBodyWeight"
  | "parasite"
  | "fatTissue"
  | "communication"
  | "poisonous"
  | "hibernation"
  | "mimicry"
  // ── Дополнение «Континенты» (Правильные игры, 2012) ──
  | "migration"
  | "remora"
  | "herding"
  | "nematocysts"
  | "regeneration"
  | "recombination"
  | "edificator"
  | "neoplasia"
  // ── Дополнение «Растения» (Правильные игры, 2016): свойства растений.
  // Разыгрываются на общие растения на столе, а не на животных. ──
  | "plantWater"
  | "thorny"
  | "rootVegetable"
  | "medicinal"
  | "plantParasite"
  | "micorrhiza"
  | "tree"
  | "nutritious"
  | "honeyPlant"
  // ── Дополнение «Трава и грибы» (Правильные игры, 2019): свойства животных. ──
  | "transparent"
  | "insectivore"
  // ── Дополнение «Случайные мутации» (Правильные игры, 2013): свойства
  // достаются вслепую из личной колоды; часть из них — вредные мутации. ──
  | "obligateCarnivore"
  | "budding"
  | "metabolicSyndrome"
  | "barkBeetle"
  | "extremophile"
  | "developmentDefects"
  | "simplification";

export type Phase =
  | "development"
  | "foodBank"
  | "feeding"
  | "extinction"
  /** «Растения»: выжившие растения разрастаются, добавляются новые. */
  | "growth"
  | "gameOver";

/**
 * Зарезервированные переключатели дополнений («Континенты», «Растения»,
 * «Грибы», «Случайные мутации»). В базовой игре все выключены; движок уже
 * читает эти флаги в точках расширения, чтобы включение модуля следующим
 * заходом не требовало новой ломки контрактов.
 */
export type ModuleId = "continents" | "plants" | "fungi" | "randomMutations";
export type EnabledModules = Partial<Record<ModuleId, boolean>>;

export interface Card {
  id: string;
  faces: TraitId[];
}

export interface TraitInstance {
  id: string;
  cardId: string;
  type: TraitId;
  hidden: boolean;
  playSeq: number;
  pairWith?: string;
  pairRole?: "a" | "b";
  fatFilled?: boolean;
  /** Свойство отключено (шов под неоплазию и мутации): не действует и не даёт очков. */
  disabled?: boolean;
  /** Шов под неоплазию: растущие по годам счётчики вируса. */
  virus?: number;
}

export interface Animal {
  id: string;
  ownerId: number;
  cardId: string;
  /**
   * Порядковый номер у владельца («№1», «№2»). Присваивается при появлении
   * животного и НЕ меняется при перестановках: игрок узнаёт своих зверей
   * по номеру, а не по месту в ряду. У старых сейвов номера нет — UI тогда
   * показывает позицию в списке.
   */
  no?: number;
  /**
   * Кличка, данная владельцем (косметика). Нет — подпись по умолчанию
   * («Животное №N», ключ card.animal). Видна всем игрокам, номер не меняет.
   */
  name?: string;
  traits: TraitInstance[];
  food: number;
  /** Из них синих (мясо, пиратство, сотрудничество, жир) — для показа цвета. */
  blueFood: number;
  fatTokens: number;
  hibernating: boolean;
  hibernatedLastYear: boolean;
  receivedFoodThisYear: boolean;
  poisoned: boolean;
  seed: number;
  /**
   * «Случайные мутации»: численность вида (сколько животных в нём).
   * Вне модуля всегда 1; еда засчитывается накормленным животным.
   */
  population?: number;
  /** Шов под «Континенты»: зона размещения (по умолчанию единое поле). */
  zoneId?: TerritoryId;
  /** «Растения»: жетон убежища с растения — защита от хищников до конца фазы питания. */
  sheltered?: boolean;
  /**
   * «Растения»: поело с лекарственного растения — накормлено, но все его
   * свойства не действуют до конца фазы питания (очков при этом не теряет).
   */
  sedated?: boolean;
  /**
   * «Неоплазия»: сколько непарных свойств она уже выключила (карта лежит
   * под свойствами и каждый год поднимается на одну позицию).
   */
  neoplasia?: TraitInstance;
  /**
   * «Трава и грибы»: метки последствий на животном (Яд, Антидот, Безумие,
   * Бешенство, Сон, Трын, Дурь, Пацифизм). Метка — не свойство: у спящего
   * животного свойства не работают, а метки — работают.
   */
  marks?: MarkKind[];
}

export interface Player {
  id: number;
  name: string;
  isAI: boolean;
  hand: Card[];
  animals: Animal[];
  discardCount: number;
  /**
   * Сетевой стол: игрок сдался — место и имя остаются до конца партии,
   * ходы пропускает серверная автоматика, животные гибнут от голода как
   * ненакормленные, очки при финальном подсчёте сохраняются.
   */
  resigned?: boolean;
  passedDev: boolean;
  /** Пас в фазе питания: пропускается, пока сам не сделает реальное действие. */
  passedFeed: boolean;
  /** Сетевой вид (viewFor): размер руки без передачи самих карт. */
  handCount?: number;
  /**
   * «Случайные мутации»: личная слепая колода игрока (не просматривается
   * даже владельцем). Карта с верха переворачивается в фазе развития.
   */
  blindDeck?: Card[];
  /** Сетевой вид (viewFor): размер личной колоды без её содержимого. */
  blindDeckCount?: number;
}

export interface PendingAttack {
  carnivoreId: string;
  preyId: string;
  mimicryChain: string[];
  waitingFor: number;
  usedDefenses: Array<"running" | "mimicry" | "tailLoss">;
  /**
   * «Растения»: атакует хищное растение (carnivoreId — id растения).
   * plantCounter — контратака на животное, тянущее с него еду: выживший
   * всё равно получает фишку. plantRequesterId — кто тянул еду.
   */
  plantId?: string;
  plantCounter?: boolean;
  plantRequesterId?: string;
  /**
   * «Трава и грибы»: атака бешеного животного (не обязано быть хищником;
   * добычу не ест, раунд после атаки заканчивается).
   */
  rage?: boolean;
  /**
   * «Трава и грибы»: метка «Дурь» — атакующий игнорирует одно свойство
   * жертвы (выбирается автоматически; защиты жертвы с ним не работают).
   */
  ignoredTraitId?: string;
}

/** Шов под «Континенты»: зоны размещения животных. */
export interface Zone {
  id: string;
  name: string;
}

/**
 * Территории «Континентов»: два континента и океан. У каждой своя кормовая
 * база; в фазе питания весь ход игрока привязан к одной территории.
 */
export type TerritoryId = "laurasia" | "gondwana" | "ocean";

/** Порядок отрисовки и канонические названия территорий. */
export const TERRITORIES: Array<{ id: TerritoryId; name: string }> = [
  { id: "laurasia", name: "Лавразия" },
  { id: "gondwana", name: "Гондвана" },
  { id: "ocean", name: "Океан" },
];

/** Шов под «Растения»/«Грибы»: банк — частный случай источника еды. */
export type FoodSourceId = "bank";

// ── Дополнение «Растения» ───────────────────────────────────────────────────

/** Вид растения из колоды растений; parasite создаётся свойством «Растение-Паразит». */
export type PlantKind =
  | "liana"
  | "fungus"
  | "carnivorous"
  | "annual"
  | "legume"
  | "perennial"
  | "grass"
  | "succulent"
  | "fruit"
  | "parasite";

/** Растение на столе: общее, не принадлежит никому из игроков. */
export interface Plant {
  id: string;
  kind: PlantKind;
  /** Жетоны пищи на растении. */
  food: number;
  /** Свободные жетоны убежищ на растении. */
  shelters: number;
  /** Свойства, приданные растению (в том числе микориза с pairWith). */
  traits: TraitInstance[];
  /** «Растение-Паразит»: растение-хозяин. */
  hostId?: string;
  /** Хищное растение уже атаковало в эту фазу питания. */
  attackedThisYear?: boolean;
  /** Съело ядовитое животное — погибнет в вымирание. */
  doomed?: boolean;
  /** Выжило без фишек (однолетник/микориза): в конце роста получит 1 фишку. */
  starvedRevive?: boolean;
  /** «Континенты»: континент растения (в океане растений нет). */
  zoneId?: TerritoryId;
  /** Порядок появления — для стабильной отрисовки. */
  playSeq: number;
}

// ── Дополнение «Трава и грибы» ──────────────────────────────────────────────

/** Вид карты флоры: 6 грибов и 6 трав. */
export type FloraKind =
  | "toadstool"
  | "mold"
  | "madCap"
  | "flyAgaric"
  | "insight"
  | "soaring"
  | "sleepGrass"
  | "thryn"
  | "datura"
  | "smile"
  | "cleanser"
  | "passionflower";

/** Метки последствий: 8 видов по 4 копии, лежат на столе. */
export type MarkKind =
  | "poison"
  | "antidote"
  | "madness"
  | "rage"
  | "sleep"
  | "thryn"
  | "haze"
  | "pacifism";

/** Длинная карта травы или гриба на столе (общая, как растения). */
export interface FloraCard {
  id: string;
  kind: FloraKind;
  /** Красные фишки на карте (максимум 4). */
  food: number;
  /** «Континенты»: континент карты флоры (в океане флоры нет). */
  zoneId?: TerritoryId;
  /** Порядок появления — для стабильной отрисовки. */
  playSeq: number;
}

export type GameEvent =
  | { kind: "diceRoll"; dice: number[]; total: number }
  | {
      /** «Континенты»: бросок по территориям — кубики и еда каждой. */
      kind: "territoryDice";
      rolls: Array<{ territory: TerritoryId; dice: number[]; food: number }>;
    }
  | { kind: "foodFromBank"; animalId: string; playerId: number; via: "take" | "communication" }
  | { kind: "foodToFat"; animalId: string }
  | { kind: "blueFood"; animalId: string; reason: "hunt" | "cooperation" | "scavenger" | "tailLoss" | "piracy" | "fat" | "soaring" | "beetle" }
  | { kind: "traitPlaced"; animalId: string; type: TraitId; hidden: boolean }
  | { kind: "animalPlaced"; animalId: string; ownerId: number; zoneId?: TerritoryId }
  | { kind: "huntDeclared"; carnivoreId: string; preyId: string }
  | { kind: "preyKilled"; preyId: string; carnivoreId: string }
  | { kind: "defenseUsed"; defense: "running" | "mimicry" | "tailLoss" | "none"; roll?: number; preyId: string }
  | { kind: "cardsDrawn"; counts: number[] }
  /** playerId — кто пасует (фаза развития или питания). */
  | { kind: "passed"; playerId: number }
  /**
   * cause: starved — не накормлено; poison — отравлено ядовитой добычей;
   * poisonMark — погибло от метки «Яд» («Трава и грибы»); neoplasia — неоплазия.
   */
  | { kind: "animalDied"; animalId: string; cause: "starved" | "poison" | "poisonMark" | "neoplasia" }
  | { kind: "traitsRevealed" }
  | { kind: "bankBurned"; amount: number; territory?: TerritoryId }
  | { kind: "migrated"; moves: Array<{ animalId: string; from?: TerritoryId; to: TerritoryId }> }
  | { kind: "edificator"; territory: TerritoryId; amount: number }
  | { kind: "paralyzed"; carnivoreId: string }
  | { kind: "regenerated"; ownerId: number }
  // ── «Растения» ──
  | { kind: "plantPlaced"; plantId: string; kindOfPlant: PlantKind }
  | { kind: "plantFoodTaken"; animalId: string; plantId: string; playerId: number }
  | { kind: "shelterTaken"; animalId: string; plantId: string }
  | { kind: "plantAttack"; plantId: string; preyId: string; counter: boolean }
  | { kind: "plantGrew"; plantId: string; from: number; to: number }
  | { kind: "plantGrazed"; plantId: string; from: number; to: number }
  | { kind: "plantDied"; plantId: string; cause: "eaten" | "poison" | "host" }
  | { kind: "cardStolen"; fromPlayerId: number; toPlayerId: number }
  // ── «Трава и грибы» ──
  | { kind: "floraPlaced"; floraId: string; kindOfFlora: FloraKind }
  | { kind: "floraFoodTaken"; animalId: string; floraId: string; playerId: number }
  | { kind: "floraGrew"; floraId: string; from: number; to: number }
  | { kind: "floraGrazed"; floraId: string; from: number; to: number }
  | { kind: "floraDied"; floraId: string }
  | { kind: "markGained"; animalId: string; mark: MarkKind }
  | { kind: "handLost"; playerId: number }
  // ── «Случайные мутации» ──
  /**
   * Игрок объявил способ розыгрыша и перевернул верхнюю карту личной колоды.
   * trait null — карта легла животным (рубашкой). usedAs — чем карта стала.
   */
  | {
      kind: "mutationFlipped";
      playerId: number;
      cardId: string;
      trait: TraitId | null;
      usedAs: "animal" | "trait" | "population" | "plantTrait" | "newSpecies" | "discarded";
    }
  | { kind: "budding"; animalId: string; playerId: number }
  | { kind: "populationGrown"; animalId: string; to: number }
  | { kind: "populationLost"; animalId: string; to: number }
  /** Партия завершена: победители посчитаны (в т.ч. флора с playerId -1). */
  | { kind: "gameFinished"; winnerIds: number[] };


export interface LogEntry {
  id: number;
  /** Готовый русский текст (источник правды для ru и старых кадров без key). */
  text: string;
  /**
   * Ключ словаря i18n (ru.ts/en.ts) для перевода записи: движок пишет журнал
   * по-русски, клиент при lang=en рендерит по ключу. Параметры со смыслом
   * игровых терминов (`trait`/`plant`/`flora`/`mark`/`zone`) несут id термина
   * и переводятся на клиенте через хелперы terms.ts.
   */
  key?: string;
  /** Параметры подстановки к `key` (имена игроков, числа, id терминов). */
  params?: Record<string, string | number>;
  tone?: "neutral" | "good" | "bad" | "hunt";
}

export interface ScoreBreakdown {
  playerId: number;
  name: string;
  animals: number;
  traits: number;
  extras: number;
  total: number;
  discard: number;
}

/** Что уже использовано в текущем ходе питания (ход = пока не «Закончить ход»). */
export interface FeedTurnUse {
  /** Хищники, атаковавшие в этот ход. */
  carnivores: string[];
  /** Пираты, использованные в этот ход. */
  pirates: string[];
  /** Топтуны, топтавшие в этот ход. */
  grazers: string[];
  /** В этот ход уже брали еду. */
  foodTaken: boolean;
  /** В этот ход уже были боевые действия (хищник/пират) — еду брать нельзя. */
  combatUsed: boolean;
  /**
   * «Континенты»: объявлена «Миграция» — этот ход потрачен на переезд;
   * больше ничего (кроме свойств мигрирующих) использовать нельзя.
   */
  migrated: boolean;
  /**
   * «Растения»: в этот ход уже занято убежище (убежище — вместо еды или атаки).
   */
  sheltered: boolean;
  /**
   * Спячка — действие животного: одна спячка за ход. Ход при этом не
   * передаётся, игрок продолжает действовать (если есть чем).
   */
  hibernated: string[];
}

export interface GameState {
  /** Использованное в текущем ходе питания; сбрасывается при передаче хода. */
  turnUse: FeedTurnUse;
  players: Player[];
  deck: Card[];
  foodBank: number;
  /**
   * «Континенты»: кормовая база каждой территории. Заполняется броском
   * (rollFoodBank), тратится по территории хода. В базовой игре пусто.
   */
  territoryFood?: Partial<Record<TerritoryId, number>>;
  /** Броски кубиков текущего года по территориям (для анимации в UI). */
  foodRoll: number[] | null;
  /** Территория, к которой привязан текущий ход питания («Континенты»). */
  turnTerritory?: TerritoryId;
  /** Территория, выбранная для будущей миграции (ход «миграция» ещё не завершён). */
  pendingMigration?: Array<{ animalId: string; to: TerritoryId }>;
  /**
   * Съеденные животные со «регенерацией»: их свойства ждут восстановления —
   * в вымирание владелец кладёт на них карту из руки как новое животное.
   */
  pendingRegeneration?: Array<{ ownerId: number; cardIds: string[] }> | null;
  currentPlayerId: number;
  firstPlayerId: number;
  phase: Phase;
  year: number;
  lastYear: boolean;
  deckEmptyAfterDraw: boolean;
  log: LogEntry[];
  /**
   * Сквозной счётчик id записей лога: id не повторяются даже после обрезки
   * журнала до 80 записей (и восстанавливаются у старых сейвов без поля).
   */
  logSeq: number;
  /**
   * Сквозной счётчик передач хода: инкрементируется при каждой установке
   * currentPlayerId. Различает круги одной фазы одного года — UI по нему
   * понимает, что ход ВЕРНУЛСЯ к игроку (второй круг развития/питания), и
   * показывает карточку/звук «Ваш ход». Живёт в состоянии, поэтому переживает
   * пропуски кадров поллинга; у старых сейвов самовосстанавливается в 0.
   */
  turnSeq: number;
  /** Сетевой вид (viewFor): размер колоды без её содержимого. */
  deckCount?: number;
  pendingAttack: PendingAttack | null;
  playSeq: number;
  scores?: ScoreBreakdown[];
  winnerIds?: number[];
  humanId: number;
  difficulty: Difficulty;
  rngSeed: number;
  /** Внутренний счётчик ГПСЧ (mulberry32) — часть состояния, поэтому партии воспроизводимы. */
  rngState: number;
  /** Счётчик id всех сущностей — часть состояния вместо глобальной переменной. */
  idSeq: number;
  /** Монотонный номер применения действия — ключ для UI-анимаций. */
  eventSeq: number;
  /** События последнего применённого действия. */
  lastEvents: GameEvent[];
  /** Значение playSeq на старте развития года: свойства с большим playSeq вложены в этом году. */
  devStartPlaySeq: number;
  /** Животные, ожидающие гибели в показанной стадии вымирания. */
  extinctionDeaths: string[];
  modules: EnabledModules;
  /**
   * «Континенты»: хищники, парализованные стрекательными клетками до конца
   * фазы питания (в океане теряют и водоплавающее — вытеснены на континент).
   */
  paralyzed?: string[];
  // ── «Растения» ──
  /** Растения на столе (общие). undefined вне модуля. */
  plants?: Plant[];
  /** Колода растений (PlantKind); счётчик колоды для сетевого вида — plantDeckCount. */
  plantDeck?: PlantKind[];
  plantDeckCount?: number;
  /** Счётчик погибших растений (для отображения). */
  plantDiscard?: number;
  /**
   * «Континенты»+«Растения»: при добавлении новых растений первым кладём на
   * континент, где их меньше (без учёта паразитов); tie — решает первый игрок.
   */
  plantsNextZone?: TerritoryId;
  // ── «Трава и грибы» ──
  /** Карты флоры на столе (общие). undefined вне модуля. */
  flora?: FloraCard[];
  /** Колода флоры (FloraKind); счётчик колоды для сетевого вида — floraDeckCount. */
  floraDeck?: FloraKind[];
  floraDeckCount?: number;
  /** Счётчик сброшенных карт флоры (для отображения). */
  floraDiscard?: number;
  /**
   * Метки последствий, оставшиеся на столе (по видам). Метка с погибшего
   * животного возвращается на стол; с животного их снимают в вымирание.
   */
  marksPool?: Partial<Record<MarkKind, number>>;
  /**
   * «Трава и грибы»: раунд этого игрока вместо него проводит сосед справа —
   * в онлайн-версии ход играется логикой ботов (руку сосед не видит).
   */
  madTurn?: number;
  /** «Трава и грибы»: обязательная атака бешеного животного в текущем ходу. */
  rageTurn?: { animalId: string } | null;
  /**
   * «Континенты»: животные, уже мигрировавшие в этой фазе питания
   * (миграция — раз за фазу, иначе ход нельзя закончить).
   */
  migratedThisPhase?: string[];
}

export type Difficulty = "easy" | "normal" | "hard";
export type GameSpeed = "slow" | "normal" | "fast";

export type GameAction =
  | { type: "devPlayAnimal"; cardId: string; /** «Континенты»: континент размещения (не океан). */ zoneId?: TerritoryId }
  | { type: "devPlayTrait"; cardId: string; face: number; animalId: string }
  | { type: "devPlayPair"; cardId: string; face: number; a: string; b: string }
  | { type: "devPass" }
  /**
   * «Случайные мутации»: объявить способ розыгрыша, затем перевернуть
   * верхнюю карту личной колоды. Карту выбирает движок — она вслепая.
   * - newAnimal — карта ложится новым видом (zoneId — континент);
   * - trait — свойство на свой вид из одного животного (не подошло —
   *   переезжает на вид справа, никуда не подошло — само становится видом);
   * - population — карта становится +1 животным вида (численность вида
   *   не выше числа видов игрока; «Экстрофил» требует лишнюю карту);
   * - plant — «Растения»: свойство на общее растение.
   */
  | { type: "devMutate"; intent: "newAnimal" | "trait" | "population" | "plant"; animalId?: string; plantId?: string; zoneId?: TerritoryId }
  /** «Растения»: свойство растения на общее растение (паразит — на хозяина). */
  | { type: "devPlayPlantTrait"; cardId: string; face: number; plantId: string }
  /** «Растения»: микориза — связывает два растения (одного континента). */
  | { type: "devPlayPlantPair"; cardId: string; face: number; a: string; b: string }
  | { type: "rollFoodBank" }
  | { type: "beginFeeding" }
  | { type: "continueExtinction" }
  /** «Растения»: завершить просмотр фазы роста — добор карт и новый год. */
  | { type: "continueGrowth" }
  | { type: "feedTake"; animalId: string }
  /** «Растения»: взять фишку еды с растения (вместо кормовой базы). */
  | { type: "feedTakePlant"; animalId: string; plantId: string }
  /** «Трава и грибы»: взять фишку еды с карты флоры (срабатывает способность). */
  | { type: "feedTakeFlora"; animalId: string; floraId: string }
  /** «Растения»: спрятать животное в убежище растения. */
  | { type: "feedShelter"; animalId: string; plantId: string }
  | { type: "feedHunt"; carnivoreId: string; preyId: string }
  /** «Растения»: направить хищное растение на жертву (ход игрока). */
  | { type: "feedPlantAttack"; plantId: string; preyId: string }
  /** «Растения»: перекинуть фишку с растения-хозяина на растение-паразит. */
  | { type: "feedParasitize"; hostId: string; parasiteId: string }
  | { type: "feedPirate"; pirateId: string; targetId: string }
  | { type: "feedHibernate"; animalId: string }
  | { type: "feedConvertFat"; animalId: string; amount: number }
  | { type: "feedGraze"; animalId: string; /** «Растения»: растение, по которому топчут. */ plantId?: string; /** «Трава и грибы»: карта флоры, по которой топчут. */ floraId?: string }
  | { type: "feedEndTurn" }
  | { type: "feedSkip" }
  /** «Континенты»: объявить ход миграции (свойства «миграция»/«прилипала»). */
  | { type: "feedMigrate"; moves: Array<{ animalId: string; to: TerritoryId }> }
  | {
      /** Переставить своё животное (косметика; шов под «Континенты» — поле toZoneId). */
      type: "reorderAnimal";
      animalId: string;
      beforeId?: string;
      toZoneId?: TerritoryId;
    }
  | {
      /**
       * Переименовать своё животное (косметика): имя 1–24 символа после
       * трима, пустое — сброс на дефолт «Животное №N». Фазы развития/питания,
       * только своё животное в свой ход; состояние игры не меняет.
       */
      type: "renameAnimal";
      animalId: string;
      name: string;
    }
  | {
      type: "chooseDefense";
      kind: "running" | "mimicry" | "tailLoss" | "none";
      mimicryTargetId?: string;
      discardTraitId?: string;
    };
