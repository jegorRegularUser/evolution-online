/**
 * Локальный хост матча кампании: тот же контур, что серверная комната
 * (src/lib/net/server.ts) — nextAutoStep → applyAction → пауза на модальные
 * карточки — но в браузере, без БД и сети. Чистый движок + chooseAIAction;
 * подписчик получает персональный вид (viewFor, сид 0) и батчи событий в
 * том же формате, что сервер, поэтому существующий стол рендерит кадры без
 * изменений.
 *
 * Мультиплеер-задел (решение владельца 09.11): интерфейс «GameAction →
 * кадры» один-в-один переедет на сервер, когда забег станет кооперативным;
 * стейт серийный (rngState внутри), шаги детерминированы.
 */
import type { EventBatch } from "../lib/net/shared.ts";
import { PACE } from "../lib/net/shared.ts";
import { viewFor } from "../lib/net/views.ts";
import { phaseGapMs, SHOW_TAIL_MS, spotlightMsOf } from "../lib/net/show-pacing.ts";
import { nextAutoStep } from "./auto-step.ts";
import { applyAction, createGame } from "./engine.ts";
import { runBattleScenario, type CampaignRun, type RunNode } from "./campaign-run.ts";
import type { Difficulty, GameAction, GameScenario, GameState, ModuleId, MutatorId } from "./types.ts";

/** Подписка хоста: кадры, финал и запрос на персист забега. */
export interface CampaignHostHooks {
  /** Кадр после шага: персональный вид + батч событий (null — начальный кадр). */
  onFrame: (view: GameState, batch: EventBatch | null) => void;
  /** Матч завершён: won — сид 0 среди победителей. */
  onFinished: (won: boolean, full: GameState) => void;
  /** После каждого шага: персист полного стейта (rngState) в забег. */
  onPersist: (full: GameState, version: number) => void;
}

/** Множитель темпа из настройки скорости стола (store.speed). */
export function speedFactorOf(speed: "slow" | "normal" | "fast"): number {
  if (speed === "slow") return 1.5;
  if (speed === "fast") return 0.55;
  return 1;
}

function mutatorList(mutators?: Partial<Record<MutatorId, boolean>>): MutatorId[] | undefined {
  if (!mutators) return undefined;
  const list = (Object.entries(mutators) as Array<[MutatorId, boolean | undefined]>)
    .filter(([, v]) => v)
    .map(([k]) => k);
  return list.length ? list : undefined;
}

/**
 * Пауза после шага — зеркало server.stepDelay: бросок кубика, вымирание/рост
 * и модальные события держат паузу, живые шаги ботов идут в темпе PACE.
 * Считается ПОСЛЕ применения шага (события уже в after.lastEvents).
 * Джиттер — только темп показа, стейт не трогает.
 */
function stepDelay(before: GameState, step: GameAction, after: GameState, factor: number): number {
  const j = () => Math.round((Math.random() * 2 - 1) * PACE.jitterMs);
  let ms: number;
  if (step.type === "rollFoodBank") {
    ms = Math.max(PACE.diceMs, spotlightMsOf(after.lastEvents) + SHOW_TAIL_MS);
  } else if (step.type === "continueExtinction" || step.type === "continueGrowth") {
    ms = PACE.extinctMs;
  } else {
    const changedTurn = before.currentPlayerId !== after.currentPlayerId;
    ms = Math.max(PACE.botMs + (changedTurn ? PACE.turnGapMs : 0), phaseGapMs(before, after));
  }
  return Math.max(120, Math.round((ms + j()) * factor));
}

export interface CampaignMatchConfig {
  difficulty: Difficulty;
  modules?: Partial<Record<ModuleId, boolean>>;
  mutators?: Partial<Record<MutatorId, boolean>>;
  wildWorld?: boolean;
  scenario?: GameScenario;
  opponentName: string;
  playerName: string;
  seed: number;
}

export class CampaignHost {
  readonly nodeId: string;
  private full: GameState;
  private version: number;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private done = false;
  private factor: number;
  private hooks: CampaignHostHooks;

  // Без параметрических свойств конструктора: тестовый гейт гонит модули
  // через --experimental-strip-types, а тот не strip-ает TS-only синтаксис.
  private constructor(nodeId: string, full: GameState, version: number, hooks: CampaignHostHooks, factor: number) {
    this.nodeId = nodeId;
    this.full = full;
    this.version = version;
    this.hooks = hooks;
    this.factor = factor;
  }

  /** Новый матч боевого узла: createGame с наградами забега человеку. */
  static startNode(
    run: CampaignRun,
    node: RunNode,
    playerName: string,
    opponentName: string,
    hooks: CampaignHostHooks,
    factor: number,
  ): CampaignHost | null {
    const b = node.battle;
    if (!b) return null;
    const full = createGame(
      2,
      b.difficulty,
      // Стабильный сдвиг по числу пройденных узлов: у боя свой микс колоды.
      (run.seed + run.cleared.length * 7919) % 1_000_000,
      [
        { name: playerName || "Evo", isAI: false },
        { name: opponentName || "Evo", isAI: true },
      ],
      b.modules,
      b.deckSize,
      { mutators: mutatorList(b.mutators), wildWorld: b.wildWorld },
      runBattleScenario(run, node),
    );
    const host = new CampaignHost(node.id, full, 0, hooks, factor);
    host.emitInitial();
    // Партия стартует: первый автошаг (например, ход бота первым) — через
    // initialMs, как у сервера после запуска партии.
    host.schedule();
    return host;
  }

  /** Возобновление матча после F5: полный стейт уже лежит в забеге. */
  static resumeMatch(run: CampaignRun, hooks: CampaignHostHooks, factor: number): CampaignHost | null {
    const match = run.match;
    if (!match) return null;
    const full = match.state;
    if (!full || full.phase === "gameOver") return null;
    const host = new CampaignHost(match.nodeId, full, match.version, hooks, factor);
    // Начальный кадр после F5 без батча: useNetReplay не должен «догонять»
    // старые события задним числом — стол показывает актуальную картину.
    host.emitInitial();
    host.schedule();
    return host;
  }

  /** Темп автошагов (настройка скорости стола). */
  setSpeedFactor(factor: number): void {
    this.factor = factor;
  }

  /** Полный стейт хоста (с rngState) — для персиста забега. */
  matchState(): GameState {
    return this.full;
  }

  /** Начальный кадр: стол получает актуальную картину, события не реплеятся. */
  private emitInitial(): void {
    this.hooks.onFrame(viewFor(this.full, 0), null);
    this.hooks.onPersist(this.full, this.version);
  }

  /** Остановить таймеры: стейт уже сохранён в забеге, матч продолжится позже. */
  stop(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /** Ход человека: применяем, публикуем кадр, передаём черед автопилоту. */
  act(action: GameAction): void {
    if (this.done) return;
    const actor = this.full.players[this.full.currentPlayerId];
    // Чужая очередь (бот/автофаза) — ход игнорируется: UI такие действия не
    // показывает, это защита от гонок (у сервера ту же роль играет CAS).
    if (!actor || actor.isAI || actor.resigned || this.full.phase === "gameOver") return;
    const before = this.full;
    if (!this.apply(action)) return;
    this.schedule(stepDelay(before, action, this.full, this.factor));
  }

  /** Применить шаг и опубликовать кадр; true — матч ещё идёт. */
  private apply(action: GameAction): boolean {
    const before = this.full;
    const after = applyAction(before, action);
    this.full = after;
    this.version += 1;
    const batch: EventBatch = { version: this.version, events: after.lastEvents };
    this.hooks.onFrame(viewFor(after, 0), batch);
    this.hooks.onPersist(after, this.version);
    if (after.phase === "gameOver") {
      this.done = true;
      this.stop();
      const won = Boolean(after.winnerIds?.includes(0));
      this.hooks.onFinished(won, after);
      return false;
    }
    return true;
  }

  /** Запланировать следующий автошаг; пауза — от предыдущего шага. */
  private schedule(delayMs?: number): void {
    if (this.done || this.timer !== null) return;
    if (!nextAutoStep(this.full)) return; // ход человека — ждём его
    this.timer = setTimeout(() => {
      this.timer = null;
      this.tick();
    }, delayMs ?? PACE.initialMs);
  }

  private tick(): void {
    if (this.done) return;
    const step = nextAutoStep(this.full);
    if (!step) return;
    const before = this.full;
    if (!this.apply(step)) return;
    this.schedule(stepDelay(before, step, this.full, this.factor));
  }
}
