-- Deshace la 31. REABRE C4 (anon vuelve a poder ejecutar el UPDATE masivo): no ejecutar sin revisión.
DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public.recalculate_questions_difficulty()',
                           'public.trigger_update_single_question_difficulty()'] LOOP
    IF to_regprocedure(f) IS NOT NULL THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO PUBLIC', f);
      EXECUTE format('ALTER FUNCTION %s RESET search_path', f);
    END IF;
  END LOOP;
END $$;
