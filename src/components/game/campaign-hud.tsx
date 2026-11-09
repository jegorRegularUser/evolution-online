import { BookOpen, Compass, Crown, Swords, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CAMPAIGN_ERAS } from "@/game/campaign";
import type { CampaignRun } from "@/game/campaign-run";
import { useT, type TKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";

/** Id гарантированного свойства → имя награды, которой оно получено. */
const TRAIT_REWARD_KEY: Record<string, TKey> = {
  burrowing: "campaign.reward.burrow.name",
  tailLoss: "campaign.reward.tail.name",
  swimming: "campaign.reward.swim.name",
};

/**
 * Заначка наград забега: пилюли «Память рода ×2 · Дар нор». Общий вид для
 * HUD стола и узла награды на странице кампании.
 */
export function StashChips({ run, emptyKey }: { run: CampaignRun; emptyKey?: TKey }) {
  const tt = useT();
  const chips: string[] = [];
  if (run.stash.handBonus > 0) {
    chips.push(`${tt("campaign.reward.hand.name")} ×${run.stash.handBonus}`);
  }
  for (const trait of run.stash.startTraits) {
    const key = TRAIT_REWARD_KEY[trait];
    if (key) chips.push(tt(key));
  }
  if (!chips.length) {
    return emptyKey ? <p className="text-xs text-muted">{tt(emptyKey)}</p> : null;
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-fg"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

/**
 * HUD забега кампании (фундамент рогалик-переработки): ОДНА тонкая строка
 * над столом — эпоха, счётчик пути, узел, бейдж изверга. Дневник натуралиста
 * не висит весь матч: кнопка-книжка раскрывает компактную карточку с текстом
 * узла, заначкой наград и годом (клик мимо — закрывает). Полоса занимает
 * свою grid-полосу 'hud' на широких раскладках (см. game-app) — она не
 * авто-плейсится в чужие ячейки и ничего не перекрывает.
 */
export function CampaignHud() {
  const tt = useT();
  const run = useGameStore((s) => s.campaignRun);
  const state = useGameStore((s) => s.state);
  const [diaryOpen, setDiaryOpen] = useState(false);
  if (!run || run.status !== "active" || !run.match) return null;
  const node = run.nodes[run.match.nodeId];
  if (!node) return null;
  const era = CAMPAIGN_ERAS.find((e) => e.id === run.era);
  const total = Object.keys(run.nodes).length;
  const done = run.cleared.length;
  const isBoss = node.kind === "boss";
  const hasStash = run.stash.handBonus > 0 || run.stash.startTraits.length > 0;
  return (
    <aside aria-label={tt(era?.titleKey ?? "campaign.title")} className="relative order-first z-30 w-full lg:order-none">
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-full border bg-surface/95 px-3 py-1.5 text-xs shadow-[var(--shadow-card)] backdrop-blur-sm",
          isBoss ? "border-danger/50" : "border-accent/40",
        )}
      >
        <Compass className="size-4 shrink-0 text-accent" aria-hidden />
        <span className="hidden shrink-0 truncate font-medium text-fg sm:inline">{tt(era?.titleKey ?? "campaign.title")}</span>
        <span className="shrink-0 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] tabular-nums text-muted" aria-label={tt("campaign.run.progress", { done: String(done + 1), total: String(total) })}>
          {done + 1}/{total}
        </span>
        <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
        <span className="flex min-w-0 items-center gap-1.5">
          {isBoss ? <Swords className="size-3.5 shrink-0 text-danger" aria-hidden /> : null}
          <span className="truncate font-medium text-fg">{tt(node.titleKey)}</span>
          {isBoss ? (
            <span className="hidden shrink-0 items-center rounded-[var(--radius-sm)] border border-danger/40 bg-danger/10 px-1.5 py-0.5 text-[10px] text-clay sm:inline-flex">
              {tt("campaign.run.hud.boss")}
            </span>
          ) : null}
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-1">
          {hasStash ? <StashChips run={run} /> : null}
          <button
            type="button"
            aria-label={tt("rules.campaign.diary")}
            title={tt("rules.campaign.diary")}
            className="rounded-full p-1 text-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setDiaryOpen((v) => !v)}
          >
            <BookOpen className="size-4" aria-hidden />
          </button>
        </span>
      </div>
      {diaryOpen ? (
        <div className="absolute inset-x-0 top-full z-30 mt-1.5 w-full max-w-md rounded-[var(--radius-lg)] border border-accent/40 bg-surface/95 p-3 text-sm shadow-[var(--shadow-card)] backdrop-blur-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-center gap-1.5 font-medium text-fg">
              <Swords className={isBoss ? "size-4 shrink-0 text-danger" : "hidden"} aria-hidden />
              {tt(node.titleKey)}
            </p>
            <button
              type="button"
              aria-label={tt("common.close")}
              className="-m-1 rounded-[var(--radius-sm)] p-1 text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setDiaryOpen(false)}
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <p className="mt-1 text-xs leading-snug text-muted">{tt(node.diaryKey)}</p>
          {hasStash ? (
            <div className="mt-2">
              <StashChips run={run} />
            </div>
          ) : null}
          {state && state.phase !== "gameOver" ? (
            <p className="mt-2 text-[11px] text-muted">{tt("game.yearN", { year: state.year })}</p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}

/**
 * Финал боя/забега вместо сетевого GameOverScreen. Три исхода: узел пройден
 * (забег продолжается — «К пути»), забег выигран (финал пути), забег потерян
 * (сдача или поражение — ничего вне забега не теряется, «Новый забег» сразу).
 */
export function CampaignGameOver() {
  const tt = useT();
  const navigate = useNavigate();
  const run = useGameStore((s) => s.campaignRun);
  const state = useGameStore((s) => s.state);
  const leaveNet = useGameStore((s) => s.leaveNet);
  const startCampaignRun = useGameStore((s) => s.startCampaignRun);
  if (!run) return null;
  const finished = run.status !== "active";
  const won = run.status === "won";
  const titleKey = finished
    ? won
      ? "campaign.run.wonTitle"
      : "campaign.run.lostTitle"
    : "campaign.run.nodeWon.title";
  const textKey = finished
    ? won
      ? "campaign.run.wonText"
      : "campaign.run.lostText"
    : "campaign.run.nodeWon.text";
  const scores = state?.scores;
  const mine = scores?.find((s) => s.playerId === 0)?.total ?? null;
  const foe = scores?.find((s) => s.playerId !== 0)?.total ?? null;
  const toPath = () => {
    // Шим стола гасим: путь живёт на странице кампании, а не за столом.
    leaveNet();
    void navigate({ to: "/campaign" });
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-bg/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto grid size-10 place-items-center rounded-full bg-accent/15">
          <Crown className={finished && !won ? "size-5 text-muted" : "size-5 text-accent"} aria-hidden />
        </div>
        <p className="mt-3 font-display text-xl tracking-[0.06em] text-fg">{tt(titleKey)}</p>
        <p className="mt-2 text-sm leading-snug text-muted">{tt(textKey)}</p>
        {mine !== null && foe !== null ? (
          <p className="mt-2 text-sm text-fg">{tt("campaign.run.finalScore", { you: mine, foe })}</p>
        ) : null}
        <div className="mt-4 grid gap-2">
          {finished && !won ? (
            <Button onClick={() => startCampaignRun(run.era, useGameStore.getState().net?.name ?? "")}>
              {tt("campaign.run.new")}
            </Button>
          ) : (
            <Button onClick={toPath}>{tt("campaign.run.toPath")}</Button>
          )}
          <Button variant="secondary" onClick={leaveNet}>
            {tt("error.menu")}
          </Button>
        </div>
      </div>
    </div>
  );
}
