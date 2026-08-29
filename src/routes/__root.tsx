import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
// Прямой импорт вместо `?url`: в dev Vite применяет изменения CSS через HMR
// без перезагрузки страницы (?url даёт <link> без HMR → full-reload →
// соло-партия «выбрасывалась» в меню). Start собирает CSS в бандл сам.
import "../styles.css";

const APP_NAME = "Эволюция";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#111410" },
      { name: "description", content: "Цифровая «Эволюция» — русская настольная игра о происхождении видов." },
    ],
    scripts: [
      {
        // До гидратации: если есть сейв прерванной партии, сразу прячем меню,
        // чтобы перезагрузка страницы (F5, HMR) не мигала им. Снимает флаг
        // GameApp после проверки сейва.
        children:
          "try{if(localStorage.getItem('evo-solo-game'))document.documentElement.dataset.evoResume='1'}catch(e){}",
      },
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
  }),
  component: () => (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
