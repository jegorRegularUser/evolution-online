/**
 * Забег кампании (фундамент рогалик-переработки «Эр»): кампания — отдельный
 * ЛОКАЛЬНЫЙ режим на чистом движке, а не преднастроенная сетевая комната.
 * Эпоха = путь (граф узлов): бой → награда → бой → … → изверг. Заход
 * мгновенный, ничего не требует: ни профиля, ни сервера, ни пройденных
 * уровней — эпохи открыты все. Забег рассчитан на одну посиделку (~15–30
 * минут), проигрыш не отнимает ничего вне забега — жёсткой прогрессии нет.
 *
 * Персист: localStorage evo-campaign-run, полный стейт матча внутри забега
 * (rngState движка — хост в браузере), поэтому F5 возобновляет партию.
 * Старый ключ evo-campaign (миссии волны 4а) не трогаем — чужие данные.
 *
 * Мультиплеер-задел (решение владельца 09.11): забег — серийные данные,
 * хост матча (campaign-host.ts) — чистый контур «GameAction → кадры». Когда
 * забег станет кооперативным, тот же контур переедет на сервер без смены
 * модели данных.
 */
import type { TKey } from "../lib/i18n";
import type { CampaignEraId } from "./campaign.ts";
import type { Difficulty, GameState, ModuleId, MutatorId, TraitId } from "./types.ts";

/** Узел пути забега. */
export type RunNodeKind = "battle" | "elite" | "boss" | "reward";

/** Конфиг партии боевого узла: обычный соперник или изверг. */
export interface RunBattle {
  /** Имя соперника (ключ словаря): учёный-бот или изверг. */
  nameKey: TKey;
  difficulty: Difficulty;
  /**
   * Размер колоды свойств: забег рассчитан на посиделку, поэтому колода
   * короче полной (база 84, «Растения» 120) — бой на ~5-6 лет вместо ~10 (симуляция калибровки).
   * Босс чуть длиннее. Движок поднимает до минимума, если модулю нужно больше.
   */
  deckSize?: number;
  modules?: Partial<Record<ModuleId, boolean>>;
  mutators?: Partial<Record<MutatorId, boolean>>;
  wildWorld?: boolean;
  /** Ломающее правило изверга (узлы boss); сид босса — всегда 1. */
  scenario?: Omit<import("./types.ts").GameScenario, "seat" | "humanBoons">;
}

/** Награда на выбор: усиление следующих боёв забега. */
export interface RunReward {
  id: string;
  nameKey: TKey;
  descKey: TKey;
  boon: { kind: "handBonus"; amount: number } | { kind: "startTrait"; trait: TraitId };
}

export interface RunNode {
  id: string;
  kind: RunNodeKind;
  titleKey: TKey;
  /** Дневник натуралиста: реплика перед узлом. */
  diaryKey: TKey;
  /** Боевой узел: конфиг партии. */
  battle?: RunBattle;
  /** Узел награды: три варианта на выбор. */
  rewards?: RunReward[];
  /** Идентификаторы следующих узлов (граф; сейчас путь линеен). */
  next: string[];
}

/** Забег: путь эпохи + накопленные награды + идущий матч. */
export interface CampaignRun {
  version: 1;
  id: string;
  era: CampaignEraId;
  seed: number;
  startedAt: number;
  /** Плоская карта узлов пути эпохи. */
  nodes: Record<string, RunNode>;
  currentNodeId: string;
  /** Пройденные узлы по порядку. */
  cleared: string[];
  /** Накопленные награды: применяются к каждому следующему бою. */
  stash: { handBonus: number; startTraits: TraitId[] };
  status: "active" | "won" | "lost";
  /**
   * Идущий матч: полный стейт хоста (с rngState — сериализуемое продолжение
   * после F5) и версия батчей событий. null — между узлами пути.
   */
  match: { nodeId: string; state: GameState; version: number } | null;
}

// ── каталог наград ───────────────────────────────────────────────────────────

/** Общий пул наград: у каждого узла награды — свой срез из трёх. */
const BONUS_HAND: RunReward = {
  id: "hand",
  nameKey: "campaign.reward.hand.name",
  descKey: "campaign.reward.hand.desc",
  boon: { kind: "handBonus", amount: 1 },
};
const TRAIT_BURROW: RunReward = {
  id: "burrowing",
  nameKey: "campaign.reward.burrow.name",
  descKey: "campaign.reward.burrow.desc",
  boon: { kind: "startTrait", trait: "burrowing" },
};
const TRAIT_TAIL: RunReward = {
  id: "tailLoss",
  nameKey: "campaign.reward.tail.name",
  descKey: "campaign.reward.tail.desc",
  boon: { kind: "startTrait", trait: "tailLoss" },
};
const TRAIT_SWIM: RunReward = {
  id: "swimming",
  nameKey: "campaign.reward.swim.name",
  descKey: "campaign.reward.swim.desc",
  boon: { kind: "startTrait", trait: "swimming" },
};

/** Срезы пула по слоту награды: детерминированы, забег ничего не рандомит. */
const REWARD_SETS: RunReward[][] = [
  [BONUS_HAND, TRAIT_BURROW, TRAIT_TAIL],
  [TRAIT_SWIM, BONUS_HAND, TRAIT_BURROW],
];

// ── пути эпох ────────────────────────────────────────────────────────────────

/** Построить линейный путь эпохи из узлов; связывает next автоматически. */
function chain(nodes: Array<Omit<RunNode, "next">>): { nodes: Record<string, RunNode>; first: string } {
  const map: Record<string, RunNode> = {};
  for (let i = 0; i < nodes.length; i++) {
    map[nodes[i]!.id] = { ...nodes[i]!, next: nodes[i + 1] ? [nodes[i + 1]!.id] : [] };
  }
  return { nodes: map, first: nodes[0]!.id };
}

function eraPath(era: CampaignEraId): { nodes: Record<string, RunNode>; first: string } {
  let rewardSlot = 0;
  const reward = (id: string): RunNode => {
    const rewards = REWARD_SETS[rewardSlot % REWARD_SETS.length]!;
    rewardSlot += 1;
    return {
      id,
      kind: "reward",
      titleKey: "campaign.node.reward.title",
      diaryKey: "campaign.node.reward.diary",
      rewards: [...rewards],
      next: [],
    };
  };
  switch (era) {
    case "cambrian":
      return chain([
        {
          id: "cambrian-1",
          kind: "battle",
          titleKey: "campaign.node.cambrian1.title",
          diaryKey: "campaign.node.cambrian1.diary",
          battle: {
            nameKey: "campaign.node.cambrian1.opp",
            deckSize: 36,
            difficulty: "easy",
          },
        },
        reward("cambrian-2"),
        {
          id: "cambrian-3",
          kind: "battle",
          titleKey: "campaign.node.cambrian3.title",
          diaryKey: "campaign.node.cambrian3.diary",
          battle: {
            nameKey: "campaign.node.cambrian3.opp",
            deckSize: 36,
            difficulty: "easy",
            mutators: { scavengers: true },
          },
        },
        reward("cambrian-4"),
        {
          id: "cambrian-5",
          kind: "boss",
          titleKey: "campaign.m.cambrianBoss.title",
          diaryKey: "campaign.m.cambrianBoss.diary",
          battle: {
            nameKey: "campaign.boss.trilobite",
            deckSize: 44,
            difficulty: "normal",
            scenario: { doubleHunt: true },
          },
        },
      ]);
    case "devon":
      return chain([
        {
          id: "devon-1",
          kind: "battle",
          titleKey: "campaign.node.devon1.title",
          diaryKey: "campaign.node.devon1.diary",
          battle: {
            nameKey: "campaign.node.devon1.opp",
            deckSize: 44,
            difficulty: "easy",
            modules: { plants: true },
          },
        },
        reward("devon-2"),
        {
          id: "devon-3",
          kind: "elite",
          titleKey: "campaign.node.devon3.title",
          diaryKey: "campaign.node.devon3.diary",
          battle: {
            nameKey: "campaign.node.devon3.opp",
            deckSize: 44,
            difficulty: "normal",
            modules: { plants: true },
            mutators: { rapidEvolution: true },
          },
        },
        reward("devon-4"),
        {
          id: "devon-5",
          kind: "boss",
          titleKey: "campaign.m.devonBoss.title",
          diaryKey: "campaign.m.devonBoss.diary",
          battle: {
            nameKey: "campaign.boss.bonecrusher",
            deckSize: 52,
            difficulty: "normal",
            modules: { plants: true },
            scenario: { bossFeedsExtra: true },
          },
        },
      ]);
    case "glacier":
      return chain([
        {
          id: "glacier-1",
          kind: "battle",
          titleKey: "campaign.node.glacier1.title",
          diaryKey: "campaign.node.glacier1.diary",
          battle: {
            nameKey: "campaign.node.glacier1.opp",
            deckSize: 36,
            difficulty: "normal",
            wildWorld: true,
          },
        },
        reward("glacier-2"),
        {
          id: "glacier-3",
          kind: "elite",
          titleKey: "campaign.node.glacier3.title",
          diaryKey: "campaign.node.glacier3.diary",
          battle: {
            nameKey: "campaign.node.glacier3.opp",
            deckSize: 36,
            difficulty: "hard",
            wildWorld: true,
            mutators: { scavengers: true },
          },
        },
        reward("glacier-4"),
        {
          id: "glacier-5",
          kind: "boss",
          titleKey: "campaign.m.glacierBoss.title",
          diaryKey: "campaign.m.glacierBoss.diary",
          battle: {
            nameKey: "campaign.boss.atroxabilis",
            deckSize: 44,
            difficulty: "hard",
            wildWorld: true,
            scenario: { doubleHunt: true },
          },
        },
      ]);
  }
}

// ── жизненный цикл забега ────────────────────────────────────────────────────

let runSeq = 0;

/** Новый забег за эпоху: путь строится сразу, статус active, матч не начат. */
export function createCampaignRun(era: CampaignEraId): CampaignRun {
  const { nodes, first } = eraPath(era);
  runSeq += 1;
  return {
    version: 1,
    id: `run-${Date.now().toString(36)}-${runSeq}`,
    era,
    seed: Date.now() % 1_000_000,
    startedAt: Date.now(),
    nodes,
    currentNodeId: first,
    cleared: [],
    stash: { handBonus: 0, startTraits: [] },
    status: "active",
    match: null,
  };
}

/** Сценарий партии боевого узла: правило босса + награды забега человеку. */
export function runBattleScenario(run: CampaignRun, node: RunNode): import("./types.ts").GameScenario | undefined {
  if (!node.battle) return undefined;
  return {
    seat: 1,
    ...(node.battle.scenario ?? {}),
    humanBoons: {
      handBonus: Math.min(3, run.stash.handBonus),
      startTraits: [...run.stash.startTraits],
    },
  };
}

/**
 * Победа в бою: узел закрыт, курсор — на следующий узел (награда/босс).
 * Финал пути — забег выигран. Ничего не возвращает: данные мутирует по месту,
 * вызывающий сохраняет забег.
 */
export function clearCurrentNode(run: CampaignRun): void {
  const node = run.nodes[run.currentNodeId];
  if (!node) return;
  run.cleared.push(node.id);
  const next = node.next[0];
  if (!next) {
    run.status = "won";
    run.currentNodeId = "";
    return;
  }
  run.currentNodeId = next;
}

/** Применить выбранную награду к заначке забега (потолок +2 к руке). */
export function applyReward(run: CampaignRun, reward: RunReward): void {
  if (reward.boon.kind === "handBonus") {
    run.stash.handBonus = Math.min(2, run.stash.handBonus + reward.boon.amount);
    return;
  }
  if (!run.stash.startTraits.includes(reward.boon.trait)) {
    run.stash.startTraits.push(reward.boon.trait);
  }
}

/** Забег проигран: статус lost, матч сбрасывается. Мета вне забега не страдает. */
export function loseRun(run: CampaignRun): void {
  run.status = "lost";
  run.match = null;
}

// ── персист ──────────────────────────────────────────────────────────────────

const RUN_KEY = "evo-campaign-run";

/** Активный забег устройства: null — нет сохранения или оно битое. */
export function loadCampaignRun(): CampaignRun | null {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CampaignRun;
    if (!parsed || typeof parsed !== "object" || parsed.version !== 1) return null;
    if (!parsed.nodes || typeof parsed.nodes !== "object" || typeof parsed.currentNodeId !== "string") return null;
    if (!parsed.match || typeof parsed.match !== "object") parsed.match = null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCampaignRun(run: CampaignRun | null): void {
  try {
    if (run) localStorage.setItem(RUN_KEY, JSON.stringify(run));
    else localStorage.removeItem(RUN_KEY);
  } catch {
    // приватный режим — забег просто не переживёт перезагрузку
  }
}
