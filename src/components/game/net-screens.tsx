import {
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  Clock,
  Copy,
  Eye,
  GraduationCap,
  Lock,
  LockOpen,
  LogOut,
  Minus,
  Palette,
  Pencil,
  Play,
  Plus,
  Send,
  Settings2,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/game/confirm-dialog";
import { deckSizeFor } from "@/game/deck";
import type { Difficulty } from "@/game/types";
import { PLAYER_COLORS, type PlayerColor, type ReactionEmoji, type RoomSummary, type SeatInfo } from "@/lib/net/shared";
import { EventFeed, reactionsByChatId, type FeedItem } from "./event-feed";
import { HintNote } from "./hint-note";
import { loadLastNetConfig, typingNamesOf } from "@/store/game-store";
import { loadName, saveName } from "@/lib/net/session";
import { SoundToggle } from "./sound-toggle";
import { RulesPanel, StatsScreen } from "./screens";
import { TutorialScreen } from "./tutorial";
import { TopBar } from "./top-bar";
import { useGameStore, type NetUiState } from "@/store/game-store";
import { cn } from "@/lib/utils";
import { scientistName, useLang, useT } from "@/lib/i18n";

import type { TFn } from "@/lib/i18n";

/** Сложность бота — ключ словаря (id совпадает с Difficulty). */
const DIFF_KEYS = {
  easy: "diff.easy",
  normal: "diff.normal",
  hard: "diff.hard",
} as const satisfies Record<Difficulty, Parameters<TFn>[0]>;

/** Дополнение лобби: id, ключ имени и ключ подсказки. */
const MODULE_OPTIONS: Array<[ModuleKey, Parameters<TFn>[0], Parameters<TFn>[0]]> = [
  ["continents", "module.continents", "module.continents.hint"],
  ["plants", "module.plants", "module.plants.hint"],
  ["fungi", "module.fungi", "module.fungi.hint"],
  ["randomMutations", "module.randomMutations", "module.randomMutations.hint"],
];

/**
 * Базовые классы кастомных кнопок-переключателей (вне Button из UI-кита):
 * видимый фокус с клавиатуры и одинаковое поведение в отключённом виде.
 */
const TOGGLE_BASE =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50";

/** Короткая строка карточки стола: сложность и включённые дополнения. */
function roomSummaryLine(r: RoomSummary, tt: TFn): string {
  const diff = tt(DIFF_KEYS[r.difficulty as keyof typeof DIFF_KEYS] ?? "diff.normal");
  const mods = r.modules
    .map((m) => MODULE_OPTIONS.find(([key]) => key === m)?.[1])
    .filter((x): x is Parameters<TFn>[0] => Boolean(x))
    .map((key) => tt(key));
  return [diff, ...mods].join(" · ");
}

/** Строка списка столов: код, хост, заполненность и действие. */
function RoomRow({ room, onJoin, onWatch }: { room: RoomSummary; onJoin: () => void; onWatch: () => void }) {
  const tt = useT();
  const live = room.status !== "lobby";
  return (
    <li
      data-room-row={room.code}
      className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2"
    >
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base tracking-[0.18em] text-fg">{room.code}</span>
          <span className="min-w-0 truncate text-xs text-muted">{tt("menu.room.host", { name: room.hostName })}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-subtle">
          {tt("menu.room.summary", {
            line: roomSummaryLine(room, tt),
            taken: room.taken,
            capacity: room.capacity,
          })}
        </p>
      </div>
      <Button
        variant="secondary"
        className="shrink-0"
        // «Наблюдать», а не «Смотреть»: в форме входа уже есть кнопка
        // «Смотреть» (зрительский вход), и две одинаковые метки ломали
        // и доступность, и QA-селекторы по имени кнопки.
        title={live ? tt("menu.room.watchTitle") : tt("menu.room.joinTitle")}
        onClick={live ? onWatch : onJoin}
      >
        {live ? <Eye className="size-4" /> : <Play className="size-4" />}
        {live ? tt("menu.room.watch") : tt("menu.room.join")}
      </Button>
    </li>
  );
}

/** Вкладки мобильной вёрстки меню: списки столов и форма «Создать». */
type MenuTab = "tables" | "create";

/**
 * Колонка меню той же геометрии, что у лобби: шапка и служебные блоки не
 * скроллятся, сам список получает слайдер внутри колонки. На десктопе высота
 * колонки равна высоте страницы меню — все три стоят одной высоты.
 */
function MenuColumn({
  id,
  title,
  hint,
  icon,
  children,
  hidden = false,
}: {
  /** Идентификатор колонки для QA-замеров (data-menu-col). */
  id: "table" | "open" | "private";
  title: string;
  hint: string;
  icon: ReactNode;
  children: ReactNode;
  /** Скрыта на телефоне: показывается своей вкладкой; на lg видна всегда. */
  hidden?: boolean;
}) {
  return (
    <section
      data-menu-col={id}
      className={cn(
        "min-h-0 w-full flex-col rounded-[var(--radius-xl)] border border-border bg-surface lg:flex lg:h-full",
        hidden ? "hidden" : "flex",
      )}
    >
      <header className="shrink-0 border-b border-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-medium text-fg">
          {icon}
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] leading-snug text-subtle">{hint}</p>
      </header>
      <div data-menu-scroll className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:overflow-y-auto">
        {children}
      </div>
    </section>
  );
}

/** Секция списка столов внутри колонки: заголовок и строки либо пустое состояние. */
function RoomsSection({
  title,
  rooms,
  empty,
  render,
}: {
  title: string;
  rooms: RoomSummary[];
  empty: string;
  render: (room: RoomSummary) => ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted">
        {title} <span className="tabular-nums text-subtle">{rooms.length || ""}</span>
      </p>
      {rooms.length ? (
        <ul className="space-y-2">{rooms.map(render)}</ul>
      ) : (
        <p className="rounded-[var(--radius-md)] border border-dashed border-border bg-bg/40 px-3 py-2 text-xs text-subtle">
          {empty}
        </p>
      )}
    </div>
  );
}

/**
 * Строка закрытого стола: код и хост видны всем, вход — только по паролю.
 * Пароль спрашивается по клику, прямо в строке (как просил владелец), и
 * уходит на сервер вместе с кодом. Неверный пароль — понятная ошибка под
 * полем, введённые цифры остаются. Наблюдение закрытых столов здесь не
 * предлагаем: в списке видны только входные данные стола, без пароля.
 */
function PrivateRoomRow({
  room,
  open,
  password,
  error,
  busy,
  disabled,
  onOpen,
  onCancel,
  onPassword,
  onSubmit,
}: {
  room: RoomSummary;
  open: boolean;
  password: string;
  error: string | null;
  busy: boolean;
  /** Без имени вход не пускаем: соперники должны видеть, кто пришёл. */
  disabled: boolean;
  onOpen: () => void;
  onCancel: () => void;
  onPassword: (value: string) => void;
  onSubmit: () => void;
}) {
  const tt = useT();
  const live = room.status !== "lobby";
  return (
    <li
      data-room-row={room.code}
      data-private-row={room.code}
      className="rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Владелец просил «после нажатия ввести пароль»: кликабельна вся
            строка, а не только маленькая кнопка права. */}
        <button
          type="button"
          data-private-open={room.code}
          disabled={live}
          aria-expanded={open}
          title={live ? tt("menu.private.liveTitle") : open ? tt("menu.private.collapseTitle") : tt("menu.private.openTitle")}
          onClick={() => (open ? onCancel() : onOpen())}
          className="min-w-0 flex-1 rounded-[var(--radius-sm)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-default"
        >
          <span className="flex items-baseline gap-2">
            <Lock className="size-3.5 shrink-0 self-center text-muted" aria-hidden />
            <span className="font-display text-base tracking-[0.18em] text-fg">{room.code}</span>
            <span className="min-w-0 truncate text-xs text-muted">{tt("menu.room.host", { name: room.hostName })}</span>
          </span>
          <span className="mt-0.5 block text-[11px] text-subtle">
            {tt("menu.room.summary", {
              line: roomSummaryLine(room, tt),
              taken: room.taken,
              capacity: room.capacity,
            })}
          </span>
        </button>
        {live ? (
          <span
            className="shrink-0 text-[10px] uppercase tracking-wide text-subtle"
            title={tt("menu.private.liveTitle")}
          >
            {tt("menu.private.live")}
          </span>
        ) : (
          <Button
            variant="secondary"
            className="shrink-0"
            aria-expanded={open}
            title={tt("menu.private.enterTitle")}
            onClick={() => (open ? onCancel() : onOpen())}
          >
            <Lock className="size-4" />
            {tt("menu.private.enter")}
          </Button>
        )}
      </div>

      {open && !live ? (
        <form
          className="mt-2 flex flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            value={password}
            onChange={(e) => onPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            maxLength={4}
            autoFocus
            placeholder={tt("menu.digits4")}
            aria-label={tt("menu.private.passwordAria")}
            className="h-11 w-24 rounded-[var(--radius-md)] border border-border bg-surface px-3 font-display text-sm tracking-[0.2em] tabular-nums text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          />
          <Button type="submit" className="max-xl:h-11" disabled={busy || disabled || password.length !== 4}>
            <Play className="size-4" />
            {tt("common.enter")}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            {tt("common.cancel")}
          </Button>
          {error ? (
            <p role="alert" className="w-full text-xs text-clay">
              {error}
            </p>
          ) : null}
        </form>
      ) : null}
    </li>
  );
}

/**
 * Сетка главного меню: три колонки, как в столе ожидания.
 * Колонка 1 — имя и вход/создание стола; колонка 2 — открытые столы
 * (ждут игроков и идут сейчас); колонка 3 — закрытые столы (пароль по клику).
 * Список комнат поллится раз в 4 секунды, интервал чистится при
 * размонтировании. Ссылка ?room=КОД предзаполняет форму входа, а при
 * сохранённом месте сразу возвращает за стол.
 */
export function NetMenuScreen() {
  const tt = useT();
  const startNetCreate = useGameStore((s) => s.startNetCreate);
  const startNetJoin = useGameStore((s) => s.startNetJoin);
  const startWatch = useGameStore((s) => s.startNetWatch);
  const resumeNetFromUrl = useGameStore((s) => s.resumeNetFromUrl);
  const rooms = useGameStore((s) => s.rooms);
  const netRefreshRooms = useGameStore((s) => s.netRefreshRooms);

  // Форма входа раскрывается кнопкой «Присоединиться к столу»; поле пароля
  // появляется только когда сервер его запросил (код password-required/wrong).
  const [joinOpen, setJoinOpen] = useState(false);
  // Имя из localStorage подставляем ПОСЛЕ гидратации, а не в useState: на
  // сервере localStorage нет, и состояние «Аня» против SSR-разметки «пусто»
  // оставляло кнопку «Создать стол» навсегда disabled — React такие
  // расхождения атрибутов не патчит («won't be patched up»).
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [needPassword, setNeedPassword] = useState(false);
  const [makePrivate, setMakePrivate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Мобильные вкладки: по умолчанию — списки столов.
  const [tab, setTab] = useState<MenuTab>("tables");
  // Открытая строка закрытого стола: пароль и ошибка входа.
  const [unlock, setUnlock] = useState<{ code: string; password: string; error: string | null } | null>(null);

  // Сохранённое имя — после гидратации; уже введённое не затираем.
  useEffect(() => {
    const saved = loadName();
    if (saved) setName((cur) => (cur ? cur : saved));
  }, []);

  useEffect(() => {
    const room = new URLSearchParams(window.location.search).get("room");
    if (!room) return;
    setCode(room.toUpperCase());
    setJoinOpen(true);
    // На телефоне форма входа живёт во вкладке «Создать» — открываем её.
    setTab("create");
    // Возвращение за своё место по токену — без формы, если получится.
    void resumeNetFromUrl(room);
    // Единожды на монтирование панели.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Живой список столов: раз в 4 с, во фоне не дёргаем сервер. Интервал
  // обязательно чистится при размонтировании (уход в лобби/партию).
  useEffect(() => {
    const poll = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      void netRefreshRooms();
    };
    poll();
    const timer = window.setInterval(poll, 4000);
    return () => window.clearInterval(timer);
  }, [netRefreshRooms]);

  async function run(fn: () => Promise<void>) {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      // Пароль: не выбрасываем человека из формы, а показываем поле пароля.
      // Код читаем строкой, а не через instanceof: после HMR экземпляры класса
      // из разных модулей не совпадают, а строковый код переживёт всё.
      const code = (e as { code?: unknown } | null)?.code;
      if (typeof code === "string" && code.startsWith("password")) {
        setNeedPassword(true);
        setJoinOpen(true);
        setTab("create");
      }
    } finally {
      setBusy(false);
    }
  }

  /** Имя обязательно для любой формы: без него кнопки не жмутся. */
  const named = name.trim().length > 0;
  const canJoin = named && code.length === 4;

  function createNow() {
    // Последние настройки запущенной партии (см. netStart в сторе):
    // новое открывается с ними же, всё правится в лобби.
    const last = loadLastNetConfig();
    const who = name.trim();
    saveName(who);
    void run(() =>
      startNetCreate({
        name: who,
        capacity: last.capacity ?? 2,
        botSeats: 0,
        difficulty: last.difficulty ?? "normal",
        modules: last.modules,
        deckSize: last.deckSize,
        isPrivate: makePrivate,
      }),
    );
  }

  function joinNow() {
    const who = name.trim();
    saveName(who);
    void run(() => startNetJoin(code, who, password));
  }

  function watchNow() {
    const who = name.trim();
    saveName(who);
    void run(() => startWatch(code, who));
  }

  /** Действие из списка: без имени не пускаем — соперники должны его видеть. */
  function actFromList(fn: () => Promise<void>) {
    if (!named) {
      setError(tt("menu.err.name"));
      setTab("create");
      return;
    }
    saveName(name.trim());
    void run(fn);
  }

  /**
   * Вход в закрытый стол из списка: пароль уходит на сервер вместе с кодом,
   * ошибка остаётся в строке — цифры не теряются, повторный ввод не нужен.
   */
  async function submitPrivate() {
    const target = unlock;
    if (!target || target.password.length !== 4) return;
    if (!named) {
      setUnlock({ ...target, error: tt("menu.err.nameCol") });
      return;
    }
    setBusy(true);
    saveName(name.trim());
    try {
      await startNetJoin(target.code, name.trim(), target.password);
    } catch (e) {
      setUnlock({ ...target, error: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  }

  const openRooms = rooms.filter((r) => !r.isPrivate);
  const privateRooms = rooms.filter((r) => r.isPrivate);
  const waiting = (list: RoomSummary[]) => list.filter((r) => r.status === "lobby" && r.free > 0);
  const live = (list: RoomSummary[]) => list.filter((r) => r.status !== "lobby");

  /** Строка открытого стола: занять место в лобби или наблюдать за партией. */
  const renderOpen = (r: RoomSummary) => (
    <RoomRow
      key={r.code}
      room={r}
      onJoin={() => actFromList(() => startNetJoin(r.code, name.trim()))}
      onWatch={() => actFromList(() => startWatch(r.code, name.trim()))}
    />
  );

  const renderPrivate = (r: RoomSummary) => (
    <PrivateRoomRow
      key={r.code}
      room={r}
      open={unlock?.code === r.code}
      password={unlock?.code === r.code ? unlock.password : ""}
      error={unlock?.code === r.code ? unlock.error : null}
      busy={busy}
      disabled={!named}
      onOpen={() => setUnlock({ code: r.code, password: "", error: null })}
      onCancel={() => setUnlock(null)}
      onPassword={(value) => setUnlock({ code: r.code, password: value, error: null })}
      onSubmit={() => void submitPrivate()}
    />
  );

  return (
    <>
      {/* Мобильные вкладки: на десктопе все три колонки видны сразу. */}
      <div
        role="group"
        aria-label={tt("menu.tabsLabel")}
        className="col-span-full grid grid-cols-2 gap-2 lg:hidden"
      >
        {(
          [
            ["tables", "menu.tab.tables", rooms.length],
            ["create", "menu.tab.create", null],
          ] as Array<[MenuTab, Parameters<TFn>[0], number | null]>
        ).map(([id, labelKey, badge]) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              TOGGLE_BASE,
              "flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border text-sm font-medium",
              tab === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface text-fg",
            )}
          >
            {tt(labelKey)}
            {badge ? <span className="tabular-nums opacity-70">{badge}</span> : null}
          </button>
        ))}
      </div>

      {/* ── Колонка 1: стол — имя, создание и вход по коду ── */}
      <MenuColumn
        id="table"
        title={tt("menu.col.table")}
        hint={tt("menu.col.table.hint")}
        icon={<Users className="size-4" />}
        hidden={tab !== "create"}
      >
        <label className="block">
          <span className="mb-1 block text-xs text-muted">{tt("menu.name")}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder={tt("menu.name.placeholder")}
            aria-label={tt("menu.name")}
            className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          />
        </label>

        <div className="grid gap-2">
          <Button size="lg" disabled={busy || !named} onClick={createNow}>
            <Play className="size-4" />
            {tt("menu.create")}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            aria-expanded={joinOpen}
            disabled={busy}
            onClick={() => setJoinOpen((v) => !v)}
          >
            <Users className="size-4" />
            {tt("menu.join")}
          </Button>
        </div>

        {/* min-h-11: чекбокс — тап-таргет 44px на телефоне, а не полоса в одну строку текста. */}
        <label className="flex min-h-11 items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={makePrivate}
            onChange={(e) => setMakePrivate(e.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          <Lock className="size-3.5" />
          {tt("menu.private")}
        </label>

        {joinOpen ? (
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg/50 p-3">
            <label className="mb-3 block">
              <span className="mb-1 block text-xs text-muted">{tt("menu.code")}</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
                maxLength={4}
                placeholder={tt("menu.code.placeholder")}
                aria-label={tt("menu.code")}
                className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 font-display text-lg tracking-[0.3em] uppercase text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              />
            </label>
            {needPassword ? (
              <label className="mb-3 block">
                <span className="mb-1 block text-xs text-muted">{tt("menu.password")}</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  maxLength={4}
                  autoFocus
                  placeholder={tt("menu.digits4")}
                  aria-label={tt("menu.password")}
                  className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 font-display text-lg tracking-[0.3em] tabular-nums text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                />
              </label>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Button size="lg" disabled={busy || !canJoin} onClick={joinNow}>
                <Play className="size-4" />
                {tt("common.enter")}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                disabled={busy || !canJoin}
                title={tt("menu.watch.title")}
                onClick={watchNow}
              >
                <Eye className="size-4" />
                {tt("menu.watch")}
              </Button>
            </div>
          </div>
        ) : null}

        <HintNote>{tt("menu.hint")}</HintNote>

        {error ? <p className="text-sm text-clay">{error}</p> : null}
      </MenuColumn>

      {/* ── Колонка 2: открытые столы ── */}
      <MenuColumn
        id="open"
        title={tt("menu.col.open")}
        hint={tt("menu.col.open.hint")}
        icon={<Users className="size-4" />}
        hidden={tab !== "tables"}
      >
        <RoomsSection
          title={tt("menu.waiting")}
          rooms={waiting(openRooms)}
          empty={tt("menu.open.empty")}
          render={renderOpen}
        />
        <RoomsSection
          title={tt("menu.live")}
          rooms={live(openRooms)}
          empty={tt("menu.open.live.empty")}
          render={renderOpen}
        />
      </MenuColumn>

      {/* ── Колонка 3: закрытые столы ── */}
      <MenuColumn
        id="private"
        title={tt("menu.col.private")}
        hint={tt("menu.col.private.hint")}
        icon={<Lock className="size-4" />}
        hidden={tab !== "tables"}
      >
        <RoomsSection
          title={tt("menu.waiting")}
          rooms={waiting(privateRooms)}
          empty={tt("menu.private.empty")}
          render={renderPrivate}
        />
        <RoomsSection
          title={tt("menu.live")}
          rooms={live(privateRooms)}
          empty={tt("menu.private.live.empty")}
          render={renderPrivate}
        />
      </MenuColumn>
    </>
  );
}


/** Ключи дополнений, которые хост включает в лобби. */
type ModuleKey = "continents" | "plants" | "fungi" | "randomMutations";

const CAPACITIES = [2, 3, 4, 5, 6, 7, 8] as const;

/** Что именно подтверждает хост: кик игрока за столом или ожидающего в очереди. */
type KickTarget =
  | { kind: "seat"; seat: number; name: string }
  | { kind: "waiter"; index: number; name: string };

/**
 * Грубая оценка длины партии по размеру колоды: за год колода уходит примерно
 * на 3,2 карты на игрока (добор «выжившие + 1»). Эмпирика прогонов движка:
 * полная база (84) при двух игроках — около 14 лет, при четырёх — около 7.
 */
function estimateYears(deckSize: number, players: number): number {
  return Math.max(2, Math.round(deckSize / (3.2 * Math.max(1, players))));
}

/** «1 min», «just now» — время ожидания в очереди. */
function formatWait(ms: number, tt: TFn): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 20) return tt("wait.now");
  if (s < 60) return tt("wait.sec", { s });
  const m = Math.floor(s / 60);
  if (m < 60) return tt("wait.min", { m });
  return tt("wait.hour", { h: Math.floor(m / 60), m: m % 60 });
}

/** Время ожидания, обновляется раз в 15 с — очередь не «замирает». */
function WaitingTime({ at }: { at: number }) {
  const tt = useT();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(t);
  }, []);
  return <span className="tabular-nums">{formatWait(now - at, tt)}</span>;
}

/**
 * Мягкая подложка строки места: цвет игрока, подмешанный к фону стола.
 * Та же формула, что у секции игрока в партии (seatTint в game-app): по ней
 * цвет места читается и в лобби, и в ожидающем столе одинаково с игрой.
 */
function seatTint(color: string | undefined): CSSProperties | undefined {
  if (!color) return undefined;
  return { backgroundColor: `color-mix(in oklab, ${color} 12%, var(--color-surface))` };
}

/**
 * Список мест стола: занятые игроки, боты и свободные места. Хост может
 * убрать человека, передать ему хост или увидеть, что место пока пусто.
 */
function SeatList({
  seats,
  capacity,
  mySeat,
  hostSeat,
  canManage,
  onKick,
  onTransfer,
  onRename,
  onColor,
}: {
  seats: SeatInfo[];
  capacity: number;
  mySeat: number;
  hostSeat: number;
  canManage: boolean;
  onKick?: (seat: SeatInfo) => void;
  onTransfer?: (seat: SeatInfo) => void;
  /** Смена своего имени прямо в списке мест (роботы и чужие имена не трогаем). */
  onRename?: (name: string) => void;
  /**
   * Смена цвета своего места. Передаётся только из лобби: сервер принимает
   * цвет лишь до старта партии, поэтому в экране ожидающего кнопки нет.
   */
  onColor?: (color: PlayerColor) => void;
}) {
  const tt = useT();
  const lang = useLang();
  const rows = Math.max(capacity, ...seats.map((s) => s.seat + 1), 0);
  // Правка имени: карандаш у своей строки, Enter — сохранить, Esc — отменить.
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  // Палитра цветов открыта у одного места; закрывается по выбору/повтору.
  const [palette, setPalette] = useState<number | null>(null);

  const startEdit = (seat: SeatInfo) => {
    setEditing(seat.seat);
    setDraft(seat.name);
  };
  const commit = () => {
    const next = draft.trim();
    setEditing(null);
    if (next && onRename) onRename(next.slice(0, 16));
  };
  return (
    <ul data-seat-list className="space-y-2">
      {Array.from({ length: rows }).map((_, seatNo) => {
        const seat = seats.find((x) => x.seat === seatNo);
        const isMe = seat?.seat === mySeat;
        const isHostSeat = seat?.seat === hostSeat;
        const canKick = canManage && seat && !seat.isAI && !isMe;
        const editingMe = isMe && seat && editing === seatNo;
        const pickColor = isMe && seat && onColor && !seat.isAI;
        return (
          <li
            key={seatNo}
            // Фон = цвет места (как секция игрока в партии) + та же бумажная
            // текстура paper-sheet, что у табло игрока: строка места в лобби
            // и в ожидающем столе выглядит как в игре. Цвет места — публичный,
            // приходит с сервера; у пустого места подложки нет.
            style={seatTint(seat?.color)}
            className={cn(
              // flex-wrap: раскрытая палитра (w-full) переносится на свою строку.
              "flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2.5",
              seat ? "paper-sheet border-border" : "border-dashed border-border bg-bg/40",
              isMe && "ring-1 ring-accent/50",
            )}
          >
            {editingMe ? (
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  autoFocus
                  value={draft}
                  maxLength={16}
                  aria-label={tt("seat.nameAria")}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") setEditing(null);
                  }}
                  className="min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1.5 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button variant="secondary" size="iconSm" className="max-xl:size-11" aria-label={tt("seat.nameSave")} onClick={commit}>
                  <Check className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  className="max-xl:size-11"
                  aria-label={tt("seat.nameCancel")}
                  onClick={() => setEditing(null)}
                >
                  <X className="size-4" />
                </Button>
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-fg">
                {seat ? (
                  // Цвет места теперь читается фоном строки (см. style выше),
                  // отдельного кружка слева нет — остаётся только онлайн-точка.
                  seat.isAI ? (
                    <Bot className="size-4 shrink-0 text-muted" />
                  ) : (
                    <span
                      className={cn("size-2 shrink-0 rounded-full", seat.online ? "bg-good" : "bg-ink/25")}
                      title={seat.online ? tt("seat.online") : tt("seat.offline")}
                    />
                  )
                ) : (
                  <span className="size-2 shrink-0 rounded-full bg-ink/15" />
                )}
                {/* Имя места: боты-учёные показываются на языке интерфейса,
                    люди — как назвались. Черновик правки хранит серверное имя. */}
                <span className="min-w-0 truncate">{seat ? scientistName(seat.name, lang) : tt("seat.free")}</span>
                {/* Действия своего места — сразу за именем (просил владелец),
                    бейджи идут после: карандаш не прячется за «хост»/«это вы». */}
                {isMe && seat && onRename ? (
                  <Button
                    variant="ghost"
                    size="iconSm"
                    className="max-xl:size-11"
                    aria-label={tt("seat.nameEditAria")}
                    title={tt("seat.nameEditTitle")}
                    onClick={() => startEdit(seat)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                ) : null}
                {/* Цвет — рядом с карандашом имени: фон строки уже показывает
                    текущий цвет, поэтому кнопка-палитра без второго кружка. */}
                {pickColor ? (
                  <Button
                    variant="ghost"
                    size="iconSm"
                    className="max-xl:size-11"
                    aria-label={tt("seat.colorAria", { color: seat.color })}
                    aria-expanded={palette === seatNo}
                    title={tt("seat.colorTitle")}
                    onClick={() => setPalette((v) => (v === seatNo ? null : seatNo))}
                  >
                    <Palette className="size-4" />
                  </Button>
                ) : null}
                {seat && !seat.isAI && !seat.online ? (
                  <span className="shrink-0 rounded-full bg-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    {tt("seat.offline")}
                  </span>
                ) : null}
                {seat?.resigned ? (
                  <span className="shrink-0 rounded-full bg-clay/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-clay">
                    {tt("seat.resigned")}
                  </span>
                ) : null}
                {isHostSeat ? (
                  <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent">
                    {tt("seat.host")}
                  </span>
                ) : null}
                {isMe ? (
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted">{tt("seat.you")}</span>
                ) : null}
              </span>
            )}
            {canKick && seat ? (
              <span className="flex shrink-0 items-center gap-0.5">
                {onTransfer && !isHostSeat ? (
                  <Button
                    variant="ghost"
                    size="iconSm"
                    className="max-xl:size-11"
                    aria-label={tt("seat.transferAria", { name: seat.name })}
                    title={tt("seat.transferTitle")}
                    onClick={() => onTransfer(seat)}
                  >
                    <ArrowLeftRight className="size-4" />
                  </Button>
                ) : null}
                {onKick ? (
                  <Button
                    variant="ghost"
                    size="iconSm"
                    className="max-xl:size-11 text-clay hover:text-danger"
                    aria-label={tt("seat.kickAria", { name: seat.name })}
                    title={tt("seat.kickTitle")}
                    onClick={() => onKick(seat)}
                  >
                    <UserMinus className="size-4" />
                  </Button>
                ) : null}
              </span>
            ) : !seat && canManage ? (
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-subtle">{tt("seat.waiting")}</span>
            ) : null}
            {/* Палитра своего места: выбор цвета в ожидании партии. Цвет
                эксклюзивен в пределах стола: занятые другими (включая ботов)
                цвета приглушены и не кликаются, под кружком — имя владельца. */}
            {pickColor && palette === seatNo ? (
              <div className="flex w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-bg px-2 py-1.5">
                <span className="mr-1 text-[10px] uppercase tracking-wide text-muted">{tt("seat.colorLabel")}</span>
                {PLAYER_COLORS.map((c) => {
                  const active = seat.color.toLowerCase() === c.toLowerCase();
                  const owner = seats.find(
                    (s) =>
                      s.seat !== seatNo &&
                      typeof s.color === "string" &&
                      s.color.toLowerCase() === c.toLowerCase(),
                  );
                  return (
                    <span key={c} className="flex w-8 shrink-0 flex-col items-center gap-0.5">
                      <button
                        type="button"
                        disabled={Boolean(owner)}
                        aria-pressed={active}
                        aria-label={tt("seat.colorAria", { color: c })}
                        title={owner ? `${c} — ${scientistName(owner.name, lang)}` : c}
                        onClick={() => {
                          setPalette(null);
                          // Текущий цвет повторно не отправляем: сервер всё равно
                          // ответит тем же, а лишний запрос ни к чему.
                          if (!active) onColor(c);
                        }}
                        className={cn(
                          "size-6 rounded-full border transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                          active
                            ? "scale-110 border-fg ring-2 ring-accent/60"
                            : owner
                              ? "cursor-not-allowed border-ink/20 opacity-40"
                              : "border-ink/20 hover:scale-110",
                        )}
                        style={{ background: c }}
                      />
                      {/* Метка владельца под занятым цветом; пустой spacer
                          держит все кружки на одной линии. */}
                      <span
                        className="max-w-full truncate text-[9px] leading-tight text-muted"
                        title={owner ? scientistName(owner.name, lang) : undefined}
                      >
                        {owner ? scientistName(owner.name, lang) : "\u00A0"}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Лобби сетевого стола: состав, настройки до старта, очередь ожидающих,
 * ссылка-приглашение, боты и старт от хоста. Ожидающий видит свой экран.
 */
/** Шапка сетевых экранов — та же навигация, что в главном меню. */
function NetTopBar({ subtitle }: { subtitle: string }) {
  const tt = useT();
  const [rulesOpen, setRulesOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  return (
    <>
      <TopBar subtitle={subtitle}>
        <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.tutorial")} title={tt("topbar.tutorial")} onClick={() => setTutorialOpen(true)}>
          <GraduationCap className="size-4" />
          <span className="hidden sm:inline">{tt("topbar.tutorial")}</span>
        </Button>
        <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.rules")} title={tt("topbar.rules")} onClick={() => setRulesOpen(true)}>
          <BookOpen className="size-4" />
          <span className="hidden sm:inline">{tt("topbar.rules")}</span>
        </Button>
        <Button variant="ghost" size="sm" className="max-xl:h-11" aria-label={tt("topbar.stats")} title={tt("topbar.stats")} onClick={() => setStatsOpen(true)}>
          <BarChart3 className="size-4" />
          <span className="hidden sm:inline">{tt("topbar.stats")}</span>
        </Button>
        <SoundToggle />
      </TopBar>
      {rulesOpen ? <RulesPanel onClose={() => setRulesOpen(false)} /> : null}
      {statsOpen ? <StatsScreen onClose={() => setStatsOpen(false)} /> : null}
      {tutorialOpen ? <TutorialScreen onClose={() => setTutorialOpen(false)} /> : null}
    </>
  );
}

/** Быстрые фразы чата — на текущем языке. */
function chatPhrases(tt: TFn): string[] {
  return [tt("chat.hi"), tt("chat.goodTable"), tt("chat.go")];
}

/**
 * Нейтральный тон автора без места за столом (ожидающие и зрители): своего
 * цвета у них нет, но ник всё равно должен читаться спокойным серо-зелёным.
 */
const NEUTRAL_AUTHOR_COLOR = "var(--color-muted)";

/**
 * Лента стола для лобби и ожидающего: чат плюс системные события состава.
 * Автору подставляем его цвет из списка мест (тот же, что в партии и в
 * цветном фоне строки места): по нему лента красит ник и подложку реплики.
 * Ожидающим (-1) и зрителям (-2) места за столом нет — у них нейтральный тон.
 * Реакции собираются в агрегат по `chatId` реплики (M12).
 */
function useTableFeedItems(net: NetUiState | null): FeedItem[] {
  const seats = net?.seats;
  const chat = net?.chat;
  const system = net?.system;
  const reactions = net?.reactions;
  const myName = net?.name;
  const colorBySeat = useMemo(() => {
    const map = new Map<number, string>();
    for (const s of seats ?? []) map.set(s.seat, s.color);
    return map;
  }, [seats]);
  return useMemo(() => {
    const byChat = reactionsByChatId(reactions, myName);
    const chatItems: FeedItem[] = (chat ?? []).map((m) => {
      const rs = byChat.get(m.id);
      return {
        id: `chat-${m.id}`,
        kind: "chat" as const,
        text: m.text,
        playerName: m.name,
        seat: m.seat,
        chatId: m.id,
        at: m.at,
        color: colorBySeat.get(m.seat) ?? NEUTRAL_AUTHOR_COLOR,
        ...(rs ? { reactions: rs } : {}),
      };
    });
    const systemItems: FeedItem[] = (system ?? []).map((n) => ({
      id: n.id,
      kind: "system" as const,
      text: n.text,
      at: n.at,
    }));
    // Контракт ленты — «старые сверху»: без сортировки системные записи всегда
    // оказывались в хвосте, и последней строкой была не свежая реплика, а
    // «кто-то присоединился» (на этом держатся и автопрокрутка, и счётчик).
    // При равном времени реплика идёт раньше системной записи (исходный порядок).
    return [...chatItems, ...systemItems]
      .map((item, i) => ({ item, i }))
      .sort((a, b) => (a.item.at ?? 0) - (b.item.at ?? 0) || a.i - b.i)
      .map((x) => x.item);
  }, [chat, system, colorBySeat, reactions, myName]);
}

/**
 * Реакция на реплику стола: реакция уходит с `chatId` (ложится под конкретное
 * сообщение) и с местом автора — по нему пузырь реакции всплывает над столом.
 * У записи без реплики (системной) реакции нет: `chatId` нечего адресовать.
 */
function reactToItem(
  sendReaction: (
    emoji: ReactionEmoji,
    kind: "reaction" | "cheer",
    targetSeat?: number | null,
    chatId?: number | null,
  ) => Promise<void>,
  item: FeedItem,
  emoji: ReactionEmoji,
): void {
  if (item.chatId === undefined) return;
  void sendReaction(emoji, "reaction", seatOfItem(item), item.chatId);
}

/**
 * Что видно в чате как «печатает…»: свои места, очередь и зрители (без меня).
 * Метки приходят поллингом, поэтому индикатор гаснет сам.
 */
function useTypingNames(net: NetUiState | null): string[] {
  return useMemo(() => (net ? typingNamesOf(net) : []), [net]);
}

/**
 * Место автора реплики для реакции: у игроков 0..7, у ожидающих и зрителей
 * места нет — null (реакция всё равно ложится под сообщение по chatId).
 */
function seatOfItem(item: FeedItem): number | null {
  return item.seat !== undefined && item.seat >= 0 ? item.seat : null;
}

/**
 * Чат стола: тот же буфер, что и в партии. В лобби живёт колонкой справа
 * (десктоп); на телефоне его место будет в навигации — волна журнала.
 */
export function LobbyScreen() {
  const tt = useT();
  const net = useGameStore((s) => s.net);
  const netAddBots = useGameStore((s) => s.netAddBots);
  const netStart = useGameStore((s) => s.netStart);
  const leaveNet = useGameStore((s) => s.leaveNet);
  const netKick = useGameStore((s) => s.netKick);
  const netSetCapacity = useGameStore((s) => s.netSetCapacity);
  const netSetSettings = useGameStore((s) => s.netSetSettings);
  const netSetRoomPrivacy = useGameStore((s) => s.netSetRoomPrivacy);
  const netSetPassword = useGameStore((s) => s.netSetPassword);
  const netSetColor = useGameStore((s) => s.netSetColor);
  const netTransferHost = useGameStore((s) => s.netTransferHost);
  const netKickWaiter = useGameStore((s) => s.netKickWaiter);
  const netSetName = useGameStore((s) => s.netSetName);
  const sendChat = useGameStore((s) => s.sendChat);
  const sendReaction = useGameStore((s) => s.sendReaction);
  const sendTyping = useGameStore((s) => s.sendTyping);
  const clearNetError = useGameStore((s) => s.clearNetError);
  // Чат лобби — тот же компонент, что журнал в игре: чат плюс системные
  // события стола (кто вошёл, вышел, сдался).
  const [chatOpen, setChatOpen] = useState(false);
  const lastSeenChatRef = useRef(0);
  const chatItems = useTableFeedItems(net);
  const typingNames = useTypingNames(net);
  const unreadChat = useMemo(() => {
    const last = chatItems[chatItems.length - 1];
    return last && (last.at ?? 0) > lastSeenChatRef.current ? (net?.chat.length ?? 0) : 0;
  }, [chatItems, net?.chat.length]);
  useEffect(() => {
    if (chatOpen) lastSeenChatRef.current = Date.now();
  }, [chatOpen, net?.chat.length]);

  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Inline-правка пароля хостом: черновик, статус сохранения и защита от
  // повторной отправки. Черновик НЕ очищаем при ошибке — введённое не теряется.
  // Само поле раскрывается карандашом у чипа пароля (см. шапку лобби).
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState("");
  const [passwordState, setPasswordState] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [kick, setKick] = useState<KickTarget | null>(null);
  const [transfer, setTransfer] = useState<SeatInfo | null>(null);

  // Стол мог исчезнуть (кик/закрытие) — родитель в этом случае уже показывает
  // меню с причиной; здесь лишь страховка от пустого кадра.
  if (!net) return null;
  // У ожидающего места свой экран — состав и кнопка «занять место».
  if (net.waiting) return <WaitingRoom />;

  const isHost = net.hostSeat === net.seat;
  const humans = net.seats.filter((s) => !s.isAI);
  const bots = net.seats.length - humans.length;
  const full = net.seats.length >= net.capacity;
  const shareUrl = `${window.location.origin}/?room=${net.code}`;
  const modules = net.settings.modules ?? {};
  const difficulty = net.settings.difficulty ?? "normal";
  // Полная колода для выбранных дополнений: если хост не менял размер — она.
  const deckFull = Math.max(deckSizeFor(1, modules), 20);
  const deckNow = Math.min(net.settings.deckSize ?? deckFull, deckFull);
  // Чего не хватает для старта: у хоста — полного стола, у остальных — прав.
  const freeSeats = Math.max(0, net.capacity - net.seats.length);
  const startHint = !isHost
    ? tt("lobby.startHint.host")
    : freeSeats > 0
      ? tt("lobby.startHint.free", { free: freeSeats, capacity: net.capacity })
      : null;

  /** Приглашение: ссылка с кодом; у приватного стола хост копирует и пароль. */
  const inviteText =
    net.isPrivate && net.password
      ? `${shareUrl}\n${tt("lobby.invitePassword", { password: net.password })}`
      : shareUrl;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt(tt("lobby.copyManual"), inviteText);
    }
  }

  /**
   * Сохранить введённый хостом пароль (Enter или потеря фокуса). Сервер
   * принимает ровно 4 цифры; при ошибке черновик остаётся на месте, а текст
   * отказа показывается подписью рядом с полем — вводить заново не нужно.
   */
  async function savePassword() {
    const value = passwordDraft.replace(/\D/g, "").slice(0, 4);
    if (value.length !== 4 || savingPassword) return;
    // Тот же пароль повторно не отправляем: сервер ответит тем же, а лишний
    // запрос и «мигание» подписи ни к чему. net? — сужение не переживает
    // объявление вложенной функции (страховка от пустого кадра выше).
    if (value === (net?.password ?? "")) {
      setEditingPassword(false);
      setPasswordDraft("");
      setPasswordState(null);
      return;
    }
    setSavingPassword(true);
    const res = await netSetPassword(value);
    setSavingPassword(false);
    if (res.ok) {
      setEditingPassword(false);
      setPasswordDraft("");
      setPasswordState({ kind: "ok", text: tt("lobby.passwordSaved") });
    } else {
      setPasswordState({ kind: "err", text: res.error ?? tt("lobby.passwordFail") });
    }
  }

  function toggleModule(key: ModuleKey) {
    if (!isHost) return;
    void netSetSettings({ modules: { ...modules, [key]: !modules[key] } });
  }

  function pickDifficulty(id: Difficulty) {
    if (isHost) void netSetSettings({ difficulty: id });
  }

  function pickDeck(size: number) {
    if (isHost) void netSetSettings({ deckSize: size });
  }

  // Пресеты — доли полной колоды выбранных дополнений: с модулями все три
  // растут вместе (как в меню), а не залипают на базовых 30/42.
  const deckPresets: Array<[number, Parameters<TFn>[0]]> = [
    [Math.max(20, Math.round(deckFull * 0.36)), "lobby.deckShort"],
    [Math.max(24, Math.round(deckFull * 0.5)), "lobby.deckNormal"],
    [deckFull, "lobby.deckFull"],
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <NetTopBar subtitle={tt("lobby.subtitle")} />
      {/* Три колонки на десктопе: игроки и зрители | настройки партии | чат.
          Колонки ограничены высотой экрана и скроллятся внутри себя — лобби
          больше не растягивает страницу. lg:flex-[1_1_0px] — флекс-базис
          длиной, а не процентом: процент в контейнере с min-h-dvh вырождается
          в content-sizing, и длинный чат тянул высоту всей страницы. */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-start justify-center gap-5 px-4 py-6 lg:h-[calc(100dvh-3.5rem)] lg:flex-[1_1_0px] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,360px)] lg:overflow-hidden">
      <div className="flex w-full flex-col gap-3 lg:h-full lg:overflow-y-auto lg:pr-1">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
        {tt("lobby.subtitle")}
      </p>
      {/* Код стола — центр шапки: рядом иконка копирования ссылки, а у хоста
          приватного стола ещё чип пароля с карандашом и замок приватности.
          Отдельного блока «Доступ к столу» больше нет — всё компактно тут. */}
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
        <h1 className="font-display text-4xl tracking-[0.18em]" data-room-code={net.code}>
          {net.code}
        </h1>
        <Button
          variant="ghost"
          size="iconSm"
          className="max-xl:size-11"
          data-copy-link
          aria-label={copied ? tt("lobby.copy") : tt("lobby.copyLink")}
          title={net.isPrivate && net.password ? tt("lobby.copyBoth") : tt("lobby.copyLink")}
          onClick={copyLink}
        >
          {copied ? <Check className="size-4 text-good" /> : <Copy className="size-4" />}
        </Button>
        {isHost && net.isPrivate ? (
          editingPassword ? (
            /* Карандаш раскрыл правку: 4 цифры, Enter или потеря фокуса. */
            <form
              className="flex items-center gap-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                void savePassword();
              }}
            >
              <input
                value={passwordDraft}
                onChange={(e) => {
                  setPasswordDraft(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setPasswordState(null);
                }}
                onBlur={() => void savePassword()}
                onKeyDown={(e) => {
                  // Esc — отмена правки без сохранения (как у имени места).
                  if (e.key === "Escape") {
                    setEditingPassword(false);
                    setPasswordDraft("");
                    setPasswordState(null);
                  }
                }}
                inputMode="numeric"
                maxLength={4}
                autoFocus
                placeholder={tt("menu.digits4")}
                aria-label={tt("lobby.passwordNew")}
                className="h-11 w-24 rounded-[var(--radius-md)] border border-border bg-surface px-3 font-display text-sm tracking-[0.2em] tabular-nums text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              />
              <Button
                type="submit"
                variant="secondary"
                className="max-xl:h-11"
                disabled={savingPassword || passwordDraft.length !== 4}
              >
                <Check className="size-4" />
                {tt("common.save")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                className="max-xl:size-11"
                aria-label={tt("lobby.passwordCancelAria")}
                onClick={() => {
                  setEditingPassword(false);
                  setPasswordDraft("");
                  setPasswordState(null);
                }}
              >
                <X className="size-4" />
              </Button>
            </form>
          ) : (
            <>
              {/* Пароль по умолчанию скрыт точками; клик по чипу показывает
                  цифры, повторный — прячет. Пароль знает только хост. */}
              <button
                type="button"
                data-room-password
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? tt("lobby.passwordHide") : tt("lobby.passwordShow")}
                title={tt("lobby.passwordTitle")}
                className={cn(
                  TOGGLE_BASE,
                  "rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 font-display text-sm tracking-[0.2em] tabular-nums text-fg hover:bg-surface-2",
                )}
              >
                {showPassword ? (net.password ?? "····") : "••••"}
              </button>
              <Button
                variant="ghost"
                size="iconSm"
                className="max-xl:size-11"
                aria-label={tt("lobby.passwordChangeAria")}
                title={tt("lobby.passwordChangeTitle")}
                onClick={() => {
                  setEditingPassword(true);
                  setShowPassword(true);
                  setPasswordDraft("");
                  setPasswordState(null);
                }}
              >
                <Pencil className="size-4" />
              </Button>
            </>
          )
        ) : null}
        {/* Приватность — иконкой замка рядом с паролем: закрытый подсвечен. */}
        {isHost ? (
          <Button
            variant="ghost"
            size="iconSm"
            className={cn("max-xl:size-11", net.isPrivate ? "text-accent" : "text-muted")}
            aria-pressed={net.isPrivate}
            aria-label={net.isPrivate ? tt("lobby.privacyOnAria") : tt("lobby.privacyOffAria")}
            title={net.isPrivate ? tt("lobby.privacyOnTitle") : tt("lobby.privacyOffTitle")}
            onClick={() => {
              setEditingPassword(false);
              void netSetRoomPrivacy(!net.isPrivate);
            }}
          >
            {net.isPrivate ? <Lock className="size-4" /> : <LockOpen className="size-4" />}
          </Button>
        ) : null}
      </div>
      {/* Обратная связь одной строкой под кодом: «Скопировано» и статус пароля.
          Строка зарезервирована всегда (min-h) — появление текста не сдвигает
          карточку мест под кодом стола. */}
      <p
        role="status"
        className={cn(
          "min-h-4 text-center text-xs",
          passwordState && !copied && passwordState.kind === "err" ? "text-clay" : "text-good",
        )}
      >
        {copied
          ? net.isPrivate && net.password
            ? tt("lobby.copiedBoth")
            : tt("lobby.copy")
          : passwordState?.text ?? ""}
      </p>

      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5">
        <SeatList
          seats={net.seats}
          capacity={net.capacity}
          mySeat={net.seat}
          hostSeat={net.hostSeat}
          canManage={isHost}
          onKick={(seat) => setKick({ kind: "seat", seat: seat.seat, name: seat.name })}
          onTransfer={(seat) => setTransfer(seat)}
          onRename={(name) => {
            // Локальная копия имени — чтобы форма входа и зрительский вход
            // предлагали новое имя; на сервере его закрепит netSetName.
            saveName(name);
            void netSetName(name);
          }}
          // Цвет меняется только в лобби (до старта): по нему потом красятся
          // секция игрока на столе и имя в чате.
          onColor={(color) => void netSetColor(color)}
        />

        {net.waiters.length ? (
          <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-bg/50 p-3">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <Clock className="size-4" />
              {tt("lobby.waiters", { n: net.waiters.length })}
            </h3>
            <ul className="space-y-1.5">
              {net.waiters.map((w, i) => (
                <li
                  key={`${w.name}-${w.at}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-5 shrink-0 text-center font-display text-xs tabular-nums text-muted">
                      {i + 1}
                    </span>
                    <span className="min-w-0 truncate text-fg">{w.name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted">
                    <WaitingTime at={w.at} />
                    {isHost ? (
                      <Button
                        variant="ghost"
                        size="iconSm"
                        className="max-xl:size-11 text-clay hover:text-danger"
                        aria-label={tt("lobby.waiterRemoveAria", { name: w.name })}
                        title={tt("lobby.waiterRemoveTitle")}
                        onClick={() => setKick({ kind: "waiter", index: i, name: w.name })}
                      >
                        <X className="size-4" />
                      </Button>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Наблюдатели: зрители видят стол и пишут в чат, мест не занимают. */}
        {net.spectators.length ? (
          <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-bg/50 p-3">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <Eye className="size-4" />
              {tt("lobby.spectators", { n: net.spectators.length })}
            </h3>
            <ul className="space-y-1.5">
              {net.spectators.map((s) => (
                <li key={s.name} className="flex items-center gap-2 text-sm text-fg">
                  <span className="size-2 shrink-0 rounded-full bg-accent/60" />
                  <span className="min-w-0 truncate">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

      </div>
      <p className="text-center text-xs text-subtle">{tt("lobby.inviteHint")}</p>
      {net.error ? (
        <p className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-clay/40 bg-clay/10 px-3 py-2 text-sm text-clay" role="status">
          <span>{net.error}</span>
          <Button variant="ghost" size="sm" onClick={clearNetError}>
            {tt("common.gotIt")}
          </Button>
        </p>
      ) : null}
      </div>

      {/* ── Вторая колонка: настройки партии и старт ── */}
      <div className="flex w-full flex-col gap-3 lg:h-full lg:overflow-y-auto lg:pr-1">
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-6">
        <div className="border-border">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
            <Settings2 className="size-4" />
            {tt("lobby.settings")}
          </h3>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-muted">{tt("lobby.modules")}</p>
            <div className="grid grid-cols-2 gap-2">
              {MODULE_OPTIONS.map(([key, labelKey, hintKey]) => {
                const on = Boolean(modules[key]);
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!isHost}
                    aria-pressed={on}
                    title={isHost ? tt(hintKey) : tt("lobby.hostOnly")}
                    onClick={() => toggleModule(key)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-left text-xs leading-tight disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:text-sm",
                      on ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2",
                    )}
                  >
                    {/* Без truncate: на узкой карточке подпись переносится,
                        а не превращается в «Трава и г…». */}
                    <span className="min-w-0">{tt(labelKey)}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                        on ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted",
                      )}
                    >
                      {on ? tt("common.on") : tt("common.off")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-muted">{tt("lobby.difficulty")}</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(DIFF_KEYS) as Difficulty[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  disabled={!isHost}
                  title={isHost ? undefined : tt("lobby.hostOnly")}
                  onClick={() => pickDifficulty(id)}
                  className={cn(
                    "h-11 rounded-[var(--radius-md)] border text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    difficulty === id
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-bg text-fg hover:bg-surface-2",
                  )}
                >
                  {tt(DIFF_KEYS[id])}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs text-muted">{tt("lobby.deckSize")}</p>
            <div className="mb-2 grid grid-cols-3 gap-2">
              {deckPresets.map(([n, label]) => (
                <button
                  key={label}
                  type="button"
                  disabled={!isHost}
                  title={isHost ? undefined : tt("lobby.hostOnly")}
                  onClick={() => pickDeck(n)}
                  className={cn(
                    "h-11 rounded-[var(--radius-md)] border text-xs font-medium disabled:cursor-not-allowed sm:h-10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    deckNow === n
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-bg text-fg hover:bg-surface-2",
                  )}
                >
                  {tt(label)} <span className="tabular-nums opacity-70">{n}</span>
                </button>
              ))}
            </div>
            <input
              type="range"
              min={20}
              max={deckFull}
              step={1}
              value={deckNow}
              disabled={!isHost}
              onChange={(e) => pickDeck(Number(e.target.value))}
              aria-label={tt("lobby.deckSize")}
              className="range-evo w-full disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="mt-1.5 text-xs text-subtle">
              {tt("lobby.deckInfo", {
                n: deckNow,
                years: estimateYears(deckNow, Math.max(net.capacity, 2)),
              })}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-1.5 text-xs text-muted">
            {tt("lobby.seats")}
            {!isHost ? tt("lobby.seatsHost") : ""}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {CAPACITIES.map((n) => (
              <button
                key={n}
                type="button"
                disabled={!isHost}
                title={isHost ? undefined : tt("lobby.hostOnly")}
                onClick={() => void netSetCapacity(n)}
                className={cn(
                  "h-11 rounded-[var(--radius-md)] border text-sm font-medium disabled:cursor-not-allowed sm:h-10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  net.capacity === n
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg text-fg hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-subtle">{tt("lobby.seatsHint")}</p>

          {isHost ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">{tt("lobby.bots")}</span>
              <Button
                variant="secondary"
                size="icon"
                aria-label={tt("lobby.botRemove")}
                disabled={bots === 0}
                onClick={() => void netAddBots(-1)}
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-6 text-center font-display text-lg tabular-nums">{bots}</span>
              <Button
                variant="secondary"
                size="icon"
                aria-label={tt("lobby.botAdd")}
                disabled={net.seats.length >= net.capacity}
                onClick={() => void netAddBots(+1)}
              >
                <Plus className="size-4" />
              </Button>
              <span className="text-xs text-subtle">{tt("lobby.botsHint")}</span>
            </div>
          ) : null}
        </div>

        {/* На телефоне кнопки крупнее (тап-таргет ≥48px): flex-1 в колонке
            вырождает высоту в контентную, поэтому до sm выключаем гибкость
            и задаём высоту явно. */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            className="flex-1 max-lg:h-14 max-sm:flex-none"
            size="md"
            disabled={!isHost || !full || humans.length < 1}
            title={!isHost ? tt("lobby.startHostTitle") : !full ? tt("lobby.startFullTitle") : undefined}
            // data-start-game: стабильный селектор для QA (кнопка меняет
            // подпись при смене языка — «Начать год» / «Start year»).
            data-start-game=""
            onClick={() => void netStart()}
          >
            <Play className="size-4" />
            {tt("lobby.start")}
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="max-lg:h-14"
            onClick={leaveNet}
          >
            <LogOut className="size-4" />
            {tt("lobby.leave")}
          </Button>
        </div>
        {startHint ? (
          <p className="mt-2 text-center text-xs text-subtle" role="status">
            {startHint}
          </p>
        ) : null}
        </div>
      </div>

      {/* ── Третья колонка: чат стола тем же компонентом, что журнал в игре ── */}
      <div className="hidden lg:flex lg:h-full lg:min-h-0 lg:flex-col">
        <EventFeed
          variant="panel"
          items={chatItems}
          open
          onToggle={() => {}}
          title={tt("chat.title")}
          onSend={(text) => void sendChat(text)}
          quickPhrases={chatPhrases(tt)}
          onReact={(item, emoji) => reactToItem(sendReaction, item, emoji)}
          onTyping={sendTyping}
          typingNames={typingNames}
        />
      </div>
      </div>

      {/* Мобилка: чат открывается кнопкой снизу — раньше его тут не было вовсе.
          pb-safe: на телефонах с жестовой полосой кнопка не прилипает к краю. */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label={tt("chat.open")}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg shadow-[var(--shadow-card)] lg:hidden"
      >
        <Send className="size-4" />
        {tt("chat.button")}
        {unreadChat > 0 ? (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg">
            {unreadChat > 99 ? "99+" : unreadChat}
          </span>
        ) : null}
      </button>
      {chatOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg/80 p-3 lg:hidden" onClick={() => setChatOpen(false)}>
          <div className="flex min-h-0 flex-1 flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <Button variant="secondary" size="md" onClick={() => setChatOpen(false)}>
                <X className="size-4" />
                {tt("chat.close")}
              </Button>
            </div>
            <EventFeed
              variant="panel"
              items={chatItems}
              open
              onToggle={() => {}}
              title={tt("chat.title")}
              onSend={(text) => void sendChat(text)}
              quickPhrases={chatPhrases(tt)}
              onReact={(item, emoji) => reactToItem(sendReaction, item, emoji)}
              onTyping={sendTyping}
              typingNames={typingNames}
            />
          </div>
        </div>
      ) : null}

      {kick ? (
        <ConfirmDialog
          title={kick.kind === "seat" ? tt("lobby.kickSeat.title") : tt("lobby.kickWaiter.title")}
          body={
            kick.kind === "seat"
              ? tt("lobby.kickSeat.body", { name: kick.name })
              : tt("lobby.kickWaiter.body", { name: kick.name })
          }
          confirmLabel={tt("lobby.kickConfirm")}
          tone="danger"
          onConfirm={() => {
            if (kick.kind === "seat") void netKick(kick.seat);
            else void netKickWaiter(kick.index);
            setKick(null);
          }}
          onClose={() => setKick(null)}
        />
      ) : null}

      {transfer ? (
        <ConfirmDialog
          title={tt("lobby.transfer.title")}
          body={tt("lobby.transfer.body", { name: transfer.name })}
          confirmLabel={tt("lobby.transfer.confirm")}
          onConfirm={() => {
            void netTransferHost(transfer.seat);
            setTransfer(null);
          }}
          onClose={() => setTransfer(null)}
        />
      ) : null}
    </div>
  );
}

/**
 * Экран ожидающего: места заняты, но очередь видна и автоматически рассосётся.
 * Кнопка «Занять место» — страховка на случай, если авто-занятие не сработало.
 */
function WaitingRoom() {
  const tt = useT();
  const net = useGameStore((s) => s.net);
  const netLeaveQueue = useGameStore((s) => s.netLeaveQueue);
  const netClaimSeat = useGameStore((s) => s.netClaimSeat);
  const sendChat = useGameStore((s) => s.sendChat);
  const sendReaction = useGameStore((s) => s.sendReaction);
  const sendTyping = useGameStore((s) => s.sendTyping);
  const clearNetError = useGameStore((s) => s.clearNetError);
  // Тот же чат, что в игре и лобби: чат стола плюс системные события состава.
  const chatItems = useTableFeedItems(net);
  const typingNames = useTypingNames(net);
  // Очередь могла кончиться (место занято) — кадр придёт из сессии; до него
  // не рисуем ничего, экран ожидания вернётся вместе с состоянием.
  if (!net) return null;

  const occupied = new Set(net.seats.map((s) => s.seat));
  let freeSeat: number | null = null;
  for (let i = 0; i < net.capacity; i++) {
    if (!occupied.has(i)) {
      freeSeat = i;
      break;
    }
  }
  const position = net.waiterPosition;

  return (
    <div className="flex min-h-dvh flex-col">
      <NetTopBar subtitle={tt("wait.subtitle")} />
      {/* Как в лобби: карточка очереди и колонка чата ограничены высотой
          экрана. Длинная переписка скроллится внутри панели и не растит
          страницу; на телефоне чат получает ячейку фиксированной высоты.
          lg:flex-[1_1_0px] — см. лобби: процентный базис вырождался в
          content-sizing и чат тянул высоту всей страницы. */}
      <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-5 px-4 py-6 lg:h-[calc(100dvh-3.5rem)] lg:flex-[1_1_0px] lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:overflow-hidden">
      <div className="flex w-full flex-col gap-3 lg:h-full lg:overflow-y-auto lg:pr-1">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
        {tt("wait.subtitle")}
      </p>
      <h1 className="text-center font-display text-4xl tracking-[0.18em]" data-room-code={net.code}>
        {net.code}
      </h1>

      <div className="mt-5 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7">
        {net.waitNote ? (
          <p
            data-wait-note
            className="mb-4 rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 px-3 py-2 text-center text-sm text-fg"
            role="status"
          >
            {net.waitNote}
          </p>
        ) : null}
        <div className="rounded-[var(--radius-md)] border border-border bg-bg px-3 py-3 text-center">
          <p className="text-sm text-muted">
            {position ? <>{tt("wait.position", { place: position })}</> : tt("wait.inQueue")}
          </p>
        </div>

        {net.waiters.length ? (
          <div className="mt-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <Clock className="size-4" />
              {tt("wait.queue", { n: net.waiters.length })}
            </h3>
            <ul className="space-y-1.5">
              {net.waiters.map((w, i) => {
                const isMe = position === i + 1;
                return (
                  <li
                    key={`${w.name}-${w.at}-${i}`}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm",
                      isMe ? "border-accent bg-accent/10" : "border-border bg-bg",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="w-5 shrink-0 text-center font-display text-xs tabular-nums text-muted">
                        {i + 1}
                      </span>
                      <span className="min-w-0 truncate text-fg">
                        {w.name}
                        {isMe ? (
                          <span className="ml-1 text-[10px] uppercase tracking-wide text-muted">{tt("seat.you")}</span>
                        ) : null}
                      </span>
                    </span>
                    <WaitingTime at={w.at} />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="mt-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
            <Users className="size-4" />
            {tt("wait.atTable")}
          </h3>
          <SeatList
            seats={net.seats}
            capacity={net.capacity}
            mySeat={net.seat}
            hostSeat={net.hostSeat}
            canManage={false}
          />
        </div>

        {net.error ? (
          <p className="mt-3 flex items-center justify-between gap-2 text-sm text-clay" role="status">
            <span>{net.error}</span>
            <Button variant="ghost" size="sm" onClick={clearNetError}>
              {tt("common.gotIt")}
            </Button>
          </p>
        ) : null}

        {/* Крупнее на телефоне — см. те же кнопки в лобби. */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            className="flex-1 max-lg:h-14 max-sm:flex-none"
            size="md"
            disabled={freeSeat === null}
            title={freeSeat === null ? tt("wait.claimNone") : tt("wait.claimOk")}
            onClick={() => void netClaimSeat()}
          >
            <Play className="size-4" />
            {tt("wait.claim")}
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="max-lg:h-14"
            onClick={() => void netLeaveQueue()}
          >
            <LogOut className="size-4" />
            {tt("wait.leave")}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-subtle">{tt("wait.hint")}</p>
      </div>
      </div>

      {/* Чат стола: на десктопе — вторая колонка на всю высоту, на телефоне —
          ячейка фиксированной высоты под карточкой. Список скроллится внутри,
          композер прибит снизу: 50+ сообщений не растягивают страницу. */}
      <div className="flex h-[min(55dvh,26rem)] w-full min-h-0 flex-col lg:col-start-2 lg:row-start-1 lg:h-full">
        <EventFeed
          variant="panel"
          items={chatItems}
          open
          onToggle={() => {}}
          title={tt("chat.title")}
          onSend={(text) => void sendChat(text)}
          quickPhrases={chatPhrases(tt)}
          onReact={(item, emoji) => reactToItem(sendReaction, item, emoji)}
          onTyping={sendTyping}
          typingNames={typingNames}
        />
      </div>
      </div>
    </div>
  );
}
