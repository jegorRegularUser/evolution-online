import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { initLang, useLang, LANG_BOOT_SCRIPT } from "@/lib/i18n";
import { syncLocalizedDocumentSeo } from "@/lib/seo";
// Прямой импорт вместо `?url`: в dev Vite применяет изменения CSS через HMR
// без перезагрузки страницы (?url даёт <link> без HMR → full-reload →
// соло-партия «выбрасывалась» в меню). Start собирает CSS в бандл сам.
import "../styles.css";

/**
 * Язык интерфейса: SSR и первый клиентский рендер всегда «ru» (см.
 * src/lib/i18n/store.ts) — иначе текст расходится с серверной разметкой и
 * React не чинит атрибуты («won't be patched up»). Сохранённый/определённый
 * язык применяется ПОСЛЕ монтирования (как имя игрока в net-screens.tsx), а
 * <html lang> до первой отрисовки ставит инлайн-скрипт LANG_BOOT_SCRIPT.
 */
function LangInit() {
  const lang = useLang();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    // Единожды на монтирование: сохранённый выбор или язык устройства.
    initLang();
  }, []);
  useEffect(() => {
    // Route head всегда отдаёт стабильные RU SSR metadata. После гидратации
    // локализуем только title/description для текущего pathname; canonical и
    // social metadata остаются теми же сигналами для поисковиков.
    syncLocalizedDocumentSeo(pathname, lang);
  }, [lang, pathname]);
  return null;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // interactive-widget=resizes-content: при появлении экранной клавиатуры
      // браузер ужимает вьюпорт, а не накладывает клавиатуру поверх — поле
      // ввода чата в игре остаётся видимым.
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" },
      { name: "theme-color", content: "#111410" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      // Манифест и иконки — статические файлы в public/ (public/manifest.webmanifest,
      // public/icons/): прежняя Nitro-обвязка платформы удалена, PWA-хром собирается
      // только отсюда.
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap",
      },
    ],
    // Инлайн-скрипт выполняется до первой отрисовки и ставит <html lang>
    // по сохранённому выбору / языку устройства. SSR отдаёт lang="ru";
    // suppressHydrationWarning на <html> глушит расхождение атрибута.
    scripts: [
      {
        children: LANG_BOOT_SCRIPT,
      },
    ],
  }),
  component: () => (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <LangInit />
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
