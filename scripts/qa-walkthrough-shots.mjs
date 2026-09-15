/**
 * QA-обход интерфейса «Эволюции»: скриншоты ключевых экранов на десктопе
 * (1280×800) и мобилке (390×844, touch, deviceScaleFactor 2) плюс
 * программные проверки по ходу: горизонтальный overflow, мелкие элементы
 * (< 32 px по меньшей стороне) на мобилке, перекрытые кнопки, обрезанный
 * текст, зависшие состояния загрузки. Скриншоты — в папку EVO_SHOTS
 * (по умолчанию %TEMP%/evo-qa-shots, вне репозитория) с именами
 * walk-desktop-*.png / walk-mobile-*.png.
 *
 * Запуск при живом dev-сервере: node scripts/qa-walkthrough-shots.mjs
 * Переменные: EVO_URL (по умолчанию http://127.0.0.1:8099),
 * EVO_SOLO_BUDGET_MS — бюджет партии на один вьюпорт (по умолчанию 300000).
 *
 * Партии поднимаются СЕТЕВЫМИ столами (соло-режим и кнопка «Начать год» в
 * меню удалены, M1): see scripts/qa-lib.mjs.
 */
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { menuReady, phaseOf, shotsDir, startNetGame } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
// Куда копировать снимки в конце. По умолчанию — временная папка вне
// репозитория: PNG в artifacts/ дёргал Tailwind в dev и шлёт program reload
// всем вкладкам (партия выбрасывалась в меню), плюс мусор попадал в git.
const SHOTS = shotsDir();
mkdirSync(SHOTS, { recursive: true });
// Пишем снимки во временную папку: Tailwind в dev сканирует проект и на каждый
// новый PNG в artifacts/ перегенерирует CSS → Vite шлёт program reload всем
// вкладкам, и партия выбрасывается в меню. В EVO_SHOTS копируем в самом конце,
// когда браузер уже закрыт.
const TMP_SHOTS = mkdtempSync(join(tmpdir(), "evo-walk-"));
const SOLO_BUDGET_MS = Number(process.env.EVO_SOLO_BUDGET_MS ?? 300_000);

const problems = [];
const warnings = [];
const consoleErrors = [];
const START_TS = Date.now();
const rel = () => `${Math.round((Date.now() - START_TS) / 1000)}с`;
const ok = (msg) => console.log(`OK: [${rel()}] ${msg}`);
const warn = (msg) => {
  console.log(`WARN: [${rel()}] ${msg}`);
  warnings.push(msg);
};
const fail = (msg) => {
  console.log(`FAIL: [${rel()}] ${msg}`);
  problems.push(msg);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isVisible = (loc) => loc.isVisible().catch(() => false);
// isEnabled у Playwright ждёт появления элемента до 30 с: для кнопок, которых
// сейчас нет на экране (например, «Не защищаться» вне атаки), это съедало
// полминуты на каждую проверку. Сначала дешёвый count(), потом сама проверка.
const isEnabled = async (loc) => {
  if ((await loc.count().catch(() => 0)) === 0) return false;
  return loc.first().isEnabled({ timeout: 1500 }).catch(() => false);
};
async function safeClick(loc, timeout = 3000) {
  try {
    await loc.click({ timeout });
    return true;
  } catch {
    return false;
  }
}

/** Шум dev-сервера и сторонних расширений не считаем ошибками приложения. */
const IGNORE_CONSOLE =
  /favicon|React DevTools|WebSocket connection|net::ERR_ABORTED|\[vite\]|vite\/client|grok\.com|Download the React DevTools|ResizeObserver loop|HMR|hot-update/i;

function track(page, label) {
  page.__navs = 0;
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) page.__navs += 1;
  });
  page.on("pageerror", (e) => consoleErrors.push(`[${label}] pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (IGNORE_CONSOLE.test(t)) return;
    consoleErrors.push(`[${label}] console.error: ${t.slice(0, 300)}`);
  });
}

// ── Аудит DOM на каждом снимке ──────────────────────────────────────────────

/**
 * Собирает проблемы на текущем экране: overflow, мелкие интерактивные
 * элементы (мобилка), перекрытые элементы (elementFromPoint в центре),
 * обрезанный текст у листовых элементов с overflow: hidden.
 */
async function audit(page, mobile, shotName) {
  const res = await page
    .evaluate((mobileFlag) => {
      const out = {
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        small: [],
        covered: [],
        clipped: [],
      };
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim().slice(0, 48);
      const labelOf = (el) =>
        norm(el.getAttribute("aria-label")) ||
        norm(el.getAttribute("title")) ||
        norm(el.textContent) ||
        el.tagName.toLowerCase();
      const els = document.querySelectorAll(
        'button, a[href], input, select, textarea, [role="button"], [role="tab"], [role="switch"], [role="radio"]',
      );
      /** Крупный fixed-слой (модалка, полноэкранный лист): перекрытие им —
       * штатное поведение оверлея, а не проблема раскладки. */
      const isModalOverlay = (node) => {
        let cur = node;
        for (let i = 0; cur && i < 12; i++, cur = cur.parentElement) {
          const s = getComputedStyle(cur);
          if (s.position !== "fixed") continue;
          const rr = cur.getBoundingClientRect();
          if (rr.width >= vw * 0.8 && rr.height >= vh * 0.8) return true;
        }
        return false;
      };
      const seenSmall = new Set();
      const seenCovered = new Set();
      const seenClipped = new Set();
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const st = getComputedStyle(el);
        if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) < 0.05) continue;
        const label = labelOf(el);
        if (mobileFlag) {
          const min = Math.min(r.width, r.height);
          if (min < 32) {
            const key = `${label}|${Math.round(r.width)}x${Math.round(r.height)}`;
            if (!seenSmall.has(key)) {
              seenSmall.add(key);
              out.small.push({ label, w: Math.round(r.width), h: Math.round(r.height) });
            }
          }
        }
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        if (cx >= 0 && cx < vw && cy >= 0 && cy < vh) {
          const top = document.elementFromPoint(cx, cy);
          if (top && !el.contains(top) && !top.contains(el) && !isModalOverlay(top)) {
            const desc = `${label} ← ${top.tagName.toLowerCase()}.${String(top.className ?? "").slice(0, 50)}`;
            if (!seenCovered.has(desc)) {
              seenCovered.add(desc);
              if (out.covered.length < 15) out.covered.push(desc);
            }
          }
        }
        if (!el.childElementCount) {
          const text = norm(el.textContent) || norm(el.getAttribute("placeholder"));
          if (
            text &&
            (st.overflow === "hidden" || st.overflowX === "hidden") &&
            el.scrollWidth > el.clientWidth + 2
          ) {
            const desc = `${text} (${el.scrollWidth}>${el.clientWidth})`;
            if (!seenClipped.has(desc)) {
              seenClipped.add(desc);
              if (out.clipped.length < 10) out.clipped.push(desc);
            }
          }
        }
      }
      out.small = out.small.slice(0, 14);
      return out;
    }, mobile)
    .catch(() => null);
  if (!res) {
    warn(`${shotName}: DOM-аудит не удался (страница перезагрузилась?)`);
    return;
  }
  if (res.overflowX > 1) fail(`[overflow] ${shotName}: горизонтальный скролл ${res.overflowX}px`);
  if (res.covered.length) {
    warn(`[covered] ${shotName}: перекрытые элементы: ${res.covered.join("; ")}`);
  }
  if (res.clipped.length) {
    warn(`[clipped] ${shotName}: обрезанный текст: ${res.clipped.join("; ")}`);
  }
  if (mobile && res.small.length) {
    const list = res.small.map((s) => `${s.label} ${s.w}×${s.h}`).join("; ");
    warn(`[small] ${shotName}: мелкие (<32px) элементы: ${list}`);
  }
}

let shotCount = 0;
async function snap(page, vp, name, mobile, note = "") {
  const file = `${TMP_SHOTS}/walk-${vp}-${name}.png`;
  try {
    await page.screenshot({ path: file });
    shotCount++;
    console.log(`SHOT: walk-${vp}-${name}.png${note ? ` — ${note}` : ""}`);
  } catch (e) {
    fail(`скриншот walk-${vp}-${name}.png не снялся: ${String(e.message ?? e).split("\n")[0]}`);
  }
  await audit(page, mobile, `walk-${vp}-${name}`);
}

// ── Навигация и состояние ───────────────────────────────────────────────────

async function gotoMenu(page) {
  await page
    .goto(BASE, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
  // Маркер меню — поле имени сетевой секции: «Начать год» из меню удалён (M1).
  await menuReady(page, 30_000).catch(() => {});
  await sleep(500);
}

async function headerInfo(page) {
  const text = await page.locator("header").first().innerText().catch(() => "");
  const year = Number((text.match(/Год\s+(\d+)/) ?? [])[1] ?? NaN);
  const phase =
    ["Развитие", "Кормовая база", "Питание", "Вымирание", "Рост", "Итог"].find((p) =>
      text.includes(p),
    ) ?? "?";
  return { text: text.replace(/\s+/g, " "), year, phase };
}

/** Ждёт любую фазу партии в шапке («Год N · …»). */
async function waitGameHeader(page, timeout = 40_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const h = await headerInfo(page);
    if (Number.isFinite(h.year)) return true;
    await sleep(300);
  }
  return false;
}

/** Ждёт фазу в шапке; параллельно ловит зависшее «Загружаем партию…». */
async function waitPhase(page, phase, timeout = 30_000) {
  const t0 = Date.now();
  let loadingSince = null;
  while (Date.now() - t0 < timeout) {
    const h = await headerInfo(page);
    if (h.phase === phase) return true;
    const body = await page.evaluate(() => document.body.innerText ?? "").catch(() => "");
    if (/Загружаем партию|Открываем стол|Открываем финальный стол/.test(body)) {
      if (!loadingSince) loadingSince = Date.now();
      else if (Date.now() - loadingSince > 15_000) {
        fail(`зависло состояние загрузки > 15 с (искали фазу «${phase}»)`);
        return false;
      }
    } else {
      loadingSince = null;
    }
    await sleep(200);
  }
  return false;
}

// ── Меню: обучение, правила, статистика ────────────────────────────────────

async function walkMenu(page, vp, mobile) {
  await gotoMenu(page);
  await snap(page, vp, "menu", mobile, "главное меню");

  // Обучение: первый / средний / последний слайд.
  await safeClick(page.getByRole("button", { name: "Обучение" }).first(), 4000);
  await page.getByText("Как играть в «Эволюцию»").waitFor({ timeout: 10_000 });
  await snap(page, vp, "tutorial-1", mobile, "обучение, слайд 1");
  await safeClick(page.getByRole("button", { name: "Далее" }).first(), 3000);
  await sleep(300);
  await safeClick(page.getByRole("button", { name: "Далее" }).first(), 3000);
  await sleep(300);
  await snap(page, vp, "tutorial-3", mobile, "обучение, слайд 3");
  await page.getByRole("tab", { name: /Слайд 5/ }).click({ timeout: 3000 }).catch(() => {});
  await sleep(400);
  await snap(page, vp, "tutorial-5", mobile, "обучение, слайд 5");
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await menuReady(page, 8000).catch(() => {});

  // Правила: первый, средний и последний таб (на десктопе — все пять).
  await safeClick(page.getByRole("button", { name: "Правила" }).first(), 4000);
  await page.getByText("Ход года").first().waitFor({ timeout: 10_000 });
  const tabs = mobile
    ? [
        ["Базовая игра", "rules-base"],
        ["Растения", "rules-plants"],
        ["Мутации", "rules-mutations"],
      ]
    : [
        ["Базовая игра", "rules-base"],
        ["Континенты", "rules-continents"],
        ["Растения", "rules-plants"],
        ["Трава и грибы", "rules-fungi"],
        ["Мутации", "rules-mutations"],
      ];
  for (const [tabName, shotName] of tabs) {
    await safeClick(page.getByRole("tab", { name: tabName }), 3000);
    await sleep(500);
    await snap(page, vp, shotName, mobile, `правила: ${tabName}`);
  }
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);

  // Статистика.
  await safeClick(page.getByRole("button", { name: "Статистика" }).first(), 4000);
  await page.getByText("Партий").first().waitFor({ timeout: 8000 });
  await sleep(500);
  await snap(page, vp, "stats", mobile, "статистика");
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  ok(`${vp}: меню/обучение/правила/статистика отсняты`);
}

// ── Партия за сетевым столом ────────────────────────────────────────────────

/**
 * Поднять сетевой стол (2 места, одно занимает бот) на короткой колоде и
 * включить быстрый темп. Раньше здесь были соло-настройки в меню: соло-режим
 * удалён (M1), «Игроков за столом» и «Размер колоды свойств» из меню ушли —
 * те же параметры теперь задаются столу в лобби (startNetGame).
 */
async function startTable(page) {
  const code = await startNetGame(page, { name: "Обход", players: 2, bots: 1, deckSize: 20 });
  await tuneFast(page);
  return code;
}

/** Быстрый темп: кнопка в шапке партии + запись в localStorage и стор. */
async function tuneFast(page) {
  const fast = page.getByRole("button", { name: "Быстро", exact: true }).first();
  for (let i = 0; i < 8; i++) {
    if ((await page.evaluate(() => localStorage.getItem("evo-speed")).catch(() => null)) === "fast") break;
    if (!(await fast.count())) break;
    await safeClick(fast, 2500);
    await sleep(400);
  }
  await page
    .evaluate(() => {
      globalThis.__evoStore?.getState?.().setSpeed?.("fast");
      return true;
    })
    .catch(() => {});
}

/** Одно действие автоигры: защита, спотлайт, завершение хода, питание. */
async function autoStep(page) {
  const noDefense = page.getByRole("button", { name: "Не защищаться", exact: true }).first();
  if (await isEnabled(noDefense)) {
    await safeClick(noDefense);
    return;
  }
  // Диалог «Закончить питание?» (волна 1 показывает его всегда): закрываем
  // подтверждением, иначе он висит поверх стола и блокирует действия.
  const feedDialog = page.locator('[role="dialog"]').filter({ hasText: "Закончить питание?" }).first();
  if (await isVisible(feedDialog)) {
    await safeClick(feedDialog.getByRole("button", { name: "Закончить питание", exact: true }).first());
    return;
  }
  const skipShow = page.getByRole("button", { name: "Пропустить показ", exact: true }).first();
  if (await isVisible(skipShow)) {
    await safeClick(skipShow);
    return;
  }
  // Карточка «Ваш ход» больше не требует кнопки: она уходит сама за ~3 с,
  // клик по затемнению убирает сразу. Просто гасим её и идём дальше.
  const turnCard = page.locator("div[role='status']", { hasText: "Ваш ход" }).first();
  if (await isVisible(turnCard)) {
    await page.mouse.click(6, 6).catch(() => {});
    await turnCard.waitFor({ state: "detached", timeout: 4000 }).catch(() => {});
    return;
  }
  const h = await headerInfo(page);
  if (h.phase === "Развитие") {
    // «Пас» волна 1 убрала: ход завершает «Закончить развитие».
    const pass = page.getByRole("button", { name: /^(Закончить развитие|Пас)$/ }).first();
    if (await isEnabled(pass)) await safeClick(pass);
  } else if (h.phase === "Питание") {
    const end = page.getByRole("button", { name: "Закончить ход", exact: true }).first();
    if (await isEnabled(end)) {
      await safeClick(end);
      return;
    }
    const take = page.getByRole("button", { name: "Взять еду", exact: true }).first();
    if (await isEnabled(take)) await safeClick(take);
  }
}

/** Снять спотлайт «Ваш ход» и увести курсор с карт, чтобы не мешал снимку. */
async function clearOverlays(page) {
  const toTable = page.getByRole("button", { name: "К столу", exact: true }).first();
  if (await isVisible(toTable)) await safeClick(toTable, 2000);
  await page.mouse.move(4, 4).catch(() => {});
  await sleep(250);
}

/**
 * Партия за сетевым столом до финала с промежуточными снимками фаз.
 * Возвращает true, если финальный экран достигнут. Дев-сервер может
 * перезагружать вкладку: URL с ?room=КОД и токен места в localStorage
 * возвращают за стол сами, а если сессия потеряна — поднимаем новый стол.
 */
async function tableToFinal(page, vp, mobile, budgetMs) {
  const t0 = Date.now();
  const deadline = t0 + budgetMs;
  let shotDev = false;
  let shotFoodBank = false;
  let shotFeeding = false;
  let menuFallbacks = 0;
  let restarts = 0;
  const inMenu = async () =>
    (await phaseOf(page)) === null &&
    (await isVisible(page.getByLabel("Ваше имя")));
  while (Date.now() < deadline) {
    if (await isVisible(page.getByText("Конец эволюции").first())) {
      await sleep(2200); // CountUp докручивает счёт
      await snap(page, vp, "net-final", mobile, "финальный экран");
      ok(
        `${vp}: партия дошла до финала за ${Math.round((Date.now() - t0) / 1000)} с ` +
          `(возвратов в меню ${menuFallbacks}, перезапусков ${restarts})`,
      );
      return true;
    }
    // Дев-сервер иногда перезагружает вкладку: ждём возврата за стол по
    // токену места, и только если сессия потеряна — начинаем заново.
    if (await inMenu()) {
      await sleep(3000);
      if (await inMenu()) {
        const back = await waitUntilStable(page, 15_000);
        if (back) {
          menuFallbacks++;
          console.log(`  ${vp}: вкладку перезагрузило — стол восстановился сам (раз ${menuFallbacks})`);
          continue;
        }
        if (restarts < 6) {
          restarts++;
          console.log(`  ${vp}: стол не восстановился — поднимаем новый (раз ${restarts}, навигаций ${page.__navs})`);
          await startTable(page);
          await sleep(1500);
          continue;
        }
        await snap(page, vp, "net-stuck-menu", mobile, "партия выпала в меню без восстановления");
        fail(`${vp}: партия не удержалась (перезапусков ${restarts}, навигаций ${page.__navs})`);
        return false;
      }
    }
    const h = await headerInfo(page);
    if (!shotDev && h.phase === "Развитие") {
      await sleep(1200);
      await clearOverlays(page);
      await snap(page, vp, "net-development", mobile, "фаза развития, рука");
      shotDev = true;
    } else if (!shotFoodBank && h.phase === "Кормовая база") {
      await sleep(1000);
      await clearOverlays(page);
      await snap(page, vp, "net-foodbank", mobile, "кормовая база, кубики");
      shotFoodBank = true;
    } else if (!shotFeeding && h.phase === "Питание") {
      const end = page.getByRole("button", { name: "Закончить ход", exact: true }).first();
      const take = page.getByRole("button", { name: "Взять еду", exact: true }).first();
      if ((await isVisible(end)) || (await isVisible(take))) {
        await sleep(600);
        await clearOverlays(page);
        await snap(page, vp, "net-feeding", mobile, "фаза питания, лоток и док");
        shotFeeding = true;
      }
    }
    await autoStep(page);
    await sleep(180);
  }
  const h = await headerInfo(page);
  fail(
    `${vp}: партия не дошла до финала за ${Math.round(budgetMs / 1000)} с (год ${h.year}, фаза «${h.phase}», отлучек в меню: ${menuFallbacks}, перезапусков: ${restarts}, навигаций: ${page.__navs})`,
  );
  return false;
}

/** Ждёт возврата партии после перезагрузки вкладки (фаза появилась). */
async function waitUntilStable(page, timeout) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await phaseOf(page)) return true;
    await sleep(500);
  }
  return false;
}

async function leaveFinalToMenu(page) {
  const toMenu = page.getByRole("button", { name: "В меню", exact: true }).first();
  if (await isVisible(toMenu)) {
    await safeClick(toMenu, 5000);
    await sleep(800);
  }
}

// ── Сетевые экраны ──────────────────────────────────────────────────────────

async function roomCodeOf(page) {
  const loc = page.locator("[data-room-code]").first();
  if (!(await loc.count())) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
}

/** Открыть панель «Игра по сети» и заполнить имя: секция открыта сразу. */
async function openNetPanel(page, name) {
  const nameInput = page.getByLabel("Ваше имя");
  for (let i = 0; i < 6 && !(await isVisible(nameInput)); i++) await sleep(600);
  if (await isVisible(nameInput)) await nameInput.fill(name).catch(() => {});
}

/** Хост: создать стол и вернуть код. */
async function createRoom(page, name) {
  await gotoMenu(page);
  await openNetPanel(page, name);
  const create = page.getByRole("button", { name: "Создать стол" }).last();
  await create.scrollIntoViewIfNeeded().catch(() => {});
  await safeClick(create, 5000);
  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    const code = await roomCodeOf(page);
    if (code) return code;
    await sleep(400);
  }
  return "";
}

/** Гость/зритель: вход по ссылке ?room=КОД (или форма, если токена нет). */
async function joinRoom(page, code, name, spectator = false) {
  await page
    .goto(`${BASE}?room=${code}`, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(`${BASE}?room=${code}`, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
  await sleep(600);
  const nameInput = page.getByLabel("Ваше имя");
  for (let i = 0; i < 4 && !(await isVisible(nameInput)); i++) await sleep(500);
  if (await isVisible(nameInput)) {
    await nameInput.fill(name).catch(() => {});
    const codeInput = page.getByLabel("Код стола");
    if (await codeInput.count()) {
      const filled = ((await codeInput.inputValue().catch(() => "")) ?? "").trim().toUpperCase();
      if (filled !== code) await codeInput.fill(code).catch(() => {});
    }
    const join = page.getByRole("button", { name: spectator ? "Смотреть" : "Войти", exact: true }).first();
    for (let i = 0; i < 6; i++) {
      if (await isEnabled(join)) await safeClick(join, 3000);
      if ((await roomCodeOf(page)) === code) return true;
      await sleep(900);
    }
  }
  return (await roomCodeOf(page)) === code;
}

/** Ждём лобби с ожидаемым заголовком (места есть / мест нет). */
async function waitLobbyText(page, re, timeout = 25_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const found = await page.getByText(re).count().catch(() => 0);
    if (found > 0) return true;
    await sleep(500);
  }
  return false;
}

/** Настройки лобби: вместимость, модуль, сложность — с фиксацией в UI. */
async function tuneLobby(page, capacity) {
  const capBtn = page.getByRole("button", { name: String(capacity), exact: true }).first();
  for (let i = 0; i < 4; i++) {
    const cls = ((await capBtn.getAttribute("class").catch(() => "")) ?? "").includes("bg-accent");
    if (cls) break;
    await safeClick(capBtn, 3000);
    await sleep(800);
  }
  const continents = page.getByRole("button", { name: /Континенты/ }).first();
  if (await continents.count()) {
    for (let i = 0; i < 4; i++) {
      const on = (await continents.getAttribute("aria-pressed").catch(() => null)) === "true";
      if (on) break;
      await safeClick(continents, 3000);
      await sleep(800);
    }
  }
}

// ── Сценарии ────────────────────────────────────────────────────────────────

const WARM_MODULES = [
  "/src/components/game/game-app.tsx",
  "/src/components/game/top-bar.tsx",
  "/src/components/game/dice-3d.tsx",
  "/src/components/game/event-feed.tsx",
  "/src/components/game/screens.tsx",
  "/src/components/game/net-screens.tsx",
  "/src/components/game/trait-tip.tsx",
  "/src/components/game/spotlight.tsx",
  "/src/components/game/tutorial.tsx",
  "/src/components/game/cards.tsx",
  "/src/components/game/cards-flora.tsx",
  "/src/components/game/cards-plants.tsx",
];

/**
 * Прогрев dev-сервера: первый импорт модулей и первый вызов каждого serverFn
 * компилируются Vite лениво и шлют full-reload всем вкладкам. Поднимаем
 * сетевой стол с ботом и дёргаем сетевые функции на отдельной вкладке, чтобы
 * сценарий не рвался на середине.
 */
async function warmup() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  track(page, "warmup");
  try {
    await gotoMenu(page);
    await page
      .evaluate(async (mods) => {
        for (const m of mods) {
          try {
            await import(m);
          } catch {
            /* не критичный модуль */
          }
        }
      }, WARM_MODULES)
      .catch(() => {});
    await page
      .evaluate(async () => {
        const api = await import("/src/lib/net/api.ts");
        const code = "ZZZZ";
        const token = "0".repeat(32);
        const calls = [
          () => api.netCreateRoom({ data: { name: "Прогрев", capacity: 2, botSeats: 0, difficulty: "normal" } }),
          () => api.netJoinRoom({ data: { code, name: "Прогрев" } }),
          () => api.netRejoin({ data: { code, token } }),
          () => api.netSetBots({ data: { code, token, count: 1 } }),
          () => api.netKick({ data: { code, token, seat: 1 } }),
          () => api.netSetCapacity({ data: { code, token, capacity: 3 } }),
          () => api.netSetSettings({ data: { code, token, settings: { difficulty: "hard" } } }),
          () => api.netTransferHost({ data: { code, token, seat: 1 } }),
          () => api.netKickWaiter({ data: { code, token, index: 0 } }),
          () => api.netRoomInfo({ data: { code, token } }),
          () => api.netClaimSeat({ data: { code, token } }),
          () => api.netLeaveQueue({ data: { code, token } }),
          () => api.netChat({ data: { code, token, text: "прогрев" } }),
          () => api.netStart({ data: { code, token } }),
          () => api.netAction({ data: { code, token, action: { type: "devPass" } } }),
          () => api.netPoll({ data: { code, token } }),
          () => api.netAgain({ data: { code, token } }),
          () => api.netSpectate({ data: { code, name: "Прогрев" } }),
        ];
        for (const call of calls) {
          try {
            await call();
          } catch {
            /* важен сам вызов, ответ не нужен */
          }
        }
      })
      .catch(() => {});
    // Сетевой стол с ботом, чтобы отрендерились все модули партии (в т.ч. кубики и журнал).
    await startTable(page);
    await waitPhase(page, "Развитие", 25_000);
    await sleep(1500);
    ok("dev-сервер прогрет");
  } catch (e) {
    warn(`прогрев не удался: ${String(e.message ?? e).split("\n")[0]}`);
  } finally {
    await ctx.close();
  }
  await sleep(2000);
}

/** Полный проход меню + сетевой стол на одном вьюпорте. */
async function walkTablePass(page, vp, mobile) {
  await walkMenu(page, vp, mobile);
  await startTable(page);
  await sleep(1500);
  await tableToFinal(page, vp, mobile, SOLO_BUDGET_MS);
  await leaveFinalToMenu(page);
}

// ── Режимы запуска ──────────────────────────────────────────────────────────
// Chromium в этом окружении иногда умирает через 2,5–5 минут работы, поэтому
// обход можно запускать частями: EVO_WALK=desktop|net|mobile|table-phases|full.
const MODE = process.env.EVO_WALK ?? "full";

/**
 * Быстрый проход только по фазам партии (сетевой стол): развитие, кормовая
 * база, питание. Кормовая база и питание короткие, поэтому шапку опрашиваем
 * плотно и не отвлекаемся на автоигру, пока кадр не снят.
 */
async function phasePass(page, vp, mobile, budgetMs = 120_000) {
  await gotoMenu(page);
  await startTable(page);
  // Дешёвый опрос состояния прямо в странице: у locator-вызовов слишком
  // большие накладные расходы, из-за них короткие фазы проскакивают.
  const readState = () =>
    page
      .evaluate(() => {
        const t = (document.querySelector("header")?.innerText ?? "").replace(/\s+/g, " ");
        const phase =
          ["Развитие", "Кормовая база", "Питание", "Вымирание", "Рост", "Итог"].find((p) =>
            t.includes(p),
          ) ?? "?";
        const has = (name) =>
          [...document.querySelectorAll("button")].some(
            (b) => b.textContent.trim() === name && !b.disabled,
          );
        const hasRe = (re) =>
          [...document.querySelectorAll("button")].some(
            (b) => re.test(b.textContent.trim()) && !b.disabled,
          );
        return {
          phase,
          text: t,
          // Волна 1: «Пас» в развитии заменён на «Закончить развитие»
          // (регексп — чтобы новые переименования не ломали прогон).
          devEnd: hasRe(/^(Закончить развитие|Пас)$/),
          take: has("Взять еду"),
          end: has("Закончить ход"),
          noDefense: has("Не защищаться"),
          feedDialog: Boolean(
            document.querySelector('[role="dialog"]') &&
              /Закончить питание/.test(
                document.querySelector('[role="dialog"]')?.textContent ?? "",
              ),
          ),
          toTable: has("К столу"),
        };
      })
      .catch(() => null);
  /** Клик по кнопке по тексту — дешёвый DOM-клик, React его видит. */
  const clickByText = (name) =>
    page
      .evaluate((label) => {
        const b = [...document.querySelectorAll("button")].find(
          (x) => x.textContent.trim() === label && !x.disabled,
        );
        if (!b) return false;
        b.click();
        return true;
      }, name)
      .catch(() => false);
  /** То же, но строго внутри открытого диалога (кнопка дока не считается). */
  const clickDialogByText = (name) =>
    page
      .evaluate((label) => {
        const d = document.querySelector('[role="dialog"]');
        if (!d) return false;
        const b = [...d.querySelectorAll("button")].find(
          (x) => x.textContent.trim() === label && !x.disabled,
        );
        if (!b) return false;
        b.click();
        return true;
      }, name)
      .catch(() => false);
  let dev = false;
  let bank = false;
  let feed = false;
  let playedAnimal = false;
  let lastLogged = "";
  const deadline = Date.now() + budgetMs;
  while (Date.now() < deadline && !(dev && bank && feed)) {
    // Отлучка в меню = перезагрузка вкладки: сначала ждём авто-возврат за
    // стол по токену места, и только потом поднимаем новый стол.
    if (await isVisible(page.getByLabel("Ваше имя"))) {
      await sleep(2500);
      if ((await isVisible(page.getByLabel("Ваше имя"))) && !(await phaseOf(page))) {
        if (await waitUntilStable(page, 12_000)) continue;
        await startTable(page);
        await sleep(1200);
        continue;
      }
    }
    const h = await readState();
    if (!h) {
      await sleep(120);
      continue;
    }
    if (h.text && h.text !== lastLogged) {
      lastLogged = h.text;
      console.log(`  ${vp}: ${h.text.slice(0, 90)}`);
    }
    if (!dev && h.phase === "Развитие") {
      await sleep(900);
      await clearOverlays(page);
      await snap(page, vp, "net-development", mobile, "фаза развития, рука");
      dev = true;
      continue;
    }
    // Док питания появляется только когда у человека есть животное: разыграем
    // одну карту животным в развитии, иначе фазу питания не увидеть.
    if (dev && !playedAnimal && h.phase === "Развитие") {
      playedAnimal = await clickByText("Животное");
      if (playedAnimal) await sleep(800);
      continue;
    }
    if (!bank && h.phase === "Кормовая база") {
      // Даём броску проиграться: в начале фазы карточка только проявляется,
      // сам кубик виден через секунду.
      await sleep(mobile ? 900 : 1400);
      await snap(page, vp, "net-foodbank", mobile, "кормовая база, кубики");
      bank = true;
      continue;
    }
    if (!feed && h.phase === "Питание" && (h.take || h.end)) {
      // Убираем карточку «Ваш ход», чтобы она не закрывала стол.
      await clearOverlays(page);
      await snap(page, vp, "net-feeding", mobile, "фаза питания, лоток и док");
      feed = true;
      continue;
    }
    // Действия: подтверждение «Закончить питание», защита от хищника,
    // завершение хода в развитии («Закончить развитие») и в питании.
    if (h.feedDialog) await clickDialogByText("Закончить питание");
    else if (h.noDefense) await clickByText("Не защищаться");
    else if (h.toTable) await clickByText("К столу");
    else if (h.phase === "Развитие" && h.devEnd) await clickByText("Закончить развитие");
    else if (feed && h.phase === "Питание" && h.end) await clickByText("Закончить ход");
    await sleep(60);
  }
  if (dev && bank && feed) {
    ok(`${vp}: фазы партии отсняты (развитие, база, питание)`);
  } else {
    fail(`${vp}: не все фазы партии отсняты (развитие=${dev}, база=${bank}, питание=${feed})`);
  }
}

/**
 * Зрительский вход в живой стол: форма с «Смотреть» и read-only стол.
 * Десктоп и мобилка — отдельными контекстами.
 */
async function spectatorPass(code) {
  // Десктопный зритель.
  try {
    const specCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const spec = await specCtx.newPage();
    track(spec, "spectator-desktop");
    await gotoMenu(spec);
    await openNetPanel(spec, "Зритель");
    await safeClick(spec.getByRole("button", { name: "Присоединиться к столу" }), 3000);
    await sleep(300);
    await spec.getByLabel("Код стола").fill(code).catch(() => {});
    await sleep(500);
    await snap(spec, "desktop", "net-join-spectate", false, "форма входа: кнопка «Смотреть»");
    await safeClick(spec.getByRole("button", { name: "Смотреть" }).first(), 5000);
    await spec.getByText("Вы смотрите").first().waitFor({ timeout: 25_000 }).catch(() => {});
    if (!(await waitGameHeader(spec, 30_000))) warn("десктоп-зритель: шапка партии не появилась");
    await sleep(1200);
    await snap(spec, "desktop", "net-spectator", false, "зрительский стол с бейджем");
    await specCtx.close();
  } catch (e) {
    fail(`зрительский вид (десктоп): ${String(e.message ?? e).split("\n")[0]}`);
  }
  // Мобильный зритель.
  try {
    const mSpecCtx = await browser.newContext(mobileOpts());
    const mSpec = await mSpecCtx.newPage();
    track(mSpec, "spectator-mobile");
    await gotoMenu(mSpec);
    await openNetPanel(mSpec, "Зритель");
    await safeClick(mSpec.getByRole("button", { name: "Присоединиться к столу" }), 3000);
    await sleep(300);
    await mSpec.getByLabel("Код стола").fill(code).catch(() => {});
    await sleep(500);
    await snap(mSpec, "mobile", "net-join-spectate", true, "вход зрителем на мобилке");
    await safeClick(mSpec.getByRole("button", { name: "Смотреть" }).first(), 5000);
    await mSpec.getByText("Вы смотрите").first().waitFor({ timeout: 25_000 }).catch(() => {});
    if (!(await waitGameHeader(mSpec, 30_000))) warn("мобильный зритель: шапка партии не появилась");
    await sleep(1200);
    await snap(mSpec, "mobile", "net-spectator", true, "зрительский стол на мобилке");
    await mSpecCtx.close();
  } catch (e) {
    fail(`зрительский вид (мобилка): ${String(e.message ?? e).split("\n")[0]}`);
  }
}

/**
 * Лёгкий сетевой сценарий: хост сам заполняет стол ботом, стартует и снимает
 * стол/журнал/чат/реакции. Быстрее полного (без вкладок гостя и ожидающего)
 * и устойчивее к медленному dev-серверу.
 */
async function netLightPass(page) {
  const code = await createRoom(page, "Аня");
  if (!/^[A-Z]{4}$/.test(code)) throw new Error(`странный код стола: "${code}"`);
  ok(`сетевой стол ${code} создан`);
  await tuneLobby(page, 2);
  await snap(page, "desktop", "net-lobby-host", false, "лобби хоста: места и настройки");
  const settingsHead = page.getByText("Настройки партии").first();
  if (await settingsHead.count()) {
    await settingsHead.scrollIntoViewIfNeeded().catch(() => {});
    await sleep(400);
    await snap(page, "desktop", "net-lobby-settings", false, "лобби: настройки и вместимость");
  }
  // Бот занимает свободное место — старт доступен сразу.
  for (let i = 0; i < 8; i++) {
    const addBot = page.getByRole("button", { name: "Добавить бота" }).first();
    const start = page.getByRole("button", { name: "Начать год", exact: true }).first();
    if (await isEnabled(start)) break;
    if (await isEnabled(addBot)) await safeClick(addBot, 3000);
    await sleep(900);
  }
  const start = page.getByRole("button", { name: "Начать год", exact: true }).first();
  await start.scrollIntoViewIfNeeded().catch(() => {});
  await safeClick(start, 5000);
  if (!(await waitGameHeader(page, 45_000))) throw new Error("сетевая партия не началась");
  await sleep(1500);
  await snap(page, "desktop", "net-table", false, "сетевой стол, журнал свёрнут");
  const journalBefore = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Журнал и чат"]');
    const dialog = document.querySelector('[role="dialog"][aria-label="Журнал и чат"]');
    return { asideW: aside ? Math.round(aside.getBoundingClientRect().width) : null, dialog: Boolean(dialog) };
  });
  console.log(`  журнал на десктопе до раскрытия: ${JSON.stringify(journalBefore)}`);
  await safeClick(page.getByRole("button", { name: "Журнал и чат", exact: true }).first(), 4000);
  await page.locator('[role="log"]').first().waitFor({ timeout: 8000 }).catch(() => {});
  await sleep(500);
  const journalAfter = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label="Журнал и чат"]');
    const dialog = document.querySelector('[role="dialog"][aria-label="Журнал и чат"]');
    return {
      asideW: aside ? Math.round(aside.getBoundingClientRect().width) : null,
      dialog: dialog ? Math.round(dialog.getBoundingClientRect().width) : null,
    };
  });
  console.log(`  журнал на десктопе после раскрытия: ${JSON.stringify(journalAfter)}`);
  if (!journalAfter.asideW || journalAfter.asideW < 200) {
    warn(
      `десктоп 1280×800: журнал раскрылся не колонкой (asideW=${journalAfter.asideW}, панель=${journalAfter.dialog})`,
    );
  }
  await snap(page, "desktop", "net-table-journal", false, "сетевой стол, журнал колонкой");
  const chatInput = page.getByLabel("Сообщение в чат").first();
  if (await isVisible(chatInput)) {
    await chatInput.fill("Привет, стол!");
    await safeClick(page.getByRole("button", { name: "Отправить сообщение" }).first(), 3000);
    await page.getByText("Привет, стол!").first().waitFor({ timeout: 10_000 }).catch(() => {});
    await sleep(300);
    await snap(page, "desktop", "net-table-chat", false, "панель чата с сообщением");
  } else {
    fail("десктоп: поле ввода чата не найдено в сетевом столе");
  }
  const cheer = page.getByRole("button", { name: "Реакция 👏" }).first();
  if (await cheer.count()) {
    await safeClick(cheer, 3000);
    await sleep(400);
    await snap(page, "desktop", "net-table-reaction", false, "кнопка реакций и пузырь");
  } else {
    warn("десктоп: кнопка реакций «👏» не найдена");
  }
  await spectatorPass(code);
}

// ── Запуск ──────────────────────────────────────────────────────────────────

// Полный Chromium (новый headless): chrome-headless-shell в этом окружении
// падал на тяжёлой партии с WebGL-кубиками через 2,5–5 минут.
const browser = await chromium.launch({ channel: "chromium" });
browser.on("disconnected", () =>
  console.log(`BROWSER: отключился на ${Math.round((Date.now() - START_TS) / 1000)} с`),
);

try {
  if (MODE === "full") await warmup();

  // ══ ДЕСКТОПНЫЙ ПРОХОД ═══════════════════════════════════════════════════
  if (MODE !== "mobile") {
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const desktop = await dCtx.newPage();
  if (MODE === "net") {
    track(desktop, "net-host");
    await gotoMenu(desktop);
    await netLightPass(desktop);
  } else if (MODE === "table-phases") {
    track(desktop, "desktop-phases");
    await phasePass(desktop, "desktop", false);
  } else {
    track(desktop, "desktop");
    await walkTablePass(desktop, "desktop", false);
  }

  // ══ СЕТЕВОЙ СТОЛ: десктоп-хост + гость + ожидающий ══════════════════════
  if (MODE === "full") {
  let netRoomCode = "";
  const hostCtx = dCtx; // хост — та же вкладка, что прошла соло
  const guestCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const guest = await guestCtx.newPage();
  track(guest, "net-guest");
  const waiterCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const waiter = await waiterCtx.newPage();
  track(waiter, "net-waiter");

  try {
    netRoomCode = await createRoom(desktop, "Аня");
    if (!/^[A-Z]{4}$/.test(netRoomCode)) throw new Error(`странный код стола: "${netRoomCode}"`);
    ok(`сетевой стол ${netRoomCode} создан на десктопе`);
    await tuneLobby(desktop, 2);
    await snap(desktop, "desktop", "net-lobby-host", false, "лобби хоста: места и настройки");
    const settingsHead = desktop.getByText("Настройки партии").first();
    if (await settingsHead.count()) {
      await settingsHead.scrollIntoViewIfNeeded().catch(() => {});
      await sleep(400);
      await snap(desktop, "desktop", "net-lobby-settings", false, "лобби: настройки и вместимость");
    }

    await joinRoom(guest, netRoomCode, "Боря");
    await waitLobbyText(guest, /Стол · ждём игроков/, 20_000);
    ok("гость вошёл за стол");

    await joinRoom(waiter, netRoomCode, "Вася");
    await waitLobbyText(waiter, /Стол · мест нет/, 20_000);
    await waitLobbyText(desktop, /Ожидают места/, 20_000);
    await snap(desktop, "desktop", "net-lobby-waiting", false, "лобби хоста с очередью ожидающих");
    await snap(waiter, "desktop", "net-waiting-room", false, "экран ожидающего");

    // Старт: стол полон (2 человека).
    const startBtn = desktop.getByRole("button", { name: "Начать год", exact: true }).first();
    await startBtn.scrollIntoViewIfNeeded().catch(() => {});
    for (let i = 0; i < 20 && !(await isEnabled(startBtn)); i++) await sleep(500);
    await safeClick(startBtn, 5000);
    const netStarted = await waitGameHeader(desktop, 40_000);
    if (!netStarted) throw new Error("сетевая партия не началась у хоста");
    await waitGameHeader(guest, 40_000);
    ok("сетевая партия началась");

    await sleep(1200);
    await snap(desktop, "desktop", "net-table", false, "сетевой стол, журнал свёрнут");
    // Раскладка журнала на 1280×800: ожидаем колонку xl (aside в потоке),
    // а не всплывающую панель планшета (fixed-диалог).
    const journalBefore = await desktop.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Журнал и чат"]');
      const dialog = document.querySelector('[role="dialog"][aria-label="Журнал и чат"]');
      return { asideW: aside ? Math.round(aside.getBoundingClientRect().width) : null, dialog: Boolean(dialog) };
    });
    console.log(`  журнал на десктопе до раскрытия: ${JSON.stringify(journalBefore)}`);
    await safeClick(desktop.getByRole("button", { name: "Журнал и чат", exact: true }).first(), 4000);
    await desktop.locator('[role="log"]').first().waitFor({ timeout: 8000 }).catch(() => {});
    await sleep(500);
    const journalAfter = await desktop.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Журнал и чат"]');
      const dialog = document.querySelector('[role="dialog"][aria-label="Журнал и чат"]');
      return {
        asideW: aside ? Math.round(aside.getBoundingClientRect().width) : null,
        dialog: dialog ? Math.round(dialog.getBoundingClientRect().width) : null,
      };
    });
    console.log(`  журнал на десктопе после раскрытия: ${JSON.stringify(journalAfter)}`);
    if (!journalAfter.asideW || journalAfter.asideW < 200) {
      warn(
        `десктоп 1280×800: журнал раскрылся не колонкой (asideW=${journalAfter.asideW}, панель=${journalAfter.dialog})`,
      );
    }
    await snap(desktop, "desktop", "net-table-journal", false, "сетевой стол, журнал колонкой");
    const chatInput = desktop.getByLabel("Сообщение в чат").first();
    if (await isVisible(chatInput)) {
      await chatInput.fill("Привет, стол!");
      await safeClick(desktop.getByRole("button", { name: "Отправить сообщение" }).first(), 3000);
      await desktop.getByText("Привет, стол!").first().waitFor({ timeout: 10_000 }).catch(() => {});
      await sleep(300);
      await snap(desktop, "desktop", "net-table-chat", false, "панель чата с сообщением");
    } else {
      fail("десктоп: поле ввода чата не найдено в сетевом столе");
    }
    const cheer = desktop.getByRole("button", { name: "Реакция 👏" }).first();
    if (await cheer.count()) {
      await safeClick(cheer, 3000);
      await sleep(400);
      await snap(desktop, "desktop", "net-table-reaction", false, "кнопка реакций и пузырь");
    } else {
      warn("десктоп: кнопка реакций «👏» не найдена");
    }
  } catch (e) {
    fail(`сетевой сценарий (десктоп): ${String(e.message ?? e).split("\n")[0]}`);
  }

  // Зритель: десктоп и мобилка — на живой сетевой стол.
  if (/^[A-Z]{4}$/.test(netRoomCode)) {
    // Десктопный зритель.
    try {
      const specCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const spec = await specCtx.newPage();
      track(spec, "spectator-desktop");
      await gotoMenu(spec);
      await openNetPanel(spec, "Зритель");
      await safeClick(spec.getByRole("button", { name: "Присоединиться к столу" }), 3000);
      await sleep(300);
      await spec.getByLabel("Код стола").fill(netRoomCode).catch(() => {});
      await sleep(500);
      await snap(spec, "desktop", "net-join-spectate", false, "форма входа: кнопка «Смотреть»");
      await safeClick(spec.getByRole("button", { name: "Смотреть" }).first(), 5000);
      const badge = spec.getByText("Вы смотрите").first();
      await badge.waitFor({ timeout: 25_000 }).catch(() => {});
      if (!(await waitGameHeader(spec, 30_000))) warn("десктоп-зритель: шапка партии не появилась");
      await sleep(1200);
      await snap(spec, "desktop", "net-spectator", false, "зрительский стол с бейджем");
      await specCtx.close();
    } catch (e) {
      fail(`зрительский вид (десктоп): ${String(e.message ?? e).split("\n")[0]}`);
    }

    // Мобильный зритель — им же закрываем требование «Смотреть» на мобилке.
    try {
      const mSpecCtx = await browser.newContext(mobileOpts());
      const mSpec = await mSpecCtx.newPage();
      track(mSpec, "spectator-mobile");
      await gotoMenu(mSpec);
      await openNetPanel(mSpec, "Зритель");
      await safeClick(mSpec.getByRole("button", { name: "Присоединиться к столу" }), 3000);
      await sleep(300);
      await mSpec.getByLabel("Код стола").fill(netRoomCode).catch(() => {});
      await sleep(500);
      await snap(mSpec, "mobile", "net-join-spectate", true, "вход зрителем на мобилке");
      await safeClick(mSpec.getByRole("button", { name: "Смотреть" }).first(), 5000);
      await mSpec.getByText("Вы смотрите").first().waitFor({ timeout: 25_000 }).catch(() => {});
      if (!(await waitGameHeader(mSpec, 30_000))) warn("мобильный зритель: шапка партии не появилась");
      await sleep(1200);
      await snap(mSpec, "mobile", "net-spectator", true, "зрительский стол на мобилке");
      await mSpecCtx.close();
    } catch (e) {
      fail(`зрительский вид (мобилка): ${String(e.message ?? e).split("\n")[0]}`);
    }
  } else {
    warn("код сетевого стола не получен — зрительские экраны не сняты");
  }

  await guestCtx.close().catch(() => {});
  await waiterCtx.close().catch(() => {});
  await hostCtx.close().catch(() => {});
  } // конец сетевого сценария
  } // конец десктопного прохода

  // ══ МОБИЛЬНЫЙ ПРОХОД ════════════════════════════════════════════════════
  if (MODE === "full" || MODE === "mobile" || MODE === "table-phases") {
  const mCtx = await browser.newContext(mobileOpts());
  const mobile = await mCtx.newPage();
  if (MODE === "table-phases") {
    track(mobile, "mobile-phases");
    await phasePass(mobile, "mobile", true);
  } else {
  track(mobile, "mobile");
  if (process.env.EVO_SKIP_TABLE !== "1") await walkTablePass(mobile, "mobile", true);

  // Мобильное лобби-хост: стол + бот, настройки, старт.
  try {
    const mCode = await createRoom(mobile, "Моби");
    if (!/^[A-Z]{4}$/.test(mCode)) throw new Error(`странный код стола: "${mCode}"`);
    await tuneLobby(mobile, 2);
    await snap(mobile, "mobile", "net-lobby-host", true, "мобильное лобби хоста");
    const settingsHead = mobile.getByText("Настройки партии").first();
    if (await settingsHead.count()) {
      await settingsHead.scrollIntoViewIfNeeded().catch(() => {});
      await sleep(400);
      await snap(mobile, "mobile", "net-lobby-settings", true, "мобильное лобби: настройки");
    }
    const addBot = mobile.getByRole("button", { name: "Добавить бота" }).first();
    if (await addBot.count()) {
      await safeClick(addBot, 3000);
      await sleep(1000);
    }
    const startBtn = mobile.getByRole("button", { name: "Начать год", exact: true }).first();
    await startBtn.scrollIntoViewIfNeeded().catch(() => {});
    for (let i = 0; i < 24 && !(await isEnabled(startBtn)); i++) await sleep(500);
    await safeClick(startBtn, 5000);
    if (!(await waitGameHeader(mobile, 40_000))) throw new Error("мобильная сетевая партия не началась");
    await sleep(1200);
    await snap(mobile, "mobile", "net-table", true, "мобильный сетевой стол");
    await safeClick(mobile.getByRole("button", { name: "Журнал и чат", exact: true }).first(), 4000);
    await mobile.locator('[role="log"]').first().waitFor({ timeout: 8000 }).catch(() => {});
    await sleep(600);
    const messenger = await mobile.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"][aria-label="Журнал и чат"]');
      if (!dialog) return null;
      const r = dialog.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), vw: window.innerWidth, vh: window.innerHeight };
    });
    console.log(`  мобильный журнал-мессенджер: ${JSON.stringify(messenger)}`);
    if (!messenger || messenger.w < messenger.vw - 2 || messenger.h < messenger.vh - 2) {
      warn(`мобилка: журнал раскрылся не на весь экран (${JSON.stringify(messenger)})`);
    }
    await snap(mobile, "mobile", "net-table-journal", true, "журнал-мессенджер на мобилке");
    const chatInput = mobile.getByLabel("Сообщение в чат").first();
    if (await isVisible(chatInput)) {
      await chatInput.fill("Мобильное сообщение");
      await safeClick(mobile.getByRole("button", { name: "Отправить сообщение" }).first(), 3000);
      await sleep(500);
      await snap(mobile, "mobile", "net-table-chat", true, "чат на мобилке");
    } else {
      fail("мобилка: поле ввода чата не видно в открытом журнале");
    }
  } catch (e) {
    fail(`сетевой сценарий (мобилка): ${String(e.message ?? e).split("\n")[0]}`);
  }
  } // конец ветки не-table-phases
  await mCtx.close().catch(() => {});
  } // конец мобильного прохода
} catch (e) {
  fail(`прогон прерван: ${String(e.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
  // Снимки копируем в EVO_SHOTS (по умолчанию %TEMP%) только после закрытия
  // браузера: PNG в дереве проекта во время прогона дёргал Tailwind и
  // перезагружал вкладки.
  try {
    let copied = 0;
    for (const f of readdirSync(TMP_SHOTS)) {
      if (!f.startsWith("walk-") || !f.endsWith(".png")) continue;
      copyFileSync(join(TMP_SHOTS, f), join(SHOTS, f));
      copied++;
    }
    console.log(`\nСкриншоты скопированы в ${SHOTS}: ${copied}`);
  } catch (e) {
    console.log(`\nНе удалось скопировать скриншоты: ${String(e.message ?? e)}`);
  }
}

function mobileOpts() {
  return {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  };
}

// ── Итоги ───────────────────────────────────────────────────────────────────
console.log(`\nСкриншотов: ${shotCount}`);
if (consoleErrors.length) {
  const uniq = [...new Set(consoleErrors)];
  console.log(`\nОШИБКИ КОНСОЛИ (${uniq.length}):`);
  for (const e of uniq.slice(0, 30)) console.log("  " + e);
} else {
  console.log("\nОшибок консоли не зафиксировано.");
}
if (warnings.length) {
  console.log(`\nПРЕДУПРЕЖДЕНИЯ (${warnings.length}):`);
  for (const w of warnings) console.log("  WARN: " + w);
}
if (problems.length) {
  console.log(`\nПРОБЛЕМЫ (${problems.length}):`);
  for (const p of problems) console.log("  FAIL: " + p);
}
console.log(
  `\nИТОГ: ${problems.length ? `проблем ${problems.length}` : "жёстких провалов нет"}` +
    `${warnings.length ? `, предупреждений ${warnings.length}` : ""}` +
    `${consoleErrors.length ? `, ошибок консоли ${consoleErrors.length}` : ""}` +
    ` (${Math.round((Date.now() - START_TS) / 1000)} с)`,
);
process.exitCode = problems.length ? 1 : 0;
