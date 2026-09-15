import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { B as pollInput, C as createRoomInput, F as legalDefenseActions, G as spectateInput, H as roomInfoInput, I as legalDevActions, K as spectatorPollInput, L as legalFeedActions, M as joinRoomInput, N as kickInput, P as kickWaiterInput, S as createGame, U as settingsInput, V as reactionInput, b as chooseAIAction, f as actionInput, m as botsInput, o as PACE, p as applyAction, q as transferHostInput, v as capacityInput, w as currentActor, x as codeTokenInput, y as chatInput } from "./ai-Cj12FNHE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DcBzcFHw.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";
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
/** Очередь ожидающих: предел роста и TTL строки. */
var MAX_WAITERS = 16;
var WAITER_TTL_MS = 72e5;
function makeCode() {
	let s = "";
	for (let i = 0; i < 4; i++) s += CODE_ALPHABET[Math.floor(Math.random() * 23)];
	return s;
}
function makeToken() {
	return crypto.randomUUID().replace(/-/g, "");
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
            auto_step_at, created_at
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
		created_at: r.created_at
	};
}
async function readSeats(sql, code) {
	return sql.query(`select seat, name, is_ai, last_seen_at, token
       from evo_seats where room_code = $1 order by seat`, [code]);
}
async function readWaiters(sql, code) {
	return sql.query(`select token, name, (extract(epoch from created_at) * 1000)::float8 as at
       from evo_waiters where room_code = $1 order by created_at, token`, [code]);
}
function waiterInfos(rows) {
	return rows.map((w) => ({
		name: w.name,
		at: w.at
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
* Хост: сохранённый host_seat, если это место человека; иначе минимальное
* место среди людей онлайн, иначе минимальное место человека, иначе 0.
* Передача хоста при выходе сохраняется через persistHost (см. poll).
*/
function metaOf(room, seats, now) {
	const humans = seats.filter((s) => !s.is_ai).map((s) => s.seat);
	const onlineHumans = seats.filter((s) => !s.is_ai && now() - toMs(s.last_seen_at) < PACE.onlineMs).map((s) => s.seat);
	const saved = room.host_seat;
	const hostSeat = saved !== null && humans.includes(saved) ? saved : onlineHumans.length ? Math.min(...onlineHumans) : humans.length ? Math.min(...humans) : 0;
	return {
		code: room.code,
		status: room.status,
		capacity: room.capacity,
		hostSeat,
		settings: effectiveSettings(room)
	};
}
function seatsInfo(seats, now) {
	return seats.map((s) => ({
		seat: s.seat,
		name: s.name,
		isAI: s.is_ai,
		online: now() - toMs(s.last_seen_at) < PACE.onlineMs
	}));
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
	return (await sql.query(`select token, name, last_seen_at from evo_spectators where room_code = $1 order by created_at`, [code])).map((s) => ({
		name: s.name,
		online: now() - toMs(s.last_seen_at) < PACE.onlineMs
	}));
}
async function readReactions(sql, code, sinceId) {
	const clause = sinceId === void 0 ? "" : "and id > $2";
	const params = sinceId === void 0 ? [code] : [code, sinceId];
	return (await sql.query(`select id::int as id, name, emoji, kind, target_seat,
            (extract(epoch from created_at) * 1000)::float8 as at
       from evo_reactions where room_code = $1 ${clause} order by id desc limit 60`, params)).reverse().map((r) => ({
		id: r.id,
		name: r.name,
		emoji: r.emoji,
		kind: r.kind,
		targetSeat: r.target_seat,
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
	if (fields.autoStepAt !== void 0) push("auto_step_at =", fields.autoStepAt === null ? null : new Date(fields.autoStepAt).toISOString());
	if (fields.capacity !== void 0) push("capacity =", fields.capacity);
	if (fields.difficulty !== void 0) push("difficulty =", fields.difficulty);
	if (fields.modules !== void 0) push("modules =", JSON.stringify(fields.modules), "::jsonb");
	if (fields.settings !== void 0) push("settings =", JSON.stringify(fields.settings), "::jsonb");
	if (fields.hostSeat !== void 0) push("host_seat =", fields.hostSeat);
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
	throw new NetError("Стол изменился, попробуйте ещё раз");
}
async function janitor(sql) {
	await sql.query(`delete from evo_seats where room_code in
       (select code from evo_rooms where created_at < now() - interval '12 hours')`);
	await sql.query(`delete from evo_rooms where created_at < now() - interval '12 hours'`);
	await sql.query(`delete from evo_waiters where room_code not in (select code from evo_rooms)
        or created_at < now() - interval '2 hours'`);
	await sql.query(`delete from evo_kicks where created_at < now() - interval '12 hours'`);
}
/** Следующий шаг, который сервер делает сам; null — ждём ход человека. */
function nextAutoStep(state) {
	if (state.phase === "foodBank") return state.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" };
	if (state.phase === "extinction") return { type: "continueExtinction" };
	if (state.phase === "growth") return { type: "continueGrowth" };
	const actor = currentActor(state);
	if (!actor || !actor.isAI && state.madTurn !== actor.id) return null;
	const pick = chooseAIAction(state);
	if (pick) return pick;
	return state.phase === "development" ? { type: "devPass" } : state.pendingAttack ? {
		type: "chooseDefense",
		kind: "none"
	} : { type: "feedSkip" };
}
function stepDelay(before, step, after) {
	const j = () => Math.round((Math.random() * 2 - 1) * PACE.jitterMs);
	if (step.type === "rollFoodBank") return PACE.diceMs + j();
	if (step.type === "continueExtinction") return PACE.extinctMs + j();
	if (step.type === "continueGrowth") return PACE.extinctMs + j();
	const changedTurn = before.currentPlayerId !== after.currentPlayerId;
	return PACE.botMs + (changedTurn ? PACE.turnGapMs : 0) + j();
}
var ID_KEYS = [
	"cardId",
	"face",
	"animalId",
	"a",
	"b",
	"carnivoreId",
	"preyId",
	"pirateId",
	"targetId",
	"plantId",
	"hostId",
	"parasiteId"
];
function sameAction(a, b) {
	if (a.type !== b.type) return false;
	for (const k of ID_KEYS) {
		const av = a[k];
		if (av !== void 0 && av !== b[k]) return false;
	}
	if (a.type === "chooseDefense") {
		const bb = b;
		return a.kind === bb.kind && a.mimicryTargetId === bb.mimicryTargetId && a.discardTraitId === bb.discardTraitId;
	}
	return true;
}
function createRoomService(sql, opts = {}) {
	const now = opts.now ?? (() => Date.now());
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
		const seat = (await sql.query(`select seat, name, is_ai, last_seen_at, token from evo_seats
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
		if (p.isAi) throw new NetError("Боты не пишут в чат");
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
	async function requireHost(code, token, deny) {
		const room = await requireRoom(code);
		const me = await participantSeat(code, token);
		const seats = await readSeats(sql, code);
		if (metaOf(room, seats, now).hostSeat !== me.seat) throw new NetError(deny);
		return {
			room,
			seats,
			me
		};
	}
	async function insertBots(code, capacity, count) {
		const target = freeSeatList(capacity, await readSeats(sql, code)).slice(-count);
		for (let i = 0; i < target.length; i++) await sql.query(`insert into evo_seats (room_code, seat, name, token, is_ai)
         values ($1, $2, $3, '', true) on conflict do nothing`, [
			code,
			target[i],
			`Бот ${i + 1}`
		]);
	}
	/** Постановка в очередь ожидающих с ограничением роста. */
	async function enqueueWaiter(code, name) {
		if (((await sql.query(`select count(*)::int as n from evo_waiters where room_code = $1`, [code]))[0]?.n ?? 0) >= MAX_WAITERS) throw new NetError("Очередь на этот стол переполнена — попробуйте позже");
		const token = makeToken();
		await sql.query(`insert into evo_waiters (room_code, token, name) values ($1, $2, $3)
       on conflict (room_code, token) do update set name = excluded.name`, [
			code,
			token,
			name
		]);
		return {
			seat: -1,
			token,
			waiting: true
		};
	}
	/**
	* Хост не должен «зависать» на вышедшем игроке: если сохранённый хост
	* не онлайн, передаём место следующему онлайн-человеку и сохраняем это.
	* Best-effort: гонку версий разрешает следующий poll.
	*/
	async function persistHost(code, room, seats) {
		const onlineHumans = seats.filter((s) => !s.is_ai && now() - toMs(s.last_seen_at) < PACE.onlineMs).map((s) => s.seat);
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
				if (room.auto_step_at !== null) await casUpdate(sql, code, room.version, { autoStepAt: null }).catch(() => false);
				return;
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
			room: metaOf(room, seats, now),
			seats: seatsInfo(seats, now),
			seat,
			state: full && room.status !== "lobby" ? viewFor(full, seat) : null,
			events,
			chat,
			waiters: waiterInfos(waiters),
			spectators,
			reactions
		};
	}
	return {
		async create(input) {
			if (input.botSeats > input.capacity - 1) throw new NetError("Ботов больше, чем свободных мест");
			const token = makeToken();
			const settings = {
				modules: input.modules ?? {},
				difficulty: input.difficulty,
				...input.deckSize ? { deckSize: input.deckSize } : {}
			};
			for (let attempt = 0; attempt < 6; attempt++) {
				const code = makeCode();
				try {
					await sql.query(`insert into evo_rooms (code, capacity, difficulty, seed, modules, settings, host_seat)
             values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, 0)`, [
						code,
						input.capacity,
						input.difficulty,
						Math.floor(Math.random() * 1e6),
						JSON.stringify(input.modules ?? {}),
						JSON.stringify(settings)
					]);
					try {
						await sql.query(`insert into evo_seats (room_code, seat, name, token)
               values ($1, 0, $2, $3)`, [
							code,
							input.name,
							token
						]);
						if (input.botSeats > 0) await insertBots(code, input.capacity, input.botSeats);
					} catch (e) {
						await sql.query(`delete from evo_rooms where code = $1`, [code]).catch(() => {});
						throw e;
					}
					return {
						code,
						seat: 0,
						token
					};
				} catch (e) {
					if (!isUniqueViolation(e)) throw e;
				}
			}
			throw new NetError("Не удалось выдать код стола — попробуйте ещё раз");
		},
		async join({ code, name }) {
			for (let attempt = 0; attempt < 3; attempt++) {
				const room = await requireRoom(code);
				if (room.status !== "lobby") throw new NetError("Партия уже началась");
				const seats = await readSeats(sql, code);
				const free = firstFreeSeat(room.capacity, seats);
				if (free < 0) return enqueueWaiter(code, name);
				const token = makeToken();
				if ((await sql.query(`insert into evo_seats (room_code, seat, name, token)
           values ($1, $2, $3, $4)
           on conflict (room_code, seat) do nothing
           returning seat`, [
					code,
					free,
					name,
					token
				])).length === 1) return {
					seat: free,
					token,
					waiting: false
				};
			}
			return enqueueWaiter(code, name);
		},
		async setBots({ code, token, count }) {
			const { room, seats } = await requireHost(code, token, "Ботов добавляет хост");
			if (room.status !== "lobby") throw new NetError("Партия уже началась");
			const humans = seats.filter((s) => !s.is_ai).length;
			const clamped = Math.max(0, Math.min(count, room.capacity - humans));
			await sql.query(`delete from evo_seats where room_code = $1 and is_ai`, [code]);
			if (clamped > 0) await insertBots(code, room.capacity, clamped);
		},
		async kick(code, token, seatNo) {
			const { room, seats, me } = await requireHost(code, token, "Кикать игроков может только хост");
			if (seatNo === me.seat) throw new NetError("Себя удалить нельзя");
			const victim = seats.find((s) => s.seat === seatNo);
			if (!victim) throw new NetError("Это место уже свободно");
			if (victim.is_ai) throw new NetError("Ботов убирают кнопкой «Бот»");
			if (room.status === "lobby") await sql.query(`delete from evo_seats where room_code = $1 and seat = $2`, [code, seatNo]);
			else if (room.status === "playing" && room.state) {
				const state = structuredClone(room.state);
				const p = state.players[seatNo];
				if (p) {
					p.isAI = true;
					p.name = `Бот ${seatNo + 1}`;
				}
				await casUpdateStrict(sql, code, room.version, { state });
				await sql.query(`update evo_seats set is_ai = true, name = $3, token = '', last_seen_at = now()
            where room_code = $1 and seat = $2`, [
					code,
					seatNo,
					`Бот ${seatNo + 1}`
				]);
			} else throw new NetError("Партия уже закончена");
			await sql.query(`insert into evo_kicks (room_code, token) values ($1, $2) on conflict do nothing`, [code, victim.token]);
		},
		async setCapacity(code, token, capacity) {
			const { room, seats } = await requireHost(code, token, "Менять число мест может только хост");
			if (room.status !== "lobby") throw new NetError("Места меняют до начала партии");
			const humans = seats.filter((s) => !s.is_ai).length;
			if (capacity < humans) throw new NetError(`За столом ${humans} игроков — уберите лишних или поднимите число мест`);
			await sql.query(`delete from evo_seats where room_code = $1 and is_ai and seat >= $2`, [code, capacity]);
			await casUpdateStrict(sql, code, room.version, { capacity });
		},
		async setSettings(code, token, patch) {
			const { room } = await requireHost(code, token, "Менять настройки может только хост");
			if (room.status !== "lobby") throw new NetError("Настройки меняют до начала партии");
			const next = { ...effectiveSettings(room) };
			if (patch.modules !== void 0) next.modules = { ...patch.modules };
			if (patch.difficulty !== void 0) next.difficulty = patch.difficulty;
			if (patch.deckSize !== void 0) next.deckSize = patch.deckSize;
			await casUpdateStrict(sql, code, room.version, {
				settings: next,
				difficulty: next.difficulty ?? room.difficulty,
				modules: next.modules ?? room.modules ?? {}
			});
		},
		async transferHost(code, token, seatNo) {
			const { room, seats } = await requireHost(code, token, "Передавать хоста может только хост");
			if (room.status !== "lobby") throw new NetError("Хоста передают до начала партии");
			const target = seats.find((s) => s.seat === seatNo);
			if (!target || target.is_ai) throw new NetError("Хостом может стать только человек за столом");
			await casUpdateStrict(sql, code, room.version, { hostSeat: seatNo });
		},
		async kickWaiter(code, token, index) {
			await requireHost(code, token, "Убирать ожидающих может только хост");
			const target = (await readWaiters(sql, code))[index];
			if (!target) throw new NetError("Такого ожидающего уже нет");
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
				if ((await sql.query(`select 1 from evo_kicks where room_code = $1 and token = $2 limit 1`, [code, token])).length) throw new NetError("Вас удалили из-за стола", "kicked");
			}
			const free = firstFreeSeat(room.capacity, seats);
			return {
				room: metaOf(room, seats, now),
				seats: seatsInfo(seats, now),
				waiters: waiterInfos(waiters),
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
			if (room.status !== "lobby") throw new NetError("Партия уже началась");
			const w = await sql.query(`select name from evo_waiters where room_code = $1 and token = $2`, [code, token]);
			if (!w[0]) return goneReason(code, token);
			for (let attempt = 0; attempt < 3; attempt++) {
				const seats = await readSeats(sql, code);
				const free = firstFreeSeat(room.capacity, seats);
				if (free < 0) throw new NetError("Свободных мест пока нет");
				const seatToken = makeToken();
				if ((await sql.query(`insert into evo_seats (room_code, seat, name, token)
           values ($1, $2, $3, $4)
           on conflict (room_code, seat) do nothing
           returning seat`, [
					code,
					free,
					w[0].name,
					seatToken
				])).length === 1) {
					await sql.query(`delete from evo_waiters where room_code = $1 and token = $2`, [code, token]);
					return {
						seat: free,
						token: seatToken
					};
				}
			}
			throw new NetError("Место только что заняли — попробуйте ещё раз");
		},
		async leaveQueue(code, token) {
			await sql.query(`delete from evo_waiters where room_code = $1 and token = $2`, [code, token]).catch(() => {});
		},
		async chat(code, token, text) {
			await requireRoom(code);
			const author = await participant(code, token);
			const clean = text.trim().slice(0, CHAT_MAX_LEN);
			if (!clean) throw new NetError("Пустое сообщение");
			const r = (await sql.query(`select
           (select count(*)::int from evo_chat
             where room_code = $1 and seat = $2 and created_at > now() - interval '1 minute') as recent,
           (select coalesce((extract(epoch from (now() - max(created_at))) * 1000)::int, 1000000)
              from evo_chat where room_code = $1 and seat = $2) as since_ms`, [code, author.seat]))[0];
			if (r && r.recent >= CHAT_PER_MINUTE) throw new NetError("Слишком много сообщений — подождите минуту");
			if (r && r.since_ms < CHAT_MIN_GAP_MS) throw new NetError("Слишком часто — подождите секунду");
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
		async spectate(code, name) {
			await requireRoom(code);
			const clean = name.trim().slice(0, 16);
			if (!clean) throw new NetError("Введите имя зрителя");
			const token = makeToken();
			await sql.query(`insert into evo_spectators (room_code, token, name) values ($1, $2, $3)`, [
				code,
				token,
				clean
			]);
			return { token };
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
				reactions
			};
		},
		async reaction(code, token, emoji, kind, targetSeat) {
			await requireRoom(code);
			const author = await participant(code, token);
			const lim = (await sql.query(`select
           (select count(*)::int from evo_reactions
             where room_code = $1 and name = $2 and created_at > now() - interval '1 minute') as recent,
           (select coalesce((extract(epoch from (now() - max(created_at))) * 1000)::int, 1000000)
              from evo_reactions where room_code = $1 and name = $2) as since_ms`, [code, author.name]))[0];
			if (lim && lim.recent >= REACTION_PER_MINUTE) throw new NetError("Слишком много реакций — подождите минуту");
			if (lim && lim.since_ms < REACTION_MIN_GAP_MS) throw new NetError("Слишком часто — подождите секунду");
			const r = (await sql.query(`insert into evo_reactions (room_code, name, emoji, kind, target_seat)
         values ($1, $2, $3, $4, $5)
         returning id::int as id, name, emoji, kind, target_seat,
                   (extract(epoch from created_at) * 1000)::float8 as at`, [
				code,
				author.name,
				emoji,
				kind,
				targetSeat ?? null
			]))[0];
			return {
				id: r.id,
				name: r.name,
				emoji: r.emoji,
				kind: r.kind,
				targetSeat: r.target_seat,
				at: r.at
			};
		},
		async rejoin(code, token) {
			return snapshot(code, (await seatByToken(code, token)).seat);
		},
		async start(code, token) {
			const { room, seats, me } = await requireHost(code, token, "Начать партию может хост");
			if (room.status !== "lobby") throw new NetError("Партия уже началась");
			if (seats.length !== room.capacity) throw new NetError("Заполните все места — людьми или ботами");
			const cfg = effectiveSettings(room);
			const defs = seats.map((s) => ({
				name: s.name,
				isAI: s.is_ai
			}));
			const state = createGame(room.capacity, cfg.difficulty ?? room.difficulty, Math.floor(Math.random() * 1e6), defs, cfg.modules ?? room.modules ?? {}, cfg.deckSize);
			await casUpdateStrict(sql, code, room.version, {
				state,
				status: "playing",
				autoStepAt: now() + PACE.initialMs,
				events: []
			});
			return snapshot(code, me.seat);
		},
		async action(code, token, sent) {
			const room = await requireRoom(code);
			const me = await seatByToken(code, token);
			if (room.status !== "playing" || !room.state) throw new NetError("Партия не идёт");
			const st = room.state;
			if (!(st.pendingAttack && st.pendingAttack.waitingFor === me.seat ? legalDefenseActions(st, me.seat) : st.phase === "development" ? legalDevActions(st, me.seat) : st.phase === "feeding" ? legalFeedActions(st, me.seat) : []).some((a) => sameAction(a, sent))) throw new NetError("Такой ход сейчас недопустим");
			const next = applyAction(st, sent);
			const finished = next.phase === "gameOver";
			const needsAuto = !finished && nextAutoStep(next) !== null;
			await casUpdateStrict(sql, code, room.version, {
				state: next,
				status: finished ? "finished" : void 0,
				autoStepAt: finished ? null : needsAuto ? now() : null,
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
					hostSeat: metaOf(room, seats, now).hostSeat,
					capacity: room.capacity,
					waiters: waiterInfos(waiters),
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
			const room = await requireRoom(code);
			if ((await seatByToken(code, token)).is_ai) throw new NetError("Только человек может начать новую партию");
			if (room.status !== "finished") throw new NetError("Партия ещё не закончена");
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
* Та же схема, что в migrations/0002_net_rooms.sql, 0003_room_modules.sql и
* 0004_room_host.sql, но исполняется и в рантайме: на Vercel `db:migrate`
* выполняется на этапе билда и молча пропускается, если DATABASE_URL не был
* виден процессу сборки. Идемпотентно — можно вызывать всегда.
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
alter table evo_rooms add column if not exists modules jsonb not null default '{}';
alter table evo_rooms add column if not exists host_seat int;
alter table evo_rooms add column if not exists settings jsonb not null default '{}';
alter table evo_rooms add column if not exists events jsonb not null default '[]';
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
*/
function getRoomService() {
	const g = globalThis;
	g.__evoNetService__ ??= import("./db-Dyb4pt2e.mjs").then(async ({ getSql }) => {
		const sql = await getSql();
		for (const statement of splitStatements(NET_TABLES_DDL)) await sql.query(statement);
		return createRoomService(sql);
	});
	return g.__evoNetService__;
}
/**
* Клиентские вызовы сетевого слоя: createServerFn-обёртки над сервисом
* комнат. Ошибки сервиса (NetError) отдаются полем `error`, а не броском —
* чтобы текст доходил до UI без разбора формата ошибок TanStack Start.
* Машиночитаемый `code` (kicked/seat-taken/room-gone) позволяет сессии
* отличить «чинить связь» от «места больше нет».
*/
var fail = (e) => ({
	ok: false,
	error: e instanceof NetError || e instanceof Error ? e.message : "Сеть недоступна, попробуйте ещё раз",
	code: e instanceof NetError ? e.code : void 0
});
var netCreateRoom_createServerFn_handler = createServerRpc({
	id: "5d10ae946134fb6b27bc7c68ea783639ad617431c539331dc58524d97407b4bb",
	name: "netCreateRoom",
	filename: "src/lib/net/api.ts"
}, (opts) => netCreateRoom.__executeServer(opts));
var netCreateRoom = createServerFn({ method: "POST" }).validator(createRoomInput).handler(netCreateRoom_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).create(data)
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
var netJoinRoom = createServerFn({ method: "POST" }).validator(joinRoomInput).handler(netJoinRoom_createServerFn_handler, async ({ data }) => {
	try {
		const s = await getRoomService();
		return {
			ok: true,
			code: data.code,
			...await s.join(data)
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
var netRejoin = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(netRejoin_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			snapshot: await (await getRoomService()).rejoin(data.code, data.token)
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
var netSetBots = createServerFn({ method: "POST" }).validator(botsInput).handler(netSetBots_createServerFn_handler, async ({ data }) => {
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
var netKick = createServerFn({ method: "POST" }).validator(kickInput).handler(netKick_createServerFn_handler, async ({ data }) => {
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
var netSetCapacity = createServerFn({ method: "POST" }).validator(capacityInput).handler(netSetCapacity_createServerFn_handler, async ({ data }) => {
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
var netSetSettings = createServerFn({ method: "POST" }).validator(settingsInput).handler(netSetSettings_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).setSettings(data.code, data.token, data.settings);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netTransferHost_createServerFn_handler = createServerRpc({
	id: "b6e16925f8dea3e55e70b929ead0135b8dbf491c796f2bc20222a71969975540",
	name: "netTransferHost",
	filename: "src/lib/net/api.ts"
}, (opts) => netTransferHost.__executeServer(opts));
var netTransferHost = createServerFn({ method: "POST" }).validator(transferHostInput).handler(netTransferHost_createServerFn_handler, async ({ data }) => {
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
var netKickWaiter = createServerFn({ method: "POST" }).validator(kickWaiterInput).handler(netKickWaiter_createServerFn_handler, async ({ data }) => {
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
var netRoomInfo = createServerFn({ method: "POST" }).validator(roomInfoInput).handler(netRoomInfo_createServerFn_handler, async ({ data }) => {
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
var netClaimSeat = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(netClaimSeat_createServerFn_handler, async ({ data }) => {
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
var netLeaveQueue = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(netLeaveQueue_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).leaveQueue(data.code, data.token);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
var netChat_createServerFn_handler = createServerRpc({
	id: "13eed1a17da62dcb9e70eec71b4e8a976934b02a5dcff01613a937167cd6f9b3",
	name: "netChat",
	filename: "src/lib/net/api.ts"
}, (opts) => netChat.__executeServer(opts));
var netChat = createServerFn({ method: "POST" }).validator(chatInput).handler(netChat_createServerFn_handler, async ({ data }) => {
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
var netSpectate = createServerFn({ method: "POST" }).validator(spectateInput).handler(netSpectate_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			...await (await getRoomService()).spectate(data.code, data.name)
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
var netSpectatorPoll = createServerFn({ method: "POST" }).validator(spectatorPollInput).handler(netSpectatorPoll_createServerFn_handler, async ({ data }) => {
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
var netReaction = createServerFn({ method: "POST" }).validator(reactionInput).handler(netReaction_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			reaction: await (await getRoomService()).reaction(data.code, data.token, data.emoji, data.kind, data.targetSeat)
		};
	} catch (e) {
		return fail(e);
	}
});
var netStart_createServerFn_handler = createServerRpc({
	id: "fafa464b4c4488361c51f863768135107e02c148e255f23da160ffa440fc3f99",
	name: "netStart",
	filename: "src/lib/net/api.ts"
}, (opts) => netStart.__executeServer(opts));
var netStart = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(netStart_createServerFn_handler, async ({ data }) => {
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
var netAction = createServerFn({ method: "POST" }).validator(actionInput).handler(netAction_createServerFn_handler, async ({ data }) => {
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
var netPoll = createServerFn({ method: "POST" }).validator(pollInput).handler(netPoll_createServerFn_handler, async ({ data }) => {
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
var netAgain = createServerFn({ method: "POST" }).validator(codeTokenInput).handler(netAgain_createServerFn_handler, async ({ data }) => {
	try {
		await (await getRoomService()).again(data);
		return { ok: true };
	} catch (e) {
		return fail(e);
	}
});
//#endregion
export { netAction_createServerFn_handler, netAgain_createServerFn_handler, netChat_createServerFn_handler, netClaimSeat_createServerFn_handler, netCreateRoom_createServerFn_handler, netJoinRoom_createServerFn_handler, netKickWaiter_createServerFn_handler, netKick_createServerFn_handler, netLeaveQueue_createServerFn_handler, netPoll_createServerFn_handler, netReaction_createServerFn_handler, netRejoin_createServerFn_handler, netRoomInfo_createServerFn_handler, netSetBots_createServerFn_handler, netSetCapacity_createServerFn_handler, netSetSettings_createServerFn_handler, netSpectate_createServerFn_handler, netSpectatorPoll_createServerFn_handler, netStart_createServerFn_handler, netTransferHost_createServerFn_handler };
