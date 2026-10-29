-- Deshace 38_correccion_servidor_y_fichas_pro.sql (vuelve a dar EXECUTE a authenticated en las RPC
-- antiguas, como dejaban las migraciones 08/16/33). Borra las tablas de fichas Pro y su contenido.
DROP FUNCTION IF EXISTS public.get_recall_deck_cards(text);
DROP TABLE IF EXISTS public.recall_cards;
DROP TABLE IF EXISTS public.recall_free_decks;
DROP FUNCTION IF EXISTS public.grade_exam(jsonb);
DROP FUNCTION IF EXISTS public.check_answer(bigint, text);
DROP FUNCTION IF EXISTS public.get_topic_questions_v2(integer[], integer);
DROP FUNCTION IF EXISTS public.get_study_session_v2(integer);
DROP FUNCTION IF EXISTS public.get_exam_questions_v2(double precision);
DROP FUNCTION IF EXISTS public._correct_option_text(bigint);
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
            WHERE p.pronamespace = 'public'::regnamespace
              AND p.proname IN ('get_blueprint_exam_questions', 'get_study_session', 'get_topic_study_questions') LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', r.sig);
  END LOOP;
END $$;
