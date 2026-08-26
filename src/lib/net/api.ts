/**
 * Клиентские вызовы сетевого слоя: createServerFn-обёртки над сервисом
 * комнат. Ошибки сервиса (NetError) отдаются полем `error`, а не броском —
 * чтобы текст доходил до UI без разбора формата ошибок TanStack Start.
 */
import { createServerFn } from "@tanstack/react-start";
import {
  actionInput,
  botsInput,
  codeTokenInput,
  createRoomInput,
  joinRoomInput,
  pollInput,
} from "./shared";
import { getRoomService, NetError } from "./server";

const fail = (e: unknown) => ({
  ok: false as const,
  error:
    e instanceof NetError || e instanceof Error
      ? e.message
      : "Сеть недоступна, попробуйте ещё раз",
});

export const netCreateRoom = createServerFn({ method: "POST" })
  .validator(createRoomInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, ...(await s.create(data)) };
    } catch (e) {
      return fail(e);
    }
  });

export const netJoinRoom = createServerFn({ method: "POST" })
  .validator(joinRoomInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, code: data.code, ...(await s.join(data)) };
    } catch (e) {
      return fail(e);
    }
  });

export const netRejoin = createServerFn({ method: "POST" })
  .validator(codeTokenInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      return { ok: true as const, snapshot: await s.rejoin(data.code, data.token) };
    } catch (e) {
      return fail(e);
    }
  });

export const netSetBots = createServerFn({ method: "POST" })
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

export const netStart = createServerFn({ method: "POST" })
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
  .validator(pollInput)
  .handler(async ({ data }) => {
    try {
      const s = await getRoomService();
      const r = await s.poll(data.code, data.token, data.sinceVersion);
      return { ok: true as const, ...r };
    } catch (e) {
      return fail(e);
    }
  });

export const netAgain = createServerFn({ method: "POST" })
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
