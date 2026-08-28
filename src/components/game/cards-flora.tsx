import { memo } from "react";
import { FLORA, FLORA_MAX_TOKENS, MARKS } from "@/game/flora";
import type { FloraCard, GameState, MarkKind, TerritoryId } from "@/game/types";
import { FLORA_ART, MARK_ART } from "@/lib/art";
import { cn } from "@/lib/utils";
import { FloraGlyph, FoodCube } from "./icons";
import { TraitTooltip, type TipDef } from "./trait-tip";
import { useTraitTip } from "./use-trait-tip";

/** Цветовые акценты меток последствий (тон из реестра MARKS). */
const MARK_TONE: Record<MarkKind, string> = {
  poison: "border-danger/50 bg-danger/15 text-clay",
  antidote: "border-good/50 bg-good/15 text-good",
  madness: "border-virus/50 bg-virus/15 text-virus",
  rage: "border-danger/60 bg-danger/20 text-clay",
  sleep: "border-border-strong/60 bg-ink/10 text-muted",
  thryn: "border-leaf/50 bg-leaf/15 text-leaf",
  haze: "border-food-yellow/60 bg-food-yellow/15 text-ink",
  pacifism: "border-water/50 bg-water/15 text-water",
};

/** Чип метки последствий на животном: жетон-картинка и цвет по виду, правило — в подсказке. */
export const MarkChip = memo(function MarkChip({ mark }: { mark: MarkKind }) {
  const def = MARKS[mark];
  const tip = useTraitTip({ isolateClick: true });
  const tipDef: TipDef = {
    id: mark,
    name: `Метка «${def.name}»`,
    description: def.description,
    image: MARK_ART[mark],
  };
  return (
    <span
      ref={(el) => {
        tip.anchorRef.current = el;
      }}
      {...tip.triggerProps}
      data-mark-chip
      className={cn(
        "anim-chip-in relative inline-flex h-5 items-center gap-1 rounded-[var(--radius-xs)] border px-1.5 text-[10px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        MARK_TONE[mark],
      )}
    >
      <img src={MARK_ART[mark]} alt="" loading="lazy" className="size-3.5 shrink-0 rounded-full object-cover" />
      {def.short}
      {tip.anchorRect ? <TraitTooltip def={tipDef} anchorRect={tip.anchorRect} id={tip.tipId} /> : null}
    </span>
  );
});

/**
 * Карточка флоры «Травы и грибов»: гриб или трава, фишки еды (до 4),
 * метка, которую даёт карта. Кликабельна в режимах интентов
 * (взять еду / топтун).
 */
export const FloraCardView = memo(function FloraCardView({
  flora,
  highlight,
  dimmed,
  selected,
  onClick,
}: {
  flora: FloraCard;
  highlight?: boolean;
  dimmed?: boolean;
  selected?: boolean;
  onClick?: () => void;
}) {
  const def = FLORA[flora.kind];
  const art = FLORA_ART[flora.kind];
  // Подсказка — то же мини-окно, что у свойств; тап выбирает карту (питание).
  const tip = useTraitTip({ toggleOnTap: false });
  const tipDef: TipDef = {
    id: flora.kind,
    name: `${def.name} · ${def.isFungus ? "гриб" : "трава"}`,
    description: def.description,
    image: art,
  };
  const interactive = Boolean(onClick);
  return (
    <div
      data-flora-id={flora.id}
      ref={(el) => {
        tip.anchorRef.current = el;
      }}
      {...tip.triggerProps}
      aria-label={`${def.name} — ${def.isFungus ? "гриб" : "трава"}`}
      role={interactive ? "button" : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        "plant-card anim-card-in relative flex w-[120px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border bg-parchment text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        def.isFungus ? "border-virus/30" : "border-leaf/40",
        selected ? "border-clay ring-2 ring-clay/40" : "",
        highlight ? "border-accent ring-2 ring-accent" : "",
        dimmed ? "opacity-45" : "",
        interactive && "hover:-translate-y-0.5",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-parchment-2">
        {art ? (
          <img src={art} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              def.isFungus ? "text-virus" : "text-leaf",
            )}
          >
            <FloraGlyph kind={flora.kind} className="size-10" />
          </span>
        )}
        <span
          className={cn(
            "absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-parchment",
            def.isFungus ? "bg-virus/80" : "bg-leaf/80",
          )}
        >
          {def.name}
        </span>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <span className="flex items-center gap-0.5" title={`Фишек еды: ${flora.food} (максимум ${FLORA_MAX_TOKENS})`}>
          {Array.from({ length: flora.food }).map((_, i) => (
            <FoodCube key={i} tone="red" className="token-pop size-3" />
          ))}
          {flora.food === 0 ? <span className="text-[10px] text-ink-soft">без еды</span> : null}
        </span>
        {def.mark ? (
          <img
            src={MARK_ART[def.mark]}
            alt={`Метка «${MARKS[def.mark].name}»`}
            loading="lazy"
            title={`Даёт метку «${MARKS[def.mark].name}»`}
            className="ml-auto size-4 shrink-0 rounded-full object-cover ring-1 ring-border-strong/40"
          />
        ) : null}
      </div>
      {tip.anchorRect ? (
        <TraitTooltip def={tipDef} anchorRect={tip.anchorRect} id={tip.tipId} />
      ) : null}
    </div>
  );
});

/** Полоса флоры: общий стол трав и грибов (с «Континентами» — по континентам). */
export function FloraStrip({
  state,
  highlights,
  onFloraClick,
  zone,
}: {
  state: GameState;
  /** Id подсвеченных карт (легальные цели интента). */
  highlights: Set<string>;
  onFloraClick?: (flora: FloraCard) => void;
  /** «Континенты»: показать флору только этого континента. */
  zone?: TerritoryId;
}) {
  const flora = (state.flora ?? []).filter((f) =>
    zone ? (f.zoneId ?? "gondwana") === zone : true,
  );
  if (!flora.length) return null;
  const interactive = Boolean(onFloraClick);
  return (
    <section
      aria-label={zone ? `Трава и грибы (${zone === "laurasia" ? "Лавразия" : "Гондвана"})` : "Трава и грибы"}
      className="paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3"
    >
      <div className="flex w-full items-center justify-between text-xs text-muted">
        <span className="font-medium">
          {zone ? (zone === "laurasia" ? "Флора Лавразии" : "Флора Гондваны") : "Трава и грибы · общие"}
        </span>
        {zone ? null : (
          <span className="tabular-nums">
            колода {state.floraDeckCount ?? state.floraDeck?.length ?? 0} · сброс {state.floraDiscard ?? 0}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {flora.map((f) => (
          <FloraCardView
            key={f.id}
            flora={f}
            highlight={highlights.has(f.id)}
            dimmed={interactive && highlights.size > 0 && !highlights.has(f.id)}
            onClick={interactive ? () => onFloraClick?.(f) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
