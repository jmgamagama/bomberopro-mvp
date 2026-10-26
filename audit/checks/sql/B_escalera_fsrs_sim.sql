-- Auditor B · Simulación del motor de conceptos (migraciones 09 + 19) en el Postgres LOCAL.
-- TODO va dentro de una transacción que termina en ROLLBACK: no deja datos.
-- Salida: una línea JSON por escenario ({"k": ..., "v": {...}}).
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned
BEGIN;
-- Stub local: la columna categoria la crea la migración 11, que no aplica en local (fase 0).
ALTER TABLE question_reports ADD COLUMN IF NOT EXISTS categoria text DEFAULT 'error';
CREATE TEMP TABLE r(k text, v jsonb);

-- Escenario 0: banco tal cual (todo «borrador»): ¿qué sirve el motor?
DO $$
DECLARE u uuid := gen_random_uuid(); n int;
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  SELECT count(*) INTO n FROM _concept_session(u, NULL, 20, now());
  INSERT INTO r VALUES ('S0_borrador', jsonb_build_object('items_sesion', n,
     'conceptos_publicados', (SELECT count(*) FROM concepts WHERE estado='publicado'),
     'preguntas_publicadas', (SELECT count(*) FROM questions WHERE estado='publicada')));
END $$;

UPDATE concepts SET estado = 'publicado';
UPDATE questions SET estado = 'publicada';

CREATE OR REPLACE FUNCTION pg_temp.play(u uuid, topic int, mins int, t timestamptz, mode text)
RETURNS jsonb LANGUAGE plpgsql AS $f$
DECLARE it record; ok boolean; n int := 0; nf int := 0; nt int := 0; nr int := 0;
BEGIN
  FOR it IN SELECT * FROM _concept_session(u, topic, mins, t) ORDER BY pos LOOP
    n := n + 1;
    IF it.formato = 'ficha' THEN
      PERFORM _record_concept_event(u, gen_random_uuid(), it.concept_id, 'ficha', NULL, NULL, NULL, NULL, NULL, NULL, t); nf := nf + 1;
    ELSIF it.formato = 'test' THEN
      ok := mode = 'ok';
      PERFORM _record_concept_event(u, gen_random_uuid(), it.concept_id, 'test', it.question_id, ok,
                                    CASE WHEN ok THEN 'alta' ELSE 'alta' END, NULL, 5000, NULL, t); nt := nt + 1;
    ELSE
      PERFORM _record_concept_event(u, gen_random_uuid(), it.concept_id, 'recuerdo', NULL, NULL, NULL,
                                    CASE WHEN mode = 'ok' THEN 'si' ELSE 'no' END, NULL, NULL, t); nr := nr + 1;
    END IF;
    t := t + interval '30 seconds';
  END LOOP;
  RETURN jsonb_build_object('items', n, 'fichas', nf, 'tests', nt, 'recuerdos', nr);
END $f$;

-- S1: lo falla todo 30 días (tema 2 = Ley 31/1995, 183 conceptos), 20 min/día.
DO $$
DECLARE u uuid := gen_random_uuid(); d int; t0 timestamptz := '2026-11-01 09:00+01'; x jsonb; nuevos int[] := '{}'; prev int := 0; cur int;
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  FOR d IN 0..29 LOOP
    x := pg_temp.play(u, 2, 20, t0 + d * interval '1 day', 'fail');
    SELECT count(*) INTO cur FROM user_concept_state WHERE user_id = u;
    nuevos := nuevos || (cur - prev); prev := cur;
  END LOOP;
  INSERT INTO r SELECT 'S1_falla_todo_30d', jsonb_build_object(
    'conceptos_tocados', prev, 'nuevos_por_dia', to_jsonb(nuevos),
    'dias_sin_nuevos_al_final', (SELECT count(*) FROM unnest(nuevos[11:30]) z WHERE z = 0),
    'nivel_max', max(nivel_escalera), 'estab_min', min(stability), 'estab_max', max(stability),
    'eventos', (SELECT count(*) FROM concept_events WHERE user_id = u))
  FROM user_concept_state WHERE user_id = u;
END $$;

-- S2: lo acierta todo (Lo sé + < 15 s → nota 4) durante 365 días, tema 1.
DO $$
DECLARE u uuid := gen_random_uuid(); d int; t0 timestamptz := '2026-11-01 09:00+01';
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  FOR d IN 0..364 LOOP PERFORM pg_temp.play(u, 1, 20, t0 + d * interval '1 day', 'ok'); END LOOP;
  INSERT INTO r SELECT 'S2_acierta_todo_365d', jsonb_build_object(
    'conceptos', count(*), 'nivel_min', min(nivel_escalera), 'nivel_max', max(nivel_escalera),
    'intervalo_max_dias', round(max(extract(epoch FROM due_at - last_review_at)/86400)::numeric, 1),
    'estab_max', max(stability),
    'primer_intervalo_test_nota4', (SELECT round((extract(epoch FROM e.due_after - e.created_at)/86400)::numeric,1)
                                      FROM concept_events e WHERE e.user_id = u AND e.kind = 'test' ORDER BY e.id LIMIT 1))
  FROM user_concept_state WHERE user_id = u;
END $$;

-- S3: falla en el nivel 1 (no hay nivel inferior). ¿Qué pregunta de «escalera» le dan?
DO $$
DECLARE u uuid := gen_random_uuid(); q1 bigint; c text := 'CE-a1-1-estado'; st record; lvl int;
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  PERFORM set_config('request.jwt.claim.sub', u::text, true);
  SELECT id INTO q1 FROM questions WHERE concept_id = c AND nivel = 1;
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'ficha', NULL, NULL, NULL, NULL, NULL, NULL, now());
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'test', q1, false, 'media', NULL, 9000, NULL, now());
  SELECT nivel_escalera INTO lvl FROM user_concept_state WHERE user_id = u AND concept_id = c;
  SELECT * INTO st FROM get_concept_step_question(c, q1);
  INSERT INTO r VALUES ('S3_falla_N1', jsonb_build_object('nivel_tras_fallo', lvl, 'step_nivel', st.nivel, 'step_qid', st.question_id));
END $$;

-- S4: sin nivel superior: acierta N3 estando en 3 → sigue en 3; y acierto en N1 estando en 3
-- (cuando N2/N3 están reportadas por el alumno, la sesión le sirve N1).
DO $$
DECLARE u uuid := gen_random_uuid(); c text := 'CE-a1-1-estado'; q1 bigint; q3 bigint; it record; a int; b int;
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  SELECT id INTO q1 FROM questions WHERE concept_id = c AND nivel = 1;
  SELECT id INTO q3 FROM questions WHERE concept_id = c AND nivel = 3;
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'ficha', NULL, NULL, NULL, NULL, NULL, NULL, now());
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'test', q3, true, 'media', NULL, 9000, NULL, now());
  SELECT nivel_escalera INTO a FROM user_concept_state WHERE user_id = u AND concept_id = c;
  INSERT INTO question_reports(question_id, user_id, motivo, categoria)
       SELECT id, u, 'audit', 'error' FROM questions WHERE concept_id = c AND nivel IN (2, 3);
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'test', q1, true, 'media', NULL, 9000, NULL, now() + interval '3 days');
  SELECT nivel_escalera INTO b FROM user_concept_state WHERE user_id = u AND concept_id = c;
  INSERT INTO r VALUES ('S4_techo_y_acierto_bajo', jsonb_build_object('nivel_tras_acertar_N3', a, 'nivel_tras_acertar_N1_estando_en_3', b));
END $$;

-- S5: tarjeta «Lo sabía» y test fallado (y test «Lo sé» fallado).
DO $$
DECLARE u uuid := gen_random_uuid(); c text := 'CE-a1-1-estado'; t timestamptz := '2026-11-01 09:00+01'; q2 bigint;
        v_ver boolean; v_mot text; v_fmt text; lvl int; cal jsonb; due_after_si numeric;
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  PERFORM set_config('request.jwt.claim.sub', u::text, true);
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'ficha', NULL, NULL, NULL, NULL, NULL, NULL, t);
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'recuerdo', NULL, NULL, NULL, 'si', NULL, NULL, t);
  SELECT verificar_pendiente, round(extract(epoch FROM due_at - last_review_at)/86400::numeric, 2) INTO v_ver, due_after_si
    FROM user_concept_state WHERE user_id = u AND concept_id = c;
  SELECT motivo, formato, question_id INTO v_mot, v_fmt, q2 FROM _concept_session(u, 1, 20, t + interval '21 hours') WHERE concept_id = c LIMIT 1;
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'test', q2, false, 'alta', NULL, 5000, NULL, t + interval '21 hours');
  SELECT nivel_escalera INTO lvl FROM user_concept_state WHERE user_id = u AND concept_id = c;
  cal := get_concept_calibration(NULL);
  INSERT INTO r VALUES ('S5_lo_se_y_falla', jsonb_build_object('verificar_pendiente', v_ver, 'dias_hasta_vencer_tras_si', due_after_si,
     'motivo_a_las_21h', v_mot, 'formato', v_fmt, 'nivel_tras_fallo', lvl, 'calibracion', cal));
END $$;

-- S6: vuelve tras 60 días con 183 conceptos vistos (tema 2): ¿se drena la deuda? ¿cuántos días?
DO $$
DECLARE u uuid := gen_random_uuid(); t0 timestamptz := '2026-11-01 09:00+01'; d int; venc int; serie int[] := '{}'; nuevos int[] := '{}'; prev int; cur int;
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  -- Estado inicial: todos los conceptos del tema 2 con un acierto (S≈3,7 d) hace 60 días.
  INSERT INTO user_concept_state(user_id, concept_id, stability, difficulty, reps, lapses, first_seen_at, last_review_at, due_at, last_grade, updated_at)
    SELECT u, id, 3.7145, 5.16, 1, 0, t0 - interval '64 days', t0 - interval '64 days', t0 - interval '60 days', 3, t0 FROM concepts WHERE topic_id = 2 AND id NOT IN (SELECT id FROM concepts WHERE topic_id = 2 ORDER BY id LIMIT 30);
  SELECT count(*) INTO prev FROM user_concept_state WHERE user_id = u;
  FOR d IN 0..29 LOOP
    SELECT count(*) INTO venc FROM user_concept_state WHERE user_id = u AND due_at <= t0 + d * interval '1 day';
    serie := serie || venc;
    PERFORM pg_temp.play(u, 2, 20, t0 + d * interval '1 day', 'ok');
    SELECT count(*) INTO cur FROM user_concept_state WHERE user_id = u; nuevos := nuevos || (cur - prev); prev := cur;
  END LOOP;
  INSERT INTO r VALUES ('S6_vuelve_60d', jsonb_build_object('vencidos_por_dia', to_jsonb(serie), 'nuevos_por_dia', to_jsonb(nuevos),
     'intervalo_tras_acierto_tardio', (SELECT round((extract(epoch FROM e.due_after - e.created_at)/86400)::numeric,1)
        FROM concept_events e WHERE e.user_id = u AND e.kind = 'test' ORDER BY e.id LIMIT 1)));
END $$;

-- S7: mismo instante, otra zona horaria: el servidor solo usa timestamptz (sin día local).
DO $$
DECLARE u uuid := gen_random_uuid(); c text := 'CE-a1-1-estado'; q1 bigint; a timestamptz; b timestamptz;
BEGIN
  INSERT INTO users_app(id) VALUES (u);
  SELECT id INTO q1 FROM questions WHERE concept_id = c AND nivel = 1;
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'test', q1, true, 'media', NULL, 9000, NULL, '2026-11-01 23:59+01');
  PERFORM _record_concept_event(u, gen_random_uuid(), c, 'test', q1, true, 'media', NULL, 9000, NULL, '2026-11-02 00:01+01');
  SELECT s_before, s_after INTO a, b FROM concept_events WHERE user_id = u ORDER BY id DESC LIMIT 0;
  INSERT INTO r SELECT 'S7_medianoche', jsonb_build_object('s_antes', e.s_before, 's_despues', e.s_after,
      'dias_hasta_vencer', round((extract(epoch FROM e.due_after - e.created_at)/86400)::numeric,2))
    FROM concept_events e WHERE e.user_id = u ORDER BY e.id DESC LIMIT 1;
END $$;

SELECT json_build_object('k', k, 'v', v) FROM r ORDER BY k;
ROLLBACK;
