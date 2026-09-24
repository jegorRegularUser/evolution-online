/**
 * Проверка приватных столов и меню (новый контракт волны 4):
 *   — закрытый стол ВИДЕН в меню в колонке «Закрытые» (`isPrivate` в
 *     RoomSummary), но в списке нет пароля — он приходит только хосту;
 *   — вход по коду без пароля просит пароль; неверный — ошибка в форме;
 *     верный — гость за столом;
 *   — наблюдать закрытый стол БЕЗ пароля нельзя (S5): сервер отвечает
 *     password-required, форма показывает ошибку и остаётся на месте;
 *     netSpectate С паролем — работает (серверный контракт).
 *
 * Соло-режим и старый список «приватных скрыты» удалены — см. scripts/qa-lib.mjs.
 * Запуск при живом dev-сервере: node scripts/qa-net-privacy.mjs
 */
import { chromium } from "playwright";
import { bodyOf, openMenu, roomCode, safeClick, sleep, waitUntil } from "./qa-lib.mjs";

const problems = [];
const check = (cond, msg) => {
  if (cond) console.log(`PASS: ${msg}`);
  else {
    console.log(`FAIL: ${msg}`);
    problems.push(msg);
  }
};

const browser = await chromium.launch();
try {
  // ── Хост: приватный стол из меню ─────────────────────────────────────────
  const hostCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const host = await hostCtx.newPage();
  await openMenu(host);

  check((await host.getByRole("button", { name: "Создать стол" }).count()) > 0, "меню: кнопка «Создать стол»");
  check(
    (await host.getByRole("button", { name: "Присоединиться к столу" }).count()) > 0,
    "меню: кнопка «Присоединиться к столу»",
  );
  const cols = ["table", "open", "private"];
  const missing = [];
  for (const id of cols) {
    if ((await host.locator(`[data-menu-col="${id}"]`).count()) === 0) missing.push(id);
  }
  check(missing.length === 0, `меню: три колонки на месте (нет: ${missing.join(", ") || "—"})`);
  check(
    (await host.locator('[data-menu-col="private"]').getByText(/Закрытые/).count()) > 0,
    "меню: колонка «Закрытые» подписана",
  );

  // Приватный стол: пароль генерирует сервер и показывает его хосту в лобби.
  await host.getByLabel("Ваше имя").fill("Аня");
  await host.getByLabel("Приватный стол — вход по паролю").check().catch(async () => {
    await host.getByText("Приватный стол — вход по паролю").click().catch(() => {});
  });
  await sleep(300);
  await safeClick(host.getByRole("button", { name: "Создать стол" }).last(), 5000);
  const hostLobby = await waitUntil(() => roomCode(host), 25_000, 400);
  check(hostLobby, `хост: лобби приватного стола открылось (${await roomCode(host)})`);
  const code = (await roomCode(host)) ?? "";
  await host.getByRole("button", { name: "Показать пароль" }).first().click().catch(() => {});
  await sleep(400);
  const generated = ((await host.locator("[data-room-password]").first().textContent().catch(() => "")) ?? "").trim();
  check(/^\d{4}$/.test(generated), `приватный стол: сервер выдал пароль из 4 цифр (${generated})`);

  // ── Гость: закрытый стол виден в колонке «Закрытые», без пароля ──────────
  const guestCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const guest = await guestCtx.newPage();
  await openMenu(guest);
  // Список комнат поллится раз в 4 с — ждём появления строки.
  const rowSel = `[data-menu-col="private"] [data-private-row="${code}"]`;
  const listed = await waitUntil(() => guest.locator(rowSel).count().then((n) => n > 0), 15_000, 700);
  check(listed, `гость: приватный стол ${code} показан в колонке «Закрытые»`);
  const openHasIt = await guest.locator(`[data-menu-col="open"] [data-room-row="${code}"]`).count();
  check(openHasIt === 0, "гость: в колонке «Открытые» закрытого стола нет");

  // Пароль не светится ни в разметке строки, ни в ответе netListRooms.
  const privateCol = await guest.locator('[data-menu-col="private"]').first().innerText().catch(() => "");
  const privateHtml = await guest.locator('[data-menu-col="private"]').first().innerHTML().catch(() => "");
  check(generated && !privateCol.includes(generated), "гость: пароль не виден в тексте колонки «Закрытые»");
  check(generated && !privateHtml.includes(generated), "гость: пароль не зашит в разметку списка");
  const apiRooms = await guest
    .evaluate(async (roomCode) => {
      const api = await import("/src/lib/net/api.ts");
      const r = await api.netListRooms({ data: {} });
      if (!r || !r.ok) return { error: r?.error ?? "нет ответа" };
      const room = (r.rooms ?? []).find((x) => x.code === roomCode) ?? null;
      return { room, raw: JSON.stringify(r.rooms ?? []) };
    }, code)
    .catch((e) => ({ error: String(e?.message ?? e) }));
  check(Boolean(apiRooms?.room), `netListRooms: закрытый стол есть в списке (${apiRooms?.error ?? "ок"})`);
  check(apiRooms?.room?.isPrivate === true, "netListRooms: у закрытого стола флаг isPrivate=true");
  check(
    !("password" in (apiRooms?.room ?? {})) && !apiRooms?.raw?.includes(generated),
    "netListRooms: пароля нет ни в объекте стола, ни в сыром ответе",
  );

  // ── Вход по коду: без пароля → форма просит пароль ───────────────────────
  await guest.getByLabel("Ваше имя").fill("Боря");
  await guest.getByRole("button", { name: "Присоединиться к столу" }).click();
  await guest.getByLabel("Код стола").fill(code);
  await guest.getByRole("button", { name: "Войти", exact: true }).click();
  await sleep(1500);
  const askedPassword = await guest.getByLabel(/Пароль/).count();
  check(askedPassword > 0, "гость: вход без пароля просит пароль (не выбрасывает в меню)");

  // ── Наблюдение закрытого стола без пароля ЗАПРЕЩЕНО (S5) ────────────────
  const watchNoPassword = await guest
    .evaluate(async (c) => {
      const api = await import("/src/lib/net/api.ts");
      const r = await api.netSpectate({ data: { code: c, name: "Зоя-API" } });
      return r.ok ? { ok: true, token: r.token } : { ok: false, error: r.error, code: r.code };
    }, code)
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
  check(
    watchNoPassword?.ok === false && /пароль/i.test(watchNoPassword?.error ?? ""),
    `наблюдатель: netSpectate без пароля отклонён (${watchNoPassword?.error ?? `пустили, token ${watchNoPassword?.token}`})`,
  );
  check(
    (await guest.locator("[data-seat-list]").count()) === 0 || (await guest.getByLabel("Код стола").count()) > 0,
    "наблюдатель: после отказа остались в форме меню",
  );

  // UI-путь «Смотреть» без пароля: ошибка в форме, режим зрителя не включён.
  await safeClick(guest.getByRole("button", { name: "Смотреть" }).first(), 4000);
  await sleep(1800);
  const watchState = await guest
    .evaluate(async () => {
      const s = await import("/src/store/game-store.ts");
      const g = s.useGameStore.getState();
      return { spectating: g.net?.spectating ?? false, err: g.net?.error ?? null, form: Boolean(document.querySelector('input[aria-label="Код стола"]')) };
    })
    .catch(() => null);
  check(
    watchState?.spectating === false && watchState?.form === true,
    `наблюдатель (UI): приватный стол без пароля не смотрится — ошибка и форма (${JSON.stringify(watchState)})`,
  );

  // Серверный контракт: с паролем наблюдение работает.
  const watchWithPassword = await guest
    .evaluate(
      async ({ c, p }) => {
        const api = await import("/src/lib/net/api.ts");
        const r = await api.netSpectate({ data: { code: c, name: "Зоя-API", password: p } });
        if (!r.ok) return { ok: false, error: r.error, code: r.code };
        const poll = await api.netSpectatorPoll({ data: { code: c, token: r.token } });
        return { ok: true, token: r.token, pollOk: Boolean(poll?.ok), seat: poll?.snapshot?.seat };
      },
      { c: code, p: generated },
    )
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
  check(
    watchWithPassword?.ok === true && watchWithPassword?.pollOk === true,
    `наблюдатель: netSpectate С паролем пускает и поллинг отвечает (${JSON.stringify(watchWithPassword).slice(0, 160)})`,
  );
  const wrongWatch = await guest
    .evaluate(
      async ({ c, p }) => {
        const api = await import("/src/lib/net/api.ts");
        const r = await api.netSpectate({ data: { code: c, name: "Зоя-API", password: p } });
        return r.ok ? { ok: true } : { ok: false, error: r.error, code: r.code };
      },
      { c: code, p: generated === "0000" ? "1111" : "0000" },
    )
    .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
  check(wrongWatch?.ok === false, `наблюдатель: неверный пароль для наблюдения отклонён (${wrongWatch?.error ?? "?"})`);

  // ── Неверный пароль входа → ошибка в форме ───────────────────────────────
  if (askedPassword > 0) {
    const wrong = generated === "0000" ? "1111" : "0000";
    await guest.getByLabel(/Пароль/).first().fill(wrong);
    await guest.getByRole("button", { name: "Войти", exact: true }).click();
    await sleep(1500);
    const stillForm = await guest.getByLabel("Код стола").count();
    const inLobby = await guest.getByText(/Стол · ждём игроков/i).count();
    check(stillForm > 0 && inLobby === 0, "гость: неверный пароль — остались в форме, за стол не пустили");
  }

  // ── Верный пароль → за столом ────────────────────────────────────────────
  await guest.getByLabel(/Пароль/).first().fill(generated);
  await guest.getByRole("button", { name: "Войти", exact: true }).click();
  const seated = await waitUntil(async () => (await roomCode(guest)) === code, 20_000, 500);
  check(seated, `гость: верный пароль — сел за приватный стол (${await bodyOf(guest, 80)})`);

  // ── Открытый стол наблюдается без пароля (регресс старого пути) ──────────
  // Хост переключает стол в «Открытый» — после этого зритель входит без цифр.
  const openToggle = host
    .getByRole("button", { name: /стол.*(?:приватн|открыт)/i })
    .first();
  if (await openToggle.count()) {
    await safeClick(openToggle, 4000);
    await sleep(1200);
    const isPrivateNow = await host.evaluate(() => globalThis.__evoStore?.getState?.().net?.isPrivate ?? null);
    check(isPrivateNow === false, "хост: стол переключён в «Открытый» перед проверкой зрителя без пароля");
    const openWatch = await guest
      .evaluate(async (c) => {
        const api = await import("/src/lib/net/api.ts");
        const r = await api.netSpectate({ data: { code: c, name: "Зоя-Открыто" } });
        return r.ok ? { ok: true } : { ok: false, error: r.error, code: r.code };
      }, code)
      .catch((e) => ({ ok: false, error: String(e?.message ?? e) }));
    check(openWatch?.ok === true, `наблюдатель: открытый стол по-прежнему смотрится без пароля (${openWatch?.error ?? "ок"})`);
  } else {
    check(false, "хост: не найден тумблер приватности для проверки открытого стола");
  }
} catch (e) {
  console.log(`FAIL: прогон прерван — ${String(e?.message ?? e).split("\n")[0]}`);
  problems.push(String(e?.message ?? e));
} finally {
  await browser.close();
}

console.log(`\nИтог: провалов ${problems.length}`);
process.exit(problems.length ? 1 : 0);
