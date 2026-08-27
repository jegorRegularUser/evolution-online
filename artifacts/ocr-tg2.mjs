import { createWorker } from "tesseract.js";
const worker = await createWorker("rus+eng", 1, { logger: () => {} });
await worker.setParameters({ preserve_interword_spaces: "1" });
const files = process.argv.slice(2);
for (const f of files) {
  const { data } = await worker.recognize(f);
  console.log(`=================== ${f} ===================`);
  console.log(data.text);
}
await worker.terminate();
