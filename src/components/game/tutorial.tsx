import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t, useT } from "@/lib/i18n";

/**
 * Интерактивное обучение: пять коротких слайдов по фазам года на
 * подготовленных артах (public/img/tutorial). Закрывается Esc и кликом по
 * затемнению — как правила; на последнем слайде можно сразу начать партию.
 * Тексты слайдов — ключи словаря (tutorial.s1..s5), поэтому переключение
 * языка меняет их без перезагрузки.
 */

interface Slide {
  title: Parameters<typeof t>[0];
  /** Путь к арт-иллюстрации; на первом слайде вместо неё схема фаз года. */
  art?: string;
  paragraphs: Array<Parameters<typeof t>[0]>;
}

const PHASES: Array<Parameters<typeof t>[0]> = [
  "tutorial.phase.dev",
  "tutorial.phase.foodBase",
  "tutorial.phase.feed",
  "tutorial.phase.ext",
];

const SLIDES: Slide[] = [
  {
    title: "tutorial.s1.title",
    paragraphs: ["tutorial.s1.p1", "tutorial.s1.p2", "tutorial.s1.p3"],
  },
  {
    art: "/img/tutorial/place-card.jpg",
    title: "tutorial.s2.title",
    paragraphs: ["tutorial.s2.p1", "tutorial.s2.p2", "tutorial.s2.p3"],
  },
  {
    art: "/img/tutorial/feeding.jpg",
    title: "tutorial.s3.title",
    paragraphs: ["tutorial.s3.p1", "tutorial.s3.p2", "tutorial.s3.p3"],
  },
  {
    art: "/img/tutorial/hunt.jpg",
    title: "tutorial.s4.title",
    paragraphs: ["tutorial.s4.p1", "tutorial.s4.p2", "tutorial.s4.p3"],
  },
  {
    art: "/img/tutorial/extinction.jpg",
    title: "tutorial.s5.title",
    paragraphs: ["tutorial.s5.p1", "tutorial.s5.p2", "tutorial.s5.p3"],
  },
];

export function TutorialScreen({ onClose }: { onClose: () => void }) {
  const tt = useT();
  const [i, setI] = useState(0);
  const slide = SLIDES[i]!;
  const last = i === SLIDES.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, SLIDES.length - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-border bg-surface sm:rounded-[var(--radius-xl)]">
        {slide.art ? (
          <img src={slide.art} alt="" className="h-40 w-full shrink-0 object-cover sm:h-52" />
        ) : (
          // Схема фаз: на телефоне чипы переносятся (flex-wrap), а не
          // обрезаются краями карточки — четыре фазы со стрелками в 390px
          // в одну строку не влезают.
          <div
            aria-hidden
            className="flex h-40 shrink-0 flex-wrap content-center items-center justify-center gap-2 bg-gradient-to-b from-good/15 to-transparent px-6 sm:h-52"
          >
            {PHASES.map((p, k) => (
              <span key={p} className="flex items-center gap-2">
                <span className="flex items-center rounded-[var(--radius-sm)] border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-fg">
                  <span className="mr-1.5 font-display text-[10px] text-muted">{k + 1}</span>
                  {tt(p)}
                </span>
                {k < PHASES.length - 1 ? <span className="text-muted">→</span> : null}
              </span>
            ))}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
            {tt("tutorial.counter", { i: i + 1, n: SLIDES.length })}
          </p>
          <h2 className="mt-2 text-2xl">{tt(slide.title)}</h2>
          <div className="mt-3 space-y-2.5 text-sm text-muted">
            {slide.paragraphs.map((p, k) => (
              <p key={k}>{tt(p)}</p>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-7">
          {/* Пагинация: капсула темнее карточки и светлые точки — видно на любом
              фоне; каждая точка — кнопка с нормальной хит-зоной. */}
          <div
            role="tablist"
            aria-label={tt("tutorial.slidesAria")}
            className="flex items-center gap-0.5 rounded-full bg-ink/30 p-1"
          >
            {SLIDES.map((s, k) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={tt("tutorial.slideAria", { k: k + 1, title: tt(s.title) })}
                title={tt(s.title)}
                onClick={() => setI(k)}
                // Зона нажатия 44×44 при прежнем виде: отрицательные поля
                // компенсируют размер, точки стоят на том же месте.
                className="-mx-1.5 grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              >
                <span
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-[var(--motion-fast)]",
                    k === i ? "w-5 bg-accent" : "w-1.5 bg-parchment/40 hover:bg-parchment/70",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI((v) => Math.max(v - 1, 0))}>
              <ChevronLeft className="size-4" />
              {tt("tutorial.back")}
            </Button>
            {last ? (
              // Обучение — только чтение: кнопку «Начать партию» убрали, чтобы
              // туториал не запускал игру (в лобби старт решает хост).
              <Button size="sm" onClick={onClose}>
                {tt("tutorial.done")}
              </Button>
            ) : (
              <Button size="sm" onClick={() => setI((v) => Math.min(v + 1, SLIDES.length - 1))}>
                {tt("tutorial.next")}
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
