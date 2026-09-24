import { buildDeck, deckSizeFor } from "./deck.ts";
import { FLORA, FLORA_MAX_TOKENS, FLORA_TABLE_MAX, MARKS, floraDeckKinds, fullMarksPool } from "./flora.ts";
import { growthTarget, plantTable, plantDeckKinds, PLANTS, shelterCapacity } from "./plants.ts";
import { dieFor, nextRandom, shuffled } from "./rng.ts";
import { TRAITS } from "./traits.ts";
import { TERRITORIES } from "./types.ts";
import type { TraitDef } from "./traits.ts";
import type { TKey } from "../lib/i18n/ru.ts";
import type {
  Animal,
  Card,
  Difficulty,
  FeedTurnUse,
  FloraCard,
  FloraKind,
  GameAction,
  GameEvent,
  GameState,
  LogEntry,
  MarkKind,
  ModuleId,
  PendingAttack,
  Plant,
  PlantKind,
  Player,
  RegenPending,
  ScoreBreakdown,
  TerritoryId,
  TraitId,
  TraitInstance,
} from "./types.ts";
import {
  allAnimals,
  animalValue,
  canAttack,
  canFeedOnFlora,
  canFeedOnPlant,
  canHuntWith,
  canMigrate,
  canPlantAttackTarget,
  canRageAttack,
  canRageAttackWith,
  canReceiveFood,
  canTakeShelterFrom,
  emptyFatSlots,
  findAnimal,
  findFlora,
  findPlant,
  foodNeeded,
  hasMark,
  hasTrait,
  hazeIgnoreTraitId,
  isActive,
  isAsleep,
  isCarnivoreLike,
  isFed,
  isParalyzed,
  mustFind,
  mustFindFlora,
  mustFindPlant,
  nextPlayerId,
  player,
  plantHasTrait,
  speciesNeed,
} from "./queries.ts";

/** Имена ботов (учёные): общий список для соло и сетевых лобби. */
export const AI_NAMES = ["Дарвин", "Уоллес", "Мендель", "Линней", "Кювье", "Ламарк", "Геккель"];

/**
 * Сколько хищников могут атаковать за один ход игрока (решение владельца
 * от 24.09.2026). Поверх правила «одно животное — одна охота за год»
 * (отслеживается в `Animal.huntedYear`).
 */
export const HUNTS_PER_TURN = 2;

/**
 * Запись в журнал. Локализация (волна 8): движок продолжает писать готовый
 * русский `text` (его проверяют тесты и его показывают старые кадры без key),
 * а рядом кладёт машиночитаемые `key` + `params` — клиент при lang=en рендерит
 * запись по словарю. Параметры-термины (`trait`/`plant`/`flora`/`mark`/`zone`)
 * передаются id, а не именем: имя подставляет рендер через terms.ts.
 */
function log(
  state: GameState,
  text: string,
  key: TKey,
  params?: Record<string, string | number>,
  tone: LogEntry["tone"] = "neutral",
) {
  // id сквозной (logSeq): после обрезки журнала id не должны повторяться.
  // Старый сейв без logSeq самовосстанавливается от id последней записи.
  const prev = state.logSeq ?? state.log.at(-1)?.id ?? 0;
  state.logSeq = (Number.isFinite(prev) ? prev : 0) + 1;
  state.log.push({ id: state.logSeq, text, tone, key, ...(params ? { params } : {}) });
  if (state.log.length > 80) state.log.splice(0, state.log.length - 80);
}

function ev(state: GameState, event: GameEvent) {
  state.lastEvents.push(event);
}

/**
 * Передача хода: фиксируем нового текущего игрока и считаем передачу
 * (turnSeq). Счётчик различает круги одной фазы одного года — без него UI
 * не отличал возврат хода к игроку после круга соперников от «того же» хода.
 * Старый сейв без поля самовосстанавливается (NaN-защита, как у logSeq).
 */
function passTurnTo(state: GameState, id: number) {
  state.currentPlayerId = id;
  state.turnSeq = (Number.isFinite(state.turnSeq) ? state.turnSeq : 0) + 1;
}

/** Id всех сущностей выдаёт состояние — снапшоты не конфликтуют между партиями. */
function nid(state: GameState, prefix: string): string {
  state.idSeq += 1;
  return `${prefix}${state.idSeq}`;
}

/**
 * Колода партии: полный состав либо масштабированная до deckSize.
 * Масштаб считается вниз, поэтому каждая уникальная карта остаётся в
 * укороченной колоде. Запрошенный размер ниже обязательной подготовки или
 * состава поднимается: все игроки получают свою долю, а в общей колоде
 * остаётся хотя бы одна карта. Недостающие копии добираются из уже
 * представленных карт с новыми id, поэтому партия остаётся воспроизводимой.
 */
function buildScaledDeck(state: GameState, deckSize?: number): Card[] {
  const nextId = (prefix: string) => nid(state, prefix);
  const requested = deckSize && deckSize > 0 ? Math.floor(deckSize) : 0;
  if (!requested) return buildDeck(nextId, state.modules);
  const dealEach = state.modules.randomMutations ? 7 : state.modules.plants ? 8 : 6;
  const startingSpecies = state.modules.randomMutations ? 3 : 0;
  const firstDrawEach = state.modules.randomMutations ? startingSpecies + 2 : 1;
  const minimum = Math.max(
    deckSizeFor(0, state.modules),
    state.players.length * (dealEach + startingSpecies + firstDrawEach) + 1,
  );
  const target = Math.max(requested, minimum);
  const base = deckSizeFor(1, state.modules);
  const cards = buildDeck(nextId, state.modules, target / base);
  while (cards.length > target) cards.pop();
  while (cards.length < target) {
    const src = cards[Math.floor(nextRandom(state) * cards.length)];
    if (!src) break;
    cards.push({ id: nid(state, "c"), faces: [...src.faces] });
  }
  return cards;
}

export function createGame(
  playerCount: number,
  difficulty: Difficulty,
  seed = Date.now() % 1_000_000,
  /** Сетевая партия: имена и флаги ботов берутся из мест комнаты. */
  seats?: Array<{ name: string; isAI: boolean }>,
  /** Включённые дополнения (пока только «Континенты»). */
  modules?: Partial<Record<ModuleId, boolean>>,
  /**
   * Укороченная/удлинённая колода: точное число карт колоды свойств.
   * Не задано — полный состав (обратная совместимость вызовов).
   */
  deckSize?: number,
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
      blindDeck: modules?.randomMutations ? [] : undefined,
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
    logSeq: 0,
    turnSeq: 0,
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
  state.deck = shuffled(state, buildScaledDeck(state, deckSize));
  if (state.modules.plants) {
    // «Растения»: отдельная колода растений, стартовый набор — по таблице.
    state.plants = [];
    state.plantDeck = shuffled(state, [...plantDeckKinds()]);
    addNewPlants(state, plantTable(playerCount).initial, true);
    state.plantDeckCount = state.plantDeck.length;
  }
  if (state.modules.fungi) {
    // «Трава и грибы»: колода флоры и стол меток; на старте открыты 2 карты.
    state.flora = [];
    state.floraDeck = shuffled(state, floraDeckKinds());
    state.marksPool = fullMarksPool();
    state.madTurn = undefined;
    state.rageTurn = null;
    addNewFlora(state, 2, true);
    state.floraDeckCount = state.floraDeck.length;
  }
  if (state.modules.randomMutations) {
    // «Случайные мутации»: сначала каждому выдают семь карт в личную
    // колоду, затем ещё три карты рубашкой вверх — это стартовые виды.
    for (const p of state.players) {
      for (let i = 0; i < 7; i++) {
        const c = state.deck.pop();
        if (c) p.blindDeck!.push(c);
      }
      for (let i = 0; i < 3; i++) {
        const c = state.deck.pop();
        if (c) spawnSpecies(state, p, c);
      }
    }
    log(state, `Случайные мутации: у каждого игрока личная колода из 7 карт и три стартовых вида.`, "log.mutationsIntro", undefined, "good");
  } else {
    // «Растения» раздают по 8 карт (правила дополнения), базовая игра — по 6.
    const dealEach = state.modules.plants ? 8 : 6;
    for (let i = 0; i < dealEach; i++) {
      for (const p of state.players) {
        const c = state.deck.pop();
        if (c) p.hand.push(c);
      }
    }
  }
  const first = Math.floor(nextRandom(state) * playerCount);
  passTurnTo(state, first);
  state.firstPlayerId = first;
  log(state, `Год 1. Первым ходит ${state.players[first]!.name}.`, "log.firstTurn", { name: state.players[first]!.name }, "good");
  startMutationsDevTurn(state, first);
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

/**
 * Следующий номер животного у владельца: номера стабильные, поэтому при
 * перестановках и переносе между территориями «№1» у зверя не меняется.
 */
function nextAnimalNo(p: Player): number {
  return p.animals.reduce((max, a) => Math.max(max, a.no ?? 0), 0) + 1;
}

/**
 * Связанные животные (сотрудничество/симбиоз): сам зверь и его партнёр по
 * парному свойству. Перемещать их нужно вместе — пара держится рядом.
 */
function pairGroup(state: GameState, animal: Animal): Animal[] {
  const group = [animal];
  for (const t of animal.traits) {
    if (!t.pairWith) continue;
    if (group.some((a) => a.id === t.pairWith)) continue;
    const other = findAnimal(state, t.pairWith);
    if (other) group.push(other);
  }
  return group;
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
  p.discardCount += (animal.population ?? 1) + animal.traits.length;
  for (const t of animal.traits) {
    if (t.pairWith) {
      const other = findAnimal(state, t.pairWith);
      if (other) {
        other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
      }
      for (const pending of state.pendingRegeneration ?? []) {
        if (pending.traits) pending.traits = pending.traits.filter((x) => x.cardId !== t.cardId);
      }
    }
  }
  p.animals = p.animals.filter((a) => a.id !== animal.id);
  // «Растения»: гибель любого животного кормит грибы.
  feedFungi(state);
  // «Трава и грибы»: метки погибшего возвращаются на стол, гибель кормит грибы.
  returnMarksToPool(state, animal);
  spreadFungalGrowth(state);
}

/** Каждый гриб получает фишку за гибель животного (не выше максимума). */
function feedFungi(state: GameState) {
  if (!state.modules.plants) return;
  for (const pl of state.plants ?? []) {
    if (pl.kind !== "fungus") continue;
    const max = PLANTS.fungus.maxFood;
    if (pl.food < max) pl.food += 1;
  }
}

/** Положить на стол растение из колоды растений (учитывая континенты). */
function spawnPlant(state: GameState, kind: PlantKind, zone?: TerritoryId): Plant {
  const def = PLANTS[kind];
  state.playSeq += 1;
  let zoneId: TerritoryId | undefined;
  if (state.modules.continents) {
    zoneId = zone ?? "gondwana";
  }
  const plant: Plant = {
    id: nid(state, "p"),
    kind,
    food: def.startFood,
    shelters: def.shelters,
    traits: [],
    playSeq: state.playSeq,
    ...(zoneId !== undefined ? { zoneId } : {}),
  };
  state.plants!.push(plant);
  ev(state, { kind: "plantPlaced", plantId: plant.id, kindOfPlant: kind });
  return plant;
}

/**
 * Добавить растения из колоды: не выше максимума стола (паразиты не в счёт).
 * «Континенты»: первым кладём на континент, где растений меньше (в самом
 * начале игры — Гондвана, затем чередование).
 */
function addNewPlants(state: GameState, count: number, initial = false) {
  if (!state.modules.plants) return;
  const table = plantTable(state.players.length);
  let added = 0;
  for (let i = 0; i < count; i++) {
    const onTable = state.plants!.filter((p) => p.kind !== "parasite").length;
    if (onTable >= table.max) break;
    const kind = state.plantDeck!.pop();
    if (!kind) break;
    let zone: TerritoryId | undefined;
    if (state.modules.continents) {
      if (initial) {
        // Правила: первое растение — Гондвана, дальше чередуемся.
        zone = (state.plants!.filter((p) => p.kind !== "parasite").length % 2 === 0)
          ? "gondwana"
          : "laurasia";
      } else {
        const g = state.plants!.filter((p) => p.kind !== "parasite" && (p.zoneId ?? "gondwana") === "gondwana").length;
        const l = state.plants!.filter((p) => p.kind !== "parasite" && (p.zoneId ?? "gondwana") === "laurasia").length;
        zone = g > l ? "laurasia" : "gondwana";
      }
    }
    const plant = spawnPlant(state, kind, zone);
    added += 1;
    log(
      state,
      `Новое растение: ${PLANTS[kind].name}${zone ? ` (${zone === "gondwana" ? "Гондвана" : "Лавразия"})` : ""}.`,
      zone ? "log.newPlantZone" : "log.newPlant",
      { plant: kind, ...(zone ? { zone } : {}) },
      "good",
    );
  }
  if (added === 0 && count > 0) {
    log(state, `Колода растений пуста — новых растений нет.`, "log.plantDeckEmpty");
  }
  state.plantDeckCount = state.plantDeck!.length;
}

// ── «Трава и грибы»: флора и метки ───────────────────────────────────────────

/** Положить на стол карту флоры из колоды (учитывая континенты). */
function spawnFlora(state: GameState, kind: FloraKind, zone?: TerritoryId): FloraCard {
  const def = FLORA[kind];
  state.playSeq += 1;
  const card: FloraCard = {
    id: nid(state, "f"),
    kind,
    food: def.isFungus ? 1 : 3,
    playSeq: state.playSeq,
    ...(zone !== undefined ? { zoneId: zone } : {}),
  };
  state.flora!.push(card);
  ev(state, { kind: "floraPlaced", floraId: card.id, kindOfFlora: kind });
  return card;
}

/**
 * Добавить карты флоры из колоды: не выше максимума стола (8 карт).
 * «Континенты» (по главе «Континенты + Растения» официального FAQ):
 * флора живёт на континентах, первым кладём туда, где её меньше.
 */
function addNewFlora(state: GameState, count: number, initial = false) {
  if (!state.modules.fungi) return;
  let added = 0;
  for (let i = 0; i < count; i++) {
    if (state.flora!.length >= FLORA_TABLE_MAX) break;
    const kind = state.floraDeck!.pop();
    if (!kind) break;
    let zone: TerritoryId | undefined;
    if (state.modules.continents) {
      const g = state.flora!.filter((f) => (f.zoneId ?? "gondwana") === "gondwana").length;
      const l = state.flora!.filter((f) => (f.zoneId ?? "gondwana") === "laurasia").length;
      zone = initial ? (g === 0 ? "gondwana" : "laurasia") : g > l ? "laurasia" : "gondwana";
    }
    const card = spawnFlora(state, kind, zone);
    added += 1;
    log(
      state,
      `Новая карта флоры: ${FLORA[kind].name}${zone ? ` (${zone === "gondwana" ? "Гондвана" : "Лавразия"})` : ""}.`,
      zone ? "log.newFloraZone" : "log.newFlora",
      { flora: kind, ...(zone ? { zone } : {}) },
      "good",
    );
  }
  if (added === 0 && count > 0 && state.floraDeck!.length === 0) {
    log(state, `Колода трав и грибов пуста — новых карт нет.`, "log.floraDeckEmpty");
  }
  state.floraDeckCount = state.floraDeck!.length;
}

/**
 * Разрастание грибов: гибель любого животного кладёт 1 красную фишку на
 * гриб (по выбору владельца погибшего; онлайн-версия кладёт на самый пустой).
 */
function spreadFungalGrowth(state: GameState) {
  if (!state.modules.fungi) return;
  if (state.phase !== "feeding" && state.phase !== "extinction") return;
  const mushrooms = (state.flora ?? []).filter(
    (f) => FLORA[f.kind].isFungus && f.food < FLORA_MAX_TOKENS,
  );
  if (!mushrooms.length) return;
  const target = mushrooms.reduce((best, f) => (f.food < best.food ? f : best), mushrooms[0]!);
  const before = target.food;
  target.food += 1;
  ev(state, { kind: "floraGrew", floraId: target.id, from: before, to: target.food });
}

/**
 * Дать животному метку последствий. Из колоды на столе (взятие с флоры) метка
 * приходит, только если она ещё осталась; перенос со съеденной добычи (force)
 * всегда успешен. «Трын» защищает от любых меток.
 */
function giveMark(state: GameState, animal: Animal, mark: MarkKind, opts?: { force?: boolean }): boolean {
  if (hasMark(animal, mark)) return false;
  // При переносе исходный «Трын» проверяется один раз для всего набора.
  if (!opts?.force && hasMark(animal, "thryn")) return false;
  const left = state.marksPool?.[mark] ?? 0;
  if (left <= 0) return false;
  state.marksPool = { ...state.marksPool, [mark]: left - 1 };
  animal.marks = [...(animal.marks ?? []), mark];
  ev(state, { kind: "markGained", animalId: animal.id, mark });
  const owner = ownerOf(state, animal.id);
  log(state, `${owner.name}: животное получает метку «${MARKS[mark].name}».`, "log.markGained", { name: owner.name, mark }, mark === "poison" ? "bad" : "neutral");
  if (mark === "poison") {
    // Правило метки «Яд»: свойство «Паразит» животного уходит в сброс.
    dropTraitOfType(state, animal, "parasite");
  }
  return true;
}

/**
 * Перенос меток со съеденной добычи на хищника после возврата меток в пул.
 * По правилу «Трын» хищник без «Трына» получает все метки добычи
 * одновременно — поэтому для хищника без «Трына» переносится весь набор
 * разом, даже если среди меток есть сам «Трын».
 */
function transferMarks(state: GameState, predator: Animal, marks: MarkKind[]) {
  if (hasMark(predator, "thryn")) return;
  for (const mark of marks) giveMark(state, predator, mark, { force: true });
}

/** Снять все метки животного, вернув их на стол. */
function returnMarksToPool(state: GameState, animal: Animal) {
  if (!animal.marks?.length) return;
  for (const m of animal.marks) {
    const left = state.marksPool?.[m] ?? 0;
    state.marksPool = { ...state.marksPool, [m]: left + 1 };
  }
  animal.marks = [];
}

/** Сброс одного свойства животного в сброс (карта учитывается владельцу). */
function dropTraitOfType(state: GameState, animal: Animal, type: TraitId) {
  const trait = animal.traits.find((t) => t.type === type && isActive(t));
  if (!trait) return;
  if (trait.pairWith) {
    const other = findAnimal(state, trait.pairWith);
    if (other) other.traits = other.traits.filter((x) => x.cardId !== trait.cardId);
  }
  animal.traits = animal.traits.filter((t) => t.id !== trait.id);
  ownerOf(state, animal.id).discardCount += 1;
  log(state, `Свойство «${TRAITS[type].name}» уходит в сброс.`, "log.traitDiscarded", { trait: type });
}


export function legalDevActions(state: GameState, playerId: number): GameAction[] {
  if (state.phase !== "development") return [];
  if (state.currentPlayerId !== playerId) return [];
  const p = player(state, playerId);
  if (p.passedDev) return [];
  const cont = state.modules.continents;
  const plants = state.modules.plants ? (state.plants ?? []) : [];
  const actions: GameAction[] = [{ type: "devPass" }];
  // «Случайные мутации»: вместо карт руки — объявление розыгрыша верхней
  // карты личной слепой колоды; сама карта неизвестна до переворота.
  if (state.modules.randomMutations) {
    const deck = p.blindDeck ?? [];
    if (!deck.length) return actions;
    if (cont) {
      actions.push({ type: "devMutate", intent: "newAnimal", zoneId: "laurasia" });
      actions.push({ type: "devMutate", intent: "newAnimal", zoneId: "gondwana" });
    } else {
      actions.push({ type: "devMutate", intent: "newAnimal" });
    }
    for (const a of p.animals) {
      // Свойство играется только на вид из одного животного.
      if ((a.population ?? 1) === 1) {
        actions.push({ type: "devMutate", intent: "trait", animalId: a.id });
      }
      // Численность вида — не выше числа видов игрока; «Экстрофил» требует
      // дополнительную карту: в колоде должно быть минимум две.
      const ext = a.traits.some((t) => t.type === "extremophile" && isActive(t));
      if ((a.population ?? 1) < p.animals.length && (!ext || deck.length >= 2)) {
        actions.push({ type: "devMutate", intent: "population", animalId: a.id });
      }
    }
    if (state.modules.plants) {
      for (const pl of plants) {
        actions.push({ type: "devMutate", intent: "plant", plantId: pl.id });
      }
    }
    return actions;
  }
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
      // Свойство растения кладётся на любое растение стола (общие).
      if (def.plantTrait && state.modules.plants) {
        if (trait === "micorrhiza") {
          for (let i = 0; i < plants.length; i++) {
            for (let j = 0; j < plants.length; j++) {
              if (i === j) continue;
              if (!canLinkMicorrhiza(state, plants[i]!, plants[j]!)) continue;
              actions.push({ type: "devPlayPlantPair", cardId: card.id, face, a: plants[i]!.id, b: plants[j]!.id });
            }
          }
          continue;
        }
        for (const pl of plants) {
          if (trait === "plantParasite") {
            actions.push({ type: "devPlayPlantTrait", cardId: card.id, face, plantId: pl.id });
            continue;
          }
          // Одноимённые свойства на одном растении запрещены.
          if (plantHasTrait(pl, trait)) continue;
          actions.push({ type: "devPlayPlantTrait", cardId: card.id, face, plantId: pl.id });
        }
        continue;
      }
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
            if (canAttachPair(state, mine[i]!, mine[j]!, trait)) {
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
  // «Случайные мутации»: «Облигатный хищник» не сочетается ни с «Хищником»,
  // ни с «Падальщиком» (взаимоисключающая мясная специализация вида).
  if (
    (trait === "carnivore" || trait === "scavenger") &&
    hasTrait(animal, "obligateCarnivore", includeHidden)
  ) {
    return false;
  }
  if (trait === "obligateCarnivore" && (hasTrait(animal, "carnivore", includeHidden) || hasTrait(animal, "scavenger", includeHidden))) {
    return false;
  }
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

/** Число пар у животного: по правилам их не больше двух (B — A — C). */
function pairCount(a: Animal): number {
  return a.traits.reduce((n, t) => n + (t.pairWith ? 1 : 0), 0);
}

/**
 * Пара связывает двух животных одного владельца. Ограничения:
 * — между двумя животными лежит только одна парная карта (любая);
 * — у животного не больше двух пар: партнёры встают по сторонам (B — A — C);
 * — связь не замыкает цепочку в кольцо: у плашки пары нет «между», и один
 *   из партнёров потерял бы своё место в раскладке.
 */
function canAttachPair(state: GameState, a: Animal, b: Animal, _trait: TraitId): boolean {
  if (a.id === b.id) return false;
  // Парные свойства также входят в лимит двух свойств при регенерации.
  if ([a, b].some((animal) => hasTrait(animal, "regeneration", true) && animal.traits.length >= 2)) return false;
  // «Континенты»: парная карта — только внутри одной территории.
  if (a.zoneId !== b.zoneId) return false;
  const linked = a.traits.some((t) => t.pairWith === b.id) || b.traits.some((t) => t.pairWith === a.id);
  if (linked) return false;
  // Больше двух пар на животное не бывает: партнёры встают по сторонам (B — A — C).
  if (pairCount(a) >= 2 || pairCount(b) >= 2) return false;
  // Замыкание цепочки в кольцо оставило бы плашку пары без места «между».
  return !samePairChain(state, a, b);
}

/**
 * Животные уже связаны цепочкой пар (напрямую или через соседей)? Кольца в
 * раскладке недопустимы: плашке пары нужно место «между» двумя животными.
 */
function samePairChain(state: GameState, a: Animal, b: Animal): boolean {
  const seen = new Set<string>([a.id]);
  const queue: Animal[] = [a];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const t of cur.traits) {
      if (!t.pairWith || seen.has(t.pairWith)) continue;
      if (t.pairWith === b.id) return true;
      seen.add(t.pairWith);
      const next = findAnimal(state, t.pairWith);
      if (next) queue.push(next);
    }
  }
  return false;
}

/**
 * Микориза связывает два растения; пара растений может быть связана только
 * одной микоризой, но у растения бывает несколько связей с разными партнёрами.
 * «Континенты»: только внутри одного континента.
 */
function canLinkMicorrhiza(state: GameState, a: Plant, b: Plant): boolean {
  if (a.id === b.id) return false;
  if (state.modules.continents && (a.zoneId ?? "gondwana") !== (b.zoneId ?? "gondwana")) return false;
  const linked =
    a.traits.some((t) => t.type === "micorrhiza" && t.pairWith === b.id) ||
    b.traits.some((t) => t.type === "micorrhiza" && t.pairWith === a.id);
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
  opts?: { triggerCoop?: boolean; triggerComm?: boolean; obligate?: boolean },
) {
  if (amount <= 0) return;
  // «Облигатный хищник» кормится только добычей с охоты (opts.obligate).
  if (hasTrait(animal, "obligateCarnivore") && !opts?.obligate) return;
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
  if (isAsleep(source)) return;
  for (const t of source.traits) {
    if (!isActive(t) || t.type !== hookAsTrait(hook) || !t.pairWith) continue;
    if (TRAITS[t.type].onPartnerFed !== hook) continue;
    const key = `${hook}:${t.cardId}`;
    if (firedPairs.has(key)) continue;
    const other = findAnimal(state, t.pairWith);
    if (!other || other.hibernating || isAsleep(other)) continue;
    if (hook === "communication") {
      if (bankOf(state, source.zoneId) <= 0) continue;
      if (!canReceiveFood(state, other)) continue;
      firedPairs.add(key);
      takeFromBank(state, source.zoneId);
      giveFood(state, other, 1, "red", { triggerCoop: true, triggerComm: true });
      ev(state, { kind: "foodFromBank", animalId: other.id, playerId: ownerOf(state, other.id).id, via: "communication" });
      const op = ownerOf(state, other.id);
      log(state, `Взаимодействие: ${op.name} берёт еду из базы. База: ${bankOf(state, source.zoneId)}.`, "log.commTakeBank", { name: op.name, bank: bankOf(state, source.zoneId) });
    } else {
      if (!canReceiveFood(state, other) && emptyFatSlots(other) === 0) continue;
      firedPairs.add(key);
      giveFood(state, other, 1, "blue", { triggerCoop: true, triggerComm: false });
      ev(state, { kind: "blueFood", animalId: other.id, reason: "cooperation" });
      const op = ownerOf(state, other.id);
      log(state, `Сотрудничество: ${op.name} получает 1 синюю фишку.`, "log.coopBlue", { name: op.name });
    }
  }
}

function hookAsTrait(hook: NonNullable<TraitDef["onPartnerFed"]>): TraitId {
  return hook === "communication" ? "communication" : "cooperation";
}

function triggerScavenger(state: GameState, hunterOwnerId: number, excludeAnimalId?: string) {
  const n = state.players.length;
  for (let k = 0; k < n; k++) {
    const p = state.players[(hunterOwnerId + k) % n]!;
    for (const a of p.animals) {
      if (a.id === excludeAnimalId) continue;
      const hasScav = a.traits.some((t) => t.type === "scavenger" && isActive(t)) && !isAsleep(a);
      if (!hasScav) continue;
      if (a.hibernating) continue;
      if (isFed(a) && emptyFatSlots(a) === 0) continue;
      if (!canReceiveFood(state, a) && !isFed(a)) continue;
      giveFood(state, a, 1, "blue");
      ev(state, { kind: "blueFood", animalId: a.id, reason: "scavenger" });
      log(state, `Падальщик ${p.name} получает 1 синюю фишку.`, "log.scavengerBlue", { name: p.name }, "good");
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
  if (state.pendingMigration) return [...legalRemoraActions(state), { type: "feedFinishMigration" }];
  const p = player(state, playerId);
  const actions: GameAction[] = [];

  // «Трава и грибы»: ход бешенства — только обязательная атака бешеного
  // животного. Завершение остаётся страховкой лишь при отсутствии жертвы.
  if (state.rageTurn) {
    const mad = findAnimal(state, state.rageTurn.animalId);
    if (mad && canRageAttackWith(mad)) {
      for (const prey of allAnimals(state)) {
        if (canRageAttack(state, mad, prey)) {
          actions.push({ type: "feedHunt", carnivoreId: mad.id, preyId: prey.id });
        }
      }
    }
    if (!actions.length) actions.push({ type: "feedEndTurn" });
    return actions;
  }

  actions.push(...legalRecombinations(state, playerId));
  const used = state.turnUse;
  const cont = state.modules.continents;
  const plants = state.modules.plants ? (state.plants ?? []) : [];
  const flora = state.modules.fungi ? (state.flora ?? []) : [];
  // Территория хода: если ход ещё не привязан — доступны все с фишками.
  const turnTerritory = state.turnTerritory;
  const zoneUnlocked = (zone: TerritoryId | undefined) =>
    !cont || turnTerritory === undefined || turnTerritory === (zone ?? "laurasia");

  for (const a of p.animals) {
    if (cont && used.migrated) break; // ход миграции — ничего кроме переезда
    const zone = a.zoneId ?? "laurasia";
    const territoryUnlocked = zoneUnlocked(zone);
    // «Растения» + «Континенты»: банк остаётся только в Океане.
    const bankZone = cont ? (plants.length ? zone === "ocean" : true) : !plants.length;
    const bankOk = bankZone && (cont ? (state.territoryFood?.[zone] ?? 0) > 0 : state.foodBank > 0);
    // Еда берётся только из базы своей территории; выбор территории фиксируется первым взятием.
    // Убежище занимает ход вместо еды или атаки — после него еда недоступна.
    // «Облигатный хищник» кормится только добычей с охоты.
    if (bankOk && territoryUnlocked && !used.foodTaken && !used.combatUsed && !used.sheltered && canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore")) {
      actions.push({ type: "feedTake", animalId: a.id });
    }
    // «Растения»: еда — с растений своего континента (или любых без «Континентов»).
    if (
      state.modules.plants &&
      !used.foodTaken &&
      !used.combatUsed &&
      !used.sheltered &&
      canReceiveFood(state, a) &&
      !hasTrait(a, "obligateCarnivore") &&
      !(cont && zone === "ocean")
    ) {
      for (const pl of plants) {
        if (!zoneUnlocked(pl.zoneId)) continue;
        if (canFeedOnPlant(state, a, pl)) {
          actions.push({ type: "feedTakePlant", animalId: a.id, plantId: pl.id });
        }
      }
    }
    // «Трава и грибы»: еда — с любой карты флоры своей территории; запретов
    // нет (даже хищники и водные едят с трав и грибов).
    if (
      state.modules.fungi &&
      !used.foodTaken &&
      !used.combatUsed &&
      !used.sheltered &&
      !used.migrated &&
      canReceiveFood(state, a) &&
      !hasTrait(a, "obligateCarnivore") &&
      !(cont && zone === "ocean")
    ) {
      for (const f of flora) {
        if (!canFeedOnFlora(state, a, f)) continue;
        if (!zoneUnlocked(f.zoneId)) continue;
        actions.push({ type: "feedTakeFlora", animalId: a.id, floraId: f.id });
      }
    }
    // «Растения»: убежище — вместо еды или атаки, с любого растения своей территории.
    if (state.modules.plants && !used.foodTaken && !used.combatUsed && !used.migrated && !used.sheltered) {
      for (const pl of plants) {
        if (!zoneUnlocked(pl.zoneId)) continue;
        if (canTakeShelterFrom(state, a, pl)) {
          actions.push({ type: "feedShelter", animalId: a.id, plantId: pl.id });
        }
      }
    }
    // Сытый хищник не охотится — даже ради жирового запаса; парализованный тоже.
    // Убежище занимает ход вместо еды или атаки. Не чаще одного раза в год
    // (huntedYear) и не более двух атак за один ход (used.carnivores).
    if (
      canHuntWith(state, a) &&
      !used.carnivores.includes(a.id) &&
      a.huntedYear !== state.year &&
      used.carnivores.length < HUNTS_PER_TURN &&
      !used.foodTaken &&
      !used.sheltered
    ) {
      for (const prey of allAnimals(state)) {
        if (canAttack(state, a, prey)) {
          actions.push({ type: "feedHunt", carnivoreId: a.id, preyId: prey.id });
        }
      }
    }
    if (hasTrait(a, "piracy") && !isFed(a) && !a.hibernating && !used.pirates.includes(a.id) && !used.foodTaken && !used.sheltered && !isParalyzed(state, a.id) && !hasMark(a, "pacifism") && !hasTrait(a, "obligateCarnivore")) {
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
      !a.traits.some(t => t.type === "hibernation" && t.hibernationUsedYear !== undefined && t.hibernationUsedYear >= state.year - 1) &&
      !state.lastYear &&
      !a.hibernating &&
      !isFed(a) &&
      // Спячка — одна на ход, независимо от числа спящих животных.
      (used.hibernated ?? []).length === 0
    ) {
      actions.push({ type: "feedHibernate", animalId: a.id });
    }
    if (a.fatTokens > 0 && hasTrait(a, "fatTissue") && !a.hibernating && !isFed(a) && !isAsleep(a)) {
      const need = Math.max(1, speciesNeed(a) - a.food);
      actions.push({ type: "feedConvertFat", animalId: a.id, amount: Math.min(a.fatTokens, need) });
    }
    // Топтун совместим со взятием еды; топчет по растению (или банку Океана),
    // раз за ход. После убежища топтать уже нечего — ход потрачен.
    if (!cont && !plants.length && state.foodBank > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) {
      actions.push({ type: "feedGraze", animalId: a.id });
    }
    if (cont && (state.territoryFood?.[zone] ?? 0) > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) {
      if (turnTerritory === undefined || turnTerritory === zone) {
        actions.push({ type: "feedGraze", animalId: a.id });
      }
    }
    if (state.modules.plants && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) {
      for (const pl of plants) {
        if (pl.food <= 0) continue;
        if (!zoneUnlocked(pl.zoneId)) continue;
        if (cont && (pl.zoneId ?? "laurasia") !== zone) continue;
        actions.push({ type: "feedGraze", animalId: a.id, plantId: pl.id });
      }
    }
    // «Трава и грибы»: топтун уничтожает фишку на карте флоры — по правилам
    // дополнения топчет ту же карту, с которой ел (здесь — любую своей территории).
    if (state.modules.fungi && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) {
      for (const f of flora) {
        if (f.food <= 0) continue;
        if (!canFeedOnFlora(state, a, f)) continue;
        if (!zoneUnlocked(f.zoneId)) continue;
        actions.push({ type: "feedGraze", animalId: a.id, floraId: f.id });
      }
    }
    // Миграция: отдельный ход — только переезд и прилипалы.
    if (cont && canMigrate(state, a) && migrationTurnAvailable(state)) {
      const targets = migrationTargets(state, a);
      for (const to of targets) {
        actions.push({ type: "feedMigrate", moves: [{ animalId: a.id, to }] });
      }
    }
  }

  if (state.modules.plants) {
    // Хищное растение: раз за фазу питания любой игрок может направить его
    // на жертву вместо еды, убежища или атаки хищника.
    if (!used.foodTaken && !used.combatUsed && !used.migrated && !used.sheltered) {
      for (const pl of plants) {
        if (pl.kind !== "carnivorous" || pl.attackedThisYear) continue;
        if (!zoneUnlocked(pl.zoneId)) continue;
        for (const prey of allAnimals(state)) {
          // Правила, с.9: целью может быть любое животное, включая своё.
          if (canPlantAttackTarget(state, pl, prey)) {
            actions.push({ type: "feedPlantAttack", plantId: pl.id, preyId: prey.id });
          }
        }
      }
    }
    // Растение-паразит: перекинуть фишку с хозяина (не последнюю).
    if (!used.foodTaken && !used.combatUsed && !used.migrated && !used.sheltered) {
      for (const par of plants) {
        if (par.kind !== "parasite" || !par.hostId) continue;
        const host = findPlant(state, par.hostId);
        // Золотое правило: паразит не превышает свой максимум фишек.
        if (!host || host.food <= 1 || par.food >= PLANTS[par.kind].maxFood) continue;
        if (!zoneUnlocked(host.zoneId)) continue;
        actions.push({ type: "feedParasitize", hostId: host.id, parasiteId: par.id });
      }
    }
  }

  actions.push({ type: "feedEndTurn" });
  // «Растения»: пасовать нельзя, пока хоть одно животное способно получить
  // фишку еды или убежища (официальное правило дополнения).
  if (!state.modules.plants || !canStillFeedOrShelter(state, playerId)) {
    actions.push({ type: "feedSkip" });
  }
  return actions;
}

/**
 * «Растения»: есть ли у игрока животное, способное прямо сейчас получить
 * фишку еды или убежища (с чистым ходом — ограничения этого хода не важны).
 */
function canStillFeedOrShelter(state: GameState, playerId: number): boolean {
  const p = player(state, playerId);
  const plants = state.plants ?? [];
  const flora = state.flora ?? [];
  const cont = state.modules.continents;
  for (const a of p.animals) {
    if (a.hibernating) continue;
    if (cont && (a.zoneId ?? "laurasia") === "ocean") {
      if ((state.territoryFood?.ocean ?? 0) > 0 && canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore")) return true;
      continue;
    }
    // «Облигатный хищник» не кормится с растений и флоры.
    if (canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore")) {
      if (plants.some((pl) => canFeedOnPlant(state, a, pl))) return true;
      if (flora.some((f) => canFeedOnFlora(state, a, f))) return true;
    }
    if (!a.sheltered && plants.some((pl) => canTakeShelterFrom(state, a, pl))) return true;
  }
  return false;
}

type RecombineAction = Extract<GameAction, { type: "feedRecombine" }>;

/** Card p.1: one mutual nonpairwise exchange per pair per year, in own feeding. */
function legalRecombinations(state: GameState, playerId: number): RecombineAction[] {
  if (!state.modules.continents || state.phase !== "feeding" || state.pendingAttack ||
      state.rageTurn || state.currentPlayerId !== playerId || state.turnUse.migrated) return [];
  const out: RecombineAction[] = [];
  const seen = new Set<string>();
  for (const a of player(state, playerId).animals) {
    if (!hasTrait(a, "recombination") || isParalyzed(state, a.id)) continue;
    if (state.turnTerritory !== undefined && state.turnTerritory !== (a.zoneId ?? "laurasia")) continue;
    for (const pair of a.traits) {
      if (pair.type !== "recombination" || !isActive(pair) || !pair.pairWith || seen.has(pair.cardId)) continue;
      seen.add(pair.cardId);
      const b = findAnimal(state, pair.pairWith);
      if (!b || b.ownerId !== playerId || !hasTrait(b, "recombination") || isParalyzed(state, b.id)) continue;
      const reciprocal = b.traits.find(t => t.cardId === pair.cardId && t.pairWith === a.id && isActive(t));
      if (!reciprocal || pair.recombinedYear === state.year || reciprocal.recombinedYear === state.year) continue;
      if ((a.zoneId ?? "laurasia") !== (b.zoneId ?? "laurasia")) continue;
      for (const sent of a.traits.filter(exchangeable)) {
        for (const received of b.traits.filter(exchangeable)) {
          const action: RecombineAction = { type: "feedRecombine", giverId: a.id, takerId: b.id,
            traitId: sent.id, otherTraitId: received.id };
          if (losesSwimming(a, sent, received) || losesSwimming(b, received, sent)) {
            out.push({ ...action, to: "laurasia" }, { ...action, to: "gondwana" });
          } else out.push(action);
        }
      }
    }
  }
  return out;
}

function exchangeable(t: TraitInstance): boolean {
  return !TRAITS[t.type].isPair && !t.pairWith && !t.hidden && !t.paralyzed;
}

function losesSwimming(a: Animal, outgoing: TraitInstance, incoming: TraitInstance): boolean {
  return a.zoneId === "ocean" && outgoing.type === "swimming" && isActive(outgoing) &&
    !(incoming.type === "swimming" && !incoming.disabled) &&
    !a.traits.some(t => t.id !== outgoing.id && t.type === "swimming" && isActive(t));
}

function feedRecombine(state: GameState, action: RecombineAction) {
  const valid = legalRecombinations(state, state.currentPlayerId).some(a =>
    a.giverId === action.giverId && a.takerId === action.takerId && a.traitId === action.traitId &&
    a.otherTraitId === action.otherTraitId && a.to === action.to);
  if (!valid) return;
  const a = mustFind(state, action.giverId);
  const b = mustFind(state, action.takerId);
  const sent = a.traits.find(t => t.id === action.traitId)!;
  const received = b.traits.find(t => t.id === action.otherTraitId)!;
  const aAshore = losesSwimming(a, sent, received);
  const bAshore = losesSwimming(b, received, sent);
  for (const host of [a, b]) {
    for (const pair of host.traits) {
      if (pair.type === "recombination" && pair.pairWith === (host === a ? b.id : a.id)) pair.recombinedYear = state.year;
    }
  }
  // Turn-scoped use stays with the transmitted effect as well as its original animal.
  const carryUse = (from: Animal, to: Animal, t: TraitInstance) => {
    const key = t.type === "piracy" ? "pirates" : t.type === "carnivore" ? "carnivores" :
      t.type === "grazing" ? "grazers" : undefined;
    if (key && state.turnUse[key].includes(from.id) && !state.turnUse[key].includes(to.id)) state.turnUse[key].push(to.id);
    if (t.type === "migration" && state.migratedThisPhase?.includes(from.id) && !state.migratedThisPhase.includes(to.id)) state.migratedThisPhase.push(to.id);
    if (t.type === "hibernation" && (from.hibernating || from.hibernatedLastYear)) {
      t.hibernationUsedYear = Math.max(t.hibernationUsedYear ?? -1,
        from.hibernating ? state.year : state.year - 1);
    }
  };
  carryUse(a, b, sent);
  carryUse(b, a, received);
  a.traits = a.traits.filter(t => t.id !== sent.id);
  b.traits = b.traits.filter(t => t.id !== received.id);
  const receive = (host: Animal, t: TraitInstance) => {
    if (!TRAITS[t.type].stackable && host.traits.some(x => x.type === t.type)) {
      ownerOf(state, host.id).discardCount++;
      return;
    }
    // Neoplasia's suppression belongs to its old animal, not the moved card.
    delete t.disabled;
    if (t.type === "neoplasia") host.traits.unshift(t);
    else host.traits.push(t);
  };
  receive(a, received);
  receive(b, sent);
  a.neoplasia = a.traits.find(t => t.type === "neoplasia");
  b.neoplasia = b.traits.find(t => t.type === "neoplasia");
  if (aAshore) a.zoneId = action.to!;
  if (bAshore) b.zoneId = action.to!;
  // Only newly gained swimming moves a continent animal into the ocean.
  if (received.type === "swimming" && hasTrait(a, "swimming") && sent.type !== "swimming") a.zoneId = "ocean";
  if (sent.type === "swimming" && hasTrait(b, "swimming") && received.type !== "swimming") b.zoneId = "ocean";
  dropCrossTerritoryPairs(state);
  spendTurn(state, state.currentPlayerId);
  state.turnTerritory ??= aAshore ? b.zoneId : a.zoneId;
  log(state, "Рекомбинация: животные обмениваются свойствами.", "log.recombine");
  maybeEndTurn(state);
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

export type FeedActionKind =
  | "feedTake"
  | "feedHunt"
  | "feedPirate"
  | "feedHibernate"
  | "feedShelter"
  | "feedGraze"
  | "feedConvertFat"
  | "feedMigrate"
  | "feedRemora"
  | "feedFinishMigration"
  | "feedRecombine"
  | "feedEndTurn"
  | "feedSkip";

/**
 * Причина недоступности действия питания: русский текст (его показывают
 * старые клиенты и проверяют тесты) плюс ключ словаря для локализации.
 */
export interface FeedBlockInfo {
  text: string;
  key: TKey;
}

/**
 * Почему конкретное действие питания недоступно игроку; null — доступно или
 * причина неизвестна (не ход игрока, ждём защиту и т.п.). Повторяет гейты
 * legalFeedActions и защитные проверки мутаторов: UI показывает причины на
 * заблокированных кнопках. Локализация (волна 8): `feedBlockReason` возвращает
 * прежний русский текст, а `feedBlockReasonInfo` — ключ словаря; клиент при
 * lang=en рендерит по ключу.
 */
export function feedBlockReason(
  state: GameState,
  playerId: number,
  kind: FeedActionKind,
): string | null {
  return feedBlockOf(state, playerId, kind)?.text ?? null;
}

/** То же, но машиночитаемо: ключ словаря вместо готового текста. */
export function feedBlockReasonInfo(
  state: GameState,
  playerId: number,
  kind: FeedActionKind,
): { key: TKey } | null {
  const r = feedBlockOf(state, playerId, kind);
  return r ? { key: r.key } : null;
}

function feedBlockOf(
  state: GameState,
  playerId: number,
  kind: FeedActionKind,
): FeedBlockInfo | null {
  if (state.phase !== "feeding" || state.pendingAttack || state.currentPlayerId !== playerId) {
    return null;
  }
  if (legalFeedActions(state, playerId).some((a) => a.type === kind)) return null;
  const p = state.players.find((x) => x.id === playerId);
  if (!p) return null;
  const used = state.turnUse;
  const hibernated = used.hibernated ?? [];
  const cont = state.modules.continents;
  const plants = state.modules.plants ? (state.plants ?? []) : [];
  const flora = state.modules.fungi ? (state.flora ?? []) : [];
  const block = (text: string, key: TKey): FeedBlockInfo => ({ text, key });

  // Ход бешенства: доступна только обязательная атака и «Закончить ход».
  if (state.rageTurn) {
    if (kind === "feedHunt") return block("Сейчас ход бешенства: атаковать может только бешеное животное.", "feedBlock.rageHuntOnly");
    if (kind === "feedEndTurn") return null;
    return block("Сейчас ход бешенства — другие действия недоступны.", "feedBlock.rageOther");
  }

  /** Территория животного (вне «Континентов» зон нет). */
  const zoneOf = (a: Animal): TerritoryId => a.zoneId ?? "laurasia";
  const zoneUnlocked = (zone: TerritoryId) =>
    !cont || state.turnTerritory === undefined || state.turnTerritory === zone;
  /** Кормовая база доступна животному этой территории. */
  const bankOk = (zone: TerritoryId): boolean => {
    if (!zoneUnlocked(zone)) return false;
    if (!cont) return !plants.length && state.foodBank > 0;
    // «Растения» + «Континенты»: банк остаётся только в Океане.
    if (plants.length && zone !== "ocean") return false;
    return (state.territoryFood?.[zone] ?? 0) > 0;
  };

  switch (kind) {
    case "feedEndTurn":
      return null;

    case "feedRecombine": {
      if (!cont) return block("Модуль «Континенты» не включён.", "feedBlock.continentsOff");
      if (used.migrated) return block("Ход потрачен на миграцию.", "feedBlock.migrated");
      const hasPair = p.animals.some(
        (a) =>
          !a.hibernating &&
          hasTrait(a, "recombination") &&
          (legalRecombinations(state, playerId).length > 0),
      );
      if (!hasPair) {
        return block("Нет пары рекомбинации с доступным обменом.", "feedBlock.noRecombination");
      }
      return block("Обмен уже выполнен в этом году.", "feedBlock.recombined");
    }

    case "feedTake": {
      if (used.foodTaken) return block("В этот ход уже брали еду из кормовой базы.", "feedBlock.tookFood");
      if (used.combatUsed) return block("После охоты или пиратства красные фишки из базы брать нельзя.", "feedBlock.afterCombat");
      if (used.sheltered) return block("Убежище занимает ход — еду брать нельзя.", "feedBlock.shelterBlocksFood");
      if (used.migrated) return block("Ход потрачен на миграцию — еду брать нельзя.", "feedBlock.migratedFood");
      if (!p.animals.length) return block("У игрока нет животных.", "feedBlock.noAnimals");
      if (plants.length && !cont) return block("В этот год еда на растениях — кормовая база не действует.", "feedBlock.plantsFoodYear");
      const hungry = p.animals.filter(
        (a) => canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore"),
      );
      if (!hungry.length) {
        return p.animals.every((a) => hasTrait(a, "obligateCarnivore"))
          ? block("Облигатный хищник кормится только добычей.", "feedBlock.obligateOnly")
          : block("Все животные накормлены.", "feedBlock.allFed");
      }
      if (!hungry.some((a) => bankOk(zoneOf(a)))) return block("В кормовой базе этой территории нет еды.", "feedBlock.noBankFood");
      return null;
    }

    case "feedHunt": {
      if (used.foodTaken) return block("После взятия еды хищник не охотится.", "feedBlock.afterFoodNoHunt");
      if (used.sheltered) return block("Убежище занимает ход — охотиться нельзя.", "feedBlock.shelterBlocksHunt");
      if (cont && used.migrated) return block("Ход потрачен на миграцию — охотиться нельзя.", "feedBlock.migratedHunt");
      const hunters = p.animals.filter((a) => canHuntWith(state, a));
      if (!hunters.length) {
        return p.animals.some(isCarnivoreLike)
          ? block("Хищники накормлены или не могут охотиться.", "feedBlock.huntersFed")
          : block("Нет голодного хищника.", "feedBlock.noHunter");
      }
      const ready = hunters.filter(
        (a) => !used.carnivores.includes(a.id) && a.huntedYear !== state.year,
      );
      if (!ready.length) {
        return hunters.length
          ? block("Все хищники уже охотились в этом году.", "feedBlock.huntersUsed")
          : p.animals.some(isCarnivoreLike)
            ? block("Хищники накормлены или не могут охотиться.", "feedBlock.huntersFed")
            : block("Нет голодного хищника.", "feedBlock.noHunter");
      }
      if (used.carnivores.length >= HUNTS_PER_TURN) {
        return block("За один ход атакуют не более двух хищников.", "feedBlock.huntLimit");
      }
      const prey = allAnimals(state).some((t) => ready.some((c) => canAttack(state, c, t)));
      if (!prey) return block("Нет добычи, доступной для атаки.", "feedBlock.noPrey");
      return null;
    }

    case "feedPirate": {
      if (used.foodTaken) return block("После взятия еды пират не ворует.", "feedBlock.afterFoodNoPiracy");
      if (used.sheltered) return block("Убежище занимает ход — пиратство недоступно.", "feedBlock.shelterBlocksPiracy");
      if (cont && used.migrated) return block("Ход потрачен на миграцию.", "feedBlock.migrated");
      const pirates = p.animals.filter(
        (a) =>
          hasTrait(a, "piracy") &&
          !a.hibernating &&
          !isParalyzed(state, a.id) &&
          !hasMark(a, "pacifism") &&
          !hasTrait(a, "obligateCarnivore"),
      );
      if (!pirates.length) return block("Нет животного с пиратством, которое может забрать еду.", "feedBlock.noPirate");
      const hungry = pirates.filter((a) => !isFed(a));
      if (!hungry.length) return block("Пираты накормлены — воровать нечего.", "feedBlock.piratesFed");
      if (hungry.every((a) => used.pirates.includes(a.id))) {
        return block("Пиратство в этот ход уже использовано.", "feedBlock.piracyUsed");
      }
      const hasTarget = hungry.some(
        (a) =>
          !used.pirates.includes(a.id) &&
          allAnimals(state).some(
            (t) =>
              t.id !== a.id &&
              !isFed(t) &&
              t.food > 0 &&
              (!cont || zoneOf(t) === zoneOf(a)),
          ),
      );
      if (!hasTarget) return block("Нет животного с едой, у которого можно украсть.", "feedBlock.noPiracyTarget");
      return null;
    }

    case "feedHibernate": {
      if (hibernated.length) return block("Спячка в этот ход уже использована.", "feedBlock.hibernationUsed");
      if (state.lastYear) return block("В последний год спячка недоступна.", "feedBlock.hibernationLastYear");
      const sleepers = p.animals.filter((a) => hasTrait(a, "hibernation"));
      if (!sleepers.length) return block("Нет животного со спячкой.", "feedBlock.noSleeper");
      if (sleepers.every((a) => a.hibernatedLastYear)) return block("Животное уже спало в прошлом году.", "feedBlock.sleptLastYear");
      if (sleepers.every((a) => a.hibernating || isFed(a))) return block("Все животные накормлены.", "feedBlock.allFed");
      return null;
    }

    case "feedShelter": {
      if (!state.modules.plants) return block("Модуль «Растения» не включён.", "feedBlock.plantsOff");
      if (used.foodTaken) return block("Ход уже занят едой — убежище недоступно.", "feedBlock.afterFoodNoShelter");
      if (used.combatUsed) return block("После боя убежище недоступно.", "feedBlock.afterCombatNoShelter");
      if (used.sheltered) return block("Убежище в этот ход уже занято.", "feedBlock.shelterUsed");
      if (used.migrated) return block("Ход потрачен на миграцию.", "feedBlock.migrated");
      const free = plants.filter((pl) => pl.shelters > 0 && zoneUnlocked(pl.zoneId ?? "gondwana"));
      if (!free.length) return block("На растениях не осталось свободных убежищ.", "feedBlock.noShelters");
      const who = p.animals.filter((a) => !a.hibernating && !a.sheltered);
      if (!who.length) return block("Нет животного, которому нужно убежище.", "feedBlock.noShelterNeed");
      const canHide = who.some((a) => free.some((pl) => canTakeShelterFrom(state, a, pl)));
      if (!canHide) return block("Убежища остались в другой территории.", "feedBlock.sheltersOtherZone");
      return null;
    }

    case "feedGraze": {
      if (used.sheltered) return block("Убежище занимает ход — топтать нельзя.", "feedBlock.shelterBlocksGraze");
      const grazers = p.animals.filter((a) => hasTrait(a, "grazing"));
      if (!grazers.length) return block("Нет животного с топтанием.", "feedBlock.noGrazer");
      const hungry = grazers.filter((a) => !isFed(a));
      if (!hungry.length) return block("Все топтуны накормлены.", "feedBlock.grazersFed");
      if (hungry.every((a) => used.grazers.includes(a.id))) return block("Топтуны в этот ход уже топтали.", "feedBlock.grazersUsed");
      const food = hungry.some((a) => {
        const zone = zoneOf(a);
        if (!zoneUnlocked(zone)) return false;
        if (cont) return (state.territoryFood?.[zone] ?? 0) > 0;
        if (plants.length) return false; // еда — на растениях, ниже проверка по ним
        return state.foodBank > 0;
      });
      const plantFood = plants.some((pl) => pl.food > 0 && zoneUnlocked(pl.zoneId ?? "gondwana"));
      const floraFood = flora.some(
        (f) => f.food > 0 && zoneUnlocked(f.zoneId ?? "gondwana"),
      );
      if (!food && !plantFood && !floraFood) return block("Нет еды, которую можно вытоптать.", "feedBlock.noGrazeFood");
      return null;
    }

    case "feedConvertFat": {
      const fat = p.animals.filter((a) => a.fatTokens > 0);
      if (!fat.length) return block("Нет запасов жира.", "feedBlock.noFat");
      if (!fat.some((a) => !a.hibernating && !isFed(a))) {
        return block("Конвертировать жир может только голодное животное.", "feedBlock.fatHungryOnly");
      }
      return null;
    }

    case "feedMigrate": {
      if (!cont) return block("Миграция доступна только с дополнением «Континенты».", "feedBlock.migrateOff");
      if (used.migrated) return block("Миграция в этот ход уже объявлена.", "feedBlock.migrateUsed");
      const ready = p.animals.filter((a) => canMigrate(state, a));
      if (!ready.length) return block("Нет животного, готового мигрировать.", "feedBlock.noMigrator");
      if (!ready.some((a) => migrationTargets(state, a).length > 0)) {
        return block("Этому животному некуда мигрировать.", "feedBlock.noMigrationTarget");
      }
      return null;
    }

    case "feedSkip": {
      if (state.modules.plants && canStillFeedOrShelter(state, playerId)) {
        return block("Пас недоступен: есть животные, способные получить еду или убежище.", "feedBlock.skipBlocked");
      }
      return null;
    }

    default:
      return null;
  }
}

function defenseOptions(
  state: GameState,
  animal: Animal,
  attack: PendingAttack,
): Array<"running" | "mimicry" | "tailLoss"> {
  // «Усыпленное» лекарственным растением и «спящее» (метка «Сон») животное
  // не защищается свойствами; «Дурь» гасит одно свойство атаки.
  if (animal.sedated || isAsleep(animal)) return [];
  const opts: Array<"running" | "mimicry" | "tailLoss"> = [];
  for (const t of animal.traits) {
    if (!isActive(t)) continue;
    if (attack.ignoredTraitId && t.id === attack.ignoredTraitId) continue;
    const kind = TRAITS[t.type].defense;
    if (!kind || attack.usedDefenses.includes(kind)) continue;
    if (kind === "mimicry") {
      if (attack.mimicryChain.includes(animal.id)) continue;
      // Мимикрия доступна, только если есть валидная цель: иначе защита
      // показывала бы модалку с единственной кнопкой «Не защищаться».
      if (mimicryTargets(state, attack, animal).length === 0) continue;
    }
    if (!opts.includes(kind)) opts.push(kind);
  }
  return opts;
}

function mimicryTargets(state: GameState, attack: PendingAttack, prey: Animal): Animal[] {
  const owner = ownerOf(state, prey.id);
  // Атака хищного растения перенаправляется по правилам хищника без свойств.
  if (attack.plantId) {
    const plant = mustFindPlant(state, attack.plantId);
    return owner.animals.filter((a) => {
      if (a.id === prey.id) return false;
      if (attack.mimicryChain.includes(a.id)) return false;
      return canPlantAttackTarget(state, plant, a);
    });
  }
  const carnivore = mustFind(state, attack.carnivoreId);
  const attackable = (a: Animal) =>
    attack.rage ? canRageAttack(state, carnivore, a) : canAttack(state, carnivore, a);
  return owner.animals.filter((a) => {
    if (a.id === prey.id) return false;
    if (attack.mimicryChain.includes(a.id)) return false;
    return attackable(a);
  });
}

function plantCounterDefenses(prey: Animal): TraitInstance[] {
  if (prey.sedated || isAsleep(prey)) return [];
  return prey.traits.filter((t) => isActive(t) && (
    TRAITS[t.type].defense || TRAITS[t.type].protection ||
    t.type === "swimming" || t.type === "herding" ||
    (t.type === "symbiosis" && t.pairRole === "b")
  ));
}

export function legalDefenseActions(state: GameState, playerId: number): GameAction[] {
  const atk = state.pendingAttack;
  if (!atk || atk.waitingFor !== playerId) return [];
  const prey = findAnimal(state, atk.preyId);
  if (!prey) return [{ type: "chooseDefense", kind: "none" }];
  if (atk.choosingPlantDefense) {
    return plantCounterDefenses(prey).map((t) => ({ type: "chooseDefense", kind: "ignore", ignoredTraitId: t.id }));
  }
  const actions: GameAction[] = [{ type: "chooseDefense", kind: "none" }];
  const opts = defenseOptions(state, prey, atk);
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

/**
 * Успешная атака хищного растения: животное гибнет, на растение ложатся
 * фишки (2 за добычу), ядовитая добыча обрекает растение в вымирание.
 * Падальщики получают свою фишку, regeneration оставляет свойства.
 */
function finishPlantKill(state: GameState, plant: Plant, prey: Animal, tokens: number) {
  const victim = ownerOf(state, prey.id);
  const poisoned = !prey.sedated && prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller);
  ev(state, { kind: "preyKilled", preyId: prey.id, carnivoreId: plant.id });
  log(
    state,
    `Хищное растение съедает животное ${victim.name} (${animalValue(prey)} очк.).`,
    "log.plantEats",
    { name: victim.name, value: animalValue(prey) },
    "hunt",
  );
  if (poisoned) {
    plant.doomed = true;
    log(state, `Добыча была ядовитой — растение погибнет в вымирание.`, "log.preyPoisonousPlant", undefined, "bad");
  }
  // «Случайные мутации»: вид с численностью теряет одно животное.
  if (state.modules.randomMutations && (prey.population ?? 1) > 1) {
    prey.population = (prey.population ?? 1) - 1;
    ev(state, { kind: "populationLost", animalId: prey.id, to: prey.population });
    log(state, `${victim.name}: вид теряет животное (осталось ${prey.population}).`, "log.lostAnimal", { name: victim.name, left: prey.population }, "bad");
    feedFungi(state);
    spreadFungalGrowth(state);
  } else if (hasTrait(prey, "regeneration")) {
    state.pendingRegeneration = [...(state.pendingRegeneration ?? []), regenSnapshotOf(prey, victim.id)];
    log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "log.regenerates", undefined, "good");
    const p0 = ownerOf(state, prey.id);
    p0.animals = p0.animals.filter((a) => a.id !== prey.id);
    p0.discardCount += 1;
  } else {
    discardAnimal(state, prey);
  }
  const max = PLANTS.carnivorous.maxFood;
  plant.food = Math.min(max, plant.food + tokens);
  // Падальщик кормится и от хищного растения (правило взаимодействия).
  triggerScavenger(state, state.currentPlayerId);
  const attack = state.pendingAttack;
  if (attack?.plantCounter && attack.plantRequesterId !== prey.id) {
    const requester = findAnimal(state, attack.plantRequesterId!);
    if (requester) givePlantFood(state, requester, plant);
  }
  state.pendingAttack = null;
  maybeEndTurn(state);
}

/**
 * Успешная атака хищника. «Трава и грибы»: хищник переносит на себя все
 * метки добычи; бешеное животное убивает, но не ест (без фишек, яда и меток);
 * «Насекомоядное» за животное без свойств получает 1 синюю вместо двух.
 */
function finishHuntSuccess(
  state: GameState,
  carnivore: Animal,
  prey: Animal,
  foodGain: number,
  opts?: { rage?: boolean },
) {
  const hunter = ownerOf(state, carnivore.id);
  const victim = ownerOf(state, prey.id);
  const preyMarks = [...(prey.marks ?? [])];
  // «Насекомоядное»: добыча без свойств (в том числе со меткой «Сон»).
  const propertyless = prey.traits.length === 0 || isAsleep(prey);
  const insectivore = opts?.rage ? false : hasTrait(carnivore, "insectivore") && propertyless;
  const gain = insectivore ? 1 : foodGain;
  const poisoned =
    !opts?.rage && !isAsleep(prey) && prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller) && gain === 2;
  ev(state, { kind: "preyKilled", preyId: prey.id, carnivoreId: carnivore.id });
  log(
    state,
    opts?.rage
      ? `Бешеное животное ${hunter.name} убивает животное ${victim.name} (${animalValue(prey)} очк.) — добычу не ест.`
      : `${hunter.name} охотится: ${victim.name} теряет животное (${animalValue(prey)} очк.).`,
    opts?.rage ? "log.rageKills" : "log.huntSuccess",
    { name: hunter.name, target: victim.name, value: animalValue(prey) },
    "hunt",
  );
  if (insectivore) {
    log(state, `Насекомоядное: добыча без свойств — 1 синяя фишка вместо двух.`, "log.insectivore", undefined, "good");
  }
  if (poisoned) {
    carnivore.poisoned = true;
    log(state, `Хищник ${hunter.name} отравлен и погибнет в вымирание.`, "log.hunterPoisoned", { name: hunter.name }, "bad");
  }
  // Стрекательные клетки: атакующий теряет все свойства до конца фазы питания
  // (по правилам «Травы и грибов» упоминания атак хищника — и атаки бешеных).
  paralyzeAttacker(state, carnivore, prey);
  // «Случайные мутации»: у вида есть численность — атака снимает одно
  // животное, вид остаётся жить (гибель кормит грибы, как обычно).
  if (state.modules.randomMutations && (prey.population ?? 1) > 1) {
    prey.population = (prey.population ?? 1) - 1;
    ev(state, { kind: "populationLost", animalId: prey.id, to: prey.population });
    log(state, `${victim.name}: вид теряет животное (осталось ${prey.population}).`, "log.lostAnimal", { name: victim.name, left: prey.population }, "bad");
    feedFungi(state);
    spreadFungalGrowth(state);
  } else if (hasTrait(prey, "regeneration")) {
    state.pendingRegeneration = [...(state.pendingRegeneration ?? []), regenSnapshotOf(prey, victim.id)];
    log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "log.regenerates", undefined, "good");
    // Животное снимается, но карты свойств НЕ идут в сброс: жгут только карту-туловище.
    const p0 = ownerOf(state, prey.id);
    p0.animals = p0.animals.filter((a) => a.id !== prey.id);
    p0.discardCount += 1;
    // Метки регенерировавшего возвращаются на стол.
    returnMarksToPool(state, prey);
  } else {
    discardAnimal(state, prey);
  }
  if (!opts?.rage) {
    giveFood(state, carnivore, hasTrait(carnivore, "obligateCarnivore") ? 1 : gain, "blue", { obligate: true });
    ev(state, { kind: "blueFood", animalId: carnivore.id, reason: "hunt" });
    // «Облигатный хищник»: удачная атака сразу делает его накормленным.
    if (gain > 0 && hasTrait(carnivore, "obligateCarnivore") && !carnivore.hibernating) {
      carnivore.receivedFoodThisYear = true;
      log(state, `${hunter.name}: облигатный хищник накормлен добычей.`, "log.obligateFed", { name: hunter.name }, "good");
    }
    // Хищник получает все метки добычи (кроме случая «Трын» у хищника).
    transferMarks(state, carnivore, preyMarks);
    if (gain === 2) {
      for (const def of Object.values(TRAITS)) {
        if (def.onAnyKill === "scavenger") {
          triggerScavenger(state, hunter.id);
          break;
        }
      }
    }
  } else {
    // Бешеное животное не получает фишку даже за собственное «Падальщик».
    triggerScavenger(state, hunter.id, carnivore.id);
  }
  // В мутациях ядовитая добыча убивает одну особь сразу, а не в вымирание.
  // Базовая игра по-прежнему использует отложенный флаг poisoned.
  if (poisoned && state.modules.randomMutations) {
    carnivore.poisoned = false;
    if ((carnivore.population ?? 1) > 1) {
      carnivore.population = (carnivore.population ?? 1) - 1;
      hunter.discardCount += 1;
      carnivore.food = Math.min(carnivore.food, speciesNeed(carnivore));
      carnivore.blueFood = Math.min(carnivore.blueFood, carnivore.food);
      ev(state, { kind: "populationLost", animalId: carnivore.id, to: carnivore.population });
      feedFungi(state);
      spreadFungalGrowth(state);
    } else {
      ev(state, { kind: "animalDied", animalId: carnivore.id, cause: "poison" });
      discardAnimal(state, carnivore);
    }
  }
  state.pendingAttack = null;
  if (opts?.rage) {
    // При любом исходе раунд бешенства заканчивается.
    advanceFeed(state);
  } else {
    maybeEndTurn(state);
  }
}

/**
 * Стрекательные клетки (PDF с.2): даже при неудачной атаке у хищника перестают
 * действовать ВСЕ свойства до конца фазы питания — он эквивалентен животному
 * без свойств (потребность 1, не охотится, не ворует, не мигрирует). Карты
 * свойств остаются на животном и не теряют очки из-за паралича.
 * state.paralyzed очищается в endFeeding, а trait.paralyzed удаляется
 * после определения погибающих от голода с базовой потребностью.
 * В океане хищник теряет и водоплавающее — вытеснен на континент; парные
 * свойства, разъехавшиеся с вытеснением, уходят в сброс.
 */
function paralyzeAttacker(state: GameState, carnivore: Animal, prey: Animal) {
  if (!hasTrait(prey, "nematocysts")) return;
  state.paralyzed = state.paralyzed ?? [];
  if (!state.paralyzed.includes(carnivore.id)) state.paralyzed.push(carnivore.id);
  for (const t of carnivore.traits) t.paralyzed = true;
  // В океане парализованный хищник теряет и водоплавающее — вытеснен на континент.
  if (state.modules.continents && carnivore.zoneId === "ocean") {
    oceanExpel(state, carnivore);
    // Перенос между территориями мог разъединить пары — карта пары в сброс.
    dropCrossTerritoryPairs(state);
    log(state, `Хищник парализован в океане — выброшен на континент.`, "log.paralyzedAshore", undefined, "bad");
  } else {
    log(state, `Хищник ${ownerOf(state, carnivore.id).name} парализован стрекательными клетками.`, "log.paralyzed", { name: ownerOf(state, carnivore.id).name }, "bad");
  }
  ev(state, { kind: "paralyzed", carnivoreId: carnivore.id });
}

/** Свойства остаются на месте съеденного животного до восстановления. */
function regenSnapshotOf(a: Animal, ownerId: number): RegenPending {
  return { ownerId, animalId: a.id, zoneId: a.zoneId, traits: a.traits.map((t) => ({ ...t })) };
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
  if (atk.plantId) {
    const plant = findPlant(state, atk.plantId);
    const prey = findAnimal(state, atk.preyId);
    if (!plant || !prey) {
      state.pendingAttack = null;
      return;
    }
    finishPlantKill(state, plant, prey, 2);
    return;
  }
  const carnivore = findAnimal(state, atk.carnivoreId);
  const prey = findAnimal(state, atk.preyId);
  if (!carnivore || !prey) {
    state.pendingAttack = null;
    return;
  }
  finishHuntSuccess(state, carnivore, prey, 2, atk.rage ? { rage: true } : undefined);
}

export function applyAction(state: GameState, action: GameAction): GameState {
  const next = clone(state);
  beginActionEffects();
  next.eventSeq += 1;
  next.lastEvents = [];
  if (next.pendingMigration && action.type !== "feedRemora" && action.type !== "feedFinishMigration") return next;
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
    case "devPlayPlantTrait":
      playPlantTrait(next, action.cardId, action.face, action.plantId);
      break;
    case "devPlayPlantPair":
      playPlantPair(next, action.cardId, action.face, action.a, action.b);
      break;
    case "devPass":
      passDev(next);
      break;
    case "devMutate":
      devMutate(next, action);
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
    case "continueGrowth":
      continueGrowth(next);
      break;
    case "feedTake":
      feedTake(next, action.animalId);
      break;
    case "feedTakePlant":
      feedTakePlant(next, action.animalId, action.plantId);
      break;
    case "feedTakeFlora":
      feedTakeFlora(next, action.animalId, action.floraId);
      break;
    case "feedShelter":
      feedShelter(next, action.animalId, action.plantId);
      break;
    case "feedHunt":
      feedHunt(next, action.carnivoreId, action.preyId);
      break;
    case "feedPlantAttack":
      feedPlantAttack(next, action.plantId, action.preyId);
      break;
    case "feedParasitize":
      feedParasitize(next, action.hostId, action.parasiteId);
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
      feedGraze(next, action.animalId, action.plantId, action.floraId);
      break;
    case "feedEndTurn":
      feedEndTurn(next);
      break;
    case "feedSkip":
      skipFeed(next);
      break;
    case "feedRecombine":
      feedRecombine(next, action);
      break;
    case "feedMigrate":
      feedMigrate(next, action.moves);
      break;
    case "feedRemora":
      feedRemora(next, action);
      break;
    case "feedFinishMigration":
      finishMigration(next);
      break;
    case "reorderAnimal":
      if (action.toZoneId) moveAnimalToZoneHuman(next, action.animalId, action.toZoneId);
      else reorderAnimal(next, action.animalId, action.beforeId);
      break;
    case "renameAnimal":
      renameOwnAnimal(next, action.animalId, action.name);
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
    no: nextAnimalNo(p),
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
    state.modules.continents ? "log.animalPlacedZone" : "log.animalPlaced",
    state.modules.continents ? { name: p.name, zone } : { name: p.name },
  );
  advanceDev(state);
}

function playTrait(state: GameState, cardId: string, face: number, animalId: string) {
  const p = player(state, state.currentPlayerId);
  const candidate = p.hand.find(c => c.id === cardId);
  const animal = mustFind(state, animalId);
  if (candidate?.faces[face] === "neoplasia" && animal.ownerId === p.id) return;
  const card = takeCard(p, cardId);
  const trait = faceOf(card, face);
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
    log(state, `${p.name}: ${TRAITS[trait].name} → животное ${targetOwner.name}.`, "log.traitToOpponent", { name: p.name, trait, target: targetOwner.name }, "bad");
  } else {
    log(state, `${p.name}: свойство ${TRAITS[trait].name}.`, "log.traitPlaced", { name: p.name, trait });
  }
  settleAfterTraitChange(state, animal);
  advanceDev(state);
}

/**
 * Цепочка пары от указанного животного наружу: сам зверь, затем его партнёр,
 * затем партнёр партнёра и так до конца. Звери из stopIds в обход не берутся.
 */
function pairChainFrom(p: Player, startId: string, stopIds?: ReadonlySet<string>): Animal[] {
  const byId = new Map(p.animals.map((x) => [x.id, x]));
  const seen = new Set(stopIds ?? []);
  const out: Animal[] = [];
  let id: string | undefined = startId;
  while (id && !seen.has(id)) {
    const cur = byId.get(id);
    if (!cur) break;
    out.push(cur);
    seen.add(id);
    id = cur.traits.find((t) => t.pairWith && !seen.has(t.pairWith))?.pairWith;
  }
  return out;
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
  // Заявку проверяем теми же правилами, что и список действий: лимит двух пар
  // и запрет кольца — иначе плашке пары негде лежать и раскладка ломается.
  if (pairCount(a) >= 2 || pairCount(b) >= 2) throw new Error("pair limit");
  if (samePairChain(state, a, b)) throw new Error("pair loop");
  a.traits.push(makeTrait(state, card, trait, { pairWith: b.id, pairRole: "a" }));
  b.traits.push(
    makeTrait(state, card, trait, { pairWith: a.id, pairRole: "b", playSeq: state.playSeq }),
  );
  ev(state, { kind: "traitPlaced", animalId: aId, type: trait, hidden: false });
  // Раскладка: партнёр встаёт в свободный конец цепочки (первая пара — слева,
  // вторая — справа), а его собственные пары переезжают вместе с ним.
  layoutPair(p, aId, bId);
  log(state, `${p.name} связывает двух животных: ${TRAITS[trait].name}.`, "log.pairPlaced", { name: p.name, trait });
  advanceDev(state);
}

/**
 * Раскладка пар: партнёр встаёт в свободный конец цепочки, чтобы плашка
 * пары лежала ровно между соседними животными. Первая пара животного —
 * слева от него, вторая — справа (B — A — C); собственная цепочка партнёра
 * переносится целиком, и её пары тоже остаются соседними.
 */
function layoutPair(p: Player, aId: string, bId: string) {
  const ai = p.animals.findIndex((x) => x.id === aId);
  if (ai < 0) return;
  const a = p.animals[ai]!;
  // Прежний партнёр: он занимает одну сторону, новая пара встаёт на другую.
  const oldPartner = a.traits.find((t) => t.pairWith && t.pairWith !== bId)?.pairWith;
  const oldIdx = oldPartner ? p.animals.findIndex((x) => x.id === oldPartner) : -1;
  const placeLeft = oldPartner === undefined || oldIdx > ai;
  // Цепочка партнёра без самого «a»: [b, его партнёр, …].
  const chainB = pairChainFrom(p, bId, new Set([aId]));
  if (chainB.length === 0) return;
  const moved = new Set(chainB.map((x) => x.id));
  const rest = p.animals.filter((x) => !moved.has(x.id));
  const at = rest.findIndex((x) => x.id === aId);
  if (at < 0) return;
  // Слева цепочка кладётся наоборот, чтобы b оказался соседом a.
  const inserted = placeLeft ? [...chainB].reverse() : chainB;
  rest.splice(placeLeft ? at : at + 1, 0, ...inserted);
  p.animals.splice(0, p.animals.length, ...rest);
}

function passDev(state: GameState) {
  const p = player(state, state.currentPlayerId);
  p.passedDev = true;
  ev(state, { kind: "passed", playerId: p.id });
  log(state, `${p.name} пасует.`, "log.passed", { name: p.name });
  advanceDev(state);
}

// ── «Случайные мутации»: развитие ────────────────────────────────────────────

/** Грань вскрытой карты: у двусторонних карт мутация выбирается случайно. */
function mutationFace(state: GameState, card: Card): TraitId {
  if (card.faces.length <= 1) return card.faces[0]!;
  return card.faces[Math.floor(nextRandom(state) * card.faces.length)]!;
}

/** Пустышка с тем же cardId — makeTrait читает только id карты. */
function cardShell(cardId: string, type: TraitId): Card {
  return { id: cardId, faces: [type] };
}

/** Новый вид из карты (рубашкой): в мутациях у вида всегда численность 1+. */
function spawnSpecies(state: GameState, p: Player, card: Card, zone?: TerritoryId): Animal {
  const animal: Animal = {
    id: nid(state, "a"),
    ownerId: p.id,
    cardId: card.id,
    no: nextAnimalNo(p),
    traits: [],
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: card.id.length * 17 + p.id * 13 + p.animals.length,
    population: 1,
    ...(state.modules.continents
      ? { zoneId: zone === "ocean" ? ("laurasia" as TerritoryId) : (zone ?? ("laurasia" as TerritoryId)) }
      : {}),
  };
  p.animals.push(animal);
  ev(state, { kind: "animalPlaced", animalId: animal.id, ownerId: p.id, zoneId: animal.zoneId });
  return animal;
}

/** Прикрепить свойство-мутацию (неоплазия кладётся под стек — как обычно). */
function attachMutationTrait(state: GameState, card: Card, trait: TraitId, animal: Animal) {
  if (trait === "neoplasia") {
    animal.traits.unshift(makeTrait(state, card, trait));
    animal.neoplasia = animal.traits[0];
  } else {
    animal.traits.push(makeTrait(state, card, trait));
  }
  ev(state, { kind: "traitPlaced", animalId: animal.id, type: trait, hidden: false });
  settleAfterTraitChange(state, animal);
}

/**
 * Свойство, не подошедшее ни одному виду, само становится новым видом:
 * карта ложится животным и несёт эту мутацию (если та legally ложится
 * на пустое животное; парные и свойства растений — просто животным).
 */
function fallbackNewSpecies(state: GameState, p: Player, card: Card, trait: TraitId, zone?: TerritoryId) {
  const def = TRAITS[trait];
  const animal = spawnSpecies(state, p, card, zone);
  ev(state, { kind: "mutationFlipped", playerId: p.id, cardId: card.id, trait, usedAs: "newSpecies" });
  const carry =
    !def.plantTrait && !def.isPair && !def.opponentOnly && canAttachTrait(animal, trait, true);
  if (carry) {
    attachMutationTrait(state, card, trait, animal);
    log(
      state,
      `${p.name}: «${def.name}» не подошло ни одному виду — появляется новый вид-мутант.`,
      "log.mutantSpecies",
      { name: p.name, trait },
      def.harmful ? "bad" : "good",
    );
  } else {
    log(state, `${p.name}: карта ложится новым видом (свойство «${def.name}» сыграть нельзя).`, "log.cardAsAnimal", { name: p.name, trait });
  }
}

/**
 * «Упрощение»: последнее сыгранное свойство вида отделяется новым видом,
 * сама карта «Упрощение» тоже становится новым видом.
 */
function resolveSimplification(state: GameState, p: Player, card: Card, target: Animal) {
  const last = [...target.traits]
    .filter((t) => !t.pairWith && !t.disabled)
    .sort((a, b) => b.playSeq - a.playSeq)[0];
  if (last) {
    target.traits = target.traits.filter((t) => t.id !== last.id);
    if (target.neoplasia?.id === last.id) target.neoplasia = undefined;
    if (last.cardId !== target.cardId) {
      const mutant = spawnSpecies(state, p, cardShell(last.cardId, last.type), target.zoneId);
      mutant.traits.push(makeTrait(state, cardShell(last.cardId, last.type), last.type, { playSeq: last.playSeq }));
      settleAfterTraitChange(state, mutant);
      ev(state, { kind: "traitPlaced", animalId: mutant.id, type: last.type, hidden: false });
    }
    log(state, `${p.name}: «Упрощение» — «${TRAITS[last.type].name}» отделяется новым видом.`, "log.simplificationSplit", { name: p.name, trait: last.type }, "bad");
  }
  spawnSpecies(state, p, card, target.zoneId);
  log(state, `${p.name}: «Упрощение» — карта ложится новым видом.`, "log.simplificationAnimal", { name: p.name }, "bad");
}

/**
 * Действие devMutate: игрок объявил способ розыгрыша — переворачиваем верхнюю
 * карту личной колоды и разыгрываем её по правилам «Случайных мутаций».
 */
function devMutate(state: GameState, action: Extract<GameAction, { type: "devMutate" }>) {
  const p = player(state, state.currentPlayerId);
  const deck = p.blindDeck ?? [];
  if (!deck.length) {
    advanceDev(state);
    return;
  }
  const card = deck.pop()!;

  if (action.intent === "newAnimal") {
    const zone = state.modules.continents
      ? action.zoneId === "ocean"
        ? "laurasia"
        : (action.zoneId ?? "laurasia")
      : undefined;
    spawnSpecies(state, p, card, zone);
    ev(state, { kind: "mutationFlipped", playerId: p.id, cardId: card.id, trait: null, usedAs: "animal" });
    log(state, `${p.name}: объявлен новый вид — карта из колоды ложится животным.`, "log.mutateAnimal", { name: p.name });
    advanceDev(state);
    return;
  }

  if (action.intent === "population") {
    const target = findAnimal(state, action.animalId ?? "");
    if (!target || target.ownerId !== p.id || (target.population ?? 1) >= p.animals.length) {
      // Цель стала недоступной (страховка от гонки состояний): карта — животным.
      fallbackNewSpecies(state, p, card, mutationFace(state, card), target?.zoneId);
      advanceDev(state);
      return;
    }
    // «Экстрофил»: добавление животного стоит дополнительную карту — в сброс.
    if (target.traits.some((t) => t.type === "extremophile" && isActive(t)) && deck.length) {
      deck.pop();
      p.discardCount += 1;
      log(state, `«Экстрофил»: дополнительная карта уходит в сброс.`, "log.extremophileDiscard", undefined, "bad");
    }
    target.population = (target.population ?? 1) + 1;
    ev(state, { kind: "mutationFlipped", playerId: p.id, cardId: card.id, trait: null, usedAs: "population" });
    ev(state, { kind: "populationGrown", animalId: target.id, to: target.population });
    log(state, `${p.name}: вид получает +1 животное (численность ${target.population}).`, "log.mutatePopulation", { name: p.name, pop: target.population });
    advanceDev(state);
    return;
  }

  if (action.intent === "plant") {
    const trait = mutationFace(state, card);
    const def = TRAITS[trait];
    const plant = state.modules.plants ? findPlant(state, action.plantId ?? "") : undefined;
    // Микориза — парная, на одно растение не кладётся: сразу новый вид.
    if (plant && def.plantTrait && trait !== "micorrhiza") {
      if (trait === "plantParasite" || !plantHasTrait(plant, trait)) {
        applyPlantTraitCard(state, p, card, trait, plant);
        ev(state, { kind: "mutationFlipped", playerId: p.id, cardId: card.id, trait, usedAs: "plantTrait" });
        advanceDev(state);
        return;
      }
    }
    fallbackNewSpecies(state, p, card, trait, plant?.zoneId);
    advanceDev(state);
    return;
  }

  // intent === "trait": свойство на свой вид из одного животного.
  const trait = mutationFace(state, card);
  const target = findAnimal(state, action.animalId ?? "");
  if (!target || target.ownerId !== p.id || (target.population ?? 1) !== 1) {
    fallbackNewSpecies(state, p, card, trait, target?.zoneId);
    advanceDev(state);
    return;
  }
  if (trait === "simplification") {
    ev(state, { kind: "mutationFlipped", playerId: p.id, cardId: card.id, trait, usedAs: "newSpecies" });
    resolveSimplification(state, p, card, target);
    advanceDev(state);
    return;
  }
  const def = TRAITS[trait];
  const attachable = (a: Animal) =>
    !def.plantTrait && !def.isPair && !def.opponentOnly && canAttachTrait(a, trait, true);
  if (attachable(target)) {
    attachMutationTrait(state, card, trait, target);
    ev(state, { kind: "mutationFlipped", playerId: p.id, cardId: card.id, trait, usedAs: "trait" });
    log(
      state,
      def.harmful
        ? `${p.name}: вредная мутация — «${def.name}» на своём виде!`
        : `${p.name}: мутация «${def.name}».`,
      def.harmful ? "log.harmfulMutation" : "log.mutation",
      { name: p.name, trait },
      def.harmful ? "bad" : "neutral",
    );
    advanceDev(state);
    return;
  }
  // Свойство «переезжает на соседний вид справа», пока не найдёт место.
  const idx = p.animals.findIndex((a) => a.id === target.id);
  for (let k = 1; k < p.animals.length; k++) {
    const cand = p.animals[(idx + k) % p.animals.length]!;
    if ((cand.population ?? 1) !== 1) continue;
    if (!attachable(cand)) continue;
    attachMutationTrait(state, card, trait, cand);
    ev(state, { kind: "mutationFlipped", playerId: p.id, cardId: card.id, trait, usedAs: "trait" });
    log(state, `${p.name}: «${def.name}» не подошло виду — переехало соседнему.`, "log.mutationMoved", { name: p.name, trait });
    advanceDev(state);
    return;
  }
  // Никуда не подошло — само становится новым видом.
  fallbackNewSpecies(state, p, card, trait, target.zoneId);
  advanceDev(state);
}

/**
 * Начало хода игрока в фазе развития: «Почкование» добавляет виду животное
 * из личной колоды (численность не ограничена числом видов), один раз за год.
 */
function startMutationsDevTurn(state: GameState, playerId: number) {
  if (!state.modules.randomMutations || state.phase !== "development") return;
  const p = player(state, playerId);
  if (p.passedDev) return;
  for (const a of [...p.animals]) {
    if (!a.traits.some((t) => t.type === "budding" && isActive(t))) continue;
    // Почкование срабатывает один раз за год (buddedYear; в старых сохранениях
    // поле отсутствует — undefined, т.е. в текущем году ещё не срабатывало).
    if (a.buddedYear === state.year) continue;
    if (!p.blindDeck?.length) break;
    p.blindDeck.pop();
    a.buddedYear = state.year;
    a.population = (a.population ?? 1) + 1;
    ev(state, { kind: "budding", animalId: a.id, playerId: p.id });
    ev(state, { kind: "populationGrown", animalId: a.id, to: a.population });
    log(state, `${p.name}: «Почкование» — вид растёт до ${a.population} животного(-ых).`, "log.budding", { name: p.name, pop: a.population }, "good");
  }
}

// ── «Растения»: развитие ─────────────────────────────────────────────────────

/** Выложить свойство растения на общее растение (паразит — на хозяина). */
function playPlantTrait(state: GameState, cardId: string, face: number, plantId: string) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  const trait = faceOf(card, face);
  const plant = mustFindPlant(state, plantId);
  applyPlantTraitCard(state, p, card, trait, plant);
  advanceDev(state);
}

/** Общая логика свойства растения (для руки и для карты-мутации). */
function applyPlantTraitCard(state: GameState, p: Player, card: Card, trait: TraitId, plant: Plant) {
  if (trait === "plantParasite") {
    // Паразит — отдельное растение со своими свойствами, не считается в максимум.
    state.playSeq += 1;
    const parasite: Plant = {
      id: nid(state, "p"),
      kind: "parasite",
      food: 0,
      shelters: 0,
      traits: [],
      hostId: plant.id,
      playSeq: state.playSeq,
      ...(plant.zoneId !== undefined ? { zoneId: plant.zoneId } : {}),
    };
    state.plants!.push(parasite);
    ev(state, { kind: "plantPlaced", plantId: parasite.id, kindOfPlant: "parasite" });
    log(state, `${p.name}: растение-паразит на ${PLANTS[plant.kind].name}.`, "log.plantParasite", { name: p.name, plant: plant.kind });
    return;
  }
  plant.traits.push(makeTrait(state, card, trait));
  // Колючее и дерево сразу приносят убежища.
  if (trait === "thorny") plant.shelters += 3;
  if (trait === "tree") plant.shelters += 1;
  log(state, `${p.name}: свойство ${TRAITS[trait].name} → ${PLANTS[plant.kind].name}.`, "log.plantTrait", { name: p.name, trait, plant: plant.kind });
}

/** Микориза: связывает два растения, карта «лежит между» ними. */
function playPlantPair(state: GameState, cardId: string, face: number, aId: string, bId: string) {
  const p = player(state, state.currentPlayerId);
  const card = takeCard(p, cardId);
  const trait = faceOf(card, face);
  const a = mustFindPlant(state, aId);
  const b = mustFindPlant(state, bId);
  if (!canLinkMicorrhiza(state, a, b)) throw new Error("micorrhiza link rejected");
  a.traits.push(makeTrait(state, card, trait, { pairWith: b.id, pairRole: "a" }));
  b.traits.push(
    makeTrait(state, card, trait, { pairWith: a.id, pairRole: "b", playSeq: state.playSeq }),
  );
  log(state, `${p.name}: микориза связывает ${PLANTS[a.kind].name} и ${PLANTS[b.kind].name}.`, "log.micorrhiza", { name: p.name, plant: a.kind, plant2: b.kind });
  advanceDev(state);
}

function advanceDev(state: GameState) {
  if (state.modules.randomMutations) {
    // Колода кончилась — игроку в фазе развития делать нечего.
    for (const p of state.players) {
      if (!(p.blindDeck ?? []).length) p.passedDev = true;
    }
  } else {
    // Пустая рука — развитие для игрока закончено: без этого игрок
    // застревал бы в фазе с единственной кнопкой «Пас».
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
      passTurnTo(state, id);
      startMutationsDevTurn(state, id);
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
  if ((state.modules.plants || state.modules.fungi) && !state.modules.continents) {
    // «Растения»/«Трава и грибы»: еда этого года — на столе, кубик не нужен.
    if (state.modules.fungi) addNewFlora(state, state.players.length);
    log(
      state,
      state.modules.plants && state.modules.fungi
        ? "Питание: еда этого года — на растениях, травах и грибах."
        : state.modules.plants
          ? "Питание: еда этого года — на растениях."
          : "Питание: еда этого года — на травах и грибах.",
      state.modules.plants && state.modules.fungi
        ? "log.feedPlantsFungi"
        : state.modules.plants
          ? "log.feedPlants"
          : "log.feedFungi",
      undefined,
      "good",
    );
    enterFeeding(state);
    return;
  }
  // «Трава и грибы» + «Континенты»: фаза базы нужна для Океана, но флора
  // пополняется здесь — до броска, как в игре без «Континентов».
  if (state.modules.fungi) addNewFlora(state, state.players.length);
  log(state, "Определение кормовой базы.", "log.bankStart", undefined, "good");
  state.phase = "foodBank";
  state.foodRoll = null;
  state.foodBank = 0;
}

/** Общий старт фазы питания: круг по игрокам от первого игрока. */
function enterFeeding(state: GameState) {
  state.phase = "feeding";
  passTurnTo(state, state.firstPlayerId);
  for (const p of state.players) p.passedFeed = false;
  state.turnTerritory = undefined;
  state.madTurn = undefined;
  state.rageTurn = null;
  state.migratedThisPhase = [];
  feedTurn(state, state.firstPlayerId);
}

/** Действие rollFoodBank: бросаем кубики и запоминаем их — сумма ложится в банк после анимации. */
function startFoodRoll(state: GameState) {
  if (state.phase !== "foodBank" || state.foodRoll) return;
  const n = state.players.length;
  if (state.modules.plants || state.modules.fungi) {
    // «Растения»/«Трава и грибы» + «Континенты»: на континентах еда — на
    // растениях и флоре; в Океане кормовая база определяется по официальной
    // таблице (без броска) + эдификаторы. Флора добавляется в revealAndStartFood.
    advanceNeoplasia(state);
    const bases: Record<TerritoryId, number> = {
      laurasia: 0,
      gondwana: 0,
      ocean: territoryFoodSpec(n).ocean,
    };
    for (const a of allAnimals(state)) {
      if (a.hibernating) continue;
      if (!hasTrait(a, "edificator")) continue;
      if ((a.zoneId ?? "laurasia") === "ocean") {
        bases.ocean += 2;
        ev(state, { kind: "edificator", territory: "ocean", amount: 2 });
      }
      // Континентальные эдификаторы добавляют фишки растениям/флоре
      // своей локации (растения — в фазе роста, флора — в вымирание).
    }
    state.foodRoll = [dieFor(state)];
    state.territoryFood = { laurasia: 0, gondwana: 0, ocean: bases.ocean };
    state.foodBank = bases.ocean;
    ev(state, { kind: "diceRoll", dice: state.foodRoll, total: bases.ocean });
    log(state, `Океан: кормовая база ${bases.ocean}. На континентах еда — на столе флоры.`, "log.oceanBank", { bank: bases.ocean }, "good");
    return;
  }
  if (state.modules.continents) {
    // Неоплазия поднимается в начале определения кормовой базы (правило).
    advanceNeoplasia(state);
    // Официальная таблица дополнения: у каждой территории своя база.
    // Лавразия — белые кубики, Гондвана — цветные, Океан — константа.
    const spec = territoryFoodSpec(n);
    const laurasia = rollSpec(state, spec.laurasia);
    const gondwana = rollSpec(state, spec.gondwana);
    const bases: Record<TerritoryId, number> = {
      laurasia: laurasia.food,
      gondwana: gondwana.food,
      ocean: spec.ocean,
    };
    // Эдификаторы добавляют по 2 фишки в свою территорию.
    for (const a of allAnimals(state)) {
      if (a.hibernating) continue;
      if (!hasTrait(a, "edificator")) continue;
      const z = (a.zoneId ?? "laurasia") as TerritoryId;
      bases[z] += 2;
      ev(state, { kind: "edificator", territory: z, amount: 2 });
    }
    const dice = [...laurasia.dice, ...gondwana.dice];
    state.foodRoll = dice;
    state.territoryFood = bases;
    state.foodBank = bases.laurasia + bases.gondwana + bases.ocean;
    ev(state, { kind: "diceRoll", dice, total: state.foodBank });
    const lRoll = `${laurasia.dice.join(" + ")}${spec.laurasia.bonus ? ` + ${spec.laurasia.bonus}` : ""}`;
    const gRoll = `${gondwana.dice.join(" + ")}${spec.gondwana.bonus ? ` + ${spec.gondwana.bonus}` : ""}`;
    log(
      state,
      `Кормовые базы — Лавразия ${bases.laurasia}, Гондвана ${bases.gondwana}, Океан ${bases.ocean}.`,
      "log.basesRoll",
      { l: bases.laurasia, g: bases.gondwana, o: bases.ocean, lroll: lRoll, groll: gRoll },
      "good",
    );
    return;
  }
  const spec = baseFoodSpec(n);
  const { dice, food } = rollSpec(state, spec);
  state.foodRoll = dice;
  state.foodBank = food;
  ev(state, { kind: "diceRoll", dice, total: food });
  const extra = spec.bonus ? ` (+${spec.bonus})` : "";
  log(
    state,
    `Кубики кормовой базы: ${dice.join(" + ")}${extra} = ${food}.`,
    "log.diceBank",
    { dice: dice.join(" + "), extra, food },
    "good",
  );
}

/** Действие beginFeeding: вызывается после показа кубиков, стартует питание по кругу. */
function beginFeeding(state: GameState) {
  if (state.phase !== "foodBank" || !state.foodRoll) return;
  state.phase = "feeding";
  passTurnTo(state, state.firstPlayerId);
  for (const p of state.players) p.passedFeed = false;
  if ((state.modules.plants || state.modules.fungi) && state.modules.continents) {
    log(
      state,
      `Океан: кормовая база ${state.territoryFood?.ocean ?? 0}. На континентах еда — на столе флоры${state.modules.plants ? " (растения" + (state.modules.fungi ? " и травы с грибами)" : ")") : " (травы и грибы)"}.`,
      state.modules.plants && state.modules.fungi
        ? "log.oceanBankPlantsFungi"
        : state.modules.plants
          ? "log.oceanBankPlants"
          : "log.oceanBankFungi",
      { bank: state.territoryFood?.ocean ?? 0 },
      "good",
    );
  } else if (state.modules.continents) {
    log(
      state,
      `Кормовые базы: Лавразия ${state.territoryFood?.laurasia ?? 0}, Гондвана ${state.territoryFood?.gondwana ?? 0}, Океан ${state.territoryFood?.ocean ?? 0}.`,
      "log.bases",
      { l: state.territoryFood?.laurasia ?? 0, g: state.territoryFood?.gondwana ?? 0, o: state.territoryFood?.ocean ?? 0 },
      "good",
    );
  } else {
    log(state, `Кормовая база: ${state.foodBank}.`, "log.bank", { bank: state.foodBank }, "good");
  }
  state.turnTerritory = undefined;
  state.madTurn = undefined;
  state.rageTurn = null;
  state.migratedThisPhase = [];
  feedTurn(state, state.firstPlayerId);
}

function freshTurnUse(): FeedTurnUse {
  return {
    carnivores: [],
    pirates: [],
    grazers: [],
    foodTaken: false,
    combatUsed: false,
    migrated: false,
    sheltered: false,
    hibernated: [],
  };
}

/**
 * Кормовая база базовой игры по официальной таблице (листок с правилами, блок
 * «Игра с двумя наборами»): 2 игрока — 1 кубик +2; 3 — 2 кубика; 4 — 2 кубика +2;
 * 5 — 3 кубика +2; 6 — 3 кубика +4; 7 — 4 кубика +2; 8 — 4 кубика +4.
 * Больше восьми мест за столом не собирается.
 */
export function baseFoodSpec(playerCount: number): { dice: number; bonus: number } {
  if (playerCount <= 2) return { dice: 1, bonus: 2 };
  if (playerCount === 3) return { dice: 2, bonus: 0 };
  if (playerCount === 4) return { dice: 2, bonus: 2 };
  if (playerCount === 5) return { dice: 3, bonus: 2 };
  if (playerCount === 6) return { dice: 3, bonus: 4 };
  if (playerCount === 7) return { dice: 4, bonus: 2 };
  return { dice: 4, bonus: 4 };
}

/**
 * Кормовые базы «Континентов» по официальной таблице PDF (игроки → Лавразия /
 * Гондвана / Океан). Лавразия набирается белыми кубиками, Гондвана — цветными,
 * Океан — постоянная величина «число игроков + 1».
 */
export function territoryFoodSpec(playerCount: number): {
  laurasia: { dice: number; bonus: number };
  gondwana: { dice: number; bonus: number };
  ocean: number;
} {
  if (playerCount <= 2) return { laurasia: { dice: 1, bonus: 0 }, gondwana: { dice: 1, bonus: 2 }, ocean: 3 };
  if (playerCount === 3) return { laurasia: { dice: 1, bonus: 0 }, gondwana: { dice: 2, bonus: 0 }, ocean: 4 };
  if (playerCount === 4) return { laurasia: { dice: 1, bonus: 2 }, gondwana: { dice: 2, bonus: 0 }, ocean: 5 };
  if (playerCount === 5) return { laurasia: { dice: 1, bonus: 3 }, gondwana: { dice: 2, bonus: 2 }, ocean: 6 };
  if (playerCount === 6) return { laurasia: { dice: 1, bonus: 5 }, gondwana: { dice: 2, bonus: 3 }, ocean: 7 };
  if (playerCount === 7) return { laurasia: { dice: 2, bonus: 2 }, gondwana: { dice: 3, bonus: 2 }, ocean: 8 };
  return { laurasia: { dice: 2, bonus: 2 }, gondwana: { dice: 3, bonus: 4 }, ocean: 9 };
}

/** Бросок кубиков по спецификации: столько кубиков, столько и сумма. */
function rollSpec(state: GameState, spec: { dice: number; bonus: number }): { dice: number[]; food: number } {
  const dice = Array.from({ length: spec.dice }, () => dieFor(state));
  return { dice, food: dice.reduce((s, d) => s + d, 0) + spec.bonus };
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
  // Метки хода («Трава и грибы») относятся к одному раунду — сбрасываем.
  state.madTurn = undefined;
  state.rageTurn = null;
  let id = startId;
  for (let i = 0; i < state.players.length; i++) {
    const p = player(state, id);
    if (!p.passedFeed && hasFreshAction(state, id)) {
      passTurnTo(state, id);
      state.turnUse = freshTurnUse();
      state.turnTerritory = undefined;
      startMarkTurn(state, id);
      return;
    }
    id = nextPlayerId(state, id);
  }
  endFeeding(state);
}

/**
 * «Трава и грибы»: начало раунда игрока. «Бешенство» — метка снимается и
 * раунд состоит из обязательной атаки этим животным; «Безумие» — метка
 * снимается, раунд вместо игрока проводит сосед справа (в онлайн-версии —
 * логика ботов, руку соперник не видит).
 */
function startMarkTurn(state: GameState, id: number) {
  if (!state.modules.fungi) return;
  const p = player(state, id);
  const madAnimal = p.animals.find((a) => hasMark(a, "rage"));
  if (madAnimal) {
    returnMarksToPoolSingle(state, madAnimal, "rage");
    state.rageTurn = { animalId: madAnimal.id };
    log(state, `Бешенство: животное игрока ${p.name} обязано атаковать в этот раунд!`, "log.rage", { name: p.name }, "hunt");
    return;
  }
  const crazy = p.animals.find((a) => hasMark(a, "madness"));
  if (crazy) {
    returnMarksToPoolSingle(state, crazy, "madness");
    state.madTurn = id;
    log(state, `Безумие: раунд игрока ${p.name} проводит сосед справа.`, "log.madness", { name: p.name }, "bad");
  }
}

/** Снять одну метку, вернув её на стол. */
function returnMarksToPoolSingle(state: GameState, animal: Animal, mark: MarkKind) {
  if (!animal.marks?.length) return;
  animal.marks = animal.marks.filter((m) => m !== mark);
  const left = state.marksPool?.[mark] ?? 0;
  state.marksPool = { ...state.marksPool, [mark]: left + 1 };
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
  if (bank <= 0 || state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
  // «Континенты»: первое действие хода фиксирует территорию — дальше только она.
  if (state.modules.continents && state.turnTerritory && state.turnTerritory !== zone) return;
  takeFromBank(state, zone, 1);
  state.turnUse.foodTaken = true;
  state.turnTerritory = state.modules.continents ? (zone ?? "laurasia") : undefined;
  giveFood(state, a, 1, "red", { triggerComm: true, triggerCoop: true });
  ev(state, { kind: "foodFromBank", animalId: a.id, playerId: p.id, via: "take" });
  log(state, `${p.name} берёт еду из базы (${bankOf(state, zone)} осталось).`, "log.takeBank", { name: p.name, left: bankOf(state, zone) });
  maybeEndTurn(state);
}

// ── «Растения»: питание ──────────────────────────────────────────────────────

/**
 * Выдача фишки с растения на животное с учётом его свойств: лекарственное
 * «усыпляет» (накормлено, свойства не действуют), питательное даёт вторую
 * фишку, медонос ворует карту у richer-игрока.
 */
function givePlantFood(state: GameState, animal: Animal, plant: Plant) {
  if (plant.food <= 0) return;
  const owner = ownerOf(state, animal.id);
  plant.food -= 1;
  ev(state, { kind: "plantFoodTaken", animalId: animal.id, plantId: plant.id, playerId: owner.id });
  if (plantHasTrait(plant, "medicinal")) {
    if (isFed(animal) && !animal.sedated && emptyFatSlots(animal) > 0 && !animal.hibernating) {
      animal.fatTokens += 1;
      ev(state, { kind: "foodToFat", animalId: animal.id });
    } else {
      animal.food += 1;
    }
    animal.sedated = true;
    animal.receivedFoodThisYear = true;
    log(state, `${owner.name}: лекарственное растение — животное накормлено, свойства не действуют до конца фазы.`, "log.medicinal", { name: owner.name });
  } else {
    giveFood(state, animal, 1, "red", { triggerComm: false, triggerCoop: true });
    triggerPartnerEffectsFromPlant(state, animal, plant);
  }
  log(state, `${owner.name}: фишка с растения ${PLANTS[plant.kind].name} (осталось ${plant.food}).`, "log.takePlant", { name: owner.name, plant: plant.kind, left: plant.food });
  // Питательное: животное дополнительно получает синюю фишку — даже с последней
  // красной (официальные правила «Растений», иллюстрация №6: «дополнительно
  // получает синюю фишку»; синяя не списывается с растения).
  if (plantHasTrait(plant, "nutritious")) {
    giveFood(state, animal, 1, "blue", { triggerCoop: true });
    ev(state, { kind: "blueFood", animalId: animal.id, reason: "nutritious" });
    log(state, `Питательное растение: ещё одна (синяя) фишка.`, "log.nutritious", undefined, "good");
  }
  // Медонос: случайная карта у игрока с большей рукой.
  if (plantHasTrait(plant, "honeyPlant")) {
    stealHoneyCard(state, owner.id);
  }
}

/**
 * «Взаимодействие» от фишки с растения: напарник берёт вторую фишку с того же
 * растения, но только если сам способен им питаться (правило «Растений»).
 */
function triggerPartnerEffectsFromPlant(state: GameState, source: Animal, plant: Plant) {
  for (const t of source.traits) {
    if (!isActive(t) || t.type !== "communication" || !t.pairWith) continue;
    const key = `communication:${t.cardId}`;
    if (firedPairs.has(key)) continue;
    const other = findAnimal(state, t.pairWith);
    if (!other || other.hibernating) continue;
    if (plant.food <= 0) continue;
    if (!canReceiveFood(state, other) || !canFeedOnPlant(state, other, plant)) continue;
    firedPairs.add(key);
    givePlantFood(state, other, plant);
    const op = ownerOf(state, other.id);
    log(state, `Взаимодействие: ${op.name} берёт фишку с того же растения.`, "log.commTakePlant", { name: op.name });
  }
}

/** Медонос: взять случайную карту у игрока, у которого карт строго больше. */
function stealHoneyCard(state: GameState, playerId: number) {
  const me = player(state, playerId);
  const richer = state.players.filter((x) => x.id !== playerId && x.hand.length > me.hand.length);
  if (!richer.length) return;
  const target = richer.reduce((best, x) => (x.hand.length > best.hand.length ? x : best), richer[0]!);
  const idx = Math.floor(nextRandom(state) * target.hand.length);
  const [card] = target.hand.splice(idx, 1);
  if (!card) return;
  me.hand.push(card);
  ev(state, { kind: "cardStolen", fromPlayerId: target.id, toPlayerId: playerId });
  log(state, `Медонос: ${me.name} вытягивает карту у ${target.name}.`, "log.honeyPlant", { name: me.name, target: target.name }, "good");
}

/** Продолжить контратаку после выбора: оставшиеся защиты действуют. */
function continuePlantCounter(state: GameState) {
  const atk = state.pendingAttack!;
  const plant = mustFindPlant(state, atk.plantId!);
  const prey = mustFind(state, atk.preyId);
  atk.choosingPlantDefense = false;
  atk.waitingFor = prey.ownerId;
  // Не меняем свойства на столе: игнорирование действует только в этой атаке.
  const target = { ...prey, traits: prey.traits.filter((t) => t.id !== atk.ignoredTraitId) };
  if (!canPlantAttackTarget(state, plant, target)) {
    givePlantFood(state, prey, plant);
    state.pendingAttack = null;
    maybeEndTurn(state);
    return;
  }
  if (defenseOptions(state, prey, atk).length === 0) resolveNoDefense(state);
}

/** «Растения»: взять фишку еды с растения; хищное растение контратакует. */
function feedTakePlant(state: GameState, animalId: string, plantId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  const plant = mustFindPlant(state, plantId);
  if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
  if (!canFeedOnPlant(state, a, plant)) return;
  if (state.modules.continents) {
    const zone = (plant.zoneId ?? "gondwana") as TerritoryId;
    if (state.turnTerritory && state.turnTerritory !== zone) return;
    state.turnTerritory = zone;
  }
  // Хищное растение контратакует — даже неудачно, больше в этот год оно не атакует.
  if (plant.kind === "carnivorous" && !plant.attackedThisYear && !a.sheltered) {
    plant.attackedThisYear = true;
    state.turnUse.foodTaken = true;
    const atk: PendingAttack = {
      carnivoreId: plant.id,
      preyId: a.id,
      mimicryChain: [],
      waitingFor: p.id,
      usedDefenses: [],
      plantId: plant.id,
      plantCounter: true,
      plantRequesterId: a.id,
    };
    state.pendingAttack = atk;
    ev(state, { kind: "plantAttack", plantId: plant.id, preyId: a.id, counter: true });
    log(state, `Хищное растение контратакует ${p.name}!`, "log.plantCounter", { name: p.name }, "hunt");
    if (plantCounterDefenses(a).length) {
      atk.choosingPlantDefense = true;
      const seat = state.players.findIndex((x) => x.id === a.ownerId);
      atk.waitingFor = state.players[(seat + state.players.length - 1) % state.players.length]!.id;
    } else {
      continuePlantCounter(state);
    }
    return;
  }
  state.turnUse.foodTaken = true;
  givePlantFood(state, a, plant);
  maybeEndTurn(state);
}

// ── «Трава и грибы»: питание ─────────────────────────────────────────────────

/**
 * Взять фишку с карты флоры: еда идёт на животное, срабатывает способность
 * карты, прилетает метка последствий; «Взаимодействие» даёт напарнику фишку
 * с той же карты (со всеми её последствиями).
 */
function feedTakeFlora(state: GameState, animalId: string, floraId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  const f = mustFindFlora(state, floraId);
  if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
  if (!canFeedOnFlora(state, a, f) || !canReceiveFood(state, a)) return;
  if (state.modules.continents) {
    const zone = (f.zoneId ?? "gondwana") as TerritoryId;
    if (state.turnTerritory && state.turnTerritory !== zone) return;
    state.turnTerritory = zone;
  }
  state.turnUse.foodTaken = true;
  takeFloraToken(state, a, f);
  maybeEndTurn(state);
}

/** Одна фишка с карты флоры: еда + способность + метка. */
function takeFloraToken(state: GameState, animal: Animal, flora: FloraCard) {
  if (flora.food <= 0) return;
  flora.food -= 1;
  const owner = ownerOf(state, animal.id);
  ev(state, { kind: "floraFoodTaken", animalId: animal.id, floraId: flora.id, playerId: owner.id });
  // Способность карты срабатывает одновременно со взятием фишки (правило
  // дополнения); для способностей, меняющих еду на теле, порядок «эффект,
  // затем еда» даёт корректный итог (очистительная оставляет взятую фишку,
  // окрыляющий — свою синюю).
  applyFloraAbility(state, animal, flora);
  giveFood(state, animal, 1, "red", { triggerComm: false, triggerCoop: true });
  triggerPartnerEffectsFromFlora(state, animal, flora);
  log(state, `${owner.name}: фишка с карты ${FLORA[flora.kind].name} (осталось ${flora.food}).`, "log.takeFlora", { name: owner.name, flora: flora.kind, left: flora.food });
  const def = FLORA[flora.kind];
  if (def.mark) giveMark(state, animal, def.mark);
}

/**
 * «Взаимодействие» от фишки с карты флоры: напарник берёт вторую фишку с той
 * же карты — со всеми последствиями способности и меткой.
 */
function triggerPartnerEffectsFromFlora(state: GameState, source: Animal, flora: FloraCard) {
  if (isAsleep(source)) return;
  for (const t of source.traits) {
    if (!isActive(t) || t.type !== "communication" || !t.pairWith) continue;
    const key = `communication:${t.cardId}`;
    if (firedPairs.has(key)) continue;
    const other = findAnimal(state, t.pairWith);
    if (!other || other.hibernating) continue;
    if (!canReceiveFood(state, other) || !canFeedOnFlora(state, other, flora)) continue;
    firedPairs.add(key);
    takeFloraToken(state, other, flora);
    const op = ownerOf(state, other.id);
    log(state, `Взаимодействие: ${op.name} берёт фишку с той же карты флоры.`, "log.commTakeFlora", { name: op.name });
  }
}

/**
 * Способность карты флоры при взятии фишки. Способности-метки (поганка,
 * плесень, шляпка, мухомор, сон/трын/дурман/улыбнись-трава) разыгрываются
 * через giveMark в takeFloraToken.
 */
function applyFloraAbility(state: GameState, animal: Animal, flora: FloraCard) {
  const owner = ownerOf(state, animal.id);
  switch (flora.kind) {
    case "insight": {
      // Гриб прозрения: владелец сбрасывает всю руку (подсмотр чужих карт в
      // онлайн-версии сознательно упрощён).
      if (owner.hand.length) {
        const lost = owner.hand.length;
        owner.hand = [];
        ev(state, { kind: "handLost", playerId: owner.id });
        log(state, `Гриб прозрения: ${owner.name} сбрасывает всю руку (${lost} карт).`, "log.insight", { name: owner.name, lost }, "bad");
      }
      return;
    }
    case "soaring": {
      // Окрыляющий гриб: сброс парных свойств + 1 синяя фишка.
      let dropped = 0;
      for (const t of [...animal.traits]) {
        if (!t.pairWith) continue;
        const other = findAnimal(state, t.pairWith);
        if (other) other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
        animal.traits = animal.traits.filter((x) => x.cardId !== t.cardId);
        dropped += 1;
      }
      if (dropped) {
        owner.discardCount += dropped;
        log(state, `Окрыляющий гриб: ${dropped} парных свойств уходят в сброс.`, "log.soaringDrop", { dropped }, "bad");
      }
      giveFood(state, animal, 1, "blue");
      ev(state, { kind: "blueFood", animalId: animal.id, reason: "soaring" });
      log(state, `Окрыляющий гриб: животное получает 1 синюю фишку.`, "log.soaringFood", undefined, "good");
      return;
    }
    case "cleanser": {
      // Очистительная трава: прочие красные/синие фишки и все метки долой.
      // The new token is granted by takeFloraToken after clearing the old food.
      animal.food = 0;
      animal.blueFood = 0;
      const cleared = (animal.marks ?? []).length;
      returnMarksToPool(state, animal);
      log(
        state,
        `Очистительная трава: ${owner.name} оставляет одну фишку, прочие сняты${cleared ? `, меток снято: ${cleared}` : ""}.`,
        cleared ? "log.cleanserMarks" : "log.cleanser",
        { name: owner.name, ...(cleared ? { marks: cleared } : {}) },
        "bad",
      );
      return;
    }
    case "passionflower": {
      // Страстоцвет: одно свойство (кроме паразита и неоплазии) — новое животное.
      const trait = [...animal.traits]
        .reverse()
        .find((t) => t.type !== "parasite" && t.type !== "neoplasia" && !t.pairWith && !t.disabled);
      if (!trait) return;
      animal.traits = animal.traits.filter((t) => t.id !== trait.id);
      state.playSeq += 1;
      const baby: Animal = {
        id: nid(state, "a"),
        ownerId: owner.id,
        cardId: trait.cardId,
        no: nextAnimalNo(owner),
        traits: [],
        food: 0,
        blueFood: 0,
        fatTokens: 0,
        hibernating: false,
        hibernatedLastYear: false,
        receivedFoodThisYear: false,
        poisoned: false,
        seed: trait.cardId.length * 17 + owner.id * 13,
        ...(animal.zoneId !== undefined ? { zoneId: animal.zoneId } : {}),
      };
      owner.animals.push(baby);
      ev(state, { kind: "animalPlaced", animalId: baby.id, ownerId: owner.id, zoneId: baby.zoneId });
      log(state, `Страстоцвет: свойство «${TRAITS[trait.type].name}» становится новым животным ${owner.name}.`, "log.passionflower", { trait: trait.type, name: owner.name }, "good");
      return;
    }
    default:
      return;
  }
}

/** «Растения»: спрятать животное в убежище растения (вместо еды/атаки). */
function feedShelter(state: GameState, animalId: string, plantId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  const plant = mustFindPlant(state, plantId);
  if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
  if (!canTakeShelterFrom(state, a, plant)) return;
  if (state.modules.continents) {
    const zone = (plant.zoneId ?? "gondwana") as TerritoryId;
    if (state.turnTerritory && state.turnTerritory !== zone) return;
    state.turnTerritory = zone;
  }
  // «Короед»: пока животное не накормлено, взятое убежище становится синей
  // фишкой еды, а жетон убежища возвращается на растение. Ход всё равно занят.
  if (
    state.modules.randomMutations &&
    hasTrait(a, "barkBeetle") &&
    !isFed(a) &&
    !hasTrait(a, "obligateCarnivore")
  ) {
    state.turnUse.sheltered = true;
    giveFood(state, a, 1, "blue");
    ev(state, { kind: "blueFood", animalId: a.id, reason: "beetle" });
    log(state, `${p.name}: «Короед» — убежище превращается в синюю фишку еды.`, "log.barkBeetle", { name: p.name }, "bad");
    maybeEndTurn(state);
    return;
  }
  plant.shelters -= 1;
  a.sheltered = true;
  state.turnUse.sheltered = true;
  ev(state, { kind: "shelterTaken", animalId: a.id, plantId: plant.id });
  log(state, `${p.name}: животное прячется в убежище (${PLANTS[plant.kind].name}).`, "log.shelter", { name: p.name, plant: plant.kind }, "good");
  maybeEndTurn(state);
}

/** «Растения»: направить хищное растение на жертву — ход игрока. */
function feedPlantAttack(state: GameState, plantId: string, preyId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const plant = mustFindPlant(state, plantId);
  const prey = mustFind(state, preyId);
  if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
  if (plant.kind !== "carnivorous" || plant.attackedThisYear) return;
  if (!canPlantAttackTarget(state, plant, prey)) return;
  plant.attackedThisYear = true;
  state.turnUse.combatUsed = true;
  const atk: PendingAttack = {
    carnivoreId: plant.id,
    preyId: prey.id,
    mimicryChain: [],
    waitingFor: prey.ownerId,
    usedDefenses: [],
    plantId: plant.id,
  };
  state.pendingAttack = atk;
  ev(state, { kind: "plantAttack", plantId: plant.id, preyId: prey.id, counter: false });
  log(state, `${p.name} направляет хищное растение на животное ${ownerOf(state, prey.id).name}!`, "log.plantAttack", { name: p.name, target: ownerOf(state, prey.id).name }, "hunt");
  const opts = defenseOptions(state, prey, atk);
  if (opts.length === 0) resolveNoDefense(state);
}

/** «Растения»: перекинуть фишку с растения-хозяина на растение-паразит. */
function feedParasitize(state: GameState, hostId: string, parasiteId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const host = mustFindPlant(state, hostId);
  const parasite = mustFindPlant(state, parasiteId);
  if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
  if (parasite.kind !== "parasite" || parasite.hostId !== host.id || host.food <= 1) return;
  // Золотое правило: фишек паразита не может быть больше максимума.
  if (parasite.food >= PLANTS[parasite.kind].maxFood) return;
  host.food -= 1;
  parasite.food += 1;
  state.turnUse.foodTaken = true;
  log(state, `${p.name}: фишка переходит на растение-паразит.`, "log.parasiteFeed", { name: p.name });
  maybeEndTurn(state);
}

function feedHunt(state: GameState, carnivoreId: string, preyId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const carnivore = mustFind(state, carnivoreId);
  const prey = mustFind(state, preyId);
  // «Трава и грибы»: ход бешенства — обязательная атака бешеного животного.
  if (state.rageTurn) {
    if (state.rageTurn.animalId !== carnivoreId) return;
    if (!canRageAttack(state, carnivore, prey)) return;
    state.rageTurn = null;
    state.turnUse.combatUsed = true;
    carnivore.huntedYear = state.year;
    ev(state, { kind: "huntDeclared", carnivoreId, preyId });
    const atk: PendingAttack = {
      carnivoreId,
      preyId,
      mimicryChain: [],
      waitingFor: prey.ownerId,
      usedDefenses: [],
      rage: true,
      ignoredTraitId: hazeIgnoreTraitId(state, carnivore, prey),
    };
    state.pendingAttack = atk;
    log(state, `Бешеное животное игрока ${p.name} атакует!`, "log.rageAttack", { name: p.name }, "hunt");
    const opts = defenseOptions(state, prey, atk);
    if (opts.length === 0) {
      resolveNoDefense(state);
      return;
    }
    return;
  }
  if (state.turnUse.foodTaken || state.turnUse.sheltered || state.turnUse.carnivores.includes(carnivoreId)) return;
  if (state.turnUse.carnivores.length >= HUNTS_PER_TURN) return;
  if (carnivore.huntedYear === state.year) return;
  if (!canAttack(state, carnivore, prey)) return;
  state.turnUse.carnivores.push(carnivoreId);
  state.turnUse.combatUsed = true;
  carnivore.huntedYear = state.year;
  ev(state, { kind: "huntDeclared", carnivoreId, preyId });
  const atk: PendingAttack = {
    carnivoreId,
    preyId,
    mimicryChain: [],
    waitingFor: prey.ownerId,
    usedDefenses: [],
    // Метка «Дурь» на жертве: атакующий игнорирует одно её свойство.
    ignoredTraitId: hazeIgnoreTraitId(state, carnivore, prey),
  };
  state.pendingAttack = atk;
  const opts = defenseOptions(state, prey, atk);
  if (opts.length === 0) {
    resolveNoDefense(state);
    return;
  }
  log(state, `${p.name} атакует животное игрока ${ownerOf(state, prey.id).name}!`, "log.hunt", { name: p.name, target: ownerOf(state, prey.id).name }, "hunt");
}

function feedPirate(state: GameState, pirateId: string, targetId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const pirate = mustFind(state, pirateId);
  const target = mustFind(state, targetId);
  if (state.turnUse.foodTaken || state.turnUse.sheltered || state.turnUse.pirates.includes(pirateId)) return;
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
    "log.piracy",
    { name: p.name, target: ownerOf(state, target.id).name },
    "hunt",
  );
  maybeEndTurn(state);
}

/** Спячка — действие животного: одна за ход, ход при этом не передаётся. */
function feedHibernate(state: GameState, animalId: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  if ((state.turnUse.hibernated ?? []).length > 0) return;
  if (a.hibernatedLastYear || state.lastYear || a.hibernating || isFed(a)) return;
  if (!hasTrait(a, "hibernation")) return;
  const sleep = a.traits.find(t => t.type === "hibernation" && isActive(t))!;
  if (sleep.hibernationUsedYear !== undefined && sleep.hibernationUsedYear >= state.year - 1) return;
  sleep.hibernationUsedYear = state.year;
  state.turnUse.hibernated.push(animalId);
  a.hibernating = true;
  log(state, `${p.name} использует спячку.`, "log.hibernation", { name: p.name }, "good");
  // Ход остаётся у игрока: спячка — действие, а не передача хода.
  maybeEndTurn(state);
}

/** «Закончить ход»: передача хода следующему игроку без паса до конца фазы. */
function feedEndTurn(state: GameState) {
  if (state.rageTurn) {
    const mad = findAnimal(state, state.rageTurn.animalId);
    const mustAttack = mad && canRageAttackWith(mad) && allAnimals(state).some((prey) => canRageAttack(state, mad, prey));
    if (mustAttack) return;
  }
  log(state, `${player(state, state.currentPlayerId).name} заканчивает ход.`, "log.endTurn", { name: player(state, state.currentPlayerId).name });
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
  // Метка «Сон» — животное без свойств: жировой запас недоступен.
  if (isAsleep(a)) return;
  if (!hasTrait(a, "fatTissue")) return;
  const n = Math.min(amount, a.fatTokens);
  a.fatTokens -= n;
  a.food += n;
  a.blueFood += n;
  ev(state, { kind: "blueFood", animalId: a.id, reason: "fat" });
  log(state, `${p.name} тратит жировой запас (${n}). Ход продолжается.`, "log.fat", { name: p.name, n });
  maybeEndTurn(state);
}

/**
 * Топотун — отдельное действие хода: уничтожает 1 фишку — с растения
 * («Растения»: по правилам топчет то же растение, с которого ел; в нашей
 * версии — любое растение своей территории) или из кормовой базы.
 */
function feedGraze(state: GameState, animalId: string, plantId?: string, floraId?: string) {
  const p = player(state, state.currentPlayerId);
  spendTurn(state, p.id);
  const a = mustFind(state, animalId);
  if (floraId && state.modules.fungi) {
    const f = mustFindFlora(state, floraId);
    if (!hasTrait(a, "grazing") || f.food <= 0 || state.turnUse.sheltered) {
      advanceFeed(state);
      return;
    }
    const before = f.food;
    f.food -= 1;
    state.turnUse.grazers.push(animalId);
    if (state.modules.continents) {
      const zone = (f.zoneId ?? "gondwana") as TerritoryId;
      if (state.turnTerritory === undefined || state.turnTerritory === zone) {
        state.turnTerritory = zone;
      }
    }
    ev(state, { kind: "floraGrazed", floraId: f.id, from: before, to: f.food });
    log(state, `${p.name}: топтун уничтожает фишку с карты ${FLORA[f.kind].name} (осталось ${f.food}).`, "log.grazeFlora", { name: p.name, flora: f.kind, left: f.food });
    maybeEndTurn(state);
    return;
  }
  if (plantId && state.modules.plants) {
    const plant = mustFindPlant(state, plantId);
    if (!hasTrait(a, "grazing") || plant.food <= 0 || state.turnUse.sheltered) {
      advanceFeed(state);
      return;
    }
    const before = plant.food;
    plant.food -= 1;
    state.turnUse.grazers.push(animalId);
    if (state.modules.continents) {
      const zone = (plant.zoneId ?? "gondwana") as TerritoryId;
      if (state.turnTerritory === undefined || state.turnTerritory === zone) {
        state.turnTerritory = zone;
      }
    }
    ev(state, { kind: "plantGrazed", plantId: plant.id, from: before, to: plant.food });
    log(state, `${p.name}: топтун уничтожает фишку растения ${PLANTS[plant.kind].name} (осталось ${plant.food}).`, "log.grazePlant", { name: p.name, plant: plant.kind, left: plant.food });
    maybeEndTurn(state);
    return;
  }
  if (!hasTrait(a, "grazing") || bankOf(state, a.zoneId) <= 0 || state.turnUse.sheltered) {
    advanceFeed(state);
    return;
  }
  // «Случайные мутации»: топтун давит фишек не больше численности вида.
  const burnBank = state.modules.randomMutations
    ? Math.min(a.population ?? 1, bankOf(state, a.zoneId))
    : 1;
  takeFromBank(state, a.zoneId, burnBank);
  state.turnUse.grazers.push(animalId);
  ev(state, { kind: "bankBurned", amount: burnBank, territory: a.zoneId });
  log(state, `${p.name}: топотун уничтожает ${burnBank} ед. еды. База: ${bankOf(state, a.zoneId)}.`, "log.grazeBank", { name: p.name, burned: burnBank, bank: bankOf(state, a.zoneId) });
  maybeEndTurn(state);
}

/**
 * «Миграция»: отдельный ход питания. Переезжают объявленные животные со
 * свойством «миграция», за каждым могут прицепиться прилипалы (в т.ч. чужие).
 * В этот ход больше ничего нельзя: ни есть, ни охотиться.
 */
function migrationTurnAvailable(state: GameState): boolean {
  const u = state.turnUse;
  return state.phase === "feeding" && !state.pendingAttack && !u.migrated &&
    !u.foodTaken && !u.combatUsed && !u.sheltered && !u.grazers.length &&
    !u.hibernated.length && state.turnTerritory === undefined;
}

function feedMigrate(state: GameState, moves: Array<{ animalId: string; to: TerritoryId }>) {
  if (!state.modules.continents || !migrationTurnAvailable(state)) return;
  const p = player(state, state.currentPlayerId);
  if (!moves.length || new Set(moves.map(m => m.animalId)).size !== moves.length || moves.some(m => {
    const a = findAnimal(state, m.animalId);
    return !a || a.ownerId !== p.id || !canMigrate(state, a) || !migrationTargets(state, a).includes(m.to);
  })) return;
  spendTurn(state, p.id);
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
    // Remoras move only through an explicit response after migration is declared.
  }
  if (!applied.length) {
    advanceFeed(state);
    return;
  }
  state.turnUse.migrated = true;
  // Миграция — раз за фазу питания на животное (иначе ход нельзя закончить).
  state.migratedThisPhase = [...(state.migratedThisPhase ?? []), ...applied.map((m) => m.animalId)];
  ev(state, { kind: "migrated", moves: applied });
  log(state, `${p.name} объявляет миграцию (${applied.length} животное(-ых)).`, "log.migrate", { name: p.name, count: applied.length });
  const index = state.players.findIndex(x => x.id === p.id);
  state.pendingMigration = {
    ownerId: p.id,
    responders: [...state.players.slice(index), ...state.players.slice(0, index)].map(x => x.id),
    routes: applied,
    followed: applied.map(m => m.animalId),
  };
  advanceMigrationResponses(state);
}

type RemoraAction = Extract<GameAction, { type: "feedRemora" }>;

function legalRemoraActions(state: GameState): RemoraAction[] {
  const pending = state.pendingMigration;
  if (!pending || state.phase !== "feeding") return [];
  const actions: RemoraAction[] = [];
  for (const a of player(state, state.currentPlayerId).animals) {
    if (!hasTrait(a, "remora") || a.hibernating || state.paralyzed?.includes(a.id) || pending.followed.includes(a.id)) continue;
    for (const route of pending.routes) {
      if (a.zoneId !== route.from) continue;
      if ((route.from === "ocean" || route.to === "ocean") && !hasTrait(a, "swimming")) continue;
      actions.push({ type: "feedRemora", animalId: a.id, migrantId: route.animalId });
    }
  }
  return actions;
}

function advanceMigrationResponses(state: GameState) {
  const pending = state.pendingMigration;
  if (!pending) return;
  while (pending.responders.length) {
    state.currentPlayerId = pending.responders[0]!;
    if (legalRemoraActions(state).length) return;
    pending.responders.shift();
  }
  state.currentPlayerId = pending.ownerId;
  delete state.pendingMigration;
  // Wait until all followers have moved before splitting pairs.
  dropCrossTerritoryPairs(state);
  maybeEndTurn(state);
}

function finishMigration(state: GameState) {
  if (!state.pendingMigration || state.phase !== "feeding") return;
  state.pendingMigration.responders.shift();
  advanceMigrationResponses(state);
}

function feedRemora(state: GameState, action: RemoraAction) {
  if (!legalRemoraActions(state).some(a => a.animalId === action.animalId && a.migrantId === action.migrantId)) return;
  const pending = state.pendingMigration!;
  const route = pending.routes.find(r => r.animalId === action.migrantId)!;
  const a = mustFind(state, action.animalId);
  a.zoneId = route.to;
  pending.followed.push(a.id);
  ev(state, { kind: "migrated", moves: [{ animalId: a.id, from: route.from, to: route.to }] });
  advanceMigrationResponses(state);
}

/** Удалить обе физические половины парной карты и учесть её ровно один раз. */
function discardPairCard(
  state: GameState,
  cardId: string,
  ownerId: number,
  pendingItems: RegenPending[] = state.pendingRegeneration ?? [],
) {
  for (const p of state.players) {
    for (const a of p.animals) a.traits = a.traits.filter((t) => t.cardId !== cardId);
  }
  for (const pending of pendingItems) {
    if (pending.traits) pending.traits = pending.traits.filter((t) => t.cardId !== cardId);
  }
  player(state, ownerId).discardCount += 1;
  log(state, `Парное свойство разъехавшихся животных уходит в сброс.`, "log.pairSplit");
}

/** Найти вторую половину пары, в том числе в очереди регенерации. */
function findPendingPair(
  state: GameState,
  pairWith: string,
  cardId: string,
  pendingItems: RegenPending[] = state.pendingRegeneration ?? [],
): { pending: RegenPending; trait: TraitInstance } | undefined {
  for (const pending of pendingItems) {
    const trait = pending.traits?.find((t) => t.pairWith === pairWith && t.cardId === cardId);
    if (trait) return { pending, trait };
  }
  return undefined;
}

/**
 * Разъехались животные с общей парной картой — карта уходит в сброс (правило).
 * Проверяем и живые животные, и тела в очереди регенерации: отсутствие второй
 * половины на столе не делает уже сброшенную карту действующей.
 */
function dropCrossTerritoryPairs(
  state: GameState,
  pendingItems: RegenPending[] = state.pendingRegeneration ?? [],
) {
  if (!state.modules.continents) return;
  const dropped = new Set<string>();
  const zoneOfPending = (pending: RegenPending) => pending.zoneId ?? "laurasia";

  const dropIfSplit = (
    cardId: string,
    pairWith: string,
    zone: TerritoryId | undefined,
    ownerId: number,
  ) => {
    if (dropped.has(cardId)) return;
    const other = findAnimal(state, pairWith);
    const otherZone = other?.zoneId ?? findPendingPair(state, pairWith, cardId, pendingItems)?.pending.zoneId;
    if (otherZone === undefined) {
      // Оборванная пара не должна оставаться на столе даже после миграции.
      discardPairCard(state, cardId, ownerId, pendingItems);
      dropped.add(cardId);
      return;
    }
    if ((zone ?? "laurasia") !== (otherZone ?? "laurasia")) {
      discardPairCard(state, cardId, ownerId, pendingItems);
      dropped.add(cardId);
    }
  };

  for (const p of state.players) {
    for (const a of p.animals) {
      for (const t of [...a.traits]) {
        if (!t.pairWith) continue;
        dropIfSplit(t.cardId, t.pairWith, a.zoneId, p.id);
      }
    }
  }
  // Пары, обе половины которых пока находятся в очереди, тоже должны быть
  // проверены после миграции: восстановление не воскресит разорванную карту.
  for (const pending of pendingItems) {
    for (const t of [...(pending.traits ?? [])]) {
      if (!t.pairWith) continue;
      const other = findAnimal(state, t.pairWith);
      const otherPending = findPendingPair(state, t.pairWith, t.cardId, pendingItems)?.pending;
      const otherZone = other?.zoneId ?? otherPending?.zoneId;
      if (otherZone !== undefined && zoneOfPending(pending) !== otherZone) {
        discardPairCard(state, t.cardId, pending.ownerId, pendingItems);
        dropped.add(t.cardId);
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
  // Пара (сотрудничество/симбиоз) переезжает целиком: связанные животные
  // держатся рядом, иначе карта пары «висит» между чужими зверями.
  const group = pairGroup(state, owner.animals[from]!);
  const ids = new Set(group.map((a) => a.id));
  const moving = owner.animals.filter((a) => ids.has(a.id));
  const rest = owner.animals.filter((a) => !ids.has(a.id));
  let to = rest.length;
  if (beforeId && !ids.has(beforeId)) {
    const bi = rest.findIndex((a) => a.id === beforeId);
    if (bi >= 0) to = bi;
  }
  owner.animals = [...rest.slice(0, to), ...moving, ...rest.slice(to)];
}

/** Перестановка с переносом между территориями («Континенты», UI перетаскиванием). */
function moveAnimalToZoneHuman(state: GameState, animalId: string, zone: TerritoryId): boolean {
  if (!state.modules.continents || state.phase !== "development") return false;
  // S4: зона обязана быть настоящей территорией партии — подставленный
  // zoneId не должен уводить животное «в никуда» (в состоянии нет такой зоны).
  if (!TERRITORIES.some((t) => t.id === zone)) return false;
  const owner = ownerOf(state, animalId);
  if (owner.id !== state.humanId) return false;
  if (zone === "ocean") return false; // океан только через свойство
  const a = mustFind(state, animalId);
  // Пара (сотрудничество/симбиоз) переезжает вместе: связанных животных
  // перенос не разрывает, иначе свойство слетело бы при смене территории.
  for (const member of pairGroup(state, a)) member.zoneId = zone;
  dropCrossTerritoryPairs(state);
  return true;
}

/**
 * Переименование своего животного (косметика, как перестановка): имя видят
 * все игроки, стабильный номер «№N» не меняется. Пустая строка или одни
 * пробелы — сброс на дефолтную подпись. Состояние игры не меняет: ни записей
 * в журнал, ни событий — только подпись на карточке.
 */
function renameOwnAnimal(state: GameState, animalId: string, name: string) {
  if (state.phase !== "development" && state.phase !== "feeding") return;
  const owner = ownerOf(state, animalId);
  if (owner.id !== state.humanId) return;
  const animal = owner.animals.find((a) => a.id === animalId);
  if (!animal) return;
  // Триммим и режем до 24: сервер валидирует длину и отклоняет длинные имена,
  // клиент режет ввод в поле — движок страховается от прямых вызовов.
  const clean = name.trim().slice(0, 24);
  if (clean) animal.name = clean;
  else delete animal.name;
}

/** Пас: игрок пропускается, пока не сделает реальное действие (или до конца фазы). */
function skipFeed(state: GameState) {
  const p = player(state, state.currentPlayerId);
  p.passedFeed = true;
  ev(state, { kind: "passed", playerId: p.id });
  log(state, `${p.name} пасует.`, "log.passed", { name: p.name });
  advanceFeed(state);
}

function applyDefense(
  state: GameState,
  action: Extract<GameAction, { type: "chooseDefense" }>,
) {
  const atk = state.pendingAttack;
  if (!atk) return;
  if (atk.plantId) {
    if (atk.choosingPlantDefense) {
      if (action.kind !== "ignore") return;
      if (!plantCounterDefenses(findAnimal(state, atk.preyId)!).some((t) => t.id === action.ignoredTraitId)) return;
      atk.ignoredTraitId = action.ignoredTraitId;
      const trait = mustFind(state, atk.preyId).traits.find((t) => t.id === action.ignoredTraitId)!;
      log(state, `Контратака игнорирует «${TRAITS[trait.type].name}».`, "log.plantIgnoreDefense", { trait: trait.type });
      continuePlantCounter(state);
      return;
    }
    if (action.kind === "ignore") return;
    applyPlantDefense(state, action);
    return;
  }
  if (action.kind === "ignore") return;
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
      log(state, `Быстрое: выпало ${roll} — животное спаслось!`, "log.runningEscape", { roll }, "good");
      paralyzeAttacker(state, carnivore, prey);
      state.pendingAttack = null;
      // Бешеная атака заканчивает раунд при любом исходе.
      if (atk.rage) advanceFeed(state);
      else maybeEndTurn(state);
      return;
    }
    log(state, `Быстрое: выпало ${roll} — хищник догнал.`, "log.runningCaught", { roll }, "bad");
    if (defenseOptions(state, prey, atk).length === 0) {
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
    // Свойство «Дурь»/«Дефекты развития» привязано к добыче: пересчитать
    // игнорируемое свойство для новой жертвы.
    atk.ignoredTraitId = hazeIgnoreTraitId(state, carnivore, mustFind(state, atk.preyId));
    ev(state, { kind: "defenseUsed", defense: "mimicry", preyId: atk.preyId });
  log(state, "Мимикрия перенаправляет атаку.", "log.mimicry");
    const nextPrey = mustFind(state, atk.preyId);
    if (defenseOptions(state, nextPrey, atk).length === 0) {
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
    paralyzeAttacker(state, carnivore, prey);
    // Бешеное животное не получает фишку даже за хвост (правило дополнения);
    // облигатный хищник кормится только добычей с охоты.
    if (!atk.rage && !hasTrait(carnivore, "obligateCarnivore")) {
      giveFood(state, carnivore, 1, "blue", { obligate: true });
      ev(state, { kind: "blueFood", animalId: carnivore.id, reason: "tailLoss" });
    }
    ev(state, { kind: "defenseUsed", defense: "tailLoss", preyId: atk.preyId });
    log(
      state,
      atk.rage
        ? "Отбрасывание хвоста: животное выжило — бешеное не получает фишку."
        : "Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.",
      atk.rage ? "log.tailLossRage" : "log.tailLoss",
      undefined,
      "good",
    );
    state.pendingAttack = null;
    if (atk.rage) advanceFeed(state);
    else maybeEndTurn(state);
    return;
  }
  ev(state, { kind: "defenseUsed", defense: "none", preyId: atk.preyId });
  resolveNoDefense(state);
  maybeEndTurn(state);
}

/**
 * Защита против хищного растения: работает как с хищником, но добыча
 * достаётся растению (фишками), а выживший проситель контратаки всё равно
 * получает свою фишку еды.
 */
function applyPlantDefense(
  state: GameState,
  action: Extract<GameAction, { type: "chooseDefense" }>,
) {
  const atk = state.pendingAttack!;
  const plant = mustFindPlant(state, atk.plantId!);
  const prey = findAnimal(state, atk.preyId);
  if (!prey) {
    state.pendingAttack = null;
    return;
  }
  const counter = Boolean(atk.plantCounter);
  const rewardSurvivor = () => {
    if (counter) {
      const req = findAnimal(state, atk.plantRequesterId ?? atk.preyId);
      if (req) givePlantFood(state, req, plant);
    }
    state.pendingAttack = null;
    maybeEndTurn(state);
  };
  if (action.kind === "running") {
    atk.usedDefenses.push("running");
    const roll = dieFor(state);
    ev(state, { kind: "defenseUsed", defense: "running", roll, preyId: atk.preyId });
    if (roll >= 4) {
      log(state, `Быстрое: выпало ${roll} — животное спаслось!`, "log.runningEscape", { roll }, "good");
      rewardSurvivor();
      return;
    }
    log(state, `Быстрое: выпало ${roll} — растение настигло.`, "log.runningCaughtPlant", { roll }, "bad");
    if (defenseOptions(state, prey, atk).length === 0) {
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
    atk.ignoredTraitId = undefined;
    ev(state, { kind: "defenseUsed", defense: "mimicry", preyId: atk.preyId });
    log(state, "Мимикрия перенаправляет атаку растения.", "log.mimicryPlant");
    const nextPrey = mustFind(state, atk.preyId);
    if (defenseOptions(state, nextPrey, atk).length === 0) {
      resolveNoDefense(state);
    }
    return;
  }
  if (action.kind === "tailLoss") {
    const tail = prey.traits.find((t) => isActive(t) && t.type === "tailLoss");
    if (tail) {
      prey.traits = prey.traits.filter((t) => t.cardId !== tail.cardId);
      ownerOf(state, prey.id).discardCount += 1;
    }
    plant.food = Math.min(PLANTS.carnivorous.maxFood, plant.food + 1);
    ev(state, { kind: "defenseUsed", defense: "tailLoss", preyId: atk.preyId });
    log(state, "Отбрасывание хвоста: животное выжило, растение получило 1 фишку.", "log.tailLossPlant", undefined, "good");
    rewardSurvivor();
    return;
  }
  ev(state, { kind: "defenseUsed", defense: "none", preyId: atk.preyId });
  resolveNoDefense(state);
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
      log(state, `Остатки кормовых баз (${total}) сгорают.`, "log.banksBurned", { total });
      for (const [k] of leftovers) state.territoryFood[k as TerritoryId] = 0;
      state.foodBank = 0;
    }
  } else if (state.foodBank > 0) {
    ev(state, { kind: "bankBurned", amount: state.foodBank });
    log(state, `Остаток кормовой базы (${state.foodBank}) сгорает.`, "log.bankBurned", { bank: state.foodBank });
    state.foodBank = 0;
  }
  state.phase = "extinction";
  if (state.paralyzed) state.paralyzed = [];
  state.extinctionDeaths = [];
  // Legacy aggregate starvation. Official rules track food per individual;
  // replacing this with floor(food / need) would invent a distribution policy.
  // See plans/audit-mutations.md for the unresolved model/UI gap.
  if (state.modules.randomMutations) {
    for (const a of allAnimals(state)) {
      if (a.hibernating) continue;
      if (a.poisoned && !hasMark(a, "antidote") && (a.population ?? 1) > 1) {
        // Яд убивает ровно одно животное вида (остаток численности выживает).
        a.population = (a.population ?? 1) - 1;
        a.poisoned = false;
        a.food = Math.min(a.food, speciesNeed(a));
        a.blueFood = Math.min(a.blueFood, a.food);
        ev(state, { kind: "populationLost", animalId: a.id, to: a.population });
        log(state, `Вид ${ownerOf(state, a.id).name} теряет животное от яда (осталось ${a.population}).`, "log.poisonDeath", { name: ownerOf(state, a.id).name, left: a.population }, "bad");
        continue;
      }
      if (isFed(a)) continue;
      const deficit = speciesNeed(a) - a.food;
      if (deficit <= 0 || deficit >= (a.population ?? 1)) continue;
      a.population = (a.population ?? 1) - deficit;
      a.food = Math.min(a.food, speciesNeed(a));
      a.blueFood = Math.min(a.blueFood, a.food);
      ev(state, { kind: "populationLost", animalId: a.id, to: a.population });
      log(
        state,
        `Вид ${ownerOf(state, a.id).name} теряет ${deficit} животное(-ых) от голода (осталось ${a.population}).`,
        "log.starved",
        { name: ownerOf(state, a.id).name, deficit, left: a.population },
        "bad",
      );
    }
  }
  const doomed = allAnimals(state).filter(
    (a) =>
      (a.poisoned && !hasMark(a, "antidote")) ||
      (hasMark(a, "poison") && !hasMark(a, "antidote")) ||
      !isFed(a),
  );
  for (const a of allAnimals(state)) {
    if (doomed.some((d) => d.id === a.id)) state.extinctionDeaths.push(a.id);
    // Сытость проверена с базовой потребностью; теперь временное отключение снято.
    for (const t of a.traits) delete t.paralyzed;
  }
  // Смерть объявляется здесь же, с точной причиной: раньше animalDied
  // прилетал только в continueExtinction, уже после удаления животных, и
  // смерть от метки «Яд» показывалась как голодная.
  for (const id of state.extinctionDeaths) {
    const a = findAnimal(state, id);
    if (!a) continue;
    const p = ownerOf(state, id);
    const cause = deathCauseOf(a);
    ev(state, { kind: "animalDied", animalId: id, cause });
    log(
      state,
      cause === "poison"
        ? `Хищник ${p.name} погибает от яда.`
        : cause === "poisonMark"
          ? `Животное ${p.name} погибает от метки «Яд».`
          : `Животное ${p.name} вымирает — не накормлено.`,
      cause === "poison" ? "log.diedPoison" : cause === "poisonMark" ? "log.diedPoisonMark" : "log.diedStarved",
      { name: p.name },
      "bad",
    );
  }
}

/** Почему животное погибает в вымирание. */
function deathCauseOf(a: Animal): "starved" | "poison" | "poisonMark" {
  if (a.poisoned && !hasMark(a, "antidote")) return "poison";
  if (hasMark(a, "poison") && !hasMark(a, "antidote")) return "poisonMark";
  return "starved";
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
      const next = stack.length
        ? [...stack].sort((x, y) => a.traits.indexOf(x) - a.traits.indexOf(y))[0]!
        : undefined;
      if (next) {
        next.disabled = true;
        log(state, `Неоплазия выключает свойство «${TRAITS[next.type].name}».`, "log.neoplasiaDisable", { trait: next.type }, "bad");
      }
      if (stack.length <= 1) {
        // Последнее свойство выключено — смерть в этой же фазе (PDF с.2).
        ev(state, { kind: "animalDied", animalId: a.id, cause: "neoplasia" });
        log(state, `Неоплазия поглощает животное ${p.name} целиком.`, "log.neoplasiaDeath", { name: p.name }, "bad");
        discardAnimal(state, a);
        continue;
      }
    }
  }
}
/** Действие continueExtinction: убирает погибших, сбрасывает годовые флаги, добирает карты. */
function continueAfterExtinction(state: GameState) {
  if (state.phase !== "extinction") return;
  // animalDied уже отправлен действием, завершившим питание (endFeeding):
  // здесь только убираем тела, чтобы UI не показывал смерть дважды.
  for (const id of state.extinctionDeaths) {
    const a = findAnimal(state, id);
    if (!a) continue;
    discardAnimal(state, a);
  }
  state.extinctionDeaths = [];
  // Регенерация: владелец обязан положить карту из руки как новое животное
  // поверх оставленных свойств (без добора за него). Счётчик восстановлений —
  // часть состояния: он сбрасывается перед восстановлением и учитывается
  // добором этого же вымирания (и «ростом» при включённых растениях).
  state.regeneratedThisYear = {};
  restoreRegenerated(state);
  for (const a of allAnimals(state)) {
    a.food = 0;
    a.blueFood = 0;
    a.hibernatedLastYear = a.hibernating;
    a.hibernating = false;
    a.receivedFoodThisYear = false;
    a.poisoned = false;
    // «Растения»: убежища и «усыпление» кончаются вместе с фазой питания.
    a.sheltered = false;
    a.sedated = false;
    // «Трава и грибы»: с выживших снимаются все метки последствий.
    returnMarksToPool(state, a);
  }
  if (state.modules.fungi) {
    // Шаг вымирания дополнения: карты флоры без фишек — в сброс, выжившие
    // травы получают фишку, эдификаторы «Континентов» удобряют флору.
    refreshFlora(state);
  }
  if (state.modules.plants) {
    // Растения гибнут после животных: грибы успевают получить фишки за погибших.
    removeDeadPlants(state);
    if (state.lastYear || (state.deck.length === 0 && state.deckEmptyAfterDraw)) {
      finishGame(state);
      return;
    }
    applyGrowth(state);
    state.phase = "growth";
    return;
  }
  if (state.lastYear || (state.deck.length === 0 && state.deckEmptyAfterDraw)) {
    finishGame(state);
    return;
  }
  drawCards(state);
}

/**
 * Вымирание растений: погибают съеденные дочиста (кроме однолетника и
 * паразита) и отравившиеся; связка микоризы выживает, если хоть у одного
 * растения в ней осталась пища (выжившие пустышки получат фишку в конце
 * роста). Паразиты гибнут вместе с хозяином.
 */
function removeDeadPlants(state: GameState) {
  const plants = state.plants ?? [];
  if (!plants.length) return;
  const byId = new Map(plants.map((p) => [p.id, p]));
  const dead = new Set<string>();
  for (const pl of plants) {
    if (pl.doomed) dead.add(pl.id);
  }
  // Компоненты связности микориз (union-find).
  const parent = new Map<string, string>(plants.map((p) => [p.id, p.id]));
  const find = (x: string): string => {
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r)!;
    return r;
  };
  const union = (x: string, y: string) => {
    const rx = find(x);
    const ry = find(y);
    if (rx !== ry) parent.set(rx, ry);
  };
  for (const pl of plants) {
    for (const t of pl.traits) {
      if (t.type === "micorrhiza" && t.pairWith && byId.has(t.pairWith)) {
        union(pl.id, t.pairWith);
      }
    }
  }
  const compHasFood = new Set<string>();
  for (const pl of plants) {
    if (pl.food > 0) compHasFood.add(find(pl.id));
  }
  for (const pl of plants) {
    if (dead.has(pl.id) || pl.food > 0) continue;
    if (pl.kind === "annual") continue; // выживает: его схема роста вернёт фишку
    if (pl.kind === "parasite") continue; // гибнет только с хозяином
    if (plantHasTrait(pl, "micorrhiza") && compHasFood.has(find(pl.id))) {
      pl.starvedRevive = true; // выживет и получит фишку в конце роста
      continue;
    }
    dead.add(pl.id);
  }
  // Каскад паразитов: погиб хозяин — гибнут его паразиты (в т.ч. паразиты паразитов).
  let cascaded = true;
  while (cascaded) {
    cascaded = false;
    for (const pl of plants) {
      if (dead.has(pl.id) || pl.kind !== "parasite" || !pl.hostId) continue;
      const host = byId.get(pl.hostId);
      if (host && dead.has(host.id)) {
        dead.add(pl.id);
        cascaded = true;
      }
    }
  }
  for (const id of dead) {
    const pl = byId.get(id)!;
    ev(state, {
      kind: "plantDied",
      plantId: id,
      cause: pl.doomed ? "poison" : pl.kind === "parasite" ? "host" : "eaten",
    });
    log(
      state,
      `Растение ${PLANTS[pl.kind].name} погибает${
        pl.doomed
          ? " — съело ядовитое животное"
          : pl.kind === "parasite"
            ? " — вместе с хозяином"
            : " — съедено дочиста"
      }.`,
      pl.doomed ? "log.plantDiedPoison" : pl.kind === "parasite" ? "log.plantDiedHost" : "log.plantDiedEaten",
      { plant: pl.kind },
      "bad",
    );
  }
  if (dead.size) {
    state.plants = plants.filter((p) => !dead.has(p.id));
    state.plantDiscard = (state.plantDiscard ?? 0) + dead.size;
  }
}

/**
 * Вымирание флоры «Травы и грибов»: карты без красных фишек уходят в сброс,
 * каждая выжившая ТРАВА (не гриб) получает 1 фишку (максимум 4). Эдификаторы
 * «Континентов» добавляют по фишке каждой карте флоры своей локации — аналог
 * удобрения растений из главы «Континенты + Растения» официального FAQ.
 */
function refreshFlora(state: GameState) {
  const flora = state.flora ?? [];
  const dead = new Set<string>();
  for (const f of flora) {
    if (f.food <= 0) dead.add(f.id);
  }
  for (const id of dead) {
    const f = flora.find((x) => x.id === id)!;
    ev(state, { kind: "floraDied", floraId: id });
    log(state, `Карта ${FLORA[f.kind].name} без фишек уходит в сброс.`, "log.floraDiscarded", { flora: f.kind }, "bad");
  }
  if (dead.size) {
    state.flora = flora.filter((f) => !dead.has(f.id));
    state.floraDiscard = (state.floraDiscard ?? 0) + dead.size;
  }
  for (const f of state.flora ?? []) {
    if (FLORA[f.kind].isFungus) continue;
    if (f.food < FLORA_MAX_TOKENS) {
      const before = f.food;
      f.food += 1;
      ev(state, { kind: "floraGrew", floraId: f.id, from: before, to: f.food });
    }
  }
  if (state.modules.continents) {
    for (const a of allAnimals(state)) {
      if (a.hibernating) continue;
      if (!hasTrait(a, "edificator")) continue;
      const zone = a.zoneId ?? "laurasia";
      if (zone === "ocean") continue;
      for (const f of state.flora ?? []) {
        if ((f.zoneId ?? "gondwana") !== zone) continue;
        if (f.food < FLORA_MAX_TOKENS) f.food += 1;
      }
      log(state, `Эдификатор удобряет флору ${zone === "laurasia" ? "Лавразии" : "Гондваны"}.`, zone === "laurasia" ? "log.edificatorFloraLaurasia" : "log.edificatorFloraGondwana", undefined, "good");
    }
  }
  log(state, "Флора: травы подрастают, пустые карты уходят в сброс.", "log.floraGrowth", undefined, "good");
}

/**
 * Фаза роста: каждое растение разрастается по своей схеме, лиана — по числу
 * не-лиан, выжившие пустышки микоризы получают фишку, убежища
 * восстанавливаются, эдификаторы удобряют растения локации, добавляются
 * новые растения из колоды.
 */
function applyGrowth(state: GameState) {
  const plants = state.plants ?? [];
  for (const pl of plants) {
    const def = PLANTS[pl.kind];
    const before = pl.food;
    if (pl.kind === "liana") {
      const others = plants.filter((p) => p.kind !== "liana").length;
      pl.food = Math.min(def.maxFood, others);
    } else if (pl.kind === "fungus" || pl.kind === "carnivorous" || pl.kind === "parasite") {
      // грибы кормятся гибелью животных, хищное — своей добычей,
      // паразит — перекинутыми фишками; сами не разрастаются
    } else {
      pl.food = growthTarget(def, pl.food);
    }
    if (pl.food !== before) {
      ev(state, { kind: "plantGrew", plantId: pl.id, from: before, to: pl.food });
    }
  }
  // Конец роста: выжившие без фишек (микориза) получают по одной.
  for (const pl of plants) {
    if (pl.starvedRevive && pl.food === 0) {
      pl.food = 1;
      pl.starvedRevive = false;
      ev(state, { kind: "plantGrew", plantId: pl.id, from: 0, to: 1 });
    } else {
      pl.starvedRevive = false;
    }
  }
  // Убежища восстанавливаются до вместимости; хищное растение снова может атаковать.
  for (const pl of plants) {
    pl.shelters = shelterCapacity(pl);
    pl.attackedThisYear = false;
    pl.doomed = false;
  }
  // «Континенты»: эдификатор добавляет по фишке каждому растению своей локации.
  if (state.modules.continents) {
    for (const a of allAnimals(state)) {
      if (a.hibernating) continue;
      if (!hasTrait(a, "edificator")) continue;
      const zone = a.zoneId ?? "laurasia";
      if (zone === "ocean") continue;
      for (const pl of plants) {
        if ((pl.zoneId ?? "gondwana") !== zone) continue;
        if (pl.food < PLANTS[pl.kind].maxFood) pl.food += 1;
      }
      log(state, `Эдификатор удобряет растения ${zone === "laurasia" ? "Лавразии" : "Гондваны"}.`, zone === "laurasia" ? "log.edificatorPlantsLaurasia" : "log.edificatorPlantsGondwana", undefined, "good");
    }
  }
  addNewPlants(state, plantTable(state.players.length).add);
  log(state, "Фаза роста: растения разрастаются.", "log.plantsGrowth", undefined, "good");
}

/** Действие continueGrowth: показать рост и начать новый год (добор карт). */
function continueGrowth(state: GameState) {
  if (state.phase !== "growth") return;
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
  const stats = state.regeneratedThisYear ?? {};
  if (pend?.length) state.pendingRegeneration = null;
  for (const item of pend ?? []) {
    const p = player(state, item.ownerId);
    if (!p) continue;
    // Старый снимок содержит только id карт: восстановить типы без догадок
    // невозможно. Не тратим корпус и не теряем оставшиеся данные.
    if (!item.traits) {
      state.pendingRegeneration = [...(state.pendingRegeneration ?? []), item];
      continue;
    }
    const traits = item.traits.map((t) => ({ ...t }));
    const card = p.hand.length
      ? p.hand.pop()
      : p.blindDeck?.length
        ? p.blindDeck.pop()
        : state.deck.pop();
    if (!card) {
      // Ни руки, ни колоды: свойства лежат до конца игры и дают очки —
      // очередь хранится в состоянии, попытка повторится в следующем вымирании.
      state.pendingRegeneration = [...(state.pendingRegeneration ?? []), item];
      continue;
    }
    const animal: Animal = {
      id: nid(state, "a"),
      ownerId: p.id,
      cardId: card.id,
      no: nextAnimalNo(p),
      traits,
      food: 0,
      blueFood: 0,
      fatTokens: 0,
      hibernating: false,
      hibernatedLastYear: false,
      receivedFoodThisYear: false,
      poisoned: false,
      seed: card.id.length * 17 + p.id * 13,
      ...(state.modules.continents
        ? { zoneId: item.zoneId ?? "laurasia" }
        : {}),
    };
    p.animals.push(animal);
    // Зеркальная половина сохранённой парной карты указывает на новый корпус,
    // в том числе если второй участник пары ещё ждёт восстановления.
    if (item.animalId) {
      const linkedTraits = [
        ...allAnimals(state).flatMap((a) => a.traits),
        ...pend!.flatMap((pending) => pending.traits ?? []),
      ];
      for (const t of linkedTraits) {
        if (t.pairWith === item.animalId) t.pairWith = animal.id;
      }
    }
    // Восстановленный корпус возвращается в зону съедения. Если партнёр уже
    // уехал, общая карта должна уйти в сброс, а не снова стать межтерриториальной.
    dropCrossTerritoryPairs(state, pend ?? []);
    // За регенерировавшее животное карты в добор не идут (правило).
    stats[p.id] = (stats[p.id] ?? 0) + 1;
    ev(state, { kind: "regenerated", ownerId: p.id });
    log(state, `${p.name} восстанавливает регенерировавшее животное.`, "log.regenerated", { name: p.name }, "good");
  }
  state.regeneratedThisYear = stats;
}

function drawCards(state: GameState) {
  const start = state.firstPlayerId;
  const n = state.players.length;
  let emptied = state.deck.length === 0;
  const counts = new Array<number>(n).fill(0);
  for (let k = 0; k < n; k++) {
    const idx = (start + k) % n;
    const p = state.players[idx]!;
    if (state.modules.randomMutations) {
      // «Случайные мутации»: добор — «число животных + 2» на дно личной колоды.
      const pop = p.animals.reduce((s, a) => s + (a.population ?? 1), 0);
      let want = Math.max(1, pop - (state.regeneratedThisYear?.[p.id] ?? 0) + 2);
      if (p.animals.length === 0 && (p.blindDeck ?? []).length === 0) {
        // Спасение на вылет всегда возвращает новую колоду из десяти карт.
        // С «Континентами» две из них сразу становятся животными.
        if (state.modules.continents) {
          for (let i = 0; i < 10; i++) {
            const c = state.deck.pop();
            if (!c) {
              emptied = true;
              break;
            }
            p.blindDeck!.push(c);
            counts[idx]! += 1;
          }
          playRescueAnimal(state, p, "laurasia");
          playRescueAnimal(state, p, "gondwana");
          continue;
        }
        want = 10;
      }
      for (let i = 0; i < want; i++) {
        const c = state.deck.pop();
        if (!c) {
          emptied = true;
          break;
        }
        p.blindDeck!.unshift(c);
        counts[idx]! += 1;
      }
      continue;
    }
    // Добор «выжившие + 1»; регенерировавшие животные в счёт не идут.
    let want = Math.max(1, p.animals.length - (state.regeneratedThisYear?.[p.id] ?? 0) + 1);
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
  passTurnTo(state, state.firstPlayerId);
  state.year += 1;
  state.phase = "development";
  state.devStartPlaySeq = state.playSeq;
  log(
    state,
    state.lastYear
      ? `Год ${state.year} — последний. Первым ходит ${player(state, state.firstPlayerId).name}.`
      : `Год ${state.year}. Первым ходит ${player(state, state.firstPlayerId).name}. Колода: ${state.deck.length}.`,
    state.lastYear ? "log.newYearLast" : "log.newYear",
    state.lastYear
      ? { year: state.year, name: player(state, state.firstPlayerId).name }
      : { year: state.year, name: player(state, state.firstPlayerId).name, deck: state.deck.length },
    state.lastYear ? "bad" : "good",
  );
  startMutationsDevTurn(state, state.firstPlayerId);
}

/** «10 карт»: две из них сразу становятся животными — по одному на континент. */
function playRescueAnimal(state: GameState, p: Player, zone: TerritoryId) {
  const card = state.modules.randomMutations ? p.blindDeck?.pop() : p.hand.shift();
  if (!card) return;
  const animal: Animal = {
    id: nid(state, "a"),
    ownerId: p.id,
    cardId: card.id,
    no: nextAnimalNo(p),
    traits: [],
    food: 0,
    blueFood: 0,
    fatTokens: 0,
    hibernating: false,
    hibernatedLastYear: false,
    receivedFoodThisYear: false,
    poisoned: false,
    seed: card.id.length * 17 + p.id * 13 + p.animals.length,
    population: 1,
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
    const seenCards = new Set<string>();
    for (const a of p.animals) {
      animals += 2 * (a.population ?? 1);
      for (const t of a.traits) {
        if (t.disabled || seenCards.has(t.cardId)) continue;
        seenCards.add(t.cardId);
        traits += 1;
        extras += TRAITS[t.type].scoreBonus;
      }
    }
    for (const pending of state.pendingRegeneration ?? []) {
      if (pending.ownerId !== p.id) continue;
      for (const t of pending.traits ?? []) {
        if (t.disabled || seenCards.has(t.cardId)) continue;
        seenCards.add(t.cardId);
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
  // «Трава и грибы»: флора — полноправный участник, 2 очка за выжившую карту
  // и 1 за каждую фишку на ней; при равенстве очков преимущество у флоры.
  if (state.modules.fungi && state.flora) {
    const cards = state.flora.length;
    const food = state.flora.reduce((s, f) => s + f.food, 0);
    const total = cards * 2 + food;
    state.scores.push({
      playerId: -1,
      name: "Трава и грибы",
      animals: cards * 2,
      traits: 0,
      extras: food,
      total,
      discard: state.floraDiscard ?? 0,
    });
    if (total >= best.total) {
      state.winnerIds = [-1];
      state.phase = "gameOver";
      log(state, `Победа: Трава и грибы (${total} очков).`, "log.floraWin", { total }, "good");
      // Событие финала: UI проигрывает звук/анимацию завершения партии.
      ev(state, { kind: "gameFinished", winnerIds: state.winnerIds });
      return;
    }
  }
  state.phase = "gameOver";
  log(
    state,
    winners.length > 1
      ? `Ничья: ${winners.map((w) => w.name).join(", ")}.`
      : `Победа: ${winners[0]!.name} (${winners[0]!.total} очков).`,
    winners.length > 1 ? "log.draw" : "log.win",
    winners.length > 1
      ? { names: winners.map((w) => w.name).join(", ") }
      : { name: winners[0]!.name, total: winners[0]!.total },
    "good",
  );
  ev(state, { kind: "gameFinished", winnerIds: state.winnerIds });
}

export function currentActor(state: GameState): Player | null {
  if (state.phase === "gameOver") return null;
  if (state.pendingAttack) return player(state, state.pendingAttack.waitingFor);
  if (state.phase === "foodBank" || state.phase === "extinction" || state.phase === "growth") return null;
  return player(state, state.currentPlayerId);
}
