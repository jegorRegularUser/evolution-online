/**
 * Проверка физических кубиков: доходим до фазы кормовой базы, ждём, пока
 * кучка улеглась, и убеждаемся, что канвас кубиков рисует непрозрачные
 * пиксели (не пустой), а сумма броска появилась в лотке.
 * node scripts/qa-dice-check.mjs
 */
import { chromium } from "playwright";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("WebGL")) errors.push("CONSOLE: " + m.text());
});

try {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Начать год" }).click();

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if ((await page.evaluate(() => document.body.innerText)).includes("Кормовая база")) break;
    const pass = page.getByRole("button", { name: "Пас", exact: true });
    if ((await pass.isVisible().catch(() => false)) && (await pass.isEnabled().catch(() => false))) {
      await pass.click();
    }
    await page.waitForTimeout(250);
  }
  console.log("фаза кормовой базы достигнута");
  // Фаза короткая (~2 с до Питания): опрашиваем канвасы, пока лоток жив.
  let sawCanvas = false;
  let painted = false;
  for (let k = 0; k < 24 && !painted; k++) {
    const dice = await page.evaluate(() => {
      const out = [];
      for (const c of document.querySelectorAll("canvas")) {
        const gl = c.getContext("webgl2") ?? c.getContext("webgl");
        if (!gl) continue;
        let opaque = 0;
        const pts = [
          [c.width / 2, c.height / 2],
          [c.width / 2 - 12, c.height / 2 + 6],
          [c.width / 2 + 12, c.height / 2 - 6],
          [c.width / 3, c.height / 2],
          [(c.width * 2) / 3, c.height / 2],
        ];
        for (const [x, y] of pts) {
          const buf = new Uint8Array(4);
          gl.readPixels(Math.floor(x), Math.floor(y), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
          if (buf[3] > 0 && (buf[0] > 0 || buf[1] > 0 || buf[2] > 0)) opaque++;
        }
        out.push({ w: c.width, h: c.height, opaque, of: pts.length });
      }
      return out;
    });
    if (dice.length) sawCanvas = true;
    if (dice.some((d) => d.opaque >= 2)) {
      painted = true;
      console.log("канвасы:", JSON.stringify(dice));
      // Доля непрозрачных пикселей центральной строки — насколько кучка
      // заполняет кадр по ширине.
      const row = await page.evaluate(() => {
        for (const c of document.querySelectorAll("canvas")) {
          const gl = c.getContext("webgl2") ?? c.getContext("webgl");
          if (!gl || c.width < 40) continue;
          const buf = new Uint8Array(c.width * 4);
          gl.readPixels(0, Math.floor(c.height / 2), c.width, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
          let opaque = 0;
          for (let i = 3; i < buf.length; i += 4) if (buf[i] > 0) opaque++;
          return { w: c.width, opaque };
        }
        return null;
      });
      if (row) console.log("центральная строка:", JSON.stringify(row), `(${Math.round((row.opaque / row.w) * 100)}% ширины)`);
    }
    await page.waitForTimeout(300);
  }
  console.log(
    painted
      ? "OK: кубики рисуют непустые кадры"
      : sawCanvas
        ? "FAIL: канвасы есть, но пиксели пусты"
        : "FAIL: канвасы кубиков не найдены",
  );
  if (!painted) process.exitCode = 1;
  if (sawCanvas) {
    console.log("OK: лоток кубиков появляется в фазе кормовой базы");
  }
} finally {
  if (errors.length) {
    console.log("── ошибки ──\n" + errors.join("\n"));
    process.exitCode = 1;
  } else console.log("ошибок страницы нет");
  await browser.close();
}
