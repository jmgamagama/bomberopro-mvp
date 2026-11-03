-- 20_no_recortar_opciones_referenciales.sql
--
-- Problema (en producción, 17/10/2026): 4.833 preguntas publicadas tienen 4 opciones y las RPC de
-- sesión y simulacro las recortan a 3 al azar (se queda la correcta + 2). En 2.154 hay opciones que
-- se refieren a otras («Ambas son correctas», «Todas las anteriores», «A y B son correctas»…) y en
-- 510 la correcta es una de esas. Si el recorte quita una opción referida, la pregunta queda sin
-- sentido o con la «correcta» equivocada.
--
-- Arreglo: si alguna opción es referencial (public._opciones_referenciales), se sirven todas las
-- opciones sin recortar. Las demás preguntas se siguen recortando a 3, como en el examen.
--
-- Cómo: se reescribe la definición vigente de cada función con un reemplazo de texto comprobado
-- (si el patrón no aparece y la función no está ya corregida, la migración falla y no cambia nada).
-- Funciones: get_study_session, get_topic_study_questions, get_preparer_session_questions,
-- get_blueprint_exam_questions y, si ya existen sin corregir, _concept_session y
-- get_concept_step_question (la 18 ya las crea corregidas).
-- Cómo se deshace: 20_no_recortar_opciones_referenciales_down.sql

CREATE OR REPLACE FUNCTION public._opciones_referenciales(p jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM jsonb_array_elements(coalesce(p, '[]'::jsonb)) e
     WHERE (e->>'texto') ~* '(\mambas\M|\mtodas\M|anteriores|\m[a-d]\M\)?\s+(y|e|o)\s+\m[a-d]\M|más de una|las dos|ninguna de (las|ellas|estas)|\mson correctas\M)')
$$;

DO $$
DECLARE
  r record;
  v_def text;
  v_new text;
BEGIN
  FOR r IN
    SELECT p.oid, p.proname FROM pg_proc p
     WHERE p.pronamespace = 'public'::regnamespace
       AND p.proname IN ('get_study_session', 'get_topic_study_questions', 'get_preparer_session_questions',
                         '_concept_session', 'get_concept_step_question')
  LOOP
    v_def := pg_get_functiondef(r.oid);
    IF position('_opciones_referenciales' IN v_def) > 0 THEN CONTINUE; END IF;
    v_new := regexp_replace(v_def,
      'jsonb_array_length\((\w+)\.opciones\) <= 3',
      'jsonb_array_length(\1.opciones) <= 3 OR public._opciones_referenciales(\1.opciones)', 'g');
    IF v_new = v_def THEN RAISE EXCEPTION '%: patrón de recorte no encontrado', r.proname; END IF;
    EXECUTE v_new;
  END LOOP;

  SELECT p.oid INTO r FROM pg_proc p
   WHERE p.pronamespace = 'public'::regnamespace AND p.proname = 'get_blueprint_exam_questions';
  IF FOUND THEN
    v_def := pg_get_functiondef(r.oid);
    IF position('_opciones_referenciales' IN v_def) = 0 THEN
      v_new := replace(v_def, 'WHERE elem.rn <= 3) AS opciones3',
        'WHERE elem.rn <= CASE WHEN public._opciones_referenciales(f.opciones) THEN 99 ELSE 3 END) AS opciones3');
      IF v_new = v_def THEN RAISE EXCEPTION 'get_blueprint_exam_questions: patrón de recorte no encontrado'; END IF;
      EXECUTE v_new;
    END IF;
  END IF;
END $$;
