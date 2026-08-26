-- Дополнения, выбранные хостом при создании стола («Континенты» и следующие).
-- null/{} — базовая игра; jsonb вида {"continents": true}.
alter table evo_rooms add column if not exists modules jsonb not null default '{}';
