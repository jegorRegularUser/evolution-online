// Сборка арт-ассетов: assets/grok-*.jpg -> public/img/** (пережим под веб).
// Сопоставление — по 8-символьному префиксу имени файла.
// Запуск: node scripts/build-art.mjs
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const SRC = "assets";
const OUT = "public/img";

// kind: см. processKind ниже
const JOBS = [
  // --- карты свойств (19) ---
  ["ab7e2575", "trait/carnivore.jpg", "card"],
  ["7ff1c3f5", "trait/swimming.jpg", "card"],
  ["ea950712", "trait/camouflage.jpg", "card"],
  ["86e126b2", "trait/sharpVision.jpg", "card"],
  ["c3e824cb", "trait/burrowing.jpg", "card"],
  ["e5c2a208", "trait/scavenger.jpg", "card"],
  ["326c11f3", "trait/symbiosis.jpg", "card"],
  ["2d4360c4", "trait/piracy.jpg", "card"],
  ["2bb7ad6b", "trait/tailLoss.jpg", "card"],
  ["bfa71f8e", "trait/grazing.jpg", ["card", "attention"]],
  ["498b4552", "trait/cooperation.jpg", "card"],
  ["a9d0cd4c", "trait/running.jpg", "card"],
  ["297cd547", "trait/highBodyWeight.jpg", "card"],
  ["683e379d", "trait/parasite.jpg", "card"],
  ["0dca9a51", "trait/fatTissue.jpg", "card"],
  ["f3f4e3bb", "trait/communication.jpg", "card"],
  ["a8ae8159", "trait/poisonous.jpg", "card"],
  ["b622b83c", "trait/hibernation.jpg", "card"],
  ["202e571e", "trait/mimicry.jpg", "dark"], // гравюра бабочки, в UI на тёмной плашке
  // --- рубашка и мета ---
  ["4e5f89cb", "meta/card-back.jpg", "card"],
  ["31d3dd2f", "meta/logo-emblem.png", "logo384"],
  ["31d3dd2f", "meta/app-icon.png", "icon512"],
  // --- жетоны ---
  ["318a3352", "token/meat.jpg", "tok"],
  ["cd2b9ec5", "token/plant.jpg", "tok"],
  ["64f44427", "token/fat.jpg", "tok"],
  ["f86b74c1", "token/seed.jpg", "tok"],
  ["ad182d97", "token/dice-blank.png", "art"],
  // --- медальоны видов ---
  ["5c5f2fc1", "species/herb-small.jpg", "sq512"],
  ["5f34289b", "species/herb-medium.jpg", "sq512"],
  ["297cd547", "species/herb-large.jpg", "sq512"],
  ["e3e3b6d2", "species/carn-small.jpg", "sq512"],
  ["752c1bbf", "species/carn-medium.jpg", "sq512"],
  ["4ad8d0d2", "species/carn-large.jpg", "sq512"],
  ["7ff1c3f5", "species/aquatic.jpg", "sq512"],
  ["6340b73e", "species/extinct.jpg", "sq512"],
  // --- фоны ---
  ["341b0a7f", "bg/menu.jpg", "bg"],
  ["2b7377c7", "bg/valley.jpg", "bg"],
  ["28a0c1ab", "bg/ocean.jpg", ["bgw", 1600, 900]],
  ["dc3ba50f", "bg/extinction.jpg", "bg"],
  ["f23b2ec1", "bg/victory.jpg", "bg"],
  ["16415139", "bg/bank-bowl.jpg", ["bgw", 1200, 675]],
  ["1bec2502", "bg/texture-felt.jpg", "tex"],
  ["c11ec6f4", "bg/texture-paper.jpg", "tex"],
  ["8ead0dfd", "bg/texture-water.jpg", "tex"],
  // --- фазы ---
  ["f9d591ca", "phase/development.png", "art"],
  ["8a420a23", "phase/feeding.png", "art"],
  ["2500a758", "phase/roll-food.png", "art"],
  ["1bca4f27", "phase/extinction.png", "art"],
  // --- глифы свойств (гравюры) ---
  ["c06c1dc2", "glyph/carnivore.png", "art"],
  ["424a1cd3", "glyph/swimming.png", "art"],
  ["13e849ef", "glyph/camouflage.png", "art"],
  ["de223732", "glyph/sharpVision.png", "art"],
  ["079c5422", "glyph/burrowing.png", "art"],
  ["0d532719", "glyph/scavenger.png", "art"],
  ["bc9259d0", "glyph/symbiosis.png", "art"],
  ["15809888", "glyph/piracy.png", "art"],
  ["78f85131", "glyph/tailLoss.png", "art"],
  ["699b563a", "glyph/fatTissue.png", "art"],
  ["7ee283be", "glyph/communication.png", "art"],
  ["1c8528ab", "glyph/poisonous.png", "art"],
  ["e143b73a", "glyph/hibernation.png", "art"],
  ["ca74b15f", "glyph/running.png", "art"],
  ["cccd6f0d", "glyph/cooperation.png", "art"],
  ["f9b58b42", "glyph/parasite.png", "art"],
  ["14593b07", "glyph/mimicry.png", "art"],
  // --- иконки ---
  ["5277a321", "icon/population.png", "art"],
  ["ade4ff2f", "icon/body-size.png", "art"],
  ["d695d6ee", "icon/hunger.png", "art"],
  ["4098fe76", "icon/teeth.png", "art"],
  ["867c22c1", "icon/attack.png", "art"],
  ["bda1310e", "icon/defense.png", "art"],
  ["b2ec3d40", "icon/dna.png", "art"],
  ["c25a8f65", "icon/virus.png", "art"],
  ["73059432", "icon/migration.png", "art"],
  ["9bcb036f", "mutation/neoplasia.png", "art"],
  // --- частицы ---
  ["14593b07", "fx/leaf.png", "fx"],
  ["49633523", "fx/droplet.png", "fx"],
  ["4b8003fd", "fx/spore-puff.png", "fx"],
  ["f19ca04a", "fx/feather.png", "fx"],
  ["8450d44a", "fx/bone-chip.png", "fx"],
  ["36cddc5e", "fx/footprint.png", "fx"],
  ["e322bc6b", "fx/egg.png", "fx"],
  // --- континенты ---
  ["f3cd1e02", "world/continent-africa.jpg", "cont"],
  ["9036ca92", "world/continent-eurasia.jpg", "cont"],
  ["7026cb13", "world/continent-north-america.jpg", "cont"],
  ["89e22ab2", "world/continent-south-america.jpg", "cont"],
  ["c0ca52e9", "world/continent-australia.jpg", "cont"],
  ["2ad076a7", "world/continent-antarctica.jpg", ["cont", "attention"]],
  // --- мутации ---
  ["1da57803", "mutation/virus-1.jpg", "mut"],
  ["85c9dadb", "mutation/virus-2.jpg", "mut"],
  ["ed4296da", "mutation/virus-3.jpg", "mut"],
  // --- грибы ---
  ["d74b641a", "fungi/cluster.jpg", "sq512"],
  ["e3dc8410", "fungi/mycelium.jpg", "sq512"],
  // --- туториалы ---
  ["c43137df", "tutorial/place-card.jpg", "tut"],
  ["6b1c877d", "tutorial/feeding.jpg", "tut"],
  ["41b06939", "tutorial/hunt.jpg", "tut"],
  ["37c765cc", "tutorial/extinction.jpg", "tut"],
  // --- корень public: обложки ---
  ["341b0a7f", "../og.jpg", "og"],
  ["2b7377c7", "../x-banner.jpg", ["bgw", 1600, 900]],
];

const files = await readdir(SRC);
const resolve = (prefix) => {
  const hit = files.find((f) => f.startsWith(`grok-${prefix}`));
  if (!hit) throw new Error(`нет файла с префиксом ${prefix}`);
  return `${SRC}/${hit}`;
};

async function processKind(kind, src, dest) {
  const out = `${OUT}/${dest}`;
  await mkdir(dirname(out), { recursive: true });
  let pipe;
  if (kind === "card" || (Array.isArray(kind) && kind[0] === "card")) {
    const position = Array.isArray(kind) && kind[1] === "attention" ? "attention" : "centre";
    pipe = sharp(src).resize(720, 1080, { fit: "cover", position });
  } else if (kind === "dark") {
    pipe = sharp(src).resize(720, 720, { fit: "cover" });
  } else if (kind === "sq512") {
    pipe = sharp(src).resize(512, 512, { fit: "cover", position: "attention" });
  } else if (kind === "tok") {
    pipe = sharp(src).resize(256, 256, { fit: "cover" });
  } else if (kind === "art") {
    pipe = sharp(src).resize(192, 192, { fit: "cover", position: "attention" });
  } else if (kind === "fx") {
    pipe = sharp(src).resize(160, 160, { fit: "cover", position: "attention" });
  } else if (kind === "bg") {
    pipe = sharp(src).resize(1920, 1080, { fit: "cover" });
  } else if (Array.isArray(kind) && kind[0] === "bgw") {
    pipe = sharp(src).resize(kind[1], kind[2], { fit: "cover" });
  } else if (kind === "tex") {
    pipe = sharp(src).resize(512, 512, { fit: "cover" });
  } else if (kind === "cont" || (Array.isArray(kind) && kind[0] === "cont")) {
    const position = Array.isArray(kind) && kind[1] === "attention" ? "attention" : "centre";
    pipe = sharp(src).resize(640, 640, { fit: "cover", position });
  } else if (kind === "mut") {
    pipe = sharp(src).resize(256, 256, { fit: "cover" });
  } else if (kind === "tut") {
    pipe = sharp(src).resize(800, 533, { fit: "cover" });
  } else if (kind === "logo384") {
    pipe = sharp(src).resize(384, 384, { fit: "cover" });
  } else if (kind === "icon512") {
    pipe = sharp(src).resize(512, 512, { fit: "cover" });
  } else if (kind === "og") {
    pipe = sharp(src).resize(1200, 630, { fit: "cover", position: "entropy" });
  } else {
    throw new Error(`неизвестный kind: ${kind}`);
  }

  const png = dest.endsWith(".png");
  if (png) await pipe.png({ compressionLevel: 9 }).toFile(out);
  else await pipe.jpeg({ quality: kind === "og" ? 84 : 80, progressive: true, mozjpeg: true }).toFile(out);
}

let ok = 0;
for (const [prefix, dest, kind] of JOBS) {
  const src = resolve(prefix);
  await processKind(kind, src, dest);
  ok++;
}
console.log(`готово: ${ok} файлов -> ${OUT}/ и og/x-banner в public/`);
