-- 54 · Alinear el mazo gratuito de servidor con la muestra pública del Tema 1.
-- Precondición: migración 38 aplicada; fuente de verdad cliente: PLAN_LIMITS.free.deckIds = ['tema1'].
-- No carga fichas ni habilita VITE_PRO_DECKS_FROM_SERVER.
-- Aplicar primero en staging; producción requiere autorización escrita específica.
-- Idempotente. Para revertir antes de activar la entrega del contenido, ver _down.sql.
DO $$
BEGIN
  IF to_regclass('public.recall_free_decks') IS NULL THEN
    RAISE EXCEPTION 'migration_38_required: recall_free_decks missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.recall_free_decks WHERE deck_id IN ('tema40', 'tema1')
  ) THEN
    RAISE EXCEPTION 'unexpected_free_deck_state: neither tema40 nor tema1';
  END IF;
END
$$;

INSERT INTO public.recall_free_decks (deck_id)
VALUES ('tema1')
ON CONFLICT (deck_id) DO NOTHING;

-- Tema 40 contiene material interno y no debe permanecer en la lista gratuita.
DELETE FROM public.recall_free_decks
WHERE deck_id = 'tema40';

DO $$
BEGIN
  IF (SELECT count(*) FROM public.recall_free_decks) <> 1
     OR NOT EXISTS (SELECT 1 FROM public.recall_free_decks WHERE deck_id = 'tema1')
     OR EXISTS (SELECT 1 FROM public.recall_free_decks WHERE deck_id = 'tema40') THEN
    RAISE EXCEPTION 'free_decks_postcondition_failed: expected only tema1';
  END IF;
END
$$;
