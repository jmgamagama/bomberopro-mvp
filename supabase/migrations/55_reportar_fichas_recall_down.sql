-- Deshacer la migración 55. No toca question_reports ni ninguna otra tabla.
DROP FUNCTION IF EXISTS public.report_recall_card(text, text, text, text);
DROP TABLE IF EXISTS public.recall_card_reports;
