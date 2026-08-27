import { createWorker } from "tesseract.js";

const worker = await createWorker("rus+eng", 1, { logger: () => {} });
await worker.setParameters({ preserve_interword_spaces: "1" });
for (let i = 1; i <= 6; i++) {
  const f = `tg-slice${i}.png`;
  const { data } = await worker.recognize(f);
  console.log(`=================== ${f} ===================`);
  console.log(data.text);
}
await worker.terminate();
