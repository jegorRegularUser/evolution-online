/**
 * QA правок чата: планшетная раскладка дока (768–1024), контраст времени
 * на цветных подложках, кнопка реакции и панель выбора НАД кнопкой.
 *
 * Запуск при живом dev-сервере: node scripts/qa-chat-fix-check.mjs
 * Скриншоты — только вне репозитория (%TEMP%/evo-qa-shots).
 */
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  createRoomViaStore,
  gotoUrl,
  newRuPage,
  openMenu,
  roomCode,
  safeClick,
  sleep,
  startNetGame,
  waitUntil,
} from "./qa-lib.mjs";

const WIDTHS = (process.env.EVO_WIDTHS ?? "390,768,834,1280").split(",").map(Number);
const HEIGHT = Number(process.env.EVO_HEIGHT ?? 800);

const shot = (page, name) =>
  page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false }).catch(() => {});

/** Метрики страницы: горизонтальный скролл и геометрия ленты/стола. */
async function metrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const feed = document.querySelector("[data-feed-mobile]");
    const sheetRect = feed?.getBoundingClientRect();
    const footer = document.querySelector("footer");
    const footerRect = footer?.getBoundingClientRect();
    const main = document.querySelector("main");
    const mainRect = main?.getBoundingClientRect();
    let overlap = null;
    if (sheetRect && mainRect) {
      const xOverlap = Math.max(
        0,
        Math.min(sheetRect.right, mainRect.right) - Math.max(sheetRect.left, mainRect.left),
      );
      const yOverlap = Math.max(
        0,
        Math.min(sheetRect.bottom, mainRect.bottom) - Math.max(sheetRect.top, mainRect.top),
      );
      overlap = { xOverlap: Math.round(xOverlap), yOverlap: Math.round(yOverlap) };
    }
    return {
      scrollW: doc.scrollWidth,
      innerW: window.innerWidth,
      hScroll: doc.scrollWidth > doc.clientWidth,
      feed: sheetRect
        ? {
            x: Math.round(sheetRect.x),
            y: Math.round(sheetRect.y),
            w: Math.round(sheetRect.width),
            h: Math.round(sheetRect.height),
            fixed: getComputedStyle(feed).position,
          }
        : null,
      footer: footerRect ? { top: Math.round(footerRect.top), h: Math.round(footerRect.height) } : null,
      main: mainRect ? { w: Math.round(mainRect.width), h: Math.round(mainRect.height) } : null,
      overlap,
    };
  });
}

async function sendChat(page, text) {
  // В DOM живут и скрытая колонка xl, и активный список — берём видимое поле.
  const input = page.locator('[aria-label="Сообщение в чат"]:visible').first();
  await input.fill(text);
  await input.press("Enter");
  await sleep(1300); // сервер режет частые реплики («Слишком часто»)
}

/** Геометрия панели реакций относительно кнопки и прокручиваемого списка. */
async function pickerGeometry(page) {
  return page.evaluate(() => {
    // В DOM бывают два списка (скрытая колонка xl и активная шторка) — всё
    // меряем строго внутри дерева открытой панели.
    const all = [...document.querySelectorAll('[aria-label="Реакции"]')];
    // Панель реакций в доке партии (game-app) тоже подписана «Реакции» —
    // берём только ту, что живёт в строке ленты (внутри li).
    const picker = all.find((el) => el.getClientRects().length > 0 && el.closest("li"));
    if (!picker) return { diag: `pickers=${all.length}` };
    const row = picker.closest("li");
    const btn = row?.querySelector('[aria-label="Поставить реакцию"]');
    const scroller = picker.closest('[role="log"]');
    if (!btn || !scroller)
      return { diag: `row=${Boolean(row)} btn=${Boolean(btn)} scroller=${Boolean(scroller)}` };
    const b = btn.getBoundingClientRect();
    const p = picker.getBoundingClientRect();
    const s = scroller.getBoundingClientRect();
    return {
      above: p.bottom <= b.top + 2,
      clipTop: p.top < s.top - 1,
      clipBottom: p.bottom > s.bottom + 1,
      clipRight: p.right > s.right + 1,
      pickerH: Math.round(p.height),
      gap: Math.round(b.top - p.bottom),
    };
  });
}

const browser = await chromium.launch();
const report = [];

// ── Док в игре: все ширины ──────────────────────────────────────────────────
for (const width of WIDTHS) {
  const { page } = await newRuPage(browser, { viewport: { width, height: HEIGHT } });
  await gotoUrl(page, `${BASE}/`);
  try {
    const code = await startNetGame(page, { name: "ЧатФикс", players: 2, bots: 1, log: () => {} });
    console.log(`[${width}] стол ${code} поднят`);
  } catch (e) {
    console.log(`[${width}] старт не удался: ${String(e).split("\n")[0]}`);
    await shot(page, `chatfix-${width}-startfail`);
    await page.context().close();
    continue;
  }
  await sleep(800);
  await safeClick(page.getByRole("button", { name: "Журнал и чат" }), 5000);
  await sleep(700);

  await sendChat(page, "Сообщение один: проверка планшета");
  await sendChat(page, "Второе, чуть длиннее, чтобы увидеть перенос строк и подложку автора");
  await sendChat(page, "Третья реплика тем же автором подряд");
  await sleep(500);

  const m = await metrics(page);
  const problems = [];
  if (m.hScroll) problems.push("горизонтальный скролл страницы");
  if (m.feed?.fixed === "fixed") problems.push("лента fixed вне потока");
  if (m.overlap && m.overlap.xOverlap > 0 && m.overlap.yOverlap > 40)
    problems.push(`лента перекрывает стол на ${m.overlap.xOverlap}x${m.overlap.yOverlap}px`);

  await shot(page, `chatfix-${width}-dock`);
  // Крупный план ленты: контраст времени и кнопки реакции на подложках.
  const sheet = page.locator("[data-feed-mobile]");
  if (await sheet.count()) {
    await sheet.screenshot({ path: `${SHOTS}/chatfix-${width}-feed-zoom.png` }).catch(() => {});
  }

  // Панель реакций: раскрывается НАД кнопкой последней реплики.
  await page.locator('[aria-label="Поставить реакцию"]:visible').last().click();
  await sleep(300);
  const pg = await pickerGeometry(page);
  if (!pg || pg.diag) problems.push(`панель реакций не открылась (${pg?.diag ?? "нет"})`);
  else {
    if (!pg.above) problems.push(`панель НЕ над кнопкой (gap=${pg.gap})`);
    if (pg.clipTop || pg.clipBottom || pg.clipRight)
      problems.push(`панель обрезана (top=${pg.clipTop} bottom=${pg.clipBottom} right=${pg.clipRight})`);
  }
  await shot(page, `chatfix-${width}-picker`);
  // Закрываем панель кликом мимо строки (Escape закрыл бы весь док).
  await page.mouse.click(10, Math.round(HEIGHT / 2));
  await sleep(250);

  // Кнопка реакции под наведением: цвет должен совпадать с тоном времени.
  const lastRow = page.locator('[data-feed-item="chat"]').last();
  await lastRow.hover().catch(() => {});
  await sleep(250);
  const logZoom = page.locator('[role="log"]:visible').first();
  await logZoom
    .screenshot({ path: `${SHOTS}/chatfix-${width}-hover-zoom.png` })
    .catch(() => {});
  await page.mouse.click(10, Math.round(HEIGHT / 2));
  await sleep(200);

  report.push({ width, m, pg, problems });
  console.log(`[${width}] ${JSON.stringify({ m, pg, problems })}`);
  await page.context().close();
}

// ── Панель (лобби → диалог чата) на 768 ─────────────────────────────────────
{
  const { page } = await newRuPage(browser, { viewport: { width: 768, height: HEIGHT } });
  await gotoUrl(page, `${BASE}/`);
  try {
    await openMenu(page);
    // Первый create после чужой партии может поймать «Нет связи» — сокет ещё
    // доезжает; повторяем с паузой.
    let created = { ok: false, error: "не пытались" };
    for (let i = 0; i < 3 && !created.ok; i++) {
      await sleep(1500);
      created = await createRoomViaStore(page, {
        name: "ЧатФиксЛобби",
        capacity: 4,
        botSeats: 0,
        difficulty: "normal",
        modules: {},
      });
    }
    if (!created.ok) throw new Error(`комната не создана: ${created.error}`);
    await waitUntil(async () => (await roomCode(page)) ?? false, 20_000, 300);
    console.log(`[panel-768] комната ${(await roomCode(page)) ?? "?"}`);
    await sleep(800);
    await safeClick(page.getByRole("button", { name: "Открыть чат стола" }), 5000);
    await sleep(700);
    await sendChat(page, "Проверка панели чата в лобби на планшете");
    await sleep(400);
    const panel = await page.evaluate(() => {
      const doc = document.documentElement;
      const panels = [...document.querySelectorAll("[data-feed-panel]")].filter(
        (el) => el.getClientRects().length > 0,
      );
      const el = panels.at(-1);
      return {
        count: panels.length,
        w: el ? Math.round(el.getBoundingClientRect().width) : null,
        hScroll: doc.scrollWidth > doc.clientWidth,
      };
    });
    console.log(`[panel-768] ${JSON.stringify(panel)}`);
    await shot(page, "chatfix-panel-768");

    // Флип у верхнего края: единственная реплика стоит у ВЕРХА списка —
    // места над ней нет, панель должна раскрыться ВНИЗ без обрезки.
    await page.locator('[aria-label="Поставить реакцию"]:visible').last().click();
    await sleep(300);
    const flip = await pickerGeometry(page);
    console.log(`[panel-768] flip: ${JSON.stringify(flip)}`);
    const dialogBox = await page
      .locator('[aria-label="Реакции"]')
      .filter({ has: page.locator("button") })
      .first()
      .boundingBox()
      .catch(() => null);
    if (dialogBox) {
      await page.screenshot({
        path: `${SHOTS}/chatfix-panel-768-flip.png`,
        clip: { x: 0, y: Math.max(0, dialogBox.y - 120), width: 768, height: 360 },
      }).catch(() => {});
    }
    await page.mouse.click(10, Math.round(HEIGHT / 2));
    await sleep(250);
  } catch (e) {
    console.log(`[panel-768] не удался: ${String(e).split("\n")[0]}`);
    await shot(page, "chatfix-panel-768-fail");
  }
  await page.context().close();
}

console.log("\n=== ИТОГ ===");
for (const r of report) {
  console.log(`${r.width}px: ${r.problems.length ? "ПРОБЛЕМЫ: " + r.problems.join("; ") : "ок"}`);
}
await browser.close();
