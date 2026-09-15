/**
 * QA волны 10 (i18n карточек): локализация ВСЕГО, что нарисовано на карточках
 * и на столе — имена животных, чипы свойств, карта руки (кнопки граней),
 * тултип свойства, карточки растений/флоры, полосы территорий, кормовая база,
 * имена ботов-учёных.
 *
 * Проверяет (при живом dev-сервере, node scripts/qa-wave10-cards.mjs):
 *  (а) русская партия с ботом («Континенты»+«Растения»+«Трава и грибы»):
 *      выкладываем животное и 2–3 свойства экшенами движка (легальные
 *      действия — те же, что делают кнопки), снимаем карточку животного с
 *      чипами, карту руки, тултип свойства, карточки растений и флоры,
 *      полосы территорий, кормовую базу; в DOM — русские подписи и НЕТ
 *      английских стоп-слов;
 *  (б) английская партия с чистого входа (localStorage evo-lang=en): тот же
 *      сценарий; в DOM карточек/стола НЕТ русских стоп-слов («Животное»,
 *      «без свойств», «Хищник» и первые 20 свойств, «Лавразия», «Дарвин»,
 *      названия растений/флоры/меток…), а бот-учёный показывается как
 *      Darwin/Wallace/…; на RU — нет английских.
 *
 * Язык задаётся ЯВНО через localStorage["evo-lang"]. Скриншоты — в %TEMP%
 * (EVO_SHOTS), НЕ в репозиторий.
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  dismissSpotlight,
  expectText,
  isVisible,
  phaseOf,
  safeClick,
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
const shot = (page, name) => page.screenshot({ path: join(SHOTS, `wave10-${name}.png`) }).catch(() => {});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Открыть меню с явно заданным языком (localStorage, не locale машины). */
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
  const errs = trackPage(page, `ctx-${lang}`);
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {});
  await waitUntil(() => page.evaluate(() => Boolean(globalThis.__evoStore)).catch(() => false), 25_000, 300);
  await waitUntil(() => page.locator("[data-menu-col]").count().then((n) => n > 0).catch(() => false), 30_000, 400);
  await sleep(600);
  return { ctx, page, errs };
}

/** Поднять сетевую партию с ботом (языконезависимо — через экшены стора). */
async function startNetGameViaStore(page, cfg) {
  const { createRoomViaStore } = await import("./qa-lib.mjs");
  const players = cfg.players ?? 2;
  const bots = cfg.bots == null ? players - 1 : cfg.bots;
  const r = await createRoomViaStore(page, {
    name: cfg.name,
    capacity: players,
    botSeats: bots,
    difficulty: cfg.difficulty ?? "normal",
    modules: cfg.modules ?? {},
  });
  if (!r.ok) throw new Error(`стол не создан: ${r.error}`);
  await waitUntil(() => page.locator("[data-room-code]").count().then((n) => n > 0).catch(() => false), 20_000, 400);
  for (let i = 0; i < 3; i++) {
    await page
      .evaluate(() => {
        const s = globalThis.__evoStore?.getState?.();
        if (s?.net) void s.netStart();
      })
      .catch(() => {});
    if (await waitPhase(page, ["development", "foodBank", "feeding"], 25_000)) {
      await dismissSpotlight(page);
      return r.code;
    }
  }
  throw new Error(`партия не началась (стол ${r.code})`);
}

/** Свой ход в фазе (по стору — языконезависимо). */
function ownTurn(page, phase) {
  return page
    .evaluate(
      (wantPhase) => {
        const s = globalThis.__evoStore?.getState?.();
        const st = s?.state;
        return Boolean(
          s &&
            st &&
            st.phase === wantPhase &&
            s.net &&
            !s.net.spectating &&
            st.currentPlayerId === s.net.seat &&
            !st.pendingAttack,
        );
      },
      phase,
    )
    .catch(() => false);
}

/** Карточка «Ваш ход» в двух языках — снимаем её кликом мимо. */
async function dismissTurnCardAny(page) {
  const card = page.locator("div[role='status']").filter({ hasText: /Ваш ход|Your turn/ }).first();
  if (await isVisible(card)) {
    await page.mouse.click(6, 6).catch(() => {});
    await card.waitFor({ state: "detached", timeout: 4000 }).catch(() => {});
  }
}

/** Кнопка «Не защищаться» в двух языках (между ходами бота бывают атаки). */
async function dismissDefenseAny(page) {
  for (const name of ["Не защищаться", "Don't defend"]) {
    const b = page.getByRole("button", { name, exact: true }).first();
    if (await isVisible(b)) {
      await safeClick(b);
      await sleep(400);
      return true;
    }
  }
  return false;
}

/**
 * Выложить животное и насколько возможно свойств (2–3) экшенами движка —
 * те же легальные действия, что предлагают кнопки карты руки. Возвращает
 * { traits, note }: traits — число свойств на первом своём животном (-1,
 * если животное поставить не удалось), note — диагностика шагов.
 */
async function playOwnAnimalsWithTraits(page, { wantTraits = 3 } = {}) {
  return page
    .evaluate(
      async ({ wantTraits }) => {
        const s0 = globalThis.__evoStore?.getState?.();
        if (!s0 || !s0.state || !s0.net) return { traits: -1, note: "нет стора" };
        const eng = await import("/src/game/engine.ts");
        const me = s0.net.seat;
        // ВАЖНО: стор обновляется целиком (новый объект), поэтому каждое
        // чтение состояния — заново через getState(), иначе замкнёмся на
        // устаревшем снимке и будем слать отклоняемые экшены.
        const now = () => globalThis.__evoStore.getState();
        const note = [];
        const step = async () => {
          const s = now();
          const cur = s.state;
          const acts = eng.legalDevActions(cur, me);
          const myAnimals = (cur.players.find((p) => p.id === me)?.animals ?? []).length;
          // Нет животных — первым делом животное (без него свойства не ложатся).
          if (myAnimals === 0) {
            const animal = acts.find((a) => a.type === "devPlayAnimal");
            if (animal) {
              note.push(`animal→${animal.zoneId ?? "?"}`);
              s.dispatch(animal);
              await new Promise((r) => setTimeout(r, 350));
              return true;
            }
          }
          // Свойства — приоритет (чипы на карточке животного нужны в QA).
          const trait = acts.find((a) => a.type === "devPlayTrait");
          if (trait) {
            note.push("trait");
            s.dispatch(trait);
            await new Promise((r) => setTimeout(r, 350));
            return true;
          }
          // Парное (сотрудничество/симбиоз/взаимодействие): нужно два зверя.
          const pair = acts.find((a) => a.type === "devPlayPair");
          if (pair) {
            note.push("pair");
            s.dispatch(pair);
            await new Promise((r) => setTimeout(r, 350));
            return true;
          }
          // Свойство растения — тоже чип на столе (PlantTraitChip).
          const plantTrait = acts.find(
            (a) => a.type === "devPlayPlantTrait" || a.type === "devPlayPlantPair",
          );
          if (plantTrait) {
            note.push("plantTrait");
            s.dispatch(plantTrait);
            await new Promise((r) => setTimeout(r, 350));
            return true;
          }
          // Второе животное (например, под парное свойство).
          const animal = acts.find((a) => a.type === "devPlayAnimal");
          if (animal && myAnimals < 2) {
            note.push(`animal→${animal.zoneId ?? "?"}`);
            s.dispatch(animal);
            await new Promise((r) => setTimeout(r, 350));
            return true;
          }
          note.push(`нет действий (${acts.length} легальных, фаза ${s.state.phase}, ход ${s.state.currentPlayerId})`);
          return false;
        };
        // До 12 шагов: животное + свойства (по одному за собственный ход!).
        for (let i = 0; i < 12; i++) {
          const cur = now().state;
          const mine = cur.players.find((p) => p.id === me);
          const traitsOnAnimals = (mine?.animals ?? []).reduce((n, a) => n + a.traits.length, 0);
          if (traitsOnAnimals >= wantTraits) break;
          // Ход должен быть нашим: иначе сервер отклонит экшен.
          for (let k = 0; k < 90; k++) {
            const c = now().state;
            if (c.phase !== "development") break;
            if (c.currentPlayerId === me && !c.pendingAttack) break;
            await new Promise((r) => setTimeout(r, 500));
          }
          const s = now().state;
          if (s.phase !== "development") {
            note.push(`фаза ушла: ${s.phase}`);
            break;
          }
          if (s.currentPlayerId !== me) {
            note.push("ход не вернулся");
            break;
          }
          const before = s.eventSeq;
          if (!(await step())) break;
          // Ждём кадр: ход уходит боту и возвращается, либо сразу наш снова.
          for (let k = 0; k < 40 && now().state.eventSeq === before; k++) {
            await new Promise((r) => setTimeout(r, 150));
          }
        }
        const fin = now().state;
        const mine = fin.players.find((p) => p.id === me);
        const first = mine?.animals?.[0];
        return { traits: first ? first.traits.length : -1, note: note.join(", ") };
      },
      { wantTraits },
    )
    .catch((e) => {
      console.log(`     playOwnAnimalsWithTraits: ${e}`);
      return { traits: -1, note: String(e) };
    });
}

/** Текст видимой области карточек и стола (без журнала/чата). */
function tableText(page) {
  return page.evaluate(() => {
    const pick = (sel) => [...document.querySelectorAll(sel)].map((el) => (el.textContent ?? "").trim()).join("\n");
    const parts = [
      pick("[data-animal-id]"),
      pick("[data-plant-id]"),
      pick("[data-flora-id]"),
      pick("[data-hand-row]"),
      pick("[data-player-section]"),
      pick("header"),
      pick("footer"),
      pick("[data-trait-chip]"),
    ];
    return parts.filter(Boolean).join("\n");
  });
}

/** Подписи чипов свойств (короткие имена) со стола. */
function chipTexts(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-trait-chip]")]
      .map((el) => (el.textContent ?? "").trim())
      .filter(Boolean),
  );
}

/** Подписи карточек руки (кнопки «Животное»/грани). */
function handTexts(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-hand-row] button")]
      .map((el) => (el.textContent ?? "").trim())
      .filter(Boolean),
  );
}

/** Навести на чип свойства и снять тултип; возвращает текст тултипа. */
async function hoverTraitTip(page) {
  const chip = page.locator("[data-animal-id] [data-trait-chip]").first();
  if (!(await chip.count())) return null;
  await chip.scrollIntoViewIfNeeded().catch(() => {});
  await chip.hover({ timeout: 5000 }).catch(() => {});
  const tip = page.locator('[role="tooltip"]').first();
  await waitUntil(() => isVisible(tip), 4000, 150);
  if (!(await isVisible(tip))) return null;
  return (await tip.textContent().catch(() => "")) ?? "";
}

// ── стоп-слова ──────────────────────────────────────────────────────────────
// Русские слова, которых НЕ должно быть на EN-столе (карточки/рука/стол).
const RU_STOP = [
  // Подпись животного и состояния карточки
  "Животное",
  "Облигатный хищник",
  "Хищник",
  "Водное",
  "без свойств",
  "убежище",
  "успокоено",
  "голод",
  "сыто",
  "спит",
  "пара",
  "Карта",
  "без еды",
  "новое растение",
  "атака была",
  // Первые 20 свойств из src/game/traits.ts (имена и шорты)
  "Водоплавающее",
  "Камуфляж",
  "Острое зрение",
  "Норное",
  "Нора",
  "Падаль",
  "Падальщик",
  "Симбиоз",
  "Симбионт",
  "Пиратство",
  "Пират",
  "Отбрасывание хвоста",
  "Хвост",
  "Топотун",
  "Сотрудничество",
  "Сотрудн.",
  "Быстрое",
  "Большое",
  "Большой",
  "Паразит",
  "Жировой запас",
  "Жир",
  "Взаимодействие",
  "Взаимод.",
  "Ядовитое",
  "Яд",
  "Спячка",
  "Мимикрия",
  "Миграция",
  "Мигр.",
  // Метки последствий
  "Антидот",
  "Безумие",
  "Бешенство",
  "Трын",
  "Дурь",
  "Пацифизм",
  // Территории и базы
  "ЛАВРАЗИЯ",
  "Лавразия",
  "ГОНДВАНА",
  "Гондвана",
  "ОКЕАН",
  "кормовая база",
  "колода",
  "сброс",
  "база пуста",
  // Учёные
  "Дарвин",
  "Уоллес",
  "Мендель",
  "Линней",
  "Кювье",
  "Ламарк",
  "Геккель",
  // Растения и флора
  "Многолетник",
  "Однолетник",
  "Плодовое",
  "Суккулент",
  "Бобовое",
  "Злак",
  "Лиана",
  "Гриб",
  "Растение-Паразит",
  "Бледная поганка",
  "Плесневой гриб",
  "Безумная шляпка",
  "Бешеный мухомор",
  "Сон-трава",
  "Трын-трава",
  "Дурман-трава",
  "Страстоцвет",
  "растение",
  "трава",
];
// Английские слова, которых НЕ должно быть на RU-столе.
const EN_STOP = [
  "Animal",
  "Carnivorous",
  "Camouflage",
  "Sharp Vision",
  "Burrowing",
  "Scavenger",
  "Symbiosis",
  "Piracy",
  "Tail Loss",
  "Grazing",
  "Cooperation",
  "Running",
  "High Body Weight",
  "Parasite",
  "Fat Tissue",
  "Communication",
  "Poisonous",
  "Hibernation",
  "Mimicry",
  "Migration",
  "Laurasia",
  "Gondwana",
  "Ocean",
  "Darwin",
  "Wallace",
  "Mendel",
  "Linnaeus",
  "Cuvier",
  "Lamarck",
  "Haeckel",
  "no traits",
  "hungry",
  "shelter",
  "pair",
  "Your population",
  "food bank",
  "Perennial",
  "Annual",
  "Fungus",
];

/** Найти стоп-слова в тексте (границами слов, регистр важен для ряда строк). */
function foundStopWords(text, list) {
  const hits = [];
  for (const w of list) {
    // Русские слова — с любой формой окончания достаточно начала слова,
    // но чтобы не ловить подстроки, требуем границу символа после слова.
    const re = new RegExp(`(^|[^A-Za-zА-Яа-яЁё])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "u");
    if (re.test(text)) hits.push(w);
  }
  return hits;
}

const SCIENTISTS_EN = /Darwin|Wallace|Mendel|Linnaeus|Cuvier|Lamarck|Haeckel/;
const SCIENTISTS_RU = /Дарвин|Уоллес|Мендель|Линней|Кювье|Ламарк|Геккель/;

const browser = await chromium.launch();

// Прогрев: первый импорт модулей и serverFn в dev шлю full-reload вкладкам.
{
  const warmed = await warmupServer(browser, { log: (m) => console.log(`     ${m}`) });
  check(warmed, "dev-сервер прогрет (перезагрузки прекратились)");
}

/** Общий сценарий одной языковой партии. */
async function runLangCase(lang) {
  const { ctx, page, errs } = await openMenuLang(browser, lang);
  const L = lang === "en";
  try {
    const code = await startNetGameViaStore(page, {
      name: L ? "QA-Cards" : "QA-Карты",
      players: 2,
      bots: 1,
      modules: { continents: true, plants: true, fungi: true },
    });
    ok(`${lang.toUpperCase()}: партия поднята (стол ${code})`);
    await dismissSpotlight(page);
    await dismissTurnCardAny(page);
    await waitUntil(async () => (await phaseOf(page)) === "development", 20_000, 300);
    await waitUntil(() => ownTurn(page, "development"), 60_000, 500);
    await dismissTurnCardAny(page);

    // Животное + 2–3 свойства на нём (экшены движка, как кнопки руки).
    const placed = await playOwnAnimalsWithTraits(page, { wantTraits: 3 });
    const traits = placed.traits;
    console.log(`     шаги: ${placed.note}`);
    check(
      traits === -1 ? false : traits >= 2,
      `${lang.toUpperCase()}: на своём животном ${Math.max(traits, 0)} свойств (нужно ≥2 для чипов)`,
    );
    await dismissTurnCardAny(page);

    // Карточка животного с чипами.
    const animalCard = page.locator("[data-animal-id]").first();
    await waitUntil(() => animalCard.count().then((n) => n > 0).catch(() => false), 15_000, 300);
    await animalCard.scrollIntoViewIfNeeded().catch(() => {});
    await animalCard.screenshot({ path: join(SHOTS, `wave10-${lang}-01-animal-card.png`) }).catch(() => {});
    ok(`${lang.toUpperCase()}: снята карточка животного с чипами`);

    // Карта руки: кнопки «Животное»/«Animal» и граней-свойств.
    const hand = page.locator("[data-hand-row]").last();
    await hand.scrollIntoViewIfNeeded().catch(() => {});
    await shot(page, `${lang}-02-hand.png`);
    const handBtns = await handTexts(page);
    check(
      handBtns.some((x) => x.includes(L ? "Animal" : "Животное")),
      `${lang.toUpperCase()}: кнопка «${L ? "Animal" : "Животное"}» на карте руки`,
    );
    const chips = await chipTexts(page);
    check(chips.length >= 2, `${lang.toUpperCase()}: чипов свойств на столе ${chips.length} (≥2)`);

    // Тултип свойства.
    const tipText = (await hoverTraitTip(page)) ?? "";
    if (tipText) {
      await shot(page, `${lang}-03-trait-tip.png`);
      ok(`${lang.toUpperCase()}: тултип свойства снят (${tipText.slice(0, 60).replace(/\s+/g, " ")}…)`);
      check(
        L ? !/[а-яё]/i.test(tipText) : /[а-яё]/i.test(tipText),
        `${lang.toUpperCase()}: тултип свойства на языке партии`,
      );
    } else {
      warn(`${lang.toUpperCase()}: тултип свойства не открылся (чип не найден)`);
    }

    // Карточки растений и флоры (стартовый набор уже на столе).
    const plantCard = page.locator("[data-plant-id]").first();
    if (await plantCard.count()) {
      await plantCard.scrollIntoViewIfNeeded().catch(() => {});
      await plantCard.screenshot({ path: join(SHOTS, `wave10-${lang}-04-plant-card.png`) }).catch(() => {});
      ok(`${lang.toUpperCase()}: снята карточка растения`);
    } else {
      warn(`${lang.toUpperCase()}: растений на столе нет`);
    }
    const floraCard = page.locator("[data-flora-id]").first();
    if (await floraCard.count()) {
      await floraCard.scrollIntoViewIfNeeded().catch(() => {});
      await floraCard.screenshot({ path: join(SHOTS, `wave10-${lang}-05-flora-card.png`) }).catch(() => {});
      ok(`${lang.toUpperCase()}: снята карточка флоры`);
    } else {
      warn(`${lang.toUpperCase()}: флоры на столе нет`);
    }

    // Полосы территорий и табло соперника (имя учёного).
    await shot(page, `${lang}-06-table-territories.png`);
    const sectionBot = page.locator("[data-player-section]").filter({
      hasText: L ? SCIENTISTS_EN : SCIENTISTS_RU,
    });
    check(
      (await sectionBot.count().catch(() => 0)) > 0,
      `${lang.toUpperCase()}: секция бота-учёного показывает ${L ? "Darwin/Wallace/…" : "Дарвин/Уоллес/…"}`,
    );
    await expectText(
      page,
      L ? /Laurasia|Gondwana|Ocean/ : /Лавразия|Гондвана|Океан/,
      10_000,
      `${lang.toUpperCase()}: территории в табло`,
    );

    // Кормовая база: доходим до питания в свой ход.
    let bankOk = false;
    for (let i = 0; i < 40 && !bankOk; i++) {
      await dismissSpotlight(page);
      await dismissTurnCardAny(page);
      await dismissDefenseAny(page);
      const mine = await ownTurn(page, "feeding");
      if (mine && (await phaseOf(page)) === "feeding") bankOk = true;
      else await driveOne(page);
      await sleep(400);
    }
    if (bankOk) {
      await dismissTurnCardAny(page);
      await shot(page, `${lang}-07-feeding-bank.png`);
      ok(`${lang.toUpperCase()}: снят стол питания с кормовой базой`);
    } else {
      warn(`${lang.toUpperCase()}: свой ход питания не наступил — база не снята`);
    }

    // Стоп-слова: карточки/рука/стол.
    const text = await tableText(page);
    const hits = foundStopWords(text, L ? RU_STOP : EN_STOP);
    check(hits.length === 0, `${lang.toUpperCase()}: стоп-слова отсутствуют${hits.length ? ` — НАЙДЕНЫ: ${hits.join(", ")}` : ""}`);
    // Отдельно: имена учёных в EN-столе не остаются кириллическими.
    if (L) {
      const botSectionText = await page
        .evaluate(() => [...document.querySelectorAll("[data-player-section]")].map((el) => el.textContent ?? "").join("\n"))
        .catch(() => "");
      check(!SCIENTISTS_RU.test(botSectionText), "EN: имя бота-учёного переведено (кириллицы в секции нет)");
      check(SCIENTISTS_EN.test(botSectionText), "EN: имя бота-учёного на латинице (Darwin/Wallace/…)");
    } else {
      const botSectionText = await page
        .evaluate(() => [...document.querySelectorAll("[data-player-section]")].map((el) => el.textContent ?? "").join("\n"))
        .catch(() => "");
      check(!SCIENTISTS_EN.test(botSectionText), "RU: имя бота-учёного кириллицей (не Darwin и т.п.)");
    }

    await shot(page, `${lang}-08-full-table.png`);
  } finally {
    errs.forEach(fail);
    await ctx.close();
  }
}

/** Один шаг «закончить фазу» на любом языке: кнопки, подтверждение, стор. */
async function driveOne(page) {
  for (const name of [/^End development$/, /^End turn$/, /^Pass$/, /^Закончить развитие$/, /^Закончить ход$/, /^Пас$/]) {
    const btns = page.getByRole("button", { name });
    const n = await btns.count().catch(() => 0);
    for (let i = 0; i < n; i++) {
      const b = btns.nth(i);
      if ((await isVisible(b)) && (await b.isEnabled().catch(() => false))) {
        if (await safeClick(b, 2500)) return true;
      }
    }
  }
  for (const skipName of ["End feeding", "Закончить питание"]) {
    const skip = page.getByRole("button", { name: skipName, exact: true });
    if ((await isVisible(skip.first())) && (await skip.first().isEnabled().catch(() => false))) {
      await safeClick(skip.first());
      const confirm = page.locator('[role="dialog"]').getByRole("button", { name: skipName, exact: true });
      await waitUntil(() => isVisible(confirm.first()), 5000, 200);
      await safeClick(confirm.first());
      return true;
    }
  }
  return page
    .evaluate(() => {
      const s = globalThis.__evoStore?.getState?.();
      const st = s?.state;
      if (!s || !st || !s.net) return false;
      const mine = st.currentPlayerId === s.net.seat;
      if (st.pendingAttack && st.pendingAttack.waitingFor === s.net.seat) {
        s.dispatch({ type: "chooseDefense", kind: "none" });
        return true;
      }
      if (st.phase === "development" && mine) {
        s.dispatch({ type: "devPass" });
        return true;
      }
      if (st.phase === "feeding" && mine) {
        s.dispatch({ type: "feedEndTurn" });
        return true;
      }
      return false;
    })
    .catch(() => false);
}

// ── (а) русская партия ──────────────────────────────────────────────────────
await runLangCase("ru");

// ── (б) английская партия с чистого входа ───────────────────────────────────
await runLangCase("en");

await browser.close();

console.log("");
if (problems.length) {
  console.log(`ПРОВАЛ (${problems.length}):`);
  problems.forEach((p) => console.log(`  FAIL ${p}`));
  process.exitCode = 1;
} else {
  console.log("QA волны 10: всё зелёное.");
}
if (warnings.length) {
  console.log(`Предупреждения (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  WARN ${w}`));
}
console.log(`Скриншоты: ${SHOTS}`);
