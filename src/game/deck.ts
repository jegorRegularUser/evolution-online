import type { Card, TraitId } from "./types.ts";

const SINGLES: Array<[TraitId, number]> = [
  ["mimicry", 4],
  ["swimming", 8],
  ["poisonous", 4],
  ["running", 4],
  ["piracy", 4],
  ["tailLoss", 4],
  ["scavenger", 4],
  ["symbiosis", 4],
];

const DUALS: Array<[TraitId, TraitId, number]> = [
  ["parasite", "carnivore", 4],
  ["parasite", "fatTissue", 4],
  ["highBodyWeight", "carnivore", 4],
  ["highBodyWeight", "fatTissue", 4],
  ["communication", "carnivore", 4],
  ["cooperation", "carnivore", 4],
  ["cooperation", "fatTissue", 4],
  ["burrowing", "fatTissue", 4],
  ["camouflage", "fatTissue", 4],
  ["sharpVision", "fatTissue", 4],
  ["grazing", "fatTissue", 4],
  ["hibernation", "carnivore", 4],
];

export const DECK_SIZE = SINGLES.reduce((n, [, c]) => n + c, 0) + DUALS.reduce((n, [, , c]) => n + c, 0);

export function buildDeck(nextId: (prefix: string) => string): Card[] {
  const cards: Card[] = [];
  for (const [trait, n] of SINGLES) {
    for (let i = 0; i < n; i++) {
      cards.push({ id: nextId("c"), faces: [trait] });
    }
  }
  for (const [a, b, n] of DUALS) {
    for (let i = 0; i < n; i++) {
      cards.push({ id: nextId("c"), faces: [a, b] });
    }
  }
  return cards;
}
