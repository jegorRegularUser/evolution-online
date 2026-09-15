-- Зрители и реакции/поощрения.
-- Зритель не занимает место игрока: у него отдельный токен, имя и presence.
create table if not exists evo_spectators (
  room_code    text not null references evo_rooms(code) on delete cascade,
  token        text not null,
  name         text not null,
  last_seen_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  primary key (room_code, token)
);

-- Реакции — короткая лента для живых эмодзи/поощрений. target_seat null означает
-- реакцию на стол целиком; kind=cheer звучит заметнее обычной реакции.
create table if not exists evo_reactions (
  room_code  text not null references evo_rooms(code) on delete cascade,
  id         bigserial primary key,
  name       text not null,
  emoji      text not null,
  kind       text not null default 'reaction' check (kind in ('reaction', 'cheer')),
  target_seat int,
  created_at timestamptz not null default now()
);
create index if not exists evo_reactions_room_id_idx on evo_reactions (room_code, id);
