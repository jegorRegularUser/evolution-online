import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ChevronDown,
  Eye,
  GraduationCap,
  Lightbulb,
  Lock,
  RotateCcw,
  X,
} from "lucide-react";
import { Fragment, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookMarked, CheckCircle2, Compass, House, ShoppingBag, Star, Swords, Target } from "lucide-react";
import { DialogShell } from "@/components/ui/dialog-shell";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { NetMenuScreen } from "@/components/game/net-screens";
import { FLORA, MARKS } from "@/game/flora";
import { PLANTS } from "@/game/plants";
import { CONTINENTS_TRAIT_IDS, FUNGI_TRAIT_IDS, MUTATIONS_TRAIT_IDS, PLANTS_TRAIT_IDS, TRAIT_ORDER } from "@/game/traits";
import { TERRITORIES } from "@/game/types";
import type { FloraKind, MarkKind, ModuleId, MutatorId, PlantKind, ScoreBreakdown, TerritoryId, TraitId } from "@/game/types";
import type { CosmeticSlot } from "@/lib/profile/shared";
import { AvatarChip, CardBackChip } from "./avatar";
import { defaultAvatarForSeat } from "@/lib/cosmetics";
import { CHALLENGES } from "@/game/challenges";
import { COSMETIC_ITEMS, cosmeticById, type CosmeticItem } from "@/lib/cosmetics";
import { CAMPAIGN_ERAS } from "@/game/campaign";
import type { RunReward } from "@/game/campaign-run";
import { StashChips } from "./campaign-hud";
import { flushPendingSpecimens, type BestiariumEntry } from "@/game/bestiarium";
import { challengesGet, cosmeticsBuy, cosmeticsEquip, profileGet } from "@/lib/profile/api";
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
 * Мобильная нижняя навигация (F7): четыре страницы-раздела как таб-бар в зоне
 * большого пальца, а по центру — домик («главная») в приподнятом круге,
 * классический центральный action. Показывается только на телефоне (<sm,
 * 640px): шапка на мобилке оставляет себе модалки и язык, а переходы по
 * разделам и возврат в меню уходят вниз — паттерн iOS/Android tab bar.
 * Иконка + короткая подпись, тап-таргет ≥44px, активная вкладка подсвечена
 * акцентом и полоской сверху (Link ставит data-status="active" и aria-current
 * сам). Панель прижата к нижнему краю и уважает жест-полосу iPhone:
 * padding-bottom из env(safe-area-inset-bottom) задаёт .mobile-tabbar в
 * styles.css.
 */
const MOBILE_TABS = [
  { to: "/shop", labelKey: "shop.title", Icon: ShoppingBag },
  { to: "/bestiary", labelKey: "bestiarium.title", Icon: BookMarked },
  { to: "/campaign", labelKey: "campaign.title", Icon: Compass },
  { to: "/challenges", labelKey: "challenges.title", Icon: Target },
] as const satisfies Array<{ to: "/shop" | "/bestiary" | "/campaign" | "/challenges"; labelKey: TKey; Icon: typeof ShoppingBag }>;

export function MobileTabBar() {
  const tt = useT();
  const renderTab = ({ to, labelKey, Icon }: (typeof MOBILE_TABS)[number]) => (
    <Link
      key={to}
      to={to}
      activeOptions={{ exact: true }}
      data-testid="mobile-tab"
      className="flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-1.5 text-[10px] font-medium leading-none text-muted transition-colors duration-[var(--motion-fast)] hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[status=active]:text-accent"
    >
      {({ isActive }) => (
        <>
          <Icon className="size-5 shrink-0" aria-hidden />
          <span>{tt(labelKey)}</span>
          <span
            aria-hidden
            className={cn(
              "h-0.5 w-7 rounded-full transition-colors",
              isActive ? "bg-accent" : "bg-transparent",
            )}
          />
        </>
      )}
    </Link>
  );
  return (
    <nav
      aria-label={tt("nav.tabbar")}
      data-testid="mobile-tabbar"
      className="mobile-tabbar fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur-sm sm:hidden"
    >
      {/* Пять мест: два раздела | домик по центру | два раздела. Домик —
          единственный путь назад в меню с телефона: отдельной кнопки «Назад»
          в шапке страниц больше нет. */}
      <div className="mx-auto grid w-full max-w-lg grid-cols-5">
        {MOBILE_TABS.slice(0, 2).map(renderTab)}
        <Link
          to="/"
          activeOptions={{ exact: true }}
          data-testid="mobile-tab-home"
          aria-label={tt("nav.home")}
          className="flex min-h-14 items-center justify-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {({ isActive }) => (
            <span
              className={cn(
                "-translate-y-3 flex size-11 items-center justify-center rounded-full border shadow-[var(--shadow-card)] transition-[transform,background-color,border-color,color] duration-[var(--motion-fast)] active:scale-95",
                isActive ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface text-fg",
              )}
            >
              <House className="size-5" aria-hidden />
            </span>
          )}
        </Link>
        {MOBILE_TABS.slice(2).map(renderTab)}
      </div>
    </nav>
  );
}

/** Разделы в верхней навигации — порядок как в шапке меню. */
const TOP_NAV_PAGES = [
  { to: "/bestiary", labelKey: "bestiarium.title", Icon: BookMarked },
  { to: "/campaign", labelKey: "campaign.title", Icon: Compass },
  { to: "/challenges", labelKey: "challenges.title", Icon: Target },
  { to: "/shop", labelKey: "shop.title", Icon: ShoppingBag },
] as const satisfies Array<{ to: "/shop" | "/bestiary" | "/campaign" | "/challenges"; labelKey: TKey; Icon: typeof ShoppingBag }>;

/**
 * Верхняя навигация меню и страниц-разделов: обучение, правила, четыре
 * раздела, статистика и звук (язык добавляет сам TopBar). Активный раздел
 * выводится из URL (useRouterState): страница /shop показывает ровно ту же
 * шапку, что и меню, только с подсвеченной кнопкой «Магазин» — переход на
 * страницу ощущается обычной сменой раздела, отдельная кнопка «Назад» не
 * нужна. Модалки здесь только открываются: сами панели рендерит вызывающий
 * экран ЗА пределами шапки — backdrop-blur шапки стал бы для fixed-панели
 * containing block и сломал бы её позиционирование.
 */
export function TopBarNav({
  onTutorial,
  onRules,
  onStats,
}: {
  onTutorial: () => void;
  onRules: () => void;
  onStats: () => void;
}) {
  const tt = useT();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {/* На узком экране подписи скрыты — кнопки остаются иконочными,
          поэтому у каждой есть постоянное доступное имя. max-xl:h-11 —
          тап-таргет 44px на телефоне и планшете. max-sm:hidden у обучения
          и разделов: на телефоне эти места живут в нижнем таб-баре. */}
      <Button variant="ghost" size="sm" className="max-xl:h-11 max-sm:hidden" aria-label={tt("topbar.tutorial")} title={tt("topbar.tutorial")} onClick={onTutorial}>
        <GraduationCap className="size-4" />
        <span className="hidden sm:inline">{tt("topbar.tutorial")}</span>
      </Button>
      <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.rules")} title={tt("topbar.rules")} onClick={onRules}>
        <BookOpen className="size-4" />
        <span className="hidden sm:inline">{tt("topbar.rules")}</span>
      </Button>
      {TOP_NAV_PAGES.map(({ to, labelKey, Icon }) => {
        const active = pathname === to;
        return (
          <Button
            key={to}
            variant="ghost"
            size="sm"
            aria-current={active ? "page" : undefined}
            data-active={active ? "true" : undefined}
            className={cn(
              "max-xl:h-11 max-sm:hidden",
              active && "bg-accent/10 text-accent hover:bg-accent/15",
            )}
            aria-label={tt(labelKey)}
            title={tt(labelKey)}
            onClick={() => {
              sfx.play("click");
              navigate({ to });
            }}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{tt(labelKey)}</span>
          </Button>
        );
      })}
      <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.stats")} title={tt("topbar.stats")} onClick={onStats}>
        <BarChart3 className="size-4" />
        <span className="hidden sm:inline">{tt("topbar.stats")}</span>
      </Button>
      <SoundToggle />
    </>
  );
}

/**
 * Каркас страницы-раздела (магазин, бестиарий, кампания, вызовы): фон и шапка
 * — ровно те же, что у главного меню (общая TopBarNav, активный раздел
 * подсвечен), отдельной шапки раздела и кнопки «Назад» нет: попадая на /shop
 * или /bestiary, человек видит знакомую навигацию и содержимое ниже —
 * страница ощущается обычным переходом. Заголовок раздела и содержимое
 * рендерит content-компонент экрана в children; модальный вариант при
 * необходимости — тот же компонент, обёрнутый в DialogShell (см.
 * RulesPanel/StatsScreen). Модалки шапки (обучение, правила, статистика)
 * открываются и отсюда; панели рендерятся вне шапки, чтобы backdrop-blur
 * не ломал их fixed-позиционирование. На телефоне (<sm) шапка без лого и
 * названия (компактная строка модалок + звук + язык), внизу таб-бар разделов
 * с домиком — контент получает нижний паддинг, чтобы не прятаться под панелью.
 */
export function FeaturePage({ titleKey, children }: { titleKey: TKey; children: ReactNode }) {
  const tt = useT();
  // Заголовок вкладки браузера: LangInit в __root ставит app.name на
  // монтировании и при смене языка; этот эффект перебивает его позже
  // (дерево ниже), поэтому у каждой страницы свой title.
  const title = tt(titleKey);
  useEffect(() => {
    document.title = title;
  }, [title]);
  // Модалки шапки — те же, что в меню; состояние живёт на странице, панели —
  // за пределами шапки (см. TopBarNav).
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {/* Зелёная долина и бумажная текстура — ровно как под меню и столом. */}
        <img src={BG.valley} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/55 to-bg" />
        <div className="absolute inset-0 paper-desk opacity-[0.14]" />
      </div>
      <div className="relative flex min-h-dvh flex-col">
        <TopBar subtitle={tt("app.brand")} hideBrandOnMobile homeLink>
          <TopBarNav
            onTutorial={() => {
              sfx.play("modal");
              setTutorialOpen(true);
            }}
            onRules={() => {
              sfx.play("modal");
              setRulesOpen(true);
            }}
            onStats={() => {
              sfx.play("modal");
              setStatsOpen(true);
            }}
          />
        </TopBar>
        {/* Ширина чуть больше модальной панели (max-w-2xl): страница дышит,
            сетки каталога получают те же два столбца, что и в модалке.
            Нижний паддинг на телефоне — под таб-бар (F7). */}
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-[calc(4.75rem_+_env(safe-area-inset-bottom))] pt-6 sm:pb-6">
          {children}
        </main>
        <MobileTabBar />
      </div>
      {tutorialOpen ? (
        <TutorialScreen
          onClose={() => {
            sfx.play("modal");
            setTutorialOpen(false);
          }}
        />
      ) : null}
      {rulesOpen ? (
        <RulesPanel
          onClose={() => {
            sfx.play("modal");
            setRulesOpen(false);
          }}
        />
      ) : null}
      {statsOpen ? (
        <StatsScreen
          onClose={() => {
            sfx.play("modal");
            setStatsOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

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
            слева, справа обучение, правила, разделы, статистика и звук
            (общая TopBarNav — на страницах-разделах она та же, активный
            раздел подсвечен). На телефоне (F7) шапка компактная: без лого
            и названия, без обучения и кнопок разделов (они ушли в нижний
            таб-бар с домиком) — остаются правила, статистика, звук и язык. */}
        <TopBar subtitle={tt("app.brand")} hideBrandOnMobile homeLink>
          <TopBarNav onTutorial={openTutorial} onRules={onRules} onStats={openStats} />
        </TopBar>

        {/* Столы — единственный путь в партию: соло-режим убран, игра с ботами
            идёт через «Создать стол» → боты в лобби → «Начать год».
            Нижний паддинг на телефоне — под таб-бар разделов (F7), на sm+ —
            прежние 1rem. */}
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-4 pb-[calc(4.75rem_+_env(safe-area-inset-bottom))] sm:pb-4 lg:h-[calc(100dvh-3.5rem)] lg:flex-[1_1_0px] lg:overflow-hidden">
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
        {/* Мобильный таб-бар разделов: Магазин · Бестиарий · [домик] ·
            Кампания · Вызовы. На <sm шапка разделы больше не дублирует. */}
        <MobileTabBar />
      </div>
      {/* Обучение и статистика остались модалками меню; магазин, бестиарий,
          кампания и вызовы переехали на страницы /shop, /bestiary, /campaign
          и /challenges (см. src/routes/). */}
      {tutorialOpen ? <TutorialScreen onClose={closeTutorial} /> : null}
      {statsOpen ? <StatsScreen onClose={closeStats} /> : null}
    </>
  );
}

type RulesTab = "base" | "continents" | "plants" | "fungi" | "mutations" | "mods" | "fossils" | "campaign";

/** Подпись вкладки правил — ключ словаря. */
const RULES_TAB_KEYS: Record<RulesTab, TKey> = {
  base: "rules.tab.base",
  continents: "rules.tab.continents",
  plants: "rules.tab.plants",
  fungi: "rules.tab.fungi",
  mutations: "rules.tab.mutations",
  mods: "rules.tab.mods",
  fossils: "rules.tab.fossils",
  campaign: "rules.tab.campaign",
};

/**
 * Группы вкладок: «подстрочка» — мелкая подпись над кнопками своей группы.
 * Обёртки групп помечены role="presentation", поэтому с точки зрения
 * доступности все role=tab остаются «детьми» единственного tablist.
 */
const RULES_TAB_GROUPS: Array<{ captionKey: TKey; tabs: RulesTab[] }> = [
  { captionKey: "rules.group.base", tabs: ["base"] },
  { captionKey: "rules.group.expansions", tabs: ["continents", "plants", "fungi", "mutations"] },
  { captionKey: "rules.group.modes", tabs: ["mods", "fossils", "campaign"] },
];

/**
 * Вкладка «Модификаторы»: столовые правила и мутаторы — по одному пункту на
 * каждый. Имена берём из ключей лобби (единый источник: в лобби и в правилах
 * пункт называется одинаково), тексты — правила.
 */
const MODIFIER_RULE_ENTRIES: Array<{ nameKey: TKey; textKey: TKey }> = [
  { nameKey: "lobby.rule.pack", textKey: "rules.mods.rule.pack.text" },
  { nameKey: "lobby.rule.hungrySeason", textKey: "rules.mods.rule.hungrySeason.text" },
  { nameKey: "lobby.rule.abundance", textKey: "rules.mods.rule.abundance.text" },
  { nameKey: "lobby.rule.startHand", textKey: "rules.mods.rule.startHand.text" },
];

const MODIFIER_MUTATOR_ENTRIES: Array<{ nameKey: TKey; textKey: TKey }> = [
  { nameKey: "lobby.mutator.scavengers", textKey: "rules.mods.mutator.scavengers.text" },
  { nameKey: "lobby.mutator.rapidEvolution", textKey: "rules.mods.mutator.rapidEvolution.text" },
];

/** События «Дикого мира» в правилах — короткие строки «событие — эффект». */
const WILD_EVENT_KEYS: TKey[] = [
  "rules.mods.wild.iceAge",
  "rules.mods.wild.goldenAge",
  "rules.mods.wild.resettlement",
  "rules.mods.wild.cropFailure",
  "rules.mods.wild.meteorite",
  "rules.mods.wild.wildfire",
];

/** Изверги кампании: имя — ключ реестра миссий, текст — сценарный эффект. */
const CAMPAIGN_BOSS_ENTRIES: Array<{ nameKey: TKey; textKey: TKey }> = [
  { nameKey: "campaign.boss.trilobite", textKey: "rules.campaign.boss.trilobite" },
  { nameKey: "campaign.boss.bonecrusher", textKey: "rules.campaign.boss.bonecrusher" },
  { nameKey: "campaign.boss.atroxabilis", textKey: "rules.campaign.boss.atroxabilis" },
];

/** Свойства по вкладкам с trait-списками: механические вкладки (модификаторы,
 *  ископаемые, кампания) списков свойств не показывают. */
const TRAITS_BY_TAB: Record<Exclude<RulesTab, "mods" | "fossils" | "campaign">, TraitId[]> = {
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
        {/* Группы вкладок с «подстрочками»: мелкая подпись над кнопками
            своей группы. flex-wrap: на узких экранах группы переносятся
            целиком, кнопки — внутри своей группы. Обёртки групп —
            presentation, поэтому tablist по-прежнему «напрямую владеет»
            всеми вкладками. */}
        <div role="tablist" aria-label={tt("rules.tabs")} className="mb-5 flex flex-wrap items-start gap-x-6 gap-y-3">
          {RULES_TAB_GROUPS.map((group) => (
            <div key={group.captionKey} role="presentation" className="min-w-0">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">
                {tt(group.captionKey)}
              </p>
              <div role="presentation" className="flex flex-wrap gap-2">
                {group.tabs.map((id) => (
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
                      "h-11 rounded-[var(--radius-md)] border px-3 text-sm font-medium",
                      tab === id
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border bg-bg text-fg hover:bg-surface-2",
                    )}
                  >
                    {tt(RULES_TAB_KEYS[id])}
                  </button>
                ))}
              </div>
            </div>
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
        {tab === "mods" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.mods.intro")}</p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">{tt("rules.mods.slots")}</strong> {tt("rules.mods.slots.text")}
              </li>
            </ul>
            <h3 className="text-fg">{tt("rules.mods.rules.title")}</h3>
            <ul className="space-y-2">
              {MODIFIER_RULE_ENTRIES.map((entry) => (
                <li key={entry.nameKey}>
                  <strong className="text-fg">{tt(entry.nameKey)}.</strong> {tt(entry.textKey)}
                </li>
              ))}
            </ul>
            <h3 className="text-fg">{tt("rules.mods.mutators.title")}</h3>
            <ul className="space-y-2">
              {MODIFIER_MUTATOR_ENTRIES.map((entry) => (
                <li key={entry.nameKey}>
                  <strong className="text-fg">{tt(entry.nameKey)}.</strong> {tt(entry.textKey)}
                </li>
              ))}
            </ul>
            <h3 className="text-fg">{tt("rules.mods.wild.title")}</h3>
            <p>{tt("rules.mods.wild.text")}</p>
            <ul className="list-disc space-y-1.5 pl-5">
              {WILD_EVENT_KEYS.map((key) => (
                <li key={key}>{tt(key)}</li>
              ))}
            </ul>
            <h3 className="text-fg">{tt("rules.mods.compat.title")}</h3>
            <p>{tt("rules.mods.compat")}</p>
          </div>
        )}
        {tab === "fossils" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.fossils.intro")}</p>
            <h3 className="text-fg">{tt("rules.fossils.earn.title")}</h3>
            <ul className="space-y-2">
              <li>
                <strong className="text-fg">{tt("rules.fossils.earn.challenges")}</strong> {tt("rules.fossils.earn.challenges.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.fossils.earn.feats")}</strong> {tt("rules.fossils.earn.feats.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.fossils.earn.daily")}</strong> {tt("rules.fossils.earn.daily.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.fossils.earn.cap")}</strong> {tt("rules.fossils.earn.cap.text")}
              </li>
            </ul>
            <h3 className="text-fg">{tt("rules.fossils.spend.title")}</h3>
            <p>{tt("rules.fossils.spend.text")}</p>
            <p className="text-xs">{tt("rules.fossils.where")}</p>
          </div>
        )}
        {tab === "campaign" && (
          <div className="space-y-4 text-sm text-muted">
            <p>{tt("rules.campaign.intro")}</p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">{tt("rules.campaign.eras")}</strong> {tt("rules.campaign.eras.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.campaign.goals")}</strong> {tt("rules.campaign.goals.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.campaign.diary")}</strong> {tt("rules.campaign.diary.text")}
              </li>
              <li>
                <strong className="text-fg">{tt("rules.campaign.hard")}</strong> {tt("rules.campaign.hard.text")}
              </li>
            </ul>
            <h3 className="text-fg">{tt("rules.campaign.bosses.title")}</h3>
            <ul className="space-y-2">
              {CAMPAIGN_BOSS_ENTRIES.map((entry) => (
                <li key={entry.nameKey}>
                  <strong className="text-fg">{tt(entry.nameKey)}</strong> — {tt(entry.textKey)}
                </li>
              ))}
            </ul>
            <p className="text-xs">{tt("rules.campaign.bosses.note")}</p>
            <p className="text-xs">{tt("rules.campaign.where")}</p>
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
 * Имя строки финального счёта: у флоры («Трава и грибы») имя лежит в данных
 * движка по-русски, поэтому при lang=en показываем словарное имя дополнения
 * (module.fungi). Флора опознаётся по playerId === -1 — как в sourceLabels.
 * Остальные строки — имена игроков (боты-учёные переводятся, люди — как есть).
 */
export function scoreRowName(row: ScoreBreakdown, lang: Lang): string {
  return row.playerId === -1 ? translate(lang, "module.fungi") : scientistName(row.name, lang);
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
      name: scoreRowName(leader, lang),
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
  // Аватар строки финала: в сети — с места, в соло — дефолт по имени
  // (ботам — портрет их учёного). playerId -1 — это флора, аватара нет.
  const netSeats = useGameStore((s) => s.net?.seats);
  const isAI = useGameStore((s) => Boolean(s.state?.players[row.playerId]?.isAI));
  const avatar =
    row.playerId >= 0
      ? netSeats?.find((x) => x.seat === row.playerId)?.avatar ?? defaultAvatarForSeat(row.name, isAI)
      : undefined;
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
        <div className="flex min-w-0 items-center gap-2">
          {avatar ? <AvatarChip avatarKey={avatar} name={scoreRowName(row, lang)} className="size-7 shrink-0" /> : null}
          <p className="min-w-0 truncate font-medium">
            {place}. {scoreRowName(row, lang)}
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
          <ShareReportButton />
          <Button variant="secondary" className="flex-1" size="md" onClick={onMenu}>
            {onAgain ? tt("final.menu") : tt("final.leave")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * «Скопировать отчёт» (волна 1.5, дизайн-пакет §5): текстовый матч-отчёт в
 * буфер — победители, места с разбивкой, год, модули/модификаторы и сид
 * (партии по сиду воспроизводимы — отчёт позволяет переиграть и сверить).
 * Реплей-таймлайн — отдельная крупная ставка из старых планов, сюда не входит.
 */
function ShareReportButton() {
  const tt = useT();
  const state = useGameStore((s) => s.state);
  const [copied, setCopied] = useState(false);
  if (!state?.scores || !state.winnerIds) return null;
  const copy = async () => {
    const rows = [...state.scores!].sort((a, b) => b.total - a.total || b.discard - a.discard);
    const winnerNames = rows
      .filter((r) => state.winnerIds!.includes(r.playerId))
      .map((r) => r.name);
    const lines: string[] = [];
    lines.push(tt("final.report.head"));
    lines.push(tt("final.report.winners", { names: winnerNames.join(", ") }));
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]!;
      lines.push(
        tt("final.report.line", {
          place: i + 1,
          name: r.name,
          total: r.total,
          animals: r.animals,
          traits: r.traits,
          discard: r.discard,
        }),
      );
    }
    const modules = (Object.entries(state.modules) as Array<[ModuleId, boolean]>)
      .filter(([, on]) => on)
      .map(([id]) => tt(MODULE_NAME_KEYS[id]));
    const mods: string[] = [];
    if (state.rules?.pack) mods.push(tt("lobby.rule.pack"));
    if (state.rules?.hungrySeason) mods.push(tt("lobby.rule.hungrySeason"));
    if (state.rules?.abundance) mods.push(tt("lobby.rule.abundance"));
    if (state.rules?.startHand) mods.push(tt("lobby.rule.startHand"));
    for (const m of state.mutators ?? []) mods.push(tt(MUTATOR_NAME_KEYS[m]));
    if (state.wildWorld) mods.push(tt("lobby.wildWorld"));
    lines.push(
      tt("final.report.meta", {
        year: state.year,
        modules: modules.join(", ") || "—",
        modifiers: mods.join(", ") || "—",
      }),
    );
    lines.push(tt("final.report.seed", { seed: state.rngSeed }));
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Клипборд недоступен (не https или нет разрешения) — тихо игнорируем.
    }
  };
  return (
    <Button variant="secondary" className="flex-1" size="md" onClick={copy}>
      {copied ? tt("final.report.copied") : tt("final.report.button")}
    </Button>
  );
}

/** Имена модулей и модификаторов для отчёта — литеральные ключи (типобезопасный i18n). */
const MODULE_NAME_KEYS: Record<ModuleId, TKey> = {
  continents: "module.continents",
  plants: "module.plants",
  fungi: "module.fungi",
  randomMutations: "module.randomMutations",
};
const MUTATOR_NAME_KEYS: Record<MutatorId, TKey> = {
  scavengers: "lobby.mutator.scavengers",
  rapidEvolution: "lobby.mutator.rapidEvolution",
};

/**
 * Магазин v1 (волна 3б, дизайн-пакет §3): только earned-валюта, только
 * видимое за столом (сукно и кубик), полный каталог без ротации, декларация
 * «0% pay-to-win» в шапке. Покупка — серверная (цена из серверного каталога),
 * экипировка — cosmeticsEquip, применение — через equippedCosmetics в сторе.
 *
 * Витрина: крупные карточки с честным превью внешности — у сукна сам его фон
 * (cssClass из каталога; все .felt-skin-* включая классику есть в styles.css),
 * у кубика живой Dice3D с тоном скина (cosmetics.diceTint) на классическом
 * сукне — цвет читается так же, как за столом. Кнопка «Превью» раскрывает
 * моковый стол: сукно + образцы карт + кости; один превью на всю страницу.
 * Показан ровно эффект самого предмета: для сукна кости нейтральные, для
 * кубика сукно классическое.
 *
 * Содержимое без диалоговой оболочки: живёт на странице /shop (FeaturePage).
 * Если когда-нибудь понадобится модалка — обернуть в DialogShell: заголовок
 * уже внутри содержимого.
 */
export function ShopContent() {
  const tt = useT();
  const setEquippedCosmetics = useGameStore((s) => s.setEquippedCosmetics);
  const equipped = useGameStore((s) => s.equippedCosmetics);
  const [balance, setBalance] = useState<number | null>(null);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  // Открытое превью — один на всю страницу: клик по другому предмету
  // закрывает прежнее, повторный клик по тому же — сворачивает.
  const [previewId, setPreviewId] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [prof, ch] = await Promise.all([profileGet(), challengesGet()]);
        if (!alive) return;
        if (!prof.ok || !ch.ok) {
          setError(tt("tutorial.startError"));
          return;
        }
        setBalance(prof.balance);
        setOwned(new Set(prof.owned.map((o) => o.itemId)));
        const map: Partial<Record<string, string>> = {};
        for (const e of prof.equipped) map[e.slot] = e.itemId;
        setEquippedCosmetics(map);
      } catch {
        if (alive) setError(tt("tutorial.startError"));
      }
    })();
    return () => {
      alive = false;
    };
  }, [tt, setEquippedCosmetics]);

  const buy = async (itemId: string) => {
    setBusy(itemId);
    setError(null);
    try {
      const res = await cosmeticsBuy({ data: { itemId } });
      if (!res.ok) {
        setError(res.code === "insufficient-funds" ? tt("shop.err.funds") : tt("shop.err.generic"));
        return;
      }
      setBalance(res.balance);
      setOwned((prev) => new Set(prev).add(itemId));
      sfx.play("cheer");
      await equip(itemId);
    } finally {
      setBusy(null);
    }
  };

  const equip = async (itemId: string) => {
    const item = cosmeticById(itemId);
    if (!item) return;
    const res = await cosmeticsEquip({ data: { slot: item.slot, itemId } });
    if (res.ok) {
      setEquippedCosmetics({ ...equipped, [item.slot]: itemId });
      sfx.play("click");
    }
  };

  const previewItem = previewId ? cosmeticById(previewId) : undefined;
  const slots: CosmeticSlot[] = ["felt", "dice", "cardback", "avatar"];
  return (
    <>
      {/* Заголовок страницы; счётчик ископаемых — справа от названия. */}
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h1 className="font-display text-2xl tracking-[0.08em] text-fg sm:text-3xl">{tt("shop.title")}</h1>
          <p className="mt-1 text-xs text-muted">{tt("shop.declaration")}</p>
        </div>
        {balance !== null ? (
          <span className="rounded-[var(--radius-sm)] border border-border bg-bg px-2 py-1 text-xs tabular-nums text-fg">
            {tt("challenges.balance", { n: balance })}
          </span>
        ) : null}
      </header>
      {error ? (
        <p role="alert" className="mb-3 rounded-[var(--radius-sm)] border border-danger/50 bg-danger/10 px-3 py-2 text-xs text-clay">
          {error}
        </p>
      ) : null}
      {slots.map((slot) => {
        const showPreviewHere = previewItem?.slot === slot;
        return (
          <section key={slot} className="mb-7">
            <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">
              {tt(`shop.slot.${slot}` as never)}
            </h3>
            <div className="grid items-start gap-3 sm:grid-cols-2">
              {COSMETIC_ITEMS.filter((item) => item.slot === slot).map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  balance={balance}
                  owned={item.price === 0 || owned.has(item.id)}
                  equipped={equipped[item.slot] === item.id}
                  busy={busy !== null}
                  previewOpen={previewId === item.id}
                  onTogglePreview={() => setPreviewId((cur) => (cur === item.id ? null : item.id))}
                  onBuy={() => void buy(item.id)}
                  onEquip={() => void equip(item.id)}
                />
              ))}
            </div>
            {showPreviewHere && previewItem ? (
              <ShopPreview item={previewItem} onClose={() => setPreviewId(null)} />
            ) : null}
          </section>
        );
      })}
    </>
  );
}

/** Описание предмета в каталоге: ключ на каждый id, пропуск — заголовок. */
const SHOP_ITEM_DESC_KEYS: Record<string, TKey> = {
  "felt.classic": "shop.desc.felt.classic",
  "felt.tundra": "shop.desc.felt.tundra",
  "felt.savanna": "shop.desc.felt.savanna",
  "felt.glacial": "shop.desc.felt.glacial",
  "dice.bone": "shop.desc.dice.bone",
  "dice.amber": "shop.desc.dice.amber",
  "dice.obsidian": "shop.desc.dice.obsidian",
  "cardback.classic": "shop.desc.cardback.classic",
  "cardback.malachite": "shop.desc.cardback.malachite",
  "cardback.crimson": "shop.desc.cardback.crimson",
  "avatar.aquatic": "shop.desc.avatar.aquatic",
  "avatar.herbLarge": "shop.desc.avatar.herbLarge",
  "avatar.carnMedium": "shop.desc.avatar.carnMedium",
  "avatar.carnLarge": "shop.desc.avatar.carnLarge",
};

/**
 * Карточка предмета витрины. Витрина занимает верхнюю часть и показывает
 * реальный внешний вид: сукно — собственный фон (cssClass), кубик — живой
 * Dice3D с тоном скина поверх классического сукна (Dice3D сам строит сцену
 * только при появлении в кадре и засыпает после укладки — три канваса
 * каталога стоят копейки).
 */
function ShopItemCard({
  item,
  balance,
  owned,
  equipped,
  busy,
  previewOpen,
  onTogglePreview,
  onBuy,
  onEquip,
}: {
  item: CosmeticItem;
  balance: number | null;
  owned: boolean;
  equipped: boolean;
  busy: boolean;
  previewOpen: boolean;
  onTogglePreview: () => void;
  onBuy: () => void;
  onEquip: () => void;
}) {
  const tt = useT();
  const name = tt(item.titleKey);
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-md)] border transition-colors",
        equipped ? "border-accent bg-accent/10" : "border-border bg-bg/60",
      )}
    >
      {/* Витрина 16:10: образ dominate — видно сукно или кости с любого места сетки. */}
      <div className="relative aspect-[16/10] w-full border-b border-ink/10">
        {item.slot === "felt" ? (
          <span aria-hidden className={cn("absolute inset-0", item.cssClass)} />
        ) : item.slot === "cardback" ? (
          // Рубашка: веер из трёх карт со скином поверх классической текстуры.
          <span aria-hidden className="felt absolute inset-0">
            <span className="absolute inset-0 flex items-center justify-center gap-1">
              <CardBackChip itemId={item.id} className="h-20 w-14 -rotate-6" />
              <CardBackChip itemId={item.id} className="h-24 w-[68px]" />
              <CardBackChip itemId={item.id} className="h-20 w-14 rotate-6" />
            </span>
          </span>
        ) : item.slot === "avatar" ? (
          // Аватар-существо: круглый портрет на сукне, как за столом.
          <span aria-hidden className="felt absolute inset-0">
            <span className="absolute inset-0 flex items-center justify-center">
              <img
                src={item.imageSrc}
                alt=""
                loading="lazy"
                className="size-24 rounded-full border-2 border-ink/30 object-cover shadow-[var(--shadow-card)]"
              />
            </span>
          </span>
        ) : (
          <>
            <span aria-hidden className="felt absolute inset-0" />
            <span aria-hidden className="absolute inset-0 flex items-center justify-center">
              <Dice3D values={[2, 5]} dieSize={52} gap={12} tint={item.diceTint} />
            </span>
          </>
        )}
        <span className="absolute right-2 top-2 rounded-full border border-ink/25 bg-surface/90 px-2 py-0.5 text-[11px] font-medium tabular-nums text-fg shadow-sm">
          {item.price === 0 ? tt("shop.free") : tt("shop.price", { n: item.price })}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{name}</p>
          {item.rarity === "rare" ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent">
              <Star className="size-3" aria-hidden />
              {tt("shop.rarity.rare")}
            </span>
          ) : (
            <span className="shrink-0 rounded-full border border-border bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
              {tt("shop.rarity.common")}
            </span>
          )}
        </div>
        <p className="text-xs leading-snug text-muted">{tt(SHOP_ITEM_DESC_KEYS[item.id] ?? item.titleKey)}</p>
        <div className="mt-auto flex gap-2 pt-2">
          <Button
            variant="secondary"
            size="sm"
            aria-expanded={previewOpen}
            aria-label={tt("shop.preview.aria", { name })}
            onClick={onTogglePreview}
          >
            <Eye className="size-4" />
            {tt("shop.preview")}
          </Button>
          {equipped ? (
            <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-accent/40 bg-accent/10 px-2 py-1.5 text-xs font-medium text-accent">
              <CheckCircle2 className="size-4" aria-hidden />
              {tt("shop.equipped")}
            </span>
          ) : owned ? (
            <Button variant="secondary" className="flex-1" size="sm" disabled={busy} onClick={onEquip}>
              {tt("shop.equip")}
            </Button>
          ) : (
            <Button
              variant="default"
              className="flex-1"
              size="sm"
              disabled={busy || (balance !== null && balance < item.price)}
              onClick={onBuy}
            >
              {tt("shop.buy")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Моковый стол с экипированным предметом: сукно базовым классом .felt плюс
 * скин предмета (для кубика сукно остаётся классическим). На сукне — образцы
 * со стола (карта в руке, карточка свойства) и живые кости Dice3D: для
 * сукна — нейтральные (дефолтный тон), для кубика — с тоном предмета.
 */
function ShopPreview({ item, onClose }: { item: CosmeticItem; onClose: () => void }) {
  const tt = useT();
  const isFelt = item.slot === "felt";
  const name = tt(item.titleKey);
  const panelRef = useRef<HTMLDivElement>(null);
  // Панель раскрывается под сеткой секции — на телефоне она может оказаться
  // за нижним краем: подтягиваем минимально (мгновенно, без smooth).
  useEffect(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, []);
  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={tt("shop.preview.title", { name })}
      className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-accent/50 bg-surface shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-fg">{tt("shop.preview.title", { name })}</p>
          <p className="text-xs text-muted">{tt("shop.preview.hint")}</p>
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          aria-label={tt("shop.preview.close")}
          title={tt("shop.preview.close")}
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="p-3 pb-2">
        <div
          className={cn(
            "felt relative flex min-h-[200px] items-center justify-center gap-4 overflow-hidden rounded-[var(--radius-md)] border border-ink/30 px-4 sm:min-h-[230px] sm:gap-6",
            isFelt && item.cssClass,
          )}
        >
          {/* Образцы со стола: карта в руке и карточка свойства читаются на любом сукне.
              Для рубашки классический образец заменяется веером со скином. */}
          {item.slot === "cardback" ? (
            <>
              <CardBackChip itemId={item.id} className="aspect-[2/3] w-16 rounded-[var(--radius-sm)] border border-ink/40 shadow-md sm:w-20" />
              <CardBackChip itemId={item.id} className="aspect-[2/3] w-14 rotate-6 rounded-[var(--radius-sm)] border border-ink/40 shadow-md sm:w-16" />
            </>
          ) : (
            <img
              src={BG.cardBack}
              alt=""
              aria-hidden
              className="aspect-[2/3] w-16 rounded-[var(--radius-sm)] border border-ink/40 object-cover shadow-md sm:w-20"
            />
          )}
          <img
            src={TRAIT_ART.carnivore!}
            alt=""
            aria-hidden
            className="aspect-[2/3] w-14 rounded-[var(--radius-sm)] border border-ink/40 object-cover shadow-md sm:w-16"
          />
          <Dice3D values={[3, 4]} dieSize={48} gap={12} tint={isFelt ? undefined : item.diceTint} />
        </div>
        {/* Честность превью: показан только эффект самого предмета. */}
        <p className="px-1 py-2 text-xs text-muted">
          {tt(isFelt ? "shop.preview.note.felt" : "shop.preview.note.dice")}
        </p>
      </div>
    </div>
  );
}

/**
 * Бестиарий натуралиста (волна 4б, §4.1Д): альбом именованных животных.
 * Карточка = кличка + свойства + итог партии; никакой силы, только память
 * и статус. Пустой альбом объясняет, как завести первого питомца.
 *
 * Содержимое без диалоговой оболочки: живёт на странице /bestiary
 * (FeaturePage). Чтение альбома — ПОСЛЕ монтирования: альбом device-bound
 * (localStorage), SSR про него не знает, иначе hydration mismatch. Заодно
 * монтирование — точка перепроверки чердака: погибшие в партиях питомцы
 * оседают в альбоме, даже если их партия так и не доигралась.
 */
export function BestiariumContent() {
  const tt = useT();
  const [entries, setEntries] = useState<BestiariumEntry[] | null>(null);
  useEffect(() => {
    setEntries(flushPendingSpecimens());
  }, []);
  return (
    <>
      <header className="mb-4">
        <h1 className="font-display text-2xl tracking-[0.08em] text-fg sm:text-3xl">{tt("bestiarium.title")}</h1>
        <p className="mt-1 text-xs text-muted">{tt("bestiarium.subtitle")}</p>
      </header>
      {entries === null ? null : entries.length === 0 ? (
        <p className="rounded-[var(--radius-md)] border border-border bg-bg/60 px-4 py-6 text-center text-sm text-muted">
          {tt("bestiarium.empty")}
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {entries.map((e, i) => (
            <div key={`${e.name}-${e.at}-${i}`} className="rounded-[var(--radius-md)] border border-border bg-bg/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-display text-sm tracking-wide text-fg">{e.name}</p>
                {e.won ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-accent">
                    <Star className="size-3.5" aria-hidden />
                    {tt("bestiarium.won")}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 truncate text-xs text-muted">
                {e.traits.length ? e.traits.map((t) => tt(traitTitleKey(t))).join(" · ") : tt("bestiarium.noTraits")}
              </p>
              <p className="mt-0.5 text-[11px] text-subtle">{tt("bestiarium.year", { n: e.year })}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/** Ключ имени свойства — термины живут в terms.ts, отсюда литеральный ключ. */
function traitTitleKey(t: TraitId): TKey {
  return ("trait." + t) as TKey;
}

/**
 * Кампания «Эры» (волна 4а, дизайн-пакет §4.1А): эпохи → миссии → изверги.
 * Прогресс — localStorage (evo-campaign) через стор; «Хард» открывается после
 * «Нормы». Миссия запускает обычную комнату с лёгким/обычным/тяжёлым ботом;
 * у изверга — сценарное ломающее правило (GameScenario в движке).
 *
 * Содержимое без диалоговой оболочки: живёт на странице /campaign
 * (FeaturePage). После успешного старта миссии вызывается onStarted —
 * страница уводит в меню, где лобби партии открывает GameApp.
 */
/**
 * Страница кампании (фундамент рогалик-переработки «Эр»): путь эпохи вместо
 * списка миссий. Забег — локальная партия на чистом движке, вход свободный
 * (ни профиля, ни пройденных уровней), проигрыш не отнимает ничего вне
 * забега. Текущий узел: бой → «В бой», награда → выбор усиления.
 */
export function CampaignContent({ onStarted }: { onStarted?: () => void }) {
  const tt = useT();
  const run = useGameStore((s) => s.campaignRun);
  const tableLive = useGameStore((s) => Boolean(s.net));
  const startCampaignRun = useGameStore((s) => s.startCampaignRun);
  const continueCampaignRun = useGameStore((s) => s.continueCampaignRun);
  const campaignStartBattle = useGameStore((s) => s.campaignStartBattle);
  const campaignApplyReward = useGameStore((s) => s.campaignApplyReward);
  const abandonCampaignRun = useGameStore((s) => s.abandonCampaignRun);

  const header = (
    <header className="mb-4">
      <h1 className="font-display text-2xl tracking-[0.08em] text-fg sm:text-3xl">{tt("campaign.title")}</h1>
      <p className="mt-1 text-xs text-muted">{tt("campaign.run.subtitle")}</p>
    </header>
  );

  // Нет активного забега (или он завершён): выбор эпохи — все открыты.
  if (!run || run.status !== "active") {
    const finished = run && (run.status === "won" || run.status === "lost");
    return (
      <>
        {header}
        {finished ? (
          <div
            className={cn(
              "mb-4 rounded-[var(--radius-md)] border p-3",
              run.status === "won" ? "border-good/45 bg-good/10" : "border-border bg-bg/60",
            )}
          >
            <p className="text-sm font-medium text-fg">
              {tt(run.status === "won" ? "campaign.run.wonTitle" : "campaign.run.lostTitle")}
            </p>
            <p className="mt-1 text-xs leading-snug text-muted">
              {tt(run.status === "won" ? "campaign.run.wonText" : "campaign.run.lostText")}
            </p>
          </div>
        ) : null}
        <div className="grid gap-2">
          {CAMPAIGN_ERAS.map((era) => (
            <div
              key={era.id}
              className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 rounded-[var(--radius-md)] border border-border bg-bg/60 p-3"
            >
              <p className="text-sm text-fg">{tt(era.titleKey)}</p>
              <Button
                size="sm"
                onClick={() => {
                  startCampaignRun(era.id, "Evo");
                  onStarted?.();
                }}
              >
                {tt("campaign.run.new")}
              </Button>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Активный забег: путь эпохи + действие текущего узла.
  const nodes = Object.values(run.nodes);
  const node = run.nodes[run.currentNodeId];
  const total = nodes.length;
  return (
    <>
      {header}
      <section aria-label={tt("campaign.title")} className="mb-4 grid gap-1.5">
        {nodes.map((n, i) => {
          const cleared = run.cleared.includes(n.id);
          const current = n.id === run.currentNodeId;
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2 text-sm",
                current ? "border-accent/50 bg-accent/10" : cleared ? "border-good/40 bg-good/10" : "border-border bg-bg/60 opacity-75",
              )}
            >
              {cleared ? (
                <CheckCircle2 className="size-4 shrink-0 text-good" aria-hidden />
              ) : current ? (
                <Compass className="size-4 shrink-0 text-accent" aria-hidden />
              ) : (
                <span className="size-2 shrink-0 rounded-full bg-muted" aria-hidden />
              )}
              <span className={cn("truncate", current ? "font-medium text-fg" : "text-fg")}>{tt(n.titleKey)}</span>
              {n.kind === "boss" ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] border border-danger/40 bg-danger/10 px-1.5 py-0.5 text-[10px] text-clay">
                  <Swords className="size-3" aria-hidden />
                  {tt("campaign.run.hud.boss")}
                </span>
              ) : null}
              <span className="ml-auto shrink-0 text-xs text-muted">
                {i + 1}/{total}
              </span>
            </div>
          );
        })}
      </section>

      {run.match ? (
        // Матч приостановлен (ушли со стола) или стол ещё жив в другой вкладке
        // навигации: «Продолжить» возобновляет хоста либо возвращает к столу.
        <section className="rounded-[var(--radius-md)] border border-accent/40 bg-accent/5 p-3">
          <p className="text-sm text-fg">{tt("campaign.run.continueHint")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (!tableLive) continueCampaignRun();
                onStarted?.();
              }}
            >
              {tt("campaign.run.continue")}
            </Button>
            <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10 hover:text-danger" onClick={abandonCampaignRun}>
              {tt("campaign.run.abandon")}
            </Button>
          </div>
        </section>
      ) : node?.kind === "reward" && node.rewards ? (
        // Узел награды: выбор одного усиления, курсор переходит к следующему бою.
        <section>
          <p className="mb-2 text-sm font-medium text-fg">{tt("campaign.run.pickReward")}</p>
          <div className="mb-3">
            <StashChips run={run} emptyKey="campaign.run.stashEmpty" />
          </div>
          <div className="grid gap-2">
            {node.rewards.map((r: RunReward) => (
              <button
                key={r.id}
                type="button"
                className="rounded-[var(--radius-md)] border border-border bg-bg/60 p-3 text-left transition-colors hover:border-accent/50 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => campaignApplyReward(r)}
              >
                <p className="text-sm font-medium text-fg">{tt(r.nameKey)}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{tt(r.descKey)}</p>
              </button>
            ))}
          </div>
        </section>
      ) : node?.battle ? (
        <section className="rounded-[var(--radius-md)] border border-border bg-bg/60 p-3">
          <p className="text-xs text-muted">{tt("campaign.run.nextBattle")}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-fg">
            {node.kind === "boss" ? <Swords className="size-4 shrink-0 text-danger" aria-hidden /> : null}
            <span className="truncate">{tt(node.battle.nameKey)}</span>
            <span className="text-muted">·</span>
            <span className="truncate text-muted">{tt(node.titleKey)}</span>
          </p>
          <Button
            className="mt-2"
            size="sm"
            onClick={() => {
              campaignStartBattle();
              onStarted?.();
            }}
          >
            {tt("campaign.run.startBattle")}
          </Button>
        </section>
      ) : null}
    </>
  );
}

/**
 * «Вызовы» (волна 3а, дизайн-пакет §4.1В): сеть целей с тирами поверх любых
 * партий. Прогресс и баланс — с сервера (профиль волны 0), каталог — общий
 * модуль src/game/challenges.ts; награда «Ископаемыми» начисляется сервером
 * идемпотентно, тир не может упасть дважды.
 *
 * Содержимое без диалоговой оболочки: живёт на странице /challenges
 * (FeaturePage).
 */
export function ChallengesContent() {
  const tt = useT();
  const [loaded, setLoaded] = useState<
    | { ok: false }
    | { ok: true; progress: Record<string, number>; claimed: string[]; featsDone: string[]; balance: number }
    | null
  >(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ch, prof] = await Promise.all([challengesGet(), profileGet()]);
        if (!alive) return;
        if (!ch.ok || !prof.ok) {
          setLoaded({ ok: false });
          return;
        }
        setLoaded({
          ok: true,
          progress: ch.progress,
          claimed: ch.claimed,
          featsDone: ch.featsDone,
          balance: prof.balance,
        });
      } catch {
        if (alive) setLoaded({ ok: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  return (
    <>
      {/* Заголовок страницы; счётчик ископаемых — справа от названия. */}
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h1 className="font-display text-2xl tracking-[0.08em] text-fg sm:text-3xl">{tt("challenges.title")}</h1>
          <p className="mt-1 text-xs text-muted">{tt("challenges.subtitle")}</p>
        </div>
        {loaded?.ok ? (
          <span className="rounded-[var(--radius-sm)] border border-border bg-bg px-2 py-1 text-xs tabular-nums text-fg">
            {tt("challenges.balance", { n: loaded.balance })}
          </span>
        ) : null}
      </header>
      {loaded === null ? (
        <p className="py-8 text-center text-sm text-muted">…</p>
      ) : !loaded.ok ? (
        <p role="alert" className="py-8 text-center text-sm text-danger">
          {tt("tutorial.startError")}
        </p>
      ) : (
        <ul className="grid gap-2">
          {CHALLENGES.map((ch) => {
            const isFeat = Boolean(ch.feat);
            const done = isFeat ? loaded.featsDone.includes(ch.id) : false;
            const value = loaded.progress[ch.id] ?? 0;
            const claimedTiers = ch.tiers.filter((_, i) => loaded.claimed.includes(`${ch.id}:${i}`));
            const nextTier = ch.tiers.find((_, i) => !loaded.claimed.includes(`${ch.id}:${i}`));
            const allDone = claimedTiers.length === ch.tiers.length;
            return (
              <li
                key={ch.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[var(--radius-md)] border px-3 py-2.5",
                  allDone || done
                    ? "border-good/45 bg-good/10"
                    : "border-border bg-bg/60",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{tt(ch.titleKey)}</p>
                  <p className="text-xs text-muted">
                    {isFeat
                      ? done
                        ? tt("challenges.done")
                        : tt("challenges.progress", { value: 0, goal: 1 })
                      : nextTier
                        ? tt("challenges.progress", { value, goal: nextTier.n })
                        : tt("challenges.done")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {nextTier && !isFeat ? (
                    <span className="text-xs font-semibold tabular-nums text-accent">
                      {tt("challenges.reward", { n: nextTier.coins })}
                    </span>
                  ) : allDone || done ? (
                    <CheckCircle2 className="size-5 text-good" aria-hidden />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
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
