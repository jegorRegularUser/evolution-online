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
  | "neoplasia";

export type Phase =
  | "development"
  | "foodBank"
  | "feeding"
  | "extinction"
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
  /** Шов под «Континенты»: зона размещения (по умолчанию единое поле). */
  zoneId?: TerritoryId;
  /**
   * «Неоплазия»: сколько непарных свойств она уже выключила (карта лежит
   * под свойствами и каждый год поднимается на одну позицию).
   */
  neoplasia?: TraitInstance;
}

export interface Player {
  id: number;
  name: string;
  isAI: boolean;
  hand: Card[];
  animals: Animal[];
  discardCount: number;
  passedDev: boolean;
  /** Пас в фазе питания: пропускается, пока сам не сделает реальное действие. */
  passedFeed: boolean;
  /** Сетевой вид (viewFor): размер руки без передачи самих карт. */
  handCount?: number;
}

export interface PendingAttack {
  carnivoreId: string;
  preyId: string;
  mimicryChain: string[];
  waitingFor: number;
  usedDefenses: Array<"running" | "mimicry" | "tailLoss">;
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

export type GameEvent =
  | { kind: "diceRoll"; dice: number[]; total: number }
  | {
      /** «Континенты»: бросок по территориям — кубики и еда каждой. */
      kind: "territoryDice";
      rolls: Array<{ territory: TerritoryId; dice: number[]; food: number }>;
    }
  | { kind: "foodFromBank"; animalId: string; playerId: number; via: "take" | "communication" }
  | { kind: "foodToFat"; animalId: string }
  | { kind: "blueFood"; animalId: string; reason: "hunt" | "cooperation" | "scavenger" | "tailLoss" | "piracy" | "fat" }
  | { kind: "traitPlaced"; animalId: string; type: TraitId; hidden: boolean }
  | { kind: "animalPlaced"; animalId: string; ownerId: number; zoneId?: TerritoryId }
  | { kind: "huntDeclared"; carnivoreId: string; preyId: string }
  | { kind: "preyKilled"; preyId: string; carnivoreId: string }
  | { kind: "defenseUsed"; defense: "running" | "mimicry" | "tailLoss" | "none"; roll?: number; preyId: string }
  | { kind: "cardsDrawn"; counts: number[] }
  | { kind: "animalDied"; animalId: string; cause: "starved" | "poison" | "neoplasia" }
  | { kind: "traitsRevealed" }
  | { kind: "bankBurned"; amount: number; territory?: TerritoryId }
  | { kind: "migrated"; moves: Array<{ animalId: string; from?: TerritoryId; to: TerritoryId }> }
  | { kind: "edificator"; territory: TerritoryId; amount: number }
  | { kind: "paralyzed"; carnivoreId: string }
  | { kind: "regenerated"; ownerId: number };


export interface LogEntry {
  id: number;
  text: string;
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
}

export type Difficulty = "easy" | "normal" | "hard";
export type GameSpeed = "slow" | "normal" | "fast";

export type GameAction =
  | { type: "devPlayAnimal"; cardId: string; /** «Континенты»: континент размещения (не океан). */ zoneId?: TerritoryId }
  | { type: "devPlayTrait"; cardId: string; face: number; animalId: string }
  | { type: "devPlayPair"; cardId: string; face: number; a: string; b: string }
  | { type: "devPass" }
  | { type: "rollFoodBank" }
  | { type: "beginFeeding" }
  | { type: "continueExtinction" }
  | { type: "feedTake"; animalId: string }
  | { type: "feedHunt"; carnivoreId: string; preyId: string }
  | { type: "feedPirate"; pirateId: string; targetId: string }
  | { type: "feedHibernate"; animalId: string }
  | { type: "feedConvertFat"; animalId: string; amount: number }
  | { type: "feedGraze"; animalId: string }
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
      type: "chooseDefense";
      kind: "running" | "mimicry" | "tailLoss" | "none";
      mimicryTargetId?: string;
      discardTraitId?: string;
    };
