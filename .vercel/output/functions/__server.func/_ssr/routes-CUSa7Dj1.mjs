import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { l as require_react_dom, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { S as pollInput, _ as joinRoomInput, a as botsInput, b as legalFeedActions, c as chooseAIAction, d as createRoomInput, f as currentActor, g as isFed, h as hasTrait, i as applyAction, l as codeTokenInput, m as foodNeeded, n as TRAITS, o as canAttack, p as findAnimal, r as actionInput, s as canReceiveFood, u as createGame, v as legalDefenseActions, x as player, y as legalDevActions } from "./ai-AwW7_vaR.mjs";
import { a as Play, c as LogOut, d as Check, f as Bot, i as Plus, l as List, o as Pause, p as BookOpen, r as RotateCcw, s as Minus, t as Users, u as Copy } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CUSa7Dj1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
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
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			icon: "size-11 rounded-[var(--radius-md)]"
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
/**
* Реестр арт-ассетов (public/img, собираются scripts/build-art.mjs из assets/).
* Стиль: винтажный натуралистический атлас — тушь и акварель на пергаменте.
*/
/**
* Арт карт свойств. У mimicry арт — гравюра на чёрном (см. DARK_ART).
* Свойства «Континентов» пока без генерированных картинок — UI рисует
* векторный глиф, когда значения нет (см. hasTraitArt).
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
	mimicry: "/img/trait/mimicry.jpg"
};
/** Арты с чёрным фоном: в пергаментных карточках кладутся на тёмную плашку. */
var DARK_ART = /* @__PURE__ */ new Set(["mimicry"]);
/** Медальон вида по рациону и телосложению. */
function speciesArt(opts) {
	if (opts.swimming) return "/img/species/aquatic.jpg";
	if (opts.carnivore) return opts.bulky ? "/img/species/carn-large.jpg" : "/img/species/carn-medium.jpg";
	return opts.bulky ? "/img/species/herb-large.jpg" : "/img/species/herb-medium.jpg";
}
/**
* Жетоны еды. red — фишка из кормовой базы, blue — мясо и всё, что приходит
* от свойств (охота, сотрудничество, пиратство, падальщик, хвост, жир).
*/
var TOKEN = {
	meat: "/img/token/meat.jpg",
	red: "/img/token/meat.jpg",
	blue: "/img/token/blue.jpg",
	plant: "/img/token/plant.jpg",
	fat: "/img/token/fat.jpg"
};
/** Фоны и крупные декорации. */
var BG = {
	menu: "/img/bg/menu.jpg",
	valley: "/img/bg/valley.jpg",
	extinction: "/img/bg/extinction.jpg",
	victory: "/img/bg/victory.jpg",
	bankBowl: "/img/bg/bank-bowl.jpg",
	cardBack: "/img/meta/card-back.jpg"
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
	laurasia: "/img/world/continent-eurasia.jpg",
	gondwana: "/img/world/continent-africa.jpg",
	ocean: "/img/bg/ocean.jpg"
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
*/
var netCreateRoom = createServerFn({ method: "POST" }).validator(createRoomInput).handler(createSsrRpc("5d10ae946134fb6b27bc7c68ea783639ad617431c539331dc58524d97407b4bb"));
var netJoinRoom = createServerFn({ method: "POST" }).validator(joinRoomInput).handler(createSsrRpc("20bb5f392b3e05a16098d48523e3b73255d44092301929c9ed9a4bed4959d3d0"));
var netRejoin = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("9be6f8dbb902e4d7a86ed61a5ec451298b7693cb95cd353b30302c3968525e24"));
var netSetBots = createServerFn({ method: "POST" }).validator(botsInput).handler(createSsrRpc("0ae6763f4a9392d1dc978022ba9a80b0b3aa8d50b84dfd2903b7639f24bfb552"));
var netStart = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("fafa464b4c4488361c51f863768135107e02c148e255f23da160ffa440fc3f99"));
var netAction = createServerFn({ method: "POST" }).validator(actionInput).handler(createSsrRpc("18b6efd10626f6282f46662236a9f4efa95081d933b3c79a203a2bf43f221fa0"));
var netPoll = createServerFn({ method: "POST" }).validator(pollInput).handler(createSsrRpc("97c6cf3f2776e31a2770acfbc62d86143077f49705e3043649873d49707919d1"));
var netAgain = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(createSsrRpc("c863eef5e87854022b362f26f321d98a7752563244b6bf8043f48c6e5e79acfc"));
/**
* Клиентский драйвер сетевой партии: держит код стола и токен места,
* тянет состояние циклом опроса с бэкоффом, переживает обрывы (токен
* сохранён в localStorage — F5 и закрытие вкладки безболезненны).
* Никакого React: стор подписывается через хуки NetHooks.
*/
var NAME_KEY = "evo-net-name";
var tokKey = (code) => `evo-seat-${code}`;
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
var NetSession = class {
	hooks;
	code = "";
	token = "";
	lastVersion;
	timer = null;
	failCount = 0;
	stopped = false;
	lastOwnMoveAt = 0;
	/** Последний полный кадр показывал идущую партию (для выхода из reconecting). */
	seenPlaying = false;
	wasReconnecting = false;
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
		const r = await netJoinRoom({ data: {
			code: code.toUpperCase(),
			name
		} });
		if (!r.ok) throw new Error(r.error);
		this.attach(code.toUpperCase(), r.token);
		this.hooks.onStatus("connecting");
		this.schedule(0);
	}
	/** Вернуться на стол по сохранённому токену (F5, обрыв, закрытая вкладка). */
	async resume(code) {
		const codeUp = code.toUpperCase();
		const token = loadToken(codeUp);
		if (!token) throw new Error("На этом устройстве нет места за этим столом");
		const r = await netRejoin({ data: {
			code: codeUp,
			token
		} });
		if (!r.ok) {
			try {
				localStorage.removeItem(tokKey(codeUp));
			} catch {}
			throw new Error(r.error);
		}
		this.attach(codeUp, token);
		this.accept(r.snapshot);
		this.schedule(0);
	}
	/** Ход: сервер проверяет и применяет, свежий кадр приходит в ответе. */
	async act(action) {
		const r = await netAction({ data: {
			code: this.code,
			token: this.token,
			action
		} });
		if (!r.ok) return r.error;
		this.lastOwnMoveAt = Date.now();
		this.accept(r.snapshot);
		this.schedule(0);
		return null;
	}
	async setBots(count) {
		const r = await netSetBots({ data: {
			code: this.code,
			token: this.token,
			count
		} });
		if (!r.ok) throw new Error(r.error);
	}
	async start() {
		const r = await netStart({ data: {
			code: this.code,
			token: this.token
		} });
		if (!r.ok) throw new Error(r.error);
		this.accept(r.snapshot);
	}
	async again() {
		const r = await netAgain({ data: {
			code: this.code,
			token: this.token
		} });
		if (!r.ok) throw new Error(r.error);
	}
	stop() {
		this.stopped = true;
		if (this.timer) clearTimeout(this.timer);
	}
	/** Немедленный внеочередной опрос (после действий с лобби). */
	refresh() {
		this.schedule(0);
	}
	attach(code, token) {
		this.code = code;
		this.token = token;
		saveToken(code, token);
		this.stopped = false;
		this.failCount = 0;
	}
	accept(snap) {
		this.lastVersion = snap.version;
		this.failCount = 0;
		this.seenPlaying = snap.room.status === "playing";
		const status = this.seenPlaying ? "playing" : "lobby";
		this.wasReconnecting = false;
		this.hooks.onSnapshot(snap);
		this.hooks.onStatus(status);
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
		try {
			const r = await netPoll({ data: {
				code: this.code,
				token: this.token,
				sinceVersion: this.lastVersion
			} });
			if (!r.ok) throw new Error(r.error);
			if ("unchanged" in r) {
				this.failCount = 0;
				this.hooks.onSeats(r.seats, r.hostSeat);
			} else this.accept(r);
			if (this.wasReconnecting) {
				this.wasReconnecting = false;
				this.hooks.onStatus(this.seenPlaying ? "playing" : "lobby");
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
/**
* Мост NetSession → стор: кадры сервера ложатся в state/net, статус
* соединения — в баннер переподключения.
*/
function netHooks(set, get) {
	return {
		onSnapshot: (snap) => {
			const cur = get().net;
			if (!cur) return;
			set({
				state: snap.state,
				net: {
					...cur,
					code: snap.room.code,
					seat: snap.seat,
					capacity: snap.room.capacity,
					seats: snap.seats,
					hostSeat: snap.room.hostSeat
				}
			});
		},
		onSeats: (seats, hostSeat) => {
			const cur = get().net;
			if (!cur) return;
			set({ net: {
				...cur,
				seats,
				hostSeat
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
		}
	};
}
function loadSpeed() {
	try {
		const v = localStorage.getItem("evo-speed");
		if (v === "slow" || v === "normal" || v === "fast") return v;
	} catch {}
	return "normal";
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
	start: (players, difficulty) => {
		clearAi();
		const seed = Date.now() % 1e6;
		const state = createGame(players, difficulty, seed, void 0, get().modules);
		lastBotActor = null;
		set({
			state,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" }
		});
		queueMicrotask(() => get().tickAI());
	},
	setModules: (modules) => set({ modules }),
	reset: () => {
		clearAi();
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
			intent: { kind: "none" }
		});
	},
	dispatch: (action) => {
		if (get().mode === "net") {
			const s = netSession;
			if (!s) return;
			set({ intent: { kind: "none" } });
			s.act(action).then((err) => {
				const cur = get().net;
				if (err && cur) set({ net: {
					...cur,
					error: err
				} });
			});
			return;
		}
		const { state } = get();
		if (!state) return;
		if (state.phase === "gameOver") return;
		const next = applyAction(state, action);
		lastBotActor = null;
		set({
			state: next,
			intent: { kind: "none" },
			thinking: false
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
		const s = new NetSession(netHooks(set, get));
		netSession = s;
		set({
			mode: "net",
			state: null,
			intent: { kind: "none" },
			thinking: false,
			thinkingWho: null,
			net: {
				code: "",
				seat: 0,
				status: "connecting",
				error: null,
				seats: [],
				hostSeat: 0,
				capacity: cfg.capacity
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
		const s = new NetSession(netHooks(set, get));
		netSession = s;
		set({
			mode: "net",
			state: null,
			intent: { kind: "none" },
			thinking: false,
			thinkingWho: null,
			net: {
				code: code.toUpperCase(),
				seat: -1,
				status: "connecting",
				error: null,
				seats: [],
				hostSeat: 0,
				capacity: 0
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
		clearAi();
		const s = new NetSession(netHooks(set, get));
		try {
			await s.resume(code);
		} catch {
			s.stop();
			return false;
		}
		netSession = s;
		set({
			mode: "net",
			state: null,
			intent: { kind: "none" },
			net: {
				code: code.toUpperCase(),
				seat: -1,
				status: "connecting",
				error: null,
				seats: [],
				hostSeat: 0,
				capacity: 0
			}
		});
		return true;
	},
	netAddBots: async (delta) => {
		const n = get().net;
		if (!n || !netSession || n.status !== "lobby") return;
		const bots = n.seats.filter((x) => x.isAI).length;
		const humans = n.seats.length - bots;
		const count = Math.max(0, Math.min(bots + delta, n.capacity - humans));
		await netSession.setBots(count).catch(() => {});
		netSession.refresh();
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
	},
	netAgain: async () => {
		if (!netSession) return;
		await netSession.again().catch(() => {});
		netSession.refresh();
	},
	leaveNet: () => {
		netSession?.stop();
		netSession = null;
		clearAi();
		set({
			mode: "solo",
			net: null,
			state: null,
			thinking: false,
			thinkingWho: null,
			intent: { kind: "none" }
		});
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
		const actor = currentActor(state);
		if (!actor) return;
		if (!actor.isAI) {
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
			if (!who?.isAI) {
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
			set({ state: next });
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
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "6",
			...stroke
		});
	}
}
var PIP_COORDS = {
	1: [[12, 12]],
	2: [[8, 8], [16, 16]],
	3: [
		[8, 8],
		[12, 12],
		[16, 16]
	],
	4: [
		[8, 8],
		[16, 8],
		[8, 16],
		[16, 16]
	],
	5: [
		[8, 8],
		[16, 8],
		[12, 12],
		[8, 16],
		[16, 16]
	],
	6: [
		[8, 7],
		[16, 7],
		[8, 12],
		[16, 12],
		[8, 17],
		[16, 17]
	]
};
/** Игральная кость с настоящими очками; rolling подменяет очки дрожью. */
function Die({ value, rolling, className }) {
	const shown = rolling ? (value ?? 1) % 6 + 1 : value ?? 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: cn("size-10", rolling && "die-tumble", className),
		"aria-label": `Кубик: ${value ?? "?"}`,
		role: "img",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "2",
			y: "2",
			width: "20",
			height: "20",
			rx: "4.5",
			className: "die-body"
		}), (PIP_COORDS[shown] ?? PIP_COORDS[1]).map(([cx, cy], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx,
			cy,
			r: "1.9",
			className: "die-pip"
		}, i))]
	});
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
		children: [TRAIT_ART[def.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: TRAIT_ART[def.id],
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
				className: "flex items-center gap-1.5 text-[11px] font-semibold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: def.name
					}),
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
/**
* Фишки еды на животном. Цвет важен по правилам: красная приходит из кормовой
* базы, синяя — от свойств (охота, сотрудничество, пиратство, падальщик,
* хвост, жир), поэтому blueFood рисуется отдельными синими жетонами.
*/
var FoodDots = (0, import_react.memo)(function FoodDots({ animal }) {
	const need = foodNeeded(animal);
	const blue = Math.min(animal.blueFood, animal.food);
	const red = animal.food - blue;
	const empty = Math.max(0, need - animal.food);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		title: `Еда ${animal.food} / ${need}${blue > 0 ? ` · синих ${blue}` : ""}${animal.fatTokens > 0 ? ` · жир ${animal.fatTokens}` : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [
				Array.from({ length: red }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: TOKEN.red,
					alt: "",
					className: "token-pop size-3.5 rounded-full"
				}, `r${i}`)),
				Array.from({ length: blue }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: TOKEN.blue,
					alt: "",
					className: "token-pop size-3.5 rounded-full"
				}, `b${i}`)),
				Array.from({ length: empty }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-3.5 rounded-full border border-ink/40 bg-parchment-2" }, `e${i}`)),
				Array.from({ length: animal.fatTokens }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: TOKEN.fat,
					alt: "",
					className: "size-3.5 rounded-full"
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
		className: cn("anim-chip-in relative inline-flex h-6 items-center gap-1 rounded-[var(--radius-xs)] px-1.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/60", disabled ? "bg-ink/5 text-ink-soft line-through decoration-ink-soft/60" : type === "carnivore" || type === "parasite" ? "bg-clay/15 text-clay" : type === "fatTissue" ? "bg-food-yellow/20 text-ink" : "bg-ink/8 text-ink", fresh && !disabled && "chip-fresh"),
		children: [
			mark && !disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-2 shrink-0 rounded-full",
				style: { background: mark.color }
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitGlyph, {
				id: type,
				className: "size-3.5"
			}),
			def.short,
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
var AnimalCard = (0, import_react.memo)(function AnimalCard({ animal, name, no, pairMarks, selected, dimmed, highlight, dying, freshSince, draggable, dropTarget, onDragStartCard, onDragOverCard, onDropCard, onDragEndCard }) {
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
		className: cn("animal-card anim-card-in relative shrink-0 cursor-pointer rounded-[var(--radius-lg)] border bg-parchment p-3 text-left text-ink shadow-[var(--shadow-card)] transition-[transform,border-color,opacity,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-out)]", selected ? "border-clay ring-2 ring-clay/40" : "border-ink/10", highlight ? "ring-2 ring-accent" : "", dimmed ? "opacity-45" : "", dying ? "dying-pulse border-danger/60" : "", dropTarget ? "border-accent ring-2 ring-accent/60" : "", "hover:-translate-y-0.5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline gap-1 font-display text-sm tracking-tight",
					children: [no ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] tabular-nums text-ink-soft",
						children: ["№", no]
					}) : null, hasTrait(animal, "carnivore") ? "Хищник" : hasTrait(animal, "swimming") ? "Водное" : "Животное"]
				}), animal.hibernating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-ink/10 px-1.5 text-[10px] font-medium uppercase tracking-wide",
					children: "сон"
				}) : fed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-good/20 px-1.5 text-[10px] font-medium uppercase tracking-wide text-good",
					children: "сыто"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-clay/15 px-1.5 text-[10px] font-medium uppercase tracking-wide text-clay",
					children: "голод"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: speciesArt({
						swimming: hasTrait(animal, "swimming"),
						carnivore: hasTrait(animal, "carnivore"),
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
var DIFFS = [
	["easy", "Проще"],
	["normal", "Обычная"],
	["hard", "Жёстче"]
];
/**
* Секция «Игра по сети» в главном меню: создать стол / войти по коду.
* Ссылка вида ?room=КОД предзаполняет вход, а при сохранённом месте
* сразу возвращает за стол.
*/
function NetMenuPanel() {
	const startNetCreate = useGameStore((s) => s.startNetCreate);
	const startNetJoin = useGameStore((s) => s.startNetJoin);
	const resumeNetFromUrl = useGameStore((s) => s.resumeNetFromUrl);
	const [tab, setTab] = (0, import_react.useState)("none");
	const [name, setName] = (0, import_react.useState)(loadName());
	const [code, setCode] = (0, import_react.useState)("");
	const [capacity, setCapacity] = (0, import_react.useState)(2);
	const [bots, setBots] = (0, import_react.useState)(0);
	const [difficulty, setDifficulty] = (0, import_react.useState)("normal");
	const [continents, setContinents] = (0, import_react.useState)(false);
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
				className: cn("h-11 rounded-[var(--radius-md)] border text-sm font-medium", tab === "create" ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
				children: "Создать стол"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("join"),
				className: cn("h-11 rounded-[var(--radius-md)] border text-sm font-medium", tab === "join" ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
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
		tab === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs text-muted",
					children: "Мест за столом"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						2,
						3,
						4
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setCapacity(n);
							setBots((b) => Math.min(b, n - 1));
						},
						className: cn("h-10 rounded-[var(--radius-md)] border text-sm font-medium", capacity === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
						children: n
					}, n))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs text-muted",
					children: "Боты (заполнят свободные места)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "Меньше ботов",
							disabled: bots === 0,
							onClick: () => setBots((b) => Math.max(0, b - 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-8 text-center font-display text-lg tabular-nums",
							children: bots
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "Больше ботов",
							disabled: bots >= capacity - 1,
							onClick: () => setBots((b) => Math.min(capacity - 1, b + 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						})
					]
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
						onClick: () => setDifficulty(id),
						className: cn("h-10 rounded-[var(--radius-md)] border text-sm font-medium", difficulty === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
						children: label
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-xs text-muted",
					children: "Дополнение"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setContinents((v) => !v),
					"aria-pressed": continents,
					className: cn("flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm", continents ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Континенты — Лавразия, Гондвана и Океан" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", continents ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
						children: continents ? "вкл" : "выкл"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				size: "lg",
				disabled: busy || !name.trim(),
				onClick: () => run(() => startNetCreate({
					name: name.trim(),
					capacity,
					botSeats: bots,
					difficulty,
					modules: continents ? { continents: true } : {}
				})),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Создать стол"]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
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
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "w-full",
			size: "lg",
			disabled: busy || !name.trim() || code.length !== 4,
			onClick: () => run(() => startNetJoin(code, name.trim())),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Войти"]
		})] }),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-clay",
			children: error
		}) : null
	] });
}
/** Лобби сетевого стола: состав, ссылка-приглашение, боты, старт от хоста. */
function LobbyScreen() {
	const net = useGameStore((s) => s.net);
	const netAddBots = useGameStore((s) => s.netAddBots);
	const netStart = useGameStore((s) => s.netStart);
	const leaveNet = useGameStore((s) => s.leaveNet);
	const [copied, setCopied] = (0, import_react.useState)(false);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-5 py-16",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: Array.from({ length: Math.max(net.capacity, net.seats.length) }).map((_, seatNo) => {
							const seat = net.seats.find((x) => x.seat === seatNo);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5", seat ? "border-border bg-bg" : "border-dashed border-border bg-bg/40", seat?.seat === net.seat ? "ring-1 ring-accent/50" : ""),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-sm font-medium text-fg",
									children: [
										seat ? seat.isAI ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4 text-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("size-2 rounded-full", seat.online ? "bg-good" : "bg-ink/25"),
											title: seat.online ? "в сети" : "не в сети"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-ink/15" }),
										seat ? seat.name : "Свободное место",
										seat?.seat === net.hostSeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent",
											children: "хост"
										}) : null,
										seat?.seat === net.seat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-wide text-muted",
											children: "это вы"
										}) : null
									]
								}), !seat && isHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wide text-subtle",
									children: "ждём"
								}) : null]
							}, seatNo);
						})
					}),
					net.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-clay",
						children: net.error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							className: "flex-1",
							onClick: copyLink,
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Скопировано" : "Скопировать ссылку"]
						}), isHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								className: "flex-1",
								"aria-label": "Убрать бота",
								disabled: bots === 0,
								onClick: () => void netAddBots(-1),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" }), "Бот"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								className: "flex-1",
								"aria-label": "Добавить бота",
								disabled: humans + bots >= net.capacity,
								onClick: () => void netAddBots(1),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Бот"]
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2 sm:flex-row-reverse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1",
							size: "lg",
							disabled: !isHost || !full || humans < 1,
							title: !isHost ? "Начинает хост" : !full ? "Заполните все места — людьми или ботами" : void 0,
							onClick: () => void netStart(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Начать год"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "lg",
							onClick: leaveNet,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Покинуть стол"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-xs text-subtle",
				children: "Отправьте ссылку друзьям — они войдут по ней одним касанием."
			})
		]
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
/** Дополнения: «Континенты» готовы, остальные — по официальным правилам позже. */
var MODULES = [
	["Растения", "дополнительные источники еды на столе"],
	["Грибы", "питание, распад и новые цепочки еды"],
	["Случайные мутации", "скрытые мутации и неоплазия с растущим вирусом"]
];
function MenuScreen({ onStart, onRules }) {
	const [players, setPlayers] = (0, import_react.useState)(2);
	const [difficulty, setDifficulty] = (0, import_react.useState)("normal");
	const speed = useGameStore((s) => s.speed);
	const setSpeed = useGameStore((s) => s.setSpeed);
	const continents = useGameStore((s) => Boolean(s.modules.continents));
	const setModules = useGameStore((s) => s.setModules);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 -z-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: BG.menu,
			alt: "",
			className: "h-full w-full object-cover opacity-45"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/55 to-bg" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-5 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: LOGO,
					alt: "",
					className: "size-24 rounded-full border border-border-strong object-cover shadow-[var(--shadow-card)]"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mb-3 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-muted",
				children: "Правильные игры · Кнорре"
			}),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetMenuPanel, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
							className: "mb-3 flex items-center gap-2 text-sm font-medium text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Игроков за столом"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								2,
								3,
								4
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPlayers(n),
								className: cn("h-12 rounded-[var(--radius-md)] border text-sm font-medium", players === n ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
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
							className: cn("h-12 rounded-[var(--radius-md)] border text-sm font-medium", difficulty === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
							children: label
						}, id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "mb-3 text-sm font-medium text-muted",
						children: "Темп игры"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-3",
						children: SPEEDS.map(([id, label, hint]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: hint,
							onClick: () => setSpeed(id),
							className: cn("h-11 rounded-[var(--radius-md)] border text-sm font-medium", speed === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
							children: label
						}, id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "mb-3 text-sm font-medium text-muted",
						children: "Дополнения"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setModules({ continents: !continents }),
							"aria-pressed": continents,
							title: "Континенты: Лавразия и Гондвана с отдельными кормовыми базами, Океан для водоплавающих, миграция, прилипала, стадность, стрекательные клетки, эдификатор, регенерация, рекомбинация, неоплазия",
							className: cn("flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", continents ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
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
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1",
							size: "lg",
							onClick: () => onStart(players, difficulty),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Начать год"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "lg",
							onClick: onRules,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Правила"]
						})]
					})
				]
			})
		]
	})] });
}
function RulesPanel({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-5 sm:rounded-[var(--radius-xl)] sm:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: "Правила"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onClose,
					children: "Закрыть"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Развитие."
							}), " По кругу выкладывайте по одной карте: новое животное или свойство. Свойства кладутся лицом вверх — все видят, кто что выложил. Двойные карты — одно из двух свойств. Паразит только на чужих. Парная карта (симбиоз, сотрудничество, взаимодействие) кладётся между двумя животными — на пару может лежать только одна парная карта. Пас — и больше не играете в этой фазе; когда спасовали все, фаза заканчивается."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Кормовая база."
							}), " 2 игрока: 1d6+2. 3: 2d6. 4: 2d6+2."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Питание."
							}), " Ход длится, пока не нажмёте «Закончить ход»: одно действие ход не отдаёт. За ход можно напасть каждым из своих хищников и/или использовать всех пиратов — либо взять одну фишку еды (накормленное животное берёт только в пустой жировой запас); если берёте еду, хищники и пираты в этот ход недоступны. Накормленное животное больше не использует свойства: не нападает, не пиратствует, не топчет, не уходит в спячку и не тратит жир. Топтуны топчут вместе с взятием еды, каждый — раз за ход. Превращение жира — свободное действие. Когда делать нечего совсем, ход передаётся сам. «Пас» выводит вас до конца фазы; фаза заканчивается, когда база пуста, все накормлены, все пасанули или никому нельзя ходить."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Вымирание."
							}), " Ненакормленные погибают. Добор: число выживших + 1. Если никого нет и рука пуста — 6 карт. Пустая колода — последний год."] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-fg",
						children: "Дополнение «Континенты»"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "list-decimal space-y-2 pl-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Территории."
							}), " Животные живут на Лавразии, в Гондване и в Океане. Выкладывая животное, выбираете континент; в Океан животное попадает только со свойством «Водоплавающее». Потеряло водоплавающее — возвращается на континент."] }),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Новые свойства."
							}), " Стадность: пока хищников в локации не больше, чем стадных, стадных нельзя есть. Стрекательные клетки: атаковавший хищник теряет все свойства до конца года (потребность 1), в океане ещё и водоплавающее — выброшен на континент. Регенерация: съеденное хищником животное оставляет свойства — владелец восстанавливает их новым животным из руки. Рекомбинация (парная): партнёры обмениваются по одному свойству. Неоплазия: каждый год выключает соседнее непарное свойство, а когда выключать нечего — убивает носителя."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Спасение."
							}), " Игрок без руки и животных берёт 10 карт и две сразу кладёт животными по континенту."] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-fg",
						children: "Очки"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "2 за каждое выжившее животное, 1 за каждое свойство. Дополнительно: хищник и большой +1, паразит +2. Ничья — по картам в сбросе." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-fg",
						children: "Свойства"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2 sm:grid-cols-2",
						children: Object.values(TRAITS).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
						}, t.id))
					})
				]
			})]
		})
	});
}
function GameOverScreen({ scores, winnerIds, humanId, onAgain, onMenu }) {
	const won = winnerIds.includes(humanId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: won ? BG.victory : BG.extinction,
			alt: "",
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.24em] text-muted",
					children: "Конец эволюции"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl",
					children: won ? "Ваша популяция доминирует" : "Вас вытеснили"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-2",
					children: scores.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-3", winnerIds.includes(s.playerId) ? "border-accent bg-accent/10" : "border-border bg-bg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium",
							children: [
								i + 1,
								". ",
								s.name
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: [
								"животные ",
								s.animals,
								" · свойства ",
								s.traits,
								" · бонус ",
								s.extras,
								" · сброс ",
								s.discard
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl tabular-nums",
							children: s.total
						})]
					}, s.playerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "flex-1",
						onClick: onAgain,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Ещё партия"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "flex-1",
						onClick: onMenu,
						children: "В меню"
					})]
				})
			]
		})]
	});
}
var PHASE_LABEL = {
	development: "Развитие",
	foodBank: "Кормовая база",
	feeding: "Питание",
	extinction: "Вымирание",
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
	selected: false
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
		const sectionEl = (id) => document.querySelector(`[data-player-section="${id}"]`);
		const created = [];
		const push = (point, text, tone) => {
			idRef.current += 1;
			created.push({
				id: idRef.current,
				...point,
				text,
				tone
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
			case "cardsDrawn": for (let i = 0; i < e.counts.length; i++) {
				const n = e.counts[i];
				if (n > 0) push(anchorOf(sectionEl(i)), `+${n} ${n === 1 ? "карта" : n < 5 ? "карты" : "карт"}`, "info");
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
function GameApp() {
	const state = useGameStore((s) => s.state);
	(0, import_react.useEffect)(() => {
		const saved = loadSpeed();
		if (saved !== "normal") useGameStore.getState().setSpeed(saved);
	}, []);
	const rulesOpen = useGameStore((s) => s.rulesOpen);
	const start = useGameStore((s) => s.start);
	const reset = useGameStore((s) => s.reset);
	const setRulesOpen = useGameStore((s) => s.setRulesOpen);
	const mode = useGameStore((s) => s.mode);
	const net = useGameStore((s) => s.net);
	const netAgain = useGameStore((s) => s.netAgain);
	const leaveNet = useGameStore((s) => s.leaveNet);
	if (mode === "net") {
		if (!net || net.status === "lobby" || net.status === "connecting") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [net?.status === "connecting" && !state ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "grid min-h-dvh place-items-center text-sm text-muted",
			children: "Открываем стол…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LobbyScreen, {}), rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: () => setRulesOpen(false) }) : null] });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-dvh flex-col",
			children: [
				net.status === "reconnecting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-x-0 top-14 z-40 mx-auto w-fit rounded-full border border-danger/50 bg-danger/15 px-4 py-1.5 text-sm text-clay",
					children: "Переподключение…"
				}) : null,
				state ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "grid min-h-dvh place-items-center text-sm text-muted",
					children: "Загружаем партию…"
				}),
				state?.phase === "gameOver" && state.scores ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameOverScreen, {
					scores: state.scores,
					winnerIds: state.winnerIds ?? [],
					humanId: state.humanId,
					onAgain: () => void netAgain(),
					onMenu: leaveNet
				}) : null,
				rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: () => setRulesOpen(false) }) : null
			]
		});
	}
	if (!state) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuScreen, {
		onStart: start,
		onRules: () => setRulesOpen(true)
	}), rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: () => setRulesOpen(false) }) : null] });
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
			rulesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesPanel, { onClose: () => setRulesOpen(false) }) : null
		]
	});
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
	const mode = useGameStore((s) => s.mode);
	const human = player(state, state.humanId);
	const actor = currentActor(state);
	const isHumanTurn = actor?.id === human.id;
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
	const interactions = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of state.players) for (const a of p.animals) {
			const hl = animalHighlight(state, a, intent, isHumanTurn, feedActs, devActs);
			map.set(a.id, {
				highlight: hl,
				dimmed: intent.kind !== "none" && !hl,
				selected: intent.kind === "playPair" && intent.first === a.id || intent.kind === "hunt" && intent.carnivoreId === a.id || intent.kind === "pirate" && intent.pirateId === a.id
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
	function onBoardClick(e) {
		const target = e.target.closest("[data-animal-id]");
		if (!target || !isHumanTurn || state.pendingAttack) return;
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
	const opponents = state.players.filter((p) => p.id !== human.id);
	const seats = opponents.length === 1 ? {
		top: [opponents[0]],
		left: [],
		right: []
	} : opponents.length === 2 ? {
		top: [],
		left: [opponents[0]],
		right: [opponents[1]]
	} : {
		top: [opponents[0]],
		left: [opponents[1]],
		right: [opponents[2]]
	};
	const wideSeats = seats.left.length > 0 || seats.right.length > 0;
	const lastLog = state.log[state.log.length - 1]?.text;
	const dying = (0, import_react.useMemo)(() => new Set(state.extinctionDeaths), [state.extinctionDeaths]);
	const fx = useActionFx(state);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.09]",
			style: { backgroundImage: `url(${BG.valley})` }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/90 px-3 py-2.5 backdrop-blur-sm sm:px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: LOGO,
					alt: "",
					className: "size-8 shrink-0 rounded-full border border-border object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg leading-none",
						children: "Эволюция"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 truncate text-xs text-muted",
						children: [
							"Год ",
							state.year,
							state.lastYear ? " · последний" : "",
							" · ",
							PHASE_LABEL[state.phase],
							actor ? ` · ${actor.name}` : ""
						]
					})]
				}),
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
						onClick: () => setSpeed(v),
						className: cn("rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors duration-[var(--motion-fast)]", speed === v ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
						children: SPEED_LABEL[v]
					}, v))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodBankChip, {
					count: state.foodBank,
					visible: state.phase === "feeding" || state.phase === "foodBank"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Журнал",
							onClick: () => setLogOpen(!logOpen),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Правила",
							onClick: () => setRulesOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Меню",
							onClick: reset,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			onClick: onBoardClick,
			className: cn("flex flex-1 flex-col gap-3 px-3 py-3 sm:px-5", wideSeats ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-4 lg:[grid-template-areas:'top_top_top''left_felt_right''human_human_human']" : "lg:mx-auto lg:w-full lg:max-w-4xl", state.phase === "extinction" ? "extinction-glow" : ""),
			children: [
				seats.top.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { gridArea: "top" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerSection, {
						p,
						actorId: actor?.id ?? null,
						thinking: thinking && thinkingWho === p.id,
						interactions: getInteraction,
						dying,
						freshSince: state.phase === "development" ? state.devStartPlaySeq : void 0,
						continents: Boolean(state.modules.continents)
					})
				}, p.id)),
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
					deaths: state.extinctionDeaths.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: wideSeats ? { gridArea: "right" } : void 0,
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
		}),
		logOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "fixed inset-x-3 bottom-20 z-30 max-h-44 space-y-1 overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 text-xs text-muted shadow-[var(--shadow-card)] backdrop-blur-sm sm:left-auto sm:right-5 sm:w-96",
			children: [...state.log].reverse().slice(0, 24).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: cn(e.tone === "bad" && "text-clay", e.tone === "good" && "text-good", e.tone === "hunt" && "text-fg"),
				children: e.text
			}, e.id))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "sticky bottom-0 z-20 border-t border-border bg-bg/95 px-3 py-3 backdrop-blur-sm sm:px-5",
			children: state.phase === "development" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevDock, {
				human,
				intent,
				disabled: !isHumanTurn || Boolean(state.pendingAttack),
				continents: Boolean(state.modules.continents),
				onPlayAnimal: (cardId, zoneId) => dispatch({
					type: "devPlayAnimal",
					cardId,
					zoneId
				}),
				onPickTrait: (cardId, face) => {
					const trait = human.hand.find((c) => c.id === cardId)?.faces[face];
					if (!trait) return;
					if (TRAITS[trait].isPair) setIntent({
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
				onPass: () => dispatch({ type: "devPass" })
			}) : state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedDock, {
				acts: feedActs,
				intentKind: intent.kind,
				bank: state.foodBank,
				onIntent: setIntent,
				onEndTurn: () => dispatch({ type: "feedEndTurn" }),
				onSkip: () => dispatch({ type: "feedSkip" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 items-center justify-center text-sm text-muted",
				children: state.phase === "foodBank" ? state.foodRoll ? "Кубики брошены — кормовая база определяется…" : "Бросок кормовой базы…" : state.phase === "extinction" ? "Вымирание: ненакормленные животные погибают…" : mode === "net" && actor && actor.id !== human.id ? `${actor.name} ходит…` : thinking ? `${actor?.name ?? "Соперник"} думает…` : "Ожидание"
			})
		}),
		fx.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				left: b.x,
				top: b.y
			},
			className: cn("fx-badge rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[var(--shadow-card)] backdrop-blur-sm", FX_TONE[b.tone]),
			children: b.text
		}, b.id)),
		state.pendingAttack && state.pendingAttack.waitingFor === human.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefenseDock, {
			acts: defActs,
			onPick: (a) => dispatch(a)
		}) : null
	] });
}
function handleAnimalClick(animal, ctx) {
	const { state, intent, human, feedActs, devActs, dispatch, setIntent } = ctx;
	if (state.pendingAttack) return;
	if (state.phase === "development") {
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
	if (intent.kind === "hunt") {
		if (!intent.carnivoreId) {
			if (animal.ownerId === human.id && hasTrait(animal, "carnivore")) setIntent({
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
	if (intent.kind === "graze") {
		if (feedActs.some((a) => a.type === "feedGraze" && a.animalId === animal.id)) dispatch({
			type: "feedGraze",
			animalId: animal.id
		});
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
	if (intent.kind === "playPair") {
		if (!intent.first) return animal.ownerId === state.humanId;
		return devActs.some((a) => a.type === "devPlayPair" && a.a === intent.first && a.b === animal.id);
	}
	if (state.phase !== "feeding") return false;
	if (intent.kind === "hunt" && intent.carnivoreId) {
		const car = findAnimal(state, intent.carnivoreId);
		return Boolean(car && canAttack(state, car, animal));
	}
	if (intent.kind === "hunt" && !intent.carnivoreId) return animal.ownerId === state.humanId && hasTrait(animal, "carnivore");
	if (intent.kind === "pirate" && intent.pirateId) return feedActs.some((a) => a.type === "feedPirate" && a.targetId === animal.id);
	if (intent.kind === "take" || intent.kind === "none") return animal.ownerId === state.humanId && canReceiveFood(state, animal) && state.foodBank > 0;
	if (intent.kind === "hibernate") return feedActs.some((a) => a.type === "feedHibernate" && a.animalId === animal.id);
	if (intent.kind === "fat") return feedActs.some((a) => a.type === "feedConvertFat" && a.animalId === animal.id);
	if (intent.kind === "graze") return feedActs.some((a) => a.type === "feedGraze" && a.animalId === animal.id);
	return false;
}
/** Табло игрока со его животными; парные карты кладутся между животными. */
var PlayerSection = (0, import_react.memo)(function PlayerSection({ p, isHuman, actorId, thinking, interactions, dying, freshSince, continents, style }) {
	const dispatch = useGameStore((s) => s.dispatch);
	const [dragId, setDragId] = (0, import_react.useState)(null);
	const [overId, setOverId] = (0, import_react.useState)(null);
	const dragIdRef = (0, import_react.useRef)(null);
	const active = actorId === p.id;
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
			plateNote
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
		className: cn("mb-3 rounded-[var(--radius-lg)] border bg-surface p-3 transition-[border-color,box-shadow] duration-[var(--motion-quick)] lg:mb-0", active ? "border-accent/70 shadow-[0_0_0_1px_var(--color-accent),var(--shadow-card)]" : "border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2 font-medium",
				children: [isHuman ? "Ваша популяция" : p.name, active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex items-center gap-1 text-xs", thinking ? "text-accent" : "text-accent"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full bg-accent", thinking && "pulse-dot") }), thinking ? "думает…" : "ходит"]
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted",
				children: [
					"рука ",
					p.handCount ?? p.hand.length,
					" · сброс ",
					p.discardCount
				]
			})]
		}), continents ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: TERRITORIES.map((t) => {
				const animals = p.animals.filter((a) => (a.zoneId ?? "laurasia") === t.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TerritoryRow, {
					zone: t.id,
					name: t.name,
					count: animals.length,
					dropHint: isHuman,
					onDropZone: isHuman ? () => dispatch({
						type: "reorderAnimal",
						animalId: dragIdRef.current,
						toZoneId: t.id
					}) : void 0,
					children: [animals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-1 text-[11px] text-subtle",
						children: t.id === "ocean" ? "пусто (нужна водоплавающая)" : "пусто"
					}) : null, animals.map((a, i) => renderCard(a, i + 1))]
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
function TerritoryRow({ zone, name, count, children, dropHint, onDropZone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-zone": zone,
		onDragOver: dropHint ? (e) => e.preventDefault() : void 0,
		onDrop: onDropZone,
		className: cn("relative flex min-h-[52px] flex-wrap items-stretch gap-2 rounded-[var(--radius-md)] border border-dashed px-2 py-2", zone === "ocean" ? "border-water/40 bg-water/10" : "border-border-strong/25 bg-bg/40"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: TERRITORY_ART[zone],
				alt: "",
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 h-full w-full rounded-[var(--radius-md)] object-cover opacity-[0.08]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute -top-1.5 left-2 rounded-full border border-border bg-surface px-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-muted",
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
function CenterField({ year, lastYear, phase, bank, territoryFood, deckLeft, foodRoll, lastLog, actorName, deaths, style }) {
	const showDice = phase === "foodBank" || phase === "feeding";
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
			phase === "extinction" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative animate-[fade-in_.3s_var(--ease-out)] rounded-full border border-danger/60 bg-danger/15 px-4 py-1.5 text-sm font-medium text-clay",
				children: ["Вымирание: погибает ", deaths === 0 ? "никто" : `животных: ${deaths}`]
			}) : territoryFood ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerritoryBanks, {
				banks: territoryFood,
				active: phase === "feeding"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankPile, {
				count: bank,
				active: phase === "feeding"
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
						className: "h-7 w-full rounded-[4px] object-cover opacity-80"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							Array.from({ length: Math.min(n, 6) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: TOKEN.meat,
								alt: "",
								className: "token-pop size-3 rounded-full"
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
function BankPile({ count, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex flex-col items-center gap-1.5",
		title: active ? "Фишки кормовой базы — берите по одной в свой ход питания" : "Кормовая база",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex max-w-[260px] flex-wrap items-center justify-center gap-1",
				children: [count === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-subtle",
					children: active ? "база пуста" : "—"
				}) : Array.from({ length: Math.min(count, 24) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: TOKEN.meat,
					alt: "",
					className: "token-pop size-4 rounded-full"
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
				children: "кормовая база"
			})
		]
	});
}
/**
* Кубики: крутятся ~0.9 с после броска, затем показывают выпавшие значения.
* Компонент перемонтируется только со новым броском (ключ — значения кубиков),
* поэтому эффект прокрутки срабатывает один раз.
*/
function DiceTray({ roll }) {
	const [rolling, setRolling] = (0, import_react.useState)(Boolean(roll));
	const rollId = roll?.join(",") ?? "";
	const timer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!rollId) return;
		setRolling(true);
		timer.current = setTimeout(() => setRolling(false), 900);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [rollId]);
	if (!roll) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Die, {
				value: null,
				rolling: true,
				className: "size-9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Die, {
				value: null,
				rolling: true,
				className: "size-9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-[0.18em] text-muted",
				children: "бросок…"
			})
		]
	});
	const total = roll.reduce((s, d) => s + d, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg/50 px-4 py-2.5",
		children: [roll.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Die, {
			value: d,
			rolling,
			className: rolling ? "size-9" : "size-10"
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
		className: "flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 py-1.5",
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
function DevDock({ human, intent, disabled, continents, onPlayAnimal, onPickTrait, onPass }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: disabled ? "Ход соперника — карты остаются у вас" : intent.kind === "playTrait" ? "Выберите животное для свойства" : intent.kind === "playPair" && !("first" in intent && intent.first) ? "Парное свойство: выберите первое животное" : intent.kind === "playPair" ? "Второе животное пары" : continents ? "Карта как животное (выберите континент) или свойство" : "Карта как животное или свойство"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: onPass,
				disabled,
				children: "Пас"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-hand-row": true,
			className: "flex gap-2 overflow-x-auto pb-1",
			children: human.hand.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCard, {
					card,
					disabled,
					selected: intent.kind !== "none" && "cardId" in intent && intent.cardId === card.id,
					selectedFace: "face" in intent && intent.cardId === card.id ? intent.face : null,
					onSelect: (face) => {
						if (face === "animal" && continents) document.getElementById(`zone-menu-${card.id}`)?.classList.toggle("hidden");
						else if (face === "animal") onPlayAnimal(card.id);
						else onPickTrait(card.id, face);
					}
				}), continents ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: `zone-menu-${card.id}`,
					className: "absolute inset-x-0 top-8 z-30 hidden flex-col gap-1 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled,
						onClick: () => {
							document.getElementById(`zone-menu-${card.id}`)?.classList.add("hidden");
							onPlayAnimal(card.id, "laurasia");
						},
						className: "rounded-[var(--radius-xs)] bg-parchment px-1 py-1 text-[10px] font-semibold text-ink shadow-[var(--shadow-card)] hover:bg-parchment-2",
						children: "↑ Лавразия"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled,
						onClick: () => {
							document.getElementById(`zone-menu-${card.id}`)?.classList.add("hidden");
							onPlayAnimal(card.id, "gondwana");
						},
						className: "rounded-[var(--radius-xs)] bg-parchment px-1 py-1 text-[10px] font-semibold text-ink shadow-[var(--shadow-card)] hover:bg-parchment-2",
						children: "↓ Гондвана"
					})]
				}) : null]
			}, card.id))
		})]
	});
}
function FeedDock({ acts, intentKind, bank, onIntent, onEndTurn, onSkip }) {
	const dispatch = useGameStore((s) => s.dispatch);
	const takes = acts.filter((a) => a.type === "feedTake");
	const canHunt = acts.some((a) => a.type === "feedHunt");
	const canPirate = acts.some((a) => a.type === "feedPirate");
	const sleeps = acts.filter((a) => a.type === "feedHibernate");
	const fats = acts.filter((a) => a.type === "feedConvertFat");
	const grazes = acts.filter((a) => a.type === "feedGraze");
	const migrations = acts.filter((a) => a.type === "feedMigrate");
	const canSkip = acts.some((a) => a.type === "feedSkip");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mr-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs tabular-nums text-muted",
				children: ["База: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-sm text-fg",
					children: bank
				})]
			}),
			takes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "take" || intentKind === "none" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => {
					if (takes.length === 1) dispatch(takes[0]);
					else onIntent({ kind: "take" });
				},
				children: "Взять еду"
			}) : null,
			canHunt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "hunt" ? "danger" : "secondary",
				size: "sm",
				onClick: () => onIntent({ kind: "hunt" }),
				children: "Охота"
			}) : null,
			canPirate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "pirate" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => onIntent({ kind: "pirate" }),
				children: "Пиратство"
			}) : null,
			sleeps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "hibernate" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => {
					if (sleeps.length === 1) dispatch(sleeps[0]);
					else onIntent({ kind: "hibernate" });
				},
				children: "Спячка"
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
				size: "sm",
				onClick: onEndTurn,
				children: "Закончить ход"
			}),
			canSkip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onSkip,
				title: "Пас до конца фазы питания",
				children: "Пас"
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
