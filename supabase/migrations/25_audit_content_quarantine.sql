-- Quarantine only the five source-confirmed defects from 2026-10-24.
-- No answer/text changes, no deletes, no publication. Run as an approved migration.
-- Requires all five matching IDs. Staging without these IDs is NOT a substitute for production.
DO $audit$
DECLARE r record; current_question public.questions%ROWTYPE;
BEGIN
 FOR r IN SELECT * FROM jsonb_to_recordset($snapshot$[{"id": 6971, "tema": 3, "enunciado": "En caso de catástrofe, infortunio público o grave riesgo de que estos se produzcan, ¿quién puede adoptar personalmente y bajo su responsabilidad las medidas necesarias y adecuadas, dando cuenta inmediata al Pleno?", "opciones": [{"letra": "b", "texto": "El Pleno, previa convocatoria extraordinaria de urgencia"}, {"letra": "c", "texto": "El Alcalde"}, {"letra": "d", "texto": "El Delegado del Gobierno en la provincia"}], "correcta": "c", "fuente_normativa": "Ley 7/1985, art. 21.1.m", "target": "fuera_temario"}, {"id": 8202, "tema": 1, "enunciado": "Conforme al artículo 16 de la Constitución Española de 1978, es correcto que:", "opciones": [{"letra": "a", "texto": "Ninguna confesión tendrá carácter oficial"}, {"letra": "b", "texto": "Ningún español podrá ser obligado a declarar sobre su ideología, religión o creencias"}, {"letra": "c", "texto": "Se garantiza la libertad ideológica, religiosa y de culto de los individuos y las comunidades"}], "correcta": "c", "fuente_normativa": "Art. 16 CE", "target": "borrador"}, {"id": 8351, "tema": 1, "enunciado": "¿Qué Título de la Constitución Española regula el Gobierno y la Administración?", "opciones": [{"letra": "a", "texto": "El Título IV"}, {"letra": "c", "texto": "El Título V"}, {"letra": "d", "texto": "El Título III"}], "correcta": "a", "fuente_normativa": "Título IV CE", "target": "fuera_temario"}, {"id": 10305, "tema": 19, "enunciado": "Los establecimientos industriales que desarrollan su actividad en espacios abiertos son de tipo:", "opciones": [{"letra": "a", "texto": "D-E-F"}, {"letra": "b", "texto": "D-E"}, {"letra": "c", "texto": "Los tipos B-C"}, {"letra": "d", "texto": "Los tipos A-B-C"}], "correcta": "b", "fuente_normativa": "RD 164/2025 RSCIEI", "target": "borrador"}, {"id": 10340, "tema": 32, "enunciado": "Señala la respuesta incorrecta respecto a cuándo se instalará sistema de detección de incendios y alarma:", "opciones": [{"letra": "a", "texto": "En uso pública concurrencia cuando la superficie sea superior a 500 m² con mensaje de megafonía, y si es superior a 1000 m² deberá llevar sistema de detección"}, {"letra": "b", "texto": "En uso docente si la superficie construida excede de 1.000 m²"}, {"letra": "c", "texto": "En uso administrativo si la superficie construida excede de 1.000 m²"}, {"letra": "d", "texto": "En uso hospitalario si tiene capacidad superior a 500 camas con comunicación directa con los bomberos"}], "correcta": "d", "fuente_normativa": "CTE DB-SI", "target": "borrador"}]$snapshot$::jsonb)
   AS x(id bigint,tema int,enunciado text,opciones jsonb,correcta text,fuente_normativa text,target text)
 LOOP
  SELECT q.* INTO current_question FROM public.questions q WHERE q.id=r.id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'audit_quarantine_missing_question: %',r.id; END IF;
  -- Already removed by an editor or an earlier run: never overwrite that decision.
  IF current_question.estado <> 'publicada' THEN CONTINUE; END IF;
  IF current_question.enunciado IS DISTINCT FROM r.enunciado
    OR current_question.opciones IS DISTINCT FROM r.opciones
    OR trim(current_question.correcta) IS DISTINCT FROM r.correcta
    OR current_question.fuente_normativa IS DISTINCT FROM r.fuente_normativa
    OR NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.id=current_question.topic_id AND t.numero=r.tema AND t.convocatoria_id=1)
  THEN RAISE EXCEPTION 'audit_quarantine_source_changed: %; editorial review required',r.id; END IF;
  INSERT INTO public.qa_changes_20260923(question_id,campo,valor_anterior,motivo)
    VALUES(r.id,'estado',current_question.estado,'AUDIT-2026-10-24-25: quarantine '||r.target||'; confirmed against official source; no automatic republish');
  UPDATE public.questions SET estado=r.target WHERE id=r.id;
 END LOOP;
END $audit$;
