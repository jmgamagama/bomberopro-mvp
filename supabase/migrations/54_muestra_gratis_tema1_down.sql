-- Deshace la 54: la muestra gratis del servidor vuelve a 'tema40' (estado de la migración 38).
INSERT INTO public.recall_free_decks (deck_id) VALUES ('tema40') ON CONFLICT DO NOTHING;
DELETE FROM public.recall_free_decks WHERE deck_id = 'tema1';
