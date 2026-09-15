/**
 * QA волны 6 «Фон сообщений чата — как фон игрока в игре» (M12, продолжение).
 * Живой dev-сервер, две-три вкладки (приёмы qa-wave4-chat.mjs).
 *
 * Просьба владельца: «я попросил сделать для чата и стола ожидания задние фона
 * людей как их задние фона в игре… А Я ПРОСИЛ КАК В ИГРЕ, то есть и с
 * картинкой». Проверяем ровно это:
 *   а) у реплики с цветом автора — подложка цветом (feedTint) И бумажная
 *      текстура paper-sheet (background-image + blend-mode overlay), в лобби,
 *      в ожидающем столе и в доке партии;
 *   б) «как в игре» — объективно: фон карточки автора совпадает с фоном табло
 *      этого игрока в партии (тот же color-mix и та же текстура);
 *   в) сгруппированные реплики одного автора срастаются в единую карточку:
 *      продолжение без ника/времени, прижато вплотную, скругления только на
 *      краях блока;
 *   г) читаемость: контраст текста к ХУДШЕМУ пикселю overlay-текстуры ≥ 4.5:1
 *      (текстура прогоняется через canvas по формуле blend-режима overlay);
 *   д) высота панели чата не растёт от новых сообщений (лобби и док партии);
 *   е) фильтры «Всё/События/Чат» работают, системные записи без текстуры;
 *   ж) оба варианта размещения — panel (лобби/ожидающий) и dock (партия) —
 *      на 1440px и 390px, без горизонтального скролла.
 *
 * Двух людей в один стол startNetGame не поднимает (он добивает все места
 * ботами), поэтому стол создаётся на двух вкладках руками — как в qa-wave4;
 * startNetGame при этом гоняется внутри warmupServer.
 *
 * Запуск при живом dev-сервере: node scripts/qa-wave6-chat.mjs
 * Скриншоты — ТОЛЬКО вне репозитория (%TEMP%, EVO_SHOTS).
 */
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  bodyOf,
  dismissSpotlight,
  dismissTurnCard,
  gotoUrl,
  isVisible,
  openMenu,
  roomCode,
  safeClick,
  sleep,
  trackPage,
  waitPhase,
  waitUntil,
  warmupServer,
} from "./qa-lib.mjs";

const LOBBY_LIST = '[aria-label="Чат стола: записи"]';
const GAME_LIST = '[aria-label="Журнал и чат: записи"]';
const TEXTURE = "texture-paper.jpg";

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

async function newPage(label, viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  // Расхождение SSR/клиента в dev — шум (в т.ч. от параллельных правок).
  pageProblems.push(trackPage(page, label, { ignore: [/hydrated but some attributes/] }));
  return page;
}

// ── примитивы сценария (по образцу qa-wave4-chat.mjs) ────────────────────────

/** Вызов продуктового экшена стора — тот же путь, что у кнопок UI. */
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
          return { ok: false, error: `неизвестная операция ${o}` };
        } catch (e) {
          return { ok: false, error: String(e?.message ?? e), net: store.getState().net?.error ?? null };
        }
      },
      { op, arg: arg ?? null },
    )
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
}

/** Реплика появилась в ВИДИМОЙ ленте вкладки? (в DOM списков бывает два:
 *  колонка xl и скрытая мобильная шторка — берём живой по высоте). */
const feedHas = (page, listSel, text) =>
  page
    .evaluate(
      ({ listSel, text }) => {
        const roots = [...document.querySelectorAll(listSel)];
        const root = roots.find((r) => r.clientHeight > 0) ?? roots[0];
        return [...(root?.querySelectorAll('[data-feed-item="chat"]') ?? [])].some((r) =>
          (r.innerText ?? "").includes(text),
        );
      },
      { listSel, text },
    )
    .catch(() => false);

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

/** Пачка сообщений через клиентский API (лимит сервера: пауза 700 мс). */
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

// ── проверки волны 6 ─────────────────────────────────────────────────────────

/**
 * Крайние N чат-строк ленты: автор, подложка (цвет, текстура, blend), отступ
 * сверху и все четыре радиуса — по ним проверяется и «бумага», и срастание
 * блока одного автора в единую карточку.
 */
function chatRowsProbe(page, listSel, count = 8) {
  return page.evaluate(
    ({ listSel, count }) => {
      // Живой список: колонка xl либо мобильная шторка (в DOM бывают оба).
      const roots = [...document.querySelectorAll(listSel)];
      const root = roots.find((r) => r.clientHeight > 0) ?? roots[0];
      const rows = [...(root?.querySelectorAll('[data-feed-item="chat"]') ?? [])].slice(-count);
      return rows.map((r) => {
        const cs = getComputedStyle(r);
        const prev = r.previousElementSibling;
        const prevRect = prev?.getBoundingClientRect?.();
        const rect = r.getBoundingClientRect();
        return {
          author: r.dataset.author ?? null,
          text: (r.innerText ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
          hasName: Boolean(r.querySelector("span.font-medium")),
          hasTime: Boolean(r.querySelector("time")),
          bg: cs.backgroundColor,
          bgImage: cs.backgroundImage,
          blend: cs.backgroundBlendMode,
          bgPosition: cs.backgroundPosition,
          marginTop: cs.marginTop,
          // Вплотную к предыдущей строке? (null — предыдущей строки нет)
          flush: prevRect ? Math.abs(prevRect.bottom - rect.top) <= 1 : null,
          r: {
            tl: parseFloat(cs.borderTopLeftRadius) || 0,
            tr: parseFloat(cs.borderTopRightRadius) || 0,
            bl: parseFloat(cs.borderBottomLeftRadius) || 0,
            br: parseFloat(cs.borderBottomRightRadius) || 0,
          },
        };
      });
    },
    { listSel, count },
  );
}

/**
 * Подложка реплики = color-mix от цвета ника (та же формула, что feedTint).
 * Сверяется фактический backgroundColor строки с эталоном, посчитанным вживую
 * (как в qa-wave1-chat) — текстура не должна была его изменить.
 */
function tintProbe(page, listSel, author) {
  return page.evaluate(
    ({ listSel, author }) => {
      const roots = [...document.querySelectorAll(listSel)];
      const root = roots.find((r) => r.clientHeight > 0) ?? roots[0];
      const rows = [...(root?.querySelectorAll('[data-feed-item="chat"]') ?? [])].filter(
        (r) => r.dataset.author === author,
      );
      if (!rows.length) return null;
      // Эталон строим по строке с ником (голове блока): у продолжений ника нет,
      // а подложка у всех строк автора одна.
      const row = [...rows].reverse().find((r) => r.querySelector("span.font-medium")) ?? rows[rows.length - 1];
      const cs = getComputedStyle(row);
      const nameSpan = row.querySelector("span.font-medium");
      let expected = null;
      if (nameSpan) {
        const probe = document.createElement("div");
        probe.style.backgroundColor = `color-mix(in oklab, ${getComputedStyle(nameSpan).color} 12%, var(--color-surface))`;
        document.body.appendChild(probe);
        expected = getComputedStyle(probe).backgroundColor;
        probe.remove();
      }
      return { bg: cs.backgroundColor, expected };
    },
    { listSel, author },
  );
}

/** Системная запись: подложки и текстуры быть не должно (без изменений). */
function systemProbe(page, listSel) {
  return page.evaluate(
    (listSel) => {
      const roots = [...document.querySelectorAll(listSel)];
      const root = roots.find((r) => r.clientHeight > 0) ?? roots[0];
      const rows = [...(root?.querySelectorAll('[data-feed-item="system"]') ?? [])];
      if (!rows.length) return null;
      const cs = getComputedStyle(rows[rows.length - 1]);
      return { bg: cs.backgroundColor, bgImage: cs.backgroundImage, blend: cs.backgroundBlendMode };
    },
    listSel,
  );
}

/**
 * Контраст текста к худшему пикселю overlay-текстуры: текстура рисуется на
 * canvas, для каждого пикселя считается результат blend-режима overlay поверх
 * подложки реплики, берётся самый светлый и сверяется с цветом текста.
 * Формула overlay: b ≤ 0.5 → 2·b·s, иначе 1 − 2·(1−b)·(1−s).
 * Заодно — разброс яркости результата: текстура должна быть ВИДНА (иначе владелец
 * снова увидит «просто цвет»), но не заглушать подложку.
 */
function worstContrast(page, listSel) {
  return page.evaluate(
    async (listSel) => {
      const roots = [...document.querySelectorAll(listSel)];
      const root = roots.find((r) => r.clientHeight > 0) ?? roots[0];
      const row = root?.querySelector('[data-feed-item="chat"]');
      if (!row) return { error: "нет чат-строк" };
      const cs = getComputedStyle(row);
      // Компьюted-цвет может прийти и как rgb(...), и как oklab(...) (color-mix
      // Chrome часто так сериализует) — оклаб конвертируем в sRGB через canvas.
      const toRgb = (colorStr) => {
        const m = String(colorStr).match(/rgba?\(([^)]+)\)/);
        if (m) return m[1].split(",").map(Number).slice(0, 3);
        const cc = document.createElement("canvas");
        cc.width = cc.height = 1;
        const cx = cc.getContext("2d");
        cx.fillStyle = "#000";
        cx.fillStyle = colorStr;
        cx.fillRect(0, 0, 1, 1);
        return [...cx.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const base = toRgb(cs.backgroundColor);
      const fg = toRgb(cs.color);
      if (!base || !fg) return { error: `цвет не rgb: bg=${cs.backgroundColor} fg=${cs.color}` };
      const img = new Image();
      img.src = "/img/bg/texture-paper.jpg";
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const lum = (rgb) => {
        const v = rgb.map((x) => {
          x /= 255;
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
      };
      const baseL = lum(base);
      let worst = 0;
      let best = 1;
      let sum = 0;
      let n = 0;
      let worstRgb = null;
      for (let i = 0; i < d.length; i += 4 * 7) {
        const out = base.map((b, k) => {
          const bv = b / 255;
          const sv = d[i + k] / 255;
          return Math.round(255 * (bv <= 0.5 ? 2 * bv * sv : 1 - 2 * (1 - bv) * (1 - sv)));
        });
        const L = lum(out);
        if (L > worst) {
          worst = L;
          worstRgb = out;
        }
        if (L < best) best = L;
        sum += Math.abs(L - baseL);
        n += 1;
      }
      const fgL = lum(fg);
      const ratio = (Math.max(fgL, worst) + 0.05) / (Math.min(fgL, worst) + 0.05);
      return {
        ratio: Math.round(ratio * 100) / 100,
        fg,
        base,
        worstRgb,
        // Насколько текстура вообще видна и насколько «шумит» в среднем.
        spread: Math.round((worst - best) * 1000) / 1000,
        meanDelta: Math.round((sum / Math.max(n, 1)) * 1000) / 1000,
        baseL: Math.round(baseL * 1000) / 1000,
        worstL: Math.round(worst * 1000) / 1000,
        textureW: c.width,
        textureH: c.height,
      };
    },
    listSel,
  );
}

/**
 * «Как в игре»: сравнение карточки автора в чате с табло этого игрока в партии.
 * У обоих должна быть одна формула подложки (color-mix 12%) и одна текстура
 * paper-sheet с blend-mode overlay — тогда computed-стили совпадают буквально.
 */
function seatVsCard(page, author) {
  return page.evaluate(
    (author) => {
      const section = [...document.querySelectorAll("[data-player-section]")].find((s) =>
        (s.innerText ?? "").includes("Ваша популяция"),
      );
      const rows = [...document.querySelectorAll('[data-feed-item="chat"]')].filter(
        (r) => r.dataset.author === author,
      );
      const row = rows[rows.length - 1];
      if (!section || !row) return null;
      const a = getComputedStyle(section);
      const b = getComputedStyle(row);
      return {
        sectionBg: a.backgroundColor,
        rowBg: b.backgroundColor,
        sectionImg: a.backgroundImage,
        rowImg: b.backgroundImage,
        sectionBlend: a.backgroundBlendMode,
        rowBlend: b.backgroundBlendMode,
      };
    },
    author,
  );
}

/** Метрики панели чата и документа: высота не должна расти. */
function panelMetrics(page, listSel, panelSel = "[data-feed-panel]") {
  return page.evaluate(
    ({ listSel, panelSel }) => {
      const panels = [...document.querySelectorAll(panelSel)];
      const panel = panels.find((p) => p.clientHeight > 0) ?? panels[0];
      const lists = [...document.querySelectorAll(listSel)];
      const list = lists.find((l) => l.clientHeight > 0) ?? lists[0];
      return {
        panelH: panel ? Math.round(panel.getBoundingClientRect().height) : null,
        docH: document.documentElement.scrollHeight,
        listH: list ? list.clientHeight : null,
        listScroll: list ? list.scrollHeight : null,
        rows: list ? list.querySelectorAll("[data-feed-item]").length : 0,
      };
    },
    { listSel, panelSel },
  );
}

/** Горизонтального скролла нет? */
const noHScroll = (page) =>
  page
    .evaluate(() => {
      const el = document.scrollingElement ?? document.documentElement;
      return el.scrollWidth <= window.innerWidth + 1;
    })
    .catch(() => false);

/** Сводная проверка «бумаги» на серии строк: текстура + blend + подложка-цвет. */
function assertPaper(rows, where) {
  for (const r of rows) {
    if (!r.bgImage.includes(TEXTURE)) {
      throw new Error(`${where}: у реплики «${r.text}» нет текстуры бумаги (bgImage=${r.bgImage})`);
    }
    if (r.blend !== "overlay") {
      throw new Error(`${where}: blend-mode реплики «${r.text}» — ${r.blend}, ожидался overlay`);
    }
    if (!r.bg || r.bg === "rgba(0, 0, 0, 0)") {
      throw new Error(`${where}: у реплики «${r.text}» нет подложки цветом (${r.bg})`);
    }
  }
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

  // ── Лобби: двое за столом, обмен репликами, бумага и карточки ─────────────
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
    await openMenu(guest);
    const j = await storeAction(guest, "join", { code, name: "Боря" });
    if (!j.ok) throw new Error(`вход не удался: ${j.error}`);
    if (!(await waitUntil(async () => (await roomCode(guest)) === code, 25_000, 400))) {
      throw new Error(`гость не за столом: ${await bodyOf(guest)}`);
    }
    ok(`стол ${code}: Аня (хост) и Боря за местами`);
  });

  await guard("лобби: обмен репликами (блоки по две)", async () => {
    if (!(await sendAndSee(host, "Привет, стол!", LOBBY_LIST))) throw new Error("реплика Ани не доехала");
    if (!(await sendAndSee(guest, "Привет!", LOBBY_LIST))) throw new Error("реплика Бори не доехала");
    if (!(await sendAndSee(guest, "Готов играть", LOBBY_LIST))) throw new Error("вторая реплика Бори не доехала");
    if (!(await waitUntil(() => feedHas(host, LOBBY_LIST, "Готов играть"), 15_000, 300))) {
      throw new Error("блок Бори не доехал до Ани");
    }
    if (!(await sendAndSee(host, "Погнали", LOBBY_LIST))) throw new Error("реплика Ани (блок) не доехала");
    if (!(await sendAndSee(host, "Колоду не меняем", LOBBY_LIST))) throw new Error("вторая реплика Ани не доехала");
    if (!(await waitUntil(() => feedHas(guest, LOBBY_LIST, "Колоду не меняем"), 15_000, 300))) {
      throw new Error("блок Ани не доехал до Бори");
    }
    ok("оба участника обменялись репликами (у каждого блок из двух подряд)");
  });

  await guard("лобби: подложка цветом + текстура бумаги на репликах", async () => {
    const rows = await chatRowsProbe(host, LOBBY_LIST, 6);
    if (rows.length < 5) throw new Error(`в ленте меньше строк, чем отправлено: ${rows.length}`);
    assertPaper(rows, "лобби");
    // Подложка осталась формулой color-mix от цвета автора (текстура её не меняет).
    const t = await tintProbe(host, LOBBY_LIST, "Аня");
    if (!t?.expected || t.bg !== t.expected) {
      throw new Error(`подложка реплики Ани не color-mix: ${t?.bg} vs ${t?.expected}`);
    }
    const sys = await systemProbe(host, LOBBY_LIST);
    if (sys) {
      if (sys.bgImage !== "none" || sys.blend !== "normal") {
        throw new Error(`системная запись получила текстуру: img=${sys.bgImage} blend=${sys.blend}`);
      }
      if (sys.bg !== "rgba(0, 0, 0, 0)") throw new Error(`у системной записи появилась подложка: ${sys.bg}`);
    } else {
      warn("в ленте лобби нет системных записей — проверка их тишины пропущена");
    }
    ok(
      `реплики на бумаге: текстура ${TEXTURE} + blend overlay + color-mix подложка ` +
        `(Аня: ${t.bg}); системные записи без изменений`,
    );
  });

  await guard("лобби: блок автора срастается в одну карточку", async () => {
    const rows = await chatRowsProbe(host, LOBBY_LIST, 6);
    // Последние строки: [Аня «Погнали» (голова блока), Аня «Колоду не меняем» (хвост)].
    const head = rows.find((r) => r.text.includes("Погнали"));
    const tail = rows.find((r) => r.text.includes("Колоду не меняем"));
    if (!head || !tail) throw new Error(`строки блока не найдены: ${JSON.stringify(rows.map((r) => r.text))}`);
    if (head.hasName !== true || head.hasTime !== true) throw new Error("у головы блока нет ника/времени");
    if (tail.hasName !== false || tail.hasTime !== false) throw new Error("продолжение блока повторяет ник/время");
    if (head.r.tl <= 0 || head.r.bl !== 0) {
      throw new Error(`голова блока скруглена не сверху: ${JSON.stringify(head.r)}`);
    }
    if (tail.r.tl !== 0 || tail.r.bl <= 0) {
      throw new Error(`хвост блока скруглен не снизу: ${JSON.stringify(tail.r)}`);
    }
    if (tail.marginTop !== "0px") throw new Error(`продолжение блока оторвано (marginTop=${tail.marginTop})`);
    if (tail.flush !== true) throw new Error(`продолжение блока не прижато к предыдущей строке (зазор ${tail.flush})`);
    if (head.marginTop === "0px") throw new Error("голова блока прилипла к предыдущей записи");
    ok("блок из двух реплик Ани: голова с ником/временем и верхним скруглением, хвост без ника, прижат, нижнее скругление");
  });

  await guard("лобби: контраст текста к худшему пикселю бумаги", async () => {
    const c = await worstContrast(host, LOBBY_LIST);
    if (c.error) throw new Error(c.error);
    if (c.ratio < 4.5) {
      throw new Error(
        `контраст к худшему пикселю overlay: ${c.ratio}:1 (фон ${c.base}, худший ${c.worstRgb}) — текстура шумит`,
      );
    }
    if (c.spread < 0.01) {
      throw new Error(`текстура не видна: разброс яркости подложки всего ${c.spread} — реплика выглядит чистым цветом`);
    }
    if (c.meanDelta > 0.12) {
      warn(`текстура сильно сдвигает подложку в среднем (ΔL=${c.meanDelta}) — сообщить владельцу, если покажется шумно`);
    }
    ok(
      `контраст текста к худшему пикселю бумаги ${c.ratio}:1 (подложка L=${c.baseL} → худший ${c.worstL}, ` +
        `разброс ${c.spread}, средний сдвиг ${c.meanDelta}; текстура ${c.textureW}×${c.textureH})`,
    );
  });

  await guard("лобби: фильтры «Всё/События/Чат»", async () => {
    const counts = async () =>
      host.evaluate((sel) => {
        const root = document.querySelector(sel);
        const visible = (kind) =>
          [...(root?.querySelectorAll(`[data-feed-item="${kind}"]`) ?? [])].filter(
            (r) => r.offsetParent !== null,
          ).length;
        return { chat: visible("chat"), other: visible("system") + visible("action") + visible("important") };
      }, LOBBY_LIST);
    const all = await counts();
    if (!all.chat) throw new Error("до фильтров чат-строк не видно");
    await safeClick(host.getByRole("button", { name: "События", exact: true }), 4000);
    await sleep(400);
    const ev = await counts();
    if (ev.chat !== 0) throw new Error(`фильтр «События» показал чат-строки: ${ev.chat}`);
    await safeClick(host.getByRole("button", { name: "Чат", exact: true }), 4000);
    await sleep(400);
    const ch = await counts();
    if (!ch.chat) throw new Error("фильтр «Чат» спрятал чат-строки");
    await safeClick(host.getByRole("button", { name: "Всё", exact: true }), 4000);
    await sleep(400);
    const back = await counts();
    if (!back.chat) throw new Error("фильтр «Всё» не вернул чат-строки");
    ok(`фильтры работают: было чат=${all.chat}/событий=${all.other} → «События» чат=0 → «Чат» → «Всё» вернуло`);
  });

  await shot(host, "w6-01-lobby-1440");
  await host.locator(LOBBY_LIST).first().screenshot({ path: `${SHOTS}/w6-02-lobby-chat-panel.png` }).catch(() => {});
  ok("скриншоты: лобби 1440 (полный и крупный план панели)");

  await guard("лобби: высота панели не растёт от сообщений", async () => {
    const before = await panelMetrics(host, LOBBY_LIST);
    if (before.panelH === null) throw new Error("панель чата лобби не найдена");
    const filler = "проверка высоты чата и бумаги на длинных строках ".repeat(6);
    const sent = await pumpChat(guest, 10, "Наполнитель", 830, filler);
    if (sent < 8) throw new Error(`дошло меньше сообщений лимита: ${sent} из 10`);
    const grown = await waitUntil(async () => (await panelMetrics(host, LOBBY_LIST)).rows >= before.rows + 8, 25_000, 500);
    if (!grown) throw new Error("новые сообщения не доехали до ленты Ани");
    await sleep(700);
    const after = await panelMetrics(host, LOBBY_LIST);
    if (Math.abs(after.panelH - before.panelH) > 2) {
      throw new Error(`панель чата выросла: ${before.panelH} → ${after.panelH}`);
    }
    if (Math.abs(after.docH - before.docH) > 2) {
      throw new Error(`страница лобби выросла: ${before.docH} → ${after.docH}`);
    }
    if (!(after.listScroll > after.listH)) {
      throw new Error(`список чата не скроллится внутри (${after.listScroll} ≤ ${after.listH})`);
    }
    ok(`панель ${before.panelH}px стабильна на +${sent} сообщений (страница ${after.docH}px, список ${after.listH}/${after.listScroll})`);
    await shot(host, "w6-03-lobby-height");
  });

  // ── Ожидающий стол: тот же panel-вариант, реплика из очереди ──────────────
  await guard("ожидающий: реплика из очереди тоже на бумаге", async () => {
    const waiter = await newPage("ожидающий", { width: 1440, height: 900 });
    await openMenu(waiter);
    const r = await storeAction(waiter, "join", { code, name: "Дима" });
    if (!r.ok) throw new Error(`очередь не удалась: ${r.error}`);
    const queued = await waitUntil(
      () => waiter.evaluate(() => globalThis.__evoStore?.getState?.().net?.waiting === true).catch(() => false),
      25_000,
      400,
    );
    if (!queued) throw new Error(`нет экрана ожидания: ${await bodyOf(waiter)}`);
    if (!(await sendAndSee(waiter, "Дима из очереди", LOBBY_LIST))) throw new Error("реплика Димы не доехала");
    if (!(await waitUntil(() => feedHas(host, LOBBY_LIST, "Дима из очереди"), 15_000, 300))) {
      throw new Error("реплика Димы не доехала до Ани");
    }
    const rows = await chatRowsProbe(host, LOBBY_LIST, 2);
    assertPaper(rows, "реплика ожидающего");
    await shot(waiter, "w6-04-waiting-1440");
    ok("ожидающий стол: та же лента panel-вариантом, реплика из очереди с текстурой");
    await waiter.context().close();
  });

  // ── Мобильное лобби 390: шторка чата ──────────────────────────────────────
  await guard("мобилка 390: чат лобби в шторке", async () => {
    await host.setViewportSize({ width: 390, height: 844 });
    await sleep(600);
    if (!(await noHScroll(host))) throw new Error("в мобильном лобби горизонтальный скролл");
    const open = host.getByRole("button", { name: "Открыть чат стола" }).first();
    if (!(await safeClick(open, 5000))) throw new Error("кнопка «Чат» на мобилке не нажалась");
    await sleep(500);
    if (!(await feedHas(host, LOBBY_LIST, "Дима из очереди"))) throw new Error("в шторке нет истории чата");
    await shot(host, "w6-05-lobby-390");
    await safeClick(host.getByRole("button", { name: "Закрыть чат" }).first(), 4000);
    ok("мобильное лобби 390: шторка чата с историей, горизонтального скролла нет");
  });

  // ── Партия: док-вариант, сравнение с табло игрока ─────────────────────────
  await guard("партия: старт двумя людьми", async () => {
    await host.setViewportSize({ width: 1440, height: 900 });
    await sleep(600);
    const start = host.getByRole("button", { name: "Начать год" }).first();
    if (!(await waitUntil(() => start.isEnabled().catch(() => false), 15_000, 500))) {
      throw new Error(`«Начать год» недоступна; экран: ${await bodyOf(host)}`);
    }
    for (let i = 0; i < 3; i++) {
      await safeClick(start, 5000);
      if (await waitPhase(host, ["development", "foodBank", "feeding"], 45_000)) break;
    }
    if (!(await waitPhase(host, ["development", "foodBank", "feeding"], 10_000))) {
      throw new Error(`партия у Ани не началась; экран: ${await bodyOf(host)}`);
    }
    if (!(await waitPhase(guest, ["development", "foodBank", "feeding"], 45_000))) {
      throw new Error(`партия у Бори не началась; экран: ${await bodyOf(guest)}`);
    }
    await dismissSpotlight(host);
    await dismissTurnCard(host);
    await dismissSpotlight(guest);
    await dismissTurnCard(guest);
    const journal = host.getByRole("button", { name: "Журнал и чат" }).first();
    if (!(await safeClick(journal, 5000))) throw new Error("журнал партии не раскрылся");
    const gJournal = guest.getByRole("button", { name: "Журнал и чат" }).first();
    await safeClick(gJournal, 5000);
    ok("партия началась у обоих, журналы раскрыты");
  });

  await guard("партия: обмен репликами в доке", async () => {
    if (!(await sendAndSee(host, "Ход записан", GAME_LIST))) throw new Error("реплика Ани в доке не доехала");
    if (!(await sendAndSee(host, "Смотрим базу", GAME_LIST))) throw new Error("вторая реплика Ани не доехала");
    if (!(await sendAndSee(guest, "Понял", GAME_LIST))) throw new Error("реплика Бори в доке не доехала");
    if (!(await sendAndSee(guest, "Готов", GAME_LIST))) throw new Error("вторая реплика Бори не доехала");
    if (!(await waitUntil(() => feedHas(host, GAME_LIST, "Готов"), 15_000, 300))) {
      throw new Error("блок Бори не доехал до Ани в доке");
    }
    ok("оба участника обменялись блоками реплик в доке партии");
  });

  await guard("партия: бумага и карточки в доке", async () => {
    const rows = await chatRowsProbe(host, GAME_LIST, 6);
    assertPaper(rows, "док партии");
    const t = await tintProbe(host, GAME_LIST, "Аня");
    if (!t?.expected || t.bg !== t.expected) {
      throw new Error(`подложка в доке не color-mix: ${t?.bg} vs ${t?.expected}`);
    }
    const head = rows.find((r) => r.text.includes("Ход записан"));
    const tail = rows.find((r) => r.text.includes("Смотрим базу"));
    if (!head || !tail) throw new Error(`блок Ани в доке не найден: ${JSON.stringify(rows.map((r) => r.text))}`);
    if (head.r.tl <= 0 || head.r.bl !== 0) throw new Error(`голова блока в доке скруглена не сверху: ${JSON.stringify(head.r)}`);
    if (tail.r.tl !== 0 || tail.r.bl <= 0) throw new Error(`хвост блока в доке скруглен не снизу: ${JSON.stringify(tail.r)}`);
    if (tail.marginTop !== "0px" || tail.flush !== true) {
      throw new Error(`продолжение блока в доке не прижато (mt=${tail.marginTop}, flush=${tail.flush})`);
    }
    ok("док партии: реплики на бумаге, блок Ани срастается, подложка color-mix");
  });

  await guard("партия: карточка автора = фон табло игрока", async () => {
    const cmp = await seatVsCard(host, "Аня");
    if (!cmp) throw new Error("не найдены табло Ани или её реплика");
    if (cmp.sectionBg !== cmp.rowBg) {
      throw new Error(`фон карточки ≠ фон табло: ${cmp.rowBg} vs ${cmp.sectionBg}`);
    }
    if (!cmp.sectionImg.includes(TEXTURE) || !cmp.rowImg.includes(TEXTURE)) {
      throw new Error(`текстура не совпадает: секция ${cmp.sectionImg}, реплика ${cmp.rowImg}`);
    }
    if (cmp.sectionBlend !== "overlay" || cmp.rowBlend !== "overlay") {
      throw new Error(`blend не совпадает: ${cmp.sectionBlend} vs ${cmp.rowBlend}`);
    }
    ok(`«как в игре»: карточка Ани в чате и её табло — один фон (${cmp.rowBg}) и одна текстура с overlay`);
  });

  await guard("партия: высота дока не растёт от сообщений", async () => {
    const before = await panelMetrics(host, GAME_LIST, 'aside[aria-label="Журнал и чат"]');
    if (before.panelH === null) throw new Error("док журнала не найден");
    const filler = "высота дока в партии и бумага на длинных строках ".repeat(5);
    const sent = await pumpChat(guest, 8, "Хвост", 830, filler);
    if (sent < 6) throw new Error(`дошло меньше сообщений лимита: ${sent} из 8`);
    const grown = await waitUntil(async () => (await panelMetrics(host, GAME_LIST, 'aside[aria-label="Журнал и чат"]')).rows >= before.rows + 6, 25_000, 500);
    if (!grown) throw new Error("новые сообщения не доехали до дока Ани");
    await sleep(700);
    const after = await panelMetrics(host, GAME_LIST, 'aside[aria-label="Журнал и чат"]');
    if (Math.abs(after.panelH - before.panelH) > 2) {
      throw new Error(`док вырос: ${before.panelH} → ${after.panelH}`);
    }
    if (Math.abs(after.docH - before.docH) > 4) {
      throw new Error(`страница партии выросла: ${before.docH} → ${after.docH}`);
    }
    if (!(after.listScroll > after.listH)) {
      throw new Error(`список дока не скроллится внутри (${after.listScroll} ≤ ${after.listH})`);
    }
    ok(`док ${before.panelH}px стабилен на +${sent} сообщений (страница ${after.docH}px)`);
  });

  await dismissTurnCard(host);
  await shot(host, "w6-06-game-1440");
  await host
    .locator('[data-player-section]')
    .filter({ hasText: "Ваша популяция" })
    .first()
    .screenshot({ path: `${SHOTS}/w6-07-seat-section.png` })
    .catch(() => {});
  await host
    .locator(`${GAME_LIST} [data-feed-item="chat"]`)
    .filter({ hasText: "Ход записан" })
    .first()
    .screenshot({ path: `${SHOTS}/w6-08-chat-card.png` })
    .catch(() => {});
  ok("скриншоты: партия 1440 (стол с табло и доком), табло Ани и её карточка в чате крупно");

  // ── Мобильная партия 390: журнал-«мессенджер» ─────────────────────────────
  await guard("мобилка 390: журнал партии во весь экран", async () => {
    await host.setViewportSize({ width: 390, height: 844 });
    await sleep(700);
    // Журнал был раскрыт на десктопе — на мобилке это полноэкранная шторка.
    if (!(await feedHas(host, GAME_LIST, "Ход записан"))) throw new Error("в мобильном журнале нет истории");
    if (!(await noHScroll(host))) throw new Error("в мобильной партии горизонтальный скролл");
    await shot(host, "w6-09-game-390");
    ok("мобильная партия 390: журнал-мессенджер с историей, горизонтального скролла нет");
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
  : `ИТОГ: бумага чата волны 6 чиста${warnings.length ? ` (предупреждений ${warnings.length})` : ""} (${seconds} с)`;
console.log(`\n${verdict}`);
if (problems.length) console.log(problems.map((p) => ` - ${p}`).join("\n"));
console.log(`Скриншоты: ${SHOTS}`);
process.exitCode = problems.length ? 1 : 0;
