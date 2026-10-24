-- Review before applying: restoring original state republishes known defects.
-- Restores only unchanged quarantined records with this migration's exact audit entry.
DO $audit$
DECLARE r record; v_previous text; v_changed integer;
BEGIN
 FOR r IN SELECT * FROM jsonb_to_recordset($snapshot$[{"id": 6971, "tema": 3, "enunciado": "En caso de catástrofe, infortunio público o grave riesgo de que estos se produzcan, ¿quién puede adoptar personalmente y bajo su responsabilidad las medidas necesarias y adecuadas, dando cuenta inmediata al Pleno?", "opciones": [{"letra": "b", "texto": "El Pleno, previa convocatoria extraordinaria de urgencia"}, {"letra": "c", "texto": "El Alcalde"}, {"letra": "d", "texto": "El Delegado del Gobierno en la provincia"}], "correcta": "c", "fuente_normativa": "Ley 7/1985, art. 21.1.m", "target": "fuera_temario", "explicacion": "El art. 21.1.m LBRL faculta al Alcalde para adoptar personalmente y bajo su responsabilidad las medidas necesarias ante catástrofes o grave riesgo de las mismas, informando de inmediato al Pleno."}, {"id": 8202, "tema": 1, "enunciado": "Conforme al artículo 16 de la Constitución Española de 1978, es correcto que:", "opciones": [{"letra": "a", "texto": "Ninguna confesión tendrá carácter oficial"}, {"letra": "b", "texto": "Ningún español podrá ser obligado a declarar sobre su ideología, religión o creencias"}, {"letra": "c", "texto": "Se garantiza la libertad ideológica, religiosa y de culto de los individuos y las comunidades"}], "correcta": "c", "fuente_normativa": "Art. 16 CE", "target": "borrador", "explicacion": "El artículo 16.1 CE garantiza la libertad ideológica, religiosa y de culto de individuos y comunidades (el 16.3 dice que ninguna confesión tendrá carácter \"estatal\", no \"oficial\", y el 16.2 dice que \"nadie\", no solo \"ningún español\", podrá ser obligado a declarar sobre su ideología, religión o creencias)."}, {"id": 8351, "tema": 1, "enunciado": "¿Qué Título de la Constitución Española regula el Gobierno y la Administración?", "opciones": [{"letra": "a", "texto": "El Título IV"}, {"letra": "c", "texto": "El Título V"}, {"letra": "d", "texto": "El Título III"}], "correcta": "a", "fuente_normativa": "Título IV CE", "target": "fuera_temario", "explicacion": "El Gobierno y la Administración se regulan en el Título IV de la Constitución."}, {"id": 10305, "tema": 19, "enunciado": "Los establecimientos industriales que desarrollan su actividad en espacios abiertos son de tipo:", "opciones": [{"letra": "a", "texto": "D-E-F"}, {"letra": "b", "texto": "D-E"}, {"letra": "c", "texto": "Los tipos B-C"}, {"letra": "d", "texto": "Los tipos A-B-C"}], "correcta": "b", "fuente_normativa": "RD 164/2025 RSCIEI", "target": "borrador", "explicacion": "Los establecimientos en espacios abiertos son de tipo D-E."}, {"id": 10340, "tema": 32, "enunciado": "Señala la respuesta incorrecta respecto a cuándo se instalará sistema de detección de incendios y alarma:", "opciones": [{"letra": "a", "texto": "En uso pública concurrencia cuando la superficie sea superior a 500 m² con mensaje de megafonía, y si es superior a 1000 m² deberá llevar sistema de detección"}, {"letra": "b", "texto": "En uso docente si la superficie construida excede de 1.000 m²"}, {"letra": "c", "texto": "En uso administrativo si la superficie construida excede de 1.000 m²"}, {"letra": "d", "texto": "En uso hospitalario si tiene capacidad superior a 500 camas con comunicación directa con los bomberos"}], "correcta": "d", "fuente_normativa": "CTE DB-SI", "target": "borrador", "explicacion": "Es incorrecta: en uso hospitalario el umbral es superior a 100 camas, no 500, con comunicación directa con los bomberos."}]$snapshot$::jsonb)
   AS x(id bigint,tema int,enunciado text,opciones jsonb,correcta text,fuente_normativa text,target text,explicacion text)
 LOOP
  PERFORM 1 FROM public.questions WHERE id=r.id FOR UPDATE;
  SELECT valor_anterior INTO v_previous FROM public.qa_changes_20260923
   WHERE question_id=r.id AND campo='estado'
    AND motivo='AUDIT-2026-10-24-25: quarantine '||r.target||'; confirmed against official source; no automatic republish'
   ORDER BY id DESC LIMIT 1;
  IF NOT FOUND THEN CONTINUE; END IF;
  UPDATE public.questions q SET estado=v_previous
   WHERE q.id=r.id AND q.estado=r.target AND q.enunciado=r.enunciado
    AND q.opciones=r.opciones AND trim(q.correcta)=r.correcta AND q.fuente_normativa=r.fuente_normativa AND q.explicacion IS NOT DISTINCT FROM r.explicacion
    AND EXISTS (SELECT 1 FROM public.topics t WHERE t.id=q.topic_id AND t.numero=r.tema AND t.convocatoria_id=1)
    AND NOT EXISTS (SELECT 1 FROM public.qa_changes_20260923 newer
      WHERE newer.question_id=r.id AND newer.campo='estado' AND newer.id>(SELECT max(id) FROM public.qa_changes_20260923
        WHERE question_id=r.id AND campo='estado' AND motivo='AUDIT-2026-10-24-25: quarantine '||r.target||'; confirmed against official source; no automatic republish'));
  GET DIAGNOSTICS v_changed = ROW_COUNT;
  IF v_changed>0 THEN
   INSERT INTO public.qa_changes_20260923(question_id,campo,valor_anterior,motivo)
    VALUES(r.id,'estado',r.target,'ROLLBACK-AUDIT-2026-10-24-25: explicit restoration of original state');
  END IF;
 END LOOP;
END $audit$;
