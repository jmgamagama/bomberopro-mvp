-- 31 · C4 (auditoría 26/10/2026): recalculate_questions_difficulty() es SECURITY DEFINER, sin search_path,
-- y EXECUTE seguía en PUBLIC (por defecto) → anon podía lanzar un UPDATE masivo sobre questions.
-- Igual la función del trigger on_attempt_inserted. Ningún cliente las llama (rg en src/scripts).
-- Idempotente: se puede ejecutar varias veces y tolera entornos donde no existan.
-- El trigger sigue funcionando: PostgreSQL no comprueba EXECUTE al disparar un trigger.
DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public.recalculate_questions_difficulty()',
                           'public.trigger_update_single_question_difficulty()'] LOOP
    IF to_regprocedure(f) IS NOT NULL THEN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC', f);
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', f);
      END IF;
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM authenticated', f);
      END IF;
      EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', f);
    END IF;
  END LOOP;
END $$;
