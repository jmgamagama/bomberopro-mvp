-- Fase 1 de la corrección del banco tras la auditoría de 200 preguntas (28/10/2026) y las auditorías
-- de los temas 35, 36 y 38. Informes: revisiones/auditoria-200-preguntas/ y el documento
-- «Auditoría de contenido: temas 35, 36, 38, 39 y 40».
--
-- Qué hace:
--  A) Retira de circulación (estado 'publicada' -> 'borrador') 18 preguntas con la clave falsa,
--     no única o sin fuente oficial. No se borra nada.
--  B) Corrige 3 preguntas con texto oficial verificado (cita literal en la explicación).
--  C) Despublica 3 conceptos de la EX-100 (hoy N-523, RD 334/2019) y quita la EX-100 como ejemplo
--     en otros 2 conceptos.
-- Cada valor anterior queda registrado (motivo 'AUDIT-200-F1-43: …'): las preguntas en
-- qa_changes_20260923 y los conceptos en qa_concept_changes (tabla nueva, solo para editores).
--
-- Guardias: si falta una pregunta, o su texto ya no coincide con el auditado (md5 de enunciado,
-- opciones, correcta, explicación y fuente), aborta y no cambia nada. Una pregunta que ya no está
-- publicada (la apartó un editor) se deja como está. Se puede aplicar dos veces sin efecto extra.
-- Marcha atrás: 43_auditoria_200_fase1_down.sql.
-- Registro de cambios en conceptos (qa_changes_20260923 solo admite preguntas). Sin acceso de alumnos.
CREATE TABLE IF NOT EXISTS public.qa_concept_changes (
  id bigserial PRIMARY KEY,
  concept_id text NOT NULL,
  campo text NOT NULL,
  valor_anterior text,
  motivo text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.qa_concept_changes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.qa_concept_changes FROM PUBLIC;
DO $r$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN EXECUTE 'REVOKE ALL ON public.qa_concept_changes FROM anon'; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN EXECUTE 'REVOKE ALL ON public.qa_concept_changes FROM authenticated'; END IF;
END $r$;

DO $f1$
DECLARE
  r record;
  cur public.questions%ROWTYPE;
  v_motivo text;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      -- A) Retiradas
      (8073::bigint, 13, '6505f4b5da6ef62b4d05da379e20b2fd', 'retirar', 'UNE-EN 469: mínimo único de 225 N en costuras; las opciones «>225» y «>=225» no se distinguen'),
      (2593, 18, '38b736a9335220e831198042950b6560', 'retirar', 'a) y c) son correctas; además la explicación muestra una nota interna («CORRECCIÓN DE CONTENIDO»)'),
      (9782, 22, '2d2348d67ec48cfdf34cadd24603fbd7', 'retirar', 'la clave contradice su propia explicación (más resistencia longitudinal que transversal); d no es un mínimo general'),
      (9193, 28, 'ce13d8b734c5088498e8fda54c6f84b2', 'retirar', 'REBT ITC-BT-17 1.3: el IGA también protege contra sobrecarga y cortocircuito; a) y c) correctas'),
      (3107, 29, '631fc7777dbb9f4625db14384a749080', 'retirar', 'PLATERCAEX 2019: no existe la figura de «Asesor del Comité de Dirección»; opciones «Ambas»/«Ninguna»'),
      (11025, 35, '440d47e62205e6fd75a5c2217f2a74aa', 'retirar', 'la EX-100 pasó al Estado y hoy es la N-523 (RD 334/2019, arts. 1 y 2)'),
      (12883, 35, 'c7f1ce0655143dc690f5cc7e32c9d9c7', 'retirar', 'la EX-100 pasó al Estado y hoy es la N-523 (RD 334/2019, arts. 1 y 2)'),
      (10695, 35, '41a8de164c69556f00eb3e73d82c26ab', 'retirar', 'el catálogo de la Red del Estado denomina la N-430 «Badajoz a Valencia por Almansa»; «por La Serena» no tiene fuente oficial'),
      (11032, 35, 'c8227d0e26e42d9956fb3223ae50df9b', 'retirar', 'la clave «por La Serena» no es la denominación oficial de la N-430 («Badajoz a Valencia por Almansa»)'),
      (11712, 35, '43a947286fc3b63139ec2a49639dd035', 'retirar', 'la secuencia de 6 pasos atribuida al Mapa Oficial de Carreteras no tiene fuente oficial'),
      (10724, 35, 'ecfa244eade7dee95c5ea8620ce54f09', 'retirar', 'secuencia de localización de siniestros sin fuente oficial'),
      (10725, 35, 'c52130824dddf81d9af1f848d1cf4444', 'retirar', 'secuencia de localización de siniestros sin fuente oficial'),
      (11708, 36, '1448a2637d3f9abcdf593ddd5e554d1e', 'retirar', 'IGN, vértice 80621 «Buitrera»: Benquerencia de la Serena, 855,8 m; no Puebla de Alcocer ni 1.021 m'),
      (10731, 36, 'ecc21b66ab3473eca82348059d68a0f7', 'retirar', 'el Nomenclátor del IGN no decide la denominación oficial de los municipios (Ley 7/1985, art. 14.1)'),
      (11514, 36, 'b94d7ba36517ef566ba25cebe859f7a2', 'retirar', 'el Nomenclátor del IGN no decide la denominación oficial de los municipios (Ley 7/1985, art. 14.1)'),
      (11546, 36, '5684e37b7d0bc88a15fd7566d12a49f5', 'retirar', 'Extremadura en cifras 2025, cuadro 1.4: el Matachel desemboca en Don Álvaro, no en Alange'),
      (11268, 38, 'dd6e6a24324d8ba9402ef111ff00a01e', 'retirar', 'ITF Limpieza EPIs 2026, apdo. 4.1: el 2.º paso es del Jefe de Parque/Jefe de Guardia, no del gestor ni del almacén periférico'),
      (11166, 38, '2e99bc6e625d164deee95be4159b2bd7', 'retirar', 'ITF Vestuario 2026, apdo. 5: la entrega final es en el almacén central; dos opciones defendibles'),
      -- B) Corregidas
      (5349, 33, '7f133526a891f3e4ace96c409309b051', 'corregir', 'el RIPCI admite la UNE-EN 60849:2002 como alternativa (nota 2); se reescribe sobre el texto del RD 164/2025'),
      (9482, 29, 'aea81ecbccf93fa48f32ce2684899962', 'corregir', 'la función citada es también del Grupo Sanitario; se pregunta una función exclusiva del Grupo de Seguridad'),
      (10761, 36, '95d42018e5b8ea977bd86ca9971c1928', 'corregir', 'Extremadura en cifras 2025, cuadro 1.4: el Matachel desemboca en Don Álvaro, no en Alange')
    ) AS v(id, tema, hash, accion, razon)
  LOOP
    SELECT q.* INTO cur FROM public.questions q WHERE q.id = r.id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'auditoria_f1_falta_pregunta: %', r.id; END IF;
    -- Ya apartada (por un editor o por esta migración): no se toca.
    IF cur.estado <> 'publicada' THEN CONTINUE; END IF;
    -- Ya corregida por esta migración y sin marcha atrás posterior: no se toca. Si se deshizo con el
    -- _down, se vuelve a aplicar (la guardia de md5 comprueba que el texto es el auditado).
    IF EXISTS (SELECT 1 FROM public.qa_changes_20260923 c
                WHERE c.question_id = r.id AND c.motivo LIKE 'AUDIT-200-F1-43:%'
                  AND c.id > coalesce((SELECT max(rb.id) FROM public.qa_changes_20260923 rb
                                        WHERE rb.question_id = r.id AND rb.motivo = 'ROLLBACK-AUDIT-200-F1-43'), 0))
    THEN CONTINUE; END IF;
    IF md5(concat_ws('|', cur.enunciado, cur.opciones::text, trim(cur.correcta), cur.explicacion, cur.fuente_normativa)) <> r.hash
       OR NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.id = cur.topic_id AND t.numero = r.tema AND t.convocatoria_id = 1)
    THEN RAISE EXCEPTION 'auditoria_f1_texto_cambiado: %; revisar a mano', r.id; END IF;

    v_motivo := 'AUDIT-200-F1-43: ' || r.accion || '; ' || r.razon;

    IF r.accion = 'retirar' THEN
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
        VALUES (r.id, 'estado', cur.estado, v_motivo);
      UPDATE public.questions SET estado = 'borrador' WHERE id = r.id;
    ELSE
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo) VALUES
        (r.id, 'enunciado', cur.enunciado, v_motivo),
        (r.id, 'opciones', cur.opciones::text, v_motivo),
        (r.id, 'correcta', trim(cur.correcta), v_motivo),
        (r.id, 'explicacion', cur.explicacion, v_motivo),
        (r.id, 'fuente_normativa', cur.fuente_normativa, v_motivo);
      IF r.id = 5349 THEN
        UPDATE public.questions SET
          enunciado = 'Según el RIPCI (RD 513/2017), en la redacción dada por el RD 164/2025, el diseño, instalación y puesta en servicio de los sistemas de alarma por voz será conforme a la norma:',
          opciones = '[{"letra":"a","texto":"UNE 23500"},{"letra":"b","texto":"UNE 23007-32"},{"letra":"c","texto":"UNE-EN 671-3"}]'::jsonb,
          correcta = 'b',
          explicacion = 'El RD 164/2025 (disposición final primera, apartado siete) añadió al anexo I del RIPCI, sección 1.ª, epígrafe 1: «El diseño, instalación y puesta en servicio de los sistemas de alarma por voz, será conforme a la norma UNE 23007-32.» La UNE 23500 trata los sistemas de abastecimiento de agua contra incendios y la UNE-EN 671-3, las instalaciones fijas de lucha contra incendios (BIE). Como alternativa a la UNE 23007-32, el RIPCI también admite la UNE-EN 60849:2002 (nota 2 de su relación de normas).',
          fuente_normativa = 'RD 513/2017 (RIPCI), anexo I, sección 1.ª, epígrafe 1, modificado por el RD 164/2025, disposición final primera, apartado siete (BOE-A-2025-7190)'
        WHERE id = r.id;
      ELSIF r.id = 9482 THEN
        UPDATE public.questions SET
          enunciado = 'Según el PLATERCAEX, ¿a qué grupo de acción corresponde la función de «garantizar la seguridad de los bienes y evitar el saqueo en la zona afectada si fuera necesario»?',
          opciones = '[{"letra":"a","texto":"Al Grupo Sanitario"},{"letra":"b","texto":"Al Grupo de Seguridad"},{"letra":"c","texto":"Al Grupo de Apoyo Técnico"}]'::jsonb,
          correcta = 'b',
          explicacion = 'El PLATERCAEX (cap. IV.3.4, Grupos de acción) incluye entre las funciones del Grupo de Seguridad: «Garantizar la seguridad de los bienes y evitar el saqueo en la zona afectada si fuera necesario». El Grupo Sanitario y el de Apoyo Técnico no tienen esa función.',
          fuente_normativa = 'Decreto 187/2019, PLATERCAEX, cap. IV.3.4 Grupos de acción (Grupo de Seguridad)'
        WHERE id = r.id;
      ELSIF r.id = 10761 THEN
        UPDATE public.questions SET
          enunciado = 'Según el cuadro de las cuencas del Guadiana y del Tajo de «Extremadura en cifras 2025», ¿en qué localidad desemboca el río Matachel?',
          opciones = '[{"letra":"a","texto":"Olivenza"},{"letra":"b","texto":"Medellín"},{"letra":"c","texto":"Don Álvaro"}]'::jsonb,
          correcta = 'c',
          explicacion = 'El cuadro 1.4 de «Extremadura en cifras 2025» recoge el Matachel como afluente del Guadiana: nace en El Retamar, desemboca en Don Álvaro y tiene 124 km.',
          fuente_normativa = 'Junta de Extremadura, Extremadura en cifras 2025, cuadro 1.4 (cuencas del Guadiana y del Tajo)'
        WHERE id = r.id;
      ELSE
        RAISE EXCEPTION 'auditoria_f1_correccion_sin_texto: %', r.id;
      END IF;
    END IF;
  END LOOP;

  -- C) Conceptos de la EX-100 (RD 334/2019: hoy es la N-523 del Estado). Cada cambio real queda en
  --    qa_concept_changes con su valor anterior; lo que ya estaba en borrador no se toca ni se registra.
  WITH prev AS (
    SELECT c.id, c.estado FROM public.concepts c
     WHERE c.id IN ('T35-D98-023', 'T35-D98-095', 'T35-D98-100') AND c.estado = 'publicado' FOR UPDATE
  ), upd AS (
    UPDATE public.concepts c SET estado = 'borrador' FROM prev WHERE c.id = prev.id RETURNING c.id
  )
  INSERT INTO public.qa_concept_changes(concept_id, campo, valor_anterior, motivo)
  SELECT prev.id, 'estado', prev.estado, 'AUDIT-200-F1-43: retirar; la EX-100 es la N-523 desde el RD 334/2019'
    FROM prev JOIN upd ON upd.id = prev.id;

  WITH prev AS (
    SELECT c.id, c.respuesta, c.cita FROM public.concepts c
     WHERE c.id = 'T35-D98-014' AND c.respuesta = 'EX (por ejemplo, EX-100, EX-209, EX-300).' FOR UPDATE
  ), upd AS (
    UPDATE public.concepts c SET
      respuesta = 'EX (por ejemplo, EX-103, EX-209, EX-300).',
      cita = 'EX-103 | DE PUEBLA DE ALCOCER A EX-201 POR LLERENA | BÁSICA; EX-209 | DE BADAJOZ A MÉRIDA POR MONTIJO | INTERCOMARCAL'
    FROM prev WHERE c.id = prev.id RETURNING c.id
  )
  INSERT INTO public.qa_concept_changes(concept_id, campo, valor_anterior, motivo)
  SELECT prev.id, x.campo, x.valor, 'AUDIT-200-F1-43: corregir; se quita la EX-100 como ejemplo'
    FROM prev JOIN upd ON upd.id = prev.id
    CROSS JOIN LATERAL (VALUES ('respuesta', prev.respuesta), ('cita', prev.cita)) AS x(campo, valor);

  WITH prev AS (
    SELECT c.id, c.pregunta, c.cita FROM public.concepts c
     WHERE c.id = 'T35-D98-017' AND c.cita = 'EX-100 ... BÁSICA ... EX-119 ... BÁSICA' FOR UPDATE
  ), upd AS (
    UPDATE public.concepts c SET
      pregunta = 'En el catálogo autonómico, ¿a qué categoría pertenecen las carreteras numeradas EX-1xx (EX-101 a EX-119)?',
      cita = 'EX-101 ... BÁSICA ... EX-119 ... BÁSICA'
    FROM prev WHERE c.id = prev.id RETURNING c.id
  )
  INSERT INTO public.qa_concept_changes(concept_id, campo, valor_anterior, motivo)
  SELECT prev.id, x.campo, x.valor, 'AUDIT-200-F1-43: corregir; se quita la EX-100 como ejemplo'
    FROM prev JOIN upd ON upd.id = prev.id
    CROSS JOIN LATERAL (VALUES ('pregunta', prev.pregunta), ('cita', prev.cita)) AS x(campo, valor);
END $f1$;
