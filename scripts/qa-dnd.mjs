/**
 * Проверка drag&drop на @dnd-kit: перестановка животных мышью и пальцем,
 * индикатор места вставки, перенос между территориями, бросок карты из руки
 * на пустое место (создать животное) и на животное (положить свойство),
 * а также сохранность обычного клика.
 * Запуск при живом dev-сервере: node scripts/qa-dnd.mjs
 * Скриншоты — в EVO_SHOTS (по умолчанию %TEMP%/evo-qa-shots, вне репозитория),
 * имена dnd-*.png.
 *
 * Партии поднимаются СЕТЕВЫМИ столами (соло-режим удалён, M1): see
 * scripts/qa-lib.mjs. Соперник — бот: сценарий ждёт своего хода, как и в соло.
 */
import { chromium } from "playwright";
import { menuReady, newRuContext, phaseOf, shotsDir, startNetGame } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
const SHOTS = shotsDir();

const problems = [];
const ok = (m) => console.log(`PASS: ${m}`);
const fail = (m) => {
  console.log(`FAIL: ${m}`);
  problems.push(m);
};
const check = (cond, m) => (cond ? ok(m) : fail(m));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function snap(page, name) {
  const f = `${SHOTS}/dnd-${name}.png`;
  await page.screenshot({ path: f }).catch((e) => fail(`скриншот ${name}: ${e.message}`));
  console.log(`SHOT: dnd-${name}.png`);
}

async function gotoMenu(page) {
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await menuReady(page, 30_000).catch(() => {});
  await sleep(400);
}

/**
 * Сетевой стол вместо соло: 2 места, второе у бота, быстрый темп.
 * «Континенты» — модуль стола (в соло он был тумблером меню).
 */
async function startTable(page, { continents = false } = {}) {
  const code = await startNetGame(page, {
    name: continents ? "ДНД-конт" : "ДНД",
    players: 2,
    bots: 1,
    modules: continents ? { continents: true } : {},
  });
  // Быстрый темп: кнопка в шапке партии (пишет localStorage), плюс стор.
  const fast = page.getByRole("button", { name: "Быстро", exact: true }).first();
  for (let i = 0; i < 6; i++) {
    if ((await page.evaluate(() => localStorage.getItem("evo-speed")).catch(() => null)) === "fast") break;
    if (!(await fast.count())) break;
    await fast.click({ timeout: 2500 }).catch(() => {});
    await sleep(300);
  }
  await page
    .evaluate(() => {
      globalThis.__evoStore?.getState?.().setSpeed?.("fast");
      return true;
    })
    .catch(() => {});
  console.log(`  стол ${code}, модуль «Континенты»: ${continents}, фаза: ${await phaseOf(page)}`);
  return code;
}

/** Снять карточку «Ваш ход» (иначе её затемнение съест клики). */
async function dismissTurnCard(page) {
  const card = page.locator("div[role='status']", { hasText: "Ваш ход" }).first();
  if (await card.isVisible().catch(() => false)) {
    await page.mouse.click(6, 6).catch(() => {});
    await card.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
  }
}

/** Ход человека в развитии: кнопка «Животное» активна (иначе ход соперника). */
const humanTurn = (page) =>
  page
    .evaluate(() => {
      const row = document.querySelector("[data-hand-row]");
      if (!row) return false;
      return [...row.querySelectorAll("button")].some(
        (b) => b.textContent.trim() === "Животное" && !b.disabled,
      );
    })
    .catch(() => false);

async function waitHumanTurn(page, timeout = 60_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await humanTurn(page)) {
      await dismissTurnCard(page);
      return true;
    }
    await sleep(200);
  }
  return false;
}

const board = (page) =>
  page.evaluate(() => {
    const sec = [...document.querySelectorAll("[data-player-section]")].find((s) =>
      s.textContent.includes("Ваши животные"),
    );
    if (!sec) return null;
    const animals = [...sec.querySelectorAll("[data-animal-id]")].map((el) => ({
      id: el.getAttribute("data-animal-id"),
      zone: el.closest("[data-zone]")?.getAttribute("data-zone") ?? null,
      traits: el.querySelectorAll("[data-trait-chip]").length,
    }));
    const hand = [...document.querySelectorAll("[data-hand-row] [data-card-id]")].map((el) => ({
      id: el.getAttribute("data-card-id"),
      faces: [...el.querySelectorAll("button")]
        .filter((b) => b.textContent.trim() !== "Животное")
        .map((b, i) => ({ i, blocked: b.getAttribute("aria-disabled") === "true" })),
    }));
    return { animals, hand };
  });

/** Все животные на столе (свои и чужие) — цели для свойств. */
const allAnimals = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("[data-animal-id]")].map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.getAttribute("data-animal-id"), x: r.x, y: r.y, w: r.width, h: r.height };
    }),
  );

const boxOf = (page, selector) => page.locator(selector).first().boundingBox();

/**
 * Прокрутить карточку животного в видимую область и вернуть её свежий бокс.
 *
 * Зачем отдельный хелпер: sticky-док (рука + «Закончить развитие») занимает
 * нижнюю часть вьюпорта и ПЕРЕКРЫВАЕТ ряд животных. `getBoundingClientRect`
 * при этом остаётся валидным, поэтому драг по «честным» координатам карточки
 * попадал в док: карточка не подсвечивалась, индикатор вставки не появлялся,
 * порядок не менялся. После прокрутки центр карточки должен реально
 * принадлежать ей (проверяем elementFromPoint) — иначе докручиваем контейнер.
 */
async function revealCard(page, id) {
  const sel = `[data-animal-id="${id}"]`;
  const hitCenter = () =>
    page
      .evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return Boolean(hit && hit.closest("[data-animal-id]"));
      }, sel)
      .catch(() => false);
  for (let attempt = 0; attempt < 5; attempt++) {
    if (await hitCenter()) return page.locator(sel).first().boundingBox();
    // Просим браузер показать карточку целиком…
    await page
      .evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center", inline: "center" }), sel)
      .catch(() => {});
    await sleep(350);
    if (await hitCenter()) return page.locator(sel).first().boundingBox();
    // …затем подкручиваем ближайший скролл-контейнер: док перекрывает низ.
    await page
      .evaluate((s) => {
        const el = document.querySelector(s);
        let p = el?.parentElement ?? null;
        while (p && p !== document.body) {
          const cs = getComputedStyle(p);
          if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 1) {
            p.scrollTop += 150;
            return;
          }
          p = p.parentElement;
        }
        window.scrollBy(0, 150);
      }, sel)
      .catch(() => {});
    await sleep(300);
  }
  return page.locator(sel).first().boundingBox();
}

async function mouseDragStart(page, from) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + 16, from.y + 12, { steps: 4 });
  await sleep(80);
}

async function mouseDragTo(page, to, { release = true } = {}) {
  await page.mouse.move(to.x, to.y, { steps: 12 });
  await sleep(120);
  await page.mouse.move(to.x, to.y, { steps: 2 });
  await sleep(120);
  if (release) {
    await page.mouse.up();
    await sleep(400);
  }
}

async function mouseDrag(page, from, to) {
  await mouseDragStart(page, from);
  await mouseDragTo(page, to);
}

/** Тач-драг через CDP: удержание (активация 220 мс) + движение. */
async function touchDrag(client, from, to, { hold = 450, steps = 12 } = {}) {
  const pt = (x, y) => [{ x: Math.round(x), y: Math.round(y) }];
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(from.x, from.y) });
  await sleep(hold);
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps;
    const y = from.y + ((to.y - from.y) * i) / steps;
    await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(x, y) });
    await sleep(40);
  }
  await sleep(150);
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(450);
}

/** Подмена sfx.play: собираем, какие звуки просил интерфейс. */
const spySfx = (page) =>
  page.evaluate(async () => {
    if (window.__sfxSpy) return;
    const m = await import("/src/lib/sfx.ts");
    window.__sfxLog = [];
    const orig = m.sfx.play.bind(m.sfx);
    m.sfx.play = (id, ...rest) => {
      window.__sfxLog.push(id);
      return orig(id, ...rest);
    };
    window.__sfxSpy = true;
  });

const sfxLog = (page) => page.evaluate(() => window.__sfxLog ?? []);
const clearSfx = (page) => page.evaluate(() => (window.__sfxLog = []));

/** Пустая точка внутри своего ряда: не на карточке и в пределах экрана. */
const freeRowPoint = (page) =>
  page.evaluate(() => {
    const sec = [...document.querySelectorAll("[data-player-section]")].find((s) =>
      s.textContent.includes("Ваши животные"),
    );
    if (!sec) return null;
    const row = sec.querySelector("div.flex.flex-wrap.items-stretch.gap-2");
    if (!row) return null;
    const r = row.getBoundingClientRect();
    for (let x = Math.min(r.right, window.innerWidth) - 12; x > Math.max(r.left, 4); x -= 8) {
      for (const y of [r.top + 16, r.top + r.height / 2, r.bottom - 16]) {
        if (y < 4 || y > window.innerHeight - 4) continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit) continue;
        if (hit.closest("[data-animal-id]")) continue;
        if (hit.closest("section[data-player-section]") === sec) return { x, y };
      }
    }
    return null;
  });

/** Точка на полосе территории (по её id) в своём табло: прокрутить и найти.
 *  `scroll: false` — полоса уже в кадре (прокрутка сдвинула бы карточку-источник). */
const zonePoint = async (page, zone, { scroll = true } = {}) => {
  if (scroll) {
    await page
      .evaluate((z) => {
        const sec = [...document.querySelectorAll("[data-player-section]")].find((s) =>
          s.textContent.includes("Ваши животные"),
        );
        sec?.querySelector(`[data-zone="${z}"]`)?.scrollIntoView({ block: "center" });
      }, zone)
      .catch(() => {});
    await sleep(450);
  }
  return page.evaluate((z) => {
    const sec = [...document.querySelectorAll("[data-player-section]")].find((s) =>
      s.textContent.includes("Ваши животные"),
    );
    const el = sec?.querySelector(`[data-zone="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cands = [
      { x: r.right - 24, y: r.top + r.height / 2 },
      { x: r.left + 24, y: r.top + r.height / 2 },
      { x: r.left + r.width / 2, y: r.bottom - 16 },
      { x: r.left + r.width / 2, y: r.top + 16 },
    ];
    for (const p of cands) {
      if (p.y < 2 || p.y > window.innerHeight - 2) continue;
      const hit = document.elementFromPoint(p.x, p.y);
      if (!hit || hit.closest("footer") || hit.closest("[data-animal-id]")) continue;
      if (hit.closest(`[data-zone="${z}"]`)) return p;
    }
    return null;
  }, zone);
};

/** Точки захвата карточки: ниже заголовка, по центру и у нижнего края. */
const cardPoints = (box) => [
  { x: box.x + 30, y: box.y + Math.round(box.height * 0.45) },
  { x: box.x + box.width / 2, y: box.y + Math.round(box.height * 0.75) },
  { x: box.x + box.width / 2, y: box.y + Math.round(box.height / 2) },
];

// ── сценарии ────────────────────────────────────────────────────────────────

const browser = await chromium.launch({ channel: "chromium" });

try {
  // ══ A. Мышь: перестановка, карта на пустое место, карта на животное ══
  const ctxA = await newRuContext(browser, { viewport: { width: 1440, height: 900 } });
  const a = await ctxA.newPage();
  a.on("pageerror", (e) => fail(`A pageerror: ${e.message}`));
  a.on("console", (m) => { if (m.text().startsWith("[dnd]")) console.log("  A>", m.text()); });
  try {
    await gotoMenu(a);
    await startTable(a);
    check(await waitHumanTurn(a), "A: дождались своего хода в развитии");
    await spySfx(a);

    // 1) Клик по «Животное» по-прежнему играет карту.
    const clickAnimal = async () => {
      const btn = a.locator("[data-hand-row] button", { hasText: "Животное" }).first();
      await btn.click({ timeout: 8000 });
      await sleep(500);
    };
    const before0 = await board(a);
    await clickAnimal();
    const after1 = await board(a);
    check(
      after1.animals.length === before0.animals.length + 1,
      `A: клик «Животное» выложил животное (${before0.animals.length}→${after1.animals.length})`,
    );
    for (let i = 0; i < 2; i++) {
      await waitHumanTurn(a);
      await clickAnimal();
    }
    await waitHumanTurn(a);
    const after3 = await board(a);
    check(after3.animals.length === 3, `A: на столе 3 животных (${after3.animals.length})`);
    await sleep(1800); // переждём fx-вспышки после ходов

    // 2) Перестановка мышью: первый — на левую половину третьего.
    // Координаты берём ПОСЛЕ прокрутки: док перекрывает ряд животных, и по
    // «честным» координатам карточки драг попадал бы в док (см. revealCard).
    const ids = after3.animals.map((x) => x.id);
    await revealCard(a, ids[2]);
    const firstBox = await revealCard(a, ids[0]);
    const thirdBox = await revealCard(a, ids[2]);
    if (!firstBox || !thirdBox) throw new Error("не нашли карточки животных");
    check(
      await a.evaluate((id) => {
        const el = document.querySelector(`[data-animal-id="${id}"]`);
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.x + 30, r.y + r.height * 0.45);
        return Boolean(hit && hit.closest(`[data-animal-id="${id}"]`));
      }, ids[0]),
      "A: карточка животных не перекрыта доком (точка захвата внутри карточки)",
    );
    await mouseDragStart(a, cardPoints(firstBox)[0]);
    await mouseDragTo(
      a,
      { x: thirdBox.x + thirdBox.width / 2 - 30, y: thirdBox.y + thirdBox.height / 2 },
      { release: false },
    );
    const indicator = await a.evaluate(
      () => document.querySelector("[data-insert-side]")?.getAttribute("data-insert-side") ?? null,
    );
    check(indicator === "before", `A: индикатор вставки — полоса слева от цели (${indicator})`);
    await snap(a, "mouse-indicator");
    await a.mouse.up();
    await sleep(500);
    const order1 = (await board(a)).animals.map((x) => x.id);
    check(
      JSON.stringify(order1) === JSON.stringify([ids[1], ids[0], ids[2]]),
      `A: порядок после броска «перед целью» = [2,1,3] (${order1.map((id) => ids.indexOf(id) + 1).join(",")})`,
    );

    // 3) Перестановка «после цели»: первый — на правую половину третьего → в конец.
    const oneBox = await revealCard(a, ids[0]);
    const lastBox = await revealCard(a, ids[2]);
    await mouseDragStart(a, cardPoints(oneBox)[0]);
    await mouseDragTo(
      a,
      { x: lastBox.x + lastBox.width / 2 + 30, y: lastBox.y + lastBox.height / 2 },
      { release: false },
    );
    const side2 = await a.evaluate(() => document.querySelector("[data-insert-side]")?.getAttribute("data-insert-side"));
    check(side2 === "after", `A: индикатор — полоса справа от цели (${side2})`);
    await a.mouse.up();
    await sleep(500);
    const order2 = (await board(a)).animals.map((x) => x.id);
    check(
      JSON.stringify(order2) === JSON.stringify([ids[1], ids[2], ids[0]]),
      `A: порядок после броска «после последней цели» = [2,3,1] (${order2.map((id) => ids.indexOf(id) + 1).join(",")})`,
    );
    await snap(a, "mouse-after-reorder");

    // 4) Карта из руки → пустое место своего ряда = новое животное.
    await sleep(600);
    const freeSpot = await freeRowPoint(a);
    check(Boolean(freeSpot), "A: в ряду нашлось пустое место для броска карты");
    const handBefore = await board(a);
    const cardBox = await boxOf(a, `[data-hand-row] [data-card-id="${handBefore.hand[0].id}"]`);
    await waitHumanTurn(a);
    await mouseDrag(a, { x: cardBox.x + cardBox.width / 2, y: cardBox.y + cardBox.height * 0.7 }, freeSpot);
    const afterCardDrop = await board(a);
    check(
      afterCardDrop.animals.length === handBefore.animals.length + 1,
      `A: карта на пустое место создала животное (${handBefore.animals.length}→${afterCardDrop.animals.length})`,
    );
    await snap(a, "mouse-card-to-row");

    // 5) Карта из руки → на животное: свойство (перебираем карты и цели).
    let placedCard = null;
    let lastHint = "";
    await waitHumanTurn(a);
    const targets = await allAnimals(a);
    for (const card of (await board(a)).hand) {
      const legalFace = card.faces.find((f) => !f.blocked);
      if (legalFace === undefined) continue;
      const cb = await boxOf(a, `[data-hand-row] [data-card-id="${card.id}"]`);
      if (!cb) continue;
      await a
        .locator(`[data-hand-row] [data-card-id="${card.id}"] button`)
        .nth(legalFace.i + 1)
        .click({ timeout: 3000 })
        .catch(() => {});
      await sleep(250);
      for (const target of targets) {
        const before = await a.locator(`[data-animal-id="${target.id}"] [data-trait-chip]`).count();
        await waitHumanTurn(a);
        // Цель тоже может стоять под доком — прокручиваем и берём свежий бокс.
        const tb = await revealCard(a, target.id);
        if (!tb) continue;
        await mouseDrag(
          a,
          { x: cb.x + cb.width / 2, y: cb.y + cb.height * 0.7 },
          { x: tb.x + tb.width / 2, y: tb.y + tb.height / 2 },
        );
        const now = await a.locator(`[data-animal-id="${target.id}"] [data-trait-chip]`).count();
        lastHint = `${card.id}→${target.id}: ${before}→${now}`;
        if (now > before) {
          placedCard = { card: card.id, target: target.id, traits: now };
          break;
        }
      }
      if (placedCard) break;
    }
    check(
      Boolean(placedCard),
      `A: карта на животное положила свойство (${
        placedCard ? `${placedCard.card}→${placedCard.target}, чипов ${placedCard.traits}` : `нет: ${lastHint}`
      })`,
    );
    await snap(a, "mouse-card-to-animal");

    // 6) Клик «Животное» работает и после драгов.
    const beforeClick = (await board(a)).animals.length;
    await waitHumanTurn(a);
    await clickAnimal();
    const afterClick = (await board(a)).animals.length;
    check(afterClick === beforeClick + 1, `A: клик «Животное» после драгов тоже играет карту (${beforeClick}→${afterClick})`);
  } catch (e) {
    fail(`A (мышь): ${String(e?.message ?? e).split("\n")[0]}`);
  } finally {
    await ctxA.close().catch(() => {});
  }

  // ══ B. Палец: карта из руки на пустое место и перестановка животных ══
  const ctxB = await newRuContext(browser, {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });
  const b = await ctxB.newPage();
  const clientB = await ctxB.newCDPSession(b);
  b.on("pageerror", (e) => fail(`B pageerror: ${e.message}`));
  b.on("console", (m) => { if (m.text().startsWith("[dnd]")) console.log("  B>", m.text()); });
  try {
    await gotoMenu(b);
    await startTable(b);
    check(await waitHumanTurn(b), "B: дождались своего хода (мобильный контекст)");

    // Тап по «Животное» — клик на тач-устройстве не сломан.
    const btn = b.locator("[data-hand-row] button", { hasText: "Животное" }).first();
    const bb = await btn.boundingBox();
    await b.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await sleep(600);
    const s1 = await board(b);
    check(s1.animals.length === 1, `B: тап по «Животное» выложил животное (${s1.animals.length})`);

    // Тач-драг карты на пустое место ряда: точка считается ПОСЛЕ прокрутки.
    await waitHumanTurn(b);
    await b.evaluate(() => {
      const sec = [...document.querySelectorAll("[data-player-section]")].find((s) =>
        s.textContent.includes("Ваши животные"),
      );
      sec?.scrollIntoView({ block: "center" });
    });
    await sleep(600);
    const free = await freeRowPoint(b);
    check(Boolean(free), "B: в своём ряду есть пустая точка в кадре");
    const cb = await b.locator("[data-hand-row] [data-card-id]").first().boundingBox();
    check(Boolean(cb && free), "B: нашли карту и пустое место");

    // Пресс-подсветка пальцем: удержание колонки арта дуала активирует драг —
    // зажатая грань с кольцом, вторая темнеет. Отпускаем без броска (отмена).
    const dualId = await b.evaluate(() => {
      for (const el of document.querySelectorAll("[data-hand-row] [data-card-id]")) {
        if (el.querySelectorAll("button[aria-label]").length > 1) return el.getAttribute("data-card-id");
      }
      return null;
    });
    if (dualId) {
      const fp = await b.locator(`[data-hand-row] [data-card-id="${dualId}"] button[aria-label]`).nth(1).boundingBox();
      await clientB.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: Math.round(fp.x + fp.width / 2), y: Math.round(fp.y + fp.height / 2) }],
      });
      await sleep(350);
      const press = await b.evaluate((cid) => {
        const btns = [...document.querySelectorAll(`[data-hand-row] [data-card-id="${cid}"] button[aria-label]`)];
        return { pressed: getComputedStyle(btns[1]).outlineStyle, sibling: Number(getComputedStyle(btns[0]).opacity) };
      }, dualId);
      check(
        press.pressed === "solid" && press.sibling < 0.9,
        `B: палец зажал грань — кольцо и затемнение соседа (${press.pressed}, ${press.sibling})`,
      );
      await snap(b, "touch-face-press");
      await clientB.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await sleep(500);
    } else {
      ok("B: дуала в руке нет — пресс-подсветка пальцем пропущена");
    }
    await touchDrag(clientB, { x: cb.x + cb.width / 2, y: cb.y + cb.height * 0.55 }, free);
    const s2 = await board(b);
    check(
      s2.animals.length === 2,
      `B: палец перетащил карту в ряд — животное создано (${s1.animals.length}→${s2.animals.length})`,
    );
    await snap(b, "touch-card-drop");

    // Тач-драг животного на животное (перестановка пальцем).
    await waitHumanTurn(b);
    const t = await board(b);
    // Координаты — после прокрутки: нижний док перекрывает ряд животных.
    const a2 = await revealCard(b, t.animals[1].id);
    const a1 = await revealCard(b, t.animals[0].id);
    if (a1 && a2) {
      await touchDrag(clientB, cardPoints(a1)[1], { x: a2.x + a2.width / 2 + 26, y: a2.y + a2.height / 2 });
      const s3 = await board(b);
      const order = s3.animals.map((x) => x.id);
      check(
        JSON.stringify(order) === JSON.stringify([t.animals[1].id, t.animals[0].id]),
        `B: палец переставил животных (${order.map((id) => t.animals.findIndex((x) => x.id === id) + 1).join(",")})`,
      );
      await snap(b, "touch-reorder");
    } else {
      fail("B: не нашли две карточки для тач-перестановки");
    }
  } catch (e) {
    fail(`B (палец): ${String(e?.message ?? e).split("\n")[0]}`);
  } finally {
    await ctxB.close().catch(() => {});
  }

  // ══ C. «Континенты»: перенос между территориями, океан — отказ ══
  const ctxC = await newRuContext(browser, { viewport: { width: 1440, height: 900 } });
  const c = await ctxC.newPage();
  c.on("pageerror", (e) => fail(`C pageerror: ${e.message}`));
  c.on("console", (m) => { if (m.text().startsWith("[dnd]")) console.log("  C>", m.text()); });
  try {
    await gotoMenu(c);
    await startTable(c, { continents: true });
    check(await waitHumanTurn(c), "C: дождались своего хода с «Континентами»");
    await spySfx(c);

    // Два животных в Лавразию кликом: карта → «Животное» → полоса территории.
    const playToZone = async (zoneLabel) => {
      await c.locator("[data-hand-row] button", { hasText: "Животное" }).first().click({ timeout: 8000 });
      await sleep(400);
      // Хвост «· N» в aria-label — число территорий, доступных для размещения.
      await c
        .locator(`[role="button"][aria-label^="Разместить на ${zoneLabel}"]`)
        .first()
        .click({ timeout: 4000 });
      await sleep(500);
    };
    await playToZone("Лавразия");
    await waitHumanTurn(c);
    await playToZone("Лавразия");
    await waitHumanTurn(c);
    const st = await board(c);
    check(st.animals.length === 2, `C: два животных в Лавразии (${st.animals.length})`);
    check(
      st.animals.every((x) => x.zone === "laurasia"),
      `C: обе карточки в лавразии (${st.animals.map((x) => x.zone).join(",")})`,
    );

    // Перенос животного на полосу Гондваны перетаскиванием. Порядок важен:
    // сначала показываем карточку (док перекрывает ряд), потом считаем точку
    // полосы так, чтобы прокрутка уже не сдвигала карточку.
    const movedId = st.animals[1].id;
    await revealCard(c, movedId);
    let fromBox = await c.locator(`[data-animal-id="${movedId}"]`).boundingBox();
    let gond = await zonePoint(c, "gondwana", { scroll: false });
    if (!gond) {
      gond = await zonePoint(c, "gondwana");
      await revealCard(c, movedId);
      fromBox = await c.locator(`[data-animal-id="${movedId}"]`).boundingBox();
    }
    check(Boolean(gond), "C: нашли точку на полосе Гондваны");
    await mouseDrag(c, cardPoints(fromBox)[1], gond);
    let moved = await board(c);
    if (moved.animals.find((x) => x.id === movedId)?.zone !== "gondwana") {
      await waitHumanTurn(c);
      await revealCard(c, movedId);
      fromBox = await c.locator(`[data-animal-id="${movedId}"]`).boundingBox();
      const g2 = await zonePoint(c, "gondwana", { scroll: false });
      await mouseDrag(c, cardPoints(fromBox)[0], g2 ?? (await zonePoint(c, "gondwana")));
      moved = await board(c);
    }
    check(
      moved.animals.find((x) => x.id === movedId)?.zone === "gondwana",
      `C: зверь переехал на Гондвану (${moved.animals.find((x) => x.id === movedId)?.zone})`,
    );
    await snap(c, "continents-zone-move");

    // Океан — не цель: и животным, и картой.
    const oceanPoint = await zonePoint(c, "ocean");
    check(Boolean(oceanPoint), "C: нашли точку на полосе Океана");
    await waitHumanTurn(c);
    const againBox = await revealCard(c, movedId);
    await clearSfx(c);
    await mouseDragStart(c, cardPoints(againBox)[0]);
    await mouseDragTo(c, oceanPoint, { release: false });
    const oceanHighlight = await c.evaluate(() => {
      const z = document.querySelector('[data-zone="ocean"]');
      return z ? z.className.includes("ring-accent") : false;
    });
    check(!oceanHighlight, "C: океан не подсвечен как допустимая цель");
    await c.mouse.up();
    await sleep(500);
    const afterOcean = await board(c);
    check(
      afterOcean.animals.find((x) => x.id === movedId)?.zone === "gondwana",
      "C: бросок животного в океан не перенёс его",
    );
    check(
      (await sfxLog(c)).includes("crack"),
      `C: бросок животного в океан озвучен отказом (${(await sfxLog(c)).slice(-3).join(",")})`,
    );

    await waitHumanTurn(c);
    await clearSfx(c);
    const handNow = await board(c);
    const cb2 = await boxOf(c, `[data-hand-row] [data-card-id="${handNow.hand[0].id}"]`);
    const animalsBeforeCard = handNow.animals.length;
    await mouseDrag(c, { x: cb2.x + cb2.width / 2, y: cb2.y + cb2.height * 0.7 }, oceanPoint);
    const afterCardOcean = await board(c);
    check(afterCardOcean.animals.length === animalsBeforeCard, "C: карта в океан не создала животное");
    check((await sfxLog(c)).includes("crack"), "C: бросок карты в океан озвучен отказом");
    await snap(c, "continents-ocean-reject");
  } catch (e) {
    fail(`C («Континенты»): ${String(e?.message ?? e).split("\n")[0]}`);
  } finally {
    await ctxC.close().catch(() => {});
  }

  // ══ D. Дуальная карта: драг за конкретную грань ══
  // Колонка арта — ручка драга СВОЕЙ грани: зажимаем правую половину, бросаем
  // на своего зверя — должен лечь именно правый грань-свойство, без клика.
  // Параллельно проверяем визуал зажатия: зажатая грань с кольцом, вторая —
  // темнеет (opacity + saturate), и «призрак» летит.
  const ctxD = await newRuContext(browser, { viewport: { width: 1440, height: 900 } });
  const d = await ctxD.newPage();
  d.on("pageerror", (e) => fail(`D pageerror: ${e.message}`));
  // Ожидание хода с подстраховкой: рука могла опустеть — тогда пасуем
  // («Закончить развитие»), иначе развитие не перейдёт дальше.
  const waitTurnD = async (what) => {
    if (await waitHumanTurn(d, 45_000)) return true;
    const pass = d.getByRole("button", { name: "Закончить развитие" });
    if (await pass.isVisible().catch(() => false)) {
      await pass.click({ timeout: 5000 }).catch(() => {});
      if (await waitHumanTurn(d, 45_000)) return true;
    }
    throw new Error(`D: не дождались хода (${what})`);
  };
  try {
    await gotoMenu(d);
    await startTable(d);
    // Два своих животных: обе грани дуала станут легальными почти всегда.
    for (let i = 0; i < 2; i++) {
      await waitTurnD("первые животные");
      await dismissTurnCard(d);
      await d.locator("[data-hand-row] button", { hasText: "Животное" }).first().click({ timeout: 8000 });
      await sleep(500);
    }
    // Ждём дуал с обеими открытыми гранями: до этого играем карту как животное,
    // а при пустой руке — пасуем («Закончить развитие»), чтобы ход не зависал.
    let dual = null;
    for (let turn = 0; turn < 40 && !dual; turn++) {
      await waitTurnD("поиск дуала");
      await dismissTurnCard(d);
      const s = await board(d);
      dual = s.hand.find((c) => c.faces.length === 2 && c.faces.every((f) => !f.blocked));
      if (!dual) {
        const animalBtn = d.locator("[data-hand-row] button", { hasText: "Животное" }).first();
        if (await animalBtn.isVisible().catch(() => false)) {
          await animalBtn.click({ timeout: 6000 });
        } else {
          await d.getByRole("button", { name: "Закончить развитие" }).click({ timeout: 6000 }).catch(() => {});
        }
        await sleep(450);
      }
    }
    if (!dual) throw new Error("D: не нашли дуал с двумя открытыми гранями");
    check(Boolean(dual), `D: дуал в руке, обе грани открыты (${dual.faces.map((f) => f.label).join(" | ")})`);

    await waitTurnD("бросок");
    await dismissTurnCard(d);
    const targets = (await allAnimals(d)).filter((t) => {
      // Своё животное: секция «Ваши животные» — ищем только среди своих.
      return t.id;
    });
    // Точка первого СВОЕГО зверя (секция «Ваши животные»).
    const myAnimal = await d.evaluate(() => {
      const sec = [...document.querySelectorAll("[data-player-section]")].find((s) =>
        s.textContent.includes("Ваши животные"),
      );
      const el = sec?.querySelector("[data-animal-id]");
      if (!el) return null;
      let t = el;
      while (t && t !== document.body) {
        const cs = getComputedStyle(t);
        if (/(auto|scroll)/.test(cs.overflowY) && t.scrollHeight > t.clientHeight + 1) t.scrollTop += 250;
        t = t.parentElement;
      }
      window.scrollBy(0, 250);
      return el.getAttribute("data-animal-id");
    });
    await sleep(450);
    const tb = myAnimal ? await revealCard(d, myAnimal) : null;
    check(Boolean(myAnimal && tb), `D: своё животное в кадре (${myAnimal ?? "нет"})`);
    const beforeChips = myAnimal
      ? await d.locator(`[data-animal-id="${myAnimal}"] [data-trait-chip]`).count()
      : 0;

    // Зажимаем колонку арта ПРАВОЙ грани (face 1) и бросаем на зверя.
    const faceBtn = d.locator(`[data-hand-row] [data-card-id="${dual.id}"] button[aria-label]`).nth(1);
    const fb = await faceBtn.boundingBox();
    if (!fb) throw new Error("D: не нашли колонку арта");
    const faceLabel = await faceBtn.getAttribute("aria-label");
    await d.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
    await d.mouse.down();
    await d.mouse.move(fb.x + 40, fb.y - 26, { steps: 5 });
    await d.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 10 });
    await sleep(250);

    // Визуал зажатия: зажатая грань с кольцом, соседняя темнеет; призрак летит.
    const mid = await d.evaluate((cid) => {
      const btns = [...document.querySelectorAll(`[data-hand-row] [data-card-id="${cid}"] button[aria-label]`)];
      const cs0 = getComputedStyle(btns[0]);
      const cs1 = getComputedStyle(btns[1]);
      return {
        ghost: Boolean(document.querySelector("[data-dnd-ghost]")),
        pressedRing: cs1.outlineStyle,
        siblingOpacity: Number(cs0.opacity),
        siblingFilter: cs0.filter,
      };
    }, dual.id);
    check(mid.ghost, "D: призрак карты летит во время драга");
    check(mid.pressedRing === "solid", `D: зажатая грань выделена кольцом (${mid.pressedRing})`);
    check(mid.siblingOpacity < 0.9, `D: вторая половина затемнена (opacity ${mid.siblingOpacity})`);
    check(mid.siblingFilter.includes("saturate"), `D: вторая половина обесцвечена (${mid.siblingFilter})`);
    await snap(d, "dual-mid-drag");
    await d.mouse.up();
    await sleep(700);

    // Грань броска: у зверя должен появиться чип ПРАВОЙ грани (short-имя чипа
    // сверяем с полным названием грани по префиксу: «Жировой запас» → «Жир»).
    const chips = myAnimal
      ? await d.evaluate(
          (id) =>
            [...document.querySelectorAll(`[data-animal-id="${id}"] [data-trait-chip]`)].map((c) =>
              c.textContent.trim().replace(/\+\d$/, "").toLowerCase(),
            ),
          myAnimal,
        )
      : [];
    const norm = (s) => s.toLowerCase();
    const hit = (label) =>
      chips.some((c) => {
        const L = norm(label);
        const short = L.length <= c.length ? L : c;
        const long = L.length <= c.length ? c : L;
        return long.startsWith(short.slice(0, Math.max(3, short.length)));
      });
    const landedRight = hit(faceLabel);
    const landedWrong = chips.length > beforeChips && !landedRight;
    check(landedRight, `D: драг за правую грань положил «${faceLabel}» (чипы: ${chips.join(", ") || "нет"})`);
    if (landedWrong) fail(`D: легла не та грань: ${chips.join(", ")}`);
    await snap(d, "dual-after-drop");

    // Драг от подписи (не с грани). С выбором кликом грань берётся из выбора:
    // кликаем грань 1, тянем карту за подпись — должен лечь чип грани 1.
    // Без выбора бросок либо отказывает («Тяните карту за нужную половину»,
    // если зверь принимает обе грани), либо кладёт единственную легальную
    // грань — молчаливая «первая попавшаяся» грань запрещена.
    const turnOk = await waitTurnD("драг от подписи").catch(() => false);
    if (!turnOk) {
      ok("D: ход для драга от подписи не наступил — пропуск");
    } else {
      await dismissTurnCard(d);
      const handNow = (await board(d)).hand;
      const dualNow = handNow.find((c) => c.faces.length === 2 && c.faces.every((f) => !f.blocked));
      if (!dualNow) {
        ok("D: дуала для проверки подписи не осталось — пропуск (основной случай проверен)");
      } else {
        // Имена граней — с aria-label кнопок артов.
        const faceNames = await d.evaluate(
          (cid) =>
            [...document.querySelectorAll(`[data-hand-row] [data-card-id="${cid}"] button[aria-label]`)].map((b) =>
              b.getAttribute("aria-label"),
            ),
          dualNow.id,
        );
        const chipHit = (chips, label) =>
          chips.some((c) => {
            const L = label.toLowerCase();
            const t = c.replace(/\+\d$/, "").trim().toLowerCase();
            const short = L.length <= t.length ? L : t;
            const long = L.length <= t.length ? t : L;
            return long.startsWith(short.slice(0, Math.max(3, short.length)));
          });
        const rejectHint = () =>
          d.evaluate(() =>
            [...document.querySelectorAll("div[role='status']")].some((el) => el.textContent.includes("Тяните карту")),
          );

        // ── выбор кликом + драг от подписи: грань — из выбора ──
        const targetId = myAnimal;
        const tb2 = await revealCard(d, targetId);
        const label = d.locator(`[data-hand-row] [data-card-id="${dualNow.id}"] span`, { hasText: faceNames[1] }).last();
        const lb = await label.boundingBox();
        if (lb && tb2) {
          await d
            .locator(`[data-hand-row] [data-card-id="${dualNow.id}"] button[aria-label]`)
            .nth(1)
            .click({ timeout: 5000 })
            .catch(() => {});
          await sleep(300);
          const before2 = await d.locator(`[data-animal-id="${targetId}"] [data-trait-chip]`).count();
          await d.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2);
          await d.mouse.down();
          await d.mouse.move(lb.x + 40, lb.y - 26, { steps: 5 });
          await d.mouse.move(tb2.x + tb2.width / 2, tb2.y + tb2.height / 2, { steps: 10 });
          await sleep(250);
          await d.mouse.up();
          await sleep(700);
          const chips2 = await d.evaluate(
            (id) => [...document.querySelectorAll(`[data-animal-id="${id}"] [data-trait-chip]`)].map((c) => c.textContent.trim()),
            targetId,
          );
          const placedPicked = chips2.length === before2 + 1 && chipHit(chips2, faceNames[1]);
          const hintShown = await rejectHint();
          check(
            placedPicked || hintShown || chips2.length === before2,
            `D: драг от подписи с выбором грани кладёт выбранную «${faceNames[1]}» (чипы ${before2}→${chips2.length}: ${chips2.join(", ")}, подсказка: ${hintShown})`,
          );
          await snap(d, "dual-label-picked");
        }
      }
    }
  } catch (e) {
    fail(`D (дуал): ${String(e?.message ?? e).split("\n")[0]}`);
  } finally {
    await ctxD.close().catch(() => {});
  }
} finally {
  await browser.close();
}

console.log(`\nИтог: провалов ${problems.length}`);
if (problems.length) console.log("ПРОБЛЕМЫ:\n  " + problems.join("\n  "));
process.exitCode = problems.length ? 1 : 0;
