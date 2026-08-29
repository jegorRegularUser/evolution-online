import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Интерактивное обучение: пять коротких слайдов по фазам года на
 * подготовленных артах (public/img/tutorial). Закрывается Esc и кликом по
 * затемнению — как правила; на последнем слайде можно сразу начать партию.
 */

interface Slide {
  title: string;
  /** Путь к арт-иллюстрации; на первом слайде вместо неё схема фаз года. */
  art?: string;
  paragraphs: string[];
}

const PHASES = ["Развитие", "Кормовая база", "Питание", "Вымирание"];

const SLIDES: Slide[] = [
  {
    title: "Как играть в «Эволюцию»",
    paragraphs: [
      "Вы разводите виды и ведёте их через голодные годы. Год состоит из четырёх фаз — они показаны в шапке стола.",
      "Побеждает тот, чья популяция после последнего года наберёт больше очков: 2 очка за каждое животное вида и по очку за каждое свойство.",
      "Партия занимает 10–20 минут: выберите число игроков, сложность ботов и дополнения — и вперёд.",
    ],
  },
  {
    art: "/img/tutorial/place-card.jpg",
    title: "Развитие",
    paragraphs: [
      "Разыгрывайте по одной карте за круг: как новое животное или как свойство на свой вид. Двойная карта — одно из двух свойств на выбор.",
      "Подсветка подсказывает, куда карту можно положить; наведение на чип свойства открывает его правило. Парные свойства (симбиоз, сотрудничество) кладутся между двумя животными.",
      "Когда все спасуют, фаза заканчивается.",
    ],
  },
  {
    art: "/img/tutorial/feeding.jpg",
    title: "Питание",
    paragraphs: [
      "Кормовая база бросается кубиками — это красные фишки. Накормите животных по потребности: кликните по подсвеченной карточке или кнопке «Взять еду».",
      "Хищники берут синие фишки с добычи, «жировой запас» откладывает еду на голодный год. Накормленное животное свойствами больше не пользуется.",
      "Фаза идёт по кругу, пока есть еда и желающие: один ход — до нажатия «Закончить ход».",
    ],
  },
  {
    art: "/img/tutorial/hunt.jpg",
    title: "Охота",
    paragraphs: [
      "Кнопка «Охота» у хищника подсвечивает допустимых жертв: крупного не взять, водное — только в океане, стадность защищается числом.",
      "Жертва может спастись: «Быстрое» бросает кубик, маскировка прячется, хвостоплавник отбрасывает хвост. Съеденная добыча даёт хищнику +2 синие фишки.",
      "Защищаться нужно вовремя — стол сам спросит модальным окном, когда нападут на вас.",
    ],
  },
  {
    art: "/img/tutorial/extinction.jpg",
    title: "Вымирание и финал",
    paragraphs: [
      "Ненакормленные животные погибают; за выживших добираются карты из колоды. Когда колода пуста — наступает последний год.",
      "В финале очки считают по живым животным, свойствам и бонусам: хищник и большой вес дают дополнительно.",
      "Счёт каждого игрока виден на его табло рядом со сбросом — следите за отрывом.",
    ],
  },
];

export function TutorialScreen({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
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
          <div aria-hidden className="flex h-40 shrink-0 items-center justify-center gap-2 bg-gradient-to-b from-good/15 to-transparent px-6 sm:h-52">
            {PHASES.map((p, k) => (
              <span key={p} className="flex items-center gap-2">
                <span className="flex items-center rounded-[var(--radius-sm)] border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-fg">
                  <span className="mr-1.5 font-display text-[10px] text-muted">{k + 1}</span>
                  {p}
                </span>
                {k < PHASES.length - 1 ? <span className="text-muted">→</span> : null}
              </span>
            ))}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
            Обучение · {i + 1} из {SLIDES.length}
          </p>
          <h2 className="mt-2 text-2xl">{slide.title}</h2>
          <div className="mt-3 space-y-2.5 text-sm text-muted">
            {slide.paragraphs.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-7">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s, k) => (
              <span
                key={s.title}
                className={cn("h-1.5 rounded-full transition-colors", k === i ? "w-5 bg-accent" : "w-1.5 bg-ink/25")}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI((v) => Math.max(v - 1, 0))}>
              <ChevronLeft className="size-4" />
              Назад
            </Button>
            {last ? (
              <Button size="sm" onClick={onStart}>
                <Play className="size-4" />
                Начать партию
              </Button>
            ) : (
              <Button size="sm" onClick={() => setI((v) => Math.min(v + 1, SLIDES.length - 1))}>
                Далее
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
