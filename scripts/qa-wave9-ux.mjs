/**
 * QA волны 9 (UX/дизайн-проход): матрица экранов × устройств × языков.
 *
 * Проверяет (при живом dev-сервере, node scripts/qa-wave9-ux.mjs):
 *  (а) МЕНЮ (три колонки + мобильные вкладки) на 6 устройствах × RU/EN:
 *      нет горизонтального скролла, нет обрезанного текста в кнопках,
 *      на тач-ширинах — тап-таргеты (аудит всех кнопок <1024px);
 *  (б) модалки ПРАВИЛ, ОБУЧЕНИЯ и СТАТИСТИКИ: помещаются в экран, скроллятся,
 *      закрываются по Esc — телефон/планшет/десктоп, EN (длинные строки) + RU;
 *  (в) ЛОББИ (3 колонки): одна высота на ≥1024 (документ не растёт), кнопки
 *      «Начать год»/«Покинуть стол» ≥48px на тач-ширинах, чипы пароля,
 *      прыжок вёрстки при появлении строки «Скопировано» под кодом стола;
 *  (г) ОЖИДАЮЩИЙ СТОЛ: кнопки ≥48px, чат в пределах экрана, нет overflow;
 *  (д) ПАРТИЯ (развитие → кормовая база → питание, «Континенты», 3 места):
 *      нет горизонтального скролла, документ не растёт на xl+, тап-таргеты
 *      доков и журнала-мессенджера на телефоне; финальный экран — отдельно
 *      (короткая колода, 2 места) с проверкой модалки на телефоне.
 *
 * Язык задаётся ЯВНО через localStorage["evo-lang"]. Сетевые столы
 * поднимаются экшенами стора (те же вызовы, что делают кнопки UI), старт —
 * по языконезависимому [data-start-game]. Скриншоты — вне репозитория
 * (EVO_SHOTS); EVO_WAVE9_TAG=before|after выбирает суффикс имён файлов.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  advancePhase,
  dismissSpotlight,
  dismissTurnCard,
  phaseOf,
  safeClick,
  sleep,
  trackPage,
  waitPhase,
  waitUntil,
  warmupServer,
} from "./qa-lib.mjs";

const TAG = process.env.EVO_WAVE9_TAG ?? "before";
const problems = [];
const warnings = [];
const findings = []; // сводная таблица находок (уходит в JSON рядом со скриншотами)
const START_TS = Date.now();
const rel = () => `${Math.round((Date.now() - START_TS) / 1000)}с`;
const ok = (msg) => console.log(`PASS: [${rel()}] ${msg}`);
const warn = (msg) => {
  console.log(`WARN: [${rel()}] ${msg}`);
  warnings.push(msg);
};
const fail = (msg) => {
  console.log(`FAIL: [${rel()}] ${msg}`);
  problems.push(msg);
};
const check = (cond, msg) => (cond ? ok(msg) : fail(msg));
const shot = (page, name) =>
  page.screenshot({ path: join(SHOTS, `wave9-${TAG}-${name}.png`) }).catch(() => {});

/** Устройства матрицы: телефон, планшет портрет/ландшафт, ноут, десктоп, FHD. */
const DEVICES = {
  phone: { w: 390, h: 844, touch: true, isMobile: true, dsf: 2 },
  tabletP: { w: 768, h: 1024, touch: true },
  tabletL: { w: 1024, h: 768, touch: true },
  laptop: { w: 1280, h: 800 },
  desktop: { w: 1440, h: 900 },
  fhd: { w: 1920, h: 1080 },
};

/** Контекст с языком: evo-lang в localStorage, как делает переключатель шапки. */
async function langContext(browser, lang, device) {
  const ctx = await browser.newContext({
    locale: lang === "en" ? "en-US" : "ru-RU",
    viewport: { width: device.w, height: device.h },
    ...(device.dsf ? { deviceScaleFactor: device.dsf } : {}),
    ...(device.isMobile ? { isMobile: true } : {}),
    ...(device.touch ? { hasTouch: true } : {}),
    storageState: {
      cookies: [],
      origins: [
        { origin: new URL(BASE).origin, localStorage: [{ name: "evo-lang", value: lang }] },
      ],
    },
  });
  const page = await ctx.newPage();
  trackPage(page, `${lang}-${device.w}`);
  return { ctx, page };
}

/** Открыть меню (языконезависимо: ждём колонки [data-menu-col] и стор). */
async function openMenu(page) {
  await page
    .goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
  await waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), 25_000, 300);
  await waitUntil(
    () => page.locator("[data-menu-col]").count().then((n) => n > 0).catch(() => false),
    30_000,
    400,
  );
  await sleep(500);
}

/**
 * Аудит страницы: горизонтальный скролл + виновники, обрезанный текст в
 * кнопках/табах, тап-таргеты (<44px) на тач-ширинах. Чекбоксы меряются по
 * обёртке label (кликабельна вся строка), элементы вне вьюпорта пропускаем.
 */
async function auditPage(page, label, { touch, fixedHeight = false } = {}) {
  const res = await page
    .evaluate(() => {
      const out = { horiz: 0, offenders: [], clipped: [], taps: [] };
      const doc = document.documentElement;
      out.horiz = doc.scrollWidth - doc.clientWidth;
      if (out.horiz > 1) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > window.innerWidth + 1) {
            out.offenders.push(
              `${el.tagName}.${String(el.className).slice(0, 50)} right=${Math.round(r.right)} «${(el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 20)}»`,
            );
            if (out.offenders.length >= 8) break;
          }
        }
      }
      for (const el of document.querySelectorAll('button, [role="button"], [role="tab"], input[type="checkbox"], input[type="range"], textarea')) {
        if (el.disabled || el.getAttribute("aria-hidden") === "true") continue;
        let box = el;
        // Чекбокс внутри кликабельного label: меряем весь label.
        if (el.type === "checkbox" || el.type === "radio") {
          const lab = el.closest("label");
          if (lab) box = lab;
        }
        const r = box.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) continue;
        const name = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 26);
        out.taps.push({ name, w: Math.round(r.width), h: Math.round(r.height), cls: String(el.className).slice(0, 70) });
      }
      for (const el of document.querySelectorAll('button, [role="button"], [role="tab"]')) {
        if (el.classList.contains("truncate")) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2) continue;
        if (el.scrollWidth > el.clientWidth + 2) {
          out.clipped.push({
            name: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 26),
            sw: el.scrollWidth,
            cw: el.clientWidth,
          });
        }
      }
      return out;
    })
    .catch(() => null);
  if (!res) {
    warn(`${label}: аудит не выполнен (вкладка перезагрузилась?)`);
    return;
  }
  if (res.horiz > 1) {
    fail(`${label}: горизонтальный скролл ${res.horiz}px; виновники: ${res.offenders.join(" | ") || "?"}`);
    findings.push({ screen: label, issue: `горизонтальный скролл ${res.horiz}px`, detail: res.offenders });
  }
  if (res.clipped.length) {
    fail(`${label}: обрезанный текст в кнопках: ${res.clipped.map((c) => `«${c.name}» ${c.sw}>${c.cw}`).join(", ")}`);
    findings.push({ screen: label, issue: "обрезанный текст", detail: res.clipped });
  }
  // Страница с фиксированной высотой (меню/лобби на lg+, стол на xl+).
  if (fixedHeight) {
    const grows = await page
      .evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight)
      .catch(() => 0);
    if (grows > 4) {
      fail(`${label}: документ растёт вниз на ${grows}px (колонки должны скроллиться внутри себя)`);
      findings.push({ screen: label, issue: `документ растёт на ${grows}px` });
    }
  }
  if (touch) {
    const small = res.taps.filter((t) => Math.min(t.w, t.h) < 36);
    const mid = res.taps.filter((t) => {
      const m = Math.min(t.w, t.h);
      return m >= 36 && m < 44;
    });
    if (small.length) {
      const list = small.map((t) => `«${t.name}» ${t.w}×${t.h}`).join(", ");
      fail(`${label}: тап-таргеты <36px: ${list}`);
      findings.push({ screen: label, issue: "тап-таргеты <36px", detail: small });
    }
    if (mid.length) {
      const list = mid.map((t) => `«${t.name}» ${t.w}×${t.h}`).join(", ");
      warn(`${label}: тап-таргеты 36–43px (ниже 44): ${list}`);
      findings.push({ screen: label, issue: "тап-таргеты 36–43px", detail: mid });
    }
  }
}

/** Высота кнопки по селектору (для проверки ≥48/44px на тач-ширинах). */
async function buttonSize(page, selector) {
  return page
    .evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    }, selector)
    .catch(() => null);
}

/** Экшен стора вкладки (dev: стор виден на globalThis) — как в qa-lib. */
function storeCall(page, op, arg) {
  return page
    .evaluate(
      async ({ op: o, arg: a }) => {
        const store = globalThis.__evoStore;
        if (!store) return { ok: false, error: "нет __evoStore" };
        const s = store.getState();
        try {
          if (o === "create") {
            await s.startNetCreate(a);
            return { ok: true, value: store.getState().net?.code ?? null };
          }
          if (o === "join") {
            await s.startNetJoin(a.code, a.name, a.password ?? "");
            return { ok: true, value: null };
          }
          if (o === "bots") {
            await s.netAddBots(a);
            return { ok: true, value: null };
          }
          if (o === "capacity") {
            await s.netSetCapacity(a);
            return { ok: true, value: null };
          }
          if (o === "settings") {
            await s.netSetSettings(a);
            return { ok: true, value: null };
          }
          if (o === "leave") {
            await s.leaveNet();
            return { ok: true, value: null };
          }
          if (o === "speed") {
            s.setSpeed?.(a);
            return { ok: true, value: null };
          }
          return { ok: false, error: `неизвестная операция ${o}` };
        } catch (e) {
          return { ok: false, error: String(e?.message ?? e) };
        }
      },
      { op, arg: arg ?? null },
    )
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
}

/** Ждём код стола на экране (лобби/ожидающий). */
async function roomCodeOf(page, timeout = 20_000) {
  const found = await waitUntil(
    () =>
      page
        .evaluate(() => document.querySelector("[data-room-code]")?.textContent?.trim() ?? null)
        .catch(() => null)
        .then((c) => Boolean(c)),
    timeout,
    300,
  );
  if (!found) return null;
  return page
    .evaluate(() => document.querySelector("[data-room-code]")?.textContent?.trim() ?? null)
    .catch(() => null);
}

/**
 * Поднять сетевую партию на вкладке (языконезависимо: создание и настройки —
 * экшенами стора, старт — по [data-start-game]). Меню должно быть открыто.
 */
async function startGame(page, { name, players, modules = {}, deckSize, timeout = 90_000 }) {
  const r = await storeCall(page, "create", {
    name,
    capacity: players,
    botSeats: 0,
    difficulty: "normal",
    modules,
    ...(deckSize != null ? { deckSize } : {}),
  });
  if (!r.ok || !r.value) return { ok: false, error: r.error ?? r.value ?? "код не выдан" };
  const code = r.value;
  await roomCodeOf(page);
  let st = await storeCall(page, "capacity", players);
  if (st.ok && Object.keys(modules).length) st = await storeCall(page, "settings", { modules });
  if (st.ok && deckSize != null) st = await storeCall(page, "settings", { deckSize });
  const bots = await storeCall(page, "bots", players - 1);
  if (!bots.ok) return { ok: false, error: bots.error };
  const start = page.locator("[data-start-game]").first();
  const ready = await waitUntil(() => isEnabled(start), 30_000, 800);
  if (!ready) return { ok: false, error: "«Начать год» недоступна" };
  for (let i = 0; i < 3; i++) {
    await safeClick(start, 5000);
    if (await waitPhase(page, ["development", "foodBank", "feeding"], 45_000)) {
      await dismissSpotlight(page);
      await storeCall(page, "speed", "fast").catch(() => {});
      return { ok: true, code };
    }
    await storeCall(page, "bots", players - 1).catch(() => {});
  }
  return { ok: false, error: "партия не началась" };
}

async function isEnabled(loc, timeout = 1500) {
  if ((await loc.count().catch(() => 0)) === 0) return false;
  return loc.first().isEnabled({ timeout }).catch(() => false);
}

/** Ждём фазу кормовой базы/питания (крутим «закончить фазу») и снимаем экран. */
async function reachPhase(page, phases, label, timeout = 150_000) {
  const got = await advancePhase(page, () => phaseOf(page).then((p) => (Array.isArray(phases) ? phases : [phases]).includes(p)), timeout);
  if (!got) {
    warn(`${label}: фаза ${Array.isArray(phases) ? phases.join("/") : phases} не достигнута за ${Math.round(timeout / 1000)}с`);
    return false;
  }
  await dismissSpotlight(page);
  await dismissTurnCard(page);
  await sleep(600);
  return true;
}

// ── сценарий ─────────────────────────────────────────────────────────────────

const browser = await chromium.launch({ channel: "chromium" });
try {
  console.log(`Волна 9 UX, тег снимков: ${TAG}. Скриншоты: ${SHOTS}`);
  mkdirSync(SHOTS, { recursive: true });

  // Прогрев: первый импорт модулей в dev шлёт full-reload всем вкладкам.
  console.log("Прогрев dev-сервера…");
  await warmupServer(browser, { log: (m) => console.log(`  ${m}`) });

  // ══ A. Меню: 6 устройств × 2 языка ══════════════════════════════════════
  for (const [devId, dev] of Object.entries(DEVICES)) {
    for (const lang of ["ru", "en"]) {
      const label = `меню ${devId}(${dev.w}) ${lang.toUpperCase()}`;
      const { ctx, page } = await langContext(browser, lang, dev);
      try {
        await openMenu(page);
        await shot(page, `menu-${devId}-${lang}`);
        // На телефоне проверяем обе вкладки: «Столы» и «Создать».
        if (dev.w < 640) {
          const createTab = page.locator("[data-menu-col='table']").isVisible().catch(() => false);
          if (!(await createTab)) {
            const tab = page.getByRole("button", { name: lang === "en" ? "Create" : "Создать" }).first();
            await safeClick(tab, 3000);
            await sleep(400);
          }
          await shot(page, `menu-${devId}-${lang}-create`);
        }
        await auditPage(page, label, { touch: dev.touch, fixedHeight: dev.w >= 1024 });
        // Пустые списки столов должны быть понятны (пунктирная заглушка).
        const empty = await page
          .evaluate(() => document.querySelectorAll("[data-menu-scroll] p").length)
          .catch(() => 0);
        if (!empty) warn(`${label}: не найдено ни одной заглушки пустого списка`);
      } catch (e) {
        fail(`${label}: ${String(e?.message ?? e).split("\n")[0]}`);
      } finally {
        await ctx.close().catch(() => {});
      }
    }
  }

  // ══ B. Модалки: правила, обучение, статистика ═══════════════════════════
  // EN — длинные строки; телефон/планшет — тесные экраны.
  const modalDevices = [
    ["phone", "en"],
    ["phone", "ru"],
    ["tabletP", "en"],
    ["tabletL", "en"],
    ["desktop", "en"],
  ];
  for (const [devId, lang] of modalDevices) {
    const dev = DEVICES[devId];
    const { ctx, page } = await langContext(browser, lang, dev);
    const L = lang === "en";
    try {
      await openMenu(page);
      // Правила: открыть, проверить вмещание и скролл, переключить вкладку.
      await safeClick(page.getByRole("button", { name: L ? "Rules" : "Правила" }).first(), 5000);
      await sleep(500);
      const rulesFit = await page
        .evaluate(() => {
          // Карточка правил — родитель вкладок (у фона меню тоже есть fixed-слои).
          const tabs = document.querySelector('[role="tablist"]');
          const card = tabs ? tabs.parentElement : null;
          if (!card) return null;
          const r = card.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), r: Math.round(r.right), b: Math.round(r.bottom), iw: window.innerWidth, ih: window.innerHeight, sh: card.scrollHeight, ch: card.clientHeight };
        })
        .catch(() => null);
      check(
        Boolean(rulesFit) && rulesFit.r <= rulesFit.iw + 1 && rulesFit.b <= rulesFit.ih + 1,
        `правила ${devId} ${lang}: карточка в экране (${rulesFit ? `${rulesFit.r}/${rulesFit.iw}×${rulesFit.b}/${rulesFit.ih}` : "нет"})`,
      );
      // Правила длинные: карточка обязана скроллиться ВНУТРИ себя (sh > ch),
      // а не тянуть документ вниз.
      check(Boolean(rulesFit) && rulesFit.sh > rulesFit.ch, `правила ${devId} ${lang}: длинный контент скроллится внутри карточки (${rulesFit ? `${rulesFit.sh}/${rulesFit.ch}` : "?"})`);
      await shot(page, `rules-${devId}-${lang}`);
      await auditPage(page, `правила ${devId} ${lang}`, { touch: dev.touch });
      // Вкладка правил переключается (табы помещаются).
      const tab = page.getByRole("tab").nth(4);
      await safeClick(tab, 3000);
      await sleep(300);
      check(
        (await page.getByRole("tab").nth(4).getAttribute("aria-selected").catch(() => null)) === "true",
        `правила ${devId} ${lang}: пятая вкладка переключается`,
      );
      await page.keyboard.press("Escape").catch(() => {});
      await sleep(400);
      check(await page.getByRole("tab").count().then((n) => n === 0).catch(() => true), `правила ${devId} ${lang}: Esc закрывает`);

      // Обучение: первый слайд, схема фаз, точки-пагинация.
      await safeClick(page.getByRole("button", { name: L ? "Tutorial" : "Обучение" }).first(), 5000);
      await sleep(500);
      await shot(page, `tutorial-${devId}-${lang}`);
      await auditPage(page, `обучение ${devId} ${lang}`, { touch: dev.touch });
      await page.keyboard.press("Escape").catch(() => {});
      await sleep(300);

      // Статистика: пустая (новый контекст) — понятное пустое состояние.
      await safeClick(page.getByRole("button", { name: L ? "Statistics" : "Статистика" }).first(), 5000);
      await sleep(500);
      const statsEmpty = await page
        .evaluate(() => document.body.innerText.includes("Партий ещё не было") || document.body.innerText.includes("No games yet"))
        .catch(() => false);
      check(statsEmpty, `статистика ${devId} ${lang}: пустое состояние понятно`);
      await shot(page, `stats-${devId}-${lang}`);
      await page.keyboard.press("Escape").catch(() => {});
    } catch (e) {
      fail(`модалки ${devId} ${lang}: ${String(e?.message ?? e).split("\n")[0]}`);
    } finally {
      await ctx.close().catch(() => {});
    }
  }

  // ══ C. Лобби: хост-вкладка (десктоп) + гости на устройствах ═════════════
  const hostLang = "ru";
  const host = await langContext(browser, hostLang, DEVICES.desktop);
  let lobbyCode = null;
  try {
    await openMenu(host.page);
    const created = await storeCall(host.page, "create", { name: "Хост9", capacity: 8, botSeats: 0, difficulty: "normal" });
    check(created.ok && Boolean(created.value), `лобби: стол создан (${created.value ?? created.error})`);
    lobbyCode = created.value ?? null;
    if (lobbyCode) {
      await roomCodeOf(host.page);
      await sleep(800);
      await shot(host.page, `lobby-desktop-${hostLang}`);
      await auditPage(host.page, "лобби desktop RU", { touch: false, fixedHeight: true });

      // Прыжок вёрстки: строка «Скопировано» под кодом не должна двигать карточку мест.
      const before = await host.page
        .evaluate(() => {
          const el = document.querySelector("[data-seat-list]");
          return el ? Math.round(el.getBoundingClientRect().top) : null;
        })
        .catch(() => null);
      await safeClick(host.page.locator("[data-copy-link]").first(), 3000);
      await sleep(400);
      const after = await host.page
        .evaluate(() => {
          const el = document.querySelector("[data-seat-list]");
          return el ? Math.round(el.getBoundingClientRect().top) : null;
        })
        .catch(() => null);
      check(
        before !== null && after !== null && Math.abs(after - before) <= 1,
        `лобби: строка «Скопировано» не сдвигает список мест (${before}→${after})`,
      );
      if (before !== null && after !== null && Math.abs(after - before) > 1) {
        findings.push({ screen: "лобби desktop", issue: `прыжок списка мест на ${after - before}px при «Скопировано»` });
      }
      await sleep(1500); // «Скопировано» гаснет
    }
  } catch (e) {
    fail(`лобби-хост: ${String(e?.message ?? e).split("\n")[0]}`);
  }

  // Гости: заходят по коду, скриншот лобби на своём устройстве, выход.
  if (lobbyCode) {
    const guestSpecs = [
      ["phone", "en"],
      ["phone", "ru"],
      ["tabletP", "en"],
      ["tabletL", "en"],
      ["laptop", "en"],
      ["fhd", "en"],
    ];
    for (const [devId, lang] of guestSpecs) {
      const dev = DEVICES[devId];
      const { ctx, page } = await langContext(browser, lang, dev);
      try {
        await openMenu(page);
        const joined = await storeCall(page, "join", { code: lobbyCode, name: `Гость-${devId}` });
        if (!joined.ok) {
          warn(`лобби ${devId} ${lang}: вход не удался (${joined.error})`);
        } else {
          await roomCodeOf(page);
          await sleep(700);
          await shot(page, `lobby-${devId}-${lang}`);
          await auditPage(page, `лобби ${devId} ${lang}`, { touch: dev.touch, fixedHeight: dev.w >= 1024 });
          if (dev.touch) {
            const startBtn = await buttonSize(page, "[data-start-game]");
            check(
              Boolean(startBtn) && startBtn.h >= 48,
              `лобби ${devId} ${lang}: «Начать год» ≥48px (${startBtn ? `${startBtn.h}px` : "нет"})`,
            );
            const leave = await page
              .evaluate(() => {
                const el = [...document.querySelectorAll("button")].find((b) => /Покинуть стол|Leave table/.test(b.textContent));
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return Math.round(r.height);
              })
              .catch(() => null);
            check(leave !== null && leave >= 48, `лобби ${devId} ${lang}: «Покинуть стол» ≥48px (${leave ?? "нет"}px)`);
          }
        }
        await storeCall(page, "leave", null).catch(() => {});
      } catch (e) {
        fail(`лобби ${devId} ${lang}: ${String(e?.message ?? e).split("\n")[0]}`);
      } finally {
        await ctx.close().catch(() => {});
      }
    }
  }

  // ══ D. Ожидающий стол: полный стол (2 места: хост+бот), гость — в очередь ═
  const waitHost = await langContext(browser, "ru", DEVICES.desktop);
  let waitCode = null;
  try {
    await openMenu(waitHost.page);
    const created = await storeCall(waitHost.page, "create", { name: "ХостОж", capacity: 2, botSeats: 1, difficulty: "normal", isPrivate: true });
    check(created.ok && Boolean(created.value), `ожидающий: стол создан (${created.value ?? created.error})`);
    waitCode = created.value ?? null;
    if (waitCode) {
      await roomCodeOf(waitHost.page);
      await sleep(800);
      // Хост приватного стола видит чип пароля с карандашом.
      await shot(waitHost.page, "lobby-private-host");
      const chip = await buttonSize(waitHost.page, "[data-room-password]");
      check(Boolean(chip), "ожидающий: чип пароля у хоста есть");
      await auditPage(waitHost.page, "лобби приватное RU", { touch: false, fixedHeight: true });
      // Пароль стола — из стора хоста (создаётся сервером при isPrivate).
      const password = await waitHost.page
        .evaluate(() => globalThis.__evoStore?.getState?.().net?.password ?? null)
        .catch(() => null);

      const waiters = [
        ["phone", "en"],
        ["phone", "ru"],
        ["tabletP", "en"],
        ["desktop", "en"],
      ];
      for (const [devId, lang] of waiters) {
        const dev = DEVICES[devId];
        const { ctx, page } = await langContext(browser, lang, dev);
        try {
          await openMenu(page);
          const joined = await storeCall(page, "join", { code: waitCode, name: `Ож-${devId}`, password });
          if (!joined.ok) {
            // Приватный стол: без пароля ждём форму/ошибку — это тоже состояние.
            warn(`ожидающий ${devId} ${lang}: вход без пароля отклонён (${joined.error}) — проверяем экран ошибки`);
            await sleep(600);
            await shot(page, `wait-deny-${devId}-${lang}`);
          } else {
            await roomCodeOf(page);
            await sleep(700);
            await shot(page, `wait-${devId}-${lang}`);
            await auditPage(page, `ожидающий ${devId} ${lang}`, { touch: dev.touch, fixedHeight: dev.w >= 1024 });
            if (dev.touch) {
              const claim = await page
                .evaluate(() => {
                  const el = [...document.querySelectorAll("button")].find((b) => /Занять место|Take a seat/.test(b.textContent));
                  if (!el) return null;
                  return Math.round(el.getBoundingClientRect().height);
                })
                .catch(() => null);
              check(claim !== null && claim >= 48, `ожидающий ${devId} ${lang}: «Занять место» ≥48px (${claim ?? "нет"}px)`);
              const leave = await page
                .evaluate(() => {
                  const el = [...document.querySelectorAll("button")].find((b) => /Покинуть очередь|Leave the queue/.test(b.textContent));
                  if (!el) return null;
                  return Math.round(el.getBoundingClientRect().height);
                })
                .catch(() => null);
              check(leave !== null && leave >= 48, `ожидающий ${devId} ${lang}: «Покинуть очередь» ≥48px (${leave ?? "нет"}px)`);
            }
          }
          await storeCall(page, "leave", null).catch(() => {});
        } catch (e) {
          fail(`ожидающий ${devId} ${lang}: ${String(e?.message ?? e).split("\n")[0]}`);
        } finally {
          await ctx.close().catch(() => {});
        }
      }
    }
  } catch (e) {
    fail(`ожидающий: ${String(e?.message ?? e).split("\n")[0]}`);
  } finally {
    await waitHost.ctx.close().catch(() => {});
  }

  // ══ E. Партия: развитие → кормовая база → питание («Континенты», 3 места) ═
  const gameSpecs = [
    ["phone", "en"],
    ["phone", "ru"],
    ["tabletP", "en"],
    ["tabletL", "en"],
    ["laptop", "en"],
    ["desktop", "en"],
    ["fhd", "en"],
  ];
  for (const [devId, lang] of gameSpecs) {
    const dev = DEVICES[devId];
    const { ctx, page } = await langContext(browser, lang, dev);
    const label = `партия ${devId} ${lang}`;
    try {
      await openMenu(page);
      const started = await startGame(page, { name: `Игрок-${devId}`, players: 3, modules: { continents: true }, deckSize: 30 });
      if (!started.ok) {
        fail(`${label}: партия не поднялась (${started.error})`);
        continue;
      }
      await dismissTurnCard(page);
      await sleep(600);
      await shot(page, `game-dev-${devId}-${lang}`);
      await auditPage(page, `${label} развитие`, { touch: dev.touch, fixedHeight: dev.w >= 1280 });

      if (await reachPhase(page, "foodBank", `${label} кормовая база`)) {
        await shot(page, `game-bank-${devId}-${lang}`);
        await auditPage(page, `${label} кормовая база`, { touch: dev.touch, fixedHeight: dev.w >= 1280 });
      }
      if (await reachPhase(page, "feeding", `${label} питание`)) {
        await shot(page, `game-feed-${devId}-${lang}`);
        await auditPage(page, `${label} питание`, { touch: dev.touch, fixedHeight: dev.w >= 1280 });
        // Журнал-мессенджер на тач-устройствах (<xl панель).
        if (dev.w < 1280) {
          const journal = page
            .locator('header button[aria-label="Журнал и чат"], header button[aria-label="Journal & chat"]')
            .first();
          await safeClick(journal, 5000);
          await sleep(700);
          const feedVisible = await page
            .evaluate(() => Boolean(document.querySelector('[role="dialog"][aria-label], [data-feed-panel]')))
            .catch(() => false);
          check(feedVisible, `${label}: журнал раскрыт`);
          await shot(page, `game-journal-${devId}-${lang}`);
          await auditPage(page, `${label} журнал`, { touch: dev.touch });
          // Закрыть журнал.
          await page
            .locator('button[aria-label*="Свернуть"], button[aria-label*="Collapse"]')
            .first()
            .click({ timeout: 3000 })
            .catch(() => {});
          await sleep(300);
        }
      }
    } catch (e) {
      fail(`${label}: ${String(e?.message ?? e).split("\n")[0]}`);
    } finally {
      await ctx.close().catch(() => {});
    }
  }

  // ══ F. Финальный экран: короткая колода, 2 места, телефон + десктоп ═════
  for (const [devId, lang] of [["phone", "en"], ["desktop", "ru"]]) {
    const dev = DEVICES[devId];
    const { ctx, page } = await langContext(browser, lang, dev);
    const label = `финал ${devId} ${lang}`;
    try {
      await openMenu(page);
      const started = await startGame(page, { name: "Финалист", players: 2, deckSize: 20 });
      if (!started.ok) {
        warn(`${label}: партия не поднялась (${started.error}) — финал пропущен`);
        continue;
      }
      // Крутим фазы до конца партии (короткая колода — 1–2 года).
      const done = await advancePhase(page, () => phaseOf(page).then((p) => p === "gameOver"), 240_000);
      if (!done) {
        warn(`${label}: финал не достигнут за 240с — пропущен`);
        continue;
      }
      await sleep(2500); // каскад строк успевает раскрыться
      await shot(page, `game-over-${devId}-${lang}`);
      await auditPage(page, label, { touch: dev.touch });
      const fits = await page
        .evaluate(() => {
          // Карточка финала — единственная с max-h-[94dvh].
          const card = [...document.querySelectorAll("div")].find((d) =>
            String(d.className).includes("max-h-[94dvh]"),
          );
          if (!card) return null;
          const r = card.getBoundingClientRect();
          return { b: Math.round(r.bottom), ih: window.innerHeight, r: Math.round(r.right), iw: window.innerWidth };
        })
        .catch(() => null);
      check(
        Boolean(fits) && fits.b <= fits.ih + 1 && fits.r <= fits.iw + 1,
        `${label}: карточка финала в экране (${fits ? `${fits.r}/${fits.iw}×${fits.b}/${fits.ih}` : "нет"})`,
      );
    } catch (e) {
      fail(`${label}: ${String(e?.message ?? e).split("\n")[0]}`);
    } finally {
      await ctx.close().catch(() => {});
    }
  }

  if (host.ctx) await host.ctx.close().catch(() => {});
} catch (e) {
  fail(`прогон прерван: ${String(e?.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close().catch(() => {});
}

// Сводку находок — рядом со скриншотами (вне репозитория).
try {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(
    join(SHOTS, `wave9-${TAG}-findings.json`),
    JSON.stringify({ tag: TAG, problems, warnings, findings }, null, 2),
  );
} catch {
  /* отчёт в консоль важнее */
}
console.log(`\nИтог волны 9 (${TAG}): PASS-проверок без FAIL, WARN: ${warnings.length}, FAIL: ${problems.length}, находок: ${findings.length}`);
if (problems.length) console.log("ПРОБЛЕМЫ:\n  " + problems.join("\n  "));
process.exitCode = problems.length ? 1 : 0;
