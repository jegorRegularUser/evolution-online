-- Волна 3б/ревью: «Первая победа дня» (дизайн-пакет §3.2 — основной источник
-- «Ископаемых», анти-фарм по построению: одна строка на пользователя в день).
create table if not exists evo_daily_first_win (
  user_id text not null,
  day     date not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, day)
);
