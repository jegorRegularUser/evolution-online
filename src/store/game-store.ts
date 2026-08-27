import { create } from "zustand";
import { chooseAIAction } from "@/game/ai";
import {
  applyAction,
  createGame,
  currentActor,
  legalDefenseActions,
  legalDevActions,
  legalFeedActions,
} from "@/game/engine";
import type { Difficulty, GameAction, GameSpeed, GameState, ModuleId } from "@/game/types";
import { NetSession, type NetHooks, type NetStatus } from "@/lib/net/session";
import type { SeatInfo } from "@/lib/net/shared";

export type UiIntent =
  | { kind: "none" }
  | { kind: "playAnimal"; cardId: string }
  | { kind: "placeAnimal"; cardId: string }
  | { kind: "playTrait"; cardId: string; face: number }
  | { kind: "playPair"; cardId: string; face: number; first?: string }
  | { kind: "hunt"; carnivoreId?: string }
  | { kind: "pirate"; pirateId?: string }
  | { kind: "take" }
  | { kind: "hibernate" }
  | { kind: "fat" }
  | { kind: "graze" };

/** Сетевой стол в UI: что показывают лобби и баннер соединения. */
export interface NetUiState {
  code: string;
  seat: number;
  status: NetStatus;
  error: string | null;
  seats: SeatInfo[];
  hostSeat: number;
  capacity: number;
}

export interface NetCreateConfig {
  name: string;
  capacity: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  botSeats: number;
  difficulty: Difficulty;
  /** Включённые дополнения стола (пока «Континенты»). */
  modules?: Partial<Record<ModuleId, boolean>>;
}

interface GameStore {
  state: GameState | null;
  thinking: boolean;
  /** Кто именно из ботов думает — для подсветки табло игрока. */
  thinkingWho: number | null;
  intent: UiIntent;
  rulesOpen: boolean;
  logOpen: boolean;
  speed: GameSpeed;
  /** Дополнения, выбранные в меню — применяются к новой solo-партии. */
  modules: Partial<Record<ModuleId, boolean>>;
  /** solo — партия против ботов на этом устройстве; net — сетевой стол. */
  mode: "solo" | "net";
  net: NetUiState | null;
  start: (players: number, difficulty: Difficulty) => void;
  setModules: (m: Partial<Record<ModuleId, boolean>>) => void;
  reset: () => void;
  dispatch: (action: GameAction) => void;
  setIntent: (intent: UiIntent) => void;
  setRulesOpen: (v: boolean) => void;
  setLogOpen: (v: boolean) => void;
  setSpeed: (v: GameSpeed) => void;
  tickAI: () => void;
  startNetCreate: (cfg: NetCreateConfig) => Promise<void>;
  startNetJoin: (code: string, name: string) => Promise<void>;
  /** Возврат за сохранённое место по ссылке ?room=КОД; false — не вышло. */
  resumeNetFromUrl: (code: string) => Promise<boolean>;
  netAddBots: (delta: number) => Promise<void>;
  netStart: () => Promise<void>;
  netAgain: () => Promise<void>;
  leaveNet: () => void;
}

let aiTimer: ReturnType<typeof setTimeout> | null = null;

/** Активная сетевая сессия (одна на вкладку). */
let netSession: NetSession | null = null;

function clearAi() {
  if (aiTimer) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

// Темп игры: множители скорости и базовые паузы (мс) на нормальной скорости.
const SPEED_MULT: Record<GameSpeed, number> = { slow: 1.7, normal: 1, fast: 0.55 };
const DICE_MS = 2000;
const EXTINCTION_MS = 2200;
const DEV_MS = 1300;
const FEED_MS = 950;
const DEFENSE_MS = 1050;
const TURN_GAP_MS = 700;

/** Последний бот, делавший ход: чтобы делать паузу при передаче хода. */
let lastBotActor: number | null = null;

/**
 * Мост NetSession → стор: кадры сервера ложатся в state/net, статус
 * соединения — в баннер переподключения.
 */
function netHooks(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
): NetHooks {
  return {
    onSnapshot: (snap) => {
      const cur = get().net;
      if (!cur) return;
      set({
        state: snap.state,
        net: {
          ...cur,
          code: snap.room.code,
          seat: snap.seat,
          capacity: snap.room.capacity,
          seats: snap.seats,
          hostSeat: snap.room.hostSeat,
        },
      });
    },
    onSeats: (seats, hostSeat) => {
      const cur = get().net;
      if (!cur) return;
      set({ net: { ...cur, seats, hostSeat } });
    },
    onStatus: (status) => {
      const cur = get().net;
      if (!cur) return;
      set({ net: { ...cur, status, error: status === "reconnecting" ? cur.error : null } });
    },
  };
}

export function loadSpeed(): GameSpeed {
  try {
    const v = localStorage.getItem("evo-speed");
    if (v === "slow" || v === "normal" || v === "fast") return v;
  } catch {
    // localStorage может быть недоступен — нормальная скорость по умолчанию.
  }
  return "normal";
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  thinking: false,
  thinkingWho: null,
  intent: { kind: "none" },
  rulesOpen: false,
  logOpen: false,
  speed: "normal",
  modules: {},
  mode: "solo",
  net: null,

  start: (players, difficulty) => {
    clearAi();
    const seed = Date.now() % 1_000_000;
    const state = createGame(players, difficulty, seed, undefined, get().modules);
    lastBotActor = null;
    set({
      state,
      thinking: false,
      thinkingWho: null,
      intent: { kind: "none" },
    });
    queueMicrotask(() => get().tickAI());
  },

  setModules: (modules) => set({ modules }),

  reset: () => {
    clearAi();
    if (get().mode === "net") {
      netSession?.stop();
      netSession = null;
    }
    set({
      state: null,
      mode: "solo",
      net: null,
      thinking: false,
      thinkingWho: null,
      intent: { kind: "none" },
    });
  },

  dispatch: (action) => {
    if (get().mode === "net") {
      const s = netSession;
      if (!s) return;
      set({ intent: { kind: "none" } });
      void s.act(action).then((err) => {
        const cur = get().net;
        if (err && cur) set({ net: { ...cur, error: err } });
      });
      return;
    }
    const { state } = get();
    if (!state) return;
    if (state.phase === "gameOver") return;
    const next = applyAction(state, action);
    lastBotActor = null;
    set({ state: next, intent: { kind: "none" }, thinking: false });
    queueMicrotask(() => get().tickAI());
  },

  setIntent: (intent) => set({ intent }),
  setRulesOpen: (rulesOpen) => set({ rulesOpen }),
  setLogOpen: (logOpen) => set({ logOpen }),
  setSpeed: (speed) => {
    try {
      localStorage.setItem("evo-speed", speed);
    } catch {
      // приватный режим — скорость просто не сохранится
    }
    set({ speed });
  },

  // ── сетевой стол ──────────────────────────────────────────────────────────

  startNetCreate: async (cfg) => {
    clearAi();
    const s = new NetSession(netHooks(set, get));
    netSession = s;
    set({
      mode: "net",
      state: null,
      intent: { kind: "none" },
      thinking: false,
      thinkingWho: null,
      net: {
        code: "",
        seat: 0,
        status: "connecting",
        error: null,
        seats: [],
        hostSeat: 0,
        capacity: cfg.capacity,
      },
    });
    try {
      await s.create(cfg);
    } catch (e) {
      s.stop();
      netSession = null;
      set({ mode: "solo", net: null });
      throw e;
    }
  },

  startNetJoin: async (code, name) => {
    clearAi();
    const s = new NetSession(netHooks(set, get));
    netSession = s;
    set({
      mode: "net",
      state: null,
      intent: { kind: "none" },
      thinking: false,
      thinkingWho: null,
      net: {
        code: code.toUpperCase(),
        seat: -1,
        status: "connecting",
        error: null,
        seats: [],
        hostSeat: 0,
        capacity: 0,
      },
    });
    try {
      await s.join(code, name);
    } catch (e) {
      s.stop();
      netSession = null;
      set({ mode: "solo", net: null });
      throw e;
    }
  },

  resumeNetFromUrl: async (code) => {
    clearAi();
    const s = new NetSession(netHooks(set, get));
    try {
      await s.resume(code);
    } catch {
      s.stop();
      return false;
    }
    netSession = s;
    set({
      mode: "net",
      state: null,
      intent: { kind: "none" },
      net: {
        code: code.toUpperCase(),
        seat: -1,
        status: "connecting",
        error: null,
        seats: [],
        hostSeat: 0,
        capacity: 0,
      },
    });
    return true;
  },

  netAddBots: async (delta) => {
    const n = get().net;
    if (!n || !netSession || n.status !== "lobby") return;
    const bots = n.seats.filter((x) => x.isAI).length;
    const humans = n.seats.length - bots;
    const count = Math.max(0, Math.min(bots + delta, n.capacity - humans));
    await netSession.setBots(count).catch(() => {});
    netSession.refresh();
  },

  netStart: async () => {
    if (!netSession) return;
    await netSession.start().catch((e) => {
      const cur = get().net;
      if (cur) set({ net: { ...cur, error: String(e.message ?? e) } });
    });
  },

  netAgain: async () => {
    if (!netSession) return;
    await netSession.again().catch(() => {});
    netSession.refresh();
  },

  leaveNet: () => {
    netSession?.stop();
    netSession = null;
    clearAi();
    set({
      mode: "solo",
      net: null,
      state: null,
      thinking: false,
      thinkingWho: null,
      intent: { kind: "none" },
    });
  },

  /**
   * Драйвер автоматики: кубики кормовой базы, показ вымирания и ходы ботов.
   * Каждое микро-действие бота — отдельный таймер с паузой по весу действия,
   * плюс дополнительная пауза при передаче хода между игроками.
   */
  tickAI: () => {
    if (get().mode === "net") {
      // В сетевой партии ботов и автофазы двигает сервер.
      clearAi();
      return;
    }
    clearAi();
    const { state, speed } = get();
    if (!state) return;
    const mult = SPEED_MULT[speed];

    if (state.phase === "gameOver") {
      set({ thinking: false, thinkingWho: null });
      return;
    }

    if (state.phase === "foodBank") {
      set({ thinking: false, thinkingWho: null });
      if (!state.foodRoll) {
        get().dispatch({ type: "rollFoodBank" });
        return;
      }
      aiTimer = setTimeout(() => get().dispatch({ type: "beginFeeding" }), DICE_MS * mult);
      return;
    }

    if (state.phase === "extinction") {
      set({ thinking: false, thinkingWho: null });
      aiTimer = setTimeout(() => get().dispatch({ type: "continueExtinction" }), EXTINCTION_MS * mult);
      return;
    }

    const actor = currentActor(state);
    if (!actor) return;
    if (!actor.isAI) {
      set({ thinking: false, thinkingWho: null });
      return;
    }

    set({ thinking: true, thinkingWho: actor.id });
    const turnGap = lastBotActor !== null && lastBotActor !== actor.id ? TURN_GAP_MS : 0;
    const quick =
      state.pendingAttack !== null
        ? DEFENSE_MS
        : state.phase === "development"
          ? DEV_MS
          : FEED_MS;
    const delay = (quick + turnGap) * mult * (0.85 + Math.random() * 0.3);

    aiTimer = setTimeout(() => {
      const cur = get();
      if (!cur.state) return;
      const who = currentActor(cur.state);
      if (!who?.isAI) {
        set({ thinking: false, thinkingWho: null });
        return;
      }
      const action = chooseAIAction(cur.state);
      if (!action) {
        set({ thinking: false, thinkingWho: null });
        return;
      }
      const next = applyAction(cur.state, action);
      lastBotActor = who.id;
      set({ state: next });
      queueMicrotask(() => get().tickAI());
    }, delay);
  },
}));

export { legalDevActions, legalFeedActions, legalDefenseActions };
