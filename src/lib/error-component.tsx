import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/game-store";

export function AppErrorComponent({ error, info, reset }: ErrorComponentProps) {
  const goToMenu = () => {
    // Сначала закрываем сетевую сессию штатным путём. Если ошибка задела сам
    // стор, ссылка на меню всё равно должна быть доступна пользователю.
    try {
      useGameStore.getState().leaveNet();
    } catch {
      // Переход в меню не должен зависеть от причины ошибки.
    }
    try {
      window.history.replaceState(null, "", window.location.pathname);
    } catch {
      // history может быть недоступен в нестандартном окружении.
    }
    window.location.reload();
  };

  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center " +
        "bg-bg text-fg"
      }
    >
      <span className="text-clay" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
        <p className="max-w-md text-sm leading-snug text-muted">
          Не удалось открыть игру. Попробуйте ещё раз — если ошибка повторится, вернитесь в меню.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={reset}>
          Попробовать снова
        </Button>
        <Button type="button" variant="secondary" onClick={goToMenu}>
          В меню
        </Button>
      </div>
      {import.meta.env.DEV ? (
        <details className="mt-2 max-w-xl text-left text-xs text-muted">
          <summary className="cursor-pointer">Подробности ошибки</summary>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-sm)] bg-surface-2 p-3">
            {error instanceof Error ? error.message : String(error)}
            {info?.componentStack ? `\n${info.componentStack}` : ""}
          </pre>
        </details>
      ) : null}
    </main>
  );
}
