-- Revertir la migración 54 SOLO si las banderas del servidor/planes permanecen apagadas
-- y tras verificar que no volverá a exponerse el material del Tema 40.
-- NO es un rollback seguro una vez publicada la protección: preferir una migración nueva.
DO $$
BEGIN
  IF to_regclass('public.recall_free_decks') IS NULL THEN
    RAISE EXCEPTION 'recall_free_decks missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.recall_free_decks WHERE deck_id IN ('tema1', 'tema40')) THEN
    RAISE EXCEPTION 'unexpected_free_deck_state';
  END IF;
END
$$;

INSERT INTO public.recall_free_decks (deck_id)
VALUES ('tema40')
ON CONFLICT (deck_id) DO NOTHING;

DELETE FROM public.recall_free_decks
WHERE deck_id = 'tema1';
