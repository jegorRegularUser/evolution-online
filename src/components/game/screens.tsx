import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Lightbulb,
  Lock,
  RotateCcw,
} from "lucide-react";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { DialogShell } from "@/components/ui/dialog-shell";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { NetMenuScreen } from "@/components/game/net-screens";
import { FLORA, MARKS } from "@/game/flora";
import { PLANTS } from "@/game/plants";
import { CONTINENTS_TRAIT_IDS, FUNGI_TRAIT_IDS, MUTATIONS_TRAIT_IDS, PLANTS_TRAIT_IDS, TRAIT_ORDER } from "@/game/traits";
import { TERRITORIES } from "@/game/types";
import type { FloraKind, MarkKind, PlantKind, ScoreBreakdown, TerritoryId, TraitId } from "@/game/types";
import { sfx } from "@/lib/sfx";
import { ACHIEVEMENTS, readStats } from "@/lib/stats";
import {
  achievementDesc,
  achievementName,
  floraDesc,
  floraName,
  markDesc,
  markName,
  plantDesc,
  plantName,
  placeLabel,
  scientistName,
  pointsWord,
  playersWord,
  territoryName,
  traitDesc,
  traitName,
  translate,
  useLang,
  useT,
  type Lang,
  type TKey,
} from "@/lib/i18n";
import {
  BG,
  DARK_ART,
  FLORA_ART,
  MARK_ART,
  PLANT_ART,
  SPECIES_EXTINCT,
  TERRITORY_ART,
  TRAIT_ART,
  speciesArt,
} from "@/lib/art";
import { cn } from "@/lib/utils";
import { Dice3D } from "./dice-3d";
import { FloraGlyph, FoodCube, TraitGlyph } from "./icons";
import { SoundToggle } from "./sound-toggle";
import { TopBar } from "./top-bar";
import { TutorialScreen } from "./tutorial";
import { useGameStore } from "@/store/game-store";

/** Видимый фокус для кастомных кнопок-переключателей вне Button из UI-кита. */
const FOCUS_VISIBLE =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

/**
 * Главное меню: три колонки, как в столе ожидания. Слева — имя и вход или
 * создание стола, в центре — открытые столы, справа — закрытые (пароль
 * спрашивается по клику на строку). Все три колонки одной высоты, списки
 * скроллятся внутри себя и не растят страницу; на телефоне работают две
 * вкладки — «Столы» и «Создать».
 */
export function MenuScreen({ onRules }: { onRules: () => void }) {
  const tt = useT();
  const [statsOpen, setStatsOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const netFatal = useGameStore((s) => s.netFatal);
  const clearNetFatal = useGameStore((s) => s.clearNetFatal);

  // Обучение и статистика — модалки меню: открытие и закрытие звучат тихим свушем.
  const openTutorial = () => {
    sfx.play("modal");
    setTutorialOpen(true);
  };
  const closeTutorial = () => {
    sfx.play("modal");
    setTutorialOpen(false);
  };
  const openStats = () => {
    sfx.play("modal");
    setStatsOpen(true);
  };
  const closeStats = () => {
    sfx.play("modal");
    setStatsOpen(false);
  };

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {/* Зелёная долина — тот же фон, что лежит под столом в партии,
            плюс бумажная текстура атласа. */}
        <img src={BG.valley} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/55 to-bg" />
        <div className="absolute inset-0 paper-desk opacity-[0.14]" />
      </div>
      <div className="relative flex min-h-dvh flex-col">
        {/* Полоса навигации — как шапка игрового стола: лого и название
            слева, справа правила, обучение, статистика и звук. */}
        <TopBar subtitle={tt("app.brand")}>
          {/* На узком экране подписи скрыты — кнопки остаются иконочными,
              поэтому у каждой есть постоянное доступное имя. max-xl:h-11 —
              тап-таргет 44px на телефоне и планшете. */}
          <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.tutorial")} title={tt("topbar.tutorial")} onClick={openTutorial}>
            <GraduationCap className="size-4" />
            <span className="hidden sm:inline">{tt("topbar.tutorial")}</span>
          </Button>
          <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.rules")} title={tt("topbar.rules")} onClick={onRules}>
            <BookOpen className="size-4" />
            <span className="hidden sm:inline">{tt("topbar.rules")}</span>
          </Button>
          <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.stats")} title={tt("topbar.stats")} onClick={openStats}>
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">{tt("topbar.stats")}</span>
          </Button>
          <SoundToggle />
        </TopBar>

        {/* Столы — единственный путь в партию: соло-режим убран, игра с ботами
            идёт через «Создать стол» → боты в лобби → «Начать год». */}
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4 lg:h-[calc(100dvh-3.5rem)] lg:flex-[1_1_0px] lg:overflow-hidden">
          <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-2xl tracking-[0.08em] text-fg sm:text-3xl">{tt("app.name")}</h1>
            <p className="text-xs text-muted sm:text-sm">{tt("menu.subtitle")}</p>
          </header>

          {netFatal ? (
            <div
              role="alert"
              className="mb-3 flex items-start justify-between gap-3 rounded-[var(--radius-lg)] border border-danger/50 bg-danger/10 px-4 py-3"
            >
              <p className="flex items-start gap-2 text-sm text-clay">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                {/* Строка приходит из стора/сети — её локализует следующая волна. */}
                <span>{netFatal}</span>
              </p>
              <Button variant="ghost" size="sm" className="shrink-0" onClick={clearNetFatal}>
                {tt("common.gotIt")}
              </Button>
            </div>
          ) : null}

          {/* Одна высота на все три колонки: секции списков скроллятся внутри
              себя (lg:overflow-y-auto), страница не растёт. На телефоне трек
              задан как minmax(0,1fr): auto-трек растягивался по max-content
              содержимого и давал горизонтальный скролл на 390px. */}
          <div className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,360px)]">
            <NetMenuScreen />
          </div>
        </div>
      </div>
      {tutorialOpen ? <TutorialScreen onClose={closeTutorial} /> : null}
      {statsOpen ? <StatsScreen onClose={closeStats} /> : null}
    </>
  );
}

type RulesTab = "base" | "continents" | "plants" | "fungi" | "mutations";

/** Подпись вкладки правил — ключ словаря. */
const RULES_TAB_KEYS: Record<RulesTab, TKey> = {
  base: "rules.tab.base",
  continents: "rules.tab.continents",
  plants: "rules.tab.plants",
  fungi: "rules.tab.fungi",
  mutations: "rules.tab.mutations",
};

const TRAITS_BY_TAB: Record<RulesTab, TraitId[]> = {
  base: TRAIT_ORDER.filter(
    (id) =>
      !CONTINENTS_TRAIT_IDS.has(id) &&
      !PLANTS_TRAIT_IDS.has(id) &&
      !FUNGI_TRAIT_IDS.has(id) &&
      !MUTATIONS_TRAIT_IDS.has(id),
  ),
  continents: TRAIT_ORDER.filter((id) => CONTINENTS_TRAIT_IDS.has(id)),
  plants: TRAIT_ORDER.filter((id) => PLANTS_TRAIT_IDS.has(id)),
  fungi: TRAIT_ORDER.filter((id) => FUNGI_TRAIT_IDS.has(id)),
  mutations: TRAIT_ORDER.filter((id) => MUTATIONS_TRAIT_IDS.has(id)),
};

/** Список свойств в правилах: имена и описания — через словарь терминов. */
function TraitList({ ids }: { ids: TraitId[] }) {
  const lang = useLang();
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {ids.map((id) => {
        return (
          <li key={id} className="flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3">
            {TRAIT_ART[id] ? (
              <img
                src={TRAIT_ART[id]}
                alt=""
                loading="lazy"
                className={cn(
                  "h-[68px] w-12 shrink-0 rounded-[var(--radius-xs)] object-cover object-top",
                  DARK_ART.has(id) && "bg-ink object-contain p-0.5",
                )}
              />
            ) : (
              <span className="flex h-[68px] w-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-border bg-surface">
                <TraitGlyph id={id} className="size-7 text-muted" />
              </span>
            )}
            <div>
              <div className="font-medium text-fg">{traitName(id, lang)}</div>
              <div className="mt-1 text-xs leading-snug">{traitDesc(id, lang)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Список карт флоры «Травы и грибов» в правилах. */
function FloraList() {
  const lang = useLang();
  const tt = useT();
  const kinds = Object.keys(FLORA) as FloraKind[];
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {kinds.map((k) => {
        const f = FLORA[k];
        return (
          <li key={k} className="flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3">
            {FLORA_ART[k] ? (
              <img
                src={FLORA_ART[k]}
                alt=""
                loading="lazy"
                className="h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border object-cover"
              />
            ) : (
              <span
                className={cn(
                  "flex h-[68px] w-[102px] shrink-0 items-center justify-center rounded-[var(--radius-xs)] border",
                  f.isFungus ? "border-virus/40 bg-virus/10 text-virus" : "border-leaf/40 bg-leaf/10 text-leaf",
                )}
              >
                <FloraGlyph kind={k} className="size-7" />
              </span>
            )}
            <div>
              <div className="font-medium text-fg">
                {floraName(k, lang)}
                <span className="ml-1 text-xs font-normal text-muted">
                  {f.isFungus ? tt("rules.flora.fungus") : tt("rules.flora.grass")}
                </span>
              </div>
              <div className="mt-1 text-xs leading-snug">{floraDesc(k, lang)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Список меток последствий в правилах. */
function MarksList() {
  const lang = useLang();
  const tt = useT();
  const kinds = Object.keys(MARKS) as MarkKind[];
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {kinds.map((k) => {
        return (
          <li key={k} className="flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3">
            <img
              src={MARK_ART[k]}
              alt=""
              loading="lazy"
              className="size-10 shrink-0 self-start rounded-full object-cover ring-1 ring-border"
            />
            <div>
              <div className="font-medium text-fg">{tt("rules.mark.line", { name: markName(k, lang) })}</div>
              <div className="mt-1 text-xs leading-snug">{markDesc(k, lang)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Список видов растений «Растений» в правилах. */
function PlantsList() {
  const lang = useLang();
  const kinds = Object.keys(PLANTS) as PlantKind[];
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {kinds.map((k) => {
        return (
          <li key={k} className="flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3">
            {PLANT_ART[k] ? (
              <img
                src={PLANT_ART[k]}
                alt=""
                loading="lazy"
                className="h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border object-cover"
              />
            ) : (
              <span className="h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border bg-surface" />
            )}
            <div>
              <div className="font-medium text-fg">{plantName(k, lang)}</div>
              <div className="mt-1 text-xs leading-snug">{plantDesc(k, lang)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Описания территорий «Континентов» для карточек в правилах — ключи словаря. */
const TERRITORY_DESC_KEYS: Record<TerritoryId, TKey> = {
  laurasia: "rules.terr.laurasia",
  gondwana: "rules.terr.gondwana",
  ocean: "rules.terr.ocean",
};

/** Карточки территорий «Континентов» в правилах. */
function TerritoryList() {
  const lang = useLang();
  const tt = useT();
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {TERRITORIES.map((terr) => (
        <figure key={terr.id} className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
          <img
            src={TERRITORY_ART[terr.id]}
            alt={territoryName(terr.id, lang)}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <figcaption className="p-2.5">
            <div className="text-sm font-medium text-fg">{territoryName(terr.id, lang)}</div>
            <div className="mt-1 text-xs leading-snug">{tt(TERRITORY_DESC_KEYS[terr.id])}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Кубик-фишка еды из игры (FoodCube) в базовых правилах. */
function RuleCube({ tone, label }: { tone: "red" | "blue" | "yellow" | "green"; label: string }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <FoodCube tone={tone} className="size-8" title={label} />
      <span className="text-[10px] leading-none text-muted">{label}</span>
    </span>
  );
}

/** Круглая иллюстрация базовых правил: медальон животного. */
function RuleToken({ src, label }: { src: string; label?: string }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <img src={src} alt="" loading="lazy" className="size-10 rounded-full object-cover ring-1 ring-border" />
      {label ? <span className="text-[10px] leading-none text-muted">{label}</span> : null}
    </span>
  );
}

/** Миниатюра карты для базовых правил. */
function RuleCard({ src, label }: { src: string; label?: string }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-16 w-11 rounded-[var(--radius-xs)] border border-border object-cover"
      />
      {label ? <span className="text-[10px] leading-none text-muted">{label}</span> : null}
    </span>
  );
}

export function RulesPanel({ onClose }: { onClose: () => void }) {
  const tt = useT();
  const [tab, setTab] = useState<RulesTab>("base");
  const titleId = useId();
  // Правила закрываются и Esc, и кликом по затемнению вокруг карточки.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <DialogShell
      titleId={titleId}
      overlayClassName="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6"
      panelClassName="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-5 sm:rounded-[var(--radius-xl)] sm:p-8"
      onBackdropClick={onClose}
    >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} tabIndex={-1} className="text-2xl">{tt("rules.title")}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            {tt("common.close")}
          </Button>
        </div>
        <div role="tablist" aria-label={tt("rules.tabs")} className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(RULES_TAB_KEYS) as RulesTab[]).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`${titleId}-tab-${id}`}
              aria-controls={`${titleId}-panel`}
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                FOCUS_VISIBLE,
                "h-11 rounded-[var(--radius-md)] border px-1 text-sm font-medium",
                tab === id
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border bg-bg text-fg hover:bg-surface-2",
              )}
            >
              {tt(RULES_TAB_KEYS[id])}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`${titleId}-panel`} aria-labelledby={`${titleId}-tab-${tab}`} tabIndex={0}>
        {tab === "base" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.base.intro")}</p>
            <h3 className="text-fg">{tt("rules.base.year")}</h3>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">{tt("rules.base.dev")}</strong> {tt("rules.base.dev.text")}
                <span className="mt-2 flex flex-wrap items-end gap-3">
                  <RuleCard src={BG.cardBack} label={tt("rules.lbl.hand")} />
                  <RuleCard src={TRAIT_ART.carnivore!} label={tt("rules.lbl.trait")} />
                  <RuleToken src={speciesArt({})} label={tt("rules.lbl.animal")} />
                </span>
              </li>
              <li>
                <strong className="text-fg">{tt("rules.base.food")}</strong> 2: 1d6+2. 3: 2d6. 4: 2d6+2.
                <span className="mt-2 flex flex-wrap items-end gap-3">
                  <Dice3D values={[2, 5]} dieSize={44} gap={10} ariaLabel={tt("rules.lbl.dice")} />
                  <RuleCube tone="red" label={tt("rules.lbl.token")} />
                </span>
              </li>
              <li>
                <strong className="text-fg">{tt("rules.base.feed")}</strong> {tt("rules.base.feed.text")}
                <span className="mt-2 flex flex-wrap items-end gap-3">
                  <RuleCube tone="red" label={tt("rules.lbl.red")} />
                  <RuleCube tone="blue" label={tt("rules.lbl.blue")} />
                  <RuleCube tone="yellow" label={tt("rules.lbl.fat")} />
                </span>
              </li>
              <li>
                <strong className="text-fg">{tt("rules.base.ext")}</strong> {tt("rules.base.ext.text")}
                <span className="mt-2 flex flex-wrap items-end gap-3">
                  <RuleToken src={SPECIES_EXTINCT} label={tt("rules.lbl.extinct")} />
                  <RuleCard src={BG.cardBack} label={tt("rules.lbl.draw")} />
                </span>
              </li>
            </ol>
            <h3 className="text-fg">{tt("rules.base.score")}</h3>
            <p>{tt("rules.base.score.text")}</p>
            <span className="flex flex-wrap items-end gap-3">
              <RuleToken src={speciesArt({})} label="+2" />
              <RuleToken src={speciesArt({ carnivore: true })} label={tt("rules.lbl.carnBonus")} />
              <RuleCard src={TRAIT_ART.parasite!} label={tt("rules.lbl.parBonus")} />
            </span>
            <h3 className="text-fg">{tt("rules.base.traits")}</h3>
            <TraitList ids={TRAITS_BY_TAB.base} />
          </div>
        )}
        {tab === "continents" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.continents.intro")}</p>
            <TerritoryList />
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">{tt("rules.cont.territories")}</strong> {tt("rules.cont.territories.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.cont.bases")}</strong> {tt("rules.cont.bases.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.cont.pairs")}</strong> {tt("rules.cont.pairs.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.cont.migration")}</strong> {tt("rules.cont.migration.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.cont.newTraits")}</strong> {tt("rules.cont.newTraits.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.cont.rescue")}</strong> {tt("rules.cont.rescue.text")}
              </li>
            </ul>
            <h3 className="text-fg">{tt("rules.cont.traits")}</h3>
            <TraitList ids={TRAITS_BY_TAB.continents} />
          </div>
        )}
        {tab === "plants" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.plants.intro")}</p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">{tt("rules.plants.base")}</strong> {tt("rules.plants.base.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.plants.feeding")}</strong> {tt("rules.plants.feeding.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.plants.carnivorous")}</strong> {tt("rules.plants.carnivorous.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.plants.extinction")}</strong> {tt("rules.plants.extinction.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.plants.growth")}</strong> {tt("rules.plants.growth.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.plants.score")}</strong> {tt("rules.plants.score.text")}
              </li>
            </ul>
            <h3 className="text-fg">{tt("rules.plants.species")}</h3>
            <PlantsList />
            <h3 className="text-fg">{tt("rules.plants.traits")}</h3>
            <TraitList ids={TRAITS_BY_TAB.plants} />
            <p className="text-xs">{tt("rules.plants.footnote")}</p>
          </div>
        )}
        {tab === "fungi" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.fungi.intro")}</p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">{tt("rules.fungi.table")}</strong> {tt("rules.fungi.table.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.fungi.feeding")}</strong> {tt("rules.fungi.feeding.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.fungi.spread")}</strong> {tt("rules.fungi.spread.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.fungi.extinction")}</strong> {tt("rules.fungi.extinction.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.fungi.score")}</strong> {tt("rules.fungi.score.text")}
              </li>
            </ul>
            <h3 className="text-fg">{tt("rules.fungi.cards")}</h3>
            <FloraList />
            <h3 className="text-fg">{tt("rules.fungi.marks")}</h3>
            <MarksList />
            <h3 className="text-fg">{tt("rules.fungi.animalTraits")}</h3>
            <TraitList ids={TRAITS_BY_TAB.fungi} />
          </div>
        )}
        {tab === "mutations" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.mutations.intro")}</p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">{tt("rules.mut.deck")}</strong> {tt("rules.mut.deck.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.mut.fate")}</strong> {tt("rules.mut.fate.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.mut.population")}</strong> {tt("rules.mut.population.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.mut.draw")}</strong> {tt("rules.mut.draw.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.mut.score")}</strong> {tt("rules.mut.score.text")}
              </li>
            </ul>
            <h3 className="text-fg">{tt("rules.mut.traits")}</h3>
            <TraitList ids={TRAITS_BY_TAB.mutations} />
            <p className="text-xs">{tt("rules.mut.footnote")}</p>
          </div>
        )}
        </div>
    </DialogShell>
  );
}

/** Экран статистики из меню: история партий, график очков и достижения. */
export function StatsScreen({ onClose }: { onClose: () => void }) {
  const tt = useT();
  const lang = useLang();
  const titleId = useId();
  const stats = useMemo(() => readStats(), []);

  const games = stats.games;
  const wins = games.filter((g) => g.won).length;
  const best = games.reduce((m, g) => Math.max(m, g.score), 0);
  const winRate = games.length ? Math.round((wins / games.length) * 100) : 0;
  const chart = games.slice(-20).map((g, i) => ({ i: i + 1, score: g.score }));
  const topTraits = useMemo(() => {
    const totals = new Map<TraitId, number>();
    for (const g of games) {
      for (const [tr, n] of Object.entries(g.traits) as Array<[TraitId, number]>) {
        totals.set(tr, (totals.get(tr) ?? 0) + n);
      }
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [games]);

  const labels: Array<[TKey, string]> = [
    ["stats.games", String(games.length)],
    ["stats.wins", String(wins)],
    ["stats.winrate", `${winRate}%`],
    ["stats.best", String(best)],
  ];

  return (
    <DialogShell
      titleId={titleId}
      overlayClassName="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-3 backdrop-blur-sm sm:p-6"
      panelClassName="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-card)]"
      onBackdropClick={onClose}
      onEscape={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id={titleId} tabIndex={-1} className="text-xl">{tt("stats.title")}</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {tt("common.close")}
          </Button>
        </div>
        <div className="space-y-6 overflow-y-auto px-5 py-5">
          {games.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">{tt("stats.empty")}</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {labels.map(([key, value]) => (
                  <div key={key} className="rounded-[var(--radius-md)] border border-border bg-bg px-3 py-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted">{tt(key)}</div>
                    <div className="mt-1 font-display text-2xl tabular-nums">{value}</div>
                  </div>
                ))}
              </div>

              <section>
                <h3 className="mb-2 text-sm font-medium text-muted">{tt("stats.chart")}</h3>
                <div className="h-44 rounded-[var(--radius-md)] border border-border bg-bg p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
                      <CartesianGrid stroke="#2a3025" vertical={false} />
                      <XAxis dataKey="i" tick={{ fill: "#9aa08f", fontSize: 11 }} axisLine={{ stroke: "#2a3025" }} tickLine={false} />
                      <YAxis tick={{ fill: "#9aa08f", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#1c2119", border: "1px solid #2a3025", borderRadius: 8, fontSize: 12 }}
                        labelFormatter={(i) => tt("stats.chartGame", { i })}
                        formatter={(v) => [tt("stats.chartPoints", { n: v as number }), tt("stats.chartScore")]}
                      />
                      <Line type="monotone" dataKey="score" stroke="#8b9a74" strokeWidth={2} dot={{ r: 2.5, fill: "#8b9a74" }} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {topTraits.length ? (
                <section>
                  <h3 className="mb-2 text-sm font-medium text-muted">{tt("stats.topTraits")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {topTraits.map(([tr, n]) => (
                      <span key={tr} className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-fg">
                        {traitName(tr, lang)} · <span className="font-display tabular-nums">{n}</span>
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              <section>
                <h3 className="mb-2 text-sm font-medium text-muted">
                  {tt("stats.history")}
                  <span className="text-subtle">{tt("stats.historyLast", { n: Math.min(games.length, 10) })}</span>
                </h3>
                <ul className="space-y-1.5">
                  {[...games].reverse().slice(0, 10).map((g) => (
                    <li key={g.date} className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-xs">
                      <span className="min-w-0">
                        <span className="font-medium text-fg">{tt("stats.place", { place: g.place, players: g.players })}</span>
                        <span className="text-muted">
                          {" · "}
                          {g.mode === "net" ? tt("stats.mode.net") : tt("stats.mode.solo")} · {formatDate(g.date, lang)}
                        </span>
                        {g.modules.length ? (
                          <span className="text-subtle">{tt("stats.modules", { n: g.modules.length })}</span>
                        ) : null}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="font-display text-sm tabular-nums">{g.score}</span>
                        <span className={g.won ? "text-good" : "text-subtle"}>{g.won ? tt("stats.win") : "—"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-medium text-muted">
                  {tt("stats.achievements")}
                  <span className="text-subtle">
                    {tt("stats.achievementsOf", {
                      got: Object.keys(stats.achievements).length,
                      total: ACHIEVEMENTS.length,
                    })}
                  </span>
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ACHIEVEMENTS.map((a) => {
                    const got = Boolean(stats.achievements[a.id]);
                    const Icon = a.icon;
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          "flex items-start gap-3 rounded-[var(--radius-md)] border px-3 py-2.5",
                          got ? "border-accent/60 bg-accent/10" : "border-border bg-bg",
                        )}
                      >
                        {got ? (
                          <Icon className="mt-0.5 size-5 shrink-0 text-accent" />
                        ) : (
                          <Lock className="mt-0.5 size-5 shrink-0 text-subtle" />
                        )}
                        <span>
                          <span className="block text-sm font-medium text-fg">{achievementName(a.id, lang)}</span>
                          <span className="mt-0.5 block text-xs text-muted">{achievementDesc(a.id, lang)}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
    </DialogShell>
  );
}

function formatDate(ms: number, lang: "ru" | "en"): string {
  return new Date(ms).toLocaleDateString(lang === "en" ? "en-GB" : "ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

/**
 * Подписи слагаемых в компактной формуле счёта. Строчные — так формула
 * читается как строка данных: «животные 8 · свойства 3 · бонус 2 · сброс 1».
 * У флоры за «животными» стоят карты, за «бонусом» — фишки на картах.
 */
function sourceLabels(row: ScoreBreakdown, lang: Lang): {
  animals: string;
  traits: string;
  extras: string;
  animalsHint: string;
  traitsHint: string;
  extrasHint: string;
} {
  if (row.playerId === -1) {
    return {
      animals: translate(lang, "final.labels.flora.animals"),
      traits: translate(lang, "final.labels.flora.traits"),
      extras: translate(lang, "final.labels.flora.extras"),
      animalsHint: translate(lang, "final.hints.flora.animals"),
      traitsHint: translate(lang, "final.hints.flora.traits"),
      extrasHint: translate(lang, "final.hints.flora.extras"),
    };
  }
  return {
    animals: translate(lang, "final.labels.animals"),
    traits: translate(lang, "final.labels.traits"),
    extras: translate(lang, "final.labels.extras"),
    animalsHint: translate(lang, "final.hints.animals"),
    traitsHint: translate(lang, "final.hints.traits"),
    extrasHint: translate(lang, "final.hints.extras"),
  };
}

/** Места с учётом ничьих: равные очки и сброс делят одно место. */
function competitionPlaces(scores: ScoreBreakdown[]): number[] {
  const places: number[] = [];
  scores.forEach((s, i) => {
    const prev = scores[i - 1];
    const tied = Boolean(prev) && prev!.total === s.total && prev!.discard === s.discard;
    places.push(tied ? places[i - 1]! : i + 1);
  });
  return places;
}

/**
 * «Почему не первое место» — только из чисел ScoreBreakdown, без домыслов.
 * Если человек победил или честного объяснения не выводится, возвращает null.
 */
function explainDefeat(scores: ScoreBreakdown[], winnerIds: number[], humanId: number, lang: Lang): string | null {
  if (winnerIds.includes(humanId)) return null;
  const human = scores.find((s) => s.playerId === humanId);
  const winners = scores.filter((s) => winnerIds.includes(s.playerId) && s.playerId !== humanId);
  if (!human || !winners.length) return null;
  const leader = winners[0]!;
  const gap = leader.total - human.total;
  const pw = pointsWord(lang, gap);
  const leadText =
    winners.length > 1
      ? translate(lang, "final.defeat.sharedLead", {
          n: winners.length,
          players: playersWord(lang, winners.length),
          gap,
          points: pw,
        })
      : translate(lang, "final.defeat.behind", { gap, points: pw });
  if (gap === 0) {
    // Равные очки: движок отдаёт победу по сбросу, значит у лидера сброс больше.
    return leader.discard > human.discard
      ? translate(lang, "final.defeat.discardTie", {
          total: human.total,
          leader: leader.discard,
          human: human.discard,
        })
      : null;
  }
  if (leader.playerId === -1) {
    return translate(lang, "final.defeat.flora", {
      gap,
      points: pw,
      name: scientistName(leader.name, lang),
      leader: leader.total,
      human: human.total,
    });
  }
  const diffs = {
    animals: leader.animals - human.animals,
    traits: leader.traits - human.traits,
    extras: leader.extras - human.extras,
  };
  const sources = [
    { key: "animals" as const, on: translate(lang, "final.defeat.on.animals"), due: translate(lang, "final.defeat.due.animals") },
    { key: "traits" as const, on: translate(lang, "final.defeat.on.traits"), due: translate(lang, "final.defeat.due.traits") },
    { key: "extras" as const, on: translate(lang, "final.defeat.on.extras"), due: translate(lang, "final.defeat.due.extras") },
  ];
  const best = sources.reduce((m, s) => (diffs[s.key] > diffs[m.key] ? s : m), sources[0]!);
  if (diffs[best.key] <= 0) return translate(lang, "final.defeat.plain", { lead: leadText });
  if (diffs[best.key] === gap) {
    return translate(lang, "final.defeat.fully", { lead: leadText, due: best.due, leader: leader[best.key], human: human[best.key] });
  }
  return translate(lang, "final.defeat.mostly", { lead: leadText, on: best.on, leader: leader[best.key], human: human[best.key] });
}

/** true, если система просит меньше движения; на сервере — false. */
function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Следит за prefers-reduced-motion: при нём финал показывает всё сразу. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Строка игрока в финале: место, сумма и формула счёта по источникам.
 * Слагаемые появляются по шагам (animate); при reduced-motion — сразу.
 * Сброс стоит в формуле рядом, но помечен как «не в счёте»: он решает ничью.
 */
function ScoreRow({
  row,
  place,
  winner,
  animate,
}: {
  row: ScoreBreakdown;
  place: number;
  winner: boolean;
  animate: boolean;
}) {
  const tt = useT();
  const lang = useLang();
  const labels = sourceLabels(row, lang);
  const parts: Array<{ key: "animals" | "traits" | "extras"; label: string; value: number; hint: string }> = [
    { key: "animals", label: labels.animals, value: row.animals, hint: labels.animalsHint },
    { key: "traits", label: labels.traits, value: row.traits, hint: labels.traitsHint },
    { key: "extras", label: labels.extras, value: row.extras, hint: labels.extrasHint },
  ];
  const tone: Record<(typeof parts)[number]["key"], string> = {
    animals: "bg-accent",
    traits: "bg-leaf",
    extras: "bg-food-yellow",
  };
  const step = 180;
  return (
    <li
      className={cn(
        "score-row-in rounded-[var(--radius-md)] border px-3 py-3",
        winner ? "border-accent bg-accent/10" : "border-border bg-bg",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">
            {place}. {scientistName(row.name, lang)}
          </p>
          {winner ? <p className="mt-0.5 text-[10px] uppercase tracking-wide text-accent">{tt("final.best")}</p> : null}
        </div>
        <CountUp to={row.total} delayMs={animate ? 160 : 0} />
      </div>

      {/* Полоска-пропорция: сразу видно, какой источник дал больше очков. */}
      {row.total > 0 ? (
        <div aria-hidden className="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-ink/20">
          {parts.map((p) => (
            <span key={p.key} className={tone[p.key]} style={{ width: `${(p.value / row.total) * 100}%` }} />
          ))}
        </div>
      ) : null}

      <dl className="mt-2.5 text-xs">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
          {parts.map((p, i) => (
            <Fragment key={p.key}>
              {i > 0 ? (
                <span aria-hidden className="text-subtle">
                  ·
                </span>
              ) : null}
              <span
                className={cn("inline-flex items-baseline gap-1", animate && "score-row-in")}
                style={animate ? { animationDelay: `${step + i * 90}ms` } : undefined}
              >
                <dt className="text-muted" title={p.hint}>
                  {p.label}
                </dt>
                <dd className="font-display tabular-nums text-fg">{p.value}</dd>
              </span>
            </Fragment>
          ))}
          <span aria-hidden className="text-subtle">
            ·
          </span>
          {/* Сброс — не очки: в сумму не входит, решает ничью при равенстве. */}
          <span
            className={cn("inline-flex items-baseline gap-1", animate && "score-row-in")}
            style={animate ? { animationDelay: `${step + 3 * 90}ms` } : undefined}
          >
            <dt className="text-subtle" title={tt("final.discardHint")}>
              {tt("final.discard")}
            </dt>
            <dd className="font-display tabular-nums text-subtle">{row.discard}</dd>
          </span>
        </div>
        <div
          className={cn("mt-2 flex items-center justify-between gap-2 border-t border-border pt-1.5", animate && "score-row-in")}
          style={animate ? { animationDelay: `${step + 4 * 90}ms` } : undefined}
        >
          <dt className="text-muted">{tt("final.total")}</dt>
          <dd className="font-display text-sm tabular-nums text-fg">{row.total}</dd>
        </div>
      </dl>
    </li>
  );
}

/**
 * Финал партии. Объясняет счёт, а не только показывает места: у каждого игрока
 * видно, из чего сложился итог (животные, свойства, бонусы свойств, сброс),
 * слагаемые раскрываются по шагам, а проигравшему человеку экран честно
 * говорит, на чём именно его обошли. Экран можно свернуть, чтобы посмотреть
 * стол, и вернуть кнопкой «Итоги».
 */
export function GameOverScreen({
  scores,
  winnerIds,
  humanId,
  onAgain,
  onMenu,
}: {
  scores: ScoreBreakdown[];
  winnerIds: number[];
  humanId: number;
  /** Нет обработчика — «Ещё партию» не показываем (так у зрителя). */
  onAgain?: () => void;
  onMenu: () => void;
}) {
  const tt = useT();
  const won = winnerIds.includes(humanId);
  // Строгий режим монтирует эффект дважды — звук играет один раз.
  const soundedRef = useRef(false);
  useEffect(() => {
    if (soundedRef.current) return;
    soundedRef.current = true;
    sfx.play(won ? "win" : "lose");
  }, [won]);
  // Листопад — только на победном экране; параметры листьев стабильны.
  const leaves = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.round(Math.random() * 96),
        size: 9 + Math.round(Math.random() * 9),
        dur: 5 + Math.random() * 5,
        delay: Math.random() * 5,
        color: ["var(--color-leaf)", "var(--color-parchment)", "var(--color-clay)", "var(--color-food-yellow)"][i % 4]!,
      })),
    [],
  );

  const reduced = usePrefersReducedMotion();
  // Порядок строк — как в движке (очки, затем сброс); флора встаёт на своё место.
  const rows = useMemo(() => [...scores].sort((a, b) => b.total - a.total || b.discard - a.discard), [scores]);
  const places = useMemo(() => competitionPlaces(rows), [rows]);
  const lang = useLang();
  const explanation = useMemo(
    () => explainDefeat(rows, winnerIds, humanId, lang),
    [rows, winnerIds, humanId, lang],
  );
  const humanIndex = rows.findIndex((r) => r.playerId === humanId);
  // Раскрытие по шагам: строка за строкой; при reduced-motion — всё сразу.
  const [reveal, setReveal] = useState(() => {
    const r = prefersReducedMotion();
    return { shown: r ? scores.length : 0, all: r };
  });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (reveal.all || reveal.shown >= rows.length) return;
    const delay = reveal.shown === 0 ? 420 : 860;
    const timer = window.setTimeout(() => {
      setReveal((r) => (r.shown >= rows.length ? r : { ...r, shown: r.shown + 1 }));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [reveal, rows.length]);

  // Медиазапрос мог включиться уже после открытия экрана.
  useEffect(() => {
    if (reduced) setReveal({ shown: rows.length, all: true });
  }, [reduced, rows.length]);

  const allShown = reveal.all || reveal.shown >= rows.length;
  const humanPlace = humanIndex >= 0 ? places[humanIndex]! : null;

  // Свёрнутый финал: стол виден, а кнопка возвращает итоги обратно.
  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          variant="secondary"
          size="md"
          className="shadow-[var(--shadow-card)]"
          aria-label={tt("final.show")}
          onClick={() => setCollapsed(false)}
        >
          <BarChart3 className="size-4" />
          {tt("final.results")}
          {won
            ? tt("final.resultsWin")
            : humanPlace
              ? tt("final.resultsPlace", { place: placeLabel(lang, humanPlace) })
              : ""}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-3 sm:p-4">
      <img
        src={won ? BG.victory : BG.extinction}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
      />
      {won ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {leaves.map((l) => (
            <span
              key={l.id}
              className="leaf-fall"
              style={{
                left: `${l.left}%`,
                width: l.size,
                height: l.size,
                background: l.color,
                animationDuration: `${l.dur}s`,
                animationDelay: `${l.delay}s`,
              }}
            />
          ))}
        </div>
      ) : null}
      <div className="relative flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-card)]">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted">{tt("final.kicker")}</p>
              <h2 className="mt-2 text-3xl">{won ? tt("final.win") : tt("final.lose")}</h2>
            </div>
            <Button
              variant="ghost"
              size="iconSm"
              className="shrink-0"
              aria-label={tt("final.collapseAria")}
              title={tt("final.collapseTitle")}
              onClick={() => setCollapsed(true)}
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>

          {/* Расшифровка формулы: чтобы «бонус» и «сброс» в строках не были ребусом. */}
          <p className="mt-3 text-xs leading-snug text-subtle">{tt("final.formula")}</p>

          <ul aria-label={tt("final.scoreAria")} className="mt-4 space-y-2.5">
            {rows.map((s, i) =>
              i < reveal.shown ? (
                <ScoreRow
                  key={s.playerId}
                  row={s}
                  place={places[i]!}
                  winner={winnerIds.includes(s.playerId)}
                  animate={!reduced}
                />
              ) : null,
            )}
          </ul>

          {!allShown ? (
            <div className="mt-4 flex flex-col items-center gap-1">
              <Button variant="secondary" size="md" onClick={() => setReveal({ shown: rows.length, all: true })}>
                {tt("final.showAll")}
              </Button>
              <p className="text-xs text-subtle">{tt("final.stepHint")}</p>
            </div>
          ) : null}

          {allShown && explanation ? (
            <p className="score-row-in mt-4 flex items-start gap-2 rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 px-3 py-3 text-sm text-fg">
              <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>{explanation}</span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 border-t border-border bg-surface p-4 sm:flex-row sm:px-7">
          {/* Зрителю «Ещё партия» недоступна: сервер знает только места, и
              запрос со зрительским токеном выбросил бы его в меню с ошибкой. */}
          {onAgain ? (
            <Button className="flex-1" size="md" onClick={onAgain}>
              <RotateCcw className="size-4" />
              {tt("final.again")}
            </Button>
          ) : null}
          <Button variant="secondary" className="flex-1" size="md" onClick={onMenu}>
            {onAgain ? tt("final.menu") : tt("final.leave")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Очки места «докручиваются» от нуля на глазах: легче прочувствовать разрыв
 * с соперниками, чем увидеть готовые числа. При reduced-motion — сразу итог.
 * Число декоративно (скринридеру его читает строка «Итого» в разбивке).
 */
function CountUp({ to, delayMs = 0, durMs = 700 }: { to: number; delayMs?: number; durMs?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    const t0 = performance.now() + delayMs;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / durMs));
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delayMs, durMs]);
  return (
    <div aria-hidden className="font-display text-2xl tabular-nums">
      {v}
    </div>
  );
}
