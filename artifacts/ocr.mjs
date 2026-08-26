import { createWorker } from "tesseract.js";

const worker = await createWorker("rus+eng", 1, {
  logger: () => {},
});
await worker.setParameters({
  preserve_interword_spaces: "1",
});
for (const page of ["page-1.png", "page-2.png"]) {
  const { data } = await worker.recognize(page);
  console.log(`=================== ${page} ===================`);
  console.log(data.text);
}
await worker.terminate();
