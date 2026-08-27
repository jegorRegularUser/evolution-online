import { createWorker } from "tesseract.js";
const worker = await createWorker("rus", 1, { logger: () => {} });
const { data } = await worker.recognize("tesera-p1.png", {}, { blocks: true });
for (const b of data.blocks || []) for (const p of b.paragraphs || []) for (const l of p.lines || []) {
  const txt = (l.words || []).map(w => w.text).join(" ");
  console.log(`y=${Math.round(l.bbox.y0)}-${Math.round(l.bbox.y1)} :: ${txt}`);
}
await worker.terminate();
