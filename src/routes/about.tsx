import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({ component: About });

/**
 * Страница атрибуции (волна 0, IP-стоп-фактор): доступна по прямому адресу
 * /about, ссылок из меню/футера на неё сознательно нет (см. plans/ip-plan.md —
 * футер и меню трогать нельзя из-за параллельных веток). Задача страницы —
 * «не аффилирован», права на настольную игру за автором и издателем,
 * ссылка на rightgames.ru. Все строки — через i18n (ru.ts — канон).
 */
function About() {
  const t = useT();
  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-10 " +
        "bg-bg text-fg"
      }
    >
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-xl font-semibold">{t("about.title")}</h1>
        <p className="text-sm leading-snug">{t("about.lead")}</p>
        <div className="space-y-3 text-sm leading-snug text-muted">
          <p>{t("about.notAffiliated")}</p>
          <p>{t("about.rights")}</p>
          <p>{t("about.artwork")}</p>
          <p>{t("about.takedown")}</p>
        </div>
        <p className="text-sm leading-snug">
          <a
            className="underline underline-offset-4 hover:text-clay"
            href="https://rightgames.ru"
            target="_blank"
            rel="noreferrer"
          >
            {t("about.publisher")} — rightgames.ru
          </a>
        </p>
        <Link
          to="/"
          className="block text-sm text-muted underline underline-offset-4 hover:text-fg"
        >
          ← {t("about.back")}
        </Link>
      </div>
    </main>
  );
}
