-- Комнаты сетевой «Эволюции» (сервер-авторитарная): канонический GameState
-- в jsonb, места с секретными токенами, оптимистичная блокировка по version.
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
