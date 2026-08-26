import { a as object, i as number, n as custom, o as string, r as literal, s as union, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-CpbfIBmp.js
/**
* Общий контракт сетевой партии: типы кадров опроса, zod-схемы входа и
* серверные константы темпа. Импортируется и клиентом, и сервером;
* единственный игровой тип здесь — сам GameState.
*/
/**
* Серверные паузы авточагов (мс) и прочие константы: боты и автофазы
* двигаются лениво при любом запросе к комнате, темп не зависит от
* клиентского переключателя скорости (тот — только для одиночной игры).
*/
var PACE = {
	diceMs: 1600,
	extinctMs: 1800,
	botMs: 1e3,
	turnGapMs: 500,
	jitterMs: 200,
	initialMs: 600,
	maxStepsPerTick: 8,
	onlineMs: 1e4,
	roomTtlHours: 12
};
var NAME = string().trim().min(1).max(16);
var CODE = string().trim().length(4);
var createRoomInput = object({
	name: NAME,
	capacity: union([
		literal(2),
		literal(3),
		literal(4)
	]),
	botSeats: number().int().min(0).max(3),
	difficulty: _enum([
		"easy",
		"normal",
		"hard"
	])
});
var joinRoomInput = object({
	code: CODE,
	name: NAME
});
var codeTokenInput = object({
	code: CODE,
	token: string().min(10)
});
var botsInput = codeTokenInput.extend({ count: number().int().min(0).max(4) });
var actionInput = object({
	code: CODE,
	token: string().min(10),
	action: custom((v) => typeof v === "object" && v !== null && "type" in v)
});
var pollInput = codeTokenInput.extend({ sinceVersion: number().int().optional() });
var SINGLES = [
	["mimicry", 4],
	["swimming", 8],
	["poisonous", 4],
	["running", 4],
	["piracy", 4],
	["tailLoss", 4],
	["scavenger", 4],
	["symbiosis", 4]
];
var DUALS = [
	[
		"parasite",
		"carnivore",
		4
	],
	[
		"parasite",
		"fatTissue",
		4
	],
	[
		"highBodyWeight",
		"carnivore",
		4
	],
	[
		"highBodyWeight",
		"fatTissue",
		4
	],
	[
		"communication",
		"carnivore",
		4
	],
	[
		"cooperation",
		"carnivore",
		4
	],
	[
		"cooperation",
		"fatTissue",
		4
	],
	[
		"burrowing",
		"fatTissue",
		4
	],
	[
		"camouflage",
		"fatTissue",
		4
	],
	[
		"sharpVision",
		"fatTissue",
		4
	],
	[
		"grazing",
		"fatTissue",
		4
	],
	[
		"hibernation",
		"carnivore",
		4
	]
];
SINGLES.reduce((n, [, c]) => n + c, 0) + DUALS.reduce((n, [, , c]) => n + c, 0);
function buildDeck(nextId) {
	const cards = [];
	for (const [trait, n] of SINGLES) for (let i = 0; i < n; i++) cards.push({
		id: nextId("c"),
		faces: [trait]
	});
	for (const [a, b, n] of DUALS) for (let i = 0; i < n; i++) cards.push({
		id: nextId("c"),
		faces: [a, b]
	});
	return cards;
}
/**
* ГПСЧ живёт внутри GameState (rngState), а не во внешнем объекте:
* любое применение действия мутирует счётчик на клоне состояния, поэтому
* партия по сиду воспроизводима, а кубики можно показывать пошагово.
*/
function nextRandom(state) {
	state.rngState = state.rngState + 1831565813 | 0;
	let t = state.rngState;
	t = Math.imul(t ^ t >>> 15, 1 | t);
	t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
	return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function dieFor(state) {
	return 1 + Math.floor(nextRandom(state) * 6);
}
function shuffled(state, arr) {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(nextRandom(state) * (i + 1));
		const tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a;
}
var TRAITS = {
	carnivore: {
		id: "carnivore",
		name: "Хищник",
		short: "Хищник",
		description: "В свой ход вместо фишки еды может напасть на любое животное. При успехе получает 2 синие фишки. Голодный хищник может нападать в каждый свой ход; сытый (без места в жире) — нет. +1 к потребности в еде.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 1,
		scoreBonus: 1,
		aiValue: 6
	},
	swimming: {
		id: "swimming",
		name: "Водоплавающее",
		short: "Вода",
		description: "Может быть съедено только водоплавающим хищником. Водоплавающий хищник ест только водоплавающих.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		symmetricAquatic: true,
		aiValue: 5
	},
	camouflage: {
		id: "camouflage",
		name: "Камуфляж",
		short: "Камуфляж",
		description: "Может быть съедено только хищником с острым зрением.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		protection: { stealthBypass: "sharpVision" },
		aiValue: 5
	},
	sharpVision: {
		id: "sharpVision",
		name: "Острое зрение",
		short: "Зрение",
		description: "Хищник с этим свойством может атаковать животных с камуфляжем.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 4
	},
	burrowing: {
		id: "burrowing",
		name: "Норное",
		short: "Нора",
		description: "Накормленное животное нельзя атаковать. Жировой запас не считается кормлением.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		protection: { safeWhenFed: true },
		aiValue: 4
	},
	scavenger: {
		id: "scavenger",
		name: "Падальщик",
		short: "Падаль",
		description: "Когда любое животное съедено, один падальщик (по часовой от владельца хищника) получает 1 синюю фишку. Не сочетается с хищником.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		onAnyKill: "scavenger",
		aiValue: 3
	},
	symbiosis: {
		id: "symbiosis",
		name: "Симбиоз",
		short: "Симбиоз",
		description: "Парное. Первое животное — симбионт. Второе нельзя съесть, пока симбионт жив, и оно получает еду только после того, как симбионт накормлен.",
		isPair: true,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 5
	},
	piracy: {
		id: "piracy",
		name: "Пиратство",
		short: "Пират",
		description: "Раз за ход: забрать 1 фишку у животного, получившего еду в этом году, но ещё не накормленного. Не у самого себя и не если уже накормлен.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	tailLoss: {
		id: "tailLoss",
		name: "Отбрасывание хвоста",
		short: "Хвост",
		description: "При атаке сбросить это или любое другое свойство — животное выживает, хищник получает только 1 синюю фишку.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		defense: "tailLoss",
		aiValue: 5
	},
	grazing: {
		id: "grazing",
		name: "Топотун",
		short: "Топотун",
		description: "В каждую свою фазу питания можно уничтожить 1 фишку из кормовой базы.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	cooperation: {
		id: "cooperation",
		name: "Сотрудничество",
		short: "Сотрудн.",
		description: "Парное. Когда одно животное получает красную или синюю еду, второе сразу получает 1 синюю. Не срабатывает от жирового запаса.",
		isPair: true,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		onPartnerFed: "cooperation",
		aiValue: 4
	},
	running: {
		id: "running",
		name: "Быстрое",
		short: "Быстрое",
		description: "При атаке бросок кубика: 4–6 — спасается, хищник больше не атакует в этот год.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		defense: "running",
		aiValue: 4
	},
	highBodyWeight: {
		id: "highBodyWeight",
		name: "Большой",
		short: "Большой",
		description: "Может быть съедено только большим хищником. +1 к потребности в еде.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 1,
		scoreBonus: 1,
		protection: { needsBulkyAttacker: true },
		aiValue: 5
	},
	parasite: {
		id: "parasite",
		name: "Паразит",
		short: "Паразит",
		description: "Только на чужое животное. +2 к потребности в еде. В конце игры даёт владельцу животного 2 дополнительных очка.",
		isPair: false,
		opponentOnly: true,
		stackable: false,
		extraFood: 2,
		scoreBonus: 2,
		aiValue: -8
	},
	fatTissue: {
		id: "fatTissue",
		name: "Жировой запас",
		short: "Жир",
		description: "Единственное свойство, которое можно класть несколько раз. Лишняя еда становится жиром. Вместо еды из базы можно превратить жир в синие фишки.",
		isPair: false,
		opponentOnly: false,
		stackable: true,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	communication: {
		id: "communication",
		name: "Взаимодействие",
		short: "Взаимод.",
		description: "Парное. Когда одно животное берёт фишку из кормовой базы, второе сразу берёт фишку из базы вне очереди.",
		isPair: true,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		onPartnerFed: "communication",
		aiValue: 4
	},
	poisonous: {
		id: "poisonous",
		name: "Ядовитое",
		short: "Яд",
		description: "Хищник, полностью съевший это животное, погибает в фазу вымирания. Отбрасывание хвоста яд не передаёт.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		killsKiller: true,
		aiValue: 5
	},
	hibernation: {
		id: "hibernation",
		name: "Спячка",
		short: "Спячка",
		description: "Животное считается накормленным. Нельзя два года подряд и в последний год. Больше не берёт еду, даже в жировой запас.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	mimicry: {
		id: "mimicry",
		name: "Мимикрия",
		short: "Мимикрия",
		description: "При атаке перенаправить хищника на другое своё животное, которое он мог бы съесть. Цепь мимикрии не возвращается на исходное.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		defense: "mimicry",
		aiValue: 4
	}
};
Object.keys(TRAITS);
/** Свойство активно: раскрыто и не отключено (шов под неоплазию/мутации). */
function isActive(t) {
	return !t.hidden && !t.disabled;
}
function player(state, id) {
	const p = state.players.find((x) => x.id === id);
	if (!p) throw new Error(`player ${id}`);
	return p;
}
function allAnimals(state) {
	return state.players.flatMap((p) => p.animals);
}
function findAnimal(state, id) {
	return allAnimals(state).find((a) => a.id === id);
}
function mustFind(state, id) {
	const a = findAnimal(state, id);
	if (!a) throw new Error(`animal ${id}`);
	return a;
}
/**
* Наличие активного свойства. Скрытые свойства по умолчанию инертны;
* отключённые (disabled) не действуют никогда.
*/
function hasTrait(animal, type, includeHidden = false) {
	return animal.traits.some((t) => t.type === type && !t.disabled && (includeHidden || !t.hidden));
}
function traitsOf(animal, type, includeHidden = false) {
	return animal.traits.filter((t) => t.type === type && !t.disabled && (includeHidden || !t.hidden));
}
function foodNeeded(animal, includeHidden = false) {
	let n = 1;
	for (const t of animal.traits) {
		if (!includeHidden && t.hidden) continue;
		if (t.disabled) continue;
		n += TRAITS[t.type].extraFood;
	}
	return n;
}
function isFed(animal, includeHidden = false) {
	if (animal.hibernating) return true;
	return animal.food >= foodNeeded(animal, includeHidden);
}
function emptyFatSlots(animal, includeHidden = false) {
	const slots = traitsOf(animal, "fatTissue", includeHidden).length;
	return Math.max(0, slots - animal.fatTokens);
}
function canReceiveFood(state, animal) {
	if (animal.hibernating) return false;
	const symbionts = animal.traits.filter((t) => t.type === "symbiosis" && t.pairRole === "b" && !t.hidden && !t.disabled && t.pairWith);
	for (const s of symbionts) {
		const host = findAnimal(state, s.pairWith);
		if (!host || !isFed(host)) return false;
	}
	if (isFed(animal)) return emptyFatSlots(animal) > 0;
	return true;
}
function livingSymbiontProtects(state, prey) {
	return prey.traits.some((t) => {
		if (t.hidden || t.disabled || t.type !== "symbiosis" || t.pairRole !== "b" || !t.pairWith) return false;
		return Boolean(findAnimal(state, t.pairWith));
	});
}
/**
* Проверка атаки целиком из реестра: симметричная вода, правила защиты
* жертвы (камуфляж/большое/норное) читаются из TraitDef.protection.
*/
function canAttack(state, carnivore, prey) {
	if (carnivore.id === prey.id) return false;
	if (!hasTrait(carnivore, "carnivore")) return false;
	if (carnivore.hibernating) return false;
	if (isFed(carnivore) && emptyFatSlots(carnivore) === 0) return false;
	if (state.modules.continents && carnivore.zoneId !== prey.zoneId) return false;
	if (livingSymbiontProtects(state, prey)) return false;
	if ([...carnivore.traits, ...prey.traits].some((t) => isActive(t) && TRAITS[t.type].symmetricAquatic) && hasTrait(carnivore, "swimming") !== hasTrait(prey, "swimming")) return false;
	for (const t of prey.traits) {
		if (!isActive(t)) continue;
		const rule = TRAITS[t.type].protection;
		if (!rule) continue;
		if (rule.stealthBypass && !hasTrait(carnivore, rule.stealthBypass)) return false;
		if (rule.needsBulkyAttacker && !hasTrait(carnivore, "highBodyWeight")) return false;
		if (rule.safeWhenFed && isFed(prey)) return false;
	}
	return true;
}
function animalValue(animal) {
	let v = 2;
	for (const t of animal.traits) {
		if (!isActive(t)) continue;
		v += 1 + TRAITS[t.type].scoreBonus;
	}
	return v;
}
function nextPlayerId(state, from = state.currentPlayerId) {
	const n = state.players.length;
	return (from + 1) % n;
}
var AI_NAMES = [
	"Дарвин",
	"Уоллес",
	"Мендель"
];
function log(state, text, tone = "neutral") {
	state.log.push({
		id: state.log.length + 1,
		text,
		tone
	});
	if (state.log.length > 80) state.log.splice(0, state.log.length - 80);
}
function ev(state, event) {
	state.lastEvents.push(event);
}
/** Id всех сущностей выдаёт состояние — снапшоты не конфликтуют между партиями. */
function nid(state, prefix) {
	state.idSeq += 1;
	return `${prefix}${state.idSeq}`;
}
function createGame(playerCount, difficulty, seed = Date.now() % 1e6, seats) {
	const names = ["Вы", ...AI_NAMES].slice(0, playerCount);
	const state = {
		players: (seats && seats.length === playerCount ? seats.map((seat, id) => ({
			id,
			name: seat.name,
			isAI: seat.isAI
		})) : names.map((name, id) => ({
			id,
			name,
			isAI: id !== 0
		}))).map((p) => ({
			...p,
			hand: [],
			animals: [],
			discardCount: 0,
			passedDev: false,
			passedFeed: false
		})),
		deck: [],
		foodBank: 0,
		foodRoll: null,
		currentPlayerId: 0,
		firstPlayerId: 0,
		phase: "development",
		year: 1,
		lastYear: false,
		deckEmptyAfterDraw: false,
		log: [],
		pendingAttack: null,
		playSeq: 0,
		humanId: 0,
		difficulty,
		rngSeed: seed,
		rngState: seed >>> 0,
		idSeq: 0,
		eventSeq: 0,
		lastEvents: [],
		devStartPlaySeq: 0,
		extinctionDeaths: [],
		modules: {}
	};
	state.deck = shuffled(state, buildDeck((prefix) => nid(state, prefix)));
	for (let i = 0; i < 6; i++) for (const p of state.players) {
		const c = state.deck.pop();
		if (c) p.hand.push(c);
	}
	const first = Math.floor(nextRandom(state) * playerCount);
	state.currentPlayerId = first;
	state.firstPlayerId = first;
	log(state, `Год 1. Первым ходит ${state.players[first].name}.`, "good");
	return state;
}
function clone(s) {
	return structuredClone(s);
}
/**
* Защита от бесконечной рекурсии парных свойств внутри одного действия
* (сотрудничество → еда → сотрудничество…). Очищается в начале applyAction;
* движок однопоточный, поэтому общий Set безопасен.
*/
var firedPairs = /* @__PURE__ */ new Set();
function beginActionEffects() {
	firedPairs.clear();
}
function ownerOf(state, animalId) {
	const p = state.players.find((x) => x.animals.some((a) => a.id === animalId));
	if (!p) throw new Error("owner");
	return p;
}
function takeCard(p, cardId) {
	const i = p.hand.findIndex((c) => c.id === cardId);
	if (i < 0) throw new Error("card not in hand");
	return p.hand.splice(i, 1)[0];
}
function faceOf(card, face) {
	const t = card.faces[face] ?? card.faces[0];
	if (!t) throw new Error("empty card");
	return t;
}
/**
* Свойство выкладывается лицом вверх (по правилам все видят, что кладут),
* hidden остаётся в типе как шов под «Случайные мутации».
*/
function makeTrait(state, card, type, extra) {
	state.playSeq += 1;
	return {
		id: nid(state, "t"),
		cardId: card.id,
		type,
		hidden: false,
		playSeq: state.playSeq,
		...extra
	};
}
function discardAnimal(state, animal) {
	const p = ownerOf(state, animal.id);
	p.discardCount += 1 + animal.traits.length;
	for (const t of animal.traits) if (t.pairWith) {
		const other = findAnimal(state, t.pairWith);
		if (other) other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
	}
	p.animals = p.animals.filter((a) => a.id !== animal.id);
}
function legalDevActions(state, playerId) {
	if (state.phase !== "development") return [];
	if (state.currentPlayerId !== playerId) return [];
	const p = player(state, playerId);
	if (p.passedDev) return [];
	const actions = [{ type: "devPass" }];
	for (const card of p.hand) {
		actions.push({
			type: "devPlayAnimal",
			cardId: card.id
		});
		for (let face = 0; face < card.faces.length; face++) {
			const trait = faceOf(card, face);
			const def = TRAITS[trait];
			if (def.opponentOnly) for (const o of state.players) {
				if (o.id === p.id) continue;
				for (const a of o.animals) if (canAttachTrait(a, trait, true)) actions.push({
					type: "devPlayTrait",
					cardId: card.id,
					face,
					animalId: a.id
				});
			}
			else if (def.isPair) {
				const mine = p.animals;
				for (let i = 0; i < mine.length; i++) for (let j = 0; j < mine.length; j++) {
					if (i === j) continue;
					if (canAttachPair(mine[i], mine[j], trait)) actions.push({
						type: "devPlayPair",
						cardId: card.id,
						face,
						a: mine[i].id,
						b: mine[j].id
					});
				}
			} else for (const a of p.animals) if (canAttachTrait(a, trait, true)) actions.push({
				type: "devPlayTrait",
				cardId: card.id,
				face,
				animalId: a.id
			});
		}
	}
	return actions;
}
function canAttachTrait(animal, trait, includeHidden) {
	const def = TRAITS[trait];
	if (trait === "parasite" && animal.traits.some((t) => t.type === "parasite")) return false;
	if (trait === "carnivore" && hasTrait(animal, "scavenger", includeHidden)) return false;
	if (trait === "scavenger" && hasTrait(animal, "carnivore", includeHidden)) return false;
	if (!def.stackable && hasTrait(animal, trait, includeHidden)) return false;
	return true;
}
function canAttachPair(a, b, trait) {
	if (a.id === b.id) return false;
	return !a.traits.some((t) => t.type === trait && t.pairWith === b.id);
}
/** Реальное действие в фазу питания: игрок снова участвует в круге. */
function spendTurn(state, playerId) {
	player(state, playerId).passedFeed = false;
}
function giveFood(state, animal, amount, kind, opts) {
	if (amount <= 0) return;
	if (!canReceiveFood(state, animal) && !(isFed(animal) && emptyFatSlots(animal) > 0)) return;
	let left = amount;
	while (left > 0) {
		if (animal.hibernating) break;
		if (isFed(animal)) {
			if (emptyFatSlots(animal) > 0) {
				animal.fatTokens += 1;
				ev(state, {
					kind: "foodToFat",
					animalId: animal.id
				});
				left -= 1;
			} else break;
		} else {
			animal.food += 1;
			left -= 1;
		}
	}
	if (amount - left <= 0) return;
	animal.receivedFoodThisYear = true;
	if (opts?.triggerComm && kind === "red") triggerPartnerEffects(state, animal, "communication");
	if (opts?.triggerCoop !== false) triggerPartnerEffects(state, animal, "cooperation");
}
/**
* Парные эффекты из реестра: свойство с onPartnerFed передаёт еду напарнику.
* Ключ защиты от рекурсии — тип эффекта плюс id карты.
*/
function triggerPartnerEffects(state, source, hook) {
	for (const t of source.traits) {
		if (!isActive(t) || t.type !== hookAsTrait(hook) || !t.pairWith) continue;
		if (TRAITS[t.type].onPartnerFed !== hook) continue;
		const key = `${hook}:${t.cardId}`;
		if (firedPairs.has(key)) continue;
		const other = findAnimal(state, t.pairWith);
		if (!other || other.hibernating) continue;
		if (hook === "communication") {
			if (state.foodBank <= 0) continue;
			if (!canReceiveFood(state, other)) continue;
			firedPairs.add(key);
			state.foodBank -= 1;
			giveFood(state, other, 1, "red", {
				triggerCoop: true,
				triggerComm: false
			});
			ev(state, {
				kind: "foodFromBank",
				animalId: other.id,
				playerId: ownerOf(state, other.id).id,
				via: "communication"
			});
			log(state, `Взаимодействие: ${ownerOf(state, other.id).name} берёт еду из базы. База: ${state.foodBank}.`);
		} else {
			if (!canReceiveFood(state, other) && emptyFatSlots(other) === 0) continue;
			firedPairs.add(key);
			giveFood(state, other, 1, "blue", {
				triggerCoop: false,
				triggerComm: false
			});
			ev(state, {
				kind: "blueFood",
				animalId: other.id,
				reason: "cooperation"
			});
			log(state, `Сотрудничество: ${ownerOf(state, other.id).name} получает 1 синюю фишку.`);
		}
	}
}
function hookAsTrait(hook) {
	return hook === "communication" ? "communication" : "cooperation";
}
function triggerScavenger(state, hunterOwnerId) {
	const n = state.players.length;
	for (let k = 0; k < n; k++) {
		const p = state.players[(hunterOwnerId + k) % n];
		for (const a of p.animals) {
			if (!a.traits.some((t) => t.type === "scavenger" && isActive(t))) continue;
			if (a.hibernating) continue;
			if (isFed(a) && emptyFatSlots(a) === 0) continue;
			if (!canReceiveFood(state, a) && !isFed(a)) continue;
			giveFood(state, a, 1, "blue");
			ev(state, {
				kind: "blueFood",
				animalId: a.id,
				reason: "scavenger"
			});
			log(state, `Падальщик ${p.name} получает 1 синюю фишку.`, "good");
			return;
		}
	}
}
/**
* Фаза питания по правилам: за ход — ровно одно действие (взять фишку,
* напасть, пиратство, спячка, топтун). Превращение жира — свободное
* действие, ход не тратит. Пас доступен всегда.
*/
function legalFeedActions(state, playerId) {
	if (state.phase !== "feeding") return [];
	if (state.pendingAttack) return [];
	if (state.currentPlayerId !== playerId) return [];
	const p = player(state, playerId);
	const actions = [];
	for (const a of p.animals) {
		if (state.foodBank > 0 && canReceiveFood(state, a)) actions.push({
			type: "feedTake",
			animalId: a.id
		});
		if (hasTrait(a, "carnivore") && !a.hibernating) {
			if (!(isFed(a) && emptyFatSlots(a) === 0)) {
				for (const prey of allAnimals(state)) if (canAttack(state, a, prey)) actions.push({
					type: "feedHunt",
					carnivoreId: a.id,
					preyId: prey.id
				});
			}
		}
		if (hasTrait(a, "piracy") && !isFed(a) && !a.hibernating) for (const t of allAnimals(state)) {
			if (t.id === a.id) continue;
			if (!t.receivedFoodThisYear) continue;
			if (isFed(t)) continue;
			if (t.food <= 0) continue;
			actions.push({
				type: "feedPirate",
				pirateId: a.id,
				targetId: t.id
			});
		}
		if (hasTrait(a, "hibernation") && !a.hibernatedLastYear && !state.lastYear && !a.hibernating && !isFed(a)) actions.push({
			type: "feedHibernate",
			animalId: a.id
		});
		if (a.fatTokens > 0 && !a.hibernating && !isFed(a)) {
			const need = Math.max(1, foodNeeded(a) - a.food);
			actions.push({
				type: "feedConvertFat",
				animalId: a.id,
				amount: Math.min(a.fatTokens, need)
			});
		}
		if (state.foodBank > 0 && hasTrait(a, "grazing")) actions.push({
			type: "feedGraze",
			animalId: a.id
		});
	}
	actions.push({ type: "feedSkip" });
	return actions;
}
function defenseOptions(animal, attack) {
	const opts = [];
	for (const t of animal.traits) {
		if (!isActive(t)) continue;
		const kind = TRAITS[t.type].defense;
		if (!kind || attack.usedDefenses.includes(kind)) continue;
		if (kind === "mimicry" && attack.mimicryChain.includes(animal.id)) continue;
		if (!opts.includes(kind)) opts.push(kind);
	}
	return opts;
}
function mimicryTargets(state, attack, prey) {
	const owner = ownerOf(state, prey.id);
	const carnivore = mustFind(state, attack.carnivoreId);
	return owner.animals.filter((a) => {
		if (a.id === prey.id) return false;
		if (attack.mimicryChain.includes(a.id)) return false;
		return canAttack(state, carnivore, a);
	});
}
function legalDefenseActions(state, playerId) {
	const atk = state.pendingAttack;
	if (!atk || atk.waitingFor !== playerId) return [];
	const prey = findAnimal(state, atk.preyId);
	if (!prey) return [{
		type: "chooseDefense",
		kind: "none"
	}];
	const actions = [{
		type: "chooseDefense",
		kind: "none"
	}];
	const opts = defenseOptions(prey, atk);
	if (opts.includes("running")) actions.push({
		type: "chooseDefense",
		kind: "running"
	});
	if (opts.includes("mimicry")) for (const t of mimicryTargets(state, atk, prey)) actions.push({
		type: "chooseDefense",
		kind: "mimicry",
		mimicryTargetId: t.id
	});
	if (opts.includes("tailLoss")) for (const tr of prey.traits.filter((t) => !t.hidden)) actions.push({
		type: "chooseDefense",
		kind: "tailLoss",
		discardTraitId: tr.id
	});
	return actions;
}
function finishHuntSuccess(state, carnivore, prey, foodGain) {
	const hunter = ownerOf(state, carnivore.id);
	const victim = ownerOf(state, prey.id);
	const poisoned = prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller) && foodGain === 2;
	ev(state, {
		kind: "preyKilled",
		preyId: prey.id,
		carnivoreId: carnivore.id
	});
	log(state, `${hunter.name} охотится: ${victim.name} теряет животное (${animalValue(prey)} очк.).`, "hunt");
	if (poisoned) {
		carnivore.poisoned = true;
		log(state, `Хищник ${hunter.name} отравлен и погибнет в вымирание.`, "bad");
	}
	discardAnimal(state, prey);
	giveFood(state, carnivore, foodGain, "blue");
	ev(state, {
		kind: "blueFood",
		animalId: carnivore.id,
		reason: "hunt"
	});
	if (foodGain === 2) {
		for (const def of Object.values(TRAITS)) if (def.onAnyKill === "scavenger") {
			triggerScavenger(state, hunter.id);
			break;
		}
	}
	state.pendingAttack = null;
}
function resolveNoDefense(state) {
	const atk = state.pendingAttack;
	if (!atk) return;
	const carnivore = findAnimal(state, atk.carnivoreId);
	const prey = findAnimal(state, atk.preyId);
	if (!carnivore || !prey) {
		state.pendingAttack = null;
		return;
	}
	finishHuntSuccess(state, carnivore, prey, 2);
}
function applyAction(state, action) {
	const next = clone(state);
	beginActionEffects();
	next.eventSeq += 1;
	next.lastEvents = [];
	switch (action.type) {
		case "devPlayAnimal":
			playAnimal(next, action.cardId);
			break;
		case "devPlayTrait":
			playTrait(next, action.cardId, action.face, action.animalId);
			break;
		case "devPlayPair":
			playPair(next, action.cardId, action.face, action.a, action.b);
			break;
		case "devPass":
			passDev(next);
			break;
		case "rollFoodBank":
			startFoodRoll(next);
			break;
		case "beginFeeding":
			beginFeeding(next);
			break;
		case "continueExtinction":
			continueAfterExtinction(next);
			break;
		case "feedTake":
			feedTake(next, action.animalId);
			break;
		case "feedHunt":
			feedHunt(next, action.carnivoreId, action.preyId);
			break;
		case "feedPirate":
			feedPirate(next, action.pirateId, action.targetId);
			break;
		case "feedHibernate":
			feedHibernate(next, action.animalId);
			break;
		case "feedConvertFat":
			feedConvertFat(next, action.animalId, action.amount);
			break;
		case "feedGraze":
			feedGraze(next, action.animalId);
			break;
		case "feedSkip":
			skipFeed(next);
			break;
		case "chooseDefense":
			applyDefense(next, action);
			break;
		default: throw new Error(`unknown action ${action.type}`);
	}
	return next;
}
function playAnimal(state, cardId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const animal = {
		id: nid(state, "a"),
		ownerId: p.id,
		cardId: card.id,
		traits: [],
		food: 0,
		fatTokens: 0,
		hibernating: false,
		hibernatedLastYear: false,
		receivedFoodThisYear: false,
		poisoned: false,
		seed: card.id.length * 17 + p.id * 13 + p.animals.length
	};
	p.animals.push(animal);
	ev(state, {
		kind: "animalPlaced",
		animalId: animal.id,
		ownerId: p.id
	});
	log(state, `${p.name} выкладывает новое животное.`);
	advanceDev(state);
}
function playTrait(state, cardId, face, animalId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const trait = faceOf(card, face);
	mustFind(state, animalId).traits.push(makeTrait(state, card, trait));
	ev(state, {
		kind: "traitPlaced",
		animalId,
		type: trait,
		hidden: false
	});
	const targetOwner = ownerOf(state, animalId);
	if (trait === "parasite") log(state, `${p.name}: ${TRAITS[trait].name} → животное ${targetOwner.name}.`, "bad");
	else log(state, `${p.name}: свойство ${TRAITS[trait].name}.`);
	advanceDev(state);
}
function playPair(state, cardId, face, aId, bId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const trait = faceOf(card, face);
	const a = mustFind(state, aId);
	const b = mustFind(state, bId);
	a.traits.push(makeTrait(state, card, trait, {
		pairWith: b.id,
		pairRole: "a"
	}));
	b.traits.push(makeTrait(state, card, trait, {
		pairWith: a.id,
		pairRole: "b",
		playSeq: state.playSeq
	}));
	ev(state, {
		kind: "traitPlaced",
		animalId: aId,
		type: trait,
		hidden: false
	});
	log(state, `${p.name} связывает двух животных.`);
	advanceDev(state);
}
function passDev(state) {
	const p = player(state, state.currentPlayerId);
	p.passedDev = true;
	log(state, `${p.name} пасует.`);
	advanceDev(state);
}
function advanceDev(state) {
	if (state.players.every((p) => p.passedDev || p.hand.length === 0)) {
		for (const p of state.players) if (p.hand.length === 0) p.passedDev = true;
	}
	if (state.players.every((p) => p.passedDev)) {
		revealAndStartFood(state);
		return;
	}
	let id = nextPlayerId(state);
	for (let i = 0; i < state.players.length; i++) {
		if (!player(state, id).passedDev) {
			state.currentPlayerId = id;
			return;
		}
		id = nextPlayerId(state, id);
	}
	revealAndStartFood(state);
}
function revealAndStartFood(state) {
	for (const a of allAnimals(state)) {
		a.traits.sort((x, y) => x.playSeq - y.playSeq);
		const seen = /* @__PURE__ */ new Set();
		const keep = [];
		for (const t of a.traits) {
			const key = t.type === "fatTissue" ? t.id : t.pairWith ? `${t.type}:${t.pairWith}` : t.type;
			if (t.type === "carnivore" && a.traits.some((x) => x.type === "scavenger" && x.playSeq < t.playSeq)) continue;
			if (t.type === "scavenger" && a.traits.some((x) => x.type === "carnivore" && x.playSeq < t.playSeq)) continue;
			if (t.type !== "fatTissue" && seen.has(key)) continue;
			seen.add(key);
			t.hidden = false;
			keep.push(t);
		}
		a.traits = keep;
	}
	ev(state, { kind: "traitsRevealed" });
	log(state, "Определение кормовой базы.", "good");
	state.phase = "foodBank";
	state.foodRoll = null;
	state.foodBank = 0;
}
/** Действие rollFoodBank: бросаем кубики и запоминаем их — сумма ложится в банк после анимации. */
function startFoodRoll(state) {
	if (state.phase !== "foodBank" || state.foodRoll) return;
	const n = state.players.length;
	const dice = n === 2 ? [dieFor(state)] : [dieFor(state), dieFor(state)];
	let food = dice.reduce((s, d) => s + d, 0);
	if (n === 2) food += 2;
	else if (n >= 4) food += 2;
	state.foodRoll = dice;
	state.foodBank = food;
	ev(state, {
		kind: "diceRoll",
		dice,
		total: food
	});
	log(state, `Кубики кормовой базы: ${dice.join(" + ")}${n !== 3 ? " (+2)" : ""} = ${food}.`, "good");
}
/** Действие beginFeeding: вызывается после показа кубиков, стартует питание по кругу. */
function beginFeeding(state) {
	if (state.phase !== "foodBank" || !state.foodRoll) return;
	state.phase = "feeding";
	state.currentPlayerId = state.firstPlayerId;
	for (const p of state.players) p.passedFeed = false;
	log(state, `Кормовая база: ${state.foodBank}.`, "good");
	feedTurn(state, state.firstPlayerId);
}
/**
* Круг питания: ход переходит к следующему игроку, который не пасовал
* и имеет реальное действие. Фаза заканчивается, только когда все
* пасанули либо никому ничего не доступно (правило конца фазы).
*/
function feedTurn(state, startId) {
	let id = startId;
	for (let i = 0; i < state.players.length; i++) {
		const p = player(state, id);
		const real = legalFeedActions({
			...state,
			currentPlayerId: id
		}, id).filter((a) => a.type !== "feedSkip");
		if (!p.passedFeed && real.length > 0) {
			state.currentPlayerId = id;
			return;
		}
		id = nextPlayerId(state, id);
	}
	endFeeding(state);
}
function advanceFeed(state) {
	if (state.pendingAttack) return;
	feedTurn(state, nextPlayerId(state));
}
function feedTake(state, animalId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	if (state.foodBank <= 0) {
		advanceFeed(state);
		return;
	}
	const a = mustFind(state, animalId);
	state.foodBank -= 1;
	giveFood(state, a, 1, "red", {
		triggerComm: true,
		triggerCoop: true
	});
	ev(state, {
		kind: "foodFromBank",
		animalId: a.id,
		playerId: p.id,
		via: "take"
	});
	log(state, `${p.name} берёт еду из базы (${state.foodBank} осталось).`);
	advanceFeed(state);
}
function feedHunt(state, carnivoreId, preyId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const carnivore = mustFind(state, carnivoreId);
	const prey = mustFind(state, preyId);
	if (!canAttack(state, carnivore, prey)) {
		advanceFeed(state);
		return;
	}
	ev(state, {
		kind: "huntDeclared",
		carnivoreId,
		preyId
	});
	const atk = {
		carnivoreId,
		preyId,
		mimicryChain: [],
		waitingFor: prey.ownerId,
		usedDefenses: []
	};
	state.pendingAttack = atk;
	if (defenseOptions(prey, atk).length === 0) {
		resolveNoDefense(state);
		advanceFeed(state);
		return;
	}
	log(state, `${p.name} атакует животное игрока ${ownerOf(state, prey.id).name}!`, "hunt");
}
function feedPirate(state, pirateId, targetId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const pirate = mustFind(state, pirateId);
	const target = mustFind(state, targetId);
	if (target.food <= 0 || isFed(target)) {
		advanceFeed(state);
		return;
	}
	target.food -= 1;
	giveFood(state, pirate, 1, "blue");
	ev(state, {
		kind: "blueFood",
		animalId: pirate.id,
		reason: "piracy"
	});
	log(state, `${p.name} пиратствует у ${ownerOf(state, target.id).name}.`, "hunt");
	advanceFeed(state);
}
function feedHibernate(state, animalId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const a = mustFind(state, animalId);
	a.hibernating = true;
	log(state, `${p.name} использует спячку.`, "good");
	advanceFeed(state);
}
/** Превращение жира в еду — свободное действие: ход не тратится. */
function feedConvertFat(state, animalId, amount) {
	const p = player(state, state.currentPlayerId);
	const a = mustFind(state, animalId);
	const n = Math.min(amount, a.fatTokens);
	a.fatTokens -= n;
	a.food += n;
	ev(state, {
		kind: "blueFood",
		animalId: a.id,
		reason: "fat"
	});
	log(state, `${p.name} тратит жировой запас (${n}). Ход продолжается.`);
}
/** Топтун — отдельное действие хода: уничтожает 1 фишку из базы. */
function feedGraze(state, animalId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	if (!hasTrait(mustFind(state, animalId), "grazing") || state.foodBank <= 0) {
		advanceFeed(state);
		return;
	}
	state.foodBank -= 1;
	ev(state, {
		kind: "bankBurned",
		amount: 1
	});
	log(state, `${p.name}: топтун уничтожает 1 еду. База: ${state.foodBank}.`);
	advanceFeed(state);
}
/** Пас: игрок пропускается, пока не сделает реальное действие (или до конца фазы). */
function skipFeed(state) {
	const p = player(state, state.currentPlayerId);
	p.passedFeed = true;
	log(state, `${p.name} пасует.`);
	advanceFeed(state);
}
function applyDefense(state, action) {
	const atk = state.pendingAttack;
	if (!atk) return;
	const carnivore = findAnimal(state, atk.carnivoreId);
	const prey = findAnimal(state, atk.preyId);
	if (!carnivore || !prey) {
		state.pendingAttack = null;
		advanceFeed(state);
		return;
	}
	if (action.kind === "running") {
		atk.usedDefenses.push("running");
		const roll = dieFor(state);
		ev(state, {
			kind: "defenseUsed",
			defense: "running",
			roll,
			preyId: atk.preyId
		});
		if (roll >= 4) {
			log(state, `Быстрое: выпало ${roll} — животное спаслось!`, "good");
			state.pendingAttack = null;
			advanceFeed(state);
			return;
		}
		log(state, `Быстрое: выпало ${roll} — хищник догнал.`, "bad");
		if (defenseOptions(prey, atk).length === 0) {
			resolveNoDefense(state);
			advanceFeed(state);
		}
		return;
	}
	if (action.kind === "mimicry" && action.mimicryTargetId) {
		atk.usedDefenses.push("mimicry");
		atk.mimicryChain.push(prey.id);
		atk.preyId = action.mimicryTargetId;
		atk.waitingFor = mustFind(state, action.mimicryTargetId).ownerId;
		atk.usedDefenses = [];
		ev(state, {
			kind: "defenseUsed",
			defense: "mimicry",
			preyId: atk.preyId
		});
		log(state, "Мимикрия перенаправляет атаку.");
		if (defenseOptions(mustFind(state, atk.preyId), atk).length === 0) {
			resolveNoDefense(state);
			advanceFeed(state);
		}
		return;
	}
	if (action.kind === "tailLoss" && action.discardTraitId) {
		const trait = prey.traits.find((t) => t.id === action.discardTraitId);
		if (trait) {
			if (trait.pairWith) {
				const other = findAnimal(state, trait.pairWith);
				if (other) other.traits = other.traits.filter((x) => x.cardId !== trait.cardId);
			}
			prey.traits = prey.traits.filter((t) => t.cardId !== trait.cardId);
			ownerOf(state, prey.id).discardCount += 1;
		}
		giveFood(state, carnivore, 1, "blue");
		ev(state, {
			kind: "blueFood",
			animalId: carnivore.id,
			reason: "tailLoss"
		});
		ev(state, {
			kind: "defenseUsed",
			defense: "tailLoss",
			preyId: atk.preyId
		});
		log(state, "Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.", "good");
		state.pendingAttack = null;
		advanceFeed(state);
		return;
	}
	ev(state, {
		kind: "defenseUsed",
		defense: "none",
		preyId: atk.preyId
	});
	resolveNoDefense(state);
	advanceFeed(state);
}
/**
* Питание закончено: остаток базы сгорает, вычисляется список погибших.
* Животные удаляются позже — действием continueExtinction, чтобы игроки
* увидели стадию вымирания, а не мгновенный переход.
*/
function endFeeding(state) {
	if (state.foodBank > 0) {
		ev(state, {
			kind: "bankBurned",
			amount: state.foodBank
		});
		log(state, `Остаток кормовой базы (${state.foodBank}) сгорает.`);
		state.foodBank = 0;
	}
	state.phase = "extinction";
	state.extinctionDeaths = [];
	for (const a of allAnimals(state)) if (a.poisoned || !isFed(a)) state.extinctionDeaths.push(a.id);
	for (const id of state.extinctionDeaths) {
		const a = findAnimal(state, id);
		if (!a) continue;
		const p = ownerOf(state, id);
		log(state, a.poisoned ? `Хищник ${p.name} погибает от яда.` : `Животное ${p.name} вымирает — не накормлено.`, "bad");
	}
}
/** Действие continueExtinction: убирает погибших, сбрасывает годовые флаги, добирает карты. */
function continueAfterExtinction(state) {
	if (state.phase !== "extinction") return;
	for (const id of state.extinctionDeaths) {
		const a = findAnimal(state, id);
		if (!a) continue;
		ev(state, {
			kind: "animalDied",
			animalId: id,
			cause: a.poisoned ? "poison" : "starved"
		});
		discardAnimal(state, a);
	}
	state.extinctionDeaths = [];
	for (const a of allAnimals(state)) {
		a.food = 0;
		a.hibernatedLastYear = a.hibernating;
		a.hibernating = false;
		a.receivedFoodThisYear = false;
		a.poisoned = false;
	}
	if (state.lastYear || state.deck.length === 0 && state.deckEmptyAfterDraw) {
		finishGame(state);
		return;
	}
	drawCards(state);
}
function drawCards(state) {
	const start = state.firstPlayerId;
	const n = state.players.length;
	let emptied = state.deck.length === 0;
	const counts = new Array(n).fill(0);
	for (let k = 0; k < n; k++) {
		const idx = (start + k) % n;
		const p = state.players[idx];
		let want = p.animals.length + 1;
		if (p.animals.length === 0 && p.hand.length === 0) want = 6;
		for (let i = 0; i < want; i++) {
			const c = state.deck.pop();
			if (!c) {
				emptied = true;
				break;
			}
			p.hand.push(c);
			counts[idx] += 1;
		}
	}
	ev(state, {
		kind: "cardsDrawn",
		counts
	});
	if (emptied || state.deck.length === 0) {
		state.deckEmptyAfterDraw = true;
		state.lastYear = true;
	}
	for (const p of state.players) p.passedDev = false;
	state.firstPlayerId = nextPlayerId(state, state.firstPlayerId);
	state.currentPlayerId = state.firstPlayerId;
	state.year += 1;
	state.phase = "development";
	state.devStartPlaySeq = state.playSeq;
	log(state, state.lastYear ? `Год ${state.year} — последний. Первым ходит ${player(state, state.firstPlayerId).name}.` : `Год ${state.year}. Первым ходит ${player(state, state.firstPlayerId).name}. Колода: ${state.deck.length}.`, state.lastYear ? "bad" : "good");
}
function finishGame(state) {
	const scores = state.players.map((p) => {
		let animals = 0;
		let traits = 0;
		let extras = 0;
		for (const a of p.animals) {
			animals += 2;
			for (const t of a.traits) {
				if (t.disabled) continue;
				traits += 1;
				extras += TRAITS[t.type].scoreBonus;
			}
		}
		return {
			playerId: p.id,
			name: p.name,
			animals,
			traits,
			extras,
			total: animals + traits + extras,
			discard: p.discardCount
		};
	});
	scores.sort((a, b) => b.total - a.total || b.discard - a.discard);
	const best = scores[0];
	const winners = scores.filter((s) => s.total === best.total && s.discard === best.discard);
	state.scores = scores;
	state.winnerIds = winners.map((w) => w.playerId);
	state.phase = "gameOver";
	log(state, winners.length > 1 ? `Ничья: ${winners.map((w) => w.name).join(", ")}.` : `Победа: ${winners[0].name} (${winners[0].total} очков).`, "good");
}
function currentActor(state) {
	if (state.phase === "gameOver") return null;
	if (state.pendingAttack) return player(state, state.pendingAttack.waitingFor);
	if (state.phase === "foodBank" || state.phase === "extinction") return null;
	return player(state, state.currentPlayerId);
}
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
		return pickDefense(state, acts);
	}
	if (state.phase === "development") return pickDev(state, legalDevActions(state, state.currentPlayerId));
	if (state.phase === "feeding") return pickFeed(state, legalFeedActions(state, state.currentPlayerId));
	return null;
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
	let best = acts[0];
	let bestScore = -Infinity;
	for (const a of acts) {
		let s = 0;
		if (a.type === "devPass") {
			const keep = state.lastYear ? 0 : p.animals.length === 0 ? 0 : 1;
			s = p.hand.length <= keep ? 4 : p.hand.length <= 2 && !state.lastYear ? 1.5 : -1;
			if (p.animals.length === 0 && p.hand.length) s = -20;
		}
		if (a.type === "devPlayAnimal") {
			s = 6 - p.animals.length * 1.4;
			if (p.animals.length === 0) s = 14;
			if (state.lastYear) s = 8;
		}
		if (a.type === "devPlayTrait") {
			const card = p.hand.find((c) => c.id === a.cardId);
			const trait = card?.faces[a.face] ?? card?.faces[0];
			const animal = findAnimal(state, a.animalId);
			if (trait && animal) {
				s = (TRAITS[trait].aiValue ?? 2) + (animal.ownerId === p.id ? 1 : 0);
				if (trait === "parasite") {
					s = 7 + foodNeeded(animal) - (animal.ownerId === p.id ? 20 : 0);
					if (state.difficulty === "easy") s -= 3;
				}
				if (trait === "carnivore" && animal.ownerId === p.id) s += 3;
				if (trait === "fatTissue" && animal.ownerId === p.id) s += 2;
				if (state.lastYear) s += TRAITS[trait].scoreBonus * 2 + 1;
			}
		}
		if (a.type === "devPlayPair") {
			s = 5;
			if (state.lastYear) s += 2;
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
	return Math.max(0, foodNeeded(a) - a.food);
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
			if (hasTrait(an, "carnivore") && hunger(an) <= 2) s -= .5;
		}
		if (a.type === "feedHunt") {
			const prey = findAnimal(state, a.preyId);
			const car = findAnimal(state, a.carnivoreId);
			s = animalValue(prey) + (prey.ownerId !== p.id ? 4 : -6);
			s += hunger(car) * 1.2;
			if (hasTrait(prey, "poisonous")) s -= 5;
			if (state.difficulty === "easy") s -= 4;
			if (state.difficulty === "hard" && prey.ownerId === 0) s += 2;
		}
		if (a.type === "feedPirate") s = 6 + hunger(findAnimal(state, a.pirateId));
		if (a.type === "feedHibernate") {
			s = 5;
			if (state.foodBank > 3 && myHungry <= 1) s -= 2;
		}
		if (a.type === "feedConvertFat") s = 7;
		if (a.type === "feedGraze") {
			s = oppHungry > myHungry ? 2.5 : -1;
			if (state.foodBank <= 1) s -= 1;
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
//#endregion
export { pollInput as S, joinRoomInput as _, botsInput as a, legalFeedActions as b, chooseAIAction as c, createRoomInput as d, currentActor as f, isFed as g, hasTrait as h, applyAction as i, codeTokenInput as l, foodNeeded as m, TRAITS as n, canAttack as o, findAnimal as p, actionInput as r, canReceiveFood as s, PACE as t, createGame as u, legalDefenseActions as v, player as x, legalDevActions as y };
