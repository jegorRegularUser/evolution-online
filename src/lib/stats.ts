/**
 * Локальная статистика и достижения — в localStorage, без сервера.
 * Работает и для соло-партий, и для сетевых: событие партии одно и то же.
 *
 * Партии накапливаются сессионными счётчиками (охоты, еда, защиты…),
 * которые UI собирает из событий последнего действия, а при финале
 *recordGame записывает одну строку истории и проверяет достижения.
 */

import {
  Crosshair,
  Dna,
  Flame,
  Flower2,
  Globe,
  Layers,
  Microscope,
  Mountain,
  Puzzle,
  Shield,
  Sprout,
  Trophy,
  Users,
  Wheat,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Difficulty, GameState, ModuleId, TraitId } from "@/game/types";

const KEY = "evo-stats";
const MAX_GAMES = 50;

/** Счётчики одной партии, собираемые UI из GameEvent. */
export interface SessionCounters {
  /** Атаки, объявленные животными человека. */
  hunts: number;
  /** Убийства добычи хищниками человека. */
  kills: number;
  /** Фишки еды, полученные животными человека. */
  food: number;
  /** Животные человека, погибшие за партию. */
  deaths: number;
  /** Успешные защиты (бег, мимикрия, хвост) животных человека. */
  dodges: number;
  /** Свойства, разыгранные человеком, по типам. */
  traits: Partial<Record<TraitId, number>>;
  /** Максимум свойств на одном животном человека. */
  maxTraits: number;
}

export function emptySession(): SessionCounters {
  return { hunts: 0, kills: 0, food: 0, deaths: 0, dodges: 0, traits: {}, maxTraits: 0 };
}

export interface GameRecord {
  date: number;
  mode: "solo" | "net";
  players: number;
  difficulty: Difficulty;
  modules: ModuleId[];
  /** Место человека (1 — победа над всеми). */
  place: number;
  score: number;
  won: boolean;
  year: number;
  traits: Partial<Record<TraitId, number>>;
}

interface StatsState {
  games: GameRecord[];
  /** id достижения → время разблокировки. */
  achievements: Record<string, number>;
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  check: (ctx: AchievementCtx) => boolean;
}

export interface AchievementCtx {
  game: GameRecord;
  session: SessionCounters;
  totalGames: number;
  totalWins: number;
  /** Победы подряд, включая текущую партию. */
  streak: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-win",
    name: "Первая победа",
    desc: "Победить в партии",
    icon: Trophy,
    check: (c) => c.game.won,
  },
  {
    id: "wins-5",
    name: "Естественный отбор",
    desc: "5 побед за всё время",
    icon: Trophy,
    check: (c) => c.totalWins >= 5,
  },
  {
    id: "streak-3",
    name: "Вид-доминант",
    desc: "3 победы подряд",
    icon: Flame,
    check: (c) => c.streak >= 3,
  },
  {
    id: "apex",
    name: "Апекс-хищник",
    desc: "Объявить 5 и более атак за партию",
    icon: Crosshair,
    check: (c) => c.session.hunts >= 5,
  },
  {
    id: "gourmet",
    name: "Изобилие",
    desc: "Собрать 15 и более фишек еды за партию",
    icon: Wheat,
    check: (c) => c.session.food >= 15,
  },
  {
    id: "clean-pop",
    name: "Чистая популяция",
    desc: "Победа без единой потери животного",
    icon: Shield,
    check: (c) => c.game.won && c.session.deaths === 0,
  },
  {
    id: "hard-win",
    name: "Давление среды",
    desc: "Победа на сложности «Жёстче»",
    icon: Mountain,
    check: (c) => c.game.won && c.game.difficulty === "hard",
  },
  {
    id: "big-table",
    name: "Перенаселение",
    desc: "Партия за столом на 8 игроков",
    icon: Users,
    check: (c) => c.game.players >= 8,
  },
  {
    id: "win-continents",
    name: "Пангея",
    desc: "Победа с дополнением «Континенты»",
    icon: Globe,
    check: (c) => c.game.won && c.game.modules.includes("continents"),
  },
  {
    id: "win-plants",
    name: "Садовник",
    desc: "Победа с дополнением «Растения»",
    icon: Sprout,
    check: (c) => c.game.won && c.game.modules.includes("plants"),
  },
  {
    id: "win-fungi",
    name: "Грибник",
    desc: "Победа с дополнением «Трава и грибы»",
    icon: Flower2,
    check: (c) => c.game.won && c.game.modules.includes("fungi"),
  },
  {
    id: "win-mutations",
    name: "Радиация",
    desc: "Победа с дополнением «Случайные мутации»",
    icon: Dna,
    check: (c) => c.game.won && c.game.modules.includes("randomMutations"),
  },
  {
    id: "all-modules",
    name: "Полная экосистема",
    desc: "Партия со всеми четырьмя дополнениями",
    icon: Layers,
    check: (c) => c.game.modules.length >= 4,
  },
  {
    id: "darwin",
    name: "Дарвинизм",
    desc: "Сыграть 25 партий",
    icon: Microscope,
    check: (c) => c.totalGames >= 25,
  },
  {
    id: "escape",
    name: "Спасение бегством",
    desc: "3 успешные защиты за партию",
    icon: Wind,
    check: (c) => c.session.dodges >= 3,
  },
  {
    id: "five-traits",
    name: "Сложный организм",
    desc: "Животное с пятью свойствами",
    icon: Puzzle,
    check: (c) => c.session.maxTraits >= 5,
  },
];

function loadStats(): StatsState {
  if (typeof window === "undefined") return { games: [], achievements: {} }; // SSR
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StatsState>;
      return { games: parsed.games ?? [], achievements: parsed.achievements ?? {} };
    }
  } catch {
    // битый JSON или приватный режим — начинаем с чистого листа
  }
  return { games: [], achievements: {} };
}

function save(s: StatsState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // не сохраним — статистика просто проживёт до перезагрузки
  }
}

/**
 * Записать завершённую партию и разблокировать достижения.
 * Возвращает список только что открытых (для тостов).
 */
export function recordGame(state: GameState, session: SessionCounters, mode: "solo" | "net"): Achievement[] {
  if (state.phase !== "gameOver") return [];
  const s = loadStats();
  const scores = state.scores ?? [];
  const place = Math.max(1, scores.findIndex((x) => x.playerId === state.humanId) + 1);
  const record: GameRecord = {
    date: Date.now(),
    mode,
    players: state.players.length,
    difficulty: state.difficulty,
    modules: (Object.entries(state.modules) as Array<[ModuleId, boolean | undefined]>).filter(([, v]) => v).map(([k]) => k),
    place,
    score: scores.find((x) => x.playerId === state.humanId)?.total ?? 0,
    won: (state.winnerIds ?? []).includes(state.humanId),
    year: state.year,
    traits: session.traits,
  };
  s.games.push(record);
  if (s.games.length > MAX_GAMES) s.games = s.games.slice(-MAX_GAMES);

  // Серия побед с концов (текущая партия — последняя).
  let streak = 0;
  for (let i = s.games.length - 1; i >= 0; i--) {
    if (s.games[i]!.won) streak++;
    else break;
  }
  const totalWins = s.games.filter((g) => g.won).length;

  const unlocked: Achievement[] = [];
  for (const a of ACHIEVEMENTS) {
    if (s.achievements[a.id]) continue;
    if (a.check({ game: record, session, totalGames: s.games.length, totalWins, streak })) {
      s.achievements[a.id] = Date.now();
      unlocked.push(a);
    }
  }
  save(s);
  return unlocked;
}

/** Итоги для экрана статистики: считаются на месте из истории. */
export function readStats(): StatsState {
  return loadStats();
}
