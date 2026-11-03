-- Deshace 22_eventos_embudo.sql: elimina la función y la tabla de eventos del embudo.
DROP FUNCTION IF EXISTS public.log_funnel_event(text, uuid);
DROP TABLE IF EXISTS public.funnel_events;
