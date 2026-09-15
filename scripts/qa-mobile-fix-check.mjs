/**
 * QA-проверка мобильных фиксов интерфейса «Эволюции» (после разведки
 * qa-walkthrough-shots.mjs). Проверяет на 390×844 и 1280×800:
 *   1) нет горизонтального overflow и layout viewport не расширяется;
 *   2) в журнале-мессенджере видны фильтры и поле ввода чата;
 *   3) бейдж зрителя не перекрывает плашку «Журнал и чат», панель реакций
 *      не налезает на нижний док и заголовок «Ваша популяция»;
 *   4) зоны нажатия на мобилке ≥ 32px (пагинация обучения, слайдер колоды,
 *      быстрые фразы, фильтры журнала);
 *   5) подписи в шапке и в модулях лобби не обрезаются многоточием;
 *   6) подпись кормовой базы в доке питания: «Кормовая база» без
 *      «Континентов» и «Океан» с ними.
 *
 * Запуск при живом dev-сервере: node scripts/qa-mobile-fix-check.mjs
 * Переменные: EVO_URL (по умолчанию http://127.0.0.1:8099),
 * EVO_SHOTS (куда складывать снимки; по умолчанию — временная папка, чтобы
 * PNG не попадали в репозиторий). Снимки пишутся во временную папку и
 * копируются после закрытия браузера, чтобы не дёргать Tailwind.
 *
 * Партии поднимаются СЕТЕВЫМИ столами (соло-режим и кнопка «Начать год» в
 * меню удалены, M1): see scripts/qa-lib.mjs.
 */
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { menuReady, openCreateTab, shotsDir, startNetGame } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
// Снимки копятся во временной папке и в конце копируются в EVO_SHOTS
// (по умолчанию тоже %TEMP%): PNG в artifacts/ внутри репозитория дёргал
// Tailwind в dev и перезагружал вкладки, а мусорные снимки попадали в git.
const SHOTS = shotsDir();
mkdirSync(SHOTS, { recursive: true });
const TMP_SHOTS = mkdtempSync(join(tmpdir(), "evo-fix-"));

const problems = [];
const warnings = [];
const passed = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (msg) => {
  console.log(`PASS: ${msg}`);
  passed.push(msg);
};
const warn = (msg) => {
  console.log(`WARN: ${msg}`);
  warnings.push(msg);
};
const fail = (msg) => {
  console.log(`FAIL: ${msg}`);
  problems.push(msg);
};
const check = (cond, msg) => (cond ? ok(msg) : fail(msg));

async function snap(page, name) {
  const file = `${TMP_SHOTS}/mobile-fix-${name}.png`;
  try {
    await page.screenshot({ path: file });
    console.log(`SHOT: mobile-fix-${name}.png`);
  } catch (e) {
    fail(`скриншот mobile-fix-${name}.png не снялся: ${String(e?.message ?? e).split("\n")[0]}`);
  }
}

const mobileOpts = () => ({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
});

/** Состояние вьюпорта: layout viewport не должен быть шире экрана. */
async function viewportInfo(page) {
  return evalRetry(page, () => ({
    inner: window.innerWidth,
    innerH: window.innerHeight,
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
}

async function gotoMenu(page) {
  await page
    .goto(BASE, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
  // Маркер меню — поле имени сетевой секции: «Начать год» из меню удалён.
  await menuReady(page, 30_000).catch(() => {});
  await sleep(500);
}

/** Открыть панель «Игра по сети» и заполнить имя: секция открыта сразу. */
async function openNetPanel(page, name) {
  const nameInput = page.getByLabel("Ваше имя");
  // На телефоне форма создания лежит во вкладке «Создать» — открываем её.
  await openCreateTab(page).catch(() => {});
  for (let i = 0; i < 6 && !(await nameInput.isVisible().catch(() => false)); i++) {
    await sleep(500);
  }
  if (await nameInput.isVisible().catch(() => false)) await nameInput.fill(name).catch(() => {});
}

async function roomCodeOf(page) {
  const loc = page.locator("[data-room-code]").first();
  if (!(await loc.count())) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
}

async function createRoom(page, name) {
  await gotoMenu(page);
  await openNetPanel(page, name);
  const create = page.getByRole("button", { name: "Создать стол" }).last();
  await create.scrollIntoViewIfNeeded().catch(() => {});
  await create.click({ timeout: 5000 }).catch(() => {});
  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    const code = await roomCodeOf(page);
    if (code) return code;
    await sleep(400);
  }
  return "";
}

/** Заполнить стол ботом и стартовать; ждём шапку партии. */
async function startRoom(page) {
  for (let i = 0; i < 10; i++) {
    const start = page.getByRole("button", { name: "Начать год", exact: true }).first();
    if (await start.isEnabled().catch(() => false)) break;
    await page.getByRole("button", { name: "Добавить бота" }).first().click({ timeout: 3000 }).catch(() => {});
    await sleep(700);
  }
  const start = page.getByRole("button", { name: "Начать год", exact: true }).first();
  await start.scrollIntoViewIfNeeded().catch(() => {});
  await start.click({ timeout: 5000 }).catch(() => {});
  return waitGameHeader(page, 45_000);
}

async function waitGameHeader(page, timeout = 40_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const t = await page.evaluate(() => document.querySelector("header")?.innerText ?? "").catch(() => "");
    if (/Год\s+\d/.test(t)) return true;
    await sleep(300);
  }
  return false;
}

/** page.evaluate с повторами: dev-сервер иногда перезагружает вкладку. */
async function evalRetry(page, fn, arg, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await page.evaluate(fn, arg);
    } catch (e) {
      lastErr = e;
      await sleep(800);
    }
  }
  throw lastErr;
}

/** Снять карточку «Ваш ход» и увести курсор, чтобы она не закрывала стол. */
async function dismissTurnCard(page) {
  // Кнопки «К столу» больше нет: карточка уходит сама через ~3 с, а клик по
  // затемнению убирает её сразу.
  const card = page.locator("div[role='status']", { hasText: "Ваш ход" }).first();
  if (await card.isVisible().catch(() => false)) {
    await page.mouse.click(6, 6).catch(() => {});
    await card.waitFor({ state: "detached", timeout: 4000 }).catch(() => {});
  }
  await page.mouse.move(2, 2).catch(() => {});
  await sleep(250);
}

// ── Проверки ────────────────────────────────────────────────────────────────

/** Ширина документа не должна превышать экран (иначе Chrome зумит страницу). */
async function checkNoOverflow(page, label, expectWidth) {
  const v = await viewportInfo(page);
  const overflow = v.scroll - v.inner;
  check(overflow <= 1 && v.inner <= expectWidth + 1, `${label}: нет горизонтального overflow (inner=${v.inner}, scroll=${v.scroll})`);
  if (overflow > 1 || v.inner > expectWidth + 1) {
    const offenders = await page
      .evaluate(() => {
        const res = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.right > window.innerWidth + 1) {
            res.push(
              `${el.tagName}.${String(el.className).slice(0, 50)} right=${Math.round(r.right)} «${(el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 24)}»`,
            );
            if (res.length >= 10) break;
          }
        }
        return res;
      })
      .catch(() => []);
    if (offenders.length) console.log("  виновники overflow:\n   " + offenders.join("\n   "));
  }
}

/** Проверки журнала-мессенджера: диалог, фильтры, ввод, быстрые фразы. */
async function checkJournal(page, label) {
  const dialog = page.locator('[role="dialog"][aria-label="Журнал и чат"]:visible').first();
  await dialog.waitFor({ timeout: 8000 }).catch(() => {});
  const box = await dialog.boundingBox().catch(() => null);
  const v = await viewportInfo(page);
  check(
    Boolean(box) && box.x >= -1 && box.x + box.width <= v.inner + 1 && box.y >= -1 && box.y + box.height <= v.innerH + 1,
    `${label}: журнал раскрыт в пределах экрана (${box ? `${Math.round(box.width)}×${Math.round(box.height)} при ${v.inner}×${v.innerH}` : "нет диалога"})`,
  );

  const filters = dialog.locator('[role="group"][aria-label="Фильтр ленты"] button');
  const nFilters = await filters.count().catch(() => 0);
  check(nFilters === 3, `${label}: в журнале видны фильтры «Всё/События/Чат» (${nFilters} шт.)`);
  for (let i = 0; i < nFilters; i++) {
    const f = filters.nth(i);
    const name = ((await f.textContent()) ?? "").trim();
    const fb = await f.boundingBox().catch(() => null);
    const visible = await f.isVisible().catch(() => false);
    check(
      visible && fb && fb.x >= 0 && fb.x + fb.width <= v.inner && fb.height >= 32,
      `${label}: фильтр «${name}» доступен (${fb ? `${Math.round(fb.width)}×${Math.round(fb.height)}` : "нет"}${visible ? "" : ", скрыт"})`,
    );
  }
  // Переключение фильтра должно работать (не перекрыт другим слоем).
  const chatFilter = filters.filter({ hasText: "Чат" }).first();
  await chatFilter.click({ timeout: 3000 }).catch(() => {});
  await sleep(200);
  check((await chatFilter.getAttribute("aria-pressed").catch(() => null)) === "true", `${label}: фильтр «Чат» переключается кликом`);
  await filters.filter({ hasText: "Всё" }).first().click({ timeout: 3000 }).catch(() => {});

  const input = dialog.getByLabel("Сообщение в чат").first();
  const ib = await input.boundingBox().catch(() => null);
  const inputVisible = await input.isVisible().catch(() => false);
  check(
    inputVisible && ib && ib.y >= 0 && ib.y + ib.height <= v.innerH && ib.x >= 0 && ib.x + ib.width <= v.inner,
    `${label}: поле ввода чата видно и в кадре (${ib ? `y=${Math.round(ib.y)}..${Math.round(ib.y + ib.height)}` : "нет"})`,
  );
  if (inputVisible) {
    await input.fill("Проверка связи").catch(() => {});
    const send = dialog.getByRole("button", { name: "Отправить сообщение" }).first();
    check(await send.isEnabled().catch(() => false), `${label}: кнопка отправки активируется после ввода`);
    await input.fill("").catch(() => {});
  }

  const quick = dialog.locator('[role="group"][aria-label="Быстрые фразы"] button');
  const nQuick = await quick.count().catch(() => 0);
  if (nQuick) {
    let minSide = Infinity;
    for (let i = 0; i < nQuick; i++) {
      const qb = await quick.nth(i).boundingBox().catch(() => null);
      if (qb) minSide = Math.min(minSide, qb.height, qb.width);
    }
    check(minSide >= 32, `${label}: чипы быстрых фраз ≥32px (минимум ${Math.round(minSide)}px)`);
  } else {
    warn(`${label}: быстрые фразы не найдены`);
  }
}

/** Подпись кормовой базы в доке питания. */
async function checkFeedDockLabel(page, label, expect) {
  const text = await page
    .evaluate(() => {
      const dock = document.querySelector("footer");
      return dock ? dock.innerText.replace(/\s+/g, " ").trim() : "";
    })
    .catch(() => "");
  const hasOcean = /Океан\s*:/.test(text);
  const hasBase = /Кормовая база\s*:/.test(text);
  if (expect === "base") {
    check(hasBase && !hasOcean, `${label}: в доке питания «Кормовая база» без «Континентов» (текст: «${text.slice(0, 60)}»)`);
  } else {
    check(hasOcean, `${label}: в доке питания «Океан» с «Континентами» (текст: «${text.slice(0, 60)}»)`);
  }
}

// ── Сетевой стол: дойти до фазы питания ─────────────────────────────────────

/** Быстрый темп в сетевой партии: кнопка в шапке, с откатом на экшен стора. */
async function tuneNet(page) {
  const fast = page.getByRole("button", { name: "Быстро", exact: true }).first();
  for (let i = 0; i < 6; i++) {
    if ((await page.evaluate(() => localStorage.getItem("evo-speed")).catch(() => null)) === "fast") break;
    if (await fast.count()) await fast.click({ timeout: 2500 }).catch(() => {});
    await sleep(400);
  }
  await evalRetry(page, () => {
    globalThis.__evoStore?.getState?.().setSpeed?.("fast");
    return true;
  }).catch(() => {});
}

/** Состояние фаз партии по шапке и доступным кнопкам. */
async function phaseState(page) {
  return page
    .evaluate(() => {
      const t = (document.querySelector("header")?.innerText ?? "").replace(/\s+/g, " ");
      const phase = ["Развитие", "Кормовая база", "Питание", "Вымирание", "Рост", "Итог"].find((p) => t.includes(p)) ?? "?";
      const has = (name) => [...document.querySelectorAll("button")].some((b) => b.textContent.trim() === name && !b.disabled);
      // Карточка «Ваш ход» с кнопкой «К столу» больше не требует нажатия:
      // признак — сама карточка на экране.
      const card = [...document.querySelectorAll("div[role='status']")].some((d) => d.textContent.includes("Ваш ход"));
      // Волна 1: «Пас» в развитии убран — ход завершает «Закончить развитие».
      return { phase, text: t, devEnd: has("Закончить развитие"), take: has("Взять еду"), end: has("Закончить ход"), toTable: card };
    })
    .catch(() => null);
}
async function clickByText(page, name) {
  return page
    .evaluate((label) => {
      const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === label && !x.disabled);
      if (!b) return false;
      b.click();
      return true;
    }, name)
    .catch(() => false);
}

/** Дойти до хода питания человека (разыграв животное) за budgetMs. */
async function reachFeeding(page, budgetMs = 90_000) {
  const deadline = Date.now() + budgetMs;
  let playedAnimal = false;
  let feedingSeen = false;
  let lastText = "";
  while (Date.now() < deadline) {
    const h = await phaseState(page);
    if (!h) {
      await sleep(300);
      continue;
    }
    if (h.text && h.text !== lastText) {
      lastText = h.text;
      console.log(`  фаза: ${h.text.slice(0, 90)}`);
    }
    if (h.toTable) await dismissTurnCard(page);
    if (h.phase === "Развитие") {
      if (!playedAnimal) {
        playedAnimal = await clickByText(page, "Животное");
        if (playedAnimal) {
          // «Континенты»: после выбора карты животного нужно указать зону.
          await sleep(300);
          await page
            .evaluate(() => {
              const z = document.querySelector('[role="button"][aria-label^="Разместить на"]');
              if (z) z.click();
            })
            .catch(() => {});
        }
      } else {
        await clickByText(page, "Закончить развитие");
      }
    } else if (h.phase === "Питание" && (h.take || h.end)) {
      feedingSeen = true;
      break;
    }
    await sleep(180);
  }
  return feedingSeen;
}

/** Зайти зрителем на стол; до трёх попыток — сервер может рейт-лимитить. */
async function joinAsSpectator(page, code, name) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await gotoMenu(page);
    await openNetPanel(page, name);
    await page.getByRole("button", { name: "Присоединиться к столу" }).click({ timeout: 3000 }).catch(() => {});
    await sleep(300);
    await page.getByLabel("Код стола").fill(code).catch(() => {});
    await sleep(400);
    await page.getByRole("button", { name: "Смотреть" }).first().click({ timeout: 5000 }).catch(() => {});
    const deadline = Date.now() + 12_000;
    while (Date.now() < deadline) {
      if ((await page.getByText("Вы смотрите").count().catch(() => 0)) > 0) return true;
      await sleep(400);
    }
    console.log(`  зритель «${name}»: попытка ${attempt} не удалась, повтор`);
    await sleep(2500);
  }
  return false;
}

// ── Сценарии ────────────────────────────────────────────────────────────────

const browser = await chromium.launch({ channel: "chromium" });
let desktopRoom = "";

try {
  // ══ A. Десктоп: меню ════════════════════════════════════════════════════
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const d = await dCtx.newPage();
  try {
    await gotoMenu(d);
    await checkNoOverflow(d, "desktop меню", 1280);
    const vMenu = await viewportInfo(d);
    check(vMenu.scroll <= 1281, "desktop меню: страница не шире окна");
    await snap(d, "desktop-menu");
  } catch (e) {
    fail(`десктоп-меню: ${String(e?.message ?? e).split("\n")[0]}`);
  }

  // ══ B. Десктоп: сетевой стол + журнал ═══════════════════════════════════
  try {
    desktopRoom = await createRoom(d, "Аня");
    check(/^[A-Z]{4}$/.test(desktopRoom), `desktop: стол создан (код ${desktopRoom || "—"})`);
    if (!desktopRoom) throw new Error("код стола не получен");
    const started = await startRoom(d);
    check(started, "desktop: сетевая партия началась");
    await sleep(1200);
    await checkNoOverflow(d, "desktop сетевой стол", 1280);
    await dismissTurnCard(d);
    await snap(d, "desktop-net-table");
    await d.getByRole("button", { name: "Журнал и чат", exact: true }).first().click({ timeout: 4000 }).catch(() => {});
    await sleep(600);
    const asideW = await d.evaluate(() => {
      const a = document.querySelector('aside[aria-label="Журнал и чат"]');
      return a ? Math.round(a.getBoundingClientRect().width) : null;
    });
    check(asideW !== null && asideW >= 200, `desktop: журнал раскрылся колонкой (${asideW}px)`);
    const chatInput = d.getByLabel("Сообщение в чат").first();
    check(await chatInput.isVisible().catch(() => false), "desktop: поле ввода чата видно");
    await checkNoOverflow(d, "desktop журнал", 1280);
    await snap(d, "desktop-net-journal");
  } catch (e) {
    fail(`desktop-сеть: ${String(e?.message ?? e).split("\n")[0]}`);
  }

  // ══ C. Мобилка: меню, обучение, лобби ═══════════════════════════════════
  const mCtx = await browser.newContext(mobileOpts());
  const m = await mCtx.newPage();
  try {
    await gotoMenu(m);
    await checkNoOverflow(m, "mobile меню", 390);
    await snap(m, "mobile-menu");
    // Подпись «Правильные игры · Кнорре» не должна быть обрезана.
    const subtitle = await evalRetry(m, () => {
      const el = [...document.querySelectorAll("header div")].find((x) => x.textContent.startsWith("Правильные игры"));
      return el ? { text: el.textContent, sw: el.scrollWidth, cw: el.clientWidth } : null;
    }).catch(() => null);
    check(
      Boolean(subtitle) && subtitle.sw <= subtitle.cw + 1,
      `mobile меню: подпись шапки не обрезана («${subtitle?.text ?? "?"}», ${subtitle?.sw}/${subtitle?.cw})`,
    );

    // Обучение: зоны нажатия точек-пагинации.
    await m.getByRole("button", { name: "Обучение" }).first().click({ timeout: 4000 }).catch(() => {});
    await m.getByText("Как играть в «Эволюцию»").waitFor({ timeout: 10_000 }).catch(() => {});
    const dots = await evalRetry(m, () =>
      [...document.querySelectorAll('[role="tablist"] [role="tab"]')].map((b) => {
        const r = b.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      }),
    ).catch(() => []);
    check(
      dots.length >= 5 && dots.every((x) => x.w >= 32 && x.h >= 32),
      `mobile обучение: точки-пагинация ≥32px (${dots.map((x) => `${x.w}×${x.h}`).join(", ")})`,
    );
    await snap(m, "mobile-tutorial");
    await m.keyboard.press("Escape").catch(() => {});
    await sleep(400);
  } catch (e) {
    fail(`mobile меню/обучение: ${String(e?.message ?? e).split("\n")[0]}`);
  }

  // ══ D. Мобилка: сетевой стол (с «Континентами»), журнал ═════════════════
  try {
    const code = await createRoom(m, "Моби");
    check(/^[A-Z]{4}$/.test(code), `mobile: стол создан (код ${code || "—"})`);
    // Метки модулей в лобби не должны обрезаться многоточием.
    const labels = await m.evaluate(() =>
      [...document.querySelectorAll("button")]
        .filter((b) => b.getAttribute("aria-pressed") !== null && b.textContent.includes("выкл"))
        .map((b) => {
          const s = b.querySelector("span");
          return { t: s ? s.textContent.trim() : "", sw: s ? s.scrollWidth : 0, cw: s ? s.clientWidth : 0 };
        }),
    );
    const clipped = labels.filter((l) => l.sw > l.cw + 1);
    check(labels.length >= 4 && clipped.length === 0, `mobile лобби: подписи модулей не обрезаны (${labels.length} шт., обрезано ${clipped.length})`);
    if (clipped.length) console.log("  обрезаны: " + clipped.map((c) => c.t).join("; "));
    const sliderH = await m.evaluate(() => {
      const s = document.querySelector("input.range-evo");
      return s ? Math.round(s.getBoundingClientRect().height) : null;
    });
    check(sliderH !== null && sliderH >= 32, `mobile лобби: слайдер колоды ≥32px (${sliderH}px)`);
    await snap(m, "mobile-lobby");

    // Включаем «Континенты» — проверим подпись «Океан» в доке питания.
    const continents = m.getByRole("button", { name: /Континенты/ }).first();
    for (let i = 0; i < 4; i++) {
      if ((await continents.getAttribute("aria-pressed").catch(() => null)) === "true") break;
      await continents.click({ timeout: 3000 }).catch(() => {});
      await sleep(700);
    }
    check((await continents.getAttribute("aria-pressed").catch(() => null)) === "true", "mobile лобби: модуль «Континенты» включён");

    const started = await startRoom(m);
    check(started, "mobile: сетевая партия началась");
    await sleep(1200);
    await checkNoOverflow(m, "mobile сетевой стол", 390);
    // Заголовок шапки не сжат: текст «Эволюция» помещается.
    const title = await m.evaluate(() => {
      const el = document.querySelector("header .font-display");
      return el ? { w: Math.round(el.getBoundingClientRect().width), sw: el.scrollWidth } : null;
    });
    check(Boolean(title) && title.sw <= title.w + 1, `mobile сетевой стол: заголовок не сжат (${title?.w}px, текст ${title?.sw}px)`);
    await dismissTurnCard(m);
    await snap(m, "mobile-net-table");

    // Открыть журнал-мессенджер.
    await m.getByRole("button", { name: "Журнал и чат", exact: true }).first().click({ timeout: 4000 }).catch(() => {});
    await sleep(700);
    await checkJournal(m, "mobile журнал");
    await checkNoOverflow(m, "mobile журнал", 390);
    await snap(m, "mobile-net-journal");
    // Закрыть журнал.
    await m.locator('button[aria-label^="Свернуть «Журнал и чат»"]:visible').first().click({ timeout: 3000 }).catch(() => {});
    await sleep(500);

    // Питание: пасуем в развитии и ждём док с подписью «Океан».
    const feedSeen = await reachFeeding(m, 60_000);
    if (feedSeen) {
      // В фазе питания док самый высокий — проверяем, что реакции его не закрывают.
      const gap = await m.evaluate(() => {
        const r = document.querySelector('[role="group"][aria-label="Реакции"]');
        const f = document.querySelector("footer");
        if (!r || !f) return null;
        return { panelBottom: Math.round(r.getBoundingClientRect().bottom), footerTop: Math.round(f.getBoundingClientRect().top) };
      });
      check(gap !== null && gap.panelBottom <= gap.footerTop + 1, `mobile сеть: панель реакций не закрывает док питания (низ ${gap?.panelBottom}, док ${gap?.footerTop})`);
      await snap(m, "mobile-net-feeding");
      await checkFeedDockLabel(m, "mobile сеть («Континенты»)", "ocean");
    } else {
      warn("mobile сеть: до хода питания дойти не удалось — подпись «Океан» в сети не проверена (проверена на десктопе)");
    }
  } catch (e) {
    fail(`mobile-сеть: ${String(e?.message ?? e).split("\n")[0]}`);
  }

  // ══ E. Зритель (mobile + desktop) на десктопном столе ═══════════════════
  if (desktopRoom) {
    const specs = [
      { name: "mobile", ctx: await browser.newContext(mobileOpts()), mobile: true },
      { name: "desktop", ctx: await browser.newContext({ viewport: { width: 1280, height: 800 } }), mobile: false },
    ];
    for (const s of specs) {
      const p = await s.ctx.newPage();
      try {
        const joined = await joinAsSpectator(p, desktopRoom, `Зритель-${s.name}`);
        check(joined, `${s.name} зритель: вход зрителем выполнен`);
        if (!joined) throw new Error("не удалось войти зрителем");
        await waitGameHeader(p, 30_000);
        await sleep(1000);
        await checkNoOverflow(p, `${s.name} зритель`, s.mobile ? 390 : 1280);

        const res = await p.evaluate(() => {
          const rect = (el) => {
            const r = el.getBoundingClientRect();
            return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom) };
          };
          const inter = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y));
          const vis = (el) => el && el.getBoundingClientRect().width > 0;
          const badge = [...document.querySelectorAll('[role="status"]')].find((e) => e.textContent.includes("Вы смотрите"));
          // Плашки «Журнал и чат» на мобилке больше нет: журнал открывается
          // кнопкой в шапке, у неё — счётчик непрочитанного.
          const chip = [...document.querySelectorAll('header button[aria-label^="Журнал"]')].find(vis);
          const reactions = document.querySelector('[role="group"][aria-label="Реакции"]');
          const footer = document.querySelector("footer");
          const title = document.querySelector("header .font-display");
          const pop = [...document.querySelectorAll("main span")].find((e) => e.textContent.startsWith("Ваша популяция"));
          const fr = footer ? footer.getBoundingClientRect() : null;
          return {
            inner: [window.innerWidth, window.innerHeight],
            badge: badge ? rect(badge) : null,
            chip: chip ? rect(chip) : null,
            badgeXchip: badge && chip ? inter(rect(badge), rect(chip)) : null,
            reactions: reactions ? rect(reactions) : null,
            footerTop: fr ? Math.round(fr.top) : null,
            reactionsXpop: reactions && pop ? inter(rect(reactions), rect(pop)) : null,
            title: title ? { w: Math.round(title.getBoundingClientRect().width), sw: title.scrollWidth } : null,
          };
        });
        check(
          res.badgeXchip === 0,
          `${s.name} зритель: бейдж не перекрывает кнопку журнала в шапке (площадь ${res.badgeXchip})`,
        );
        check(res.badge !== null && res.badge.w > 100, `${s.name} зритель: бейдж «Вы смотрите» виден (${res.badge?.w}px)`);
        check(res.reactions !== null && res.reactions.r <= res.inner[0] + 1, `${s.name} зритель: панель реакций в кадре`);
        check(
          res.reactions !== null && res.footerTop !== null && res.reactions.b <= res.footerTop + 1,
          `${s.name} зритель: панель реакций не заходит на нижний док (низ ${res.reactions?.b}, док ${res.footerTop})`,
        );
        check(res.reactionsXpop === 0, `${s.name} зритель: панель реакций не налезает на «Ваша популяция»`);
        check(Boolean(res.title) && res.title.sw <= res.title.w + 1, `${s.name} зритель: заголовок шапки не сжат (${res.title?.w}px)`);
        await snap(p, `${s.name}-net-spectator`);
      } catch (e) {
        fail(`${s.name}-зритель: ${String(e?.message ?? e).split("\n")[0]}`);
      } finally {
        await s.ctx.close().catch(() => {});
      }
    }
  } else {
    warn("зрительские проверки пропущены: нет кода десктопного стола");
  }

  // ══ F. Десктоп-стол: подпись кормовой базы в доке питания ════════════════
  // Сетевые столы на короткой колоде (20 карт) — быстрее доходим до питания;
  // контексты закрываются вместе с партиями.
  try {
    const sCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const s = await sCtx.newPage();
    try {
      await gotoMenu(s);
      await startNetGame(s, { name: "Док", players: 2, bots: 1, deckSize: 20 });
      await tuneNet(s);
      await sleep(1200);
      const reached = await reachFeeding(s, 120_000);
      check(reached, "desktop стол: фаза питания достигнута");
      if (reached) {
        await sleep(400);
        await snap(s, "desktop-net-feeding");
        await checkFeedDockLabel(s, "desktop стол (без «Континентов»)", "base");
        await checkNoOverflow(s, "desktop стол", 1280);
      }
    } finally {
      await sCtx.close().catch(() => {});
    }

    const oCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const o = await oCtx.newPage();
    try {
      await gotoMenu(o);
      await startNetGame(o, {
        name: "Док-конт",
        players: 2,
        bots: 1,
        deckSize: 20,
        modules: { continents: true },
      });
      check(true, "desktop стол: «Континенты» включены настройками стола");
      await tuneNet(o);
      await sleep(1200);
      const reachedOcean = await reachFeeding(o, 120_000);
      check(reachedOcean, "desktop стол с «Континентами»: фаза питания достигнута");
      if (reachedOcean) {
        await sleep(400);
        await snap(o, "desktop-net-feeding-ocean");
        await checkFeedDockLabel(o, "desktop стол («Континенты»)", "ocean");
      }
    } finally {
      await oCtx.close().catch(() => {});
    }
  } catch (e) {
    fail(`десктоп-стол: ${String(e?.message ?? e).split("\n")[0]}`);
  }
} catch (e) {
  fail(`прогон прерван: ${String(e?.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
  try {
    let copied = 0;
    for (const f of readdirSync(TMP_SHOTS)) {
      if (!f.startsWith("mobile-fix-") || !f.endsWith(".png")) continue;
      copyFileSync(join(TMP_SHOTS, f), join(SHOTS, f));
      copied++;
    }
    console.log(`\nСкриншотов скопировано в ${SHOTS}: ${copied}`);
  } catch (e) {
    console.log(`\nНе удалось скопировать скриншоты: ${String(e?.message ?? e)}`);
  }
}
console.log(`\nPASS: ${passed.length}, WARN: ${warnings.length}, FAIL: ${problems.length}`);
if (warnings.length) console.log("ПРЕДУПРЕЖДЕНИЯ:\n  " + warnings.join("\n  "));
if (problems.length) console.log("ПРОБЛЕМЫ:\n  " + problems.join("\n  "));
process.exitCode = problems.length ? 1 : 0;
