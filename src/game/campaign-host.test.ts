import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createCampaignRun } from "./campaign-run.ts";
import { CampaignHost, speedFactorOf, type CampaignHostHooks } from "./campaign-host.ts";
import { createGame, legalDefenseActions, legalDevActions, legalFeedActions } from "./engine.ts";
import type { GameAction, GameState } from "./types.ts";

/**
 * Локальный хост матча кампании: награды забега доходят до раздачи (humanBoons),
 * стол получает персональный вид без чужой руки, а автопилот доводит партию
 * до финала. Тайминг в тесте сжат: setTimeout подменяется на 0 мс — контур
 * тот же, скорость другая (паузы — только темп показа, стейт не трогают).
 */

const realSetTimeout = globalThis.setTimeout.bind(globalThis);
function fastTimers(): void {
  (globalThis as { setTimeout: typeof setTimeout }).setTimeout = ((cb: () => void) =>
    realSetTimeout(cb, 0) as unknown as ReturnType<typeof setTimeout>) as unknown as typeof setTimeout;
}
function restoreTimers(): void {
  (globalThis as { setTimeout: typeof setTimeout }).setTimeout = realSetTimeout as unknown as typeof setTimeout;
}

describe("campaign-host: награды забега в раздаче", () => {
  it("handBonus добавляет карты, startTraits кладёт гарантированное свойство", () => {
    const run = createCampaignRun("cambrian");
    run.stash.handBonus = 2;
    run.stash.startTraits = ["burrowing"];
    const node = run.nodes[run.currentNodeId]!;
    let view: GameState | null = null;
    const host = CampaignHost.startNode(run, node, "Тест", "Дарвин", {
      onFrame: (v) => {
        view = v;
      },
      onFinished: () => {},
      onPersist: () => {},
    }, 1);
    assert.ok(host);
    const full = host.matchState();
    const me = full.players[0]!;
    const opp = full.players[1]!;
    // Стартовая рука по 6: своя = 6 + 2 бонуса + 1 гарантированная карта.
    assert.equal(me.hand.length, opp.hand.length + 3);
    assert.ok(me.hand.some((c) => c.faces.includes("burrowing")), "гарант-свойства нет в руке");
    // Соперник в виде стора руки не получает — вид персоны. Присваивание
    // случилось в колбэке, TS его не видит — снимаем сужение явно.
    const v = view as GameState | null;
    assert.ok(v);
    assert.equal(v.players[1]!.hand.length, 0);
    assert.equal(v.players[1]!.handCount, opp.hand.length);
    host.stop();
  });

  it("createGame без наград не меняет раздачу", () => {
    const plain = createGame(2, "easy", 42);
    assert.equal(plain.players[0]!.hand.length, plain.players[1]!.hand.length);
    assert.equal(plain.scenario, undefined);
  });
});

/** Ход человека для самоигры: агрессивно, чтобы партия сходилась быстрее. */
function humanAction(state: GameState): GameAction | null {
  if (state.pendingAttack) {
    return legalDefenseActions(state, 0)[0] ?? null;
  }
  if (state.phase === "development") {
    const dev = legalDevActions(state, 0);
    if (!dev.length) return null;
    // Пас — только когда других действий нет: играть карты быстрее конца.
    return dev.find((a) => a.type !== "devPass") ?? dev[0]!;
  }
  if (state.phase === "feeding") {
    const feed = legalFeedActions(state, 0);
    if (!feed.length) return null;
    return feed.find((a) => a.type !== "feedEndTurn" && a.type !== "feedSkip") ?? feed[0]!;
  }
  return null; // автофазы — работа автопилота
}

describe("campaign-host: самоигра до финала", () => {
  it("матч доходит до gameOver; кадры, персист и финал на месте", async () => {
    fastTimers();
    try {
      const run = createCampaignRun("cambrian");
      const node = run.nodes[run.currentNodeId]!;
      let frames = 0;
      let persisted = 0;
      let finished: { won: boolean } | null = null;
      const hooks: CampaignHostHooks = {
        onFrame: () => {
          frames += 1;
        },
        onPersist: () => {
          persisted += 1;
        },
        onFinished: (won) => {
          finished = { won };
        },
      };
      const host = CampaignHost.startNode(run, node, "Тест", "Дарвин", hooks, speedFactorOf("fast"));
      assert.ok(host);
      // Ход человека подставляем из цикла (не из onFrame — иначе рекурсия);
      // автошаги ботов/автофаз идут через событийный цикл (setTimeout(0)).
      const deadline = Date.now() + 60_000;
      while (!finished && Date.now() < deadline) {
        const full = host.matchState();
        const actor = full.players[full.currentPlayerId];
        const action = actor && !actor.isAI && !actor.resigned && full.phase !== "gameOver" ? humanAction(full) : null;
        if (action) {
          host.act(action);
          continue;
        }
        // Автошаг/ход бота: отдаём событийный цикл таймерам хоста.
        await new Promise((resolve) => realSetTimeout(resolve, 2));
      }
      assert.ok(finished, "матч не дошёл до финала за отведённое время");
      assert.ok(frames > 10, "кадров подозрительно мало");
      assert.ok(persisted >= frames, "персист отстаёт от кадров");
      host.stop();
    } finally {
      restoreTimers();
    }
  });
});
