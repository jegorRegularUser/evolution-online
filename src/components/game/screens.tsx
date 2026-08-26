import { BookOpen, Play, RotateCcw, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NetMenuPanel } from "@/components/game/net-screens";
import { TRAITS } from "@/game/traits";
import type { Difficulty, ScoreBreakdown } from "@/game/types";
import { BG, DARK_ART, LOGO, TRAIT_ART } from "@/lib/art";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";

const SPEEDS: Array<["slow" | "normal" | "fast", string, string]> = [
  ["slow", "Медленно", "Боты думают дольше, фазы показываются с паузами"],
  ["normal", "Обычно", "Комфортный настольный темп"],
  ["fast", "Быстро", "Для тех, кто ждёт только своего хода"],
];

/** Зарезервировано под следующий заход: официальные правила дополнений. */
const MODULES: Array<[string, string]> = [
  ["Континенты", "зоны размещения и расселение животных"],
  ["Растения", "дополнительные источники еды на столе"],
  ["Грибы", "питание, распад и новые цепочки еды"],
  ["Случайные мутации", "скрытые мутации и неоплазия с растущим вирусом"],
];

export function MenuScreen({
  onStart,
  onRules,
}: {
  onStart: (players: number, difficulty: Difficulty) => void;
  onRules: () => void;
}) {
  const [players, setPlayers] = useState(2);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const speed = useGameStore((s) => s.speed);
  const setSpeed = useGameStore((s) => s.setSpeed);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <img src={BG.menu} alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/55 to-bg" />
      </div>
      <div className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-5 py-16">
        <div className="mb-5 flex justify-center">
          <img
            src={LOGO}
            alt=""
            className="size-24 rounded-full border border-border-strong object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      <p className="relative mb-3 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
        Правильные игры · Кнорре
      </p>
      <h1 className="relative text-center text-5xl text-fg sm:text-6xl">Эволюция</h1>
      <p className="relative mx-auto mt-3 max-w-md text-center text-muted">
        Настольная игра о происхождении видов. Комбинируйте свойства, кормите популяцию и переживайте голодные годы.
      </p>

      <div className="relative mt-10 space-y-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7">
        <NetMenuPanel />

        <fieldset>
          <legend className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
            <Users className="size-4" />
            Игроков за столом
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPlayers(n)}
                className={cn(
                  "h-12 rounded-[var(--radius-md)] border text-sm font-medium",
                  players === n
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg text-fg hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">
            Вы против {players - 1 === 1 ? "одного бота" : `${players - 1} ботов`}
          </p>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-muted">Сложность</legend>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["easy", "Проще"],
                ["normal", "Обычная"],
                ["hard", "Жёстче"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDifficulty(id)}
                className={cn(
                  "h-12 rounded-[var(--radius-md)] border text-sm font-medium",
                  difficulty === id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg text-fg hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-muted">Темп игры</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {SPEEDS.map(([id, label, hint]) => (
              <button
                key={id}
                type="button"
                title={hint}
                onClick={() => setSpeed(id)}
                className={cn(
                  "h-11 rounded-[var(--radius-md)] border text-sm font-medium",
                  speed === id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg text-fg hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-muted">Дополнения</legend>
          <ul className="grid gap-2 sm:grid-cols-2">
            {MODULES.map(([name, hint]) => (
              <li
                key={name}
                title={`${name}: ${hint}. Готовится — официальный пересказ правил следующим обновлением.`}
                className="flex cursor-not-allowed items-center justify-between rounded-[var(--radius-md)] border border-dashed border-border bg-bg px-3 py-2.5 opacity-60"
              >
                <span className="text-sm text-fg">{name}</span>
                <span className="rounded-full bg-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">скоро</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" size="lg" onClick={() => onStart(players, difficulty)}>
            <Play className="size-4" />
            Начать год
          </Button>
          <Button variant="secondary" size="lg" onClick={onRules}>
            <BookOpen className="size-4" />
            Правила
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}

export function RulesPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-5 sm:rounded-[var(--radius-xl)] sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-2xl">Правила</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Закрыть
          </Button>
        </div>
        <div className="space-y-4 text-sm text-muted">
          <p>
            Базовая русская «Эволюция» (Правильные игры, 2010). Колода 84 карты, 2–4 игрока. Побеждает тот, чья популяция набрала больше очков после последнего года.
          </p>
          <h3 className="text-fg">Ход года</h3>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong className="text-fg">Развитие.</strong> По кругу выкладывайте по одной карте: новое животное или свойство. Свойства кладутся лицом вверх — все видят, кто что выложил. Двойные карты — одно из двух свойств. Паразит только на чужих. Пас — и больше не играете в этой фазе; когда спасовали все, фаза заканчивается.
            </li>
            <li>
              <strong className="text-fg">Кормовая база.</strong> 2 игрока: 1d6+2. 3: 2d6. 4: 2d6+2.
            </li>
            <li>
              <strong className="text-fg">Питание.</strong> В свой ход — ровно одно действие: взять 1 фишку на животное (сытое берёт только в пустой жировой запас), напасть хищником (раз за фазу), пиратство, топтун (уничтожить 1 фишку из базы), спячка. Превращение жира в еду — свободное действие, ход не тратит. Пас пропускает вас; фаза заканчивается, когда база пуста, все накормлены, все пасанули или никому больше нельзя ходить.
            </li>
            <li>
              <strong className="text-fg">Вымирание.</strong> Ненакормленные погибают. Добор: число выживших + 1. Если никого нет и рука пуста — 6 карт. Пустая колода — последний год.
            </li>
          </ol>
          <h3 className="text-fg">Очки</h3>
          <p>2 за каждое выжившее животное, 1 за каждое свойство. Дополнительно: хищник и большой +1, паразит +2. Ничья — по картам в сбросе.</p>
          <h3 className="text-fg">Свойства</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {Object.values(TRAITS).map((t) => (
              <li key={t.id} className="flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3">
                <img
                  src={TRAIT_ART[t.id]}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "h-[68px] w-12 shrink-0 rounded-[var(--radius-xs)] object-cover object-top",
                    DARK_ART.has(t.id) && "bg-ink object-contain p-0.5",
                  )}
                />
                <div>
                  <div className="font-medium text-fg">{t.name}</div>
                  <div className="mt-1 text-xs leading-snug">{t.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function GameOverScreen({
  scores,
  winnerIds,
  humanId,
  onAgain,
  onMenu,
}: {
  scores: ScoreBreakdown[];
  winnerIds: number[];
  humanId: number;
  onAgain: () => void;
  onMenu: () => void;
}) {
  const won = winnerIds.includes(humanId);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-4">
      <img
        src={won ? BG.victory : BG.extinction}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative w-full max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted">Конец эволюции</p>
        <h2 className="mt-2 text-3xl">{won ? "Ваша популяция доминирует" : "Вас вытеснили"}</h2>
        <ul className="mt-6 space-y-2">
          {scores.map((s, i) => (
            <li
              key={s.playerId}
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-3",
                winnerIds.includes(s.playerId) ? "border-accent bg-accent/10" : "border-border bg-bg",
              )}
            >
              <div>
                <div className="font-medium">
                  {i + 1}. {s.name}
                </div>
                <div className="text-xs text-muted">
                  животные {s.animals} · свойства {s.traits} · бонус {s.extras} · сброс {s.discard}
                </div>
              </div>
              <div className="font-display text-2xl tabular-nums">{s.total}</div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={onAgain}>
            <RotateCcw className="size-4" />
            Ещё партия
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onMenu}>
            В меню
          </Button>
        </div>
      </div>
    </div>
  );
}
