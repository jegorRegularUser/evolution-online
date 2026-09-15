import type { ReactNode } from "react";
import { LOGO } from "@/lib/art";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sfx";
import { toggleLang, useLang, useT } from "@/lib/i18n";

export interface TopBarProps {
  /** Подпись под «Эволюция»: год и фаза в партии, «Правильные игры · Кнорре» в меню. */
  subtitle?: string;
  /**
   * Короткая подпись для телефона: в шапке стола мало места, поэтому
   * на <sm показывается она, а полная — с sm и шире.
   */
  subtitleShort?: string;
  /** Правый слот: кнопки, тумблеры, чипы. */
  children?: ReactNode;
  /** Свой левый блок вместо лого и названия (лого и подпись при этом не рендерятся). */
  left?: ReactNode;
  className?: string;
}

/**
 * Компактный переключатель языка для шапки. Кнопка показывает код целевого
 * языка («EN» когда интерфейс русский, «RU» когда английский) — коротко
 * даже на 390px, а направление понятно из подписи и содержимого.
 * Текущий язык хранит i18n-стор: все шапки на странице переключаются сразу.
 */
export function LangToggle() {
  const lang = useLang();
  const tt = useT();
  const target = lang === "ru" ? "EN" : "RU";
  return (
    <button
      type="button"
      data-lang-toggle={target.toLowerCase()}
      aria-label={tt("lang.switch")}
      title={tt("lang.switch")}
      onClick={() => {
        sfx.play("click");
        toggleLang();
      }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg flex h-9 max-xl:h-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface px-2 font-display text-xs font-semibold tracking-[0.14em] text-fg hover:bg-surface-2 transition-colors duration-[var(--motion-fast)]"
    >
      {target}
    </button>
  );
}

/**
 * Общая шапка меню и игрового стола: лого, название и правый слот действий.
 * Классы совпадают с прежними шапками из screens.tsx и game-app.tsx.
 * Переключатель языка встроен в самый конец правого слота — он виден во всех
 * трёх местах использования шапки (меню, лобби, партия).
 */
export function TopBar({ subtitle, subtitleShort, children, left, className }: TopBarProps) {
  const lang = useLang();
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/90 px-3 py-2.5 backdrop-blur-sm sm:px-5",
        className,
      )}
    >
      {left ? (
        <div className="flex min-w-0 flex-1 items-center gap-3">{left}</div>
      ) : (
        <>
          <img
            src={LOGO}
            alt=""
            className="size-8 shrink-0 rounded-full border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="font-display text-lg leading-none">
              {/* Название игры — тоже переводится, но длина почти не меняется. */}
              {lang === "en" ? "Evolution" : "Эволюция"}
            </div>
            {/* На телефоне подпись переносится, а не обрезается: места в шапке
                мало, а «Правильные игры · Кнорре» терять многоточие не должен. */}
            {subtitle ? (
              <div className="mt-1 text-xs leading-tight text-muted sm:truncate">
                {subtitleShort ? (
                  <>
                    <span className="sm:hidden">{subtitleShort}</span>
                    <span className="hidden sm:inline">{subtitle}</span>
                  </>
                ) : (
                  subtitle
                )}
              </div>
            ) : null}
          </div>
        </>
      )}
      {/* Правый слот на узких экранах сжимается и переносится: шапка не
          задаёт документу минимальную ширину (иначе мобильный Chrome
          выбирает layout viewport шире экрана и уводит стол за кадр). */}
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-1">
        {children}
        <LangToggle />
      </div>
    </header>
  );
}
