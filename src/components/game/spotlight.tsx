import { Skull, Swords } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { findAnimal, hasTrait } from "@/game/queries";
import type { GameState } from "@/game/types";
import { PLANT_ART, SPECIES_EXTINCT, TRAIT_ART, speciesArt } from "@/lib/art";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { Dice3D } from "./dice-3d";
import { FoodCube } from "./icons";

/**
 * Оверлей важных событий партии: убийство добычи, бросок кубика за «Быстрое»,
 * отброс хвоста, мимикрия, вымирание, бросок кормовой базы. События встают в
 * очередь и показываются по одному: на десктопе — карточка по центру с мыльным
 * фоном, на телефоне — на весь экран. Каждое живёт пару секунд и уходит
 * плавной анимацией; тап/клик по оверлею пропускает показ.
 */

type CubeTone = "red" | "blue" | "yellow" | "green";

interface SpotlightItem {
  id: number;
  title: string;
  note?: string;
  tone: "kill" | "escape" | "death" | "info" | "plant";
  /** Бросок: 3D-кубик кувыркается, затем ложится значением и появляется вердикт. */
  dice?: number[];
  verdict?: { good: boolean; text: string };
  /** Полученные фишки — кубиками, как на столе. */
  cubes?: Array<{ tone: CubeTone; n: number }>;
  /** Две картинки друг против друга: кто на кого. */
  versus?: { left?: string; right?: string; strike?: boolean };
  /** Сколько показывать (мс, до множителя скорости). */
  ms: number;
}

/** Память о встреченных животных: добыча к событию уже удалена из состояния. */
interface AnimalInfo {
  owner: string;
  no: number;
  art: string;
}

const TONE_BORDER: Record<SpotlightItem["tone"], string> = {
  kill: "border-danger/70",
  escape: "border-good/60",
  death: "border-danger/60",
  info: "border-border-strong",
  plant: "border-leaf/60",
};

function animalInfo(state: GameState, id: string): AnimalInfo | null {
  const a = findAnimal(state, id);
  if (!a) return null;
  const owner = state.players.find((p) => p.id === a.ownerId);
  const no = (owner?.animals.findIndex((x) => x.id === id) ?? -1) + 1;
  return {
    owner: owner?.name ?? "—",
    no: no || 1,
    art: speciesArt({
      swimming: hasTrait(a, "swimming"),
      carnivore: hasTrait(a, "carnivore"),
      bulky: hasTrait(a, "highBodyWeight"),
    }),
  };
}

function labelOf(info: AnimalInfo | null): string {
  return info ? `${info.owner}: №${info.no}` : "животное";
}

/** Превращает события последнего действия в очередь крупных показов. */
function buildItems(state: GameState, registry: Map<string, AnimalInfo>, nextId: () => number): SpotlightItem[] {
  const items: SpotlightItem[] = [];
  const remembered = (id: string) => animalInfo(state, id) ?? registry.get(id) ?? null;

  for (const e of state.lastEvents) {
    switch (e.kind) {
      case "diceRoll":
        items.push({
          id: nextId(),
          tone: "info",
          title: "Кормовая база",
          dice: e.dice,
          note: `Еды на этот год: ${e.total}`,
          ms: 2900,
        });
        break;
      case "preyKilled": {
        const carn = remembered(e.carnivoreId);
        const prey = remembered(e.preyId);
        items.push({
          id: nextId(),
          tone: "kill",
          title: "Добыча убита",
          note: `${labelOf(carn)} съедает ${labelOf(prey)}`,
          cubes: [{ tone: "blue", n: 2 }],
          versus: { left: carn?.art, right: prey?.art, strike: true },
          ms: 3000,
        });
        break;
      }
      case "defenseUsed": {
        const prey = remembered(e.preyId);
        if (e.defense === "running") {
          const good = (e.roll ?? 0) >= 4;
          items.push({
            id: nextId(),
            tone: good ? "escape" : "kill",
            title: "Быстрое — бросок кубика",
            note: `${labelOf(prey)} пытается убежать`,
            dice: [e.roll ?? 1],
            verdict: { good, text: good ? "Спаслось!" : "Хищник догнал!" },
            versus: { left: TRAIT_ART.running, right: prey?.art },
            ms: 3400,
          });
        } else if (e.defense === "tailLoss") {
          items.push({
            id: nextId(),
            tone: "escape",
            title: "Отбросить хвост",
            note: `${labelOf(prey)} выживает`,
            cubes: [{ tone: "blue", n: 1 }],
            versus: { left: TRAIT_ART.tailLoss, right: prey?.art },
            ms: 2800,
          });
        } else if (e.defense === "mimicry") {
          items.push({
            id: nextId(),
            tone: "info",
            title: "Мимикрия",
            note: "Атака перенаправлена на другое животное",
            versus: { left: TRAIT_ART.mimicry, right: prey?.art },
            ms: 2400,
          });
        }
        break;
      }
      case "plantAttack": {
        const prey = remembered(e.preyId);
        const plant = (state.plants ?? []).find((p) => p.id === e.plantId);
        items.push({
          id: nextId(),
          tone: "plant",
          title: e.counter ? "Контратака растения" : "Хищное растение",
          note: `${e.counter ? "Растение бьёт по нападавшему" : `Растение ловит ${labelOf(prey).toLowerCase()}`}`,
          versus: { left: plant ? PLANT_ART[plant.kind] : PLANT_ART.carnivorous, right: prey?.art, strike: true },
          ms: 2500,
        });
        break;
      }
      case "paralyzed": {
        const carn = remembered(e.carnivoreId);
        items.push({
          id: nextId(),
          tone: "info",
          title: "Паралич",
          note: `${labelOf(carn)} не может атаковать в этом году`,
          versus: { left: TRAIT_ART.nematocysts, right: carn?.art },
          ms: 2300,
        });
        break;
      }
      default:
        break;
    }
  }

  // Вымирание: одной сводкой по всем погибшим в этом действии.
  const deaths = state.lastEvents.filter((e) => e.kind === "animalDied");
  if (deaths.length) {
    const starved = deaths.filter((e) => e.kind === "animalDied" && e.cause === "starved").length;
    items.push({
      id: nextId(),
      tone: "death",
      title: "Вымирание",
      note:
        deaths.length === 1
          ? `Погибло животное${starved === 0 ? " — не от голода" : " от голода"}`
          : `Погибло животных: ${deaths.length}${starved ? ` (от голода — ${starved})` : ""}`,
      versus: { left: SPECIES_EXTINCT },
      ms: 2700,
    });
  }

  return items;
}

export function EventSpotlight() {
  const state = useGameStore((s) => s.state);
  const speed = useGameStore((s) => s.speed);
  const mult = speed === "slow" ? 1.5 : speed === "fast" ? 0.6 : 1;

  const [queue, setQueue] = useState<SpotlightItem[]>([]);
  const [current, setCurrent] = useState<SpotlightItem | null>(null);
  const [closing, setClosing] = useState(false);
  const seqRef = useRef(-1);
  const idRef = useRef(0);
  const registryRef = useRef(new Map<string, AnimalInfo>());

  // Пополняем память о животных на каждом состоянии (до разбора событий).
  useEffect(() => {
    if (!state) return;
    for (const p of state.players) {
      p.animals.forEach((a, i) => {
        registryRef.current.set(a.id, {
          owner: p.name,
          no: i + 1,
          art: speciesArt({
            swimming: hasTrait(a, "swimming"),
            carnivore: hasTrait(a, "carnivore"),
            bulky: hasTrait(a, "highBodyWeight"),
          }),
        });
      });
    }
  }, [state]);

  useEffect(() => {
    if (!state || state.eventSeq === seqRef.current) return;
    seqRef.current = state.eventSeq;
    const items = buildItems(state, registryRef.current, () => {
      idRef.current += 1;
      return idRef.current;
    });
    if (items.length) setQueue((q) => [...q, ...items].slice(-4));
  }, [state]);

  // Очередь → текущий показ.
  useEffect(() => {
    if (current || queue.length === 0) return;
    setCurrent(queue[0]!);
    setQueue((q) => q.slice(1));
  }, [current, queue]);

  // Уход текущего: сперва плавное закрытие, затем снятие.
  useEffect(() => {
    if (!current) return;
    const total = Math.max(1500, current.ms * mult);
    const tOut = setTimeout(() => setClosing(true), Math.max(0, total - 280));
    const tDone = setTimeout(() => {
      setCurrent(null);
      setClosing(false);
    }, total);
    return () => {
      clearTimeout(tOut);
      clearTimeout(tDone);
    };
  }, [current, mult]);

  if (!current) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6"
      onClick={() => {
        setCurrent(null);
        setClosing(false);
      }}
    >
      <div className="spotlight-backdrop absolute inset-0" />
      <SpotlightCard key={current.id} item={current} closing={closing} />
    </div>
  );
}

function SpotlightCard({ item, closing }: { item: SpotlightItem; closing: boolean }) {
  // Бросок: секунда кувырков 3D-кубика, затем значение и вердикт.
  const [phase, setPhase] = useState<"roll" | "result">(item.dice ? "roll" : "result");
  useEffect(() => {
    if (!item.dice) return;
    const t = setTimeout(() => setPhase("result"), 1150);
    return () => clearTimeout(t);
  }, [item]);

  return (
    <article
      className={cn(
        "spotlight-card grain relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden border bg-surface px-6 py-10 text-center shadow-[var(--shadow-card)] sm:h-auto sm:max-w-md sm:rounded-[var(--radius-xl)] sm:px-8 sm:py-9",
        TONE_BORDER[item.tone],
        closing && "spotlight-out",
      )}
    >
      <h2 className="font-display text-2xl leading-tight sm:text-[1.7rem]">{item.title}</h2>

      {item.versus ? (
        <div className="flex items-center gap-4">
          {item.versus.left ? (
            <img
              src={item.versus.left}
              alt=""
              className="size-20 rounded-full border border-border object-cover object-top shadow-[var(--shadow-card)] sm:size-24"
            />
          ) : null}
          {item.versus.left && item.versus.right ? (
            item.versus.strike ? (
              <span className="grid size-10 place-items-center rounded-full border border-danger/60 bg-danger/20 text-clay">
                <Skull className="size-5" />
              </span>
            ) : (
              <span className="grid size-10 place-items-center rounded-full border border-border-strong bg-bg/60 text-muted">
                <Swords className="size-5" />
              </span>
            )
          ) : null}
          {item.versus.right ? (
            <img
              src={item.versus.right}
              alt=""
              className={cn(
                "size-20 rounded-full border border-border object-cover object-top shadow-[var(--shadow-card)] sm:size-24",
                item.versus.strike && "grayscale",
              )}
            />
          ) : null}
        </div>
      ) : null}

      {item.dice ? (
        <div className="flex flex-col items-center gap-2">
          <Dice3D values={item.dice} rolling={phase === "roll"} dieSize={64} ariaLabel={`Кубик: ${item.dice.join(", ")}`} />
          {item.verdict ? (
            <span
              className={cn(
                "font-display text-xl leading-none",
                phase === "result" ? "pop-in" : "opacity-0",
                item.verdict.good ? "text-good" : "text-clay",
              )}
            >
              {item.verdict.text}
            </span>
          ) : null}
        </div>
      ) : null}

      {item.cubes?.length ? (
        <div className="flex items-center gap-2">
          {item.cubes.flatMap((c) =>
            Array.from({ length: c.n }).map((_, i) => (
              <FoodCube key={`${c.tone}-${i}`} tone={c.tone} className="pop-in size-6" />
            )),
          )}
        </div>
      ) : null}

      {item.note ? <p className="max-w-[34ch] text-sm leading-snug text-muted">{item.note}</p> : null}

      <span className="absolute bottom-4 text-[10px] uppercase tracking-[0.18em] text-subtle">нажмите, чтобы продолжить</span>
    </article>
  );
}
