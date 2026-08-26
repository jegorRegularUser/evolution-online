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
  | "mimicry";

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
  fatTokens: number;
  hibernating: boolean;
  hibernatedLastYear: boolean;
  receivedFoodThisYear: boolean;
  poisoned: boolean;
  seed: number;
  /** Шов под «Континенты»: зона размещения (по умолчанию единое поле). */
  zoneId?: string;
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

/** Шов под «Растения»/«Грибы»: банк — частный случай источника еды. */
export type FoodSourceId = "bank";

export type GameEvent =
  | { kind: "diceRoll"; dice: number[]; total: number }
  | { kind: "foodFromBank"; animalId: string; playerId: number; via: "take" | "communication" }
  | { kind: "foodToFat"; animalId: string }
  | { kind: "blueFood"; animalId: string; reason: "hunt" | "cooperation" | "scavenger" | "tailLoss" | "piracy" | "fat" }
  | { kind: "traitPlaced"; animalId: string; type: TraitId; hidden: boolean }
  | { kind: "animalPlaced"; animalId: string; ownerId: number }
  | { kind: "huntDeclared"; carnivoreId: string; preyId: string }
  | { kind: "preyKilled"; preyId: string; carnivoreId: string }
  | { kind: "defenseUsed"; defense: "running" | "mimicry" | "tailLoss" | "none"; roll?: number; preyId: string }
  | { kind: "cardsDrawn"; counts: number[] }
  | { kind: "animalDied"; animalId: string; cause: "starved" | "poison" }
  | { kind: "traitsRevealed" }
  | { kind: "bankBurned"; amount: number };

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

export interface GameState {
  players: Player[];
  deck: Card[];
  foodBank: number;
  /** Кубики текущей кормовой базы — заполняется действием rollFoodBank для анимации. */
  foodRoll: number[] | null;
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
}

export type Difficulty = "easy" | "normal" | "hard";
export type GameSpeed = "slow" | "normal" | "fast";

export type GameAction =
  | { type: "devPlayAnimal"; cardId: string }
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
  | { type: "feedSkip" }
  | {
      type: "chooseDefense";
      kind: "running" | "mimicry" | "tailLoss" | "none";
      mimicryTargetId?: string;
      discardTraitId?: string;
    };
