import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Единый стиль пояснений — как подсказки к свойствам животных: та же
 * пергаментная карточка, типографика и акценты. Используется везде, где
 * интерфейс что-то объясняет (туториал, доки, лобби, финальный экран).
 */
export function HintNote({
  children,
  title,
  icon,
  tone = "default",
  compact = false,
  className,
}: {
  children: ReactNode;
  /** Заголовок пояснения; без него текст идёт сразу. */
  title?: string;
  /** Иконка слева (lucide-компонент или глиф); опционально. */
  icon?: ReactNode;
  /** warning — глиняная рамка для «осторожно, последствие». */
  tone?: "default" | "warning";
  /** compact — плотная строка для узких мест (доки, шапки панелей). */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-[var(--radius-sm)] border bg-surface-2/60 text-muted",
        tone === "warning" ? "border-clay/40 bg-clay/10 text-clay" : "border-border",
        compact ? "px-2 py-1.5 text-[11px] leading-snug" : "px-3 py-2.5 text-xs leading-snug",
        className,
      )}
    >
      {icon ? <span className="mt-0.5 shrink-0 opacity-70">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        {title ? (
          <p className={cn("font-medium text-fg", compact ? "text-[11px]" : "text-xs")}>{title}</p>
        ) : null}
        <div className={cn(title && "mt-0.5")}>{children}</div>
      </div>
    </div>
  );
}
