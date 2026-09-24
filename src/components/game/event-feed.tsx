import { ArrowDown, ChevronLeft, ChevronRight, Dices, Send, SmilePlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { REACTION_EMOJI, type ReactionEmoji, type ReactionMessage } from "@/lib/net/shared";
import { useGameStore, type ReactionFailure } from "@/store/game-store";
import { translate, useLang, useT, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Тип записи ленты: системная, действие игрока, важное событие или реплика чата. */
export type FeedKind = "system" | "action" | "important" | "chat";

/**
 * Агрегат реакций под одной записью: сколько и какие эмодзи поставили.
 * `mine` — реакция поставлена мной (чип подсвечен, повторный клик снимает).
 * Данные готовы для серверной привязки реакции к сообщению — см. отчёт волны.
 */
export interface FeedReaction {
  emoji: ReactionEmoji;
  count: number;
  mine?: boolean;
}

export interface FeedItem {
  id: string;
  kind: FeedKind;
  text: string;
  /** Кто автор — для действий и чата. */
  playerName?: string;
  /** CSS-цвет игрока (опционально). */
  color?: string;
  /** Время события в миллисекундах. */
  at?: number;
  /** Место автора в сетевом столе: 0..7 — игроки, -1 — ожидающие, -2 — зрители.
   *  Заполняют продюсеры ленты (игра, лобби, очередь); нужен для фильтра. */
  seat?: number;
  /** id реплики чата (ChatMessage.id): по нему реакция ложится под сообщение. */
  chatId?: number;
  /** Уже поставленные реакции (агрегаты): чипы под текстом записи. */
  reactions?: FeedReaction[];
}

export interface EventFeedProps {
  /** Записи в хронологическом порядке: старые сверху. */
  items: FeedItem[];
  open: boolean;
  onToggle: (open: boolean) => void;
  /** Есть обработчик — показываем поле ввода и быстрые фразы (чат). */
  onSend?: (text: string) => void;
  /** Есть обработчик — у реплик появляется кнопка реакции и чипы. */
  onReact?: (item: FeedItem, emoji: ReactionEmoji) => void;
  /**
   * Сигнал «печатает…» при вводе непустого текста. Троттлинг — на стороне
   * сессии, компонент зовёт его на каждое изменение черновика.
   */
  onTyping?: () => void;
  /**
   * Имена тех, кто печатает прямо сейчас (без меня). Строка над композером
   * гаснет сама: сервер снимает метку через ~4 с тишины.
   */
  typingNames?: string[];
  /** Быстрые фразы кнопками-чипами над полем ввода. */
  quickPhrases?: string[];
  title?: string;
  titleId?: string;
  /** dock — док с рельсом и мобильной шторкой (игра); panel — встроенная
   *  панель на всю высоту родителя (колонка чата в лобби и ожидающем столе). */
  variant?: "dock" | "panel";
  className?: string;
}

type FeedFilter = "all" | "log" | "chat" | "spectators";

/** Место зрителя в сетевом столе (см. seat в FeedItem). */
const SPECTATOR_SEAT = -2;

/** Окно, в котором подряд идущие реплики одного автора считаются одним блоком. */
const GROUP_WINDOW_MS = 3 * 60 * 1000;
/** Сервер режет чат до 400 символов; поле показывает тот же лимит до отправки. */
const CHAT_MAX_LENGTH = 400;

/**
 * Мягкая подложка реплики: цвет автора, подмешанный к фону поверхностей, —
 * та же формула, что у секции игрока в партии (`seatTint` в game-app.tsx).
 * Экспортируется, чтобы лента и табло красились одинаково из одного места.
 */
export function feedTint(color: string): string {
  return `color-mix(in oklab, ${color} 12%, var(--color-surface))`;
}

/**
 * Сдвиг листа бумаги на реплике: строки одного блока красятся одним цветом и
 * без сдвига каждая начинала бы текстуру с одного и того же угла тайла — бумага
 * выглядела бы штампованной. Сдвиг детерминирован по id записи, поэтому
 * перерисовки и SSR его не меняют. 380px — размер тайла paper-sheet.
 */
function textureShift(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `${h % 380}px ${(h >>> 9) % 380}px`;
}

/**
 * Скругление строки «карточки автора»: внешние углы блока — у первой строки
 * сверху, у последней снизу; продолжения внутри блока прямые, чтобы подряд
 * идущие реплики срастались в один лист.
 */
function blockRadius(grouped: boolean, tail: boolean): string {
  if (!grouped) return tail ? "rounded-[var(--radius-sm)]" : "rounded-t-[var(--radius-sm)] rounded-b-none";
  return tail ? "rounded-b-[var(--radius-sm)] rounded-t-none" : "rounded-none";
}

const KIND_CLASS: Record<FeedKind, string> = {
  // Системные записи — самая тихая строка ленты: мельче, курсивом, без подложки.
  system: "italic text-subtle",
  action: "text-fg",
  important: "border-l-2 border-accent bg-accent/10 font-medium text-fg",
  chat: "text-fg",
};

/** Уважаем системную настройку «меньше движения». */
function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Прокрутка к последней записи; плавно — только если движение не запрещено. */
function scrollToEnd(el: HTMLElement, smooth: boolean) {
  if (smooth) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  else el.scrollTop = el.scrollHeight;
}

function timeLabel(at: number, lang: Lang): string {
  // en-GB даёт те же 24-часовые часы, что и ru-RU — формат времени не меняется.
  return new Date(at).toLocaleTimeString(lang === "en" ? "en-GB" : "ru-RU", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Высота нижнего дока (footer игры) — мобильная шторка не должна его накрывать:
 * в фазе развития док высокий из-за карты руки. Меряем при раскрытии, при
 * ресайзе окна и при изменении самого футера (смена фазы, модулей, вёрстки).
 */
function useDockInset(active: boolean): number {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    if (!active || typeof window === "undefined") return;
    const measure = () => {
      const footer = document.querySelector("footer");
      const h = footer ? window.innerHeight - footer.getBoundingClientRect().top : 0;
      setInset(h > 0 ? Math.round(h) : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    const footer = document.querySelector("footer");
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    if (ro && footer) ro.observe(footer);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [active]);
  return inset;
}

/**
 * Запись для рендера: `grouped` — продолжение блока того же автора (без ника
 * и времени), `tail` — последняя строка блока. По этой паре строка знает своё
 * место в «карточке автора»: скругляются только внешние углы блока.
 */
interface FeedRowView {
  item: FeedItem;
  grouped: boolean;
  tail: boolean;
}

/**
 * Группировка подряд идущих реплик одного автора (по имени и месту) в пределах
 * GROUP_WINDOW_MS: ник и время показывает только первая строка блока, дальше —
 * плотный список без повторов. Любая не-чатовая запись блок разрывает.
 */
function groupItems(items: FeedItem[]): FeedRowView[] {
  const rows: FeedRowView[] = [];
  for (const item of items) {
    const prev = rows[rows.length - 1]?.item;
    const continues =
      prev !== undefined &&
      prev.kind === "chat" &&
      item.kind === "chat" &&
      Boolean(item.playerName) &&
      prev.playerName === item.playerName &&
      prev.seat === item.seat &&
      prev.at !== undefined &&
      item.at !== undefined &&
      item.at >= prev.at &&
      item.at - prev.at <= GROUP_WINDOW_MS;
    rows.push({ item, grouped: continues, tail: true });
  }
  // Хвост блока: строка, за которой продолжения нет, — нижний край карточки
  // автора (у неё скругляются нижние углы).
  for (let i = 0; i < rows.length - 1; i++) {
    if (rows[i + 1]!.grouped) rows[i]!.tail = false;
  }
  return rows;
}

/** Локально выбранное состояние своей реакции, независимое от серверного агрегата. */
type LocalReactionState = Partial<Record<ReactionEmoji, boolean>>;

/**
 * Свести серверный агрегат с локальным toggle. Пока сервер не умеет удалять
 * реакцию, ложное «mine» маскируется только у одного автора: из чужого
 * счётчика вычитается ровно одна строка, а остальные сохраняются.
 */
function mergeReactions(
  have: FeedReaction[] | undefined,
  desired: LocalReactionState,
): FeedReaction[] {
  const merged = new Map<ReactionEmoji, FeedReaction>();
  for (const reaction of have ?? []) {
    const wanted = desired[reaction.emoji];
    const mine = wanted ?? Boolean(reaction.mine);
    const count = Math.max(
      0,
      reaction.count +
        (wanted === undefined ? 0 : Number(wanted) - Number(Boolean(reaction.mine))),
    );
    if (count > 0) merged.set(reaction.emoji, { emoji: reaction.emoji, count, mine });
  }
  for (const [emoji, wanted] of Object.entries(desired) as [ReactionEmoji, boolean][]) {
    if (!wanted || merged.has(emoji)) continue;
    merged.set(emoji, { emoji, count: 1, mine: true });
  }
  return [...merged.values()];
}

/**
 * Агрегат реакций по сообщениям: chatId → список эмодзи с числом и «моя ли».
 * Сервер отдаёт реакции потоком (дельты по sinceReactionId), поэтому сводку
 * по конкретной реплике собираем здесь: чипы под сообщением должны показывать
 * все реакции на него, а не последние 30 событий стола.
 * `myName` — моё имя за столом (у реакций нет места, только имя автора).
 */
export function reactionsByChatId(
  reactions: ReactionMessage[] | undefined,
  myName: string | null | undefined,
): Map<number, FeedReaction[]> {
  const acc = new Map<number, Map<ReactionEmoji, { count: number; mine: boolean }>>();
  for (const r of reactions ?? []) {
    if (r.chatId === null || r.chatId === undefined) continue; // «в стол»/игроку
    let byEmoji = acc.get(r.chatId);
    if (!byEmoji) {
      byEmoji = new Map();
      acc.set(r.chatId, byEmoji);
    }
    const cur = byEmoji.get(r.emoji);
    const mine = Boolean(myName) && r.name === myName;
    if (cur) {
      cur.count += 1;
      cur.mine = cur.mine || mine;
    } else {
      byEmoji.set(r.emoji, { count: 1, mine });
    }
  }
  const out = new Map<number, FeedReaction[]>();
  for (const [chatId, byEmoji] of acc) {
    out.set(
      chatId,
      [...byEmoji].map(([emoji, v]) => ({ emoji, count: v.count, ...(v.mine ? { mine: true } : {}) })),
    );
  }
  return out;
}

/**
 * Строка «кто печатает» над композером: один — «Аня печатает…», двое — по
 * именам, трое и больше — без перечисления (иначе строка не влезает).
 * Локализация — по явному языку (в рендере передавайте снапшот useLang()).
 */
export function typingLabel(names: string[] | undefined, lang: Lang): string {
  const list = names ?? [];
  if (!list.length) return "";
  if (list.length === 1) return translate(lang, "feed.typingOne", { name: list[0]! });
  if (list.length === 2) return translate(lang, "feed.typingTwo", { a: list[0]!, b: list[1]! });
  return translate(lang, "feed.typingMany");
}

/**
 * Одна запись ленты: время, автор и текст в оформлении по типу.
 *
 * Реплики чата лежат на «карточке автора» — как табло игрока в партии:
 * подложка цветом автора (feedTint) плюс бумажная текстура paper-sheet
 * (background-blend-mode: overlay смешивает её с подложкой). Продолжение
 * блока того же автора (`grouped`) не повторяет ник и время, прижимается к
 * предыдущей строке и прямое по углам — блок срастается в один лист,
 * скруглённый только на краях (`tail` — нижний край). Системные записи —
 * мелкой тихой строкой с точкой.
 */
function FeedRow({
  item,
  grouped,
  tail,
  onReact,
  reactionFailure,
}: {
  item: FeedItem;
  grouped: boolean;
  tail: boolean;
  onReact?: ((emoji: ReactionEmoji) => void) | undefined;
  reactionFailure: ReactionFailure | null;
}) {
  const rowRef = useRef<HTMLLIElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const t = useT();
  const lang = useLang();
  // Локальный (оптимистичный) слой реакций: своя реакция видна сразу, ещё до
  // появления серверной привязки реакции к сообщению (контракт — в отчёте).
  const [localReactions, setLocalReactions] = useState<LocalReactionState>({});
  const isChat = item.kind === "chat";
  const canReact = Boolean(onReact) && isChat;
  const tint = isChat && item.color ? feedTint(item.color) : undefined;
  const chips = mergeReactions(item.reactions, localReactions);

  // Сервер отклонил оптимистичную реакцию: возвращаем строку к серверному
  // агрегату. Чужие реакции и счётчик под ними при этом не меняются.
  useEffect(() => {
    if (!reactionFailure || reactionFailure.chatId !== item.chatId) return;
    setLocalReactions((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, reactionFailure.emoji)) return prev;
      const next = { ...prev };
      delete next[reactionFailure.emoji];
      return next;
    });
  }, [item.chatId, reactionFailure]);

  // Палитра реакций закрывается кликом вне строки и по Esc.
  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (event: PointerEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) setPickerOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPickerOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pickerOpen]);

  const react = (emoji: ReactionEmoji) => {
    setPickerOpen(false);
    if (useGameStore.getState().net?.sending) return;
    const visible = chips.find((reaction) => reaction.emoji === emoji);
    if (visible?.mine) {
      setLocalReactions((prev) => ({ ...prev, [emoji]: false }));
      return;
    }
    // Серверный контракт умеет только INSERT. Если строка уже есть, повторный
    // клик возвращает локальную видимость без нового POST — иначе появился бы дубль.
    if (item.reactions?.some((reaction) => reaction.emoji === emoji && reaction.mine)) {
      setLocalReactions((prev) => ({ ...prev, [emoji]: true }));
      return;
    }
    setLocalReactions((prev) => ({ ...prev, [emoji]: true }));
    onReact?.(emoji);
  };

  return (
    <li
      ref={rowRef}
      data-feed-item={item.kind}
      data-author={item.playerName}
      className={cn(
        // Сетка «время | текст»: у сгруппированных строк первая колонка пустая,
        // поэтому текст остаётся выровненным по тексту первой реплики блока.
        "feed-item-in group relative grid grid-cols-[2.6rem_minmax(0,1fr)] items-start gap-x-1.5 px-2 text-xs",
        item.kind === "system" ? "py-0.5 text-[10px] leading-4" : grouped ? "py-0.5" : "py-1",
        KIND_CLASS[item.kind],
        canReact && "pr-12 xl:pr-7",
        // Подложка «как в игре»: у реплики с цветом автора — бумажная текстура
        // paper-sheet поверх подложки цветом (inline backgroundColor ниже,
        // blend-mode overlay смешивает лист с цветом — та же пара, что у табло
        // игрока в партии). Реплика без цвета — прежняя нейтральная подложка.
        tint && "paper-sheet",
        isChat && !tint && "bg-surface-2/60",
        // Скругления карточки автора — только внешние углы блока.
        tint ? blockRadius(grouped, tail) : "rounded-[var(--radius-sm)]",
        // Отступ сверху: новая запись отходит от предыдущей, а продолжение
        // цветного блока прижато вплотную — блок читается единым листом.
        !(grouped && tint) && "mt-1",
      )}
      style={
        tint
          ? { backgroundColor: tint, backgroundPosition: textureShift(item.id) }
          : undefined
      }
    >
      {!grouped && item.at ? (
        <time
          dateTime={new Date(item.at).toISOString()}
          className="mt-px font-mono text-[10px] leading-4 text-subtle tabular-nums"
        >
          {timeLabel(item.at, lang)}
        </time>
      ) : (
        <span aria-hidden />
      )}
      <span className="flex min-w-0 flex-col">
        <span className="min-w-0 break-words">
          {item.kind === "system" ? (
            // Тихая точка-маркер: системная запись не должна спорить с репликами.
            <span aria-hidden className="mr-1.5 inline-block size-1 rounded-full bg-subtle/80 align-middle" />
          ) : null}
          {!grouped && item.playerName ? (
            <span className="font-medium" style={item.color ? { color: item.color } : undefined}>
              {item.playerName}
              {isChat ? ": " : " — "}
            </span>
          ) : null}
          {item.text}
        </span>
        {chips.length ? (
          <span className="mt-0.5 flex flex-wrap items-center gap-1">
            {chips.map((r) => (
              <button
                key={r.emoji}
                type="button"
                aria-pressed={Boolean(r.mine)}
                aria-label={t("game.reactionCount", { emoji: r.emoji, n: r.count })}
                disabled={!canReact}
                onClick={() => react(r.emoji)}
                className={cn(
                  "inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border px-2 text-xs leading-none transition-colors duration-[var(--motion-fast)] xl:h-5 xl:min-w-5 xl:gap-0.5 xl:px-1.5 xl:text-[10px]",
                  r.mine
                    ? "border-accent bg-accent/15 text-fg"
                    : "border-border bg-surface/80 text-muted hover:bg-surface-2",
                )}
              >
                <span className="text-xs leading-none">{r.emoji}</span>
                {r.count > 1 ? <span className="tabular-nums">{r.count}</span> : null}
              </button>
            ))}
          </span>
        ) : null}
      </span>
      {canReact ? (
        <>
          <button
            type="button"
            aria-label={t("game.addReaction")}
            title={t("game.reactionTitle")}
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((v) => !v)}
            className={cn(
              // Мышь: кнопка проявляется по наведению. Палец: остаётся видимой.
              // Кнопка реакции на сообщение: палцу — 44px, мыши (xl+) — 24px.
              "absolute right-1 top-1 grid size-11 place-items-center rounded-full text-subtle transition-opacity duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg focus-visible:opacity-100 xl:size-6",
              pickerOpen ? "opacity-100" : "opacity-60 sm:opacity-0 sm:group-hover:opacity-100",
            )}
          >
            <SmilePlus className="size-3.5" />
          </button>
          {pickerOpen ? (
            <div
              role="group"
              aria-label={t("game.reactions")}
              className="absolute right-1 top-12 z-10 flex gap-1 rounded-full border border-border bg-surface p-1 shadow-[var(--shadow-card)] xl:top-7 xl:gap-0.5 xl:p-0.5"
            >
              {REACTION_EMOJI.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={t("game.reactionOf", { emoji })}
                  onClick={() => react(emoji)}
                  className="grid size-11 place-items-center rounded-full text-base leading-none transition-transform duration-[var(--motion-fast)] hover:scale-110 hover:bg-surface-2 xl:size-7"
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </li>
  );
}

/**
 * Единая панель «журнал + чат».
 *
 * Десктоп (xl+): колонка в потоке стола — поле сдвигается раскрытием
 * (плавная анимация ширины). Свёрнутое состояние — узкий рельс справа сверху
 * с кнопкой раскрытия и красной точкой непрочитанного чата.
 *
 * Уже (sm…xl): панель поверх стола справа. Телефон (<sm): полноэкранный
 * «мессенджер» с шапкой и вводом внизу.
 *
 * Внутри: фильтры «Всё/События/Чат» (кнопки, не списки; «Зрители» — только
 * когда зрительские реплики есть в ленте), быстрые фразы, кнопка броска
 * кубика в чат, счётчик непрочитанного и автоскролл.
 */
export function EventFeed({
  items,
  open,
  onToggle,
  onSend,
  onReact,
  onTyping,
  typingNames,
  quickPhrases,
  title,
  titleId,
  className,
  variant = "dock",
}: EventFeedProps) {
  const t = useT();
  const lang = useLang();
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<FeedFilter>("all");
  const titleText = title ?? t("feed.title.default");
  // Непрочитанные — в сторе: бейдж показывается на кнопке журнала в шапке.
  const unread = useGameStore((s) => s.logUnread);
  const setUnread = useGameStore((s) => s.setLogUnread);
  const chatSending = useGameStore((s) => s.net?.sending === "chat");
  const reactionFailure = useGameStore((s) => s.net?.reactionFailure ?? null);
  const [chatUnread, setChatUnread] = useState(false);
  // В доке на широком экране в DOM одновременно живут два списка: колонка xl и
  // (скрытая) мобильная шторка. Один ref указывал бы на последний отрисованный
  // — скрытый, и прокрутка уходила бы в никуда. Поэтому ref'а два, а «живой»
  // список выбираем по фактической высоте: скрытый имеет clientHeight = 0.
  const listRef = useRef<HTMLDivElement>(null);
  const listSheetRef = useRef<HTMLDivElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const pinnedRef = useRef(true);
  const prevCountRef = useRef(items.length);
  // Тексты своих сообщений с временем отправки: по ним лента узнаёт своё
  // сообщение в потоке и прокручивает список вниз в любом случае.
  const ownQueueRef = useRef<Array<{ text: string; at: number; clearDraft: boolean }>>([]);
  // Панель на sm…xl не должна накрывать нижний док (карта руки в развитии).
  const dockInset = useDockInset(open && variant === "dock");

  // Мобильный журнал живёт в потоке после стола, поэтому открытие прокручивает
  // к нему вместо наложения на секции игроков. Esc закрывает шторку, а фокус
  // возвращается на кнопку в шапке, открывшую журнал.
  useEffect(() => {
    if (variant !== "dock") return;
    const wasOpen = wasOpenRef.current;
    if (open && !wasOpen) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    if (!open && wasOpen) {
      requestAnimationFrame(() => {
        const target = returnFocusRef.current;
        if (target?.isConnected) target.focus({ preventScroll: true });
      });
    }
    wasOpenRef.current = open;
    if (!open) return;
    requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 39.999rem)").matches) {
        mobileSheetRef.current?.scrollIntoView({ block: "end" });
      }
    });
  }, [open, onToggle, variant]);

  useEffect(() => {
    if (!open || variant !== "dock") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Открытый ConfirmDialog владеет Escape: журнал под ним не должен
      // закрываться одновременно и перехватывать возврат фокуса.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      event.preventDefault();
      onToggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onToggle, open, variant]);

  /** Живой список ленты: первый из отрисованных, у которого есть высота. */
  const activeList = useCallback((): HTMLDivElement | null => {
    const a = listRef.current;
    if (a && a.clientHeight > 0) return a;
    const b = listSheetRef.current;
    if (b && b.clientHeight > 0) return b;
    return a ?? b;
  }, []);

  const hasSpectators = useMemo(
    () => items.some((i) => i.kind === "chat" && i.seat === SPECTATOR_SEAT),
    [items],
  );
  // Кнопка «Зрители» появляется только когда зрители реально писали в чат.
  const filterDefs: Array<[FeedFilter, string]> = [
    ["all", t("feed.filter.all")],
    ["log", t("feed.filter.log")],
    ["chat", t("feed.filter.chat")],
    ...(hasSpectators ? ([["spectators", t("feed.filter.spectators")]] as Array<[FeedFilter, string]>) : []),
  ];

  // Отфильтровано и сгруппировано: подряд идущие реплики одного автора — блок.
  const rows = useMemo(
    () =>
      groupItems(
        items.filter((i) => {
          if (filter === "all") return true;
          if (filter === "chat") return i.kind === "chat";
          if (filter === "spectators") return i.kind === "chat" && i.seat === SPECTATOR_SEAT;
          return i.kind !== "chat";
        }),
      ),
    [items, filter],
  );

  // Зрители ушли / лента пересоздана — активный фильтр «Зрители» снимаем.
  useEffect(() => {
    if (filter === "spectators" && !hasSpectators) setFilter("all");
  }, [filter, hasSpectators]);

  // Новые записи. Своё сообщение (даже отправленное из верха списка) обязано
  // быть видно — прокручиваем всегда и сразу; чужие ведут скролл, только если
  // список прижат к низу, иначе копим счётчики непрочитанного (чат — точкой).
  useEffect(() => {
    const added = items.length - prevCountRef.current;
    prevCountRef.current = items.length;
    // Своё сообщение ищем по тексту и времени отправки, а не по приросту
    // длины списка: в партии лента ограничена хвостом (140 записей), и при
    // новой реплике её длина может не измениться.
    const queue = ownQueueRef.current;
    let own = false;
    if (queue.length) {
      const now = Date.now();
      const fresh = queue.filter((q) => now - q.at < 60_000);
      const waiting: typeof fresh = [];
      for (const q of fresh) {
        const delivered = items.some(
          (i) => i.kind === "chat" && i.text === q.text && (i.at ?? 0) >= q.at - 2000,
        );
        if (!delivered) {
          waiting.push(q);
          continue;
        }
        own = true;
        if (q.clearDraft) {
          setDraft((current) => (current.trim() === q.text.trim() ? "" : current));
        }
      }
      ownQueueRef.current = waiting;
    }
    if (!own && added <= 0) return;
    if (open && (pinnedRef.current || own)) {
      const el = activeList();
      // Своё сообщение показываем без анимации: оно должно оказаться в кадре
      // сразу, а не доезжать плавным скроллом через весь список.
      if (el) scrollToEnd(el, own ? false : !reducedMotion());
      if (own) {
        pinnedRef.current = true;
        setUnread(0);
      }
      return;
    }
    if (added > 0) {
      setUnread(useGameStore.getState().logUnread + added);
      if (items.slice(-added).some((f) => f.kind === "chat")) setChatUnread(true);
    }
  }, [items, open, setUnread, activeList]);

  // Разворот: сбрасываем счётчики и сразу прыгаем к последней записи.
  useEffect(() => {
    if (!open) return;
    pinnedRef.current = true;
    setUnread(0);
    setChatUnread(false);
    const el = activeList();
    if (el) scrollToEnd(el, false);
  }, [open, setUnread, activeList]);

  const onScroll = useCallback(
    (el: HTMLDivElement) => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 24;
      pinnedRef.current = atBottom;
      if (atBottom) setUnread(0);
    },
    [setUnread],
  );

  const send = (raw: string, clearDraft = true) => {
    const text = raw.trim();
    if (!text || !onSend || useGameStore.getState().net?.sending) return;
    onSend(text);
    // До ACK поле не очищаем: обрыв или серверный отказ не должны уничтожить
    // текст. После появления реплики эффект выше снимет только тот же draft.
    ownQueueRef.current = [
      ...ownQueueRef.current.slice(-4),
      { text, at: Date.now(), clearDraft },
    ];
  };

  const last = items.length ? items[items.length - 1] : undefined;
  const lastText = last
    ? `${last.playerName ? `${last.playerName}: ` : ""}${last.text}`
    : t("feed.emptyTitle");
  const unreadLabel = unread > 99 ? "99+" : String(unread);
  const typingText = typingLabel(typingNames, lang);

  const filters = (
    <div
      role="group"
      aria-label={t("feed.filterGroup")}
      className="flex flex-wrap items-center gap-0.5 rounded-full bg-ink/25 p-0.5"
    >
      {filterDefs.map(([id, label]) => (
        <button
          key={id}
          type="button"
          aria-pressed={filter === id}
          onClick={() => setFilter(id)}
          className={cn(
            // 44px по высоте на телефоне и планшете (палец), 32px на xl+ (мышь);
            // min-w-11 — короткие подписи («Всё», «Chat») не сжимают зону пальца.
            "h-11 min-w-11 rounded-full px-3 text-[11px] font-medium transition-colors duration-[var(--motion-fast)] xl:h-8 xl:min-w-0 xl:px-2.5",
            filter === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const composer = onSend ? (
    // pb-safe: на телефонах с «чёлкой» композер не прилипает к жестовой полосе.
    <div className="border-t border-border px-2.5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* «Печатает…» — над композером. Строка занимает место всегда
          (min-h-4): появление и исчезновение подписи не должно двигать
          список и кнопки. */}
      <p
        data-typing-line
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-4 truncate px-1 text-[10px] leading-4 transition-opacity duration-[var(--motion-fast)]",
          typingText ? "text-subtle opacity-100" : "opacity-0",
        )}
      >
        {typingText}
      </p>
      {quickPhrases?.length ? (
        <div className="mb-1.5 flex flex-wrap gap-1" role="group" aria-label={t("feed.quickPhrases")}>
          {quickPhrases.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => send(phrase, false)}
              disabled={chatSending}
              className="min-h-11 min-w-11 rounded-full border border-border bg-surface px-3 py-1 text-[10px] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg xl:min-h-7 xl:min-w-0 xl:px-2 xl:py-0.5"
            >
              {phrase}
            </button>
          ))}
        </div>
      ) : null}
      <div
        data-chat-counter
        className="mb-1 px-1 text-right text-[10px] leading-3 tabular-nums text-subtle"
      >
        {draft.length}/{CHAT_MAX_LENGTH}
      </div>
      <form
        className="flex items-end gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        {/* Кубик в чат: д6 от имени игрока — весёлый ритуал стола. */}
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          className="max-xl:size-11"
          aria-label={t("feed.diceButton")}
          title={t("feed.diceButton")}
          onClick={() => send(`🎲 ${1 + Math.floor(Math.random() * 6)}`, false)}
          disabled={chatSending}
        >
          <Dices className="size-4" />
        </Button>
        <textarea
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            // «Печатает…» шлём только на непустом черновике: сервер сам
            // сложит метку в нужную таблицу, а троттлинг — в сессии.
            if (next.trim()) onTyping?.();
          }}
          onFocus={(event) => {
            // Экранная клавиатура ужимает вьюпорт: возвращаем поле в кадр,
            // иначе на телефоне ввод чата уезжает под клавиатуру.
            const el = event.currentTarget;
            window.setTimeout(() => el.scrollIntoView({ block: "nearest" }), 250);
          }}
          onKeyDown={(event) => {
            // Enter отправляет, Shift+Enter переносит строку.
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              send(draft);
            }
          }}
          rows={1}
          maxLength={CHAT_MAX_LENGTH}
          placeholder={t("feed.placeholder")}
          aria-label={t("feed.messageAria")}
          className="max-h-20 min-h-11 flex-1 resize-none rounded-[var(--radius-sm)] border border-border bg-bg/60 px-2.5 py-1.5 text-xs leading-5 text-fg placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:min-h-9"
        />
        <Button type="submit" variant="secondary" size="iconSm" className="max-xl:size-11" aria-label={t("feed.send")} disabled={!draft.trim() || chatSending}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  ) : null;

  const list = (heightClass: string, ref: typeof listRef = listRef) => (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={ref}
        onScroll={(event) => onScroll(event.currentTarget)}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label={t("feed.entries", { title: titleText })}
        className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 py-1.5", heightClass)}
      >
        {rows.length ? (
          rows.map(({ item, grouped, tail }) => (
            <FeedRow
              key={item.id}
              item={item}
              grouped={grouped}
              tail={tail}
              reactionFailure={reactionFailure}
              onReact={onReact ? (emoji) => onReact(item, emoji) : undefined}
            />
          ))
        ) : (
          <p className="px-2 py-1 italic text-subtle">{t("feed.empty")}</p>
        )}
      </div>
      {unread > 0 ? (
        <button
          type="button"
          onClick={jumpToLatest}
          aria-label={t("feed.showNew", { n: unread })}
          className="absolute bottom-1.5 right-1.5 z-10 inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-fg shadow-[var(--shadow-card)] transition-colors duration-[var(--motion-fast)] hover:bg-surface-2"
        >
          <ArrowDown className="size-3" />
          {t("feed.newEntries")}
          <span
            aria-hidden
            className="grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-accent-fg"
          >
            {unreadLabel}
          </span>
        </button>
      ) : null}
    </div>
  );

  const jumpToLatest = () => {
    const el = activeList();
    if (el) scrollToEnd(el, !reducedMotion());
    pinnedRef.current = true;
    setUnread(0);
  };

  // ── Панель для лобби: тот же чат и композер, без рельса и шторки ─────────
  if (variant === "panel") {
    return (
      <div
        data-feed-panel
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface",
          className,
        )}
      >
        <header className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border px-2.5 py-2">
          <span id={titleId} tabIndex={titleId ? -1 : undefined} className="min-w-0 flex-1 truncate text-sm font-medium text-muted">{titleText}</span>
          {filters}
        </header>
        {list("text-sm")}
        {composer}
      </div>
    );
  }

  // ── Десктоп (xl+): колонка в потоке стола ────────────────────────────────
  return (
    <>
      <aside
        aria-label={titleText}
        className={cn(
          "relative hidden shrink-0 flex-col overflow-hidden border-l border-border bg-surface/95 backdrop-blur-sm transition-all duration-300 ease-[var(--ease-out)] xl:flex",
          // Высота колонки не больше вьюпорта: длинный чат не растит страницу.
          "xl:h-full xl:max-h-dvh",
          open ? "w-[340px]" : "w-14",
          className,
        )}
      >
        {open ? (
          <>
        <header className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border px-2.5 py-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted">{titleText}</span>
          {filters}
          <button
            type="button"
            onClick={() => onToggle(false)}
            aria-label={t("feed.collapse", { title: titleText })}
            aria-expanded
            className="grid size-7 max-xl:size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] text-subtle transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg"
          >
            <ChevronRight className="size-4" />
          </button>
        </header>
        {list("text-xs")}
        {composer}
      </>
        ) : (
          <div className="flex h-full flex-col items-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => onToggle(true)}
              aria-label={
                unread > 0
                  ? t("feed.expandUnread", { title: titleText, n: unread })
                  : t("feed.expand", { title: titleText })
              }
              aria-expanded={false}
              title={lastText}
              className="relative grid size-10 place-items-center rounded-[var(--radius-md)] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg"
            >
              <ChevronLeft className="size-5" />
              {chatUnread ? (
                <span
                  aria-hidden
                  className="absolute right-1.5 top-1.5 size-2.5 rounded-full border-2 border-surface bg-danger"
                />
              ) : unread > 0 ? (
                <span
                  aria-hidden
                  className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold text-accent-fg"
                >
                  {unreadLabel}
                </span>
              ) : null}
            </button>
          </div>
        )}
      </aside>

      {/* ── Планшет и телефон: на телефоне журнал занимает место после стола,
          на sm…xl — панель справа. Свёрнутой плашки нет: журнал открывается
          кнопкой в шапке (там же счётчик непрочитанного), а лишняя пилюля
          поверх стола только мешала. ── */}
      <div className="relative z-30 xl:hidden">
        {open ? (
          <section
            ref={mobileSheetRef}
            aria-label={titleText}
            data-feed-mobile
            style={
              {
                "--feed-dock": `${dockInset}px`,
                "--feed-gap": `${Math.max(16, dockInset)}px`,
              } as CSSProperties
            }
            className={cn(
              // Телефон: шторка занимает отдельное место после игрового стола,
              // поэтому не закрывает табло; финальный экран (z-40) остаётся
              // над ней. Планшет: привычная правая панель над доком.
              "relative z-30 mx-2 mt-2 mb-[var(--feed-gap)] flex h-[min(58dvh,32rem)] max-h-[calc(100dvh-6rem)] min-h-[22rem] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-card)]",
              "sm:fixed sm:top-0 sm:right-0 sm:bottom-[var(--feed-dock,0px)] sm:left-auto sm:z-50 sm:mx-0 sm:mt-0 sm:h-auto sm:max-h-dvh sm:min-h-0 sm:w-[380px] sm:rounded-none sm:border-y-0 sm:border-r-0 sm:border-l",
              "animate-[fade-in_.2s_var(--ease-out)]",
            )}
          >
            <header className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border px-2.5 py-2">
              <button
                type="button"
                onClick={() => onToggle(false)}
                aria-label={t("feed.collapse", { title: titleText })}
                className="grid size-8 max-xl:size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg"
              >
                <ChevronRight className="size-4" />
              </button>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted">{titleText}</span>
              {filters}
            </header>
            {list("text-sm", listSheetRef)}
            {composer}
          </section>
        ) : null}
      </div>
    </>
  );
}
