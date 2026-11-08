-- M10: серверный дедлайн авто-конца хода человека.
-- До этой миграции поле существовало только в аварийном runtime-DDL, поэтому
-- чистая база, обработанная scripts/migrate.mjs, падала на первом readRoom.
alter table evo_rooms add column if not exists turn_deadline_at timestamptz;
