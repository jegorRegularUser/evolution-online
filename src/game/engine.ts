import { buildDeck } from "./deck.ts";
import { dieFor, nextRandom, shuffled } from "./rng.ts";
import { TRAITS } from "./traits.ts";
import type { TraitDef } from "./traits.ts";
import type {
  Animal,
  Card,
  Difficulty,
  FeedTurnUse,
  GameAction,
  GameEvent,
  GameState,
  LogEntry,
  ModuleId,
  PendingAttack,
  Player,
  ScoreBreakdown,
  TerritoryId,
  TraitId,
  TraitInstance,
} from "./types.ts";
import {
  allAnimals,
  animalValue,
  canAttack,
  canHuntWith,
  canMigrate,
  canReceiveFood,
  emptyFatSlots,
  findAnimal,
  foodNeeded,
  hasTrait,
  isActive,
  isFed,
  isParalyzed,
  mustFind,
  nextPlayerId,
  player,
} from "./queries.ts";

const AI_NAMES = ["Дарвин", "Уоллес", "Мендель", "Линней", "Кювье", "Ламарк", "Геккель"];

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
  /** Включённые дополнения (пока только «Континенты»). */
  modules?: Partial<Record<ModuleId, boolean>>,
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
    modules: modules ?? {},
    paralyzed: modules?.continents ? [] : undefined,
    turnUse: freshTurnUse(),
  };
  state.deck = shuffled(state, buildDeck((prefix) => nid(state, prefix), state.modules));
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
  const cont = state.modules.continents;
  const actions: GameAction[] = [{ type: "devPass" }];
  for (const card of p.hand) {
    // Животное кладётся на выбранный континент; в океан напрямую — нельзя.
    if (cont) {
      actions.push({ type: "devPlayAnimal", cardId: card.id, zoneId: "laurasia" });
      actions.push({ type: "devPlayAnimal", cardId: card.id, zoneId: "gondwana" });
    } else {
      actions.push({ type: "devPlayAnimal", cardId: card.id });
    }
    for (let face = 0; face < card.faces.length; face++) {
      const trait = faceOf(card, face);
      const def = TRAITS[trait];
      if (def.opponentOnly || def.anyTarget) {
        // opponentOnly — только чужие; anyTarget (неоплазия) — любые животные.
        for (const o of state.players) {
          if (def.opponentOnly && o.id === p.id) continue;
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
          if (!canAttachTrait(a, trait, true)) continue;
          // Парные свойства живут только внутри одной территории.
          if (cont && trait !== "neoplasia" && !sameTerritoryPairOk(state, a, trait)) continue;
          actions.push({ type: "devPlayTrait", cardId: card.id, face, animalId: a.id });
        }
      }
    }
  }
  return actions;
}

/**
 * «Континенты»: непарное свойство можно класть на любое своё животное —
 * зоны запрещают только парные карты между разными территориями. Для
 * одиночного животного ограничений нет, проверка нужна парной карте.
 */
function sameTerritoryPairOk(_state: GameState, _a: Animal, _trait: TraitId): boolean {
  return true;
}

function canAttachTrait(animal: Animal, trait: TraitId, includeHidden: boolean): boolean {
  const def = TRAITS[trait];
  if (trait === "parasite" && animal.traits.some((t) => t.type === "parasite")) return false;
  if (trait === "carnivore" && hasTrait(animal, "scavenger", includeHidden)) return false;
  if (trait === "scavenger" && hasTrait(animal, "carnivore", includeHidden)) return false;
  if (!def.stackable && hasTrait(animal, trait, includeHidden)) return false;
  // «Регенерация»: только на животное без свойств или с одним свойством без +еды;
  // свойства, повышающие потребность, на животное с регенерацией не кладутся.
  if (trait === "regeneration") {
    if (animal.traits.length > 1) return false;
    if (animal.traits.some((t) => TRAITS[t.type].extraFood > 0)) return false;
    if (hasTrait(animal, "regeneration", includeHidden)) return false;
  }
  if (hasTrait(animal, "regeneration", includeHidden) && animal.traits.length >= 2) return false;
  if (hasTrait(animal, "regeneration", includeHidden) && def.extraFood > 0) return false;
  // На животное с неоплазией нельзя играть два одинаковых свойства,
  // даже если первое уже «выключено» — проверяется общим !stackable выше.
  return true;
}

function canAttachPair(a: Animal, b: Animal, _trait: TraitId): boolean {
  if (a.id === b.id) return false;
  // «Континенты»: парная карта — только внутри одной территории.
  if (a.zoneId !== b.zoneId) return false;
  // Между двумя животными может лежать только ОДНА парная карта (любая).
  const linked = a.traits.some((t) => t.pairWith === b.id) || b.traits.some((t) => t.pairWith === a.id);
  return !linked;
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
      if (kind === "blue") animal.blueFood += 1;
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
 * Фаза питания. Ход длится, пока игрок сам его не закончит: за один ход можно
 * напасть каждым хищником и/или использовать каждого пирата — либо взять одну
 * фишку из базы (еда и боевые действия несовместимы). Превращение жира —
 * свободное действие. Накормленное животное свойства не использует вовсе:
 * единственное, что ему остаётся, — доложить фишку в пустой жировой запас.
 */
export function legalFeedActions(state: GameState, playerId: number): GameAction[] {
  if (state.phase !== "feeding") return [];
  if (state.pendingAttack) return [];
  if (state.currentPlayerId !== playerId) return [];
  const p = player(state, playerId);
  const actions: GameAction[] = [];

  const used = state.turnUse;
  const cont = state.modules.continents;
  // Территория хода: если ход ещё не привязан — доступны все с фишками.
  const turnTerritory = state.turnTerritory;

  for (const a of p.animals) {
    if (cont && used.migrated) break; // ход миграции — ничего кроме переезда
    const zone = a.zoneId ?? "laurasia";
    const territoryUnlocked = !cont || turnTerritory === undefined || turnTerritory === zone;
    const bankOk = cont ? (state.territoryFood?.[zone] ?? 0) > 0 : state.foodBank > 0;
    // Еда берётся только из базы своей территории; выбор территории фиксируется первым взятием.
    if (bankOk && territoryUnlocked && !used.foodTaken && !used.combatUsed && canReceiveFood(state, a)) {
      actions.push({ type: "feedTake", animalId: a.id });
    }
    // Сытый хищник не охотится — даже ради жирового запаса; парализованный тоже.
    if (canHuntWith(state, a) && !used.carnivores.includes(a.id) && !used.foodTaken) {
      for (const prey of allAnimals(state)) {
        if (canAttack(state, a, prey)) {
          actions.push({ type: "feedHunt", carnivoreId: a.id, preyId: prey.id });
        }
      }
    }
    if (hasTrait(a, "piracy") && !isFed(a) && !a.hibernating && !used.pirates.includes(a.id) && !used.foodTaken && !isParalyzed(state, a.id)) {
      for (const t of allAnimals(state)) {
        // Любое не накормленное полностью животное с фишками, даже своё,
        // в той же территории («Континенты»).
        if (t.id === a.id) continue;
        if (cont && t.zoneId !== a.zoneId) continue;
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
    // Топтун совместим со взятием еды; топчет банк своей территории, раз за ход.
    if (!cont && state.foodBank > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !isFed(a)) {
      actions.push({ type: "feedGraze", animalId: a.id });
    }
    if (cont && (state.territoryFood?.[zone] ?? 0) > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !isFed(a)) {
      if (turnTerritory === undefined || turnTerritory === zone) {
        actions.push({ type: "feedGraze", animalId: a.id });
      }
    }
    // Миграция: отдельный ход — только переезд и прилипалы.
    if (cont && canMigrate(state, a) && !used.migrated) {
      const targets = migrationTargets(state, a);
      for (const to of targets) {
        actions.push({ type: "feedMigrate", moves: [{ animalId: a.id, to }] });
      }
    }
  }
  actions.push({ type: "feedEndTurn" });
  actions.push({ type: "feedSkip" });
  return actions;
}

/**
 * Куда может уйти мигрирующее животное по правилам «Континентов»:
 * океан ↔ континенты; континент → континент минуя океан — нельзя.
 */
function migrationTargets(state: GameState, a: Animal): TerritoryId[] {
  const from = a.zoneId ?? "laurasia";
  // Водность в океане перманентна; на континенте — по карте свойства.
  const swim = from === "ocean" || hasTrait(a, "swimming");
  const out: TerritoryId[] = [];
  if (from === "ocean") {
    // Из океана — на любой континент (свойство «водоплавающее» сохраняется).
    out.push("laurasia", "gondwana");
  } else if (swim) {
    // Водоплавающее с континента — только в океан (мимо океана нельзя).
    out.push("ocean");
  }
  return out.filter((z) => z !== from);
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
    // Сбросить можно только саму карту хвоста, не другое свойство.
    const tail = prey.traits.find((t) => isActive(t) && t.type === "tailLoss");
    if (tail) actions.push({ type: "chooseDefense", kind: "tailLoss", discardTraitId: tail.id });
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
  // Стрекательные клетки: атакующий теряет все свойства до конца фазы питания.
  if (prey.traits.some((t) => isActive(t) && TRAITS[t.type].paralyzesAttacker)) {
    state.paralyzed = state.paralyzed ?? [];
    if (!state.paralyzed.includes(carnivore.id)) state.paralyzed.push(carnivore.id);
    // В океане парализованный хищник теряет и водоплавающее — вытеснен на континент.
    if (state.modules.continents && carnivore.zoneId === "ocean") {
      oceanExpel(state, carnivore);
      log(state, `Хищник парализован в океане — выброшен на континент.`, "bad");
    } else {
      log(state, `Хищник ${hunter.name} парализован стрекательными клетками.`, "bad");
    }
    ev(state, { kind: "paralyzed", carnivoreId: carnivore.id });
  }
  // Регенерация: свойства съеденного остаются на столе — восстановятся картой из руки.
  // Работает независимо от того, было животное накормлено или нет.
  if (hasTrait(prey, "regeneration")) {
    state.pendingRegeneration = [...(state.pendingRegeneration ?? []), regenSnapshotOf(prey, victim.id)];
    log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "good");
    // Животное снимается, но карты свойств НЕ идут в сброс: жгут только карту-туловище.
    const p0 = ownerOf(state, prey.id);
    p0.animals = p0.animals.filter((a) => a.id !== prey.id);
    p0.discardCount += 1;
  } else {
    discardAnimal(state, prey);
  }
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
  maybeEndTurn(state);
}

/** Снимок свойств для регенерации: карта + типы. */
interface RegenPending {
  ownerId: number;
  cardIds: string[];
}

function regenSnapshotOf(a: Animal, ownerId: number): RegenPending {
  return { ownerId, cardIds: a.traits.map((t) => t.cardId) };
}

/**
 * Вытеснение из океана: животное теряет «водоплавающее»-зависимость размещения
 * (само свойство остаётся при параличе) и уходит на ближайший континент.
 */
function oceanExpel(state: GameState, a: Animal) {
  a.zoneId = nextRandom(state) < 0.5 ? "laurasia" : "gondwana";
  void state;
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
      playAnimal(next, action.cardId, action.zoneId);
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
    case "feedEndTurn":
      feedEndTurn(next);
      break;
    case "feedSkip":
      skipFeed(next);
      break;
    case "feedMigrate":
      feedMigrate(next, action.moves);
      break;
    case "reorderAnimal":
      if (action.toZoneId) moveAnimalToZoneHuman(next, action.animalId, action.toZoneId);
      else reorderAnimal(next, action.animalId, action.beforeId);
      break;
    case "chooseDefense":
      applyDefense(next, action);
      break;
    default:
      throw new Error(`unknown action ${(action as GameAction).type}`);
  }
  return next;
}

function playAnimal(state: GameState, cardId: string, zoneId?: TerritoryId) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  // «Континенты»: животное кладётся на выбранный континент (океан — только
  // через водоплавающее свойство).
  const zone: TerritoryId =
    state.modules.continents ? (zoneId === "ocean" ? "laurasia" : (zoneId ?? "laurasia")) : (zoneId ?? "laurasia");
  const animal: Animal = {
    id: nid(state, "a"),
    ownerId: p.id,
    cardId: card.id,
    traits: [],
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: card.id.length * 17 + p.id * 13 + p.animals.length,
    ...(state.modules.continents ? { zoneId: zone } : {}),
  };
  p.animals.push(animal);
  ev(state, { kind: "animalPlaced", animalId: animal.id, ownerId: p.id, zoneId: animal.zoneId });
  log(
    state,
    state.modules.continents
      ? `${p.name} выкладывает новое животное (${zone === "laurasia" ? "Лавразия" : "Гондвана"}).`
      : `${p.name} выкладывает новое животное.`,
  );
  advanceDev(state);
}

function playTrait(state: GameState, cardId: string, face: number, animalId: string) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  const trait = faceOf(card, face);
  const animal = mustFind(state, animalId);
  // Неоплазия кладётся ПОД свойства: в самый низ стека.
  if (trait === "neoplasia") {
    animal.traits.unshift(makeTrait(state, card, trait));
    animal.neoplasia = animal.traits[0];
  } else {
    animal.traits.push(makeTrait(state, card, trait));
  }
  ev(state, { kind: "traitPlaced", animalId, type: trait, hidden: false });
  const targetOwner = ownerOf(state, animalId);
  if (trait === "parasite") {
    log(state, `${p.name}: ${TRAITS[trait].name} → животное ${targetOwner.name}.`, "bad");
  } else {
    log(state, `${p.name}: свойство ${TRAITS[trait].name}.`);
  }
  settleAfterTraitChange(state, animal);
  advanceDev(state);
}

function playPair(state: GameState, cardId: string, face: number, aId: string, bId: string) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  const trait = faceOf(card, face);
  const a = mustFind(state, aId);
  const b = mustFind(state, bId);
  // «Континенты»: парное свойство — только внутри одной территории.
  if (state.modules.continents && a.zoneId !== b.zoneId) {
    throw new Error("pair across territories");
  }
  a.traits.push(makeTrait(state, card, trait, { pairWith: b.id, pairRole: "a" }));
  b.traits.push(
    makeTrait(state, card, trait, { pairWith: a.id, pairRole: "b", playSeq: state.playSeq }),
  );
  ev(state, { kind: "traitPlaced", animalId: aId, type: trait, hidden: false });
  // Карта пары «лежит между» животными: ставим второе сразу за первым.
  const ai = p.animals.findIndex((x) => x.id === aId);
  const bi = p.animals.findIndex((x) => x.id === bId);
  if (ai >= 0 && bi >= 0 && bi !== ai + 1) {
    const [bAnimal] = p.animals.splice(bi, 1);
    p.animals.splice(bi < ai ? ai : ai + 1, 0, bAnimal);
  }
  log(state, `${p.name} связывает двух животных: ${TRAITS[trait].name}.`);
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
    // Неоплазия всегда в самом низу стека (кладётся «под» свойства).
    if (a.neoplasia && a.traits[0] !== a.neoplasia) {
      a.traits = [a.neoplasia, ...a.traits.filter((t) => t.id !== a.neoplasia!.id)];
    }
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
  if (state.modules.continents) {
    // Неоплазия поднимается в начале определения кормовой базы (правило).
    advanceNeoplasia(state);
    // Официальная таблица: у каждой территории своя кормовая база.
    // Кубики бросаются для атмосферы аудита: значения нужны для UI, еда — из таблицы.
    const dice = [dieFor(state), dieFor(state)];
    const bases = territoryBases(n);
    // Эдификаторы добавляют по 2 фишки в свою территорию.
    for (const a of allAnimals(state)) {
      if (a.hibernating) continue;
      if (!a.traits.some((t) => t.type === "edificator" && isActive(t))) continue;
      const z = (a.zoneId ?? "laurasia") as TerritoryId;
      bases[z] += 2;
      ev(state, { kind: "edificator", territory: z, amount: 2 });
    }
    state.foodRoll = dice;
    state.territoryFood = bases;
    state.foodBank = bases.laurasia + bases.gondwana + bases.ocean;
    ev(state, { kind: "diceRoll", dice, total: state.foodBank });
    log(
      state,
      `Кормовые базы — Лавразия ${bases.laurasia}, Гондвана ${bases.gondwana}, Океан ${bases.ocean}.`,
      "good",
    );
    return;
  }
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
  if (state.modules.continents) {
    log(
      state,
      `Кормовые базы: Лавразия ${state.territoryFood?.laurasia ?? 0}, Гондвана ${state.territoryFood?.gondwana ?? 0}, Океан ${state.territoryFood?.ocean ?? 0}.`,
      "good",
    );
  } else {
    log(state, `Кормовая база: ${state.foodBank}.`, "good");
  }
  state.turnTerritory = undefined;
  feedTurn(state, state.firstPlayerId);
}

function freshTurnUse(): FeedTurnUse {
  return { carnivores: [], pirates: [], grazers: [], foodTaken: false, combatUsed: false, migrated: false };
}

/** Кормовые базы «Континентов» по официальной таблице (игроки → Лавразия/Гондвана/Океан). */
export function territoryBases(playerCount: number): Record<TerritoryId, number> {
  if (playerCount <= 2) return { laurasia: 8, gondwana: 7, ocean: 5 };
  if (playerCount === 3) return { laurasia: 11, gondwana: 10, ocean: 7 };
  if (playerCount === 4) return { laurasia: 14, gondwana: 13, ocean: 9 };
  // Свыше четырёх (нестандартная партия) — растём по +2/+2/+1 на игрока.
  const extra = playerCount - 4;
  return { laurasia: 14 + 2 * extra, gondwana: 13 + 2 * extra, ocean: 9 + extra };
}

/**
 * Размещение животного с учётом зон: получило «водоплавающее» — уходит в океан.
 * Обратной высадки нет: в океане водность перманентна (см. queries.isAquatic),
 * поэтому потеря карты свойства животное оттуда не выгоняет — только миграция
 * или паралич стрекательными клетками.
 */
function settleAfterTraitChange(state: GameState, a: Animal) {
  if (!state.modules.continents) {
    return;
  }
  if (!a.zoneId) a.zoneId = "laurasia";
  const before = a.zoneId;
  if (hasTrait(a, "swimming") && a.zoneId !== "ocean") {
    moveAnimalToZone(state, a, "ocean");
  }
  // Переезд мог разорвать пары с животными других территорий — сбрасываем карты пар.
  if (a.zoneId !== before) dropCrossTerritoryPairs(state);
}

function moveAnimalToZone(_state: GameState, a: Animal, zone: TerritoryId) {
  a.zoneId = zone;
}

/**
 * Есть ли у игрока хоть одно реальное действие, если ход начать с чистого
 * листа. Проверка идёт от его имени и с пустым turnUse: legalFeedActions
 * отвечает только текущему игроку, а ограничения вида «еду уже брали»
 * относятся к чужому ходу и здесь не должны мешать.
 */
function hasFreshAction(state: GameState, playerId: number): boolean {
  const probe: GameState = {
    ...state,
    currentPlayerId: playerId,
    turnUse: freshTurnUse(),
    // Территория принадлежит ходу, а не игроку: probe «начинает ход заново».
    turnTerritory: undefined,
  };
  return legalFeedActions(probe, playerId).some(
    (a) => a.type !== "feedSkip" && a.type !== "feedEndTurn",
  );
}

/** Съедобная еда территории хода; вне «Континентов» — общий банк. */
function bankOf(state: GameState, zone?: TerritoryId): number {
  if (!state.modules.continents || !zone) return state.foodBank;
  return state.territoryFood?.[zone] ?? 0;
}

function takeFromBank(state: GameState, zone: TerritoryId | undefined, n = 1) {
  if (state.modules.continents && zone) {
    const cur = state.territoryFood?.[zone] ?? 0;
    state.territoryFood = { ...state.territoryFood, [zone]: Math.max(0, cur - n) };
    state.foodBank = Math.max(0, state.foodBank - n);
    return;
  }
  state.foodBank = Math.max(0, state.foodBank - n);
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
    if (!p.passedFeed && hasFreshAction(state, id)) {
      state.currentPlayerId = id;
      state.turnUse = freshTurnUse();
      state.turnTerritory = undefined;
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
  const a = mustFind(state, animalId);
  const zone = a.zoneId;
  const bank = bankOf(state, zone);
  if (bank <= 0 || state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated) return;
  // «Континенты»: первое действие хода фиксирует территорию — дальше только она.
  if (state.modules.continents && state.turnTerritory && state.turnTerritory !== zone) return;
  takeFromBank(state, zone, 1);
  state.turnUse.foodTaken = true;
  state.turnTerritory = state.modules.continents ? (zone ?? "laurasia") : undefined;
  giveFood(state, a, 1, "red", { triggerComm: true, triggerCoop: true });
  ev(state, { kind: "foodFromBank", animalId: a.id, playerId: p.id, via: "take" });
  log(state, `${p.name} берёт еду из базы (${bankOf(state, zone)} осталось).`);
  maybeEndTurn(state);
}

function feedHunt(state: GameState, carnivoreId: string, preyId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const carnivore = mustFind(state, carnivoreId);
  const prey = mustFind(state, preyId);
  if (state.turnUse.foodTaken || state.turnUse.carnivores.includes(carnivoreId)) return;
  if (!canAttack(state, carnivore, prey)) return;
  state.turnUse.carnivores.push(carnivoreId);
  state.turnUse.combatUsed = true;
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
    return;
  }
  log(state, `${p.name} атакует животное игрока ${ownerOf(state, prey.id).name}!`, "hunt");
}

function feedPirate(state: GameState, pirateId: string, targetId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const pirate = mustFind(state, pirateId);
  const target = mustFind(state, targetId);
  if (state.turnUse.foodTaken || state.turnUse.pirates.includes(pirateId)) return;
  if (target.food <= 0 || isFed(target)) return;
  state.turnUse.pirates.push(pirateId);
  state.turnUse.combatUsed = true;
  // Крадём любую фишку: сначала синюю, иначе красную; цвет сохраняется у пирата.
  const stoleBlue = target.blueFood > 0;
  if (stoleBlue) target.blueFood -= 1;
  target.food -= 1;
  giveFood(state, pirate, 1, stoleBlue ? "blue" : "red");
  ev(state, { kind: "blueFood", animalId: pirate.id, reason: "piracy" });
  log(
    state,
    `${p.name} пиратствует у ${ownerOf(state, target.id).name}.`,
    "hunt",
  );
  maybeEndTurn(state);
}

function feedHibernate(state: GameState, animalId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  a.hibernating = true;
  log(state, `${p.name} использует спячку.`, "good");
  advanceFeed(state);
}

/** «Закончить ход»: передача хода следующему игроку без паса до конца фазы. */
function feedEndTurn(state: GameState) {
  log(state, `${player(state, state.currentPlayerId).name} заканчивает ход.`);
  advanceFeed(state);
}

/**
 * Ход заканчивается сам только тогда, когда игроку нечего делать вообще —
 * даже начав ход заново (всё накормлено, база пуста, свойства использованы).
 * Одно действие (взять еду, пиратство, охота) ход не отдаёт: пока остаётся
 * хоть какая-то возможность, ход держится за игроком до «Закончить ход».
 */
function maybeEndTurn(state: GameState) {
  if (state.phase !== "feeding" || state.pendingAttack) return;
  if (!hasFreshAction(state, state.currentPlayerId)) {
    advanceFeed(state);
  }
}

/** Превращение жира в еду — свободное действие: ход не тратится. */
function feedConvertFat(state: GameState, animalId: string, amount: number) {
  const p = player(state, state.currentPlayerId);
  const a = mustFind(state, animalId);
  const n = Math.min(amount, a.fatTokens);
  a.fatTokens -= n;
  a.food += n;
  a.blueFood += n;
  ev(state, { kind: "blueFood", animalId: a.id, reason: "fat" });
  log(state, `${p.name} тратит жировой запас (${n}). Ход продолжается.`);
  maybeEndTurn(state);
}

/** Топтун — отдельное действие хода: уничтожает 1 фишку из базы своей территории. */
function feedGraze(state: GameState, animalId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  if (!hasTrait(a, "grazing") || bankOf(state, a.zoneId) <= 0) {
    advanceFeed(state);
    return;
  }
  takeFromBank(state, a.zoneId, 1);
  state.turnUse.grazers.push(animalId);
  ev(state, { kind: "bankBurned", amount: 1, territory: a.zoneId });
  log(state, `${p.name}: топтун уничтожает 1 еду. База: ${bankOf(state, a.zoneId)}.`);
  maybeEndTurn(state);
}

/**
 * «Миграция»: отдельный ход питания. Переезжают объявленные животные со
 * свойством «миграция», за каждым могут прицепиться прилипалы (в т.ч. чужие).
 * В этот ход больше ничего нельзя: ни есть, ни охотиться.
 */
function feedMigrate(state: GameState, moves: Array<{ animalId: string; to: TerritoryId }>) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  if (state.turnUse.migrated) return;
  const applied: Array<{ animalId: string; from?: TerritoryId; to: TerritoryId }> = [];
  for (const m of moves) {
    const a = findAnimal(state, m.animalId);
    if (!a) continue;
    if (!canMigrate(state, a)) continue;
    const from = a.zoneId;
    if (from === m.to) continue;
    // Правила: океан ↔ континент; водоплавающее с континента — только в океан.
    const targets = migrationTargets(state, a);
    if (!targets.includes(m.to)) continue;
    a.zoneId = m.to;
    applied.push({ animalId: a.id, from, to: m.to });
    // Прилипалы того же владельца уезжают вместе с мигрантом по его выбору —
    // в нашей версии едут все свободные прилипалы игрока из прежней зоны мигранта.
    for (const r of ownerOf(state, a.id).animals) {
      if (r.id === a.id) continue;
      if (r.hibernating) continue;
      if (r.zoneId !== from) continue;
      if (!r.traits.some((t) => t.type === "remora" && isActive(t))) continue;
      // Прилипала со «стадностью»/парная логика не меняется — только зона.
      r.zoneId = m.to;
      applied.push({ animalId: r.id, from, to: m.to });
    }
  }
  if (!applied.length) {
    advanceFeed(state);
    return;
  }
  state.turnUse.migrated = true;
  ev(state, { kind: "migrated", moves: applied });
  log(state, `${p.name} объявляет миграцию (${applied.length} животное(-ых)).`);
  // Парное свойство разъехавшейся пары уходит в сброс.
  dropCrossTerritoryPairs(state);
  maybeEndTurn(state);
}

/** Разъехались животные с общей парной картой — карта уходит в сброс (правило). */
function dropCrossTerritoryPairs(state: GameState) {
  if (!state.modules.continents) return;
  for (const p of state.players) {
    for (const a of [...p.animals]) {
      for (const t of [...a.traits]) {
        if (!t.pairWith) continue;
        const other = findAnimal(state, t.pairWith);
        if (!other) continue;
        if (a.zoneId !== other.zoneId) {
          a.traits = a.traits.filter((x) => x.cardId !== t.cardId);
          other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
          p.discardCount += 1;
          log(state, `Парное свойство разъехавшихся животных уходит в сброс.`);
          settleAfterTraitChange(state, a);
          settleAfterTraitChange(state, other);
        }
      }
    }
  }
}

/**
 * Перестановка своего животного (косметика, любое время партии).
 * «Континенты»: toZoneId двигает животное между зонами вручную — разрешено
 * только в фазу развития и без потери парных связей.
 */
function reorderAnimal(state: GameState, animalId: string, beforeId?: string) {
  if (state.phase !== "development" && state.phase !== "feeding") return;
  const owner = ownerOf(state, animalId);
  if (owner.id !== state.humanId) return;
  const from = owner.animals.findIndex((a) => a.id === animalId);
  if (from < 0) return;
  const [animal] = owner.animals.splice(from, 1);
  let to = owner.animals.length;
  if (beforeId && beforeId !== animalId) {
    const bi = owner.animals.findIndex((a) => a.id === beforeId);
    if (bi >= 0) to = bi;
  }
  owner.animals.splice(to, 0, animal);
}

/** Перестановка с переносом между территориями («Континенты», UI перетаскиванием). */
function moveAnimalToZoneHuman(state: GameState, animalId: string, zone: TerritoryId): boolean {
  if (!state.modules.continents || state.phase !== "development") return false;
  const owner = ownerOf(state, animalId);
  if (owner.id !== state.humanId) return false;
  if (zone === "ocean") return false; // океан только через свойство
  const a = mustFind(state, animalId);
  // Парное свойство нельзя разрывать переносом.
  for (const t of a.traits) {
    if (!t.pairWith) continue;
    const other = findAnimal(state, t.pairWith);
    if (other && other.zoneId !== zone) return false;
  }
  a.zoneId = zone;
  return true;
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
    return;
  }
  if (action.kind === "running") {
    atk.usedDefenses.push("running");
    const roll = dieFor(state);
    ev(state, { kind: "defenseUsed", defense: "running", roll, preyId: atk.preyId });
    if (roll >= 4) {
      log(state, `Быстрое: выпало ${roll} — животное спаслось!`, "good");
      state.pendingAttack = null;
      maybeEndTurn(state);
      return;
    }
    log(state, `Быстрое: выпало ${roll} — хищник догнал.`, "bad");
    if (defenseOptions(prey, atk).length === 0) {
      resolveNoDefense(state);
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
    }
    return;
  }
  if (action.kind === "tailLoss") {
    // Сбрасывается только сама карта хвоста — никакое другое свойство.
    const tail = prey.traits.find((t) => isActive(t) && t.type === "tailLoss");
    if (tail) {
      if (tail.pairWith) {
        const other = findAnimal(state, tail.pairWith);
        if (other) other.traits = other.traits.filter((x) => x.cardId !== tail.cardId);
      }
      prey.traits = prey.traits.filter((t) => t.cardId !== tail.cardId);
      ownerOf(state, prey.id).discardCount += 1;
    }
    giveFood(state, carnivore, 1, "blue");
    ev(state, { kind: "blueFood", animalId: carnivore.id, reason: "tailLoss" });
    ev(state, { kind: "defenseUsed", defense: "tailLoss", preyId: atk.preyId });
    log(state, "Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.", "good");
    state.pendingAttack = null;
    maybeEndTurn(state);
    return;
  }
  ev(state, { kind: "defenseUsed", defense: "none", preyId: atk.preyId });
  resolveNoDefense(state);
  maybeEndTurn(state);
}

/**
 * Питание закончено: остаток баз сгорает, вычисляется список погибших.
 * Животные удаляются позже — действием continueExtinction, чтобы игроки
 * увидели стадию вымирания, а не мгновенный переход.
 */
function endFeeding(state: GameState) {
  if (state.modules.continents && state.territoryFood) {
    const leftovers = Object.entries(state.territoryFood).filter(([, v]) => (v ?? 0) > 0);
    if (leftovers.length) {
      const total = leftovers.reduce((s, [, v]) => s + (v ?? 0), 0);
      ev(state, { kind: "bankBurned", amount: total });
      log(state, `Остатки кормовых баз (${total}) сгорают.`);
      for (const [k] of leftovers) state.territoryFood[k as TerritoryId] = 0;
      state.foodBank = 0;
    }
  } else if (state.foodBank > 0) {
    ev(state, { kind: "bankBurned", amount: state.foodBank });
    log(state, `Остаток кормовой базы (${state.foodBank}) сгорает.`);
    state.foodBank = 0;
  }
  state.phase = "extinction";
  state.extinctionDeaths = [];
  const doomed = allAnimals(state).filter((a) => a.poisoned || !isFed(a));
  for (const a of allAnimals(state)) {
    if (doomed.some((d) => d.id === a.id)) state.extinctionDeaths.push(a.id);
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

/**
 * Подъём «неоплазии» в начале определения кормовой базы: карта поднимается на
 * одну позицию и выключает лежащее над ней непарное свойство (выключенное не
 * действует, но очки за него остаются). Выключать нечего — животное погибает.
 * «Водоплавающее» в океане неотчуждаемо: зона делает животное водным, поэтому
 * неоплазия его пропускает.
 */
function advanceNeoplasia(state: GameState) {
  if (!state.modules.continents) return;
  for (const p of state.players) {
    for (const a of [...p.animals]) {
      const neo = a.traits.find((t) => t.type === "neoplasia");
      if (!neo) continue;
      a.neoplasia = neo;
      const protectedSwim = a.zoneId === "ocean";
      const stack = a.traits.filter(
        (t) =>
          t.id !== neo.id &&
          !t.pairWith &&
          !t.disabled &&
          !(protectedSwim && t.type === "swimming"),
      );
      const next = [...stack].sort(
        (x, y) => y.playSeq - x.playSeq || a.traits.indexOf(y) - a.traits.indexOf(x),
      )[0];
      if (!next) {
        // Выключать нечего — животное немедленно погибает.
        ev(state, { kind: "animalDied", animalId: a.id, cause: "neoplasia" });
        log(state, `Неоплазия поглощает животное ${p.name} целиком.`, "bad");
        discardAnimal(state, a);
        continue;
      }
      next.disabled = true;
      log(state, `Неоплазия выключает свойство «${TRAITS[next.type].name}».`, "bad");
    }
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
  // Регенерация: владелец обязан положить карту из руки как новое животное
  // поверх оставленных свойств (без добора за него).
  regeneratedThisYear.clear();
  restoreRegenerated(state);
  for (const a of allAnimals(state)) {
    a.food = 0;
    a.blueFood = 0;
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

/**
 * Восстановление съеденных «регенерировавших» животных: владелец обязан
 * положить карту из руки (а если рука пуста — из колоды) как новое животное
 * на оставленные свойства. Добора карт за такое животное нет.
 */
function restoreRegenerated(state: GameState) {
  const pend = state.pendingRegeneration;
  if (!pend?.length) return;
  state.pendingRegeneration = null;
  for (const item of pend) {
    const p = player(state, item.ownerId);
    const card = p.hand.pop() ?? state.deck.pop();
    if (!card) continue; // ни руки, ни колоды — свойства лежат до конца игры
    const animal: Animal = {
      id: nid(state, "a"),
      ownerId: p.id,
      cardId: card.id,
      traits: [],
      food: 0,
      blueFood: 0,
      fatTokens: 0,
      hibernating: false,
      hibernatedLastYear: false,
      receivedFoodThisYear: false,
      poisoned: false,
      seed: card.id.length * 17 + p.id * 13,
      ...(state.modules.continents ? { zoneId: "laurasia" as TerritoryId } : {}),
    };
    p.animals.push(animal);
    // За регенерировавшее животное карты в добор не идут (правило).
    regeneratedThisYear.set(p.id, (regeneratedThisYear.get(p.id) ?? 0) + 1);
    ev(state, { kind: "regenerated", ownerId: p.id });
    log(state, `${p.name} восстанавливает регенерировавшее животное.`, "good");
  }
}

/**
 * Сколько животных игрок восстановил регенерацией в этом вымирании: добор
 * «выжившие + 1» их не учитывает. Живёт внутри одного применения действия.
 */
const regeneratedThisYear = new Map<number, number>();

function drawCards(state: GameState) {
  const start = state.firstPlayerId;
  const n = state.players.length;
  let emptied = state.deck.length === 0;
  const counts = new Array<number>(n).fill(0);
  for (let k = 0; k < n; k++) {
    const idx = (start + k) % n;
    const p = state.players[idx]!;
    // Добор «выжившие + 1»; регенерировавшие животные в счёт не идут.
    let want = Math.max(1, p.animals.length - (regeneratedThisYear.get(p.id) ?? 0) + 1);
    if (p.animals.length === 0 && p.hand.length === 0) {
      // Спасение из игры на вылет: 10 карт, две сразу кладутся животными.
      if (state.modules.continents) {
        for (let i = 0; i < 10; i++) {
          const c = state.deck.pop();
          if (!c) {
            emptied = true;
            break;
          }
          p.hand.push(c);
          counts[idx]! += 1;
        }
        // Две первые карты — немедленные животные (по одному на континент).
        playRescueAnimal(state, p, "laurasia");
        playRescueAnimal(state, p, "gondwana");
        continue;
      }
      want = 6;
    }
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

/** «10 карт»: две из них сразу становятся животными — по одному на континент. */
function playRescueAnimal(state: GameState, p: Player, zone: TerritoryId) {
  const card = p.hand.shift();
  if (!card) return;
  const animal: Animal = {
    id: nid(state, "a"),
    ownerId: p.id,
    cardId: card.id,
    traits: [],
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: card.id.length * 17 + p.id * 13 + p.animals.length,
    zoneId: zone,
  };
  p.animals.push(animal);
  ev(state, { kind: "animalPlaced", animalId: animal.id, ownerId: p.id, zoneId: zone });
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
