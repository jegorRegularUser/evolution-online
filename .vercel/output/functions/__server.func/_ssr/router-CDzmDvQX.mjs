import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { _ as useRouter, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as __exportAll } from "./ssr.mjs";
import { c as TERRITORIES, i as MARKS, l as TRAITS, n as FLORA, o as PLANTS } from "./types-BR4PMx1a.mjs";
import { a as number, c as union, i as literal, o as object, s as string } from "../_libs/zod.mjs";
import { B as Dna, D as Microscope, H as Crosshair, I as Globe, L as Flower2, P as Layers, R as Flame, f as Sprout, h as Shield, l as Trophy, n as Wind, r as Wheat, s as Users, u as TriangleAlert, w as Mountain, y as Puzzle } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CDzmDvQX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var en = {
	"common.cancel": "Cancel",
	"common.close": "Close",
	"common.gotIt": "Got it",
	"common.save": "Save",
	"common.enter": "Enter",
	"common.on": "on",
	"common.off": "off",
	"app.name": "Evolution",
	"app.brand": "Pravilnye Igry · Knorre",
	"app.description": "Evolution — the digital edition of the Russian board game about the origin of species.",
	"topbar.tutorial": "Tutorial",
	"topbar.rules": "Rules",
	"topbar.stats": "Statistics",
	"lang.switch": "Switch language to Russian",
	"menu.subtitle": "Gather a table, invite friends and add bots — the game runs on the server.",
	"menu.tabsLabel": "Menu sections",
	"menu.tab.tables": "Tables",
	"menu.tab.create": "Create",
	"menu.col.table": "Table",
	"menu.col.table.hint": "Your name is visible to opponents. The table opens with your last game settings — everything can be changed in the lobby.",
	"menu.col.open": "Open",
	"menu.col.open.hint": "Join by table code, no password. Games in progress can be watched without taking a seat.",
	"menu.col.private": "Private",
	"menu.col.private.hint": "Password-protected tables: the code is visible, entry needs 4 digits from the host.",
	"menu.name": "Your name",
	"menu.name.placeholder": "How opponents see you",
	"menu.create": "Create table",
	"menu.join": "Join a table",
	"menu.private": "Private table — entry by password",
	"menu.code": "Table code",
	"menu.code.placeholder": "For example, KQXT",
	"menu.password": "Table password",
	"menu.digits4": "4 digits",
	"menu.watch": "Watch",
	"menu.watch.title": "You won't take a seat: you'll see the table and chat and can cheer the players on",
	"menu.hint": "Bots, capacity, expansions and difficulty are configured in the lobby before the start. The private table's password is generated by the server — view and change it there.",
	"menu.err.name": "Enter a name — opponents will see it at the table",
	"menu.err.nameCol": "First enter your name in the “Table” column",
	"menu.waiting": "Waiting for players",
	"menu.live": "In progress",
	"menu.open.empty": "No open tables — create your own and invite players.",
	"menu.open.live.empty": "No one is playing right now.",
	"menu.private.empty": "No private tables.",
	"menu.private.live.empty": "No private games right now.",
	"menu.room.host": "host {name}",
	"menu.room.summary": "{line} · {taken} of {capacity} seats taken",
	"menu.room.watchTitle": "Watch the game without taking a seat",
	"menu.room.joinTitle": "Take a seat",
	"menu.room.watch": "Watch",
	"menu.room.join": "Take a seat",
	"menu.private.liveTitle": "Game in progress: no seat to take",
	"menu.private.openTitle": "Click to enter a password",
	"menu.private.collapseTitle": "Collapse password input",
	"menu.private.enterTitle": "Enter a 4-digit password and take a seat",
	"menu.private.enter": "Enter by password",
	"menu.private.passwordAria": "Private table password",
	"menu.private.live": "live",
	"diff.easy": "Easier",
	"diff.normal": "Normal",
	"diff.hard": "Harder",
	"module.continents": "Continents",
	"module.continents.hint": "Laurasia, Gondwana and the Ocean",
	"module.plants": "Plants",
	"module.plants.hint": "food on shared plants, shelters",
	"module.fungi": "Grass and Mushrooms",
	"module.fungi.hint": "flora and consequence marks",
	"module.randomMutations": "Random Mutations",
	"module.randomMutations.hint": "personal blind deck",
	"lobby.subtitle": "Table · waiting for players",
	"lobby.copy": "Copied",
	"lobby.copyLink": "Copy the table link",
	"lobby.copyBoth": "Copy the link and the password",
	"lobby.copiedBoth": "Copied: link and password",
	"lobby.passwordShow": "Show table password",
	"lobby.passwordHide": "Hide table password",
	"lobby.passwordTitle": "Table password — click to show or hide",
	"lobby.passwordNew": "New table password",
	"lobby.passwordChangeAria": "Change the table password",
	"lobby.passwordChangeTitle": "Change password",
	"lobby.passwordCancelAria": "Cancel the password change",
	"lobby.passwordSaved": "Password saved",
	"lobby.passwordFail": "Could not save the password",
	"lobby.privacyOnAria": "Table is private — make it open",
	"lobby.privacyOffAria": "Table is open — make it private",
	"lobby.privacyOnTitle": "The table is locked: guests need the password (the table is listed under “Private”). Click to open it",
	"lobby.privacyOffTitle": "The table is listed as open. Click to lock the table with a password",
	"lobby.invitePassword": "Table password: {password}",
	"lobby.copyManual": "Copy the link manually:",
	"lobby.settings": "Game settings",
	"lobby.modules": "Expansions",
	"lobby.hostOnly": "Only the host can change settings",
	"lobby.difficulty": "Bot difficulty",
	"lobby.deckSize": "Trait deck size",
	"lobby.deckInfo": "Deck of {n} cards · ≈{years} years of play",
	"lobby.deckShort": "Short",
	"lobby.deckNormal": "Normal",
	"lobby.deckFull": "Full",
	"lobby.seats": "Seats at the table",
	"lobby.seatsHost": " · set by the host",
	"lobby.seatsHint": "You can go below the number of humans too: free seats compact first, then bots leave, and extra players move to the wait queue.",
	"lobby.bots": "Bots",
	"lobby.botRemove": "Remove a bot",
	"lobby.botAdd": "Add a bot",
	"lobby.botsHint": "they fill the free seats before the start",
	"lobby.start": "Start year",
	"lobby.startHostTitle": "The host starts the game",
	"lobby.startFullTitle": "Fill all the seats — with humans or bots",
	"lobby.leave": "Leave table",
	"lobby.startHint.host": "The host starts: the button unlocks once they fill the table.",
	"lobby.startHint.free": "Free seats: {free} of {capacity} — invite players by link or add bots.",
	"lobby.waiters": "Waiting for a seat · {n}",
	"lobby.spectators": "Watching · {n}",
	"lobby.waiterRemoveAria": "Remove {name} from the queue",
	"lobby.waiterRemoveTitle": "Remove from queue",
	"lobby.inviteHint": "Send the link to friends — they'll join with a single tap.",
	"lobby.kickSeat.title": "Remove player?",
	"lobby.kickSeat.body": "{name} will lose their seat and return to the menu. The seat will free up for another guest or a bot.",
	"lobby.kickWaiter.title": "Remove from the queue?",
	"lobby.kickWaiter.body": "{name} will lose their place in the queue and return to the menu.",
	"lobby.kickConfirm": "Remove",
	"lobby.transfer.title": "Transfer host?",
	"lobby.transfer.body": "Control of the table passes to {name}: settings, seats and starting the game. You stay at the table.",
	"lobby.transfer.confirm": "Transfer",
	"seat.free": "Free seat",
	"seat.online": "online",
	"seat.offline": "offline",
	"seat.resigned": "resigned",
	"seat.host": "host",
	"seat.you": "you",
	"seat.waiting": "waiting",
	"seat.nameAria": "Your name at the table",
	"seat.nameSave": "Save name",
	"seat.nameCancel": "Cancel the name change",
	"seat.nameEditAria": "Change your name",
	"seat.nameEditTitle": "Change name",
	"seat.colorAria": "Player color: {color}",
	"seat.colorTitle": "Choose a color",
	"seat.colorLabel": "Seat color",
	"seat.transferAria": "Transfer host to {name}",
	"seat.transferTitle": "Transfer host",
	"seat.kickAria": "Remove player {name}",
	"seat.kickTitle": "Remove player",
	"chat.title": "Table chat",
	"chat.open": "Open the table chat",
	"chat.button": "Chat",
	"chat.close": "Close chat",
	"chat.hi": "Hi!",
	"chat.goodTable": "Nice table!",
	"chat.go": "Let's go",
	"wait.subtitle": "Table · no seats",
	"wait.position": "You are {place} in line. As soon as a seat frees up, you'll be seated automatically.",
	"wait.inQueue": "You're in line for a seat at the table.",
	"wait.queue": "Queue · {n}",
	"wait.atTable": "At the table",
	"wait.claim": "Take a seat",
	"wait.claimNone": "No free seats yet",
	"wait.claimOk": "Take the freed-up seat",
	"wait.leave": "Leave the queue",
	"wait.hint": "A seat is taken automatically as soon as someone leaves. The button is a fallback for delays.",
	"wait.now": "just now",
	"wait.sec": "{s}s",
	"wait.min": "{m} min",
	"wait.hour": "{h}h {m}min",
	"rules.title": "Rules",
	"rules.tabs": "Rules section",
	"rules.tab.base": "Base game",
	"rules.tab.continents": "Continents",
	"rules.tab.plants": "Plants",
	"rules.tab.fungi": "Grass and Mushrooms",
	"rules.tab.mutations": "Random Mutations",
	"rules.base.intro": "The base Russian “Evolution” (Pravilnye Igry, 2010). An 84-card deck, 2–4 players. The winner is the player whose population scores the most points after the final year.",
	"rules.base.year": "The turn of a year",
	"rules.base.dev": "Development.",
	"rules.base.dev.text": "Going around the table, play one card at a time: a new animal or a trait. Traits lie face up — everyone sees what everyone played. A double-sided card is played as one of its two sides. A parasite can only be placed on another player's animal. A pair card (symbiosis, cooperation, communication) is placed between two animals: one such card per pair, and no more than two per animal. Once you pass, you play no more cards this phase; the phase ends when everyone has passed.",
	"rules.base.food": "Food supply.",
	"rules.base.feed": "Feeding.",
	"rules.base.feed.text": "Your turn lasts until you press “End turn” yourself: a single action doesn't hand the turn over. In one turn you may attack with each of your carnivores and raid prey with each of your pirates, or take one food token; once you've eaten from the bank, hunting and stealing are closed for the turn. A fed animal doesn't use its traits: it doesn't attack, steal, trample, hibernate or burn fat — all it can do is put food into empty fat tissue. A grazer tramples once per turn and can combine that with eating. Converting fat is a free action. When no actions remain at all, the turn passes automatically. “Pass” removes you from the phase until it ends; the phase ends when the bank is empty, everyone is fed, everyone has passed, or nobody can act.",
	"rules.base.ext": "Extinction.",
	"rules.base.ext.text": "Unfed animals die. Draw: the number of survivors + 1. If you have none and your hand is empty — 6 cards. An empty deck means the final year.",
	"rules.base.score": "Scoring",
	"rules.base.score.text": "2 points for each surviving animal, 1 for each trait. Extras: carnivore and high body weight +1, parasite +2. Ties are broken by cards in the discard.",
	"rules.base.traits": "Base game traits",
	"rules.lbl.hand": "hand",
	"rules.lbl.trait": "trait",
	"rules.lbl.animal": "animal",
	"rules.lbl.token": "bank token",
	"rules.lbl.red": "red",
	"rules.lbl.blue": "blue",
	"rules.lbl.fat": "fat",
	"rules.lbl.extinct": "extinct",
	"rules.lbl.draw": "draw",
	"rules.lbl.dice": "Food supply dice",
	"rules.lbl.carnBonus": "+2 · +1 for the carnivore",
	"rules.lbl.parBonus": "+1 · +2 for the parasite",
	"rules.continents.intro": "The “Continents” expansion (Pravilnye Igry, 2012): 42 new trait cards. Enabled in the menu before a game — all base game rules remain in force.",
	"rules.cont.territories": "Territories.",
	"rules.cont.territories.text": "Animals live on Laurasia, in Gondwana and in the Ocean. When playing an animal, you pick its continent by clicking it; an animal can only enter the Ocean with the “Swimming” trait. In the Ocean, swimming is never removed: neoplasia can't switch it off. An animal can leave for a continent by migrating, and a paralyzed carnivore is simply washed ashore.",
	"rules.cont.bases": "Food banks.",
	"rules.cont.bases.text": "Each territory has its own bank: 2 players 8/7/5, three 11/10/7, four 14/13/9 (Laurasia/Gondwana/Ocean). Your first action of a turn binds you to one territory: after that you take food from its bank and play the animals standing there. A carnivore eats only in its own territory. Each “Edificator” adds 2 tokens to its territory's bank every year.",
	"rules.cont.pairs": "Paired cards.",
	"rules.cont.pairs.text": "Placed between two animals of the same territory. If the pair parts ways, the card goes to the discard.",
	"rules.cont.migration": "Migration.",
	"rules.cont.migration.text": "Declare a migration instead of a normal turn: no food, no hunting, only travel. Any number of your animals may migrate: from the Ocean to any continent, from a continent to the Ocean (swimmers only). There's no direct route between continents — a land animal on a continent has nowhere to go. After the move, each remora of the same area may follow the migrant at its owner's choice, resolved in turn order (in the Ocean, only swimmers).",
	"rules.cont.newTraits": "New traits.",
	"rules.cont.newTraits.text": "Herding: while herding animals in a territory equal or outnumber carnivores, they cannot be eaten. Nematocysts: the attacking carnivore cannot hunt, steal or migrate until the end of the feeding phase, and in the Ocean it's also washed ashore onto a continent. Regeneration: the animal eaten by a carnivore returns — in extinction its owner plays a card from their hand as a new animal, with no draw for it. Recombination (pair): once per year, during its owner's feeding turn, each partner gives the other one unpaired trait (a duplicate goes to the discard; a swimmer that loses “Swimming” in the Ocean moves to a continent). Neoplasia is a virus: played only on an opponent's animal, it rises every year at the start of food supply determination, disabling another unpaired trait (a disabled one doesn't work and gives no points); when there's nothing left to disable, the animal dies immediately. Viral traits (parasite, neoplasia) are marked purple.",
	"rules.cont.rescue": "Rescue.",
	"rules.cont.rescue.text": "A player with no cards and no animals takes 10 cards; two of them are immediately played as animals, one on each continent.",
	"rules.cont.traits": "Expansion traits",
	"rules.plants.intro": "The “Plants” expansion (Pravilnye Igry, 2016): 36 double-sided cards — a plant trait on one side, an animal trait on the other. Enabled in the menu before a game, compatible with “Continents”.",
	"rules.plants.base": "Food supply without dice.",
	"rules.plants.base.text": "This year's food sits on plants. In the food supply phase there's no roll: feeding starts right away. With “Continents”, plants stand on Laurasia and Gondwana, while the Ocean gets its bank by the usual rules. Plants are shared — they belong to nobody.",
	"rules.plants.feeding": "Feeding.",
	"rules.plants.feeding.text": "A token is taken from a plant onto an animal, but only if the animal can feed on it: a “Water Plant” feeds only swimmers, a “Root Vegetable” only burrowing animals, a “Tree” only high body weight ones. Carnivores eat only from plants with a fruit icon and from “Nutritious” ones. Instead of eating or attacking, an animal can claim a plant's shelter: the token protects from carnivores and carnivorous plants until the end of the phase. You can't pass while any of your animals can still get food or shelter.",
	"rules.plants.carnivorous": "Carnivorous plant.",
	"rules.plants.carnivorous.text": "Once per feeding phase: it counterattacks the animal taking food from it (the survivor still gets the token), or one of the players directs it at any animal a traitless carnivore could attack. Eats an animal — 2 tokens, gets a tail — 1, eats a poisonous one — dies in extinction.",
	"rules.plants.extinction": "Extinction.",
	"rules.plants.extinction.text": "Plants eaten to the ground die — except the annual (it survives) and plant parasites (they die only with their host). A micorrhiza link survives while at least one of its plants still has food. A fungus gets a token for every animal that died.",
	"rules.plants.growth": "Growth phase.",
	"rules.plants.growth.text": "Surviving plants grow by their schemes (perennial 1→2, 2→3, 3+→5 and so on), the liana gets as many tokens as there are non-liana plants on the table, shelters are restored, and new plants come out of the deck. With “Continents”, an edificator adds a token to each plant of its location.",
	"rules.plants.score": "Points.",
	"rules.plants.score.text": "Plants and their traits don't count toward scoring — points come only from animals and their traits.",
	"rules.plants.species": "Plant species",
	"rules.plants.traits": "Plant traits",
	"rules.plants.footnote": "Animal traits on the second sides of “Plants” cards come from the base game — see them in the “Base game” tab.",
	"rules.fungi.intro": "The “Grass and Mushrooms” expansion (Pravilnye Igry, 2019): 24 long flora cards (6 fungi and 6 grasses, 2 copies each), 8 consequence marks and 2 new animal traits. The year's food supply is all the red tokens on flora cards; flora is a full participant of the game and can win.",
	"rules.fungi.table": "The flora table.",
	"rules.fungi.table.text": "2 cards are open at the start; in the food supply phase, cards come out of the deck by player count (8 max on the table). A fungus enters play with 1 red token, grass with 3; a card holds at most 4 tokens. With “Continents”, flora lives on Laurasia and Gondwana, and the Ocean feeds by the usual rules.",
	"rules.fungi.feeding": "Feeding.",
	"rules.fungi.feeding.text": "Any animal can take tokens from any grass or fungus; taking one triggers the card's ability. “Communication” and “Grazing” work with flora cards. A consequence mark lands when a token is taken from a “marked” card — but only if the animal doesn't already have the same one, the mark is still on the table, and the animal has no “Tryn”. A carnivore that eats prey receives all its marks.",
	"rules.fungi.spread": "Fungal spread.",
	"rules.fungi.spread.text": "Every time an animal dies (in feeding and in extinction), 1 red token is placed on any fungus.",
	"rules.fungi.extinction": "Extinction.",
	"rules.fungi.extinction.text": "Unfed, poisoned animals and those with the “Poison” mark without an “Antidote” die. All tokens and marks are removed from survivors. Flora cards without tokens go to the discard; each surviving grass gets 1 token, and fungi only gain from animals dying.",
	"rules.fungi.score": "Points.",
	"rules.fungi.score.text": "“Grass and Mushrooms” plays for itself: 2 points for each surviving flora card and 1 for each token on it; on equal points, flora has the advantage.",
	"rules.fungi.cards": "Flora cards",
	"rules.fungi.marks": "Consequence marks",
	"rules.fungi.animalTraits": "Animal traits",
	"rules.mutations.intro": "The “Random Mutations” expansion (after the game of the same name by Pravilnye Igry, 2013): the hand of cards is gone — each player has a personal blind deck. In the development phase you first declare how you'll play the top card, and only then reveal it. Traits come at random, including harmful mutations (dark cards). Not compatible with “Grass and Mushrooms”: that expansion cannot be combined with “Random Mutations”.",
	"rules.mut.deck": "Personal deck.",
	"rules.mut.deck.text": "7 cards at the start, no peeking. On your development turn, declare one way to play it: (1) a new species — the card is played as an animal; (2) a trait — onto your species of one animal; (3) +1 animal to the species. With “Plants” you may also declare a plant trait — the card is revealed on the chosen plant.",
	"rules.mut.fate": "The trait's fate.",
	"rules.mut.fate.text": "If a trait can't be played on the chosen species, it moves to the neighboring species on the right; if it fits nowhere, it becomes a new mutant species itself. Harmful mutations are mandatory: you can't refuse them.",
	"rules.mut.population": "Species population.",
	"rules.mut.population.text": "A species can consist of several animals (marked “×N” on its card). Population can't exceed the number of your species; the exception is “Budding”. Food, hunting, hunger and poison act on animals one at a time: an attack removes one animal, not the whole species.",
	"rules.mut.draw": "Draw.",
	"rules.mut.draw.text": "At the end of a year: the number of animals + 2 cards to the bottom of your personal deck. When the shared stock runs out — the final year.",
	"rules.mut.score": "Points.",
	"rules.mut.score.text": "2 points for each animal (population counted), 1 for a trait and trait bonuses; metabolic syndrome gives 2 extra points.",
	"rules.mut.traits": "Expansion traits",
	"rules.mut.footnote": "The other traits in the blind deck come from the base game and the enabled expansions; see their rules in the respective tabs.",
	"rules.terr.laurasia": "The northern continent with the most generous bank: 8 tokens for two players, 11 for three, 14 for four.",
	"rules.terr.gondwana": "The southern continent: 7/10/13 tokens by player count. With “Plants” and “Grass and Mushrooms”, flora stands on both continents.",
	"rules.terr.ocean": "The world of water: only swimmers live here, bank 5/7/9 by player count. There's no way back: an animal can only leave the Ocean by migrating.",
	"rules.flora.fungus": "(fungus · enters with 1 token)",
	"rules.flora.grass": "(grass · enters with 3)",
	"rules.mark.line": "Mark “{name}” · 4 in the set",
	"stats.title": "Statistics",
	"stats.empty": "No games yet — statistics will appear after your first game.",
	"stats.games": "Games",
	"stats.wins": "Wins",
	"stats.winrate": "Win rate",
	"stats.best": "Best score",
	"stats.chart": "Points of recent games",
	"stats.chartGame": "Game {i}",
	"stats.chartScore": "Score",
	"stats.chartPoints": "{n} points",
	"stats.topTraits": "Favorite traits",
	"stats.history": "Game history",
	"stats.historyLast": " · last {n}",
	"stats.place": "{place} of {players}",
	"stats.mode.net": "online",
	"stats.mode.solo": "solo",
	"stats.modules": "{n} expansions",
	"stats.win": "win",
	"stats.achievements": "Achievements",
	"stats.achievementsOf": " · {got} of {total}",
	"final.kicker": "The end of evolution",
	"final.win": "Your population dominates",
	"final.lose": "You have been displaced",
	"final.show": "Show the game results",
	"final.collapseAria": "Collapse the results and view the table",
	"final.collapseTitle": "Collapse and view the table",
	"final.results": "Results",
	"final.resultsWin": " · win",
	"final.resultsPlace": " · {place}",
	"final.formula": "Points: 2 for each surviving animal, 1 for each trait plus trait bonuses. Discarded cards give no points — they only break ties.",
	"final.scoreAria": "Final score",
	"final.best": "best result",
	"final.showAll": "Show all",
	"final.stepHint": "The score reveals step by step",
	"final.total": "Total",
	"final.discard": "discard",
	"final.discardHint": "Discarded cards give no points — the engine uses them to break tied scores",
	"final.again": "Play again",
	"final.menu": "Back to menu",
	"final.leave": "Leave the table",
	"final.labels.animals": "animals",
	"final.labels.traits": "traits",
	"final.labels.extras": "bonus",
	"final.labels.flora.animals": "flora cards",
	"final.labels.flora.traits": "flora traits",
	"final.labels.flora.extras": "tokens on flora",
	"final.hints.animals": "2 points for each surviving animal; with “Mutations”, for each animal in population size",
	"final.hints.traits": "1 point for each active animal trait (disabled ones don't count)",
	"final.hints.extras": "Trait bonuses: carnivore and high body weight +1, parasite and metabolic syndrome +2",
	"final.hints.flora.animals": "2 points for each surviving flora card",
	"final.hints.flora.traits": "Plant traits give no points — by the expansion rules this is always 0",
	"final.hints.flora.extras": "1 point for each token on a surviving flora card",
	"final.defeat.sharedLead": "First place was shared by {n} players; you are {gap} points behind the leader",
	"final.defeat.behind": "You were beaten by {gap} points",
	"final.defeat.plain": "{lead}.",
	"final.defeat.discardTie": "Points are tied at {total}, but the discard broke the tie: the leader has {leader} cards to your {human}.",
	"final.defeat.flora": "The flora beat you by {gap} points: “{name}” — {leader} to your {human}.",
	"final.defeat.on.animals": "on animals",
	"final.defeat.on.traits": "on traits",
	"final.defeat.on.extras": "on trait bonuses",
	"final.defeat.due.animals": "animals",
	"final.defeat.due.traits": "traits",
	"final.defeat.due.extras": "trait bonuses",
	"final.defeat.fully": "{lead} — entirely due to {due}: {leader} to your {human}.",
	"final.defeat.mostly": "{lead}. The biggest advantage is {on}: {leader} to your {human}.",
	"tutorial.counter": "Tutorial · {i} of {n}",
	"tutorial.slidesAria": "Tutorial slides",
	"tutorial.slideAria": "Slide {k}: {title}",
	"tutorial.back": "Back",
	"tutorial.next": "Next",
	"tutorial.done": "Got it",
	"tutorial.phase.dev": "Development",
	"tutorial.phase.foodBase": "Food supply",
	"tutorial.phase.feed": "Feeding",
	"tutorial.phase.ext": "Extinction",
	"tutorial.s1.title": "How to play “Evolution”",
	"tutorial.s1.p1": "You breed species and guide them through hungry years. A year consists of four phases — they're shown in the table's header.",
	"tutorial.s1.p2": "The winner is the player whose population scores the most points after the final year: 2 points for each animal of a species and 1 point for each trait.",
	"tutorial.s1.p3": "A game takes 10–20 minutes: pick the number of players, bot difficulty and expansions — and off you go.",
	"tutorial.s2.title": "Development",
	"tutorial.s2.p1": "Play one card per round: as a new animal or as a trait on your species. A double-sided card is one of its two traits, your choice.",
	"tutorial.s2.p2": "Highlighting shows where a card can be placed; hovering a trait chip opens its rule. Paired traits (symbiosis, cooperation) are placed between two animals.",
	"tutorial.s2.p3": "When everyone has passed, the phase ends.",
	"tutorial.s3.title": "Feeding",
	"tutorial.s3.p1": "The food supply is rolled with dice — those are the red tokens. Feed your animals to requirement: click the highlighted card or the “Take food” button.",
	"tutorial.s3.p2": "Carnivores take blue tokens from prey, and “fat tissue” stores food for a hungry year. A fed animal no longer uses its traits.",
	"tutorial.s3.p3": "The phase goes around while there's food and willing players: one turn lasts until you press “End turn”.",
	"tutorial.s4.title": "Hunting",
	"tutorial.s4.p1": "The “Hunt” button on a carnivore highlights valid prey: high body weight is off-limits, water dwellers only in the ocean, herding defends by numbers.",
	"tutorial.s4.p2": "Prey can escape: “Running” rolls a die, camouflage hides, tail loss sheds a tail. Eaten prey gives the carnivore +2 blue tokens.",
	"tutorial.s4.p3": "Defend in time — the table itself asks you with a modal window when you're attacked.",
	"tutorial.s5.title": "Extinction and the finale",
	"tutorial.s5.p1": "Unfed animals die; for the survivors you draw cards from the deck. When the deck is empty, the final year begins.",
	"tutorial.s5.p2": "In the finale, points are counted from living animals, traits and bonuses: carnivore and high body weight give extra.",
	"tutorial.s5.p3": "Each player's score is visible on their scoreboard next to the discard — keep an eye on the gap.",
	"sound.settings": "Sound settings",
	"sound.off": "Sound is off — open settings",
	"sound.quiet": "Sound is muted — open settings",
	"sound.on": "Sound is on — open settings",
	"sound.toggle": "Sound",
	"sound.sfx": "Effects",
	"sound.ambient": "Ambient",
	"sound.test": "Test",
	"traitTip.extraFood": "+{n} food",
	"traitTip.score": "+{n} pts",
	"traitTip.pair": "pair",
	"traitTip.disabled": "disabled",
	"card.animal": "Animal",
	"card.carnivore": "Carnivore",
	"card.obligateCarnivore": "Obligate Carnivore",
	"card.water": "Water animal",
	"card.noTraits": "no traits",
	"card.shelter": "shelter",
	"card.sedated": "sedated",
	"card.paralyzed": "Paralyzed",
	"card.hibernating": "asleep",
	"card.fed": "fed",
	"card.hungry": "hungry",
	"card.pair": "pair",
	"card.card": "Card",
	"card.foodTitle": "Food {food} / {need}",
	"card.foodBlue": " · blue {n}",
	"card.foodFat": " · fat {n}",
	"card.redToken": "Red token",
	"card.blueToken": "Blue token",
	"card.fatToken": "Fat",
	"card.popTitle": "Species population: {n}",
	"card.shelterTitle": "In a plant shelter: carnivores and carnivorous plants won't touch it until the end of the feeding phase",
	"card.sedatedTitle": "Fed from a medicinal plant: fed, but its traits don't work until the end of the feeding phase",
	"card.noFood": "no food",
	"card.plant": "plant",
	"card.fungus": "fungus",
	"card.grass": "grass",
	"card.newPlant": "new plant",
	"card.foodTokens": "Food tokens: {n} (max {m})",
	"card.sheltersFree": "Free shelters: {n}",
	"card.carnivoreEdible": "Carnivores may take food from this plant",
	"card.plantAttacked": "attacked",
	"card.plantAttackedTitle": "This carnivorous plant has already attacked this year",
	"card.markLabel": "“{name}” mark",
	"card.givesMark": "Gives the “{name}” mark",
	"card.floraDeck": "deck {n} · discard {m}",
	"card.plantDeck": "deck {n} · died {m}",
	"card.floraCommon": "Grass and Fungi · shared",
	"card.plantsCommon": "Plants · shared",
	"card.floraZone": "{zone} flora",
	"card.plantsZone": "{zone} plants",
	"card.floraStrip": "Grass and Fungi",
	"card.plantsStrip": "Plants",
	"card.floraStripZone": "Grass and Fungi ({zone})",
	"card.plantsStripZone": "Plants ({zone})",
	"card.extraFoodNeed": "+{n} food requirement",
	"card.renameAria": "Rename animal",
	"card.renameInput": "Animal name (up to 24 characters)",
	"card.renameSave": "Save animal name",
	"card.renameCancel": "Cancel renaming",
	"phase.development": "Development",
	"phase.foodBank": "Food Bank",
	"phase.feeding": "Feeding",
	"phase.extinction": "Extinction",
	"phase.growth": "Growth",
	"phase.gameOver": "Results",
	"game.year": "Year",
	"game.yearN": "Year {year}",
	"game.yearLast": "final",
	"game.turnYour": "Your turn",
	"game.turnCardSub": "Year {year} · {phase}",
	"game.madBanner": "Madness: a bot controls your animals this round — the neighbor does not participate (neighbor control is not yet implemented in the online version)",
	"game.lastYearBanner": "The final year — the game ends after this round",
	"game.openingFinal": "Opening the final table…",
	"game.reconnecting": "Reconnecting…",
	"game.opening": "Opening the table…",
	"game.spectBadge": "You are watching · reactions available",
	"game.spectDock": "Spectator mode: actions unavailable",
	"game.layoutWide": "Wide table layout",
	"game.layoutCozy": "Compact table layout",
	"game.logButton": "Journal & chat",
	"game.logButtonUnread": "Journal & chat, {n} new entries",
	"game.unreadCount": "New entries: {n}",
	"game.leaveButton": "Leave the table",
	"game.achievementToast": "Achievement: {name}",
	"game.wait.oceanBank": "Determining the Ocean food bank…",
	"game.wait.diceThrown": "The dice are cast — the food bank is being determined…",
	"game.wait.roll": "Rolling the food bank…",
	"game.wait.extinction": "Extinction: unfed animals die…",
	"game.wait.growth": "Growth: plants spread and new ones appear…",
	"game.wait.madness": "Madness: {name}'s round is played by a bot (neighbor control is not yet implemented in the online version)…",
	"game.wait.actor": "{name} is playing…",
	"game.wait.waiting": "Waiting",
	"game.yourPopulation": "Your population",
	"game.noAnimals": "No animals",
	"game.placeFromHand": "Place an animal from your hand",
	"game.acting": "playing",
	"game.deckCount": "deck {n}",
	"game.handCount": "hand {n}",
	"game.discardCount": "discard {n}",
	"game.scoreLabel": "score",
	"game.blindDeckTitle": "Blind deck: {n}",
	"game.scoreTitle": "Current score: 2 for each animal of the species + 1 per trait and its bonus",
	"game.seatColor": "Seat color",
	"game.territoryEmpty": "empty",
	"game.territoryEmptyOcean": "empty (needs swimming)",
	"game.placeOn": "Place on {name}",
	"game.clickToPlace": "click to place on “{name}”",
	"game.pairNo": "#{n}",
	"game.pairPartner": "partner",
	"game.pairWith": "with {no}",
	"game.symbiontFor": "symbiont for {no}",
	"game.symbiontIs": "symbiont — {no}",
	"game.symbiontPlate": "symbiont {a} → {b}",
	"game.pairPlate": "{a} ↔ {b}",
	"game.foodBankLower": "food bank",
	"game.oceanBankLower": "ocean food bank",
	"game.growthBanner": "Growth: plants are spreading",
	"game.extinctionNone": "Extinction: nobody dies",
	"game.extinctionN": "Extinction: {n} animals die",
	"game.tableFoodTitle": "This year's food is on the table — take tokens from the plants and flora cards",
	"game.plantsFoodTitle": "This year's food is on the plants — take tokens from them",
	"game.floraFoodTitle": "This year's food is on the grass and fungi",
	"game.plantsTokens": "tokens on {n} plants · shelters {m}",
	"game.floraTokens": "tokens on {n} grass and fungi cards",
	"game.territoryBankTitle": "“{name}” food bank",
	"game.oceanBankHint": "The Ocean food bank — on the continents the food is on the plants",
	"game.bankHint": "Food bank tokens — take one per feeding turn",
	"game.bankHintIdle": "Food bank",
	"game.oceanEmpty": "the ocean is empty",
	"game.bankEmpty": "the bank is empty",
	"game.turnOf": "Turn: {name}",
	"game.diceRolling": "rolling…",
	"game.diceBonus": "+{n} to the bank",
	"game.diceTerritory": "territory bank",
	"game.diceAria": "Food bank dice: {dice}",
	"game.bankChip": "Bank",
	"game.timerHuman": "Your turn will end on its own in {n}s — you have no actions left",
	"game.timerOther": "{name} has no actions left: their turn ends in {n}s",
	"game.reactions": "Reactions",
	"game.reactionOf": "Reaction {emoji}",
	"game.reactionCount": "Reaction {emoji}: {n}",
	"game.addReaction": "Add a reaction",
	"game.reactionTitle": "Reaction",
	"game.cheerTitle": "Cheer the players",
	"fx.attack": "Attack!",
	"fx.preyEaten": "prey eaten +2 blue",
	"fx.tail": "− tail",
	"fx.die": "die {n}",
	"fx.mimicry": "mimicry →",
	"fx.redFood": "+1 red",
	"fx.piracy": "piracy +1 blue",
	"fx.cooperation": "cooperation +1 blue",
	"fx.scavenger": "scavenger +1 blue",
	"fx.fat": "fat → blue",
	"fx.blue": "+1 blue",
	"fx.bankBurn": "−{n} bank",
	"fx.plantFood": "+1 from a plant",
	"fx.shelter": "in shelter",
	"fx.plantCounter": "the plant counterattacks!",
	"fx.plantAttack": "carnivorous plant!",
	"fx.growth": "growth {from}→{to}",
	"fx.graze": "− trample",
	"fx.plantDied": "☠ plant",
	"fx.honeyCard": "+1 card (honey plant)",
	"fx.floraFood": "+1 from flora",
	"fx.fungusGrowth": "fungus {from}→{to}",
	"fx.floraDied": "☠ flora",
	"fx.mark": "mark: {mark}",
	"fx.handLost": "hand discarded (insight)",
	"fx.cardsOne": "+{n} card",
	"fx.cardsFew": "+{n} cards",
	"fx.cardsMany": "+{n} cards",
	"fx.mutTrait": "“{trait}”",
	"fx.mutAnimal": "new species",
	"fx.mutMutant": "mutant species",
	"fx.mutPopulation": "+1 animal",
	"fx.mutPlantTrait": "“{trait}” on a plant",
	"fx.mutDiscarded": "to the discard",
	"dnd.start": "Picked up a card. Drop it on a valid target.",
	"dnd.over": "Target under the card.",
	"dnd.end": "Card dropped.",
	"dnd.cancel": "Drag cancelled.",
	"dock.turnOpponent": "Opponent's turn",
	"dock.turnOpponentCards": "Opponent's turn — the cards stay with you",
	"dock.dev.placeAnimal": "Choose a territory on the table — the animal will be placed there",
	"dock.dev.plantTrait": "Choose a plant for the trait",
	"dock.dev.plantPairFirst": "Micorrhiza: choose the first plant",
	"dock.dev.plantPairSecond": "The second plant of the micorrhiza",
	"dock.dev.trait": "Choose an animal for the trait",
	"dock.dev.pairFirst": "Paired trait: choose the first animal",
	"dock.dev.pairSecond": "The second animal of the pair",
	"dock.dev.pairProgress": "Selected {no} → eligible partners: {n}",
	"dock.dev.cardOrTrait": "The card as an animal or a trait",
	"dock.dev.cardOrTraitCont": "The card as an animal (then click a continent) or a trait",
	"dock.dev.needAnimalFirst": "Place an animal first — traits go on it",
	"dock.dev.faceBlocked": "This face can't be played right now",
	"dock.endDev": "End development",
	"dock.endDevTitle": "End development: your turn in this round is over",
	"dock.cancelTitle": "Cancel the selection (Esc)",
	"dock.mut.chooseTrait": "Choose your single-animal species — the card flips onto it",
	"dock.mut.choosePop": "Choose a species — the card becomes +1 animal",
	"dock.mut.choosePlant": "Choose a plant — the card flips onto it as a trait",
	"dock.mut.declare": "Declare how to play the top card of the deck — then it flips",
	"dock.mut.deckTitle": "Blind deck: {n}",
	"dock.mut.deckAria": "Deck: {n}",
	"dock.mut.newSpecies": "New species",
	"dock.mut.cardAsAnimal": "the card becomes an animal",
	"dock.mut.trait": "Trait",
	"dock.mut.traitHint": "onto a single-animal species",
	"dock.mut.pop": "+1 animal to a species",
	"dock.mut.popHint": "population ≤ number of species",
	"dock.mut.plantTrait": "Plant trait",
	"dock.mut.plantTraitHint": "if the deck has such a face",
	"dock.feed.oceanChip": "Ocean",
	"dock.feed.take": "Take food",
	"dock.feed.shelter": "Shelter",
	"dock.feed.shelterTitle": "Take the plant's shelter: protection from carnivores until the end of the feeding phase",
	"dock.feed.plantAttack": "Carnivorous plant",
	"dock.feed.plantAttackTitle": "Direct the carnivorous plant at a victim (once per phase)",
	"dock.feed.parasitize": "To the parasite",
	"dock.feed.parasitizeTitle": "Move a token from the host plant to the plant parasite",
	"dock.feed.hunt": "Hunt",
	"dock.feed.pirate": "Piracy",
	"dock.feed.hibernation": "Hibernation",
	"dock.feed.fat": "Fat",
	"dock.feed.graze": "Trample",
	"dock.feed.migrate": "Migration",
	"dock.feed.endTurn": "End turn",
	"dock.feed.skip": "End feeding",
	"dock.feed.skipHungryTitle": "End feeding: {n} animals unfed",
	"dock.feed.skipFedTitle": "End feeding: all animals are fed",
	"dock.feed.skipHint": "End feeding is unavailable — there is food or shelters to take",
	"dock.feed.skipHintTitle": "While at least one of your animals can still get food or a shelter, ending the feeding phase is not allowed (“Plants” rules)",
	"dock.feed.skipConfirmTitle": "End feeding?",
	"dock.feed.skipConfirmOne": "{n} animal is unfed. It dies in the extinction phase.",
	"dock.feed.skipConfirmMany": "{n} animals are unfed. They die in the extinction phase.",
	"dock.feed.skipConfirmFed": "All animals are fed. End feeding?",
	"dock.feed.backToTurn": "Back to the turn",
	"dock.feed.rageBanner": "Rage: the animal must attack — choose a victim",
	"dock.feed.rageAttack": "Rage attack",
	"dock.feed.rageNoTarget": "No valid victim — end your turn",
	"hint.take": "Choose an animal — it takes a food token",
	"hint.takePlant": "Choose an animal, then a plant with food",
	"hint.takeFlora": "Choose an animal, then a flora card",
	"hint.shelter": "Choose an animal, then a plant for the shelter",
	"hint.hunt": "Choose the carnivore that hunts",
	"hint.pirate": "Choose the pirate that steals food",
	"hint.plantAttack": "Choose the carnivorous plant",
	"hint.parasitize": "Choose the plant parasite, then its host",
	"hint.hibernate": "Choose the animal that hibernates until the end of the year",
	"hint.fat": "Choose an animal with fat tissue",
	"hint.graze": "Choose an animal to graze on a plant",
	"hint.target": "Choose a victim — targets are marked red",
	"defense.title": "{attacker} attacks {prey}",
	"defense.need": "Needs {need} food, has {food}. Choose a defense.",
	"defense.running": "Running — a dice roll",
	"defense.mimicry": "Redirect to {target}",
	"defense.mimicryHint": "Mimicry: the current victim escapes this attack; the selected animal becomes the new target and may die.",
	"defense.tailLoss": "Drop the tail",
	"defense.tailDiscard": "Sacrifice the tail: discard “{trait}”",
	"defense.none": "Don't defend",
	"defense.plantIgnore": "Counterattack: choose one defense to ignore",
	"defense.ignore": "Ignore: {trait}",
	"log.plantIgnoreDefense": "The counterattack ignores {trait}.",
	"leave.title": "Leave the table?",
	"leave.bodySpectator": "You are watching this table. Return to the menu?",
	"leave.bodyPlayer": "Resigning means your turns are skipped, your animals starve, and the seat stays yours until the final score. If you just leave, the game pauses at your turn until you return via the link.",
	"leave.confirmSpectator": "Leave the table",
	"leave.confirmPlayer": "Resign and leave",
	"leave.stay": "Stay",
	"leave.justLeave": "Just leave (without resigning)",
	"feed.title.default": "Journal",
	"feed.filter.all": "All",
	"feed.filter.log": "Events",
	"feed.filter.chat": "Chat",
	"feed.filter.spectators": "Spectators",
	"feed.filterGroup": "Feed filter",
	"feed.empty": "Nothing yet.",
	"feed.emptyTitle": "Nothing yet",
	"feed.newEntries": "new",
	"feed.showNew": "Show new entries: {n}",
	"feed.collapse": "Collapse “{title}”",
	"feed.expand": "Expand “{title}”",
	"feed.expandUnread": "Expand “{title}”, {n} new entries",
	"feed.entries": "{title}: entries",
	"feed.typingOne": "{name} is typing…",
	"feed.typingTwo": "{a}, {b} are typing…",
	"feed.typingMany": "Several players are typing…",
	"feed.quickPhrases": "Quick phrases",
	"feed.diceButton": "Roll a die into the chat",
	"feed.placeholder": "Message…",
	"feed.messageAria": "Chat message",
	"feed.send": "Send message",
	"chat.qp.hi": "Hi!",
	"chat.qp.goodMove": "Nice move!",
	"chat.qp.yourTurn": "Your move",
	"chat.qp.thanks": "Thanks!",
	"spot.mimicry": "Mimicry",
	"spot.bankFood": "Food for this year: {n}",
	"spot.preyKilled": "Prey killed",
	"spot.eats": "{a} eats {b}",
	"spot.triesRun": "{a} tries to run away",
	"spot.escaped": "Escaped!",
	"spot.caught": "The predator caught it!",
	"spot.survives": "{a} survives",
	"spot.mimicryNote": "The attack is redirected to another animal",
	"spot.counterattack": "Plant counterattack",
	"spot.plantStrikes": "The plant strikes the attacker",
	"spot.plantCatches": "The plant catches {a}",
	"spot.paralysis": "Paralysis",
	"spot.cannotAttack": "{a} cannot attack this year",
	"spot.diedOneNoStarve": "An animal died — not of hunger",
	"spot.diedOneStarve": "An animal died of hunger",
	"spot.diedMany": "Animals died: {n}",
	"spot.diedManyStarve": "Animals died: {n} (of hunger — {m})",
	"spot.skip": "Skip",
	"spot.clickHint": "click the card to continue",
	"spot.dieAria": "Die: {dice}",
	"spot.animal": "an animal",
	"tableNote.joined": "{name} joined the table",
	"tableNote.lostConnection": "{name} lost connection",
	"tableNote.back": "{name} is back at the table",
	"tableNote.resigned": "{name} resigned — their turns are skipped",
	"tableNote.left": "{name} left the table",
	"tableNote.queued": "{name} joined the queue",
	"tableNote.unqueued": "{name} left the queue",
	"tableNote.watching": "{name} is watching the table",
	"netErr.kicked": "You were removed from the table",
	"netErr.seatTaken": "Your seat no longer exists — you were probably removed or the table closed",
	"netErr.roomGone": "The table no longer exists",
	"netErr.roomGoneCheck": "Table not found — check the code",
	"netErr.moveIllegal": "This move is not allowed right now",
	"netErr.resigned": "You resigned — your turns are skipped automatically",
	"netErr.notPlaying": "The game is not in progress",
	"netErr.reorderPhase": "Animals can't be rearranged right now",
	"netErr.reorderTurn": "Animals can be rearranged only on your turn (another player is playing now)",
	"netErr.reorderOwner": "You can rearrange only your own animals",
	"netErr.renamePhase": "Animals can't be renamed right now",
	"netErr.renameTurn": "Animals can be renamed only on your turn (another player is playing now)",
	"netErr.renameOwner": "You can rename only your own animals",
	"netErr.renameLength": "Animal name is up to 24 characters",
	"netErr.colorTaken": "This color is already taken — choose another one",
	"netErr.chatEmpty": "The message is empty",
	"netErr.rateLimit": "Too many messages — wait a minute",
	"netErr.rateFast": "Too fast — wait a second",
	"netErr.reactionLimit": "Too many reactions — wait a minute",
	"netErr.reactionMissing": "The message was not found at this table",
	"netErr.probeLimit": "Too many attempts — wait",
	"netErr.entryLimit": "Too many connections — wait a minute",
	"netErr.createLimit": "Too many tables created — try later",
	"netErr.notInQueue": "You are no longer in this table's queue",
	"netErr.startedWithoutYou": "The game started without you",
	"netErr.passwordRequired": "This table is private — enter the password",
	"netErr.passwordWrong": "Wrong table password",
	"netErr.passwordFormat": "The table password is 4 digits",
	"netErr.queueFull": "The queue for this table is full — try later",
	"netErr.hostOnly": "Only the host can do this",
	"netErr.lobbyOnly": "This can be done before the game starts",
	"netErr.gameStarted": "The game has already started",
	"netErr.gameFinished": "The game is already over",
	"netErr.gameRunning": "The game is not over yet",
	"netErr.seatsUnfinished": "Fill all the seats — with players or bots",
	"netErr.noFreeSeats": "No free seats yet",
	"netErr.seatRace": "The seat was just taken — try again",
	"netErr.retry": "The table changed, try again",
	"netErr.noSession": "The table session is already closed",
	"net.waitNote.capacityShrunk": "The host reduced the number of seats — you are in the queue",
	"log.mutationsIntro": "Random Mutations: every player gets a personal deck of 7 cards.",
	"log.firstTurn": "Year 1. {name} plays first.",
	"log.newPlant": "New plant: {plant}.",
	"log.newPlantZone": "New plant: {plant} ({zone}).",
	"log.plantDeckEmpty": "The plant deck is empty — no new plants.",
	"log.newFlora": "New flora card: {flora}.",
	"log.newFloraZone": "New flora card: {flora} ({zone}).",
	"log.floraDeckEmpty": "The grass and fungi deck is empty — no new cards.",
	"log.markGained": "{name}: the animal gets the “{mark}” mark.",
	"log.traitDiscarded": "The “{trait}” trait goes to the discard.",
	"log.commTakeBank": "Communication: {name} takes food from the bank. Bank: {bank}.",
	"log.coopBlue": "Cooperation: {name} gets 1 blue token.",
	"log.scavengerBlue": "Scavenger {name} gets 1 blue token.",
	"log.plantEats": "The carnivorous plant eats {name}'s animal ({value} pts).",
	"log.preyPoisonousPlant": "The prey was poisonous — the plant dies in extinction.",
	"log.lostAnimal": "{name}: the species loses an animal ({left} left).",
	"log.regenerates": "The eaten one's traits regenerate — the owner will bring them back as animals.",
	"log.insectivore": "Insectivore: traitless prey — 1 blue token instead of two.",
	"log.hunterPoisoned": "Carnivore {name} is poisoned and dies in extinction.",
	"log.paralyzedAshore": "The carnivore is paralyzed in the Ocean — washed ashore onto a continent.",
	"log.paralyzed": "Carnivore {name} is paralyzed by nematocysts.",
	"log.obligateFed": "{name}: the obligate carnivore is fed by its prey.",
	"log.rageKills": "{name}'s enraged animal kills {target}'s animal ({value} pts) — it doesn't eat the prey.",
	"log.huntSuccess": "{name} hunts: {target} loses an animal ({value} pts).",
	"log.animalPlaced": "{name} places a new animal.",
	"log.animalPlacedZone": "{name} places a new animal ({zone}).",
	"log.traitToOpponent": "{name}: {trait} → another player's animal {target}.",
	"log.traitPlaced": "{name}: trait {trait}.",
	"log.pairPlaced": "{name} links two animals: {trait}.",
	"log.passed": "{name} passes.",
	"log.simplificationSplit": "{name}: “Simplification” — “{trait}” separates as a new species.",
	"log.simplificationAnimal": "{name}: “Simplification” — the card becomes a new species.",
	"log.mutantSpecies": "{name}: “{trait}” fits no species — a new mutant species appears.",
	"log.cardAsAnimal": "{name}: the card becomes a new species (the “{trait}” trait can't be played).",
	"log.harmfulMutation": "{name}: harmful mutation — “{trait}” on their own species!",
	"log.mutation": "{name}: mutation “{trait}”.",
	"log.mutationMoved": "{name}: “{trait}” didn't fit the species — it moved to the neighbor.",
	"log.mutateAnimal": "{name}: a new species is declared — a card from the deck becomes an animal.",
	"log.extremophileDiscard": "“Extremophile”: an extra card goes to the discard.",
	"log.mutatePopulation": "{name}: the species gets +1 animal (population {pop}).",
	"log.budding": "{name}: “Budding” — the species grows to {pop} animal(s).",
	"log.plantParasite": "{name}: plant parasite on {plant}.",
	"log.plantTrait": "{name}: trait {trait} → {plant}.",
	"log.micorrhiza": "{name}: micorrhiza links {plant} and {plant2}.",
	"log.feedPlantsFungi": "Feeding: this year's food is on the plants, grass and fungi.",
	"log.feedPlants": "Feeding: this year's food is on the plants.",
	"log.feedFungi": "Feeding: this year's food is on the grass and fungi.",
	"log.bankStart": "Determining the food bank.",
	"log.oceanBank": "Ocean: food bank {bank}. On the continents the food is on the flora table.",
	"log.basesRoll": "Food banks — Laurasia {l}, Gondwana {g}, Ocean {o}.",
	"log.diceBank": "Food bank dice: {dice}{extra} = {food}.",
	"log.oceanBankPlantsFungi": "Ocean: food bank {bank}. On the continents the food is on the flora table (plants and grass with fungi).",
	"log.oceanBankPlants": "Ocean: food bank {bank}. On the continents the food is on the flora table (plants).",
	"log.oceanBankFungi": "Ocean: food bank {bank}. On the continents the food is on the flora table (grass and fungi).",
	"log.bases": "Food banks: Laurasia {l}, Gondwana {g}, Ocean {o}.",
	"log.bank": "Food bank: {bank}.",
	"log.rage": "Rage: {name}'s animal must attack this round!",
	"log.madness": "Madness: {name}'s round is played by a bot (neighbor control is not yet implemented in the online version).",
	"log.takeBank": "{name} takes food from the bank ({left} left).",
	"log.medicinal": "{name}: medicinal plant — the animal is fed, its traits don't work until the end of the phase.",
	"log.takePlant": "{name}: a token from the {plant} ({left} left).",
	"log.nutritious": "Nutritious plant: one more token.",
	"log.commTakePlant": "Communication: {name} takes a token from the same plant.",
	"log.honeyPlant": "Honey plant: {name} draws a card from {target}.",
	"log.plantCounter": "The carnivorous plant counterattacks {name}!",
	"log.takeFlora": "{name}: a token from the {flora} card ({left} left).",
	"log.commTakeFlora": "Communication: {name} takes a token from the same flora card.",
	"log.cleanser": "Cleansing grass: {name} keeps one token, the rest are removed.",
	"log.cleanserMarks": "Cleansing grass: {name} keeps one token, the rest are removed, marks removed: {marks}.",
	"log.insight": "Mushroom of Insight: {name} discards their whole hand ({lost} cards).",
	"log.soaringDrop": "Soaring Mushroom: {dropped} paired traits go to the discard.",
	"log.soaringFood": "Soaring Mushroom: the animal gets 1 blue token.",
	"log.passionflower": "Passionflower: the “{trait}” trait becomes a new animal of {name}.",
	"log.barkBeetle": "{name}: “Bark Beetle” — the shelter turns into a blue food token.",
	"log.shelter": "{name}: the animal hides in a shelter ({plant}).",
	"log.plantAttack": "{name} directs the carnivorous plant at {target}'s animal!",
	"log.parasiteFeed": "{name}: a token moves to the plant parasite.",
	"log.rageAttack": "{name}'s enraged animal attacks!",
	"log.hunt": "{name} attacks {target}'s animal!",
	"log.piracy": "{name} steals from {target}.",
	"log.hibernation": "{name} uses hibernation.",
	"log.endTurn": "{name} ends the turn.",
	"log.fat": "{name} spends fat tissue ({n}). The turn continues.",
	"log.grazeFlora": "{name}: trampling destroys a token from the {flora} card ({left} left).",
	"log.grazePlant": "{name}: trampling destroys a token from the {plant} ({left} left).",
	"log.grazeBank": "{name}: trampling destroys {burned} food. Bank: {bank}.",
	"log.migrate": "{name} declares a migration ({count} animal(s)).",
	"log.pairSplit": "The paired trait of animals that moved apart goes to the discard.",
	"log.runningEscape": "Running: rolled {roll} — the animal escaped!",
	"log.runningCaught": "Running: rolled {roll} — the predator caught up.",
	"log.runningCaughtPlant": "Running: rolled {roll} — the plant got it.",
	"log.mimicry": "Mimicry redirects the attack.",
	"log.mimicryPlant": "Mimicry redirects the plant's attack.",
	"log.tailLoss": "Tail loss: the animal survived, the predator got 1 token.",
	"log.tailLossRage": "Tail loss: the animal survived — the enraged one gets no token.",
	"log.tailLossPlant": "Tail loss: the animal survived, the plant got 1 token.",
	"log.banksBurned": "The remains of the food banks ({total}) burn away.",
	"log.bankBurned": "The rest of the food bank ({bank}) burns away.",
	"log.starved": "{name}'s species loses {deficit} animal(s) to hunger ({left} left).",
	"log.poisonDeath": "{name}'s species loses an animal to poison ({left} left).",
	"log.diedPoison": "Carnivore {name} dies of poison.",
	"log.diedPoisonMark": "{name}'s animal dies from the “Poison” mark.",
	"log.diedStarved": "{name}'s animal goes extinct — unfed.",
	"dock.feed.follow": "Your {follower} → follow {migrant}",
	"dock.feed.finishMigration": "Leave remaining remoras",
	"dock.feed.finishMigrationHint": "Finishing the selection declines the remaining follows. Your remaining remoras stay where they are; those already selected have moved.",
	"dock.feed.recombine": "Recombination: choose an exchange",
	"log.recombine": "Recombination: the animals exchange traits.",
	"log.neoplasiaDeath": "Neoplasia consumes {name}'s animal entirely.",
	"log.neoplasiaDisable": "Neoplasia disables the “{trait}” trait.",
	"log.floraDiscarded": "The {flora} card with no tokens goes to the discard.",
	"log.edificatorFloraLaurasia": "The edificator fertilizes the flora of Laurasia.",
	"log.edificatorFloraGondwana": "The edificator fertilizes the flora of Gondwana.",
	"log.floraGrowth": "Flora: grass grows, empty cards go to the discard.",
	"log.plantDiedPoison": "The {plant} dies — it ate a poisonous animal.",
	"log.plantDiedHost": "The {plant} dies — together with its host.",
	"log.plantDiedEaten": "The {plant} dies — eaten to the last token.",
	"log.edificatorPlantsLaurasia": "The edificator fertilizes the plants of Laurasia.",
	"log.edificatorPlantsGondwana": "The edificator fertilizes the plants of Gondwana.",
	"log.plantsGrowth": "Growth phase: the plants spread.",
	"log.regenerated": "{name} restores the regenerated animal.",
	"log.newYear": "Year {year}. {name} plays first. Deck: {deck}.",
	"log.newYearLast": "Year {year} — the final one. {name} plays first.",
	"log.floraWin": "Victory: Grass and Fungi ({total} points).",
	"log.draw": "Draw: {names}.",
	"log.win": "Victory: {name} ({total} points).",
	"feedBlock.rageHuntOnly": "This is a rage turn: only the enraged animal can attack.",
	"feedBlock.rageOther": "This is a rage turn — other actions are unavailable.",
	"feedBlock.tookFood": "Food from the bank was already taken this turn.",
	"feedBlock.afterCombat": "After hunting or piracy, red tokens can't be taken from the bank.",
	"feedBlock.shelterBlocksFood": "The shelter takes up the turn — no taking food.",
	"feedBlock.migratedFood": "The turn was spent on migration — no taking food.",
	"feedBlock.noAnimals": "The player has no animals.",
	"feedBlock.plantsFoodYear": "This year the food is on the plants — the food bank is not in play.",
	"feedBlock.obligateOnly": "An obligate carnivore feeds only on prey.",
	"feedBlock.allFed": "All animals are fed.",
	"feedBlock.noBankFood": "The food bank of this territory has no food.",
	"feedBlock.afterFoodNoHunt": "After taking food, the carnivore doesn't hunt.",
	"feedBlock.shelterBlocksHunt": "The shelter takes up the turn — no hunting.",
	"feedBlock.migratedHunt": "The turn was spent on migration — no hunting.",
	"feedBlock.huntersFed": "The carnivores are fed or can't hunt.",
	"feedBlock.noHunter": "No hungry carnivore.",
	"feedBlock.huntersUsed": "All carnivores have already attacked this turn.",
	"feedBlock.noPrey": "No prey available for an attack.",
	"feedBlock.afterFoodNoPiracy": "After taking food, the pirate doesn't steal.",
	"feedBlock.shelterBlocksPiracy": "The shelter takes up the turn — piracy is unavailable.",
	"feedBlock.migrated": "The turn was spent on migration.",
	"feedBlock.continentsOff": "The Continents module is not enabled.",
	"feedBlock.noRecombination": "No recombination pair with an available exchange.",
	"feedBlock.recombined": "The exchange was already made this year.",
	"feedBlock.noPirate": "No animal with Piracy that can take food.",
	"feedBlock.piratesFed": "The pirates are fed — nothing to steal.",
	"feedBlock.piracyUsed": "Piracy has already been used this turn.",
	"feedBlock.noPiracyTarget": "No animal with food to steal from.",
	"feedBlock.hibernationUsed": "Hibernation has already been used this turn.",
	"feedBlock.hibernationLastYear": "Hibernation is unavailable in the final year.",
	"feedBlock.noSleeper": "No animal with Hibernation.",
	"feedBlock.sleptLastYear": "The animal already slept last year.",
	"feedBlock.plantsOff": "The “Plants” module is not enabled.",
	"feedBlock.afterFoodNoShelter": "The turn is already taken by food — the shelter is unavailable.",
	"feedBlock.afterCombatNoShelter": "After combat the shelter is unavailable.",
	"feedBlock.shelterUsed": "The shelter is already taken this turn.",
	"feedBlock.noShelters": "No free shelters left on the plants.",
	"feedBlock.noShelterNeed": "No animal that needs a shelter.",
	"feedBlock.sheltersOtherZone": "The remaining shelters are in another territory.",
	"feedBlock.shelterBlocksGraze": "The shelter takes up the turn — no trampling.",
	"feedBlock.noGrazer": "No animal with Grazing.",
	"feedBlock.grazersFed": "All grazers are fed.",
	"feedBlock.grazersUsed": "The grazers have already trampled this turn.",
	"feedBlock.noGrazeFood": "No food that can be trampled.",
	"feedBlock.noFat": "No fat reserves.",
	"feedBlock.fatHungryOnly": "Only a hungry animal can convert fat.",
	"feedBlock.migrateOff": "Migration is available only with the “Continents” expansion.",
	"feedBlock.migrateUsed": "A migration has already been declared this turn.",
	"feedBlock.noMigrator": "No animal ready to migrate.",
	"feedBlock.noMigrationTarget": "This animal has nowhere to migrate.",
	"feedBlock.skipBlocked": "Passing is unavailable: there are animals that can still get food or a shelter."
};
/**
* Русский словарь интерфейса «Эволюции» — канонический источник ключей.
*
* Формат: плоские ключи с точками-разделителями («menu.createTable»),
* значения — строки с подстановкой параметров `{name}`, `{count}`
* (подставляет функция `t(key, params)` из `src/lib/i18n/index.ts`).
*
* Правила:
*  - русский текст использует кавычки-«ёлочки»;
*  - множественные формы русских слов (очки/места/игроки) считают
*    помощники `pointsWord` / `seatsWord` / `playersWord` в index.ts,
*    а не параметры словаря;
*  - en-словарь обязан покрыть каждый ключ этого файла (проверяет tsc
*    через `satisfies Record<keyof typeof ru, string>`).
*
* НОВЫЕ СТРОКИ: добавляйте ключ сюда и в en.ts одним коммитом — tsc
* поймает забытый перевод.
*/
var ru = {
	"common.cancel": "Отмена",
	"common.close": "Закрыть",
	"common.gotIt": "Понятно",
	"common.save": "Сохранить",
	"common.enter": "Войти",
	"common.on": "вкл",
	"common.off": "выкл",
	"app.name": "Эволюция",
	"app.brand": "Правильные игры · Кнорре",
	"app.description": "Цифровая «Эволюция» — русская настольная игра о происхождении видов.",
	"topbar.tutorial": "Обучение",
	"topbar.rules": "Правила",
	"topbar.stats": "Статистика",
	"lang.switch": "Переключить язык на английский",
	"menu.subtitle": "Соберите стол, позовите друзей и добавьте ботов — партия идёт через сервер.",
	"menu.tabsLabel": "Разделы меню",
	"menu.tab.tables": "Столы",
	"menu.tab.create": "Создать",
	"menu.col.table": "Стол",
	"menu.col.table.hint": "Имя видят соперники. Стол откроется с настройками прошлой партии — всё меняется в лобби.",
	"menu.col.open": "Открытые",
	"menu.col.open.hint": "Вход по коду стола, без пароля. Идущие партии можно смотреть, не занимая место.",
	"menu.col.private": "Закрытые",
	"menu.col.private.hint": "Столы с паролем: код виден, вход — по 4 цифрам от хоста.",
	"menu.name": "Ваше имя",
	"menu.name.placeholder": "Как вас видят соперники",
	"menu.create": "Создать стол",
	"menu.join": "Присоединиться к столу",
	"menu.private": "Приватный стол — вход по паролю",
	"menu.code": "Код стола",
	"menu.code.placeholder": "Например, KQXT",
	"menu.password": "Пароль стола",
	"menu.digits4": "4 цифры",
	"menu.watch": "Смотреть",
	"menu.watch.title": "Место не займёте: увидите стол, чат и сможете поощрять игроков",
	"menu.hint": "Боты, вместимость, дополнения и сложность настраиваются в лобби перед стартом. Пароль приватного стола сервер сгенерирует сам — посмотреть и сменить его можно там же.",
	"menu.err.name": "Введите имя — соперники увидят его за столом",
	"menu.err.nameCol": "Сначала введите имя в колонке «Стол»",
	"menu.waiting": "Ждут игроков",
	"menu.live": "Идут сейчас",
	"menu.open.empty": "Открытых столов нет — создайте свой и позовите игроков.",
	"menu.open.live.empty": "Сейчас никто не играет.",
	"menu.private.empty": "Закрытых столов нет.",
	"menu.private.live.empty": "Закрытых партий сейчас нет.",
	"menu.room.host": "хост {name}",
	"menu.room.summary": "{line} · занято {taken} из {capacity}",
	"menu.room.watchTitle": "Смотреть партию, не занимая место",
	"menu.room.joinTitle": "Сесть за стол",
	"menu.room.watch": "Наблюдать",
	"menu.room.join": "Занять место",
	"menu.private.liveTitle": "Партия идёт: место не занять",
	"menu.private.openTitle": "Нажмите, чтобы ввести пароль",
	"menu.private.collapseTitle": "Свернуть ввод пароля",
	"menu.private.enterTitle": "Ввести 4-значный пароль и сесть за стол",
	"menu.private.enter": "Войти по паролю",
	"menu.private.passwordAria": "Пароль закрытого стола",
	"menu.private.live": "идёт",
	"diff.easy": "Проще",
	"diff.normal": "Обычная",
	"diff.hard": "Жёстче",
	"module.continents": "Континенты",
	"module.continents.hint": "Лавразия, Гондвана и Океан",
	"module.plants": "Растения",
	"module.plants.hint": "еда на общих растениях, убежища",
	"module.fungi": "Трава и грибы",
	"module.fungi.hint": "флора и метки последствий",
	"module.randomMutations": "Случайные мутации",
	"module.randomMutations.hint": "личная слепая колода",
	"lobby.subtitle": "Стол · ждём игроков",
	"lobby.copy": "Скопировано",
	"lobby.copyLink": "Скопировать ссылку на стол",
	"lobby.copyBoth": "Скопировать ссылку и пароль",
	"lobby.copiedBoth": "Скопировано: ссылка и пароль",
	"lobby.passwordShow": "Показать пароль стола",
	"lobby.passwordHide": "Скрыть пароль стола",
	"lobby.passwordTitle": "Пароль стола — нажмите, чтобы показать или скрыть",
	"lobby.passwordNew": "Новый пароль стола",
	"lobby.passwordChangeAria": "Изменить пароль стола",
	"lobby.passwordChangeTitle": "Изменить пароль",
	"lobby.passwordCancelAria": "Отменить смену пароля",
	"lobby.passwordSaved": "Пароль сохранён",
	"lobby.passwordFail": "Не удалось сохранить пароль",
	"lobby.privacyOnAria": "Стол приватный — сделать открытым",
	"lobby.privacyOffAria": "Стол открытый — сделать приватным",
	"lobby.privacyOnTitle": "Стол закрытый: гостям нужен пароль (стол виден в колонке «Закрытые»). Нажмите, чтобы открыть",
	"lobby.privacyOffTitle": "Стол виден в списке открытых. Нажмите, чтобы закрыть стол паролем",
	"lobby.invitePassword": "Пароль стола: {password}",
	"lobby.copyManual": "Скопируйте ссылку вручную:",
	"lobby.settings": "Настройки партии",
	"lobby.modules": "Дополнения",
	"lobby.hostOnly": "Менять настройки может только хост",
	"lobby.difficulty": "Сложность ботов",
	"lobby.deckSize": "Размер колоды свойств",
	"lobby.deckInfo": "Колода {n} карт · ≈{years} лет партии",
	"lobby.deckShort": "Короткая",
	"lobby.deckNormal": "Обычная",
	"lobby.deckFull": "Полная",
	"lobby.seats": "Мест за столом",
	"lobby.seatsHost": " · задаёт хост",
	"lobby.seatsHint": "Уменьшать можно и ниже числа людей: сначала уплотнятся свободные места, затем уйдут боты, а лишние игроки перейдут в очередь ожидания.",
	"lobby.bots": "Боты",
	"lobby.botRemove": "Убрать бота",
	"lobby.botAdd": "Добавить бота",
	"lobby.botsHint": "заполнят свободные места перед стартом",
	"lobby.start": "Начать год",
	"lobby.startHostTitle": "Начинает хост",
	"lobby.startFullTitle": "Заполните все места — людьми или ботами",
	"lobby.leave": "Покинуть стол",
	"lobby.startHint.host": "Начинает хост: кнопка станет доступна, когда он соберёт стол.",
	"lobby.startHint.free": "Свободно мест: {free} из {capacity} — позовите игроков по ссылке или добавьте ботов.",
	"lobby.waiters": "Ожидают места · {n}",
	"lobby.spectators": "Наблюдают · {n}",
	"lobby.waiterRemoveAria": "Убрать из очереди {name}",
	"lobby.waiterRemoveTitle": "Убрать из очереди",
	"lobby.inviteHint": "Отправьте ссылку друзьям — они войдут по ней одним касанию.",
	"lobby.kickSeat.title": "Убрать игрока?",
	"lobby.kickSeat.body": "{name} потеряет место за столом и вернётся в меню. Место освободится для другого гостя или бота.",
	"lobby.kickWaiter.title": "Убрать из очереди?",
	"lobby.kickWaiter.body": "{name} потеряет место в очереди и вернётся в меню.",
	"lobby.kickConfirm": "Убрать",
	"lobby.transfer.title": "Передать хост?",
	"lobby.transfer.body": "Управление столом перейдёт игроку {name}: настройки, места и старт партии. Вы останетесь за столом.",
	"lobby.transfer.confirm": "Передать",
	"seat.free": "Свободное место",
	"seat.online": "в сети",
	"seat.offline": "не в сети",
	"seat.resigned": "сдался",
	"seat.host": "хост",
	"seat.you": "это вы",
	"seat.waiting": "ждём",
	"seat.nameAria": "Ваше имя за столом",
	"seat.nameSave": "Сохранить имя",
	"seat.nameCancel": "Отменить смену имени",
	"seat.nameEditAria": "Изменить своё имя",
	"seat.nameEditTitle": "Изменить имя",
	"seat.colorAria": "Цвет игрока: {color}",
	"seat.colorTitle": "Выбрать цвет",
	"seat.colorLabel": "Цвет места",
	"seat.transferAria": "Передать хост игроку {name}",
	"seat.transferTitle": "Передать хост",
	"seat.kickAria": "Убрать игрока {name}",
	"seat.kickTitle": "Убрать игрока",
	"chat.title": "Чат стола",
	"chat.open": "Открыть чат стола",
	"chat.button": "Чат",
	"chat.close": "Закрыть чат",
	"chat.hi": "Привет!",
	"chat.goodTable": "Хороший стол!",
	"chat.go": "Погнали",
	"wait.subtitle": "Стол · мест нет",
	"wait.position": "Вы {place} в очереди. Как только место освободится, вас посадят автоматически.",
	"wait.inQueue": "Вы в очереди на место за столом.",
	"wait.queue": "Очередь · {n}",
	"wait.atTable": "За столом",
	"wait.claim": "Занять место",
	"wait.claimNone": "Свободных мест пока нет",
	"wait.claimOk": "Занять освободившееся место",
	"wait.leave": "Выйти из очереди",
	"wait.hint": "Место займётся автоматически, как только кто-то выйдет. Кнопка — на случай задержки.",
	"wait.now": "только что",
	"wait.sec": "{s} с",
	"wait.min": "{m} мин",
	"wait.hour": "{h} ч {m} мин",
	"rules.title": "Правила",
	"rules.tabs": "Раздел правил",
	"rules.tab.base": "Базовая игра",
	"rules.tab.continents": "Континенты",
	"rules.tab.plants": "Растения",
	"rules.tab.fungi": "Трава и грибы",
	"rules.tab.mutations": "Мутации",
	"rules.base.intro": "Базовая русская «Эволюция» (Правильные игры, 2010). Колода 84 карты, 2–4 игрока. Побеждает тот, чья популяция набрала больше очков после последнего года.",
	"rules.base.year": "Ход года",
	"rules.base.dev": "Развитие.",
	"rules.base.dev.text": "По кругу выкладывайте по одной карте: новое животное или свойство. Свойства лежат лицом вверх, все видят, кто что выложил. Двойная карта играется одной из двух сторон. Паразит кладётся только на чужих. Парная карта (симбиоз, сотрудничество, взаимодействие) ложится между двумя животными: на пару одна такая карта, а у животного их не больше двух. Спасовали — больше в этой фазе не играете; когда спасовали все, фаза заканчивается.",
	"rules.base.food": "Кормовая база.",
	"rules.base.feed": "Питание.",
	"rules.base.feed.text": "Ход длится, пока вы сами не нажмёте «Закончить ход»: одно действие ход не отдаёт. За ход можно напасть каждым своим хищником и обчистить добычу каждым пиратом либо взять одну фишку еды; поели из базы — охота и воровство в этот ход закрыты. Накормленное животное свойств не использует: не нападает, не ворует, не топчет, не засыпает и не тратит жир, ему остаётся только складывать еду в пустой жировой запас. Топотун топчет раз за ход и может совмещать это с едой. Превращение жира — свободное действие. Когда действий не осталось совсем, ход передаётся сам. «Пас» выводит вас из фазы до её конца; фаза заканчивается, когда база пуста, все накормлены, все спасовали или никому нельзя ходить.",
	"rules.base.ext": "Вымирание.",
	"rules.base.ext.text": "Ненакормленные погибают. Добор: число выживших + 1. Если никого нет и рука пуста — 6 карт. Пустая колода — последний год.",
	"rules.base.score": "Очки",
	"rules.base.score.text": "2 за каждое выжившее животное, 1 за каждое свойство. Дополнительно: хищник и большой +1, паразит +2. Ничья — по картам в сбросе.",
	"rules.base.traits": "Свойства базовой игры",
	"rules.lbl.hand": "рука",
	"rules.lbl.trait": "свойство",
	"rules.lbl.animal": "животное",
	"rules.lbl.token": "фишка базы",
	"rules.lbl.red": "красная",
	"rules.lbl.blue": "синяя",
	"rules.lbl.fat": "жир",
	"rules.lbl.extinct": "вымерло",
	"rules.lbl.draw": "добор",
	"rules.lbl.dice": "Кости кормовой базы",
	"rules.lbl.carnBonus": "+2 · хищнику +1",
	"rules.lbl.parBonus": "+1 · паразиту +2",
	"rules.continents.intro": "Дополнение «Континенты» (Правильные игры, 2012): 42 карты новых свойств. Включается в меню перед партией — все правила базовой игры остаются в силе.",
	"rules.cont.territories": "Территории.",
	"rules.cont.territories.text": "Животные живут на Лавразии, в Гондване и в Океане. Выкладывая животное, выбираете континент кликом по нему; в Океан животное попадает только со свойством «Водоплавающее». В Океане водность не снимается: неоплазия её не выключает. Уйти на континент животное может миграцией, а парализованного хищника и вовсе выбрасывает на берег.",
	"rules.cont.bases": "Кормовые базы.",
	"rules.cont.bases.text": "У каждой территории своя база: 2 игрока 8/7/5, три 11/10/7, четыре 14/13/9 (Лавразия/Гондвана/Океан). Первое же действие хода привязывает вас к одной территории: дальше берёте еду её базы и играете животными, которые на ней стоят. Хищник ест только в своей территории. «Эдификатор» ежегодно добавляет 2 фишки в базу своей территории.",
	"rules.cont.pairs": "Парные карты.",
	"rules.cont.pairs.text": "Кладутся между двумя животными одной территории. Разъехалась пара — карта уходит в сброс.",
	"rules.cont.migration": "Миграция.",
	"rules.cont.migration.text": "Объявите миграцию вместо обычного хода: ни еды, ни охоты, только переезды. Мигрирующих животных может быть сколько угодно: из Океана на любой континент, с континента в Океан (водоплавающим). Напрямую между континентами проехать нельзя, сухопутному с континента ехать некуда. После переезда каждая прилипала той же местности — по решению её владельца в порядке хода — может уехать следом за мигрантом (в Океане — только водоплавающая).",
	"rules.cont.newTraits": "Новые свойства.",
	"rules.cont.newTraits.text": "Стадность: пока стадных на территории не меньше, чем хищников, их нельзя есть. Стрекательные клетки: напавший хищник до конца фазы питания не может охотиться, воровать и мигрировать, а в Океане его ещё и выбрасывает на континент. Регенерация: съеденное хищником животное возвращается, в вымирание владелец выкладывает карту из руки новым животным, добора за него нет. Рекомбинация (парная): раз за год, в свой ход питания, партнёры отдают друг другу по одному непарному свойству (дубль уходит в сброс; потерявший «Водоплавающее» в Океане переселяется на континент). Неоплазия — вирус: играется только на чужое животное и каждый год в начале определения кормовой базы поднимается, выключая очередное непарное свойство (выключенное не работает и очков не даёт); когда выключать нечего, животное немедленно погибает. Вирусные свойства (паразит, неоплазия) помечены фиолетовым.",
	"rules.cont.rescue": "Спасение.",
	"rules.cont.rescue.text": "Игрок без карт и животных берёт 10 карт; две из них сразу ложатся животными, по одному на каждый континент.",
	"rules.cont.traits": "Свойства дополнения",
	"rules.plants.intro": "Дополнение «Растения» (Правильные игры, 2016): 36 двусторонних карт — свойство растения либо свойство животного. Включается в меню перед партией, совместимо с «Континентами».",
	"rules.plants.base": "Кормовая база без кубика.",
	"rules.plants.base.text": "Еда этого года лежит на растениях. В фазу определения базы броска нет: сразу питание. С «Континентами» растения стоят на Лавразии и Гондване, а Океан получает базу по обычным правилам. Растения общие — не принадлежат никому.",
	"rules.plants.feeding": "Питание.",
	"rules.plants.feeding.text": "Фишка берётся с растения на животное, но только если животное способно им питаться: «Водное» растение кормит только водоплавающих, «Корнеплод» только норных, «Дерево» только больших. Хищники едят только с растений со значком плода и с «Питательных». Вместо еды или атаки можно занять убежище растения: жетон защищает от хищников и хищных растений до конца фазы. Пасовать нельзя, пока хоть одно ваше животное способно получить еду или убежище.",
	"rules.plants.carnivorous": "Хищное растение.",
	"rules.plants.carnivorous.text": "Раз за фазу питания: контратакует животное, тянущее с него еду (выживший всё равно получает фишку), либо один из игроков направляет его на любое животное, которое смог бы атаковать хищник без свойств. Съело животное — 2 фишки, получило хвост — 1, съело ядовитое — гибнет в вымирание.",
	"rules.plants.extinction": "Вымирание.",
	"rules.plants.extinction.text": "Съеденные дочиста растения погибают — кроме однолетника (выживает) и растений-паразитов (гибнут только с хозяином). Связка микориз выживает, если хоть на одном растении осталась еда. Гриб получает фишку за каждое погибшее животное.",
	"rules.plants.growth": "Фаза роста.",
	"rules.plants.growth.text": "Выжившие растения разрастаются по своим схемам (многолетник 1→2, 2→3, 3+→5 и т.д.), лиана получает столько фишек, сколько на столе не-лиан, убежища восстанавливаются, из колоды выходят новые растения. Эдификатор с «Континентами» добавляет по фишке растениям своей локации.",
	"rules.plants.score": "Очки.",
	"rules.plants.score.text": "Растения и их свойства при подсчёте не учитываются — очки дают только животные и их свойства.",
	"rules.plants.species": "Виды растений",
	"rules.plants.traits": "Свойства растений",
	"rules.plants.footnote": "Свойства животных на вторых гранях карт «Растений» — из базовой игры, смотрите их во вкладке «Базовая игра».",
	"rules.fungi.intro": "Дополнение «Трава и грибы» (Правильные игры, 2019): 24 длинные карты флоры (6 грибов и 6 трав по 2 копии), 8 меток последствий и 2 новых свойства животных. Кормовая база этого года — все красные фишки на картах флоры; флора — полноправный участник партии и может победить.",
	"rules.fungi.table": "Стол флоры.",
	"rules.fungi.table.text": "На старте открыты 2 карты; в фазу кормовой базы из колоды выходят карты по числу игроков (максимум 8 на столе). Гриб входит в игру с 1 красной фишкой, трава — с 3; максимум фишек на карте — 4. С «Континентами» флора живёт на Лавразии и Гондване, Океан кормится по обычным правилам.",
	"rules.fungi.feeding": "Питание.",
	"rules.fungi.feeding.text": "Любое животное может брать фишки с любой травы или гриба; при взятии срабатывает способность карты. «Взаимодействие» и «Топотун» работают с картами флоры. Метка последствий прилетает при взятии фишки с «меченой» карты, но только если у животного нет такой же, метка ещё осталась на столе, а «Трына» у него нет. Хищник, съевший добычу, получает все её метки.",
	"rules.fungi.spread": "Разрастание грибов.",
	"rules.fungi.spread.text": "Каждый раз, когда животное погибает (в питании и в вымирании), на любой гриб кладётся 1 красная фишка.",
	"rules.fungi.extinction": "Вымирание.",
	"rules.fungi.extinction.text": "Гибнут ненакормленные, отравлённые и животные с меткой «Яд» без «Антидота». С выживших снимаются все фишки и метки. Карты флоры без фишек уходят в сброс; каждая выжившая трава получает 1 фишку, грибы — только от гибели животных.",
	"rules.fungi.score": "Очки.",
	"rules.fungi.score.text": "«Трава и грибы» играют сами за себя: 2 очка за каждую выжившую карту флоры и 1 за каждую фишку на ней; при равенстве очков преимущество у флоры.",
	"rules.fungi.cards": "Карты флоры",
	"rules.fungi.marks": "Метки последствий",
	"rules.fungi.animalTraits": "Свойства животных",
	"rules.mutations.intro": "Дополнение «Случайные мутации» (по одноимённой игре Правильных игр, 2013): рука карт исчезает — у каждого игрока личная слепая колода. В фазу развития вы сначала объявляете, как разыграете верхнюю карту, и только потом её вскрываете. Свойства достаются случайно, в том числе вредные мутации (тёмные карты). Несовместимо с «Травой и грибами»: это дополнение нельзя объединять со «Случайными мутациями».",
	"rules.mut.deck": "Личная колода.",
	"rules.mut.deck.text": "7 карт на старте, просматривать нельзя. В свой ход развития объявите один из способов розыгрыша: (1) новый вид — карта ложится животным; (2) свойство — на свой вид из одного животного; (3) +1 животное к виду. С «Растениями» можно объявить и свойство растения — карта вскроется на выбранном растении.",
	"rules.mut.fate": "Судьба свойства.",
	"rules.mut.fate.text": "Если свойство нельзя сыграть на выбранный вид, оно переезжает на соседний вид справа; если не подходит нигде — само становится новым видом-мутантом. Вредные мутации обязательны: отказаться от них нельзя.",
	"rules.mut.population": "Численность вида.",
	"rules.mut.population.text": "Вид может состоять из нескольких животных (отмечается «×N» на карточке). Численность не может превышать числа ваших видов; исключение — «Почкование». Еда, охота, голод и яд действуют на животных по одному: атака снимает одно животное, а не весь вид.",
	"rules.mut.draw": "Добор.",
	"rules.mut.draw.text": "В конце года: число животных + 2 карты на дно личной колоды. Общий запас кончился — последний год.",
	"rules.mut.score": "Очки.",
	"rules.mut.score.text": "2 за каждое животное (с учётом численности), 1 за свойство и бонусы свойств; метаболический синдром даёт 2 дополнительных очка.",
	"rules.mut.traits": "Свойства дополнения",
	"rules.mut.footnote": "Прочие свойства в слепой колоде — из базовой игры и включённых дополнений; их правила смотрите в соответствующих вкладках.",
	"rules.terr.laurasia": "Северный континент с самой щедрой базой: 8 фишек при двух игроках, 11 при трёх, 14 при четырёх.",
	"rules.terr.gondwana": "Южный континент: 7/10/13 фишек по числу игроков. С «Растениями» и «Травой и грибами» флора стоит на обоих континентах.",
	"rules.terr.ocean": "Мир воды: здесь живут только водоплавающие, база 5/7/9 по числу игроков. Обратной дороги нет: уйти из Океана животное может только миграцией.",
	"rules.flora.fungus": "(гриб · входит с 1 фишкой)",
	"rules.flora.grass": "(трава · входит с 3)",
	"rules.mark.line": "Метка «{name}» · по 4 в комплекте",
	"stats.title": "Статистика",
	"stats.empty": "Партий ещё не было — статистика появится после первой игры.",
	"stats.games": "Партий",
	"stats.wins": "Побед",
	"stats.winrate": "Винрейт",
	"stats.best": "Лучший счёт",
	"stats.chart": "Очки последних партий",
	"stats.chartGame": "Партия {i}",
	"stats.chartScore": "Счёт",
	"stats.chartPoints": "{n} очков",
	"stats.topTraits": "Любимые свойства",
	"stats.history": "История партий",
	"stats.historyLast": " · последние {n}",
	"stats.place": "{place} из {players}",
	"stats.mode.net": "сеть",
	"stats.mode.solo": "соло",
	"stats.modules": "{n} доп.",
	"stats.win": "победа",
	"stats.achievements": "Достижения",
	"stats.achievementsOf": " · {got} из {total}",
	"final.kicker": "Конец эволюции",
	"final.win": "Ваша популяция доминирует",
	"final.lose": "Вас вытеснили",
	"final.show": "Показать итоги партии",
	"final.collapseAria": "Свернуть итоги и посмотреть стол",
	"final.collapseTitle": "Свернуть и посмотреть стол",
	"final.results": "Итоги",
	"final.resultsWin": " · победа",
	"final.resultsPlace": " · {place}",
	"final.formula": "Очки: 2 за каждое выжившее животное, 1 за каждое свойство и надбавки свойств («бонус»). Сброс очков не даёт — по нему решается ничья при равенстве.",
	"final.scoreAria": "Итоговый счёт",
	"final.best": "лучший результат",
	"final.showAll": "Показать всё",
	"final.stepHint": "Счёт раскрывается по шагам",
	"final.total": "Итого",
	"final.discard": "сброс",
	"final.discardHint": "Сброшенные карты очков не дают — по ним движок решает ничью при равных очках",
	"final.again": "Ещё партия",
	"final.menu": "В меню",
	"final.leave": "Покинуть стол",
	"final.labels.animals": "животные",
	"final.labels.traits": "свойства",
	"final.labels.extras": "бонус",
	"final.labels.flora.animals": "карты флоры",
	"final.labels.flora.traits": "свойства флоры",
	"final.labels.flora.extras": "фишки на флоре",
	"final.hints.animals": "2 очка за каждое выжившее животное; с «Мутациями» — за каждого в численности",
	"final.hints.traits": "1 очко за каждое действующее свойство животных (выключенные не считаются)",
	"final.hints.extras": "Надбавки свойств: хищник и большой +1, паразит и метаболический синдром +2",
	"final.hints.flora.animals": "2 очка за каждую выжившую карту флоры",
	"final.hints.flora.traits": "Свойства растений очков не дают — по правилам дополнения здесь всегда 0",
	"final.hints.flora.extras": "1 очко за каждую фишку на выжившей карте флоры",
	"final.defeat.sharedLead": "Первое место разделили {n} {players}; ваш разрыв с лидером — {gap} {points}",
	"final.defeat.behind": "Вас обошли на {gap} {points}",
	"final.defeat.plain": "{lead}.",
	"final.defeat.discardTie": "Очки равны — {total}, но ничью решил сброс: у лидера {leader} карт против ваших {human}.",
	"final.defeat.flora": "Флора обошла вас на {gap} {points}: «{name}» — {leader}, у вас {human}.",
	"final.defeat.on.animals": "на животных",
	"final.defeat.on.traits": "на свойствах",
	"final.defeat.on.extras": "на бонусах свойств",
	"final.defeat.due.animals": "животных",
	"final.defeat.due.traits": "свойств",
	"final.defeat.due.extras": "бонусов свойств",
	"final.defeat.fully": "{lead} — целиком за счёт {due}: {leader} против ваших {human}.",
	"final.defeat.mostly": "{lead}. Больше всего преимущество {on}: {leader} против ваших {human}.",
	"tutorial.counter": "Обучение · {i} из {n}",
	"tutorial.slidesAria": "Слайды обучения",
	"tutorial.slideAria": "Слайд {k}: {title}",
	"tutorial.back": "Назад",
	"tutorial.next": "Далее",
	"tutorial.done": "Понятно",
	"tutorial.phase.dev": "Развитие",
	"tutorial.phase.foodBase": "Кормовая база",
	"tutorial.phase.feed": "Питание",
	"tutorial.phase.ext": "Вымирание",
	"tutorial.s1.title": "Как играть в «Эволюцию»",
	"tutorial.s1.p1": "Вы разводите виды и ведёте их через голодные годы. Год состоит из четырёх фаз — они показаны в шапке стола.",
	"tutorial.s1.p2": "Побеждает тот, чья популяция после последнего года наберёт больше очков: 2 очка за каждое животное вида и по очку за каждое свойство.",
	"tutorial.s1.p3": "Партия занимает 10–20 минут: выберите число игроков, сложность ботов и дополнения — и вперёд.",
	"tutorial.s2.title": "Развитие",
	"tutorial.s2.p1": "Разыгрывайте по одной карте за круг: как новое животное или как свойство на свой вид. Двойная карта — одно из двух свойств на выбор.",
	"tutorial.s2.p2": "Подсветка подсказывает, куда карту можно положить; наведение на чип свойства открывает его правило. Парные свойства (симбиоз, сотрудничество) кладутся между двумя животными.",
	"tutorial.s2.p3": "Когда все спасуют, фаза заканчивается.",
	"tutorial.s3.title": "Питание",
	"tutorial.s3.p1": "Кормовая база бросается кубиками — это красные фишки. Накормите животных по потребности: кликните по подсвеченной карточке или кнопке «Взять еду».",
	"tutorial.s3.p2": "Хищники берут синие фишки с добычи, «жировой запас» откладывает еду на голодный год. Накормленное животное свойствами больше не пользуется.",
	"tutorial.s3.p3": "Фаза идёт по кругу, пока есть еда и желающие: один ход — до нажатия «Закончить ход».",
	"tutorial.s4.title": "Охота",
	"tutorial.s4.p1": "Кнопка «Охота» у хищника подсвечивает допустимых жертв: крупного не взять, водное — только в океане, стадность защищается числом.",
	"tutorial.s4.p2": "Жертва может спастись: «Быстрое» бросает кубик, маскировка прячется, хвостоплавник отбрасывает хвост. Съеденная добыча даёт хищнику +2 синие фишки.",
	"tutorial.s4.p3": "Защищаться нужно вовремя — стол сам спросит модальным окном, когда нападут на вас.",
	"tutorial.s5.title": "Вымирание и финал",
	"tutorial.s5.p1": "Ненакормленные животные погибают; за выживших добираются карты из колоды. Когда колода пуста — наступает последний год.",
	"tutorial.s5.p2": "В финале очки считают по живым животным, свойствам и бонусам: хищник и большой вес дают дополнительно.",
	"tutorial.s5.p3": "Счёт каждого игрока виден на его табло рядом со сбросом — следите за отрывом.",
	"sound.settings": "Настройки звука",
	"sound.off": "Звук выключен — открыть настройки",
	"sound.quiet": "Звук приглушён — открыть настройки",
	"sound.on": "Звук включён — открыть настройки",
	"sound.toggle": "Звук",
	"sound.sfx": "Эффекты",
	"sound.ambient": "Фон",
	"sound.test": "Проверить",
	"traitTip.extraFood": "+{n} к еде",
	"traitTip.score": "+{n} очк.",
	"traitTip.pair": "пара",
	"traitTip.disabled": "отключено",
	"card.animal": "Животное",
	"card.carnivore": "Хищник",
	"card.obligateCarnivore": "Облигатный хищник",
	"card.water": "Водное",
	"card.noTraits": "без свойств",
	"card.shelter": "убежище",
	"card.sedated": "успокоено",
	"card.paralyzed": "Парализован",
	"card.hibernating": "спит",
	"card.fed": "сыто",
	"card.hungry": "голод",
	"card.pair": "пара",
	"card.card": "Карта",
	"card.foodTitle": "Еда {food} / {need}",
	"card.foodBlue": " · синих {n}",
	"card.foodFat": " · жир {n}",
	"card.redToken": "Красная фишка",
	"card.blueToken": "Синяя фишка",
	"card.fatToken": "Жир",
	"card.popTitle": "Численность вида: {n}",
	"card.shelterTitle": "В убежище растения: хищники и хищные растения не тронут до конца фазы питания",
	"card.sedatedTitle": "Откушало с лекарственного растения: накормлено, но свойства не действуют до конца фазы питания",
	"card.noFood": "без еды",
	"card.plant": "растение",
	"card.fungus": "гриб",
	"card.grass": "трава",
	"card.newPlant": "новое растение",
	"card.foodTokens": "Фишек еды: {n} (максимум {m})",
	"card.sheltersFree": "Свободных убежищ: {n}",
	"card.carnivoreEdible": "Хищники могут брать с этого растения еду",
	"card.plantAttacked": "атака была",
	"card.plantAttackedTitle": "Хищное растение уже атаковало в этом году",
	"card.markLabel": "Метка «{name}»",
	"card.givesMark": "Даёт метку «{name}»",
	"card.floraDeck": "колода {n} · сброс {m}",
	"card.plantDeck": "колода {n} · погибло {m}",
	"card.floraCommon": "Трава и грибы · общие",
	"card.plantsCommon": "Растения · общие",
	"card.floraZone": "Флора {zone}",
	"card.plantsZone": "Растения {zone}",
	"card.floraStrip": "Трава и грибы",
	"card.plantsStrip": "Растения",
	"card.floraStripZone": "Трава и грибы ({zone})",
	"card.plantsStripZone": "Растения ({zone})",
	"card.extraFoodNeed": "+{n} к потребности в еде",
	"card.renameAria": "Переименовать животное",
	"card.renameInput": "Имя животного (до 24 символов)",
	"card.renameSave": "Сохранить имя животного",
	"card.renameCancel": "Отменить переименование",
	"phase.development": "Развитие",
	"phase.foodBank": "Кормовая база",
	"phase.feeding": "Питание",
	"phase.extinction": "Вымирание",
	"phase.growth": "Рост",
	"phase.gameOver": "Итог",
	"game.year": "Год",
	"game.yearN": "Год {year}",
	"game.yearLast": "последний",
	"game.turnYour": "Ваш ход",
	"game.turnCardSub": "Год {year} · {phase}",
	"game.madBanner": "Безумие: этот раунд вашими животными управляет бот — сосед не участвует (в онлайн-версии пока не реализовано управление соседом)",
	"game.lastYearBanner": "Последний год — после этого раунда партия закончится",
	"game.openingFinal": "Открываем финальный стол…",
	"game.reconnecting": "Переподключение…",
	"game.opening": "Открываем стол…",
	"game.spectBadge": "Вы смотрите · реакции доступны",
	"game.spectDock": "Режим зрителя: действия недоступны",
	"game.layoutWide": "Широкая вёрстка стола",
	"game.layoutCozy": "Компактная вёрстка стола",
	"game.logButton": "Журнал и чат",
	"game.logButtonUnread": "Журнал и чат, новых записей: {n}",
	"game.unreadCount": "Новых записей: {n}",
	"game.leaveButton": "Покинуть стол",
	"game.achievementToast": "Достижение: {name}",
	"game.wait.oceanBank": "Кормовая база Океана определяется…",
	"game.wait.diceThrown": "Кубики брошены — кормовая база определяется…",
	"game.wait.roll": "Бросок кормовой базы…",
	"game.wait.extinction": "Вымирание: ненакормленные животные погибают…",
	"game.wait.growth": "Рост: растения разрастаются, добавляются новые…",
	"game.wait.madness": "Безумие: раунд {name} проводится ботом (в онлайн-версии пока не реализовано управление соседом)…",
	"game.wait.actor": "{name} ходит…",
	"game.wait.waiting": "Ожидание",
	"game.yourPopulation": "Ваша популяция",
	"game.noAnimals": "Нет животных",
	"game.placeFromHand": "Выложите животное из руки",
	"game.acting": "ходит",
	"game.deckCount": "колода {n}",
	"game.handCount": "рука {n}",
	"game.discardCount": "сброс {n}",
	"game.scoreLabel": "счёт",
	"game.blindDeckTitle": "Слепая колода: {n}",
	"game.scoreTitle": "Текущие очки: 2 за каждое животное вида + по очку за свойство и его бонус",
	"game.seatColor": "Цвет места",
	"game.territoryEmpty": "пусто",
	"game.territoryEmptyOcean": "пусто (нужна водоплавающая)",
	"game.placeOn": "Разместить на {name}",
	"game.clickToPlace": "нажмите, чтобы разместить на «{name}»",
	"game.pairNo": "№{n}",
	"game.pairPartner": "напарник",
	"game.pairWith": "с {no}",
	"game.symbiontFor": "симбионт для {no}",
	"game.symbiontIs": "симбионт — {no}",
	"game.symbiontPlate": "симбионт {a} → {b}",
	"game.pairPlate": "{a} ↔ {b}",
	"game.foodBankLower": "кормовая база",
	"game.oceanBankLower": "кормовая база океана",
	"game.growthBanner": "Рост: растения разрастаются",
	"game.extinctionNone": "Вымирание: погибает никто",
	"game.extinctionN": "Вымирание: погибает животных: {n}",
	"game.tableFoodTitle": "Еда этого года лежит на столе — берите фишки с растений и карт флоры",
	"game.plantsFoodTitle": "Еда этого года лежит на растениях — берите фишки с них",
	"game.floraFoodTitle": "Еда этого года — на травах и грибах",
	"game.plantsTokens": "фишек на {n} растениях · убежищ {m}",
	"game.floraTokens": "фишек на {n} травах и грибах",
	"game.territoryBankTitle": "Кормовая база «{name}»",
	"game.oceanBankHint": "Кормовая база Океана — на континентах еда на растениях",
	"game.bankHint": "Фишки кормовой базы — берите по одной в свой ход питания",
	"game.bankHintIdle": "Кормовая база",
	"game.oceanEmpty": "океан пуст",
	"game.bankEmpty": "база пуста",
	"game.turnOf": "Ход: {name}",
	"game.diceRolling": "бросок…",
	"game.diceBonus": "+{n} к базе",
	"game.diceTerritory": "база территорий",
	"game.diceAria": "Кубики кормовой базы: {dice}",
	"game.bankChip": "База",
	"game.timerHuman": "Ход завершится сам через {n} с — у вас не осталось действий",
	"game.timerOther": "У игрока {name} не осталось действий: ход завершится сам через {n} с",
	"game.reactions": "Реакции",
	"game.reactionOf": "Реакция {emoji}",
	"game.reactionCount": "Реакция {emoji}: {n}",
	"game.addReaction": "Поставить реакцию",
	"game.reactionTitle": "Реакция",
	"game.cheerTitle": "Поощрить игроков",
	"fx.attack": "Атака!",
	"fx.preyEaten": "добыча съедена +2 синие",
	"fx.tail": "− хвост",
	"fx.die": "кубик {n}",
	"fx.mimicry": "мимикрия →",
	"fx.redFood": "+1 красная",
	"fx.piracy": "пиратство +1 синяя",
	"fx.cooperation": "сотрудничество +1 синяя",
	"fx.scavenger": "падальщик +1 синяя",
	"fx.fat": "жир → синие",
	"fx.blue": "+1 синяя",
	"fx.bankBurn": "−{n} база",
	"fx.plantFood": "+1 с растения",
	"fx.shelter": "в убежище",
	"fx.plantCounter": "растение контратакует!",
	"fx.plantAttack": "хищное растение!",
	"fx.growth": "рост {from}→{to}",
	"fx.graze": "− топтун",
	"fx.plantDied": "☠ растение",
	"fx.honeyCard": "+1 карта (медонос)",
	"fx.floraFood": "+1 с флоры",
	"fx.fungusGrowth": "гриб {from}→{to}",
	"fx.floraDied": "☠ флора",
	"fx.mark": "метка: {mark}",
	"fx.handLost": "рука сброшена (прозрение)",
	"fx.cardsOne": "+{n} карта",
	"fx.cardsFew": "+{n} карты",
	"fx.cardsMany": "+{n} карт",
	"fx.mutTrait": "«{trait}»",
	"fx.mutAnimal": "новый вид",
	"fx.mutMutant": "вид-мутант",
	"fx.mutPopulation": "+1 животное",
	"fx.mutPlantTrait": "«{trait}» на растении",
	"fx.mutDiscarded": "в сброс",
	"dnd.start": "Взяли карточку. Отпустите её над подходящей целью.",
	"dnd.over": "Цель под карточкой.",
	"dnd.end": "Карточка отпущена.",
	"dnd.cancel": "Перетаскивание отменено.",
	"dock.turnOpponent": "Ход соперника",
	"dock.turnOpponentCards": "Ход соперника — карты остаются у вас",
	"dock.dev.placeAnimal": "Выберите территорию на столе — животное разместится туда",
	"dock.dev.plantTrait": "Выберите растение для свойства",
	"dock.dev.plantPairFirst": "Микориза: выберите первое растение",
	"dock.dev.plantPairSecond": "Второе растение микоризы",
	"dock.dev.trait": "Выберите животное для свойства",
	"dock.dev.pairFirst": "Парное свойство: выберите первое животное",
	"dock.dev.pairSecond": "Второе животное пары",
	"dock.dev.pairProgress": "Выбрано {no} → допустимых партнёров: {n}",
	"dock.dev.cardOrTrait": "Карта как животное или свойство",
	"dock.dev.cardOrTraitCont": "Карта как животное (затем клик по континенту) или свойство",
	"dock.dev.needAnimalFirst": "Сначала выложите животное — свойства кладутся на него",
	"dock.dev.faceBlocked": "Сейчас эту грань разыграть нельзя",
	"dock.endDev": "Закончить развитие",
	"dock.endDevTitle": "Закончить развитие: ваш ход в этом раунде завершён",
	"dock.cancelTitle": "Отменить выбор (Esc)",
	"dock.mut.chooseTrait": "Выберите свой вид из одного животного — карта вскроется на нём",
	"dock.mut.choosePop": "Выберите вид — карта станет +1 животным",
	"dock.mut.choosePlant": "Выберите растение — карта вскроется свойством на нём",
	"dock.mut.declare": "Объявите розыгрыш верхней карты колоды — потом она вскроется",
	"dock.mut.deckTitle": "Слепая колода: {n}",
	"dock.mut.deckAria": "Колода: {n}",
	"dock.mut.newSpecies": "Новый вид",
	"dock.mut.cardAsAnimal": "карта ляжет животным",
	"dock.mut.trait": "Свойство",
	"dock.mut.traitHint": "на вид из одного животного",
	"dock.mut.pop": "+1 животное виду",
	"dock.mut.popHint": "численность ≤ числа видов",
	"dock.mut.plantTrait": "Свойство растения",
	"dock.mut.plantTraitHint": "если в колоде есть такая грань",
	"dock.feed.oceanChip": "Океан",
	"dock.feed.take": "Взять еду",
	"dock.feed.shelter": "Убежище",
	"dock.feed.shelterTitle": "Занять убежище растения: защита от хищников до конца фазы питания",
	"dock.feed.plantAttack": "Хищное растение",
	"dock.feed.plantAttackTitle": "Направить хищное растение на жертву (раз за фазу)",
	"dock.feed.parasitize": "На паразита",
	"dock.feed.parasitizeTitle": "Перекинуть фишку с растения-хозяина на растение-паразит",
	"dock.feed.hunt": "Охота",
	"dock.feed.pirate": "Пиратство",
	"dock.feed.hibernation": "Спячка",
	"dock.feed.fat": "Жир",
	"dock.feed.graze": "Топтун",
	"dock.feed.migrate": "Миграция",
	"dock.feed.endTurn": "Закончить ход",
	"dock.feed.skip": "Закончить питание",
	"dock.feed.skipHungryTitle": "Закончить питание: не накормлено животных — {n}",
	"dock.feed.skipFedTitle": "Закончить питание: все животные сыты",
	"dock.feed.skipHint": "Закончить питание недоступно — есть доступная еда или убежища",
	"dock.feed.skipHintTitle": "Пока хотя бы одно ваше животное способно получить еду или убежище, заканчивать питание нельзя (правила «Растений»)",
	"dock.feed.skipConfirmTitle": "Закончить питание?",
	"dock.feed.skipConfirmOne": "Не накормлено {n} животное. В фазе вымирания они погибнут.",
	"dock.feed.skipConfirmMany": "Не накормлено {n} животных. В фазе вымирания они погибнут.",
	"dock.feed.skipConfirmFed": "Все животные сыты. Закончить питание?",
	"dock.feed.backToTurn": "Вернуться к ходу",
	"dock.feed.rageBanner": "Бешенство: животное обязано атаковать — выберите жертву",
	"dock.feed.rageAttack": "Атака бешеного",
	"dock.feed.rageNoTarget": "Допустимой жертвы нет — заканчивайте ход",
	"hint.take": "Выберите животное — оно возьмёт фишку еды",
	"hint.takePlant": "Выберите животное, затем растение с едой",
	"hint.takeFlora": "Выберите животное, затем карту флоры",
	"hint.shelter": "Выберите животное, затем растение для убежища",
	"hint.hunt": "Выберите хищника, который охотится",
	"hint.pirate": "Выберите пирата, который отберёт еду",
	"hint.plantAttack": "Выберите хищное растение",
	"hint.parasitize": "Выберите растение-паразит, затем хозяина",
	"hint.hibernate": "Выберите животное, которое уйдёт в спячку до конца года",
	"hint.fat": "Выберите животное с жировым запасом",
	"hint.graze": "Выберите животное для выпаса на растении",
	"hint.target": "Выберите жертву — цели отмечены красным",
	"defense.title": "{attacker} атакует {prey}",
	"defense.need": "Нужно {need} еды, сейчас {food}. Выберите защиту.",
	"defense.running": "Быстрое — бросок кубика",
	"defense.mimicry": "Перенаправить на {target}",
	"defense.mimicryHint": "Мимикрия: текущая жертва избегает этой атаки, выбранное животное становится новой целью и может погибнуть.",
	"defense.tailLoss": "Отбросить хвост",
	"defense.tailDiscard": "Пожертвовать хвост: сбросить «{trait}»",
	"defense.none": "Не защищаться",
	"defense.plantIgnore": "Контратака: выберите одну игнорируемую защиту",
	"defense.ignore": "Игнорировать: {trait}",
	"log.plantIgnoreDefense": "Контратака игнорирует «{trait}».",
	"leave.title": "Покинуть стол?",
	"leave.bodySpectator": "Вы смотрите этот стол. Выйти в меню?",
	"leave.bodyPlayer": "Сдаться — ходы за вас будут пропускаться, животные погибнут от голода, а место останется за вами до финального счёта. Если просто выйти, партия встанет на вашем ходе, пока вы не вернётесь по ссылке.",
	"leave.confirmSpectator": "Покинуть стол",
	"leave.confirmPlayer": "Сдаться и выйти",
	"leave.stay": "Остаться",
	"leave.justLeave": "Просто выйти (без сдачи)",
	"feed.title.default": "Журнал",
	"feed.filter.all": "Всё",
	"feed.filter.log": "События",
	"feed.filter.chat": "Чат",
	"feed.filter.spectators": "Зрители",
	"feed.filterGroup": "Фильтр ленты",
	"feed.empty": "Пока пусто.",
	"feed.emptyTitle": "Пока пусто",
	"feed.newEntries": "новые",
	"feed.showNew": "Показать новые записи: {n}",
	"feed.collapse": "Свернуть «{title}»",
	"feed.expand": "Развернуть «{title}»",
	"feed.expandUnread": "Развернуть «{title}», новых записей: {n}",
	"feed.entries": "{title}: записи",
	"feed.typingOne": "{name} печатает…",
	"feed.typingTwo": "{a}, {b} печатают…",
	"feed.typingMany": "Несколько игроков печатают…",
	"feed.quickPhrases": "Быстрые фразы",
	"feed.diceButton": "Бросить кубик в чат",
	"feed.placeholder": "Сообщение…",
	"feed.messageAria": "Сообщение в чат",
	"feed.send": "Отправить сообщение",
	"chat.qp.hi": "Привет!",
	"chat.qp.goodMove": "Хороший ход!",
	"chat.qp.yourTurn": "Ваш ход",
	"chat.qp.thanks": "Спасибо!",
	"spot.mimicry": "Мимикрия",
	"spot.bankFood": "Еды на этот год: {n}",
	"spot.preyKilled": "Добыча убита",
	"spot.eats": "{a} съедает {b}",
	"spot.triesRun": "{a} пытается убежать",
	"spot.escaped": "Спаслось!",
	"spot.caught": "Хищник догнал!",
	"spot.survives": "{a} выживает",
	"spot.mimicryNote": "Атака перенаправлена на другое животное",
	"spot.counterattack": "Контратака растения",
	"spot.plantStrikes": "Растение бьёт по нападавшему",
	"spot.plantCatches": "Растение ловит {a}",
	"spot.paralysis": "Паралич",
	"spot.cannotAttack": "{a} не может атаковать в этом году",
	"spot.diedOneNoStarve": "Погибло животное — не от голода",
	"spot.diedOneStarve": "Погибло животное от голода",
	"spot.diedMany": "Погибло животных: {n}",
	"spot.diedManyStarve": "Погибло животных: {n} (от голода — {m})",
	"spot.skip": "Пропустить показ",
	"spot.clickHint": "клик по карточке — дальше",
	"spot.dieAria": "Кубик: {dice}",
	"spot.animal": "животное",
	"tableNote.joined": "{name} присоединился к столу",
	"tableNote.lostConnection": "{name} потерял связь",
	"tableNote.back": "{name} вернулся за стол",
	"tableNote.resigned": "{name} сдался — ходы пропускаются",
	"tableNote.left": "{name} покинул стол",
	"tableNote.queued": "{name} встал в очередь",
	"tableNote.unqueued": "{name} ушёл из очереди",
	"tableNote.watching": "{name} наблюдает за столом",
	"netErr.kicked": "Вас удалили из-за стола",
	"netErr.seatTaken": "Место больше не существует — вероятно, вас удалили или стол закрылся",
	"netErr.roomGone": "Стол больше не существует",
	"netErr.roomGoneCheck": "Стол не найден — проверьте код",
	"netErr.moveIllegal": "Такой ход сейчас недопустим",
	"netErr.resigned": "Вы сдались — ваши ходы пропускаются автоматически",
	"netErr.notPlaying": "Партия не идёт",
	"netErr.reorderPhase": "Сейчас нельзя переставлять животных",
	"netErr.reorderTurn": "Переставлять животных можно только в свой ход (сейчас ход другого игрока)",
	"netErr.reorderOwner": "Переставлять можно только своих животных",
	"netErr.renamePhase": "Сейчас нельзя переименовывать животных",
	"netErr.renameTurn": "Переименовывать животных можно только в свой ход (сейчас ход другого игрока)",
	"netErr.renameOwner": "Переименовывать можно только своих животных",
	"netErr.renameLength": "Имя животного — до 24 символов",
	"netErr.colorTaken": "Этот цвет уже занят — выберите другой",
	"netErr.chatEmpty": "Пустое сообщение",
	"netErr.rateLimit": "Слишком много сообщений — подождите минуту",
	"netErr.rateFast": "Слишком часто — подождите секунду",
	"netErr.reactionLimit": "Слишком много реакций — подождите минуту",
	"netErr.reactionMissing": "Сообщение не найдено в этом столе",
	"netErr.probeLimit": "Слишком много попыток — подождите",
	"netErr.entryLimit": "Слишком много подключений — подождите минуту",
	"netErr.createLimit": "Слишком много созданных столов — попробуйте позже",
	"netErr.notInQueue": "Вы больше не в очереди этого стола",
	"netErr.startedWithoutYou": "Партия началась без вас",
	"netErr.passwordRequired": "Стол приватный — введите пароль",
	"netErr.passwordWrong": "Неверный пароль стола",
	"netErr.passwordFormat": "Пароль стола — 4 цифры",
	"netErr.queueFull": "Очередь на этот стол переполнена — попробуйте позже",
	"netErr.hostOnly": "Это может только хост",
	"netErr.lobbyOnly": "Это можно делать до начала партии",
	"netErr.gameStarted": "Партия уже началась",
	"netErr.gameFinished": "Партия уже закончена",
	"netErr.gameRunning": "Партия ещё не закончена",
	"netErr.seatsUnfinished": "Заполните все места — людьми или ботами",
	"netErr.noFreeSeats": "Свободных мест пока нет",
	"netErr.seatRace": "Место только что заняли — попробуйте ещё раз",
	"netErr.retry": "Стол изменился, попробуйте ещё раз",
	"netErr.noSession": "Стол уже закрыт",
	"net.waitNote.capacityShrunk": "Хост уменьшил число мест — вы в очереди",
	"log.mutationsIntro": "Случайные мутации: у каждого игрока личная колода из 7 карт.",
	"log.firstTurn": "Год 1. Первым ходит {name}.",
	"log.newPlant": "Новое растение: {plant}.",
	"log.newPlantZone": "Новое растение: {plant} ({zone}).",
	"log.plantDeckEmpty": "Колода растений пуста — новых растений нет.",
	"log.newFlora": "Новая карта флоры: {flora}.",
	"log.newFloraZone": "Новая карта флоры: {flora} ({zone}).",
	"log.floraDeckEmpty": "Колода трав и грибов пуста — новых карт нет.",
	"log.markGained": "{name}: животное получает метку «{mark}».",
	"log.traitDiscarded": "Свойство «{trait}» уходит в сброс.",
	"log.commTakeBank": "Взаимодействие: {name} берёт еду из базы. База: {bank}.",
	"log.coopBlue": "Сотрудничество: {name} получает 1 синюю фишку.",
	"log.scavengerBlue": "Падальщик {name} получает 1 синюю фишку.",
	"log.plantEats": "Хищное растение съедает животное {name} ({value} очк.).",
	"log.preyPoisonousPlant": "Добыча была ядовитой — растение погибнет в вымирание.",
	"log.lostAnimal": "{name}: вид теряет животное (осталось {left}).",
	"log.regenerates": "Свойства съеденного регенерируют — владелец вернёт их животным.",
	"log.insectivore": "Насекомоядное: добыча без свойств — 1 синяя фишка вместо двух.",
	"log.hunterPoisoned": "Хищник {name} отравлен и погибнет в вымирание.",
	"log.paralyzedAshore": "Хищник парализован в океане — выброшен на континент.",
	"log.paralyzed": "Хищник {name} парализован стрекательными клетками.",
	"log.obligateFed": "{name}: облигатный хищник накормлен добычей.",
	"log.rageKills": "Бешеное животное {name} убивает животное {target} ({value} очк.) — добычу не ест.",
	"log.huntSuccess": "{name} охотится: {target} теряет животное ({value} очк.).",
	"log.animalPlaced": "{name} выкладывает новое животное.",
	"log.animalPlacedZone": "{name} выкладывает новое животное ({zone}).",
	"log.traitToOpponent": "{name}: {trait} → животное {target}.",
	"log.traitPlaced": "{name}: свойство {trait}.",
	"log.pairPlaced": "{name} связывает двух животных: {trait}.",
	"log.passed": "{name} пасует.",
	"log.simplificationSplit": "{name}: «Упрощение» — «{trait}» отделяется новым видом.",
	"log.simplificationAnimal": "{name}: «Упрощение» — карта ложится новым видом.",
	"log.mutantSpecies": "{name}: «{trait}» не подошло ни одному виду — появляется новый вид-мутант.",
	"log.cardAsAnimal": "{name}: карта ложится новым видом (свойство «{trait}» сыграть нельзя).",
	"log.harmfulMutation": "{name}: вредная мутация — «{trait}» на своём виде!",
	"log.mutation": "{name}: мутация «{trait}».",
	"log.mutationMoved": "{name}: «{trait}» не подошло виду — переехало соседнему.",
	"log.mutateAnimal": "{name}: объявлен новый вид — карта из колоды ложится животным.",
	"log.extremophileDiscard": "«Экстрофил»: дополнительная карта уходит в сброс.",
	"log.mutatePopulation": "{name}: вид получает +1 животное (численность {pop}).",
	"log.budding": "{name}: «Почкование» — вид растёт до {pop} животного(-ых).",
	"log.plantParasite": "{name}: растение-паразит на {plant}.",
	"log.plantTrait": "{name}: свойство {trait} → {plant}.",
	"log.micorrhiza": "{name}: микориза связывает {plant} и {plant2}.",
	"log.feedPlantsFungi": "Питание: еда этого года — на растениях, травах и грибах.",
	"log.feedPlants": "Питание: еда этого года — на растениях.",
	"log.feedFungi": "Питание: еда этого года — на травах и грибах.",
	"log.bankStart": "Определение кормовой базы.",
	"log.oceanBank": "Океан: кормовая база {bank}. На континентах еда — на столе флоры.",
	"log.basesRoll": "Кормовые базы — Лавразия {l}, Гондвана {g}, Океан {o}.",
	"log.diceBank": "Кубики кормовой базы: {dice}{extra} = {food}.",
	"log.oceanBankPlantsFungi": "Океан: кормовая база {bank}. На континентах еда — на столе флоры (растения и травы с грибами).",
	"log.oceanBankPlants": "Океан: кормовая база {bank}. На континентах еда — на столе флоры (растения).",
	"log.oceanBankFungi": "Океан: кормовая база {bank}. На континентах еда — на столе флоры (травы и грибы).",
	"log.bases": "Кормовые базы: Лавразия {l}, Гондвана {g}, Океан {o}.",
	"log.bank": "Кормовая база: {bank}.",
	"log.rage": "Бешенство: животное игрока {name} обязано атаковать в этот раунд!",
	"log.madness": "Безумие: раунд игрока {name} проводится ботом (в онлайн-версии пока не реализовано управление соседом).",
	"log.takeBank": "{name} берёт еду из базы ({left} осталось).",
	"log.medicinal": "{name}: лекарственное растение — животное накормлено, свойства не действуют до конца фазы.",
	"log.takePlant": "{name}: фишка с растения {plant} (осталось {left}).",
	"log.nutritious": "Питательное растение: ещё одна фишка.",
	"log.commTakePlant": "Взаимодействие: {name} берёт фишку с того же растения.",
	"log.honeyPlant": "Медонос: {name} вытягивает карту у {target}.",
	"log.plantCounter": "Хищное растение контратакует {name}!",
	"log.takeFlora": "{name}: фишка с карты {flora} (осталось {left}).",
	"log.commTakeFlora": "Взаимодействие: {name} берёт фишку с той же карты флоры.",
	"log.cleanser": "Очистительная трава: {name} оставляет одну фишку, прочие сняты.",
	"log.cleanserMarks": "Очистительная трава: {name} оставляет одну фишку, прочие сняты, меток снято: {marks}.",
	"log.insight": "Гриб прозрения: {name} сбрасывает всю руку ({lost} карт).",
	"log.soaringDrop": "Окрыляющий гриб: {dropped} парных свойств уходят в сброс.",
	"log.soaringFood": "Окрыляющий гриб: животное получает 1 синюю фишку.",
	"log.passionflower": "Страстоцвет: свойство «{trait}» становится новым животным {name}.",
	"log.barkBeetle": "{name}: «Короед» — убежище превращается в синюю фишку еды.",
	"log.shelter": "{name}: животное прячется в убежище ({plant}).",
	"log.plantAttack": "{name} направляет хищное растение на животное {target}!",
	"log.parasiteFeed": "{name}: фишка переходит на растение-паразит.",
	"log.rageAttack": "Бешеное животное игрока {name} атакует!",
	"log.hunt": "{name} атакует животное игрока {target}!",
	"log.piracy": "{name} пиратствует у {target}.",
	"log.hibernation": "{name} использует спячку.",
	"log.endTurn": "{name} заканчивает ход.",
	"log.fat": "{name} тратит жировой запас ({n}). Ход продолжается.",
	"log.grazeFlora": "{name}: топтун уничтожает фишку с карты {flora} (осталось {left}).",
	"log.grazePlant": "{name}: топтун уничтожает фишку растения {plant} (осталось {left}).",
	"log.grazeBank": "{name}: топотун уничтожает {burned} ед. еды. База: {bank}.",
	"log.migrate": "{name} объявляет миграцию ({count} животное(-ых)).",
	"log.pairSplit": "Парное свойство разъехавшихся животных уходит в сброс.",
	"log.runningEscape": "Быстрое: выпало {roll} — животное спаслось!",
	"log.runningCaught": "Быстрое: выпало {roll} — хищник догнал.",
	"log.runningCaughtPlant": "Быстрое: выпало {roll} — растение настигло.",
	"log.mimicry": "Мимикрия перенаправляет атаку.",
	"log.mimicryPlant": "Мимикрия перенаправляет атаку растения.",
	"log.tailLoss": "Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.",
	"log.tailLossRage": "Отбрасывание хвоста: животное выжило — бешеное не получает фишку.",
	"log.tailLossPlant": "Отбрасывание хвоста: животное выжило, растение получило 1 фишку.",
	"log.banksBurned": "Остатки кормовых баз ({total}) сгорают.",
	"log.bankBurned": "Остаток кормовой базы ({bank}) сгорает.",
	"log.starved": "Вид {name} теряет {deficit} животное(-ых) от голода (осталось {left}).",
	"log.poisonDeath": "Вид {name} теряет животное от яда (осталось {left}).",
	"log.diedPoison": "Хищник {name} погибает от яда.",
	"log.diedPoisonMark": "Животное {name} погибает от метки «Яд».",
	"log.diedStarved": "Животное {name} вымирает — не накормлено.",
	"dock.feed.follow": "Ваш {follower} → вслед за животным {migrant}",
	"dock.feed.finishMigration": "Оставить остальных прилипал",
	"dock.feed.finishMigrationHint": "Завершить выбор — отказаться от оставшихся следований. Остальные ваши прилипалы останутся на месте; уже выбранные переместились.",
	"dock.feed.recombine": "Рекомбинация: выберите обмен",
	"log.recombine": "Рекомбинация: животные обмениваются свойствами.",
	"log.neoplasiaDeath": "Неоплазия поглощает животное {name} целиком.",
	"log.neoplasiaDisable": "Неоплазия выключает свойство «{trait}».",
	"log.floraDiscarded": "Карта {flora} без фишек уходит в сброс.",
	"log.edificatorFloraLaurasia": "Эдификатор удобряет флору Лавразии.",
	"log.edificatorFloraGondwana": "Эдификатор удобряет флору Гондваны.",
	"log.floraGrowth": "Флора: травы подрастают, пустые карты уходят в сброс.",
	"log.plantDiedPoison": "Растение {plant} погибает — съело ядовитое животное.",
	"log.plantDiedHost": "Растение {plant} погибает — вместе с хозяином.",
	"log.plantDiedEaten": "Растение {plant} погибает — съедено дочиста.",
	"log.edificatorPlantsLaurasia": "Эдификатор удобряет растения Лавразии.",
	"log.edificatorPlantsGondwana": "Эдификатор удобряет растения Гондваны.",
	"log.plantsGrowth": "Фаза роста: растения разрастаются.",
	"log.regenerated": "{name} восстанавливает регенерировавшее животное.",
	"log.newYear": "Год {year}. Первым ходит {name}. Колода: {deck}.",
	"log.newYearLast": "Год {year} — последний. Первым ходит {name}.",
	"log.floraWin": "Победа: Трава и грибы ({total} очков).",
	"log.draw": "Ничья: {names}.",
	"log.win": "Победа: {name} ({total} очков).",
	"feedBlock.rageHuntOnly": "Сейчас ход бешенства: атаковать может только бешеное животное.",
	"feedBlock.rageOther": "Сейчас ход бешенства — другие действия недоступны.",
	"feedBlock.tookFood": "В этот ход уже брали еду из кормовой базы.",
	"feedBlock.afterCombat": "После охоты или пиратства красные фишки из базы брать нельзя.",
	"feedBlock.shelterBlocksFood": "Убежище занимает ход — еду брать нельзя.",
	"feedBlock.migratedFood": "Ход потрачен на миграцию — еду брать нельзя.",
	"feedBlock.noAnimals": "У игрока нет животных.",
	"feedBlock.plantsFoodYear": "В этот год еда на растениях — кормовая база не действует.",
	"feedBlock.obligateOnly": "Облигатный хищник кормится только добычей.",
	"feedBlock.allFed": "Все животные накормлены.",
	"feedBlock.noBankFood": "В кормовой базе этой территории нет еды.",
	"feedBlock.afterFoodNoHunt": "После взятия еды хищник не охотится.",
	"feedBlock.shelterBlocksHunt": "Убежище занимает ход — охотиться нельзя.",
	"feedBlock.migratedHunt": "Ход потрачен на миграцию — охотиться нельзя.",
	"feedBlock.huntersFed": "Хищники накормлены или не могут охотиться.",
	"feedBlock.noHunter": "Нет голодного хищника.",
	"feedBlock.huntersUsed": "Все хищники уже атаковали в этот ход.",
	"feedBlock.noPrey": "Нет добычи, доступной для атаки.",
	"feedBlock.afterFoodNoPiracy": "После взятия еды пират не ворует.",
	"feedBlock.shelterBlocksPiracy": "Убежище занимает ход — пиратство недоступно.",
	"feedBlock.migrated": "Ход потрачен на миграцию.",
	"feedBlock.continentsOff": "Модуль «Континенты» не включён.",
	"feedBlock.noRecombination": "Нет пары рекомбинации с доступным обменом.",
	"feedBlock.recombined": "Обмен уже выполнен в этом году.",
	"feedBlock.noPirate": "Нет животного с пиратством, которое может забрать еду.",
	"feedBlock.piratesFed": "Пираты накормлены — воровать нечего.",
	"feedBlock.piracyUsed": "Пиратство в этот ход уже использовано.",
	"feedBlock.noPiracyTarget": "Нет животного с едой, у которого можно украсть.",
	"feedBlock.hibernationUsed": "Спячка в этот ход уже использована.",
	"feedBlock.hibernationLastYear": "В последний год спячка недоступна.",
	"feedBlock.noSleeper": "Нет животного со спячкой.",
	"feedBlock.sleptLastYear": "Животное уже спало в прошлом году.",
	"feedBlock.plantsOff": "Модуль «Растения» не включён.",
	"feedBlock.afterFoodNoShelter": "Ход уже занят едой — убежище недоступно.",
	"feedBlock.afterCombatNoShelter": "После боя убежище недоступно.",
	"feedBlock.shelterUsed": "Убежище в этот ход уже занято.",
	"feedBlock.noShelters": "На растениях не осталось свободных убежищ.",
	"feedBlock.noShelterNeed": "Нет животного, которому нужно убежище.",
	"feedBlock.sheltersOtherZone": "Убежища остались в другой территории.",
	"feedBlock.shelterBlocksGraze": "Убежище занимает ход — топтать нельзя.",
	"feedBlock.noGrazer": "Нет животного с топтанием.",
	"feedBlock.grazersFed": "Все топтуны накормлены.",
	"feedBlock.grazersUsed": "Топтуны в этот ход уже топтали.",
	"feedBlock.noGrazeFood": "Нет еды, которую можно вытоптать.",
	"feedBlock.noFat": "Нет запасов жира.",
	"feedBlock.fatHungryOnly": "Конвертировать жир может только голодное животное.",
	"feedBlock.migrateOff": "Миграция доступна только с дополнением «Континенты».",
	"feedBlock.migrateUsed": "Миграция в этот ход уже объявлена.",
	"feedBlock.noMigrator": "Нет животного, готового мигрировать.",
	"feedBlock.noMigrationTarget": "Этому животному некуда мигрировать.",
	"feedBlock.skipBlocked": "Пас недоступен: есть животные, способные получить еду или убежище."
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
* Стор языка: единственный источник текущего языка для всей игры.
*
* Отдельный модуль (не в index.ts), чтобы terms.ts мог читать язык без
* циклического импорта словарей.
*
* SSR-контракт: на сервере и в первом клиентском рендере язык всегда «ru»
* — так разметка клиента совпадает с SSR и hydration не расходится.
* Сохранённый/определённый язык применяется после монтирования
* (initLang в useEffect корня, как имя игрока в net-screens.tsx).
*/
/** Ключ localStorage для выбранного языка. */
var LANG_STORAGE_KEY = "evo-lang";
var useLangStore = create(() => ({ lang: "ru" }));
/** Текущий язык без подписки (для вызовов вне React). */
function currentLang() {
	return useLangStore.getState().lang;
}
/**
* Автоопределение по настройкам устройства: основной язык браузера
* `en*` → en, иначе ru. Смотрим ТОЛЬКО navigator.language: список принятых
* языков почти всегда содержит en в хвосте (русскоязычные системы держат
* en-US второй раскладкой клавиатуры), и по нему игра ошибочно включала
* английский у русскоязычных игроков.
* На сервере (нет navigator) — ru.
*/
function detectLang() {
	if (typeof navigator === "undefined") return "ru";
	return (navigator.language ?? "").toLowerCase().startsWith("en") ? "en" : "ru";
}
/** Прочитать сохранённый язык; неверное/пустое значение — null. */
function storedLang() {
	try {
		const v = localStorage.getItem(LANG_STORAGE_KEY);
		return v === "en" || v === "ru" ? v : null;
	} catch {
		return null;
	}
}
/**
* Установить язык: обновить стор, сохранить выбор и поправить <html lang>.
* Вне React и внутри — одно и то же поведение.
*/
function setLang(lang) {
	useLangStore.setState({ lang });
	try {
		localStorage.setItem(LANG_STORAGE_KEY, lang);
	} catch {}
	if (typeof document !== "undefined") document.documentElement.lang = lang;
}
/** Переключить ru ↔ en. */
function toggleLang() {
	setLang(currentLang() === "ru" ? "en" : "ru");
}
/**
* Применить язык после монтирования (клиент): сохранённый выбор или
* автоопределение по устройству. Вызывается один раз из эффекта в корне
* приложения (см. LangInit в src/routes/__root.tsx).
*/
function initLang() {
	const lang = storedLang() ?? detectLang();
	useLangStore.setState({ lang });
	if (typeof document !== "undefined") document.documentElement.lang = lang;
}
/**
* Инлайн-скрипт для <head>: ставит <html lang> до первой отрисовки, чтобы
* скринридеры и браузер видели правильный язык сразу (разметку React
* он не трогает — та переключается после гидратации через initLang).
* Вставляется в __root.tsx; <html suppressHydrationWarning> глушит
* расхождение атрибута с SSR-значением «ru».
*/
var LANG_BOOT_SCRIPT = "(function(){try{var l=localStorage.getItem(\"evo-lang\");if(l!==\"en\"&&l!==\"ru\"){l=(navigator.language||\"\").toLowerCase().indexOf(\"en\")===0?\"en\":\"ru\";}document.documentElement.lang=l;}catch(e){}})();";
/**
* СЛОВАРЬ ТЕРМИНОВ «Эволюции» для английской локализации.
*
* Зачем: русские названия и описания живут в данных игры
* (`src/game/traits.ts`, `src/game/flora.ts`, `src/game/plants.ts`,
* `src/game/types.ts`, `src/lib/stats.ts`) — там же остаются источником
* правды для ru. Этот файл — английские соответствия: имена и описания
* свойств, видов флоры, растений, меток последствий, территорий и
* достижений. Терминология следует англоязычным изданиям настольной
* «Эволюции» (Carnivorous, Camouflage, Sharp Vision, High Body Weight,
* Fat Tissue, Running, Swimming, Tail Loss, Hibernation, Mimicry,
* Scavenger, Piracy, Symbiosis, Communication, Cooperation, Burrowing;
* «Континенты»: Migration, Herding, Nematocysts, Remora, Regeneration,
* Recombination, Edificator, Neoplasia; и т.д.).
*
* КАК ПОЛЬЗОВАТЬСЯ (следующий агент): не тащите переводы в данные игры —
* берите готовые хелперы из `src/lib/i18n/index.ts`:
*   traitName(id) / traitDesc(id) / traitShort(id) / floraName(k) / floraDesc(k) /
*   plantName(k) / plantDesc(k) / markName(k) / markDesc(k) / markShort(k) /
*   territoryName(id) / achievementName(id) / achievementDesc(id) /
*   scientistName(name) — имена ботов-учёных (Дарвин → Darwin).
* Они читают текущий язык из стора и сами возвращают русский текст из
* данных игры, если английского нет. Для строк стора/сервера
* (системные записи, ошибки) кладите ключи в ru.ts/en.ts, а имена
* свойств внутри шаблонов подставляйте этими хелперами.
*
* Если добавляется новое свойство в src/game/traits.ts — добавьте
* запись и сюда, иначе правила/тултипы покажут русское название.
*/
var TRAIT_EN = {
	carnivore: {
		name: "Carnivorous",
		desc: "Instead of taking food, a carnivore attacks another animal and, on success, gets 2 blue tokens. Hunting and eating from the food bank can't be combined in one turn; each carnivore attacks once per turn. A fed carnivore doesn't hunt. Food requirement +1."
	},
	swimming: {
		name: "Swimming",
		desc: "Only a swimming carnivore can eat this animal — and a swimming carnivore can only hunt swimming prey. With “Continents”, the animal moves to the Ocean right away."
	},
	camouflage: {
		name: "Camouflage",
		desc: "A carnivore cannot see this animal: only a carnivore with “Sharp Vision” can attack it."
	},
	sharpVision: {
		name: "Sharp Vision",
		desc: "Spots the hidden: a carnivore with sharp vision can attack animals with “Camouflage”."
	},
	burrowing: {
		name: "Burrowing",
		desc: "While the animal is fed, carnivores leave it alone. Fat tissue doesn't count as being fed: a hungry animal in a burrow is defenseless."
	},
	scavenger: {
		name: "Scavenger",
		desc: "Whenever any carnivore eats an animal whole, one scavenger on the table gets 1 blue token: searched in turn order starting from the carnivore's owner. Can't be combined with “Carnivorous” or “Obligate Carnivore”."
	},
	symbiosis: {
		name: "Symbiosis",
		desc: "The card is placed between two of your animals. The first animal, the symbiont, protects the second: while the symbiont is alive, nothing can eat the second one, but it can only be fed after the symbiont has eaten."
	},
	piracy: {
		name: "Piracy",
		desc: "Once per turn a hungry pirate steals 1 token from any unfed animal, yours or an opponent's. The token keeps its color; after stealing, food from the bank is unavailable this turn. A fed pirate doesn't steal."
	},
	tailLoss: {
		name: "Tail Loss",
		desc: "When this animal is attacked, discard this card: the animal survives and the carnivore gets 1 blue token instead of two. Also saves from a carnivorous plant."
	},
	grazing: {
		name: "Grazing",
		desc: "Once per turn the animal can trample 1 food token: from the food bank, a plant, or a flora card. Trampling can be combined with eating in the same turn."
	},
	cooperation: {
		name: "Cooperation",
		desc: "A card between two animals: when one gets food (from the bank, by hunting, or stolen), the other immediately gets 1 blue token. Converting fat into food doesn't trigger it."
	},
	running: {
		name: "Running",
		desc: "When attacked, roll a die: 4, 5 or 6 and the animal escapes. The carnivore's attack is wasted: it cannot hunt for the rest of this turn (it can try again next turn)."
	},
	highBodyWeight: {
		name: "High Body Weight",
		desc: "Only a carnivore that also has “High Body Weight” can eat this animal. Food requirement +1."
	},
	parasite: {
		name: "Parasite",
		desc: "Can only be placed on another player's animal. Its food requirement is +2, and at the end of the game 2 extra points go to the animal's owner."
	},
	fatTissue: {
		name: "Fat Tissue",
		desc: "The only trait that can be placed on an animal multiple times. A fed animal's extra food goes into fat, one token per card. A hungry animal can convert fat into blue tokens at any moment: it's a free action and doesn't spend a turn."
	},
	communication: {
		name: "Communication",
		desc: "A card between two animals: when one takes a red token from the food bank, the other immediately takes one too. With “Plants” and “Grass and Mushrooms” the partner takes a token from the same plant or flora card."
	},
	poisonous: {
		name: "Poisonous",
		desc: "A carnivore that eats this animal whole is poisoned and dies in the extinction phase. A mere tail or prey of an “Insectivore” doesn't poison the carnivore."
	},
	hibernation: {
		name: "Hibernation",
		desc: "The animal sleeps and counts as fed until the end of the year: it no longer takes food, not even into fat tissue. It cannot sleep two years in a row or in the final year; only one of your animals can hibernate per turn."
	},
	mimicry: {
		name: "Mimicry",
		desc: "When a carnivore attacks, redirect it to another of your animals that it could eat. Redirection can go down a chain, but an animal that has already escaped this attack cannot escape a second time."
	},
	migration: {
		name: "Migration",
		desc: "Declared instead of a normal turn: this turn is only travel — no food, no hunting. Your animals with this trait travel from the Ocean to any continent, and from a continent to the Ocean (swimmers only). There's no direct route between continents; each animal migrates once per feeding phase."
	},
	remora: {
		name: "Remora",
		desc: "Doesn't travel on its own. When a migration is declared, each remora of the same area may follow the migrant at its owner's choice, resolved in turn order. In the Ocean only swimmers follow. Sleeping remoras stay behind."
	},
	herding: {
		name: "Herding",
		desc: "Herding animals cannot be attacked while their number is equal to or greater than the number of carnivores in the same territory. The count is shared: all herding animals, even other players', against all carnivores and carnivorous plants of that territory."
	},
	nematocysts: {
		name: "Nematocysts",
		desc: "Even after an unsuccessful attack, all the attacking carnivore's traits stop working until feeding ends and its food requirement becomes 1. Cards remain and traits recover after starvation is determined. If the attack happened in the Ocean, the paralyzed carnivore is also washed ashore onto a continent."
	},
	regeneration: {
		name: "Regeneration",
		desc: "Can only be placed on an animal with no traits or one trait that doesn't increase food requirement. Its food requirement can no longer be increased, and it will never have more than two traits. An animal eaten by a carnivore returns to play: in the extinction phase you'll place a card from your hand (or from the deck) as a new animal, with no extra draw for it."
	},
	recombination: {
		name: "Recombination",
		desc: "A pair card between two animals of the same territory. Once per year, during its owner's feeding turn, each partner gives the other one unpaired trait. A duplicate goes to the discard; a one-shot trait already used by its previous owner (hibernation this year, piracy/grazing this turn) stays spent. A swimmer that loses “Swimming” in the Ocean moves to a continent."
	},
	edificator: {
		name: "Edificator",
		desc: "Every year each edificator adds 2 food tokens to the bank of the continent it stands on; one standing in the Ocean feeds the Ocean bank. With “Plants” and “Grass and Mushrooms”, continental edificators fertilize the plants and flora of their area instead: 1 token to each card. A sleeping edificator adds nothing."
	},
	neoplasia: {
		name: "Neoplasia",
		desc: "A virus: placed under all traits of an opponent's animal. Every year at food supply determination it rises and disables another unpaired trait (paired ones are untouched). A disabled trait doesn't work and gives no points; when there's nothing left to disable, the animal dies immediately. “Swimming” in the Ocean is untouched by the virus."
	},
	plantWater: {
		name: "Water Plant",
		desc: "Plant trait. Only swimming animals can feed from it."
	},
	thorny: {
		name: "Thorny",
		desc: "Plant trait. Brings 3 shelter tokens to the plant. Nothing touches an animal under shelter until the end of the feeding phase: neither carnivores nor carnivorous plants."
	},
	rootVegetable: {
		name: "Root Vegetable",
		desc: "Plant trait. The tasty roots go to burrowing animals only."
	},
	medicinal: {
		name: "Medicinal",
		desc: "Plant trait. The animal gets a token but is sedated until the end of the feeding phase: its traits don't work, only a shelter token can save it. A fed animal's token goes into fat tissue."
	},
	plantParasite: {
		name: "Plant Parasite",
		desc: "Plant trait. Settles on a host plant and lives as a separate plant: with its own traits and even its own parasites. On your turn, instead of eating, you may move 1 token from the host to the parasite (not the last one). A parasite survives without tokens but dies without its host; it doesn't count toward the plant limit."
	},
	micorrhiza: {
		name: "Micorrhiza",
		desc: "A trait of two plants at once, placed between them. The link doesn't die of hunger while at least one of its plants has food, and emptied plants get 1 token at the end of the growth phase. One plant can be linked to several."
	},
	tree: {
		name: "Tree",
		desc: "Plant trait. The branches are high up: only high body weight animals can take food from it. Brings 1 shelter token to the plant."
	},
	nutritious: {
		name: "Nutritious",
		desc: "Plant trait. Having taken a token, the animal gets one more. Carnivores may eat from this plant."
	},
	honeyPlant: {
		name: "Honey Plant",
		desc: "Plant trait. Your animal has eaten and draws a random card from the opponent with the fullest hand, if that opponent has more cards than you. No such opponents: no card is drawn."
	},
	transparent: {
		name: "Transparent",
		desc: "A carnivore won't touch this animal while it has no red or blue token. Fat tissue doesn't count."
	},
	insectivore: {
		name: "Insectivore",
		desc: "Small prey: for an animal without traits (including one with the “Sleep” mark) the carnivore gets 1 blue token instead of two."
	},
	obligateCarnivore: {
		name: "Obligate Carnivore",
		desc: "Hunts once per turn and feeds only on prey: it takes no food from the bank, plants or other players' traits, but a successful attack fills it up completely. Food requirement +1. Can't be combined with “Carnivorous” or “Scavenger”."
	},
	budding: {
		name: "Budding",
		desc: "At the start of each of your turns in the development phase the species buds one more animal: its card comes from your personal deck. Budding bypasses the usual population limit of “no more than the number of your species”."
	},
	metabolicSyndrome: {
		name: "Metabolic Syndrome",
		desc: "A harmful mutation: the metabolism is too fast, each animal of the species requires 2 food tokens more. But at the end of the game the mutation brings 2 extra points."
	},
	barkBeetle: {
		name: "Bark Beetle",
		desc: "A harmful mutation. A hungry animal can't hide in a shelter: instead of protection it gets a blue food token, and the shelter token stays on the plant. For fed animals and obligate carnivores the shelter works as usual."
	},
	extremophile: {
		name: "Extremophile",
		desc: "A harmful mutation. Species growth comes at a price: each new animal costs an extra card, discarded from your personal deck. If one card is left in the deck, the animal can't be added."
	},
	developmentDefects: {
		name: "Development Defects",
		desc: "A harmful mutation. A carnivore attacking this species ignores one of its traits: the online version disables whichever defense hinders the attack the most."
	},
	simplification: {
		name: "Simplification",
		desc: "A harmful mutation. The last trait played on the species separates and becomes a new mutant species, and the “Simplification” card itself becomes yet another species."
	}
};
var FLORA_EN = {
	toadstool: {
		name: "Death Cap",
		desc: "The animal that takes a token gets the “Poison” mark (when the “Poison” mark is received, this animal's “Parasite” trait is discarded). In the extinction phase an animal with the “Poison” mark dies unless it has an “Antidote”."
	},
	mold: {
		name: "Mold",
		desc: "The animal that takes a token gets the “Antidote” mark: it doesn't die in extinction from the “Poison” mark or from eating an animal with the “Poisonous” trait."
	},
	madCap: {
		name: "Mad Cap",
		desc: "The animal that takes a token gets the “Madness” mark: at the start of the next round of the feeding phase its owner removes the mark. A bot controls their animals for that round; the neighbor does not participate — control by the right-hand neighbor is not yet implemented in the online version."
	},
	flyAgaric: {
		name: "Fly Agaric",
		desc: "The animal that takes a token gets the “Rage” mark: at the start of the next round of the feeding phase its owner removes the mark and must attack another animal with it, as a carnivore — even a fed one. The enraged animal doesn't eat its prey and gets no tokens; whatever the outcome, the round ends."
	},
	insight: {
		name: "Mushroom of Insight",
		desc: "Having taken a token, the animal's owner discards their whole hand to the discard pile. Looking at other players' cards (as the board game rule allows) is not yet implemented in the online version."
	},
	soaring: {
		name: "Soaring Mushroom",
		desc: "Having taken a token, the animal discards all its paired traits and then gets 1 blue token of extra food."
	},
	sleepGrass: {
		name: "Sleep Grass",
		desc: "The animal that takes a token gets the “Sleep” mark: it counts as an animal without traits (all traits, including paired ones, don't work) and its food requirement is 1. Marks on it keep working. “Insectivore” triggers when eating an animal with “Sleep”."
	},
	thryn: {
		name: "Tryn-Grass",
		desc: "The animal that takes a token gets the “Tryn” mark: it receives no marks when taking tokens from any grass or fungi, and a carnivore with “Tryn” receives no marks from eaten prey. A carnivore without “Tryn” that eats prey with “Tryn” and other marks receives all those marks at once."
	},
	datura: {
		name: "Jimson Weed",
		desc: "The animal that takes a token gets the “Haze” mark: a carnivore (or enraged animal) attacking it may ignore one of its traits (in the online version it's chosen automatically — the one that hinders the attack most)."
	},
	smile: {
		name: "Smile Grass",
		desc: "The animal that takes a token gets the “Pacifism” mark: it cannot attack using the “Carnivorous” trait or under the “Rage” mark, and cannot use “Piracy”."
	},
	cleanser: {
		name: "Cleansing Grass",
		desc: "Having taken a token, the animal loses all its other red and blue tokens (fat tissue remains) and all consequence marks."
	},
	passionflower: {
		name: "Passionflower",
		desc: "Having taken a token, the owner must take one trait of this animal (except “Parasite”) and play it as a new animal (in the online version the trait is chosen automatically — the topmost valid one)."
	}
};
var MARK_EN = {
	poison: {
		name: "Poison",
		desc: "In the extinction phase an animal with the “Poison” mark dies if it doesn't have the “Antidote” mark. When the “Poison” mark is received, the animal's “Parasite” trait is discarded."
	},
	antidote: {
		name: "Antidote",
		desc: "An animal with the “Antidote” mark doesn't die in extinction from the “Poison” mark or from the consequences of eating an animal with the “Poisonous” trait."
	},
	madness: {
		name: "Madness",
		desc: "At the start of the next round of the feeding phase the owner removes the mark from one of their animals. A bot controls their animals for that round; the neighbor does not participate — control by the right-hand neighbor is not yet implemented in the online version."
	},
	rage: {
		name: "Rage",
		desc: "At the start of the next round of the feeding phase the owner removes the mark from one of their animals and must attack another animal with it, as a carnivore (even a fed one). It doesn't eat its prey and gets no tokens; whatever the outcome, the round ends."
	},
	sleep: {
		name: "Sleep",
		desc: "The animal counts as an animal without traits: all traits, including paired ones, don't work, and its food requirement is 1. Marks on it keep working."
	},
	thryn: {
		name: "Tryn",
		desc: "The animal receives no marks when taking tokens from grass and fungi; a carnivore with “Tryn” receives no marks from eaten prey. A carnivore without “Tryn” that eats prey with “Tryn” and other marks receives all the marks at once."
	},
	haze: {
		name: "Haze",
		desc: "A carnivore (or enraged animal) about to attack this animal may ignore one of its traits."
	},
	pacifism: {
		name: "Pacifism",
		desc: "The animal cannot attack with the “Carnivorous” trait or in rage, and cannot use “Piracy”."
	}
};
var PLANT_EN = {
	perennial: {
		name: "Perennial",
		desc: "Grows by the scheme 1→2, 2→3, 3+→5 (5 tokens max). Appears with 3 tokens."
	},
	annual: {
		name: "Annual",
		desc: "Grows by the scheme 0→1, 1→2, 2+→3 (3 max). The only plant that survives without tokens: it gets 1 token at the end of the growth phase."
	},
	fruit: {
		name: "Fruit Plant",
		desc: "Grows by the scheme 1→5, 2→4, 3+→3 (5 max): at 3–4 tokens it waits out a bad season. Gives 1 shelter. Carnivores may take food from it."
	},
	succulent: {
		name: "Succulent",
		desc: "Grows by the scheme 1→2, 2→3, 3+→4 (4 max). Gives 1 shelter. Carnivores may take food from it."
	},
	legume: {
		name: "Legume",
		desc: "Grows by the scheme 1→3, 2→4, 3+→5 (5 max) — always +2."
	},
	grass: {
		name: "Grass",
		desc: "Grows by the scheme 1→2, 2→4, 3+→5 (5 max). Appears with 2 tokens (scheme reconstructed from the rulebook illustration)."
	},
	liana: {
		name: "Liana",
		desc: "In the growth phase it gets as many tokens as there are non-liana plants on the table (parasites counted). 6 max (reconstruction)."
	},
	fungus: {
		name: "Fungus",
		desc: "Whenever any animal dies, each fungus gets 1 token (6 max — reconstruction). Carnivores may take food from it."
	},
	carnivorous: {
		name: "Carnivorous Plant",
		desc: "Once per feeding phase it attacks: it counterattacks the animal taking food from it (ignoring one of its defenses), or one of the players directs it at another player's animal. Eats an animal — 2 tokens, gets a tail — 1, eats a poisonous one — dies in extinction. 6 tokens max, starts empty. Carnivores may take food from it."
	},
	parasite: {
		name: "Plant Parasite",
		desc: "A standalone plant with its own traits. Doesn't count toward the plant limit. Feeding turn: instead of eating you may move 1 token from the host to the parasite (not the last one). Survives without tokens; dies together with its host."
	}
};
var TERRITORY_EN = {
	laurasia: "Laurasia",
	gondwana: "Gondwana",
	ocean: "Ocean"
};
var ACHIEVEMENT_EN = {
	"first-win": {
		name: "First Victory",
		desc: "Win a game"
	},
	"wins-5": {
		name: "Natural Selection",
		desc: "5 wins in total"
	},
	"streak-3": {
		name: "Dominant Species",
		desc: "3 wins in a row"
	},
	apex: {
		name: "Apex Predator",
		desc: "Declare 5 or more attacks in a game"
	},
	gourmet: {
		name: "Abundance",
		desc: "Collect 15 or more food tokens in a game"
	},
	"clean-pop": {
		name: "Clean Population",
		desc: "Win without losing a single animal"
	},
	"hard-win": {
		name: "Environmental Pressure",
		desc: "Win on “Harder” difficulty"
	},
	"big-table": {
		name: "Overpopulation",
		desc: "A game at an 8-player table"
	},
	"win-continents": {
		name: "Pangaea",
		desc: "Win with the “Continents” expansion"
	},
	"win-plants": {
		name: "Gardener",
		desc: "Win with the “Plants” expansion"
	},
	"win-fungi": {
		name: "Mushroomer",
		desc: "Win with the “Grass and Mushrooms” expansion"
	},
	"win-mutations": {
		name: "Radiation",
		desc: "Win with the “Random Mutations” expansion"
	},
	"all-modules": {
		name: "Full Ecosystem",
		desc: "A game with all four expansions"
	},
	darwin: {
		name: "Darwinism",
		desc: "Play 25 games"
	},
	escape: {
		name: "Narrow Escape",
		desc: "3 successful defenses in a game"
	},
	"five-traits": {
		name: "Complex Organism",
		desc: "An animal with five traits"
	}
};
var TRAIT_SHORT_EN = {
	carnivore: "Carnivore",
	swimming: "Water",
	camouflage: "Camouflage",
	sharpVision: "Vision",
	burrowing: "Burrow",
	scavenger: "Scavenger",
	symbiosis: "Symbiosis",
	piracy: "Pirate",
	tailLoss: "Tail",
	grazing: "Grazer",
	cooperation: "Co-op",
	running: "Running",
	highBodyWeight: "Big",
	parasite: "Parasite",
	fatTissue: "Fat",
	communication: "Comm.",
	poisonous: "Poison",
	hibernation: "Sleep",
	mimicry: "Mimicry",
	migration: "Migr.",
	remora: "Remora",
	herding: "Herding",
	nematocysts: "Stings",
	regeneration: "Regen.",
	recombination: "Recomb.",
	edificator: "Edifice",
	neoplasia: "Neoplasia",
	plantWater: "Water",
	thorny: "Thorny",
	rootVegetable: "Root",
	medicinal: "Medic.",
	plantParasite: "P-parasite",
	micorrhiza: "Micorrhiza",
	tree: "Tree",
	nutritious: "Rich",
	honeyPlant: "Honey",
	transparent: "Transp.",
	insectivore: "Insect.",
	obligateCarnivore: "Obligate",
	budding: "Budding",
	metabolicSyndrome: "Metab.",
	barkBeetle: "Beetle",
	extremophile: "Extreme",
	developmentDefects: "Defects",
	simplification: "Simple"
};
var MARK_SHORT_EN = {
	poison: "Poison",
	antidote: "Antidote",
	madness: "Madness",
	rage: "Rage",
	sleep: "Sleep",
	thryn: "Tryn",
	haze: "Haze",
	pacifism: "Pacifism"
};
var SCIENTIST_EN = {
	"Дарвин": "Darwin",
	"Уоллес": "Wallace",
	"Мендель": "Mendel",
	"Линней": "Linnaeus",
	"Кювье": "Cuvier",
	"Ламарк": "Lamarck",
	"Геккель": "Haeckel"
};
/** Отображаемое имя игрока: боты-учёные переводятся, люди — как есть. */
function scientistName(name, lang = currentLang()) {
	if (lang !== "en") return name;
	const direct = SCIENTIST_EN[name];
	if (direct) return direct;
	const m = /^(.+?)\s+(\d+)$/.exec(name);
	if (m) {
		const base = SCIENTIST_EN[m[1]];
		if (base) return `${base} ${m[2]}`;
	}
	return name;
}
function traitName(id, lang = currentLang()) {
	return (lang === "en" ? TRAIT_EN[id]?.name : void 0) ?? TRAITS[id]?.name ?? id;
}
function traitDesc(id, lang = currentLang()) {
	return (lang === "en" ? TRAIT_EN[id]?.desc : void 0) ?? TRAITS[id]?.description ?? "";
}
/** Короткая подпись свойства для чипов/кнопок граней карты руки. */
function traitShort(id, lang = currentLang()) {
	return (lang === "en" ? TRAIT_SHORT_EN[id] : void 0) ?? TRAITS[id]?.short ?? id;
}
function floraName(kind, lang = currentLang()) {
	return (lang === "en" ? FLORA_EN[kind]?.name : void 0) ?? FLORA[kind]?.name ?? kind;
}
function floraDesc(kind, lang = currentLang()) {
	return (lang === "en" ? FLORA_EN[kind]?.desc : void 0) ?? FLORA[kind]?.description ?? "";
}
function plantName(kind, lang = currentLang()) {
	return (lang === "en" ? PLANT_EN[kind]?.name : void 0) ?? PLANTS[kind]?.name ?? kind;
}
function plantDesc(kind, lang = currentLang()) {
	return (lang === "en" ? PLANT_EN[kind]?.desc : void 0) ?? PLANTS[kind]?.description ?? "";
}
function markName(kind, lang = currentLang()) {
	return (lang === "en" ? MARK_EN[kind]?.name : void 0) ?? MARKS[kind]?.name ?? kind;
}
function markDesc(kind, lang = currentLang()) {
	return (lang === "en" ? MARK_EN[kind]?.desc : void 0) ?? MARKS[kind]?.description ?? "";
}
/** Короткая подпись метки последствий для чипов на животном. */
function markShort(kind, lang = currentLang()) {
	return (lang === "en" ? MARK_SHORT_EN[kind] : void 0) ?? MARKS[kind]?.short ?? kind;
}
function territoryName(id, lang = currentLang()) {
	if (lang === "en") {
		const en = TERRITORY_EN[id];
		if (en) return en;
	}
	return TERRITORIES.find((t) => t.id === id)?.name ?? id;
}
function achievementName(id, lang = currentLang()) {
	const ruName = ACHIEVEMENTS.find((a) => a.id === id)?.name;
	return (lang === "en" ? ACHIEVEMENT_EN[id]?.name : void 0) ?? ruName ?? id;
}
function achievementDesc(id, lang = currentLang()) {
	const ruDesc = ACHIEVEMENTS.find((a) => a.id === id)?.desc;
	return (lang === "en" ? ACHIEVEMENT_EN[id]?.desc : void 0) ?? ruDesc ?? "";
}
/**
* i18n «Эволюции»: два языка (ru — по умолчанию, en), плоские ключи,
* подстановка параметров `{name}`, реактивность через Zustand.
*
* API:
*   useT()            — ГЛАВНЫЙ хук для компонентов: подписывает на смену
*                       языка и возвращает функцию перевода, привязанную к
*                       СНАПШОТУ языка. Во время гидратации снапшот — «ru»
*                       (getServerSnapshot), поэтому разметка совпадает с SSR
*                       без hydration mismatch; после монтирования снапшот
*                       переключается на сохранённый язык. Все строки в JSX —
*                       только через него.
*   t(key, params?)   — перевод по ЖИВОМУ состоянию стора: для обработчиков
*                       событий, эффектов и кода вне React. В рендере не
*                       использовать — при стриминговом SSR поздние границы
*                       гидратируются уже после initLang, и живой язык
*                       разошёлся бы с SSR-разметкой.
*   useLang()         — хук текущего языка ("ru" | "en") — тоже снапшот.
*   setLang(lang)     — переключить язык + сохранить в localStorage
*                       (ключ `evo-lang`) + поправить <html lang>.
*   toggleLang()      — ru ↔ en.
*   initLang()        — применить сохранённый/определённый язык после
*                       монтирования (вызывается один раз в __root.tsx).
*   detectLang()      — автоопределение по navigator.language.
*   translate(lang, key, params?) — чистая функция перевода.
*   pointsWord(lang, n) / playersWord(lang, n) / placeLabel(lang, n) —
*                       формы множественных чисел и порядковые номера мест.
*
* Словари: ru.ts (канонические ключи, `as const` — tsc ловит опечатки),
* en.ts (обязан покрыть все ключи ru — проверяет Record<keyof typeof ru, string>).
* Термины игры (свойства, флора, растения, метки, территории, достижения) —
* terms.ts с хелперами traitName(id, lang?)/... для следующей волны
* локализации стора и игровых экранов.
*
* SSR: первый рендер всегда ru (см. store.ts), после монтирования применяется
* сохранённый язык; <html lang> ставится инлайн-скриптом LANG_BOOT_SCRIPT
* до первой отрисовки.
*/
var DICTS = {
	ru,
	en
};
/**
* Чистый перевод: язык задан явно, без стора.
*
* Параметры-имена игроков (системные записи стола, журнал движка) приходят
* по-русски — сервер хранит имена ботов-учёных в БД по-русски. При lang=en
* такие значения переводятся через scientistName (Дарвин → Darwin, включая
* суффиксы «Дарвин 2»); люди и любые другие строки возвращаются как есть.
* Имена свойств/растений сюда не попадают: их переводят хелперы terms.ts
* до подстановки (termParamValue в game-app.tsx).
*/
function translate(lang, key, params) {
	const raw = DICTS[lang][key] ?? ru[key] ?? key;
	if (!params) return raw;
	return raw.replace(/\{(\w+)\}/g, (m, name) => {
		const v = params[name];
		if (v === void 0 || v === null) return m;
		return scientistName(String(v), lang);
	});
}
/** Перевод по живому языку стора: обработчики, эффекты, код вне рендера. */
function t(key, params) {
	return translate(useLangStore.getState().lang, key, params);
}
/**
* Хук перевода: подписывает компонент на смену языка и возвращает t,
* привязанный к снапшоту языка. Внутри компонента всегда используйте его:
* во время гидратации снапшот — «ru», и разметка совпадает с SSR.
*/
function useT() {
	const lang = useLangStore((s) => s.lang);
	return (0, import_react.useCallback)((key, params) => translate(lang, key, params), [lang]);
}
/** Хук текущего языка: "ru" | "en" (снапшот — при гидратации «ru»). */
function useLang() {
	return useLangStore((s) => s.lang);
}
/** Русская форма множественного числа: 1 очко / 2 очка / 5 очков. */
function pluralRu(n, one, few, many) {
	const a = Math.abs(n) % 100;
	const b = a % 10;
	if (a > 10 && a < 20) return many;
	if (b === 1) return one;
	if (b >= 2 && b <= 4) return few;
	return many;
}
function pluralEn(n, one, many) {
	return Math.abs(n) === 1 ? one : many;
}
/** «очко/очка/очков» | «point/points» — для фраз про разрыв в счёте. */
function pointsWord(lang, n) {
	return lang === "en" ? pluralEn(n, "point", "points") : pluralRu(n, "очко", "очка", "очков");
}
/** «игрок/игрока/игроков» | «player/players» — для фраз про разделённое место. */
function playersWord(lang, n) {
	return lang === "en" ? pluralEn(n, "player", "players") : pluralRu(n, "игрок", "игрока", "игроков");
}
/** Английский порядковый суффикс: 1st/2nd/3rd/4th/11th. */
function ordinalEn(n) {
	const v = Math.abs(n) % 100;
	if (v >= 11 && v <= 13) return "th";
	switch (v % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
}
/** «2-е место» | «2nd place» — подпись места для финала и статистики. */
function placeLabel(lang, n) {
	return lang === "en" ? `${n}${ordinalEn(n)} place` : `${n}-е место`;
}
/**
* Язык интерфейса: SSR и первый клиентский рендер всегда «ru» (см.
* src/lib/i18n/store.ts) — иначе текст расходится с серверной разметкой и
* React не чинит атрибуты («won't be patched up»). Сохранённый/определённый
* язык применяется ПОСЛЕ монтирования (как имя игрока в net-screens.tsx), а
* <html lang> до первой отрисовки ставит инлайн-скрипт LANG_BOOT_SCRIPT.
*/
function LangInit() {
	const lang = useLang();
	(0, import_react.useEffect)(() => {
		initLang();
	}, []);
	(0, import_react.useEffect)(() => {
		document.title = t("app.name");
		const meta = document.querySelector("meta[name=\"description\"]");
		if (meta) meta.setAttribute("content", t("app.description"));
	}, [lang]);
	return null;
}
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
			},
			{ title: "Эволюция" },
			{
				name: "theme-color",
				content: "#111410"
			},
			{
				name: "description",
				content: "Цифровая «Эволюция» — русская настольная игра о происхождении видов."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
			}
		],
		scripts: [{ children: LANG_BOOT_SCRIPT }]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ru",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangInit, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter = () => import("./routes-Cx90BnjJ.mjs");
var rootRouteChildren = { IndexRoute: createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") }).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { currentLang as C, readStats as D, emptySession as E, recordGame as O, traitShort as S, ACHIEVEMENTS as T, plantName as _, t as a, traitDesc as b, useT as c, floraDesc as d, floraName as f, plantDesc as g, markShort as h, pointsWord as i, achievementDesc as l, markName as m, placeLabel as n, translate as o, markDesc as p, playersWord as r, useLang as s, router_exports as t, achievementName as u, scientistName as v, toggleLang as w, traitName as x, territoryName as y };
