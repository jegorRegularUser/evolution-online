/**
 * QA волны 11: кличка животного и галочки сохранения.
 *
 * Проверяет (при живом dev-сервере, node scripts/qa-wave11-rename.mjs):
 *  (а) переименование в сетевой партии на двух вкладках (человек + человек):
 *      свой ход в развитии → карандаш на СВОЁМ животном → поле → галочка →
 *      имя видно у ОБОИХ игроков, номер «№1» сохранён, после F5 имя живёт
 *      (состояние в БД), чужое животное без карандаша, на тач-ширинах
 *      карандаш доступен без hover;
 *  (б) галочки в лобби: имя игрока (карандаш в списке мест) и пароль стола
 *      (карандаш у чипа пароля) сохраняются кнопкой-галочкой; Esc — отмена;
 *  (в) EN-хвосты локализации: ошибка занятого цвета — на английском, имена
 *      ботов-учёных в лобби — Darwin/Wallace, записи журнала с ботами
 *      переводятся (Darwin passes.), с людьми — нет (имя как есть).
 *
 * Скриншоты — в %TEMP% (EVO_SHOTS), НЕ в репозиторий.
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  createRoomViaStore,
  dismissSpotlight,
  dismissTurnCard,
  gotoUrl,
  isVisible,
  netState,
  openMenu,
  safeClick,
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

/** Кадр партии по стору вкладки: фаза, чей ход, свой id. */
const snap = (page) =>
  page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      const st = s?.state;
      if (!st) return null;
      return { phase: st.phase, cur: st.currentPlayerId, me: st.humanId };
    })
    .catch(() => null);

/**
 * Вход гостя по ссылке ?room=CODE с формой имени. Короткие таймауты и
 * dom-клик: поле может перекрываться оверлеем «Открываем стол…» или
 * пересоздаваться ре-рендером — просто повторяем, пока не войдём.
 */
async function joinByLink(page, code, name, lang) {
  const nameLabel = lang === "en" ? "Your name" : "Ваше имя";
  const enterLabel = lang === "en" ? "Enter" : "Войти";
  for (let attempt = 0; attempt < 3; attempt++) {
    await gotoUrl(page, `${BASE}/?room=${code}`);
    const deadline = Date.now() + 20_000;
    while (Date.now() < deadline) {
      const rc = await page
        .evaluate(() => document.querySelector("[data-room-code]")?.textContent?.trim() ?? null)
        .catch(() => null);
      if (rc === code) return true;
      const input = page.getByLabel(nameLabel).first();
      if ((await input.count().catch(() => 0)) > 0) {
        await input.fill(name, { timeout: 2500 }).catch(() => {});
        await input
          .evaluate((el) => {
            el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
            return true;
          })
          .catch(() => {});
        await page
          .getByRole("button", { name: enterLabel, exact: true })
          .first()
          .evaluate((el) => {
            el.click();
            return true;
          })
          .catch(() => {});
      }
      await sleep(600);
    }
  }
  const rc = await page
    .evaluate(() => document.querySelector("[data-room-code]")?.textContent?.trim() ?? null)
    .catch(() => null);
  return rc === code;
}

/** Свои животные на вкладке: id, имя, номер и есть ли карандаш. */
const animalsOf = (page, sectionId) =>
  page
    .evaluate((id) => {
      const sec = document.querySelector(`[data-player-section="${id}"]`);
      if (!sec) return [];
      return [...sec.querySelectorAll(".animal-card")].map((card) => ({
        id: card.getAttribute("data-animal-id"),
        text: card.innerText.replace(/\s+/g, " ").trim(),
        hasPencil: Boolean(card.querySelector('button[aria-label="Переименовать животное"]')),
      }));
    }, sectionId)
    .catch(() => []);

/** Дождаться, пока одна из вкладок получит свой ход в развитии. */
async function waitDevTurn(pages, timeout = 90_000) {
  let owner = null;
  const got = await waitUntil(async () => {
    for (const p of pages) {
      const s = await snap(p);
      if (s && s.phase === "development" && s.cur === s.me) {
        owner = p;
        return true;
      }
    }
    return false;
  }, timeout, 300);
  return got ? owner : null;
}

// ── (а) переименование животного на двух вкладках ────────────────────────────

async function renameScenario(browser) {
  // Два ОТДЕЛЬНЫХ контекста: токены мест живут в localStorage, в одном
  // контексте вторая вкладка вошла бы в стол тем же игроком.
  const hostCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const guestCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const host = await hostCtx.newPage();
  const guest = await guestCtx.newPage();
  const errsHost = trackPage(host, "rename-host");
  const errsGuest = trackPage(guest, "rename-guest");
  try {
    await openMenu(host);
    const r = await createRoomViaStore(host, {
      name: "Хозяин",
      capacity: 2,
      botSeats: 0,
      difficulty: "normal",
    });
    if (!r.ok) throw new Error(`стол не создан: ${r.error}`);
    const code = r.code;
    ok(`(а) стол ${code} создан (два человека)`);

    // Гость входит по ссылке с формой имени (устойчивый повтор).
    if (!(await joinByLink(guest, code, "Гость", "ru"))) {
      throw new Error("гость не вошёл в стол");
    }
    ok("(а) гость за столом");

    // Старт партии от хоста (ошибка — в net.error, покажем её в падении).
    const startRes = await host
      .evaluate(async () => {
        const s = globalThis.__evoStore?.getState?.();
        if (!s?.netStart) return { ok: false, error: "нет netStart" };
        try {
          await s.netStart();
          return { ok: true };
        } catch (e) {
          return { ok: false, error: String(e?.message ?? e) };
        }
      })
      .catch(() => ({ ok: false, error: "evaluate упал" }));
    if (!startRes.ok) {
      const netErr = await host
        .evaluate(() => globalThis.__evoStore?.getState?.().net?.error ?? null)
        .catch(() => null);
      throw new Error(`netStart не удался: ${startRes.error}; net.error=${netErr}`);
    }
    const started = await waitUntil(
      async () => {
        const a = await snap(host);
        const b = await snap(guest);
        return Boolean(a?.phase && b?.phase);
      },
      45_000,
      400,
    );
    if (!started) throw new Error("партия не началась на вкладках");
    await waitPhase(host, ["development", "foodBank", "feeding"], 20_000);
    await waitPhase(guest, ["development", "foodBank", "feeding"], 20_000);
    await dismissSpotlight(host);
    await dismissSpotlight(guest);
    ok("(а) партия идёт на обеих вкладках");

    // Первый свой ход в развитии может достаться любому из людей.
    const owner = await waitDevTurn([host, guest]);
    if (!owner) throw new Error("свой ход в развитии не наступил ни на одной вкладке");
    const other = owner === host ? guest : host;
    const ownerName = owner === host ? "Хозяин" : "Гость";
    await dismissTurnCard(owner);
    ok(`(а) ход в развитии у «${ownerName}» — играем животное`);

    // Выкладываем животное кнопкой «Животное» (той же, что жмёт игрок).
    const animalBtn = owner.locator("[data-hand-row] button", { hasText: "Животное" });
    if (!(await waitUntil(() => animalBtn.count().then((n) => n > 0), 10_000, 300))) {
      throw new Error("кнопка «Животное» не найдена");
    }
    await safeClick(animalBtn.first(), 5000);
    const me = (await snap(owner))?.me;
    if (me == null) throw new Error("не нашли свой id в сторе");
    const placed = await waitUntil(
      () => animalsOf(owner, me).then((list) => list.length > 0),
      10_000,
      300,
    );
    if (!placed) throw new Error("животное не появилось в своей секции");
    await sleep(600); // анимация прилёта карточки

    // Выкладка животного в развитии тратит ход: ход ушёл дальше по кругу.
    // Гоним развитие (второй человек пасует экшеном той же кнопки), пока ход
    // не вернётся к владельцу — карандаш виден только в свой ход.
    const backToOwner = await waitUntil(
      async () => {
        const s = await snap(owner);
        if (s && s.phase === "development" && s.cur === s.me) return true;
        const o = await snap(other);
        if (o && o.phase === "development" && o.cur === o.me) {
          await other
            .evaluate(() => globalThis.__evoStore?.getState?.().dispatch({ type: "devPass" }))
            .catch(() => {});
        }
        return false;
      },
      120_000,
      700,
    );
    if (!backToOwner) throw new Error("ход не вернулся к владельцу животного");
    await dismissTurnCard(owner);
    await dismissSpotlight(owner);
    ok("(а) ход вернулся к владельцу — проверяем карандаш");

    // Карандаш — только на своём животном в свой ход.
    let mine = await animalsOf(owner, me);
    check(mine.length === 1 && mine[0].hasPencil, `(а) карандаш на своём животном (${ownerName})`);
    check(/№1/.test(mine[0].text), "(а) до переименования карточка подписана «№1»");
    await shot(owner, "rename-1-pencil");

    // Карандаш раскрывает поле; галочка сохраняет.
    await safeClick(owner.getByRole("button", { name: "Переименовать животное" }), 5000);
    const input = owner.getByLabel("Имя животного (до 24 символов)");
    check(await isVisible(input), "(а) поле правки клички открылось");
    await shot(owner, "rename-2-edit");
    await input.fill("Тест-Кот");
    await safeClick(owner.getByRole("button", { name: "Сохранить имя животного" }), 5000);

    // Имя на карточке владельца: кличка + сохранённый номер.
    const savedSelf = await waitUntil(
      () => animalsOf(owner, me).then((list) => list[0]?.text.includes("Тест-Кот") ?? false),
      10_000,
      300,
    );
    mine = await animalsOf(owner, me);
    check(savedSelf, `(а) имя «Тест-Кот» на карточке у владельца (${ownerName})`);
    check(/№1/.test(mine[0]?.text ?? ""), "(а) номер «№1» не изменился после переименования");
    const stillEditing = await owner.getByLabel("Имя животного (до 24 символов)").count().catch(() => 0);
    check(stillEditing === 0, "(а) поле правки закрылось после галочки");
    await shot(owner, "rename-3-saved-owner");

    // Имя видно второму игроку; его карандаша на ЧУЖОМ животном нет.
    const otherMe = (await snap(other))?.me;
    const savedOther = await waitUntil(
      () => animalsOf(other, me).then((list) => list[0]?.text.includes("Тест-Кот") ?? false),
      20_000,
      500,
    );
    const theirs = await animalsOf(other, me);
    check(savedOther, "(а) имя «Тест-Кот» видно второму игроку (сетевой кадр)");
    check(!theirs[0]?.hasPencil, "(а) на чужом животном карандаша нет");
    await shot(other, "rename-4-saved-other");

    // F5: состояние в БД — кличка переживает перезагрузку вкладки.
    await owner.reload({ timeout: 60_000 }).catch(() => {});
    const back = await waitUntil(
      async () => {
        const s = await snap(owner);
        if (!s) return false;
        const list = await animalsOf(owner, me);
        return list.length > 0 && (list[0]?.text.includes("Тест-Кот") ?? false);
      },
      45_000,
      600,
    );
    check(back, "(а) после F5 имя «Тест-Кот» на месте (состояние в БД)");
    await shot(owner, "rename-5-after-reload");

    // Тач-ширины: карандаш доступен без hover (кнопка всегда в DOM карточки).
    await owner.setViewportSize({ width: 390, height: 844 });
    await sleep(400);
    const pencilMobile = await owner
      .locator('button[aria-label="Переименовать животное"]')
      .first()
      .isVisible()
      .catch(() => false);
    check(pencilMobile, "(а) на тач-ширинах (390px) карандаш виден без hover");
    await shot(owner, "rename-6-mobile-pencil");

    for (const e of [...errsHost, ...errsGuest]) fail(e);
    await hostCtx.close();
    await guestCtx.close();
  } catch (e) {
    fail(`(а) ${String(e?.message ?? e).split("\n")[0]}`);
    for (const e2 of [...errsHost, ...errsGuest]) fail(e2);
    await hostCtx.close().catch(() => {});
    await guestCtx.close().catch(() => {});
  }
}

// ── (б) галочки сохранения имени и пароля в лобби ────────────────────────────

async function lobbyCheckmarks(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const host = await ctx.newPage();
  const errs = trackPage(host, "lobby");
  try {
    await openMenu(host);
    const r = await createRoomViaStore(host, {
      name: "Хозяин",
      capacity: 2,
      botSeats: 0,
      difficulty: "normal",
      isPrivate: true,
      password: "1234",
    });
    if (!r.ok) throw new Error(`приватный стол не создан: ${r.error}`);
    ok(`(б) приватный стол ${r.code} создан (пароль 1234)`);

    // ── Имя игрока: карандаш → поле → галочка. ──
    const namePencil = host.getByRole("button", { name: "Изменить своё имя" });
    if (!(await waitUntil(() => namePencil.count().then((n) => n > 0), 15_000, 300))) {
      throw new Error("карандаш имени не найден в списке мест");
    }
    await safeClick(namePencil.first(), 5000);
    const nameInput = host.getByLabel("Ваше имя за столом");
    check(await isVisible(nameInput), "(б) поле правки имени открылось");
    // Esc — отмена без сохранения.
    await nameInput.fill("Не-Сохранено");
    await nameInput.press("Escape");
    const seatText1 = await host.locator("[data-seat-list]").innerText().catch(() => "");
    check(!seatText1.includes("Не-Сохранено"), "(б) Esc отменил правку имени (не сохранилось)");
    // Снова карандаш → галочка.
    await safeClick(namePencil.first(), 5000);
    await host.getByLabel("Ваше имя за столом").fill("Хозяин-Про");
    await safeClick(host.getByRole("button", { name: "Сохранить имя" }), 5000);
    const renamed = await waitUntil(
      () =>
        host
          .locator("[data-seat-list]")
          .innerText()
          .then((t) => t.includes("Хозяин-Про"))
          .catch(() => false),
      10_000,
      400,
    );
    check(renamed, "(б) имя «Хозяин-Про» сохранено галочкой и видно в списке мест");
    const netName = await host
      .evaluate(() => globalThis.__evoStore?.getState?.().net?.name ?? null)
      .catch(() => null);
    check(netName === "Хозяин-Про", `(б) сервер закрепил новое имя (net.name=${netName})`);
    await shot(host, "check-1-name-saved");

    // ── Пароль стола: карандаш у чипа → 4 цифры → галочка. ──
    const passPencil = host.getByRole("button", { name: "Изменить пароль стола" });
    if (!(await waitUntil(() => passPencil.count().then((n) => n > 0), 10_000, 300))) {
      throw new Error("карандаш пароля не найден у кода стола");
    }
    await safeClick(passPencil.first(), 5000);
    const passInput = host.getByLabel("Новый пароль стола");
    check(await isVisible(passInput), "(б) поле правки пароля открылось");
    await shot(host, "check-2-password-edit");
    // Enter — ускоритель сохранения (форма отправляется сама).
    await passInput.fill("5678");
    await passInput.press("Enter");
    const savedMsg = await waitUntil(
      () => host.getByText("Пароль сохранён").count().then((n) => n > 0).catch(() => false),
      10_000,
      400,
    );
    check(savedMsg, "(б) статус «Пароль сохранён» после Enter");
    const st2 = await netState(host);
    check(st2?.password === "5678", "(б) сервер принял пароль 5678 (net.password)");
    // Чип пароля показывает новый пароль цифрами (showPassword включился при правке).
    const chip = await host.locator("[data-room-password]").innerText().catch(() => "");
    check(chip.includes("5678"), "(б) чип пароля показывает новый пароль");
    // Галочка тоже работает: меняем ещё раз кнопкой с Check.
    await safeClick(passPencil.first(), 5000);
    await host.getByLabel("Новый пароль стола").fill("9012");
    await safeClick(host.getByRole("button", { name: "Сохранить", exact: true }), 5000);
    const st3 = await netState(host);
    check(
      await waitUntil(
        () => netState(host).then((s) => s?.password === "9012"),
        10_000,
        400,
      ),
      "(б) пароль 9012 сохранён кнопкой-галочкой",
    );
    void st3;
    await shot(host, "check-3-password-saved");

    // Esc в поле пароля — отмена без сохранения.
    await safeClick(passPencil.first(), 5000);
    await host.getByLabel("Новый пароль стола").fill("0000");
    await host.getByLabel("Новый пароль стола").press("Escape");
    const st4 = await netState(host);
    check(st4?.password === "9012", "(б) Esc отменил правку пароля (остался 9012)");

    for (const e of errs) fail(e);
    await ctx.close();
  } catch (e) {
    fail(`(б) ${String(e?.message ?? e).split("\n")[0]}`);
    for (const e2 of errs) fail(e2);
    await ctx.close().catch(() => {});
  }
}

// ── (в) EN-хвосты локализации ────────────────────────────────────────────────

/** Контекст с явным языком интерфейса (localStorage, не locale машины). */
async function openMenuLang(browser, lang) {
  const ctx = await browser.newContext({
    locale: lang === "en" ? "en-US" : "ru-RU",
    viewport: { width: 1440, height: 900 },
    storageState: {
      cookies: [],
      origins: [
        {
          origin: new URL(BASE).origin,
          localStorage: [{ name: "evo-lang", value: lang }],
        },
      ],
    },
  });
  const page = await ctx.newPage();
  const errs = trackPage(page, `en-${lang}`);
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
  await waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), 25_000, 300);
  await waitUntil(
    () => page.locator("[data-menu-col]").count().then((n) => n > 0).catch(() => false),
    30_000,
    400,
  );
  await sleep(600);
  return { ctx, page, errs };
}

async function enLocaleScenario(browser) {
  // ── Лобби: имена ботов и ошибка занятого цвета. ──
  const { ctx, page: host, errs } = await openMenuLang(browser, "en");
  const { ctx: ctx2, page: guest, errs: errs2 } = await openMenuLang(browser, "en");
  try {
    const r = await createRoomViaStore(host, {
      name: "Host-EN",
      capacity: 3,
      botSeats: 1,
      difficulty: "normal",
    });
    if (!r.ok) throw new Error(`EN-стол не создан: ${r.error}`);
    const code = r.code;
    await waitUntil(
      () => host.locator("[data-seat-list]").count().then((n) => n > 0).catch(() => false),
      15_000,
      400,
    );
    await sleep(800);
    const seatText = await host.locator("[data-seat-list]").innerText().catch(() => "");
    check(/Darwin/.test(seatText), "(в) EN-лобби: бот показан как Darwin");
    check(!/Дарвин/.test(seatText), "(в) EN-лобби: русского «Дарвин» нет");
    await shot(host, "en-1-lobby-bots");

    // Гость (EN) пытается взять цвет хоста → ошибка на английском.
    if (!(await joinByLink(guest, code, "Guest-EN", "en"))) {
      throw new Error("EN-гость не вошёл в стол");
    }
    const hostColor = await host
      .evaluate(() => globalThis.__evoStore?.getState?.().net?.seats?.find((s) => s.seat === 0)?.color ?? null)
      .catch(() => null);
    if (!hostColor) throw new Error("цвет хоста не найден");
    await guest
      .evaluate((color) => {
        const s = globalThis.__evoStore?.getState?.();
        if (s?.netSetColor) void s.netSetColor(color);
      }, hostColor)
      .catch(() => {});
    const errEn = await waitUntil(
      () =>
        guest
          .getByText("This color is already taken — choose another one")
          .count()
          .then((n) => n > 0)
          .catch(() => false),
      10_000,
      400,
    );
    check(errEn, "(в) EN: ошибка занятого цвета — на английском");
    const errRu = await guest.getByText("уже занят").count().catch(() => 0);
    check(errRu === 0, "(в) EN: русского текста ошибки нет");
    await shot(guest, "en-2-color-taken");
    await ctx2.close();
  } catch (e) {
    fail(`(в) лобби: ${String(e?.message ?? e).split("\n")[0]}`);
    for (const e2 of [...errs, ...errs2]) fail(e2);
    await ctx2.close().catch(() => {});
  } finally {
    void guest;
  }

  // ── Журнал партии: боты переводятся, люди — нет. ──
  try {
    const r2 = await createRoomViaStore(host, {
      name: "Human-EN",
      capacity: 2,
      botSeats: 1,
      difficulty: "normal",
    });
    if (!r2.ok) throw new Error(`EN-партия не создана: ${r2.error}`);
    await host
      .evaluate(() => {
        const s = globalThis.__evoStore?.getState?.();
        if (s?.net) void s.netStart();
      })
      .catch(() => {});
    await waitPhase(host, ["development", "foodBank", "feeding"], 45_000);
    await dismissSpotlight(host);
    await dismissTurnCard(host);
    // Свой ход в развитии: пасуем — бот доиграет развитие и запишет свои
    // записи журнала (пас, выкладка животного) с русским именем в params.
    const myTurn = await waitUntil(
      async () => {
        const s = await snap(host);
        return Boolean(s && s.phase === "development" && s.cur === s.me);
      },
      60_000,
      400,
    );
    if (!myTurn) throw new Error("свой ход в EN-партии не наступил");
    await host
      .evaluate(() => {
        const s = globalThis.__evoStore?.getState?.();
        s?.dispatch({ type: "devPass" });
      })
      .catch(() => {});
    // Ждём, пока бот завершит развитие пасом: в сторе появится запись
    // log.passed с русским именем бота в params (источник для перевода).
    const botLogged = await waitUntil(
      () =>
        host
          .evaluate(() => {
            const log = globalThis.__evoStore?.getState?.().state?.log ?? [];
            return log.some(
              (e) => e.key === "log.passed" && typeof e.params?.name === "string" && /[а-яё]/i.test(e.params.name),
            );
          })
          .catch(() => false),
      40_000,
      500,
    );
    check(botLogged, "(в) EN-партия: бот записал в журнал свой пас (params с русским именем)");
    await sleep(1000);
    // Открываем журнал и читаем отрендеренные строки.
    await safeClick(host.getByRole("button", { name: "Journal & chat" }), 5000);
    await sleep(600);
    const feedText = await host
      .evaluate(() =>
        [...document.querySelectorAll("[data-feed-item]")]
          .map((el) => el.textContent?.replace(/\s+/g, " ").trim() ?? "")
          .join("\n"),
      )
      .catch(() => "");
    check(/Darwin passes\.|Wallace passes\./.test(feedText), "(в) EN-журнал: запись бота переведена (Darwin passes.)");
    check(
      !/[ДУМЛКГ][аоие]\w* (пасует|заканчивает|берёт|выкладывает)/.test(feedText),
      "(в) EN-журнал: русских записей с именами ботов нет",
    );
    check(/Human-EN passes\./.test(feedText), "(в) EN-журнал: имя человека НЕ переводится (Human-EN passes.)");
    await shot(host, "en-3-journal");
    for (const e of errs) fail(e);
    await ctx.close();
  } catch (e) {
    fail(`(в) журнал: ${String(e?.message ?? e).split("\n")[0]}`);
    for (const e2 of errs) fail(e2);
    await ctx.close().catch(() => {});
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

const browser = await chromium.launch();
try {
  console.log(`прогрев dev-сервера (${rel()})…`);
  await warmupServer(browser, { log: (m) => console.log(`       ${m}`) });
  ok("сервер прогрет");

  await renameScenario(browser);
  await lobbyCheckmarks(browser);
  await enLocaleScenario(browser);
} finally {
  await browser.close().catch(() => {});
}

console.log("");
if (problems.length) {
  console.log(`ИТОГ: FAIL (${problems.length})`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log("ИТОГ: OK — все проверки волны 11 прошли");
}
if (warnings.length) for (const w of warnings) console.log(`  warn: ${w}`);
