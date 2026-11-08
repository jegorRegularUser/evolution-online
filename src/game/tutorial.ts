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
import { isFed } from "./queries.ts";
import type { Animal, GameEvent, GameState, MutatorId } from "./types.ts";

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
  /**
   * Максимум СВОИХ накормленных животных одновременно («прокорми стадо»).
   * Срез состояния на каждом кадре: еда обнуляется между годами, поэтому
   * «сыты одновременно» — это про один год питания.
   */
  maxFedAnimals: number;
  /**
   * Максимум своих животных с ПОПАРНО различными наборами свойств
   * («разнородное стадо»); животное без свойств в стадо не считается.
   */
  maxDistinctHerds: number;
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
    maxFedAnimals: 0,
    maxDistinctHerds: 0,
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

/**
 * Сколько животных образуют «разнородное стадо»: у каждого хотя бы одно
 * свойство, и наборы свойств попарно различны. Ответ — число уникальных
 * непустых наборов: два вида с одинаковым набором считаются одним.
 */
function distinctTraitSets(animals: Animal[]): number {
  const seen = new Set<string>();
  for (const a of animals) {
    if (!a.traits.length) continue;
    seen.add(
      a.traits
        .map((t) => t.type)
        .sort()
        .join("+"),
    );
  }
  return seen.size;
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
  // Там же — «прокорми стадо» и «разнородное стадо»: оба считаются по
  // текущим карточкам, события про одновременность не знают ничего.
  const human = state.players[state.humanId];
  if (human) {
    let fed = 0;
    for (const a of human.animals) {
      progress.maxTraitsOnAnimal = Math.max(progress.maxTraitsOnAnimal, a.traits.length);
      if (isFed(a)) fed += 1;
    }
    progress.maxFedAnimals = Math.max(progress.maxFedAnimals, fed);
    progress.maxDistinctHerds = Math.max(progress.maxDistinctHerds, distinctTraitSets(human.animals));
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

/** Миссия выполнена: все цели достигнуты. Форма — структурная: учебная и
 *  кампанейская миссии (campaign.ts) работают с одним и тем же предикатом. */
export function missionComplete(
  mission: { objectives: ReadonlyArray<TutorialObjective> },
  p: MissionProgress,
): boolean {
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

/**
 * Активная (незавершённая) миссия обучения — localStorage (evo-tutorial-active).
 * Флаг tutorialMission в сторе не переживает F5 (store инициализируется заново),
 * а сетевой стол по ?room возобновляется: без этой записи HUD после перезагрузки
 * остаётся без миссии, цели не следятся и прохождение не засчитывается.
 * code привязывает миссию к столу: чужая комната флаг не подхватывает.
 */
export interface ActiveMissionRecord {
  id: TutorialMissionId;
  /** Код стола, за которым идёт миссия; null — стол ещё не создан. */
  code: string | null;
}

const ACTIVE_MISSION_KEY = "evo-tutorial-active";

/** Читает активную миссию; битая/чужая запись — null (самолечение). */
export function loadActiveMission(): ActiveMissionRecord | null {
  try {
    const raw = localStorage.getItem(ACTIVE_MISSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const { id, code } = parsed as { id?: unknown; code?: unknown };
    if (typeof id !== "string" || !(id in TUTORIAL_MISSIONS)) return null;
    return { id: id as TutorialMissionId, code: typeof code === "string" ? code : null };
  } catch {
    return null;
  }
}

export function saveActiveMission(record: ActiveMissionRecord | null): void {
  try {
    if (record) localStorage.setItem(ACTIVE_MISSION_KEY, JSON.stringify(record));
    else localStorage.removeItem(ACTIVE_MISSION_KEY);
  } catch {
    // приватный режим — возобновление после F5 просто не заработает
  }
}

/**
 * Посев прогресса из серверных метрик партии (state.stats, волна 3а): они
 * копятся движком по тем же событиям для своего игрока и живут в состоянии
 * комнаты — после F5 клиентский аккумулятор пуст, а stats честно покрывают
 * партию до текущего кадра. Вызывается один раз при старте слежения, до
 * первой абсорбции; цели, у которых нет метрики (прогноз «Дикого мира»,
 * срезы «прокорми/разнородное стадо»), стартуют с нуля — они достижимы в
 * любой момент партии.
 */
export function seedProgressFromStats(progress: MissionProgress, state: GameState): void {
  const s = state.stats;
  if (!s) return;
  progress.placedAnimals = Math.max(progress.placedAnimals, s.animalsPlaced);
  progress.placedTraits = Math.max(progress.placedTraits, s.traitsPlaced);
  progress.fatStored ||= s.fatStored > 0;
  progress.survivedOrHunted ||= s.preyEaten > 0 || s.defended > 0;
  progress.maxTraitsOnAnimal = Math.max(progress.maxTraitsOnAnimal, s.maxTraitsOnAnimal);
  progress.scavengedSeen ||= s.scavenges > 0;
  progress.animalsLost = Math.max(progress.animalsLost, s.animalsLost);
  progress.year = Math.max(progress.year, state.year);
}
