//#region node_modules/.nitro/vite/services/ssr/assets/db-Bco9xWpE.js
var _0002_net_rooms_default = "-- Комнаты сетевой «Эволюции» (сервер-авторитарная): канонический GameState\r\n-- в jsonb, места с секретными токенами, оптимистичная блокировка по version.\r\ncreate table if not exists evo_rooms (\r\n  code         text primary key,\r\n  status       text not null default 'lobby',\r\n  capacity     int  not null check (capacity between 2 and 4),\r\n  difficulty   text not null default 'normal',\r\n  seed         bigint not null,\r\n  state        jsonb,\r\n  version      int  not null default 0,\r\n  auto_step_at timestamptz,\r\n  created_at   timestamptz not null default now(),\r\n  updated_at   timestamptz not null default now()\r\n);\r\ncreate table if not exists evo_seats (\r\n  room_code    text not null references evo_rooms(code) on delete cascade,\r\n  seat         int  not null check (seat between 0 and 3),\r\n  name         text not null,\r\n  token        text not null,\r\n  is_ai        boolean not null default false,\r\n  last_seen_at timestamptz not null default now(),\r\n  primary key (room_code, seat)\r\n);\r\n";
var _0003_room_modules_default = "-- Дополнения, выбранные хостом при создании стола («Континенты» и следующие).\r\n-- null/{} — базовая игра; jsonb вида {\"continents\": true}.\r\nalter table evo_rooms add column if not exists modules jsonb not null default '{}';\r\n\r\n-- Расширение столов до восьми мест: ослабляем check-и у существующих комнат.\r\nalter table evo_rooms drop constraint if exists evo_rooms_capacity_check;\r\nalter table evo_rooms add constraint evo_rooms_capacity_check check (capacity between 2 and 8);\r\ndrop trigger if exists _noop on evo_rooms; -- (заглушка совместимости)\r\nalter table evo_seats drop constraint if exists evo_seats_seat_check;\r\nalter table evo_seats add constraint evo_seats_seat_check check (seat between 0 and 7);\r\n";
var _0004_room_host_default = "-- Хост-контроль, ожидающие, журнал событий, чат и след кикнутых токенов.\n-- host_seat — сохранённый хост стола (приоритетнее вычисленного по онлайну);\n-- settings — модули/сложность/целевой размер колоды, настраиваемые в лобби;\n-- events — журнал событий по версиям [{version, events}] для плавных переходов.\nalter table evo_rooms add column if not exists host_seat int;\nalter table evo_rooms add column if not exists settings jsonb not null default '{}'::jsonb;\nalter table evo_rooms add column if not exists events jsonb not null default '[]'::jsonb;\n\n-- Ожидающие: те, кому не хватило места. Чистятся вместе с комнатой (cascade)\n-- и по TTL в janitor'е, чтобы не разрастались.\ncreate table if not exists evo_waiters (\n  room_code  text not null references evo_rooms(code) on delete cascade,\n  token      text not null,\n  name       text not null,\n  created_at timestamptz not null default now(),\n  primary key (room_code, token)\n);\n\n-- Чат партии, объединённый с журналом в UI. seat = -1 у ожидающего.\ncreate table if not exists evo_chat (\n  room_code  text not null references evo_rooms(code) on delete cascade,\n  id         bigserial primary key,\n  seat       int not null,\n  name       text not null,\n  text       text not null,\n  created_at timestamptz not null default now()\n);\ncreate index if not exists evo_chat_room_id_idx on evo_chat (room_code, id);\n\n-- Кикнутые токены: чтобы удалённый клиент получал «вас удалили», а не\n-- неотличимое «места нет». Чистится вместе с комнатой и по TTL.\ncreate table if not exists evo_kicks (\n  room_code  text not null references evo_rooms(code) on delete cascade,\n  token      text not null,\n  created_at timestamptz not null default now(),\n  primary key (room_code, token)\n);\n";
var _0005_spectators_default = "-- Зрители и реакции/поощрения.\n-- Зритель не занимает место игрока: у него отдельный токен, имя и presence.\ncreate table if not exists evo_spectators (\n  room_code    text not null references evo_rooms(code) on delete cascade,\n  token        text not null,\n  name         text not null,\n  last_seen_at timestamptz not null default now(),\n  created_at   timestamptz not null default now(),\n  primary key (room_code, token)\n);\n\n-- Реакции — короткая лента для живых эмодзи/поощрений. target_seat null означает\n-- реакцию на стол целиком; kind=cheer звучит заметнее обычной реакции.\ncreate table if not exists evo_reactions (\n  room_code  text not null references evo_rooms(code) on delete cascade,\n  id         bigserial primary key,\n  name       text not null,\n  emoji      text not null,\n  kind       text not null default 'reaction' check (kind in ('reaction', 'cheer')),\n  target_seat int,\n  created_at timestamptz not null default now()\n);\ncreate index if not exists evo_reactions_room_id_idx on evo_reactions (room_code, id);\n";
var _0006_resign_default = "-- Сдача игрока: место и имя остаются до конца партии, ходы пропускаются\n-- автоматикой, животные гибнут от голода, очки идут в финальный счёт.\n-- Флаг хранится у места (для хоста/прав) и дублируется в GameState.players\n-- (Player.resigned) — по нему nextAutoStep пропускает сдавшегося.\nalter table evo_seats add column if not exists resigned boolean not null default false;\n";
var _0007_room_privacy_color_default = "-- Приватные столы и цвета игроков (пункты владельца №2 и №6).\n-- is_private: стол не попадает в список открытых, для входа нужен пароль.\n-- password: 4 цифры; нужен ТОЛЬКО чтобы сесть за стол — смотреть приватный\n-- стол можно по коду и без пароля.\n-- color: цвет места игрока; публичная информация, маскировать не нужно.\nalter table evo_rooms add column if not exists is_private boolean not null default false;\nalter table evo_rooms add column if not exists password text;\nalter table evo_seats add column if not exists color text;\n-- Список столов в меню фильтрует по приватности и сортирует по свежести.\ncreate index if not exists evo_rooms_public_idx on evo_rooms (is_private, created_at desc);\n";
var _0008_chat_reactions_typing_default = "-- M12: реакции, привязанные к сообщению, и «печатает…».\n-- chat_id: реакция ставится на конкретную реплику чата. cascade — история\n-- реакций не переживает своё сообщение (а сообщения уходят вместе с комнатой\n-- через janitor); сервер дополнительно проверяет, что сообщение из этой комнаты.\n-- typing_at: время последнего сигнала набора текста; свежесть окна (~4 с)\n-- считает сервер, клиент получает только boolean (SeatInfo/WaiterInfo/\n-- SpectatorInfo.typing). Колонка есть у всех трёх «авторов» чата.\nalter table evo_reactions add column if not exists chat_id integer references evo_chat(id) on delete cascade;\nalter table evo_seats add column if not exists typing_at timestamptz;\nalter table evo_waiters add column if not exists typing_at timestamptz;\nalter table evo_spectators add column if not exists typing_at timestamptz;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_net_rooms.sql": _0002_net_rooms_default,
			"/migrations/0003_room_modules.sql": _0003_room_modules_default,
			"/migrations/0004_room_host.sql": _0004_room_host_default,
			"/migrations/0005_spectators.sql": _0005_spectators_default,
			"/migrations/0006_resign.sql": _0006_resign_default,
			"/migrations/0007_room_privacy_color.sql": _0007_room_privacy_color_default,
			"/migrations/0008_chat_reactions_typing.sql": _0008_chat_reactions_typing_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
//#endregion
export { getSql };
