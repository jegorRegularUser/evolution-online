import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";
import { useGameStore } from "@/store/game-store";
import {
  TUTORIAL_MISSIONS,
  absorbState,
  makeMissionProgress,
  missionComplete,
  type MissionProgress,
  type TutorialMissionId,
} from "@/game/tutorial";
import { CAMPAIGN_MISSIONS } from "@/game/campaign";
import type { TKey } from "@/lib/i18n";

/**
 * Обучение (волна 1.5, дизайн-пакет §5): интерактивные миссии поверх обычной
 * сетевой партии с лёгким ботом. Одна миссия учит одному навыку (§4.1А).
 * Два куска: MissionPickerButtons — блок в меню, TutorialHud — живой список
 * целей поверх стола. Прогресс — чистый аккумулятор из src/game/tutorial.ts
 * (там же тесты), здесь только показ и проводка.
 */

/** Общая форма миссии для HUD: заголовок, описание, цели. */
interface MissionDef {
  titleKey: TKey;
  descKey: TKey;
  objectives: ReadonlyArray<{ id: string; textKey: TKey; done: (p: MissionProgress) => boolean }>;
}

/** Блок «Обучение» в меню: три миссии с галочками пройденных. */
export function TutorialMissionBlock({ name, busy }: { name: string; busy: boolean }) {
  const tt = useT();
  const doneMissions = useGameStore((s) => s.doneMissions);
  const startTutorial = useGameStore((s) => s.startTutorial);
  const [error, setError] = useState<string | null>(null);
  const ids = Object.keys(TUTORIAL_MISSIONS) as TutorialMissionId[];
  return (
    <div className="mt-3 rounded-[var(--radius-lg)] border border-accent/35 bg-accent/5 p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-fg">
        <GraduationCap className="size-4 text-accent" aria-hidden />
        {tt("tutorial.block")}
      </div>
      <div className="mt-2 grid gap-1.5">
        {ids.map((id) => {
          const m = TUTORIAL_MISSIONS[id];
          const done = doneMissions.includes(id);
          return (
            <Button
              key={id}
              variant="secondary"
              size="sm"
              disabled={busy}
              className="justify-start px-2 text-left text-xs"
              onClick={() => {
                setError(null);
                startTutorial(id, name).catch(() =>
                  setError(tt("tutorial.startError")),
                );
              }}
            >
              {done ? (
                <CheckCircle2 className="size-3.5 shrink-0 text-good" aria-hidden />
              ) : (
                <Circle className="size-3.5 shrink-0 text-muted" aria-hidden />
              )}
              <span className="truncate">{tt(m.titleKey)}</span>
            </Button>
          );
        })}
      </div>
      {error ? (
        <p role="status" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Живой список целей поверх миссии (учебной или кампании); «Прервать» — в меню. */
export function TutorialHud() {
  const tt = useT();
  const state = useGameStore((s) => s.state);
  const net = useGameStore((s) => s.net);
  const missionId = useGameStore((s) => s.tutorialMission);
  const campaignMissionId = useGameStore((s) => s.campaignMission);
  const campaignHard = useGameStore((s) => s.campaignHard);
  const clearTutorial = useGameStore((s) => s.clearTutorial);
  const completeTutorial = useGameStore((s) => s.completeTutorial);
  const clearCampaign = useGameStore((s) => s.clearCampaign);
  const completeCampaignMission = useGameStore((s) => s.completeCampaignMission);
  const leaveNet = useGameStore((s) => s.leaveNet);
  const progressRef = useRef<MissionProgress>(makeMissionProgress());
  const [, forceTick] = useState(0);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);
  const wasInTableRef = useRef(false);

  // Миссия приходит из одной из двух систем: обучение (волна 1.5) или
  // кампания «Эры» (волна 4а). Форма целей одинаковая.
  const isCampaign = Boolean(campaignMissionId);
  const mission: MissionDef | null = missionId
    ? TUTORIAL_MISSIONS[missionId]
    : campaignMissionId
      ? CAMPAIGN_MISSIONS[campaignMissionId]
      : null;

  // Прогресс: абсорбция кадра идемпотентна по eventSeq — эффект может
  // срабатывать сколько угодно часто.
  useEffect(() => {
    if (!state || !mission) return;
    absorbState(progressRef.current, state);
    forceTick((v) => v + 1);
  }, [state, mission]);

  // Миссия выполнена: звук-награда, отметка прогресса, показ финала.
  useEffect(() => {
    if (!mission || completedRef.current) return;
    if (!mission.objectives.every((o) => o.done(progressRef.current))) return;
    completedRef.current = true;
    sfx.play("cheer");
    if (isCampaign && campaignMissionId) {
      completeCampaignMission(campaignMissionId, campaignHard);
    } else if (missionId) {
      completeTutorial(missionId);
    }
    setCompleted(true);
  }, [mission, completeTutorial, completeCampaignMission, isCampaign, campaignMissionId, campaignHard, missionId, state]);

  // Ушли со стола (сдача, кик, «Прервать») — миссия больше не активна.
  // Сигнал — ПЕРЕХОД «были за столом → вышли»: в окне создания (миссия уже
  // установлена, состояние ещё не доехало) clearing был бы ложным.
  useEffect(() => {
    const inTable = net !== null || state !== null;
    if (inTable) {
      wasInTableRef.current = true;
      return;
    }
    if (wasInTableRef.current && (missionId || campaignMissionId)) {
      if (isCampaign) clearCampaign();
      else clearTutorial();
    }
    wasInTableRef.current = false;
  }, [net, state, missionId, campaignMissionId, isCampaign, clearTutorial, clearCampaign]);

  if (!mission || !state) return null;
  const done = completed || mission.objectives.every((o) => o.done(progressRef.current));

  return (
    <aside
      aria-label={tt("tutorial.block")}
      className="pointer-events-auto fixed left-3 top-16 z-40 w-64 rounded-[var(--radius-lg)] border border-accent/40 bg-surface/95 p-3 text-sm shadow-[var(--shadow-card)] backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 font-medium text-fg">
          <GraduationCap className="size-4 shrink-0 text-accent" aria-hidden />
          {tt(mission.titleKey)}
        </div>
        <button
          type="button"
          aria-label={tt("tutorial.abort")}
          className="rounded-[var(--radius-sm)] p-1 text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => {
            clearTutorial();
            leaveNet();
          }}
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <p className="mt-1 text-xs leading-snug text-muted">{tt(mission.descKey)}</p>
      <ul className="mt-2 grid gap-1.5">
        {mission.objectives.map((o) => {
          const ok = done || o.done(progressRef.current);
          return (
            <li key={o.id} className="flex items-start gap-2 text-xs leading-snug">
              {ok ? (
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-good" aria-hidden />
              ) : (
                <Circle className="mt-0.5 size-3.5 shrink-0 text-muted" aria-hidden />
              )}
              <span className={ok ? "text-fg line-through opacity-70" : "text-fg"}>
                {tt(o.textKey)}
              </span>
            </li>
          );
        })}
      </ul>
      {done ? (
        <p role="status" className="mt-2 rounded-[var(--radius-sm)] bg-good/15 px-2 py-1.5 text-xs text-good">
          {tt("tutorial.missionDone")}
        </p>
      ) : null}
    </aside>
  );
}
