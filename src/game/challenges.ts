/**
 * Каталог «Вызовов» (волна 3а, дизайн-пакет §4.1В): сеть целей с тирами,
 * награда — «Ископаемые» (единственная earned-валюта, §3.2). Предикаты
 * чистые и общие для клиента (экран прогресса) и сервера (оценка отчёта) —
 * как trait-реестр: данные, не код в двух копиях.
 *
 * Два вида целей:
 *  - cumulative — счётчик растёт от партия к партии (метрики GameRunStats);
 *  - feat — «подвиг за партию»: одномоментное условие финального состояния.
 * Сервер верифицирует форму отчёта и лимиты; верификация самих метрик
 * опирается на сервер-авторитарный GameState (stats в jsonb комнаты).
 * Мультипликатор «комнаты со всеми-ИИ = 0» — сознательное упрощение v1:
 * отчёт шлёт человек за свою партию; кап в день ограничивает фарма (§3.2).
 */
import type { TKey } from "../lib/i18n";
import type { GameRunStats } from "./types.ts";

/** Счётчики прогресса вызовов — накопленное across games (сервер, БД). */
export interface ChallengeCounters {
  preyEaten: number;
  defended: number;
  fatStored: number;
  traitsPlaced: number;
  animalsPlaced: number;
  scavenges: number;
  wildYearsSurvived: number;
  wins: number;
  games: number;
  winsContinents: number;
  winsPlants: number;
  winsFungi: number;
  winsMutations: number;
}

export const ZERO_COUNTERS: ChallengeCounters = {
  preyEaten: 0,
  defended: 0,
  fatStored: 0,
  traitsPlaced: 0,
  animalsPlaced: 0,
  scavenges: 0,
  wildYearsSurvived: 0,
  wins: 0,
  games: 0,
  winsContinents: 0,
  winsPlants: 0,
  winsFungi: 0,
  winsMutations: 0,
};

export interface ChallengeTier {
  n: number;
  coins: number;
}

export interface Challenge {
  id: string;
  titleKey: TKey;
  /** cumulative: ключ метрики прироста в отчёте партии (GameRunStats). */
  counterKey?: keyof ChallengeCounters;
  /** feat: подвиг за партию — предикат финальных метрик. */
  feat?: (s: GameRunStats) => boolean;
  tiers: ChallengeTier[];
}

/** «1 партия / 2 партии / 5 партий» — числа на клиенте форматирует экран. */
const c = (n: number, coins: number): ChallengeTier => ({ n, coins });

function cumulative(
  id: string,
  titleKey: TKey,
  counterKey: keyof ChallengeCounters,
  tiers: ChallengeTier[],
): Challenge {
  return { id, titleKey, counterKey, tiers };
}

/** Подвиг «выиграл с хищником с 3+ свойствами» — из критики дизайна. */
function feat(
  id: string,
  titleKey: TKey,
  predicate: (s: GameRunStats) => boolean,
  tiers: ChallengeTier[],
): Challenge {
  return { id, titleKey, feat: predicate, tiers };
}

export const CHALLENGES: Challenge[] = [
  cumulative("preyEaten", "challenge.preyEaten", "preyEaten", [c(1, 50), c(10, 150), c(50, 500)]),
  cumulative("defended", "challenge.defended", "defended", [c(1, 50), c(10, 150), c(30, 400)]),
  cumulative("fatStored", "challenge.fatStored", "fatStored", [c(5, 50), c(25, 150), c(100, 500)]),
  cumulative("traitsPlaced", "challenge.traitsPlaced", "traitsPlaced", [c(10, 50), c(50, 150), c(200, 500)]),
  cumulative("animalsPlaced", "challenge.animalsPlaced", "animalsPlaced", [c(10, 50), c(50, 150), c(150, 400)]),
  cumulative("scavenges", "challenge.scavenges", "scavenges", [c(1, 50), c(5, 150), c(20, 400)]),
  cumulative("wildYears", "challenge.wildYears", "wildYearsSurvived", [c(1, 50), c(3, 150), c(10, 400)]),
  cumulative("wins", "challenge.wins", "wins", [c(1, 100), c(5, 250), c(25, 800)]),
  cumulative("games", "challenge.games", "games", [c(3, 50), c(10, 150), c(50, 500)]),
  cumulative("winsContinents", "challenge.winsContinents", "winsContinents", [c(1, 100), c(5, 300)]),
  cumulative("winsPlants", "challenge.winsPlants", "winsPlants", [c(1, 100), c(5, 300)]),
  cumulative("winsFungi", "challenge.winsFungi", "winsFungi", [c(1, 100), c(5, 300)]),
  cumulative("winsMutations", "challenge.winsMutations", "winsMutations", [c(1, 100), c(5, 300)]),
  feat("bigCarnivoreWin", "challenge.bigCarnivoreWin", (s) => s.wins > 0 && s.bigCarnivoreWin === true, [c(1, 300)]),
  feat("survivorWin", "challenge.survivorWin", (s) => s.wins > 0 && s.animalsLost === 0, [c(1, 300)]),
  feat("richFaunaWin", "challenge.richFaunaWin", (s) => s.wins > 0 && s.maxTraitsOnAnimal >= 4, [c(1, 250)]),
];

/** Карта соответствия старых достижений (stats.ts) тирам вызовов: миграция
 *  16 ачивок задним числом (дизайн-пакет §4.1В — «не оставлять два
 *  непересекающихся прогресса»). */
export const LEGACY_ACHIEVEMENT_MAP: Record<string, Array<{ id: string; tier: number }>> = {
  "first-win": [{ id: "wins", tier: 0 }],
  "wins-5": [{ id: "wins", tier: 1 }],
  "win-hard": [{ id: "wins", tier: 1 }],
  "big-table": [{ id: "games", tier: 1 }],
  "win-continents": [{ id: "winsContinents", tier: 0 }],
  "win-plants": [{ id: "winsPlants", tier: 0 }],
  "win-fungi": [{ id: "winsFungi", tier: 0 }],
  "win-mutations": [{ id: "winsMutations", tier: 0 }],
  "all-modules": [
    { id: "winsContinents", tier: 0 },
    { id: "winsPlants", tier: 0 },
    { id: "winsFungi", tier: 0 },
    { id: "winsMutations", tier: 0 },
  ],
  "five-traits": [{ id: "bigCarnivoreWin", tier: 0 }],
  "apex": [{ id: "preyEaten", tier: 0 }],
  "gourmet": [{ id: "fatStored", tier: 0 }],
  "streak-3": [{ id: "games", tier: 0 }],
};

export function challengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((ch) => ch.id === id);
}
