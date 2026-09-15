// QA подсказок свойств: hover на десктопе, тап на мобильном, закрытие, позиция «над чипом».
// Использование: node scripts/tip-smoke.mjs [baseUrl]
// Партия — сетевой стол с ботом (соло-режим удалён): see scripts/qa-lib.mjs.
import { chromium } from "playwright";
import { endPhaseStep, shotsDir, startNetGame } from "./qa-lib.mjs";

const BASE = process.argv[2] ?? process.env.EVO_URL ?? "http://127.0.0.1:8099/";
// Скриншоты — вне репозитория (дефолт — временная папка): PNG в screenshots/
// дёргал Tailwind в dev и перезагружал вкладки. Переопределяется EVO_SHOTS.
const OUT = shotsDir();

const problems = [];
function note(kind, text) {
  problems.push(`[${kind}] ${text}`);
  console.error(`[tip] ${kind}: ${text}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function track(page, label) {
  page.on("console", (m) => {
    if (m.type() === "error") note(`${label}/console`, m.text());
  });
  page.on("pageerror", (e) => note(`${label}/pageerror`, String(e)));
}

/** Сетевой стол с ботом: раньше здесь был соло-старт из меню. */
async function startGame(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await startNetGame(page, { name: "Подсказки", players: 2, bots: 1 });
}

/** Играет за человека, пока не появятся свойства на столе (чипы с data-trait-chip). */
async function playUntilChips(page, maxSteps = 40) {
  let lastLabel = "";
  for (let i = 0; i < maxSteps; i++) {
    if ((await page.locator("[data-trait-chip]").count()) > 0) return true;
    // Защита от нападения — модалки
    for (const name of [/Не защищаться/i, /Быстрое — бросок кубика/i]) {
      const b = page.getByRole("button", { name }).first();
      if (await b.isVisible().catch(() => false)) {
        await b.click();
        await sleep(250);
        continue;
      }
    }
    const target = page.locator("[data-animal-id].ring-accent").first();
    if ((await target.count()) > 0 && (await target.isEnabled().catch(() => false))) {
      await target.click({ position: { x: 20, y: 30 } });
      await sleep(300);
      continue;
    }
    const animalBtn = page.getByRole("button", { name: "Животное" }).first();
    if (await animalBtn.isEnabled().catch(() => false)) {
      await animalBtn.click();
      await sleep(300);
      continue;
    }
    let acted = false;
    // Завершение хода: «Пас» волна 1 убрала из развития, поэтому пробуем
    // «Закончить развитие» (развитие) и «Закончить ход» (питание, без диалога);
    // «Закончить питание» жмётся хелпером — она открывает подтверждение.
    for (const label of [
      "Взять еду",
      "Жир",
      "Спячка",
      "Только топтать",
      "Охота",
      "Закончить развитие",
      "Закончить ход",
    ]) {
      if (label === lastLabel && label !== "Охота") continue;
      const b = page.getByRole("button", { name: label, exact: true });
      if ((await b.count()) > 0 && (await b.first().isEnabled().catch(() => false))) {
        await b.first().click();
        lastLabel = label;
        acted = true;
        break;
      }
    }
    // Ничего из списка нет — значит, питание можно завершить только целиком
    // («Закончить питание» + подтверждение) или это чужой ход.
    if (!acted) acted = await endPhaseStep(page);
    if (!acted) await sleep(400);
    await sleep(250);
  }
  return (await page.locator("[data-trait-chip]").count()) > 0;
}

/** Проверки открытой подсказки: видима, не пустая, расположена над чипом. */
async function checkBubble(page, label) {
  const bubble = page.locator('[role="tooltip"]');
  await bubble.waitFor({ state: "visible", timeout: 3000 });
  const info = await page.evaluate(() => {
    const chip = document.querySelector("[data-trait-chip]:hover") ?? document.activeElement;
    const tip = document.querySelector('[role="tooltip"]');
    if (!tip) return null;
    const t = tip.getBoundingClientRect();
    const c = chip?.getBoundingClientRect?.() ?? null;
    return {
      text: tip.textContent ?? "",
      top: t.top,
      bottom: t.bottom,
      chipTop: c?.top ?? null,
      chipBottom: c?.bottom ?? null,
    };
  });
  if (!info || info.text.trim().length < 20) note(label, `подсказка пуста или отсутствует: ${JSON.stringify(info)}`);
  else {
    // Валидно: целиком над чипом или целиком под ним (когда сверху нет места).
    const above = info.chipTop !== null && info.bottom <= info.chipTop + 2;
    const below = info.chipBottom !== null && info.top >= info.chipBottom - 2;
    if (!above && !below) note(label, `подсказка перекрывает чип: ${JSON.stringify(info)}`);
    else console.log(`[tip] ${label}: окно ${above ? "над" : "под"} чипом, текст «${info.text.slice(0, 60)}…»`);
  }
  return info;
}

/** Открывает подсказку (hover или tap) с повторами: боты играют быстро и карточка
 * с выбранным чипом может уйти с поля между шагами. */
async function openTip(page, how, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    const chip = page.locator("[data-trait-chip]").first();
    if ((await chip.count()) === 0) return false;
    await (how === "tap" ? chip.tap() : chip.hover());
    if (await page.locator('[role="tooltip"]').isVisible().catch(() => false)) return true;
    await sleep(400);
  }
  return false;
}

const verdict = { desktopHover: false, desktopClose: false, mobileTap: false, mobileOutsideClose: false };

// --- Десктоп: мышь ---
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  track(page, "desktop");
  try {
    await startGame(page);
    if (!(await playUntilChips(page))) note("desktop", "не дождались свойств на столе");
    if (!(await openTip(page, "hover"))) {
      note("desktop", "подсказка не открылась при наведении");
    } else {
      await checkBubble(page, "desktop/hover");

      // elementFromPoint тут неприменим (у окна pointer-events:none), поэтому
      // проверяем инвариант порядка отрисовки: окно fixed с z>=50 в root-контексте,
      // и среди предков чипа нет стекового контекста с z-index >= 50.
      const paint = await page.evaluate(() => {
        const tip = document.querySelector('[role="tooltip"]');
        if (!tip) return { present: false, ok: false };
        const cs = getComputedStyle(tip);
        if (cs.position !== "fixed" || Number(cs.zIndex) < 50) return { present: true, ok: false };
        const chip = document.querySelector("[data-trait-chip]");
        let el = chip?.parentElement ?? null;
        while (el && el !== document.body) {
          const s = getComputedStyle(el);
          const createsContext =
            s.position !== "static" ||
            s.transform !== "none" ||
            s.filter !== "none" ||
            (s.backdropFilter && s.backdropFilter !== "none") ||
            s.isolation === "isolate";
          if (createsContext && s.zIndex !== "auto" && Number(s.zIndex) >= 50) return { present: true, ok: false };
          el = el.parentElement;
        }
        return { present: true, ok: true };
      });
      if (!paint.present) note("desktop", "подсказка закрылась перед проверкой z-порядка");
      else if (!paint.ok) note("desktop", "подсказка может быть перекрыта (z-инвариант нарушен)");
      verdict.desktopHover = true;

      await sleep(300); // даём fade-in доигать, иначе скриншот поймает полупрозрачное окно
      await page.screenshot({ path: `${OUT}/desktop-trait-tip.png` });
      const r = await page.locator('[role="tooltip"]').boundingBox().catch(() => null);
      if (r) {
        await page.screenshot({
          path: `${OUT}/desktop-trait-tip-zoom.png`,
          clip: { x: Math.max(0, r.x - 60), y: Math.max(0, r.y - 60), width: r.width + 120, height: r.height + 140 },
        });
      }

      // Уводим мышь — подсказка закрывается
      await page.mouse.move(640, 60);
      await sleep(300);
      verdict.desktopClose = (await page.locator('[role="tooltip"]').count()) === 0;
      if (!verdict.desktopClose) note("desktop", "подсказка не закрылась при уходе мыши");
    }
  } catch (e) {
    note("desktop/fail", String(e));
    await page.screenshot({ path: `${OUT}/desktop-fail.png` }).catch(() => {});
  } finally {
    await browser.close();
  }
}

// --- Мобильный: тач ---
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
  });
  const page = await ctx.newPage();
  track(page, "mobile");
  try {
    await startGame(page);
    if (!(await playUntilChips(page))) note("mobile", "не дождались свойств на столе");
    if (!(await openTip(page, "tap"))) {
      note("mobile", "подсказка не открылась по тапу");
    } else {
      await checkBubble(page, "mobile/tap");
      verdict.mobileTap = true;
      await sleep(300); // fade-in доигрывает до скриншота
      await page.screenshot({ path: `${OUT}/mobile-trait-tip.png` });

      // Тап мимо — подсказка закрывается
      await page.locator("header").tap().catch(async () => {
        await page.touchscreen.tap(195, 40);
      });
      await sleep(300);
      verdict.mobileOutsideClose = (await page.locator('[role="tooltip"]').count()) === 0;
      if (!verdict.mobileOutsideClose) note("mobile", "подсказка не закрылась при тапе мимо");
    }
  } catch (e) {
    note("mobile/fail", String(e));
    await page.screenshot({ path: `${OUT}/mobile-fail.png` }).catch(() => {});
  } finally {
    await browser.close();
  }
}

console.log(JSON.stringify({ verdict, problems }, null, 2));
process.exit(problems.length === 0 ? 0 : 1);
