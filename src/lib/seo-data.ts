export const PRODUCTION_ORIGIN = "https://evolution-online.vercel.app" as const;

export const SEO_PATHS = ["/", "/about", "/bestiary", "/campaign", "/challenges", "/shop"] as const;
export type SeoPath = (typeof SEO_PATHS)[number];

export const SEO_ROUTE_KEYS = {
  "/": { titleKey: "seo.home.title", descriptionKey: "seo.home.description" },
  "/about": { titleKey: "seo.about.title", descriptionKey: "seo.about.description" },
  "/bestiary": { titleKey: "seo.bestiary.title", descriptionKey: "seo.bestiary.description" },
  "/campaign": { titleKey: "seo.campaign.title", descriptionKey: "seo.campaign.description" },
  "/challenges": { titleKey: "seo.challenges.title", descriptionKey: "seo.challenges.description" },
  "/shop": { titleKey: "seo.shop.title", descriptionKey: "seo.shop.description" },
} as const;

export const SOCIAL_IMAGE_PATH = "/__grok/og.jpg" as const;
export const X_BANNER_PATH = "/__grok/x-banner.jpg" as const;
export const SOURCE_REPOSITORY_URL = "https://github.com/jegorRegularUser/evolution-online" as const;

type AbsoluteProductionUrl<Path extends `/${string}`> = `${typeof PRODUCTION_ORIGIN}${Path}`;

/** Собирает абсолютный URL только от выбранного production origin. */
export function productionUrl<const Path extends `/${string}`>(path: Path): AbsoluteProductionUrl<Path> {
  return `${PRODUCTION_ORIGIN}${path}` as AbsoluteProductionUrl<Path>;
}

/** Проверяемая отдельно от React Router структурированная карточка игры. */
export function createVideoGameStructuredData({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "@id": `${PRODUCTION_ORIGIN}/#videogame`,
    name,
    alternateName: ["Эволюция", "Evolution Online"],
    url: productionUrl("/"),
    description,
    image,
    inLanguage: ["ru", "en"],
    applicationCategory: "GameApplication",
    gamePlatform: "Web browser",
    playMode: ["https://schema.org/SinglePlayer", "https://schema.org/MultiPlayer"],
    isAccessibleForFree: true,
    sameAs: [SOURCE_REPOSITORY_URL],
  } as const;
}
