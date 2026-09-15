/**
 * Волна 1, доки фаз (W1-B) — браузерная проба правок M8/M9/M15 в `game-app.tsx`:
 *
 *  M15. «Случайные мутации»: кнопки доков активны, счётчик колоды в доке
 *       совпадает с табло. Проверяем в СЕТЕВОЙ партии (там баг и жил:
 *       `views.ts` прячет `blindDeck`, оставляя `blindDeckCount`).
 *  M8.  В развитии ровно одна кнопка завершения хода — «Закончить развитие»,
 *       «Пас» в доке нет; ход по-прежнему завершается.
 *  M9.  В питании кнопка «Закончить питание»; подтверждение показывается и при
 *       голодных (прежний текст, danger), и при сытых; отмена возвращает в фазу.
 *
 * Соло-режим удалён (M1): обе партии — сетевые столы с ботом через
 * `startNetGame` из scripts/qa-lib.mjs. Сценарий «сытых» по-прежнему собирает
 * состояние движком в самой вкладке (в живом прогоне сытого игрока с законным
 * ходом не поймать), но теперь поверх сетевой сессии: поллинг замораживается,
 * чтобы серверный кадр не затёр крафт.
 *
 * Скриншоты — ТОЛЬКО вне репозитория: Tailwind в dev сканирует проект, и новый
 * PNG внутри него вызывает полный перезапуск вкладок (см. qa-net-lobby.mjs).
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave1-docks.mjs
 * Переменные: EVO_URL (по умолчанию http://127.0.0.1:8099/), EVO_SHOTS,
 * EVO_ONLY=mut|fed|net — прогнать один сценарий.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { startNetGame } from "./qa-lib.mjs";

const SHOTS = process.env.EVO_SHOTS ?? join(tmpdir(), "evo-wave1-docks");
mkdirSync(SHOTS, { recursive: true });

const report = { shots: SHOTS, steps: [], problems: [] };
const ok = (m) => {
  console.log("OK:", m);
  report.steps.push(m);
};
const fail = (m) => {
  console.log("FAIL:", m);
  report.problems.push(m);
  report.steps.push("FAIL: " + m);
};
const info = (m) => {
  console.log("   ", m);
  report.steps.push(m);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async (page, name) => {
  const path = join(SHOTS, `${name}.png`);
  await page.screenshot({ path }).catch(() => {});
  console.log("  скрин:", path);
  return path;
};

const browser = await chromium.launch();

async function evalSafe(page, expr, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      return await page.evaluate(expr);
    } catch {
      await sleep(600);
    }
  }
  return null;
}

/** Гасит модальную карточку события («Клик в любом месте — дальше»). */
async function dismissSpotlight(page) {
  for (let i = 0; i < 8; i++) {
    const txt = (await evalSafe(page, `document.body.innerText`)) ?? "";
    if (!txt.includes("Клик в любом месте")) return;
    await page.mouse.click(100, 300);
    await sleep(350);
  }
}

/** Кнопки футера-дока: тексты, доступность, подписи; счётчик колоды мутаций. */
const DOCK_PROBE = `(() => {
  const footer = document.querySelector("footer");
  if (!footer) return null;
  const btns = [...footer.querySelectorAll("button")].map((b) => ({
    text: (b.textContent || "").trim().replace(/\\s+/g, " "),
    disabled: !!b.disabled,
    aria: b.getAttribute("aria-label"),
    title: b.getAttribute("title"),
  }));
  const chip = footer.querySelector("[aria-label^='Колода:']");
  const deck = chip ? Number((chip.getAttribute("aria-label") || "").replace(/\\D+/g, "")) : null;
  return { btns, deck, text: (footer.innerText || "").replace(/\\s+/g, " ").slice(0, 400) };
})()`;

/** Табло «Ваша популяция»: сколько карт в слепой колоде показывает счётчик. */
const BOARD_PROBE = `(() => {
  const mine = [...document.querySelectorAll("[data-player-section]")].find((s) =>
    (s.textContent || "").includes("Ваша популяция"),
  );
  if (!mine) return null;
  const txt = (mine.textContent || "").replace(/\\s+/g, " ");
  const m = /колода\\s+(\\d+)/.exec(txt);
  const chip = mine.querySelector("img[title^='Слепая колода:']");
  return { deck: m ? Number(m[1]) : null, chipTitle: chip ? chip.getAttribute("title") : null, text: txt.slice(0, 160) };
})()`;

/** Модалка подтверждения (ConfirmDialog) — портал в body, role=dialog. */
const DIALOG_PROBE = `(() => {
  const d = document.querySelector("[role='dialog']");
  if (!d) return null;
  const btns = [...d.querySelectorAll("button")].map((b) => ({
    text: (b.textContent || "").trim(),
    danger: String(b.className || "").includes("bg-danger") || b.getAttribute("data-variant") === "danger",
    cls: String(b.className || "").slice(0, 80),
  }));
  return { title: d.querySelector("h2")?.textContent?.trim() ?? "", body: (d.innerText || "").replace(/\\n+/g, " | "), btns };
})()`;

const dockBtns = (dock, re) => (dock?.btns ?? []).filter((b) => re.test(b.text));

/** Кнопка внутри футера по точному доступному имени. */
function footerBtn(page, name) {
  return page.locator("footer").getByRole("button", { name, exact: true }).first();
}

/** Ждём в футере кнопку с данным именем (и, если надо, активную). */
async function waitFooterBtn(page, name, { enabled = true, timeout = 60_000 } = {}) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    await dismissSpotlight(page);
    const btn = footerBtn(page, name);
    if (await btn.isVisible().catch(() => false)) {
      if (!enabled || (await btn.isEnabled().catch(() => false))) return true;
    }
    await sleep(400);
  }
  return false;
}

/** Пока фаза не сменится на нужную — завершаем свой ход доступной кнопкой. */
async function advanceUntil(page, needle, ms, clickNames = ["Закончить развитие", "Закончить ход"]) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    const body = (await evalSafe(page, `document.body.innerText`)) ?? "";
    if (body.includes(needle)) return true;
    await dismissSpotlight(page);
    for (const name of clickNames) {
      const btn = footerBtn(page, name);
      if ((await btn.isVisible().catch(() => false)) && (await btn.isEnabled().catch(() => false))) {
        await btn.click({ timeout: 3000 }).catch(() => {});
        await sleep(200);
      }
    }
    await sleep(350);
  }
  return false;
}

// ────────────────────────────────────────────────────────────────────────────
// Сценарий 1 (сеть): «Случайные мутации» + M8 + M9 (голодные)
// ────────────────────────────────────────────────────────────────────────────
async function mutationsScenario() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => fail("PAGEERROR (мутации): " + e.message));
  // Сетевой стол с ботом и «Случайными мутациями» — соло-режим удалён (M1).
  await startNetGame(page, {
    name: "Доки-мутации",
    players: 2,
    bots: 1,
    modules: { randomMutations: true },
  });
  await dismissSpotlight(page);
  info("мутации: сетевой стол поднят");

  // Ждём свой ход в развитии: кнопка завершения активна.
  const myTurn = await waitFooterBtn(page, "Закончить развитие", { enabled: true, timeout: 45_000 });
  myTurn ? ok("мутации: развитие, мой ход") : fail("мутации: не дождались своего хода в развитии");
  await dismissSpotlight(page);
  await sleep(400);

  const dock = await evalSafe(page, DOCK_PROBE);
  const board = await evalSafe(page, BOARD_PROBE);
  info("мутации док: " + JSON.stringify({ deck: dock?.deck, btns: dock?.btns?.map((b) => `${b.text}${b.disabled ? "[disabled]" : ""}`) }));
  info("мутации табло: " + JSON.stringify(board));
  report.mutDev = { dock, board };

  // M15: счётчик в доке = счётчику на табло.
  if (dock?.deck !== null && dock?.deck !== undefined && board?.deck !== null && board?.deck !== undefined) {
    dock.deck === board.deck
      ? ok(`мутации: счётчик колоды в доке (${dock.deck}) совпадает с табло (${board.deck})`)
      : fail(`мутации: счётчики колоды разошлись — док ${dock.deck}, табло ${board.deck}`);
  } else {
    fail("мутации: счётчик колоды не найден (док/табло)");
  }
  const mutBtns = dockBtns(dock, /Свойство|животное виду|Новый вид/);
  const liveMut = mutBtns.filter((b) => !b.disabled);
  mutBtns.length >= 3 && liveMut.length === mutBtns.length
    ? ok(`мутации: кнопки мутаций активны (${liveMut.length}/${mutBtns.length}), карт в колоде ${dock?.deck}`)
    : fail(`мутации: кнопки мутаций не все активны — ${JSON.stringify(mutBtns)}`);

  // M8: в развитии ровно одна кнопка завершения хода и нет «Паса».
  const ends = dockBtns(dock, /Закончить развитие/);
  const passes = dockBtns(dock, /^Пас$/);
  ends.length === 1
    ? ok("мутации: в развитии ровно одна кнопка завершения хода («Закончить развитие»)")
    : fail(`мутации: кнопок «Закончить развитие» — ${ends.length}, ожидалась одна`);
  passes.length === 0 ? ok("мутации: в развитии кнопки «Пас» нет") : fail("мутации: кнопка «Пас» всё ещё в доке развития");
  await shot(page, "01-mutations-dev");

  // M15 (дело): жмём «Новый вид» — карта обязана вскрыться и колода уменьшиться.
  const newAnimal = page.locator("footer").getByRole("button", { name: /Новый вид/ }).first();
  const deckBefore = board?.deck ?? null;
  if (await newAnimal.isEnabled().catch(() => false)) {
    await newAnimal.click({ timeout: 4000 }).catch(() => {});
    await sleep(1800);
    await dismissSpotlight(page);
    const after = await evalSafe(page, BOARD_PROBE);
    const played = (await evalSafe(page, `document.body.innerText`)) ?? "";
    const deckDropped = deckBefore !== null && after?.deck !== null && after?.deck !== undefined && after.deck === deckBefore - 1;
    deckDropped
      ? ok(`мутации: «Новый вид» сыграл карту — колода ${deckBefore} → ${after.deck}`)
      : info(`мутации: после «Новый вид» колода: ${deckBefore} → ${after?.deck ?? "?"}${played.includes("мутация") ? " (в логе мутация)" : ""}`);
    report.mutPlay = { deckBefore, deckAfter: after?.deck ?? null };
    await shot(page, "02-mutations-played");
  } else {
    fail("мутации: кнопка «Новый вид» недоступна при непустой колоде");
  }

  // Доходим до питания: если ход у бота, advanceUntil сам дощёлкает развитие.
  const fed = await advanceUntil(page, "Закончить питание", 120_000);
  fed ? ok("мутации: дошли до фазы питания") : fail("мутации: не дошли до питания за 120 с");
  await sleep(600);
  await dismissSpotlight(page);
  const feedDock = await evalSafe(page, DOCK_PROBE);
  report.mutFeed = feedDock;
  const feedEnd = dockBtns(feedDock, /Закончить питание/);
  const feedPass = dockBtns(feedDock, /^Пас$/);
  feedEnd.length === 1
    ? ok("мутации: в питании кнопка называется «Закончить питание»")
    : fail(`мутации: кнопки «Закончить питание» — ${feedEnd.length}, ожидалась одна`);
  feedPass.length === 0 ? ok("мутации: в питании кнопки «Пас» нет") : fail("мутации: «Пас» остался в доке питания");
  await shot(page, "03-feeding-end");

  // M9: подтверждение; отмена возвращает в фазу.
  const feedBtn = footerBtn(page, "Закончить питание");
  await feedBtn.click({ timeout: 4000 }).catch(() => {});
  await sleep(500);
  const dlg = await evalSafe(page, DIALOG_PROBE);
  info("мутации диалог: " + JSON.stringify(dlg));
  report.mutDialogHungry = dlg;
  if (dlg) {
    const isHungry = /Не накормлено/.test(dlg.body);
    const danger = dlg.btns.some((b) => b.danger);
    isHungry
      ? ok(`мутации: диалог при голодных — «${dlg.title}» / «${dlg.body}»`)
      : fail("мутации: в диалоге нет текста про не накормленных");
    danger ? ok("мутации: подтверждение при голодных — тон danger") : info("мутации: danger-класс не распознан, проверьте вручную");
    await shot(page, "04-feeding-dialog-hungry");
    const cancel = page.getByRole("button", { name: "Вернуться к ходу", exact: true });
    await cancel.click({ timeout: 4000 }).catch(() => {});
    await sleep(600);
    const afterCancel = await evalSafe(page, DOCK_PROBE);
    const stillFeed = (afterCancel?.text ?? "").includes("Закончить питание");
    const dialogGone = !(await evalSafe(page, `!!document.querySelector("[role='dialog']")`));
    stillFeed && dialogGone
      ? ok("мутации: отмена вернула в фазу питания и ничего не изменила")
      : fail(`мутации: после отмены фаза потеряна (док: ${afterCancel?.text})`);
  } else {
    fail("мутации: диалог подтверждения не появился");
  }

  // Подтверждаем — ход/фаза обязаны уйти дальше (сервер применяет feedSkip).
  await feedBtn.click({ timeout: 4000 }).catch(() => {});
  await sleep(500);
  const confirm = page.getByRole("button", { name: "Закончить питание", exact: true });
  // В диалоге имя то же, что и у кнопки дока: берём последнюю (портал в body).
  await confirm.last().click({ timeout: 4000 }).catch(() => {});
  await sleep(1200);
  const afterSkip = (await evalSafe(page, `document.body.innerText`)) ?? "";
  const phaseGone = !afterSkip.includes("Закончить питание") || /Вымирание|Рост|Кормовая база|Итог/.test(afterSkip);
  phaseGone
    ? ok("мутации: подтверждение завершило питание — фаза ушла дальше")
    : info("мутации: после подтверждения док питания ещё виден (возможен ход бота)");
  await shot(page, "05-after-skip");
  await ctx.close();
}

// ────────────────────────────────────────────────────────────────────────────
// Сценарий 1b (сеть, крафт): DevDock без «Паса» и диалог «сытых»
//
// «Сытых» в живом прогоне не поймать: движок пропускает ход игрока, которому
// некого кормить (`hasFreshAction`), и док питания ему просто не показывается.
// Поэтому состояние собирается движком в самой вкладке: сытый вид с жировым
// запасом — голодных ноль, но ход остаётся за игроком (жир — свободное
// действие), и «Закончить питание» доступно.
//
// Поверх сетевой сессии: поллинг стола замораживается (route-обрыв POST'ов с
// кодом стола), иначе серверный кадр затрёт крафт через ~секунду. Серверное
// применение паса в этом сценарии не проверяем — крафт живёт только на клиенте;
// реальный пас проверяет сценарий «мутации» выше и сетевые сценарии волны.
// ────────────────────────────────────────────────────────────────────────────
async function fedScenario() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  // Поллинг замораживается обрывом POST'ов, и вызванный кнопкой запрос паса
  // отклоняется — «Failed to fetch» здесь ожидаемый артефакт заморозки.
  let frozen = false;
  page.on("pageerror", (e) => {
    const msg = String(e?.message ?? e);
    if (frozen && /Failed to fetch/i.test(msg)) return;
    fail("PAGEERROR (сытые): " + msg);
  });
  const code = await startNetGame(page, { name: "Доки-сытые", players: 2, bots: 1 });
  await dismissSpotlight(page);
  info(`сытые: сетевой стол ${code} поднят`);

  // Ждём свой ход в развитии, чтобы UI партии был смонтирован.
  const myTurn = await waitFooterBtn(page, "Закончить развитие", { enabled: true, timeout: 45_000 });
  myTurn ? ok("сытые (база): развитие, мой ход") : fail("сытые (база): не дождались хода в развитии");
  await sleep(300);
  const devDock = await evalSafe(page, DOCK_PROBE);
  report.fedPlainDev = devDock;
  dockBtns(devDock, /Закончить развитие/).length === 1
    ? ok("сытые (DevDock): ровно одна кнопка завершения хода")
    : fail(`сытые (DevDock): кнопок завершения — ${dockBtns(devDock, /Закончить развитие/).length}`);
  dockBtns(devDock, /^Пас$/).length === 0
    ? ok("сытые (DevDock): кнопки «Пас» нет")
    : fail("сытые (DevDock): «Пас» остался");
  await shot(page, "06-plain-dev");

  // Замораживаем серверные кадры этого стола: крафт живёт, пока поллинг молчит.
  frozen = true;
  await page.route("**/*", (route) => {
    const req = route.request();
    if (req.method() === "POST" && (req.postData() ?? "").includes(code)) return route.abort();
    return route.continue();
  });
  info("сытые: поллинг стола заморожен перед крафтом");

  // Крафт состояния: доходим движком до питания, оставляем сытый вид с жиром.
  const built = await evalSafe(
    page,
    `(async () => {
      try {
        const mod = await import("/src/game/engine.ts");
        const q = await import("/src/game/queries.ts");
        let g = mod.createGame(2, "normal", 20260914);
        let guard = 0;
        while (g.phase === "development" && guard++ < 400) {
          const acts = mod.legalDevActions(g, g.currentPlayerId);
          const play = g.currentPlayerId === g.humanId ? acts.find((a) => a.type === "devPlayAnimal") : null;
          const pass = acts.find((a) => a.type === "devPass");
          if (play) g = mod.applyAction(g, play);
          else if (pass) g = mod.applyAction(g, pass);
          else break;
        }
        if (g.phase === "foodBank") {
          g = mod.applyAction(g, { type: "rollFoodBank" });
          g = mod.applyAction(g, { type: "beginFeeding" });
        }
        const h = g.players[g.humanId];
        if (!h.animals.length) return { error: "у человека нет животных", phase: g.phase };
        const a = h.animals[0];
        h.animals = [a];
        a.population = 1;
        // Два пустых жировых слота: вид накормлен (голодных ноль), но у игрока
        // есть ход — можно копить жир; движок такой ход не пропускает.
        a.traits = [
          { id: "qa-fat-1", cardId: "qa-fat-card-1", type: "fatTissue", hidden: false, playSeq: 1 },
          { id: "qa-fat-2", cardId: "qa-fat-card-2", type: "fatTissue", hidden: false, playSeq: 2 },
        ];
        a.food = q.foodNeeded(a, true);
        a.fatTokens = 0;
        g.currentPlayerId = g.humanId;
        g.pendingAttack = null;
        g.rageTurn = null;
        g.madTurn = undefined;
        const hungry = h.animals.reduce((n, an) => {
          if (q.isFed(an, true)) return n;
          const pop = an.population ?? 1;
          const need = q.foodNeeded(an, true);
          const fedN = need > 0 ? Math.min(pop, Math.floor(an.food / need)) : 0;
          return n + Math.max(0, pop - fedN);
        }, 0);
        const types = [...new Set(mod.legalFeedActions(g, g.humanId).map((x) => x.type))];
        // mode: "solo" из соло-эпохи больше не существует; состояние кладём в
        // тот же стор, net-сессия остаётся (её кадры заморожены роутом).
        window.__evoStore.setState({ state: g, thinking: false, intent: { kind: "none" } });
        return {
          phase: g.phase,
          animals: h.animals.length,
          need: q.foodNeeded(a, true),
          food: a.food,
          fat: a.fatTokens,
          hungry,
          legalActions: types,
          freshAction: types.some((x) => x !== "feedSkip" && x !== "feedEndTurn"),
        };
      } catch (e) {
        return { error: String(e && e.stack ? e.stack : e) };
      }
    })()`,
  );
  info("сытые состояние: " + JSON.stringify(built));
  report.fedState = built;
  if (built?.error) fail("сытые: " + built.error);
  built?.hungry === 0 && built?.freshAction
    ? ok(`сытые: голодных 0, но ход легален (${built.legalActions?.join(", ")})`)
    : fail(`сытые: состояние не то — ${JSON.stringify(built)}`);
  await sleep(800);
  await dismissSpotlight(page);
  const fedDock = await evalSafe(page, DOCK_PROBE);
  info("сытые док: " + JSON.stringify({ deck: fedDock?.deck, btns: fedDock?.btns?.map((b) => `${b.text}${b.disabled ? "[disabled]" : ""}`) }));
  report.fedDock = fedDock;
  const feedBtn = footerBtn(page, "Закончить питание");
  await feedBtn.waitFor({ timeout: 10_000 }).catch(() => {});
  if (!(await feedBtn.isVisible().catch(() => false))) {
    fail("сытые: док питания не показался на сытом состоянии");
  } else {
    ok("сытые: док питания показан при нуле голодных");
    await shot(page, "07-fed-dock");
    await feedBtn.click({ timeout: 4000 }).catch(() => {});
    await sleep(500);
    const dlg = await evalSafe(page, DIALOG_PROBE);
    info("сытые диалог: " + JSON.stringify(dlg));
    report.fedDialog = dlg;
    if (dlg) {
      const fedText = /Все животные сыты/.test(dlg.body);
      const danger = dlg.btns.some((b) => b.danger);
      fedText
        ? ok(`сытые: диалог — «${dlg.title}» / «${dlg.body}»`)
        : fail(`сытые: неожиданный текст диалога — «${dlg.body}»`);
      !danger ? ok("сытые: подтверждение без danger-тона") : fail("сытые: подтверждение осталось danger");
      await shot(page, "08-feeding-dialog-fed");
      await page.getByRole("button", { name: "Вернуться к ходу", exact: true }).click({ timeout: 4000 }).catch(() => {});
      await sleep(600);
      const stillFeed = (await evalSafe(page, DOCK_PROBE))?.text?.includes("Закончить питание");
      stillFeed ? ok("сытые: отмена вернула в фазу питания") : fail("сытые: после отмены фаза потеряна");
      await feedBtn.click({ timeout: 4000 }).catch(() => {});
      await sleep(500);
      await page.getByRole("button", { name: "Закончить питание", exact: true }).last().click({ timeout: 4000 }).catch(() => {});
      await sleep(1200);
      const passed = await evalSafe(
        page,
        `(() => {
          const d = document.querySelector("[role='dialog']");
          return { dialog: !!d, body: (document.body.innerText || "").includes("Закончить питание") };
        })()`,
      );
      info("сытые после подтверждения: " + JSON.stringify(passed));
      !passed?.dialog
        ? ok("сытые: подтверждение закрыло диалог (пас ушёл на замороженный сервер — серверная часть проверена сценарием «мутации»)")
        : fail(`сытые: диалог не закрылся — ${JSON.stringify(passed)}`);
      await shot(page, "09-fed-after-skip");
    } else {
      fail("сытые: диалог подтверждения не появился");
    }
  }
  await ctx.close();
}

// ────────────────────────────────────────────────────────────────────────────
// Сценарий 2 (сеть): M15 на сетевом снимке — там баг и жил
// ────────────────────────────────────────────────────────────────────────────
async function netScenario() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => fail("PAGEERROR (сеть): " + e.message));
  const code = await startNetGame(page, {
    name: "Проба Доков",
    players: 2,
    bots: 1,
    modules: { randomMutations: true },
  });
  ok(`сеть: стол ${code} создан и партия началась`);
  await dismissSpotlight(page);
  await sleep(500);
  await shot(page, "10-net-table-mutations");

  const started = await waitFooterBtn(page, "Закончить развитие", { enabled: false, timeout: 60_000 }).catch(() => false);
  started ? ok("сеть: партия началась (док развития виден)") : fail("сеть: док развития не появился за 60 с");
  await dismissSpotlight(page);
  await sleep(500);
  await shot(page, "11-net-dev-dock");

  // Ждём свой ход (кнопка активна) и сверяем счётчики.
  const myTurn = await waitFooterBtn(page, "Закончить развитие", { enabled: true, timeout: 60_000 });
  myTurn ? ok("сеть: мой ход в развитии") : fail("сеть: свой ход в развитии не дождались");
  await dismissSpotlight(page);
  await sleep(400);
  const dock = await evalSafe(page, DOCK_PROBE);
  const board = await evalSafe(page, BOARD_PROBE);
  info("сеть док: " + JSON.stringify({ deck: dock?.deck, btns: dock?.btns?.map((b) => `${b.text}${b.disabled ? "[disabled]" : ""}`) }));
  info("сеть табло: " + JSON.stringify(board));
  report.netDev = { dock, board, code };

  // Главная проверка M15: в сетевом снимке blindDeck пуст, но кнопки живы.
  if (dock?.deck != null && board?.deck != null) {
    dock.deck === board.deck
      ? ok(`сеть: счётчик колоды в доке (${dock.deck}) совпадает с табло (${board.deck})`)
      : fail(`сеть: счётчики колоды разошлись — док ${dock.deck}, табло ${board.deck}`);
  } else {
    fail("сеть: счётчик колоды не найден");
  }
  const mutBtns = dockBtns(dock, /Свойство|животное виду|Новый вид/);
  const live = mutBtns.filter((b) => !b.disabled);
  mutBtns.length >= 3 && live.length === mutBtns.length
    ? ok(`сеть: M15 починен — кнопки мутаций активны (${live.length}/${mutBtns.length}), карт ${dock?.deck}`)
    : fail(`сеть: M15 всё ещё болен — ${JSON.stringify(mutBtns)}`);

  // Улика: в сетевом снимке колода действительно спрятана (`blindDeck: []`),
  // число лежит только в `blindDeckCount` — старый порядок чтения давал 0.
  const raw = await evalSafe(
    page,
    `(() => {
      const s = window.__evoStore.getState().state;
      const h = s?.players?.find((p) => p.id === s.humanId);
      return h ? { humanId: s.humanId, blindDeck: h.blindDeck?.length ?? null, blindDeckCount: h.blindDeckCount ?? null } : null;
    })()`,
  );
  info("сеть снимок: " + JSON.stringify(raw));
  report.netSnapshot = raw;
  raw && raw.blindDeck === 0 && raw.blindDeckCount > 0
    ? ok(`сеть: blindDeck пуст (0), blindDeckCount=${raw.blindDeckCount} — старый код читал бы 0 и гасил кнопки`)
    : fail(`сеть: ожидали blindDeck=0 и blindDeckCount>0, получили ${JSON.stringify(raw)}`);

  // M8 в сети: одна кнопка завершения, без «Паса».
  dockBtns(dock, /Закончить развитие/).length === 1
    ? ok("сеть: в развитии ровно одна кнопка завершения хода")
    : fail(`сеть: кнопок завершения — ${dockBtns(dock, /Закончить развитие/).length}`);
  dockBtns(dock, /^Пас$/).length === 0 ? ok("сеть: в развитии «Паса» нет") : fail("сеть: «Пас» в сетевом доке развития");

  // Клиентский список ходов на сетевом снимке: колода спрятана, поэтому
  // legalDevActions не видит devMutate — клики по животным молчат.
  const clientActs = await evalSafe(
    page,
    `(async () => {
      const mod = await import("/src/game/engine.ts");
      const s = window.__evoStore.getState().state;
      return mod.legalDevActions(s, s.humanId).map((a) => a.type + (a.intent ? ":" + a.intent : ""));
    })()`,
  );
  info("сеть devActs клиента: " + JSON.stringify(clientActs));
  report.netClientActs = clientActs;

  // Играем карту: колода должна уменьшиться (кнопка реально работает).
  const before = board?.deck ?? null;
  const newAnimal = page.locator("footer").getByRole("button", { name: /Новый вид/ }).first();
  if (await newAnimal.isEnabled().catch(() => false)) {
    await newAnimal.click({ timeout: 4000 }).catch(() => {});
    await sleep(2500);
    await dismissSpotlight(page);
    const after = await evalSafe(page, BOARD_PROBE);
    const dockAfter = await evalSafe(page, DOCK_PROBE);
    (before !== null && after?.deck === before - 1) || (dockAfter?.deck === (before ?? 0) - 1)
      ? ok(`сеть: карта мутации вскрылась — колода ${before} → ${after?.deck ?? dockAfter?.deck}`)
      : info(`сеть: после розыгрыша колода: ${before} → ${after?.deck ?? dockAfter?.deck ?? "?"}`);
    report.netPlay = { deckBefore: before, deckAfter: after?.deck ?? null };
    await shot(page, "12-net-mutations-played");

    // Второй розыгрыш — «Свойство»: колода обязана уменьшиться ещё раз.
    const deckNow = after?.deck ?? dockAfter?.deck ?? null;
    const traitBtn = page.locator("footer").getByRole("button", { name: /^Свойство/ }).first();
    if (deckNow !== null && (await traitBtn.isEnabled().catch(() => false))) {
      await traitBtn.click({ timeout: 4000 }).catch(() => {});
      await sleep(400);
      const myAnimal = page
        .locator("[data-player-section]")
        .filter({ hasText: "Ваша популяция" })
        .locator("[data-animal-id]")
        .first();
      if (await myAnimal.count()) {
        await myAnimal.click({ timeout: 4000 }).catch(() => {});
        await sleep(2500);
        await dismissSpotlight(page);
        const afterTrait = await evalSafe(page, BOARD_PROBE);
        afterTrait?.deck === deckNow - 1
          ? ok(`сеть: «Свойство» разыграло карту — колода ${deckNow} → ${afterTrait.deck}`)
          : info(`сеть: после «Свойства» колода: ${deckNow} → ${afterTrait?.deck ?? "?"}`);
        report.netTrait = { deckBefore: deckNow, deckAfter: afterTrait?.deck ?? null };
        await shot(page, "13-net-trait-played");
      } else {
        info("сеть: животное на табло не найдено — «Свойство» не проверили");
      }
    }
  } else {
    fail("сеть: кнопка «Новый вид» недоступна при непустой колоде");
  }
  await ctx.close();
}

try {
  const only = process.env.EVO_ONLY ?? "";
  if (!only || only === "mut") await mutationsScenario();
  if (!only || only === "fed") await fedScenario();
  if (!only || only === "net") await netScenario();
} catch (e) {
  fail("EXCEPTION: " + (e?.stack ?? e));
} finally {
  writeFileSync(join(SHOTS, "report.json"), JSON.stringify(report, null, 2));
  console.log("\n=== ИТОГ ===");
  console.log("проблем:", report.problems.length);
  report.problems.forEach((p) => console.log(" -", p));
  console.log("скриншоты:", SHOTS);
  await browser.close();
  process.exitCode = report.problems.length ? 1 : 0;
}
