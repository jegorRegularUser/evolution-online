/**
 * Реестр модификаторов стола (волна 2, design-expansion-pack.md §1).
 *
 * Паттерн — по прецеденту «Случайных мутаций»: опциональные поля состояния
 * (GameState.rules / .mutators / .wildWorld) + файл-реестр + точки в движке.
 * В отличие от модулей у мутаторов нет действий — они меняют условия работы
 * уже существующих фаз, поэтому реестр хранит описания и состав, а эффекты
 * вплетены в движок у отмеченных точек (см. plans/audit-modifiers.md и
 * plans/audit-wild-world.md).
 *
 * Общий лимит — 3 слота на стол (§0.10): каждое правило, каждый мутатор и
 * «Дикий мир» целиком занимают по слоту. Считает их modifier-compatibility.ts.
 */
import type { TKey } from "../lib/i18n/ru.ts";
import type { MutatorId, TableRuleId, TableRules, WildEventId } from "./types.ts";

/** Порядок правил в лобби и при подсчёте слотов. */
export const TABLE_RULE_IDS: readonly TableRuleId[] = [
  "pack",
  "hungrySeason",
  "abundance",
  "startHand",
];

/** Классическая стартовая рука (без правила startHand). */
export const CLASSIC_HAND_SIZE = 6;

export interface MutatorDefinition {
  id: MutatorId;
  /** Ключи лобби (название и описание) — ru.ts (канон) + en.ts. */
  titleKey: TKey;
  descKey: TKey;
}

/** Реестр мутаторов v1: экономика еды и темп. +2 слота заложены под плейтесты. */
export const MUTATORS: readonly MutatorDefinition[] = [
  {
    id: "scavengers",
    titleKey: "lobby.mutator.scavengers",
    descKey: "lobby.mutator.scavengers.hint",
  },
  {
    id: "rapidEvolution",
    titleKey: "lobby.mutator.rapidEvolution",
    descKey: "lobby.mutator.rapidEvolution.hint",
  },
];

export const MUTATOR_IDS: readonly MutatorId[] = MUTATORS.map((m) => m.id);

/** Описание события «Дикого мира» — для прогноза и будущих бейджей/баннеров. */
export interface WildEventDefinition {
  id: WildEventId;
  /** Ключ строки прогноза в журнале (с подстановкой года). */
  plannedKey: TKey;
  /** Ключ строки активации в журнале. */
  startedKey: TKey;
  /** Ключ лобби-описания пак работает один на всех событий; см. lobby.wildWorld. */
  titleKey: TKey;
}

/**
 * Релизный состав v1 — 6 машинно определённых событий (§1.3). «Пожар» входит
 * в пул розыгрыша только с «Травой и грибами» (флора есть — есть что жечь),
 * «Метеорит» редкий и с pity-гарантией не позже 8-го события серии.
 */
export const WILD_EVENTS: Record<WildEventId, WildEventDefinition> = {
  iceAge: {
    id: "iceAge",
    plannedKey: "log.wild.planned.iceAge",
    startedKey: "log.wild.started.iceAge",
    titleKey: "log.wild.started.iceAge",
  },
  goldenAge: {
    id: "goldenAge",
    plannedKey: "log.wild.planned.goldenAge",
    startedKey: "log.wild.started.goldenAge",
    titleKey: "log.wild.started.goldenAge",
  },
  resettlement: {
    id: "resettlement",
    plannedKey: "log.wild.planned.resettlement",
    startedKey: "log.wild.started.resettlement",
    titleKey: "log.wild.started.resettlement",
  },
  cropFailure: {
    id: "cropFailure",
    plannedKey: "log.wild.planned.cropFailure",
    startedKey: "log.wild.started.cropFailure",
    titleKey: "log.wild.started.cropFailure",
  },
  meteorite: {
    id: "meteorite",
    plannedKey: "log.wild.planned.meteorite",
    startedKey: "log.wild.started.meteorite",
    titleKey: "log.wild.started.meteorite",
  },
  wildfire: {
    id: "wildfire",
    plannedKey: "log.wild.planned.wildfire",
    startedKey: "log.wild.started.wildfire",
    titleKey: "log.wild.started.wildfire",
  },
};

/** Шанс редкого «Метеорита» при очередном розыгрыше (до pity-форса). */
export const METEORITE_CHANCE = 0.15;
/** Pity: не позже 8-го события серии (счёт с 1). */
export const METEORITE_PITY = 8;

/** Сколько слотов занимают столовые правила (правило = слот, §0.10). */
export function rulesSlots(rules?: TableRules): number {
  if (!rules) return 0;
  let n = 0;
  if (rules.pack) n += 1;
  if (rules.hungrySeason) n += 1;
  if (rules.abundance) n += 1;
  if (rules.startHand !== undefined) n += 1;
  return n;
}

/** Стартовая рука с учётом правила: явный выбор стола бьёт классику модулей. */
export function startingHandSize(rules?: TableRules, plants?: boolean): number {
  return rules?.startHand ?? (plants ? 8 : CLASSIC_HAND_SIZE);
}

/** Есть ли мутатор в состоянии (инлайновые проверки движка и ботов). */
export function hasMutator(state: { mutators?: MutatorId[] }, id: MutatorId): boolean {
  return state.mutators?.includes(id) ?? false;
}
