import { memo } from "react";
import { TRAITS } from "@/game/traits";
import type { Animal, Card, TraitId } from "@/game/types";
import { foodNeeded, hasTrait, isFed } from "@/game/queries";
import { cn } from "@/lib/utils";
import { DARK_ART, TOKEN, TRAIT_ART, speciesArt } from "@/lib/art";
import { TraitGlyph } from "./icons";
import { TraitTooltip } from "./trait-tip";
import { useTraitTip } from "./use-trait-tip";

export const FoodDots = memo(function FoodDots({ animal }: { animal: Animal }) {
  const need = foodNeeded(animal);
  const filled = Math.min(animal.food, need);
  return (
    <div className="flex items-center gap-1.5" title={`Еда ${animal.food} / ${need}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: need }).map((_, i) =>
          i < filled ? (
            <img key={i} src={TOKEN.meat} alt="" className="token-pop size-3.5 rounded-full" />
          ) : (
            <span key={i} className="inline-block size-3.5 rounded-full border border-ink/40 bg-parchment-2" />
          ),
        )}
        {animal.food > need
          ? Array.from({ length: animal.food - need }).map((_, i) => (
              <img key={`x${i}`} src={TOKEN.plant} alt="" className="token-pop size-3.5 rounded-full" />
            ))
          : null}
        {Array.from({ length: animal.fatTokens }).map((_, i) => (
          <img key={`f${i}`} src={TOKEN.fat} alt="" className="size-3.5 rounded-full" />
        ))}
      </div>
      <span className="text-[10px] tabular-nums text-ink-soft">
        {animal.food}/{need}
      </span>
    </div>
  );
});

/**
 * Чип свойства. По правилам свойства выкладываются лицом вверх — чип всегда
 * открытый; отключённое (disabled) — серое, перечёркнутое, без действия;
 * fresh — вложено в текущем круге развития: точка «новое».
 *
 * Наведение/фокус открывает мини-окно с правилом над чипом; на тач-устройствах
 * окно переключается тапом по чипу (тап не выбирает животное).
 */
export const TraitChip = memo(function TraitChip({
  type,
  pair,
  disabled,
  fresh,
}: {
  type: TraitId;
  pair?: boolean;
  disabled?: boolean;
  fresh?: boolean;
}) {
  const def = TRAITS[type];
  const tip = useTraitTip({ isolateClick: true });
  const anchorRef = (el: HTMLElement | null) => { tip.anchorRef.current = el; };
  const bubble = tip.anchorRect ? (
    <TraitTooltip def={def} pair={pair} disabled={disabled} anchorRect={tip.anchorRect} id={tip.tipId} />
  ) : null;
  return (
    <span
      ref={anchorRef}
      {...tip.triggerProps}
      data-trait-chip
      className={cn(
        "anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        disabled
          ? "bg-ink/5 text-ink-soft line-through decoration-ink-soft/60"
          : type === "carnivore" || type === "parasite"
            ? "bg-clay/15 text-clay"
            : type === "fatTissue"
              ? "bg-food-yellow/20 text-ink"
              : "bg-ink/8 text-ink",
        fresh && !disabled && "chip-fresh",
      )}
    >
      <TraitGlyph id={type} className="size-3.5" />
      {def.short}
      {pair ? <span className="text-[9px] opacity-70">пара</span> : null}
      {fresh ? <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-clay" /> : null}
      {bubble}
    </span>
  );
});

/**
 * Карточка животного. Клик обрабатывается делегированием на контейнере
 * (data-animal-id), поэтому компонент можно мемоизировать: он перерисовывается
 * только при смене своих примитивных пропсов или самого объекта животного.
 */
export const AnimalCard = memo(function AnimalCard({
  animal,
  name,
  selected,
  dimmed,
  highlight,
  dying,
  freshSince,
}: {
  animal: Animal;
  name?: string;
  selected?: boolean;
  dimmed?: boolean;
  highlight?: boolean;
  /** Животное погибнет в текущей стадии вымирания. */
  dying?: boolean;
  /** Свойства с playSeq больше этого значения вложены в текущем круге развития. */
  freshSince?: number;
}) {
  const fed = isFed(animal);
  return (
    <div
      data-animal-id={animal.id}
      className={cn(
        "animal-card anim-card-in relative w-[168px] shrink-0 cursor-pointer rounded-[var(--radius-lg)] border bg-parchment p-3 text-left text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        selected ? "border-clay ring-2 ring-clay/40" : "border-ink/10",
        highlight ? "ring-2 ring-accent" : "",
        dimmed ? "opacity-45" : "",
        dying ? "dying-pulse border-danger/60" : "",
        "hover:-translate-y-0.5",
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="font-display text-sm tracking-tight">
          {hasTrait(animal, "carnivore") ? "Хищник" : hasTrait(animal, "swimming") ? "Водное" : "Животное"}
        </span>
        {animal.hibernating ? (
          <span className="rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide">сон</span>
        ) : fed ? (
          <span className="rounded-full bg-good/20 px-1.5 text-[10px] font-medium uppercase tracking-wide text-good">сыто</span>
        ) : (
          <span className="rounded-full bg-clay/15 px-1.5 text-[10px] font-medium uppercase tracking-wide text-clay">голод</span>
        )}
      </div>
      <div className="mb-2 flex justify-center">
        <img
          src={speciesArt({
            swimming: hasTrait(animal, "swimming"),
            carnivore: hasTrait(animal, "carnivore"),
            bulky: hasTrait(animal, "highBodyWeight"),
          })}
          alt=""
          loading="lazy"
          className="size-16 rounded-full border border-ink/25 object-cover object-top shadow-inner"
        />
      </div>
      <FoodDots animal={animal} />
      <div className="mt-2 flex flex-wrap gap-1">
        {animal.traits.length === 0 ? (
          <span className="text-[11px] text-ink-soft">без свойств</span>
        ) : (
          animal.traits.map((t) => (
            <TraitChip
              key={t.id}
              type={t.type}
              pair={Boolean(t.pairWith)}
              disabled={t.disabled}
              fresh={freshSince !== undefined && t.playSeq > freshSince ? true : undefined}
            />
          ))
        )}
      </div>
      {name ? <div className="mt-2 text-[10px] uppercase tracking-wider text-ink-soft">{name}</div> : null}
    </div>
  );
});

/** Грань карты руки: выбор свойства кликом, пояснение — наведением или фокусом. */
const HandFace = memo(function HandFace({
  face,
  divided,
  active,
  disabled,
  onSelect,
}: {
  face: TraitId;
  divided: boolean;
  active?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const def = TRAITS[face];
  const dark = DARK_ART.has(face);
  // На тач-устройствах подсказка не переключается тапом: тап выбирает грань.
  const tip = useTraitTip({ toggleOnTap: false });
  return (
    <>
      <button
        ref={(el) => {
          tip.anchorRef.current = el;
        }}
        {...tip.triggerProps}
        type="button"
        disabled={disabled}
        onClick={() => onSelect()}
        className={cn(
          "flex min-h-0 flex-1 flex-col items-stretch text-left transition-colors duration-[var(--motion-fast)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60",
          divided ? "border-b border-dashed border-ink/15" : "",
          active ? "ring-2 ring-inset ring-accent/70" : "hover:bg-ink/5",
        )}
      >
        <span className={cn("relative block min-h-0 w-full flex-1 overflow-hidden", dark && "bg-ink")}>
          <img
            src={TRAIT_ART[face]}
            alt=""
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full",
              dark ? "scale-[0.86] object-contain" : "object-cover object-[50%_28%]",
            )}
          />
        </span>
        <span className="flex items-center gap-1 px-2 pt-1.5 text-[11px] font-semibold leading-tight">
          <TraitGlyph id={face} className="size-3.5 shrink-0" />
          <span className="truncate">{def.name}</span>
        </span>
        {def.extraFood ? (
          <span className="px-2 pb-1.5 text-[10px] leading-tight text-clay">+{def.extraFood} еды</span>
        ) : (
          <span className="pb-1.5" />
        )}
      </button>
      {tip.anchorRect ? <TraitTooltip def={def} anchorRect={tip.anchorRect} id={tip.tipId} /> : null}
    </>
  );
});

/** Карта руки: кнопка «Животное» плюс по кнопке на каждое свойство грани. */
export function HandCard({
  card,
  selected,
  selectedFace,
  onSelect,
  disabled,
}: {
  card: Card;
  selected?: boolean;
  selectedFace?: number | null;
  onSelect: (face: number | "animal") => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[200px] w-[124px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border bg-parchment text-ink shadow-[var(--shadow-card)]",
        selected ? "border-clay ring-2 ring-clay/40" : "border-ink/12",
        disabled ? "opacity-50" : "",
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("animal")}
        className={cn(
          "flex h-8 items-center justify-center border-b border-ink/10 text-[10px] font-medium uppercase tracking-wider",
          selected && selectedFace === null ? "bg-ink text-parchment" : "bg-parchment-2/60 text-ink-soft hover:bg-parchment-2",
        )}
      >
        Животное
      </button>
      {card.faces.map((face, i) => (
        <HandFace
          key={`${card.id}-${face}-${i}`}
          face={face}
          divided={i === 0 && card.faces.length > 1}
          active={selected && selectedFace === i}
          disabled={disabled}
          onSelect={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
