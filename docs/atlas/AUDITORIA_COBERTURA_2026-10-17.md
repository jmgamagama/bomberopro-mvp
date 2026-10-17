# Cobertura REAL del grafo MIRA — auditoría read-only (17-10-2026)
## Alcance y fuente
Revisión **directa** de la base Supabase de producción `bomberopro-prod`, usando únicamente agregaciones SQL sin datos personales y sin escrituras. La consulta reproducible está en `scripts/audits/mira_content_coverage.sql`. La verdad cambiante es la consulta, no esta fotografía.

## Resultado
| Indicador | Valor |
|---|---:|
| Preguntas registradas | 11.067 |
| Preguntas con estado `publicada` | **10.214** |
| Preguntas publicadas con cualquier `concept_id` | **975** (9,5 %) |
| Preguntas publicadas ligadas a un concepto **publicado** | **553** (5,4 %) |
| Preguntas publicadas que apuntan a concepto **borrador** | **422** |
| Conceptos totales | 1.085 |
| Conceptos publicados | **703** |
| Conceptos publicados con al menos una pregunta publicada elegible | **470** |
| Eventos de MIRA | 175 |
| Estados individuales MIRA | 105 |

Los 975 enlaces **no** representan 975 preguntas operativas para MIRA: 422 referencias apuntan a conceptos en borrador. Los 553 elementos técnicamente elegibles tampoco equivalen a 553 conceptos distintos: corresponden a 470 conceptos.

| Tema | Preguntas publicadas | Enlazadas en total | Enlace a concepto publicado | Conceptos publicados | Decisión |
|---|---:|---:|---:|---:|---|
| 35 | 217 | 169 | **169** | 164 | Mantener/verificar |
| 36 | 207 | 90 | **0** | 0 | QA editorial antes de publicar |
| 38 | 343 | 332 | **0** | 0 | QA editorial antes de publicar |
| 39 | 238 | 222 | **222** | 272 | Mantener/verificar |
| 40 | 162 | 162 | **162** | 267 | Mantener/verificar |
| **Total en 41 temas** | **10.214** | **975** | **553** | **703** | **Ampliar con QA** |

Los restantes temas tienen preguntas publicadas, pero **ningún concepto en este sistema de servidor** a fecha de auditoría. Las fichas locales no se cuentan aquí y no equivalen a conceptos registrados en PostgreSQL.

## Limitación que corrige un error habitual de análisis
**No unir `questions` con `concepts` solo por `topic_id` y luego hacer `count(q.id)`:** se multiplicaría cada pregunta por todos los conceptos del tema (producto cartesiano parcial). Usar `q.concept_id = c.id`, y agregar preguntas y conceptos por separado.

## Regla editorial vinculante
No cambiar estados `borrador` → `publicado` de forma masiva para elevar artificialmente la cobertura. Un concepto pasa a publicado únicamente si su fuente, versión, respuesta, ámbito de oposición y preguntas asociadas superan revisión humana documentada.

## Plan de integración y pruebas
1. **Seguridad P0:** cerrar exposición de `correct_answer` y rutas cliente, conciliar migración 17 remota con migración 18 en PR #110, probar staging antes de producción.
2. **Inventario editorial de 36 y 38:** los 422 vínculos existen, pero los conceptos están en borrador. Priorizar auditoría de fuente, actualización y vigencia; permitir correcciones/descartes y log de veredictos.
3. **Catálogo restante:** seleccionar tema de mayor valor; crear conceptos canónicos revisados y asignar `concept_id` mediante emparejamientos auditables. La similitud léxica o LLM solo debe generar **candidatos**, nunca editar automáticamente la base.
4. **Única memoria:** eventos como fuente, estado derivado por usuario; no volcar localStorage sin consentimiento ni mapeo verificable. Mantener categoría `ficha`/ `recuerdo`/ `test` y calidad de evidencia diferenciada.
5. **Pruebas A→B, offline, idempotencia y sesión finita:** cero pérdida/duplicación; tolerar permisos y rechazos.
6. **Verificación periódica:** ejecutar SQL en staging y producción y contrastar totales; no seleccionar un resultado positivo del frontend como prueba de cobertura real.

## Criterios de aceptación de ampliación
- Fuente y fecha normativa verificadas por cada nuevo concepto.
- Enlace pregunta↔concepto justificado y revisado; ninguna asociación automatizada sin aprobación.
- Pregunta y concepto activos bajo `publicada`/`publicado`.
- Pruebas de no exposición de borradores/reportados y de autorización.
- Aumento de `linked_eligible` **sin** aumentar contenidos rechazados.
- Registro de event_id y `client_event_id` para reintentos idempotentes.
- Métrica de recuerdo diferido con preguntas distintas (no basta número de repeticiones).

## Staging
El esquema staging de 17/10 tiene 13 preguntas publicadas, 7 enlazadas, 24 conceptos publicados, sin eventos de conceptos ni estados; es **un subconjunto de ensayo**, no espejo estadístico de producción.

## Próximos pasos
Abrir revisión de cambios con un PR limitado a SQL de observabilidad y documentación; la consulta es solo lectura. Priorizar más tarde el panel editorial de equivalencias antes de ampliar el catálogo.
