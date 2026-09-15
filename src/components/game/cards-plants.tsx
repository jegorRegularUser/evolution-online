import { memo } from "react";
import { PLANTS } from "@/game/plants";
import { TRAITS } from "@/game/traits";
import type { GameState, Plant, TerritoryId } from "@/game/types";
import { PLANT_ART } from "@/lib/art";
import { cn } from "@/lib/utils";
import { plantDesc, plantName, territoryName, traitDesc, traitName, traitShort, useLang, useT } from "@/lib/i18n";
import { PlantGlyph, FoodCube, TraitGlyph } from "./icons";
import { TraitTooltip, type TipDef } from "./trait-tip";
import { useTraitTip } from "./use-trait-tip";

/** Плашка свойства растения — как чип свойства животного, но на растении. */
export const PlantTraitChip = memo(function PlantTraitChip({
  type,
  fresh,
}: {
  type: Parameters<typeof TraitGlyph>[0]["id"];
  fresh?: boolean;
}) {
  const lang = useLang();
  const def = TRAITS[type];
  const tip = useTraitTip({ isolateClick: true });
  return (
    <span
      ref={(el) => {
        tip.anchorRef.current = el;
      }}
      {...tip.triggerProps}
      data-trait-chip
      className={cn(
        "anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] bg-leaf/20 px-1.5 text-[11px] font-medium text-leaf ring-1 ring-inset ring-leaf/40 outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        fresh && "chip-fresh",
      )}
    >
      <TraitGlyph id={type} className="size-3.5" />
      {traitShort(type, lang)}
      {tip.anchorRect ? (
        <TraitTooltip
          def={{ ...def, name: traitName(type, lang), description: traitDesc(type, lang) }}
          anchorRect={tip.anchorRect}
          id={tip.tipId}
        />
      ) : null}
    </span>
  );
});

/**
 * Карточка растения: арт/глиф вида, счётчик фишек и убежищ, свойства.
 * Кликабельна в режимах интентов (взять еду / убежище / атака растения).
 */
export const PlantCard = memo(function PlantCard({
  plant,
  highlight,
  dimmed,
  selected,
  onClick,
  dying,
  fresh,
}: {
  plant: Plant;
  highlight?: boolean;
  dimmed?: boolean;
  selected?: boolean;
  onClick?: () => void;
  /** Погибнет в текущем вымирании. */
  dying?: boolean;
  /** Появилось в текущем году. */
  fresh?: boolean;
}) {
  const lang = useLang();
  const t = useT();
  const def = PLANTS[plant.kind];
  const art = PLANT_ART[plant.kind];
  // Подсказка растения — то же мини-окно, что у свойств: наведение/фокус.
  // Тап по карточке выбирает растение (питание), поэтому без toggleOnTap.
  const tip = useTraitTip({ toggleOnTap: false });
  const tipDef: TipDef = {
    id: plant.kind,
    name: `${plantName(plant.kind, lang)} · ${t("card.plant")}`,
    description: plantDesc(plant.kind, lang),
    image: art,
  };
  const interactive = Boolean(onClick);
  return (
    <div
      data-plant-id={plant.id}
      ref={(el) => {
        tip.anchorRef.current = el;
      }}
      {...tip.triggerProps}
      aria-label={`${plantName(plant.kind, lang)} — ${t("card.plant")}`}
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
        "plant-card anim-card-in relative flex w-[132px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border border-ink/12 bg-parchment text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        selected ? "border-clay ring-2 ring-clay/40" : "",
        highlight ? "border-accent ring-2 ring-accent" : "",
        dimmed ? "opacity-45" : "",
        dying ? "dying-pulse border-danger/60" : "",
        interactive && "hover:-translate-y-0.5",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-parchment-2">
        {art ? (
          <img src={art} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-ink-soft">
            <PlantGlyph kind={plant.kind} className="size-10" />
          </span>
        )}
        <span className="absolute left-1 top-1 rounded-full bg-ink/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-parchment">
          {plantName(plant.kind, lang)}
        </span>
        {def.carnivoreEdible ? (
          <span
            className="absolute right-1 top-1 size-4 rounded-full border border-ink/30 bg-food-yellow/80 text-center text-[10px] leading-4"
            title={t("card.carnivoreEdible")}
          >
            🍎
          </span>
        ) : null}
        {plant.kind === "carnivorous" && plant.attackedThisYear ? (
          <span
            className="absolute bottom-1 right-1 rounded-full bg-clay/85 px-1.5 text-[9px] font-medium text-parchment"
            title={t("card.plantAttackedTitle")}
          >
            {t("card.plantAttacked")}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <span className="flex items-center gap-0.5" title={t("card.foodTokens", { n: plant.food, m: def.maxFood })}>
          {Array.from({ length: Math.min(plant.food, 5) }).map((_, i) => (
            <FoodCube key={i} tone="green" className="token-pop size-3" />
          ))}
          {plant.food > 5 ? <span className="text-[10px] tabular-nums">+{plant.food - 5}</span> : null}
          {plant.food === 0 ? <span className="text-[10px] text-ink-soft">{t("card.noFood")}</span> : null}
        </span>
        {plant.shelters > 0 ? (
          <span className="ml-auto flex items-center gap-0.5 rounded-full bg-leaf/25 px-1.5 text-[10px] font-semibold text-leaf" title={t("card.sheltersFree", { n: plant.shelters })}>
            <span className="size-2.5 rounded-full border border-leaf/60 bg-leaf/40" />
            {plant.shelters}
          </span>
        ) : null}
      </div>
      {plant.traits.length ? (
        <div className="flex flex-wrap gap-1 px-2 pb-2">
          {plant.traits.map((tr) => (
            <PlantTraitChip key={tr.id} type={tr.type} />
          ))}
        </div>
      ) : (
        <div className="pb-2 pl-2 text-[10px] text-ink-soft">
          {fresh ? t("card.newPlant") : t("card.noTraits")}
        </div>
      )}
      {tip.anchorRect ? (
        <TraitTooltip def={tipDef} anchorRect={tip.anchorRect} id={tip.tipId} />
      ) : null}
    </div>
  );
});

/** Полоса растений: общий стол растений (с «Континентами» — по континентам). */
export function PlantStrip({
  state,
  highlights,
  dying,
  onPlantClick,
  freshSince,
  zone,
}: {
  state: GameState;
  /** Id подсвеченных растений (легальные цели интента). */
  highlights: Set<string>;
  dying?: Set<string>;
  onPlantClick?: (plant: Plant) => void;
  /** Растения с playSeq больше этого появились в текущем году. */
  freshSince?: number;
  /** «Континенты»: показать растения только этого континента. */
  zone?: TerritoryId;
}) {
  const t = useT();
  const lang = useLang();
  const plants = (state.plants ?? []).filter((p) =>
    zone ? (p.zoneId ?? "gondwana") === zone : true,
  );
  if (!plants.length) return null;
  const interactive = Boolean(onPlantClick);
  return (
    <section
      aria-label={
        zone
          ? t("card.plantsStripZone", { zone: territoryName(zone, lang) })
          : t("card.plantsStrip")
      }
      className="paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3"
    >
      <div className="flex w-full items-center justify-between text-xs text-muted">
        <span className="font-medium">
          {zone
            ? t("card.plantsZone", { zone: territoryName(zone, lang) })
            : t("card.plantsCommon")}
        </span>
        {zone ? null : (
          <span className="tabular-nums">
            {t("card.plantDeck", {
              n: state.plantDeckCount ?? state.plantDeck?.length ?? 0,
              m: state.plantDiscard ?? 0,
            })}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {plants.map((p) => (
          <PlantCard
            key={p.id}
            plant={p}
            highlight={highlights.has(p.id)}
            dimmed={interactive && highlights.size > 0 && !highlights.has(p.id)}
            dying={dying?.has(p.id)}
            onClick={interactive ? () => onPlantClick?.(p) : undefined}
            fresh={freshSince !== undefined && p.playSeq > freshSince}
          />
        ))}
      </div>
    </section>
  );
}
