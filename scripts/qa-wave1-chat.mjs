/**
 * QA волны 1-C «Чат» (M5 + M11 + M12): лобби, ожидающий стол и док партии.
 *
 * Проверяем вживую на dev-сервере:
 *   1) сообщение из лобби доезжает до соседа;
 *   2) ник и подложка реплики окрашены цветом места, системные записи компактны;
 *   3) подряд идущие реплики одного автора сгруппированы (ник и время — один раз);
 *   4) реакции: кнопка у реплики → палитра → чип под сообщением (UI-часть);
 *   5) 50+ сообщений не растят страницу (лобби, ожидающий стол, мобилка) — M5;
 *   6) скролл вверх → своя отправка → список у конца (M11), чужое — «новые»;
 *   7) чат ожидающего стола: фиксированная ячейка, композер в кадре;
 *   8) док партии после правок общего компонента жив.
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave1-chat.mjs
 * Скриншоты пишутся ТОЛЬКО вне репозитория (иначе Tailwind в dev перезагружает
 * вкладки на каждый новый PNG — см. qa-net-lobby.mjs).
 */
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { warmupServer } from "./qa-lib.mjs";

const BASE = process.env.EVO_URL ?? "http://127.0.0.1:8099/";
const SHOTS = process.env.EVO_SHOTS ?? join(tmpdir(), "evo-wave1-shots");
mkdirSync(SHOTS, { recursive: true });

const problems = [];
const warnings = [];
const START_TS = Date.now();
const rel = () => `${Math.round((Date.now() - START_TS) / 1000)}с`;
const ok = (msg) => console.log(`OK: [${rel()}] ${msg}`);
const fail = (msg) => {
  console.log(`FAIL: [${rel()}] ${msg}`);
  problems.push(msg);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

function track(page, label) {
  page.on("pageerror", (e) => fail(`${label}: PAGEERROR ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/NotSameOrigin|favicon/.test(t)) return;
    fail(`${label}: console ${t.slice(0, 200)}`);
  });
}

async function newPage(label, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  track(page, label);
  return page;
}

async function gotoUrl(page, url) {
  await page
    .goto(url, { waitUntil: "networkidle", timeout: 60_000 })
    .catch(() => page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
}

async function waitUntil(check, timeout, interval = 300) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return true;
    await sleep(interval);
  }
  return check();
}

const isVisible = (loc) => loc.isVisible().catch(() => false);
const isEnabled = (loc) => loc.isEnabled().catch(() => false);
const safeClick = (loc, timeout = 3000) =>
  loc
    .click({ timeout })
    .then(() => true)
    .catch(() => false);

async function bodyOf(page) {
  return page
    .evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 180))
    .catch(() => "?");
}

const shot = async (page, name) => {
  const path = join(SHOTS, `${name}.png`);
  await page.screenshot({ path });
  console.log(`  скрин: ${path}`);
  return path;
};

// ── Снимки чата ────────────────────────────────────────────────────────────

const CHAT_LIST = '[aria-label="Чат стола: записи"]';

/** Состояние списка записей: сколько строк и где скролл. */
function chatState(page, sel = CHAT_LIST) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return {
      top: Math.round(el.scrollTop),
      h: el.scrollHeight,
      c: el.clientHeight,
      bottomGap: Math.round(el.scrollHeight - el.scrollTop - el.clientHeight),
      rows: el.children.length,
    };
  }, sel);
}

/** Догнать список до состояния «у конца» (плавный скролл — ждём его). */
const atBottom = (page, sel = CHAT_LIST) =>
  waitUntil(() => chatState(page, sel).then((s) => Boolean(s) && s.bottomGap <= 2), 4000, 150);

const docHeight = (page) => page.evaluate(() => document.body.scrollHeight);

/**
 * Цвет места автора: кружка слева больше нет — цвет переехал в фон строки
 * места (`color-mix(in oklab, <цвет> 12%, surface)`, см. seatTint в
 * net-screens.tsx). Возвращаем hex из стора мест, его rgb-форму (getComputedStyle
 * ника отдаёт rgb, стор — hex; сравнивать их «как есть» нельзя) и фактический
 * фон строки, чтобы сверить и ник, и подложку с одной формулой.
 */
function seatColorOf(page, name) {
  return page.evaluate((name) => {
    const list = document.querySelector("[data-seat-list]");
    if (!list) return null;
    for (const li of list.querySelectorAll("li")) {
      if (!li.innerText.includes(name)) continue;
      const tint = getComputedStyle(li).backgroundColor;
      const seats = globalThis.__evoStore?.getState?.().net?.seats ?? [];
      const seat = seats.find((s) => s.name === name);
      let rgb = null;
      if (seat?.color) {
        const probe = document.createElement("span");
        probe.style.color = seat.color;
        document.body.appendChild(probe);
        rgb = getComputedStyle(probe).color;
        probe.remove();
      }
      return { color: seat?.color ?? null, rgb, tint };
    }
    return null;
  }, name);
}

/** Ряд ленты выбранного автора: ник, подложка, время. */
function rowProbe(page, author, listSel = CHAT_LIST) {
  return page.evaluate(
    ({ author, listSel }) => {
      const root = document.querySelector(listSel);
      if (!root) return null;
      const rows = [...root.querySelectorAll('[data-feed-item="chat"]')].filter(
        (r) => r.dataset.author === author,
      );
      const row = rows[rows.length - 1];
      if (!row) return null;
      const cs = getComputedStyle(row);
      const nameSpan = row.querySelector("span.font-medium");
      // Ожидаемая подложка: та же формула, что в компоненте (feedTint).
      let expected = null;
      if (nameSpan) {
        const probe = document.createElement("div");
        probe.style.backgroundColor = `color-mix(in oklab, ${getComputedStyle(nameSpan).color} 12%, var(--color-surface))`;
        document.body.appendChild(probe);
        expected = getComputedStyle(probe).backgroundColor;
        probe.remove();
      }
      return {
        text: row.innerText.replace(/\s+/g, " ").trim().slice(0, 80),
        nameColor: nameSpan ? getComputedStyle(nameSpan).color : null,
        bg: cs.backgroundColor,
        expectedTint: expected,
        hasTime: Boolean(row.querySelector("time")),
        hasName: Boolean(nameSpan),
        fontSize: cs.fontSize,
      };
    },
    { author, listSel },
  );
}

/** Последние N реплик чата: у кого есть время и ник (признак начала блока). */
function groupProbe(page, count) {
  return page.evaluate(
    ({ count, sel }) => {
      const root = document.querySelector(sel);
      const rows = [...(root?.querySelectorAll('[data-feed-item="chat"]') ?? [])].slice(-count);
      return rows.map((r) => ({
        author: r.dataset.author ?? null,
        hasTime: Boolean(r.querySelector("time")),
        hasName: Boolean(r.querySelector("span.font-medium")),
        text: r.innerText.replace(/\s+/g, " ").trim().slice(0, 40),
      }));
    },
    { count, sel: CHAT_LIST },
  );
}

/** Системные записи стола: кегль, точка-маркер, отсутствие подложки. */
function systemProbe(page) {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    const rows = [...(root?.querySelectorAll('[data-feed-item="system"]') ?? [])];
    if (!rows.length) return null;
    const r = rows[rows.length - 1];
    const cs = getComputedStyle(r);
    return {
      text: r.innerText.replace(/\s+/g, " ").trim().slice(0, 60),
      fontSize: cs.fontSize,
      bg: cs.backgroundColor,
      dot: Boolean(r.querySelector("span.rounded-full")),
      italic: cs.fontStyle,
    };
  }, CHAT_LIST);
}

/** Отправка сообщения через UI чата стола. */
async function sendViaUi(page, text) {
  const box = page.getByRole("textbox", { name: "Сообщение в чат" }).first();
  await box.waitFor({ timeout: 15_000 });
  await box.fill(text);
  await safeClick(page.getByRole("button", { name: "Отправить сообщение" }).first(), 4000);
}

/**
 * Отправка с подтверждением доставки. Сервер держит лимиты (20/мин и пауза
 * 700 мс на автора), поэтому «Слишком часто» — это нормальный отказ, а не
 * поломка: повторяем отправку, пока сообщение не появится в ленте.
 */
async function sendAndSee(page, text, attempts = 3, timeout = 8000) {
  for (let i = 0; i < attempts; i++) {
    await sendViaUi(page, text);
    if (await waitUntil(() => page.getByText(text).count().then((n) => n > 0), timeout, 300)) return true;
    await sleep(1500);
  }
  return false;
}

/** Пачка сообщений через клиентский API (лимит сервера: 20/мин, пауза 700 мс). */
function pumpChat(page, count, tag, delay = 820) {
  return page.evaluate(
    async ({ count, tag, delay }) => {
      const api = await import("/src/lib/net/api.ts");
      const code =
        new URLSearchParams(location.search).get("room")?.toUpperCase() ??
        document.querySelector("[data-room-code]")?.textContent?.trim();
      const token =
        localStorage.getItem(`evo-seat-${code}`) ??
        localStorage.getItem(`evo-queue-${code}`) ??
        localStorage.getItem(`evo-watch-${code}`);
      let sent = 0;
      let failed = 0;
      let lastError = null;
      for (let i = 0; i < count; i++) {
        try {
          const r = await api.netChat({ data: { code, token, text: `${tag} ${i + 1}` } });
          if (r && r.ok) sent += 1;
          else {
            failed += 1;
            lastError = r?.error ?? "нет ответа";
          }
        } catch (e) {
          failed += 1;
          lastError = String(e?.message ?? e);
        }
        await new Promise((res) => setTimeout(res, delay));
      }
      return { code, sent, failed, lastError };
    },
    { count, tag, delay },
  );
}

// ── Служебное: столы ───────────────────────────────────────────────────────

async function roomCode(page) {
  const loc = page.locator("[data-room-code]").first();
  if (!(await loc.count())) return null;
  return ((await loc.textContent().catch(() => null)) ?? "").trim() || null;
}

async function createRoom(page, name, capacity) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, BASE);
    const nameInput = page.getByLabel("Ваше имя");
    if (!(await waitUntil(() => isVisible(nameInput), 15_000))) continue;
    await nameInput.fill(name).catch(() => {});
    const capBtn = page
      .locator("fieldset", { hasText: "Мест за столом" })
      .getByRole("button", { name: String(capacity), exact: true });
    if (await capBtn.count()) {
      for (let i = 0; i < 4; i++) {
        const cls = (await capBtn.getAttribute("class").catch(() => "")) ?? "";
        if (cls.includes("bg-accent")) break;
        await safeClick(capBtn, 3000);
        await sleep(800);
      }
    }
    const createBtn = page.getByRole("button", { name: "Создать стол" }).last();
    await waitUntil(() => isEnabled(createBtn), 5_000);
    await safeClick(createBtn, 5000);
    if (await waitUntil(() => page.locator("[data-room-code]").count(), 20_000)) {
      return (await roomCode(page)) ?? "";
    }
  }
  return "";
}

async function joinRoom(page, code, name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, `${BASE}?room=${code}`);
    if ((await roomCode(page)) === code) return;
    const nameInput = page.getByLabel("Ваше имя");
    if (!(await isVisible(nameInput))) continue;
    await nameInput.fill(name).catch(() => {});
    const join = page.getByRole("button", { name: "Войти", exact: true });
    for (let i = 0; i < 6; i++) {
      await waitUntil(() => isEnabled(join), 4_000, 300);
      await safeClick(join, 3000);
      if (await waitUntil(async () => (await roomCode(page)) === code, 4_000, 300)) return;
    }
  }
  throw new Error(`не удалось войти в стол ${code} за «${name}»`);
}

/** Вкладка за столом (лобби или ожидающий экран): при необходимости возвращаем. */
async function ensureTable(page, code, name) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if ((await roomCode(page)) === code) return true;
    await joinRoom(page, code, name);
    if ((await roomCode(page)) === code) return true;
    await sleep(800);
  }
  return (await roomCode(page)) === code;
}

// ── Прогрев dev-сервера ────────────────────────────────────────────────────
// Общий warmupServer из qa-lib: компилирует serverFn негодными данными (стол
// не создаётся — квота «10 столов/час» не тратится), импортирует модули партии
// и поднимает настоящий сетевой стол с ботом. Локальная копия прогрева убрана:
// она била валидным netCreateRoom каждые 2–3 с и сама выедала лимит волны 4.

// ── Сценарий ───────────────────────────────────────────────────────────────

let step = "старт";
const guard = async (label, fn) => {
  step = label;
  try {
    await fn();
  } catch (e) {
    // step в сообщении — чтобы упавший шаг было видно и в сводке, и в логе.
    fail(`${step}: ${String(e.message ?? e).split("\n")[0]}`);
  }
};

try {
  await guard("прогрев dev-сервера", () => warmupServer(browser));

  const host = await newPage("хост", { width: 1280, height: 900 });
  const guest = await newPage("гость", { width: 1280, height: 900 });
  const waiter = await newPage("ожидающий", { width: 1280, height: 900 });
  for (const p of [host, guest, waiter]) await gotoUrl(p, BASE);
  await sleep(800);

  let code = "";

  await guard("стол и три вкладки", async () => {
    code = await createRoom(host, "Аня", 2);
    if (!/^[A-Z]{4}$/.test(code)) throw new Error(`странный код стола: "${code}"`);
    ok(`стол ${code} создан (2 места)`);
    await joinRoom(guest, code, "Боря");
    if (!(await ensureTable(guest, code, "Боря"))) throw new Error("гость не сел за стол");
    await joinRoom(waiter, code, "Вася");
    if (!(await ensureTable(waiter, code, "Вася"))) throw new Error("ожидающий не попал на стол");
    const queued = await waitUntil(() => waiter.getByText(/в очереди/i).count().then((n) => n > 0), 20_000);
    if (!queued) throw new Error(`нет экрана очереди: ${await bodyOf(waiter)}`);
    ok("гость сел за стол, третий участник — в ожидающем столе");
  });

  await guard("доставка сообщения в чате лобби", async () => {
    await ensureTable(host, code, "Аня");
    await sendAndSee(host, "Привет, стол!");
    const arrived = await waitUntil(() => guest.getByText("Привет, стол!").count().then((n) => n > 0), 20_000);
    if (!arrived) throw new Error(`сообщение не доехало; экран: ${await bodyOf(guest)}`);
    ok("сообщение чата лобби доехало до соседа");
  });

  await guard("цвет автора, подложка, системные записи", async () => {
    const anya = await seatColorOf(host, "Аня");
    if (!anya?.color) throw new Error("в списке мест нет строки Ани с цветом");
    const row = await rowProbe(host, "Аня");
    if (!row) throw new Error("нет строки с ником Ани в ленте");
    if (row.nameColor !== anya.rgb) {
      throw new Error(`ник не окрашен цветом места: ник ${row.nameColor}, место ${anya.color} (${anya.rgb})`);
    }
    // Фон строки места — color-mix(цвет 12%, surface); сверяем его с той же
    // формулой, посчитанной от цвета ника: ник и фон обязаны говорить одно.
    if (!anya.tint || anya.tint !== row.expectedTint) {
      throw new Error(`фон строки места не color-mix от цвета: фон ${anya.tint}, ожидалось ${row.expectedTint}`);
    }
    if (!row.expectedTint || row.bg !== row.expectedTint) {
      throw new Error(`подложка реплики не совпала с color-mix: фон ${row.bg}, ожидалось ${row.expectedTint}`);
    }
    ok(`ник и фон строки места — цвет места ${anya.color}; подложка реплики ${row.bg}: «${row.text}»`);

    // Системная запись «кто-то присоединился/встал в очередь» доезжает поллингом.
    const hasSystem = await waitUntil(() => systemProbe(host).then(Boolean), 15_000);
    if (!hasSystem) throw new Error("в ленте нет системных записей стола");
    const sys = await systemProbe(host);
    if (sys.fontSize !== "10px") throw new Error(`системная запись не мельче реплик: ${sys.fontSize}`);
    if (!sys.dot) throw new Error("у системной записи нет точки-маркера");
    if (sys.bg !== "rgba(0, 0, 0, 0)" && sys.bg !== "transparent") {
      throw new Error(`у системной записи появилась подложка: ${sys.bg}`);
    }
    ok(`системная запись компактна (${sys.fontSize}, точка, без подложки): «${sys.text}»`);
    await shot(host, "01-lobby-chat");
  });

  await guard("группировка реплик одного автора", async () => {
    // Сервер держит паузу 700 мс между сообщениями автора: ждём доставку
    // каждой реплики, иначе вторая уходит в «Слишком часто» и блок рвётся.
    for (const t of ["Про группировку 1", "Про группировку 2", "Про группировку 3"]) {
      if (!(await sendAndSee(host, t))) throw new Error(`реплика «${t}» не доехала (лимит чата?)`);
      await sleep(900);
    }
    const rows = await groupProbe(host, 3);
    const authors = new Set(rows.map((r) => r.author));
    if (authors.size !== 1) throw new Error(`последние три реплики не от одного автора: ${JSON.stringify(rows)}`);
    const named = rows.filter((r) => r.hasName && r.hasTime).length;
    if (named !== 1) throw new Error(`ник/время повторяются у блока: ${JSON.stringify(rows)}`);
    if (rows.some((r) => !r.text)) throw new Error(`строка блока без текста: ${JSON.stringify(rows)}`);
    ok("подряд идущие реплики одного автора сгруппированы (ник и время — один раз)");
    await shot(host, "02-lobby-grouped");
  });

  await guard("реакции: кнопка, палитра, чип", async () => {
    const row = host.locator(`${CHAT_LIST} [data-feed-item="chat"]`).last();
    await row.hover();
    const trigger = row.getByRole("button", { name: "Поставить реакцию" });
    if (!(await trigger.count())) throw new Error("у реплики нет кнопки реакции");
    await safeClick(trigger, 4000);
    const picker = row.getByRole("group", { name: "Реакции" });
    if (!(await waitUntil(() => isVisible(picker), 5_000))) throw new Error("палитра реакций не раскрылась");
    const emoji = picker.getByRole("button", { name: "Реакция 👏", exact: true });
    if (!(await emoji.count())) throw new Error("нет эмодзи 👏 в палитре");
    await safeClick(emoji, 4000);
    const chip = row.getByRole("button", { name: "Реакция 👏: 1", exact: true });
    if (!(await waitUntil(() => chip.count().then((n) => n > 0), 5_000))) {
      throw new Error("чип реакции не появился под сообщением");
    }
    if ((await chip.getAttribute("aria-pressed")) !== "true") throw new Error("чип не отмечен как «моя реакция»");
    await shot(host, "03-lobby-reaction");
    ok("реакция ставится: кнопка у реплики → палитра → чип под сообщением");
  });

  // ── M5: 50+ сообщений не должны растить страницу ────────────────────────
  await guard("50+ сообщений: высота страницы не растёт", async () => {
    await ensureTable(waiter, code, "Вася");
    const lobbyBefore = await docHeight(host);
    const waiterBefore = await docHeight(waiter);
    // Хост льёт меньше всех: у него впереди ещё проверка своей отправки, а
    // серверный лимит — 20 сообщений в минуту на автора (иначе «Слишком часто»).
    const [a, b, c] = await Promise.all([
      pumpChat(host, 10, "Прогон Ани"),
      pumpChat(guest, 18, "Прогон Бори"),
      pumpChat(waiter, 18, "Прогон Васи"),
    ]);
    const sent = a.sent + b.sent + c.sent;
    if (sent < 40) throw new Error(`не догнали до 50 сообщений: отправлено ${sent} (${JSON.stringify([a, b, c])})`);
    const plenty = await waitUntil(async () => ((await chatState(host))?.rows ?? 0) >= 50, 25_000);
    const st = await chatState(host);
    if (!plenty) throw new Error(`в ленте меньше 50 записей: ${JSON.stringify(st)}`);
    await sleep(800);
    const lobbyAfter = await docHeight(host);
    const waiterAfter = await docHeight(waiter);
    if (Math.abs(lobbyAfter - lobbyBefore) > 2) {
      throw new Error(`лобби выросло: ${lobbyBefore} → ${lobbyAfter}`);
    }
    if (Math.abs(waiterAfter - waiterBefore) > 2) {
      throw new Error(`ожидающий стол вырос: ${waiterBefore} → ${waiterAfter}`);
    }
    if (!st || st.h <= st.c) throw new Error(`список чата не скроллится внутри (${JSON.stringify(st)})`);
    ok(
      `после ${sent} сообщений (в ленте ${st.rows}): лобби ${lobbyBefore}→${lobbyAfter}, ` +
        `ожидающий ${waiterBefore}→${waiterAfter}; скролл внутри списка`,
    );
    await shot(host, "04-lobby-many");
  });

  // ── M11: своё сообщение видно из любой позиции скролла ──────────────────
  await guard("автопрокрутка: своё сообщение из верха списка", async () => {
    const before = await host.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.scrollTop = 0;
      return { h: el.scrollHeight, c: el.clientHeight };
    }, CHAT_LIST);
    await sleep(400);
    const top = await chatState(host);
    if (!before || before.h <= before.c) throw new Error(`список чата не переполнен: ${JSON.stringify(before)}`);
    if (top.top !== 0) throw new Error(`не удалось отскроллить вверх: top=${top.top}`);
    if (!(await sendAndSee(host, "Видно ли меня?"))) throw new Error("своё сообщение не доехало (лимит чата?)");
    if (!(await atBottom(host))) {
      const st = await chatState(host);
      throw new Error(`после отправки список не у конца: bottomGap=${st.bottomGap} (top=${st.top}, h=${st.h}, c=${st.c})`);
    }
    const st = await chatState(host);
    ok(`своё сообщение из верха списка прокрутило чат к концу (bottomGap=${st.bottomGap})`);
  });

  await guard("входящее при отскролленном вверх списке — «новые»", async () => {
    await host.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollTop = 0;
    }, CHAT_LIST);
    await sleep(400);
    const before = await chatState(host);
    if (!(await sendAndSee(guest, "А это входящее"))) throw new Error("входящее не отправилось");
    const seen = await waitUntil(() => host.getByText("А это входящее").count().then((n) => n > 0), 20_000);
    if (!seen) throw new Error("входящее сообщение не доехало");
    await sleep(500);
    const after = await chatState(host);
    if (after.top !== before.top) {
      throw new Error(`скролл уехал сам при входящем (было top=${before.top}, стало top=${after.top})`);
    }
    const chip = host.getByRole("button", { name: /Показать новые записи/ });
    if (!(await chip.count())) throw new Error("нет кнопки «новые» после входящего при отскролленном вверх списке");
    await safeClick(chip.first(), 3000);
    if (!(await atBottom(host))) throw new Error("кнопка «новые» не прокрутила список к концу");
    ok(`входящее осталось на месте (top=${after.top}), «новые» появились и прокручивают к концу`);
  });

  // ── M5: ожидающий стол, десктоп и мобилка ───────────────────────────────
  await guard("ожидающий стол: чат фиксированной ячейки", async () => {
    await ensureTable(waiter, code, "Вася");
    const desktop = await waiter.evaluate((sel) => {
      const list = document.querySelector(sel);
      const panel = list?.closest('div[class*="overflow-hidden"]') ?? null;
      const cell = panel?.parentElement ?? null;
      const composer = document.querySelector('textarea[aria-label="Сообщение в чат"]');
      return {
        hasList: Boolean(list),
        panelH: panel ? Math.round(panel.getBoundingClientRect().height) : null,
        cellH: cell ? Math.round(cell.getBoundingClientRect().height) : null,
        composerBottom: composer ? Math.round(composer.getBoundingClientRect().bottom) : null,
        viewport: window.innerHeight,
      };
    }, CHAT_LIST);
    if (!desktop.hasList) throw new Error(`в ожидающем столе нет чата (${JSON.stringify(desktop)})`);
    if (!desktop.panelH || desktop.panelH < 200) throw new Error(`панель чата схлопнулась: ${JSON.stringify(desktop)}`);
    if (desktop.composerBottom === null || desktop.composerBottom > desktop.viewport + 1) {
      throw new Error(`композер чата вне экрана: ${JSON.stringify(desktop)}`);
    }
    await shot(waiter, "05-waiting-desktop");
    ok(`ожидающий (десктоп): панель чата ${desktop.panelH}px в колонке ${desktop.cellH}px, композер в кадре`);

    // Тот же цвет автора, что в лобби: в ожидающем лента питается тем же хуком.
    const anya = await seatColorOf(waiter, "Аня");
    const row = await rowProbe(waiter, "Аня");
    if (!anya?.rgb || !row) throw new Error(`нет цвета/строки автора в ожидающем (${JSON.stringify({ anya, row })})`);
    if (row.nameColor !== anya.rgb || row.bg !== row.expectedTint || anya.tint !== row.expectedTint) {
      throw new Error(`в ожидающем ник/подложка не окрашены: ник ${row.nameColor}, место ${anya.color} (${anya.rgb}), фон строки ${anya.tint}, фон реплики ${row.bg} vs ${row.expectedTint}`);
    }
    ok(`ожидающий: ник и подложка реплики окрашены цветом места (${anya.color})`);

    // Мобильная ширина: ячейка чата фиксированной высоты, страница не растёт.
    await waiter.setViewportSize({ width: 390, height: 844 });
    await sleep(800);
    const before = await docHeight(waiter);
    const cell = await waiter.evaluate((sel) => {
      const list = document.querySelector(sel);
      const panel = list?.closest('div[class*="overflow-hidden"]') ?? null;
      const c = panel?.parentElement ?? null;
      return {
        cellH: c ? Math.round(c.getBoundingClientRect().height) : null,
        panelH: panel ? Math.round(panel.getBoundingClientRect().height) : null,
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
      };
    }, CHAT_LIST);
    await pumpChat(host, 5, "Мобильный прогон", 900);
    await sleep(1800);
    const after = await docHeight(waiter);
    if (Math.abs(after - before) > 2) throw new Error(`мобильная страница выросла: ${before} → ${after}`);
    if (cell.overflowX > 0) throw new Error(`горизонтальный скролл на 390px: ${cell.overflowX}`);
    await shot(waiter, "06-waiting-mobile");
    ok(
      `ожидающий (390px): ячейка чата ${cell.cellH}px (панель ${cell.panelH}px), после 5 сообщений ${before}→${after}`,
    );
    await waiter.setViewportSize({ width: 1280, height: 900 });
    await sleep(500);
  });

  // ── Док партии: общий компонент не сломал журнал игры ───────────────────
  await guard("док партии: журнал и чат", async () => {
    await ensureTable(host, code, "Аня");
    const start = host.getByRole("button", { name: "Начать год" });
    if (!(await waitUntil(() => isEnabled(start), 10_000))) throw new Error("«Начать год» недоступна");
    await safeClick(start, 5000);
    const started = await waitUntil(() => host.getByText(/Год 1/).count().then((n) => n > 0), 40_000);
    if (!started) throw new Error(`партия не началась: ${await bodyOf(host)}`);
    await waitUntil(() => guest.getByText(/Год 1/).count().then((n) => n > 0), 40_000);
    await safeClick(guest.getByRole("button", { name: "Журнал и чат" }).first(), 5000);
    await sleep(800);
    // Локатор без .first() падает на strict mode: при 1280px в DOM есть и
    // колонка xl, и (скрытая) мобильная шторка с той же aria-меткой.
    const log = guest.locator('[aria-label="Журнал и чат: записи"]').first();
    if (!(await waitUntil(() => isVisible(log), 10_000))) throw new Error("журнал партии не раскрылся");
    const GAME_LIST = '[aria-label="Журнал и чат: записи"]';
    const row = await rowProbe(guest, "Аня", GAME_LIST);
    if (row && row.nameColor && row.bg !== row.expectedTint) {
      throw new Error(`в доке партии подложка не совпала: ${row.bg} vs ${row.expectedTint}`);
    }
    // M11 в доке партии: тот же автопрокрут из верха списка.
    await guest.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollTop = 0;
    }, GAME_LIST);
    await sleep(400);
    const before = await chatState(guest, GAME_LIST);
    if (!(await sendAndSee(guest, "Док: своё сообщение"))) throw new Error("сообщение в доке партии не доехало (лимит чата?)");
    if (!(await atBottom(guest, GAME_LIST))) {
      const st = await chatState(guest, GAME_LIST);
      throw new Error(`док не прокрутился к своему сообщению: bottomGap=${st.bottomGap} (top=${st.top}, h=${st.h}, c=${st.c})`);
    }
    await shot(guest, "07-game-dock");
    ok(
      `док партии: лента жива, своё сообщение прокрутило список из верха (было top=${before.top}, ` +
        `${row ? `подложка ${row.bg}` : "реплик Ани нет"})`,
    );
  });
} catch (e) {
  fail(`прогон прерван: ${String(e.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
}

const seconds = Math.round((Date.now() - START_TS) / 1000);
const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""} (${seconds} с)`
  : `ИТОГ: чат волны 1 чист${warnings.length ? ` (предупреждений ${warnings.length})` : ""} (${seconds} с)`;
console.log(`\n${verdict}`);
console.log(`Скриншоты: ${SHOTS}`);
process.exitCode = problems.length ? 1 : 0;
