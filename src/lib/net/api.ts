/**
 * Клиентские вызовы сетевого слоя: createServerFn-обёртки над сервисом
 * комнат. Ошибки сервиса (NetError) отдаются полем `error`, а не броском —
 * чтобы текст доходил до UI без разбора формата ошибок TanStack Start.
 * Машиночитаемый `code` (kicked/seat-taken/room-gone) позволяет сессии
 * отличить «чинить связь» от «места больше нет».
 */
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import {
  actionInput,
  botsInput,
  capacityInput,
  chatInput,
  codeTokenInput,
  createRoomInput,
  joinRoomInput,
  kickInput,
  kickWaiterInput,
  listRoomsInput,
  pollInput,
  reactionInput,
  roomInfoInput,
  setColorInput,
  setPasswordInput,
  setRoomPrivacyInput,
  settingsInput,
  setNameInput,
  spectateInput,
  spectatorPollInput,
  transferHostInput,
  typingInput,
} from "./shared";
import { getRoomService, NetError } from "./server";

/**
 * Похоже ли это на NetError. instanceof в dev ненадёжен: serverFn собирается
 * в отдельный SSR-модуль, и класс из него — ДРУГОЙ экземпляр, чем импорт
 * api.ts (в HMR-средах их вообще несколько). Имя класса переживает всё.
 */
function isNetErrorLike(e: unknown): e is { message: string; code: string } {
  return (
    typeof e === "object" &&
    e !== null &&
    (e instanceof NetError || (e as { name?: unknown }).name === "NetError") &&
    typeof (e as { code?: unknown }).code === "string"
  );
}

const fail = (e: unknown) => ({
  ok: false as const,
  error:
    e instanceof Error ? e.message : "Сеть недоступна, попробуйте ещё раз",
  // Код обязателен даже у не-NetError: сериализатор serverFn выбрасывает поля
  // со значением undefined, и клиент терял код ошибки — не мог перевести её
  // на свой язык («generic» просто покажет исходный текст, как и раньше).
  code: isNetErrorLike(e) ? e.code : ("generic" as const),
});

/**
 * S10: тот же same-site сторож, что у auth-middleware
 * (src/lib/auth/middleware.ts → assertSameSiteRequest): скриптовый
 * кросс-сайтовый POST отсекается до создания комнат и записи в БД. Браузер
 * своего origin и не-браузерные клиенты (QA-скрипты без Sec-Fetch-*) проходят;
 * isolation.server — серверный модуль (AsyncLocalStorage), поэтому импорт
 * динамический внутри .server() колбэка: в клиентскую сборку не попадает.
 */
const sameSiteGuard = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { assertSameSiteRequest } = await import("../auth/isolation.server");
  assertSameSiteRequest();
  return next();
});

/**
 * Источник запроса для мягких лимитов S2/S7: IP из заголовков прокси, иначе
 * адрес сокета. getRequestIP серверный — импорт динамический; без контекста
 * запроса (сборка, тесты) источник «local», лимиты от него не зависят.
 */
async function requestSource(): Promise<string> {
  try {
    const { getRequestIP } = await import("@tanstack/react-start/server");
    return getRequestIP({ xForwardedFor: true }) || "local";
  } catch {
    return "local";
  }
}

export const netCreateRoom = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(createRoomInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, ...(await s.create(data, await requestSource())) };
    } catch (e) {
      return fail(e);
    }
  });

export const netJoinRoom = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(joinRoomInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return {
        ok: true as const,
        code: data.code,
        ...(await s.join(data, await requestSource())),
      };
    } catch (e) {
      return fail(e);
    }
  });

/**
 * Список столов для главного меню: живые комнаты, включая закрытые (по флагу
 * isPrivate меню делит их на колонки), без токенов и паролей. Поллинг — раз
 * в несколько секунд.
 */
export const netListRooms = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(listRoomsInput)
  .handler(async () => {
    try {
      const s = await getRoomService();
      return { ok: true as const, rooms: await s.listRooms() };
    } catch (e) {
      return fail(e);
    }
  });

export const netRejoin = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(codeTokenInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return {
        ok: true as const,
        snapshot: await s.rejoin(data.code, data.token, await requestSource()),
      };
    } catch (e) {
      return fail(e);
    }
  });

export const netSetBots = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(botsInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.setBots(data);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

export const netKick = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(kickInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.kick(data.code, data.token, data.seat);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

export const netSetCapacity = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(capacityInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.setCapacity(data.code, data.token, data.capacity);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

export const netSetSettings = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(settingsInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.setSettings(data.code, data.token, data.settings);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

/** Доступ к столу: открытый/приватный и (опционально) новый пароль. */
export const netSetRoomPrivacy = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(setRoomPrivacyInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      const r = await s.setRoomPrivacy(data.code, data.token, data.isPrivate, data.regenerate);
      return { ok: true as const, ...r };
    } catch (e) {
      return fail(e);
    }
  });

/**
 * Смена пароля стола: только хост, только в лобби. Вход в стол по новому
 * паролю — обычный netJoinRoom; приватность вызов не меняет.
 */
export const netSetPassword = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(setPasswordInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, ...(await s.setPassword(data.code, data.token, data.password)) };
    } catch (e) {
      return fail(e);
    }
  });

/** Смена цвета своего места (только лобби, только из палитры). */
export const netSetColor = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(setColorInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, ...(await s.setColor(data.code, data.token, data.color)) };
    } catch (e) {
      return fail(e);
    }
  });

export const netTransferHost = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(transferHostInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.transferHost(data.code, data.token, data.seat);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

export const netKickWaiter = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(kickWaiterInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.kickWaiter(data.code, data.token, data.index);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

/** Поллинг лобби для ожидающего: статус, места, очередь, свободное место. */
export const netRoomInfo = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(roomInfoInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return {
        ok: true as const,
        info: await s.waiterInfo(data.code, data.token, data.sinceChatId),
      };
    } catch (e) {
      return fail(e);
    }
  });

/** Занять освободившееся место из очереди (одним действием). */
export const netClaimSeat = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(codeTokenInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, ...(await s.claimSeat(data.code, data.token)) };
    } catch (e) {
      return fail(e);
    }
  });

export const netLeaveQueue = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(codeTokenInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.leaveQueue(data.code, data.token);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

/** Сдаться: место и имя остаются до конца партии, ходы пропускаются. */
export const netResign = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(codeTokenInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, snapshot: await s.resign(data.code, data.token) };
    } catch (e) {
      return fail(e);
    }
  });

/** Смена имени до старта партии (или в очереди/зрителем). */
export const netSetName = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(setNameInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, ...(await s.setName(data.code, data.token, data.name)) };
    } catch (e) {
      return fail(e);
    }
  });

export const netChat = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(chatInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, message: await s.chat(data.code, data.token, data.text) };
    } catch (e) {
      return fail(e);
    }
  });

export const netSpectate = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(spectateInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return {
        ok: true as const,
        ...(await s.spectate(data.code, data.name, data.password, await requestSource())),
      };
    } catch (e) {
      return fail(e);
    }
  });

export const netSpectatorPoll = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(spectatorPollInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return {
        ok: true as const,
        snapshot: await s.spectatorPoll(
          data.code,
          data.token,
          data.sinceChatId,
          data.sinceReactionId,
        ),
      };
    } catch (e) {
      return fail(e);
    }
  });

export const netReaction = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(reactionInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return {
        ok: true as const,
        reaction: await s.reaction(
          data.code,
          data.token,
          data.emoji,
          data.kind,
          data.targetSeat,
          data.chatId,
        ),
      };
    } catch (e) {
      return fail(e);
    }
  });

/**
 * «Печатает…»: сигнал отправляется при наборе текста (с троттлингом у клиента),
 * факт живёт ~4 секунды и виден остальным в SeatInfo/WaiterInfo/SpectatorInfo.
 */
export const netTyping = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(typingInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.typing(data.code, data.token);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });

export const netStart = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(codeTokenInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, snapshot: await s.start(data.code, data.token) };
    } catch (e) {
      return fail(e);
    }
  });

export const netAction = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(actionInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return {
        ok: true as const,
        snapshot: await s.action(data.code, data.token, data.action),
      };
    } catch (e) {
      return fail(e);
    }
  });

export const netPoll = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(pollInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      const r = await s.poll(
        data.code,
        data.token,
        data.sinceVersion,
        data.sinceChatId,
        data.sinceReactionId,
      );
      return { ok: true as const, ...r };
    } catch (e) {
      return fail(e);
    }
  });

export const netAgain = createServerFn({ method: "POST" })
  .middleware([sameSiteGuard])
  .validator(codeTokenInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      await s.again(data);
      return { ok: true as const };
    } catch (e) {
      return fail(e);
    }
  });
