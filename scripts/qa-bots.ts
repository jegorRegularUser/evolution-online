/**
 * Проверка игрового бота: партии «ИИ против ИИ» целиком в движке, без браузера.
 * Запуск: node --experimental-strip-types scripts/qa-bots.ts
 *
 * Показывает силу бота и здоровье экономики стола: доходят ли партии до финала,
 * не зависают ли, сколько животных/еды/охот и какая доля пасов. Регрессия, от
 * которой этот скрипт завёл: бот разводил животных больше, чем стол прокормит,
 * вымирал в ноль и партии на 2–3 игроков заканчивались счётом 0:0.
 */
import { chooseAIAction } from "../src/game/ai.ts";
import { applyAction } from "../src/game/engine.ts";
import { createGame } from "../src/game/engine.ts";
import type { GameAction, GameState } from "../src/game/types.ts";

const GAMES = Number(process.env.BOT_GAMES ?? 12);
const MAX_STEPS = 20_000;

interface Row {
  players: number;
  finished: boolean;
  steps: number;
  years: number;
  scores: number[];
  passShare: number;
  per: { actions: number; passes: number; animals: number; food: number; hunts: number };
}

const rows: Row[] = [];

for (let g = 0; g < GAMES; g++) {
  const players = 2 + (g % 3); // 2, 3, 4
  let state: GameState = createGame(players, "normal", `bot-${g}`, undefined, {}, undefined);
  const per = { actions: 0, passes: 0, animals: 0, food: 0, hunts: 0 };
  let steps = 0;
  let finished = false;

  /** Авто-фазы ведёт клиент (в сторе это tickAI), не ИИ игроков. */
  const autoAction = (st: GameState): GameAction | null => {
    if (st.phase === "foodBank") return st.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" };
    if (st.phase === "extinction") return { type: "continueExtinction" };
    if (st.phase === "growth") return { type: "continueGrowth" };
    return null;
  };

  let stuckPhase = "";
  while (steps < MAX_STEPS && !finished) {
    const act: GameAction | null = autoAction(state) ?? chooseAIAction(state);
    if (!act) {
      stuckPhase = `${state.phase}/${state.currentPlayerId}`;
      break;
    }
    per.actions += 1;
    if (act.type === "devPass" || act.type === "feedSkip" || act.type === "feedEndTurn") per.passes += 1;
    if (act.type === "devPlayAnimal") per.animals += 1;
    if (act.type === "feedTake" || act.type === "feedTakePlant" || act.type === "feedTakeFlora") per.food += 1;
    if (act.type === "feedHunt") per.hunts += 1;
    state = applyAction(state, act);
    steps += 1;
    if (state.phase === "gameOver") finished = true;
  }

  if (stuckPhase) console.log(`  ⚠ тупик в фазе ${stuckPhase} (шаг ${steps})`);
  const alive = state.players.map((p) => p.animals.length);
  const pops = state.players.map((p) => p.animals.reduce((n, a) => n + (a.population ?? 1), 0));
  console.log(`  состав на финал: животных=${alive.join("/")} особей=${pops.join("/")}`);
  rows.push({
    players,
    finished,
    steps,
    years: state.year,
    scores: (state.scores ?? []).map((s) => s.total ?? 0),
    passShare: per.actions ? per.passes / per.actions : 1,
    per,
  });
}

let stalled = 0;
let unfinished = 0;
let totalScore = 0;
let totalAnimals = 0;
let totalHunts = 0;
let passSum = 0;

for (const r of rows) {
  if (r.steps >= MAX_STEPS) stalled += 1;
  if (!r.finished) unfinished += 1;
  totalScore += r.scores.reduce((a, b) => a + b, 0);
  totalAnimals += r.per.animals;
  totalHunts += r.per.hunts;
  passSum += r.passShare;
  console.log(
    `${r.players}p: финал=${r.finished ? "да" : "НЕТ"} лет=${r.years} шагов=${r.steps} ` +
      `счёт=[${r.scores.join(", ")}] доля пасов=${(r.passShare * 100).toFixed(0)}% ` +
      `животных=${r.per.animals} еды=${r.per.food} охот=${r.per.hunts}`,
  );
}

console.log(
  `ИТОГ: партий=${rows.length}, без финала=${unfinished}, зависших=${stalled}, ` +
    `средний счёт за партию=${(totalScore / rows.length).toFixed(1)}, ` +
    `животных всего=${totalAnimals}, охот всего=${totalHunts}, ` +
    `средняя доля пасов=${((passSum / rows.length) * 100).toFixed(0)}%`,
);
