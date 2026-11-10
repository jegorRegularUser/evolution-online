import type { AnyRouteMatch, MetaDescriptor } from "@tanstack/react-router";
import { translate, type Lang, type TKey } from "@/lib/i18n";
import {
  createVideoGameStructuredData,
  productionUrl,
  SEO_PATHS,
  SEO_ROUTE_KEYS,
  SOCIAL_IMAGE_PATH,
  X_BANNER_PATH,
  type SeoPath,
} from "@/lib/seo-data";

export { PRODUCTION_ORIGIN, SEO_PATHS, productionUrl, type SeoPath } from "@/lib/seo-data";

type RouteSeoKeys = {
  titleKey: TKey;
  descriptionKey: TKey;
};

const ROUTE_SEO = SEO_ROUTE_KEYS satisfies Record<SeoPath, RouteSeoKeys>;
const SEO_PATH_SET = new Set<string>(SEO_PATHS);

export type LocalizedRouteSeo = {
  title: string;
  description: string;
};

export type RouteSeoHead = {
  meta: NonNullable<AnyRouteMatch["meta"]>;
  links: NonNullable<AnyRouteMatch["links"]>;
};

/** Возвращает локализованные title/description из единой карты маршрутов. */
export function localizedRouteSeo(path: SeoPath, lang: Lang): LocalizedRouteSeo {
  const route = ROUTE_SEO[path];
  return {
    title: translate(lang, route.titleKey),
    description: translate(lang, route.descriptionKey),
  };
}

/**
 * Полный стабильный RU head маршрута. SSR canonical и social metadata не
 * зависят от языка браузера; только видимые title/description локализуются на
 * клиенте после монтирования через syncLocalizedDocumentSeo.
 */
export function routeSeoHead(path: SeoPath): RouteSeoHead {
  const { title, description } = localizedRouteSeo(path, "ru");
  const canonical = productionUrl(path);
  const image = productionUrl(SOCIAL_IMAGE_PATH);
  const xBanner = productionUrl(X_BANNER_PATH);
  const siteName = translate("ru", "seo.siteName");
  const imageAlt = translate("ru", "seo.imageAlt");
  const meta: RouteSeoHead["meta"] = [
    { title },
    { name: "description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: siteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
    { property: "x:game:image", content: xBanner },
    { property: "x:game:image:width", content: "1200" },
    { property: "x:game:image:height", content: "264" },
  ];

  if (path === "/") {
    meta.push({
      "script:ld+json": createVideoGameStructuredData({
        name: siteName,
        description,
        image,
      }),
    } as MetaDescriptor as RouteSeoHead["meta"][number]);
  }

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}

/** Узнаёт индексируемый pathname; query/hash сюда намеренно не входят. */
function seoPathFromPathname(pathname: string): SeoPath | null {
  const normalized = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
  return SEO_PATH_SET.has(normalized) ? (normalized as SeoPath) : null;
}

/**
 * После гидратации синхронизирует только title и обычный description с языком
 * интерфейса. Canonical, Open Graph, Twitter и JSON-LD остаются стабильными RU.
 */
export function syncLocalizedDocumentSeo(pathname: string, lang: Lang): void {
  if (typeof document === "undefined") return;
  const path = seoPathFromPathname(pathname);
  if (!path) return;

  const { title, description } = localizedRouteSeo(path, lang);
  document.title = title;
  const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.content = description;
}
