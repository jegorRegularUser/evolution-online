/**
 * QA #3/#4/#5: закрытие стола из одних ботов + кампания-забег.
 *
 *   a. Соло-стол (человек + бот): уход через верхнюю панель закрывает комнату
 *      НА СЕРВЕРЕ (списка столов больше нет, rejoin отказывает), клиент не
 *      возобновляет партию (?room снят, токен забыт, F5 не возвращает).
 *   b. Кнопка «Закрыть стол»: видна в соло-столе, диалог подтверждения работает
 *      (и «Отмена» тоже), комната удаляется; за столом с другим человеком
 *      кнопки нет, сервер отклоняет close-people.
 *   c. Кампания-рогалик: забег стартует без лобби и без серверной комнаты,
 *      HUD показывает путь эпохи, матч с полным стейтом живёт в localStorage,
 *      F5 возобновляет матч, «Продолжить» и «Сдать забег» работают.
 *
 * Запуск при живом dev-сервере: EVO_URL=http://127.0.0.1:8099 node scripts/qa-close-table-campaign.mjs
 */
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  bodyOf,
  confirmDialog,
  createRoomViaStore,
  dismissSpotlight,
  dismissTurnCard,
  ensureLobby,
  gotoUrl,
  isEnabled,
  isVisible,
  menuReady,
  newRuPage,
  openMenu,
  roomCode,
  safeClick,
  sleep,
  startNetGame,
  trackPage,
  waitPhase,
  waitUntil,
} from "./qa-lib.mjs";

mkdirSync(SHOTS, { recursive: true });

const problems = [];
const ok = (msg) => console.log(`OK: ${msg}`);
const fail = (msg) => {
  console.log(`FAIL: ${msg}`);
  problems.push(msg);
};
const assert = (cond, msg) => (cond ? ok(msg) : fail(msg));
const shot = (page, name) => page.screenshot({ path: join(SHOTS, name) }).catch(() => {});

/** Комнаты сервера глазами вкладки: список публичных столов. */
function roomsOf(page) {
  return page.evaluate(async () => {
    const api = await import("/src/lib/net/api.ts");
    const r = await api.netListRooms({ data: {} });
    return r.ok ? r.rooms.map((x) => x.code) : null;
  });
}

/** Прямой вызов закрытия с токеном вкладки (серверная валидация своими руками). */
function closeWithToken(page, code, token) {
  return page.evaluate(async ({ code, token }) => {
    const api = await import("/src/lib/net/api.ts");
    return api.netCloseTable({ data: { code, token } });
  }, { code, token });
}

/** Rejoin с сохранённым токеном: после закрытия обязан отказать. */
function rejoinWithToken(page, code, token) {
  return page.evaluate(async ({ code, token }) => {
    const api = await import("/src/lib/net/api.ts");
    return api.netRejoin({ data: { code, token } });
  }, { code, token });
}

/** Токен места вкладки. */
const seatToken = (page, code) => page.evaluate((c) => localStorage.getItem(`evo-seat-${c}`), code);

/** Нет ли ?room в адресе. */
const urlHasRoom = (page) =>
  page.evaluate(() => new URLSearchParams(window.location.search).has("room"));

const browser = await chromium.launch();

// ── прогрев dev-сервера: все serverFn с негодными данными ────────────────────
async function warmup() {
  const { page } = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
  await gotoUrl(page, `${BASE}/`);
  for (let round = 0; round < 4; round++) {
    await page
      .evaluate(async () => {
        const api = await import("/src/lib/net/api.ts");
        const code = "ZZZZ";
        const token = "0".repeat(32);
        const calls = [
          () => api.netCreateRoom({ data: { name: "Прогрев", capacity: 2, botSeats: 0, difficulty: "normal" } }),
          () => api.netJoinRoom({ data: { code, name: "Прогрев" } }),
          () => api.netListRooms({ data: {} }),
          () => api.netRejoin({ data: { code, token } }),
          () => api.netCloseTable({ data: { code, token } }),
          () => api.netResign({ data: { code, token } }),
          () => api.netPoll({ data: { code, token } }),
          () => api.netStart({ data: { code, token } }),
          () => api.netAgain({ data: { code, token } }),
        ];
        for (const call of calls) await call().catch(() => {});
      })
      .catch(() => {});
    await sleep(3000);
  }
  await page.close().catch(() => {});
}
await warmup();
ok("прогрев сервера выполнен");

// ══ a. Соло-стол: уход через верхнюю панель закрывает комнату ════════════════
{
  const { page } = await newRuPage(browser, { viewport: { width: 1440, height: 900 } });
  const errs = trackPage(page, "a");
  await openMenu(page);
  const code = await startNetGame(page, { name: "Соло", players: 2, bots: 1, difficulty: "easy" });
  ok(`a: соло-стол ${code} поднят, партия идёт`);
  const token = await seatToken(page, code);
  assert(Boolean(token), "a: player-token в localStorage до выхода");

  // Уход через верхнюю панель: кнопка «Покинуть стол» → диалог соло-выхода.
  const leaveBtn = page.getByRole("button", { name: "Покинуть стол", exact: true });
  assert(await isVisible(leaveBtn), "a: кнопка «Покинуть стол» видна");
  await dismissTurnCard(page);
  await safeClick(leaveBtn, 5000);
  assert(
    await confirmDialog(page, "Выйти и закрыть стол"),
    "a: диалог выхода подтверждён («Выйти и закрыть стол»)",
  );

  // Клиент: меню, без ?room, стор чист.
  const left = await waitUntil(async () => {
    const st = await page.evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      return { net: s?.net ?? null, mission: s?.tutorialMission ?? null, campaign: s?.campaignMission ?? null };
    });
    return st.net === null && !(await urlHasRoom(page)) && (await roomCode(page)) === null;
  }, 15_000, 400);
  assert(left, "a: клиент в меню, ?room снят, net=null");
  assert(!(await seatToken(page, code)), "a: player-token забыт");

  // Сервер: комнаты нет в списке, rejoin отказывает.
  const gone = await waitUntil(async () => !(await roomsOf(page))?.includes(code), 15_000, 500);
  assert(gone, "a: комната удалена на сервере (нет в списке столов)");
  const re = await rejoinWithToken(page, code, token);
  assert(re && re.ok === false, `a: rejoin по старому токену отказан (code=${re?.code})`);

  // F5 не возобновляет: свежая загрузка остаётся в меню.
  await gotoUrl(page, `${BASE}/`);
  assert(await menuReady(page), "a: после F5 — меню");
  assert(!(await urlHasRoom(page)), "a: ?room не вернулся после F5");
  assert(
    await page.evaluate(() => globalThis.__evoStore?.getState?.().net === null),
    "a: автопереподключения не было (net=null)",
  );

  await shot(page, "a-menu-after-leave.png");
  if (errs.length) fail(`a: ошибки вкладки: ${errs.join(" | ")}`);
  await page.close();
}

// ══ b. Кнопка «Закрыть стол» ═════════════════════════════════════════════════
{
  const { page } = await newRuPage(browser, { viewport: { width: 1440, height: 900 } });
  const errs = trackPage(page, "b");
  await openMenu(page);
  const code = await startNetGame(page, { name: "Закр", players: 2, bots: 1, difficulty: "easy" });
  ok(`b: соло-стол ${code} поднят`);

  const closeBtn = page.getByRole("button", { name: "Закрыть стол", exact: true });
  assert(await isVisible(closeBtn), "b: «Закрыть стол» видна в соло-столе");
  await dismissTurnCard(page);
  await shot(page, "b-close-button.png");

  await safeClick(closeBtn, 5000);
  const dialog = page.locator('[role="dialog"]').filter({ hasText: "Закрыть стол?" });
  assert(await waitUntil(() => isVisible(dialog), 5000, 200), "b: диалог подтверждения открыт");
  // Диалог появляется с анимацией: даём кадр дорисоваться, иначе скриншот пустой.
  await sleep(500);
  await shot(page, "b-close-confirm.png");

  // Отмена: стол жив.
  await safeClick(dialog.getByRole("button", { name: "Отмена", exact: true }), 4000);
  await sleep(500);
  assert(await isVisible(closeBtn), "b: «Отмена» — диалог закрылся, кнопка на месте");
  assert((await roomsOf(page))?.includes(code), "b: после отмены стол жив");

  // Подтверждение: комната удаляется.
  await safeClick(closeBtn, 5000);
  assert(await confirmDialog(page, "Закрыть стол"), "b: подтверждение «Закрыть стол»");
  const closed = await waitUntil(async () => !(await roomsOf(page))?.includes(code), 15_000, 500);
  assert(closed, "b: после подтверждения комната удалена на сервере");
  assert(
    await page.evaluate(() => globalThis.__evoStore?.getState?.().net === null),
    "b: клиент в меню после закрытия",
  );
  if (errs.length) fail(`b: ошибки вкладки: ${errs.join(" | ")}`);
  await page.close();

  // b2. За столом с другим человеком кнопки нет, сервер отклоняет.
  const { page: host } = await newRuPage(browser, { viewport: { width: 1440, height: 900 } });
  const { page: guest } = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
  const errs2 = [...trackPage(host, "b2-host"), ...trackPage(guest, "b2-guest")];
  await openMenu(host);
  const created = await createRoomViaStore(host, {
    name: "Люди",
    capacity: 2,
    botSeats: 0,
    difficulty: "normal",
  });
  if (!created.ok) throw new Error(`b2: стол не создан: ${created.error}`);
  const codeH = created.code;
  ok(`b2: стол на двоих ${codeH} создан`);
  assert(await ensureLobby(guest, codeH, "Гость", host), "b2: гость за столом");
  const start = host.getByRole("button", { name: "Начать год" });
  assert(await waitUntil(() => isEnabled(start), 20_000, 500), "b2: «Начать год» доступна");
  await safeClick(start, 5000);
  assert(await waitPhase(host, ["development", "foodBank"], 45_000), "b2: партия началась");
  await dismissSpotlight(host);
  await dismissSpotlight(guest);

  assert(
    !(await isVisible(host.getByRole("button", { name: "Закрыть стол", exact: true }))),
    "b2: за столом с человеком кнопки «Закрыть стол» нет",
  );

  const hostToken = await seatToken(host, codeH);
  const denied = await closeWithToken(host, codeH, hostToken);
  assert(
    denied && denied.ok === false && denied.code === "close-people",
    `b2: сервер отклонил закрытие (${denied?.code ?? JSON.stringify(denied)})`,
  );
  assert((await roomsOf(host))?.includes(codeH), "b2: стол с человеком не удалён");
  await shot(host, "b2-human-table-topbar.png");

  // Уборка: хост заменяет гостя ботом (партия), стол становится соло —
  // уход хоста закрывает его целиком (#3 на человеческом столе).
  await host.evaluate(() => globalThis.__evoStore.getState().netKick(1));
  await sleep(1200);
  await host.evaluate(() => globalThis.__evoStore.getState().leaveNet());
  const gone2 = await waitUntil(async () => !(await roomsOf(host))?.includes(codeH), 15_000, 500);
  assert(gone2, "b2: после замены ботом и ухода хоста стол закрыт");
  if (errs2.length) fail(`b2: ошибки вкладок: ${errs2.join(" | ")}`);
  await host.close().catch(() => {});
  await guest.close().catch(() => {});
}

// ══ c. Кампания-рогалик: забег за эпоху на чистом движке ════════════════════
{
  const { page } = await newRuPage(browser, { viewport: { width: 1440, height: 900 } });
  // /campaign читает сохранённый забег из localStorage: SSR рендерит «нет
  // забега», клиент — активный. К закрытию столов отношения не имеет — глушим.
  const errs = trackPage(page, "c", { ignore: [/Hydration failed/] });
  await gotoUrl(page, `${BASE}/campaign`);
  assert(
    await waitUntil(async () => (await page.getByText("Кембрий").count()) > 0, 20_000, 400),
    "c: страница кампании показывает эпохи",
  );

  // Старт забега: первая эпоха «Кембрий» → бой первого узла без лобби.
  const startBtn = page.getByRole("button", { name: "Новый забег", exact: true }).first();
  await safeClick(startBtn, 5000);
  assert(
    await waitUntil(
      async () => (await page.evaluate(() => globalThis.__evoStore?.getState?.().state)) !== null,
      30_000,
      500,
    ),
    "c: локальная партия открылась без лобби",
  );
  assert(await waitPhase(page, ["development", "foodBank"], 60_000), "c: партия забега началась");
  await dismissSpotlight(page);

  // Кампания живёт локально: серверных комнат за ней нет.
  const rooms = await roomsOf(page);
  assert(
    rooms !== null && !rooms.some((c) => String(c).startsWith("CAMP")),
    "c: забег не создаёт комнат на сервере",
  );

  // HUD забега: путь эпохи, первый узел «Молодое море», прогресс 1 из 5.
  // Поллинг, а не мгновенная проверка: роутерный переход «/campaign → /»
  // отстаёт от стора, стол с HUD монтируется на кадр позже state.
  const hudText = await waitUntil(async () => {
    const txt = await page.evaluate(
      () => document.querySelector('aside[aria-label="Кембрий"]')?.textContent ?? null,
    );
    return txt && txt.includes("Молодое море") && txt.includes("1/5") ? txt : null;
  }, 20_000, 400);
  assert(Boolean(hudText), "c: HUD забега виден: узел и прогресс пути");
  await sleep(600);
  await shot(page, "c-campaign-run.png");

  // Персист: полный стейт матча (с рукой) в localStorage.
  const runSaved = await page.evaluate(() => {
    const raw = localStorage.getItem("evo-campaign-run");
    const run = raw ? JSON.parse(raw) : null;
    return {
      status: run?.status ?? null,
      match: Boolean(run?.match),
      hand: run?.match?.state?.players?.[0]?.hand?.length ?? null,
    };
  });
  assert(
    runSaved.status === "active" && runSaved.match && typeof runSaved.hand === "number",
    `c: забег с матчем сохранён (${JSON.stringify(runSaved)})`,
  );

  // Уход со стола: матч приостановлен, забег жив, ?room не появился.
  await page.evaluate(() => globalThis.__evoStore.getState().leaveNet());
  assert(
    await waitUntil(
      async () => (await page.evaluate(() => globalThis.__evoStore?.getState?.().net)) === null,
      15_000,
      300,
    ),
    "c: стол закрыт, клиент в меню",
  );
  const kept = await page.evaluate(() => Boolean(localStorage.getItem("evo-campaign-run")));
  assert(kept, "c: забег пережил уход со стола");

  // F5 на «/» возобновляет матч автоматически (эффект GameApp).
  await gotoUrl(page, `${BASE}/`);
  assert(
    await waitUntil(
      async () => (await page.evaluate(() => globalThis.__evoStore?.getState?.().state)) !== null,
      30_000,
      500,
    ),
    "c: F5 вернул в матч забега",
  );
  await dismissSpotlight(page);
  await shot(page, "c-campaign-resumed.png");

  // Страница кампании после ухода: «Продолжить матч» и «Сдать забег».
  await page.evaluate(() => globalThis.__evoStore.getState().leaveNet());
  await gotoUrl(page, `${BASE}/campaign`);
  assert(
    await waitUntil(async () => (await page.getByText("Продолжить матч").count()) > 0, 20_000, 400),
    "c: страница кампании предлагает продолжить матч",
  );
  await shot(page, "c-campaign-page.png");

  // Сдать забег: сохранение снято, страница снова показывает эпохи.
  await safeClick(page.getByRole("button", { name: "Сдать забег", exact: true }), 5000);
  const cleared = await page.evaluate(() => localStorage.getItem("evo-campaign-run"));
  assert(cleared === null, "c: сдача забега снимает сохранение");
  assert(
    await waitUntil(async () => (await page.getByText("Новый забег").count()) > 0, 20_000, 400),
    "c: после сдачи страница показывает выбор эпохи",
  );
  if (errs.length) fail(`c: ошибки вкладки: ${errs.join(" | ")}`);
  await page.close();
}

await browser.close();

console.log("");
if (problems.length) {
  console.log(`ИТОГ: ПРОВАЛОВ ${problems.length}`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("ИТОГ: все проверки пройдены");
