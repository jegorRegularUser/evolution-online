/**
 * Процедурный звук на WebAudio: короткие «деревянно-бумажные» звуки под тему
 * натуралистического атласа — кубики по столу, бумажный шелест раздачи,
 * глухой стук фишки еды. Без аудиофайлов: всё синтезируется осцилляторами
 * и шумовыми всплесками, поэтому не тянет ассетов и лицензий.
 *
 * Громкость разделена на две шины: эффекты (`sfx`) и фоновый эмбиент
 * (`ambient`), у каждой свой гейн. Включённость хранится в localStorage
 * («evo-sound», формат «on»/«off» не менялся), громкости — в соседнем ключе
 * «evo-sound-volume» (JSON). Выключение гасит отдельный узел `muteGain`
 * перед `destination` — глушится весь тракт (эффекты, дроны, музыка), а не
 * только текущий слой эмбиента. AudioContext создаётся лениво и просыпается
 * по первому пользовательскому жесту — браузерные политики автовоспроизведения
 * этого требуют, поэтому эмбиент стартует только после `unlock()`.
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
  | "lose" // поражение
  | "pass" // пас/пропуск хода: тихая карта на стол
  | "endTurn" // конец хода: чуть заметнее паса
  | "migrate" // миграция между территориями: шелест перемещения
  | "grow" // рост растений и флоры
  | "wither" // увядание растения (не путать с death животных)
  | "burn" // сгорание остатков кормовой базы: глухой шум
  | "join" // игрок подключился к столу: восходящий блип
  | "leave" // игрок отключился: нисходящий блип
  | "yourTurn" // «ваш ход»: мягкий восходящий аккорд
  | "click" // нажатие UI-кнопки: очень тихий сухой щелчок
  | "modal" // открытие/закрытие модалки: тихий свуш
  | "chat" // новое сообщение в чате/журнале: мягкий «дзинь»
  | "reaction" // реакция зрителя: лёгкий позитивный блип
  | "cheer" // поощрение: тёплый аккорд с аплодисментным всплеском
  | "crack"; // очень тихий сухой треск «слома» (анимация карты)

/** Настроения фонового эмбиента (не музыка — медленные дрон-слои). */
export type AmbientMood = "development" | "feeding" | "extinction" | "final";

/** Громкости шин, 0..1. */
export interface SfxSettings {
  sfxVolume: number;
  ambientVolume: number;
}

/**
 * Снимок громкостей: полные имена полей плюс короткие псевдонимы
 * (`sfx` === `sfxVolume`, `ambient` === `ambientVolume`) — чтобы вызывающий
 * код мог читать так, как ему удобнее.
 */
export interface SfxVolumeState extends SfxSettings {
  sfx: number;
  ambient: number;
}

/** Дополнительные параметры одного проигрывания. */
export interface PlayOptions {
  /** Множитель громкости одного звука, 0..1. Приглушает чужие/фоновые события. */
  gain?: number;
}

interface PendingCue {
  id: SfxId;
  delay: number;
  scale: number;
  /** Гарантирует, что rate-limiter не съел слот до постановки в очередь. */
  rateReserved: boolean;
}

interface VoiceLease {
  token: number;
  id: SfxId;
  sources: Set<AudioScheduledSourceNode>;
  released: boolean;
}

const STORAGE_KEY = "evo-sound"; // «on»/«off» — старый формат, не меняем
const VOLUME_KEY = "evo-sound-volume"; // JSON { sfxVolume, ambientVolume }
const MASTER_GAIN = 0.4; // общий предохранитель поверх обеих шин
const DEFAULT_VOLUME: SfxSettings = { sfxVolume: 1, ambientVolume: 0.5 };

/**
 * Rate-limit одинаковых звуков: не больше 3 за 200 мс. Окно чуть меньше
 * 3×70 мс, поэтому каскад useSfx (шаг 70 мс) проходит целиком, а плотный
 * залп одинаковых событий (например, 8 «food» в одном кадре) обрезается.
 * Учитывается и задержка: звуки, запланированные на разные моменты, не
 * считаются «одновременным» спамом.
 */
const RATE_WINDOW = 0.2; // секунды
const RATE_MAX = 3;

/** Целевой уровень эмбиента относительно master (с учётом «дыхания» ≤ ~0.15). */
const AMBIENT_LEVEL = 0.12;
/** Длительность кроссфейда смены настроения, секунды. */
const AMBIENT_FADE = 1;
/** Длительность рампы master-mute: без неё слышен щелчок на границе. */
const MUTE_FADE = 0.12;

/** Не больше двух одновременных событий одного id и восьми событий всего. */
const MAX_VOICES_PER_ID = 2;
const MAX_VOICES = 8;
/** Дополнительный предохранитель на уровне реальных Web Audio источников. */
const MAX_ACTIVE_SOURCES = 32;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
/**
 * Последний узел перед `destination`: 1 — звук включён, 0 — полная тишина.
 * Отдельный узел (а не рампа `master.gain`) нужен, чтобы mute не терял
 * пользовательскую громкость и не зависел от того, попал ли слой в `ambient`.
 */
let muteGain: GainNode | null = null;
let sfxBus: GainNode | null = null;
let ambientBus: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let enabled = loadEnabled();
let volume = loadVolume();

/** Флаг настоящего пользовательского жеста: без него AudioContext не создаём. */
let userGesture = false;
/** Контекст уже создавался, но браузер усыпил его после ухода со страницы. */
let contextWasSuspended = false;
/** После suspend нужно не просто вернуть gain, а заново собрать активный слой. */
let ambientResumeRequested = false;
let resumePromise: Promise<boolean> | null = null;
let pendingCue: PendingCue | null = null;

/** Времена последних запланированных проигрываний по каждому id (секунды). */
const recent = new Map<SfxId, number[]>();

/**
 * Подписчики UI: на странице живёт несколько экземпляров тумблера
 * (`game-app`, `screens`, `net-screens`), и все они должны показывать
 * фактическое состояние шины, а не своё локальное.
 */
const listeners = new Set<() => void>();

/** Реестр событийных голосов: lease живёт до `ended` последнего источника. */
let nextVoiceToken = 1;
const activeVoices = new Map<number, VoiceLease>();
let activeVoiceCount = 0;
let activeSourceCount = 0;
const sourceCleanup = new Map<AudioScheduledSourceNode, () => void>();

/** Текущее настроение эмбиента (запоминается, даже если контекста ещё нет). */
let ambientMood: AmbientMood | null = null;
/** Играющий слой эмбиента (null — тишина). */
let ambient: AmbientLayer | null = null;

// ── Фоновая музыка: плейлист из треков владельца (public/audio) ─────────────

/** Треки фоновой музыки; играются по кругу с кроссфейдом на стыке. */
const TRACKS = [
  "/audio/beneath-the-ancient-boughs.mp3",
  "/audio/orbiting-the-unseen-sun.mp3",
] as const;

/** Какой трек подходит настроению: «лес» — спокойные фазы, «орбита» — финал. */
const MOOD_TRACK: Record<AmbientMood, number> = {
  development: 0,
  feeding: 0,
  extinction: 1,
  final: 1,
};

/** Музыка тише дронов при том же слайдере: исходный уровень трека велик. */
const TRACK_LEVEL = 0.55;

/** Декодированные треки и признак «файлы недоступны — играем процедурные дроны». */
const trackBufs = new Map<number, AudioBuffer>();
/** Незавершённый (или уже неуспешный) decode дедуплицируется по индексу. */
const trackLoads = new Map<number, Promise<AudioBuffer | null>>();
const trackFailures = new Set<number>();
let trackFailed = false;
/** Какой трек плейлиста играет сейчас (сдвигается на стыке треков). */
let trackIndex = 0;
/** Токен запроса загрузки: настроение могло смениться, пока файл качался. */
let trackLoadSeq = 0;

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

/** Разослать подписчикам «состояние звука изменилось» (подписчик не ломает шину). */
function notify() {
  for (const listener of Array.from(listeners)) {
    try {
      listener();
    } catch {
      // Ошибка чужого обработчика не должна гасить остальных подписчиков.
    }
  }
}

function loadEnabled(): boolean {
  if (typeof window === "undefined") return true; // SSR — сохранять некуда
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    // localStorage может быть недоступен — звук по умолчанию включён.
    return true;
  }
}

function readVolume(raw: unknown, fallback: number): number {
  return typeof raw === "number" && Number.isFinite(raw) ? clamp01(raw) : fallback;
}

function parseVolume(raw: string | null): SfxSettings {
  if (!raw) return { ...DEFAULT_VOLUME };
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      sfxVolume: readVolume(parsed.sfxVolume ?? parsed.sfx, DEFAULT_VOLUME.sfxVolume),
      ambientVolume: readVolume(
        parsed.ambientVolume ?? parsed.ambient,
        DEFAULT_VOLUME.ambientVolume,
      ),
    };
  } catch {
    // Битую запись игнорируем — вернём значения по умолчанию.
    return { ...DEFAULT_VOLUME };
  }
}

function loadVolume(): SfxSettings {
  if (typeof window === "undefined") return { ...DEFAULT_VOLUME };
  try {
    return parseVolume(localStorage.getItem(VOLUME_KEY));
  } catch {
    // localStorage может быть недоступен — возвращаем значения по умолчанию.
    return { ...DEFAULT_VOLUME };
  }
}

function saveVolume() {
  try {
    localStorage.setItem(VOLUME_KEY, JSON.stringify(volume));
  } catch {
    // приватный режим — просто не сохранится
  }
}

/** Запомнить флаг «звук включён» (старый формат «on»/«off» — не меняем). */
function saveEnabled() {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // приватный режим — просто не сохранится
  }
}

/** Плавно (или мгновенно) выставить значение AudioParam. */
function rampParam(param: AudioParam, value: number, t: number, dur: number) {
  const v = clamp01(value);
  param.cancelScheduledValues(t);
  param.setValueAtTime(Math.max(0.0001, param.value), t);
  if (dur <= 0) param.setValueAtTime(v, t);
  else param.linearRampToValueAtTime(v, t + dur);
}

/** Развести текущие громкости по шинам (после создания контекста или смены настроек). */
function applyVolume(fade = 0.03) {
  if (!ctx || !sfxBus || !ambientBus) return;
  const t = ctx.currentTime;
  rampParam(sfxBus.gain, volume.sfxVolume, t, fade);
  rampParam(ambientBus.gain, volume.ambientVolume, t, fade);
}

function pageIsVisible(): boolean {
  return typeof document === "undefined" || document.visibilityState !== "hidden";
}

function onContextStateChange(c: AudioContext) {
  if (ctx !== c || c.state !== "suspended") return;
  // Источники, запланированные до suspend, не должны проснуться позже и обойти
  // лимит: освобождаем их, а новый первый cue ставим в очередь.
  stopEventSources();
  recent.clear();
  contextWasSuspended = true;
  if (ambient !== null || ambientMood !== null) ambientResumeRequested = true;
}

/** Контекст создаётся только на клиенте и только после жеста пользователя. */
function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined" || !userGesture) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const c = new AC();
    ctx = c;
    master = c.createGain();
    master.gain.value = MASTER_GAIN;
    // master → muteGain → destination: последний рубильник, который гасит
    // сразу весь тракт (и эффекты, и дроны, и музыку).
    muteGain = c.createGain();
    muteGain.gain.value = enabled ? 1 : 0;
    master.connect(muteGain);
    muteGain.connect(c.destination);
    sfxBus = c.createGain();
    ambientBus = c.createGain();
    sfxBus.connect(master);
    ambientBus.connect(master);
    contextWasSuspended = c.state === "suspended";
    if (contextWasSuspended && ambientMood !== null) ambientResumeRequested = true;
    c.addEventListener("statechange", () => onContextStateChange(c));
    applyVolume(0);
  }
  return ctx;
}

/** Первый cue после системного suspend не теряем, а ставим в короткую очередь. */
function queueCue(id: SfxId, delay: number, scale: number, rateReserved = false) {
  if (pendingCue) return;
  pendingCue = { id, delay: Math.max(0, delay), scale, rateReserved };
}

function flushPendingCue() {
  const cue = pendingCue;
  const c = ctx;
  if (!cue || !c || c.state !== "running" || !enabled || !pageIsVisible()) return;
  pendingCue = null;
  if (!cue.rateReserved && !allowPlay(cue.id, c.currentTime + cue.delay)) return;
  playEffect(c, cue.id, cue.delay, cue.scale);
}

/**
 * Вернуть контекст из suspended и продолжить то, что было разрешено до ухода.
 * Повторные вызовы дедуплицируются одним promise.
 */
function resumeAudio(): Promise<boolean> {
  const c = ctx;
  if (!c || !userGesture || !pageIsVisible() || c.state === "closed") {
    return Promise.resolve(false);
  }
  if (resumePromise) return resumePromise;
  const needsRestart = c.state !== "running" || contextWasSuspended || ambientResumeRequested;
  const promise = (async () => {
    if (c.state !== "running") {
      try {
        await c.resume();
      } catch {
        return false;
      }
    }
    if (c.state !== "running") return false;
    contextWasSuspended = false;
    const restart = needsRestart || ambientResumeRequested;
    ambientResumeRequested = false;
    if (ambientShouldRun() && (restart || ambient === null)) maybeStartAmbient(restart);
    flushPendingCue();
    return true;
  })();
  resumePromise = promise;
  void promise.then(
    () => {
      if (resumePromise === promise) resumePromise = null;
    },
    () => {
      if (resumePromise === promise) resumePromise = null;
    },
  );
  return promise;
}

/** Восстановление после BFCache/возврата со suspend без создания контекста. */
function recoverAudio() {
  if (!ctx || !userGesture || !pageIsVisible()) return;
  if (ctx.state !== "running" || contextWasSuspended || ambientResumeRequested || pendingCue) {
    void resumeAudio();
    return;
  }
  if (ambientShouldRun() && ambient === null) maybeStartAmbient(false);
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

/** Куда и с каким множителем пишем конкретное проигрывание. */
interface Out {
  node: AudioNode;
  scale: number;
  voice?: VoiceLease;
}

function effectsOut(c: AudioContext, scale = 1, voice?: VoiceLease): Out {
  return { node: sfxBus ?? c.destination, scale: clamp01(scale), voice };
}

/** Сколько реальных источников создаёт каждый рецепт — для общего предохранителя. */
function recipeSourceCount(id: SfxId): number {
  const counts: Record<SfxId, number> = {
    roll: 5,
    hunt: 5,
    kill: 3,
    food: 2,
    foodBlue: 2,
    fat: 1,
    defense: 2,
    dodge: 1,
    death: 3,
    draw: 3,
    card: 2,
    flip: 2,
    phase: 1,
    mark: 2,
    plant: 2,
    win: 9,
    lose: 3,
    pass: 2,
    endTurn: 3,
    migrate: 3,
    grow: 3,
    wither: 2,
    burn: 3,
    join: 2,
    leave: 1,
    yourTurn: 5,
    click: 2,
    modal: 2,
    chat: 2,
    reaction: 2,
    cheer: 8,
    crack: 3,
  };
  return counts[id];
}

function releaseVoice(voice: VoiceLease) {
  if (voice.released) return;
  voice.released = true;
  activeVoices.delete(voice.token);
  activeVoiceCount = Math.max(0, activeVoiceCount - 1);
}

/**
 * Зарезервировать один cue целиком. Лишние события отбрасываются, а не
 * уменьшаются по громкости: уже выбранные уровни остаются неизменными.
 */
function reserveVoice(c: AudioContext, id: SfxId, sourceCount: number): VoiceLease | null {
  if (!c || sourceCount <= 0) return null;
  let sameId = 0;
  for (const voice of activeVoices.values()) {
    if (voice.id === id) sameId += 1;
  }
  if (
    sameId >= MAX_VOICES_PER_ID ||
    activeVoiceCount >= MAX_VOICES ||
    activeSourceCount + sourceCount > MAX_ACTIVE_SOURCES
  ) {
    return null;
  }
  const voice: VoiceLease = {
    token: nextVoiceToken++,
    id,
    sources: new Set(),
    released: false,
  };
  activeVoices.set(voice.token, voice);
  activeVoiceCount += 1;
  return voice;
}

/** Привязать Web Audio источник к lease и освободить его по `ended`. */
function trackSource(voice: VoiceLease | undefined, source: AudioScheduledSourceNode, dur: number, delay: number) {
  if (!voice) return;
  if (voice.released) {
    try {
      source.stop();
    } catch {
      // Источник мог быть уже остановлен.
    }
    return;
  }

  voice.sources.add(source);
  activeSourceCount += 1;
  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    sourceCleanup.delete(source);
    if (voice.sources.delete(source)) activeSourceCount = Math.max(0, activeSourceCount - 1);
    if (voice.sources.size === 0) releaseVoice(voice);
  };
  sourceCleanup.set(source, cleanup);
  source.addEventListener("ended", cleanup, { once: true });
  const timer = window.setTimeout(() => {
    try {
      source.stop();
    } catch {
      // Уже остановлен браузером — cleanup всё равно нужен.
    }
    cleanup();
  }, Math.max(0, delay + dur + 0.1) * 1000);
}

/** Немедленно снять событийные источники при mute и сбросить их учёт. */
function stopEventSources() {
  for (const [source, cleanup] of Array.from(sourceCleanup.entries())) {
    try {
      source.stop();
    } catch {
      // Источник уже завершён.
    }
    cleanup();
  }
  for (const voice of activeVoices.values()) voice.released = true;
  activeVoices.clear();
  activeVoiceCount = 0;
  activeSourceCount = 0;
  sourceCleanup.clear();
}

/** Выполнить рецепт через общий лимит голосов. */
function playEffect(c: AudioContext, id: SfxId, delay: number, scale: number): boolean {
  const voice = reserveVoice(c, id, recipeSourceCount(id));
  if (!voice) return false;
  perform(c, id, delay, effectsOut(c, scale, voice));
  if (voice.sources.size === 0) releaseVoice(voice);
  return true;
}

interface ToneOpts {
  freq: number;
  /** Конечная частота (глиссандо вниз/вверх). */
  to?: number;
  dur: number;
  gain?: number;
  type?: OscillatorType;
  delay?: number;
  /** Длительность атаки: больше — мягче вступление (для эмбиента и аккордов). */
  attack?: number;
}

/** Одна нота: быстрая атака и экспоненциальное затухание. */
function tone(c: AudioContext, o: ToneOpts, out: Out) {
  const t0 = c.currentTime + (o.delay ?? 0);
  const attack = Math.min(Math.max(0.004, o.attack ?? 0.012), o.dur * 0.9);
  const peak = Math.max(0.0001, (o.gain ?? 0.2) * out.scale);
  const osc = c.createOscillator();
  osc.type = o.type ?? "triangle";
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, o.to), t0 + o.dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g).connect(out.node);
  osc.start(t0);
  trackSource(out.voice, osc, o.dur + 0.05, o.delay ?? 0);
  osc.stop(t0 + o.dur + 0.05);
}

interface BurstOpts {
  dur: number;
  gain?: number;
  delay?: number;
  /** Полоса шума: «low» — глухой удар, «band» — щелчок кости, «high» — шелест бумаги. */
  band?: "low" | "band" | "high";
  freq?: number;
  /** Длительность атаки: больше — мягче/воздушнее вступление. */
  attack?: number;
}

/** Всплеск фильтрованного шума — удар, щелчок, шелест. */
function burst(c: AudioContext, o: BurstOpts, out: Out) {
  const t0 = c.currentTime + (o.delay ?? 0);
  const attack = Math.min(Math.max(0.004, o.attack ?? 0.008), o.dur * 0.9);
  const peak = Math.max(0.0001, (o.gain ?? 0.18) * out.scale);
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
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(filter).connect(g).connect(out.node);
  src.start(t0, Math.random() * 0.5);
  trackSource(out.voice, src, o.dur + 0.05, o.delay ?? 0);
  src.stop(t0 + o.dur + 0.05);
}

/** Шумовая «швабра»: полоса фильтра скользит от freq к to — взмахы и свушы. */
function sweep(c: AudioContext, o: BurstOpts & { to?: number }, out: Out) {
  const t0 = c.currentTime + (o.delay ?? 0);
  const attack = Math.min(Math.max(0.004, o.attack ?? 0.01), o.dur * 0.9);
  const peak = Math.max(0.0001, (o.gain ?? 0.12) * out.scale);
  const src = c.createBufferSource();
  src.buffer = noise(c);
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.1;
  const from = o.freq ?? 1200;
  filter.frequency.setValueAtTime(from, t0);
  filter.frequency.exponentialRampToValueAtTime(Math.max(60, o.to ?? from * 0.6), t0 + o.dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(filter).connect(g).connect(out.node);
  src.start(t0, Math.random() * 0.5);
  trackSource(out.voice, src, o.dur + 0.05, o.delay ?? 0);
  src.stop(t0 + o.dur + 0.05);
}

/** Лёгкая питч-вариативность ±3%: повторы не звучат как клоны. */
function vary(freq: number): number {
  return freq * (0.97 + Math.random() * 0.06);
}

// ── Эмбиент: процедурные дроны (фолбэк) и плейлист треков владельца ─────────

interface MoodVoice {
  freq: number;
  /** Куда медленно уползает высота за ~минуту (без мелодии). */
  to: number;
  type: OscillatorType;
  gain: number;
}

interface MoodSpec {
  voices: MoodVoice[];
  /** Срез ФНЧ и его медленный дрейф. */
  cutoff: number;
  cutoffDrift: number;
  /** Доля шумового слоя (ветер/листва) и его срез. */
  noise: number;
  noiseFreq: number;
  /** Частота «дыхания» громкости (Гц) и его глубина. */
  breath: number;
  depth: number;
}

const MOODS: Record<AmbientMood, MoodSpec> = {
  // Развитие: тёплый низкий дрон, спокойное дыхание.
  development: {
    voices: [
      { freq: 55, to: 56.5, type: "sine", gain: 0.5 },
      { freq: 82.5, to: 84.5, type: "sine", gain: 0.26 },
      { freq: 110, to: 112, type: "triangle", gain: 0.12 },
    ],
    cutoff: 420,
    cutoffDrift: 130,
    noise: 0.3,
    noiseFreq: 650,
    breath: 0.055,
    depth: 0.28,
  },
  // Кормление: чуть светлее и живее, шелест «листвы» заметнее.
  feeding: {
    voices: [
      { freq: 65.4, to: 66.5, type: "sine", gain: 0.46 },
      { freq: 98, to: 99.5, type: "sine", gain: 0.24 },
      { freq: 130.8, to: 132, type: "triangle", gain: 0.1 },
    ],
    cutoff: 620,
    cutoffDrift: 180,
    noise: 0.42,
    noiseFreq: 900,
    breath: 0.08,
    depth: 0.3,
  },
  // Вымирание: тёмный низ, медленное сползание вниз, глухой воздух.
  extinction: {
    voices: [
      { freq: 49, to: 47, type: "sine", gain: 0.5 },
      { freq: 58.3, to: 56, type: "sine", gain: 0.24 },
      { freq: 73.4, to: 70.5, type: "triangle", gain: 0.1 },
    ],
    cutoff: 300,
    cutoffDrift: 90,
    noise: 0.24,
    noiseFreq: 460,
    breath: 0.038,
    depth: 0.24,
  },
  // Финал: открытая квинта, больше «воздуха», но без пафоса.
  final: {
    voices: [
      { freq: 65.4, to: 64.5, type: "sine", gain: 0.44 },
      { freq: 98, to: 96.5, type: "sine", gain: 0.26 },
      { freq: 131, to: 128.5, type: "triangle", gain: 0.12 },
    ],
    cutoff: 780,
    cutoffDrift: 200,
    noise: 0.18,
    noiseFreq: 1050,
    breath: 0.07,
    depth: 0.3,
  },
};

interface AmbientLayer {
  mood: AmbientMood;
  out: GainNode;
  sources: AudioScheduledSourceNode[];
}

function buildAmbient(
  c: AudioContext,
  mood: AmbientMood,
  bus: GainNode,
  t0: number,
  fade: number,
): AmbientLayer {
  const spec = MOODS[mood];
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t0);
  out.gain.exponentialRampToValueAtTime(AMBIENT_LEVEL, t0 + Math.max(0.05, fade));
  out.connect(bus);

  // «Дыхание» громкости — отдельный гейн, чтобы не уводить out в минус.
  const breath = c.createGain();
  breath.gain.value = 1;
  breath.connect(out);
  const breathLfo = c.createOscillator();
  breathLfo.type = "sine";
  breathLfo.frequency.value = spec.breath;
  const breathDepth = c.createGain();
  breathDepth.gain.value = spec.depth;
  breathLfo.connect(breathDepth).connect(breath.gain);
  breathLfo.start(t0);

  // ФНЧ с очень медленным дрейфом среза (4 отрезка по 30 с).
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.7;
  filter.frequency.setValueAtTime(spec.cutoff, t0);
  for (let i = 0; i < 4; i++) {
    filter.frequency.linearRampToValueAtTime(
      i % 2 === 0 ? spec.cutoff + spec.cutoffDrift : spec.cutoff,
      t0 + 30 * (i + 1),
    );
  }
  filter.connect(breath);

  // Сверхмедленный LFO на срез — атмосфера «дышит», но не звучит как ритм.
  const filterLfo = c.createOscillator();
  filterLfo.type = "sine";
  filterLfo.frequency.value = Math.max(0.015, spec.breath * 0.4);
  const filterDepth = c.createGain();
  filterDepth.gain.value = spec.cutoffDrift * 0.8;
  filterLfo.connect(filterDepth).connect(filter.frequency);
  filterLfo.start(t0);

  const sources: AudioScheduledSourceNode[] = [breathLfo, filterLfo];

  // Голоса дрона: суммарно держим ниже единицы, чтобы пик не превышал уровень.
  const voiceSum = spec.voices.reduce((acc, v) => acc + v.gain, 0) || 1;
  const trim = 0.72 / voiceSum;
  for (const v of spec.voices) {
    const osc = c.createOscillator();
    osc.type = v.type;
    osc.frequency.setValueAtTime(v.freq, t0);
    osc.frequency.linearRampToValueAtTime(v.to, t0 + 40 + Math.random() * 20);
    const g = c.createGain();
    g.gain.value = v.gain * trim;
    osc.connect(g).connect(filter);
    osc.start(t0);
    sources.push(osc);
  }

  // Тихий шумовой слой: ветер/листва, только ФНЧ — без свиста и шипения.
  const wind = c.createBufferSource();
  wind.buffer = noise(c);
  wind.loop = true;
  const windFilter = c.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = spec.noiseFreq;
  windFilter.Q.value = 0.5;
  const windGain = c.createGain();
  windGain.gain.value = spec.noise * 0.15;
  wind.connect(windFilter).connect(windGain).connect(filter);
  wind.start(t0, Math.random() * 0.5);
  sources.push(wind);

  return { mood, out, sources };
}

/** Погасить текущий слой эмбиента за fade секунд и освободить узлы. */
function stopAmbient(fade = AMBIENT_FADE) {
  const layer = ambient;
  ambient = null;
  if (!layer || !ctx) return;
  const c = ctx;
  const t0 = c.currentTime;
  const stopAt = t0 + Math.max(0.01, fade) + 0.05;
  try {
    layer.out.gain.cancelScheduledValues(t0);
    layer.out.gain.setValueAtTime(Math.max(0.0001, layer.out.gain.value), t0);
    layer.out.gain.linearRampToValueAtTime(0.0001, t0 + Math.max(0.01, fade));
  } catch {
    // Параметр уже мог быть освобождён — гасим источники как есть.
  }
  for (const s of layer.sources) {
    try {
      s.stop(stopAt);
    } catch {
      // Источник уже остановлен.
    }
  }
  window.setTimeout(
    () => {
      try {
        layer.out.disconnect();
      } catch {
        // Узел уже отключён.
      }
    },
    (Math.max(0.01, fade) + 0.25) * 1000,
  );
}

/** Загрузить и декодировать трек ровно один раз на индекс, включая гонку. */
function loadTrack(c: AudioContext, index: number): Promise<AudioBuffer | null> {
  const cached = trackBufs.get(index);
  if (cached) return Promise.resolve(cached);
  if (trackFailures.has(index)) return Promise.resolve(null);
  const pending = trackLoads.get(index);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const res = await fetch(TRACKS[index]);
      if (!res.ok) throw new Error(String(res.status));
      const raw = await res.arrayBuffer();
      const decoded = await c.decodeAudioData(raw);
      trackBufs.set(index, decoded);
      return decoded;
    } catch {
      // Треки не отдались (деплой без файлов, сбой сети) — фолбэк на дроны.
      trackFailed = true;
      trackFailures.add(index);
      return null;
    } finally {
      // Неудачный результат оставляем в map, чтобы следующий mood не перезапрашивал URL.
      if (!trackFailures.has(index) && !trackBufs.has(index)) trackLoads.delete(index);
    }
  })();
  trackLoads.set(index, promise);
  return promise;
}

/**
 * Собрать слой фоновой музыки для текущего trackIndex: fade-in, а по
 * естественном окончании трека — переход на следующий плейлиста.
 */
function buildTrackLayer(
  c: AudioContext,
  mood: AmbientMood,
  t0: number,
  fade: number,
): AmbientLayer | null {
  const buf = trackBufs.get(trackIndex);
  if (!buf || !ambientBus) return null;
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t0);
  out.gain.exponentialRampToValueAtTime(AMBIENT_LEVEL * TRACK_LEVEL, t0 + Math.max(0.05, fade));
  out.connect(ambientBus);
  const src = c.createBufferSource();
  src.buffer = buf;
  const layer: AmbientLayer = { mood, out, sources: [src] };
  src.onended = () => {
    // Трек кончился сам: переходим на следующий плейлиста штатным кроссфейдом.
    if (ambient !== layer || !enabled || ambientMood === null || !ctx) return;
    trackIndex = (trackIndex + 1) % TRACKS.length;
    ambient = null;
    beginTrack(ctx, ambientMood);
  };
  src.connect(out);
  src.start(t0);
  return layer;
}

/** Загрузить текущий trackIndex и включить слой музыки; гонки гасит seq. */
function beginTrack(c: AudioContext, mood: AmbientMood) {
  const seq = ++trackLoadSeq;
  const index = trackIndex;
  void loadTrack(c, index).then((buf) => {
    if (seq !== trackLoadSeq || ambientMood !== mood || !enabled || !ambientBus) return;
    if (!buf) {
      ambient = buildAmbient(c, mood, ambientBus, c.currentTime, AMBIENT_FADE);
      return;
    }
    if (trackIndex !== index) return;
    const layer = buildTrackLayer(c, mood, c.currentTime, AMBIENT_FADE);
    ambient = layer ?? buildAmbient(c, mood, ambientBus, c.currentTime, AMBIENT_FADE);
  });
}

/** Запустить настроение с кроссфейдом, если это возможно прямо сейчас. */
function startAmbient(mood: AmbientMood, force = false) {
  const c = ctx;
  if (!c || c.state !== "running" || !ambientBus || !pageIsVisible()) return;
  if (!force && ambient?.mood === mood) return;
  stopAmbient(AMBIENT_FADE);
  if (trackFailed) {
    ambient = buildAmbient(c, mood, ambientBus, c.currentTime, AMBIENT_FADE);
    return;
  }
  // Смена настроения выбирает «свой» трек; естественный конец трека сам
  // сдвигает trackIndex (см. onended) и продолжается через beginTrack.
  trackIndex = MOOD_TRACK[mood];
  beginTrack(c, mood);
}

function ambientShouldRun(): boolean {
  return enabled && ambientMood !== null && volume.ambientVolume > 0;
}

/** Включить эмбиент, если он разрешён и контекст уже проснулся. */
function maybeStartAmbient(force = false) {
  if (!ambientShouldRun()) return;
  const c = ctx;
  if (!c || !userGesture) return;
  if (c.state !== "running") {
    void resumeAudio();
    return;
  }
  startAmbient(ambientMood!, force);
}

/**
 * Привести тракт в соответствие текущему `enabled`: опустить/поднять
 * master-mute и остановить/возобновить фон. Контекст здесь не создаётся —
 * на выключении он и не нужен, а на включении его готовит вызывающий
 * (обычно это пользовательский жест, см. `sfx.setEnabled`).
 */
function applyEnabledAudio() {
  if (enabled) {
    if (ctx && muteGain) rampParam(muteGain.gain, 1, ctx.currentTime, MUTE_FADE);
    maybeStartAmbient();
    return;
  }
  // Выключено: обесцениваем незавершённые загрузки трека (декодирование
  // может доехать уже после mute и запустить музыку) и гасим текущий слой.
  pendingCue = null;
  ambientResumeRequested = false;
  trackLoadSeq++;
  stopEventSources();
  if (ctx && muteGain) rampParam(muteGain.gain, 0, ctx.currentTime, MUTE_FADE);
  stopAmbient(0.2);
}

/**
 * Плавное затухание музыки при закрытии/перезагрузке страницы: обрыв «в полный
 * голос» звучит грязно, а 0.3 с обычно успевают проиграть до teardown.
 * Только pagehide — сворачивание вкладки музыку не глушит.
 */
if (typeof window !== "undefined") {
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      if (ambient !== null || ambientMood !== null) ambientResumeRequested = true;
      return;
    }
    recoverAudio();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pageshow", () => recoverAudio());

  // BFCache/pagehide: запоминаем намерение и глушим слой, чтобы pageshow мог
  // собрать его заново уже после успешного resume.
  window.addEventListener("pagehide", () => {
    if (ambient !== null || ambientMood !== null) ambientResumeRequested = true;
    stopAmbient(0.3);
  });

  // Другая вкладка переключила звук или громкость: подхватываем её значение,
  // чтобы иконки, ползунки и фактическая тишина не расходились. Контекст не
  // создаём — если его тут ещё нет, звучит и нечего, а эмбиент стартует после
  // первого жеста.
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const next = e.newValue !== "off";
      if (next === enabled) return;
      enabled = next;
      applyEnabledAudio();
      notify();
      return;
    }
    if (e.key !== VOLUME_KEY) return;
    const next = e.newValue === null ? loadVolume() : parseVolume(e.newValue);
    if (next.sfxVolume === volume.sfxVolume && next.ambientVolume === volume.ambientVolume) return;
    volume = next;
    applyVolume(0.03);
    if (volume.ambientVolume <= 0) {
      ambientResumeRequested = false;
      stopAmbient(0.15);
    } else {
      maybeStartAmbient();
    }
    notify();
  });
}

// HMR в dev-режиме подменяет модуль: старый AudioContext остался бы играть
// музыку в обход нового muteGain. Закрываем его явно.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    try {
      void ctx?.close();
    } catch {
      // Контекст уже закрыт.
    }
  });
}

// ── Рецепты коротких звуков ─────────────────────────────────────────────────

/** Композиции звуков: каждый ид — короткий рецепт из нот и шумов. */
function perform(c: AudioContext, id: SfxId, delay: number, out: Out) {
  switch (id) {
    case "roll":
      // Кость стучит по столу несколько раз, затихая.
      for (let i = 0; i < 4; i++) {
        burst(
          c,
          {
            dur: 0.05,
            gain: 0.16 - i * 0.03,
            band: "band",
            freq: 900 + i * 250,
            delay: delay + i * 0.07,
          },
          out,
        );
      }
      tone(c, { freq: 240, to: 180, dur: 0.1, gain: 0.08, type: "sine", delay: delay + 0.28 }, out);
      break;
    case "hunt": {
      // Рык: пила с глиссандо вниз и детюн-двойка, под ними глухой удар
      // и шумовой выдох — плотно, но без визга.
      const f = vary(108);
      tone(c, { freq: f, to: 66, dur: 0.34, gain: 0.13, type: "sawtooth", attack: 0.02, delay }, out);
      tone(
        c,
        { freq: f * 1.51, to: 96, dur: 0.3, gain: 0.06, type: "sawtooth", attack: 0.03, delay: delay + 0.02 },
        out,
      );
      burst(c, { dur: 0.1, gain: 0.09, band: "low", freq: 260, delay }, out);
      sweep(c, { dur: 0.3, gain: 0.05, freq: 500, to: 180, attack: 0.03, delay }, out);
      break;
    }
    case "kill": {
      // Удар добычи: глухой панч, под ним уходящий тон и короткий шорох падения.
      burst(c, { dur: 0.12, gain: 0.18, band: "low", freq: 210, delay }, out);
      tone(c, { freq: vary(88), to: 52, dur: 0.28, gain: 0.16, type: "sine", delay }, out);
      sweep(c, { dur: 0.24, gain: 0.05, freq: 900, to: 240, attack: 0.02, delay: delay + 0.05 }, out);
      break;
    }
    case "food":
      // Деревянный «пок» фишки.
      tone(c, { freq: 540, to: 620, dur: 0.09, gain: 0.16, delay }, out);
      tone(c, { freq: 270, dur: 0.06, gain: 0.07, type: "sine", delay }, out);
      break;
    case "foodBlue":
      tone(c, { freq: 420, to: 470, dur: 0.1, gain: 0.14, delay }, out);
      tone(c, { freq: 210, dur: 0.07, gain: 0.06, type: "sine", delay }, out);
      break;
    case "fat":
      tone(c, { freq: 200, to: 160, dur: 0.14, gain: 0.14, type: "sine", delay }, out);
      break;
    case "defense":
      burst(c, { dur: 0.06, gain: 0.16, band: "band", freq: 1100, delay }, out);
      tone(
        c,
        { freq: 300, to: 240, dur: 0.08, gain: 0.07, type: "sine", delay: delay + 0.02 },
        out,
      );
      break;
    case "dodge":
      // Восходящий свист — спаслось.
      tone(c, { freq: 430, to: 940, dur: 0.22, gain: 0.1, type: "sine", delay }, out);
      break;
    case "death": {
      // Уход животного: нисходящий вздох из двух голосов и низкий хвост.
      tone(c, { freq: vary(300), to: 128, dur: 0.52, gain: 0.12, type: "sine", attack: 0.03, delay }, out);
      tone(
        c,
        { freq: vary(150), to: 70, dur: 0.6, gain: 0.08, type: "triangle", attack: 0.05, delay: delay + 0.04 },
        out,
      );
      burst(c, { dur: 0.34, gain: 0.05, band: "low", freq: 380, attack: 0.06, delay }, out);
      break;
    }
    case "draw":
      // Раздача: каскад бумажных взмахов с лёгкой вариацией высоты.
      for (let i = 0; i < 3; i++) {
        sweep(
          c,
          {
            dur: 0.12,
            gain: 0.07,
            freq: 2300 + i * 350,
            to: 1500 + i * 260,
            attack: 0.02,
            delay: delay + i * 0.07,
          },
          out,
        );
      }
      break;
    case "card":
      // Карта легла: бумажный флик и мягкий деревянный тон.
      sweep(c, { dur: 0.07, gain: 0.06, freq: 2600, to: 1600, attack: 0.015, delay }, out);
      tone(c, { freq: vary(320), to: 285, dur: 0.08, gain: 0.1, delay }, out);
      break;
    case "flip":
      burst(c, { dur: 0.08, gain: 0.1, band: "high", freq: 2200, delay }, out);
      tone(c, { freq: 500, to: 380, dur: 0.1, gain: 0.1, delay: delay + 0.04 }, out);
      break;
    case "phase":
      // Тихий пергаментный свуш.
      burst(c, { dur: 0.22, gain: 0.06, band: "high", freq: 1800, delay }, out);
      break;
    case "mark":
      tone(c, { freq: 880, dur: 0.12, gain: 0.09, type: "sine", delay }, out);
      tone(c, { freq: 660, dur: 0.1, gain: 0.06, type: "sine", delay: delay + 0.08 }, out);
      break;
    case "plant":
      burst(c, { dur: 0.14, gain: 0.07, band: "high", freq: 1500, delay }, out);
      tone(
        c,
        { freq: 350, to: 480, dur: 0.16, gain: 0.08, type: "sine", delay: delay + 0.05 },
        out,
      );
      break;
    case "win": {
      // Победа: мажорное арпеджио из четырёх нот с тёплым верхом и мягким блеском.
      [392, 494, 587, 784].forEach((f, i) => {
        tone(
          c,
          {
            freq: vary(f),
            dur: i === 3 ? 0.5 : 0.2,
            gain: 0.12,
            type: "triangle",
            attack: 0.015,
            delay: delay + i * 0.13,
          },
          out,
        );
        tone(
          c,
          { freq: f / 2, dur: 0.3, gain: 0.05, type: "sine", attack: 0.02, delay: delay + i * 0.13 },
          out,
        );
      });
      burst(
        c,
        { dur: 0.4, gain: 0.035, band: "high", freq: 2800, attack: 0.12, delay: delay + 0.4 },
        out,
      );
      break;
    }
    case "lose": {
      // Поражение: тёмная нисходящая пара с низким вздохом.
      tone(c, { freq: 311, to: 296, dur: 0.24, gain: 0.11, type: "triangle", attack: 0.02, delay }, out);
      tone(
        c,
        { freq: 233, to: 207, dur: 0.5, gain: 0.11, type: "triangle", attack: 0.03, delay: delay + 0.22 },
        out,
      );
      tone(c, { freq: 116, to: 98, dur: 0.6, gain: 0.06, type: "sine", attack: 0.06, delay: delay + 0.22 }, out);
      break;
    }
    case "pass":
      // Пас: тихая карта ложится на стол — привлекать внимание незачем.
      burst(c, { dur: 0.05, gain: 0.045, band: "low", freq: 750, delay }, out);
      tone(c, { freq: 220, to: 200, dur: 0.07, gain: 0.05, type: "sine", delay }, out);
      break;
    case "endTurn":
      // Конец хода: двойной деревянный стук заметнее паса, но такой же мягкий.
      burst(c, { dur: 0.05, gain: 0.09, band: "band", freq: 820, delay }, out);
      tone(c, { freq: 262, to: 240, dur: 0.12, gain: 0.06, type: "sine", delay }, out);
      burst(c, { dur: 0.18, gain: 0.04, band: "high", freq: 1700, delay: delay + 0.05 }, out);
      break;
    case "migrate":
      // Миграция: две волны бумажного шелеста с лёгким подъёмом.
      burst(c, { dur: 0.2, gain: 0.06, band: "high", freq: 1300, attack: 0.06, delay }, out);
      burst(
        c,
        { dur: 0.18, gain: 0.05, band: "high", freq: 2100, attack: 0.05, delay: delay + 0.12 },
        out,
      );
      tone(
        c,
        { freq: 175, to: 215, dur: 0.3, gain: 0.045, type: "sine", attack: 0.05, delay },
        out,
      );
      break;
    case "grow":
      // Рост флоры: тёплый подъём тона и шорох листвы.
      burst(c, { dur: 0.28, gain: 0.05, band: "high", freq: 1000, attack: 0.1, delay }, out);
      tone(
        c,
        { freq: 180, to: 300, dur: 0.34, gain: 0.07, type: "sine", attack: 0.06, delay },
        out,
      );
      tone(
        c,
        {
          freq: 360,
          to: 430,
          dur: 0.26,
          gain: 0.035,
          type: "sine",
          attack: 0.08,
          delay: delay + 0.1,
        },
        out,
      );
      break;
    case "wither":
      // Увядание флоры: воздушный нисходящий выдох — тише и суше, чем death.
      tone(c, { freq: 260, to: 120, dur: 0.5, gain: 0.07, type: "sine", attack: 0.05, delay }, out);
      burst(c, { dur: 0.36, gain: 0.05, band: "high", freq: 1400, attack: 0.08, delay }, out);
      break;
    case "burn":
      // Сгорание остатков: глухое шумовое пламя без треска и свиста.
      burst(c, { dur: 0.5, gain: 0.08, band: "low", freq: 520, attack: 0.12, delay }, out);
      burst(
        c,
        { dur: 0.62, gain: 0.05, band: "low", freq: 240, attack: 0.2, delay: delay + 0.06 },
        out,
      );
      tone(c, { freq: 120, to: 90, dur: 0.46, gain: 0.05, type: "sine", delay: delay + 0.05 }, out);
      break;
    case "join":
      // Игрок сел за стол: короткий восходящий блип.
      tone(
        c,
        { freq: 330, to: 495, dur: 0.16, gain: 0.08, type: "sine", attack: 0.02, delay },
        out,
      );
      tone(
        c,
        { freq: 660, dur: 0.1, gain: 0.03, type: "sine", attack: 0.03, delay: delay + 0.06 },
        out,
      );
      break;
    case "leave":
      // Игрок встал из-за стола: нисходящий блип.
      tone(c, { freq: 440, to: 294, dur: 0.2, gain: 0.07, type: "sine", attack: 0.02, delay }, out);
      break;
    case "yourTurn":
      // «Ваш ход»: самый заметный из нейтральных — мягкий восходящий аккорд
      // с медленной атакой, без победного пафоса; низ держит опору.
      tone(c, { freq: 174.61, dur: 0.7, gain: 0.045, type: "sine", attack: 0.1, delay }, out);
      tone(c, { freq: 349.23, dur: 0.5, gain: 0.07, type: "sine", attack: 0.07, delay }, out);
      tone(
        c,
        { freq: 440, dur: 0.46, gain: 0.055, type: "sine", attack: 0.09, delay: delay + 0.09 },
        out,
      );
      tone(
        c,
        { freq: 523.25, dur: 0.5, gain: 0.05, type: "sine", attack: 0.11, delay: delay + 0.18 },
        out,
      );
      burst(
        c,
        { dur: 0.3, gain: 0.025, band: "high", freq: 2400, attack: 0.1, delay: delay + 0.18 },
        out,
      );
      break;
    case "click":
      // Нажатие UI: сухой и очень тихий щелчок.
      burst(c, { dur: 0.025, gain: 0.04, band: "band", freq: 1500, delay }, out);
      tone(c, { freq: 700, to: 640, dur: 0.04, gain: 0.025, type: "sine", delay }, out);
      break;
    case "modal":
      // Открытие/закрытие панели: тихий свуш с мягкой атакой.
      burst(c, { dur: 0.32, gain: 0.05, band: "high", freq: 1100, attack: 0.1, delay }, out);
      tone(
        c,
        { freq: 196, to: 175, dur: 0.34, gain: 0.035, type: "sine", attack: 0.08, delay },
        out,
      );
      break;
    case "chat":
      // Новое сообщение: приглушённый «дзинь» — чистые синусы без звона.
      tone(c, { freq: 660, dur: 0.2, gain: 0.055, type: "sine", attack: 0.02, delay }, out);
      tone(
        c,
        { freq: 990, dur: 0.26, gain: 0.03, type: "sine", attack: 0.02, delay: delay + 0.045 },
        out,
      );
      break;
    case "reaction":
      // Реакция зрителя: лёгкий двойной блип — заметно, но не липнет к уху.
      tone(c, { freq: vary(880), dur: 0.09, gain: 0.07, type: "triangle", attack: 0.008, delay }, out);
      tone(
        c,
        { freq: vary(1174), dur: 0.14, gain: 0.055, type: "triangle", attack: 0.01, delay: delay + 0.07 },
        out,
      );
      break;
    case "cheer": {
      // Поощрение: тёплый аккорд с медленной атакой и шорохом аплодисментов.
      [262, 330, 392].forEach((f, i) => {
        tone(
          c,
          { freq: vary(f), dur: 0.6, gain: 0.055, type: "sine", attack: 0.06, delay: delay + i * 0.03 },
          out,
        );
      });
      for (let i = 0; i < 5; i++) {
        burst(
          c,
          {
            dur: 0.06,
            gain: 0.03,
            band: "high",
            freq: 2600 + Math.random() * 900,
            attack: 0.012,
            delay: delay + 0.08 + i * 0.055,
          },
          out,
        );
      }
      break;
    }
    case "crack":
      // «Слом»: два очень тихих щелчка с сухим тоном — почти на пороге слышимости.
      burst(c, { dur: 0.025, gain: 0.035, band: "band", freq: 2100, delay }, out);
      burst(c, { dur: 0.02, gain: 0.025, band: "band", freq: 1500, delay: delay + 0.035 }, out);
      tone(c, { freq: 190, to: 150, dur: 0.05, gain: 0.02, type: "sine", delay }, out);
      break;
  }
}

/**
 * Не проигрывать один и тот же звук чаще RATE_MAX раз за RATE_WINDOW.
 * Считаем по запланированному времени (currentTime + delay), поэтому каскад
 * с разными задержками не режется как «одновременный» спам.
 */
function allowPlay(id: SfxId, scheduledAt: number): boolean {
  let times = recent.get(id);
  if (!times) {
    times = [];
    recent.set(id, times);
  }
  const cutoff = scheduledAt - RATE_WINDOW;
  while (times.length > 0 && times[0] < cutoff) times.shift();
  if (times.length >= RATE_MAX) return false;
  times.push(scheduledAt);
  return true;
}

export const sfx = {
  get enabled(): boolean {
    return enabled;
  },

  /**
   * Включить/выключить звук целиком. Выключение опускает master-mute (глохнет
   * всё: эффекты, дроны и музыка), гасит текущий слой фона и обесценивает
   * незавершённые загрузки треков; включение возвращает тракт к прежней
   * громкости (`evo-sound-volume`) и поднимает музыку заново.
   */
  setEnabled(v: boolean) {
    const next = Boolean(v);
    const changed = next !== enabled;
    enabled = next;
    saveEnabled();
    // Контекст создаётся только после отдельного unlock() из UI-жеста.
    const c = next ? ensureCtx() : null;
    applyEnabledAudio();
    if (next && c) {
      if (c.state === "running") {
        playEffect(c, "food", 0, 1); // слышимая отбивка «звук вернулся»
      } else if (c.state !== "closed") {
        queueCue("food", 0, 1);
      }
      void resumeAudio();
    }
    if (changed) notify();
  },

  /** Разбудить AudioContext по пользовательскому жесту (политики автоплея). */
  unlock() {
    userGesture = true;
    const c = ensureCtx();
    if (!c) return;
    void resumeAudio();
  },

  /**
   * Проиграть звук. delay — сдвиг в секундах, чтобы цепочка событий
   * звучала каскадом, а не одной кучей. opts.gain — множитель громкости
   * одного звука (0..1), чтобы приглушить чужие/фоновые события.
   */
  play(id: SfxId, delay = 0, opts?: PlayOptions) {
    if (!enabled) return;
    const scale = clamp01(opts?.gain ?? 1);
    if (scale <= 0) return;
    const c = ensureCtx();
    if (!c) return;
    const normalizedDelay = Math.max(0, delay);
    const at = c.currentTime + normalizedDelay;
    if (c.state !== "running") {
      if (c.state === "closed" || !allowPlay(id, at)) return;
      queueCue(id, normalizedDelay, scale, true);
      void resumeAudio();
      return;
    }
    if (!allowPlay(id, at)) return;
    playEffect(c, id, normalizedDelay, scale);
  },

  /** Текущие громкости шин: { sfxVolume, ambientVolume, sfx, ambient }. */
  get volume(): SfxVolumeState {
    return {
      sfxVolume: volume.sfxVolume,
      ambientVolume: volume.ambientVolume,
      sfx: volume.sfxVolume,
      ambient: volume.ambientVolume,
    };
  },

  /**
   * Подписка на смену включённости и громкостей (несколько экземпляров
   * тумблера на странице должны читать одну шину). Возвращает отписку.
   */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Диагностика для QA: тишину проверяют по `masterGain` — итоговому
   * коэффициенту перед `destination`, а не по одному флагу `enabled`.
   * `activeSources`/`activeVoices` показывают, что лимитер действительно
   * освобождает рецепты после `ended`, а `trackLoadSeq` — что висящая
   * загрузка обесценена и музыку после mute не запустит.
   */
  debugState(): {
    enabled: boolean;
    ambientActive: boolean;
    masterGain: number;
    muteGain: number;
    contextState: AudioContextState | "none";
    contextCount: number;
    activeSources: number;
    activeVoices: number;
    maxVoices: number;
    maxSources: number;
    pendingCue: boolean;
    userGesture: boolean;
    trackLoadSeq: number;
    trackCacheSize: number;
  } {
    const mute = muteGain ? muteGain.gain.value : enabled ? 1 : 0;
    return {
      enabled,
      ambientActive: ambient !== null,
      masterGain: (master ? master.gain.value : MASTER_GAIN) * mute,
      muteGain: mute,
      contextState: ctx ? ctx.state : "none",
      contextCount: ctx ? 1 : 0,
      activeSources: activeSourceCount,
      activeVoices: activeVoiceCount,
      maxVoices: MAX_VOICES,
      maxSources: MAX_ACTIVE_SOURCES,
      pendingCue: pendingCue !== null,
      userGesture,
      trackLoadSeq,
      trackCacheSize: trackBufs.size,
    };
  },

  /** Обновить громкости (частично), 0..1. Сохраняется в localStorage. */
  setVolume(partial: Partial<SfxSettings> & { sfx?: number; ambient?: number }) {
    const next: SfxSettings = { ...volume };
    if (typeof partial.sfxVolume === "number") next.sfxVolume = clamp01(partial.sfxVolume);
    else if (typeof partial.sfx === "number") next.sfxVolume = clamp01(partial.sfx);
    if (typeof partial.ambientVolume === "number")
      next.ambientVolume = clamp01(partial.ambientVolume);
    else if (typeof partial.ambient === "number") next.ambientVolume = clamp01(partial.ambient);
    volume = next;
    saveVolume();
    applyVolume(0.03);
    if (volume.ambientVolume <= 0) {
      // Громкость фона в нуле — слой не держим вообще.
      ambientResumeRequested = false;
      stopAmbient(0.15);
    } else {
      maybeStartAmbient();
    }
    notify();
  },

  /**
   * Сменить настроение фонового эмбиента (кроссфейд ~1 с) или выключить его
   * (`null`). Если AudioContext ещё не создан (не было жеста пользователя),
   * настроение просто запоминается и включится после `unlock()`.
   */
  setAmbient(mood: AmbientMood | null) {
    ambientMood = mood;
    if (mood === null) {
      ambientResumeRequested = false;
      stopAmbient(AMBIENT_FADE);
      return;
    }
    maybeStartAmbient();
  },
};
