// Проверка вида 3D-кубика кормовой базы в правилах: читаем пиксели прямо из
// WebGL-canvas (toDataURL, т.к. скриншоты не всегда захватывают WebGL-буфер).
// Грань должна быть сильно прокрашена в цвет базы, очки — светлыми.
import { writeFileSync, rmSync } from "node:fs";
import sharp from "sharp";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const TMP = "screenshots-dice-buffer.txt";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", (e) => console.error(`[dice-qa] pageerror: ${e}`));
await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Правила/i }).first().click();
await sleep(2000); // бумага грузится, кубики укладываются на грань

const dataUrl = await page.evaluate(() => {
  const c = document.querySelector("canvas[role='img']");
  return c ? c.toDataURL("image/png") : null;
});
await browser.close();
if (!dataUrl) {
  console.error("FAIL: canvas кубиков не найден");
  process.exit(1);
}
writeFileSync(TMP, dataUrl);

const b64 = dataUrl.split(",")[1];
const { data, info } = await sharp(Buffer.from(b64, "base64")).raw().toBuffer({ resolveWithObject: true });
let red = 0;
let ivory = 0;
let transparent = 0;
const total = info.width * info.height;
for (let i = 0; i < data.length; i += info.channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = info.channels === 4 ? data[i + 3] : 255;
  if (a < 30) {
    transparent++;
    continue;
  }
  if (r > b + 25 && r > g + 10) red++;
  if (r > 200 && g > 190 && b > 160) ivory++;
}
rmSync(TMP, { force: true });
const visible = total - transparent;
const redShare = (red / visible) * 100;
const ivoryShare = (ivory / visible) * 100;
console.log(
  `[dice-qa] canvas ${info.width}x${info.height}: видимого ${(visible / total * 100).toFixed(1)}%, из него красных ${redShare.toFixed(1)}%, светлых очков ${ivoryShare.toFixed(1)}%`,
);
const fail = [];
if (visible / total < 0.05) fail.push(`кубики не отрисовались: видимого всего ${(visible / total * 100).toFixed(1)}%`);
if (redShare < 60) fail.push(`бумага слабо прокрашена: ${redShare.toFixed(1)}% красных`);
if (ivoryShare < 0.5) fail.push(`очки не читаются: ${ivoryShare.toFixed(1)}% светлых`);
if (fail.length) {
  console.error(`FAIL: ${fail.join("; ")}`);
  process.exit(1);
}
console.log("OK: кубик тонирован бумагой в цвет базы, очки читаются");
