import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export interface ConfirmDialogProps {
  title: string;
  /** Объяснение последствия обычным текстом. */
  body?: ReactNode;
  /** Кнопка с понятным последствием, не «Да». */
  confirmLabel: string;
  /** По умолчанию «Отмена». */
  cancelLabel?: string;
  /** danger — красная кнопка подтверждения. */
  tone?: "default" | "danger";
  /** Третье, менее очевидное действие отдельной ссылкой под кнопками. */
  extraLabel?: string;
  onExtra?: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

/** Длительность анимации закрытия: успевает проиграть modal-card-out. */
const EXIT_MS = 160;

/** Уважаем системную настройку «меньше движения». */
function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Общий диалог подтверждения: затемнение, Esc и клик по фону закрывают,
 * фокус встаёт на безопасную кнопку, подтверждение — отдельным вариантом.
 */
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = t("common.cancel"),
  tone = "default",
  extraLabel,
  onExtra,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef<(() => void) | null>(null);
  const [closing, setClosing] = useState(false);

  // DialogShell ставит фокус на cancelRef, удерживает Tab внутри и возвращает
  // его инициатору после закрытия.

  const requestClose = useCallback((action: () => void) => {
    if (pendingRef.current) return;
    if (reducedMotion()) {
      action();
      return;
    }
    pendingRef.current = action;
    setClosing(true);
  }, []);

  // Даём анимации закрытия доиграть и только потом отдаём управление родителю.
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => {
      const action = pendingRef.current;
      pendingRef.current = null;
      action?.();
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  // Портал в body: диалог могут рендерить изнутри элементов с backdrop-filter
  // или transform (футер дока, шапка) — такой предок становится содержащим
  // блоком для position: fixed, и модалка «прилипает» к нему вместо центра
  // вьюпорта. Через портал центр гарантирован независимо от места в DOM.
  const [portalHost] = useState<HTMLElement | null>(() =>
    typeof document === "undefined" ? null : document.body,
  );
  if (!portalHost) return null;

  return createPortal(
    <DialogShell
      titleId={titleId}
      initialFocus={cancelRef}
      overlayClassName={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4 backdrop-blur-sm",
        closing ? "modal-backdrop-out" : "modal-backdrop-in",
      )}
      panelClassName={cn(
        "w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)]",
        closing ? "modal-card-out" : "modal-card-in",
      )}
      onBackdropClick={() => requestClose(onClose)}
      onEscape={(event) => {
        event.preventDefault();
        requestClose(onClose);
      }}
    >
      <h2 id={titleId} className="text-xl">
        {title}
      </h2>
      {body ? <div className="mt-2 text-sm leading-snug text-muted">{body}</div> : null}
      {/* Кнопки решений: на телефоне выше (h-14), чтобы попадать пальцем. */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-3">
        <Button
          ref={cancelRef}
          variant="secondary"
          size="md"
          className="h-14 flex-1 sm:h-12"
          onClick={() => requestClose(onClose)}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={tone === "danger" ? "danger" : "default"}
          size="md"
          className="h-14 flex-1 sm:h-12"
          onClick={() => requestClose(onConfirm)}
        >
          {confirmLabel}
        </Button>
      </div>
      {extraLabel && onExtra ? (
        <button
          type="button"
          onClick={() => requestClose(onExtra)}
          className="mt-3 w-full rounded-[var(--radius-sm)] px-2 py-2 text-xs text-muted underline decoration-dotted underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {extraLabel}
        </button>
      ) : null}
    </DialogShell>,
    portalHost,
  );
}
