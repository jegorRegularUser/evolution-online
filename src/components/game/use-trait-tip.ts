import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";

/**
 * Управление подсказкой свойства: мини-окно над чипом с пояснением правила.
 *
 * Мышь — открытие наведением и фокусом, закрытие уходом. Тач/перо — тап
 * переключает окно (если включён toggleOnTap), повторный тап или тап мимо
 * закрывает. Само окно (TraitTooltip) рендерится порталом в body: внутри
 * рядов животных и руки контейнеры со скроллом обрезали бы абсолютное
 * позиционирование.
 */

interface TipOptions {
  /** Тап по свойству переключает подсказку (тач-устройства). */
  toggleOnTap?: boolean;
  /** Не пропускать клик дальше — тап по чипу не должен выбирать животное. */
  isolateClick?: boolean;
}

export function useTraitTip({ toggleOnTap = true, isolateClick = false }: TipOptions = {}) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const lastPointerType = useRef("mouse");
  const tipId = useId();

  const open = useCallback(() => {
    if (anchorRef.current) setAnchorRect(anchorRef.current.getBoundingClientRect());
  }, []);
  const close = useCallback(() => setAnchorRect(null), []);

  // Пока подсказка открыта: Esc, тап мимо, скролл любого контейнера и ресайз закрывают её.
  useEffect(() => {
    if (!anchorRect) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target instanceof Node) || anchorRef.current?.contains(e.target)) return;
      close();
    };
    const onMove = () => close();
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [anchorRect, close]);

  const triggerProps = useMemo(
    () => ({
      tabIndex: 0,
      "aria-describedby": anchorRect ? tipId : undefined,
      onPointerEnter: (e: ReactPointerEvent) => {
        if (e.pointerType === "mouse") open();
      },
      onPointerLeave: (e: ReactPointerEvent) => {
        if (e.pointerType === "mouse") close();
      },
      onPointerDown: (e: ReactPointerEvent) => {
        lastPointerType.current = e.pointerType;
      },
      onClick: (e: ReactMouseEvent) => {
        // Мышью чип ведёт себя как раньше (клик выбирает животное), поэтому
        // изолируем и переключаем подсказку только для тача/пера.
        if (lastPointerType.current !== "mouse") {
          if (isolateClick) e.stopPropagation();
          if (toggleOnTap) {
            if (anchorRect) close();
            else open();
          }
        }
      },
      onFocus: () => {
        if (lastPointerType.current !== "touch") open();
      },
      onBlur: () => close(),
    }),
    [anchorRect, close, isolateClick, open, tipId, toggleOnTap],
  );

  return { anchorRef, tipId, anchorRect, close, triggerProps };
}
