/**
 * Клиентские вызовы слоя профиля: createServerFn-обёртки над сервисом
 * (волна 0 дизайн-пакета расширения). Контракт ошибок — как у сетевого слоя:
 * { ok: false, error, code } вместо броска, машинный code переводит клиент.
 *
 * Нарочно здесь ТОЛЬКО чтение профиля и экипировка. Начисление/списание
 * валюты и выдача предметов (grantCoins/spendCoins/grantItem) — серверные
 * внутренности сервиса: у них не должно быть клиентской ручки, иначе
 * earned-экономика ломается одним вызовом из консоли. Награды вешают волны
 * 3а (вызовы, «первая победа дня») и 3б (магазин) на серверный код.
 *
 * Без авторизации: authMiddleware с выключенным auth и пустым DATABASE_URL
 * подставляет dev-пользователя ('dev-user') — локальная разработка работает
 * против PGlite; на реальной базе с выключенным auth запросы падают
 * fail-closed (см. verify.server.ts) — это ожидаемое поведение, а не баг.
 */
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/middleware";
import { getSql } from "../db";
import { createProfileService, ProfileError } from "./service.server";
import { equipInputSchema } from "./shared";

/**
 * Похоже ли это на ProfileError. instanceof в dev ненадёжен: serverFn
 * собирается в отдельный SSR-модуль, и класс из него — ДРУГОЙ экземпляр
 * (тот же класс проблем, что у NetError в net/api.ts — переживает имя).
 */
function isProfileErrorLike(e: unknown): e is { message: string; code: string } {
  return (
    typeof e === "object" &&
    e !== null &&
    (e instanceof ProfileError || (e as { name?: unknown }).name === "ProfileError") &&
    typeof (e as { code?: unknown }).code === "string"
  );
}

const fail = (e: unknown) => {
  if (isProfileErrorLike(e)) {
    return { ok: false as const, error: e.message, code: e.code };
  }
  // Zod-дампы и runtime-тексты игроку не показываем: нет безопасного кода.
  return { ok: false as const, error: "invalidResponse", code: "invalidResponse" as const };
};

/** Полный кадр профиля: баланс «Ископаемых», владение, экипировка. */
export const profileGet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const service = createProfileService(await getSql());
      return { ok: true as const, ...(await service.getProfile(context.userId)) };
    } catch (e) {
      return fail(e);
    }
  });

/** Экипировать предмет в слот; itemId === null — снять экипировку слота. */
export const cosmeticsEquip = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(equipInputSchema)
  .handler(async ({ context, data }) => {
    try {
      const service = createProfileService(await getSql());
      if (data.itemId === null) {
        await service.unequipSlot(context.userId, data.slot);
      } else {
        await service.equipItem(context.userId, data.slot, data.itemId);
      }
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });
