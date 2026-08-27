import { createWorker } from "tesseract.js";
const worker = await createWorker("rus", 1, { logger: () => {} });
for (const f of process.argv.slice(2)) {
  const { data } = await worker.recognize(f, {}, { blocks: true });
  console.log(`=== ${f} ===`);
  for (const b of data.blocks || []) {
    for (const p of b.paragraphs || []) {
      for (const l of p.lines || []) {
        const txt = (l.words || []).map(w => w.text).join(" ");
        if (/Насекомоядн|Окрыляющ|Прозрачн|получает|вместо/.test(txt)) {
          console.log(`y=${Math.round(l.bbox.y0)}-${Math.round(l.bbox.y1)} x=${Math.round(l.bbox.x0)}-${Math.round(l.bbox.x1)} :: ${txt}`);
        }
      }
    }
  }
}
await worker.terminate();
