import { Skull, Swords } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { findAnimal, hasTrait } from "@/game/queries";
import type { GameEvent, GameState } from "@/game/types";
import { currentLang, t, useT } from "@/lib/i18n";
import { PLANT_ART, SPECIES_EXTINCT, TRAIT_ART, speciesArt } from "@/lib/art";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { Dice3D } from "./dice-3d";
import { FoodCube } from "./icons";

/**
 * Оверлей важных событий партии: убийство добычи, бросок кубика за «Быстрое»,
 * отброс хвоста, мимикрия, вымирание, бросок кормовой базы. События встают в
 * очередь и показываются по одному: на десктопе — карточка по центру, на
 * телефоне — на весь экран. Каждое живёт пару секунд и уходит плавной
 * анимацией; клик по карточке или кнопка «Пропустить показ» снимают текущее
 * событие.
 *
 * Показ не блокирует стол: фон прозрачен для мыши (`.spotlight-passthrough`),
 * клики мимо карточки доходят до стола, поэтому очередь не гасится и при
 * переходе хода к человеку — иначе события конца фазы (кубики, вымирание)
 * молча пропадали, и следующий этап начинался «обрывом». Сервер держит
 * паузу на показ (см. spotlightMsOf в server.ts), поэтому состояние не
 * убегает вперёд модалок на смене фаз. Пропущенные сетевые батчи приходят
 * отдельным списком `replayEvents` и встают в ту же очередь — так отставший
 * поллинг не «прыгает» через события, а прокручивает их последовательно.
 */
export interface EventSpotlightProps {
  /** События пропущенных сетевых шагов: показываем по порядку, как живые. */
  replayEvents?: GameEvent[];
  /** Сообщает наружу, идёт ли показ прямо сейчас (карточка на экране). */
  onActiveChange?: (active: boolean) => void;
}

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

/**
 * Потолок очереди показов. Раньше очередь резалась до четырёх карточек —
 * события конца фазы (защита + убийство + вымирание + кубики) молча
 * пропадали. Теперь режем только патологию (счёт лет после сна вкладки):
 * нормальная смена фазы даёт 1–3 карточки за шаг.
 */
const QUEUE_CAP = 12;

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
  // Подпись животного собирается в момент события (эффект), поэтому живой
  // перевод t() честно отдаёт текущий язык — карточки короткоживущие.
  if (!info) return t("spot.animal");
  return `${info.owner}: ${t("game.pairNo", { n: info.no })}`;
}

/** Превращает события одного шага в очередь крупных показов. */
function buildItems(
  state: GameState,
  events: GameEvent[],
  registry: Map<string, AnimalInfo>,
  nextId: () => number,
): SpotlightItem[] {
  const items: SpotlightItem[] = [];
  const remembered = (id: string) => animalInfo(state, id) ?? registry.get(id) ?? null;
  const lang = currentLang();

  for (const e of events) {
    switch (e.kind) {
      case "diceRoll":
        items.push({
          id: nextId(),
          tone: "info",
          title: t("phase.foodBank"),
          dice: e.dice,
          note: t("spot.bankFood", { n: e.total }),
          ms: 2900,
        });
        break;
      case "preyKilled": {
        const carn = remembered(e.carnivoreId);
        const prey = remembered(e.preyId);
        items.push({
          id: nextId(),
          tone: "kill",
          title: t("spot.preyKilled"),
          note: t("spot.eats", { a: labelOf(carn), b: labelOf(prey) }),
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
            title: t("defense.running"),
            note: t("spot.triesRun", { a: labelOf(prey) }),
            dice: [e.roll ?? 1],
            verdict: { good, text: good ? t("spot.escaped") : t("spot.caught") },
            versus: { left: TRAIT_ART.running, right: prey?.art },
            ms: 3400,
          });
        } else if (e.defense === "tailLoss") {
          items.push({
            id: nextId(),
            tone: "escape",
            title: t("defense.tailLoss"),
            note: t("spot.survives", { a: labelOf(prey) }),
            cubes: [{ tone: "blue", n: 1 }],
            versus: { left: TRAIT_ART.tailLoss, right: prey?.art },
            ms: 2800,
          });
        } else if (e.defense === "mimicry") {
          items.push({
            id: nextId(),
            tone: "info",
            title: t("spot.mimicry"),
            note: t("spot.mimicryNote"),
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
          title: e.counter ? t("spot.counterattack") : t("dock.feed.plantAttack"),
          note: e.counter
            ? t("spot.plantStrikes")
            : t("spot.plantCatches", { a: lang === "ru" ? labelOf(prey).toLowerCase() : labelOf(prey) }),
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
          title: t("spot.paralysis"),
          note: t("spot.cannotAttack", { a: labelOf(carn) }),
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
  const deaths = events.filter((e) => e.kind === "animalDied");
  if (deaths.length) {
    const starved = deaths.filter((e) => e.kind === "animalDied" && e.cause === "starved").length;
    items.push({
      id: nextId(),
      tone: "death",
      title: t("phase.extinction"),
      note:
        deaths.length === 1
          ? starved === 0
            ? t("spot.diedOneNoStarve")
            : t("spot.diedOneStarve")
          : starved
            ? t("spot.diedManyStarve", { n: deaths.length, m: starved })
            : t("spot.diedMany", { n: deaths.length }),
      versus: { left: SPECIES_EXTINCT },
      ms: 2700,
    });
  }

  return items;
}

export function EventSpotlight({ replayEvents, onActiveChange }: EventSpotlightProps = {}) {
  const state = useGameStore((s) => s.state);
  const speed = useGameStore((s) => s.speed);
  const mult = speed === "slow" ? 1.5 : speed === "fast" ? 0.6 : 1;

  const [queue, setQueue] = useState<SpotlightItem[]>([]);
  const [current, setCurrent] = useState<SpotlightItem | null>(null);
  const [closing, setClosing] = useState(false);
  const seqRef = useRef(-1);
  const replayRef = useRef<GameEvent[] | null>(null);
  const idRef = useRef(0);
  const registryRef = useRef(new Map<string, AnimalInfo>());

  const nextId = useCallback(() => {
    idRef.current += 1;
    return idRef.current;
  }, []);

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

  // Пропущенные сетевые батчи: тот же показ, тем же темпом, по порядку.
  // Массив приходит новым только когда появились ещё не виденные шаги.
  // Эффект объявлен ДО живого кадра: пропущенные шаги старше текущего и
  // обязаны встать в очередь раньше его карточек.
  useEffect(() => {
    if (!state || !replayEvents?.length || replayEvents === replayRef.current) return;
    replayRef.current = replayEvents;
    const items = buildItems(state, replayEvents, registryRef.current, nextId);
    if (items.length) setQueue((q) => [...q, ...items].slice(-QUEUE_CAP));
  }, [state, replayEvents, nextId]);

  // Живой кадр: события последнего действия человека/ботов.
  useEffect(() => {
    if (!state || state.eventSeq === seqRef.current) return;
    seqRef.current = state.eventSeq;
    const items = buildItems(state, state.lastEvents, registryRef.current, nextId);
    if (items.length) setQueue((q) => [...q, ...items].slice(-QUEUE_CAP));
  }, [state, nextId]);

  // Показ идёт / закончился — наружу (карточка «Ваш ход» ждёт очереди).
  useEffect(() => {
    onActiveChange?.(current !== null);
  }, [current, onActiveChange]);

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

  // Пропустить показ: без анимации закрытия, как и прежний клик по оверлею.
  const skip = useCallback(() => {
    setCurrent(null);
    setClosing(false);
  }, []);

  if (!current) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      // Показ не блокирует стол: фон (spotlight-passthrough) прозрачен для
      // мыши, клики мимо карточки доходят до стола; клик по карточке — дальше.
      className="spotlight-passthrough fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="spotlight-backdrop absolute inset-0" aria-hidden />
      <SpotlightCard key={current.id} item={current} closing={closing} onSkip={skip} />
    </div>
  );
}

function SpotlightCard({
  item,
  closing,
  onSkip,
}: {
  item: SpotlightItem;
  closing: boolean;
  onSkip: () => void;
}) {
  // Бросок: секунда кувырков 3D-кубика, затем значение и вердикт.
  const t = useT();
  const [phase, setPhase] = useState<"roll" | "result">(item.dice ? "roll" : "result");
  useEffect(() => {
    if (!item.dice) return;
    const t = setTimeout(() => setPhase("result"), 1150);
    return () => clearTimeout(t);
  }, [item]);

  return (
    <article
      // Клик по карточке пропускает показ: стол под фоном остаётся живым
      // (spotlight-passthrough), поэтому «дальше» — только сама карточка.
      onClick={onSkip}
      className={cn(
        // Модальное окно на всех ширинах: на телефоне карточка по центру с
        // полями, а не во весь экран — стол и контекст остаются видимыми.
        "spotlight-card grain relative flex max-h-[85dvh] w-full max-w-md flex-col items-center justify-center gap-4 overflow-y-auto rounded-[var(--radius-xl)] border bg-surface px-6 py-8 text-center shadow-[var(--shadow-card)] sm:px-8 sm:py-9",
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
          <Dice3D values={item.dice} rolling={phase === "roll"} dieSize={64} ariaLabel={t("spot.dieAria", { dice: item.dice.join(", ") })} />
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

      {/* Футер в потоке, а не absolute: на короткой карточке абсолютный блок
          наезжал на текст записки и цифры «слипались» в кашу. mt-auto жмёт
          его к низу и в полноэкранном, и в компактном варианте. */}
      <div className="mt-auto flex flex-col items-center gap-1 pt-3">
        <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted">
          {t("spot.skip")}
        </Button>
        <span className="text-[10px] uppercase tracking-[0.18em] text-subtle">{t("spot.clickHint")}</span>
      </div>
    </article>
  );
}
