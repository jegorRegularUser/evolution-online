/**
 * Персональный вид состояния для сетевой партии: то же самое состояние,
 * но без чужой скрытой информации. Возвращаемый тип — GameState, поэтому
 * весь существующий UI и queries работают без изменений; утечка исключена
 * тем, что клиент физически не получает данные.
 */
import type { GameEvent, GameState, TraitId } from "../../game/types.ts";

/** Обезличенный тип для чужих закрытых свойств: UI в режиме «рубашка» его не читает. */
const REDACTED: TraitId = "swimming";

function redactEvents(events: GameEvent[], seat: number, full: GameState): GameEvent[] {
  return events.map((e) => {
    if (e.kind !== "traitPlaced" || !e.hidden) return e;
    const owner = full.players.find((p) => p.animals.some((a) => a.id === e.animalId));
    if (!owner || owner.id === seat) return e;
    return { ...e, type: REDACTED };
  });
}

export function viewFor(full: GameState, seat: number): GameState {
  const v: GameState = structuredClone(full);
  v.humanId = seat;
  v.deckCount = full.deck.length;
  v.deck = [];
  for (const p of v.players) {
    p.handCount = p.hand.length;
    if (p.id === seat) continue;
    p.hand = [];
    for (const a of p.animals) {
      for (const t of a.traits) {
        if (t.hidden) t.type = REDACTED;
      }
    }
  }
  v.lastEvents = redactEvents(v.lastEvents, seat, full);
  return v;
}
