-- Marcha atrás de 35. Revisar antes de aplicar: republica preguntas con un defecto conocido.
-- Restaura solo las que siguen en 'borrador' y no han tenido otro cambio de estado posterior.
DO $audit$
DECLARE r record; v_motivo constant text :=
  'AUDIT-2026-10-26-35: "Todas las anteriores" no es la ultima opcion; sin sentido tras quitar una opcion; pendiente de revision editorial';
BEGIN
  FOR r IN
    SELECT DISTINCT ON (c.question_id) c.id AS log_id, c.question_id, c.valor_anterior
      FROM public.qa_changes_20260923 c
     WHERE c.campo = 'estado' AND c.motivo = v_motivo
     ORDER BY c.question_id, c.id DESC
  LOOP
    PERFORM 1 FROM public.questions WHERE id = r.question_id FOR UPDATE;
    CONTINUE WHEN EXISTS (SELECT 1 FROM public.qa_changes_20260923 n
                           WHERE n.question_id = r.question_id AND n.campo = 'estado' AND n.id > r.log_id);
    UPDATE public.questions SET estado = r.valor_anterior
     WHERE id = r.question_id AND estado = 'borrador';
    IF FOUND THEN
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
        VALUES (r.question_id, 'estado', 'borrador', 'ROLLBACK-AUDIT-2026-10-26-35: restauracion explicita');
    END IF;
  END LOOP;
END $audit$;
