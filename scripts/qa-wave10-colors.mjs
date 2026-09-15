/**
 * QA волны 10 (цвета игроков): эксклюзивность цвета в пределах стола и
 * палитра из 16 цветов. Проверяет (при живом dev-сервере,
 * node scripts/qa-wave10-colors.mjs):
 *   — два игрока за одним столом получают РАЗНЫЕ цвета при входе
 *     (сервер выдаёт только свободный цвет);
 *   — в пикере второго игрока цвет первого заблокирован (disabled) и
 *     подписан именем владельца, свободные — кликабельны;
 *   — попытка выбрать занятый цвет напрямую через API (мимо UI) отклоняется
 *     сервером с кодом color-taken, цвет не меняется;
 *   — смена на свободный цвет через пикер — успех, строка места перекрашивается;
 *   — палитра показывает 16 цветов.
 *
 * Скриншоты — вне репозитория (см. qa-lib.mjs, SHOTS). Версия до/после правок
 * различается суффиксом EVO_WAVE10_TAG (по умолчанию after).
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  BASE,
  SHOTS,
  bodyOf,
  createRoomViaStore,
  openMenu,
  roomCode,
  safeClick,
  sleep,
  trackPage,
  waitUntil,
} from "./qa-lib.mjs";

const TAG = process.env.EVO_WAVE10_TAG ?? "after";
const problems = [];
const check = (cond, msg) => {
  if (cond) console.log(`PASS: ${msg}`);
  else {
    console.log(`FAIL: ${msg}`);
    problems.push(msg);
  }
};
const shot = (page, name) =>
  page
    .screenshot({ path: join(SHOTS, `wave10-colors-${TAG}-${name}`) })
    .then((r) => console.log(`SHOT: ${join(SHOTS, `wave10-colors-${TAG}-${name}`)}`))
    .catch((e) => console.log(`WARN: скриншот ${name} не вышел: ${String(e?.message ?? e)}`));

// Состояние сетевого стора вкладки: имена и цвета мест.
const seatColors = (page) =>
  page.evaluate(() => {
    const st = globalThis.__evoStore?.getState?.().net;
    if (!st) return null;
    return {
      code: st.code,
      seat: st.seat,
      seats: (st.seats ?? []).map((s) => ({ seat: s.seat, name: s.name, color: s.color })),
    };
  });

const browser = await chromium.launch();
try {
  const hostCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const host = await hostCtx.newPage();
  trackPage(host, "хост");
  await openMenu(host);

  // ── Хост создаёт стол на 4 места без ботов ────────────────────────────────
  const created = await createRoomViaStore(host, {
    name: "Аня",
    capacity: 4,
    botSeats: 0,
    difficulty: "normal",
  });
  check(created.ok, `хост: стол создан (${created.code ?? created.error})`);
  if (!created.ok) throw new Error(created.error ?? "стол не создан");
  const code = created.code;
  check(
    await waitUntil(() => roomCode(host), 25_000, 500),
    `хост: лобби открыто (${code})`,
  );

  // ── Гость входит: цвета двух игроков должны быть разными ──────────────────
  const guestCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const guest = await guestCtx.newPage();
  trackPage(guest, "гость");
  await openMenu(guest);
  await guest.getByLabel("Ваше имя").fill("Боря");
  await guest.getByRole("button", { name: "Присоединиться к столу" }).click();
  await guest.getByLabel("Код стола").fill(code);
  await safeClick(guest.getByRole("button", { name: "Войти", exact: true }), 5000);
  const guestIn = await waitUntil(async () => (await roomCode(guest)) === code, 25_000, 500);
  check(guestIn, `гость: вошёл в стол ${code}`);
  if (!guestIn) throw new Error(`гость не вошёл; экран: ${await bodyOf(guest)}`);

  // Ждём, пока обе вкладки увидят состав с двумя игроками.
  const seen = await waitUntil(
    async () => {
      const [a, b] = await Promise.all([seatColors(host), seatColors(guest)]);
      return a?.seats?.length >= 2 && b?.seats?.length >= 2;
    },
    20_000,
    500,
  );
  check(seen, "обе вкладки видят два занятых места");
  const hostState = await seatColors(host);
  const guestState = await seatColors(guest);
  const hostColor = hostState?.seats?.find((s) => s.seat === 0)?.color ?? null;
  const guestColor = guestState?.seats?.find((s) => s.seat === 1)?.color ?? null;
  check(Boolean(hostColor) && Boolean(guestColor), `цвета мест получены (${hostColor}, ${guestColor})`);
  check(
    hostColor && guestColor && hostColor.toLowerCase() !== guestColor.toLowerCase(),
    `вход выдал разные цвета: хост ${hostColor}, гость ${guestColor}`,
  );

  // ── Пикер гостя: 16 цветов, цвет хоста заблокирован и подписан ───────────
  // Кнопка-палитра у своей строки места: title «Выбрать цвет».
  const paletteBtn = guest
    .locator("[data-seat-list] li")
    .filter({ hasText: "Боря" })
    .getByRole("button", { name: /^Цвет игрока: / });
  check((await paletteBtn.count()) > 0, "гость: кнопка-палитра у своей строки места");
  await safeClick(paletteBtn.first(), 5000);
  await sleep(600);
  const swatches = guest.locator('[data-seat-list] button[aria-pressed]');
  const swatchCount = await swatches.count();
  check(swatchCount === 16, `пикер показывает 16 цветов (нашёл ${swatchCount})`);

  // Кружок цвета хоста: disabled + подпись именем владельца под ним.
  const hostSwatch = guest.locator(`[data-seat-list] button[title^="${hostColor}"]`);
  const hostSwatchCount = await hostSwatch.count();
  check(hostSwatchCount === 1, `кружок цвета хоста (${hostColor}) есть в пикере`);
  if (hostSwatchCount === 1) {
    check(
      (await hostSwatch.first().isEnabled()) === false,
      "цвет хоста в пикере гостя заблокирован (disabled)",
    );
    check(
      (await hostSwatch.first().getAttribute("title")) === `${hostColor} — Аня`,
      "подсказка занятого цвета называет владельца",
    );
    const ownerLabel = await hostSwatch.first().locator("xpath=following-sibling::span[1]").textContent();
    check(
      (ownerLabel ?? "").trim() === "Аня",
      `под кружком занятого цвета — метка владельца («${(ownerLabel ?? "").trim()}»)`,
    );
  }

  // Свой текущий цвет — активен (aria-pressed=true).
  const ownSwatch = guest.locator(`[data-seat-list] button[title^="${guestColor}"]`);
  check(
    (await ownSwatch.count()) === 1 &&
      (await ownSwatch.first().getAttribute("aria-pressed")) === "true",
    `свой цвет (${guestColor}) отмечен активным`,
  );

  // Клики по занятым кружкам не проходят: UI даёт disabled-кнопку.
  shot(guest, "picker-guest.png");

  // ── Попытка выбрать занятый цвет в обход UI: сервер отклоняет ────────────
  // netSetColor не бросает исключение, а возвращает {ok:false, error, code}.
  const viaApi = await guest
    .evaluate(async ({ c, color }) => {
      const api = await import("/src/lib/net/api.ts");
      const token = localStorage.getItem(`evo-seat-${c}`);
      if (!token) return { ok: true, error: "токен не найден", code: null };
      const r = await api.netSetColor({ data: { code: c, token, color } });
      return { ok: Boolean(r?.ok), error: r?.error ?? "", code: r?.code ?? null };
    }, { c: code, color: hostColor })
    .catch((e) => ({ ok: false, error: String(e?.message ?? e), code: null }));
  check(
    viaApi.ok === false && /занят/i.test(viaApi.error ?? ""),
    `попытка выбрать цвет хоста через API отклонена (код ${viaApi.code}, «${(viaApi.error ?? "").slice(0, 60)}»)`,
  );
  await sleep(1500);
  const afterAttempt = await seatColors(guest);
  const guestColorAfter = afterAttempt?.seats?.find((s) => s.seat === 1)?.color;
  check(
    guestColorAfter && guestColorAfter.toLowerCase() === (guestColor ?? "").toLowerCase(),
    `цвет гостя не изменился после отказа (${guestColorAfter})`,
  );

  // ── Смена на свободный цвет через пикер: успех и перекраска строки ────────
  // Открываем пикер заново (мог закрыться) и берём любой enabled-кружок.
  if (!(await guest.locator('[data-seat-list] button[aria-pressed]').count())) {
    await safeClick(paletteBtn.first(), 5000);
    await sleep(400);
  }
  const all = guest.locator('[data-seat-list] button[aria-pressed]');
  let freeSwatch = null;
  const n = await all.count();
  for (let i = 0; i < n; i++) {
    const b = all.nth(i);
    if (await b.isEnabled().catch(() => false)) {
      if ((await b.getAttribute("aria-pressed")) !== "true") {
        freeSwatch = b;
        break;
      }
    }
  }
  check(Boolean(freeSwatch), "в пикере есть свободный кликабельный цвет");
  if (freeSwatch) {
    const newColor = (await freeSwatch.getAttribute("title")) ?? "";
    await safeClick(freeSwatch, 5000);
    const changed = await waitUntil(
      async () => {
        const st = await seatColors(guest);
        return st?.seats?.find((s) => s.seat === 1)?.color?.toLowerCase() === newColor.toLowerCase();
      },
      15_000,
      500,
    );
    check(changed, `смена на свободный цвет ${newColor} применена сервером`);
    // dev-перезагрузки (параллельная правка модулей) могут закрыть вкладку
    // прямо в момент снимка: возвращаем гостя в лобби и снимаем с запасом попыток.
    for (let i = 0; i < 3; i++) {
      await sleep(1500);
      if ((await roomCode(guest)) === code) {
        shot(guest, "picker-after-change.png");
        if (await guest
          .screenshot({ path: join(SHOTS, `wave10-colors-${TAG}-picker-after-change.png`) })
          .then(() => true, () => false)) break;
      } else {
        await openMenu(guest).catch(() => {});
        await guest.goto(`${BASE}/?room=${code}`).catch(() => {});
      }
    }
  }

  // ── Финиш: вердикт ────────────────────────────────────────────────────────
  console.log(problems.length === 0 ? "\nWAVE10-COLORS: OK" : `\nWAVE10-COLORS: FAIL (${problems.length})`);
} finally {
  await browser.close().catch(() => {});
}
if (problems.length) process.exit(1);
