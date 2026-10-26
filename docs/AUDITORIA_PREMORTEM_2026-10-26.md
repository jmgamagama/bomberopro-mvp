# Auditoría pre-mortem — 26/10/2026

Solo lectura salvo la migración 34 (registrada y reversible).

## Cifras (producción)
- 10.326 preguntas publicadas; temas 35-40: 1.466.
- 17,5 % de las publicadas vinculadas a un concepto (temas 1, 6, 35, 36, 38-40).
- 910 conceptos publicados: 233 sin preguntas, 207 con 3 niveles, 68 sin nivel fácil.
- 207 preguntas publicadas con solo 2 opciones (el examen tiene 3).
- 501 publicadas con enunciado idéntico a otra.

## Muestra de 200 preguntas (5 por tema, orden md5(id||'audit-2026-10-26'))
- Clave errónea: 0/200 (límite superior 95 % ≈ 1,5 %).
- Defectuosas: 3/200 (1,5 %).
  - 13546: el enunciado depende de otra pregunta («En esos mismos espacios…»).
  - 2582: «plano neutro» y «plano de presión neutra» son sinónimos (dos opciones defendibles).
  - 8559: acroleína, «penetrante y desagradable» frente a «picante» (coincide con la fuente de academia, discutible).
- Formato: 14337 con solo 2 opciones.
- Contrastadas con el BOE del repo (`data/fuentes`) o con los tests de academia del Drive: 12249, 7742, 5329, 425, 2617, 8550, 7917, 10179 → correctas.
- Sin contrastar con documento (plausibles): 4103, 5591, 10190, 5289 y las de documentos internos del CPEI (temas 4, 5, 35, 37-40).

## Seguridad
- `questions`: sin privilegios para anon ni authenticated (la política «read published» no tiene efecto). Correcto.
- Pendiente: activar «Leaked password protection» en Supabase Auth.

## Arreglado
- Migración 34: 59 preguntas con «X y Y son correctas» → «Las dos anteriores son correctas».
- Interfaz: letras A/B/C delante de cada opción (entrenamiento, simulacro, conceptos).
