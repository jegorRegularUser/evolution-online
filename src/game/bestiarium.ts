/**
 * Бестиарий натуралиста (волна 4б, дизайн-пакет §4.1Д): коллекция карточек
 * именованных животных. Игрок «получает карты» за игру — но карта есть слепок
 * ЕГО собственной партии (кличка + свойства + итог), а не покупная сила.
 * Бестариум не даёт никаких игровых бонусов — только коллекция и статус.
 *
 * Данные собираются на финале партии из GameState (клички ставятся через
 * renameAnimal прямо за столом), хранятся в localStorage evo-bestiarium
 * (v1 device-bound — как вызовы §3.3; v2 переедет в профиль сервера).
 */
import type { TraitId } from "./types.ts";

export interface BestiariumEntry {
  /** Кличка животного (renameAnimal) — сердце записи. */
  name: string;
  /** Свойства на момент финала партии. */
  traits: TraitId[];
  /** Год партии (сколько пережил экосистемный цикл). */
  year: number;
  /** Партия выиграна. */
  won: boolean;
  /** Режим: сетевая партия или учебная/кампания. */
  mode: "net" | "tutorial";
  /** Момент записи (timestamp). */
  at: number;
}

const STORAGE_KEY = "evo-bestiarium";
const CAP = 200;

/** Снимок именованных животных игрока на финале. Пустые клички не собираем:
 *  бестиарий — про привязанность, а не про поголовье. */
export function collectSpecimens(
  state: {
    humanId: number;
    year: number;
    winnerIds?: number[];
    players: Array<{ id: number; animals: Array<{ name?: string; traits: Array<{ type: TraitId }> }> }>;
  },
  mode: "net" | "tutorial",
): BestiariumEntry[] {
  const human = state.players[state.humanId];
  if (!human) return [];
  const won = Boolean(state.winnerIds?.includes(state.humanId));
  const entries: BestiariumEntry[] = [];
  for (const a of human.animals) {
    if (!a.name || !a.name.trim()) continue;
    entries.push({
      name: a.name.trim().slice(0, 16),
      traits: a.traits.map((t) => t.type),
      year: state.year,
      won,
      mode,
      at: Date.now(),
    });
  }
  return entries;
}

export function loadBestiarium(): BestiariumEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is BestiariumEntry =>
        typeof v === "object" && v !== null && typeof (v as BestiariumEntry).name === "string",
    );
  } catch {
    return [];
  }
}

/** Добавляет снимок партии; дубликаты одной и той же карты вида не плодим
 *  (то же имя + тот же набор свойств + тот же исход уже в альбоме — пропуск). */
export function saveSpecimens(entries: BestiariumEntry[]): BestiariumEntry[] {
  const album = loadBestiarium();
  for (const e of entries) {
    const duplicate = album.some(
      (x) => x.name === e.name && x.won === e.won && x.traits.join(",") === e.traits.join(","),
    );
    if (!duplicate) album.unshift(e);
  }
  const capped = album.slice(0, CAP);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // приватный режим — альбом не сохранится
  }
  return capped;
}
