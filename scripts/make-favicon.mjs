// Генератор public/favicon.ico из public/icons/icon-192.png.
//
// Раньше /favicon.ico отвечал middleware прежней платформы; после переезда на
// полностью статический public/ запрос стал 404 — браузеры дёргают его по
// умолчанию, даже когда в head объявлен SVG-фавикон. Вместо бинарного
// артефакта без истории — воспроизводимый скрипт: ICO-контейнер собирается
// поверх байт icon-192.png (PNG-сжатие внутри ICO — стандартный формат
// записи, размеры 192 влезают в байт ICONDIRENTRY; 256 кодировалась бы нулём).
//
// Запуск: node scripts/make-favicon.mjs (после замены icon-192.png).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "icons", "icon-192.png");
const OUT = join(ROOT, "public", "favicon.ico");

const png = readFileSync(SRC);
if (png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
  throw new Error(`${SRC}: это не PNG`);
}

// ICONDIR (6 байт) + ICONDIRENTRY (16 байт), затем сами байты PNG.
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: 1 = ICO (иконка)
header.writeUInt16LE(1, 4); // ровно одна картинка
header.writeUInt8(192, 6); // width (байт; 0 означало бы 256)
header.writeUInt8(192, 7); // height
header.writeUInt8(0, 8); // палитра не используется (PNG несёт свою)
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // planes
header.writeUInt16LE(32, 12); // bit count (глубина исходника 8 RGBA → 32)
header.writeUInt32LE(png.length, 14); // размер записи
header.writeUInt32LE(22, 18); // смещение данных (сразу после заголовков)

writeFileSync(OUT, Buffer.concat([header, png]));
console.log(`[make-favicon] ${OUT} (${22 + png.length} bytes, PNG ${png.length} bytes)`);
