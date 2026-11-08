/**
 * Политика совместимости модификаторов стола (волна 2) — по образцу
 * module-compatibility.ts: запрет пар + общий лимит, проверять только
 * новые settings/create/start; сохранённые партии не нормализуем молча.
 *
 * Лимит: 3 слота на стол (§0.10) — столовые правила + мутаторы + «Дикий мир»
 * суммарно (урок Hearthstone 100%→50% и Slay the Spire 4→3).
 */
import { MUTATOR_IDS, rulesSlots } from "./modifiers.ts";
import type { EnabledModules, MutatorId, TableRuleId, TableRules } from "./types.ts";

export const MODIFIER_SLOT_LIMIT = 3;

/** Полный конфиг модификаций стола — то, что приходит из настроек комнаты. */
export interface ModifierConfig {
  modules?: EnabledModules;
  rules?: TableRules;
  /** Объект флагов (как MODULES) или готовый массив — см. shared.ts. */
  mutators?: Partial<Record<MutatorId, boolean>> | MutatorId[];
  wildWorld?: boolean;
}

/** Массив включённых мутаторов из любой формы настроек. */
export function mutatorList(mutators?: ModifierConfig["mutators"]): MutatorId[] {
  if (!mutators) return [];
  return Array.isArray(mutators)
    ? mutators
    : MUTATOR_IDS.filter((id) => mutators[id]);
}

export function modifierSlotsUsed(config: ModifierConfig): number {
  const mutators = Array.isArray(config.mutators)
    ? config.mutators.length
    : mutatorList(config.mutators).length;
  return rulesSlots(config.rules) + mutators + (config.wildWorld ? 1 : 0);
}

/** Идентификаторы включённых столовых правил (для подсчёта и UI). */
export function enabledRuleIds(rules?: TableRules): TableRuleId[] {
  if (!rules) return [];
  const ids: TableRuleId[] = [];
  if (rules.pack) ids.push("pack");
  if (rules.hungrySeason) ids.push("hungrySeason");
  if (rules.abundance) ids.push("abundance");
  if (rules.startHand !== undefined) ids.push("startHand");
  return ids;
}

/**
 * Запрещённые пары (только реальные конфликты, не вкусовщина):
 *  1. «Стая» × «Случайные мутации» — модуль сам выдаёт три стартовых вида,
 *     «старт с двумя животными» при нём не определён;
 *  2. «Голодный сезон» × «Изобилие» — правила тянут базу в противоположные
 *     стороны: пара съедает два слота и взаимно гасится.
 */
export function modifierCompatibilityError(
  config: ModifierConfig,
  lang: "ru" | "en" = "ru",
): string | null {
  const used = modifierSlotsUsed(config);
  if (used > MODIFIER_SLOT_LIMIT) {
    return lang === "en"
      ? `Too many modifications: ${used} selected, the table allows ${MODIFIER_SLOT_LIMIT} slots (rules, mutators and Wild World combined).`
      : `Слишком много модификаций: выбрано ${used}, стол позволяет ${MODIFIER_SLOT_LIMIT} слота (правила, мутаторы и «Дикий мир» суммарно).`;
  }
  if (config.rules?.pack && config.modules?.randomMutations) {
    return lang === "en"
      ? "\"Pack\" cannot be combined with Random Mutations: the module already deals three starting species."
      : "«Стая» несовместима со «Случайными мутациями»: модуль сам выдаёт три стартовых вида.";
  }
  if (config.rules?.hungrySeason && config.rules?.abundance) {
    return lang === "en"
      ? "\"Hungry Season\" and \"Abundance\" pull the food base in opposite directions — do not combine them."
      : "«Голодный сезон» и «Изобилие» тянут кормовую базу в противоположные стороны — не сочетайте их.";
  }
  return null;
}

export function assertModifierCompatibility(config: ModifierConfig): void {
  const error = modifierCompatibilityError(config);
  if (error) throw new Error(error);
}
