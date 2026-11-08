-- Идемпотентность сетевого действия: последние actionId хранятся рядом с
-- состоянием комнаты, поэтому повтор после ретрая прокси не применяется дважды.
alter table evo_rooms add column if not exists action_ids jsonb not null default '[]'::jsonb;
