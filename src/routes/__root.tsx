import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { initLang, t, useLang, LANG_BOOT_SCRIPT } from "@/lib/i18n";
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
  useEffect(() => {
    // Единожды на монтирование: сохранённый выбор или язык устройства.
    initLang();
  }, []);
  useEffect(() => {
    // Название и описание — на текущем языке. Императивно, а не в разметке:
    // <title>/<meta> в дереве компонента React 19 поднимает в <head> и при
    // гидратации может разойтись с SSR-набором HeadContent.
    document.title = t("app.name");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("app.description"));
  }, [lang]);
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
      { title: "Эволюция" },
      { name: "theme-color", content: "#111410" },
      { name: "description", content: "Цифровая «Эволюция» — русская настольная игра о происхождении видов." },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
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
        <PreviewHostBridge />
        <LangInit />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
