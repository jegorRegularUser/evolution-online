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
 * Идентичность анонимная: authMiddleware резолвит куку __Host-evo-uid
 * (при первом запросе сам её ставит и заводит строку в "user", см.
 * identity.server.ts) — профиль работает одинаково и на PGlite в dev, и на
 * реальной базе; отдельного входа у приложения нет намеренно.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/middleware";
import { getSql } from "../db";
import { createProfileService, ProfileError } from "./service.server";
import { challengeReportInputSchema, equipInputSchema } from "./shared";

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

/**
 * Мягкий rate-limit endpoints профиля (находка аудита волны 0: их не было).
 * В памяти процесса — защита от спама, не суточная квота; источник запроса
 * тот же, что у сетевого слоя (IP прокси или «local»).
 */
const RATE_MAX = 60;
const RATE_WINDOW_MS = 60_000;
const rateHits = new Map<string, number[]>();
/** Периодическая уборка пустых/протухших ключей: карта не должна расти вечной
 *  (нашло ревью — длинный сессии набивали Map адресами). */
let lastPrune = 0;
function pruneRateHits(nowMs: number): void {
  if (nowMs - lastPrune < RATE_WINDOW_MS) return;
  lastPrune = nowMs;
  for (const [key, hits] of rateHits) {
    const fresh = hits.filter((t) => nowMs - t < RATE_WINDOW_MS);
    if (fresh.length === 0) rateHits.delete(key);
    else rateHits.set(key, fresh);
  }
}

async function allowRequest(): Promise<boolean> {
  let source = "local";
  try {
    const { getRequestIP } = await import("@tanstack/react-start/server");
    source = getRequestIP({ xForwardedFor: true }) || "local";
  } catch {
    // вне запроса (тесты/сборка) — считаем «local», лимит не режет
  }
  const nowMs = Date.now();
  pruneRateHits(nowMs);
  const hits = (rateHits.get(source) ?? []).filter((t) => nowMs - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    rateHits.set(source, hits);
    return false;
  }
  hits.push(nowMs);
  rateHits.set(source, hits);
  return true;
}

/** Полный кадр профиля: баланс «Ископаемых», владение, экипировка. */
export const profileGet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      if (!(await allowRequest())) return { ok: false as const, error: "rate-limited", code: "rate-limited" as const };
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
      if (!(await allowRequest())) return { ok: false as const, error: "rate-limited", code: "rate-limited" as const };
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

/** Покупка предмета за «Ископаемые» (цена и наличие — на сервере). */
export const cosmeticsBuy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ itemId: z.string().min(1).max(64) }))
  .handler(async ({ context, data }) => {
    try {
      if (!(await allowRequest())) return { ok: false as const, error: "rate-limited", code: "rate-limited" as const };
      const service = createProfileService(await getSql());
      return { ok: true as const, ...(await service.buyItem(context.userId, data.itemId)) };
    } catch (e) {
      return fail(e);
    }
  });

/** Прогресс «Вызовов»: накопленные значения + полученные тиры. */
export const challengesGet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      if (!(await allowRequest())) return { ok: false as const, error: "rate-limited", code: "rate-limited" as const };
      const service = createProfileService(await getSql());
      return { ok: true as const, ...(await service.getChallenges(context.userId)) };
    } catch (e) {
      return fail(e);
    }
  });

/**
 * Отчёт партии (вызывает клиент один раз на финале, см. GameApp):
 * прибавляет метрики, оценивает тиры, выдаёт «Ископаемые». Валютных ручек
 * начисления здесь по-прежнему нет — награда следует из отчёта, тир
 * оплачивается один раз, кап в день держит фарма.
 */
export const challengesReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(challengeReportInputSchema)
  .handler(async ({ context, data }) => {
    try {
      if (!(await allowRequest())) return { ok: false as const, error: "rate-limited", code: "rate-limited" as const };
      const service = createProfileService(await getSql());
      return { ok: true as const, ...(await service.reportChallenges(context.userId, data)) };
    } catch (e) {
      return fail(e);
    }
  });
