/**
 * Полный прогон «автоигрой»: ПОЛНАЯ ПАРТИЯ ПРОТИВ БОТОВ ЧЕРЕЗ СЕТЕВОЙ СТОЛ
 * (раньше это был соло-прогон из меню; соло-режим удалён, M1 — имя файла
 * оставлено, чтобы не рвать ссылки в отчётах и реестрах). Партия поднимается
 * столом на 2 места, где второе занимает бот; проверяются автоматические
 * действия в развитии и питании, запись паса в журнале, финальный счёт с
 * разбивкой, кнопки «В меню» и «Ещё партия». Сценарии, которые могли не
 * встретиться за прогон (голодная смерть, мимикрия, спячка, пиратство), дают
 * WARN, а не FAIL.
 *
 * Запуск при живом dev-сервере: node scripts/qa-solo-full.mjs
 * Переменные окружения: EVO_URL (по умолчанию http://127.0.0.1:8099/),
 * EVO_SOLO_BUDGET_MS — бюджет первой партии в миллисекундах.
 */
import { chromium } from "playwright";
import { menuReady, phaseOf, shotsDir, startNetGame } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
// Скриншоты — вне репозитория (по умолчанию временная папка): PNG в
// artifacts/ дёргал Tailwind в dev и перезагружал вкладки. Переопределяется
// переменной EVO_SHOTS.
const SHOTS = shotsDir();

// Жёсткие бюджеты: партия обязана дойти до финала за это время, иначе FAIL
// с внятным сообщением, а не вечное ожидание.
const GAME1_BUDGET_MS = Number(process.env.EVO_SOLO_BUDGET_MS ?? 300_000);
const GAME2_BUDGET_MS = 240_000;

const problems = [];
const warnings = [];
const ok = (msg) => console.log("OK:", msg);
const warn = (msg) => {
  console.log("WARN:", msg);
  warnings.push(msg);
};
const fail = (msg) => {
  console.log("FAIL:", msg);
  problems.push(msg);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Тайминги подшагов автоигры: включаются переменной EVO_SOLO_DEBUG=1. */
const dbg = process.env.EVO_SOLO_DEBUG === "1";
async function traced(label, fn) {
  if (!dbg) return fn();
  const t0 = Date.now();
  const r = await fn();
  const dt = Date.now() - t0;
  if (dt > 300) console.log(`    · ${label}: ${dt}мс`);
  return r;
}

// ── Необязательные сценарии: не встретились — предупреждаем, не проваливаем ──
const SCENARIOS = {
  starvation: { label: "смерть в конце питания (голод)", re: /не накормлено/ },
  mimicry: { label: "мимикрия", re: /Мимикрия перенаправляет/ },
  hibernation: { label: "спячка", re: /использует спячку/ },
  piracy: { label: "пиратство", re: /пиратствует/ },
};
const seen = Object.fromEntries(Object.keys(SCENARIOS).map((k) => [k, false]));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Ошибки страницы: дедуплицируем, чтобы одна и та же не забивала отчёт.
const reportedErrors = new Set();
page.on("pageerror", (e) => {
  const key = `pageerror: ${e.message}`;
  if (reportedErrors.has(key)) return;
  reportedErrors.add(key);
  fail(`PAGEERROR: ${e.message}`);
});
page.on("console", (m) => {
  if (m.type() !== "error") return;
  const t = m.text();
  // Шум dev-сервера: иконка, девтулзы и обрывы HMR-сокета/навигации при
  // перезагрузках Vite, которые случаются, пока другие агенты правят файлы.
  if (/favicon|Download the React DevTools|WebSocket connection to .*8099|net::ERR_ABORTED/.test(t)) return;
  const key = `console: ${t}`;
  if (reportedErrors.has(key)) return;
  reportedErrors.add(key);
  fail(`console: ${t.slice(0, 200)}`);
});

// ── Помощники ───────────────────────────────────────────────────────────────
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

const finalTitle = () => page.getByText("Конец эволюции").first();
/** Меню на экране? В соло-меню была кнопка «Начать год», теперь маркер —
 *  поле имени сетевой секции, а признак «мы не в партии» — отсутствие фазы. */
const inMenu = async () =>
  (await phaseOf(page)) === null &&
  (await isVisible(page.getByLabel("Ваше имя")));

/** Год и фаза из шапки стола — для внятных сообщений о зависании. */
async function headerState() {
  // Первый header — шапка стола; второй живёт внутри панели журнала,
  // поэтому locator без .first() падал на strict mode и давал «год NaN».
  const text = await page
    .locator("header")
    .first()
    .innerText()
    .catch(() => "");
  const year = Number((text.match(/Год\s+(\d+)/) ?? [])[1] ?? NaN);
  const phase =
    ["Развитие", "Кормовая база", "Питание", "Вымирание", "Рост", "Итог"].find((p) => text.includes(p)) ??
    "?";
  return { year, phase };
}

/**
 * Поднять сетевой стол против ботов: 2 места, второе у бота, короткая колода
 * (deckSize) и быстрый темп. Раньше здесь были соло-настройки в меню —
 * «Игроков за столом» и слайдер колоды удалены вместе с соло-режимом (M1).
 */
async function startTable({ players = 2, deck = 20 } = {}) {
  await menuReady(page, 30_000).catch(() => {});
  const code = await startNetGame(page, {
    name: "Полный",
    players,
    bots: players - 1,
    deckSize: deck,
  });
  await tuneFast();
  // Подпись колоды больше не в меню, а в настройках стола: сверяемся со стором.
  const settings = await page
    .evaluate(() => globalThis.__evoStore?.getState?.().net?.settings ?? null)
    .catch(() => null);
  return `стол ${code}, колода ${settings?.deckSize ?? "полная"}`;
}

/** Быстрый темп: кнопка в шапке партии + экшен стора (dev-проба гидратации). */
async function tuneFast() {
  const fast = page.getByRole("button", { name: "Быстро", exact: true });
  for (let i = 0; i < 8; i++) {
    if (!(await fast.count())) break; // не в партии
    const speed = await page.evaluate(() => localStorage.getItem("evo-speed")).catch(() => null);
    if (speed === "fast") break;
    await safeClick(fast, 2000);
    await sleep(500);
  }
  await page
    .evaluate(() => {
      globalThis.__evoStore?.getState?.().setSpeed?.("fast");
      return true;
    })
    .catch(() => {});
}

/** Журнал открыт? role=log появляется только в развёрнутой панели. */
async function ensureJournal() {
  for (let i = 0; i < 4; i++) {
    if (await page.locator('[role="log"]').count()) return true;
    const toggle = page.getByRole("button", { name: /^(Журнал|Журнал и чат)$/ }).first();
    if (await isVisible(toggle)) await safeClick(toggle, 3000);
    await sleep(400);
  }
  return (await page.locator('[role="log"]').count()) > 0;
}

/**
 * Свернуть журнал. Развёрнутая панель висит над нижней частью стола и
 * перекрывает док с кнопками действий — перед ходом её надо закрыть,
 * иначе клик по «Закончить развитие»/«Закончить ход» не проходит.
 */
async function closeJournal() {
  if (!(await page.locator('[role="log"]').count())) return;
  const toggle = page.getByRole("button", { name: /^(Журнал|Журнал и чат)$/ }).first();
  if (await isVisible(toggle)) await safeClick(toggle, 3000);
  await sleep(250);
}

/**
 * Подтверждение «Закончить питание» (волна 1: диалог показывается всегда —
 * и при голодных, и при сытых). Если его не закрыть, он висит поверх стола и
 * блокирует все дальнейшие действия. В автоигре этот диалог штатно не
 * открывается («Закончить ход» без вопроса), но страховка от залипания нужна.
 */
async function confirmPassDialog() {
  const dialog = page.locator('[role="dialog"]').filter({ hasText: "Закончить питание?" }).first();
  if (!(await isVisible(dialog))) return false;
  const confirm = dialog.getByRole("button", { name: "Закончить питание", exact: true }).first();
  await safeClick(confirm);
  await sleep(250);
  return true;
}

/**
 * Сколько записей «<моё имя> пасует.» сейчас в ленте (null — лента недоступна).
 * Движок пишет в журнал имя игрока: в соло это было «Вы», в сетевом столе —
 * имя, введённое в меню, поэтому подпись берём из сетевого стора.
 */
async function passCount() {
  const name = await page
    .evaluate(() => globalThis.__evoStore?.getState?.().net?.name ?? null)
    .catch(() => null);
  const who = (name ?? "Вы").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return page
    .evaluate((re) => {
      const log = document.querySelector('[role="log"]');
      if (!log) return null;
      return [...log.querySelectorAll("li")].filter((li) => new RegExp(re).test(li.textContent ?? ""))
        .length;
    }, `${who}\\s+пасует`)
    .catch(() => null);
}

let passesSeen = 0;
let passesLogged = 0;

/** Пас: запись обязана появиться в журнале ровно один раз. */
async function passWithJournalCheck(passBtn) {
  if (!(await ensureJournal())) {
    fail("журнал не открылся — пас невозможно проверить");
    await safeClick(passBtn);
    return;
  }
  const before = await passCount();
  if (before === null) {
    fail("лента журнала не читается — пас невозможно проверить");
    await safeClick(passBtn);
    return;
  }
  let after = before;
  let grew = false;
  // Журнал открыт — прячем его, иначе панель перекрывает кнопку паса.
  await closeJournal();
  // Две попытки: после дев-перезагрузки первый клик мог потеряться до
  // гидратации React — повторяем, не считая это провалом.
  for (let attempt = 0; attempt < 2 && !grew; attempt++) {
    if (!(await safeClick(passBtn))) break;
    await sleep(900);
    await ensureJournal();
    after = await passCount();
    if (after !== null && after > before) grew = true;
    else await closeJournal();
  }
  await sleep(300);
  await ensureJournal();
  const settled = (await passCount()) ?? after;
  await closeJournal();
  passesSeen++;
  if (settled === before) {
    fail(`пас не появился в журнале (записей о пасе: ${settled})`);
    return;
  }
  if (settled - before > 1) {
    fail(`пас продублирован в журнале: +${settled - before} записей за одно нажатие`);
    return;
  }
  passesLogged++;
  if (passesLogged === 1) ok(`пас виден в журнале одной записью (всего записей о пасе: ${settled})`);
}

/** Одно действие автоигры; возвращает описание шага. */
async function step() {
  // Волна 1: в развитии вместо «Паса» — «Закончить развитие» (журнал
  // по-прежнему пишет «Вы пасует», проверку паса сохраняем).
  const devPass = page.getByRole("button", { name: "Закончить развитие", exact: true }).first();
  const endTurn = page.getByRole("button", { name: "Закончить ход", exact: true }).first();
  const takeFood = page.getByRole("button", { name: "Взять еду", exact: true }).first();
  const noDefense = page.getByRole("button", { name: "Не защищаться", exact: true }).first();

  // Защита от хищника: не защищаемся (детерминированно и быстро).
  if (await traced("noDefense.isEnabled", () => isEnabled(noDefense))) {
    await safeClick(noDefense);
    return "защита: не защищаться";
  }

  // Спотлайт больше не блокирует клики (фон прозрачен для мыши), поэтому
  // закрываем его кнопкой «Пропустить показ», а не кликом по затемнению.
  const skipSpotlight = page.getByRole("button", { name: "Пропустить показ", exact: true }).first();
  if (await traced("skipSpotlight.isVisible", () => isVisible(skipSpotlight))) {
    await safeClick(skipSpotlight);
    return "закрыт спотлайт";
  }

  // Подтверждение «Закончить питание» (если диалог откуда-то открылся): без
  // этого он висит поверх стола и блокирует любые дальнейшие клики.
  if (await traced("confirmPassDialog", () => confirmPassDialog())) return "питание: завершение подтверждено";

  const { phase } = await traced("headerState", () => headerState());

  // Развитие: сперва стараемся выложить до двух животных, затем пас.
  if (phase === "Развитие" && (await traced("devPass.isEnabled", () => isEnabled(devPass)))) {
    const myAnimals = await traced("myAnimals.count", () =>
      page
        .locator('[data-player-section="0"] [data-animal-id]')
        .count()
        .catch(() => 0),
    );
    const animalFace = page.getByRole("button", { name: "Животное", exact: true }).first();
    if (
      myAnimals < 2 &&
      (await traced("animalFace.isEnabled", () => isEnabled(animalFace))) &&
      (await traced("animalFace.click", () => safeClick(animalFace)))
    ) {
      return "развитие: выложено животное";
    }
    await traced("passWithJournalCheck", () => passWithJournalCheck(devPass));
    return "развитие: пас";
  }

  // Питание: кормим животных с кормовой базы («Закончить ход» — без диалога;
  // «Закончить питание» открывает подтверждение и здесь не трогается).
  if (phase === "Питание" && (await traced("takeFood.isEnabled", () => isEnabled(takeFood)))) {
    await safeClick(takeFood);
    await sleep(120);
    // Если движок ждёт выбора животного — обходим своих по очереди.
    if (await isVisible(takeFood)) {
      const animals = page.locator('[data-player-section="0"] [data-animal-id]');
      const n = await animals.count().catch(() => 0);
      for (let i = 0; i < n; i++) {
        if (!(await isVisible(takeFood))) break;
        await safeClick(animals.nth(i), 2000);
        await sleep(120);
      }
    }
    return "питание: взята еда";
  }

  if (phase === "Питание" && (await traced("endTurn.isEnabled", () => isEnabled(endTurn)))) {
    await safeClick(endTurn);
    return "питание: закончен ход";
  }
  return "ожидание";
}

/** Отметки необязательных сценариев по тексту журнала. */
async function scanFeed() {
  const text = await page
    .evaluate(() => document.querySelector('[role="log"]')?.innerText ?? "")
    .catch(() => "");
  if (!text) return;
  for (const [key, s] of Object.entries(SCENARIOS)) {
    if (!seen[key] && s.re.test(text)) seen[key] = true;
  }
}

/**
 * Крутим автоигру до финала. Жёсткий бюджет: по истечении возвращаем причину,
 * а не ждём вечно. Короткая отлучка в меню (дев-перезагрузка Vite) не считается
 * сбросом: партия восстанавливается из сейва, даём ей несколько секунд.
 */
async function playToFinal(label, budgetMs) {
  const deadline = Date.now() + budgetMs;
  let actions = 0;
  let ticks = 0;
  let last = "";
  let lastLogged = "";
  while (Date.now() < deadline) {
    if (await isVisible(finalTitle())) {
      ok(`${label}: финал достигнут за ${Math.round((budgetMs - (deadline - Date.now())) / 1000)} с, действий ${actions}`);
      return { finished: true };
    }
    if (await inMenu()) {
      // Короткая отлучка в меню — дев-перезагрузка Vite: URL с ?room=КОД и
      // токен места возвращают за стол сами (сейва соло больше нет).
      await sleep(6000);
      if (await inMenu()) {
        return { finished: false, reason: `${label}: игра выпала в главное меню` };
      }
    }
    try {
      last = await step();
    } catch (e) {
      return {
        finished: false,
        reason: `${label}: сбой автоигры — ${String(e.message ?? e).split("\n")[0]}`,
      };
    }
    actions++;
    if (++ticks % 5 === 0) await scanFeed();
    // Сердцебиение: если партия застрянет, в логе видно год, фазу и последний
    // шаг автоигры — без этого остаётся только «бюджет исчерпан».
    // Подробный лог шагов включается переменной EVO_SOLO_DEBUG=1.
    if (process.env.EVO_SOLO_DEBUG === "1") {
      console.log(`  [${label}] #${ticks} шаг: ${last}`);
    }
    if (ticks % 25 === 0) {
      const st = await headerState();
      console.log(`  [${label}] год ${st.year}, фаза «${st.phase}», действий ${actions}, шаг: ${last}`);
    }
    await sleep(last.startsWith("ожидание") ? 400 : 180);
  }
  const st = await headerState();
  return {
    finished: false,
    reason: `${label}: бюджет ${Math.round(budgetMs / 1000)} с исчерпан (год ${st.year}, фаза «${st.phase}»)`,
  };
}

/** Финальный экран: строки всех игроков с очками и разбивкой. */
async function checkFinalScreen(expectedPlayers) {
  const overlay = page.locator("div.fixed").filter({ hasText: "Конец эволюции" }).last();
  await overlay.waitFor({ state: "visible", timeout: 15000 });
  // Счёт «докручивается» анимацией CountUp — даём ей закончиться.
  await sleep(2000);
  const rows = await overlay.evaluate((root) =>
    [...root.querySelectorAll("li")].map((li) => (li.innerText ?? "").replace(/\s+/g, " ").trim()),
  );
  await page.screenshot({ path: `${SHOTS}/20-net-final.png` });
  if (rows.length !== expectedPlayers) {
    throw new Error(`в финале ${rows.length} строк счёта вместо ${expectedPlayers}`);
  }
  const totals = [];
  for (const row of rows) {
    if (!/^\d+\.\s+\S/.test(row)) throw new Error(`строка финала без места и имени: «${row}»`);
    if (!/животные\s+\d+\s+·\s+свойства\s+\d+\s+·\s+бонус\s+\d+\s+·\s+сброс\s+\d+/.test(row)) {
      throw new Error(`нет разбивки очков в строке: «${row}»`);
    }
    const total = Number((row.match(/(\d+)\s*$/) ?? [])[1]);
    if (!Number.isFinite(total)) throw new Error(`не читается итог очков в строке: «${row}»`);
    totals.push(total);
  }
  // Своя строка: в соло игрок назывался «Вы», в сетевом столе — именем из меню.
  const me = await page
    .evaluate(() => globalThis.__evoStore?.getState?.().net?.name ?? null)
    .catch(() => null);
  const mine = new RegExp(
    `^\\d+\\.\\s+${(me ?? "Вы").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`,
  );
  if (!rows.some((r) => mine.test(r))) {
    throw new Error(`в финале нет строки человека («${me ?? "Вы"}»)`);
  }
  await scanFeed();
  ok(`финал: ${rows.length} строки со счётом и разбивкой, очки: ${totals.join(", ")}`);
}

/** Выход из партии в меню: в сетевом столе это «Покинуть стол» + «Сдаться и выйти». */
async function collapseToMenu() {
  await safeClick(page.getByRole("button", { name: "Покинуть стол", exact: true }).first(), 5000);
  const confirm = page.getByRole("button", { name: /^(Сдаться и выйти|Покинуть стол)$/ });
  await confirm.last().waitFor({ timeout: 5000 });
  await confirm.last().click({ timeout: 5000 });
  await menuReady(page, 20_000);
}

/** Шаг сценария с локализацией падения. */
async function guard(label, fn) {
  try {
    await fn();
  } catch (e) {
    fail(`${label}: ${String(e.message ?? e).split("\n")[0]}`);
  }
}

// ── Сценарий ────────────────────────────────────────────────────────────────
try {
  await guard("меню", async () => {
    // networkidle — чтобы дождаться гидратации React; при дев-перезагрузке
    // Vite goto может не дойти до idle, тогда довольствуемся domcontentloaded.
    await page
      .goto(BASE, { waitUntil: "networkidle", timeout: 60_000 })
      .catch(() => page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
    await menuReady(page, 30_000).catch(() => {});
    await sleep(500);
    await page.screenshot({ path: `${SHOTS}/20-net-menu.png` });
    ok("меню открылось");
  });

  let game1 = { finished: false, reason: "партия не запускалась" };
  await guard("старт партии 1", async () => {
    const deckText = await startTable({ players: 2, deck: 20 });
    await page.locator("text=Развитие >> visible=true").first().waitFor({ timeout: 30_000 });
    await ensureJournal();
    await page.screenshot({ path: `${SHOTS}/20-net-table.png` });
    ok(`партия 1 началась: сетевой стол, 2 игрока (второй — бот), темп «Быстро» (${deckText})`);
  });

  await guard("партия 1 до финала", async () => {
    game1 = await playToFinal("партия 1", GAME1_BUDGET_MS);
    if (!game1.finished) fail(game1.reason);
  });

  if (game1.finished) {
    await guard("финальный счёт", async () => checkFinalScreen(2));
    await guard("«В меню»", async () => {
      await page.getByRole("button", { name: "В меню", exact: true }).click({ timeout: 5000 });
      await menuReady(page, 20_000);
      ok("«В меню» после финала вернула в главное меню");
    });
  } else {
    warn("финальный экран и «В меню» не проверялись: партия 1 не дошла до финала");
  }

  if (game1.finished) {
    let game2 = { finished: false, reason: "партия не запускалась" };
    await guard("старт партии 2", async () => {
      const deckText = await startTable({ players: 2, deck: 20 });
      await page.locator("text=Развитие >> visible=true").first().waitFor({ timeout: 30_000 });
      await ensureJournal();
      ok(`партия 2 началась новым сетевым столом (${deckText})`);
    });
    await guard("партия 2 до финала", async () => {
      game2 = await playToFinal("партия 2", GAME2_BUDGET_MS);
      if (!game2.finished) warn(`${game2.reason}; проверка «Сыграть ещё» пропущена`);
    });
    if (game2.finished) {
      await guard("«Сыграть ещё»", async () => {
        const again = page.getByRole("button", { name: /^(Ещё партия|Сыграть ещё)$/ }).first();
        if (!(await safeClick(again, 5000))) throw new Error("кнопка «Ещё партия» не нажалась");
        // Сервер переводит стол обратно в ЛОББИ (status=lobby, state=null):
        // новая партия стартует кнопкой хоста «Начать год», а не сама.
        await page.locator("[data-room-code]").first().waitFor({ timeout: 25_000 });
        if (await isVisible(finalTitle())) throw new Error("экран финала не закрылся после «Ещё партия»");
        await page.screenshot({ path: `${SHOTS}/20-net-again.png` });
        const startAgain = page.getByRole("button", { name: "Начать год", exact: true }).first();
        await safeClick(startAgain, 5000);
        await page.locator("text=Развитие >> visible=true").first().waitFor({ timeout: 25_000 });
        ok("«Ещё партия» вернула стол в лобби, повторный «Начать год» начал новый год");
        await collapseToMenu();
        ok("после новой партии «Покинуть стол» вернул в меню");
      });
    }
  }

  // Чего не увидели — не провал, но честное предупреждение.
  const missing = Object.entries(SCENARIOS)
    .filter(([key]) => !seen[key])
    .map(([, s]) => s.label);
  if (missing.length) warn(`за прогон не встретились сценарии: ${missing.join(", ")}`);
  if (passesSeen) ok(`пас проверялся ${passesSeen} раз(а), все записи одиночные`);
  else warn("ни одного паса человека за прогон не было — проверка журнала не выполнена");
} finally {
  await browser.close();
}

const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""}`
  : `ИТОГ: сетевой прогон чист${warnings.length ? ` (предупреждений ${warnings.length})` : ""}`;
console.log(`\n${verdict}`);
process.exitCode = problems.length ? 1 : 0;
