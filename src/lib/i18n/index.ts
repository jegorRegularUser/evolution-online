/**
 * i18n «Эволюции»: два языка (ru — по умолчанию, en), плоские ключи,
 * подстановка параметров `{name}`, реактивность через Zustand.
 *
 * API:
 *   useT()            — ГЛАВНЫЙ хук для компонентов: подписывает на смену
 *                       языка и возвращает функцию перевода, привязанную к
 *                       СНАПШОТУ языка. Во время гидратации снапшот — «ru»
 *                       (getServerSnapshot), поэтому разметка совпадает с SSR
 *                       без hydration mismatch; после монтирования снапшот
 *                       переключается на сохранённый язык. Все строки в JSX —
 *                       только через него.
 *   t(key, params?)   — перевод по ЖИВОМУ состоянию стора: для обработчиков
 *                       событий, эффектов и кода вне React. В рендере не
 *                       использовать — при стриминговом SSR поздние границы
 *                       гидратируются уже после initLang, и живой язык
 *                       разошёлся бы с SSR-разметкой.
 *   useLang()         — хук текущего языка ("ru" | "en") — тоже снапшот.
 *   setLang(lang)     — переключить язык + сохранить в localStorage
 *                       (ключ `evo-lang`) + поправить <html lang>.
 *   toggleLang()      — ru ↔ en.
 *   initLang()        — применить сохранённый/определённый язык после
 *                       монтирования (вызывается один раз в __root.tsx).
 *   detectLang()      — автоопределение по navigator.language.
 *   translate(lang, key, params?) — чистая функция перевода.
 *   pointsWord(lang, n) / playersWord(lang, n) / placeLabel(lang, n) —
 *                       формы множественных чисел и порядковые номера мест.
 *
 * Словари: ru.ts (канонические ключи, `as const` — tsc ловит опечатки),
 * en.ts (обязан покрыть все ключи ru — проверяет Record<keyof typeof ru, string>).
 * Термины игры (свойства, флора, растения, метки, территории, достижения) —
 * terms.ts с хелперами traitName(id, lang?)/... для следующей волны
 * локализации стора и игровых экранов.
 *
 * SSR: первый рендер всегда ru (см. store.ts), после монтирования применяется
 * сохранённый язык; <html lang> ставится инлайн-скриптом LANG_BOOT_SCRIPT
 * до первой отрисовки.
 */
import { useCallback } from "react";
import type { TKey } from "./ru";
import { en } from "./en";
import { ru } from "./ru";
import { useLangStore, type Lang } from "./store";

const DICTS: Record<Lang, Record<TKey, string>> = { ru, en };

/** Параметры подстановки: `{name}` в значении словаря. */
export type TParams = Record<string, string | number>;

/** Чистый перевод: язык задан явно, без стора. */
export function translate(lang: Lang, key: TKey, params?: TParams): string {
  const raw = DICTS[lang][key] ?? ru[key] ?? key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (m, name: string) =>
    params[name] !== undefined && params[name] !== null ? String(params[name]) : m,
  );
}

/** Тип функции перевода — общий для t, useT и хелперов. */
export type TFn = (key: TKey, params?: TParams) => string;

/** Перевод по живому языку стора: обработчики, эффекты, код вне рендера. */
export function t(key: TKey, params?: TParams): string {
  return translate(useLangStore.getState().lang, key, params);
}

/**
 * Хук перевода: подписывает компонент на смену языка и возвращает t,
 * привязанный к снапшоту языка. Внутри компонента всегда используйте его:
 * во время гидратации снапшот — «ru», и разметка совпадает с SSR.
 */
export function useT(): TFn {
  const lang = useLangStore((s) => s.lang);
  return useCallback((key: TKey, params?: TParams) => translate(lang, key, params), [lang]);
}

/** Хук текущего языка: "ru" | "en" (снапшот — при гидратации «ru»). */
export function useLang(): Lang {
  return useLangStore((s) => s.lang);
}

export { currentLang, detectLang, initLang, setLang, toggleLang, useLangStore, LANG_STORAGE_KEY, LANG_BOOT_SCRIPT } from "./store";
export type { Lang } from "./store";
export type { TKey } from "./ru";

export {
  achievementDesc,
  achievementName,
  floraDesc,
  floraName,
  markDesc,
  markName,
  plantDesc,
  plantName,
  territoryName,
  traitDesc,
  traitName,
} from "./terms";

// ── число-слова ─────────────────────────────────────────────────────────────

/** Русская форма множественного числа: 1 очко / 2 очка / 5 очков. */
function pluralRu(n: number, one: string, few: string, many: string): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b === 1) return one;
  if (b >= 2 && b <= 4) return few;
  return many;
}

function pluralEn(n: number, one: string, many: string): string {
  return Math.abs(n) === 1 ? one : many;
}

/** «очко/очка/очков» | «point/points» — для фраз про разрыв в счёте. */
export function pointsWord(lang: Lang, n: number): string {
  return lang === "en" ? pluralEn(n, "point", "points") : pluralRu(n, "очко", "очка", "очков");
}

/** «игрок/игрока/игроков» | «player/players» — для фраз про разделённое место. */
export function playersWord(lang: Lang, n: number): string {
  return lang === "en" ? pluralEn(n, "player", "players") : pluralRu(n, "игрок", "игрока", "игроков");
}

/** Английский порядковый суффикс: 1st/2nd/3rd/4th/11th. */
function ordinalEn(n: number): string {
  const v = Math.abs(n) % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (v % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/** «2-е место» | «2nd place» — подпись места для финала и статистики. */
export function placeLabel(lang: Lang, n: number): string {
  return lang === "en" ? `${n}${ordinalEn(n)} place` : `${n}-е место`;
}
