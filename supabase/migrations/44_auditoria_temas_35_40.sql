-- Fase 1 ampliada de la corrección del banco: auditoría de los temas 35, 36, 38, 39 y 40
-- (documento «Auditoría de contenido: temas 35, 36, 38, 39 y 40», 28/10/2026). Va después de la 43,
-- que ya retira los hallazgos altos de esa auditoría.
--
-- Qué hace:
--  A) Retira 96 preguntas duplicadas: estado 'publicada' -> 'borrador'. Solo si su gemela sigue
--     publicada; si no, la deja como está para no perder el contenido.
--  B) Retira 10 preguntas de gravedad media sin fuente oficial, con el actor o el apartado
--     equivocados o fuera de su tema.
--  C) Corrige 11 preguntas de gravedad media: se precisa el enunciado, se cambia un distractor que
--     era defendible o se avisa en la explicación de una contradicción o errata del propio documento.
--     La respuesta correcta no cambia en ninguna. Cada texto nuevo sale de la cita literal guardada
--     en el concepto de la pregunta o del documento de la auditoría.
--  D) Pasa a borrador los conceptos T39-RAD-001 a 004 (protocolo de radio de 2017, no vigente).
-- No se borra nada. Cada valor anterior queda en qa_changes_20260923 (preguntas) y qa_concept_changes
-- (conceptos, tabla creada por la 43) con el motivo 'AUDIT-35-40-F1B-44: …'.
--
-- Guardias: si falta una pregunta, o su texto ya no coincide con el auditado (md5 de enunciado,
-- opciones, correcta, explicación y fuente), aborta y no cambia nada. Una pregunta que ya no está
-- publicada se deja como está. Se puede aplicar dos veces sin efecto extra.
-- Marcha atrás: 44_auditoria_temas_35_40_down.sql.
DO $f1b$
DECLARE
  r record;
  cur public.questions%ROWTYPE;
  v_motivo text;
  v_new jsonb;
  v_nuevos constant jsonb := $n44${"10928": {"explicacion": "El apartado 3.1 del protocolo dice: «Se han clasificado en 28 tipos (Ver anexo I) según sean Incendios (urbano, industrial y de campo) o Rescate y salvamento (Accidentes de tráfico, rescate y salvamento sin riesgo, rescate y salvamento con riesgo)».", "opciones": [{"letra": "a", "texto": "24 tipos"}, {"letra": "b", "texto": "28 tipos"}, {"letra": "c", "texto": "40 tipos"}]}, "11145": {"enunciado": "Según el apartado 4.2 de la ITF Horario de Actividades, ¿en qué franja horaria se realiza la revisión de material individual y vestuario de cada efectivo, dirigida por el Jefe de Turno?", "explicacion": "El apartado 4.2 de la ITF es «Revisión de material individual y vestuario de cada efectivo (8:10-8:20)» y la dirige el Jefe de Turno. Ojo: el apartado 2 de la misma ITF da otra franja para la revisión diaria de material individual (8:00-8:30). Fuente: ITF Horario de Actividades 2022, edición 2, página 9."}, "11194": {"enunciado": "Según el apartado 2 de la ITF Horario de Actividades del CPEI Badajoz (horario de actividades diarias), ¿en qué franja horaria se realiza la revisión diaria de vehículos, herramientas y material colectivo?", "explicacion": "El apartado 2 de la ITF recoge: «Revisión diaria de vehículos, herramientas y material colectivo (8:30-9:45)». Ojo: los apartados 4 y 5 de la misma ITF detallan las revisiones con otras franjas. En el examen, fíjate en qué apartado te preguntan."}, "11199": {"enunciado": "Según el apartado 2 de la ITF Horario de Actividades del CPEI Badajoz (horario de actividades diarias), ¿en qué franja horaria se realiza la revisión diaria del material individual?", "explicacion": "El apartado 2 de la ITF recoge: «Revisión diaria de material individual (8:00-8:30)». Ojo: el apartado 4.2 de la misma ITF sitúa la revisión de material individual y vestuario de cada efectivo de 8:10 a 8:20. En el examen, fíjate en qué apartado te preguntan."}, "11277": {"enunciado": "Según la ITF de limpieza de EPIs en el parque del CPEI-Badajoz (2026), en el lavado a máquina en parque (Tª 30 ºC-40 ºC) del traje de rescate técnico, ¿qué se hace previamente?", "explicacion": "El traje de rescate técnico se lava a máquina en el parque a 30-40 ºC, «previo volteo de traje». El traje de intervención no se lava en el parque: se comunica al Jefe de Parque o al Jefe de Guardia para valorar su limpieza en lavandería central. Fuente: ITF Limpieza de EPIs en el parque 2026, página 12."}, "11316": {"enunciado": "Según el Protocolo de Movilización del CPEI Badajoz, ¿a qué Jefe o Jefes de Parque informa el operador de la CECOB?", "explicacion": "El protocolo dice que el operador de la CECOB «informará al Jefe de Parque o Parques del área en que esté situado el siniestro y de procedencia de los recursos movilizados». Fuente: Protocolo de Movilización CPEI Badajoz 2025, apartado 5.1, página 4.", "opciones": [{"letra": "a", "texto": "Solo al Jefe de Parque del parque más próximo a la CECOB, sin informar a los demás"}, {"letra": "b", "texto": "Al Jefe de Parque de guardia de la zona limítrofe más próxima al lugar del siniestro"}, {"letra": "c", "texto": "Al Jefe de Parque o Parques del área en que esté situado el siniestro y de procedencia de los recursos movilizados"}]}, "11479": {"enunciado": "Según la ITF de limpieza de EPIs, ¿cuánto dura aproximadamente el secado al aire del casco?", "explicacion": "Para el casco, la ITF indica: «Seque el casco (T.ª máxima = 40 °C) • Secado al aire => aprox. 24 horas»."}, "11489": {"enunciado": "En los trabajos con amianto del CPEI de Badajoz, en la fase 3 (limpieza gruesa in situ), ¿durante qué periodo deben los intervinientes permanecer con el EPI completo perfectamente colocado, incluida la protección respiratoria?", "explicacion": "El PT03 indica: «Los intervinientes deberán permanecer con el EPI´s completo perfectamente colocado, durante TODA LA FASE, incluida la protección respiratoria». Fuente: PT03 Procedimiento de trabajo con amianto, edición 2, página 32."}, "11503": {"explicacion": "El PT03 dice literalmente en el 6.º paso: «Guantes de intervención/técnicos encima de los guantes de vinilo». Ojo: en ese mismo orden de colocación, los guantes del 2.º paso son de nitrilo, así que «vinilo» es probablemente una errata del documento. Fuente: PT03 Procedimiento de trabajo con amianto, edición 2, página 30."}, "11568": {"enunciado": "En la ITF de Vestuario de permanencia y EPIs, ¿en qué temporada puede usarse el pantalón corto en estancia de parque?", "explicacion": "La tabla de prendas inferiores de la ITF recoge: «Pantalón corto: Verano - Estancia parque - Jornada laboral en horario de 7:45-14:00 h. Prohibido su uso para realizar deporte». Fuente: ITF Vestuario de permanencia y EPIs 2026, página 15."}, "11594": {"enunciado": "En el procedimiento de recogida de EPI y vestuario regulado en la ITF de Vestuario de permanencia y EPIs, tras comprobar el material, ¿cómo comunica el jefe de guardia/jefe de turno el resultado a almacén central?"}}$n44$::jsonb;
BEGIN
  IF to_regclass('public.qa_concept_changes') IS NULL THEN
    RAISE EXCEPTION 'auditoria_f1b_falta_43: aplica antes la migración 43';
  END IF;
  FOR r IN
    SELECT * FROM (VALUES
      (10677::bigint, 35, '1e6cd5b9ad3dffcd8b49d1aca09565ab', 'duplicada', 10676, 'duplica la 10676, que se conserva'),
      (10700, 35, '78c6d44f3b3054e86586b28c747889a5', 'duplicada', 7172, 'duplica la 7172, que se conserva'),
      (10716, 35, '3d11efacdc82e031e0db5430997ef94e', 'duplicada', 10715, 'duplica la 10715, que se conserva'),
      (11010, 35, 'b31ab4d5355a3ff2e06603bc03cf2e35', 'duplicada', 10723, 'duplica la 10723, que se conserva'),
      (11013, 35, '9dd474ce1fbc6e254398fbbdcc578dd4', 'duplicada', 10702, 'duplica la 10702, que se conserva'),
      (11014, 35, '14aa86694d4e134246b5cf157081cdb6', 'duplicada', 10676, 'duplica la 10676, que se conserva'),
      (11016, 35, '7b2664afe2101c718a9bab4ce96b31e8', 'duplicada', 10704, 'duplica la 10704, que se conserva'),
      (11017, 35, '2108f60f98b39bcbde9ce8f9651063c7', 'duplicada', 10678, 'duplica la 10678, que se conserva'),
      (11018, 35, 'cbfdd1b7333890492543a2fc7b651b5e', 'duplicada', 10709, 'duplica la 10709, que se conserva'),
      (11019, 35, 'ad6381280b8741a622b7202864e56248', 'duplicada', 7173, 'duplica la 7173, que se conserva'),
      (11020, 35, 'a58fbe4c12755456e1764e84b55866e7', 'duplicada', 10717, 'duplica la 10717, que se conserva'),
      (11022, 35, 'c56948f0390a0ee0afa7fa8cf38f0ba4', 'duplicada', 10705, 'duplica la 10705, que se conserva'),
      (11026, 35, '74bc06dd98d41279b8f00d7b06737840', 'duplicada', 10712, 'duplica la 10712, que se conserva'),
      (11027, 35, '679d7df1f03d433ec1077425a585276c', 'duplicada', 10718, 'duplica la 10718, que se conserva'),
      (11029, 35, '06cf789ab4e1b5fee61a2834a8e798ef', 'duplicada', 10707, 'duplica la 10707, que se conserva'),
      (11030, 35, '0ccba53a7429d4f7c9a28c8ae20c33cd', 'duplicada', 10722, 'duplica la 10722, que se conserva'),
      (11031, 35, 'f3e7bad9fd4c68ed0adbcf41edadf8d2', 'duplicada', 10713, 'duplica la 10713, que se conserva'),
      (11033, 35, 'b333e11330a6999560ff47225d32d5f8', 'duplicada', 10721, 'duplica la 10721, que se conserva'),
      (11035, 35, '159b39d3a8d50d185f3927e7f9d9e20a', 'duplicada', 10715, 'duplica la 10715, que se conserva'),
      (11038, 35, '3047f7fd374acb1b2a997f205b54da93', 'duplicada', 10701, 'duplica la 10701, que se conserva'),
      (11039, 35, '691980ef796ce7f029d808680ba9dd56', 'duplicada', 10703, 'duplica la 10703, que se conserva'),
      (11040, 35, '080517eeeb91d952311b3bf0af097ccf', 'duplicada', 10710, 'duplica la 10710, que se conserva'),
      (11042, 35, '5d61c91fea5bed2d2af3c03b9b912017', 'duplicada', 10720, 'duplica la 10720, que se conserva'),
      (11730, 35, 'e3744482b516035ea14569d12ca739ff', 'duplicada', 10699, 'duplica la 10699, que se conserva'),
      (12965, 35, '2c1ec598ba95450f153399d5de3ac722', 'duplicada', 7174, 'duplica la 7174, que se conserva'),
      (11723, 36, '8a1fed3c1708a5d36fd4aa037784dcb2', 'duplicada', 10732, 'duplica la 10732, que se conserva'),
      (13153, 36, 'dc9452f765cf7fc19f0533652759293d', 'duplicada', 12860, 'duplica la 12860, que se conserva'),
      (10870, 38, 'd5a47143db62076292640475c48c64ac', 'duplicada', 10397, 'duplica la 10397, que se conserva'),
      (11120, 38, '91f9197c83a820903b249bddfa371523', 'duplicada', 10878, 'duplica la 10878, que se conserva'),
      (11122, 38, 'f1d8767e6b8aa4bf9952fb039a053f47', 'duplicada', 10897, 'duplica la 10897, que se conserva'),
      (11123, 38, '2e4a295f3a92e65e945b43acb011eaef', 'duplicada', 10875, 'duplica la 10875, que se conserva'),
      (11130, 38, 'b1ca826e8fe1ab150585cbf122404d6b', 'duplicada', 10956, 'duplica la 10956, que se conserva'),
      (11140, 38, '6af9cd78c8b557edbf357e7db8cf4712', 'duplicada', 10902, 'duplica la 10902, que se conserva'),
      (11154, 38, '04e80813098dc5464181a99924b6afed', 'duplicada', 10385, 'duplica la 10385, que se conserva'),
      (11185, 38, '52b73f321015f9996831f36cc549eb13', 'duplicada', 10957, 'duplica la 10957, que se conserva'),
      (11190, 38, 'cde33993370eebd31c6cad3347a94bf0', 'duplicada', 10414, 'duplica la 10414, que se conserva'),
      (11191, 38, '0ccfc7a04693b0aa3cc230c80e9ade9f', 'duplicada', 10413, 'duplica la 10413, que se conserva'),
      (11197, 38, 'e8b263f1459b1076be1b955b769ff0b4', 'duplicada', 10959, 'duplica la 10959, que se conserva'),
      (11202, 38, 'aa0c5d5c18d7573b016ae7747f408621', 'duplicada', 10893, 'duplica la 10893, que se conserva'),
      (11204, 38, 'c0f3339572bb051fbf3c2c27861b6581', 'duplicada', 10900, 'duplica la 10900, que se conserva'),
      (11206, 38, '8b6974e2c50d79bc01c5544c151af88c', 'duplicada', 10886, 'duplica la 10886, que se conserva'),
      (11207, 38, '5b16abb210122872f9aca7366c65ffda', 'duplicada', 10415, 'duplica la 10415, que se conserva'),
      (11212, 38, 'be11b858a2f99a8b439d9271dd921411', 'duplicada', 10417, 'duplica la 10417, que se conserva'),
      (11216, 38, '45ca733f42f30f4e880f2347c28bef9b', 'duplicada', 10858, 'duplica la 10858, que se conserva'),
      (11222, 38, 'a7c724a6fb6477043cdbe79c7f83da98', 'duplicada', 10889, 'duplica la 10889, que se conserva'),
      (11224, 38, 'a3be4e904ce45e52a23f81bcc0da5cb0', 'duplicada', 10868, 'duplica la 10868, que se conserva'),
      (11225, 38, '8e644de81460f1347e8e0790fe8e933a', 'duplicada', 10894, 'duplica la 10894, que se conserva'),
      (11226, 38, '9029e10cca773406462dbdbe762c6c1d', 'duplicada', 10896, 'duplica la 10896, que se conserva'),
      (11247, 38, 'a0805eeb848a6fdedd8b940bd7e4df1c', 'duplicada', 10885, 'duplica la 10885, que se conserva'),
      (11250, 38, 'a9a54cb8a9464bfa3798c30da2358bea', 'duplicada', 10399, 'duplica la 10399, que se conserva'),
      (11276, 38, 'ce8cf4b0a701a92ff38f2d6fdf5dea97', 'duplicada', 10861, 'duplica la 10861, que se conserva'),
      (11499, 38, 'f311fb0baf180e74b2bf50587e3a00a3', 'duplicada', 10895, 'duplica la 10895, que se conserva'),
      (11567, 38, '1dc2463140506701231b8f290dcdf4a8', 'duplicada', 10388, 'duplica la 10388, que se conserva'),
      (11577, 38, 'a3d39a470d31c4d42bf9668db60d2a08', 'duplicada', 11183, 'duplica la 11183, que se conserva'),
      (11580, 38, 'aa0cc741dae0ca78d0bcc02aa491e8f4', 'duplicada', 10387, 'duplica la 10387, que se conserva'),
      (11585, 38, 'a8ffc15e5f2c908d91aa9c10ced0b514', 'duplicada', 10382, 'duplica la 10382, que se conserva'),
      (11590, 38, '8e14ed470f07d6de00d646c1b8489784', 'duplicada', 10393, 'duplica la 10393, que se conserva'),
      (11593, 38, '2e5c6f409ea3e880eb3e52194ea7f75f', 'duplicada', 10874, 'duplica la 10874, que se conserva'),
      (11598, 38, '39f04497d8535bdcc25639903df98c33', 'duplicada', 10383, 'duplica la 10383, que se conserva'),
      (11606, 38, '0c4ad2f593bdc0990e608c47a0a839c0', 'duplicada', 10879, 'duplica la 10879, que se conserva'),
      (11609, 38, 'f4061fda44ee14aeae0a535957388229', 'duplicada', 10951, 'duplica la 10951, que se conserva'),
      (11622, 38, '1d229dfcf62b2df9d2f32d4cfa22f40d', 'duplicada', 10860, 'duplica la 10860, que se conserva'),
      (11637, 38, '836479f9034cd923a2c0e78d66cbc967', 'duplicada', 10882, 'duplica la 10882, que se conserva'),
      (11642, 38, 'e318963e2f1c31bb1c54cb32eeab2072', 'duplicada', 11109, 'duplica la 11109, que se conserva'),
      (11647, 38, '2e841d343c9efbdb2fb84b3dbfa27f5f', 'duplicada', 11147, 'duplica la 11147, que se conserva'),
      (11648, 38, '7a7aab78905200aaba02271efe93bd15', 'duplicada', 10894, 'duplica la 10894, que se conserva'),
      (11652, 38, 'e34aa8b74b99fea66a2527db43abf590', 'duplicada', 10963, 'duplica la 10963, que se conserva'),
      (11653, 38, 'fd915fc8af01c984f5f64c2884cec18a', 'duplicada', 10423, 'duplica la 10423, que se conserva'),
      (11655, 38, '67883910ad9b278ddf7d2646d97e357d', 'duplicada', 10882, 'duplica la 10882, que se conserva'),
      (11240, 39, '446d3397622e5b939264a0e8a0eb0e24', 'duplicada', 10933, 'duplica la 10933, que se conserva'),
      (11264, 39, 'e2a7e2b0b31f8a9d0245526f494c685c', 'duplicada', 10930, 'duplica la 10930, que se conserva'),
      (11266, 39, '7eeb98c652729c77ead242ccf7254b3d', 'duplicada', 10931, 'duplica la 10931, que se conserva'),
      (11272, 39, '733fd2af709ebad70fda6bff7e2bf2a1', 'duplicada', 10927, 'duplica la 10927, que se conserva'),
      (11284, 39, 'a20c4902ba16ade339600403a630b841', 'duplicada', 10990, 'duplica la 10990, que se conserva'),
      (11285, 39, '52b7a3b56ced9ec9f4a4304f33e8fd18', 'duplicada', 10941, 'duplica la 10941, que se conserva'),
      (11286, 39, '79f8dcf0c9480bae1741011b023fbb0d', 'duplicada', 11000, 'duplica la 11000, que se conserva'),
      (11290, 39, 'e04ac65427367cdd04c2134758c6c066', 'duplicada', 11006, 'duplica la 11006, que se conserva'),
      (11294, 39, '1b3261f998f8876e107dc8a97fbd791a', 'duplicada', 10988, 'duplica la 10988, que se conserva'),
      (11295, 39, 'a3f9e582a0102baa6067a22086c56f19', 'duplicada', 10989, 'duplica la 10989, que se conserva'),
      (11303, 39, 'bea3c56a23f4ecb895b487396c341d7b', 'duplicada', 11005, 'duplica la 11005, que se conserva'),
      (11308, 39, '0658d1e222117c08a0d6d3fc21ff6ef8', 'duplicada', 10943, 'duplica la 10943, que se conserva'),
      (11317, 39, 'b3627b6c3a444e9a909c615b00e452d3', 'duplicada', 10944, 'duplica la 10944, que se conserva'),
      (11693, 39, 'c8e88f2a9b75d8641efc93a6375902a1', 'duplicada', 10991, 'duplica la 10991, que se conserva'),
      (11788, 39, 'e97d9297244a2cd9634c104ba8439ff4', 'duplicada', 10935, 'duplica la 10935, que se conserva'),
      (11793, 39, 'd1f2444c3e2ddd1e5861dc167fbbb39c', 'duplicada', 10936, 'duplica la 10936, que se conserva'),
      (11794, 39, '2dd07ddf6cdb9a57b61298e3c9c49992', 'duplicada', 10937, 'duplica la 10937, que se conserva'),
      (11797, 39, 'ee902d91bda99eb78b71c8a42629d401', 'duplicada', 10928, 'duplica la 10928, que se conserva'),
      (11812, 39, '9c17f6291502f754a25df2c73f9ef6ba', 'duplicada', 10929, 'duplica la 10929, que se conserva'),
      (7213, 40, '07c05ec94602baddc400cd36822d2a8b', 'duplicada', 11747, 'duplica la 11747, que se conserva'),
      (7216, 40, '54912b8b7579151732fe050ba645f00c', 'duplicada', 11775, 'duplica la 11775, que se conserva'),
      (7218, 40, '407a5e2c79bf8a82ecb3e3bbdce5cdeb', 'duplicada', 11755, 'duplica la 11755, que se conserva'),
      (7219, 40, '393e07605be903a38f1b9099a6dbcad3', 'duplicada', 11764, 'duplica la 11764, que se conserva'),
      (7220, 40, 'cbce0d51c6228eb16e508a386d9389f3', 'duplicada', 11774, 'duplica la 11774, que se conserva'),
      (7223, 40, '3d05feae713e8c19235c60c684399bb4', 'duplicada', 11703, 'duplica la 11703, que se conserva'),
      (7224, 40, 'f10d951bf843441a5be98e89a09bd2a6', 'duplicada', 11720, 'duplica la 11720, que se conserva'),
      (11439, 40, '3ca2d1c730af99cd2a324c5f6b4b19c1', 'duplicada', 11419, 'duplica la 11419, que se conserva'),
      (7169, 35, 'dac1e2c15020a8fd6b75b9fb87eaf0ba', 'retirar', NULL, 'el enunciado dice que la N-430 parte de Badajoz y pasa por Mérida; el catálogo del Estado la da de Torrefresneda (A-5) a Almansa'),
      (7179, 35, 'c4f705dfd213896df4a0491190fd89af', 'retirar', NULL, 'materia del tema 39 (Protocolo de Movilización), que ya la cubren 10935 y 11788'),
      (11021, 35, 'b899fb526c55eaef0b769ef6289d3a01', 'retirar', NULL, 'la denominación oficial de la A-43 es «Autovía del Guadiana. Mérida / Ciudad Real / Atalaya del Cañavate» (catálogo de la Red del Estado)'),
      (11036, 35, 'd2e246d0219cdb5e22611f5c650faa60', 'retirar', NULL, 'duplica la 10680 y atribuye tres categorías a la Red de Carreteras de Extremadura, que la Ley 7/1995 (art. 4) clasifica en cuatro'),
      (11164, 36, '6b5db095da5cf75f8e50bc96cf662c90', 'retirar', NULL, 'cota y ubicación de La Centinela sin fuente oficial (el vértice IGN Centinela está en Montijo, 274 m)'),
      (11174, 36, '5af6b3dd59cd5eb6a33ebf63d6191a10', 'retirar', NULL, 'la explicación da 917 m al Cerro de San Cristóbal sin fuente oficial (IGN 89650: Higuera la Real, 773,5 m); su concepto T36-SIT-003 ya está en borrador'),
      (11532, 36, '2e8bb5feff74fdb7ed45c7d8af41d5b8', 'retirar', NULL, 'cota y ubicación de Peña Utrera sin fuente oficial (el vértice IGN La Utrera está en Don Benito, 612,8 m)'),
      (11498, 39, 'ece73801d2ff9dacac4a45af5ecb9441', 'retirar', NULL, 'el anexo VII del BOP 4899/2025 no fija «RECIBIDO» como regla; esa regla es del PT01 (tema 40) y ya la cubre la 11752'),
      (11504, 39, 'bb132b15cf60687fa824656dd635173b', 'retirar', NULL, 'en el ejemplo del anexo VII (3.5) quien indica y repite «canal 9 directo» es el MRI (JP-11), no la dotación'),
      (11660, 39, '8844af0ed5a857567eea96c2173103ed', 'retirar', NULL, 'el apartado 8 del anexo VII es el código ICAO; los repetidores son el apartado 9 (conceptos T39-MOV-223 a 228)'),
      (11145, 38, 'c9d3952bcb1c704167267ec6d168dde0', 'corregir', NULL, 'la ITF Horario da dos franjas para las revisiones (apdo. 2 frente a apdos. 4 y 5); se cita el apartado'),
      (11194, 38, 'bc85abe684ce18b38d10b6b83cecf929', 'corregir', NULL, 'la ITF Horario da dos franjas para las revisiones (apdo. 2 frente a apdos. 4 y 5); se cita el apartado'),
      (11199, 38, '2261eed78e9f3bc461bdd50b09366141', 'corregir', NULL, 'la ITF Horario da dos franjas para las revisiones (apdo. 2 frente a apdos. 4 y 5); se cita el apartado'),
      (11277, 38, '11e330c42e0792e43421bf90d3db0b09', 'corregir', NULL, 'solo el traje de rescate técnico se lava a máquina en el parque; el de intervención, nunca (anexo I)'),
      (11479, 38, 'd905a5f9f42b0d90d5175528af234391', 'corregir', NULL, 'el secado al aire de unas 24 horas es el del casco, no de todos los equipos'),
      (11568, 38, '05f0bf380478513c8cea5ae1751be805', 'corregir', NULL, 'el pantalón corto solo se permite en estancia de parque; «en itinere» corresponde al pantalón largo'),
      (11594, 38, '2f303898c161279129a638217d72d298', 'corregir', NULL, 'la comprobación es del procedimiento de recogida (cuando el trabajador cesa), no de entrega (apdo. 5, paso 3.º)'),
      (10928, 39, '1c6472d483070a8061f7605c0dcc772a', 'corregir', NULL, 'el distractor «32 tipos» es defendible (los anexos enumeran más tipos); se cambia por 40'),
      (11316, 39, '1f600c91c43a6f73018d2b4464adc341', 'corregir', NULL, 'el área y la procedencia describen a qué Jefes de Parque se informa, no el contenido de la información (apdo. 5.1)'),
      (11489, 40, '8a0048f1d0fb99c42a81e72f163bf14e', 'corregir', NULL, 'sin decir qué fase, «toda la fase» no se entiende; es la fase 3 (apdo. 9.4)'),
      (11503, 40, 'c1ba3e12a5ce9b2c2393ef7d3203029f', 'corregir', NULL, '«vinilo» es probablemente una errata del PT03 (el 2.º paso son guantes de nitrilo); se avisa en la explicación')
    ) AS v(id, tema, hash, accion, gemela, razon)
  LOOP
    SELECT q.* INTO cur FROM public.questions q WHERE q.id = r.id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'auditoria_f1b_falta_pregunta: %', r.id; END IF;
    IF cur.estado <> 'publicada' THEN CONTINUE; END IF;
    -- Ya aplicada y sin marcha atrás posterior: no se toca.
    IF EXISTS (SELECT 1 FROM public.qa_changes_20260923 c
                WHERE c.question_id = r.id AND c.motivo LIKE 'AUDIT-35-40-F1B-44:%'
                  AND c.id > coalesce((SELECT max(rb.id) FROM public.qa_changes_20260923 rb
                                        WHERE rb.question_id = r.id AND rb.motivo = 'ROLLBACK-AUDIT-35-40-F1B-44'), 0))
    THEN CONTINUE; END IF;
    IF md5(concat_ws('|', cur.enunciado, cur.opciones::text, trim(cur.correcta), cur.explicacion, cur.fuente_normativa)) <> r.hash
       OR NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.id = cur.topic_id AND t.numero = r.tema AND t.convocatoria_id = 1)
    THEN RAISE EXCEPTION 'auditoria_f1b_texto_cambiado: %; revisar a mano', r.id; END IF;

    v_motivo := 'AUDIT-35-40-F1B-44: ' || r.accion || '; ' || r.razon;

    IF r.accion IN ('duplicada', 'retirar') THEN
      -- Una duplicada solo se retira si su gemela sigue publicada.
      IF r.accion = 'duplicada' AND NOT EXISTS (SELECT 1 FROM public.questions g
                                                  WHERE g.id = r.gemela AND g.estado = 'publicada') THEN
        RAISE NOTICE 'auditoria_f1b: % se mantiene porque su gemela % no está publicada', r.id, r.gemela;
        CONTINUE;
      END IF;
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo)
        VALUES (r.id, 'estado', cur.estado, v_motivo);
      UPDATE public.questions SET estado = 'borrador' WHERE id = r.id;
    ELSE
      v_new := v_nuevos -> r.id::text;
      IF v_new IS NULL THEN RAISE EXCEPTION 'auditoria_f1b_correccion_sin_texto: %', r.id; END IF;
      INSERT INTO public.qa_changes_20260923(question_id, campo, valor_anterior, motivo) VALUES
        (r.id, 'enunciado', cur.enunciado, v_motivo),
        (r.id, 'opciones', cur.opciones::text, v_motivo),
        (r.id, 'explicacion', cur.explicacion, v_motivo);
      UPDATE public.questions SET
        enunciado = coalesce(v_new ->> 'enunciado', enunciado),
        opciones = coalesce(v_new -> 'opciones', opciones),
        explicacion = coalesce(v_new ->> 'explicacion', explicacion)
      WHERE id = r.id;
    END IF;
  END LOOP;

  -- D) Conceptos del protocolo de radio de 2017. Lo que ya estaba en borrador no se toca ni se registra.
  WITH prev AS (
    SELECT c.id, c.estado FROM public.concepts c
     WHERE c.id IN ('T39-RAD-001', 'T39-RAD-002', 'T39-RAD-003', 'T39-RAD-004') AND c.estado = 'publicado' FOR UPDATE
  ), upd AS (
    UPDATE public.concepts c SET estado = 'borrador' FROM prev WHERE c.id = prev.id RETURNING c.id
  )
  INSERT INTO public.qa_concept_changes(concept_id, campo, valor_anterior, motivo)
  SELECT prev.id, 'estado', prev.estado, 'AUDIT-35-40-F1B-44: retirar; edición 2017 del protocolo de radio, no vigente; el tema se examina por el anexo VII del BOP 4899/2025'
    FROM prev JOIN upd ON upd.id = prev.id;
END $f1b$;
