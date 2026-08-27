import { a as number, c as union, i as literal, n as boolean, o as object, r as custom, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-DXMkXM_9.js
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
		literal(4),
		literal(5),
		literal(6),
		literal(7),
		literal(8)
	]),
	botSeats: number().int().min(0).max(7),
	difficulty: _enum([
		"easy",
		"normal",
		"hard"
	]),
	/** Включённые дополнения; ключи валидируются строго (белый список). */
	modules: object({ continents: boolean().optional() }).partial().default({}).optional()
});
var joinRoomInput = object({
	code: CODE,
	name: NAME
});
var codeTokenInput = object({
	code: CODE,
	token: string().min(10)
});
var botsInput = codeTokenInput.extend({ count: number().int().min(0).max(7) });
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
/**
* Карты «Континентов» (Правильные игры, 2012): 42 карты восьми новых свойств.
* Миграция крупнее всех, прилипала идёт в комплекте к ней.
* Миграция, прилипала и часть паразитов идут с гранью «водоплавающее»:
* карта даёт выбор одного из двух свойств.
*/
var CONTINENTS_SINGLES = [
	["herding", 4],
	["nematocysts", 6],
	["edificator", 6],
	["regeneration", 4]
];
/** [лицо 1, лицо 2, количество] — две грани на выбор. */
var CONTINENTS_DUALS = [
	[
		"migration",
		"swimming",
		8
	],
	[
		"remora",
		"swimming",
		6
	],
	[
		"parasite",
		"swimming",
		2
	]
];
/** Рекомбинация — парная карта; неоплазия кладётся «под» свойства. */
var CONTINENTS_PAIRS = [["recombination", 4], ["neoplasia", 2]];
SINGLES.reduce((n, [, c]) => n + c, 0) + DUALS.reduce((n, [, , c]) => n + c, 0);
function buildDeck(nextId, modules) {
	const cards = [];
	for (const [trait, n] of SINGLES) for (let i = 0; i < n; i++) cards.push({
		id: nextId("c"),
		faces: [trait]
	});
	for (const [a, b, n] of DUALS) for (let i = 0; i < n; i++) cards.push({
		id: nextId("c"),
		faces: [a, b]
	});
	if (modules?.continents) {
		for (const [trait, n] of CONTINENTS_SINGLES) for (let i = 0; i < n; i++) cards.push({
			id: nextId("c"),
			faces: [trait]
		});
		for (const [a, b, n] of CONTINENTS_DUALS) for (let i = 0; i < n; i++) cards.push({
			id: nextId("c"),
			faces: [a, b]
		});
		for (const [trait, n] of CONTINENTS_PAIRS) for (let i = 0; i < n; i++) cards.push({
			id: nextId("c"),
			faces: [trait]
		});
	}
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
		description: "В свой ход вместо фишки еды может напасть на любое животное. При успехе получает 2 синие фишки. Голодный хищник может нападать в каждый свой ход; накормленный не нападает вовсе. +1 к потребности в еде.",
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
		description: "Парное. Карта кладётся между двумя животными (на пару — одна парная карта). Первое животное — симбионт: второе нельзя съесть, пока симбионт жив, и кормить его можно только после симбионта.",
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
		description: "Раз за ход: забрать 1 фишку — красную или синюю — у любого не накормленного полностью животного, своего или чужого. Цвет фишки сохраняется. Ход при этом не заканчивается, но еду из базы в этот ход уже не взять. Накормленный пират не пиратствует.",
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
		description: "При атаке можно сбросить эту карту — животное выживает, а хищник получает только 1 синюю фишку вместо двух.",
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
		description: "Парное, карта кладётся между двумя животными. Когда одно получает красную или синюю еду, второе сразу получает 1 синюю. Не срабатывает от жирового запаса.",
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
		virusLike: true,
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
		description: "Парное, карта кладётся между двумя животными. Когда одно берёт фишку из кормовой базы, второе сразу берёт фишку из базы вне очереди.",
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
	},
	migration: {
		id: "migration",
		name: "Миграция",
		short: "Мигр.",
		description: "Объявите «Миграцию»: в этот ход не берите еду и не используйте других свойств — только миграцию и прилипал. Сколько угодно своих мигрирующих животных переезжает между континентами и из океана на континент (не наоборот). Сухопутное с континента на континент — нельзя, минуя океан.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	remora: {
		id: "remora",
		name: "Прилипала",
		short: "Прилипала",
		description: "Переезжает вместе с чужим или своим мигрирующим животным — даже с континента на континент. Сама по себе не мигрирует. Если в игре несколько прилипал, право первой объявляет игрок, начавший миграцию, дальше по часовой.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	herding: {
		id: "herding",
		name: "Стадность",
		short: "Стадность",
		description: "Защита числом: в своей локации считается отношение хищников к животным со «стадностью». Пока хищников не больше, чем стадных, — стадных нельзя атаковать. Считаются все хищники и все стадные локации, даже чужие.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		herdingProtection: true,
		aiValue: 3
	},
	nematocysts: {
		id: "nematocysts",
		name: "Стрекательные клетки",
		short: "Стрекат.",
		description: "Атаковавший это животное хищник парализован до конца фазы питания: теряет все свойства, остаётся лишь базовая потребность 1. В океане он теряет и «водоплавающее» — уплывает на континент.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		paralyzesAttacker: true,
		aiValue: 4
	},
	regeneration: {
		id: "regeneration",
		name: "Регенерация",
		short: "Регенер.",
		description: "Только на животное без свойств либо с одним свойством без +к еде. Других свойств (кроме повышающих потребность) на него играть нельзя — всего не больше двух. Съеденное хищником регенерирует: в вымирание владелец кладёт карту из руки как животное поверх оставленных свойств, без добора за него.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	recombination: {
		id: "recombination",
		name: "Рекомбинация",
		short: "Рекомб.",
		description: "Парная, кладётся между двумя животными. Каждое обязано передать напарнику одно своё свойство; дубликаты сбрасываются. Потеряло «водоплавающее» — переезжает на континент. Свойство, уже использованное прежним владельцем в этот ход, повторно не работает.",
		isPair: true,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	edificator: {
		id: "edificator",
		name: "Эдификатор",
		short: "Эдифик.",
		description: "В начале определения кормовой базы добавляет 2 красные фишки в банк своей территории. Эдификаторов несколько — добавляют каждый за себя.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	neoplasia: {
		id: "neoplasia",
		name: "Неоплазия",
		short: "Неоплазия",
		description: "Играется на ЛЮБОЕ животное (своё или чужое), только на непарные свойства. Кладётся под свойства и каждый год в начале определения кормовой базы поднимается: выключает лежащее выше непарное свойство (оно перестаёт действовать, но очки даёт). Выключать нечего — животное немедленно погибает. «Водоплавающее» в океане неприкосновенно.",
		isPair: false,
		opponentOnly: false,
		anyTarget: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		virusLike: true,
		aiValue: -6
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
/** Территория животного; вне «Континентов» зоны нет — все в одном поле. */
function territoryOf(state, a) {
	return state.modules.continents ? a.zoneId : void 0;
}
/**
* Водность животного. В «Континентах» океан сам делает животное водным:
* пока оно в океане, свойство «водоплавающее» неотчуждаемо (его не снять
* ни неоплазией, ни рекомбинацией, ни параличом). На континенте водность —
* только по карте свойства.
*/
function isAquatic(state, animal) {
	if (state.modules.continents && animal.zoneId === "ocean") return true;
	return hasTrait(animal, "swimming");
}
/** Паралич стрекательными клетками: хищник теряет ВСЕ свойства до конца фазы
* питания (остаётся базовая потребность 1), в океане ещё и водоплавающее.
*/
function isParalyzed(state, animalId) {
	return Boolean(state.paralyzed?.includes(animalId));
}
/**
* Активен ли хищник как хищник: не спит, голоден, жив и не парализован.
* Свойства сытого (и парализованного) животного не работают.
*/
function canHuntWith(state, carnivore) {
	if (!hasTrait(carnivore, "carnivore")) return false;
	if (carnivore.hibernating || isFed(carnivore)) return false;
	return !isParalyzed(state, carnivore.id);
}
/** Сколько животных со «стадностью» и сколько хищников находится в локации. */
function herdingBalance(state, zone) {
	let herding = 0;
	let carnivores = 0;
	for (const a of allAnimals(state)) {
		if (territoryOf(state, a) !== zone) continue;
		if (a.traits.some((t) => t.type === "herding" && isActive(t))) herding += 1;
		if (hasTrait(a, "carnivore")) carnivores += 1;
	}
	return {
		herding,
		carnivores
	};
}
/** Защищено ли стадное животное в своей локации: стадных строго больше хищников. */
function herdingProtects(state, prey) {
	if (!state.modules.continents) return false;
	if (!prey.traits.some((t) => t.type === "herding" && isActive(t))) return false;
	const bal = herdingBalance(state, prey.zoneId ?? "laurasia");
	return bal.herding > bal.carnivores;
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
	if (isFed(carnivore)) return false;
	if (isParalyzed(state, carnivore.id)) return false;
	if (state.modules.continents) {
		if (carnivore.zoneId !== prey.zoneId) return false;
		if (herdingProtects(state, prey)) return false;
	}
	if (livingSymbiontProtects(state, prey)) return false;
	const aquaticRule = [...carnivore.traits, ...prey.traits].some((t) => isActive(t) && TRAITS[t.type].symmetricAquatic);
	const zoneAquatic = state.modules.continents && (carnivore.zoneId === "ocean" || prey.zoneId === "ocean");
	if ((aquaticRule || zoneAquatic) && isAquatic(state, carnivore) !== isAquatic(state, prey)) return false;
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
/** Животное мигрирует само (свойство «миграция» активно и не парализовано). */
function canMigrate(state, a) {
	return a.traits.some((t) => t.type === "migration" && isActive(t)) && !a.hibernating && !isParalyzed(state, a.id);
}
function nextPlayerId(state, from = state.currentPlayerId) {
	const n = state.players.length;
	return (from + 1) % n;
}
var AI_NAMES = [
	"Дарвин",
	"Уоллес",
	"Мендель",
	"Линней",
	"Кювье",
	"Ламарк",
	"Геккель"
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
function createGame(playerCount, difficulty, seed = Date.now() % 1e6, seats, modules) {
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
		modules: modules ?? {},
		paralyzed: modules?.continents ? [] : void 0,
		turnUse: freshTurnUse()
	};
	state.deck = shuffled(state, buildDeck((prefix) => nid(state, prefix), state.modules));
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
	const cont = state.modules.continents;
	const actions = [{ type: "devPass" }];
	for (const card of p.hand) {
		if (cont) {
			actions.push({
				type: "devPlayAnimal",
				cardId: card.id,
				zoneId: "laurasia"
			});
			actions.push({
				type: "devPlayAnimal",
				cardId: card.id,
				zoneId: "gondwana"
			});
		} else actions.push({
			type: "devPlayAnimal",
			cardId: card.id
		});
		for (let face = 0; face < card.faces.length; face++) {
			const trait = faceOf(card, face);
			const def = TRAITS[trait];
			if (def.opponentOnly || def.anyTarget) for (const o of state.players) {
				if (def.opponentOnly && o.id === p.id) continue;
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
			} else for (const a of p.animals) {
				if (!canAttachTrait(a, trait, true)) continue;
				if (cont && trait !== "neoplasia" && !sameTerritoryPairOk(state, a, trait)) continue;
				actions.push({
					type: "devPlayTrait",
					cardId: card.id,
					face,
					animalId: a.id
				});
			}
		}
	}
	return actions;
}
/**
* «Континенты»: непарное свойство можно класть на любое своё животное —
* зоны запрещают только парные карты между разными территориями. Для
* одиночного животного ограничений нет, проверка нужна парной карте.
*/
function sameTerritoryPairOk(_state, _a, _trait) {
	return true;
}
function canAttachTrait(animal, trait, includeHidden) {
	const def = TRAITS[trait];
	if (trait === "parasite" && animal.traits.some((t) => t.type === "parasite")) return false;
	if (trait === "carnivore" && hasTrait(animal, "scavenger", includeHidden)) return false;
	if (trait === "scavenger" && hasTrait(animal, "carnivore", includeHidden)) return false;
	if (!def.stackable && hasTrait(animal, trait, includeHidden)) return false;
	if (trait === "regeneration") {
		if (animal.traits.length > 1) return false;
		if (animal.traits.some((t) => TRAITS[t.type].extraFood > 0)) return false;
		if (hasTrait(animal, "regeneration", includeHidden)) return false;
	}
	if (hasTrait(animal, "regeneration", includeHidden) && animal.traits.length >= 2) return false;
	if (hasTrait(animal, "regeneration", includeHidden) && def.extraFood > 0) return false;
	return true;
}
function canAttachPair(a, b, _trait) {
	if (a.id === b.id) return false;
	if (a.zoneId !== b.zoneId) return false;
	return !(a.traits.some((t) => t.pairWith === b.id) || b.traits.some((t) => t.pairWith === a.id));
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
			if (kind === "blue") animal.blueFood += 1;
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
* Фаза питания. Ход длится, пока игрок сам его не закончит: за один ход можно
* напасть каждым хищником и/или использовать каждого пирата — либо взять одну
* фишку из базы (еда и боевые действия несовместимы). Превращение жира —
* свободное действие. Накормленное животное свойства не использует вовсе:
* единственное, что ему остаётся, — доложить фишку в пустой жировой запас.
*/
function legalFeedActions(state, playerId) {
	if (state.phase !== "feeding") return [];
	if (state.pendingAttack) return [];
	if (state.currentPlayerId !== playerId) return [];
	const p = player(state, playerId);
	const actions = [];
	const used = state.turnUse;
	const cont = state.modules.continents;
	const turnTerritory = state.turnTerritory;
	for (const a of p.animals) {
		if (cont && used.migrated) break;
		const zone = a.zoneId ?? "laurasia";
		const territoryUnlocked = !cont || turnTerritory === void 0 || turnTerritory === zone;
		if ((cont ? (state.territoryFood?.[zone] ?? 0) > 0 : state.foodBank > 0) && territoryUnlocked && !used.foodTaken && !used.combatUsed && canReceiveFood(state, a)) actions.push({
			type: "feedTake",
			animalId: a.id
		});
		if (canHuntWith(state, a) && !used.carnivores.includes(a.id) && !used.foodTaken) {
			for (const prey of allAnimals(state)) if (canAttack(state, a, prey)) actions.push({
				type: "feedHunt",
				carnivoreId: a.id,
				preyId: prey.id
			});
		}
		if (hasTrait(a, "piracy") && !isFed(a) && !a.hibernating && !used.pirates.includes(a.id) && !used.foodTaken && !isParalyzed(state, a.id)) for (const t of allAnimals(state)) {
			if (t.id === a.id) continue;
			if (cont && t.zoneId !== a.zoneId) continue;
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
		if (!cont && state.foodBank > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !isFed(a)) actions.push({
			type: "feedGraze",
			animalId: a.id
		});
		if (cont && (state.territoryFood?.[zone] ?? 0) > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !isFed(a)) {
			if (turnTerritory === void 0 || turnTerritory === zone) actions.push({
				type: "feedGraze",
				animalId: a.id
			});
		}
		if (cont && canMigrate(state, a) && !used.migrated) {
			const targets = migrationTargets(state, a);
			for (const to of targets) actions.push({
				type: "feedMigrate",
				moves: [{
					animalId: a.id,
					to
				}]
			});
		}
	}
	actions.push({ type: "feedEndTurn" });
	actions.push({ type: "feedSkip" });
	return actions;
}
/**
* Куда может уйти мигрирующее животное по правилам «Континентов»:
* океан ↔ континенты; континент → континент минуя океан — нельзя.
*/
function migrationTargets(state, a) {
	const from = a.zoneId ?? "laurasia";
	const swim = from === "ocean" || hasTrait(a, "swimming");
	const out = [];
	if (from === "ocean") out.push("laurasia", "gondwana");
	else if (swim) out.push("ocean");
	return out.filter((z) => z !== from);
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
	if (opts.includes("tailLoss")) {
		const tail = prey.traits.find((t) => isActive(t) && t.type === "tailLoss");
		if (tail) actions.push({
			type: "chooseDefense",
			kind: "tailLoss",
			discardTraitId: tail.id
		});
	}
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
	if (prey.traits.some((t) => isActive(t) && TRAITS[t.type].paralyzesAttacker)) {
		state.paralyzed = state.paralyzed ?? [];
		if (!state.paralyzed.includes(carnivore.id)) state.paralyzed.push(carnivore.id);
		if (state.modules.continents && carnivore.zoneId === "ocean") {
			oceanExpel(state, carnivore);
			log(state, `Хищник парализован в океане — выброшен на континент.`, "bad");
		} else log(state, `Хищник ${hunter.name} парализован стрекательными клетками.`, "bad");
		ev(state, {
			kind: "paralyzed",
			carnivoreId: carnivore.id
		});
	}
	if (hasTrait(prey, "regeneration")) {
		state.pendingRegeneration = [...state.pendingRegeneration ?? [], regenSnapshotOf(prey, victim.id)];
		log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "good");
		const p0 = ownerOf(state, prey.id);
		p0.animals = p0.animals.filter((a) => a.id !== prey.id);
		p0.discardCount += 1;
	} else discardAnimal(state, prey);
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
	maybeEndTurn(state);
}
function regenSnapshotOf(a, ownerId) {
	return {
		ownerId,
		cardIds: a.traits.map((t) => t.cardId)
	};
}
/**
* Вытеснение из океана: животное теряет «водоплавающее»-зависимость размещения
* (само свойство остаётся при параличе) и уходит на ближайший континент.
*/
function oceanExpel(state, a) {
	a.zoneId = nextRandom(state) < .5 ? "laurasia" : "gondwana";
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
			playAnimal(next, action.cardId, action.zoneId);
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
		case "feedEndTurn":
			feedEndTurn(next);
			break;
		case "feedSkip":
			skipFeed(next);
			break;
		case "feedMigrate":
			feedMigrate(next, action.moves);
			break;
		case "reorderAnimal":
			if (action.toZoneId) moveAnimalToZoneHuman(next, action.animalId, action.toZoneId);
			else reorderAnimal(next, action.animalId, action.beforeId);
			break;
		case "chooseDefense":
			applyDefense(next, action);
			break;
		default: throw new Error(`unknown action ${action.type}`);
	}
	return next;
}
function playAnimal(state, cardId, zoneId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const zone = state.modules.continents ? zoneId === "ocean" ? "laurasia" : zoneId ?? "laurasia" : zoneId ?? "laurasia";
	const animal = {
		id: nid(state, "a"),
		ownerId: p.id,
		cardId: card.id,
		traits: [],
		food: 0,
		blueFood: 0,
		fatTokens: 0,
		hibernating: false,
		hibernatedLastYear: false,
		receivedFoodThisYear: false,
		poisoned: false,
		seed: card.id.length * 17 + p.id * 13 + p.animals.length,
		...state.modules.continents ? { zoneId: zone } : {}
	};
	p.animals.push(animal);
	ev(state, {
		kind: "animalPlaced",
		animalId: animal.id,
		ownerId: p.id,
		zoneId: animal.zoneId
	});
	log(state, state.modules.continents ? `${p.name} выкладывает новое животное (${zone === "laurasia" ? "Лавразия" : "Гондвана"}).` : `${p.name} выкладывает новое животное.`);
	advanceDev(state);
}
function playTrait(state, cardId, face, animalId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const trait = faceOf(card, face);
	const animal = mustFind(state, animalId);
	if (trait === "neoplasia") {
		animal.traits.unshift(makeTrait(state, card, trait));
		animal.neoplasia = animal.traits[0];
	} else animal.traits.push(makeTrait(state, card, trait));
	ev(state, {
		kind: "traitPlaced",
		animalId,
		type: trait,
		hidden: false
	});
	const targetOwner = ownerOf(state, animalId);
	if (trait === "parasite") log(state, `${p.name}: ${TRAITS[trait].name} → животное ${targetOwner.name}.`, "bad");
	else log(state, `${p.name}: свойство ${TRAITS[trait].name}.`);
	settleAfterTraitChange(state, animal);
	advanceDev(state);
}
function playPair(state, cardId, face, aId, bId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const trait = faceOf(card, face);
	const a = mustFind(state, aId);
	const b = mustFind(state, bId);
	if (state.modules.continents && a.zoneId !== b.zoneId) throw new Error("pair across territories");
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
	const ai = p.animals.findIndex((x) => x.id === aId);
	const bi = p.animals.findIndex((x) => x.id === bId);
	if (ai >= 0 && bi >= 0 && bi !== ai + 1) {
		const [bAnimal] = p.animals.splice(bi, 1);
		p.animals.splice(bi < ai ? ai : ai + 1, 0, bAnimal);
	}
	log(state, `${p.name} связывает двух животных: ${TRAITS[trait].name}.`);
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
		if (a.neoplasia && a.traits[0] !== a.neoplasia) a.traits = [a.neoplasia, ...a.traits.filter((t) => t.id !== a.neoplasia.id)];
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
	if (state.modules.continents) {
		advanceNeoplasia(state);
		const dice = [dieFor(state), dieFor(state)];
		const bases = territoryBases(n);
		for (const a of allAnimals(state)) {
			if (a.hibernating) continue;
			if (!a.traits.some((t) => t.type === "edificator" && isActive(t))) continue;
			const z = a.zoneId ?? "laurasia";
			bases[z] += 2;
			ev(state, {
				kind: "edificator",
				territory: z,
				amount: 2
			});
		}
		state.foodRoll = dice;
		state.territoryFood = bases;
		state.foodBank = bases.laurasia + bases.gondwana + bases.ocean;
		ev(state, {
			kind: "diceRoll",
			dice,
			total: state.foodBank
		});
		log(state, `Кормовые базы — Лавразия ${bases.laurasia}, Гондвана ${bases.gondwana}, Океан ${bases.ocean}.`, "good");
		return;
	}
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
	if (state.modules.continents) log(state, `Кормовые базы: Лавразия ${state.territoryFood?.laurasia ?? 0}, Гондвана ${state.territoryFood?.gondwana ?? 0}, Океан ${state.territoryFood?.ocean ?? 0}.`, "good");
	else log(state, `Кормовая база: ${state.foodBank}.`, "good");
	state.turnTerritory = void 0;
	feedTurn(state, state.firstPlayerId);
}
function freshTurnUse() {
	return {
		carnivores: [],
		pirates: [],
		grazers: [],
		foodTaken: false,
		combatUsed: false,
		migrated: false
	};
}
/** Кормовые базы «Континентов» по официальной таблице (игроки → Лавразия/Гондвана/Океан). */
function territoryBases(playerCount) {
	if (playerCount <= 2) return {
		laurasia: 8,
		gondwana: 7,
		ocean: 5
	};
	if (playerCount === 3) return {
		laurasia: 11,
		gondwana: 10,
		ocean: 7
	};
	if (playerCount === 4) return {
		laurasia: 14,
		gondwana: 13,
		ocean: 9
	};
	const extra = playerCount - 4;
	return {
		laurasia: 14 + 2 * extra,
		gondwana: 13 + 2 * extra,
		ocean: 9 + extra
	};
}
/**
* Размещение животного с учётом зон: получило «водоплавающее» — уходит в океан.
* Обратной высадки нет: в океане водность перманентна (см. queries.isAquatic),
* поэтому потеря карты свойства животное оттуда не выгоняет — только миграция
* или паралич стрекательными клетками.
*/
function settleAfterTraitChange(state, a) {
	if (!state.modules.continents) return;
	if (!a.zoneId) a.zoneId = "laurasia";
	const before = a.zoneId;
	if (hasTrait(a, "swimming") && a.zoneId !== "ocean") moveAnimalToZone(state, a, "ocean");
	if (a.zoneId !== before) dropCrossTerritoryPairs(state);
}
function moveAnimalToZone(_state, a, zone) {
	a.zoneId = zone;
}
/**
* Есть ли у игрока хоть одно реальное действие, если ход начать с чистого
* листа. Проверка идёт от его имени и с пустым turnUse: legalFeedActions
* отвечает только текущему игроку, а ограничения вида «еду уже брали»
* относятся к чужому ходу и здесь не должны мешать.
*/
function hasFreshAction(state, playerId) {
	return legalFeedActions({
		...state,
		currentPlayerId: playerId,
		turnUse: freshTurnUse(),
		turnTerritory: void 0
	}, playerId).some((a) => a.type !== "feedSkip" && a.type !== "feedEndTurn");
}
/** Съедобная еда территории хода; вне «Континентов» — общий банк. */
function bankOf(state, zone) {
	if (!state.modules.continents || !zone) return state.foodBank;
	return state.territoryFood?.[zone] ?? 0;
}
function takeFromBank(state, zone, n = 1) {
	if (state.modules.continents && zone) {
		const cur = state.territoryFood?.[zone] ?? 0;
		state.territoryFood = {
			...state.territoryFood,
			[zone]: Math.max(0, cur - n)
		};
		state.foodBank = Math.max(0, state.foodBank - n);
		return;
	}
	state.foodBank = Math.max(0, state.foodBank - n);
}
/**
* Круг питания: ход переходит к следующему игроку, который не пасовал
* и имеет реальное действие. Фаза заканчивается, только когда все
* пасанули либо никому ничего не доступно (правило конца фазы).
*/
function feedTurn(state, startId) {
	let id = startId;
	for (let i = 0; i < state.players.length; i++) {
		if (!player(state, id).passedFeed && hasFreshAction(state, id)) {
			state.currentPlayerId = id;
			state.turnUse = freshTurnUse();
			state.turnTerritory = void 0;
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
	const a = mustFind(state, animalId);
	const zone = a.zoneId;
	if (bankOf(state, zone) <= 0 || state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated) return;
	if (state.modules.continents && state.turnTerritory && state.turnTerritory !== zone) return;
	takeFromBank(state, zone, 1);
	state.turnUse.foodTaken = true;
	state.turnTerritory = state.modules.continents ? zone ?? "laurasia" : void 0;
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
	log(state, `${p.name} берёт еду из базы (${bankOf(state, zone)} осталось).`);
	maybeEndTurn(state);
}
function feedHunt(state, carnivoreId, preyId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const carnivore = mustFind(state, carnivoreId);
	const prey = mustFind(state, preyId);
	if (state.turnUse.foodTaken || state.turnUse.carnivores.includes(carnivoreId)) return;
	if (!canAttack(state, carnivore, prey)) return;
	state.turnUse.carnivores.push(carnivoreId);
	state.turnUse.combatUsed = true;
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
		return;
	}
	log(state, `${p.name} атакует животное игрока ${ownerOf(state, prey.id).name}!`, "hunt");
}
function feedPirate(state, pirateId, targetId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const pirate = mustFind(state, pirateId);
	const target = mustFind(state, targetId);
	if (state.turnUse.foodTaken || state.turnUse.pirates.includes(pirateId)) return;
	if (target.food <= 0 || isFed(target)) return;
	state.turnUse.pirates.push(pirateId);
	state.turnUse.combatUsed = true;
	const stoleBlue = target.blueFood > 0;
	if (stoleBlue) target.blueFood -= 1;
	target.food -= 1;
	giveFood(state, pirate, 1, stoleBlue ? "blue" : "red");
	ev(state, {
		kind: "blueFood",
		animalId: pirate.id,
		reason: "piracy"
	});
	log(state, `${p.name} пиратствует у ${ownerOf(state, target.id).name}.`, "hunt");
	maybeEndTurn(state);
}
function feedHibernate(state, animalId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const a = mustFind(state, animalId);
	a.hibernating = true;
	log(state, `${p.name} использует спячку.`, "good");
	advanceFeed(state);
}
/** «Закончить ход»: передача хода следующему игроку без паса до конца фазы. */
function feedEndTurn(state) {
	log(state, `${player(state, state.currentPlayerId).name} заканчивает ход.`);
	advanceFeed(state);
}
/**
* Ход заканчивается сам только тогда, когда игроку нечего делать вообще —
* даже начав ход заново (всё накормлено, база пуста, свойства использованы).
* Одно действие (взять еду, пиратство, охота) ход не отдаёт: пока остаётся
* хоть какая-то возможность, ход держится за игроком до «Закончить ход».
*/
function maybeEndTurn(state) {
	if (state.phase !== "feeding" || state.pendingAttack) return;
	if (!hasFreshAction(state, state.currentPlayerId)) advanceFeed(state);
}
/** Превращение жира в еду — свободное действие: ход не тратится. */
function feedConvertFat(state, animalId, amount) {
	const p = player(state, state.currentPlayerId);
	const a = mustFind(state, animalId);
	const n = Math.min(amount, a.fatTokens);
	a.fatTokens -= n;
	a.food += n;
	a.blueFood += n;
	ev(state, {
		kind: "blueFood",
		animalId: a.id,
		reason: "fat"
	});
	log(state, `${p.name} тратит жировой запас (${n}). Ход продолжается.`);
	maybeEndTurn(state);
}
/** Топтун — отдельное действие хода: уничтожает 1 фишку из базы своей территории. */
function feedGraze(state, animalId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const a = mustFind(state, animalId);
	if (!hasTrait(a, "grazing") || bankOf(state, a.zoneId) <= 0) {
		advanceFeed(state);
		return;
	}
	takeFromBank(state, a.zoneId, 1);
	state.turnUse.grazers.push(animalId);
	ev(state, {
		kind: "bankBurned",
		amount: 1,
		territory: a.zoneId
	});
	log(state, `${p.name}: топтун уничтожает 1 еду. База: ${bankOf(state, a.zoneId)}.`);
	maybeEndTurn(state);
}
/**
* «Миграция»: отдельный ход питания. Переезжают объявленные животные со
* свойством «миграция», за каждым могут прицепиться прилипалы (в т.ч. чужие).
* В этот ход больше ничего нельзя: ни есть, ни охотиться.
*/
function feedMigrate(state, moves) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	if (state.turnUse.migrated) return;
	const applied = [];
	for (const m of moves) {
		const a = findAnimal(state, m.animalId);
		if (!a) continue;
		if (!canMigrate(state, a)) continue;
		const from = a.zoneId;
		if (from === m.to) continue;
		if (!migrationTargets(state, a).includes(m.to)) continue;
		a.zoneId = m.to;
		applied.push({
			animalId: a.id,
			from,
			to: m.to
		});
		for (const r of ownerOf(state, a.id).animals) {
			if (r.id === a.id) continue;
			if (r.hibernating) continue;
			if (r.zoneId !== from) continue;
			if (!r.traits.some((t) => t.type === "remora" && isActive(t))) continue;
			r.zoneId = m.to;
			applied.push({
				animalId: r.id,
				from,
				to: m.to
			});
		}
	}
	if (!applied.length) {
		advanceFeed(state);
		return;
	}
	state.turnUse.migrated = true;
	ev(state, {
		kind: "migrated",
		moves: applied
	});
	log(state, `${p.name} объявляет миграцию (${applied.length} животное(-ых)).`);
	dropCrossTerritoryPairs(state);
	maybeEndTurn(state);
}
/** Разъехались животные с общей парной картой — карта уходит в сброс (правило). */
function dropCrossTerritoryPairs(state) {
	if (!state.modules.continents) return;
	for (const p of state.players) for (const a of [...p.animals]) for (const t of [...a.traits]) {
		if (!t.pairWith) continue;
		const other = findAnimal(state, t.pairWith);
		if (!other) continue;
		if (a.zoneId !== other.zoneId) {
			a.traits = a.traits.filter((x) => x.cardId !== t.cardId);
			other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
			p.discardCount += 1;
			log(state, `Парное свойство разъехавшихся животных уходит в сброс.`);
			settleAfterTraitChange(state, a);
			settleAfterTraitChange(state, other);
		}
	}
}
/**
* Перестановка своего животного (косметика, любое время партии).
* «Континенты»: toZoneId двигает животное между зонами вручную — разрешено
* только в фазу развития и без потери парных связей.
*/
function reorderAnimal(state, animalId, beforeId) {
	if (state.phase !== "development" && state.phase !== "feeding") return;
	const owner = ownerOf(state, animalId);
	if (owner.id !== state.humanId) return;
	const from = owner.animals.findIndex((a) => a.id === animalId);
	if (from < 0) return;
	const [animal] = owner.animals.splice(from, 1);
	let to = owner.animals.length;
	if (beforeId && beforeId !== animalId) {
		const bi = owner.animals.findIndex((a) => a.id === beforeId);
		if (bi >= 0) to = bi;
	}
	owner.animals.splice(to, 0, animal);
}
/** Перестановка с переносом между территориями («Континенты», UI перетаскиванием). */
function moveAnimalToZoneHuman(state, animalId, zone) {
	if (!state.modules.continents || state.phase !== "development") return false;
	if (ownerOf(state, animalId).id !== state.humanId) return false;
	if (zone === "ocean") return false;
	const a = mustFind(state, animalId);
	for (const t of a.traits) {
		if (!t.pairWith) continue;
		const other = findAnimal(state, t.pairWith);
		if (other && other.zoneId !== zone) return false;
	}
	a.zoneId = zone;
	return true;
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
			maybeEndTurn(state);
			return;
		}
		log(state, `Быстрое: выпало ${roll} — хищник догнал.`, "bad");
		if (defenseOptions(prey, atk).length === 0) resolveNoDefense(state);
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
		if (defenseOptions(mustFind(state, atk.preyId), atk).length === 0) resolveNoDefense(state);
		return;
	}
	if (action.kind === "tailLoss") {
		const tail = prey.traits.find((t) => isActive(t) && t.type === "tailLoss");
		if (tail) {
			if (tail.pairWith) {
				const other = findAnimal(state, tail.pairWith);
				if (other) other.traits = other.traits.filter((x) => x.cardId !== tail.cardId);
			}
			prey.traits = prey.traits.filter((t) => t.cardId !== tail.cardId);
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
		maybeEndTurn(state);
		return;
	}
	ev(state, {
		kind: "defenseUsed",
		defense: "none",
		preyId: atk.preyId
	});
	resolveNoDefense(state);
	maybeEndTurn(state);
}
/**
* Питание закончено: остаток баз сгорает, вычисляется список погибших.
* Животные удаляются позже — действием continueExtinction, чтобы игроки
* увидели стадию вымирания, а не мгновенный переход.
*/
function endFeeding(state) {
	if (state.modules.continents && state.territoryFood) {
		const leftovers = Object.entries(state.territoryFood).filter(([, v]) => (v ?? 0) > 0);
		if (leftovers.length) {
			const total = leftovers.reduce((s, [, v]) => s + (v ?? 0), 0);
			ev(state, {
				kind: "bankBurned",
				amount: total
			});
			log(state, `Остатки кормовых баз (${total}) сгорают.`);
			for (const [k] of leftovers) state.territoryFood[k] = 0;
			state.foodBank = 0;
		}
	} else if (state.foodBank > 0) {
		ev(state, {
			kind: "bankBurned",
			amount: state.foodBank
		});
		log(state, `Остаток кормовой базы (${state.foodBank}) сгорает.`);
		state.foodBank = 0;
	}
	state.phase = "extinction";
	state.extinctionDeaths = [];
	const doomed = allAnimals(state).filter((a) => a.poisoned || !isFed(a));
	for (const a of allAnimals(state)) if (doomed.some((d) => d.id === a.id)) state.extinctionDeaths.push(a.id);
	for (const id of state.extinctionDeaths) {
		const a = findAnimal(state, id);
		if (!a) continue;
		const p = ownerOf(state, id);
		log(state, a.poisoned ? `Хищник ${p.name} погибает от яда.` : `Животное ${p.name} вымирает — не накормлено.`, "bad");
	}
}
/**
* Подъём «неоплазии» в начале определения кормовой базы: карта поднимается на
* одну позицию и выключает лежащее над ней непарное свойство (выключенное не
* действует, но очки за него остаются). Выключать нечего — животное погибает.
* «Водоплавающее» в океане неотчуждаемо: зона делает животное водным, поэтому
* неоплазия его пропускает.
*/
function advanceNeoplasia(state) {
	if (!state.modules.continents) return;
	for (const p of state.players) for (const a of [...p.animals]) {
		const neo = a.traits.find((t) => t.type === "neoplasia");
		if (!neo) continue;
		a.neoplasia = neo;
		const protectedSwim = a.zoneId === "ocean";
		const next = [...a.traits.filter((t) => t.id !== neo.id && !t.pairWith && !t.disabled && !(protectedSwim && t.type === "swimming"))].sort((x, y) => y.playSeq - x.playSeq || a.traits.indexOf(y) - a.traits.indexOf(x))[0];
		if (!next) {
			ev(state, {
				kind: "animalDied",
				animalId: a.id,
				cause: "neoplasia"
			});
			log(state, `Неоплазия поглощает животное ${p.name} целиком.`, "bad");
			discardAnimal(state, a);
			continue;
		}
		next.disabled = true;
		log(state, `Неоплазия выключает свойство «${TRAITS[next.type].name}».`, "bad");
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
	regeneratedThisYear.clear();
	restoreRegenerated(state);
	for (const a of allAnimals(state)) {
		a.food = 0;
		a.blueFood = 0;
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
/**
* Восстановление съеденных «регенерировавших» животных: владелец обязан
* положить карту из руки (а если рука пуста — из колоды) как новое животное
* на оставленные свойства. Добора карт за такое животное нет.
*/
function restoreRegenerated(state) {
	const pend = state.pendingRegeneration;
	if (!pend?.length) return;
	state.pendingRegeneration = null;
	for (const item of pend) {
		const p = player(state, item.ownerId);
		const card = p.hand.pop() ?? state.deck.pop();
		if (!card) continue;
		const animal = {
			id: nid(state, "a"),
			ownerId: p.id,
			cardId: card.id,
			traits: [],
			food: 0,
			blueFood: 0,
			fatTokens: 0,
			hibernating: false,
			hibernatedLastYear: false,
			receivedFoodThisYear: false,
			poisoned: false,
			seed: card.id.length * 17 + p.id * 13,
			...state.modules.continents ? { zoneId: "laurasia" } : {}
		};
		p.animals.push(animal);
		regeneratedThisYear.set(p.id, (regeneratedThisYear.get(p.id) ?? 0) + 1);
		ev(state, {
			kind: "regenerated",
			ownerId: p.id
		});
		log(state, `${p.name} восстанавливает регенерировавшее животное.`, "good");
	}
}
/**
* Сколько животных игрок восстановил регенерацией в этом вымирании: добор
* «выжившие + 1» их не учитывает. Живёт внутри одного применения действия.
*/
var regeneratedThisYear = /* @__PURE__ */ new Map();
function drawCards(state) {
	const start = state.firstPlayerId;
	const n = state.players.length;
	let emptied = state.deck.length === 0;
	const counts = new Array(n).fill(0);
	for (let k = 0; k < n; k++) {
		const idx = (start + k) % n;
		const p = state.players[idx];
		let want = Math.max(1, p.animals.length - (regeneratedThisYear.get(p.id) ?? 0) + 1);
		if (p.animals.length === 0 && p.hand.length === 0) {
			if (state.modules.continents) {
				for (let i = 0; i < 10; i++) {
					const c = state.deck.pop();
					if (!c) {
						emptied = true;
						break;
					}
					p.hand.push(c);
					counts[idx] += 1;
				}
				playRescueAnimal(state, p, "laurasia");
				playRescueAnimal(state, p, "gondwana");
				continue;
			}
			want = 6;
		}
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
/** «10 карт»: две из них сразу становятся животными — по одному на континент. */
function playRescueAnimal(state, p, zone) {
	const card = p.hand.shift();
	if (!card) return;
	const animal = {
		id: nid(state, "a"),
		ownerId: p.id,
		cardId: card.id,
		traits: [],
		food: 0,
		blueFood: 0,
		fatTokens: 0,
		hibernating: false,
		hibernatedLastYear: false,
		receivedFoodThisYear: false,
		poisoned: false,
		seed: card.id.length * 17 + p.id * 13 + p.animals.length,
		zoneId: zone
	};
	p.animals.push(animal);
	ev(state, {
		kind: "animalPlaced",
		animalId: animal.id,
		ownerId: p.id,
		zoneId: zone
	});
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
			if (a.zoneId) {
				const inZone = p.animals.filter((x) => x.zoneId === a.zoneId).length;
				s -= inZone * .6;
				if (p.hand.find((c) => c.id === a.cardId)?.faces.includes("swimming")) s += .5;
			}
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
		if (a.type === "feedMigrate") {
			const mv = findAnimal(state, a.moves[0].animalId);
			s = 3;
			if (mv) s -= hunger(mv);
			if (myHungry > 0 && !usedAllFood(state)) s -= 6;
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
//#endregion
export { pollInput as S, joinRoomInput as _, botsInput as a, legalFeedActions as b, chooseAIAction as c, createRoomInput as d, currentActor as f, isFed as g, hasTrait as h, applyAction as i, codeTokenInput as l, foodNeeded as m, TRAITS as n, canAttack as o, findAnimal as p, actionInput as r, canReceiveFood as s, PACE as t, createGame as u, legalDefenseActions as v, player as x, legalDevActions as y };
