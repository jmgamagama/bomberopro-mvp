# Contrato de Mapeo de Datos (Frontend ↔ Supabase Producción)

Este documento resuelve la discrepancia crítica documentada en `DECISIONS.md` (D-2026-07-18-01) entre el frontend (`Attempt` / `MemoryState` en inglés) y la base de datos de producción Supabase (`attempts` / `user_question_state` en snake_case castellano).

Toda comunicación hacia y desde Supabase (RPCs o inserts directos) debe usar las columnas en **castellano**.

## 1. Tabla `attempts` (Intentos de respuesta)

| Frontend (`Attempt` - src/types.ts) | Supabase (`attempts` - Castellano) | Tipo de Dato (Postgres) | Notas |
|-------------------------------------|------------------------------------|-------------------------|-------|
| `id` | `id` | uuid | Generado por defecto |
| `user_id` | `id_usuario` | uuid | FK a auth.users |
| `question_id` | `id_pregunta` | text | |
| `microconcept_id` | `id_microconcepto` | text | |
| `answer_user` | `respuesta_usuario` | text | |
| `correct` | `es_correcto` | boolean | |
| `confidence` | `nivel_confianza` | text | 'baja', 'media', 'alta' |
| `response_time_seconds` | `tiempo_respuesta_s` | numeric | |
| `answer_changes` | `cambios_respuesta` | integer | A implementar por Codex |
| `created_at` | `creado_en` | timestamptz | |

## 2. Tabla `user_question_state` (Estado de Memoria / Motor Cognitivo)

| Frontend (`MemoryState` - src/types.ts) | Supabase (`user_question_state`) | Tipo de Dato (Postgres) | Notas |
|-----------------------------------------|----------------------------------|-------------------------|-------|
| `user_id` | `id_usuario` | uuid | FK a auth.users |
| `microconcept_id` | `id_microconcepto` | text | |
| `mastery_score` | `dominio_real` | numeric | 0 a 100 |
| `memory_stability` | `estabilidad_memoria` | numeric | En días |
| `retrievability` | `recuperabilidad` | numeric | 0.0 a 1.0 |
| `status` | `estado_memoria` | text | 'Nuevo', 'En aprendizaje'... |
| `last_review` | `ultimo_repaso` | timestamptz | Puede ser null |
| `next_review` | `proximo_repaso` | timestamptz | Puede ser null |
| `consecutive_correct` | `aciertos_consecutivos` | integer | |
| `recent_errors_count` | `errores_recientes` | integer | |
| `error_tag` | `etiqueta_error` | text | Puede ser null |

## Implementación

El archivo `src/utils/db.ts` actuará como **capa de traducción (Data Access Layer)**. Cuando se guarden datos desde React, se mapearán a los nombres en castellano antes de enviar la petición a Supabase, manteniendo el resto de la aplicación intacta en su nomenclatura en inglés.
