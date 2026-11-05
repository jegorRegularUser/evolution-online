/**
 * Кампания «Эры» (волна 4а, дизайн-пакет §4.1А): туториальная лестница +
 * боссы-изверги. Миссия = обычная комната с ИИ (бот — изверг на финале эпохи)
 * + цели-предикаты (та же механика, что у учебных миссий src/game/tutorial.ts).
 * Ломающее правило изверга живёт в движке как сценарный флаг (types.ts
 * GameScenario) — «настольно-легальная» эскалация, подсчёт очков не тронут.
 *
 * Структура: эпоха = 1-2 учебных миссии + изверг. Прогресс — localStorage
 * (evo-campaign); «Хард» открывается после «Нормы» (формула Naxxramas §4.1А).
 * Награды кампании в 4а не привязаны к деньгам — «Ископаемые» приносят
 * вызовы §3а, сыгранные в этих же партиях.
 */
import type { TKey } from "../lib/i18n";
import type { Difficulty, GameScenario, ModuleId, MutatorId } from "./types.ts";
import type { MissionProgress } from "./tutorial.ts";

export type CampaignMissionId =
  | "cambrian-growth"
  | "cambrian-hunt"
  | "cambrian-boss"
  | "devon-plants"
  | "devon-boss"
  | "glacier-boss";

export interface CampaignMission {
  id: CampaignMissionId;
  era: CampaignEraId;
  titleKey: TKey;
  /** Дневник натуралиста: один абзац перед миссией — он же descKey для HUD. */
  diaryKey: TKey;
  descKey: TKey;
  difficulty: Difficulty;
  modules?: Partial<Record<ModuleId, boolean>>;
  mutators?: Partial<Record<MutatorId, boolean>>;
  wildWorld?: boolean;
  /** Изверг: сид 1 (первый бот) + ломающее правило; имя — для UI. */
  boss?: { nameKey: TKey; scenario: Omit<GameScenario, "seat"> };
  objectives: Array<{ id: string; textKey: TKey; done: (p: MissionProgress) => boolean }>;
}

export type CampaignEraId = "cambrian" | "devon" | "glacier";

export const CAMPAIGN_ERAS: Array<{ id: CampaignEraId; titleKey: TKey }> = [
  { id: "cambrian", titleKey: "campaign.era.cambrian" },
  { id: "devon", titleKey: "campaign.era.devon" },
  { id: "glacier", titleKey: "campaign.era.glacier" },
];

const won = (p: MissionProgress) => p.gameWon;
const year2 = (p: MissionProgress) => p.year >= 2;
const year3 = (p: MissionProgress) => p.year >= 3;
const lostAtMost2 = (p: MissionProgress) => p.gameWon && p.animalsLost <= 2;

export const CAMPAIGN_MISSIONS: Record<CampaignMissionId, CampaignMission> = {
  "cambrian-growth": {
    id: "cambrian-growth",
    era: "cambrian",
    titleKey: "campaign.m.cambrianGrowth.title",
    diaryKey: "campaign.m.cambrianGrowth.diary",
    descKey: "campaign.m.cambrianGrowth.diary",
    difficulty: "easy",
    objectives: [
      { id: "animals", textKey: "tutorial.obj.placeAnimal", done: (p) => p.placedAnimals >= 2 },
      { id: "traits", textKey: "tutorial.obj.placeTraits", done: (p) => p.placedTraits >= 3 },
      { id: "year2", textKey: "tutorial.obj.reachYear2", done: year2 },
    ],
  },
  "cambrian-hunt": {
    id: "cambrian-hunt",
    era: "cambrian",
    titleKey: "campaign.m.cambrianHunt.title",
    diaryKey: "campaign.m.cambrianHunt.diary",
    descKey: "campaign.m.cambrianHunt.diary",
    difficulty: "easy",
    objectives: [
      { id: "hunt", textKey: "tutorial.obj.conflict", done: (p) => p.survivedOrHunted },
      { id: "year3", textKey: "tutorial.obj.reachYear2", done: year3 },
      { id: "win", textKey: "campaign.obj.win", done: won },
    ],
  },
  "cambrian-boss": {
    id: "cambrian-boss",
    era: "cambrian",
    titleKey: "campaign.m.cambrianBoss.title",
    diaryKey: "campaign.m.cambrianBoss.diary",
    descKey: "campaign.m.cambrianBoss.diary",
    difficulty: "normal",
    boss: {
      nameKey: "campaign.boss.trilobite",
      scenario: { doubleHunt: true },
    },
    objectives: [
      { id: "conflict", textKey: "tutorial.obj.conflict", done: (p) => p.survivedOrHunted },
      { id: "rich", textKey: "tutorial.obj.threeTraits", done: (p) => p.maxTraitsOnAnimal >= 3 },
      { id: "win", textKey: "campaign.obj.win", done: won },
    ],
  },
  "devon-plants": {
    id: "devon-plants",
    era: "devon",
    titleKey: "campaign.m.devonPlants.title",
    diaryKey: "campaign.m.devonPlants.diary",
    descKey: "campaign.m.devonPlants.diary",
    difficulty: "normal",
    modules: { plants: true },
    objectives: [
      { id: "plantFood", textKey: "campaign.obj.plantFood", done: (p) => p.plantFoodTaken >= 3 },
      { id: "traits", textKey: "tutorial.obj.placeTraits", done: (p) => p.placedTraits >= 4 },
      { id: "year3", textKey: "tutorial.obj.reachYear2", done: year3 },
    ],
  },
  "devon-boss": {
    id: "devon-boss",
    era: "devon",
    titleKey: "campaign.m.devonBoss.title",
    diaryKey: "campaign.m.devonBoss.diary",
    descKey: "campaign.m.devonBoss.diary",
    difficulty: "normal",
    boss: {
      nameKey: "campaign.boss.bonecrusher",
      scenario: { bossFeedsExtra: true },
    },
    objectives: [
      { id: "win", textKey: "campaign.obj.win", done: won },
      { id: "losses", textKey: "campaign.obj.fewLosses", done: lostAtMost2 },
    ],
  },
  "glacier-boss": {
    id: "glacier-boss",
    era: "glacier",
    titleKey: "campaign.m.glacierBoss.title",
    diaryKey: "campaign.m.glacierBoss.diary",
    descKey: "campaign.m.glacierBoss.diary",
    difficulty: "hard",
    wildWorld: true,
    boss: {
      nameKey: "campaign.boss.atroxabilis",
      scenario: { doubleHunt: true },
    },
    objectives: [
      { id: "forecast", textKey: "tutorial.obj.forecast", done: (p) => p.wildPlannedSeen },
      { id: "win", textKey: "campaign.obj.win", done: won },
    ],
  },
};

/** Прогресс кампании: пройденные «Норма» и «Хард» — localStorage evo-campaign. */
export interface CampaignProgress {
  done: CampaignMissionId[];
  hard: CampaignMissionId[];
}

export function loadCampaignProgress(): CampaignProgress {
  try {
    const raw = localStorage.getItem("evo-campaign");
    if (!raw) return { done: [], hard: [] };
    const parsed = JSON.parse(raw) as Partial<CampaignProgress>;
    const valid = (arr: unknown): CampaignMissionId[] =>
      Array.isArray(arr) ? parsed ? (arr.filter((v) => typeof v === "string" && v in CAMPAIGN_MISSIONS) as CampaignMissionId[]) : [] : [];
    return { done: valid(parsed.done), hard: valid(parsed.hard) };
  } catch {
    return { done: [], hard: [] };
  }
}

export function saveCampaignProgress(progress: CampaignProgress): void {
  try {
    localStorage.setItem("evo-campaign", JSON.stringify(progress));
  } catch {
    // приватный режим — прохождение не сохранится
  }
}
