/**
 * Персональный вид состояния для сетевой партии: то же самое состояние,
 * но без чужой скрытой информации. Возвращаемый тип — GameState, поэтому
 * весь существующий UI и queries работают без изменений; утечка исключена
 * тем, что клиент физически не получает данные.
 */
import type { GameEvent, GameState, TraitId } from "../../game/types.ts";

/** Обезличенный тип для чужих закрытых свойств: UI в режиме «рубашка» его не читает. */
const REDACTED: TraitId = "swimming";

/**
 * Обезличить скрытые размещения свойств в чужом событии. Если владелец
 * животного не найден (оно уже погибло), событие тоже обезличивается —
 * безопаснее показать «рубашку», чем раскрыть тип.
 */
export function redactEvents(events: GameEvent[], seat: number, full: GameState): GameEvent[] {
  return events.map((e) => {
    if (e.kind !== "traitPlaced" || !e.hidden) return e;
    const owner = full.players.find((p) => p.animals.some((a) => a.id === e.animalId));
    if (owner && owner.id === seat) return e;
    return { ...e, type: REDACTED };
  });
}

export function viewFor(full: GameState, seat: number): GameState {
  const v: GameState = structuredClone(full);
  // ГПСЧ нужен движку на сервере, но seed/state позволяют клиенту восстановить
  // будущую случайную последовательность и чужую руку. В wire-виде их нет.
  delete (v as Partial<GameState>).rngSeed;
  delete (v as Partial<GameState>).rngState;
  v.humanId = seat;
  v.deckCount = full.deck.length;
  // Растения и флора публичны; прячем только содержимое колод.
  v.plantDeckCount = full.plantDeck?.length;
  v.plantDeck = [];
  v.floraDeckCount = full.floraDeck?.length;
  v.floraDeck = [];
  v.deck = [];
  for (const p of v.players) {
    p.handCount = p.hand.length;
    p.blindDeckCount = p.blindDeck?.length;
    // «Случайные мутации»: личная колода слепа даже для владельца.
    p.blindDeck = [];
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
