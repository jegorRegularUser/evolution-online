/**
 * Учебные миссии (волна 1.5, дизайн-пакет §5 «онбординг» и §4.1А — первые
 * миссии «Эр»). Миссия = обычная сетевая партия с лёгким ботом (партия всегда
 * через сервер — соло-контура нет by design) + список целей-предикатов над
 * состоянием. Движок ничего не знает об обучении: цели читают GameState и
 * поток событий, никакого «сценарного» контура в движке волна 1.5 не строит
 * (навязанный старт и изверги — волна 4а, расширение createGame).
 *
 * Одна миссия учит ОДНОМУ навыку (урок Evolution VG: «по одной концепции за
 * уровень»). Цели всегда достижимы при любой раздаче — никаких «дождись
 * хищника в руке»: это протухает первым же случайным тасованием.
 */
import type { TKey } from "../lib/i18n";
import type { GameEvent, GameState, MutatorId } from "./types.ts";

export type TutorialMissionId = "firstSteps" | "hunger" | "wildWorld";

/** Накопитель прогресса миссии: абсорбирует поток событий + срез состояния. */
export interface MissionProgress {
  events: GameEvent[];
  /** Последний виденный eventSeq — абсорбция идемпотентна. */
  eventSeq: number;
  placedAnimals: number;
  placedTraits: number;
  fatStored: boolean;
  /** Отразил охоту или сам съел добычу (учится обеим сторонам конфликта). */
  survivedOrHunted: boolean;
  /** Максимум свойств на одном своём животном за партию. */
  maxTraitsOnAnimal: number;
  /** Видел прогноз «Дикого мира» (миссия про события). */
  wildPlannedSeen: boolean;
  /** «Падальщики» сработали на животном игрока. */
  scavengedSeen: boolean;
  /** Съедена флора/растение (миссии с модулем «Растения»). */
  plantFoodTaken: number;
  /** Потеряно своих животных за партию (объект «мало потерь»). */
  animalsLost: number;
  /** Партия выиграна (gameFinished и игрок среди победителей). */
  gameWon: boolean;
  /** Год, до которого доиграли. */
  year: number;
}

export function makeMissionProgress(): MissionProgress {
  return {
    events: [],
    eventSeq: 0,
    placedAnimals: 0,
    placedTraits: 0,
    fatStored: false,
    survivedOrHunted: false,
    maxTraitsOnAnimal: 0,
    wildPlannedSeen: false,
    scavengedSeen: false,
    plantFoodTaken: 0,
    animalsLost: 0,
    gameWon: false,
    year: 1,
  };
}

/**
 * Абсорбция одного кадра. Идемпотентна по eventSeq: эффект в UI вызывается
 * на каждом состоянии, дубль кадра не двигает счётчики (события последнего
 * действия добавляются ровно один раз — транзиентный lastEvents).
 */
/** Владелец животного по id — события пост-фактум, карточка уже снята. */
function ownerOfAnimal(state: GameState, animalId: string): number | undefined {
  return state.players.find((p) => p.animals.some((a) => a.id === animalId))?.id;
}

export function absorbState(progress: MissionProgress, state: GameState): void {
  if (state.eventSeq === progress.eventSeq) return;
  progress.eventSeq = state.eventSeq;
  // История событий для целей миссий; потолок — партии тут короткие,
  // но и вечный цикл не должен съедать память.
  progress.events.push(...state.lastEvents);
  if (progress.events.length > 600) progress.events.splice(0, progress.events.length - 600);
  progress.year = state.year;

  const mine = (playerId: number) => playerId === state.humanId;
  for (const e of state.lastEvents) {
    if (e.kind === "animalPlaced" && mine(e.ownerId)) progress.placedAnimals += 1;
    if (e.kind === "traitPlaced" && !e.hidden) progress.placedTraits += 1;
    if (e.kind === "foodToFat") progress.fatStored = true;
    if (e.kind === "preyKilled") progress.survivedOrHunted = true;
    if (e.kind === "defenseUsed" && e.defense !== "none") progress.survivedOrHunted = true;
    if (e.kind === "wildEventPlanned") progress.wildPlannedSeen = true;
    // «Падальщики» сработали у ИГРОКА: его животное вернуло карту из сброса.
    if (e.kind === "scavenged" && mine(e.playerId)) progress.scavengedSeen = true;
    if (e.kind === "plantFoodTaken" && mine(e.playerId)) progress.plantFoodTaken += 1;
    if (e.kind === "animalDied" && ownerOfAnimal(state, e.animalId) === state.humanId) progress.animalsLost += 1;
    if (e.kind === "gameFinished" && e.winnerIds.includes(state.humanId)) progress.gameWon = true;
  }
  // Максимум свойств на одном СВОЁМ животном — по срезу состояния, не по
  // событиям (событие traitPlaced не знает итогового числа на карточке).
  const human = state.players[state.humanId];
  if (human) {
    for (const a of human.animals) {
      progress.maxTraitsOnAnimal = Math.max(progress.maxTraitsOnAnimal, a.traits.length);
    }
  }
}

export interface TutorialObjective {
  id: string;
  /** Ключ словаря с текстом цели. */
  textKey: TKey;
  /** Цель достигнута на текущем прогрессе. */
  done: (p: MissionProgress) => boolean;
}

export interface TutorialMission {
  id: TutorialMissionId;
  /** Ключ заголовка миссии. */
  titleKey: TKey;
  /** Ключ одного абзаца «чему учит». */
  descKey: TKey;
  /** Настройки стола: миссия запускает обычную комнату с этими полями. */
  modules: { continents?: boolean; plants?: boolean; fungi?: boolean; randomMutations?: boolean };
  mutators?: Partial<Record<MutatorId, boolean>>;
  wildWorld?: boolean;
  objectives: TutorialObjective[];
}

export const TUTORIAL_MISSIONS: Record<TutorialMissionId, TutorialMission> = {
  firstSteps: {
    id: "firstSteps",
    titleKey: "tutorial.mission.firstSteps.title",
    descKey: "tutorial.mission.firstSteps.desc",
    modules: {},
    objectives: [
      { id: "animal", textKey: "tutorial.obj.placeAnimal", done: (p) => p.placedAnimals >= 1 },
      { id: "traits", textKey: "tutorial.obj.placeTraits", done: (p) => p.placedTraits >= 2 },
      { id: "year2", textKey: "tutorial.obj.reachYear2", done: (p) => p.year >= 2 },
    ],
  },
  hunger: {
    id: "hunger",
    titleKey: "tutorial.mission.hunger.title",
    descKey: "tutorial.mission.hunger.desc",
    modules: {},
    objectives: [
      { id: "fat", textKey: "tutorial.obj.storeFat", done: (p) => p.fatStored },
      { id: "conflict", textKey: "tutorial.obj.conflict", done: (p) => p.survivedOrHunted },
      { id: "rich", textKey: "tutorial.obj.threeTraits", done: (p) => p.maxTraitsOnAnimal >= 3 },
    ],
  },
  wildWorld: {
    id: "wildWorld",
    titleKey: "tutorial.mission.wildWorld.title",
    descKey: "tutorial.mission.wildWorld.desc",
    modules: {},
    mutators: { scavengers: true },
    wildWorld: true,
    objectives: [
      { id: "forecast", textKey: "tutorial.obj.forecast", done: (p) => p.wildPlannedSeen },
      { id: "survive", textKey: "tutorial.obj.reachYear2", done: (p) => p.year >= 2 },
      { id: "scavenge", textKey: "tutorial.obj.scavenge", done: (p) => p.scavengedSeen },
    ],
  },
};

/** Миссия выполнена: все цели достигнуты. */
export function missionComplete(mission: TutorialMission, p: MissionProgress): boolean {
  return mission.objectives.every((o) => o.done(p));
}

/** Пройденные миссии — localStorage (evo-tutorial): «массив id» или null. */
export function loadDoneMissions(): TutorialMissionId[] {
  try {
    const raw = localStorage.getItem("evo-tutorial");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is TutorialMissionId => typeof v === "string" && v in TUTORIAL_MISSIONS,
    );
  } catch {
    return [];
  }
}

export function saveDoneMission(id: TutorialMissionId): TutorialMissionId[] {
  const done = loadDoneMissions();
  if (!done.includes(id)) done.push(id);
  try {
    localStorage.setItem("evo-tutorial", JSON.stringify(done));
  } catch {
    // приватный режим — прохождение просто не сохранится
  }
  return done;
}
