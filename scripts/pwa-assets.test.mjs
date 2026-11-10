import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// PWA-хром теперь полностью статический: файлы в public/ раздаёт веб-сервер
// как есть, динамической обвязки (Nitro-middleware, dev-плагин) больше нет.
// Эти тесты держат консистентным контракт «ссылки в head ↔ файлы на диске»,
// чтобы ссылка не пережила удаление файла (и наоборот).

test("манифест существует, парсится и сохраняет бренд и deep-link параметр", () => {
  const manifestPath = join(ROOT, "public", "manifest.webmanifest");
  assert.ok(existsSync(manifestPath), manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.name, "Эволюция");
  assert.equal(manifest.short_name, "Эволюция");
  // `?room=` сохраняет deep-link контракт приглашений (`?room=CODE`), как и
  // в динамическом манифесте, который этот файл заменил.
  assert.equal(manifest.start_url, "/?room=");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.theme_color, "#111410");
  assert.equal(manifest.background_color, "#111410");
  assert.ok(manifest.icons.length > 0);
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
});

test("манифест не содержит брендинга прежней платформы", () => {
  const manifest = readFileSync(join(ROOT, "public", "manifest.webmanifest"), "utf8");
  assert.doesNotMatch(manifest, /grok/i);
});

test("PWA-иконки существуют и совпадают с манифестом по размерам", async () => {
  // Размеры из public/manifest.webmanifest: браузер валидирует их против
  // реальных картинок при установке PWA.
  const manifestPath = join(ROOT, "public", "manifest.webmanifest");
  const declared = JSON.parse(readFileSync(manifestPath, "utf8"));
  const expected = {
    "icon-180.png": [180, 180],
    "icon-192.png": [192, 192],
    "icon-512.png": [512, 512],
  };
  for (const [name, [width, height]] of Object.entries(expected)) {
    const path = join(ROOT, "public", "icons", name);
    assert.ok(existsSync(path), path);
    assert.ok(statSync(path).size > 0, `${name}: пустой файл`);
    const meta = await sharp(path).metadata();
    assert.equal(meta.width, width, name);
    assert.equal(meta.height, height, name);
    assert.ok(
      declared.icons.some((icon) => icon.src.endsWith(name) && icon.sizes === `${width}x${height}`),
      `${name} объявлен в манифесте`,
    );
  }
});

test("социальные карточки лежат по путям из seo-data и влезают в лимит скраперов", async () => {
  // Лимит 600 КБ из удалённого brand-check: скраперы ссылок (включая X)
  // пропускают более тяжёлые картинки — карточка молча перестаёт разворачиваться.
  const expected = {
    "og.jpg": [1200, 630],
    "x-banner.jpg": [1200, 264],
  };
  for (const [name, [width, height]] of Object.entries(expected)) {
    const path = join(ROOT, "public", name);
    assert.ok(existsSync(path), path);
    const meta = await sharp(path).metadata();
    assert.equal(meta.width, width, name);
    assert.equal(meta.height, height, name);
    assert.ok(statSync(path).size <= 600 * 1024, `${name}: ${statSync(path).size} байт > 600 КБ`);
  }
  // seo-data.ts должен ссылаться ровно на эти файлы: имена путей там
  // зашиты как константы, расхождение даёт 404 в og:image.
  const seoData = readFileSync(join(ROOT, "src", "lib", "seo-data.ts"), "utf8");
  assert.match(seoData, /SOCIAL_IMAGE_PATH = "\/og\.jpg"/);
  assert.match(seoData, /X_BANNER_PATH = "\/x-banner\.jpg"/);
});

test("favicon и ссылки head в __root.tsx указывают на существующие файлы", () => {
  assert.ok(existsSync(join(ROOT, "public", "favicon.svg")), "public/favicon.svg");
  const rootRoute = readFileSync(join(ROOT, "src", "routes", "__root.tsx"), "utf8");
  assert.match(rootRoute, /rel: "manifest", href: "\/manifest\.webmanifest"/);
  assert.match(rootRoute, /rel: "apple-touch-icon", href: "\/icons\/icon-180\.png"/);
  assert.match(rootRoute, /rel: "icon", type: "image\/svg\+xml", href: "\/favicon\.svg"/);
});

test("README не упоминает прежнюю платформу", () => {
  // Платформа вывода из эксплуатации: её имя не должно возвращаться в
  // публичную документацию (см. финальный grep по репозиторию).
  for (const name of ["README.md", "README.ru.md"]) {
    const text = readFileSync(join(ROOT, name), "utf8");
    assert.doesNotMatch(text, /grok/i, name);
  }
});
