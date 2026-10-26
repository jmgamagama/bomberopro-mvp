-- Test de la migración 32 (B-H1, B-H2) en el Postgres local de la auditoría (09, 18 y 19 aplicadas):
--   psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f supabase/tests/sql/32_escalera_sin_subir_al_fallar.test.sql
-- Todo en BEGIN … ROLLBACK.
\set ON_ERROR_STOP 1
BEGIN;
ALTER TABLE question_reports ADD COLUMN IF NOT EXISTS categoria text DEFAULT 'error'; -- la crea la 11 (no aplica en local)
\ir ../../migrations/32_escalera_sin_subir_al_fallar.sql
\ir ../../migrations/32_escalera_sin_subir_al_fallar.sql
DO $$
DECLARE u uuid := '00000000-0000-0000-0000-0000000032aa'; t int; r record; n int;
BEGIN
  SELECT id INTO t FROM topics ORDER BY id LIMIT 1;
  INSERT INTO users_app(id) VALUES (u) ON CONFLICT DO NOTHING;
  PERFORM set_config('request.jwt.claim.sub', u::text, true);
  INSERT INTO concepts(id, topic_id, apartado, orden, pregunta, respuesta, fuente, prioridad) VALUES
    ('T32A', t, 'x', 1, '¿A?', 'A', 'CE', 1), ('T32B', t, 'x', 2, '¿B?', 'B', 'CE', 1);
  INSERT INTO questions(id, topic_id, enunciado, opciones, correcta, estado, nivel, concept_id) VALUES
    (9932011, t, 'A N1', '[{"letra":"a","texto":"si"},{"letra":"b","texto":"no"}]', 'a', 'publicada', 1, 'T32A'),
    (9932012, t, 'A N2', '[{"letra":"a","texto":"x"},{"letra":"b","texto":"ok"},{"letra":"c","texto":"z"}]', 'b', 'publicada', 2, 'T32A'),
    (9932021, t, 'B N1', '[{"letra":"a","texto":"si"},{"letra":"b","texto":"no"}]', 'a', 'publicada', 1, 'T32B'),
    (9932022, t, 'B N2', '[{"letra":"a","texto":"ok"},{"letra":"b","texto":"y"},{"letra":"c","texto":"z"}]', 'a', 'publicada', 2, 'T32B'),
    (9932023, t, 'B N3', '[{"letra":"a","texto":"p"},{"letra":"b","texto":"ok"},{"letra":"c","texto":"z"}]', 'b', 'publicada', 3, 'T32B');

  -- H1 (S3): falla la única N1 → no se sirve la N2.
  PERFORM public._record_concept_event(u, gen_random_uuid(), 'T32A', 'ficha', null, null, null, null, 8000, null, now());
  PERFORM public._record_concept_event(u, gen_random_uuid(), 'T32A', 'test', 9932011, false, 'media', null, 8000, null, now());
  SELECT count(*), max(nivel) INTO n, t FROM public.get_concept_step_question('T32A', 9932011);
  IF n <> 0 THEN RAISE EXCEPTION 'H1: tras fallar N1 se sirvió una pregunta de nivel %', t; END IF;

  -- Falla en N3 → objetivo 2 → se sirve la N2 (no la N3 fallada, no la N1).
  PERFORM public._record_concept_event(u, gen_random_uuid(), 'T32B', 'ficha', null, null, null, null, 8000, null, now());
  UPDATE user_concept_state SET nivel_escalera = 3 WHERE user_id = u AND concept_id = 'T32B';
  PERFORM public._record_concept_event(u, gen_random_uuid(), 'T32B', 'test', 9932023, false, 'media', null, 8000, null, now());
  SELECT * INTO r FROM public.get_concept_step_question('T32B', 9932023);
  IF r.nivel <> 2 THEN RAISE EXCEPTION 'tras fallar N3 debía servirse N2, no %', r.nivel; END IF;

  -- H2 (S4): estando en 3, acertar una N1 no baja de nivel.
  UPDATE user_concept_state SET nivel_escalera = 3 WHERE user_id = u AND concept_id = 'T32B';
  PERFORM public._record_concept_event(u, gen_random_uuid(), 'T32B', 'test', 9932021, true, 'media', null, 8000, null, now());
  SELECT nivel_escalera INTO n FROM user_concept_state WHERE user_id = u AND concept_id = 'T32B';
  IF n <> 3 THEN RAISE EXCEPTION 'H2: un acierto bajó el nivel a %', n; END IF;

  -- Se mantiene: acierto en N1 desde 1 sube a 2; fallo en N2 baja a 1.
  UPDATE user_concept_state SET nivel_escalera = 1 WHERE user_id = u AND concept_id = 'T32B';
  PERFORM public._record_concept_event(u, gen_random_uuid(), 'T32B', 'test', 9932021, true, 'media', null, 8000, null, now());
  SELECT nivel_escalera INTO n FROM user_concept_state WHERE user_id = u AND concept_id = 'T32B';
  IF n <> 2 THEN RAISE EXCEPTION 'acierto N1 desde 1 debía subir a 2, no %', n; END IF;
  PERFORM public._record_concept_event(u, gen_random_uuid(), 'T32B', 'test', 9932022, false, 'media', null, 8000, null, now());
  SELECT nivel_escalera INTO n FROM user_concept_state WHERE user_id = u AND concept_id = 'T32B';
  IF n <> 1 THEN RAISE EXCEPTION 'fallo N2 debía bajar a 1, no %', n; END IF;
  RAISE NOTICE 'OK 32_escalera_sin_subir_al_fallar';
END $$;
ROLLBACK;
