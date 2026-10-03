-- ==============================================================================
-- Migración 04: guardado de intentos idempotente y con confirmación explícita
-- ==============================================================================
-- ESTADO: PROPUESTA. No aplicada en ningún entorno. Revisar y probar en staging
-- antes de aplicar. Ver "Despliegue y recuperación" al final de este archivo.
--
-- Problema que resuelve (comite/CODEX.md, riesgo 2; comite/EVIDENCIA_SUPABASE.md §4):
--   1. `record_attempt` devuelve `void` y hace RETURN SILENCIOSO cuando
--      auth.uid() <> p_user_id (sesión caducada, otro usuario): el cliente no puede
--      distinguir "guardado" de "ignorado".
--   2. `record_attempt` inserta siempre en `attempts` y suma contadores: un reintento
--      duplica el intento y vuelve a incrementar veces_respondida / veces_acertada.
--
-- Qué hace:
--   * Añade attempts.client_attempt_id (uuid generado por el cliente por respuesta) y
--     un índice único parcial (user_id, client_attempt_id).
--   * Crea record_attempt_v2(...) que devuelve jsonb {status, attempt_id}:
--       - 'saved'      -> fila nueva + efectos aplicados una sola vez.
--       - 'duplicate'  -> la clave ya existía: no inserta, no toca contadores ni estado.
--     y LANZA EXCEPCIÓN (en vez de ignorar) si no hay sesión, el usuario no coincide,
--     los argumentos son inválidos, la pregunta no existe o la clave se reutiliza.
--   * v2 solo es ejecutable por `authenticated` (no por `anon`).
--
-- Qué NO hace (a propósito):
--   * No modifica ni elimina `record_attempt`: los clientes antiguos siguen funcionando.
--     Retirarla (REVOKE a anon / DROP) es una decisión posterior con aprobación de JM.
--   * No cambia la regla de dominio. La lógica de estado de user_question_state y de
--     review_queue es la MISMA que la de `record_attempt` leída en producción el
--     3-oct-2026 (proyecto yndoaprnpkjqiggeyefz). Alinearla con el motor del cliente
--     (24 h, 'critica', recaída) es la tarea 3, no esta.
--   * attempts.created_at refleja el momento de RECEPCIÓN en el servidor, no el de la
--     respuesta: un reintento tardío queda con la hora del reintento. Relevante para
--     las tareas 2 y 3.
--
-- Cambio de comportamiento a revisar (deliberado):
--   * v2 guarda p_confidence también en attempts.confidence (record_attempt nunca lo
--     hacía; hoy attempts.confidence es NULL en las 6 filas existentes). Comprobado en
--     producción (3-oct-2026, solo lectura): attempts y user_question_state no tienen
--     restricciones CHECK, así que 'baja'/'media'/'alta' se guardan sin error.
--   * OJO, vocabulario: get_topic_study_questions y get_preparer_session_questions
--     priorizan `la.confidence IN ('dude','suerte')`, pero el cliente envía
--     'baja'/'media'/'alta'. Por tanto guardar la confianza NO activa esa prioridad (no
--     coincide nunca). Alinear ese vocabulario es parte de la tarea 3b, no de esta.
--     Para no guardar confianza basta quitar `confidence` del INSERT de v2.
-- ==============================================================================

-- 1) Clave de idempotencia por intento ------------------------------------------
ALTER TABLE public.attempts
  ADD COLUMN IF NOT EXISTS client_attempt_id uuid;

-- Índice único parcial: las filas históricas (NULL) no se ven afectadas.
-- Nota: CREATE INDEX (sin CONCURRENTLY) bloquea escrituras mientras se construye.
-- Con el volumen actual de `attempts` (decenas de filas) es instantáneo; si la tabla
-- crece mucho antes de aplicar, usar CREATE UNIQUE INDEX CONCURRENTLY fuera de una
-- transacción.
CREATE UNIQUE INDEX IF NOT EXISTS attempts_user_client_attempt_uidx
  ON public.attempts (user_id, client_attempt_id)
  WHERE client_attempt_id IS NOT NULL;

-- 2) RPC idempotente con confirmación ---------------------------------------------
CREATE OR REPLACE FUNCTION public.record_attempt_v2(
  p_client_attempt_id uuid,
  p_user_id           uuid,
  p_question_id       bigint,
  p_acierto           boolean,
  p_respuesta         text    DEFAULT NULL,
  p_tiempo_ms         integer DEFAULT NULL,
  p_modo              text    DEFAULT 'adaptativo',
  p_session_id        uuid    DEFAULT NULL,
  p_nivel             integer DEFAULT 1,
  p_confidence        text    DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid              uuid := auth.uid();
  v_topic_id         integer;
  v_convocatoria_id  integer;
  v_attempt_id       bigint;
  v_existing_id      bigint;
  v_existing_q       bigint;
  v_step             integer;
  v_next_interval    interval;
  v_respuesta_char   char(1);
BEGIN
  -- Autenticación y propiedad: ERROR explícito, nunca RETURN silencioso.
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;
  IF p_user_id IS DISTINCT FROM v_uid THEN
    RAISE EXCEPTION 'user_mismatch' USING ERRCODE = '42501';
  END IF;
  IF p_client_attempt_id IS NULL OR p_question_id IS NULL OR p_acierto IS NULL THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;

  SELECT topic_id INTO v_topic_id FROM questions WHERE id = p_question_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'question_not_found' USING ERRCODE = 'P0002';
  END IF;
  SELECT convocatoria_id INTO v_convocatoria_id FROM topics WHERE id = v_topic_id;

  v_respuesta_char := NULLIF(LEFT(p_respuesta, 1), '');

  -- Inserción idempotente. Si dos peticiones con la misma clave llegan a la vez, la
  -- segunda espera al commit de la primera y cae en DO NOTHING.
  INSERT INTO attempts (
    user_id, question_id, acierto, respuesta, tiempo_ms, modo, session_id, nivel,
    confidence, client_attempt_id
  )
  VALUES (
    v_uid, p_question_id, p_acierto, v_respuesta_char, p_tiempo_ms, p_modo, p_session_id, p_nivel,
    p_confidence, p_client_attempt_id
  )
  ON CONFLICT (user_id, client_attempt_id) WHERE client_attempt_id IS NOT NULL
  DO NOTHING
  RETURNING id INTO v_attempt_id;

  IF v_attempt_id IS NULL THEN
    SELECT id, question_id INTO v_existing_id, v_existing_q
      FROM attempts
     WHERE user_id = v_uid AND client_attempt_id = p_client_attempt_id;

    -- La misma clave para otra pregunta es un fallo del cliente, no un reintento.
    IF v_existing_q IS DISTINCT FROM p_question_id THEN
      RAISE EXCEPTION 'client_attempt_id_reused' USING ERRCODE = '23505';
    END IF;

    RETURN jsonb_build_object('status', 'duplicate', 'attempt_id', v_existing_id);
  END IF;

  -- ---- Efectos: MISMA lógica que record_attempt (leída en producción 3-oct-2026) ----
  UPDATE questions
     SET veces_respondida = COALESCE(veces_respondida, 0) + 1,
         veces_acertada   = COALESCE(veces_acertada, 0) + CASE WHEN p_acierto THEN 1 ELSE 0 END
   WHERE id = p_question_id;

  INSERT INTO user_question_state (
    user_id, question_id, estado, aciertos_consecutivos, fallos, exitos, topic_id,
    convocatoria_id, ultima_respuesta_at, ultimo_acierto_at, ultimo_fallo_at,
    ultima_confianza, ultimo_tiempo_ms, updated_at
  )
  VALUES (
    v_uid, p_question_id,
    CASE WHEN p_acierto THEN 'aprendida' ELSE 'dudada' END,
    CASE WHEN p_acierto THEN 1 ELSE 0 END,
    CASE WHEN p_acierto THEN 0 ELSE 1 END,
    CASE WHEN p_acierto THEN 1 ELSE 0 END,
    v_topic_id, v_convocatoria_id,
    now(),
    CASE WHEN p_acierto THEN now() ELSE NULL END,
    CASE WHEN p_acierto THEN NULL ELSE now() END,
    p_confidence, p_tiempo_ms, now()
  )
  ON CONFLICT (user_id, question_id) DO UPDATE SET
    estado = CASE
                WHEN p_acierto AND user_question_state.aciertos_consecutivos + 1 >= 3 THEN 'dominada'
                WHEN p_acierto THEN 'aprendida'
                ELSE 'dudada'
             END,
    aciertos_consecutivos = CASE WHEN p_acierto THEN user_question_state.aciertos_consecutivos + 1 ELSE 0 END,
    fallos = CASE WHEN p_acierto THEN user_question_state.fallos ELSE user_question_state.fallos + 1 END,
    exitos = CASE WHEN p_acierto THEN user_question_state.exitos + 1 ELSE user_question_state.exitos END,
    ultima_respuesta_at = now(),
    ultimo_acierto_at = CASE WHEN p_acierto THEN now() ELSE user_question_state.ultimo_acierto_at END,
    ultimo_fallo_at = CASE WHEN p_acierto THEN user_question_state.ultimo_fallo_at ELSE now() END,
    ultima_confianza = COALESCE(p_confidence, user_question_state.ultima_confianza),
    ultimo_tiempo_ms = COALESCE(p_tiempo_ms, user_question_state.ultimo_tiempo_ms),
    topic_id = COALESCE(user_question_state.topic_id, v_topic_id),
    convocatoria_id = COALESCE(user_question_state.convocatoria_id, v_convocatoria_id);

  SELECT step INTO v_step FROM review_queue WHERE user_id = v_uid AND question_id = p_question_id;
  IF v_step IS NULL THEN
    v_step := 0;
  END IF;

  IF p_acierto THEN
    v_step := LEAST(v_step + 1, 5);
  ELSE
    v_step := 0;
  END IF;

  v_next_interval := CASE v_step
    WHEN 0 THEN interval '4 hours'
    WHEN 1 THEN interval '1 day'
    WHEN 2 THEN interval '3 days'
    WHEN 3 THEN interval '7 days'
    WHEN 4 THEN interval '14 days'
    ELSE interval '30 days'
  END;

  INSERT INTO review_queue (user_id, question_id, due_at, step)
  VALUES (v_uid, p_question_id, now() + v_next_interval, v_step)
  ON CONFLICT (user_id, question_id) DO UPDATE SET
    due_at = now() + v_next_interval,
    step = v_step;

  RETURN jsonb_build_object('status', 'saved', 'attempt_id', v_attempt_id);
END;
$function$;

-- 3) Permisos: solo usuarios con sesión ----------------------------------------------
-- En Supabase, las funciones nuevas de `public` reciben EXECUTE para anon por defecto:
-- hay que quitarlo explícitamente además de PUBLIC.
REVOKE ALL ON FUNCTION public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  TO authenticated;

-- ==============================================================================
-- Despliegue y recuperación
-- ==============================================================================
-- Orden obligatorio: 1) aplicar esta migración en staging y pasar PRUEBA_TEMA40
-- (T40-01 a T40-04); 2) con aprobación expresa de JM, aplicarla en producción;
-- 3) SOLO DESPUÉS desplegar el cliente. El cliente nuevo llama a record_attempt_v2 y,
-- si no existe, conserva las respuestas en cola y avisa; nunca recurre a record_attempt.
--
-- Recuperación (revierte esta migración; no borra intentos ya guardados):
--   DROP FUNCTION IF EXISTS public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text);
--   DROP INDEX    IF EXISTS public.attempts_user_client_attempt_uidx;
--   ALTER TABLE public.attempts DROP COLUMN IF EXISTS client_attempt_id;
-- (La columna solo debe borrarse si ningún cliente nuevo sigue enviando claves.)
