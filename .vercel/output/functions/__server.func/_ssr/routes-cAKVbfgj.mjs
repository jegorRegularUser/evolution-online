import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { l as require_react_dom, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { A as isCarnivoreLike, B as pollInput, C as createRoomInput, D as findAnimal, E as feedBlockReason, F as legalDefenseActions, G as spectateInput, H as roomInfoInput, I as legalDevActions, K as spectatorPollInput, L as legalFeedActions, M as joinRoomInput, N as kickInput, O as foodNeeded, P as kickWaiterInput, R as liveScore, S as createGame, T as deckSizeFor, U as settingsInput, V as reactionInput, W as speciesNeed, _ as canRageAttack, a as MUTATIONS_TRAIT_IDS, b as chooseAIAction, c as PLANTS_TRAIT_IDS, d as TRAIT_ORDER, f as actionInput, g as canPlantAttackTarget, h as canAttack, i as MARKS, j as isFed, k as hasTrait, l as REACTION_EMOJI, m as botsInput, n as FLORA, p as applyAction, q as transferHostInput, r as FUNGI_TRAIT_IDS, s as PLANTS, t as CONTINENTS_TRAIT_IDS, u as TRAITS, v as capacityInput, w as currentActor, x as codeTokenInput, y as chatInput, z as player } from "./ai-Cj12FNHE.mjs";
import { A as Layers, B as Copy, C as Minimize2, D as List, E as Lock, F as Flame, G as Check, H as ChevronRight, I as Eye, J as BookOpen, K as ChartColumn, L as Dna, M as GraduationCap, N as Globe, O as Lightbulb, P as Flower2, R as Dices, S as Minus, T as LogOut, U as ChevronLeft, V as Clock, W as ChevronDown, X as ArrowDown, Y as ArrowLeftRight, _ as RotateCcw, a as Volume2, b as Play, c as Undo2, d as Swords, f as Sprout, g as Send, h as Settings2, i as VolumeX, j as History, k as LayoutGrid, l as Trophy, m as Shield, n as Wind, o as Users, p as Skull, q as Bot, r as Wheat, s as UserMinus, t as X, u as TriangleAlert, v as Puzzle, w as Microscope, x as Mountain, y as Plus, z as Crosshair } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Plane, c as World, i as Material, n as Box, o as SAPBroadphase, r as ContactMaterial, s as Vec3, t as Body } from "../_libs/cannon-es.mjs";
import { a as DirectionalLight, c as MeshStandardMaterial, d as Quaternion, f as SRGBColorSpace, i as CanvasTexture, l as OrthographicCamera, m as ShadowMaterial, n as AmbientLight, o as Euler, p as Scene, r as BoxGeometry, s as Mesh, t as WebGLRenderer, u as PlaneGeometry } from "../_libs/three.mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-cAKVbfgj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface text-fg border border-border hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface",
			outline: "border border-border bg-transparent text-fg hover:bg-surface",
			parchment: "bg-parchment text-ink hover:bg-parchment-2",
			danger: "bg-danger text-parchment hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-[var(--radius-md)] px-4 text-sm",
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-xs",
			md: "h-12 rounded-[var(--radius-md)] px-5 text-sm",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			icon: "size-11 rounded-[var(--radius-md)]",
			iconSm: "size-9 rounded-[var(--radius-sm)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
/** Порядок отрисовки и канонические названия территорий. */
var TERRITORIES = [
	{
		id: "laurasia",
		name: "Лавразия"
	},
	{
		id: "gondwana",
		name: "Гондвана"
	},
	{
		id: "ocean",
		name: "Океан"
	}
];
var STORAGE_KEY = "evo-sound";
var VOLUME_KEY = "evo-sound-volume";
var MASTER_GAIN = .4;
var DEFAULT_VOLUME = {
	sfxVolume: 1,
	ambientVolume: .5
};
/**
* Rate-limit одинаковых звуков: не больше 3 за 200 мс. Окно чуть меньше
* 3×70 мс, поэтому каскад useSfx (шаг 70 мс) проходит целиком, а плотный
* залп одинаковых событий (например, 8 «food» в одном кадре) обрезается.
* Учитывается и задержка: звуки, запланированные на разные моменты, не
* считаются «одновременным» спамом.
*/
var RATE_WINDOW = .2;
var RATE_MAX = 3;
/** Целевой уровень эмбиента относительно master (с учётом «дыхания» ≤ ~0.15). */
var AMBIENT_LEVEL = .12;
/** Длительность кроссфейда смены настроения, секунды. */
var AMBIENT_FADE = 1;
var ctx = null;
var master = null;
var sfxBus = null;
var ambientBus = null;
var noiseBuf = null;
var enabled = loadEnabled();
var volume = loadVolume();
/** Времена последних запланированных проигрываний по каждому id (секунды). */
var recent = /* @__PURE__ */ new Map();
/** Текущее настроение эмбиента (запоминается, даже если контекста ещё нет). */
var ambientMood = null;
/** Играющий слой эмбиента (null — тишина). */
var ambient = null;
/** Треки фоновой музыки; играются по кругу с кроссфейдом на стыке. */
var TRACKS = ["/audio/beneath-the-ancient-boughs.mp3", "/audio/orbiting-the-unseen-sun.mp3"];
/** Какой трек подходит настроению: «лес» — спокойные фазы, «орбита» — финал. */
var MOOD_TRACK = {
	development: 0,
	feeding: 0,
	extinction: 1,
	final: 1
};
/** Музыка тише дронов при том же слайдере: исходный уровень трека велик. */
var TRACK_LEVEL = .55;
/** Декодированные треки и признак «файлы недоступны — играем процедурные дроны». */
var trackBufs = /* @__PURE__ */ new Map();
var trackFailed = false;
/** Какой трек плейлиста играет сейчас (сдвигается на стыке треков). */
var trackIndex = 0;
/** Токен запроса загрузки: настроение могло смениться, пока файл качался. */
var trackLoadSeq = 0;
function clamp01(v) {
	if (!Number.isFinite(v)) return 0;
	return Math.min(1, Math.max(0, v));
}
function loadEnabled() {
	if (typeof window === "undefined") return true;
	try {
		return localStorage.getItem(STORAGE_KEY) !== "off";
	} catch {
		return true;
	}
}
function readVolume(raw, fallback) {
	return typeof raw === "number" && Number.isFinite(raw) ? clamp01(raw) : fallback;
}
function loadVolume() {
	if (typeof window === "undefined") return { ...DEFAULT_VOLUME };
	try {
		const raw = localStorage.getItem(VOLUME_KEY);
		if (!raw) return { ...DEFAULT_VOLUME };
		const parsed = JSON.parse(raw);
		return {
			sfxVolume: readVolume(parsed.sfxVolume ?? parsed.sfx, DEFAULT_VOLUME.sfxVolume),
			ambientVolume: readVolume(parsed.ambientVolume ?? parsed.ambient, DEFAULT_VOLUME.ambientVolume)
		};
	} catch {
		return { ...DEFAULT_VOLUME };
	}
}
function saveVolume() {
	try {
		localStorage.setItem(VOLUME_KEY, JSON.stringify(volume));
	} catch {}
}
/** Плавно (или мгновенно) выставить значение AudioParam. */
function rampParam(param, value, t, dur) {
	const v = clamp01(value);
	param.cancelScheduledValues(t);
	param.setValueAtTime(Math.max(1e-4, param.value), t);
	if (dur <= 0) param.setValueAtTime(v, t);
	else param.linearRampToValueAtTime(v, t + dur);
}
/** Развести текущие громкости по шинам (после создания контекста или смены настроек). */
function applyVolume(fade = .03) {
	if (!ctx || !sfxBus || !ambientBus) return;
	const t = ctx.currentTime;
	rampParam(sfxBus.gain, volume.sfxVolume, t, fade);
	rampParam(ambientBus.gain, volume.ambientVolume, t, fade);
}
/** Контекст создаётся только на клиенте и по мере надобности. */
function ensureCtx() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const AC = window.AudioContext ?? window.webkitAudioContext;
		if (!AC) return null;
		ctx = new AC();
		master = ctx.createGain();
		master.gain.value = MASTER_GAIN;
		master.connect(ctx.destination);
		sfxBus = ctx.createGain();
		ambientBus = ctx.createGain();
		sfxBus.connect(master);
		ambientBus.connect(master);
		applyVolume(0);
	}
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
/** Общий буфер белого шума — источник для щелчков и шелестов. */
function noise(c) {
	if (!noiseBuf) {
		noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
		const data = noiseBuf.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
	}
	return noiseBuf;
}
function effectsOut(c, scale = 1) {
	return {
		node: sfxBus ?? c.destination,
		scale: clamp01(scale)
	};
}
/** Одна нота: быстрая атака и экспоненциальное затухание. */
function tone(c, o, out) {
	const t0 = c.currentTime + (o.delay ?? 0);
	const attack = Math.min(Math.max(.004, o.attack ?? .012), o.dur * .9);
	const peak = Math.max(1e-4, (o.gain ?? .2) * out.scale);
	const osc = c.createOscillator();
	osc.type = o.type ?? "triangle";
	osc.frequency.setValueAtTime(o.freq, t0);
	if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, o.to), t0 + o.dur);
	const g = c.createGain();
	g.gain.setValueAtTime(1e-4, t0);
	g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
	g.gain.exponentialRampToValueAtTime(1e-4, t0 + o.dur);
	osc.connect(g).connect(out.node);
	osc.start(t0);
	osc.stop(t0 + o.dur + .05);
}
/** Всплеск фильтрованного шума — удар, щелчок, шелест. */
function burst(c, o, out) {
	const t0 = c.currentTime + (o.delay ?? 0);
	const attack = Math.min(Math.max(.004, o.attack ?? .008), o.dur * .9);
	const peak = Math.max(1e-4, (o.gain ?? .18) * out.scale);
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
	g.gain.setValueAtTime(1e-4, t0);
	g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
	g.gain.exponentialRampToValueAtTime(1e-4, t0 + o.dur);
	src.connect(filter).connect(g).connect(out.node);
	src.start(t0, Math.random() * .5);
	src.stop(t0 + o.dur + .05);
}
/** Шумовая «швабра»: полоса фильтра скользит от freq к to — взмахы и свушы. */
function sweep(c, o, out) {
	const t0 = c.currentTime + (o.delay ?? 0);
	const attack = Math.min(Math.max(.004, o.attack ?? .01), o.dur * .9);
	const peak = Math.max(1e-4, (o.gain ?? .12) * out.scale);
	const src = c.createBufferSource();
	src.buffer = noise(c);
	src.loop = true;
	const filter = c.createBiquadFilter();
	filter.type = "bandpass";
	filter.Q.value = 1.1;
	const from = o.freq ?? 1200;
	filter.frequency.setValueAtTime(from, t0);
	filter.frequency.exponentialRampToValueAtTime(Math.max(60, o.to ?? from * .6), t0 + o.dur);
	const g = c.createGain();
	g.gain.setValueAtTime(1e-4, t0);
	g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
	g.gain.exponentialRampToValueAtTime(1e-4, t0 + o.dur);
	src.connect(filter).connect(g).connect(out.node);
	src.start(t0, Math.random() * .5);
	src.stop(t0 + o.dur + .05);
}
/** Лёгкая питч-вариативность ±3%: повторы не звучат как клоны. */
function vary(freq) {
	return freq * (.97 + Math.random() * .06);
}
var MOODS = {
	development: {
		voices: [
			{
				freq: 55,
				to: 56.5,
				type: "sine",
				gain: .5
			},
			{
				freq: 82.5,
				to: 84.5,
				type: "sine",
				gain: .26
			},
			{
				freq: 110,
				to: 112,
				type: "triangle",
				gain: .12
			}
		],
		cutoff: 420,
		cutoffDrift: 130,
		noise: .3,
		noiseFreq: 650,
		breath: .055,
		depth: .28
	},
	feeding: {
		voices: [
			{
				freq: 65.4,
				to: 66.5,
				type: "sine",
				gain: .46
			},
			{
				freq: 98,
				to: 99.5,
				type: "sine",
				gain: .24
			},
			{
				freq: 130.8,
				to: 132,
				type: "triangle",
				gain: .1
			}
		],
		cutoff: 620,
		cutoffDrift: 180,
		noise: .42,
		noiseFreq: 900,
		breath: .08,
		depth: .3
	},
	extinction: {
		voices: [
			{
				freq: 49,
				to: 47,
				type: "sine",
				gain: .5
			},
			{
				freq: 58.3,
				to: 56,
				type: "sine",
				gain: .24
			},
			{
				freq: 73.4,
				to: 70.5,
				type: "triangle",
				gain: .1
			}
		],
		cutoff: 300,
		cutoffDrift: 90,
		noise: .24,
		noiseFreq: 460,
		breath: .038,
		depth: .24
	},
	final: {
		voices: [
			{
				freq: 65.4,
				to: 64.5,
				type: "sine",
				gain: .44
			},
			{
				freq: 98,
				to: 96.5,
				type: "sine",
				gain: .26
			},
			{
				freq: 131,
				to: 128.5,
				type: "triangle",
				gain: .12
			}
		],
		cutoff: 780,
		cutoffDrift: 200,
		noise: .18,
		noiseFreq: 1050,
		breath: .07,
		depth: .3
	}
};
function buildAmbient(c, mood, bus, t0, fade) {
	const spec = MOODS[mood];
	const out = c.createGain();
	out.gain.setValueAtTime(1e-4, t0);
	out.gain.exponentialRampToValueAtTime(AMBIENT_LEVEL, t0 + Math.max(.05, fade));
	out.connect(bus);
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
	const filter = c.createBiquadFilter();
	filter.type = "lowpass";
	filter.Q.value = .7;
	filter.frequency.setValueAtTime(spec.cutoff, t0);
	for (let i = 0; i < 4; i++) filter.frequency.linearRampToValueAtTime(i % 2 === 0 ? spec.cutoff + spec.cutoffDrift : spec.cutoff, t0 + 30 * (i + 1));
	filter.connect(breath);
	const filterLfo = c.createOscillator();
	filterLfo.type = "sine";
	filterLfo.frequency.value = Math.max(.015, spec.breath * .4);
	const filterDepth = c.createGain();
	filterDepth.gain.value = spec.cutoffDrift * .8;
	filterLfo.connect(filterDepth).connect(filter.frequency);
	filterLfo.start(t0);
	const sources = [breathLfo, filterLfo];
	const trim = .72 / (spec.voices.reduce((acc, v) => acc + v.gain, 0) || 1);
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
	const wind = c.createBufferSource();
	wind.buffer = noise(c);
	wind.loop = true;
	const windFilter = c.createBiquadFilter();
	windFilter.type = "lowpass";
	windFilter.frequency.value = spec.noiseFreq;
	windFilter.Q.value = .5;
	const windGain = c.createGain();
	windGain.gain.value = spec.noise * .15;
	wind.connect(windFilter).connect(windGain).connect(filter);
	wind.start(t0, Math.random() * .5);
	sources.push(wind);
	return {
		mood,
		out,
		sources
	};
}
/** Погасить текущий слой эмбиента за fade секунд и освободить узлы. */
function stopAmbient(fade = AMBIENT_FADE) {
	const layer = ambient;
	ambient = null;
	if (!layer || !ctx) return;
	const t0 = ctx.currentTime;
	const stopAt = t0 + Math.max(.01, fade) + .05;
	try {
		layer.out.gain.cancelScheduledValues(t0);
		layer.out.gain.setValueAtTime(Math.max(1e-4, layer.out.gain.value), t0);
		layer.out.gain.linearRampToValueAtTime(1e-4, t0 + Math.max(.01, fade));
	} catch {}
	for (const s of layer.sources) try {
		s.stop(stopAt);
	} catch {}
	window.setTimeout(() => {
		try {
			layer.out.disconnect();
		} catch {}
	}, (Math.max(.01, fade) + .25) * 1e3);
}
/** Декодировать трек (кэш по индексу); false — файл недоступен. */
async function loadTrack(c, index) {
	if (trackBufs.has(index)) return true;
	try {
		const res = await fetch(TRACKS[index]);
		if (!res.ok) throw new Error(String(res.status));
		const raw = await res.arrayBuffer();
		trackBufs.set(index, await c.decodeAudioData(raw));
		return true;
	} catch {
		trackFailed = true;
		return false;
	}
}
/**
* Собрать слой фоновой музыки для текущего trackIndex: fade-in, а по
* естественном окончании трека — переход на следующий плейлиста.
*/
function buildTrackLayer(c, mood, t0, fade) {
	const buf = trackBufs.get(trackIndex);
	if (!buf || !ambientBus) return null;
	const out = c.createGain();
	out.gain.setValueAtTime(1e-4, t0);
	out.gain.exponentialRampToValueAtTime(AMBIENT_LEVEL * TRACK_LEVEL, t0 + Math.max(.05, fade));
	out.connect(ambientBus);
	const src = c.createBufferSource();
	src.buffer = buf;
	const layer = {
		mood,
		out,
		sources: [src]
	};
	src.onended = () => {
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
function beginTrack(c, mood) {
	const seq = ++trackLoadSeq;
	loadTrack(c, trackIndex).then((ok) => {
		if (seq !== trackLoadSeq || ambientMood !== mood || !enabled || !ambientBus) return;
		if (!ok) {
			ambient = buildAmbient(c, mood, ambientBus, c.currentTime, AMBIENT_FADE);
			return;
		}
		ambient = buildTrackLayer(c, mood, c.currentTime, AMBIENT_FADE) ?? buildAmbient(c, mood, ambientBus, c.currentTime, AMBIENT_FADE);
	});
}
/** Запустить настроение с кроссфейдом, если это возможно прямо сейчас. */
function startAmbient(mood) {
	const c = ctx;
	if (!c || c.state !== "running" || !ambientBus) return;
	if (ambient?.mood === mood) return;
	stopAmbient(AMBIENT_FADE);
	if (trackFailed) {
		ambient = buildAmbient(c, mood, ambientBus, c.currentTime, AMBIENT_FADE);
		return;
	}
	trackIndex = MOOD_TRACK[mood];
	beginTrack(c, mood);
}
/** Включить эмбиент, если он разрешён и контекст уже проснулся. */
function maybeStartAmbient() {
	if (!enabled || !ambientMood || volume.ambientVolume <= 0) return;
	startAmbient(ambientMood);
}
/**
* Плавное затухание музыки при закрытии/перезагрузке страницы: обрыв «в полный
* голос» звучит грязно, а 0.3 с обычно успевают проиграть до teardown.
* Только pagehide — сворачивание вкладки музыку не глушит.
*/
if (typeof window !== "undefined") window.addEventListener("pagehide", () => stopAmbient(.3));
/** Композиции звуков: каждый ид — короткий рецепт из нот и шумов. */
function perform(c, id, delay, out) {
	switch (id) {
		case "roll":
			for (let i = 0; i < 4; i++) burst(c, {
				dur: .05,
				gain: .16 - i * .03,
				band: "band",
				freq: 900 + i * 250,
				delay: delay + i * .07
			}, out);
			tone(c, {
				freq: 240,
				to: 180,
				dur: .1,
				gain: .08,
				type: "sine",
				delay: delay + .28
			}, out);
			break;
		case "hunt": {
			const f = vary(108);
			tone(c, {
				freq: f,
				to: 66,
				dur: .34,
				gain: .13,
				type: "sawtooth",
				attack: .02,
				delay
			}, out);
			tone(c, {
				freq: f * 1.51,
				to: 96,
				dur: .3,
				gain: .06,
				type: "sawtooth",
				attack: .03,
				delay: delay + .02
			}, out);
			burst(c, {
				dur: .1,
				gain: .09,
				band: "low",
				freq: 260,
				delay
			}, out);
			sweep(c, {
				dur: .3,
				gain: .05,
				freq: 500,
				to: 180,
				attack: .03,
				delay
			}, out);
			break;
		}
		case "kill":
			burst(c, {
				dur: .12,
				gain: .18,
				band: "low",
				freq: 210,
				delay
			}, out);
			tone(c, {
				freq: vary(88),
				to: 52,
				dur: .28,
				gain: .16,
				type: "sine",
				delay
			}, out);
			sweep(c, {
				dur: .24,
				gain: .05,
				freq: 900,
				to: 240,
				attack: .02,
				delay: delay + .05
			}, out);
			break;
		case "food":
			tone(c, {
				freq: 540,
				to: 620,
				dur: .09,
				gain: .16,
				delay
			}, out);
			tone(c, {
				freq: 270,
				dur: .06,
				gain: .07,
				type: "sine",
				delay
			}, out);
			break;
		case "foodBlue":
			tone(c, {
				freq: 420,
				to: 470,
				dur: .1,
				gain: .14,
				delay
			}, out);
			tone(c, {
				freq: 210,
				dur: .07,
				gain: .06,
				type: "sine",
				delay
			}, out);
			break;
		case "fat":
			tone(c, {
				freq: 200,
				to: 160,
				dur: .14,
				gain: .14,
				type: "sine",
				delay
			}, out);
			break;
		case "defense":
			burst(c, {
				dur: .06,
				gain: .16,
				band: "band",
				freq: 1100,
				delay
			}, out);
			tone(c, {
				freq: 300,
				to: 240,
				dur: .08,
				gain: .07,
				type: "sine",
				delay: delay + .02
			}, out);
			break;
		case "dodge":
			tone(c, {
				freq: 430,
				to: 940,
				dur: .22,
				gain: .1,
				type: "sine",
				delay
			}, out);
			break;
		case "death":
			tone(c, {
				freq: vary(300),
				to: 128,
				dur: .52,
				gain: .12,
				type: "sine",
				attack: .03,
				delay
			}, out);
			tone(c, {
				freq: vary(150),
				to: 70,
				dur: .6,
				gain: .08,
				type: "triangle",
				attack: .05,
				delay: delay + .04
			}, out);
			burst(c, {
				dur: .34,
				gain: .05,
				band: "low",
				freq: 380,
				attack: .06,
				delay
			}, out);
			break;
		case "draw":
			for (let i = 0; i < 3; i++) sweep(c, {
				dur: .12,
				gain: .07,
				freq: 2300 + i * 350,
				to: 1500 + i * 260,
				attack: .02,
				delay: delay + i * .07
			}, out);
			break;
		case "card":
			sweep(c, {
				dur: .07,
				gain: .06,
				freq: 2600,
				to: 1600,
				attack: .015,
				delay
			}, out);
			tone(c, {
				freq: vary(320),
				to: 285,
				dur: .08,
				gain: .1,
				delay
			}, out);
			break;
		case "flip":
			burst(c, {
				dur: .08,
				gain: .1,
				band: "high",
				freq: 2200,
				delay
			}, out);
			tone(c, {
				freq: 500,
				to: 380,
				dur: .1,
				gain: .1,
				delay: delay + .04
			}, out);
			break;
		case "phase":
			burst(c, {
				dur: .22,
				gain: .06,
				band: "high",
				freq: 1800,
				delay
			}, out);
			break;
		case "mark":
			tone(c, {
				freq: 880,
				dur: .12,
				gain: .09,
				type: "sine",
				delay
			}, out);
			tone(c, {
				freq: 660,
				dur: .1,
				gain: .06,
				type: "sine",
				delay: delay + .08
			}, out);
			break;
		case "plant":
			burst(c, {
				dur: .14,
				gain: .07,
				band: "high",
				freq: 1500,
				delay
			}, out);
			tone(c, {
				freq: 350,
				to: 480,
				dur: .16,
				gain: .08,
				type: "sine",
				delay: delay + .05
			}, out);
			break;
		case "win":
			[
				392,
				494,
				587,
				784
			].forEach((f, i) => {
				tone(c, {
					freq: vary(f),
					dur: i === 3 ? .5 : .2,
					gain: .12,
					type: "triangle",
					attack: .015,
					delay: delay + i * .13
				}, out);
				tone(c, {
					freq: f / 2,
					dur: .3,
					gain: .05,
					type: "sine",
					attack: .02,
					delay: delay + i * .13
				}, out);
			});
			burst(c, {
				dur: .4,
				gain: .035,
				band: "high",
				freq: 2800,
				attack: .12,
				delay: delay + .4
			}, out);
			break;
		case "lose":
			tone(c, {
				freq: 311,
				to: 296,
				dur: .24,
				gain: .11,
				type: "triangle",
				attack: .02,
				delay
			}, out);
			tone(c, {
				freq: 233,
				to: 207,
				dur: .5,
				gain: .11,
				type: "triangle",
				attack: .03,
				delay: delay + .22
			}, out);
			tone(c, {
				freq: 116,
				to: 98,
				dur: .6,
				gain: .06,
				type: "sine",
				attack: .06,
				delay: delay + .22
			}, out);
			break;
		case "pass":
			burst(c, {
				dur: .05,
				gain: .045,
				band: "low",
				freq: 750,
				delay
			}, out);
			tone(c, {
				freq: 220,
				to: 200,
				dur: .07,
				gain: .05,
				type: "sine",
				delay
			}, out);
			break;
		case "endTurn":
			burst(c, {
				dur: .05,
				gain: .09,
				band: "band",
				freq: 820,
				delay
			}, out);
			tone(c, {
				freq: 262,
				to: 240,
				dur: .12,
				gain: .06,
				type: "sine",
				delay
			}, out);
			burst(c, {
				dur: .18,
				gain: .04,
				band: "high",
				freq: 1700,
				delay: delay + .05
			}, out);
			break;
		case "migrate":
			burst(c, {
				dur: .2,
				gain: .06,
				band: "high",
				freq: 1300,
				attack: .06,
				delay
			}, out);
			burst(c, {
				dur: .18,
				gain: .05,
				band: "high",
				freq: 2100,
				attack: .05,
				delay: delay + .12
			}, out);
			tone(c, {
				freq: 175,
				to: 215,
				dur: .3,
				gain: .045,
				type: "sine",
				attack: .05,
				delay
			}, out);
			break;
		case "grow":
			burst(c, {
				dur: .28,
				gain: .05,
				band: "high",
				freq: 1e3,
				attack: .1,
				delay
			}, out);
			tone(c, {
				freq: 180,
				to: 300,
				dur: .34,
				gain: .07,
				type: "sine",
				attack: .06,
				delay
			}, out);
			tone(c, {
				freq: 360,
				to: 430,
				dur: .26,
				gain: .035,
				type: "sine",
				attack: .08,
				delay: delay + .1
			}, out);
			break;
		case "wither":
			tone(c, {
				freq: 260,
				to: 120,
				dur: .5,
				gain: .07,
				type: "sine",
				attack: .05,
				delay
			}, out);
			burst(c, {
				dur: .36,
				gain: .05,
				band: "high",
				freq: 1400,
				attack: .08,
				delay
			}, out);
			break;
		case "burn":
			burst(c, {
				dur: .5,
				gain: .08,
				band: "low",
				freq: 520,
				attack: .12,
				delay
			}, out);
			burst(c, {
				dur: .62,
				gain: .05,
				band: "low",
				freq: 240,
				attack: .2,
				delay: delay + .06
			}, out);
			tone(c, {
				freq: 120,
				to: 90,
				dur: .46,
				gain: .05,
				type: "sine",
				delay: delay + .05
			}, out);
			break;
		case "join":
			tone(c, {
				freq: 330,
				to: 495,
				dur: .16,
				gain: .08,
				type: "sine",
				attack: .02,
				delay
			}, out);
			tone(c, {
				freq: 660,
				dur: .1,
				gain: .03,
				type: "sine",
				attack: .03,
				delay: delay + .06
			}, out);
			break;
		case "leave":
			tone(c, {
				freq: 440,
				to: 294,
				dur: .2,
				gain: .07,
				type: "sine",
				attack: .02,
				delay
			}, out);
			break;
		case "yourTurn":
			tone(c, {
				freq: 174.61,
				dur: .7,
				gain: .045,
				type: "sine",
				attack: .1,
				delay
			}, out);
			tone(c, {
				freq: 349.23,
				dur: .5,
				gain: .07,
				type: "sine",
				attack: .07,
				delay
			}, out);
			tone(c, {
				freq: 440,
				dur: .46,
				gain: .055,
				type: "sine",
				attack: .09,
				delay: delay + .09
			}, out);
			tone(c, {
				freq: 523.25,
				dur: .5,
				gain: .05,
				type: "sine",
				attack: .11,
				delay: delay + .18
			}, out);
			burst(c, {
				dur: .3,
				gain: .025,
				band: "high",
				freq: 2400,
				attack: .1,
				delay: delay + .18
			}, out);
			break;
		case "click":
			burst(c, {
				dur: .025,
				gain: .04,
				band: "band",
				freq: 1500,
				delay
			}, out);
			tone(c, {
				freq: 700,
				to: 640,
				dur: .04,
				gain: .025,
				type: "sine",
				delay
			}, out);
			break;
		case "modal":
			burst(c, {
				dur: .32,
				gain: .05,
				band: "high",
				freq: 1100,
				attack: .1,
				delay
			}, out);
			tone(c, {
				freq: 196,
				to: 175,
				dur: .34,
				gain: .035,
				type: "sine",
				attack: .08,
				delay
			}, out);
			break;
		case "chat":
			tone(c, {
				freq: 660,
				dur: .2,
				gain: .055,
				type: "sine",
				attack: .02,
				delay
			}, out);
			tone(c, {
				freq: 990,
				dur: .26,
				gain: .03,
				type: "sine",
				attack: .02,
				delay: delay + .045
			}, out);
			break;
		case "reaction":
			tone(c, {
				freq: vary(880),
				dur: .09,
				gain: .07,
				type: "triangle",
				attack: .008,
				delay
			}, out);
			tone(c, {
				freq: vary(1174),
				dur: .14,
				gain: .055,
				type: "triangle",
				attack: .01,
				delay: delay + .07
			}, out);
			break;
		case "cheer":
			[
				262,
				330,
				392
			].forEach((f, i) => {
				tone(c, {
					freq: vary(f),
					dur: .6,
					gain: .055,
					type: "sine",
					attack: .06,
					delay: delay + i * .03
				}, out);
			});
			for (let i = 0; i < 5; i++) burst(c, {
				dur: .06,
				gain: .03,
				band: "high",
				freq: 2600 + Math.random() * 900,
				attack: .012,
				delay: delay + .08 + i * .055
			}, out);
			break;
		case "crack":
			burst(c, {
				dur: .025,
				gain: .035,
				band: "band",
				freq: 2100,
				delay
			}, out);
			burst(c, {
				dur: .02,
				gain: .025,
				band: "band",
				freq: 1500,
				delay: delay + .035
			}, out);
			tone(c, {
				freq: 190,
				to: 150,
				dur: .05,
				gain: .02,
				type: "sine",
				delay
			}, out);
	}
}
/**
* Не проигрывать один и тот же звук чаще RATE_MAX раз за RATE_WINDOW.
* Считаем по запланированному времени (currentTime + delay), поэтому каскад
* с разными задержками не режется как «одновременный» спам.
*/
function allowPlay(id, scheduledAt) {
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
var sfx = {
	get enabled() {
		return enabled;
	},
	setEnabled(v) {
		enabled = v;
		try {
			localStorage.setItem(STORAGE_KEY, v ? "on" : "off");
		} catch {}
		if (!v) {
			stopAmbient(.2);
			return;
		}
		const c = ensureCtx();
		if (c) {
			perform(c, "food", 0, effectsOut(c));
			if (c.state === "running") maybeStartAmbient();
			else c.resume().then(maybeStartAmbient).catch(() => {});
		}
	},
	/** Разбудить AudioContext по пользовательскому жесту (политики автоплея). */
	unlock() {
		const c = ensureCtx();
		if (!c) return;
		if (c.state === "running") maybeStartAmbient();
		else c.resume().then(maybeStartAmbient).catch(() => {});
	},
	/**
	* Проиграть звук. delay — сдвиг в секундах, чтобы цепочка событий
	* звучала каскадом, а не одной кучей. opts.gain — множитель громкости
	* одного звука (0..1), чтобы приглушить чужие/фоновые события.
	*/
	play(id, delay = 0, opts) {
		if (!enabled) return;
		const scale = clamp01(opts?.gain ?? 1);
		if (scale <= 0) return;
		const c = ensureCtx();
		if (!c || c.state !== "running") return;
		if (!allowPlay(id, c.currentTime + Math.max(0, delay))) return;
		perform(c, id, Math.max(0, delay), effectsOut(c, scale));
	},
	/** Текущие громкости шин: { sfxVolume, ambientVolume, sfx, ambient }. */
	get volume() {
		return {
			sfxVolume: volume.sfxVolume,
			ambientVolume: volume.ambientVolume,
			sfx: volume.sfxVolume,
			ambient: volume.ambientVolume
		};
	},
	/** Обновить громкости (частично), 0..1. Сохраняется в localStorage. */
	setVolume(partial) {
		const next = { ...volume };
		if (typeof partial.sfxVolume === "number") next.sfxVolume = clamp01(partial.sfxVolume);
		else if (typeof partial.sfx === "number") next.sfxVolume = clamp01(partial.sfx);
		if (typeof partial.ambientVolume === "number") next.ambientVolume = clamp01(partial.ambientVolume);
		else if (typeof partial.ambient === "number") next.ambientVolume = clamp01(partial.ambient);
		volume = next;
		saveVolume();
		applyVolume(.03);
		if (volume.ambientVolume <= 0) stopAmbient(.15);
		else maybeStartAmbient();
	},
	/**
	* Сменить настроение фонового эмбиента (кроссфейд ~1 с) или выключить его
	* (`null`). Если AudioContext ещё не создан (не было жеста пользователя),
	* настроение просто запоминается и включится после `unlock()`.
	*/
	setAmbient(mood) {
		ambientMood = mood;
		if (mood === null) {
			stopAmbient(AMBIENT_FADE);
			return;
		}
		maybeStartAmbient();
	}
};
/**
* Локальная статистика и достижения — в localStorage, без сервера.
* Работает и для соло-партий, и для сетевых: событие партии одно и то же.
*
* Партии накапливаются сессионными счётчиками (охоты, еда, защиты…),
* которые UI собирает из событий последнего действия, а при финале
*recordGame записывает одну строку истории и проверяет достижения.
*/
var KEY = "evo-stats";
var MAX_GAMES = 50;
function emptySession() {
	return {
		hunts: 0,
		kills: 0,
		food: 0,
		deaths: 0,
		dodges: 0,
		traits: {},
		maxTraits: 0
	};
}
var ACHIEVEMENTS = [
	{
		id: "first-win",
		name: "Первая победа",
		desc: "Победить в партии",
		icon: Trophy,
		check: (c) => c.game.won
	},
	{
		id: "wins-5",
		name: "Естественный отбор",
		desc: "5 побед за всё время",
		icon: Trophy,
		check: (c) => c.totalWins >= 5
	},
	{
		id: "streak-3",
		name: "Вид-доминант",
		desc: "3 победы подряд",
		icon: Flame,
		check: (c) => c.streak >= 3
	},
	{
		id: "apex",
		name: "Апекс-хищник",
		desc: "Объявить 5 и более атак за партию",
		icon: Crosshair,
		check: (c) => c.session.hunts >= 5
	},
	{
		id: "gourmet",
		name: "Изобилие",
		desc: "Собрать 15 и более фишек еды за партию",
		icon: Wheat,
		check: (c) => c.session.food >= 15
	},
	{
		id: "clean-pop",
		name: "Чистая популяция",
		desc: "Победа без единой потери животного",
		icon: Shield,
		check: (c) => c.game.won && c.session.deaths === 0
	},
	{
		id: "hard-win",
		name: "Давление среды",
		desc: "Победа на сложности «Жёстче»",
		icon: Mountain,
		check: (c) => c.game.won && c.game.difficulty === "hard"
	},
	{
		id: "big-table",
		name: "Перенаселение",
		desc: "Партия за столом на 8 игроков",
		icon: Users,
		check: (c) => c.game.players >= 8
	},
	{
		id: "win-continents",
		name: "Пангея",
		desc: "Победа с дополнением «Континенты»",
		icon: Globe,
		check: (c) => c.game.won && c.game.modules.includes("continents")
	},
	{
		id: "win-plants",
		name: "Садовник",
		desc: "Победа с дополнением «Растения»",
		icon: Sprout,
		check: (c) => c.game.won && c.game.modules.includes("plants")
	},
	{
		id: "win-fungi",
		name: "Грибник",
		desc: "Победа с дополнением «Трава и грибы»",
		icon: Flower2,
		check: (c) => c.game.won && c.game.modules.includes("fungi")
	},
	{
		id: "win-mutations",
		name: "Радиация",
		desc: "Победа с дополнением «Случайные мутации»",
		icon: Dna,
		check: (c) => c.game.won && c.game.modules.includes("randomMutations")
	},
	{
		id: "all-modules",
		name: "Полная экосистема",
		desc: "Партия со всеми четырьмя дополнениями",
		icon: Layers,
		check: (c) => c.game.modules.length >= 4
	},
	{
		id: "darwin",
		name: "Дарвинизм",
		desc: "Сыграть 25 партий",
		icon: Microscope,
		check: (c) => c.totalGames >= 25
	},
	{
		id: "escape",
		name: "Спасение бегством",
		desc: "3 успешные защиты за партию",
		icon: Wind,
		check: (c) => c.session.dodges >= 3
	},
	{
		id: "five-traits",
		name: "Сложный организм",
		desc: "Животное с пятью свойствами",
		icon: Puzzle,
		check: (c) => c.session.maxTraits >= 5
	}
];
function loadStats() {
	if (typeof window === "undefined") return {
		games: [],
		achievements: {}
	};
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			return {
				games: parsed.games ?? [],
				achievements: parsed.achievements ?? {}
			};
		}
	} catch {}
	return {
		games: [],
		achievements: {}
	};
}
function save(s) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, JSON.stringify(s));
	} catch {}
}
/**
* Записать завершённую партию и разблокировать достижения.
* Возвращает список только что открытых (для тостов).
*/
function recordGame(state, session, mode) {
	if (state.phase !== "gameOver") return [];
	const s = loadStats();
	const scores = state.scores ?? [];
	const place = Math.max(1, scores.findIndex((x) => x.playerId === state.humanId) + 1);
	const record = {
		date: Date.now(),
		mode,
		players: state.players.length,
		difficulty: state.difficulty,
		modules: Object.entries(state.modules).filter(([, v]) => v).map(([k]) => k),
		place,
		score: scores.find((x) => x.playerId === state.humanId)?.total ?? 0,
		won: (state.winnerIds ?? []).includes(state.humanId),
		year: state.year,
		traits: session.traits
	};
	s.games.push(record);
	if (s.games.length > MAX_GAMES) s.games = s.games.slice(-50);
	let streak = 0;
	for (let i = s.games.length - 1; i >= 0; i--) if (s.games[i].won) streak++;
	else break;
	const totalWins = s.games.filter((g) => g.won).length;
	const unlocked = [];
	for (const a of ACHIEVEMENTS) {
		if (s.achievements[a.id]) continue;
		if (a.check({
			game: record,
			session,
			totalGames: s.games.length,
			totalWins,
			streak
		})) {
			s.achievements[a.id] = Date.now();
			unlocked.push(a);
		}
	}
	save(s);
	return unlocked;
}
/** Итоги для экрана статистики: считаются на месте из истории. */
function readStats() {
	return loadStats();
}
/**
* Реестр арт-ассетов (public/img, собираются scripts/build-art.mjs из assets/).
* Стиль: винтажный натуралистический атлас — тушь и акварель на пергаменте.
*/
/**
* Арт карт свойств. У mimicry арт — гравюра на чёрном (см. DARK_ART).
* Свойства «Континентов» имеют собственные картинки; если какой-то ключ
* временно без арта, UI рисует векторный глиф (см. hasTraitArt).
*/
var TRAIT_ART = {
	carnivore: "/img/trait/carnivore.jpg",
	swimming: "/img/trait/swimming.jpg",
	camouflage: "/img/trait/camouflage.jpg",
	sharpVision: "/img/trait/sharpVision.jpg",
	burrowing: "/img/trait/burrowing.jpg",
	scavenger: "/img/trait/scavenger.jpg",
	symbiosis: "/img/trait/symbiosis.jpg",
	piracy: "/img/trait/piracy.jpg",
	tailLoss: "/img/trait/tailLoss.jpg",
	grazing: "/img/trait/grazing.jpg",
	cooperation: "/img/trait/cooperation.jpg",
	running: "/img/trait/running.jpg",
	highBodyWeight: "/img/trait/highBodyWeight.jpg",
	parasite: "/img/trait/parasite.jpg",
	fatTissue: "/img/trait/fatTissue.jpg",
	communication: "/img/trait/communication.jpg",
	poisonous: "/img/trait/poisonous.jpg",
	hibernation: "/img/trait/hibernation.jpg",
	mimicry: "/img/trait/mimicry.jpg",
	migration: "/img/trait/migration.jpg",
	remora: "/img/trait/remora.jpg",
	herding: "/img/trait/herding.jpg",
	nematocysts: "/img/trait/nematocysts.jpg",
	regeneration: "/img/trait/regeneration.jpg",
	recombination: "/img/trait/recombination.jpg",
	edificator: "/img/trait/edificator.jpg",
	neoplasia: "/img/trait/neoplasia.jpg",
	plantWater: "/img/trait/plantWater.jpg",
	thorny: "/img/trait/thorny.jpg",
	rootVegetable: "/img/trait/rootVegetable.jpg",
	medicinal: "/img/trait/medicinal.jpg",
	plantParasite: "/img/trait/plantParasite.jpg",
	micorrhiza: "/img/trait/micorrhiza.jpg",
	tree: "/img/trait/tree.jpg",
	nutritious: "/img/trait/nutritious.jpg",
	honeyPlant: "/img/trait/honeyPlant.jpg",
	transparent: "/img/trait/transparent.jpg",
	insectivore: "/img/trait/insectivore.jpg",
	obligateCarnivore: "/img/trait/obligateCarnivore.jpg",
	budding: "/img/trait/budding.jpg",
	metabolicSyndrome: "/img/trait/metabolicSyndrome.jpg",
	barkBeetle: "/img/trait/barkBeetle.jpg",
	extremophile: "/img/trait/extremophile.jpg",
	developmentDefects: "/img/trait/developmentDefects.jpg",
	simplification: "/img/trait/simplification.jpg"
};
/**
* Арты с чёрным фоном рисуются на тёмной плашке. Сейчас все карты сделаны
* в одном пергаментном стиле, поэтому набор пуст — исключения добавляются сюда.
*/
var DARK_ART = /* @__PURE__ */ new Set();
/** Медальон вида по рациону и телосложению. */
function speciesArt(opts) {
	if (opts.swimming) return "/img/species/aquatic.jpg";
	if (opts.carnivore) return opts.bulky ? "/img/species/carn-large.jpg" : "/img/species/carn-medium.jpg";
	return opts.bulky ? "/img/species/herb-large.jpg" : "/img/species/herb-medium.jpg";
}
var SPECIES_EXTINCT = "/img/species/extinct.jpg";
/**
* Жетоны еды. red — фишка из кормовой базы, blue — мясо и всё, что приходит
* от свойств (охота, сотрудничество, пиратство, падальщик, хвост, жир).
* population — жетон численности вида («Случайные мутации», тёмная эмблема).
*/
var TOKEN = {
	meat: "/img/token/meat.jpg",
	red: "/img/token/meat.jpg",
	blue: "/img/token/blue.jpg",
	plant: "/img/token/plant.jpg",
	fat: "/img/token/fat.jpg",
	population: "/img/token/population.jpg"
};
/** Мета-арт «Случайных мутаций»: рубашка слепой колоды, флип вскрытия, иконка. */
var MUTATION_ART = {
	deckBack: "/img/mutation/deckback.jpg",
	flip: "/img/mutation/flip.jpg",
	icon: "/img/mutation/icon.jpg"
};
/** Фоны и крупные декорации. */
var BG = {
	menu: "/img/bg/menu.jpg",
	valley: "/img/bg/valley.jpg",
	extinction: "/img/bg/extinction.jpg",
	victory: "/img/bg/victory.jpg",
	bankBowl: "/img/bg/bank-bowl.jpg",
	cardBack: "/img/meta/card-back.jpg",
	/** Бумажная текстура: подложка всего стола («всё лежит на бумаге»). */
	paper: "/img/bg/texture-paper.jpg",
	/** Сукно: центральное поле кормовой базы. */
	felt: "/img/bg/texture-felt.jpg",
	/** Вода: полоса океана в табло игрока. */
	water: "/img/bg/texture-water.jpg",
	ocean: "/img/bg/ocean.jpg"
};
var LOGO = "/img/meta/logo-emblem.png";
/** Иконка фазы года (гравюра на чёрном). */
var PHASE_ICON = {
	development: "/img/phase/development.png",
	foodBank: "/img/phase/roll-food.png",
	feeding: "/img/phase/feeding.png",
	extinction: "/img/phase/extinction.png"
};
/** Арты территорий «Континентов»: фон полос и миниатюры банков. */
var TERRITORY_ART = {
	laurasia: "/img/world/laurasia.jpg",
	gondwana: "/img/world/gondwana.jpg",
	ocean: "/img/world/ocean.jpg"
};
/** Арты видов растений «Растений» (4:3, верх карточки растения). */
var PLANT_ART = {
	liana: "/img/plant/liana.jpg",
	fungus: "/img/plant/fungus.jpg",
	carnivorous: "/img/plant/carnivorous.jpg",
	annual: "/img/plant/annual.jpg",
	legume: "/img/plant/legume.jpg",
	perennial: "/img/plant/perennial.jpg",
	grass: "/img/plant/grass.jpg",
	succulent: "/img/plant/succulent.jpg",
	fruit: "/img/plant/fruit.jpg",
	parasite: "/img/plant/parasite.jpg"
};
/**
* Арты карт флоры «Травы и грибов» (3:2, верх карточки флоры 4:3 с object-cover).
*/
var FLORA_ART = {
	toadstool: "/img/flora/toadstool.jpg",
	mold: "/img/flora/mold.jpg",
	madCap: "/img/flora/madCap.jpg",
	flyAgaric: "/img/flora/flyAgaric.jpg",
	insight: "/img/flora/insight.jpg",
	soaring: "/img/flora/soaring.jpg",
	sleepGrass: "/img/flora/sleepGrass.jpg",
	thryn: "/img/flora/thryn.jpg",
	datura: "/img/flora/datura.jpg",
	smile: "/img/flora/smile.jpg",
	cleanser: "/img/flora/cleanser.jpg",
	passionflower: "/img/flora/passionflower.jpg"
};
/** Жетоны меток последствий «Травы и грибов» (1:1, тёмный фон #101010). */
var MARK_ART = {
	poison: "/img/mark/poison.jpg",
	antidote: "/img/mark/antidote.jpg",
	madness: "/img/mark/madness.jpg",
	rage: "/img/mark/rage.jpg",
	sleep: "/img/mark/sleep.jpg",
	thryn: "/img/mark/thryn.jpg",
	haze: "/img/mark/haze.jpg",
	pacifism: "/img/mark/pacifism.jpg"
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Клиентские вызовы сетевого слоя: createServerFn-обёртки над сервисом
* комнат. Ошибки сервиса (NetError) отдаются полем `error`, а не броском —
* чтобы текст доходил до UI без разбора формата ошибок TanStack Start.
* Машиночитаемый `code` (kicked/seat-taken/room-gone) позволяет сессии
* отличить «чинить связь» от «места больше нет».
*/
var netCreateRoom = createServerFn({ method: "POST" }).validator(createRoomInput).handler(createSsrRpc("5d10ae946134fb6b27bc7c68ea783639ad617431c539331dc58524d97407b4bb"));
var netJoinRoom = createServerFn({ method: "POST" }).validator(joinRoomInput).handler(createSsrRpc("20bb5f392b3e05a16098d48523e3b73255d44092301929c9ed9a4bed4959d3d0"));
var netRejoin = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("9be6f8dbb902e4d7a86ed61a5ec451298b7693cb95cd353b30302c3968525e24"));
var netSetBots = createServerFn({ method: "POST" }).validator(botsInput).handler(createSsrRpc("0ae6763f4a9392d1dc978022ba9a80b0b3aa8d50b84dfd2903b7639f24bfb552"));
var netKick = createServerFn({ method: "POST" }).validator(kickInput).handler(createSsrRpc("fc1d0b35176a800d8b3842e8acc96a7ac0c86234a693afc1c829068eea6c2d17"));
var netSetCapacity = createServerFn({ method: "POST" }).validator(capacityInput).handler(createSsrRpc("14d6256128aa0959545fb4a848837599d1e846ecdbdb8a1d74a6f7011a2ce4fd"));
var netSetSettings = createServerFn({ method: "POST" }).validator(settingsInput).handler(createSsrRpc("052ff9dfc236bd0e1ff1a962b0659ec3f2343e685982ac4ea46dbc2a5c6c93dd"));
var netTransferHost = createServerFn({ method: "POST" }).validator(transferHostInput).handler(createSsrRpc("b6e16925f8dea3e55e70b929ead0135b8dbf491c796f2bc20222a71969975540"));
var netKickWaiter = createServerFn({ method: "POST" }).validator(kickWaiterInput).handler(createSsrRpc("77458ceff388f54d00051c41e26ba9da5450ff9a0991ee4e0f03c3612cfd48e3"));
/** Поллинг лобби для ожидающего: статус, места, очередь, свободное место. */
var netRoomInfo = createServerFn({ method: "POST" }).validator(roomInfoInput).handler(createSsrRpc("e9edd1f6cab243b2b1387028a5e185e4c9d038d81c4079de8752e760bfb05745"));
/** Занять освободившееся место из очереди (одним действием). */
var netClaimSeat = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("817dba9d018a54d9d1f8db2118a3e88ee47f87c735e346de37f37247b0b7db75"));
var netLeaveQueue = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("e93383b5647ec0a72ceef449d96876a16800ef6dad33d4e3233c9a64f988fa5b"));
var netChat = createServerFn({ method: "POST" }).validator(chatInput).handler(createSsrRpc("13eed1a17da62dcb9e70eec71b4e8a976934b02a5dcff01613a937167cd6f9b3"));
var netSpectate = createServerFn({ method: "POST" }).validator(spectateInput).handler(createSsrRpc("d4f11d2f35652a14c7006852467cb5ddf47674736c584cc4fd1a035dafd457c4"));
var netSpectatorPoll = createServerFn({ method: "POST" }).validator(spectatorPollInput).handler(createSsrRpc("7027acf2c9da3ca327d58640cca56e593fd6d897f85525ed64c21cabee308f2c"));
var netReaction = createServerFn({ method: "POST" }).validator(reactionInput).handler(createSsrRpc("28b67066d7856a0b8f76eba41be987486847193af04d0f5db299eaffecb7430c"));
var netStart = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("fafa464b4c4488361c51f863768135107e02c148e255f23da160ffa440fc3f99"));
var netAction = createServerFn({ method: "POST" }).validator(actionInput).handler(createSsrRpc("18b6efd10626f6282f46662236a9f4efa95081d933b3c79a203a2bf43f221fa0"));
var netPoll = createServerFn({ method: "POST" }).validator(pollInput).handler(createSsrRpc("97c6cf3f2776e31a2770acfbc62d86143077f49705e3043649873d49707919d1"));
var netAgain = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("c863eef5e87854022b362f26f321d98a7752563244b6bf8043f48c6e5e79acfc"));
/**
* Клиентский драйвер сетевой партии: держит код стола и токен места,
* тянет состояние циклом опроса с бэкоффом, переживает обрывы (токен
* сохранён в localStorage — F5 и закрытие вкладки безболезненны).
* Никакого React: стор подписывается через хуки NetHooks.
*
* Ожидающий (мест не хватило) опрашивает лобби, а когда место освобождается —
* автоматически занимает его; отдельный токен очереди хранится рядом с местом.
*/
var NAME_KEY = "evo-net-name";
var tokKey = (code) => `evo-seat-${code}`;
var queueKey = (code) => `evo-queue-${code}`;
/** Тексты для кодов, после которых переподключение не поможет. */
function fatalText(code) {
	if (code === "kicked") return "Вас удалили из-за стола";
	if (code === "seat-taken") return "Место больше не существует — вероятно, вас удалили";
	if (code === "room-gone") return "Стол больше не существует";
	return null;
}
function statusOf(status) {
	if (status === "playing") return "playing";
	if (status === "finished") return "finished";
	return "lobby";
}
function loadName() {
	try {
		return localStorage.getItem(NAME_KEY) ?? "";
	} catch {
		return "";
	}
}
function saveName(name) {
	try {
		const n = name.trim();
		if (n) localStorage.setItem(NAME_KEY, n);
	} catch {}
}
function loadToken(code) {
	try {
		return localStorage.getItem(tokKey(code));
	} catch {
		return null;
	}
}
function saveToken(code, token) {
	try {
		localStorage.setItem(tokKey(code), token);
	} catch {}
}
function removeToken(code) {
	try {
		localStorage.removeItem(tokKey(code));
	} catch {}
}
function loadQueueToken(code) {
	try {
		return localStorage.getItem(queueKey(code));
	} catch {
		return null;
	}
}
function saveQueueToken(code, token) {
	try {
		localStorage.setItem(queueKey(code), token);
	} catch {}
}
function clearQueueToken(code) {
	try {
		localStorage.removeItem(queueKey(code));
	} catch {}
}
/**
* Есть ли на этом устройстве сохранённая сессия стола: место, очередь или
* зрительский токен. Нужно, чтобы по ссылке `?room=` не пытаться «вернуться»
* там, где возвращаться некуда, и не терять предзаполненную форму входа.
*/
function hasStoredSession(code) {
	const codeUp = code.toUpperCase();
	let watched = null;
	try {
		watched = localStorage.getItem(`evo-watch-${codeUp}`);
	} catch {
		watched = null;
	}
	return Boolean(loadToken(codeUp) || loadQueueToken(codeUp) || watched);
}
var NetSession = class {
	hooks;
	code = "";
	token = "";
	lastVersion;
	lastChatId;
	lastReactionId;
	/** Клиент — зритель: отдельный поллинг, ходы и действия запрещены. */
	spectating = false;
	timer = null;
	failCount = 0;
	stopped = false;
	lastOwnMoveAt = 0;
	/** Текущий статус партии (для выхода из reconnecting). */
	seenStatus = "lobby";
	wasReconnecting = false;
	/** Место не досталось — опрашиваем очередь, пока не освободится. */
	waiting = false;
	claiming = false;
	constructor(hooks) {
		this.hooks = hooks;
	}
	async create(input) {
		saveName(input.name);
		const r = await netCreateRoom({ data: input });
		if (!r.ok) throw new Error(r.error);
		this.attach(r.code, r.token);
		this.hooks.onStatus("connecting");
		this.schedule(0);
	}
	async join(code, name) {
		saveName(name);
		const codeUp = code.toUpperCase();
		const r = await netJoinRoom({ data: {
			code: codeUp,
			name
		} });
		if (!r.ok) throw new Error(r.error);
		if (r.waiting) {
			this.attachWaiting(codeUp, r.token);
			return;
		}
		this.attach(codeUp, r.token);
		this.hooks.onStatus("connecting");
		this.schedule(0);
	}
	/** Вернуться на стол по сохранённому токену (F5, обрыв, закрытая вкладка). */
	async resume(code) {
		const codeUp = code.toUpperCase();
		if (await this.resumeWatch(codeUp)) return;
		const seatToken = loadToken(codeUp);
		let failure = null;
		if (seatToken) {
			const r = await netRejoin({ data: {
				code: codeUp,
				token: seatToken
			} });
			if (r.ok) {
				this.attach(codeUp, seatToken);
				this.accept(r.snapshot);
				this.schedule(0);
				return;
			}
			failure = r;
			removeToken(codeUp);
		}
		const queueToken = loadQueueToken(codeUp);
		if (queueToken) {
			const r = await netRoomInfo({ data: {
				code: codeUp,
				token: queueToken
			} });
			if (r.ok && r.info.queued) {
				this.attachWaiting(codeUp, queueToken, r.info);
				return;
			}
			clearQueueToken(codeUp);
			if (!r.ok && fatalText(r.code)) {
				this.fatal(fatalText(r.code));
				throw new Error(r.error);
			}
		}
		const text = failure ? fatalText(failure.code) : null;
		if (text) {
			this.fatal(text);
			throw new Error(text);
		}
		if (failure) throw new Error(failure.error);
		throw new Error("На этом устройстве нет места за этим столом");
	}
	/** Ожидающий ли сейчас клиент (мест не хватило). */
	isWaiting() {
		return this.waiting;
	}
	/** Войти зрителем: отдельный токен, место игрока не занято. */
	async watch(code, name) {
		saveName(name);
		const codeUp = code.toUpperCase();
		const r = await netSpectate({ data: {
			code: codeUp,
			name
		} });
		if (!r.ok) throw new Error(r.error);
		try {
			localStorage.setItem(`evo-watch-${codeUp}`, r.token);
			localStorage.setItem("evo-net-watch-code", codeUp);
		} catch {}
		this.attachSpectator(codeUp, r.token);
		this.schedule(0);
	}
	/** Возврат в режим зрителя по сохранённому токену (F5). */
	async resumeWatch(code) {
		let token = null;
		try {
			token = localStorage.getItem(`evo-watch-${code}`);
		} catch {
			token = null;
		}
		if (!token) return false;
		const r = await netSpectatorPoll({ data: {
			code,
			token,
			sinceChatId: this.lastChatId,
			sinceReactionId: this.lastReactionId
		} });
		if (!r.ok) {
			try {
				localStorage.removeItem(`evo-watch-${code}`);
			} catch {}
			return false;
		}
		this.attachSpectator(code, token);
		this.acceptSpectator(r.snapshot);
		this.schedule(0);
		return true;
	}
	/** Ход: сервер проверяет и применяет, свежий кадр приходит в ответе. */
	async act(action) {
		const r = await netAction({ data: {
			code: this.code,
			token: this.token,
			action
		} });
		if (!r.ok) {
			const fatal = fatalText(r.code);
			if (fatal) this.fatal(fatal);
			return r.error;
		}
		this.lastOwnMoveAt = Date.now();
		this.accept(r.snapshot);
		this.schedule(0);
		return null;
	}
	async setBots(count) {
		await this.call(netSetBots({ data: {
			code: this.code,
			token: this.token,
			count
		} }));
		this.refresh();
	}
	async start() {
		const r = await this.call(netStart({ data: {
			code: this.code,
			token: this.token
		} }));
		this.accept(r.snapshot);
	}
	async again() {
		await this.call(netAgain({ data: {
			code: this.code,
			token: this.token
		} }));
		this.refresh();
	}
	async kick(seat) {
		await this.call(netKick({ data: {
			code: this.code,
			token: this.token,
			seat
		} }));
		this.refresh();
	}
	async setCapacity(capacity) {
		await this.call(netSetCapacity({ data: {
			code: this.code,
			token: this.token,
			capacity
		} }));
		this.refresh();
	}
	async setSettings(settings) {
		await this.call(netSetSettings({ data: {
			code: this.code,
			token: this.token,
			settings
		} }));
		this.refresh();
	}
	async transferHost(seat) {
		await this.call(netTransferHost({ data: {
			code: this.code,
			token: this.token,
			seat
		} }));
		this.refresh();
	}
	async kickWaiter(index) {
		await this.call(netKickWaiter({ data: {
			code: this.code,
			token: this.token,
			index
		} }));
		this.refresh();
	}
	/** Занять освободившееся место из очереди. Возвращает true при успехе. */
	async claimSeat() {
		if (this.claiming || this.stopped) return false;
		this.claiming = true;
		try {
			const r = await netClaimSeat({ data: {
				code: this.code,
				token: this.token
			} });
			if (!r.ok) {
				const fatal = fatalText(r.code);
				if (fatal) {
					this.fatal(fatal);
					return false;
				}
				return false;
			}
			this.waiting = false;
			this.attach(this.code, r.token);
			clearQueueToken(this.code);
			this.hooks.onWaiting(null);
			this.lastVersion = void 0;
			this.schedule(0);
			return true;
		} finally {
			this.claiming = false;
		}
	}
	/** Выйти из очереди (вызывается при уходе в меню и при кике). */
	async leaveQueue() {
		await netLeaveQueue({ data: {
			code: this.code,
			token: this.token
		} }).catch(() => null);
		clearQueueToken(this.code);
		this.stop();
	}
	/** Отправка в чат; возвращает текст ошибки или null. */
	async sendChat(text) {
		const r = await netChat({ data: {
			code: this.code,
			token: this.token,
			text
		} });
		if (!r.ok) {
			const fatal = fatalText(r.code);
			if (fatal) this.fatal(fatal);
			return r.error;
		}
		this.trackChat([r.message]);
		return null;
	}
	stop() {
		this.stopped = true;
		if (this.timer) clearTimeout(this.timer);
	}
	/** Немедленный внеочередной опрос (после действий с лобби). */
	refresh() {
		this.schedule(0);
	}
	/**
	* Разворачивает ответ сервера: фатальный код уводит клиента из стола.
	* R выводится как весь union ответа, а ok-ветка достаётся Extract'ом —
	* иначе TS сузил бы R до минимального { ok: true } и потерял поля кадра.
	*/
	async call(p) {
		const r = await p;
		if (!r.ok) {
			const fail = r;
			const fatal = fatalText(fail.code);
			if (fatal) this.fatal(fatal);
			throw new Error(fail.error);
		}
		return r;
	}
	fatal(reason) {
		this.stopped = true;
		if (this.timer) clearTimeout(this.timer);
		this.hooks.onFatal(reason);
	}
	attach(code, token) {
		this.code = code;
		this.token = token;
		this.waiting = false;
		this.spectating = false;
		saveToken(code, token);
		this.stopped = false;
		this.failCount = 0;
	}
	attachSpectator(code, token) {
		this.code = code;
		this.token = token;
		this.waiting = false;
		this.spectating = true;
		this.lastVersion = void 0;
		this.stopped = false;
		this.failCount = 0;
		this.hooks.onStatus("connecting");
		this.hooks.onSpectating?.(true);
	}
	acceptSpectator(snap) {
		this.failCount = 0;
		this.seenStatus = statusOf(snap.room.status);
		this.wasReconnecting = false;
		this.trackChat(snap.chat);
		this.trackReactions(snap.reactions);
		this.hooks.onSpectatorSnapshot(snap);
		this.hooks.onStatus(this.seenStatus);
	}
	trackReactions(messages) {
		if (!messages.length) return;
		for (const m of messages) this.lastReactionId = Math.max(this.lastReactionId ?? 0, m.id);
		this.hooks.onReactions(messages);
	}
	attachWaiting(code, token, info) {
		this.code = code;
		this.token = token;
		this.waiting = true;
		saveQueueToken(code, token);
		this.stopped = false;
		this.failCount = 0;
		if (info) this.hooks.onWaiting(info);
		this.hooks.onStatus("lobby");
		this.schedule(0);
	}
	trackChat(messages) {
		if (!messages.length) return;
		for (const m of messages) this.lastChatId = Math.max(this.lastChatId ?? 0, m.id);
		this.hooks.onChat(messages);
	}
	accept(snap) {
		this.waiting = false;
		this.lastVersion = snap.version;
		this.failCount = 0;
		this.seenStatus = statusOf(snap.room.status);
		this.wasReconnecting = false;
		if (snap.events.length) this.hooks.onEvents(snap.events);
		this.trackChat(snap.chat);
		this.hooks.onSnapshot(snap);
		this.hooks.onStatus(this.seenStatus);
	}
	schedule(delay) {
		if (this.stopped) return;
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => void this.tick(), delay ?? this.nextDelay());
	}
	nextDelay() {
		if (this.failCount > 0) return Math.min(5e3, 400 * 2 ** this.failCount);
		if (typeof document !== "undefined" && document.visibilityState === "hidden") return 3e3;
		return Date.now() - this.lastOwnMoveAt < 3e3 ? 350 : 700;
	}
	async tick() {
		if (this.stopped) return;
		if (this.spectating) {
			await this.tickSpectator();
			return;
		}
		if (this.waiting) {
			await this.tickWaiting();
			return;
		}
		try {
			const r = await netPoll({ data: {
				code: this.code,
				token: this.token,
				sinceVersion: this.lastVersion,
				sinceChatId: this.lastChatId
			} });
			if (!r.ok) {
				const fatal = fatalText(r.code);
				if (fatal) {
					this.fatal(fatal);
					return;
				}
				throw new Error(r.error);
			}
			if ("unchanged" in r) {
				this.failCount = 0;
				this.hooks.onSeats(r.seats, r.hostSeat, r.capacity, r.waiters);
				this.trackChat(r.chat);
			} else this.accept(r);
			if (this.wasReconnecting) {
				this.wasReconnecting = false;
				this.hooks.onStatus(this.seenStatus);
			}
			this.schedule();
		} catch {
			this.failCount += 1;
			if (this.failCount >= 3) {
				this.wasReconnecting = true;
				this.hooks.onStatus("reconnecting");
			}
			this.schedule();
		}
	}
	/** Поллинг зрителя: публичный вид стола, чат и реакции. */
	async tickSpectator() {
		try {
			const r = await netSpectatorPoll({ data: {
				code: this.code,
				token: this.token,
				sinceChatId: this.lastChatId,
				sinceReactionId: this.lastReactionId
			} });
			if (!r.ok) {
				const fatal = fatalText(r.code);
				if (fatal) {
					this.fatal(fatal);
					return;
				}
				throw new Error(r.error);
			}
			this.failCount = 0;
			this.wasReconnecting = false;
			this.trackChat(r.snapshot.chat);
			this.trackReactions(r.snapshot.reactions);
			this.hooks.onSpectators(r.snapshot.spectators);
			this.seenStatus = statusOf(r.snapshot.room.status);
			this.hooks.onSpectatorSnapshot(r.snapshot);
			this.hooks.onStatus(this.seenStatus);
			this.schedule();
		} catch {
			this.failCount += 1;
			if (this.failCount >= 3) {
				this.wasReconnecting = true;
				this.hooks.onStatus("reconnecting");
			}
			this.schedule();
		}
	}
	/** Реакция игрока или зрителя; возвращает текст ошибки или null. */
	async sendReaction(emoji, kind, targetSeat) {
		const r = await netReaction({ data: {
			code: this.code,
			token: this.token,
			emoji,
			kind,
			targetSeat
		} });
		if (!r.ok) {
			const fatal = fatalText(r.code);
			if (fatal) this.fatal(fatal);
			return r.error;
		}
		this.trackReactions([r.reaction]);
		return null;
	}
	/** Поллинг очереди: ждём место и занимаем его, как только оно появится. */
	async tickWaiting() {
		try {
			const r = await netRoomInfo({ data: {
				code: this.code,
				token: this.token,
				sinceChatId: this.lastChatId
			} });
			if (!r.ok) {
				const fatal = fatalText(r.code);
				if (fatal) {
					this.fatal(fatal);
					return;
				}
				throw new Error(r.error);
			}
			const info = r.info;
			this.failCount = 0;
			this.wasReconnecting = false;
			this.hooks.onWaiting(info);
			this.trackChat(info.chat);
			if (!info.queued && info.freeSeat === null) {
				this.fatal(info.room.status === "lobby" ? "Вы больше не в очереди этого стола" : "Партия началась без вас");
				return;
			}
			if (info.freeSeat !== null) {
				await this.claimSeat();
				if (this.stopped) return;
			}
			this.schedule();
		} catch {
			this.failCount += 1;
			if (this.failCount >= 3) {
				this.wasReconnecting = true;
				this.hooks.onStatus("reconnecting");
			}
			this.schedule();
		}
	}
};
var aiTimer = null;
/** Активная сетевая сессия (одна на вкладку). */
var netSession = null;
/** Код из ?room, по которому уже пробовали вернуться: страховка от цикла меню. */
var urlResumeTried = null;
function clearAi() {
	if (aiTimer) {
		clearTimeout(aiTimer);
		aiTimer = null;
	}
}
var SPEED_MULT = {
	slow: 1.7,
	normal: 1,
	fast: .55
};
var DICE_MS = 2e3;
var EXTINCTION_MS = 2200;
var DEV_MS = 1300;
var FEED_MS = 950;
var DEFENSE_MS = 1050;
var TURN_GAP_MS = 700;
/** Последний бот, делавший ход: чтобы делать паузу при передаче хода. */
var lastBotActor = null;
var UNDO_LIMIT = 10;
var undoStack = [];
/** Ход человека: сейчас он принимает решение (в т.ч. защита при атаке). */
function isHumanDecision(state) {
	if (state.phase === "gameOver") return false;
	if (state.pendingAttack) return state.pendingAttack.waitingFor === state.humanId;
	if (state.madTurn === state.humanId) return false;
	return (state.phase === "development" || state.phase === "feeding") && currentActor(state)?.id === state.humanId;
}
/** Куда можно откатиться: фаза развития и ход человека. */
function isUndoTarget(state) {
	return state.phase === "development" && currentActor(state)?.id === state.humanId;
}
/**
* Действия автофаз (бросок базы, старт питания, вымирание, рост): их шлёт
* tickAI, а не игрок, поэтому гейт «сейчас ход человека» на них не действует.
*/
var AUTO_PHASE_ACTIONS = /* @__PURE__ */ new Set([
	"rollFoodBank",
	"beginFeeding",
	"continueExtinction",
	"continueGrowth"
]);
function pushUndo(state) {
	undoStack.push(structuredClone(state));
	if (undoStack.length > UNDO_LIMIT) undoStack.splice(0, undoStack.length - UNDO_LIMIT);
}
function clearUndo() {
	undoStack.length = 0;
}
function canUndoNow(state) {
	return undoStack.length > 0 && !!state && isUndoTarget(state);
}
function soloMetaOf(state) {
	return state && state.phase !== "gameOver" ? {
		year: state.year,
		savedAt: Date.now()
	} : null;
}
/**
* Мост NetSession → стор: кадры сервера ложатся в state/net, статус
* соединения — в баннер переподключения, события/чат — в буферы UI.
*/
function netHooks(set, get) {
	return {
		onSnapshot: (snap) => {
			if (snap.room.code !== syncedRoomCode) {
				syncedRoomCode = snap.room.code;
				syncRoomUrl(snap.room.code);
			}
			const cur = get().net;
			if (!cur) return;
			set({
				state: snap.state,
				canUndo: false,
				net: {
					...cur,
					code: snap.room.code,
					seat: snap.seat,
					capacity: snap.room.capacity,
					seats: snap.seats,
					hostSeat: snap.room.hostSeat,
					settings: snap.room.settings,
					waiters: snap.waiters,
					waiting: false,
					waiterPosition: null
				}
			});
		},
		onSeats: (seats, hostSeat, capacity, waiters) => {
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				seats,
				hostSeat,
				capacity,
				waiters
			} });
		},
		onStatus: (status) => {
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				status,
				error: status === "reconnecting" ? cur.error : null
			} });
		},
		onEvents: (batches) => {
			const cur = get().net;
			if (!cur || !batches.length) return;
			set({ net: {
				...cur,
				events: [...cur.events, ...batches].slice(-40)
			} });
		},
		onChat: (messages) => {
			const cur = get().net;
			if (!cur || !messages.length) return;
			const seen = new Set(cur.chat.map((m) => m.id));
			const fresh = messages.filter((m) => !seen.has(m.id));
			if (!fresh.length) return;
			set({ net: {
				...cur,
				chat: [...cur.chat, ...fresh].slice(-200)
			} });
		},
		onReactions: (messages) => {
			const cur = get().net;
			if (!cur || !messages.length) return;
			const seen = new Set(cur.reactions.map((m) => m.id));
			const fresh = messages.filter((m) => !seen.has(m.id));
			if (!fresh.length) return;
			set({ net: {
				...cur,
				reactions: [...cur.reactions, ...fresh].slice(-30)
			} });
		},
		onSpectatorSnapshot: (snap) => {
			const cur = get().net;
			if (!cur) return;
			set({
				state: snap.state,
				net: {
					...cur,
					code: snap.room.code,
					seat: -2,
					capacity: snap.room.capacity,
					seats: snap.seats,
					hostSeat: snap.room.hostSeat,
					settings: snap.room.settings,
					spectators: snap.spectators,
					status: get().net?.status === "reconnecting" ? "reconnecting" : statusOfNet(snap.room.status)
				}
			});
		},
		onSpectators: (spectators) => {
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				spectators
			} });
		},
		onSpectating: (on) => {
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				spectating: on
			} });
		},
		onWaiting: (info) => {
			const cur = get().net;
			if (!cur) return;
			if (!info) {
				set({ net: {
					...cur,
					waiting: false,
					waiterPosition: null
				} });
				return;
			}
			set({ net: {
				...cur,
				waiting: true,
				waiterPosition: info.position,
				capacity: info.room.capacity,
				seats: info.seats,
				hostSeat: info.room.hostSeat,
				settings: info.room.settings,
				waiters: info.waiters
			} });
		},
		onFatal: (reason) => {
			const s = netSession;
			netSession = null;
			s?.stop();
			clearAi();
			clearUndo();
			syncedRoomCode = null;
			syncRoomUrl(null);
			set({
				mode: "solo",
				net: null,
				state: null,
				netFatal: reason,
				thinking: false,
				thinkingWho: null,
				intent: { kind: "none" },
				canUndo: false
			});
		}
	};
}
/** Общий прогон сетевого действия: ошибку показываем в net.error. */
function runNet(session, set, get, fn) {
	if (!session) return Promise.resolve();
	return fn(session).catch((e) => {
		const cur = get().net;
		if (cur) set({ net: {
			...cur,
			error: e instanceof Error ? e.message : String(e)
		} });
	});
}
function loadSpeed() {
	try {
		const v = localStorage.getItem("evo-speed");
		if (v === "slow" || v === "normal" || v === "fast") return v;
	} catch {}
	return "normal";
}
var SOLO_KEY = "evo-solo-game";
var SOLO_TTL_MS = 1728e5;
/** RoomStatus → NetStatus для кадров зрителя (в session.ts та же логика). */
function statusOfNet(status) {
	if (status === "playing") return "playing";
	if (status === "finished") return "finished";
	return "lobby";
}
/**
* Последние настройки запущенной хостом сетевой партии: при создании нового
* стола они подставляются автоматически — выбирать всё заново не нужно,
* всё меняется и в лобби до старта.
*/
var NET_LAST_KEY = "evo-net-last-config";
function loadLastNetConfig() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(NET_LAST_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function saveLastNetConfig(cfg) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(NET_LAST_KEY, JSON.stringify(cfg));
	} catch {}
}
/**
* Код стола в адресе страницы: ссылку из адресной строки можно скинуть
* кому угодно в любой момент. replaceState — без лишней записи в историю.
*/
/** Код стола, уже отражённый в адресе (чтобы не дёргать replaceState на каждом кадре). */
var syncedRoomCode = null;
function syncRoomUrl(code) {
	if (typeof window === "undefined") return;
	const url = code ? `?room=${code}` : window.location.pathname;
	try {
		window.history.replaceState(null, "", url);
	} catch {}
}
function persistSolo(state) {
	if (typeof window === "undefined") return;
	try {
		if (!state || state.phase === "gameOver") localStorage.removeItem(SOLO_KEY);
		else localStorage.setItem(SOLO_KEY, JSON.stringify({
			savedAt: Date.now(),
			state
		}));
	} catch {}
}
/** Метаданные сейва для меню — без самого состояния. */
function readSoloSaveMeta() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(SOLO_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.state || !Number.isFinite(parsed.savedAt)) return null;
		if (Date.now() - parsed.savedAt > SOLO_TTL_MS) return null;
		return {
			year: parsed.state.year,
			savedAt: parsed.savedAt
		};
	} catch {
		return null;
	}
}
/** Восстановить прерванную соло-партию; false — сохранёнки нет или старая. */
function loadSolo() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(SOLO_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.state || Date.now() - parsed.savedAt > SOLO_TTL_MS) {
			localStorage.removeItem(SOLO_KEY);
			return null;
		}
		return parsed.state;
	} catch {
		return null;
	}
}
var useGameStore = create((set, get) => ({
	state: null,
	thinking: false,
	thinkingWho: null,
	intent: { kind: "none" },
	rulesOpen: false,
	logOpen: false,
	speed: "normal",
	modules: {},
	mode: "solo",
	net: null,
	netFatal: null,
	soloSave: null,
	canUndo: false,
	start: (players, difficulty, deckSize) => {
		clearAi();
		clearUndo();
		const seed = Date.now() % 1e6;
		const state = createGame(players, difficulty, seed, void 0, get().modules, deckSize);
		lastBotActor = null;
		persistSolo(state);
		set({
			state,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" },
			canUndo: false,
			soloSave: soloMetaOf(state)
		});
		queueMicrotask(() => get().tickAI());
	},
	setModules: (modules) => set({ modules }),
	reset: () => {
		const wasSolo = get().mode === "solo";
		clearAi();
		clearUndo();
		if (wasSolo) persistSolo(null);
		if (get().mode === "net") {
			netSession?.stop();
			netSession = null;
		}
		set({
			state: null,
			mode: "solo",
			net: null,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" },
			canUndo: false,
			soloSave: wasSolo ? null : get().soloSave
		});
	},
	collapseSolo: () => {
		const { mode, state } = get();
		if (mode !== "solo" || !state) return;
		clearAi();
		clearUndo();
		persistSolo(state);
		set({
			state: null,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" },
			canUndo: false,
			soloSave: soloMetaOf(state)
		});
	},
	refreshSoloSave: () => set({ soloSave: readSoloSaveMeta() }),
	resumeSolo: () => {
		const saved = loadSolo();
		if (!saved) {
			set({ soloSave: null });
			return false;
		}
		clearAi();
		clearUndo();
		lastBotActor = null;
		set({
			state: saved,
			mode: "solo",
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" },
			canUndo: false,
			soloSave: soloMetaOf(saved)
		});
		queueMicrotask(() => get().tickAI());
		return true;
	},
	undoLast: () => {
		if (get().mode !== "solo") return;
		const cur = get().state;
		if (!cur || !isUndoTarget(cur)) return;
		let idx = -1;
		for (let i = undoStack.length - 1; i >= 0; i--) {
			const snap = undoStack[i];
			if (isUndoTarget(snap)) {
				idx = i;
				break;
			}
		}
		if (idx < 0) return;
		const snap = undoStack[idx];
		undoStack.splice(idx);
		const restored = structuredClone(snap);
		restored.eventSeq = Math.max(cur.eventSeq, restored.eventSeq + 1);
		restored.logSeq = Math.max(cur.logSeq ?? 0, restored.logSeq ?? 0) + 1;
		restored.lastEvents = [];
		clearAi();
		lastBotActor = null;
		persistSolo(restored);
		set({
			state: restored,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" },
			canUndo: canUndoNow(restored),
			soloSave: soloMetaOf(restored)
		});
		queueMicrotask(() => get().tickAI());
	},
	dispatch: (action) => {
		if (get().mode === "net") {
			if (get().net?.spectating) return;
			const s = netSession;
			if (!s) return;
			set({ intent: { kind: "none" } });
			s.act(action).then((err) => {
				const after = get().net;
				if (err && after) set({ net: {
					...after,
					error: err
				} });
			});
			return;
		}
		const { state } = get();
		if (!state) return;
		if (state.phase === "gameOver") return;
		if (!AUTO_PHASE_ACTIONS.has(action.type) && !isHumanDecision(state)) return;
		if (isHumanDecision(state)) pushUndo(state);
		const next = applyAction(state, action);
		lastBotActor = null;
		persistSolo(next);
		set({
			state: next,
			intent: { kind: "none" },
			thinking: false,
			canUndo: canUndoNow(next),
			soloSave: soloMetaOf(next)
		});
		queueMicrotask(() => get().tickAI());
	},
	setIntent: (intent) => set({ intent }),
	setRulesOpen: (rulesOpen) => set({ rulesOpen }),
	setLogOpen: (logOpen) => set({ logOpen }),
	setSpeed: (speed) => {
		try {
			localStorage.setItem("evo-speed", speed);
		} catch {}
		set({ speed });
	},
	startNetCreate: async (cfg) => {
		clearAi();
		clearUndo();
		const s = new NetSession(netHooks(set, get));
		netSession = s;
		set({
			mode: "net",
			state: null,
			intent: { kind: "none" },
			thinking: false,
			thinkingWho: null,
			canUndo: false,
			netFatal: null,
			net: {
				code: "",
				seat: 0,
				status: "connecting",
				error: null,
				seats: [],
				hostSeat: 0,
				capacity: cfg.capacity,
				waiting: false,
				waiterPosition: null,
				waiters: [],
				settings: {
					modules: cfg.modules ?? {},
					difficulty: cfg.difficulty
				},
				chat: [],
				events: [],
				spectating: false,
				spectators: [],
				reactions: []
			}
		});
		try {
			await s.create(cfg);
		} catch (e) {
			s.stop();
			netSession = null;
			set({
				mode: "solo",
				net: null
			});
			throw e;
		}
	},
	startNetJoin: async (code, name) => {
		clearAi();
		clearUndo();
		const s = new NetSession(netHooks(set, get));
		netSession = s;
		set({
			mode: "net",
			state: null,
			intent: { kind: "none" },
			thinking: false,
			thinkingWho: null,
			canUndo: false,
			netFatal: null,
			net: {
				code: code.toUpperCase(),
				seat: -1,
				status: "connecting",
				error: null,
				seats: [],
				hostSeat: 0,
				capacity: 0,
				waiting: false,
				waiterPosition: null,
				waiters: [],
				settings: {},
				chat: [],
				events: [],
				spectating: false,
				spectators: [],
				reactions: []
			}
		});
		try {
			await s.join(code, name);
		} catch (e) {
			s.stop();
			netSession = null;
			set({
				mode: "solo",
				net: null
			});
			throw e;
		}
	},
	resumeNetFromUrl: async (code) => {
		const codeUp = code.toUpperCase();
		if (!hasStoredSession(codeUp)) return false;
		if (urlResumeTried === codeUp) return false;
		urlResumeTried = codeUp;
		clearAi();
		clearUndo();
		const s = new NetSession(netHooks(set, get));
		netSession = s;
		set({
			mode: "net",
			state: null,
			intent: { kind: "none" },
			thinking: false,
			thinkingWho: null,
			canUndo: false,
			netFatal: null,
			net: {
				code: codeUp,
				seat: -1,
				status: "connecting",
				error: null,
				seats: [],
				hostSeat: 0,
				capacity: 0,
				waiting: false,
				waiterPosition: null,
				waiters: [],
				settings: {},
				chat: [],
				events: [],
				spectating: false,
				spectators: [],
				reactions: []
			}
		});
		try {
			await s.resume(code);
		} catch {
			s.stop();
			netSession = null;
			if (typeof window !== "undefined") try {
				const url = new URL(window.location.href);
				url.searchParams.delete("room");
				window.history.replaceState(null, "", url.toString());
			} catch {}
			set({
				mode: "solo",
				net: null
			});
			return false;
		}
		urlResumeTried = null;
		return true;
	},
	netAddBots: async (delta) => {
		const n = get().net;
		if (!n || !netSession || n.status !== "lobby") return;
		const bots = n.seats.filter((x) => x.isAI).length;
		const humans = n.seats.length - bots;
		const count = Math.max(0, Math.min(bots + delta, n.capacity - humans));
		const s = netSession;
		await runNet(s, set, get, (x) => x.setBots(count));
		s.refresh();
	},
	netStart: async () => {
		if (!netSession) return;
		await netSession.start().catch((e) => {
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				error: String(e.message ?? e)
			} });
		});
		const n = get().net;
		if (n && n.seat === n.hostSeat) saveLastNetConfig({
			capacity: n.capacity || 2,
			difficulty: n.settings.difficulty,
			deckSize: n.settings.deckSize,
			modules: n.settings.modules
		});
	},
	netAgain: async () => {
		const s = netSession;
		if (!s) return;
		await runNet(s, set, get, (x) => x.again());
		s.refresh();
	},
	netKick: (seat) => runNet(netSession, set, get, (s) => s.kick(seat)),
	netSetCapacity: (capacity) => runNet(netSession, set, get, (s) => s.setCapacity(capacity)),
	netSetSettings: (patch) => runNet(netSession, set, get, (s) => s.setSettings(patch)),
	netTransferHost: (seat) => runNet(netSession, set, get, (s) => s.transferHost(seat)),
	netKickWaiter: (index) => runNet(netSession, set, get, (s) => s.kickWaiter(index)),
	netClaimSeat: () => runNet(netSession, set, get, async (s) => {
		await s.claimSeat();
	}),
	netLeaveQueue: async () => {
		const s = netSession;
		netSession = null;
		if (s) await s.leaveQueue().catch(() => {});
		syncedRoomCode = null;
		syncRoomUrl(null);
		clearAi();
		clearUndo();
		set({
			mode: "solo",
			net: null,
			state: null,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" },
			canUndo: false
		});
	},
	sendChat: async (text) => {
		const s = netSession;
		if (!s) return;
		const err = await s.sendChat(text);
		if (err) {
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				error: err
			} });
		}
	},
	startNetWatch: async (code, name) => {
		clearAi();
		clearUndo();
		const s = new NetSession(netHooks(set, get));
		netSession = s;
		set({
			mode: "net",
			state: null,
			intent: { kind: "none" },
			thinking: false,
			thinkingWho: null,
			canUndo: false,
			netFatal: null,
			net: {
				code: code.toUpperCase(),
				seat: -2,
				status: "connecting",
				error: null,
				seats: [],
				hostSeat: 0,
				capacity: 0,
				waiting: false,
				waiterPosition: null,
				waiters: [],
				settings: {},
				chat: [],
				events: [],
				spectating: true,
				spectators: [],
				reactions: []
			}
		});
		syncRoomUrl(code.toUpperCase());
		try {
			await s.watch(code, name);
		} catch (e) {
			s.stop();
			netSession = null;
			set({
				mode: "solo",
				net: null
			});
			throw e;
		}
	},
	sendReaction: async (emoji, kind, targetSeat) => {
		const s = netSession;
		if (!s) return;
		const err = await s.sendReaction(emoji, kind, targetSeat);
		if (err) {
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				error: err
			} });
		}
	},
	leaveNet: () => {
		const s = netSession;
		const wasWaiting = get().net?.waiting ?? false;
		netSession = null;
		syncedRoomCode = null;
		urlResumeTried = null;
		syncRoomUrl(null);
		try {
			const watched = localStorage.getItem("evo-net-watch-code");
			if (watched) {
				localStorage.removeItem(`evo-watch-${watched}`);
				localStorage.removeItem("evo-net-watch-code");
			}
		} catch {}
		if (s && wasWaiting) s.leaveQueue().catch(() => {});
		s?.stop();
		clearAi();
		clearUndo();
		set({
			mode: "solo",
			net: null,
			state: null,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" },
			canUndo: false
		});
	},
	clearNetError: () => {
		const cur = get().net;
		if (cur?.error) set({ net: {
			...cur,
			error: null
		} });
	},
	clearNetFatal: () => {
		if (get().netFatal) set({ netFatal: null });
	},
	/**
	* Драйвер автоматики: кубики кормовой базы, показ вымирания и ходы ботов.
	* Каждое микро-действие бота — отдельный таймер с паузой по весу действия,
	* плюс дополнительная пауза при передаче хода между игроками.
	*/
	tickAI: () => {
		if (get().mode === "net") {
			clearAi();
			return;
		}
		clearAi();
		const { state, speed } = get();
		if (!state) return;
		const mult = SPEED_MULT[speed];
		if (state.phase === "gameOver") {
			set({
				thinking: false,
				thinkingWho: null
			});
			return;
		}
		if (state.phase === "foodBank") {
			set({
				thinking: false,
				thinkingWho: null
			});
			if (!state.foodRoll) {
				get().dispatch({ type: "rollFoodBank" });
				return;
			}
			aiTimer = setTimeout(() => get().dispatch({ type: "beginFeeding" }), DICE_MS * mult);
			return;
		}
		if (state.phase === "extinction") {
			set({
				thinking: false,
				thinkingWho: null
			});
			aiTimer = setTimeout(() => get().dispatch({ type: "continueExtinction" }), EXTINCTION_MS * mult);
			return;
		}
		if (state.phase === "growth") {
			set({
				thinking: false,
				thinkingWho: null
			});
			aiTimer = setTimeout(() => get().dispatch({ type: "continueGrowth" }), EXTINCTION_MS * mult);
			return;
		}
		const actor = currentActor(state);
		if (!actor) return;
		if (!actor.isAI && state.madTurn !== actor.id) {
			set({
				thinking: false,
				thinkingWho: null
			});
			return;
		}
		set({
			thinking: true,
			thinkingWho: actor.id
		});
		const turnGap = lastBotActor !== null && lastBotActor !== actor.id ? TURN_GAP_MS : 0;
		const delay = ((state.pendingAttack !== null ? DEFENSE_MS : state.phase === "development" ? DEV_MS : FEED_MS) + turnGap) * mult * (.85 + Math.random() * .3);
		aiTimer = setTimeout(() => {
			const cur = get();
			if (!cur.state) return;
			const who = currentActor(cur.state);
			if (!who || !who.isAI && cur.state.madTurn !== who.id) {
				set({
					thinking: false,
					thinkingWho: null
				});
				return;
			}
			const action = chooseAIAction(cur.state);
			if (!action) {
				set({
					thinking: false,
					thinkingWho: null
				});
				return;
			}
			const next = applyAction(cur.state, action);
			lastBotActor = who.id;
			persistSolo(next);
			set({
				state: next,
				canUndo: canUndoNow(next),
				soloSave: soloMetaOf(next)
			});
			queueMicrotask(() => get().tickAI());
		}, delay);
	}
}));
var stroke = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.6,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
function TraitGlyph({ id, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: cn("size-4", className),
		"aria-hidden": true,
		children: glyph(id)
	});
}
function glyph(id) {
	switch (id) {
		case "carnivore": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 14c2-6 6-8 8-8s6 2 8 8M7 14l2 4 3-6 3 6 2-4"
		});
		case "swimming": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 12c4-6 8-6 16 0-8 6-12 6-16 0Zm8 0h.01M17 8c1 1 2 3 2 4"
		});
		case "camouflage": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "9",
			cy: "12",
			r: "4",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "15",
			cy: "12",
			r: "4",
			...stroke
		})] });
		case "sharpVision": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6Z"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "2.2",
			...stroke
		})] });
		case "burrowing": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 16c4-8 12-8 16 0M8 16v-3m4 3v-5m4 5v-3"
		});
		case "scavenger": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5 16c2-8 12-8 14 0M9 10l-2-4m8 4 2-4M12 16v-3"
		});
		case "symbiosis": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "9",
			cy: "12",
			r: "3.5",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "15",
			cy: "12",
			r: "3.5",
			...stroke
		})] });
		case "piracy": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5 18 12 5l7 13M8 13h8"
		});
		case "tailLoss": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5 16c6-1 7-8 12-10M15 6l3 1-1 3"
		});
		case "grazing": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5 17h14M7 17c0-6 3-9 5-9s5 3 5 9M12 8V5"
		});
		case "cooperation": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M8 10v6m8-6v6M6 14h4m4 0h4M10 12h4"
		});
		case "running": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M6 17l3-6 4 3 5-7M14 7h4v4"
		});
		case "highBodyWeight": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5 16h14l-2-8H7l-2 8Zm3-8 1-3h6l1 3"
		});
		case "parasite": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 4v6m0 0c-3 0-5 2-5 5v5m5-10c3 0 5 2 5 5v5"
		});
		case "fatTissue": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M7 15c0-5 2.5-8 5-8s5 3 5 8-2 5-5 5-5-1-5-5Z"
		});
		case "communication": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5 12h3l2-4 4 8 2-4h3"
		});
		case "poisonous": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 4c3 4 5 7 5 10a5 5 0 1 1-10 0c0-3 2-6 5-10Z"
		});
		case "hibernation": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 4v2M7 7l1.5 1.5M17 7l-1.5 1.5M6 14a6 6 0 0 0 12 0c0-4-6-6-6-6s-6 2-6 6Z"
		});
		case "mimicry": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "4",
			y: "7",
			width: "8",
			height: "10",
			rx: "1",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "12",
			y: "7",
			width: "8",
			height: "10",
			rx: "1",
			opacity: .6,
			...stroke
		})] });
		case "migration": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 16c3-2 5-8 9-8m0 0h-4m4 0v4M17 6c2 2 3 4 3 6s-1 4-3 6"
		});
		case "remora": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M6 12c4-4 10-4 13 0-3 4-9 4-13 0Zm11 0h.01"
		});
		case "herding": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "7",
				cy: "14",
				r: "2.2",
				...stroke
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "14",
				r: "2.2",
				...stroke
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "17",
				cy: "14",
				r: "2.2",
				...stroke
			})
		] });
		case "nematocysts": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M7 18V9m0 0L5 5m2 4 2-4m0 13V9m5 9V9m0 0-2-4m2 4 2-4"
		});
		case "regeneration": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M19 12a7 7 0 1 1-3-5.7M19 4v4h-4"
		});
		case "recombination": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M8 5v14m8-14v14M6 8h4m4 0h4M6 16h4m4 0h4"
		});
		case "edificator": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M6 20v-7l6-5 6 5v7M10 20v-5h4v5"
		});
		case "neoplasia": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "3",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 4v3m0 10v3M4 12h3m10 0h3M6.6 6.6l2.1 2.1m6.6 6.6 2.1 2.1m0-10.8-2.1 2.1M8.7 15.3l-2.1 2.1"
		})] });
		case "plantWater": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 16c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 13c-1-3 .5-6 3-7-.4 3-1.2 5.5-3 7Z"
		})] });
		case "thorny": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5 18c3-4 3-8 1-11m0 0 3 2M6 7l-2.6.8M9 13l3-1m-3 5 3 .5M9 14l-2.6 1.4M13 12c0-4 2-6 5-7-1 4-2.4 6.5-5 7Z"
		});
		case "rootVegetable": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M9 12c0 5 1.5 8 3 8s3-3 3-8"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 12V7m0 0c-2 0-3-1-3-3m3 3c2 0 3-1 3-3"
		})] });
		case "medicinal": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 20c-4 0-6-2-6-6 0-4 3-9 6-10 3 1 6 6 6 10 0 4-2 6-6 6Z"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 8v6M9 11h6"
		})] });
		case "plantParasite": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M6 20V10m0 0c0-3 2-5 5-5m0 0v10"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M14 5h4m-4 0V1m4 4v4"
		})] });
		case "micorrhiza": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M7 20v-6m0 0c-2 0-3-2-3-4m3 4c2 0 3-2 3-4M17 20v-6m0 0c-2 0-3-2-3-4m3 4c2 0 3-2 3-4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M8 20h3m2 0h3M5 20c4 2 10 2 14 0"
		})] });
		case "tree": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 21v-7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "9",
				r: "5",
				...stroke
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 4V2m-7 7H3m18 0h-2"
			})
		] });
		case "nutritious": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "14",
			r: "6",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 8c0-2 1-3 3-4M9 13l2 2 4-4"
		})] });
		case "honeyPlant": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "8",
				r: "3",
				...stroke
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 11v6m0 0c-3 0-5-1-6-3m6 3c3 0 5-1 6-3M9 8H7m10 0h-2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M17 3c1 1 1.5 2 1.5 3"
			})
		] });
		case "transparent": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M8 4h8l3 4-7 12L5 8l3-4Z"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M8 4l4 8 4-8M12 12l3 0",
			opacity: .55
		})] });
		case "insectivore": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
			cx: "12",
			cy: "14",
			r: "4.5",
			ry: "5.5",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 8.5V6m0 0c-2 0-3-1-3-2.5M12 6c2 0 3-1 3-2.5M7.5 12H4m16 0h-3.5M8.5 17l-2.5 2m10-2 2.5 2"
		})] });
		case "obligateCarnivore": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 13c2-6 6-8 8-8s6 2 8 8M7 13l2 4 3-6 3 6 2-4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "13",
			r: "1.4"
		})] });
		case "budding": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10",
				cy: "13",
				r: "5",
				...stroke
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16.5",
				cy: "8.5",
				r: "2.6",
				...stroke
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M13.8 10.6 15 9.4"
			})
		] });
		case "metabolicSyndrome": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M13 3 6 13h5l-1 8 8-11h-5l1-7Z"
		}) });
		case "barkBeetle": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "12",
				cy: "13",
				rx: "4.5",
				ry: "6",
				...stroke
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M7.5 11c1.5 1 1.5 3 0 4m9-4c-1.5 1-1.5 3 0 4M12 7v12",
				opacity: .55
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M9 5.5 7 3m8 2.5L17 3"
			})
		] });
		case "extremophile": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M4 16c2 1 4 1 6 0m4 0c2 1 4 1 6 0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M8 13c1-4 3-6 4-8 1 2 3 4 4 8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M9 19h6"
			})
		] });
		case "developmentDefects": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "7",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M5.8 8.5 18.2 15.5M8.5 5.8l7 12.4",
			opacity: .55
		})] });
		case "simplification": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M14 4 8 12h4l-2 8 8-10h-5l1-6Z",
			opacity: .55
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 4v6m0 0 3-3M4 10 1 7"
		})] });
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "6",
			...stroke
		});
	}
}
/** Глиф карты флоры «Травы и грибов»: гриб или травинка. */
function FloraGlyph({ kind, className }) {
	const fungus = kind === "toadstool" || kind === "mold" || kind === "madCap" || kind === "flyAgaric" || kind === "insight" || kind === "soaring";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: cn("size-4", className),
		"aria-hidden": true,
		children: fungus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 11c0-4 3.6-7 8-7s8 3 8 7c0 .8-.6 1.4-1.4 1.2A16 16 0 0 0 12 11c-2.3 0-4.5.4-6.6 1.2C4.6 12.4 4 11.8 4 11Zm3 2.4 1.6 6.2c.1.5.6.9 1.1.9h4.6c.5 0 1-.4 1.1-.9l1.6-6.2"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 21c-1-4-1-8 0-12m0 0c-3 0-5-1.5-5-4 3 0 4.7 1.2 5 3.5M12 9c3 0 5-1.5 5-4-3 0-4.7 1.2-5 3.5M12 15c-2 0-3.5-1-4-3 2.2-.4 3.6.6 4 3Zm0 0c2 0 3.5-1 4-3-2.2-.4-3.6.6-4 3Z"
		})
	});
}
/**
* Кубик-фишка еды (как в настольной игре): изометрический куб с тремя
* видимыми гранями разной яркости — верхняя со световым бликом и светлым
* ребром, чтобы фишка читалась объёмной даже в 14 пикселях. Красный — еда
* из кормовой базы, синий — от свойств (охота, сотрудничество…), жёлтый —
* жир, зелёный — еда растений.
*/
var CUBE_TONES = {
	red: [
		"#e0685a",
		"#b23c2d",
		"#8c2f22"
	],
	blue: [
		"#6ca6cf",
		"#3f7199",
		"#30587a"
	],
	yellow: [
		"#eec871",
		"#bb923c",
		"#96762e"
	],
	green: [
		"#90c173",
		"#5e9043",
		"#4a7635"
	]
};
function FoodCube({ tone, className, title }) {
	const [top, left, right] = CUBE_TONES[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 20 21",
		className: cn("shrink-0", className),
		"aria-hidden": !title,
		role: title ? "img" : void 0,
		"aria-label": title,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				stroke: "rgba(18,14,8,0.45)",
				strokeWidth: "0.6",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "1,6.2 10,11.4 10,20.6 1,15.4",
						fill: left
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "19,6.2 10,11.4 10,20.6 19,15.4",
						fill: right
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "10,1 19,6.2 10,11.4 1,6.2",
						fill: top
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "10,2 17.4,6.2 10,10.2 2.6,6.2",
				fill: "#ffffff",
				opacity: "0.24"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				points: "2.6,6.2 10,10.2 17.4,6.2",
				fill: "none",
				stroke: "#ffffff",
				strokeOpacity: "0.3",
				strokeWidth: "0.7",
				strokeLinejoin: "round"
			})
		]
	});
}
/** Глиф вида растения для карточки растения (до подключения арта). */
function PlantGlyph({ kind, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: cn("size-6", className),
		"aria-hidden": true,
		children: plantGlyph(kind)
	});
}
function plantGlyph(kind) {
	switch (kind) {
		case "liana": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M6 3c6 2 5 8 2 12s-2 6 2 6m0-6c4 0 6-3 6-7 0-3-2-5-5-5"
		});
		case "fungus": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M4 11c0-4 3.5-7 8-7s8 3 8 7c0 1-1 2-2 2H6c-1 0-2-1-2-2Z"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M10 13v4m4-4v4m-6 0h8"
		})] });
		case "carnivorous": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 21v-6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 15c-5-1-7-4-6-9 3 1 5 2 6 5 1-3 3-4 6-5 1 5-1 8-6 9Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M6 6l1.5 1.5M18 6l-1.5 1.5"
			})
		] });
		case "annual": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 21v-8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "5",
				r: "1.6",
				...stroke
			})
		] });
		case "legume": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M5 8c6 0 12 2 14 8-6 1-12-2-14-8Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10",
				cy: "11",
				r: "1",
				fill: "currentColor",
				stroke: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "13",
				cy: "13",
				r: "1",
				fill: "currentColor",
				stroke: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M19 16c1-3 1-6-1-9"
			})
		] });
		case "perennial": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 21v-5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 16c-4 0-6-3-6-7 4 0 6 3 6 7Zm0 0c4 0 6-3 6-7-4 0-6 3-6 7Z"
		})] });
		case "grass": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 21V9m0 0C10 7 8 6 5 6c1 4 3 6 7 5Zm0-1c2-2 4-3 7-3-1 4-3 6-7 5Z"
		});
		case "succulent": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 21v-8"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 13c-2-1-3-3-2-6 2 1 3 3 2 6Zm0 0c2-1 3-3 2-6-2 1-3 3-2 6Zm0 0c-3 0-5-1-6-4 3 0 5 1 6 4Zm0 0c3 0 5-1 6-4-3 0-5 1-6 4Z"
		})] });
		case "fruit": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "14",
			r: "6",
			...stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...stroke,
			d: "M12 8V5m0 0c-1.5-1-3-1-4 0m4 0c1.5-1 3-1 4 0"
		})] });
		case "parasite": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M4 20v-7m0 0c0-4 3-7 8-7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M12 6c2 0 4 1 5 3m-5-3V3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				...stroke,
				d: "M17 9c2 0 3 1 3 3"
			})
		] });
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "6",
			...stroke
		});
	}
}
/** Всплывающее мини-окно с правилом свойства; позиционируется над чипом. */
function TraitTooltip({ def, pair, pairNote, pairColor, disabled, anchorRect, id }) {
	const bubbleRef = (0, import_react.useRef)(null);
	const [pos, setPos] = (0, import_react.useState)(null);
	(0, import_react.useLayoutEffect)(() => {
		const el = bubbleRef.current;
		if (!el) return;
		const margin = 8;
		const gap = 8;
		const width = el.offsetWidth;
		const height = el.offsetHeight;
		const left = Math.max(margin, Math.min(anchorRect.left + anchorRect.width / 2 - width / 2, window.innerWidth - margin - width));
		let top = anchorRect.top - gap - height;
		if (top < margin) top = Math.min(anchorRect.bottom + gap, window.innerHeight - margin - height);
		setPos({
			left: Math.round(left),
			top: Math.round(top)
		});
	}, [anchorRect]);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: bubbleRef,
		id,
		role: "tooltip",
		style: {
			left: pos?.left ?? -9999,
			top: pos?.top ?? -9999
		},
		className: "pointer-events-none fixed z-50 w-max max-w-[min(190px,calc(100vw-16px))] animate-[fade-in_160ms_var(--ease-out)] overflow-hidden rounded-[var(--radius-sm)] border border-border-strong bg-bg/95 text-left shadow-[var(--shadow-card)] backdrop-blur-sm",
		children: [def.image ?? TRAIT_ART[def.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: def.image ?? TRAIT_ART[def.id],
			alt: "",
			className: cn("-mx-3 -mt-2 mb-1.5 h-36 w-[calc(100%+24px)] max-w-none", DARK_ART.has(def.id) ? "bg-ink object-contain p-1.5" : "object-cover object-[50%_25%]")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-3 -mt-2 mb-1.5 flex h-20 items-center justify-center border-b border-border bg-surface-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
				id: def.id,
				className: "size-10 text-muted"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-2.5 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5 text-[11px] font-semibold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-fg", def.virusLike && "text-virus"),
						children: def.name
					}),
					def.extraFood && def.extraFood > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-clay/20 px-1.5 text-[9px] uppercase tracking-wide text-clay",
						children: [
							"+",
							def.extraFood,
							" к еде"
						]
					}) : null,
					def.scoreBonus && def.scoreBonus > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-good/20 px-1.5 text-[9px] uppercase tracking-wide text-good",
						children: [
							"+",
							def.scoreBonus,
							" очк."
						]
					}) : null,
					pair ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted",
						style: pairColor ? { color: pairColor } : void 0,
						children: [pairColor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2 rounded-full",
							style: { background: pairColor }
						}) : null, pairNote ?? "пара"]
					}) : null,
					disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] uppercase tracking-wider text-clay",
						children: "отключено"
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[11px] leading-snug text-muted",
				children: def.description
			})]
		})]
	}), document.body);
}
function useTraitTip({ toggleOnTap = true, isolateClick = false } = {}) {
	const anchorRef = (0, import_react.useRef)(null);
	const [anchorRect, setAnchorRect] = (0, import_react.useState)(null);
	const lastPointerType = (0, import_react.useRef)("mouse");
	const tipId = (0, import_react.useId)();
	const open = (0, import_react.useCallback)(() => {
		if (anchorRef.current) setAnchorRect(anchorRef.current.getBoundingClientRect());
	}, []);
	const close = (0, import_react.useCallback)(() => setAnchorRect(null), []);
	(0, import_react.useEffect)(() => {
		if (!anchorRect) return;
		const onKey = (e) => {
			if (e.key === "Escape") close();
		};
		const onPointerDown = (e) => {
			if (!(e.target instanceof Node) || anchorRef.current?.contains(e.target)) return;
			close();
		};
		const onMove = () => close();
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPointerDown, true);
		window.addEventListener("scroll", onMove, true);
		window.addEventListener("resize", onMove);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPointerDown, true);
			window.removeEventListener("scroll", onMove, true);
			window.removeEventListener("resize", onMove);
		};
	}, [anchorRect, close]);
	return {
		anchorRef,
		tipId,
		anchorRect,
		close,
		triggerProps: (0, import_react.useMemo)(() => ({
			tabIndex: 0,
			"aria-describedby": anchorRect ? tipId : void 0,
			onPointerEnter: (e) => {
				if (e.pointerType === "mouse") open();
			},
			onPointerLeave: (e) => {
				if (e.pointerType === "mouse") close();
			},
			onPointerDown: (e) => {
				lastPointerType.current = e.pointerType;
			},
			onClick: (e) => {
				if (lastPointerType.current !== "mouse") {
					if (isolateClick) e.stopPropagation();
					if (toggleOnTap) {
						if (anchorRect) close();
						else open();
					}
				}
			},
			onFocus: () => {
				if (lastPointerType.current !== "touch") open();
			},
			onBlur: () => close()
		}), [
			anchorRect,
			close,
			isolateClick,
			open,
			tipId,
			toggleOnTap
		])
	};
}
/** Цветовые акценты меток последствий (тон из реестра MARKS). */
var MARK_TONE = {
	poison: "border-danger/50 bg-danger/15 text-clay",
	antidote: "border-good/50 bg-good/15 text-good",
	madness: "border-virus/50 bg-virus/15 text-virus",
	rage: "border-danger/60 bg-danger/20 text-clay",
	sleep: "border-border-strong/60 bg-ink/10 text-muted",
	thryn: "border-leaf/50 bg-leaf/15 text-leaf",
	haze: "border-food-yellow/60 bg-food-yellow/15 text-ink",
	pacifism: "border-water/50 bg-water/15 text-water"
};
/** Чип метки последствий на животном: жетон-картинка и цвет по виду, правило — в подсказке. */
var MarkChip = (0, import_react.memo)(function MarkChip({ mark }) {
	const def = MARKS[mark];
	const tip = useTraitTip({ isolateClick: true });
	const tipDef = {
		id: mark,
		name: `Метка «${def.name}»`,
		description: def.description,
		image: MARK_ART[mark]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"data-mark-chip": true,
		className: cn("anim-chip-in relative inline-flex h-5 items-center gap-1 rounded-[var(--radius-xs)] border px-1.5 text-[10px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent/60", MARK_TONE[mark]),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: MARK_ART[mark],
				alt: "",
				loading: "lazy",
				className: "size-3.5 shrink-0 rounded-full object-cover"
			}),
			def.short,
			tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
				def: tipDef,
				anchorRect: tip.anchorRect,
				id: tip.tipId
			}) : null
		]
	});
});
/**
* Карточка флоры «Травы и грибов»: гриб или трава, фишки еды (до 4),
* метка, которую даёт карта. Кликабельна в режимах интентов
* (взять еду / топтун).
*/
var FloraCardView = (0, import_react.memo)(function FloraCardView({ flora, highlight, dimmed, selected, onClick }) {
	const def = FLORA[flora.kind];
	const art = FLORA_ART[flora.kind];
	const tip = useTraitTip({ toggleOnTap: false });
	const tipDef = {
		id: flora.kind,
		name: `${def.name} · ${def.isFungus ? "гриб" : "трава"}`,
		description: def.description,
		image: art
	};
	const interactive = Boolean(onClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-flora-id": flora.id,
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"aria-label": `${def.name} — ${def.isFungus ? "гриб" : "трава"}`,
		role: interactive ? "button" : void 0,
		onClick: interactive ? onClick : void 0,
		onKeyDown: interactive ? (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick?.();
			}
		} : void 0,
		className: cn("plant-card anim-card-in relative flex w-[120px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border bg-parchment text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]", def.isFungus ? "border-virus/30" : "border-leaf/40", selected ? "border-clay ring-2 ring-clay/40" : "", highlight ? "border-accent ring-2 ring-accent" : "", dimmed ? "opacity-45" : "", interactive && "hover:-translate-y-0.5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[4/3] w-full overflow-hidden bg-parchment-2",
				children: [art ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: art,
					alt: "",
					loading: "lazy",
					className: "absolute inset-0 h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("absolute inset-0 flex items-center justify-center", def.isFungus ? "text-virus" : "text-leaf"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloraGlyph, {
						kind: flora.kind,
						className: "size-10"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-parchment", def.isFungus ? "bg-virus/80" : "bg-leaf/80"),
					children: def.name
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 px-2 py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-0.5",
					title: `Фишек еды: ${flora.food} (максимум 4)`,
					children: [Array.from({ length: flora.food }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
						tone: "red",
						className: "token-pop size-3"
					}, i)), flora.food === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-ink-soft",
						children: "без еды"
					}) : null]
				}), def.mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: MARK_ART[def.mark],
					alt: `Метка «${MARKS[def.mark].name}»`,
					loading: "lazy",
					title: `Даёт метку «${MARKS[def.mark].name}»`,
					className: "ml-auto size-4 shrink-0 rounded-full object-cover ring-1 ring-border-strong/40"
				}) : null]
			}),
			tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
				def: tipDef,
				anchorRect: tip.anchorRect,
				id: tip.tipId
			}) : null
		]
	});
});
/** Полоса флоры: общий стол трав и грибов (с «Континентами» — по континентам). */
function FloraStrip({ state, highlights, onFloraClick, zone }) {
	const flora = (state.flora ?? []).filter((f) => zone ? (f.zoneId ?? "gondwana") === zone : true);
	if (!flora.length) return null;
	const interactive = Boolean(onFloraClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": zone ? `Трава и грибы (${zone === "laurasia" ? "Лавразия" : "Гондвана"})` : "Трава и грибы",
		className: "paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full items-center justify-between text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: zone ? zone === "laurasia" ? "Флора Лавразии" : "Флора Гондваны" : "Трава и грибы · общие"
			}), zone ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums",
				children: [
					"колода ",
					state.floraDeckCount ?? state.floraDeck?.length ?? 0,
					" · сброс ",
					state.floraDiscard ?? 0
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: flora.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloraCardView, {
				flora: f,
				highlight: highlights.has(f.id),
				dimmed: interactive && highlights.size > 0 && !highlights.has(f.id),
				onClick: interactive ? () => onFloraClick?.(f) : void 0
			}, f.id))
		})]
	});
}
/**
* Фишки еды на животном. Цвет важен по правилам: красная приходит из кормовой
* базы, синяя — от свойств (охота, сотрудничество, пиратство, падальщик,
* хвост, жир), поэтому blueFood рисуется отдельными синими жетонами.
*/
var FoodDots = (0, import_react.memo)(function FoodDots({ animal }) {
	const need = speciesNeed(animal);
	const blue = Math.min(animal.blueFood, animal.food);
	const red = animal.food - blue;
	const empty = Math.max(0, need - animal.food);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		title: `Еда ${animal.food} / ${need}${blue > 0 ? ` · синих ${blue}` : ""}${animal.fatTokens > 0 ? ` · жир ${animal.fatTokens}` : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [
				Array.from({ length: red }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: "red",
					title: "Красная фишка",
					className: "token-pop size-3.5"
				}, `r${i}`)),
				Array.from({ length: blue }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: "blue",
					title: "Синяя фишка",
					className: "token-pop size-3.5"
				}, `b${i}`)),
				Array.from({ length: empty }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-3.5 rounded-full border border-ink/40 bg-parchment-2" }, `e${i}`)),
				Array.from({ length: animal.fatTokens }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: "yellow",
					title: "Жир",
					className: "token-pop size-3.5"
				}, `f${i}`))
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-[10px] tabular-nums text-ink-soft",
			children: [
				animal.food,
				"/",
				need
			]
		})]
	});
});
/**
* Палитра парных карт. У животного бывает две пары плюс симбионт, поэтому
* каждая пара получает свой цвет: чип на обоих животных и плашка между ними
* помечаются одинаково, и видно, какое свойство к какой паре относится.
*/
var PAIR_COLORS = [
	"#1d6f8b",
	"#8a4b1f",
	"#4b7a2a",
	"#7a3b86",
	"#a33a3a",
	"#2f6f57"
];
/**
* Чип свойства. По правилам свойства выкладываются лицом вверх — чип всегда
* открытый; отключённое (disabled) — серое, перечёркнутое, без действия;
* fresh — вложено в текущем круге развития: точка «новое».
*
* Парное свойство дополнительно помечено цветом своей пары и подписью, кто
* напарник (для симбиоза — кто именно симбионт).
*
* Наведение/фокус открывает мини-окно с правилом над чипом; на тач-устройствах
* окно переключается тапом по чипу (тап не выбирает животное).
*/
var TraitChip = (0, import_react.memo)(function TraitChip({ type, pair, mark, disabled, fresh }) {
	const def = TRAITS[type];
	const tip = useTraitTip({ isolateClick: true });
	const anchorRef = (el) => {
		tip.anchorRef.current = el;
	};
	const bubble = tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
		def,
		pair,
		pairNote: mark?.note,
		pairColor: mark?.color,
		disabled,
		anchorRect: tip.anchorRect,
		id: tip.tipId
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: anchorRef,
		...tip.triggerProps,
		"data-trait-chip": true,
		style: mark && !disabled ? {
			backgroundColor: `${mark.color}1f`,
			boxShadow: `inset 0 0 0 1px ${mark.color}80`
		} : void 0,
		className: cn("anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/60", disabled ? "bg-virus/15 text-virus line-through decoration-virus/60" : def.virusLike ? "bg-virus/20 text-virus ring-1 ring-inset ring-virus/50" : def.harmful ? "bg-ink/85 text-parchment ring-1 ring-inset ring-clay/60" : type === "carnivore" ? "bg-clay/15 text-clay" : type === "fatTissue" ? "bg-food-yellow/20 text-ink" : "bg-ink/8 text-ink", fresh && !disabled && "chip-fresh"),
		children: [
			mark && !disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-2 shrink-0 rounded-full",
				style: { background: mark.color }
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
				id: type,
				className: "size-3.5"
			}),
			def.short,
			def.extraFood > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[9px] font-semibold text-clay",
				title: `+${def.extraFood} к потребности в еде`,
				children: ["+", def.extraFood]
			}) : null,
			mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] font-semibold",
				style: { color: mark.color },
				children: mark.note
			}) : pair ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] opacity-70",
				children: "пара"
			}) : null,
			fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-clay" }) : null,
			bubble
		]
	});
});
/**
* Карточка животного. Клик обрабатывается делегированием на контейнере
* (data-animal-id), поэтому компонент можно мемоизировать: он перерисовывается
* только при смене своих примитивных пропсов или самого объекта животного.
*/
var AnimalCard = (0, import_react.memo)(function AnimalCard({ animal, name, no, pairMarks, selected, dimmed, highlight, danger, dying, freshSince, draggable, dropTarget, onDragStartCard, onDragOverCard, onDropCard, onDragEndCard }) {
	const fed = isFed(animal);
	const width = 168 + Math.min(Math.max(animal.traits.length - 3, 0), 3) * 38;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-animal-id": animal.id,
		draggable: draggable || void 0,
		onDragStart: onDragStartCard,
		onDragOver: onDragOverCard,
		onDrop: onDropCard,
		onDragEnd: onDragEndCard,
		style: { width },
		className: cn("animal-card anim-card-in relative shrink-0 cursor-pointer rounded-[var(--radius-lg)] border bg-parchment p-3 text-left text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]", selected ? "border-clay ring-2 ring-clay/40" : "border-ink/10", highlight ? "ring-2 ring-accent" : "", danger ? "target-cracked ring-2 ring-danger/70" : "", dimmed ? "opacity-45" : "", dying ? "dying-pulse border-danger/60" : "", dropTarget ? "border-accent ring-2 ring-accent/60" : "", "hover:-translate-y-0.5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex flex-wrap items-start justify-between gap-x-2 gap-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex min-w-0 flex-1 basis-16 items-baseline gap-1 font-display text-sm tracking-tight",
					children: [no ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 text-[10px] tabular-nums text-ink-soft",
						children: ["№", no]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: hasTrait(animal, "obligateCarnivore") ? "Облигатный хищник" : hasTrait(animal, "carnivore") ? "Хищник" : hasTrait(animal, "swimming") ? "Водное" : "Животное"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 flex-wrap items-center justify-end gap-1",
					children: [
						(animal.population ?? 1) > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							title: `Численность вида: ${animal.population} животного(-ых)`,
							className: "flex items-center gap-0.5 rounded-full bg-accent/20 px-1.5 text-[10px] font-semibold tabular-nums text-accent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: TOKEN.population,
									alt: "",
									loading: "lazy",
									className: "size-3 rounded-full object-cover"
								}),
								"×",
								animal.population
							]
						}) : null,
						animal.sheltered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							title: "В убежище растения: хищники и хищные растения не тронут до конца фазы питания",
							className: "flex items-center gap-1 rounded-full bg-leaf/25 px-1.5 text-[10px] font-medium uppercase tracking-wide text-leaf",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full border border-leaf/60 bg-leaf/40" }), "убежище"]
						}) : null,
						animal.sedated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: "Откушало с лекарственного растения: накормлено, но свойства не действуют до конца фазы питания",
							className: "rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft",
							children: "усыплено"
						}) : null,
						animal.hibernating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide",
							children: "сон"
						}) : fed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-good/20 px-1.5 text-[10px] font-medium uppercase tracking-wide text-good",
							children: "сыто"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-clay/15 px-1.5 text-[10px] font-medium uppercase tracking-wide text-clay",
							children: "голод"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: speciesArt({
						swimming: hasTrait(animal, "swimming"),
						carnivore: isCarnivoreLike(animal),
						bulky: hasTrait(animal, "highBodyWeight")
					}),
					alt: "",
					loading: "lazy",
					className: "size-16 rounded-full border border-ink/25 object-cover object-top shadow-inner"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodDots, { animal }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: animal.traits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-ink-soft",
					children: "без свойств"
				}) : animal.traits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitChip, {
					type: t.type,
					pair: Boolean(t.pairWith),
					mark: pairMarks?.[t.id],
					disabled: t.disabled,
					fresh: freshSince !== void 0 && t.playSeq > freshSince ? true : void 0
				}, t.id))
			}),
			animal.marks?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 flex flex-wrap gap-1",
				children: animal.marks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkChip, { mark: m }, m))
			}) : null,
			name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-[10px] uppercase tracking-wider text-ink-soft",
				children: name
			}) : null
		]
	});
});
/**
* Мини-карта парного свойства — «лежит между» двумя животными, как на столе
* в настольной игре: на узком экране животные стоят столбиком, поэтому плашка
* становится горизонтальной полосой между ними, а на широком — вертикальной
* карточкой в ряду. На плашке рисуется арт свойства и цвет своей пары.
*/
function PairPlate({ type, color, note }) {
	const def = TRAITS[type];
	const dark = DARK_ART.has(type);
	const tip = useTraitTip({ isolateClick: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"data-trait-chip": true,
		title: `${def.name}${note ? ` · ${note}` : ""} — ${def.description}`,
		style: color ? {
			borderColor: color,
			backgroundColor: `${color}14`
		} : void 0,
		className: "relative flex w-full shrink-0 cursor-help items-center gap-2 self-center rounded-[var(--radius-sm)] border border-dashed border-ink/30 bg-parchment-2/80 px-2 py-1 text-ink shadow-[var(--shadow-card)] sm:w-[58px] sm:flex-col sm:justify-center sm:gap-1 sm:px-1 sm:py-2",
		children: [
			TRAIT_ART[type] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: TRAIT_ART[type],
				alt: "",
				loading: "lazy",
				className: cn("size-8 shrink-0 rounded-[4px] border border-ink/20 object-cover object-top sm:h-12 sm:w-full", dark && "bg-ink object-contain p-0.5")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-ink/20 bg-parchment sm:h-12 sm:w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
					id: type,
					className: "size-5 text-ink-soft"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex min-w-0 flex-1 flex-col sm:w-full sm:flex-none sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 truncate text-[10px] font-semibold leading-tight sm:text-[9px]",
					children: [color ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2 shrink-0 rounded-full",
						style: { background: color }
					}) : null, def.short]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-[9px] leading-tight text-ink-soft sm:max-w-full sm:text-center sm:text-[8px]",
					style: color ? { color } : void 0,
					children: note ?? "пара"
				})]
			}),
			tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
				def,
				pair: true,
				pairNote: note,
				pairColor: color,
				anchorRect: tip.anchorRect,
				id: tip.tipId
			}) : null
		]
	});
}
/** Грань карты руки: выбор свойства кликом, пояснение — наведением или фокусом. */
var HandFace = (0, import_react.memo)(function HandFace({ face, divided, active, disabled, onSelect }) {
	const def = TRAITS[face];
	const dark = DARK_ART.has(face);
	const tip = useTraitTip({ toggleOnTap: false });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		type: "button",
		disabled,
		onClick: () => onSelect(),
		className: cn("flex min-h-0 flex-1 flex-col items-stretch text-left transition-colors duration-[var(--motion-fast)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60", divided ? "border-b border-dashed border-ink/15" : "", active ? "ring-2 ring-inset ring-accent/70" : "hover:bg-ink/5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("relative block min-h-0 w-full flex-1 overflow-hidden", dark && "bg-ink"),
				children: TRAIT_ART[face] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: TRAIT_ART[face],
					alt: "",
					loading: "lazy",
					className: cn("absolute inset-0 h-full w-full", dark ? "scale-[0.86] object-contain" : "object-cover object-[50%_28%]")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute inset-0 flex items-center justify-center bg-parchment-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
						id: face,
						className: "size-10 text-ink-soft"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1 px-2 pt-1.5 text-[11px] font-semibold leading-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
					id: face,
					className: "size-3.5 shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: def.name
				})]
			}),
			def.extraFood ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "px-2 pb-1.5 text-[10px] leading-tight text-clay",
				children: [
					"+",
					def.extraFood,
					" еды"
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pb-1.5" })
		]
	}), tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
		def,
		anchorRect: tip.anchorRect,
		id: tip.tipId
	}) : null] });
});
/** Карта руки: кнопка «Животное» плюс по кнопке на каждое свойство грани. */
function HandCard({ card, selected, selectedFace, onSelect, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex h-[200px] w-[124px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border bg-parchment text-ink shadow-[var(--shadow-card)]", selected ? "border-clay ring-2 ring-clay/40" : "border-ink/12", disabled ? "opacity-50" : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled,
			onClick: () => onSelect("animal"),
			className: cn("flex h-8 items-center justify-center border-b border-ink/10 text-[10px] font-medium uppercase tracking-wider", selected && selectedFace === null ? "bg-ink text-parchment" : "bg-parchment-2/60 text-ink-soft hover:bg-parchment-2"),
			children: "Животное"
		}), card.faces.map((face, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandFace, {
			face,
			divided: i === 0 && card.faces.length > 1,
			active: selected && selectedFace === i,
			disabled,
			onSelect: () => onSelect(i)
		}, `${card.id}-${face}-${i}`))]
	});
}
/** Плашка свойства растения — как чип свойства животного, но на растении. */
var PlantTraitChip = (0, import_react.memo)(function PlantTraitChip({ type, fresh }) {
	const def = TRAITS[type];
	const tip = useTraitTip({ isolateClick: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"data-trait-chip": true,
		className: cn("anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] bg-leaf/20 px-1.5 text-[11px] font-medium text-leaf ring-1 ring-inset ring-leaf/40 outline-none focus-visible:ring-2 focus-visible:ring-accent/60", fresh && "chip-fresh"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
				id: type,
				className: "size-3.5"
			}),
			def.short,
			tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
				def,
				anchorRect: tip.anchorRect,
				id: tip.tipId
			}) : null
		]
	});
});
/**
* Карточка растения: арт/глиф вида, счётчик фишек и убежищ, свойства.
* Кликабельна в режимах интентов (взять еду / убежище / атака растения).
*/
var PlantCard = (0, import_react.memo)(function PlantCard({ plant, highlight, dimmed, selected, onClick, dying, fresh }) {
	const def = PLANTS[plant.kind];
	const art = PLANT_ART[plant.kind];
	const tip = useTraitTip({ toggleOnTap: false });
	const tipDef = {
		id: plant.kind,
		name: `${def.name} · растение`,
		description: def.description,
		image: art
	};
	const interactive = Boolean(onClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-plant-id": plant.id,
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"aria-label": `${def.name} — растение`,
		role: interactive ? "button" : void 0,
		onClick: interactive ? onClick : void 0,
		onKeyDown: interactive ? (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick?.();
			}
		} : void 0,
		className: cn("plant-card anim-card-in relative flex w-[132px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border border-ink/12 bg-parchment text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]", selected ? "border-clay ring-2 ring-clay/40" : "", highlight ? "border-accent ring-2 ring-accent" : "", dimmed ? "opacity-45" : "", dying ? "dying-pulse border-danger/60" : "", interactive && "hover:-translate-y-0.5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[4/3] w-full overflow-hidden bg-parchment-2",
				children: [
					art ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: art,
						alt: "",
						loading: "lazy",
						className: "absolute inset-0 h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute inset-0 flex items-center justify-center text-ink-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantGlyph, {
							kind: plant.kind,
							className: "size-10"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-1 top-1 rounded-full bg-ink/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-parchment",
						children: def.name
					}),
					def.carnivoreEdible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-1 top-1 size-4 rounded-full border border-ink/30 bg-food-yellow/80 text-center text-[10px] leading-4",
						title: "Хищники могут брать с этого растения еду",
						children: "🍎"
					}) : null,
					plant.kind === "carnivorous" && plant.attackedThisYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute bottom-1 right-1 rounded-full bg-clay/85 px-1.5 text-[9px] font-medium text-parchment",
						title: "Хищное растение уже атаковало в этом году",
						children: "атака была"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 px-2 py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-0.5",
					title: `Фишек еды: ${plant.food} (максимум ${def.maxFood})`,
					children: [
						Array.from({ length: Math.min(plant.food, 5) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
							tone: "green",
							className: "token-pop size-3"
						}, i)),
						plant.food > 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] tabular-nums",
							children: ["+", plant.food - 5]
						}) : null,
						plant.food === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-ink-soft",
							children: "без еды"
						}) : null
					]
				}), plant.shelters > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto flex items-center gap-0.5 rounded-full bg-leaf/25 px-1.5 text-[10px] font-semibold text-leaf",
					title: `Свободных убежищ: ${plant.shelters}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full border border-leaf/60 bg-leaf/40" }), plant.shelters]
				}) : null]
			}),
			plant.traits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 px-2 pb-2",
				children: plant.traits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantTraitChip, { type: t.type }, t.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-2 pl-2 text-[10px] text-ink-soft",
				children: fresh ? "новое растение" : "без свойств"
			}),
			tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
				def: tipDef,
				anchorRect: tip.anchorRect,
				id: tip.tipId
			}) : null
		]
	});
});
/** Полоса растений: общий стол растений (с «Континентами» — по континентам). */
function PlantStrip({ state, highlights, dying, onPlantClick, freshSince, zone }) {
	const plants = (state.plants ?? []).filter((p) => zone ? (p.zoneId ?? "gondwana") === zone : true);
	if (!plants.length) return null;
	const interactive = Boolean(onPlantClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": zone ? `Растения (${zone === "laurasia" ? "Лавразия" : "Гондвана"})` : "Растения",
		className: "paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full items-center justify-between text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: zone ? zone === "laurasia" ? "Растения Лавразии" : "Растения Гондваны" : "Растения · общие"
			}), zone ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums",
				children: [
					"колода ",
					state.plantDeckCount ?? state.plantDeck?.length ?? 0,
					" · погибло ",
					state.plantDiscard ?? 0
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: plants.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantCard, {
				plant: p,
				highlight: highlights.has(p.id),
				dimmed: interactive && highlights.size > 0 && !highlights.has(p.id),
				dying: dying?.has(p.id),
				onClick: interactive ? () => onPlantClick?.(p) : void 0,
				fresh: freshSince !== void 0 && p.playSeq > freshSince
			}, p.id))
		})]
	});
}
/** Длительность анимации закрытия: успевает проиграть modal-card-out. */
var EXIT_MS = 160;
/** Уважаем системную настройку «меньше движения». */
function reducedMotion$1() {
	return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/**
* Общий диалог подтверждения: затемнение, Esc и клик по фону закрывают,
* фокус встаёт на безопасную кнопку, подтверждение — отдельным вариантом.
*/
function ConfirmDialog({ title, body, confirmLabel, cancelLabel = "Отмена", tone = "default", onConfirm, onClose }) {
	const titleId = (0, import_react.useId)();
	const cancelRef = (0, import_react.useRef)(null);
	const pendingRef = (0, import_react.useRef)(null);
	const [closing, setClosing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		cancelRef.current?.focus();
	}, []);
	const requestClose = (0, import_react.useCallback)((action) => {
		if (pendingRef.current) return;
		if (reducedMotion$1()) {
			action();
			return;
		}
		pendingRef.current = action;
		setClosing(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!closing) return;
		const timer = window.setTimeout(() => {
			const action = pendingRef.current;
			pendingRef.current = null;
			action?.();
		}, EXIT_MS);
		return () => window.clearTimeout(timer);
	}, [closing]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "Escape") requestClose(onClose);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose, requestClose]);
	const [portalHost] = (0, import_react.useState)(() => typeof document === "undefined" ? null : document.body);
	if (!portalHost) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4 backdrop-blur-sm", closing ? "modal-backdrop-out" : "modal-backdrop-in"),
		onMouseDown: (event) => {
			if (event.target === event.currentTarget) requestClose(onClose);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			className: cn("w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)]", closing ? "modal-card-out" : "modal-card-in"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: titleId,
					className: "text-xl",
					children: title
				}),
				body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-sm leading-snug text-muted",
					children: body
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						ref: cancelRef,
						variant: "secondary",
						size: "md",
						className: "flex-1",
						onClick: () => requestClose(onClose),
						children: cancelLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: tone === "danger" ? "danger" : "default",
						size: "md",
						className: "flex-1",
						onClick: () => requestClose(onConfirm),
						children: confirmLabel
					})]
				})
			]
		})
	}), portalHost);
}
/**
* Настоящие 3D-кости с физикой (cannon-es): падают в лоток кормовой базы,
* сталкиваются и сваливаются в кучку, а затем мягко перекатываются нужной
* гранью кверху — значение задаёт движок партии, физика только «оживляет»
* бросок. Пока значения нет, кубики вечно подбрасываются.
*
* Значение грани видно зрителю (камера смотрит сверху и спереди):
* материалы BoxGeometry идут в порядке +x,−x,+y,−y,+z,−z — раскладываем
* очки так, чтобы противоположные грани давали в сумме 7, как на настоящей кости.
*/
var FACE_BY_MATERIAL = [
	1,
	6,
	2,
	5,
	3,
	4
];
/** Поворот, которым грань со значением оказывается к зрителю. */
var FACE_EULER = {
	3: [
		0,
		0,
		0
	],
	4: [
		0,
		Math.PI,
		0
	],
	1: [
		0,
		-Math.PI / 2,
		0
	],
	6: [
		0,
		Math.PI / 2,
		0
	],
	2: [
		Math.PI / 2,
		0,
		0
	],
	5: [
		-Math.PI / 2,
		0,
		0
	]
};
var PIPS = {
	1: [[.5, .5]],
	2: [[.3, .3], [.7, .7]],
	3: [
		[.3, .3],
		[.5, .5],
		[.7, .7]
	],
	4: [
		[.3, .3],
		[.7, .3],
		[.3, .7],
		[.7, .7]
	],
	5: [
		[.3, .3],
		[.7, .3],
		[.5, .5],
		[.3, .7],
		[.7, .7]
	],
	6: [
		[.3, .26],
		[.7, .26],
		[.3, .5],
		[.7, .5],
		[.3, .74],
		[.7, .74]
	]
};
/** Бумага граней — тот же лист, что лежит под игровым столом. */
var PAPER_SRC = "/img/bg/texture-paper.jpg";
var paperCache = null;
function paperImage() {
	paperCache ??= new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => resolve(null);
		img.src = PAPER_SRC;
	});
	return paperCache;
}
/**
* Грань кости: ровный тон цвета кормовой базы с лёгкой бумажной фактурой
* поверх (текстура стола, но приглушённо — тон доминирует), виньетка к кромке
* для объёма, очки — светлая кость с тёмной обводкой, как на окрашенной кости.
*/
function dieFaceTexture(value, paper, tint) {
	const S = 256;
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = S;
	const ctx = canvas.getContext("2d");
	const r = 30;
	const roundPath = () => {
		ctx.beginPath();
		ctx.moveTo(r, 0);
		ctx.arcTo(S, 0, S, S, r);
		ctx.arcTo(S, S, 0, S, r);
		ctx.arcTo(0, S, 0, 0, r);
		ctx.arcTo(0, 0, S, 0, r);
		ctx.closePath();
	};
	ctx.fillStyle = tint;
	ctx.fillRect(0, 0, S, S);
	const light = ctx.createLinearGradient(0, 0, 0, S);
	light.addColorStop(0, "rgba(255,246,225,0.32)");
	light.addColorStop(.5, "rgba(255,255,255,0)");
	light.addColorStop(1, "rgba(24,14,6,0.24)");
	ctx.fillStyle = light;
	ctx.fillRect(0, 0, S, S);
	if (paper) {
		roundPath();
		ctx.save();
		ctx.clip();
		ctx.globalAlpha = .24;
		ctx.drawImage(paper, 0, 0, S, S);
		ctx.restore();
	}
	const vig = ctx.createRadialGradient(S / 2, S / 2, S * .32, S / 2, S / 2, S * .78);
	vig.addColorStop(0, "rgba(0,0,0,0)");
	vig.addColorStop(1, "rgba(28,18,10,0.34)");
	ctx.fillStyle = vig;
	ctx.fillRect(0, 0, S, S);
	roundPath();
	ctx.lineWidth = 6;
	ctx.strokeStyle = "rgba(35,24,15,0.5)";
	ctx.stroke();
	for (const [fx, fy] of PIPS[value] ?? []) {
		const x = fx * S;
		const y = fy * S;
		ctx.beginPath();
		ctx.arc(x, y, 30, 0, Math.PI * 2);
		ctx.fillStyle = "#f8f1de";
		ctx.fill();
		ctx.lineWidth = 6;
		ctx.strokeStyle = "rgba(30,20,12,0.6)";
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x - 4, y - 5, 11, 0, Math.PI * 2);
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.fill();
	}
	const tex = new CanvasTexture(canvas);
	tex.colorSpace = SRGBColorSpace;
	return tex;
}
function Dice3D({ values, dieSize = 64, gap = 14, className, ariaLabel, tint = "#b4453a" }) {
	const canvasRef = (0, import_react.useRef)(null);
	const valuesRef = (0, import_react.useRef)(values);
	valuesRef.current = values;
	const n = Math.max(values.length, 1);
	const width = Math.max(n * dieSize + (n - 1) * gap, Math.round(dieSize * 2.3));
	const height = Math.round(dieSize * 1.6);
	const rollKey = values.map((v) => v ?? "?").join(",");
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let disposed = false;
		let cleanup;
		const io = new IntersectionObserver((entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			io.disconnect();
			paperImage().then((paper) => {
				requestAnimationFrame(() => {
					if (disposed || !canvasRef.current) return;
					cleanup = buildScene(canvasRef.current, paper, tint);
				});
			});
		}, { threshold: .2 });
		io.observe(canvas);
		return () => {
			disposed = true;
			io.disconnect();
			cleanup?.();
		};
	}, [
		rollKey,
		n,
		width,
		height,
		tint
	]);
	function buildScene(canvas, paper, tint) {
		const renderer = new WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			preserveDrawingBuffer: true
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
		renderer.setSize(width, height, false);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = 2;
		renderer.shadowMap.autoUpdate = false;
		const aspect = width / height;
		const frustumH = 2.5;
		const frustumW = frustumH * aspect;
		const camera = new OrthographicCamera(-frustumW / 2, frustumW / 2, frustumH / 2, -2.5 / 2, .1, 50);
		camera.position.set(0, 4.6, 3.4);
		camera.lookAt(0, .3, 0);
		const scene = new Scene();
		scene.add(new AmbientLight(16774886, .95));
		const key = new DirectionalLight(16777215, 1.8);
		key.position.set(2, 9, 1.5);
		key.castShadow = true;
		key.shadow.mapSize.set(512, 512);
		key.shadow.camera.left = -5;
		key.shadow.camera.right = 5;
		key.shadow.camera.top = 5;
		key.shadow.camera.bottom = -5;
		scene.add(key);
		const fill = new DirectionalLight(10466504, .5);
		fill.position.set(-4, 2, -2);
		scene.add(fill);
		const floor = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: .32 }));
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		scene.add(floor);
		const world = new World({ gravity: new Vec3(0, -20, 0) });
		world.broadphase = new SAPBroadphase(world);
		world.allowSleep = true;
		const diceMaterial = new Material("dice");
		const floorMaterial = new Material("floor");
		world.addContactMaterial(new ContactMaterial(floorMaterial, diceMaterial, {
			restitution: .25,
			friction: .55
		}));
		world.addContactMaterial(new ContactMaterial(diceMaterial, diceMaterial, {
			restitution: .15,
			friction: .12
		}));
		const ground = new Body({
			mass: 0,
			shape: new Plane(),
			material: floorMaterial
		});
		ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		world.addBody(ground);
		const wallX = Math.max(frustumW / 2 - 1.3, .6);
		const wallZ = .7;
		const wallShape = new Box(new Vec3(10, 4, .25));
		for (const [x, z, rz] of [
			[
				-wallX,
				0,
				Math.PI / 2
			],
			[
				wallX,
				0,
				Math.PI / 2
			],
			[
				0,
				-.7,
				0
			],
			[
				0,
				wallZ,
				0
			]
		]) {
			const wall = new Body({
				mass: 0,
				shape: wallShape,
				material: floorMaterial
			});
			wall.position.set(x, 2, z);
			wall.quaternion.setFromEuler(0, 0, rz);
			world.addBody(wall);
		}
		const geometry = new BoxGeometry(1, 1, 1);
		const materialsByValue = /* @__PURE__ */ new Map();
		const materialFor = (value) => {
			let m = materialsByValue.get(value);
			if (!m) {
				m = new MeshStandardMaterial({
					map: dieFaceTexture(value, paper, tint),
					roughness: .38,
					metalness: .04
				});
				materialsByValue.set(value, m);
			}
			return m;
		};
		const dice = [];
		const diceCount = Math.max(valuesRef.current.length, 1);
		for (let i = 0; i < diceCount; i++) {
			const materials = FACE_BY_MATERIAL.map((v) => materialFor(v));
			const mesh = new Mesh(geometry, materials);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.add(mesh);
			const body = new Body({
				mass: 1,
				shape: new Box(new Vec3(.5, .5, .5)),
				material: diceMaterial,
				sleepSpeedLimit: .6,
				sleepTimeLimit: .25
			});
			body.position.set((Math.random() * 2 - 1) * Math.max(wallX - .4, .1), 1.3 + i * .6, (Math.random() * 2 - 1) * .25);
			body.quaternion.setFromEuler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
			body.velocity.set((Math.random() * 2 - 1) * 2, -4 - Math.random() * 2, (Math.random() * 2 - 1) * 2);
			body.angularVelocity.set((Math.random() * 2 - 1) * 8, (Math.random() * 2 - 1) * 8, (Math.random() * 2 - 1) * 8);
			world.addBody(body);
			dice.push({
				mesh,
				body,
				target: null
			});
		}
		const targetOf = (value) => {
			const e = FACE_EULER[value] ?? FACE_EULER[3];
			return new Quaternion().setFromEuler(new Euler(e[0], e[1], e[2]));
		};
		let raf = 0;
		let last = performance.now();
		let elapsed = 0;
		let settleT = 0;
		let settled = false;
		let done = false;
		let nudgeAt = 0;
		const loop = (now) => {
			const dt = Math.min((now - last) / 1e3, .05);
			last = now;
			elapsed += dt;
			if (!done) renderer.shadowMap.needsUpdate = true;
			if (!settled) {
				world.step(1 / 60, dt, 3);
				for (const d of dice) {
					d.mesh.position.copy(d.body.position);
					d.mesh.quaternion.copy(d.body.quaternion);
				}
				if (elapsed > .3 && dice.every((d) => d.body.sleepState === Body.SLEEPING || d.body.velocity.lengthSquared() < .35 && d.body.angularVelocity.lengthSquared() < 1.2) || elapsed > 1.5) {
					const vals = valuesRef.current;
					if (vals.length >= dice.length && vals.slice(0, dice.length).every((v) => v != null)) {
						settled = true;
						settleT = 0;
						for (let i = 0; i < dice.length; i++) dice[i].target = targetOf(vals[i] ?? 3);
					} else if (elapsed - nudgeAt > .9) {
						nudgeAt = elapsed;
						for (const d of dice) {
							d.body.wakeUp();
							d.body.velocity.set((Math.random() * 2 - 1) * 1.6, 3 + Math.random() * 2, (Math.random() * 2 - 1) * 1.6);
							d.body.angularVelocity.set((Math.random() * 2 - 1) * 8, (Math.random() * 2 - 1) * 8, (Math.random() * 2 - 1) * 8);
						}
					}
				}
				renderer.render(scene, camera);
				raf = requestAnimationFrame(loop);
				return;
			}
			if (!done) {
				settleT += dt;
				const p = Math.min(settleT / .5, 1);
				for (const d of dice) {
					if (!d.target) continue;
					d.mesh.quaternion.slerp(d.target, Math.min(1, dt * 8));
					const targetY = .5 + .3 * Math.sin(Math.PI * p);
					d.mesh.position.y += (targetY - d.mesh.position.y) * Math.min(1, dt * 12);
				}
				if (p >= 1) {
					done = true;
					for (const d of dice) {
						if (!d.target) continue;
						d.mesh.quaternion.copy(d.target);
						d.mesh.position.y = .5;
					}
					renderer.render(scene, camera);
					raf = 0;
					return;
				}
				renderer.render(scene, camera);
				raf = requestAnimationFrame(loop);
			}
		};
		raf = requestAnimationFrame(loop);
		return () => {
			if (raf) cancelAnimationFrame(raf);
			geometry.dispose();
			for (const m of materialsByValue.values()) {
				m.map?.dispose();
				m.dispose();
			}
			floor.geometry.dispose();
			floor.material.dispose();
			renderer.dispose();
			if (!canvas.isConnected) renderer.forceContextLoss();
		};
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		role: "img",
		"aria-label": ariaLabel ?? "Игральные кости",
		style: {
			width,
			height,
			display: "block"
		},
		className: cn(className)
	});
}
var KIND_CLASS = {
	system: "italic text-subtle",
	action: "text-fg",
	important: "border-l-2 border-accent bg-accent/10 font-medium text-fg",
	chat: "bg-surface-2/70 text-fg"
};
/** Уважаем системную настройку «меньше движения». */
function reducedMotion() {
	return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/** Прокрутка к последней записи; плавно — только если движение не запрещено. */
function scrollToEnd(el, smooth) {
	if (smooth) el.scrollTo({
		top: el.scrollHeight,
		behavior: "smooth"
	});
	else el.scrollTop = el.scrollHeight;
}
function timeLabel(at) {
	return new Date(at).toLocaleTimeString("ru-RU", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
/** Одна запись ленты: время, автор и текст в оформлении по типу. */
function FeedRow({ item }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cn("feed-item-in flex items-start gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-xs", KIND_CLASS[item.kind]),
		children: [item.at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
			dateTime: new Date(item.at).toISOString(),
			className: "mt-px shrink-0 font-mono text-[10px] leading-4 text-subtle",
			children: timeLabel(item.at)
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1 break-words",
			children: [item.playerName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-medium",
				style: item.color ? { color: item.color } : void 0,
				children: [item.playerName, item.kind === "chat" ? ": " : " — "]
			}) : null, item.text]
		})]
	});
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
* Внутри: фильтры «Всё/События/Чат» (кнопки, не списки), быстрые фразы,
* кнопка броска кубика в чат, счётчик непрочитанного и автоскролл.
*/
function EventFeed({ items, open, onToggle, onSend, quickPhrases, title = "Журнал", className }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [unread, setUnread] = (0, import_react.useState)(0);
	const [chatUnread, setChatUnread] = (0, import_react.useState)(false);
	const listRef = (0, import_react.useRef)(null);
	const pinnedRef = (0, import_react.useRef)(true);
	const prevCountRef = (0, import_react.useRef)(items.length);
	const visible = items.filter((i) => filter === "all" ? true : filter === "chat" ? i.kind === "chat" : i.kind !== "chat");
	(0, import_react.useEffect)(() => {
		const added = items.length - prevCountRef.current;
		const fresh = added > 0 ? items.slice(-added) : [];
		prevCountRef.current = items.length;
		if (added <= 0) return;
		if (open && pinnedRef.current) {
			const el = listRef.current;
			if (el) scrollToEnd(el, !reducedMotion());
			return;
		}
		setUnread((n) => n + added);
		if (fresh.some((f) => f.kind === "chat")) setChatUnread(true);
	}, [items, open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		pinnedRef.current = true;
		setUnread(0);
		setChatUnread(false);
		const el = listRef.current;
		if (el) scrollToEnd(el, false);
	}, [open]);
	const onScroll = (0, import_react.useCallback)(() => {
		const el = listRef.current;
		if (!el) return;
		const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 24;
		pinnedRef.current = atBottom;
		if (atBottom) setUnread(0);
	}, []);
	const send = (raw) => {
		const text = raw.trim();
		if (!text || !onSend) return;
		onSend(text);
		setDraft("");
	};
	const last = items.length ? items[items.length - 1] : void 0;
	const lastText = last ? `${last.playerName ? `${last.playerName}: ` : ""}${last.text}` : "Пока пусто";
	const unreadLabel = unread > 99 ? "99+" : String(unread);
	const filters = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"aria-label": "Фильтр ленты",
		className: "flex items-center gap-0.5 rounded-full bg-ink/25 p-0.5",
		children: [
			["all", "Всё"],
			["log", "События"],
			["chat", "Чат"]
		].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-pressed": filter === id,
			onClick: () => setFilter(id),
			className: cn("h-9 rounded-full px-3 text-[11px] font-medium transition-colors duration-[var(--motion-fast)] sm:h-8 sm:px-2.5", filter === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
			children: label
		}, id))
	});
	const composer = onSend ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border px-2.5 py-2",
		children: [quickPhrases?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1.5 flex flex-wrap gap-1",
			role: "group",
			"aria-label": "Быстрые фразы",
			children: quickPhrases.map((phrase) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => send(phrase),
				className: "min-h-9 rounded-full border border-border bg-surface px-3 py-1 text-[10px] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg sm:min-h-7 sm:px-2 sm:py-0.5",
				children: phrase
			}, phrase))
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex items-end gap-1.5",
			onSubmit: (event) => {
				event.preventDefault();
				send(draft);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "iconSm",
					"aria-label": "Бросить кубик в чат",
					title: "Бросить кубик в чат",
					onClick: () => send(`🎲 ${1 + Math.floor(Math.random() * 6)}`),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: draft,
					onChange: (event) => setDraft(event.target.value),
					onKeyDown: (event) => {
						if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
							event.preventDefault();
							send(draft);
						}
					},
					rows: 1,
					placeholder: "Сообщение…",
					"aria-label": "Сообщение в чат",
					className: "max-h-20 min-h-9 flex-1 resize-none rounded-[var(--radius-sm)] border border-border bg-bg/60 px-2.5 py-1.5 text-xs leading-5 text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "secondary",
					size: "iconSm",
					"aria-label": "Отправить сообщение",
					disabled: !draft.trim(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
				})
			]
		})]
	}) : null;
	const list = (heightClass) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: listRef,
			onScroll,
			role: "log",
			"aria-live": "polite",
			"aria-relevant": "additions",
			"aria-label": `${title}: записи`,
			className: cn("min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-1.5 py-1.5", heightClass),
			children: visible.length ? visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedRow, { item }, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-1 italic text-subtle",
				children: "Пока пусто."
			})
		}), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: jumpToLatest,
			"aria-label": `Показать новые записи: ${unread}`,
			className: "absolute bottom-1.5 right-1.5 z-10 inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-fg shadow-[var(--shadow-card)] transition-colors duration-[var(--motion-fast)] hover:bg-surface-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" }),
				"новые",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-accent-fg",
					children: unreadLabel
				})
			]
		}) : null]
	});
	const jumpToLatest = () => {
		const el = listRef.current;
		if (el) scrollToEnd(el, !reducedMotion());
		pinnedRef.current = true;
		setUnread(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		"aria-label": title,
		className: cn("relative hidden shrink-0 flex-col overflow-hidden border-l border-border bg-surface/95 backdrop-blur-sm transition-all duration-300 ease-[var(--ease-out)] xl:flex", open ? "w-[340px]" : "w-14", className),
		children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 border-b border-border px-2.5 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 truncate text-sm font-medium text-muted",
						children: title
					}),
					filters,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onToggle(false),
						"aria-label": `Свернуть «${title}»`,
						"aria-expanded": true,
						className: "grid size-7 shrink-0 place-items-center rounded-[var(--radius-sm)] text-subtle transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})
				]
			}),
			list("text-xs"),
			composer
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-full flex-col items-center gap-2 pt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onToggle(true),
				"aria-label": `Развернуть «${title}»${unread > 0 ? `, новых записей: ${unread}` : ""}`,
				"aria-expanded": false,
				title: lastText,
				className: "relative grid size-10 place-items-center rounded-[var(--radius-md)] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" }), chatUnread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "absolute right-1.5 top-1.5 size-2.5 rounded-full border-2 border-surface bg-danger"
				}) : unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold text-accent-fg",
					children: unreadLabel
				}) : null]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "xl:hidden",
		children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-label": title,
			className: cn("fixed inset-0 z-50 flex flex-col bg-surface sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[380px] sm:border-l sm:border-border sm:shadow-[var(--shadow-card)]", "animate-[fade-in_.2s_var(--ease-out)]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-2 border-b border-border px-2.5 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onToggle(false),
							"aria-label": `Свернуть «${title}»`,
							className: "grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-sm font-medium text-muted",
							children: title
						}),
						filters
					]
				}),
				list("text-sm"),
				composer
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onToggle(true),
			"aria-label": `Развернуть «${title}»${unread > 0 ? `, новых записей: ${unread}` : ""}`,
			"aria-expanded": false,
			className: cn("fixed right-3 top-16 z-30 flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-full border border-border bg-surface/95 px-3 py-2 text-xs shadow-[var(--shadow-card)] backdrop-blur-sm transition-colors duration-[var(--motion-fast)] hover:bg-surface-2", className),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 font-medium text-muted",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden min-w-0 flex-1 truncate text-subtle sm:inline",
					children: lastText
				}),
				chatUnread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "size-2.5 shrink-0 rounded-full bg-danger"
				}) : unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "grid h-4 min-w-4 shrink-0 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg",
					children: unreadLabel
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-3.5 shrink-0 text-subtle" })
			]
		})
	})] });
}
/**
* Единый стиль пояснений — как подсказки к свойствам животных: та же
* пергаментная карточка, типографика и акценты. Используется везде, где
* интерфейс что-то объясняет (туториал, доки, лобби, финальный экран).
*/
function HintNote({ children, title, icon, tone = "default", compact = false, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-start gap-2 rounded-[var(--radius-sm)] border bg-surface-2/60 text-muted", tone === "warning" ? "border-clay/40 bg-clay/10 text-clay" : "border-border", compact ? "px-2 py-1.5 text-[11px] leading-snug" : "px-3 py-2.5 text-xs leading-snug", className),
		children: [icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 shrink-0 opacity-70",
			children: icon
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-medium text-fg", compact ? "text-[11px]" : "text-xs"),
				children: title
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn(title && "mt-0.5"),
				children
			})]
		})]
	});
}
/**
* Тумблер звука с поповером настроек: включение/выключение, громкость
* эффектов и фона, кнопка «Проверить». Всё хранится в localStorage
* (см. `sfx`), панель — на локальном состоянии, без внешних зависимостей.
* Кнопка компактная (size="icon"), чтобы жить в общей шапке.
*/
function SoundToggle() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [on, setOn] = (0, import_react.useState)(sfx.enabled);
	const [volume, setVolume] = (0, import_react.useState)(() => sfx.volume);
	const rootRef = (0, import_react.useRef)(null);
	const sfxSliderId = (0, import_react.useId)();
	const ambientSliderId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onPointerDown = (e) => {
			if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
		};
		const onKeyDown = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);
	const toggleSound = () => {
		const next = !on;
		setOn(next);
		sfx.setEnabled(next);
	};
	const changeSfxVolume = (percent) => {
		const value = percent / 100;
		setVolume((prev) => ({
			...prev,
			sfxVolume: value,
			sfx: value
		}));
		sfx.setVolume({ sfxVolume: value });
	};
	const changeAmbientVolume = (percent) => {
		const value = percent / 100;
		setVolume((prev) => ({
			...prev,
			ambientVolume: value,
			ambient: value
		}));
		sfx.setVolume({ ambientVolume: value });
	};
	const testSound = () => {
		if (!on) {
			setOn(true);
			sfx.setEnabled(true);
			return;
		}
		sfx.play("food", 0, { gain: .9 });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "relative inline-flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			"aria-label": on ? "Звук включён: настройки" : "Звук выключен: настройки",
			"aria-haspopup": "dialog",
			"aria-expanded": open,
			title: on ? "Звук включён" : "Звук выключен",
			onClick: () => setOpen((v) => !v),
			children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-label": "Настройки звука",
			className: "absolute right-0 top-full z-50 mt-2 w-60 rounded-[var(--radius-md)] border border-border bg-surface p-3 text-sm shadow-[var(--shadow-card)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "switch",
					"aria-checked": on,
					onClick: toggleSound,
					className: "flex w-full items-center justify-between rounded-[var(--radius-sm)] px-1 py-1.5 text-left text-fg hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Звук" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-[var(--motion-fast)] " + (on ? "bg-accent" : "bg-surface-2 border border-border"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0.5 size-4 rounded-full bg-parchment transition-[left] duration-[var(--motion-fast)] " + (on ? "left-[18px]" : "left-0.5") })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 border-t border-border pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: sfxSliderId,
							children: "Эффекты"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [Math.round(volume.sfxVolume * 100), "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: sfxSliderId,
						type: "range",
						min: 0,
						max: 100,
						step: 1,
						value: Math.round(volume.sfxVolume * 100),
						onChange: (e) => changeSfxVolume(Number(e.target.value)),
						className: "mt-1 h-1.5 w-full cursor-pointer accent-[var(--color-accent)]"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: ambientSliderId,
							children: "Фон"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [Math.round(volume.ambientVolume * 100), "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: ambientSliderId,
						type: "range",
						min: 0,
						max: 100,
						step: 1,
						value: Math.round(volume.ambientVolume * 100),
						onChange: (e) => changeAmbientVolume(Number(e.target.value)),
						className: "mt-1 h-1.5 w-full cursor-pointer accent-[var(--color-accent)]"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					className: "mt-3 w-full",
					onClick: testSound,
					children: "Проверить"
				})
			]
		})]
	});
}
/**
* Общая шапка меню и игрового стола: лого, название и правый слот действий.
* Классы совпадают с прежними шапками из screens.tsx и game-app.tsx.
*/
function TopBar({ subtitle, subtitleShort, children, left, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/90 px-3 py-2.5 backdrop-blur-sm sm:px-5", className),
		children: [left ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-w-0 flex-1 items-center gap-3",
			children: left
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: LOGO,
			alt: "",
			className: "size-8 shrink-0 rounded-full border border-border object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-lg leading-none",
				children: "Эволюция"
			}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs leading-tight text-muted sm:truncate",
				children: subtitleShort ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sm:hidden",
					children: subtitleShort
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: subtitle
				})] }) : subtitle
			}) : null]
		})] }), children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-w-0 flex-wrap items-center justify-end gap-1",
			children
		}) : null]
	});
}
var PHASES = [
	"Развитие",
	"Кормовая база",
	"Питание",
	"Вымирание"
];
var SLIDES = [
	{
		title: "Как играть в «Эволюцию»",
		paragraphs: [
			"Вы разводите виды и ведёте их через голодные годы. Год состоит из четырёх фаз — они показаны в шапке стола.",
			"Побеждает тот, чья популяция после последнего года наберёт больше очков: 2 очка за каждое животное вида и по очку за каждое свойство.",
			"Партия занимает 10–20 минут: выберите число игроков, сложность ботов и дополнения — и вперёд."
		]
	},
	{
		art: "/img/tutorial/place-card.jpg",
		title: "Развитие",
		paragraphs: [
			"Разыгрывайте по одной карте за круг: как новое животное или как свойство на свой вид. Двойная карта — одно из двух свойств на выбор.",
			"Подсветка подсказывает, куда карту можно положить; наведение на чип свойства открывает его правило. Парные свойства (симбиоз, сотрудничество) кладутся между двумя животными.",
			"Когда все спасуют, фаза заканчивается."
		]
	},
	{
		art: "/img/tutorial/feeding.jpg",
		title: "Питание",
		paragraphs: [
			"Кормовая база бросается кубиками — это красные фишки. Накормите животных по потребности: кликните по подсвеченной карточке или кнопке «Взять еду».",
			"Хищники берут синие фишки с добычи, «жировой запас» откладывает еду на голодный год. Накормленное животное свойствами больше не пользуется.",
			"Фаза идёт по кругу, пока есть еда и желающие: один ход — до нажатия «Закончить ход»."
		]
	},
	{
		art: "/img/tutorial/hunt.jpg",
		title: "Охота",
		paragraphs: [
			"Кнопка «Охота» у хищника подсвечивает допустимых жертв: крупного не взять, водное — только в океане, стадность защищается числом.",
			"Жертва может спастись: «Быстрое» бросает кубик, маскировка прячется, хвостоплавник отбрасывает хвост. Съеденная добыча даёт хищнику +2 синие фишки.",
			"Защищаться нужно вовремя — стол сам спросит модальным окном, когда нападут на вас."
		]
	},
	{
		art: "/img/tutorial/extinction.jpg",
		title: "Вымирание и финал",
		paragraphs: [
			"Ненакормленные животные погибают; за выживших добираются карты из колоды. Когда колода пуста — наступает последний год.",
			"В финале очки считают по живым животным, свойствам и бонусам: хищник и большой вес дают дополнительно.",
			"Счёт каждого игрока виден на его табло рядом со сбросом — следите за отрывом."
		]
	}
];
function TutorialScreen({ onClose, onStart }) {
	const [i, setI] = (0, import_react.useState)(0);
	const slide = SLIDES[i];
	const last = i === SLIDES.length - 1;
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, SLIDES.length - 1));
			if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-border bg-surface sm:rounded-[var(--radius-xl)]",
			children: [
				slide.art ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: slide.art,
					alt: "",
					className: "h-40 w-full shrink-0 object-cover sm:h-52"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "flex h-40 shrink-0 flex-wrap content-center items-center justify-center gap-2 bg-gradient-to-b from-good/15 to-transparent px-6 sm:h-52",
					children: PHASES.map((p, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center rounded-[var(--radius-sm)] border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-1.5 font-display text-[10px] text-muted",
								children: k + 1
							}), p]
						}), k < PHASES.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "→"
						}) : null]
					}, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto p-5 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.24em] text-muted",
							children: [
								"Обучение · ",
								i + 1,
								" из ",
								SLIDES.length
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl",
							children: slide.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-2.5 text-sm text-muted",
							children: slide.paragraphs.map((p, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, k))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "tablist",
						"aria-label": "Слайды обучения",
						className: "flex items-center gap-0.5 rounded-full bg-ink/30 p-1",
						children: SLIDES.map((s, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": k === i,
							"aria-label": `Слайд ${k + 1}: ${s.title}`,
							title: s.title,
							onClick: () => setI(k),
							className: "-mx-1.5 grid size-8 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 rounded-full transition-all duration-[var(--motion-fast)]", k === i ? "w-5 bg-accent" : "w-1.5 bg-parchment/40 hover:bg-parchment/70") })
						}, s.title))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							disabled: i === 0,
							onClick: () => setI((v) => Math.max(v - 1, 0)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Назад"]
						}), last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: onStart,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Начать партию"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setI((v) => Math.min(v + 1, SLIDES.length - 1)),
							children: ["Далее", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
						})]
					})]
				})
			]
		})
	});
}
var SPEEDS = [
	[
		"slow",
		"Медленно",
		"Боты думают дольше, фазы показываются с паузами"
	],
	[
		"normal",
		"Обычно",
		"Комфортный настольный темп"
	],
	[
		"fast",
		"Быстро",
		"Для тех, кто ждёт только своего хода"
	]
];
/** Дополнения в разработке — официальный пересказ правил следующим обновлением. */
var MODULES = [];
/** Видимый фокус для кастомных кнопок-переключателей вне Button из UI-кита. */
var FOCUS_VISIBLE = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
/**
* Готовые наборы дополнений. «Новичок» — только «Растения»: еда лежит на
* картах, и правила проще всего объяснить за столом.
*/
var MODULE_PRESETS = [
	{
		id: "classic",
		label: "Классика",
		hint: "Базовая игра без дополнений",
		modules: {}
	},
	{
		id: "full",
		label: "Полный набор",
		hint: "Все четыре дополнения сразу",
		modules: {
			continents: true,
			plants: true,
			fungi: true,
			randomMutations: true
		}
	},
	{
		id: "novice",
		label: "Новичок",
		hint: "Только «Растения» — еда на картах вместо кубика",
		modules: { plants: true }
	}
];
/**
* Грубая оценка длины партии по размеру колоды: за год колода уходит примерно
* на 3,2 карты на игрока (добор «выжившие + 1»). Эмпирика прогонов движка:
* полная база (84) при двух игроках — около 14 лет, при четырёх — около 7.
*/
function estimateYears$1(deckSize, players) {
	return Math.max(2, Math.round(deckSize / (3.2 * Math.max(1, players))));
}
/** Дата и время сохранения соло-партии для строки «Продолжить». */
function formatSavedAt(ms) {
	return new Date(ms).toLocaleString("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function MenuScreen({ onStart, onRules }) {
	const [players, setPlayers] = (0, import_react.useState)(2);
	const [difficulty, setDifficulty] = (0, import_react.useState)("normal");
	const [deckSize, setDeckSize] = (0, import_react.useState)(null);
	const [statsOpen, setStatsOpen] = (0, import_react.useState)(false);
	const [tutorialOpen, setTutorialOpen] = (0, import_react.useState)(false);
	const [resumeError, setResumeError] = (0, import_react.useState)(null);
	const speed = useGameStore((s) => s.speed);
	const setSpeed = useGameStore((s) => s.setSpeed);
	const continents = useGameStore((s) => Boolean(s.modules.continents));
	const plants = useGameStore((s) => Boolean(s.modules.plants));
	const fungi = useGameStore((s) => Boolean(s.modules.fungi));
	const mutations = useGameStore((s) => Boolean(s.modules.randomMutations));
	const modules = useGameStore((s) => s.modules);
	const setModules = useGameStore((s) => s.setModules);
	const soloSave = useGameStore((s) => s.soloSave);
	const resumeSolo = useGameStore((s) => s.resumeSolo);
	const refreshSoloSave = useGameStore((s) => s.refreshSoloSave);
	const netFatal = useGameStore((s) => s.netFatal);
	const clearNetFatal = useGameStore((s) => s.clearNetFatal);
	(0, import_react.useEffect)(() => {
		refreshSoloSave();
	}, [refreshSoloSave]);
	const deckFull = Math.max(deckSizeFor(1, modules), 20);
	const deckNow = deckSize === null ? deckFull : Math.min(deckSize, deckFull);
	function handleResume() {
		setResumeError(null);
		if (!resumeSolo()) {
			setResumeError("Сохранённая партия не найдена — возможно, срок хранения (48 часов) истёк.");
			refreshSoloSave();
		}
	}
	const openTutorial = () => {
		sfx.play("modal");
		setTutorialOpen(true);
	};
	const closeTutorial = () => {
		sfx.play("modal");
		setTutorialOpen(false);
	};
	const openStats = () => {
		sfx.play("modal");
		setStatsOpen(true);
	};
	const closeStats = () => {
		sfx.play("modal");
		setStatsOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"aria-hidden": true,
			className: "pointer-events-none fixed inset-0 -z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: BG.valley,
					alt: "",
					className: "h-full w-full object-cover opacity-40"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/55 to-bg" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 paper-desk opacity-[0.14]" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex min-h-dvh flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TopBar, {
				subtitle: "Правильные игры · Кнорре",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						"aria-label": "Обучение",
						title: "Обучение",
						onClick: openTutorial,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Обучение"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						"aria-label": "Правила",
						title: "Правила",
						onClick: onRules,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Правила"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						"aria-label": "Статистика",
						title: "Статистика",
						onClick: openStats,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Статистика"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundToggle, {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "relative text-center text-5xl text-fg sm:text-6xl",
						children: "Эволюция"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "relative mx-auto mt-3 max-w-md text-center text-muted",
						children: "Настольная игра о происхождении видов. Комбинируйте свойства, кормите популяцию и переживайте голодные годы."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-10 space-y-6 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7",
						children: [
							netFatal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								role: "alert",
								className: "flex items-start justify-between gap-3 rounded-[var(--radius-lg)] border border-danger/50 bg-danger/10 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-2 text-sm text-clay",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: netFatal })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "shrink-0",
									onClick: clearNetFatal,
									children: "Понятно"
								})]
							}) : null,
							soloSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[var(--radius-lg)] border border-border bg-bg p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-sm font-medium text-fg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4 text-muted" }), "Незаконченная партия"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-muted",
											children: [
												"Год ",
												soloSave.year,
												" · сохранено ",
												formatSavedAt(soloSave.savedAt)
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "md",
										className: "shrink-0",
										onClick: handleResume,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Продолжить"]
									})]
								}), resumeError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-clay",
									children: resumeError
								}) : null]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetMenuPanel, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
									className: "mb-3 flex items-center gap-2 text-sm font-medium text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Игроков за столом"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-4 gap-2 sm:grid-cols-7",
									children: [
										2,
										3,
										4,
										5,
										6,
										7,
										8
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPlayers(n),
										className: cn(FOCUS_VISIBLE, "h-12 rounded-[var(--radius-md)] border text-sm font-medium", players === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
										children: n
									}, n))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-subtle",
									children: ["Вы против ", players - 1 === 1 ? "одного бота" : `${players - 1} ботов`]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "mb-3 text-sm font-medium text-muted",
								children: "Сложность"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									["easy", "Проще"],
									["normal", "Обычная"],
									["hard", "Жёстче"]
								].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDifficulty(id),
									className: cn(FOCUS_VISIBLE, "h-12 rounded-[var(--radius-md)] border text-sm font-medium", difficulty === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
									children: label
								}, id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "mb-3 text-sm font-medium text-muted",
									children: "Размер колоды свойств"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 grid grid-cols-3 gap-2",
									children: [
										[Math.max(20, Math.round(deckFull * .36)), "Короткая"],
										[Math.max(24, Math.round(deckFull * .5)), "Обычная"],
										[deckFull, "Полная"]
									].map(([n, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setDeckSize(n),
										className: cn(FOCUS_VISIBLE, "h-10 rounded-[var(--radius-md)] border text-xs font-medium", deckNow === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
										children: [
											label,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums opacity-70",
												children: n
											})
										]
									}, label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 20,
									max: deckFull,
									step: 1,
									value: deckNow,
									onChange: (e) => setDeckSize(Number(e.target.value)),
									"aria-label": "Размер колоды свойств",
									className: "range-evo w-full"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-subtle",
									children: [
										"Колода ",
										deckNow,
										" карт · ≈",
										estimateYears$1(deckNow, players),
										" лет партии. Полная — как в коробке."
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "mb-3 text-sm font-medium text-muted",
								children: "Темп игры"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 sm:grid-cols-3",
								children: SPEEDS.map(([id, label, hint]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									title: hint,
									onClick: () => setSpeed(id),
									className: cn(FOCUS_VISIBLE, "h-11 rounded-[var(--radius-md)] border text-sm font-medium", speed === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
									children: label
								}, id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "mb-3 text-sm font-medium text-muted",
									children: "Дополнения"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 grid grid-cols-3 gap-2",
									children: MODULE_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										title: p.hint,
										onClick: () => setModules(p.modules),
										className: "h-10 rounded-[var(--radius-md)] border border-border bg-bg text-xs font-medium text-fg hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
										children: p.label
									}, p.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setModules({
												...modules,
												continents: !continents
											}),
											"aria-pressed": continents,
											title: "Континенты: Лавразия и Гондвана с отдельными кормовыми базами, Океан для водоплавающих, миграция, прилипала, стадность, стрекательные клетки, эдификатор, регенерация, рекомбинация, неоплазия",
											className: cn(FOCUS_VISIBLE, "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", continents ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-medium text-fg",
												children: "Континенты"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: "две кормовые базы и океан · миграция · новые свойства"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", continents ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
												children: continents ? "вкл" : "выкл"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setModules({
												...modules,
												plants: !plants
											}),
											"aria-pressed": plants,
											title: "Растения: еда этого года — на общих растениях, кубик не нужен; фаза роста, убежища, хищные растения, микориза и паразиты. Совместимо с Континентами.",
											className: cn(FOCUS_VISIBLE, "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", plants ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-medium text-fg",
												children: "Растения"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: "еда на общих растениях · убежища · фаза роста · хищные растения"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", plants ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
												children: plants ? "вкл" : "выкл"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setModules({
												...modules,
												fungi: !fungi
											}),
											"aria-pressed": fungi,
											title: "Трава и грибы: еда этого года — на общих картах трав и грибов; метки последствий (Яд, Сон, Бешенство…), новые свойства «Прозрачное» и «Насекомоядное». Совместимо с Континентами и Растениями.",
											className: cn(FOCUS_VISIBLE, "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", fungi ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-medium text-fg",
												children: "Трава и грибы"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: "еда на травах и грибах · метки последствий · флора играет на победу"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", fungi ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
												children: fungi ? "вкл" : "выкл"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setModules({
												...modules,
												randomMutations: !mutations
											}),
											"aria-pressed": mutations,
											title: "Случайные мутации: вместо руки — личная слепая колода; объявите розыгрыш и вскройте карту. Новые свойства, в том числе вредные мутации. Совместимо со всеми дополнениями.",
											className: cn(FOCUS_VISIBLE, "flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", mutations ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-medium text-fg",
												children: "Случайные мутации"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 block text-xs text-muted",
												children: "личная слепая колода · численность видов · вредные мутации"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", mutations ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
												children: mutations ? "вкл" : "выкл"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "grid gap-2 sm:grid-cols-2",
											children: MODULES.map(([name, hint]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												title: `${name}: ${hint}. Готовится — официальный пересказ правил следующим обновлением.`,
												className: "flex cursor-not-allowed items-center justify-between rounded-[var(--radius-md)] border border-dashed border-border bg-bg px-3 py-2.5 opacity-60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm text-fg",
													children: name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted",
													children: "скоро"
												})]
											}, name))
										})
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "flex-1",
								size: "lg",
								onClick: () => onStart(players, difficulty, deckNow),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Начать год"]
							})
						]
					})
				]
			})]
		}),
		tutorialOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialScreen, {
			onClose: closeTutorial,
			onStart: () => {
				closeTutorial();
				onStart(players, difficulty, deckNow);
			}
		}) : null,
		statsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsScreen, { onClose: closeStats }) : null
	] });
}
var RULES_TABS = [
	{
		id: "base",
		label: "Базовая игра"
	},
	{
		id: "continents",
		label: "Континенты"
	},
	{
		id: "plants",
		label: "Растения"
	},
	{
		id: "fungi",
		label: "Трава и грибы"
	},
	{
		id: "mutations",
		label: "Мутации"
	}
];
var TRAITS_BY_TAB = {
	base: TRAIT_ORDER.filter((id) => !CONTINENTS_TRAIT_IDS.has(id) && !PLANTS_TRAIT_IDS.has(id) && !FUNGI_TRAIT_IDS.has(id) && !MUTATIONS_TRAIT_IDS.has(id)),
	continents: TRAIT_ORDER.filter((id) => CONTINENTS_TRAIT_IDS.has(id)),
	plants: TRAIT_ORDER.filter((id) => PLANTS_TRAIT_IDS.has(id)),
	fungi: TRAIT_ORDER.filter((id) => FUNGI_TRAIT_IDS.has(id)),
	mutations: TRAIT_ORDER.filter((id) => MUTATIONS_TRAIT_IDS.has(id))
};
function TraitList({ ids }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: ids.map((id) => {
			const t = TRAITS[id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [TRAIT_ART[t.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: TRAIT_ART[t.id],
					alt: "",
					loading: "lazy",
					className: cn("h-[68px] w-12 shrink-0 rounded-[var(--radius-xs)] object-cover object-top", DARK_ART.has(t.id) && "bg-ink object-contain p-0.5")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-[68px] w-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-border bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
						id: t.id,
						className: "size-7 text-muted"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-fg",
					children: t.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: t.description
				})] })]
			}, t.id);
		})
	});
}
/** Список карт флоры «Травы и грибов» в правилах. */
function FloraList() {
	const kinds = Object.keys(FLORA);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: kinds.map((k) => {
			const f = FLORA[k];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [FLORA_ART[k] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: FLORA_ART[k],
					alt: "",
					loading: "lazy",
					className: "h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex h-[68px] w-[102px] shrink-0 items-center justify-center rounded-[var(--radius-xs)] border", f.isFungus ? "border-virus/40 bg-virus/10 text-virus" : "border-leaf/40 bg-leaf/10 text-leaf"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloraGlyph, {
						kind: k,
						className: "size-7"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium text-fg",
					children: [f.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 text-xs font-normal text-muted",
						children: [
							"(",
							f.isFungus ? "гриб · входит с 1 фишкой" : "трава · входит с 3",
							")"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: f.description
				})] })]
			}, k);
		})
	});
}
/** Список меток последствий в правилах. */
function MarksList() {
	const kinds = Object.keys(MARKS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: kinds.map((k) => {
			const m = MARKS[k];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: MARK_ART[k],
					alt: "",
					loading: "lazy",
					className: "size-10 shrink-0 self-start rounded-full object-cover ring-1 ring-border"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium text-fg",
					children: [
						"Метка «",
						m.name,
						"» · по 4 в комплекте"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: m.description
				})] })]
			}, k);
		})
	});
}
/** Список видов растений «Растений» в правилах. */
function PlantsList() {
	const kinds = Object.keys(PLANTS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: kinds.map((k) => {
			const p = PLANTS[k];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [PLANT_ART[k] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: PLANT_ART[k],
					alt: "",
					loading: "lazy",
					className: "h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border bg-surface" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-fg",
					children: p.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: p.description
				})] })]
			}, k);
		})
	});
}
/** Описания территорий «Континентов» для карточек в правилах. */
var TERRITORY_DESC = {
	laurasia: "Северный из двух континентов с самой щедрой базой: 8 фишек при двух игроках, 11 при трёх, 14 при четырёх.",
	gondwana: "Южный континент: 7/10/13 фишек по числу игроков. С «Растениями» и «Травой и грибами» флора стоит на обоих континентах.",
	ocean: "Мир воды — только водоплавающие, база 5/7/9. Водность несъёмна: уйти из океана можно лишь миграцией."
};
/** Карточки территорий «Континентов» в правилах. */
function TerritoryList() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-2 sm:grid-cols-3",
		children: TERRITORIES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: TERRITORY_ART[t.id],
				alt: t.name,
				loading: "lazy",
				className: "aspect-square w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium text-fg",
					children: t.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: TERRITORY_DESC[t.id]
				})]
			})]
		}, t.id))
	});
}
/** Кубик-фишка еды из игры (FoodCube) в базовых правилах. */
function RuleCube({ tone, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
			tone,
			className: "size-8",
			title: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] leading-none text-muted",
			children: label
		})]
	});
}
/** Круглая иллюстрация базовых правил: медальон животного. */
function RuleToken({ src, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			loading: "lazy",
			className: "size-10 rounded-full object-cover ring-1 ring-border"
		}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] leading-none text-muted",
			children: label
		}) : null]
	});
}
/** Миниатюра карты для базовых правил. */
function RuleCard({ src, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			loading: "lazy",
			className: "h-16 w-11 rounded-[var(--radius-xs)] border border-border object-cover"
		}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] leading-none text-muted",
			children: label
		}) : null]
	});
}
function RulesPanel({ onClose }) {
	const [tab, setTab] = (0, import_react.useState)("base");
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-5 sm:rounded-[var(--radius-xl)] sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: "Правила"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onClose,
						children: "Закрыть"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tablist",
					"aria-label": "Раздел правил",
					className: "mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: RULES_TABS.map(({ id, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tab === id,
						onClick: () => setTab(id),
						className: cn(FOCUS_VISIBLE, "h-11 rounded-[var(--radius-md)] border px-1 text-sm font-medium", tab === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
						children: label
					}, id))
				}),
				tab === "base" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Базовая русская «Эволюция» (Правильные игры, 2010). Колода 84 карты, 2–4 игрока. Побеждает тот, чья популяция набрала больше очков после последнего года." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Ход года"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "list-decimal space-y-2 pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-fg",
										children: "Развитие."
									}),
									" По кругу выкладывайте по одной карте: новое животное или свойство. Свойства кладутся лицом вверх — все видят, кто что выложил. Двойные карты — одно из двух свойств. Паразит только на чужих. Парная карта (симбиоз, сотрудничество, взаимодействие) кладётся между двумя животными — на пару может лежать только одна парная карта. Пас — и больше не играете в этой фазе; когда спасовали все, фаза заканчивается.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 flex flex-wrap items-end gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
												src: BG.cardBack,
												label: "рука"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
												src: TRAIT_ART.carnivore,
												label: "свойство"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
												src: speciesArt({}),
												label: "животное"
											})
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-fg",
										children: "Кормовая база."
									}),
									" 2 игрока: 1d6+2. 3: 2d6. 4: 2d6+2.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 flex flex-wrap items-end gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice3D, {
											values: [2, 5],
											dieSize: 44,
											gap: 10,
											ariaLabel: "Кости кормовой базы"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
											tone: "red",
											label: "фишка базы"
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-fg",
										children: "Питание."
									}),
									" Ход длится, пока не нажмёте «Закончить ход»: одно действие ход не отдаёт. За ход можно напасть каждым из своих хищников и/или использовать всех пиратов — либо взять одну фишку еды (накормленное животное берёт только в пустой жировой запас); если берёте еду, хищники и пираты в этот ход недоступны. Накормленное животное больше не использует свойства: не нападает, не пиратствует, не топчет, не уходит в спячку и не тратит жир. Топтуны топчут вместе с взятием еды, каждый — раз за ход. Превращение жира — свободное действие. Когда делать нечего совсем, ход передаётся сам. «Пас» выводит вас до конца фазы; фаза заканчивается, когда база пуста, все накормлены, все пасанули или никому нельзя ходить.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 flex flex-wrap items-end gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
												tone: "red",
												label: "красная"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
												tone: "blue",
												label: "синяя"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
												tone: "yellow",
												label: "жир"
											})
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-fg",
										children: "Вымирание."
									}),
									" Ненакормленные погибают. Добор: число выживших + 1. Если никого нет и рука пуста — 6 карт. Пустая колода — последний год.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 flex flex-wrap items-end gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
											src: "/img/species/extinct.jpg",
											label: "вымерло"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
											src: BG.cardBack,
											label: "добор"
										})]
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Очки"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "2 за каждое выжившее животное, 1 за каждое свойство. Дополнительно: хищник и большой +1, паразит +2. Ничья — по картам в сбросе." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex flex-wrap items-end gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
									src: speciesArt({}),
									label: "+2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
									src: speciesArt({ carnivore: true }),
									label: "+2 · хищнику +1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
									src: TRAIT_ART.parasite,
									label: "+1 · паразиту +2"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Свойства базовой игры"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.base })
					]
				}),
				tab === "continents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Дополнение «Континенты» (Правильные игры, 2012): 42 карты новых свойств. Включается в меню перед партией — все правила базовой игры остаются в силе." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerritoryList, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "list-decimal space-y-2 pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Территории."
								}), " Животные живут на Лавразии, в Гондване и в Океане. Выкладывая животное, выбираете континент кликом по нему; в Океан животное попадает только со свойством «Водоплавающее». В океане водность перманентна: её не снять ни неоплазией, ни рекомбинацией, ни параличом — только миграция выводит животное на континент."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Кормовые базы."
								}), " У каждой территории своя база: 2 игрока — 8/7/5, три — 11/10/7, четыре — 14/13/9 (Лавразия/Гондвана/Океан). В свой ход вы привязаны к одной территории: берёте еду её базы и используете свойства животных, стоящих на ней. Хищник ест только в своей территории. «Эдификатор» добавляет 2 фишки в базу своей территории ежегодно."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Парные карты."
								}), " Кладутся между двумя животными одной территории. Разъехалась пара — карта уходит в сброс."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Миграция."
								}), " Объявите миграцию вместо обычного хода: ни еды, ни других свойств. Мигрирующие животные (в любом числе) переезжают: океан ↔ континенты, континент → континент напрямую нельзя. Сухопутное в океан не идёт. С мигрантом едут прилипалы — свои и чужие, даже с континента на континент."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-fg",
										children: "Новые свойства."
									}),
									" Стадность: пока стадных в локации больше, чем хищников, их нельзя есть. Стрекательные клетки: атаковавший хищник теряет все свойства до конца года (потребность 1), в океане ещё и выбрасывается на континент. Регенерация: съеденное хищником животное оставляет свойства — в вымирание владелец кладёт на них карту из руки как новое животное (добора за него нет). Рекомбинация (парная): партнёры обмениваются по одному свойству. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-virus",
										children: "Неоплазия"
									}),
									" — вирус: играется на любое животное, своё или чужое, и каждый год в начале определения кормовой базы поднимается, выключая очередное непарное свойство (выключенное не работает, но очки даёт); когда выключать нечего — животное немедленно погибает. Вирусные свойства (паразит, неоплазия) помечены фиолетовым."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Спасение."
								}), " Игрок без руки и животных берёт 10 карт и две сразу кладёт животными по континенту."] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Свойства дополнения"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.continents })
					]
				}),
				tab === "plants" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Дополнение «Растения» (Правильные игры, 2016): 36 двусторонних карт — свойство растения либо свойство животного. Включается в меню перед партией, совместимо с «Континентами»." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "list-decimal space-y-2 pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Кормовая база без кубика."
								}), " Еда этого года лежит на растениях. В фазу определения базы броска нет: сразу питание. С «Континентами» растения стоят на Лавразии и Гондване, а Океан получает базу по обычным правилам. Растения общие — не принадлежат никому."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Питание."
								}), " Фишка берётся с растения на животное — но только если животное способно им питаться: «Водное» растение кормит лишь водоплавающих, «Корнеплод» — норных, «Дерево» — больших. Хищники едят только с растений со значком плода и с «Питательных». Вместо еды или атаки можно занять убежище растения — жетон защищает от хищников и хищных растений до конца фазы. Пасовать нельзя, пока хоть одно ваше животное способно получить еду или убежище."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Хищное растение."
								}), " Раз за фазу питания: контратакует животное, тянущее с него еду (выживший всё равно получает фишку), либо один из игроков направляет его на любое животное, которое смог бы атаковать хищник без свойств. Съело животное — 2 фишки, получило хвост — 1, съело ядовитое — гибнет в вымирание."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Вымирание."
								}), " Съеденные дочиста растения погибают — кроме однолетника (выживает) и растений-паразитов (гибнут только с хозяином). Связка микориз выживает, если хоть на одном растении осталась еда. Гриб получает фишку за каждое погибшее животное."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Фаза роста."
								}), " Выжившие растения разрастаются по своим схемам (многолетник 1→2, 2→3, 3+→5 и т.д.), лиана получает столько фишек, сколько на столе не-лиан, убежища восстанавливаются, из колоды выходят новые растения. Эдификатор с «Континентами» добавляет по фишке растениям своей локации."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Очки."
								}), " Растения и их свойства при подсчёте не учитываются — очки дают только животные и их свойства."] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Виды растений"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantsList, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Свойства растений"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.plants }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: "Свойства животных на вторых гранях карт «Растений» — из базовой игры, смотрите их во вкладке «Базовая игра»."
						})
					]
				}),
				tab === "fungi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Дополнение «Трава и грибы» (Правильные игры, 2019): 24 длинные карты флоры (6 грибов и 6 трав по 2 копии), 8 меток последствий и 2 новых свойства животных. Кормовая база этого года — все красные фишки на картах флоры; флора — полноправный участник партии и может победить." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "list-decimal space-y-2 pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Стол флоры."
								}), " На старте открыты 2 карты; в фазу кормовой базы из колоды выходят карты по числу игроков (максимум 8 на столе). Гриб входит в игру с 1 красной фишкой, трава — с 3; максимум фишек на карте — 4. С «Континентами» флора живёт на Лавразии и Гондване, Океан кормится по обычным правилам."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Питание."
								}), " Любое животное может брать фишки с любой травы или гриба — при взятии срабатывает способность карты. «Взаимодействие» и «Топотун» работают с картами флоры. Метки последствий: животное получает метку при взятии фишки с «меченой» карты, если не имеет такой же, если метка осталась на столе и если у него нет «Трына». Хищник, съевший добычу, получает все её метки."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Разрастание грибов."
								}), " Каждый раз, когда животное погибает (в питании и в вымирании), на любой гриб кладётся 1 красная фишка."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Вымирание."
								}), " Гибнут ненакормленные, отравлённые и животные с меткой «Яд» без «Антидота». С выживших снимаются все фишки и метки. Карты флоры без фишек уходят в сброс; каждая выжившая трава получает 1 фишку, грибы — только от гибели животных."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Очки."
								}), " «Трава и грибы» играют сами за себя: 2 очка за каждую выжившую карту флоры и 1 за каждую фишку на ней; при равенстве очков преимущество у флоры."] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Карты флоры"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloraList, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Метки последствий"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarksList, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Свойства животных"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.fungi })
					]
				}),
				tab === "mutations" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Дополнение «Случайные мутации» (по одноимённой игре Правильных игр, 2013): рука карт исчезает — у каждого игрока личная слепая колода. В фазу развития вы сначала объявляете, как разыграете верхнюю карту, и только потом её вскрываете. Свойства достаются случайно, в том числе ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "вредные мутации"
							}),
							" (тёмные карты). Совместимо со всеми дополнениями."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "list-decimal space-y-2 pl-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Личная колода."
								}), " 7 карт на старте, просматривать нельзя. В свой ход развития объявите один из способов розыгрыша: (1) новый вид — карта ложится животным; (2) свойство — на свой вид из одного животного; (3) +1 животное к виду. С «Растениями» можно объявить и свойство растения — карта вскроется на выбранном растении."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Судьба свойства."
								}), " Если свойство нельзя сыграть на выбранный вид, оно переезжает на соседний вид справа; если не подходит нигде — само становится новым видом-мутантом. Вредные мутации обязательны: отказаться от них нельзя."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Численность вида."
								}), " Вид может состоять из нескольких животных (отмечается «×N» на карточке). Численность нельзя наращивать выше числа ваших видов — исключение «Почкование». Еда, охота, голод и яд действуют на животных по одному: атака снимает одно животное, а не весь вид."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Добор."
								}), " В конце года: число животных + 2 карты на дно личной колоды. Общий запас кончился — последний год."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-fg",
									children: "Очки."
								}), " 2 за каждое животное (с учётом численности), 1 за свойство и бонусы свойств; метаболический синдром даёт 2 дополнительных очка."] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-fg",
							children: "Свойства дополнения"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.mutations }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: "Прочие свойства в слепой колоде — из базовой игры и включённых дополнений; их правила смотрите в соответствующих вкладках."
						})
					]
				})
			]
		})
	});
}
/** Экран статистики из меню: история партий, график очков и достижения. */
function StatsScreen({ onClose }) {
	const stats = (0, import_react.useMemo)(() => readStats(), []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	const games = stats.games;
	const wins = games.filter((g) => g.won).length;
	const best = games.reduce((m, g) => Math.max(m, g.score), 0);
	const winRate = games.length ? Math.round(wins / games.length * 100) : 0;
	const chart = games.slice(-20).map((g, i) => ({
		i: i + 1,
		score: g.score
	}));
	const topTraits = (0, import_react.useMemo)(() => {
		const totals = /* @__PURE__ */ new Map();
		for (const g of games) for (const [t, n] of Object.entries(g.traits)) totals.set(t, (totals.get(t) ?? 0) + n);
		return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	}, [games]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-3 backdrop-blur-sm sm:p-6",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Статистика"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: onClose,
					children: "Закрыть"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6 overflow-y-auto px-5 py-5",
				children: games.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center text-sm text-muted",
					children: "Партий ещё не было — статистика появится после первой игры."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: [
							["Партий", String(games.length)],
							["Побед", String(wins)],
							["Винрейт", `${winRate}%`],
							["Лучший счёт", String(best)]
						].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-md)] border border-border bg-bg px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl tabular-nums",
								children: value
							})]
						}, label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-medium text-muted",
						children: "Очки последних партий"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-44 rounded-[var(--radius-md)] border border-border bg-bg p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: chart,
								margin: {
									top: 6,
									right: 10,
									bottom: 0,
									left: -18
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "#2a3025",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "i",
										tick: {
											fill: "#9aa08f",
											fontSize: 11
										},
										axisLine: { stroke: "#2a3025" },
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fill: "#9aa08f",
											fontSize: 11
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "#1c2119",
											border: "1px solid #2a3025",
											borderRadius: 8,
											fontSize: 12
										},
										labelFormatter: (i) => `Партия ${i}`,
										formatter: (v) => [`${v} очков`, "Счёт"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "score",
										stroke: "#8b9a74",
										strokeWidth: 2,
										dot: {
											r: 2.5,
											fill: "#8b9a74"
										},
										isAnimationActive: false
									})
								]
							})
						})
					})] }),
					topTraits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-medium text-muted",
						children: "Любимые свойства"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: topTraits.map(([t, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full border border-border bg-bg px-3 py-1 text-xs text-fg",
							children: [
								TRAITS[t].name,
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display tabular-nums",
									children: n
								})
							]
						}, t))
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-2 text-sm font-medium text-muted",
						children: ["История партий ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-subtle",
							children: ["· последние ", Math.min(games.length, 10)]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5",
						children: [...games].reverse().slice(0, 10).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-fg",
										children: [
											g.place,
											"-е место из ",
											g.players
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [
											" · ",
											g.mode === "net" ? "сеть" : "соло",
											" · ",
											formatDate(g.date)
										]
									}),
									g.modules.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-subtle",
										children: [
											" · ",
											g.modules.length,
											" доп."
										]
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm tabular-nums",
									children: g.score
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: g.won ? "text-good" : "text-subtle",
									children: g.won ? "победа" : "—"
								})]
							})]
						}, g.date))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-2 text-sm font-medium text-muted",
						children: ["Достижения ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-subtle",
							children: [
								"· ",
								Object.keys(stats.achievements).length,
								" из ",
								ACHIEVEMENTS.length
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: ACHIEVEMENTS.map((a) => {
							const got = Boolean(stats.achievements[a.id]);
							const Icon = a.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("flex items-start gap-3 rounded-[var(--radius-md)] border px-3 py-2.5", got ? "border-accent/60 bg-accent/10" : "border-border bg-bg opacity-60"),
								children: [got ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 size-5 shrink-0 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mt-0.5 size-5 shrink-0 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium text-fg",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-xs text-muted",
									children: a.desc
								})] })]
							}, a.id);
						})
					})] })
				] })
			})]
		})
	});
}
function formatDate(ms) {
	return new Date(ms).toLocaleDateString("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit"
	});
}
/** «1 очко», «2 очка», «5 очков» — для фразы-объяснения. */
function pluralPoints(n) {
	const a = Math.abs(n) % 100;
	const b = a % 10;
	if (a > 10 && a < 20) return "очков";
	if (b === 1) return "очко";
	if (b >= 2 && b <= 4) return "очка";
	return "очков";
}
/** «2 игрока», «5 игроков» — для фразы о разделённом первом месте. */
function pluralPlayers(n) {
	const a = Math.abs(n) % 100;
	const b = a % 10;
	if (a > 10 && a < 20) return "игроков";
	if (b === 1) return "игрок";
	if (b >= 2 && b <= 4) return "игрока";
	return "игроков";
}
/**
* Подписи слагаемых в компактной формуле счёта. Строчные — так формула
* читается как строка данных: «животные 8 · свойства 3 · бонус 2 · сброс 1».
* У флоры за «животными» стоят карты, за «бонусом» — фишки на картах.
*/
function sourceLabels(row) {
	if (row.playerId === -1) return {
		animals: "карты флоры",
		traits: "свойства флоры",
		extras: "фишки на флоре",
		animalsHint: "2 очка за каждую выжившую карту флоры",
		traitsHint: "Свойства растений очков не дают — по правилам дополнения здесь всегда 0",
		extrasHint: "1 очко за каждую фишку на выжившей карте флоры"
	};
	return {
		animals: "животные",
		traits: "свойства",
		extras: "бонус",
		animalsHint: "2 очка за каждое выжившее животное; с «Мутациями» — за каждого в численности",
		traitsHint: "1 очко за каждое действующее свойство животных (выключенные не считаются)",
		extrasHint: EXTRAS_HINT
	};
}
/**
* Пояснение к «бонусам свойств»: в ScoreBreakdown это одна сумма, но правила
* перечисляют, откуда она берётся. Подсказка — из описаний свойств.
*/
var EXTRAS_HINT = "Надбавки свойств: хищник и большой +1, паразит и метаболический синдром +2";
/** Места с учётом ничьих: равные очки и сброс делят одно место. */
function competitionPlaces(scores) {
	const places = [];
	scores.forEach((s, i) => {
		const prev = scores[i - 1];
		const tied = Boolean(prev) && prev.total === s.total && prev.discard === s.discard;
		places.push(tied ? places[i - 1] : i + 1);
	});
	return places;
}
/**
* «Почему не первое место» — только из чисел ScoreBreakdown, без домыслов.
* Если человек победил или честного объяснения не выводится, возвращает null.
*/
function explainDefeat(scores, winnerIds, humanId) {
	if (winnerIds.includes(humanId)) return null;
	const human = scores.find((s) => s.playerId === humanId);
	const winners = scores.filter((s) => winnerIds.includes(s.playerId) && s.playerId !== humanId);
	if (!human || !winners.length) return null;
	const leader = winners[0];
	const gap = leader.total - human.total;
	const pp = pluralPoints(gap);
	const leadText = winners.length > 1 ? `Первое место разделили ${winners.length} ${pluralPlayers(winners.length)}; ваш разрыв с лидером — ${gap} ${pp}` : `Вас обошли на ${gap} ${pp}`;
	if (gap === 0) return leader.discard > human.discard ? `Очки равны — ${human.total}, но ничью решил сброс: у лидера ${leader.discard} карт против ваших ${human.discard}.` : null;
	if (leader.playerId === -1) return `Флора обошла вас на ${gap} ${pp}: «${leader.name}» — ${leader.total}, у вас ${human.total}.`;
	const diffs = {
		animals: leader.animals - human.animals,
		traits: leader.traits - human.traits,
		extras: leader.extras - human.extras
	};
	const sources = [
		{
			key: "animals",
			on: "на животных",
			due: "животных"
		},
		{
			key: "traits",
			on: "на свойствах",
			due: "свойств"
		},
		{
			key: "extras",
			on: "на бонусах свойств",
			due: "бонусов свойств"
		}
	];
	const best = sources.reduce((m, s) => diffs[s.key] > diffs[m.key] ? s : m, sources[0]);
	if (diffs[best.key] <= 0) return `${leadText}.`;
	if (diffs[best.key] === gap) return `${leadText} — целиком за счёт ${best.due}: ${leader[best.key]} против ваших ${human[best.key]}.`;
	return `${leadText}. Больше всего преимущество ${best.on}: ${leader[best.key]} против ваших ${human[best.key]}.`;
}
/** true, если система просит меньше движения; на сервере — false. */
function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/** Следит за prefers-reduced-motion: при нём финал показывает всё сразу. */
function usePrefersReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(prefersReducedMotion);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onChange = () => setReduced(mq.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}
/**
* Строка игрока в финале: место, сумма и формула счёта по источникам.
* Слагаемые появляются по шагам (animate); при reduced-motion — сразу.
* Сброс стоит в формуле рядом, но помечен как «не в счёте»: он решает ничью.
*/
function ScoreRow({ row, place, winner, animate }) {
	const labels = sourceLabels(row);
	const parts = [
		{
			key: "animals",
			label: labels.animals,
			value: row.animals,
			hint: labels.animalsHint
		},
		{
			key: "traits",
			label: labels.traits,
			value: row.traits,
			hint: labels.traitsHint
		},
		{
			key: "extras",
			label: labels.extras,
			value: row.extras,
			hint: labels.extrasHint
		}
	];
	const tone = {
		animals: "bg-accent",
		traits: "bg-leaf",
		extras: "bg-food-yellow"
	};
	const step = 180;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cn("score-row-in rounded-[var(--radius-md)] border px-3 py-3", winner ? "border-accent bg-accent/10" : "border-border bg-bg"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate font-medium",
						children: [
							place,
							". ",
							row.name
						]
					}), winner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[10px] uppercase tracking-wide text-accent",
						children: "лучший результат"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
					to: row.total,
					delayMs: animate ? 160 : 0
				})]
			}),
			row.total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-ink/20",
				children: parts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: tone[p.key],
					style: { width: `${p.value / row.total * 100}%` }
				}, p.key))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-2.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-baseline gap-x-1.5 gap-y-1",
					children: [
						parts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "text-subtle",
							children: "·"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("inline-flex items-baseline gap-1", animate && "score-row-in"),
							style: animate ? { animationDelay: `${step + i * 90}ms` } : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								title: p.hint,
								children: p.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-display tabular-nums text-fg",
								children: p.value
							})]
						})] }, p.key)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "text-subtle",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("inline-flex items-baseline gap-1", animate && "score-row-in"),
							style: animate ? { animationDelay: `450ms` } : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								title: "Сброшенные карты очков не дают — по ним движок решает ничью при равных очках",
								children: "сброс"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-display tabular-nums text-subtle",
								children: row.discard
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("mt-2 flex items-center justify-between gap-2 border-t border-border pt-1.5", animate && "score-row-in"),
					style: animate ? { animationDelay: `540ms` } : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Итого"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-display text-sm tabular-nums text-fg",
						children: row.total
					})]
				})]
			})
		]
	});
}
/**
* Финал партии. Объясняет счёт, а не только показывает места: у каждого игрока
* видно, из чего сложился итог (животные, свойства, бонусы свойств, сброс),
* слагаемые раскрываются по шагам, а проигравшему человеку экран честно
* говорит, на чём именно его обошли. Экран можно свернуть, чтобы посмотреть
* стол, и вернуть кнопкой «Итоги».
*/
function GameOverScreen({ scores, winnerIds, humanId, onAgain, onMenu }) {
	const won = winnerIds.includes(humanId);
	const soundedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (soundedRef.current) return;
		soundedRef.current = true;
		sfx.play(won ? "win" : "lose");
	}, [won]);
	const leaves = (0, import_react.useMemo)(() => Array.from({ length: 14 }, (_, i) => ({
		id: i,
		left: Math.round(Math.random() * 96),
		size: 9 + Math.round(Math.random() * 9),
		dur: 5 + Math.random() * 5,
		delay: Math.random() * 5,
		color: [
			"var(--color-leaf)",
			"var(--color-parchment)",
			"var(--color-clay)",
			"var(--color-food-yellow)"
		][i % 4]
	})), []);
	const reduced = usePrefersReducedMotion();
	const rows = (0, import_react.useMemo)(() => [...scores].sort((a, b) => b.total - a.total || b.discard - a.discard), [scores]);
	const places = (0, import_react.useMemo)(() => competitionPlaces(rows), [rows]);
	const explanation = (0, import_react.useMemo)(() => explainDefeat(rows, winnerIds, humanId), [
		rows,
		winnerIds,
		humanId
	]);
	const humanIndex = rows.findIndex((r) => r.playerId === humanId);
	const [reveal, setReveal] = (0, import_react.useState)(() => {
		const r = prefersReducedMotion();
		return {
			shown: r ? scores.length : 0,
			all: r
		};
	});
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (reveal.all || reveal.shown >= rows.length) return;
		const delay = reveal.shown === 0 ? 420 : 860;
		const t = window.setTimeout(() => {
			setReveal((r) => r.shown >= rows.length ? r : {
				...r,
				shown: r.shown + 1
			});
		}, delay);
		return () => window.clearTimeout(t);
	}, [reveal, rows.length]);
	(0, import_react.useEffect)(() => {
		if (reduced) setReveal({
			shown: rows.length,
			all: true
		});
	}, [reduced, rows.length]);
	const allShown = reveal.all || reveal.shown >= rows.length;
	const humanPlace = humanIndex >= 0 ? places[humanIndex] : null;
	if (collapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-4 right-4 z-40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			size: "md",
			className: "shadow-[var(--shadow-card)]",
			"aria-label": "Показать итоги партии",
			onClick: () => setCollapsed(false),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }),
				"Итоги",
				won ? " · победа" : humanPlace ? ` · ${humanPlace}-е место` : ""
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-3 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: won ? BG.victory : BG.extinction,
				alt: "",
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
			}),
			won ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 overflow-hidden",
				children: leaves.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "leaf-fall",
					style: {
						left: `${l.left}%`,
						width: l.size,
						height: l.size,
						background: l.color,
						animationDuration: `${l.dur}s`,
						animationDelay: `${l.delay}s`
					}
				}, l.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-[0.24em] text-muted",
								children: "Конец эволюции"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-3xl",
								children: won ? "Ваша популяция доминирует" : "Вас вытеснили"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "iconSm",
								className: "shrink-0",
								"aria-label": "Свернуть итоги и посмотреть стол",
								title: "Свернуть и посмотреть стол",
								onClick: () => setCollapsed(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs leading-snug text-subtle",
							children: "Очки: 2 за каждое выжившее животное, 1 за каждое свойство и надбавки свойств («бонус»). Сброс очков не даёт — по нему решается ничья при равенстве."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							"aria-label": "Итоговый счёт",
							className: "mt-4 space-y-2.5",
							children: rows.map((s, i) => i < reveal.shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
								row: s,
								place: places[i],
								winner: winnerIds.includes(s.playerId),
								animate: !reduced
							}, s.playerId) : null)
						}),
						!allShown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								size: "md",
								onClick: () => setReveal({
									shown: rows.length,
									all: true
								}),
								children: "Показать всё"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: "Счёт раскрывается по шагам"
							})]
						}) : null,
						allShown && explanation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "score-row-in mt-4 flex items-start gap-2 rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 px-3 py-3 text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
								"aria-hidden": true,
								className: "mt-0.5 size-4 shrink-0 text-accent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: explanation })]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 border-t border-border bg-surface p-4 sm:flex-row sm:px-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "flex-1",
						size: "md",
						onClick: onAgain,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Ещё партия"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "flex-1",
						size: "md",
						onClick: onMenu,
						children: "В меню"
					})]
				})]
			})
		]
	});
}
/**
* Очки места «докручиваются» от нуля на глазах: легче прочувствовать разрыв
* с соперниками, чем увидеть готовые числа. При reduced-motion — сразу итог.
* Число декоративно (скринридеру его читает строка «Итого» в разбивке).
*/
function CountUp({ to, delayMs = 0, durMs = 700 }) {
	const [v, setV] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setV(to);
			return;
		}
		const t0 = performance.now() + delayMs;
		let raf = 0;
		const tick = (t) => {
			const p = Math.min(1, Math.max(0, (t - t0) / durMs));
			const eased = 1 - Math.pow(1 - p, 3);
			setV(Math.round(eased * to));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		to,
		delayMs,
		durMs
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		className: "font-display text-2xl tabular-nums",
		children: v
	});
}
var DIFFS = [
	["easy", "Проще"],
	["normal", "Обычная"],
	["hard", "Жёстче"]
];
/**
* Базовые классы кастомных кнопок-переключателей (вне Button из UI-кита):
* видимый фокус с клавиатуры и одинаковое поведение в отключённом виде.
*/
var TOGGLE_BASE = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50";
/**
* Секция «Игра по сети» в главном меню: создать стол / войти по коду.
* Ссылка вида ?room=КОД предзаполняет вход, а при сохранённом месте
* сразу возвращает за стол.
*/
function NetMenuPanel() {
	const startNetCreate = useGameStore((s) => s.startNetCreate);
	const startNetJoin = useGameStore((s) => s.startNetJoin);
	const startWatch = useGameStore((s) => s.startNetWatch);
	const resumeNetFromUrl = useGameStore((s) => s.resumeNetFromUrl);
	const [tab, setTab] = (0, import_react.useState)("none");
	const [name, setName] = (0, import_react.useState)(loadName());
	const [code, setCode] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const room = new URLSearchParams(window.location.search).get("room");
		if (!room) return;
		setCode(room.toUpperCase());
		setTab("join");
		resumeNetFromUrl(room);
	}, []);
	async function run(fn) {
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
	if (tab === "none") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
		className: "mb-3 text-sm font-medium text-muted",
		children: "Сетевая игра"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "secondary",
		size: "lg",
		className: "w-full",
		onClick: () => setTab("create"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Игра по сети"]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
			className: "mb-3 flex items-center gap-2 text-sm font-medium text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Игра по сети"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("create"),
				className: cn(TOGGLE_BASE, "h-11 rounded-[var(--radius-md)] border text-sm font-medium", tab === "create" ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
				children: "Создать стол"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("join"),
				className: cn(TOGGLE_BASE, "h-11 rounded-[var(--radius-md)] border text-sm font-medium", tab === "join" ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
				children: "Войти по коду"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mb-3 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-xs text-muted",
				children: "Ваше имя"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: name,
				onChange: (e) => setName(e.target.value),
				maxLength: 16,
				placeholder: "Как вас видят соперники",
				"aria-label": "Ваше имя",
				className: "h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
			})]
		}),
		tab === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintNote, {
			className: "mb-3",
			children: "Стол откроется с настройками прошлой партии. Вместимость, дополнения, сложность и размер колоды меняются в лобби — до старта и без спешки."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "w-full",
			size: "lg",
			disabled: busy || !name.trim(),
			onClick: () => {
				const last = loadLastNetConfig();
				run(() => startNetCreate({
					name: name.trim(),
					capacity: last.capacity ?? 2,
					botSeats: 0,
					difficulty: last.difficulty ?? "normal",
					modules: last.modules,
					deckSize: last.deckSize
				}));
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Создать стол"]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mb-3 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-xs text-muted",
				children: "Код стола"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: code,
				onChange: (e) => setCode(e.target.value.toUpperCase().slice(0, 4)),
				maxLength: 4,
				placeholder: "Например, KQXT",
				"aria-label": "Код стола",
				className: "h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 font-display text-lg tracking-[0.3em] uppercase text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2 sm:grid-cols-[1fr_auto]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "lg",
				disabled: busy || !name.trim() || code.length !== 4,
				onClick: () => run(() => startNetJoin(code, name.trim())),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Войти"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				size: "lg",
				disabled: busy || !name.trim() || code.length !== 4,
				title: "Место не займёте: увидите стол, чат и сможете поощрять игроков",
				onClick: () => run(async () => {
					await startWatch(code, name.trim());
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), "Смотреть"]
			})]
		})] }),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-clay",
			children: error
		}) : null
	] });
}
var MODULE_OPTIONS = [
	[
		"continents",
		"Континенты",
		"Лавразия, Гондвана и Океан"
	],
	[
		"plants",
		"Растения",
		"еда на общих растениях, убежища"
	],
	[
		"fungi",
		"Трава и грибы",
		"флора и метки последствий"
	],
	[
		"randomMutations",
		"Случайные мутации",
		"личная слепая колода"
	]
];
var CAPACITIES = [
	2,
	3,
	4,
	5,
	6,
	7,
	8
];
/**
* Грубая оценка длины партии по размеру колоды: за год колода уходит примерно
* на 3,2 карты на игрока (добор «выжившие + 1»). Эмпирика прогонов движка:
* полная база (84) при двух игроках — около 14 лет, при четырёх — около 7.
*/
function estimateYears(deckSize, players) {
	return Math.max(2, Math.round(deckSize / (3.2 * Math.max(1, players))));
}
/** «1 мин», «только что» — время ожидания в очереди. */
function formatWait(ms) {
	const s = Math.max(0, Math.floor(ms / 1e3));
	if (s < 20) return "только что";
	if (s < 60) return `${s} с`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m} мин`;
	return `${Math.floor(m / 60)} ч ${m % 60} мин`;
}
/** «1 место», «2 места», «5 мест» — для подсказки о свободных местах. */
function pluralSeats(n) {
	const a = Math.abs(n) % 100;
	const b = a % 10;
	if (a > 10 && a < 20) return "мест";
	if (b === 1) return "место";
	if (b >= 2 && b <= 4) return "места";
	return "мест";
}
/** Время ожидания, обновляется раз в 15 с — очередь не «замирает». */
function WaitingTime({ at }) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 15e3);
		return () => window.clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "tabular-nums",
		children: formatWait(now - at)
	});
}
/**
* Список мест стола: занятые игроки, боты и свободные места. Хост может
* убрать человека, передать ему хост или увидеть, что место пока пусто.
*/
function SeatList({ seats, capacity, mySeat, hostSeat, canManage, onKick, onTransfer }) {
	const rows = Math.max(capacity, ...seats.map((s) => s.seat + 1), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: Array.from({ length: rows }).map((_, seatNo) => {
			const seat = seats.find((x) => x.seat === seatNo);
			const isMe = seat?.seat === mySeat;
			const isHostSeat = seat?.seat === hostSeat;
			const canKick = canManage && seat && !seat.isAI && !isMe;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("flex items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2.5", seat ? "border-border bg-bg" : "border-dashed border-border bg-bg/40", isMe && "ring-1 ring-accent/50"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex min-w-0 items-center gap-2 text-sm font-medium text-fg",
					children: [
						seat ? seat.isAI ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4 shrink-0 text-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("size-2 shrink-0 rounded-full", seat.online ? "bg-good" : "bg-ink/25"),
							title: seat.online ? "в сети" : "не в сети"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 shrink-0 rounded-full bg-ink/15" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate",
							children: seat ? seat.name : "Свободное место"
						}),
						seat && !seat.isAI && !seat.online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-full bg-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted",
							children: "не в сети"
						}) : null,
						isHostSeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent",
							children: "хост"
						}) : null,
						isMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[10px] uppercase tracking-wide text-muted",
							children: "это вы"
						}) : null
					]
				}), canKick && seat ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 items-center gap-0.5",
					children: [onTransfer && !isHostSeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "iconSm",
						"aria-label": `Передать хост игроку ${seat.name}`,
						title: "Передать хост",
						onClick: () => onTransfer(seat),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4" })
					}) : null, onKick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "iconSm",
						"aria-label": `Убрать игрока ${seat.name}`,
						title: "Убрать игрока",
						className: "text-clay hover:text-danger",
						onClick: () => onKick(seat),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "size-4" })
					}) : null]
				}) : !seat && canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-[10px] uppercase tracking-wide text-subtle",
					children: "ждём"
				}) : null]
			}, seatNo);
		})
	});
}
/**
* Лобби сетевого стола: состав, настройки до старта, очередь ожидающих,
* ссылка-приглашение, боты и старт от хоста. Ожидающий видит свой экран.
*/
/** Шапка сетевых экранов — та же навигация, что в главном меню. */
function NetTopBar({ subtitle }) {
	const [rulesOpen, setRulesOpen] = (0, import_react.useState)(false);
	const [statsOpen, setStatsOpen] = (0, import_react.useState)(false);
	const [tutorialOpen, setTutorialOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TopBar, {
			subtitle,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					"aria-label": "Обучение",
					title: "Обучение",
					onClick: () => setTutorialOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Обучение"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					"aria-label": "Правила",
					title: "Правила",
					onClick: () => setRulesOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Правила"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					"aria-label": "Статистика",
					title: "Статистика",
					onClick: () => setStatsOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Статистика"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundToggle, {})
			]
		}),
		rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: () => setRulesOpen(false) }) : null,
		statsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsScreen, { onClose: () => setStatsOpen(false) }) : null,
		tutorialOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialScreen, {
			onClose: () => setTutorialOpen(false),
			onStart: () => setTutorialOpen(false)
		}) : null
	] });
}
var CHAT_PHRASES = [
	"Привет!",
	"Хороший стол!",
	"Погнали"
];
/**
* Чат стола: тот же буфер, что и в партии. В лобби живёт колонкой справа
* (десктоп); на телефоне его место будет в навигации — волна журнала.
*/
function LobbyChat({ className }) {
	const net = useGameStore((s) => s.net);
	const sendChat = useGameStore((s) => s.sendChat);
	const listRef = (0, import_react.useRef)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const el = listRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [net.chat.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Чат стола",
		className: cn("flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-card)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border px-4 py-2.5 text-sm font-medium text-muted",
				children: "Чат стола"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: listRef,
				role: "log",
				"aria-live": "polite",
				"aria-relevant": "additions",
				className: "min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 py-2.5 text-sm",
				children: net.chat.length ? net.chat.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-[var(--radius-sm)] bg-bg/60 px-2 py-1 leading-snug",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-fg",
							children: m.name
						}),
						m.seat === -1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 text-[10px] uppercase tracking-wide text-subtle",
							children: "ожидает"
						}) : null,
						": ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: m.text
						})
					]
				}, m.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 py-6 text-center text-xs text-subtle",
					children: "Пока тихо — скажите привет."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1.5 flex flex-wrap gap-1",
					role: "group",
					"aria-label": "Быстрые фразы",
					children: CHAT_PHRASES.map((phrase) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void sendChat(phrase),
						className: "min-h-9 rounded-full border border-border bg-bg px-3 py-1 text-[10px] text-muted hover:bg-surface-2 hover:text-fg sm:min-h-7 sm:px-2 sm:py-0.5",
						children: phrase
					}, phrase))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex items-end gap-1.5",
					onSubmit: (event) => {
						event.preventDefault();
						const text = draft.trim();
						if (!text) return;
						sendChat(text);
						setDraft("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						onChange: (event) => setDraft(event.target.value),
						maxLength: 400,
						placeholder: "Сообщение…",
						"aria-label": "Сообщение в чат",
						className: "h-9 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-bg/60 px-2.5 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "secondary",
						size: "iconSm",
						"aria-label": "Отправить сообщение",
						disabled: !draft.trim(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})]
				})]
			})
		]
	});
}
function LobbyScreen() {
	const net = useGameStore((s) => s.net);
	const netAddBots = useGameStore((s) => s.netAddBots);
	const netStart = useGameStore((s) => s.netStart);
	const leaveNet = useGameStore((s) => s.leaveNet);
	const netKick = useGameStore((s) => s.netKick);
	const netSetCapacity = useGameStore((s) => s.netSetCapacity);
	const netSetSettings = useGameStore((s) => s.netSetSettings);
	const netTransferHost = useGameStore((s) => s.netTransferHost);
	const netKickWaiter = useGameStore((s) => s.netKickWaiter);
	const clearNetError = useGameStore((s) => s.clearNetError);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [kick, setKick] = (0, import_react.useState)(null);
	const [transfer, setTransfer] = (0, import_react.useState)(null);
	if (net.waiting) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitingRoom, {});
	const isHost = net.hostSeat === net.seat;
	const humans = net.seats.filter((s) => !s.isAI);
	const bots = net.seats.length - humans.length;
	const full = net.seats.length >= net.capacity;
	const shareUrl = `${window.location.origin}/?room=${net.code}`;
	const modules = net.settings.modules ?? {};
	const difficulty = net.settings.difficulty ?? "normal";
	const deckFull = Math.max(deckSizeFor(1, modules), 20);
	const deckNow = Math.min(net.settings.deckSize ?? deckFull, deckFull);
	const freeSeats = Math.max(0, net.capacity - net.seats.length);
	const startHint = !isHost ? "Начинает хост: кнопка станет доступна, когда он соберёт стол." : freeSeats > 0 ? `Свободно ${freeSeats} ${pluralSeats(freeSeats)} из ${net.capacity} — позовите игроков по ссылке или добавьте ботов.` : null;
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		} catch {
			window.prompt("Скопируйте ссылку вручную:", shareUrl);
		}
	}
	function toggleModule(key) {
		if (!isHost) return;
		netSetSettings({ modules: {
			...modules,
			[key]: !modules[key]
		} });
	}
	function pickDifficulty(id) {
		if (isHost) netSetSettings({ difficulty: id });
	}
	function pickDeck(size) {
		if (isHost) netSetSettings({ deckSize: size });
	}
	const deckPresets = [
		[Math.max(20, Math.round(deckFull * .36)), "Короткая"],
		[Math.max(24, Math.round(deckFull * .5)), "Обычная"],
		[deckFull, "Полная"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetTopBar, { subtitle: "Стол · ждём игроков" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-6xl flex-1 items-start justify-center gap-6 px-5 py-10 lg:grid-cols-[minmax(0,600px)_minmax(280px,340px)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-xl flex-col justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted",
							children: "Стол · ждём игроков"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-center font-display text-4xl tracking-[0.18em]",
							"data-room-code": net.code,
							children: net.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-5 flex flex-col gap-2 sm:flex-row",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "secondary",
										size: "md",
										className: "flex-1",
										onClick: copyLink,
										children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Скопировано" : "Скопировать ссылку"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatList, {
									seats: net.seats,
									capacity: net.capacity,
									mySeat: net.seat,
									hostSeat: net.hostSeat,
									canManage: isHost,
									onKick: (seat) => setKick({
										kind: "seat",
										seat: seat.seat,
										name: seat.name
									}),
									onTransfer: (seat) => setTransfer(seat)
								}),
								net.waiters.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-[var(--radius-md)] border border-border bg-bg/50 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
											"Ожидают места · ",
											net.waiters.length
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1.5",
										children: net.waiters.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex min-w-0 items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-5 shrink-0 text-center font-display text-xs tabular-nums text-muted",
													children: i + 1
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "min-w-0 truncate text-fg",
													children: w.name
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex shrink-0 items-center gap-2 text-xs text-muted",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitingTime, { at: w.at }), isHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "iconSm",
													"aria-label": `Убрать из очереди ${w.name}`,
													title: "Убрать из очереди",
													className: "text-clay hover:text-danger",
													onClick: () => setKick({
														kind: "waiter",
														index: i,
														name: w.name
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
												}) : null]
											})]
										}, `${w.name}-${w.at}-${i}`))
									})]
								}) : null,
								net.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 flex items-center justify-between gap-2 text-sm text-clay",
									role: "status",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: net.error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: clearNetError,
										children: "Понятно"
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 border-t border-border pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), "Настройки партии"]
										}),
										!isHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-3 rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2 text-xs text-muted",
											children: "Управляет хост — пока настройки у него, они заблокированы. Вы можете смотреть состав, ссылку и ждать старта."
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-1.5 text-xs text-muted",
												children: "Дополнения"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid grid-cols-2 gap-2",
												children: MODULE_OPTIONS.map(([key, label, hint]) => {
													const on = Boolean(modules[key]);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														disabled: !isHost,
														"aria-pressed": on,
														title: isHost ? hint : "Менять настройки может только хост",
														onClick: () => toggleModule(key),
														className: cn("flex items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-left text-xs leading-tight disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:text-sm", on ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "min-w-0",
															children: label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", on ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
															children: on ? "вкл" : "выкл"
														})]
													}, key);
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-1.5 text-xs text-muted",
												children: "Сложность ботов"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid grid-cols-3 gap-2",
												children: DIFFS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: !isHost,
													title: isHost ? void 0 : "Менять настройки может только хост",
													onClick: () => pickDifficulty(id),
													className: cn("h-11 rounded-[var(--radius-md)] border text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", difficulty === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
													children: label
												}, id))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-1.5 text-xs text-muted",
												children: "Размер колоды свойств"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mb-2 grid grid-cols-3 gap-2",
												children: deckPresets.map(([n, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: !isHost,
													title: isHost ? void 0 : "Менять настройки может только хост",
													onClick: () => pickDeck(n),
													className: cn("h-10 rounded-[var(--radius-md)] border text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", deckNow === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
													children: [
														label,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "tabular-nums opacity-70",
															children: n
														})
													]
												}, label))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 20,
												max: deckFull,
												step: 1,
												value: deckNow,
												disabled: !isHost,
												onChange: (e) => pickDeck(Number(e.target.value)),
												"aria-label": "Размер колоды свойств",
												className: "range-evo w-full disabled:cursor-not-allowed disabled:opacity-50"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1.5 text-xs text-subtle",
												children: [
													"Колода ",
													deckNow,
													" карт · ≈",
													estimateYears(deckNow, Math.max(net.capacity, 2)),
													" лет партии"
												]
											})
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 border-t border-border pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mb-1.5 text-xs text-muted",
											children: ["Мест за столом", !isHost ? " · задаёт хост" : ""]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-4 gap-2 sm:grid-cols-7",
											children: CAPACITIES.map((n) => {
												const blocked = n < humans.length;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: !isHost || blocked,
													title: blocked ? `За столом ${humans.length} игроков — сначала уберите лишних` : isHost ? void 0 : "Менять число мест может только хост",
													onClick: () => void netSetCapacity(n),
													className: cn("h-10 rounded-[var(--radius-md)] border text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", net.capacity === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
													children: n
												}, n);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1.5 text-xs text-subtle",
											children: [
												"Ниже числа людей (",
												humans.length,
												") опустить нельзя — сначала уберите игрока."
											]
										}),
										isHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted",
													children: "Боты"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "secondary",
													size: "icon",
													"aria-label": "Убрать бота",
													disabled: bots === 0,
													onClick: () => void netAddBots(-1),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "min-w-6 text-center font-display text-lg tabular-nums",
													children: bots
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "secondary",
													size: "icon",
													"aria-label": "Добавить бота",
													disabled: net.seats.length >= net.capacity,
													onClick: () => void netAddBots(1),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-subtle",
													children: "заполнят свободные места перед стартом"
												})
											]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-col gap-2 sm:flex-row-reverse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "flex-1",
										size: "md",
										disabled: !isHost || !full || humans.length < 1,
										title: !isHost ? "Начинает хост" : !full ? "Заполните все места — людьми или ботами" : void 0,
										onClick: () => void netStart(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Начать год"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "md",
										onClick: leaveNet,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Покинуть стол"]
									})]
								}),
								startHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-center text-xs text-subtle",
									role: "status",
									children: startHint
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-center text-xs text-subtle",
							children: "Отправьте ссылку друзьям — они войдут по ней одним касанием."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LobbyChat, { className: "sticky top-20 hidden h-[calc(100dvh-6rem)] lg:flex" })]
			}),
			kick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: kick.kind === "seat" ? "Убрать игрока?" : "Убрать из очереди?",
				body: kick.kind === "seat" ? `${kick.name} потеряет место за столом и вернётся в меню. Место освободится для другого гостя или бота.` : `${kick.name} потеряет место в очереди и вернётся в меню.`,
				confirmLabel: "Убрать",
				tone: "danger",
				onConfirm: () => {
					if (kick.kind === "seat") netKick(kick.seat);
					else netKickWaiter(kick.index);
					setKick(null);
				},
				onClose: () => setKick(null)
			}) : null,
			transfer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: "Передать хост?",
				body: `Управление столом перейдёт игроку ${transfer.name}: настройки, места и старт партии. Вы останетесь за столом.`,
				confirmLabel: "Передать",
				onConfirm: () => {
					netTransferHost(transfer.seat);
					setTransfer(null);
				},
				onClose: () => setTransfer(null)
			}) : null
		]
	});
}
/**
* Экран ожидающего: места заняты, но очередь видна и автоматически рассосётся.
* Кнопка «Занять место» — страховка на случай, если авто-занятие не сработало.
*/
function WaitingRoom() {
	const net = useGameStore((s) => s.net);
	const netLeaveQueue = useGameStore((s) => s.netLeaveQueue);
	const netClaimSeat = useGameStore((s) => s.netClaimSeat);
	const clearNetError = useGameStore((s) => s.clearNetError);
	const occupied = new Set(net.seats.map((s) => s.seat));
	let freeSeat = null;
	for (let i = 0; i < net.capacity; i++) if (!occupied.has(i)) {
		freeSeat = i;
		break;
	}
	const position = net.waiterPosition;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetTopBar, { subtitle: "Стол · мест нет" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5 px-5 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted",
					children: "Стол · мест нет"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-center font-display text-4xl tracking-[0.18em]",
					"data-room-code": net.code,
					children: net.code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-[var(--radius-md)] border border-border bg-bg px-3 py-3 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: position ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Вы ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-fg",
										children: position
									}),
									"-й в очереди. Как только место освободится, вас посадят автоматически."
								] }) : "Вы в очереди на место за столом."
							})
						}),
						net.waiters.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
									"Очередь · ",
									net.waiters.length
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: net.waiters.map((w, i) => {
									const isMe = position === i + 1;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: cn("flex items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm", isMe ? "border-accent bg-accent/10" : "border-border bg-bg"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex min-w-0 items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-5 shrink-0 text-center font-display text-xs tabular-nums text-muted",
												children: i + 1
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 truncate text-fg",
												children: [w.name, isMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-1 text-[10px] uppercase tracking-wide text-muted",
													children: "это вы"
												}) : null]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaitingTime, { at: w.at })]
									}, `${w.name}-${w.at}-${i}`);
								})
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "За столом"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatList, {
								seats: net.seats,
								capacity: net.capacity,
								mySeat: net.seat,
								hostSeat: net.hostSeat,
								canManage: false
							})]
						}),
						net.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-center justify-between gap-2 text-sm text-clay",
							role: "status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: net.error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: clearNetError,
								children: "Понятно"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-2 sm:flex-row-reverse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "flex-1",
								size: "md",
								disabled: freeSeat === null,
								title: freeSeat === null ? "Свободных мест пока нет" : "Занять освободившееся место",
								onClick: () => void netClaimSeat(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Занять место"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "md",
								onClick: () => void netLeaveQueue(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Выйти из очереди"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-center text-xs text-subtle",
							children: "Место займётся автоматически, как только кто-то выйдет. Кнопка — на случай задержки."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LobbyChat, { className: "h-80" })
			]
		})]
	});
}
var TONE_BORDER = {
	kill: "border-danger/70",
	escape: "border-good/60",
	death: "border-danger/60",
	info: "border-border-strong",
	plant: "border-leaf/60"
};
function animalInfo(state, id) {
	const a = findAnimal(state, id);
	if (!a) return null;
	const owner = state.players.find((p) => p.id === a.ownerId);
	const no = (owner?.animals.findIndex((x) => x.id === id) ?? -1) + 1;
	return {
		owner: owner?.name ?? "—",
		no: no || 1,
		art: speciesArt({
			swimming: hasTrait(a, "swimming"),
			carnivore: hasTrait(a, "carnivore"),
			bulky: hasTrait(a, "highBodyWeight")
		})
	};
}
function labelOf(info) {
	return info ? `${info.owner}: №${info.no}` : "животное";
}
/** Превращает события одного шага в очередь крупных показов. */
function buildItems(state, events, registry, nextId) {
	const items = [];
	const remembered = (id) => animalInfo(state, id) ?? registry.get(id) ?? null;
	for (const e of events) switch (e.kind) {
		case "diceRoll":
			items.push({
				id: nextId(),
				tone: "info",
				title: "Кормовая база",
				dice: e.dice,
				note: `Еды на этот год: ${e.total}`,
				ms: 2900
			});
			break;
		case "preyKilled": {
			const carn = remembered(e.carnivoreId);
			const prey = remembered(e.preyId);
			items.push({
				id: nextId(),
				tone: "kill",
				title: "Добыча убита",
				note: `${labelOf(carn)} съедает ${labelOf(prey)}`,
				cubes: [{
					tone: "blue",
					n: 2
				}],
				versus: {
					left: carn?.art,
					right: prey?.art,
					strike: true
				},
				ms: 3e3
			});
			break;
		}
		case "defenseUsed": {
			const prey = remembered(e.preyId);
			if (e.defense === "running") {
				const good = (e.roll ?? 0) >= 4;
				items.push({
					id: nextId(),
					tone: good ? "escape" : "kill",
					title: "Быстрое — бросок кубика",
					note: `${labelOf(prey)} пытается убежать`,
					dice: [e.roll ?? 1],
					verdict: {
						good,
						text: good ? "Спаслось!" : "Хищник догнал!"
					},
					versus: {
						left: TRAIT_ART.running,
						right: prey?.art
					},
					ms: 3400
				});
			} else if (e.defense === "tailLoss") items.push({
				id: nextId(),
				tone: "escape",
				title: "Отбросить хвост",
				note: `${labelOf(prey)} выживает`,
				cubes: [{
					tone: "blue",
					n: 1
				}],
				versus: {
					left: TRAIT_ART.tailLoss,
					right: prey?.art
				},
				ms: 2800
			});
			else if (e.defense === "mimicry") items.push({
				id: nextId(),
				tone: "info",
				title: "Мимикрия",
				note: "Атака перенаправлена на другое животное",
				versus: {
					left: TRAIT_ART.mimicry,
					right: prey?.art
				},
				ms: 2400
			});
			break;
		}
		case "plantAttack": {
			const prey = remembered(e.preyId);
			const plant = (state.plants ?? []).find((p) => p.id === e.plantId);
			items.push({
				id: nextId(),
				tone: "plant",
				title: e.counter ? "Контратака растения" : "Хищное растение",
				note: `${e.counter ? "Растение бьёт по нападавшему" : `Растение ловит ${labelOf(prey).toLowerCase()}`}`,
				versus: {
					left: plant ? PLANT_ART[plant.kind] : PLANT_ART.carnivorous,
					right: prey?.art,
					strike: true
				},
				ms: 2500
			});
			break;
		}
		case "paralyzed": {
			const carn = remembered(e.carnivoreId);
			items.push({
				id: nextId(),
				tone: "info",
				title: "Паралич",
				note: `${labelOf(carn)} не может атаковать в этом году`,
				versus: {
					left: TRAIT_ART.nematocysts,
					right: carn?.art
				},
				ms: 2300
			});
			break;
		}
	}
	const deaths = events.filter((e) => e.kind === "animalDied");
	if (deaths.length) {
		const starved = deaths.filter((e) => e.kind === "animalDied" && e.cause === "starved").length;
		items.push({
			id: nextId(),
			tone: "death",
			title: "Вымирание",
			note: deaths.length === 1 ? `Погибло животное${starved === 0 ? " — не от голода" : " от голода"}` : `Погибло животных: ${deaths.length}${starved ? ` (от голода — ${starved})` : ""}`,
			versus: { left: SPECIES_EXTINCT },
			ms: 2700
		});
	}
	return items;
}
function EventSpotlight({ replayEvents, humanTurn } = {}) {
	const state = useGameStore((s) => s.state);
	const speed = useGameStore((s) => s.speed);
	const mult = speed === "slow" ? 1.5 : speed === "fast" ? .6 : 1;
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [closing, setClosing] = (0, import_react.useState)(false);
	const seqRef = (0, import_react.useRef)(-1);
	const replayRef = (0, import_react.useRef)(null);
	const idRef = (0, import_react.useRef)(0);
	const registryRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const nextId = (0, import_react.useCallback)(() => {
		idRef.current += 1;
		return idRef.current;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!state) return;
		for (const p of state.players) p.animals.forEach((a, i) => {
			registryRef.current.set(a.id, {
				owner: p.name,
				no: i + 1,
				art: speciesArt({
					swimming: hasTrait(a, "swimming"),
					carnivore: hasTrait(a, "carnivore"),
					bulky: hasTrait(a, "highBodyWeight")
				})
			});
		});
	}, [state]);
	(0, import_react.useEffect)(() => {
		if (!state || state.eventSeq === seqRef.current) return;
		seqRef.current = state.eventSeq;
		const items = buildItems(state, state.lastEvents, registryRef.current, nextId);
		if (items.length) setQueue((q) => [...q, ...items].slice(-4));
	}, [state, nextId]);
	(0, import_react.useEffect)(() => {
		if (!state || !replayEvents?.length || replayEvents === replayRef.current) return;
		replayRef.current = replayEvents;
		const items = buildItems(state, replayEvents, registryRef.current, nextId);
		if (items.length) setQueue((q) => [...q, ...items].slice(-4));
	}, [
		state,
		replayEvents,
		nextId
	]);
	(0, import_react.useEffect)(() => {
		if (!humanTurn) return;
		setQueue([]);
		if (!current) return;
		setClosing(true);
		const t = setTimeout(() => {
			setCurrent(null);
			setClosing(false);
		}, 300);
		return () => clearTimeout(t);
	}, [humanTurn]);
	(0, import_react.useEffect)(() => {
		if (current || queue.length === 0) return;
		setCurrent(queue[0]);
		setQueue((q) => q.slice(1));
	}, [current, queue]);
	(0, import_react.useEffect)(() => {
		if (!current) return;
		const total = Math.max(1500, current.ms * mult);
		const tOut = setTimeout(() => setClosing(true), Math.max(0, total - 280));
		const tDone = setTimeout(() => {
			setCurrent(null);
			setClosing(false);
		}, total);
		return () => {
			clearTimeout(tOut);
			clearTimeout(tDone);
		};
	}, [current, mult]);
	const skip = (0, import_react.useCallback)(() => {
		setCurrent(null);
		setClosing(false);
	}, []);
	if (!current) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		"aria-live": "polite",
		className: "spotlight-passthrough fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6",
		onClick: skip,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "spotlight-backdrop pointer-events-none absolute inset-0",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
			item: current,
			closing,
			onSkip: skip
		}, current.id)]
	});
}
function SpotlightCard({ item, closing, onSkip }) {
	const [phase, setPhase] = (0, import_react.useState)(item.dice ? "roll" : "result");
	(0, import_react.useEffect)(() => {
		if (!item.dice) return;
		const t = setTimeout(() => setPhase("result"), 1150);
		return () => clearTimeout(t);
	}, [item]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("spotlight-card grain relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden border bg-surface px-6 py-10 text-center shadow-[var(--shadow-card)] sm:h-auto sm:max-w-md sm:rounded-[var(--radius-xl)] sm:px-8 sm:py-9", TONE_BORDER[item.tone], closing && "spotlight-out"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl leading-tight sm:text-[1.7rem]",
				children: item.title
			}),
			item.versus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [
					item.versus.left ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.versus.left,
						alt: "",
						className: "size-20 rounded-full border border-border object-cover object-top shadow-[var(--shadow-card)] sm:size-24"
					}) : null,
					item.versus.left && item.versus.right ? item.versus.strike ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 place-items-center rounded-full border border-danger/60 bg-danger/20 text-clay",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skull, { className: "size-5" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 place-items-center rounded-full border border-border-strong bg-bg/60 text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-5" })
					}) : null,
					item.versus.right ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.versus.right,
						alt: "",
						className: cn("size-20 rounded-full border border-border object-cover object-top shadow-[var(--shadow-card)] sm:size-24", item.versus.strike && "grayscale")
					}) : null
				]
			}) : null,
			item.dice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice3D, {
					values: item.dice,
					rolling: phase === "roll",
					dieSize: 64,
					ariaLabel: `Кубик: ${item.dice.join(", ")}`
				}), item.verdict ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-display text-xl leading-none", phase === "result" ? "pop-in" : "opacity-0", item.verdict.good ? "text-good" : "text-clay"),
					children: item.verdict.text
				}) : null]
			}) : null,
			item.cubes?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: item.cubes.flatMap((c) => Array.from({ length: c.n }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: c.tone,
					className: "pop-in size-6"
				}, `${c.tone}-${i}`)))
			}) : null,
			item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-[34ch] text-sm leading-snug text-muted",
				children: item.note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex flex-col items-center gap-1 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onSkip,
					className: "text-muted",
					children: "Пропустить показ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-[0.18em] text-subtle",
					children: "клик по карточке — дальше"
				})]
			})
		]
	});
}
/**
* Вёрстка стола: «cozy» — компактное сукно по центру, «wide» — во всю ширину
* с прижатыми к краям секциями. Переключается одной кнопкой в шапке.
*/
function loadTableLayout() {
	try {
		return localStorage.getItem("evo-table-layout") === "wide" ? "wide" : "cozy";
	} catch {
		return "cozy";
	}
}
var PHASE_LABEL = {
	development: "Развитие",
	foodBank: "Кормовая база",
	feeding: "Питание",
	extinction: "Вымирание",
	growth: "Рост",
	gameOver: "Итог"
};
var SPEED_LABEL = {
	slow: "Медленно",
	normal: "Обычно",
	fast: "Быстро"
};
var NO_INTERACTION = {
	highlight: false,
	dimmed: false,
	selected: false,
	danger: false
};
var FX_TONE = {
	attack: "border-danger/70 bg-danger/25 text-clay",
	good: "border-good/60 bg-good/25 text-good",
	bad: "border-danger/60 bg-danger/15 text-clay",
	info: "border-border-strong bg-surface text-fg"
};
function shakeEl(el) {
	if (!el) return;
	el.classList.remove("anim-shake");
	el.offsetWidth;
	el.classList.add("anim-shake");
	setTimeout(() => el.classList.remove("anim-shake"), 600);
}
/**
* Читает события последнего действия и превращает их в живую картинку:
* всплывающие бейджи над местом события и встряску участников атаки.
* Бейджи живут ~1.7 с и удаляются сами.
*/
function useActionFx(state) {
	const [badges, setBadges] = (0, import_react.useState)([]);
	const seqRef = (0, import_react.useRef)(0);
	const idRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!state || state.eventSeq === seqRef.current) return;
		seqRef.current = state.eventSeq;
		const anchorOf = (el) => {
			if (!el) return {
				x: window.innerWidth / 2,
				y: window.innerHeight / 3
			};
			const r = el.getBoundingClientRect();
			return {
				x: Math.round(r.left + r.width / 2),
				y: Math.round(r.top + 6)
			};
		};
		const animalEl = (id) => document.querySelector(`[data-animal-id="${id}"]`);
		const plantEl = (id) => document.querySelector(`[data-plant-id="${id}"]`);
		const floraEl = (id) => document.querySelector(`[data-flora-id="${id}"]`);
		const sectionEl = (id) => document.querySelector(`[data-player-section="${id}"]`);
		const created = [];
		const push = (point, text, tone, image) => {
			idRef.current += 1;
			created.push({
				id: idRef.current,
				...point,
				text,
				tone,
				image
			});
		};
		for (const e of state.lastEvents) switch (e.kind) {
			case "huntDeclared":
				shakeEl(animalEl(e.carnivoreId));
				shakeEl(animalEl(e.preyId));
				push(anchorOf(animalEl(e.preyId) ?? animalEl(e.carnivoreId)), "Атака!", "attack");
				break;
			case "preyKilled":
				push(anchorOf(animalEl(e.carnivoreId)), "добыча съедена +2 синие", "attack");
				break;
			case "defenseUsed": {
				const prey = animalEl(e.preyId);
				if (e.defense === "tailLoss") {
					shakeEl(prey);
					push(anchorOf(prey), "− хвост", "bad");
				} else if (e.defense === "running") {
					shakeEl(prey);
					push(anchorOf(prey), `кубик ${e.roll}`, "info");
				} else if (e.defense === "mimicry") push(anchorOf(prey), "мимикрия →", "info");
				break;
			}
			case "foodFromBank":
				push(anchorOf(animalEl(e.animalId)), "+1 красная", "good");
				break;
			case "blueFood": {
				const label = e.reason === "piracy" ? "пиратство +1 синяя" : e.reason === "cooperation" ? "сотрудничество +1 синяя" : e.reason === "scavenger" ? "падальщик +1 синяя" : e.reason === "fat" ? "жир → синие" : e.reason === "tailLoss" ? "+1 синяя" : null;
				if (label) push(anchorOf(animalEl(e.animalId)), label, "info");
				break;
			}
			case "bankBurned":
				push(anchorOf(document.querySelector(".felt")), `−${e.amount} база`, "bad");
				break;
			case "plantFoodTaken":
				push(anchorOf(animalEl(e.animalId)), "+1 с растения", "good");
				break;
			case "shelterTaken":
				push(anchorOf(animalEl(e.animalId)), "в убежище", "good");
				break;
			case "plantAttack":
				shakeEl(animalEl(e.preyId));
				push(anchorOf(animalEl(e.preyId)), e.counter ? "растение контратакует!" : "хищное растение!", "attack");
				break;
			case "plantGrew":
				push(anchorOf(plantEl(e.plantId)), `рост ${e.from}→${e.to}`, "good");
				break;
			case "plantGrazed":
				push(anchorOf(plantEl(e.plantId)), "− топтун", "bad");
				break;
			case "plantDied":
				push(anchorOf(plantEl(e.plantId)), "☠ растение", "bad");
				break;
			case "cardStolen":
				push(anchorOf(sectionEl(e.toPlayerId)), "+1 карта (медонос)", "info");
				break;
			case "floraFoodTaken":
				push(anchorOf(animalEl(e.animalId)), "+1 с флоры", "good");
				break;
			case "floraGrew":
				push(anchorOf(floraEl(e.floraId)), `гриб ${e.from}→${e.to}`, "info");
				break;
			case "floraGrazed":
				push(anchorOf(floraEl(e.floraId)), "− топтун", "bad");
				break;
			case "floraDied":
				push(anchorOf(floraEl(e.floraId)), "☠ флора", "bad");
				break;
			case "markGained":
				push(anchorOf(animalEl(e.animalId)), `метка: ${e.mark === "poison" ? "яд" : e.mark}`, "bad");
				break;
			case "handLost":
				push(anchorOf(sectionEl(e.playerId)), "рука сброшена (прозрение)", "bad");
				break;
			case "cardsDrawn":
				for (let i = 0; i < e.counts.length; i++) {
					const n = e.counts[i];
					if (n > 0) push(anchorOf(sectionEl(i)), `+${n} ${n === 1 ? "карта" : n < 5 ? "карты" : "карт"}`, "info");
				}
				break;
			case "mutationFlipped": {
				const traitName = e.trait ? TRAITS[e.trait].name : null;
				const caption = e.usedAs === "trait" ? `«${traitName}»` : e.usedAs === "animal" ? "новый вид" : e.usedAs === "newSpecies" ? "вид-мутант" : e.usedAs === "population" ? "+1 животное" : e.usedAs === "plantTrait" ? `«${traitName}» на растении` : "в сброс";
				const tone = e.usedAs === "trait" || e.usedAs === "plantTrait" ? e.trait && TRAITS[e.trait].harmful ? "bad" : "good" : "info";
				push(anchorOf(sectionEl(e.playerId)), caption, tone, MUTATION_ART.flip);
				break;
			}
		}
		if (state.lastEvents.some((e) => e.kind === "animalDied")) {
			const felt = document.querySelector(".felt");
			if (felt) {
				const deaths = state.lastEvents.filter((e) => e.kind === "animalDied").length;
				push(anchorOf(felt), `☠ ${deaths}`, "bad");
				felt.classList.remove("anim-felt-flash");
				felt.offsetWidth;
				felt.classList.add("anim-felt-flash");
				setTimeout(() => felt.classList.remove("anim-felt-flash"), 1e3);
			}
		}
		if (created.length) {
			setBadges((prev) => [...prev, ...created]);
			const ids = new Set(created.map((c) => c.id));
			setTimeout(() => setBadges((prev) => prev.filter((b) => !ids.has(b.id))), 1750);
		}
	}, [state]);
	return badges;
}
/**
* Чей это событие: id игрока, если его можно определить, иначе undefined.
* Нужно, чтобы озвучивать чужие действия тише (gain) — свои звучат в полную.
*/
function eventOwnerId(state, e) {
	switch (e.kind) {
		case "passed":
		case "handLost":
		case "mutationFlipped":
		case "foodFromBank":
		case "plantFoodTaken":
		case "floraFoodTaken": return e.playerId;
		case "cardStolen": return e.toPlayerId;
		case "huntDeclared":
		case "preyKilled": return findAnimal(state, e.carnivoreId)?.ownerId;
		case "foodToFat":
		case "blueFood":
		case "traitPlaced":
		case "shelterTaken":
		case "budding":
		case "populationGrown":
		case "populationLost": return findAnimal(state, e.animalId)?.ownerId;
		case "plantAttack": return findAnimal(state, e.preyId)?.ownerId;
		case "cardsDrawn": return (e.counts[state.humanId] ?? 0) > 0 ? state.humanId : void 0;
		default: return;
	}
}
/**
* Звук одного события; null — событие молчит. `gameFinished` не озвучиваем:
* экран финала сам играет win/lose. Свой пас тоже молчит — его озвучивает
* кнопка (клик по «Пас»/«Закончить ход»), иначе звучало бы дважды.
*/
function eventSfx(state, e) {
	switch (e.kind) {
		case "diceRoll":
		case "territoryDice": return "roll";
		case "huntDeclared":
		case "plantAttack": return "hunt";
		case "preyKilled": return "kill";
		case "defenseUsed": return e.defense === "running" ? "defense" : e.defense === "none" ? null : "dodge";
		case "foodFromBank":
		case "plantFoodTaken":
		case "floraFoodTaken": return "food";
		case "blueFood": return "foodBlue";
		case "foodToFat": return "fat";
		case "animalDied": return "death";
		case "cardsDrawn":
		case "cardStolen": return "draw";
		case "traitPlaced":
		case "animalPlaced":
		case "budding": return "card";
		case "plantPlaced":
		case "floraPlaced":
		case "edificator": return "plant";
		case "markGained": return "mark";
		case "mutationFlipped":
		case "traitsRevealed": return "flip";
		case "passed": return e.playerId === state.humanId ? null : "pass";
		case "migrated": return "migrate";
		case "bankBurned": return "burn";
		case "shelterTaken": return "card";
		case "regenerated":
		case "populationGrown":
		case "plantGrew":
		case "floraGrew":
		case "plantGrazed":
		case "floraGrazed": return "grow";
		case "populationLost":
		case "plantDied":
		case "floraDied": return "wither";
		case "handLost": return "leave";
		case "paralyzed": return "dodge";
		case "gameFinished": return null;
	}
}
/**
* Раскладывает звуки событий каскадом (шаг ~70 мс), чтобы цепочка
* «атака → кубик → спаслось» звучала по порядку, а не одной кучей.
* Чужие события звучат тише; базовый gain приглушает проигрывание
* пропущенных сетевых батчей. Используется и живым кадром (useSfx),
* и очередью воспроизведения сети.
*/
function playEventsSfx(events, state, baseGain = 1, maxDelay = .5) {
	const queue = [];
	for (const e of events) {
		const id = eventSfx(state, e);
		if (!id) continue;
		const owner = eventOwnerId(state, e);
		const gain = owner !== void 0 && owner !== state.humanId ? .65 : 1;
		queue.push({
			id,
			at: Math.min(queue.length * .07, maxDelay),
			gain
		});
	}
	for (const q of queue) sfx.play(q.id, q.at, { gain: q.gain * baseGain });
}
/**
* Озвучка событий последнего действия — тот же кадр, что и визуальные бейджи,
* но звуки выстраиваются каскадом (шаг ~70 мс), чтобы цепочка вроде
* «атака → кубик → спаслось» звучала по порядку. Первый кадр партии
* (в сети — вход по снапшоту) не озвучивается.
*/
function useSfx(state) {
	const seqRef = (0, import_react.useRef)(0);
	const phaseRef = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (!state) {
			seqRef.current = 0;
			phaseRef.current = "";
			return;
		}
		const firstFrame = seqRef.current === 0;
		if (state.eventSeq !== seqRef.current) {
			seqRef.current = state.eventSeq;
			if (!firstFrame) playEventsSfx(state.lastEvents, state);
		}
		if (!firstFrame && state.phase !== phaseRef.current) {
			phaseRef.current = state.phase;
			if (state.phase !== "gameOver") sfx.play("phase");
		} else if (firstFrame) phaseRef.current = state.phase;
	}, [state]);
}
/**
* Летящая фишка еды: стартует точно от источника (инлайн-трансформ виден ещё
* до первого кадра анимации) и перелетает к животному через Web Animations
* API — надёжнее CSS-keyframes с переменными и без «висения» на старте.
*/
function FlyingCube({ item, onDone }) {
	const ref = (0, import_react.useRef)(null);
	const onDoneRef = (0, import_react.useRef)(onDone);
	onDoneRef.current = onDone;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			onDoneRef.current(item.id);
			return;
		}
		const anim = el.animate([
			{
				transform: `translate(${item.from.x}px, ${item.from.y}px) scale(0.9)`,
				opacity: "0"
			},
			{
				transform: `translate(${item.from.x}px, ${item.from.y}px) scale(1)`,
				opacity: "1",
				offset: .15
			},
			{
				transform: `translate(${item.to.x}px, ${item.to.y}px) scale(1.06)`,
				opacity: "1",
				offset: .78
			},
			{
				transform: `translate(${item.to.x}px, ${item.to.y}px) scale(0.6)`,
				opacity: "0"
			}
		], {
			duration: 500,
			easing: "cubic-bezier(0.22, 0.61, 0.36, 1)"
		});
		anim.onfinish = () => onDoneRef.current(item.id);
		return () => anim.cancel();
	}, [item]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "food-fly",
		style: { transform: `translate(${item.from.x}px, ${item.from.y}px)` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
			tone: item.tone,
			className: "size-5 drop-shadow-md"
		})
	});
}
/**
* Фишка еды «летит» по столу от источника (кормовая база, растение, флора)
* к карточке животного — вместо простого pop-in на месте. Работает поверх
* тех же событий последнего действия, что и визуальные бейджи.
*/
function useFoodFly(state) {
	const [items, setItems] = (0, import_react.useState)([]);
	const seqRef = (0, import_react.useRef)(0);
	const idRef = (0, import_react.useRef)(0);
	const remove = (0, import_react.useCallback)((id) => {
		setItems((prev) => prev.filter((b) => b.id !== id));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!state || state.eventSeq === seqRef.current) return;
		seqRef.current = state.eventSeq;
		const centerOf = (el) => {
			if (!el) return null;
			const r = el.getBoundingClientRect();
			return {
				x: Math.round(r.left + r.width / 2),
				y: Math.round(r.top + r.height / 2)
			};
		};
		const animalEl = (id) => document.querySelector(`[data-animal-id="${id}"]`);
		const created = [];
		const push = (from, to, tone) => {
			if (!from || !to) return;
			const jx = Math.round(Math.random() * 22 - 11);
			const jy = Math.round(Math.random() * 14 - 7);
			idRef.current += 1;
			created.push({
				id: idRef.current,
				tone,
				from: {
					x: from.x + jx,
					y: from.y + jy
				},
				to
			});
		};
		const felt = () => centerOf(document.querySelector(".felt"));
		for (const e of state.lastEvents) switch (e.kind) {
			case "foodFromBank":
				push(felt(), centerOf(animalEl(e.animalId)), "red");
				break;
			case "plantFoodTaken":
				push(centerOf(document.querySelector(`[data-plant-id="${e.plantId}"]`)), centerOf(animalEl(e.animalId)), "green");
				break;
			case "floraFoodTaken":
				push(centerOf(document.querySelector(`[data-flora-id="${e.floraId}"]`)), centerOf(animalEl(e.animalId)), "red");
				break;
			case "blueFood":
				push(felt(), centerOf(animalEl(e.animalId)), "blue");
				break;
			case "foodToFat": push(felt(), centerOf(animalEl(e.animalId)), "yellow");
		}
		if (created.length) {
			setItems((prev) => [...prev, ...created]);
			const ids = new Set(created.map((c) => c.id));
			setTimeout(() => setItems((prev) => prev.filter((b) => !ids.has(b.id))), 2e3);
		}
	}, [state]);
	return {
		flies: items,
		remove
	};
}
/** Настроение тихого фона по фазе партии (не музыка — медленные дрон-слои). */
function ambientMoodFor(phase) {
	if (phase === "feeding") return "feeding";
	if (phase === "extinction") return "extinction";
	if (phase === "gameOver") return "final";
	return "development";
}
/**
* Проигрывание пропущенных сетевых батчей. При отставании поллинга сервер
* присылает события каждого шага (EventBatch); последний батч уже нарисован
* текущим кадром состояния, поэтому играем только пропущенные шаги — по
* порядку и не больше трёх (старые схлопываем, чтобы не копить долг).
* Первый кадр и реконнект историю не проигрывают: версии просто отмечаются
* просмотренными, иначе стол «вспоминал» бы партию с начала.
*/
function useNetReplay(state, net, enabled) {
	const [replay, setReplay] = (0, import_react.useState)([]);
	const playedRef = (0, import_react.useRef)(0);
	const startedRef = (0, import_react.useRef)(false);
	const statusRef = (0, import_react.useRef)(null);
	const batches = net?.events;
	const status = net?.status ?? null;
	(0, import_react.useEffect)(() => {
		if (!enabled) {
			statusRef.current = null;
			return;
		}
		const prev = statusRef.current;
		statusRef.current = status;
		if (prev === "reconnecting" && status && status !== "reconnecting") startedRef.current = false;
	}, [enabled, status]);
	(0, import_react.useEffect)(() => {
		if (!enabled || !state || !batches?.length) return;
		const pending = batches.filter((b) => b.version > playedRef.current).sort((a, b) => a.version - b.version);
		if (!pending.length) return;
		playedRef.current = pending[pending.length - 1].version;
		if (!startedRef.current) {
			startedRef.current = true;
			return;
		}
		const missed = pending.slice(0, -1);
		if (missed.length) setReplay(missed.slice(-3).flatMap((b) => b.events));
	}, [
		enabled,
		state,
		batches
	]);
	return replay;
}
/** Тихий щелчок на кнопках дока: карточки и поля молчат, чтобы не шуметь. */
function dockClickSfx(e) {
	if (e.target.closest("button")) sfx.play("click");
}
/**
* Появление/пропадание игроков в сети: join на вошедшего, leave на ушедшего.
* Первый кадр не озвучиваем (вся комната «уже там»), ботов не считаем.
*/
function useNetPresenceSfx(seats, enabled) {
	const prevRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!enabled) {
			prevRef.current = null;
			return;
		}
		const list = seats ?? [];
		const next = new Map(list.map((s) => [s.seat, s.online]));
		const prev = prevRef.current;
		prevRef.current = next;
		if (!prev) return;
		for (const info of list) {
			if (info.isAI) continue;
			const was = prev.get(info.seat);
			if (was === void 0 || was === info.online) continue;
			sfx.play(info.online ? "join" : "leave", 0, { gain: .8 });
		}
	}, [seats, enabled]);
}
/** Новое сообщение чата — мягкий «дзинь» (историю при входе не озвучиваем). */
function useNetChatSfx(chat, enabled) {
	const lastIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!enabled) {
			lastIdRef.current = null;
			return;
		}
		const list = chat ?? [];
		if (!list.length) return;
		const maxId = list[list.length - 1].id;
		const prev = lastIdRef.current;
		lastIdRef.current = maxId;
		if (prev === null || maxId <= prev) return;
		sfx.play("chat", 0, { gain: .9 });
	}, [chat, enabled]);
}
/** «Последний год»: короткий баннер на входе в последний год, дальше сам гаснет. */
function useLastYearBanner(state) {
	const [visible, setVisible] = (0, import_react.useState)(false);
	const keyRef = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		const key = `${state.year}:${state.lastYear}`;
		if (!state.lastYear) {
			keyRef.current = key;
			setVisible(false);
			return;
		}
		if (keyRef.current === key) return;
		keyRef.current = key;
		setVisible(true);
		const t = setTimeout(() => setVisible(false), 3400);
		return () => clearTimeout(t);
	}, [state.year, state.lastYear]);
	return visible;
}
/**
* Ненавязчивые баннеры над столом: «последний год» и «безумие» (раунд
* человека играет сосед — частая причина ощущения «пас нажался сам»).
* Ничего не перекрывают: узкие полосы с pointer-events-none.
*/
function TableBanners({ state }) {
	const lastYear = useLastYearBanner(state);
	const mad = state.madTurn === state.humanId;
	if (!lastYear && !mad) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none flex flex-col items-center gap-1 px-3 pt-2",
		children: [mad ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "phase-banner-in rounded-full border border-virus/60 bg-virus/15 px-4 py-1 text-center text-xs text-fg",
			children: "Безумие: этот раунд за вас играет сосед справа — ваши животные действуют сами"
		}) : null, lastYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "phase-banner-in rounded-full border border-clay/60 bg-clay/15 px-4 py-1 text-center text-xs font-medium text-clay",
			children: "Последний год — после этого раунда партия закончится"
		}) : null]
	});
}
function GameApp() {
	const state = useGameStore((s) => s.state);
	(0, import_react.useEffect)(() => {
		const saved = loadSpeed();
		if (saved !== "normal") useGameStore.getState().setSpeed(saved);
		useGameStore.getState().resumeSolo();
		delete document.documentElement.dataset.evoResume;
	}, []);
	const rulesOpen = useGameStore((s) => s.rulesOpen);
	const start = useGameStore((s) => s.start);
	const reset = useGameStore((s) => s.reset);
	const setRulesOpen = useGameStore((s) => s.setRulesOpen);
	const mode = useGameStore((s) => s.mode);
	const net = useGameStore((s) => s.net);
	const netAgain = useGameStore((s) => s.netAgain);
	const leaveNet = useGameStore((s) => s.leaveNet);
	const openRules = (0, import_react.useCallback)(() => {
		sfx.play("modal");
		setRulesOpen(true);
	}, [setRulesOpen]);
	const closeRules = (0, import_react.useCallback)(() => {
		sfx.play("modal");
		setRulesOpen(false);
	}, [setRulesOpen]);
	(0, import_react.useEffect)(() => {
		const unlock = () => sfx.unlock();
		window.addEventListener("pointerdown", unlock, { once: true });
		window.addEventListener("keydown", unlock, { once: true });
		return () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
		};
	}, []);
	if (mode === "net") {
		if (!net || net.status === "lobby") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LobbyScreen, {}),
			rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
		] });
		if (net.status === "connecting" && !state) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "grid min-h-dvh place-items-center text-sm text-muted",
				children: "Открываем стол…"
			}),
			rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
		] });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh flex-col",
			children: [
				net.status === "reconnecting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-x-0 top-14 z-40 mx-auto w-fit rounded-full border border-danger/50 bg-danger/15 px-4 py-1.5 text-sm text-clay",
					children: "Переподключение…"
				}) : null,
				state ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "grid min-h-dvh place-items-center text-sm text-muted",
					children: net.status === "finished" ? "Открываем финальный стол…" : "Загружаем партию…"
				}),
				state?.phase === "gameOver" && state.scores ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameOverScreen, {
					scores: state.scores,
					winnerIds: state.winnerIds ?? [],
					humanId: state.humanId,
					onAgain: () => void netAgain(),
					onMenu: leaveNet
				}) : null,
				rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
			]
		});
	}
	if (!state) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "menu-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuScreen, {
				onStart: start,
				onRules: openRules
			}),
			rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {}),
			state.phase === "gameOver" && state.scores ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameOverScreen, {
				scores: state.scores,
				winnerIds: state.winnerIds ?? [],
				humanId: state.humanId,
				onAgain: () => start(state.players.length, state.difficulty),
				onMenu: reset
			}) : null,
			rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
		]
	});
}
/** Тосты в теме атласа — для сетевых ошибок и достижений. */
var TOASTER_OPTS = {
	position: "top-center",
	toastOptions: { style: {
		background: "var(--color-surface)",
		border: "1px solid var(--color-border)",
		color: "var(--color-fg)",
		borderRadius: "var(--radius-md)"
	} }
};
/** Тон записи журнала движка → вид записи общей ленты. */
function feedKindOf(tone) {
	return tone === "bad" || tone === "hunt" ? "important" : "action";
}
/** Быстрые фразы сетевого чата — чтобы не печатать на телефоне. */
var NET_QUICK_PHRASES = [
	"Привет!",
	"Хороший ход!",
	"Ваш ход",
	"Спасибо!"
];
/**
* Лента «журнал + чат». У записей журнала нет времени, поэтому время первого
* показа запоминаем на клиенте: так сообщения чата подмешиваются в ленту по
* своим меткам, а не сваливаются одним блоком в конец. Ключи — монотонные id
* (logSeq у журнала, id сообщения у чата), поэтому React не пересоздаёт строки.
*/
function useFeedItems(state, net) {
	const seenAtRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const chat = net?.chat;
	return (0, import_react.useMemo)(() => {
		const now = Date.now();
		const seen = seenAtRef.current;
		const rows = [];
		for (const e of state.log) {
			let at = seen.get(e.id);
			if (at === void 0) {
				at = now;
				seen.set(e.id, at);
			}
			rows.push({
				sortAt: at,
				item: {
					id: `log-${e.id}`,
					kind: feedKindOf(e.tone),
					text: e.text
				}
			});
		}
		for (const m of chat ?? []) rows.push({
			sortAt: m.at,
			item: {
				id: `chat-${m.id}`,
				kind: "chat",
				text: m.text,
				playerName: m.name,
				at: m.at
			}
		});
		rows.sort((a, b) => a.sortAt - b.sortAt);
		return rows.slice(-140).map((r) => r.item);
	}, [state.log, chat]);
}
function Table() {
	const state = useGameStore((s) => s.state);
	const thinking = useGameStore((s) => s.thinking);
	const thinkingWho = useGameStore((s) => s.thinkingWho);
	const intent = useGameStore((s) => s.intent);
	const logOpen = useGameStore((s) => s.logOpen);
	const speed = useGameStore((s) => s.speed);
	const dispatch = useGameStore((s) => s.dispatch);
	const setIntent = useGameStore((s) => s.setIntent);
	const setLogOpen = useGameStore((s) => s.setLogOpen);
	const setRulesOpen = useGameStore((s) => s.setRulesOpen);
	const setSpeed = useGameStore((s) => s.setSpeed);
	const reset = useGameStore((s) => s.reset);
	const collapseSolo = useGameStore((s) => s.collapseSolo);
	const mode = useGameStore((s) => s.mode);
	const net = useGameStore((s) => s.net);
	const sendChat = useGameStore((s) => s.sendChat);
	const leaveNet = useGameStore((s) => s.leaveNet);
	const canUndo = useGameStore((s) => s.canUndo);
	const undoLast = useGameStore((s) => s.undoLast);
	const netError = useGameStore((s) => s.net?.error);
	const clearNetError = useGameStore((s) => s.clearNetError);
	const [confirmLeave, setConfirmLeave] = (0, import_react.useState)(false);
	const confirmRef = (0, import_react.useRef)(false);
	const askLeave = (0, import_react.useCallback)((v) => {
		sfx.play("modal");
		confirmRef.current = v;
		setConfirmLeave(v);
	}, []);
	const feed = useFeedItems(state, net);
	(0, import_react.useEffect)(() => {
		if (!netError) return;
		toast.error(netError);
		clearNetError();
	}, [netError, clearNetError]);
	const human = player(state, state.humanId);
	const actor = currentActor(state);
	const isHumanTurn = actor?.id === human.id && state.madTurn !== human.id && !net?.spectating;
	const [turnCard, setTurnCard] = (0, import_react.useState)(null);
	const turnKey = `${state.year}:${state.phase}`;
	const wasTurnRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const on = isHumanTurn && !state.pendingAttack && !state.rageTurn;
		if (on && !wasTurnRef.current) setTurnCard(turnKey);
		if (!on) setTurnCard(null);
		wasTurnRef.current = on;
	}, [
		isHumanTurn,
		state.pendingAttack,
		state.rageTurn,
		turnKey
	]);
	(0, import_react.useEffect)(() => {
		if (!turnCard) return;
		const t = window.setTimeout(() => setTurnCard(null), 3200);
		return () => window.clearTimeout(t);
	}, [turnCard]);
	const feedActs = (0, import_react.useMemo)(() => state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? legalFeedActions(state, human.id) : [], [
		state,
		isHumanTurn,
		human.id
	]);
	const devActs = (0, import_react.useMemo)(() => state.phase === "development" && isHumanTurn ? legalDevActions(state, human.id) : [], [
		state,
		isHumanTurn,
		human.id
	]);
	const defActs = (0, import_react.useMemo)(() => state.pendingAttack && state.pendingAttack.waitingFor === human.id ? legalDefenseActions(state, human.id) : [], [state, human.id]);
	/**
	* Причины, по которым ключевые действия питания недоступны: движок отдаёт
	* готовые тексты (feedBlockReason). Серую кнопку показываем, когда действие
	* заблокировано, а не просто отсутствует: для охоты/пиратства/спячки — лишь
	* если у игрока вообще есть животное с таким свойством, иначе док бы вечно
	* мозолил глаза тремя «серыми» кнопками. Ход бешенства рисует свой док.
	*/
	const feedBlocked = (0, import_react.useMemo)(() => {
		if (state.phase !== "feeding" || !isHumanTurn || state.pendingAttack || state.rageTurn) return null;
		const has = (trait) => human.animals.some((a) => hasTrait(a, trait, true));
		const out = {};
		if (human.animals.length) {
			const r = feedBlockReason(state, human.id, "feedTake");
			if (r) out.take = r;
		}
		if (has("carnivore") || has("obligateCarnivore")) {
			const r = feedBlockReason(state, human.id, "feedHunt");
			if (r) out.hunt = r;
		}
		if (has("piracy")) {
			const r = feedBlockReason(state, human.id, "feedPirate");
			if (r) out.pirate = r;
		}
		if (has("hibernation")) {
			const r = feedBlockReason(state, human.id, "feedHibernate");
			if (r) out.sleep = r;
		}
		return out.take || out.hunt || out.pirate || out.sleep ? out : null;
	}, [
		state,
		isHumanTurn,
		human
	]);
	const interactions = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of state.players) for (const a of p.animals) {
			const hl = animalHighlight(state, a, intent, isHumanTurn, feedActs, devActs);
			map.set(a.id, {
				highlight: hl,
				dimmed: intent.kind !== "none" && !hl,
				selected: intent.kind === "playPair" && intent.first === a.id || intent.kind === "hunt" && intent.carnivoreId === a.id || intent.kind === "pirate" && intent.pirateId === a.id,
				danger: hl && (intent.kind === "hunt" && intent.carnivoreId !== void 0 || intent.kind === "pirate" && intent.pirateId !== void 0 || intent.kind === "plantAttack" && intent.plantId !== void 0 || intent.kind === "parasitize")
			});
		}
		return map;
	}, [
		state,
		intent,
		isHumanTurn,
		feedActs,
		devActs
	]);
	const getInteraction = (0, import_react.useCallback)((a) => interactions.get(a.id) ?? NO_INTERACTION, [interactions]);
	const dangerKey = (0, import_react.useMemo)(() => [...interactions.entries()].filter(([, it]) => it.danger).map(([id]) => id).sort().join(","), [interactions]);
	const dangerSoundRef = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (dangerKey && dangerKey !== dangerSoundRef.current) sfx.play("crack");
		dangerSoundRef.current = dangerKey;
	}, [dangerKey]);
	const plantsOn = Boolean(state.modules.plants);
	const fungiOn = Boolean(state.modules.fungi);
	const plantHighlights = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		if (!plantsOn) return set;
		if (state.phase === "development") {
			if (intent.kind === "playPlantTrait") {
				for (const a of devActs) if (a.type === "devPlayPlantTrait" && a.cardId === intent.cardId && a.face === intent.face) set.add(a.plantId);
			} else if (intent.kind === "playPlantPair") for (const a of devActs) {
				if (a.type !== "devPlayPlantPair" || a.cardId !== intent.cardId || a.face !== intent.face) continue;
				if (intent.first ? a.a === intent.first : true) set.add(intent.first ? a.b : a.a);
			}
			else if (intent.kind === "mutatePlant") {
				for (const a of devActs) if (a.type === "devMutate" && a.intent === "plant" && a.plantId) set.add(a.plantId);
			}
		} else if (state.phase === "feeding" && isHumanTurn) {
			if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && intent.animalId) {
				for (const a of feedActs) if (a.type === "feedTakePlant" && a.animalId === intent.animalId) set.add(a.plantId);
			} else if (intent.kind === "shelter" && intent.animalId) {
				for (const a of feedActs) if (a.type === "feedShelter" && a.animalId === intent.animalId) set.add(a.plantId);
			} else if (intent.kind === "plantAttack") {
				if (intent.plantId) set.add(intent.plantId);
				else for (const a of feedActs) if (a.type === "feedPlantAttack") set.add(a.plantId);
			} else if (intent.kind === "parasitize") {
				for (const a of feedActs) if (a.type === "feedParasitize") set.add(a.parasiteId);
			} else if (intent.kind === "graze" && intent.animalId) {
				for (const a of feedActs) if (a.type === "feedGraze" && a.animalId === intent.animalId && a.plantId) set.add(a.plantId);
			}
		}
		return set;
	}, [
		plantsOn,
		state.phase,
		intent,
		devActs,
		feedActs,
		isHumanTurn
	]);
	const floraHighlights = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		if (!fungiOn) return set;
		if (state.phase !== "feeding" || !isHumanTurn) return set;
		if ((intent.kind === "takeFlora" || intent.kind === "takePlant") && intent.animalId) {
			for (const a of feedActs) if (a.type === "feedTakeFlora" && a.animalId === intent.animalId) set.add(a.floraId);
		} else if (intent.kind === "graze" && intent.animalId) {
			for (const a of feedActs) if (a.type === "feedGraze" && a.animalId === intent.animalId && a.floraId) set.add(a.floraId);
		}
		return set;
	}, [
		fungiOn,
		state.phase,
		intent,
		feedActs,
		isHumanTurn
	]);
	function onPlantClick(plant) {
		if (!isHumanTurn || state.pendingAttack) return;
		sfx.play("click");
		const dispatchAct = (a) => dispatch(a);
		if (state.phase === "development") {
			if (intent.kind === "playPlantTrait") {
				if (devActs.some((a) => a.type === "devPlayPlantTrait" && a.cardId === intent.cardId && a.face === intent.face && a.plantId === plant.id)) dispatchAct({
					type: "devPlayPlantTrait",
					cardId: intent.cardId,
					face: intent.face,
					plantId: plant.id
				});
				return;
			}
			if (intent.kind === "playPlantPair") {
				if (!intent.first) {
					setIntent({
						...intent,
						first: plant.id
					});
					return;
				}
				if (devActs.some((a) => a.type === "devPlayPlantPair" && a.cardId === intent.cardId && a.face === intent.face && a.a === intent.first && a.b === plant.id)) dispatchAct({
					type: "devPlayPlantPair",
					cardId: intent.cardId,
					face: intent.face,
					a: intent.first,
					b: plant.id
				});
				return;
			}
			if (intent.kind === "mutatePlant") {
				if (devActs.some((a) => a.type === "devMutate" && a.intent === "plant" && a.plantId === plant.id)) dispatchAct({
					type: "devMutate",
					intent: "plant",
					plantId: plant.id
				});
			}
			return;
		}
		if (state.phase !== "feeding") return;
		if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && intent.animalId) {
			if (feedActs.some((a) => a.type === "feedTakePlant" && a.animalId === intent.animalId && a.plantId === plant.id)) dispatchAct({
				type: "feedTakePlant",
				animalId: intent.animalId,
				plantId: plant.id
			});
			return;
		}
		if (intent.kind === "shelter" && intent.animalId) {
			if (feedActs.some((a) => a.type === "feedShelter" && a.animalId === intent.animalId && a.plantId === plant.id)) dispatchAct({
				type: "feedShelter",
				animalId: intent.animalId,
				plantId: plant.id
			});
			return;
		}
		if (intent.kind === "plantAttack") {
			if (!intent.plantId) {
				if (feedActs.some((a) => a.type === "feedPlantAttack" && a.plantId === plant.id)) setIntent({
					kind: "plantAttack",
					plantId: plant.id
				});
			}
			return;
		}
		if (intent.kind === "parasitize") {
			const act = feedActs.find((a) => a.type === "feedParasitize" && a.parasiteId === plant.id);
			if (act && act.type === "feedParasitize") dispatchAct(act);
			return;
		}
		if (intent.kind === "graze" && intent.animalId) {
			if (feedActs.some((a) => a.type === "feedGraze" && a.animalId === intent.animalId && a.plantId === plant.id)) dispatchAct({
				type: "feedGraze",
				animalId: intent.animalId,
				plantId: plant.id
			});
		}
	}
	/** «Трава и грибы»: клик по карте флоры — еда или топтун. */
	function onFloraClick(flora) {
		if (!isHumanTurn || state.pendingAttack) return;
		if (state.phase !== "feeding") return;
		sfx.play("click");
		if ((intent.kind === "takeFlora" || intent.kind === "takePlant") && intent.animalId) {
			if (feedActs.some((a) => a.type === "feedTakeFlora" && a.animalId === intent.animalId && a.floraId === flora.id)) dispatch({
				type: "feedTakeFlora",
				animalId: intent.animalId,
				floraId: flora.id
			});
			return;
		}
		if (intent.kind === "graze" && intent.animalId) {
			if (feedActs.some((a) => a.type === "feedGraze" && a.animalId === intent.animalId && a.floraId === flora.id)) dispatch({
				type: "feedGraze",
				animalId: intent.animalId,
				floraId: flora.id
			});
		}
	}
	function onBoardClick(e) {
		const target = e.target.closest("[data-animal-id]");
		if (!target) {
			if (!e.target.closest("[data-plant-id], [data-flora-id], button, a") && isHumanTurn && intent.kind !== "none") setIntent({ kind: "none" });
			return;
		}
		if (!isHumanTurn || state.pendingAttack) return;
		const animal = findAnimal(state, target.getAttribute("data-animal-id"));
		if (!animal) return;
		handleAnimalClick(animal, {
			state,
			intent,
			isHumanTurn,
			human,
			feedActs,
			devActs,
			dispatch,
			setIntent
		});
	}
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key !== "Escape") return;
			const s = useGameStore.getState();
			if (s.rulesOpen || s.logOpen) return;
			if (confirmRef.current) return;
			if (s.intent.kind !== "none") s.setIntent({ kind: "none" });
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const opponents = state.players.filter((p) => p.id !== human.id);
	/**
	* Рассадка вокруг поля. Верх и «низ» (ряд над своим табло) — по одной строке,
	* делённой пополам между двумя соперниками; бока — по колонке до двух.
	* Так восемь мест раскладываются без наложений: 2 сверху, 2 снизу, 2+2 по бокам.
	*/
	const seats = (0, import_react.useMemo)(() => {
		const top = [];
		const left = [];
		const right = [];
		const bottom = [];
		if (opponents.length === 1) top.push(opponents[0]);
		else if (opponents.length === 2) {
			left.push(opponents[0]);
			right.push(opponents[1]);
		} else {
			const slots = [
				top,
				left,
				right,
				top,
				left,
				right,
				bottom,
				bottom
			];
			opponents.forEach((p, i) => slots[Math.min(i, slots.length - 1)].push(p));
		}
		return {
			top,
			left,
			right,
			bottom
		};
	}, [opponents]);
	const [tableLayout, setTableLayout] = (0, import_react.useState)(loadTableLayout);
	const wideSeats = seats.left.length > 0 || seats.right.length > 0 || tableLayout === "wide";
	const lastLog = state.log[state.log.length - 1]?.text;
	const dying = (0, import_react.useMemo)(() => new Set(state.extinctionDeaths), [state.extinctionDeaths]);
	const fx = useActionFx(state);
	useSfx(state);
	const fly = useFoodFly(state);
	const netReplay = useNetReplay(state, net, mode === "net");
	useNetPresenceSfx(net?.seats, mode === "net");
	useNetChatSfx(net?.chat, mode === "net");
	(0, import_react.useEffect)(() => {
		if (!netReplay.length) return;
		const cur = useGameStore.getState().state;
		if (cur) playEventsSfx(netReplay, cur, .7, .35);
	}, [netReplay]);
	(0, import_react.useEffect)(() => {
		sfx.setAmbient(ambientMoodFor(state.phase));
	}, [state.phase]);
	(0, import_react.useEffect)(() => () => sfx.setAmbient(null), []);
	const prevHumanTurnRef = (0, import_react.useRef)(null);
	const prevTurnKeyRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const prevHuman = prevHumanTurnRef.current;
		const prevKey = prevTurnKeyRef.current;
		const key = `${state.year}:${state.phase}:${state.currentPlayerId ?? -1}:${state.madTurn ?? -1}`;
		prevHumanTurnRef.current = isHumanTurn;
		prevTurnKeyRef.current = key;
		if (prevHuman === false && isHumanTurn && !state.pendingAttack && prevKey !== key) sfx.play("yourTurn");
	}, [
		isHumanTurn,
		state.pendingAttack,
		state.year,
		state.phase,
		state.currentPlayerId,
		state.madTurn
	]);
	const openRulesModal = (0, import_react.useCallback)(() => {
		sfx.play("modal");
		setRulesOpen(true);
	}, [setRulesOpen]);
	const prevHandRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const [freshHand, setFreshHand] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		const ids = new Set(human.hand.map((c) => c.id));
		const fresh = [...ids].filter((id) => !prevHandRef.current.has(id));
		prevHandRef.current = ids;
		if (fresh.length) {
			setFreshHand(new Set(fresh));
			const t = setTimeout(() => setFreshHand(/* @__PURE__ */ new Set()), 900);
			return () => clearTimeout(t);
		}
	}, [human.hand]);
	const sessionRef = (0, import_react.useRef)(emptySession());
	const sessionSeqRef = (0, import_react.useRef)(0);
	const pendingDeathsRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	(0, import_react.useEffect)(() => {
		if (state.eventSeq < sessionSeqRef.current) {
			sessionRef.current = emptySession();
			pendingDeathsRef.current = /* @__PURE__ */ new Map();
		}
		for (const id of state.extinctionDeaths) {
			const a = findAnimal(state, id);
			if (a && !pendingDeathsRef.current.has(id)) pendingDeathsRef.current.set(id, a.ownerId);
		}
		if (state.eventSeq === sessionSeqRef.current) return;
		sessionSeqRef.current = state.eventSeq;
		const ses = sessionRef.current;
		const ownerOf = (id) => findAnimal(state, id)?.ownerId;
		for (const e of state.lastEvents) switch (e.kind) {
			case "huntDeclared":
				if (ownerOf(e.carnivoreId) === human.id) ses.hunts++;
				break;
			case "preyKilled":
				if (ownerOf(e.carnivoreId) === human.id) ses.kills++;
				break;
			case "foodFromBank":
			case "plantFoodTaken":
			case "floraFoodTaken":
				if (e.playerId === human.id) ses.food++;
				break;
			case "blueFood":
			case "foodToFat":
				if (ownerOf(e.animalId) === human.id) ses.food++;
				break;
			case "animalDied":
				if (pendingDeathsRef.current.get(e.animalId) === human.id) ses.deaths++;
				pendingDeathsRef.current.delete(e.animalId);
				break;
			case "defenseUsed":
				if (e.defense !== "none" && ownerOf(e.preyId) === human.id) ses.dodges++;
				break;
			case "traitPlaced": {
				if (ownerOf(e.animalId) !== human.id) break;
				ses.traits[e.type] = (ses.traits[e.type] ?? 0) + 1;
				const n = findAnimal(state, e.animalId)?.traits.length ?? 0;
				if (n > ses.maxTraits) ses.maxTraits = n;
				break;
			}
		}
	}, [state, human.id]);
	const recordedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (state.phase !== "gameOver") {
			recordedRef.current = false;
			return;
		}
		if (recordedRef.current) return;
		recordedRef.current = true;
		const unlocked = recordGame(state, sessionRef.current, mode);
		for (const a of unlocked) toast.success(`Достижение: ${a.name}`, { description: a.desc });
	}, [state, mode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "paper-desk pointer-events-none fixed inset-0 -z-10 opacity-[0.14]"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.07]",
			style: { backgroundImage: `url(${BG.valley})` }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			subtitle: `Год ${state.year}${state.lastYear ? " · последний" : ""} · ${PHASE_LABEL[state.phase]}${actor ? ` · ${actor.name}` : ""}`,
			subtitleShort: `Год ${state.year} · ${PHASE_LABEL[state.phase]}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					isHumanTurn && !state.pendingAttack ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						role: "status",
						"aria-label": "Ваш ход",
						title: "Ваш ход",
						className: "your-turn-badge flex h-8 items-center gap-1.5 rounded-full border border-accent/60 bg-accent/15 px-2 text-xs font-medium text-accent sm:px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "size-1.5 rounded-full bg-accent pulse-dot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Ваш ход"
						})]
					}) : null,
					mode === "solo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1 md:flex",
						role: "group",
						"aria-label": "Скорость игры",
						children: [
							"slow",
							"normal",
							"fast"
						].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								sfx.play("click");
								setSpeed(v);
							},
							className: cn("rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors duration-[var(--motion-fast)]", speed === v ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
							children: SPEED_LABEL[v]
						}, v))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodBankChip, {
						count: state.foodBank,
						visible: state.phase === "feeding" || state.phase === "foodBank"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundToggle, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "hidden lg:inline-flex",
								"aria-label": tableLayout === "cozy" ? "Широкая вёрстка стола" : "Компактная вёрстка стола",
								"aria-pressed": tableLayout === "wide",
								title: tableLayout === "cozy" ? "Широкая вёрстка стола" : "Компактная вёрстка стола",
								onClick: () => {
									sfx.play("click");
									const next = tableLayout === "cozy" ? "wide" : "cozy";
									setTableLayout(next);
									try {
										localStorage.setItem("evo-table-layout", next);
									} catch {}
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-9 sm:size-11",
								"aria-label": mode === "net" ? "Журнал и чат" : "Журнал",
								"aria-pressed": logOpen,
								title: mode === "net" ? "Журнал и чат" : "Журнал",
								onClick: () => {
									sfx.play("click");
									setLogOpen(!logOpen);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-9 sm:size-11",
								"aria-label": "Правила",
								title: "Правила",
								onClick: openRulesModal,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-9 sm:size-11",
								"aria-label": mode === "net" ? "Покинуть стол" : "Свернуть партию",
								title: mode === "net" ? "Покинуть стол" : "Свернуть партию",
								onClick: () => {
									sfx.play("click");
									if (state.phase === "gameOver") {
										if (mode === "net") leaveNet();
										else reset();
									} else askLeave(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "size-4" })
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBanners, { state }),
		net?.spectating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "status",
			className: "z-30 ml-3 mr-auto mt-2 flex w-fit max-w-[calc(100vw-24px)] items-center gap-1.5 rounded-full border border-border bg-surface/95 px-3 py-1 text-xs text-muted shadow-[var(--shadow-card)] backdrop-blur-sm sm:fixed sm:left-1/2 sm:top-14 sm:ml-0 sm:mt-0 sm:-translate-x-1/2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5 shrink-0" }), "Вы смотрите · реакции доступны"]
		}) : null,
		net ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactionsLayer, { net }) : null,
		turnCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "spotlight-passthrough fixed inset-0 z-40 flex items-center justify-center p-6",
			onClick: () => setTurnCard(null),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "spotlight-backdrop absolute inset-0"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "status",
				onClick: (e) => e.stopPropagation(),
				className: "spotlight-card grain phase-banner-in relative flex w-full max-w-sm flex-col items-center gap-2 rounded-[var(--radius-xl)] border border-accent/60 bg-surface px-8 py-8 text-center shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "size-2 rounded-full bg-accent pulse-dot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Ваш ход"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Год ",
							state.year,
							" · ",
							PHASE_LABEL[state.phase]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "md",
						className: "mt-2",
						onClick: () => setTurnCard(null),
						children: "К столу"
					})
				]
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col xl:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				onClick: onBoardClick,
				className: cn("flex flex-1 flex-col gap-3 px-3 py-3 sm:px-5", wideSeats && (plantsOn || fungiOn) && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-4 lg:[grid-template-areas:'plants_plants_plants''top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']", wideSeats && !plantsOn && !fungiOn && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-4 lg:[grid-template-areas:'top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']", !wideSeats && "lg:mx-auto lg:w-full lg:max-w-4xl", state.phase === "extinction" ? "extinction-glow" : ""),
				children: [
					plantsOn || fungiOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: wideSeats ? { gridArea: "plants" } : void 0,
						className: "flex flex-col gap-2",
						children: state.modules.continents ? ["gondwana", "laurasia"].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [plantsOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantStrip, {
								state,
								zone: z,
								highlights: plantHighlights,
								onPlantClick,
								freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0
							}) : null, fungiOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloraStrip, {
								state,
								zone: z,
								highlights: floraHighlights,
								onFloraClick
							}) : null]
						}, z)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [plantsOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantStrip, {
							state,
							highlights: plantHighlights,
							onPlantClick,
							freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0
						}) : null, fungiOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloraStrip, {
							state,
							highlights: floraHighlights,
							onFloraClick
						}) : null] })
					}) : null,
					seats.top.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: wideSeats ? { gridArea: "top" } : void 0,
						className: cn("grid gap-3", seats.top.length > 1 && "lg:grid-cols-2"),
						children: seats.top.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
							p,
							actorId: actor?.id ?? null,
							thinking: thinking && thinkingWho === p.id,
							interactions: getInteraction,
							dying,
							freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
							continents: Boolean(state.modules.continents)
						}, p.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: wideSeats ? { gridArea: "left" } : void 0,
						className: cn(wideSeats && "lg:min-w-0"),
						children: seats.left.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
							p,
							actorId: actor?.id ?? null,
							thinking: thinking && thinkingWho === p.id,
							interactions: getInteraction,
							dying,
							freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
							continents: Boolean(state.modules.continents)
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenterField, {
						style: wideSeats ? { gridArea: "felt" } : void 0,
						year: state.year,
						lastYear: state.lastYear,
						phase: state.phase,
						bank: state.foodBank,
						territoryFood: state.modules.continents ? state.territoryFood : void 0,
						deckLeft: state.deckCount ?? state.deck.length,
						foodRoll: state.foodRoll,
						lastLog,
						actorName: actor?.name,
						deaths: state.extinctionDeaths.length,
						plantsInfo: plantsOn ? {
							count: (state.plants ?? []).length,
							food: (state.plants ?? []).reduce((s, p) => s + p.food, 0),
							shelters: (state.plants ?? []).reduce((s, p) => s + p.shelters, 0),
							deck: state.plantDeckCount ?? state.plantDeck?.length ?? 0
						} : void 0,
						floraInfo: fungiOn ? {
							count: (state.flora ?? []).length,
							food: (state.flora ?? []).reduce((s, f) => s + f.food, 0),
							deck: state.floraDeckCount ?? state.floraDeck?.length ?? 0
						} : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: wideSeats ? { gridArea: "right" } : void 0,
						className: cn(wideSeats && "lg:min-w-0"),
						children: seats.right.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
							p,
							actorId: actor?.id ?? null,
							thinking: thinking && thinkingWho === p.id,
							interactions: getInteraction,
							dying,
							freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
							continents: Boolean(state.modules.continents)
						}, p.id))
					}),
					seats.bottom.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: wideSeats ? { gridArea: "bottom" } : void 0,
						className: cn("grid gap-3", seats.bottom.length > 1 && "lg:grid-cols-2"),
						children: seats.bottom.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
							p,
							actorId: actor?.id ?? null,
							thinking: thinking && thinkingWho === p.id,
							interactions: getInteraction,
							dying,
							freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
							continents: Boolean(state.modules.continents)
						}, p.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
						p: human,
						isHuman: true,
						actorId: actor?.id ?? null,
						thinking: false,
						interactions: getInteraction,
						dying,
						freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
						continents: Boolean(state.modules.continents),
						style: wideSeats ? { gridArea: "human" } : void 0
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
				items: feed,
				open: logOpen,
				onToggle: setLogOpen,
				title: mode === "net" ? "Журнал и чат" : "Журнал",
				...mode === "net" ? {
					onSend: (text) => void sendChat(text),
					quickPhrases: NET_QUICK_PHRASES
				} : {}
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "sticky bottom-0 z-20 border-t border-border bg-bg/95 px-3 py-3 backdrop-blur-sm sm:px-5",
			children: net?.spectating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 items-center justify-center gap-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), "Режим зрителя: действия недоступны"]
			}) : state.phase === "development" ? state.modules.randomMutations ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MutateDock, {
				human,
				intent,
				disabled: !isHumanTurn || Boolean(state.pendingAttack),
				continents: Boolean(state.modules.continents),
				canPlant: Boolean(state.modules.plants),
				canUndo,
				onUndo: undoLast,
				onNewAnimal: (zoneId) => dispatch({
					type: "devMutate",
					intent: "newAnimal",
					zoneId
				}),
				onTrait: () => setIntent({ kind: "mutateTrait" }),
				onPop: () => setIntent({ kind: "mutatePop" }),
				onPlant: () => setIntent({ kind: "mutatePlant" }),
				onPass: () => {
					sfx.play("endTurn");
					dispatch({ type: "devPass" });
				},
				onCancel: () => setIntent({ kind: "none" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevDock, {
				human,
				intent,
				disabled: !isHumanTurn || Boolean(state.pendingAttack),
				continents: Boolean(state.modules.continents),
				freshIds: freshHand,
				canUndo,
				onUndo: undoLast,
				onPlayAnimal: (cardId, zoneId) => dispatch({
					type: "devPlayAnimal",
					cardId,
					zoneId
				}),
				onPlaceAnimal: (cardId) => setIntent({
					kind: "placeAnimal",
					cardId
				}),
				onPickTrait: (cardId, face) => {
					const trait = human.hand.find((c) => c.id === cardId)?.faces[face];
					if (!trait) return;
					const def = TRAITS[trait];
					if (def.plantTrait) {
						if (trait === "micorrhiza") setIntent({
							kind: "playPlantPair",
							cardId,
							face
						});
						else setIntent({
							kind: "playPlantTrait",
							cardId,
							face
						});
						return;
					}
					if (def.isPair) setIntent({
						kind: "playPair",
						cardId,
						face
					});
					else setIntent({
						kind: "playTrait",
						cardId,
						face
					});
				},
				onPass: () => {
					sfx.play("endTurn");
					dispatch({ type: "devPass" });
				},
				onCancel: () => setIntent({ kind: "none" })
			}) : state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedDock, {
				human,
				acts: feedActs,
				intentKind: intent.kind,
				bank: state.foodBank,
				continents: Boolean(state.modules.continents),
				rageTurn: state.rageTurn ?? null,
				blocked: feedBlocked,
				onIntent: setIntent,
				onEndTurn: () => {
					sfx.play("endTurn");
					dispatch({ type: "feedEndTurn" });
				},
				onSkip: () => {
					sfx.play("pass");
					dispatch({ type: "feedSkip" });
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 items-center justify-center text-sm text-muted",
				children: state.phase === "foodBank" ? plantsOn || fungiOn ? "Кормовая база Океана определяется…" : state.foodRoll ? "Кубики брошены — кормовая база определяется…" : "Бросок кормовой базы…" : state.phase === "extinction" ? "Вымирание: ненакормленные животные погибают…" : state.phase === "growth" ? "Рост: растения разрастаются, добавляются новые…" : state.madTurn === (actor?.id ?? -2) ? `Безумие: раунд ${actor?.name ?? ""} проводит сосед справа…` : mode === "net" && actor && actor.id !== human.id ? `${actor.name} ходит…` : thinking ? `${actor?.name ?? "Соперник"} думает…` : "Ожидание"
			})
		}),
		fx.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				left: b.x,
				top: b.y
			},
			className: cn("fx-badge flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[var(--shadow-card)] backdrop-blur-sm", FX_TONE[b.tone]),
			children: [b.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: b.image,
				alt: "",
				loading: "lazy",
				className: "h-6 w-4 rounded-[2px] border border-ink/20 object-cover"
			}) : null, b.text]
		}, b.id)),
		fly.flies.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlyingCube, {
			item: f,
			onDone: fly.remove
		}, f.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventSpotlight, {
			replayEvents: mode === "net" ? netReplay : void 0,
			humanTurn: isHumanTurn
		}),
		state.pendingAttack && state.pendingAttack.waitingFor === human.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefenseDock, {
			acts: defActs,
			onPick: (a) => dispatch(a)
		}) : null,
		confirmLeave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			title: mode === "net" ? "Покинуть стол?" : "Свернуть партию?",
			body: mode === "net" ? "Место за столом сохранится — вернуться можно по ссылке-приглашению. Партия продолжится без вас." : "Партия сохранится: в меню появится «Продолжить». Прогресс не потеряется.",
			confirmLabel: mode === "net" ? "Покинуть стол" : "Свернуть партию",
			cancelLabel: mode === "net" ? "Остаться" : "Продолжить игру",
			tone: mode === "net" ? "danger" : "default",
			onConfirm: () => {
				askLeave(false);
				if (mode === "net") leaveNet();
				else collapseSolo();
			},
			onClose: () => askLeave(false)
		}) : null
	] });
}
function handleAnimalClick(animal, ctx) {
	const { state, intent, human, feedActs, devActs, dispatch, setIntent } = ctx;
	if (state.pendingAttack) return;
	if (state.phase === "development") {
		if (intent.kind === "mutateTrait") {
			if (devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id)) dispatch({
				type: "devMutate",
				intent: "trait",
				animalId: animal.id
			});
			return;
		}
		if (intent.kind === "mutatePop") {
			if (devActs.some((a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id)) dispatch({
				type: "devMutate",
				intent: "population",
				animalId: animal.id
			});
			return;
		}
		if (intent.kind === "playTrait") {
			if (devActs.some((a) => a.type === "devPlayTrait" && a.cardId === intent.cardId && a.face === intent.face && a.animalId === animal.id)) dispatch({
				type: "devPlayTrait",
				cardId: intent.cardId,
				face: intent.face,
				animalId: animal.id
			});
			return;
		}
		if (intent.kind === "playPair") {
			if (!intent.first) {
				if (animal.ownerId !== human.id) return;
				setIntent({
					...intent,
					first: animal.id
				});
				return;
			}
			if (devActs.some((a) => a.type === "devPlayPair" && a.cardId === intent.cardId && a.a === intent.first && a.b === animal.id)) dispatch({
				type: "devPlayPair",
				cardId: intent.cardId,
				face: intent.face,
				a: intent.first,
				b: animal.id
			});
			return;
		}
		return;
	}
	if (state.phase !== "feeding") return;
	if (intent.kind === "takePlant" || intent.kind === "takeFlora") {
		if (intent.animalId) return;
		const acts = feedActs.filter((a) => (a.type === "feedTakePlant" || a.type === "feedTakeFlora" || a.type === "feedTake") && a.animalId === animal.id);
		if (acts.length === 1) dispatch(acts[0]);
		else if (acts.length > 1) setIntent({
			kind: state.modules.fungi ? "takeFlora" : "takePlant",
			animalId: animal.id
		});
		return;
	}
	if (intent.kind === "shelter") {
		if (intent.animalId) return;
		const acts = feedActs.filter((a) => a.type === "feedShelter" && a.animalId === animal.id);
		if (acts.length === 1) dispatch(acts[0]);
		else if (acts.length > 1) setIntent({
			kind: "shelter",
			animalId: animal.id
		});
		return;
	}
	if (intent.kind === "plantAttack" && intent.plantId) {
		if (feedActs.some((a) => a.type === "feedPlantAttack" && a.plantId === intent.plantId && a.preyId === animal.id)) dispatch({
			type: "feedPlantAttack",
			plantId: intent.plantId,
			preyId: animal.id
		});
		return;
	}
	if (intent.kind === "graze") {
		if (intent.animalId) return;
		const acts = feedActs.filter((a) => a.type === "feedGraze" && a.animalId === animal.id);
		if (acts.length === 1) dispatch(acts[0]);
		else if (acts.length > 1) setIntent({
			...intent,
			animalId: animal.id
		});
		return;
	}
	if (intent.kind === "hunt") {
		if (!intent.carnivoreId) {
			const rageOk = state.rageTurn ? animal.id === state.rageTurn.animalId : false;
			if (animal.ownerId === human.id && (rageOk || hasTrait(animal, "carnivore"))) setIntent({
				kind: "hunt",
				carnivoreId: animal.id
			});
			return;
		}
		if (feedActs.some((a) => a.type === "feedHunt" && a.carnivoreId === intent.carnivoreId && a.preyId === animal.id)) dispatch({
			type: "feedHunt",
			carnivoreId: intent.carnivoreId,
			preyId: animal.id
		});
		return;
	}
	if (intent.kind === "pirate") {
		if (!intent.pirateId) {
			if (animal.ownerId === human.id && hasTrait(animal, "piracy")) setIntent({
				kind: "pirate",
				pirateId: animal.id
			});
			return;
		}
		if (feedActs.some((a) => a.type === "feedPirate" && a.pirateId === intent.pirateId && a.targetId === animal.id)) dispatch({
			type: "feedPirate",
			pirateId: intent.pirateId,
			targetId: animal.id
		});
		return;
	}
	if (intent.kind === "hibernate") {
		if (feedActs.some((a) => a.type === "feedHibernate" && a.animalId === animal.id)) dispatch({
			type: "feedHibernate",
			animalId: animal.id
		});
		return;
	}
	if (intent.kind === "fat") {
		const act = feedActs.find((a) => a.type === "feedConvertFat" && a.animalId === animal.id);
		if (act && act.type === "feedConvertFat") dispatch(act);
		return;
	}
	if (intent.kind === "take" || intent.kind === "none") {
		if (feedActs.some((a) => a.type === "feedTake" && a.animalId === animal.id)) dispatch({
			type: "feedTake",
			animalId: animal.id
		});
	}
}
function animalHighlight(state, animal, intent, isHumanTurn, feedActs, devActs) {
	if (!isHumanTurn) return false;
	if (intent.kind === "playTrait") return devActs.some((a) => a.type === "devPlayTrait" && a.cardId === intent.cardId && a.face === intent.face && a.animalId === animal.id);
	if (intent.kind === "mutateTrait") return devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id);
	if (intent.kind === "mutatePop") return devActs.some((a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id);
	if (intent.kind === "playPair") {
		if (!intent.first) return animal.ownerId === state.humanId;
		return devActs.some((a) => a.type === "devPlayPair" && a.a === intent.first && a.b === animal.id);
	}
	if (state.phase !== "feeding") return false;
	if (intent.kind === "hunt" && intent.carnivoreId) {
		const car = findAnimal(state, intent.carnivoreId);
		return Boolean(car && (state.rageTurn ? canRageAttack(state, car, animal) : canAttack(state, car, animal)));
	}
	if (intent.kind === "hunt" && !intent.carnivoreId) {
		if (state.rageTurn) return Boolean(state.rageTurn.animalId === animal.id);
		return animal.ownerId === state.humanId && hasTrait(animal, "carnivore");
	}
	if (intent.kind === "pirate" && intent.pirateId) return feedActs.some((a) => a.type === "feedPirate" && a.targetId === animal.id);
	if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && !intent.animalId) return feedActs.some((a) => (a.type === "feedTakePlant" || a.type === "feedTakeFlora" || a.type === "feedTake") && a.animalId === animal.id);
	if ((intent.kind === "takePlant" || intent.kind === "takeFlora") && intent.animalId) return feedActs.some((a) => a.type === "feedTakePlant" && a.animalId === intent.animalId && animal.id === intent.animalId) || feedActs.some((a) => a.type === "feedTakeFlora" && a.animalId === intent.animalId && animal.id === intent.animalId);
	if (intent.kind === "shelter" && !intent.animalId) return feedActs.some((a) => a.type === "feedShelter" && a.animalId === animal.id);
	if (intent.kind === "plantAttack" && intent.plantId) {
		const plant = state.plants?.find((p) => p.id === intent.plantId);
		return Boolean(plant && canPlantAttackTarget(state, plant, animal));
	}
	if (intent.kind === "plantAttack" && !intent.plantId) return false;
	if (intent.kind === "graze" && !intent.animalId) return feedActs.some((a) => a.type === "feedGraze" && a.animalId === animal.id);
	if (intent.kind === "take" || intent.kind === "none") return feedActs.some((a) => a.type === "feedTake" && a.animalId === animal.id);
	if (intent.kind === "hibernate") return feedActs.some((a) => a.type === "feedHibernate" && a.animalId === animal.id);
	if (intent.kind === "fat") return feedActs.some((a) => a.type === "feedConvertFat" && a.animalId === animal.id);
	if (intent.kind === "graze") return feedActs.some((a) => a.type === "feedGraze" && a.animalId === animal.id);
	return false;
}
/** Табло игрока со его животными; парные карты кладутся между животными. */
var PlayerSection = (0, import_react.memo)(function PlayerSection({ p, isHuman, actorId, thinking, interactions, dying, freshSince, continents, style }) {
	const dispatch = useGameStore((s) => s.dispatch);
	const intent = useGameStore((s) => s.intent);
	const randomMutations = useGameStore((s) => Boolean(s.state?.modules.randomMutations));
	const gameState = useGameStore((s) => s.state);
	const score = gameState && gameState.phase !== "gameOver" ? liveScore(gameState, p.id) : null;
	const [dragId, setDragId] = (0, import_react.useState)(null);
	const [overId, setOverId] = (0, import_react.useState)(null);
	const dragIdRef = (0, import_react.useRef)(null);
	const active = actorId === p.id;
	/** Карта, ожидающая выбора континента (интент «выставить животное»). */
	const placingAnimal = isHuman && active && intent.kind === "placeAnimal" ? intent.cardId : void 0;
	/**
	* Разметка пар этого табло. У животного бывает две пары плюс симбионт,
	* поэтому каждая парная карта получает свой цвет (по порядку выкладывания),
	* а подпись говорит, кто напарник: у симбиоза — кто именно симбионт.
	*/
	const pairs = (0, import_react.useMemo)(() => {
		const numberOf = /* @__PURE__ */ new Map();
		p.animals.forEach((a, i) => numberOf.set(a.id, i + 1));
		const links = p.animals.flatMap((a) => a.traits.filter((t) => t.pairWith).map((t) => ({
			owner: a,
			t
		}))).sort((x, y) => x.t.playSeq - y.t.playSeq || x.t.id.localeCompare(y.t.id));
		const colorOf = /* @__PURE__ */ new Map();
		for (const { t } of links) if (!colorOf.has(t.cardId)) colorOf.set(t.cardId, PAIR_COLORS[colorOf.size % PAIR_COLORS.length]);
		const marks = {};
		/** Подпись плашки по id карты пары: «№1 ↔ №2», «симбионт — №1». */
		const plateNote = /* @__PURE__ */ new Map();
		for (const { t } of links) {
			const color = colorOf.get(t.cardId);
			const partnerNo = numberOf.get(t.pairWith);
			const partner = partnerNo ? `№${partnerNo}` : "напарник";
			if (t.type === "symbiosis") marks[t.id] = {
				color,
				note: t.pairRole === "a" ? `симбионт для ${partner}` : `симбионт — ${partner}`
			};
			else marks[t.id] = {
				color,
				note: `с ${partner}`
			};
		}
		for (const { owner, t } of links) {
			if (t.pairRole !== "a") continue;
			const selfNo = numberOf.get(owner.id);
			const partnerNo = numberOf.get(t.pairWith);
			const self = selfNo ? `№${selfNo}` : "?";
			const partner = partnerNo ? `№${partnerNo}` : "?";
			plateNote.set(t.cardId, t.type === "symbiosis" ? `симбионт ${self} → ${partner}` : `${self} ↔ ${partner}`);
		}
		return {
			colorOf,
			marks,
			plateNote,
			numberOf
		};
	}, [p.animals]);
	const cardProps = (a) => ({
		draggable: isHuman,
		dropTarget: isHuman && dragId !== null && overId === a.id && dragId !== a.id,
		onDragStartCard: isHuman ? (e) => {
			setDragId(a.id);
			dragIdRef.current = a.id;
			e.dataTransfer.setData("text/plain", a.id);
			e.dataTransfer.effectAllowed = "move";
		} : void 0,
		onDragOverCard: isHuman ? (e) => {
			if (dragId && dragId !== a.id) {
				e.preventDefault();
				setOverId(a.id);
			}
		} : void 0,
		onDropCard: isHuman ? () => {
			if (dragId && dragId !== a.id) dispatch({
				type: "reorderAnimal",
				animalId: dragId,
				beforeId: a.id
			});
			setDragId(null);
			setOverId(null);
		} : void 0,
		onDragEndCard: isHuman ? () => {
			setDragId(null);
			setOverId(null);
		} : void 0
	});
	const renderCard = (a, no) => {
		const it = interactions(a);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimalCard, {
			animal: a,
			no,
			pairMarks: pairs.marks,
			selected: it.selected,
			highlight: it.highlight,
			danger: it.danger,
			dimmed: it.dimmed,
			dying: dying.has(a.id),
			freshSince,
			...isHuman ? cardProps(a) : {}
		}, a.id);
	};
	const rows = [];
	if (p.animals.length === 0) rows.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-subtle",
		children: isHuman ? "Выложите животное из руки" : "Нет животных"
	}, "empty"));
	else {
		const linkBetween = (x, y) => x.traits.find((t) => t.pairWith === y.id) ?? y.traits.find((t) => t.pairWith === x.id);
		let i = 0;
		while (i < p.animals.length) {
			const first = p.animals[i];
			const items = [renderCard(first, i + 1)];
			while (i + 1 < p.animals.length) {
				const cur = p.animals[i];
				const next = p.animals[i + 1];
				const link = linkBetween(cur, next);
				if (!link) break;
				items.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairPlate, {
					type: link.type,
					color: pairs.colorOf.get(link.cardId),
					note: pairs.plateNote.get(link.cardId)
				}, `pair-${link.cardId}`));
				items.push(renderCard(next, i + 2));
				i += 1;
			}
			if (items.length === 1) rows.push(items[0]);
			else rows.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-stretch",
				children: items
			}, `pair-group-${first.id}`));
			i += 1;
		}
	}
	const dropRow = isHuman ? {
		onDragOver: (e) => {
			if (dragId) e.preventDefault();
		},
		onDrop: () => {
			if (dragId) dispatch({
				type: "reorderAnimal",
				animalId: dragId
			});
			setDragId(null);
			setOverId(null);
		}
	} : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		style,
		"data-player-section": p.id,
		className: cn("paper-sheet mb-3 rounded-[var(--radius-lg)] border bg-surface p-3 transition-[border-color,box-shadow] duration-[var(--motion-quick)] lg:mb-0", active ? "border-accent/70 shadow-[0_0_0_1px_var(--color-accent),var(--shadow-card)]" : "border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2 font-medium",
				children: [isHuman ? "Ваша популяция" : p.name, active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex items-center gap-1 text-xs", thinking ? "text-accent" : "text-accent"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full bg-accent", thinking && "pulse-dot") }), thinking ? "думает…" : "ходит"]
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 text-xs text-muted",
				children: [
					randomMutations ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: MUTATION_ART.deckBack,
						alt: "",
						loading: "lazy",
						title: `Слепая колода: ${p.blindDeckCount ?? p.blindDeck?.length ?? 0}`,
						className: "h-5 w-3.5 rounded-[2px] border border-border object-cover"
					}) : null,
					randomMutations ? `колода ${p.blindDeckCount ?? p.blindDeck?.length ?? 0}` : `рука ${p.handCount ?? p.hand.length}`,
					" ",
					"· сброс ",
					p.discardCount,
					score !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · счёт ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: "Текущие очки: 2 за каждое животное вида + по очку за свойство и его бонус",
						className: "font-display tabular-nums text-fg",
						children: score
					})] }) : null
				]
			})]
		}), continents ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: TERRITORIES.map((t) => {
				const animals = p.animals.filter((a) => (a.zoneId ?? "laurasia") === t.id);
				const pickable = isHuman && placingAnimal !== void 0 && t.id !== "ocean" && active;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TerritoryRow, {
					zone: t.id,
					name: t.name,
					count: animals.length,
					tall: placingAnimal !== void 0 || animals.length > 0,
					pickable,
					onPickZone: pickable ? () => dispatch({
						type: "devPlayAnimal",
						cardId: placingAnimal,
						zoneId: t.id
					}) : void 0,
					dropHint: isHuman,
					onDropZone: isHuman && dragIdRef.current ? () => dispatch({
						type: "reorderAnimal",
						animalId: dragIdRef.current,
						toZoneId: t.id
					}) : void 0,
					children: [animals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-1 text-[11px] text-subtle",
						children: t.id === "ocean" ? "пусто (нужна водоплавающая)" : "пусто"
					}) : null, animals.map((a) => renderCard(a, pairs.numberOf.get(a.id) ?? 1))]
				}, t.id);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-stretch gap-2",
			...dropRow,
			children: rows
		})]
	});
});
/** Полоса одной территории в табло игрока («Континенты»). */
function TerritoryRow({ zone, name, count, children, dropHint, onDropZone, tall, pickable, onPickZone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-zone": zone,
		role: pickable ? "button" : void 0,
		"aria-label": pickable ? `Разместить на ${name}` : void 0,
		onClick: pickable ? onPickZone : void 0,
		onKeyDown: pickable ? (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onPickZone?.();
			}
		} : void 0,
		tabIndex: pickable ? 0 : void 0,
		onDragOver: dropHint ? (e) => e.preventDefault() : void 0,
		onDrop: onDropZone,
		className: cn("relative flex flex-wrap items-stretch gap-2 rounded-[var(--radius-md)] border border-dashed px-2 transition-all duration-[var(--motion-quick)]", zone === "ocean" && "water-strip", tall ? "min-h-[188px] py-2" : "min-h-[52px] py-2", zone === "ocean" ? "border-water/40 bg-water/10" : "border-border-strong/25 bg-bg/40", pickable && "cursor-pointer border-solid border-accent ring-2 ring-accent/50 hover:bg-accent/15"),
		children: [
			pickable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs font-medium text-accent",
				children: [
					"нажмите, чтобы разместить на «",
					name,
					"»"
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: TERRITORY_ART[zone],
				alt: "",
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 h-full w-full rounded-[var(--radius-md)] object-cover opacity-[0.08]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute -top-1.5 left-2 z-10 rounded-full border border-border bg-surface px-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-muted",
				children: [
					name,
					" · ",
					count
				]
			}),
			children
		]
	});
}
/** Центральное поле: кубики кормовой базы, банк еды, индикатор года и фазы. */
function CenterField({ year, lastYear, phase, bank, territoryFood, deckLeft, foodRoll, lastLog, actorName, deaths, plantsInfo, floraInfo, style }) {
	const plantsSolo = Boolean(plantsInfo) && !territoryFood;
	const floraSolo = Boolean(floraInfo) && !territoryFood;
	const tableSolo = plantsSolo || floraSolo;
	const showDice = (phase === "foodBank" || phase === "feeding") && !tableSolo;
	const diceKey = foodRoll ? foodRoll.join("-") : "pending";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		style,
		className: "felt grain relative order-first flex min-h-[150px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[26px] border border-border p-4 text-fg shadow-[inset_0_0_60px_rgba(0,0,0,.45),var(--shadow-card)] lg:order-none lg:min-h-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: BG.bankBowl,
				alt: "",
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.13]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center gap-2 rounded-full border border-border-strong/60 bg-bg/55 px-3.5 py-1 text-xs backdrop-blur-sm",
				children: [
					PHASE_ICON[phase] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: PHASE_ICON[phase],
						alt: "",
						className: "size-4 rounded-[4px]"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display tracking-wide",
						children: ["Год ", year]
					}),
					lastYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-clay",
						children: "последний"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PHASE_LABEL[phase] ?? phase }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-muted",
						children: ["колода ", deckLeft]
					})
				]
			}),
			showDice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiceTray, { roll: foodRoll }, diceKey) : null,
			phase === "growth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-leaf/60 bg-leaf/15 px-4 py-1.5 text-sm font-medium text-leaf",
				children: "Рост: растения разрастаются"
			}) : phase === "extinction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-danger/60 bg-danger/15 px-4 py-1.5 text-sm font-medium text-clay",
				children: ["Вымирание: погибает ", deaths === 0 ? "никто" : `животных: ${deaths}`]
			}) : tableSolo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col items-center gap-1",
				title: "Еда этого года лежит на столе — берите фишки с растений и карт флоры",
				children: [plantsSolo && plantsInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1",
					title: "Еда этого года лежит на растениях — берите фишки с них",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [Array.from({ length: Math.min(plantsInfo.food, 18) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
								tone: "green",
								className: "token-pop size-3.5"
							}, i)), plantsInfo.food > 18 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] tabular-nums text-muted",
								children: ["+", plantsInfo.food - 18]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl tabular-nums leading-none",
							children: plantsInfo.food
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted",
							children: [
								"фишек на ",
								plantsInfo.count,
								" растениях · убежищ ",
								plantsInfo.shelters
							]
						})
					]
				}) : null, floraSolo && floraInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1",
					title: "Еда этого года — на травах и грибах",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [Array.from({ length: Math.min(floraInfo.food, 18) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
								tone: "red",
								className: "token-pop size-3.5"
							}, i)), floraInfo.food > 18 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] tabular-nums text-muted",
								children: ["+", floraInfo.food - 18]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl tabular-nums leading-none",
							children: floraInfo.food
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted",
							children: [
								"фишек на ",
								floraInfo.count,
								" травах и грибах"
							]
						})
					]
				}) : null]
			}) : territoryFood && !plantsInfo && !floraInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerritoryBanks, {
				banks: territoryFood,
				active: phase === "feeding"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankPile, {
				count: bank,
				active: phase === "feeding",
				oceanOnly: Boolean(plantsInfo || floraInfo)
			}),
			actorName && (phase === "feeding" || phase === "development") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "relative text-xs text-accent",
				children: ["Ход: ", actorName]
			}) : null,
			lastLog ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative max-w-md text-center text-[11px] leading-snug text-muted",
				children: lastLog
			}) : null
		]
	});
}
/** Три банка «Континентов»: Лавразия / Гондвана / Океан — в один ряд. */
function TerritoryBanks({ banks, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative grid w-full max-w-sm grid-cols-3 gap-2",
		children: TERRITORIES.map((t) => {
			const n = banks[t.id] ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				title: `Кормовая база «${t.name}»`,
				className: cn("flex flex-col items-center gap-1 rounded-[var(--radius-md)] border px-2 py-1.5", t.id === "ocean" ? "border-water/50 bg-water/15" : "border-border bg-bg/45"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: TERRITORY_ART[t.id],
						alt: "",
						"aria-hidden": true,
						className: "size-14 shrink-0 rounded-[var(--radius-sm)] border border-ink/20 object-cover shadow-[var(--shadow-card)]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							Array.from({ length: Math.min(n, 6) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
								tone: "red",
								className: "token-pop size-3"
							}, `${i}-${n}`)),
							n > 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] tabular-nums text-muted",
								children: ["+", n - 6]
							}) : null,
							n === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-subtle",
								children: active ? "пусто" : "—"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg leading-none tabular-nums",
						children: n
					})
				]
			}, t.id);
		})
	});
}
function BankPile({ count, active, oceanOnly }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex flex-col items-center gap-1.5",
		title: active ? oceanOnly ? "Кормовая база Океана — на континентах еда на растениях" : "Фишки кормовой базы — берите по одной в свой ход питания" : "Кормовая база",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex max-w-[260px] flex-wrap items-center justify-center gap-1",
				children: [count === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-subtle",
					children: active ? oceanOnly ? "океан пуст" : "база пуста" : "—"
				}) : Array.from({ length: Math.min(count, 24) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: "red",
					className: "token-pop size-4"
				}, `${i}-${count}`)), count > 24 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-1 text-xs tabular-nums text-muted",
					children: ["+", count - 24]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-xl tabular-nums leading-none",
				children: count
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-[0.18em] text-muted",
				children: oceanOnly ? "кормовая база океана" : "кормовая база"
			})
		]
	});
}
/**
* Кубики кормовой базы: физические 3D-кости (cannon-es) падают, сталкиваются
* и сваливаются в кучку (~0.8 с), затем перекатываются выпавшими гранями
* (~0.45 с). Итог появляется, когда кучка улеглась. Компонент перемонтируется
* только со новым броском (ключ — значения кубиков).
*/
function DiceTray({ roll }) {
	const [rolling, setRolling] = (0, import_react.useState)(Boolean(roll));
	const rollId = roll?.join(",") ?? "";
	const timer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!rollId) return;
		setRolling(true);
		timer.current = setTimeout(() => setRolling(false), 1300);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [rollId]);
	if (!roll) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice3D, {
			values: [null, null],
			rolling: true,
			dieSize: 44
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs uppercase tracking-[0.18em] text-muted",
			children: "бросок…"
		})]
	});
	const total = roll.reduce((s, d) => s + d, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice3D, {
			values: roll,
			rolling,
			dieSize: 44,
			ariaLabel: `Кубики кормовой базы: ${roll.join(", ")}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-display text-2xl leading-none tabular-nums", !rolling && "pop-in"),
				children: rolling ? "…" : total
			}), !rolling ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 text-[10px] uppercase tracking-[0.18em] text-good",
				children: "кормовая база"
			}) : null]
		})]
	});
}
function FoodBankChip({ count, visible }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-food-bank": "",
		className: "hidden items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5 sm:flex",
		title: "Кормовая база",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-wider text-muted",
			children: "База"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-lg tabular-nums leading-none",
			children: visible ? count : "—"
		})]
	});
}
/**
* Реакции стола: панель из пяти эмодзи (игрок или зритель) и всплывающие
* пузыри по реакциям из сети. 👏 — «поощрение»: заметнее и со своим звуком.
*/
/**
* Высота нижнего дока: панель реакций держится ровно над ним, а не поверх
* кнопок. Док на телефоне переносится на несколько строк, поэтому высоту
* измеряем и слушаем ResizeObserver. На широких экранах футер включает руку
* карт (высотой во весь низ), там панель остаётся на фиксированном отступе,
* иначе она всплыла бы поверх композера журнала.
*/
function useFooterOffset() {
	const [offset, setOffset] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(max-width: 639px)");
		const footer = document.querySelector("footer");
		if (!footer) return;
		const measure = () => setOffset(mq.matches ? Math.round(footer.getBoundingClientRect().height) : 0);
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(footer);
		window.addEventListener("resize", measure);
		mq.addEventListener("change", measure);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", measure);
			mq.removeEventListener("change", measure);
		};
	}, []);
	return offset;
}
function ReactionsLayer({ net }) {
	const sendReaction = useGameStore((s) => s.sendReaction);
	const [bubbles, setBubbles] = (0, import_react.useState)([]);
	const seenRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const counter = (0, import_react.useRef)(0);
	const footerOffset = useFooterOffset();
	const panelStyle = footerOffset ? { bottom: footerOffset + 8 } : void 0;
	const bubblesStyle = footerOffset ? { bottom: footerOffset + 60 } : void 0;
	(0, import_react.useEffect)(() => {
		const fresh = net.reactions.filter((r) => !seenRef.current.has(r.id));
		if (!fresh.length) return;
		for (const r of fresh) seenRef.current.add(r.id);
		const added = fresh.map((r) => {
			counter.current += 1;
			return {
				key: counter.current,
				emoji: r.emoji,
				name: r.name,
				cheer: r.kind === "cheer"
			};
		});
		setBubbles((prev) => [...prev, ...added].slice(-8));
		sfx.play(fresh.some((r) => r.kind === "cheer") ? "cheer" : "reaction");
		const timer = window.setTimeout(() => {
			setBubbles((prev) => prev.filter((b) => !added.some((a) => a.key === b.key)));
		}, 2600);
		return () => window.clearTimeout(timer);
	}, [net.reactions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		style: bubblesStyle,
		className: "pointer-events-none fixed bottom-[132px] right-3 z-50 flex w-44 flex-col items-end gap-1 sm:right-4",
		children: bubbles.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("reaction-bubble flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs shadow-[var(--shadow-card)]", b.cheer ? "border-accent/70 bg-accent/20 font-medium text-fg" : "border-border bg-surface/95 text-muted"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-base leading-none",
				children: b.emoji
			}), b.name]
		}, b.key))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"aria-label": "Реакции",
		style: panelStyle,
		className: "fixed bottom-[84px] right-3 z-40 flex flex-row gap-0.5 rounded-full border border-border bg-surface/95 p-1 shadow-[var(--shadow-card)] backdrop-blur-sm sm:right-4 sm:gap-1",
		children: REACTION_EMOJI.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": `Реакция ${emoji}`,
			title: emoji === "👏" ? "Поощрить игроков" : `Реакция ${emoji}`,
			className: "grid size-8 place-items-center rounded-full text-lg leading-none transition-transform duration-[var(--motion-fast)] hover:scale-110 hover:bg-surface-2",
			onClick: (e) => {
				e.currentTarget.blur();
				sendReaction(emoji, emoji === "👏" ? "cheer" : "reaction");
			},
			children: emoji
		}, emoji))
	})] });
}
/**
* «Отменить действие» — только соло: стор хранит снимки решений человека.
* В сети откат невозможен (сервер авторитетен), там canUndo всегда false и
* кнопка просто не рендерится. На узких экранах остаётся иконка с aria-label.
*/
function UndoButton({ onUndo, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		size: "sm",
		className,
		"aria-label": "Отменить действие",
		title: "Отменить последнее действие (только соло)",
		onClick: onUndo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: "Отменить действие"
		})]
	});
}
/**
* Док фазы развития «Случайных мутаций»: карты в слепой колоде — игрок
* сначала объявляет способ розыгрыша, потом движок вскрывает верхнюю карту.
*/
function MutateDock({ human, intent, disabled, continents, canPlant, canUndo, onNewAnimal, onTrait, onPop, onPlant, onPass, onCancel, onUndo }) {
	const left = human.blindDeck?.length ?? human.blindDeckCount ?? 0;
	const mutating = intent.kind === "mutateTrait" || intent.kind === "mutatePop" || intent.kind === "mutatePlant";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		onClick: dockClickSfx,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex min-w-0 items-center gap-1.5 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: MUTATION_ART.icon,
					alt: "",
					loading: "lazy",
					className: "size-4 shrink-0 rounded-full object-cover"
				}), disabled ? "Ход соперника" : mutating ? intent.kind === "mutateTrait" ? "Выберите свой вид из одного животного — карта вскроется на нём" : intent.kind === "mutatePop" ? "Выберите вид — карта станет +1 животным" : "Выберите растение — карта вскроется свойством на нём" : "Объявите розыгрыш верхней карты колоды — потом она вскроется"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				title: `Слепая колода: ${left}`,
				"aria-label": `Колода: ${left}`,
				className: "flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface p-1 pr-2.5 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: MUTATION_ART.deckBack,
					alt: "",
					loading: "lazy",
					className: "h-6 w-4 rounded-[2px] border border-border object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-sm tabular-nums leading-none",
					children: left
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-hand-row": true,
			className: "flex flex-wrap items-stretch gap-2",
			children: [
				continents ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: () => onNewAnimal("laurasia"),
					className: "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: "Новый вид · Лавразия"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: "карта ляжет животным"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: () => onNewAnimal("gondwana"),
					className: "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: "Новый вид · Гондвана"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: "карта ляжет животным"
					})]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: () => onNewAnimal(),
					className: "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: "Новый вид"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: "карта ляжет животным"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: onTrait,
					className: cn("flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50", intent.kind === "mutateTrait" ? "border-accent bg-accent/15 text-fg" : "border-border bg-surface-2 text-fg hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: "Свойство"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: "на вид из одного животного"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: onPop,
					className: cn("flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50", intent.kind === "mutatePop" ? "border-accent bg-accent/15 text-fg" : "border-border bg-surface-2 text-fg hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: "+1 животное виду"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: "численность ≤ числа видов"
					})]
				}),
				canPlant ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: onPlant,
					className: cn("flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50", intent.kind === "mutatePlant" ? "border-leaf bg-leaf/15 text-fg" : "border-border bg-surface-2 text-fg hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: "Свойство растения"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: "если в колоде есть такая грань"
					})]
				}) : null,
				mutating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onCancel,
					title: "Отменить выбор (Esc)",
					children: "Отмена"
				}) : null,
				canUndo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UndoButton, { onUndo }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "md",
					disabled,
					onClick: (e) => {
						e.currentTarget.blur();
						onPass();
					},
					title: "Пас: пропустить развитие до конца раунда",
					children: "Пас"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "md",
					disabled,
					onClick: (e) => {
						e.currentTarget.blur();
						onPass();
					},
					title: "Закончить развитие: ваш ход в этом раунде завершён",
					children: "Закончить развитие"
				})
			]
		})]
	});
}
function DevDock({ human, intent, disabled, continents, freshIds, canUndo, onPlayAnimal, onPlaceAnimal, onPickTrait, onPass, onCancel, onUndo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		onClick: dockClickSfx,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: disabled ? "Ход соперника — карты остаются у вас" : intent.kind === "placeAnimal" ? "Выберите территорию на столе — животное разместится туда" : intent.kind === "playPlantTrait" ? intent.kind === "playPlantTrait" && "cardId" in intent ? "Выберите растение для свойства" : "" : intent.kind === "playPlantPair" && !("first" in intent && intent.first) ? "Микориза: выберите первое растение" : intent.kind === "playPlantPair" ? "Второе растение микоризы" : intent.kind === "playTrait" ? "Выберите животное для свойства" : intent.kind === "playPair" && !("first" in intent && intent.first) ? "Парное свойство: выберите первое животное" : intent.kind === "playPair" ? "Второе животное пары" : continents ? "Карта как животное (затем клик по континенту) или свойство" : "Карта как животное или свойство"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 gap-1",
				children: [
					canUndo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UndoButton, { onUndo }) : null,
					intent.kind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onCancel,
						title: "Отменить выбор (Esc)",
						children: "Отмена"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "md",
						disabled,
						onClick: (e) => {
							e.currentTarget.blur();
							onPass();
						},
						title: "Пас: пропустить развитие до конца раунда",
						children: "Пас"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "md",
						disabled,
						onClick: (e) => {
							e.currentTarget.blur();
							onPass();
						},
						title: "Закончить развитие: ваш ход в этом раунде завершён",
						children: "Закончить развитие"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-hand-row": true,
			className: "flex gap-2 overflow-x-auto pb-1",
			children: human.hand.map((card, i) => {
				const fresh = freshIds?.has(card.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: fresh ? "hand-card-in" : void 0,
					style: fresh ? { animationDelay: `${Math.min(i, 8) * 70}ms` } : void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCard, {
						card,
						disabled,
						selected: intent.kind !== "none" && "cardId" in intent && intent.cardId === card.id || intent.kind === "placeAnimal" && intent.cardId === card.id,
						selectedFace: "face" in intent && intent.cardId === card.id ? intent.face : null,
						onSelect: (face) => {
							if (face === "animal" && continents && onPlaceAnimal) onPlaceAnimal(card.id);
							else if (face === "animal") onPlayAnimal(card.id);
							else onPickTrait(card.id, face);
						}
					})
				}, card.id);
			})
		})]
	});
}
/**
* Серая кнопка действия, недоступного в этот ход. Причина из feedBlockReason
* вешается на обёртку: у disabled-кнопок отключены указатели мыши, поэтому
* title на самой кнопке не показался бы. aria-label дублирует причину.
*/
function BlockedButton({ label, reason }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		title: reason,
		className: "inline-flex",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			size: "sm",
			disabled: true,
			"aria-label": `${label}: ${reason}`,
			children: label
		})
	});
}
/** Что сейчас выбирает игрок — подсказка рядом с кнопками дока. */
var INTENT_HINT = {
	take: "Выберите животное — оно возьмёт фишку еды",
	takePlant: "Выберите животное, затем растение с едой",
	takeFlora: "Выберите животное, затем карту флоры",
	shelter: "Выберите животное, затем растение для убежища",
	hunt: "Выберите хищника, затем жертву — цели отмечены красным",
	pirate: "Выберите пирата, затем жертву — цели отмечены красным",
	plantAttack: "Выберите хищное растение, затем жертву",
	parasitize: "Выберите растение-паразит, затем хозяина",
	hibernate: "Выберите животное, которое уйдёт в спячку до конца года",
	fat: "Выберите животное с жировым запасом",
	graze: "Выберите животное для выпаса на растении"
};
function FeedDock({ human, acts, intentKind, bank, continents, rageTurn, blocked, onIntent, onEndTurn, onSkip }) {
	const dispatch = useGameStore((s) => s.dispatch);
	const [confirmSkip, setConfirmSkip] = (0, import_react.useState)(false);
	const hungry = (0, import_react.useMemo)(() => human.animals.reduce((n, a) => {
		if (isFed(a, true)) return n;
		const pop = a.population ?? 1;
		const need = foodNeeded(a, true);
		const fed = need > 0 ? Math.min(pop, Math.floor(a.food / need)) : 0;
		return n + Math.max(0, pop - fed);
	}, 0), [human.animals]);
	const takes = acts.filter((a) => a.type === "feedTake");
	const plantTakes = acts.filter((a) => a.type === "feedTakePlant");
	const floraTakes = acts.filter((a) => a.type === "feedTakeFlora");
	const foodActs = [
		...takes,
		...plantTakes,
		...floraTakes
	];
	const shelters = acts.filter((a) => a.type === "feedShelter");
	const plantAttacks = acts.filter((a) => a.type === "feedPlantAttack");
	const parasitizes = acts.filter((a) => a.type === "feedParasitize");
	const canHunt = acts.some((a) => a.type === "feedHunt");
	const canPirate = acts.some((a) => a.type === "feedPirate");
	const sleeps = acts.filter((a) => a.type === "feedHibernate");
	const fats = acts.filter((a) => a.type === "feedConvertFat");
	const grazes = acts.filter((a) => a.type === "feedGraze");
	const migrations = acts.filter((a) => a.type === "feedMigrate");
	const canSkip = acts.some((a) => a.type === "feedSkip");
	const canSkipHint = !canSkip && (shelters.length > 0 || plantTakes.length > 0 || floraTakes.length > 0);
	if (rageTurn) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		onClick: dockClickSfx,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full border border-danger/60 bg-danger/15 px-3 py-1 text-xs font-medium text-clay",
				children: "Бешенство: животное обязано атаковать — выберите жертву"
			}),
			canHunt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "danger",
				size: "sm",
				onClick: () => onIntent({ kind: "hunt" }),
				children: "Атака бешеного"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				children: "Допустимой жертвы нет — заканчивайте ход"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "md",
				onClick: (e) => {
					e.currentTarget.blur();
					onEndTurn();
				},
				children: "Закончить ход"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		onClick: dockClickSfx,
		children: [
			bank > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mr-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs tabular-nums text-muted",
				children: [
					continents ? "Океан" : "Кормовая база",
					":",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm text-fg",
						children: bank
					})
				]
			}) : null,
			foodActs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "take" || intentKind === "takePlant" || intentKind === "takeFlora" || intentKind === "none" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => {
					if (foodActs.length === 1) dispatch(foodActs[0]);
					else onIntent({ kind: plantTakes.length || floraTakes.length ? floraTakes.length && !plantTakes.length ? "takeFlora" : "takePlant" : "take" });
				},
				children: "Взять еду"
			}) : blocked?.take ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: "Взять еду",
				reason: blocked.take
			}) : null,
			shelters.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "shelter" ? "parchment" : "secondary",
				size: "sm",
				title: "Занять убежище растения: защита от хищников до конца фазы питания",
				onClick: () => {
					if (shelters.length === 1) dispatch(shelters[0]);
					else onIntent({ kind: "shelter" });
				},
				children: "Убежище"
			}) : null,
			plantAttacks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "plantAttack" ? "danger" : "secondary",
				size: "sm",
				title: "Направить хищное растение на жертву (раз за фазу)",
				onClick: () => {
					if (plantAttacks.length === 1) dispatch(plantAttacks[0]);
					else onIntent({ kind: "plantAttack" });
				},
				children: "Хищное растение"
			}) : null,
			parasitizes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "parasitize" ? "parchment" : "secondary",
				size: "sm",
				title: "Перекинуть фишку с растения-хозяина на растение-паразит",
				onClick: () => {
					if (parasitizes.length === 1) dispatch(parasitizes[0]);
					else onIntent({ kind: "parasitize" });
				},
				children: "На паразита"
			}) : null,
			canHunt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "hunt" ? "danger" : "secondary",
				size: "sm",
				onClick: () => onIntent({ kind: "hunt" }),
				children: "Охота"
			}) : blocked?.hunt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: "Охота",
				reason: blocked.hunt
			}) : null,
			canPirate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "pirate" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => onIntent({ kind: "pirate" }),
				children: "Пиратство"
			}) : blocked?.pirate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: "Пиратство",
				reason: blocked.pirate
			}) : null,
			sleeps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "hibernate" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => {
					if (sleeps.length === 1) dispatch(sleeps[0]);
					else onIntent({ kind: "hibernate" });
				},
				children: "Спячка"
			}) : blocked?.sleep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: "Спячка",
				reason: blocked.sleep
			}) : null,
			fats.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "fat" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => {
					if (fats.length === 1) dispatch(fats[0]);
					else onIntent({ kind: "fat" });
				},
				children: "Жир"
			}) : null,
			grazes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "graze" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => {
					if (grazes.length === 1) dispatch(grazes[0]);
					else onIntent({ kind: "graze" });
				},
				children: "Топтун"
			}) : null,
			migrations.length ? migrations.length === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: () => dispatch(migrations[0]),
				children: "Миграция"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1",
				children: migrations.map((m, i) => {
					const target = m.moves[0].to;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => dispatch(m),
						className: "rounded-[var(--radius-xs)] px-2 py-1 text-xs font-medium text-fg hover:bg-ink/10",
						children: target === "laurasia" ? "↑ Лавразия" : target === "gondwana" ? "↓ Гондвана" : "≈ Океан"
					}, i);
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "md",
				onClick: (e) => {
					e.currentTarget.blur();
					onEndTurn();
				},
				children: "Закончить ход"
			}),
			intentKind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => onIntent({ kind: "none" }),
				title: "Отменить выбор (Esc)",
				children: "Отмена"
			}) : null,
			intentKind !== "none" && INTENT_HINT[intentKind] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintNote, {
				compact: true,
				className: "basis-full sm:ml-auto sm:max-w-64",
				children: INTENT_HINT[intentKind]
			}) : null,
			canSkip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "md",
				onClick: (e) => {
					e.currentTarget.blur();
					if (hungry > 0) {
						sfx.play("modal");
						setConfirmSkip(true);
					} else onSkip();
				},
				title: hungry > 0 ? `Пас: не накормлено животных — ${hungry}` : "Пас до конца фазы питания",
				children: "Пас"
			}) : canSkipHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				title: "Пока хотя бы одно ваше животное способно получить еду или убежище, пасовать нельзя (правила «Растений»)",
				children: "Пас недоступен — есть доступная еда или убежища"
			}) : null,
			confirmSkip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: "Пасовать до конца питания?",
				body: `Не накормлено ${hungry} ${hungry === 1 ? "животное" : "животных"}. В фазе вымирания они погибнут.`,
				confirmLabel: "Пасовать",
				cancelLabel: "Вернуться к ходу",
				tone: "danger",
				onConfirm: () => {
					sfx.play("modal");
					setConfirmSkip(false);
					onSkip();
				},
				onClose: () => {
					sfx.play("modal");
					setConfirmSkip(false);
				}
			}) : null
		]
	});
}
function DefenseDock({ acts, onPick }) {
	const state = useGameStore((s) => s.state);
	const atk = state.pendingAttack;
	const prey = findAnimal(state, atk.preyId);
	const running = acts.find((a) => a.type === "chooseDefense" && a.kind === "running");
	const none = acts.find((a) => a.type === "chooseDefense" && a.kind === "none");
	const mimics = acts.filter((a) => a.type === "chooseDefense" && a.kind === "mimicry");
	const tails = acts.filter((a) => a.type === "chooseDefense" && a.kind === "tailLoss");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-3 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Нападение хищника"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Нужно ",
						prey ? foodNeeded(prey) : "—",
						" еды, сейчас ",
						prey?.food ?? 0,
						". Выберите защиту."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2",
					children: [
						running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => onPick(running),
							children: "Быстрое — бросок кубика"
						}) : null,
						mimics.map((a) => a.type === "chooseDefense" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => onPick(a),
							children: "Мимикрия на другое животное"
						}, a.mimicryTargetId) : null),
						tails.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => onPick(a),
							children: "Отбросить хвост"
						}, a.discardTraitId)),
						none ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => onPick(none),
							children: "Не защищаться"
						}) : null
					]
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
