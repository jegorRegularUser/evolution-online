import { Bot, Check, Copy, LogOut, Play, Plus, Users, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/game/types";
import { loadName } from "@/lib/net/session";
import { useGameStore } from "@/store/game-store";
import { cn } from "@/lib/utils";

const DIFFS: Array<[Difficulty, string]> = [
  ["easy", "Проще"],
  ["normal", "Обычная"],
  ["hard", "Жёстче"],
];

/**
 * Секция «Игра по сети» в главном меню: создать стол / войти по коду.
 * Ссылка вида ?room=КОД предзаполняет вход, а при сохранённом месте
 * сразу возвращает за стол.
 */
export function NetMenuPanel() {
  const startNetCreate = useGameStore((s) => s.startNetCreate);
  const startNetJoin = useGameStore((s) => s.startNetJoin);
  const resumeNetFromUrl = useGameStore((s) => s.resumeNetFromUrl);

  const [tab, setTab] = useState<"none" | "create" | "join">("none");
  const [name, setName] = useState(loadName());
  const [code, setCode] = useState("");
  const [capacity, setCapacity] = useState<2 | 3 | 4 | 5 | 6 | 7 | 8>(2);
  // По умолчанию мест без ботов: стол создаётся открытым для приглашённых,
  // боты добавляются кнопкой в лобби.
  const [bots, setBots] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [continents, setContinents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const room = new URLSearchParams(window.location.search).get("room");
    if (!room) return;
    setCode(room.toUpperCase());
    setTab("join");
    // Возвращение за своё место по токену — без формы, если получится.
    void resumeNetFromUrl(room);
    // Единожды на монтирование панели.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(fn: () => Promise<void>) {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (tab === "none") {
    return (
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-muted">Сетевая игра</legend>
        <Button variant="secondary" size="lg" className="w-full" onClick={() => setTab("create")}>
          <Users className="size-4" />
          Игра по сети
        </Button>
      </fieldset>
    );
  }

  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
        <Users className="size-4" />
        Игра по сети
      </legend>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTab("create")}
          className={cn(
            "h-11 rounded-[var(--radius-md)] border text-sm font-medium",
            tab === "create"
              ? "border-accent bg-accent text-accent-fg"
              : "border-border bg-bg text-fg hover:bg-surface-2",
          )}
        >
          Создать стол
        </button>
        <button
          type="button"
          onClick={() => setTab("join")}
          className={cn(
            "h-11 rounded-[var(--radius-md)] border text-sm font-medium",
            tab === "join"
              ? "border-accent bg-accent text-accent-fg"
              : "border-border bg-bg text-fg hover:bg-surface-2",
          )}
        >
          Войти по коду
        </button>
      </div>

      <label className="mb-3 block">
        <span className="mb-1 block text-xs text-muted">Ваше имя</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={16}
          placeholder="Как вас видят соперники"
          aria-label="Ваше имя"
          className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        />
      </label>

      {tab === "create" ? (
        <>
          <div className="mb-3">
            <p className="mb-1.5 text-xs text-muted">Мест за столом</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setCapacity(n as 2 | 3 | 4 | 5 | 6 | 7 | 8);
                    setBots((b) => Math.min(b, n - 1));
                  }}
                  className={cn(
                    "h-10 rounded-[var(--radius-md)] border text-sm font-medium",
                    capacity === n
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-bg text-fg hover:bg-surface-2",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-muted">Боты (заполнят свободные места)</p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                aria-label="Меньше ботов"
                disabled={bots === 0}
                onClick={() => setBots((b) => Math.max(0, b - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-8 text-center font-display text-lg tabular-nums">{bots}</span>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Больше ботов"
                disabled={bots >= capacity - 1}
                onClick={() => setBots((b) => Math.min(capacity - 1, b + 1))}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-muted">Сложность ботов</p>
            <div className="grid grid-cols-3 gap-2">
              {DIFFS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDifficulty(id)}
                  className={cn(
                    "h-10 rounded-[var(--radius-md)] border text-sm font-medium",
                    difficulty === id
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-bg text-fg hover:bg-surface-2",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-muted">Дополнение</p>
            <button
              type="button"
              onClick={() => setContinents((v) => !v)}
              aria-pressed={continents}
              className={cn(
                "flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm",
                continents ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2",
              )}
            >
              <span>Континенты — Лавразия, Гондвана и Океан</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                  continents ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted",
                )}
              >
                {continents ? "вкл" : "выкл"}
              </span>
            </button>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={busy || !name.trim()}
            onClick={() =>
              run(() =>
                startNetCreate({
                  name: name.trim(),
                  capacity,
                  botSeats: bots,
                  difficulty,
                  modules: continents ? { continents: true } : {},
                }),
              )
            }
          >
            <Play className="size-4" />
            Создать стол
          </Button>
        </>
      ) : (
        <>
          <label className="mb-3 block">
            <span className="mb-1 block text-xs text-muted">Код стола</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
              maxLength={4}
              placeholder="Например, KQXT"
              aria-label="Код стола"
              className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 font-display text-lg tracking-[0.3em] uppercase text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            />
          </label>
          <Button
            className="w-full"
            size="lg"
            disabled={busy || !name.trim() || code.length !== 4}
            onClick={() => run(() => startNetJoin(code, name.trim()))}
          >
            <Play className="size-4" />
            Войти
          </Button>
        </>
      )}

      {error ? <p className="mt-2 text-sm text-clay">{error}</p> : null}
    </fieldset>
  );
}

/** Лобби сетевого стола: состав, ссылка-приглашение, боты, старт от хоста. */
export function LobbyScreen() {
  const net = useGameStore((s) => s.net)!;
  const netAddBots = useGameStore((s) => s.netAddBots);
  const netStart = useGameStore((s) => s.netStart);
  const leaveNet = useGameStore((s) => s.leaveNet);

  const [copied, setCopied] = useState(false);

  const isHost = net.hostSeat === net.seat;
  const humans = net.seats.filter((s) => !s.isAI).length;
  const bots = net.seats.length - humans;
  const full = net.seats.length >= net.capacity;
  const shareUrl = `${window.location.origin}/?room=${net.code}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Скопируйте ссылку вручную:", shareUrl);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-5 py-16">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
        Стол · ждём игроков
      </p>
      <h1 className="mt-2 text-center font-display text-4xl tracking-[0.18em]" data-room-code={net.code}>
        {net.code}
      </h1>

      <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7">
        <ul className="space-y-2">
          {Array.from({ length: Math.max(net.capacity, net.seats.length) }).map((_, seatNo) => {
            const seat = net.seats.find((x) => x.seat === seatNo);
            return (
              <li
                key={seatNo}
                className={cn(
                  "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5",
                  seat ? "border-border bg-bg" : "border-dashed border-border bg-bg/40",
                  seat?.seat === net.seat ? "ring-1 ring-accent/50" : "",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-fg">
                  {seat ? (
                    seat.isAI ? (
                      <Bot className="size-4 text-muted" />
                    ) : (
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          seat.online ? "bg-good" : "bg-ink/25",
                        )}
                        title={seat.online ? "в сети" : "не в сети"}
                      />
                    )
                  ) : (
                    <span className="size-2 rounded-full bg-ink/15" />
                  )}
                  {seat ? seat.name : "Свободное место"}
                  {seat?.seat === net.hostSeat ? (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent">
                      хост
                    </span>
                  ) : null}
                  {seat?.seat === net.seat ? (
                    <span className="text-[10px] uppercase tracking-wide text-muted">это вы</span>
                  ) : null}
                </span>
                {!seat && isHost ? (
                  <span className="text-[10px] uppercase tracking-wide text-subtle">ждём</span>
                ) : null}
              </li>
            );
          })}
        </ul>

        {net.error ? <p className="mt-3 text-sm text-clay">{net.error}</p> : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" className="flex-1" onClick={copyLink}>
            {copied ? <Check className="size-4 text-good" /> : <Copy className="size-4" />}
            {copied ? "Скопировано" : "Скопировать ссылку"}
          </Button>
          {isHost ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                aria-label="Убрать бота"
                disabled={bots === 0}
                onClick={() => void netAddBots(-1)}
              >
                <Minus className="size-4" />
                Бот
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                aria-label="Добавить бота"
                disabled={humans + bots >= net.capacity}
                onClick={() => void netAddBots(+1)}
              >
                <Plus className="size-4" />
                Бот
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            className="flex-1"
            size="lg"
            disabled={!isHost || !full || humans < 1}
            title={
              !isHost
                ? "Начинает хост"
                : !full
                  ? "Заполните все места — людьми или ботами"
                  : undefined
            }
            onClick={() => void netStart()}
          >
            <Play className="size-4" />
            Начать год
          </Button>
          <Button variant="ghost" size="lg" onClick={leaveNet}>
            <LogOut className="size-4" />
            Покинуть стол
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-subtle">
        Отправьте ссылку друзьям — они войдут по ней одним касанием.
      </p>
    </div>
  );
}
