-- Дополнения, выбранные хостом при создании стола («Континенты» и следующие).
-- null/{} — базовая игра; jsonb вида {"continents": true}.
alter table evo_rooms add column if not exists modules jsonb not null default '{}';

-- Расширение столов до восьми мест: ослабляем check-и у существующих комнат.
alter table evo_rooms drop constraint if exists evo_rooms_capacity_check;
alter table evo_rooms add constraint evo_rooms_capacity_check check (capacity between 2 and 8);
drop trigger if exists _noop on evo_rooms; -- (заглушка совместимости)
alter table evo_seats drop constraint if exists evo_seats_seat_check;
alter table evo_seats add constraint evo_seats_seat_check check (seat between 0 and 7);
