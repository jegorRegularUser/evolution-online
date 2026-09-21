import { i as TSS_SERVER_FUNCTION, n as createMiddleware, r as createServerFn } from "./ssr.mjs";
import { l as TRAITS, n as FLORA } from "./types-BR4PMx1a.mjs";
import { A as kickWaiterInput, B as reactionInput, D as isFed, E as isCarnivoreLike, G as setRoomPrivacyInput, H as setColorInput, I as moduleCompatibilityError, J as spectateInput, K as settingsInput, L as nextRandom, M as legalDevActions, N as legalFeedActions, O as joinRoomInput, P as listRoomsInput, R as player, S as findAnimal, T as hasTrait, U as setNameInput, V as roomInfoInput, W as setPasswordInput, X as transferHostInput, Y as spectatorPollInput, Z as typingInput, _ as createGame, c as applyAction, g as colorForSeat, h as codeTokenInput, i as PLAYER_COLORS, j as legalDefenseActions, k as kickInput, l as botsInput, m as chatInput, n as CODE_ALPHABET, o as actionInput, p as capacityInput, q as speciesNeed, r as PACE, s as animalValue, t as AI_NAMES, v as createRoomInput, w as hasMark, y as currentActor, z as pollInput } from "./module-compatibility-B0RnAr8M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-_SkZrsym.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Случайность сложности берётся из состояния партии (nextRandom),
* поэтому ходы ботов воспроизводимы по сиду вместе со всей игрой.
*/
function jitter(state) {
	const r = nextRandom(state);
	if (state.difficulty === "easy") return (r - .5) * 8;
	if (state.difficulty === "normal") return (r - .5) * 2;
	return 0;
}
function chooseAIAction(state) {
	if (state.pendingAttack) {
		const acts = legalDefenseActions(state, state.pendingAttack.waitingFor);
		if (!acts.length) return {
			type: "chooseDefense",
			kind: "none"
		};
		if (state.pendingAttack.choosingPlantDefense) return acts[0];
		return pickDefense(state, acts);
	}
	if (state.phase === "development") return pickDev(state, legalDevActions(state, state.currentPlayerId));
	if (state.phase === "feeding") return pickFeed(state, legalFeedActions(state, state.currentPlayerId));
	return null;
}
/**
* Сколько еды достанется одному игроку в этом году (ожидание).
* Точный бросок будет позже — в фазе кормовой базы, — поэтому считаем по числу
* игроков и модулям. Без этой оценки бот разводил животных больше, чем стол
* прокормит, и вымирал в ноль: в партиях на 2–3 игроков все смерти приходились
* на полностью опустошённую базу.
*/
function expectedBank(state) {
	const n = state.players.length;
	if (state.modules.continents) return n === 2 ? 20 : n === 3 ? 28 : 36;
	if (state.modules.plants || state.modules.fungi) return 6 + n;
	if (n === 2) return 5.5;
	if (n === 3) return 7;
	return 9;
}
/** Свободная доля стола: сколько еды остаётся «на меня» сверх текущей популяции. */
function foodSurplus(state, p) {
	return expectedBank(state) / Math.max(1, state.players.length) - p.animals.reduce((sum, a) => sum + speciesNeed(a), 0);
}
function pickDefense(state, acts) {
	const running = acts.find((a) => a.type === "chooseDefense" && a.kind === "running");
	if (running) return running;
	const mimic = acts.filter((a) => a.type === "chooseDefense" && a.kind === "mimicry").sort((a, b) => {
		return animalValue(findAnimal(state, a.mimicryTargetId)) - animalValue(findAnimal(state, b.mimicryTargetId));
	});
	if (mimic[0]) return mimic[0];
	const tails = acts.filter((a) => a.type === "chooseDefense" && a.kind === "tailLoss");
	const prey = findAnimal(state, state.pendingAttack.preyId);
	if (prey && tails.length) return tails.slice().sort((a, b) => {
		const ta = prey.traits.find((t) => t.id === a.discardTraitId);
		const tb = prey.traits.find((t) => t.id === b.discardTraitId);
		return (ta ? ta.disabled ? -99 : TRAITS[ta.type].aiValue ?? 1 : 0) - (tb ? tb.disabled ? -99 : TRAITS[tb.type].aiValue ?? 1 : 0);
	})[0];
	return acts.find((a) => a.type === "chooseDefense" && a.kind === "none") ?? acts[0];
}
function pickDev(state, acts) {
	const p = player(state, state.currentPlayerId);
	const stock = state.modules.randomMutations ? p.blindDeck?.length ?? 0 : p.hand.length;
	const surplus = foodSurplus(state, p);
	let best = acts[0];
	let bestScore = -Infinity;
	for (const a of acts) {
		let s = 0;
		if (a.type === "devPass") {
			s = stock <= (state.lastYear ? 0 : p.animals.length === 0 ? 0 : 1) ? 4 : stock <= 2 && !state.lastYear ? 1.5 : -1;
			if (p.animals.length === 0 && stock) s = -20;
		}
		if (a.type === "devPlayAnimal") {
			s = 6 - p.animals.length * 1.4;
			if (p.animals.length === 0) s = 14;
			if (state.lastYear) s = 8;
			if (surplus <= 0 && !state.lastYear) s -= 5;
			if (a.zoneId) {
				const inZone = p.animals.filter((x) => x.zoneId === a.zoneId).length;
				s -= inZone * .6;
				if (p.hand.find((c) => c.id === a.cardId)?.faces.includes("swimming")) s += .5;
			}
		}
		if (a.type === "devMutate") {
			if (a.intent === "newAnimal") {
				s = 6 - p.animals.length * 1.4;
				if (p.animals.length === 0) s = 14;
				if (state.lastYear) s = 8;
				if (a.zoneId) {
					const inZone = p.animals.filter((x) => x.zoneId === a.zoneId).length;
					s -= inZone * .6;
				}
			}
			if (a.intent === "trait") {
				const target = a.animalId ? findAnimal(state, a.animalId) : void 0;
				s = 4;
				if (target) {
					s += (3 - Math.min(3, target.traits.length)) * .8;
					if (target.traits.some((t) => t.disabled)) s -= 1;
				}
				if (state.lastYear) s += 1.5;
			}
			if (a.intent === "population") {
				const target = a.animalId ? findAnimal(state, a.animalId) : void 0;
				s = 3;
				if (target) {
					const worth = target.traits.reduce((v, t) => v + (TRAITS[t.type]?.aiValue ?? 0), 0);
					s += Math.max(0, Math.min(6, worth)) * .5;
					if (target.traits.some((t) => t.type === "budding")) s += 2;
				}
				if (state.lastYear) s += 3;
			}
			if (a.intent === "plant") {
				s = 2.2;
				if (state.lastYear) s -= 2;
			}
		}
		if (a.type === "devPlayTrait") {
			const card = p.hand.find((c) => c.id === a.cardId);
			const trait = card?.faces[a.face] ?? card?.faces[0];
			const animal = findAnimal(state, a.animalId);
			if (trait && animal) {
				s = (TRAITS[trait].aiValue ?? 2) + (animal.ownerId === p.id ? 1 : 0);
				if (trait === "parasite") {
					s = 7 + speciesNeed(animal) - (animal.ownerId === p.id ? 20 : 0);
					if (state.difficulty === "easy") s -= 3;
				}
				if (trait === "carnivore" && animal.ownerId === p.id) s += 3;
				if (trait === "fatTissue" && animal.ownerId === p.id) s += 2;
				if (animal.ownerId === p.id && surplus <= 0) {
					if (trait === "fatTissue" || trait === "symbiosis" || trait === "cooperation") s += 2;
					if (trait === "hibernation") s += 1;
				}
				if (trait === "carnivore" && animal.ownerId === p.id && a.face !== void 0) {
					const zone = animal.zoneId ?? "laurasia";
					const preyHere = state.players.flatMap((x) => x.animals).filter((x) => x.ownerId !== p.id && x.zoneId === zone).length;
					s += Math.min(preyHere, 3) * .7;
				}
				if (state.lastYear) s += TRAITS[trait].scoreBonus * 2 + 1;
			}
		}
		if (a.type === "devPlayPair") {
			s = 5;
			if (state.lastYear) s += 2;
		}
		if (a.type === "devPlayPlantTrait") {
			const card = p.hand.find((c) => c.id === a.cardId);
			const trait = card?.faces[a.face] ?? card?.faces[0];
			s = 2.5;
			if (trait === "plantParasite") {
				const plant = state.plants?.find((pl) => pl.id === a.plantId);
				s = plant ? 1.5 + Math.min(plant.food, 3) * .4 : 1.5;
			}
			if (trait === "thorny" || trait === "nutritious") s += 1;
			if (state.lastYear) s -= 2;
		}
		if (a.type === "devPlayPlantPair") {
			s = 2.8;
			if (state.lastYear) s -= 2;
		}
		s += jitter(state);
		if (s > bestScore) {
			bestScore = s;
			best = a;
		}
	}
	return best;
}
function hunger(a) {
	return Math.max(0, speciesNeed(a) - a.food);
}
/** Есть ли вообще еда, доступная этому игроку (по всем его территориям). */
function usedAllFood(state) {
	if (!state.modules.continents) return state.foodBank <= 0;
	return Object.values(state.territoryFood ?? {}).every((v) => (v ?? 0) <= 0);
}
function pickFeed(state, acts) {
	const p = player(state, state.currentPlayerId);
	let best = acts[0];
	let bestScore = -Infinity;
	const myHungry = p.animals.filter((a) => !isFed(a)).length;
	const oppHungry = state.players.filter((x) => x.id !== p.id).reduce((n, x) => n + x.animals.filter((a) => !isFed(a)).length, 0);
	for (const a of acts) {
		let s = 0;
		if (a.type === "feedTake") {
			const an = findAnimal(state, a.animalId);
			s = 10 + (3 - hunger(an)) + (hasTrait(an, "burrowing") ? 1.5 : 0);
			if (isCarnivoreLike(an) && hunger(an) <= 2) s -= .5;
		}
		if (a.type === "feedTakePlant") {
			const an = findAnimal(state, a.animalId);
			const plant = state.plants?.find((pl) => pl.id === a.plantId);
			s = 10 + (3 - hunger(an)) + (hasTrait(an, "burrowing") ? 1.5 : 0);
			if (plant) {
				s += Math.min(plant.food, 4) * .2;
				if (plant.traits.some((t) => t.type === "nutritious" && !t.disabled)) s += 1.5;
				if (plant.traits.some((t) => t.type === "medicinal" && !t.disabled) && an.traits.length > 2) s -= 4;
				if (plant.kind === "carnivorous") s -= 2.5;
			}
			if (isCarnivoreLike(an) && hunger(an) <= 2) s -= .5;
		}
		if (a.type === "feedTakeFlora") {
			const an = findAnimal(state, a.animalId);
			const f = state.flora?.find((fl) => fl.id === a.floraId);
			s = 10 + (3 - hunger(an)) + (hasTrait(an, "burrowing") ? 1.5 : 0);
			if (f) {
				const def = FLORA[f.kind];
				s += Math.min(f.food, 4) * .2 + def.aiHint;
				if (def.mark === "poison" && hasMark(an, "antidote")) s += 3;
				if (f.kind === "cleanser" && an.food > 1) s -= 5;
				if (f.kind === "insight") s -= Math.min(p.hand.length, 6) * .5;
				if (f.kind === "passionflower" && an.traits.length > 1) s -= 1.5;
			}
			if (isCarnivoreLike(an) && hunger(an) <= 2) s -= .5;
		}
		if (a.type === "feedShelter") {
			const an = findAnimal(state, a.animalId);
			s = state.players.some((x) => x.id !== p.id ? x.animals.some((c) => isCarnivoreLike(c) && !isFed(c)) : false) ? 7 + Math.min(animalValue(an), 8) * .3 : 1.5;
			if (isFed(an)) s -= 2;
		}
		if (a.type === "feedPlantAttack") {
			const prey = findAnimal(state, a.preyId);
			s = animalValue(prey) + 3 + (prey.ownerId !== p.id ? 0 : -12);
			if (state.difficulty === "easy") s -= 4;
		}
		if (a.type === "feedParasitize") s = 1;
		if (a.type === "feedHunt") {
			const prey = findAnimal(state, a.preyId);
			const car = findAnimal(state, a.carnivoreId);
			s = animalValue(prey) + (prey.ownerId !== p.id ? 4 : -6);
			s += hunger(car) * 1.2;
			if (hasTrait(prey, "poisonous")) s -= 5;
			if (state.difficulty === "easy") s -= 4;
			if (state.difficulty === "hard" && prey.ownerId === 0) s += 2;
		}
		if (a.type === "feedPirate") {
			const pirate = findAnimal(state, a.pirateId);
			const target = findAnimal(state, a.targetId);
			s = 6 + hunger(pirate);
			if (target.ownerId === pirate.ownerId && !isFed({
				...pirate,
				food: pirate.food + 1,
				blueFood: pirate.blueFood + 1
			})) s = -20;
		}
		if (a.type === "feedHibernate") {
			s = 5;
			if (state.foodBank > 3 && myHungry <= 1) s -= 2;
		}
		if (a.type === "feedConvertFat") s = 7;
		if (a.type === "feedGraze") {
			s = oppHungry > myHungry ? 2.5 : -1;
			if (state.foodBank <= 1) s -= 1;
		}
		if (a.type === "feedFinishMigration") s = 0;
		if (a.type === "feedRemora") {
			const follower = findAnimal(state, a.animalId);
			const route = state.pendingMigration.routes.find((r) => r.animalId === a.migrantId);
			s = hunger(follower) > 0 ? (state.territoryFood?.[route.to] ?? 0) - (state.territoryFood?.[route.from ?? "laurasia"] ?? 0) - 1 : -2;
		}
		if (a.type === "feedMigrate") {
			const mv = findAnimal(state, a.moves[0].animalId);
			s = 3;
			if (mv) s -= hunger(mv);
			if (myHungry > 0 && !usedAllFood(state)) s -= 6;
		}
		if (a.type === "feedRecombine") {
			const giver = findAnimal(state, a.giverId);
			const taker = findAnimal(state, a.takerId);
			const sent = giver.traits.find((t) => t.id === a.traitId);
			const received = taker.traits.find((t) => t.id === a.otherTraitId);
			const project = (host, outgoing, incoming) => {
				const traits = host.traits.filter((t) => t.id !== outgoing.id);
				if (TRAITS[incoming.type].stackable || !traits.some((t) => t.type === incoming.type)) traits.push({
					...incoming,
					disabled: false
				});
				return {
					...host,
					traits
				};
			};
			const after = [project(giver, sent, received), project(taker, received, sent)];
			const before = [giver, taker];
			s = -4;
			for (let i = 0; i < before.length; i++) {
				s += (Number(isFed(after[i])) - Number(isFed(before[i]))) * 12;
				s += hunger(before[i]) - hunger(after[i]);
			}
			if (a.to !== void 0) s -= 2;
		}
		if (a.type === "feedEndTurn") {
			const used = state.turnUse;
			s = used.foodTaken || used.combatUsed || used.grazers.length > 0 ? 2 : -5;
		}
		if (a.type === "feedSkip") s = myHungry === 0 ? 4 : -3;
		s += jitter(state);
		if (s > bestScore) {
			bestScore = s;
			best = a;
		}
	}
	return best;
}
/** Обезличенный тип для чужих закрытых свойств: UI в режиме «рубашка» его не читает. */
var REDACTED = "swimming";
/**
* Обезличить скрытые размещения свойств в чужом событии. Если владелец
* животного не найден (оно уже погибло), событие тоже обезличивается —
* безопаснее показать «рубашку», чем раскрыть тип.
*/
function redactEvents(events, seat, full) {
	return events.map((e) => {
		if (e.kind !== "traitPlaced" || !e.hidden) return e;
		const owner = full.players.find((p) => p.animals.some((a) => a.id === e.animalId));
		if (owner && owner.id === seat) return e;
		return {
			...e,
			type: REDACTED
		};
	});
}
function viewFor(full, seat) {
	const v = structuredClone(full);
	v.humanId = seat;
	v.deckCount = full.deck.length;
	v.plantDeckCount = full.plantDeck?.length;
	v.plantDeck = [];
	v.floraDeckCount = full.floraDeck?.length;
	v.floraDeck = [];
	v.deck = [];
	for (const p of v.players) {
		p.handCount = p.hand.length;
		p.blindDeckCount = p.blindDeck?.length;
		p.blindDeck = [];
		if (p.id === seat) continue;
		p.hand = [];
		for (const a of p.animals) for (const t of a.traits) if (t.hidden) t.type = REDACTED;
	}
	v.lastEvents = redactEvents(v.lastEvents, seat, full);
	return v;
}
/**
* Сервер комнат сетевой «Эволюции»: канонический GameState живёт в БД,
* клиенты шлют действия и опрашивают состояние. Движок вызывается только
* здесь — клиент получает персональный вид через viewFor().
*
* Конкурентность без транзакций: обёртка БД не отдаёт rowCount, а пул pg
* не держит транзакцию между запросами, поэтому все записи состояния идут
* оптимистично — условный UPDATE по version с RETURNING (см. casUpdate).
* Составные операции (create) проверяют вход и подчищают за собой при сбое.
*/
var NetError = class extends Error {
	code;
	constructor(message, code = "generic") {
		super(message);
		this.name = "NetError";
		this.code = code;
	}
};
var CODE_ALPHABET_LEN = CODE_ALPHABET.length;
/** Сколько батчей событий хранить в комнате и сколько отдавать за один poll. */
var MAX_EVENT_BATCHES = 40;
var POLL_MAX_BATCHES = 30;
var POLL_MAX_EVENTS = 60;
/** Чат: история при подключении, порция поллинга, длина и лимиты отправки. */
var CHAT_HISTORY = 50;
var CHAT_POLL_LIMIT = 100;
var CHAT_MAX_LEN = 400;
var CHAT_PER_MINUTE = 20;
var CHAT_MIN_GAP_MS = 700;
/** Реакции зрителей и болельщиков: тот же принцип, что у чата. */
var REACTION_PER_MINUTE = 20;
var REACTION_MIN_GAP_MS = 700;
/**
* «Печатает…»: отметка живёт 4 секунды (клиент поллингом сам гасит индикатор),
* а пинги чаще раза в секунду не пишутся — нажатия не долбят БД.
*/
var TYPING_FRESH_MS = 4e3;
var TYPING_MIN_GAP_MS = 1e3;
/** Очередь ожидающих: предел роста и TTL строки. */
var MAX_WAITERS = 16;
var WAITER_TTL_MS = 72e5;
/** Сколько столов отдавать в список меню за один запрос. */
var LIST_ROOMS_LIMIT = 40;
/**
* Мягкие лимиты жизненного цикла (S7) и анти-перебора (S2). Хранятся в
* памяти сервиса (см. rateHits): это защита от спама и брутфорса, а не
* суточная квота — при нескольких инстансах счётчик становится «на инстанс».
* Источник запроса (IP) передаёт api.ts — сам сервис контекста запроса не знает.
*/
/** Перебор кода комнаты/пароля: не больше 10 неудач за 5 минут на код+источник. */
var PROBE_FAIL_MAX = 10;
var PROBE_WINDOW_MS = 3e5;
/** Вход/наблюдение/переподключение: 30 запросов в минуту на источник. */
var ENTRY_PER_MINUTE = 30;
/**
* Создание столов: 10 в час на источник — спам комнатами раздувает БД.
* `EVO_CREATE_PER_HOUR` поднимает порог для браузерных QA-прогонов (они
* создают десятки комнат); защита по умолчанию не ослабляется, потому что
* переменная читается только при явной установке в окружении сервера.
*/
var CREATE_PER_HOUR = 10;
/** Порог создания столов с учётом окружения (значение по умолчанию — 10). */
function createPerHourLimit() {
	const raw = typeof process !== "undefined" ? Number(process.env?.EVO_CREATE_PER_HOUR) : NaN;
	return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : CREATE_PER_HOUR;
}
/** Коды ошибок, которые считаются «неудачной попыткой доступа» (S2). */
var PROBE_FAIL_CODES = /* @__PURE__ */ new Set([
	"room-gone",
	"password-required",
	"password-wrong",
	"seat-taken"
]);
/** Криптостойкое целое [0, max): Math.random для кодов комнат не годится (S2). */
function randomInt(max) {
	const limit = Math.floor(4294967296 / max) * max;
	const buf = /* @__PURE__ */ new Uint32Array(1);
	let v = 0;
	do {
		crypto.getRandomValues(buf);
		v = buf[0];
	} while (v >= limit);
	return v % max;
}
function makeCode() {
	let s = "";
	for (let i = 0; i < 4; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET_LEN)];
	return s;
}
function makeToken() {
	return crypto.randomUUID().replace(/-/g, "");
}
/**
* Цвета, занятые местами этого стола (в нижнем регистре): null у старых строк
* даёт детерминированный фолбэк colorForSeat — он тоже считается занятым,
* иначе визуально совпал бы с цветом нового игрока.
*/
function takenColors(seats) {
	return new Set(seats.map((s) => (s.color ?? colorForSeat(s.seat)).toLowerCase()));
}
/**
* Случайный СВОБОДНЫЙ цвет места из палитры (см. PLAYER_COLORS в shared.ts):
* цвет эксклюзивен в пределах стола. Если заняты все 16 (за столом максимум
* 8 мест — не случится, но код не должен падать) — фолбэк на любой.
*/
function pickColor(taken) {
	const used = new Set([...taken].map((c) => c.toLowerCase()));
	const free = PLAYER_COLORS.filter((c) => !used.has(c.toLowerCase()));
	const pool = free.length ? free : [...PLAYER_COLORS];
	return pool[randomInt(pool.length)];
}
/**
* Детерминированный СВОБОДНЫЙ цвет для бота: первый незанятый из палитры,
* начиная с индекса места. После перезапуска сервера и пересборки стола боты
* выглядят одинаково, но не совпадают с цветами, выбранными людьми.
*/
function botColor(seatNo, taken) {
	for (let i = 0; i < PLAYER_COLORS.length; i++) {
		const c = PLAYER_COLORS[(seatNo + i) % PLAYER_COLORS.length];
		if (!taken.has(c.toLowerCase())) return c;
	}
	return colorForSeat(seatNo);
}
/** Копия массива в случайном порядке (Фишер—Йетс): выбор жертв при M14. */
function shuffled(items) {
	const out = [...items];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}
/**
* Пароль приватного стола: 4 цифры без ведущего нуля — его диктуют голосом
* и пересылают в мессенджере, поэтому «0123» и «123» путались бы.
*/
function makePassword() {
	return String(1e3 + Math.floor(Math.random() * 9e3));
}
/** Пароль из формы создания: пусто — сгенерируем, иначе ровно 4 цифры. */
function normalizePassword(raw) {
	const clean = raw?.trim() ?? "";
	if (!clean) return makePassword();
	if (!/^\d{4}$/.test(clean)) throw new NetError("Пароль стола — 4 цифры", "password-format");
	return clean;
}
/** Присланный хостом пароль: только ровно ROOM_PASSWORD_LEN цифр, без генерации. */
function checkPassword(raw) {
	const clean = raw.trim();
	if (clean.length !== 4 || !/^\d+$/.test(clean)) throw new NetError(`Пароль стола — 4 цифры`, "password-format");
	return clean;
}
/**
* Сравнение секрета в постоянном времени (S2): длины выравниваем нулями и
* сравниваем через crypto.timingSafeEqual — побайтовое время не зависит от
* числа совпавших символов. node:crypto берём динамически: модуль серверный,
* а server.ts импортируется и клиентской сборкой (там ветка не исполняется,
* есть чистый JS-запасной вариант — он тоже без ранних выходов).
*/
async function secretEquals(a, b) {
	const len = Math.max(a.length, b.length);
	const av = new Uint8Array(len);
	const bv = new Uint8Array(len);
	for (let i = 0; i < a.length; i++) av[i] = a.charCodeAt(i) & 255;
	for (let i = 0; i < b.length; i++) bv[i] = b.charCodeAt(i) & 255;
	const sameLen = a.length === b.length;
	try {
		const { timingSafeEqual } = await import("node:crypto");
		return sameLen && timingSafeEqual(av, bv);
	} catch {
		let diff = sameLen ? 0 : 1;
		for (let i = 0; i < len; i++) diff |= av[i] ^ bv[i];
		return diff === 0;
	}
}
/**
* Проверка пароля приватного стола. Ошибки машиночитаемые: форма входа
* показывает пароль и текст, не выбрасывая человека в меню.
*/
async function requirePassword(room, given) {
	if (!room.is_private) return;
	const clean = given?.trim() ?? "";
	if (!clean) throw new NetError("Стол приватный — введите пароль", "password-required");
	if (!await secretEquals(clean, room.password ?? "")) throw new NetError("Неверный пароль стола", "password-wrong");
}
function toMs(v) {
	if (v instanceof Date) return v.getTime();
	const t = Date.parse(String(v));
	return Number.isNaN(t) ? 0 : t;
}
function isUniqueViolation(e) {
	return String(e.code) === "23505";
}
async function readRoom(sql, code) {
	const r = (await sql.query(`select code, status, capacity, difficulty, modules, settings as settings_json,
            host_seat, version, state as state_json, events as events_json,
            auto_step_at, turn_deadline_at, created_at, is_private, password
       from evo_rooms where code = $1`, [code]))[0];
	if (!r) return null;
	return {
		code: r.code,
		status: r.status,
		capacity: r.capacity,
		difficulty: r.difficulty,
		modules: r.modules ?? {},
		settings: r.settings_json ?? {},
		host_seat: r.host_seat ?? null,
		version: r.version,
		state: r.state_json ?? null,
		events: r.events_json ?? [],
		auto_step_at: r.auto_step_at,
		turn_deadline_at: r.turn_deadline_at,
		created_at: r.created_at,
		is_private: Boolean(r.is_private),
		password: r.password ?? null
	};
}
async function readSeats(sql, code) {
	return sql.query(`select seat, name, is_ai, resigned, last_seen_at, typing_at, color, token
       from evo_seats where room_code = $1 order by seat`, [code]);
}
async function readWaiters(sql, code) {
	return sql.query(`select token, name, (extract(epoch from created_at) * 1000)::float8 as at, typing_at
       from evo_waiters where room_code = $1 order by created_at, token`, [code]);
}
function waiterInfos(rows, now) {
	return rows.map((w) => ({
		name: w.name,
		at: w.at,
		typing: now() - toMs(w.typing_at) < TYPING_FRESH_MS
	}));
}
/** Эффективные настройки: settings приоритетнее колонок (обратная совместимость). */
function effectiveSettings(room) {
	const s = room.settings ?? {};
	return {
		...s,
		modules: s.modules ?? room.modules ?? {},
		difficulty: s.difficulty ?? room.difficulty
	};
}
/**
* Хост: сохранённый host_seat, если это место человека (сдавшиеся не в счёт);
* иначе минимальное место среди людей онлайн, иначе минимальное место человека,
* иначе 0. Передача хоста при выходе сохраняется через persistHost (см. poll).
*
* viewerSeat — место запрашивающего: пароль приватного стола отдаётся только
* хосту. Все прочие вызовы (ожидающий, зритель) пароль не получают.
*/
function metaOf(room, seats, now, viewerSeat) {
	const humans = seats.filter((s) => !s.is_ai && !s.resigned).map((s) => s.seat);
	const onlineHumans = seats.filter((s) => !s.is_ai && !s.resigned && now() - toMs(s.last_seen_at) < PACE.onlineMs).map((s) => s.seat);
	const saved = room.host_seat;
	const hostSeat = saved !== null && humans.includes(saved) ? saved : onlineHumans.length ? Math.min(...onlineHumans) : humans.length ? Math.min(...humans) : 0;
	return {
		code: room.code,
		status: room.status,
		capacity: room.capacity,
		hostSeat,
		settings: effectiveSettings(room),
		isPrivate: room.is_private,
		password: viewerSeat !== void 0 && viewerSeat === hostSeat ? room.password : null
	};
}
function seatsInfo(seats, now) {
	return seats.map((s) => ({
		seat: s.seat,
		name: s.name,
		isAI: s.is_ai,
		online: now() - toMs(s.last_seen_at) < PACE.onlineMs,
		resigned: s.resigned,
		color: colorForSeat(s.seat, s.color),
		typing: now() - toMs(s.typing_at) < TYPING_FRESH_MS
	}));
}
/** Включённые дополнения — белым списком и в фиксированном порядке. */
function enabledModules(settings, modules) {
	const effective = settings?.modules ?? modules ?? {};
	return [
		"continents",
		"plants",
		"fungi",
		"randomMutations"
	].filter((id) => effective[id]);
}
/** Свободные места по возрастанию: люди занимают низ, боты — хвост. */
function freeSeatList(capacity, seats) {
	const taken = new Set(seats.map((s) => s.seat));
	const free = [];
	for (let i = 0; i < capacity; i++) if (!taken.has(i)) free.push(i);
	return free;
}
/** Первое свободное место или -1. */
function firstFreeSeat(capacity, seats) {
	const free = freeSeatList(capacity, seats);
	return free.length ? free[0] : -1;
}
function countFreeSeats(capacity, seats) {
	return freeSeatList(capacity, seats).length;
}
/** Батчи с version > sinceVersion; жёсткий лимит, чтобы кадр не распухал. */
function batchesSince(all, sinceVersion) {
	const out = [];
	let total = 0;
	for (const b of all) {
		if (b.version <= sinceVersion) continue;
		if (out.length >= POLL_MAX_BATCHES) break;
		if (out.length > 0 && total + b.events.length > POLL_MAX_EVENTS) break;
		out.push(b);
		total += b.events.length;
	}
	return out;
}
/** Те же события, но уже без чужой скрытой информации. */
function viewEventBatches(batches, seat, full) {
	return batches.map((b) => ({
		version: b.version,
		events: redactEvents(b.events, seat, full)
	}));
}
/** sinceId не задан — последние сообщения (подключение/возврат за стол). */
async function readChat(sql, code, sinceId) {
	if (sinceId === void 0) return (await sql.query(`select id::int as id, seat, name, text,
              (extract(epoch from created_at) * 1000)::float8 as at
         from evo_chat where room_code = $1 order by id desc limit ${CHAT_HISTORY}`, [code])).reverse();
	return sql.query(`select id::int as id, seat, name, text,
            (extract(epoch from created_at) * 1000)::float8 as at
       from evo_chat where room_code = $1 and id > $2 order by id limit ${CHAT_POLL_LIMIT}`, [code, sinceId]);
}
async function readSpectators(sql, code, now) {
	return (await sql.query(`select token, name, last_seen_at, typing_at
       from evo_spectators where room_code = $1 order by created_at`, [code])).map((s) => ({
		name: s.name,
		online: now() - toMs(s.last_seen_at) < PACE.onlineMs,
		typing: now() - toMs(s.typing_at) < TYPING_FRESH_MS
	}));
}
async function readReactions(sql, code, sinceId) {
	const clause = sinceId === void 0 ? "" : "and id > $2";
	const params = sinceId === void 0 ? [code] : [code, sinceId];
	return (await sql.query(`select id::int as id, name, emoji, kind, target_seat, chat_id::int as chat_id,
            (extract(epoch from created_at) * 1000)::float8 as at
       from evo_reactions where room_code = $1 ${clause} order by id desc limit 60`, params)).reverse().map((r) => ({
		id: r.id,
		name: r.name,
		emoji: r.emoji,
		kind: r.kind,
		targetSeat: r.target_seat,
		chatId: r.chat_id,
		at: r.at
	}));
}
/** Публичный вид для зрителя: humanId=-1 — все руки/скрытые свойства обезличены. */
function spectatorView(full) {
	const view = viewFor(full, -1);
	view.humanId = 0;
	return view;
}
/**
* Условная запись состояния: применяется только если версия не сменилась.
* Возвращает true при успехе (ровно одна строка обновлена).
*
* eventsAppend дописывает батч текущего шага с version = version + 1 (ровно
* та версия, которую выставит этот же UPDATE) и хранит последние
* MAX_EVENT_BATCHES записей. events — полная замена (нужна при сбросе в лобби).
*
* Запись state автоматически снимает turn_deadline_at (M10): дедлайн всегда
* относится к конкретному положению партии, и любой шаг/действие/сдача/кик,
* меняющие состояние, обязаны начать отсчёт заново. Ставить метку можно
* только отдельным UPDATE без state — так она не переживёт смену хода.
*/
async function casUpdate(sql, code, version, fields) {
	const set = ["version = version + 1", "updated_at = now()"];
	const params = [];
	const push = (clause, value, cast = "") => {
		params.push(value);
		set.push(`${clause} $${params.length}${cast}`);
	};
	if (fields.state !== void 0) push("state =", JSON.stringify(fields.state), "::jsonb");
	if (fields.status !== void 0) push("status =", fields.status);
	if (fields.state !== void 0 && fields.turnDeadlineAt === void 0) set.push("turn_deadline_at = null");
	if (fields.turnDeadlineAt !== void 0) push("turn_deadline_at =", fields.turnDeadlineAt === null ? null : new Date(fields.turnDeadlineAt).toISOString());
	if (fields.autoStepAt !== void 0) push("auto_step_at =", fields.autoStepAt === null ? null : new Date(fields.autoStepAt).toISOString());
	if (fields.capacity !== void 0) push("capacity =", fields.capacity);
	if (fields.difficulty !== void 0) push("difficulty =", fields.difficulty);
	if (fields.modules !== void 0) push("modules =", JSON.stringify(fields.modules), "::jsonb");
	if (fields.settings !== void 0) push("settings =", JSON.stringify(fields.settings), "::jsonb");
	if (fields.hostSeat !== void 0) push("host_seat =", fields.hostSeat);
	if (fields.isPrivate !== void 0) push("is_private =", fields.isPrivate);
	if (fields.password !== void 0) push("password =", fields.password);
	if (fields.events !== void 0) push("events =", JSON.stringify(fields.events), "::jsonb");
	if (fields.eventsAppend !== void 0) {
		params.push(JSON.stringify(fields.eventsAppend));
		const p = params.length;
		set.push(`events = (select coalesce(jsonb_agg(e order by ord), '[]'::jsonb) from (select e, ord from jsonb_array_elements(events || jsonb_build_array(jsonb_build_object('version', version + 1, 'events', $${p}::jsonb))) with ordinality as t(e, ord) order by ord desc limit ${MAX_EVENT_BATCHES}) recent)`);
	}
	params.push(code, version);
	return (await sql.query(`update evo_rooms set ${set.join(", ")}
      where code = $${params.length - 1} and version = $${params.length}
      returning version`, params)).length === 1;
}
/** Повторяет casUpdate на свежей версии; бросает при исчерпании попыток. */
async function casUpdateStrict(sql, code, version, fields) {
	let v = version;
	for (let attempt = 0; attempt < 3; attempt++) {
		if (await casUpdate(sql, code, v, fields)) return;
		const fresh = await readRoom(sql, code);
		if (!fresh) throw new NetError("Стол не найден — проверьте код", "room-gone");
		v = fresh.version;
	}
	throw new NetError("Стол изменился, попробуйте ещё раз", "retry");
}
async function janitor(sql) {
	await sql.query(`delete from evo_seats where room_code in
       (select code from evo_rooms where created_at < now() - interval '12 hours')`);
	await sql.query(`delete from evo_rooms where created_at < now() - interval '12 hours'`);
	await sql.query(`delete from evo_waiters where room_code not in (select code from evo_rooms)
        or created_at < now() - interval '2 hours'`);
	await sql.query(`delete from evo_kicks where created_at < now() - interval '12 hours'`);
}
/**
* Шаг за игрока, у которого не осталось действий: «закончить ход» в его
* текущем смысле. В развитие это пас, в защите — отказ, в питании — именно
* завершение ХОДА (feedEndTurn), а не пас до конца фазы: игрок не теряет
* следующий ход раунда, если к нему снова появятся действия (то же, что
* кнопка «Закончить ход» в доке). feedSkip в «Растениях» бывает и запрещён.
*/
function endTurnStepFor(state, _actorId) {
	if (state.phase === "development") return { type: "devPass" };
	if (state.pendingAttack) {
		if (state.pendingAttack.choosingPlantDefense) return legalDefenseActions(state, state.pendingAttack.waitingFor)[0];
		return {
			type: "chooseDefense",
			kind: "none"
		};
	}
	return { type: "feedEndTurn" };
}
/**
* Шаг за сдавшегося: тот же набор, но в питании — пас до конца фазы (feedSkip):
* сдавшийся не должен возвращаться в круг, даже если еда ещё осталась.
*/
function resignedStepFor(state) {
	if (state.phase === "development") return { type: "devPass" };
	if (state.pendingAttack) {
		if (state.pendingAttack.choosingPlantDefense) return legalDefenseActions(state, state.pendingAttack.waitingFor)[0];
		return {
			type: "chooseDefense",
			kind: "none"
		};
	}
	return { type: "feedSkip" };
}
/**
* M10: у ходящего человека не осталось осмысленных действий — доступны только
* завершение хода/пас, а в защите единственный вариант «не защищаться».
* Боты и сдавшиеся не в счёт: у них свои автошаги. Пока есть хоть одно
* действие (карта, еда, охота, защита) — таймера нет (решение владельца Q2).
*/
function noChoicesLeft(state, actor) {
	if (actor.isAI || actor.resigned) return false;
	if (state.pendingAttack) return legalDefenseActions(state, actor.id).every((a) => a.type === "chooseDefense" && a.kind === "none");
	if (state.phase === "development") return legalDevActions(state, actor.id).every((a) => a.type === "devPass");
	if (state.phase === "feeding") return legalFeedActions(state, actor.id).every((a) => a.type === "feedEndTurn" || a.type === "feedSkip");
	return false;
}
/**
* Дедлайн авто-конца хода человека без действий (epoch ms) — клиент рисует по
* нему круговой отсчёт у имени. null: таймера нет (бот, автофаза, есть ходы).
*/
function turnDeadlineOf(room) {
	if (room.status !== "playing" || !room.state || room.turn_deadline_at === null) return null;
	if (nextAutoStep(room.state) !== null) return null;
	const actor = currentActor(room.state);
	if (!actor || !noChoicesLeft(room.state, actor)) return null;
	return toMs(room.turn_deadline_at);
}
/** Следующий шаг, который сервер делает сам; null — ждём ход человека. */
function nextAutoStep(state) {
	if (state.phase === "foodBank") return state.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" };
	if (state.phase === "extinction") return { type: "continueExtinction" };
	if (state.phase === "growth") return { type: "continueGrowth" };
	const actor = currentActor(state);
	if (!actor) return null;
	if (actor.resigned && !actor.isAI) return resignedStepFor(state);
	if (!actor.isAI && state.madTurn !== actor.id) return null;
	const pick = chooseAIAction(state);
	if (pick) return pick;
	return state.phase === "development" ? { type: "devPass" } : resignedStepFor(state);
}
/**
* Длительности модальных карточек клиента (spotlight.tsx, обычная скорость).
* После «драматических» шагов — бросок кубика базы, шаг, завершивший фазу с
* событиями (вымирание, убийство) — сервер держит паузу, пока клиент
* проигрывает карточки. Без паузы следующее состояние накрывало модалку, и
* владелец видел «обрыв после последнего хода фазы»: карточка не показывалась
* или срезалась на середине, а следующий этап начинался резко. Значения —
* зеркало buildItems в spotlight.tsx: меняются там — правятся и здесь.
*/
var SPOTLIGHT_MS = {
	diceRoll: 2900,
	preyKilled: 3e3,
	plantAttack: 2500,
	paralyzed: 2300
};
/** Защита добычи: бросок «Быстрого» — самый длинный показ с вердиктом. */
var SPOTLIGHT_DEFENSE_MS = {
	running: 3400,
	tailLoss: 2800,
	mimicry: 2400,
	none: 0
};
/** Сводка «Вымирание» — одна карточка на всех погибших в шаге. */
var SPOTLIGHT_EXTINCTION_MS = 2700;
/** Хвост паузы: доставка кадра поллингом (до 0.7 с) + анимация закрытия (0.28 с). */
var SPOTLIGHT_TAIL_MS = 900;
/** Сколько клиент будет показывать модальные карточки событий этого шага (мс). */
function spotlightMsOf(events) {
	let ms = 0;
	let deaths = 0;
	for (const e of events) if (e.kind === "defenseUsed") ms += SPOTLIGHT_DEFENSE_MS[e.defense];
	else if (e.kind === "animalDied") deaths += 1;
	else ms += SPOTLIGHT_MS[e.kind] ?? 0;
	if (deaths) ms += SPOTLIGHT_EXTINCTION_MS;
	return ms;
}
/**
* Пауза после шага, завершившего фазу: покрывает показ карточек его событий.
* Пустые переходы (без модальных событий) не растягиваем — паузы нет вовсе.
*/
function phaseGapMs(before, after) {
	if (before.phase === after.phase) return 0;
	const show = spotlightMsOf(after.lastEvents);
	return show > 0 ? show + SPOTLIGHT_TAIL_MS : 0;
}
function stepDelay(before, step, after) {
	const j = () => Math.round((Math.random() * 2 - 1) * PACE.jitterMs);
	if (step.type === "rollFoodBank") return Math.max(PACE.diceMs, spotlightMsOf(after.lastEvents) + SPOTLIGHT_TAIL_MS) + j();
	if (step.type === "continueExtinction") return PACE.extinctMs + j();
	if (step.type === "continueGrowth") return PACE.extinctMs + j();
	const changedTurn = before.currentPlayerId !== after.currentPlayerId;
	return Math.max(PACE.botMs + (changedTurn ? PACE.turnGapMs : 0), phaseGapMs(before, after)) + j();
}
/**
* Сравнение значений действия: undefined и отсутствие поля равнозначны
* (клиент шлёт `zoneId: undefined` из кода карт), массивы и вложенные объекты
* сравниваются поэлементно/пополево — лишнее или подменённое поле присланного
* не должно пройти незамеченным.
*/
function valueSame(a, b) {
	if (a === b) return true;
	if (a === void 0 || b === void 0) return false;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		return a.every((v, i) => valueSame(v, b[i]));
	}
	if (typeof a === "object" && typeof b === "object" && a !== null && b !== null) {
		const ao = a;
		const bo = b;
		const keys = /* @__PURE__ */ new Set([...Object.keys(ao), ...Object.keys(bo)]);
		for (const k of keys) if (!valueSame(ao[k], bo[k])) return false;
		return true;
	}
	return false;
}
/**
* S4: полная сверка присланного действия с легальным вариантом. Раньше
* сверялись только ID_KEYS — `feedConvertFat.amount`, `feedMigrate.moves`,
* `feedGraze.plantId/floraId`, `devMutate.intent/zoneId`, `devPlayAnimal.zoneId`
* проходили невалидированными и применялись как есть (конвертация всего жира
* вместо min(fat, need), топтун по чужому растению в обход зональных гейтов).
* Теперь сервер применяет именно канонический объект из легального списка.
*/
function sameAction(a, b) {
	return valueSame(a, b);
}
function createRoomService(sql, opts = {}) {
	const now = opts.now ?? (() => Date.now());
	/**
	* Мягкие лимиты жизненного цикла (S7) и анти-перебора (S2): скользящее окно
	* в памяти сервиса. Лимит «на инстанс» — осознанно мягкая защита от спама
	* комнатами и брутфорса, а не суточная квота. Источник запроса (IP) приходит
	* параметром от api.ts: сам сервис контекста запроса не знает, а внутренние
	* вызовы и тесты передают источник явно (без источника лимиты не считаются).
	*/
	const rateHits = /* @__PURE__ */ new Map();
	/** Окно ключа без записей: заодно чистим окно от старых отметок. */
	function rateWindow(key, windowMs) {
		const t = now();
		let arr = rateHits.get(key);
		if (!arr) {
			arr = [];
			rateHits.set(key, arr);
		}
		while (arr.length && t - arr[0] >= windowMs) arr.shift();
		return arr;
	}
	/** Бросает, если лимит уже исчерпан; сам ничего не записывает. Код — для перевода на клиенте. */
	function rateAssert(key, max, windowMs, message, code = "generic") {
		if (rateWindow(key, windowMs).length >= max) throw new NetError(message, code);
	}
	/** Отмечает попытку; редкая чистка не даёт карте расти от разовых ключей. */
	function rateHit(key, windowMs) {
		rateWindow(key, windowMs).push(now());
		if (rateHits.size > 2e3) {
			for (const [k, v] of rateHits) if (!v.length || now() - v[v.length - 1] >= windowMs) rateHits.delete(k);
		}
	}
	/**
	* Ключ анти-перебора для join/rejoin/spectate: код стола + источник.
	* Без источника (внутренние вызовы, тесты) лимит не применяется.
	*/
	function probeKey(kind, code, source) {
		return source ? `${kind}:${code.trim().toUpperCase()}:${source}` : null;
	}
	/**
	* S2: не больше PROBE_FAIL_MAX неудачных попыток за окно на код+источник.
	* Считаются только «попытки доступа» (room-gone, password-required,
	* password-wrong, seat-taken), успех попытки не сбрасывает — после
	* блокировки ждём окно целиком.
	*/
	async function withProbeGuard(key, run) {
		if (key) rateAssert(key, PROBE_FAIL_MAX, PROBE_WINDOW_MS, "Слишком много попыток — подождите", "probe-limit");
		try {
			return await run();
		} catch (e) {
			if (key && e instanceof NetError && PROBE_FAIL_CODES.has(e.code)) rateHit(key, PROBE_WINDOW_MS);
			throw e;
		}
	}
	/** S7: общий потолок входа/наблюдения/переподключения на источник. */
	function entryGuard(source) {
		if (!source) return;
		rateAssert(`entry:${source}`, ENTRY_PER_MINUTE, 6e4, "Слишком много подключений — подождите минуту", "entry-limit");
		rateHit(`entry:${source}`, 6e4);
	}
	async function requireRoom(code) {
		const room = await readRoom(sql, code);
		if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
		return room;
	}
	/** Токен без места: сначала проверяем, не кикнут ли он — сообщение важнее. */
	async function goneReason(code, token) {
		if ((await sql.query(`select 1 from evo_kicks where room_code = $1 and token = $2 limit 1`, [code, token])).length) throw new NetError("Вас удалили из-за стола", "kicked");
		throw new NetError("Место больше не существует — вероятно, вас удалили или стол закрылся", "seat-taken");
	}
	async function seatByToken(code, token) {
		const seat = (await sql.query(`select seat, name, is_ai, resigned, last_seen_at, token from evo_seats
        where room_code = $1 and token = $2`, [code, token]))[0];
		if (!seat) await goneReason(code, token);
		return seat;
	}
	/** Участник стола: место по токену либо ожидающий (seat = -1). */
	async function participantSeat(code, token) {
		const seat = (await sql.query(`select seat, name, is_ai from evo_seats where room_code = $1 and token = $2`, [code, token]))[0];
		if (seat) return {
			seat: seat.seat,
			name: seat.name,
			isAi: seat.is_ai
		};
		const w = await sql.query(`select name from evo_waiters where room_code = $1 and token = $2`, [code, token]);
		if (w[0]) return {
			seat: -1,
			name: w[0].name,
			isAi: false
		};
		const spec = await sql.query(`select name from evo_spectators where room_code = $1 and token = $2`, [code, token]);
		if (spec[0]) return {
			seat: -2,
			name: spec[0].name,
			isAi: false
		};
		return goneReason(code, token);
	}
	/** Участник чата: место по токену либо ожидающий (seat = -1). */
	async function participant(code, token) {
		const p = await participantSeat(code, token);
		if (p.isAi) throw new NetError("Боты не пишут в чат", "bot-chat");
		return {
			seat: p.seat,
			name: p.name
		};
	}
	/**
	* Хост-методы принимают и место, и ожидающего: вызывающий резолвится как
	* «место ИЛИ очередь», и ожидающий получает внятное «только хост», а не
	* «места не существует». Кикнутый токен по-прежнему получает код kicked.
	*/
	async function requireHost(code, token, deny, denyCode = "host-only") {
		const room = await requireRoom(code);
		const me = await participantSeat(code, token);
		const seats = await readSeats(sql, code);
		if (metaOf(room, seats, now).hostSeat !== me.seat) throw new NetError(deny, denyCode);
		return {
			room,
			seats,
			me
		};
	}
	/**
	* Уникальное имя в комнате: если «Дима» уже занят (места и очередь), новому
	* достаётся «Дима 1», затем «Дима 2» и так далее — с учётом лимита в 16
	* символов. Тёзки недопустимы: по name сервер считает лимит реакций, а UI
	* показывает имена без номеров мест. excludeToken исключает из проверки
	* собственную строку (переименование, занятие места из очереди).
	*/
	async function uniqueName(code, name, excludeToken) {
		const rows = await sql.query(`select name from evo_seats where room_code = $1 and ($2::text is null or token <> $2)
        union all
       select name from evo_waiters where room_code = $1 and ($2::text is null or token <> $2)
        union all
       select name from evo_spectators where room_code = $1 and ($2::text is null or token <> $2)`, [code, excludeToken ?? null]);
		const taken = new Set(rows.map((r) => r.name.trim().toLowerCase()));
		const base = name.trim().slice(0, 16);
		if (!taken.has(base.toLowerCase())) return base;
		for (let n = 1; n <= 99; n++) {
			const suffix = ` ${n}`;
			const candidate = base.slice(0, 16 - suffix.length) + suffix;
			if (!taken.has(candidate.toLowerCase())) return candidate;
		}
		return base.slice(0, 13) + " 99";
	}
	async function insertBots(code, capacity, count) {
		const seats = await readSeats(sql, code);
		const target = freeSeatList(capacity, seats).slice(-count);
		const taken = takenColors(seats);
		for (let i = 0; i < target.length; i++) {
			const name = await uniqueName(code, AI_NAMES[i % AI_NAMES.length]);
			const color = botColor(target[i], taken);
			taken.add(color.toLowerCase());
			await sql.query(`insert into evo_seats (room_code, seat, name, token, is_ai, color)
         values ($1, $2, $3, '', true, $4) on conflict do nothing`, [
				code,
				target[i],
				name,
				color
			]);
		}
	}
	/** Постановка в очередь ожидающих с ограничением роста. */
	async function enqueueWaiter(code, name) {
		if (((await sql.query(`select count(*)::int as n from evo_waiters where room_code = $1`, [code]))[0]?.n ?? 0) >= MAX_WAITERS) throw new NetError("Очередь на этот стол переполнена — попробуйте позже", "queue-full");
		const token = makeToken();
		const unique = await uniqueName(code, name);
		await sql.query(`insert into evo_waiters (room_code, token, name) values ($1, $2, $3)
       on conflict (room_code, token) do update set name = excluded.name`, [
			code,
			token,
			unique
		]);
		return {
			seat: -1,
			token,
			waiting: true
		};
	}
	/**
	* Хост не должен «зависать» на вышедшем или сдавшемся игроке: если
	* сохранённый хост не онлайн (или сдался), передаём место следующему
	* онлайн-человеку и сохраняем это. Best-effort: гонку версий разрешает
	* следующий poll.
	*/
	async function persistHost(code, room, seats) {
		const onlineHumans = seats.filter((s) => !s.is_ai && !s.resigned && now() - toMs(s.last_seen_at) < PACE.onlineMs).map((s) => s.seat);
		const saved = room.host_seat;
		if (saved !== null && onlineHumans.includes(saved)) return room;
		if (!onlineHumans.length) return room;
		const next = Math.min(...onlineHumans);
		if (next === saved) return room;
		if (!await casUpdate(sql, code, room.version, { hostSeat: next }).catch(() => false)) return room;
		return {
			...room,
			host_seat: next,
			version: room.version + 1
		};
	}
	async function advance(code) {
		for (let i = 0; i < PACE.maxStepsPerTick; i++) {
			const room = await readRoom(sql, code);
			if (!room?.state || room.status !== "playing") return;
			const before = room.state;
			const step = nextAutoStep(before);
			if (!step) {
				const actor = currentActor(before);
				const idle = actor && noChoicesLeft(before, actor) ? actor : null;
				if (!idle) {
					if (room.auto_step_at !== null || room.turn_deadline_at !== null) await casUpdate(sql, code, room.version, {
						autoStepAt: null,
						turnDeadlineAt: null
					}).catch(() => false);
					return;
				}
				const due = room.turn_deadline_at === null ? 0 : toMs(room.turn_deadline_at);
				if (due === 0) {
					await casUpdate(sql, code, room.version, {
						autoStepAt: null,
						turnDeadlineAt: now() + PACE.idleTurnMs
					}).catch(() => false);
					return;
				}
				if (due - now() > 0) return;
				const forced = endTurnStepFor(before, idle.id);
				const after = applyAction(before, forced);
				const finished = after.phase === "gameOver";
				if (!await casUpdate(sql, code, room.version, {
					state: after,
					status: finished ? "finished" : void 0,
					autoStepAt: finished ? null : now() + stepDelay(before, forced, after),
					eventsAppend: after.lastEvents.length ? after.lastEvents : void 0
				})) return;
				if (finished) return;
				continue;
			}
			if ((room.auto_step_at === null ? 0 : toMs(room.auto_step_at)) - now() > 0) return;
			const after = applyAction(before, step);
			const finished = after.phase === "gameOver";
			if (!await casUpdate(sql, code, room.version, {
				state: after,
				status: finished ? "finished" : void 0,
				autoStepAt: finished ? null : now() + stepDelay(before, step, after),
				eventsAppend: after.lastEvents.length ? after.lastEvents : void 0
			})) return;
			if (finished) return;
		}
	}
	async function snapshot(code, seat, opts = {}) {
		const [room, seats, waiters, spectators, reactions] = await Promise.all([
			readRoom(sql, code),
			readSeats(sql, code),
			readWaiters(sql, code),
			readSpectators(sql, code, now),
			readReactions(sql, code, opts.sinceReactionId)
		]);
		if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
		const full = room.state;
		const events = opts.sinceVersion !== void 0 && full ? viewEventBatches(batchesSince(room.events, opts.sinceVersion), seat, full) : [];
		const chat = await readChat(sql, code, opts.sinceChatId);
		return {
			version: room.version,
			room: metaOf(room, seats, now, seat),
			seats: seatsInfo(seats, now),
			seat,
			state: full && room.status !== "lobby" ? viewFor(full, seat) : null,
			events,
			chat,
			waiters: waiterInfos(waiters, now),
			spectators,
			reactions,
			turnDeadlineAt: turnDeadlineOf(room),
			serverNow: now()
		};
	}
	return {
		async create(input, source) {
			const incompatibility = moduleCompatibilityError(input.modules ?? {});
			if (incompatibility) throw new NetError(incompatibility);
			if (source) {
				rateAssert(`create:${source}`, createPerHourLimit(), 36e5, "Слишком много созданных столов — попробуйте позже", "create-limit");
				rateHit(`create:${source}`, 36e5);
			}
			if (input.botSeats > input.capacity - 1) throw new NetError("Ботов больше, чем свободных мест", "too-many-bots");
			const token = makeToken();
			const isPrivate = input.isPrivate ?? false;
			const password = isPrivate ? normalizePassword(input.password) : null;
			const settings = {
				modules: input.modules ?? {},
				difficulty: input.difficulty,
				...input.deckSize ? { deckSize: input.deckSize } : {}
			};
			for (let attempt = 0; attempt < 6; attempt++) {
				const code = makeCode();
				try {
					await sql.query(`insert into evo_rooms
               (code, capacity, difficulty, seed, modules, settings, host_seat, is_private, password)
             values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, 0, $7, $8)`, [
						code,
						input.capacity,
						input.difficulty,
						Math.floor(Math.random() * 1e6),
						JSON.stringify(input.modules ?? {}),
						JSON.stringify(settings),
						isPrivate,
						password
					]);
					try {
						await sql.query(`insert into evo_seats (room_code, seat, name, token, color)
               values ($1, 0, $2, $3, $4)`, [
							code,
							await uniqueName(code, input.name),
							token,
							pickColor([])
						]);
						if (input.botSeats > 0) await insertBots(code, input.capacity, input.botSeats);
					} catch (e) {
						await sql.query(`delete from evo_rooms where code = $1`, [code]).catch(() => {});
						throw e;
					}
					return {
						code,
						seat: 0,
						token,
						isPrivate,
						password
					};
				} catch (e) {
					if (!isUniqueViolation(e)) throw e;
				}
			}
			throw new NetError("Не удалось выдать код стола — попробуйте ещё раз", "code-failed");
		},
		async join({ code, name, password }, source) {
			entryGuard(source);
			return withProbeGuard(probeKey("join", code, source), async () => {
				for (let attempt = 0; attempt < 3; attempt++) {
					const room = await requireRoom(code);
					await requirePassword(room, password);
					if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
					const seats = await readSeats(sql, code);
					const free = firstFreeSeat(room.capacity, seats);
					if (free < 0) return enqueueWaiter(code, name);
					const token = makeToken();
					if ((await sql.query(`insert into evo_seats (room_code, seat, name, token, color)
             values ($1, $2, $3, $4, $5)
             on conflict (room_code, seat) do nothing
             returning seat`, [
						code,
						free,
						await uniqueName(code, name),
						token,
						pickColor(takenColors(seats))
					])).length === 1) return {
						seat: free,
						token,
						waiting: false
					};
				}
				return enqueueWaiter(code, name);
			});
		},
		async listRooms() {
			return (await sql.query(`select r.code, r.status, r.capacity, r.difficulty, r.modules, r.settings,
                (select count(*)::int from evo_seats s where s.room_code = r.code) as taken,
                (select s.name from evo_seats s
                  where s.room_code = r.code
                    and s.seat = coalesce(r.host_seat,
                      (select min(s2.seat) from evo_seats s2
                        where s2.room_code = r.code and not s2.is_ai))) as host_name,
                r.is_private,
                r.created_at
           from evo_rooms r
          where r.status in ('lobby', 'playing')
          order by r.created_at desc
          limit $1`, [LIST_ROOMS_LIMIT])).map((r) => ({
				code: r.code,
				status: r.status,
				capacity: r.capacity,
				taken: r.taken,
				free: Math.max(0, r.capacity - r.taken),
				hostName: r.host_name ?? "Хост",
				difficulty: r.settings?.difficulty ?? r.difficulty,
				modules: enabledModules(r.settings, r.modules),
				createdAt: toMs(r.created_at),
				isPrivate: Boolean(r.is_private)
			}));
		},
		async setBots({ code, token, count }) {
			const { room, seats } = await requireHost(code, token, "Ботов добавляет хост", "host-only");
			if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
			const humans = seats.filter((s) => !s.is_ai).length;
			const clamped = Math.max(0, Math.min(count, room.capacity - humans));
			await sql.query(`delete from evo_seats where room_code = $1 and is_ai`, [code]);
			if (clamped > 0) await insertBots(code, room.capacity, clamped);
		},
		async kick(code, token, seatNo) {
			const { room, seats, me } = await requireHost(code, token, "Кикать игроков может только хост", "host-only");
			if (seatNo === me.seat) throw new NetError("Себя удалить нельзя", "kick-self");
			const victim = seats.find((s) => s.seat === seatNo);
			if (!victim) throw new NetError("Это место уже свободно", "seat-free");
			if (victim.is_ai) throw new NetError("Ботов убирают кнопкой «Бот»", "kick-bot");
			if (room.status === "lobby") await sql.query(`delete from evo_seats where room_code = $1 and seat = $2`, [code, seatNo]);
			else if (room.status === "playing" && room.state) {
				const state = structuredClone(room.state);
				const botName = await uniqueName(code, AI_NAMES[seatNo % AI_NAMES.length], victim.token);
				const p = state.players[seatNo];
				if (p) {
					p.isAI = true;
					p.name = botName;
					p.resigned = false;
				}
				await casUpdateStrict(sql, code, room.version, { state });
				await sql.query(`update evo_seats set is_ai = true, name = $3, token = '', resigned = false,
                  color = $4, last_seen_at = now()
            where room_code = $1 and seat = $2`, [
					code,
					seatNo,
					botName,
					botColor(seatNo, takenColors(seats))
				]);
			} else throw new NetError("Партия уже закончена", "game-finished");
			await sql.query(`insert into evo_kicks (room_code, token) values ($1, $2) on conflict do nothing`, [code, victim.token]);
		},
		async setCapacity(code, token, capacity) {
			const { room, seats } = await requireHost(code, token, "Менять число мест может только хост", "host-only");
			if (room.status !== "lobby") throw new NetError("Места меняют до начала партии", "lobby-only");
			const ordered = [...seats].sort((a, b) => a.seat - b.seat);
			const excess = ordered.length - capacity;
			const victims = [];
			if (excess > 0) {
				victims.push(...shuffled(ordered.filter((s) => s.is_ai)).slice(0, excess));
				const left = excess - victims.length;
				if (left > 0) victims.push(...shuffled(ordered.filter((s) => !s.is_ai)).slice(0, left));
			}
			const removedSeats = new Set(victims.map((v) => v.seat));
			const survivors = ordered.filter((s) => !removedSeats.has(s.seat));
			for (const v of victims) {
				if (!v.is_ai) await sql.query(`insert into evo_waiters (room_code, token, name) values ($1, $2, $3)
             on conflict (room_code, token) do update set name = excluded.name`, [
					code,
					v.token,
					v.name
				]);
				await sql.query(`delete from evo_seats where room_code = $1 and seat = $2`, [code, v.seat]);
			}
			const compacted = /* @__PURE__ */ new Map();
			survivors.forEach((s, i) => compacted.set(s.seat, i));
			for (const s of survivors) {
				const to = compacted.get(s.seat);
				if (to === s.seat) continue;
				await sql.query(`update evo_seats set seat = $3 where room_code = $1 and seat = $2`, [
					code,
					s.seat,
					to
				]);
			}
			const hostBefore = metaOf(room, seats, now).hostSeat;
			const hostRow = seats.find((s) => s.seat === hostBefore);
			let hostSeat = hostRow && compacted.has(hostRow.seat) ? compacted.get(hostRow.seat) : null;
			if (hostSeat === null) {
				const humansAlive = survivors.filter((s) => !s.is_ai);
				const online = humansAlive.filter((s) => now() - toMs(s.last_seen_at) < PACE.onlineMs);
				const nextHost = (online.length ? online : humansAlive)[0];
				hostSeat = nextHost ? compacted.get(nextHost.seat) : 0;
			}
			const patch = { capacity };
			if (hostSeat !== room.host_seat) patch.hostSeat = hostSeat;
			await casUpdateStrict(sql, code, room.version, patch);
			if (victims.length) {
				const movedHumans = victims.filter((v) => !v.is_ai).map((v) => v.name);
				const parts = [];
				if (victims.length - movedHumans.length) parts.push(`убраны боты: ${victims.length - movedHumans.length}`);
				if (movedHumans.length) parts.push(`в очередь ожидающих: ${movedHumans.join(", ")}`);
				await sql.query(`insert into evo_chat (room_code, seat, name, text) values ($1, -1, $2, $3)`, [
					code,
					"Стол",
					`Мест стало ${capacity}: ${parts.join("; ")}`
				]);
			}
		},
		async setSettings(code, token, patch) {
			const { room } = await requireHost(code, token, "Менять настройки может только хост", "host-only");
			if (room.status !== "lobby") throw new NetError("Настройки меняют до начала партии", "lobby-only");
			const next = { ...effectiveSettings(room) };
			if (patch.modules !== void 0) {
				const incompatibility = moduleCompatibilityError(patch.modules);
				if (incompatibility) throw new NetError(incompatibility);
				next.modules = { ...patch.modules };
			}
			if (patch.difficulty !== void 0) next.difficulty = patch.difficulty;
			if (patch.deckSize !== void 0) next.deckSize = patch.deckSize;
			await casUpdateStrict(sql, code, room.version, {
				settings: next,
				difficulty: next.difficulty ?? room.difficulty,
				modules: next.modules ?? room.modules ?? {}
			});
		},
		async setRoomPrivacy(code, token, isPrivate, regenerate = false) {
			const { room } = await requireHost(code, token, "Менять доступ может только хост", "host-only");
			if (room.status !== "lobby") throw new NetError("Доступ меняют до начала партии", "lobby-only");
			const password = isPrivate && (regenerate || !room.password) ? makePassword() : room.password;
			await casUpdateStrict(sql, code, room.version, {
				isPrivate,
				password
			});
			return {
				isPrivate,
				password: isPrivate ? password : null
			};
		},
		async setPassword(code, token, password) {
			const { room } = await requireHost(code, token, "Менять пароль может только хост", "host-only");
			if (room.status !== "lobby") throw new NetError("Пароль меняют до начала партии", "lobby-only");
			const clean = checkPassword(password);
			await casUpdateStrict(sql, code, room.version, { password: clean });
			return { password: clean };
		},
		async setColor(code, token, color) {
			const room = await requireRoom(code);
			if (!PLAYER_COLORS.includes(color)) throw new NetError("Такого цвета нет в палитре стола", "bad-color");
			const me = (await sql.query(`select seat, is_ai from evo_seats where room_code = $1 and token = $2`, [code, token]))[0];
			if (!me) {
				if ((await sql.query(`select 1 from evo_waiters where room_code = $1 and token = $2`, [code, token])).length) throw new NetError("Цвет выбирают за столом, а не в очереди", "color-seat");
				return goneReason(code, token);
			}
			if (me.is_ai) throw new NetError("Ботам цвет назначает стол", "bot-color");
			if (room.status !== "lobby") throw new NetError("Цвет меняют до начала партии", "lobby-only");
			const mine = (await sql.query(`select color from evo_seats where room_code = $1 and seat = $2`, [code, me.seat]))[0]?.color ?? colorForSeat(me.seat);
			if (mine.toLowerCase() === color.toLowerCase()) return { color: mine };
			if ((await readSeats(sql, code)).find((s) => s.seat !== me.seat && (s.color ?? colorForSeat(s.seat)).toLowerCase() === color.toLowerCase())) throw new NetError("Этот цвет уже занят — выберите другой", "color-taken");
			await sql.query(`update evo_seats set color = $3 where room_code = $1 and seat = $2`, [
				code,
				me.seat,
				color
			]);
			return { color };
		},
		async transferHost(code, token, seatNo) {
			const { room, seats } = await requireHost(code, token, "Передавать хоста может только хост", "host-only");
			if (room.status !== "lobby") throw new NetError("Хоста передают до начала партии", "lobby-only");
			const target = seats.find((s) => s.seat === seatNo);
			if (!target || target.is_ai) throw new NetError("Хостом может стать только человек за столом", "host-human");
			await casUpdateStrict(sql, code, room.version, { hostSeat: seatNo });
		},
		async kickWaiter(code, token, index) {
			await requireHost(code, token, "Убирать ожидающих может только хост", "host-only");
			const target = (await readWaiters(sql, code))[index];
			if (!target) throw new NetError("Такого ожидающего уже нет", "waiter-gone");
			await sql.query(`delete from evo_waiters where room_code = $1 and token = $2`, [code, target.token]);
			await sql.query(`insert into evo_kicks (room_code, token) values ($1, $2) on conflict do nothing`, [code, target.token]);
		},
		async waiterInfo(code, token, sinceChatId) {
			const room = await requireRoom(code);
			await sql.query(`delete from evo_waiters
            where room_code = $1 and created_at < now() - ($2::int * interval '1 millisecond')`, [code, WAITER_TTL_MS]).catch(() => {});
			const [seats, waiters] = await Promise.all([readSeats(sql, code), readWaiters(sql, code)]);
			const idx = waiters.findIndex((w) => w.token === token);
			if (idx < 0) {
				const [seat, spectator] = await Promise.all([sql.query(`select 1 from evo_seats where room_code = $1 and token = $2 limit 1`, [code, token]), sql.query(`select 1 from evo_spectators where room_code = $1 and token = $2 limit 1`, [code, token])]);
				if (!seat.length && !spectator.length) {
					if ((await sql.query(`select 1 from evo_kicks where room_code = $1 and token = $2 limit 1`, [code, token])).length) throw new NetError("Вас удалили из-за стола", "kicked");
					throw new NetError("Вас нет за этим столом", "seat-taken");
				}
			}
			const free = firstFreeSeat(room.capacity, seats);
			return {
				room: metaOf(room, seats, now),
				seats: seatsInfo(seats, now),
				waiters: waiterInfos(waiters, now),
				freeSeats: countFreeSeats(room.capacity, seats),
				queued: idx >= 0,
				position: idx >= 0 ? idx + 1 : null,
				freeSeat: free >= 0 ? free : null,
				chat: await readChat(sql, code, sinceChatId),
				spectators: await readSpectators(sql, code, now),
				reactions: await readReactions(sql, code)
			};
		},
		async claimSeat(code, token) {
			const room = await requireRoom(code);
			if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
			const w = await sql.query(`select name from evo_waiters where room_code = $1 and token = $2`, [code, token]);
			if (!w[0]) return goneReason(code, token);
			for (let attempt = 0; attempt < 3; attempt++) {
				const seats = await readSeats(sql, code);
				const free = firstFreeSeat(room.capacity, seats);
				if (free < 0) throw new NetError("Свободных мест пока нет", "no-free-seats");
				const seatToken = makeToken();
				const name = await uniqueName(code, w[0].name, token);
				if ((await sql.query(`insert into evo_seats (room_code, seat, name, token, color)
           values ($1, $2, $3, $4, $5)
           on conflict (room_code, seat) do nothing
           returning seat`, [
					code,
					free,
					name,
					seatToken,
					pickColor(takenColors(seats))
				])).length === 1) {
					await sql.query(`delete from evo_waiters where room_code = $1 and token = $2`, [code, token]);
					return {
						seat: free,
						token: seatToken
					};
				}
			}
			throw new NetError("Место только что заняли — попробуйте ещё раз", "seat-race");
		},
		async leaveQueue(code, token) {
			await sql.query(`delete from evo_waiters where room_code = $1 and token = $2`, [code, token]).catch(() => {});
		},
		async chat(code, token, text) {
			await requireRoom(code);
			const author = await participant(code, token);
			const clean = text.trim().slice(0, CHAT_MAX_LEN);
			if (!clean) throw new NetError("Пустое сообщение", "chat-empty");
			const r = (await sql.query(`select
           (select count(*)::int from evo_chat
             where room_code = $1 and seat = $2 and created_at > now() - interval '1 minute') as recent,
           (select coalesce((extract(epoch from (now() - max(created_at))) * 1000)::int, 1000000)
              from evo_chat where room_code = $1 and seat = $2) as since_ms`, [code, author.seat]))[0];
			if (r && r.recent >= CHAT_PER_MINUTE) throw new NetError("Слишком много сообщений — подождите минуту", "rate-limit");
			if (r && r.since_ms < CHAT_MIN_GAP_MS) throw new NetError("Слишком часто — подождите секунду", "rate-fast");
			return (await sql.query(`insert into evo_chat (room_code, seat, name, text)
         values ($1, $2, $3, $4)
         returning id::int as id, seat, name, text,
                   (extract(epoch from created_at) * 1000)::float8 as at`, [
				code,
				author.seat,
				author.name,
				clean
			]))[0];
		},
		async spectate(code, name, password, source) {
			entryGuard(source);
			return withProbeGuard(probeKey("spectate", code, source), async () => {
				await requirePassword(await requireRoom(code), password);
				const clean = name.trim().slice(0, 16);
				if (!clean) throw new NetError("Введите имя зрителя", "empty-name");
				const token = makeToken();
				await sql.query(`insert into evo_spectators (room_code, token, name) values ($1, $2, $3)`, [
					code,
					token,
					await uniqueName(code, clean)
				]);
				return { token };
			});
		},
		async spectatorPoll(code, token, sinceChatId, sinceReactionId) {
			const room = await requireRoom(code);
			if (!(await sql.query(`update evo_spectators set last_seen_at = now()
          where room_code = $1 and token = $2
          returning token, name, last_seen_at`, [code, token]))[0]) throw new NetError("Зритель больше не подключён", "seat-taken");
			await advance(code);
			const fresh = await readRoom(sql, code) ?? room;
			const [seats, spectators, chat, reactions] = await Promise.all([
				readSeats(sql, code),
				readSpectators(sql, code, now),
				readChat(sql, code, sinceChatId),
				readReactions(sql, code, sinceReactionId)
			]);
			return {
				version: fresh.version,
				room: metaOf(fresh, seats, now),
				seats: seatsInfo(seats, now),
				state: fresh.state && fresh.status !== "lobby" ? spectatorView(fresh.state) : null,
				spectators,
				chat,
				reactions,
				turnDeadlineAt: turnDeadlineOf(fresh),
				serverNow: now()
			};
		},
		async reaction(code, token, emoji, kind, targetSeat, chatId) {
			await requireRoom(code);
			const author = await participant(code, token);
			let messageId = null;
			if (chatId !== void 0 && chatId !== null) {
				const msg = await sql.query(`select id::int as id from evo_chat where room_code = $1 and id = $2`, [code, chatId]);
				if (!msg[0]) throw new NetError("Сообщение не найдено в этом столе", "reaction-missing");
				messageId = msg[0].id;
			}
			const lim = (await sql.query(`select
           (select count(*)::int from evo_reactions
             where room_code = $1 and name = $2 and created_at > now() - interval '1 minute') as recent,
           (select coalesce((extract(epoch from (now() - max(created_at))) * 1000)::int, 1000000)
              from evo_reactions where room_code = $1 and name = $2) as since_ms`, [code, author.name]))[0];
			if (lim && lim.recent >= REACTION_PER_MINUTE) throw new NetError("Слишком много реакций — подождите минуту", "reaction-limit");
			if (lim && lim.since_ms < REACTION_MIN_GAP_MS) throw new NetError("Слишком часто — подождите секунду", "rate-fast");
			const r = (await sql.query(`insert into evo_reactions (room_code, name, emoji, kind, target_seat, chat_id)
         values ($1, $2, $3, $4, $5, $6)
         returning id::int as id, name, emoji, kind, target_seat, chat_id::int as chat_id,
                   (extract(epoch from created_at) * 1000)::float8 as at`, [
				code,
				author.name,
				emoji,
				kind,
				targetSeat ?? null,
				messageId
			]))[0];
			return {
				id: r.id,
				name: r.name,
				emoji: r.emoji,
				kind: r.kind,
				targetSeat: r.target_seat,
				chatId: r.chat_id,
				at: r.at
			};
		},
		async typing(code, token) {
			await requireRoom(code);
			const me = await participantSeat(code, token);
			const table = me.seat >= 0 ? "evo_seats" : me.seat === -1 ? "evo_waiters" : "evo_spectators";
			await sql.query(`update ${table} set typing_at = now()
          where room_code = $1 and token = $2
            and (typing_at is null
                 or typing_at < now() - ($3::int * interval '1 millisecond'))`, [
				code,
				token,
				TYPING_MIN_GAP_MS
			]);
		},
		async rejoin(code, token, source) {
			entryGuard(source);
			return withProbeGuard(probeKey("rejoin", code, source), async () => {
				return snapshot(code, (await seatByToken(code, token)).seat);
			});
		},
		async start(code, token) {
			const { room, seats, me } = await requireHost(code, token, "Начать партию может хост", "host-only");
			if (room.status !== "lobby") throw new NetError("Партия уже началась", "game-started");
			if (seats.length !== room.capacity) throw new NetError("Заполните все места — людьми или ботами", "seats-unfinished");
			const cfg = effectiveSettings(room);
			const incompatibility = moduleCompatibilityError(cfg.modules ?? room.modules ?? {});
			if (incompatibility) throw new NetError(incompatibility);
			const defs = seats.map((s) => ({
				name: s.name,
				isAI: s.is_ai
			}));
			const state = createGame(room.capacity, cfg.difficulty ?? room.difficulty, Math.floor(Math.random() * 1e6), defs, cfg.modules ?? room.modules ?? {}, cfg.deckSize);
			await sql.query(`insert into evo_spectators (room_code, token, name)
         select room_code, token, name from evo_waiters where room_code = $1
         on conflict (room_code, token) do nothing`, [code]);
			await sql.query(`delete from evo_waiters where room_code = $1`, [code]);
			await casUpdateStrict(sql, code, room.version, {
				state,
				status: "playing",
				autoStepAt: now() + PACE.initialMs,
				events: []
			});
			return snapshot(code, me.seat);
		},
		async resign(code, token) {
			const me = await seatByToken(code, token);
			if (me.is_ai) throw new NetError("Боты не сдаются", "bot-resign");
			for (let attempt = 0; attempt < 3; attempt++) {
				const room = await requireRoom(code);
				if (room.status !== "playing" || !room.state) throw new NetError("Партия не идёт", "not-playing");
				if (room.state.players[me.seat]?.resigned) {
					await sql.query(`update evo_seats set resigned = true where room_code = $1 and seat = $2`, [code, me.seat]);
					break;
				}
				const state = structuredClone(room.state);
				const p = state.players[me.seat];
				if (!p) throw new NetError("Ваше место не найдено в партии", "seat-missing");
				p.resigned = true;
				if (await casUpdate(sql, code, room.version, { state })) {
					await sql.query(`update evo_seats set resigned = true where room_code = $1 and seat = $2`, [code, me.seat]);
					break;
				}
				if (attempt === 2) throw new NetError("Стол изменился, попробуйте ещё раз", "retry");
			}
			return snapshot(code, me.seat);
		},
		async setName(code, token, name) {
			const room = await requireRoom(code);
			const clean = name.trim().slice(0, 16);
			if (!clean) throw new NetError("Введите имя", "empty-name");
			const seat = await sql.query(`select seat, is_ai from evo_seats where room_code = $1 and token = $2`, [code, token]);
			if (seat[0]?.is_ai) throw new NetError("Боты не переименовываются", "bot-rename");
			if (seat[0] && room.status !== "lobby") throw new NetError("Имя меняют до начала партии", "lobby-only");
			const final = await uniqueName(code, clean, token);
			if (seat[0]) await sql.query(`update evo_seats set name = $3 where room_code = $1 and token = $2`, [
				code,
				token,
				final
			]);
			const waiter = await sql.query(`update evo_waiters set name = $3 where room_code = $1 and token = $2 returning token`, [
				code,
				token,
				final
			]);
			const spectator = await sql.query(`update evo_spectators set name = $3 where room_code = $1 and token = $2 returning token`, [
				code,
				token,
				final
			]);
			if (!seat[0] && !waiter.length && !spectator.length) await goneReason(code, token);
			return { name: final };
		},
		async action(code, token, sent) {
			const room = await requireRoom(code);
			const me = await seatByToken(code, token);
			if (room.status !== "playing" || !room.state) throw new NetError("Партия не идёт", "not-playing");
			const st = room.state;
			if (me.resigned || st.players[me.seat]?.resigned) throw new NetError("Вы сдались — ваши ходы пропускаются автоматически", "resigned");
			const isReorder = sent.type === "reorderAnimal" && (st.phase === "development" || st.phase === "feeding") && st.currentPlayerId === me.seat && (st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId);
			const isRename = sent.type === "renameAnimal" && typeof sent.name === "string" && sent.name.trim().length <= 24 && (st.phase === "development" || st.phase === "feeding") && st.currentPlayerId === me.seat && (st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId);
			let action = sent;
			if (!isReorder && !isRename) {
				const canonical = (st.pendingAttack && st.pendingAttack.waitingFor === me.seat ? legalDefenseActions(st, me.seat) : st.phase === "development" ? legalDevActions(st, me.seat) : st.phase === "feeding" ? legalFeedActions(st, me.seat) : []).find((a) => sameAction(a, sent));
				if (!canonical) {
					if (sent.type === "reorderAnimal") {
						if (st.phase !== "development" && st.phase !== "feeding") throw new NetError("Сейчас нельзя переставлять животных", "reorder-phase");
						if (st.currentPlayerId !== me.seat) throw new NetError("Переставлять животных можно только в свой ход (сейчас ход другого игрока)", "reorder-turn");
						if (!(st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId)) throw new NetError("Переставлять можно только своих животных", "reorder-owner");
					}
					if (sent.type === "renameAnimal") {
						if (st.phase !== "development" && st.phase !== "feeding") throw new NetError("Сейчас нельзя переименовывать животных", "rename-phase");
						if (st.currentPlayerId !== me.seat) throw new NetError("Переименовывать животных можно только в свой ход (сейчас ход другого игрока)", "rename-turn");
						if (!(st.players[me.seat]?.animals ?? []).some((a) => a.id === sent.animalId)) throw new NetError("Переименовывать можно только своих животных", "rename-owner");
						if (typeof sent.name !== "string" || sent.name.trim().length > 24) throw new NetError("Имя животного — до 24 символов", "rename-length");
					}
					throw new NetError("Такой ход сейчас недопустим", "move-illegal");
				}
				action = canonical;
			}
			const cosmetic = isReorder || isRename;
			const next = applyAction(cosmetic ? {
				...st,
				humanId: me.seat
			} : st, action);
			if (cosmetic && next.humanId !== st.humanId) next.humanId = st.humanId;
			const finished = next.phase === "gameOver";
			const needsAuto = !finished && nextAutoStep(next) !== null;
			const humanGap = phaseGapMs(st, next);
			await casUpdateStrict(sql, code, room.version, {
				state: next,
				status: finished ? "finished" : void 0,
				autoStepAt: finished ? null : needsAuto ? now() + humanGap : null,
				eventsAppend: next.lastEvents.length ? next.lastEvents : void 0
			});
			return snapshot(code, me.seat);
		},
		async poll(code, token, sinceVersion, sinceChatId, sinceReactionId) {
			if (Math.random() < .05) await janitor(sql).catch(() => {});
			const me = await seatByToken(code, token);
			await sql.query(`update evo_seats set last_seen_at = now() where room_code = $1 and seat = $2`, [code, me.seat]).catch(() => {});
			let room = await readRoom(sql, code);
			if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
			room = await persistHost(code, room, await readSeats(sql, code));
			await advance(code);
			room = await readRoom(sql, code);
			if (!room) throw new NetError("Стол не найден — проверьте код", "room-gone");
			if (sinceVersion !== void 0 && sinceVersion === room.version) {
				const [seats, waiters, spectators, reactions] = await Promise.all([
					readSeats(sql, code),
					readWaiters(sql, code),
					readSpectators(sql, code, now),
					readReactions(sql, code, sinceReactionId)
				]);
				return {
					unchanged: true,
					seats: seatsInfo(seats, now),
					hostSeat: metaOf(room, seats, now, me.seat).hostSeat,
					capacity: room.capacity,
					waiters: waiterInfos(waiters, now),
					spectators,
					reactions,
					chat: await readChat(sql, code, sinceChatId)
				};
			}
			return snapshot(code, me.seat, {
				sinceVersion,
				sinceChatId,
				sinceReactionId
			});
		},
		async again({ code, token }) {
			const { room } = await requireHost(code, token, "Начать новую партию может только хост", "host-only");
			if (room.status !== "finished") throw new NetError("Партия ещё не закончена", "game-running");
			await sql.query(`update evo_seats set resigned = false where room_code = $1`, [code]);
			await casUpdateStrict(sql, code, room.version, {
				state: null,
				status: "lobby",
				autoStepAt: null,
				events: []
			});
		}
	};
}
/**
* Методы-маркеры актуальности сервиса: по ним проверяем, что в кэше лежит
* объект ТЕКУЩЕЙ версии кода, а не оставшийся от прошлой правки server.ts.
* Пополняйте список вместе с RoomService — метод, которого здесь нет, от
* старого объекта не защищён.
*/
var SERVICE_METHODS = [
	"create",
	"join",
	"listRooms",
	"setBots",
	"setName",
	"setColor",
	"setRoomPrivacy",
	"setPassword",
	"poll",
	"spectate",
	"typing"
];
function hasServiceMethods(s) {
	const obj = s;
	return SERVICE_METHODS.every((m) => typeof obj[m] === "function");
}
/** Свежий сервис поверх общей БД (схема гарантируется на месте, см. DDL). */
function makeRoomService() {
	return import("./db-Bco9xWpE.mjs").then(async ({ getSql }) => {
		const sql = await getSql();
		for (const statement of splitStatements(NET_TABLES_DDL)) await sql.query(statement);
		return createRoomService(sql);
	});
}
/**
* Та же схема, что в migrations/0002_net_rooms.sql … 0008_chat_reactions_typing.sql,
* но исполняется и в рантайме: на Vercel `db:migrate` выполняется на этапе
* билда и молча пропускается, если DATABASE_URL не был виден процессу сборки.
* Идемпотентно — можно вызывать всегда. Колонка M10 turn_deadline_at добавлена
* здесь же через `add column if not exists`: миграции волны уже отыграны, а
* alter идемпотентен и для живых, и для новых баз.
*/
var NET_TABLES_DDL = `
create table if not exists evo_rooms (
  code         text primary key,
  status       text not null default 'lobby',
  capacity     int  not null check (capacity between 2 and 8),
  difficulty   text not null default 'normal',
  seed         bigint not null,
  state        jsonb,
  version      int  not null default 0,
  auto_step_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create table if not exists evo_seats (
  room_code    text not null references evo_rooms(code) on delete cascade,
  seat         int  not null check (seat between 0 and 7),
  name         text not null,
  token        text not null,
  is_ai        boolean not null default false,
  last_seen_at timestamptz not null default now(),
  primary key (room_code, seat)
);
alter table evo_seats add column if not exists resigned boolean not null default false;
alter table evo_seats add column if not exists color text;
alter table evo_rooms add column if not exists modules jsonb not null default '{}';
alter table evo_rooms add column if not exists host_seat int;
alter table evo_rooms add column if not exists settings jsonb not null default '{}';
alter table evo_rooms add column if not exists events jsonb not null default '[]';
alter table evo_rooms add column if not exists is_private boolean not null default false;
alter table evo_rooms add column if not exists password text;
alter table evo_rooms add column if not exists turn_deadline_at timestamptz;
create index if not exists evo_rooms_public_idx on evo_rooms (is_private, created_at desc);
alter table evo_rooms drop constraint if exists evo_rooms_capacity_check;
alter table evo_rooms add constraint evo_rooms_capacity_check check (capacity between 2 and 8);
alter table evo_seats drop constraint if exists evo_seats_seat_check;
alter table evo_seats add constraint evo_seats_seat_check check (seat between 0 and 7);
create table if not exists evo_waiters (
  room_code  text not null references evo_rooms(code) on delete cascade,
  token      text not null,
  name       text not null,
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);
create table if not exists evo_chat (
  room_code  text not null references evo_rooms(code) on delete cascade,
  id         bigserial primary key,
  seat       int not null,
  name       text not null,
  text       text not null,
  created_at timestamptz not null default now()
);
create index if not exists evo_chat_room_id_idx on evo_chat (room_code, id);
create table if not exists evo_kicks (
  room_code  text not null references evo_rooms(code) on delete cascade,
  token      text not null,
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);
create table if not exists evo_spectators (
  room_code text not null references evo_rooms(code) on delete cascade,
  token text not null,
  name text not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);
create table if not exists evo_reactions (
  room_code text not null references evo_rooms(code) on delete cascade,
  id bigserial primary key,
  name text not null,
  emoji text not null,
  kind text not null default 'reaction' check (kind in ('reaction', 'cheer')),
  target_seat int,
  created_at timestamptz not null default now()
);
create index if not exists evo_reactions_room_id_idx on evo_reactions (room_code, id);
alter table evo_seats add column if not exists typing_at timestamptz;
alter table evo_waiters add column if not exists typing_at timestamptz;
alter table evo_spectators add column if not exists typing_at timestamptz;
alter table evo_reactions add column if not exists chat_id integer references evo_chat(id) on delete cascade;
`;
/**
* Разбить DDL на отдельные команды: PGlite (локальный фолбэк) отказывается
* исполнять мультизапрос через query() — «cannot insert multiple commands into
* a prepared statement». Точка с запятой внутри строк/скобок в нашей схеме не
* встречается, поэтому деления по «;» достаточно.
*/
function splitStatements(ddl) {
	return ddl.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
}
/**
* Общий экземпляр для прод-сервера. @/lib/db импортируется динамически:
* node-тесты подставляют свой SqlLike и никогда не трогают Vite-специфику db.ts.
* Перед первым использованием гарантируем схему (см. NET_TABLES_DDL).
*
* Кэш в globalThis переживает HMR: без проверки актуальности после правок
* server.ts клиент получал «s.setName is not a function» — старый объект
* сервиса оставался без новых методов, и это стоило нескольких часов отладки.
* Поэтому у закэшированного сервиса проверяем ключевые методы и пересоздаём
* его при расхождении (плюс сброс кэша на import.meta.hot.dispose ниже).
*/
function getRoomService() {
	const g = globalThis;
	const cached = g.__evoNetService__;
	if (!cached) {
		const fresh = makeRoomService().catch((e) => {
			if (g.__evoNetService__ === fresh) g.__evoNetService__ = void 0;
			throw e;
		});
		g.__evoNetService__ = fresh;
		return fresh;
	}
	return cached.then((s) => {
		if (hasServiceMethods(s)) return s;
		const fresh = makeRoomService();
		g.__evoNetService__ = fresh;
		return fresh;
	}, (e) => {
		if (g.__evoNetService__ === cached) g.__evoNetService__ = void 0;
		throw e;
	});
}
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
function isNetErrorLike(e) {
	return typeof e === "object" && e !== null && (e instanceof NetError || e.name === "NetError") && typeof e.code === "string";
}
var fail = (e) => ({
	ok: false,
	error: e instanceof Error ? e.message : "Сеть недоступна, попробуйте ещё раз",
	code: isNetErrorLike(e) ? e.code : "generic"
});
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
async function requestSource() {
	try {
		const { getRequestIP } = await import("./ssr.mjs").then((n) => n.s).then((n) => n.t);
		return getRequestIP({ xForwardedFor: true }) || "local";
	} catch {
		return "local";
	}
}
var netCreateRoom_createServerFn_handler = createServerRpc({
	id: "5d10ae946134fb6b27bc7c68ea783639ad617431c539331dc58524d97407b4bb",
	name: "netCreateRoom",
	filename: "src/lib/net/api.ts"
}, (opts) => netCreateRoom.__executeServer(opts));
var netCreateRoom = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(createRoomInput).handler(netCreateRoom_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).create(data, await requestSource())
		};
	} catch (e) {
		return fail(e);
	}
});
var netJoinRoom_createServerFn_handler = createServerRpc({
	id: "20bb5f392b3e05a16098d48523e3b73255d44092301929c9ed9a4bed4959d3d0",
	name: "netJoinRoom",
	filename: "src/lib/net/api.ts"
}, (opts) => netJoinRoom.__executeServer(opts));
var netJoinRoom = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(joinRoomInput).handler(netJoinRoom_createServerFn_handler, async ({ data }) => {
	try {
		const s = await getRoomService();
		return {
			ok: true,
			code: data.code,
			...await s.join(data, await requestSource())
		};
	} catch (e) {
		return fail(e);
	}
});
var netListRooms_createServerFn_handler = createServerRpc({
	id: "723174505869380ccb9a315ddd7f31ce9313f703d526f5762b058000a5a79797",
	name: "netListRooms",
	filename: "src/lib/net/api.ts"
}, (opts) => netListRooms.__executeServer(opts));
var netListRooms = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(listRoomsInput).handler(netListRooms_createServerFn_handler, async () => {
	try {
		return {
			ok: true,
			rooms: await (await getRoomService()).listRooms()
		};
	} catch (e) {
		return fail(e);
	}
});
var netRejoin_createServerFn_handler = createServerRpc({
	id: "9be6f8dbb902e4d7a86ed61a5ec451298b7693cb95cd353b30302c3968525e24",
	name: "netRejoin",
	filename: "src/lib/net/api.ts"
}, (opts) => netRejoin.__executeServer(opts));
var netRejoin = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(netRejoin_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			snapshot: await (await getRoomService()).rejoin(data.code, data.token, await requestSource())
		};
	} catch (e) {
		return fail(e);
	}
});
var netSetBots_createServerFn_handler = createServerRpc({
	id: "0ae6763f4a9392d1dc978022ba9a80b0b3aa8d50b84dfd2903b7639f24bfb552",
	name: "netSetBots",
	filename: "src/lib/net/api.ts"
}, (opts) => netSetBots.__executeServer(opts));
var netSetBots = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(botsInput).handler(netSetBots_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).setBots(data);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netKick_createServerFn_handler = createServerRpc({
	id: "fc1d0b35176a800d8b3842e8acc96a7ac0c86234a693afc1c829068eea6c2d17",
	name: "netKick",
	filename: "src/lib/net/api.ts"
}, (opts) => netKick.__executeServer(opts));
var netKick = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(kickInput).handler(netKick_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).kick(data.code, data.token, data.seat);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netSetCapacity_createServerFn_handler = createServerRpc({
	id: "14d6256128aa0959545fb4a848837599d1e846ecdbdb8a1d74a6f7011a2ce4fd",
	name: "netSetCapacity",
	filename: "src/lib/net/api.ts"
}, (opts) => netSetCapacity.__executeServer(opts));
var netSetCapacity = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(capacityInput).handler(netSetCapacity_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).setCapacity(data.code, data.token, data.capacity);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netSetSettings_createServerFn_handler = createServerRpc({
	id: "052ff9dfc236bd0e1ff1a962b0659ec3f2343e685982ac4ea46dbc2a5c6c93dd",
	name: "netSetSettings",
	filename: "src/lib/net/api.ts"
}, (opts) => netSetSettings.__executeServer(opts));
var netSetSettings = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(settingsInput).handler(netSetSettings_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).setSettings(data.code, data.token, data.settings);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netSetRoomPrivacy_createServerFn_handler = createServerRpc({
	id: "7b3cccee6165dc1938d98f77f4e24b8489eac37c333a004d48f16c3436c6277c",
	name: "netSetRoomPrivacy",
	filename: "src/lib/net/api.ts"
}, (opts) => netSetRoomPrivacy.__executeServer(opts));
var netSetRoomPrivacy = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setRoomPrivacyInput).handler(netSetRoomPrivacy_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).setRoomPrivacy(data.code, data.token, data.isPrivate, data.regenerate)
		};
	} catch (e) {
		return fail(e);
	}
});
var netSetPassword_createServerFn_handler = createServerRpc({
	id: "669f968e8b8cfa947490123e1df1da0b1333979859dd5d0f62b5c473d073d67f",
	name: "netSetPassword",
	filename: "src/lib/net/api.ts"
}, (opts) => netSetPassword.__executeServer(opts));
var netSetPassword = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setPasswordInput).handler(netSetPassword_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).setPassword(data.code, data.token, data.password)
		};
	} catch (e) {
		return fail(e);
	}
});
var netSetColor_createServerFn_handler = createServerRpc({
	id: "8b1166f17dfc1cc931ef213f6242cdeca1f2fc42df72e7b0f3ab94c08c119a3a",
	name: "netSetColor",
	filename: "src/lib/net/api.ts"
}, (opts) => netSetColor.__executeServer(opts));
var netSetColor = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setColorInput).handler(netSetColor_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).setColor(data.code, data.token, data.color)
		};
	} catch (e) {
		return fail(e);
	}
});
var netTransferHost_createServerFn_handler = createServerRpc({
	id: "b6e16925f8dea3e55e70b929ead0135b8dbf491c796f2bc20222a71969975540",
	name: "netTransferHost",
	filename: "src/lib/net/api.ts"
}, (opts) => netTransferHost.__executeServer(opts));
var netTransferHost = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(transferHostInput).handler(netTransferHost_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).transferHost(data.code, data.token, data.seat);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netKickWaiter_createServerFn_handler = createServerRpc({
	id: "77458ceff388f54d00051c41e26ba9da5450ff9a0991ee4e0f03c3612cfd48e3",
	name: "netKickWaiter",
	filename: "src/lib/net/api.ts"
}, (opts) => netKickWaiter.__executeServer(opts));
var netKickWaiter = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(kickWaiterInput).handler(netKickWaiter_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).kickWaiter(data.code, data.token, data.index);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netRoomInfo_createServerFn_handler = createServerRpc({
	id: "e9edd1f6cab243b2b1387028a5e185e4c9d038d81c4079de8752e760bfb05745",
	name: "netRoomInfo",
	filename: "src/lib/net/api.ts"
}, (opts) => netRoomInfo.__executeServer(opts));
var netRoomInfo = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(roomInfoInput).handler(netRoomInfo_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			info: await (await getRoomService()).waiterInfo(data.code, data.token, data.sinceChatId)
		};
	} catch (e) {
		return fail(e);
	}
});
var netClaimSeat_createServerFn_handler = createServerRpc({
	id: "817dba9d018a54d9d1f8db2118a3e88ee47f87c735e346de37f37247b0b7db75",
	name: "netClaimSeat",
	filename: "src/lib/net/api.ts"
}, (opts) => netClaimSeat.__executeServer(opts));
var netClaimSeat = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(netClaimSeat_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).claimSeat(data.code, data.token)
		};
	} catch (e) {
		return fail(e);
	}
});
var netLeaveQueue_createServerFn_handler = createServerRpc({
	id: "e93383b5647ec0a72ceef449d96876a16800ef6dad33d4e3233c9a64f988fa5b",
	name: "netLeaveQueue",
	filename: "src/lib/net/api.ts"
}, (opts) => netLeaveQueue.__executeServer(opts));
var netLeaveQueue = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(netLeaveQueue_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).leaveQueue(data.code, data.token);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netResign_createServerFn_handler = createServerRpc({
	id: "9f0f87a6fe21a90a7c6720b8ff446276995846ac5832a6896edee121975f53f9",
	name: "netResign",
	filename: "src/lib/net/api.ts"
}, (opts) => netResign.__executeServer(opts));
var netResign = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(netResign_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			snapshot: await (await getRoomService()).resign(data.code, data.token)
		};
	} catch (e) {
		return fail(e);
	}
});
var netSetName_createServerFn_handler = createServerRpc({
	id: "c63ced99d6aefc18ccc38a895efb96127d86bc431212f7dfd5ba603a726bbcb5",
	name: "netSetName",
	filename: "src/lib/net/api.ts"
}, (opts) => netSetName.__executeServer(opts));
var netSetName = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(setNameInput).handler(netSetName_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).setName(data.code, data.token, data.name)
		};
	} catch (e) {
		return fail(e);
	}
});
var netChat_createServerFn_handler = createServerRpc({
	id: "13eed1a17da62dcb9e70eec71b4e8a976934b02a5dcff01613a937167cd6f9b3",
	name: "netChat",
	filename: "src/lib/net/api.ts"
}, (opts) => netChat.__executeServer(opts));
var netChat = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(chatInput).handler(netChat_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			message: await (await getRoomService()).chat(data.code, data.token, data.text)
		};
	} catch (e) {
		return fail(e);
	}
});
var netSpectate_createServerFn_handler = createServerRpc({
	id: "d4f11d2f35652a14c7006852467cb5ddf47674736c584cc4fd1a035dafd457c4",
	name: "netSpectate",
	filename: "src/lib/net/api.ts"
}, (opts) => netSpectate.__executeServer(opts));
var netSpectate = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(spectateInput).handler(netSpectate_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).spectate(data.code, data.name, data.password, await requestSource())
		};
	} catch (e) {
		return fail(e);
	}
});
var netSpectatorPoll_createServerFn_handler = createServerRpc({
	id: "7027acf2c9da3ca327d58640cca56e593fd6d897f85525ed64c21cabee308f2c",
	name: "netSpectatorPoll",
	filename: "src/lib/net/api.ts"
}, (opts) => netSpectatorPoll.__executeServer(opts));
var netSpectatorPoll = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(spectatorPollInput).handler(netSpectatorPoll_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			snapshot: await (await getRoomService()).spectatorPoll(data.code, data.token, data.sinceChatId, data.sinceReactionId)
		};
	} catch (e) {
		return fail(e);
	}
});
var netReaction_createServerFn_handler = createServerRpc({
	id: "28b67066d7856a0b8f76eba41be987486847193af04d0f5db299eaffecb7430c",
	name: "netReaction",
	filename: "src/lib/net/api.ts"
}, (opts) => netReaction.__executeServer(opts));
var netReaction = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(reactionInput).handler(netReaction_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			reaction: await (await getRoomService()).reaction(data.code, data.token, data.emoji, data.kind, data.targetSeat, data.chatId)
		};
	} catch (e) {
		return fail(e);
	}
});
var netTyping_createServerFn_handler = createServerRpc({
	id: "27a4b90edc64ff02fa08cbd9c71d9d3885e8fb62d40fde2cef584cfc8b9435e0",
	name: "netTyping",
	filename: "src/lib/net/api.ts"
}, (opts) => netTyping.__executeServer(opts));
var netTyping = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(typingInput).handler(netTyping_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).typing(data.code, data.token);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netStart_createServerFn_handler = createServerRpc({
	id: "fafa464b4c4488361c51f863768135107e02c148e255f23da160ffa440fc3f99",
	name: "netStart",
	filename: "src/lib/net/api.ts"
}, (opts) => netStart.__executeServer(opts));
var netStart = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(netStart_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			snapshot: await (await getRoomService()).start(data.code, data.token)
		};
	} catch (e) {
		return fail(e);
	}
});
var netAction_createServerFn_handler = createServerRpc({
	id: "18b6efd10626f6282f46662236a9f4efa95081d933b3c79a203a2bf43f221fa0",
	name: "netAction",
	filename: "src/lib/net/api.ts"
}, (opts) => netAction.__executeServer(opts));
var netAction = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(actionInput).handler(netAction_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			snapshot: await (await getRoomService()).action(data.code, data.token, data.action)
		};
	} catch (e) {
		return fail(e);
	}
});
var netPoll_createServerFn_handler = createServerRpc({
	id: "97c6cf3f2776e31a2770acfbc62d86143077f49705e3043649873d49707919d1",
	name: "netPoll",
	filename: "src/lib/net/api.ts"
}, (opts) => netPoll.__executeServer(opts));
var netPoll = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(pollInput).handler(netPoll_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).poll(data.code, data.token, data.sinceVersion, data.sinceChatId, data.sinceReactionId)
		};
	} catch (e) {
		return fail(e);
	}
});
var netAgain_createServerFn_handler = createServerRpc({
	id: "c863eef5e87854022b362f26f321d98a7752563244b6bf8043f48c6e5e79acfc",
	name: "netAgain",
	filename: "src/lib/net/api.ts"
}, (opts) => netAgain.__executeServer(opts));
var netAgain = createServerFn({ method: "POST" }).middleware([sameSiteGuard]).validator(codeTokenInput).handler(netAgain_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).again(data);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
//#endregion
export { netAction_createServerFn_handler, netAgain_createServerFn_handler, netChat_createServerFn_handler, netClaimSeat_createServerFn_handler, netCreateRoom_createServerFn_handler, netJoinRoom_createServerFn_handler, netKickWaiter_createServerFn_handler, netKick_createServerFn_handler, netLeaveQueue_createServerFn_handler, netListRooms_createServerFn_handler, netPoll_createServerFn_handler, netReaction_createServerFn_handler, netRejoin_createServerFn_handler, netResign_createServerFn_handler, netRoomInfo_createServerFn_handler, netSetBots_createServerFn_handler, netSetCapacity_createServerFn_handler, netSetColor_createServerFn_handler, netSetName_createServerFn_handler, netSetPassword_createServerFn_handler, netSetRoomPrivacy_createServerFn_handler, netSetSettings_createServerFn_handler, netSpectate_createServerFn_handler, netSpectatorPoll_createServerFn_handler, netStart_createServerFn_handler, netTransferHost_createServerFn_handler, netTyping_createServerFn_handler };
