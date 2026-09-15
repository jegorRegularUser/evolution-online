import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { sfx, type SfxVolumeState } from "@/lib/sfx";
import { useT } from "@/lib/i18n";

/**
 * Звук в шапке: одна иконка-динамик, клик по ней открывает панель (как просил
 * владелец — «иконка звука открывает панельку»), а в панели уже можно совсем
 * выключить звук тумблером или приглушить слайдерами эффектов и фона. Иконка
 * отражает состояние шины: `Volume2` — звук есть, `Volume1` — включён, но обе
 * шины почти в нуле, `VolumeX` — выключен. Состояние читается из шины `sfx` по
 * подписке, поэтому все экземпляры на странице (и в соседних вкладках)
 * показывают одно и то же, а не своё локальное значение.
 */

/** Ниже этого значения обе шины считаются «приглушёнными» — иконка тише. */
const QUIET_THRESHOLD = 0.34;

export function SoundToggle() {
  const tt = useT();
  const [open, setOpen] = useState(false);
  const on = useSyncExternalStore(subscribeSfx, readEnabled, readEnabledOnServer);
  const [volume, setVolume] = useState<SfxVolumeState>(() => sfx.volume);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();
  const sfxSliderId = useId();
  const ambientSliderId = useId();

  // Громкости мог поменять другой экземпляр тумблера (их на странице три) —
  // подписка держит слайдеры в курсе.
  useEffect(() => sfx.subscribe(() => setVolume(sfx.volume)), []);

  // Закрытие по Esc и клику вне панели.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Состояние иконки: выключено — перечёркнутый динамик; включено, но обе
  // шины приглушены — одна волна; иначе полный динамик.
  const quiet = on && Math.max(volume.sfxVolume, volume.ambientVolume) <= QUIET_THRESHOLD;
  const soundState: "off" | "quiet" | "on" = !on ? "off" : quiet ? "quiet" : "on";
  const SoundIcon = soundState === "off" ? VolumeX : soundState === "quiet" ? Volume1 : Volume2;
  const hint =
    soundState === "off"
      ? tt("sound.off")
      : soundState === "quiet"
        ? tt("sound.quiet")
        : tt("sound.on");

  // Клик по иконке не глушит, а открывает панель: выключение и громкости
  // живут внутри неё. Состояние берём из шины, а не из локальной копии,
  // иначе несколько тумблеров разъезжаются.
  const toggleSound = () => sfx.setEnabled(!sfx.enabled);

  const changeSfxVolume = (percent: number) => {
    const value = percent / 100;
    setVolume((prev) => ({ ...prev, sfxVolume: value, sfx: value }));
    sfx.setVolume({ sfxVolume: value });
  };

  const changeAmbientVolume = (percent: number) => {
    const value = percent / 100;
    setVolume((prev) => ({ ...prev, ambientVolume: value, ambient: value }));
    sfx.setVolume({ ambientVolume: value });
  };

  // Проверить эффекты: если звук был выключен, setEnabled сам проиграет «food».
  const testSound = () => {
    if (!sfx.enabled) {
      sfx.setEnabled(true);
      return;
    }
    sfx.play("food", 0, { gain: 0.9 });
  };

  return (
    <div ref={rootRef} className="relative inline-flex items-center">
      {/* Доступное имя постоянное («Настройки звука»), состояние — в
          `aria-pressed` и в иконке: снаружи сразу видно, звук выключен или нет. */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={tt("sound.settings")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-pressed={on}
        data-sound={soundState}
        title={hint}
        onClick={() => setOpen((v) => !v)}
      >
        <SoundIcon className="size-4" />
      </Button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={tt("sound.settings")}
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-[var(--radius-md)] border border-border bg-surface p-3 text-sm shadow-[var(--shadow-card)]"
        >
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={toggleSound}
            className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-1 py-1.5 text-left text-fg hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>{tt("sound.toggle")}</span>
            <span
              aria-hidden="true"
              className={
                "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-[var(--motion-fast)] " +
                (on ? "bg-accent" : "bg-surface-2 border border-border")
              }
            >
              <span
                className={
                  "absolute top-0.5 size-4 rounded-full bg-parchment transition-[left] duration-[var(--motion-fast)] " +
                  (on ? "left-[18px]" : "left-0.5")
                }
              />
            </span>
          </button>

          <div className="mt-2 border-t border-border pt-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <label htmlFor={sfxSliderId}>{tt("sound.sfx")}</label>
              <span className="tabular-nums">{Math.round(volume.sfxVolume * 100)}%</span>
            </div>
            <input
              id={sfxSliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(volume.sfxVolume * 100)}
              onChange={(e) => changeSfxVolume(Number(e.target.value))}
              className="range-evo mt-1 w-full"
            />
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <label htmlFor={ambientSliderId}>{tt("sound.ambient")}</label>
              <span className="tabular-nums">{Math.round(volume.ambientVolume * 100)}%</span>
            </div>
            <input
              id={ambientSliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(volume.ambientVolume * 100)}
              onChange={(e) => changeAmbientVolume(Number(e.target.value))}
              className="range-evo mt-1 w-full"
            />
          </div>

          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={testSound}>
            {tt("sound.test")}
          </Button>
        </div>
      )}
    </div>
  );
}

// Стабильные ссылки для useSyncExternalStore: подписка и снимки не должны
// пересоздаваться на каждый рендер.
const subscribeSfx = (listener: () => void) => sfx.subscribe(listener);
const readEnabled = () => sfx.enabled;
const readEnabledOnServer = () => true; // SSR: localStorage нет — считаем звук включённым
