/**
 * QA волны 10: диагностика «на этапе развития не пишется, что это мой ход —
 * модалка не появляется».
 *
 * Жалоба владельца: на фазе развития карточка «Ваш ход» не показывается
 * (иногда?), хотя переход хода к человеку состоялся.
 *
 * Что проверяем (два варианта, 3 полных года каждый):
 *   а) базовая партия «человек + 2 бота», без дополнений;
 *   б) та же с «Травой и грибами» (madTurn, раунды безумия/бешенства).
 *
 * Механизм под проверкой (game-app.tsx ~1213-1255):
 *   isHumanTurn = actor.id===human.id && madTurn!==human.id && !spectating;
 *   эффект карточки: on=isHumanTurn&&!pendingAttack&&!rageTurn; if(!on) скрыть;
 *   if (key уже писан) молчать; if (spotlightActive) выйти БЕЗ записи ключа
 *   (пересработает, когда spotlight кончится); иначе показать карточку (1600мс).
 *
 * Зонд внутри страницы пишет:
 *   - кадры стора (фаза, год, актор, madTurn, rageTurn, pendingAttack, события);
 *   - метки таймера авто-конца хода (M10, idleTurnMs=30с);
 *   - появления/уходы .turn-card (карточка «Ваш ход») с проверкой, не накрыт
 *     ли центр карточки чужим оверлеем (z-index/elementFromPoint);
 *   - появления/уходы .spotlight-card (очередь модалок событий) с заголовками.
 *
 * Сценарий в каждом году: дождаться СВОЕГО хода в развитии, НЕ трогать экран,
 * пока не догорит очередь спотлайтов (иначе собственный клик убил бы карточку
 * и замаскировал бы баг), затем «Закончить развитие» через стор (devPass).
 * В питании — то же самое («Закончить ход» = feedEndTurn), защита от атак ботов
 * кнопкой «Не защищаться». Так каждый переход хода к человеку — чистый замер.
 *
 * Разбор: для каждого перехода хода к человеку (on=false→true по кадрам стора)
 * вердикт: карточка показана чисто / показана ПОД спотлайтом (накрыта z-50 и
 * умерла под ним) / не показана при активном спотлайте / не показана вовсе
 * (madTurn? ключ? таймер M10?). Отдельная статистика по развитию и питанию.
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave10-turn-diag.mjs
 * Дамп зонда — вне репозитория (%TEMP%/EVO_SHOTS).
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
  warmupServer,
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

const YEARS = 3;

// ── зонд внутри страницы ─────────────────────────────────────────────────────

async function injectProbe(page) {
  await page.evaluate(() => {
    if (window.__evoProbe) return;
    const probe = {
      t0: Date.now(),
      frames: [],
      turns: [],
      cards: [],
      deadlines: [],
    };
    window.__evoProbe = probe;

    let lastState = null;
    let lastDeadline = null;
    const record = () => {
      const store = globalThis.__evoStore;
      if (!store?.getState) return;
      const st = store.getState();
      const s = st.state;
      if (s && s !== lastState) {
        lastState = s;
        probe.frames.push({
          t: Date.now(),
          phase: s.phase,
          year: s.year,
          cur: s.currentPlayerId,
          human: s.humanId,
          first: s.firstPlayerId,
          mad: s.madTurn ?? null,
          rage: Boolean(s.rageTurn),
          pending: Boolean(s.pendingAttack),
          seq: s.eventSeq,
          events: (s.lastEvents ?? []).map((e) => e.kind),
        });
      }
      const dl = st.net?.turnDeadlineAt ?? null;
      if (dl !== lastDeadline) {
        lastDeadline = dl;
        probe.deadlines.push({ t: Date.now(), on: Boolean(dl) });
      }
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

    const centerTop = () => {
      const el = document.elementFromPoint(
        Math.round(window.innerWidth / 2),
        Math.round(window.innerHeight / 2),
      );
      if (!el) return "none";
      if (el.closest(".turn-card, .turn-card-closing")) return "self";
      if (el.closest(".spotlight-card")) return "spotlight";
      const cls = String(el.className ?? "").slice(0, 60);
      return `${el.tagName}${cls ? "." + cls.split(/\s+/)[0] : ""}`;
    };

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
          };
          probe.cards.push(cardRec);
        } else {
          cardRec = null;
        }
      }
      const tc = document.querySelector(".turn-card, .turn-card-closing");
      if (tc !== turnEl) {
        if (turnRec && !turnRec.tGone) turnRec.tGone = Date.now();
        turnEl = tc;
        if (tc) {
          turnRec = {
            t: Date.now(),
            // Что реально находится в центре экрана в момент появления: если не
            // сама карточка — её накрыл чужой оверлей (z-index) или не видно.
            coveredBy: centerTop(),
            text: tc.querySelector("h2")?.textContent ?? "",
            sub: tc.querySelector("p")?.textContent ?? "",
          };
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

const storeSnap = (page) =>
  page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      const st = s?.state;
      if (!st) return null;
      return {
        phase: st.phase,
        year: st.year,
        cur: st.currentPlayerId,
        human: st.humanId,
        mad: st.madTurn ?? null,
        rage: Boolean(st.rageTurn),
        pending: Boolean(st.pendingAttack),
      };
    })
    .catch(() => null);

const dispatchAction = (page, action) =>
  page
    .evaluate((a) => {
      const store = globalThis.__evoStore;
      if (!store) return false;
      store.getState().dispatch(a);
      return true;
    }, action)
    .catch(() => false);

const domClickText = (page, label) =>
  page
    .getByRole("button", { name: label, exact: true })
    .first()
    .evaluate((el) => {
      el.click();
      return true;
    })
    .catch(() => false);

async function waitStore(page, pred, timeout, what) {
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

/** Ход человека (клиентское isHumanTurn без spectating — мы не зрители). */
const humanAct = (s) =>
  s.cur === s.human && s.mad !== s.human && !s.rage && !s.pending;

/** Ждёт, пока на экране нет карточек-оверлеев (очередь модалок догорела). */
async function waitQuiet(page, timeout = 15_000) {
  return waitUntil(
    () =>
      page
        .evaluate(
          () =>
            !document.querySelector(".spotlight-card") && !document.querySelector(".turn-card, .turn-card-closing"),
        )
        .catch(() => false),
    timeout,
    250,
  );
}

/** Ждёт своей тишины: карточки ушли, ещё 2.6с ничего не трогаем. */
async function observeUntouched(page) {
  await waitQuiet(page, 15_000);
  await sleep(2600); // карточка «Ваш ход» живёт 1600мс + закрытие 200мс
}

// ── сценарий одного варианта ─────────────────────────────────────────────────

async function runVariant(browser, label, modules) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pageProblems = trackPage(page, label);
  let step = "старт";
  try {
    await openMenu(page);
    await injectProbe(page);
    step = "создание стола";
    const code = await startNetGame(page, {
      name: `Зонд${label.length > 10 ? "" : `-${label}`}`.slice(0, 16), // лимит имени — 16 символов
      players: 3,
      bots: 2,
      modules,
      navigate: false,
      log: (m) => console.log(`       ${m}`),
    });
    ok(`${label}: стол ${code}, партия началась (человек + 2 бота, modules=${JSON.stringify(modules)})`);

    for (let year = 1; year <= YEARS; year++) {
      step = `${label} год ${year}: развитие`;
      const dev = await waitStore(
        page,
        (s) => s.phase === "development" && humanAct(s),
        150_000,
        "свой ход в развитии",
      );
      if (!dev) throw new Error(`свой ход в развитии (год ${year}) не наступил`);
      console.log(`       ${label}: год ${year} — ход в развитии получен, наблюдаем без кликов`);
      // Карточка «Ваш ход» должна успеть показаться до наших кликов.
      await observeUntouched(page);
      // Играем одно животное: у человека появятся ходы в питании, атаки ботов
      // (защиты, жертвы) и вымирание — граница года станет насыщенной
      // спотлайтами, как в реальной партии владельца.
      const animalBtn = page.locator("[data-hand-row] button", { hasText: "Животное" });
      if (await waitUntil(() => animalBtn.count().then((n) => n > 0), 10_000, 300)) {
        const placed = await animalBtn
          .first()
          .evaluate((el) => {
            el.click();
            return true;
          })
          .catch(() => false);
        if (placed) {
          console.log(`       ${label}: год ${year} — животное сыграно`);
          await sleep(500);
        }
      }
      // Завершаем развитие: пас слать циклично — после игры животного ход
      // авто-уходит боту, и пас «не в свой ход» сервер отклоняет; фаза
      // развития идёт раундами, пока все не пасанут.
      const devDeadline = Date.now() + 180_000;
      let devPassedCount = 0;
      while (Date.now() < devDeadline) {
        const s = await storeSnap(page);
        if (!s || s.phase !== "development" || s.year > year || s.phase === "gameOver") break;
        if (humanAct(s)) {
          // Свой ход в развитии (второй раунд и далее): тоже не мешаем
          // карточке «Ваш ход» — ждём тишины перед пасом.
          if (devPassedCount === 0) await observeUntouched(page);
          else await sleep(300);
          await dispatchAction(page, { type: "devPass" });
          devPassedCount += 1;
          await sleep(400);
        } else {
          await sleep(250);
        }
      }
      if (devPassedCount === 0) throw new Error("devPass так и не ушёл");
      await waitStore(
        page,
        (s) => s.phase !== "development" || s.year > year,
        60_000,
        "уход фазы развития",
      );

      step = `${label} год ${year}: питание`;
      const feedDeadline = Date.now() + 300_000;
      let feedTurnsSeen = 0;
      while (Date.now() < feedDeadline) {
        const s = await storeSnap(page);
        if (!s) break;
        if (s.year > year || s.phase === "gameOver") break;
        if (s.phase !== "feeding") {
          await sleep(300);
          continue;
        }
        // Бот атакует наше животное: диалог защиты перекрывает экран.
        if (s.pending && s.cur === s.human) {
          await domClickText(page, "Не защищаться");
          await sleep(300);
          continue;
        }
        if (humanAct(s)) {
          feedTurnsSeen += 1;
          console.log(`       ${label}: год ${year} — ход в питании №${feedTurnsSeen}, наблюдаем без кликов`);
          await observeUntouched(page);
          // После трёх ходов пасуем до конца фазы: банк бывает большим, и
          // круги «закончить ход» тянутся десятками минут — для диагностики
          // карточки достаточно трёх замеров на год.
          await dispatchAction(page, feedTurnsSeen >= 3 ? { type: "feedSkip" } : { type: "feedEndTurn" });
          await sleep(400);
        } else {
          await sleep(250);
        }
      }
      if (!feedTurnsSeen) warn(`${label}: год ${year} — ходов в питании не было`);

      step = `${label} год ${year}: смена года`;
      const next = await waitStore(
        page,
        (s) => s.year > year || s.phase === "gameOver",
        240_000,
        "следующий год",
      );
      if (!next) throw new Error(`год ${year + 1} не наступил`);
      ok(`${label}: год ${year} пройден`);
      if ((await storeSnap(page)).phase === "gameOver") {
        warn(`${label}: партия завершилась на годе ${year}`);
        break;
      }
    }

    await sleep(4500); // хвост очереди модалок догорает
    step = `${label}: разбор`;
    const probe = await page.evaluate(() => {
      const p = window.__evoProbe;
      if (!p) return null;
      p.tEnd = Date.now();
      return JSON.parse(JSON.stringify(p));
    });
    if (!probe) throw new Error("зонд исчез — вкладка перезагрузилась в конце");
    for (const p of pageProblems) fail(p);
    await ctx.close();
    return probe;
  } catch (e) {
    fail(`${label} ${step}: ${String(e?.message ?? e).split("\n")[0]}`);
    for (const p of pageProblems) fail(p);
    // Аварийный дамп: что успел увидеть зонд.
    const probe = await page
      .evaluate(() => {
        const p = window.__evoProbe;
        if (!p) return null;
        p.tEnd = Date.now();
        return JSON.parse(JSON.stringify(p));
      })
      .catch(() => null);
    await ctx.close().catch(() => {});
    if (probe) return { ...probe, aborted: true };
    return null;
  }
}

// ── разбор зонда ─────────────────────────────────────────────────────────────

/** Активна ли модалка события в момент t. */
const spotActiveAt = (cards, t) => cards.find((c) => c.t <= t && (c.tGone ?? Infinity) >= t) ?? null;

function analyze(label, probe) {
  const notes = [];
  const note = (s) => notes.push(s);
  const frames = probe.frames;
  const turns = probe.turns;
  const cards = probe.cards;

  // on = клиентское условие показа карточки «Ваш ход» по кадру стора.
  const onOf = (f) =>
    (f.phase === "development" || f.phase === "feeding") &&
    f.cur === f.human &&
    f.mad !== f.human &&
    !f.rage &&
    !f.pending;

  // Переходы on: false→true (или стартовое true).
  const transitions = [];
  let prev = false;
  for (const f of frames) {
    const on = onOf(f);
    if (on && !prev) transitions.push({ tOn: f.t, f });
    prev = on;
  }
  if (!transitions.length) {
    note("переходов хода к человеку не зафиксировано — сценарий не дошёл");
    return notes;
  }

  const seenKeys = new Map();
  const stats = { development: { shown: 0, miss: 0, detail: [] }, feeding: { shown: 0, miss: 0, detail: [] } };

  for (const tr of transitions) {
    const phase = tr.f.phase;
    const bucket = stats[phase] ?? { shown: 0, miss: 0, detail: [] };
    // Конец окна: первый кадр, где on=false, либо конец записи.
    const tOff =
      frames.find((x) => x.t > tr.tOn && !onOf(x))?.t ?? probe.tEnd ?? Date.now();
    const key = `${tr.f.year}:${phase}:${tr.f.cur}:${tr.f.mad ?? -1}`;
    const dupKey = seenKeys.has(key);
    seenKeys.set(key, (seenKeys.get(key) ?? 0) + 1);

    // Карточка «Ваш ход» в окне перехода (появилась после tOn, пока ход наш).
    const shown = turns.find(
      (u) => u.t >= tr.tOn - 150 && u.t <= tOff + 2500,
    );
    const spotAtOn = spotActiveAt(cards, tr.tOn);
    // Модалка, начавшаяся сразу после прихода кадра (карточка родилась под ней).
    const spotBornAfter = cards.find((c) => c.t >= tr.tOn - 100 && c.t <= tr.tOn + 600);

    let verdict;
    if (shown) {
      // Модалка, накрывшая карточку: уже шла в момент её рождения, либо
      // началась в первые 600мс после (карточка родилась «под» ней).
      const spotAtShow = spotActiveAt(cards, shown.t);
      const spotAfter = cards.find((c) => c.t > shown.t && c.t <= shown.t + 600) ?? null;
      const cover = spotAtShow ?? spotAfter;
      const cardEnd = shown.tGone ?? Infinity;
      if (cover && cardEnd <= (cover.tGone ?? Infinity)) {
        // z-50 спотлайта выше z-40 карточки: она прожила всю жизнь под ним.
        verdict = "shown_under_spotlight";
      } else if (cover) {
        verdict = "shown_overlapping_spotlight";
      } else {
        verdict = "shown_clean";
      }
      bucket.shown += 1;
    } else {
      verdict = spotAtOn || spotBornAfter ? "missing_spotlight" : "missing_no_spotlight";
      bucket.miss += 1;
    }

    const onMs = tOff - tr.tOn;
    bucket.detail.push({
      year: tr.f.year,
      phase,
      key,
      dupKey,
      verdict,
      onMs,
      cardMs: shown ? (shown.tGone ?? probe.tEnd ?? 0) - shown.t : null,
      coveredBy: shown?.coveredBy ?? null,
      cardText: shown?.text ?? null,
      delayMs: shown ? shown.t - tr.tOn : null,
      spotAtOn: spotAtOn?.title ?? null,
      spotBornAfter: spotBornAfter?.title ?? null,
      spotWindow: cards
        .filter((c) => c.t >= tr.tOn - 3500 && c.t <= tOff + 2500)
        .map((c) => `${c.title}@+${Math.round((c.t - probe.t0) / 1000)}с`),
      tOnRel: Math.round((tr.tOn - probe.t0) / 1000),
    });
  }

  for (const phase of ["development", "feeding"]) {
    const b = stats[phase];
    if (!b.detail.length) {
      note(`${phase}: переходов не было`);
      continue;
    }
    note(
      `${phase}: переходов к человеку ${b.detail.length}, карточка показана ${b.shown}, НЕ показана ${b.miss}`,
    );
    for (const d of b.detail) {
      const spot = d.spotWindow.length ? ` спотлайты[${d.spotWindow.join(", ")}]` : "";
      const card = d.cardMs != null ? ` карточка +${d.delayMs}мс жила ${d.cardMs}мс (${d.coveredBy})` : "";
      note(
        `  ${d.verdict}: год ${d.year} ключ ${d.key}${d.dupKey ? " (ПОВТОР ключа!)" : ""} on=${d.onMs}мс t=+${d.tOnRel}с${card}${spot}`,
      );
    }
  }

  // Грубые аномалии: повторы ключей, карточки под оверлеем.
  const dups = [...seenKeys.entries()].filter(([, n]) => n > 1);
  if (dups.length) note(`повторяющиеся ключи (гасятся lastHumanKeyRef): ${dups.map(([k, n]) => `${k}×${n}`).join(", ")}`);
  const hidden = turns.filter((u) => u.coveredBy && u.coveredBy !== "self");
  if (hidden.length)
    note(`карточки «Ваш ход», центр экрана занят чужим элементом: ${hidden.map((u) => `${u.coveredBy}@+${Math.round((u.t - probe.t0) / 1000)}с`).join(", ")}`);
  const empty = turns.filter((u) => !u.text);
  if (empty.length) note(`карточки с ПУСТЫМ заголовком: ${empty.length} шт.`);

  return notes;
}

// ── main ─────────────────────────────────────────────────────────────────────

const browser = await chromium.launch();
try {
  console.log(`прогрев dev-сервера (${rel()})…`);
  await warmupServer(browser, { log: (m) => console.log(`       ${m}`) });
  ok("сервер прогрет");

  const variants = [
    { label: "база", modules: {} },
    { label: "трава-и-грибы", modules: { fungi: true } },
  ];

  for (const v of variants) {
    let probe = null;
    for (let attempt = 1; attempt <= 3 && !probe; attempt++) {
      if (attempt > 1) {
        warn(`${v.label}: повтор ${attempt} (перезагрузка вкладки/сбой)`);
        await sleep(3000);
      }
      probe = await runVariant(browser, `${v.label}${attempt > 1 ? `-п${attempt}` : ""}`, v.modules);
      if (probe?.aborted) {
        const dump = join(SHOTS, `wave10-abort-${v.label}-${Date.now()}.json`);
        writeFileSync(dump, JSON.stringify(probe, null, 2));
        console.log(`       аварийный дамп: ${dump}`);
        probe = null; // ретрай
      }
    }
    if (!probe) {
      fail(`${v.label}: прогон не удался после 3 попыток`);
      continue;
    }
    const dump = join(SHOTS, `wave10-probe-${v.label}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
    writeFileSync(dump, JSON.stringify(probe, null, 2));
    console.log(`       дамп зонда ${v.label}: ${dump}`);
    console.log(`   разбор ${v.label}:`);
    for (const line of analyze(v.label, probe)) console.log(`       ${line}`);
  }
} finally {
  await browser.close().catch(() => {});
}

console.log("");
if (problems.length) {
  console.log(`ИТОГ: FAIL (${problems.length})`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log("ИТОГ: сценарии отработали без технических сбоев (вердикты — в разборе выше)");
}
if (warnings.length) for (const w of warnings) console.log(`  warn: ${w}`);
