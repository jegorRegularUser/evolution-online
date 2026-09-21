import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as pointerWithin, c as useDroppable, d as require_react_dom, i as TouchSensor, l as useSensor, n as DragOverlay, o as rectIntersection, r as MouseSensor, s as useDraggable, t as DndContext, u as useSensors } from "../_libs/@dnd-kit/core+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, n as createMiddleware, r as createServerFn } from "./ssr.mjs";
import { a as MUTATIONS_TRAIT_IDS, c as TERRITORIES, i as MARKS, l as TRAITS, n as FLORA, o as PLANTS, r as FUNGI_TRAIT_IDS, s as PLANTS_TRAIT_IDS, t as CONTINENTS_TRAIT_IDS, u as TRAIT_ORDER } from "./types-BR4PMx1a.mjs";
import { A as kickWaiterInput, B as reactionInput, C as foodNeeded, D as isFed, E as isCarnivoreLike, F as liveScore, G as setRoomPrivacyInput, H as setColorInput, I as moduleCompatibilityError, J as spectateInput, K as settingsInput, M as legalDevActions, N as legalFeedActions, O as joinRoomInput, P as listRoomsInput, R as player, S as findAnimal, T as hasTrait, U as setNameInput, V as roomInfoInput, W as setPasswordInput, X as transferHostInput, Y as spectatorPollInput, Z as typingInput, a as REACTION_EMOJI, b as deckSizeFor, d as canPlantAttackTarget, f as canRageAttack, g as colorForSeat, h as codeTokenInput, i as PLAYER_COLORS, j as legalDefenseActions, k as kickInput, l as botsInput, m as chatInput, o as actionInput, p as capacityInput, q as speciesNeed, r as PACE, u as canAttack, v as createRoomInput, x as feedBlockReasonInfo, y as currentActor, z as pollInput } from "./module-compatibility-B0RnAr8M.mjs";
import { $ as ArrowDown, A as LockOpen, C as Palette, E as Minimize2, F as GraduationCap, G as ChevronRight, H as Crosshair, J as Check, K as ChevronLeft, M as Lightbulb, N as LayoutGrid, O as LogOut, Q as ArrowLeftRight, S as Pencil, T as Minus, U as Copy, V as Dices, W as Clock, X as Bot, Y as ChartColumn, Z as BookOpen, _ as Send, a as Volume2, b as Plus, c as UserMinus, d as Swords, g as Settings2, i as VolumeX, j as List, k as Lock, m as Skull, o as Volume1, p as SmilePlus, q as ChevronDown, s as Users, t as X, u as TriangleAlert, v as RotateCcw, x as Play, z as Eye } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { C as currentLang, D as readStats, E as emptySession, O as recordGame, S as traitShort, T as ACHIEVEMENTS, _ as plantName, a as t, b as traitDesc, c as useT, d as floraDesc, f as floraName, g as plantDesc, h as markShort, i as pointsWord, l as achievementDesc, m as markName, n as placeLabel, o as translate, p as markDesc, r as playersWord, s as useLang, u as achievementName, v as scientistName, w as toggleLang, x as traitName, y as territoryName } from "./router-CDzmDvQX.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Material, c as Vec3, i as GSSolver, l as World, n as Box, o as Plane, r as ContactMaterial, s as SAPBroadphase, t as Body } from "../_libs/cannon-es.mjs";
import { a as DirectionalLight, c as MeshPhysicalMaterial, d as Quaternion, f as SRGBColorSpace, h as Vector3, i as CanvasTexture, l as OrthographicCamera, m as ShadowMaterial, n as WebGLRenderer, o as HemisphereLight, p as Scene, r as AmbientLight, s as Mesh, t as RoundedBoxGeometry, u as PlaneGeometry } from "../_libs/three.mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cx90BnjJ.js
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
var FOCUSABLE = "a[href], area[href], button, input, select, textarea, iframe, [tabindex], [contenteditable='true']";
function tabStops(panel) {
	return Array.from(panel.querySelectorAll(FOCUSABLE)).filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && !element.closest("[inert], [hidden]") && element.getClientRects().length > 0 && getComputedStyle(element).visibility === "visible").sort((a, b) => (a.tabIndex || Number.MAX_SAFE_INTEGER) - (b.tabIndex || Number.MAX_SAFE_INTEGER));
}
/** Монтируется только на время открытия; Escape остаётся решением экрана. */
function DialogShell({ children, titleId, overlayClassName, panelClassName, initialFocus, returnFocus, onBackdropClick, onEscape }) {
	const panelRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const panel = panelRef.current;
		if (!panel || !panel.getClientRects().length) return;
		const previous = returnFocus?.current ?? document.activeElement;
		const title = document.getElementById(titleId);
		const candidates = [
			initialFocus?.current,
			title,
			tabStops(panel)[0],
			panel
		];
		for (const target of candidates) {
			if (!target || !panel.contains(target)) continue;
			target.focus({ preventScroll: true });
			if (document.activeElement === target) break;
		}
		return () => {
			if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
		};
	}, [
		titleId,
		initialFocus,
		returnFocus
	]);
	const onKeyDown = (event) => {
		if (event.key !== "Tab" || event.defaultPrevented) return;
		const panel = panelRef.current;
		if (!panel) return;
		const stops = tabStops(panel);
		const first = stops[0];
		const last = stops[stops.length - 1];
		const active = document.activeElement;
		if (!first || !last) {
			event.preventDefault();
			panel.focus({ preventScroll: true });
		} else if (!stops.some((element) => element === active)) {
			event.preventDefault();
			(event.shiftKey ? last : first).focus();
		} else if (event.shiftKey ? active === first : active === last) {
			event.preventDefault();
			(event.shiftKey ? last : first).focus();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: overlayClassName,
		onClick: (event) => {
			if (event.target === event.currentTarget) onBackdropClick?.();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: panelRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			tabIndex: -1,
			className: panelClassName,
			onKeyDown,
			onKeyDownCapture: (event) => {
				if (event.key === "Escape") onEscape?.(event);
			},
			children
		})
	});
}
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
/** Длительность рампы master-mute: без неё слышен щелчок на границе. */
var MUTE_FADE = .12;
var ctx = null;
var master = null;
/**
* Последний узел перед `destination`: 1 — звук включён, 0 — полная тишина.
* Отдельный узел (а не рампа `master.gain`) нужен, чтобы mute не терял
* пользовательскую громкость и не зависел от того, попал ли слой в `ambient`.
*/
var muteGain = null;
var sfxBus = null;
var ambientBus = null;
var noiseBuf = null;
var enabled = loadEnabled();
var volume = loadVolume();
/** Времена последних запланированных проигрываний по каждому id (секунды). */
var recent = /* @__PURE__ */ new Map();
/**
* Подписчики UI: на странице живёт несколько экземпляров тумблера
* (`game-app`, `screens`, `net-screens`), и все они должны показывать
* фактическое состояние шины, а не своё локальное.
*/
var listeners = /* @__PURE__ */ new Set();
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
/** Разослать подписчикам «состояние звука изменилось» (подписчик не ломает шину). */
function notify() {
	for (const listener of Array.from(listeners)) try {
		listener();
	} catch {}
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
/** Запомнить флаг «звук включён» (старый формат «on»/«off» — не меняем). */
function saveEnabled() {
	try {
		localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
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
		muteGain = ctx.createGain();
		muteGain.gain.value = enabled ? 1 : 0;
		master.connect(muteGain);
		muteGain.connect(ctx.destination);
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
	trackLoadSeq++;
	if (ctx && muteGain) rampParam(muteGain.gain, 0, ctx.currentTime, MUTE_FADE);
	stopAmbient(.2);
}
/**
* Плавное затухание музыки при закрытии/перезагрузке страницы: обрыв «в полный
* голос» звучит грязно, а 0.3 с обычно успевают проиграть до teardown.
* Только pagehide — сворачивание вкладки музыку не глушит.
*/
if (typeof window !== "undefined") {
	window.addEventListener("pagehide", () => stopAmbient(.3));
	window.addEventListener("storage", (e) => {
		if (e.key !== STORAGE_KEY) return;
		const next = e.newValue !== "off";
		if (next === enabled) return;
		enabled = next;
		applyEnabledAudio();
		notify();
	});
}
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
	/**
	* Включить/выключить звук целиком. Выключение опускает master-mute (глохнет
	* всё: эффекты, дроны и музыка), гасит текущий слой фона и обесценивает
	* незавершённые загрузки треков; включение возвращает тракт к прежней
	* громкости (`evo-sound-volume`) и поднимает музыку заново.
	*/
	setEnabled(v) {
		const next = Boolean(v);
		const changed = next !== enabled;
		enabled = next;
		saveEnabled();
		const c = next ? ensureCtx() : null;
		applyEnabledAudio();
		if (next && c) {
			perform(c, "food", 0, effectsOut(c));
			if (c.state !== "running") c.resume().then(maybeStartAmbient).catch(() => {});
		}
		if (changed) notify();
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
	/**
	* Подписка на смену включённости и громкостей (несколько экземпляров
	* тумблера на странице должны читать одну шину). Возвращает отписку.
	*/
	subscribe(listener) {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},
	/**
	* Диагностика для QA: тишину проверяют по `masterGain` — итоговому
	* коэффициенту перед `destination`, а не по одному флагу `enabled`.
	* `trackLoadSeq` растёт на каждом выключении: по нему видно, что висящая
	* загрузка трека обесценена и музыку после mute не запустит.
	*/
	debugState() {
		const mute = muteGain ? muteGain.gain.value : enabled ? 1 : 0;
		return {
			enabled,
			ambientActive: ambient !== null,
			masterGain: (master ? master.gain.value : MASTER_GAIN) * mute,
			muteGain: mute,
			contextState: ctx ? ctx.state : "none",
			trackLoadSeq
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
		notify();
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
/**
* Похоже ли это на NetError. instanceof в dev ненадёжен: serverFn собирается
* в отдельный SSR-модуль, и класс из него — ДРУГОЙ экземпляр, чем импорт
* api.ts (в HMR-средах их вообще несколько). Имя класса переживает всё.
*/
/**
* S10: тот же same-site сторож, что у auth-middleware
* (src/lib/auth/middleware.ts → assertSameSiteRequest): скриптовый
* кросс-сайтовый POST отсекается до создания комнат и записи в БД. Браузер
* своего origin и не-браузерные клиенты (QA-скрипты без Sec-Fetch-*) проходят;
* isolation.server — серверный модуль (AsyncLocalStorage), поэтому импорт
* динамический внутри .server() колбэка: в клиентскую сборку не попадает.
*/
var sameSiteGuard = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	assertSameSiteRequest();
	return next();
});
/**
* Источник запроса для мягких лимитов S2/S7: IP из заголовков прокси, иначе
* адрес сокета. getRequestIP серверный — импорт динамический; без контекста
* запроса (сборка, тесты) источник «local», лимиты от него не зависят.
*/
var netCreateRoom = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(createRoomInput).handler(createSsrRpc("5d10ae946134fb6b27bc7c68ea783639ad617431c539331dc58524d97407b4bb"));
var netJoinRoom = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(joinRoomInput).handler(createSsrRpc("20bb5f392b3e05a16098d48523e3b73255d44092301929c9ed9a4bed4959d3d0"));
/**
* Список столов для главного меню: живые комнаты, включая закрытые (по флагу
* isPrivate меню делит их на колонки), без токенов и паролей. Поллинг — раз
* в несколько секунд.
*/
var netListRooms = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(listRoomsInput).handler(createSsrRpc("723174505869380ccb9a315ddd7f31ce9313f703d526f5762b058000a5a79797"));
var netRejoin = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(createSsrRpc("9be6f8dbb902e4d7a86ed61a5ec451298b7693cb95cd353b30302c3968525e24"));
var netSetBots = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(botsInput).handler(createSsrRpc("0ae6763f4a9392d1dc978022ba9a80b0b3aa8d50b84dfd2903b7639f24bfb552"));
var netKick = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(kickInput).handler(createSsrRpc("fc1d0b35176a800d8b3842e8acc96a7ac0c86234a693afc1c829068eea6c2d17"));
var netSetCapacity = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(capacityInput).handler(createSsrRpc("14d6256128aa0959545fb4a848837599d1e846ecdbdb8a1d74a6f7011a2ce4fd"));
var netSetSettings = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(settingsInput).handler(createSsrRpc("052ff9dfc236bd0e1ff1a962b0659ec3f2343e685982ac4ea46dbc2a5c6c93dd"));
/** Доступ к столу: открытый/приватный и (опционально) новый пароль. */
var netSetRoomPrivacy = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setRoomPrivacyInput).handler(createSsrRpc("7b3cccee6165dc1938d98f77f4e24b8489eac37c333a004d48f16c3436c6277c"));
/**
* Смена пароля стола: только хост, только в лобби. Вход в стол по новому
* паролю — обычный netJoinRoom; приватность вызов не меняет.
*/
var netSetPassword = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setPasswordInput).handler(createSsrRpc("669f968e8b8cfa947490123e1df1da0b1333979859dd5d0f62b5c473d073d67f"));
/** Смена цвета своего места (только лобби, только из палитры). */
var netSetColor = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setColorInput).handler(createSsrRpc("8b1166f17dfc1cc931ef213f6242cdeca1f2fc42df72e7b0f3ab94c08c119a3a"));
var netTransferHost = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(transferHostInput).handler(createSsrRpc("b6e16925f8dea3e55e70b929ead0135b8dbf491c796f2bc20222a71969975540"));
var netKickWaiter = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(kickWaiterInput).handler(createSsrRpc("77458ceff388f54d00051c41e26ba9da5450ff9a0991ee4e0f03c3612cfd48e3"));
/** Поллинг лобби для ожидающего: статус, места, очередь, свободное место. */
var netRoomInfo = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(roomInfoInput).handler(createSsrRpc("e9edd1f6cab243b2b1387028a5e185e4c9d038d81c4079de8752e760bfb05745"));
/** Занять освободившееся место из очереди (одним действием). */
var netClaimSeat = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(createSsrRpc("817dba9d018a54d9d1f8db2118a3e88ee47f87c735e346de37f37247b0b7db75"));
var netLeaveQueue = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(createSsrRpc("e93383b5647ec0a72ceef449d96876a16800ef6dad33d4e3233c9a64f988fa5b"));
/** Сдаться: место и имя остаются до конца партии, ходы пропускаются. */
var netResign = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(createSsrRpc("9f0f87a6fe21a90a7c6720b8ff446276995846ac5832a6896edee121975f53f9"));
/** Смена имени до старта партии (или в очереди/зрителем). */
var netSetName = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setNameInput).handler(createSsrRpc("c63ced99d6aefc18ccc38a895efb96127d86bc431212f7dfd5ba603a726bbcb5"));
var netChat = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(chatInput).handler(createSsrRpc("13eed1a17da62dcb9e70eec71b4e8a976934b02a5dcff01613a937167cd6f9b3"));
var netSpectate = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(spectateInput).handler(createSsrRpc("d4f11d2f35652a14c7006852467cb5ddf47674736c584cc4fd1a035dafd457c4"));
var netSpectatorPoll = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(spectatorPollInput).handler(createSsrRpc("7027acf2c9da3ca327d58640cca56e593fd6d897f85525ed64c21cabee308f2c"));
var netReaction = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(reactionInput).handler(createSsrRpc("28b67066d7856a0b8f76eba41be987486847193af04d0f5db299eaffecb7430c"));
/**
* «Печатает…»: сигнал отправляется при наборе текста (с троттлингом у клиента),
* факт живёт ~4 секунды и виден остальным в SeatInfo/WaiterInfo/SpectatorInfo.
*/
var netTyping = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(typingInput).handler(createSsrRpc("27a4b90edc64ff02fa08cbd9c71d9d3885e8fb62d40fde2cef584cfc8b9435e0"));
var netStart = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(createSsrRpc("fafa464b4c4488361c51f863768135107e02c148e255f23da160ffa440fc3f99"));
var netAction = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(actionInput).handler(createSsrRpc("18b6efd10626f6282f46662236a9f4efa95081d933b3c79a203a2bf43f221fa0"));
var netPoll = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(pollInput).handler(createSsrRpc("97c6cf3f2776e31a2770acfbc62d86143077f49705e3043649873d49707919d1"));
var netAgain = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(createSsrRpc("c863eef5e87854022b362f26f321d98a7752563244b6bf8043f48c6e5e79acfc"));
/**
* Клиентский драйвер сетевой партии: держит код стола и токен места,
* тянет состояние циклом опроса с бэкоффом, переживает обрывы (токен
* сохранён в localStorage — F5 и закрытие вкладки безболезненны).
* Никакого React: стор подписывается через хуки NetHooks.
*
* Ожидающий (мест не хватило) опрашивает лобби, а когда место освобождается —
* автоматически занимает его; отдельный токен очереди хранится рядом с местом.
*/
/**
* Ошибка сетевого входа/создания с машиночитаемым кодом. Форма меню по коду
* понимает, что делать: `password-required`/`password-wrong` — показать поле
* пароля и не выбрасывать человека из формы.
*/
var NetClientError = class extends Error {
	code;
	constructor(message, code) {
		super(message);
		this.name = "NetClientError";
		this.code = code;
	}
};
var NAME_KEY = "evo-net-name";
var tokKey = (code) => `evo-seat-${code}`;
var queueKey = (code) => `evo-queue-${code}`;
var watchKey = (code) => `evo-watch-${code}`;
/** Указатель на последний смотревшийся стол (нужен для чистки при выходе). */
var WATCH_CODE_KEY = "evo-net-watch-code";
/**
* «Печатает…»: сигналы при наборе текста шлём не чаще этого интервала. Сервер
* своей рукой троттлит пинги (раза в секунду хватает — метка живёт ~4 с).
*/
var TYPING_THROTTLE_MS = 1500;
/** Коды, после которых переподключение не поможет (см. fatal()). */
var FATAL_CODES = /* @__PURE__ */ new Set([
	"kicked",
	"seat-taken",
	"room-gone"
]);
/** Код ошибки — фатальный? По нему сессия решает, есть ли смысл reconnect'иться. */
function isFatalCode(code) {
	return Boolean(code && FATAL_CODES.has(code));
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
		watched = localStorage.getItem(watchKey(codeUp));
	} catch {
		watched = null;
	}
	return Boolean(loadToken(codeUp) || loadQueueToken(codeUp) || watched);
}
/**
* Добровольный уход со стола: забыть и место, и очередь, и зрительский токен
* (S9). Иначе на общем устройстве следующий человек по `?room=CODE` молча
* входил бы за ушедшего — пока комната жива. Перезагрузка страницы и закрытие
* вкладки сюда не попадают: там восстановление партии обязано работать.
*/
function forgetSession(code) {
	const codeUp = code.toUpperCase();
	removeToken(codeUp);
	clearQueueToken(codeUp);
	try {
		localStorage.removeItem(watchKey(codeUp));
		if (localStorage.getItem(WATCH_CODE_KEY) === codeUp) localStorage.removeItem(WATCH_CODE_KEY);
	} catch {}
}
/**
* Публичный список столов для главного меню. Без сессии и без токенов;
* ошибка — null, чтобы стор оставил прошлый список вместо пустого экрана.
*/
async function fetchRoomList() {
	const r = await netListRooms({ data: {} });
	return r.ok ? r.rooms : null;
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
	/** «Печатает…»: время последнего пинга и защита от параллельных запросов. */
	typingAt = 0;
	typingBusy = false;
	/** Место не досталось — опрашиваем очередь, пока не освободится. */
	waiting = false;
	claiming = false;
	/**
	* Пояснение к экрану ожидания (например, «хост уменьшил число мест»).
	* Хранится, пока клиент в очереди, и едет в каждый кадр ожидающего.
	*/
	waitNote = null;
	constructor(hooks) {
		this.hooks = hooks;
	}
	/**
	* Создать стол; возвращает код и доступ (приватность + пароль для хоста) —
	* стор кладёт их в состояние сразу, не дожидаясь первого кадра.
	*/
	async create(input) {
		saveName(input.name);
		const r = await netCreateRoom({ data: input });
		if (!r.ok) throw new NetClientError(r.error, r.code);
		this.attach(r.code, r.token);
		this.hooks.onStatus("connecting");
		this.schedule(0);
		return {
			code: r.code,
			seat: r.seat,
			isPrivate: r.isPrivate,
			password: r.password
		};
	}
	/**
	* Войти за стол. password нужен только приватному столу; неверный пароль —
	* NetClientError с кодом password-required/password-wrong: форма покажет
	* поле и текст, а в меню по-прежнему останется открытой.
	*/
	async join(code, name, password) {
		saveName(name);
		const codeUp = code.toUpperCase();
		const data = {
			code: codeUp,
			name
		};
		if (password?.trim()) data.password = password.trim();
		const r = await netJoinRoom({ data });
		if (!r.ok) throw new NetClientError(r.error, r.code);
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
			if (r.ok && r.info.room.status !== "lobby") {
				const watch = await netSpectatorPoll({ data: {
					code: codeUp,
					token: queueToken,
					sinceChatId: this.lastChatId,
					sinceReactionId: this.lastReactionId
				} });
				if (watch.ok) {
					clearQueueToken(codeUp);
					this.saveWatchToken(codeUp, queueToken);
					this.attachSpectator(codeUp, queueToken);
					this.acceptSpectator(watch.snapshot);
					this.schedule(0);
					return;
				}
			}
			clearQueueToken(codeUp);
			if (!r.ok && isFatalCode(r.code)) {
				this.fatal(r.code);
				throw new Error(r.error);
			}
		}
		if (failure && isFatalCode(failure.code)) {
			this.fatal(failure.code);
			throw new Error(failure.error);
		}
		if (failure) throw new Error(failure.error);
		throw new Error("На этом устройстве нет места за этим столом");
	}
	/** Ожидающий ли сейчас клиент (мест не хватило). */
	isWaiting() {
		return this.waiting;
	}
	/** Зрительский токен — рядом с местом, чтобы F5 возвращал в тот же режим. */
	saveWatchToken(code, token) {
		try {
			localStorage.setItem(watchKey(code), token);
			localStorage.setItem(WATCH_CODE_KEY, code);
		} catch {}
	}
	/** Войти зрителем: отдельный токен, место игрока не занято. */
	async watch(code, name) {
		saveName(name);
		const codeUp = code.toUpperCase();
		const r = await netSpectate({ data: {
			code: codeUp,
			name
		} });
		if (!r.ok) throw new NetClientError(r.error, r.code);
		this.saveWatchToken(codeUp, r.token);
		this.attachSpectator(codeUp, r.token);
		this.schedule(0);
	}
	/** Возврат в режим зрителя по сохранённому токену (F5). */
	async resumeWatch(code) {
		let token = null;
		try {
			token = localStorage.getItem(watchKey(code));
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
				localStorage.removeItem(watchKey(code));
			} catch {}
			return false;
		}
		this.attachSpectator(code, token);
		this.acceptSpectator(r.snapshot);
		this.schedule(0);
		return true;
	}
	/**
	* Ход: сервер проверяет и применяет, свежий кадр приходит в ответе.
	* Ошибка приходит с кодом — стор переводит её на язык клиента.
	*/
	async act(action) {
		const r = await netAction({ data: {
			code: this.code,
			token: this.token,
			action
		} });
		if (!r.ok) {
			if (isFatalCode(r.code)) this.fatal(r.code);
			return {
				error: r.error,
				code: r.code
			};
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
	/** Сдаться в идущей партии: место остаётся, ходы пропускает сервер. */
	async resign() {
		const r = await this.call(netResign({ data: {
			code: this.code,
			token: this.token
		} }));
		this.accept(r.snapshot);
		this.schedule(0);
	}
	/** Сменить имя (лобби/очередь/зритель); возвращает итоговое имя. */
	async setName(name) {
		const r = await this.call(netSetName({ data: {
			code: this.code,
			token: this.token,
			name
		} }));
		saveName(r.name);
		this.refresh();
		return r.name;
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
	/** Доступ к столу (хост, лобби): приватность и при необходимости новый пароль. */
	async setRoomPrivacy(isPrivate, regenerate = false) {
		const r = await this.call(netSetRoomPrivacy({ data: {
			code: this.code,
			token: this.token,
			isPrivate,
			regenerate
		} }));
		this.refresh();
		return {
			isPrivate: r.isPrivate,
			password: r.password
		};
	}
	/**
	* Смена пароля стола хостом (только лобби, ровно 4 цифры). Возвращает
	* принятый сервером пароль — хосту не нужно ждать кадра, чтобы его отдать.
	*/
	async setPassword(password) {
		const r = await this.call(netSetPassword({ data: {
			code: this.code,
			token: this.token,
			password
		} }));
		this.refresh();
		return { password: r.password };
	}
	/** Смена цвета своего места (только лобби); возвращает принятый сервером цвет. */
	async setColor(color) {
		const r = await this.call(netSetColor({ data: {
			code: this.code,
			token: this.token,
			color
		} }));
		this.refresh();
		return r.color;
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
				if (isFatalCode(r.code)) {
					this.fatal(r.code);
					return false;
				}
				return false;
			}
			this.waiting = false;
			this.waitNote = null;
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
		this.waitNote = null;
		this.stop();
	}
	/** Отправка в чат; возвращает ошибку с кодом или null. */
	async sendChat(text) {
		const r = await netChat({ data: {
			code: this.code,
			token: this.token,
			text
		} });
		if (!r.ok) {
			if (isFatalCode(r.code)) this.fatal(r.code);
			return {
				error: r.error,
				code: r.code
			};
		}
		this.trackChat([r.message], false);
		this.schedule(0);
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
			if (isFatalCode(fail.code)) this.fatal(fail.code);
			throw new NetClientError(fail.error, fail.code);
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
		this.waitNote = null;
		this.spectating = false;
		saveToken(code, token);
		this.failCount = 0;
	}
	attachSpectator(code, token) {
		this.code = code;
		this.token = token;
		this.waiting = false;
		this.spectating = true;
		this.lastVersion = void 0;
		this.failCount = 0;
		this.hooks.onStatus("connecting");
		this.hooks.onSpectating?.(true);
	}
	acceptSpectator(snap) {
		if (this.stopped) return;
		this.failCount = 0;
		this.seenStatus = statusOf(snap.room.status);
		this.wasReconnecting = false;
		this.trackChat(snap.chat);
		this.trackReactions(snap.reactions);
		this.hooks.onSpectatorSnapshot(snap);
		this.hooks.onStatus(this.seenStatus);
	}
	/** Точечный ACK отображаем, но курсор двигает только кадр с историей. */
	trackReactions(messages, advanceCursor = true) {
		if (this.stopped) return;
		if (!messages.length) return;
		if (advanceCursor) for (const m of messages) this.lastReactionId = Math.max(this.lastReactionId ?? 0, m.id);
		this.hooks.onReactions(messages);
	}
	attachWaiting(code, token, info, note) {
		this.code = code;
		this.token = token;
		this.waiting = true;
		this.waitNote = note ?? null;
		removeToken(code);
		saveQueueToken(code, token);
		this.failCount = 0;
		if (info) this.hooks.onWaiting(info, this.waitNote);
		this.hooks.onStatus("lobby");
		this.schedule(0);
	}
	trackChat(messages, advanceCursor = true) {
		if (this.stopped) return;
		if (!messages.length) return;
		if (advanceCursor) for (const m of messages) this.lastChatId = Math.max(this.lastChatId ?? 0, m.id);
		this.hooks.onChat(messages);
	}
	accept(snap) {
		if (this.stopped) return;
		this.waiting = false;
		this.lastVersion = snap.version;
		this.failCount = 0;
		this.seenStatus = statusOf(snap.room.status);
		this.wasReconnecting = false;
		if (snap.events.length) this.hooks.onEvents(snap.events);
		this.trackChat(snap.chat);
		this.trackReactions(snap.reactions);
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
				sinceChatId: this.lastChatId,
				sinceReactionId: this.lastReactionId
			} });
			if (!r.ok) {
				if ((r.code === "seat-taken" || /Место больше не существует/.test(r.error)) && await this.tryBecomeWaiting("capacity-shrunk")) return;
				if (isFatalCode(r.code)) {
					this.fatal(r.code);
					return;
				}
				throw new Error(r.error);
			}
			if ("unchanged" in r) {
				this.failCount = 0;
				this.hooks.onSeats(r.seats, r.hostSeat, r.capacity, r.waiters, r.spectators);
				this.trackChat(r.chat);
				this.trackReactions(r.reactions);
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
				if (isFatalCode(r.code)) {
					this.fatal(r.code);
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
	/**
	* Реакция игрока или зрителя; возвращает текст ошибки или null.
	* `chatId` — id реплики (M12): реакция ляжет под конкретное сообщение.
	* Без него — прежняя реакция «в стол»/игроку.
	*/
	async sendReaction(emoji, kind, targetSeat, chatId) {
		const r = await netReaction({ data: {
			code: this.code,
			token: this.token,
			emoji,
			kind,
			targetSeat,
			...chatId != null ? { chatId } : {}
		} });
		if (!r.ok) {
			if (isFatalCode(r.code)) this.fatal(r.code);
			return {
				error: r.error,
				code: r.code
			};
		}
		this.trackReactions([r.reaction], false);
		this.schedule(0);
		return null;
	}
	/**
	* «Печатает…»: сигнал при наборе текста. Троттлинг клиентский (не чаще
	* ~1.5 с) плюс защита от параллельных запросов; ошибки глотаем — индикатор
	* необязателен, а состояние связи проверит обычный поллинг. Поллинг лишний
	* раз не дёргаем: соседи увидят метку сами, в своём кадре.
	*/
	async sendTyping() {
		if (this.stopped || this.typingBusy) return;
		const now = Date.now();
		if (now - this.typingAt < TYPING_THROTTLE_MS) return;
		this.typingAt = now;
		this.typingBusy = true;
		try {
			await netTyping({ data: {
				code: this.code,
				token: this.token
			} });
		} catch {} finally {
			this.typingBusy = false;
		}
	}
	/**
	* Ожидающий при старте партии становится зрителем: сервер перенёс строку
	* очереди в evo_spectators с тем же токеном — продолжаем сессию в
	* зрительском тракте, а не уходим с «партия началась без вас».
	*/
	async becomeSpectator() {
		const r = await netSpectatorPoll({ data: {
			code: this.code,
			token: this.token,
			sinceChatId: this.lastChatId,
			sinceReactionId: this.lastReactionId
		} });
		if (!r.ok) {
			if (isFatalCode(r.code)) {
				this.fatal(r.code);
				return;
			}
			throw new Error(r.error);
		}
		clearQueueToken(this.code);
		this.saveWatchToken(this.code, this.token);
		this.attachSpectator(this.code, this.token);
		this.acceptSpectator(r.snapshot);
		this.schedule(0);
	}
	/**
	* Место исчезло (обычно хост уменьшил число мест и сервер перевёл игрока в
	* очередь ожидающих с тем же токеном). Проверяем очередь и, если токен там,
	* переходим на экран ожидания с пояснением, а не выходим в меню. Возвращает
	* true, если клиент снова при деле. note — код пояснения для стора.
	*/
	async tryBecomeWaiting(note) {
		const r = await netRoomInfo({ data: {
			code: this.code,
			token: this.token
		} }).catch(() => null);
		if (!r || !r.ok || !r.info.queued) return false;
		this.attachWaiting(this.code, this.token, r.info, note);
		return true;
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
				if (isFatalCode(r.code)) {
					this.fatal(r.code);
					return;
				}
				throw new Error(r.error);
			}
			const info = r.info;
			this.failCount = 0;
			this.wasReconnecting = false;
			this.hooks.onWaiting(info, this.waitNote);
			this.trackChat(info.chat);
			if (info.room.status !== "lobby") {
				await this.becomeSpectator();
				return;
			}
			if (!info.queued && info.freeSeat === null) {
				this.fatal(info.room.status === "lobby" ? "not-in-queue" : "started-without-you");
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
/**
* Код сетевой ошибки/фатала → ключ словаря. Сервер не знает языка клиента и
* присылает код; стор подставляет перевод в момент показа. Неизвестный код —
* показываем исходный текст сервера (русский).
*/
var NET_ERR_KEYS = {
	kicked: "netErr.kicked",
	"seat-taken": "netErr.seatTaken",
	"room-gone": "netErr.roomGoneCheck",
	"password-required": "netErr.passwordRequired",
	"password-wrong": "netErr.passwordWrong",
	"password-format": "netErr.passwordFormat",
	"move-illegal": "netErr.moveIllegal",
	resigned: "netErr.resigned",
	"not-playing": "netErr.notPlaying",
	"reorder-phase": "netErr.reorderPhase",
	"reorder-turn": "netErr.reorderTurn",
	"reorder-owner": "netErr.reorderOwner",
	"rename-phase": "netErr.renamePhase",
	"rename-turn": "netErr.renameTurn",
	"rename-owner": "netErr.renameOwner",
	"rename-length": "netErr.renameLength",
	"color-taken": "netErr.colorTaken",
	"chat-empty": "netErr.chatEmpty",
	"rate-limit": "netErr.rateLimit",
	"rate-fast": "netErr.rateFast",
	"reaction-limit": "netErr.reactionLimit",
	"reaction-missing": "netErr.reactionMissing",
	"probe-limit": "netErr.probeLimit",
	"entry-limit": "netErr.entryLimit",
	"create-limit": "netErr.createLimit",
	"queue-full": "netErr.queueFull",
	"host-only": "netErr.hostOnly",
	"lobby-only": "netErr.lobbyOnly",
	"game-started": "netErr.gameStarted",
	"game-finished": "netErr.gameFinished",
	"game-running": "netErr.gameRunning",
	"seats-unfinished": "netErr.seatsUnfinished",
	"no-free-seats": "netErr.noFreeSeats",
	"seat-race": "netErr.seatRace",
	retry: "netErr.retry",
	"not-in-queue": "netErr.notInQueue",
	"started-without-you": "netErr.startedWithoutYou"
};
/** Текст ошибки для показа: знакомый код переводим, прочее — как есть. */
function netErrorText(error, code) {
	const key = code ? NET_ERR_KEYS[code] : void 0;
	return key ? t(key) : error;
}
/** Пояснение экрана ожидания по коду из сессии. */
function waitNoteText(code) {
	if (code === "capacity-shrunk") return t("net.waitNote.capacityShrunk");
	return code;
}
/** Предыдущий срез состава — по нему считаем, кто пришёл и кто ушёл. */
var prevTable = null;
/** Забыть состав: при входе за новый стол события не должны «догонять» старые. */
function resetTableNotes() {
	prevTable = null;
}
/**
* Системные сообщения о составе стола: клиентский дифф кадров — сервер про
* вход и выход ничего не пишет, а игрокам это важно видеть в чате, как лог.
* Первый кадр пропускаем: иначе при заходе в стол сыпались бы «вошёл» на всех.
*/
function diffTableNotes(prev, next, mySeat) {
	if (!prev) return [];
	const at = Date.now();
	const notes = [];
	/** Запись с ключом словаря: text — перевод на текущем языке (для лобби). */
	const push = (key, params, id) => notes.push({
		id: `sys-${id}-${at}-${notes.length}`,
		text: t(key, params),
		at,
		key,
		params
	});
	const prevSeats = new Map(prev.seats.map((s) => [s.name, s]));
	for (const s of next.seats) {
		const was = prevSeats.get(s.name);
		if (!was) {
			if (s.seat !== mySeat) push("tableNote.joined", { name: s.name }, `in-${s.name}`);
			continue;
		}
		if (was.online && !s.online) push("tableNote.lostConnection", { name: s.name }, `off-${s.name}`);
		else if (!was.online && s.online) push("tableNote.back", { name: s.name }, `on-${s.name}`);
		if (!was.resigned && s.resigned) push("tableNote.resigned", { name: s.name }, `res-${s.name}`);
	}
	for (const s of prev.seats) if (!next.seats.some((x) => x.name === s.name)) push("tableNote.left", { name: s.name }, `out-${s.name}`);
	const prevWaiters = new Set(prev.waiters.map((w) => w.name));
	for (const w of next.waiters) if (!prevWaiters.has(w.name)) push("tableNote.queued", { name: w.name }, `wait-${w.name}`);
	for (const w of prev.waiters) if (!next.waiters.some((x) => x.name === w.name)) push("tableNote.unqueued", { name: w.name }, `unwait-${w.name}`);
	const prevSpectators = new Set(prev.spectators.map((s) => s.name));
	for (const s of next.spectators) if (!prevSpectators.has(s.name)) push("tableNote.watching", { name: s.name }, `spec-${s.name}`);
	return notes;
}
/**
* Кто сейчас печатает (кроме меня) — для строки «Аня печатает…» над
* композером. Метки `typing` приходят с каждым кадром (окно ~4 с у сервера),
* поэтому индикатор гаснет сам, без отдельного таймера на клиенте. Своё имя
* исключаем: свои же пинги возвращаются в кадре, и «вы печатаете» ни к чему.
*/
function typingNamesOf(net) {
	const names = [];
	const push = (name) => {
		if (name && name !== net.name && !names.includes(name)) names.push(name);
	};
	for (const s of net.seats) if (!s.isAI && s.typing) push(s.name);
	for (const w of net.waiters) if (w.typing) push(w.name);
	for (const s of net.spectators) if (s.typing) push(s.name);
	return names;
}
/** Пустое состояние стола до первого кадра сервера (create/join/watch). */
function netStartState(patch = {}) {
	return {
		code: "",
		seat: -1,
		name: loadName(),
		status: "connecting",
		error: null,
		seats: [],
		hostSeat: -1,
		capacity: 0,
		resigned: false,
		waiting: false,
		waiterPosition: null,
		waitNote: null,
		waiters: [],
		settings: {},
		isPrivate: false,
		password: null,
		chat: [],
		system: [],
		events: [],
		spectating: false,
		spectators: [],
		reactions: [],
		turnDeadlineAt: null,
		serverOffsetMs: 0,
		...patch
	};
}
/** Активная сетевая сессия (одна на вкладку). */
var netSession = null;
/**
* Поколение сетевой сессии: хуки старой сессии (её in-flight ответы) не
* должны перезаписывать стор нового стола. Растёт при каждом create/join/
* resume/watch и при выходе в меню.
*/
var netGeneration = 0;
/** Код из ?room, по которому уже пробовали вернуться: страховка от цикла меню. */
var urlResumeTried = null;
/**
* Мост NetSession → стор: кадры сервера ложатся в state/net, статус
* соединения — в баннер переподключения, события/чат — в буферы UI.
* gen — поколение сессии: кадры заменённой/остановленной сессии
* отбрасываются, иначе её in-flight ответ мог перезаписать новый стол.
*/
function netHooks(set, get, gen) {
	const stale = () => gen !== netGeneration;
	return {
		onSnapshot: (snap) => {
			if (stale()) return;
			if (snap.room.code !== syncedRoomCode) {
				syncedRoomCode = snap.room.code;
				syncRoomUrl(snap.room.code);
			}
			const cur = get().net;
			if (!cur) return;
			const own = snap.seats.find((x) => x.seat === snap.seat);
			set({
				state: snap.state,
				net: {
					...cur,
					code: snap.room.code,
					seat: snap.seat,
					name: own?.name ?? cur.name,
					resigned: snap.state?.players[snap.seat]?.resigned ?? false,
					capacity: snap.room.capacity,
					seats: snap.seats,
					hostSeat: snap.room.hostSeat,
					settings: snap.room.settings,
					isPrivate: snap.room.isPrivate,
					password: snap.room.password,
					waiters: snap.waiters,
					spectators: snap.spectators,
					turnDeadlineAt: snap.turnDeadlineAt,
					serverOffsetMs: snap.serverNow - Date.now(),
					waiting: false,
					waiterPosition: null,
					waitNote: null
				}
			});
		},
		onSeats: (seats, hostSeat, capacity, waiters, spectators) => {
			if (stale()) return;
			const cur = get().net;
			if (!cur) return;
			const notes = diffTableNotes(prevTable, {
				seats,
				waiters,
				spectators
			}, cur.seat);
			prevTable = {
				seats,
				waiters,
				spectators
			};
			set({ net: {
				...cur,
				seats,
				hostSeat,
				capacity,
				waiters,
				spectators,
				system: notes.length ? [...cur.system, ...notes].slice(-60) : cur.system
			} });
		},
		onStatus: (status) => {
			if (stale()) return;
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				status,
				error: status === "reconnecting" ? cur.error : null
			} });
		},
		onEvents: (batches) => {
			if (stale()) return;
			const cur = get().net;
			if (!cur || !batches.length) return;
			set({ net: {
				...cur,
				events: [...cur.events, ...batches].slice(-40)
			} });
		},
		onChat: (messages) => {
			if (stale()) return;
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
			if (stale()) return;
			const cur = get().net;
			if (!cur || !messages.length) return;
			const seen = new Set(cur.reactions.map((m) => m.id));
			const fresh = messages.filter((m) => !seen.has(m.id));
			if (!fresh.length) return;
			set({ net: {
				...cur,
				reactions: [...cur.reactions, ...fresh].slice(-200)
			} });
		},
		onSpectatorSnapshot: (snap) => {
			if (stale()) return;
			const cur = get().net;
			if (!cur) return;
			set({
				state: snap.state,
				net: {
					...cur,
					code: snap.room.code,
					seat: -2,
					waiting: false,
					waiterPosition: null,
					waitNote: null,
					resigned: false,
					capacity: snap.room.capacity,
					seats: snap.seats,
					hostSeat: snap.room.hostSeat,
					settings: snap.room.settings,
					isPrivate: snap.room.isPrivate,
					spectators: snap.spectators,
					turnDeadlineAt: snap.turnDeadlineAt,
					serverOffsetMs: snap.serverNow - Date.now(),
					status: get().net?.status === "reconnecting" ? "reconnecting" : statusOfNet(snap.room.status)
				}
			});
		},
		onSpectators: (spectators) => {
			if (stale()) return;
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				spectators
			} });
		},
		onSpectating: (on) => {
			if (stale()) return;
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				spectating: on
			} });
		},
		onWaiting: (info, note) => {
			if (stale()) return;
			const cur = get().net;
			if (!cur) return;
			if (!info) {
				set({ net: {
					...cur,
					waiting: false,
					waiterPosition: null,
					waitNote: null
				} });
				return;
			}
			set({ net: {
				...cur,
				seat: -1,
				waiting: true,
				waiterPosition: info.position,
				waitNote: note ? waitNoteText(note) : null,
				capacity: info.room.capacity,
				seats: info.seats,
				hostSeat: info.room.hostSeat,
				settings: info.room.settings,
				isPrivate: info.room.isPrivate,
				waiters: info.waiters
			} });
		},
		onFatal: (code) => {
			if (stale()) return;
			const s = netSession;
			netSession = null;
			netGeneration += 1;
			s?.stop();
			syncedRoomCode = null;
			syncRoomUrl(null);
			set({
				net: null,
				state: null,
				netFatal: netErrorText(code, code),
				intent: { kind: "none" }
			});
		}
	};
}
/** Общий прогон сетевого действия: ошибку показываем в net.error (переводим по коду). */
function runNet(session, set, get, fn) {
	if (!session) return Promise.resolve();
	return fn(session).catch((e) => {
		const cur = get().net;
		const message = e instanceof NetClientError ? netErrorText(e.message, e.code) : e instanceof Error ? e.message : String(e);
		if (cur) set({ net: {
			...cur,
			error: message
		} });
	});
}
/**
* Новая сетевая сессия на вкладку: прошлая гасится, её поколение хуков
* устаревает — in-flight кадры старого стола не могут перезаписать новый.
*/
function beginNetSession(set, get) {
	netSession?.stop();
	netSession = null;
	netGeneration += 1;
	const s = new NetSession(netHooks(set, get, netGeneration));
	netSession = s;
	return s;
}
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
var useGameStore = create((set, get) => ({
	state: null,
	intent: { kind: "none" },
	rulesOpen: false,
	logOpen: false,
	logUnread: 0,
	speed: "normal",
	net: null,
	netFatal: null,
	rooms: [],
	dispatch: (action) => {
		const cur = get().net;
		if (!cur || cur.spectating) return;
		const s = netSession;
		if (!s) return;
		set({ intent: { kind: "none" } });
		s.act(action).then((err) => {
			const after = get().net;
			if (err && after) set({ net: {
				...after,
				error: netErrorText(err.error, err.code)
			} });
		});
	},
	setIntent: (intent) => set({ intent }),
	setRulesOpen: (rulesOpen) => set({ rulesOpen }),
	setLogOpen: (logOpen) => set({ logOpen }),
	setLogUnread: (logUnread) => set({ logUnread }),
	setSpeed: (speed) => {
		try {
			localStorage.setItem("evo-speed", speed);
		} catch {}
		set({ speed });
	},
	startNetCreate: async (cfg) => {
		const s = beginNetSession(set, get);
		syncedRoomCode = null;
		syncRoomUrl(null);
		urlResumeTried = null;
		let created;
		try {
			created = await s.create(cfg);
		} catch (e) {
			s.stop();
			netSession = null;
			netGeneration += 1;
			throw e;
		}
		syncedRoomCode = created.code;
		syncRoomUrl(created.code);
		set({
			state: null,
			intent: { kind: "none" },
			netFatal: null,
			net: netStartState({
				code: created.code,
				seat: created.seat,
				name: cfg.name,
				hostSeat: created.seat,
				capacity: cfg.capacity,
				settings: {
					modules: cfg.modules ?? {},
					difficulty: cfg.difficulty
				},
				isPrivate: created.isPrivate,
				password: created.password
			})
		});
	},
	startNetJoin: async (code, name, password) => {
		const codeUp = code.toUpperCase();
		const s = beginNetSession(set, get);
		syncedRoomCode = null;
		syncRoomUrl(null);
		urlResumeTried = null;
		try {
			await s.join(codeUp, name, password);
		} catch (e) {
			s.stop();
			netSession = null;
			netGeneration += 1;
			throw e;
		}
		const waiting = s.isWaiting();
		syncedRoomCode = codeUp;
		syncRoomUrl(codeUp);
		set({
			state: null,
			intent: { kind: "none" },
			netFatal: null,
			net: netStartState({
				code: codeUp,
				seat: waiting ? -1 : 0,
				name,
				capacity: 0,
				status: waiting ? "lobby" : "connecting",
				waiting
			})
		});
	},
	resumeNetFromUrl: async (code) => {
		const codeUp = code.toUpperCase();
		if (!hasStoredSession(codeUp)) return false;
		if (urlResumeTried === codeUp) return false;
		urlResumeTried = codeUp;
		const s = beginNetSession(set, get);
		set({
			state: null,
			intent: { kind: "none" },
			netFatal: null,
			net: netStartState({
				code: codeUp,
				name: loadName()
			})
		});
		try {
			await s.resume(code);
		} catch {
			s.stop();
			netSession = null;
			netGeneration += 1;
			syncedRoomCode = null;
			if (typeof window !== "undefined") try {
				const url = new URL(window.location.href);
				url.searchParams.delete("room");
				window.history.replaceState(null, "", url.toString());
			} catch {}
			set({ net: null });
			return false;
		}
		urlResumeTried = null;
		return true;
	},
	/** Список столов меню: тихо обновляем, при сбое оставляем прошлый. */
	netRefreshRooms: async () => {
		const rooms = await fetchRoomList();
		if (rooms) set({ rooms });
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
			const message = e instanceof NetClientError ? netErrorText(e.message, e.code) : String(e?.message ?? e);
			if (cur) set({ net: {
				...cur,
				error: message
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
	netSetRoomPrivacy: async (isPrivate, regenerate = false) => {
		const s = netSession;
		if (!s) return;
		try {
			const r = await s.setRoomPrivacy(isPrivate, regenerate);
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				isPrivate: r.isPrivate,
				password: r.password,
				error: null
			} });
		} catch (e) {
			const cur = get().net;
			const message = e instanceof NetClientError ? netErrorText(e.message, e.code) : e instanceof Error ? e.message : String(e);
			if (cur) set({ net: {
				...cur,
				error: message
			} });
		}
	},
	/**
	* Смена пароля стола хостом. Возвращает результат, чтобы форма inline-правки
	* показала подпись и не потеряла введённое при ошибке (черновик чистит сама).
	*/
	netSetPassword: async (password) => {
		const s = netSession;
		if (!s) return {
			ok: false,
			error: t("netErr.noSession")
		};
		try {
			const r = await s.setPassword(password);
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				password: r.password,
				error: null
			} });
			return { ok: true };
		} catch (e) {
			const message = e instanceof NetClientError ? netErrorText(e.message, e.code) : e instanceof Error ? e.message : String(e);
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				error: message
			} });
			return {
				ok: false,
				error: message
			};
		}
	},
	netSetColor: async (color) => {
		const s = netSession;
		if (!s) return;
		try {
			await s.setColor(color);
		} catch (e) {
			const cur = get().net;
			const message = e instanceof NetClientError ? netErrorText(e.message, e.code) : e instanceof Error ? e.message : String(e);
			if (cur) set({ net: {
				...cur,
				error: message
			} });
		}
	},
	netTransferHost: (seat) => runNet(netSession, set, get, (s) => s.transferHost(seat)),
	netKickWaiter: (index) => runNet(netSession, set, get, (s) => s.kickWaiter(index)),
	netClaimSeat: () => runNet(netSession, set, get, async (s) => {
		await s.claimSeat();
	}),
	netResign: () => runNet(netSession, set, get, (s) => s.resign()),
	netSetName: async (name) => {
		const s = netSession;
		if (!s) return;
		try {
			const final = await s.setName(name);
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				name: final,
				error: null
			} });
		} catch (e) {
			const cur = get().net;
			const message = e instanceof NetClientError ? netErrorText(e.message, e.code) : e instanceof Error ? e.message : String(e);
			if (cur) set({ net: {
				...cur,
				error: message
			} });
		}
	},
	netLeaveQueue: async () => {
		const s = netSession;
		const code = get().net?.code ?? "";
		netSession = null;
		netGeneration += 1;
		if (s) await s.leaveQueue().catch(() => {});
		if (code) forgetSession(code);
		syncedRoomCode = null;
		syncRoomUrl(null);
		set({
			net: null,
			state: null,
			intent: { kind: "none" }
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
				error: netErrorText(err.error, err.code)
			} });
		}
	},
	/** «Печатает…»: без ожидания ответа — индикатор не должен тормозить ввод. */
	sendTyping: () => {
		netSession?.sendTyping();
	},
	startNetWatch: async (code, name) => {
		const codeUp = code.toUpperCase();
		const s = beginNetSession(set, get);
		try {
			await s.watch(codeUp, name);
		} catch (e) {
			s.stop();
			netSession = null;
			netGeneration += 1;
			throw e;
		}
		syncedRoomCode = codeUp;
		syncRoomUrl(codeUp);
		set({
			state: null,
			intent: { kind: "none" },
			netFatal: null,
			net: netStartState({
				code: codeUp,
				name,
				seat: -2,
				spectating: true
			})
		});
	},
	sendReaction: async (emoji, kind, targetSeat, chatId) => {
		const s = netSession;
		if (!s) return;
		const err = await s.sendReaction(emoji, kind, targetSeat, chatId);
		if (err) {
			const cur = get().net;
			if (cur) set({ net: {
				...cur,
				error: netErrorText(err.error, err.code)
			} });
		}
	},
	leaveNet: () => {
		const s = netSession;
		const cur = get().net;
		const wasWaiting = cur?.waiting ?? false;
		const code = cur?.code ?? "";
		netSession = null;
		netGeneration += 1;
		syncedRoomCode = null;
		resetTableNotes();
		urlResumeTried = null;
		syncRoomUrl(null);
		if (code) forgetSession(code);
		if (s && wasWaiting) s.leaveQueue().catch(() => {});
		s?.stop();
		set({
			net: null,
			state: null,
			intent: { kind: "none" }
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
	const tt = useT();
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
					def.extraFood && def.extraFood > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-clay/20 px-1.5 text-[9px] uppercase tracking-wide text-clay",
						children: tt("traitTip.extraFood", { n: def.extraFood })
					}) : null,
					def.scoreBonus && def.scoreBonus > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-good/20 px-1.5 text-[9px] uppercase tracking-wide text-good",
						children: tt("traitTip.score", { n: def.scoreBonus })
					}) : null,
					pair ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted",
						style: pairColor ? { color: pairColor } : void 0,
						children: [pairColor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2 rounded-full",
							style: { background: pairColor }
						}) : null, pairNote ?? tt("traitTip.pair")]
					}) : null,
					disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] uppercase tracking-wider text-clay",
						children: tt("traitTip.disabled")
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
	const lang = useLang();
	const t = useT();
	const tip = useTraitTip({ isolateClick: true });
	const tipDef = {
		id: mark,
		name: t("card.markLabel", { name: markName(mark, lang) }),
		description: markDesc(mark, lang),
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
			markShort(mark, lang),
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
	const lang = useLang();
	const t = useT();
	const def = FLORA[flora.kind];
	const art = FLORA_ART[flora.kind];
	const tip = useTraitTip({ toggleOnTap: false });
	const kindLabel = def.isFungus ? t("card.fungus") : t("card.grass");
	const tipDef = {
		id: flora.kind,
		name: `${floraName(flora.kind, lang)} · ${kindLabel}`,
		description: floraDesc(flora.kind, lang),
		image: art
	};
	const interactive = Boolean(onClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-flora-id": flora.id,
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"aria-label": `${floraName(flora.kind, lang)} — ${kindLabel}`,
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
					children: floraName(flora.kind, lang)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 px-2 py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-0.5",
					title: t("card.foodTokens", {
						n: flora.food,
						m: 4
					}),
					children: [Array.from({ length: flora.food }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
						tone: "red",
						className: "token-pop size-3"
					}, i)), flora.food === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-ink-soft",
						children: t("card.noFood")
					}) : null]
				}), def.mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: MARK_ART[def.mark],
					alt: t("card.markLabel", { name: markName(def.mark, lang) }),
					loading: "lazy",
					title: t("card.givesMark", { name: markName(def.mark, lang) }),
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
	const t = useT();
	const lang = useLang();
	const flora = (state.flora ?? []).filter((f) => zone ? (f.zoneId ?? "gondwana") === zone : true);
	if (!flora.length) return null;
	const interactive = Boolean(onFloraClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": zone ? t("card.floraStripZone", { zone: territoryName(zone, lang) }) : t("card.floraStrip"),
		className: "paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full items-center justify-between text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: zone ? t("card.floraZone", { zone: territoryName(zone, lang) }) : t("card.floraCommon")
			}), zone ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums",
				children: t("card.floraDeck", {
					n: state.floraDeckCount ?? state.floraDeck?.length ?? 0,
					m: state.floraDiscard ?? 0
				})
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
/**
* Пустое «гнездо» под фишку еды: тот же изометрический силуэт, что у FoodCube,
* но прозрачный и пунктирный. Так видно, что сюда ляжет кубик еды, а не просто
* кружок нормы.
*/
var FoodSlot = (0, import_react.memo)(function FoodSlot() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 20 21",
		className: "size-3.5 shrink-0",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: "none",
			stroke: "color-mix(in oklab, var(--color-ink) 45%, transparent)",
			strokeWidth: "1",
			strokeDasharray: "2.4 1.7",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "1,6.2 10,11.4 10,20.6 1,15.4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "19,6.2 10,11.4 10,20.6 19,15.4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "10,1 19,6.2 10,11.4 1,6.2" })
			]
		})
	});
});
var FoodDots = (0, import_react.memo)(function FoodDots({ animal }) {
	const t = useT();
	const need = speciesNeed(animal);
	const blue = Math.min(animal.blueFood, animal.food);
	const red = animal.food - blue;
	const empty = Math.max(0, need - animal.food);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		title: t("card.foodTitle", {
			food: animal.food,
			need
		}) + (blue > 0 ? t("card.foodBlue", { n: blue }) : "") + (animal.fatTokens > 0 ? t("card.foodFat", { n: animal.fatTokens }) : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1",
			children: [
				Array.from({ length: red }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: "red",
					title: t("card.redToken"),
					className: "token-pop size-3.5"
				}, `r${i}`)),
				Array.from({ length: blue }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: "blue",
					title: t("card.blueToken"),
					className: "token-pop size-3.5"
				}, `b${i}`)),
				Array.from({ length: empty }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodSlot, {}, `e${i}`)),
				Array.from({ length: animal.fatTokens }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
					tone: "yellow",
					title: t("card.fatToken"),
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
var TraitChip = (0, import_react.memo)(function TraitChip({ type, pair, mark, disabled, paralyzed, fresh }) {
	const lang = useLang();
	const t = useT();
	const def = TRAITS[type];
	const tip = useTraitTip({ isolateClick: true });
	const anchorRef = (el) => {
		tip.anchorRef.current = el;
	};
	const bubble = tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
		def: {
			...def,
			name: traitName(type, lang),
			description: traitDesc(type, lang)
		},
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
		className: cn("anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/60", disabled ? "bg-virus/15 text-virus line-through decoration-virus/60" : def.virusLike ? "bg-virus/20 text-virus ring-1 ring-inset ring-virus/50" : def.harmful ? "bg-ink/85 text-parchment ring-1 ring-inset ring-clay/60" : type === "carnivore" ? "bg-clay/15 text-clay" : type === "fatTissue" ? "bg-food-yellow/20 text-ink" : "bg-ink/8 text-ink", fresh && !disabled && "chip-fresh", paralyzed && "opacity-50 grayscale"),
		children: [
			mark && !disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-2 shrink-0 rounded-full",
				style: { background: mark.color }
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
				id: type,
				className: "size-3.5"
			}),
			traitShort(type, lang),
			def.extraFood > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[9px] font-semibold text-clay",
				title: t("card.extraFoodNeed", { n: def.extraFood }),
				children: ["+", def.extraFood]
			}) : null,
			mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] font-semibold",
				style: { color: mark.color },
				children: mark.note
			}) : pair ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] opacity-70",
				children: t("card.pair")
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
*
* Перетаскивание — снаружи (@dnd-kit): сюда приходят ref и слушатели датчиков,
* компонент остаётся презентационным и про библиотеку не знает.
*/
var AnimalCard = (0, import_react.memo)(function AnimalCard({ animal, name, no, pairMarks, selected, dimmed, highlight, danger, dying, freshSince, draggable, dragging, dropTarget, insertSide, dragRef, dragListeners, onRename }) {
	const t = useT();
	const fed = isFed(animal);
	const [renaming, setRenaming] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const startRename = () => {
		setDraft(animal.name ?? "");
		setRenaming(true);
	};
	const commitRename = () => {
		setRenaming(false);
		onRename?.(animal.id, draft.trim());
	};
	const width = 168 + Math.min(Math.max(animal.traits.length - 3, 0), 3) * 38;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: dragRef,
		...dragListeners,
		onDragStartCapture: (e) => e.preventDefault(),
		"data-animal-id": animal.id,
		style: { width },
		className: cn("animal-card anim-card-in relative shrink-0 rounded-[var(--radius-lg)] border border-ink/10 bg-parchment p-3 text-left text-ink shadow-[var(--shadow-card)] transition-[transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-out)]", draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer", danger ? "target-marked border-danger ring-[3px] ring-danger" : selected ? "evo-picked" : highlight ? "ring-2 ring-accent" : "", dimmed ? "opacity-45" : "", dying ? "dying-pulse border-danger/60" : "", dropTarget ? "border-accent ring-2 ring-accent/60" : "", dragging ? "opacity-40" : "", "hover:-translate-y-0.5"),
		children: [
			insertSide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				"data-insert-side": insertSide,
				className: cn("pointer-events-none absolute bottom-1 top-1 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]", insertSide === "before" ? "-left-2" : "-right-2")
			}) : null,
			danger ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "target-badge pointer-events-none absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border border-danger bg-danger text-parchment shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3.5" })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex flex-wrap items-start justify-between gap-x-2 gap-y-1",
				children: [renaming && onRename ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex min-w-0 flex-1 items-center gap-0.5",
					onPointerDown: (e) => e.stopPropagation(),
					onClick: (e) => e.stopPropagation(),
					children: [
						no ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-[10px] tabular-nums text-ink-soft",
							children: ["№", no]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: draft,
							maxLength: 24,
							"aria-label": t("card.renameInput"),
							onChange: (e) => setDraft(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") commitRename();
								if (e.key === "Escape") setRenaming(false);
							},
							className: "min-w-0 flex-1 rounded-[var(--radius-xs)] border border-ink/20 bg-parchment-2 px-1.5 py-0.5 font-display text-sm tracking-tight text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": t("card.renameSave"),
							title: t("card.renameSave"),
							onClick: commitRename,
							className: "grid size-7 shrink-0 place-items-center rounded text-ink-soft transition-colors hover:bg-ink/10 hover:text-good focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": t("card.renameCancel"),
							title: t("card.renameCancel"),
							onClick: () => setRenaming(false),
							className: "grid size-7 shrink-0 place-items-center rounded text-ink-soft transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex min-w-0 flex-1 basis-16 items-baseline gap-1 font-display text-sm tracking-tight",
					children: [
						no ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-[10px] tabular-nums text-ink-soft",
							children: ["№", no]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: animal.name ?? (hasTrait(animal, "obligateCarnivore") ? t("card.obligateCarnivore") : hasTrait(animal, "carnivore") ? t("card.carnivore") : hasTrait(animal, "swimming") ? t("card.water") : t("card.animal"))
						}),
						onRename ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": t("card.renameAria"),
							title: t("card.renameAria"),
							onPointerDown: (e) => e.stopPropagation(),
							onClick: (e) => {
								e.stopPropagation();
								startRename();
							},
							className: "grid size-7 shrink-0 place-items-center self-center rounded text-ink-soft transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 flex-wrap items-center justify-end gap-1",
					children: [
						(animal.population ?? 1) > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							title: t("card.popTitle", { n: animal.population ?? 1 }),
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
							title: t("card.shelterTitle"),
							className: "flex items-center gap-1 rounded-full bg-leaf/25 px-1.5 text-[10px] font-medium uppercase tracking-wide text-leaf",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full border border-leaf/60 bg-leaf/40" }), t("card.shelter")]
						}) : null,
						animal.sedated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: t("card.sedatedTitle"),
							className: "rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft",
							children: t("card.sedated")
						}) : null,
						animal.traits.some((tr) => tr.paralyzed) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft",
							children: t("card.paralyzed")
						}) : null,
						animal.hibernating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide",
							children: t("card.hibernating")
						}) : fed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-good/20 px-1.5 text-[10px] font-medium uppercase tracking-wide text-good",
							children: t("card.fed")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-clay/15 px-1.5 text-[10px] font-medium uppercase tracking-wide text-clay",
							children: t("card.hungry")
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
					children: t("card.noTraits")
				}) : animal.traits.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitChip, {
					type: tr.type,
					pair: Boolean(tr.pairWith),
					mark: pairMarks?.[tr.id],
					disabled: tr.disabled,
					paralyzed: tr.paralyzed,
					fresh: freshSince !== void 0 && tr.playSeq > freshSince ? true : void 0
				}, tr.id))
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
* Состояния — как у карт: одно кольцо на выбор, приглушение прозрачностью.
*/
function PairPlate({ type, color, note, selected, highlight, dimmed }) {
	const t = useT();
	const lang = useLang();
	const def = TRAITS[type];
	const dark = DARK_ART.has(type);
	const tip = useTraitTip({ isolateClick: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"data-trait-chip": true,
		title: `${traitShort(type, lang)}${note ? ` · ${note}` : ""} — ${traitDesc(type, lang)}`,
		style: color ? {
			borderColor: color,
			backgroundColor: `${color}14`
		} : void 0,
		className: cn("relative flex w-full shrink-0 cursor-help items-center gap-2 self-center rounded-[var(--radius-sm)] border border-dashed border-ink/30 bg-parchment-2/80 px-2 py-1 text-ink shadow-[var(--shadow-card)] sm:w-[58px] sm:flex-col sm:justify-center sm:gap-1 sm:px-1 sm:py-2", selected ? "evo-picked-flat" : highlight ? "ring-2 ring-accent" : "", dimmed ? "opacity-45" : ""),
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
					}) : null, traitShort(type, lang)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-[9px] leading-tight text-ink-soft sm:max-w-full sm:text-center sm:text-[8px]",
					style: color ? { color } : void 0,
					children: note ?? t("card.pair")
				})]
			}),
			tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
				def: {
					...def,
					name: traitName(type, lang),
					description: traitDesc(type, lang)
				},
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
var HandFace = (0, import_react.memo)(function HandFace({ face, divided, active, disabled, dimmed, blocked, onSelect, onBlocked }) {
	const t = useT();
	const lang = useLang();
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
		onClick: (e) => {
			if (blocked) {
				e.stopPropagation();
				onBlocked?.();
				return;
			}
			onSelect();
		},
		"aria-disabled": blocked || void 0,
		className: cn("flex min-h-0 flex-1 flex-col items-stretch text-left outline-none transition-colors duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60", divided ? "border-b border-dashed border-ink/15" : "", active ? "evo-face-picked" : "hover:bg-ink/5", dimmed && "opacity-55"),
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
					children: traitName(face, lang)
				})]
			}),
			def.extraFood ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 pb-1.5 text-[10px] leading-tight text-clay",
				children: t("traitTip.extraFood", { n: def.extraFood })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pb-1.5" })
		]
	}), tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
		def: {
			...def,
			name: traitName(face, lang),
			description: traitDesc(face, lang)
		},
		anchorRect: tip.anchorRect,
		id: tip.tipId
	}) : null] });
});
/**
* Карта руки: кнопка «Животное» плюс по кнопке на каждое свойство грани.
* Перетаскивается целиком (карта в руке — один объект), но клики по кнопкам
* остаются: датчики @dnd-kit включаются только после порога движения.
*/
function HandCard({ card, selected, selectedFace, onSelect, onBlockedFace, blockedFace, disabled, noAnimals, dragRef, dragListeners, dragging }) {
	const t = useT();
	const cardPicked = Boolean(selected) && (selectedFace === null || selectedFace === void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: dragRef,
		...dragListeners,
		onDragStartCapture: (e) => e.preventDefault(),
		"data-card-id": card.id,
		className: cn("relative flex h-[200px] w-[124px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border border-ink/12 bg-parchment text-ink shadow-[var(--shadow-card)]", cardPicked ? "evo-picked" : "", disabled ? "opacity-50" : "cursor-grab active:cursor-grabbing", dragging ? "opacity-40" : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled,
			onClick: () => onSelect("animal"),
			className: cn("flex h-11 items-center justify-center border-b border-ink/10 text-[10px] font-medium uppercase tracking-wider", cardPicked ? "bg-ink text-parchment" : "bg-parchment-2/60 text-ink-soft hover:bg-parchment-2", noAnimals && !selected && "bg-clay/20 text-ink ring-1 ring-inset ring-clay/50"),
			children: t("card.animal")
		}), card.faces.map((face, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandFace, {
			face,
			divided: i === 0 && card.faces.length > 1,
			active: selected && selectedFace === i,
			blocked: blockedFace?.(i),
			onBlocked: () => onBlockedFace?.(i),
			disabled,
			dimmed: noAnimals && !selected,
			onSelect: () => onSelect(i)
		}, `${card.id}-${face}-${i}`))]
	});
}
/**
* «Призрак» карты для DragOverlay: те же грани, но без кнопок и обработчиков —
* в оверлее карта едет под курсором и не должна ловить клики и фокус.
*/
function CardPreview({ card }) {
	const t = useT();
	const lang = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "flex h-[200px] w-[124px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-md)] border border-ink/12 bg-parchment text-ink shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex h-8 items-center justify-center border-b border-ink/10 bg-parchment-2/70 text-[10px] font-medium uppercase tracking-wider text-ink-soft",
			children: t("card.card")
		}), card.faces.map((face, i) => {
			const dark = DARK_ART.has(face);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("flex min-h-0 flex-1 flex-col", i === 0 && card.faces.length > 1 && "border-b border-dashed border-ink/15"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 px-2 pb-1.5 pt-1.5 text-[11px] font-semibold leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
						id: face,
						className: "size-3.5 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: traitName(face, lang)
					})]
				})]
			}, `${card.id}-${face}-${i}`);
		})]
	});
}
/** Плашка свойства растения — как чип свойства животного, но на растении. */
var PlantTraitChip = (0, import_react.memo)(function PlantTraitChip({ type, fresh }) {
	const lang = useLang();
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
			traitShort(type, lang),
			tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
				def: {
					...def,
					name: traitName(type, lang),
					description: traitDesc(type, lang)
				},
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
	const lang = useLang();
	const t = useT();
	const def = PLANTS[plant.kind];
	const art = PLANT_ART[plant.kind];
	const tip = useTraitTip({ toggleOnTap: false });
	const tipDef = {
		id: plant.kind,
		name: `${plantName(plant.kind, lang)} · ${t("card.plant")}`,
		description: plantDesc(plant.kind, lang),
		image: art
	};
	const interactive = Boolean(onClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-plant-id": plant.id,
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"aria-label": `${plantName(plant.kind, lang)} — ${t("card.plant")}`,
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
						children: plantName(plant.kind, lang)
					}),
					def.carnivoreEdible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-1 top-1 size-4 rounded-full border border-ink/30 bg-food-yellow/80 text-center text-[10px] leading-4",
						title: t("card.carnivoreEdible"),
						children: "🍎"
					}) : null,
					plant.kind === "carnivorous" && plant.attackedThisYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute bottom-1 right-1 rounded-full bg-clay/85 px-1.5 text-[9px] font-medium text-parchment",
						title: t("card.plantAttackedTitle"),
						children: t("card.plantAttacked")
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 px-2 py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-0.5",
					title: t("card.foodTokens", {
						n: plant.food,
						m: def.maxFood
					}),
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
							children: t("card.noFood")
						}) : null
					]
				}), plant.shelters > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto flex items-center gap-0.5 rounded-full bg-leaf/25 px-1.5 text-[10px] font-semibold text-leaf",
					title: t("card.sheltersFree", { n: plant.shelters }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full border border-leaf/60 bg-leaf/40" }), plant.shelters]
				}) : null]
			}),
			plant.traits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 px-2 pb-2",
				children: plant.traits.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantTraitChip, { type: tr.type }, tr.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pb-2 pl-2 text-[10px] text-ink-soft",
				children: fresh ? t("card.newPlant") : t("card.noTraits")
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
	const t = useT();
	const lang = useLang();
	const plants = (state.plants ?? []).filter((p) => zone ? (p.zoneId ?? "gondwana") === zone : true);
	if (!plants.length) return null;
	const interactive = Boolean(onPlantClick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": zone ? t("card.plantsStripZone", { zone: territoryName(zone, lang) }) : t("card.plantsStrip"),
		className: "paper-sheet flex min-h-[110px] flex-wrap items-stretch gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full items-center justify-between text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: zone ? t("card.plantsZone", { zone: territoryName(zone, lang) }) : t("card.plantsCommon")
			}), zone ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums",
				children: t("card.plantDeck", {
					n: state.plantDeckCount ?? state.plantDeck?.length ?? 0,
					m: state.plantDiscard ?? 0
				})
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
function ConfirmDialog({ title, body, confirmLabel, cancelLabel = t("common.cancel"), tone = "default", extraLabel, onExtra, onConfirm, onClose }) {
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
					className: "mt-5 flex flex-col gap-3 sm:flex-row sm:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						ref: cancelRef,
						variant: "secondary",
						size: "md",
						className: "h-14 flex-1 sm:h-12",
						onClick: () => requestClose(onClose),
						children: cancelLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: tone === "danger" ? "danger" : "default",
						size: "md",
						className: "h-14 flex-1 sm:h-12",
						onClick: () => requestClose(onConfirm),
						children: confirmLabel
					})]
				}),
				extraLabel && onExtra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => requestClose(onExtra),
					className: "mt-3 w-full rounded-[var(--radius-sm)] px-2 py-2 text-xs text-muted underline decoration-dotted underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: extraLabel
				}) : null
			]
		})
	}), portalHost);
}
/**
* Настоящие 3D-кости с физикой (cannon-es): падают в лоток кормовой базы,
* сталкиваются и сваливаются в кучку, а затем доворачиваются выпавшей гранью
* кверху — значения задаёт движок партии, физика только «оживляет» бросок.
* Пока значения нет, кубики спокойно лежат: без подпрыгиваний и дрожи.
*
* Оформление — «родственник» фишек еды (FoodCube в icons.tsx): тот же красный
* тон кормовой базы, светлая кромка-фаска по ребру и тёплая кость очков.
* Значение читается по ВЕРХНЕЙ грани, как у настоящей кости на столе.
*/
/** Значение грани для материала BoxGeometry: +x, −x, +y, −y, +z, −z. */
var FACE_BY_MATERIAL = [
	1,
	6,
	2,
	5,
	3,
	4
];
/** Нормаль грани со значением в системе кубика (та же раскладка, что выше). */
var FACE_NORMAL = {
	1: [
		1,
		0,
		0
	],
	6: [
		-1,
		0,
		0
	],
	2: [
		0,
		1,
		0
	],
	5: [
		0,
		-1,
		0
	],
	3: [
		0,
		0,
		1
	],
	4: [
		0,
		0,
		-1
	]
};
var UP = new Vector3(0, 1, 0);
var TAU = Math.PI * 2;
/**
* Грань кости рисуется в canvas 512×512. Кромка (внешние ~5.5% — ровно доля
* скругления геометрии) — «фаска»: светлая сверху-слева, тёмная снизу-справа,
* как светлое ребро фишек еды. Середина грани — плита с бумажной фактурой.
*/
var FACE_PX = 512;
var PLATE_INSET = .055;
/** Радиус очка в долях грани: как у настоящей кости, с зазором между рядами. */
var PIP_R = .088;
/** Центры очков в долях грани (0…1). Ряды через 0.22–0.25 — точки не слипаются. */
var PIP_LAYOUT = {
	1: [[.5, .5]],
	2: [[.28, .28], [.72, .72]],
	3: [
		[.28, .28],
		[.5, .5],
		[.72, .72]
	],
	4: [
		[.28, .28],
		[.72, .28],
		[.28, .72],
		[.72, .72]
	],
	5: [
		[.28, .28],
		[.72, .28],
		[.5, .5],
		[.28, .72],
		[.72, .72]
	],
	6: [
		[.3, .25],
		[.7, .25],
		[.3, .5],
		[.7, .5],
		[.3, .75],
		[.7, .75]
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
/** Прямоугольник со скруглёнными углами (arcTo — без опоры на ctx.roundRect). */
function roundedPath(ctx, x, y, w, h, r) {
	const rr = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + rr, y);
	ctx.arcTo(x + w, y, x + w, y + h, rr);
	ctx.arcTo(x + w, y + h, x, y + h, rr);
	ctx.arcTo(x, y + h, x, y, rr);
	ctx.arcTo(x, y, x + w, y, rr);
	ctx.closePath();
}
/**
* Очко-углубление: тень вокруг, тёплая кость со скошенной в тень верхней
* стенкой, тёмная кромка отверстия и блик на нижней стенке. Так точка
* читается как выбранная в кости, а не как наклейка.
*/
function drawPip(ctx, cx, cy, r) {
	const hole = ctx.createRadialGradient(cx, cy, r * .8, cx, cy, r * 1.5);
	hole.addColorStop(0, "rgba(34,18,10,0)");
	hole.addColorStop(.5, "rgba(34,18,10,0.3)");
	hole.addColorStop(1, "rgba(34,18,10,0)");
	ctx.fillStyle = hole;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 1.5, 0, TAU);
	ctx.fill();
	const bone = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
	bone.addColorStop(0, "#c6b795");
	bone.addColorStop(.45, "#f1e7cf");
	bone.addColorStop(1, "#fffaf0");
	ctx.fillStyle = bone;
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, TAU);
	ctx.fill();
	ctx.lineWidth = Math.max(1.5, r * .16);
	ctx.strokeStyle = "rgba(46,26,14,0.55)";
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, TAU);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx + r * .16, cy + r * .18, r * .66, Math.PI * .12, Math.PI * .88);
	ctx.strokeStyle = "rgba(255,255,255,0.5)";
	ctx.lineWidth = Math.max(1.5, r * .24);
	ctx.lineCap = "round";
	ctx.stroke();
}
/**
* Грань кости: фаска по ребру, плита в тон кормовой базы с бумажной фактурой,
* объёмным светом от верхнего левого угла и очками-углублениями.
*/
function dieFaceTexture(value, paper, tint) {
	const S = FACE_PX;
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = S;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = tint;
	ctx.fillRect(0, 0, S, S);
	const bevel = ctx.createLinearGradient(0, 0, S, S);
	bevel.addColorStop(0, "rgba(255,247,228,0.62)");
	bevel.addColorStop(.3, "rgba(255,247,228,0.1)");
	bevel.addColorStop(.7, "rgba(26,12,6,0.12)");
	bevel.addColorStop(1, "rgba(26,12,6,0.5)");
	ctx.fillStyle = bevel;
	ctx.fillRect(0, 0, S, S);
	const inset = S * PLATE_INSET;
	const plate = S - inset * 2;
	const radius = S * .16;
	ctx.save();
	roundedPath(ctx, inset, inset, plate, plate, radius);
	ctx.clip();
	ctx.fillStyle = tint;
	ctx.fillRect(inset, inset, plate, plate);
	const dome = ctx.createRadialGradient(S * .34, S * .3, S * .04, S * .5, S * .52, S * .8);
	dome.addColorStop(0, "rgba(255,246,226,0.38)");
	dome.addColorStop(.55, "rgba(255,255,255,0)");
	dome.addColorStop(1, "rgba(28,16,8,0.3)");
	ctx.fillStyle = dome;
	ctx.fillRect(inset, inset, plate, plate);
	if (paper) {
		ctx.globalAlpha = .22;
		ctx.drawImage(paper, inset, inset, plate, plate);
		ctx.globalAlpha = 1;
	}
	ctx.restore();
	roundedPath(ctx, inset, inset, plate, plate, radius);
	ctx.lineWidth = S * .011;
	ctx.strokeStyle = "rgba(40,22,12,0.34)";
	ctx.stroke();
	for (const [fx, fy] of PIP_LAYOUT[value] ?? PIP_LAYOUT[1]) drawPip(ctx, fx * S, fy * S, PIP_R * S);
	const tex = new CanvasTexture(canvas);
	tex.colorSpace = SRGBColorSpace;
	return tex;
}
/** Детерминированный ГПСЧ: один и тот же бросок выглядит одинаково. */
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 >>> 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function seedFrom(text) {
	let h = 2166136261;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
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
					cleanup = buildScene(canvasRef.current, paper, tint, rollKey);
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
	function buildScene(canvas, paper, tint, seed) {
		const renderer = new WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			preserveDrawingBuffer: true
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height, false);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = 2;
		renderer.shadowMap.autoUpdate = false;
		const aspect = width / height;
		const frustumH = 2.85;
		const frustumW = frustumH * aspect;
		const camera = new OrthographicCamera(-frustumW / 2, frustumW / 2, frustumH / 2, -2.85 / 2, .1, 60);
		camera.position.set(0, 5.6, 3);
		camera.lookAt(0, .42, 0);
		const scene = new Scene();
		scene.add(new AmbientLight(16774372, .5));
		scene.add(new HemisphereLight(16775404, 4864556, .6));
		const key = new DirectionalLight(16774111, 1.55);
		key.position.set(2.2, 8, 2.4);
		key.castShadow = true;
		key.shadow.mapSize.set(768, 768);
		key.shadow.camera.left = -3.6;
		key.shadow.camera.right = 3.6;
		key.shadow.camera.top = 3.6;
		key.shadow.camera.bottom = -3.6;
		key.shadow.camera.near = 1;
		key.shadow.camera.far = 24;
		key.shadow.normalBias = .02;
		key.shadow.camera.updateProjectionMatrix();
		scene.add(key);
		const fill = new DirectionalLight(11124950, .32);
		fill.position.set(-4, 2.4, -2.6);
		scene.add(fill);
		const rim = new DirectionalLight(16770754, .4);
		rim.position.set(-2.4, 1.8, 4.2);
		scene.add(rim);
		const floor = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: .3 }));
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		scene.add(floor);
		const world = new World({ gravity: new Vec3(0, -20, 0) });
		world.broadphase = new SAPBroadphase(world);
		if (world.solver instanceof GSSolver) world.solver.iterations = 12;
		world.allowSleep = true;
		const diceMaterial = new Material("dice");
		const floorMaterial = new Material("floor");
		world.addContactMaterial(new ContactMaterial(floorMaterial, diceMaterial, {
			restitution: .12,
			friction: .62
		}));
		world.addContactMaterial(new ContactMaterial(diceMaterial, diceMaterial, {
			restitution: .06,
			friction: .25
		}));
		const ground = new Body({
			mass: 0,
			shape: new Plane(),
			material: floorMaterial
		});
		ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		world.addBody(ground);
		const diceCount = Math.max(valuesRef.current.length, 1);
		const wallX = Math.max(Math.min(frustumW / 2 - .68, .66 * n - .02), .95);
		for (const [normal, point] of [
			[new Vec3(1, 0, 0), new Vec3(-wallX, 0, 0)],
			[new Vec3(-1, 0, 0), new Vec3(wallX, 0, 0)],
			[new Vec3(0, 0, 1), new Vec3(0, 0, -.86)],
			[new Vec3(0, 0, -1), new Vec3(0, 0, .86)]
		]) {
			const wall = new Body({
				mass: 0,
				shape: new Plane(),
				material: floorMaterial
			});
			wall.quaternion.setFromVectors(new Vec3(0, 0, 1), normal);
			wall.position.copy(point);
			world.addBody(wall);
		}
		const geometry = new RoundedBoxGeometry(1, 1, 1, 4, .07);
		const materialsByValue = /* @__PURE__ */ new Map();
		const maxAniso = renderer.capabilities.getMaxAnisotropy();
		const materialFor = (value) => {
			let m = materialsByValue.get(value);
			if (!m) {
				const map = dieFaceTexture(value, paper, tint);
				map.anisotropy = Math.min(4, maxAniso);
				m = new MeshPhysicalMaterial({
					map,
					roughness: .42,
					metalness: 0,
					clearcoat: .3,
					clearcoatRoughness: .55
				});
				materialsByValue.set(value, m);
			}
			return m;
		};
		const rand = mulberry32(seedFrom(seed));
		const dice = [];
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
				sleepSpeedLimit: .2,
				sleepTimeLimit: .2
			});
			body.linearDamping = .15;
			body.angularDamping = .25;
			const tilt = () => (rand() * 2 - 1) * .18;
			const yaw = Math.floor(rand() * 4) * (Math.PI / 2) + (rand() - .5) * .12;
			const laneStep = diceCount === 1 ? 0 : Math.min(1.2, Math.max(wallX - .62, .5) * 2);
			const lane = (i - (diceCount - 1) / 2) * laneStep;
			body.position.set(lane + (rand() * 2 - 1) * .05, .72 + i * .42, (rand() * 2 - 1) * .15);
			body.quaternion.setFromEuler(tilt(), yaw, tilt());
			body.velocity.set((rand() * 2 - 1) * .2, -.6 - rand() * .4, (rand() * 2 - 1) * .2);
			body.angularVelocity.set((rand() * 2 - 1) * 1.2, (rand() * 2 - 1) * 1.2, (rand() * 2 - 1) * 1.2);
			world.addBody(body);
			dice.push({
				mesh,
				body,
				target: null,
				restY: .5
			});
		}
		/** Страховка: тело, вылетевшее из лотка (не должно случаться), возвращаем. */
		const keepInside = (d) => {
			const p = d.body.position;
			if (p.y > 3.2 || p.y < -1 || Math.abs(p.x) > wallX + .6 || Math.abs(p.z) > 1.46) {
				p.set(0, 1.3, 0);
				d.body.quaternion.set(0, 0, 0, 1);
				d.body.velocity.setZero();
				d.body.angularVelocity.setZero();
			}
		};
		const targetOf = (value, index) => {
			const nrm = FACE_NORMAL[value] ?? FACE_NORMAL[3];
			const align = new Quaternion().setFromUnitVectors(new Vector3(nrm[0], nrm[1], nrm[2]), UP);
			const yaw = ((value * 7 + index * 5) % 9 / 9 * 2 - 1) * .13;
			return new Quaternion().setFromAxisAngle(UP, yaw).multiply(align);
		};
		let raf = 0;
		let last = performance.now();
		let elapsed = 0;
		let settleT = 0;
		let settled = false;
		let done = false;
		/** Сколько секунд подряд кучка стоит почти неподвижно. */
		let quiet = 0;
		const loop = (now) => {
			const dt = Math.min((now - last) / 1e3, .05);
			last = now;
			elapsed += dt;
			if (!done) renderer.shadowMap.needsUpdate = true;
			if (!settled) {
				world.step(1 / 60, dt, 3);
				for (const d of dice) {
					keepInside(d);
					d.mesh.position.copy(d.body.position);
					d.mesh.quaternion.copy(d.body.quaternion);
				}
				const vals = valuesRef.current;
				const valsReady = vals.length >= dice.length && vals.slice(0, dice.length).every((v) => v != null);
				quiet = dice.every((d) => d.body.sleepState === Body.SLEEPING || d.body.velocity.lengthSquared() < .2 && d.body.angularVelocity.lengthSquared() < .7) ? quiet + dt : 0;
				if (valsReady && (elapsed > .25 && quiet > .22 || elapsed > 1.5)) {
					settled = true;
					settleT = 0;
					for (let i = 0; i < dice.length; i++) {
						dice[i].target = targetOf(vals[i] ?? 3, i);
						const y = dice[i].mesh.position.y;
						dice[i].restY = y > .5 && y < .8 ? .5 : y;
					}
				}
				renderer.render(scene, camera);
				raf = requestAnimationFrame(loop);
				return;
			}
			settleT += dt;
			const p = Math.min(settleT / .32, 1);
			const lift = .22 * Math.sin(Math.PI * p);
			for (const d of dice) {
				if (!d.target) continue;
				d.mesh.quaternion.slerp(d.target, Math.min(1, dt * 13));
				const targetY = d.restY + lift;
				d.mesh.position.y += (targetY - d.mesh.position.y) * Math.min(1, dt * 16);
			}
			if (p >= 1) {
				done = true;
				for (const d of dice) {
					if (!d.target) continue;
					d.mesh.quaternion.copy(d.target);
					d.mesh.position.y = d.restY;
				}
				renderer.render(scene, camera);
				raf = 0;
				return;
			}
			renderer.render(scene, camera);
			raf = requestAnimationFrame(loop);
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
/** Место зрителя в сетевом столе (см. seat в FeedItem). */
var SPECTATOR_SEAT = -2;
/** Окно, в котором подряд идущие реплики одного автора считаются одним блоком. */
var GROUP_WINDOW_MS = 18e4;
/**
* Мягкая подложка реплики: цвет автора, подмешанный к фону поверхностей, —
* та же формула, что у секции игрока в партии (`seatTint` в game-app.tsx).
* Экспортируется, чтобы лента и табло красились одинаково из одного места.
*/
function feedTint(color) {
	return `color-mix(in oklab, ${color} 12%, var(--color-surface))`;
}
/**
* Сдвиг листа бумаги на реплике: строки одного блока красятся одним цветом и
* без сдвига каждая начинала бы текстуру с одного и того же угла тайла — бумага
* выглядела бы штампованной. Сдвиг детерминирован по id записи, поэтому
* перерисовки и SSR его не меняют. 380px — размер тайла paper-sheet.
*/
function textureShift(id) {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = h * 31 + id.charCodeAt(i) >>> 0;
	return `${h % 380}px ${(h >>> 9) % 380}px`;
}
/**
* Скругление строки «карточки автора»: внешние углы блока — у первой строки
* сверху, у последней снизу; продолжения внутри блока прямые, чтобы подряд
* идущие реплики срастались в один лист.
*/
function blockRadius(grouped, tail) {
	if (!grouped) return tail ? "rounded-[var(--radius-sm)]" : "rounded-t-[var(--radius-sm)] rounded-b-none";
	return tail ? "rounded-b-[var(--radius-sm)] rounded-t-none" : "rounded-none";
}
var KIND_CLASS = {
	system: "italic text-subtle",
	action: "text-fg",
	important: "border-l-2 border-accent bg-accent/10 font-medium text-fg",
	chat: "text-fg"
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
function timeLabel(at, lang) {
	return new Date(at).toLocaleTimeString(lang === "en" ? "en-GB" : "ru-RU", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
/**
* Высота нижнего дока (footer игры) — оверлей журнала не должен его накрывать:
* в фазе развития док высокий из-за карты руки. Меряем при раскрытии, при
* ресайзе окна и при изменении самого футера (смена фазы, модулей, вёрстки).
*/
function useDockInset(active) {
	const [inset, setInset] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
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
* Группировка подряд идущих реплик одного автора (по имени и месту) в пределах
* GROUP_WINDOW_MS: ник и время показывает только первая строка блока, дальше —
* плотный список без повторов. Любая не-чатовая запись блок разрывает.
*/
function groupItems(items) {
	const rows = [];
	for (const item of items) {
		const prev = rows[rows.length - 1]?.item;
		const continues = prev !== void 0 && prev.kind === "chat" && item.kind === "chat" && Boolean(item.playerName) && prev.playerName === item.playerName && prev.seat === item.seat && prev.at !== void 0 && item.at !== void 0 && item.at >= prev.at && item.at - prev.at <= GROUP_WINDOW_MS;
		rows.push({
			item,
			grouped: continues,
			tail: true
		});
	}
	for (let i = 0; i < rows.length - 1; i++) if (rows[i + 1].grouped) rows[i].tail = false;
	return rows;
}
/** Слить агрегаты реакций из пропсов и локальные (оптимистичные). */
function mergeReactions(have, local) {
	if (!local.length) return have ?? [];
	const out = [...have ?? []];
	for (const r of local) {
		const i = out.findIndex((x) => x.emoji === r.emoji);
		if (i < 0) out.push(r);
		else out[i] = {
			emoji: r.emoji,
			count: Math.max(out[i].count, r.count),
			mine: Boolean(out[i].mine || r.mine)
		};
	}
	return out;
}
/**
* Агрегат реакций по сообщениям: chatId → список эмодзи с числом и «моя ли».
* Сервер отдаёт реакции потоком (дельты по sinceReactionId), поэтому сводку
* по конкретной реплике собираем здесь: чипы под сообщением должны показывать
* все реакции на него, а не последние 30 событий стола.
* `myName` — моё имя за столом (у реакций нет места, только имя автора).
*/
function reactionsByChatId(reactions, myName) {
	const acc = /* @__PURE__ */ new Map();
	for (const r of reactions ?? []) {
		if (r.chatId === null || r.chatId === void 0) continue;
		let byEmoji = acc.get(r.chatId);
		if (!byEmoji) {
			byEmoji = /* @__PURE__ */ new Map();
			acc.set(r.chatId, byEmoji);
		}
		const cur = byEmoji.get(r.emoji);
		const mine = Boolean(myName) && r.name === myName;
		if (cur) {
			cur.count += 1;
			cur.mine = cur.mine || mine;
		} else byEmoji.set(r.emoji, {
			count: 1,
			mine
		});
	}
	const out = /* @__PURE__ */ new Map();
	for (const [chatId, byEmoji] of acc) out.set(chatId, [...byEmoji].map(([emoji, v]) => ({
		emoji,
		count: v.count,
		...v.mine ? { mine: true } : {}
	})));
	return out;
}
/**
* Строка «кто печатает» над композером: один — «Аня печатает…», двое — по
* именам, трое и больше — без перечисления (иначе строка не влезает).
* Локализация — по явному языку (в рендере передавайте снапшот useLang()).
*/
function typingLabel(names, lang) {
	const list = names ?? [];
	if (!list.length) return "";
	if (list.length === 1) return translate(lang, "feed.typingOne", { name: list[0] });
	if (list.length === 2) return translate(lang, "feed.typingTwo", {
		a: list[0],
		b: list[1]
	});
	return translate(lang, "feed.typingMany");
}
/** Поставить/снять свою реакцию в локальном слое (до серверного учёта). */
function toggleMine(prev, emoji) {
	const found = prev.find((r) => r.emoji === emoji);
	if (!found) return [...prev, {
		emoji,
		count: 1,
		mine: true
	}];
	if (!found.mine) return prev.map((r) => r.emoji === emoji ? {
		...r,
		count: r.count + 1,
		mine: true
	} : r);
	if (found.count > 1) return prev.map((r) => r.emoji === emoji ? {
		...r,
		count: r.count - 1,
		mine: false
	} : r);
	return prev.filter((r) => r.emoji !== emoji);
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
function FeedRow({ item, grouped, tail, onReact }) {
	const rowRef = (0, import_react.useRef)(null);
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	const t = useT();
	const lang = useLang();
	const [localReactions, setLocalReactions] = (0, import_react.useState)([]);
	const isChat = item.kind === "chat";
	const canReact = Boolean(onReact) && isChat;
	const tint = isChat && item.color ? feedTint(item.color) : void 0;
	const chips = mergeReactions(item.reactions, localReactions);
	(0, import_react.useEffect)(() => {
		if (!pickerOpen) return;
		const onDown = (event) => {
			if (!rowRef.current?.contains(event.target)) setPickerOpen(false);
		};
		const onKey = (event) => {
			if (event.key === "Escape") setPickerOpen(false);
		};
		document.addEventListener("pointerdown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [pickerOpen]);
	const react = (emoji) => {
		setPickerOpen(false);
		setLocalReactions((prev) => toggleMine(prev, emoji));
		onReact?.(emoji);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		ref: rowRef,
		"data-feed-item": item.kind,
		"data-author": item.playerName,
		className: cn("feed-item-in group relative grid grid-cols-[2.6rem_minmax(0,1fr)] items-start gap-x-1.5 px-2 text-xs", item.kind === "system" ? "py-0.5 text-[10px] leading-4" : grouped ? "py-0.5" : "py-1", KIND_CLASS[item.kind], canReact && "pr-7", tint && "paper-sheet", isChat && !tint && "bg-surface-2/60", tint ? blockRadius(grouped, tail) : "rounded-[var(--radius-sm)]", !(grouped && tint) && "mt-1"),
		style: tint ? {
			backgroundColor: tint,
			backgroundPosition: textureShift(item.id)
		} : void 0,
		children: [
			!grouped && item.at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
				dateTime: new Date(item.at).toISOString(),
				className: "mt-px font-mono text-[10px] leading-4 text-subtle tabular-nums",
				children: timeLabel(item.at, lang)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "aria-hidden": true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex min-w-0 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 break-words",
					children: [
						item.kind === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "mr-1.5 inline-block size-1 rounded-full bg-subtle/80 align-middle"
						}) : null,
						!grouped && item.playerName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							style: item.color ? { color: item.color } : void 0,
							children: [item.playerName, isChat ? ": " : " — "]
						}) : null,
						item.text
					]
				}), chips.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 flex flex-wrap items-center gap-1",
					children: chips.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": Boolean(r.mine),
						"aria-label": t("game.reactionCount", {
							emoji: r.emoji,
							n: r.count
						}),
						disabled: !canReact,
						onClick: () => react(r.emoji),
						className: cn("inline-flex h-5 min-w-5 items-center justify-center gap-0.5 rounded-full border px-1.5 text-[10px] leading-none transition-colors duration-[var(--motion-fast)]", r.mine ? "border-accent bg-accent/15 text-fg" : "border-border bg-surface/80 text-muted hover:bg-surface-2"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs leading-none",
							children: r.emoji
						}), r.count > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: r.count
						}) : null]
					}, r.emoji))
				}) : null]
			}),
			canReact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": t("game.addReaction"),
				title: t("game.reactionTitle"),
				"aria-expanded": pickerOpen,
				onClick: () => setPickerOpen((v) => !v),
				className: cn("absolute right-1 top-1 grid size-11 place-items-center rounded-full text-subtle transition-opacity duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg focus-visible:opacity-100 xl:size-6", pickerOpen ? "opacity-100" : "opacity-60 sm:opacity-0 sm:group-hover:opacity-100"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmilePlus, { className: "size-3.5" })
			}), pickerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "group",
				"aria-label": t("game.reactions"),
				className: "absolute right-1 top-7 z-10 flex gap-0.5 rounded-full border border-border bg-surface p-0.5 shadow-[var(--shadow-card)]",
				children: REACTION_EMOJI.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": t("game.reactionOf", { emoji }),
					onClick: () => react(emoji),
					className: "grid size-11 place-items-center rounded-full text-base leading-none transition-transform duration-[var(--motion-fast)] hover:scale-110 hover:bg-surface-2 xl:size-7",
					children: emoji
				}, emoji))
			}) : null] }) : null
		]
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
* Внутри: фильтры «Всё/События/Чат» (кнопки, не списки; «Зрители» — только
* когда зрительские реплики есть в ленте), быстрые фразы, кнопка броска
* кубика в чат, счётчик непрочитанного и автоскролл.
*/
function EventFeed({ items, open, onToggle, onSend, onReact, onTyping, typingNames, quickPhrases, title, titleId, className, variant = "dock" }) {
	const t = useT();
	const lang = useLang();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const titleText = title ?? t("feed.title.default");
	const unread = useGameStore((s) => s.logUnread);
	const setUnread = useGameStore((s) => s.setLogUnread);
	const [chatUnread, setChatUnread] = (0, import_react.useState)(false);
	const listRef = (0, import_react.useRef)(null);
	const listSheetRef = (0, import_react.useRef)(null);
	const pinnedRef = (0, import_react.useRef)(true);
	const prevCountRef = (0, import_react.useRef)(items.length);
	const ownQueueRef = (0, import_react.useRef)([]);
	const dockInset = useDockInset(open && variant === "dock");
	/** Живой список ленты: первый из отрисованных, у которого есть высота. */
	const activeList = (0, import_react.useCallback)(() => {
		const a = listRef.current;
		if (a && a.clientHeight > 0) return a;
		const b = listSheetRef.current;
		if (b && b.clientHeight > 0) return b;
		return a ?? b;
	}, []);
	const hasSpectators = (0, import_react.useMemo)(() => items.some((i) => i.kind === "chat" && i.seat === SPECTATOR_SEAT), [items]);
	const filterDefs = [
		["all", t("feed.filter.all")],
		["log", t("feed.filter.log")],
		["chat", t("feed.filter.chat")],
		...hasSpectators ? [["spectators", t("feed.filter.spectators")]] : []
	];
	const rows = (0, import_react.useMemo)(() => groupItems(items.filter((i) => {
		if (filter === "all") return true;
		if (filter === "chat") return i.kind === "chat";
		if (filter === "spectators") return i.kind === "chat" && i.seat === SPECTATOR_SEAT;
		return i.kind !== "chat";
	})), [items, filter]);
	(0, import_react.useEffect)(() => {
		if (filter === "spectators" && !hasSpectators) setFilter("all");
	}, [filter, hasSpectators]);
	(0, import_react.useEffect)(() => {
		const added = items.length - prevCountRef.current;
		prevCountRef.current = items.length;
		const queue = ownQueueRef.current;
		let own = false;
		if (queue.length) {
			const now = Date.now();
			const fresh = queue.filter((q) => now - q.at < 6e4);
			ownQueueRef.current = fresh;
			own = fresh.some((q) => items.some((i) => i.kind === "chat" && i.text === q.text && (i.at ?? 0) >= q.at - 2e3));
			if (own) ownQueueRef.current = [];
		}
		if (!own && added <= 0) return;
		if (open && (pinnedRef.current || own)) {
			const el = activeList();
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
	}, [
		items,
		open,
		setUnread,
		activeList
	]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		pinnedRef.current = true;
		setUnread(0);
		setChatUnread(false);
		const el = activeList();
		if (el) scrollToEnd(el, false);
	}, [
		open,
		setUnread,
		activeList
	]);
	const onScroll = (0, import_react.useCallback)((el) => {
		const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 24;
		pinnedRef.current = atBottom;
		if (atBottom) setUnread(0);
	}, [setUnread]);
	const send = (raw) => {
		const text = raw.trim();
		if (!text || !onSend) return;
		onSend(text);
		setDraft("");
		ownQueueRef.current = [...ownQueueRef.current.slice(-4), {
			text,
			at: Date.now()
		}];
	};
	const last = items.length ? items[items.length - 1] : void 0;
	const lastText = last ? `${last.playerName ? `${last.playerName}: ` : ""}${last.text}` : t("feed.emptyTitle");
	const unreadLabel = unread > 99 ? "99+" : String(unread);
	const typingText = typingLabel(typingNames, lang);
	const filters = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"aria-label": t("feed.filterGroup"),
		className: "flex flex-wrap items-center gap-0.5 rounded-full bg-ink/25 p-0.5",
		children: filterDefs.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-pressed": filter === id,
			onClick: () => setFilter(id),
			className: cn("h-11 min-w-11 rounded-full px-3 text-[11px] font-medium transition-colors duration-[var(--motion-fast)] xl:h-8 xl:min-w-0 xl:px-2.5", filter === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
			children: label
		}, id))
	});
	const composer = onSend ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border px-2.5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-typing-line": true,
				role: "status",
				"aria-live": "polite",
				className: cn("min-h-4 truncate px-1 text-[10px] leading-4 transition-opacity duration-[var(--motion-fast)]", typingText ? "text-subtle opacity-100" : "opacity-0"),
				children: typingText
			}),
			quickPhrases?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1.5 flex flex-wrap gap-1",
				role: "group",
				"aria-label": t("feed.quickPhrases"),
				children: quickPhrases.map((phrase) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => send(phrase),
					className: "min-h-11 min-w-11 rounded-full border border-border bg-surface px-3 py-1 text-[10px] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg xl:min-h-7 xl:min-w-0 xl:px-2 xl:py-0.5",
					children: phrase
				}, phrase))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
						className: "max-xl:size-11",
						"aria-label": t("feed.diceButton"),
						title: t("feed.diceButton"),
						onClick: () => send(`🎲 ${1 + Math.floor(Math.random() * 6)}`),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft,
						onChange: (event) => {
							const next = event.target.value;
							setDraft(next);
							if (next.trim()) onTyping?.();
						},
						onFocus: (event) => {
							const el = event.currentTarget;
							window.setTimeout(() => el.scrollIntoView({ block: "nearest" }), 250);
						},
						onKeyDown: (event) => {
							if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
								event.preventDefault();
								send(draft);
							}
						},
						rows: 1,
						placeholder: t("feed.placeholder"),
						"aria-label": t("feed.messageAria"),
						className: "max-h-20 min-h-11 flex-1 resize-none rounded-[var(--radius-sm)] border border-border bg-bg/60 px-2.5 py-1.5 text-xs leading-5 text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:min-h-9"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "secondary",
						size: "iconSm",
						className: "max-xl:size-11",
						"aria-label": t("feed.send"),
						disabled: !draft.trim(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})
				]
			})
		]
	}) : null;
	const list = (heightClass, ref = listRef) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			onScroll: (event) => onScroll(event.currentTarget),
			role: "log",
			"aria-live": "polite",
			"aria-relevant": "additions",
			"aria-label": t("feed.entries", { title: titleText }),
			className: cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 py-1.5", heightClass),
			children: rows.length ? rows.map(({ item, grouped, tail }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedRow, {
				item,
				grouped,
				tail,
				onReact: onReact ? (emoji) => onReact(item, emoji) : void 0
			}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-1 italic text-subtle",
				children: t("feed.empty")
			})
		}), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: jumpToLatest,
			"aria-label": t("feed.showNew", { n: unread }),
			className: "absolute bottom-1.5 right-1.5 z-10 inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-fg shadow-[var(--shadow-card)] transition-colors duration-[var(--motion-fast)] hover:bg-surface-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" }),
				t("feed.newEntries"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-accent-fg",
					children: unreadLabel
				})
			]
		}) : null]
	});
	const jumpToLatest = () => {
		const el = activeList();
		if (el) scrollToEnd(el, !reducedMotion());
		pinnedRef.current = true;
		setUnread(0);
	};
	if (variant === "panel") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-feed-panel": true,
		className: cn("flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border px-2.5 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					id: titleId,
					tabIndex: titleId ? -1 : void 0,
					className: "min-w-0 flex-1 truncate text-sm font-medium text-muted",
					children: titleText
				}), filters]
			}),
			list("text-sm"),
			composer
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		"aria-label": titleText,
		className: cn("relative hidden shrink-0 flex-col overflow-hidden border-l border-border bg-surface/95 backdrop-blur-sm transition-all duration-300 ease-[var(--ease-out)] xl:flex", "xl:h-full xl:max-h-dvh", open ? "w-[340px]" : "w-14", className),
		children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border px-2.5 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate text-sm font-medium text-muted",
						children: titleText
					}),
					filters,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onToggle(false),
						"aria-label": t("feed.collapse", { title: titleText }),
						"aria-expanded": true,
						className: "grid size-7 max-xl:size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] text-subtle transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg",
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
				"aria-label": unread > 0 ? t("feed.expandUnread", {
					title: titleText,
					n: unread
				}) : t("feed.expand", { title: titleText }),
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
			"aria-label": titleText,
			style: { "--feed-dock": `${dockInset}px` },
			className: cn("fixed inset-x-0 bottom-0 top-0 z-50 flex max-h-dvh flex-col bg-surface sm:left-auto sm:right-0 sm:w-[380px] sm:bottom-[var(--feed-dock,0px)] sm:border-l sm:border-border sm:shadow-[var(--shadow-card)]", "animate-[fade-in_.2s_var(--ease-out)]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-border px-2.5 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onToggle(false),
							"aria-label": t("feed.collapse", { title: titleText }),
							className: "grid size-8 max-xl:size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-2 hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-sm font-medium text-muted",
							children: titleText
						}),
						filters
					]
				}),
				list("text-sm", listSheetRef),
				composer
			]
		}) : null
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
* Звук в шапке: одна иконка-динамик, клик по ней открывает панель (как просил
* владелец — «иконка звука открывает панельку»), а в панели уже можно совсем
* выключить звук тумблером или приглушить слайдерами эффектов и фона. Иконка
* отражает состояние шины: `Volume2` — звук есть, `Volume1` — включён, но обе
* шины почти в нуле, `VolumeX` — выключен. Состояние читается из шины `sfx` по
* подписке, поэтому все экземпляры на странице (и в соседних вкладках)
* показывают одно и то же, а не своё локальное значение.
*/
/** Ниже этого значения обе шины считаются «приглушёнными» — иконка тише. */
var QUIET_THRESHOLD = .34;
function SoundToggle() {
	const tt = useT();
	const [open, setOpen] = (0, import_react.useState)(false);
	const on = (0, import_react.useSyncExternalStore)(subscribeSfx, readEnabled, readEnabledOnServer);
	const [volume, setVolume] = (0, import_react.useState)(() => sfx.volume);
	const rootRef = (0, import_react.useRef)(null);
	const panelId = (0, import_react.useId)();
	const sfxSliderId = (0, import_react.useId)();
	const ambientSliderId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => sfx.subscribe(() => setVolume(sfx.volume)), []);
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
	const quiet = on && Math.max(volume.sfxVolume, volume.ambientVolume) <= QUIET_THRESHOLD;
	const soundState = !on ? "off" : quiet ? "quiet" : "on";
	const SoundIcon = soundState === "off" ? VolumeX : soundState === "quiet" ? Volume1 : Volume2;
	const hint = soundState === "off" ? tt("sound.off") : soundState === "quiet" ? tt("sound.quiet") : tt("sound.on");
	const toggleSound = () => sfx.setEnabled(!sfx.enabled);
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
		if (!sfx.enabled) {
			sfx.setEnabled(true);
			return;
		}
		sfx.play("food", 0, { gain: .9 });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "relative inline-flex items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			"aria-label": tt("sound.settings"),
			"aria-haspopup": "dialog",
			"aria-expanded": open,
			"aria-controls": open ? panelId : void 0,
			"aria-pressed": on,
			"data-sound": soundState,
			title: hint,
			onClick: () => setOpen((v) => !v),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundIcon, { className: "size-4" })
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: panelId,
			role: "dialog",
			"aria-label": tt("sound.settings"),
			className: "absolute right-0 top-full z-50 mt-2 w-60 rounded-[var(--radius-md)] border border-border bg-surface p-3 text-sm shadow-[var(--shadow-card)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "switch",
					"aria-checked": on,
					onClick: toggleSound,
					className: "flex w-full items-center justify-between rounded-[var(--radius-sm)] px-1 py-1.5 text-left text-fg hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tt("sound.toggle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
							children: tt("sound.sfx")
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
						className: "range-evo mt-1 w-full"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: ambientSliderId,
							children: tt("sound.ambient")
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
						className: "range-evo mt-1 w-full"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					className: "mt-3 w-full",
					onClick: testSound,
					children: tt("sound.test")
				})
			]
		})]
	});
}
var subscribeSfx = (listener) => sfx.subscribe(listener);
var readEnabled = () => sfx.enabled;
var readEnabledOnServer = () => true;
/**
* Компактный переключатель языка для шапки. Кнопка показывает код целевого
* языка («EN» когда интерфейс русский, «RU» когда английский) — коротко
* даже на 390px, а направление понятно из подписи и содержимого.
* Текущий язык хранит i18n-стор: все шапки на странице переключаются сразу.
*/
function LangToggle() {
	const lang = useLang();
	const tt = useT();
	const target = lang === "ru" ? "EN" : "RU";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-lang-toggle": target.toLowerCase(),
		"aria-label": tt("lang.switch"),
		title: tt("lang.switch"),
		onClick: () => {
			sfx.play("click");
			toggleLang();
		},
		className: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg flex h-9 max-xl:h-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface px-2 font-display text-xs font-semibold tracking-[0.14em] text-fg hover:bg-surface-2 transition-colors duration-[var(--motion-fast)]",
		children: target
	});
}
/**
* Общая шапка меню и игрового стола: лого, название и правый слот действий.
* Классы совпадают с прежними шапками из screens.tsx и game-app.tsx.
* Переключатель языка встроен в самый конец правого слота — он виден во всех
* трёх местах использования шапки (меню, лобби, партия).
*/
function TopBar({ subtitle, subtitleShort, children, left, className }) {
	const lang = useLang();
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
				children: lang === "en" ? "Evolution" : "Эволюция"
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
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-wrap items-center justify-end gap-1",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {})]
		})]
	});
}
var PHASES = [
	"tutorial.phase.dev",
	"tutorial.phase.foodBase",
	"tutorial.phase.feed",
	"tutorial.phase.ext"
];
var SLIDES = [
	{
		title: "tutorial.s1.title",
		paragraphs: [
			"tutorial.s1.p1",
			"tutorial.s1.p2",
			"tutorial.s1.p3"
		]
	},
	{
		art: "/img/tutorial/place-card.jpg",
		title: "tutorial.s2.title",
		paragraphs: [
			"tutorial.s2.p1",
			"tutorial.s2.p2",
			"tutorial.s2.p3"
		]
	},
	{
		art: "/img/tutorial/feeding.jpg",
		title: "tutorial.s3.title",
		paragraphs: [
			"tutorial.s3.p1",
			"tutorial.s3.p2",
			"tutorial.s3.p3"
		]
	},
	{
		art: "/img/tutorial/hunt.jpg",
		title: "tutorial.s4.title",
		paragraphs: [
			"tutorial.s4.p1",
			"tutorial.s4.p2",
			"tutorial.s4.p3"
		]
	},
	{
		art: "/img/tutorial/extinction.jpg",
		title: "tutorial.s5.title",
		paragraphs: [
			"tutorial.s5.p1",
			"tutorial.s5.p2",
			"tutorial.s5.p3"
		]
	}
];
function TutorialScreen({ onClose }) {
	const tt = useT();
	const [i, setI] = (0, import_react.useState)(0);
	const titleId = (0, import_react.useId)();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogShell, {
		titleId,
		overlayClassName: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6",
		panelClassName: "flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-border bg-surface sm:rounded-[var(--radius-xl)]",
		onBackdropClick: onClose,
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
						}), tt(p)]
					}), k < PHASES.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "→"
					}) : null]
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto p-5 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.24em] text-muted",
						children: tt("tutorial.counter", {
							i: i + 1,
							n: SLIDES.length
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: titleId,
						tabIndex: -1,
						className: "mt-2 text-2xl",
						children: tt(slide.title)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-2.5 text-sm text-muted",
						children: slide.paragraphs.map((p, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tt(p) }, k))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tablist",
					"aria-label": tt("tutorial.slidesAria"),
					className: "flex items-center gap-0.5 rounded-full bg-ink/30 p-1",
					children: SLIDES.map((s, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": k === i,
						"aria-label": tt("tutorial.slideAria", {
							k: k + 1,
							title: tt(s.title)
						}),
						title: tt(s.title),
						onClick: () => setI(k),
						className: "-mx-1.5 grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 rounded-full transition-all duration-[var(--motion-fast)]", k === i ? "w-5 bg-accent" : "w-1.5 bg-parchment/40 hover:bg-parchment/70") })
					}, s.title))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: i === 0,
						onClick: () => setI((v) => Math.max(v - 1, 0)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), tt("tutorial.back")]
					}), last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: onClose,
						children: tt("tutorial.done")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setI((v) => Math.min(v + 1, SLIDES.length - 1)),
						children: [tt("tutorial.next"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
					})]
				})]
			})
		]
	});
}
/** Видимый фокус для кастомных кнопок-переключателей вне Button из UI-кита. */
var FOCUS_VISIBLE = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
/**
* Главное меню: три колонки, как в столе ожидания. Слева — имя и вход или
* создание стола, в центре — открытые столы, справа — закрытые (пароль
* спрашивается по клику на строку). Все три колонки одной высоты, списки
* скроллятся внутри себя и не растят страницу; на телефоне работают две
* вкладки — «Столы» и «Создать».
*/
function MenuScreen({ onRules }) {
	const tt = useT();
	const [statsOpen, setStatsOpen] = (0, import_react.useState)(false);
	const [tutorialOpen, setTutorialOpen] = (0, import_react.useState)(false);
	const netFatal = useGameStore((s) => s.netFatal);
	const clearNetFatal = useGameStore((s) => s.clearNetFatal);
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
				subtitle: tt("app.brand"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "max-xl:h-11",
						"aria-label": tt("topbar.tutorial"),
						title: tt("topbar.tutorial"),
						onClick: openTutorial,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: tt("topbar.tutorial")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "max-xl:h-11",
						"aria-label": tt("topbar.rules"),
						title: tt("topbar.rules"),
						onClick: onRules,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: tt("topbar.rules")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "max-xl:h-11",
						"aria-label": tt("topbar.stats"),
						title: tt("topbar.stats"),
						onClick: openStats,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: tt("topbar.stats")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundToggle, {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4 lg:h-[calc(100dvh-3.5rem)] lg:flex-[1_1_0px] lg:overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl tracking-[0.08em] text-fg sm:text-3xl",
							children: tt("app.name")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted sm:text-sm",
							children: tt("menu.subtitle")
						})]
					}),
					netFatal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "alert",
						className: "mb-3 flex items-start justify-between gap-3 rounded-[var(--radius-lg)] border border-danger/50 bg-danger/10 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-2 text-sm text-clay",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: netFatal })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "shrink-0",
							onClick: clearNetFatal,
							children: tt("common.gotIt")
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid min-h-0 w-full flex-1 grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,360px)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetMenuScreen, {})
					})
				]
			})]
		}),
		tutorialOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialScreen, { onClose: closeTutorial }) : null,
		statsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsScreen, { onClose: closeStats }) : null
	] });
}
/** Подпись вкладки правил — ключ словаря. */
var RULES_TAB_KEYS = {
	base: "rules.tab.base",
	continents: "rules.tab.continents",
	plants: "rules.tab.plants",
	fungi: "rules.tab.fungi",
	mutations: "rules.tab.mutations"
};
var TRAITS_BY_TAB = {
	base: TRAIT_ORDER.filter((id) => !CONTINENTS_TRAIT_IDS.has(id) && !PLANTS_TRAIT_IDS.has(id) && !FUNGI_TRAIT_IDS.has(id) && !MUTATIONS_TRAIT_IDS.has(id)),
	continents: TRAIT_ORDER.filter((id) => CONTINENTS_TRAIT_IDS.has(id)),
	plants: TRAIT_ORDER.filter((id) => PLANTS_TRAIT_IDS.has(id)),
	fungi: TRAIT_ORDER.filter((id) => FUNGI_TRAIT_IDS.has(id)),
	mutations: TRAIT_ORDER.filter((id) => MUTATIONS_TRAIT_IDS.has(id))
};
/** Список свойств в правилах: имена и описания — через словарь терминов. */
function TraitList({ ids }) {
	const lang = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: ids.map((id) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [TRAIT_ART[id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: TRAIT_ART[id],
					alt: "",
					loading: "lazy",
					className: cn("h-[68px] w-12 shrink-0 rounded-[var(--radius-xs)] object-cover object-top", DARK_ART.has(id) && "bg-ink object-contain p-0.5")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-[68px] w-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-border bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
						id,
						className: "size-7 text-muted"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-fg",
					children: traitName(id, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: traitDesc(id, lang)
				})] })]
			}, id);
		})
	});
}
/** Список карт флоры «Травы и грибов» в правилах. */
function FloraList() {
	const lang = useLang();
	const tt = useT();
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
					children: [floraName(k, lang), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-xs font-normal text-muted",
						children: f.isFungus ? tt("rules.flora.fungus") : tt("rules.flora.grass")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: floraDesc(k, lang)
				})] })]
			}, k);
		})
	});
}
/** Список меток последствий в правилах. */
function MarksList() {
	const lang = useLang();
	const tt = useT();
	const kinds = Object.keys(MARKS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: kinds.map((k) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: MARK_ART[k],
					alt: "",
					loading: "lazy",
					className: "size-10 shrink-0 self-start rounded-full object-cover ring-1 ring-border"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-fg",
					children: tt("rules.mark.line", { name: markName(k, lang) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: markDesc(k, lang)
				})] })]
			}, k);
		})
	});
}
/** Список видов растений «Растений» в правилах. */
function PlantsList() {
	const lang = useLang();
	const kinds = Object.keys(PLANTS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2 sm:grid-cols-2",
		children: kinds.map((k) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [PLANT_ART[k] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: PLANT_ART[k],
					alt: "",
					loading: "lazy",
					className: "h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[68px] w-[102px] shrink-0 rounded-[var(--radius-xs)] border border-border bg-surface" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-fg",
					children: plantName(k, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: plantDesc(k, lang)
				})] })]
			}, k);
		})
	});
}
/** Описания территорий «Континентов» для карточек в правилах — ключи словаря. */
var TERRITORY_DESC_KEYS = {
	laurasia: "rules.terr.laurasia",
	gondwana: "rules.terr.gondwana",
	ocean: "rules.terr.ocean"
};
/** Карточки территорий «Континентов» в правилах. */
function TerritoryList() {
	const lang = useLang();
	const tt = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-2 sm:grid-cols-3",
		children: TERRITORIES.map((terr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: TERRITORY_ART[terr.id],
				alt: territoryName(terr.id, lang),
				loading: "lazy",
				className: "aspect-square w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium text-fg",
					children: territoryName(terr.id, lang)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: tt(TERRITORY_DESC_KEYS[terr.id])
				})]
			})]
		}, terr.id))
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
	const tt = useT();
	const [tab, setTab] = (0, import_react.useState)("base");
	const titleId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogShell, {
		titleId,
		overlayClassName: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6",
		panelClassName: "max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-5 sm:rounded-[var(--radius-xl)] sm:p-8",
		onBackdropClick: onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: titleId,
					tabIndex: -1,
					className: "text-2xl",
					children: tt("rules.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onClose,
					children: tt("common.close")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "tablist",
				"aria-label": tt("rules.tabs"),
				className: "mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: Object.keys(RULES_TAB_KEYS).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					id: `${titleId}-tab-${id}`,
					"aria-controls": `${titleId}-panel`,
					"aria-selected": tab === id,
					onClick: () => setTab(id),
					className: cn(FOCUS_VISIBLE, "h-11 rounded-[var(--radius-md)] border px-1 text-sm font-medium", tab === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
					children: tt(RULES_TAB_KEYS[id])
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "tabpanel",
				id: `${titleId}-panel`,
				"aria-labelledby": `${titleId}-tab-${tab}`,
				tabIndex: 0,
				children: [
					tab === "base" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tt("rules.base.intro") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.base.year")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "list-decimal space-y-2 pl-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.base.dev")
										}),
										" ",
										tt("rules.base.dev.text"),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-2 flex flex-wrap items-end gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
													src: BG.cardBack,
													label: tt("rules.lbl.hand")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
													src: TRAIT_ART.carnivore,
													label: tt("rules.lbl.trait")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
													src: speciesArt({}),
													label: tt("rules.lbl.animal")
												})
											]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.base.food")
										}),
										" 2: 1d6+2. 3: 2d6. 4: 2d6+2.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-2 flex flex-wrap items-end gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice3D, {
												values: [2, 5],
												dieSize: 44,
												gap: 10,
												ariaLabel: tt("rules.lbl.dice")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
												tone: "red",
												label: tt("rules.lbl.token")
											})]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.base.feed")
										}),
										" ",
										tt("rules.base.feed.text"),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-2 flex flex-wrap items-end gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
													tone: "red",
													label: tt("rules.lbl.red")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
													tone: "blue",
													label: tt("rules.lbl.blue")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCube, {
													tone: "yellow",
													label: tt("rules.lbl.fat")
												})
											]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.base.ext")
										}),
										" ",
										tt("rules.base.ext.text"),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-2 flex flex-wrap items-end gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
												src: "/img/species/extinct.jpg",
												label: tt("rules.lbl.extinct")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
												src: BG.cardBack,
												label: tt("rules.lbl.draw")
											})]
										})
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.base.score")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tt("rules.base.score.text") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex flex-wrap items-end gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
										src: speciesArt({}),
										label: "+2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleToken, {
										src: speciesArt({ carnivore: true }),
										label: tt("rules.lbl.carnBonus")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
										src: TRAIT_ART.parasite,
										label: tt("rules.lbl.parBonus")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.base.traits")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.base })
						]
					}),
					tab === "continents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tt("rules.continents.intro") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerritoryList, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-decimal space-y-2 pl-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.cont.territories")
										}),
										" ",
										tt("rules.cont.territories.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.cont.bases")
										}),
										" ",
										tt("rules.cont.bases.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.cont.pairs")
										}),
										" ",
										tt("rules.cont.pairs.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.cont.migration")
										}),
										" ",
										tt("rules.cont.migration.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.cont.newTraits")
										}),
										" ",
										tt("rules.cont.newTraits.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.cont.rescue")
										}),
										" ",
										tt("rules.cont.rescue.text")
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.cont.traits")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.continents })
						]
					}),
					tab === "plants" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tt("rules.plants.intro") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-decimal space-y-2 pl-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.plants.base")
										}),
										" ",
										tt("rules.plants.base.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.plants.feeding")
										}),
										" ",
										tt("rules.plants.feeding.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.plants.carnivorous")
										}),
										" ",
										tt("rules.plants.carnivorous.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.plants.extinction")
										}),
										" ",
										tt("rules.plants.extinction.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.plants.growth")
										}),
										" ",
										tt("rules.plants.growth.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.plants.score")
										}),
										" ",
										tt("rules.plants.score.text")
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.plants.species")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantsList, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.plants.traits")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.plants }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs",
								children: tt("rules.plants.footnote")
							})
						]
					}),
					tab === "fungi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tt("rules.fungi.intro") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-decimal space-y-2 pl-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.fungi.table")
										}),
										" ",
										tt("rules.fungi.table.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.fungi.feeding")
										}),
										" ",
										tt("rules.fungi.feeding.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.fungi.spread")
										}),
										" ",
										tt("rules.fungi.spread.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.fungi.extinction")
										}),
										" ",
										tt("rules.fungi.extinction.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.fungi.score")
										}),
										" ",
										tt("rules.fungi.score.text")
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.fungi.cards")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloraList, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.fungi.marks")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarksList, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.fungi.animalTraits")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.fungi })
						]
					}),
					tab === "mutations" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tt("rules.mutations.intro") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-decimal space-y-2 pl-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.mut.deck")
										}),
										" ",
										tt("rules.mut.deck.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.mut.fate")
										}),
										" ",
										tt("rules.mut.fate.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.mut.population")
										}),
										" ",
										tt("rules.mut.population.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.mut.draw")
										}),
										" ",
										tt("rules.mut.draw.text")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-fg",
											children: tt("rules.mut.score")
										}),
										" ",
										tt("rules.mut.score.text")
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-fg",
								children: tt("rules.mut.traits")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitList, { ids: TRAITS_BY_TAB.mutations }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs",
								children: tt("rules.mut.footnote")
							})
						]
					})
				]
			})
		]
	});
}
/** Экран статистики из меню: история партий, график очков и достижения. */
function StatsScreen({ onClose }) {
	const tt = useT();
	const lang = useLang();
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
		for (const g of games) for (const [tr, n] of Object.entries(g.traits)) totals.set(tr, (totals.get(tr) ?? 0) + n);
		return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	}, [games]);
	const labels = [
		["stats.games", String(games.length)],
		["stats.wins", String(wins)],
		["stats.winrate", `${winRate}%`],
		["stats.best", String(best)]
	];
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
					children: tt("stats.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: onClose,
					children: tt("common.close")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6 overflow-y-auto px-5 py-5",
				children: games.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center text-sm text-muted",
					children: tt("stats.empty")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: labels.map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-md)] border border-border bg-bg px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted",
								children: tt(key)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-2xl tabular-nums",
								children: value
							})]
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-medium text-muted",
						children: tt("stats.chart")
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
										labelFormatter: (i) => tt("stats.chartGame", { i }),
										formatter: (v) => [tt("stats.chartPoints", { n: v }), tt("stats.chartScore")]
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
						children: tt("stats.topTraits")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: topTraits.map(([tr, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full border border-border bg-bg px-3 py-1 text-xs text-fg",
							children: [
								traitName(tr, lang),
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display tabular-nums",
									children: n
								})
							]
						}, tr))
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-2 text-sm font-medium text-muted",
						children: [tt("stats.history"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: tt("stats.historyLast", { n: Math.min(games.length, 10) })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5",
						children: [...games].reverse().slice(0, 10).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-fg",
										children: tt("stats.place", {
											place: g.place,
											players: g.players
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [
											" · ",
											g.mode === "net" ? tt("stats.mode.net") : tt("stats.mode.solo"),
											" · ",
											formatDate(g.date, lang)
										]
									}),
									g.modules.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-subtle",
										children: tt("stats.modules", { n: g.modules.length })
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm tabular-nums",
									children: g.score
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: g.won ? "text-good" : "text-subtle",
									children: g.won ? tt("stats.win") : "—"
								})]
							})]
						}, g.date))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-2 text-sm font-medium text-muted",
						children: [tt("stats.achievements"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: tt("stats.achievementsOf", {
								got: Object.keys(stats.achievements).length,
								total: ACHIEVEMENTS.length
							})
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
									children: achievementName(a.id, lang)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-xs text-muted",
									children: achievementDesc(a.id, lang)
								})] })]
							}, a.id);
						})
					})] })
				] })
			})]
		})
	});
}
function formatDate(ms, lang) {
	return new Date(ms).toLocaleDateString(lang === "en" ? "en-GB" : "ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit"
	});
}
/**
* Подписи слагаемых в компактной формуле счёта. Строчные — так формула
* читается как строка данных: «животные 8 · свойства 3 · бонус 2 · сброс 1».
* У флоры за «животными» стоят карты, за «бонусом» — фишки на картах.
*/
function sourceLabels(row, lang) {
	if (row.playerId === -1) return {
		animals: translate(lang, "final.labels.flora.animals"),
		traits: translate(lang, "final.labels.flora.traits"),
		extras: translate(lang, "final.labels.flora.extras"),
		animalsHint: translate(lang, "final.hints.flora.animals"),
		traitsHint: translate(lang, "final.hints.flora.traits"),
		extrasHint: translate(lang, "final.hints.flora.extras")
	};
	return {
		animals: translate(lang, "final.labels.animals"),
		traits: translate(lang, "final.labels.traits"),
		extras: translate(lang, "final.labels.extras"),
		animalsHint: translate(lang, "final.hints.animals"),
		traitsHint: translate(lang, "final.hints.traits"),
		extrasHint: translate(lang, "final.hints.extras")
	};
}
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
function explainDefeat(scores, winnerIds, humanId, lang) {
	if (winnerIds.includes(humanId)) return null;
	const human = scores.find((s) => s.playerId === humanId);
	const winners = scores.filter((s) => winnerIds.includes(s.playerId) && s.playerId !== humanId);
	if (!human || !winners.length) return null;
	const leader = winners[0];
	const gap = leader.total - human.total;
	const pw = pointsWord(lang, gap);
	const leadText = winners.length > 1 ? translate(lang, "final.defeat.sharedLead", {
		n: winners.length,
		players: playersWord(lang, winners.length),
		gap,
		points: pw
	}) : translate(lang, "final.defeat.behind", {
		gap,
		points: pw
	});
	if (gap === 0) return leader.discard > human.discard ? translate(lang, "final.defeat.discardTie", {
		total: human.total,
		leader: leader.discard,
		human: human.discard
	}) : null;
	if (leader.playerId === -1) return translate(lang, "final.defeat.flora", {
		gap,
		points: pw,
		name: scientistName(leader.name, lang),
		leader: leader.total,
		human: human.total
	});
	const diffs = {
		animals: leader.animals - human.animals,
		traits: leader.traits - human.traits,
		extras: leader.extras - human.extras
	};
	const sources = [
		{
			key: "animals",
			on: translate(lang, "final.defeat.on.animals"),
			due: translate(lang, "final.defeat.due.animals")
		},
		{
			key: "traits",
			on: translate(lang, "final.defeat.on.traits"),
			due: translate(lang, "final.defeat.due.traits")
		},
		{
			key: "extras",
			on: translate(lang, "final.defeat.on.extras"),
			due: translate(lang, "final.defeat.due.extras")
		}
	];
	const best = sources.reduce((m, s) => diffs[s.key] > diffs[m.key] ? s : m, sources[0]);
	if (diffs[best.key] <= 0) return translate(lang, "final.defeat.plain", { lead: leadText });
	if (diffs[best.key] === gap) return translate(lang, "final.defeat.fully", {
		lead: leadText,
		due: best.due,
		leader: leader[best.key],
		human: human[best.key]
	});
	return translate(lang, "final.defeat.mostly", {
		lead: leadText,
		on: best.on,
		leader: leader[best.key],
		human: human[best.key]
	});
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
	const tt = useT();
	const lang = useLang();
	const labels = sourceLabels(row, lang);
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
							scientistName(row.name, lang)
						]
					}), winner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[10px] uppercase tracking-wide text-accent",
						children: tt("final.best")
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
								title: tt("final.discardHint"),
								children: tt("final.discard")
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
						children: tt("final.total")
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
	const tt = useT();
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
	const lang = useLang();
	const explanation = (0, import_react.useMemo)(() => explainDefeat(rows, winnerIds, humanId, lang), [
		rows,
		winnerIds,
		humanId,
		lang
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
		const timer = window.setTimeout(() => {
			setReveal((r) => r.shown >= rows.length ? r : {
				...r,
				shown: r.shown + 1
			});
		}, delay);
		return () => window.clearTimeout(timer);
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
			"aria-label": tt("final.show"),
			onClick: () => setCollapsed(false),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }),
				tt("final.results"),
				won ? tt("final.resultsWin") : humanPlace ? tt("final.resultsPlace", { place: placeLabel(lang, humanPlace) }) : ""
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
								children: tt("final.kicker")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-3xl",
								children: won ? tt("final.win") : tt("final.lose")
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "iconSm",
								className: "shrink-0",
								"aria-label": tt("final.collapseAria"),
								title: tt("final.collapseTitle"),
								onClick: () => setCollapsed(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs leading-snug text-subtle",
							children: tt("final.formula")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							"aria-label": tt("final.scoreAria"),
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
								children: tt("final.showAll")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: tt("final.stepHint")
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
					children: [onAgain ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "flex-1",
						size: "md",
						onClick: onAgain,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), tt("final.again")]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "flex-1",
						size: "md",
						onClick: onMenu,
						children: onAgain ? tt("final.menu") : tt("final.leave")
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
/** Сложность бота — ключ словаря (id совпадает с Difficulty). */
var DIFF_KEYS = {
	easy: "diff.easy",
	normal: "diff.normal",
	hard: "diff.hard"
};
/** Дополнение лобби: id, ключ имени и ключ подсказки. */
var MODULE_OPTIONS = [
	[
		"continents",
		"module.continents",
		"module.continents.hint"
	],
	[
		"plants",
		"module.plants",
		"module.plants.hint"
	],
	[
		"fungi",
		"module.fungi",
		"module.fungi.hint"
	],
	[
		"randomMutations",
		"module.randomMutations",
		"module.randomMutations.hint"
	]
];
/**
* Базовые классы кастомных кнопок-переключателей (вне Button из UI-кита):
* видимый фокус с клавиатуры и одинаковое поведение в отключённом виде.
*/
var TOGGLE_BASE = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50";
/** Короткая строка карточки стола: сложность и включённые дополнения. */
function roomSummaryLine(r, tt) {
	return [tt(DIFF_KEYS[r.difficulty] ?? "diff.normal"), ...r.modules.map((m) => MODULE_OPTIONS.find(([key]) => key === m)?.[1]).filter((x) => Boolean(x)).map((key) => tt(key))].join(" · ");
}
/** Строка списка столов: код, хост, заполненность и действие. */
function RoomRow({ room, onJoin, onWatch }) {
	const tt = useT();
	const live = room.status !== "lobby";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-room-row": room.code,
		className: "flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-base tracking-[0.18em] text-fg",
					children: room.code
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 truncate text-xs text-muted",
					children: tt("menu.room.host", { name: room.hostName })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[11px] text-subtle",
				children: tt("menu.room.summary", {
					line: roomSummaryLine(room, tt),
					taken: room.taken,
					capacity: room.capacity
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			className: "shrink-0",
			title: live ? tt("menu.room.watchTitle") : tt("menu.room.joinTitle"),
			onClick: live ? onWatch : onJoin,
			children: [live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), live ? tt("menu.room.watch") : tt("menu.room.join")]
		})]
	});
}
/**
* Колонка меню той же геометрии, что у лобби: шапка и служебные блоки не
* скроллятся, сам список получает слайдер внутри колонки. На десктопе высота
* колонки равна высоте страницы меню — все три стоят одной высоты.
*/
function MenuColumn({ id, title, hint, icon, children, hidden = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"data-menu-col": id,
		className: cn("min-h-0 w-full flex-col rounded-[var(--radius-xl)] border border-border bg-surface lg:flex lg:h-full", hidden ? "hidden" : "flex"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "shrink-0 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 text-sm font-medium text-fg",
				children: [icon, title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[11px] leading-snug text-subtle",
				children: hint
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-menu-scroll": true,
			className: "flex min-h-0 flex-1 flex-col gap-3 p-3 lg:overflow-y-auto",
			children
		})]
	});
}
/** Секция списка столов внутри колонки: заголовок и строки либо пустое состояние. */
function RoomsSection({ title, rooms, empty, render }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mb-1.5 text-xs font-medium text-muted",
		children: [
			title,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-subtle",
				children: rooms.length || ""
			})
		]
	}), rooms.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: rooms.map(render)
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-[var(--radius-md)] border border-dashed border-border bg-bg/40 px-3 py-2 text-xs text-subtle",
		children: empty
	})] });
}
/**
* Строка закрытого стола: код и хост видны всем, вход — только по паролю.
* Пароль спрашивается по клику, прямо в строке (как просил владелец), и
* уходит на сервер вместе с кодом. Неверный пароль — понятная ошибка под
* полем, введённые цифры остаются. Наблюдение закрытых столов здесь не
* предлагаем: в списке видны только входные данные стола, без пароля.
*/
function PrivateRoomRow({ room, open, password, error, busy, disabled, onOpen, onCancel, onPassword, onSubmit }) {
	const tt = useT();
	const live = room.status !== "lobby";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"data-room-row": room.code,
		"data-private-row": room.code,
		className: "rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-private-open": room.code,
				disabled: live,
				"aria-expanded": open,
				title: live ? tt("menu.private.liveTitle") : open ? tt("menu.private.collapseTitle") : tt("menu.private.openTitle"),
				onClick: () => open ? onCancel() : onOpen(),
				className: "min-w-0 flex-1 rounded-[var(--radius-sm)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-default",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
							className: "size-3.5 shrink-0 self-center text-muted",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base tracking-[0.18em] text-fg",
							children: room.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate text-xs text-muted",
							children: tt("menu.room.host", { name: room.hostName })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block text-[11px] text-subtle",
					children: tt("menu.room.summary", {
						line: roomSummaryLine(room, tt),
						taken: room.taken,
						capacity: room.capacity
					})
				})]
			}), live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-[10px] uppercase tracking-wide text-subtle",
				title: tt("menu.private.liveTitle"),
				children: tt("menu.private.live")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "shrink-0",
				"aria-expanded": open,
				title: tt("menu.private.enterTitle"),
				onClick: () => open ? onCancel() : onOpen(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), tt("menu.private.enter")]
			})]
		}), open && !live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-2 flex flex-wrap items-center gap-2",
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: password,
					onChange: (e) => onPassword(e.target.value.replace(/\D/g, "").slice(0, 4)),
					inputMode: "numeric",
					maxLength: 4,
					autoFocus: true,
					placeholder: tt("menu.digits4"),
					"aria-label": tt("menu.private.passwordAria"),
					className: "h-11 w-24 rounded-[var(--radius-md)] border border-border bg-surface px-3 font-display text-sm tracking-[0.2em] tabular-nums text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "max-xl:h-11",
					disabled: busy || disabled || password.length !== 4,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), tt("common.enter")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: onCancel,
					children: tt("common.cancel")
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "w-full text-xs text-clay",
					children: error
				}) : null
			]
		}) : null]
	});
}
/**
* Сетка главного меню: три колонки, как в столе ожидания.
* Колонка 1 — имя и вход/создание стола; колонка 2 — открытые столы
* (ждут игроков и идут сейчас); колонка 3 — закрытые столы (пароль по клику).
* Список комнат поллится раз в 4 секунды, интервал чистится при
* размонтировании. Ссылка ?room=КОД предзаполняет форму входа, а при
* сохранённом месте сразу возвращает за стол.
*/
function NetMenuScreen() {
	const tt = useT();
	const startNetCreate = useGameStore((s) => s.startNetCreate);
	const startNetJoin = useGameStore((s) => s.startNetJoin);
	const startWatch = useGameStore((s) => s.startNetWatch);
	const resumeNetFromUrl = useGameStore((s) => s.resumeNetFromUrl);
	const rooms = useGameStore((s) => s.rooms);
	const netRefreshRooms = useGameStore((s) => s.netRefreshRooms);
	const [joinOpen, setJoinOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [needPassword, setNeedPassword] = (0, import_react.useState)(false);
	const [makePrivate, setMakePrivate] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("tables");
	const [unlock, setUnlock] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const saved = loadName();
		if (saved) setName((cur) => cur ? cur : saved);
	}, []);
	(0, import_react.useEffect)(() => {
		const room = new URLSearchParams(window.location.search).get("room");
		if (!room) return;
		setCode(room.toUpperCase());
		setJoinOpen(true);
		setTab("create");
		resumeNetFromUrl(room);
	}, []);
	(0, import_react.useEffect)(() => {
		const poll = () => {
			if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
			netRefreshRooms();
		};
		poll();
		const timer = window.setInterval(poll, 4e3);
		return () => window.clearInterval(timer);
	}, [netRefreshRooms]);
	async function run(fn) {
		if (busy) return;
		setError(null);
		setBusy(true);
		try {
			await fn();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			const code = e?.code;
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
		const last = loadLastNetConfig();
		const who = name.trim();
		saveName(who);
		run(() => startNetCreate({
			name: who,
			capacity: last.capacity ?? 2,
			botSeats: 0,
			difficulty: last.difficulty ?? "normal",
			modules: last.modules,
			deckSize: last.deckSize,
			isPrivate: makePrivate
		}));
	}
	function joinNow() {
		const who = name.trim();
		saveName(who);
		run(() => startNetJoin(code, who, password));
	}
	function watchNow() {
		const who = name.trim();
		saveName(who);
		run(() => startWatch(code, who));
	}
	/** Действие из списка: без имени не пускаем — соперники должны его видеть. */
	function actFromList(fn) {
		if (!named) {
			setError(tt("menu.err.name"));
			setTab("create");
			return;
		}
		saveName(name.trim());
		run(fn);
	}
	/**
	* Вход в закрытый стол из списка: пароль уходит на сервер вместе с кодом,
	* ошибка остаётся в строке — цифры не теряются, повторный ввод не нужен.
	*/
	async function submitPrivate() {
		const target = unlock;
		if (!target || target.password.length !== 4) return;
		if (!named) {
			setUnlock({
				...target,
				error: tt("menu.err.nameCol")
			});
			return;
		}
		setBusy(true);
		saveName(name.trim());
		try {
			await startNetJoin(target.code, name.trim(), target.password);
		} catch (e) {
			setUnlock({
				...target,
				error: e instanceof Error ? e.message : String(e)
			});
		} finally {
			setBusy(false);
		}
	}
	const openRooms = rooms.filter((r) => !r.isPrivate);
	const privateRooms = rooms.filter((r) => r.isPrivate);
	const waiting = (list) => list.filter((r) => r.status === "lobby" && r.free > 0);
	const live = (list) => list.filter((r) => r.status !== "lobby");
	/** Строка открытого стола: занять место в лобби или наблюдать за партией. */
	const renderOpen = (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomRow, {
		room: r,
		onJoin: () => actFromList(() => startNetJoin(r.code, name.trim())),
		onWatch: () => actFromList(() => startWatch(r.code, name.trim()))
	}, r.code);
	const renderPrivate = (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivateRoomRow, {
		room: r,
		open: unlock?.code === r.code,
		password: unlock?.code === r.code ? unlock.password : "",
		error: unlock?.code === r.code ? unlock.error : null,
		busy,
		disabled: !named,
		onOpen: () => setUnlock({
			code: r.code,
			password: "",
			error: null
		}),
		onCancel: () => setUnlock(null),
		onPassword: (value) => setUnlock({
			code: r.code,
			password: value,
			error: null
		}),
		onSubmit: () => void submitPrivate()
	}, r.code);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "group",
			"aria-label": tt("menu.tabsLabel"),
			className: "col-span-full grid grid-cols-2 gap-2 lg:hidden",
			children: [[
				"tables",
				"menu.tab.tables",
				rooms.length
			], [
				"create",
				"menu.tab.create",
				null
			]].map(([id, labelKey, badge]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-pressed": tab === id,
				onClick: () => setTab(id),
				className: cn(TOGGLE_BASE, "flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border text-sm font-medium", tab === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface text-fg"),
				children: [tt(labelKey), badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums opacity-70",
					children: badge
				}) : null]
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuColumn, {
			id: "table",
			title: tt("menu.col.table"),
			hint: tt("menu.col.table.hint"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
			hidden: tab !== "create",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-xs text-muted",
						children: tt("menu.name")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						onChange: (e) => setName(e.target.value),
						maxLength: 16,
						placeholder: tt("menu.name.placeholder"),
						"aria-label": tt("menu.name"),
						className: "h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						disabled: busy || !named,
						onClick: createNow,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), tt("menu.create")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "lg",
						"aria-expanded": joinOpen,
						disabled: busy,
						onClick: () => setJoinOpen((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), tt("menu.join")]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: makePrivate,
							onChange: (e) => setMakePrivate(e.target.checked),
							className: "size-4 accent-[var(--accent)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }),
						tt("menu.private")
					]
				}),
				joinOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-lg)] border border-border bg-bg/50 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-3 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-xs text-muted",
								children: tt("menu.code")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: code,
								onChange: (e) => setCode(e.target.value.toUpperCase().slice(0, 4)),
								maxLength: 4,
								placeholder: tt("menu.code.placeholder"),
								"aria-label": tt("menu.code"),
								className: "h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 font-display text-lg tracking-[0.3em] uppercase text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
							})]
						}),
						needPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-3 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-xs text-muted",
								children: tt("menu.password")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: password,
								onChange: (e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4)),
								inputMode: "numeric",
								maxLength: 4,
								autoFocus: true,
								placeholder: tt("menu.digits4"),
								"aria-label": tt("menu.password"),
								className: "h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 font-display text-lg tracking-[0.3em] tabular-nums text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-[1fr_auto]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								disabled: busy || !canJoin,
								onClick: joinNow,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), tt("common.enter")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "lg",
								disabled: busy || !canJoin,
								title: tt("menu.watch.title"),
								onClick: watchNow,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), tt("menu.watch")]
							})]
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintNote, { children: tt("menu.hint") }),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-clay",
					children: error
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuColumn, {
			id: "open",
			title: tt("menu.col.open"),
			hint: tt("menu.col.open.hint"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
			hidden: tab !== "tables",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomsSection, {
				title: tt("menu.waiting"),
				rooms: waiting(openRooms),
				empty: tt("menu.open.empty"),
				render: renderOpen
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomsSection, {
				title: tt("menu.live"),
				rooms: live(openRooms),
				empty: tt("menu.open.live.empty"),
				render: renderOpen
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuColumn, {
			id: "private",
			title: tt("menu.col.private"),
			hint: tt("menu.col.private.hint"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }),
			hidden: tab !== "tables",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomsSection, {
				title: tt("menu.waiting"),
				rooms: waiting(privateRooms),
				empty: tt("menu.private.empty"),
				render: renderPrivate
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomsSection, {
				title: tt("menu.live"),
				rooms: live(privateRooms),
				empty: tt("menu.private.live.empty"),
				render: renderPrivate
			})]
		})
	] });
}
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
/** «1 min», «just now» — время ожидания в очереди. */
function formatWait(ms, tt) {
	const s = Math.max(0, Math.floor(ms / 1e3));
	if (s < 20) return tt("wait.now");
	if (s < 60) return tt("wait.sec", { s });
	const m = Math.floor(s / 60);
	if (m < 60) return tt("wait.min", { m });
	return tt("wait.hour", {
		h: Math.floor(m / 60),
		m: m % 60
	});
}
/** Время ожидания, обновляется раз в 15 с — очередь не «замирает». */
function WaitingTime({ at }) {
	const tt = useT();
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 15e3);
		return () => window.clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "tabular-nums",
		children: formatWait(now - at, tt)
	});
}
/**
* Мягкая подложка строки места: цвет игрока, подмешанный к фону стола.
* Та же формула, что у секции игрока в партии (seatTint в game-app): по ней
* цвет места читается и в лобби, и в ожидающем столе одинаково с игрой.
*/
function seatTint$1(color) {
	if (!color) return void 0;
	return { backgroundColor: `color-mix(in oklab, ${color} 12%, var(--color-surface))` };
}
/**
* Список мест стола: занятые игроки, боты и свободные места. Хост может
* убрать человека, передать ему хост или увидеть, что место пока пусто.
*/
function SeatList({ seats, capacity, mySeat, hostSeat, canManage, onKick, onTransfer, onRename, onColor }) {
	const tt = useT();
	const lang = useLang();
	const rows = Math.max(capacity, ...seats.map((s) => s.seat + 1), 0);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [palette, setPalette] = (0, import_react.useState)(null);
	const startEdit = (seat) => {
		setEditing(seat.seat);
		setDraft(seat.name);
	};
	const commit = () => {
		const next = draft.trim();
		setEditing(null);
		if (next && onRename) onRename(next.slice(0, 16));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		"data-seat-list": true,
		className: "space-y-2",
		children: Array.from({ length: rows }).map((_, seatNo) => {
			const seat = seats.find((x) => x.seat === seatNo);
			const isMe = seat?.seat === mySeat;
			const isHostSeat = seat?.seat === hostSeat;
			const canKick = canManage && seat && !seat.isAI && !isMe;
			const editingMe = isMe && seat && editing === seatNo;
			const pickColor = isMe && seat && onColor && !seat.isAI;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				style: seatTint$1(seat?.color),
				className: cn("flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2.5", seat ? "paper-sheet border-border" : "border-dashed border-border bg-bg/40", isMe && "ring-1 ring-accent/50"),
				children: [
					editingMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex min-w-0 flex-1 items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								value: draft,
								maxLength: 16,
								"aria-label": tt("seat.nameAria"),
								onChange: (e) => setDraft(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") commit();
									if (e.key === "Escape") setEditing(null);
								},
								className: "min-w-0 flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1.5 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								size: "iconSm",
								className: "max-xl:size-11",
								"aria-label": tt("seat.nameSave"),
								onClick: commit,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "iconSm",
								className: "max-xl:size-11",
								"aria-label": tt("seat.nameCancel"),
								onClick: () => setEditing(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex min-w-0 items-center gap-2 text-sm font-medium text-fg",
						children: [
							seat ? seat.isAI ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4 shrink-0 text-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("size-2 shrink-0 rounded-full", seat.online ? "bg-good" : "bg-ink/25"),
								title: seat.online ? tt("seat.online") : tt("seat.offline")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 shrink-0 rounded-full bg-ink/15" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate",
								children: seat ? scientistName(seat.name, lang) : tt("seat.free")
							}),
							isMe && seat && onRename ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "iconSm",
								className: "max-xl:size-11",
								"aria-label": tt("seat.nameEditAria"),
								title: tt("seat.nameEditTitle"),
								onClick: () => startEdit(seat),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
							}) : null,
							pickColor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "iconSm",
								className: "max-xl:size-11",
								"aria-label": tt("seat.colorAria", { color: seat.color }),
								"aria-expanded": palette === seatNo,
								title: tt("seat.colorTitle"),
								onClick: () => setPalette((v) => v === seatNo ? null : seatNo),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-4" })
							}) : null,
							seat && !seat.isAI && !seat.online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-full bg-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted",
								children: tt("seat.offline")
							}) : null,
							seat?.resigned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-full bg-clay/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-clay",
								children: tt("seat.resigned")
							}) : null,
							isHostSeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent",
								children: tt("seat.host")
							}) : null,
							isMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-[10px] uppercase tracking-wide text-muted",
								children: tt("seat.you")
							}) : null
						]
					}),
					canKick && seat ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex shrink-0 items-center gap-0.5",
						children: [onTransfer && !isHostSeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "iconSm",
							className: "max-xl:size-11",
							"aria-label": tt("seat.transferAria", { name: seat.name }),
							title: tt("seat.transferTitle"),
							onClick: () => onTransfer(seat),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4" })
						}) : null, onKick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "iconSm",
							className: "max-xl:size-11 text-clay hover:text-danger",
							"aria-label": tt("seat.kickAria", { name: seat.name }),
							title: tt("seat.kickTitle"),
							onClick: () => onKick(seat),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "size-4" })
						}) : null]
					}) : !seat && canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[10px] uppercase tracking-wide text-subtle",
						children: tt("seat.waiting")
					}) : null,
					pickColor && palette === seatNo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-bg px-2 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1 text-[10px] uppercase tracking-wide text-muted",
							children: tt("seat.colorLabel")
						}), PLAYER_COLORS.map((c) => {
							const active = seat.color.toLowerCase() === c.toLowerCase();
							const owner = seats.find((s) => s.seat !== seatNo && typeof s.color === "string" && s.color.toLowerCase() === c.toLowerCase());
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex w-8 shrink-0 flex-col items-center gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: Boolean(owner),
									"aria-pressed": active,
									"aria-label": tt("seat.colorAria", { color: c }),
									title: owner ? `${c} — ${scientistName(owner.name, lang)}` : c,
									onClick: () => {
										setPalette(null);
										if (!active) onColor(c);
									},
									className: cn("size-6 rounded-full border transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", active ? "scale-110 border-fg ring-2 ring-accent/60" : owner ? "cursor-not-allowed border-ink/20 opacity-40" : "border-ink/20 hover:scale-110"),
									style: { background: c }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "max-w-full truncate text-[9px] leading-tight text-muted",
									title: owner ? scientistName(owner.name, lang) : void 0,
									children: owner ? scientistName(owner.name, lang) : "\xA0"
								})]
							}, c);
						})]
					}) : null
				]
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
	const tt = useT();
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
					className: "max-xl:h-11",
					"aria-label": tt("topbar.tutorial"),
					title: tt("topbar.tutorial"),
					onClick: () => setTutorialOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: tt("topbar.tutorial")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "max-xl:h-11",
					"aria-label": tt("topbar.rules"),
					title: tt("topbar.rules"),
					onClick: () => setRulesOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: tt("topbar.rules")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "max-xl:h-11",
					"aria-label": tt("topbar.stats"),
					title: tt("topbar.stats"),
					onClick: () => setStatsOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: tt("topbar.stats")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundToggle, {})
			]
		}),
		rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: () => setRulesOpen(false) }) : null,
		statsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsScreen, { onClose: () => setStatsOpen(false) }) : null,
		tutorialOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialScreen, { onClose: () => setTutorialOpen(false) }) : null
	] });
}
/** Быстрые фразы чата — на текущем языке. */
function chatPhrases(tt) {
	return [
		tt("chat.hi"),
		tt("chat.goodTable"),
		tt("chat.go")
	];
}
/**
* Нейтральный тон автора без места за столом (ожидающие и зрители): своего
* цвета у них нет, но ник всё равно должен читаться спокойным серо-зелёным.
*/
var NEUTRAL_AUTHOR_COLOR$1 = "var(--color-muted)";
/**
* Лента стола для лобби и ожидающего: чат плюс системные события состава.
* Автору подставляем его цвет из списка мест (тот же, что в партии и в
* цветном фоне строки места): по нему лента красит ник и подложку реплики.
* Ожидающим (-1) и зрителям (-2) места за столом нет — у них нейтральный тон.
* Реакции собираются в агрегат по `chatId` реплики (M12).
*/
function useTableFeedItems(net) {
	const seats = net?.seats;
	const chat = net?.chat;
	const system = net?.system;
	const reactions = net?.reactions;
	const myName = net?.name;
	const colorBySeat = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of seats ?? []) map.set(s.seat, s.color);
		return map;
	}, [seats]);
	return (0, import_react.useMemo)(() => {
		const byChat = reactionsByChatId(reactions, myName);
		const chatItems = (chat ?? []).map((m) => {
			const rs = byChat.get(m.id);
			return {
				id: `chat-${m.id}`,
				kind: "chat",
				text: m.text,
				playerName: m.name,
				seat: m.seat,
				chatId: m.id,
				at: m.at,
				color: colorBySeat.get(m.seat) ?? NEUTRAL_AUTHOR_COLOR$1,
				...rs ? { reactions: rs } : {}
			};
		});
		const systemItems = (system ?? []).map((n) => ({
			id: n.id,
			kind: "system",
			text: n.text,
			at: n.at
		}));
		return [...chatItems, ...systemItems].map((item, i) => ({
			item,
			i
		})).sort((a, b) => (a.item.at ?? 0) - (b.item.at ?? 0) || a.i - b.i).map((x) => x.item);
	}, [
		chat,
		system,
		colorBySeat,
		reactions,
		myName
	]);
}
/**
* Реакция на реплику стола: реакция уходит с `chatId` (ложится под конкретное
* сообщение) и с местом автора — по нему пузырь реакции всплывает над столом.
* У записи без реплики (системной) реакции нет: `chatId` нечего адресовать.
*/
function reactToItem(sendReaction, item, emoji) {
	if (item.chatId === void 0) return;
	sendReaction(emoji, "reaction", seatOfItem(item), item.chatId);
}
/**
* Что видно в чате как «печатает…»: свои места, очередь и зрители (без меня).
* Метки приходят поллингом, поэтому индикатор гаснет сам.
*/
function useTypingNames(net) {
	return (0, import_react.useMemo)(() => net ? typingNamesOf(net) : [], [net]);
}
/**
* Место автора реплики для реакции: у игроков 0..7, у ожидающих и зрителей
* места нет — null (реакция всё равно ложится под сообщение по chatId).
*/
function seatOfItem(item) {
	return item.seat !== void 0 && item.seat >= 0 ? item.seat : null;
}
/**
* Чат стола: тот же буфер, что и в партии. В лобби живёт колонкой справа
* (десктоп); на телефоне его место будет в навигации — волна журнала.
*/
function LobbyScreen() {
	const tt = useT();
	const lang = useLang();
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
	const [chatOpen, setChatOpen] = (0, import_react.useState)(false);
	const chatTitleId = (0, import_react.useId)();
	const chatButtonRef = (0, import_react.useRef)(null);
	const lastSeenChatRef = (0, import_react.useRef)(0);
	const chatItems = useTableFeedItems(net);
	const typingNames = useTypingNames(net);
	const unreadChat = (0, import_react.useMemo)(() => {
		const last = chatItems[chatItems.length - 1];
		return last && (last.at ?? 0) > lastSeenChatRef.current ? net?.chat.length ?? 0 : 0;
	}, [chatItems, net?.chat.length]);
	(0, import_react.useEffect)(() => {
		if (chatOpen) lastSeenChatRef.current = Date.now();
	}, [chatOpen, net?.chat.length]);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [editingPassword, setEditingPassword] = (0, import_react.useState)(false);
	const [passwordDraft, setPasswordDraft] = (0, import_react.useState)("");
	const [passwordState, setPasswordState] = (0, import_react.useState)(null);
	const [savingPassword, setSavingPassword] = (0, import_react.useState)(false);
	const [kick, setKick] = (0, import_react.useState)(null);
	const [transfer, setTransfer] = (0, import_react.useState)(null);
	if (!net) return null;
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
	const incompatibility = isHost ? moduleCompatibilityError(modules, lang) : null;
	const startHint = !isHost ? tt("lobby.startHint.host") : freeSeats > 0 ? tt("lobby.startHint.free", {
		free: freeSeats,
		capacity: net.capacity
	}) : null;
	/** Приглашение: ссылка с кодом; у приватного стола хост копирует и пароль. */
	const inviteText = net.isPrivate && net.password ? `${shareUrl}\n${tt("lobby.invitePassword", { password: net.password })}` : shareUrl;
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
			setPasswordState({
				kind: "ok",
				text: tt("lobby.passwordSaved")
			});
		} else setPasswordState({
			kind: "err",
			text: res.error ?? tt("lobby.passwordFail")
		});
	}
	function toggleModule(key) {
		if (!isHost) return;
		const candidate = {
			...modules,
			[key]: !modules[key]
		};
		if (moduleCompatibilityError(candidate, lang)) return;
		netSetSettings({ modules: candidate });
	}
	function pickDifficulty(id) {
		if (isHost) netSetSettings({ difficulty: id });
	}
	function pickDeck(size) {
		if (isHost) netSetSettings({ deckSize: size });
	}
	const deckPresets = [
		[Math.max(20, Math.round(deckFull * .36)), "lobby.deckShort"],
		[Math.max(24, Math.round(deckFull * .5)), "lobby.deckNormal"],
		[deckFull, "lobby.deckFull"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetTopBar, { subtitle: tt("lobby.subtitle") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-7xl flex-1 items-start justify-center gap-5 px-4 py-6 lg:h-[calc(100dvh-3.5rem)] lg:flex-[1_1_0px] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,360px)] lg:overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full flex-col gap-3 lg:h-full lg:overflow-y-auto lg:pr-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted",
								children: tt("lobby.subtitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-4xl tracking-[0.18em]",
										"data-room-code": net.code,
										children: net.code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "iconSm",
										className: "max-xl:size-11",
										"data-copy-link": true,
										"aria-label": copied ? tt("lobby.copy") : tt("lobby.copyLink"),
										title: net.isPrivate && net.password ? tt("lobby.copyBoth") : tt("lobby.copyLink"),
										onClick: copyLink,
										children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
									}),
									isHost && net.isPrivate ? editingPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "flex items-center gap-1.5",
										onSubmit: (e) => {
											e.preventDefault();
											savePassword();
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: passwordDraft,
												onChange: (e) => {
													setPasswordDraft(e.target.value.replace(/\D/g, "").slice(0, 4));
													setPasswordState(null);
												},
												onBlur: () => void savePassword(),
												onKeyDown: (e) => {
													if (e.key === "Escape") {
														setEditingPassword(false);
														setPasswordDraft("");
														setPasswordState(null);
													}
												},
												inputMode: "numeric",
												maxLength: 4,
												autoFocus: true,
												placeholder: tt("menu.digits4"),
												"aria-label": tt("lobby.passwordNew"),
												className: "h-11 w-24 rounded-[var(--radius-md)] border border-border bg-surface px-3 font-display text-sm tracking-[0.2em] tabular-nums text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												variant: "secondary",
												className: "max-xl:h-11",
												disabled: savingPassword || passwordDraft.length !== 4,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), tt("common.save")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "ghost",
												size: "iconSm",
												className: "max-xl:size-11",
												"aria-label": tt("lobby.passwordCancelAria"),
												onClick: () => {
													setEditingPassword(false);
													setPasswordDraft("");
													setPasswordState(null);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-room-password": true,
										onClick: () => setShowPassword((v) => !v),
										"aria-label": showPassword ? tt("lobby.passwordHide") : tt("lobby.passwordShow"),
										title: tt("lobby.passwordTitle"),
										className: cn(TOGGLE_BASE, "rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 font-display text-sm tracking-[0.2em] tabular-nums text-fg hover:bg-surface-2"),
										children: showPassword ? net.password ?? "····" : "••••"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "iconSm",
										className: "max-xl:size-11",
										"aria-label": tt("lobby.passwordChangeAria"),
										title: tt("lobby.passwordChangeTitle"),
										onClick: () => {
											setEditingPassword(true);
											setShowPassword(true);
											setPasswordDraft("");
											setPasswordState(null);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
									})] }) : null,
									isHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "iconSm",
										className: cn("max-xl:size-11", net.isPrivate ? "text-accent" : "text-muted"),
										"aria-pressed": net.isPrivate,
										"aria-label": net.isPrivate ? tt("lobby.privacyOnAria") : tt("lobby.privacyOffAria"),
										title: net.isPrivate ? tt("lobby.privacyOnTitle") : tt("lobby.privacyOffTitle"),
										onClick: () => {
											setEditingPassword(false);
											netSetRoomPrivacy(!net.isPrivate);
										},
										children: net.isPrivate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-4" })
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "status",
								className: cn("min-h-4 text-center text-xs", passwordState && !copied && passwordState.kind === "err" ? "text-clay" : "text-good"),
								children: copied ? net.isPrivate && net.password ? tt("lobby.copiedBoth") : tt("lobby.copy") : passwordState?.text ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5",
								children: [
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
										onTransfer: (seat) => setTransfer(seat),
										onRename: (name) => {
											saveName(name);
											netSetName(name);
										},
										onColor: (color) => void netSetColor(color)
									}),
									net.waiters.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 rounded-[var(--radius-md)] border border-border bg-bg/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }), tt("lobby.waiters", { n: net.waiters.length })]
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
														className: "max-xl:size-11 text-clay hover:text-danger",
														"aria-label": tt("lobby.waiterRemoveAria", { name: w.name }),
														title: tt("lobby.waiterRemoveTitle"),
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
									net.spectators.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 rounded-[var(--radius-md)] border border-border bg-bg/50 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), tt("lobby.spectators", { n: net.spectators.length })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "space-y-1.5",
											children: net.spectators.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2 text-sm text-fg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 shrink-0 rounded-full bg-accent/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "min-w-0 truncate",
													children: s.name
												})]
											}, s.name))
										})]
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-subtle",
								children: tt("lobby.inviteHint")
							}),
							net.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-clay/40 bg-clay/10 px-3 py-2 text-sm text-clay",
								role: "status",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: net.error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: clearNetError,
									children: tt("common.gotIt")
								})]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-full flex-col gap-3 lg:h-full lg:overflow-y-auto lg:pr-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), tt("lobby.settings")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mb-1.5 text-xs text-muted",
													children: tt("lobby.modules")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													id: "module-compatibility-hint",
													className: "mb-2 text-xs text-muted",
													children: moduleCompatibilityError({
														fungi: true,
														plants: true
													}, lang)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid grid-cols-2 gap-2",
													children: MODULE_OPTIONS.map(([key, labelKey, hintKey]) => {
														const on = Boolean(modules[key]);
														const blocked = moduleCompatibilityError({
															...modules,
															[key]: !on
														}, lang);
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															disabled: !isHost || Boolean(blocked),
															"aria-pressed": on,
															title: isHost ? blocked ?? tt(hintKey) : tt("lobby.hostOnly"),
															"aria-describedby": blocked ? "module-compatibility-hint" : void 0,
															onClick: () => toggleModule(key),
															className: cn("flex items-center justify-between gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-left text-xs leading-tight disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:text-sm", on ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "min-w-0",
																children: tt(labelKey)
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", on ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
																children: on ? tt("common.on") : tt("common.off")
															})]
														}, key);
													})
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-1.5 text-xs text-muted",
												children: tt("lobby.difficulty")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid grid-cols-3 gap-2",
												children: Object.keys(DIFF_KEYS).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: !isHost,
													title: isHost ? void 0 : tt("lobby.hostOnly"),
													onClick: () => pickDifficulty(id),
													className: cn("h-11 rounded-[var(--radius-md)] border text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", difficulty === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
													children: tt(DIFF_KEYS[id])
												}, id))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-1.5 text-xs text-muted",
												children: tt("lobby.deckSize")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mb-2 grid grid-cols-3 gap-2",
												children: deckPresets.map(([n, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: !isHost,
													title: isHost ? void 0 : tt("lobby.hostOnly"),
													onClick: () => pickDeck(n),
													className: cn("h-11 rounded-[var(--radius-md)] border text-xs font-medium disabled:cursor-not-allowed sm:h-10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", deckNow === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
													children: [
														tt(label),
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
												"aria-label": tt("lobby.deckSize"),
												className: "range-evo w-full disabled:cursor-not-allowed disabled:opacity-50"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1.5 text-xs text-subtle",
												children: tt("lobby.deckInfo", {
													n: deckNow,
													years: estimateYears(deckNow, Math.max(net.capacity, 2))
												})
											})
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 border-t border-border pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mb-1.5 text-xs text-muted",
											children: [tt("lobby.seats"), !isHost ? tt("lobby.seatsHost") : ""]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-4 gap-2 sm:grid-cols-7",
											children: CAPACITIES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: !isHost,
												title: isHost ? void 0 : tt("lobby.hostOnly"),
												onClick: () => void netSetCapacity(n),
												className: cn("h-11 rounded-[var(--radius-md)] border text-sm font-medium disabled:cursor-not-allowed sm:h-10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", net.capacity === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
												children: n
											}, n))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1.5 text-xs text-subtle",
											children: tt("lobby.seatsHint")
										}),
										isHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted",
													children: tt("lobby.bots")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "secondary",
													size: "icon",
													"aria-label": tt("lobby.botRemove"),
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
													"aria-label": tt("lobby.botAdd"),
													disabled: net.seats.length >= net.capacity,
													onClick: () => void netAddBots(1),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-subtle",
													children: tt("lobby.botsHint")
												})
											]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-col gap-2 sm:flex-row-reverse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "flex-1 max-lg:h-14 max-sm:flex-none",
										size: "md",
										disabled: !isHost || !full || humans.length < 1 || incompatibility !== null,
										title: incompatibility ?? (!isHost ? tt("lobby.startHostTitle") : !full ? tt("lobby.startFullTitle") : void 0),
										"data-start-game": "",
										onClick: () => void netStart(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), tt("lobby.start")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "md",
										className: "max-lg:h-14",
										onClick: leaveNet,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), tt("lobby.leave")]
									})]
								}),
								startHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-center text-xs text-subtle",
									role: "status",
									children: startHint
								}) : null
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden lg:flex lg:h-full lg:min-h-0 lg:flex-col",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
							variant: "panel",
							items: chatItems,
							open: true,
							onToggle: () => {},
							title: tt("chat.title"),
							onSend: (text) => void sendChat(text),
							quickPhrases: chatPhrases(tt),
							onReact: (item, emoji) => reactToItem(sendReaction, item, emoji),
							onTyping: sendTyping,
							typingNames
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				ref: chatButtonRef,
				onClick: () => setChatOpen(true),
				"aria-haspopup": "dialog",
				"aria-expanded": chatOpen,
				"aria-label": tt("chat.open"),
				className: "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg shadow-[var(--shadow-card)] lg:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }),
					tt("chat.button"),
					unreadChat > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg",
						children: unreadChat > 99 ? "99+" : unreadChat
					}) : null
				]
			}),
			chatOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogShell, {
				titleId: chatTitleId,
				returnFocus: chatButtonRef,
				overlayClassName: "fixed inset-0 z-50 flex flex-col bg-bg/80 p-3 lg:hidden",
				panelClassName: "flex min-h-0 flex-1 flex-col",
				onBackdropClick: () => setChatOpen(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "md",
						onClick: () => setChatOpen(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), tt("chat.close")]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
					variant: "panel",
					items: chatItems,
					open: true,
					onToggle: () => {},
					title: tt("chat.title"),
					titleId: chatTitleId,
					onSend: (text) => void sendChat(text),
					quickPhrases: chatPhrases(tt),
					onReact: (item, emoji) => reactToItem(sendReaction, item, emoji),
					onTyping: sendTyping,
					typingNames
				})]
			}) : null,
			kick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: kick.kind === "seat" ? tt("lobby.kickSeat.title") : tt("lobby.kickWaiter.title"),
				body: kick.kind === "seat" ? tt("lobby.kickSeat.body", { name: kick.name }) : tt("lobby.kickWaiter.body", { name: kick.name }),
				confirmLabel: tt("lobby.kickConfirm"),
				tone: "danger",
				onConfirm: () => {
					if (kick.kind === "seat") netKick(kick.seat);
					else netKickWaiter(kick.index);
					setKick(null);
				},
				onClose: () => setKick(null)
			}) : null,
			transfer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: tt("lobby.transfer.title"),
				body: tt("lobby.transfer.body", { name: transfer.name }),
				confirmLabel: tt("lobby.transfer.confirm"),
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
	const tt = useT();
	const net = useGameStore((s) => s.net);
	const netLeaveQueue = useGameStore((s) => s.netLeaveQueue);
	const netClaimSeat = useGameStore((s) => s.netClaimSeat);
	const sendChat = useGameStore((s) => s.sendChat);
	const sendReaction = useGameStore((s) => s.sendReaction);
	const sendTyping = useGameStore((s) => s.sendTyping);
	const clearNetError = useGameStore((s) => s.clearNetError);
	const chatItems = useTableFeedItems(net);
	const typingNames = useTypingNames(net);
	if (!net) return null;
	const occupied = new Set(net.seats.map((s) => s.seat));
	let freeSeat = null;
	for (let i = 0; i < net.capacity; i++) if (!occupied.has(i)) {
		freeSeat = i;
		break;
	}
	const position = net.waiterPosition;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetTopBar, { subtitle: tt("wait.subtitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-5 px-4 py-6 lg:h-[calc(100dvh-3.5rem)] lg:flex-[1_1_0px] lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full flex-col gap-3 lg:h-full lg:overflow-y-auto lg:pr-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted",
						children: tt("wait.subtitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-center font-display text-4xl tracking-[0.18em]",
						"data-room-code": net.code,
						children: net.code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-[var(--radius-xl)] border border-border bg-surface p-5 sm:p-7",
						children: [
							net.waitNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								"data-wait-note": true,
								className: "mb-4 rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 px-3 py-2 text-center text-sm text-fg",
								role: "status",
								children: net.waitNote
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[var(--radius-md)] border border-border bg-bg px-3 py-3 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: position ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: tt("wait.position", { place: position }) }) : tt("wait.inQueue")
								})
							}),
							net.waiters.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "mb-2 flex items-center gap-2 text-sm font-medium text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }), tt("wait.queue", { n: net.waiters.length })]
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
														children: tt("seat.you")
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), tt("wait.atTable")]
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
									children: tt("common.gotIt")
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-col gap-2 sm:flex-row-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "flex-1 max-lg:h-14 max-sm:flex-none",
									size: "md",
									disabled: freeSeat === null,
									title: freeSeat === null ? tt("wait.claimNone") : tt("wait.claimOk"),
									onClick: () => void netClaimSeat(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), tt("wait.claim")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "md",
									className: "max-lg:h-14",
									onClick: () => void netLeaveQueue(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), tt("wait.leave")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-xs text-subtle",
								children: tt("wait.hint")
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-[min(55dvh,26rem)] w-full min-h-0 flex-col lg:col-start-2 lg:row-start-1 lg:h-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventFeed, {
					variant: "panel",
					items: chatItems,
					open: true,
					onToggle: () => {},
					title: tt("chat.title"),
					onSend: (text) => void sendChat(text),
					quickPhrases: chatPhrases(tt),
					onReact: (item, emoji) => reactToItem(sendReaction, item, emoji),
					onTyping: sendTyping,
					typingNames
				})
			})]
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
	if (!info) return t("spot.animal");
	return `${info.owner}: ${t("game.pairNo", { n: info.no })}`;
}
/** Превращает события одного шага в очередь крупных показов. */
function buildItems(state, events, registry, nextId) {
	const items = [];
	const remembered = (id) => animalInfo(state, id) ?? registry.get(id) ?? null;
	const lang = currentLang();
	for (const e of events) switch (e.kind) {
		case "diceRoll":
			items.push({
				id: nextId(),
				tone: "info",
				title: t("phase.foodBank"),
				dice: e.dice,
				note: t("spot.bankFood", { n: e.total }),
				ms: 2900
			});
			break;
		case "preyKilled": {
			const carn = remembered(e.carnivoreId);
			const prey = remembered(e.preyId);
			items.push({
				id: nextId(),
				tone: "kill",
				title: t("spot.preyKilled"),
				note: t("spot.eats", {
					a: labelOf(carn),
					b: labelOf(prey)
				}),
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
					title: t("defense.running"),
					note: t("spot.triesRun", { a: labelOf(prey) }),
					dice: [e.roll ?? 1],
					verdict: {
						good,
						text: good ? t("spot.escaped") : t("spot.caught")
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
				title: t("defense.tailLoss"),
				note: t("spot.survives", { a: labelOf(prey) }),
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
				title: t("spot.mimicry"),
				note: t("spot.mimicryNote"),
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
				title: e.counter ? t("spot.counterattack") : t("dock.feed.plantAttack"),
				note: e.counter ? t("spot.plantStrikes") : t("spot.plantCatches", { a: lang === "ru" ? labelOf(prey).toLowerCase() : labelOf(prey) }),
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
				title: t("spot.paralysis"),
				note: t("spot.cannotAttack", { a: labelOf(carn) }),
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
			title: t("phase.extinction"),
			note: deaths.length === 1 ? starved === 0 ? t("spot.diedOneNoStarve") : t("spot.diedOneStarve") : starved ? t("spot.diedManyStarve", {
				n: deaths.length,
				m: starved
			}) : t("spot.diedMany", { n: deaths.length }),
			versus: { left: SPECIES_EXTINCT },
			ms: 2700
		});
	}
	return items;
}
function EventSpotlight({ replayEvents, onActiveChange } = {}) {
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
		if (!state || !replayEvents?.length || replayEvents === replayRef.current) return;
		replayRef.current = replayEvents;
		const items = buildItems(state, replayEvents, registryRef.current, nextId);
		if (items.length) setQueue((q) => [...q, ...items].slice(-12));
	}, [
		state,
		replayEvents,
		nextId
	]);
	(0, import_react.useEffect)(() => {
		if (!state || state.eventSeq === seqRef.current) return;
		seqRef.current = state.eventSeq;
		const items = buildItems(state, state.lastEvents, registryRef.current, nextId);
		if (items.length) setQueue((q) => [...q, ...items].slice(-12));
	}, [state, nextId]);
	(0, import_react.useEffect)(() => {
		onActiveChange?.(current !== null);
	}, [current, onActiveChange]);
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
		className: "spotlight-passthrough fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "spotlight-backdrop absolute inset-0",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
			item: current,
			closing,
			onSkip: skip
		}, current.id)]
	});
}
function SpotlightCard({ item, closing, onSkip }) {
	const t = useT();
	const [phase, setPhase] = (0, import_react.useState)(item.dice ? "roll" : "result");
	(0, import_react.useEffect)(() => {
		if (!item.dice) return;
		const t = setTimeout(() => setPhase("result"), 1150);
		return () => clearTimeout(t);
	}, [item]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		onClick: onSkip,
		className: cn("spotlight-card grain relative flex max-h-[85dvh] w-full max-w-md flex-col items-center justify-center gap-4 overflow-y-auto rounded-[var(--radius-xl)] border bg-surface px-6 py-8 text-center shadow-[var(--shadow-card)] sm:px-8 sm:py-9", TONE_BORDER[item.tone], closing && "spotlight-out"),
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
					ariaLabel: t("spot.dieAria", { dice: item.dice.join(", ") })
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
					children: t("spot.skip")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-[0.18em] text-subtle",
					children: t("spot.clickHint")
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
	development: "phase.development",
	foodBank: "phase.foodBank",
	feeding: "phase.feeding",
	extinction: "phase.extinction",
	growth: "phase.growth",
	gameOver: "phase.gameOver"
};
/**
* Текст записи журнала на языке рендера: при наличии key собирается из
* словаря (параметры-термины переводятся), иначе показывается русский text
* движка (старые кадры и сейвы без key).
*/
function logEntryText(lang, entry) {
	if (!entry.key) return entry.text;
	const params = {};
	for (const [k, v] of Object.entries(entry.params ?? {})) params[k] = termParamValue(lang, k, v);
	return translate(lang, entry.key, params);
}
/**
* Значение параметра записи журнала: движок кладёт в params id свойства/
* растения/флоры/метки/территории (см. log() в engine.ts), рендер подставляет
* имя на нужном языке через хелперы terms.ts. Остальные параметры — как есть.
*/
function termParamValue(lang, name, value) {
	if (typeof value !== "string") return String(value);
	switch (name) {
		case "trait":
		case "trait2": return traitName(value, lang);
		case "plant":
		case "plant2": return plantName(value, lang);
		case "flora": return floraName(value, lang);
		case "mark": return markName(value, lang);
		case "zone": return territoryName(value, lang);
		default: return value;
	}
}
/** Причина блокировки действия питания на языке рендера. */
function feedBlockText(lang, info) {
	return info ? translate(lang, info.key) : void 0;
}
/** Мягкая подложка секции игрока: цвет места, подмешанный к фону стола. */
function seatTint(color) {
	if (!color) return void 0;
	return { backgroundColor: `color-mix(in oklab, ${color} 12%, var(--color-surface))` };
}
/**
* Колонки полосы соперников. Одна функция на верхний и нижний ряд: ряды не
* должны отличаться числом колонок (M13). Классы литеральные — динамическую
* сборку Tailwind в исходнике не видит.
*/
function rowCols(n) {
	if (n <= 1) return false;
	return n === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
}
var NO_INTERACTION = {
	highlight: false,
	dimmed: false,
	selected: false,
	danger: false,
	dropTarget: false
};
/** id животного один для драга и для броска: dnd-kit разрешает совмещать. */
var animalDndId = (id) => `animal:${id}`;
var rowDndId = (playerId) => `row:${playerId}`;
var zoneDndId = (playerId, zone) => `zone:${playerId}:${zone}`;
/**
* Какие бросочные цели вообще допустимы для текущего перетаскивания.
* Животное — только свои (перестановка/перенос), карта — чужие звери тоже
* (свойства-паразиты), плюс растения и своя пустая зона под новое животное.
*/
function dndTargetAllowed(active, target) {
	if (!active || !target) return false;
	if (active.kind === "animal") {
		if (target.kind === "animal") return target.ownerId === active.ownerId;
		if (target.kind === "zone") return target.playerId === active.ownerId;
		return false;
	}
	if (active.kind === "card") {
		if (target.kind === "animal" || target.kind === "plants") return true;
		if (target.kind === "row" || target.kind === "zone") return target.playerId === active.ownerId;
		return false;
	}
	return false;
}
/**
* Цель под указателем. Среди вложенных областей выигрывает самая маленькая:
* иначе при броске на животное «побеждала» бы полоса всего ряда.
*/
var dndCollisionDetection = (args) => {
	const active = args.active.data.current;
	const allowed = args.droppableContainers.filter((c) => dndTargetAllowed(active, c.data.current));
	if (!allowed.length) return [];
	const scope = {
		...args,
		droppableContainers: allowed
	};
	const selfId = args.active.id;
	const inside = pointerWithin(scope).filter((c) => c.id !== selfId);
	if (!inside.length) return rectIntersection(scope).filter((c) => c.id !== selfId);
	const area = (id) => {
		const r = args.droppableRects.get(id);
		return r ? r.width * r.height : Number.MAX_SAFE_INTEGER;
	};
	return [...inside].sort((a, b) => area(a.id) - area(b.id));
};
/** Точка последнего движения указателя/пальца — нужна для стороны вставки. */
function dndPointOf(e) {
	if ("touches" in e) {
		const t = e.touches[0] ?? e.changedTouches[0];
		return t ? {
			x: t.clientX,
			y: t.clientY
		} : null;
	}
	return {
		x: e.clientX,
		y: e.clientY
	};
}
/** Куда встанет животное: до или после карточки-цели (по X пальца/курсора). */
function dndSideOf(over, point) {
	const data = over?.data.current;
	if (!over || data?.kind !== "animal") return null;
	const mid = over.rect.left + over.rect.width / 2;
	return (point?.x ?? mid) < mid ? "before" : "after";
}
/** Растение под точкой броска: карточки растений — чужой файл, поэтому ищем по DOM. */
function plantIdAtPoint(point) {
	if (!point) return null;
	for (const el of document.elementsFromPoint(point.x, point.y)) {
		if (el.closest("[data-dnd-ghost]")) continue;
		const plant = el.closest("[data-plant-id]");
		if (plant) return plant.dataset.plantId ?? null;
	}
	return null;
}
/** Связка пары (сотрудничество/симбиоз): переставлять её нужно целиком. */
function pairGroupIds(animals, id) {
	const byId = new Map(animals.map((a) => [a.id, a]));
	const partners = (a) => [...a.traits.map((t) => t.pairWith).filter((x) => Boolean(x)), ...animals.filter((o) => o.traits.some((t) => t.pairWith === a.id)).map((o) => o.id)];
	const group = /* @__PURE__ */ new Set([id]);
	const queue = [id];
	while (queue.length) {
		const cur = byId.get(queue.pop());
		if (!cur) continue;
		for (const next of partners(cur)) {
			if (group.has(next)) continue;
			group.add(next);
			queue.push(next);
		}
	}
	return group;
}
/** Территория животного: без «Континентов» все стоят в Лавразии по умолчанию. */
var zoneOfAnimal = (a) => a.zoneId ?? "laurasia";
/** Подпись совпадает с номером на столе; кличка не скрывает номер животного. */
function animalChoiceLabel(state, id, lang, withOwner = true) {
	const animal = findAnimal(state, id);
	if (!animal) return translate(lang, "spot.animal");
	const owner = state.players.find((p) => p.id === animal.ownerId);
	const no = animal.no ?? (owner ? owner.animals.findIndex((a) => a.id === id) + 1 : 1);
	const label = `${translate(lang, "game.pairNo", { n: no })}${animal.name ? ` «${animal.name}»` : ""}`;
	return withOwner && owner ? `${owner.name}: ${label}` : label;
}
/** Роли пары направлены: первый участник должен иметь легальное действие в роли a. */
function legalPairTargets(actions, intent) {
	const type = intent.kind === "playPair" ? "devPlayPair" : "devPlayPlantPair";
	const targets = /* @__PURE__ */ new Set();
	for (const action of actions) {
		if (action.type !== type || action.cardId !== intent.cardId || action.face !== intent.face) continue;
		if (!intent.first) targets.add(action.a);
		else if (action.a === intent.first) targets.add(action.b);
	}
	return targets;
}
/** Набор id растений, на которые карта ляжет свойством (для подсветки при драге). */
function legalPlantTargets(actions, cardId, face) {
	const set = /* @__PURE__ */ new Set();
	for (const a of actions) {
		if (a.type !== "devPlayPlantTrait" && a.type !== "devPlayPlantPair") continue;
		if (a.cardId !== cardId || face != null && a.face !== face) continue;
		if (a.type === "devPlayPlantTrait") set.add(a.plantId);
		else {
			set.add(a.a);
			set.add(a.b);
		}
	}
	return set;
}
/**
* Растения приглушаются, только когда набор подсветок непустой (так устроен
* PlantStrip). Чтобы «сюда нельзя» всё-таки читалось приглушением, добавляем
* заведомо несуществующий id.
*/
var NO_PLANT_TARGET = "__no-plant-target__";
/**
* Голосовые подсказки перетаскивания для скринридеров. Строки собираются в
* момент события (не рендера), поэтому живой liveT честно отдаёт текущий язык.
*/
var DND_ANNOUNCEMENTS = {
	onDragStart: () => t("dnd.start"),
	onDragOver: () => t("dnd.over"),
	onDragEnd: () => t("dnd.end"),
	onDragCancel: () => t("dnd.cancel")
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
				push(anchorOf(animalEl(e.preyId) ?? animalEl(e.carnivoreId)), t("fx.attack"), "attack");
				break;
			case "preyKilled":
				push(anchorOf(animalEl(e.carnivoreId)), t("fx.preyEaten"), "attack");
				break;
			case "defenseUsed": {
				const prey = animalEl(e.preyId);
				if (e.defense === "tailLoss") {
					shakeEl(prey);
					push(anchorOf(prey), t("fx.tail"), "bad");
				} else if (e.defense === "running") {
					shakeEl(prey);
					push(anchorOf(prey), t("fx.die", { n: e.roll ?? 0 }), "info");
				} else if (e.defense === "mimicry") push(anchorOf(prey), t("fx.mimicry"), "info");
				break;
			}
			case "foodFromBank":
				push(anchorOf(animalEl(e.animalId)), t("fx.redFood"), "good");
				break;
			case "blueFood": {
				const label = e.reason === "piracy" ? t("fx.piracy") : e.reason === "cooperation" ? t("fx.cooperation") : e.reason === "scavenger" ? t("fx.scavenger") : e.reason === "fat" ? t("fx.fat") : e.reason === "tailLoss" ? t("fx.blue") : null;
				if (label) push(anchorOf(animalEl(e.animalId)), label, "info");
				break;
			}
			case "bankBurned":
				push(anchorOf(document.querySelector(".felt")), t("fx.bankBurn", { n: e.amount }), "bad");
				break;
			case "plantFoodTaken":
				push(anchorOf(animalEl(e.animalId)), t("fx.plantFood"), "good");
				break;
			case "shelterTaken":
				push(anchorOf(animalEl(e.animalId)), t("fx.shelter"), "good");
				break;
			case "plantAttack":
				shakeEl(animalEl(e.preyId));
				push(anchorOf(animalEl(e.preyId)), e.counter ? t("fx.plantCounter") : t("fx.plantAttack"), "attack");
				break;
			case "plantGrew":
				push(anchorOf(plantEl(e.plantId)), t("fx.growth", {
					from: e.from,
					to: e.to
				}), "good");
				break;
			case "plantGrazed":
				push(anchorOf(plantEl(e.plantId)), t("fx.graze"), "bad");
				break;
			case "plantDied":
				push(anchorOf(plantEl(e.plantId)), t("fx.plantDied"), "bad");
				break;
			case "cardStolen":
				push(anchorOf(sectionEl(e.toPlayerId)), t("fx.honeyCard"), "info");
				break;
			case "floraFoodTaken":
				push(anchorOf(animalEl(e.animalId)), t("fx.floraFood"), "good");
				break;
			case "floraGrew":
				push(anchorOf(floraEl(e.floraId)), t("fx.fungusGrowth", {
					from: e.from,
					to: e.to
				}), "info");
				break;
			case "floraGrazed":
				push(anchorOf(floraEl(e.floraId)), t("fx.graze"), "bad");
				break;
			case "floraDied":
				push(anchorOf(floraEl(e.floraId)), t("fx.floraDied"), "bad");
				break;
			case "markGained":
				push(anchorOf(animalEl(e.animalId)), t("fx.mark", { mark: markName(e.mark) }), "bad");
				break;
			case "handLost":
				push(anchorOf(sectionEl(e.playerId)), t("fx.handLost"), "bad");
				break;
			case "cardsDrawn":
				for (let i = 0; i < e.counts.length; i++) {
					const n = e.counts[i];
					if (n > 0) {
						const label = n === 1 ? t("fx.cardsOne", { n }) : n < 5 ? t("fx.cardsFew", { n }) : t("fx.cardsMany", { n });
						push(anchorOf(sectionEl(i)), label, "info");
					}
				}
				break;
			case "mutationFlipped": {
				const trait = e.trait ? traitName(e.trait) : "";
				const caption = e.usedAs === "trait" ? t("fx.mutTrait", { trait }) : e.usedAs === "animal" ? t("fx.mutAnimal") : e.usedAs === "newSpecies" ? t("fx.mutMutant") : e.usedAs === "population" ? t("fx.mutPopulation") : e.usedAs === "plantTrait" ? t("fx.mutPlantTrait", { trait }) : t("fx.mutDiscarded");
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
			case "foodToFat": push(centerOf(animalEl(e.animalId)), centerOf(animalEl(e.animalId)), "yellow");
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
var NO_REPLAY = [];
function useNetReplay(state, net) {
	const playedRef = (0, import_react.useRef)(0);
	const startedRef = (0, import_react.useRef)(false);
	const statusRef = (0, import_react.useRef)(null);
	const missedRef = (0, import_react.useRef)(NO_REPLAY);
	const batches = net?.events;
	const status = net?.status ?? null;
	(0, import_react.useEffect)(() => {
		const prev = statusRef.current;
		statusRef.current = status;
		if (prev === "reconnecting" && status && status !== "reconnecting") startedRef.current = false;
	}, [status]);
	if (state && batches?.length) {
		const pending = batches.filter((b) => b.version > playedRef.current).sort((a, b) => a.version - b.version);
		if (pending.length) {
			playedRef.current = pending[pending.length - 1].version;
			const wasStarted = startedRef.current;
			startedRef.current = true;
			missedRef.current = wasStarted ? pending.slice(0, -1).slice(-6).flatMap((b) => b.events) : NO_REPLAY;
		}
	}
	return missedRef.current;
}
/** Тихий щелчок на кнопках дока: карточки и поля молчат, чтобы не шуметь. */
function dockClickSfx(e) {
	if (e.target.closest("button")) sfx.play("click");
}
/**
* Появление/пропадание игроков в сети: join на вошедшего, leave на ушедшего.
* Первый кадр не озвучиваем (вся комната «уже там»), ботов не считаем.
*/
function useNetPresenceSfx(seats) {
	const prevRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
	}, [seats]);
}
/** Новое сообщение чата — мягкий «дзинь» (историю при входе не озвучиваем). */
function useNetChatSfx(chat) {
	const lastIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const list = chat ?? [];
		if (!list.length) return;
		const maxId = list[list.length - 1].id;
		const prev = lastIdRef.current;
		lastIdRef.current = maxId;
		if (prev === null || maxId <= prev) return;
		sfx.play("chat", 0, { gain: .9 });
	}, [chat]);
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
	const t = useT();
	const lastYear = useLastYearBanner(state);
	const mad = state.madTurn === state.humanId;
	if (!lastYear && !mad) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none flex flex-col items-center gap-1 px-3 pt-2",
		children: [mad ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "phase-banner-in rounded-full border border-virus/60 bg-virus/15 px-4 py-1 text-center text-xs text-fg",
			children: t("game.madBanner")
		}) : null, lastYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "phase-banner-in rounded-full border border-clay/60 bg-clay/15 px-4 py-1 text-center text-xs font-medium text-clay",
			children: t("game.lastYearBanner")
		}) : null]
	});
}
function GameApp() {
	const state = useGameStore((s) => s.state);
	const rulesOpen = useGameStore((s) => s.rulesOpen);
	const setRulesOpen = useGameStore((s) => s.setRulesOpen);
	const net = useGameStore((s) => s.net);
	const netAgain = useGameStore((s) => s.netAgain);
	const leaveNet = useGameStore((s) => s.leaveNet);
	const t = useT();
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
	if (!net) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "menu-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuScreen, { onRules: openRules }),
			rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
		]
	});
	if (net.status === "lobby") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LobbyScreen, {}),
		rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
	] });
	if (!state) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "grid min-h-dvh place-items-center text-sm text-muted",
			children: net.status === "finished" ? t("game.openingFinal") : net.status === "reconnecting" ? t("game.reconnecting") : t("game.opening")
		}),
		rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: closeRules }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { ...TOASTER_OPTS })
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col xl:h-dvh xl:overflow-hidden",
		children: [
			net.status === "reconnecting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 top-14 z-40 mx-auto w-fit rounded-full border border-danger/50 bg-danger/15 px-4 py-1.5 text-sm text-clay",
				children: t("game.reconnecting")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {}),
			state.phase === "gameOver" && state.scores ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameOverScreen, {
				scores: state.scores,
				winnerIds: state.winnerIds ?? [],
				humanId: state.humanId,
				...net.spectating ? {} : { onAgain: () => void netAgain() },
				onMenu: leaveNet
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
/** Быстрые фразы сетевого чата — считаются в рендере, чтобы менять язык живо. */
function netQuickPhrases(t) {
	return [
		t("chat.qp.hi"),
		t("chat.qp.goodMove"),
		t("chat.qp.yourTurn"),
		t("chat.qp.thanks")
	];
}
/** Нейтральный тон автора без места (ожидающие и зрители) — как в лобби. */
var NEUTRAL_AUTHOR_COLOR = "var(--color-muted)";
/**
* Лента «журнал + чат». У записей журнала нет времени, поэтому время первого
* показа запоминаем на клиенте: так сообщения чата подмешиваются в ленту по
* своим меткам, а не сваливаются одним блоком в конец. Ключи — монотонные id
* (logSeq у журнала, id сообщения у чата), поэтому React не пересоздаёт строки.
*/
function useFeedItems(state, net) {
	const lang = useLang();
	const seenAtRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const chat = net?.chat;
	const reactions = net?.reactions;
	const myName = net?.name;
	const seats = net?.seats;
	const system = net?.system;
	return (0, import_react.useMemo)(() => {
		const now = Date.now();
		const seen = seenAtRef.current;
		const rows = [];
		const byChat = reactionsByChatId(reactions, myName);
		const colorOfSeat = /* @__PURE__ */ new Map();
		for (const s of seats ?? []) colorOfSeat.set(s.seat, s.color);
		const colorOfName = (name) => {
			const i = state.players.findIndex((p) => p.name === name);
			return i >= 0 ? colorForSeat(i) : void 0;
		};
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
					text: logEntryText(lang, e)
				}
			});
		}
		for (const m of chat ?? []) {
			const color = colorOfSeat.get(m.seat) ?? colorOfName(m.name) ?? NEUTRAL_AUTHOR_COLOR;
			const rs = byChat.get(m.id);
			rows.push({
				sortAt: m.at,
				item: {
					id: `chat-${m.id}`,
					kind: "chat",
					text: m.text,
					playerName: m.name,
					at: m.at,
					seat: m.seat,
					chatId: m.id,
					color,
					...rs ? { reactions: rs } : {}
				}
			});
		}
		for (const n of system ?? []) {
			const text = n.key ? translate(lang, n.key, n.params ?? void 0) : n.text;
			rows.push({
				sortAt: n.at,
				item: {
					id: n.id,
					kind: "system",
					text,
					at: n.at
				}
			});
		}
		rows.sort((a, b) => a.sortAt - b.sortAt);
		return rows.slice(-140).map((r) => r.item);
	}, [
		state.log,
		state.players,
		chat,
		system,
		seats,
		reactions,
		myName,
		lang
	]);
}
function Table() {
	const state = useGameStore((s) => s.state);
	const intent = useGameStore((s) => s.intent);
	const logOpen = useGameStore((s) => s.logOpen);
	const logUnread = useGameStore((s) => s.logUnread);
	const dispatch = useGameStore((s) => s.dispatch);
	const setIntent = useGameStore((s) => s.setIntent);
	const setLogOpen = useGameStore((s) => s.setLogOpen);
	const setRulesOpen = useGameStore((s) => s.setRulesOpen);
	const net = useGameStore((s) => s.net);
	const sendChat = useGameStore((s) => s.sendChat);
	const sendReaction = useGameStore((s) => s.sendReaction);
	const sendTyping = useGameStore((s) => s.sendTyping);
	const leaveNet = useGameStore((s) => s.leaveNet);
	const netResign = useGameStore((s) => s.netResign);
	const netError = useGameStore((s) => s.net?.error);
	const clearNetError = useGameStore((s) => s.clearNetError);
	const t$1 = useT();
	const lang = useLang();
	const [confirmLeave, setConfirmLeave] = (0, import_react.useState)(false);
	const confirmRef = (0, import_react.useRef)(false);
	const askLeave = (0, import_react.useCallback)((v) => {
		sfx.play("modal");
		confirmRef.current = v;
		setConfirmLeave(v);
	}, []);
	const feed = useFeedItems(state, net);
	const typingNames = (0, import_react.useMemo)(() => net ? typingNamesOf(net) : [], [net]);
	(0, import_react.useEffect)(() => {
		if (!netError) return;
		toast.error(netError);
		clearNetError();
	}, [netError, clearNetError]);
	const human = player(state, state.humanId);
	const actor = currentActor(state);
	const isHumanTurn = actor?.id === human.id && state.madTurn !== human.id && !net?.spectating;
	const [turnCard, setTurnCard] = (0, import_react.useState)(null);
	const [turnCardClosing, setTurnCardClosing] = (0, import_react.useState)(false);
	const [spotlightActive, setSpotlightActive] = (0, import_react.useState)(false);
	const lastHumanKeyRef = (0, import_react.useRef)(null);
	const turnCardTimerRef = (0, import_react.useRef)(null);
	const closeTurnCard = (0, import_react.useCallback)(() => {
		setTurnCardClosing(true);
		if (turnCardTimerRef.current) window.clearTimeout(turnCardTimerRef.current);
		turnCardTimerRef.current = window.setTimeout(() => {
			setTurnCard(null);
			setTurnCardClosing(false);
		}, 200);
	}, []);
	(0, import_react.useEffect)(() => {
		const key = `${state.year}:${state.phase}:${state.currentPlayerId ?? -1}:${state.madTurn ?? -1}:${state.turnSeq ?? 0}`;
		if (!(isHumanTurn && !state.pendingAttack && !state.rageTurn)) {
			setTurnCard(null);
			return;
		}
		if (lastHumanKeyRef.current === key) return;
		if (spotlightActive) return;
		lastHumanKeyRef.current = key;
		setTurnCard(key);
	}, [
		isHumanTurn,
		state.pendingAttack,
		state.rageTurn,
		state.year,
		state.phase,
		state.currentPlayerId,
		state.madTurn,
		state.turnSeq,
		spotlightActive
	]);
	(0, import_react.useEffect)(() => {
		if (!turnCard || turnCardClosing) return;
		const t = window.setTimeout(() => closeTurnCard(), 1600);
		return () => window.clearTimeout(t);
	}, [
		turnCard,
		turnCardClosing,
		closeTurnCard
	]);
	(0, import_react.useEffect)(() => () => {
		if (turnCardTimerRef.current) window.clearTimeout(turnCardTimerRef.current);
	}, []);
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
	/**
	* «Случайные мутации» в сети: снимок прячет личную колоду (`blindDeck = []`),
	* поэтому `legalDevActions` на клиенте не предлагает `devMutate` вовсе —
	* клики по видам и растениям молчали бы. Если карты есть по счётчику
	* (`blindDeckCount`), цель считаем допустимой по правилам движка
	* (`legalDevActions` в engine.ts): свой вид из одной особи; численность —
	* пока видов меньше, чем карт в колоде хватает. Сервер перепроверит ход.
	*/
	const mutateGuess = (0, import_react.useCallback)((kind, target) => {
		const left = human.blindDeckCount ?? human.blindDeck?.length ?? 0;
		if ((human.blindDeck?.length ?? 0) > 0 || left <= 0) return false;
		if (kind === "plant") return (state.plants ?? []).some((pl) => pl.id === target.plantId);
		const animal = target.animalId ? findAnimal(state, target.animalId) : void 0;
		if (!animal || animal.ownerId !== human.id) return false;
		if (kind === "trait") return (animal.population ?? 1) === 1;
		const ext = animal.traits.some((t) => t.type === "extremophile" && !t.disabled);
		return (animal.population ?? 1) < human.animals.length && (!ext || left >= 2);
	}, [human, state]);
	/**
	* Доступность грани руки: источник правды — уже посчитанные легальные
	* действия. Свойство растения без животных законно (кладут на растение),
	* поэтому блокируется именно грань, а не «все свойства» разом.
	*/
	const faceAvailable = (0, import_react.useCallback)((cardId, face) => devActs.some((a) => (a.type === "devPlayTrait" || a.type === "devPlayPair" || a.type === "devPlayPlantTrait" || a.type === "devPlayPlantPair") && a.cardId === cardId && a.face === face), [devActs]);
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
			const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedTake"));
			if (r) out.take = r;
		}
		if (has("carnivore") || has("obligateCarnivore")) {
			const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedHunt"));
			if (r) out.hunt = r;
		}
		if (has("piracy")) {
			const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedPirate"));
			if (r) out.pirate = r;
		}
		if (has("hibernation")) {
			const r = feedBlockText(lang, feedBlockReasonInfo(state, human.id, "feedHibernate"));
			if (r) out.sleep = r;
		}
		return out.take || out.hunt || out.pirate || out.sleep ? out : null;
	}, [
		state,
		isHumanTurn,
		human,
		lang
	]);
	const dndSensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: {
		delay: 220,
		tolerance: 8
	} }));
	const [dndActive, setDndActive] = (0, import_react.useState)(null);
	const [dndOver, setDndOver] = (0, import_react.useState)(null);
	const dndPointRef = (0, import_react.useRef)(null);
	const [defensePreviewId, setDefensePreviewId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!dndActive) return;
		const track = (e) => {
			const p = dndPointOf(e);
			if (p) dndPointRef.current = p;
		};
		window.addEventListener("pointermove", track, { passive: true });
		window.addEventListener("touchmove", track, { passive: true });
		return () => {
			window.removeEventListener("pointermove", track);
			window.removeEventListener("touchmove", track);
		};
	}, [dndActive]);
	/** Выбранная кликом грань карты; null — грань выбирает движок. */
	const selectedFaceOf = (0, import_react.useCallback)((cardId) => intent.kind !== "none" && "cardId" in intent && intent.cardId === cardId && "face" in intent ? intent.face : null, [intent]);
	/**
	* Животные-цели для тащи́мой карты — из уже посчитанных действий движка.
	* Пока карту тащат, все прочие звери приглушены: «сюда свойство не ляжет».
	*/
	const cardDragTargets = (0, import_react.useMemo)(() => {
		if (dndActive?.kind !== "card" || !dndActive.cardId) return null;
		const face = selectedFaceOf(dndActive.cardId);
		if (intent.kind === "playPair" && intent.cardId === dndActive.cardId) return legalPairTargets(devActs, intent);
		const set = /* @__PURE__ */ new Set();
		for (const a of devActs) {
			if (a.type !== "devPlayTrait" && a.type !== "devPlayPair") continue;
			if (a.cardId !== dndActive.cardId || face != null && a.face !== face) continue;
			if (a.type === "devPlayTrait") set.add(a.animalId);
			else set.add(a.a);
		}
		return set;
	}, [
		dndActive,
		devActs,
		selectedFaceOf,
		intent
	]);
	/**
	* Растения-цели для тащи́мой карты. Пустой набор PlantStrip не приглушает,
	* поэтому «нельзя никуда» дополняем несуществующим id — тогда вся полоса
	* гаснет и видно, что свойство растения сюда не ляжет.
	*/
	const cardDragPlants = (0, import_react.useMemo)(() => {
		if (dndActive?.kind !== "card" || !dndActive.cardId) return null;
		const set = legalPlantTargets(devActs, dndActive.cardId, selectedFaceOf(dndActive.cardId));
		return set.size ? set : /* @__PURE__ */ new Set([NO_PLANT_TARGET]);
	}, [
		dndActive,
		devActs,
		selectedFaceOf
	]);
	const interactions = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		const cardDrag = cardDragTargets !== null;
		for (const p of state.players) for (const a of p.animals) {
			const hl = animalHighlight(state, a, intent, isHumanTurn, feedActs, devActs, mutateGuess);
			const cardTarget = cardDragTargets?.has(a.id) ?? false;
			const underPointer = dndOver?.data.animalId === a.id;
			const defenseTarget = Boolean(state.pendingAttack && defensePreviewId === a.id);
			map.set(a.id, {
				highlight: hl || cardTarget || defenseTarget,
				dimmed: !defenseTarget && (intent.kind !== "none" && !hl || cardDrag && !cardTarget),
				selected: intent.kind === "playPair" && intent.first === a.id || intent.kind === "hunt" && intent.carnivoreId === a.id || intent.kind === "pirate" && intent.pirateId === a.id,
				danger: hl && (intent.kind === "hunt" && intent.carnivoreId !== void 0 || intent.kind === "pirate" && intent.pirateId !== void 0 || intent.kind === "plantAttack" && intent.plantId !== void 0 || intent.kind === "parasitize"),
				dropTarget: defenseTarget || underPointer && (cardDrag ? cardTarget : dndActive?.kind === "animal" && a.id !== dndActive.animalId)
			});
		}
		return map;
	}, [
		state,
		intent,
		isHumanTurn,
		feedActs,
		devActs,
		mutateGuess,
		cardDragTargets,
		dndOver,
		dndActive,
		defensePreviewId
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
			} else if (intent.kind === "playPlantPair") for (const id of legalPairTargets(devActs, intent)) set.add(id);
			else if (intent.kind === "mutatePlant") {
				for (const a of devActs) if (a.type === "devMutate" && a.intent === "plant" && a.plantId) set.add(a.plantId);
				if (!set.size) {
					for (const pl of state.plants ?? []) if (mutateGuess("plant", { plantId: pl.id })) set.add(pl.id);
				}
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
		state.plants,
		intent,
		devActs,
		feedActs,
		isHumanTurn,
		mutateGuess
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
				if (!legalPairTargets(devActs, intent).has(plant.id)) return;
				if (!intent.first) {
					setIntent({
						...intent,
						first: plant.id
					});
					return;
				}
				dispatchAct({
					type: "devPlayPlantPair",
					cardId: intent.cardId,
					face: intent.face,
					a: intent.first,
					b: plant.id
				});
				return;
			}
			if (intent.kind === "mutatePlant") {
				if (devActs.some((a) => a.type === "devMutate" && a.intent === "plant" && a.plantId === plant.id) || mutateGuess("plant", { plantId: plant.id })) dispatchAct({
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
			mutateGuess,
			dispatch,
			setIntent
		});
	}
	const dndOverInfo = (over) => {
		if (!over) return null;
		const data = over.data.current;
		if (!data) return null;
		return {
			id: String(over.id),
			data,
			side: dndSideOf(over, dndPointRef.current)
		};
	};
	/** Короткий звук отказа: бросок на недопустимую цель ничего не делает. */
	const rejectDrop = () => sfx.play("crack");
	/**
	* Что делать при броске. Легальность не дублируем: сверяемся с devActs
	* движка (devPlayAnimal / devPlayTrait / devPlayPair / devPlayPlantTrait /
	* devPlayPlantPair), а свои правила только выбираем подходящее действие.
	*/
	function performDndDrop(active, target, side, point) {
		if (active.kind === "animal") {
			const moved = active.animalId ? human.animals.find((a) => a.id === active.animalId) : void 0;
			if (!moved) return;
			if (target.kind === "animal") {
				const dest = target.animalId ? findAnimal(state, target.animalId) : void 0;
				if (!dest || dest.id === moved.id || dest.ownerId !== human.id) return;
				const group = pairGroupIds(human.animals, moved.id);
				if (group.has(dest.id)) return;
				if (state.modules.continents && zoneOfAnimal(moved) !== zoneOfAnimal(dest)) {
					if (state.phase !== "development") return rejectDrop();
					dispatch({
						type: "reorderAnimal",
						animalId: moved.id,
						toZoneId: zoneOfAnimal(dest)
					});
					return;
				}
				const rest = human.animals.filter((a) => !group.has(a.id));
				const at = rest.findIndex((a) => a.id === dest.id);
				if (at < 0) return;
				const beforeId = side === "before" ? dest.id : rest[at + 1]?.id;
				if (beforeId === moved.id) return;
				dispatch({
					type: "reorderAnimal",
					animalId: moved.id,
					beforeId
				});
				return;
			}
			if (target.kind === "zone") {
				if (target.playerId !== human.id || !target.zoneId) return;
				if (target.zoneId === "ocean") return rejectDrop();
				if (state.phase !== "development") return rejectDrop();
				if (zoneOfAnimal(moved) === target.zoneId) return;
				dispatch({
					type: "reorderAnimal",
					animalId: moved.id,
					toZoneId: target.zoneId
				});
				return;
			}
			return;
		}
		if (active.kind !== "card" || !active.cardId) return;
		const cardId = active.cardId;
		if (!human.hand.some((c) => c.id === cardId)) return;
		const face = selectedFaceOf(cardId);
		const acts = devActs.filter((a) => {
			if (a.type !== "devPlayTrait" && a.type !== "devPlayPair" && a.type !== "devPlayPlantTrait" && a.type !== "devPlayPlantPair") return false;
			return a.cardId === cardId && (face == null || a.face === face);
		});
		if (target.kind === "animal") {
			const animalId = target.animalId;
			if (!animalId) return;
			if (intent.kind === "playPair" && intent.cardId === cardId && intent.first && intent.first !== animalId) {
				const act = acts.find((a) => a.type === "devPlayPair" && a.a === intent.first && a.b === animalId);
				if (act) return dispatch(act);
				return rejectDrop();
			}
			const simple = acts.find((a) => a.type === "devPlayTrait" && a.animalId === animalId);
			if (simple) return dispatch(simple);
			const pair = acts.find((a) => a.type === "devPlayPair" && a.a === animalId);
			if (pair) {
				setIntent({
					kind: "playPair",
					cardId,
					face: pair.face,
					first: animalId
				});
				sfx.play("click");
				return;
			}
			return rejectDrop();
		}
		if (target.kind === "zone" || target.kind === "row") {
			if (target.kind === "zone" && (!target.zoneId || target.zoneId === "ocean")) return rejectDrop();
			const act = devActs.find((a) => a.type === "devPlayAnimal" && a.cardId === cardId && (target.kind === "zone" ? a.zoneId === target.zoneId : a.zoneId === void 0));
			if (act) return dispatch(act);
			return rejectDrop();
		}
		if (target.kind === "plants") {
			const plantId = plantIdAtPoint(point);
			if (!plantId) return rejectDrop();
			if (intent.kind === "playPlantPair" && intent.cardId === cardId && intent.first && intent.first !== plantId) {
				const act = acts.find((a) => a.type === "devPlayPlantPair" && a.a === intent.first && a.b === plantId);
				if (act) return dispatch(act);
				return rejectDrop();
			}
			const simple = acts.find((a) => a.type === "devPlayPlantTrait" && a.plantId === plantId);
			if (simple) return dispatch(simple);
			const pair = acts.find((a) => a.type === "devPlayPlantPair" && (a.a === plantId || a.b === plantId));
			if (pair) {
				setIntent({
					kind: "playPlantPair",
					cardId,
					face: pair.face,
					first: plantId
				});
				sfx.play("click");
				return;
			}
			return rejectDrop();
		}
	}
	function handleDndStart(e) {
		const data = e.active.data.current;
		if (!data) return;
		dndPointRef.current = null;
		setDndActive(data);
		setDndOver(null);
	}
	/** Цель под указателем; одинаковые кадры не перерисовывают стол. */
	const syncDndOver = (over) => {
		const info = dndOverInfo(over);
		setDndOver((prev) => prev && info && prev.id === info.id && prev.side === info.side ? prev : info);
	};
	function handleDndOver(e) {
		syncDndOver(e.over);
	}
	function handleDndMove(e) {
		syncDndOver(e.over);
	}
	function handleDndEnd(e) {
		const active = e.active.data.current;
		const info = dndOverInfo(e.over);
		setDndActive(null);
		setDndOver(null);
		const point = dndPointRef.current;
		dndPointRef.current = null;
		if (!active || !info || !dndTargetAllowed(active, info.data)) return;
		performDndDrop(active, info.data, info.side, point);
	}
	function handleDndCancel() {
		setDndActive(null);
		setDndOver(null);
		dndPointRef.current = null;
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
	* Рассадка вокруг поля. Полосы сверху и снизу держат одинаковое число табло
	* (2 или 3, в одну строку), бока — не больше одного табло с каждой стороны:
	* стол не собирается в «две строчки» сбоку и верхний ряд не отличается от
	* нижнего. Один/два/три соперника остаются в «уютной» раскладке у сукна.
	*/
	const seats = (0, import_react.useMemo)(() => {
		const top = [];
		const left = [];
		const right = [];
		const bottom = [];
		const n = opponents.length;
		if (n > 8) {
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
			return {
				top,
				left,
				right,
				bottom
			};
		}
		if (n === 1) top.push(opponents[0]);
		else if (n === 2) {
			left.push(opponents[0]);
			right.push(opponents[1]);
		} else if (n === 3) {
			top.push(opponents[0]);
			left.push(opponents[1]);
			right.push(opponents[2]);
		} else if (n === 4) {
			top.push(opponents[0], opponents[1]);
			left.push(opponents[2]);
			right.push(opponents[3]);
		} else if (n === 5) {
			top.push(opponents[0], opponents[1]);
			bottom.push(opponents[2], opponents[3]);
			left.push(opponents[4]);
		} else if (n === 6) {
			top.push(opponents[0], opponents[1]);
			bottom.push(opponents[2], opponents[3]);
			left.push(opponents[4]);
			right.push(opponents[5]);
		} else if (n === 7) {
			top.push(opponents[0], opponents[1], opponents[2]);
			bottom.push(opponents[3], opponents[4], opponents[5]);
			left.push(opponents[6]);
		} else {
			top.push(opponents[0], opponents[1], opponents[2]);
			bottom.push(opponents[3], opponents[4], opponents[5]);
			left.push(opponents[6]);
			right.push(opponents[7]);
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
	const lastLogEntry = state.log[state.log.length - 1];
	const lastLog = lastLogEntry ? logEntryText(lang, lastLogEntry) : void 0;
	const dying = (0, import_react.useMemo)(() => new Set(state.extinctionDeaths), [state.extinctionDeaths]);
	const fx = useActionFx(state);
	const dndHints = (0, import_react.useMemo)(() => {
		if (!isHumanTurn) return void 0;
		const insert = dndActive?.kind === "animal" && dndOver?.data.kind === "animal" && dndOver.data.animalId && dndOver.side ? {
			id: dndOver.data.animalId,
			side: dndOver.side
		} : void 0;
		const zoneDrop = dndActive?.kind === "card" || dndActive?.kind === "animal" && state.phase === "development";
		const zoneOver = dndOver?.data.kind === "zone" ? dndOver.data.zoneId ?? null : null;
		if (!insert && !zoneDrop) return void 0;
		return {
			insert,
			zoneDrop,
			zoneOver
		};
	}, [
		isHumanTurn,
		dndActive,
		dndOver,
		state.phase
	]);
	const dragGhost = (0, import_react.useMemo)(() => {
		if (!dndActive) return null;
		if (dndActive.kind === "animal" && dndActive.animalId) {
			const animal = findAnimal(state, dndActive.animalId);
			return animal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimalCard, { animal }) : null;
		}
		if (dndActive.kind === "card" && dndActive.cardId) {
			const card = human.hand.find((c) => c.id === dndActive.cardId);
			return card ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardPreview, { card }) : null;
		}
		return null;
	}, [
		dndActive,
		state,
		human.hand
	]);
	useSfx(state);
	const fly = useFoodFly(state);
	const netReplay = useNetReplay(state, net);
	useNetPresenceSfx(net?.seats);
	useNetChatSfx(net?.chat);
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
		const key = `${state.year}:${state.phase}:${state.currentPlayerId ?? -1}:${state.madTurn ?? -1}:${state.turnSeq ?? 0}`;
		prevHumanTurnRef.current = isHumanTurn;
		prevTurnKeyRef.current = key;
		if (prevHuman === false && isHumanTurn && !state.pendingAttack && prevKey !== key) sfx.play("yourTurn");
	}, [
		isHumanTurn,
		state.pendingAttack,
		state.year,
		state.phase,
		state.currentPlayerId,
		state.madTurn,
		state.turnSeq
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
		const unlocked = recordGame(state, sessionRef.current, "net");
		for (const a of unlocked) toast.success(t("game.achievementToast", { name: achievementName(a.id) }), { description: achievementDesc(a.id) });
	}, [state]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DndContext, {
		sensors: dndSensors,
		collisionDetection: dndCollisionDetection,
		accessibility: { announcements: DND_ANNOUNCEMENTS },
		onDragStart: handleDndStart,
		onDragOver: handleDndOver,
		onDragMove: handleDndMove,
		onDragEnd: handleDndEnd,
		onDragCancel: handleDndCancel,
		children: [
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
				subtitle: `${t$1("game.yearN", { year: state.year })}${state.lastYear ? ` · ${t$1("game.yearLast")}` : ""} · ${t$1(PHASE_LABEL[state.phase] ?? "phase.development")}${actor ? ` · ${scientistName(actor.name, lang)}` : ""}`,
				subtitleShort: `${t$1("game.yearN", { year: state.year })} · ${t$1(PHASE_LABEL[state.phase] ?? "phase.development")}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
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
									"aria-label": tableLayout === "cozy" ? t$1("game.layoutWide") : t$1("game.layoutCozy"),
									"aria-pressed": tableLayout === "wide",
									title: tableLayout === "cozy" ? t$1("game.layoutWide") : t$1("game.layoutCozy"),
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									className: "relative size-9 sm:size-11",
									"aria-label": t$1("game.logButton"),
									"aria-pressed": logOpen,
									title: logUnread > 0 ? t$1("game.logButtonUnread", { n: logUnread }) : t$1("game.logButton"),
									onClick: () => {
										sfx.play("click");
										setLogOpen(!logOpen);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" }), !logOpen && logUnread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold text-accent-fg",
										"aria-label": t$1("game.unreadCount", { n: logUnread }),
										children: logUnread > 99 ? "99+" : logUnread
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-9 sm:size-11",
									"aria-label": t$1("topbar.rules"),
									title: t$1("topbar.rules"),
									onClick: openRulesModal,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-9 sm:size-11",
									"aria-label": t$1("game.leaveButton"),
									title: t$1("game.leaveButton"),
									onClick: () => {
										sfx.play("click");
										if (state.phase === "gameOver") leaveNet();
										else askLeave(true);
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5 shrink-0" }), t$1("game.spectBadge")]
			}) : null,
			net ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactionsLayer, {
				net,
				phase: state.phase
			}) : null,
			turnCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 flex items-center justify-center p-6",
				onClick: closeTurnCard,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "turn-card-backdrop absolute inset-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "status",
					className: cn("grain relative flex w-full max-w-sm flex-col items-center gap-2 rounded-[var(--radius-xl)] border border-accent/60 bg-surface px-8 py-8 text-center shadow-[var(--shadow-card)]", turnCardClosing ? "turn-card-closing" : "turn-card"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "size-2 rounded-full bg-accent pulse-dot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl",
							children: t$1("game.turnYour")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: t$1("game.turnCardSub", {
								year: state.year,
								phase: t$1(PHASE_LABEL[state.phase] ?? "phase.development")
							})
						})
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col xl:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					onClick: onBoardClick,
					className: cn("flex flex-1 flex-col gap-3 px-3 py-3 sm:px-5 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain", wideSeats && (plantsOn || fungiOn) && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-3 lg:[grid-template-areas:'plants_plants_plants''top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']", wideSeats && !plantsOn && !fungiOn && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto_auto] lg:gap-3 lg:[grid-template-areas:'top_top_top''left_felt_right''bottom_bottom_bottom''human_human_human']", !wideSeats && "lg:mx-auto lg:w-full lg:max-w-4xl", state.phase === "extinction" ? "extinction-glow" : ""),
					children: [
						plantsOn || fungiOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndArea, {
							id: "plants",
							style: wideSeats ? { gridArea: "plants" } : void 0,
							className: "flex flex-col gap-2",
							children: state.modules.continents ? ["gondwana", "laurasia"].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [plantsOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantStrip, {
									state,
									zone: z,
									highlights: cardDragPlants ?? plantHighlights,
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
								highlights: cardDragPlants ?? plantHighlights,
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
							className: cn("grid gap-3", rowCols(seats.top.length)),
							children: seats.top.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
								p,
								actorId: actor?.id ?? null,
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
								interactions: getInteraction,
								dying,
								freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
								continents: Boolean(state.modules.continents)
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenterField, {
							style: wideSeats ? { gridArea: "felt" } : void 0,
							wide: wideSeats,
							year: state.year,
							lastYear: state.lastYear,
							phase: state.phase,
							bank: state.foodBank,
							territoryFood: state.modules.continents ? state.territoryFood : void 0,
							deckLeft: state.deckCount ?? state.deck.length,
							foodRoll: state.foodRoll,
							lastLog,
							actorName: actor ? scientistName(actor.name, lang) : void 0,
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
								interactions: getInteraction,
								dying,
								freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
								continents: Boolean(state.modules.continents)
							}, p.id))
						}),
						seats.bottom.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: wideSeats ? { gridArea: "bottom" } : void 0,
							className: cn("grid gap-3", rowCols(seats.bottom.length)),
							children: seats.bottom.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
								p,
								actorId: actor?.id ?? null,
								interactions: getInteraction,
								dying,
								freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
								continents: Boolean(state.modules.continents)
							}, p.id))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
							p: human,
							isHuman: true,
							canReorder: isHumanTurn && !state.pendingAttack && (state.phase === "development" || state.phase === "feeding"),
							dnd: dndHints,
							actorId: actor?.id ?? null,
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
					title: t$1("game.logButton"),
					onSend: (text) => void sendChat(text),
					quickPhrases: netQuickPhrases(t$1),
					onReact: (item, emoji) => void sendReaction(emoji, "reaction", item.seat !== void 0 && item.seat >= 0 ? item.seat : null, item.chatId ?? null),
					onTyping: sendTyping,
					typingNames
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "sticky bottom-0 z-20 border-t border-border bg-bg/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm sm:px-5",
				children: net?.spectating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center justify-center gap-2 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), t$1("game.spectDock")]
				}) : state.phase === "development" ? state.modules.randomMutations ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MutateDock, {
					human,
					intent,
					disabled: !isHumanTurn || Boolean(state.pendingAttack),
					continents: Boolean(state.modules.continents),
					canPlant: Boolean(state.modules.plants),
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
					state,
					devActs,
					human,
					intent,
					disabled: !isHumanTurn || Boolean(state.pendingAttack),
					continents: Boolean(state.modules.continents),
					freshIds: freshHand,
					faceAvailable,
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
					targetPicked: intent.kind === "hunt" && intent.carnivoreId !== void 0 || intent.kind === "pirate" && intent.pirateId !== void 0 || intent.kind === "plantAttack" && intent.plantId !== void 0,
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
					children: state.phase === "foodBank" ? plantsOn || fungiOn ? t$1("game.wait.oceanBank") : state.foodRoll ? t$1("game.wait.diceThrown") : t$1("game.wait.roll") : state.phase === "extinction" ? t$1("game.wait.extinction") : state.phase === "growth" ? t$1("game.wait.growth") : state.madTurn === (actor?.id ?? -2) ? t$1("game.wait.madness", { name: actor ? scientistName(actor.name, lang) : "" }) : actor && actor.id !== human.id ? t$1("game.wait.actor", { name: scientistName(actor.name, lang) }) : t$1("game.wait.waiting")
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
				replayEvents: netReplay,
				onActiveChange: setSpotlightActive
			}),
			state.pendingAttack && state.pendingAttack.waitingFor === human.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefenseDock, {
				acts: defActs,
				onPick: (a) => dispatch(a),
				onPreview: setDefensePreviewId
			}) : null,
			confirmLeave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: t$1("leave.title"),
				body: net?.spectating ? t$1("leave.bodySpectator") : t$1("leave.bodyPlayer"),
				confirmLabel: net?.spectating ? t$1("leave.confirmSpectator") : t$1("leave.confirmPlayer"),
				cancelLabel: t$1("leave.stay"),
				tone: net?.spectating ? "default" : "danger",
				extraLabel: net?.spectating ? void 0 : t$1("leave.justLeave"),
				onExtra: net?.spectating ? void 0 : () => leaveNet(),
				onConfirm: () => {
					askLeave(false);
					if (net?.spectating) leaveNet();
					else netResign().finally(() => leaveNet());
				},
				onClose: () => askLeave(false)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragOverlay, {
				zIndex: 80,
				dropAnimation: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? null : {
					duration: 180,
					easing: "cubic-bezier(0.2, 0, 0, 1)"
				},
				children: dragGhost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-dnd-ghost": true,
					className: "rotate-2 opacity-95 drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]",
					children: dragGhost
				}) : null
			})
		]
	});
}
function handleAnimalClick(animal, ctx) {
	const { state, intent, human, feedActs, devActs, mutateGuess, dispatch, setIntent } = ctx;
	if (state.pendingAttack) return;
	if (state.phase === "development") {
		if (intent.kind === "mutateTrait") {
			if (devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id) || mutateGuess("trait", { animalId: animal.id })) dispatch({
				type: "devMutate",
				intent: "trait",
				animalId: animal.id
			});
			return;
		}
		if (intent.kind === "mutatePop") {
			if (devActs.some((a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id) || mutateGuess("population", { animalId: animal.id })) dispatch({
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
			if (!legalPairTargets(devActs, intent).has(animal.id)) return;
			if (!intent.first) {
				setIntent({
					...intent,
					first: animal.id
				});
				return;
			}
			dispatch({
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
			if (feedActs.some((a) => a.type === "feedHunt" && a.carnivoreId === animal.id)) setIntent({
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
			if (feedActs.some((a) => a.type === "feedPirate" && a.pirateId === animal.id)) setIntent({
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
function animalHighlight(state, animal, intent, isHumanTurn, feedActs, devActs, mutateGuess) {
	if (!isHumanTurn) return false;
	if (intent.kind === "playTrait") return devActs.some((a) => a.type === "devPlayTrait" && a.cardId === intent.cardId && a.face === intent.face && a.animalId === animal.id);
	if (intent.kind === "mutateTrait") return devActs.some((a) => a.type === "devMutate" && a.intent === "trait" && a.animalId === animal.id) || Boolean(mutateGuess?.("trait", { animalId: animal.id }));
	if (intent.kind === "mutatePop") return devActs.some((a) => a.type === "devMutate" && a.intent === "population" && a.animalId === animal.id) || Boolean(mutateGuess?.("population", { animalId: animal.id }));
	if (intent.kind === "playPair") {
		const legal = legalPairTargets(devActs, intent);
		return intent.first ? legal.has(animal.id) : legal.has(animal.id) && animal.ownerId === state.humanId;
	}
	if (state.phase !== "feeding") return false;
	if (intent.kind === "hunt" && intent.carnivoreId) {
		const car = findAnimal(state, intent.carnivoreId);
		return Boolean(car && (state.rageTurn ? canRageAttack(state, car, animal) : canAttack(state, car, animal)));
	}
	if (intent.kind === "hunt" && !intent.carnivoreId) return feedActs.some((a) => a.type === "feedHunt" && a.carnivoreId === animal.id);
	if (intent.kind === "pirate" && !intent.pirateId) return feedActs.some((a) => a.type === "feedPirate" && a.pirateId === animal.id);
	if (intent.kind === "pirate" && intent.pirateId) return feedActs.some((a) => a.type === "feedPirate" && a.pirateId === intent.pirateId && a.targetId === animal.id);
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
/**
* Цепочки пар в табло: связанные парными свойствами животные идут подряд,
* чтобы плашка пары лежала ровно между соседями. Порядок внутри цепочки —
* как в ряду животных, старт с того конца, что стоит раньше: взаимный
* порядок сохраняется, а вторая пара не отрывает первую от животного
* (партнёры стоят по сторонам: B — A — C).
*/
function pairChains(animals) {
	const byId = new Map(animals.map((a) => [a.id, a]));
	const idx = new Map(animals.map((a, i) => [a.id, i]));
	const partnersOf = (a) => a.traits.filter((t) => t.pairWith && byId.has(t.pairWith)).map((t) => t.pairWith);
	const seen = /* @__PURE__ */ new Set();
	const chains = [];
	for (const start of animals) {
		if (seen.has(start.id)) continue;
		const comp = /* @__PURE__ */ new Set([start.id]);
		const queue = [start];
		while (queue.length) {
			const cur = queue.shift();
			for (const id of partnersOf(cur)) {
				if (comp.has(id)) continue;
				comp.add(id);
				const next = byId.get(id);
				if (next) queue.push(next);
			}
		}
		const members = animals.filter((a) => comp.has(a.id));
		const linksIn = (a) => partnersOf(a).filter((id) => comp.has(id)).length;
		let head = members[0];
		for (const m of members) {
			if (linksIn(m) > 1) continue;
			if (linksIn(head) > 1 || (idx.get(m.id) ?? 0) < (idx.get(head.id) ?? 0)) head = m;
		}
		const ordered = [];
		const walked = /* @__PURE__ */ new Set();
		let cur = head;
		while (cur && !walked.has(cur.id)) {
			ordered.push(cur);
			walked.add(cur.id);
			const nextId = partnersOf(cur).find((id) => !walked.has(id));
			cur = nextId ? byId.get(nextId) : void 0;
		}
		for (const m of members) if (!walked.has(m.id)) ordered.push(m);
		for (const m of ordered) seen.add(m.id);
		chains.push(ordered);
	}
	return chains;
}
/**
* M10: круговой отсчёт до авто-конца хода. Сервер присылает абсолютную метку
* (turnDeadlineAt) и свои часы (serverNow): считаем остаток по серверному
* времени, чтобы сбитые часы устройства не врали. Слот фиксированного размера
* зарезервирован всегда — табло не «прыгает», когда индикатора нет.
* При `prefers-reduced-motion` остаётся только число (дуга скрыта).
*/
var TurnTimer = (0, import_react.memo)(function TurnTimer({ deadlineAt, offsetMs, who, isHuman }) {
	const t = useT();
	const leftOf = (deadline) => Math.max(0, deadline - (Date.now() + offsetMs));
	const [left, setLeft] = (0, import_react.useState)(() => deadlineAt === null ? 0 : leftOf(deadlineAt));
	(0, import_react.useEffect)(() => {
		if (deadlineAt === null) {
			setLeft(0);
			return;
		}
		setLeft(leftOf(deadlineAt));
		let raf = 0;
		let lastAt = 0;
		const tick = (t) => {
			if (t - lastAt >= 200) {
				lastAt = t;
				setLeft(leftOf(deadlineAt));
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [deadlineAt, offsetMs]);
	if (deadlineAt === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		className: "inline-block size-6 shrink-0"
	});
	const secs = Math.max(0, Math.ceil(left / 1e3));
	const frac = Math.max(0, Math.min(1, left / PACE.idleTurnMs));
	const R = 8.5;
	const C = 2 * Math.PI * R;
	const hint = isHuman ? t("game.timerHuman", { n: secs }) : t("game.timerOther", {
		name: who,
		n: secs
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		role: "timer",
		"aria-label": hint,
		title: hint,
		"data-turn-timer": true,
		className: "relative inline-grid size-6 shrink-0 place-items-center rounded-full bg-bg/70",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": true,
			className: "absolute inset-0 size-full -rotate-90 animate-spin [animation-duration:18s] motion-reduce:animate-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10",
				cy: "10",
				r: R,
				fill: "none",
				strokeWidth: "2",
				style: { stroke: "var(--color-border-strong)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10",
				cy: "10",
				r: R,
				fill: "none",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeDasharray: C,
				strokeDashoffset: C * (1 - frac),
				className: "motion-reduce:hidden",
				style: {
					stroke: "var(--color-accent)",
					transition: "stroke-dashoffset 200ms linear"
				}
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] font-semibold tabular-nums text-fg",
			children: secs
		})]
	});
});
/** Табло игрока со его животными; парные карты кладутся между животными. */
var PlayerSection = (0, import_react.memo)(function PlayerSection({ p, isHuman, canReorder, dnd, actorId, interactions, dying, freshSince, continents, style }) {
	const dispatch = useGameStore((s) => s.dispatch);
	const intent = useGameStore((s) => s.intent);
	const t = useT();
	const lang = useLang();
	const renameAnimal = (0, import_react.useCallback)((animalId, name) => {
		sfx.play("click");
		dispatch({
			type: "renameAnimal",
			animalId,
			name
		});
	}, [dispatch]);
	const randomMutations = useGameStore((s) => Boolean(s.state?.modules.randomMutations));
	const netSeats = useGameStore((s) => s.net?.seats);
	const seatTintColor = (0, import_react.useMemo)(() => netSeats?.find((s) => s.seat === p.id)?.color ?? colorForSeat(p.id), [netSeats, p.id]);
	const gameState = useGameStore((s) => s.state);
	const score = gameState && gameState.phase !== "gameOver" ? liveScore(gameState, p.id) : null;
	const active = actorId === p.id;
	const currentTurn = gameState?.phase !== "gameOver" && gameState?.currentPlayerId === p.id;
	const turnDeadlineAt = useGameStore((s) => s.net?.turnDeadlineAt ?? null);
	const serverOffsetMs = useGameStore((s) => s.net?.serverOffsetMs ?? 0);
	/** Карта, ожидающая выбора континента (интент «выставить животное»). */
	const placingAnimal = isHuman && active && intent.kind === "placeAnimal" ? intent.cardId : void 0;
	/**
	* Разметка пар этого табло. У животного бывает две пары плюс симбионт,
	* поэтому каждая парная карта получает свой цвет (по порядку выкладывания),
	* а подпись говорит, кто напарник: у симбиоза — кто именно симбионт.
	*/
	const pairs = (0, import_react.useMemo)(() => {
		const numberOf = /* @__PURE__ */ new Map();
		p.animals.forEach((a, i) => numberOf.set(a.id, a.no ?? i + 1));
		const links = p.animals.flatMap((a) => a.traits.filter((t) => t.pairWith).map((t) => ({
			owner: a,
			t
		}))).sort((x, y) => x.t.playSeq - y.t.playSeq || x.t.id.localeCompare(y.t.id));
		const colorOf = /* @__PURE__ */ new Map();
		for (const { t } of links) if (!colorOf.has(t.cardId)) colorOf.set(t.cardId, PAIR_COLORS[colorOf.size % PAIR_COLORS.length]);
		const marks = {};
		/** Подпись плашки по id карты пары: «№1 ↔ №2», «симбионт — №1». */
		const plateNote = /* @__PURE__ */ new Map();
		for (const { t: link } of links) {
			const color = colorOf.get(link.cardId);
			const partnerNo = numberOf.get(link.pairWith);
			const partner = partnerNo ? t("game.pairNo", { n: partnerNo }) : t("game.pairPartner");
			if (link.type === "symbiosis") marks[link.id] = {
				color,
				note: link.pairRole === "a" ? t("game.symbiontFor", { no: partner }) : t("game.symbiontIs", { no: partner })
			};
			else marks[link.id] = {
				color,
				note: t("game.pairWith", { no: partner })
			};
		}
		for (const { owner, t: link } of links) {
			if (link.pairRole !== "a") continue;
			const selfNo = numberOf.get(owner.id);
			const partnerNo = numberOf.get(link.pairWith);
			const self = selfNo ? t("game.pairNo", { n: selfNo }) : "?";
			const partner = partnerNo ? t("game.pairNo", { n: partnerNo }) : "?";
			plateNote.set(link.cardId, link.type === "symbiosis" ? t("game.symbiontPlate", {
				a: self,
				b: partner
			}) : t("game.pairPlate", {
				a: self,
				b: partner
			}));
		}
		return {
			colorOf,
			marks,
			plateNote,
			numberOf
		};
	}, [p.animals, lang]);
	const renderCard = (a, no) => {
		const it = interactions(a);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndAnimal, {
			animal: a,
			ownerId: p.id,
			canDrag: Boolean(isHuman && canReorder),
			no,
			pairMarks: pairs.marks,
			selected: it.selected,
			highlight: it.highlight,
			danger: it.danger,
			dimmed: it.dimmed,
			dropTarget: it.dropTarget,
			insertSide: dnd?.insert?.id === a.id ? dnd.insert.side : void 0,
			dying: dying.has(a.id),
			freshSince,
			onRename: isHuman && canReorder ? renameAnimal : void 0
		}, a.id);
	};
	const rows = [];
	if (p.animals.length === 0) rows.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-subtle",
		children: isHuman ? t("game.placeFromHand") : t("game.noAnimals")
	}, "empty"));
	else {
		const linkBetween = (x, y) => x.traits.find((t) => t.pairWith === y.id) ?? y.traits.find((t) => t.pairWith === x.id);
		for (const chain of pairChains(p.animals)) {
			const items = [];
			chain.forEach((a, k) => {
				if (k > 0) {
					const prev = chain[k - 1];
					const link = linkBetween(prev, a);
					if (link) {
						const here = interactions(prev);
						const there = interactions(a);
						items.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairPlate, {
							type: link.type,
							color: pairs.colorOf.get(link.cardId),
							note: pairs.plateNote.get(link.cardId),
							dimmed: here.dimmed && there.dimmed
						}, `pair-${link.cardId}`));
					}
				}
				items.push(renderCard(a, pairs.numberOf.get(a.id) ?? k + 1));
			});
			if (items.length === 1) rows.push(items[0]);
			else rows.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-stretch",
				children: items
			}, `pair-group-${chain[0].id}`));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		style: {
			...style,
			...seatTint(seatTintColor)
		},
		"data-player-section": p.id,
		className: cn("paper-sheet mb-3 rounded-[var(--radius-lg)] border bg-surface p-3 transition-[border-color,box-shadow] duration-[var(--motion-quick)] lg:mb-0 lg:p-2", active ? "border-accent/70 shadow-[0_0_0_1px_var(--color-accent),var(--shadow-card)]" : "border-border", currentTurn && "outline outline-1 outline-accent"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between text-sm lg:mb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2 font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						title: t("game.seatColor"),
						className: "size-2.5 shrink-0 rounded-full border border-ink/25",
						style: { background: seatTintColor }
					}),
					isHuman ? t("game.yourPopulation") : scientistName(p.name, lang),
					currentTurn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "size-1.5 shrink-0 rounded-full bg-accent"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TurnTimer, {
						deadlineAt: active ? turnDeadlineAt : null,
						offsetMs: serverOffsetMs,
						who: scientistName(p.name, lang),
						isHuman: Boolean(isHuman)
					}),
					active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex items-center gap-1 text-xs text-accent",
						children: t("game.acting")
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 text-xs text-muted",
				children: [
					randomMutations ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: MUTATION_ART.deckBack,
						alt: "",
						loading: "lazy",
						title: t("game.blindDeckTitle", { n: p.blindDeckCount ?? p.blindDeck?.length ?? 0 }),
						className: "h-5 w-3.5 rounded-[2px] border border-border object-cover"
					}) : null,
					randomMutations ? t("game.deckCount", { n: p.blindDeckCount ?? p.blindDeck?.length ?? 0 }) : t("game.handCount", { n: p.handCount ?? p.hand.length }),
					" ",
					"· ",
					t("game.discardCount", { n: p.discardCount }),
					score !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" · ",
						t("game.scoreLabel"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: t("game.scoreTitle"),
							className: "font-display tabular-nums text-fg",
							children: score
						})
					] }) : null
				]
			})]
		}), continents ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-1.5 lg:gap-1",
			children: TERRITORIES.map((terr) => {
				const animals = p.animals.filter((a) => (a.zoneId ?? "laurasia") === terr.id);
				const pickable = isHuman && placingAnimal !== void 0 && terr.id !== "ocean" && active;
				const dndZone = isHuman && dnd?.zoneDrop ? { over: terr.id !== "ocean" && dnd.zoneOver === terr.id } : void 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TerritoryRow, {
					zone: terr.id,
					name: territoryName(terr.id, lang),
					count: animals.length,
					tall: pickable || animals.length > 0,
					pickable,
					onPickZone: pickable ? () => dispatch({
						type: "devPlayAnimal",
						cardId: placingAnimal,
						zoneId: terr.id
					}) : void 0,
					dnd: dndZone,
					playerId: p.id,
					children: [animals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-1 text-[11px] text-subtle",
						children: terr.id === "ocean" ? t("game.territoryEmptyOcean") : t("game.territoryEmpty")
					}) : null, animals.map((a) => renderCard(a, pairs.numberOf.get(a.id) ?? 1))]
				}, terr.id);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndRow, {
			playerId: p.id,
			className: "flex flex-wrap items-stretch gap-2",
			children: rows
		})]
	});
});
/**
* Ряд животных без «Континентов» — цель броска карты: пустое место в ряду
* означает «выложить животное». Перестановка своих идёт по карточкам, поэтому
* бросок животного мимо зверя здесь ничего не меняет.
*
* Цель всегда включена, а законность броска решает фильтр столкновений
* (dndTargetAllowed): динамический disabled dnd-kit не успевает перемерить
* область в начале перетаскивания, и бросок уходил «в никуда».
*/
var DndRow = (0, import_react.memo)(function DndRow({ playerId, className, children }) {
	const { setNodeRef } = useDroppable({
		id: rowDndId(playerId),
		data: {
			kind: "row",
			playerId
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setNodeRef,
		className,
		children
	});
});
/** Область-цель броска: общий стол растений (свойства растений). */
var DndArea = (0, import_react.memo)(function DndArea({ id, style, className, children }) {
	const { setNodeRef } = useDroppable({
		id,
		data: { kind: "plants" }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setNodeRef,
		style,
		className,
		children
	});
});
/**
* Животное на столе: и перетаскиваемое (своё, в свой ход), и цель броска
* (карта из руки ложится свойством; своё животное — перестановка/перенос).
* Хуки @dnd-kit живут здесь, AnimalCard остаётся презентационным.
*/
var DndAnimal = (0, import_react.memo)(function DndAnimal({ animal, ownerId, canDrag, ...card }) {
	const { setNodeRef, listeners, isDragging } = useDraggable({
		id: animalDndId(animal.id),
		data: {
			kind: "animal",
			animalId: animal.id,
			ownerId
		},
		disabled: !canDrag
	});
	const { setNodeRef: setDropRef } = useDroppable({
		id: animalDndId(animal.id),
		data: {
			kind: "animal",
			animalId: animal.id,
			ownerId
		}
	});
	const ref = (0, import_react.useCallback)((el) => {
		setNodeRef(el);
		setDropRef(el);
	}, [setNodeRef, setDropRef]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimalCard, {
		animal,
		draggable: canDrag,
		dragging: isDragging,
		dragRef: ref,
		dragListeners: listeners,
		...card
	});
});
/** Полоса одной территории в табло игрока («Континенты»). */
function TerritoryRow({ zone, name, count, children, tall, pickable, onPickZone, playerId, dnd }) {
	const t = useT();
	const { setNodeRef } = useDroppable({
		id: zoneDndId(playerId, zone),
		data: {
			kind: "zone",
			playerId,
			zoneId: zone
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		"data-zone": zone,
		role: pickable ? "button" : void 0,
		"aria-label": pickable ? t("game.placeOn", { name }) : void 0,
		onClick: pickable ? onPickZone : void 0,
		onKeyDown: pickable ? (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onPickZone?.();
			}
		} : void 0,
		tabIndex: pickable ? 0 : void 0,
		className: cn("relative flex flex-wrap items-stretch gap-2 rounded-[var(--radius-md)] border border-dashed px-2 transition-all duration-[var(--motion-quick)]", zone === "ocean" && "water-strip", tall ? "min-h-[52px] py-2" : "min-h-[24px] items-center justify-end py-0.5", zone === "ocean" ? "border-water/40 bg-water/10" : "border-border-strong/25 bg-bg/40", pickable && "cursor-pointer border-solid border-accent ring-2 ring-accent/50 hover:bg-accent/15", dnd?.over && "border-solid border-accent ring-2 ring-accent/60"),
		children: [
			pickable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs font-medium text-accent",
				children: t("game.clickToPlace", { name })
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
function CenterField({ year, lastYear, phase, bank, territoryFood, deckLeft, foodRoll, lastLog, actorName, deaths, plantsInfo, floraInfo, style, wide }) {
	const t = useT();
	const plantsSolo = Boolean(plantsInfo) && !territoryFood;
	const floraSolo = Boolean(floraInfo) && !territoryFood;
	const tableSolo = plantsSolo || floraSolo;
	const showDice = (phase === "foodBank" || phase === "feeding") && !tableSolo;
	const diceKey = foodRoll ? foodRoll.join("-") : "pending";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		style,
		className: cn("felt grain relative order-first flex min-h-[150px] shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-[26px] border border-border p-4 text-fg shadow-[inset_0_0_60px_rgba(0,0,0,.45),var(--shadow-card)] lg:order-none", wide && "lg:w-full lg:max-w-[680px] lg:justify-self-center"),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display tracking-wide",
						children: t("game.yearN", { year })
					}),
					lastYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-clay",
						children: t("game.yearLast")
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(PHASE_LABEL[phase] ?? "phase.development") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: t("game.deckCount", { n: deckLeft })
					})
				]
			}),
			showDice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiceTray, {
				roll: foodRoll,
				bank
			}, diceKey) : null,
			phase === "growth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-leaf/60 bg-leaf/15 px-4 py-1.5 text-sm font-medium text-leaf",
				children: t("game.growthBanner")
			}) : phase === "extinction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-danger/60 bg-danger/15 px-4 py-1.5 text-sm font-medium text-clay",
				children: deaths === 0 ? t("game.extinctionNone") : t("game.extinctionN", { n: deaths })
			}) : tableSolo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col items-center gap-1",
				title: t("game.tableFoodTitle"),
				children: [plantsSolo && plantsInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1",
					title: t("game.plantsFoodTitle"),
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted",
							children: t("game.plantsTokens", {
								n: plantsInfo.count,
								m: plantsInfo.shelters
							})
						})
					]
				}) : null, floraSolo && floraInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1",
					title: t("game.floraFoodTitle"),
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted",
							children: t("game.floraTokens", { n: floraInfo.count })
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
			actorName && (phase === "feeding" || phase === "development") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative text-xs text-accent",
				children: t("game.turnOf", { name: actorName })
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
	const t = useT();
	const lang = useLang();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative grid w-full max-w-[30rem] grid-cols-3 gap-2",
		children: TERRITORIES.map((terr) => {
			const n = banks[terr.id] ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				title: t("game.territoryBankTitle", { name: territoryName(terr.id, lang) }),
				className: cn("flex min-w-0 flex-col items-center gap-1 overflow-hidden rounded-[var(--radius-md)] border px-1.5 py-1.5 sm:px-2", terr.id === "ocean" ? "border-water/50 bg-water/15" : "border-border bg-bg/45"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: TERRITORY_ART[terr.id],
						alt: "",
						"aria-hidden": true,
						className: "size-12 shrink-0 rounded-[var(--radius-sm)] border border-ink/20 object-cover shadow-[var(--shadow-card)] sm:size-14"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-0.5",
						children: [
							Array.from({ length: Math.min(n, 6) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCube, {
								tone: "red",
								className: "token-pop size-2.5 sm:size-3"
							}, `${i}-${n}`)),
							n > 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-ink/10 px-1 text-[10px] tabular-nums text-muted",
								children: ["+", n - 6]
							}) : null,
							n === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-subtle",
								children: active ? t("game.territoryEmpty") : "—"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-base leading-none tabular-nums sm:text-lg",
						children: n
					})
				]
			}, terr.id);
		})
	});
}
function BankPile({ count, active, oceanOnly }) {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex flex-col items-center gap-1.5",
		title: active ? oceanOnly ? t("game.oceanBankHint") : t("game.bankHint") : t("game.bankHintIdle"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex max-w-[260px] flex-wrap items-center justify-center gap-1",
				children: [count === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-subtle",
					children: active ? oceanOnly ? t("game.oceanEmpty") : t("game.bankEmpty") : "—"
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
				children: oceanOnly ? t("game.oceanBankLower") : t("game.foodBankLower")
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
function DiceTray({ roll, bank }) {
	const t = useT();
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"aria-hidden": true,
			className: "flex h-[70px] w-[102px] shrink-0 items-center justify-center gap-[14px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11 shrink-0 rounded-[var(--radius-md)] border border-border bg-muted/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11 shrink-0 rounded-[var(--radius-md)] border border-border bg-muted/20" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs uppercase tracking-[0.18em] text-muted",
			children: t("game.diceRolling")
		})]
	});
	const total = roll.reduce((s, d) => s + d, 0);
	const bonus = bank - total;
	const extra = bonus > 0 ? t("game.diceBonus", { n: bonus }) : bonus < 0 ? t("game.diceTerritory") : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice3D, {
			values: roll,
			rolling,
			dieSize: 44,
			ariaLabel: t("game.diceAria", { dice: roll.join(", ") })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-display text-2xl leading-none tabular-nums", !rolling && "pop-in"),
				children: rolling ? "…" : total
			}), !rolling ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 text-[10px] uppercase tracking-[0.18em] text-good",
				children: t("game.foodBankLower")
			}), extra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] tabular-nums text-muted",
				children: extra
			}) : null] }) : null]
		})]
	});
}
function FoodBankChip({ count, visible }) {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-food-bank": "",
		className: "hidden items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5 sm:flex",
		title: t("game.bankHintIdle"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-wider text-muted",
			children: t("game.bankChip")
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
function useActionBarOffset(phase) {
	const [offset, setOffset] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const dock = document.querySelector("footer");
		if (!dock) return;
		const measure = () => {
			const rect = dock.getBoundingClientRect();
			const next = Math.max(0, Math.round(window.innerHeight - rect.top));
			setOffset((prev) => prev === next ? prev : next);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(dock);
		window.addEventListener("resize", measure);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, [phase]);
	return offset;
}
function ReactionsLayer({ net, phase }) {
	const sendReaction = useGameStore((s) => s.sendReaction);
	const logOpen = useGameStore((s) => s.logOpen);
	const t = useT();
	const [bubbles, setBubbles] = (0, import_react.useState)([]);
	const seenRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const counter = (0, import_react.useRef)(0);
	const barOffset = useActionBarOffset(phase);
	const panelStyle = barOffset ? { bottom: barOffset + 8 } : void 0;
	const bubblesStyle = barOffset ? { bottom: barOffset + 60 } : void 0;
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
		className: cn("pointer-events-none fixed bottom-[132px] right-3 z-50 flex w-44 flex-col items-end gap-1 sm:right-4", logOpen && "reactions-shift"),
		children: bubbles.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("reaction-bubble flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs shadow-[var(--shadow-card)]", b.cheer ? "border-accent/70 bg-accent/20 font-medium text-fg" : "border-border bg-surface/95 text-muted"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-base leading-none",
				children: b.emoji
			}), b.name]
		}, b.key))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"aria-label": t("game.reactions"),
		style: panelStyle,
		className: cn("fixed bottom-[84px] right-3 z-40 flex flex-row gap-0.5 rounded-full border border-border bg-surface/95 p-1 shadow-[var(--shadow-card)] backdrop-blur-sm sm:right-4 sm:gap-1", logOpen && "reactions-shift"),
		children: REACTION_EMOJI.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": t("game.reactionOf", { emoji }),
			title: emoji === "👏" ? t("game.cheerTitle") : t("game.reactionOf", { emoji }),
			className: "grid size-11 place-items-center rounded-full text-lg leading-none transition-transform duration-[var(--motion-fast)] hover:scale-110 hover:bg-surface-2 xl:size-8",
			onClick: (e) => {
				e.currentTarget.blur();
				sendReaction(emoji, emoji === "👏" ? "cheer" : "reaction");
			},
			children: emoji
		}, emoji))
	})] });
}
/**
* Док фазы развития «Случайных мутаций»: карты в слепой колоде — игрок
* сначала объявляет способ розыгрыша, потом движок вскрывает верхнюю карту.
*/
function MutateDock({ human, intent, disabled, continents, canPlant, onNewAnimal, onTrait, onPop, onPlant, onPass, onCancel }) {
	const t = useT();
	const lang = useLang();
	const left = human.blindDeckCount ?? human.blindDeck?.length ?? 0;
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
				}), disabled ? t("dock.turnOpponent") : mutating ? intent.kind === "mutateTrait" ? t("dock.mut.chooseTrait") : intent.kind === "mutatePop" ? t("dock.mut.choosePop") : t("dock.mut.choosePlant") : t("dock.mut.declare")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				title: t("dock.mut.deckTitle", { n: left }),
				"aria-label": t("dock.mut.deckAria", { n: left }),
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display",
						children: [
							t("dock.mut.newSpecies"),
							" · ",
							territoryName("laurasia", lang)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: t("dock.mut.cardAsAnimal")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: () => onNewAnimal("gondwana"),
					className: "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display",
						children: [
							t("dock.mut.newSpecies"),
							" · ",
							territoryName("gondwana", lang)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: t("dock.mut.cardAsAnimal")
					})]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: () => onNewAnimal(),
					className: "flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: t("dock.mut.newSpecies")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: t("dock.mut.cardAsAnimal")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: onTrait,
					className: cn("flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50", intent.kind === "mutateTrait" ? "border-accent bg-accent/15 text-fg" : "border-border bg-surface-2 text-fg hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: t("dock.mut.trait")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: t("dock.mut.traitHint")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: onPop,
					className: cn("flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50", intent.kind === "mutatePop" ? "border-accent bg-accent/15 text-fg" : "border-border bg-surface-2 text-fg hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: t("dock.mut.pop")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: t("dock.mut.popHint")
					})]
				}),
				canPlant ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: disabled || !left,
					onClick: onPlant,
					className: cn("flex h-24 min-w-[150px] flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50", intent.kind === "mutatePlant" ? "border-leaf bg-leaf/15 text-fg" : "border-border bg-surface-2 text-fg hover:bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display",
						children: t("dock.mut.plantTrait")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-normal text-muted",
						children: t("dock.mut.plantTraitHint")
					})]
				}) : null,
				mutating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "default",
					onClick: onCancel,
					title: t("dock.cancelTitle"),
					children: t("common.cancel")
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "md",
					disabled,
					onClick: (e) => {
						e.currentTarget.blur();
						onPass();
					},
					title: t("dock.endDevTitle"),
					children: t("dock.endDev")
				})
			]
		})]
	});
}
/**
* Карта руки с драгом: тянется целиком и мышью, и пальцем. Кнопки и клики
* остаются как были — в HandCard уезжают только ref и слушатели датчиков,
* а те включаются лишь после порога движения/удержания.
*/
var DndHandCard = (0, import_react.memo)(function DndHandCard({ card, ownerId, disabled, noAnimals, blockedFace, onBlockedFace, selected, selectedFace, onSelect }) {
	const { setNodeRef, listeners, isDragging } = useDraggable({
		id: `card:${card.id}`,
		data: {
			kind: "card",
			cardId: card.id,
			ownerId
		},
		disabled: Boolean(disabled)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCard, {
		card,
		disabled,
		noAnimals,
		blockedFace,
		onBlockedFace,
		selected,
		selectedFace,
		onSelect,
		dragRef: setNodeRef,
		dragListeners: listeners,
		dragging: isDragging
	});
});
function DevDock({ state, devActs, human, intent, disabled, continents, freshIds, faceAvailable, onPlayAnimal, onPlaceAnimal, onPickTrait, onPass, onCancel }) {
	const [blockedHint, setBlockedHint] = (0, import_react.useState)(null);
	const seqRef = (0, import_react.useRef)(0);
	const t = useT();
	const lang = useLang();
	const rejectFace = (0, import_react.useCallback)(() => {
		sfx.play("crack");
		seqRef.current += 1;
		setBlockedHint({
			text: human.animals.length === 0 ? t("dock.dev.needAnimalFirst") : t("dock.dev.faceBlocked"),
			seq: seqRef.current
		});
	}, [human.animals.length, t]);
	(0, import_react.useEffect)(() => {
		if (!blockedHint) return;
		const t = window.setTimeout(() => setBlockedHint(null), 2800);
		return () => window.clearTimeout(t);
	}, [blockedHint]);
	(0, import_react.useEffect)(() => {
		setBlockedHint(null);
	}, [intent]);
	const pairStatus = (0, import_react.useMemo)(() => {
		if (intent.kind !== "playPair" || !intent.first) return null;
		return {
			count: legalPairTargets(devActs, intent).size,
			label: animalChoiceLabel(state, intent.first, lang, false)
		};
	}, [
		intent,
		devActs,
		state,
		lang
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		onClick: dockClickSfx,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [blockedHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintNote, {
					compact: true,
					className: "max-w-64",
					children: blockedHint.text
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: disabled ? t("dock.turnOpponentCards") : intent.kind === "placeAnimal" ? t("dock.dev.placeAnimal") : intent.kind === "playPlantTrait" ? intent.kind === "playPlantTrait" && "cardId" in intent ? t("dock.dev.plantTrait") : "" : intent.kind === "playPlantPair" && !("first" in intent && intent.first) ? t("dock.dev.plantPairFirst") : intent.kind === "playPlantPair" ? t("dock.dev.plantPairSecond") : intent.kind === "playTrait" ? t("dock.dev.trait") : intent.kind === "playPair" && !("first" in intent && intent.first) ? t("dock.dev.pairFirst") : intent.kind === "playPair" ? t("dock.dev.pairSecond") : continents ? t("dock.dev.cardOrTraitCont") : t("dock.dev.cardOrTrait")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-1",
					children: [intent.kind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "default",
						onClick: onCancel,
						title: t("dock.cancelTitle"),
						children: t("common.cancel")
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "md",
						disabled,
						onClick: (e) => {
							e.currentTarget.blur();
							onPass();
						},
						title: t("dock.endDevTitle"),
						children: t("dock.endDev")
					})]
				})]
			}),
			pairStatus && pairStatus.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: t("dock.dev.pairProgress", {
					no: pairStatus.label,
					n: pairStatus.count
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-hand-row": true,
				className: "flex gap-2 overflow-x-auto pb-1",
				children: human.hand.map((card, i) => {
					const fresh = freshIds?.has(card.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: fresh ? "hand-card-in" : void 0,
						style: fresh ? { animationDelay: `${Math.min(i, 8) * 70}ms` } : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndHandCard, {
							card,
							ownerId: human.id,
							disabled,
							noAnimals: human.animals.length === 0,
							blockedFace: (face) => !faceAvailable(card.id, face),
							onBlockedFace: () => rejectFace(),
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
			})
		]
	});
}
/**
* Серая кнопка действия, недоступного в этот ход. Причина из feedBlockReason
* вешается на обёртку: у disabled-кнопок отключены указатели мыши, поэтому
* title на самой кнопке не показался бы. aria-label дублирует причину.
* cracked — трещины от выбранного противоположного намерения (атака↔питание).
*/
function BlockedButton({ label, reason, cracked }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		title: reason,
		className: "inline-flex max-w-60 flex-col items-start gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			size: "default",
			disabled: true,
			className: cracked ? "dock-cracked" : void 0,
			"aria-label": `${label}: ${reason}`,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs leading-snug text-muted",
			children: reason
		})]
	});
}
/** Что сейчас выбирает игрок — подсказка рядом с кнопками дока. */
var INTENT_HINT = {
	take: "hint.take",
	takePlant: "hint.takePlant",
	takeFlora: "hint.takeFlora",
	shelter: "hint.shelter",
	hunt: "hint.hunt",
	pirate: "hint.pirate",
	plantAttack: "hint.plantAttack",
	parasitize: "hint.parasitize",
	hibernate: "hint.hibernate",
	fat: "hint.fat",
	graze: "hint.graze"
};
/**
* Второй шаг атак: когда атакующий уже выбран, цели подсвечены красным —
* подсказка говорит об этом прямо, а не обещает метки заранее.
*/
var INTENT_HINT_TARGET = {
	hunt: "hint.target",
	pirate: "hint.target",
	plantAttack: "hint.target"
};
function FeedDock({ human, acts, intentKind, targetPicked, bank, continents, rageTurn, blocked, onIntent, onEndTurn, onSkip }) {
	const dispatch = useGameStore((s) => s.dispatch);
	const state = useGameStore((s) => s.state);
	const t = useT();
	const lang = useLang();
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
	const recombinations = acts.filter((a) => a.type === "feedRecombine");
	const [exchangeChoice, setExchangeChoice] = (0, import_react.useState)("");
	const chosenExchange = recombinations.find((a) => JSON.stringify(a) === exchangeChoice);
	const canSkip = acts.some((a) => a.type === "feedSkip");
	const canSkipHint = !canSkip && (shelters.length > 0 || plantTakes.length > 0 || floraTakes.length > 0);
	const attackOn = intentKind === "hunt" || intentKind === "pirate";
	const foodOn = intentKind === "take" || intentKind === "takePlant" || intentKind === "takeFlora" || intentKind === "shelter" || intentKind === "plantAttack" || intentKind === "parasitize";
	const intentHint = intentKind === "none" ? null : intentKind === "hunt" || intentKind === "pirate" || intentKind === "plantAttack" ? targetPicked ? INTENT_HINT_TARGET[intentKind] ? t(INTENT_HINT_TARGET[intentKind]) : null : INTENT_HINT[intentKind] ? t(INTENT_HINT[intentKind]) : null : INTENT_HINT[intentKind] ? t(INTENT_HINT[intentKind]) : null;
	if (acts.some((a) => a.type === "feedFinishMigration")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [
			acts.filter((a) => a.type === "feedRemora").map((action) => {
				const route = state.pendingMigration?.routes.find((r) => r.animalId === action.migrantId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					className: "h-auto flex-col items-start whitespace-normal text-left",
					onClick: () => dispatch(action),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("dock.feed.follow", {
						follower: animalChoiceLabel(state, action.animalId, lang, false),
						migrant: animalChoiceLabel(state, action.migrantId, lang)
					}) }), route && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-normal text-muted",
						children: [
							territoryName(route.from ?? "laurasia", lang),
							" → ",
							territoryName(route.to, lang)
						]
					})]
				}, `${action.animalId}-${action.migrantId}`);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => dispatch({ type: "feedFinishMigration" }),
				children: t("dock.feed.finishMigration")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "w-full text-xs text-muted",
				children: t("dock.feed.finishMigrationHint")
			})
		]
	});
	if (rageTurn) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		onClick: dockClickSfx,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full border border-danger/60 bg-danger/15 px-3 py-1 text-xs font-medium text-clay",
				children: t("dock.feed.rageBanner")
			}),
			canHunt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "danger",
				size: "default",
				onClick: () => onIntent({ kind: "hunt" }),
				children: t("dock.feed.rageAttack")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				children: t("dock.feed.rageNoTarget")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "md",
				onClick: (e) => {
					e.currentTarget.blur();
					onEndTurn();
				},
				children: t("dock.feed.endTurn")
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
					continents ? t("dock.feed.oceanChip") : t("phase.foodBank"),
					":",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm text-fg",
						children: bank
					})
				]
			}) : null,
			recombinations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex max-w-full flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					"aria-label": t("dock.feed.recombine"),
					className: "max-w-full rounded border border-border bg-surface p-2 text-sm text-fg",
					value: chosenExchange ? exchangeChoice : "",
					onChange: (e) => setExchangeChoice(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("dock.feed.recombine")
					}), recombinations.map((action) => {
						const giver = human.animals.find((a) => a.id === action.giverId);
						const taker = human.animals.find((a) => a.id === action.takerId);
						const sent = giver.traits.find((t) => t.id === action.traitId);
						const received = taker.traits.find((t) => t.id === action.otherTraitId);
						const label = (a) => a.name || `#${a.no ?? human.animals.indexOf(a) + 1}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: JSON.stringify(action),
							children: [
								label(giver),
								": ",
								traitName(sent.type, lang),
								" ↔ ",
								label(taker),
								": ",
								traitName(received.type, lang),
								action.to ? ` → ${territoryName(action.to, lang)}` : ""
							]
						}, JSON.stringify(action));
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: !chosenExchange,
					onClick: () => {
						if (chosenExchange) dispatch(chosenExchange);
						setExchangeChoice("");
					},
					children: traitName("recombination", lang)
				})]
			}) : null,
			foodActs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "take" || intentKind === "takePlant" || intentKind === "takeFlora" || intentKind === "none" ? "parchment" : "secondary",
				size: "default",
				className: attackOn ? "dock-cracked" : void 0,
				onClick: () => {
					if (foodActs.length === 1) dispatch(foodActs[0]);
					else onIntent({ kind: plantTakes.length || floraTakes.length ? floraTakes.length && !plantTakes.length ? "takeFlora" : "takePlant" : "take" });
				},
				children: t("dock.feed.take")
			}) : blocked?.take ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: t("dock.feed.take"),
				reason: blocked.take,
				cracked: attackOn
			}) : null,
			shelters.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "shelter" ? "parchment" : "secondary",
				size: "default",
				className: attackOn ? "dock-cracked" : void 0,
				title: t("dock.feed.shelterTitle"),
				onClick: () => {
					if (shelters.length === 1) dispatch(shelters[0]);
					else onIntent({ kind: "shelter" });
				},
				children: t("dock.feed.shelter")
			}) : null,
			plantAttacks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "plantAttack" ? "danger" : "secondary",
				size: "default",
				className: attackOn ? "dock-cracked" : void 0,
				title: t("dock.feed.plantAttackTitle"),
				onClick: () => {
					if (plantAttacks.length === 1) dispatch(plantAttacks[0]);
					else onIntent({ kind: "plantAttack" });
				},
				children: t("dock.feed.plantAttack")
			}) : null,
			parasitizes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "parasitize" ? "parchment" : "secondary",
				size: "default",
				className: attackOn ? "dock-cracked" : void 0,
				title: t("dock.feed.parasitizeTitle"),
				onClick: () => {
					if (parasitizes.length === 1) dispatch(parasitizes[0]);
					else onIntent({ kind: "parasitize" });
				},
				children: t("dock.feed.parasitize")
			}) : null,
			canHunt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "hunt" ? "danger" : "secondary",
				size: "default",
				className: foodOn ? "dock-cracked" : void 0,
				onClick: () => onIntent({ kind: "hunt" }),
				children: t("dock.feed.hunt")
			}) : blocked?.hunt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: t("dock.feed.hunt"),
				reason: blocked.hunt,
				cracked: foodOn
			}) : null,
			canPirate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "pirate" ? "parchment" : "secondary",
				size: "default",
				className: foodOn ? "dock-cracked" : void 0,
				onClick: () => onIntent({ kind: "pirate" }),
				children: t("dock.feed.pirate")
			}) : blocked?.pirate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: t("dock.feed.pirate"),
				reason: blocked.pirate,
				cracked: foodOn
			}) : null,
			sleeps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "hibernate" ? "parchment" : "secondary",
				size: "default",
				onClick: () => {
					if (sleeps.length === 1) dispatch(sleeps[0]);
					else onIntent({ kind: "hibernate" });
				},
				children: t("dock.feed.hibernation")
			}) : blocked?.sleep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockedButton, {
				label: t("dock.feed.hibernation"),
				reason: blocked.sleep
			}) : null,
			fats.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "fat" ? "parchment" : "secondary",
				size: "default",
				onClick: () => {
					if (fats.length === 1) dispatch(fats[0]);
					else onIntent({ kind: "fat" });
				},
				children: t("dock.feed.fat")
			}) : null,
			grazes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "graze" ? "parchment" : "secondary",
				size: "default",
				onClick: () => {
					if (grazes.length === 1) dispatch(grazes[0]);
					else onIntent({ kind: "graze" });
				},
				children: t("dock.feed.graze")
			}) : null,
			migrations.length ? migrations.length === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "default",
				onClick: () => dispatch(migrations[0]),
				children: t("dock.feed.migrate")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1",
				children: migrations.map((m, i) => {
					const target = m.moves[0].to;
					const label = target === "laurasia" ? `↑ ${territoryName("laurasia", lang)}` : target === "gondwana" ? `↓ ${territoryName("gondwana", lang)}` : `≈ ${territoryName("ocean", lang)}`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => dispatch(m),
						className: "rounded-[var(--radius-xs)] px-2 py-1 text-xs font-medium text-fg hover:bg-ink/10",
						children: label
					}, i);
				})
			}) : null,
			intentHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintNote, {
				compact: true,
				className: "max-w-64",
				children: intentHint
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "md",
				onClick: (e) => {
					e.currentTarget.blur();
					onEndTurn();
				},
				children: t("dock.feed.endTurn")
			}),
			intentKind !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "default",
				onClick: () => onIntent({ kind: "none" }),
				title: t("dock.cancelTitle"),
				children: t("common.cancel")
			}) : null,
			canSkip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "md",
				onClick: (e) => {
					e.currentTarget.blur();
					sfx.play("modal");
					setConfirmSkip(true);
				},
				title: hungry > 0 ? t("dock.feed.skipHungryTitle", { n: hungry }) : t("dock.feed.skipFedTitle"),
				"aria-label": t("dock.feed.skip"),
				children: t("dock.feed.skip")
			}) : canSkipHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				title: t("dock.feed.skipHintTitle"),
				children: t("dock.feed.skipHint")
			}) : null,
			confirmSkip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: t("dock.feed.skipConfirmTitle"),
				body: hungry > 0 ? t(hungry === 1 ? "dock.feed.skipConfirmOne" : "dock.feed.skipConfirmMany", { n: hungry }) : t("dock.feed.skipConfirmFed"),
				confirmLabel: t("dock.feed.skip"),
				cancelLabel: t("dock.feed.backToTurn"),
				tone: hungry > 0 ? "danger" : "default",
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
function DefenseDock({ acts, onPick, onPreview }) {
	const state = useGameStore((s) => s.state);
	const t = useT();
	const lang = useLang();
	const titleId = (0, import_react.useId)();
	const atk = state.pendingAttack;
	const prey = findAnimal(state, atk.preyId);
	const plant = state.plants?.find((p) => p.id === atk.plantId);
	const attackerLabel = plant ? `${plantName(plant.kind, lang)} · ${t("game.pairNo", { n: (state.plants?.indexOf(plant) ?? 0) + 1 })}` : animalChoiceLabel(state, atk.carnivoreId, lang);
	(0, import_react.useEffect)(() => () => onPreview(null), [onPreview, atk.preyId]);
	const running = acts.find((a) => a.type === "chooseDefense" && a.kind === "running");
	const none = acts.find((a) => a.type === "chooseDefense" && a.kind === "none");
	const mimics = acts.filter((a) => a.type === "chooseDefense" && a.kind === "mimicry");
	const tails = acts.filter((a) => a.type === "chooseDefense" && a.kind === "tailLoss");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogShell, {
		titleId,
		overlayClassName: "fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-3 sm:items-center",
		panelClassName: "w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-5",
		onEscape: (event) => {
			event.preventDefault();
			event.stopPropagation();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: titleId,
				tabIndex: -1,
				className: "text-xl",
				children: t("defense.title", {
					attacker: attackerLabel,
					prey: animalChoiceLabel(state, atk.preyId, lang)
				})
			}),
			atk.choosingPlantDefense && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: t("defense.plantIgnore")
			}),
			!atk.choosingPlantDefense && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: t("defense.need", {
					need: prey ? foodNeeded(prey) : "—",
					food: prey?.food ?? 0
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: [
					acts.map((action) => {
						if (action.type !== "chooseDefense" || action.kind !== "ignore") return null;
						const trait = prey?.traits.find((x) => x.id === action.ignoredTraitId);
						return trait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => onPick(action),
							children: t("defense.ignore", { trait: traitName(trait.type) })
						}, trait.id) : null;
					}),
					running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => onPick(running),
						children: t("defense.running")
					}) : null,
					mimics.map((action) => {
						if (action.type !== "chooseDefense" || !action.mimicryTargetId) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							className: "h-auto flex-col items-start whitespace-normal text-left",
							onMouseEnter: () => onPreview(action.mimicryTargetId),
							onMouseLeave: () => onPreview(null),
							onFocus: () => onPreview(action.mimicryTargetId),
							onBlur: () => onPreview(null),
							onClick: () => onPick(action),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("defense.mimicry", { target: animalChoiceLabel(state, action.mimicryTargetId, lang) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-normal text-muted",
								children: t("defense.mimicryHint")
							})]
						}, action.mimicryTargetId);
					}),
					tails.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => onPick(a),
						children: t("defense.tailDiscard", { trait: traitName(prey?.traits.find((trait) => trait.id === a.discardTraitId)?.type ?? "tailLoss", lang) })
					}, a.discardTraitId)),
					none ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => onPick(none),
						children: t("defense.none")
					}) : null
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
