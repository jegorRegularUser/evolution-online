/**
 * QA волны 5: таймер авто-конца хода (M10). Живой dev-сервер, стол
 * «человек + боты» и вкладка-зритель.
 *
 * Что проверяем (ровно требования владельца):
 *   а) пока у человека ЕСТЬ действия — кругового индикатора нет (элемента нет
 *      ни в DOM, ни в кадре: net.turnDeadlineAt === null);
 *   б) как только действий не осталось (остался только «Закончить ход») —
 *      появляется кружок с убывающим числом, а через ~30 с (±2) ход уходит
 *      дальше сам (главный замер: остаток на первом кадре + время до смены);
 *   в) если игрок успел нажать «Закончить ход» — индикатор снимается;
 *   г) вёрстка не ломается на 1440×900 и 390×844: нет горизонтального
 *      переполнения, ширина шапки табло не меняется (место под кружок
 *      зарезервировано — табло не «прыгает»), кружок виден крупно.
 *
 * Сценарий: стол 3 места (человек + 2 бота), без дополнений. Человек
 * выкладывает двух животных и пасует развитие; в питании он берёт ОДНУ фишку
 * (еда за ход одна), поэтому у него остаётся единственное действие «Закончить
 * ход»: сервер планирует авто-конец через 30 с и отдаёт метку клиентам.
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave5-timer.mjs
 * Скриншоты — ТОЛЬКО вне репозитория (%TEMP%, EVO_SHOTS).
 */
import { chromium } from "playwright";
import {
  SHOTS,
  bodyOf,
  dismissSpotlight,
  isVisible,
  openMenu,
  safeClick,
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

let step = "старт";
const guard = async (label, fn) => {
  step = label;
  try {
    await fn();
  } catch (e) {
    fail(`${label}: ${String(e?.message ?? e).split("\n")[0]}`);
  }
};

const browser = await chromium.launch();
const pageProblems = [];
const shot = (page, name) => page.screenshot({ path: `${SHOTS}/${name}.png` }).catch(() => {});

/** Скриншот крупно: шапка табло человека вместе с кружком. */
async function shotTimer(page, name) {
  // На телефоне табло может быть ниже сгиба — подводим его к виду.
  await page
    .evaluate(() => document.querySelector('[data-player-section="0"]')?.scrollIntoView({ block: "center" }))
    .catch(() => {});
  await sleep(250);
  const box = await page
    .evaluate(() => {
      const el = document.querySelector('[data-player-section="0"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x = Math.max(0, Math.min(r.x - 4, vw - 10));
      const y = Math.max(0, Math.min(r.y - 4, vh - 10));
      return {
        x,
        y,
        width: Math.max(20, Math.min(r.width + 8, vw - x, 620)),
        height: Math.max(20, Math.min(r.height + 8, 96, vh - y)),
      };
    })
    .catch(() => null);
  if (!box) return;
  await page.screenshot({ path: `${SHOTS}/${name}.png`, clip: box }).catch(() => {});
}

async function newPage(label, viewport) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  pageProblems.push(trackPage(page, label, { ignore: [/hydrated but some attributes/] }));
  return page;
}

// ── срез стора и DOM ─────────────────────────────────────────────────────────

function probe(page) {
  return page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      const g = s?.state ?? null;
      const n = s?.net ?? null;
      const humanId = g?.humanId ?? 0;
      const human = g?.players?.[humanId] ?? null;
      const section = document.querySelector('[data-player-section="0"]');
      const head = section?.firstElementChild ?? null;
      const left = head?.children?.[0] ?? null;
      const right = head?.children?.[1] ?? null;
      const rect = (el) => (el ? el.getBoundingClientRect().toJSON() : null);
      // Правый край имени (текстовые узлы шапки) и левый край чипа «ходит»:
      // по ним видно, что слот кружка зарезервирован и ничего не «прыгает».
      const textNodes = left
        ? [...left.childNodes].filter((n) => n.nodeType === 3 && (n.textContent ?? "").trim())
        : [];
      let nameRight = null;
      if (textNodes.length) {
        const range = document.createRange();
        range.setStartBefore(textNodes[0]);
        range.setEndAfter(textNodes[textNodes.length - 1]);
        nameRight = Math.round(range.getBoundingClientRect().right);
      }
      const chipEl = left ? [...left.children].find((el) => /ходит/.test(el.textContent ?? "")) : null;
      return {
        hasStore: Boolean(s),
        phase: g?.phase ?? null,
        year: g?.year ?? null,
        // Кто сейчас действует: защита перебивает обычный ход.
        actor: g?.pendingAttack ? g.pendingAttack.waitingFor : (g?.currentPlayerId ?? null),
        pending: Boolean(g?.pendingAttack),
        humanId,
        handIds: (human?.hand ?? []).map((c) => c.id),
        animalIds: (human?.animals ?? []).map((a) => a.id),
        hungryIds: (human?.animals ?? []).filter((a) => a.food === 0).map((a) => a.id),
        bank: g?.foodBank ?? null,
        net: {
          seat: n?.seat ?? -1,
          status: n?.status ?? null,
          deadline: n?.turnDeadlineAt ?? null,
          offset: n?.serverOffsetMs ?? 0,
          error: n?.error ?? null,
          spectating: Boolean(n?.spectating),
        },
        timers: [...document.querySelectorAll("[data-turn-timer]")].map((el) => {
          const r = el.getBoundingClientRect();
          return {
            text: (el.textContent ?? "").trim(),
            label: el.getAttribute("aria-label") ?? "",
            x: Math.round(r.x),
            y: Math.round(r.y),
            w: Math.round(r.width),
            h: Math.round(r.height),
          };
        }),
        layout: {
          overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          section: rect(section),
          head: rect(head),
          leftW: left ? Math.round(left.getBoundingClientRect().width) : null,
          rightX: right ? Math.round(right.getBoundingClientRect().x) : null,
          nameRight,
          chipX: chipEl ? Math.round(chipEl.getBoundingClientRect().x) : null,
        },
        // Всплывающие ошибки стора (их гасит Table после тоста — в net.error
        // они живут доли секунды): нужны для диагностики отказов хода.
        toasts: [...document.querySelectorAll("[data-sonner-toast]")].map((el) =>
          (el.textContent ?? "").trim().slice(0, 120),
        ),
      };
    })
    .catch(() => null);
}

/** Действие через стор — тот же путь, что у кнопок дока. */
function act(page, action) {
  return page
    .evaluate((a) => {
      const s = globalThis.__evoStore?.getState?.();
      if (!s) return { ok: false, error: "нет __evoStore" };
      s.dispatch(a);
      return { ok: true };
    }, action)
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
}

/** Пока человек кому-то должен защиту — отказываемся (иначе стол зависнет). */
async function autoDefense(page) {
  const s = await probe(page);
  if (s?.pending && s.actor === s.humanId) {
    await act(page, { type: "chooseDefense", kind: "none" });
    return true;
  }
  return false;
}

/** Ждём фазу/актора человека, попутно отказываясь от защиты. */
async function waitHumanPhase(page, phase, timeout = 120_000) {
  return waitUntil(
    async () => {
      if (await autoDefense(page)) return false;
      const s = await probe(page);
      return Boolean(s && s.phase === phase && !s.pending && s.actor === s.humanId);
    },
    timeout,
    400,
  );
}

/**
 * Стол «человек + боты» до хода человека в питании: два животных в развитие,
 * пас, ожидание питания. Возвращает код стола.
 */
async function setupHumanFeeding(page, name = "Таймер") {
  const code = await startNetGame(page, { name, players: 3, bots: 2, difficulty: "easy" });
  await dismissSpotlight(page);
  const s = await probe(page);
  if (s?.phase !== "development" && !(await waitHumanPhase(page, "development", 30_000))) {
    throw new Error(`после старта фаза ${(await probe(page))?.phase}, а не развитие`);
  }
  // Шапка табло в свой ход и без кружка: с ней сравним состояние с кружком,
  // чтобы поймать «прыжок» вёрстки (место под кружок зарезервировано).
  const devLayout = (await probe(page))?.layout ?? null;
  // Первый игрок года выбирается жребием — свою фазу развития ждём отдельно.
  // Два животных: после взятой фишки у человека останется только «Закончить
  // ход» — ровно условие владельца «не осталось действий».
  for (let i = 0; i < 2; i++) {
    if (!(await waitHumanPhase(page, "development", 90_000))) {
      throw new Error(`ход человека в развитие (карта ${i + 1}) не наступил`);
    }
    const cardId = (await probe(page))?.handIds?.[0];
    if (!cardId) throw new Error("в руке нет карты для животного");
    await act(page, { type: "devPlayAnimal", cardId });
    const placed = await waitUntil(
      async () => ((await probe(page))?.animalIds?.length ?? 0) >= i + 1,
      20_000,
      300,
    );
    if (!placed) {
      const dbg = await probe(page);
      throw new Error(
        `животное ${i + 1} не выложилось: error=${dbg?.net?.error} toasts=${JSON.stringify(dbg?.toasts)}`,
      );
    }
  }
  // Пас засчитывается только в свой ход: после выложенной карты он уходит
  // соседу, поэтому ждём возврата хода человеку.
  if (!(await waitHumanPhase(page, "development", 90_000))) {
    throw new Error("ход человека для паса в развитие не наступил");
  }
  await act(page, { type: "devPass" });
  if (!(await waitHumanPhase(page, "feeding", 180_000))) {
    throw new Error(`ход человека в питании не наступил; экран: ${await bodyOf(page, 200)}`);
  }
  return { code, devLayout };
}

/** Взять еду голодным животным: после этого действий у человека не остаётся. */
async function takeOneFood(page) {
  const s = await probe(page);
  const animalId = s?.hungryIds?.[0] ?? s?.animalIds?.[0];
  if (!animalId) throw new Error("в питании у человека нет животных");
  await act(page, { type: "feedTake", animalId });
  return animalId;
}

/** Ждёт, что у человека появится таймер; возвращает срез. */
async function waitTimerAppears(page, timeout = 15_000) {
  const seen = await waitUntil(
    async () => {
      const s = await probe(page);
      return Boolean(s && s.timers.length > 0 && s.net.deadline !== null);
    },
    timeout,
    250,
  );
  return seen ? probe(page) : null;
}

/** Ждёт, что таймер снят: в DOM нет кружка и в кадре нет метки. */
async function waitTimerGone(page, timeout = 12_000) {
  return waitUntil(
    async () => {
      const s = await probe(page);
      return Boolean(s && s.timers.length === 0 && s.net.deadline === null);
    },
    timeout,
    250,
  );
}

/** Клик по кнопке дока, даже если её прикрыла карточка «Ваш ход». */
async function clickDockButton(page, name) {
  const btn = page.getByRole("button", { name }).first();
  for (let i = 0; i < 4; i++) {
    if (await isVisible(btn)) break;
    const card = page.locator("div[role='status']", { hasText: "Ваш ход" }).first();
    if (await isVisible(card)) await page.mouse.click(6, 6).catch(() => {});
    await sleep(300);
  }
  return safeClick(btn, 5000);
}

const warm = await warmupServer(browser, { timeout: 180_000, log: (m) => console.log(`  ${m}`) });
if (!warm) warn("прогрев сервера не подтвердился — сценарий продолжается");

let gameCode = "";
let measured = null;

try {
  const page = await newPage("стол", { width: 1440, height: 900 });

  // ── (а) развитие: действия есть — кружка нет ───────────────────────────────
  await guard("(а) в развитие с картами таймера нет", async () => {
    const dev = await newPage("развитие", { width: 1440, height: 900 });
    const code = await startNetGame(dev, { name: "Развитие", players: 2, bots: 1, difficulty: "normal" });
    await dismissSpotlight(dev);
    // Первый год открывает случайный игрок — дожидаемся именно хода человека.
    if (!(await waitHumanPhase(dev, "development", 60_000))) {
      throw new Error(`ход человека в развитие не наступил: ${(await probe(dev))?.phase}`);
    }
    const s = await probe(dev);
    if (!s.handIds.length) throw new Error("рука пуста — нечего проверять");
    if (s.timers.length > 0) throw new Error(`в развитие кружок есть: ${JSON.stringify(s.timers)}`);
    if (s.net.deadline !== null) throw new Error(`в кадре метка ${s.net.deadline} при живых действиях`);
    await shot(dev, "w5-a-dev-no-timer-1440");
    ok(`развитие (стол ${code}): действий ${s.handIds.length}, кружка нет и в кадре null`);
    await dev.close().catch(() => {});
  });

  // ── стол, доведённый до «действий не осталось» ─────────────────────────────
  let devLayout = null;
  await guard("подготовка стола: два животных, пас, питание и одна фишка", async () => {
    const setup = await setupHumanFeeding(page);
    gameCode = setup.code;
    devLayout = setup.devLayout;
    const s = await probe(page);
    if (s.timers.length > 0) throw new Error("кружок появился ДО того, как кончились действия");
    await takeOneFood(page);
    ok(`стол ${gameCode}: человек в питании, животных ${s.animalIds.length}, еда взята`);
  });

  // ── (б) появление, убывание и главный замер ────────────────────────────────
  let firstSeen = null;
  await guard("(б) без действий появляется кружок и число убывает", async () => {
    firstSeen = await waitTimerAppears(page, 15_000);
    if (!firstSeen) throw new Error(`кружок не появился; метка ${(await probe(page))?.net?.deadline}`);
    const t0 = firstSeen.timers[0];
    if (t0.text !== "30" && t0.text !== "29") throw new Error(`на кружке «${t0.text}», ожидалось 29–30`);
    if (!/не осталось действий/.test(t0.label)) {
      throw new Error(`подпись кружка без объяснения: «${t0.label}»`);
    }
    await sleep(2100);
    const later = (await probe(page)).timers[0];
    if (!later) throw new Error("кружок исчез раньше срока");
    if (Number(later.text) >= Number(t0.text)) throw new Error(`число не убывает: ${t0.text} → ${later.text}`);
    ok(`кружок: ${t0.text} с → ${later.text} с, подпись «${t0.label}», размер ${t0.w}×${t0.h}`);
    // Середина отсчёта: на скриншоте видно, что дуга действительно убывает.
    await waitUntil(async () => Number((await probe(page)).timers[0]?.text ?? 99) <= 18, 25_000, 400);
    await shot(page, "w5-b-timer-1440");
    await shotTimer(page, "w5-b-timer-closeup-1440");
  });

  await guard("(б) главный замер: ход уходит сам через ~30 с", async () => {
    const s = firstSeen ?? (await probe(page));
    if (!s?.net?.deadline) throw new Error("метка таймера потерялась до замера");
    const deadline = s.net.deadline;
    const offset = s.net.offset;
    const actorBefore = s.actor;
    const phaseBefore = s.phase;
    const tStart = Date.now();
    const moved = await waitUntil(
      async () => {
        await autoDefense(page);
        const now = await probe(page);
        if (!now) return false;
        if (now.phase !== phaseBefore) return true;
        return now.pending || (now.actor !== actorBefore && now.actor !== null);
      },
      40_000,
      200,
    );
    const tChange = Date.now();
    // Метка = момент автошага: полное окно = 30 с, поэтому замеряем, насколько
    // ПОЗЖЕ метки ход реально сменился (задержка поллинга), и сравниваем с 30.
    const sinceDeadline = (tChange + offset - deadline) / 1000;
    measured = 30 + sinceDeadline;
    const observed = (tChange - tStart) / 1000;
    if (!moved) throw new Error(`ход не ушёл за ${observed.toFixed(1)} с наблюдения`);
    if (measured < 28 || measured > 32) {
      throw new Error(`автошаг через ${measured.toFixed(2)} с вместо 30 ± 2 (опоздание ${sinceDeadline.toFixed(2)} с)`);
    }
    ok(
      `авто-конец хода: метка + ${sinceDeadline.toFixed(2)} с = ${measured.toFixed(2)} с от планирования ` +
        `(ждали 30 ± 2); сменились фаза ${phaseBefore} → ${(await probe(page))?.phase} / актор ${actorBefore} → ${s.actor}`,
    );
    await shot(page, "w5-b-turn-moved");
  });

  // ── второй ход человека: зритель, мобильная ширина, снятие индикатора ──────
  // Свежий стол для (в)/(г): в новом раунде бросок даёт минимум 3 еды, поэтому
  // после взятой фишки у человека остаётся голодное животное и ход остаётся
  // за ним — то есть кружок появится гарантированно (в старом раунде банк мог
  // опустеть, и ход уходил сам).
  const checkPage = await newPage("повтор", { width: 1440, height: 900 });
  let specPage = null;
  let secondTimer = null;
  await guard("(в/г) подготовка второго отсчёта и зрителя", async () => {
    const again = await setupHumanFeeding(checkPage, "Повтор");
    gameCode = again.code;
    devLayout = again.devLayout;
    // Зрителя подключаем ДО отсчёта: загрузка вкладки не должна съедать окно.
    specPage = await newPage("зритель", { width: 1440, height: 900 });
    await openMenu(specPage);
    const entered = await specPage
      .evaluate(async (code) => {
        const s = globalThis.__evoStore?.getState?.();
        if (!s) return { ok: false, error: "нет __evoStore" };
        try {
          await s.startNetWatch(code, "Наблюдатель");
          return { ok: true };
        } catch (e) {
          return { ok: false, error: String(e?.message ?? e) };
        }
      }, gameCode)
      .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
    if (!entered.ok) throw new Error(`зритель не вошёл за стол: ${entered.error}`);
    const watching = await waitUntil(async () => (await probe(specPage))?.net?.spectating, 20_000, 400);
    if (!watching) throw new Error("зритель не получил кадр стола");
    // Действия ещё есть — ни у игрока, ни у зрителя кружка быть не должно.
    const noTimer = await probe(specPage);
    if (noTimer.timers.length > 0 || noTimer.net.deadline !== null) {
      throw new Error("зритель видит кружок, пока у человека есть действия");
    }
    await takeOneFood(checkPage);
    secondTimer = await waitTimerAppears(checkPage, 15_000);
    if (!secondTimer) {
      throw new Error(`второй кружок не появился; метка ${(await probe(checkPage))?.net?.deadline}`);
    }
    ok(`второй отсчёт: ${secondTimer.timers[0].text} с (стол ${gameCode}), зритель на месте`);
  });

  await guard("(в) зритель видит тот же отсчёт", async () => {
    if (!secondTimer || !specPage) throw new Error("нет второго отсчёта или зрителя");
    const sawIt = await waitUntil(
      async () => {
        const s = await probe(specPage);
        return Boolean(s?.net?.spectating && s.timers.length > 0);
      },
      15_000,
      400,
    );
    if (!sawIt) {
      const dbg = await probe(specPage);
      throw new Error(`у зрителя кружка нет: ${JSON.stringify(dbg?.timers)} status=${dbg?.net?.status}`);
    }
    const w = (await probe(specPage)).timers[0];
    const mine = (await probe(checkPage)).timers[0] ?? secondTimer.timers[0];
    if (!mine || Math.abs(Number(w.text) - Number(mine.text)) > 1) {
      throw new Error(`расхождение счётчиков: игрок ${mine?.text}, зритель ${w.text}`);
    }
    ok(`зритель видит тот же кружок: «${w.text}» против «${mine.text}»`);
    await shotTimer(specPage, "w5-v-spectator-timer-1440");
    await specPage.close().catch(() => {});
    specPage = null;
  });

  await guard("(г) 390×844: кружок виден, переполнения нет", async () => {
    if (!secondTimer) throw new Error("нет второго отсчёта");
    await checkPage.setViewportSize({ width: 390, height: 844 });
    await sleep(1200);
    const s = await probe(checkPage);
    if (!s || s.timers.length === 0) throw new Error("на мобильной ширине кружок пропал");
    if (s.layout.overflowX > 1) throw new Error(`горизонтальное переполнение ${s.layout.overflowX}px`);
    const t = s.timers[0];
    if (t.w < 10 || t.h < 10) throw new Error(`кружок схлопнулся: ${t.w}×${t.h}`);
    await shot(checkPage, "w5-g-timer-390x844");
    await shotTimer(checkPage, "w5-g-timer-closeup-390x844");
    ok(`390×844: переполнения нет, кружок ${t.w}×${t.h}, число «${t.text}»`);
    await checkPage.setViewportSize({ width: 1440, height: 900 });
    await sleep(800);
  });

  await guard("(в) «Закончить ход» до срока снимает индикатор, шапка не «прыгает»", async () => {
    if (!secondTimer) throw new Error("нет второго отсчёта");
    const withTimer = await probe(checkPage);
    if (withTimer.timers.length === 0) throw new Error("кружок уже пропал до клика");
    const secs = withTimer.timers[0].text;
    // Кружок занимает тот же слот, что и пустое место в развитие (свой ход,
    // действий полно): чип «ходит» должен стоять на том же x — иначе вёрстка
    // прыгала бы при появлении/исчезновении индикатора.
    if (devLayout?.chipX != null && withTimer.layout.chipX != null) {
      const delta = Math.abs(devLayout.chipX - withTimer.layout.chipX);
      if (delta > 1) {
        throw new Error(
          `чип «ходит» съехал на ${delta}px: было ${devLayout.chipX}, стало ${withTimer.layout.chipX}`,
        );
      }
      if (devLayout.nameRight != null && withTimer.layout.nameRight != null) {
        ok(
          `место под кружок зарезервировано: имя ${devLayout.nameRight}px, чип ${withTimer.layout.chipX}px — как в развитие без кружка`,
        );
      }
    }
    if (!(await clickDockButton(checkPage, "Закончить ход"))) {
      throw new Error("кнопка «Закончить ход» не нажалась");
    }
    if (!(await waitTimerGone(checkPage, 10_000))) throw new Error("после своего хода индикатор остался");
    const without = await probe(checkPage);
    if (without.layout.overflowX > 1) throw new Error("переполнение после снятия индикатора");
    if (without.actor === without.humanId && !without.pending) {
      warn("ход остался у человека (движок имел право) — проверено только снятие индикатора");
    }
    ok(`игрок нажал «Закончить ход» на ${secs} с: кружок снят, метка ${without.net.deadline}`);
    await shot(checkPage, "w5-v-timer-cleared");
  });

  await guard("(г) 1440×900: переполнения нет и без кружка", async () => {
    const s = await probe(checkPage);
    if (!s) throw new Error("стор пропал");
    if (s.layout.overflowX > 1) throw new Error(`горизонтальное переполнение ${s.layout.overflowX}px`);
    ok("1440×900: горизонтального переполнения нет");
  });

  await page.close().catch(() => {});
  if (checkPage !== page) await checkPage.close().catch(() => {});
} catch (e) {
  fail(`прогон прерван на шаге «${step}»: ${String(e?.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
}

for (const list of pageProblems) problems.push(...list);

const seconds = Math.round((Date.now() - START_TS) / 1000);
console.log(`\nЗамер автошага: ${measured ? `${measured.toFixed(2)} с` : "не получен"}`);
console.log(`Стол: ${gameCode || "—"}`);
const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""} (${seconds} с)`
  : `ИТОГ: таймер хода волны 5 чист${warnings.length ? ` (предупреждений ${warnings.length})` : ""} (${seconds} с)`;
console.log(`\n${verdict}`);
if (problems.length) console.log(problems.map((p) => ` - ${p}`).join("\n"));
if (warnings.length) console.log(warnings.map((p) => ` ! ${p}`).join("\n"));
console.log(`Скриншоты: ${SHOTS}`);
process.exitCode = problems.length ? 1 : 0;
