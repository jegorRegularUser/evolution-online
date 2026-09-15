/**
 * QA волны 11 (задача 3, доп. проверка): «моргание» актора при СВОЕЙ атаке
 * не должно показывать карточку «Ваш ход».
 *
 * Сценарий: сетевая партия «человек + бот». В развитии выкладываем до двух
 * животных и кладём грани «Хищник» (сколько карт позволит рука — каждый
 * дев-шаг тратит ход, ждём возврата). В питании отправляем легальную
 * атаку feedHunt и следим за .turn-card:
 *
 *   до атаки: карточка «Ваш ход» показана (переход хода) и ушла;
 *   во время атаки: pendingAttack переводит актора на защищающегося бота;
 *   после разыгрыша защиты ход либо возвращается к человеку ТЕМ ЖЕ ключом
 *   (год:фаза:игрок:madTurn:turnSeq — turnSeq не меняется, пока ход не
 *   передан), либо уходит боту (не осталось действий). Карточка со старым
 *   ключом после атаки = ложное срабатывание; карточки с новым turnSeq —
 *   легитимные переходы хода, их не считаем.
 *
 * Если за 3 года охоты не случилось (не пришло двух «Хищников» или у бота
 * нет добычи) — WARN, а не FAIL: проверка не состоялась.
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave11-turn-blink.mjs
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  SHOTS,
  createRoomViaStore,
  dismissSpotlight,
  dismissTurnCard,
  openMenu,
  sleep,
  trackPage,
  waitPhase,
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
const check = (cond, msg) => (cond ? ok(msg) : fail(msg));
const shot = (page, name) => page.screenshot({ path: join(SHOTS, `wave11-${name}.png`) }).catch(() => {});

const snap = (page) =>
  page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      const st = s?.state;
      if (!st) return null;
      return {
        phase: st.phase,
        cur: st.currentPlayerId,
        me: st.humanId,
        pending: Boolean(st.pendingAttack),
        year: st.year,
        seq: st.turnSeq ?? 0,
      };
    })
    .catch(() => null);

const dispatch = (page, action) =>
  page
    .evaluate((a) => {
      const store = globalThis.__evoStore;
      if (!store) return false;
      store.getState().dispatch(a);
      return true;
    }, action)
    .catch(() => false);

/**
 * Счётчик появлений .turn-card: каждая карточка рождается С КЛЮЧОМ хода из
 * стора (turnSeq и пр.) — так отличаем ложную карточку старого ключа от
 * легитимной карточки нового перехода хода.
 */
async function armTurnCardCounter(page) {
  await page.evaluate(() => {
    window.__blinkProbe = { cards: [] };
    let seen = null;
    const scan = () => {
      const el = document.querySelector(".turn-card, .turn-card-closing");
      if (el && el !== seen) {
        const st = globalThis.__evoStore?.getState?.().state;
        window.__blinkProbe.cards.push({
          t: Date.now(),
          seq: st?.turnSeq ?? 0,
          cur: st?.currentPlayerId ?? -1,
          phase: st?.phase ?? "?",
        });
        seen = el;
      } else if (!el) {
        seen = null;
      }
    };
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    scan();
  });
}

const cardLog = (page) =>
  page
    .evaluate(() => (window.__blinkProbe ? [...window.__blinkProbe.cards] : []))
    .catch(() => []);

/** Ждёт свой ход в фазе (по стору), попутно закрывая диалоги защиты. */
async function waitMyPhase(page, phase, timeout) {
  return waitUntil(
    async () => {
      const s = await snap(page);
      if (!s) return false;
      if (s.phase === phase && s.cur === s.me && !s.pending) {
        await dismissTurnCard(page).catch(() => {});
        return true;
      }
      // Бот атакует наше животное: закрываем диалог защиты.
      const noDef = page.getByRole("button", { name: "Не защищаться" });
      if ((await noDef.count().catch(() => 0)) > 0) {
        await noDef
          .first()
          .evaluate((el) => {
            el.click();
            return true;
          })
          .catch(() => {});
      }
      return false;
    },
    timeout,
    500,
  );
}

const browser = await chromium.launch();
const errs = [];
try {
  console.log(`прогрев dev-сервера (${rel()})…`);
  await warmupServer(browser, { log: (m) => console.log(`       ${m}`) });
  ok("сервер прогрет");

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  errs.push(...trackPage(page, "blink"));
  await openMenu(page);
  const r = await createRoomViaStore(page, {
    name: "Охотник",
    capacity: 3,
    botSeats: 2,
    difficulty: "normal",
  });
  if (!r.ok) throw new Error(`стол не создан: ${r.error}`);
  await page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      if (s?.net) void s.netStart();
    })
    .catch(() => {});
  await waitPhase(page, ["development", "foodBank", "feeding"], 45_000);
  await dismissSpotlight(page);
  ok(`партия началась (стол ${r.code}, человек + 2 бота)`);

  let hunted = false;
  let blinkHappened = false;
  for (let year = 1; year <= 3 && !blinkHappened; year++) {
    // Год 1 начинается в развитии сразу; дальнейшие годы — после вымирания
    // и раздачи карт (фазы прокручивает сервер, ждём свою фазу развития).
    const devHere = await waitUntil(
      async () => {
        const s = await snap(page);
        return Boolean(s && (s.phase === "gameOver" || (s.phase === "development" && s.year === year)));
      },
      240_000,
      600,
    );
    if (!devHere) throw new Error(`фаза развития года ${year} не наступила`);
    if ((await snap(page))?.phase === "gameOver") {
      warn("партия завершилась — дальнейшие годы недоступны");
      break;
    }

    // ── Развитие: сетап «два хищника» по мере карт в руке. ──
    const devDeadline = Date.now() + 150_000;
    while (Date.now() < devDeadline) {
      const s = await snap(page);
      if (!s || s.year > year || s.phase !== "development") break;
      if (!(s.cur === s.me && !s.pending)) {
        await sleep(400);
        continue;
      }
      await dismissTurnCard(page).catch(() => {});
      // Один дев-шаг за круг: сначала животные, потом «Хищники» на них.
      const step = await page
        .evaluate(async () => {
          const engine = await import("/src/game/engine.ts");
          const store = globalThis.__evoStore;
          const st = store.getState().state;
          const acts = engine.legalDevActions(st, st.humanId);
          const animal = acts.find((a) => a.type === "devPlayAnimal");
          const mine = st.players[st.humanId].animals;
          const predator = mine.length > 0
            ? acts.find(
                (a) =>
                  a.type === "devPlayTrait" &&
                  st.players[st.humanId].hand
                    .find((c) => c.id === a.cardId)
                    ?.faces[a.face] === "carnivore",
              )
            : null;
          const pick = mine.length < 2 ? (animal ?? predator ?? null) : (predator ?? null);
          if (!pick) return { done: "нет шагов" };
          store.getState().dispatch(pick);
          return { done: "шаг" };
        })
        .catch(() => ({ done: "ошибка" }));
      if (step.done !== "шаг") {
        // Больше нечего выкладывать — пасуем и выходим из сетапа.
        await dispatch(page, { type: "devPass" });
        break;
      }
      // Шаг потратил ход: ждём возврата (бот ходит сам).
      await waitUntil(
        async () => {
          const x = await snap(page);
          return Boolean(x && (x.phase !== "development" || x.year > year || (x.cur === x.me && !x.pending)));
        },
        60_000,
        500,
      );
    }

    // ── Питание: легальная охота и проверка «моргания». ──
    // Счётчик вооружаем ДО прихода хода: карточка «Ваш ход» должна родиться
    // на переходе (положительный контроль), а не после наших кликов.
    await armTurnCardCounter(page);
    const feedTurn = await waitMyPhase(page, "feeding", 180_000);
    if (!feedTurn) {
      warn(`год ${year}: своего хода в питании не дождались`);
      continue;
    }
    await sleep(2200); // карточка прихода хода отжила свой срок
    const s0 = await snap(page);
    const key0 = s0?.seq ?? -1;
    const before = await cardLog(page);
    check(
      before.filter((c) => c.seq === key0).length >= 1,
      `год ${year}: положительный контроль — карточка «Ваш ход» на приходе хода показана`,
    );

    const huntInfo = await page
      .evaluate(async () => {
        const engine = await import("/src/game/engine.ts");
        const st = globalThis.__evoStore.getState().state;
        const acts = engine.legalFeedActions(st, st.humanId);
        return {
          hunt: acts.find((a) => a.type === "feedHunt") ?? null,
          huntCount: acts.filter((a) => a.type === "feedHunt").length,
          myAnimals: st.players[st.humanId].animals.map((a) => a.traits.map((t) => t.type)),
          others: st.players.filter((p) => p.id !== st.humanId).map((p) => p.animals.length),
          actTypes: [...new Set(acts.map((a) => a.type))],
        };
      })
      .catch(() => null);
    const hunt = huntInfo?.hunt ?? null;
    if (!hunt) {
      warn(
        `год ${year}: легальной охоты нет — мои животные: ${JSON.stringify(huntInfo?.myAnimals ?? [])}, ` +
          `чужих животных: ${JSON.stringify(huntInfo?.others ?? [])}, действия: ${JSON.stringify(huntInfo?.actTypes ?? [])}`,
      );
      await dispatch(page, { type: "feedSkip" });
      continue;
    }
    const tAttack = Date.now();
    await dispatch(page, hunt);
    ok(`год ${year}: атака отправлена (${hunt.carnivoreId} → ${hunt.preyId})`);

    // Атака переводит актора на защищающегося бота; сервер сам разыгрывает
    // защиту (паузы спотлайтов 2-3.4с), затем ход возвращается или уходит.
    await waitUntil(
      async () => {
        const s = await snap(page);
        return Boolean(s && s.pending);
      },
      15_000,
      300,
    ).then((seen) => {
      if (!seen) warn(`год ${year}: pendingAttack не наблюдался (атака разрешилась мгновенно)`);
    });
    const resolved = await waitUntil(
      async () => {
        const s = await snap(page);
        return Boolean(s && !s.pending && s.phase !== "gameOver");
      },
      90_000,
      400,
    );
    if (!resolved) throw new Error(`год ${year}: атака не разрешилась`);
    const afterResolve = await snap(page);
    blinkHappened = Boolean(afterResolve && afterResolve.cur === afterResolve.me && afterResolve.seq === key0);
    // Ход вернулся тем же ключом (второй хищник ещё может атаковать) —
    // закрываем ход сами, чтобы не мешать дальнейшему сценариию.
    if (blinkHappened) await dispatch(page, { type: "feedEndTurn" });
    await sleep(2800); // карточка живёт 1600мс + закрытие 200мс + запас

    const after = await cardLog(page);
    // Ложное срабатывание = карточка, рождённая ПОСЛЕ атаки со СТАРЫМ ключом
    // (turnSeq не менялся — это то же возвращение хода, а не новый переход).
    const falseCards = after.filter((c) => c.t > tAttack && c.seq === key0);
    const legitCards = after.filter((c) => c.t > tAttack && c.seq !== key0);
    check(
      falseCards.length === 0,
      `год ${year}: после своей атаки НЕ показано карточек со старым ключом (${falseCards.length} ложных)`,
    );
    if (blinkHappened) {
      check(true, `год ${year}: «моргание» произошло — ход вернулся тем же ключом (turnSeq=${key0}), карточки нет`);
    } else {
      warn(`год ${year}: ход после атаки ушёл боту — «моргание» в этом году не случилось (легитимных карточек дальше: ${legitCards.length})`);
    }
    if (falseCards.length > 0) await shot(page, "blink-false-positive");
    else await shot(page, "blink-clean");
    hunted = true;
  }

  if (!hunted) warn("охота так и не состоялась за 3 года — проверка моргания не прогнала (см. WARN выше)");

  for (const e of errs) fail(e);
  await ctx.close();
} catch (e) {
  fail(String(e?.message ?? e).split("\n")[0]);
  for (const e2 of errs) fail(e2);
} finally {
  await browser.close().catch(() => {});
}

console.log("");
if (problems.length) {
  console.log(`ИТОГ: FAIL (${problems.length})`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log("ИТОГ: OK — ложных карточек «Ваш ход» на своей атаке нет");
}
if (warnings.length) for (const w of warnings) console.log(`  warn: ${w}`);
