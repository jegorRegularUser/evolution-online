-- Волна 0 дизайн-пакета расширения: серверная идентичность игрока.
-- Три сущности из дизайн-пакета (plans/design-expansion-pack.md, §3/§6):
-- профиль, кошелёк «Ископаемых» (earned-валюта, §3.2), владение косметикой
-- + экипировка по слотам. Магазина и выдачи наград здесь нет — это фундамент
-- для волн 3а/3б; награды выдаёт только серверный код через сервис профиля.
--
-- Правила схемы (см. шапку migrations/auth/0001_auth.sql):
-- snake_case, per-user таблицы несут `user_id TEXT NOT NULL` (TEXT, не UUID —
-- dev-пользователь без auth — строка 'dev-user'). Все запросы к этим таблицам
-- идут через src/lib/profile/service.server.ts с user_id из authMiddleware —
-- никогда из клиентского ввода.
--
-- Клики-«клички» животных (Animal.name) к аккаунту не привязаны и остаются
-- как есть: идентичность игрока — это аккаунт, идентичность существа — партия.

create table if not exists evo_profiles (
  user_id      text primary key,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- Одна earned-валюта (дизайн-пакет §3.2): никаких премиум-монет и обменников.
-- Инвариант баланса >= 0 держат и check, и CAS-обновление сервиса
-- (update ... where balance >= amount), поэтому списание не уходит в минус
-- даже при гонке запросов.
create table if not exists evo_wallets (
  user_id    text primary key references evo_profiles (user_id) on delete cascade,
  balance    integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

-- Владение косметикой. source — машинная причина выдачи
-- ('daily-first-win', 'challenge', 'campaign', 'supporter', 'admin', …),
-- перечень растит сервис, не схему: ограничение по source не ставим.
create table if not exists evo_cosmetics_owned (
  user_id     text not null references evo_profiles (user_id) on delete cascade,
  item_id     text not null,
  source      text not null default 'grant',
  acquired_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- Экипировка по слотам (дизайн-пакет §3.1: cardback/felt/dice/avatar/frame/
-- medal; перечень слотов валидирует сервис — расширение без миграции).
-- Составной FK держит инвариант «экипировано только владеемое» на уровне БД:
-- снять владение (будущая чистка) автоматически снимет и экипировку.
create table if not exists evo_cosmetics_equipped (
  user_id    text not null references evo_profiles (user_id) on delete cascade,
  slot       text not null,
  item_id    text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, slot),
  foreign key (user_id, item_id) references evo_cosmetics_owned (user_id, item_id) on delete cascade
);
