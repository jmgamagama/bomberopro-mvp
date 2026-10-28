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

  -- Conceptos: valores anteriores escritos aquí.
  UPDATE public.concepts SET estado = 'publicado'
   WHERE id IN ('T35-D98-023', 'T35-D98-095', 'T35-D98-100') AND estado = 'borrador';

  UPDATE public.concepts SET
    respuesta = 'EX (por ejemplo, EX-100, EX-209, EX-300).',
    cita = 'EX-100 | DE CÁCERES A BADAJOZ | BÁSICA; EX-209 | DE BADAJOZ A MÉRIDA POR MONTIJO | INTERCOMARCAL'
   WHERE id = 'T35-D98-014' AND respuesta = 'EX (por ejemplo, EX-103, EX-209, EX-300).';

  UPDATE public.concepts SET
    pregunta = 'En el catálogo autonómico, ¿a qué categoría pertenecen las carreteras numeradas EX-1xx (EX-100 a EX-119)?',
    cita = 'EX-100 ... BÁSICA ... EX-119 ... BÁSICA'
   WHERE id = 'T35-D98-017' AND cita = 'EX-101 ... BÁSICA ... EX-119 ... BÁSICA';
END $f1d$;
