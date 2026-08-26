import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { S as pollInput, _ as joinRoomInput, a as botsInput, b as legalFeedActions, c as chooseAIAction, d as createRoomInput, f as currentActor, i as applyAction, l as codeTokenInput, r as actionInput, t as PACE, u as createGame, v as legalDefenseActions, y as legalDevActions } from "./ai-AwW7_vaR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-Cdy6LvRQ.js
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
function redactEvents(events, seat, full) {
	return events.map((e) => {
		if (e.kind !== "traitPlaced" || !e.hidden) return e;
		const owner = full.players.find((p) => p.animals.some((a) => a.id === e.animalId));
		if (!owner || owner.id === seat) return e;
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
	v.deck = [];
	for (const p of v.players) {
		p.handCount = p.hand.length;
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
*/
var NetError = class extends Error {};
var CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";
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
	const r = (await sql.query(`select code, status, capacity, difficulty, modules, version, state as state_json,
            auto_step_at, created_at
       from evo_rooms where code = $1`, [code]))[0];
	if (!r) return null;
	return {
		...r,
		status: r.status,
		difficulty: r.difficulty,
		modules: r.modules ?? {},
		state: r.state_json ?? null
	};
}
async function readSeats(sql, code) {
	return sql.query(`select seat, name, is_ai, last_seen_at
       from evo_seats where room_code = $1 order by seat`, [code]);
}
/** Хост вычисляется, а не хранится: минимальное место среди людей онлайн. */
function metaOf(room, seats, now) {
	const onlineHumans = seats.filter((s) => !s.is_ai && now() - toMs(s.last_seen_at) < PACE.onlineMs);
	const humans = seats.filter((s) => !s.is_ai).map((s) => s.seat);
	const hostSeat = onlineHumans.length ? Math.min(...onlineHumans.map((s) => s.seat)) : humans.length ? Math.min(...humans) : 0;
	return {
		code: room.code,
		status: room.status,
		capacity: room.capacity,
		hostSeat
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
/**
* Условная запись состояния: применяется только если версия не сменилась.
* Возвращает true при успехе (ровно одна строка обновлена).
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
		if (!fresh) throw new NetError("Стол не найден");
		v = fresh.version;
	}
	throw new NetError("Стол изменился, попробуйте ещё раз");
}
async function janitor(sql) {
	await sql.query(`delete from evo_seats where room_code in
       (select code from evo_rooms where created_at < now() - interval '12 hours')`);
	await sql.query(`delete from evo_rooms where created_at < now() - interval '12 hours'`);
}
/** Следующий шаг, который сервер делает сам; null — ждём ход человека. */
function nextAutoStep(state) {
	if (state.phase === "foodBank") return state.foodRoll ? { type: "beginFeeding" } : { type: "rollFoodBank" };
	if (state.phase === "extinction") return { type: "continueExtinction" };
	const actor = currentActor(state);
	if (!actor || !actor.isAI) return null;
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
	"targetId"
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
		if (!room) throw new NetError("Стол не найден — проверьте код");
		return room;
	}
	async function seatByToken(code, token) {
		const seat = (await sql.query(`select seat, name, is_ai, last_seen_at from evo_seats
        where room_code = $1 and token = $2`, [code, token]))[0];
		if (!seat) throw new NetError("Место не найдено — вернитесь в меню и зайдите заново");
		return seat;
	}
	async function insertBots(code, capacity, count) {
		for (let i = 0; i < count; i++) {
			const seatNo = capacity - count + i;
			await sql.query(`insert into evo_seats (room_code, seat, name, token, is_ai)
         values ($1, $2, $3, '', true) on conflict do nothing`, [
				code,
				seatNo,
				`Бот ${i + 1}`
			]);
		}
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
				autoStepAt: finished ? null : now() + stepDelay(before, step, after)
			})) return;
			if (finished) return;
		}
	}
	async function snapshot(code, seat) {
		const [room, seats] = await Promise.all([readRoom(sql, code), readSeats(sql, code)]);
		if (!room) throw new NetError("Стол не найден — проверьте код");
		return {
			version: room.version,
			room: metaOf(room, seats, now),
			seats: seatsInfo(seats, now),
			seat,
			state: room.state && room.status !== "lobby" ? viewFor(room.state, seat) : null
		};
	}
	return {
		async create(input) {
			const token = makeToken();
			for (let attempt = 0; attempt < 6; attempt++) {
				const code = makeCode();
				try {
					await sql.query(`insert into evo_rooms (code, capacity, difficulty, seed, modules)
             values ($1, $2, $3, $4, $5::jsonb)`, [
						code,
						input.capacity,
						input.difficulty,
						Math.floor(Math.random() * 1e6),
						JSON.stringify(input.modules ?? {})
					]);
					await sql.query(`insert into evo_seats (room_code, seat, name, token)
             values ($1, 0, $2, $3)`, [
						code,
						input.name,
						token
					]);
					if (input.botSeats > 0) await insertBots(code, input.capacity, input.botSeats);
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
				const taken = new Set(seats.map((s) => s.seat));
				let free = -1;
				for (let i = 0; i < room.capacity; i++) if (!taken.has(i)) {
					free = i;
					break;
				}
				if (free < 0) throw new NetError("Мест не осталось");
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
					token
				};
			}
			throw new NetError("Не удалось занять место — попробуйте ещё раз");
		},
		async setBots({ code, token, count }) {
			const room = await requireRoom(code);
			const me = await seatByToken(code, token);
			const seats = await readSeats(sql, code);
			if (metaOf(room, seats, now).hostSeat !== me.seat) throw new NetError("Ботов добавляет хост");
			if (room.status !== "lobby") throw new NetError("Партия уже началась");
			const humans = seats.filter((s) => !s.is_ai).length;
			const clamped = Math.max(0, Math.min(count, room.capacity - humans));
			await sql.query(`delete from evo_seats where room_code = $1 and is_ai`, [code]);
			if (clamped > 0) await insertBots(code, room.capacity, clamped);
		},
		async rejoin(code, token) {
			const me = await seatByToken(code, token);
			const room = await requireRoom(code);
			const seats = await readSeats(sql, code);
			return {
				version: room.version,
				room: metaOf(room, seats, now),
				seats: seatsInfo(seats, now),
				seat: me.seat,
				state: room.state && room.status !== "lobby" ? viewFor(room.state, me.seat) : null
			};
		},
		async start(code, token) {
			const room = await requireRoom(code);
			const me = await seatByToken(code, token);
			const seats = await readSeats(sql, code);
			if (metaOf(room, seats, now).hostSeat !== me.seat) throw new NetError("Начать партию может хост");
			if (room.status !== "lobby") throw new NetError("Партия уже началась");
			if (seats.length !== room.capacity) throw new NetError("Заполните все места — людьми или ботами");
			const defs = seats.map((s) => ({
				name: s.name,
				isAI: s.is_ai
			}));
			const state = createGame(room.capacity, room.difficulty, Math.floor(Math.random() * 1e6), defs, room.modules ?? {});
			await casUpdateStrict(sql, code, room.version, {
				state,
				status: "playing",
				autoStepAt: now() + PACE.initialMs
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
				autoStepAt: needsAuto ? now() : null
			});
			await advance(code);
			return snapshot(code, me.seat);
		},
		async poll(code, token, sinceVersion) {
			if (Math.random() < .05) await janitor(sql).catch(() => {});
			const me = await seatByToken(code, token);
			await sql.query(`update evo_seats set last_seen_at = now() where room_code = $1 and seat = $2`, [code, me.seat]).catch(() => {});
			await advance(code);
			const room = await readRoom(sql, code);
			if (!room) throw new NetError("Стол не найден — проверьте код");
			if (sinceVersion !== void 0 && sinceVersion === room.version) {
				const seats = await readSeats(sql, code);
				return {
					unchanged: true,
					seats: seatsInfo(seats, now),
					hostSeat: metaOf(room, seats, now).hostSeat
				};
			}
			return snapshot(code, me.seat);
		},
		async again({ code, token }) {
			const room = await requireRoom(code);
			if ((await seatByToken(code, token)).is_ai) throw new NetError("Только человек может начать новую партию");
			if (room.status !== "finished") throw new NetError("Партия ещё не закончена");
			await casUpdateStrict(sql, code, room.version, {
				state: null,
				status: "lobby",
				autoStepAt: null
			});
		}
	};
}
/**
* Та же схема, что в migrations/0002_net_rooms.sql, но исполняется и в рантайме:
* на Vercel `db:migrate` выполняется на этапе билда и молча пропускается, если
* DATABASE_URL не был виден процессу сборки. Идемпотентно — можно вызывать всегда.
*/
var NET_TABLES_DDL = `
create table if not exists evo_rooms (
  code         text primary key,
  status       text not null default 'lobby',
  capacity     int  not null check (capacity between 2 and 4),
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
  seat         int  not null check (seat between 0 and 3),
  name         text not null,
  token        text not null,
  is_ai        boolean not null default false,
  last_seen_at timestamptz not null default now(),
  primary key (room_code, seat)
);
alter table evo_rooms add column if not exists modules jsonb not null default '{}';
`;
/**
* Общий экземпляр для прод-сервера. @/lib/db импортируется динамически:
* node-тесты подставляют свой SqlLike и никогда не трогают Vite-специфику db.ts.
* Перед первым использованием гарантируем схему (см. NET_TABLES_DDL).
*/
function getRoomService() {
	const g = globalThis;
	g.__evoNetService__ ??= import("./db-CCV1ka02.mjs").then(async ({ getSql }) => {
		const sql = await getSql();
		await sql.query(NET_TABLES_DDL);
		return createRoomService(sql);
	});
	return g.__evoNetService__;
}
/**
* Клиентские вызовы сетевого слоя: createServerFn-обёртки над сервисом
* комнат. Ошибки сервиса (NetError) отдаются полем `error`, а не броском —
* чтобы текст доходил до UI без разбора формата ошибок TanStack Start.
*/
var fail = (e) => ({
	ok: false,
	error: e instanceof NetError || e instanceof Error ? e.message : "Сеть недоступна, попробуйте ещё раз"
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
			...await (await getRoomService()).poll(data.code, data.token, data.sinceVersion)
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
export { netAction_createServerFn_handler, netAgain_createServerFn_handler, netCreateRoom_createServerFn_handler, netJoinRoom_createServerFn_handler, netPoll_createServerFn_handler, netRejoin_createServerFn_handler, netSetBots_createServerFn_handler, netStart_createServerFn_handler };
