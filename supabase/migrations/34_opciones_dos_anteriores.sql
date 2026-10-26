-- 34_opciones_dos_anteriores.sql
--
-- Problema (producción, auditoría 26/10/2026): 59 preguntas publicadas de 3 opciones tienen como
-- última opción «X y Y son correctas» (p. ej. «B y C son correctas»). En 49 de ellas las letras
-- guardadas tienen huecos (b, c, d o a, c, d) porque se quitó una opción al pasar de 4 a 3, así
-- que en pantalla la primera opción aparece como «A» y la referencia «B y C» apunta a otras
-- opciones. En todas, la opción se refiere exactamente a las otras dos.
--
-- Arreglo: se cambia el texto de esa opción por «Las dos anteriores son correctas». No se toca
-- qué opción es la correcta (la letra no cambia). Sigue contando como referencial
-- (public._opciones_referenciales y el barajado del cliente reconocen «anteriores»), así que no
-- se baraja ni se recorta y sigue la última.
--
-- Registro: el valor anterior de `opciones` queda en qa_changes_20260923 con
-- motivo = '34_dos_anteriores'.
-- Cómo se deshace: 34_opciones_dos_anteriores_down.sql

WITH cand AS (
  SELECT q.id, q.opciones,
         (SELECT array_agg(lower(e->>'letra') ORDER BY e->>'letra') FROM jsonb_array_elements(q.opciones) e) AS letras
    FROM public.questions q
   WHERE q.estado = 'publicada' AND jsonb_array_length(q.opciones) = 3
), hit AS (
  SELECT c.id, c.opciones, lower(e->>'letra') AS l
    FROM cand c
    CROSS JOIN LATERAL jsonb_array_elements(c.opciones) e
    CROSS JOIN LATERAL regexp_match(lower(e->>'texto'),
      '^\s*(?:las (?:respuestas|afirmaciones|opciones)\s+)?([a-d])\)?\s+(?:y|e)\s+([a-d])\)?\s+son correctas\.?\s*$') m
   WHERE m IS NOT NULL
     AND lower(e->>'letra') = c.letras[3]
     AND m[1] <> m[2]
     AND m[1] = ANY (c.letras[1:2]) AND m[2] = ANY (c.letras[1:2])
), logged AS (
  INSERT INTO public.qa_changes_20260923 (question_id, campo, valor_anterior, motivo)
  SELECT id, 'opciones', opciones::text, '34_dos_anteriores' FROM hit
  RETURNING question_id
)
UPDATE public.questions q
   SET opciones = (
     SELECT jsonb_agg(CASE WHEN lower(e->>'letra') = h.l
                           THEN jsonb_set(e, '{texto}', to_jsonb('Las dos anteriores son correctas'::text))
                           ELSE e END ORDER BY ord)
       FROM jsonb_array_elements(q.opciones) WITH ORDINALITY t(e, ord))
  FROM hit h
 WHERE q.id = h.id AND q.id IN (SELECT question_id FROM logged);
