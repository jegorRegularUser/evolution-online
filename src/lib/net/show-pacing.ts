/**
 * Паузы на модальные показы клиента (spotlight.tsx) — чистый расчёт по
 * событиям шага. Переехало из src/lib/net/server.ts (фундамент кампании):
 * локальный хост матча кампании держит те же паузы, что серверная комната,
 * а считать их нужно и на клиенте — модуль без серверных зависимостей.
 *
 * Значения — зеркало buildItems в spotlight.tsx: меняются там — правятся
 * и здесь.
 */
import type { GameEvent, GameState } from "../../game/types.ts";

const SPOTLIGHT_MS: Partial<Record<GameEvent["kind"], number>> = {
  diceRoll: 2900,
  preyKilled: 3000,
  plantAttack: 2500,
  paralyzed: 2300,
  // ── «Дикий мир» (зеркало карточек spotlight.tsx) ──
  wildEventPlanned: 2400,
  wildEventStarted: 2400,
  wildMeteorite: 2800,
};
/** Защита добычи: бросок «Быстрого» — самый длинный показ с вердиктом. */
const SPOTLIGHT_DEFENSE_MS: Record<"running" | "mimicry" | "tailLoss" | "none", number> = {
  running: 3400,
  tailLoss: 2800,
  mimicry: 2400,
  none: 0,
};
/** Сводка «Вымирание» — одна карточка на всех погибших в шаге. */
const SPOTLIGHT_EXTINCTION_MS = 2700;
/** Хвост паузы: анимация закрытия карточки. */
const SPOTLIGHT_TAIL_MS = 900;

/** Сколько клиент будет показывать модальные карточки событий этого шага (мс). */
export function spotlightMsOf(events: GameEvent[]): number {
  let ms = 0;
  let deaths = 0;
  for (const e of events) {
    if (e.kind === "defenseUsed") ms += SPOTLIGHT_DEFENSE_MS[e.defense];
    else if (e.kind === "animalDied") deaths += 1;
    else ms += SPOTLIGHT_MS[e.kind] ?? 0;
  }
  if (deaths) ms += SPOTLIGHT_EXTINCTION_MS;
  return ms;
}

/**
 * Пауза после шага, завершившего фазу: покрывает показ карточек его событий.
 * Пустые переходы (без модальных событий) не растягиваем — паузы нет вовсе.
 */
export function phaseGapMs(before: GameState, after: GameState): number {
  if (before.phase === after.phase) return 0;
  const show = spotlightMsOf(after.lastEvents);
  return show > 0 ? show + SPOTLIGHT_TAIL_MS : 0;
}

export const SHOW_TAIL_MS = SPOTLIGHT_TAIL_MS;
