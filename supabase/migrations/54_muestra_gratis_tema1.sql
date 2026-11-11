-- 54 · Muestra gratis del servidor = tema 1 (BOE), no tema 40 (material interno del CPEI).
-- Decisión 1A de docs/PLAN_POR_USUARIO.md §7 (JM, 11/11/2026). Alinea recall_free_decks (migración 38) con
-- PLAN_LIMITS.free.deckIds de src/utils/plan.ts (cambiado en la PR #283).
-- Efecto: get_recall_deck_cards deja de dar 'tema40' sin plan Pro. Hoy no cambia nada visible: recall_cards está
-- vacía y el cliente no sirve mazos desde el servidor (VITE_PRO_DECKS_FROM_SERVER apagada).
-- Solo toca la tabla de configuración recall_free_decks; no toca datos de alumnos. Idempotente.
-- Cómo se deshace: 54_muestra_gratis_tema1_down.sql
INSERT INTO public.recall_free_decks (deck_id) VALUES ('tema1') ON CONFLICT DO NOTHING;
DELETE FROM public.recall_free_decks WHERE deck_id = 'tema40';
