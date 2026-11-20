-- 61_temas_internos_pantallas_restantes.sql
-- Sigue a la 60: cierra a no-pro las funciones que seguían sirviendo T38, T40 y T39-SOS
-- (hallazgo de QA de Grok, PR #335): pantalla «Temas» (get_topic_study_questions),
-- «Estudiar» (get_concept_session_v2), repaso de errores (get_error_session) y
-- submit_concept_answer (devolvía la respuesta correcta de un id suelto).
-- Usa la regla de la 60 (_puede_ver_pregunta / _puede_ver_concepto). Parchea por reemplazo de texto
-- y aborta si el fragmento no aparece exactamente una vez.
-- Deshacer: 61_temas_internos_pantallas_restantes_down.sql
DO $$
DECLARE d text; n int;
  fns text[][] := ARRAY[
    ['public.get_topic_study_questions(uuid,integer[],integer)',
     'WHERE q.estado = ''publicada''',
     'WHERE q.estado = ''publicada'' AND public._puede_ver_pregunta(t.numero, q.concept_id)'],
    ['public.get_error_session(integer)',
     'WHERE q.estado = ''publicada''',
     'WHERE q.estado = ''publicada'' AND public._puede_ver_pregunta(t.numero, q.concept_id)'],
    ['public.get_concept_session_v2(integer,integer)',
     'FROM public._concept_session(auth.uid(), p_topic, p_minutes, now()) AS s;',
     'FROM public._concept_session(auth.uid(), p_topic, p_minutes, now()) AS s WHERE EXISTS (SELECT 1 FROM public.concepts cc JOIN public.topics tt ON tt.id = cc.topic_id WHERE cc.id = s.concept_id AND public._puede_ver_concepto(tt.numero, cc.documento));'],
    ['public.submit_concept_answer(uuid,text,bigint,text,text,integer,uuid)',
     'AND q.estado = ''publicada'' AND c.estado = ''publicado''',
     'AND q.estado = ''publicada'' AND c.estado = ''publicado'' AND public._puede_ver_pregunta((SELECT tt.numero FROM public.topics tt WHERE tt.id = c.topic_id), q.concept_id)']];
BEGIN
  FOR i IN 1..array_length(fns,1) LOOP
    d := pg_get_functiondef(fns[i][1]::regprocedure);
    n := (length(d) - length(replace(d, fns[i][2], ''))) / length(fns[i][2]);
    IF n <> 1 THEN RAISE EXCEPTION 'parche % : coincidencias=% (esperaba 1)', fns[i][1], n; END IF;
    EXECUTE replace(d, fns[i][2], fns[i][3]);
  END LOOP;
END $$;
