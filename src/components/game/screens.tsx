import { BookOpen, Play, RotateCcw, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NetMenuPanel } from "@/components/game/net-screens";
import { FLORA, MARKS } from "@/game/flora";
import { CONTINENTS_TRAIT_IDS, FUNGI_TRAIT_IDS, MUTATIONS_TRAIT_IDS, PLANTS_TRAIT_IDS, TRAITS, TRAIT_ORDER } from "@/game/traits";
import type { Difficulty, FloraKind, MarkKind, ScoreBreakdown, TraitId } from "@/game/types";
import { BG, DARK_ART, FLORA_ART, LOGO, MARK_ART, TRAIT_ART } from "@/lib/art";
import { cn } from "@/lib/utils";
import { FloraGlyph, TraitGlyph } from "./icons";
import { useGameStore } from "@/store/game-store";

const SPEEDS: Array<["slow" | "normal" | "fast", string, string]> = [
  ["slow", "Медленно", "Боты думают дольше, фазы показываются с паузами"],
  ["normal", "Обычно", "Комфортный настольный темп"],
  ["fast", "Быстро", "Для тех, кто ждёт только своего хода"],
];

/** Дополнения в разработке — официальный пересказ правил следующим обновлением. */
const MODULES: Array<[string, string]> = [];

export function MenuScreen({
  onStart,
  onRules,
}: {
  onStart: (players: number, difficulty: Difficulty) => void;
  onRules: () => void;
}) {
  const [players, setPlayers] = useState(2);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const speed = useGameStore((s) => s.speed);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const continents = useGameStore((s) => Boolean(s.modules.continents));
  const plants = useGameStore((s) => Boolean(s.modules.plants));
  const fungi = useGameStore((s) => Boolean(s.modules.fungi));
  const mutations = useGameStore((s) => Boolean(s.modules.randomMutations));
  const modules = useGameStore((s) => s.modules);
  const setModules = useGameStore((s) => s.setModules);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <img src={BG.menu} alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/55 to-bg" />
      </div>
      <div className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-5 py-16">
        <div className="mb-5 flex justify-center">
          <img
            src={LOGO}
            alt=""
            className="size-24 rounded-full border border-border-strong object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      <p className="relative mb-3 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
        Правильные игры · Кнорре
      </p>
      <h1 className="relative text-center text-5xl text-fg sm:text-6xl">Эволюция</h1>
      <p className="relative mx-auto mt-3 max-w-md text-center text-muted">
        Настольная игра о происхождении видов. Комбинируйте свойства, кормите популяцию и переживайте голодные годы.
      </p>

      <div className="relative mt-10 space-y-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7">
        <NetMenuPanel />

        <fieldset>
          <legend className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
            <Users className="size-4" />
            Игроков за столом
          </legend>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPlayers(n)}
                className={cn(
                  "h-12 rounded-[var(--radius-md)] border text-sm font-medium",
                  players === n
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg text-fg hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">
            Вы против {players - 1 === 1 ? "одного бота" : `${players - 1} ботов`}
          </p>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-muted">Сложность</legend>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["easy", "Проще"],
                ["normal", "Обычная"],
                ["hard", "Жёстче"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDifficulty(id)}
                className={cn(
                  "h-12 rounded-[var(--radius-md)] border text-sm font-medium",
                  difficulty === id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg text-fg hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-muted">Темп игры</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {SPEEDS.map(([id, label, hint]) => (
              <button
                key={id}
                type="button"
                title={hint}
                onClick={() => setSpeed(id)}
                className={cn(
                  "h-11 rounded-[var(--radius-md)] border text-sm font-medium",
                  speed === id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg text-fg hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-muted">Дополнения</legend>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setModules({ ...modules, continents: !continents })}
              aria-pressed={continents}
              title="Континенты: Лавразия и Гондвана с отдельными кормовыми базами, Океан для водоплавающих, миграция, прилипала, стадность, стрекательные клетки, эдификатор, регенерация, рекомбинация, неоплазия"
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left",
                continents ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2",
              )}
            >
              <span>
                <span className="block text-sm font-medium text-fg">Континенты</span>
                <span className="mt-0.5 block text-xs text-muted">
                  две кормовые базы и океан · миграция · новые свойства
                </span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                  continents ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted",
                )}
              >
                {continents ? "вкл" : "выкл"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setModules({ ...modules, plants: !plants })}
              aria-pressed={plants}
              title="Растения: еда этого года — на общих растениях, кубик не нужен; фаза роста, убежища, хищные растения, микориза и паразиты. Совместимо с Континентами."
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left",
                plants ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2",
              )}
            >
              <span>
                <span className="block text-sm font-medium text-fg">Растения</span>
                <span className="mt-0.5 block text-xs text-muted">
                  еда на общих растениях · убежища · фаза роста · хищные растения
                </span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                  plants ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted",
                )}
              >
                {plants ? "вкл" : "выкл"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setModules({ ...modules, fungi: !fungi })}
              aria-pressed={fungi}
              title="Трава и грибы: еда этого года — на общих картах трав и грибов; метки последствий (Яд, Сон, Бешенство…), новые свойства «Прозрачное» и «Насекомоядное». Совместимо с Континентами и Растениями."
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left",
                fungi ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2",
              )}
            >
              <span>
                <span className="block text-sm font-medium text-fg">Трава и грибы</span>
                <span className="mt-0.5 block text-xs text-muted">
                  еда на травах и грибах · метки последствий · флора играет на победу
                </span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                  fungi ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted",
                )}
              >
                {fungi ? "вкл" : "выкл"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setModules({ ...modules, randomMutations: !mutations })}
              aria-pressed={mutations}
              title="Случайные мутации: вместо руки — личная слепая колода; объявите розыгрыш и вскройте карту. Новые свойства, в том числе вредные мутации. Совместимо со всеми дополнениями."
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left",
                mutations ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2",
              )}
            >
              <span>
                <span className="block text-sm font-medium text-fg">Случайные мутации</span>
                <span className="mt-0.5 block text-xs text-muted">
                  личная слепая колода · численность видов · вредные мутации
                </span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                  mutations ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted",
                )}
              >
                {mutations ? "вкл" : "выкл"}
              </span>
            </button>
            <ul className="grid gap-2 sm:grid-cols-2">
              {MODULES.map(([name, hint]) => (
                <li
                  key={name}
                  title={`${name}: ${hint}. Готовится — официальный пересказ правил следующим обновлением.`}
                  className="flex cursor-not-allowed items-center justify-between rounded-[var(--radius-md)] border border-dashed border-border bg-bg px-3 py-2.5 opacity-60"
                >
                  <span className="text-sm text-fg">{name}</span>
                  <span className="rounded-full bg-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">скоро</span>
                </li>
              ))}
            </ul>
          </div>
        </fieldset>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" size="lg" onClick={() => onStart(players, difficulty)}>
            <Play className="size-4" />
            Начать год
          </Button>
          <Button variant="secondary" size="lg" onClick={onRules}>
            <BookOpen className="size-4" />
            Правила
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}

type RulesTab = "base" | "continents" | "plants" | "fungi" | "mutations";

const RULES_TABS: Array<{ id: RulesTab; label: string }> = [
  { id: "base", label: "Базовая игра" },
  { id: "continents", label: "Континенты" },
  { id: "plants", label: "Растения" },
  { id: "fungi", label: "Трава и грибы" },
  { id: "mutations", label: "Мутации" },
];

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

function TraitList({ ids }: { ids: TraitId[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {ids.map((id) => {
        const t = TRAITS[id];
        return (
          <li key={t.id} className="flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3">
            {TRAIT_ART[t.id] ? (
              <img
                src={TRAIT_ART[t.id]}
                alt=""
                loading="lazy"
                className={cn(
                  "h-[68px] w-12 shrink-0 rounded-[var(--radius-xs)] object-cover object-top",
                  DARK_ART.has(t.id) && "bg-ink object-contain p-0.5",
                )}
              />
            ) : (
              <span className="flex h-[68px] w-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-border bg-surface">
                <TraitGlyph id={t.id} className="size-7 text-muted" />
              </span>
            )}
            <div>
              <div className="font-medium text-fg">{t.name}</div>
              <div className="mt-1 text-xs leading-snug">{t.description}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Список карт флоры «Травы и грибов» в правилах. */
function FloraList() {
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
                {f.name}
                <span className="ml-1 text-xs font-normal text-muted">({f.isFungus ? "гриб · входит с 1 фишкой" : "трава · входит с 3"})</span>
              </div>
              <div className="mt-1 text-xs leading-snug">{f.description}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Список меток последствий в правилах. */
function MarksList() {
  const kinds = Object.keys(MARKS) as MarkKind[];
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {kinds.map((k) => {
        const m = MARKS[k];
        return (
          <li key={k} className="flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3">
            <img
              src={MARK_ART[k]}
              alt=""
              loading="lazy"
              className="size-10 shrink-0 self-start rounded-full object-cover ring-1 ring-border"
            />
            <div>
              <div className="font-medium text-fg">Метка «{m.name}» · по 4 в комплекте</div>
              <div className="mt-1 text-xs leading-snug">{m.description}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function RulesPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<RulesTab>("base");
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-5 sm:rounded-[var(--radius-xl)] sm:p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-2xl">Правила</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Закрыть
          </Button>
        </div>
        <div role="tablist" aria-label="Раздел правил" className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RULES_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "h-11 rounded-[var(--radius-md)] border px-1 text-sm font-medium",
                tab === id
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border bg-bg text-fg hover:bg-surface-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "base" && (
          <div className="space-y-4 text-sm text-muted">
            <p>
              Базовая русская «Эволюция» (Правильные игры, 2010). Колода 84 карты, 2–4 игрока. Побеждает тот, чья популяция набрала больше очков после последнего года.
            </p>
            <h3 className="text-fg">Ход года</h3>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">Развитие.</strong> По кругу выкладывайте по одной карте: новое животное или свойство. Свойства кладутся лицом вверх — все видят, кто что выложил. Двойные карты — одно из двух свойств. Паразит только на чужих. Парная карта (симбиоз, сотрудничество, взаимодействие) кладётся между двумя животными — на пару может лежать только одна парная карта. Пас — и больше не играете в этой фазе; когда спасовали все, фаза заканчивается.
              </li>
              <li>
                <strong className="text-fg">Кормовая база.</strong> 2 игрока: 1d6+2. 3: 2d6. 4: 2d6+2.
              </li>
              <li>
                <strong className="text-fg">Питание.</strong> Ход длится, пока не нажмёте «Закончить ход»: одно действие ход не отдаёт. За ход можно напасть каждым из своих хищников и/или использовать всех пиратов — либо взять одну фишку еды (накормленное животное берёт только в пустой жировой запас); если берёте еду, хищники и пираты в этот ход недоступны. Накормленное животное больше не использует свойства: не нападает, не пиратствует, не топчет, не уходит в спячку и не тратит жир. Топтуны топчут вместе с взятием еды, каждый — раз за ход. Превращение жира — свободное действие. Когда делать нечего совсем, ход передаётся сам. «Пас» выводит вас до конца фазы; фаза заканчивается, когда база пуста, все накормлены, все пасанули или никому нельзя ходить.
              </li>
              <li>
                <strong className="text-fg">Вымирание.</strong> Ненакормленные погибают. Добор: число выживших + 1. Если никого нет и рука пуста — 6 карт. Пустая колода — последний год.
              </li>
            </ol>
            <h3 className="text-fg">Очки</h3>
            <p>2 за каждое выжившее животное, 1 за каждое свойство. Дополнительно: хищник и большой +1, паразит +2. Ничья — по картам в сбросе.</p>
            <h3 className="text-fg">Свойства базовой игры</h3>
            <TraitList ids={TRAITS_BY_TAB.base} />
          </div>
        )}
        {tab === "continents" && (
          <div className="space-y-4 text-sm text-muted">
            <p>
              Дополнение «Континенты» (Правильные игры, 2012): 42 карты новых свойств. Включается в меню перед партией — все правила базовой игры остаются в силе.
            </p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">Территории.</strong> Животные живут на Лавразии, в Гондване и в Океане. Выкладывая животное, выбираете континент кликом по нему; в Океан животное попадает только со свойством «Водоплавающее». В океане водность перманентна: её не снять ни неоплазией, ни рекомбинацией, ни параличом — только миграция выводит животное на континент.
              </li>
              <li>
                <strong className="text-fg">Кормовые базы.</strong> У каждой территории своя база: 2 игрока — 8/7/5, три — 11/10/7, четыре — 14/13/9 (Лавразия/Гондвана/Океан). В свой ход вы привязаны к одной территории: берёте еду её базы и используете свойства животных, стоящих на ней. Хищник ест только в своей территории. «Эдификатор» добавляет 2 фишки в базу своей территории ежегодно.
              </li>
              <li>
                <strong className="text-fg">Парные карты.</strong> Кладутся между двумя животными одной территории. Разъехалась пара — карта уходит в сброс.
              </li>
              <li>
                <strong className="text-fg">Миграция.</strong> Объявите миграцию вместо обычного хода: ни еды, ни других свойств. Мигрирующие животные (в любом числе) переезжают: океан ↔ континенты, континент → континент напрямую нельзя. Сухопутное в океан не идёт. С мигрантом едут прилипалы — свои и чужие, даже с континента на континент.
              </li>
              <li>
                <strong className="text-fg">Новые свойства.</strong> Стадность: пока стадных в локации больше, чем хищников, их нельзя есть. Стрекательные клетки: атаковавший хищник теряет все свойства до конца года (потребность 1), в океане ещё и выбрасывается на континент. Регенерация: съеденное хищником животное оставляет свойства — в вымирание владелец кладёт на них карту из руки как новое животное (добора за него нет). Рекомбинация (парная): партнёры обмениваются по одному свойству. <span className="text-virus">Неоплазия</span> — вирус: играется на любое животное, своё или чужое, и каждый год в начале определения кормовой базы поднимается, выключая очередное непарное свойство (выключенное не работает, но очки даёт); когда выключать нечего — животное немедленно погибает. Вирусные свойства (паразит, неоплазия) помечены фиолетовым.
              </li>
              <li>
                <strong className="text-fg">Спасение.</strong> Игрок без руки и животных берёт 10 карт и две сразу кладёт животными по континенту.
              </li>
            </ul>
            <h3 className="text-fg">Свойства дополнения</h3>
            <TraitList ids={TRAITS_BY_TAB.continents} />
          </div>
        )}
        {tab === "plants" && (
          <div className="space-y-4 text-sm text-muted">
            <p>
              Дополнение «Растения» (Правильные игры, 2016): 36 двусторонних карт — свойство растения либо свойство животного. Включается в меню перед партией, совместимо с «Континентами».
            </p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">Кормовая база без кубика.</strong> Еда этого года лежит на растениях. В фазу определения базы броска нет: сразу питание. С «Континентами» растения стоят на Лавразии и Гондване, а Океан получает базу по обычным правилам. Растения общие — не принадлежат никому.
              </li>
              <li>
                <strong className="text-fg">Питание.</strong> Фишка берётся с растения на животное — но только если животное способно им питаться: «Водное» растение кормит лишь водоплавающих, «Корнеплод» — норных, «Дерево» — больших. Хищники едят только с растений со значком плода и с «Питательных». Вместо еды или атаки можно занять убежище растения — жетон защищает от хищников и хищных растений до конца фазы. Пасовать нельзя, пока хоть одно ваше животное способно получить еду или убежище.
              </li>
              <li>
                <strong className="text-fg">Хищное растение.</strong> Раз за фазу питания: контратакует животное, тянущее с него еду (выживший всё равно получает фишку), либо один из игроков направляет его на любое животное, которое смог бы атаковать хищник без свойств. Съело животное — 2 фишки, получило хвост — 1, съело ядовитое — гибнет в вымирание.
              </li>
              <li>
                <strong className="text-fg">Вымирание.</strong> Съеденные дочиста растения погибают — кроме однолетника (выживает) и растений-паразитов (гибнут только с хозяином). Связка микориз выживает, если хоть на одном растении осталась еда. Гриб получает фишку за каждое погибшее животное.
              </li>
              <li>
                <strong className="text-fg">Фаза роста.</strong> Выжившие растения разрастаются по своим схемам (многолетник 1→2, 2→3, 3+→5 и т.д.), лиана получает столько фишек, сколько на столе не-лиан, убежища восстанавливаются, из колоды выходят новые растения. Эдификатор с «Континентами» добавляет по фишке растениям своей локации.
              </li>
              <li>
                <strong className="text-fg">Очки.</strong> Растения и их свойства при подсчёте не учитываются — очки дают только животные и их свойства.
              </li>
            </ul>
            <h3 className="text-fg">Свойства растений</h3>
            <TraitList ids={TRAITS_BY_TAB.plants} />
            <p className="text-xs">
              Свойства животных на вторых гранях карт «Растений» — из базовой игры, смотрите их во вкладке «Базовая игра».
            </p>
          </div>
        )}
        {tab === "fungi" && (
          <div className="space-y-4 text-sm text-muted">
            <p>
              Дополнение «Трава и грибы» (Правильные игры, 2019): 24 длинные карты флоры (6 грибов и 6 трав по 2 копии), 8 меток последствий и 2 новых свойства животных. Кормовая база этого года — все красные фишки на картах флоры; флора — полноправный участник партии и может победить.
            </p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">Стол флоры.</strong> На старте открыты 2 карты; в фазу кормовой базы из колоды выходят карты по числу игроков (максимум 8 на столе). Гриб входит в игру с 1 красной фишкой, трава — с 3; максимум фишек на карте — 4. С «Континентами» флора живёт на Лавразии и Гондване, Океан кормится по обычным правилам.
              </li>
              <li>
                <strong className="text-fg">Питание.</strong> Любое животное может брать фишки с любой травы или гриба — при взятии срабатывает способность карты. «Взаимодействие» и «Топотун» работают с картами флоры. Метки последствий: животное получает метку при взятии фишки с «меченой» карты, если не имеет такой же, если метка осталась на столе и если у него нет «Трына». Хищник, съевший добычу, получает все её метки.
              </li>
              <li>
                <strong className="text-fg">Разрастание грибов.</strong> Каждый раз, когда животное погибает (в питании и в вымирании), на любой гриб кладётся 1 красная фишка.
              </li>
              <li>
                <strong className="text-fg">Вымирание.</strong> Гибнут ненакормленные, отравлённые и животные с меткой «Яд» без «Антидота». С выживших снимаются все фишки и метки. Карты флоры без фишек уходят в сброс; каждая выжившая трава получает 1 фишку, грибы — только от гибели животных.
              </li>
              <li>
                <strong className="text-fg">Очки.</strong> «Трава и грибы» играют сами за себя: 2 очка за каждую выжившую карту флоры и 1 за каждую фишку на ней; при равенстве очков преимущество у флоры.
              </li>
            </ul>
            <h3 className="text-fg">Карты флоры</h3>
            <FloraList />
            <h3 className="text-fg">Метки последствий</h3>
            <MarksList />
            <h3 className="text-fg">Свойства животных</h3>
            <TraitList ids={TRAITS_BY_TAB.fungi} />
          </div>
        )}
        {tab === "mutations" && (
          <div className="space-y-4 text-sm text-muted">
            <p>
              Дополнение «Случайные мутации» (по одноимённой игре Правильных игр, 2013): рука карт исчезает — у каждого игрока личная слепая колода. В фазу развития вы сначала объявляете, как разыграете верхнюю карту, и только потом её вскрываете. Свойства достаются случайно, в том числе <strong className="text-fg">вредные мутации</strong> (тёмные карты). Совместимо со всеми дополнениями.
            </p>
            <ul className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-fg">Личная колода.</strong> 7 карт на старте, просматривать нельзя. В свой ход развития объявите один из способов розыгрыша: (1) новый вид — карта ложится животным; (2) свойство — на свой вид из одного животного; (3) +1 животное к виду. С «Растениями» можно объявить и свойство растения — карта вскроется на выбранном растении.
              </li>
              <li>
                <strong className="text-fg">Судьба свойства.</strong> Если свойство нельзя сыграть на выбранный вид, оно переезжает на соседний вид справа; если не подходит нигде — само становится новым видом-мутантом. Вредные мутации обязательны: отказаться от них нельзя.
              </li>
              <li>
                <strong className="text-fg">Численность вида.</strong> Вид может состоять из нескольких животных (отмечается «×N» на карточке). Численность нельзя наращивать выше числа ваших видов — исключение «Почкование». Еда, охота, голод и яд действуют на животных по одному: атака снимает одно животное, а не весь вид.
              </li>
              <li>
                <strong className="text-fg">Добор.</strong> В конце года: число животных + 2 карты на дно личной колоды. Общий запас кончился — последний год.
              </li>
              <li>
                <strong className="text-fg">Очки.</strong> 2 за каждое животное (с учётом численности), 1 за свойство и бонусы свойств; метаболический синдром даёт 2 дополнительных очка.
              </li>
            </ul>
            <h3 className="text-fg">Свойства дополнения</h3>
            <TraitList ids={TRAITS_BY_TAB.mutations} />
            <p className="text-xs">
              Прочие свойства в слепой колоде — из базовой игры и включённых дополнений; их правила смотрите в соответствующих вкладках.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

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
  onAgain: () => void;
  onMenu: () => void;
}) {
  const won = winnerIds.includes(humanId);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-4">
      <img
        src={won ? BG.victory : BG.extinction}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative w-full max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted">Конец эволюции</p>
        <h2 className="mt-2 text-3xl">{won ? "Ваша популяция доминирует" : "Вас вытеснили"}</h2>
        <ul className="mt-6 space-y-2">
          {scores.map((s, i) => (
            <li
              key={s.playerId}
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-3",
                winnerIds.includes(s.playerId) ? "border-accent bg-accent/10" : "border-border bg-bg",
              )}
            >
              <div>
                <div className="font-medium">
                  {i + 1}. {s.name}
                </div>
                <div className="text-xs text-muted">
                  животные {s.animals} · свойства {s.traits} · бонус {s.extras} · сброс {s.discard}
                </div>
              </div>
              <div className="font-display text-2xl tabular-nums">{s.total}</div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={onAgain}>
            <RotateCcw className="size-4" />
            Ещё партия
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onMenu}>
            В меню
          </Button>
        </div>
      </div>
    </div>
  );
}
