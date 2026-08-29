import { BookOpen, List, Pause } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TRAITS } from "@/game/traits";
import type { Animal, FloraCard, GameAction, GameSpeed, GameState, Plant, Player, TerritoryId, TraitId } from "@/game/types";
import { TERRITORIES } from "@/game/types";
import { currentActor, legalDefenseActions, legalDevActions, legalFeedActions } from "@/game/engine";
import { canAttack, canPlantAttackTarget, canReceiveFood, canRageAttack, findAnimal, foodNeeded, hasTrait, liveScore, player } from "@/game/queries";
import { cn } from "@/lib/utils";
import { sfx, type SfxId } from "@/lib/sfx";
import { emptySession, recordGame, type SessionCounters } from "@/lib/stats";
import { BG, LOGO, MUTATION_ART, PHASE_ICON, TERRITORY_ART } from "@/lib/art";
import { loadSpeed, useGameStore, type UiIntent } from "@/store/game-store";
import { AnimalCard, HandCard, PAIR_COLORS, PairPlate, type PairMark } from "./cards";
import { FloraStrip } from "./cards-flora";
import { PlantStrip } from "./cards-plants";
import { Dice3D } from "./dice-3d";
import { FoodCube } from "./icons";
import { LobbyScreen } from "./net-screens";
import { GameOverScreen, MenuScreen, RulesPanel } from "./screens";
import { EventSpotlight } from "./spotlight";
import { SoundToggle } from "./sound-toggle";

const PHASE_LABEL: Record<string, string> = {
  development: "Развитие",
  foodBank: "Кормовая база",
  feeding: "Питание",
  extinction: "Вымирание",
  growth: "Рост",
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
  /** Миниатюра (жетон, карта) слева от подписи — например, флип вскрытой мутации. */
  image?: string;
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
    const plantEl = (id: string) => document.querySelector(`[data-plant-id="${id}"]`);
    const floraEl = (id: string) => document.querySelector(`[data-flora-id="${id}"]`);
    const sectionEl = (id: number) => document.querySelector(`[data-player-section="${id}"]`);

    const created: FxBadge[] = [];
    const push = (point: { x: number; y: number }, text: string, tone: FxBadge["tone"], image?: string) => {
      idRef.current += 1;
      created.push({ id: idRef.current, ...point, text, tone, image });
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
          push(anchorOf(animalEl(e.carnivoreId)), "добыча съедена +2 синие", "attack");
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
          push(anchorOf(animalEl(e.animalId)), "+1 красная", "good");
          break;
        case "blueFood": {
          // Цвет фишки виден на карточке, а подпись объясняет, откуда она.
          const label =
            e.reason === "piracy"
              ? "пиратство +1 синяя"
              : e.reason === "cooperation"
                ? "сотрудничество +1 синяя"
                : e.reason === "scavenger"
                  ? "падальщик +1 синяя"
                  : e.reason === "fat"
                    ? "жир → синие"
                    : e.reason === "tailLoss"
                      ? "+1 синяя"
                      : null; // «hunt» уже подписан в preyKilled
          if (label) push(anchorOf(animalEl(e.animalId)), label, "info");
          break;
        }
        case "bankBurned":
          push(anchorOf(document.querySelector(".felt")), `−${e.amount} база`, "bad");
          break;
        // ── «Растения» ──
        case "plantFoodTaken":
          push(anchorOf(animalEl(e.animalId)), "+1 с растения", "good");
          break;
        case "shelterTaken":
          push(anchorOf(animalEl(e.animalId)), "в убежище", "good");
          break;
        case "plantAttack":
          shakeEl(animalEl(e.preyId));
          push(anchorOf(animalEl(e.preyId)), e.counter ? "растение контратакует!" : "хищное растение!", "attack");
          break;
        case "plantGrew":
          push(anchorOf(plantEl(e.plantId)), `рост ${e.from}→${e.to}`, "good");
          break;
        case "plantGrazed":
          push(anchorOf(plantEl(e.plantId)), "− топтун", "bad");
          break;
        case "plantDied":
          push(anchorOf(plantEl(e.plantId)), "☠ растение", "bad");
          break;
        case "cardStolen":
          push(anchorOf(sectionEl(e.toPlayerId)), "+1 карта (медонос)", "info");
          break;
        // ── «Трава и грибы» ──
        case "floraFoodTaken":
          push(anchorOf(animalEl(e.animalId)), "+1 с флоры", "good");
          break;
        case "floraGrew":
          push(anchorOf(floraEl(e.floraId)), `гриб ${e.from}→${e.to}`, "info");
          break;
        case "floraGrazed":
          push(anchorOf(floraEl(e.floraId)), "− топтун", "bad");
          break;
        case "floraDied":
          push(anchorOf(floraEl(e.floraId)), "☠ флора", "bad");
          break;
        case "markGained":
          push(anchorOf(animalEl(e.animalId)), `метка: ${e.mark === "poison" ? "яд" : e.mark}`, "bad");
          break;
        case "handLost":
          push(anchorOf(sectionEl(e.playerId)), "рука сброшена (прозрение)", "bad");
          break;
        case "cardsDrawn": {
          for (let i = 0; i < e.counts.length; i++) {
            const n = e.counts[i]!;
            if (n > 0) push(anchorOf(sectionEl(i)), `+${n} ${n === 1 ? "карта" : n < 5 ? "карты" : "карт"}`, "info");
          }
          break;
        }
        // ── «Случайные мутации» ──
        case "mutationFlipped": {
          // Флип-карта — общая для всех вскрытий; подпись зависит от розыгрыша.
          const traitName = e.trait ? TRAITS[e.trait].name : null;
          const caption =
            e.usedAs === "trait"
              ? `«${traitName}»`
              : e.usedAs === "animal"
                ? "новый вид"
                : e.usedAs === "newSpecies"
                  ? "вид-мутант"
                  : e.usedAs === "population"
                    ? "+1 животное"
                    : e.usedAs === "plantTrait"
                      ? `«${traitName}» на растении`
                      : "в сброс";
          const tone: FxBadge["tone"] =
            e.usedAs === "trait" || e.usedAs === "plantTrait"
              ? e.trait && TRAITS[e.trait].harmful
                ? "bad"
                : "good"
              : "info";
          push(anchorOf(sectionEl(e.playerId)), caption, tone, MUTATION_ART.flip);
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

/**
 * Озвучка событий последнего действия — тот же кадр, что и визуальные бейджи,
 * но звуки выстраиваются каскадом (шаг ~70 мс), чтобы цепочка вроде
 * «атака → кубик → спаслось» звучала по порядку. Первый кадр партии
 * (в сети — вход по снапшоту) не озвучивается.
 */
function useSfx(state: GameState | null) {
  const seqRef = useRef(0);
  const phaseRef = useRef<string>("");
  useEffect(() => {
    if (!state) {
      seqRef.current = 0;
      phaseRef.current = "";
      return;
    }
    const firstFrame = seqRef.current === 0;
    if (state.eventSeq !== seqRef.current) {
      seqRef.current = state.eventSeq;
      if (!firstFrame) {
        const queue: Array<{ id: SfxId; at: number }> = [];
        for (const e of state.lastEvents) {
          const at = Math.min(queue.length * 0.07, 0.5);
          switch (e.kind) {
            case "diceRoll":
            case "territoryDice":
              queue.push({ id: "roll", at });
              break;
            case "huntDeclared":
              queue.push({ id: "hunt", at });
              break;
            case "preyKilled":
              queue.push({ id: "kill", at });
              break;
            case "defenseUsed":
              if (e.defense === "running") queue.push({ id: "defense", at });
              else if (e.defense === "mimicry" || e.defense === "tailLoss") queue.push({ id: "dodge", at });
              break;
            case "foodFromBank":
              queue.push({ id: "food", at });
              break;
            case "blueFood":
              queue.push({ id: "foodBlue", at });
              break;
            case "foodToFat":
              queue.push({ id: "fat", at });
              break;
            case "animalDied":
              queue.push({ id: "death", at });
              break;
            case "cardsDrawn":
              queue.push({ id: "draw", at });
              break;
            case "cardStolen":
              queue.push({ id: "draw", at });
              break;
            case "traitPlaced":
            case "animalPlaced":
              queue.push({ id: "card", at });
              break;
            case "plantPlaced":
            case "floraPlaced":
              queue.push({ id: "plant", at });
              break;
            case "plantFoodTaken":
            case "floraFoodTaken":
              queue.push({ id: "food", at });
              break;
            case "plantAttack":
              queue.push({ id: "hunt", at });
              break;
            case "markGained":
              queue.push({ id: "mark", at });
              break;
            case "mutationFlipped":
              queue.push({ id: "flip", at });
              break;
            default:
              break;
          }
        }
        for (const { id, at } of queue) sfx.play(id, at);
      }
    }
    // Смена фазы года — тихий пергаментный свуш.
    if (!firstFrame && state.phase !== phaseRef.current) {
      phaseRef.current = state.phase;
      if (state.phase !== "gameOver") sfx.play("phase");
    } else if (firstFrame) {
      phaseRef.current = state.phase;
    }
  }, [state]);
}

// ── Полёт фишек еды от источника к животному ────────────────────────────────

interface FlyingFood {
  id: number;
  tone: "red" | "blue" | "yellow" | "green";
  from: { x: number; y: number };
  to: { x: number; y: number };
}

/**
 * Фишка еды «летит» по столу от источника (кормовая база, растение, флора)
 * к карточке животного — вместо простого pop-in на месте. Работает поверх
 * тех же событий последнего действия, что и визуальные бейджи.
 */
function useFoodFly(state: GameState | null): FlyingFood[] {
  const [items, setItems] = useState<FlyingFood[]>([]);
  const seqRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    if (!state || state.eventSeq === seqRef.current) return;
    seqRef.current = state.eventSeq;

    const centerOf = (el: Element | null): { x: number; y: number } | null => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    };
    const animalEl = (id: string) => document.querySelector(`[data-animal-id="${id}"]`);

    const created: FlyingFood[] = [];
    const push = (from: { x: number; y: number } | null, to: { x: number; y: number } | null, tone: FlyingFood["tone"]) => {
      if (!from || !to) return;
      // Лёгкий разброс стартовых точек — несколько фишек летят не строем.
      const jx = Math.round(Math.random() * 22 - 11);
      const jy = Math.round(Math.random() * 14 - 7);
      idRef.current += 1;
      created.push({ id: idRef.current, tone, from: { x: from.x + jx, y: from.y + jy }, to });
    };
    const felt = () => centerOf(document.querySelector(".felt"));

    for (const e of state.lastEvents) {
      switch (e.kind) {
        case "foodFromBank":
          push(centerOf(document.querySelector("[data-food-bank]") ?? document.querySelector(".felt")), centerOf(animalEl(e.animalId)), "red");
          break;
        case "plantFoodTaken":
          push(centerOf(document.querySelector(`[data-plant-id="${e.plantId}"]`)), centerOf(animalEl(e.animalId)), "green");
          break;
        case "floraFoodTaken":
          push(centerOf(document.querySelector(`[data-flora-id="${e.floraId}"]`)), centerOf(animalEl(e.animalId)), "red");
          break;
        case "blueFood":
          push(felt(), centerOf(animalEl(e.animalId)), "blue");
          break;
        case "foodToFat":
          push(felt(), centerOf(animalEl(e.animalId)), "yellow");
          break;
        default:
          break;
      }
    }

    if (created.length) {
      setItems((prev) => [...prev, ...created]);
      const ids = new Set(created.map((c) => c.id));
      setTimeout(() => setItems((prev) => prev.filter((b) => !ids.has(b.id))), 600);
    }
  }, [state]);

  return items;
}

export function GameApp() {
  const state = useGameStore((s) => s.state);
  // Скорость из localStorage подмешиваем после гидратации, чтобы SSR-разметка
  // всегда совпадала с первым клиентским рендером. Заодно возвращаем игрока
  // в прерванную соло-партию (перезагрузка страницы/F5 её больше не теряет).
  useEffect(() => {
    const saved = loadSpeed();
    if (saved !== "normal") useGameStore.getState().setSpeed(saved);
    useGameStore.getState().resumeSolo();
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
          <Toaster {...TOASTER_OPTS} />
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
        <Toaster {...TOASTER_OPTS} />
      </div>
    );
  }

  if (!state) {
    return (
      <>
        <MenuScreen onStart={start} onRules={() => setRulesOpen(true)} />
        {rulesOpen ? <RulesPanel onClose={() => setRulesOpen(false)} /> : null}
        <Toaster {...TOASTER_OPTS} />
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
      <Toaster {...TOASTER_OPTS} />
    </div>
  );
}

/** Тосты в теме атласа — для сетевых ошибок и достижений. */
const TOASTER_OPTS = {
  position: "top-center" as const,
  toastOptions: {
    style: {
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      color: "var(--color-fg)",
      borderRadius: "var(--radius-md)",
    },
  },
};

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
  const netError = useGameStore((s) => s.net?.error);
  const clearNetError = useGameStore((s) => s.clearNetError);
  // Подтверждение выхода в меню: ref — чтобы Esc-обработчик с deps [] видел.
  const [confirmLeave, setConfirmLeave] = useState(false);
  const confirmRef = useRef(false);
  const askLeave = useCallback((v: boolean) => {
    confirmRef.current = v;
    setConfirmLeave(v);
  }, []);

  // Ошибка сетевого хода раньше нигде не показывалась: молча гасилась в сторе.
  useEffect(() => {
    if (!netError) return;
    toast.error(netError);
    clearNetError();
  }, [netError, clearNetError]);

  const human = player(state, state.humanId);
  const actor = currentActor(state);
  // «Трава и грибы»: раунд безумца проводит сосед справа — стол человека
  // в этот раунд не интерактивен.
  const isHumanTurn = actor?.id === human.id && state.madTurn !== human.id;

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

  // ── «Растения»: подсветка легальных целей среди растений ──
  const plantsOn = Boolean(state.modules.plants);
  const fungiOn = Boolean(state.modules.fungi);
  const plantHighlights = useMemo(() => {
    const set = new Set<string>();
    if (!plantsOn) return set;
    if (state.phase === "development") {
      if (intent.kind === "playPlantTrait") {
        for (const a of devActs) {
          if (a.type === "devPlayPlantTrait" && a.cardId === intent.cardId && a.face === intent.face) set.add(a.plantId);
        }
      } else if (intent.kind === "playPlantPair") {
        for (const a of devActs) {
          if (a.type !== "devPlayPlantPair" || a.cardId !== intent.cardId || a.face !== intent.face) continue;
          if (intent.first ? a.a === intent.first : true) set.add(intent.first ? a.b : a.a);
        }
      } else if (intent.kind === "mutatePlant") {
        // «Случайные мутации»: карта может лечь свойством на любое растение.
        for (const a of devActs) {
          if (a.type === "devMutate" && a.intent === "plant" && a.plantId) set.add(a.plantId);
        }
      }
    } else if (state.phase === "feeding" && isHumanTurn) {
      if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && intent.animalId) {
        for (const a of feedActs) if (a.type === "feedTakePlant" && a.animalId === intent.animalId) set.add(a.plantId);
      } else if (intent.kind === "shelter" && intent.animalId) {
        for (const a of feedActs) if (a.type === "feedShelter" && a.animalId === intent.animalId) set.add(a.plantId);
      } else if (intent.kind === "plantAttack") {
        if (intent.plantId) set.add(intent.plantId);
        else for (const a of feedActs) if (a.type === "feedPlantAttack") set.add(a.plantId);
      } else if (intent.kind === "parasitize") {
        for (const a of feedActs) if (a.type === "feedParasitize") set.add(a.parasiteId);
      } else if (intent.kind === "graze" && intent.animalId) {
        for (const a of feedActs) {
          if (a.type === "feedGraze" && a.animalId === intent.animalId && a.plantId) set.add(a.plantId);
        }
      }
    }
    return set;
  }, [plantsOn, state.phase, intent, devActs, feedActs, isHumanTurn]);

  // ── «Трава и грибы»: подсветка легальных целей среди флоры ──
  const floraHighlights = useMemo(() => {
    const set = new Set<string>();
    if (!fungiOn) return set;
    if (state.phase !== "feeding" || !isHumanTurn) return set;
    if ((intent.kind === "takeFlora" || intent.kind === "takePlant") && intent.animalId) {
      for (const a of feedActs) {
        if (a.type === "feedTakeFlora" && a.animalId === intent.animalId) set.add(a.floraId);
      }
    } else if (intent.kind === "graze" && intent.animalId) {
      for (const a of feedActs) {
        if (a.type === "feedGraze" && a.animalId === intent.animalId && a.floraId) set.add(a.floraId);
      }
    }
    return set;
  }, [fungiOn, state.phase, intent, feedActs, isHumanTurn]);

  function onPlantClick(plant: Plant) {
    if (!isHumanTurn || state.pendingAttack) return;
    const dispatchAct = (a: GameAction) => dispatch(a);
    if (state.phase === "development") {
      if (intent.kind === "playPlantTrait") {
        const ok = devActs.some(
          (a) => a.type === "devPlayPlantTrait" && a.cardId === intent.cardId && a.face === intent.face && a.plantId === plant.id,
        );
        if (ok) dispatchAct({ type: "devPlayPlantTrait", cardId: intent.cardId!, face: intent.face!, plantId: plant.id });
        return;
      }
      if (intent.kind === "playPlantPair") {
        if (!intent.first) {
          setIntent({ ...intent, first: plant.id });
          return;
        }
        const ok = devActs.some(
          (a) => a.type === "devPlayPlantPair" && a.cardId === intent.cardId && a.face === intent.face && a.a === intent.first && a.b === plant.id,
        );
        if (ok) dispatchAct({ type: "devPlayPlantPair", cardId: intent.cardId!, face: intent.face!, a: intent.first, b: plant.id });
        return;
      }
      // «Случайные мутации»: объявлено свойство растения — карта вскроется на нём.
      if (intent.kind === "mutatePlant") {
        const ok = devActs.some((a) => a.type === "devMutate" && a.intent === "plant" && a.plantId === plant.id);
        if (ok) dispatchAct({ type: "devMutate", intent: "plant", plantId: plant.id });
      }
      return;
    }
    if (state.phase !== "feeding") return;
    if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && intent.animalId) {
      const ok = feedActs.some((a) => a.type === "feedTakePlant" && a.animalId === intent.animalId && a.plantId === plant.id);
      if (ok) dispatchAct({ type: "feedTakePlant", animalId: intent.animalId, plantId: plant.id });
      return;
    }
    if (intent.kind === "shelter" && intent.animalId) {
      const ok = feedActs.some((a) => a.type === "feedShelter" && a.animalId === intent.animalId && a.plantId === plant.id);
      if (ok) dispatchAct({ type: "feedShelter", animalId: intent.animalId, plantId: plant.id });
      return;
    }
    if (intent.kind === "plantAttack") {
      if (!intent.plantId) {
        const has = feedActs.some((a) => a.type === "feedPlantAttack" && a.plantId === plant.id);
        if (has) setIntent({ kind: "plantAttack", plantId: plant.id });
      }
      return;
    }
    if (intent.kind === "parasitize") {
      const act = feedActs.find((a) => a.type === "feedParasitize" && a.parasiteId === plant.id);
      if (act && act.type === "feedParasitize") dispatchAct(act);
      return;
    }
    if (intent.kind === "graze" && intent.animalId) {
      const ok = feedActs.some((a) => a.type === "feedGraze" && a.animalId === intent.animalId && a.plantId === plant.id);
      if (ok) dispatchAct({ type: "feedGraze", animalId: intent.animalId, plantId: plant.id });
    }
  }

  /** «Трава и грибы»: клик по карте флоры — еда или топтун. */
  function onFloraClick(flora: FloraCard) {
    if (!isHumanTurn || state.pendingAttack) return;
    if (state.phase !== "feeding") return;
    if ((intent.kind === "takeFlora" || intent.kind === "takePlant") && intent.animalId) {
      const ok = feedActs.some((a) => a.type === "feedTakeFlora" && a.animalId === intent.animalId && a.floraId === flora.id);
      if (ok) dispatch({ type: "feedTakeFlora", animalId: intent.animalId, floraId: flora.id });
      return;
    }
    if (intent.kind === "graze" && intent.animalId) {
      const ok = feedActs.some((a) => a.type === "feedGraze" && a.animalId === intent.animalId && a.floraId === flora.id);
      if (ok) dispatch({ type: "feedGraze", animalId: intent.animalId, floraId: flora.id });
    }
  }

  function onBoardClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest("[data-animal-id]");
    if (!target) {
      // Клик мимо животных — по пустому сукну: отменяет начатый выбор.
      // Кликам по растениям, флоре и кнопкам стола это не мешает.
      const hit = (e.target as HTMLElement).closest("[data-plant-id], [data-flora-id], button, a");
      if (!hit && isHumanTurn && intent.kind !== "none") setIntent({ kind: "none" });
      return;
    }
    if (!isHumanTurn || state.pendingAttack) return;
    const animal = findAnimal(state, target.getAttribute("data-animal-id")!);
    if (!animal) return;
    handleAnimalClick(animal, { state, intent, isHumanTurn, human, feedActs, devActs, dispatch, setIntent });
  }

  // Esc сбрасывает начатый выбор (карта, охота, убежище…), если не занят
  // оверлеями: правила и журнал закрываются своими обработчиками.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = useGameStore.getState();
      if (s.rulesOpen || s.logOpen) return;
      if (confirmRef.current) return; // диалог подтверждения закрывает себя сам
      if (s.intent.kind !== "none") s.setIntent({ kind: "none" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const opponents = state.players.filter((p) => p.id !== human.id);
  /**
   * Рассадка вокруг поля. Верх и «низ» (ряд над своим табло) — по одной строке,
   * делённой пополам между двумя соперниками; бока — по колонке до двух.
   * Так восемь мест раскладываются без наложений: 2 сверху, 2 снизу, 2+2 по бокам.
   */
  const seats = useMemo(() => {
    const top: Player[] = [];
    const left: Player[] = [];
    const right: Player[] = [];
    const bottom: Player[] = [];
    if (opponents.length === 1) {
      top.push(opponents[0]!);
    } else if (opponents.length === 2) {
      left.push(opponents[0]!);
      right.push(opponents[1]!);
    } else {
      // Порядок раскладки: верх, бока, снова верх/бока, затем нижний ряд.
      const slots: Player[][] = [top, left, right, top, left, right, bottom, bottom];
      opponents.forEach((p, i) => slots[Math.min(i, slots.length - 1)]!.push(p));
    }
    return { top, left, right, bottom };
  }, [opponents]);
  const wideSeats = seats.left.length > 0 || seats.right.length > 0;

  const lastLog = state.log[state.log.length - 1]?.text;
  const dying = useMemo(() => new Set(state.extinctionDeaths), [state.extinctionDeaths]);
  const fx = useActionFx(state);
  useSfx(state);
  const fly = useFoodFly(state);

  // Новые карты влетают в руку каскадом: diff id карт между кадрами состояния.
  const prevHandRef = useRef<Set<string>>(new Set());
  const [freshHand, setFreshHand] = useState<ReadonlySet<string>>(new Set());
  useEffect(() => {
    const ids = new Set(human.hand.map((c) => c.id));
    const fresh = [...ids].filter((id) => !prevHandRef.current.has(id));
    prevHandRef.current = ids;
    if (fresh.length) {
      setFreshHand(new Set(fresh));
      const t = setTimeout(() => setFreshHand(new Set()), 900);
      return () => clearTimeout(t);
    }
  }, [human.hand]);

  // ── Счётчики партии для статистики и достижений ──
  // Копятся из событий последнего действия; в финале уходят в историю.
  const sessionRef = useRef<SessionCounters>(emptySession());
  const sessionSeqRef = useRef(0);
  // Стадия показа вымирания: пока животные ещё на столе, запоминаем владельцев.
  const pendingDeathsRef = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    if (state.eventSeq < sessionSeqRef.current) {
      // eventSeq пошёл заново — началась новая партия.
      sessionRef.current = emptySession();
      pendingDeathsRef.current = new Map();
    }
    for (const id of state.extinctionDeaths) {
      const a = findAnimal(state, id);
      if (a && !pendingDeathsRef.current.has(id)) pendingDeathsRef.current.set(id, a.ownerId);
    }
    if (state.eventSeq === sessionSeqRef.current) return;
    sessionSeqRef.current = state.eventSeq;
    const ses = sessionRef.current;
    const ownerOf = (id: string) => findAnimal(state, id)?.ownerId;
    for (const e of state.lastEvents) {
      switch (e.kind) {
        case "huntDeclared":
          if (ownerOf(e.carnivoreId) === human.id) ses.hunts++;
          break;
        case "preyKilled":
          if (ownerOf(e.carnivoreId) === human.id) ses.kills++;
          break;
        case "foodFromBank":
        case "plantFoodTaken":
        case "floraFoodTaken":
          if (e.playerId === human.id) ses.food++;
          break;
        case "blueFood":
        case "foodToFat":
          if (ownerOf(e.animalId) === human.id) ses.food++;
          break;
        case "animalDied": {
          if (pendingDeathsRef.current.get(e.animalId) === human.id) ses.deaths++;
          pendingDeathsRef.current.delete(e.animalId);
          break;
        }
        case "defenseUsed": {
          if (e.defense !== "none" && ownerOf(e.preyId) === human.id) ses.dodges++;
          break;
        }
        case "traitPlaced": {
          if (ownerOf(e.animalId) !== human.id) break;
          ses.traits[e.type] = (ses.traits[e.type] ?? 0) + 1;
          const n = findAnimal(state, e.animalId)?.traits.length ?? 0;
          if (n > ses.maxTraits) ses.maxTraits = n;
          break;
        }
        default:
          break;
      }
    }
  }, [state, human.id]);

  // Финал партии: одна запись в историю, тосты о новых достижениях.
  const recordedRef = useRef(false);
  useEffect(() => {
    if (state.phase !== "gameOver") {
      recordedRef.current = false;
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    const unlocked = recordGame(state, sessionRef.current, mode);
    for (const a of unlocked) toast.success(`Достижение: ${a.name}`, { description: a.desc });
  }, [state, mode]);
  // AudioContext живёт только после пользовательского жеста — будим по первому.
  useEffect(() => {
    const unlock = () => sfx.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="paper-desk pointer-events-none fixed inset-0 -z-10 opacity-[0.14]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.07]"
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
        <SoundToggle />
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" aria-label="Журнал" onClick={() => setLogOpen(!logOpen)}>
            <List className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Правила" onClick={() => setRulesOpen(true)}>
            <BookOpen className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Меню"
            title="В меню"
            onClick={() => {
              // Законченную партию покидаем сразу; живую — только с подтверждением.
              if (state.phase === "gameOver") reset();
              else askLeave(true);
            }}
          >
            <Pause className="size-4" />
          </Button>
        </div>
      </header>

      {/* Стол: узкое центральное поле-сукно, соперники по бокам без прокрутки, игрок снизу. */}
      <main
        onClick={onBoardClick}
        className={cn(
          "flex flex-1 flex-col gap-3 px-3 py-3 sm:px-5",
          wideSeats && (plantsOn || fungiOn) &&
            // Литеральные классы: динамическую сборку Tailwind не видит в исходнике.
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-4 lg:[grid-template-areas:'plants_plants_plants''top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']",
          wideSeats && !plantsOn && !fungiOn &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-4 lg:[grid-template-areas:'top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']",
          !wideSeats && "lg:mx-auto lg:w-full lg:max-w-4xl",
          state.phase === "extinction" ? "extinction-glow" : "",
        )}
      >
        {/* «Растения»/«Трава и грибы»: общий стол растений и флоры; с «Континентами» — по континентам. */}
        {plantsOn || fungiOn ? (
          <div style={wideSeats ? { gridArea: "plants" } : undefined} className="flex flex-col gap-2">
            {state.modules.continents ? (
              (["gondwana", "laurasia"] as TerritoryId[]).map((z) => (
                <div key={z} className="flex flex-col gap-2">
                  {plantsOn ? (
                    <PlantStrip
                      state={state}
                      zone={z}
                      highlights={plantHighlights}
                      onPlantClick={onPlantClick}
                      freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
                    />
                  ) : null}
                  {fungiOn ? <FloraStrip state={state} zone={z} highlights={floraHighlights} onFloraClick={onFloraClick} /> : null}
                </div>
              ))
            ) : (
              <>
                {plantsOn ? (
                  <PlantStrip
                    state={state}
                    highlights={plantHighlights}
                    onPlantClick={onPlantClick}
                    freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
                  />
                ) : null}
                {fungiOn ? <FloraStrip state={state} highlights={floraHighlights} onFloraClick={onFloraClick} /> : null}
              </>
            )}
          </div>
        ) : null}

        {/* Верхний ряд: до двух соперников в одну строку, по половине ширины. */}
        {seats.top.length ? (
          <div
            style={wideSeats ? { gridArea: "top" } : undefined}
            className={cn("grid gap-3", seats.top.length > 1 && "lg:grid-cols-2")}
          >
            {seats.top.map((p) => (
              <PlayerSection
                key={p.id}
                p={p}
                actorId={actor?.id ?? null}
                thinking={thinking && thinkingWho === p.id}
                interactions={getInteraction}
                dying={dying}
                freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
                continents={Boolean(state.modules.continents)}
              />
            ))}
          </div>
        ) : null}

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
              continents={Boolean(state.modules.continents)}
            />
          ))}
        </div>

        <CenterField
          style={wideSeats ? { gridArea: "felt" } : undefined}
          year={state.year}
          lastYear={state.lastYear}
          phase={state.phase}
          bank={state.foodBank}
          territoryFood={state.modules.continents ? state.territoryFood : undefined}
          deckLeft={state.deckCount ?? state.deck.length}
          foodRoll={state.foodRoll}
          lastLog={lastLog}
          actorName={actor?.name}
          deaths={state.extinctionDeaths.length}
          plantsInfo={
            plantsOn
              ? {
                  count: (state.plants ?? []).length,
                  food: (state.plants ?? []).reduce((s, p) => s + p.food, 0),
                  shelters: (state.plants ?? []).reduce((s, p) => s + p.shelters, 0),
                  deck: state.plantDeckCount ?? state.plantDeck?.length ?? 0,
                }
              : undefined
          }
          floraInfo={
            fungiOn
              ? {
                  count: (state.flora ?? []).length,
                  food: (state.flora ?? []).reduce((s, f) => s + f.food, 0),
                  deck: state.floraDeckCount ?? state.floraDeck?.length ?? 0,
                }
              : undefined
          }
        />

        <div style={wideSeats ? { gridArea: "right" } : undefined} className={cn(wideSeats && "lg:min-w-0")}>
          {seats.right.map((p) => (
            <PlayerSection
              key={p.id}
              p={p}
              actorId={actor?.id ?? null}
              thinking={thinking && thinkingWho === p.id}
              interactions={getInteraction}
              dying={dying}
              freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
              continents={Boolean(state.modules.continents)}
            />
          ))}
        </div>

        {/* Нижний ряд соперников (столы 7–8 мест) — тоже одной строкой пополам. */}
        {seats.bottom.length ? (
          <div
            style={wideSeats ? { gridArea: "bottom" } : undefined}
            className={cn("grid gap-3", seats.bottom.length > 1 && "lg:grid-cols-2")}
          >
            {seats.bottom.map((p) => (
              <PlayerSection
                key={p.id}
                p={p}
                actorId={actor?.id ?? null}
                thinking={thinking && thinkingWho === p.id}
                interactions={getInteraction}
                dying={dying}
                freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
                continents={Boolean(state.modules.continents)}
              />
            ))}
          </div>
        ) : null}

        <PlayerSection
          p={human}
          isHuman
          actorId={actor?.id ?? null}
          thinking={false}
          interactions={getInteraction}
          dying={dying}
          freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
          continents={Boolean(state.modules.continents)}
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
          state.modules.randomMutations ? (
            <MutateDock
              human={human}
              intent={intent}
              disabled={!isHumanTurn || Boolean(state.pendingAttack)}
              continents={Boolean(state.modules.continents)}
              canPlant={Boolean(state.modules.plants)}
              onNewAnimal={(zoneId) => dispatch({ type: "devMutate", intent: "newAnimal", zoneId })}
              onTrait={() => setIntent({ kind: "mutateTrait" })}
              onPop={() => setIntent({ kind: "mutatePop" })}
              onPlant={() => setIntent({ kind: "mutatePlant" })}
              onPass={() => dispatch({ type: "devPass" })}
              onCancel={() => setIntent({ kind: "none" })}
            />
          ) : (
            <DevDock
              human={human}
              intent={intent}
              disabled={!isHumanTurn || Boolean(state.pendingAttack)}
              continents={Boolean(state.modules.continents)}
              freshIds={freshHand}
              onPlayAnimal={(cardId, zoneId) => dispatch({ type: "devPlayAnimal", cardId, zoneId })}
              onPlaceAnimal={(cardId) => setIntent({ kind: "placeAnimal", cardId })}
              onPickTrait={(cardId, face) => {
                const card = human.hand.find((c) => c.id === cardId);
                const trait = card?.faces[face] as TraitId | undefined;
                if (!trait) return;
                const def = TRAITS[trait];
                if (def.plantTrait) {
                  // Свойство растения кладётся на растение стола (микориза — на два).
                  if (trait === "micorrhiza") setIntent({ kind: "playPlantPair", cardId, face });
                  else setIntent({ kind: "playPlantTrait", cardId, face });
                  return;
                }
                if (def.isPair) setIntent({ kind: "playPair", cardId, face });
                else setIntent({ kind: "playTrait", cardId, face });
              }}
              onPass={() => dispatch({ type: "devPass" })}
              onCancel={() => setIntent({ kind: "none" })}
            />
          )
        ) : state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? (
          <FeedDock
            acts={feedActs}
            intentKind={intent.kind}
            bank={state.foodBank}
            rageTurn={state.rageTurn ?? null}
            onIntent={setIntent}
            onEndTurn={() => dispatch({ type: "feedEndTurn" })}
            onSkip={() => dispatch({ type: "feedSkip" })}
          />
        ) : (
          <div className="flex h-14 items-center justify-center text-sm text-muted">
            {state.phase === "foodBank"
              ? plantsOn || fungiOn
                ? "Кормовая база Океана определяется…"
                : state.foodRoll
                  ? "Кубики брошены — кормовая база определяется…"
                  : "Бросок кормовой базы…"
              : state.phase === "extinction"
                ? "Вымирание: ненакормленные животные погибают…"
                : state.phase === "growth"
                  ? "Рост: растения разрастаются, добавляются новые…"
                  : state.madTurn === (actor?.id ?? -2)
                    ? `Безумие: раунд ${actor?.name ?? ""} проводит сосед справа…`
                    : mode === "net" && actor && actor.id !== human.id
                      ? `${actor.name} ходит…`
                      : thinking
                        ? `${actor?.name ?? "Соперник"} думает…`
                        : "Ожидание"}
          </div>
        )}
      </footer>

      {fx.map((b) => (
        <div key={b.id} style={{ left: b.x, top: b.y }} className={cn("fx-badge flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[var(--shadow-card)] backdrop-blur-sm", FX_TONE[b.tone])}>
          {b.image ? (
            <img src={b.image} alt="" loading="lazy" className="h-6 w-4 rounded-[2px] border border-ink/20 object-cover" />
          ) : null}
          {b.text}
        </div>
      ))}

      {fly.map((f) => (
        <div
          key={f.id}
          className="food-fly"
          style={
            {
              "--from-x": `${f.from.x}px`,
              "--from-y": `${f.from.y}px`,
              "--to-x": `${f.to.x}px`,
              "--to-y": `${f.to.y}px`,
            } as React.CSSProperties
          }
        >
          <FoodCube tone={f.tone} className="size-5" />
        </div>
      ))}

      <EventSpotlight />

      {state.pendingAttack && state.pendingAttack.waitingFor === human.id ? (
        <DefenseDock acts={defActs} onPick={(a) => dispatch(a)} />
      ) : null}

      {confirmLeave ? <ConfirmLeaveDialog mode={mode} onConfirm={reset} onClose={() => askLeave(false)} /> : null}
    </>
  );
}

/** «Покинуть партию?» — раньше кнопка меню сбрасывала живую партию мгновенно. */
function ConfirmLeaveDialog({
  mode,
  onConfirm,
  onClose,
}: {
  mode: "solo" | "net";
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-xl">{mode === "net" ? "Покинуть стол?" : "Покинуть партию?"}</h2>
        <p className="mt-2 text-sm text-muted">
          {mode === "net"
            ? "Ваше место освободится — партия продолжится без вас."
            : "Прогресс партии будет потерян."}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Остаться
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            Выйти в меню
          </Button>
        </div>
      </div>
    </div>
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
    // ── «Случайные мутации»: клик по своему виду разыгрывает карту колоды ──
    if (intent.kind === "mutateTrait") {
      const ok = devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id);
      if (ok) dispatch({ type: "devMutate", intent: "trait", animalId: animal.id });
      return;
    }
    if (intent.kind === "mutatePop") {
      const ok = devActs.some(
        (a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id,
      );
      if (ok) dispatch({ type: "devMutate", intent: "population", animalId: animal.id });
      return;
    }
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

  // ── «Растения»/«Трава и грибы»: еда со стола — животное, затем растение или флора ──
  if (intent.kind === "takePlant" || intent.kind === "takeFlora") {
    if (intent.animalId) return;
    const acts = feedActs.filter(
      (a) =>
        (a.type === "feedTakePlant" || a.type === "feedTakeFlora" || a.type === "feedTake") &&
        a.animalId === animal.id,
    );
    if (acts.length === 1) {
      dispatch(acts[0]!);
    } else if (acts.length > 1) {
      setIntent({ kind: state.modules.fungi ? "takeFlora" : "takePlant", animalId: animal.id });
    }
    return;
  }
  // ── «Растения»: убежище — животное, затем растение ──
  if (intent.kind === "shelter") {
    if (intent.animalId) return;
    const acts = feedActs.filter((a) => a.type === "feedShelter" && a.animalId === animal.id);
    if (acts.length === 1) {
      dispatch(acts[0]!);
    } else if (acts.length > 1) {
      setIntent({ kind: "shelter", animalId: animal.id });
    }
    return;
  }
  // ── «Растения»: хищное растение выбрано — кликаем по жертве ──
  if (intent.kind === "plantAttack" && intent.plantId) {
    const ok = feedActs.some((a) => a.type === "feedPlantAttack" && a.plantId === intent.plantId && a.preyId === animal.id);
    if (ok) dispatch({ type: "feedPlantAttack", plantId: intent.plantId, preyId: animal.id });
    return;
  }
  if (intent.kind === "graze") {
    // С растениями топтун топчет растение: сначала животное, потом растение.
    if (intent.animalId) return;
    const acts = feedActs.filter((a) => a.type === "feedGraze" && a.animalId === animal.id);
    if (acts.length === 1) {
      dispatch(acts[0]!);
    } else if (acts.length > 1) {
      setIntent({ ...intent, animalId: animal.id });
    }
    return;
  }
  if (intent.kind === "hunt") {
    if (!intent.carnivoreId) {
      const rageOk = state.rageTurn ? animal.id === state.rageTurn.animalId : false;
      if (animal.ownerId === human.id && (rageOk || hasTrait(animal, "carnivore"))) {
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
  // ── «Случайные мутации»: подсветка видов, принимающих карту из колоды ──
  if (intent.kind === "mutateTrait") {
    return devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id);
  }
  if (intent.kind === "mutatePop") {
    return devActs.some((a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id);
  }
  if (intent.kind === "playPair") {
    if (!intent.first) return animal.ownerId === state.humanId;
    return devActs.some((a) => a.type === "devPlayPair" && a.a === intent.first && a.b === animal.id);
  }
  if (state.phase !== "feeding") return false;
  if (intent.kind === "hunt" && intent.carnivoreId) {
    const car = findAnimal(state, intent.carnivoreId);
    // Бешеное животное атакует по правилам бешенства, а не хищника.
    return Boolean(car && (state.rageTurn ? canRageAttack(state, car, animal) : canAttack(state, car, animal)));
  }
  if (intent.kind === "hunt" && !intent.carnivoreId) {
    if (state.rageTurn) return Boolean(state.rageTurn.animalId === animal.id);
    return animal.ownerId === state.humanId && hasTrait(animal, "carnivore");
  }
  if (intent.kind === "pirate" && intent.pirateId) {
    return feedActs.some((a) => a.type === "feedPirate" && a.targetId === animal.id);
  }
  // ── «Растения»/«Трава и грибы» ──
  if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && !intent.animalId) {
    return feedActs.some(
      (a) => (a.type === "feedTakePlant" || a.type === "feedTakeFlora" || a.type === "feedTake") && a.animalId === animal.id,
    );
  }
  if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && intent.animalId) {
    return (
      feedActs.some((a) => a.type === "feedTakePlant" && a.animalId === intent.animalId && animal.id === intent.animalId) ||
      feedActs.some((a) => a.type === "feedTakeFlora" && a.animalId === intent.animalId && animal.id === intent.animalId)
    );
  }
  if (intent.kind === "shelter" && !intent.animalId) {
    return feedActs.some((a) => a.type === "feedShelter" && a.animalId === animal.id);
  }
  if (intent.kind === "plantAttack" && intent.plantId) {
    const plant = state.plants?.find((p) => p.id === intent.plantId);
    return Boolean(plant && canPlantAttackTarget(state, plant, animal));
  }
  if (intent.kind === "plantAttack" && !intent.plantId) {
    return false; // сначала выбирается растение
  }
  if (intent.kind === "graze" && !intent.animalId) {
    return feedActs.some((a) => a.type === "feedGraze" && a.animalId === animal.id);
  }
  if (intent.kind === "take" || intent.kind === "none") {
    // Подсветка ровно по легальности: после взятия еды в этом ходу цель гаснет
    // (у «облигатного хищника» цели из базы нет вовсе).
    return feedActs.some((a) => a.type === "feedTake" && a.animalId === animal.id);
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

/** Табло игрока со его животными; парные карты кладутся между животными. */
const PlayerSection = memo(function PlayerSection({
  p,
  isHuman,
  actorId,
  thinking,
  interactions,
  dying,
  freshSince,
  continents,
  style,
}: {
  p: Player;
  isHuman?: boolean;
  actorId: number | null;
  thinking?: boolean;
  interactions: (a: Animal) => Interaction;
  dying: Set<string>;
  freshSince?: number;
  /** «Континенты»: животные группируются по территориям. */
  continents?: boolean;
  style?: React.CSSProperties;
}) {
  const dispatch = useGameStore((s) => s.dispatch);
  const intent = useGameStore((s) => s.intent);
  // «Случайные мутации»: рука скрыта — показываем счётчик слепой колоды.
  const randomMutations = useGameStore((s) => Boolean(s.state?.modules.randomMutations));
  // Живой счёт всегда на табло: 2 за животное вида + свойство и его бонус.
  const gameState = useGameStore((s) => s.state);
  const score = gameState && gameState.phase !== "gameOver" ? liveScore(gameState, p.id) : null;
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  // Ссылка на перетаскиваемое для drop по зоне (замыкание зон не тянет стейт).
  const dragIdRef = useRef<string | null>(null);
  const active = actorId === p.id;
  /** Карта, ожидающая выбора континента (интент «выставить животное»). */
  const placingAnimal =
    isHuman && active && intent.kind === "placeAnimal" ? (intent.cardId as string) : undefined;

  /**
   * Разметка пар этого табло. У животного бывает две пары плюс симбионт,
   * поэтому каждая парная карта получает свой цвет (по порядку выкладывания),
   * а подпись говорит, кто напарник: у симбиоза — кто именно симбионт.
   */
  const pairs = useMemo(() => {
    const numberOf = new Map<string, number>();
    p.animals.forEach((a, i) => numberOf.set(a.id, i + 1));
    const links = p.animals
      .flatMap((a) => a.traits.filter((t) => t.pairWith).map((t) => ({ owner: a, t })))
      .sort((x, y) => x.t.playSeq - y.t.playSeq || x.t.id.localeCompare(y.t.id));

    const colorOf = new Map<string, string>();
    for (const { t } of links) {
      if (!colorOf.has(t.cardId)) {
        colorOf.set(t.cardId, PAIR_COLORS[colorOf.size % PAIR_COLORS.length]!);
      }
    }

    const marks: Record<string, PairMark> = {};
    /** Подпись плашки по id карты пары: «№1 ↔ №2», «симбионт — №1». */
    const plateNote = new Map<string, string>();
    for (const { t } of links) {
      const color = colorOf.get(t.cardId)!;
      const partnerNo = numberOf.get(t.pairWith!);
      const partner = partnerNo ? `№${partnerNo}` : "напарник";
      if (t.type === "symbiosis") {
        // Роль «a» — симбионт, роль «b» — тот, кого симбионт защищает.
        marks[t.id] = {
          color,
          note: t.pairRole === "a" ? `симбионт для ${partner}` : `симбионт — ${partner}`,
        };
      } else {
        marks[t.id] = { color, note: `с ${partner}` };
      }
    }
    // Плашке нужна подпись про обе стороны: считаем её по роли «a».
    for (const { owner, t } of links) {
      if (t.pairRole !== "a") continue;
      const selfNo = numberOf.get(owner.id);
      const partnerNo = numberOf.get(t.pairWith!);
      const self = selfNo ? `№${selfNo}` : "?";
      const partner = partnerNo ? `№${partnerNo}` : "?";
      plateNote.set(
        t.cardId,
        t.type === "symbiosis" ? `симбионт ${self} → ${partner}` : `${self} ↔ ${partner}`,
      );
    }
    return { colorOf, marks, plateNote, numberOf };
  }, [p.animals]);

  const cardProps = (a: Animal) => ({
    draggable: isHuman,
    dropTarget: isHuman && dragId !== null && overId === a.id && dragId !== a.id,
    onDragStartCard: isHuman
      ? (e: React.DragEvent) => {
          setDragId(a.id);
          dragIdRef.current = a.id;
          e.dataTransfer.setData("text/plain", a.id);
          e.dataTransfer.effectAllowed = "move";
        }
      : undefined,
    onDragOverCard: isHuman
      ? (e: React.DragEvent) => {
          if (dragId && dragId !== a.id) {
            e.preventDefault();
            setOverId(a.id);
          }
        }
      : undefined,
    onDropCard: isHuman
      ? () => {
          if (dragId && dragId !== a.id) dispatch({ type: "reorderAnimal", animalId: dragId, beforeId: a.id });
          setDragId(null);
          setOverId(null);
        }
      : undefined,
    onDragEndCard: isHuman
      ? () => {
          setDragId(null);
          setOverId(null);
        }
      : undefined,
  });
  const renderCard = (a: Animal, no: number) => {
    const it = interactions(a);
    return (
      <AnimalCard
        key={a.id}
        animal={a}
        no={no}
        pairMarks={pairs.marks}
        selected={it.selected}
        highlight={it.highlight}
        dimmed={it.dimmed}
        dying={dying.has(a.id)}
        freshSince={freshSince}
        {...(isHuman ? cardProps(a) : {})}
      />
    );
  };

  const rows: React.ReactNode[] = [];
  if (p.animals.length === 0) {
    rows.push(
      <p key="empty" className="text-xs text-subtle">
        {isHuman ? "Выложите животное из руки" : "Нет животных"}
      </p>,
    );
  } else {
    // Между двумя соседними связанными животными лежит их парная карта.
    // Такую цепочку собираем в одну группу: на узком экране она идёт столбиком
    // (плашка — полосой между карточками), на широком — рядом.
    const linkBetween = (x: Animal, y: Animal) =>
      x.traits.find((t) => t.pairWith === y.id) ?? y.traits.find((t) => t.pairWith === x.id);
    let i = 0;
    while (i < p.animals.length) {
      const first = p.animals[i]!;
      const items: React.ReactNode[] = [renderCard(first, i + 1)];
      while (i + 1 < p.animals.length) {
        const cur = p.animals[i]!;
        const next = p.animals[i + 1]!;
        const link = linkBetween(cur, next);
        if (!link) break;
        items.push(
          <PairPlate
            key={`pair-${link.cardId}`}
            type={link.type}
            color={pairs.colorOf.get(link.cardId)}
            note={pairs.plateNote.get(link.cardId)}
          />,
        );
        items.push(renderCard(next, i + 2));
        i += 1;
      }
      if (items.length === 1) {
        rows.push(items[0]);
      } else {
        rows.push(
          <div
            key={`pair-group-${first.id}`}
            className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-stretch"
          >
            {items}
          </div>,
        );
      }
      i += 1;
    }
  }

  const dropRow = isHuman
    ? {
        onDragOver: (e: React.DragEvent) => {
          if (dragId) e.preventDefault();
        },
        onDrop: () => {
          if (dragId) dispatch({ type: "reorderAnimal", animalId: dragId });
          setDragId(null);
          setOverId(null);
        },
      }
    : {};

  return (
    <section
      style={style}
      data-player-section={p.id}
      className={cn(
        "paper-sheet mb-3 rounded-[var(--radius-lg)] border bg-surface p-3 transition-[border-color,box-shadow] duration-[var(--motion-quick)] lg:mb-0",
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
        <span className="flex items-center gap-1.5 text-xs text-muted">
          {randomMutations ? (
            <img
              src={MUTATION_ART.deckBack}
              alt=""
              loading="lazy"
              title={`Слепая колода: ${p.blindDeckCount ?? p.blindDeck?.length ?? 0}`}
              className="h-5 w-3.5 rounded-[2px] border border-border object-cover"
            />
          ) : null}
          {randomMutations
            ? `колода ${p.blindDeckCount ?? p.blindDeck?.length ?? 0}`
            : `рука ${p.handCount ?? p.hand.length}`}{" "}
          · сброс {p.discardCount}
          {score !== null ? (
            <>
              {" · счёт "}
              <span
                title="Текущие очки: 2 за каждое животное вида + по очку за свойство и его бонус"
                className="font-display tabular-nums text-fg"
              >
                {score}
              </span>
            </>
          ) : null}
        </span>
      </div>
      {continents ? (
        // «Континенты»: территории игрока — две полосы континентов и океан.
        // Нумерация сквозная по всему табло (pairs.numberOf), не с нуля в каждой зоне.
        <div className="flex flex-col gap-2">
          {TERRITORIES.map((t) => {
            const animals = p.animals.filter((a) => (a.zoneId ?? "laurasia") === t.id);
            const pickable =
              isHuman &&
              placingAnimal !== undefined &&
              t.id !== "ocean" &&
              active;
            return (
              <TerritoryRow
                key={t.id}
                zone={t.id}
                name={t.name}
                count={animals.length}
                tall={placingAnimal !== undefined || animals.length > 0}
                pickable={pickable}
                onPickZone={
                  pickable
                    ? () => dispatch({ type: "devPlayAnimal", cardId: placingAnimal!, zoneId: t.id })
                    : undefined
                }
                dropHint={isHuman}
                onDropZone={
                  isHuman && dragIdRef.current
                    ? () => dispatch({ type: "reorderAnimal", animalId: dragIdRef.current!, toZoneId: t.id })
                    : undefined
                }
              >
                {animals.length === 0 ? (
                  <span className="px-1 text-[11px] text-subtle">
                    {t.id === "ocean" ? "пусто (нужна водоплавающая)" : "пусто"}
                  </span>
                ) : null}
                {animals.map((a) => renderCard(a, pairs.numberOf.get(a.id) ?? 1))}
              </TerritoryRow>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap items-stretch gap-2" {...dropRow}>
          {rows}
        </div>
      )}
    </section>
  );
});

/** Полоса одной территории в табло игрока («Континенты»). */
function TerritoryRow({
  zone,
  name,
  count,
  children,
  dropHint,
  onDropZone,
  tall,
  pickable,
  onPickZone,
}: {
  zone: TerritoryId;
  name: string;
  count: number;
  children: React.ReactNode;
  dropHint?: boolean;
  onDropZone?: () => void;
  /** Полоса с животными или ожидающая размещения — заметной высоты. */
  tall?: boolean;
  /** Животное ожидает выбора континента: полоса кликабельна. */
  pickable?: boolean;
  onPickZone?: () => void;
}) {
  return (
    <div
      data-zone={zone}
      role={pickable ? "button" : undefined}
      aria-label={pickable ? `Разместить на ${name}` : undefined}
      onClick={pickable ? onPickZone : undefined}
      onKeyDown={
        pickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPickZone?.();
              }
            }
          : undefined
      }
      tabIndex={pickable ? 0 : undefined}
      onDragOver={dropHint ? (e) => e.preventDefault() : undefined}
      onDrop={onDropZone}
      className={cn(
        "relative flex flex-wrap items-stretch gap-2 rounded-[var(--radius-md)] border border-dashed px-2 transition-all duration-[var(--motion-quick)]",
        zone === "ocean" && "water-strip",
        tall ? "min-h-[188px] py-2" : "min-h-[52px] py-2",
        zone === "ocean" ? "border-water/40 bg-water/10" : "border-border-strong/25 bg-bg/40",
        pickable &&
          "cursor-pointer border-solid border-accent ring-2 ring-accent/50 hover:bg-accent/15",
      )}
    >
      {pickable ? (
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs font-medium text-accent">
          нажмите, чтобы разместить на «{name}»
        </span>
      ) : null}
      <img
        src={TERRITORY_ART[zone]}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full rounded-[var(--radius-md)] object-cover opacity-[0.08]"
      />
      <span className="absolute -top-1.5 left-2 z-10 rounded-full border border-border bg-surface px-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-muted">
        {name} · {count}
      </span>
      {children}
    </div>
  );
}

/** Центральное поле: кубики кормовой базы, банк еды, индикатор года и фазы. */
function CenterField({
  year,
  lastYear,
  phase,
  bank,
  territoryFood,
  deckLeft,
  foodRoll,
  lastLog,
  actorName,
  deaths,
  plantsInfo,
  floraInfo,
  style,
}: {
  year: number;
  lastYear: boolean;
  phase: string;
  bank: number;
  /** «Континенты»: базы каждой территории. */
  territoryFood?: Partial<Record<TerritoryId, number>>;
  deckLeft: number;
  foodRoll: number[] | null;
  lastLog?: string;
  actorName?: string;
  deaths: number;
  /** «Растения»: сводка стола растений (без «Континентов»). */
  plantsInfo?: { count: number; food: number; shelters: number; deck: number };
  /** «Трава и грибы»: сводка стола флоры (без «Континентов»). */
  floraInfo?: { count: number; food: number; deck: number };
  style?: React.CSSProperties;
}) {
  const plantsSolo = Boolean(plantsInfo) && !territoryFood;
  const floraSolo = Boolean(floraInfo) && !territoryFood;
  const tableSolo = plantsSolo || floraSolo;
  // Без «Континентов» с растениями/флорой кубика нет вовсе: еда лежит на столе.
  const showDice = (phase === "foodBank" || phase === "feeding") && !tableSolo;
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

      {phase === "growth" ? (
        <div className="relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-leaf/60 bg-leaf/15 px-4 py-1.5 text-sm font-medium text-leaf">
          Рост: растения разрастаются
        </div>
      ) : phase === "extinction" ? (
        <div className="relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-danger/60 bg-danger/15 px-4 py-1.5 text-sm font-medium text-clay">
          Вымирание: погибает {deaths === 0 ? "никто" : `животных: ${deaths}`}
        </div>
      ) : tableSolo ? (
        <div
          className="relative flex flex-col items-center gap-1"
          title="Еда этого года лежит на столе — берите фишки с растений и карт флоры"
        >
          {plantsSolo && plantsInfo ? (
            <div className="flex flex-col items-center gap-1" title="Еда этого года лежит на растениях — берите фишки с них">
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(plantsInfo.food, 18) }).map((_, i) => (
                  <FoodCube key={i} tone="green" className="token-pop size-3.5" />
                ))}
                {plantsInfo.food > 18 ? <span className="text-[10px] tabular-nums text-muted">+{plantsInfo.food - 18}</span> : null}
              </div>
              <span className="font-display text-xl tabular-nums leading-none">{plantsInfo.food}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                фишек на {plantsInfo.count} растениях · убежищ {plantsInfo.shelters}
              </span>
            </div>
          ) : null}
          {floraSolo && floraInfo ? (
            <div className="flex flex-col items-center gap-1" title="Еда этого года — на травах и грибах">
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(floraInfo.food, 18) }).map((_, i) => (
                  <FoodCube key={i} tone="red" className="token-pop size-3.5" />
                ))}
                {floraInfo.food > 18 ? <span className="text-[10px] tabular-nums text-muted">+{floraInfo.food - 18}</span> : null}
              </div>
              <span className="font-display text-xl tabular-nums leading-none">{floraInfo.food}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                фишек на {floraInfo.count} травах и грибах
              </span>
            </div>
          ) : null}
        </div>
      ) : territoryFood && !plantsInfo && !floraInfo ? (
        <TerritoryBanks banks={territoryFood} active={phase === "feeding"} />
      ) : (
        <BankPile count={bank} active={phase === "feeding"} oceanOnly={Boolean(plantsInfo || floraInfo)} />
      )}

      {actorName && (phase === "feeding" || phase === "development") ? (
        <p className="relative text-xs text-accent">Ход: {actorName}</p>
      ) : null}
      {lastLog ? <p className="relative max-w-md text-center text-[11px] leading-snug text-muted">{lastLog}</p> : null}
    </section>
  );
}

/** Три банка «Континентов»: Лавразия / Гондвана / Океан — в один ряд. */
function TerritoryBanks({
  banks,
  active,
}: {
  banks: Partial<Record<TerritoryId, number>>;
  active: boolean;
}) {
  return (
    <div className="relative grid w-full max-w-sm grid-cols-3 gap-2">
      {TERRITORIES.map((t) => {
        const n = banks[t.id] ?? 0;
        return (
          <div
            key={t.id}
            title={`Кормовая база «${t.name}»`}
            className={cn(
              "flex flex-col items-center gap-1 rounded-[var(--radius-md)] border px-2 py-1.5",
              t.id === "ocean" ? "border-water/50 bg-water/15" : "border-border bg-bg/45",
            )}
          >
            {/* Квадратная миниатюра тайла территории: квадраты/вертикаль кадрируются по центру. */}
            <img
              src={TERRITORY_ART[t.id]}
              alt=""
              aria-hidden
              className="size-14 shrink-0 rounded-[var(--radius-sm)] border border-ink/20 object-cover shadow-[var(--shadow-card)]"
            />
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(n, 6) }).map((_, i) => (
                <FoodCube key={`${i}-${n}`} tone="red" className="token-pop size-3" />
              ))}
              {n > 6 ? <span className="text-[10px] tabular-nums text-muted">+{n - 6}</span> : null}
              {n === 0 ? <span className="text-[10px] text-subtle">{active ? "пусто" : "—"}</span> : null}
            </div>
            <span className="font-display text-lg leading-none tabular-nums">{n}</span>
          </div>
        );
      })}
    </div>
  );
}

function BankPile({ count, active, oceanOnly }: { count: number; active: boolean; oceanOnly?: boolean }) {
  return (
    <div className="relative flex flex-col items-center gap-1.5" title={active ? (oceanOnly ? "Кормовая база Океана — на континентах еда на растениях" : "Фишки кормовой базы — берите по одной в свой ход питания") : "Кормовая база"}>
      <div className="flex max-w-[260px] flex-wrap items-center justify-center gap-1">
        {count === 0 ? (
          <span className="text-xs text-subtle">{active ? (oceanOnly ? "океан пуст" : "база пуста") : "—"}</span>
        ) : (
          Array.from({ length: Math.min(count, 24) }).map((_, i) => (
            <FoodCube key={`${i}-${count}`} tone="red" className="token-pop size-4" />
          ))
        )}
        {count > 24 ? <span className="ml-1 text-xs tabular-nums text-muted">+{count - 24}</span> : null}
      </div>
      <span className="font-display text-xl tabular-nums leading-none">{count}</span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
        {oceanOnly ? "кормовая база океана" : "кормовая база"}
      </span>
    </div>
  );
}

/**
 * Кубики кормовой базы: физические 3D-кости (cannon-es) падают, сталкиваются
 * и сваливаются в кучку (~0.8 с), затем перекатываются выпавшими гранями
 * (~0.45 с). Итог появляется, когда кучка улеглась. Компонент перемонтируется
 * только со новым броском (ключ — значения кубиков).
 */
function DiceTray({ roll }: { roll: number[] | null }) {
  const [rolling, setRolling] = useState(Boolean(roll));
  const rollId = roll?.join(",") ?? "";
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rollId) return;
    setRolling(true);
    timer.current = setTimeout(() => setRolling(false), 1300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [rollId]);

  if (!roll) {
    return (
      <div className="relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2">
        <Dice3D values={[null, null]} rolling dieSize={44} />
        <span className="text-xs uppercase tracking-[0.18em] text-muted">бросок…</span>
      </div>
    );
  }

  const total = roll.reduce((s, d) => s + d, 0);
  return (
    <div className="relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2">
      <Dice3D values={roll} rolling={rolling} dieSize={44} ariaLabel={`Кубики кормовой базы: ${roll.join(", ")}`} />
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
    <div
      data-food-bank=""
      className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5"
      title="Кормовая база"
    >
      <span className="text-[10px] uppercase tracking-wider text-muted">База</span>
      <span className="font-display text-lg tabular-nums leading-none">{visible ? count : "—"}</span>
    </div>
  );
}

/**
 * Док фазы развития «Случайных мутаций»: карты в слепой колоде — игрок
 * сначала объявляет способ розыгрыша, потом движок вскрывает верхнюю карту.
 */
function MutateDock({
  human,
  intent,
  disabled,
  continents,
  canPlant,
  onNewAnimal,
  onTrait,
  onPop,
  onPlant,
  onPass,
  onCancel,
}: {
  human: Player;
  intent: UiIntent;
  disabled?: boolean;
  continents?: boolean;
  canPlant?: boolean;
  onNewAnimal: (zoneId?: TerritoryId) => void;
  onTrait: () => void;
  onPop: () => void;
  onPlant: () => void;
  onPass: () => void;
  onCancel: () => void;
}) {
  const left = human.blindDeck?.length ?? human.blindDeckCount ?? 0;
  const mutating = intent.kind === "mutateTrait" || intent.kind === "mutatePop" || intent.kind === "mutatePlant";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <img
            src={MUTATION_ART.icon}
            alt=""
            loading="lazy"
            className="size-4 shrink-0 rounded-full object-cover"
          />
          {disabled
            ? "Ход соперника"
            : mutating
              ? intent.kind === "mutateTrait"
                ? "Выберите свой вид из одного животного — карта вскроется на нём"
                : intent.kind === "mutatePop"
                  ? "Выберите вид — карта станет +1 животным"
                  : "Выберите растение — карта вскроется свойством на нём"
              : "Объявите розыгрыш верхней карты колоды — потом она вскроется"}
        </p>
        <span
          title={`Слепая колода: ${left}`}
          aria-label={`Колода: ${left}`}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface p-1 pr-2.5 text-xs text-muted"
        >
          <img
            src={MUTATION_ART.deckBack}
            alt=""
            loading="lazy"
            className="h-6 w-4 rounded-[2px] border border-border object-cover"
          />
          <span className="font-display text-sm tabular-nums leading-none">{left}</span>
        </span>
      </div>
      <div data-hand-row className="flex flex-wrap items-stretch gap-2">
        {continents ? (
          <>
            <button
              type="button"
              disabled={disabled || !left}
              onClick={() => onNewAnimal("laurasia")}
              className="flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50"
            >
              <span className="font-display">Новый вид · Лавразия</span>
              <span className="text-[10px] font-normal text-muted">карта ляжет животным</span>
            </button>
            <button
              type="button"
              disabled={disabled || !left}
              onClick={() => onNewAnimal("gondwana")}
              className="flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50"
            >
              <span className="font-display">Новый вид · Гондвана</span>
              <span className="text-[10px] font-normal text-muted">карта ляжет животным</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={disabled || !left}
            onClick={() => onNewAnimal()}
            className="flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50"
          >
            <span className="font-display">Новый вид</span>
            <span className="text-[10px] font-normal text-muted">карта ляжет животным</span>
          </button>
        )}
        <button
          type="button"
          disabled={disabled || !left}
          onClick={onTrait}
          className={cn(
            "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50",
            intent.kind === "mutateTrait"
              ? "border-accent bg-accent/15 text-fg"
              : "border-border bg-surface-2 text-fg hover:bg-surface",
          )}
        >
          <span className="font-display">Свойство</span>
          <span className="text-[10px] font-normal text-muted">на вид из одного животного</span>
        </button>
        <button
          type="button"
          disabled={disabled || !left}
          onClick={onPop}
          className={cn(
            "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50",
            intent.kind === "mutatePop"
              ? "border-accent bg-accent/15 text-fg"
              : "border-border bg-surface-2 text-fg hover:bg-surface",
          )}
        >
          <span className="font-display">+1 животное виду</span>
          <span className="text-[10px] font-normal text-muted">численность ≤ числа видов</span>
        </button>
        {canPlant ? (
          <button
            type="button"
            disabled={disabled || !left}
            onClick={onPlant}
            className={cn(
              "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50",
              intent.kind === "mutatePlant"
                ? "border-leaf bg-leaf/15 text-fg"
                : "border-border bg-surface-2 text-fg hover:bg-surface",
            )}
          >
            <span className="font-display">Свойство растения</span>
            <span className="text-[10px] font-normal text-muted">если в колоде есть такая грань</span>
          </button>
        ) : null}
        {mutating ? (
          <Button variant="ghost" size="sm" onClick={onCancel} title="Отменить выбор (Esc)">
            Отмена
          </Button>
        ) : null}
        <Button variant="secondary" size="sm" onClick={onPass} disabled={disabled}>
          Пас
        </Button>
      </div>
    </div>
  );
}

function DevDock({
  human,
  intent,
  disabled,
  continents,
  freshIds,
  onPlayAnimal,
  onPlaceAnimal,
  onPickTrait,
  onPass,
  onCancel,
}: {
  human: Player;
  intent: UiIntent;
  disabled?: boolean;
  /** «Континенты»: карта-животное кладётся с выбором континента. */
  continents?: boolean;
  /** Только что добранные карты — влетают каскадом с задержкой по индексу. */
  freshIds?: ReadonlySet<string>;
  onPlayAnimal: (id: string, zoneId?: TerritoryId) => void;
  /** «Континенты»: вместо немедленного хода — режим выбора территории кликом. */
  onPlaceAnimal?: (id: string) => void;
  onPickTrait: (id: string, face: number) => void;
  onPass: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted">
          {disabled
            ? "Ход соперника — карты остаются у вас"
            : intent.kind === "placeAnimal"
              ? "Выберите территорию на столе — животное разместится туда"
              : intent.kind === "playPlantTrait"
                ? intent.kind === "playPlantTrait" && "cardId" in intent
                  ? "Выберите растение для свойства"
                  : ""
                : intent.kind === "playPlantPair" && !("first" in intent && intent.first)
                  ? "Микориза: выберите первое растение"
                  : intent.kind === "playPlantPair"
                    ? "Второе растение микоризы"
                    : intent.kind === "playTrait"
                      ? "Выберите животное для свойства"
                      : intent.kind === "playPair" && !("first" in intent && intent.first)
                        ? "Парное свойство: выберите первое животное"
                        : intent.kind === "playPair"
                          ? "Второе животное пары"
                          : continents
                            ? "Карта как животное (затем клик по континенту) или свойство"
                            : "Карта как животное или свойство"}
        </p>
        <div className="flex shrink-0 gap-1">
          {intent.kind !== "none" ? (
            <Button variant="ghost" size="sm" onClick={onCancel} title="Отменить выбор (Esc)">
              Отмена
            </Button>
          ) : null}
          <Button variant="secondary" size="sm" onClick={onPass} disabled={disabled}>
            Пас
          </Button>
        </div>
      </div>
      <div data-hand-row className="flex gap-2 overflow-x-auto pb-1">
        {human.hand.map((card, i) => {
          const fresh = freshIds?.has(card.id);
          return (
            <div
              key={card.id}
              className={fresh ? "hand-card-in" : undefined}
              style={fresh ? { animationDelay: `${Math.min(i, 8) * 70}ms` } : undefined}
            >
              <HandCard
                card={card}
                disabled={disabled}
                selected={
                  (intent.kind !== "none" && "cardId" in intent && intent.cardId === card.id) ||
                  (intent.kind === "placeAnimal" && intent.cardId === card.id)
                }
                selectedFace={"face" in intent && intent.cardId === card.id ? (intent.face as number) : null}
                onSelect={(face) => {
                  if (face === "animal" && continents && onPlaceAnimal) {
                    onPlaceAnimal(card.id);
                  } else if (face === "animal") {
                    onPlayAnimal(card.id);
                  } else {
                    onPickTrait(card.id, face);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeedDock({
  acts,
  intentKind,
  bank,
  rageTurn,
  onIntent,
  onEndTurn,
  onSkip,
}: {
  acts: GameAction[];
  intentKind: string;
  bank: number;
  /** «Трава и грибы»: ход бешенства — только обязательная атака. */
  rageTurn?: { animalId: string } | null;
  onIntent: (i: { kind: "take" | "takePlant" | "takeFlora" | "hunt" | "pirate" | "shelter" | "plantAttack" | "parasitize" | "hibernate" | "fat" | "graze" | "none" }) => void;
  onEndTurn: () => void;
  onSkip: () => void;
}) {
  const dispatch = useGameStore((s) => s.dispatch);
  const takes = acts.filter((a): a is Extract<GameAction, { type: "feedTake" }> => a.type === "feedTake");
  const plantTakes = acts.filter((a): a is Extract<GameAction, { type: "feedTakePlant" }> => a.type === "feedTakePlant");
  const floraTakes = acts.filter((a): a is Extract<GameAction, { type: "feedTakeFlora" }> => a.type === "feedTakeFlora");
  const foodActs: GameAction[] = [...takes, ...plantTakes, ...floraTakes];
  const shelters = acts.filter((a): a is Extract<GameAction, { type: "feedShelter" }> => a.type === "feedShelter");
  const plantAttacks = acts.filter((a): a is Extract<GameAction, { type: "feedPlantAttack" }> => a.type === "feedPlantAttack");
  const parasitizes = acts.filter((a): a is Extract<GameAction, { type: "feedParasitize" }> => a.type === "feedParasitize");
  const canHunt = acts.some((a) => a.type === "feedHunt");
  const canPirate = acts.some((a) => a.type === "feedPirate");
  const sleeps = acts.filter((a): a is Extract<GameAction, { type: "feedHibernate" }> => a.type === "feedHibernate");
  const fats = acts.filter((a): a is Extract<GameAction, { type: "feedConvertFat" }> => a.type === "feedConvertFat");
  const grazes = acts.filter((a): a is Extract<GameAction, { type: "feedGraze" }> => a.type === "feedGraze");
  const migrations = acts.filter((a): a is Extract<GameAction, { type: "feedMigrate" }> => a.type === "feedMigrate");
  const canSkip = acts.some((a) => a.type === "feedSkip");
  const canSkipHint = !canSkip && (shelters.length > 0 || plantTakes.length > 0 || floraTakes.length > 0);
  if (rageTurn) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-danger/60 bg-danger/15 px-3 py-1 text-xs font-medium text-clay">
          Бешенство: животное обязано атаковать — выберите жертву
        </span>
        {canHunt ? (
          <Button variant="danger" size="sm" onClick={() => onIntent({ kind: "hunt" })}>
            Атака бешеного
          </Button>
        ) : (
          <span className="text-xs text-subtle">Допустимой жертвы нет — заканчивайте ход</span>
        )}
        <Button variant="secondary" size="sm" onClick={onEndTurn}>
          Закончить ход
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {bank > 0 ? (
        <span className="mr-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs tabular-nums text-muted">
          Океан: <span className="font-display text-sm text-fg">{bank}</span>
        </span>
      ) : null}
      {foodActs.length ? (
        <Button
          variant={intentKind === "take" || intentKind === "takePlant" || intentKind === "takeFlora" || intentKind === "none" ? "parchment" : "secondary"}
          size="sm"
          onClick={() => {
            if (foodActs.length === 1) dispatch(foodActs[0]!);
            else onIntent({ kind: plantTakes.length || floraTakes.length ? (floraTakes.length && !plantTakes.length ? "takeFlora" : "takePlant") : "take" });
          }}
        >
          Взять еду
        </Button>
      ) : null}
      {shelters.length ? (
        <Button
          variant={intentKind === "shelter" ? "parchment" : "secondary"}
          size="sm"
          title="Занять убежище растения: защита от хищников до конца фазы питания"
          onClick={() => {
            if (shelters.length === 1) dispatch(shelters[0]!);
            else onIntent({ kind: "shelter" });
          }}
        >
          Убежище
        </Button>
      ) : null}
      {plantAttacks.length ? (
        <Button
          variant={intentKind === "plantAttack" ? "danger" : "secondary"}
          size="sm"
          title="Направить хищное растение на жертву (раз за фазу)"
          onClick={() => {
            if (plantAttacks.length === 1) dispatch(plantAttacks[0]!);
            else onIntent({ kind: "plantAttack" });
          }}
        >
          Хищное растение
        </Button>
      ) : null}
      {parasitizes.length ? (
        <Button
          variant={intentKind === "parasitize" ? "parchment" : "secondary"}
          size="sm"
          title="Перекинуть фишку с растения-хозяина на растение-паразит"
          onClick={() => {
            if (parasitizes.length === 1) dispatch(parasitizes[0]!);
            else onIntent({ kind: "parasitize" });
          }}
        >
          На паразита
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
            if (sleeps.length === 1) dispatch(sleeps[0]!);
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
            if (fats.length === 1) dispatch(fats[0]!);
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
            if (grazes.length === 1) dispatch(grazes[0]!);
            else onIntent({ kind: "graze" });
          }}
        >
          Топтун
        </Button>
      ) : null}
      {migrations.length ? (
        migrations.length === 1 ? (
          <Button variant="secondary" size="sm" onClick={() => dispatch(migrations[0])}>
            Миграция
          </Button>
        ) : (
          <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
            {migrations.map((m, i) => {
              const target = m.moves[0]!.to;
              const label = target === "laurasia" ? "↑ Лавразия" : target === "gondwana" ? "↓ Гондвана" : "≈ Океан";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => dispatch(m)}
                  className="rounded-[var(--radius-xs)] px-2 py-1 text-xs font-medium text-fg hover:bg-ink/10"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )
      ) : null}
      <Button variant="secondary" size="sm" onClick={onEndTurn}>
        Закончить ход
      </Button>
      {intentKind !== "none" ? (
        <Button variant="ghost" size="sm" onClick={() => onIntent({ kind: "none" })} title="Отменить выбор (Esc)">
          Отмена
        </Button>
      ) : null}
      {canSkip ? (
        <Button variant="ghost" size="sm" onClick={onSkip} title="Пас до конца фазы питания">
          Пас
        </Button>
      ) : canSkipHint ? (
        <span className="text-xs text-subtle" title="Пока хотя бы одно ваше животное способно получить еду или убежище, пасовать нельзя (правила «Растений»)">
          Пас недоступен — есть доступная еда или убежища
        </span>
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
  const tails = acts.filter(
    (a): a is Extract<GameAction, { type: "chooseDefense" }> => a.type === "chooseDefense" && a.kind === "tailLoss",
  );

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
          {tails.map((a) => (
            <Button key={a.discardTraitId} variant="secondary" onClick={() => onPick(a)}>
              Отбросить хвост
            </Button>
          ))}
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
