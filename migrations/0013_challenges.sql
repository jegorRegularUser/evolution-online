-- Волна 3а: «Вызовы» (дизайн-пакет §4.1В) — прогресс, полученные тиры,
-- дневной кап наград. Всё per-user: user_id TEXT (шапка auth-миграции),
-- все запросы через src/lib/profile/service.server.ts с проверенным
-- authMiddleware'ом user_id. v1 earned-only: валюта не продаётся, форж
-- кошелька обесценивает только косметику — сервер всё равно держит
-- инварианты (тиры выдаются один раз, кап в день).

-- Накопленные счётчики по вызовам: отчёт партии прибавляет метрики
-- GameRunStats (сервер-авторитарные из состояния комнаты).
create table if not exists evo_challenge_progress (
  user_id      text not null,
  challenge_id text not null,
  value        integer not null default 0,
  updated_at   timestamptz not null default now(),
  primary key (user_id, challenge_id)
);

-- Выданные тиры: PK не даёт награде упасть дважды (идемпотентность
-- независимо от повторов отчёта и гонок).
create table if not exists evo_challenge_claims (
  user_id      text not null,
  challenge_id text not null,
  tier         integer not null,
  claimed_at   timestamptz not null default now(),
  primary key (user_id, challenge_id, tier)
);

-- Дневной кап «Ископаемых» за вызовы (анти-фарм §3.2): одна строка на
-- пользователя и день, coins растёт инкрементально, сервис сверяет кап.
create table if not exists evo_challenge_daily (
  user_id text not null,
  day     date not null,
  coins   integer not null default 0,
  primary key (user_id, day)
);
