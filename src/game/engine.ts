import { buildDeck } from "./deck.ts";
import { dieFor, nextRandom, shuffled } from "./rng.ts";
import { TRAITS } from "./traits.ts";
import type { TraitDef } from "./traits.ts";
import type {
  Animal,
  Card,
  Difficulty,
  GameAction,
  GameEvent,
  GameState,
  LogEntry,
  PendingAttack,
  Player,
  ScoreBreakdown,
  TraitId,
  TraitInstance,
} from "./types.ts";
import {
  allAnimals,
  animalValue,
  canAttack,
  canReceiveFood,
  emptyFatSlots,
  findAnimal,
  foodNeeded,
  hasTrait,
  isActive,
  isFed,
  mustFind,
  nextPlayerId,
  player,
} from "./queries.ts";

const AI_NAMES = ["Дарвин", "Уоллес", "Мендель"];

function log(state: GameState, text: string, tone: LogEntry["tone"] = "neutral") {
  state.log.push({ id: state.log.length + 1, text, tone });
  if (state.log.length > 80) state.log.splice(0, state.log.length - 80);
}

function ev(state: GameState, event: GameEvent) {
  state.lastEvents.push(event);
}

/** Id всех сущностей выдаёт состояние — снапшоты не конфликтуют между партиями. */
function nid(state: GameState, prefix: string): string {
  state.idSeq += 1;
  return `${prefix}${state.idSeq}`;
}

export function createGame(
  playerCount: number,
  difficulty: Difficulty,
  seed = Date.now() % 1_000_000,
  /** Сетевая партия: имена и флаги ботов берутся из мест комнаты. */
  seats?: Array<{ name: string; isAI: boolean }>,
): GameState {
  const names = ["Вы", ...AI_NAMES].slice(0, playerCount);
  const base =
    seats && seats.length === playerCount
      ? seats.map((seat, id) => ({ id, name: seat.name, isAI: seat.isAI }))
      : names.map((name, id) => ({ id, name, isAI: id !== 0 }));
  const state: GameState = {
    players: base.map((p) => ({
      ...p,
      hand: [],
      animals: [],
      discardCount: 0,
      passedDev: false,
      passedFeed: false,
    })),
    deck: [],
    foodBank: 0,
    foodRoll: null,
    currentPlayerId: 0,
    firstPlayerId: 0,
    phase: "development",
    year: 1,
    lastYear: false,
    deckEmptyAfterDraw: false,
    log: [],
    pendingAttack: null,
    playSeq: 0,
    humanId: 0,
    difficulty,
    rngSeed: seed,
    rngState: seed >>> 0,
    idSeq: 0,
    eventSeq: 0,
    lastEvents: [],
    devStartPlaySeq: 0,
    extinctionDeaths: [],
    modules: {},
  };
  state.deck = shuffled(state, buildDeck((prefix) => nid(state, prefix)));
  for (let i = 0; i < 6; i++) {
    for (const p of state.players) {
      const c = state.deck.pop();
      if (c) p.hand.push(c);
    }
  }
  const first = Math.floor(nextRandom(state) * playerCount);
  state.currentPlayerId = first;
  state.firstPlayerId = first;
  log(state, `Год 1. Первым ходит ${state.players[first]!.name}.`, "good");
  return state;
}

function clone<T>(s: T): T {
  return structuredClone(s);
}

/**
 * Защита от бесконечной рекурсии парных свойств внутри одного действия
 * (сотрудничество → еда → сотрудничество…). Очищается в начале applyAction;
 * движок однопоточный, поэтому общий Set безопасен.
 */
const firedPairs = new Set<string>();

function beginActionEffects() {
  firedPairs.clear();
}

function ownerOf(state: GameState, animalId: string): Player {
  const p = state.players.find((x) => x.animals.some((a) => a.id === animalId));
  if (!p) throw new Error("owner");
  return p;
}

function takeCard(p: Player, cardId: string): Card {
  const i = p.hand.findIndex((c) => c.id === cardId);
  if (i < 0) throw new Error("card not in hand");
  return p.hand.splice(i, 1)[0]!;
}

function faceOf(card: Card, face: number): TraitId {
  const t = card.faces[face] ?? card.faces[0];
  if (!t) throw new Error("empty card");
  return t;
}

/**
 * Свойство выкладывается лицом вверх (по правилам все видят, что кладут),
 * hidden остаётся в типе как шов под «Случайные мутации».
 */
function makeTrait(
  state: GameState,
  card: Card,
  type: TraitId,
  extra?: Partial<TraitInstance>,
): TraitInstance {
  state.playSeq += 1;
  return {
    id: nid(state, "t"),
    cardId: card.id,
    type,
    hidden: false,
    playSeq: state.playSeq,
    ...extra,
  };
}

function discardAnimal(state: GameState, animal: Animal) {
  const p = ownerOf(state, animal.id);
  p.discardCount += 1 + animal.traits.length;
  for (const t of animal.traits) {
    if (t.pairWith) {
      const other = findAnimal(state, t.pairWith);
      if (other) {
        other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
      }
    }
  }
  p.animals = p.animals.filter((a) => a.id !== animal.id);
}

export function legalDevActions(state: GameState, playerId: number): GameAction[] {
  if (state.phase !== "development") return [];
  if (state.currentPlayerId !== playerId) return [];
  const p = player(state, playerId);
  if (p.passedDev) return [];
  const actions: GameAction[] = [{ type: "devPass" }];
  for (const card of p.hand) {
    actions.push({ type: "devPlayAnimal", cardId: card.id });
    for (let face = 0; face < card.faces.length; face++) {
      const trait = faceOf(card, face);
      const def = TRAITS[trait];
      if (def.opponentOnly) {
        for (const o of state.players) {
          if (o.id === p.id) continue;
          for (const a of o.animals) {
            if (canAttachTrait(a, trait, true)) {
              actions.push({ type: "devPlayTrait", cardId: card.id, face, animalId: a.id });
            }
          }
        }
      } else if (def.isPair) {
        const mine = p.animals;
        for (let i = 0; i < mine.length; i++) {
          for (let j = 0; j < mine.length; j++) {
            if (i === j) continue;
            if (canAttachPair(mine[i]!, mine[j]!, trait)) {
              actions.push({
                type: "devPlayPair",
                cardId: card.id,
                face,
                a: mine[i]!.id,
                b: mine[j]!.id,
              });
            }
          }
        }
      } else {
        for (const a of p.animals) {
          if (canAttachTrait(a, trait, true)) {
            actions.push({ type: "devPlayTrait", cardId: card.id, face, animalId: a.id });
          }
        }
      }
    }
  }
  return actions;
}

function canAttachTrait(animal: Animal, trait: TraitId, includeHidden: boolean): boolean {
  const def = TRAITS[trait];
  if (trait === "parasite" && animal.traits.some((t) => t.type === "parasite")) return false;
  if (trait === "carnivore" && hasTrait(animal, "scavenger", includeHidden)) return false;
  if (trait === "scavenger" && hasTrait(animal, "carnivore", includeHidden)) return false;
  if (!def.stackable && hasTrait(animal, trait, includeHidden)) return false;
  return true;
}

function canAttachPair(a: Animal, b: Animal, trait: TraitId): boolean {
  if (a.id === b.id) return false;
  const already = a.traits.some(
    (t) => t.type === trait && t.pairWith === b.id,
  );
  return !already;
}

/** Реальное действие в фазу питания: игрок снова участвует в круге. */
function spendTurn(state: GameState, playerId: number) {
  player(state, playerId).passedFeed = false;
}

function giveFood(
  state: GameState,
  animal: Animal,
  amount: number,
  kind: "red" | "blue",
  opts?: { triggerCoop?: boolean; triggerComm?: boolean },
) {
  if (amount <= 0) return;
  if (!canReceiveFood(state, animal) && !(isFed(animal) && emptyFatSlots(animal) > 0)) {
    return;
  }
  let left = amount;
  while (left > 0) {
    if (animal.hibernating) break;
    if (isFed(animal)) {
      if (emptyFatSlots(animal) > 0) {
        animal.fatTokens += 1;
        ev(state, { kind: "foodToFat", animalId: animal.id });
        left -= 1;
      } else break;
    } else {
      animal.food += 1;
      left -= 1;
    }
  }
  const got = amount - left;
  if (got <= 0) return;
  animal.receivedFoodThisYear = true;
  if (opts?.triggerComm && kind === "red") {
    triggerPartnerEffects(state, animal, "communication");
  }
  if (opts?.triggerCoop !== false) {
    triggerPartnerEffects(state, animal, "cooperation");
  }
}

/**
 * Парные эффекты из реестра: свойство с onPartnerFed передаёт еду напарнику.
 * Ключ защиты от рекурсии — тип эффекта плюс id карты.
 */
function triggerPartnerEffects(state: GameState, source: Animal, hook: NonNullable<TraitDef["onPartnerFed"]>) {
  for (const t of source.traits) {
    if (!isActive(t) || t.type !== hookAsTrait(hook) || !t.pairWith) continue;
    if (TRAITS[t.type].onPartnerFed !== hook) continue;
    const key = `${hook}:${t.cardId}`;
    if (firedPairs.has(key)) continue;
    const other = findAnimal(state, t.pairWith);
    if (!other || other.hibernating) continue;
    if (hook === "communication") {
      if (state.foodBank <= 0) continue;
      if (!canReceiveFood(state, other)) continue;
      firedPairs.add(key);
      state.foodBank -= 1;
      giveFood(state, other, 1, "red", { triggerCoop: true, triggerComm: false });
      ev(state, { kind: "foodFromBank", animalId: other.id, playerId: ownerOf(state, other.id).id, via: "communication" });
      const op = ownerOf(state, other.id);
      log(state, `Взаимодействие: ${op.name} берёт еду из базы. База: ${state.foodBank}.`);
    } else {
      if (!canReceiveFood(state, other) && emptyFatSlots(other) === 0) continue;
      firedPairs.add(key);
      giveFood(state, other, 1, "blue", { triggerCoop: false, triggerComm: false });
      ev(state, { kind: "blueFood", animalId: other.id, reason: "cooperation" });
      const op = ownerOf(state, other.id);
      log(state, `Сотрудничество: ${op.name} получает 1 синюю фишку.`);
    }
  }
}

function hookAsTrait(hook: NonNullable<TraitDef["onPartnerFed"]>): TraitId {
  return hook === "communication" ? "communication" : "cooperation";
}

function triggerScavenger(state: GameState, hunterOwnerId: number) {
  const n = state.players.length;
  for (let k = 0; k < n; k++) {
    const p = state.players[(hunterOwnerId + k) % n]!;
    for (const a of p.animals) {
      const hasScav = a.traits.some((t) => t.type === "scavenger" && isActive(t));
      if (!hasScav) continue;
      if (a.hibernating) continue;
      if (isFed(a) && emptyFatSlots(a) === 0) continue;
      if (!canReceiveFood(state, a) && !isFed(a)) continue;
      giveFood(state, a, 1, "blue");
      ev(state, { kind: "blueFood", animalId: a.id, reason: "scavenger" });
      log(state, `Падальщик ${p.name} получает 1 синюю фишку.`, "good");
      return;
    }
  }
}

/**
 * Фаза питания по правилам: за ход — ровно одно действие (взять фишку,
 * напасть, пиратство, спячка, топтун). Превращение жира — свободное
 * действие, ход не тратит. Пас доступен всегда.
 */
export function legalFeedActions(state: GameState, playerId: number): GameAction[] {
  if (state.phase !== "feeding") return [];
  if (state.pendingAttack) return [];
  if (state.currentPlayerId !== playerId) return [];
  const p = player(state, playerId);
  const actions: GameAction[] = [];

  for (const a of p.animals) {
    if (state.foodBank > 0 && canReceiveFood(state, a)) {
      actions.push({ type: "feedTake", animalId: a.id });
    }
    if (hasTrait(a, "carnivore") && !a.hibernating) {
      if (!(isFed(a) && emptyFatSlots(a) === 0)) {
        for (const prey of allAnimals(state)) {
          if (canAttack(state, a, prey)) {
            actions.push({ type: "feedHunt", carnivoreId: a.id, preyId: prey.id });
          }
        }
      }
    }
    if (hasTrait(a, "piracy") && !isFed(a) && !a.hibernating) {
      for (const t of allAnimals(state)) {
        if (t.id === a.id) continue;
        if (!t.receivedFoodThisYear) continue;
        if (isFed(t)) continue;
        if (t.food <= 0) continue;
        actions.push({ type: "feedPirate", pirateId: a.id, targetId: t.id });
      }
    }
    if (
      hasTrait(a, "hibernation") &&
      !a.hibernatedLastYear &&
      !state.lastYear &&
      !a.hibernating &&
      !isFed(a)
    ) {
      actions.push({ type: "feedHibernate", animalId: a.id });
    }
    if (a.fatTokens > 0 && !a.hibernating && !isFed(a)) {
      const need = Math.max(1, foodNeeded(a) - a.food);
      actions.push({ type: "feedConvertFat", animalId: a.id, amount: Math.min(a.fatTokens, need) });
    }
    if (state.foodBank > 0 && hasTrait(a, "grazing")) {
      actions.push({ type: "feedGraze", animalId: a.id });
    }
  }
  actions.push({ type: "feedSkip" });
  return actions;
}

function defenseOptions(animal: Animal, attack: PendingAttack): Array<"running" | "mimicry" | "tailLoss"> {
  const opts: Array<"running" | "mimicry" | "tailLoss"> = [];
  for (const t of animal.traits) {
    if (!isActive(t)) continue;
    const kind = TRAITS[t.type].defense;
    if (!kind || attack.usedDefenses.includes(kind)) continue;
    if (kind === "mimicry" && attack.mimicryChain.includes(animal.id)) continue;
    if (!opts.includes(kind)) opts.push(kind);
  }
  return opts;
}

function mimicryTargets(state: GameState, attack: PendingAttack, prey: Animal): Animal[] {
  const owner = ownerOf(state, prey.id);
  const carnivore = mustFind(state, attack.carnivoreId);
  return owner.animals.filter((a) => {
    if (a.id === prey.id) return false;
    if (attack.mimicryChain.includes(a.id)) return false;
    return canAttack(state, carnivore, a);
  });
}

export function legalDefenseActions(state: GameState, playerId: number): GameAction[] {
  const atk = state.pendingAttack;
  if (!atk || atk.waitingFor !== playerId) return [];
  const prey = findAnimal(state, atk.preyId);
  if (!prey) return [{ type: "chooseDefense", kind: "none" }];
  const actions: GameAction[] = [{ type: "chooseDefense", kind: "none" }];
  const opts = defenseOptions(prey, atk);
  if (opts.includes("running")) actions.push({ type: "chooseDefense", kind: "running" });
  if (opts.includes("mimicry")) {
    for (const t of mimicryTargets(state, atk, prey)) {
      actions.push({ type: "chooseDefense", kind: "mimicry", mimicryTargetId: t.id });
    }
  }
  if (opts.includes("tailLoss")) {
    for (const tr of prey.traits.filter((t) => !t.hidden)) {
      actions.push({ type: "chooseDefense", kind: "tailLoss", discardTraitId: tr.id });
    }
  }
  return actions;
}

function finishHuntSuccess(state: GameState, carnivore: Animal, prey: Animal, foodGain: number) {
  const hunter = ownerOf(state, carnivore.id);
  const victim = ownerOf(state, prey.id);
  const poisoned = prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller) && foodGain === 2;
  ev(state, { kind: "preyKilled", preyId: prey.id, carnivoreId: carnivore.id });
  log(
    state,
    `${hunter.name} охотится: ${victim.name} теряет животное (${animalValue(prey)} очк.).`,
    "hunt",
  );
  if (poisoned) {
    carnivore.poisoned = true;
    log(state, `Хищник ${hunter.name} отравлен и погибнет в вымирание.`, "bad");
  }
  discardAnimal(state, prey);
  giveFood(state, carnivore, foodGain, "blue");
  ev(state, { kind: "blueFood", animalId: carnivore.id, reason: "hunt" });
  if (foodGain === 2) {
    for (const def of Object.values(TRAITS)) {
      if (def.onAnyKill === "scavenger") {
        triggerScavenger(state, hunter.id);
        break;
      }
    }
  }
  state.pendingAttack = null;
}

function resolveNoDefense(state: GameState) {
  const atk = state.pendingAttack;
  if (!atk) return;
  const carnivore = findAnimal(state, atk.carnivoreId);
  const prey = findAnimal(state, atk.preyId);
  if (!carnivore || !prey) {
    state.pendingAttack = null;
    return;
  }
  finishHuntSuccess(state, carnivore, prey, 2);
}

export function applyAction(state: GameState, action: GameAction): GameState {
  const next = clone(state);
  beginActionEffects();
  next.eventSeq += 1;
  next.lastEvents = [];
  switch (action.type) {
    case "devPlayAnimal":
      playAnimal(next, action.cardId);
      break;
    case "devPlayTrait":
      playTrait(next, action.cardId, action.face, action.animalId);
      break;
    case "devPlayPair":
      playPair(next, action.cardId, action.face, action.a, action.b);
      break;
    case "devPass":
      passDev(next);
      break;
    case "rollFoodBank":
      startFoodRoll(next);
      break;
    case "beginFeeding":
      beginFeeding(next);
      break;
    case "continueExtinction":
      continueAfterExtinction(next);
      break;
    case "feedTake":
      feedTake(next, action.animalId);
      break;
    case "feedHunt":
      feedHunt(next, action.carnivoreId, action.preyId);
      break;
    case "feedPirate":
      feedPirate(next, action.pirateId, action.targetId);
      break;
    case "feedHibernate":
      feedHibernate(next, action.animalId);
      break;
    case "feedConvertFat":
      feedConvertFat(next, action.animalId, action.amount);
      break;
    case "feedGraze":
      feedGraze(next, action.animalId);
      break;
    case "feedSkip":
      skipFeed(next);
      break;
    case "chooseDefense":
      applyDefense(next, action);
      break;
    default:
      throw new Error(`unknown action ${(action as GameAction).type}`);
  }
  return next;
}

function playAnimal(state: GameState, cardId: string) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  const animal: Animal = {
    id: nid(state, "a"),
    ownerId: p.id,
    cardId: card.id,
    traits: [],
    food: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: card.id.length * 17 + p.id * 13 + p.animals.length,
  };
  p.animals.push(animal);
  ev(state, { kind: "animalPlaced", animalId: animal.id, ownerId: p.id });
  log(state, `${p.name} выкладывает новое животное.`);
  advanceDev(state);
}

function playTrait(state: GameState, cardId: string, face: number, animalId: string) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  const trait = faceOf(card, face);
  const animal = mustFind(state, animalId);
  animal.traits.push(makeTrait(state, card, trait));
  ev(state, { kind: "traitPlaced", animalId, type: trait, hidden: false });
  const targetOwner = ownerOf(state, animalId);
  if (trait === "parasite") {
    log(state, `${p.name}: ${TRAITS[trait].name} → животное ${targetOwner.name}.`, "bad");
  } else {
    log(state, `${p.name}: свойство ${TRAITS[trait].name}.`);
  }
  advanceDev(state);
}

function playPair(state: GameState, cardId: string, face: number, aId: string, bId: string) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  const trait = faceOf(card, face);
  const a = mustFind(state, aId);
  const b = mustFind(state, bId);
  a.traits.push(makeTrait(state, card, trait, { pairWith: b.id, pairRole: "a" }));
  b.traits.push(
    makeTrait(state, card, trait, { pairWith: a.id, pairRole: "b", playSeq: state.playSeq }),
  );
  ev(state, { kind: "traitPlaced", animalId: aId, type: trait, hidden: false });
  // Название скрытой карты не называем вслух: в сетевой партии лог публичен.
  log(state, `${p.name} связывает двух животных.`);
  advanceDev(state);
}

function passDev(state: GameState) {
  const p = player(state, state.currentPlayerId);
  p.passedDev = true;
  log(state, `${p.name} пасует.`);
  advanceDev(state);
}

function advanceDev(state: GameState) {
  if (state.players.every((p) => p.passedDev || p.hand.length === 0)) {
    for (const p of state.players) {
      if (p.hand.length === 0) p.passedDev = true;
    }
  }
  if (state.players.every((p) => p.passedDev)) {
    revealAndStartFood(state);
    return;
  }
  let id = nextPlayerId(state);
  for (let i = 0; i < state.players.length; i++) {
    if (!player(state, id).passedDev) {
      state.currentPlayerId = id;
      return;
    }
    id = nextPlayerId(state, id);
  }
  revealAndStartFood(state);
}

function revealAndStartFood(state: GameState) {
  // Свойства выкладывались открыто; здесь только страховочная нормализация
  // порядка и дублей (шов под будущие модули).
  for (const a of allAnimals(state)) {
    a.traits.sort((x, y) => x.playSeq - y.playSeq);
    const seen = new Set<string>();
    const keep: TraitInstance[] = [];
    for (const t of a.traits) {
      const key =
        t.type === "fatTissue"
          ? t.id
          : t.pairWith
            ? `${t.type}:${t.pairWith}`
            : t.type;
      if (t.type === "carnivore" && a.traits.some((x) => x.type === "scavenger" && x.playSeq < t.playSeq)) {
        continue;
      }
      if (t.type === "scavenger" && a.traits.some((x) => x.type === "carnivore" && x.playSeq < t.playSeq)) {
        continue;
      }
      if (t.type !== "fatTissue" && seen.has(key)) continue;
      seen.add(key);
      t.hidden = false;
      keep.push(t);
    }
    a.traits = keep;
  }
  ev(state, { kind: "traitsRevealed" });
  log(state, "Определение кормовой базы.", "good");
  state.phase = "foodBank";
  state.foodRoll = null;
  state.foodBank = 0;
}

/** Действие rollFoodBank: бросаем кубики и запоминаем их — сумма ложится в банк после анимации. */
function startFoodRoll(state: GameState) {
  if (state.phase !== "foodBank" || state.foodRoll) return;
  const n = state.players.length;
  const dice = n === 2 ? [dieFor(state)] : [dieFor(state), dieFor(state)];
  let food = dice.reduce((s, d) => s + d, 0);
  if (n === 2) food += 2;
  else if (n >= 4) food += 2;
  state.foodRoll = dice;
  state.foodBank = food;
  ev(state, { kind: "diceRoll", dice, total: food });
  log(state, `Кубики кормовой базы: ${dice.join(" + ")}${n !== 3 ? " (+2)" : ""} = ${food}.`, "good");
}

/** Действие beginFeeding: вызывается после показа кубиков, стартует питание по кругу. */
function beginFeeding(state: GameState) {
  if (state.phase !== "foodBank" || !state.foodRoll) return;
  state.phase = "feeding";
  state.currentPlayerId = state.firstPlayerId;
  for (const p of state.players) p.passedFeed = false;
  log(state, `Кормовая база: ${state.foodBank}.`, "good");
  feedTurn(state, state.firstPlayerId);
}

/**
 * Круг питания: ход переходит к следующему игроку, который не пасовал
 * и имеет реальное действие. Фаза заканчивается, только когда все
 * пасанули либо никому ничего не доступно (правило конца фазы).
 */
function feedTurn(state: GameState, startId: number) {
  let id = startId;
  for (let i = 0; i < state.players.length; i++) {
    const p = player(state, id);
    // Оцениваем действия каждого кандидата от его имени: legalFeedActions
    // отвечает только текущему игроку, поэтому подменяем его в копии.
    const acts = legalFeedActions({ ...state, currentPlayerId: id }, id);
    const real = acts.filter((a) => a.type !== "feedSkip");
    if (!p.passedFeed && real.length > 0) {
      state.currentPlayerId = id;
      return;
    }
    id = nextPlayerId(state, id);
  }
  endFeeding(state);
}

function advanceFeed(state: GameState) {
  if (state.pendingAttack) return;
  feedTurn(state, nextPlayerId(state));
}

function feedTake(state: GameState, animalId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  if (state.foodBank <= 0) {
    advanceFeed(state);
    return;
  }
  const a = mustFind(state, animalId);
  state.foodBank -= 1;
  giveFood(state, a, 1, "red", { triggerComm: true, triggerCoop: true });
  ev(state, { kind: "foodFromBank", animalId: a.id, playerId: p.id, via: "take" });
  log(state, `${p.name} берёт еду из базы (${state.foodBank} осталось).`);
  advanceFeed(state);
}

function feedHunt(state: GameState, carnivoreId: string, preyId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const carnivore = mustFind(state, carnivoreId);
  const prey = mustFind(state, preyId);
  if (!canAttack(state, carnivore, prey)) {
    advanceFeed(state);
    return;
  }
  ev(state, { kind: "huntDeclared", carnivoreId, preyId });
  const atk: PendingAttack = {
    carnivoreId,
    preyId,
    mimicryChain: [],
    waitingFor: prey.ownerId,
    usedDefenses: [],
  };
  state.pendingAttack = atk;
  const opts = defenseOptions(prey, atk);
  if (opts.length === 0) {
    resolveNoDefense(state);
    advanceFeed(state);
    return;
  }
  log(state, `${p.name} атакует животное игрока ${ownerOf(state, prey.id).name}!`, "hunt");
}

function feedPirate(state: GameState, pirateId: string, targetId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const pirate = mustFind(state, pirateId);
  const target = mustFind(state, targetId);
  if (target.food <= 0 || isFed(target)) {
    advanceFeed(state);
    return;
  }
  target.food -= 1;
  giveFood(state, pirate, 1, "blue");
  ev(state, { kind: "blueFood", animalId: pirate.id, reason: "piracy" });
  log(
    state,
    `${p.name} пиратствует у ${ownerOf(state, target.id).name}.`,
    "hunt",
  );
  advanceFeed(state);
}

function feedHibernate(state: GameState, animalId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  a.hibernating = true;
  log(state, `${p.name} использует спячку.`, "good");
  advanceFeed(state);
}

/** Превращение жира в еду — свободное действие: ход не тратится. */
function feedConvertFat(state: GameState, animalId: string, amount: number) {
  const p = player(state, state.currentPlayerId);
  const a = mustFind(state, animalId);
  const n = Math.min(amount, a.fatTokens);
  a.fatTokens -= n;
  a.food += n;
  ev(state, { kind: "blueFood", animalId: a.id, reason: "fat" });
  log(state, `${p.name} тратит жировой запас (${n}). Ход продолжается.`);
}

/** Топтун — отдельное действие хода: уничтожает 1 фишку из базы. */
function feedGraze(state: GameState, animalId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  if (!hasTrait(a, "grazing") || state.foodBank <= 0) {
    advanceFeed(state);
    return;
  }
  state.foodBank -= 1;
  ev(state, { kind: "bankBurned", amount: 1 });
  log(state, `${p.name}: топтун уничтожает 1 еду. База: ${state.foodBank}.`);
  advanceFeed(state);
}

/** Пас: игрок пропускается, пока не сделает реальное действие (или до конца фазы). */
function skipFeed(state: GameState) {
  const p = player(state, state.currentPlayerId);
  p.passedFeed = true;
  log(state, `${p.name} пасует.`);
  advanceFeed(state);
}

function applyDefense(
  state: GameState,
  action: Extract<GameAction, { type: "chooseDefense" }>,
) {
  const atk = state.pendingAttack;
  if (!atk) return;
  const carnivore = findAnimal(state, atk.carnivoreId);
  const prey = findAnimal(state, atk.preyId);
  if (!carnivore || !prey) {
    state.pendingAttack = null;
    advanceFeed(state);
    return;
  }
  if (action.kind === "running") {
    atk.usedDefenses.push("running");
    const roll = dieFor(state);
    ev(state, { kind: "defenseUsed", defense: "running", roll, preyId: atk.preyId });
    if (roll >= 4) {
          log(state, `Быстрое: выпало ${roll} — животное спаслось!`, "good");
      state.pendingAttack = null;
      advanceFeed(state);
      return;
    }
    log(state, `Быстрое: выпало ${roll} — хищник догнал.`, "bad");
    if (defenseOptions(prey, atk).length === 0) {
      resolveNoDefense(state);
      advanceFeed(state);
    }
    return;
  }
  if (action.kind === "mimicry" && action.mimicryTargetId) {
    atk.usedDefenses.push("mimicry");
    atk.mimicryChain.push(prey.id);
    atk.preyId = action.mimicryTargetId;
    atk.waitingFor = mustFind(state, action.mimicryTargetId).ownerId;
    atk.usedDefenses = [];
    ev(state, { kind: "defenseUsed", defense: "mimicry", preyId: atk.preyId });
    log(state, "Мимикрия перенаправляет атаку.");
    const nextPrey = mustFind(state, atk.preyId);
    if (defenseOptions(nextPrey, atk).length === 0) {
      resolveNoDefense(state);
      advanceFeed(state);
    }
    return;
  }
  if (action.kind === "tailLoss" && action.discardTraitId) {
    const trait = prey.traits.find((t) => t.id === action.discardTraitId);
    if (trait) {
      if (trait.pairWith) {
        const other = findAnimal(state, trait.pairWith);
        if (other) other.traits = other.traits.filter((x) => x.cardId !== trait.cardId);
      }
      prey.traits = prey.traits.filter((t) => t.cardId !== trait.cardId);
      ownerOf(state, prey.id).discardCount += 1;
    }
      giveFood(state, carnivore, 1, "blue");
    ev(state, { kind: "blueFood", animalId: carnivore.id, reason: "tailLoss" });
    ev(state, { kind: "defenseUsed", defense: "tailLoss", preyId: atk.preyId });
    log(state, "Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.", "good");
    state.pendingAttack = null;
    advanceFeed(state);
    return;
  }
  ev(state, { kind: "defenseUsed", defense: "none", preyId: atk.preyId });
  resolveNoDefense(state);
  advanceFeed(state);
}

/**
 * Питание закончено: остаток базы сгорает, вычисляется список погибших.
 * Животные удаляются позже — действием continueExtinction, чтобы игроки
 * увидели стадию вымирания, а не мгновенный переход.
 */
function endFeeding(state: GameState) {
  if (state.foodBank > 0) {
    ev(state, { kind: "bankBurned", amount: state.foodBank });
    log(state, `Остаток кормовой базы (${state.foodBank}) сгорает.`);
    state.foodBank = 0;
  }
  state.phase = "extinction";
  state.extinctionDeaths = [];
  for (const a of allAnimals(state)) {
    if (a.poisoned || !isFed(a)) state.extinctionDeaths.push(a.id);
  }
  for (const id of state.extinctionDeaths) {
    const a = findAnimal(state, id);
    if (!a) continue;
    const p = ownerOf(state, id);
    log(
      state,
      a.poisoned
        ? `Хищник ${p.name} погибает от яда.`
        : `Животное ${p.name} вымирает — не накормлено.`,
      "bad",
    );
  }
}

/** Действие continueExtinction: убирает погибших, сбрасывает годовые флаги, добирает карты. */
function continueAfterExtinction(state: GameState) {
  if (state.phase !== "extinction") return;
  for (const id of state.extinctionDeaths) {
    const a = findAnimal(state, id);
    if (!a) continue;
    ev(state, { kind: "animalDied", animalId: id, cause: a.poisoned ? "poison" : "starved" });
    discardAnimal(state, a);
  }
  state.extinctionDeaths = [];
  for (const a of allAnimals(state)) {
    a.food = 0;
    a.hibernatedLastYear = a.hibernating;
    a.hibernating = false;
    a.receivedFoodThisYear = false;
    a.poisoned = false;
  }
  if (state.lastYear || (state.deck.length === 0 && state.deckEmptyAfterDraw)) {
    finishGame(state);
    return;
  }
  drawCards(state);
}

function drawCards(state: GameState) {
  const start = state.firstPlayerId;
  const n = state.players.length;
  let emptied = state.deck.length === 0;
  const counts = new Array<number>(n).fill(0);
  for (let k = 0; k < n; k++) {
    const idx = (start + k) % n;
    const p = state.players[idx]!;
    let want = p.animals.length + 1;
    if (p.animals.length === 0 && p.hand.length === 0) want = 6;
    for (let i = 0; i < want; i++) {
      const c = state.deck.pop();
      if (!c) {
        emptied = true;
        break;
      }
      p.hand.push(c);
      counts[idx]! += 1;
    }
  }
  ev(state, { kind: "cardsDrawn", counts });
  if (emptied || state.deck.length === 0) {
    state.deckEmptyAfterDraw = true;
    state.lastYear = true;
  }
  for (const p of state.players) p.passedDev = false;
  state.firstPlayerId = nextPlayerId(state, state.firstPlayerId);
  state.currentPlayerId = state.firstPlayerId;
  state.year += 1;
  state.phase = "development";
  state.devStartPlaySeq = state.playSeq;
  log(
    state,
    state.lastYear
      ? `Год ${state.year} — последний. Первым ходит ${player(state, state.firstPlayerId).name}.`
      : `Год ${state.year}. Первым ходит ${player(state, state.firstPlayerId).name}. Колода: ${state.deck.length}.`,
    state.lastYear ? "bad" : "good",
  );
}

function finishGame(state: GameState) {
  const scores: ScoreBreakdown[] = state.players.map((p) => {
    let animals = 0;
    let traits = 0;
    let extras = 0;
    for (const a of p.animals) {
      animals += 2;
      for (const t of a.traits) {
        if (t.disabled) continue;
        traits += 1;
        extras += TRAITS[t.type].scoreBonus;
      }
    }
    return {
      playerId: p.id,
      name: p.name,
      animals,
      traits,
      extras,
      total: animals + traits + extras,
      discard: p.discardCount,
    };
  });
  scores.sort((a, b) => b.total - a.total || b.discard - a.discard);
  const best = scores[0]!;
  const winners = scores.filter((s) => s.total === best.total && s.discard === best.discard);
  state.scores = scores;
  state.winnerIds = winners.map((w) => w.playerId);
  state.phase = "gameOver";
  log(
    state,
    winners.length > 1
      ? `Ничья: ${winners.map((w) => w.name).join(", ")}.`
      : `Победа: ${winners[0]!.name} (${winners[0]!.total} очков).`,
    "good",
  );
}

export function currentActor(state: GameState): Player | null {
  if (state.phase === "gameOver") return null;
  if (state.pendingAttack) return player(state, state.pendingAttack.waitingFor);
  if (state.phase === "foodBank" || state.phase === "extinction") return null;
  return player(state, state.currentPlayerId);
}
