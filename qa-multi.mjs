// Сетевое QA: два контекста в одной комнате — создание, вход по ссылке,
// старт, ходы с обеих сторон и синхронизация видов.
// Использование: node qa-multi.mjs [baseUrl]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:8099/";
const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
mkdirSync(OUT, { recursive: true });

const problems = [];
function note(label, text) {
  problems.push(`[${label}] ${text}`);
  console.error(`[qa-multi] ${label}: ${text}`);
}

function track(page, label) {
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // Платформенный скрипт grok.com блокируется браузером на постороннем
    // домене (туннель) — на игру не влияет.
    if (/NotSameOrigin/.test(t) && /Failed to load resource/.test(t)) return;
    note(`${label}/console`, t);
  });
  page.on("pageerror", (e) => note(`${label}/pageerror`, String(e)));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (/grok\.com|fonts\.g|extensions\.js/.test(u)) return;
    note(`${label}/request`, `${r.failure()?.errorText} ${u}`);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const ctxA = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const ctxB = await browser.newContext({ viewport: { width: 390, height: 844 } });
const pa = await ctxA.newPage();
const pb = await ctxB.newPage();
track(pa, "A");
track(pb, "B");

try {
  // A: создать стол
  await pa.goto(BASE, { waitUntil: "networkidle" });
  await pa.getByRole("button", { name: "Игра по сети" }).click();
  await pa.getByLabel("Ваше имя").fill("Аня");
  // Три места: Аня + Боря + бот — чтобы проверить и добор ботом.
  await pa
    .locator("fieldset", { hasText: "Мест за столом" })
    .getByRole("button", { name: "3", exact: true })
    .click();
  // Вторая «Создать стол» — кнопка отправки (первая — переключатель вкладки).
  await pa.getByRole("button", { name: "Создать стол" }).last().click();
  await pa.locator("[data-room-code]").waitFor({ timeout: 10000 });
  const code = (await pa.locator("[data-room-code]").textContent())?.trim() ?? "";
  if (!/^[A-Z]{4}$/.test(code)) note("lobby", `странный код стола: "${code}"`);
  console.log(`[qa-multi] стол ${code} создан`);
  await pa.screenshot({ path: `${OUT}qa-net-lobby-a.png` });

  // B: вход по ссылке-приглашению (мобильный вьюпорт)
  await pb.goto(`${BASE}?room=${code}`, { waitUntil: "networkidle" });
  await pb.getByLabel("Ваше имя").fill("Боря");
  await pb.getByRole("button", { name: "Войти", exact: true }).click();
  await pb.locator("[data-room-code]").waitFor({ timeout: 10000 });
  await sleep(1200);
  const bSeesGuests = await pb.getByText("Аня").count();
  if (!bSeesGuests) note("sync", "B не видит Аню в лобби");
  await pb.screenshot({ path: `${OUT}qa-net-lobby-b.png` });

  // A: добавить бота и начать
  await pa.getByRole("button", { name: "Добавить бота" }).click();
  await sleep(900);
  await pa.getByRole("button", { name: "Начать год" }).click();

  // Оба ждут начала партии
  await pa.getByText(/Год 1/).first().waitFor({ timeout: 15000 });
  await pb.getByText(/Год 1/).first().waitFor({ timeout: 15000 });
  console.log("[qa-multi] партия началась у обоих");
  await pa.screenshot({ path: `${OUT}qa-net-a.png` });
  await pb.screenshot({ path: `${OUT}qa-net-b.png` });

  // Ход развития: каждый играет первую карту животным, когда настаёт очередь
  // Ходы развития чередуются между страницами: кто первый не угадать,
  // поэтому «играем» той страницей, у которой сейчас активна кнопка.
  async function tryPlayOnce(page) {
    const animalBtn = page
      .locator('button:not([disabled])')
      .filter({ hasText: /^Животное$/ })
      .first();
    if (await animalBtn.isVisible().catch(() => false)) {
      await animalBtn.click();
      return true;
    }
    const pass = page.getByRole("button", { name: "Пас", exact: true });
    if ((await pass.isVisible().catch(() => false)) && (await pass.isEnabled())) {
      await pass.click();
      return true;
    }
    return false;
  }

  let aPlayed = false;
  let bPlayed = false;
  for (let guard = 0; guard < 120 && !(aPlayed && bPlayed); guard++) {
    if (!aPlayed) aPlayed = await tryPlayOnce(pa);
    if (!bPlayed) bPlayed = await tryPlayOnce(pb);
    await sleep(400);
  }
  if (!aPlayed) note("A", "не дождавшись своего хода развития");
  if (!bPlayed) note("B", "не дождавшись своего хода развития");
  await sleep(2500); // окно на доставку снимков

  const aAnimalsForB = await pb.locator('[data-player-section] .animal-card').count();
  if (aPlayed && aAnimalsForB === 0) note("sync", "B не увидел ни одного животного после хода A");
  else console.log(`[qa-multi] B видит животных соперников: ${aAnimalsForB}`);

  await pa.screenshot({ path: `${OUT}qa-net-after-moves-a.png` });
  await pb.screenshot({ path: `${OUT}qa-net-after-moves-b.png` });
} catch (e) {
  note("fatal", String(e));
} finally {
  await browser.close();
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error("[qa-multi] FAIL");
  process.exit(1);
}
console.log("[qa-multi] OK");
