import { c as TERRITORIES, d as floraDeckKinds, f as fullMarksPool, g as shelterCapacity, h as plantTable, i as MARKS, l as TRAITS, m as plantDeckKinds, n as FLORA, o as PLANTS, p as growthTarget } from "./types-BR4PMx1a.mjs";
import { a as number, c as union, i as literal, n as boolean, o as object, r as custom, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/module-compatibility-B0RnAr8M.js
/**
* Общий контракт сетевой партии: типы кадров опроса, zod-схемы входа и
* серверные константы темпа. Импортируется и клиентом, и сервером;
* единственный игровой тип здесь — сам GameState.
*/
/**
* Палитра мест — шестнадцать контрастных семейств под тёмную тему «атласа».
* Единственный источник цвета для сетевых столов (сервер пишет его в
* evo_seats.color) и для соло-партии: клиент раскрашивает игроков по индексу
* места тем же набором. Цвет — публичная информация, маскировать его не нужно.
*
* Цвет эксклюзивен в пределах стола: сервер выдаёт при входе только свободный
* (pickColor в server.ts) и отказывает в смене на занятый (setColor, код
* color-taken) — за столом максимум 8 мест, поэтому 16 цветов хватает с запасом.
*
* Первые восемь — прежняя палитра (обратная совместимость старых строк БД):
* терракота 45°, янтарь 83°, олива 121°, изумруд 158°, бирюза 200°, синий
* 256°, фиолет 303°, малина 352°. Вторые восемь — «между» ними по тону,
* с разведением по светлоте: коралл 13°, песок 56°, лайм 112°, мята 146°,
* морская волна 184°, небесный 240°, лаванда 270°, фуксия 318°.
*
* Набор подобран так, чтобы цвета различались и по тону, и по светлоте
* (различимость при дальтонизме — симуляция протанопии/дейтеранопии/
* тританопии по Machado 2009), читались на тёмной подложке и выдерживали
* контраст текста ≥ 4.5:1 на подложке места — `color-mix(in oklab, <цвет>
* 12%, var(--color-surface))` (см. seatTint в game-app):
* — OKLCH-светлота от 0.649 (фуксия) до 0.856 (песок/лайм/морская волна) —
*   разница по светлоте сохраняется и при нарушении цветовосприятия;
* — контраст на 12%-подложке от 4.5:1 (фуксия) до 8.8:1 (морская волна),
*   на самой подложке --color-surface — от 5.2:1 до 11.2:1;
* — минимум попарного OKLab-расстояния: 0.064 в норме, 0.057 при протанопии,
*   0.049 при дейтеранопии, 0.055 при тританопии — добавление восьми новых
*   цветов не снизило различимость исходной восьмёрки (её минимумы:
*   0.049 дейтеранопия и 0.055 тританопия — пары янтарь/олива и изумруд/синий).
* Тип PlayerColor, zod-enum и colorForSeat выводятся из массива: правки
* в других местах не нужны — меняется только сам список.
*/
var PLAYER_COLORS = [
	"#e27641",
	"#daa83b",
	"#b2ca6a",
	"#42bc80",
	"#52d0d6",
	"#5697ed",
	"#c9a1fe",
	"#f17cb3",
	"#ffa3ad",
	"#f9c39d",
	"#d2d959",
	"#63a068",
	"#11efda",
	"#81accb",
	"#b6c8ff",
	"#ba79cf"
];
/** Цвет места: у старых строк его нет — детерминированно берём из палитры. */
function colorForSeat(seat, stored) {
	if (stored && stored.trim()) return stored;
	return PLAYER_COLORS[Math.abs(seat) % PLAYER_COLORS.length];
}
/** Набор реакций стола (захардкожен и на сервере — см. reactionInput). */
var REACTION_EMOJI = [
	"👏",
	"🌿",
	"🔥",
	"😮",
	"💚"
];
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
	roomTtlHours: 12,
	/**
	* M10: ход человека без действий (остался только пас/завершение хода)
	* сервер заканчивает сам через столько миллисекунд. Пока действия есть —
	* таймера нет (решение владельца Q2). Константа общая с клиентом: по ней
	* клиент считает долю кругового индикатора.
	*/
	idleTurnMs: 3e4
};
var NAME = string().trim().min(1).max(16);
/**
* Алфавит кодов комнат: без похожих I/L/O/0/1 — код диктуют голосом и
* пересылают в мессенджере. Единственный источник и для генерации
* (makeCode в server.ts), и для валидации входа (S11: раньше пропускались
* любые 4 символа — код уезжал в URL и localStorage как есть).
*/
var CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";
var CODE = string().trim().length(4).regex(new RegExp(`^[${CODE_ALPHABET}]{4}$`), { message: "Код стола — 4 буквы (латиница без I, L, O)" });
var DIFFICULTY = _enum([
	"easy",
	"normal",
	"hard"
]);
var MODULES = object({
	continents: boolean().optional(),
	plants: boolean().optional(),
	fungi: boolean().optional(),
	randomMutations: boolean().optional()
}).partial();
/** Настройки стола: модули проверяются белым списком. */
var roomSettingsSchema = object({
	modules: MODULES.optional(),
	difficulty: DIFFICULTY.optional(),
	/** Границы — разумная вилка вокруг DECK_SIZE (84) с учётом всех модулей. */
	deckSize: number().int().min(20).max(400).optional()
});
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
	difficulty: DIFFICULTY,
	/** Включённые дополнения; ключи валидируются строго (белый список). */
	modules: MODULES.default({}).optional(),
	/** Целевой размер колоды на старте; хранится в settings комнаты. */
	deckSize: number().int().min(20).max(400).optional(),
	/** Приватный стол: вход по паролю, в меню виден в колонке «Закрытые». */
	isPrivate: boolean().optional(),
	/** Пароль приватного стола; пусто — сервер сгенерирует 4 цифры. */
	password: string().trim().max(16).optional()
});
var joinRoomInput = object({
	code: CODE,
	name: NAME,
	/**
	* Пароль нужен ТОЛЬКО чтобы сесть за стол. Длина не фиксирована: неверный
	* пароль должен получить машиночитаемый `password-wrong` с понятным
	* текстом, а не ошибку валидации схемы.
	*/
	password: string().trim().max(16).optional()
});
var codeTokenInput = object({
	code: CODE,
	token: string().min(10)
});
/** Смена имени в лобби/очереди/у зрителя: та же валидация, что у входа. */
var setNameInput = codeTokenInput.extend({ name: NAME });
var botsInput = codeTokenInput.extend({ count: number().int().min(0).max(7) });
var actionInput = object({
	code: CODE,
	token: string().min(10),
	action: custom((v) => typeof v === "object" && v !== null && "type" in v)
});
var pollInput = codeTokenInput.extend({
	sinceVersion: number().int().optional(),
	sinceChatId: number().int().optional(),
	sinceReactionId: number().int().optional()
});
var roomInfoInput = codeTokenInput.extend({
	sinceChatId: number().int().optional(),
	sinceReactionId: number().int().optional()
});
var spectateInput = object({
	code: CODE,
	name: NAME,
	/**
	* Пароль приватного стола (S5): наблюдать закрытый стол без пароля нельзя —
	* тот же механизм, что у join. Для открытого стола поле не нужно.
	*/
	password: string().trim().max(16).optional()
});
var spectatorPollInput = codeTokenInput.extend({
	sinceChatId: number().int().optional(),
	sinceReactionId: number().int().optional()
});
var reactionInput = codeTokenInput.extend({
	emoji: _enum(REACTION_EMOJI),
	kind: _enum(["reaction", "cheer"]),
	targetSeat: number().int().min(0).max(7).nullable().optional(),
	/**
	* Реакция на конкретную реплику чата (M12): сервер проверит, что сообщение
	* принадлежит ЭТОЙ комнате. Без chatId — прежняя реакция «в стол»/игроку.
	*/
	chatId: number().int().positive().nullable().optional()
});
/** Сигнал «печатает…»: только факт свежести, самого текста сервер не видит. */
var typingInput = codeTokenInput;
var kickInput = codeTokenInput.extend({ seat: number().int().min(0).max(7) });
var capacityInput = codeTokenInput.extend({ capacity: number().int().min(2).max(8) });
var settingsInput = codeTokenInput.extend({ settings: roomSettingsSchema });
/** Доступ к столу: приватность и (опционально) новый пароль. */
var setRoomPrivacyInput = codeTokenInput.extend({
	isPrivate: boolean(),
	regenerate: boolean().optional()
});
/**
* Смена пароля стола хостом (только лобби): ровно ROOM_PASSWORD_LEN цифр —
* тот же формат, что у сгенерированного пароля (его диктуют голосом).
*/
var setPasswordInput = codeTokenInput.extend({ password: string().trim().regex(new RegExp(`^\\d{4}$`), { message: `Пароль стола — 4 цифры` }) });
/** Смена цвета своего места — только из палитры PLAYER_COLORS. */
var setColorInput = codeTokenInput.extend({ color: _enum(PLAYER_COLORS) });
/** Пустой валидатор листинга: createServerFn требует схему даже без полей. */
var listRoomsInput = object({});
var transferHostInput = codeTokenInput.extend({ seat: number().int().min(0).max(7) });
var kickWaiterInput = codeTokenInput.extend({ index: number().int().min(0).max(99) });
/** Верхняя граница выше лимита в 400 символов: сервер обрезает, а не ругается. */
var chatInput = codeTokenInput.extend({ text: string().trim().min(1).max(2e3) });
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
/** Сколько копий карты нужно при масштабе: минимум одна на уникальную карту. */
function scaledCount(n, scale) {
	return Math.max(1, Math.round(n * scale));
}
/**
* Состав колоды с учётом включённых дополнений: грани карты и число копий.
* Порядок групп — как в физической колоде (база, «Континенты», «Растения»,
* «Трава и грибы», «Случайные мутации»).
*/
function deckEntries(modules) {
	const entries = [];
	for (const [trait, n] of SINGLES) entries.push([[trait], n]);
	for (const [a, b, n] of DUALS) entries.push([[a, b], n]);
	if (modules?.continents) {
		for (const [trait, n] of CONTINENTS_SINGLES) if (!modules.randomMutations || trait === "herding" || trait === "edificator") entries.push([[trait], n]);
		if (!modules.randomMutations) {
			for (const [a, b, n] of CONTINENTS_DUALS) entries.push([[a, b], n]);
			for (const [trait, n] of CONTINENTS_PAIRS) entries.push([[trait], n]);
		}
	}
	if (modules?.plants) for (const [a, b, n] of PLANTS_DUALS) entries.push([[a, b], n]);
	if (modules?.fungi) for (const [trait, n] of FUNGI_SINGLES) entries.push([[trait], n]);
	if (modules?.randomMutations) for (const [trait, n] of MUTATIONS_SINGLES) entries.push([[trait], n]);
	return entries;
}
/**
* Ожидаемый размер колоды при заданном масштабе — для UI (показать число карт)
* и для точной подгонки: scale = желаемый размер / deckSizeFor(1, modules).
*/
function deckSizeFor(scale, modules) {
	return deckEntries(modules).reduce((sum, [, n]) => sum + scaledCount(n, scale), 0);
}
/**
* Собрать колоду. scale < 1 уменьшает число копий (минимум 1 на уникальную
* карту), scale > 1 — увеличивает; по умолчанию колода полного состава.
*/
function buildDeck(nextId, modules, scale = 1) {
	const cards = [];
	for (const [faces, n] of deckEntries(modules)) {
		const count = scaledCount(n, scale);
		for (let i = 0; i < count; i++) cards.push({
			id: nextId("c"),
			faces: [...faces]
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
/** Свойство активно: раскрыто и не отключено (шов под неоплазию/мутации). */
function isActive(t) {
	return !t.hidden && !t.disabled && !t.paralyzed;
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
	return animal.traits.some((t) => t.type === type && !t.disabled && !t.paralyzed && (includeHidden || !t.hidden));
}
function traitsOf(animal, type, includeHidden = false) {
	if (animal.sedated || isAsleep(animal)) return [];
	return animal.traits.filter((t) => t.type === type && !t.disabled && !t.paralyzed && (includeHidden || !t.hidden));
}
function foodNeeded(animal, includeHidden = false) {
	if (isAsleep(animal)) return 1;
	let n = 1;
	for (const t of animal.traits) {
		if (!includeHidden && t.hidden) continue;
		if (t.disabled || t.paralyzed) continue;
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
/** Защищено ли стадное животное в своей локации: стадных не меньше хищников (C-card стр.1: «равно или больше»). */
function herdingProtects(state, prey) {
	if (!state.modules.continents) return false;
	if (isAsleep(prey)) return false;
	if (!prey.traits.some((t) => t.type === "herding" && isActive(t))) return false;
	const bal = herdingBalance(state, prey.zoneId ?? "laurasia");
	return bal.herding >= bal.carnivores;
}
function isFed(animal, includeHidden = false) {
	if (animal.hibernating || animal.sedated) return true;
	if (hasTrait(animal, "obligateCarnivore", includeHidden) && animal.blueFood > 0) return true;
	return animal.food >= speciesNeed(animal, includeHidden);
}
function emptyFatSlots(animal, includeHidden = false) {
	const slots = traitsOf(animal, "fatTissue", includeHidden).length;
	return Math.max(0, slots - animal.fatTokens);
}
function canReceiveFood(state, animal) {
	if (animal.hibernating) return false;
	const symbionts = animal.traits.filter((t) => hasTrait(animal, "symbiosis") && t.type === "symbiosis" && t.pairRole === "b" && isActive(t) && t.pairWith);
	for (const s of symbionts) {
		const host = findAnimal(state, s.pairWith);
		if (host && isAsleep(host)) continue;
		if (!host || !isFed(host)) return false;
	}
	if (isFed(animal)) return emptyFatSlots(animal) > 0;
	return true;
}
function livingSymbiontProtects(state, prey) {
	if (!hasTrait(prey, "symbiosis")) return false;
	return prey.traits.some((t) => {
		if (!isActive(t) || t.type !== "symbiosis" || t.pairRole !== "b" || !t.pairWith) return false;
		const host = findAnimal(state, t.pairWith);
		return Boolean(host) && !isAsleep(host);
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
		const ignored = hazeIgnoreTraitId(state, carnivore, prey);
		if (herdingProtects(state, prey) && !prey.traits.some((t) => t.type === "herding" && t.id === ignored)) return false;
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
		if (t.type === "herding" && hasTrait(prey, "developmentDefects") && herdingProtects(state, prey)) return t.id;
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
	return hasTrait(a, "migration") && !a.hibernating && !isParalyzed(state, a.id) && !(state.migratedThisPhase ?? []).includes(a.id);
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
	for (const pending of state.pendingRegeneration ?? []) {
		if (pending.ownerId !== playerId) continue;
		for (const t of pending.traits ?? []) {
			if (t.disabled) continue;
			total += 1 + TRAITS[t.type].scoreBonus;
		}
	}
	return total;
}
/** Имена ботов (учёные): общий список для соло и сетевых лобби. */
var AI_NAMES = [
	"Дарвин",
	"Уоллес",
	"Мендель",
	"Линней",
	"Кювье",
	"Ламарк",
	"Геккель"
];
/**
* Запись в журнал. Локализация (волна 8): движок продолжает писать готовый
* русский `text` (его проверяют тесты и его показывают старые кадры без key),
* а рядом кладёт машиночитаемые `key` + `params` — клиент при lang=en рендерит
* запись по словарю. Параметры-термины (`trait`/`plant`/`flora`/`mark`/`zone`)
* передаются id, а не именем: имя подставляет рендер через terms.ts.
*/
function log(state, text, key, params, tone = "neutral") {
	const prev = state.logSeq ?? state.log.at(-1)?.id ?? 0;
	state.logSeq = (Number.isFinite(prev) ? prev : 0) + 1;
	state.log.push({
		id: state.logSeq,
		text,
		tone,
		key,
		...params ? { params } : {}
	});
	if (state.log.length > 80) state.log.splice(0, state.log.length - 80);
}
function ev(state, event) {
	state.lastEvents.push(event);
}
/**
* Передача хода: фиксируем нового текущего игрока и считаем передачу
* (turnSeq). Счётчик различает круги одной фазы одного года — без него UI
* не отличал возврат хода к игроку после круга соперников от «того же» хода.
* Старый сейв без поля самовосстанавливается (NaN-защита, как у logSeq).
*/
function passTurnTo(state, id) {
	state.currentPlayerId = id;
	state.turnSeq = (Number.isFinite(state.turnSeq) ? state.turnSeq : 0) + 1;
}
/** Id всех сущностей выдаёт состояние — снапшоты не конфликтуют между партиями. */
function nid(state, prefix) {
	state.idSeq += 1;
	return `${prefix}${state.idSeq}`;
}
/**
* Колода партии: полный состав либо масштабированный до deckSize.
* Сначала число копий свойств масштабируется (минимум 1 на уникальную карту),
* затем размер доводится точно: лишние карты убираются с конца, недостающие —
* копии случайных карт (с новыми id; партии остаются воспроизводимыми).
*/
function buildScaledDeck(state, deckSize) {
	const nextId = (prefix) => nid(state, prefix);
	const target = deckSize && deckSize > 0 ? Math.floor(deckSize) : 0;
	if (!target) return buildDeck(nextId, state.modules);
	const base = deckSizeFor(1, state.modules);
	const cards = buildDeck(nextId, state.modules, target / base);
	while (cards.length > target) cards.pop();
	while (cards.length < target) {
		const src = cards[Math.floor(nextRandom(state) * cards.length)];
		if (!src) break;
		cards.push({
			id: nid(state, "c"),
			faces: [...src.faces]
		});
	}
	return cards;
}
function createGame(playerCount, difficulty, seed = Date.now() % 1e6, seats, modules, deckSize) {
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
		logSeq: 0,
		turnSeq: 0,
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
	state.deck = shuffled(state, buildScaledDeck(state, deckSize));
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
		log(state, `Случайные мутации: у каждого игрока личная колода из 7 карт.`, "log.mutationsIntro", void 0, "good");
	} else {
		const dealEach = state.modules.plants ? 8 : 6;
		for (let i = 0; i < dealEach; i++) for (const p of state.players) {
			const c = state.deck.pop();
			if (c) p.hand.push(c);
		}
	}
	const first = Math.floor(nextRandom(state) * playerCount);
	passTurnTo(state, first);
	state.firstPlayerId = first;
	log(state, `Год 1. Первым ходит ${state.players[first].name}.`, "log.firstTurn", { name: state.players[first].name }, "good");
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
/**
* Следующий номер животного у владельца: номера стабильные, поэтому при
* перестановках и переносе между территориями «№1» у зверя не меняется.
*/
function nextAnimalNo(p) {
	return p.animals.reduce((max, a) => Math.max(max, a.no ?? 0), 0) + 1;
}
/**
* Связанные животные (сотрудничество/симбиоз): сам зверь и его партнёр по
* парному свойству. Перемещать их нужно вместе — пара держится рядом.
*/
function pairGroup(state, animal) {
	const group = [animal];
	for (const t of animal.traits) {
		if (!t.pairWith) continue;
		if (group.some((a) => a.id === t.pairWith)) continue;
		const other = findAnimal(state, t.pairWith);
		if (other) group.push(other);
	}
	return group;
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
		for (const pending of state.pendingRegeneration ?? []) if (pending.traits) pending.traits = pending.traits.filter((x) => x.cardId !== t.cardId);
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
		log(state, `Новое растение: ${PLANTS[kind].name}${zone ? ` (${zone === "gondwana" ? "Гондвана" : "Лавразия"})` : ""}.`, zone ? "log.newPlantZone" : "log.newPlant", {
			plant: kind,
			...zone ? { zone } : {}
		}, "good");
	}
	if (added === 0 && count > 0) log(state, `Колода растений пуста — новых растений нет.`, "log.plantDeckEmpty");
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
		log(state, `Новая карта флоры: ${FLORA[kind].name}${zone ? ` (${zone === "gondwana" ? "Гондвана" : "Лавразия"})` : ""}.`, zone ? "log.newFloraZone" : "log.newFlora", {
			flora: kind,
			...zone ? { zone } : {}
		}, "good");
	}
	if (added === 0 && count > 0 && state.floraDeck.length === 0) log(state, `Колода трав и грибов пуста — новых карт нет.`, "log.floraDeckEmpty");
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
	if (!opts?.force && hasMark(animal, "thryn")) return false;
	const left = state.marksPool?.[mark] ?? 0;
	if (left <= 0) return false;
	state.marksPool = {
		...state.marksPool,
		[mark]: left - 1
	};
	animal.marks = [...animal.marks ?? [], mark];
	ev(state, {
		kind: "markGained",
		animalId: animal.id,
		mark
	});
	const owner = ownerOf(state, animal.id);
	log(state, `${owner.name}: животное получает метку «${MARKS[mark].name}».`, "log.markGained", {
		name: owner.name,
		mark
	}, mark === "poison" ? "bad" : "neutral");
	if (mark === "poison") dropTraitOfType(state, animal, "parasite");
	return true;
}
/**
* Перенос меток со съеденной добычи на хищника после возврата меток в пул.
* По правилу «Трын» хищник без «Трына» получает все метки добычи
* одновременно — поэтому для хищника без «Трына» переносится весь набор
* разом, даже если среди меток есть сам «Трын».
*/
function transferMarks(state, predator, marks) {
	if (hasMark(predator, "thryn")) return;
	for (const mark of marks) giveMark(state, predator, mark, { force: true });
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
	log(state, `Свойство «${TRAITS[type].name}» уходит в сброс.`, "log.traitDiscarded", { trait: type });
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
					if (canAttachPair(state, mine[i], mine[j], trait)) actions.push({
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
/** Число пар у животного: по правилам их не больше двух (B — A — C). */
function pairCount(a) {
	return a.traits.reduce((n, t) => n + (t.pairWith ? 1 : 0), 0);
}
/**
* Пара связывает двух животных одного владельца. Ограничения:
* — между двумя животными лежит только одна парная карта (любая);
* — у животного не больше двух пар: партнёры встают по сторонам (B — A — C);
* — связь не замыкает цепочку в кольцо: у плашки пары нет «между», и один
*   из партнёров потерял бы своё место в раскладке.
*/
function canAttachPair(state, a, b, _trait) {
	if (a.id === b.id) return false;
	if ([a, b].some((animal) => hasTrait(animal, "regeneration", true) && animal.traits.length >= 2)) return false;
	if (a.zoneId !== b.zoneId) return false;
	if (a.traits.some((t) => t.pairWith === b.id) || b.traits.some((t) => t.pairWith === a.id)) return false;
	if (pairCount(a) >= 2 || pairCount(b) >= 2) return false;
	return !samePairChain(state, a, b);
}
/**
* Животные уже связаны цепочкой пар (напрямую или через соседей)? Кольца в
* раскладке недопустимы: плашке пары нужно место «между» двумя животными.
*/
function samePairChain(state, a, b) {
	const seen = /* @__PURE__ */ new Set([a.id]);
	const queue = [a];
	while (queue.length) {
		const cur = queue.shift();
		for (const t of cur.traits) {
			if (!t.pairWith || seen.has(t.pairWith)) continue;
			if (t.pairWith === b.id) return true;
			seen.add(t.pairWith);
			const next = findAnimal(state, t.pairWith);
			if (next) queue.push(next);
		}
	}
	return false;
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
	if (isAsleep(source)) return;
	for (const t of source.traits) {
		if (!isActive(t) || t.type !== hookAsTrait(hook) || !t.pairWith) continue;
		if (TRAITS[t.type].onPartnerFed !== hook) continue;
		const key = `${hook}:${t.cardId}`;
		if (firedPairs.has(key)) continue;
		const other = findAnimal(state, t.pairWith);
		if (!other || other.hibernating || isAsleep(other)) continue;
		if (hook === "communication") {
			if (bankOf(state, source.zoneId) <= 0) continue;
			if (!canReceiveFood(state, other)) continue;
			firedPairs.add(key);
			takeFromBank(state, source.zoneId);
			giveFood(state, other, 1, "red", {
				triggerCoop: true,
				triggerComm: true
			});
			ev(state, {
				kind: "foodFromBank",
				animalId: other.id,
				playerId: ownerOf(state, other.id).id,
				via: "communication"
			});
			const op = ownerOf(state, other.id);
			log(state, `Взаимодействие: ${op.name} берёт еду из базы. База: ${bankOf(state, source.zoneId)}.`, "log.commTakeBank", {
				name: op.name,
				bank: bankOf(state, source.zoneId)
			});
		} else {
			if (!canReceiveFood(state, other) && emptyFatSlots(other) === 0) continue;
			firedPairs.add(key);
			giveFood(state, other, 1, "blue", {
				triggerCoop: true,
				triggerComm: false
			});
			ev(state, {
				kind: "blueFood",
				animalId: other.id,
				reason: "cooperation"
			});
			const op = ownerOf(state, other.id);
			log(state, `Сотрудничество: ${op.name} получает 1 синюю фишку.`, "log.coopBlue", { name: op.name });
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
			if (!(a.traits.some((t) => t.type === "scavenger" && isActive(t)) && !isAsleep(a))) continue;
			if (a.hibernating) continue;
			if (isFed(a) && emptyFatSlots(a) === 0) continue;
			if (!canReceiveFood(state, a) && !isFed(a)) continue;
			giveFood(state, a, 1, "blue");
			ev(state, {
				kind: "blueFood",
				animalId: a.id,
				reason: "scavenger"
			});
			log(state, `Падальщик ${p.name} получает 1 синюю фишку.`, "log.scavengerBlue", { name: p.name }, "good");
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
	if (state.pendingMigration) return [...legalRemoraActions(state), { type: "feedFinishMigration" }];
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
	actions.push(...legalRecombinations(state, playerId));
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
		if (hasTrait(a, "hibernation") && !a.hibernatedLastYear && !a.traits.some((t) => t.type === "hibernation" && t.hibernationUsedYear !== void 0 && t.hibernationUsedYear >= state.year - 1) && !state.lastYear && !a.hibernating && !isFed(a) && (used.hibernated ?? []).length === 0) actions.push({
			type: "feedHibernate",
			animalId: a.id
		});
		if (a.fatTokens > 0 && hasTrait(a, "fatTissue") && !a.hibernating && !isFed(a) && !isAsleep(a)) {
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
		if (cont && canMigrate(state, a) && migrationTurnAvailable(state)) {
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
			for (const prey of allAnimals(state)) if (canPlantAttackTarget(state, pl, prey)) actions.push({
				type: "feedPlantAttack",
				plantId: pl.id,
				preyId: prey.id
			});
		}
		if (!used.foodTaken && !used.combatUsed && !used.migrated && !used.sheltered) for (const par of plants) {
			if (par.kind !== "parasite" || !par.hostId) continue;
			const host = findPlant(state, par.hostId);
			if (!host || host.food <= 1 || par.food >= PLANTS[par.kind].maxFood) continue;
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
/** Card p.1: one mutual nonpairwise exchange per pair per year, in own feeding. */
function legalRecombinations(state, playerId) {
	if (!state.modules.continents || state.phase !== "feeding" || state.pendingAttack || state.rageTurn || state.currentPlayerId !== playerId || state.turnUse.migrated) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const a of player(state, playerId).animals) {
		if (!hasTrait(a, "recombination") || isParalyzed(state, a.id)) continue;
		if (state.turnTerritory !== void 0 && state.turnTerritory !== (a.zoneId ?? "laurasia")) continue;
		for (const pair of a.traits) {
			if (pair.type !== "recombination" || !isActive(pair) || !pair.pairWith || seen.has(pair.cardId)) continue;
			seen.add(pair.cardId);
			const b = findAnimal(state, pair.pairWith);
			if (!b || b.ownerId !== playerId || !hasTrait(b, "recombination") || isParalyzed(state, b.id)) continue;
			const reciprocal = b.traits.find((t) => t.cardId === pair.cardId && t.pairWith === a.id && isActive(t));
			if (!reciprocal || pair.recombinedYear === state.year || reciprocal.recombinedYear === state.year) continue;
			if ((a.zoneId ?? "laurasia") !== (b.zoneId ?? "laurasia")) continue;
			for (const sent of a.traits.filter(exchangeable)) for (const received of b.traits.filter(exchangeable)) {
				const action = {
					type: "feedRecombine",
					giverId: a.id,
					takerId: b.id,
					traitId: sent.id,
					otherTraitId: received.id
				};
				if (losesSwimming(a, sent, received) || losesSwimming(b, received, sent)) out.push({
					...action,
					to: "laurasia"
				}, {
					...action,
					to: "gondwana"
				});
				else out.push(action);
			}
		}
	}
	return out;
}
function exchangeable(t) {
	return !TRAITS[t.type].isPair && !t.pairWith && !t.hidden && !t.paralyzed;
}
function losesSwimming(a, outgoing, incoming) {
	return a.zoneId === "ocean" && outgoing.type === "swimming" && isActive(outgoing) && !(incoming.type === "swimming" && !incoming.disabled) && !a.traits.some((t) => t.id !== outgoing.id && t.type === "swimming" && isActive(t));
}
function feedRecombine(state, action) {
	if (!legalRecombinations(state, state.currentPlayerId).some((a) => a.giverId === action.giverId && a.takerId === action.takerId && a.traitId === action.traitId && a.otherTraitId === action.otherTraitId && a.to === action.to)) return;
	const a = mustFind(state, action.giverId);
	const b = mustFind(state, action.takerId);
	const sent = a.traits.find((t) => t.id === action.traitId);
	const received = b.traits.find((t) => t.id === action.otherTraitId);
	const aAshore = losesSwimming(a, sent, received);
	const bAshore = losesSwimming(b, received, sent);
	for (const host of [a, b]) for (const pair of host.traits) if (pair.type === "recombination" && pair.pairWith === (host === a ? b.id : a.id)) pair.recombinedYear = state.year;
	const carryUse = (from, to, t) => {
		const key = t.type === "piracy" ? "pirates" : t.type === "carnivore" ? "carnivores" : t.type === "grazing" ? "grazers" : void 0;
		if (key && state.turnUse[key].includes(from.id) && !state.turnUse[key].includes(to.id)) state.turnUse[key].push(to.id);
		if (t.type === "migration" && state.migratedThisPhase?.includes(from.id) && !state.migratedThisPhase.includes(to.id)) state.migratedThisPhase.push(to.id);
		if (t.type === "hibernation" && (from.hibernating || from.hibernatedLastYear)) t.hibernationUsedYear = Math.max(t.hibernationUsedYear ?? -1, from.hibernating ? state.year : state.year - 1);
	};
	carryUse(a, b, sent);
	carryUse(b, a, received);
	a.traits = a.traits.filter((t) => t.id !== sent.id);
	b.traits = b.traits.filter((t) => t.id !== received.id);
	const receive = (host, t) => {
		if (!TRAITS[t.type].stackable && host.traits.some((x) => x.type === t.type)) {
			ownerOf(state, host.id).discardCount++;
			return;
		}
		delete t.disabled;
		if (t.type === "neoplasia") host.traits.unshift(t);
		else host.traits.push(t);
	};
	receive(a, received);
	receive(b, sent);
	a.neoplasia = a.traits.find((t) => t.type === "neoplasia");
	b.neoplasia = b.traits.find((t) => t.type === "neoplasia");
	if (aAshore) a.zoneId = action.to;
	if (bAshore) b.zoneId = action.to;
	if (received.type === "swimming" && hasTrait(a, "swimming") && sent.type !== "swimming") a.zoneId = "ocean";
	if (sent.type === "swimming" && hasTrait(b, "swimming") && received.type !== "swimming") b.zoneId = "ocean";
	dropCrossTerritoryPairs(state);
	spendTurn(state, state.currentPlayerId);
	state.turnTerritory ??= aAshore ? b.zoneId : a.zoneId;
	log(state, "Рекомбинация: животные обмениваются свойствами.", "log.recombine");
	maybeEndTurn(state);
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
/** То же, но машиночитаемо: ключ словаря вместо готового текста. */
function feedBlockReasonInfo(state, playerId, kind) {
	const r = feedBlockOf(state, playerId, kind);
	return r ? { key: r.key } : null;
}
function feedBlockOf(state, playerId, kind) {
	if (state.phase !== "feeding" || state.pendingAttack || state.currentPlayerId !== playerId) return null;
	if (legalFeedActions(state, playerId).some((a) => a.type === kind)) return null;
	const p = state.players.find((x) => x.id === playerId);
	if (!p) return null;
	const used = state.turnUse;
	const hibernated = used.hibernated ?? [];
	const cont = state.modules.continents;
	const plants = state.modules.plants ? state.plants ?? [] : [];
	const flora = state.modules.fungi ? state.flora ?? [] : [];
	const block = (text, key) => ({
		text,
		key
	});
	if (state.rageTurn) {
		if (kind === "feedHunt") return block("Сейчас ход бешенства: атаковать может только бешеное животное.", "feedBlock.rageHuntOnly");
		if (kind === "feedEndTurn") return null;
		return block("Сейчас ход бешенства — другие действия недоступны.", "feedBlock.rageOther");
	}
	/** Территория животного (вне «Континентов» зон нет). */
	const zoneOf = (a) => a.zoneId ?? "laurasia";
	const zoneUnlocked = (zone) => !cont || state.turnTerritory === void 0 || state.turnTerritory === zone;
	/** Кормовая база доступна животному этой территории. */
	const bankOk = (zone) => {
		if (!zoneUnlocked(zone)) return false;
		if (!cont) return !plants.length && state.foodBank > 0;
		if (plants.length && zone !== "ocean") return false;
		return (state.territoryFood?.[zone] ?? 0) > 0;
	};
	switch (kind) {
		case "feedEndTurn": return null;
		case "feedRecombine":
			if (!cont) return block("Модуль «Континенты» не включён.", "feedBlock.continentsOff");
			if (used.migrated) return block("Ход потрачен на миграцию.", "feedBlock.migrated");
			if (!p.animals.some((a) => !a.hibernating && hasTrait(a, "recombination") && legalRecombinations(state, playerId).length > 0)) return block("Нет пары рекомбинации с доступным обменом.", "feedBlock.noRecombination");
			return block("Обмен уже выполнен в этом году.", "feedBlock.recombined");
		case "feedTake": {
			if (used.foodTaken) return block("В этот ход уже брали еду из кормовой базы.", "feedBlock.tookFood");
			if (used.combatUsed) return block("После охоты или пиратства красные фишки из базы брать нельзя.", "feedBlock.afterCombat");
			if (used.sheltered) return block("Убежище занимает ход — еду брать нельзя.", "feedBlock.shelterBlocksFood");
			if (used.migrated) return block("Ход потрачен на миграцию — еду брать нельзя.", "feedBlock.migratedFood");
			if (!p.animals.length) return block("У игрока нет животных.", "feedBlock.noAnimals");
			if (plants.length && !cont) return block("В этот год еда на растениях — кормовая база не действует.", "feedBlock.plantsFoodYear");
			const hungry = p.animals.filter((a) => canReceiveFood(state, a) && !hasTrait(a, "obligateCarnivore"));
			if (!hungry.length) return p.animals.every((a) => hasTrait(a, "obligateCarnivore")) ? block("Облигатный хищник кормится только добычей.", "feedBlock.obligateOnly") : block("Все животные накормлены.", "feedBlock.allFed");
			if (!hungry.some((a) => bankOk(zoneOf(a)))) return block("В кормовой базе этой территории нет еды.", "feedBlock.noBankFood");
			return null;
		}
		case "feedHunt": {
			if (used.foodTaken) return block("После взятия еды хищник не охотится.", "feedBlock.afterFoodNoHunt");
			if (used.sheltered) return block("Убежище занимает ход — охотиться нельзя.", "feedBlock.shelterBlocksHunt");
			if (cont && used.migrated) return block("Ход потрачен на миграцию — охотиться нельзя.", "feedBlock.migratedHunt");
			const hunters = p.animals.filter((a) => canHuntWith(state, a));
			if (!hunters.length) return p.animals.some(isCarnivoreLike) ? block("Хищники накормлены или не могут охотиться.", "feedBlock.huntersFed") : block("Нет голодного хищника.", "feedBlock.noHunter");
			const ready = hunters.filter((a) => !used.carnivores.includes(a.id));
			if (!ready.length) return block("Все хищники уже атаковали в этот ход.", "feedBlock.huntersUsed");
			if (!allAnimals(state).some((t) => ready.some((c) => canAttack(state, c, t)))) return block("Нет добычи, доступной для атаки.", "feedBlock.noPrey");
			return null;
		}
		case "feedPirate": {
			if (used.foodTaken) return block("После взятия еды пират не ворует.", "feedBlock.afterFoodNoPiracy");
			if (used.sheltered) return block("Убежище занимает ход — пиратство недоступно.", "feedBlock.shelterBlocksPiracy");
			if (cont && used.migrated) return block("Ход потрачен на миграцию.", "feedBlock.migrated");
			const pirates = p.animals.filter((a) => hasTrait(a, "piracy") && !a.hibernating && !isParalyzed(state, a.id) && !hasMark(a, "pacifism") && !hasTrait(a, "obligateCarnivore"));
			if (!pirates.length) return block("Нет животного с пиратством, которое может забрать еду.", "feedBlock.noPirate");
			const hungry = pirates.filter((a) => !isFed(a));
			if (!hungry.length) return block("Пираты накормлены — воровать нечего.", "feedBlock.piratesFed");
			if (hungry.every((a) => used.pirates.includes(a.id))) return block("Пиратство в этот ход уже использовано.", "feedBlock.piracyUsed");
			if (!hungry.some((a) => !used.pirates.includes(a.id) && allAnimals(state).some((t) => t.id !== a.id && !isFed(t) && t.food > 0 && (!cont || zoneOf(t) === zoneOf(a))))) return block("Нет животного с едой, у которого можно украсть.", "feedBlock.noPiracyTarget");
			return null;
		}
		case "feedHibernate": {
			if (hibernated.length) return block("Спячка в этот ход уже использована.", "feedBlock.hibernationUsed");
			if (state.lastYear) return block("В последний год спячка недоступна.", "feedBlock.hibernationLastYear");
			const sleepers = p.animals.filter((a) => hasTrait(a, "hibernation"));
			if (!sleepers.length) return block("Нет животного со спячкой.", "feedBlock.noSleeper");
			if (sleepers.every((a) => a.hibernatedLastYear)) return block("Животное уже спало в прошлом году.", "feedBlock.sleptLastYear");
			if (sleepers.every((a) => a.hibernating || isFed(a))) return block("Все животные накормлены.", "feedBlock.allFed");
			return null;
		}
		case "feedShelter": {
			if (!state.modules.plants) return block("Модуль «Растения» не включён.", "feedBlock.plantsOff");
			if (used.foodTaken) return block("Ход уже занят едой — убежище недоступно.", "feedBlock.afterFoodNoShelter");
			if (used.combatUsed) return block("После боя убежище недоступно.", "feedBlock.afterCombatNoShelter");
			if (used.sheltered) return block("Убежище в этот ход уже занято.", "feedBlock.shelterUsed");
			if (used.migrated) return block("Ход потрачен на миграцию.", "feedBlock.migrated");
			const free = plants.filter((pl) => pl.shelters > 0 && zoneUnlocked(pl.zoneId ?? "gondwana"));
			if (!free.length) return block("На растениях не осталось свободных убежищ.", "feedBlock.noShelters");
			const who = p.animals.filter((a) => !a.hibernating && !a.sheltered);
			if (!who.length) return block("Нет животного, которому нужно убежище.", "feedBlock.noShelterNeed");
			if (!who.some((a) => free.some((pl) => canTakeShelterFrom(state, a, pl)))) return block("Убежища остались в другой территории.", "feedBlock.sheltersOtherZone");
			return null;
		}
		case "feedGraze": {
			if (used.sheltered) return block("Убежище занимает ход — топтать нельзя.", "feedBlock.shelterBlocksGraze");
			const grazers = p.animals.filter((a) => hasTrait(a, "grazing"));
			if (!grazers.length) return block("Нет животного с топтанием.", "feedBlock.noGrazer");
			const hungry = grazers.filter((a) => !isFed(a));
			if (!hungry.length) return block("Все топтуны накормлены.", "feedBlock.grazersFed");
			if (hungry.every((a) => used.grazers.includes(a.id))) return block("Топтуны в этот ход уже топтали.", "feedBlock.grazersUsed");
			const food = hungry.some((a) => {
				const zone = zoneOf(a);
				if (!zoneUnlocked(zone)) return false;
				if (cont) return (state.territoryFood?.[zone] ?? 0) > 0;
				if (plants.length) return false;
				return state.foodBank > 0;
			});
			const plantFood = plants.some((pl) => pl.food > 0 && zoneUnlocked(pl.zoneId ?? "gondwana"));
			const floraFood = flora.some((f) => f.food > 0 && zoneUnlocked(f.zoneId ?? "gondwana"));
			if (!food && !plantFood && !floraFood) return block("Нет еды, которую можно вытоптать.", "feedBlock.noGrazeFood");
			return null;
		}
		case "feedConvertFat": {
			const fat = p.animals.filter((a) => a.fatTokens > 0);
			if (!fat.length) return block("Нет запасов жира.", "feedBlock.noFat");
			if (!fat.some((a) => !a.hibernating && !isFed(a))) return block("Конвертировать жир может только голодное животное.", "feedBlock.fatHungryOnly");
			return null;
		}
		case "feedMigrate": {
			if (!cont) return block("Миграция доступна только с дополнением «Континенты».", "feedBlock.migrateOff");
			if (used.migrated) return block("Миграция в этот ход уже объявлена.", "feedBlock.migrateUsed");
			const ready = p.animals.filter((a) => canMigrate(state, a));
			if (!ready.length) return block("Нет животного, готового мигрировать.", "feedBlock.noMigrator");
			if (!ready.some((a) => migrationTargets(state, a).length > 0)) return block("Этому животному некуда мигрировать.", "feedBlock.noMigrationTarget");
			return null;
		}
		case "feedSkip":
			if (state.modules.plants && canStillFeedOrShelter(state, playerId)) return block("Пас недоступен: есть животные, способные получить еду или убежище.", "feedBlock.skipBlocked");
			return null;
		default: return null;
	}
}
function defenseOptions(state, animal, attack) {
	if (animal.sedated || isAsleep(animal)) return [];
	const opts = [];
	for (const t of animal.traits) {
		if (!isActive(t)) continue;
		if (attack.ignoredTraitId && t.id === attack.ignoredTraitId) continue;
		const kind = TRAITS[t.type].defense;
		if (!kind || attack.usedDefenses.includes(kind)) continue;
		if (kind === "mimicry") {
			if (attack.mimicryChain.includes(animal.id)) continue;
			if (mimicryTargets(state, attack, animal).length === 0) continue;
		}
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
function plantCounterDefenses(prey) {
	if (prey.sedated || isAsleep(prey)) return [];
	return prey.traits.filter((t) => isActive(t) && (TRAITS[t.type].defense || TRAITS[t.type].protection || t.type === "swimming" || t.type === "herding" || t.type === "symbiosis" && t.pairRole === "b"));
}
function legalDefenseActions(state, playerId) {
	const atk = state.pendingAttack;
	if (!atk || atk.waitingFor !== playerId) return [];
	const prey = findAnimal(state, atk.preyId);
	if (!prey) return [{
		type: "chooseDefense",
		kind: "none"
	}];
	if (atk.choosingPlantDefense) return plantCounterDefenses(prey).map((t) => ({
		type: "chooseDefense",
		kind: "ignore",
		ignoredTraitId: t.id
	}));
	const actions = [{
		type: "chooseDefense",
		kind: "none"
	}];
	const opts = defenseOptions(state, prey, atk);
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
	const poisoned = !prey.sedated && prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller);
	ev(state, {
		kind: "preyKilled",
		preyId: prey.id,
		carnivoreId: plant.id
	});
	log(state, `Хищное растение съедает животное ${victim.name} (${animalValue(prey)} очк.).`, "log.plantEats", {
		name: victim.name,
		value: animalValue(prey)
	}, "hunt");
	if (poisoned) {
		plant.doomed = true;
		log(state, `Добыча была ядовитой — растение погибнет в вымирание.`, "log.preyPoisonousPlant", void 0, "bad");
	}
	if (state.modules.randomMutations && (prey.population ?? 1) > 1) {
		prey.population = (prey.population ?? 1) - 1;
		ev(state, {
			kind: "populationLost",
			animalId: prey.id,
			to: prey.population
		});
		log(state, `${victim.name}: вид теряет животное (осталось ${prey.population}).`, "log.lostAnimal", {
			name: victim.name,
			left: prey.population
		}, "bad");
		feedFungi(state);
		spreadFungalGrowth(state);
	} else if (hasTrait(prey, "regeneration")) {
		state.pendingRegeneration = [...state.pendingRegeneration ?? [], regenSnapshotOf(prey, victim.id)];
		log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "log.regenerates", void 0, "good");
		const p0 = ownerOf(state, prey.id);
		p0.animals = p0.animals.filter((a) => a.id !== prey.id);
		p0.discardCount += 1;
	} else discardAnimal(state, prey);
	const max = PLANTS.carnivorous.maxFood;
	plant.food = Math.min(max, plant.food + tokens);
	triggerScavenger(state, state.currentPlayerId);
	const attack = state.pendingAttack;
	if (attack?.plantCounter && attack.plantRequesterId !== prey.id) {
		const requester = findAnimal(state, attack.plantRequesterId);
		if (requester) givePlantFood(state, requester, plant);
	}
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
	const poisoned = !opts?.rage && !isAsleep(prey) && prey.traits.some((t) => isActive(t) && TRAITS[t.type].killsKiller) && gain === 2;
	ev(state, {
		kind: "preyKilled",
		preyId: prey.id,
		carnivoreId: carnivore.id
	});
	log(state, opts?.rage ? `Бешеное животное ${hunter.name} убивает животное ${victim.name} (${animalValue(prey)} очк.) — добычу не ест.` : `${hunter.name} охотится: ${victim.name} теряет животное (${animalValue(prey)} очк.).`, opts?.rage ? "log.rageKills" : "log.huntSuccess", {
		name: hunter.name,
		target: victim.name,
		value: animalValue(prey)
	}, "hunt");
	if (insectivore) log(state, `Насекомоядное: добыча без свойств — 1 синяя фишка вместо двух.`, "log.insectivore", void 0, "good");
	if (poisoned) {
		carnivore.poisoned = true;
		log(state, `Хищник ${hunter.name} отравлен и погибнет в вымирание.`, "log.hunterPoisoned", { name: hunter.name }, "bad");
	}
	paralyzeAttacker(state, carnivore, prey);
	if (state.modules.randomMutations && (prey.population ?? 1) > 1) {
		prey.population = (prey.population ?? 1) - 1;
		ev(state, {
			kind: "populationLost",
			animalId: prey.id,
			to: prey.population
		});
		log(state, `${victim.name}: вид теряет животное (осталось ${prey.population}).`, "log.lostAnimal", {
			name: victim.name,
			left: prey.population
		}, "bad");
		feedFungi(state);
		spreadFungalGrowth(state);
	} else if (hasTrait(prey, "regeneration")) {
		state.pendingRegeneration = [...state.pendingRegeneration ?? [], regenSnapshotOf(prey, victim.id)];
		log(state, `Свойства съеденного регенерируют — владелец вернёт их животным.`, "log.regenerates", void 0, "good");
		const p0 = ownerOf(state, prey.id);
		p0.animals = p0.animals.filter((a) => a.id !== prey.id);
		p0.discardCount += 1;
		returnMarksToPool(state, prey);
	} else discardAnimal(state, prey);
	if (!opts?.rage) {
		giveFood(state, carnivore, hasTrait(carnivore, "obligateCarnivore") ? 1 : gain, "blue", { obligate: true });
		ev(state, {
			kind: "blueFood",
			animalId: carnivore.id,
			reason: "hunt"
		});
		if (gain > 0 && hasTrait(carnivore, "obligateCarnivore") && !carnivore.hibernating) {
			carnivore.receivedFoodThisYear = true;
			log(state, `${hunter.name}: облигатный хищник накормлен добычей.`, "log.obligateFed", { name: hunter.name }, "good");
		}
		transferMarks(state, carnivore, preyMarks);
		if (gain === 2) {
			for (const def of Object.values(TRAITS)) if (def.onAnyKill === "scavenger") {
				triggerScavenger(state, hunter.id);
				break;
			}
		}
	} else triggerScavenger(state, hunter.id);
	if (poisoned && state.modules.randomMutations) {
		carnivore.poisoned = false;
		if ((carnivore.population ?? 1) > 1) {
			carnivore.population = (carnivore.population ?? 1) - 1;
			hunter.discardCount += 1;
			carnivore.food = Math.min(carnivore.food, speciesNeed(carnivore));
			carnivore.blueFood = Math.min(carnivore.blueFood, carnivore.food);
			ev(state, {
				kind: "populationLost",
				animalId: carnivore.id,
				to: carnivore.population
			});
			feedFungi(state);
			spreadFungalGrowth(state);
		} else {
			ev(state, {
				kind: "animalDied",
				animalId: carnivore.id,
				cause: "poison"
			});
			discardAnimal(state, carnivore);
		}
	}
	state.pendingAttack = null;
	if (opts?.rage) advanceFeed(state);
	else maybeEndTurn(state);
}
/**
* Стрекательные клетки (PDF с.2): даже при неудачной атаке у хищника перестают
* действовать ВСЕ свойства до конца фазы питания — он эквивалентен животному
* без свойств (потребность 1, не охотится, не ворует, не мигрирует). Карты
* свойств остаются на животном и не теряют очки из-за паралича.
* state.paralyzed очищается в endFeeding, а trait.paralyzed удаляется
* после определения погибающих от голода с базовой потребностью.
* В океане хищник теряет и водоплавающее — вытеснен на континент; парные
* свойства, разъехавшиеся с вытеснением, уходят в сброс.
*/
function paralyzeAttacker(state, carnivore, prey) {
	if (!hasTrait(prey, "nematocysts")) return;
	state.paralyzed = state.paralyzed ?? [];
	if (!state.paralyzed.includes(carnivore.id)) state.paralyzed.push(carnivore.id);
	for (const t of carnivore.traits) t.paralyzed = true;
	if (state.modules.continents && carnivore.zoneId === "ocean") {
		oceanExpel(state, carnivore);
		dropCrossTerritoryPairs(state);
		log(state, `Хищник парализован в океане — выброшен на континент.`, "log.paralyzedAshore", void 0, "bad");
	} else log(state, `Хищник ${ownerOf(state, carnivore.id).name} парализован стрекательными клетками.`, "log.paralyzed", { name: ownerOf(state, carnivore.id).name }, "bad");
	ev(state, {
		kind: "paralyzed",
		carnivoreId: carnivore.id
	});
}
/** Свойства остаются на месте съеденного животного до восстановления. */
function regenSnapshotOf(a, ownerId) {
	return {
		ownerId,
		animalId: a.id,
		zoneId: a.zoneId,
		traits: a.traits.map((t) => ({ ...t }))
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
	if (next.pendingMigration && action.type !== "feedRemora" && action.type !== "feedFinishMigration") return next;
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
		case "feedRecombine":
			feedRecombine(next, action);
			break;
		case "feedMigrate":
			feedMigrate(next, action.moves);
			break;
		case "feedRemora":
			feedRemora(next, action);
			break;
		case "feedFinishMigration":
			finishMigration(next);
			break;
		case "reorderAnimal":
			if (action.toZoneId) moveAnimalToZoneHuman(next, action.animalId, action.toZoneId);
			else reorderAnimal(next, action.animalId, action.beforeId);
			break;
		case "renameAnimal":
			renameOwnAnimal(next, action.animalId, action.name);
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
		no: nextAnimalNo(p),
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
	log(state, state.modules.continents ? `${p.name} выкладывает новое животное (${zone === "laurasia" ? "Лавразия" : "Гондвана"}).` : `${p.name} выкладывает новое животное.`, state.modules.continents ? "log.animalPlacedZone" : "log.animalPlaced", state.modules.continents ? {
		name: p.name,
		zone
	} : { name: p.name });
	advanceDev(state);
}
function playTrait(state, cardId, face, animalId) {
	const p = player(state, state.currentPlayerId);
	const candidate = p.hand.find((c) => c.id === cardId);
	const animal = mustFind(state, animalId);
	if (candidate?.faces[face] === "neoplasia" && animal.ownerId === p.id) return;
	const card = takeCard(p, cardId);
	const trait = faceOf(card, face);
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
	if (trait === "parasite") log(state, `${p.name}: ${TRAITS[trait].name} → животное ${targetOwner.name}.`, "log.traitToOpponent", {
		name: p.name,
		trait,
		target: targetOwner.name
	}, "bad");
	else log(state, `${p.name}: свойство ${TRAITS[trait].name}.`, "log.traitPlaced", {
		name: p.name,
		trait
	});
	settleAfterTraitChange(state, animal);
	advanceDev(state);
}
/**
* Цепочка пары от указанного животного наружу: сам зверь, затем его партнёр,
* затем партнёр партнёра и так до конца. Звери из stopIds в обход не берутся.
*/
function pairChainFrom(p, startId, stopIds) {
	const byId = new Map(p.animals.map((x) => [x.id, x]));
	const seen = new Set(stopIds ?? []);
	const out = [];
	let id = startId;
	while (id && !seen.has(id)) {
		const cur = byId.get(id);
		if (!cur) break;
		out.push(cur);
		seen.add(id);
		id = cur.traits.find((t) => t.pairWith && !seen.has(t.pairWith))?.pairWith;
	}
	return out;
}
function playPair(state, cardId, face, aId, bId) {
	const p = player(state, state.currentPlayerId);
	const card = takeCard(p, cardId);
	const trait = faceOf(card, face);
	const a = mustFind(state, aId);
	const b = mustFind(state, bId);
	if (state.modules.continents && a.zoneId !== b.zoneId) throw new Error("pair across territories");
	if (pairCount(a) >= 2 || pairCount(b) >= 2) throw new Error("pair limit");
	if (samePairChain(state, a, b)) throw new Error("pair loop");
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
	layoutPair(p, aId, bId);
	log(state, `${p.name} связывает двух животных: ${TRAITS[trait].name}.`, "log.pairPlaced", {
		name: p.name,
		trait
	});
	advanceDev(state);
}
/**
* Раскладка пар: партнёр встаёт в свободный конец цепочки, чтобы плашка
* пары лежала ровно между соседними животными. Первая пара животного —
* слева от него, вторая — справа (B — A — C); собственная цепочка партнёра
* переносится целиком, и её пары тоже остаются соседними.
*/
function layoutPair(p, aId, bId) {
	const ai = p.animals.findIndex((x) => x.id === aId);
	if (ai < 0) return;
	const oldPartner = p.animals[ai].traits.find((t) => t.pairWith && t.pairWith !== bId)?.pairWith;
	const oldIdx = oldPartner ? p.animals.findIndex((x) => x.id === oldPartner) : -1;
	const placeLeft = oldPartner === void 0 || oldIdx > ai;
	const chainB = pairChainFrom(p, bId, /* @__PURE__ */ new Set([aId]));
	if (chainB.length === 0) return;
	const moved = new Set(chainB.map((x) => x.id));
	const rest = p.animals.filter((x) => !moved.has(x.id));
	const at = rest.findIndex((x) => x.id === aId);
	if (at < 0) return;
	const inserted = placeLeft ? [...chainB].reverse() : chainB;
	rest.splice(placeLeft ? at : at + 1, 0, ...inserted);
	p.animals.splice(0, p.animals.length, ...rest);
}
function passDev(state) {
	const p = player(state, state.currentPlayerId);
	p.passedDev = true;
	ev(state, {
		kind: "passed",
		playerId: p.id
	});
	log(state, `${p.name} пасует.`, "log.passed", { name: p.name });
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
		no: nextAnimalNo(p),
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
		log(state, `${p.name}: «${def.name}» не подошло ни одному виду — появляется новый вид-мутант.`, "log.mutantSpecies", {
			name: p.name,
			trait
		}, def.harmful ? "bad" : "good");
	} else log(state, `${p.name}: карта ложится новым видом (свойство «${def.name}» сыграть нельзя).`, "log.cardAsAnimal", {
		name: p.name,
		trait
	});
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
		settleAfterTraitChange(state, mutant);
		ev(state, {
			kind: "traitPlaced",
			animalId: mutant.id,
			type: last.type,
			hidden: false
		});
		log(state, `${p.name}: «Упрощение» — «${TRAITS[last.type].name}» отделяется новым видом.`, "log.simplificationSplit", {
			name: p.name,
			trait: last.type
		}, "bad");
	}
	spawnSpecies(state, p, card, target.zoneId);
	log(state, `${p.name}: «Упрощение» — карта ложится новым видом.`, "log.simplificationAnimal", { name: p.name }, "bad");
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
		log(state, `${p.name}: объявлен новый вид — карта из колоды ложится животным.`, "log.mutateAnimal", { name: p.name });
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
			log(state, `«Экстрофил»: дополнительная карта уходит в сброс.`, "log.extremophileDiscard", void 0, "bad");
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
		log(state, `${p.name}: вид получает +1 животное (численность ${target.population}).`, "log.mutatePopulation", {
			name: p.name,
			pop: target.population
		});
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
		log(state, def.harmful ? `${p.name}: вредная мутация — «${def.name}» на своём виде!` : `${p.name}: мутация «${def.name}».`, def.harmful ? "log.harmfulMutation" : "log.mutation", {
			name: p.name,
			trait
		}, def.harmful ? "bad" : "neutral");
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
		log(state, `${p.name}: «${def.name}» не подошло виду — переехало соседнему.`, "log.mutationMoved", {
			name: p.name,
			trait
		});
		advanceDev(state);
		return;
	}
	fallbackNewSpecies(state, p, card, trait, target.zoneId);
	advanceDev(state);
}
/**
* Начало хода игрока в фазе развития: «Почкование» добавляет виду животное
* из личной колоды (численность не ограничена числом видов), один раз за год.
*/
function startMutationsDevTurn(state, playerId) {
	if (!state.modules.randomMutations || state.phase !== "development") return;
	const p = player(state, playerId);
	if (p.passedDev) return;
	for (const a of [...p.animals]) {
		if (!a.traits.some((t) => t.type === "budding" && isActive(t))) continue;
		if (a.buddedYear === state.year) continue;
		if (!p.blindDeck?.length) break;
		p.blindDeck.pop();
		a.buddedYear = state.year;
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
		log(state, `${p.name}: «Почкование» — вид растёт до ${a.population} животного(-ых).`, "log.budding", {
			name: p.name,
			pop: a.population
		}, "good");
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
		log(state, `${p.name}: растение-паразит на ${PLANTS[plant.kind].name}.`, "log.plantParasite", {
			name: p.name,
			plant: plant.kind
		});
		return;
	}
	plant.traits.push(makeTrait(state, card, trait));
	if (trait === "thorny") plant.shelters += 3;
	if (trait === "tree") plant.shelters += 1;
	log(state, `${p.name}: свойство ${TRAITS[trait].name} → ${PLANTS[plant.kind].name}.`, "log.plantTrait", {
		name: p.name,
		trait,
		plant: plant.kind
	});
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
	log(state, `${p.name}: микориза связывает ${PLANTS[a.kind].name} и ${PLANTS[b.kind].name}.`, "log.micorrhiza", {
		name: p.name,
		plant: a.kind,
		plant2: b.kind
	});
	advanceDev(state);
}
function advanceDev(state) {
	if (state.modules.randomMutations) {
		for (const p of state.players) if (!(p.blindDeck ?? []).length) p.passedDev = true;
	} else for (const p of state.players) if (p.hand.length === 0) p.passedDev = true;
	if (state.players.every((p) => p.passedDev)) {
		revealAndStartFood(state);
		return;
	}
	let id = nextPlayerId(state);
	for (let i = 0; i < state.players.length; i++) {
		if (!player(state, id).passedDev) {
			passTurnTo(state, id);
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
		log(state, state.modules.plants && state.modules.fungi ? "Питание: еда этого года — на растениях, травах и грибах." : state.modules.plants ? "Питание: еда этого года — на растениях." : "Питание: еда этого года — на травах и грибах.", state.modules.plants && state.modules.fungi ? "log.feedPlantsFungi" : state.modules.plants ? "log.feedPlants" : "log.feedFungi", void 0, "good");
		enterFeeding(state);
		return;
	}
	if (state.modules.fungi) addNewFlora(state, state.players.length);
	log(state, "Определение кормовой базы.", "log.bankStart", void 0, "good");
	state.phase = "foodBank";
	state.foodRoll = null;
	state.foodBank = 0;
}
/** Общий старт фазы питания: круг по игрокам от первого игрока. */
function enterFeeding(state) {
	state.phase = "feeding";
	passTurnTo(state, state.firstPlayerId);
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
			if (!hasTrait(a, "edificator")) continue;
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
		log(state, `Океан: кормовая база ${bases.ocean}. На континентах еда — на столе флоры.`, "log.oceanBank", { bank: bases.ocean }, "good");
		return;
	}
	if (state.modules.continents) {
		advanceNeoplasia(state);
		const dice = [dieFor(state), dieFor(state)];
		const bases = territoryBases(n);
		for (const a of allAnimals(state)) {
			if (a.hibernating) continue;
			if (!hasTrait(a, "edificator")) continue;
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
		log(state, `Кормовые базы — Лавразия ${bases.laurasia}, Гондвана ${bases.gondwana}, Океан ${bases.ocean}.`, "log.basesRoll", {
			l: bases.laurasia,
			g: bases.gondwana,
			o: bases.ocean
		}, "good");
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
	log(state, `Кубики кормовой базы: ${dice.join(" + ")}${n !== 3 ? " (+2)" : ""} = ${food}.`, "log.diceBank", {
		dice: dice.join(" + "),
		extra: n !== 3 ? " (+2)" : "",
		food
	}, "good");
}
/** Действие beginFeeding: вызывается после показа кубиков, стартует питание по кругу. */
function beginFeeding(state) {
	if (state.phase !== "foodBank" || !state.foodRoll) return;
	state.phase = "feeding";
	passTurnTo(state, state.firstPlayerId);
	for (const p of state.players) p.passedFeed = false;
	if ((state.modules.plants || state.modules.fungi) && state.modules.continents) log(state, `Океан: кормовая база ${state.territoryFood?.ocean ?? 0}. На континентах еда — на столе флоры${state.modules.plants ? " (растения" + (state.modules.fungi ? " и травы с грибами)" : ")") : " (травы и грибы)"}.`, state.modules.plants && state.modules.fungi ? "log.oceanBankPlantsFungi" : state.modules.plants ? "log.oceanBankPlants" : "log.oceanBankFungi", { bank: state.territoryFood?.ocean ?? 0 }, "good");
	else if (state.modules.continents) log(state, `Кормовые базы: Лавразия ${state.territoryFood?.laurasia ?? 0}, Гондвана ${state.territoryFood?.gondwana ?? 0}, Океан ${state.territoryFood?.ocean ?? 0}.`, "log.bases", {
		l: state.territoryFood?.laurasia ?? 0,
		g: state.territoryFood?.gondwana ?? 0,
		o: state.territoryFood?.ocean ?? 0
	}, "good");
	else log(state, `Кормовая база: ${state.foodBank}.`, "log.bank", { bank: state.foodBank }, "good");
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
		sheltered: false,
		hibernated: []
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
			passTurnTo(state, id);
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
		log(state, `Бешенство: животное игрока ${p.name} обязано атаковать в этот раунд!`, "log.rage", { name: p.name }, "hunt");
		return;
	}
	const crazy = p.animals.find((a) => hasMark(a, "madness"));
	if (crazy) {
		returnMarksToPoolSingle(state, crazy, "madness");
		state.madTurn = id;
		log(state, `Безумие: раунд игрока ${p.name} проводит сосед справа.`, "log.madness", { name: p.name }, "bad");
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
	log(state, `${p.name} берёт еду из базы (${bankOf(state, zone)} осталось).`, "log.takeBank", {
		name: p.name,
		left: bankOf(state, zone)
	});
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
		log(state, `${owner.name}: лекарственное растение — животное накормлено, свойства не действуют до конца фазы.`, "log.medicinal", { name: owner.name });
	} else {
		giveFood(state, animal, 1, "red", {
			triggerComm: false,
			triggerCoop: true
		});
		triggerPartnerEffectsFromPlant(state, animal, plant);
	}
	log(state, `${owner.name}: фишка с растения ${PLANTS[plant.kind].name} (осталось ${plant.food}).`, "log.takePlant", {
		name: owner.name,
		plant: plant.kind,
		left: plant.food
	});
	if (plantHasTrait(plant, "nutritious")) {
		giveFood(state, animal, 1, "blue", { triggerCoop: true });
		ev(state, {
			kind: "blueFood",
			animalId: animal.id,
			reason: "nutritious"
		});
		log(state, `Питательное растение: ещё одна (синяя) фишка.`, "log.nutritious", void 0, "good");
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
		givePlantFood(state, other, plant);
		const op = ownerOf(state, other.id);
		log(state, `Взаимодействие: ${op.name} берёт фишку с того же растения.`, "log.commTakePlant", { name: op.name });
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
	log(state, `Медонос: ${me.name} вытягивает карту у ${target.name}.`, "log.honeyPlant", {
		name: me.name,
		target: target.name
	}, "good");
}
/** Продолжить контратаку после выбора: оставшиеся защиты действуют. */
function continuePlantCounter(state) {
	const atk = state.pendingAttack;
	const plant = mustFindPlant(state, atk.plantId);
	const prey = mustFind(state, atk.preyId);
	atk.choosingPlantDefense = false;
	atk.waitingFor = prey.ownerId;
	if (!canPlantAttackTarget(state, plant, {
		...prey,
		traits: prey.traits.filter((t) => t.id !== atk.ignoredTraitId)
	})) {
		givePlantFood(state, prey, plant);
		state.pendingAttack = null;
		maybeEndTurn(state);
		return;
	}
	if (defenseOptions(state, prey, atk).length === 0) resolveNoDefense(state);
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
	if (plant.kind === "carnivorous" && !plant.attackedThisYear && !a.sheltered) {
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
		log(state, `Хищное растение контратакует ${p.name}!`, "log.plantCounter", { name: p.name }, "hunt");
		if (plantCounterDefenses(a).length) {
			atk.choosingPlantDefense = true;
			const seat = state.players.findIndex((x) => x.id === a.ownerId);
			atk.waitingFor = state.players[(seat + state.players.length - 1) % state.players.length].id;
		} else continuePlantCounter(state);
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
	log(state, `${owner.name}: фишка с карты ${FLORA[flora.kind].name} (осталось ${flora.food}).`, "log.takeFlora", {
		name: owner.name,
		flora: flora.kind,
		left: flora.food
	});
	const def = FLORA[flora.kind];
	if (def.mark) giveMark(state, animal, def.mark);
}
/**
* «Взаимодействие» от фишки с карты флоры: напарник берёт вторую фишку с той
* же карты — со всеми последствиями способности и меткой.
*/
function triggerPartnerEffectsFromFlora(state, source, flora) {
	if (isAsleep(source)) return;
	for (const t of source.traits) {
		if (!isActive(t) || t.type !== "communication" || !t.pairWith) continue;
		const key = `communication:${t.cardId}`;
		if (firedPairs.has(key)) continue;
		const other = findAnimal(state, t.pairWith);
		if (!other || other.hibernating) continue;
		if (!canReceiveFood(state, other) || !canFeedOnFlora(state, other, flora)) continue;
		firedPairs.add(key);
		takeFloraToken(state, other, flora);
		const op = ownerOf(state, other.id);
		log(state, `Взаимодействие: ${op.name} берёт фишку с той же карты флоры.`, "log.commTakeFlora", { name: op.name });
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
				log(state, `Гриб прозрения: ${owner.name} сбрасывает всю руку (${lost} карт).`, "log.insight", {
					name: owner.name,
					lost
				}, "bad");
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
				log(state, `Окрыляющий гриб: ${dropped} парных свойств уходят в сброс.`, "log.soaringDrop", { dropped }, "bad");
			}
			giveFood(state, animal, 1, "blue");
			ev(state, {
				kind: "blueFood",
				animalId: animal.id,
				reason: "soaring"
			});
			log(state, `Окрыляющий гриб: животное получает 1 синюю фишку.`, "log.soaringFood", void 0, "good");
			return;
		}
		case "cleanser": {
			animal.food = 0;
			animal.blueFood = 0;
			const cleared = (animal.marks ?? []).length;
			returnMarksToPool(state, animal);
			log(state, `Очистительная трава: ${owner.name} оставляет одну фишку, прочие сняты${cleared ? `, меток снято: ${cleared}` : ""}.`, cleared ? "log.cleanserMarks" : "log.cleanser", {
				name: owner.name,
				...cleared ? { marks: cleared } : {}
			}, "bad");
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
				no: nextAnimalNo(owner),
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
			log(state, `Страстоцвет: свойство «${TRAITS[trait.type].name}» становится новым животным ${owner.name}.`, "log.passionflower", {
				trait: trait.type,
				name: owner.name
			}, "good");
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
		log(state, `${p.name}: «Короед» — убежище превращается в синюю фишку еды.`, "log.barkBeetle", { name: p.name }, "bad");
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
	log(state, `${p.name}: животное прячется в убежище (${PLANTS[plant.kind].name}).`, "log.shelter", {
		name: p.name,
		plant: plant.kind
	}, "good");
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
	log(state, `${p.name} направляет хищное растение на животное ${ownerOf(state, prey.id).name}!`, "log.plantAttack", {
		name: p.name,
		target: ownerOf(state, prey.id).name
	}, "hunt");
	if (defenseOptions(state, prey, atk).length === 0) resolveNoDefense(state);
}
/** «Растения»: перекинуть фишку с растения-хозяина на растение-паразит. */
function feedParasitize(state, hostId, parasiteId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const host = mustFindPlant(state, hostId);
	const parasite = mustFindPlant(state, parasiteId);
	if (state.turnUse.foodTaken || state.turnUse.combatUsed || state.turnUse.migrated || state.turnUse.sheltered) return;
	if (parasite.kind !== "parasite" || parasite.hostId !== host.id || host.food <= 1) return;
	if (parasite.food >= PLANTS[parasite.kind].maxFood) return;
	host.food -= 1;
	parasite.food += 1;
	state.turnUse.foodTaken = true;
	log(state, `${p.name}: фишка переходит на растение-паразит.`, "log.parasiteFeed", { name: p.name });
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
		log(state, `Бешеное животное игрока ${p.name} атакует!`, "log.rageAttack", { name: p.name }, "hunt");
		if (defenseOptions(state, prey, atk).length === 0) {
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
	if (defenseOptions(state, prey, atk).length === 0) {
		resolveNoDefense(state);
		return;
	}
	log(state, `${p.name} атакует животное игрока ${ownerOf(state, prey.id).name}!`, "log.hunt", {
		name: p.name,
		target: ownerOf(state, prey.id).name
	}, "hunt");
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
	log(state, `${p.name} пиратствует у ${ownerOf(state, target.id).name}.`, "log.piracy", {
		name: p.name,
		target: ownerOf(state, target.id).name
	}, "hunt");
	maybeEndTurn(state);
}
/** Спячка — действие животного: одна за ход, ход при этом не передаётся. */
function feedHibernate(state, animalId) {
	const p = player(state, state.currentPlayerId);
	spendTurn(state, p.id);
	const a = mustFind(state, animalId);
	if ((state.turnUse.hibernated ?? []).length > 0) return;
	if (a.hibernatedLastYear || state.lastYear || a.hibernating || isFed(a)) return;
	if (!hasTrait(a, "hibernation")) return;
	const sleep = a.traits.find((t) => t.type === "hibernation" && isActive(t));
	if (sleep.hibernationUsedYear !== void 0 && sleep.hibernationUsedYear >= state.year - 1) return;
	sleep.hibernationUsedYear = state.year;
	state.turnUse.hibernated.push(animalId);
	a.hibernating = true;
	log(state, `${p.name} использует спячку.`, "log.hibernation", { name: p.name }, "good");
	maybeEndTurn(state);
}
/** «Закончить ход»: передача хода следующему игроку без паса до конца фазы. */
function feedEndTurn(state) {
	log(state, `${player(state, state.currentPlayerId).name} заканчивает ход.`, "log.endTurn", { name: player(state, state.currentPlayerId).name });
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
	if (isAsleep(a)) return;
	if (!hasTrait(a, "fatTissue")) return;
	const n = Math.min(amount, a.fatTokens);
	a.fatTokens -= n;
	a.food += n;
	a.blueFood += n;
	ev(state, {
		kind: "blueFood",
		animalId: a.id,
		reason: "fat"
	});
	log(state, `${p.name} тратит жировой запас (${n}). Ход продолжается.`, "log.fat", {
		name: p.name,
		n
	});
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
		log(state, `${p.name}: топтун уничтожает фишку с карты ${FLORA[f.kind].name} (осталось ${f.food}).`, "log.grazeFlora", {
			name: p.name,
			flora: f.kind,
			left: f.food
		});
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
		log(state, `${p.name}: топтун уничтожает фишку растения ${PLANTS[plant.kind].name} (осталось ${plant.food}).`, "log.grazePlant", {
			name: p.name,
			plant: plant.kind,
			left: plant.food
		});
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
	log(state, `${p.name}: топотун уничтожает ${burnBank} ед. еды. База: ${bankOf(state, a.zoneId)}.`, "log.grazeBank", {
		name: p.name,
		burned: burnBank,
		bank: bankOf(state, a.zoneId)
	});
	maybeEndTurn(state);
}
/**
* «Миграция»: отдельный ход питания. Переезжают объявленные животные со
* свойством «миграция», за каждым могут прицепиться прилипалы (в т.ч. чужие).
* В этот ход больше ничего нельзя: ни есть, ни охотиться.
*/
function migrationTurnAvailable(state) {
	const u = state.turnUse;
	return state.phase === "feeding" && !state.pendingAttack && !u.migrated && !u.foodTaken && !u.combatUsed && !u.sheltered && !u.grazers.length && !u.hibernated.length && state.turnTerritory === void 0;
}
function feedMigrate(state, moves) {
	if (!state.modules.continents || !migrationTurnAvailable(state)) return;
	const p = player(state, state.currentPlayerId);
	if (!moves.length || new Set(moves.map((m) => m.animalId)).size !== moves.length || moves.some((m) => {
		const a = findAnimal(state, m.animalId);
		return !a || a.ownerId !== p.id || !canMigrate(state, a) || !migrationTargets(state, a).includes(m.to);
	})) return;
	spendTurn(state, p.id);
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
	log(state, `${p.name} объявляет миграцию (${applied.length} животное(-ых)).`, "log.migrate", {
		name: p.name,
		count: applied.length
	});
	const index = state.players.findIndex((x) => x.id === p.id);
	state.pendingMigration = {
		ownerId: p.id,
		responders: [...state.players.slice(index), ...state.players.slice(0, index)].map((x) => x.id),
		routes: applied,
		followed: applied.map((m) => m.animalId)
	};
	advanceMigrationResponses(state);
}
function legalRemoraActions(state) {
	const pending = state.pendingMigration;
	if (!pending || state.phase !== "feeding") return [];
	const actions = [];
	for (const a of player(state, state.currentPlayerId).animals) {
		if (!hasTrait(a, "remora") || a.hibernating || state.paralyzed?.includes(a.id) || pending.followed.includes(a.id)) continue;
		for (const route of pending.routes) {
			if (a.zoneId !== route.from) continue;
			if ((route.from === "ocean" || route.to === "ocean") && !hasTrait(a, "swimming")) continue;
			actions.push({
				type: "feedRemora",
				animalId: a.id,
				migrantId: route.animalId
			});
		}
	}
	return actions;
}
function advanceMigrationResponses(state) {
	const pending = state.pendingMigration;
	if (!pending) return;
	while (pending.responders.length) {
		state.currentPlayerId = pending.responders[0];
		if (legalRemoraActions(state).length) return;
		pending.responders.shift();
	}
	state.currentPlayerId = pending.ownerId;
	delete state.pendingMigration;
	dropCrossTerritoryPairs(state);
	maybeEndTurn(state);
}
function finishMigration(state) {
	if (!state.pendingMigration || state.phase !== "feeding") return;
	state.pendingMigration.responders.shift();
	advanceMigrationResponses(state);
}
function feedRemora(state, action) {
	if (!legalRemoraActions(state).some((a) => a.animalId === action.animalId && a.migrantId === action.migrantId)) return;
	const pending = state.pendingMigration;
	const route = pending.routes.find((r) => r.animalId === action.migrantId);
	const a = mustFind(state, action.animalId);
	a.zoneId = route.to;
	pending.followed.push(a.id);
	ev(state, {
		kind: "migrated",
		moves: [{
			animalId: a.id,
			from: route.from,
			to: route.to
		}]
	});
	advanceMigrationResponses(state);
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
			log(state, `Парное свойство разъехавшихся животных уходит в сброс.`, "log.pairSplit");
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
	const group = pairGroup(state, owner.animals[from]);
	const ids = new Set(group.map((a) => a.id));
	const moving = owner.animals.filter((a) => ids.has(a.id));
	const rest = owner.animals.filter((a) => !ids.has(a.id));
	let to = rest.length;
	if (beforeId && !ids.has(beforeId)) {
		const bi = rest.findIndex((a) => a.id === beforeId);
		if (bi >= 0) to = bi;
	}
	owner.animals = [
		...rest.slice(0, to),
		...moving,
		...rest.slice(to)
	];
}
/** Перестановка с переносом между территориями («Континенты», UI перетаскиванием). */
function moveAnimalToZoneHuman(state, animalId, zone) {
	if (!state.modules.continents || state.phase !== "development") return false;
	if (!TERRITORIES.some((t) => t.id === zone)) return false;
	if (ownerOf(state, animalId).id !== state.humanId) return false;
	if (zone === "ocean") return false;
	const a = mustFind(state, animalId);
	for (const member of pairGroup(state, a)) member.zoneId = zone;
	return true;
}
/**
* Переименование своего животного (косметика, как перестановка): имя видят
* все игроки, стабильный номер «№N» не меняется. Пустая строка или одни
* пробелы — сброс на дефолтную подпись. Состояние игры не меняет: ни записей
* в журнал, ни событий — только подпись на карточке.
*/
function renameOwnAnimal(state, animalId, name) {
	if (state.phase !== "development" && state.phase !== "feeding") return;
	const owner = ownerOf(state, animalId);
	if (owner.id !== state.humanId) return;
	const animal = owner.animals.find((a) => a.id === animalId);
	if (!animal) return;
	const clean = name.trim().slice(0, 24);
	if (clean) animal.name = clean;
	else delete animal.name;
}
/** Пас: игрок пропускается, пока не сделает реальное действие (или до конца фазы). */
function skipFeed(state) {
	const p = player(state, state.currentPlayerId);
	p.passedFeed = true;
	ev(state, {
		kind: "passed",
		playerId: p.id
	});
	log(state, `${p.name} пасует.`, "log.passed", { name: p.name });
	advanceFeed(state);
}
function applyDefense(state, action) {
	const atk = state.pendingAttack;
	if (!atk) return;
	if (atk.plantId) {
		if (atk.choosingPlantDefense) {
			if (action.kind !== "ignore") return;
			if (!plantCounterDefenses(findAnimal(state, atk.preyId)).some((t) => t.id === action.ignoredTraitId)) return;
			atk.ignoredTraitId = action.ignoredTraitId;
			const trait = mustFind(state, atk.preyId).traits.find((t) => t.id === action.ignoredTraitId);
			log(state, `Контратака игнорирует «${TRAITS[trait.type].name}».`, "log.plantIgnoreDefense", { trait: trait.type });
			continuePlantCounter(state);
			return;
		}
		if (action.kind === "ignore") return;
		applyPlantDefense(state, action);
		return;
	}
	if (action.kind === "ignore") return;
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
			log(state, `Быстрое: выпало ${roll} — животное спаслось!`, "log.runningEscape", { roll }, "good");
			paralyzeAttacker(state, carnivore, prey);
			state.pendingAttack = null;
			if (atk.rage) advanceFeed(state);
			else maybeEndTurn(state);
			return;
		}
		log(state, `Быстрое: выпало ${roll} — хищник догнал.`, "log.runningCaught", { roll }, "bad");
		if (defenseOptions(state, prey, atk).length === 0) resolveNoDefense(state);
		return;
	}
	if (action.kind === "mimicry" && action.mimicryTargetId) {
		atk.usedDefenses.push("mimicry");
		atk.mimicryChain.push(prey.id);
		atk.preyId = action.mimicryTargetId;
		atk.waitingFor = mustFind(state, action.mimicryTargetId).ownerId;
		atk.usedDefenses = [];
		atk.ignoredTraitId = hazeIgnoreTraitId(state, carnivore, mustFind(state, atk.preyId));
		ev(state, {
			kind: "defenseUsed",
			defense: "mimicry",
			preyId: atk.preyId
		});
		log(state, "Мимикрия перенаправляет атаку.", "log.mimicry");
		if (defenseOptions(state, mustFind(state, atk.preyId), atk).length === 0) resolveNoDefense(state);
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
		paralyzeAttacker(state, carnivore, prey);
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
		log(state, atk.rage ? "Отбрасывание хвоста: животное выжило — бешеное не получает фишку." : "Отбрасывание хвоста: животное выжило, хищник получил 1 фишку.", atk.rage ? "log.tailLossRage" : "log.tailLoss", void 0, "good");
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
			log(state, `Быстрое: выпало ${roll} — животное спаслось!`, "log.runningEscape", { roll }, "good");
			rewardSurvivor();
			return;
		}
		log(state, `Быстрое: выпало ${roll} — растение настигло.`, "log.runningCaughtPlant", { roll }, "bad");
		if (defenseOptions(state, prey, atk).length === 0) resolveNoDefense(state);
		return;
	}
	if (action.kind === "mimicry" && action.mimicryTargetId) {
		atk.usedDefenses.push("mimicry");
		atk.mimicryChain.push(prey.id);
		atk.preyId = action.mimicryTargetId;
		atk.waitingFor = mustFind(state, action.mimicryTargetId).ownerId;
		atk.usedDefenses = [];
		atk.ignoredTraitId = void 0;
		ev(state, {
			kind: "defenseUsed",
			defense: "mimicry",
			preyId: atk.preyId
		});
		log(state, "Мимикрия перенаправляет атаку растения.", "log.mimicryPlant");
		if (defenseOptions(state, mustFind(state, atk.preyId), atk).length === 0) resolveNoDefense(state);
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
		log(state, "Отбрасывание хвоста: животное выжило, растение получило 1 фишку.", "log.tailLossPlant", void 0, "good");
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
			log(state, `Остатки кормовых баз (${total}) сгорают.`, "log.banksBurned", { total });
			for (const [k] of leftovers) state.territoryFood[k] = 0;
			state.foodBank = 0;
		}
	} else if (state.foodBank > 0) {
		ev(state, {
			kind: "bankBurned",
			amount: state.foodBank
		});
		log(state, `Остаток кормовой базы (${state.foodBank}) сгорает.`, "log.bankBurned", { bank: state.foodBank });
		state.foodBank = 0;
	}
	state.phase = "extinction";
	if (state.paralyzed) state.paralyzed = [];
	state.extinctionDeaths = [];
	if (state.modules.randomMutations) for (const a of allAnimals(state)) {
		if (a.hibernating) continue;
		if (a.poisoned && !hasMark(a, "antidote") && (a.population ?? 1) > 1) {
			a.population = (a.population ?? 1) - 1;
			a.poisoned = false;
			a.food = Math.min(a.food, speciesNeed(a));
			a.blueFood = Math.min(a.blueFood, a.food);
			ev(state, {
				kind: "populationLost",
				animalId: a.id,
				to: a.population
			});
			log(state, `Вид ${ownerOf(state, a.id).name} теряет животное от яда (осталось ${a.population}).`, "log.poisonDeath", {
				name: ownerOf(state, a.id).name,
				left: a.population
			}, "bad");
			continue;
		}
		if (isFed(a)) continue;
		const deficit = speciesNeed(a) - a.food;
		if (deficit <= 0 || deficit >= (a.population ?? 1)) continue;
		a.population = (a.population ?? 1) - deficit;
		a.food = Math.min(a.food, speciesNeed(a));
		a.blueFood = Math.min(a.blueFood, a.food);
		ev(state, {
			kind: "populationLost",
			animalId: a.id,
			to: a.population
		});
		log(state, `Вид ${ownerOf(state, a.id).name} теряет ${deficit} животное(-ых) от голода (осталось ${a.population}).`, "log.starved", {
			name: ownerOf(state, a.id).name,
			deficit,
			left: a.population
		}, "bad");
	}
	const doomed = allAnimals(state).filter((a) => a.poisoned && !hasMark(a, "antidote") || hasMark(a, "poison") && !hasMark(a, "antidote") || !isFed(a));
	for (const a of allAnimals(state)) {
		if (doomed.some((d) => d.id === a.id)) state.extinctionDeaths.push(a.id);
		for (const t of a.traits) delete t.paralyzed;
	}
	for (const id of state.extinctionDeaths) {
		const a = findAnimal(state, id);
		if (!a) continue;
		const p = ownerOf(state, id);
		const cause = deathCauseOf(a);
		ev(state, {
			kind: "animalDied",
			animalId: id,
			cause
		});
		log(state, cause === "poison" ? `Хищник ${p.name} погибает от яда.` : cause === "poisonMark" ? `Животное ${p.name} погибает от метки «Яд».` : `Животное ${p.name} вымирает — не накормлено.`, cause === "poison" ? "log.diedPoison" : cause === "poisonMark" ? "log.diedPoisonMark" : "log.diedStarved", { name: p.name }, "bad");
	}
}
/** Почему животное погибает в вымирание. */
function deathCauseOf(a) {
	if (a.poisoned && !hasMark(a, "antidote")) return "poison";
	if (hasMark(a, "poison") && !hasMark(a, "antidote")) return "poisonMark";
	return "starved";
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
		const stack = a.traits.filter((t) => t.id !== neo.id && !t.pairWith && !t.disabled && !(protectedSwim && t.type === "swimming"));
		const next = stack.length ? [...stack].sort((x, y) => a.traits.indexOf(x) - a.traits.indexOf(y))[0] : void 0;
		if (next) {
			next.disabled = true;
			log(state, `Неоплазия выключает свойство «${TRAITS[next.type].name}».`, "log.neoplasiaDisable", { trait: next.type }, "bad");
		}
		if (stack.length <= 1) {
			ev(state, {
				kind: "animalDied",
				animalId: a.id,
				cause: "neoplasia"
			});
			log(state, `Неоплазия поглощает животное ${p.name} целиком.`, "log.neoplasiaDeath", { name: p.name }, "bad");
			discardAnimal(state, a);
			continue;
		}
	}
}
/** Действие continueExtinction: убирает погибших, сбрасывает годовые флаги, добирает карты. */
function continueAfterExtinction(state) {
	if (state.phase !== "extinction") return;
	for (const id of state.extinctionDeaths) {
		const a = findAnimal(state, id);
		if (!a) continue;
		discardAnimal(state, a);
	}
	state.extinctionDeaths = [];
	state.regeneratedThisYear = {};
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
		log(state, `Растение ${PLANTS[pl.kind].name} погибает${pl.doomed ? " — съело ядовитое животное" : pl.kind === "parasite" ? " — вместе с хозяином" : " — съедено дочиста"}.`, pl.doomed ? "log.plantDiedPoison" : pl.kind === "parasite" ? "log.plantDiedHost" : "log.plantDiedEaten", { plant: pl.kind }, "bad");
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
		log(state, `Карта ${FLORA[f.kind].name} без фишек уходит в сброс.`, "log.floraDiscarded", { flora: f.kind }, "bad");
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
		if (!hasTrait(a, "edificator")) continue;
		const zone = a.zoneId ?? "laurasia";
		if (zone === "ocean") continue;
		for (const f of state.flora ?? []) {
			if ((f.zoneId ?? "gondwana") !== zone) continue;
			if (f.food < 4) f.food += 1;
		}
		log(state, `Эдификатор удобряет флору ${zone === "laurasia" ? "Лавразии" : "Гондваны"}.`, zone === "laurasia" ? "log.edificatorFloraLaurasia" : "log.edificatorFloraGondwana", void 0, "good");
	}
	log(state, "Флора: травы подрастают, пустые карты уходят в сброс.", "log.floraGrowth", void 0, "good");
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
		if (!hasTrait(a, "edificator")) continue;
		const zone = a.zoneId ?? "laurasia";
		if (zone === "ocean") continue;
		for (const pl of plants) {
			if ((pl.zoneId ?? "gondwana") !== zone) continue;
			if (pl.food < PLANTS[pl.kind].maxFood) pl.food += 1;
		}
		log(state, `Эдификатор удобряет растения ${zone === "laurasia" ? "Лавразии" : "Гондваны"}.`, zone === "laurasia" ? "log.edificatorPlantsLaurasia" : "log.edificatorPlantsGondwana", void 0, "good");
	}
	addNewPlants(state, plantTable(state.players.length).add);
	log(state, "Фаза роста: растения разрастаются.", "log.plantsGrowth", void 0, "good");
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
	const stats = state.regeneratedThisYear ?? {};
	if (pend?.length) state.pendingRegeneration = null;
	for (const item of pend ?? []) {
		const p = player(state, item.ownerId);
		if (!p) continue;
		if (!item.traits) {
			state.pendingRegeneration = [...state.pendingRegeneration ?? [], item];
			continue;
		}
		const traits = item.traits.map((t) => ({ ...t }));
		const card = p.hand.length ? p.hand.pop() : p.blindDeck?.length ? p.blindDeck.pop() : state.deck.pop();
		if (!card) {
			state.pendingRegeneration = [...state.pendingRegeneration ?? [], item];
			continue;
		}
		const animal = {
			id: nid(state, "a"),
			ownerId: p.id,
			cardId: card.id,
			no: nextAnimalNo(p),
			traits,
			food: 0,
			blueFood: 0,
			fatTokens: 0,
			hibernating: false,
			hibernatedLastYear: false,
			receivedFoodThisYear: false,
			poisoned: false,
			seed: card.id.length * 17 + p.id * 13,
			...state.modules.continents ? { zoneId: item.zoneId ?? "laurasia" } : {}
		};
		p.animals.push(animal);
		if (item.animalId) {
			const linkedTraits = [...allAnimals(state).flatMap((a) => a.traits), ...pend.flatMap((pending) => pending.traits ?? [])];
			for (const t of linkedTraits) if (t.pairWith === item.animalId) t.pairWith = animal.id;
		}
		stats[p.id] = (stats[p.id] ?? 0) + 1;
		ev(state, {
			kind: "regenerated",
			ownerId: p.id
		});
		log(state, `${p.name} восстанавливает регенерировавшее животное.`, "log.regenerated", { name: p.name }, "good");
	}
	state.regeneratedThisYear = stats;
}
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
			let want = Math.max(1, pop - (state.regeneratedThisYear?.[p.id] ?? 0) + 2);
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
		let want = Math.max(1, p.animals.length - (state.regeneratedThisYear?.[p.id] ?? 0) + 1);
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
	passTurnTo(state, state.firstPlayerId);
	state.year += 1;
	state.phase = "development";
	state.devStartPlaySeq = state.playSeq;
	log(state, state.lastYear ? `Год ${state.year} — последний. Первым ходит ${player(state, state.firstPlayerId).name}.` : `Год ${state.year}. Первым ходит ${player(state, state.firstPlayerId).name}. Колода: ${state.deck.length}.`, state.lastYear ? "log.newYearLast" : "log.newYear", state.lastYear ? {
		year: state.year,
		name: player(state, state.firstPlayerId).name
	} : {
		year: state.year,
		name: player(state, state.firstPlayerId).name,
		deck: state.deck.length
	}, state.lastYear ? "bad" : "good");
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
		no: nextAnimalNo(p),
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
		for (const pending of state.pendingRegeneration ?? []) {
			if (pending.ownerId !== p.id) continue;
			for (const t of pending.traits ?? []) {
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
			state.phase = "gameOver";
			log(state, `Победа: Трава и грибы (${total} очков).`, "log.floraWin", { total }, "good");
			ev(state, {
				kind: "gameFinished",
				winnerIds: state.winnerIds
			});
			return;
		}
	}
	state.phase = "gameOver";
	log(state, winners.length > 1 ? `Ничья: ${winners.map((w) => w.name).join(", ")}.` : `Победа: ${winners[0].name} (${winners[0].total} очков).`, winners.length > 1 ? "log.draw" : "log.win", winners.length > 1 ? { names: winners.map((w) => w.name).join(", ") } : {
		name: winners[0].name,
		total: winners[0].total
	}, "good");
	ev(state, {
		kind: "gameFinished",
		winnerIds: state.winnerIds
	});
}
function currentActor(state) {
	if (state.phase === "gameOver") return null;
	if (state.pendingAttack) return player(state, state.pendingAttack.waitingFor);
	if (state.phase === "foodBank" || state.phase === "extinction" || state.phase === "growth") return null;
	return player(state, state.currentPlayerId);
}
/** Undated publisher FAQ (rightgames.ru faq.docx, file dated 2019-08-01, revision 3).
* Grass and Fungi is incompatible with Plants and Random Mutations.
* Validate new settings/start only; never normalize persisted games silently.
*/
function moduleCompatibilityError(modules, lang = "ru") {
	if (!modules.fungi || !modules.plants && !modules.randomMutations) return null;
	return lang === "en" ? "Grass and Fungi cannot be combined with Plants or Random Mutations. Turn off the incompatible modules before starting." : "«Трава и грибы» несовместима с «Растениями» и «Случайными мутациями». Выключите несовместимые дополнения перед началом партии.";
}
//#endregion
export { kickWaiterInput as A, reactionInput as B, foodNeeded as C, isFed as D, isCarnivoreLike as E, liveScore as F, setRoomPrivacyInput as G, setColorInput as H, moduleCompatibilityError as I, spectateInput as J, settingsInput as K, nextRandom as L, legalDevActions as M, legalFeedActions as N, joinRoomInput as O, listRoomsInput as P, player as R, findAnimal as S, hasTrait as T, setNameInput as U, roomInfoInput as V, setPasswordInput as W, transferHostInput as X, spectatorPollInput as Y, typingInput as Z, createGame as _, REACTION_EMOJI as a, deckSizeFor as b, applyAction as c, canPlantAttackTarget as d, canRageAttack as f, colorForSeat as g, codeTokenInput as h, PLAYER_COLORS as i, legalDefenseActions as j, kickInput as k, botsInput as l, chatInput as m, CODE_ALPHABET as n, actionInput as o, capacityInput as p, speciesNeed as q, PACE as r, animalValue as s, AI_NAMES as t, canAttack as u, createRoomInput as v, hasMark as w, feedBlockReasonInfo as x, currentActor as y, pollInput as z };
