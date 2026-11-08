/**
 * Бестиарий: заселение кличек. Основа — снимок выживших на финале (волна 4б);
 * находка волны проверок: питомец, погибший ДО финала, с наивного снимка
 * пропадал («не поселилось моё животное, хоть я ему менял имя»). Теперь смерть
 * клички ловится на кадрах стола (diffDeadSpecimens) и оседает в альбоме при
 * ближайшем заселении — финал любой партии или открытие /bestiary.
 */
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
  collectSpecimens,
  diffDeadSpecimens,
  flushPendingSpecimens,
  loadBestiarium,
  recordDeadSpecimens,
  saveSpecimens,
  type BestiariumEntry,
} from "./bestiarium.ts";
import type { GameState, TraitId } from "./types.ts";

// node-окружение без localStorage: изолированный шелл на каждый тест.
const backing = new Map<string, string>();
const shim = {
  getItem: (k: string) => backing.get(k) ?? null,
  setItem: (k: string, v: string) => void backing.set(k, String(v)),
  removeItem: (k: string) => void backing.delete(k),
  clear: () => void backing.clear(),
  key: () => null,
  get length() {
    return backing.size;
  },
};
(globalThis as typeof globalThis & { localStorage: Storage }).localStorage = shim as Storage;

beforeEach(() => {
  backing.clear();
});

/** Минимальный кадр партии: diff читает humanId/year/idSeq/rngState/players. */
function frame(opts: {
  animals?: Array<{ id: string; name?: string; traits?: Array<{ type: TraitId }> }>;
  humanId?: number;
  year?: number;
  idSeq?: number;
  rngState?: number;
  winnerIds?: number[];
}): GameState {
  const { animals = [], humanId = 0, year = 1, idSeq = 10, rngState = 500, winnerIds } = opts;
  return {
    humanId,
    year,
    idSeq,
    rngState,
    phase: "development",
    winnerIds,
    players: [0, 1].map((id) => ({
      id,
      animals: id === humanId ? animals : [],
    })),
  } as unknown as GameState;
}

const beast = (id: string, name: string | undefined, traits: TraitId[] = []) => ({
  id,
  name,
  traits: traits.map((type) => ({ type })),
});

describe("бестиарий: выжившие на финале", () => {
  it("кличка с финала оседает в альбом, безымянные — нет", () => {
    const st = frame({
      animals: [beast("a1", "Пламенный Лис", ["swimming"]), beast("a2", undefined)],
      winnerIds: [0],
    });
    const album = saveSpecimens(collectSpecimens(st, "net"));
    assert.equal(album.length, 1);
    assert.equal(album[0]!.name, "Пламенный Лис");
    assert.deepEqual(album[0]!.traits, ["swimming"]);
    assert.equal(album[0]!.won, true);
  });

  it("проигравшая партия тоже заселяется (won=false)", () => {
    const st = frame({ animals: [beast("a1", "Тихоня")] });
    const album = saveSpecimens(collectSpecimens(st, "net"));
    assert.equal(album.length, 1);
    assert.equal(album[0]!.won, false);
  });
});

describe("бестиарий: погибшие до финала", () => {
  it("кличка исчезла с территории — снимок в чердак, при финале оседает", () => {
    const prev = frame({ animals: [beast("a1", "Пламенный Лис", ["carnivore"]), beast("a2", undefined)], year: 2, idSeq: 30 });
    const next = frame({ animals: [beast("a2", undefined)], year: 2, idSeq: 32 });

    const dead = diffDeadSpecimens(prev, next, "net");
    assert.equal(dead.length, 1);
    assert.equal(dead[0]!.name, "Пламенный Лис");
    assert.deepEqual(dead[0]!.traits, ["carnivore"]);
    assert.equal(dead[0]!.won, false);
    assert.equal(dead[0]!.year, 2);

    recordDeadSpecimens(dead);
    // Финал партии: выживших кличек нет — но погибший обязан осесть.
    const album = saveSpecimens(collectSpecimens(next, "net"));
    assert.equal(album.length, 1);
    assert.equal(album[0]!.name, "Пламенный Лис");
    assert.equal(album[0]!.won, false);
    // Чердак пуст: осевшее не всплывает дважды.
    assert.deepEqual(flushPendingSpecimens().map((e) => e.name), ["Пламенный Лис"]);
  });

  it("питомец брошенной партии оседает на финале СЛЕДУЮЩЕЙ", () => {
    const prev = frame({ animals: [beast("a1", "Забытый")], year: 3, idSeq: 40 });
    const next = frame({ animals: [], year: 3, idSeq: 41 });
    recordDeadSpecimens(diffDeadSpecimens(prev, next, "net"));

    // Новая партия (другой стол, чердак не трогаем) — финал с новой кличкой.
    const fresh = frame({ animals: [beast("a1", "Новенький")], year: 1, idSeq: 5, winnerIds: [0] });
    const album = saveSpecimens(collectSpecimens(fresh, "net"));
    assert.deepEqual(album.map((e) => e.name).sort(), ["Забытый", "Новенький"]);
    assert.equal(album.find((e) => e.name === "Забытый")!.won, false);
    assert.equal(album.find((e) => e.name === "Новенький")!.won, true);
  });

  it("смена или сброс клички — не смерть", () => {
    const prev = frame({ animals: [beast("a1", "Лис")], idSeq: 20 });
    const renamed = frame({ animals: [beast("a1", "Волк")], idSeq: 21 });
    assert.deepEqual(diffDeadSpecimens(prev, renamed, "net"), []);
    const cleared = frame({ animals: [beast("a1", undefined)], idSeq: 22 });
    assert.deepEqual(diffDeadSpecimens(prev, cleared, "net"), []);
  });

  it("новая партия (перезапуск idSeq) не даёт фантомных смертей", () => {
    const prev = frame({ animals: [beast("a3", "Старый")], idSeq: 50, rngState: 900 });
    const freshRoom = frame({ animals: [beast("a1", "Новый")], idSeq: 2, rngState: 100 });
    assert.deepEqual(diffDeadSpecimens(prev, freshRoom, "net"), []);
  });

  it("сетевой вид без rngState (viewFor удаляет сид) дифференцируется", () => {
    const prev = frame({ animals: [beast("a1", "Лис")], idSeq: 20 });
    delete (prev as { rngState?: number }).rngState;
    const next = frame({ animals: [], idSeq: 21 });
    delete (next as { rngState?: number }).rngState;
    const dead = diffDeadSpecimens(prev, next, "net");
    assert.equal(dead.length, 1);
    assert.equal(dead[0]!.name, "Лис");
  });

  it("дубликат карты вида (имя+исход+свойства) не плодится", () => {
    const first = saveSpecimens([{ name: "Лис", traits: ["swimming"], year: 1, won: false, mode: "net", at: 1 }]);
    recordDeadSpecimens([{ name: "Лис", traits: ["swimming"], year: 2, won: false, mode: "net", at: 2 }]);
    const second = flushPendingSpecimens();
    assert.equal(second.length, first.length);
    assert.equal(second[0]!.at, 1); // старая карта осталась, дубль не затёр её
  });

  it("чердак ограничен PENDING_CAP (кадр за кадром)", () => {
    for (let i = 0; i < 150; i++) {
      recordDeadSpecimens([{ name: `Питомец ${i}`, traits: [], year: 1, won: false, mode: "net", at: i }]);
    }
    const album = flushPendingSpecimens();
    assert.equal(album.length, 100); // последние 100 записей, не 150
    assert.equal(album[0]!.name, "Питомец 149"); // свежие — ближе к началу
    assert.equal(album[99]!.name, "Питомец 50");
  });

  it("открытие /bestiary оседает чердак без финала партии", () => {
    recordDeadSpecimens([{ name: "Сирота", traits: [], year: 2, won: false, mode: "net", at: 3 }]);
    const album = flushPendingSpecimens();
    assert.equal(album.length, 1);
    assert.equal(album[0]!.name, "Сирота");
  });
});
