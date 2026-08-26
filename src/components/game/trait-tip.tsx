import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TraitDef } from "@/game/traits";
import { DARK_ART, TRAIT_ART } from "@/lib/art";
import { cn } from "@/lib/utils";
import { TraitGlyph } from "./icons";

/** Всплывающее мини-окно с правилом свойства; позиционируется над чипом. */
export function TraitTooltip({
  def,
  pair,
  pairNote,
  pairColor,
  disabled,
  anchorRect,
  id,
}: {
  def: TraitDef;
  pair?: boolean;
  /** Кому именно принадлежит эта пара: «с №2», «симбионт — №1». */
  pairNote?: string;
  pairColor?: string;
  disabled?: boolean;
  anchorRect: DOMRect;
  id: string;
}) {
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // Размеры окна известны только после рендера текста — измеряем до отрисовки
  // и ставим итоговые координаты. Сверху нет места (телефон, низ экрана) —
  // переворачиваем под чип.
  useLayoutEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    const margin = 8;
    const gap = 8;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const left = Math.max(
      margin,
      Math.min(anchorRect.left + anchorRect.width / 2 - width / 2, window.innerWidth - margin - width),
    );
    let top = anchorRect.top - gap - height;
    if (top < margin) top = Math.min(anchorRect.bottom + gap, window.innerHeight - margin - height);
    setPos({ left: Math.round(left), top: Math.round(top) });
  }, [anchorRect]);

  return createPortal(
    <div
      ref={bubbleRef}
      id={id}
      role="tooltip"
      style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999 }}
      className="pointer-events-none fixed z-50 w-max max-w-[min(190px,calc(100vw-16px))] animate-[fade-in_160ms_var(--ease-out)] overflow-hidden rounded-[var(--radius-sm)] border border-border-strong bg-bg/95 text-left shadow-[var(--shadow-card)] backdrop-blur-sm"
    >
      {TRAIT_ART[def.id] ? (
        <img
          src={TRAIT_ART[def.id]}
          alt=""
          className={cn(
            "-mx-3 -mt-2 mb-1.5 h-36 w-[calc(100%+24px)] max-w-none",
            DARK_ART.has(def.id) ? "bg-ink object-contain p-1.5" : "object-cover object-[50%_25%]",
          )}
        />
      ) : (
        <div className="-mx-3 -mt-2 mb-1.5 flex h-20 items-center justify-center border-b border-border bg-surface-2">
          <TraitGlyph id={def.id} className="size-10 text-muted" />
        </div>
      )}
      <div className="px-2.5 pb-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="text-fg">{def.name}</span>
          {pair ? (
            <span
              className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted"
              style={pairColor ? { color: pairColor } : undefined}
            >
              {pairColor ? (
                <span className="size-2 rounded-full" style={{ background: pairColor }} />
              ) : null}
              {pairNote ?? "пара"}
            </span>
          ) : null}
          {disabled ? <span className="text-[9px] uppercase tracking-wider text-clay">отключено</span> : null}
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-muted">{def.description}</p>
      </div>
    </div>,
    document.body,
  );
}
