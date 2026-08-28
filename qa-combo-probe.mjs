// Пробник зависания комбо-сценария «Случайные мутации + Континенты + Растения»:
// запускает партию и каждые 15с печатает фазу, кнопки футера/модалки и наличие
// подсвеченной цели. Помогает понять, чего именно ждёт игра.
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:8099/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.error(`[probe] pageerror: ${e}`));
page.on("console", (m) => {
  if (m.type() === "error") console.error(`[probe] console: ${m.text()}`);
});

await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Начать год/i }).waitFor({ timeout: 20000 });
// 2 игрока, все три модуля
const nBtn = page.getByRole("button", { name: "2", exact: true }).first();
if (await nBtn.isVisible().catch(() => false)) await nBtn.click();
await page.waitForTimeout(150);
for (const name of [/Случайные мутации/i, /Континенты/i, /^Растения/i]) {
  const t = page.getByRole("button", { name }).first();
  if (((await t.getAttribute("aria-pressed")) ?? "false") !== "true") await t.click();
  await page.waitForTimeout(100);
}
const fast = page.getByRole("button", { name: "Быстро" }).first();
if (await fast.isVisible().catch(() => false)) await fast.click();
await page.getByRole("button", { name: /Начать год/i }).click();
console.log("[probe] игра началась");

const snapshot = () =>
  page.evaluate(() => {
    const visible = (el) => el.offsetParent !== null;
    const modal = [...document.querySelectorAll(".fixed.inset-0.z-40 button")]
      .filter((b) => visible(b) && !b.disabled)
      .map((b) => b.textContent.trim());
    const footer = [...document.querySelectorAll("footer button")]
      .filter((b) => visible(b) && !b.disabled)
      .map((b) => b.textContent.trim());
    const phase = (document.body.innerText.match(/Год \d+ · [А-Яа-яё]+/) ?? ["?"])[0];
    const actor = (document.body.innerText.match(/Ход[^\n]{0,40}/) ?? [""])[0];
    const hint = (document.body.innerText.match(/Выберите[^\n]{0,60}/) ?? [""])[0];
    return {
      phase,
      actor,
      hint,
      modal,
      footer: footer.slice(0, 12),
      hasTarget: Boolean(document.querySelector("[data-animal-id].ring-accent, [data-plant-id].ring-accent")),
    };
  });

let lastLabel = "";
const click = async (locator) => {
  try {
    await locator.click({ timeout: 2000 });
    return true;
  } catch {
    return false;
  }
};

async function autoStep(snap) {
  const modalPick = (re) => snap.modal.find((t) => re.test(t));
  let pick = modalPick(/Не защищаться/);
  if (pick) return (await click(page.getByRole("button", { name: pick, exact: true }).first())) ? "surrender" : null;
  pick = modalPick(/Быстрое — бросок кубика/);
  if (pick) return (await click(page.getByRole("button", { name: pick, exact: true }).first())) ? "running" : null;
  pick = modalPick(/Мимикрия/);
  if (pick) return (await click(page.getByRole("button", { name: pick }).first())) ? "mimicry" : null;
  pick = modalPick(/^Отбросить/);
  if (pick) return (await click(page.getByRole("button", { name: pick }).first())) ? "tail" : null;
  if (snap.footer.some((t) => t.includes("Новый вид"))) {
    const any = page.getByRole("button", { name: /Новый вид/ }).first();
    if (await click(any)) return "newAnimal";
    return null;
  }
  if (snap.hasTarget) {
    if (await click(page.locator("[data-animal-id].ring-accent, [data-plant-id].ring-accent").first())) return "target";
  }
  for (const label of ["Взять еду", "Убежище", "Хищное растение", "Жир", "Спячка", "Охота", "Топотун", "Закончить ход", "Пас"]) {
    if (label === lastLabel && label !== "Охота" && label !== "Закончить ход" && label !== "Пас") continue;
    if (snap.footer.includes(label)) {
      if (await click(page.getByRole("button", { name: label, exact: true }).first())) {
        lastLabel = label;
        return label;
      }
    }
  }
  return null;
}

let acted = 0;
for (let i = 0; i < 40; i++) {
  for (let k = 0; k < 15; k++) {
    const snap = await snapshot();
    const did = await autoStep(snap);
    if (did) acted++;
    if (!did) await sleep(200);
  }
  const snap = await snapshot();
  console.log(
    `[probe] +${(i + 1) * 15}s acted=${acted} phase=${snap.phase} actor=${snap.actor || "-"} hint=${snap.hint || "-"} target=${snap.hasTarget}`,
  );
  console.log(`[probe]   footer=[${snap.footer.join(" | ")}]`);
  if (snap.modal.length) console.log(`[probe]   modal=[${snap.modal.join(" | ")}]`);
  if (snap.phase.includes("Год") && !snap.phase.includes("1")) break;
  if ((await page.getByText("Конец эволюции").count()) > 0) {
    console.log("[probe] партия закончилась");
    break;
  }
}

await browser.close();
