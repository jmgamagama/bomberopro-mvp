---
name: verificar-banco-preguntas
description: Audita preguntas de oposiciones contra fuentes oficiales vigentes y evita publicar contenido no revisado.
---
# Verificar banco de preguntas — BomberoPRO

## Cuándo usar
Antes de crear, corregir, importar, cambiar de estado o publicar cualquier pregunta, respuesta, explicación o referencia normativa.

## Reglas obligatorias
1. Identificar oposición y convocatoria exactas. Nunca mezclar CPEI y Ayuntamiento de Badajoz.
2. Solicitar para cada pregunta: identificador, enunciado, opciones, respuesta propuesta, explicación, fuente primaria oficial, artículo/apartado/página, versión y fecha de vigencia.
3. Verificar que la fuente primaria realmente respalda **una única respuesta defendible** y que la redacción no introduce ambigüedad. Usar BOE cuando corresponda a normativa estatal; para normativa autonómica/local, utilizar el diario oficial o documento institucional competente. No exigir BOE para fuentes que no se publican allí.
4. Comprobar modificaciones, derogaciones, disposiciones transitorias y fecha relevante de convocatoria. Si no puede comprobarse vigencia o fuente, marcar CORREGIR, nunca APTA.
5. Señalar preguntas con códigos arbitrarios, distractores triviales, sesgos, soluciones sugeridas en el enunciado, duplicados o mera memorización de números sin relevancia.
6. Veredicto: APTA, CORREGIR o DESCARTAR; justificar con evidencia trazable y confianza. Toda APTA requiere revisión humana registrada antes de exposición pública.
7. No confundir contenido generado, revisado automáticamente o encontrado en internet con pregunta oficial.
8. No escribir SQL ni publicar/modificar producción como parte de una auditoría. Separar hallazgos de acciones y respetar revisiones, RLS y filtros en backend.

## Registro mínimo de auditoría
- ID, oposición, tema, pregunta y versión
- Veredicto y motivo
- Fuente oficial / URI, artículo, apartado, fecha de consulta y vigencia
- Respuesta validada y corrección propuesta si procede
- Identidad y fecha de la revisión humana, estado persistido y evidencia de filtrado en servidor

## Prueba de concordancia
Comparar el veredicto de cada agente contra un conjunto de referencia revisado por humanos (correctas, ambiguas, desactualizadas y sin fuente). Medir exactitud por clase y **falsos APTA**, no solo acuerdo entre modelos. Ante discrepancia, bloquear publicación hasta resolverla.
