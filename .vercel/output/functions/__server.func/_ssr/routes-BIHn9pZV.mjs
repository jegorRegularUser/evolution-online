import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { l as require_react_dom, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { A as legalDevActions, C as findAnimal, D as isFed, E as isCarnivoreLike, M as player, N as pollInput, O as joinRoomInput, P as speciesNeed, S as currentActor, T as hasTrait, _ as canReceiveFood, a as MUTATIONS_TRAIT_IDS, b as createGame, c as PLANTS_TRAIT_IDS, d as actionInput, f as applyAction, g as canRageAttack, h as canPlantAttackTarget, i as MARKS, j as legalFeedActions, k as legalDefenseActions, l as TRAITS, m as canAttack, n as FLORA, p as botsInput, r as FUNGI_TRAIT_IDS, s as PLANTS, t as CONTINENTS_TRAIT_IDS, u as TRAIT_ORDER, v as chooseAIAction, w as foodNeeded, x as createRoomInput, y as codeTokenInput } from "./ai-BoVvw1cM.mjs";
import { a as RotateCcw, c as Pause, d as List, f as Copy, h as BookOpen, i as Skull, l as Minus, m as Bot, o as Plus, p as Check, r as Swords, s as Play, t as Users, u as LogOut } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as DirectionalLight, c as MeshStandardMaterial, d as SRGBColorSpace, f as Scene, i as CanvasTexture, l as PerspectiveCamera, n as AmbientLight, o as Euler, p as Vector3, r as BoxGeometry, s as Mesh, t as WebGLRenderer, u as Quaternion } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BIHn9pZV.js
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
	honeyPlant: "/img/trait/honeyPlant.jpg"
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
* Арты карт флоры «Травы и грибов» (4:3). Пока картинок нет — карточка
* рисует векторный глиф (гриб/травинка) и цветную рамку происхождения.
*/
var FLORA_ART = {};
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
* видимыми гранями разной яркости. Красный — еда из кормовой базы, синий —
* от свойств (охота, сотрудничество…), жёлтый — жир, зелёный — еда растений.
*/
var CUBE_TONES = {
	red: [
		"#d4705c",
		"#a83f2f",
		"#8c3123"
	],
	blue: [
		"#5f9cc9",
		"#3c6f96",
		"#2f5a7c"
	],
	yellow: [
		"#e3bd63",
		"#b8913a",
		"#9a7728"
	],
	green: [
		"#85b96a",
		"#5c8f42",
		"#497534"
	]
};
function FoodCube({ tone, className, title }) {
	const [top, left, right] = CUBE_TONES[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 20 21",
		className: cn("shrink-0", className),
		"aria-hidden": !title,
		role: title ? "img" : void 0,
		"aria-label": title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			stroke: "rgba(18,14,8,0.4)",
			strokeWidth: "0.6",
			strokeLinejoin: "round",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: "10,1 19,6.2 10,11.4 1,6.2",
					fill: top
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: "1,6.2 10,11.4 10,20.6 1,15.4",
					fill: left
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: "19,6.2 10,11.4 10,20.6 19,15.4",
					fill: right
				})
			]
		})
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
/** Чип метки последствий на животном: цвет по виду, правило — в подсказке. */
var MarkChip = (0, import_react.memo)(function MarkChip({ mark }) {
	const def = MARKS[mark];
	const tip = useTraitTip({ isolateClick: true });
	const tipDef = {
		id: mark,
		name: `Метка «${def.name}»`,
		description: def.description
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: (el) => {
			tip.anchorRef.current = el;
		},
		...tip.triggerProps,
		"data-mark-chip": true,
		className: cn("anim-chip-in relative inline-flex h-5 items-center gap-1 rounded-[var(--radius-xs)] border px-1.5 text-[10px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent/60", MARK_TONE[mark]),
		children: [def.short, tip.anchorRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitTooltip, {
			def: tipDef,
			anchorRect: tip.anchorRect,
			id: tip.tipId
		}) : null]
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
				}), def.mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("ml-auto rounded-full border px-1.5 text-[9px] font-semibold", MARK_TONE[def.mark]),
					title: `Даёт метку «${MARKS[def.mark].name}»`,
					children: "метка"
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
					}) : null, hasTrait(animal, "obligateCarnivore") ? "Облигатный хищник" : hasTrait(animal, "carnivore") ? "Хищник" : hasTrait(animal, "swimming") ? "Водное" : "Животное"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [
						(animal.population ?? 1) > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							title: `Численность вида: ${animal.population} животного(-ых)`,
							className: "rounded-full bg-accent/20 px-1.5 text-[10px] font-semibold tabular-nums text-accent",
							children: ["×", animal.population]
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
/**
* Настоящие 3D-кости на three.js: кувыркаются, пока идёт бросок, и плавно
* ложатся гранью с выпавшим значением. Один canvas на набор кубиков,
* поэтому сцена живёт только пока смонтирован компонент.
*
* Значение грани видно зрителю (камера смотрит с +z):
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
/** Грань кости: пергамент с кромкой и очками тушью (в стиле стола). */
function dieFaceTexture(value) {
	const S = 128;
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = S;
	const ctx = canvas.getContext("2d");
	const r = 18;
	ctx.beginPath();
	ctx.moveTo(r, 0);
	ctx.arcTo(S, 0, S, S, r);
	ctx.arcTo(S, S, 0, S, r);
	ctx.arcTo(0, S, 0, 0, r);
	ctx.arcTo(0, 0, S, 0, r);
	ctx.closePath();
	const grad = ctx.createLinearGradient(0, 0, 0, S);
	grad.addColorStop(0, "#faf4e4");
	grad.addColorStop(1, "#e7ddc4");
	ctx.fillStyle = grad;
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgba(58,48,32,0.35)";
	ctx.stroke();
	for (const [fx, fy] of PIPS[value] ?? []) {
		const x = fx * S;
		const y = fy * S;
		const pip = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 11);
		pip.addColorStop(0, "#4a4234");
		pip.addColorStop(1, "#211c14");
		ctx.fillStyle = pip;
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, Math.PI * 2);
		ctx.fill();
	}
	const tex = new CanvasTexture(canvas);
	tex.colorSpace = SRGBColorSpace;
	return tex;
}
function Dice3D({ values, rolling, dieSize = 64, gap = 14, className, ariaLabel }) {
	const canvasRef = (0, import_react.useRef)(null);
	const rollingRef = (0, import_react.useRef)(rolling);
	const valuesRef = (0, import_react.useRef)(values);
	rollingRef.current = rolling;
	valuesRef.current = values;
	const n = Math.max(values.length, 1);
	const width = n * dieSize + (n - 1) * gap;
	const height = Math.round(dieSize * 1.45);
	const rollKey = values.map((v) => v ?? "?").join(",") + (rolling ? "|rolling" : "");
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const renderer = new WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height, false);
		const scene = new Scene();
		const camera = new PerspectiveCamera(30, width / height, .1, 50);
		camera.position.set(0, 1.9, 6.6);
		camera.lookAt(0, 0, 0);
		scene.add(new AmbientLight(16774886, 1.05));
		const key = new DirectionalLight(16777215, 1.7);
		key.position.set(3, 5, 4);
		scene.add(key);
		const fill = new DirectionalLight(10466504, .55);
		fill.position.set(-4, 1.5, -2);
		scene.add(fill);
		const geometry = new BoxGeometry(1, 1, 1);
		const materialsByValue = /* @__PURE__ */ new Map();
		const materialFor = (value) => {
			let m = materialsByValue.get(value);
			if (!m) {
				m = new MeshStandardMaterial({
					map: dieFaceTexture(value),
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
			mesh.position.x = (i - (diceCount - 1) / 2) * 1.75;
			scene.add(mesh);
			dice.push({
				mesh,
				spin: new Vector3(4 + Math.random() * 5, 5 + Math.random() * 5, 3 + Math.random() * 4)
			});
		}
		const targetOf = (value) => {
			if (!value) return null;
			const e = FACE_EULER[value] ?? FACE_EULER[3];
			return new Quaternion().setFromEuler(new Euler(e[0], e[1], e[2]));
		};
		for (const d of dice) d.mesh.quaternion.setFromEuler(new Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2));
		const delta = new Quaternion();
		const step = new Euler();
		const settle = 1 - Math.exp(-11 / 60);
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min((now - last) / 1e3, .05);
			last = now;
			const vals = valuesRef.current;
			const isRolling = rollingRef.current;
			for (let i = 0; i < dice.length; i++) {
				const d = dice[i];
				const value = vals[i] ?? null;
				if (isRolling || !value) {
					step.set(d.spin.x * dt, d.spin.y * dt, d.spin.z * dt);
					delta.setFromEuler(step);
					d.mesh.quaternion.multiply(delta).normalize();
					d.mesh.position.y = Math.abs(Math.sin(now / 140 + i * 1.7)) * .22;
				} else {
					const target = targetOf(value);
					if (target) d.mesh.quaternion.slerp(target, settle);
					d.mesh.position.y += (0 - d.mesh.position.y) * settle;
				}
			}
			renderer.render(scene, camera);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			geometry.dispose();
			for (const m of materialsByValue.values()) {
				m.map?.dispose();
				m.dispose();
			}
			renderer.dispose();
		};
	}, [
		rollKey,
		n,
		width,
		height
	]);
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
	const [plants, setPlants] = (0, import_react.useState)(false);
	const [fungi, setFungi] = (0, import_react.useState)(false);
	const [mutations, setMutations] = (0, import_react.useState)(false);
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
					children: "Дополнения"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setContinents((v) => !v),
							"aria-pressed": continents,
							className: cn("flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm", continents ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Континенты — Лавразия, Гондвана и Океан" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", continents ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
								children: continents ? "вкл" : "выкл"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPlants((v) => !v),
							"aria-pressed": plants,
							title: "Растения: еда на общих растениях, фаза роста, убежища и хищные растения. Совместимо с Континентами.",
							className: cn("flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm", plants ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Растения — общая кормовая база и убежища" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", plants ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
								children: plants ? "вкл" : "выкл"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFungi((v) => !v),
							"aria-pressed": fungi,
							title: "Трава и грибы: еда на картах флоры, метки последствий, флора играет на победу. Совместимо с Континентами и Растениями.",
							className: cn("flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm", fungi ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Трава и грибы — флора и метки последствий" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", fungi ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
								children: fungi ? "вкл" : "выкл"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMutations((v) => !v),
							"aria-pressed": mutations,
							title: "Случайные мутации: вместо руки — личная слепая колода, численность видов, вредные мутации. Совместимо со всеми дополнениями.",
							className: cn("flex w-full items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-sm", mutations ? "border-accent bg-accent/15 text-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Случайные мутации — слепые колоды и вредные мутации" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide", mutations ? "bg-accent text-accent-fg" : "bg-ink/20 text-muted"),
								children: mutations ? "вкл" : "выкл"
							})]
						})
					]
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
					modules: {
						...continents ? { continents: true } : {},
						...plants ? { plants: true } : {},
						...fungi ? { fungi: true } : {},
						...mutations ? { randomMutations: true } : {}
					}
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
/** Дополнения в разработке — официальный пересказ правил следующим обновлением. */
var MODULES = [];
function MenuScreen({ onStart, onRules }) {
	const [players, setPlayers] = (0, import_react.useState)(2);
	const [difficulty, setDifficulty] = (0, import_react.useState)("normal");
	const speed = useGameStore((s) => s.speed);
	const setSpeed = useGameStore((s) => s.setSpeed);
	const continents = useGameStore((s) => Boolean(s.modules.continents));
	const plants = useGameStore((s) => Boolean(s.modules.plants));
	const fungi = useGameStore((s) => Boolean(s.modules.fungi));
	const mutations = useGameStore((s) => Boolean(s.modules.randomMutations));
	const modules = useGameStore((s) => s.modules);
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
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setModules({
									...modules,
									continents: !continents
								}),
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setModules({
									...modules,
									plants: !plants
								}),
								"aria-pressed": plants,
								title: "Растения: еда этого года — на общих растениях, кубик не нужен; фаза роста, убежища, хищные растения, микориза и паразиты. Совместимо с Континентами.",
								className: cn("flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", plants ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
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
								className: cn("flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", fungi ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
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
								className: cn("flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left", mutations ? "border-accent bg-accent/15" : "border-border bg-bg hover:bg-surface-2"),
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex h-[68px] w-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border", f.isFungus ? "border-virus/40 bg-virus/10 text-virus" : "border-leaf/40 bg-leaf/10 text-leaf"),
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
				className: "rounded-[var(--radius-sm)] border border-border bg-bg p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium text-fg",
					children: [
						"Метка «",
						m.name,
						"» · по 4 в комплекте"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-snug",
					children: m.description
				})]
			}, k);
		})
	});
}
function RulesPanel({ onClose }) {
	const [tab, setTab] = (0, import_react.useState)("base");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-0 sm:items-center sm:p-6",
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
						className: cn("h-11 rounded-[var(--radius-md)] border px-1 text-sm font-medium", tab === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-bg text-fg hover:bg-surface-2"),
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
							children: "Очки"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "2 за каждое выжившее животное, 1 за каждое свойство. Дополнительно: хищник и большой +1, паразит +2. Ничья — по картам в сбросе." }),
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
/** Превращает события последнего действия в очередь крупных показов. */
function buildItems(state, registry, nextId) {
	const items = [];
	const remembered = (id) => animalInfo(state, id) ?? registry.get(id) ?? null;
	for (const e of state.lastEvents) switch (e.kind) {
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
	const deaths = state.lastEvents.filter((e) => e.kind === "animalDied");
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
function EventSpotlight() {
	const state = useGameStore((s) => s.state);
	const speed = useGameStore((s) => s.speed);
	const mult = speed === "slow" ? 1.5 : speed === "fast" ? .6 : 1;
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [closing, setClosing] = (0, import_react.useState)(false);
	const seqRef = (0, import_react.useRef)(-1);
	const idRef = (0, import_react.useRef)(0);
	const registryRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
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
		const items = buildItems(state, registryRef.current, () => {
			idRef.current += 1;
			return idRef.current;
		});
		if (items.length) setQueue((q) => [...q, ...items].slice(-4));
	}, [state]);
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
	if (!current) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		"aria-live": "polite",
		className: "fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6",
		onClick: () => {
			setCurrent(null);
			setClosing(false);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spotlight-backdrop absolute inset-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
			item: current,
			closing
		}, current.id)]
	});
}
function SpotlightCard({ item, closing }) {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-4 text-[10px] uppercase tracking-[0.18em] text-subtle",
				children: "нажмите, чтобы продолжить"
			})
		]
	});
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
		const plantEl = (id) => document.querySelector(`[data-plant-id="${id}"]`);
		const floraEl = (id) => document.querySelector(`[data-flora-id="${id}"]`);
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
	const isHumanTurn = actor?.id === human.id && state.madTurn !== human.id;
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
	const wideSeats = seats.left.length > 0 || seats.right.length > 0;
	const lastLog = state.log[state.log.length - 1]?.text;
	const dying = (0, import_react.useMemo)(() => new Set(state.extinctionDeaths), [state.extinctionDeaths]);
	const fx = useActionFx(state);
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
			children: state.phase === "development" ? state.modules.randomMutations ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MutateDock, {
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
				onPass: () => dispatch({ type: "devPass" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevDock, {
				human,
				intent,
				disabled: !isHumanTurn || Boolean(state.pendingAttack),
				continents: Boolean(state.modules.continents),
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
				onPass: () => dispatch({ type: "devPass" })
			}) : state.phase === "feeding" && isHumanTurn && !state.pendingAttack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedDock, {
				acts: feedActs,
				intentKind: intent.kind,
				bank: state.foodBank,
				rageTurn: state.rageTurn ?? null,
				onIntent: setIntent,
				onEndTurn: () => dispatch({ type: "feedEndTurn" }),
				onSkip: () => dispatch({ type: "feedSkip" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 items-center justify-center text-sm text-muted",
				children: state.phase === "foodBank" ? plantsOn || fungiOn ? "Кормовая база Океана определяется…" : state.foodRoll ? "Кубики брошены — кормовая база определяется…" : "Бросок кормовой базы…" : state.phase === "extinction" ? "Вымирание: ненакормленные животные погибают…" : state.phase === "growth" ? "Рост: растения разрастаются, добавляются новые…" : state.madTurn === (actor?.id ?? -2) ? `Безумие: раунд ${actor?.name ?? ""} проводит сосед справа…` : mode === "net" && actor && actor.id !== human.id ? `${actor.name} ходит…` : thinking ? `${actor?.name ?? "Соперник"} думает…` : "Ожидание"
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventSpotlight, {}),
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
	if (intent.kind === "take" || intent.kind === "none") return animal.ownerId === state.humanId && canReceiveFood(state, animal) && state.foodBank > 0;
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
				className: "text-xs text-muted",
				children: [
					randomMutations ? `колода ${p.blindDeckCount ?? p.blindDeck?.length ?? 0}` : `рука ${p.handCount ?? p.hand.length}`,
					" ",
					"· сброс ",
					p.discardCount
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
* Кубики кормовой базы: настоящие 3D-кости кувыркаются ~0.9 с после броска,
* затем ложатся выпавшими гранями. Компонент перемонтируется только со новым
* броском (ключ — значения кубиков), поэтому бросок проигрывается один раз.
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
/**
* Док фазы развития «Случайных мутаций»: карты в слепой колоде — игрок
* сначала объявляет способ розыгрыша, потом движок вскрывает верхнюю карту.
*/
function MutateDock({ human, intent, disabled, continents, canPlant, onNewAnimal, onTrait, onPop, onPlant, onPass }) {
	const left = human.blindDeck?.length ?? human.blindDeckCount ?? 0;
	const mutating = intent.kind === "mutateTrait" || intent.kind === "mutatePop" || intent.kind === "mutatePlant";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: disabled ? "Ход соперника" : mutating ? intent.kind === "mutateTrait" ? "Выберите свой вид из одного животного — карта вскроется на нём" : intent.kind === "mutatePop" ? "Выберите вид — карта станет +1 животным" : "Выберите растение — карта вскроется свойством на нём" : "Объявите розыгрыш верхней карты колоды — потом она вскроется"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-wider",
					children: "Колода"
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: onPass,
					disabled,
					children: "Пас"
				})
			]
		})]
	});
}
function DevDock({ human, intent, disabled, continents, onPlayAnimal, onPlaceAnimal, onPickTrait, onPass }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: disabled ? "Ход соперника — карты остаются у вас" : intent.kind === "placeAnimal" ? "Выберите территорию на столе — животное разместится туда" : intent.kind === "playPlantTrait" ? intent.kind === "playPlantTrait" && "cardId" in intent ? "Выберите растение для свойства" : "" : intent.kind === "playPlantPair" && !("first" in intent && intent.first) ? "Микориза: выберите первое растение" : intent.kind === "playPlantPair" ? "Второе растение микоризы" : intent.kind === "playTrait" ? "Выберите животное для свойства" : intent.kind === "playPair" && !("first" in intent && intent.first) ? "Парное свойство: выберите первое животное" : intent.kind === "playPair" ? "Второе животное пары" : continents ? "Карта как животное (затем клик по континенту) или свойство" : "Карта как животное или свойство"
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
			children: human.hand.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCard, {
				card,
				disabled,
				selected: intent.kind !== "none" && "cardId" in intent && intent.cardId === card.id || intent.kind === "placeAnimal" && intent.cardId === card.id,
				selectedFace: "face" in intent && intent.cardId === card.id ? intent.face : null,
				onSelect: (face) => {
					if (face === "animal" && continents && onPlaceAnimal) onPlaceAnimal(card.id);
					else if (face === "animal") onPlayAnimal(card.id);
					else onPickTrait(card.id, face);
				}
			}, card.id))
		})]
	});
}
function FeedDock({ acts, intentKind, bank, rageTurn, onIntent, onEndTurn, onSkip }) {
	const dispatch = useGameStore((s) => s.dispatch);
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
				size: "sm",
				onClick: onEndTurn,
				children: "Закончить ход"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [
			bank > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mr-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs tabular-nums text-muted",
				children: ["Океан: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-sm text-fg",
					children: bank
				})]
			}) : null,
			foodActs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: intentKind === "take" || intentKind === "takePlant" || intentKind === "takeFlora" || intentKind === "none" ? "parchment" : "secondary",
				size: "sm",
				onClick: () => {
					if (foodActs.length === 1) dispatch(foodActs[0]);
					else onIntent({ kind: plantTakes.length || floraTakes.length ? floraTakes.length && !plantTakes.length ? "takeFlora" : "takePlant" : "take" });
				},
				children: "Взять еду"
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
			}) : canSkipHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				title: "Пока хотя бы одно ваше животное способно получить еду или убежище, пасовать нельзя (правила «Растений»)",
				children: "Пас недоступен — есть доступная еда или убежища"
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
