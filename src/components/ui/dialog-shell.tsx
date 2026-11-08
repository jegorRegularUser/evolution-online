import { useLayoutEffect, useRef, type KeyboardEventHandler, type ReactNode, type RefObject } from "react";

interface DialogShellProps {
  children: ReactNode;
  titleId: string;
  overlayClassName: string;
  panelClassName: string;
  initialFocus?: RefObject<HTMLElement | null>;
  returnFocus?: RefObject<HTMLElement | null>;
  onBackdropClick?: () => void;
  onEscape?: KeyboardEventHandler<HTMLDivElement>;
}

const FOCUSABLE = "a[href], area[href], button, input, select, textarea, iframe, [tabindex], [contenteditable='true']";

function tabStops(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
    .filter((element) =>
      element.tabIndex >= 0 &&
      !element.matches(":disabled") &&
      !element.closest("[inert], [hidden]") &&
      element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility === "visible",
    )
    .sort((a, b) => (a.tabIndex || Number.MAX_SAFE_INTEGER) - (b.tabIndex || Number.MAX_SAFE_INTEGER));
}

/** Монтируется только на время открытия; Escape остаётся решением экрана. */
export function DialogShell({
  children,
  titleId,
  overlayClassName,
  panelClassName,
  initialFocus,
  returnFocus,
  onBackdropClick,
  onEscape,
}: DialogShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || !panel.getClientRects().length) return;
    const previous = returnFocus?.current ?? document.activeElement;
    const title = document.getElementById(titleId);
    const candidates = [initialFocus?.current, title, tabStops(panel)[0], panel];
    for (const target of candidates) {
      if (!target || !panel.contains(target)) continue;
      target.focus({ preventScroll: true });
      if (document.activeElement === target) break;
    }

    return () => {
      if (previous instanceof HTMLElement && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [titleId, initialFocus, returnFocus]);

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== "Tab" || event.defaultPrevented) return;
    const panel = panelRef.current;
    if (!panel) return;
    const stops = tabStops(panel);
    const first = stops[0];
    const last = stops[stops.length - 1];
    const active = document.activeElement;
    if (!first || !last) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
    } else if (!stops.some((element) => element === active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey ? active === first : active === last) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  };

  return (
    <div
      className={overlayClassName}
      onClick={(event) => {
        if (event.target === event.currentTarget) onBackdropClick?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={panelClassName}
        onKeyDown={onKeyDown}
        onKeyDownCapture={(event) => {
          if (event.key === "Escape") onEscape?.(event);
        }}
      >
        {children}
      </div>
    </div>
  );
}
