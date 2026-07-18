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
