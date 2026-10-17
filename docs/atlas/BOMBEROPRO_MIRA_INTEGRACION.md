# ATLAS 2.0 → BomberoPRO / Método MIRA: integración incremental
**Decisión técnica (17-10-2026).** ATLAS es un marco de ejecución y negocio, **no una segunda marca ni una aplicación paralela**. Producto: BomberoPRO. Metodología: MIRA. Motor operativo actual: React 19 + Vite + TypeScript + Supabase + Vercel.

## 0. Evidencias inspeccionadas y límites
- Código real: `main` del repositorio, contrato `AGENTS.md`, migraciones 09/12/13/15/16 y componentes `ConceptStudy`, `DailySession`, `TodayTraining`.
- Hay **dos formas de memoria no equivalentes**: MIRA por conceptos en servidor (FSRS, `concept_events`/`user_concept_state`) y fichas de recuerdo locales (`mira_recall_srs_v1`, esquema propio y owner por cuenta). No afirmar que están unificadas.
- `record_attempt_v2` enlaza una evidencia al concepto solo cuando la pregunta tiene `concept_id`; no demuestra cobertura total.
- `get_concept_session` entrega `correct_answer` al cliente y `ConceptStudy` compara localmente. Es **riesgo bloqueante para comercializar** (#75/P0.4): la corrección real debe pasar al servidor. No se toca en este PR.
- Los datos de Supabase **no han sido inspeccionados directamente**; las migraciones pueden no representar completamente el despliegue. No ejecutar SQL ni declarar cubierta una cantidad de conceptos sin auditoría remota.
- PR #107 (borrador) cambia UX de `ConceptStudy/App/features`. No competir ni pisar sus archivos. PR #103/#104 (agentes/QA editorial) requieren reconciliación, no importar el kit ATLAS indiscriminadamente.

## 1. Decisión de arquitectura
1. Mantener la pila actual Vite/React. **No migrar a Next.js** solo porque aparece en el plan genérico.
2. Supabase como fuente de verdad de cuentas, intentos y conceptos. LocalStorage, solo caché o práctica demo de fichas hasta completar el puente editorial.
3. Un concepto = identificador canónico verificable, fuente y versión; una pregunta o ficha puede evaluar más de un concepto solo cuando el modelo de datos lo soporte realmente.
4. Motor MIRA (servidor) selecciona y actualiza estados; frontend presenta. No crear otro algoritmo que compita con FSRS en producción.
5. Para datos nuevos, eventos idempotentes, identificadores de versión, trazabilidad y privacidad por diseño.
6. QA editorial en servidor; los estados `APTA/CORREGIR/DESCARTAR` son dictámenes y deben mapearse antes de migraciones, nunca copiarse como nuevos valores SQL por intuición.

## 2. Primer corte implementado en esta rama: sesiones finitas (PILOTO APAGADO)
**Motivo:** probar si menos fichas nuevas y selección según minutos reducen sensación de sobrecarga sin romper el estudio actual.
- `src/utils/finiteRecallSession.ts`: adapta el selector de recuerdo existente, sin modificar SRS ni RPC.
- `src/config/atlasMiraPilot.ts`: bandera `VITE_FEATURE_ATLAS_FINITE_RECALL=true`; **apagada por defecto**.
- `src/components/DailySession.tsx`: cuando está activa, ofrece 5/10/20/30 minutos, tope de 6 fichas nuevas y presupuesto orientativo. Sin bandera se conserva exactamente el flujo de 30 fichas.
- Tests separados de lógica, límites, repasos y activación.
- El tiempo es una **estimación UX** (90 s nueva, 45 s repaso), no una promesa de duración, una ganancia de aprendizaje ni un cambio de memoria. No despliega ni activa el flag.
- Las fichas solo usan las disponibles según filtros de plan y revisión anteriores. No se amplía el catálogo ni se eliminan filtros editoriales.

### Activación *solo* en entorno de prueba
Configurar la bandera en **Preview de Vercel para la rama**, no en Production. Comprobar permisos, contenido, móvil y logs, además de:
```bash
npm ci
npm run lint
npm run build
npm run test
```
No fusionar automáticamente; revisar PR, CI y experimento con alumnos. El flag no autoriza despliegue comercial.

## 3. Orden de implementación siguiente (dependencias reales)

### G0 — Seguridad e integridad antes de vender
| Orden | Entrega | Dependencia | Prueba |
|---|---|---|---|
| 1 | Revisar PR #107 y no solapar UX | CI/preview | piloto visual real |
| 2 | Corregir exposición de respuesta en `get_concept_session` mediante RPC de evaluación | esquema/staging | inspección de payload sin respuesta correcta |
| 3 | Auditar filtros QA en **todas** las rutas, incl. RPC | staging + catálogo | borradores inaccesibles |
| 4 | Confirmar owner/evento/recepción entre dos navegadores | Supabase real | A→B, offline/reintento, idempotencia |
| 5 | Índice estable de equivalencias ficha → concepto, solamente correspondencias verificadas | maestro editorial + Supabase | sin asociaciones inventadas |
| 6 | Migración reversible para integrar fichas verificadas al único estado remoto | 4/5 | evento único, sin pérdida local |

### G1 — Aprendizaje medible
| Entrega | Instrumento |
|---|---|
| Diagnóstico inicial por temas | preguntas publicadas y verificadas; sin inferir cobertura a partir de una muestra pequeña |
| Sesión guiada y finita | priorizar repasos y mostrar tiempo real estimado |
| Transferencia/recuerdo diferido | variante nueva a 7/14 días, no repetir literal |
| Analítica de sobrecarga | sesión iniciada/completada, duración, encuesta breve, abandonos |
| Motor adaptativo mejorado | A/B contra baseline actual con igual tiempo/contenido, antes de sustituir FSRS |

### G2 — Primeros 10 clientes (tras G0 y piloto)
- Identidad: conservar **BomberoPRO** como marca; **MIRA** es metodología y tecnología. Documentar tokens y tono, no rediseñar ahora.
- Landing con diagnóstico limitado, evidencia y contenido permitido; evitar prometer aprobado.
- Avisos RGPD/LSSI, derechos digitales, facturación y política de reembolso/desistimiento revisados.
- Cobros y derechos de acceso **en servidor**; no basta con una variable `plan` en localStorage. Webhook firmado e idempotente.
- Soporte y reporte de preguntas; monitorizar errores y tiempo de respuesta.
- Validar primero **pagos efectivos** y uso recurrente, no solo registros.

### G3 — 100 clientes
- Cohortes de activación, retención y renovaciones. Pricing test controlado.
- Nuevas preguntas/conceptos con revisión humana y linaje de fuentes; QA en importación.
- Móvil real y varias conexiones; alertas de errores, cargas, p95 y recuperación.
- Análisis de aprendizaje por variantes, no probabilidad de aprobar sin calibración.

### G4 — 10.000 clientes (solo tras economía unitaria estable)
- Reglas de multioposición, `exam_call` y `content_version` reutilizables.
- Cola/batch editorial y auditoría de cambios normativos.
- Particionado/índices y cargas reales antes de redistribuir la arquitectura.
- Panel B2B para academias cuando exista demanda contractual, aislar por organización.
- Gobernanza: roles, revisión de accesos, alertas, seguridad, backups y pruebas de restauración.

## 4. Modelo de inversión (hipótesis, no presupuesto cerrado)
Separar inversión **incremental sobre BomberoPRO existente** de crear ATLAS desde cero. Las cifras del PDF ATLAS 2.0 (aprox. 5,6 k€ a 10; 29,7 k€ a 100; 1,65 M€ acumulados a 10.000) son un escenario de empresa nueva, **no importes que deban volver a gastarse** aquí. No sumar gastos realizados otra vez.

| Escala | Presupuesto incremental de planificación | Plazo desde ahora (no garantía) | Puerta de decisión |
|---|---:|---|---|
| Primeros 10 de pago | 1.000–6.000 € más trabajo propio | 1–3 meses | seguridad G0 + primeros pagos y sesiones |
| 100 de pago | +8.000–35.000 € | 3–12 meses | retención por cohortes y CAC recuperable |
| 10.000 activos | no fijar capital sin modelo actualizado; escenario de seis cifras o más | 2–5 años o más | adquisición, calidad, churn, capacidad operativa y margen sostenibles |

Estas bandas **no incluyen** salario de fundador valorado a mercado y dependen de cuánto contenido y tecnología existentes sea realmente reutilizable. Medir mensualidad, IVA aplicable, margen, CAC, churn y cash-flow en un solo modelo, usando datos reales de BomberoPRO en cuanto existan.

## 5. Instrucciones de programación para agentes
- Fuente única: `main`, issue #75 (P0) e issue #79 (gates). Este documento no sustituye migraciones ni código.
- **Codex/GPT**: pruebas, contratos, seguridad y tareas aisladas con rama `codex/*`; nunca mezclar datos productivos.
- **Claude**: continuidad arquitectónica y QA editorial/pedagógico; revisar PR #103/#104 antes de añadir otras skills.
- **Antigravity**: frontend/QA E2E en la rama asignada; no competir por `ConceptStudy` mientras PR #107 esté abierto.
- Cada tarea: entrada (issue), archivos permitidos, criterios de aceptación, pruebas, diff y PR en borrador. Sin merges/despliegues automáticos en riesgos P0.
- Asegurar un **único escritor** por migración o módulo; redactar primero contrato y rollback.

### Plantilla de orden ejecutable
```text
Trabaja en jmgamagama/bomberopro-mvp, basándote en main actualizado.
Lee AGENTS.md, #75, #79 y los archivos reales de tu tarea.
Objetivo: [resultado observable].
Alcance: [rutas permitidas]; prohibido modificar [rutas de otros agentes].
No cambies producción ni inventes asociaciones ficha/concepto o esquema remoto.
Implementa en rama propia, añade tests de permisos, contenido, idempotencia y regresión.
Ejecuta npm ci, npm run lint, npm run build, npm run test.
Entrega PR en borrador con evidencia, limitaciones y procedimiento de rollback.
No fusiones ni actives flags sin revisión.
```

## 6. Experimento para piloto finito
A) Flujo actual: hasta 30 fichas. B) Sesión finita con minutos elegidos, límite prudente de nuevas.
No asignar variante por intuición al alumno en producción. Medir al menos:
1. finalización por sesión y duración real;
2. carga percibida 1–5 (opcional);
3. usuarios que vuelven a los 7 días;
4. retención en **preguntas distintas** y evaluación diferida cuando exista muestra suficiente.
La bandera opera por *build*, no aleatoriza usuarios; comparación científica requiere instrumentación y asignación adecuada.
**No declarar eficacia hasta realizar el piloto.**

## 7. Definition of done de esta PR
- La bandera apagada conserva el estudio anterior.
- La bandera encendida ofrece duraciones 5/10/20/30, mantiene filtros de material autorizado y restringe fichas nuevas.
- La selección es reproducible con fecha y estado idénticos.
- No hay nuevas migraciones, llamadas IA, cambios de pagos o escrituras en producción.
- CI y revisión humana pendientes antes de fusionar.
