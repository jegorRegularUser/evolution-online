/**
 * Стор языка: единственный источник текущего языка для всей игры.
 *
 * Отдельный модуль (не в index.ts), чтобы terms.ts мог читать язык без
 * циклического импорта словарей.
 *
 * SSR-контракт: на сервере и в первом клиентском рендере язык всегда «ru»
 * — так разметка клиента совпадает с SSR и hydration не расходится.
 * Сохранённый/определённый язык применяется после монтирования
 * (initLang в useEffect корня, как имя игрока в net-screens.tsx).
 */
import { create } from "zustand";

export type Lang = "ru" | "en";

/** Ключ localStorage для выбранного языка. */
export const LANG_STORAGE_KEY = "evo-lang";

export interface LangState {
  lang: Lang;
}

export const useLangStore = create<LangState>(() => ({ lang: "ru" }));

/** Текущий язык без подписки (для вызовов вне React). */
export function currentLang(): Lang {
  return useLangStore.getState().lang;
}

/**
 * Автоопределение по настройкам устройства: основной язык браузера
 * `en*` → en, иначе ru. Смотрим ТОЛЬКО navigator.language: список принятых
 * языков почти всегда содержит en в хвосте (русскоязычные системы держат
 * en-US второй раскладкой клавиатуры), и по нему игра ошибочно включала
 * английский у русскоязычных игроков.
 * На сервере (нет navigator) — ru.
 */
export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "ru";
  const primary = navigator.language ?? "";
  return primary.toLowerCase().startsWith("en") ? "en" : "ru";
}

/** Прочитать сохранённый язык; неверное/пустое значение — null. */
function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return v === "en" || v === "ru" ? v : null;
  } catch {
    // приватный режим — просто нет доступа
    return null;
  }
}

/**
 * Установить язык: обновить стор, сохранить выбор и поправить <html lang>.
 * Вне React и внутри — одно и то же поведение.
 */
export function setLang(lang: Lang): void {
  useLangStore.setState({ lang });
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // приватный режим — просто не сохранится
  }
  if (typeof document !== "undefined") document.documentElement.lang = lang;
}

/** Переключить ru ↔ en. */
export function toggleLang(): void {
  setLang(currentLang() === "ru" ? "en" : "ru");
}

/**
 * Применить язык после монтирования (клиент): сохранённый выбор или
 * автоопределение по устройству. Вызывается один раз из эффекта в корне
 * приложения (см. LangInit в src/routes/__root.tsx).
 */
export function initLang(): void {
  const lang = storedLang() ?? detectLang();
  useLangStore.setState({ lang });
  if (typeof document !== "undefined") document.documentElement.lang = lang;
}

/**
 * Инлайн-скрипт для <head>: ставит <html lang> до первой отрисовки, чтобы
 * скринридеры и браузер видели правильный язык сразу (разметку React
 * он не трогает — та переключается после гидратации через initLang).
 * Вставляется в __root.tsx; <html suppressHydrationWarning> глушит
 * расхождение атрибута с SSR-значением «ru».
 */
export const LANG_BOOT_SCRIPT =
  '(function(){try{var l=localStorage.getItem("evo-lang");' +
  'if(l!=="en"&&l!=="ru"){l=(navigator.language||"").toLowerCase().indexOf("en")===0?"en":"ru";}' +
  'document.documentElement.lang=l;}catch(e){}})();';
