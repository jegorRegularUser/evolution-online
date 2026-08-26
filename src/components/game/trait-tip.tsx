import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TraitDef } from "@/game/traits";
import { DARK_ART, TRAIT_ART } from "@/lib/art";
import { cn } from "@/lib/utils";

/** Всплывающее мини-окно с правилом свойства; позиционируется над чипом. */
export function TraitTooltip({
  def,
  pair,
  disabled,
  anchorRect,
  id,
}: {
  def: TraitDef;
  pair?: boolean;
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
      <img
        src={TRAIT_ART[def.id]}
        alt=""
        className={cn(
          "-mx-3 -mt-2 mb-1.5 h-36 w-[calc(100%+24px)] max-w-none",
          DARK_ART.has(def.id) ? "bg-ink object-contain p-1.5" : "object-cover object-[50%_25%]",
        )}
      />
      <div className="px-2.5 pb-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="text-fg">{def.name}</span>
          {pair ? <span className="text-[9px] uppercase tracking-wider text-muted">пара</span> : null}
          {disabled ? <span className="text-[9px] uppercase tracking-wider text-clay">отключено</span> : null}
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-muted">{def.description}</p>
      </div>
    </div>,
    document.body,
  );
}
