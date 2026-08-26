import type { GameState } from "./types.ts";

/**
 * ГПСЧ живёт внутри GameState (rngState), а не во внешнем объекте:
 * любое применение действия мутирует счётчик на клоне состояния, поэтому
 * партия по сиду воспроизводима, а кубики можно показывать пошагово.
 */
export function nextRandom(state: GameState): number {
  state.rngState = (state.rngState + 0x6d2b79f5) | 0;
  let t = state.rngState;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function dieFor(state: GameState): number {
  return 1 + Math.floor(nextRandom(state) * 6);
}

export function shuffled<T>(state: GameState, arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom(state) * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}
