-- M12: реакции, привязанные к сообщению, и «печатает…».
-- chat_id: реакция ставится на конкретную реплику чата. cascade — история
-- реакций не переживает своё сообщение (а сообщения уходят вместе с комнатой
-- через janitor); сервер дополнительно проверяет, что сообщение из этой комнаты.
-- typing_at: время последнего сигнала набора текста; свежесть окна (~4 с)
-- считает сервер, клиент получает только boolean (SeatInfo/WaiterInfo/
-- SpectatorInfo.typing). Колонка есть у всех трёх «авторов» чата.
alter table evo_reactions add column if not exists chat_id integer references evo_chat(id) on delete cascade;
alter table evo_seats add column if not exists typing_at timestamptz;
alter table evo_waiters add column if not exists typing_at timestamptz;
alter table evo_spectators add column if not exists typing_at timestamptz;
