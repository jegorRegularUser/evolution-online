import { it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { setImmediate } from "node:timers/promises";
import ts from "typescript";
import type { NetHooks, NetSession } from "./session.ts";
import type { ChatMessage, ReactionMessage } from "./shared.ts";

// Компилируем настоящий драйвер: strip-only не поддерживает parameter properties,
// а API зависит от сборщика TanStack. Подменяем только транспорт и таймеры.
const source = ts.transpileModule(
  readFileSync(new URL("./session.ts", import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
).outputText;

type Request = { data: { sinceChatId?: number; sinceReactionId?: number } };
type Message = ChatMessage | ReactionMessage;

function harness(kind: "chat" | "reaction") {
  const message = (id: number): Message => kind === "chat"
    ? { id, seat: 0, name: "Игрок", text: String(id), at: id }
    : { id, name: "Игрок", emoji: "\u{1F525}", kind: "reaction", targetSeat: null, chatId: null, at: id };
  const history = [message(101)];
  const requests: Request["data"][] = [];
  const batches: number[][] = [];
  const visible = new Map<number, Message>();
  const timers = new Map<number, { callback: () => void; delay: number }>();
  let timerId = 0;
  let ack: { ok: true; message: Message; reaction: Message } | { ok: false; error: string };
  const own = message(103);
  ack = { ok: true, message: own, reaction: own };
  const send = async () => {
    if (ack.ok) history.push(own);
    return ack;
  };
  const api = {
    netJoinRoom: async () => ({ ok: true, token: "token", waiting: false }),
    netChat: send,
    netReaction: send,
    netPoll: async ({ data }: Request) => {
      requests.push(data);
      const cursor = kind === "chat" ? data.sinceChatId : data.sinceReactionId;
      const messages = history.filter((m) => m.id > (cursor ?? 0));
      return {
        ok: true, unchanged: true, seats: [], hostSeat: 0, capacity: 2,
        waiters: [], spectators: [],
        chat: kind === "chat" ? messages : [],
        reactions: kind === "reaction" ? messages : [],
      };
    },
  };
  const exports = {} as { NetSession: typeof NetSession };
  runInNewContext(source, {
    exports,
    require: (name: string) => {
      assert.equal(name, "./api");
      return api;
    },
    setTimeout: (callback: () => void, delay: number) => {
      timers.set(++timerId, { callback, delay });
      return timerId;
    },
    clearTimeout: (id: number) => timers.delete(id),
  });
  const receive = (messages: Message[]) => {
    batches.push(Array.from(messages, (m) => m.id));
    // Как в store: эхо допустимо в хуке, но не создаёт второе отображение.
    for (const m of messages) if (!visible.has(m.id)) visible.set(m.id, m);
  };
  const noop = () => {};
  const hooks: NetHooks = {
    onSnapshot: noop, onSeats: noop, onStatus: noop, onEvents: noop,
    onChat: receive, onReactions: receive, onSpectatorSnapshot: noop,
    onSpectators: noop, onWaiting: noop, onFatal: noop,
  };
  const session = new exports.NetSession(hooks);
  return {
    session, requests, batches, visible, timers,
    addForeign: () => history.push(message(102)),
    rejectSend: () => { ack = { ok: false, error: "Отказ" }; },
    send: () => kind === "chat"
      ? session.sendChat("103")
      : session.sendReaction("\u{1F525}", "reaction"),
    cursor: () => {
      const data = requests.at(-1)!;
      return kind === "chat" ? data.sinceChatId : data.sinceReactionId;
    },
    async poll() {
      assert.equal(timers.size, 1);
      const [id, timer] = timers.entries().next().value!;
      timers.delete(id);
      timer.callback();
      await setImmediate();
    },
  };
}

for (const kind of ["chat", "reaction"] as const) {
  it(`${kind}: ACK не перескакивает чужое сообщение между кадрами`, async (t) => {
    const h = harness(kind);
    t.after(() => h.session.stop());
    await h.session.join("TEST", "Игрок");
    await h.poll();
    assert.deepEqual(h.batches, [[101]]);
    h.addForeign(); // 102 уже на сервере, но ещё не было в кадре; наш ACK — 103.
    assert.equal(await h.send(), null);
    assert.deepEqual(h.batches, [[101], [103]], "ACK сразу вызывает хук ровно один раз");
    const delayAfterAck = [...h.timers.values()][0]?.delay;
    await h.poll();
    assert.equal(h.cursor(), 101, "ACK не должен продвигать курсор с 101 до 103");
    assert.deepEqual(h.batches, [[101], [103], [102, 103]]);
    assert.deepEqual([...h.visible.keys()], [101, 103, 102]);
    assert.equal(delayAfterAck, 0, "после ACK запланирован немедленный poll");
    await h.poll();
    assert.equal(h.cursor(), 103, "курсор продвинулся из кадра, не из ACK");
    assert.equal(h.batches.length, 3, "пустой кадр не вызывает хук");
  });

  it(`${kind}: отказ не отображается и не ускоряет poll`, async (t) => {
    const h = harness(kind);
    t.after(() => h.session.stop());
    await h.session.join("TEST", "Игрок");
    await h.poll();
    const timerBefore = [...h.timers.keys()];
    h.rejectSend();
    assert.equal((await h.send())?.error, "Отказ");
    assert.deepEqual(h.batches, [[101]]);
    assert.deepEqual([...h.timers.keys()], timerBefore);
  });

  it(`${kind}: ACK после stop не отображается и не запускает poll`, async () => {
    const h = harness(kind);
    await h.session.join("TEST", "Игрок");
    await h.poll();
    const pending = h.send();
    h.session.stop();
    assert.equal(await pending, null);
    assert.deepEqual(h.batches, [[101]]);
    assert.equal(h.timers.size, 0);
  });
}
