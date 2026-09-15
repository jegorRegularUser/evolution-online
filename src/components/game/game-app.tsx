import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Over,
} from "@dnd-kit/core";
import { BookOpen, Eye, LayoutGrid, List, Minimize2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TRAITS } from "@/game/traits";
import type { Animal, Card, FloraCard, GameAction, GameEvent, GameState, LogEntry, Plant, Player, TerritoryId, TraitId } from "@/game/types";
import { TERRITORIES } from "@/game/types";
import { currentActor, feedBlockReasonInfo, legalDefenseActions, legalDevActions, legalFeedActions } from "@/game/engine";
import { canAttack, canPlantAttackTarget, canReceiveFood, canRageAttack, findAnimal, foodNeeded, hasTrait, isFed, liveScore, player } from "@/game/queries";
import {
  achievementDesc,
  achievementName,
  floraName,
  markName,
  plantName,
  territoryName,
  traitName,
  translate,
  useLang,
  useT,
  t as liveT,
  type Lang,
  type TKey,
  type TParams,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { sfx, type AmbientMood, type SfxId } from "@/lib/sfx";
import { emptySession, recordGame, type SessionCounters } from "@/lib/stats";
import { BG, MUTATION_ART, PHASE_ICON, TERRITORY_ART } from "@/lib/art";
import { useGameStore, typingNamesOf, type NetUiState, type UiIntent } from "@/store/game-store";
import { AnimalCard, CardPreview, HandCard, PAIR_COLORS, PairPlate, type PairMark } from "./cards";
import { FloraStrip } from "./cards-flora";
import { PlantStrip } from "./cards-plants";
import { ConfirmDialog } from "./confirm-dialog";
import { Dice3D } from "./dice-3d";
import { EventFeed, reactionsByChatId, type FeedItem } from "./event-feed";
import { colorForSeat, PACE, REACTION_EMOJI } from "@/lib/net/shared";
import { HintNote } from "./hint-note";
import { FoodCube } from "./icons";
import { LobbyScreen } from "./net-screens";
import { GameOverScreen, MenuScreen, RulesPanel } from "./screens";
import { EventSpotlight } from "./spotlight";
import { SoundToggle } from "./sound-toggle";
import { TopBar } from "./top-bar";

/**
 * Вёрстка стола: «cozy» — компактное сукно по центру, «wide» — во всю ширину
 * с прижатыми к краям секциями. Переключается одной кнопкой в шапке.
 */
function loadTableLayout(): "cozy" | "wide" {
  try {
    return localStorage.getItem("evo-table-layout") === "wide" ? "wide" : "cozy";
  } catch {
    return "cozy";
  }
}

const PHASE_LABEL: Record<string, TKey> = {
  development: "phase.development",
  foodBank: "phase.foodBank",
  feeding: "phase.feeding",
  extinction: "phase.extinction",
  growth: "phase.growth",
  gameOver: "phase.gameOver",
};

// ── локализация журнала движка и причин блокировок (волна 8) ────────────────

/**
 * Текст записи журнала на языке рендера: при наличии key собирается из
 * словаря (параметры-термины переводятся), иначе показывается русский text
 * движка (старые кадры и сейвы без key).
 */
function logEntryText(lang: Lang, entry: LogEntry): string {
  if (!entry.key) return entry.text;
  const params: TParams = {};
  for (const [k, v] of Object.entries(entry.params ?? {})) {
    params[k] = termParamValue(lang, k, v);
  }
  return translate(lang, entry.key as TKey, params);
}

/**
 * Значение параметра записи журнала: движок кладёт в params id свойства/
 * растения/флоры/метки/территории (см. log() в engine.ts), рендер подставляет
 * имя на нужном языке через хелперы terms.ts. Остальные параметры — как есть.
 */
function termParamValue(lang: Lang, name: string, value: string | number): string {
  if (typeof value !== "string") return String(value);
  switch (name) {
    case "trait":
    case "trait2":
      return traitName(value, lang);
    case "plant":
    case "plant2":
      return plantName(value, lang);
    case "flora":
      return floraName(value, lang);
    case "mark":
      return markName(value, lang);
    case "zone":
      return territoryName(value, lang);
    default:
      return value;
  }
}

/** Причина блокировки действия питания на языке рендера. */
function feedBlockText(lang: Lang, info: { key: string } | null): string | undefined {
  return info ? translate(lang, info.key as TKey) : undefined;
}

/** Мягкая подложка секции игрока: цвет места, подмешанный к фону стола. */
function seatTint(color: string | undefined): React.CSSProperties | undefined {
  if (!color) return undefined;
  return { backgroundColor: `color-mix(in oklab, ${color} 12%, var(--color-surface))` };
}

/**
 * Колонки полосы соперников. Одна функция на верхний и нижний ряд: ряды не
 * должны отличаться числом колонок (M13). Классы литеральные — динамическую
 * сборку Tailwind в исходнике не видит.
 */
function rowCols(n: number): string | false {
  if (n <= 1) return false;
  return n === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
}

interface Interaction {
  highlight: boolean;
  dimmed: boolean;
  selected: boolean;
  /** Животное — цель атаки/пиратства: красная подсветка с трещинами. */
  danger: boolean;
  /** Цель броска карты из руки: показываем акцентное кольцо. */
  dropTarget: boolean;
}

const NO_INTERACTION: Interaction = { highlight: false, dimmed: false, selected: false, danger: false, dropTarget: false };

// ── Перетаскивание (@dnd-kit): животные и карты руки ─────────────────────────

/** Что за элемент едет: животное, карта руки, ряд, территория или стол растений. */
type DndKind = "animal" | "card" | "row" | "zone" | "plants";

/** Данные, которые едут вместе с id перетаскиваемого и с id цели. */
interface DndData {
  kind: DndKind;
  /** Владелец животного/карты: свои цели отличаем от чужих. */
  ownerId?: number;
  animalId?: string;
  cardId?: string;
  playerId?: number;
  zoneId?: TerritoryId;
}

/** id животного один для драга и для броска: dnd-kit разрешает совмещать. */
const animalDndId = (id: string) => `animal:${id}`;
const rowDndId = (playerId: number) => `row:${playerId}`;
const zoneDndId = (playerId: number, zone: TerritoryId) => `zone:${playerId}:${zone}`;

/** Подсказки перетаскивания для своего табло (чужое табло — не цель). */
interface DndHints {
  /** Куда встанет перетаскиваемое животное: индикатор у карточки-цели. */
  insert?: { id: string; side: "before" | "after" };
  /** Бросок в полосу территории сейчас возможен (карта или своё животное). */
  zoneDrop: boolean;
  /** Полоса территории под указателем. */
  zoneOver?: TerritoryId | null;
}

/**
 * Какие бросочные цели вообще допустимы для текущего перетаскивания.
 * Животное — только свои (перестановка/перенос), карта — чужие звери тоже
 * (свойства-паразиты), плюс растения и своя пустая зона под новое животное.
 */
function dndTargetAllowed(active: DndData | undefined, target: DndData | undefined): boolean {
  if (!active || !target) return false;
  if (active.kind === "animal") {
    if (target.kind === "animal") return target.ownerId === active.ownerId;
    if (target.kind === "zone") return target.playerId === active.ownerId;
    return false;
  }
  if (active.kind === "card") {
    if (target.kind === "animal" || target.kind === "plants") return true;
    if (target.kind === "row" || target.kind === "zone") return target.playerId === active.ownerId;
    return false;
  }
  return false;
}

/**
 * Цель под указателем. Среди вложенных областей выигрывает самая маленькая:
 * иначе при броске на животное «побеждала» бы полоса всего ряда.
 */
const dndCollisionDetection: CollisionDetection = (args) => {
  const active = args.active.data.current as DndData | undefined;
  const allowed = args.droppableContainers.filter((c) =>
    dndTargetAllowed(active, c.data.current as DndData | undefined),
  );
  if (!allowed.length) return [];
  const scope = { ...args, droppableContainers: allowed };
  const selfId = args.active.id;
  const inside = pointerWithin(scope).filter((c) => c.id !== selfId);
  if (!inside.length) return rectIntersection(scope).filter((c) => c.id !== selfId);
  const area = (id: string | number) => {
    const r = args.droppableRects.get(id);
    return r ? r.width * r.height : Number.MAX_SAFE_INTEGER;
  };
  return [...inside].sort((a, b) => area(a.id) - area(b.id));
};

/** Точка последнего движения указателя/пальца — нужна для стороны вставки. */
function dndPointOf(e: PointerEvent | TouchEvent): { x: number; y: number } | null {
  if ("touches" in e) {
    const t = e.touches[0] ?? e.changedTouches[0];
    return t ? { x: t.clientX, y: t.clientY } : null;
  }
  return { x: e.clientX, y: e.clientY };
}

/** Куда встанет животное: до или после карточки-цели (по X пальца/курсора). */
function dndSideOf(over: Over | null, point: { x: number; y: number } | null): "before" | "after" | null {
  const data = over?.data.current as DndData | undefined;
  if (!over || data?.kind !== "animal") return null;
  const mid = over.rect.left + over.rect.width / 2;
  const x = point?.x ?? mid;
  return x < mid ? "before" : "after";
}

/** Растение под точкой броска: карточки растений — чужой файл, поэтому ищем по DOM. */
function plantIdAtPoint(point: { x: number; y: number } | null): string | null {
  if (!point) return null;
  for (const el of document.elementsFromPoint(point.x, point.y)) {
    // «Призрак» карты едет под самым пальцем — его пропускаем.
    if (el.closest("[data-dnd-ghost]")) continue;
    const plant = el.closest<HTMLElement>("[data-plant-id]");
    if (plant) return plant.dataset.plantId ?? null;
  }
  return null;
}

/** Связка пары (сотрудничество/симбиоз): переставлять её нужно целиком. */
function pairGroupIds(animals: Animal[], id: string): Set<string> {
  const byId = new Map(animals.map((a) => [a.id, a]));
  const partners = (a: Animal): string[] => [
    ...a.traits.map((t) => t.pairWith).filter((x): x is string => Boolean(x)),
    ...animals.filter((o) => o.traits.some((t) => t.pairWith === a.id)).map((o) => o.id),
  ];
  const group = new Set<string>([id]);
  const queue = [id];
  while (queue.length) {
    const cur = byId.get(queue.pop()!);
    if (!cur) continue;
    for (const next of partners(cur)) {
      if (group.has(next)) continue;
      group.add(next);
      queue.push(next);
    }
  }
  return group;
}

/** Территория животного: без «Континентов» все стоят в Лавразии по умолчанию. */
const zoneOfAnimal = (a: Animal): TerritoryId => a.zoneId ?? "laurasia";

/** Свойства карты-животного: только они умеют cardId/face/цель. */
type DevCardAction = Extract<
  GameAction,
  { type: "devPlayTrait" | "devPlayPair" | "devPlayPlantTrait" | "devPlayPlantPair" }
>;

/** Набор id растений, на которые карта ляжет свойством (для подсветки при драге). */
function legalPlantTargets(actions: GameAction[], cardId: string, face: number | null): Set<string> {
  const set = new Set<string>();
  for (const a of actions) {
    if (a.type !== "devPlayPlantTrait" && a.type !== "devPlayPlantPair") continue;
    if (a.cardId !== cardId || (face != null && a.face !== face)) continue;
    if (a.type === "devPlayPlantTrait") set.add(a.plantId);
    else {
      set.add(a.a);
      set.add(a.b);
    }
  }
  return set;
}

/**
 * Растения приглушаются, только когда набор подсветок непустой (так устроен
 * PlantStrip). Чтобы «сюда нельзя» всё-таки читалось приглушением, добавляем
 * заведомо несуществующий id.
 */
const NO_PLANT_TARGET = "__no-plant-target__";

/**
 * Голосовые подсказки перетаскивания для скринридеров. Строки собираются в
 * момент события (не рендера), поэтому живой liveT честно отдаёт текущий язык.
 */
const DND_ANNOUNCEMENTS = {
  onDragStart: () => liveT("dnd.start"),
  onDragOver: () => liveT("dnd.over"),
  onDragEnd: () => liveT("dnd.end"),
  onDragCancel: () => liveT("dnd.cancel"),
};

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
          push(anchorOf(animalEl(e.preyId) ?? animalEl(e.carnivoreId)), liveT("fx.attack"), "attack");
          break;
        }
        case "preyKilled":
          push(anchorOf(animalEl(e.carnivoreId)), liveT("fx.preyEaten"), "attack");
          break;
        case "defenseUsed": {
          const prey = animalEl(e.preyId);
          if (e.defense === "tailLoss") {
            shakeEl(prey);
            push(anchorOf(prey), liveT("fx.tail"), "bad");
          } else if (e.defense === "running") {
            shakeEl(prey);
            push(anchorOf(prey), liveT("fx.die", { n: e.roll ?? 0 }), "info");
          } else if (e.defense === "mimicry") {
            push(anchorOf(prey), liveT("fx.mimicry"), "info");
          }
          break;
        }
        case "foodFromBank":
          push(anchorOf(animalEl(e.animalId)), liveT("fx.redFood"), "good");
          break;
        case "blueFood": {
          // Цвет фишки виден на карточке, а подпись объясняет, откуда она.
          const label =
            e.reason === "piracy"
              ? liveT("fx.piracy")
              : e.reason === "cooperation"
                ? liveT("fx.cooperation")
                : e.reason === "scavenger"
                  ? liveT("fx.scavenger")
                  : e.reason === "fat"
                    ? liveT("fx.fat")
                    : e.reason === "tailLoss"
                      ? liveT("fx.blue")
                      : null; // «hunt» уже подписан в preyKilled
          if (label) push(anchorOf(animalEl(e.animalId)), label, "info");
          break;
        }
        case "bankBurned":
          push(anchorOf(document.querySelector(".felt")), liveT("fx.bankBurn", { n: e.amount }), "bad");
          break;
        // ── «Растения» ──
        case "plantFoodTaken":
          push(anchorOf(animalEl(e.animalId)), liveT("fx.plantFood"), "good");
          break;
        case "shelterTaken":
          push(anchorOf(animalEl(e.animalId)), liveT("fx.shelter"), "good");
          break;
        case "plantAttack":
          shakeEl(animalEl(e.preyId));
          push(anchorOf(animalEl(e.preyId)), e.counter ? liveT("fx.plantCounter") : liveT("fx.plantAttack"), "attack");
          break;
        case "plantGrew":
          push(anchorOf(plantEl(e.plantId)), liveT("fx.growth", { from: e.from, to: e.to }), "good");
          break;
        case "plantGrazed":
          push(anchorOf(plantEl(e.plantId)), liveT("fx.graze"), "bad");
          break;
        case "plantDied":
          push(anchorOf(plantEl(e.plantId)), liveT("fx.plantDied"), "bad");
          break;
        case "cardStolen":
          push(anchorOf(sectionEl(e.toPlayerId)), liveT("fx.honeyCard"), "info");
          break;
        // ── «Трава и грибы» ──
        case "floraFoodTaken":
          push(anchorOf(animalEl(e.animalId)), liveT("fx.floraFood"), "good");
          break;
        case "floraGrew":
          push(anchorOf(floraEl(e.floraId)), liveT("fx.fungusGrowth", { from: e.from, to: e.to }), "info");
          break;
        case "floraGrazed":
          push(anchorOf(floraEl(e.floraId)), liveT("fx.graze"), "bad");
          break;
        case "floraDied":
          push(anchorOf(floraEl(e.floraId)), liveT("fx.floraDied"), "bad");
          break;
        case "markGained":
          push(anchorOf(animalEl(e.animalId)), liveT("fx.mark", { mark: markName(e.mark) }), "bad");
          break;
        case "handLost":
          push(anchorOf(sectionEl(e.playerId)), liveT("fx.handLost"), "bad");
          break;
        case "cardsDrawn": {
          for (let i = 0; i < e.counts.length; i++) {
            const n = e.counts[i]!;
            if (n > 0) {
              // Русская форма множественного числа: 1 карта / 2–4 карты / 5+ карт.
              const label = n === 1 ? liveT("fx.cardsOne", { n }) : n < 5 ? liveT("fx.cardsFew", { n }) : liveT("fx.cardsMany", { n });
              push(anchorOf(sectionEl(i)), label, "info");
            }
          }
          break;
        }
        // ── «Случайные мутации» ──
        case "mutationFlipped": {
          // Флип-карта — общая для всех вскрытий; подпись зависит от розыгрыша.
          const trait = e.trait ? traitName(e.trait) : "";
          const caption =
            e.usedAs === "trait"
              ? liveT("fx.mutTrait", { trait })
              : e.usedAs === "animal"
                ? liveT("fx.mutAnimal")
                : e.usedAs === "newSpecies"
                  ? liveT("fx.mutMutant")
                  : e.usedAs === "population"
                    ? liveT("fx.mutPopulation")
                    : e.usedAs === "plantTrait"
                      ? liveT("fx.mutPlantTrait", { trait })
                      : liveT("fx.mutDiscarded");
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
 * Чей это событие: id игрока, если его можно определить, иначе undefined.
 * Нужно, чтобы озвучивать чужие действия тише (gain) — свои звучат в полную.
 */
function eventOwnerId(state: GameState, e: GameEvent): number | undefined {
  switch (e.kind) {
    case "passed":
    case "handLost":
    case "mutationFlipped":
    case "foodFromBank":
    case "plantFoodTaken":
    case "floraFoodTaken":
      return e.playerId;
    case "cardStolen":
      return e.toPlayerId;
    case "huntDeclared":
    case "preyKilled":
      return findAnimal(state, e.carnivoreId)?.ownerId;
    case "foodToFat":
    case "blueFood":
    case "traitPlaced":
    case "shelterTaken":
    case "budding":
    case "populationGrown":
    case "populationLost":
      return findAnimal(state, e.animalId)?.ownerId;
    case "plantAttack":
      return findAnimal(state, e.preyId)?.ownerId;
    case "cardsDrawn":
      return (e.counts[state.humanId] ?? 0) > 0 ? state.humanId : undefined;
    default:
      return undefined;
  }
}

/**
 * Звук одного события; null — событие молчит. `gameFinished` не озвучиваем:
 * экран финала сам играет win/lose. Свой пас тоже молчит — его озвучивает
 * кнопка (клик по «Пас»/«Закончить ход»), иначе звучало бы дважды.
 */
function eventSfx(state: GameState, e: GameEvent): SfxId | null {
  switch (e.kind) {
    case "diceRoll":
    case "territoryDice":
      return "roll";
    case "huntDeclared":
    case "plantAttack":
      return "hunt";
    case "preyKilled":
      return "kill";
    case "defenseUsed":
      return e.defense === "running" ? "defense" : e.defense === "none" ? null : "dodge";
    case "foodFromBank":
    case "plantFoodTaken":
    case "floraFoodTaken":
      return "food";
    case "blueFood":
      return "foodBlue";
    case "foodToFat":
      return "fat";
    case "animalDied":
      return "death";
    case "cardsDrawn":
    case "cardStolen":
      return "draw";
    case "traitPlaced":
    case "animalPlaced":
    case "budding":
      return "card";
    case "plantPlaced":
    case "floraPlaced":
    case "edificator":
      return "plant";
    case "markGained":
      return "mark";
    case "mutationFlipped":
    case "traitsRevealed":
      return "flip";
    // ── Ранее немые события ──
    case "passed":
      return e.playerId === state.humanId ? null : "pass";
    case "migrated":
      return "migrate";
    case "bankBurned":
      return "burn";
    case "shelterTaken":
      // Убежище — жетон, который животное занимает: короткий деревянный стук.
      return "card";
    case "regenerated":
    case "populationGrown":
    case "plantGrew":
    case "floraGrew":
    case "plantGrazed":
    case "floraGrazed":
      return "grow";
    case "populationLost":
    case "plantDied":
    case "floraDied":
      return "wither";
    case "handLost":
      // Рука уходит в сброс — тихий нисходящий блип «потери».
      return "leave";
    case "paralyzed":
      return "dodge";
    case "gameFinished":
      return null;
  }
}

/**
 * Раскладывает звуки событий каскадом (шаг ~70 мс), чтобы цепочка
 * «атака → кубик → спаслось» звучала по порядку, а не одной кучей.
 * Чужие события звучат тише; базовый gain приглушает проигрывание
 * пропущенных сетевых батчей. Используется и живым кадром (useSfx),
 * и очередью воспроизведения сети.
 */
function playEventsSfx(events: GameEvent[], state: GameState, baseGain = 1, maxDelay = 0.5) {
  const queue: Array<{ id: SfxId; at: number; gain: number }> = [];
  for (const e of events) {
    const id = eventSfx(state, e);
    if (!id) continue;
    const owner = eventOwnerId(state, e);
    const gain = owner !== undefined && owner !== state.humanId ? 0.65 : 1;
    queue.push({ id, at: Math.min(queue.length * 0.07, maxDelay), gain });
  }
  for (const q of queue) sfx.play(q.id, q.at, { gain: q.gain * baseGain });
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
      if (!firstFrame) playEventsSfx(state.lastEvents, state);
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
 * Летящая фишка еды: стартует точно от источника (инлайн-трансформ виден ещё
 * до первого кадра анимации) и перелетает к животному через Web Animations
 * API — надёжнее CSS-keyframes с переменными и без «висения» на старте.
 */
function FlyingCube({ item, onDone }: { item: FlyingFood; onDone: (id: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // onDone дергается из onfinish — держим актуальную ссылку без перезапуска эффекта.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDoneRef.current(item.id);
      return;
    }
    const anim = el.animate(
      [
        { transform: `translate(${item.from.x}px, ${item.from.y}px) scale(0.9)`, opacity: "0" },
        { transform: `translate(${item.from.x}px, ${item.from.y}px) scale(1)`, opacity: "1", offset: 0.15 },
        { transform: `translate(${item.to.x}px, ${item.to.y}px) scale(1.06)`, opacity: "1", offset: 0.78 },
        { transform: `translate(${item.to.x}px, ${item.to.y}px) scale(0.6)`, opacity: "0" },
      ],
      { duration: 500, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
    );
    anim.onfinish = () => onDoneRef.current(item.id);
    return () => anim.cancel();
  }, [item]);

  return (
    <div
      ref={ref}
      className="food-fly"
      style={{ transform: `translate(${item.from.x}px, ${item.from.y}px)` }}
    >
      <FoodCube tone={item.tone} className="size-5 drop-shadow-md" />
    </div>
  );
}

/**
 * Фишка еды «летит» по столу от источника (кормовая база, растение, флора)
 * к карточке животного — вместо простого pop-in на месте. Работает поверх
 * тех же событий последнего действия, что и визуальные бейджи.
 */
function useFoodFly(state: GameState | null): { flies: FlyingFood[]; remove: (id: number) => void } {
  const [items, setItems] = useState<FlyingFood[]>([]);
  const seqRef = useRef(0);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((b) => b.id !== id));
  }, []);

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
          // Еда лежит на сукне в центре стола — фишка летит оттуда наружу
          // к животному, с какой бы стороны стола игрок ни сидел.
          push(felt(), centerOf(animalEl(e.animalId)), "red");
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
      // Страховка: если вкладка была скрыта и onfinish не пришёл.
      const ids = new Set(created.map((c) => c.id));
      setTimeout(() => setItems((prev) => prev.filter((b) => !ids.has(b.id))), 2000);
    }
  }, [state]);

  return { flies: items, remove };
}

// ── Фон, сетевые звуки и проигрывание пропущенных батчей ─────────────────────

/** Настроение тихого фона по фазе партии (не музыка — медленные дрон-слои). */
function ambientMoodFor(phase: string): AmbientMood {
  if (phase === "feeding") return "feeding";
  if (phase === "extinction") return "extinction";
  if (phase === "gameOver") return "final";
  return "development";
}

/**
 * Проигрывание пропущенных сетевых батчей. При отставании поллинга сервер
 * присылает события каждого шага (EventBatch); последний батч уже нарисован
 * текущим кадром состояния, поэтому играем только пропущенные шаги — по
 * порядку и не больше шести (старые схлопываем, чтобы не копить долг).
 * Первый кадр и реконнект историю не проигрывают: версии просто отмечаются
 * просмотренными, иначе стол «вспоминал» бы партию с начала.
 *
 * Список считается синхронно в рендере, а не в эффекте: батчи и состояние
 * приходят одним кадром, и события успевают встать в очередь показа ДО
 * живого кадра — раньше эффект опаздывал на кадр и ставил пропущенные
 * карточки ПОСЛЕ текущих, задом наперёд.
 */
const REPLAY_MAX_BATCHES = 6;
const NO_REPLAY: GameEvent[] = [];

function useNetReplay(state: GameState | null, net: NetUiState | null): GameEvent[] {
  const playedRef = useRef(0);
  const startedRef = useRef(false);
  const statusRef = useRef<string | null>(null);
  const missedRef = useRef<GameEvent[]>(NO_REPLAY);
  const batches = net?.events;
  const status = net?.status ?? null;

  // Обрыв связи и возврат: за время переподключения батчей могло накопиться
  // много, и «догонять» их все задним числом не нужно — следующий кадр просто
  // отмечается просмотренным (состояние и так покажет актуальную картину).
  useEffect(() => {
    const prev = statusRef.current;
    statusRef.current = status;
    if (prev === "reconnecting" && status && status !== "reconnecting") {
      startedRef.current = false;
    }
  }, [status]);

  if (state && batches?.length) {
    const pending = batches
      .filter((b) => b.version > playedRef.current)
      .sort((a, b) => a.version - b.version);
    if (pending.length) {
      playedRef.current = pending[pending.length - 1]!.version;
      const wasStarted = startedRef.current;
      startedRef.current = true;
      missedRef.current = wasStarted
        ? pending.slice(0, -1).slice(-REPLAY_MAX_BATCHES).flatMap((b) => b.events)
        : NO_REPLAY;
    }
  }
  return missedRef.current;
}

/** Тихий щелчок на кнопках дока: карточки и поля молчат, чтобы не шуметь. */
function dockClickSfx(e: React.MouseEvent) {
  if ((e.target as HTMLElement).closest("button")) sfx.play("click");
}

/**
 * Появление/пропадание игроков в сети: join на вошедшего, leave на ушедшего.
 * Первый кадр не озвучиваем (вся комната «уже там»), ботов не считаем.
 */
function useNetPresenceSfx(seats: NetUiState["seats"] | undefined) {
  const prevRef = useRef<Map<number, boolean> | null>(null);
  useEffect(() => {
    const list = seats ?? [];
    const next = new Map(list.map((s) => [s.seat, s.online]));
    const prev = prevRef.current;
    prevRef.current = next;
    if (!prev) return;
    for (const info of list) {
      if (info.isAI) continue;
      const was = prev.get(info.seat);
      if (was === undefined || was === info.online) continue;
      sfx.play(info.online ? "join" : "leave", 0, { gain: 0.8 });
    }
  }, [seats]);
}

/** Новое сообщение чата — мягкий «дзинь» (историю при входе не озвучиваем). */
function useNetChatSfx(chat: NetUiState["chat"] | undefined) {
  const lastIdRef = useRef<number | null>(null);
  useEffect(() => {
    const list = chat ?? [];
    if (!list.length) return;
    const maxId = list[list.length - 1]!.id;
    const prev = lastIdRef.current;
    lastIdRef.current = maxId;
    if (prev === null || maxId <= prev) return;
    sfx.play("chat", 0, { gain: 0.9 });
  }, [chat]);
}

/** «Последний год»: короткий баннер на входе в последний год, дальше сам гаснет. */
function useLastYearBanner(state: GameState): boolean {
  const [visible, setVisible] = useState(false);
  const keyRef = useRef("");
  useEffect(() => {
    const key = `${state.year}:${state.lastYear}`;
    if (!state.lastYear) {
      keyRef.current = key;
      setVisible(false);
      return;
    }
    if (keyRef.current === key) return;
    keyRef.current = key;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3400);
    return () => clearTimeout(t);
  }, [state.year, state.lastYear]);
  return visible;
}

/**
 * Ненавязчивые баннеры над столом: «последний год» и «безумие» (раунд
 * человека играет сосед — частая причина ощущения «пас нажался сам»).
 * Ничего не перекрывают: узкие полосы с pointer-events-none.
 */
function TableBanners({ state }: { state: GameState }) {
  const t = useT();
  const lastYear = useLastYearBanner(state);
  const mad = state.madTurn === state.humanId;
  if (!lastYear && !mad) return null;
  return (
    <div className="pointer-events-none flex flex-col items-center gap-1 px-3 pt-2">
      {mad ? (
        <p className="phase-banner-in rounded-full border border-virus/60 bg-virus/15 px-4 py-1 text-center text-xs text-fg">
          {t("game.madBanner")}
        </p>
      ) : null}
      {lastYear ? (
        <p className="phase-banner-in rounded-full border border-clay/60 bg-clay/15 px-4 py-1 text-center text-xs font-medium text-clay">
          {t("game.lastYearBanner")}
        </p>
      ) : null}
    </div>
  );
}

export function GameApp() {
  const state = useGameStore((s) => s.state);
  const rulesOpen = useGameStore((s) => s.rulesOpen);
  const setRulesOpen = useGameStore((s) => s.setRulesOpen);
  const net = useGameStore((s) => s.net);
  const netAgain = useGameStore((s) => s.netAgain);
  const leaveNet = useGameStore((s) => s.leaveNet);
  const t = useT();

  // Модалки (правила, статистика, обучение) звучат тихим свушем на вход и выход.
  const openRules = useCallback(() => {
    sfx.play("modal");
    setRulesOpen(true);
  }, [setRulesOpen]);
  const closeRules = useCallback(() => {
    sfx.play("modal");
    setRulesOpen(false);
  }, [setRulesOpen]);

  // AudioContext живёт только после пользовательского жеста — будим по первому
  // клику/тапу/клавише. Слушатели висят на уровне всего приложения (а не стола),
  // поэтому клик в меню — старт партии, правила, обучение — уже включает звук.
  useEffect(() => {
    const unlock = () => sfx.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Меню: стола нет — единственный путь в партию лежит через сервер.
  if (!net) {
    return (
      <div className="menu-screen">
        <MenuScreen onRules={openRules} />
        {rulesOpen ? <RulesPanel onClose={closeRules} /> : null}
        <Toaster {...TOASTER_OPTS} />
      </div>
    );
  }

  // Лобби показываем только до партии (и пока ждём код стола).
  // «finished» — это НЕ лобби: завершённая партия обязана показать стол
  // и финальный счёт; «reconnecting» и «playing» — тем более.
  if (net.status === "lobby") {
    return (
      <>
        <LobbyScreen />
        {rulesOpen ? <RulesPanel onClose={closeRules} /> : null}
        <Toaster {...TOASTER_OPTS} />
      </>
    );
  }

  // Стол уже открыт на сервере, но кадра партии ещё нет: загрузка или
  // переподключение. Явное состояние вместо пустого экрана.
  if (!state) {
    return (
      <>
        <p className="grid min-h-dvh place-items-center text-sm text-muted">
          {net.status === "finished"
            ? t("game.openingFinal")
            : net.status === "reconnecting"
              ? t("game.reconnecting")
              : t("game.opening")}
        </p>
        {rulesOpen ? <RulesPanel onClose={closeRules} /> : null}
        <Toaster {...TOASTER_OPTS} />
      </>
    );
  }

  return (
    // На широких экранах стол занимает ровно экран, а не растит страницу:
    // прокрутка живёт внутри <main> и колонки журнала.
    <div className="flex min-h-dvh flex-col xl:h-dvh xl:overflow-hidden">
      {net.status === "reconnecting" ? (
        <div className="fixed inset-x-0 top-14 z-40 mx-auto w-fit rounded-full border border-danger/50 bg-danger/15 px-4 py-1.5 text-sm text-clay">
          {t("game.reconnecting")}
        </div>
      ) : null}
      <Table />
      {state.phase === "gameOver" && state.scores ? (
        <GameOverScreen
          scores={state.scores}
          winnerIds={state.winnerIds ?? []}
          humanId={state.humanId}
          // Зрителю повтор недоступен: у него нет места, сервер отклонит.
          {...(net.spectating ? {} : { onAgain: () => void netAgain() })}
          onMenu={leaveNet}
        />
      ) : null}
      {rulesOpen ? <RulesPanel onClose={closeRules} /> : null}
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

/** Тон записи журнала движка → вид записи общей ленты. */
function feedKindOf(tone: LogEntry["tone"]): FeedItem["kind"] {
  // Плохие вести (гибель, провал защиты) и охота — «важное» с акцентной полосой.
  return tone === "bad" || tone === "hunt" ? "important" : "action";
}

/** Быстрые фразы сетевого чата — считаются в рендере, чтобы менять язык живо. */
function netQuickPhrases(t: ReturnType<typeof useT>): string[] {
  return [t("chat.qp.hi"), t("chat.qp.goodMove"), t("chat.qp.yourTurn"), t("chat.qp.thanks")];
}

/** Нейтральный тон автора без места (ожидающие и зрители) — как в лобби. */
const NEUTRAL_AUTHOR_COLOR = "var(--color-muted)";

/**
 * Лента «журнал + чат». У записей журнала нет времени, поэтому время первого
 * показа запоминаем на клиенте: так сообщения чата подмешиваются в ленту по
 * своим меткам, а не сваливаются одним блоком в конец. Ключи — монотонные id
 * (logSeq у журнала, id сообщения у чата), поэтому React не пересоздаёт строки.
 */
function useFeedItems(state: GameState, net: NetUiState | null): FeedItem[] {
  const lang = useLang();
  const seenAtRef = useRef(new Map<number, number>());
  const chat = net?.chat;
  const reactions = net?.reactions;
  const myName = net?.name;
  const seats = net?.seats;
  const system = net?.system;

  return useMemo(() => {
    const now = Date.now();
    const seen = seenAtRef.current;
    const rows: Array<{ sortAt: number; item: FeedItem }> = [];
    const byChat = reactionsByChatId(reactions, myName);

    // Цвет автора: у сетевых реплик — по месту (net.seats), у остальных —
    // по имени игрока за столом (соло и ожидающие места).
    const colorOfSeat = new Map<number, string>();
    for (const s of seats ?? []) {
      colorOfSeat.set(s.seat, s.color);
    }
    const colorOfName = (name: string): string | undefined => {
      const i = state.players.findIndex((p) => p.name === name);
      // Соло и ожидающие места: цвет по индексу места — как у стола.
      return i >= 0 ? colorForSeat(i) : undefined;
    };

    for (const e of state.log) {
      let at = seen.get(e.id);
      if (at === undefined) {
        at = now;
        seen.set(e.id, at);
      }
      rows.push({
        sortAt: at,
        item: { id: `log-${e.id}`, kind: feedKindOf(e.tone), text: logEntryText(lang, e) },
      });
    }
    for (const m of chat ?? []) {
      // Ожидающие (-1) и зрители (-2) места не занимают: своего цвета у них
      // нет, но ник должен читаться — тот же нейтральный тон, что в лобби.
      const color = colorOfSeat.get(m.seat) ?? colorOfName(m.name) ?? NEUTRAL_AUTHOR_COLOR;
      const rs = byChat.get(m.id);
      rows.push({
        sortAt: m.at,
        item: {
          id: `chat-${m.id}`,
          kind: "chat",
          text: m.text,
          playerName: m.name,
          at: m.at,
          // Место автора: 0..7 — игроки, -1 — ожидающие, -2 — зрители.
          // Нужно вкладке «Зрители» в журнале.
          seat: m.seat,
          // Реплика-адресат реакции: по нему чипы ложатся под сообщение.
          chatId: m.id,
          color,
          ...(rs ? { reactions: rs } : {}),
        },
      });
    }
    // Системные события стола (вошёл/вышел/сдался) — как записи журнала.
    // Хранят key+params и переводятся в рендере: смена языка меняет и их.
    for (const n of system ?? []) {
      const text = n.key ? translate(lang, n.key as TKey, n.params ?? undefined) : n.text;
      rows.push({ sortAt: n.at, item: { id: n.id, kind: "system", text, at: n.at } });
    }

    rows.sort((a, b) => a.sortAt - b.sortAt);
    // Стол не должен разрастаться: в DOM держим последние записи.
    return rows.slice(-140).map((r) => r.item);
  }, [state.log, state.players, chat, system, seats, reactions, myName, lang]);
}

function Table() {
  const state = useGameStore((s) => s.state)!;
  const intent = useGameStore((s) => s.intent);
  const logOpen = useGameStore((s) => s.logOpen);
  const logUnread = useGameStore((s) => s.logUnread);
  const dispatch = useGameStore((s) => s.dispatch);
  const setIntent = useGameStore((s) => s.setIntent);
  const setLogOpen = useGameStore((s) => s.setLogOpen);
  const setRulesOpen = useGameStore((s) => s.setRulesOpen);
  const net = useGameStore((s) => s.net);
  const sendChat = useGameStore((s) => s.sendChat);
  const sendReaction = useGameStore((s) => s.sendReaction);
  const sendTyping = useGameStore((s) => s.sendTyping);
  const leaveNet = useGameStore((s) => s.leaveNet);
  const netResign = useGameStore((s) => s.netResign);
  const netError = useGameStore((s) => s.net?.error);
  const clearNetError = useGameStore((s) => s.clearNetError);
  const t = useT();
  const lang = useLang();
  // Подтверждение выхода в меню: ref — чтобы Esc-обработчик с deps [] видел.
  const [confirmLeave, setConfirmLeave] = useState(false);
  const confirmRef = useRef(false);
  const askLeave = useCallback((v: boolean) => {
    // Диалог подтверждения — модалка: открытие и закрытие звучат тихим свушем.
    sfx.play("modal");
    confirmRef.current = v;
    setConfirmLeave(v);
  }, []);

  // Журнал и чат одной лентой (в соло чата нет — только записи движка).
  const feed = useFeedItems(state, net);
  // «Печатает…»: метки мест, очереди и зрителей из кадров поллинга.
  const typingNames = useMemo(() => (net ? typingNamesOf(net) : []), [net]);

  // Ошибка сетевого хода раньше нигде не показывалась: молча гасилась в сторе.
  useEffect(() => {
    if (!netError) return;
    toast.error(netError);
    clearNetError();
  }, [netError, clearNetError]);

  const human = player(state, state.humanId);
  const actor = currentActor(state);
  // «Трава и грибы»: раунд безумца проводит сосед справа — стол человека
  // в этот раунд не интерактивен. Зритель смотрит стол как чужой ход:
  // сервер ставит ему humanId-якорь, поэтому одним флагом гасим и «Ваш ход»,
  // и подсветки, и органы управления ходом.
  const isHumanTurn =
    actor?.id === human.id && state.madTurn !== human.id && !net?.spectating;
  // «Ваш ход»: карточка показывается только на реальном переходе хода к человеку.
  // Ключ последнего хода человека отсекает повтор: после своей же атаки актор на
  // миг становится защищающимся и возвращается — это тот же ход, не новый.
  const [turnCard, setTurnCard] = useState<string | null>(null);
  const [turnCardClosing, setTurnCardClosing] = useState(false);
  // Идёт показ модалки события: индикатор новой фазы ждёт своей очереди —
  // сначала карточки событий (кубики, вымирание), потом «Ваш ход».
  const [spotlightActive, setSpotlightActive] = useState(false);
  const lastHumanKeyRef = useRef<string | null>(null);
  const turnCardTimerRef = useRef<number | null>(null);
  const closeTurnCard = useCallback(() => {
    setTurnCardClosing(true);
    if (turnCardTimerRef.current) window.clearTimeout(turnCardTimerRef.current);
    turnCardTimerRef.current = window.setTimeout(() => {
      setTurnCard(null);
      setTurnCardClosing(false);
    }, 200);
  }, []);
  useEffect(() => {
    const key = `${state.year}:${state.phase}:${state.currentPlayerId ?? -1}:${state.madTurn ?? -1}`;
    const on = isHumanTurn && !state.pendingAttack && !state.rageTurn;
    if (!on) {
      setTurnCard(null);
      return;
    }
    if (lastHumanKeyRef.current === key) return;
    // Модалки конца фазы ещё идут — индикатор хода подождёт их (стол под
    // спотлайтом остаётся живым, действие не блокируется).
    if (spotlightActive) return;
    lastHumanKeyRef.current = key;
    setTurnCard(key);
  }, [isHumanTurn, state.pendingAttack, state.rageTurn, state.year, state.phase, state.currentPlayerId, state.madTurn, spotlightActive]);
  // Карточка живёт в два раза короче прежнего: она лишь подтверждает переход хода.
  useEffect(() => {
    if (!turnCard || turnCardClosing) return;
    const t = window.setTimeout(() => closeTurnCard(), 1600);
    return () => window.clearTimeout(t);
  }, [turnCard, turnCardClosing, closeTurnCard]);
  useEffect(
    () => () => {
      if (turnCardTimerRef.current) window.clearTimeout(turnCardTimerRef.current);
    },
    [],
  );

  const feedActs = useMemo(
    () => (state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? legalFeedActions(state, human.id) : []),
    [state, isHumanTurn, human.id],
  );
  const devActs = useMemo(
    () => (state.phase === "development" && isHumanTurn ? legalDevActions(state, human.id) : []),
    [state, isHumanTurn, human.id],
  );
  /**
   * «Случайные мутации» в сети: снимок прячет личную колоду (`blindDeck = []`),
   * поэтому `legalDevActions` на клиенте не предлагает `devMutate` вовсе —
   * клики по видам и растениям молчали бы. Если карты есть по счётчику
   * (`blindDeckCount`), цель считаем допустимой по правилам движка
   * (`legalDevActions` в engine.ts): свой вид из одной особи; численность —
   * пока видов меньше, чем карт в колоде хватает. Сервер перепроверит ход.
   */
  const mutateGuess = useCallback(
    (kind: "trait" | "population" | "plant", target: { animalId?: string; plantId?: string }) => {
      const left = human.blindDeckCount ?? human.blindDeck?.length ?? 0;
      // Колода видна (соло/локальный движок) — список действий полон, догадки не нужны.
      if ((human.blindDeck?.length ?? 0) > 0 || left <= 0) return false;
      if (kind === "plant") {
        return (state.plants ?? []).some((pl) => pl.id === target.plantId);
      }
      const animal = target.animalId ? findAnimal(state, target.animalId) : undefined;
      if (!animal || animal.ownerId !== human.id) return false;
      if (kind === "trait") return (animal.population ?? 1) === 1;
      const ext = animal.traits.some((t) => t.type === "extremophile" && !t.disabled);
      return (animal.population ?? 1) < human.animals.length && (!ext || left >= 2);
    },
    [human, state],
  );
  /**
   * Доступность грани руки: источник правды — уже посчитанные легальные
   * действия. Свойство растения без животных законно (кладут на растение),
   * поэтому блокируется именно грань, а не «все свойства» разом.
   */
  const faceAvailable = useCallback(
    (cardId: string, face: number) =>
      devActs.some(
        (a) =>
          (a.type === "devPlayTrait" ||
            a.type === "devPlayPair" ||
            a.type === "devPlayPlantTrait" ||
            a.type === "devPlayPlantPair") &&
          a.cardId === cardId &&
          a.face === face,
      ),
    [devActs],
  );
  const defActs = useMemo(
    () => (state.pendingAttack && state.pendingAttack.waitingFor === human.id ? legalDefenseActions(state, human.id) : []),
    [state, human.id],
  );

  /**
   * Причины, по которым ключевые действия питания недоступны: движок отдаёт
   * готовые тексты (feedBlockReason). Серую кнопку показываем, когда действие
   * заблокировано, а не просто отсутствует: для охоты/пиратства/спячки — лишь
   * если у игрока вообще есть животное с таким свойством, иначе док бы вечно
   * мозолил глаза тремя «серыми» кнопками. Ход бешенства рисует свой док.
   */
  const feedBlocked = useMemo(() => {
    if (state.phase !== "feeding" || !isHumanTurn || state.pendingAttack || state.rageTurn) return null;
    const has = (trait: TraitId) => human.animals.some((a) => hasTrait(a, trait, true));
    const out: { take?: string; hunt?: string; pirate?: string; sleep?: string } = {};
    if (human.animals.length) {
      const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedTake"));
      if (r) out.take = r;
    }
    if (has("carnivore") || has("obligateCarnivore")) {
      const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedHunt"));
      if (r) out.hunt = r;
    }
    if (has("piracy")) {
      const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedPirate"));
      if (r) out.pirate = r;
    }
    if (has("hibernation")) {
      const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedHibernate"));
      if (r) out.sleep = r;
    }
    return out.take || out.hunt || out.pirate || out.sleep ? out : null;
  }, [state, isHumanTurn, human, lang]);

  // ── Перетаскивание карт и животных (@dnd-kit) ─────────────────────────────
  // Мышь — порог 6 px: клик по «Животное» и по грани не подавляется драгом.
  // Палец — короткое удержание: быстрый свайп по-прежнему прокручивает руку,
  // а удержание с движением тащит карточку (на тач-устройствах драга не было).
  const dndSensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
  );
  const [dndActive, setDndActive] = useState<DndData | null>(null);
  const [dndOver, setDndOver] = useState<{ id: string; data: DndData; side: "before" | "after" | null } | null>(null);
  const dndPointRef = useRef<{ x: number; y: number } | null>(null);

  // Точка пальца/курсора во время броска: по ней считаем сторону вставки
  // и находим растение под картой (карточки растений — чужой компонент).
  useEffect(() => {
    if (!dndActive) return;
    const track = (e: PointerEvent | TouchEvent) => {
      const p = dndPointOf(e);
      if (p) dndPointRef.current = p;
    };
    window.addEventListener("pointermove", track, { passive: true });
    window.addEventListener("touchmove", track, { passive: true });
    return () => {
      window.removeEventListener("pointermove", track);
      window.removeEventListener("touchmove", track);
    };
  }, [dndActive]);

  /** Выбранная кликом грань карты; null — грань выбирает движок. */
  const selectedFaceOf = useCallback(
    (cardId: string): number | null =>
      intent.kind !== "none" && "cardId" in intent && intent.cardId === cardId && "face" in intent
        ? (intent.face as number)
        : null,
    [intent],
  );

  /**
   * Животные-цели для тащи́мой карты — из уже посчитанных действий движка.
   * Пока карту тащат, все прочие звери приглушены: «сюда свойство не ляжет».
   */
  const cardDragTargets = useMemo(() => {
    if (dndActive?.kind !== "card" || !dndActive.cardId) return null;
    const face = selectedFaceOf(dndActive.cardId);
    const set = new Set<string>();
    for (const a of devActs) {
      if (a.type !== "devPlayTrait" && a.type !== "devPlayPair") continue;
      if (a.cardId !== dndActive.cardId || (face != null && a.face !== face)) continue;
      if (a.type === "devPlayTrait") set.add(a.animalId);
      else {
        set.add(a.a);
        set.add(a.b);
      }
    }
    return set;
  }, [dndActive, devActs, selectedFaceOf]);

  /**
   * Растения-цели для тащи́мой карты. Пустой набор PlantStrip не приглушает,
   * поэтому «нельзя никуда» дополняем несуществующим id — тогда вся полоса
   * гаснет и видно, что свойство растения сюда не ляжет.
   */
  const cardDragPlants = useMemo(() => {
    if (dndActive?.kind !== "card" || !dndActive.cardId) return null;
    const set = legalPlantTargets(devActs, dndActive.cardId, selectedFaceOf(dndActive.cardId));
    return set.size ? set : new Set([NO_PLANT_TARGET]);
  }, [dndActive, devActs, selectedFaceOf]);

  // Одна развёртка интеракций на кадр вместо двух O(действия×животные) проходов на карточку.
  const interactions = useMemo(() => {
    const map = new Map<string, Interaction>();
    const cardDrag = cardDragTargets !== null;
    for (const p of state.players) {
      for (const a of p.animals) {
        const hl = animalHighlight(state, a, intent, isHumanTurn, feedActs, devActs, mutateGuess);
        const cardTarget = cardDragTargets?.has(a.id) ?? false;
        const underPointer = dndOver?.data.animalId === a.id;
        map.set(a.id, {
          highlight: hl || cardTarget,
          dimmed: (intent.kind !== "none" && !hl) || (cardDrag && !cardTarget),
          selected:
            (intent.kind === "playPair" && intent.first === a.id) ||
            (intent.kind === "hunt" && intent.carnivoreId === a.id) ||
            (intent.kind === "pirate" && intent.pirateId === a.id),
          // Цель под прицелом: охота с выбранным хищником, пиратство с пиратом,
          // атака хищного растения, паразитизм — красная «треснувшая» метка.
          danger:
            hl &&
            ((intent.kind === "hunt" && intent.carnivoreId !== undefined) ||
              (intent.kind === "pirate" && intent.pirateId !== undefined) ||
              (intent.kind === "plantAttack" && intent.plantId !== undefined) ||
              intent.kind === "parasitize"),
          // Подсвечиваем кольцом только допустимую цель под указателем.
          dropTarget:
            underPointer && (cardDrag ? cardTarget : dndActive?.kind === "animal" && a.id !== dndActive.animalId),
        });
      }
    }
    return map;
  }, [state, intent, isHumanTurn, feedActs, devActs, mutateGuess, cardDragTargets, dndOver, dndActive]);
  const getInteraction = useCallback((a: Animal) => interactions.get(a.id) ?? NO_INTERACTION, [interactions]);
  // Новые цели под прицелом звучат очень тихим треском «слома» — почти порог слышимости.
  const dangerKey = useMemo(
    () =>
      [...interactions.entries()]
        .filter(([, it]) => it.danger)
        .map(([id]) => id)
        .sort()
        .join(","),
    [interactions],
  );
  const dangerSoundRef = useRef("");
  useEffect(() => {
    if (dangerKey && dangerKey !== dangerSoundRef.current) sfx.play("crack");
    dangerSoundRef.current = dangerKey;
  }, [dangerKey]);


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
        // Сетевой снимок прячет колоду — список пуст: подсвечиваем растения
        // по той же догадке, что пускает клик (mutateGuess).
        if (!set.size) {
          for (const pl of state.plants ?? []) {
            if (mutateGuess("plant", { plantId: pl.id })) set.add(pl.id);
          }
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
  }, [plantsOn, state.phase, state.plants, intent, devActs, feedActs, isHumanTurn, mutateGuess]);

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
    // Клик по растению — выбор цели: тихий щелчок, как у кнопок дока.
    sfx.play("click");
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
        const ok =
          devActs.some((a) => a.type === "devMutate" && a.intent === "plant" && a.plantId === plant.id) ||
          mutateGuess("plant", { plantId: plant.id });
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
    sfx.play("click");
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
    handleAnimalClick(animal, { state, intent, isHumanTurn, human, feedActs, devActs, mutateGuess, dispatch, setIntent });
  }

  // ── Броски @dnd-kit: цель и сторона вставки ───────────────────────────────

  const dndOverInfo = (over: Over | null) => {
    if (!over) return null;
    const data = over.data.current as DndData | undefined;
    if (!data) return null;
    return { id: String(over.id), data, side: dndSideOf(over, dndPointRef.current) };
  };

  /** Короткий звук отказа: бросок на недопустимую цель ничего не делает. */
  const rejectDrop = () => sfx.play("crack");

  /**
   * Что делать при броске. Легальность не дублируем: сверяемся с devActs
   * движка (devPlayAnimal / devPlayTrait / devPlayPair / devPlayPlantTrait /
   * devPlayPlantPair), а свои правила только выбираем подходящее действие.
   */
  function performDndDrop(active: DndData, target: DndData, side: "before" | "after" | null) {
    // ── Животное: перестановка в ряду или перенос между территориями ──
    if (active.kind === "animal") {
      const moved = active.animalId ? human.animals.find((a) => a.id === active.animalId) : undefined;
      if (!moved) return;
      if (target.kind === "animal") {
        const dest = target.animalId ? findAnimal(state, target.animalId) : undefined;
        if (!dest || dest.id === moved.id || dest.ownerId !== human.id) return;
        const group = pairGroupIds(human.animals, moved.id);
        // Внутри своей же пары порядок не меняем: связка едет целиком.
        if (group.has(dest.id)) return;
        if (state.modules.continents && zoneOfAnimal(moved) !== zoneOfAnimal(dest)) {
          if (state.phase !== "development") return rejectDrop();
          dispatch({ type: "reorderAnimal", animalId: moved.id, toZoneId: zoneOfAnimal(dest) });
          return;
        }
        const rest = human.animals.filter((a) => !group.has(a.id));
        const at = rest.findIndex((a) => a.id === dest.id);
        if (at < 0) return;
        // «После цели» — перед следующим в остатке (цель последняя → в конец,
        // как и просил индикатор). Бросок мимо животного в конец не уводит.
        const beforeId = side === "before" ? dest.id : rest[at + 1]?.id;
        if (beforeId === moved.id) return;
        dispatch({ type: "reorderAnimal", animalId: moved.id, beforeId });
        return;
      }
      if (target.kind === "zone") {
        if (target.playerId !== human.id || !target.zoneId) return;
        if (target.zoneId === "ocean") return rejectDrop(); // океан — только через свойство
        if (state.phase !== "development") return rejectDrop();
        if (zoneOfAnimal(moved) === target.zoneId) return; // уже здесь
        dispatch({ type: "reorderAnimal", animalId: moved.id, toZoneId: target.zoneId });
        return;
      }
      return; // полоса ряда без «Континентов»: мимо зверя порядок не меняем
    }

    // ── Карта из руки: новое животное или свойство ──
    if (active.kind !== "card" || !active.cardId) return;
    const cardId = active.cardId;
    if (!human.hand.some((c) => c.id === cardId)) return;
    const face = selectedFaceOf(cardId);
    const acts = devActs.filter((a): a is DevCardAction => {
      if (a.type !== "devPlayTrait" && a.type !== "devPlayPair" && a.type !== "devPlayPlantTrait" && a.type !== "devPlayPlantPair") {
        return false;
      }
      return a.cardId === cardId && (face == null || a.face === face);
    });

    if (target.kind === "animal") {
      const animalId = target.animalId;
      if (!animalId) return;
      // Пара: первый зверь уже выбран — этот бросок кладёт свойство на второго.
      if (intent.kind === "playPair" && intent.cardId === cardId && intent.first && intent.first !== animalId) {
        const act = acts.find((a) => a.type === "devPlayPair" && a.a === intent.first && a.b === animalId);
        if (act) return dispatch(act);
        return rejectDrop();
      }
      const simple = acts.find((a) => a.type === "devPlayTrait" && a.animalId === animalId);
      if (simple) return dispatch(simple);
      // Парная грань без первого зверя: бросок выбирает первого, второй — дальше.
      const pair = acts.find((a) => a.type === "devPlayPair" && (a.a === animalId || a.b === animalId));
      if (pair) {
        setIntent({ kind: "playPair", cardId, face: pair.face, first: animalId });
        sfx.play("click");
        return;
      }
      return rejectDrop();
    }

    if (target.kind === "zone" || target.kind === "row") {
      if (target.kind === "zone" && (!target.zoneId || target.zoneId === "ocean")) return rejectDrop();
      const act = devActs.find(
        (a) =>
          a.type === "devPlayAnimal" &&
          a.cardId === cardId &&
          (target.kind === "zone" ? a.zoneId === target.zoneId : a.zoneId === undefined),
      );
      if (act) return dispatch(act);
      return rejectDrop();
    }

    if (target.kind === "plants") {
      // Карточки растений рисует чужой компонент, поэтому ищем растение под
      // точкой броска по DOM (data-plant-id).
      const plantId = plantIdAtPoint(dndPointRef.current);
      if (!plantId) return rejectDrop();
      if (intent.kind === "playPlantPair" && intent.cardId === cardId && intent.first && intent.first !== plantId) {
        const act = acts.find((a) => a.type === "devPlayPlantPair" && a.a === intent.first && a.b === plantId);
        if (act) return dispatch(act);
        return rejectDrop();
      }
      const simple = acts.find((a) => a.type === "devPlayPlantTrait" && a.plantId === plantId);
      if (simple) return dispatch(simple);
      const pair = acts.find((a) => a.type === "devPlayPlantPair" && (a.a === plantId || a.b === plantId));
      if (pair) {
        setIntent({ kind: "playPlantPair", cardId, face: pair.face, first: plantId });
        sfx.play("click");
        return;
      }
      return rejectDrop();
    }
  }

  function handleDndStart(e: DragStartEvent) {
    const data = e.active.data.current as DndData | undefined;
    if (!data) return;
    dndPointRef.current = null;
    setDndActive(data);
    setDndOver(null);
  }

  /** Цель под указателем; одинаковые кадры не перерисовывают стол. */
  const syncDndOver = (over: Over | null) => {
    const info = dndOverInfo(over);
    setDndOver((prev) => (prev && info && prev.id === info.id && prev.side === info.side ? prev : info));
  };

  function handleDndOver(e: DragOverEvent) {
    syncDndOver(e.over);
  }

  function handleDndMove(e: DragMoveEvent) {
    // Сторона вставки меняется и без смены цели — обновляем на каждом кадре.
    syncDndOver(e.over);
  }

  function handleDndEnd(e: DragEndEvent) {
    const active = e.active.data.current as DndData | undefined;
    const info = dndOverInfo(e.over);
    setDndActive(null);
    setDndOver(null);
    dndPointRef.current = null;
    if (!active || !info || !dndTargetAllowed(active, info.data)) return;
    performDndDrop(active, info.data, info.side);
  }

  function handleDndCancel() {
    setDndActive(null);
    setDndOver(null);
    dndPointRef.current = null;
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
   * Рассадка вокруг поля. Полосы сверху и снизу держат одинаковое число табло
   * (2 или 3, в одну строку), бока — не больше одного табло с каждой стороны:
   * стол не собирается в «две строчки» сбоку и верхний ряд не отличается от
   * нижнего. Один/два/три соперника остаются в «уютной» раскладке у сукна.
   */
  const seats = useMemo(() => {
    const top: Player[] = [];
    const left: Player[] = [];
    const right: Player[] = [];
    const bottom: Player[] = [];
    const n = opponents.length;
    if (n > 8) {
      // Больше мест, чем в раскладке (страховка): заполняем по кругу.
      const slots: Player[][] = [top, left, right, top, left, right, bottom, bottom];
      opponents.forEach((p, i) => slots[Math.min(i, slots.length - 1)]!.push(p));
      return { top, left, right, bottom };
    }
    if (n === 1) {
      top.push(opponents[0]!);
    } else if (n === 2) {
      left.push(opponents[0]!);
      right.push(opponents[1]!);
    } else if (n === 3) {
      top.push(opponents[0]!);
      left.push(opponents[1]!);
      right.push(opponents[2]!);
    } else if (n === 4) {
      top.push(opponents[0]!, opponents[1]!);
      left.push(opponents[2]!);
      right.push(opponents[3]!);
    } else if (n === 5) {
      top.push(opponents[0]!, opponents[1]!);
      bottom.push(opponents[2]!, opponents[3]!);
      left.push(opponents[4]!);
    } else if (n === 6) {
      top.push(opponents[0]!, opponents[1]!);
      bottom.push(opponents[2]!, opponents[3]!);
      left.push(opponents[4]!);
      right.push(opponents[5]!);
    } else if (n === 7) {
      // 8 мест: по три табло в полосах сверху и снизу, седьмое — сбоку.
      top.push(opponents[0]!, opponents[1]!, opponents[2]!);
      bottom.push(opponents[3]!, opponents[4]!, opponents[5]!);
      left.push(opponents[6]!);
    } else {
      // 8 соперников — ровно по три в полосах и по одному сбоку.
      top.push(opponents[0]!, opponents[1]!, opponents[2]!);
      bottom.push(opponents[3]!, opponents[4]!, opponents[5]!);
      left.push(opponents[6]!);
      right.push(opponents[7]!);
    }
    return { top, left, right, bottom };
  }, [opponents]);
  const [tableLayout, setTableLayout] = useState<"cozy" | "wide">(loadTableLayout);
  const wideSeats = seats.left.length > 0 || seats.right.length > 0 || tableLayout === "wide";

  const lastLogEntry = state.log[state.log.length - 1];
  const lastLog = lastLogEntry ? logEntryText(lang, lastLogEntry) : undefined;
  const dying = useMemo(() => new Set(state.extinctionDeaths), [state.extinctionDeaths]);
  const fx = useActionFx(state);

  // Подсказки перетаскивания своему табло: индикатор вставки и полосы территорий.
  const dndHints = useMemo<DndHints | undefined>(() => {
    if (!isHumanTurn) return undefined;
    const insert =
      dndActive?.kind === "animal" && dndOver?.data.kind === "animal" && dndOver.data.animalId && dndOver.side
        ? { id: dndOver.data.animalId, side: dndOver.side }
        : undefined;
    // Полосы территорий принимают карту всегда, а зверя — только в развитие.
    const zoneDrop = dndActive?.kind === "card" || (dndActive?.kind === "animal" && state.phase === "development");
    const zoneOver = dndOver?.data.kind === "zone" ? (dndOver.data.zoneId ?? null) : null;
    if (!insert && !zoneDrop) return undefined;
    return { insert, zoneDrop, zoneOver };
  }, [isHumanTurn, dndActive, dndOver, state.phase]);

  // «Призрак» тащимого элемента: едет под курсором вместо источника.
  const dragGhost = useMemo(() => {
    if (!dndActive) return null;
    if (dndActive.kind === "animal" && dndActive.animalId) {
      const animal = findAnimal(state, dndActive.animalId);
      return animal ? <AnimalCard animal={animal} /> : null;
    }
    if (dndActive.kind === "card" && dndActive.cardId) {
      const card = human.hand.find((c) => c.id === dndActive.cardId);
      return card ? <CardPreview card={card} /> : null;
    }
    return null;
  }, [dndActive, state, human.hand]);
  useSfx(state);
  const fly = useFoodFly(state);
  // Сеть: пропущенные шаги (спотлайт + звук), вход/выход игроков и новые реплики.
  const netReplay = useNetReplay(state, net);
  useNetPresenceSfx(net?.seats);
  useNetChatSfx(net?.chat);

  // Звуки пропущенных сетевых шагов — тише живого кадра (это уже прошедшее).
  useEffect(() => {
    if (!netReplay.length) return;
    const cur = useGameStore.getState().state;
    if (cur) playEventsSfx(netReplay, cur, 0.7, 0.35);
  }, [netReplay]);

  // Тихий фон по фазе; уход со стола (в т.ч. в меню) гасит его целиком.
  useEffect(() => {
    sfx.setAmbient(ambientMoodFor(state.phase));
  }, [state.phase]);
  useEffect(() => () => sfx.setAmbient(null), []);

  // «Ваш ход» — мягкий аккорд ровно на переходе хода к человеку. Ключ хода
  // (год/фаза/активный игрок) отсекает повтор: после своей же атаки актор
  // на миг становится защищающимся и возвращается — это тот же ход, не новый.
  const prevHumanTurnRef = useRef<boolean | null>(null);
  const prevTurnKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const prevHuman = prevHumanTurnRef.current;
    const prevKey = prevTurnKeyRef.current;
    const key = `${state.year}:${state.phase}:${state.currentPlayerId ?? -1}:${state.madTurn ?? -1}`;
    prevHumanTurnRef.current = isHumanTurn;
    prevTurnKeyRef.current = key;
    if (prevHuman === false && isHumanTurn && !state.pendingAttack && prevKey !== key) {
      sfx.play("yourTurn");
    }
  }, [isHumanTurn, state.pendingAttack, state.year, state.phase, state.currentPlayerId, state.madTurn]);

  const openRulesModal = useCallback(() => {
    sfx.play("modal");
    setRulesOpen(true);
  }, [setRulesOpen]);

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
    // Партия всегда сетевая: в историю статистики она идёт как «net».
    const unlocked = recordGame(state, sessionRef.current, "net");
    for (const a of unlocked) {
      toast.success(liveT("game.achievementToast", { name: achievementName(a.id) }), {
        description: achievementDesc(a.id),
      });
    }
  }, [state]);

  return (
    // Один DndContext на стол: в нём и карточки рук/животных (draggable),
    // и цели броска (ряды, территории, животные, стол растений).
    <DndContext
      sensors={dndSensors}
      collisionDetection={dndCollisionDetection}
      accessibility={{ announcements: DND_ANNOUNCEMENTS }}
      onDragStart={handleDndStart}
      onDragOver={handleDndOver}
      onDragMove={handleDndMove}
      onDragEnd={handleDndEnd}
      onDragCancel={handleDndCancel}
    >
      <div
        aria-hidden
        className="paper-desk pointer-events-none fixed inset-0 -z-10 opacity-[0.14]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.07]"
        style={{ backgroundImage: `url(${BG.valley})` }}
      />
      <TopBar
        subtitle={`${t("game.yearN", { year: state.year })}${state.lastYear ? ` · ${t("game.yearLast")}` : ""} · ${t(PHASE_LABEL[state.phase] ?? ("phase.development" as const))}${actor ? ` · ${actor.name}` : ""}`}
        subtitleShort={`${t("game.yearN", { year: state.year })} · ${t(PHASE_LABEL[state.phase] ?? ("phase.development" as const))}`}
      >
        <div className="flex items-center gap-2">
          <FoodBankChip count={state.foodBank} visible={state.phase === "feeding" || state.phase === "foodBank"} />
          <SoundToggle />
          <div className="flex gap-1">
            {/* Переключатель вёрстки стола влияет только на широкие экраны
                (lg+), на телефоне это лишняя кнопка в тесной шапке. */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              aria-label={tableLayout === "cozy" ? t("game.layoutWide") : t("game.layoutCozy")}
              aria-pressed={tableLayout === "wide"}
              title={tableLayout === "cozy" ? t("game.layoutWide") : t("game.layoutCozy")}
              onClick={() => {
                sfx.play("click");
                const next = tableLayout === "cozy" ? "wide" : "cozy";
                setTableLayout(next);
                try {
                  localStorage.setItem("evo-table-layout", next);
                } catch {
                  // приватный режим — просто не сохранится
                }
              }}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 sm:size-11"
              // aria-label не меняем от счётчика: по нему кнопку находят
              // скрипты и озвучка; число непрочитанного читается из бейджа.
              aria-label={t("game.logButton")}
              aria-pressed={logOpen}
              title={logUnread > 0 ? t("game.logButtonUnread", { n: logUnread }) : t("game.logButton")}
              onClick={() => {
                sfx.play("click");
                setLogOpen(!logOpen);
              }}
            >
              <List className="size-4" />
              {/* Уведомление о новых записях — вместо убранной плашки на телефоне. */}
              {!logOpen && logUnread > 0 ? (
                <span
                  className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold text-accent-fg"
                  aria-label={t("game.unreadCount", { n: logUnread })}
                >
                  {logUnread > 99 ? "99+" : logUnread}
                </span>
              ) : null}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 sm:size-11"
              aria-label={t("topbar.rules")}
              title={t("topbar.rules")}
              onClick={openRulesModal}
            >
              <BookOpen className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 sm:size-11"
              aria-label={t("game.leaveButton")}
              title={t("game.leaveButton")}
              onClick={() => {
                sfx.play("click");
                // Законченную партию покидаем сразу; живую — только с подтверждением
                // (сам диалог озвучивает askLeave).
                if (state.phase === "gameOver") leaveNet();
                else askLeave(true);
              }}
            >
              <Minimize2 className="size-4" />
            </Button>
          </div>
        </div>
      </TopBar>

      <TableBanners state={state} />

      {/* Режим зрителя: read-only бейдж и панель реакций (доступна и игрокам). */}
      {net?.spectating ? (
        <div
          role="status"
          className="z-30 ml-3 mr-auto mt-2 flex w-fit max-w-[calc(100vw-24px)] items-center gap-1.5 rounded-full border border-border bg-surface/95 px-3 py-1 text-xs text-muted shadow-[var(--shadow-card)] backdrop-blur-sm sm:fixed sm:left-1/2 sm:top-14 sm:ml-0 sm:mt-0 sm:-translate-x-1/2"
        >
          <Eye className="size-3.5 shrink-0" />
          {t("game.spectBadge")}
        </div>
      ) : null}
      {net ? <ReactionsLayer net={net} phase={state.phase} /> : null}

      {turnCard ? (
        // Клик в любое место экрана (включая саму карточку и фон) убирает её сразу;
        // фон не размывается — только лёгкое затемнение, стол остаётся читаемым.
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-6"
          onClick={closeTurnCard}
        >
          <div aria-hidden className="turn-card-backdrop absolute inset-0" />
          <div
            role="status"
            className={cn(
              "grain relative flex w-full max-w-sm flex-col items-center gap-2 rounded-[var(--radius-xl)] border border-accent/60 bg-surface px-8 py-8 text-center shadow-[var(--shadow-card)]",
              turnCardClosing ? "turn-card-closing" : "turn-card",
            )}
          >
            <span aria-hidden className="size-2 rounded-full bg-accent pulse-dot" />
            <h2 className="font-display text-3xl">{t("game.turnYour")}</h2>
            <p className="text-sm text-muted">
              {t("game.turnCardSub", { year: state.year, phase: t(PHASE_LABEL[state.phase] ?? ("phase.development" as const)) })}
            </p>
          </div>
        </div>
      ) : null}

      {/* Стол: узкое центральное поле-сукно, соперники по бокам без прокрутки, игрок снизу. */}
      {/* Журнал-док на xl+ живёт рядом с полем и сдвигает его раскрытием. */}
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
      <main
        onClick={onBoardClick}
        className={cn(
          // На широких экранах поле прокручивается внутри себя: стол любой
          // населённости помещается в экран, документ не растёт.
          "flex flex-1 flex-col gap-3 px-3 py-3 sm:px-5 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain",
          wideSeats && (plantsOn || fungiOn) &&
            // Литеральные классы: динамическую сборку Tailwind не видит в исходнике.
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-3 lg:[grid-template-areas:'plants_plants_plants''top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']",
          wideSeats && !plantsOn && !fungiOn &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-3 lg:[grid-template-areas:'top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']",
          !wideSeats && "lg:mx-auto lg:w-full lg:max-w-4xl",
          state.phase === "extinction" ? "extinction-glow" : "",
        )}
      >
        {/* «Растения»/«Трава и грибы»: общий стол растений и флоры; с «Континентами» — по континентам. */}
        {plantsOn || fungiOn ? (
          // Полоса растений — цель броска для свойств растений (найти само
          // растение под картой помогает plantIdAtPoint).
          <DndArea
            id="plants"
            style={wideSeats ? { gridArea: "plants" } : undefined}
            className="flex flex-col gap-2"
          >
            {state.modules.continents ? (
              (["gondwana", "laurasia"] as TerritoryId[]).map((z) => (
                <div key={z} className="flex flex-col gap-2">
                  {plantsOn ? (
                    <PlantStrip
                      state={state}
                      zone={z}
                      highlights={cardDragPlants ?? plantHighlights}
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
                    highlights={cardDragPlants ?? plantHighlights}
                    onPlantClick={onPlantClick}
                    freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
                  />
                ) : null}
                {fungiOn ? <FloraStrip state={state} highlights={floraHighlights} onFloraClick={onFloraClick} /> : null}
              </>
            )}
          </DndArea>
        ) : null}

        {/* Верхний ряд: до трёх соперников в одну полосу, по равной доле ширины. */}
        {seats.top.length ? (
          <div
            style={wideSeats ? { gridArea: "top" } : undefined}
            className={cn("grid gap-3", rowCols(seats.top.length))}
          >
            {seats.top.map((p) => (
              <PlayerSection
                key={p.id}
                p={p}
                actorId={actor?.id ?? null}
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
              interactions={getInteraction}
              dying={dying}
              freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
              continents={Boolean(state.modules.continents)}
            />
          ))}
        </div>

        <CenterField
          style={wideSeats ? { gridArea: "felt" } : undefined}
          wide={wideSeats}
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
              interactions={getInteraction}
              dying={dying}
              freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
              continents={Boolean(state.modules.continents)}
            />
          ))}
        </div>

        {/* Нижний ряд соперников — тем же правилом, что и верхний: одинаковое
            число колонок и та же высота табло. */}
        {seats.bottom.length ? (
          <div
            style={wideSeats ? { gridArea: "bottom" } : undefined}
            className={cn("grid gap-3", rowCols(seats.bottom.length))}
          >
            {seats.bottom.map((p) => (
              <PlayerSection
                key={p.id}
                p={p}
                actorId={actor?.id ?? null}
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
          canReorder={isHumanTurn && (state.phase === "development" || state.phase === "feeding")}
          dnd={dndHints}
          actorId={actor?.id ?? null}
          interactions={getInteraction}
          dying={dying}
          freshSince={state.phase === "development" ? state.devStartPlaySeq : undefined}
          continents={Boolean(state.modules.continents)}
          style={wideSeats ? { gridArea: "human" } : undefined}
        />
      </main>
      <EventFeed
        items={feed}
        open={logOpen}
        onToggle={setLogOpen}
        title={t("game.logButton")}
        onSend={(text) => void sendChat(text)}
        quickPhrases={netQuickPhrases(t)}
        // Реакция на реплику: chatId ложится в серверную привязку, место
        // автора — для пузыря над столом. Реакция «в стол» — панель справа.
        onReact={(item, emoji) =>
          void sendReaction(emoji, "reaction", item.seat !== undefined && item.seat >= 0 ? item.seat : null, item.chatId ?? null)
        }
        onTyping={sendTyping}
        typingNames={typingNames}
      />
      </div>



      {/* pb-safe: на телефонах с жестовой полосой кнопки дока не прилипают к краю. */}
      <footer className="sticky bottom-0 z-20 border-t border-border bg-bg/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm sm:px-5">
        {net?.spectating ? (
          // Зрителю вместо доков хода — явная плашка: кнопки действий ему недоступны.
          <div className="flex h-14 items-center justify-center gap-2 text-sm text-muted">
            <Eye className="size-4" />
            {t("game.spectDock")}
          </div>
        ) : state.phase === "development" ? (
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
              onPass={() => {
                sfx.play("endTurn");
                dispatch({ type: "devPass" });
              }}
              onCancel={() => setIntent({ kind: "none" })}
            />
          ) : (
            <DevDock
              human={human}
              intent={intent}
              disabled={!isHumanTurn || Boolean(state.pendingAttack)}
              continents={Boolean(state.modules.continents)}
              freshIds={freshHand}
              faceAvailable={faceAvailable}
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
              onPass={() => {
                sfx.play("endTurn");
                dispatch({ type: "devPass" });
              }}
              onCancel={() => setIntent({ kind: "none" })}
            />
          )
        ) : state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? (
          <FeedDock
            human={human}
            acts={feedActs}
            intentKind={intent.kind}
            targetPicked={
              (intent.kind === "hunt" && intent.carnivoreId !== undefined) ||
              (intent.kind === "pirate" && intent.pirateId !== undefined) ||
              (intent.kind === "plantAttack" && intent.plantId !== undefined)
            }
            bank={state.foodBank}
            continents={Boolean(state.modules.continents)}
            rageTurn={state.rageTurn ?? null}
            blocked={feedBlocked}
            onIntent={setIntent}
            onEndTurn={() => {
              sfx.play("endTurn");
              dispatch({ type: "feedEndTurn" });
            }}
            onSkip={() => {
              sfx.play("pass");
              dispatch({ type: "feedSkip" });
            }}
          />
        ) : (
          <div className="flex h-14 items-center justify-center text-sm text-muted">
            {state.phase === "foodBank"
              ? plantsOn || fungiOn
                ? t("game.wait.oceanBank")
                : state.foodRoll
                  ? t("game.wait.diceThrown")
                  : t("game.wait.roll")
              : state.phase === "extinction"
                ? t("game.wait.extinction")
                : state.phase === "growth"
                  ? t("game.wait.growth")
                  : state.madTurn === (actor?.id ?? -2)
                    ? t("game.wait.madness", { name: actor?.name ?? "" })
                    : actor && actor.id !== human.id
                      ? t("game.wait.actor", { name: actor.name })
                      : t("game.wait.waiting")}
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

      {fly.flies.map((f) => (
        <FlyingCube key={f.id} item={f} onDone={fly.remove} />
      ))}

      <EventSpotlight replayEvents={netReplay} onActiveChange={setSpotlightActive} />

      {state.pendingAttack && state.pendingAttack.waitingFor === human.id ? (
        <DefenseDock acts={defActs} onPick={(a) => dispatch(a)} />
      ) : null}

      {confirmLeave ? (
        <ConfirmDialog
          title={t("leave.title")}
          body={
            net?.spectating
              ? t("leave.bodySpectator")
              : t("leave.bodyPlayer")
          }
          confirmLabel={net?.spectating ? t("leave.confirmSpectator") : t("leave.confirmPlayer")}
          cancelLabel={t("leave.stay")}
          tone={net?.spectating ? "default" : "danger"}
          extraLabel={net?.spectating ? undefined : t("leave.justLeave")}
          onExtra={net?.spectating ? undefined : () => leaveNet()}
          onConfirm={() => {
            askLeave(false);
            // Зрителю сдаваться нечем: просто выходит. Игрок отправляет сдачу
            // на сервер (место остаётся до финального счёта) и уходит в меню.
            if (net?.spectating) leaveNet();
            else void netResign().finally(() => leaveNet());
          }}
          onClose={() => askLeave(false)}
        />
      ) : null}

      {/* «Призрак» тащимого: карточка животного или карта руки едет под
          курсором. Источник остаётся на месте приглушённым, а индикатор
          показывает, куда именно встанет животное. */}
      <DragOverlay zIndex={80} dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" }}>
        {dragGhost ? (
          <div data-dnd-ghost className="rotate-2 opacity-95 drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]">
            {dragGhost}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
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
    /** См. `mutateGuess` в GameApp: догадка о легальности для скрытой колоды. */
    mutateGuess: (kind: "trait" | "population" | "plant", target: { animalId?: string; plantId?: string }) => boolean;
    dispatch: (a: GameAction) => void;
    setIntent: (i: UiIntent) => void;
  },
) {
  const { state, intent, human, feedActs, devActs, mutateGuess, dispatch, setIntent } = ctx;
  if (state.pendingAttack) return;

  if (state.phase === "development") {
    // ── «Случайные мутации»: клик по своему виду разыгрывает карту колоды ──
    if (intent.kind === "mutateTrait") {
      const ok =
        devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id) ||
        mutateGuess("trait", { animalId: animal.id });
      if (ok) dispatch({ type: "devMutate", intent: "trait", animalId: animal.id });
      return;
    }
    if (intent.kind === "mutatePop") {
      const ok =
        devActs.some((a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id) ||
        mutateGuess("population", { animalId: animal.id });
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
      // Источник правды — легальные действия: «облигатный хищник» тоже
      // охотник, а в ход бешенства охотится только бешеное животное.
      const ok = feedActs.some((a) => a.type === "feedHunt" && a.carnivoreId === animal.id);
      if (ok) setIntent({ kind: "hunt", carnivoreId: animal.id });
      return;
    }
    const ok = feedActs.some((a) => a.type === "feedHunt" && a.carnivoreId === intent.carnivoreId && a.preyId === animal.id);
    if (ok) dispatch({ type: "feedHunt", carnivoreId: intent.carnivoreId, preyId: animal.id });
    return;
  }
  if (intent.kind === "pirate") {
    if (!intent.pirateId) {
      const ok = feedActs.some((a) => a.type === "feedPirate" && a.pirateId === animal.id);
      if (ok) setIntent({ kind: "pirate", pirateId: animal.id });
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
  /** См. `mutateGuess` в GameApp: подсветка цели при скрытой снимком колоде. */
  mutateGuess?: (kind: "trait" | "population" | "plant", target: { animalId?: string; plantId?: string }) => boolean,
): boolean {
  if (!isHumanTurn) return false;
  if (intent.kind === "playTrait") {
    return devActs.some(
      (a) => a.type === "devPlayTrait" && a.cardId === intent.cardId && a.face === intent.face && a.animalId === animal.id,
    );
  }
  // ── «Случайные мутации»: подсветка видов, принимающих карту из колоды ──
  if (intent.kind === "mutateTrait") {
    return (
      devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id) ||
      Boolean(mutateGuess?.("trait", { animalId: animal.id }))
    );
  }
  if (intent.kind === "mutatePop") {
    return (
      devActs.some((a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id) ||
      Boolean(mutateGuess?.("population", { animalId: animal.id }))
    );
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
  // Выбор хищника (первый шаг): подсвечиваем только тех, кому движок
  // разрешает охоту, — «облигатный хищник» тоже охотник, хотя свойства
  // «Хищник» у него нет.
  if (intent.kind === "hunt" && !intent.carnivoreId) {
    return feedActs.some((a) => a.type === "feedHunt" && a.carnivoreId === animal.id);
  }
  // Выбор пирата (первый шаг): как у охоты, по легальным действиям.
  if (intent.kind === "pirate" && !intent.pirateId) {
    return feedActs.some((a) => a.type === "feedPirate" && a.pirateId === animal.id);
  }
  if (intent.kind === "pirate" && intent.pirateId) {
    return feedActs.some((a) => a.type === "feedPirate" && a.pirateId === intent.pirateId && a.targetId === animal.id);
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

/**
 * Цепочки пар в табло: связанные парными свойствами животные идут подряд,
 * чтобы плашка пары лежала ровно между соседями. Порядок внутри цепочки —
 * как в ряду животных, старт с того конца, что стоит раньше: взаимный
 * порядок сохраняется, а вторая пара не отрывает первую от животного
 * (партнёры стоят по сторонам: B — A — C).
 */
function pairChains(animals: Animal[]): Animal[][] {
  const byId = new Map(animals.map((a) => [a.id, a]));
  const idx = new Map(animals.map((a, i) => [a.id, i]));
  const partnersOf = (a: Animal) =>
    a.traits.filter((t) => t.pairWith && byId.has(t.pairWith)).map((t) => t.pairWith!);
  const seen = new Set<string>();
  const chains: Animal[][] = [];
  for (const start of animals) {
    if (seen.has(start.id)) continue;
    // Компонента связности: все животные, связанные с этим парой (напрямую
    // или через соседей).
    const comp = new Set([start.id]);
    const queue: Animal[] = [start];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const id of partnersOf(cur)) {
        if (comp.has(id)) continue;
        comp.add(id);
        const next = byId.get(id);
        if (next) queue.push(next);
      }
    }
    const members = animals.filter((a) => comp.has(a.id));
    const linksIn = (a: Animal) => partnersOf(a).filter((id) => comp.has(id)).length;
    // Начинаем с конца цепочки (одна связь), при равенстве — с раннего.
    let head = members[0]!;
    for (const m of members) {
      if (linksIn(m) > 1) continue;
      if (linksIn(head) > 1 || (idx.get(m.id) ?? 0) < (idx.get(head.id) ?? 0)) head = m;
    }
    const ordered: Animal[] = [];
    const walked = new Set<string>();
    let cur: Animal | undefined = head;
    while (cur && !walked.has(cur.id)) {
      ordered.push(cur);
      walked.add(cur.id);
      const nextId: string | undefined = partnersOf(cur).find((id) => !walked.has(id));
      cur = nextId ? byId.get(nextId) : undefined;
    }
    // Старые сейвы с кольцом пар: остаток дописываем в исходном порядке.
    for (const m of members) if (!walked.has(m.id)) ordered.push(m);
    for (const m of ordered) seen.add(m.id);
    chains.push(ordered);
  }
  return chains;
}

/**
 * M10: круговой отсчёт до авто-конца хода. Сервер присылает абсолютную метку
 * (turnDeadlineAt) и свои часы (serverNow): считаем остаток по серверному
 * времени, чтобы сбитые часы устройства не врали. Слот фиксированного размера
 * зарезервирован всегда — табло не «прыгает», когда индикатора нет.
 * При `prefers-reduced-motion` остаётся только число (дуга скрыта).
 */
const TurnTimer = memo(function TurnTimer({
  deadlineAt,
  offsetMs,
  who,
  isHuman,
}: {
  /** Абсолютный дедлайн (мс эпохи, серверные часы); null — таймера нет. */
  deadlineAt: number | null;
  /** Смещение часов клиента: serverNow − Date.now(). */
  offsetMs: number;
  /** Имя игрока — для подписи на чужом табло. */
  who: string;
  isHuman: boolean;
}) {
  const t = useT();
  const leftOf = (deadline: number) => Math.max(0, deadline - (Date.now() + offsetMs));
  const [left, setLeft] = useState(() => (deadlineAt === null ? 0 : leftOf(deadlineAt)));
  useEffect(() => {
    if (deadlineAt === null) {
      setLeft(0);
      return;
    }
    setLeft(leftOf(deadlineAt));
    let raf = 0;
    let lastAt = 0;
    const tick = (t: number) => {
      // ~4 обновления в секунду: дуга убывает плавно, React не частит.
      if (t - lastAt >= 200) {
        lastAt = t;
        setLeft(leftOf(deadlineAt));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // offsetMs/deadlineAt — из кадра сервера; leftOf намеренно вне deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadlineAt, offsetMs]);

  if (deadlineAt === null) return <span aria-hidden className="inline-block size-6 shrink-0" />;
  const secs = Math.max(0, Math.ceil(left / 1000));
  const frac = Math.max(0, Math.min(1, left / PACE.idleTurnMs));
  const R = 8.5;
  const C = 2 * Math.PI * R;
  const hint = isHuman
    ? t("game.timerHuman", { n: secs })
    : t("game.timerOther", { name: who, n: secs });
  return (
    <span
      role="timer"
      aria-label={hint}
      title={hint}
      data-turn-timer
      // Тёмная «монета» под кольцом: на цветной подложке места дуга акцента
      // иначе сливалась бы с фоном, а число теряло контраст.
      className="relative inline-grid size-6 shrink-0 place-items-center rounded-full bg-bg/70"
    >
      {/* Медленное вращение (18 с) оживляет дугу: при reduced-motion оно снято. */}
      <svg
        viewBox="0 0 20 20"
        aria-hidden
        className="absolute inset-0 size-full -rotate-90 animate-spin [animation-duration:18s] motion-reduce:animate-none"
      >
        <circle
          cx="10"
          cy="10"
          r={R}
          fill="none"
          strokeWidth="2"
          style={{ stroke: "var(--color-border-strong)" }}
        />
        {/* Движущаяся дуга: при reduced-motion остаётся только число. */}
        <circle
          cx="10"
          cy="10"
          r={R}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - frac)}
          className="motion-reduce:hidden"
          style={{
            stroke: "var(--color-accent)",
            transition: "stroke-dashoffset 200ms linear",
          }}
        />
      </svg>
      <span className="text-[10px] font-semibold tabular-nums text-fg">{secs}</span>
    </span>
  );
});

/** Табло игрока со его животными; парные карты кладутся между животными. */
const PlayerSection = memo(function PlayerSection({
  p,
  isHuman,
  canReorder,
  dnd,
  actorId,
  interactions,
  dying,
  freshSince,
  continents,
  style,
}: {
  p: Player;
  isHuman?: boolean;
  /** Своих животных можно таскать: ход человека и подходящая фаза. */
  canReorder?: boolean;
  /** Подсказки перетаскивания (только своему табло). */
  dnd?: DndHints;
  actorId: number | null;
  interactions: (a: Animal) => Interaction;
  dying: Set<string>;
  freshSince?: number;
  /** «Континенты»: животные группируются по территориям. */
  continents?: boolean;
  style?: React.CSSProperties;
}) {
  const dispatch = useGameStore((s) => s.dispatch);
  const intent = useGameStore((s) => s.intent);
  const t = useT();
  const lang = useLang();
  // «Случайные мутации»: рука скрыта — показываем счётчик слепой колоды.
  const randomMutations = useGameStore((s) => Boolean(s.state?.modules.randomMutations));
  // Цвет места игрока: в сети — из net.seats (место совпадает с id игрока),
  // в соло — из палитры. Подложка секции и точка у имени.
  const netSeats = useGameStore((s) => s.net?.seats);
  const seatTintColor = useMemo(
    () => netSeats?.find((s) => s.seat === p.id)?.color ?? colorForSeat(p.id),
    [netSeats, p.id],
  );
  // Живой счёт всегда на табло: 2 за животное вида + свойство и его бонус.
  const gameState = useGameStore((s) => s.state);
  const score = gameState && gameState.phase !== "gameOver" ? liveScore(gameState, p.id) : null;
  const active = actorId === p.id;
  // M10: отсчёт авто-конца хода — только у того, чей сейчас ход (сервер
  // ставит метку лишь человеку, у которого не осталось действий).
  const turnDeadlineAt = useGameStore((s) => s.net?.turnDeadlineAt ?? null);
  const serverOffsetMs = useGameStore((s) => s.net?.serverOffsetMs ?? 0);
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
    // Номер животного стабилен (поле `no`); у старых сейвов его нет — тогда
    // показываем позицию в ряду, как раньше.
    p.animals.forEach((a, i) => numberOf.set(a.id, a.no ?? i + 1));
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
    for (const { t: link } of links) {
      const color = colorOf.get(link.cardId)!;
      const partnerNo = numberOf.get(link.pairWith!);
      const partner = partnerNo ? t("game.pairNo", { n: partnerNo }) : t("game.pairPartner");
      if (link.type === "symbiosis") {
        // Роль «a» — симбионт, роль «b» — тот, кого симбионт защищает.
        marks[link.id] = {
          color,
          note: link.pairRole === "a" ? t("game.symbiontFor", { no: partner }) : t("game.symbiontIs", { no: partner }),
        };
      } else {
        marks[link.id] = { color, note: t("game.pairWith", { no: partner }) };
      }
    }
    // Плашке нужна подпись про обе стороны: считаем её по роли «a».
    for (const { owner, t: link } of links) {
      if (link.pairRole !== "a") continue;
      const selfNo = numberOf.get(owner.id);
      const partnerNo = numberOf.get(link.pairWith!);
      const self = selfNo ? t("game.pairNo", { n: selfNo }) : "?";
      const partner = partnerNo ? t("game.pairNo", { n: partnerNo }) : "?";
      plateNote.set(
        link.cardId,
        link.type === "symbiosis" ? t("game.symbiontPlate", { a: self, b: partner }) : t("game.pairPlate", { a: self, b: partner }),
      );
    }
    return { colorOf, marks, plateNote, numberOf };
    // t — снапшот перевода; lang в deps пересобирает подписи при смене языка.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.animals, lang]);

  const renderCard = (a: Animal, no: number) => {
    const it = interactions(a);
    return (
      <DndAnimal
        key={a.id}
        animal={a}
        ownerId={p.id}
        canDrag={Boolean(isHuman && canReorder)}
        no={no}
        pairMarks={pairs.marks}
        selected={it.selected}
        highlight={it.highlight}
        danger={it.danger}
        dimmed={it.dimmed}
        dropTarget={it.dropTarget}
        insertSide={dnd?.insert?.id === a.id ? dnd.insert.side : undefined}
        dying={dying.has(a.id)}
        freshSince={freshSince}
      />
    );
  };

  const rows: React.ReactNode[] = [];
  if (p.animals.length === 0) {
    rows.push(
      <p key="empty" className="text-xs text-subtle">
        {isHuman ? t("game.placeFromHand") : t("game.noAnimals")}
      </p>,
    );
  } else {
    // Между связанными животными лежит их парная карта: цепочку пар собираем
    // в одну группу — на узком экране она идёт столбиком (плашка — полосой
    // между карточками), на широком — рядом. Группировка идёт по связям, а не
    // по соседству в массиве: перестановка животных не рвёт цепочку и не
    // теряет плашку. Номера берём из стабильного pairs.numberOf.
    const linkBetween = (x: Animal, y: Animal) =>
      x.traits.find((t) => t.pairWith === y.id) ?? y.traits.find((t) => t.pairWith === x.id);
    for (const chain of pairChains(p.animals)) {
      const items: React.ReactNode[] = [];
      chain.forEach((a, k) => {
        if (k > 0) {
          const prev = chain[k - 1]!;
          const link = linkBetween(prev, a);
          if (link) {
            // Плашка приглушается, только если приглушены обе её стороны.
            const here = interactions(prev);
            const there = interactions(a);
            items.push(
              <PairPlate
                key={`pair-${link.cardId}`}
                type={link.type}
                color={pairs.colorOf.get(link.cardId)}
                note={pairs.plateNote.get(link.cardId)}
                dimmed={here.dimmed && there.dimmed}
              />,
            );
          }
        }
        items.push(renderCard(a, pairs.numberOf.get(a.id) ?? k + 1));
      });
      if (items.length === 1) {
        rows.push(items[0]);
      } else {
        rows.push(
          <div
            key={`pair-group-${chain[0]!.id}`}
            className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-stretch"
          >
            {items}
          </div>,
        );
      }
    }
  }

  // Мягкая подложка в цвете места: 12% цвета, подмешанные к фону, — текст
  // остаётся читаемым, а свой стол узнаётся по цвету.
  return (
    <section
      style={{ ...style, ...seatTint(seatTintColor) }}
      data-player-section={p.id}
      className={cn(
        // Компактнее на широком столе: табло с «Континентами» держит три полосы
        // территорий, и лишние отступы складываются в сотни пикселей высоты.
        "paper-sheet mb-3 rounded-[var(--radius-lg)] border bg-surface p-3 transition-[border-color,box-shadow] duration-[var(--motion-quick)] lg:mb-0 lg:p-2",
        active ? "border-accent/70 shadow-[0_0_0_1px_var(--color-accent),var(--shadow-card)]" : "border-border",
      )}
    >
      <div className="mb-2 flex items-center justify-between text-sm lg:mb-1">
        <span className="flex items-center gap-2 font-medium">
          <span
            aria-hidden
            title={t("game.seatColor")}
            className="size-2.5 shrink-0 rounded-full border border-ink/25"
            style={{ background: seatTintColor }}
          />
          {isHuman ? t("game.yourPopulation") : p.name}
          <TurnTimer
            deadlineAt={active ? turnDeadlineAt : null}
            offsetMs={serverOffsetMs}
            who={p.name}
            isHuman={Boolean(isHuman)}
          />
          {active ? (
            <span className="flex items-center gap-1 text-xs text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              {t("game.acting")}
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          {randomMutations ? (
            <img
              src={MUTATION_ART.deckBack}
              alt=""
              loading="lazy"
              title={t("game.blindDeckTitle", { n: p.blindDeckCount ?? p.blindDeck?.length ?? 0 })}
              className="h-5 w-3.5 rounded-[2px] border border-border object-cover"
            />
          ) : null}
          {randomMutations
            ? t("game.deckCount", { n: p.blindDeckCount ?? p.blindDeck?.length ?? 0 })
            : t("game.handCount", { n: p.handCount ?? p.hand.length })}{" "}
          · {t("game.discardCount", { n: p.discardCount })}
          {score !== null ? (
            <>
              {" · "}
              {t("game.scoreLabel")}{" "}
              <span
                title={t("game.scoreTitle")}
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
        <div className="flex flex-col gap-1.5 lg:gap-1">
          {TERRITORIES.map((terr) => {
            const animals = p.animals.filter((a) => (a.zoneId ?? "laurasia") === terr.id);
            const pickable =
              isHuman &&
              placingAnimal !== undefined &&
              terr.id !== "ocean" &&
              active;
            // Полоса — цель броска: карта выкладывает животное, своё животное
            // переезжает. Океан целью не подсвечиваем (напрямую туда нельзя),
            // но бросок на него ловим и отвечаем звуком отказа.
            const dndZone = isHuman && dnd?.zoneDrop
              ? { over: terr.id !== "ocean" && dnd.zoneOver === terr.id }
              : undefined;
            return (
              <TerritoryRow
                key={terr.id}
                zone={terr.id}
                name={territoryName(terr.id, lang)}
                count={animals.length}
                // Высота — по содержимому: животные держат полосу под карточки,
                // а пустая зона остаётся тонкой даже когда игрок выбирает
                // континент для нового животного (иначе стол раздувался).
                tall={pickable || animals.length > 0}
                pickable={pickable}
                onPickZone={
                  pickable
                    ? () => dispatch({ type: "devPlayAnimal", cardId: placingAnimal!, zoneId: terr.id })
                    : undefined
                }
                dnd={dndZone}
                playerId={p.id}
              >
                {animals.length === 0 ? (
                  <span className="px-1 text-[11px] text-subtle">
                    {terr.id === "ocean" ? t("game.territoryEmptyOcean") : t("game.territoryEmpty")}
                  </span>
                ) : null}
                {animals.map((a) => renderCard(a, pairs.numberOf.get(a.id) ?? 1))}
              </TerritoryRow>
            );
          })}
        </div>
      ) : (
        // Ряд без «Континентов» — цель броска карты (новое животное);
        // перестановка своих идёт по карточкам, бросок мимо зверя ничего не меняет.
        <DndRow playerId={p.id} className="flex flex-wrap items-stretch gap-2">
          {rows}
        </DndRow>
      )}
    </section>
  );
});

/**
 * Ряд животных без «Континентов» — цель броска карты: пустое место в ряду
 * означает «выложить животное». Перестановка своих идёт по карточкам, поэтому
 * бросок животного мимо зверя здесь ничего не меняет.
 *
 * Цель всегда включена, а законность броска решает фильтр столкновений
 * (dndTargetAllowed): динамический disabled dnd-kit не успевает перемерить
 * область в начале перетаскивания, и бросок уходил «в никуда».
 */
const DndRow = memo(function DndRow({
  playerId,
  className,
  children,
}: {
  playerId: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: rowDndId(playerId), data: { kind: "row", playerId } });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
});

/** Область-цель броска: общий стол растений (свойства растений). */
const DndArea = memo(function DndArea({
  id,
  style,
  className,
  children,
}: {
  id: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id, data: { kind: "plants" } });
  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children}
    </div>
  );
});

/**
 * Животное на столе: и перетаскиваемое (своё, в свой ход), и цель броска
 * (карта из руки ложится свойством; своё животное — перестановка/перенос).
 * Хуки @dnd-kit живут здесь, AnimalCard остаётся презентационным.
 */
const DndAnimal = memo(function DndAnimal({
  animal,
  ownerId,
  canDrag,
  ...card
}: {
  animal: Animal;
  ownerId: number;
  canDrag: boolean;
} & Omit<
  React.ComponentProps<typeof AnimalCard>,
  "animal" | "dragRef" | "dragListeners" | "draggable" | "dragging"
>) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: animalDndId(animal.id),
    data: { kind: "animal", animalId: animal.id, ownerId },
    disabled: !canDrag,
  });
  const { setNodeRef: setDropRef } = useDroppable({
    id: animalDndId(animal.id),
    data: { kind: "animal", animalId: animal.id, ownerId },
  });
  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      setNodeRef(el);
      setDropRef(el);
    },
    [setNodeRef, setDropRef],
  );
  return (
    <AnimalCard
      animal={animal}
      draggable={canDrag}
      dragging={isDragging}
      dragRef={ref}
      dragListeners={listeners}
      {...card}
    />
  );
});

/** Полоса одной территории в табло игрока («Континенты»). */
function TerritoryRow({
  zone,
  name,
  count,
  children,
  tall,
  pickable,
  onPickZone,
  playerId,
  dnd,
}: {
  zone: TerritoryId;
  name: string;
  count: number;
  children: React.ReactNode;
  /** Полоса с животными или ожидающая размещения — заметной высоты. */
  tall?: boolean;
  /** Животное ожидает выбора континента: полоса кликабельна. */
  pickable?: boolean;
  onPickZone?: () => void;
  /** Владелец полосы: чужие территории целью броска не становятся. */
  playerId: number;
  /** Цель броска: полоса принимает карту/своё животное и подсвечивается. */
  dnd?: { over: boolean };
}) {
  const t = useT();
  // Цель всегда включена (см. DndRow): законность броска решает
  // dndTargetAllowed, а подсветку даёт dnd.over.
  const { setNodeRef } = useDroppable({
    id: zoneDndId(playerId, zone),
    data: { kind: "zone", playerId, zoneId: zone },
  });
  return (
    <div
      ref={setNodeRef}
      data-zone={zone}
      role={pickable ? "button" : undefined}
      aria-label={pickable ? t("game.placeOn", { name }) : undefined}
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
      className={cn(
        "relative flex flex-wrap items-stretch gap-2 rounded-[var(--radius-md)] border border-dashed px-2 transition-all duration-[var(--motion-quick)]",
        zone === "ocean" && "water-strip",
        // Высота — по содержимому: полоса с животными растёт под карточки,
        // полоса-цель размещения держит заметную площадку под подсказку, а
        // пустая зона остаётся тонкой строкой (иначе стол раздувается).
        tall ? "min-h-[52px] py-2" : "min-h-[24px] items-center justify-end py-0.5",
        zone === "ocean" ? "border-water/40 bg-water/10" : "border-border-strong/25 bg-bg/40",
        pickable &&
          "cursor-pointer border-solid border-accent ring-2 ring-accent/50 hover:bg-accent/15",
        // Полоса-цель: под курсором — акцентная рамка (океан целью не бывает).
        dnd?.over && "border-solid border-accent ring-2 ring-accent/60",
      )}
    >
      {pickable ? (
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs font-medium text-accent">
          {t("game.clickToPlace", { name })}
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
  wide,
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
  /** Широкая раскладка: колонка 1fr, но само сукно не растягивается бесконечно. */
  wide?: boolean;
}) {
  const t = useT();
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
      className={cn(
        // shrink-0: сукно держит высоту своего содержимого и не сжимается в
        // колонке-флексе (иначе содержимое вылезает за overflow-hidden рамку).
        "felt grain relative order-first flex min-h-[150px] shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-[26px] border border-border p-4 text-fg shadow-[inset_0_0_60px_rgba(0,0,0,.45),var(--shadow-card)] lg:order-none",
        // Сукно тянется по колонке 1fr, но не шире читаемой панели: тайлы банка
        // и ряды фишек должны оставаться крупными, а не растягиваться на весь экран.
        wide && "lg:w-full lg:max-w-[680px] lg:justify-self-center",
      )}
    >
      <img
        src={BG.bankBowl}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.13]"
      />
      <div className="relative flex items-center gap-2 rounded-full border border-border-strong/60 bg-bg/55 px-3.5 py-1 text-xs backdrop-blur-sm">
        {PHASE_ICON[phase] ? <img src={PHASE_ICON[phase]} alt="" className="size-4 rounded-[4px]" /> : null}
        <span className="font-display tracking-wide">{t("game.yearN", { year })}</span>
        {lastYear ? <span className="text-clay">{t("game.yearLast")}</span> : null}
        <span className="text-subtle">·</span>
        <span>{t(PHASE_LABEL[phase] ?? ("phase.development" as const))}</span>
        <span className="text-subtle">·</span>
        <span className="tabular-nums text-muted">{t("game.deckCount", { n: deckLeft })}</span>
      </div>

      {showDice ? <DiceTray key={diceKey} roll={foodRoll} bank={bank} /> : null}

      {phase === "growth" ? (
        <div className="relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-leaf/60 bg-leaf/15 px-4 py-1.5 text-sm font-medium text-leaf">
          {t("game.growthBanner")}
        </div>
      ) : phase === "extinction" ? (
        <div className="relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-danger/60 bg-danger/15 px-4 py-1.5 text-sm font-medium text-clay">
          {deaths === 0 ? t("game.extinctionNone") : t("game.extinctionN", { n: deaths })}
        </div>
      ) : tableSolo ? (
        <div
          className="relative flex flex-col items-center gap-1"
          title={t("game.tableFoodTitle")}
        >
          {plantsSolo && plantsInfo ? (
            <div className="flex flex-col items-center gap-1" title={t("game.plantsFoodTitle")}>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(plantsInfo.food, 18) }).map((_, i) => (
                  <FoodCube key={i} tone="green" className="token-pop size-3.5" />
                ))}
                {plantsInfo.food > 18 ? <span className="text-[10px] tabular-nums text-muted">+{plantsInfo.food - 18}</span> : null}
              </div>
              <span className="font-display text-xl tabular-nums leading-none">{plantsInfo.food}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                {t("game.plantsTokens", { n: plantsInfo.count, m: plantsInfo.shelters })}
              </span>
            </div>
          ) : null}
          {floraSolo && floraInfo ? (
            <div className="flex flex-col items-center gap-1" title={t("game.floraFoodTitle")}>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(floraInfo.food, 18) }).map((_, i) => (
                  <FoodCube key={i} tone="red" className="token-pop size-3.5" />
                ))}
                {floraInfo.food > 18 ? <span className="text-[10px] tabular-nums text-muted">+{floraInfo.food - 18}</span> : null}
              </div>
              <span className="font-display text-xl tabular-nums leading-none">{floraInfo.food}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                {t("game.floraTokens", { n: floraInfo.count })}
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
        <p className="relative text-xs text-accent">{t("game.turnOf", { name: actorName })}</p>
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
  const t = useT();
  const lang = useLang();
  return (
    // Три тайла по ширине сукна (до 480px): на широком сукне ряд фишек в тайле
    // не переносится, на узком — переносится внутри тайла, а не за его рамку.
    <div className="relative grid w-full max-w-[30rem] grid-cols-3 gap-2">
      {TERRITORIES.map((terr) => {
        const n = banks[terr.id] ?? 0;
        return (
          <div
            key={terr.id}
            title={t("game.territoryBankTitle", { name: territoryName(terr.id, lang) })}
            className={cn(
              // min-w-0 и перенос ряда фишек: тайл не вылезает за сукно ни при
              // каком количестве еды (0…30) и любой ширине панели.
              "flex min-w-0 flex-col items-center gap-1 overflow-hidden rounded-[var(--radius-md)] border px-1.5 py-1.5 sm:px-2",
              terr.id === "ocean" ? "border-water/50 bg-water/15" : "border-border bg-bg/45",
            )}
          >
            {/* Квадратная миниатюра тайла территории: квадраты/вертикаль кадрируются по центру. */}
            <img
              src={TERRITORY_ART[terr.id]}
              alt=""
              aria-hidden
              className="size-12 shrink-0 rounded-[var(--radius-sm)] border border-ink/20 object-cover shadow-[var(--shadow-card)] sm:size-14"
            />
            <div className="flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
              {Array.from({ length: Math.min(n, 6) }).map((_, i) => (
                <FoodCube key={`${i}-${n}`} tone="red" className="token-pop size-2.5 sm:size-3" />
              ))}
              {n > 6 ? (
                <span className="rounded-full bg-ink/10 px-1 text-[10px] tabular-nums text-muted">+{n - 6}</span>
              ) : null}
              {n === 0 ? <span className="text-[10px] text-subtle">{active ? t("game.territoryEmpty") : "—"}</span> : null}
            </div>
            <span className="font-display text-base leading-none tabular-nums sm:text-lg">{n}</span>
          </div>
        );
      })}
    </div>
  );
}

function BankPile({ count, active, oceanOnly }: { count: number; active: boolean; oceanOnly?: boolean }) {
  const t = useT();
  return (
    <div className="relative flex flex-col items-center gap-1.5" title={active ? (oceanOnly ? t("game.oceanBankHint") : t("game.bankHint")) : t("game.bankHintIdle")}>
      <div className="flex max-w-[260px] flex-wrap items-center justify-center gap-1">
        {count === 0 ? (
          <span className="text-xs text-subtle">{active ? (oceanOnly ? t("game.oceanEmpty") : t("game.bankEmpty")) : "—"}</span>
        ) : (
          Array.from({ length: Math.min(count, 24) }).map((_, i) => (
            <FoodCube key={`${i}-${count}`} tone="red" className="token-pop size-4" />
          ))
        )}
        {count > 24 ? <span className="ml-1 text-xs tabular-nums text-muted">+{count - 24}</span> : null}
      </div>
      <span className="font-display text-xl tabular-nums leading-none">{count}</span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
        {oceanOnly ? t("game.oceanBankLower") : t("game.foodBankLower")}
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
function DiceTray({ roll, bank }: { roll: number[] | null; bank: number }) {
  const t = useT();
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
        <span className="text-xs uppercase tracking-[0.18em] text-muted">{t("game.diceRolling")}</span>
      </div>
    );
  }

  const total = roll.reduce((s, d) => s + d, 0);
  // Кубики могут не совпадать с фактическим банком: у 2 и 4 игроков к сумме
  // добавляется 2, а с «Континентами» база берётся из таблицы территорий.
  // Показываем и сумму, и то, сколько реально лежит в базе, — иначе игрок
  // видит одно число на кубиках и другое в доке питания.
  const bonus = bank - total;
  const extra = bonus > 0 ? t("game.diceBonus", { n: bonus }) : bonus < 0 ? t("game.diceTerritory") : null;
  return (
    <div className="relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2">
      <Dice3D values={roll} rolling={rolling} dieSize={44} ariaLabel={t("game.diceAria", { dice: roll.join(", ") })} />
      <div className="flex flex-col">
        <span className={cn("font-display text-2xl leading-none tabular-nums", !rolling && "pop-in")}>
          {rolling ? "…" : total}
        </span>
        {!rolling ? (
          <>
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-good">{t("game.foodBankLower")}</span>
            {extra ? <span className="text-[10px] tabular-nums text-muted">{extra}</span> : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

function FoodBankChip({ count, visible }: { count: number; visible: boolean }) {
  const t = useT();
  return (
    <div
      data-food-bank=""
      // На телефоне чип скрыт целиком: число кормовой базы видно на
      // центральном поле (и в доке питания), а шапке нужна ширина.
      className="hidden items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5 sm:flex"
      title={t("game.bankHintIdle")}
    >
      <span className="text-[10px] uppercase tracking-wider text-muted">{t("game.bankChip")}</span>
      <span className="font-display text-lg tabular-nums leading-none">{visible ? count : "—"}</span>
    </div>
  );
}

/**
 * Реакции стола: панель из пяти эмодзи (игрок или зритель) и всплывающие
 * пузыри по реакциям из сети. 👏 — «поощрение»: заметнее и со своим звуком.
 */
/**
 * Высота нижнего дока: панель реакций держится ровно над ним, а не поверх
 * кнопок. Док на телефоне переносится на несколько строк, поэтому высоту
 * измеряем и слушаем ResizeObserver. На широких экранах футер включает руку
 * карт (высотой во весь низ), там панель остаётся на фиксированном отступе,
 * иначе она всплыла бы поверх композера журнала.
 */
function useActionBarOffset(phase: string): number {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    // Панель реакций держится над нижним доком на всех ширинах: в развитии док
    // высокий (рука карт), в питании — только кнопки, поэтому жёсткий отступ
    // «от низа экрана» в этих фазах выглядел по-разному.
    const dock = document.querySelector("footer");
    if (!dock) return;
    const measure = () => {
      const rect = dock.getBoundingClientRect();
      const next = Math.max(0, Math.round(window.innerHeight - rect.top));
      setOffset((prev) => (prev === next ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(dock);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // phase: смена фазы пересобирает док — высоту пересчитываем заново.
  }, [phase]);
  return offset;
}

function ReactionsLayer({ net, phase }: { net: NetUiState; phase: string }) {
  const sendReaction = useGameStore((s) => s.sendReaction);
  const logOpen = useGameStore((s) => s.logOpen);
  const t = useT();
  const [bubbles, setBubbles] = useState<Array<{ key: number; emoji: string; name: string; cheer: boolean }>>([]);
  const seenRef = useRef(new Set<number>());
  const counter = useRef(0);
  // Панель — 42px в высоту; пузыри поднимаются над ней с зазором.
  const barOffset = useActionBarOffset(phase);
  const panelStyle = barOffset ? { bottom: barOffset + 8 } : undefined;
  const bubblesStyle = barOffset ? { bottom: barOffset + 60 } : undefined;

  useEffect(() => {
    const fresh = net.reactions.filter((r) => !seenRef.current.has(r.id));
    if (!fresh.length) return;
    for (const r of fresh) seenRef.current.add(r.id);
    const added = fresh.map((r) => {
      counter.current += 1;
      return { key: counter.current, emoji: r.emoji, name: r.name, cheer: r.kind === "cheer" };
    });
    setBubbles((prev) => [...prev, ...added].slice(-8));
    // Звук: поощрение громче и теплее, обычная реакция — лёгкий блип.
    sfx.play(fresh.some((r) => r.kind === "cheer") ? "cheer" : "reaction");
    const timer = window.setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => !added.some((a) => a.key === b.key)));
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [net.reactions]);

  return (
    <>
      {/* Пузыри: поднимаются над доком реакции и растворяются. z-50 — выше
          карточки «Ваш ход» (z-40), иначе реакции прячутся за ней. */}
      <div
        aria-hidden
        style={bubblesStyle}
        className={cn(
          "pointer-events-none fixed bottom-[132px] right-3 z-50 flex w-44 flex-col items-end gap-1 sm:right-4",
          // Раскрытый журнал занимает правый край: уводим пузыри левее него.
          logOpen && "reactions-shift",
        )}
      >
        {bubbles.map((b) => (
          <span
            key={b.key}
            className={cn(
              "reaction-bubble flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs shadow-[var(--shadow-card)]",
              b.cheer ? "border-accent/70 bg-accent/20 font-medium text-fg" : "border-border bg-surface/95 text-muted",
            )}
          >
            <span className="text-base leading-none">{b.emoji}</span>
            {b.name}
          </span>
        ))}
      </div>

      {/* Панель реакций: на телефоне — компактная горизонтальная полоса над
          нижним доком (вертикальная колонка закрывала «Вашу популяцию»).
          bottom — инлайн от фактической высоты футера: док выше одной строки
          на телефоне, и фиксированные 84px накрыли бы кнопки. */}
      <div
        role="group"
        aria-label={t("game.reactions")}
        style={panelStyle}
        className={cn(
          "fixed bottom-[84px] right-3 z-40 flex flex-row gap-0.5 rounded-full border border-border bg-surface/95 p-1 shadow-[var(--shadow-card)] backdrop-blur-sm sm:right-4 sm:gap-1",
          // Раскрытый журнал занимает правый край: панель встаёт левее
          // колонки (xl) или панели sm…xl, а не поверх композера чата.
          logOpen && "reactions-shift",
        )}
      >
        {REACTION_EMOJI.map((emoji) => (
          <button
            key={emoji}
            type="button"
            aria-label={t("game.reactionOf", { emoji })}
            title={emoji === "👏" ? t("game.cheerTitle") : t("game.reactionOf", { emoji })}
            // Палец (до xl): 44px; на широком экране с мышью — компактные 32px.
            className="grid size-11 place-items-center rounded-full text-lg leading-none transition-transform duration-[var(--motion-fast)] hover:scale-110 hover:bg-surface-2 xl:size-8"
            onClick={(e) => {
              e.currentTarget.blur();
              void sendReaction(emoji, emoji === "👏" ? "cheer" : "reaction");
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
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
  const t = useT();
  const lang = useLang();
  // Сетевой снимок прячет колоду даже от владельца: `blindDeck` — пустой
  // массив, а число карт лежит в `blindDeckCount` (`views.ts`). Поэтому счётчик
  // читаем первым: `[]?.length` дал бы 0 и `0 ?? x` вернул бы 0 — все кнопки
  // мутаций оказались бы мертвы. В соло `blindDeckCount` нет — берём длину.
  const left = human.blindDeckCount ?? human.blindDeck?.length ?? 0;
  const mutating = intent.kind === "mutateTrait" || intent.kind === "mutatePop" || intent.kind === "mutatePlant";
  return (
    <div className="space-y-2" onClick={dockClickSfx}>
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <img
            src={MUTATION_ART.icon}
            alt=""
            loading="lazy"
            className="size-4 shrink-0 rounded-full object-cover"
          />
          {disabled
            ? t("dock.turnOpponent")
            : mutating
              ? intent.kind === "mutateTrait"
                ? t("dock.mut.chooseTrait")
                : intent.kind === "mutatePop"
                  ? t("dock.mut.choosePop")
                  : t("dock.mut.choosePlant")
              : t("dock.mut.declare")}
        </p>
        <span
          title={t("dock.mut.deckTitle", { n: left })}
          aria-label={t("dock.mut.deckAria", { n: left })}
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
              <span className="font-display">{t("dock.mut.newSpecies")} · {territoryName("laurasia", lang)}</span>
              <span className="text-[10px] font-normal text-muted">{t("dock.mut.cardAsAnimal")}</span>
            </button>
            <button
              type="button"
              disabled={disabled || !left}
              onClick={() => onNewAnimal("gondwana")}
              className="flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50"
            >
              <span className="font-display">{t("dock.mut.newSpecies")} · {territoryName("gondwana", lang)}</span>
              <span className="text-[10px] font-normal text-muted">{t("dock.mut.cardAsAnimal")}</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={disabled || !left}
            onClick={() => onNewAnimal()}
            className="flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50"
          >
            <span className="font-display">{t("dock.mut.newSpecies")}</span>
            <span className="text-[10px] font-normal text-muted">{t("dock.mut.cardAsAnimal")}</span>
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
          <span className="font-display">{t("dock.mut.trait")}</span>
          <span className="text-[10px] font-normal text-muted">{t("dock.mut.traitHint")}</span>
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
          <span className="font-display">{t("dock.mut.pop")}</span>
          <span className="text-[10px] font-normal text-muted">{t("dock.mut.popHint")}</span>
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
            <span className="font-display">{t("dock.mut.plantTrait")}</span>
            <span className="text-[10px] font-normal text-muted">{t("dock.mut.plantTraitHint")}</span>
          </button>
        ) : null}
        {mutating ? (
          <Button variant="ghost" size="default" onClick={onCancel} title={t("dock.cancelTitle")}>
            {t("common.cancel")}
          </Button>
        ) : null}
        <Button
          size="md"
          disabled={disabled}
          onClick={(e) => {
            e.currentTarget.blur();
            onPass();
          }}
          title={t("dock.endDevTitle")}
        >
          {t("dock.endDev")}
        </Button>
      </div>
    </div>
  );
}

/**
 * Карта руки с драгом: тянется целиком и мышью, и пальцем. Кнопки и клики
 * остаются как были — в HandCard уезжают только ref и слушатели датчиков,
 * а те включаются лишь после порога движения/удержания.
 */
const DndHandCard = memo(function DndHandCard({
  card,
  ownerId,
  disabled,
  noAnimals,
  blockedFace,
  onBlockedFace,
  selected,
  selectedFace,
  onSelect,
}: {
  card: Card;
  /** Владелец карты: чужие ряды/территории целью броска не станут. */
  ownerId: number;
  disabled?: boolean;
  noAnimals?: boolean;
  blockedFace?: (face: number) => boolean;
  onBlockedFace?: () => void;
  selected?: boolean;
  selectedFace?: number | null;
  onSelect: (face: number | "animal") => void;
}) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: `card:${card.id}`,
    data: { kind: "card", cardId: card.id, ownerId },
    disabled: Boolean(disabled),
  });
  return (
    <HandCard
      card={card}
      disabled={disabled}
      noAnimals={noAnimals}
      blockedFace={blockedFace}
      onBlockedFace={onBlockedFace}
      selected={selected}
      selectedFace={selectedFace}
      onSelect={onSelect}
      dragRef={setNodeRef}
      dragListeners={listeners}
      dragging={isDragging}
    />
  );
});

function DevDock({
  human,
  intent,
  disabled,
  continents,
  freshIds,
  faceAvailable,
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
  /** Для карты и грани есть легальное действие (devPlayTrait/Pair/Plant*). */
  faceAvailable: (cardId: string, face: number) => boolean;
  onPlayAnimal: (id: string, zoneId?: TerritoryId) => void;
  /** «Континенты»: вместо немедленного хода — режим выбора территории кликом. */
  onPlaceAnimal?: (id: string) => void;
  onPickTrait: (id: string, face: number) => void;
  onPass: () => void;
  onCancel: () => void;
}) {
  // Клик по недоступной грани: звук отказа и подсказка вместо тупика с
  // намерением. Подсказка живёт пару секунд или до первого действия.
  const [blockedHint, setBlockedHint] = useState<{ text: string; seq: number } | null>(null);
  const seqRef = useRef(0);
  const t = useT();
  const rejectFace = useCallback(() => {
    sfx.play("crack");
    seqRef.current += 1;
    setBlockedHint({
      text:
        human.animals.length === 0
          ? t("dock.dev.needAnimalFirst")
          : t("dock.dev.faceBlocked"),
      seq: seqRef.current,
    });
  }, [human.animals.length, t]);
  useEffect(() => {
    if (!blockedHint) return;
    const t = window.setTimeout(() => setBlockedHint(null), 2800);
    return () => window.clearTimeout(t);
  }, [blockedHint]);
  // Первое действие (смена выбора) снимает подсказку сразу.
  useEffect(() => {
    setBlockedHint(null);
  }, [intent]);
  return (
    <div className="space-y-2" onClick={dockClickSfx}>
      <div className="flex items-center justify-between gap-2">
        {blockedHint ? (
          <HintNote compact className="max-w-64">
            {blockedHint.text}
          </HintNote>
        ) : (
          <p className="text-xs text-muted">
            {disabled
              ? t("dock.turnOpponentCards")
              : intent.kind === "placeAnimal"
                ? t("dock.dev.placeAnimal")
                : intent.kind === "playPlantTrait"
                  ? intent.kind === "playPlantTrait" && "cardId" in intent
                    ? t("dock.dev.plantTrait")
                    : ""
                  : intent.kind === "playPlantPair" && !("first" in intent && intent.first)
                    ? t("dock.dev.plantPairFirst")
                    : intent.kind === "playPlantPair"
                      ? t("dock.dev.plantPairSecond")
                      : intent.kind === "playTrait"
                        ? t("dock.dev.trait")
                        : intent.kind === "playPair" && !("first" in intent && intent.first)
                          ? t("dock.dev.pairFirst")
                          : intent.kind === "playPair"
                            ? t("dock.dev.pairSecond")
                            : continents
                              ? t("dock.dev.cardOrTraitCont")
                              : t("dock.dev.cardOrTrait")}
          </p>
        )}
        <div className="flex shrink-0 gap-1">
          {intent.kind !== "none" ? (
            <Button variant="ghost" size="default" onClick={onCancel} title={t("dock.cancelTitle")}>
              {t("common.cancel")}
            </Button>
          ) : null}
          <Button
            size="md"
            disabled={disabled}
            onClick={(e) => {
              e.currentTarget.blur();
              onPass();
            }}
            title={t("dock.endDevTitle")}
          >
            {t("dock.endDev")}
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
              <DndHandCard
                card={card}
                ownerId={human.id}
                disabled={disabled}
                noAnimals={human.animals.length === 0}
                blockedFace={(face) => !faceAvailable(card.id, face)}
                onBlockedFace={() => rejectFace()}
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

/**
 * Серая кнопка действия, недоступного в этот ход. Причина из feedBlockReason
 * вешается на обёртку: у disabled-кнопок отключены указатели мыши, поэтому
 * title на самой кнопке не показался бы. aria-label дублирует причину.
 * cracked — трещины от выбранного противоположного намерения (атака↔питание).
 */
function BlockedButton({ label, reason, cracked }: { label: string; reason: string; cracked?: boolean }) {
  return (
    <span title={reason} className="inline-flex">
      <Button variant="secondary" size="default" disabled className={cracked ? "dock-cracked" : undefined} aria-label={`${label}: ${reason}`}>
        {label}
      </Button>
    </span>
  );
}

/** Что сейчас выбирает игрок — подсказка рядом с кнопками дока. */
const INTENT_HINT: Record<string, TKey> = {
  take: "hint.take",
  takePlant: "hint.takePlant",
  takeFlora: "hint.takeFlora",
  shelter: "hint.shelter",
  hunt: "hint.hunt",
  pirate: "hint.pirate",
  plantAttack: "hint.plantAttack",
  parasitize: "hint.parasitize",
  hibernate: "hint.hibernate",
  fat: "hint.fat",
  graze: "hint.graze",
};

/**
 * Второй шаг атак: когда атакующий уже выбран, цели подсвечены красным —
 * подсказка говорит об этом прямо, а не обещает метки заранее.
 */
const INTENT_HINT_TARGET: Record<string, TKey> = {
  hunt: "hint.target",
  pirate: "hint.target",
  plantAttack: "hint.target",
};

function FeedDock({
  human,
  acts,
  intentKind,
  targetPicked,
  bank,
  continents,
  rageTurn,
  blocked,
  onIntent,
  onEndTurn,
  onSkip,
}: {
  /** Животные человека: по ним считаем голодных перед завершением питания. */
  human: Player;
  acts: GameAction[];
  intentKind: string;
  /** Атакующий уже выбран: подсказка переключается на выбор жертвы. */
  targetPicked?: boolean;
  bank: number;
  /** «Континенты»: остаток кормовой базы — это Океан, а не общая база. */
  continents?: boolean;
  /** «Трава и грибы»: ход бешенства — только обязательная атака. */
  rageTurn?: { animalId: string } | null;
  /** Причины недоступности (feedBlockReason) — серые кнопки с подсказкой. */
  blocked?: { take?: string; hunt?: string; pirate?: string; sleep?: string } | null;
  onIntent: (i: { kind: "take" | "takePlant" | "takeFlora" | "hunt" | "pirate" | "shelter" | "plantAttack" | "parasitize" | "hibernate" | "fat" | "graze" | "none" }) => void;
  onEndTurn: () => void;
  onSkip: () => void;
}) {
  const dispatch = useGameStore((s) => s.dispatch);
  const t = useT();
  const lang = useLang();
  // «Закончить питание» всегда спрашивает подтверждение: при голодных — об их
  // гибели в вымирание, при сытых — о досрочном завершении фазы.
  const [confirmSkip, setConfirmSkip] = useState(false);
  // Голодные особи, а не виды: часть вида могла утолить голод фишками.
  const hungry = useMemo(
    () =>
      human.animals.reduce((n, a) => {
        if (isFed(a, true)) return n;
        const pop = a.population ?? 1;
        const need = foodNeeded(a, true);
        const fed = need > 0 ? Math.min(pop, Math.floor(a.food / need)) : 0;
        return n + Math.max(0, pop - fed);
      }, 0),
    [human.animals],
  );
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
  // Взаимоисключающие группы по правилам (движок: used.foodTaken/combatUsed):
  // «слот еды» (взять еду, убежище, хищное растение, паразит) и «слот атаки»
  // (охота, пиратство). Спячка, жир и топтун совместимы с любым из них —
  // им трещины не показываем, иначе интерфейс врёт про запрет.
  const attackOn = intentKind === "hunt" || intentKind === "pirate";
  const foodOn =
    intentKind === "take" ||
    intentKind === "takePlant" ||
    intentKind === "takeFlora" ||
    intentKind === "shelter" ||
    intentKind === "plantAttack" ||
    intentKind === "parasitize";
  // Подсказка по шагам: пока атакующий не выбран — зовём выбрать его; когда
  // выбран — говорим про красные метки, которые реально появились на целях.
  const intentHint =
    intentKind === "none"
      ? null
      : intentKind === "hunt" || intentKind === "pirate" || intentKind === "plantAttack"
        ? targetPicked
          ? INTENT_HINT_TARGET[intentKind]
            ? t(INTENT_HINT_TARGET[intentKind])
            : null
          : INTENT_HINT[intentKind]
            ? t(INTENT_HINT[intentKind])
            : null
        : (INTENT_HINT[intentKind] ? t(INTENT_HINT[intentKind]) : null);
  if (rageTurn) {
    return (
      <div className="flex flex-wrap items-center gap-2" onClick={dockClickSfx}>
        <span className="rounded-full border border-danger/60 bg-danger/15 px-3 py-1 text-xs font-medium text-clay">
          {t("dock.feed.rageBanner")}
        </span>
        {canHunt ? (
          <Button variant="danger" size="default" onClick={() => onIntent({ kind: "hunt" })}>
            {t("dock.feed.rageAttack")}
          </Button>
        ) : (
          <span className="text-xs text-subtle">{t("dock.feed.rageNoTarget")}</span>
        )}
        <Button
          variant="secondary"
          size="md"
          onClick={(e) => {
            e.currentTarget.blur();
            onEndTurn();
          }}
        >
          {t("dock.feed.endTurn")}
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2" onClick={dockClickSfx}>
      {bank > 0 ? (
        // Без «Континентов» это общая кормовая база — «Океан» появится только
        // с включённым модулем, где bank — именно океанская база.
        <span className="mr-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs tabular-nums text-muted">
          {continents ? t("dock.feed.oceanChip") : t("phase.foodBank")}:{" "}
          <span className="font-display text-sm text-fg">{bank}</span>
        </span>
      ) : null}
      {foodActs.length ? (
        <Button
          variant={intentKind === "take" || intentKind === "takePlant" || intentKind === "takeFlora" || intentKind === "none" ? "parchment" : "secondary"}
          size="default"
          className={attackOn ? "dock-cracked" : undefined}
          onClick={() => {
            if (foodActs.length === 1) dispatch(foodActs[0]!);
            else onIntent({ kind: plantTakes.length || floraTakes.length ? (floraTakes.length && !plantTakes.length ? "takeFlora" : "takePlant") : "take" });
          }}
        >
          {t("dock.feed.take")}
        </Button>
      ) : blocked?.take ? (
        <BlockedButton label={t("dock.feed.take")} reason={blocked.take} cracked={attackOn} />
      ) : null}
      {shelters.length ? (
        <Button
          variant={intentKind === "shelter" ? "parchment" : "secondary"}
          size="default"
          className={attackOn ? "dock-cracked" : undefined}
          title={t("dock.feed.shelterTitle")}
          onClick={() => {
            if (shelters.length === 1) dispatch(shelters[0]!);
            else onIntent({ kind: "shelter" });
          }}
        >
          {t("dock.feed.shelter")}
        </Button>
      ) : null}
      {plantAttacks.length ? (
        <Button
          variant={intentKind === "plantAttack" ? "danger" : "secondary"}
          size="default"
          className={attackOn ? "dock-cracked" : undefined}
          title={t("dock.feed.plantAttackTitle")}
          onClick={() => {
            if (plantAttacks.length === 1) dispatch(plantAttacks[0]!);
            else onIntent({ kind: "plantAttack" });
          }}
        >
          {t("dock.feed.plantAttack")}
        </Button>
      ) : null}
      {parasitizes.length ? (
        <Button
          variant={intentKind === "parasitize" ? "parchment" : "secondary"}
          size="default"
          className={attackOn ? "dock-cracked" : undefined}
          title={t("dock.feed.parasitizeTitle")}
          onClick={() => {
            if (parasitizes.length === 1) dispatch(parasitizes[0]!);
            else onIntent({ kind: "parasitize" });
          }}
        >
          {t("dock.feed.parasitize")}
        </Button>
      ) : null}
      {canHunt ? (
        <Button
          variant={intentKind === "hunt" ? "danger" : "secondary"}
          size="default"
          className={foodOn ? "dock-cracked" : undefined}
          onClick={() => onIntent({ kind: "hunt" })}
        >
          {t("dock.feed.hunt")}
        </Button>
      ) : blocked?.hunt ? (
        <BlockedButton label={t("dock.feed.hunt")} reason={blocked.hunt} cracked={foodOn} />
      ) : null}
      {canPirate ? (
        <Button
          variant={intentKind === "pirate" ? "parchment" : "secondary"}
          size="default"
          className={foodOn ? "dock-cracked" : undefined}
          onClick={() => onIntent({ kind: "pirate" })}
        >
          {t("dock.feed.pirate")}
        </Button>
      ) : blocked?.pirate ? (
        <BlockedButton label={t("dock.feed.pirate")} reason={blocked.pirate} cracked={foodOn} />
      ) : null}
      {sleeps.length ? (
        <Button
          variant={intentKind === "hibernate" ? "parchment" : "secondary"}
          size="default"
          onClick={() => {
            if (sleeps.length === 1) dispatch(sleeps[0]!);
            else onIntent({ kind: "hibernate" });
          }}
        >
          {t("dock.feed.hibernation")}
        </Button>
      ) : blocked?.sleep ? (
        <BlockedButton label={t("dock.feed.hibernation")} reason={blocked.sleep} />
      ) : null}
      {fats.length ? (
        <Button
          variant={intentKind === "fat" ? "parchment" : "secondary"}
          size="default"
          onClick={() => {
            if (fats.length === 1) dispatch(fats[0]!);
            else onIntent({ kind: "fat" });
          }}
        >
          {t("dock.feed.fat")}
        </Button>
      ) : null}
      {grazes.length ? (
        <Button
          variant={intentKind === "graze" ? "parchment" : "secondary"}
          size="default"
          onClick={() => {
            if (grazes.length === 1) dispatch(grazes[0]!);
            else onIntent({ kind: "graze" });
          }}
        >
          {t("dock.feed.graze")}
        </Button>
      ) : null}
      {migrations.length ? (
        migrations.length === 1 ? (
          <Button variant="secondary" size="default" onClick={() => dispatch(migrations[0])}>
            {t("dock.feed.migrate")}
          </Button>
        ) : (
          <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
            {migrations.map((m, i) => {
              const target = m.moves[0]!.to;
              const label = target === "laurasia" ? `↑ ${territoryName("laurasia", lang)}` : target === "gondwana" ? `↓ ${territoryName("gondwana", lang)}` : `≈ ${territoryName("ocean", lang)}`;
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
      {/* Пояснение намерения — сразу справа от кнопок действий, а не у завершения хода. */}
      {intentHint ? (
        <HintNote compact className="max-w-64">
          {intentHint}
        </HintNote>
      ) : null}
      <Button
        variant="secondary"
        size="md"
        onClick={(e) => {
          // Снимаем фокус: иначе Enter «дожимает» кнопку и пасует за следующего игрока.
          e.currentTarget.blur();
          onEndTurn();
        }}
      >
        {t("dock.feed.endTurn")}
      </Button>
      {intentKind !== "none" ? (
        <Button variant="ghost" size="default" onClick={() => onIntent({ kind: "none" })} title={t("dock.cancelTitle")}>
          {t("common.cancel")}
        </Button>
      ) : null}
      {canSkip ? (
        <Button
          variant="secondary"
          size="md"
          onClick={(e) => {
            e.currentTarget.blur();
            // Подтверждение — всегда: голодные погибнут в вымирание, а при
            // сытых игрок просто завершает фазу питания досрочно.
            sfx.play("modal");
            setConfirmSkip(true);
          }}
          title={
            hungry > 0
              ? t("dock.feed.skipHungryTitle", { n: hungry })
              : t("dock.feed.skipFedTitle")
          }
          aria-label={t("dock.feed.skip")}
        >
          {t("dock.feed.skip")}
        </Button>
      ) : canSkipHint ? (
        <span className="text-xs text-subtle" title={t("dock.feed.skipHintTitle")}>
          {t("dock.feed.skipHint")}
        </span>
      ) : null}
      {confirmSkip ? (
        <ConfirmDialog
          title={t("dock.feed.skipConfirmTitle")}
          body={
            hungry > 0
              ? t(hungry === 1 ? "dock.feed.skipConfirmOne" : "dock.feed.skipConfirmMany", { n: hungry })
              : t("dock.feed.skipConfirmFed")
          }
          confirmLabel={t("dock.feed.skip")}
          cancelLabel={t("dock.feed.backToTurn")}
          tone={hungry > 0 ? "danger" : "default"}
          onConfirm={() => {
            sfx.play("modal");
            setConfirmSkip(false);
            onSkip();
          }}
          onClose={() => {
            sfx.play("modal");
            setConfirmSkip(false);
          }}
        />
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
  const t = useT();
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
        <h2 className="text-xl">{t("defense.title")}</h2>
        <p className="mt-1 text-sm text-muted">
          {t("defense.need", { need: prey ? foodNeeded(prey) : "—", food: prey?.food ?? 0 })}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {running ? (
            <Button onClick={() => onPick(running)}>{t("defense.running")}</Button>
          ) : null}
          {mimics.map((a) =>
            a.type === "chooseDefense" ? (
              <Button key={a.mimicryTargetId} variant="secondary" onClick={() => onPick(a)}>
                {t("defense.mimicry")}
              </Button>
            ) : null,
          )}
          {tails.map((a) => (
            <Button key={a.discardTraitId} variant="secondary" onClick={() => onPick(a)}>
              {t("defense.tailLoss")}
            </Button>
          ))}
          {none ? (
            <Button variant="danger" onClick={() => onPick(none)}>
              {t("defense.none")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
