import { memo } from "react";
import { TRAITS } from "@/game/traits";
import type { Animal, Card, TraitId } from "@/game/types";
import { hasTrait, isCarnivoreLike, isFed, speciesNeed } from "@/game/queries";
import { cn } from "@/lib/utils";
import { DARK_ART, TOKEN, TRAIT_ART, speciesArt } from "@/lib/art";
import { MarkChip } from "./cards-flora";
import { FoodCube, TraitGlyph } from "./icons";
import { TraitTooltip } from "./trait-tip";
import { useTraitTip } from "./use-trait-tip";

/**
 * Фишки еды на животном. Цвет важен по правилам: красная приходит из кормовой
 * базы, синяя — от свойств (охота, сотрудничество, пиратство, падальщик,
 * хвост, жир), поэтому blueFood рисуется отдельными синими жетонами.
 */
export const FoodDots = memo(function FoodDots({ animal }: { animal: Animal }) {
  const need = speciesNeed(animal);
  const blue = Math.min(animal.blueFood, animal.food);
  const red = animal.food - blue;
  const empty = Math.max(0, need - animal.food);
  return (
    <div
      className="flex items-center gap-1.5"
      title={`Еда ${animal.food} / ${need}${blue > 0 ? ` · синих ${blue}` : ""}${
        animal.fatTokens > 0 ? ` · жир ${animal.fatTokens}` : ""
      }`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: red }).map((_, i) => (
          <FoodCube key={`r${i}`} tone="red" title="Красная фишка" className="token-pop size-3.5" />
        ))}
        {Array.from({ length: blue }).map((_, i) => (
          <FoodCube key={`b${i}`} tone="blue" title="Синяя фишка" className="token-pop size-3.5" />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e${i}`} className="inline-block size-3.5 rounded-full border border-ink/40 bg-parchment-2" />
        ))}
        {Array.from({ length: animal.fatTokens }).map((_, i) => (
          <FoodCube key={`f${i}`} tone="yellow" title="Жир" className="token-pop size-3.5" />
        ))}
      </div>
      <span className="text-[10px] tabular-nums text-ink-soft">
        {animal.food}/{need}
      </span>
    </div>
  );
});

/**
 * Палитра парных карт. У животного бывает две пары плюс симбионт, поэтому
 * каждая пара получает свой цвет: чип на обоих животных и плашка между ними
 * помечаются одинаково, и видно, какое свойство к какой паре относится.
 */
export const PAIR_COLORS = [
  "#1d6f8b",
  "#8a4b1f",
  "#4b7a2a",
  "#7a3b86",
  "#a33a3a",
  "#2f6f57",
] as const;

/** Метка пары для одного экземпляра свойства: цвет и «кто напарник». */
export interface PairMark {
  color: string;
  /** Короткая подпись на чипе: «с №2», «симбионт — №1». */
  note: string;
}

/**
 * Чип свойства. По правилам свойства выкладываются лицом вверх — чип всегда
 * открытый; отключённое (disabled) — серое, перечёркнутое, без действия;
 * fresh — вложено в текущем круге развития: точка «новое».
 *
 * Парное свойство дополнительно помечено цветом своей пары и подписью, кто
 * напарник (для симбиоза — кто именно симбионт).
 *
 * Наведение/фокус открывает мини-окно с правилом над чипом; на тач-устройствах
 * окно переключается тапом по чипу (тап не выбирает животное).
 */
export const TraitChip = memo(function TraitChip({
  type,
  pair,
  mark,
  disabled,
  fresh,
}: {
  type: TraitId;
  pair?: boolean;
  mark?: PairMark;
  disabled?: boolean;
  fresh?: boolean;
}) {
  const def = TRAITS[type];
  const tip = useTraitTip({ isolateClick: true });
  const anchorRef = (el: HTMLElement | null) => { tip.anchorRef.current = el; };
  const bubble = tip.anchorRect ? (
    <TraitTooltip
      def={def}
      pair={pair}
      pairNote={mark?.note}
      pairColor={mark?.color}
      disabled={disabled}
      anchorRect={tip.anchorRect}
      id={tip.tipId}
    />
  ) : null;
  return (
    <span
      ref={anchorRef}
      {...tip.triggerProps}
      data-trait-chip
      style={
        mark && !disabled
          ? { backgroundColor: `${mark.color}1f`, boxShadow: `inset 0 0 0 1px ${mark.color}80` }
          : undefined
      }
      className={cn(
        "anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        disabled
          ? "bg-virus/15 text-virus line-through decoration-virus/60"
          : def.virusLike
            ? "bg-virus/20 text-virus ring-1 ring-inset ring-virus/50"
            : def.harmful
              ? "bg-ink/85 text-parchment ring-1 ring-inset ring-clay/60"
              : type === "carnivore"
                ? "bg-clay/15 text-clay"
                : type === "fatTissue"
                  ? "bg-food-yellow/20 text-ink"
                  : "bg-ink/8 text-ink",
        fresh && !disabled && "chip-fresh",
      )}
    >
      {mark && !disabled ? (
        <span className="size-2 shrink-0 rounded-full" style={{ background: mark.color }} />
      ) : (
        <TraitGlyph id={type} className="size-3.5" />
      )}
      {def.short}
      {def.extraFood > 0 ? (
        <span className="text-[9px] font-semibold text-clay" title={`+${def.extraFood} к потребности в еде`}>
          +{def.extraFood}
        </span>
      ) : null}
      {mark ? (
        <span className="text-[9px] font-semibold" style={{ color: mark.color }}>
          {mark.note}
        </span>
      ) : pair ? (
        <span className="text-[9px] opacity-70">пара</span>
      ) : null}
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
  no,
  pairMarks,
  selected,
  dimmed,
  highlight,
  dying,
  freshSince,
  draggable,
  dropTarget,
  onDragStartCard,
  onDragOverCard,
  onDropCard,
  onDragEndCard,
}: {
  animal: Animal;
  name?: string;
  /** Номер животного в своём табло — на него ссылаются подписи пар. */
  no?: number;
  /** Метки пар по id экземпляра свойства (цвет пары и напарник). */
  pairMarks?: Record<string, PairMark>;
  selected?: boolean;
  dimmed?: boolean;
  highlight?: boolean;
  /** Животное погибнет в текущей стадии вымирания. */
  dying?: boolean;
  /** Свойства с playSeq больше этого значения вложены в текущем круге развития. */
  freshSince?: number;
  /** Свой животное можно перетаскивать (менять порядок, позже — зоны «Континентов»). */
  draggable?: boolean;
  dropTarget?: boolean;
  onDragStartCard?: (e: React.DragEvent) => void;
  onDragOverCard?: (e: React.DragEvent) => void;
  onDropCard?: () => void;
  onDragEndCard?: () => void;
}) {
  const fed = isFed(animal);
  // Много свойств — карточка растёт в ширину, а не только в высоту.
  const width = 168 + Math.min(Math.max(animal.traits.length - 3, 0), 3) * 38;
  return (
    <div
      data-animal-id={animal.id}
      draggable={draggable || undefined}
      onDragStart={onDragStartCard}
      onDragOver={onDragOverCard}
      onDrop={onDropCard}
      onDragEnd={onDragEndCard}
      style={{ width }}
      className={cn(
        "animal-card anim-card-in relative shrink-0 cursor-pointer rounded-[var(--radius-lg)] border bg-parchment p-3 text-left text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        selected ? "border-clay ring-2 ring-clay/40" : "border-ink/10",
        highlight ? "ring-2 ring-accent" : "",
        dimmed ? "opacity-45" : "",
        dying ? "dying-pulse border-danger/60" : "",
        dropTarget ? "border-accent ring-2 ring-accent/60" : "",
        "hover:-translate-y-0.5",
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="flex items-baseline gap-1 font-display text-sm tracking-tight">
          {no ? <span className="text-[10px] tabular-nums text-ink-soft">№{no}</span> : null}
          {hasTrait(animal, "obligateCarnivore")
            ? "Облигатный хищник"
            : hasTrait(animal, "carnivore")
              ? "Хищник"
              : hasTrait(animal, "swimming")
                ? "Водное"
                : "Животное"}
        </span>
        <span className="flex items-center gap-1">
          {(animal.population ?? 1) > 1 ? (
            <span
              title={`Численность вида: ${animal.population} животного(-ых)`}
              className="flex items-center gap-0.5 rounded-full bg-accent/20 px-1.5 text-[10px] font-semibold tabular-nums text-accent"
            >
              <img src={TOKEN.population} alt="" loading="lazy" className="size-3 rounded-full object-cover" />
              ×{animal.population}
            </span>
          ) : null}
          {animal.sheltered ? (
            <span
              title="В убежище растения: хищники и хищные растения не тронут до конца фазы питания"
              className="flex items-center gap-1 rounded-full bg-leaf/25 px-1.5 text-[10px] font-medium uppercase tracking-wide text-leaf"
            >
              <span className="size-2 rounded-full border border-leaf/60 bg-leaf/40" />
              убежище
            </span>
          ) : null}
          {animal.sedated ? (
            <span
              title="Откушало с лекарственного растения: накормлено, но свойства не действуют до конца фазы питания"
              className="rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft"
            >
              усыплено
            </span>
          ) : null}
          {animal.hibernating ? (
            <span className="rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide">сон</span>
          ) : fed ? (
            <span className="rounded-full bg-good/20 px-1.5 text-[10px] font-medium uppercase tracking-wide text-good">сыто</span>
          ) : (
            <span className="rounded-full bg-clay/15 px-1.5 text-[10px] font-medium uppercase tracking-wide text-clay">голод</span>
          )}
        </span>
      </div>
      <div className="mb-2 flex justify-center">
        <img
          src={speciesArt({
            swimming: hasTrait(animal, "swimming"),
            carnivore: isCarnivoreLike(animal),
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
              mark={pairMarks?.[t.id]}
              disabled={t.disabled}
              fresh={freshSince !== undefined && t.playSeq > freshSince ? true : undefined}
            />
          ))
        )}
      </div>
      {animal.marks?.length ? (
        <div className="mt-1 flex flex-wrap gap-1">
          {animal.marks.map((m) => (
            <MarkChip key={m} mark={m} />
          ))}
        </div>
      ) : null}
      {name ? <div className="mt-2 text-[10px] uppercase tracking-wider text-ink-soft">{name}</div> : null}
    </div>
  );
});

/**
 * Мини-карта парного свойства — «лежит между» двумя животными, как на столе
 * в настольной игре: на узком экране животные стоят столбиком, поэтому плашка
 * становится горизонтальной полосой между ними, а на широком — вертикальной
 * карточкой в ряду. На плашке рисуется арт свойства и цвет своей пары.
 */
export function PairPlate({ type, color, note }: { type: TraitId; color?: string; note?: string }) {
  const def = TRAITS[type];
  const dark = DARK_ART.has(type);
  const tip = useTraitTip({ isolateClick: true });
  return (
    <span
      ref={(el) => {
        tip.anchorRef.current = el;
      }}
      {...tip.triggerProps}
      data-trait-chip
      title={`${def.name}${note ? ` · ${note}` : ""} — ${def.description}`}
      style={color ? { borderColor: color, backgroundColor: `${color}14` } : undefined}
      className="relative flex w-full shrink-0 cursor-help items-center gap-2 self-center rounded-[var(--radius-sm)] border border-dashed border-ink/30 bg-parchment-2/80 px-2 py-1 text-ink shadow-[var(--shadow-card)] sm:w-[58px] sm:flex-col sm:justify-center sm:gap-1 sm:px-1 sm:py-2"
    >
      {TRAIT_ART[type] ? (
        <img
          src={TRAIT_ART[type]}
          alt=""
          loading="lazy"
          className={cn(
            "size-8 shrink-0 rounded-[4px] border border-ink/20 object-cover object-top sm:h-12 sm:w-full",
            dark && "bg-ink object-contain p-0.5",
          )}
        />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-ink/20 bg-parchment sm:h-12 sm:w-full">
          <TraitGlyph id={type} className="size-5 text-ink-soft" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col sm:w-full sm:flex-none sm:items-center">
        <span className="flex items-center gap-1 truncate text-[10px] font-semibold leading-tight sm:text-[9px]">
          {color ? <span className="size-2 shrink-0 rounded-full" style={{ background: color }} /> : null}
          {def.short}
        </span>
        <span
          className="truncate text-[9px] leading-tight text-ink-soft sm:max-w-full sm:text-center sm:text-[8px]"
          style={color ? { color } : undefined}
        >
          {note ?? "пара"}
        </span>
      </span>
      {tip.anchorRect ? (
        <TraitTooltip
          def={def}
          pair
          pairNote={note}
          pairColor={color}
          anchorRect={tip.anchorRect}
          id={tip.tipId}
        />
      ) : null}
    </span>
  );
}

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
          {TRAIT_ART[face] ? (
            <img
              src={TRAIT_ART[face]}
              alt=""
              loading="lazy"
              className={cn(
                "absolute inset-0 h-full w-full",
                dark ? "scale-[0.86] object-contain" : "object-cover object-[50%_28%]",
              )}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center bg-parchment-2">
              <TraitGlyph id={face} className="size-10 text-ink-soft" />
            </span>
          )}
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
