-- Marcha atrás de 45_auditoria_temas_35_40.sql. Revisar antes de aplicar: vuelve a publicar
-- duplicadas y preguntas con defectos conocidos.
-- Restaura desde qa_changes_20260923 y qa_concept_changes (motivo 'AUDIT-35-40-F1B-45: …') solo lo que
-- sigue tal como lo dejó la 45: si un editor lo cambió después, no se toca. Deja constancia de cada
-- restauración con el motivo 'ROLLBACK-AUDIT-35-40-F1B-45'.
DO $f1bd$
DECLARE
  r record;
  v_n integer;
  v_nuevos constant jsonb := $n45${"10928": {"explicacion": "El apartado 3.1 del protocolo dice: «Se han clasificado en 28 tipos (Ver anexo I) según sean Incendios (urbano, industrial y de campo) o Rescate y salvamento (Accidentes de tráfico, rescate y salvamento sin riesgo, rescate y salvamento con riesgo)».", "opciones": [{"letra": "a", "texto": "24 tipos"}, {"letra": "b", "texto": "28 tipos"}, {"letra": "c", "texto": "40 tipos"}]}, "11145": {"enunciado": "Según el apartado 4.2 de la ITF Horario de Actividades, ¿en qué franja horaria se realiza la revisión de material individual y vestuario de cada efectivo, dirigida por el Jefe de Turno?", "explicacion": "El apartado 4.2 de la ITF es «Revisión de material individual y vestuario de cada efectivo (8:10-8:20)» y la dirige el Jefe de Turno. Ojo: el apartado 2 de la misma ITF da otra franja para la revisión diaria de material individual (8:00-8:30). Fuente: ITF Horario de Actividades 2022, edición 2, página 9."}, "11194": {"enunciado": "Según el apartado 2 de la ITF Horario de Actividades del CPEI Badajoz (horario de actividades diarias), ¿en qué franja horaria se realiza la revisión diaria de vehículos, herramientas y material colectivo?", "explicacion": "El apartado 2 de la ITF recoge: «Revisión diaria de vehículos, herramientas y material colectivo (8:30-9:45)». Ojo: los apartados 4 y 5 de la misma ITF detallan las revisiones con otras franjas. En el examen, fíjate en qué apartado te preguntan."}, "11199": {"enunciado": "Según el apartado 2 de la ITF Horario de Actividades del CPEI Badajoz (horario de actividades diarias), ¿en qué franja horaria se realiza la revisión diaria del material individual?", "explicacion": "El apartado 2 de la ITF recoge: «Revisión diaria de material individual (8:00-8:30)». Ojo: el apartado 4.2 de la misma ITF sitúa la revisión de material individual y vestuario de cada efectivo de 8:10 a 8:20. En el examen, fíjate en qué apartado te preguntan."}, "11277": {"enunciado": "Según la ITF de limpieza de EPIs en el parque del CPEI-Badajoz (2026), en el lavado a máquina en parque (Tª 30 ºC-40 ºC) del traje de rescate técnico, ¿qué se hace previamente?", "explicacion": "El traje de rescate técnico se lava a máquina en el parque a 30-40 ºC, «previo volteo de traje». El traje de intervención no se lava en el parque: se comunica al Jefe de Parque o al Jefe de Guardia para valorar su limpieza en lavandería central. Fuente: ITF Limpieza de EPIs en el parque 2026, página 12."}, "11316": {"enunciado": "Según el Protocolo de Movilización del CPEI Badajoz, ¿a qué Jefe o Jefes de Parque informa el operador de la CECOB?", "explicacion": "El protocolo dice que el operador de la CECOB «informará al Jefe de Parque o Parques del área en que esté situado el siniestro y de procedencia de los recursos movilizados». Fuente: Protocolo de Movilización CPEI Badajoz 2025, apartado 5.1, página 4.", "opciones": [{"letra": "a", "texto": "Solo al Jefe de Parque del parque más próximo a la CECOB, sin informar a los demás"}, {"letra": "b", "texto": "Al Jefe de Parque de guardia de la zona limítrofe más próxima al lugar del siniestro"}, {"letra": "c", "texto": "Al Jefe de Parque o Parques del área en que esté situado el siniestro y de procedencia de los recursos movilizados"}]}, "11479": {"enunciado": "Según la ITF de limpieza de EPIs, ¿cuánto dura aproximadamente el secado al aire del casco?", "explicacion": "Para el casco, la ITF indica: «Seque el casco (T.ª máxima = 40 °C) • Secado al aire => aprox. 24 horas»."}, "11489": {"enunciado": "En los trabajos con amianto del CPEI de Badajoz, en la fase 3 (limpieza gruesa in situ), ¿durante qué periodo deben los intervinientes permanecer con el EPI completo perfectamente colocado, incluida la protección respiratoria?", "explicacion": "El PT03 indica: «Los intervinientes deberán permanecer con el EPI´s completo perfectamente colocado, durante TODA LA FASE, incluida la protección respiratoria». Fuente: PT03 Procedimiento de trabajo con amianto, edición 2, página 32."}, "11503": {"explicacion": "El PT03 dice literalmente en el 6.º paso: «Guantes de intervención/técnicos encima de los guantes de vinilo». Ojo: en ese mismo orden de colocación, los guantes del 2.º paso son de nitrilo, así que «vinilo» es probablemente una errata del documento. Fuente: PT03 Procedimiento de trabajo con amianto, edición 2, página 30."}, "11568": {"enunciado": "En la ITF de Vestuario de permanencia y EPIs, ¿en qué temporada puede usarse el pantalón corto en estancia de parque?", "explicacion": "La tabla de prendas inferiores de la ITF recoge: «Pantalón corto: Verano - Estancia parque - Jornada laboral en horario de 7:45-14:00 h. Prohibido su uso para realizar deporte». Fuente: ITF Vestuario de permanencia y EPIs 2026, página 15."}, "11594": {"enunciado": "En el procedimiento de recogida de EPI y vestuario regulado en la ITF de Vestuario de permanencia y EPIs, tras comprobar el material, ¿cómo comunica el jefe de guardia/jefe de turno el resultado a almacén central?"}}$n45$::jsonb;
BEGIN
  -- Retiradas y duplicadas: volver al estado anterior si siguen en 'borrador'.
  FOR r IN
    SELECT DISTINCT ON (c.question_id) c.question_id, c.valor_anterior
      FROM public.qa_changes_20260923 c
     WHERE c.campo = 'estado' AND (c.motivo LIKE 'AUDIT-35-40-F1B-45: retirar;%' OR c.motivo LIKE 'AUDIT-35-40-F1B-45: duplicada;%')
       AND c.id > coalesce((SELECT max(rb.id) FROM public.qa_changes_20260923 rb
                             WHERE rb.question_id = c.question_id AND rb.motivo = 'ROLLBACK-AUDIT-35-40-F1B-45'), 0)
     ORDER BY c.question_id, c.id DESC
  LOOP
    UPDATE public.questions SET estado = r.valor_anterior
     WHERE id = r.question_id AND estado = 'borrador'
       AND NOT EXISTS (SELECT 1 FROM public.qa_changes_20260923 n
                        WHERE n.question_id = r.question_id
                          AND n.motivo NOT LIKE 'AUDIT-35-40-F1B-45:%'
                          AND n.id > (SELECT max(id) FROM public.qa_changes_20260923
                                       WHERE question_id = r.question_id AND motivo LIKE 'AUDIT-35-40-F1B-45:%'));
    GET DIAGNOSTICS v_n = ROW_COUNT;
    IF v_n > 0 THEN
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
        VALUES (r.question_id, 'estado', 'borrador', 'ROLLBACK-AUDIT-35-40-F1B-45');
    END IF;
  END LOOP;

  -- Corregidas: volver al texto anterior si siguen con el texto de la 45 y nadie las tocó después.
  FOR r IN
    SELECT c.question_id AS id,
      (array_agg(c.valor_anterior ORDER BY c.id DESC) FILTER (WHERE c.campo = 'enunciado'))[1] AS enunciado,
      (array_agg(c.valor_anterior ORDER BY c.id DESC) FILTER (WHERE c.campo = 'opciones'))[1] AS opciones,
      (array_agg(c.valor_anterior ORDER BY c.id DESC) FILTER (WHERE c.campo = 'explicacion'))[1] AS explicacion
    FROM public.qa_changes_20260923 c
    WHERE c.motivo LIKE 'AUDIT-35-40-F1B-45: corregir;%'
      AND c.id > coalesce((SELECT max(rb.id) FROM public.qa_changes_20260923 rb
                            WHERE rb.question_id = c.question_id AND rb.motivo = 'ROLLBACK-AUDIT-35-40-F1B-45'), 0)
    GROUP BY c.question_id
  LOOP
    UPDATE public.questions q SET
      enunciado = r.enunciado, opciones = r.opciones::jsonb, explicacion = r.explicacion
     WHERE q.id = r.id
       AND q.enunciado = coalesce(v_nuevos -> r.id::text ->> 'enunciado', q.enunciado)
       AND q.opciones = coalesce(v_nuevos -> r.id::text -> 'opciones', q.opciones)
       AND q.explicacion = coalesce(v_nuevos -> r.id::text ->> 'explicacion', q.explicacion)
       AND NOT EXISTS (SELECT 1 FROM public.qa_changes_20260923 n
                        WHERE n.question_id = r.id
                          AND n.motivo NOT LIKE 'AUDIT-35-40-F1B-45:%'
                          AND n.id > (SELECT max(id) FROM public.qa_changes_20260923
                                       WHERE question_id = r.id AND motivo LIKE 'AUDIT-35-40-F1B-45:%'));
    GET DIAGNOSTICS v_n = ROW_COUNT;
    IF v_n > 0 THEN
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
        VALUES (r.id, 'texto', 'version corregida por la migracion 45', 'ROLLBACK-AUDIT-35-40-F1B-45');
    END IF;
  END LOOP;

  -- Conceptos: volver a 'publicado' solo los que la 45 pasó a borrador y siguen en borrador.
  FOR r IN
    SELECT c.concept_id, (array_agg(c.valor_anterior ORDER BY c.id DESC))[1] AS estado
    FROM public.qa_concept_changes c
    WHERE c.motivo LIKE 'AUDIT-35-40-F1B-45:%' AND c.campo = 'estado'
      AND c.id > coalesce((SELECT max(rb.id) FROM public.qa_concept_changes rb
                            WHERE rb.concept_id = c.concept_id AND rb.motivo = 'ROLLBACK-AUDIT-35-40-F1B-45'), 0)
    GROUP BY c.concept_id
  LOOP
    UPDATE public.concepts k SET estado = r.estado WHERE k.id = r.concept_id AND k.estado = 'borrador';
    GET DIAGNOSTICS v_n = ROW_COUNT;
    IF v_n > 0 THEN
      INSERT INTO public.qa_concept_changes(concept_id, campo, valor_anterior, motivo)
        VALUES (r.concept_id, 'estado', 'borrador', 'ROLLBACK-AUDIT-35-40-F1B-45');
    END IF;
  END LOOP;
END $f1bd$;
