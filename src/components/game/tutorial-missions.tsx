import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";
import { useGameStore } from "@/store/game-store";
import {
  TUTORIAL_MISSIONS,
  absorbState,
  loadActiveMission,
  makeMissionProgress,
  saveActiveMission,
  seedProgressFromStats,
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

/**
 * Блок «Обучение» в меню: список НЕ пройденных миссий. Пройденные не
 * показываются вовсе, а когда пройдены все три — блок целиком исчезает с
 * главной страницы. Заодно здесь самолечение утечек: миссия, оставшаяся
 * активной в сторе после ухода со стола мимо кнопки «Прервать» (сдача,
 * «В меню» с финала), гасится при возврате в меню.
 */
export function TutorialMissionBlock({ name, busy }: { name: string; busy: boolean }) {
  const tt = useT();
  const doneMissions = useGameStore((s) => s.doneMissions);
  const startTutorial = useGameStore((s) => s.startTutorial);
  const tutorialMission = useGameStore((s) => s.tutorialMission);
  const net = useGameStore((s) => s.net);
  const clearTutorial = useGameStore((s) => s.clearTutorial);
  const [error, setError] = useState<string | null>(null);
  // Создание комнаты в полёте: флаг миссии уже выставлен, а стола (net) ещё
  // нет — это не утечка, и гасить миссию в этом окне нельзя.
  const startingRef = useRef(false);

  // Самолечение. В меню стола нет: активная миссия без стола — утечка из
  // «сдача/финал → В меню» (тот выход не вызывает clearTutorial) — гасим.
  // Запись evo-tutorial-active чистим только «безкодную» (остаток неудавшегося
  // создания, инертную): запись с кодом стола может принадлежать живой миссии
  // в другой вкладке или партии, в которую вернутся по ссылке ?room.
  useEffect(() => {
    if (tutorialMission) {
      if (!net && !startingRef.current) clearTutorial();
      return;
    }
    if (!net) {
      const rec = loadActiveMission();
      if (rec && rec.code === null) saveActiveMission(null);
    }
  }, [tutorialMission, net, clearTutorial]);

  const ids = (Object.keys(TUTORIAL_MISSIONS) as TutorialMissionId[]).filter(
    (id) => !doneMissions.includes(id),
  );
  // Все миссии пройдены — блока на главной быть не должно вовсе.
  if (!ids.length) return null;
  return (
    <div className="mt-3 rounded-[var(--radius-lg)] border border-accent/35 bg-accent/5 p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-fg">
        <GraduationCap className="size-4 text-accent" aria-hidden />
        {tt("tutorial.block")}
      </div>
      <div className="mt-2 grid gap-1.5">
        {ids.map((id) => {
          const m = TUTORIAL_MISSIONS[id];
          return (
            <Button
              key={id}
              variant="secondary"
              size="sm"
              disabled={busy}
              className="justify-start px-2 text-left text-xs"
              onClick={() => {
                setError(null);
                // Миссия переживает F5: флаг активной миссии пишется до
                // создания стола, код комнаты дорисует HUD за столом.
                startingRef.current = true;
                saveActiveMission({ id, code: null });
                startTutorial(id, name)
                  .catch(() => setError(tt("tutorial.startError")))
                  .finally(() => {
                    startingRef.current = false;
                  });
              }}
            >
              <Circle className="size-3.5 shrink-0 text-muted" aria-hidden />
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

/**
 * Свернутый HUD не должен всплывать снова после F5 в той же партии, но и
 * не имеет права пережить её: запись в sessionStorage хранит код стола.
 * Новая партия (другой код) начинает с развернутым HUD.
 */
const HUD_HIDDEN_KEY = "evo-tutorial-hud-hidden";

/**
 * Живой список целей поверх миссии (учебной или кампании).
 *
 * Блок живёт В ПОТОКЕ стола (первым ребёнком <main>): раньше он висел
 * fixed в левом верхнем углу и накрывал плашку соперника с медальонами
 * его животных. В потоке ничего не перекрывается ни на десктопе, ни на
 * телефоне.
 *
 * Крестик — только свернуть блок (пилюля «Обучение» разворачивает обратно;
 * сверток помнится до конца партии, не дольше). Выход из миссии — отдельная
 * явная кнопка «Прервать обучение» внутри развернутого блока, и она НЕ
 * выводит со стола: партия продолжается обычной.
 *
 * Учебная миссия переживает F5: флаг tutorialMission в сторе после перезагрузки
 * теряется (стор инициализируется заново), а стол по ?room возобновляется. HUD
 * подхватывает миссию из evo-tutorial-active (см. tutorial.ts), сверяя код
 * стола: чужая комната флаг не подхватывает. Прогресс, накопленный до
 * перезагрузки, восстанавливается из серверных метрик партии (state.stats).
 */
export function TutorialHud() {
  const tt = useT();
  const state = useGameStore((s) => s.state);
  const net = useGameStore((s) => s.net);
  const missionId = useGameStore((s) => s.tutorialMission);
  const doneMissions = useGameStore((s) => s.doneMissions);
  const campaignMissionId = useGameStore((s) => s.campaignMission);
  const campaignHard = useGameStore((s) => s.campaignHard);
  const clearTutorial = useGameStore((s) => s.clearTutorial);
  const completeTutorial = useGameStore((s) => s.completeTutorial);
  const clearCampaign = useGameStore((s) => s.clearCampaign);
  const completeCampaignMission = useGameStore((s) => s.completeCampaignMission);
  const progressRef = useRef<MissionProgress>(makeMissionProgress());
  const [, forceTick] = useState(0);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);
  const wasInTableRef = useRef(false);
  // Крестик сворачивает блок, а не бросает миссию: свернутость помнится
  // только до конца этой партии (код стола в sessionStorage).
  const [hudHidden, setHudHidden] = useState(false);
  /**
   * activeId — флаг из стора, прошедший проверку записи evo-tutorial-active:
   * легитимный запуск всегда оставляет запись (клик по миссии в меню), поэтому
   * флаг без записи или с чужим кодом стола — утечка после «сдача/финал →
   * В меню», и показывать поверх чужой партии её нельзя.
   * adoptedId — миссия, подхваченная после F5: стор флаг потерял, а стол
   * возобновился по ?room с тем же кодом.
   */
  const [activeId, setActiveId] = useState<TutorialMissionId | null>(null);
  const [adoptedId, setAdoptedId] = useState<TutorialMissionId | null>(null);
  // Ключ миссии, для которого прогресс уже посеян из stats: посев — один раз
  // на партию, до первой абсорбции.
  const seededKeyRef = useRef<string>("");

  // Валидация флага стора + возобновление после F5.
  useEffect(() => {
    if (campaignMissionId) return;
    const rec = loadActiveMission();
    const code = net?.code ?? null;
    if (missionId) {
      const ok = Boolean(rec && rec.id === missionId && (rec.code === null || rec.code === code));
      setActiveId(ok ? missionId : null);
      return;
    }
    setActiveId(null);
    // Стол жив (код совпадает с записью) и миссия не пройдена — подхватываем.
    if (rec && rec.code && rec.code === code && !doneMissions.includes(rec.id)) {
      setAdoptedId((cur) => (cur === rec.id ? cur : rec.id));
    }
  }, [missionId, campaignMissionId, net?.code, doneMissions]);

  // Запись активной миссии с кодом стола — точка возобновления после F5.
  // Пишет только валидированный запуск; подхваченная миссия код уже имеет.
  useEffect(() => {
    if (!activeId || !net?.code) return;
    const rec = loadActiveMission();
    if (rec?.id === activeId && (rec.code === null || rec.code === net.code)) {
      saveActiveMission({ id: activeId, code: net.code });
    }
  }, [activeId, net?.code]);

  // Смена миссии — чистый прогресс: иначе счётчики прошлой миссии (животные,
  // свойства) засчитывались бы в следующую (нашло ревью волны 4).
  const missionKeyRef = useRef<string>("");
  const missionKey = activeId ?? adoptedId ?? campaignMissionId ?? "";
  if (missionKeyRef.current !== missionKey) {
    missionKeyRef.current = missionKey;
    if (missionKey) progressRef.current = makeMissionProgress();
    completedRef.current = false;
  }

  // Миссия приходит из одной из двух систем: обучение (волна 1.5) или
  // кампания «Эры» (волна 4а). Форма целей одинаковая.
  const isCampaign = Boolean(campaignMissionId);
  const mission: MissionDef | null = activeId
    ? TUTORIAL_MISSIONS[activeId]
    : campaignMissionId
      ? CAMPAIGN_MISSIONS[campaignMissionId]
      : adoptedId
        ? TUTORIAL_MISSIONS[adoptedId]
        : null;
  const effectiveId = activeId ?? adoptedId;

  // Прогресс: абсорбция кадра идемпотентна по eventSeq — эффект может
  // срабатывать сколько угодно часто. Первый кадр партии с подхваченной
  // миссией сначала сеется из stats (прогресс, накопленный до F5).
  useEffect(() => {
    if (!state || !mission) return;
    if (seededKeyRef.current !== missionKeyRef.current) {
      seededKeyRef.current = missionKeyRef.current;
      seedProgressFromStats(progressRef.current, state);
    }
    absorbState(progressRef.current, state);
    forceTick((v) => v + 1);
  }, [state, mission]);

  // Миссия выполнена: звук-награда, отметка прогресса, показ финала. Запись
  // активной миссии НЕ чистим здесь: валидатор на-change увидел бы пропажу и
  // убрал бы HUD с баннером; запись гасится при уходе со стола (ниже) и
  // возобновлению не мешает — пройденная миссия не подхватывается.
  useEffect(() => {
    if (!mission || completedRef.current) return;
    if (!mission.objectives.every((o) => o.done(progressRef.current))) return;
    completedRef.current = true;
    sfx.play("cheer");
    if (isCampaign && campaignMissionId) {
      completeCampaignMission(campaignMissionId, campaignHard);
    } else if (effectiveId) {
      completeTutorial(effectiveId);
    }
    // Финал разворачивает блок, даже если игрок свернул его крестиком:
    // баннер «Миссия выполнена» обязан быть виден. Запись свертка чистим —
    // она не должна всплыть в следующей партии.
    setCompleted(true);
    setHudHidden(false);
    try {
      window.sessionStorage.removeItem(HUD_HIDDEN_KEY);
    } catch {
      // приватный режим — чистить нечего
    }
  }, [mission, completeTutorial, completeCampaignMission, isCampaign, campaignMissionId, campaignHard, effectiveId, state]);

  // Ушли со стола (сдача, кик) — миссия больше не активна. «Прервать» из
  // HUD стол не покидает и чистит миссию своим обработчиком (abortMission).
  // Сигнал — ПЕРЕХОД «были за столом → вышли»: в окне создания (миссия уже
  // установлена, состояние ещё не доехало) clearing был бы ложным.
  useEffect(() => {
    const inTable = net !== null || state !== null;
    if (inTable) {
      wasInTableRef.current = true;
      return;
    }
    if (wasInTableRef.current && (effectiveId || campaignMissionId)) {
      if (isCampaign) clearCampaign();
      else {
        clearTutorial();
        saveActiveMission(null);
        setAdoptedId(null);
      }
    }
    wasInTableRef.current = false;
  }, [net, state, effectiveId, campaignMissionId, isCampaign, clearTutorial, clearCampaign]);

  // Свернутость привязана к коду стола: F5 в той же партии восстанавливает
  // её, новая партия (другой код) начинает с развернутым блоком.
  const roomCode = net?.code ?? null;
  useEffect(() => {
    if (!roomCode) {
      setHudHidden(false);
      return;
    }
    let stored: string | null = null;
    try {
      stored = window.sessionStorage.getItem(HUD_HIDDEN_KEY);
    } catch {
      // приватный режим — свернутость просто не переживёт F5
    }
    setHudHidden(stored === roomCode);
  }, [roomCode]);

  const hideHud = () => {
    setHudHidden(true);
    try {
      if (roomCode) window.sessionStorage.setItem(HUD_HIDDEN_KEY, roomCode);
    } catch {
      // приватный режим — просто не сохранится
    }
  };

  const showHud = () => {
    setHudHidden(false);
    try {
      window.sessionStorage.removeItem(HUD_HIDDEN_KEY);
    } catch {
      // приватный режим — чистить нечего
    }
  };

  // Явный выход из миссии. НЕ выводит со стола: партия продолжается обычной,
  // уходит только миссия (флаг + запись возобновления). Кампании отдельный
  // флаг: leaveNet его раньше гасил, теперь «Прервать» делает это сам.
  const abortMission = () => {
    sfx.play("click");
    if (isCampaign) {
      clearCampaign();
      return;
    }
    clearTutorial();
    saveActiveMission(null);
    setAdoptedId(null);
  };

  if (!mission || !state) return null;
  const done = completed || mission.objectives.every((o) => o.done(progressRef.current));

  // Свернутый вид: компактная пилюля на месте блока — тот же слот в потоке
  // стола, разворачивается кликом.
  if (hudHidden) {
    return (
      <button
        type="button"
        aria-label={tt("tutorial.hud.show")}
        title={tt("tutorial.hud.show")}
        className="order-first flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-surface/95 px-3 py-2 text-xs font-medium text-fg shadow-[var(--shadow-card)] backdrop-blur-sm transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:order-none"
        onClick={() => {
          sfx.play("click");
          showHud();
        }}
      >
        <GraduationCap className="size-4 shrink-0 text-accent" aria-hidden />
        {tt("tutorial.block")}
      </button>
    );
  }

  return (
    <aside
      aria-label={tt("tutorial.block")}
      className="relative order-first z-30 w-full rounded-[var(--radius-lg)] border border-accent/40 bg-surface/95 p-3 text-sm shadow-[var(--shadow-card)] backdrop-blur-sm sm:w-64 lg:order-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 font-medium text-fg">
          <GraduationCap className="size-4 shrink-0 text-accent" aria-hidden />
          {tt(mission.titleKey)}
        </div>
        <button
          type="button"
          aria-label={tt("tutorial.hud.hide")}
          title={tt("tutorial.hud.hide")}
          className="-m-1 rounded-[var(--radius-sm)] p-1 text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => {
            sfx.play("click");
            hideHud();
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
      {!done ? (
        // Явное «Прервать» вместо бывшего крестика-ловушки: крестик теперь
        // только сворачивает блок, со стола эта кнопка не выводит.
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 min-h-9 w-full justify-start px-2 text-left text-xs text-danger hover:bg-danger/10 hover:text-danger"
          onClick={abortMission}
        >
          {tt("tutorial.abort")}
        </Button>
      ) : null}
    </aside>
  );
}
