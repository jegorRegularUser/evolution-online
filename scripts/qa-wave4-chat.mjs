/**
 * QA волны 4 «Чат стола» (M12 + S9). Живой dev-сервер, две-три вкладки.
 *
 * Проверяем ровно то, что просил владелец:
 *   а) реакция на КОНКРЕТНОЕ сообщение (chatId) появляется под этим же
 *      сообщением у второго участника, а не только у поставившего;
 *   б) «печатает…» появляется у соседа и гаснет само;
 *   в) история чата видна тому, кто вошёл позже (и без дублей);
 *   г) «Покинуть стол» забывает токен места/очереди/зрителя, а F5 — нет:
 *      по ?room=CODE после выхода в стол не возвращает;
 *   д) высота панели чата и страницы не растёт от новых сообщений.
 * Плюс: та же лента и «печатает…» в ожидающем столе, реакция «в стол»
 * (без chatId) по-прежнему работает панелью в партии, а пустой net (чужой
 * мёртвый токен) не оставляет пустой экран.
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave4-chat.mjs
 * Скриншоты — ТОЛЬКО вне репозитория (%TEMP%, EVO_SHOTS): PNG внутри проекта
 * в dev заставляет Tailwind пересобирать SSR и роняет вкладки full-reload'ом.
 */
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  bodyOf,
  confirmDialog,
  gotoUrl,
  isVisible,
  openMenu,
  roomCode,
  safeClick,
  sleep,
  startNetGame,
  trackPage,
  waitUntil,
  warmupServer,
} from "./qa-lib.mjs";

const LOBBY_LIST = '[aria-label="Чат стола: записи"]';
const GAME_LIST = '[aria-label="Журнал и чат: записи"]';

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
const shot = (page, name) => page.screenshot({ path: `${SHOTS}/${name}.png` }).catch(() => {});
const pageProblems = [];

async function newPage(label, viewport = { width: 1400, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  // Расхождение SSR/клиента в dev — шум (в т.ч. от параллельных правок).
  pageProblems.push(trackPage(page, label, { ignore: [/hydrated but some attributes/] }));
  return page;
}

// ── примитивы сценарных вкладок ──────────────────────────────────────────────

/** Вызов продуктового экшена стора — тот же путь, что у кнопок меню. */
function storeAction(page, op, arg) {
  return page
    .evaluate(
      async ({ op: o, arg: a }) => {
        const store = globalThis.__evoStore;
        if (!store) return { ok: false, error: "нет __evoStore" };
        const s = store.getState();
        try {
          if (o === "create") {
            await s.startNetCreate(a);
            return { ok: true, code: store.getState().net?.code ?? null };
          }
          if (o === "join") {
            await s.startNetJoin(a.code, a.name);
            return { ok: true, code: store.getState().net?.code ?? null };
          }
          if (o === "watch") {
            await s.startNetWatch(a.code, a.name);
            return { ok: true, code: store.getState().net?.code ?? null };
          }
          if (o === "leave") {
            s.leaveNet();
            return { ok: true, net: store.getState().net };
          }
          return { ok: false, error: `неизвестная операция ${o}` };
        } catch (e) {
          return { ok: false, error: String(e?.message ?? e), net: store.getState().net?.error ?? null };
        }
      },
      { op, arg: arg ?? null },
    )
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
}

/** Срез сетевого стора: чат, реакции, статус, фатальный текст. */
function probe(page) {
  return page.evaluate(() => {
    const st = globalThis.__evoStore?.getState?.();
    const n = st?.net ?? null;
    return {
      hasStore: Boolean(st),
      net: n
        ? {
            code: n.code,
            seat: n.seat,
            name: n.name,
            status: n.status,
            waiting: n.waiting,
            spectating: n.spectating,
            error: n.error ?? null,
          }
        : null,
      chat: (n?.chat ?? []).map((m) => ({ id: m.id, name: m.name, text: m.text, seat: m.seat })),
      reactions: (n?.reactions ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        emoji: r.emoji,
        kind: r.kind,
        chatId: r.chatId,
        targetSeat: r.targetSeat,
      })),
      fatal: st?.netFatal ?? null,
    };
  });
}

/** Сохранённые токены стола: место, очередь, зритель. */
function tokensOf(page, code) {
  return page.evaluate(
    (c) => ({
      seat: Boolean(localStorage.getItem(`evo-seat-${c}`)),
      queue: Boolean(localStorage.getItem(`evo-queue-${c}`)),
      watch: Boolean(localStorage.getItem(`evo-watch-${c}`)),
      watchCode: localStorage.getItem("evo-net-watch-code"),
    }),
    code,
  );
}

/**
 * Первый список ленты с такой меткой: в доке партии их два (колонка xl и
 * скрытая мобильная шторка) с одинаковым aria-label — считаем по одному.
 * Все проверки ниже ходят через document.querySelector(listSel).
 */

/** Чипы реакций под репликой с данным текстом (точное совпадение по подстроке). */
function chipsUnder(page, listSel, text) {
  return page.evaluate(
    ({ listSel, text }) => {
      const root = document.querySelector(listSel);
      const rows = [...(root?.querySelectorAll('[data-feed-item="chat"]') ?? [])];
      const row = rows.find((r) => (r.innerText ?? "").includes(text));
      if (!row) return null;
      return [...row.querySelectorAll("button")]
        .filter((b) => /^Реакция .+: \d+$/.test(b.getAttribute("aria-label") ?? ""))
        .map((b) => ({
          label: b.getAttribute("aria-label"),
          pressed: b.getAttribute("aria-pressed") === "true",
        }));
    },
    { listSel, text },
  );
}

/** Тексты строк «печатает…» (их может быть две: колонка xl и мобильная шторка). */
function typingLines(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-typing-line]")]
      .map((e) => (e.innerText ?? "").replace(/\s+/g, " ").trim())
      .filter(Boolean),
  );
}

/** Метрики панели чата лобби и документа: высота не должна расти. */
function panelMetrics(page) {
  return page.evaluate((sel) => {
    const panel = document.querySelector("[data-feed-panel]");
    const list = document.querySelector(sel);
    return {
      panelH: panel ? Math.round(panel.getBoundingClientRect().height) : null,
      docH: document.documentElement.scrollHeight,
      listH: list ? list.clientHeight : null,
      listScroll: list ? list.scrollHeight : null,
      rows: list ? list.querySelectorAll("[data-feed-item]").length : 0,
    };
  }, LOBBY_LIST);
}

/** Отправка сообщения через поле чата (тот же путь, что у кнопки «Отправить»). */
async function sendViaUi(page, text) {
  const box = page.getByRole("textbox", { name: "Сообщение в чат" }).first();
  if (!(await waitUntil(() => isVisible(box), 15_000))) throw new Error("нет поля ввода чата");
  await box.fill(text);
  const send = page.getByRole("button", { name: "Отправить сообщение" }).first();
  if (!(await safeClick(send, 4000))) {
    await box.press("Enter").catch(() => {});
  }
}

/** Отправка с подтверждением появления в ленте (лимит чата — не поломка). */
async function sendAndSee(page, text, listSel, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    await sendViaUi(page, text);
    const seen = await waitUntil(() => feedHas(page, listSel, text), 8_000, 300);
    if (seen) return true;
    await sleep(1200);
  }
  return false;
}

/** Реплика появилась в ленте вкладки? (первый список с этой меткой) */
const feedHas = (page, listSel, text) =>
  page
    .evaluate(
      ({ listSel, text }) => {
        const root = document.querySelector(listSel);
        return [...(root?.querySelectorAll('[data-feed-item="chat"]') ?? [])].some((r) =>
          (r.innerText ?? "").includes(text),
        );
      },
      { listSel, text },
    )
    .catch(() => false);

/** Сколько раз текст встречается в ленте (проверка «история без дублей»). */
const feedCount = (page, listSel, text) =>
  page
    .evaluate(
      ({ listSel, text }) => {
        const root = document.querySelector(listSel);
        return [...(root?.querySelectorAll('[data-feed-item="chat"]') ?? [])].filter((r) =>
          (r.innerText ?? "").includes(text),
        ).length;
      },
      { listSel, text },
    )
    .catch(() => -1);

/**
 * Пачка сообщений через клиентский API (лимит сервера: 20/мин, пауза 700 мс).
 * Текст собирает сама вкладка: функция-аргумент через evaluate не переживёт
 * сериализацию.
 */
function pumpChat(page, count, prefix, delay = 820, filler = "") {
  return page.evaluate(
    async ({ count, prefix, delay, filler }) => {
      const api = await import("/src/lib/net/api.ts");
      const code =
        new URLSearchParams(location.search).get("room")?.toUpperCase() ||
        document.querySelector("[data-room-code]")?.textContent?.trim();
      const token =
        localStorage.getItem(`evo-seat-${code}`) ||
        localStorage.getItem(`evo-queue-${code}`) ||
        localStorage.getItem(`evo-watch-${code}`);
      let sent = 0;
      for (let i = 0; i < count; i++) {
        const text = `${prefix} ${i + 1}: ${filler}`.slice(0, 390);
        const r = await api.netChat({ data: { code, token, text } }).catch(() => null);
        if (r && r.ok) sent += 1;
        await new Promise((res) => setTimeout(res, delay));
      }
      return sent;
    },
    { count, prefix, delay, filler },
  );
}

/** Реакция через кнопку у реплики (палитра живёт внутри строки). */
async function reactViaUi(page, listSel, text, emoji = "👏") {
  const row = page
    .locator(`${listSel} [data-feed-item="chat"]`)
    .filter({ hasText: text })
    .first();
  if (!(await row.count().catch(() => 0))) throw new Error(`нет строки с текстом «${text}»`);
  await row.hover().catch(() => {});
  const trigger = row.getByRole("button", { name: "Поставить реакцию" }).first();
  if (!(await safeClick(trigger, 4000))) throw new Error("кнопка реакции не нажалась");
  const picker = row.getByRole("group", { name: "Реакции" }).first();
  if (!(await waitUntil(() => isVisible(picker), 5_000))) throw new Error("палитра реакций не раскрылась");
  const btn = picker.getByRole("button", { name: `Реакция ${emoji}`, exact: true }).first();
  if (!(await safeClick(btn, 4000))) throw new Error(`эмодзи ${emoji} не нажался`);
}

// ── сценарий ─────────────────────────────────────────────────────────────────

try {
  await guard("прогрев dev-сервера", async () => {
    const warmed = await warmupServer(browser, { timeout: 150_000, quietMs: 3_000, log: (m) => warn(m) });
    if (warmed) ok("dev-сервер прогрет: serverFn и модули партии скомпилированы");
    else warn("прогрев не подтвердил тишину — возможны full-reload'ы посреди сценария");
  });

  const host = await newPage("хост");
  const guest = await newPage("гость");
  let code = "";

  // ── Лобби: история, реакции на реплику, «печатает…», высота, токены ──────
  await guard("лобби: стол на два места", async () => {
    await openMenu(host);
    const r = await storeAction(host, "create", {
      name: "Аня",
      capacity: 2,
      botSeats: 0,
      difficulty: "normal",
      modules: {},
    });
    if (!r.ok) throw new Error(`стол не создан: ${r.error}`);
    code = r.code ?? "";
    if (!(await waitUntil(() => roomCode(host), 20_000, 300))) {
      throw new Error(`лобби не отрисовалось; экран: ${await bodyOf(host)}`);
    }
    ok(`стол ${code} создан (2 места, лобби)`);
  });

  await guard("хост пишет две реплики до прихода гостя", async () => {
    if (!(await sendAndSee(host, "Первое: привет стол", LOBBY_LIST))) {
      throw new Error("первая реплика не доехала в ленту");
    }
    await sleep(900);
    if (!(await sendAndSee(host, "Второе: как дела", LOBBY_LIST))) {
      throw new Error("вторая реплика не доехала в ленту");
    }
    ok("в ленте хоста две реплики (они же — будущая история)");
  });

  // (в) история: гость входит позже и обязан увидеть обе реплики — по одному разу.
  await guard("история: вошедший позже видит прежние реплики без дублей", async () => {
    await openMenu(guest);
    const r = await storeAction(guest, "join", { code, name: "Боря" });
    if (!r.ok) throw new Error(`вход не удался: ${r.error}`);
    const joined = await waitUntil(
      async () => (await roomCode(guest)) === code && (await probe(guest)).net?.seat === 1,
      25_000,
      400,
    );
    if (!joined) throw new Error(`гость не за столом: ${await bodyOf(guest)}`);
    const first = await waitUntil(() => feedHas(guest, LOBBY_LIST, "Первое: привет стол"), 20_000, 400);
    const second = await waitUntil(() => feedHas(guest, LOBBY_LIST, "Второе: как дела"), 20_000, 400);
    if (!first || !second) throw new Error("история не пришла вошедшему позже");
    const n1 = await feedCount(guest, LOBBY_LIST, "Первое: привет стол");
    const n2 = await feedCount(guest, LOBBY_LIST, "Второе: как дела");
    if (n1 !== 1 || n2 !== 1) throw new Error(`история продублирована: ${n1} и ${n2} строк`);
    ok("история видна вошедшему позже: обе реплики по одному разу");
    await shot(guest, "w4-01-history");
  });

  // (а) реакция на конкретную реплику: chatId, чип под этим же сообщением у обоих.
  await guard("реакция на реплику видна обоим участникам", async () => {
    const text = "Реплика Бориса для реакции";
    if (!(await sendAndSee(guest, text, LOBBY_LIST))) throw new Error("реплика гостя не доехала");
    if (!(await waitUntil(() => feedHas(host, LOBBY_LIST, text), 20_000, 300))) {
      throw new Error("реплика гостя не доехала до хоста");
    }
    const msgId = (await probe(host)).chat.find((m) => m.text === text)?.id ?? null;
    if (msgId === null) throw new Error("реплика не найдена в сторе хоста");

    await reactViaUi(host, LOBBY_LIST, text, "👏");

    const hostChips = await waitUntil(async () => {
      const c = await chipsUnder(host, LOBBY_LIST, text);
      return c && c.some((x) => x.label === "Реакция 👏: 1" && x.pressed);
    }, 6_000);
    if (!hostChips) throw new Error(`чип у хоста не появился: ${JSON.stringify(await chipsUnder(host, LOBBY_LIST, text))}`);

    const guestChip = await waitUntil(async () => {
      const c = await chipsUnder(guest, LOBBY_LIST, text);
      return c && c.some((x) => x.label === "Реакция 👏: 1" && !x.pressed);
    }, 20_000);
    if (!guestChip) {
      throw new Error(`у гостя чип не появился: ${JSON.stringify(await chipsUnder(guest, LOBBY_LIST, text))}`);
    }

    // Привязка на сервере: реакция с этим chatId есть в кадре у обоих.
    const hostReaction = (await probe(host)).reactions.find((r) => r.chatId === msgId && r.emoji === "👏");
    const guestReaction = (await probe(guest)).reactions.find((r) => r.chatId === msgId && r.emoji === "👏");
    if (!hostReaction) throw new Error("у хоста нет реакции с chatId этой реплики");
    if (!guestReaction) throw new Error("до гостя не доехала реакция с chatId этой реплики");
    ok(`реакция 👏 привязана к реплике #${msgId} и видна обоим (гость видит без своей подсветки)`);
    await shot(host, "w4-02-reaction-lobby");
  });

  // (б) «печатает…» — появляется у соседа и гаснет само; себя не показывает.
  await guard("«печатает…»: появилось у соседа и погасло", async () => {
    const box = guest.getByRole("textbox", { name: "Сообщение в чат" }).first();
    if (!(await waitUntil(() => isVisible(box), 10_000))) throw new Error("у гостя нет поля ввода");
    await box.fill("Печатаю длинное сообщение");
    const appeared = await waitUntil(async () => (await typingLines(host)).some((t) => t.includes("Боря печатает")), 10_000, 300);
    if (!appeared) throw new Error(`хост не увидел «печатает…»: ${JSON.stringify(await typingLines(host))}`);
    const own = await typingLines(guest);
    if (own.length) throw new Error(`себе вкладка показывает чужой индикатор: ${JSON.stringify(own)}`);
    await shot(host, "w4-03-typing");
    ok("«Боря печатает…» появилось у соседа, самого гостя в строке нет");

    // Гость стёр текст — метка сервера живёт ~4 с и должна погаснуть сама.
    await box.fill("");
    const gone = await waitUntil(async () => (await typingLines(host)).length === 0, 15_000, 400);
    if (!gone) throw new Error(`строка «печатает…» не погасла: ${JSON.stringify(await typingLines(host))}`);
    ok("строка «печатает…» погасла сама (без таймера на клиенте)");
  });

  // (д) высота панели и страницы не растёт от новых сообщений.
  await guard("высота чата не растёт от новых сообщений", async () => {
    const before = await panelMetrics(host);
    if (before.panelH === null) throw new Error("панель чата лобби не найдена");
    const filler = "проверка высоты чата и переноса строк ".repeat(6);
    const sent = await pumpChat(guest, 12, "Длинное", 830, filler);
    if (sent < 10) throw new Error(`дошло меньше сообщений лимита: ${sent} из 12`);
    const grown = await waitUntil(async () => (await panelMetrics(host)).rows >= before.rows + 10, 25_000, 500);
    if (!grown) throw new Error("новые сообщения не доехали до ленты хоста");
    await sleep(700);
    const after = await panelMetrics(host);
    if (Math.abs(after.panelH - before.panelH) > 2) {
      throw new Error(`панель чата выросла: ${before.panelH} → ${after.panelH}`);
    }
    if (Math.abs(after.docH - before.docH) > 2) {
      throw new Error(`страница лобби выросла: ${before.docH} → ${after.docH}`);
    }
    if (!(after.listScroll > after.listH)) {
      throw new Error(`список чата не скроллится внутри (${after.listScroll} ≤ ${after.listH})`);
    }
    ok(
      `панель ${before.panelH}px не изменилась на +${sent} сообщений (страница ${after.docH}px, ` +
        `список ${after.listH}/${after.listScroll} — скролл внутри)`,
    );
    await shot(host, "w4-04-height");
  });

  // Ожидающий стол: та же лента (история) и «печатает…» в обе стороны.
  await guard("ожидающий: история и «печатает…» в обе стороны", async () => {
    const waiter = await newPage("ожидающий");
    await openMenu(waiter);
    const r = await storeAction(waiter, "join", { code, name: "Дима" });
    if (!r.ok) throw new Error(`очередь не удалась: ${r.error}`);
    const queued = await waitUntil(async () => (await probe(waiter)).net?.waiting === true, 25_000, 400);
    if (!queued) throw new Error(`нет экрана ожидания: ${await bodyOf(waiter)}`);
    if (!(await waitUntil(() => feedHas(waiter, LOBBY_LIST, "Первое: привет стол"), 20_000, 400))) {
      throw new Error("ожидающий не получил историю чата стола");
    }
    const wBox = waiter.getByRole("textbox", { name: "Сообщение в чат" }).first();
    if (!(await waitUntil(() => isVisible(wBox), 10_000))) throw new Error("у ожидающего нет поля ввода");
    await wBox.fill("Печатаю из очереди");
    const heard = await waitUntil(
      async () => (await typingLines(host)).some((t) => t.includes("Дима печатает")),
      12_000,
      300,
    );
    if (!heard) throw new Error(`хост не увидел «печатает…» из очереди: ${JSON.stringify(await typingLines(host))}`);
    await wBox.fill("");
    const hBox = host.getByRole("textbox", { name: "Сообщение в чат" }).first();
    await hBox.fill("Печатаю из лобби");
    const back = await waitUntil(
      async () => (await typingLines(waiter)).some((t) => t.includes("Аня печатает")),
      12_000,
      300,
    );
    if (!back) throw new Error(`ожидающий не увидел «печатает…» хоста: ${JSON.stringify(await typingLines(waiter))}`);
    await hBox.fill("");
    await shot(waiter, "w4-09-waiting-typing");
    ok("ожидающий видит историю и «Аня печатает…»; хост видит «Дима печатает…»");
    await waiter.context().close();
  });

  // Пустой net после кика: «вас нет за столом» — меню с причиной, не пустой экран.
  await guard("кик гостя: меню с причиной, а не пустой экран", async () => {
    const seat = (await probe(guest)).net?.seat ?? -1;
    if (seat < 0) throw new Error("гость не за местом — кикать некого");
    const kicked = await host.evaluate(async (s) => {
      await globalThis.__evoStore.getState().netKick(s);
      return true;
    }, seat);
    if (!kicked) throw new Error("кик не отправился");
    const empty = await waitUntil(async () => (await probe(guest)).net === null, 15_000, 300);
    if (!empty) throw new Error("кикнутый не вышел из стола");
    const p = await probe(guest);
    if (!(await waitUntil(() => isVisible(guest.getByLabel("Ваше имя")), 15_000))) {
      throw new Error(`кикнутый не в меню: ${await bodyOf(guest)}`);
    }
    if (!p.fatal) warn("кикнутый вернулся в меню без плашки причины (текст не критичен)");
    ok(`кикнутый в меню, причина: «${p.fatal ?? "—"}» (пустого экрана нет)`);
    await shot(guest, "w4-10-kicked");
  });

  // (г) F5 сохраняет место, «Покинуть стол» — забывает.
  await guard("F5 сохраняет место за столом", async () => {
    const beforeReload = await tokensOf(host, code);
    if (!beforeReload.seat) throw new Error("нет токена места до перезагрузки");
    await host.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
    const back = await waitUntil(async () => (await roomCode(host)) === code, 25_000, 400);
    if (!back) throw new Error(`F5 не вернул за стол: ${await bodyOf(host)}`);
    const afterReload = await tokensOf(host, code);
    if (!afterReload.seat) throw new Error("после F5 токен места пропал — восстановление партии сломано");
    ok("F5 сохраняет токен и возвращает за стол (восстановление работает)");
  });

  await guard("«Покинуть стол» удаляет токен; ?room= не возвращает за стол", async () => {
    const leave = host.getByRole("button", { name: "Покинуть стол" }).first();
    if (!(await safeClick(leave, 5000))) throw new Error("кнопка «Покинуть стол» не нажалась");
    const inMenu = await waitUntil(async () => (await probe(host)).net === null, 10_000, 300);
    if (!inMenu) throw new Error("стор не вышел из стола после «Покинуть стол»");
    const left = await tokensOf(host, code);
    if (left.seat || left.queue || left.watch) {
      throw new Error(`токены пережили выход: ${JSON.stringify(left)}`);
    }
    if (!(await waitUntil(() => isVisible(host.getByLabel("Ваше имя")), 15_000))) {
      throw new Error(`после выхода не меню: ${await bodyOf(host)}`);
    }
    ok("токены места/очереди/зрителя удалены, вкладка в меню");

    // Ссылка ?room=CODE на этом устройстве больше не должна возвращать в стол.
    await gotoUrl(host, `${BASE}/?room=${code}`);
    await sleep(4_000);
    const stillMenu = (await probe(host)).net === null && !(await roomCode(host));
    if (!stillMenu) throw new Error(`?room=${code} вернул за стол без токена: ${await bodyOf(host)}`);
    const codeInput = await host.getByLabel("Код стола").first().inputValue().catch(() => "");
    if (codeInput.trim().toUpperCase() !== code) {
      warn(`форма входа не предзаполнена кодом (в поле «${codeInput}») — не блокирует`);
    }
    ok(`?room=${code} после выхода показывает меню/форму, а не стол`);
    await shot(host, "w4-05-after-leave");
  });

  // ── Партия: реакции и «печатает…» в game-app, зритель видит историю ──────
  const spectator = await newPage("зритель");
  let gameCode = "";

  await guard("партия: стол с ботом и реплика до прихода зрителя", async () => {
    gameCode = await startNetGame(host, { name: "Аня", players: 2, bots: 1, log: (m) => warn(m) });
    ok(`партия ${gameCode} началась`);
    const journal = host.getByRole("button", { name: "Журнал и чат" }).first();
    if (!(await safeClick(journal, 5000))) throw new Error("журнал партии не раскрылся");
    if (!(await waitUntil(() => isVisible(host.locator(GAME_LIST).first()), 10_000))) {
      throw new Error("лента журнала партии не появилась");
    }
    if (!(await sendAndSee(host, "В партии: привет", GAME_LIST))) {
      throw new Error("реплика в доке партии не доехала");
    }
    ok("в доке партии отправлена реплика (будущая история для зрителя)");
  });

  await guard("зритель: история партии видна в его канале", async () => {
    await openMenu(spectator);
    const r = await storeAction(spectator, "watch", { code: gameCode, name: "Света" });
    if (!r.ok) throw new Error(`зрительский вход не удался: ${r.error}`);
    const watching = await waitUntil(async () => {
      const p = await probe(spectator);
      return p.net?.spectating === true && p.net?.status === "playing";
    }, 25_000, 400);
    if (!watching) throw new Error(`зритель не в партии: ${await bodyOf(spectator)}`);
    const journal = spectator.getByRole("button", { name: "Журнал и чат" }).first();
    await safeClick(journal, 5000);
    const seen = await waitUntil(() => feedHas(spectator, GAME_LIST, "В партии: привет"), 20_000, 400);
    if (!seen) throw new Error("зритель не получил историю чата партии");
    const n = await feedCount(spectator, GAME_LIST, "В партии: привет");
    if (n !== 1) throw new Error(`история у зрителя продублирована: ${n}`);
    ok("зритель видит историю чата партии (ровно один раз)");
  });

  await guard("партия: «печатает…» от зрителя и реакция на его реплику", async () => {
    // Зритель печатает — хост обязан увидеть строку (SpectatorInfo.typing).
    const sBox = spectator.getByRole("textbox", { name: "Сообщение в чат" }).first();
    if (!(await waitUntil(() => isVisible(sBox), 10_000))) throw new Error("у зрителя нет поля ввода");
    await sBox.fill("Печатаю как зритель");
    const typingSeen = await waitUntil(
      async () => (await typingLines(host)).some((t) => t.includes("Света печатает")),
      12_000,
      300,
    );
    if (!typingSeen) throw new Error(`хост не увидел «печатает…» зрителя: ${JSON.stringify(await typingLines(host))}`);
    await shot(host, "w4-06-typing-game");
    ok("«Света печатает…» (зритель) видно в партии у хоста");
    await sBox.fill("");
    await waitUntil(async () => (await typingLines(host)).length === 0, 15_000, 400);

    // Реплика зрителя и реакция хоста на неё — чип должен доехать зрителю.
    const text = "Реплика Светы";
    if (!(await sendAndSee(spectator, text, GAME_LIST))) throw new Error("реплика зрителя не доехала");
    if (!(await waitUntil(() => feedHas(host, GAME_LIST, text), 20_000, 300))) {
      throw new Error("реплика зрителя не доехала до хоста");
    }
    await reactViaUi(host, GAME_LIST, text, "💚");
    const guestChip = await waitUntil(async () => {
      const c = await chipsUnder(spectator, GAME_LIST, text);
      return c && c.some((x) => x.label === "Реакция 💚: 1" && !x.pressed);
    }, 20_000);
    if (!guestChip) {
      throw new Error(`зритель не увидел чип под своей репликой: ${JSON.stringify(await chipsUnder(spectator, GAME_LIST, text))}`);
    }
    ok("реакция 💚 на реплику зрителя видна зрителю в доке партии");
    await shot(spectator, "w4-07-reaction-game");
  });

  await guard("«реакция в стол» без chatId по-прежнему работает", async () => {
    const petal = async () => {
      const panel = host.locator('div[role="group"][aria-label="Реакции"]').first();
      if (!(await isVisible(panel))) throw new Error("панель реакций не найдена");
      const btn = panel.getByRole("button", { name: "Реакция 🌿", exact: true }).first();
      if (!(await safeClick(btn, 4000))) throw new Error("реакция «в стол» не нажалась");
    };
    const bubbleSeen = () =>
      waitUntil(
        () =>
          host
            .evaluate(() => [...document.querySelectorAll(".reaction-bubble")].map((b) => b.innerText.trim()))
            .then((list) => list.some((t) => t.includes("🌿"))),
        6_000,
        250,
      );
    await petal();
    let bubble = await bubbleSeen();
    // Сервер держит паузу 700 мс между реакциями автора: повтор клика — не
    // поломка, а лимит; вторая попытка отделена паузой.
    if (!bubble) {
      await sleep(1_400);
      await petal();
      bubble = await bubbleSeen();
    }
    if (!bubble) {
      const p = await probe(host);
      throw new Error(
        `пузырь «реакции в стол» не появился; хвост реакций: ${JSON.stringify(p.reactions.slice(-4))}; ` +
          `ошибка стора: ${p.net?.error ?? "нет"}`,
      );
    }
    const frame = (await probe(host)).reactions.filter((r) => r.emoji === "🌿");
    if (!frame.some((r) => r.chatId === null)) throw new Error("реакция «в стол» ушла с chatId");
    const chips = await host.evaluate(
      (sel) => [...document.querySelectorAll(`${sel} [data-feed-item="chat"] button`)].filter((b) => /^Реакция 🌿/.test(b.getAttribute("aria-label") ?? "")).length,
      GAME_LIST,
    );
    if (chips) throw new Error(`реакция «в стол» прилипла к репликам: чипов ${chips}`);
    ok("реакция «в стол» (chatId = null) всплывает пузырём и не липнет к репликам");
  });

  // ── Пустой net: мёртвый токен зрителя не оставляет пустой экран ──────────
  await guard("пустой net: чужой токен → меню, без пустого экрана", async () => {
    const stale = await newPage("чужой-токен");
    await stale.addInitScript(
      ({ c }) => {
        localStorage.setItem(`evo-watch-${c}`, "deadbeefdeadbeefdeadbeef");
        localStorage.setItem("evo-net-watch-code", c);
      },
      { c: gameCode },
    );
    await gotoUrl(stale, `${BASE}/?room=${gameCode}`);
    const menu = await waitUntil(() => isVisible(stale.getByLabel("Ваше имя")), 25_000, 400);
    if (!menu) throw new Error(`пустой экран вместо меню: ${await bodyOf(stale)}`);
    const p = await probe(stale);
    if (p.net !== null) throw new Error("мёртвый токен всё ещё держит стол в сторе");
    if (p.fatal) warn(`меню с плашкой фатальной ошибки: «${p.fatal}» (допустимо)`);
    ok("мёртвый чужой токен вывел в меню: пустого экрана и падения нет");
    await shot(stale, "w4-08-stale-token");
  });

  // Загрузка/переподключение — не пустая страница: текст есть сразу после F5.
  await guard("перезагрузка партии: экран загрузки/стол, а не пусто", async () => {
    const nav = host.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
    await nav;
    await sleep(250);
    const first = (await bodyOf(host, 400)).trim();
    if (!first) throw new Error("после F5 в партии пустой экран");
    const back = await waitUntil(async () => (await probe(host)).net?.code === gameCode, 25_000, 400);
    if (!back) throw new Error(`F5 в партии не вернул за стол: ${first}`);
    ok(`после F5 экран не пуст («${first.slice(0, 60)}…») и стол восстановлен`);
  });

  // S9 для зрителя: «Покинуть стол» в партии забывает watch-токен.
  await guard("выход зрителя удаляет watch-токен", async () => {
    const before = await tokensOf(spectator, gameCode);
    if (!before.watch) throw new Error("у зрителя не оказалось watch-токена");
    const leave = spectator.locator('button[aria-label="Покинуть стол"]').first();
    if (!(await safeClick(leave, 5000))) throw new Error("кнопка выхода у зрителя не нажалась");
    if (!(await confirmDialog(spectator, "Покинуть стол"))) throw new Error("диалог выхода не подтвердился");
    const out = await waitUntil(async () => (await probe(spectator)).net === null, 12_000, 300);
    if (!out) throw new Error("зритель не вышел в меню");
    const after = await tokensOf(spectator, gameCode);
    if (after.watch || after.watchCode) throw new Error(`watch-токен пережил выход: ${JSON.stringify(after)}`);
    ok("выход зрителя: watch-токен и указатель стола удалены");
  });

  // S9: «Сдаться и выйти» — тот же выход, значит токен тоже забывается.
  await guard("«Сдаться и выйти» забывает токен места", async () => {
    if (!(await tokensOf(host, gameCode)).seat) throw new Error("у хоста не оказалось токена места");
    const leave = host.locator('button[aria-label="Покинуть стол"]').first();
    if (!(await safeClick(leave, 5000))) throw new Error("кнопка выхода не нажалась");
    if (!(await confirmDialog(host, "Сдаться и выйти"))) throw new Error("диалог «Сдаться и выйти» не подтвердился");
    const out = await waitUntil(async () => (await probe(host)).net === null, 15_000, 300);
    if (!out) throw new Error("после сдачи и выхода вкладка не в меню");
    const after = await tokensOf(host, gameCode);
    if (after.seat || after.queue || after.watch) {
      throw new Error(`токены пережили «Сдаться и выйти»: ${JSON.stringify(after)}`);
    }
    ok("«Сдаться и выйти»: токен места удалён, вкладка в меню");
  });
} catch (e) {
  fail(`прогон прерван на шаге «${step}»: ${String(e?.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
}

for (const list of pageProblems) problems.push(...list);

const seconds = Math.round((Date.now() - START_TS) / 1000);
const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""} (${seconds} с)`
  : `ИТОГ: чат волны 4 чист${warnings.length ? ` (предупреждений ${warnings.length})` : ""} (${seconds} с)`;
console.log(`\n${verdict}`);
if (problems.length) console.log(problems.map((p) => ` - ${p}`).join("\n"));
console.log(`Скриншоты: ${SHOTS}`);
process.exitCode = problems.length ? 1 : 0;
