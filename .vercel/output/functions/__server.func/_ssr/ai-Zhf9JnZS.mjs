import { a as number, c as union, i as literal, n as boolean, o as object, r as custom, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-Zhf9JnZS.js
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
	modules: object({
		continents: boolean().optional(),
		plants: boolean().optional(),
		fungi: boolean().optional(),
		randomMutations: boolean().optional()
	}).partial().default({}).optional()
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
/**
* «Растения» (Правильные игры, 2016): 36 двусторонних карт свойств
* «свойство растения / альтернативное свойство животного». Состав пар —
* по официальной распечатке издательского состава (по 4 копии каждой).
*/
var PLANTS_DUALS = [
	[
		"nutritious",
		"swimming",
		4
	],
	[
		"micorrhiza",
		"swimming",
		4
	],
	[
		"rootVegetable",
		"fatTissue",
		4
	],
	[
		"honeyPlant",
		"highBodyWeight",
		4
	],
	[
		"thorny",
		"cooperation",
		4
	],
	[
		"plantWater",
		"burrowing",
		4
	],
	[
		"medicinal",
		"carnivore",
		4
	],
	[
		"tree",
		"carnivore",
		4
	],
	[
		"plantParasite",
		"parasite",
		4
	]
];
/**
* «Трава и грибы» (Правильные игры, 2019): 8 карт свойств животных
* «Прозрачное» и «Насекомоядное» — по 4 копии (состав по комплекту).
* Сами 24 длинные карты флоры ходят отдельной колодой (см. flora.ts).
*/
var FUNGI_SINGLES = [["transparent", 4], ["insectivore", 4]];
/**
* «Случайные мутации» (Правильные игры, 2013): 7 новых свойств, по 4 копии
* (точный состав коробки из 90 карт не опубликован — реконструкция).
* Разница с остальными колодами не в картах, а в раздаче: личные слепые
* колоды игроков вместо руки (см. engine.ts, devMutate).
*/
var MUTATIONS_SINGLES = [
	["obligateCarnivore", 4],
	["budding", 4],
	["metabolicSyndrome", 4],
	["barkBeetle", 4],
	["extremophile", 4],
	["developmentDefects", 4],
	["simplification", 4]
];
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
	if (modules?.plants) for (const [a, b, n] of PLANTS_DUALS) for (let i = 0; i < n; i++) cards.push({
		id: nextId("c"),
		faces: [a, b]
	});
	if (modules?.fungi) for (const [trait, n] of FUNGI_SINGLES) for (let i = 0; i < n; i++) cards.push({
		id: nextId("c"),
		faces: [trait]
	});
	if (modules?.randomMutations) for (const [trait, n] of MUTATIONS_SINGLES) for (let i = 0; i < n; i++) cards.push({
		id: nextId("c"),
		faces: [trait]
	});
	return cards;
}
var FLORA = {
	toadstool: {
		kind: "toadstool",
		name: "Бледная поганка",
		isFungus: true,
		description: "Взявший фишку животное получает метку «Яд» (при получении метки «Яд» свойство «Паразит» этого животного сбрасывается). В фазу вымирания животное с меткой «Яд» погибает, если на нём нет «Антидота».",
		mark: "poison",
		aiHint: -3
	},
	mold: {
		kind: "mold",
		name: "Плесневой гриб",
		isFungus: true,
		description: "Взявший фишку животное получает метку «Антидот»: не погибает в вымирание от метки «Яд» и от съедения животного со свойством «Ядовитое».",
		mark: "antidote",
		aiHint: 2
	},
	madCap: {
		kind: "madCap",
		name: "Безумная шляпка",
		isFungus: true,
		description: "Взявший фишку животное получает метку «Безумие»: в начале следующего раунда фазы питания его владелец снимает метку, и раунд вместо него проводит сосед справа (распоряжается его животными, но не смотрит руку).",
		mark: "madness",
		aiHint: -1.5
	},
	flyAgaric: {
		kind: "flyAgaric",
		name: "Бешеный мухомор",
		isFungus: true,
		description: "Взявший фишку животное получает метку «Бешенство»: в начале следующего раунда фазы питания его владелец снимает метку и обязан атаковать этим животным, как хищником, другое животное — даже накормленное. Добычу бешеное животное не ест и фишек не получает; при любом исходе раунд заканчивается.",
		mark: "rage",
		aiHint: -2
	},
	insight: {
		kind: "insight",
		name: "Гриб прозрения",
		isFungus: true,
		description: "Взяв фишку, владелец животного сбрасывает все карты из руки (в настольной игре затем смотрит чужие карты — в онлайн-версии подсмотр упрощён).",
		aiHint: -6
	},
	soaring: {
		kind: "soaring",
		name: "Окрыляющий гриб",
		isFungus: true,
		description: "Взяв фишку, животное сбрасывает все свои парные свойства, а затем получает 1 синюю фишку дополнительной еды.",
		aiHint: -1
	},
	sleepGrass: {
		kind: "sleepGrass",
		name: "Сон-трава",
		isFungus: false,
		description: "Взявший фишку животное получает метку «Сон»: считается животным без свойств (все свойства, включая парные, не действуют), его потребность в пище равна 1. Метки на нём продолжают действовать. «Насекомоядное» срабатывает при съедении животного с «Сном».",
		mark: "sleep",
		aiHint: -1.5
	},
	thryn: {
		kind: "thryn",
		name: "Трын-трава",
		isFungus: false,
		description: "Взявший фишку животное получает метку «Трын»: не получает меток при взятии фишек с любых трав и грибов, а хищник с «Трын» не получает меток со съеденного животного. Хищник без «Трын», съев животное с «Трын» и другими метками, получает все эти метки одновременно.",
		mark: "thryn",
		aiHint: 2.5
	},
	datura: {
		kind: "datura",
		name: "Дурман-трава",
		isFungus: false,
		description: "Взявший фишку животное получает метку «Дурь»: хищник (или бешеное животное), атакующий его, может игнорировать одно из его свойств (в онлайн-версии выбирается автоматически — то, что сильнее всего мешает атаке).",
		mark: "haze",
		aiHint: -1
	},
	smile: {
		kind: "smile",
		name: "Улыбнись-трава",
		isFungus: false,
		description: "Взявший фишку животное получает метку «Пацифизм»: не может атаковать, используя свойство «Хищник» или находясь под воздействием метки «Бешенство», и не может использовать «Пиратство».",
		mark: "pacifism",
		aiHint: -1.5
	},
	cleanser: {
		kind: "cleanser",
		name: "Очистительная трава",
		isFungus: false,
		description: "Взяв фишку, животное теряет все другие красные и синие фишки (жировой запас остаётся) и все метки последствий.",
		aiHint: -4
	},
	passionflower: {
		kind: "passionflower",
		name: "Страстоцвет",
		isFungus: false,
		description: "Взяв фишку, владелец обязан взять одно свойство этого животного (кроме «Паразита») и выложить как новое животное (в онлайн-версии свойство выбирается автоматически — верхнее подходящее).",
		aiHint: -2
	}
};
var MARKS = {
	poison: {
		id: "poison",
		name: "Яд",
		short: "Яд",
		description: "В фазу вымирания животное с меткой «Яд» погибает, если на нём нет метки «Антидот». При получении метки «Яд» свойство «Паразит» животного уходит в сброс.",
		tone: "danger"
	},
	antidote: {
		id: "antidote",
		name: "Антидот",
		short: "Антидот",
		description: "Животное с меткой «Антидот» не погибает в вымирание от метки «Яд» и от последствий съедения животного со свойством «Ядовитое».",
		tone: "good"
	},
	madness: {
		id: "madness",
		name: "Безумие",
		short: "Безумие",
		description: "В начале следующего раунда фазы питания владелец снимает метку с одного своего животного, и этот раунд вместо него проводит сосед справа (не может смотреть карты в руке).",
		tone: "virus"
	},
	rage: {
		id: "rage",
		name: "Бешенство",
		short: "Бешенство",
		description: "В начале следующего раунда фазы питания владелец снимает метку с одного своего животного и обязан атаковать им, как хищником, другое животное (даже накормленное). Добычу не ест, фишек не получает; при любом исходе раунд заканчивается.",
		tone: "danger"
	},
	sleep: {
		id: "sleep",
		name: "Сон",
		short: "Сон",
		description: "Животное считается животным без свойств: все свойства, включая парные, не действуют, потребность в пище равна 1. Метки на нём продолжают действовать.",
		tone: "info"
	},
	thryn: {
		id: "thryn",
		name: "Трын",
		short: "Трын",
		description: "Животное не получает меток при взятии фишек с трав и грибов; хищник с «Трын» не получает меток со съеденной добычи. Хищник без «Трын», съев добычу с «Трын» и другими метками, получает все метки одновременно.",
		tone: "leaf"
	},
	haze: {
		id: "haze",
		name: "Дурь",
		short: "Дурь",
		description: "Хищник (или бешеное животное), собирающийся атаковать это животное, может игнорировать одно из его свойств.",
		tone: "gold"
	},
	pacifism: {
		id: "pacifism",
		name: "Пацифизм",
		short: "Пацифизм",
		description: "Животное не может атаковать свойством «Хищник» и в бешенстве и не может использовать «Пиратство».",
		tone: "info"
	}
};
/** Колода флоры: 12 уникальных карт × 2 копии = 24. */
function floraDeckKinds() {
	return Object.keys(FLORA).flatMap((k) => [k, k]);
}
/** Полный стол меток в начале партии: по 4 каждого вида. */
function fullMarksPool() {
	const pool = {};
	for (const id of Object.keys(MARKS)) pool[id] = 4;
	return pool;
}
var PLANTS = {
	perennial: {
		kind: "perennial",
		name: "Многолетник",
		description: "Разрастается по схеме 1→2, 2→3, 3+→5 (максимум 5 фишек). Появляется с 3 фишками.",
		startFood: 3,
		maxFood: 5,
		growth: [
			[3, 5],
			[2, 3],
			[1, 2]
		],
		shelters: 0,
		carnivoreEdible: false,
		aiValue: 4
	},
	annual: {
		kind: "annual",
		name: "Однолетник",
		description: "Разрастается по схеме 0→1, 1→2, 2+→3 (максимум 3). Единственное растение, которое выживает без фишек: в конце фазы роста получает 1 фишку.",
		startFood: 2,
		maxFood: 3,
		growth: [
			[2, 3],
			[1, 2],
			[0, 1]
		],
		shelters: 0,
		carnivoreEdible: false,
		aiValue: 3
	},
	fruit: {
		kind: "fruit",
		name: "Плодовое",
		description: "Разрастается по схеме 1→5, 2→4, 3+→3 (максимум 5): при 3–4 фишках ждёт неурожай. Даёт 1 убежище. Хищники могут брать с него еду.",
		startFood: 2,
		maxFood: 5,
		growth: [
			[3, 3],
			[2, 4],
			[1, 5]
		],
		shelters: 1,
		carnivoreEdible: true,
		aiValue: 4
	},
	succulent: {
		kind: "succulent",
		name: "Суккулент",
		description: "Разрастается по схеме 1→2, 2→3, 3+→4 (максимум 4). Даёт 1 убежище. Хищники могут брать с него еду.",
		startFood: 3,
		maxFood: 4,
		growth: [
			[3, 4],
			[2, 3],
			[1, 2]
		],
		shelters: 1,
		carnivoreEdible: true,
		aiValue: 4
	},
	legume: {
		kind: "legume",
		name: "Бобовое",
		description: "Разрастается по схеме 1→3, 2→4, 3+→5 (максимум 5) — всегда на +2.",
		startFood: 2,
		maxFood: 5,
		growth: [
			[3, 5],
			[2, 4],
			[1, 3]
		],
		shelters: 0,
		carnivoreEdible: false,
		aiValue: 4
	},
	grass: {
		kind: "grass",
		name: "Злак",
		description: "Разрастается по схеме 1→2, 2→4, 3+→5 (максимум 5). Появляется с 2 фишками (реконструкция схемы по иллюстрации правил).",
		startFood: 2,
		maxFood: 5,
		growth: [
			[3, 5],
			[2, 4],
			[1, 2]
		],
		shelters: 0,
		carnivoreEdible: false,
		aiValue: 3
	},
	liana: {
		kind: "liana",
		name: "Лиана",
		description: "В фазу роста на неё кладётся столько фишек, сколько на столе растений, не являющихся лианами (паразиты учитываются). Максимум 6 (реконструкция).",
		startFood: 1,
		maxFood: 6,
		growth: [],
		shelters: 0,
		carnivoreEdible: false,
		aiValue: 3
	},
	fungus: {
		kind: "fungus",
		name: "Гриб",
		description: "Всякий раз, когда погибает любое животное, на каждом грибе появляется 1 фишка (максимум 6 — реконструкция). Хищники могут брать с него еду.",
		startFood: 0,
		maxFood: 6,
		growth: [],
		shelters: 0,
		carnivoreEdible: true,
		aiValue: 3
	},
	carnivorous: {
		kind: "carnivorous",
		name: "Хищное",
		description: "Раз в фазу питания атакует: контратакует животное, тянущее с него еду (игнорируя одну его защиту), либо один из игроков направляет его на чужое животное. Съело животное — 2 фишки, получило хвост — 1. Съело ядовитое — погибает в вымирание. Максимум 6 фишек, стартует пустым. Хищники могут брать с него еду.",
		startFood: 0,
		maxFood: 6,
		growth: [],
		shelters: 0,
		carnivoreEdible: true,
		aiValue: 4
	},
	parasite: {
		kind: "parasite",
		name: "Растение-Паразит",
		description: "Самостоятельное растение со своими свойствами. Не считается в максимуме растений. Ход питания: вместо еды можно перекинуть с хозяина на паразита 1 фишку (не последнюю). Выживает без фишек; погибает вместе с хозяином.",
		startFood: 0,
		maxFood: 6,
		growth: [],
		shelters: 0,
		carnivoreEdible: false,
		aiValue: 2
	}
};
/** Сколько фишек станет на растении в фазу роста по его схеме. */
function growthTarget(def, current) {
	for (const [from, to] of def.growth) if (current >= from) return Math.min(to, def.maxFood);
	return current;
}
var PLANT_TABLE = {
	2: {
		initial: 3,
		add: 1,
		max: 6
	},
	3: {
		initial: 4,
		add: 2,
		max: 8
	},
	4: {
		initial: 5,
		add: 3,
		max: 10
	},
	5: {
		initial: 6,
		add: 3,
		max: 12
	},
	6: {
		initial: 7,
		add: 3,
		max: 14
	},
	7: {
		initial: 8,
		add: 4,
		max: 16
	},
	8: {
		initial: 9,
		add: 4,
		max: 18
	}
};
function plantTable(playerCount) {
	return PLANT_TABLE[Math.min(Math.max(playerCount, 2), 8)];
}
/** Колода растений: 9 видов × 4 копии = 36 карт. */
function plantDeckKinds() {
	return [
		"perennial",
		"annual",
		"fruit",
		"succulent",
		"legume",
		"grass",
		"liana",
		"fungus",
		"carnivorous"
	].flatMap((k) => [
		k,
		k,
		k,
		k
	]);
}
/** Вместимость убежищ растения: значки карты + бонусы свойств (колючее 3, дерево 1). */
function shelterCapacity(plant) {
	let cap = PLANTS[plant.kind].shelters;
	for (const t of plant.traits) {
		if (t.type === "thorny") cap += 3;
		if (t.type === "tree") cap += 1;
	}
	return cap;
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
	},
	plantWater: {
		id: "plantWater",
		name: "Водное",
		short: "Водное",
		description: "Свойство растения. Только водоплавающие животные могут получать пищу с такого растения.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	thorny: {
		id: "thorny",
		name: "Колючее",
		short: "Колючее",
		description: "Свойство растения. Положите на растение 3 жетона убежища. Убежище защищает животное от хищников и хищных растений до конца фазы питания.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	rootVegetable: {
		id: "rootVegetable",
		name: "Корнеплод",
		short: "Корнеплод",
		description: "Свойство растения. Только норные животные смогут добраться до его вкусных корешков.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	medicinal: {
		id: "medicinal",
		name: "Лекарственное",
		short: "Лекарств.",
		description: "Свойство растения. Животное, откушавшее с него, считается накормленным, но все его свойства перестают действовать до конца фазы питания (действует только фишка убежища). Сытому с пустым жиром фишка уйдёт в жировой запас.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	plantParasite: {
		id: "plantParasite",
		name: "Растение-Паразит",
		short: "Паразит-раст.",
		description: "Играется на растение-хозяина и само считается отдельным растением со своими свойствами — даже со своими паразитами. Ходом питания можно перекинуть с хозяина на паразита 1 фишку (не последнюю). Паразит выживает без фишек, но погибает вместе с хозяином. В максимум растений не идёт.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	micorrhiza: {
		id: "micorrhiza",
		name: "Микориза",
		short: "Микориза",
		description: "Свойство двух растений сразу (кладётся между ними). В вымирание связка выживает, если хотя бы на одном растении осталась пища; в конце фазы роста каждое растение без фишек получает по одной. Растение может быть связано с несколькими.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	tree: {
		id: "tree",
		name: "Дерево",
		short: "Дерево",
		description: "Свойство растения. Только большие животные могут брать с него пищу. Положите на растение 1 жетон убежища.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 2
	},
	nutritious: {
		id: "nutritious",
		name: "Питательное",
		short: "Питат.",
		description: "Свойство растения. Животное, получившее с него фишку, дополнительно получает ещё одну. Хищник может брать еду с питательного растения.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 4
	},
	honeyPlant: {
		id: "honeyPlant",
		name: "Медонос",
		short: "Медонос",
		description: "Свойство растения. Если ваше животное получило с него фишку, выберите игрока, у которого в руке больше карт, чем у вас, и возьмите у него одну случайную карту. Нет такого игрока — карта не даётся.",
		isPair: false,
		opponentOnly: false,
		plantTrait: true,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	transparent: {
		id: "transparent",
		name: "Прозрачное",
		short: "Прозр.",
		description: "Пока на этом животном нет красных и синих фишек, хищник не может его атаковать (жировой запас не в счёт).",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 4
	},
	insectivore: {
		id: "insectivore",
		name: "Насекомоядное",
		short: "Насеком.",
		description: "Съев животное без свойств (в том числе животное с меткой «Сон»), хищник получает 1 синюю фишку вместо двух — и карта «Хищник» разворачивается: сможет атаковать снова в следующих раундах фазы питания.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 3
	},
	obligateCarnivore: {
		id: "obligateCarnivore",
		name: "Облигатный хищник",
		short: "Облигат",
		description: "Раз в ход может атаковать другой вид. Успешная атака сразу делает его накормленным. Не может получать красные и синие фишки из кормовой базы, с растений и с помощью других свойств. +1 к потребности в еде. Не сочетается с «Хищником» и «Падальщиком».",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 1,
		scoreBonus: 1,
		aiValue: 5
	},
	budding: {
		id: "budding",
		name: "Почкование",
		short: "Почков.",
		description: "В начале каждого своего хода в фазе развития вид получает новое животное из личной колоды. Ограничение численности «не выше числа видов» почкование игнорирует.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		aiValue: 4
	},
	metabolicSyndrome: {
		id: "metabolicSyndrome",
		name: "Метаболический синдром",
		short: "Метабол.",
		description: "Вредная мутация: слишком быстрый обмен веществ. Каждое животное вида требует +2 фишки еды. Даёт 2 дополнительных очка в конце игры.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 2,
		scoreBonus: 2,
		harmful: true,
		aiValue: -6
	},
	barkBeetle: {
		id: "barkBeetle",
		name: "Короед",
		short: "Короед",
		description: "Вредная мутация. Пока животное не накормлено, жетон убежища, взятый им с растения, не защищает: он заменяется на синюю фишку еды, а убежище возвращается на растение. У накормленного животного (и облигатного хищника) убежище работает как обычно.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		harmful: true,
		aiValue: -2
	},
	extremophile: {
		id: "extremophile",
		name: "Экстрофил",
		short: "Экстрофил",
		description: "Вредная мутация. Чтобы добавить животное в этот вид, сбросьте дополнительную карту из личной колоды. Если в колоде осталась одна карта — животное добавить нельзя.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		harmful: true,
		aiValue: -2
	},
	developmentDefects: {
		id: "developmentDefects",
		name: "Дефекты развития",
		short: "Дефекты",
		description: "Вредная мутация. Хищник, атакующий этот вид, может игнорировать одно из его свойств (в онлайн-версии гасится сильнейшая защита или защита, мешающая атаке).",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		harmful: true,
		aiValue: -3
	},
	simplification: {
		id: "simplification",
		name: "Упрощение",
		short: "Упрощ.",
		description: "Вредная мутация. Сбросьте последнее свойство, сыгранное на этот вид: оно и сама карта «Упрощение» выкладываются как два новых вида животных.",
		isPair: false,
		opponentOnly: false,
		stackable: false,
		extraFood: 0,
		scoreBonus: 0,
		harmful: true,
		aiValue: -2
	}
};
var TRAIT_ORDER = Object.keys(TRAITS);
/** Свойства из дополнения «Континенты»; всё прочее — базовая игра. */
var CONTINENTS_TRAIT_IDS = /* @__PURE__ */ new Set([
	"migration",
	"remora",
	"herding",
	"nematocysts",
	"regeneration",
	"recombination",
	"edificator",
	"neoplasia"
]);
/** Свойства растений из дополнения «Растения». */
var PLANTS_TRAIT_IDS = /* @__PURE__ */ new Set([
	"plantWater",
	"thorny",
	"rootVegetable",
	"medicinal",
	"plantParasite",
	"micorrhiza",
	"tree",
	"nutritious",
	"honeyPlant"
]);
/** Свойства животных из дополнения «Трава и грибы». */
var FUNGI_TRAIT_IDS = /* @__PURE__ */ new Set(["transparent", "insectivore"]);
/** Свойства из дополнения «Случайные мутации». */
var MUTATIONS_TRAIT_IDS = /* @__PURE__ */ new Set([
	"obligateCarnivore",
	"budding",
	"metabolicSyndrome",
	"barkBeetle",
	"extremophile",
	"developmentDefects",
	"simplification"
]);
/** Свойство активно: раскрыто и не отключено (шов под неоплазию/мутации). */
function isActive(t) {
	return !t.hidden && !t.disabled;
}
/**
* Животное — хищник: «Хищник» или (в «Случайных мутациях») «Облигатный
* хищник». Проверяет мясную специализацию целиком, включая запреты питания.
*/
function isCarnivoreLike(animal) {
	return hasTrait(animal, "carnivore") || hasTrait(animal, "obligateCarnivore");
}
function hasMark(animal, mark) {
	return Boolean(animal.marks?.includes(mark));
}
/**
* Животное со меткой «Сон» считается животным без свойств: все свойства (в
* том числе парные) не действуют, потребность в пище равна 1. Метки на нём
* продолжают работать.
*/
function isAsleep(animal) {
	return hasMark(animal, "sleep");
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
function findPlant(state, id) {
	return state.plants?.find((p) => p.id === id);
}
function mustFindPlant(state, id) {
	const p = findPlant(state, id);
	if (!p) throw new Error(`plant ${id}`);
	return p;
}
/**
* Наличие активного свойства. Скрытые свойства по умолчанию инертны;
* отключённые (disabled) не действуют никогда. «Усыпленное» лекарственным
* растением животное тоже не использует свойства (кроме фишки убежища).
*/
function hasTrait(animal, type, includeHidden = false) {
	if (animal.sedated || isAsleep(animal)) return false;
	return animal.traits.some((t) => t.type === type && !t.disabled && (includeHidden || !t.hidden));
}
function traitsOf(animal, type, includeHidden = false) {
	if (animal.sedated || isAsleep(animal)) return [];
	return animal.traits.filter((t) => t.type === type && !t.disabled && (includeHidden || !t.hidden));
}
function foodNeeded(animal, includeHidden = false) {
	if (isAsleep(animal)) return 1;
	let n = 1;
	for (const t of animal.traits) {
		if (!includeHidden && t.hidden) continue;
		if (t.disabled) continue;
		n += TRAITS[t.type].extraFood;
	}
	return n;
}
/**
* «Случайные мутации»: сколько фишек еды нужно виду целиком — потребность
* одного животного, умноженная на численность. Вне модуля численность 1.
*/
function speciesNeed(animal, includeHidden = false) {
	return foodNeeded(animal, includeHidden) * (animal.population ?? 1);
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
* Свойства сытого (и парализованного) животного не работают. «Пацифизм»
* («Трава и грибы») запрещает атаковать свойством «Хищник».
*/
function canHuntWith(state, carnivore) {
	if (!isCarnivoreLike(carnivore)) return false;
	if (hasMark(carnivore, "pacifism")) return false;
	if (carnivore.hibernating || isFed(carnivore)) return false;
	return !isParalyzed(state, carnivore.id);
}
/** Сколько животных со «стадностью» и сколько хищников находится в локации. */
function herdingBalance(state, zone) {
	let herding = 0;
	let carnivores = 0;
	for (const a of allAnimals(state)) {
		if (territoryOf(state, a) !== zone) continue;
		if (a.traits.some((t) => t.type === "herding" && isActive(t)) && !a.sedated && !isAsleep(a)) herding += a.population ?? 1;
		if (isCarnivoreLike(a)) carnivores += 1;
	}
	for (const p of state.plants ?? []) {
		if (p.kind !== "carnivorous") continue;
		if (state.modules.continents && (p.zoneId ?? "laurasia") !== zone) continue;
		carnivores += 1;
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
	return animal.food >= speciesNeed(animal, includeHidden);
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
	if (prey.sedated) return false;
	return prey.traits.some((t) => {
		if (t.hidden || t.disabled || t.type !== "symbiosis" || t.pairRole !== "b" || !t.pairWith) return false;
		return Boolean(findAnimal(state, t.pairWith));
	});
}
/**
* Проверка атаки целиком из реестра: симметричная вода, правила защиты
* жертвы (камуфляж/большое/норное) читаются из TraitDef.protection.
*
* «Трава и грибы»:
* - «Прозрачное» без фишек на теле — неуязвимо для хищника;
* - метка «Дурь»: атакующий игнорирует одно свойство жертвы (в онлайн-
*   версии выбирается автоматически — см. hazeIgnoreTraitId);
* - спящее (метка «Сон») и усыпленное животное свойствами не защищается.
*/
function canAttack(state, carnivore, prey) {
	if (carnivore.id === prey.id) return false;
	if (!isCarnivoreLike(carnivore)) return false;
	if (carnivore.hibernating) return false;
	if (isFed(carnivore)) return false;
	if (isParalyzed(state, carnivore.id)) return false;
	if (prey.sheltered) return false;
	if (hasTrait(prey, "transparent") && prey.food === 0 && prey.blueFood === 0) return false;
	if (state.modules.continents) {
		if (carnivore.zoneId !== prey.zoneId) return false;
		if (herdingProtects(state, prey)) return false;
	}
	if (livingSymbiontProtects(state, prey)) return false;
	const effective = effectivePreyTraits(prey, hazeIgnoreTraitId(state, carnivore, prey));
	const aquaticRule = carnivore.traits.some((t) => isActive(t) && TRAITS[t.type].symmetricAquatic) || effective.some((t) => TRAITS[t.type].symmetricAquatic);
	const zoneAquatic = state.modules.continents && (carnivore.zoneId === "ocean" || prey.zoneId === "ocean");
	if ((aquaticRule || zoneAquatic) && isAquatic(state, carnivore) !== isAquatic(state, prey)) return false;
	for (const t of effective) {
		const rule = TRAITS[t.type].protection;
		if (!rule) continue;
		if (rule.stealthBypass && !hasTrait(carnivore, rule.stealthBypass)) return false;
		if (rule.needsBulkyAttacker && !hasTrait(carnivore, "highBodyWeight")) return false;
		if (rule.safeWhenFed && isFed(prey)) return false;
	}
	return true;
}
/** Свойства жертвы, работающие против атакующего: сон/усыпление гасит все. */
function effectivePreyTraits(prey, ignoreTraitId) {
	if (prey.sedated || isAsleep(prey)) return [];
	return prey.traits.filter((t) => isActive(t) && t.id !== ignoreTraitId);
}
/**
* Свойство жертвы, которое атакующий игнорирует. Источники:
* - метка «Дурь» («Трава и грибы»);
* - «Дефекты развития» («Случайные мутации»): хищник гасит одно свойство
*   жертвы — выбирается автоматически (сознательное упрощение онлайн-версии):
*   сначала свойство, реально мешающее атаке, затем «водоплавающее» жертвы
*   против сухопутного хищника, затем сильнейшая защитная реакция.
*/
function hazeIgnoreTraitId(state, carnivore, prey) {
	if (!(hasMark(prey, "haze") || hasTrait(prey, "developmentDefects")) || prey.sedated || isAsleep(prey)) return void 0;
	for (const t of prey.traits) {
		if (!isActive(t)) continue;
		const rule = TRAITS[t.type].protection;
		if (!rule) continue;
		if (rule.stealthBypass && !hasTrait(carnivore, rule.stealthBypass) || rule.needsBulkyAttacker && !hasTrait(carnivore, "highBodyWeight") || rule.safeWhenFed && isFed(prey)) return t.id;
	}
	if (!isAquatic(state, carnivore)) {
		const swim = prey.traits.find((t) => isActive(t) && t.type === "swimming");
		if (swim) return swim.id;
	}
	for (const kind of [
		"tailLoss",
		"running",
		"mimicry"
	]) {
		const t = prey.traits.find((x) => isActive(x) && x.type === kind);
		if (t) return t.id;
	}
}
/**
* «Бешенство»: бешеное животное атакует, как хищник, — свойство «Хищник»
* ему не нужно, накормленность не мешает, но «Пацифизм» и спячку правила
* не отключают (метки работают всегда).
*/
function canRageAttackWith(a) {
	return !a.hibernating && !hasMark(a, "pacifism");
}
function canRageAttack(state, attacker, prey) {
	if (attacker.id === prey.id) return false;
	if (!canRageAttackWith(attacker)) return false;
	if (prey.sheltered) return false;
	if (hasTrait(prey, "transparent") && prey.food === 0 && prey.blueFood === 0) return false;
	if (state.modules.continents) {
		if (attacker.zoneId !== prey.zoneId) return false;
		if (herdingProtects(state, prey)) return false;
	}
	if (livingSymbiontProtects(state, prey)) return false;
	const effective = effectivePreyTraits(prey, hazeIgnoreTraitId(state, attacker, prey));
	const aquaticRule = attacker.traits.some((t) => isActive(t) && TRAITS[t.type].symmetricAquatic) || effective.some((t) => TRAITS[t.type].symmetricAquatic);
	const zoneAquatic = state.modules.continents && (attacker.zoneId === "ocean" || prey.zoneId === "ocean");
	if ((aquaticRule || zoneAquatic) && isAquatic(state, attacker) !== isAquatic(state, prey)) return false;
	for (const t of effective) {
		const rule = TRAITS[t.type].protection;
		if (!rule) continue;
		if (rule.stealthBypass && !hasTrait(attacker, rule.stealthBypass)) return false;
		if (rule.needsBulkyAttacker && !hasTrait(attacker, "highBodyWeight")) return false;
		if (rule.safeWhenFed && isFed(prey)) return false;
	}
	return true;
}
function animalValue(animal) {
	let v = 2 * (animal.population ?? 1);
	for (const t of animal.traits) {
		if (!isActive(t)) continue;
		v += 1 + TRAITS[t.type].scoreBonus;
	}
	return v;
}
/** Животное мигрирует само (свойство «миграция» активно, раз за фазу питания). */
function canMigrate(state, a) {
	return a.traits.some((t) => t.type === "migration" && isActive(t)) && !a.hibernating && !isParalyzed(state, a.id) && !(state.migratedThisPhase ?? []).includes(a.id);
}
/** Есть ли у растения активное свойство указанного типа. */
function plantHasTrait(plant, type) {
	return plant.traits.some((t) => t.type === type && !t.disabled && !t.hidden);
}
/**
* Может ли животное брать фишку еды с растения: ограничения по свойствам
* растения (водное/корнеплод/дерево) и правило «хищники едят только с
* растений со значком плода или свойством „Питательное“».
*/
function canFeedOnPlant(state, animal, plant) {
	if (plant.food <= 0) return false;
	if (animal.hibernating || animal.sedated) return false;
	if (state.modules.continents) {
		if ((animal.zoneId ?? "laurasia") !== (plant.zoneId ?? "laurasia")) return false;
	}
	if (plantHasTrait(plant, "plantWater") && !isAquatic(state, animal)) return false;
	if (plantHasTrait(plant, "rootVegetable") && !hasTrait(animal, "burrowing")) return false;
	if (plantHasTrait(plant, "tree") && !hasTrait(animal, "highBodyWeight")) return false;
	if (isCarnivoreLike(animal)) {
		if (!PLANTS[plant.kind].carnivoreEdible && !plantHasTrait(plant, "nutritious")) return false;
	}
	return true;
}
/**
* Хищное растение атакует по правилам хищника БЕЗ свойств: оно не тронет
* водоплавающее, большое, камуфляж, накормленное норное, стадное (при
* превосходстве стадных), симбионта под защитой и животное в убежище.
*/
function canPlantAttackTarget(state, plant, prey) {
	if (prey.sheltered || prey.hibernating) return false;
	if (isAquatic(state, prey)) return false;
	if (state.modules.continents) {
		if ((prey.zoneId ?? "laurasia") !== (plant.zoneId ?? "laurasia")) return false;
		if (herdingProtects(state, prey)) return false;
	}
	if (!prey.sedated) {
		if (hasTrait(prey, "highBodyWeight")) return false;
		if (hasTrait(prey, "camouflage")) return false;
		if (hasTrait(prey, "burrowing") && isFed(prey)) return false;
		if (livingSymbiontProtects(state, prey)) return false;
	}
	return true;
}
/** Убежище доступно с любого растения, где остались жетоны, — даже несъедобного. */
function canTakeShelterFrom(state, animal, plant) {
	if (plant.shelters <= 0) return false;
	if (animal.hibernating || animal.sheltered) return false;
	if (state.modules.continents) {
		if ((animal.zoneId ?? "laurasia") !== (plant.zoneId ?? "laurasia")) return false;
	}
	return true;
}
function nextPlayerId(state, from = state.currentPlayerId) {
	const n = state.players.length;
	return (from + 1) % n;
}
function findFlora(state, id) {
	return state.flora?.find((f) => f.id === id);
}
function mustFindFlora(state, id) {
	const f = findFlora(state, id);
	if (!f) throw new Error(`flora ${id}`);
	return f;
}
/**
* Может ли животное брать фишку с карты флоры: по правилам дополнения
* запретов нет (даже для хищников и водных); с «Континентами» флора стоит
* на континентах — животные Океана с неё не едят.
*/
function canFeedOnFlora(state, animal, flora) {
	if (flora.food <= 0) return false;
	if (animal.hibernating) return false;
	if (state.modules.continents && (animal.zoneId ?? "laurasia") !== (flora.zoneId ?? "gondwana")) return false;
	return true;
}
/**
* Текущие очки игрока по живым животным — та же формула, что и финальный
* подсчёт (finishGame): 2 очка за каждое животное вида, по очку за свойство
* и его бонус. В настольной игре счёт скрыт до конца партии, поэтому
* в UI он показывается опциональным тумблером.
*/
function liveScore(state, playerId) {
	const p = state.players.find((x) => x.id === playerId);
	if (!p) return 0;
	let total = 0;
	for (const a of p.animals) {
		total += 2 * (a.population ?? 1);
		for (const t of a.traits) {
			if (t.disabled) continue;
			total += 1 + TRAITS[t.type].scoreBonus;
		}
	}
	return total;
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
			passedFeed: false,
			blindDeck: modules?.randomMutations ? [] : void 0
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
	if (state.modules.plants) {
		state.plants = [];
		state.plantDeck = shuffled(state, [...plantDeckKinds()]);
		addNewPlants(state, plantTable(playerCount).initial, true);
		state.plantDeckCount = state.plantDeck.length;
	}
	if (state.modules.fungi) {
		state.flora = [];
		state.floraDeck = shuffled(state, floraDeckKinds());
		state.marksPool = fullMarksPool();
		state.madTurn = void 0;
		state.rageTurn = null;
		addNewFlora(state, 2, true);
		state.floraDeckCount = state.floraDeck.length;
	}
	if (state.modules.randomMutations) {
		for (const p of state.players) for (let i = 0; i < 7; i++) {
			const c = state.deck.pop();
			if (c) p.blindDeck.push(c);
		}
		log(state, `Случайные мутации: у каждого игрока личная колода из 7 карт.`, "good");
	} else {
		const dealEach = state.modules.plants ? 8 : 6;
		for (let i = 0; i < dealEach; i++) for (const p of state.players) {
			const c = state.deck.pop();
			if (c) p.hand.push(c);
		}
	}
	const first = Math.floor(nextRandom(state) * playerCount);
	state.currentPlayerId = first;
	state.firstPlayerId = first;
	log(state, `Год 1. Первым ходит ${state.players[first].name}.`, "good");
	startMutationsDevTurn(state, first);
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
	p.discardCount += (animal.population ?? 1) + animal.traits.length;
	for (const t of animal.traits) if (t.pairWith) {
		const other = findAnimal(state, t.pairWith);
		if (other) other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
	}
	p.animals = p.animals.filter((a) => a.id !== animal.id);
	feedFungi(state);
	returnMarksToPool(state, animal);
	spreadFungalGrowth(state);
}
/** Каждый гриб получает фишку за гибель животного (не выше максимума). */
function feedFungi(state) {
	if (!state.modules.plants) return;
	for (const pl of state.plants ?? []) {
		if (pl.kind !== "fungus") continue;
		const max = PLANTS.fungus.maxFood;
		if (pl.food < max) pl.food += 1;
	}
}
/** Положить на стол растение из колоды растений (учитывая континенты). */
function spawnPlant(state, kind, zone) {
	const def = PLANTS[kind];
	state.playSeq += 1;
	let zoneId;
	if (state.modules.continents) zoneId = zone ?? "gondwana";
	const plant = {
		id: nid(state, "p"),
		kind,
		food: def.startFood,
		shelters: def.shelters,
		traits: [],
		playSeq: state.playSeq,
		...zoneId !== void 0 ? { zoneId } : {}
	};
	state.plants.push(plant);
	ev(state, {
		kind: "plantPlaced",
		plantId: plant.id,
		kindOfPlant: kind
	});
	return plant;
}
/**
* Добавить растения из колоды: не выше максимума стола (паразиты не в счёт).
* «Континенты»: первым кладём на континент, где растений меньше (в самом
* начале игры — Гондвана, затем чередование).
*/
function addNewPlants(state, count, initial = false) {
	if (!state.modules.plants) return;
	const table = plantTable(state.players.length);
	let added = 0;
	for (let i = 0; i < count; i++) {
		if (state.plants.filter((p) => p.kind !== "parasite").length >= table.max) break;
		const kind = state.plantDeck.pop();
		if (!kind) break;
		let zone;
		if (state.modules.continents) {
			if (initial) zone = state.plants.filter((p) => p.kind !== "parasite").length % 2 === 0 ? "gondwana" : "laurasia";
			else zone = state.plants.filter((p) => p.kind !== "parasite" && (p.zoneId ?? "gondwana") === "gondwana").length > state.plants.filter((p) => p.kind !== "parasite" && (p.zoneId ?? "gondwana") === "laurasia").length ? "laurasia" : "gondwana";
		}
		spawnPlant(state, kind, zone);
		added += 1;
		log(state, `Новое растение: ${PLANTS[kind].name}${zone ? ` (${zone === "gondwana" ? "Гондвана" : "Лавразия"})` : ""}.`, "good");
	}
	if (added === 0 && count > 0) log(state, `Колода растений пуста — новых растений нет.`);
	state.plantDeckCount = state.plantDeck.length;
}
/** Положить на стол карту флоры из колоды (учитывая континенты). */
function spawnFlora(state, kind, zone) {
	const def = FLORA[kind];
	state.playSeq += 1;
	const card = {
		id: nid(state, "f"),
		kind,
		food: def.isFungus ? 1 : 3,
		playSeq: state.playSeq,
		...zone !== void 0 ? { zoneId: zone } : {}
	};
	state.flora.push(card);
	ev(state, {
		kind: "floraPlaced",
		floraId: card.id,
		kindOfFlora: kind
	});
	return card;
}
/**
* Добавить карты флоры из колоды: не выше максимума стола (8 карт).
* «Континенты» (по главе «Континенты + Растения» официального FAQ):
* флора живёт на континентах, первым кладём туда, где её меньше.
*/
function addNewFlora(state, count, initial = false) {
	if (!state.modules.fungi) return;
	let added = 0;
	for (let i = 0; i < count; i++) {
		if (state.flora.length >= 8) break;
		const kind = state.floraDeck.pop();
		if (!kind) break;
		let zone;
		if (state.modules.continents) {
			const g = state.flora.filter((f) => (f.zoneId ?? "gondwana") === "gondwana").length;
			const l = state.flora.filter((f) => (f.zoneId ?? "gondwana") === "laurasia").length;
			zone = initial ? g === 0 ? "gondwana" : "laurasia" : g > l ? "laurasia" : "gondwana";
		}
		spawnFlora(state, kind, zone);
		added += 1;
		log(state, `Новая карта флоры: ${FLORA[kind].name}${zone ? ` (${zone === "gondwana" ? "Гондвана" : "Лавразия"})` : ""}.`, "good");
	}
	if (added === 0 && count > 0 && state.floraDeck.length === 0) log(state, `Колода трав и грибов пуста — новых карт нет.`);
	state.floraDeckCount = state.floraDeck.length;
}
/**
* Разрастание грибов: гибель любого животного кладёт 1 красную фишку на
* гриб (по выбору владельца погибшего; онлайн-версия кладёт на самый пустой).
*/
function spreadFungalGrowth(state) {
	if (!state.modules.fungi) return;
	if (state.phase !== "feeding" && state.phase !== "extinction") return;
	const mushrooms = (state.flora ?? []).filter((f) => FLORA[f.kind].isFungus && f.food < 4);
	if (!mushrooms.length) return;
	const target = mushrooms.reduce((best, f) => f.food < best.food ? f : best, mushrooms[0]);
	const before = target.food;
	target.food += 1;
	ev(state, {
		kind: "floraGrew",
		floraId: target.id,
		from: before,
		to: target.food
	});
}
/**
* Дать животному метку последствий. Из колоды на столе (взятие с флоры) метка
* приходит, только если она ещё осталась; перенос со съеденной добычи (force)
* всегда успешен. «Трын» защищает от любых меток.
*/
function giveMark(state, animal, mark, opts) {
	if (hasMark(animal, mark)) return false;
	if (hasMark(animal, "thryn")) return false;
	if (!opts?.force) {
		const left = state.marksPool?.[mark] ?? 0;
		if (left <= 0) return false;
		state.marksPool = {
			...state.marksPool,
			[mark]: left - 1
		};
	}
	animal.marks = [...animal.marks ?? [], mark];
	ev(state, {
		kind: "markGained",
		animalId: animal.id,
		mark
	});
	log(state, `${ownerOf(state, animal.id).name}: животное получает метку «${MARKS[mark].name}».`, mark === "poison" ? "bad" : "neutral");
	if (mark === "poison") dropTraitOfType(state, animal, "parasite");
	return true;
}
/** Перенос меток со съеденной добычи на хищника (без расхода стола меток). */
function transferMarks(state, predator, marks) {
	for (const m of marks) giveMark(state, predator, m, { force: true });
}
/** Снять все метки животного, вернув их на стол. */
function returnMarksToPool(state, animal) {
	if (!animal.marks?.length) return;
	for (const m of animal.marks) {
		const left = state.marksPool?.[m] ?? 0;
		state.marksPool = {
			...state.marksPool,
			[m]: left + 1
		};
	}
	animal.marks = [];
}
/** Сброс одного свойства животного в сброс (карта учитывается владельцу). */
function dropTraitOfType(state, animal, type) {
	const trait = animal.traits.find((t) => t.type === type && isActive(t));
	if (!trait) return;
	if (trait.pairWith) {
		const other = findAnimal(state, trait.pairWith);
		if (other) other.traits = other.traits.filter((x) => x.cardId !== trait.cardId);
	}
	animal.traits = animal.traits.filter((t) => t.id !== trait.id);
	ownerOf(state, animal.id).discardCount += 1;
	log(state, `Свойство «${TRAITS[type].name}» уходит в сброс.`);
}
function legalDevActions(state, playerId) {
	if (state.phase !== "development") return [];
	if (state.currentPlayerId !== playerId) return [];
	const p = player(state, playerId);
	if (p.passedDev) return [];
	const cont = state.modules.continents;
	const plants = state.modules.plants ? state.plants ?? [] : [];
	const actions = [{ type: "devPass" }];
	if (state.modules.randomMutations) {
		const deck = p.blindDeck ?? [];
		if (!deck.length) return actions;
		if (cont) {
			actions.push({
				type: "devMutate",
				intent: "newAnimal",
				zoneId: "laurasia"
			});
			actions.push({
				type: "devMutate",
				intent: "newAnimal",
				zoneId: "gondwana"
			});
		} else actions.push({
			type: "devMutate",
			intent: "newAnimal"
		});
		for (const a of p.animals) {
			if ((a.population ?? 1) === 1) actions.push({
				type: "devMutate",
				intent: "trait",
				animalId: a.id
			});
			const ext = a.traits.some((t) => t.type === "extremophile" && isActive(t));
			if ((a.population ?? 1) < p.animals.length && (!ext || deck.length >= 2)) actions.push({
				type: "devMutate",
				intent: "population",
				animalId: a.id
			});
		}
		if (state.modules.plants) for (const pl of plants) actions.push({
			type: "devMutate",
			intent: "plant",
			plantId: pl.id
		});
		return actions;
	}
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
			if (def.plantTrait && state.modules.plants) {
				if (trait === "micorrhiza") {
					for (let i = 0; i < plants.length; i++) for (let j = 0; j < plants.length; j++) {
						if (i === j) continue;
						if (!canLinkMicorrhiza(state, plants[i], plants[j])) continue;
						actions.push({
							type: "devPlayPlantPair",
							cardId: card.id,
							face,
							a: plants[i].id,
							b: plants[j].id
						});
					}
					continue;
				}
				for (const pl of plants) {
					if (trait === "plantParasite") {
						actions.push({
							type: "devPlayPlantTrait",
							cardId: card.id,
							face,
							plantId: pl.id
						});
						continue;
					}
					if (plantHasTrait(pl, trait)) continue;
					actions.push({
						type: "devPlayPlantTrait",
						cardId: card.id,
						face,
						plantId: pl.id
					});
				}
				continue;
			}
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
	if ((trait === "carnivore" || trait === "scavenger") && hasTrait(animal, "obligateCarnivore", includeHidden)) return false;
	if (trait === "obligateCarnivore" && (hasTrait(animal, "carnivore", includeHidden) || hasTrait(animal, "scavenger", includeHidden))) return false;
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
/**
* Микориза связывает два растения; пара растений может быть связана только
* одной микоризой, но у растения бывает несколько связей с разными партнёрами.
* «Континенты»: только внутри одного континента.
*/
function canLinkMicorrhiza(state, a, b) {
	if (a.id === b.id) return false;
	if (state.modules.continents && (a.zoneId ?? "gondwana") !== (b.zoneId ?? "gondwana")) return false;
	return !(a.traits.some((t) => t.type === "micorrhiza" && t.pairWith === b.id) || b.traits.some((t) => t.type === "micorrhiza" && t.pairWith === a.id));
}
/** Реальное действие в фазу питания: игрок снова участвует в круге. */
function spendTurn(state, playerId) {
	player(state, playerId).passedFeed = false;
}
function giveFood(state, animal, amount, kind, opts) {
	if (amount <= 0) return;
	if (hasTrait(animal, "obligateCarnivore") && !opts?.obligate) return;
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
	if (state.rageTurn) {
		const mad = findAnimal(state, state.rageTurn.animalId);
		if (mad && canRageAttackWith(mad)) {
			for (const prey of allAnimals(state)) if (canRageAttack(state, mad, prey)) actions.push({
				type: "feedHunt",
				carnivoreId: mad.id,
				preyId: prey.id
			});
		}
		actions.push({ type: "feedEndTurn" });
		return actions;
	}
	const used = state.turnUse;
	const cont = state.modules.continents;
	const plants = state.modules.plants ? state.plants ?? [] : [];
	const flora = state.modules.fungi ? state.flora ?? [] : [];
	const turnTerritory = state.turnTerritory;
	const zoneUnlocked = (zone) => !cont || turnTerritory === void 0 || turnTerritory === (zone ?? "laurasia");
	for (const a of p.animals) {
		if (cont && used.migrated) break;
		const zone = a.zoneId ?? "laurasia";
		const territoryUnlocked = zoneUnlocked(zone);
		if ((cont ? plants.length ? zone === "ocean" : true : !plants.length) && (cont ? (state.territoryFood?.[zone] ?? 0) > 0 : state.foodBank > 0) && territoryUnlocked && !used.foodTaken && !used.combatUsed && !used.sheltered && canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore")) actions.push({
			type: "feedTake",
			animalId: a.id
		});
		if (state.modules.plants && !used.foodTaken && !used.combatUsed && !used.sheltered && canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore") && !(cont && zone === "ocean")) for (const pl of plants) {
			if (!zoneUnlocked(pl.zoneId)) continue;
			if (canFeedOnPlant(state, a, pl)) actions.push({
				type: "feedTakePlant",
				animalId: a.id,
				plantId: pl.id
			});
		}
		if (state.modules.fungi && !used.foodTaken && !used.combatUsed && !used.sheltered && !used.migrated && canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore") && !(cont && zone === "ocean")) for (const f of flora) {
			if (!canFeedOnFlora(state, a, f)) continue;
			if (!zoneUnlocked(f.zoneId)) continue;
			actions.push({
				type: "feedTakeFlora",
				animalId: a.id,
				floraId: f.id
			});
		}
		if (state.modules.plants && !used.foodTaken && !used.combatUsed && !used.migrated && !used.sheltered) for (const pl of plants) {
			if (!zoneUnlocked(pl.zoneId)) continue;
			if (canTakeShelterFrom(state, a, pl)) actions.push({
				type: "feedShelter",
				animalId: a.id,
				plantId: pl.id
			});
		}
		if (canHuntWith(state, a) && !used.carnivores.includes(a.id) && !used.foodTaken && !used.sheltered) {
			for (const prey of allAnimals(state)) if (canAttack(state, a, prey)) actions.push({
				type: "feedHunt",
				carnivoreId: a.id,
				preyId: prey.id
			});
		}
		if (hasTrait(a, "piracy") && !isFed(a) && !a.hibernating && !used.pirates.includes(a.id) && !used.foodTaken && !used.sheltered && !isParalyzed(state, a.id) && !hasMark(a, "pacifism") && !hasTrait(a, "obligateCarnivore")) for (const t of allAnimals(state)) {
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
			const need = Math.max(1, speciesNeed(a) - a.food);
			actions.push({
				type: "feedConvertFat",
				animalId: a.id,
				amount: Math.min(a.fatTokens, need)
			});
		}
		if (!cont && !plants.length && state.foodBank > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) actions.push({
			type: "feedGraze",
			animalId: a.id
		});
		if (cont && (state.territoryFood?.[zone] ?? 0) > 0 && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) {
			if (turnTerritory === void 0 || turnTerritory === zone) actions.push({
				type: "feedGraze",
				animalId: a.id
			});
		}
		if (state.modules.plants && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) for (const pl of plants) {
			if (pl.food <= 0) continue;
			if (!zoneUnlocked(pl.zoneId)) continue;
			if (cont && (pl.zoneId ?? "laurasia") !== zone) continue;
			actions.push({
				type: "feedGraze",
				animalId: a.id,
				plantId: pl.id
			});
		}
		if (state.modules.fungi && hasTrait(a, "grazing") && !used.grazers.includes(a.id) && !used.sheltered && !isFed(a)) for (const f of flora) {
			if (f.food <= 0) continue;
			if (!canFeedOnFlora(state, a, f)) continue;
			if (!zoneUnlocked(f.zoneId)) continue;
			actions.push({
				type: "feedGraze",
				animalId: a.id,
				floraId: f.id
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
	if (state.modules.plants) {
		if (!used.foodTaken && !used.combatUsed && !used.migrated && !used.sheltered) for (const pl of plants) {
			if (pl.kind !== "carnivorous" || pl.attackedThisYear) continue;
			if (!zoneUnlocked(pl.zoneId)) continue;
			for (const prey of allAnimals(state)) {
				if (prey.ownerId === p.id) continue;
				if (canPlantAttackTarget(state, pl, prey)) actions.push({
					type: "feedPlantAttack",
					plantId: pl.id,
					preyId: prey.id
				});
			}
		}
		if (!used.foodTaken && !used.combatUsed && !used.migrated && !used.sheltered) for (const par of plants) {
			if (par.kind !== "parasite" || !par.hostId) continue;
			const host = findPlant(state, par.hostId);
			if (!host || host.food <= 1) continue;
			if (!zoneUnlocked(host.zoneId)) continue;
			actions.push({
				type: "feedParasitize",
				hostId: host.id,
				parasiteId: par.id
			});
		}
	}
	actions.push({ type: "feedEndTurn" });
	if (!state.modules.plants || !canStillFeedOrShelter(state, playerId)) actions.push({ type: "feedSkip" });
	return actions;
}
/**
* «Растения»: есть ли у игрока животное, способное прямо сейчас получить
* фишку еды или убежища (с чистым ходом — ограничения этого хода не важны).
*/
function canStillFeedOrShelter(state, playerId) {
	const p = player(state, playerId);
	const plants = state.plants ?? [];
	const flora = state.flora ?? [];
	const cont = state.modules.continents;
	for (const a of p.animals) {
		if (a.hibernating) continue;
		if (cont && (a.zoneId ?? "laurasia") === "ocean") {
			if ((state.territoryFood?.ocean ?? 0) > 0 && canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore")) return true;
			continue;
		}
		if (canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore")) {
			if (plants.some((pl) => canFeedOnPlant(state, a, pl))) return true;
			if (flora.some((f) => canFeedOnFlora(state, a, f))) return true;
		}
		if (!a.sheltered && plants.some((pl) => canTakeShelterFrom(state, a, pl))) return true;
	}
	return false;
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
	if (animal.sedated || isAsleep(animal)) return [];
	const opts = [];
	for (const t of animal.traits) {
		if (!isActive(t)) continue;
		if (attack.ignoredTraitId && t.id === attack.ignoredTraitId) continue;
		const kind = TRAITS[t.type].defense;
		if (!kind || attack.usedDefenses.includes(kind)) continue;
		if (kind === "mimicry" && attack.mimicryChain.includes(animal.id)) continue;
		if (!opts.includes(kind)) opts.push(kind);
	}
	return opts;
}
function mimicryTargets(state, attack, prey) {
	const owner = ownerOf(state, prey.id);
	if (attack.plantId) {
		const plant = mustFindPlant(state, attack.plantId);
		return owner.animals.filter((a) => {
			if (a.id === prey.id) return false;
			if (attack.mimicryChain.includes(a.id)) return false;
			return canPlantAttackTarget(state, plant, a);
		});
	}
	const carnivore = mustFind(state, attack.carnivoreId);
	const attackable = (a) => attack.rage ? canRageAttack(state, carnivore, a) : canAttack(state, carnivore, a);
	return owner.animals.filter((a) => {
		if (a.id === prey.id) return false;
		if (attack.mimicryChain.includes(a.id)) return false;
		return attackable(a);
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
/**
* Успешная атака хищного растения: животное гибнет, на растение ложатся
* фишки (2 за добычу), ядовитая добыча обрекает растение в вымирание.
* Падальщики получают свою фишку, regeneration оставляет свойства.
*/
function finishPlantKill(state, plant, prey, tokens) {
	const victim = ownerOf(state, prey.id);
	const poisoned = prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller);
	ev(state, {
		kind: "preyKilled",
		preyId: prey.id,
		carnivoreId: plant.id
	});
	log(state, `Хищное растение съедает животное ${victim.name} (${animalValue(prey)} очк.).`, "hunt");
	if (poisoned) {
		plant.doomed = true;
		log(state, `Добыча была ядовитой — растение погибнет в вымирание.`, "bad");
	}
	if (state.modules.randomMutations && (prey.population ?? 1) > 1) {
		prey.population = (prey.population ?? 1) - 1;
		ev(state, {
			kind: "populationLost",
			animalId: prey.id,
			to: prey.population
		});
		log(state, `${victim.name}: вид теряет животное (осталось ${prey.population}).`, "bad");
		feedFungi(state);
		spreadFungalGrowth(state);
	} else if (hasTrait(prey, "regeneration")) {
		state.pendingRegeneration = [...state.pendingRegeneration ?? [], regenSnapshotOf(prey, victim.id)];
		log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "good");
		const p0 = ownerOf(state, prey.id);
		p0.animals = p0.animals.filter((a) => a.id !== prey.id);
		p0.discardCount += 1;
	} else discardAnimal(state, prey);
	const max = PLANTS.carnivorous.maxFood;
	plant.food = Math.min(max, plant.food + tokens);
	triggerScavenger(state, state.currentPlayerId);
	state.pendingAttack = null;
	maybeEndTurn(state);
}
/**
* Успешная атака хищника. «Трава и грибы»: хищник переносит на себя все
* метки добычи; бешеное животное убивает, но не ест (без фишек, яда и меток);
* «Насекомоядное» за животное без свойств получает 1 синюю вместо двух.
*/
function finishHuntSuccess(state, carnivore, prey, foodGain, opts) {
	const hunter = ownerOf(state, carnivore.id);
	const victim = ownerOf(state, prey.id);
	const preyMarks = [...prey.marks ?? []];
	const propertyless = prey.traits.length === 0 || isAsleep(prey);
	const insectivore = opts?.rage ? false : hasTrait(carnivore, "insectivore") && propertyless;
	const gain = insectivore ? 1 : foodGain;
	const poisoned = !opts?.rage && prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller) && gain === 2;
	ev(state, {
		kind: "preyKilled",
		preyId: prey.id,
		carnivoreId: carnivore.id
	});
	log(state, opts?.rage ? `Бешеное животное ${hunter.name} убивает животное ${victim.name} (${animalValue(prey)} очк.) — добычу не ест.` : `${hunter.name} охотится: ${victim.name} теряет животное (${animalValue(prey)} очк.).`, "hunt");
	if (insectivore) log(state, `Насекомоядное: добыча без свойств — 1 синяя фишка вместо двух.`, "good");
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
	if (state.modules.randomMutations && (prey.population ?? 1) > 1) {
		prey.population = (prey.population ?? 1) - 1;
		ev(state, {
			kind: "populationLost",
			animalId: prey.id,
			to: prey.population
		});
		log(state, `${victim.name}: вид теряет животное (осталось ${prey.population}).`, "bad");
		feedFungi(state);
		spreadFungalGrowth(state);
	} else if (hasTrait(prey, "regeneration")) {
		state.pendingRegeneration = [...state.pendingRegeneration ?? [], regenSnapshotOf(prey, victim.id)];
		log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "good");
		const p0 = ownerOf(state, prey.id);
		p0.animals = p0.animals.filter((a) => a.id !== prey.id);
		p0.discardCount += 1;
		returnMarksToPool(state, prey);
	} else discardAnimal(state, prey);
	if (!opts?.rage) {
		giveFood(state, carnivore, gain, "blue", { obligate: true });
		ev(state, {
			kind: "blueFood",
			animalId: carnivore.id,
			reason: "hunt"
		});
		if (gain > 0 && hasTrait(carnivore, "obligateCarnivore") && !carnivore.hibernating) {
			carnivore.food = speciesNeed(carnivore);
			carnivore.receivedFoodThisYear = true;
			log(state, `${hunter.name}: облигатный хищник накормлен добычей.`, "good");
		}
		transferMarks(state, carnivore, preyMarks);
		if (gain === 2) {
			for (const def of Object.values(TRAITS)) if (def.onAnyKill === "scavenger") {
				triggerScavenger(state, hunter.id);
				break;
			}
		}
	} else triggerScavenger(state, hunter.id);
	state.pendingAttack = null;
	if (opts?.rage) advanceFeed(state);
	else maybeEndTurn(state);
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
	if (atk.plantId) {
		const plant = findPlant(state, atk.plantId);
		const prey = findAnimal(state, atk.preyId);
		if (!plant || !prey) {
			state.pendingAttack = null;
			return;
		}
		finishPlantKill(state, plant, prey, 2);
		return;
	}
	const carnivore = findAnimal(state, atk.carnivoreId);
	const prey = findAnimal(state, atk.preyId);
	if (!carnivore || !prey) {
		state.pendingAttack = null;
		return;
	}
	finishHuntSuccess(state, carnivore, prey, 2, atk.rage ? { rage: true } : void 0);
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
		case "devPlayPlantTrait":
			playPlantTrait(next, action.cardId, action.face, action.plantId);
			break;
		case "devPlayPlantPair":
			playPlantPair(next, action.cardId, action.face, action.a, action.b);
			break;
		case "devPass":
			passDev(next);
			break;
		case "devMutate":
			devMutate(next, action);
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
		case "continueGrowth":
			continueGrowth(next);
			break;
		case "feedTake":
			feedTake(next, action.animalId);
			break;
		case "feedTakePlant":
			feedTakePlant(next, action.animalId, action.plantId);
			break;
		case "feedTakeFlora":
			feedTakeFlora(next, action.animalId, action.floraId);
			break;
		case "feedShelter":
			feedShelter(next, action.animalId, action.plantId);
			break;
		case "feedHunt":
			feedHunt(next, action.carnivoreId, action.preyId);
			break;
		case "feedPlantAttack":
			feedPlantAttack(next, action.plantId, action.preyId);
			break;
		case "feedParasitize":
			feedParasitize(next, action.hostId, action.parasiteId);
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
			feedGraze(next, action.animalId, action.plantId, action.floraId);
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
/** Грань вскрытой карты: у двусторонних карт мутация выбирается случайно. */
function mutationFace(state, card) {
	if (card.faces.length <= 1) return card.faces[0];
	return card.faces[Math.floor(nextRandom(state) * card.faces.length)];
}
/** Пустышка с тем же cardId — makeTrait читает только id карты. */
function cardShell(cardId, type) {
	return {
		id: cardId,
		faces: [type]
	};
}
/** Новый вид из карты (рубашкой): в мутациях у вида всегда численность 1+. */
function spawnSpecies(state, p, card, zone) {
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
		population: 1,
		...state.modules.continents ? { zoneId: zone === "ocean" ? "laurasia" : zone ?? "laurasia" } : {}
	};
	p.animals.push(animal);
	ev(state, {
		kind: "animalPlaced",
		animalId: animal.id,
		ownerId: p.id,
		zoneId: animal.zoneId
	});
	return animal;
}
/** Прикрепить свойство-мутацию (неоплазия кладётся под стек — как обычно). */
function attachMutationTrait(state, card, trait, animal) {
	if (trait === "neoplasia") {
		animal.traits.unshift(makeTrait(state, card, trait));
		animal.neoplasia = animal.traits[0];
	} else animal.traits.push(makeTrait(state, card, trait));
	ev(state, {
		kind: "traitPlaced",
		animalId: animal.id,
		type: trait,
		hidden: false
	});
	settleAfterTraitChange(state, animal);
}
/**
* Свойство, не подошедшее ни одному виду, само становится новым видом:
* карта ложится животным и несёт эту мутацию (если та legally ложится
* на пустое животное; парные и свойства растений — просто животным).
*/
function fallbackNewSpecies(state, p, card, trait, zone) {
	const def = TRAITS[trait];
	const animal = spawnSpecies(state, p, card, zone);
	ev(state, {
		kind: "mutationFlipped",
		playerId: p.id,
		cardId: card.id,
		trait,
		usedAs: "newSpecies"
	});
	if (!def.plantTrait && !def.isPair && !def.opponentOnly && canAttachTrait(animal, trait, true)) {
		attachMutationTrait(state, card, trait, animal);
		log(state, `${p.name}: «${def.name}» не подошло ни одному виду — появляется новый вид-мутант.`, def.harmful ? "bad" : "good");
	} else log(state, `${p.name}: карта ложится новым видом (свойство «${def.name}» сыграть нельзя).`);
}
/**
* «Упрощение»: последнее сыгранное свойство вида отделяется новым видом,
* сама карта «Упрощение» тоже становится новым видом.
*/
function resolveSimplification(state, p, card, target) {
	const last = [...target.traits].filter((t) => !t.pairWith && !t.disabled).sort((a, b) => b.playSeq - a.playSeq)[0];
	if (last) {
		target.traits = target.traits.filter((t) => t.id !== last.id);
		if (target.neoplasia?.id === last.id) target.neoplasia = void 0;
		const mutant = spawnSpecies(state, p, cardShell(last.cardId, last.type), target.zoneId);
		mutant.traits.push(makeTrait(state, cardShell(last.cardId, last.type), last.type, { playSeq: last.playSeq }));
		ev(state, {
			kind: "traitPlaced",
			animalId: mutant.id,
			type: last.type,
			hidden: false
		});
		log(state, `${p.name}: «Упрощение» — «${TRAITS[last.type].name}» отделяется новым видом.`, "bad");
	}
	spawnSpecies(state, p, card, target.zoneId);
	log(state, `${p.name}: «Упрощение» — карта ложится новым видом.`, "bad");
}
/**
* Действие devMutate: игрок объявил способ розыгрыша — переворачиваем верхнюю
* карту личной колоды и разыгрываем её по правилам «Случайных мутаций».
*/
function devMutate(state, action) {
	const p = player(state, state.currentPlayerId);
	const deck = p.blindDeck ?? [];
	if (!deck.length) {
		advanceDev(state);
		return;
	}
	const card = deck.pop();
	if (action.intent === "newAnimal") {
		spawnSpecies(state, p, card, state.modules.continents ? action.zoneId === "ocean" ? "laurasia" : action.zoneId ?? "laurasia" : void 0);
		ev(state, {
			kind: "mutationFlipped",
			playerId: p.id,
			cardId: card.id,
			trait: null,
			usedAs: "animal"
		});
		log(state, `${p.name}: объявлен новый вид — карта из колоды ложится животным.`);
		advanceDev(state);
		return;
	}
	if (action.intent === "population") {
		const target = findAnimal(state, action.animalId ?? "");
		if (!target || target.ownerId !== p.id || (target.population ?? 1) >= p.animals.length) {
			fallbackNewSpecies(state, p, card, mutationFace(state, card), target?.zoneId);
			advanceDev(state);
			return;
		}
		if (target.traits.some((t) => t.type === "extremophile" && isActive(t)) && deck.length) {
			deck.pop();
			p.discardCount += 1;
			log(state, `«Экстрофил»: дополнительная карта уходит в сброс.`, "bad");
		}
		target.population = (target.population ?? 1) + 1;
		ev(state, {
			kind: "mutationFlipped",
			playerId: p.id,
			cardId: card.id,
			trait: null,
			usedAs: "population"
		});
		ev(state, {
			kind: "populationGrown",
			animalId: target.id,
			to: target.population
		});
		log(state, `${p.name}: вид получает +1 животное (численность ${target.population}).`);
		advanceDev(state);
		return;
	}
	if (action.intent === "plant") {
		const trait = mutationFace(state, card);
		const def = TRAITS[trait];
		const plant = state.modules.plants ? findPlant(state, action.plantId ?? "") : void 0;
		if (plant && def.plantTrait && trait !== "micorrhiza") {
			if (trait === "plantParasite" || !plantHasTrait(plant, trait)) {
				applyPlantTraitCard(state, p, card, trait, plant);
				ev(state, {
					kind: "mutationFlipped",
					playerId: p.id,
					cardId: card.id,
					trait,
					usedAs: "plantTrait"
				});
				advanceDev(state);
				return;
			}
		}
		fallbackNewSpecies(state, p, card, trait, plant?.zoneId);
		advanceDev(state);
		return;
	}
	const trait = mutationFace(state, card);
	const target = findAnimal(state, action.animalId ?? "");
	if (!target || target.ownerId !== p.id || (target.population ?? 1) !== 1) {
		fallbackNewSpecies(state, p, card, trait, target?.zoneId);
		advanceDev(state);
		return;
	}
	if (trait === "simplification") {
		ev(state, {
			kind: "mutationFlipped",
			playerId: p.id,
			cardId: card.id,
			trait,
			usedAs: "newSpecies"
		});
		resolveSimplification(state, p, card, target);
		advanceDev(state);
		return;
	}
	const def = TRAITS[trait];
	const attachable = (a) => !def.plantTrait && !def.isPair && !def.opponentOnly && canAttachTrait(a, trait, true);
	if (attachable(target)) {
		attachMutationTrait(state, card, trait, target);
		ev(state, {
			kind: "mutationFlipped",
			playerId: p.id,
			cardId: card.id,
			trait,
			usedAs: "trait"
		});
		log(state, def.harmful ? `${p.name}: вредная мутация — «${def.name}» на своём виде!` : `${p.name}: мутация «${def.name}».`, def.harmful ? "bad" : "neutral");
		advanceDev(state);
		return;
	}
	const idx = p.animals.findIndex((a) => a.id === target.id);
	for (let k = 1; k < p.animals.length; k++) {
		const cand = p.animals[(idx + k) % p.animals.length];
		if ((cand.population ?? 1) !== 1) continue;
		if (!attachable(cand)) continue;
		attachMutationTrait(state, card, trait, cand);
		ev(state, {
			kind: "mutationFlipped",
			playerId: p.id,
			cardId: card.id,
			trait,
			usedAs: "trait"
		});
		log(state, `${p.name}: «${def.name}» не подошло виду — переехало соседнему.`);
		advanceDev(state);
		return;
	}
	fallbackNewSpecies(state, p, card, trait, target.zoneId);
	advanceDev(state);
}
/**
* Начало хода игрока в фазе развития: «Почкование» добавляет виду животное
* из личной колоды (численность не ограничена числом видов).
*/
function startMutationsDevTurn(state, playerId) {
	if (!state.modules.randomMutations || state.phase !== "development") return;
	const p = player(state, playerId);
	if (p.passedDev) return;
	for (const a of [...p.animals]) {
		if (!a.traits.some((t) => t.type === "budding" && isActive(t))) continue;
		if (!p.blindDeck?.length) break;
		p.blindDeck.pop();
		a.population = (a.population ?? 1) + 1;
		ev(state, {
			kind: "budding",
			animalId: a.id,
			playerId: p.id
		});
		ev(state, {
			kind: "populationGrown",
			animalId: a.id,
			to: a.population
		});
		log(state, `${p.name}: «Почкование» — вид растёт до ${a.population} животного(-ых).`, "good");
	}
}
/** Выложить свойство растения на общее растение (паразит — на хозяина). */
function playPlantTrait(state, cardId, face, plantId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	applyPlantTraitCard(state, p, card, faceOf(card, face), mustFindPlant(state, plantId));
	advanceDev(state);
}
/** Общая логика свойства растения (для руки и для карты-мутации). */
function applyPlantTraitCard(state, p, card, trait, plant) {
	if (trait === "plantParasite") {
		state.playSeq += 1;
		const parasite = {
			id: nid(state, "p"),
			kind: "parasite",
			food: 0,
			shelters: 0,
			traits: [],
			hostId: plant.id,
			playSeq: state.playSeq,
			...plant.zoneId !== void 0 ? { zoneId: plant.zoneId } : {}
		};
		state.plants.push(parasite);
		ev(state, {
			kind: "plantPlaced",
			plantId: parasite.id,
			kindOfPlant: "parasite"
		});
		log(state, `${p.name}: растение-паразит на ${PLANTS[plant.kind].name}.`);
		return;
	}
	plant.traits.push(makeTrait(state, card, trait));
	if (trait === "thorny") plant.shelters += 3;
	if (trait === "tree") plant.shelters += 1;
	log(state, `${p.name}: свойство ${TRAITS[trait].name} → ${PLANTS[plant.kind].name}.`);
}
/** Микориза: связывает два растения, карта «лежит между» ними. */
function playPlantPair(state, cardId, face, aId, bId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const trait = faceOf(card, face);
	const a = mustFindPlant(state, aId);
	const b = mustFindPlant(state, bId);
	if (!canLinkMicorrhiza(state, a, b)) throw new Error("micorrhiza link rejected");
	a.traits.push(makeTrait(state, card, trait, {
		pairWith: b.id,
		pairRole: "a"
	}));
	b.traits.push(makeTrait(state, card, trait, {
		pairWith: a.id,
		pairRole: "b",
		playSeq: state.playSeq
	}));
	log(state, `${p.name}: микориза связывает ${PLANTS[a.kind].name} и ${PLANTS[b.kind].name}.`);
	advanceDev(state);
}
function advanceDev(state) {
	if (state.modules.randomMutations) {
		for (const p of state.players) if (!(p.blindDeck ?? []).length) p.passedDev = true;
	} else if (state.players.every((p) => p.passedDev || p.hand.length === 0)) {
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
			startMutationsDevTurn(state, id);
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
	if ((state.modules.plants || state.modules.fungi) && !state.modules.continents) {
		if (state.modules.fungi) addNewFlora(state, state.players.length);
		log(state, state.modules.plants && state.modules.fungi ? "Питание: еда этого года — на растениях, травах и грибах." : state.modules.plants ? "Питание: еда этого года — на растениях." : "Питание: еда этого года — на травах и грибах.", "good");
		enterFeeding(state);
		return;
	}
	if (state.modules.fungi) addNewFlora(state, state.players.length);
	log(state, "Определение кормовой базы.", "good");
	state.phase = "foodBank";
	state.foodRoll = null;
	state.foodBank = 0;
}
/** Общий старт фазы питания: круг по игрокам от первого игрока. */
function enterFeeding(state) {
	state.phase = "feeding";
	state.currentPlayerId = state.firstPlayerId;
	for (const p of state.players) p.passedFeed = false;
	state.turnTerritory = void 0;
	state.madTurn = void 0;
	state.rageTurn = null;
	state.migratedThisPhase = [];
	feedTurn(state, state.firstPlayerId);
}
/** Действие rollFoodBank: бросаем кубики и запоминаем их — сумма ложится в банк после анимации. */
function startFoodRoll(state) {
	if (state.phase !== "foodBank" || state.foodRoll) return;
	const n = state.players.length;
	if (state.modules.plants || state.modules.fungi) {
		advanceNeoplasia(state);
		const bases = territoryBases(n);
		for (const a of allAnimals(state)) {
			if (a.hibernating) continue;
			if (!a.traits.some((t) => t.type === "edificator" && isActive(t))) continue;
			if ((a.zoneId ?? "laurasia") === "ocean") {
				bases.ocean += 2;
				ev(state, {
					kind: "edificator",
					territory: "ocean",
					amount: 2
				});
			}
		}
		state.foodRoll = [dieFor(state)];
		state.territoryFood = {
			laurasia: 0,
			gondwana: 0,
			ocean: bases.ocean
		};
		state.foodBank = bases.ocean;
		ev(state, {
			kind: "diceRoll",
			dice: state.foodRoll,
			total: bases.ocean
		});
		log(state, `Океан: кормовая база ${bases.ocean}. На континентах еда — на столе флоры.`, "good");
		return;
	}
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
	if ((state.modules.plants || state.modules.fungi) && state.modules.continents) log(state, `Океан: кормовая база ${state.territoryFood?.ocean ?? 0}. На континентах еда — на столе флоры${state.modules.plants ? " (растения" + (state.modules.fungi ? " и травы с грибами)" : ")") : " (травы и грибы)"}.`, "good");
	else if (state.modules.continents) log(state, `Кормовые базы: Лавразия ${state.territoryFood?.laurasia ?? 0}, Гондвана ${state.territoryFood?.gondwana ?? 0}, Океан ${state.territoryFood?.ocean ?? 0}.`, "good");
	else log(state, `Кормовая база: ${state.foodBank}.`, "good");
	state.turnTerritory = void 0;
	state.madTurn = void 0;
	state.rageTurn = null;
	state.migratedThisPhase = [];
	feedTurn(state, state.firstPlayerId);
}
function freshTurnUse() {
	return {
		carnivores: [],
		pirates: [],
		grazers: [],
		foodTaken: false,
		combatUsed: false,
		migrated: false,
		sheltered: false
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
	state.madTurn = void 0;
	state.rageTurn = null;
	let id = startId;
	for (let i = 0; i < state.players.length; i++) {
		if (!player(state, id).passedFeed && hasFreshAction(state, id)) {
			state.currentPlayerId = id;
			state.turnUse = freshTurnUse();
			state.turnTerritory = void 0;
			startMarkTurn(state, id);
			return;
		}
		id = nextPlayerId(state, id);
	}
	endFeeding(state);
}
/**
* «Трава и грибы»: начало раунда игрока. «Бешенство» — метка снимается и
* раунд состоит из обязательной атаки этим животным; «Безумие» — метка
* снимается, раунд вместо игрока проводит сосед справа (в онлайн-версии —
* логика ботов, руку соперник не видит).
*/
function startMarkTurn(state, id) {
	if (!state.modules.fungi) return;
	const p = player(state, id);
	const madAnimal = p.animals.find((a) => hasMark(a, "rage"));
	if (madAnimal) {
		returnMarksToPoolSingle(state, madAnimal, "rage");
		state.rageTurn = { animalId: madAnimal.id };
		log(state, `Бешенство: животное игрока ${p.name} обязано атаковать в этот раунд!`, "hunt");
		return;
	}
	const crazy = p.animals.find((a) => hasMark(a, "madness"));
	if (crazy) {
		returnMarksToPoolSingle(state, crazy, "madness");
		state.madTurn = id;
		log(state, `Безумие: раунд игрока ${p.name} проводит сосед справа.`, "bad");
	}
}
/** Снять одну метку, вернув её на стол. */
function returnMarksToPoolSingle(state, animal, mark) {
	if (!animal.marks?.length) return;
	animal.marks = animal.marks.filter((m) => m !== mark);
	const left = state.marksPool?.[mark] ?? 0;
	state.marksPool = {
		...state.marksPool,
		[mark]: left + 1
	};
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
	if (bankOf(state, zone) <= 0 || state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
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
/**
* Выдача фишки с растения на животное с учётом его свойств: лекарственное
* «усыпляет» (накормлено, свойства не действуют), питательное даёт вторую
* фишку, медонос ворует карту у richer-игрока.
*/
function givePlantFood(state, animal, plant) {
	if (plant.food <= 0) return;
	const owner = ownerOf(state, animal.id);
	plant.food -= 1;
	ev(state, {
		kind: "plantFoodTaken",
		animalId: animal.id,
		plantId: plant.id,
		playerId: owner.id
	});
	if (plantHasTrait(plant, "medicinal")) {
		if (isFed(animal) && !animal.sedated && emptyFatSlots(animal) > 0 && !animal.hibernating) {
			animal.fatTokens += 1;
			ev(state, {
				kind: "foodToFat",
				animalId: animal.id
			});
		} else animal.food += 1;
		animal.sedated = true;
		animal.receivedFoodThisYear = true;
		log(state, `${owner.name}: лекарственное растение — животное накормлено, свойства не действуют до конца фазы.`);
		return;
	}
	giveFood(state, animal, 1, "red", {
		triggerComm: false,
		triggerCoop: true
	});
	triggerPartnerEffectsFromPlant(state, animal, plant);
	log(state, `${owner.name}: фишка с растения ${PLANTS[plant.kind].name} (осталось ${plant.food}).`);
	if (plantHasTrait(plant, "nutritious") && plant.food > 0) {
		plant.food -= 1;
		giveFood(state, animal, 1, "red", { triggerCoop: true });
		log(state, `Питательное растение: ещё одна фишка.`, "good");
	}
	if (plantHasTrait(plant, "honeyPlant")) stealHoneyCard(state, owner.id);
}
/**
* «Взаимодействие» от фишки с растения: напарник берёт вторую фишку с того же
* растения, но только если сам способен им питаться (правило «Растений»).
*/
function triggerPartnerEffectsFromPlant(state, source, plant) {
	for (const t of source.traits) {
		if (!isActive(t) || t.type !== "communication" || !t.pairWith) continue;
		const key = `communication:${t.cardId}`;
		if (firedPairs.has(key)) continue;
		const other = findAnimal(state, t.pairWith);
		if (!other || other.hibernating) continue;
		if (plant.food <= 0) continue;
		if (!canReceiveFood(state, other) || !canFeedOnPlant(state, other, plant)) continue;
		firedPairs.add(key);
		plant.food -= 1;
		giveFood(state, other, 1, "red", {
			triggerCoop: true,
			triggerComm: false
		});
		const op = ownerOf(state, other.id);
		ev(state, {
			kind: "plantFoodTaken",
			animalId: other.id,
			plantId: plant.id,
			playerId: op.id
		});
		log(state, `Взаимодействие: ${op.name} берёт фишку с того же растения.`);
	}
}
/** Медонос: взять случайную карту у игрока, у которого карт строго больше. */
function stealHoneyCard(state, playerId) {
	const me = player(state, playerId);
	const richer = state.players.filter((x) => x.id !== playerId && x.hand.length > me.hand.length);
	if (!richer.length) return;
	const target = richer.reduce((best, x) => x.hand.length > best.hand.length ? x : best, richer[0]);
	const idx = Math.floor(nextRandom(state) * target.hand.length);
	const [card] = target.hand.splice(idx, 1);
	if (!card) return;
	me.hand.push(card);
	ev(state, {
		kind: "cardStolen",
		fromPlayerId: target.id,
		toPlayerId: playerId
	});
	log(state, `Медонос: ${me.name} вытягивает карту у ${target.name}.`, "good");
}
/** «Растения»: взять фишку еды с растения; хищное растение контратакует. */
function feedTakePlant(state, animalId, plantId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const a = mustFind(state, animalId);
	const plant = mustFindPlant(state, plantId);
	if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
	if (!canFeedOnPlant(state, a, plant)) return;
	if (state.modules.continents) {
		const zone = plant.zoneId ?? "gondwana";
		if (state.turnTerritory && state.turnTerritory !== zone) return;
		state.turnTerritory = zone;
	}
	if (plant.kind === "carnivorous" && !plant.attackedThisYear) {
		plant.attackedThisYear = true;
		state.turnUse.foodTaken = true;
		const atk = {
			carnivoreId: plant.id,
			preyId: a.id,
			mimicryChain: [],
			waitingFor: p.id,
			usedDefenses: [],
			plantId: plant.id,
			plantCounter: true,
			plantRequesterId: a.id
		};
		state.pendingAttack = atk;
		ev(state, {
			kind: "plantAttack",
			plantId: plant.id,
			preyId: a.id,
			counter: true
		});
		log(state, `Хищное растение контратакует ${p.name}!`, "hunt");
		if (defenseOptions(a, atk).length === 0) resolveNoDefense(state);
		return;
	}
	state.turnUse.foodTaken = true;
	givePlantFood(state, a, plant);
	maybeEndTurn(state);
}
/**
* Взять фишку с карты флоры: еда идёт на животное, срабатывает способность
* карты, прилетает метка последствий; «Взаимодействие» даёт напарнику фишку
* с той же карты (со всеми её последствиями).
*/
function feedTakeFlora(state, animalId, floraId) {
	spendTurn(state, player(state, state.currentPlayerId).id);
	const a = mustFind(state, animalId);
	const f = mustFindFlora(state, floraId);
	if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
	if (!canFeedOnFlora(state, a, f) || !canReceiveFood(state, a)) return;
	if (state.modules.continents) {
		const zone = f.zoneId ?? "gondwana";
		if (state.turnTerritory && state.turnTerritory !== zone) return;
		state.turnTerritory = zone;
	}
	state.turnUse.foodTaken = true;
	takeFloraToken(state, a, f);
	maybeEndTurn(state);
}
/** Одна фишка с карты флоры: еда + способность + метка. */
function takeFloraToken(state, animal, flora) {
	if (flora.food <= 0) return;
	flora.food -= 1;
	const owner = ownerOf(state, animal.id);
	ev(state, {
		kind: "floraFoodTaken",
		animalId: animal.id,
		floraId: flora.id,
		playerId: owner.id
	});
	applyFloraAbility(state, animal, flora);
	giveFood(state, animal, 1, "red", {
		triggerComm: false,
		triggerCoop: true
	});
	triggerPartnerEffectsFromFlora(state, animal, flora);
	log(state, `${owner.name}: фишка с карты ${FLORA[flora.kind].name} (осталось ${flora.food}).`);
	const def = FLORA[flora.kind];
	if (def.mark) giveMark(state, animal, def.mark);
}
/**
* «Взаимодействие» от фишки с карты флоры: напарник берёт вторую фишку с той
* же карты — со всеми последствиями способности и меткой.
*/
function triggerPartnerEffectsFromFlora(state, source, flora) {
	for (const t of source.traits) {
		if (!isActive(t) || t.type !== "communication" || !t.pairWith) continue;
		const key = `communication:${t.cardId}`;
		if (firedPairs.has(key)) continue;
		const other = findAnimal(state, t.pairWith);
		if (!other || other.hibernating) continue;
		if (!canReceiveFood(state, other) || !canFeedOnFlora(state, other, flora)) continue;
		firedPairs.add(key);
		takeFloraToken(state, other, flora);
		log(state, `Взаимодействие: ${ownerOf(state, other.id).name} берёт фишку с той же карты флоры.`);
	}
}
/**
* Способность карты флоры при взятии фишки. Способности-метки (поганка,
* плесень, шляпка, мухомор, сон/трын/дурман/улыбнись-трава) разыгрываются
* через giveMark в takeFloraToken.
*/
function applyFloraAbility(state, animal, flora) {
	const owner = ownerOf(state, animal.id);
	switch (flora.kind) {
		case "insight":
			if (owner.hand.length) {
				const lost = owner.hand.length;
				owner.hand = [];
				ev(state, {
					kind: "handLost",
					playerId: owner.id
				});
				log(state, `Гриб прозрения: ${owner.name} сбрасывает всю руку (${lost} карт).`, "bad");
			}
			return;
		case "soaring": {
			let dropped = 0;
			for (const t of [...animal.traits]) {
				if (!t.pairWith) continue;
				const other = findAnimal(state, t.pairWith);
				if (other) other.traits = other.traits.filter((x) => x.cardId !== t.cardId);
				animal.traits = animal.traits.filter((x) => x.cardId !== t.cardId);
				dropped += 1;
			}
			if (dropped) {
				owner.discardCount += dropped;
				log(state, `Окрыляющий гриб: ${dropped} парных свойств уходят в сброс.`, "bad");
			}
			giveFood(state, animal, 1, "blue");
			ev(state, {
				kind: "blueFood",
				animalId: animal.id,
				reason: "soaring"
			});
			log(state, `Окрыляющий гриб: животное получает 1 синюю фишку.`, "good");
			return;
		}
		case "cleanser": {
			animal.food = Math.min(animal.food, 1);
			animal.blueFood = 0;
			const cleared = (animal.marks ?? []).length;
			returnMarksToPool(state, animal);
			log(state, `Очистительная трава: ${owner.name} оставляет одну фишку, прочие сняты${cleared ? `, меток снято: ${cleared}` : ""}.`, "bad");
			return;
		}
		case "passionflower": {
			const trait = [...animal.traits].reverse().find((t) => t.type !== "parasite" && t.type !== "neoplasia" && !t.pairWith && !t.disabled);
			if (!trait) return;
			animal.traits = animal.traits.filter((t) => t.id !== trait.id);
			state.playSeq += 1;
			const baby = {
				id: nid(state, "a"),
				ownerId: owner.id,
				cardId: trait.cardId,
				traits: [],
				food: 0,
				blueFood: 0,
				fatTokens: 0,
				hibernating: false,
				hibernatedLastYear: false,
				receivedFoodThisYear: false,
				poisoned: false,
				seed: trait.cardId.length * 17 + owner.id * 13,
				...animal.zoneId !== void 0 ? { zoneId: animal.zoneId } : {}
			};
			owner.animals.push(baby);
			ev(state, {
				kind: "animalPlaced",
				animalId: baby.id,
				ownerId: owner.id,
				zoneId: baby.zoneId
			});
			log(state, `Страстоцвет: свойство «${TRAITS[trait.type].name}» становится новым животным ${owner.name}.`, "good");
			return;
		}
		default: return;
	}
}
/** «Растения»: спрятать животное в убежище растения (вместо еды/атаки). */
function feedShelter(state, animalId, plantId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const a = mustFind(state, animalId);
	const plant = mustFindPlant(state, plantId);
	if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
	if (!canTakeShelterFrom(state, a, plant)) return;
	if (state.modules.continents) {
		const zone = plant.zoneId ?? "gondwana";
		if (state.turnTerritory && state.turnTerritory !== zone) return;
		state.turnTerritory = zone;
	}
	if (state.modules.randomMutations && hasTrait(a, "barkBeetle") && !isFed(a) && !hasTrait(a, "obligateCarnivore")) {
		state.turnUse.sheltered = true;
		giveFood(state, a, 1, "blue");
		ev(state, {
			kind: "blueFood",
			animalId: a.id,
			reason: "beetle"
		});
		log(state, `${p.name}: «Короед» — убежище превращается в синюю фишку еды.`, "bad");
		maybeEndTurn(state);
		return;
	}
	plant.shelters -= 1;
	a.sheltered = true;
	state.turnUse.sheltered = true;
	ev(state, {
		kind: "shelterTaken",
		animalId: a.id,
		plantId: plant.id
	});
	log(state, `${p.name}: животное прячется в убежище (${PLANTS[plant.kind].name}).`, "good");
	maybeEndTurn(state);
}
/** «Растения»: направить хищное растение на жертву — ход игрока. */
function feedPlantAttack(state, plantId, preyId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const plant = mustFindPlant(state, plantId);
	const prey = mustFind(state, preyId);
	if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
	if (plant.kind !== "carnivorous" || plant.attackedThisYear) return;
	if (!canPlantAttackTarget(state, plant, prey)) return;
	plant.attackedThisYear = true;
	state.turnUse.combatUsed = true;
	const atk = {
		carnivoreId: plant.id,
		preyId: prey.id,
		mimicryChain: [],
		waitingFor: prey.ownerId,
		usedDefenses: [],
		plantId: plant.id
	};
	state.pendingAttack = atk;
	ev(state, {
		kind: "plantAttack",
		plantId: plant.id,
		preyId: prey.id,
		counter: false
	});
	log(state, `${p.name} направляет хищное растение на животное ${ownerOf(state, prey.id).name}!`, "hunt");
	if (defenseOptions(prey, atk).length === 0) resolveNoDefense(state);
}
/** «Растения»: перекинуть фишку с растения-хозяина на растение-паразит. */
function feedParasitize(state, hostId, parasiteId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const host = mustFindPlant(state, hostId);
	const parasite = mustFindPlant(state, parasiteId);
	if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
	if (parasite.kind !== "parasite" || parasite.hostId !== host.id || host.food <= 1) return;
	host.food -= 1;
	parasite.food += 1;
	state.turnUse.foodTaken = true;
	log(state, `${p.name}: фишка переходит на растение-паразит.`);
	maybeEndTurn(state);
}
function feedHunt(state, carnivoreId, preyId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const carnivore = mustFind(state, carnivoreId);
	const prey = mustFind(state, preyId);
	if (state.rageTurn) {
		if (state.rageTurn.animalId !== carnivoreId) return;
		if (!canRageAttack(state, carnivore, prey)) return;
		state.rageTurn = null;
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
			usedDefenses: [],
			rage: true,
			ignoredTraitId: hazeIgnoreTraitId(state, carnivore, prey)
		};
		state.pendingAttack = atk;
		log(state, `Бешеное животное игрока ${p.name} атакует!`, "hunt");
		if (defenseOptions(prey, atk).length === 0) {
			resolveNoDefense(state);
			return;
		}
		return;
	}
	if (state.turnUse.foodTaken || state.turnUse.sheltered || state.turnUse.carnivores.includes(carnivoreId)) return;
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
		usedDefenses: [],
		ignoredTraitId: hazeIgnoreTraitId(state, carnivore, prey)
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
	if (state.turnUse.foodTaken || state.turnUse.sheltered || state.turnUse.pirates.includes(pirateId)) return;
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
/**
* Топотун — отдельное действие хода: уничтожает 1 фишку — с растения
* («Растения»: по правилам топчет то же растение, с которого ел; в нашей
* версии — любое растение своей территории) или из кормовой базы.
*/
function feedGraze(state, animalId, plantId, floraId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const a = mustFind(state, animalId);
	if (floraId && state.modules.fungi) {
		const f = mustFindFlora(state, floraId);
		if (!hasTrait(a, "grazing") || f.food <= 0 || state.turnUse.sheltered) {
			advanceFeed(state);
			return;
		}
		const before = f.food;
		f.food -= 1;
		state.turnUse.grazers.push(animalId);
		if (state.modules.continents) {
			const zone = f.zoneId ?? "gondwana";
			if (state.turnTerritory === void 0 || state.turnTerritory === zone) state.turnTerritory = zone;
		}
		ev(state, {
			kind: "floraGrazed",
			floraId: f.id,
			from: before,
			to: f.food
		});
		log(state, `${p.name}: топтун уничтожает фишку с карты ${FLORA[f.kind].name} (осталось ${f.food}).`);
		maybeEndTurn(state);
		return;
	}
	if (plantId && state.modules.plants) {
		const plant = mustFindPlant(state, plantId);
		if (!hasTrait(a, "grazing") || plant.food <= 0 || state.turnUse.sheltered) {
			advanceFeed(state);
			return;
		}
		const before = plant.food;
		plant.food -= 1;
		state.turnUse.grazers.push(animalId);
		if (state.modules.continents) {
			const zone = plant.zoneId ?? "gondwana";
			if (state.turnTerritory === void 0 || state.turnTerritory === zone) state.turnTerritory = zone;
		}
		ev(state, {
			kind: "plantGrazed",
			plantId: plant.id,
			from: before,
			to: plant.food
		});
		log(state, `${p.name}: топтун уничтожает фишку растения ${PLANTS[plant.kind].name} (осталось ${plant.food}).`);
		maybeEndTurn(state);
		return;
	}
	if (!hasTrait(a, "grazing") || bankOf(state, a.zoneId) <= 0 || state.turnUse.sheltered) {
		advanceFeed(state);
		return;
	}
	const burnBank = state.modules.randomMutations ? Math.min(a.population ?? 1, bankOf(state, a.zoneId)) : 1;
	takeFromBank(state, a.zoneId, burnBank);
	state.turnUse.grazers.push(animalId);
	ev(state, {
		kind: "bankBurned",
		amount: burnBank,
		territory: a.zoneId
	});
	log(state, `${p.name}: топотун уничтожает ${burnBank} ед. еды. База: ${bankOf(state, a.zoneId)}.`);
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
	state.migratedThisPhase = [...state.migratedThisPhase ?? [], ...applied.map((m) => m.animalId)];
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
	if (atk.plantId) {
		applyPlantDefense(state, action);
		return;
	}
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
			if (atk.rage) advanceFeed(state);
			else maybeEndTurn(state);
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
		if (!atk.rage && !hasTrait(carnivore, "obligateCarnivore")) {
			giveFood(state, carnivore, 1, "blue", { obligate: true });
			ev(state, {
				kind: "blueFood",
				animalId: carnivore.id,
				reason: "tailLoss"
			});
		}
		ev(state, {
			kind: "defenseUsed",
			defense: "tailLoss",
			preyId: atk.preyId
		});
		log(state, atk.rage ? "Отбрасывание хвоста: животное выжило — бешеное не получает фишку." : "Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.", "good");
		state.pendingAttack = null;
		if (atk.rage) advanceFeed(state);
		else maybeEndTurn(state);
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
* Защита против хищного растения: работает как с хищником, но добыча
* достаётся растению (фишками), а выживший проситель контратаки всё равно
* получает свою фишку еды.
*/
function applyPlantDefense(state, action) {
	const atk = state.pendingAttack;
	const plant = mustFindPlant(state, atk.plantId);
	const prey = findAnimal(state, atk.preyId);
	if (!prey) {
		state.pendingAttack = null;
		return;
	}
	const counter = Boolean(atk.plantCounter);
	const rewardSurvivor = () => {
		if (counter) {
			const req = findAnimal(state, atk.plantRequesterId ?? atk.preyId);
			if (req) givePlantFood(state, req, plant);
		}
		state.pendingAttack = null;
		maybeEndTurn(state);
	};
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
			rewardSurvivor();
			return;
		}
		log(state, `Быстрое: выпало ${roll} — растение настигло.`, "bad");
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
		log(state, "Мимикрия перенаправляет атаку растения.");
		if (defenseOptions(mustFind(state, atk.preyId), atk).length === 0) resolveNoDefense(state);
		return;
	}
	if (action.kind === "tailLoss") {
		const tail = prey.traits.find((t) => isActive(t) && t.type === "tailLoss");
		if (tail) {
			prey.traits = prey.traits.filter((t) => t.cardId !== tail.cardId);
			ownerOf(state, prey.id).discardCount += 1;
		}
		plant.food = Math.min(PLANTS.carnivorous.maxFood, plant.food + 1);
		ev(state, {
			kind: "defenseUsed",
			defense: "tailLoss",
			preyId: atk.preyId
		});
		log(state, "Отбрасывание хвоста: животное выжило, растение получило 1 фишку.", "good");
		rewardSurvivor();
		return;
	}
	ev(state, {
		kind: "defenseUsed",
		defense: "none",
		preyId: atk.preyId
	});
	resolveNoDefense(state);
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
	if (state.modules.randomMutations) for (const a of allAnimals(state)) {
		if (a.hibernating) continue;
		if (a.poisoned && !hasMark(a, "antidote") && (a.population ?? 1) > 1) {
			a.population = (a.population ?? 1) - 1;
			a.poisoned = false;
			a.food = Math.min(a.food, speciesNeed(a));
			ev(state, {
				kind: "populationLost",
				animalId: a.id,
				to: a.population
			});
			log(state, `Вид ${ownerOf(state, a.id).name} теряет животное от яда (осталось ${a.population}).`, "bad");
			continue;
		}
		const deficit = speciesNeed(a) - a.food;
		if (deficit <= 0 || deficit >= (a.population ?? 1)) continue;
		a.population = (a.population ?? 1) - deficit;
		a.food = Math.min(a.food, speciesNeed(a));
		ev(state, {
			kind: "populationLost",
			animalId: a.id,
			to: a.population
		});
		log(state, `Вид ${ownerOf(state, a.id).name} теряет ${deficit} животное(-ых) от голода (осталось ${a.population}).`, "bad");
	}
	const doomed = allAnimals(state).filter((a) => a.poisoned && !hasMark(a, "antidote") || hasMark(a, "poison") && !hasMark(a, "antidote") || !isFed(a));
	for (const a of allAnimals(state)) if (doomed.some((d) => d.id === a.id)) state.extinctionDeaths.push(a.id);
	for (const id of state.extinctionDeaths) {
		const a = findAnimal(state, id);
		if (!a) continue;
		const p = ownerOf(state, id);
		log(state, a.poisoned ? `Хищник ${p.name} погибает от яда.` : hasMark(a, "poison") && !hasMark(a, "antidote") ? `Животное ${p.name} погибает от метки «Яд».` : `Животное ${p.name} вымирает — не накормлено.`, "bad");
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
		a.sheltered = false;
		a.sedated = false;
		returnMarksToPool(state, a);
	}
	if (state.modules.fungi) refreshFlora(state);
	if (state.modules.plants) {
		removeDeadPlants(state);
		if (state.lastYear || state.deck.length === 0 && state.deckEmptyAfterDraw) {
			finishGame(state);
			return;
		}
		applyGrowth(state);
		state.phase = "growth";
		return;
	}
	if (state.lastYear || state.deck.length === 0 && state.deckEmptyAfterDraw) {
		finishGame(state);
		return;
	}
	drawCards(state);
}
/**
* Вымирание растений: погибают съеденные дочиста (кроме однолетника и
* паразита) и отравившиеся; связка микоризы выживает, если хоть у одного
* растения в ней осталась пища (выжившие пустышки получат фишку в конце
* роста). Паразиты гибнут вместе с хозяином.
*/
function removeDeadPlants(state) {
	const plants = state.plants ?? [];
	if (!plants.length) return;
	const byId = new Map(plants.map((p) => [p.id, p]));
	const dead = /* @__PURE__ */ new Set();
	for (const pl of plants) if (pl.doomed) dead.add(pl.id);
	const parent = new Map(plants.map((p) => [p.id, p.id]));
	const find = (x) => {
		let r = x;
		while (parent.get(r) !== r) r = parent.get(r);
		return r;
	};
	const union = (x, y) => {
		const rx = find(x);
		const ry = find(y);
		if (rx !== ry) parent.set(rx, ry);
	};
	for (const pl of plants) for (const t of pl.traits) if (t.type === "micorrhiza" && t.pairWith && byId.has(t.pairWith)) union(pl.id, t.pairWith);
	const compHasFood = /* @__PURE__ */ new Set();
	for (const pl of plants) if (pl.food > 0) compHasFood.add(find(pl.id));
	for (const pl of plants) {
		if (dead.has(pl.id) || pl.food > 0) continue;
		if (pl.kind === "annual") continue;
		if (pl.kind === "parasite") continue;
		if (plantHasTrait(pl, "micorrhiza") && compHasFood.has(find(pl.id))) {
			pl.starvedRevive = true;
			continue;
		}
		dead.add(pl.id);
	}
	let cascaded = true;
	while (cascaded) {
		cascaded = false;
		for (const pl of plants) {
			if (dead.has(pl.id) || pl.kind !== "parasite" || !pl.hostId) continue;
			const host = byId.get(pl.hostId);
			if (host && dead.has(host.id)) {
				dead.add(pl.id);
				cascaded = true;
			}
		}
	}
	for (const id of dead) {
		const pl = byId.get(id);
		ev(state, {
			kind: "plantDied",
			plantId: id,
			cause: pl.doomed ? "poison" : pl.kind === "parasite" ? "host" : "eaten"
		});
		log(state, `Растение ${PLANTS[pl.kind].name} погибает${pl.doomed ? " — съело ядовитое животное" : pl.kind === "parasite" ? " — вместе с хозяином" : " — съедено дочиста"}.`, "bad");
	}
	if (dead.size) {
		state.plants = plants.filter((p) => !dead.has(p.id));
		state.plantDiscard = (state.plantDiscard ?? 0) + dead.size;
	}
}
/**
* Вымирание флоры «Травы и грибов»: карты без красных фишек уходят в сброс,
* каждая выжившая ТРАВА (не гриб) получает 1 фишку (максимум 4). Эдификаторы
* «Континентов» добавляют по фишке каждой карте флоры своей локации — аналог
* удобрения растений из главы «Континенты + Растения» официального FAQ.
*/
function refreshFlora(state) {
	const flora = state.flora ?? [];
	const dead = /* @__PURE__ */ new Set();
	for (const f of flora) if (f.food <= 0) dead.add(f.id);
	for (const id of dead) {
		const f = flora.find((x) => x.id === id);
		ev(state, {
			kind: "floraDied",
			floraId: id
		});
		log(state, `Карта ${FLORA[f.kind].name} без фишек уходит в сброс.`, "bad");
	}
	if (dead.size) {
		state.flora = flora.filter((f) => !dead.has(f.id));
		state.floraDiscard = (state.floraDiscard ?? 0) + dead.size;
	}
	for (const f of state.flora ?? []) {
		if (FLORA[f.kind].isFungus) continue;
		if (f.food < 4) {
			const before = f.food;
			f.food += 1;
			ev(state, {
				kind: "floraGrew",
				floraId: f.id,
				from: before,
				to: f.food
			});
		}
	}
	if (state.modules.continents) for (const a of allAnimals(state)) {
		if (a.hibernating) continue;
		if (!a.traits.some((t) => t.type === "edificator" && isActive(t))) continue;
		const zone = a.zoneId ?? "laurasia";
		if (zone === "ocean") continue;
		for (const f of state.flora ?? []) {
			if ((f.zoneId ?? "gondwana") !== zone) continue;
			if (f.food < 4) f.food += 1;
		}
		log(state, `Эдификатор удобряет флору ${zone === "laurasia" ? "Лавразии" : "Гондваны"}.`, "good");
	}
	log(state, "Флора: травы подрастают, пустые карты уходят в сброс.", "good");
}
/**
* Фаза роста: каждое растение разрастается по своей схеме, лиана — по числу
* не-лиан, выжившие пустышки микоризы получают фишку, убежища
* восстанавливаются, эдификаторы удобряют растения локации, добавляются
* новые растения из колоды.
*/
function applyGrowth(state) {
	const plants = state.plants ?? [];
	for (const pl of plants) {
		const def = PLANTS[pl.kind];
		const before = pl.food;
		if (pl.kind === "liana") {
			const others = plants.filter((p) => p.kind !== "liana").length;
			pl.food = Math.min(def.maxFood, others);
		} else if (pl.kind === "fungus" || pl.kind === "carnivorous" || pl.kind === "parasite") {} else pl.food = growthTarget(def, pl.food);
		if (pl.food !== before) ev(state, {
			kind: "plantGrew",
			plantId: pl.id,
			from: before,
			to: pl.food
		});
	}
	for (const pl of plants) if (pl.starvedRevive && pl.food === 0) {
		pl.food = 1;
		pl.starvedRevive = false;
		ev(state, {
			kind: "plantGrew",
			plantId: pl.id,
			from: 0,
			to: 1
		});
	} else pl.starvedRevive = false;
	for (const pl of plants) {
		pl.shelters = shelterCapacity(pl);
		pl.attackedThisYear = false;
		pl.doomed = false;
	}
	if (state.modules.continents) for (const a of allAnimals(state)) {
		if (a.hibernating) continue;
		if (!a.traits.some((t) => t.type === "edificator" && isActive(t))) continue;
		const zone = a.zoneId ?? "laurasia";
		if (zone === "ocean") continue;
		for (const pl of plants) {
			if ((pl.zoneId ?? "gondwana") !== zone) continue;
			if (pl.food < PLANTS[pl.kind].maxFood) pl.food += 1;
		}
		log(state, `Эдификатор удобряет растения ${zone === "laurasia" ? "Лавразии" : "Гондваны"}.`, "good");
	}
	addNewPlants(state, plantTable(state.players.length).add);
	log(state, "Фаза роста: растения разрастаются.", "good");
}
/** Действие continueGrowth: показать рост и начать новый год (добор карт). */
function continueGrowth(state) {
	if (state.phase !== "growth") return;
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
		const card = p.hand.length ? p.hand.pop() : p.blindDeck?.length ? p.blindDeck.pop() : state.deck.pop();
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
		if (state.modules.randomMutations) {
			const pop = p.animals.reduce((s, a) => s + (a.population ?? 1), 0);
			let want = Math.max(1, pop - (regeneratedThisYear.get(p.id) ?? 0) + 2);
			if (p.animals.length === 0 && (p.blindDeck ?? []).length === 0) {
				if (state.modules.continents) {
					for (let i = 0; i < 10; i++) {
						const c = state.deck.pop();
						if (!c) {
							emptied = true;
							break;
						}
						p.blindDeck.push(c);
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
				p.blindDeck.unshift(c);
				counts[idx] += 1;
			}
			continue;
		}
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
	startMutationsDevTurn(state, state.firstPlayerId);
}
/** «10 карт»: две из них сразу становятся животными — по одному на континент. */
function playRescueAnimal(state, p, zone) {
	const card = state.modules.randomMutations ? p.blindDeck?.pop() : p.hand.shift();
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
		population: 1,
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
			animals += 2 * (a.population ?? 1);
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
	if (state.modules.fungi && state.flora) {
		const cards = state.flora.length;
		const food = state.flora.reduce((s, f) => s + f.food, 0);
		const total = cards * 2 + food;
		state.scores.push({
			playerId: -1,
			name: "Трава и грибы",
			animals: cards * 2,
			traits: 0,
			extras: food,
			total,
			discard: state.floraDiscard ?? 0
		});
		if (total >= best.total) {
			state.winnerIds = [-1];
			log(state, `Победа: Трава и грибы (${total} очков).`, "good");
			state.phase = "gameOver";
			return;
		}
	}
	state.phase = "gameOver";
	log(state, winners.length > 1 ? `Ничья: ${winners.map((w) => w.name).join(", ")}.` : `Победа: ${winners[0].name} (${winners[0].total} очков).`, "good");
}
function currentActor(state) {
	if (state.phase === "gameOver") return null;
	if (state.pendingAttack) return player(state, state.pendingAttack.waitingFor);
	if (state.phase === "foodBank" || state.phase === "extinction" || state.phase === "growth") return null;
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
	const stock = state.modules.randomMutations ? p.blindDeck?.length ?? 0 : p.hand.length;
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
export { legalFeedActions as A, foodNeeded as C, joinRoomInput as D, isFed as E, player as M, pollInput as N, legalDefenseActions as O, speciesNeed as P, findAnimal as S, isCarnivoreLike as T, chooseAIAction as _, MUTATIONS_TRAIT_IDS as a, createRoomInput as b, PLANTS_TRAIT_IDS as c, actionInput as d, applyAction as f, canRageAttack as g, canPlantAttackTarget as h, MARKS as i, liveScore as j, legalDevActions as k, TRAITS as l, canAttack as m, FLORA as n, PACE as o, botsInput as p, FUNGI_TRAIT_IDS as r, PLANTS as s, CONTINENTS_TRAIT_IDS as t, TRAIT_ORDER as u, codeTokenInput as v, hasTrait as w, currentActor as x, createGame as y };
