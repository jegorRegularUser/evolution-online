import { BookOpen, List, Pause } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TRAITS } from "@/game/traits";
import type { Animal, GameAction, GameSpeed, GameState, Player, TraitId } from "@/game/types";
import { currentActor, legalDefenseActions, legalDevActions, legalFeedActions } from "@/game/engine";
import { canAttack, canReceiveFood, findAnimal, foodNeeded, hasTrait, player } from "@/game/queries";
import { cn } from "@/lib/utils";
import { BG, LOGO, PHASE_ICON, TOKEN } from "@/lib/art";
import { loadSpeed, useGameStore, type UiIntent } from "@/store/game-store";
import { AnimalCard, HandCard } from "./cards";
import { Die } from "./icons";
import { LobbyScreen } from "./net-screens";
import { GameOverScreen, MenuScreen, RulesPanel } from "./screens";

const PHASE_LABEL: Record<string, string> = {
  development: "Развитие",
  foodBank: "Кормовая база",
  feeding: "Питание",
  extinction: "Вымирание",
  gameOver: "Итог",
};

const SPEED_LABEL: Record<GameSpeed, string> = {
  slow: "Медленно",
  normal: "Обычно",
  fast: "Быстро",
};

interface Interaction {
  highlight: boolean;
  dimmed: boolean;
  selected: boolean;
}

const NO_INTERACTION: Interaction = { highlight: false, dimmed: false, selected: false };

// ── Визуальные эффекты событий партии ────────────────────────────────────────

interface FxBadge {
  id: number;
  x: number;
  y: number;
  text: string;
  tone: "attack" | "good" | "bad" | "info";
}

const FX_TONE: Record<FxBadge["tone"], string> = {
  attack: "border-danger/70 bg-danger/25 text-clay",
  good: "border-good/60 bg-good/25 text-good",
  bad: "border-danger/60 bg-danger/15 text-clay",
  info: "border-border-strong bg-surface text-fg",
};

function shakeEl(el: Element | null) {
  if (!el) return;
  el.classList.remove("anim-shake");
  // Перезапуск анимации, если элемент уже трясся на этом кадре.
  void (el as HTMLElement).offsetWidth;
  el.classList.add("anim-shake");
  setTimeout(() => el.classList.remove("anim-shake"), 600);
}

/**
 * Читает события последнего действия и превращает их в живую картинку:
 * всплывающие бейджи над местом события и встряску участников атаки.
 * Бейджи живут ~1.7 с и удаляются сами.
 */
function useActionFx(state: GameState | null): FxBadge[] {
  const [badges, setBadges] = useState<FxBadge[]>([]);
  const seqRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    if (!state || state.eventSeq === seqRef.current) return;
    seqRef.current = state.eventSeq;

    const anchorOf = (el: Element | null): { x: number; y: number } => {
      if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 3 };
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + 6) };
    };
    const animalEl = (id: string) => document.querySelector(`[data-animal-id="${id}"]`);
    const sectionEl = (id: number) => document.querySelector(`[data-player-section="${id}"]`);

    const created: FxBadge[] = [];
    const push = (point: { x: number; y: number }, text: string, tone: FxBadge["tone"]) => {
      idRef.current += 1;
      created.push({ id: idRef.current, ...point, text, tone });
    };

    for (const e of state.lastEvents) {
      switch (e.kind) {
        case "huntDeclared": {
          shakeEl(animalEl(e.carnivoreId));
          shakeEl(animalEl(e.preyId));
          push(anchorOf(animalEl(e.preyId) ?? animalEl(e.carnivoreId)), "Атака!", "attack");
          break;
        }
        case "preyKilled":
          push(anchorOf(animalEl(e.carnivoreId)), "добыча съедена +2", "attack");
          break;
        case "defenseUsed": {
          const prey = animalEl(e.preyId);
          if (e.defense === "tailLoss") {
            shakeEl(prey);
            push(anchorOf(prey), "− хвост", "bad");
          } else if (e.defense === "running") {
            shakeEl(prey);
            push(anchorOf(prey), `кубик ${e.roll}`, "info");
          } else if (e.defense === "mimicry") {
            push(anchorOf(prey), "мимикрия →", "info");
          }
          break;
        }
        case "foodFromBank":
          push(anchorOf(animalEl(e.animalId)), "+1", "good");
          break;
        case "blueFood":
          if (e.reason === "piracy") push(anchorOf(animalEl(e.animalId)), "пиратство +1", "info");
          break;
        case "bankBurned":
          push(anchorOf(document.querySelector(".felt")), `−${e.amount} база`, "bad");
          break;
        case "cardsDrawn": {
          for (let i = 0; i < e.counts.length; i++) {
            const n = e.counts[i]!;
            if (n > 0) push(anchorOf(sectionEl(i)), `+${n} ${n === 1 ? "карта" : n < 5 ? "карты" : "карт"}`, "info");
          }
          break;
        }
        default:
          break;
      }
    }

    if (state.lastEvents.some((e) => e.kind === "animalDied")) {
      const felt = document.querySelector(".felt");
      if (felt) {
        const deaths = state.lastEvents.filter((e) => e.kind === "animalDied").length;
        push(anchorOf(felt), `☠ ${deaths}`, "bad");
        felt.classList.remove("anim-felt-flash");
        void (felt as HTMLElement).offsetWidth;
        felt.classList.add("anim-felt-flash");
        setTimeout(() => felt.classList.remove("anim-felt-flash"), 1000);
      }
    }

    if (created.length) {
      setBadges((prev) => [...prev, ...created]);
      const ids = new Set(created.map((c) => c.id));
      setTimeout(() => setBadges((prev) => prev.filter((b) => !ids.has(b.id))), 1750);
    }
  }, [state]);

  return badges;
}

export function GameApp() {
  const state = useGameStore((s) => s.state);
  // Скорость из localStorage подмешиваем после гидратации, чтобы SSR-разметка
  // всегда совпадала с первым клиентским рендером.
  useEffect(() => {
    const saved = loadSpeed();
    if (saved !== "normal") useGameStore.getState().setSpeed(saved);
  }, []);
  const rulesOpen = useGameStore((s) => s.rulesOpen);
  const start = useGameStore((s) => s.start);
  const reset = useGameStore((s) => s.reset);
  const setRulesOpen = useGameStore((s) => s.setRulesOpen);
  const mode = useGameStore((s) => s.mode);
  const net = useGameStore((s) => s.net);
  const netAgain = useGameStore((s) => s.netAgain);
  const leaveNet = useGameStore((s) => s.leaveNet);

  if (mode === "net") {
    if (!net || net.status === "lobby" || net.status === "connecting") {
      return (
        <>
          {net?.status === "connecting" && !state ? (
            <p className="grid min-h-dvh place-items-center text-sm text-muted">Открываем стол…</p>
          ) : (
            <LobbyScreen />
          )}
          {rulesOpen ? <RulesPanel onClose={() => setRulesOpen(false)} /> : null}
        </>
      );
    }
    return (
      <div className="flex min-h-dvh flex-col">
        {net.status === "reconnecting" ? (
          <div className="fixed inset-x-0 top-14 z-40 mx-auto w-fit rounded-full border border-danger/50 bg-danger/15 px-4 py-1.5 text-sm text-clay">
            Переподключение…
          </div>
        ) : null}
        {state ? (
          <Table />
        ) : (
          <p className="grid min-h-dvh place-items-center text-sm text-muted">Загружаем партию…</p>
        )}
        {state?.phase === "gameOver" && state.scores ? (
          <GameOverScreen
            scores={state.scores}
            winnerIds={state.winnerIds ?? []}
            humanId={state.humanId}
            onAgain={() => void netAgain()}
            onMenu={leaveNet}
          />
        ) : null}
        {rulesOpen ? <RulesPanel onClose={() => setRulesOpen(false)} /> : null}
      </div>
    );
  }

  if (!state) {
    return (
      <>
        <MenuScreen onStart={start} onRules={() => setRulesOpen(true)} />
        {rulesOpen ? <RulesPanel onClose={() => setRulesOpen(false)} /> : null}
      </>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Table />
      {state.phase === "gameOver" && state.scores ? (
        <GameOverScreen
          scores={state.scores}
          winnerIds={state.winnerIds ?? []}
          humanId={state.humanId}
          onAgain={() => start(state.players.length, state.difficulty)}
          onMenu={reset}
        />
      ) : null}
      {rulesOpen ? <RulesPanel onClose={() => setRulesOpen(false)} /> : null}
    </div>
  );
}

function Table() {
  const state = useGameStore((s) => s.state)!;
  const thinking = useGameStore((s) => s.thinking);
  const thinkingWho = useGameStore((s) => s.thinkingWho);
  const intent = useGameStore((s) => s.intent);
  const logOpen = useGameStore((s) => s.logOpen);
  const speed = useGameStore((s) => s.speed);
  const dispatch = useGameStore((s) => s.dispatch);
  const setIntent = useGameStore((s) => s.setIntent);
  const setLogOpen = useGameStore((s) => s.setLogOpen);
  const setRulesOpen = useGameStore((s) => s.setRulesOpen);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const reset = useGameStore((s) => s.reset);
  const mode = useGameStore((s) => s.mode);

  const human = player(state, state.humanId);
  const actor = currentActor(state);
  const isHumanTurn = actor?.id === human.id;

  const feedActs = useMemo(
    () => (state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? legalFeedActions(state, human.id) : []),
    [state, isHumanTurn, human.id],
  );
  const devActs = useMemo(
    () => (state.phase === "development" && isHumanTurn ? legalDevActions(state, human.id) : []),
    [state, isHumanTurn, human.id],
  );
  const defActs = useMemo(
    () => (state.pendingAttack && state.pendingAttack.waitingFor === human.id ? legalDefenseActions(state, human.id) : []),
    [state, human.id],
  );

  // Одна развёртка интеракций на кадр вместо двух O(действия×животные) проходов на карточку.
  const interactions = useMemo(() => {
    const map = new Map<string, Interaction>();
    for (const p of state.players) {
      for (const a of p.animals) {
        const hl = animalHighlight(state, a, intent, isHumanTurn, feedActs, devActs);
        map.set(a.id, {
          highlight: hl,
          dimmed: intent.kind !== "none" && !hl,
          selected:
            (intent.kind === "playPair" && intent.first === a.id) ||
            (intent.kind === "hunt" && intent.carnivoreId === a.id) ||
            (intent.kind === "pirate" && intent.pirateId === a.id),
        });
      }
    }
    return map;
  }, [state, intent, isHumanTurn, feedActs, devActs]);
  const getInteraction = useCallback((a: Animal) => interactions.get(a.id) ?? NO_INTERACTION, [interactions]);

  function onBoardClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest("[data-animal-id]");
    if (!target || !isHumanTurn || state.pendingAttack) return;
    const animal = findAnimal(state, target.getAttribute("data-animal-id")!);
    if (!animal) return;
    handleAnimalClick(animal, { state, intent, isHumanTurn, human, feedActs, devActs, dispatch, setIntent });
  }

  const opponents = state.players.filter((p) => p.id !== human.id);
  // Рассадка вокруг поля: 1 соперник — напротив, 2 — по бокам, 3 — сверху и по бокам.
  const seats =
    opponents.length === 1
      ? { top: [opponents[0]!], left: [], right: [] }
      : opponents.length === 2
        ? { top: [], left: [opponents[0]!], right: [opponents[1]!] }
        : { top: [opponents[0]!], left: [opponents[1]!], right: [opponents[2]!] };
  const wideSeats = seats.left.length > 0 || seats.right.length > 0;

  const lastLog = state.log[state.log.length - 1]?.text;
  const dying = useMemo(() => new Set(state.extinctionDeaths), [state.extinctionDeaths]);
  const fx = useActionFx(state);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.09]"
        style={{ backgroundImage: `url(${BG.valley})` }}
      />
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/90 px-3 py-2.5 backdrop-blur-sm sm:px-5">
        <img src={LOGO} alt="" className="size-8 shrink-0 rounded-full border border-border object-cover" />
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg leading-none">Эволюция</div>
          <div className="mt-1 truncate text-xs text-muted">
            Год {state.year}
            {state.lastYear ? " · последний" : ""} · {PHASE_LABEL[state.phase]}
            {actor ? ` · ${actor.name}` : ""}
          </div>
        </div>
        {mode === "solo" ? (
          <div className="hidden items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1 md:flex" role="group" aria-label="Скорость игры">
            {(["slow", "normal", "fast"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSpeed(v)}
                className={cn(
                  "rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors duration-[var(--motion-fast)]",
                  speed === v ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {SPEED_LABEL[v]}
              </button>
            ))}
          </div>
        ) : null}
        <FoodBankChip count={state.foodBank} visible={state.phase === "feeding" || state.phase === "foodBank"} />
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" aria-label="Журнал" onClick={() => setLogOpen(!logOpen)}>
            <List className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Правила" onClick={() => setRulesOpen(true)}>
            <BookOpen className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Меню" onClick={reset}>
            <Pause className="size-4" />
          </Button>
        </div>
      </header>

      {/* Стол: узкое центральное поле-сукно, соперники по бокам без прокрутки, игрок снизу. */}
      <main
        onClick={onBoardClick}
        className={cn(
          "flex flex-1 flex-col gap-3 px-3 py-3 sm:px-5",
          wideSeats
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-4 lg:[grid-template-areas:'top_top_top''left_felt_right''human_human_human']"
            : "lg:mx-auto lg:w-full lg:max-w-4xl",
          state.phase === "extinction" ? "extinction-glow" : "",
        )}
      >
        {seats.top.map((p) => (
          <div key={p.id} style={{ gridArea: "top" }}>
            <PlayerSection
              p={p}
              actorId={actor?.id ?? null}
              thinking={thinking && thinkingWho === p.id}
              interactions={getInteraction}
              dying={dying}
              freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
            />
          </div>
        ))}

        <div style={wideSeats ? { gridArea: "left" } : undefined} className={cn(wideSeats && "lg:min-w-0")}>
          {seats.left.map((p) => (
            <PlayerSection
              key={p.id}
              p={p}
              actorId={actor?.id ?? null}
              thinking={thinking && thinkingWho === p.id}
              interactions={getInteraction}
              dying={dying}
              freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
            />
          ))}
        </div>

        <CenterField
          style={wideSeats ? { gridArea: "felt" } : undefined}
          year={state.year}
          lastYear={state.lastYear}
          phase={state.phase}
          bank={state.foodBank}
          deckLeft={state.deckCount ?? state.deck.length}
          foodRoll={state.foodRoll}
          lastLog={lastLog}
          actorName={actor?.name}
          deaths={state.extinctionDeaths.length}
        />

        <div style={wideSeats ? { gridArea: "right" } : undefined}>
          {seats.right.map((p) => (
            <PlayerSection
              key={p.id}
              p={p}
              actorId={actor?.id ?? null}
              thinking={thinking && thinkingWho === p.id}
              interactions={getInteraction}
              dying={dying}
              freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
            />
          ))}
        </div>

        <PlayerSection
          p={human}
          isHuman
          actorId={actor?.id ?? null}
          thinking={false}
          interactions={getInteraction}
          dying={dying}
          freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
          style={wideSeats ? { gridArea: "human" } : undefined}
        />
      </main>

      {logOpen ? (
        <ol className="fixed inset-x-3 bottom-20 z-30 max-h-44 space-y-1 overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 text-xs text-muted shadow-[var(--shadow-card)] backdrop-blur-sm sm:left-auto sm:right-5 sm:w-96">
          {[...state.log].reverse().slice(0, 24).map((e) => (
            <li
              key={e.id}
              className={cn(
                e.tone === "bad" && "text-clay",
                e.tone === "good" && "text-good",
                e.tone === "hunt" && "text-fg",
              )}
            >
              {e.text}
            </li>
          ))}
        </ol>
      ) : null}

      <footer className="sticky bottom-0 z-20 border-t border-border bg-bg/95 px-3 py-3 backdrop-blur-sm sm:px-5">
        {state.phase === "development" ? (
          <DevDock
            human={human}
            intent={intent}
            disabled={!isHumanTurn || Boolean(state.pendingAttack)}
            onPlayAnimal={(cardId) => dispatch({ type: "devPlayAnimal", cardId })}
            onPickTrait={(cardId, face) => {
              const card = human.hand.find((c) => c.id === cardId);
              const trait = card?.faces[face] as TraitId | undefined;
              if (!trait) return;
              if (TRAITS[trait].isPair) setIntent({ kind: "playPair", cardId, face });
              else setIntent({ kind: "playTrait", cardId, face });
            }}
            onPass={() => dispatch({ type: "devPass" })}
          />
        ) : state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? (
          <FeedDock
            acts={feedActs}
            intentKind={intent.kind}
            bank={state.foodBank}
            onIntent={setIntent}
            onSkip={() => dispatch({ type: "feedSkip" })}
          />
        ) : (
          <div className="flex h-14 items-center justify-center text-sm text-muted">
            {state.phase === "foodBank"
              ? state.foodRoll
                ? "Кубики брошены — кормовая база определяется…"
                : "Бросок кормовой базы…"
              : state.phase === "extinction"
                ? "Вымирание: ненакормленные животные погибают…"
                : mode === "net" && actor && actor.id !== human.id
                  ? `${actor.name} ходит…`
                  : thinking
                    ? `${actor?.name ?? "Соперник"} думает…`
                    : "Ожидание"}
          </div>
        )}
      </footer>

      {fx.map((b) => (
        <div key={b.id} style={{ left: b.x, top: b.y }} className={cn("fx-badge rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[var(--shadow-card)] backdrop-blur-sm", FX_TONE[b.tone])}>
          {b.text}
        </div>
      ))}

      {state.pendingAttack && state.pendingAttack.waitingFor === human.id ? (
        <DefenseDock acts={defActs} onPick={(a) => dispatch(a)} />
      ) : null}
    </>
  );
}

function handleAnimalClick(
  animal: Animal,
  ctx: {
    state: GameState;
    intent: UiIntent;
    isHumanTurn: boolean;
    human: Player;
    feedActs: GameAction[];
    devActs: GameAction[];
    dispatch: (a: GameAction) => void;
    setIntent: (i: UiIntent) => void;
  },
) {
  const { state, intent, human, feedActs, devActs, dispatch, setIntent } = ctx;
  if (state.pendingAttack) return;

  if (state.phase === "development") {
    if (intent.kind === "playTrait") {
      const ok = devActs.some(
        (a) => a.type === "devPlayTrait" && a.cardId === intent.cardId && a.face === intent.face && a.animalId === animal.id,
      );
      if (ok) dispatch({ type: "devPlayTrait", cardId: intent.cardId!, face: intent.face!, animalId: animal.id });
      return;
    }
    if (intent.kind === "playPair") {
      if (!intent.first) {
        if (animal.ownerId !== human.id) return;
        setIntent({ ...intent, first: animal.id });
        return;
      }
      const ok = devActs.some(
        (a) => a.type === "devPlayPair" && a.cardId === intent.cardId && a.a === intent.first && a.b === animal.id,
      );
      if (ok) dispatch({ type: "devPlayPair", cardId: intent.cardId!, face: intent.face!, a: intent.first, b: animal.id });
      return;
    }
    return;
  }

  if (state.phase !== "feeding") return;

  if (intent.kind === "hunt") {
    if (!intent.carnivoreId) {
      if (animal.ownerId === human.id && hasTrait(animal, "carnivore")) {
        setIntent({ kind: "hunt", carnivoreId: animal.id });
      }
      return;
    }
    const ok = feedActs.some((a) => a.type === "feedHunt" && a.carnivoreId === intent.carnivoreId && a.preyId === animal.id);
    if (ok) dispatch({ type: "feedHunt", carnivoreId: intent.carnivoreId, preyId: animal.id });
    return;
  }
  if (intent.kind === "pirate") {
    if (!intent.pirateId) {
      if (animal.ownerId === human.id && hasTrait(animal, "piracy")) {
        setIntent({ kind: "pirate", pirateId: animal.id });
      }
      return;
    }
    const ok = feedActs.some((a) => a.type === "feedPirate" && a.pirateId === intent.pirateId && a.targetId === animal.id);
    if (ok) dispatch({ type: "feedPirate", pirateId: intent.pirateId, targetId: animal.id });
    return;
  }
  if (intent.kind === "hibernate") {
    const ok = feedActs.some((a) => a.type === "feedHibernate" && a.animalId === animal.id);
    if (ok) dispatch({ type: "feedHibernate", animalId: animal.id });
    return;
  }
  if (intent.kind === "fat") {
    const act = feedActs.find((a) => a.type === "feedConvertFat" && a.animalId === animal.id);
    if (act && act.type === "feedConvertFat") dispatch(act);
    return;
  }
  if (intent.kind === "graze") {
    const ok = feedActs.some((a) => a.type === "feedGraze" && a.animalId === animal.id);
    if (ok) dispatch({ type: "feedGraze", animalId: animal.id });
    return;
  }
  if (intent.kind === "take" || intent.kind === "none") {
    const ok = feedActs.some((a) => a.type === "feedTake" && a.animalId === animal.id);
    if (ok) dispatch({ type: "feedTake", animalId: animal.id });
  }
}

function animalHighlight(
  state: GameState,
  animal: Animal,
  intent: UiIntent,
  isHumanTurn: boolean,
  feedActs: GameAction[],
  devActs: GameAction[],
): boolean {
  if (!isHumanTurn) return false;
  if (intent.kind === "playTrait") {
    return devActs.some(
      (a) => a.type === "devPlayTrait" && a.cardId === intent.cardId && a.face === intent.face && a.animalId === animal.id,
    );
  }
  if (intent.kind === "playPair") {
    if (!intent.first) return animal.ownerId === state.humanId;
    return devActs.some((a) => a.type === "devPlayPair" && a.a === intent.first && a.b === animal.id);
  }
  if (state.phase !== "feeding") return false;
  if (intent.kind === "hunt" && intent.carnivoreId) {
    const car = findAnimal(state, intent.carnivoreId);
    return Boolean(car && canAttack(state, car, animal));
  }
  if (intent.kind === "hunt" && !intent.carnivoreId) {
    return animal.ownerId === state.humanId && hasTrait(animal, "carnivore");
  }
  if (intent.kind === "pirate" && intent.pirateId) {
    return feedActs.some((a) => a.type === "feedPirate" && a.targetId === animal.id);
  }
  if (intent.kind === "take" || intent.kind === "none") {
    return animal.ownerId === state.humanId && canReceiveFood(state, animal) && state.foodBank > 0;
  }
  if (intent.kind === "hibernate") {
    return feedActs.some((a) => a.type === "feedHibernate" && a.animalId === animal.id);
  }
  if (intent.kind === "fat") {
    return feedActs.some((a) => a.type === "feedConvertFat" && a.animalId === animal.id);
  }
  if (intent.kind === "graze") {
    return feedActs.some((a) => a.type === "feedGraze" && a.animalId === animal.id);
  }
  return false;
}

/** Табло игрока со его животными. */
const PlayerSection = memo(function PlayerSection({
  p,
  isHuman,
  actorId,
  thinking,
  interactions,
  dying,
  freshSince,
  style,
}: {
  p: Player;
  isHuman?: boolean;
  actorId: number | null;
  thinking?: boolean;
  interactions: (a: Animal) => Interaction;
  dying: Set<string>;
  freshSince?: number;
  style?: React.CSSProperties;
}) {
  const active = actorId === p.id;
  return (
    <section
      style={style}
      data-player-section={p.id}
      className={cn(
        "mb-3 rounded-[var(--radius-lg)] border bg-surface p-3 transition-[border-color,box-shadow] duration-[var(--motion-quick)] lg:mb-0",
        active ? "border-accent/70 shadow-[0_0_0_1px_var(--color-accent),var(--shadow-card)]" : "border-border",
      )}
    >
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          {isHuman ? "Ваша популяция" : p.name}
          {active ? (
            <span className={cn("flex items-center gap-1 text-xs", thinking ? "text-accent" : "text-accent")}>
              <span className={cn("size-1.5 rounded-full bg-accent", thinking && "pulse-dot")} />
              {thinking ? "думает…" : "ходит"}
            </span>
          ) : null}
        </span>
        <span className="text-xs text-muted">
          рука {p.handCount ?? p.hand.length} · сброс {p.discardCount}
        </span>
      </div>
      {p.animals.length === 0 ? (
        <p className="text-xs text-subtle">{isHuman ? "Выложите животное из руки" : "Нет животных"}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {p.animals.map((a) => {
            const it = interactions(a);
            return (
              <AnimalCard
                key={a.id}
                animal={a}
                selected={it.selected}
                highlight={it.highlight}
                dimmed={it.dimmed}
                dying={dying.has(a.id)}
                freshSince={freshSince}
              />
            );
          })}
        </div>
      )}
    </section>
  );
});

/** Центральное поле: кубики кормовой базы, банк еды, индикатор года и фазы. */
function CenterField({
  year,
  lastYear,
  phase,
  bank,
  deckLeft,
  foodRoll,
  lastLog,
  actorName,
  deaths,
  style,
}: {
  year: number;
  lastYear: boolean;
  phase: string;
  bank: number;
  deckLeft: number;
  foodRoll: number[] | null;
  lastLog?: string;
  actorName?: string;
  deaths: number;
  style?: React.CSSProperties;
}) {
  const showDice = phase === "foodBank" || phase === "feeding";
  // Ключ по значениям кубиков: компонент перемонтируется только на новом броске,
  // поэтому анимация не переигрывается на каждом ходе игроков.
  const diceKey = foodRoll ? foodRoll.join("-") : "pending";
  return (
    <section
      style={style}
      className="felt grain relative order-first flex min-h-[150px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[26px] border border-border p-4 text-fg shadow-[inset_0_0_60px_rgba(0,0,0,.45),var(--shadow-card)] lg:order-none lg:min-h-0"
    >
      <img
        src={BG.bankBowl}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.13]"
      />
      <div className="relative flex items-center gap-2 rounded-full border border-border-strong/60 bg-bg/55 px-3.5 py-1 text-xs backdrop-blur-sm">
        {PHASE_ICON[phase] ? <img src={PHASE_ICON[phase]} alt="" className="size-4 rounded-[4px]" /> : null}
        <span className="font-display tracking-wide">Год {year}</span>
        {lastYear ? <span className="text-clay">последний</span> : null}
        <span className="text-subtle">·</span>
        <span>{PHASE_LABEL[phase] ?? phase}</span>
        <span className="text-subtle">·</span>
        <span className="tabular-nums text-muted">колода {deckLeft}</span>
      </div>

      {showDice ? <DiceTray key={diceKey} roll={foodRoll} /> : null}

      {phase === "extinction" ? (
        <div className="relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-danger/60 bg-danger/15 px-4 py-1.5 text-sm font-medium text-clay">
          Вымирание: погибает {deaths === 0 ? "никто" : `животных: ${deaths}`}
        </div>
      ) : (
        <BankPile count={bank} active={phase === "feeding"} />
      )}

      {actorName && (phase === "feeding" || phase === "development") ? (
        <p className="relative text-xs text-accent">Ход: {actorName}</p>
      ) : null}
      {lastLog ? <p className="relative max-w-md text-center text-[11px] leading-snug text-muted">{lastLog}</p> : null}
    </section>
  );
}

function BankPile({ count, active }: { count: number; active: boolean }) {
  return (
    <div className="relative flex flex-col items-center gap-1.5" title={active ? "Фишки кормовой базы — берите по одной в свой ход питания" : "Кормовая база"}>
      <div className="flex max-w-[260px] flex-wrap items-center justify-center gap-1">
        {count === 0 ? (
          <span className="text-xs text-subtle">{active ? "база пуста" : "—"}</span>
        ) : (
          Array.from({ length: Math.min(count, 24) }).map((_, i) => (
            <img key={`${i}-${count}`} src={TOKEN.meat} alt="" className="token-pop size-4 rounded-full" />
          ))
        )}
        {count > 24 ? <span className="ml-1 text-xs tabular-nums text-muted">+{count - 24}</span> : null}
      </div>
      <span className="font-display text-xl tabular-nums leading-none">{count}</span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted">кормовая база</span>
    </div>
  );
}

/**
 * Кубики: крутятся ~0.9 с после броска, затем показывают выпавшие значения.
 * Компонент перемонтируется только со новым броском (ключ — значения кубиков),
 * поэтому эффект прокрутки срабатывает один раз.
 */
function DiceTray({ roll }: { roll: number[] | null }) {
  const [rolling, setRolling] = useState(Boolean(roll));
  const rollId = roll?.join(",") ?? "";
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rollId) return;
    setRolling(true);
    timer.current = setTimeout(() => setRolling(false), 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [rollId]);

  if (!roll) {
    return (
      <div className="relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2.5">
        <Die value={null} rolling className="size-9" />
        <Die value={null} rolling className="size-9" />
        <span className="text-xs uppercase tracking-[0.18em] text-muted">бросок…</span>
      </div>
    );
  }

  const total = roll.reduce((s, d) => s + d, 0);
  return (
    <div className="relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2.5">
      {roll.map((d, i) => (
        <Die key={i} value={d} rolling={rolling} className={rolling ? "size-9" : "size-10"} />
      ))}
      <div className="flex flex-col">
        <span className={cn("font-display text-2xl leading-none tabular-nums", !rolling && "pop-in")}>
          {rolling ? "…" : total}
        </span>
        {!rolling ? <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-good">кормовая база</span> : null}
      </div>
    </div>
  );
}

function FoodBankChip({ count, visible }: { count: number; visible: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5" title="Кормовая база">
      <span className="text-[10px] uppercase tracking-wider text-muted">База</span>
      <span className="font-display text-lg tabular-nums leading-none">{visible ? count : "—"}</span>
    </div>
  );
}

function DevDock({
  human,
  intent,
  disabled,
  onPlayAnimal,
  onPickTrait,
  onPass,
}: {
  human: Player;
  intent: UiIntent;
  disabled?: boolean;
  onPlayAnimal: (id: string) => void;
  onPickTrait: (id: string, face: number) => void;
  onPass: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted">
          {disabled
            ? "Ход соперника — карты остаются у вас"
            : intent.kind === "playTrait"
              ? "Выберите животное для свойства"
              : intent.kind === "playPair" && !("first" in intent && intent.first)
                ? "Парное свойство: выберите первое животное"
                : intent.kind === "playPair"
                  ? "Второе животное пары"
                  : "Карта как животное или свойство"}
        </p>
        <Button variant="secondary" size="sm" onClick={onPass} disabled={disabled}>
          Пас
        </Button>
      </div>
      <div data-hand-row className="flex gap-2 overflow-x-auto pb-1">
        {human.hand.map((card) => (
          <HandCard
            key={card.id}
            card={card}
            disabled={disabled}
            selected={intent.kind !== "none" && "cardId" in intent && intent.cardId === card.id}
            selectedFace={"face" in intent && intent.cardId === card.id ? (intent.face as number) : null}
            onSelect={(face) => {
              if (face === "animal") onPlayAnimal(card.id);
              else onPickTrait(card.id, face);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FeedDock({
  acts,
  intentKind,
  bank,
  onIntent,
  onSkip,
}: {
  acts: GameAction[];
  intentKind: string;
  bank: number;
  onIntent: (i: { kind: "take" | "hunt" | "pirate" | "hibernate" | "fat" | "graze" | "none" }) => void;
  onSkip: () => void;
}) {
  const dispatch = useGameStore((s) => s.dispatch);
  const takes = acts.filter((a): a is Extract<GameAction, { type: "feedTake" }> => a.type === "feedTake");
  const canHunt = acts.some((a) => a.type === "feedHunt");
  const canPirate = acts.some((a) => a.type === "feedPirate");
  const sleeps = acts.filter((a): a is Extract<GameAction, { type: "feedHibernate" }> => a.type === "feedHibernate");
  const fats = acts.filter((a): a is Extract<GameAction, { type: "feedConvertFat" }> => a.type === "feedConvertFat");
  const grazes = acts.filter((a): a is Extract<GameAction, { type: "feedGraze" }> => a.type === "feedGraze");
  const canSkip = acts.some((a) => a.type === "feedSkip");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs tabular-nums text-muted">
        База: <span className="font-display text-sm text-fg">{bank}</span>
      </span>
      {takes.length ? (
        <Button
          variant={intentKind === "take" || intentKind === "none" ? "parchment" : "secondary"}
          size="sm"
          onClick={() => {
            if (takes.length === 1) dispatch(takes[0]);
            else onIntent({ kind: "take" });
          }}
        >
          Взять еду
        </Button>
      ) : null}
      {canHunt ? (
        <Button variant={intentKind === "hunt" ? "danger" : "secondary"} size="sm" onClick={() => onIntent({ kind: "hunt" })}>
          Охота
        </Button>
      ) : null}
      {canPirate ? (
        <Button variant={intentKind === "pirate" ? "parchment" : "secondary"} size="sm" onClick={() => onIntent({ kind: "pirate" })}>
          Пиратство
        </Button>
      ) : null}
      {sleeps.length ? (
        <Button
          variant={intentKind === "hibernate" ? "parchment" : "secondary"}
          size="sm"
          onClick={() => {
            if (sleeps.length === 1) dispatch(sleeps[0]);
            else onIntent({ kind: "hibernate" });
          }}
        >
          Спячка
        </Button>
      ) : null}
      {fats.length ? (
        <Button
          variant={intentKind === "fat" ? "parchment" : "secondary"}
          size="sm"
          onClick={() => {
            if (fats.length === 1) dispatch(fats[0]);
            else onIntent({ kind: "fat" });
          }}
        >
          Жир
        </Button>
      ) : null}
      {grazes.length ? (
        <Button
          variant={intentKind === "graze" ? "parchment" : "secondary"}
          size="sm"
          onClick={() => {
            if (grazes.length === 1) dispatch(grazes[0]);
            else onIntent({ kind: "graze" });
          }}
        >
          Топотун
        </Button>
      ) : null}
      {canSkip ? (
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Пас
        </Button>
      ) : null}
    </div>
  );
}

function DefenseDock({
  acts,
  onPick,
}: {
  acts: GameAction[];
  onPick: (a: GameAction) => void;
}) {
  const state = useGameStore((s) => s.state)!;
  const atk = state.pendingAttack!;
  const prey = findAnimal(state, atk.preyId);
  const running = acts.find((a) => a.type === "chooseDefense" && a.kind === "running");
  const none = acts.find((a) => a.type === "chooseDefense" && a.kind === "none");
  const mimics = acts.filter((a) => a.type === "chooseDefense" && a.kind === "mimicry");
  const tails = acts.filter((a) => a.type === "chooseDefense" && a.kind === "tailLoss");

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-3 sm:items-center">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-5">
        <h2 className="text-xl">Нападение хищника</h2>
        <p className="mt-1 text-sm text-muted">
          Нужно {prey ? foodNeeded(prey) : "—"} еды, сейчас {prey?.food ?? 0}. Выберите защиту.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {running ? (
            <Button onClick={() => onPick(running)}>Быстрое — бросок кубика</Button>
          ) : null}
          {mimics.map((a) =>
            a.type === "chooseDefense" ? (
              <Button key={a.mimicryTargetId} variant="secondary" onClick={() => onPick(a)}>
                Мимикрия на другое животное
              </Button>
            ) : null,
          )}
          {tails.map((a) => {
            if (a.type !== "chooseDefense") return null;
            const tr = prey?.traits.find((t) => t.id === a.discardTraitId);
            return (
              <Button key={a.discardTraitId} variant="secondary" onClick={() => onPick(a)}>
                Отбросить {tr ? TRAITS[tr.type].name : "свойство"}
              </Button>
            );
          })}
          {none ? (
            <Button variant="danger" onClick={() => onPick(none)}>
              Не защищаться
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
