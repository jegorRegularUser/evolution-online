//#region node_modules/.nitro/vite/services/ssr/assets/types-BR4PMx1a.js
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
		description: "Взявший фишку животное получает метку «Безумие»: в начале следующего раунда фазы питания его владелец снимает метку. В этот раунд его животными управляет бот; сосед не участвует — в онлайн-версии пока не реализовано управление соседом справа.",
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
		description: "Взяв фишку, владелец животного сбрасывает все карты из руки в сброс. Просмотр чужих карт (по настольному правилу) в онлайн-версии пока не реализован.",
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
		description: "В начале следующего раунда фазы питания владелец снимает метку с одного своего животного. В этот раунд его животными управляет бот; сосед не участвует — в онлайн-версии пока не реализовано управление соседом справа.",
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
		description: "Разрастается по схеме 1→2, 2→3, 3+→5 (максимум 5). Появляется с 2 фишками (карта на иллюстрации №1 правил).",
		startFood: 2,
		maxFood: 5,
		growth: [
			[3, 5],
			[2, 3],
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
		description: "Всякий раз, когда погибает любое животное, на каждом грибе появляется 1 фишка (максимум 4 красных фишки, увеличенный фрагмент иллюстрации №2 правил). Появляется с 1 фишкой (та же иллюстрация). Хищники могут брать с него еду.",
		startFood: 1,
		maxFood: 4,
		growth: [],
		shelters: 0,
		carnivoreEdible: true,
		aiValue: 3
	},
	carnivorous: {
		kind: "carnivorous",
		name: "Хищное",
		description: "Раз в фазу питания атакует: контратакует животное, тянущее с него еду (игнорируя одну его защиту), либо один из игроков направляет его на любое животное. Съело животное — 2 фишки, получило хвост — 1. Съело ядовитое — погибает в вымирание. Максимум 6 фишек, стартует пустым. Хищники могут брать с него еду.",
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
var TRAITS = {
	carnivore: {
		id: "carnivore",
		name: "Хищник",
		short: "Хищник",
		description: "Вместо еды хищник нападает на другое животное и при успехе получает 2 синие фишки. Охота и еда из базы в одном ходу не сочетаются, каждый хищник атакует раз за ход. Накормленный хищник не охотится. Потребность в еде +1.",
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
		description: "Съесть это животное может только водоплавающий хищник, но и сам водоплавающий хищник охотится только на водоплавающих. С «Континентами» животное сразу уезжает в Океан.",
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
		description: "Хищник это животное не видит: напасть может только хищник с «Острым зрением».",
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
		description: "Замечает замаскированных: хищник с острым зрением может нападать на животных с «Камуфляжем».",
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
		description: "Пока животное накормлено, хищники его не трогают. Жировой запас сытостью не считается: голодное животное в норе беззащитно.",
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
		description: "Когда любой хищник целиком съедает животное, один падальщик на столе получает 1 синюю фишку: ищут по кругу, начиная с владельца хищника. С «Хищником» и «Облигатным хищником» не сочетается.",
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
		description: "Карта кладётся между двумя вашими животными. Первое животное, симбионт, охраняет второе: пока симбионт жив, второе никто не съест, но и кормить второе можно только после того, как наелся симбионт.",
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
		description: "Раз за ход голодный пират крадёт 1 фишку у любого не накормленного животного, своего или чужого. Цвет фишки сохраняется; после кражи еда из базы в этот ход недоступна. Накормленный пират не ворует.",
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
		description: "Когда на животное напали, сбросьте эту карту: животное выживает, а хищник получает 1 синюю фишку вместо двух. Спасает и от хищного растения.",
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
		description: "Раз за свой ход животное может затоптать 1 фишку еды: из кормовой базы, с растения или карты флоры. Топтать можно и в тот ход, когда берёте еду.",
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
		description: "Карта между двумя животными: когда одно получает еду (из базы, с охоты, краденую), второе сразу получает 1 синюю фишку. Перевод жира в еду эффекта не запускает.",
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
		description: "При нападении бросьте кубик: 4, 5 или 6, и животное убегает. Атака хищника потрачена зря: до конца этого хода он не охотится (в следующий ход сможет снова).",
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
		description: "Съесть это животное может только хищник, у которого тоже есть «Большой». Потребность в еде +1.",
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
		description: "Кладётся только на чужое животное. Его потребность в еде +2, а в конце игры 2 дополнительных очка достанутся хозяину животного.",
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
		description: "Единственное свойство, которое можно класть на животное многократно. Лишняя еда сытого животного уходит в жир, по фишке на каждую карту. Голодное животное в любой момент превращает жир в синие фишки: это свободное действие, ход не тратится.",
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
		description: "Карта между двумя животными: когда одно берёт красную фишку из кормовой базы, второе тут же берёт свою. С «Растениями» и «Травой и грибами» напарник берёт фишку с того же растения или карты флоры.",
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
		description: "Хищник, целиком съевший это животное, отравлен и погибнет в фазу вымирания. За один лишь хвост или добычу «Насекомоядного» хищник не травится.",
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
		description: "Животное засыпает и до конца года считается накормленным: еду больше не берёт даже в жировой запас. Нельзя спать два года подряд и в последний год; за ход в спячку уходит только одно ваше животное.",
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
		description: "Когда хищник напал, направьте его на другое своё животное, которое он мог бы съесть. Перенаправлять можно по цепочке, но уже спасавшееся от этой атаки животное второй раз не спасается.",
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
		description: "Объявляется вместо обычного хода: в этот ход только переезды, ни еды, ни охоты. Ваши животные с этим свойством едут из Океана на любой континент, а с континента в Океан (только водоплавающие). Напрямую между континентами проехать нельзя; каждое животное мигрирует раз за фазу питания.",
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
		description: "Сама по себе не переезжает. Когда объявлена миграция, каждая прилипала той же местности может уехать следом за мигрантом — по решению владельца, в порядке хода. В Океане следуют только водоплавающие. Спящие прилипалы остаются на месте.",
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
		description: "Стадных нельзя атаковать, пока их на одной территории не меньше, чем хищников. Пересчёт общий: все стадные, даже чужие, против всех хищников и хищных растений этой территории.",
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
		description: "Даже при неудачной атаке у напавшего хищника до конца фазы питания отключаются все свойства, а потребность в еде становится равной 1. Карты сохраняются; после проверки голода свойства восстанавливаются. Если нападение случилось в Океане, парализованного хищника ещё и выбрасывает на континент.",
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
		description: "Кладётся только на животное без свойств или с одним свойством, не повышающим потребность. Повышать потребность такому животному дальше нельзя, всего свойств у него будет не больше двух. Съеденное хищником животное вернётся в игру: в фазу вымирания вы выложите карту из руки (или из колоды) новым животным, добора карт за него не будет.",
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
		description: "Парная карта между двумя животными одной территории. Раз за год, в свой ход питания, партнёры отдают друг другу по одному непарному свойству; одинаковые свойства у одного животного запрещены — дубль уходит в сброс. Одноразовое свойство, уже использованное прежним владельцем (спячка — в этом году, пиратство/топтун — в этом ходу), повторно не работает. Если животное потеряло «Водоплавающее» в Океане — переселите его на континент.",
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
		description: "Каждый эдификатор ежегодно добавляет 2 фишки еды в базу континента, на котором стоит; стоящий в Океане кормит базу Океана. С «Растениями» и «Травой и грибами» эдификаторы континентов вместо этого удобряют растения и флору своей местности: по фишке каждой карте. Спящий эдификатор ничего не добавляет.",
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
		description: "Вирус: кладётся только на чужое животное, под все свойства. Каждый год при определении кормовой базы поднимается и выключает очередное непарное свойство (парные не трогает). Выключенное не работает и очков не даёт; когда выключать станет нечего, животное немедленно погибает. «Водоплавающее» в Океане вирус не трогает.",
		isPair: false,
		opponentOnly: true,
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
		description: "Свойство растения. Кормиться с него могут только водоплавающие животные.",
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
		description: "Свойство растения. Приносит на растение 3 жетона убежища. Животное под убежищем никто не трогает до конца фазы питания: ни хищники, ни хищные растения.",
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
		description: "Свойство растения. Вкусные корешки достанутся только норным животным.",
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
		description: "Свойство растения. Животное получает фишку, но до конца фазы питания усыплено: его свойства не действуют, спасти может только жетон убежища. Сытому животному фишка уйдёт в жировой запас.",
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
		description: "Свойство растения. Селится на растение-хозяина и живёт как отдельное растение: со своими свойствами и даже своими паразитами. В свой ход вместо еды можно перекинуть с хозяина на паразита 1 фишку (не последнюю). Без фишек паразит выживает, а без хозяина гибнет; в максимум растений на столе он не входит.",
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
		description: "Свойство двух растений сразу, кладётся между ними. Связка не гибнет от голода, пока хотя бы на одном её растении осталась еда, а опустевшие растения получают по фишке в конце фазы роста. Одно растение можно связать с несколькими.",
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
		description: "Свойство растения. Ветви высоко: еду с него берут только большие животные. Приносит на растение 1 жетон убежища.",
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
		description: "Свойство растения. Взяв фишку, животное получает ещё одну. Хищникам с этого растения есть можно.",
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
		description: "Свойство растения. Ваше животное поело и вытягивает случайную карту у соперника с самой полной рукой, если у того карт больше, чем у вас. Таких соперников нет: карта не достаётся.",
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
		description: "Хищник не трогает это животное, пока на нём нет ни красной, ни синей фишки. Жировой запас не считается.",
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
		description: "Мелкая добыча: за животное без свойств (в том числе с меткой «Сон») хищник получает 1 синюю фишку вместо двух.",
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
		description: "Охотится раз в ход и кормится только добычей: из кормовой базы, с растений и чужих свойств еду не берёт, зато удачная атака сразу наедает его досыта. Потребность в еде +1. С «Хищником» и «Падальщиком» не сочетается.",
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
		description: "Один раз за год в начале вашего хода фазы развития вид почкует ещё одно животное: карта на него уходит из личной колоды. Обычный предел численности «не больше числа ваших видов» почкование обходит.",
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
		description: "Вредная мутация: обмен веществ слишком быстрый, каждое животное вида требует на 2 фишки еды больше. Зато в конце игры мутация приносит 2 дополнительных очка.",
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
		description: "Вредная мутация. Голодное животное прятаться в убежище не может: вместо защиты оно получает синюю фишку еды, а жетон остаётся на растении. Накормленным животным и облигатным хищникам убежище работает как положено.",
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
		description: "Вредная мутация. Рост вида в цене: каждое новое животное стоит дополнительную карту, она уходит из личной колоды в сброс. Если в колоде осталась одна карта, животное не добавить.",
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
		description: "Вредная мутация. Хищник, напавший на этот вид, игнорирует одно его свойство: онлайн-версия сама гасит ту защиту, которая сильнее всего мешает атаке.",
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
		description: "Вредная мутация. Последнее сыгранное на вид свойство отделяется и становится новым видом-мутантом, а сама карта «Упрощение» ложится ещё одним видом.",
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
//#endregion
export { MUTATIONS_TRAIT_IDS as a, TERRITORIES as c, floraDeckKinds as d, fullMarksPool as f, shelterCapacity as g, plantTable as h, MARKS as i, TRAITS as l, plantDeckKinds as m, FLORA as n, PLANTS as o, growthTarget as p, FUNGI_TRAIT_IDS as r, PLANTS_TRAIT_IDS as s, CONTINENTS_TRAIT_IDS as t, TRAIT_ORDER as u };
