-- Сдача игрока: место и имя остаются до конца партии, ходы пропускаются
-- автоматикой, животные гибнут от голода, очки идут в финальный счёт.
-- Флаг хранится у места (для хоста/прав) и дублируется в GameState.players
-- (Player.resigned) — по нему nextAutoStep пропускает сдавшегося.
alter table evo_seats add column if not exists resigned boolean not null default false;
