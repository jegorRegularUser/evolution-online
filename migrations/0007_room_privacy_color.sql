-- Приватные столы и цвета игроков (пункты владельца №2 и №6).
-- is_private: стол не попадает в список открытых, для входа нужен пароль.
-- password: 4 цифры; нужен ТОЛЬКО чтобы сесть за стол — смотреть приватный
-- стол можно по коду и без пароля.
-- color: цвет места игрока; публичная информация, маскировать не нужно.
alter table evo_rooms add column if not exists is_private boolean not null default false;
alter table evo_rooms add column if not exists password text;
alter table evo_seats add column if not exists color text;
-- Список столов в меню фильтрует по приватности и сортирует по свежести.
create index if not exists evo_rooms_public_idx on evo_rooms (is_private, created_at desc);
