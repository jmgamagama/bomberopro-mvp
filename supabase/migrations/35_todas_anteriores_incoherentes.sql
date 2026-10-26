-- 35_todas_anteriores_incoherentes.sql
--
-- Problema (producción, 26/10/2026): 35 preguntas publicadas tienen una opción «Todas las anteriores…»
-- que NO es la última. Al pasar de 4 a 3 opciones se quitó una y la opción quedó en primera o segunda
-- posición: en pantalla «Todas las anteriores son correctas» apunta a una sola opción, o a ninguna
-- (p. ej. id 8936: «señala cuál NO es…» con la clave «Todas las anteriores son funciones…»).
-- No se puede reescribir sin las fuentes de cada una, así que se apartan (estado = 'borrador').
-- No se borra nada, no se toca el texto ni la clave, y no se republican solas.
--
-- Registro: el estado anterior queda en qa_changes_20260923 (campo 'estado') con el motivo de abajo.
-- Cómo se deshace: 35_todas_anteriores_incoherentes_down.sql
-- Idempotente: solo toca preguntas todavía publicadas que cumplan la regla.
DO $audit$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT q.id, q.estado
      FROM public.questions q
      JOIN public.topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
     WHERE q.estado = 'publicada'
       AND EXISTS (
         SELECT 1
           FROM jsonb_array_elements(q.opciones) WITH ORDINALITY x(o, ord)
          WHERE x.o->>'texto' ~* 'todas las anteriores'
            AND x.ord <> jsonb_array_length(q.opciones))
     ORDER BY q.id
       FOR UPDATE OF q
  LOOP
    INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
      VALUES (r.id, 'estado', r.estado,
              'AUDIT-2026-10-26-35: "Todas las anteriores" no es la ultima opcion; sin sentido tras quitar una opcion; pendiente de revision editorial');
    UPDATE public.questions SET estado = 'borrador' WHERE id = r.id;
  END LOOP;
END $audit$;
