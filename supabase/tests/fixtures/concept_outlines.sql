-- Real scalar JSONB definitions read from staging 2026-10-24; no student data.
CREATE OR REPLACE FUNCTION public.get_concept_outline()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH base AS (
    SELECT t.numero AS tema, t.nombre,
           (SELECT count(*) FROM questions q WHERE q.concept_id = c.id AND q.estado = 'publicada') AS npreg,
           CASE WHEN auth.uid() IS NOT NULL
                 AND public.concept_visible_state(s.stability, coalesce(s.reps,0), coalesce(s.lapses,0),
                                                  s.last_review_at, s.last_grade, now()) IN ('dominado','consolidado')
                THEN 1 ELSE 0 END AS dom
      FROM concepts c
      JOIN topics t ON t.id = c.topic_id AND t.convocatoria_id = 1
      LEFT JOIN user_concept_state s ON s.concept_id = c.id AND s.user_id = auth.uid()
     WHERE c.estado = 'publicado'
  ), tem AS (
    SELECT tema, nombre, count(*) AS total, sum(dom) AS dominados, sum(npreg) AS preguntas FROM base GROUP BY tema, nombre
  )
  SELECT coalesce(jsonb_agg(jsonb_build_object('tema', tema, 'nombre', nombre, 'total', total,
                                               'dominados', dominados, 'preguntas', preguntas) ORDER BY tema), '[]'::jsonb)
    FROM tem
$function$;
CREATE OR REPLACE FUNCTION public.get_concept_outline_tema(p_tema integer)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH base AS (
    SELECT t.numero AS tema, t.nombre, c.documento, c.apartado, c.orden, c.id, c.pregunta,
           CASE WHEN auth.uid() IS NOT NULL THEN c.respuesta END AS respuesta,
           (SELECT count(*) FROM questions q WHERE q.concept_id = c.id AND q.estado = 'publicada') AS npreg,
           CASE WHEN auth.uid() IS NOT NULL
                 AND public.concept_visible_state(s.stability, coalesce(s.reps,0), coalesce(s.lapses,0),
                                                  s.last_review_at, s.last_grade, now()) IN ('dominado','consolidado')
                THEN 1 ELSE 0 END AS dom
      FROM concepts c
      JOIN topics t ON t.id = c.topic_id AND t.convocatoria_id = 1 AND t.numero = p_tema
      LEFT JOIN user_concept_state s ON s.concept_id = c.id AND s.user_id = auth.uid()
     WHERE c.estado = 'publicado'
  ), ap AS (
    SELECT tema, nombre, documento, coalesce(apartado, '') AS apartado, min(orden) AS orden,
           count(*) AS total, sum(dom) AS dominados, sum(npreg) AS preguntas,
           jsonb_agg(jsonb_build_object('id', id, 'pregunta', pregunta, 'respuesta', respuesta,
                                        'preguntas', npreg, 'dominado', dom = 1) ORDER BY orden, id) AS conceptos
      FROM base GROUP BY tema, nombre, documento, coalesce(apartado, '')
  ), doc AS (
    SELECT tema, nombre, documento, min(orden) AS orden, sum(total) AS total, sum(dominados) AS dominados,
           sum(preguntas) AS preguntas,
           jsonb_agg(jsonb_build_object('apartado', apartado, 'total', total, 'dominados', dominados,
                                        'preguntas', preguntas, 'conceptos', conceptos)
                     ORDER BY orden, apartado) AS apartados
      FROM ap GROUP BY tema, nombre, documento
  ), tem AS (
    SELECT tema, nombre, sum(total) AS total, sum(dominados) AS dominados, sum(preguntas) AS preguntas,
           jsonb_agg(jsonb_build_object('documento', documento, 'total', total, 'dominados', dominados,
                                        'preguntas', preguntas, 'apartados', apartados) ORDER BY orden, documento) AS documentos
      FROM doc GROUP BY tema, nombre
  )
  SELECT coalesce(jsonb_agg(jsonb_build_object('tema', tema, 'nombre', nombre, 'total', total,
                                               'dominados', dominados, 'preguntas', preguntas, 'documentos', documentos)
                            ORDER BY tema), '[]'::jsonb)
    FROM tem
$function$;
