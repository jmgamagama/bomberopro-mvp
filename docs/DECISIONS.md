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
- **Algoritmo:** se mantiene la variante SM-2 de 3 notas de `src/utils/recallSrs.ts` (`CardSrs`, `RecallGrade` 0|1|2, `scheduleReview`; formato `mira_recall_srs_v1` sin cambios). Se evaluó FSRS-6 (ts-fsrs, open-spaced-repetition). PENDIENTE: no hay especificación FSRS aprobada ni decisión de correspondencia entre las 3 notas actuales y las 4 de FSRS, ni retención objetivo; no se cambia el algoritmo. Una implementación de referencia (ts-fsrs 5.4.2 + migración v1→v2) queda solo en la rama local `respaldo/fsrs-real-tsfsrs`.
- **Caso observado, sin tocar:** con racha 0 e intervalo > 1 (estado que la app no genera hoy por sí misma), «La sabía» programa 1 día. PENDIENTE de decisión.
- **PROPUESTA (no implementada): cola diaria por peso en el examen.** D-2026-07-18-02 pide «sobreponderar en el motor» los temas 35-40 (30 % del test), pero no fija cómo en la sesión de fichas. Propuesta: ordenar vencidas y falladas por (1) peso del tema (30 %/6 para T35-40; el 70 % restante entre T1-34 habría que repartirlo con fuente, las bases no lo detallan), (2) fallos recientes del registro local (14 días) y (3) riesgo de olvido con la curva de `engine.ts`; y repartir las nuevas por peso de tema. Cambia el orden de los mazos: requiere decisión escrita antes de implementarse.
- **Envío por lotes de respuestas pendientes (modo con cuenta):** hoy `flushPendingAttempts` llama a `record_attempt_v2` de una en una. PENDIENTE: una RPC de lotes exige migración revisada (AGENTS.md). Los estados MIRA de fichas siguen solo en el dispositivo.
