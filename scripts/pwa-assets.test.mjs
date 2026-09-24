import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";
import {
  isInstallQuery,
  renderInstallPageHtml,
  renderWebManifest,
  snapshotOgIdentity,
  stripInstallParams,
} from "./grok-pwa-shared.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

test("манифест сохраняет единый бренд и deep-link параметр", () => {
  const manifest = JSON.parse(renderWebManifest("localhost:8099"));
  assert.equal(manifest.name, "Эволюция");
  assert.equal(manifest.short_name, "Эволюция");
  assert.equal(manifest.start_url, "/?room=");
  assert.equal(manifest.theme_color, "#111410");
  assert.deepEqual(
    manifest.icons.map((icon) => icon.sizes),
    ["180x180", "192x192", "512x512", "512x512"],
  );
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
});

test("голая install-ссылка открывает подсказку и сохраняет room", () => {
  assert.equal(isInstallQuery("/?install=1"), true);
  assert.equal(isInstallQuery("/?install=true&platform=android"), true);
  assert.equal(isInstallQuery("/?install=0"), false);
  assert.equal(stripInstallParams("/?install=1&room=FVWG&platform=ios"), "/?room=FVWG");
});

test("страница установки локализована и не показывает Grok", () => {
  const template = readFileSync(join(ROOT, "scripts/install-page.html"), "utf8");
  const html = renderInstallPageHtml(template, { url: "/?install=1&room=FVWG" });
  assert.match(html, /lang="ru"/);
  assert.match(html, /Добавить Эволюция/);
  assert.match(html, /На экран «Домой»/);
  assert.match(html, /href="\/\?room=FVWG"/);
  assert.doesNotMatch(html, />Grok</);
  assert.doesNotMatch(html, /Add Эволюция/);
});

test("PWA/social assets exist with the declared dimensions", async () => {
  const expected = {
    "icon-180.png": [180, 180],
    "icon-192.png": [192, 192],
    "icon-512.png": [512, 512],
    "og.jpg": [1200, 630],
    "x-banner.jpg": [1200, 264],
  };
  for (const [name, [width, height]] of Object.entries(expected)) {
    const path = join(ROOT, "public", "__grok", name);
    assert.ok(existsSync(path), path);
    const meta = await sharp(path).metadata();
    assert.equal(meta.width, width, name);
    assert.equal(meta.height, height, name);
  }
});

test("baked OG identity points at branded PWA assets", () => {
  const { site } = snapshotOgIdentity(ROOT);
  assert.equal(site.image, "/__grok/og.jpg");
  assert.equal(site.banner, "/__grok/x-banner.jpg");
});
