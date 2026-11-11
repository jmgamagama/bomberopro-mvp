-- ==============================================================================
-- Migración 55: el alumno puede reportar una ficha de recuerdo (concepto/fuente)
-- ==============================================================================
-- Por qué: las fichas de recuerdo (RecallDeck: concepto → respuesta → fuente) ya tienen
-- botón de reportar pregunta en Entrenar/Por temas, pero no en las fichas de repaso. Un
-- alumno piloto (11/11/2026, tema 37) pidió poder avisar si una ficha está fuera de temario,
-- mal elaborada o con un dato que no cuadra con la fuente, igual que en preguntas.
--
-- Diferencia con question_reports/report_question (migración 11): las fichas de recuerdo son
-- contenido ESTÁTICO empaquetado en el cliente (src/data/*Recall.ts), no filas de `questions`.
-- No hay «estado» que apagar por alumno ni retirada automática a 3 reportes: aquí solo se
-- registra en cola para revisión humana, identificando la ficha por (deck_id, card_id), ambos
-- texto porque así son sus ids (p. ej. deck_id='tema37', card_id='CPEI-T37-L01-C3728D6BCF').
--
-- Qué hace:
--   * Tabla `recall_card_reports`: un registro por alumno y ficha (si repite, se actualiza).
--   * report_recall_card(): única vía para reportar; solo alumnos con sesión, máx. 30/hora.
--   * No oculta ni retira nada (no hay mecanismo de «estado» en contenido estático); el equipo
--     revisa la cola y corrige el fichero de datos correspondiente.
--
-- Deshacer: ver 55_reportar_fichas_recall_down.sql (DROP FUNCTION + DROP TABLE; reversible,
-- no toca ninguna otra tabla).
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.recall_card_reports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deck_id text NOT NULL,
  card_id text NOT NULL,
  user_id uuid NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('respuesta_erronea', 'mal_redactada', 'fuera_temario', 'otro')),
  nota text,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'corregida', 'mantenida')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS recall_card_reports_user_card_uidx
  ON public.recall_card_reports (user_id, deck_id, card_id);
CREATE INDEX IF NOT EXISTS recall_card_reports_estado_idx ON public.recall_card_reports (estado, created_at);

ALTER TABLE public.recall_card_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.recall_card_reports FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.recall_card_reports TO authenticated;
DROP POLICY IF EXISTS recall_card_reports_own ON public.recall_card_reports;
CREATE POLICY recall_card_reports_own ON public.recall_card_reports
  FOR SELECT TO authenticated USING (user_id = (select auth.uid()));

CREATE OR REPLACE FUNCTION public.report_recall_card(p_deck_id text, p_card_id text, p_categoria text, p_nota text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_recent integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_categoria NOT IN ('respuesta_erronea', 'mal_redactada', 'fuera_temario', 'otro') THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;
  IF coalesce(trim(p_deck_id), '') = '' OR coalesce(trim(p_card_id), '') = '' THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;
  SELECT count(*) INTO v_recent FROM recall_card_reports WHERE user_id = v_uid AND created_at > now() - interval '1 hour';
  IF v_recent >= 30 THEN RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001'; END IF;

  INSERT INTO recall_card_reports (deck_id, card_id, user_id, categoria, nota)
  VALUES (trim(p_deck_id), trim(p_card_id), v_uid, p_categoria, left(nullif(trim(p_nota), ''), 1000))
  ON CONFLICT (user_id, deck_id, card_id) DO UPDATE SET
    categoria = excluded.categoria,
    nota = coalesce(excluded.nota, recall_card_reports.nota),
    estado = 'pendiente', created_at = now();

  RETURN jsonb_build_object('status', 'received');
END $$;

REVOKE ALL ON FUNCTION public.report_recall_card(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.report_recall_card(text, text, text, text) TO authenticated;
