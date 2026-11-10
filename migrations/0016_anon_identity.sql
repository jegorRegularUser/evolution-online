-- Анонимная идентичность (самохостинг, внешний auth-брокер прежнего хостинга
-- выведен из эксплуатации): личность игрока — это кука __Host-evo-uid, которую сервер
-- выдаёт браузеру при первом вызове серверной функции (см.
-- src/lib/auth/identity.server.ts). Чтобы строки в per-user таблицах
-- (evo_profiles/evo_wallets/...) всегда имели якорь в виде строки пользователя,
-- requireUserId() вставляет минимальную запись в таблицу "user".
--
-- Таблица НЕ создавалась раньше: migrations/auth/0001_auth.sql лежит в
-- подпапке, которую оба аплаера (src/lib/db.ts и scripts/migrate.mjs) сознательно
-- не читают — auth-схема была opt-in для платформенного брокера, который здесь
-- никогда не включался. Колонки повторяют 0001_auth.sql в точности
-- (camelCase в двойных кавычках — Postgres хранит регистр), поэтому
-- «create table if not exists» безопасен в обоих порядках применения: база,
-- где 0001 уже накатили руками, получит no-op, свежая — создаст таблицу здесь.
--
-- session/account/verification из 0001 здесь не нужны: у анонимки нет сессий
-- и паролей, идентичность — сама кука.

create table if not exists "user" (
  "id" text not null primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null,
  "image" text,
  "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
