/**
 * QA волны 6: темп переходов между фазами в сетевой игре («обрыв после
 * последнего хода фазы»). Живой dev-сервер, стол «человек + бот».
 *
 * Жалоба владельца: после последнего хода в фазе модальные карточки событий
 * (бросок кубика кормовой базы, вымирание и т.п.) не показываются или
 * срезаются, и следующий этап начинается резко, без паузы.
 *
 * Что проверяем (два сценария, две смены года):
 *   а) все карточки событий фазы проиграны: ожидаемые карточки считаем из
 *      событий, которые клиент получил (кадры состояния + пропущенные батчи),
 *      и сравниваем с реально показанными (DOM-зонд .spotlight-card);
 *   б) пауза между шагом, завершившим фазу, и первым шагом следующей:
 *      окно «бросок кубика → начало питания» и «конец питания → вымирание»
 *      должно покрывать длительность карточки (не мгновенно, не растянуто);
 *   в) нет визуального «скачка»: карточки не срезаются (живут ≥ 75% своей
 *      длительности до начала закрытия), карточка «Ваш ход» не появляется
 *      поверх показываемой модалки (сначала модалки — потом индикатор фазы).
 *
 * Сценарий: стол 2 места (человек + 1 бот), без дополнений. Человек в каждом
 * году сразу завершает развитие и питание («Закончить развитие» → «Закончить
 * питание» с подтверждением) — это его последние ходы фаз; бот доигрывает
 * фазы своими автошагами. Зонд в странице пишет кадры стора, приходы батчей,
 * показы спотлайтов и карточек «Ваш ход» с метками времени.
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave6-pacing.mjs
 * Скриншоты и дамп зонда — ТОЛЬКО вне репозитория (%TEMP%, EVO_SHOTS).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  SHOTS,
  bodyOf,
  openMenu,
  sleep,
  startNetGame,
  trackPage,
  waitUntil,
} from "./qa-lib.mjs";

const problems = [];
const warnings = [];
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

// ── параметры проверки ───────────────────────────────────────────────────────

/** Длительности показов spotlight.tsx (обычная скорость), мс. */
const INTENDED_MS = {
  "Кормовая база": 2900,
  "Добыча убита": 3000,
  "Быстрое — бросок кубика": 3400,
  "Отбросить хвост": 2800,
  Мимикрия: 2400,
  "Хищное растение": 2500,
  "Контратака растения": 2500,
  Паралич: 2300,
  Вымирание: 2700,
};
/** Карточка считается показанной полностью, если до закрытия прошло ≥ 75%. */
const FULL_SHARE = 0.75;
/** Пауза фазового перехода должна покрывать ≥ 75% длительности карточки. */
const WINDOW_SHARE = 0.75;

/** Ожидаемые карточки по событиям шага — зеркало buildItems (spotlight.tsx). */
function cardsOfEvents(events) {
  const titles = [];
  let deaths = 0;
  for (const e of events) {
    if (e.kind === "diceRoll") titles.push("Кормовая база");
    else if (e.kind === "preyKilled") titles.push("Добыча убита");
    else if (e.kind === "defenseUsed") {
      if (e.defense === "running") titles.push("Быстрое — бросок кубика");
      else if (e.defense === "tailLoss") titles.push("Отбросить хвост");
      else if (e.defense === "mimicry") titles.push("Мимикрия");
    } else if (e.kind === "plantAttack") {
      titles.push(e.counter ? "Контратака растения" : "Хищное растение");
    } else if (e.kind === "paralyzed") titles.push("Паралич");
    else if (e.kind === "animalDied") deaths += 1;
  }
  if (deaths) titles.push("Вымирание");
  return titles;
}

// ── зонд внутри страницы ─────────────────────────────────────────────────────

/**
 * Пишет в window.__evoProbe: кадры состояния (смена state), приходы батчей
 * net.events, показы спотлайтов (.spotlight-card: появление, начало закрытия,
 * уход) и карточек «Ваш ход» (.turn-card). Метки времени — Date.now() страницы.
 */
async function injectProbe(page) {
  await page.evaluate(() => {
    if (window.__evoProbe) return;
    const probe = {
      t0: Date.now(),
      frames: [],
      batches: [],
      cards: [],
      turns: [],
      deadlineSeenAt: 0,
    };
    window.__evoProbe = probe;

    // — стор: кадры состояния, батчи, метка таймера хода (M10) —
    let lastState = null;
    let lastEventsArr = null;
    const record = () => {
      const store = globalThis.__evoStore;
      if (!store?.getState) return;
      const st = store.getState();
      const s = st.state;
      if (s && s !== lastState) {
        lastState = s;
        probe.frames.push({
          t: Date.now(),
          seq: s.eventSeq,
          phase: s.phase,
          year: s.year,
          cur: s.currentPlayerId,
          human: s.humanId,
          pending: Boolean(s.pendingAttack),
          events: (s.lastEvents ?? []).map((e) => ({
            kind: e.kind,
            defense: e.defense,
            counter: e.counter,
          })),
        });
      }
      const ev = st.net?.events;
      if (ev && ev !== lastEventsArr) {
        const known = lastEventsArr ? lastEventsArr.length : 0;
        const fresh = ev.slice(known);
        lastEventsArr = ev;
        if (fresh.length) {
          probe.batches.push({
            t: Date.now(),
            batches: fresh.map((b) => ({
              version: b.version,
              events: b.events.map((e) => ({ kind: e.kind, defense: e.defense, counter: e.counter })),
            })),
          });
        }
      }
      if (!probe.deadlineSeenAt && st.net?.turnDeadlineAt) probe.deadlineSeenAt = Date.now();
    };
    const attach = () => {
      if (globalThis.__evoStore?.subscribe) {
        globalThis.__evoStore.subscribe(record);
        record();
        return true;
      }
      return false;
    };
    if (!attach()) {
      const iv = setInterval(() => {
        if (attach()) clearInterval(iv);
      }, 200);
    }

    // — DOM: спотлайты и «Ваш ход» по фактическому элементу —
    let cardEl = null;
    let cardRec = null;
    let turnEl = null;
    let turnRec = null;
    const scan = () => {
      const c = document.querySelector(".spotlight-card");
      if (c !== cardEl) {
        if (cardRec && !cardRec.tGone) cardRec.tGone = Date.now();
        cardEl = c;
        if (c) {
          cardRec = {
            t: Date.now(),
            title: c.querySelector("h2")?.textContent ?? "?",
            note: c.querySelector("p")?.textContent ?? "",
          };
          probe.cards.push(cardRec);
        } else {
          cardRec = null;
        }
      } else if (cardRec && !cardRec.tClosing && c?.classList.contains("spotlight-out")) {
        cardRec.tClosing = Date.now();
      }
      const tc = document.querySelector(".turn-card, .turn-card-closing");
      if (tc !== turnEl) {
        if (turnRec && !turnRec.tGone) turnRec.tGone = Date.now();
        turnEl = tc;
        if (tc) {
          turnRec = { t: Date.now() };
          probe.turns.push(turnRec);
        } else {
          turnRec = null;
        }
      }
    };
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    scan();
  });
  const alive = await waitUntil(
    () => page.evaluate(() => Boolean(window.__evoProbe)).catch(() => false),
    15_000,
    250,
  );
  if (!alive) throw new Error("зонд не внедрился (нет __evoProbe)");
}

// ── примитивы сценария ───────────────────────────────────────────────────────

const domClick = (loc) =>
  loc
    .first()
    .evaluate((el) => {
      el.click();
      return true;
    })
    .catch(() => false);

const storeSnap = (page) =>
  page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      if (!s?.state) return null;
      const st = s.state;
      return {
        phase: st.phase,
        year: st.year,
        cur: st.currentPlayerId,
        human: st.humanId,
        pending: Boolean(st.pendingAttack),
      };
    })
    .catch(() => null);

/** Ждёт состояние; заодно следит, что зонд жив (dev-перезагрузка убивает его). */
async function waitState(page, pred, timeout, what) {
  return waitUntil(
    async () => {
      const alive = await page.evaluate(() => Boolean(window.__evoProbe)).catch(() => false);
      if (!alive) throw new Error(`вкладка перезагрузилась — зонд погиб (${what})`);
      const s = await storeSnap(page);
      return Boolean(s && pred(s));
    },
    timeout,
    250,
  );
}

/** Клик по кнопке завершения фазы (программный — оверлеи не мешают). */
async function clickEndButton(page, label, clicks) {
  const btn = page.getByRole("button", { name: label, exact: true });
  const found = await waitUntil(() => btn.count().then((n) => n > 0), 30_000, 400);
  if (!found) throw new Error(`кнопка «${label}» не появилась; экран: ${await bodyOf(page)}`);
  const clicked = await domClick(btn);
  clicks.push({ t: Date.now(), label });
  if (!clicked) throw new Error(`клик по «${label}» не удался`);
}

/** Подтверждение в диалоге («Закончить питание» всегда с подтверждением). */
async function confirmEndDialog(page, label, clicks) {
  const dialog = page.locator('[role="dialog"]').filter({ hasText: label });
  const found = await waitUntil(() => dialog.count().then((n) => n > 0), 10_000, 200);
  if (!found) throw new Error(`диалог «${label}» не появился; экран: ${await bodyOf(page)}`);
  const confirmed = await domClick(dialog.getByRole("button", { name: label, exact: true }));
  clicks.push({ t: Date.now(), label: `${label} (подтверждение)` });
  if (!confirmed) throw new Error(`подтвердить «${label}» не удалось`);
}

// ── разбор зонда ─────────────────────────────────────────────────────────────

const sameEvents = (a, b) =>
  a.length === b.length && a.every((x, i) => x.kind === b[i].kind && x.defense === b[i].defense);

function analyze(probe, clicks) {
  const evidence = [];
  const note = (s) => evidence.push(s);

  // Ожидаемые карточки: пропущенные батчи (кроме последнего в приходе — он
  // отражается живым кадром) + кадры состояния. Дедуп по совпадению событий
  // последнего батча с кадром того же мгновения.
  const expected = [];
  for (const arr of probe.batches) {
    for (let i = 0; i < arr.batches.length - 1; i++) {
      for (const title of cardsOfEvents(arr.batches[i].events)) expected.push({ t: arr.t, title });
    }
    const last = arr.batches[arr.batches.length - 1];
    if (last) {
      const framed = probe.frames.some(
        (f) => Math.abs(f.t - arr.t) < 400 && sameEvents(f.events, last.events),
      );
      if (!framed) for (const title of cardsOfEvents(last.events)) expected.push({ t: arr.t, title });
    }
  }
  for (const f of probe.frames) {
    for (const title of cardsOfEvents(f.events)) expected.push({ t: f.t, title });
  }
  expected.sort((a, b) => a.t - b.t);

  // Показанные карточки.
  const observed = probe.cards.map((c) => ({
    ...c,
    shownTillClose: (c.tClosing ?? c.tGone ?? probe.tEnd ?? Date.now()) - c.t,
    intended: INTENDED_MS[c.title] ?? null,
  }));

  note(`кадров состояния: ${probe.frames.length}, приходов батчей: ${probe.batches.length}`);
  note(`ожидаемых карточек: ${expected.length}, показанных: ${observed.length}`);
  note(
    `показанные: ${observed.map((c) => `${c.title} ${c.shownTillClose}мс`).join("; ") || "—"}`,
  );

  // (а) Все ожидаемые карточки показаны, по порядку.
  let miss = [];
  {
    let j = 0;
    miss = [];
    for (const exp of expected) {
      let found = false;
      while (j < observed.length) {
        if (observed[j].title === exp.title) {
          found = true;
          j += 1;
          break;
        }
        j += 1;
      }
      if (!found) miss.push(exp);
    }
    if (miss.length) {
      fail(
        `не показаны карточки (${miss.length}): ${miss
          .map((m) => `${m.title}@+${Math.round((m.t - probe.t0) / 1000)}с`)
          .join(", ")}`,
      );
    } else if (expected.length) {
      ok(`все ожидаемые карточки показаны (${expected.length} шт., по порядку)`);
    } else {
      warn("ни одной ожидаемой карточки за прогон — проверить сценарий");
    }
  }

  // (в-1) Карточки не срезаются: до начала закрытия ≥ 75% длительности.
  let cut = 0;
  for (const c of observed) {
    if (c.intended == null) continue;
    if (c.shownTillClose < c.intended * FULL_SHARE) {
      cut += 1;
      fail(
        `карточка «${c.title}» срезана: ${c.shownTillClose}мс из ${c.intended}мс (начало +${Math.round((c.t - probe.t0) / 1000)}с)`,
      );
    }
  }
  if (!cut && observed.length) ok(`ни одна карточка не срезана (${observed.length} шт.)`);

  // (б-1) Окно «бросок кубика → начало питания».
  const diceWindows = [];
  for (let i = 0; i < probe.frames.length; i++) {
    const f = probe.frames[i];
    if (!f.events.some((e) => e.kind === "diceRoll")) continue;
    const next = probe.frames.find((x) => x.t > f.t && x.phase === "feeding");
    if (!next) continue;
    const w = next.t - f.t;
    diceWindows.push(w);
    if (w < INTENDED_MS["Кормовая база"] * WINDOW_SHARE) {
      fail(
        `окно «кубики → питание» ${w}мс < ${Math.round(INTENDED_MS["Кормовая база"] * WINDOW_SHARE)}мс: карточка «Кормовая база» накрывается следующей фазой (кубики +${Math.round((f.t - probe.t0) / 1000)}с)`,
      );
    } else {
      ok(`окно «кубики → питание» ${w}мс — карточка успевает проиграться`);
    }
  }
  if (!diceWindows.length) fail("ни одного броска кубиков за прогон — сценарий не дошёл до питания");

  // (б-2) Окно «шаг, завершивший питание → следующий шаг» при погибших.
  const extWindows = [];
  let extChecked = 0;
  for (let i = 0; i < probe.frames.length; i++) {
    const f = probe.frames[i];
    if (f.phase !== "extinction") continue;
    const deaths = f.events.filter((e) => e.kind === "animalDied").length;
    const next = probe.frames.find((x) => x.t > f.t && x.phase !== "extinction");
    if (!next) continue;
    const w = next.t - f.t;
    extWindows.push(w);
    if (deaths > 0) {
      extChecked += 1;
      if (w < INTENDED_MS.Вымирание * WINDOW_SHARE) {
        fail(
          `окно «конец питания → вымирание» ${w}мс < ${Math.round(INTENDED_MS.Вымирание * WINDOW_SHARE)}мс при ${deaths} погибших: сводка вымирания срезается (конец питания +${Math.round((f.t - probe.t0) / 1000)}с)`,
        );
      } else {
        ok(`окно «конец питания → вымирание» ${w}мс при ${deaths} погибших — пауза держится`);
      }
    } else {
      note(`пустой переход вымирания (без погибших): ${w}мс — не растягиваем, ок`);
    }
  }
  if (!extChecked) warn("ни одного перехода вымирания с погибшими — замер паузы пропущен");

  // (в-2) «Ваш ход» не появляется поверх показываемой модалки.
  let overlaps = 0;
  for (const turn of probe.turns) {
    const over = observed.find((c) => c.t <= turn.t && (c.tGone ?? Infinity) >= turn.t);
    if (over) {
      overlaps += 1;
      fail(
        `карточка «Ваш ход» встала поверх модалки «${over.title}» (+${Math.round((turn.t - probe.t0) / 1000)}с) — сначала модалки, потом индикатор`,
      );
    }
  }
  if (!overlaps && probe.turns.length) {
    ok(`карточки «Ваш ход» (${probe.turns.length} шт.) не перекрывают модалки`);
  }

  // (б-3) От завершающего клика до первого хода следующей фазы — пауза.
  for (const click of clicks) {
    const isFeed = click.label.includes("питание");
    const targetPhase = isFeed ? "development" : "feeding";
    const first = probe.frames.find(
      (f) =>
        f.t > click.t &&
        f.phase === targetPhase &&
        f.cur === f.human &&
        !f.pending &&
        f.events.length >= 0,
    );
    if (!first) continue;
    const w = first.t - click.t;
    note(
      `«${click.label}» → первый ход ${isFeed ? "развития" : "питания"} следующей фазы: ${w}мс`,
    );
    if (w < 800) {
      fail(`после «${click.label}» следующий этап начался мгновенно (${w}мс) — без паузы`);
    }
  }

  // Таймер хода (M10) жив: метка авто-конца хотя бы раз приходила.
  if (probe.deadlineSeenAt) {
    ok(`таймер авто-конца хода срабатывал (метка +${Math.round((probe.deadlineSeenAt - probe.t0) / 1000)}с)`);
  } else {
    warn("метка turnDeadlineAt ни разу не пришла — таймер M10 не проверен");
  }

  return evidence;
}

// ── сценарий ─────────────────────────────────────────────────────────────────

const browser = await chromium.launch();
let page = null;
const clicks = [];
let step = "старт";

try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  page = await ctx.newPage();
  const pageProblems = trackPage(page, "стол");
  await openMenu(page);
  await injectProbe(page);
  step = "создание стола";
  const code = await startNetGame(page, {
    name: "Темп",
    players: 2,
    bots: 1,
    navigate: false,
    log: (m) => console.log(`       ${m}`),
  });
  ok(`стол ${code}: партия началась (человек + 1 бот, без дополнений)`);

  // Съёмка карточек: новая модалка — скриншот (иллюстрация, не критерий).
  let lastCardCount = 0;
  const watcher = setInterval(async () => {
    try {
      const p = await page
        .evaluate(() => ({
          n: window.__evoProbe?.cards?.length ?? 0,
          title: window.__evoProbe?.cards?.at(-1)?.title ?? "",
        }))
        .catch(() => null);
      if (p && p.n > lastCardCount) {
        lastCardCount = p.n;
        const safe = (p.title || "card").replace(/[^\wа-яА-Я -]+/g, "").trim().slice(0, 24) || "card";
        await page.screenshot({ path: join(SHOTS, `wave6-card${p.n}-${safe}.png`) }).catch(() => {});
      }
    } catch {
      /* вкладка могла перезагрузиться — сценарий заметит сам */
    }
  }, 350);

  try {
    // Год 1..2: развитие → питание → вымирание → следующий год. Человек
    // играет одно животное (иначе без животных он не получает ход в питании),
    // затем завершает фазу — это его последние ходы фаз.
    for (let year = 1; year <= 2; year++) {
      step = `год ${year}: развитие`;
      const dev = await waitState(
        page,
        (s) => s.phase === "development" && s.cur === s.human && !s.pending,
        120_000,
        "свой ход в развитии",
      );
      if (!dev) throw new Error(`свой ход в развитии (год ${year}) не наступил`);
      await sleep(700); // карточка «Ваш ход» живёт 1.6 с — не мешаем ей стартовать
      // Одно животное на стол: у человека появится ход в питании.
      const animalBtn = page.locator("[data-hand-row] button", { hasText: "Животное" });
      if (await waitUntil(() => animalBtn.count().then((n) => n > 0), 10_000, 300)) {
        const placed = await domClick(animalBtn.first());
        if (placed) {
          clicks.push({ t: Date.now(), label: "Животное" });
          await sleep(500);
        }
      }
      await clickEndButton(page, "Закончить развитие", clicks);
      ok(`год ${year}: «Закончить развитие» — последний ход фазы развития`);

      step = `год ${year}: питание`;
      // Хода в питании может не быть (база пуста) — тогда фазу доиграет бот.
      const feed = await waitState(
        page,
        (s) =>
          (s.phase === "feeding" && s.cur === s.human && !s.pending) ||
          s.year > year ||
          s.phase === "gameOver",
        180_000,
        "свой ход в питании",
      );
      if (!feed) throw new Error(`питание (год ${year}) не наступило`);
      const snapFeed = await storeSnap(page);
      if (snapFeed.phase === "feeding" && snapFeed.cur === snapFeed.human) {
        await sleep(700);
        await clickEndButton(page, "Закончить питание", clicks);
        await confirmEndDialog(page, "Закончить питание", clicks);
        ok(`год ${year}: «Закончить питание» — последний ход фазы питания`);
      } else {
        warn(`год ${year}: ход в питании не пришёл (${snapFeed.phase}) — фазу завершил бот`);
      }

      step = `год ${year}: смена года`;
      // Ждём следующий год (или финал партии) — за это время набегают
      // кубики, вымирание и рост со всеми модалками.
      const next = await waitState(
        page,
        (s) => s.year > year || s.phase === "gameOver",
        180_000,
        "следующий год",
      );
      if (!next) throw new Error(`год ${year + 1} не наступил`);
      ok(`год ${year}: переход в год ${year + 1} прошёл`);
      if ((await storeSnap(page)).phase === "gameOver") {
        warn("партия завершилась — дальнейшие года пропущены");
        break;
      }
    }
  } finally {
    clearInterval(watcher);
  }

  // Дадим хвосту очереди модалок догореть (последняя карточка ~3.4 с).
  await sleep(4500);

  step = "разбор";
  const probe = await page.evaluate(() => {
    const p = window.__evoProbe;
    if (!p) return null;
    p.tEnd = Date.now();
    return JSON.parse(JSON.stringify(p));
  });
  if (!probe) throw new Error("зонд исчез — вкладка перезагрузилась в конце сценария");

  const dump = join(SHOTS, `wave6-probe-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(dump, JSON.stringify({ probe, clicks }, null, 2));
  console.log(`       дамп зонда: ${dump}`);

  const evidence = analyze(probe, clicks);
  for (const line of evidence) console.log(`       ${line}`);

  for (const p of pageProblems) fail(p);
} catch (e) {
  fail(`${step}: ${String(e?.message ?? e).split("\n")[0]}`);
  // Аварийный дамп: что видел зонд и где застряла партия.
  if (page) {
    const probe = await page
      .evaluate(() => {
        const p = window.__evoProbe;
        if (!p) return null;
        p.tEnd = Date.now();
        const s = globalThis.__evoStore?.getState?.();
        return {
          probe: JSON.parse(JSON.stringify(p)),
          store: s?.state
            ? { phase: s.state.phase, year: s.state.year, cur: s.state.currentPlayerId, human: s.state.humanId, seq: s.state.eventSeq }
            : null,
          netError: s?.net?.error ?? null,
        };
      })
      .catch(() => null);
    if (probe) {
      const dump = join(SHOTS, `wave6-fail-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
      writeFileSync(dump, JSON.stringify({ probe, clicks }, null, 2));
      console.log(`       аварийный дамп: ${dump}`);
      console.log(`       стор: ${JSON.stringify(probe.store)}; ошибка сети: ${probe.netError}`);
      console.log(
        `       последние кадры: ${probe.probe.frames
          .slice(-8)
          .map((f) => `+${Math.round((f.t - probe.probe.t0) / 1000)}с ${f.phase}/${f.cur}[${f.events.map((e) => e.kind).join(",")}]`)
          .join(" | ")}`,
      );
    }
  }
} finally {
  await browser.close().catch(() => {});
}

console.log("");
if (problems.length) {
  console.log(`ВЕРДИКТ: FAIL (${problems.length} проблем, ${warnings.length} предупреждений)`);
  process.exit(1);
}
console.log(`ВЕРДИКТ: PASS (${warnings.length} предупреждений)`);
