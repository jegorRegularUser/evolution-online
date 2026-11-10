import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  createVideoGameStructuredData,
  productionUrl,
  PRODUCTION_ORIGIN,
  SEO_PATHS,
  SEO_ROUTE_KEYS,
  SOCIAL_IMAGE_PATH,
  SOURCE_REPOSITORY_URL,
} from "../src/lib/seo-data.ts";

const ROOT = join(import.meta.dirname, "..");
const expectedUrls = SEO_PATHS.map((path) => productionUrl(path));

test("Google verification file is copied byte-for-byte", () => {
  const expected = "google-site-verification: googleaa5540b8bce22df6.html";
  assert.equal(readFileSync(join(ROOT, "public/googleaa5540b8bce22df6.html"), "utf8"), expected);
});

test("robots allows crawling and points at the production sitemap", () => {
  const robots = readFileSync(join(ROOT, "public/robots.txt"), "utf8");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${PRODUCTION_ORIGIN.replaceAll(".", "\\.")}/sitemap\\.xml$`, "m"));
  assert.doesNotMatch(robots, /^Disallow:\s*\/$/m);
});

test("sitemap contains exactly the six clean canonical routes", () => {
  const sitemap = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls, expectedUrls);
  assert.equal(new Set(urls).size, SEO_PATHS.length);
  assert.ok(urls.every((url) => url.startsWith(`${PRODUCTION_ORIGIN}/`)));
  assert.ok(urls.every((url) => !url.includes("?") && !url.includes("#")));
  assert.doesNotMatch(sitemap, /<lastmod>|<changefreq>|<priority>|vercel\.app-[^<]*/);
});

test("every canonical route has its own typed title and description keys", () => {
  assert.deepEqual(Object.keys(SEO_ROUTE_KEYS), [...SEO_PATHS]);
  assert.equal(new Set(Object.values(SEO_ROUTE_KEYS).map((entry) => entry.titleKey)).size, SEO_PATHS.length);
  assert.equal(new Set(Object.values(SEO_ROUTE_KEYS).map((entry) => entry.descriptionKey)).size, SEO_PATHS.length);
});

test("VideoGame JSON-LD states only grounded product facts", () => {
  const schema = createVideoGameStructuredData({
    name: "Эволюция Онлайн",
    description: "Описание",
    image: productionUrl(SOCIAL_IMAGE_PATH),
  });
  assert.equal(schema["@type"], "VideoGame");
  assert.equal(schema.url, productionUrl("/"));
  assert.deepEqual(schema.playMode, [
    "https://schema.org/SinglePlayer",
    "https://schema.org/MultiPlayer",
  ]);
  assert.equal(schema.isAccessibleForFree, true);
  assert.deepEqual(schema.sameAs, [SOURCE_REPOSITORY_URL]);
  assert.doesNotMatch(JSON.stringify(schema), /aggregateRating|ratingValue|review|offers|publisher/);
});
