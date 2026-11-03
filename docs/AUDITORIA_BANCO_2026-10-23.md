# Auditoría del banco de preguntas — CPEI Badajoz 2026 (23/10/2026)

Producción (`yndoaprnpkjqiggeyefz`), `convocatoria_id = 1`, solo `estado = 'publicada'`. Solo lectura, salvo la corrección del punto 1.

## 1. Corrección aplicada: tema 37

- Había 317 preguntas publicadas. 300 citan el *Plan de Prevención de Riesgos Laborales del CPEI-Badajoz, revisión 1 (Quirón Prevención, 23/12/2025)* con su página.
- **17 eran del Plan Periurbano de Prevención de Incendios Forestales del Ayuntamiento de Badajoz** (ids 7225–7241), es decir, de otra convocatoria. Han pasado a `reservada_otra_oposicion`, con el valor anterior registrado en `qa_changes_20260923`.
- Barrido de los 40 temas buscando material de Ayuntamiento, Cáceres, Patrimonio u otras comunidades: no hay más casos. Las 5 coincidencias que salieron son legítimas (art. 46 CE, carreteras que pasan por Cáceres, notación UNE).

## 2. Cobertura: los 40 temas tienen preguntas (9.786 publicadas)

Temas con menos de 100: 18 (35), 26 (36), 21 (42), 23 (60), 24 (80), 10 (88) y 12 (93). Sus borradores casi nunca tienen fuente, así que no se pueden publicar sin más.

## 3. Riesgo principal: precisión de la fuente

Heurística: una fuente se considera **precisa** si cita BOE, DOE o BOP, o un artículo, anexo, apartado o página.

- Precisa: **2.464 (25 %)**.
- Genérica (por ejemplo, «Material de rescate - normativa técnica»): **7.305 (75 %)**.
- Sin fuente: 17.

Temas con al menos un 80 % de fuente precisa: 1, 7, 31, 33, 34, 35 y 37. Temas en torno al 0 %: 4, 8, 9, 17, 18, 20, 21, 23, 26, 27, 36 y 40, entre otros.

La heurística es aproximada: algunos temas internos del CPEI (36, 38, 39 y 40) citan documentos con otro formato. Hay que confirmarlo con una muestra.

## 4. Conceptos enlazados (aprendizaje adaptativo)

Solo los tienen los temas 1, 35, 36, 38, 39 y 40. En los otros 34 temas la escalera de niveles por concepto no funciona.

## 5. Bloqueo de licencias (decisión de JM)

Según `docs/PERMISOS_FUENTES.md`, los temas 15, 18 y 19 dependen de manuales sin licencia (manual del CPEI, libros de CCOO, CEIS Guadalajara CC BY-NC-SA).

Aun así, en producción hay preguntas publicadas de esos temas con fuentes como «manual de fábrica» o «Manual técnico…» (origen `plataforma` o `reformulada_de_plataforma`). Hay que decidir:
- (a) pedir autorización (los contactos están en `PERMISOS_FUENTES.md`), o
- (b) mantenerlas solo si su contenido es conocimiento técnico general redactado de forma propia, o
- (c) despublicarlas.

## 6. Orden propuesto (protocolo `bomberopro-contenido-temario`)

1. Re-anclar los temas por peso en el examen y por riesgo. Primero los de **fuente BOE/DOE disponible** y fuente genérica: 4, 2, 6, 17, 20, 23, 27, 29 y 30. Por cada tema: texto oficial → vincular o corregir las preguntas existentes → conceptos con 3 niveles → validador → revisión ciega → borrador en producción → **aprobación de JM** → publicar.
2. Temas internos del CPEI (36, 38, 39 y 40): confirmar que la fuente es el documento interno vigente.
3. Temas técnicos sin norma (8, 9, 13, 14, 15, 18, 19, 21, 22 y 25): resolver antes el bloqueo de licencias del punto 5.

Consultas usadas: ver el historial de la sesión del 23/10/2026. Para reproducirlas, basta un `GROUP BY` por `topics.numero` y la heurística de arriba sobre `questions.fuente_normativa`.

## 7. Corrección de una tarjeta con nota interna (23/10/2026)

- Concepto `T40-PT01-001`. La respuesta explicaba al alumno una errata del documento. Valor anterior, por si hay que restaurarlo:
  «El R.D. 1215/1997, de 18 de julio (en la introducción aparece impreso «R.D. 121/1997» por errata; en Referencias legislativas figura R.D. 1215/1997, de 18 julio).»
- Valor nuevo: «El R.D. 1215/1997, de 18 de julio.»
- Se buscaron notas parecidas («errata», «aviso de fuente», «omitiendo», «pendiente de»…) en todos los conceptos publicados y no hay más casos.
