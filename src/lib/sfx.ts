/**
 * Процедурный звук на WebAudio: короткие «деревянно-бумажные» звуки под тему
 * натуралистического атласа — кубики по столу, бумажный шелест раздачи,
 * глухой стук фишки еды. Без аудиофайлов: всё синтезируется осцилляторами
 * и шумовыми всплесками, поэтому не тянет ассетов и лицензий.
 *
 * Включённость хранится в localStorage («evo-sound»), AudioContext создаётся
 * лениво и просыпается по первому пользовательскому жесту — браузерные
 * политики автовоспроизведения этого требуют.
 */

export type SfxId =
  | "roll" // бросок кубиков кормовой базы
  | "hunt" // объявление атаки хищника
  | "kill" // добыча съедена
  | "food" // фишка еды легла на животное
  | "foodBlue" // синяя фишка (охота, сотрудничество…)
  | "fat" // жир обращён в еду
  | "defense" // бросок кубика защиты
  | "dodge" // жертва спаслась (бег, мимикрия, хвост)
  | "death" // вымирание животного
  | "draw" // раздача карт
  | "card" // карта/свойство легло на стол
  | "flip" // вскрытие карты мутации
  | "phase" // тихий шелест смены фазы
  | "mark" // метка последствия на животном
  | "plant" // растение/флора появилось на столе
  | "win" // победа в партии
  | "lose"; // поражение

const STORAGE_KEY = "evo-sound";
const MASTER_GAIN = 0.4;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let enabled = loadEnabled();

function loadEnabled(): boolean {
  if (typeof window === "undefined") return true; // SSR — сохранять некуда
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    // localStorage может быть недоступен — звук по умолчанию включён.
    return true;
  }
}

/** Контекст создаётся только на клиенте и по мере надобности. */
function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Общий буфер белого шума — источник для щелчков и шелестов. */
function noise(c: AudioContext): AudioBuffer {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

interface ToneOpts {
  freq: number;
  /** Конечная частота (глиссандо вниз/вверх). */
  to?: number;
  dur: number;
  gain?: number;
  type?: OscillatorType;
  delay?: number;
}

/** Одна нота: быстрая атака и экспоненциальное затухание. */
function tone(c: AudioContext, o: ToneOpts) {
  if (!master) return;
  const t0 = c.currentTime + (o.delay ?? 0);
  const osc = c.createOscillator();
  osc.type = o.type ?? "triangle";
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, o.to), t0 + o.dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.gain ?? 0.2, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.05);
}

interface BurstOpts {
  dur: number;
  gain?: number;
  delay?: number;
  /** Полоса шума: «low» — глухой удар, «band» — щелчок кости, «high» — шелест бумаги. */
  band?: "low" | "band" | "high";
  freq?: number;
}

/** Всплеск фильтрованного шума — удар, щелчок, шелест. */
function burst(c: AudioContext, o: BurstOpts) {
  if (!master) return;
  const t0 = c.currentTime + (o.delay ?? 0);
  const src = c.createBufferSource();
  src.buffer = noise(c);
  src.loop = true;
  const filter = c.createBiquadFilter();
  const freq = o.freq ?? 1200;
  if (o.band === "low") {
    filter.type = "lowpass";
    filter.frequency.value = freq;
  } else if (o.band === "high") {
    filter.type = "highpass";
    filter.frequency.value = freq;
  } else {
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 1.4;
  }
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.gain ?? 0.18, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t0, Math.random() * 0.5);
  src.stop(t0 + o.dur + 0.05);
}

/** Композиции звуков: каждый ид — короткий рецепт из нот и шумов. */
function perform(c: AudioContext, id: SfxId, delay: number) {
  switch (id) {
    case "roll":
      // Кость стучит по столу несколько раз, затихая.
      for (let i = 0; i < 4; i++) {
        burst(c, { dur: 0.05, gain: 0.16 - i * 0.03, band: "band", freq: 900 + i * 250, delay: delay + i * 0.07 });
      }
      tone(c, { freq: 240, to: 180, dur: 0.1, gain: 0.08, type: "sine", delay: delay + 0.28 });
      break;
    case "hunt":
      // Низкий рык: пила с глиссандо вниз плюс глухой удар.
      tone(c, { freq: 110, to: 70, dur: 0.28, gain: 0.16, type: "sawtooth", delay });
      burst(c, { dur: 0.08, gain: 0.1, band: "low", freq: 300, delay });
      break;
    case "kill":
      burst(c, { dur: 0.12, gain: 0.2, band: "low", freq: 220, delay });
      tone(c, { freq: 90, to: 55, dur: 0.22, gain: 0.18, type: "sine", delay });
      break;
    case "food":
      // Деревянный «пок» фишки.
      tone(c, { freq: 540, to: 620, dur: 0.09, gain: 0.16, delay });
      tone(c, { freq: 270, dur: 0.06, gain: 0.07, type: "sine", delay });
      break;
    case "foodBlue":
      tone(c, { freq: 420, to: 470, dur: 0.1, gain: 0.14, delay });
      tone(c, { freq: 210, dur: 0.07, gain: 0.06, type: "sine", delay });
      break;
    case "fat":
      tone(c, { freq: 200, to: 160, dur: 0.14, gain: 0.14, type: "sine", delay });
      break;
    case "defense":
      burst(c, { dur: 0.06, gain: 0.16, band: "band", freq: 1100, delay });
      tone(c, { freq: 300, to: 240, dur: 0.08, gain: 0.07, type: "sine", delay: delay + 0.02 });
      break;
    case "dodge":
      // Восходящий свист — спаслось.
      tone(c, { freq: 430, to: 940, dur: 0.22, gain: 0.1, type: "sine", delay });
      break;
    case "death":
      tone(c, { freq: 300, to: 130, dur: 0.5, gain: 0.14, type: "sine", delay });
      burst(c, { dur: 0.3, gain: 0.06, band: "low", freq: 400, delay });
      break;
    case "draw":
      burst(c, { dur: 0.16, gain: 0.1, band: "high", freq: 2600, delay });
      burst(c, { dur: 0.12, gain: 0.07, band: "high", freq: 3400, delay: delay + 0.09 });
      break;
    case "card":
      tone(c, { freq: 320, to: 280, dur: 0.07, gain: 0.12, delay });
      break;
    case "flip":
      burst(c, { dur: 0.08, gain: 0.1, band: "high", freq: 2200, delay });
      tone(c, { freq: 500, to: 380, dur: 0.1, gain: 0.1, delay: delay + 0.04 });
      break;
    case "phase":
      // Тихий пергаментный свуш.
      burst(c, { dur: 0.22, gain: 0.06, band: "high", freq: 1800, delay });
      break;
    case "mark":
      tone(c, { freq: 880, dur: 0.12, gain: 0.09, type: "sine", delay });
      tone(c, { freq: 660, dur: 0.1, gain: 0.06, type: "sine", delay: delay + 0.08 });
      break;
    case "plant":
      burst(c, { dur: 0.14, gain: 0.07, band: "high", freq: 1500, delay });
      tone(c, { freq: 350, to: 480, dur: 0.16, gain: 0.08, type: "sine", delay: delay + 0.05 });
      break;
    case "win":
      // Три восходящие ноты — мажорный аккорд.
      tone(c, { freq: 392, dur: 0.18, gain: 0.14, delay });
      tone(c, { freq: 494, dur: 0.18, gain: 0.14, delay: delay + 0.14 });
      tone(c, { freq: 587, dur: 0.34, gain: 0.16, delay: delay + 0.28 });
      break;
    case "lose":
      tone(c, { freq: 330, dur: 0.22, gain: 0.12, type: "sine", delay });
      tone(c, { freq: 247, dur: 0.4, gain: 0.12, type: "sine", delay: delay + 0.2 });
      break;
  }
}

export const sfx = {
  get enabled(): boolean {
    return enabled;
  },

  setEnabled(v: boolean) {
    enabled = v;
    try {
      localStorage.setItem(STORAGE_KEY, v ? "on" : "off");
    } catch {
      // приватный режим — просто не сохранится
    }
    if (v) {
      const c = ensureCtx();
      if (c) perform(c, "food", 0);
    }
  },

  /** Разбудить AudioContext по пользовательскому жесту (политики автоплея). */
  unlock() {
    ensureCtx();
  },

  /**
   * Проиграть звук. delay — сдвиг в секундах, чтобы цепочка событий
   * sounded каскадом, а не одной кучей.
   */
  play(id: SfxId, delay = 0) {
    if (!enabled) return;
    const c = ensureCtx();
    if (!c || c.state !== "running") return;
    perform(c, id, delay);
  },
};
