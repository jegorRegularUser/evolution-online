/**
 * Чистые авто-шаги поверх движка: что делает «автопилот» за бота/сдавшегося
 * и в автофазах, когда наступил его черед. Переехали из src/lib/net/server.ts
 * (фундамент кампании-рогалика): локальный хост матча кампании ведёт партию
 * той же логикой, что серверная комната, а server.ts — не место для чистых
 * функций (клиентский бандл не должен тянуть сетевой серверный модуль).
 *
 * Функции детерминированы над GameState: тот же стейт → тот же шаг. Это
 * контракт и для будущего кооп-хостинга забега на сервере.
 */
import type { GameAction, GameState, Player } from "./types.ts";
import { currentActor, legalDefenseActions, legalDevActions, legalFeedActions } from "./engine.ts";
import { chooseAIAction } from "./ai.ts";

/**
 * Авто-завершение хода: в развитие это пас, в защите — отказ, в питании —
 * именно завершение ХОДА (feedEndTurn), а не пас до конца фазы: игрок не
 * теряет следующий ход раунда, если к нему снова появятся действия (то же,
 * что кнопка «Закончить ход» в доке). feedSkip в «Растениях» бывает и
 * запрещён.
 */
export function endTurnStepFor(state: GameState, _actorId: number): GameAction {
  if (state.phase === "development") return { type: "devPass" };
  if (state.pendingAttack) {
    if (state.pendingAttack.choosingPlantDefense) return legalDefenseActions(state, state.pendingAttack.waitingFor)[0]!;
    return { type: "chooseDefense", kind: "none" };
  }
  return { type: "feedEndTurn" };
}

/**
 * Шаг за сдавшегося: тот же набор, но в питании — пас до конца фазы (feedSkip):
 * сдавшийся не должен возвращаться в круг, даже если еда ещё осталась.
 */
function resignedStepFor(state: GameState): GameAction {
  if (state.phase === "development") return { type: "devPass" };
  if (state.pendingAttack) {
    if (state.pendingAttack.choosingPlantDefense) return legalDefenseActions(state, state.pendingAttack.waitingFor)[0]!;
    return { type: "chooseDefense", kind: "none" };
  }
  return { type: "feedSkip" };
}

/**
 * У ходящего человека не осталось осмысленных действий — доступны только
 * завершение хода/пас, а в защите единственный вариант «не защищаться».
 * Боты и сдавшиеся не в счёт: у них свои автошаги. Пока есть хоть одно
 * действие (карта, еда, охота, защита) — таймера нет (решение владельца Q2).
 */
export function noChoicesLeft(state: GameState, actor: Player): boolean {
  if (actor.isAI || actor.resigned) return false;
  if (state.pendingAttack) {
    return legalDefenseActions(state, actor.id).every(
      (a) => a.type === "chooseDefense" && a.kind === "none",
    );
  }
  if (state.phase === "development") {
    return legalDevActions(state, actor.id).every((a) => a.type === "devPass");
  }
  if (state.phase === "feeding") {
    return legalFeedActions(state, actor.id).every(
      (a) => a.type === "feedEndTurn" || a.type === "feedSkip",
    );
  }
  return false;
}

/** Следующий шаг, который делает автопилот; null — ждём ход человека. */
export function nextAutoStep(state: GameState): GameAction | null {
  if (state.phase === "foodBank") {
    return state.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" };
  }
  if (state.phase === "extinction") return { type: "continueExtinction" };
  if (state.phase === "growth") return { type: "continueGrowth" };
  const actor = currentActor(state);
  if (!actor) return null;
  // Сдавшийся не ходит: место и имя остаются, но автопилот сам пасует и
  // пропускает питание за него — животные гибнут от голода в вымирание.
  if (actor.resigned && !actor.isAI) return resignedStepFor(state);
  // «Трава и грибы»: раунд безумца проводит сосед справа — логика ботов.
  if (!actor.isAI && state.madTurn !== actor.id) return null;
  const pick = chooseAIAction(state);
  if (pick) return pick;
  // Страховка от зависания: у бота всегда есть пас/скип/сдаться.
  return state.phase === "development" ? { type: "devPass" } : resignedStepFor(state);
}
