# DECISIONS.md — Registro de decisiones (BomberoPro)

## D-2026-07-18-01 · Telemetria + EstadoAlumno (auditoria externa, validada contra src/types.ts)

**Brief evaluado:** capturar tiempo_respuesta_ms, cambio_respuesta, dias_desde_ultimo_estudio en "sesion_respuesta"; crear objeto EstadoAlumno.

**Veredicto contra el repo real:**
- tiempo de respuesta: YA existe (Attempt.response_time_seconds). No aniadir campo nuevo: conflicto de naming y de unidad (segundos, no ms).
- cambio_respuesta: NO existe. IMPLEMENTAR AHORA: campo answer_changes:number en Attempt + contador en TrainScreen (incrementar al cambiar de opcion antes de confirmar). Es el unico dato irrecuperable si no se captura desde la primera respuesta real.
- dias_desde_ultimo_estudio: derivable de MemoryState.last_review. NO almacenar (dato calculado, se computa en lectura).
- EstadoAlumno: YA RESUELTO de facto por MemoryState (mastery_score, memory_stability, retrievability, status, next_review...). Es la fuente unica de lectura. Los agregados por tema seran selectores en engine.ts, no un objeto nuevo.

**Riesgo critico detectado:** existen DOS modelos de datos paralelos: este repo (Attempt/MemoryState, camelCase ingles) y Supabase produccion bomberopro-prod (attempts/user_question_state, snake_case castellano). Antes de conectar la app a Supabase hay que unificar el contrato en un unico mapeo documentado. Reparto: Codex implementa answer_changes; Antigravity valida el contrato unificado.

## APARCADO (no abrir issues ni ramas)
- Planificador prescriptivo diario -> revisar con >=20 alumnos activos y 2 semanas de datos.
- Gemelo digital / prediccion de aprobado -> revisar con >=100 alumnos y un simulacro completo.
- Confianza previa (input pre-respuesta) -> nunca pre-MVP; ya existe confidence post-respuesta.

## D-2026-07-18-02 · Datos oficiales examen CPEI (BOP num 135, anuncio 2843/2026, 17-07-2026)
- Test: 50 preguntas + 5 reserva, 60 min, 3 alternativas. Acierto +0,200 / error -0,066 / blanco 0. CORRIGE el borrador previo que usaba -0,1: actualizar MockExam y cualquier calculadora de nota.
- 30% de las preguntas del test: temas 35-40 (parte local CPEI) -> sobreponderar en el motor y en simulacros. Temario oficial ya en data/temario/cpei-badajoz-2026-anexo1.md (PR #7).
- Plazo de instancias: 20 dias habiles desde el extracto en BOE (pendiente de publicar; vigilancia diaria automatizada activa).

## PENDIENTE-2026-10-31 · Repaso espaciado MIRA de las fichas (rama feat/fsrs-real, sin fusionar)
- **Algoritmo:** se mantiene la variante SM-2 de 3 notas de `src/utils/recallSrs.ts` (contrato `CardSrs` y formato `mira_recall_srs_v1` sin cambios). Se evaluó FSRS-6 (ts-fsrs): no se sustituye porque no se ha demostrado con tests un fallo real del algoritmo actual que lo exija. No se cambian coeficientes ni intervalos sin una calibración MIRA aprobada. Observado y PENDIENTE de decisión: con racha 0 e intervalo > 1 (estado que la app no genera hoy por sí misma), «La sabía» programa 1 día; no se ha tocado. Una implementación con ts-fsrs 5.4.2 + migración v1→v2 queda en la rama local `respaldo/fsrs-real-tsfsrs` por si se decide adoptarla.
- **Rating 4 («Fácil») de la API pura `reviewCard`:** se valida pero se programa igual que 3. PENDIENTE decidir su bonificación (no hay coeficiente escrito).
- **Niveles N1/N2/N3:** `reviewCard` los valida pero NO alteran la programación. PENDIENTE decidir coeficientes por nivel.
- **Cola diaria por peso en el examen:** T35-40 = 30 % (dato oficial, D-2026-07-18-02). El reparto del 70 % restante entre T1-34 se SUPONE uniforme (las bases no lo detallan). PENDIENTE confirmar o sustituir por un reparto con fuente.
- **Envío por lotes de respuestas pendientes (modo con cuenta):** hoy `flushPendingAttempts` llama a `record_attempt_v2` de una en una. PENDIENTE: una RPC de lotes exige migración revisada (regla de AGENTS.md); no se crea en esta rama. Los estados MIRA de fichas siguen solo en el dispositivo.
