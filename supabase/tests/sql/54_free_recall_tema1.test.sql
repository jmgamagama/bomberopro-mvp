-- Requiere una BD de prueba aislada con la migración 38 aplicada.
-- Ejecutar con psql -v ON_ERROR_STOP=1 -f supabase/tests/sql/54_free_recall_tema1.test.sql
-- BEGIN/ROLLBACK: no deja cambios persistidos.
\set ON_ERROR_STOP 1
BEGIN;
INSERT INTO public.recall_free_decks (deck_id) VALUES ('tema40') ON CONFLICT DO NOTHING;
\ir ../../migrations/54_free_recall_tema1.sql
\ir ../../migrations/54_free_recall_tema1.sql

DO $$
BEGIN
  IF (SELECT count(*) FROM public.recall_free_decks) <> 1
     OR NOT EXISTS (SELECT 1 FROM public.recall_free_decks WHERE deck_id = 'tema1')
     OR EXISTS (SELECT 1 FROM public.recall_free_decks WHERE deck_id = 'tema40') THEN
    RAISE EXCEPTION '54 failed: only tema1 must be free';
  END IF;
END
$$;

\ir ../../migrations/54_free_recall_tema1_down.sql
DO $$
BEGIN
  IF (SELECT count(*) FROM public.recall_free_decks) <> 1
     OR NOT EXISTS (SELECT 1 FROM public.recall_free_decks WHERE deck_id = 'tema40')
     OR EXISTS (SELECT 1 FROM public.recall_free_decks WHERE deck_id = 'tema1') THEN
    RAISE EXCEPTION '54 down failed';
  END IF;
END
$$;

SELECT 'OK 54: tema1 free, tema40 no free, idempotent, rollback checked' AS resultado;
ROLLBACK;
