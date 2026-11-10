import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { requestHandler } from "@tanstack/react-start/server";
import { UID_COOKIE, _internals, requireUserId } from "./identity.server.ts";
import type { SqlLike } from "../profile/shared.ts";

/**
 * Доказательство механизма куки: requireUserId() вызывается ВНУТРИ
 * requestHandler — того самого враппера, которым TanStack Start оборачивает
 * и серверные функции (createStartHandler → requestHandler), и SSR-документы.
 * Значит, Set-Cookie из проверки ниже доезжает ровно тем же путём, что и в
 * бою: setCookie пишет в заголовки h3-event, requestHandler сливает их в
 * финальный Response. Плюс живой PGLite с миграцией 0016 проверяет апсерт
 * строки в "user" (якорь для per-user таблиц профиля).
 */

let sql: SqlLike;

before(async () => {
  const pg = new PGlite();
  await pg.waitReady;
  const ddl = readFileSync(
    fileURLToPath(new URL("../../../migrations/0016_anon_identity.sql", import.meta.url)),
    "utf8",
  );
  await pg.exec(ddl);
  const run = async <T>(text: string, params: unknown[] = []): Promise<T[]> =>
    (await pg.query<T>(text, params)).rows as T[];
  sql = { query: run } as unknown as SqlLike;
  // Реальный getSql() тянет bootstrap PGLite с import.meta.glob — под голым
  // node его нет, поэтому тест подменяет только источник sql.
  _internals.getSql = async () => sql;
});

after(() => {
  _internals.getSql = async () => {
    throw new Error("тест должен подменять getSql до вызова requireUserId");
  };
});

/** Проверка requireUserId в контексте реального запроса; отдаёт uid и ответ. */
async function callWith(cookie?: string) {
  let uid = "";
  const headers: HeadersInit = cookie ? { cookie: `${UID_COOKIE}=${cookie}` } : {};
  // requestOpts у враппера обязательный по типу (`any` без `?`) — передаём
  // undefined явно, runtime его не читает.
  const response = await requestHandler(async () => {
    uid = await requireUserId();
    return new Response("ok");
  })(new Request("http://localhost:8099/", { headers }), undefined);
  return { uid, setCookie: response.headers.get("set-cookie") };
}

async function userRow(id: string): Promise<{ id: string; name: string; email: string } | undefined> {
  const rows = await sql.query<{ id: string; name: string; email: string }>(
    'select "id", "name", "email" from "user" where "id" = $1',
    [id],
  );
  return rows[0];
}

describe("identity: кука и строка в user", () => {
  it("первый запрос: минтит uuid, ставит Set-Cookie с нужными атрибутами и создаёт строку user", async () => {
    const { uid, setCookie } = await callWith();
    assert.match(uid, /^[0-9a-f-]{36}$/, "uuid v4");
    assert.ok(setCookie, "ответ первого запроса обязан нести Set-Cookie");
    for (const part of [
      `${UID_COOKIE}=${uid}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      "Max-Age=31536000",
    ]) {
      assert.ok(setCookie!.includes(part), `Set-Cookie должен содержать ${part}: ${setCookie}`);
    }
    const row = await userRow(uid);
    assert.ok(row, "строка в user создана апсертом");
    assert.equal(row!.email, `${uid}@anon.local`);
  });

  it("второй запрос с кукой: тот же uid, без повторного Set-Cookie", async () => {
    const first = await callWith();
    const second = await callWith(first.uid);
    assert.equal(second.uid, first.uid, "кука = личность, без повторного минта");
    assert.equal(second.setCookie, null, "валидная кука не переписывается");
    const row = await userRow(first.uid);
    assert.ok(row, "апсерт на валидной куке ничего не ломает");
  });

  it("мусорная кука не становится личностью: минтится свежий uuid", async () => {
    const forged = await callWith("not-a-uuid");
    assert.notEqual(forged.uid, "not-a-uuid");
    assert.match(forged.uid, /^[0-9a-f-]{36}$/);
    assert.ok(forged.setCookie?.includes(`${UID_COOKIE}=${forged.uid}`), "новая кука перезаписывает мусор");
    assert.equal(await userRow("not-a-uuid"), undefined, "подделка не дошла до user");
  });

  it("сброс базы (рестарт PGLite в dev): апсерт чинит строку user по живой куке", async () => {
    const { uid } = await callWith();
    await sql.query('delete from "user" where "id" = $1', [uid]);
    assert.equal(await userRow(uid), undefined);
    const again = await callWith(uid);
    assert.equal(again.uid, uid);
    assert.ok(await userRow(uid), "строка восстановлена без перезаписи куки");
  });
});
