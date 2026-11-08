/**
 * Бестиарий натуралиста (волна 4б, дизайн-пакет §4.1Д): коллекция карточек
 * именованных животных. Игрок «получает карты» за игру — но карта есть слепок
 * ЕГО собственной партии (кличка + свойства + итог), а не покупная сила.
 * Бестариум не даёт никаких игровых бонусов — только коллекция и статус.
 *
 * Данные собираются на финале партии из GameState (клички ставятся через
 * renameAnimal прямо за столом), хранятся в localStorage evo-bestiarium
 * (v1 device-bound — как вызовы §3.3; v2 переедет в профиль сервера).
 *
 * Животное, погибшее ДО финала, в players[].animals уже не живет — наивный
 * снимок «выживших на финале» терял питомца, за которым игрок привязался
 * (жалоба: «не поселилось моё животное, хоть я ему менял имя»). Поэтому
 * кадры стола наблюдает recordFrame: кличка исчезла из своей территории —
 * снимок уходит в чердак evo-bestiarium-pending и оседает в альбоме при
 * ближайшем заселении (финал любой партии или открытие /bestiary).
 */
import type { GameState, TraitId } from "./types.ts";

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
/** Чердак погибших питомцев: копим до ближайшего заселения, отдельно от альбома. */
const PENDING_KEY = "evo-bestiarium-pending";
const CAP = 200;
const PENDING_CAP = 100;

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
 *  (то же имя + тот же набор свойств + тот же исход уже в альбоме — пропуск).
 *  Заселение попутно сбрасывает чердак: погибшие за последние партии питомцы
 *  оседают в альбоме рядом с выжившими (самолечение без ретроактивных правок). */
export function saveSpecimens(entries: BestiariumEntry[]): BestiariumEntry[] {
  const album = loadBestiarium();
  const add = (e: BestiariumEntry) => {
    const duplicate = album.some(
      (x) => x.name === e.name && x.won === e.won && x.traits.join(",") === e.traits.join(","),
    );
    if (!duplicate) album.unshift(e);
  };
  for (const e of entries) add(e);
  // Погибшие — после выживших этого финала; чердак хранится «свежие впереди»,
  // поэтому в unshift-порядок отдаём от старых к новым: новые окажутся выше.
  for (const e of [...loadPending()].reverse()) add(e);
  const capped = album.slice(0, CAP);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // приватный режим — альбом не сохранится
  }
  clearPending();
  return capped;
}

// ── чердак погибших питомцев (v1 device-bound, как и сам альбом) ─────────────

function loadPending(): BestiariumEntry[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
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

function savePending(entries: BestiariumEntry[]): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(entries.slice(0, PENDING_CAP)));
  } catch {
    // приватный режим — чердак не сохранится
  }
}

function clearPending(): void {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

/**
 * Питомец с кличкой был в кадре prev и исчез в next — снимок в чердак.
 * Исчезновение сверяется по id: смена/сброс клички (renameAnimal) не смерть.
 * Чужие партии не смешиваются: в новой партии idSeq перезапускается с нуля,
 * поэтому откат idSeq/rngState = другой стол — ничего не записываем (ложных
 * смертей нет; пропуск честной смерти при такой коллизии безопаснее фантома).
 */
export function diffDeadSpecimens(
  prev: GameState,
  next: GameState,
  mode: "net" | "tutorial",
): BestiariumEntry[] {
  if (!prev || !next) return [];
  if (prev.humanId !== next.humanId) return [];
  if (next.idSeq < prev.idSeq || next.rngState < prev.rngState) return [];
  const before = prev.players[prev.humanId]?.animals ?? [];
  const after = new Set((next.players[next.humanId]?.animals ?? []).map((a) => a.id));
  const entries: BestiariumEntry[] = [];
  for (const a of before) {
    if (!a.name || !a.name.trim()) continue;
    if (after.has(a.id)) continue;
    entries.push({
      name: a.name.trim().slice(0, 16),
      traits: a.traits.map((t) => t.type),
      year: next.year,
      won: false, // погибшее животное партию не выигрывает
      mode,
      at: Date.now(),
    });
  }
  return entries;
}

/** Записать снимки в чердак (кап — последние PENDING_CAP). */
export function recordDeadSpecimens(entries: BestiariumEntry[]): void {
  if (!entries.length) return;
  savePending([...entries, ...loadPending()].slice(0, PENDING_CAP));
}

/** Сбросить чердак в альбом немедленно (точка перепроверки: открытие /bestiary).
 *  Возвращает текущий альбом — уже с осевшими погибшими. */
export function flushPendingSpecimens(): BestiariumEntry[] {
  const pending = loadPending();
  if (!pending.length) return loadBestiarium();
  return saveSpecimens([]);
}

// ── наблюдение за кадрами стола ──────────────────────────────────────────────

type BestiariumStoreHook = {
  getState(): BestiariumStoreFrame;
  subscribe(listener: (state: BestiariumStoreFrame, prev: BestiariumStoreFrame) => void): () => void;
};

type BestiariumStoreFrame = {
  state: GameState | null;
  /** Зритель смотрит чужой стол — чужие питомцы в его альбом не оседают. */
  net?: { spectating?: boolean; seat?: number };
};

/**
 * Подписка на кадры стора (zustand отдаёт state и prevState). Клиент и так
 * держит модуль загруженным (game-app импортирует collect/saveSpecimens), так
 * что наблюдатель ставится сам на загрузке модуля — новые точки вызова не
 * нужны. Чердак пишется только на смерть клички: раз в кадр, копейки.
 * Финал партии оседает чердак немедленно: точка вызова у финала зовёт
 * saveSpecimens только при выживших кличках, а погибшие обязаны осесть в ту
 * же секунду — без ожидания следующей партии.
 */
function watchStoreFrames(attempt = 0): void {
  if (typeof window === "undefined") return;
  const store = (globalThis as typeof globalThis & { __evoStore?: BestiariumStoreHook }).__evoStore;
  if (!store?.subscribe) {
    // стор собирается после первого импорта модуля — дождаться, но не вечно
    if (attempt < 120) setTimeout(() => watchStoreFrames(attempt + 1), 1000);
    return;
  }
  store.subscribe((frame, prevFrame) => {
    if (frame.state === prevFrame.state) return;
    if (frame.net?.spectating || frame.net?.seat === -2) return;
    if (!prevFrame.state || !frame.state) return;
    try {
      recordDeadSpecimens(diffDeadSpecimens(prevFrame.state, frame.state, "net"));
      if (frame.state.phase === "gameOver" && prevFrame.state.phase !== "gameOver") {
        flushPendingSpecimens();
      }
    } catch {
      // альбом — не критичный путь: не роняем подписку на кадрах
    }
  });
}

watchStoreFrames();
