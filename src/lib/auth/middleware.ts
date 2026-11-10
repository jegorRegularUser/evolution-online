import { createMiddleware } from "@tanstack/react-start";

/**
 * Identity middleware для серверных функций — стандартный способ получить
 * идентификатор игрока. Личность анонимная: кука `__Host-evo-uid`, которую
 * сервер сам выдаёт при первом вызове (см. `identity.server.ts`); внешний
 * auth-брокер удалён вместе с прежним хостингом, bearer-хука больше нет.
 *
 *   import { createServerFn } from "@tanstack/react-start";
 *   import { getSql } from "@/lib/db";
 *   import { authMiddleware } from "@/lib/auth/middleware";
 *
 *   export const listTodos = createServerFn({ method: "GET" })
 *     .middleware([authMiddleware])
 *     .handler(async ({ context }) => {
 *       const sql = await getSql();
 *       return sql`select * from todos where user_id = ${context.userId}`;
 *     });
 *
 * Используйте его на каждой серверной функции, трогающей per-user данные, и
 * скоупите каждый запрос по `context.userId`. Первый запрос браузера ставит
 * куку ответом самого serverFn — но параллельные вызовы до получения куки
 * могут наминтить по uuid каждый (записи-сироты безвредны, см.
 * identity.server.ts).
 */
export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    // ONLY import `*.server` modules here. This file is dual client/server
    // (его клиентская половина — просто pass-through), поэтому серверные
    // модули тянутся динамически: иначе Vite утащил бы
    // `@tanstack/react-start/server` (Node AsyncLocalStorage) в браузерную
    // сборку, и приложение падало бы с "AsyncLocalStorage is not a
    // constructor".
    const { assertSameSiteRequest } = await import("./isolation.server");
    const { requireUserId } = await import("./identity.server");
    // Сначала same-site сторож: скриптовый кросс-сайтовый запрос отсекается
    // ДО того, как мы заведём анонимную личность чужому запросу.
    assertSameSiteRequest();
    const userId = await requireUserId();
    return next({ context: { userId } });
  },
);
