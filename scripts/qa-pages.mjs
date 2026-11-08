/**
 * QA страниц-разделов (/shop, /bestiary, /campaign, /challenges): прямые
 * заходы по глубоким ссылкам, переходы из меню по кнопкам шапки, шапка
 * страниц = шапка меню с подсветкой активного раздела (кнопки «Назад» больше
 * нет), мобильный таб-бар с домиком по центру, скриншоты 1280/390px (в
 * каталог вне репозитория, см. qa-lib).
 * Запуск при живом dev-сервере: node scripts/qa-pages.mjs
 */
import { chromium } from "playwright";
import { SHOTS, bodyOf, gotoUrl, menuReady, newRuPage, roomCode, sleep, trackPage, waitUntil } from "./qa-lib.mjs";

const base = process.env.EVO_URL ?? "http://127.0.0.1:8099";

const PAGES = [
  {
    url: "/shop",
    title: "Магазин",
    button: "Магазин",
    probe: async (page) => (await text(page, "0% pay-to-win")) && (await text(page, "Сукно стола")),
    shot: "page-shop.png",
  },
  {
    url: "/bestiary",
    title: "Бестиарий",
    button: "Бестиарий",
    // Свежий контекст — альбом пуст, пустое состояние объясняет, как завести питомца.
    probe: (page) => text(page, "Пока пусто"),
    shot: "page-bestiary.png",
  },
  {
    url: "/campaign",
    title: "Кампания",
    button: "Кампания",
    // Первая миссия эпохи всегда открыта — кнопка «Начать» доступна.
    probe: (page) =>
      page.getByRole("button", { name: "Начать", exact: true }).first().isVisible().catch(() => false),
    shot: "page-campaign.png",
  },
  {
    url: "/challenges",
    title: "Вызовы",
    button: "Вызовы",
    // Данные с сервера: либо чип баланса, либо (при сбое) честная ошибка —
    // как раньше вела себя модалка.
    probe: async (page) =>
      (await text(page, /Ископаемые:/)) || (await text(page, "Не удалось начать миссию")),
    shot: "page-challenges.png",
  },
];

async function text(page, s) {
  return page.getByText(s).first().isVisible().catch(() => false);
}

const browser = await chromium.launch();

// ── прогрев: первый заход компилирует модули новых роутов (dev шлёт
// full-reload всем вкладкам — в основном прогоне ему не место).
{
  const warm = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
  for (const p of PAGES) {
    await gotoUrl(warm.page, base + p.url);
    await sleep(400);
  }
  await warm.ctx.close().catch(() => {});
}

const { ctx, page } = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
const problems = trackPage(page, "pages");
const ok = (m) => console.log("OK:", m);
const fail = (m) => {
  console.log("FAIL:", m);
  problems.push(m);
};
const at = (path) => new URL(page.url()).pathname === path;
const noHScroll = () =>
  page
    .evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
    .catch(() => false);

// ── 1. прямые заходы по глубоким ссылкам ────────────────────────────────────
for (const p of PAGES) {
  await gotoUrl(page, base + p.url);
  const h1 = page.getByRole("heading", { level: 1, name: p.title });
  const h1ok = await waitUntil(() => h1.isVisible().catch(() => false), 20000);
  const content = await waitUntil(() => p.probe(page), 15000, 400);
  const urlOk = await waitUntil(() => at(p.url), 10000, 300);
  const title = await waitUntil(() => page.title().then((t) => t === p.title), 8000, 300);
  const fit = await noHScroll();
  if (h1ok && content && urlOk && title && fit) {
    ok(`${p.url}: h1, содержимое, URL, title, без горскролла`);
  } else {
    fail(`${p.url}: h1=${h1ok} content=${content} url=${urlOk}(${page.url()}) title=${title}(${await page.title()}) hScroll=${!fit}; экран: ${await bodyOf(page)}`);
  }
  await page.screenshot({ path: `${SHOTS}/${p.shot}`, fullPage: true });
}

// ── 2. из меню: кнопка шапки → страница ─────────────────────────────────────
for (const p of PAGES) {
  await gotoUrl(page, base + "/");
  if (!(await menuReady(page, 30000))) {
    fail(`${p.button}: меню не открылось; экран: ${await bodyOf(page)}`);
    continue;
  }
  const btn = page.getByRole("button", { name: p.button, exact: true }).first();
  if (!(await btn.isVisible().catch(() => false))) {
    fail(`${p.button}: кнопки в шапке меню нет`);
    continue;
  }
  await btn.click();
  const urlOk = await waitUntil(() => at(p.url), 15000, 300);
  const h1ok = await waitUntil(
    () => page.getByRole("heading", { level: 1, name: p.title }).isVisible().catch(() => false),
    15000,
    400,
  );
  if (urlOk && h1ok) ok(`меню → ${p.url}: URL и заголовок`);
  else fail(`меню → ${p.url}: url=${urlOk}(${page.url()}) h1=${h1ok}; экран: ${await bodyOf(page)}`);
}

// ── 3. шапка страниц: та же навигация, что у меню, «Назад» больше нет ────────
// Активный раздел подсвечен (data-active="true"), остальные кнопки — нет.
const NAV_NAMES = PAGES.map((p) => p.button);
for (const p of PAGES) {
  await gotoUrl(page, base + p.url);
  await waitUntil(
    () => page.getByRole("heading", { level: 1, name: p.title }).isVisible().catch(() => false),
    20000,
    400,
  );
  const backGone = !(await page
    .getByRole("button", { name: "Вернуться в меню" })
    .first()
    .isVisible()
    .catch(() => false));
  const states = [];
  for (const name of NAV_NAMES) {
    const b = page.getByRole("button", { name, exact: true });
    if (!(await b.isVisible().catch(() => false))) {
      states.push(`${name}:none`);
      continue;
    }
    const active = (await b.getAttribute("data-active").catch(() => null)) === "true";
    states.push(`${name}:${active ? "active" : "plain"}`);
  }
  const activeCount = states.filter((s) => s.endsWith(":active")).length;
  if (backGone && activeCount === 1 && states.includes(`${p.button}:active`)) {
    ok(`${p.url}: «Назад» нет, в шапке активен «${p.button}»`);
  } else {
    fail(`${p.url}: backGone=${backGone} шапка=[${states.join(", ")}]`);
  }
}

// ── 4. главный маршрут жив: / всё ещё открывает меню игры ───────────────────
// В меню ни один раздел не подсвечен.
await gotoUrl(page, base + "/");
const home = await menuReady(page, 30000);
const cols = await page.locator("[data-menu-col]").count().catch(() => 0);
const menuActive = await page
  .locator('header button[data-active="true"]')
  .count()
  .catch(() => 1);
if (home && cols === 3 && menuActive === 0) ok("/: меню игры на месте (3 колонки), без активного раздела в шапке");
else fail(`/: menu=${home} cols=${cols} menuActive=${menuActive}; экран: ${await bodyOf(page)}`);

await page.screenshot({ path: `${SHOTS}/page-menu.png`, fullPage: true });
await ctx.close().catch(() => {});

// ── 5. старт миссии из кампании уводит в меню → лобби партии ────────────────
// (поведение, которое раньше давало закрытие модалки; создаёт реальный стол)
{
  const run = await newRuPage(browser, { viewport: { width: 1280, height: 900 } });
  const p2 = run.page;
  const problems2 = trackPage(p2, "campaign-start");
  await gotoUrl(p2, base + "/campaign");
  const start = p2.getByRole("button", { name: "Начать", exact: true }).first();
  if (await waitUntil(() => start.isVisible().catch(() => false), 20000, 400)) {
    await start.click();
    const urlOk = await waitUntil(() => new URL(p2.url()).pathname === "/", 20000, 300);
    const lobby = await waitUntil(async () => Boolean(await roomCode(p2)), 30000, 400);
    if (urlOk && lobby) ok("/campaign: «Начать» → / и лобби с кодом стола");
    else fail(`/campaign: «Начать» → url=${urlOk}(${p2.url()}) lobby=${lobby}; экран: ${await bodyOf(p2)}`);
  } else {
    fail("/campaign: кнопка «Начать» не появилась; экран: " + (await bodyOf(p2)));
  }
  if (problems2.length) fail("campaign-start: " + problems2.join(" | "));
  await run.ctx.close().catch(() => {});
}

// ── 6. телефон 390px: таб-бар с домиком по центру, «Назад» нет ───────────────
{
  const run = await newRuPage(browser, { viewport: { width: 390, height: 844 } });
  const mob = run.page;
  const tabbar = mob.getByTestId("mobile-tabbar");
  const homeTab = mob.getByTestId("mobile-tab-home");
  const tabs = mob.getByTestId("mobile-tab");
  const noHScrollMob = () =>
    mob
      .evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
      .catch(() => false);

  // Меню: таб-бар с 4 вкладками и домиком строго по центру панели.
  await gotoUrl(mob, base + "/");
  await menuReady(mob, 30000);
  const barVisible = await tabbar.isVisible().catch(() => false);
  const nTabs = await tabs.count().catch(() => 0);
  const homeVisible = await homeTab.isVisible().catch(() => false);
  const center = await mob
    .evaluate(() => {
      const bar = document.querySelector('[data-testid="mobile-tabbar"]');
      const home = bar?.querySelector('[data-testid="mobile-tab-home"]');
      if (!bar || !(home instanceof HTMLElement)) return null;
      const b = bar.getBoundingClientRect();
      const h = home.getBoundingClientRect();
      return { off: Math.round(Math.abs(b.left + b.width / 2 - (h.left + h.width / 2))) };
    })
    .catch(() => null);
  const centered = center != null && center.off <= 8;
  const fitMenu = await noHScrollMob();
  if (barVisible && nTabs === 4 && homeVisible && centered && fitMenu) {
    ok("390px /: таб-бар, 4 вкладки, домик по центру, без горскролла");
  } else {
    fail(`390px /: bar=${barVisible} tabs=${nTabs} home=${homeVisible} center=${JSON.stringify(center)} hScroll=${!fitMenu}`);
  }
  await mob.screenshot({ path: `${SHOTS}/page-menu-mobile.png`, fullPage: true });

  for (const p of PAGES) {
    await gotoUrl(mob, base + p.url);
    await waitUntil(
      () => mob.getByRole("heading", { level: 1, name: p.title }).isVisible().catch(() => false),
      15000,
      400,
    );
    const backGone = !(await mob
      .getByRole("button", { name: "Вернуться в меню" })
      .first()
      .isVisible()
      .catch(() => false));
    const homeOk = await homeTab.isVisible().catch(() => false);
    const pageFit = await noHScrollMob();
    if (backGone && homeOk && pageFit) ok(`390px ${p.url}: домик в таб-баре, «Назад» нет, без горскролла`);
    else fail(`390px ${p.url}: backGone=${backGone} home=${homeOk} hScroll=${!pageFit}`);
    if (p.url === "/shop") {
      await mob.screenshot({ path: `${SHOTS}/page-shop-mobile.png`, fullPage: true });
    }

    // Домик возвращает в меню с любой страницы.
    await homeTab.click();
    const urlOk = await waitUntil(() => new URL(mob.url()).pathname === "/", 15000, 300);
    const menu = await menuReady(mob, 15000);
    if (urlOk && menu) ok(`390px ${p.url} → домик → меню`);
    else fail(`390px ${p.url} → домик: url=${urlOk}(${mob.url()}) menu=${menu}`);
  }
  await run.ctx.close().catch(() => {});
}

// ── 7. английская локаль: evo-lang=en → страницы переводятся ────────────────
{
  // Свой контекст без newRuPage: его init-скрипт принудительно ставит «ru»
  // (см. qa-lib) и перебивал бы en-выбор.
  const ctxEn = await browser.newContext({ locale: "en-GB", viewport: { width: 1280, height: 900 } });
  await ctxEn.addInitScript(() => {
    try {
      localStorage.setItem("evo-lang", "en");
    } catch {}
  });
  const run = { ctx: ctxEn, page: await ctxEn.newPage() };
  // Без gotoUrl из qa-lib: он при первом переходе сеет на страницу RU-init
  // (page-скрипт исполняется после context-скрипта и перебивает en).
  const gotoEn = (url) =>
    run.page
      .goto(base + url, { waitUntil: "networkidle", timeout: 60_000 })
      .catch(() => run.page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => {}));
  for (const [url, title] of [
    ["/shop", "Shop"],
    ["/bestiary", "Bestiarium"],
    ["/campaign", "Campaign"],
    ["/challenges", "Challenges"],
  ]) {
    await gotoEn(url);
    const h1 = run.page.getByRole("heading", { level: 1, name: title });
    const h1ok = await waitUntil(() => h1.isVisible().catch(() => false), 15000, 400);
    // Шапка без «Назад»: та же навигация, кнопка текущего раздела активна.
    const btn = run.page.getByRole("button", { name: title, exact: true });
    const nav = await waitUntil(() => btn.isVisible().catch(() => false), 8000, 300);
    const active = (await btn.getAttribute("data-active").catch(() => null)) === "true";
    const back = await run.page
      .getByRole("button", { name: "Back to the menu" })
      .isVisible()
      .catch(() => false);
    if (h1ok && nav && active && !back) ok(`en ${url}: h1 «${title}» + активная кнопка шапки, «Назад» нет`);
    else fail(`en ${url}: h1=${h1ok} nav=${nav} active=${active} back=${back}; экран: ${await bodyOf(run.page)}`);
  }
  await run.ctx.close().catch(() => {});
}

await browser.close();

if (problems.length) {
  console.log(`ПРОБЛЕМЫ КОНСОЛИ/СТРАНИЦЫ (${problems.length}):`);
  for (const pr of problems) console.log("  -", pr);
}
console.log(problems.length ? `ВЕРДИКТ: FAIL (${problems.length})` : "ВЕРДИКТ: OK");
process.exit(problems.length ? 1 : 0);
