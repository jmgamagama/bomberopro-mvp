-- Marcha atrás de 43_auditoria_200_fase1.sql. Revisar antes de aplicar: vuelve a publicar
-- preguntas con errores conocidos.
-- Restaura desde qa_changes_20260923 (motivo 'AUDIT-200-F1-43: …') solo lo que sigue tal como lo dejó
-- la migración 43: si un editor cambió la pregunta después, no se toca. Deja constancia de cada
-- restauración con el motivo 'ROLLBACK-AUDIT-200-F1-43'.
DO $f1d$
DECLARE
  r record;
  v_n integer;
BEGIN
  -- Preguntas retiradas: volver al estado anterior si siguen en 'borrador'.
  FOR r IN
    SELECT DISTINCT ON (c.question_id) c.question_id, c.valor_anterior
      FROM public.qa_changes_20260923 c
     WHERE c.campo = 'estado' AND c.motivo LIKE 'AUDIT-200-F1-43: retirar;%'
     ORDER BY c.question_id, c.id DESC
  LOOP
    UPDATE public.questions SET estado = r.valor_anterior
     WHERE id = r.question_id AND estado = 'borrador'
       AND NOT EXISTS (SELECT 1 FROM public.qa_changes_20260923 n
                        WHERE n.question_id = r.question_id
                          AND n.motivo NOT LIKE 'AUDIT-200-F1-43:%'
                          AND n.id > (SELECT max(id) FROM public.qa_changes_20260923
                                       WHERE question_id = r.question_id AND motivo LIKE 'AUDIT-200-F1-43:%'));
    GET DIAGNOSTICS v_n = ROW_COUNT;
    IF v_n > 0 THEN
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
        VALUES (r.question_id, 'estado', 'borrador', 'ROLLBACK-AUDIT-200-F1-43');
    END IF;
  END LOOP;

  -- Preguntas corregidas: volver al texto anterior si nadie las ha tocado después.
  FOR r IN
    SELECT q.id,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'enunciado') AS enunciado,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'opciones') AS opciones,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'correcta') AS correcta,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'explicacion') AS explicacion,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'fuente_normativa') AS fuente_normativa
    FROM public.questions q
    JOIN public.qa_changes_20260923 c ON c.question_id = q.id AND c.motivo LIKE 'AUDIT-200-F1-43: corregir;%'
    WHERE q.id IN (5349, 9482, 10761)
    GROUP BY q.id
  LOOP
    UPDATE public.questions q SET
      enunciado = r.enunciado, opciones = r.opciones::jsonb, correcta = r.correcta,
      explicacion = r.explicacion, fuente_normativa = r.fuente_normativa
     WHERE q.id = r.id
       AND NOT EXISTS (SELECT 1 FROM public.qa_changes_20260923 n
                        WHERE n.question_id = r.id
                          AND n.motivo NOT LIKE 'AUDIT-200-F1-43:%'
                          AND n.id > (SELECT max(id) FROM public.qa_changes_20260923
                                       WHERE question_id = r.id AND motivo LIKE 'AUDIT-200-F1-43:%'))
       AND ((q.id = 5349 AND q.fuente_normativa LIKE 'RD 513/2017 (RIPCI), anexo I, sección 1.ª%')
         OR (q.id = 9482 AND q.fuente_normativa = 'Decreto 187/2019, PLATERCAEX, cap. IV.3.4 Grupos de acción (Grupo de Seguridad)')
         OR (q.id = 10761 AND q.fuente_normativa = 'Junta de Extremadura, Extremadura en cifras 2025, cuadro 1.4 (cuencas del Guadiana y del Tajo)'));
    GET DIAGNOSTICS v_n = ROW_COUNT;
    IF v_n > 0 THEN
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
        VALUES (r.id, 'texto', 'version corregida por la migracion 43', 'ROLLBACK-AUDIT-200-F1-43');
    END IF;
  END LOOP;

  -- Conceptos: solo los que la 43 cambió de verdad (registro en qa_concept_changes, aplicación sin
  -- marcha atrás posterior) y que siguen tal como los dejó.
  FOR r IN
    SELECT c.concept_id,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'estado') AS estado,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'respuesta') AS respuesta,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'pregunta') AS pregunta,
      max(c.valor_anterior) FILTER (WHERE c.campo = 'cita') AS cita
    FROM public.qa_concept_changes c
    WHERE c.motivo LIKE 'AUDIT-200-F1-43:%'
      AND c.id > coalesce((SELECT max(rb.id) FROM public.qa_concept_changes rb
                            WHERE rb.concept_id = c.concept_id AND rb.motivo = 'ROLLBACK-AUDIT-200-F1-43'), 0)
    GROUP BY c.concept_id
  LOOP
    UPDATE public.concepts k SET
      estado = coalesce(r.estado, k.estado),
      respuesta = coalesce(r.respuesta, k.respuesta),
      pregunta = coalesce(r.pregunta, k.pregunta),
      cita = coalesce(r.cita, k.cita)
     WHERE k.id = r.concept_id
       AND ((r.estado IS NOT NULL AND k.estado = 'borrador')
         OR (k.id = 'T35-D98-014' AND k.respuesta = 'EX (por ejemplo, EX-103, EX-209, EX-300).')
         OR (k.id = 'T35-D98-017' AND k.cita = 'EX-101 ... BÁSICA ... EX-119 ... BÁSICA'));
    GET DIAGNOSTICS v_n = ROW_COUNT;
    IF v_n > 0 THEN
      INSERT INTO public.qa_concept_changes(concept_id, campo, valor_anterior, motivo)
        VALUES (r.concept_id, 'texto', 'version de la migracion 43', 'ROLLBACK-AUDIT-200-F1-43');
    END IF;
  END LOOP;
END $f1d$;
