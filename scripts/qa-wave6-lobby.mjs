/**
 * QA волны 6 — переработка лобби по словам владельца:
 *   1) блока «Доступ к столу» и кнопки «Скопировать ссылку и пароль» больше
 *      нет: копирование — иконкой Copy у кода стола; пароль приватного стола —
 *      компактным чипом справа от кода (•••• → клик показывает цифры), рядом
 *      карандаш inline-правки и иконка-замок приватности;
 *   2) карандаш смены имени — сразу после имени, бейджи «хост»/«это вы» —
 *      после него;
 *   3) строки мест — с бумажной текстурой paper-sheet, как табло игрока
 *      в партии (сравнение по computedStyle.backgroundImage);
 *   4) кнопки «Начать год»/«Покинуть стол» на мобилке (390px) — крупнее:
 *      высота тап-таргета ≥48px (замер вживую, до правки «Начать год»
 *      схлопывалась до ~20px из-за flex-1 в колонке).
 *
 * Запускать при живом dev-сервере: node scripts/qa-wave6-lobby.mjs
 * Скриншоты — в %TEMP% (EVO_SHOTS), НЕ в репозиторий: Tailwind в dev
 * пересобирает SSR на каждый новый файл в проекте и роняет вкладки.
 *
 * Сценарий двухвкладочный (хост + гость), по приёмам qa-wave2-lobby.mjs;
 * создания/входы идут через экшены стора (те же вызовы, что делают кнопки),
 * проверки UI — по фактическому DOM: navigator.clipboard, computedStyle,
 * getBoundingClientRect. Начинается с прогрева dev-цепочки.
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  bodyOf,
  ensureLobby,
  gotoUrl,
  isEnabled,
  isVisible,
  menuReady,
  netState,
  roomCode,
  safeClick,
  shotsDir,
  sleep,
  trackPage,
  waitUntil,
  warmupServer,
} from "./qa-lib.mjs";

const SHOTS = shotsDir();
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

/** Создание приватного стола экшеном стора (тот же вызов, что кнопка меню). */
async function createPrivateRoom(page, name) {
  const r = await page.evaluate(async (who) => {
    const store = globalThis.__evoStore;
    if (!store) return null;
    await store.getState().startNetCreate({
      name: who,
      capacity: 4,
      botSeats: 0,
      difficulty: "normal",
      modules: {},
      isPrivate: true,
    });
    return store.getState().net?.code ?? null;
  }, name);
  if (r) await waitUntil(() => roomCode(page), 20_000, 300);
  return r;
}

/**
 * Вход гостя по коду с паролем: сначала UI-путь (?room= → форма → поле пароля
 * по требованию сервера), при dev-потере машиночитаемого кода — откат на тот
 * же экшен стора startNetJoin (как в qa-wave2-lobby.mjs).
 */
async function attemptJoin(page, code, name, password, attempts = 2) {
  for (let a = 0; a < attempts; a++) {
    await gotoUrl(page, `${BASE}/?room=${code}`);
    if ((await roomCode(page)) === code) return { ok: true, via: "ui" };
    const nameInput = page.getByLabel("Ваше имя");
    if (!(await waitUntil(() => isVisible(nameInput), 15_000))) continue;
    await fillStable(nameInput, name);
    if (!(await page.getByLabel("Код стола").count())) {
      const toggle = page.getByRole("button", { name: "Присоединиться к столу" });
      if (await toggle.count()) {
        await safeClick(toggle.first(), 3000);
        await waitUntil(() => page.getByLabel("Код стола").count().then((n) => n > 0), 6_000, 400);
      }
    }
    const codeInput = page.getByLabel("Код стола");
    if (await codeInput.count()) {
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        const v = (await codeInput.inputValue().catch(() => "")).trim().toUpperCase();
        if (v === code) break;
        await codeInput.fill(code).catch(() => {});
        await sleep(400);
      }
    }
    const join = page.getByRole("button", { name: "Войти", exact: true });
    for (let i = 0; i < 4; i++) {
      if (password) {
        const pw = page.getByLabel("Пароль стола");
        if (await isVisible(pw)) await fillStable(pw, password, 6_000);
      }
      await waitUntil(() => isEnabled(join), 4_000, 300);
      await safeClick(join);
      if (await waitUntil(async () => (await roomCode(page)) === code, 4_500, 300)) {
        return { ok: true, via: "ui" };
      }
      if (await page.getByText(/Неверный пароль стола/).count()) {
        return { ok: false, via: "ui", error: "Неверный пароль стола" };
      }
    }
    if (password) {
      const r = await page
        .evaluate(
          async ({ c, n, pw }) => {
            const store = globalThis.__evoStore;
            if (!store) return { threw: "нет __evoStore" };
            try {
              await store.getState().startNetJoin(c, n, pw);
            } catch (e) {
              return { threw: String(e?.message ?? e) };
            }
            return { threw: null };
          },
          { c: code, n: name, pw: password },
        )
        .catch((e) => ({ threw: String(e.message) }));
      if (await waitUntil(async () => (await roomCode(page)) === code, 6_000, 400)) {
        return { ok: true, via: "store" };
      }
      if (r.threw) return { ok: false, via: "store", error: r.threw };
    }
  }
  return { ok: false, via: "none", error: null };
}

/** fill с проверкой приживления значения (dev-гидратация затирает ввод). */
async function fillStable(locator, value, timeout = 12_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    await locator.fill(value).catch(() => {});
    await sleep(400);
    if (((await locator.inputValue().catch(() => "")) ?? "") === value) return true;
  }
  return false;
}

/**
 * Вход тем же экшеном стора, что вызывает кнопка «Войти» — один запрос вместо
 * серии UI-попыток. У сервера квота входов 30/мин на источник, и сценарий
 * тратит её негативной проверкой старого пароля и третьим игроком.
 */
async function storeJoin(page, code, name, password) {
  // Стор появляется после гидратации: у свежей вкладки globalThis пуст.
  await waitUntil(
    () => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false),
    15_000,
    300,
  );
  const r = await page
    .evaluate(
      async ({ c, n, pw }) => {
        const store = globalThis.__evoStore;
        if (!store) return { ok: false, error: "нет __evoStore" };
        try {
          await store.getState().startNetJoin(c, n, pw);
        } catch (e) {
          return { ok: false, error: String(e?.message ?? e) };
        }
        return { ok: true, error: null };
      },
      { c: code, n: name, pw: password },
    )
    .catch((e) => ({ ok: false, error: String(e.message) }));
  if (r.ok) await waitUntil(() => roomCode(page), 15_000, 300);
  return r;
}

/** Высота кнопки по подписи (boundingClientRect, в px). */
async function buttonHeight(page, label) {
  const loc = page.getByRole("button", { name: label, exact: true }).first();
  if (!(await loc.count().catch(() => 0))) return null;
  const box = await loc.boundingBox().catch(() => null);
  return box ? Math.round(box.height) : null;
}

let step = "старт";
const guard = async (label, fn) => {
  step = label;
  const t0 = Date.now();
  try {
    await fn();
  } catch (e) {
    fail(`${label}: ${String(e.message ?? e).split("\n")[0]} (${Math.round((Date.now() - t0) / 1000)} с)`);
  }
};

const browser = await chromium.launch();
try {
  await guard("прогрев dev-сервера", () => warmupServer(browser, { log: (m) => console.log(`  ${m}`) }));
  if (problems.length) throw new Error("dev-сервер не прогрет — сценарий не запускается");

  const hostCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const host = await hostCtx.newPage();
  trackPage(host, "хост");
  await gotoUrl(host, `${BASE}/`);
  if (!(await menuReady(host))) throw new Error(`меню хоста не открылось; экран: ${await bodyOf(host)}`);

  // Хост создаёт приватный стол без ботов (2 человека, остальные места пустые).
  let code = "";
  let createdPassword = null;
  await guard("приватный стол хоста", async () => {
    code = await createPrivateRoom(host, "Аня");
    if (!/^[A-Z0-9]{4}$/.test(code ?? "")) throw new Error(`странный код стола: "${code}"`);
    const st = await netState(host);
    if (!st?.isPrivate) throw new Error("стол создан не приватным");
    if (!/^\d{4}$/.test(st.password ?? "")) throw new Error(`пароль хоста не 4 цифры: ${st.password}`);
    createdPassword = st.password;
    ok(`приватный стол ${code} создан, пароль сервера ${createdPassword}`);
  });
  if (!code) throw new Error("нет стола — дальше проверять нечего");

  // ── 1. Блока «Доступ к столу» и старой кнопки нет; иконка копирования есть ──
  await guard("блок «Доступ к столу» удалён, копирование — у кода", async () => {
    const text = await host.evaluate(() => document.body.innerText);
    if (text.includes("Доступ к столу")) fail("на экране остался заголовок «Доступ к столу»");
    else ok("блока «Доступ к столу» нет");
    // Старые кнопки имели точные подписи «Скопировать ссылку (и пароль)»;
    // новая иконка — aria-label «Скопировать ссылку на стол», её не считаем.
    const oldBtn = await host
      .getByRole("button", { name: /^Скопировать ссылку( и пароль)?$/ })
      .count();
    if (oldBtn) fail(`осталась старая кнопка копирования (${oldBtn})`);
    else ok("кнопки «Скопировать ссылку (и пароль)» нет");
    if (text.includes("Сгенерировать новый")) fail("осталась кнопка «Сгенерировать новый»");
    // Старые Eye/EyeOff имели точные подписи «Показать пароль»/«Скрыть пароль»;
    // чип теперь подписан «Показать пароль стола» — сравнение строгое.
    const oldShow =
      (await host.getByLabel("Показать пароль", { exact: true }).count()) +
      (await host.getByLabel("Скрыть пароль", { exact: true }).count());
    if (oldShow) fail(`осталась старая кнопка показа пароля (${oldShow})`);
    else ok("старой кнопки «Показать/Скрыть пароль» нет");

    const copyBtn = host.locator("[data-copy-link]").first();
    if (!(await copyBtn.count())) throw new Error("нет иконки копирования у кода стола");
    const codeBox = await host.locator("[data-room-code]").first().boundingBox();
    const copyBox = await copyBtn.boundingBox();
    if (!codeBox || !copyBox) throw new Error("не удалось замерить код/иконку");
    if (copyBox.x < codeBox.x + codeBox.width || Math.abs(copyBox.y - codeBox.y) > 40) {
      throw new Error("иконка копирования не справа от кода");
    }
    ok("иконка копирования справа от кода стола");
    const aria = await copyBtn.getAttribute("aria-label");
    if (!aria || !/скопировать/i.test(aria)) fail(`у иконки копирования нет понятного aria-label (${aria})`);
    else ok(`aria-label иконки: «${aria}»`);
    await host.screenshot({ path: join(SHOTS, "60-wave6-lobby-host.png") });
  });

  // ── 2. Копирование: ссылка + пароль в буфере, «Скопировано» рядом ──────────
  await guard("копирование ссылки и пароля в буфер", async () => {
    await host.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
    await safeClick(host.locator("[data-copy-link]").first(), 3000);
    const clip = await host.evaluate(() => navigator.clipboard.readText().catch(() => null));
    if (clip == null) {
      warn("буфер недоступен для чтения — проверяю по подписи «Скопировано»");
    } else {
      const wantUrl = `${BASE.replace(/\/$/, "")}/?room=${code}`;
      if (!clip.includes(wantUrl)) fail(`в буфере нет ссылки на стол: "${clip}"`);
      else ok(`в буфере есть ссылка ${wantUrl}`);
      if (!clip.includes(`Пароль стола: ${createdPassword}`)) {
        fail(`в буфере нет пароля приватного стола: "${clip}"`);
      } else {
        ok(`в буфере есть пароль стола (${createdPassword})`);
      }
    }
    if (!(await waitUntil(() => host.getByText("Скопировано").count().then((n) => n > 0), 3_000, 200))) {
      fail("нет всплывающей подписи «Скопировано»");
    } else {
      ok("подпись «Скопировано» появилась под кодом");
    }
    await host.screenshot({ path: join(SHOTS, "61-wave6-copy-feedback.png") });
  });

  // ── 3. Чип пароля: блюр → показ → карандаш → inline-правка ──────────────────
  await guard("чип пароля: блюр, показ, inline-правка карандашом", async () => {
    const chip = host.locator("[data-room-password]").first();
    if (!(await chip.count())) throw new Error("нет чипа пароля у кода");
    const hidden = ((await chip.textContent()) ?? "").trim();
    if (hidden === createdPassword) fail("пароль показан сразу, без скрытия");
    else ok(`пароль скрыт по умолчанию («${hidden}»)`);
    // Клик показывает цифры.
    await safeClick(chip, 3000);
    const shown = await waitUntil(
      async () => (((await chip.textContent().catch(() => "")) ?? "").trim() === createdPassword),
      4_000,
      200,
    );
    if (!shown) fail(`клик по чипу не показал пароль («${await chip.textContent()}»)`);
    else ok("клик по чипу показал цифры пароля");
    await host.screenshot({ path: join(SHOTS, "62-wave6-password-shown.png") });
    // Карандаш открывает inline-редактирование.
    const pencil = host.getByLabel("Изменить пароль стола").first();
    if (!(await pencil.count())) throw new Error("нет карандаша смены пароля");
    await safeClick(pencil, 3000);
    const field = host.getByLabel("Новый пароль стола").first();
    if (!(await waitUntil(() => isVisible(field), 4_000, 200))) {
      throw new Error("карандаш не раскрыл поле пароля");
    }
    ok("карандаш раскрыл inline-редактирование пароля");
    await host.screenshot({ path: join(SHOTS, "63-wave6-password-edit.png") });
  });

  // ── 4. Смена пароля: старый не пускает, новый пускает ───────────────────────
  await guard("смена пароля и вход гостя с новым", async () => {
    const field = host.getByLabel("Новый пароль стола").first();
    await fillStable(field, "4321");
    await field.press("Enter");
    const saved = await waitUntil(async () => (await netState(host))?.password === "4321", 12_000);
    if (!saved) throw new Error(`пароль не сменился, в сторе ${(await netState(host))?.password}`);
    if (!(await waitUntil(() => host.getByText("Пароль сохранён").count().then((n) => n > 0), 4_000, 200))) {
      warn("подпись «Пароль сохранён» не найдена (не критично)");
    }
    ok("хост сменил пароль inline на 4321 (по Enter)");
    // Сохранённый пароль виден в чипе.
    const chip = host.locator("[data-room-password]").first();
    if (!(await waitUntil(async () => (((await chip.textContent().catch(() => "")) ?? "").trim() === "4321"), 4_000, 200))) {
      warn(`чип не показывает новый пароль («${await chip.textContent()}»)`);
    }
    // Гость со старым паролем не входит (throwaway-контекст, один запрос —
    // квота входов общая, UI-ретраи её съедают).
    const oldCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const oldGuest = await oldCtx.newPage();
    trackPage(oldGuest, "старый-пароль");
    await gotoUrl(oldGuest, `${BASE}/`);
    await waitUntil(() => menuReady(oldGuest), 15_000);
    const oldRes = await storeJoin(oldGuest, code, "Старый", createdPassword);
    if (oldRes.ok) fail("вход со старым паролем неожиданно удался");
    else ok(`гость со старым паролем не вошёл (${oldRes.error ?? "отказ"})`);
    await oldCtx.close();
  });

  // ── 5. Гость с новым паролем: входит и не видит пароль/карандаш ─────────────
  const guestCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const guest = await guestCtx.newPage();
  trackPage(guest, "гость");
  await guard("гость: вход с новым паролем, пароля и карандаша нет", async () => {
    const res = await attemptJoin(guest, code, "Боря", "4321");
    if (!res.ok) {
      throw new Error(`гость не вошёл с новым паролем (${res.via}): ${res.error ?? ""}; экран: ${await bodyOf(guest)}`);
    }
    ok(`гость вошёл с новым паролем [${res.via}]`);
    await waitUntil(async () => (await netState(host))?.seats.length === 2, 15_000);
    // Dev-перезагрузка могла выбить вкладки из лобби — возвращаем обе.
    if (!(await ensureLobby(guest, code, "Боря", host))) {
      throw new Error(`гость не в лобби после входа; экран: ${await bodyOf(guest)}`);
    }
    if (!(await ensureLobby(host, code, "Аня", host))) {
      throw new Error(`хост не в лобби; экран: ${await bodyOf(host)}`);
    }
    if (await guest.locator("[data-room-password]").count()) fail("гость видит чип пароля");
    else ok("гость не видит пароль");
    if (await guest.getByLabel("Изменить пароль стола").count()) fail("гость видит карандаш смены пароля");
    else ok("гость не видит карандаш смены пароля");
    if (await guest.getByLabel(/сделать открытым|сделать приватным/).count()) {
      fail("гость видит замок приватности (управление — только у хоста)");
    } else {
      ok("гость не видит замок приватности");
    }
    const copyBtn = guest.locator("[data-copy-link]").first();
    if (!(await copyBtn.count())) fail("у гостя нет иконки копирования ссылки");
    else ok("у гостя есть иконка копирования ссылки");
    // Копирование у гостя: только ссылка, без пароля. Буфер ОС общий для
    // контекстов браузера, поэтому сначала кладём маркер и сравниваем после
    // клика — иначе читается чужая (хостовая) запись.
    await guest.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
    await guest.evaluate(() => navigator.clipboard.writeText("QA-MARKER").catch(() => {}));
    await safeClick(copyBtn, 3000);
    const clip = await guest.evaluate(() => navigator.clipboard.readText().catch(() => null));
    if (clip == null || clip === "QA-MARKER") {
      warn("буфер гостя не читается/не менялся — проверяю по подписи");
      if (!(await waitUntil(() => guest.getByText("Скопировано").count().then((n) => n > 0), 3_000, 200))) {
        fail("у гостя нет подписи «Скопировано»");
      }
    } else {
      if (!clip.includes(`?room=${code}`)) fail(`в буфере гостя нет ссылки: "${clip}"`);
      else ok("в буфере гостя есть ссылка");
      if (clip.includes("Пароль")) fail(`гость скопировал пароль: "${clip}"`);
      else ok("в буфере гостя только ссылка — пароля нет");
    }
    await guest.screenshot({ path: join(SHOTS, "64-wave6-guest-no-password.png") });
  });

  // ── 6. Замок приватности: переключение хостом ───────────────────────────────
  await guard("замок приватности переключает доступ", async () => {
    if (!(await ensureLobby(host, code, "Аня", host))) {
      throw new Error(`хост не в лобби; экран: ${await bodyOf(host)}`);
    }
    const lock = host.getByLabel(/сделать открытым|сделать приватным/).first();
    if (!(await lock.count())) throw new Error("нет иконки-замка приватности");
    const pressed = await lock.getAttribute("aria-pressed");
    if (pressed !== "true") throw new Error(`замок не в состоянии «приватный» (aria-pressed=${pressed})`);
    ok("замок приватности есть, aria-pressed=true");
    await safeClick(lock, 3000);
    const opened = await waitUntil(async () => (await netState(host))?.isPrivate === false, 10_000);
    if (!opened) fail("клик по замку не открыл стол");
    else ok("клик по замку открыл стол (isPrivate=false)");
    // После открытия чип пароля исчезает.
    await sleep(600);
    if (await host.locator("[data-room-password]").count()) {
      warn("чип пароля остался после открытия стола");
    } else {
      ok("у открытого стола чипа пароля нет");
    }
    await host.screenshot({ path: join(SHOTS, "65-wave6-lock-open.png") });
    // Возвращаем приватность для проверки замка в обе стороны.
    const lock2 = host.getByLabel(/сделать открытым|сделать приватным/).first();
    await safeClick(lock2, 3000);
    const closed = await waitUntil(async () => (await netState(host))?.isPrivate === true, 10_000);
    if (!closed) warn("повторный клик не закрыл стол обратно (проверить руками)");
    else ok("повторный клик закрыл стол обратно");
  });

  // ── 7. Карандаш имени — сразу после имени, бейджи после ─────────────────────
  await guard("карандаш имени сразу после имени", async () => {
    if (!(await ensureLobby(host, code, "Аня", host))) {
      throw new Error(`хост не в лобби; экран: ${await bodyOf(host)}`);
    }
    if (!(await ensureLobby(guest, code, "Боря", host))) {
      warn(`гость не в лобби — проверяю порядок только у хоста; экран: ${await bodyOf(guest)}`);
    }
    const order = await host.evaluate(() => {
      const list = document.querySelector("[data-seat-list]");
      if (!list) return null;
      const li = [...list.querySelectorAll("li")].find((x) => x.textContent.includes("Аня"));
      if (!li) return null;
      const left = li.querySelector(".flex.min-w-0");
      if (!left) return null;
      return [...left.children].map((c) => {
        const label =
          c.getAttribute("aria-label") ??
          (c.classList.contains("truncate") ? "имя" : (c.textContent ?? "").trim().slice(0, 12));
        return { label, isBtn: c.tagName === "BUTTON" };
      });
    });
    if (!order) throw new Error("строка хоста в списке мест не найдена");
    const labels = order.map((x) => x.label);
    const nameIdx = labels.findIndex((l) => l === "имя");
    const pencilIdx = labels.findIndex((l) => /изменить своё имя/i.test(l));
    if (nameIdx < 0 || pencilIdx < 0) throw new Error(`не найдены имя/карандаш: ${JSON.stringify(labels)}`);
    if (pencilIdx !== nameIdx + 1) {
      fail(`карандаш не сразу после имени: порядок ${JSON.stringify(labels)}`);
    } else {
      ok(`карандаш сразу после имени: ${labels.filter((l) => l !== "имя" && !/цвет игрока/i.test(l)).join(" → ") || "(только карандаш)"}`);
    }
    const badgeIdx = labels.findIndex((l) => l === "хост" || l === "это вы");
    if (badgeIdx >= 0 && badgeIdx < pencilIdx) {
      fail(`бейдж идёт раньше карандаша: ${JSON.stringify(labels)}`);
    } else if (badgeIdx >= 0) {
      ok("бейджи «хост»/«это вы» идут после карандаша");
    }
    // Гость: то же у своей строки.
    const guestOrder = await guest.evaluate(() => {
      const list = document.querySelector("[data-seat-list]");
      if (!list) return null;
      const li = [...list.querySelectorAll("li")].find((x) => x.textContent.includes("Боря"));
      if (!li) return null;
      const left = li.querySelector(".flex.min-w-0");
      return left ? [...left.children].map((c) => c.getAttribute("aria-label") ?? (c.classList.contains("truncate") ? "имя" : (c.textContent ?? "").trim().slice(0, 12))) : null;
    });
    if (!guestOrder) warn("строка гостя не найдена для проверки порядка");
    else {
      const gi = guestOrder.findIndex((l) => l === "имя");
      const gp = guestOrder.findIndex((l) => /изменить своё имя/i.test(l));
      if (gp !== gi + 1) fail(`у гостя карандаш не сразу после имени: ${JSON.stringify(guestOrder)}`);
      else ok("у гостя карандаш тоже сразу после имени");
    }
    await host.screenshot({ path: join(SHOTS, "66-wave6-name-pencil.png") });
  });

  // ── 8. Фон строк — бумажная текстура, как табло игрока в партии ─────────────
  await guard("строки мест — с текстурой paper-sheet", async () => {
    if (!(await ensureLobby(host, code, "Аня", host))) {
      throw new Error(`хост не в лобби; экран: ${await bodyOf(host)}`);
    }
    const data = await host.evaluate(() => {
      const list = document.querySelector("[data-seat-list]");
      if (!list) return null;
      return [...list.querySelectorAll("li")].map((li) => {
        const cs = getComputedStyle(li);
        const nameEl = li.querySelector("span.truncate");
        return {
          occupied: !(li.textContent ?? "").includes("Свободное место"),
          bgImage: cs.backgroundImage,
          bgBlend: cs.backgroundBlendMode,
          inlineBg: li.style.backgroundColor || "",
          bg: cs.backgroundColor,
          color: nameEl ? getComputedStyle(nameEl).color : null,
        };
      });
    });
    if (!data?.length) throw new Error("список мест не найден");
    const occupied = data.filter((r) => r.occupied);
    if (!occupied.length) throw new Error("нет занятых мест для проверки фона");
    const withTexture = occupied.filter((r) => /texture-paper|url\(/.test(r.bgImage));
    if (withTexture.length !== occupied.length) {
      fail(`текстура бумаги есть только у ${withTexture.length} из ${occupied.length} строк`);
    } else {
      ok(`у всех ${occupied.length} занятых строк — бумажная текстура (${occupied[0].bgBlend})`);
    }
    const missingTint = occupied.filter((r) => !r.inlineBg.includes("color-mix"));
    if (missingTint.length) warn(`у ${missingTint.length} строк нет подложки цвета места`);
    else ok("подложка цвета места (color-mix) сохранена");
    await host.screenshot({ path: join(SHOTS, "67-wave6-seat-texture-lobby.png") });
  });

  // Сравнение с табло игрока в партии: поднимаем стол с ботом до фазы развития.
  await guard("сравнение с табло игрока в партии", async () => {
    if (!(await ensureLobby(host, code, "Аня", host))) {
      throw new Error(`хост не в лобби для сравнения; экран: ${await bodyOf(host)}`);
    }
    // Гостя не трогаем: стол с ботом на отдельной вкладке.
    const gameCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const game = await gameCtx.newPage();
    trackPage(game, "партия");
    await gotoUrl(game, `${BASE}/`);
    if (!(await menuReady(game))) throw new Error("меню не открылось для партии");
    const api = await import("./qa-lib.mjs");
    const gameCode = await api.startNetGame(game, { name: "Табло", players: 2, bots: 1 });
    ok(`партия-эталон поднята (стол ${gameCode})`);
    const playerSheet = await game.evaluate(() => {
      const sec = document.querySelector("[data-player-section]");
      if (!sec) return null;
      const cs = getComputedStyle(sec);
      return { bgImage: cs.backgroundImage, bgBlend: cs.backgroundBlendMode, bg: cs.backgroundColor };
    });
    const lobbyRow = await host.evaluate(() => {
      const li = document.querySelector("[data-seat-list] li");
      if (!li) return null;
      const cs = getComputedStyle(li);
      return { bgImage: cs.backgroundImage, bgBlend: cs.backgroundBlendMode };
    });
    if (!playerSheet || !lobbyRow) throw new Error("не найдены табло партии/строка лобби");
    const sameTexture = playerSheet.bgImage === lobbyRow.bgImage && playerSheet.bgBlend === lobbyRow.bgBlend;
    if (!sameTexture) {
      fail(`текстура строки лобби отличается от табло партии: ${JSON.stringify(lobbyRow)} vs ${JSON.stringify(playerSheet)}`);
    } else {
      ok("текстура строки лобби = текстура табло игрока в партии (texture-paper, overlay)");
    }
    await game.screenshot({ path: join(SHOTS, "68-wave6-player-sheet-game.png") });
    await gameCtx.close();
  });

  // ── 9. Кнопки на мобилке (390px): высота ≥48px ──────────────────────────────
  await guard("кнопки лобби крупнее на мобилке (390px)", async () => {
    const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mob = await mobCtx.newPage();
    trackPage(mob, "мобилка");
    await gotoUrl(mob, `${BASE}/`);
    if (!(await menuReady(mob))) throw new Error("меню не открылось на мобилке");
    const mobCode = await mob.evaluate(async () => {
      const store = globalThis.__evoStore;
      if (!store) return null;
      await store.getState().startNetCreate({ name: "Мобила", capacity: 4, botSeats: 0, difficulty: "normal", modules: {} });
      return store.getState().net?.code ?? null;
    });
    if (!mobCode || !(await waitUntil(() => roomCode(mob), 20_000, 300))) {
      throw new Error("стол на мобилке не создался");
    }
    // До правки «Начать год» была ~20px, «Покинуть стол» — 48px. Ждём ≥48px.
    const heights = {};
    for (const [name, label] of [["Начать год", "Начать год"], ["Покинуть стол", "Покинуть стол"]]) {
      const h = await buttonHeight(mob, label);
      heights[name] = h;
      if (h == null) fail(`кнопка «${label}» не найдена на мобилке`);
      else if (h < 48) fail(`кнопка «${label}» на 390px — ${h}px < 48px`);
      else ok(`кнопка «${label}» на 390px — ${h}px (было ${name === "Начать год" ? "20" : "48"}px)`);
    }
    await mob.screenshot({ path: join(SHOTS, "69-wave6-mobile-buttons.png" ) });
    await mobCtx.close();
  });

  // ── 10. Ожидающий стол: строки с текстурой, кнопки крупнее ──────────────────
  await guard("ожидающий стол: текстура строк и высота кнопок", async () => {
    // Заполняем стол хоста до отказа: боты добьют места, а гость переполнит.
    const thirdCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const third = await thirdCtx.newPage();
    trackPage(third, "ожидающий");
    await gotoUrl(third, `${BASE}/`);
    if (!(await waitUntil(() => menuReady(third), 15_000, 400))) {
      throw new Error(`меню у третьего не открылось; экран: ${await bodyOf(third)}`);
    }
    // Сначала хост ставит 2 места (сам + 1) — гость занимает последнее, третий идёт в очередь.
    if (!(await ensureLobby(host, code, "Аня", host))) {
      throw new Error(`хост не в лобби; экран: ${await bodyOf(host)}`);
    }
    const st = await netState(host);
    if (st && st.capacity > 2) {
      await host.evaluate(async (n) => {
        const store = globalThis.__evoStore;
        await store.getState().netSetCapacity(n);
      }, 2);
      await waitUntil(async () => (await netState(host))?.capacity === 2, 10_000);
    }
    // Гость уже за столом (занял место 2). Третий входит (стол после шага 6
    // снова приватный — передаём текущий пароль) тем же экшеном стора: один
    // запрос, квота входов бережётся для сценария. → очередь.
    const curPassword = (await netState(host))?.password ?? "";
    const res = await storeJoin(third, code, "Вера", curPassword || undefined);
    if (!res.ok) throw new Error(`третий не вошёл: ${res.error}`);
    const waiting = await waitUntil(async () => (await netState(third))?.waiting === true, 15_000, 500);
    if (!waiting) throw new Error(`третий не попал в очередь ожидания; экран: ${await bodyOf(third)}`);
    ok("третий игрок в очереди ожидания");
    // Состав стола приходят первым poll'ем уже ПОСЛЕ waiting=true (join
    // ставит capacity: 0) — даём списку мест секунду на появление, иначе
    // проверка ловит пустой кадр и падает «нет списка мест».
    await waitUntil(
      () => third.locator("[data-seat-list] li").count().then((n) => n > 0).catch(() => false),
      8_000,
      250,
    );
    const rowTex = await third.evaluate(() => {
      const li = document.querySelector("[data-seat-list] li");
      if (!li) return null;
      const cs = getComputedStyle(li);
      return { bgImage: cs.backgroundImage, bgBlend: cs.backgroundBlendMode, inlineBg: li.style.backgroundColor || "" };
    });
    if (!rowTex) throw new Error("в ожидающем столе нет списка мест");
    if (!/texture-paper|url\(/.test(rowTex.bgImage)) fail(`в ожидающем столе строка без текстуры: ${rowTex.bgImage}`);
    else ok("в ожидающем столе строки мест — с бумажной текстурой");
    if (!rowTex.inlineBg.includes("color-mix")) warn("в ожидающем столе нет подложки цвета места");
    for (const label of ["Занять место", "Выйти из очереди"]) {
      const h = await buttonHeight(third, label);
      if (h == null) fail(`кнопка «${label}» не найдена у ожидающего`);
      else if (h < 48) fail(`кнопка «${label}» на 390px — ${h}px < 48px`);
      else ok(`кнопка «${label}» у ожидающего на 390px — ${h}px`);
    }
    await third.screenshot({ path: join(SHOTS, "70-wave6-waiting-room.png") });
    await thirdCtx.close();
  });
} catch (e) {
  fail(`прогон прерван (${step}): ${String(e.message ?? e).split("\n")[0]}`);
} finally {
  await browser.close();
}

const seconds = Math.round((Date.now() - START_TS) / 1000);
const verdict = problems.length
  ? `ИТОГ: проблем ${problems.length}${warnings.length ? `, предупреждений ${warnings.length}` : ""} (${seconds} с)`
  : `ИТОГ: волна 6 чиста${warnings.length ? ` (предупреждений ${warnings.length})` : ""} (${seconds} с)`;
console.log(`\n${verdict}`);
console.log(`Скриншоты: ${SHOTS}`);
process.exitCode = problems.length ? 1 : 0;
