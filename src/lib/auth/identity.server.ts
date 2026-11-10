import { getCookie, getRequest, getRequestProtocol, setCookie } from "@tanstack/react-start/server";
import type { Sql } from "../db";

/**
 * Анонимная идентичность игрока (server-only, `.server.ts` суффикс).
 *
 * Внешнего auth-брокера нет (прошлый хостинг с «Sign in with» выведен из
 * эксплуатации) — личность игрока здесь это просто браузер: сервер
 * выдаёт куку `__Host-evo-uid` со случайным uuid и дальше доверяет её
 * значению. Это осознанный контракт приватного деплоя:
 *  - личность живёт в браузере (по куке на профиль/кошелёк/вызовы), без
 *    брокера, паролей и сессий — тариф «кто открыл сайт, тот и игрок»;
 *  - владение кукой = владение личностью: uuid негадаем (122 бита), но
 *    перехваченная/подсмотренная кука даёт чужой профиль — как и любая
 *    cookie-сессия. SameSite=Lax + same-site сторож (assertSameSiteRequest)
 *    закрывают скриптовые чужие запросы, top-level навигации — нет.
 *
 * Почему `__Host-` + всегда Secure: префикс `__Host-` браузер принимает
 * ТОЛЬКО с атрибутом Secure (Path=/, без Domain — поэтому и никакой подмены
 * с родственных поддоменов). Secure на http://localhost браузеры считают
 * доверенным источником и куку принимают (тот же приём использовал Better
 * Auth в локальной разработке); на обычном http-хосте НЕ localhost куку
 * браузер молча выбросит — там личность не переживёт запрос (см. предупреждение
 * ниже, лечится https-прокси перед контейнером).
 */
export const UID_COOKIE = "__Host-evo-uid";

/** Год в секундах: кука переживает долгую паузу между заходами в игру. */
const UID_MAX_AGE = 60 * 60 * 24 * 365;

/** Только те значения, которые выдаём сами: подделка под формат не проходит. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Точка подмены sql для тестов: реальный getSql() тянет весь bootstrap PGLite
 * (import.meta.glob недоступен под голым node, а db.ts на загрузке сам стартует
 * bootstrap — тесту нужен только .query()), поэтому db импортируется лениво и
 * тест подменяет источник целиком. Тот же приём, что у net/server.ts.
 */
export const _internals = {
  getSql: async (): Promise<Sql> => (await import("../db")).getSql(),
};

/**
 * Разов (за процесс) предупреждаем про хост, где кука `__Host-` не выживет:
 * plain http вне localhost. Молчаливое «личность сбрасывается каждый запрос»
 * — худший вид поломки, поэтому оператор должен увидеть причину в логе.
 */
let warnedInsecureHost = false;

function warnIfCookieWouldNotPersist(request: Request): void {
  if (warnedInsecureHost) return;
  let protocol = "http:";
  let host = "";
  try {
    protocol = getRequestProtocol({ xForwardedProto: true }) === "https" ? "https:" : "http:";
    host = new URL(request.url).hostname;
  } catch {
    return; // нет ни URL, ни протокола — не о чем предупреждать
  }
  const local =
    host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1";
  if (protocol === "https:" || local) return;
  warnedInsecureHost = true;
  console.error(
    `[identity] Хост ${host} отдаётся по ${protocol} — браузер не сохранит куку ` +
      `${UID_COOKIE} (префикс __Host- требует Secure, а Secure на plain http вне ` +
      "localhost браузеры отбрасывают). Личность будет сбрасываться на каждый " +
      "запрос. Заведите https-прокси перед приложением или заходите по localhost.",
  );
}

/**
 * Якорная строка в таблице "user" (см. migrations/0016_anon_identity.sql).
 * Per-user таблицы ссылаются на user_id по значению (TEXT, FK только между
 * собой), но строка в "user" держит личность находимой в БД и оставляет
 * будущим FK/JOIN на "user" валидными. on conflict do nothing — вызов
 * идемпотентен: после сброса PGLite (рестарт дев-сервера) кука в браузере
 * переживёт базу, и этот апсертом строка чинится на первом же запросе.
 */
async function ensureUserRow(sql: Sql, userId: string): Promise<void> {
  await sql.query(
    'insert into "user" ("id", "name", "email", "emailVerified") ' +
      "values ($1, $2, $3, false) on conflict (\"id\") do nothing",
    [userId, `Player ${userId.slice(0, 6)}`, `${userId}@anon.local`],
  );
}

/**
 * Идентификатор игрока для серверной функции. Кука есть и похожа на наш
 * uuid -> возвращаем её; иначе создаём uuid и ставим куку на ответ (Set-Cookie
 * уходит вместе с ответом serverFn, TanStack Start прокидывает заголовки h3).
 * Параллельные первые запросы одного браузера могут наминтить по uuid каждый —
 * куку переживёт последний ответ, записи-сироты безвредны (профили пустые).
 */
export async function requireUserId(): Promise<string> {
  const request = getRequest(); // без контекста запроса бросит — middleware зовёт только внутри запроса
  const existing = getCookie(UID_COOKIE);
  if (existing && UUID_RE.test(existing)) {
    await ensureUserRow(await _internals.getSql(), existing);
    return existing;
  }
  const userId = crypto.randomUUID();
  warnIfCookieWouldNotPersist(request);
  setCookie(UID_COOKIE, userId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: UID_MAX_AGE,
    secure: true,
  });
  await ensureUserRow(await _internals.getSql(), userId);
  return userId;
}
