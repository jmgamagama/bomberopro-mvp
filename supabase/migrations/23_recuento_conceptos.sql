-- 23: recuento de conceptos por tema, documento y apartado (lo pidió JM el 23/10/2026).
-- El alumno ve cuántos conceptos tiene cada tema, cada bloque (documento) y cada apartado, y
-- —si tiene cuenta— cuántos lleva dominados. Los números salen de la base de datos, nunca a mano.
--
-- Qué hace:
--   get_concept_outline(): resumen por tema [{tema, nombre, total, dominados, preguntas}] (ligero).
--   get_concept_outline_tema(p_tema): el árbol completo de UN tema (documentos → apartados → conceptos).
--   Ambas de solo lectura. Para la convocatoria 1 y conceptos 'publicado' devuelve
--   [{tema, nombre, total, dominados, preguntas, documentos:[{documento, total, dominados, preguntas,
--     apartados:[{apartado, total, dominados, preguntas,
--       conceptos:[{id, pregunta, respuesta, preguntas, dominado}]}]}]}]
--   ordenado por tema y por el orden de los conceptos. «preguntas» = preguntas de test publicadas
--   ligadas al concepto (lo que el alumno puede encontrarse sobre él).
--   Visitante sin cuenta (anon): solo recuentos (dominados = 0). Con cuenta: «dominados» = conceptos
--   cuyo estado visible es 'dominado' o 'consolidado' (misma regla que get_concept_progress).
--   La «respuesta» de la tarjeta solo se envía con cuenta (el visitante ve la lista de conceptos y los
--   recuentos). Nunca devuelve enunciados ni opciones de test, ni datos de otros usuarios.
--
-- Cómo se deshace: 23_recuento_conceptos_down.sql (borra la función).

CREATE OR REPLACE FUNCTION public.get_concept_outline()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.get_concept_outline_tema(p_tema integer)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
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
$$;

REVOKE ALL ON FUNCTION public.get_concept_outline() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_concept_outline() TO anon, authenticated;
REVOKE ALL ON FUNCTION public.get_concept_outline_tema(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_concept_outline_tema(integer) TO anon, authenticated;
