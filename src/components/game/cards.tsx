import { memo, useState } from "react";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { Check, Crosshair, Pencil, X } from "lucide-react";
import { TRAITS } from "@/game/traits";
import type { Animal, Card, TraitId } from "@/game/types";
import { hasTrait, isCarnivoreLike, isFed, speciesNeed } from "@/game/queries";
import { cn } from "@/lib/utils";
import { DARK_ART, TOKEN, TRAIT_ART, speciesArt } from "@/lib/art";
import { traitDesc, traitName, traitShort, useLang, useT } from "@/lib/i18n";
import { MarkChip } from "./cards-flora";
import { FoodCube, TraitGlyph } from "./icons";
import { TraitTooltip } from "./trait-tip";
import { useTraitTip } from "./use-trait-tip";

/**
 * Фишки еды на животном. Цвет важен по правилам: красная приходит из кормовой
 * базы, синяя — от свойств (охота, сотрудничество, пиратство, падальщик,
 * хвост, жир), поэтому blueFood рисуется отдельными синими жетонами.
 */
/**
 * Пустое «гнездо» под фишку еды: тот же изометрический силуэт, что у FoodCube,
 * но прозрачный и пунктирный. Так видно, что сюда ляжет кубик еды, а не просто
 * кружок нормы.
 */
const FoodSlot = memo(function FoodSlot() {
  return (
    <svg viewBox="0 0 20 21" className="size-3.5 shrink-0" aria-hidden>
      <g
        fill="none"
        stroke="color-mix(in oklab, var(--color-ink) 45%, transparent)"
        strokeWidth="1"
        strokeDasharray="2.4 1.7"
        strokeLinejoin="round"
      >
        <polygon points="1,6.2 10,11.4 10,20.6 1,15.4" />
        <polygon points="19,6.2 10,11.4 10,20.6 19,15.4" />
        <polygon points="10,1 19,6.2 10,11.4 1,6.2" />
      </g>
    </svg>
  );
});

export const FoodDots = memo(function FoodDots({ animal }: { animal: Animal }) {
  const t = useT();
  const need = speciesNeed(animal);
  const blue = Math.min(animal.blueFood, animal.food);
  const red = animal.food - blue;
  const empty = Math.max(0, need - animal.food);
  return (
    <div
      className="flex items-center gap-1.5"
      title={
        t("card.foodTitle", { food: animal.food, need }) +
        (blue > 0 ? t("card.foodBlue", { n: blue }) : "") +
        (animal.fatTokens > 0 ? t("card.foodFat", { n: animal.fatTokens }) : "")
      }
    >
      <div className="flex flex-wrap items-center gap-1">
        {Array.from({ length: red }).map((_, i) => (
          <FoodCube key={`r${i}`} tone="red" title={t("card.redToken")} className="token-pop size-3.5" />
        ))}
        {Array.from({ length: blue }).map((_, i) => (
          <FoodCube key={`b${i}`} tone="blue" title={t("card.blueToken")} className="token-pop size-3.5" />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <FoodSlot key={`e${i}`} />
        ))}
        {Array.from({ length: animal.fatTokens }).map((_, i) => (
          <FoodCube key={`f${i}`} tone="yellow" title={t("card.fatToken")} className="token-pop size-3.5" />
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
  paralyzed,
  fresh,
}: {
  type: TraitId;
  pair?: boolean;
  mark?: PairMark;
  disabled?: boolean;
  paralyzed?: boolean;
  fresh?: boolean;
}) {
  const lang = useLang();
  const t = useT();
  const def = TRAITS[type];
  const tip = useTraitTip({ isolateClick: true });
  const anchorRef = (el: HTMLElement | null) => { tip.anchorRef.current = el; };
  const bubble = tip.anchorRect ? (
    <TraitTooltip
      def={{ ...def, name: traitName(type, lang), description: traitDesc(type, lang) }}
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
        paralyzed && "opacity-50 grayscale",
      )}
    >
      {mark && !disabled ? (
        <span className="size-2 shrink-0 rounded-full" style={{ background: mark.color }} />
      ) : (
        <TraitGlyph id={type} className="size-3.5" />
      )}
      {traitShort(type, lang)}
      {def.extraFood > 0 ? (
        <span className="text-[9px] font-semibold text-clay" title={t("card.extraFoodNeed", { n: def.extraFood })}>
          +{def.extraFood}
        </span>
      ) : null}
      {mark ? (
        <span className="text-[9px] font-semibold" style={{ color: mark.color }}>
          {mark.note}
        </span>
      ) : pair ? (
        <span className="text-[9px] opacity-70">{t("card.pair")}</span>
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
 *
 * Перетаскивание — снаружи (@dnd-kit): сюда приходят ref и слушатели датчиков,
 * компонент остаётся презентационным и про библиотеку не знает.
 */
export const AnimalCard = memo(function AnimalCard({
  animal,
  name,
  no,
  pairMarks,
  selected,
  dimmed,
  highlight,
  danger,
  dying,
  freshSince,
  draggable,
  dragging,
  dropTarget,
  insertSide,
  dragRef,
  dragListeners,
  onRename,
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
  /** Цель атаки/пиратства: красная рамка с трещинами, лёгкая анимация слома. */
  danger?: boolean;
  /** Животное погибнет в текущей стадии вымирания. */
  dying?: boolean;
  /** Свойства с playSeq больше этого значения вложены в текущем круге развития. */
  freshSince?: number;
  /** Своё животное можно перетаскивать — только в свой ход. */
  draggable?: boolean;
  /** Зверя сейчас тащат: источник приглушён, но место в ряду остаётся видимым. */
  dragging?: boolean;
  dropTarget?: boolean;
  /** Куда встанет тащимое животное: полоса слева (до цели) или справа (после). */
  insertSide?: "before" | "after";
  /** ref и слушатели датчиков @dnd-kit (мыши/пальца). */
  dragRef?: (el: HTMLDivElement | null) => void;
  dragListeners?: DraggableSyntheticListeners;
  /**
   * Переименовать это животное (косметика). Передаётся только своим животным
   * в свой ход фаз развития/питания — по нему карточка показывает карандаш.
   */
  onRename?: (animalId: string, name: string) => void;
}) {
  const t = useT();
  const fed = isFed(animal);
  // Inline-правка клички: карандаш у имени раскрывает поле, галочка —
  // сохранить, крестик/Esc — отменить. Номер «№N» не редактируется.
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState("");
  const startRename = () => {
    setDraft(animal.name ?? "");
    setRenaming(true);
  };
  const commitRename = () => {
    setRenaming(false);
    onRename?.(animal.id, draft.trim());
  };
  // Много свойств — карточка растёт в ширину, а не только в высоту.
  const width = 168 + Math.min(Math.max(animal.traits.length - 3, 0), 3) * 38;
  return (
    <div
      ref={dragRef}
      {...dragListeners}
      // Нативный HTML5-драг картинок/текста внутри карточки мешал бы датчикам.
      onDragStartCapture={(e) => e.preventDefault()}
      data-animal-id={animal.id}
      style={{ width }}
      className={cn(
        "animal-card anim-card-in relative shrink-0 rounded-[var(--radius-lg)] border border-ink/10 bg-parchment p-3 text-left text-ink shadow-[var(--shadow-card)] transition-[transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        // Единый признак состояния — одно кольцо. Приоритет:
        // цель под прицелом > выбрано > обычное; цвет рамки не меняем.
        danger
          ? "target-marked border-danger ring-[3px] ring-danger"
          : selected
            ? "evo-picked"
            : highlight
              ? "ring-2 ring-accent"
              : "",
        dimmed ? "opacity-45" : "",
        dying ? "dying-pulse border-danger/60" : "",
        dropTarget ? "border-accent ring-2 ring-accent/60" : "",
        dragging ? "opacity-40" : "",
        "hover:-translate-y-0.5",
      )}
    >
      {/* Куда встанет тащимое животное: вертикальная полоса у края карточки-цели. */}
      {insertSide ? (
        <span
          aria-hidden
          data-insert-side={insertSide}
          className={cn(
            "pointer-events-none absolute bottom-1 top-1 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]",
            insertSide === "before" ? "-left-2" : "-right-2",
          )}
        />
      ) : null}
      {/* Метка цели: прицел в углу карточки — видно, кого можно атаковать. */}
      {danger ? (
        <span
          aria-hidden
          className="target-badge pointer-events-none absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border border-danger bg-danger text-parchment shadow-[var(--shadow-card)]"
        >
          <Crosshair className="size-3.5" />
        </span>
      ) : null}
      {/* Шапка переносится при нехватке места: название усекается, бейджи
          (численность, убежище, сон, метки) уходят на вторую строку, а не
          выпадают за край карточки. */}
      <div className="mb-1 flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        {renaming && onRename ? (
          /* Правка клички: поле вместо имени, галочка сохраняет, крестик/Esc
             отменяют. События не всплывают — клики не выбирают животное и не
             запускают перетаскивание карточки. */
          <span
            className="flex min-w-0 flex-1 items-center gap-0.5"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {no ? <span className="shrink-0 text-[10px] tabular-nums text-ink-soft">№{no}</span> : null}
            <input
              autoFocus
              value={draft}
              maxLength={24}
              aria-label={t("card.renameInput")}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              className="min-w-0 flex-1 rounded-[var(--radius-xs)] border border-ink/20 bg-parchment-2 px-1.5 py-0.5 font-display text-sm tracking-tight text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            />
            <button
              type="button"
              aria-label={t("card.renameSave")}
              title={t("card.renameSave")}
              onClick={commitRename}
              className="grid size-7 shrink-0 place-items-center rounded text-ink-soft transition-colors hover:bg-ink/10 hover:text-good focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <Check className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={t("card.renameCancel")}
              title={t("card.renameCancel")}
              onClick={() => setRenaming(false)}
              className="grid size-7 shrink-0 place-items-center rounded text-ink-soft transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ) : (
          <span className="flex min-w-0 flex-1 basis-16 items-baseline gap-1 font-display text-sm tracking-tight">
            {no ? <span className="shrink-0 text-[10px] tabular-nums text-ink-soft">№{no}</span> : null}
            {/* Кличка владельца заменяет подпись вида; без неё — как раньше:
                облигатный хищник / хищник / водное / животное. */}
            <span className="truncate">
              {animal.name ??
                (hasTrait(animal, "obligateCarnivore")
                  ? t("card.obligateCarnivore")
                  : hasTrait(animal, "carnivore")
                    ? t("card.carnivore")
                    : hasTrait(animal, "swimming")
                      ? t("card.water")
                      : t("card.animal"))}
            </span>
            {/* Карандаш клички — только на своих животных в свой ход; место
                под него выделяется внутри flex-1 строки, карточка не прыгает
                и на тач-ширинах виден без hover. */}
            {onRename ? (
              <button
                type="button"
                aria-label={t("card.renameAria")}
                title={t("card.renameAria")}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  startRename();
                }}
                className="grid size-7 shrink-0 place-items-center self-center rounded text-ink-soft transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <Pencil className="size-3.5" />
              </button>
            ) : null}
          </span>
        )}
        <span className="flex shrink-0 flex-wrap items-center justify-end gap-1">
          {(animal.population ?? 1) > 1 ? (
            <span
              title={t("card.popTitle", { n: animal.population ?? 1 })}
              className="flex items-center gap-0.5 rounded-full bg-accent/20 px-1.5 text-[10px] font-semibold tabular-nums text-accent"
            >
              <img src={TOKEN.population} alt="" loading="lazy" className="size-3 rounded-full object-cover" />
              ×{animal.population}
            </span>
          ) : null}
          {animal.sheltered ? (
            <span
              title={t("card.shelterTitle")}
              className="flex items-center gap-1 rounded-full bg-leaf/25 px-1.5 text-[10px] font-medium uppercase tracking-wide text-leaf"
            >
              <span className="size-2 rounded-full border border-leaf/60 bg-leaf/40" />
              {t("card.shelter")}
            </span>
          ) : null}
          {animal.sedated ? (
            <span
              title={t("card.sedatedTitle")}
              className="rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft"
            >
              {t("card.sedated")}
            </span>
          ) : null}
          {animal.traits.some((tr) => tr.paralyzed) ? (
            <span className="rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
              {t("card.paralyzed")}
            </span>
          ) : null}
          {animal.hibernating ? (
            <span className="rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide">{t("card.hibernating")}</span>
          ) : fed ? (
            <span className="rounded-full bg-good/20 px-1.5 text-[10px] font-medium uppercase tracking-wide text-good">{t("card.fed")}</span>
          ) : (
            <span className="rounded-full bg-clay/15 px-1.5 text-[10px] font-medium uppercase tracking-wide text-clay">{t("card.hungry")}</span>
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
          <span className="text-[11px] text-ink-soft">{t("card.noTraits")}</span>
        ) : (
          animal.traits.map((tr) => (
            <TraitChip
              key={tr.id}
              type={tr.type}
              pair={Boolean(tr.pairWith)}
              mark={pairMarks?.[tr.id]}
              disabled={tr.disabled}
              paralyzed={tr.paralyzed}
              fresh={freshSince !== undefined && tr.playSeq > freshSince ? true : undefined}
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
 * Состояния — как у карт: одно кольцо на выбор, приглушение прозрачностью.
 */
export function PairPlate({
  type,
  color,
  note,
  selected,
  highlight,
  dimmed,
}: {
  type: TraitId;
  color?: string;
  note?: string;
  selected?: boolean;
  highlight?: boolean;
  dimmed?: boolean;
}) {
  const t = useT();
  const lang = useLang();
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
      title={`${traitShort(type, lang)}${note ? ` · ${note}` : ""} — ${traitDesc(type, lang)}`}
      style={color ? { borderColor: color, backgroundColor: `${color}14` } : undefined}
      className={cn(
        "relative flex w-full shrink-0 cursor-help items-center gap-2 self-center rounded-[var(--radius-sm)] border border-dashed border-ink/30 bg-parchment-2/80 px-2 py-1 text-ink shadow-[var(--shadow-card)] sm:w-[58px] sm:flex-col sm:justify-center sm:gap-1 sm:px-1 sm:py-2",
        selected ? "evo-picked-flat" : highlight ? "ring-2 ring-accent" : "",
        dimmed ? "opacity-45" : "",
      )}
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
          {traitShort(type, lang)}
        </span>
        <span
          className="truncate text-[9px] leading-tight text-ink-soft sm:max-w-full sm:text-center sm:text-[8px]"
          style={color ? { color } : undefined}
        >
          {note ?? t("card.pair")}
        </span>
      </span>
      {tip.anchorRect ? (
        <TraitTooltip
          def={{ ...def, name: traitName(type, lang), description: traitDesc(type, lang) }}
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
  dimmed,
  blocked,
  onSelect,
  onBlocked,
}: {
  face: TraitId;
  divided: boolean;
  active?: boolean;
  disabled?: boolean;
  /** У игрока нет животных: низ карты слегка сереет, пока не сыграна карта. */
  dimmed?: boolean;
  /** Грань недоступна: легального действия для неё сейчас нет. */
  blocked?: boolean;
  onSelect: () => void;
  /** Клик по недоступной грани: звук отказа и подсказка, без выбора. */
  onBlocked?: () => void;
}) {
  const t = useT();
  const lang = useLang();
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
        onClick={(e) => {
          if (blocked) {
            // Отказ звучит сам (треск): щелчок дока здесь не нужен.
            e.stopPropagation();
            onBlocked?.();
            return;
          }
          onSelect();
        }}
        aria-disabled={blocked || undefined}
        className={cn(
          "flex min-h-0 flex-1 flex-col items-stretch text-left outline-none transition-colors duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60",
          divided ? "border-b border-dashed border-ink/15" : "",
          // Одно кольцо на состояние: выбранная грань — акцент, приглушение —
          // прозрачностью (без второй заливки и рамки).
          active ? "evo-face-picked" : "hover:bg-ink/5",
          dimmed && "opacity-55",
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
          <span className="truncate">{traitName(face, lang)}</span>
        </span>
        {def.extraFood ? (
          <span className="px-2 pb-1.5 text-[10px] leading-tight text-clay">
            {t("traitTip.extraFood", { n: def.extraFood })}
          </span>
        ) : (
          <span className="pb-1.5" />
        )}
      </button>
      {tip.anchorRect ? (
        <TraitTooltip def={{ ...def, name: traitName(face, lang), description: traitDesc(face, lang) }} anchorRect={tip.anchorRect} id={tip.tipId} />
      ) : null}
    </>
  );
});

/**
 * Карта руки: кнопка «Животное» плюс по кнопке на каждое свойство грани.
 * Перетаскивается целиком (карта в руке — один объект), но клики по кнопкам
 * остаются: датчики @dnd-kit включаются только после порога движения.
 */
export function HandCard({
  card,
  selected,
  selectedFace,
  onSelect,
  onBlockedFace,
  blockedFace,
  disabled,
  noAnimals,
  dragRef,
  dragListeners,
  dragging,
}: {
  card: Card;
  selected?: boolean;
  selectedFace?: number | null;
  onSelect: (face: number | "animal") => void;
  /** Клик по недоступной грани (её нельзя разыграть прямо сейчас). */
  onBlockedFace?: (face: number) => void;
  /** Какие грани недоступны: источник правды — легальные действия движка. */
  blockedFace?: (face: number) => boolean;
  disabled?: boolean;
  /** У игрока нет животных: низ карты сереет, а «Животное» подсвечивается —
   *  первым делом нужно выложить животное, свойства без него бессмысленны. */
  noAnimals?: boolean;
  /** ref и слушатели датчиков @dnd-kit: карта едет мышью или пальцем в зону/на животное. */
  dragRef?: (el: HTMLDivElement | null) => void;
  dragListeners?: DraggableSyntheticListeners;
  /** Карту сейчас тащат: в руке она приглушена, «призрак» едет под курсором. */
  dragging?: boolean;
}) {
  const t = useT();
  // Кольцо карты показываем только когда выбран сам «низ» карты; выбранная
  // грань помечается своим кольцом — на карте не сходятся два выделения.
  const cardPicked = Boolean(selected) && (selectedFace === null || selectedFace === undefined);
  return (
    <div
      ref={dragRef}
      {...dragListeners}
      // Нативный HTML5-драг картинок внутри карты перебивал бы датчики dnd-kit.
      onDragStartCapture={(e) => e.preventDefault()}
      data-card-id={card.id}
      className={cn(
        "relative flex h-[200px] w-[124px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border border-ink/12 bg-parchment text-ink shadow-[var(--shadow-card)]",
        cardPicked ? "evo-picked" : "",
        disabled ? "opacity-50" : "cursor-grab active:cursor-grabbing",
        dragging ? "opacity-40" : "",
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("animal")}
        className={cn(
          // h-11: тап-таргет 44px — «Животное» первый ход партии, его жмут пальцем.
          "flex h-11 items-center justify-center border-b border-ink/10 text-[10px] font-medium uppercase tracking-wider",
          cardPicked ? "bg-ink text-parchment" : "bg-parchment-2/60 text-ink-soft hover:bg-parchment-2",
          noAnimals && !selected && "bg-clay/20 text-ink ring-1 ring-inset ring-clay/50",
        )}
      >
        {t("card.animal")}
      </button>
      {card.faces.map((face, i) => (
        <HandFace
          key={`${card.id}-${face}-${i}`}
          face={face}
          divided={i === 0 && card.faces.length > 1}
          active={selected && selectedFace === i}
          blocked={blockedFace?.(i)}
          onBlocked={() => onBlockedFace?.(i)}
          disabled={disabled}
          dimmed={noAnimals && !selected}
          onSelect={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

/**
 * «Призрак» карты для DragOverlay: те же грани, но без кнопок и обработчиков —
 * в оверлее карта едет под курсором и не должна ловить клики и фокус.
 */
export function CardPreview({ card }: { card: Card }) {
  const t = useT();
  const lang = useLang();
  return (
    <div
      aria-hidden
      className="flex h-[200px] w-[124px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border border-ink/12 bg-parchment text-ink shadow-[var(--shadow-card)]"
    >
      <span className="flex h-8 items-center justify-center border-b border-ink/10 bg-parchment-2/70 text-[10px] font-medium uppercase tracking-wider text-ink-soft">
        {t("card.card")}
      </span>
      {card.faces.map((face, i) => {
        const dark = DARK_ART.has(face);
        return (
          <span
            key={`${card.id}-${face}-${i}`}
            className={cn("flex min-h-0 flex-1 flex-col", i === 0 && card.faces.length > 1 && "border-b border-dashed border-ink/15")}
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
            <span className="flex items-center gap-1 px-2 pb-1.5 pt-1.5 text-[11px] font-semibold leading-tight">
              <TraitGlyph id={face} className="size-3.5 shrink-0" />
              <span className="truncate">{traitName(face, lang)}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
