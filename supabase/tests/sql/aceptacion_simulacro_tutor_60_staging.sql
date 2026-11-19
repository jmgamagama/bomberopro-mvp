-- PR #320 · Aceptación de la migración 60 (simulacro del tutor) contra el backend REAL de STAGING.
-- SOLO staging (fxhvgvehhekqeqpkxtrm). No ejecutar en producción.
--
-- Cómo se ejecuta: en UNA sola llamada, este orden concatenado:
--   60_simulacro_tutor.sql ; 60_simulacro_tutor_down.sql ; 60_simulacro_tutor.sql ; este bloque DO.
-- El bloque termina SIEMPRE con una excepción «ROLLBACK_OK {…}», que aborta la transacción entera: se
-- deshacen la migración, la vuelta atrás y todos los datos de prueba. El resultado se lee en el texto de
-- esa excepción. Después se comprueba aparte que `to_regclass('public.tutor_simulacros')` sigue siendo null.
--
-- Qué es real: Postgres de staging, las tablas `questions`/`topics`/`concepts` con su contenido, las
-- funciones reales `_correct_option_text` y `_opciones_referenciales`, las migraciones 57/58 desplegadas
-- y los permisos de los roles `authenticated` y `anon`. Qué no: no pasa por PostgREST ni por un JWT firmado
-- (la cuenta se fija con `request.jwt.claims`) y el tutor y los alumnos son UUID ficticios (las tablas de
-- tutor no tienen clave ajena a auth.users).
--
-- Resultado esperado: preguntas 10, sin_clave true, tabla_directa 42501, anon 42501, entrega saved,
-- reintento duplicate, entregados 3, pocos_datos false, correccion_antes 22023, coherente true,
-- claves_mostradas true, nota_correccion = nota_entrega.
DO $$
DECLARE
  tutor uuid := '00000000-0000-4000-8000-0000000060a0';
  alumnos uuid[] := ARRAY['00000000-0000-4000-8000-0000000060a1', '00000000-0000-4000-8000-0000000060a2',
                          '00000000-0000-4000-8000-0000000060a3']::uuid[];
  prop jsonb; sim bigint; ses jsonb; resp jsonb; r jsonb; res jsonb; corr jsonb; nota0 numeric;
  out jsonb := '{}'::jsonb; st text; k int;
BEGIN
  INSERT INTO public.tutores (user_id, nombre, codigo) VALUES (tutor, 'Prueba staging 60', 'PRUEBASTAGING60');

  -- Alumnos se vinculan con el código (consentimiento), como en la app.
  FOR k IN 1..3 LOOP
    PERFORM set_config('request.jwt.claims', json_build_object('sub', alumnos[k], 'role', 'authenticated')::text, true);
    PERFORM set_config('request.jwt.claim.sub', alumnos[k]::text, true);
    SET LOCAL ROLE authenticated;
    PERFORM public.vincular_tutor('PRUEBASTAGING60');
    RESET ROLE;
  END LOOP;

  -- Tutor: propone con preguntas reales de los temas 1 y 2, guarda y abre.
  PERFORM set_config('request.jwt.claims', json_build_object('sub', tutor, 'role', 'authenticated')::text, true);
  PERFORM set_config('request.jwt.claim.sub', tutor::text, true);
  SET LOCAL ROLE authenticated;
  prop := public.tutor_simulacro_proponer(ARRAY[1, 2], 10);
  out := out || jsonb_build_object('propuestas', jsonb_array_length(prop));
  sim := (public.tutor_simulacro_guardar(NULL, jsonb_build_object('titulo', 'Prueba staging 60', 'preguntas',
           (SELECT jsonb_agg(jsonb_build_object('question_id', e->>'question_id', 'nivel', coalesce((e->>'nivel_sugerido')::int, 1)))
              FROM jsonb_array_elements(prop) e))))->>'id';
  PERFORM public.tutor_simulacro_estado(sim, 'abierto');
  BEGIN PERFORM 1 FROM public.tutor_simulacros LIMIT 1; out := out || '{"tabla_directa":"SI"}';
  EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS st = RETURNED_SQLSTATE; out := out || jsonb_build_object('tabla_directa', st); END;
  RESET ROLE;

  -- anon no puede ejecutar las RPC.
  SET LOCAL ROLE anon;
  BEGIN PERFORM public.alumno_simulacros_v1(); out := out || '{"anon":"SI"}';
  EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS st = RETURNED_SQLSTATE; out := out || jsonb_build_object('anon', st); END;
  RESET ROLE;

  -- Cada alumno empieza (sin clave) y entrega una opción distinta en cada pregunta.
  FOR k IN 1..3 LOOP
    PERFORM set_config('request.jwt.claims', json_build_object('sub', alumnos[k], 'role', 'authenticated')::text, true);
    PERFORM set_config('request.jwt.claim.sub', alumnos[k]::text, true);
    SET LOCAL ROLE authenticated;
    ses := public.alumno_simulacro_empezar(sim);
    IF k = 1 THEN
      out := out || jsonb_build_object('preguntas', jsonb_array_length(ses->'questions'),
                                       'sin_clave', ses::text !~* '"(correct|correcta|explanation|explicacion)');
    END IF;
    resp := (SELECT jsonb_agg(jsonb_build_object('question_id', q->>'id', 'respuesta', q->'options'->>((k - 1) % jsonb_array_length(q->'options'))))
               FROM jsonb_array_elements(ses->'questions') q);
    r := public.alumno_simulacro_entregar(sim, resp);
    IF k = 1 THEN
      nota0 := (r->>'nota')::numeric;
      out := out || jsonb_build_object('entrega', r->>'status', 'entrega_sin_clave', r::text !~* 'correct',
                                       'reintento', public.alumno_simulacro_entregar(sim, resp)->>'status');
      BEGIN PERFORM public.alumno_simulacro_correccion(sim); out := out || '{"correccion_antes":"SI"}';
      EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS st = RETURNED_SQLSTATE; out := out || jsonb_build_object('correccion_antes', st); END;
    END IF;
    RESET ROLE;
  END LOOP;

  -- Tutor: resultados y cierre.
  PERFORM set_config('request.jwt.claims', json_build_object('sub', tutor, 'role', 'authenticated')::text, true);
  PERFORM set_config('request.jwt.claim.sub', tutor::text, true);
  SET LOCAL ROLE authenticated;
  res := public.tutor_simulacro_resultados(sim);
  out := out || jsonb_build_object('entregados', res->'resumen'->'entregados', 'pocos_datos', res->'resumen'->'pocos_datos',
                                   'alertas', jsonb_array_length(res->'alertas'), 'filas', jsonb_array_length(res->'preguntas'));
  PERFORM public.tutor_simulacro_estado(sim, 'cerrado');
  RESET ROLE;

  -- Alumno 1: corrección coherente con la nota y con las opciones que vio.
  PERFORM set_config('request.jwt.claims', json_build_object('sub', alumnos[1], 'role', 'authenticated')::text, true);
  PERFORM set_config('request.jwt.claim.sub', alumnos[1]::text, true);
  SET LOCAL ROLE authenticated;
  corr := public.alumno_simulacro_correccion(sim);
  out := out || jsonb_build_object(
    'nota_entrega', nota0, 'nota_correccion', corr->'nota',
    'coherente', NOT EXISTS (SELECT 1 FROM jsonb_array_elements(corr->'detalle') d
                              WHERE (d->>'acierto')::boolean <> (d->>'respuesta' = d->>'correct_answer')),
    'claves_mostradas', NOT EXISTS (SELECT 1 FROM jsonb_array_elements(corr->'detalle') d
                                     WHERE NOT (d->'options' ? (d->>'correct_answer'))));
  RESET ROLE;

  RAISE EXCEPTION 'ROLLBACK_OK %', out;
END $$;
