-- Хост-контроль, ожидающие, журнал событий, чат и след кикнутых токенов.
-- host_seat — сохранённый хост стола (приоритетнее вычисленного по онлайну);
-- settings — модули/сложность/целевой размер колоды, настраиваемые в лобби;
-- events — журнал событий по версиям [{version, events}] для плавных переходов.
alter table evo_rooms add column if not exists host_seat int;
alter table evo_rooms add column if not exists settings jsonb not null default '{}'::jsonb;
alter table evo_rooms add column if not exists events jsonb not null default '[]'::jsonb;

-- Ожидающие: те, кому не хватило места. Чистятся вместе с комнатой (cascade)
-- и по TTL в janitor'е, чтобы не разрастались.
create table if not exists evo_waiters (
  room_code  text not null references evo_rooms(code) on delete cascade,
  token      text not null,
  name       text not null,
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);

-- Чат партии, объединённый с журналом в UI. seat = -1 у ожидающего.
create table if not exists evo_chat (
  room_code  text not null references evo_rooms(code) on delete cascade,
  id         bigserial primary key,
  seat       int not null,
  name       text not null,
  text       text not null,
  created_at timestamptz not null default now()
);
create index if not exists evo_chat_room_id_idx on evo_chat (room_code, id);

-- Кикнутые токены: чтобы удалённый клиент получал «вас удалили», а не
-- неотличимое «места нет». Чистится вместе с комнатой и по TTL.
create table if not exists evo_kicks (
  room_code  text not null references evo_rooms(code) on delete cascade,
  token      text not null,
  created_at timestamptz not null default now(),
  primary key (room_code, token)
);
