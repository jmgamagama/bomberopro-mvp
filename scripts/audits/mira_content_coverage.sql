-- Auditoría de cobertura MIRA / BomberoPRO — SOLO LECTURA.
-- 2026-10-17. Ejecutar en Supabase SQL Editor del proyecto elegido.
-- NO modifica estados, NO asigna concept_id ni publica materiales.
--
-- Semántica:
--  * linked_any: pregunta publicada con concept_id, incluso si concepto es borrador.
--  * linked_eligible: pregunta publicada + concepto publicado (apta técnicamente
--    para el flujo MIRA por conceptos; NO garantiza revisión editorial de la respuesta).
--  * linked_to_draft: requiere decisión editorial; jamás publicar automáticamente.
--  * audited_sources: no se deduce de esta consulta.

WITH question_metrics AS (
  SELECT
    q.topic_id,
    count(*)::int AS all_questions,
    count(*) FILTER (WHERE q.estado = 'publicada')::int AS published_questions,
    count(*) FILTER (
      WHERE q.estado = 'publicada' AND q.concept_id IS NOT NULL
    )::int AS linked_any,
    count(*) FILTER (
      WHERE q.estado = 'publicada' AND c.estado = 'publicado'
    )::int AS linked_eligible,
    count(*) FILTER (
      WHERE q.estado = 'publicada' AND c.estado = 'borrador'
    )::int AS linked_to_draft,
    count(*) FILTER (
      WHERE q.estado = 'publicada' AND c.estado = 'publicado' AND c.topic_id <> q.topic_id
    )::int AS cross_topic_links,
    count(DISTINCT q.concept_id) FILTER (
      WHERE q.estado = 'publicada' AND c.estado = 'publicado'
    )::int AS eligible_concepts_with_question
  FROM public.questions q
  LEFT JOIN public.concepts c ON c.id = q.concept_id
  GROUP BY q.topic_id
), concept_metrics AS (
  SELECT
    c.topic_id,
    count(*)::int AS all_concepts,
    count(*) FILTER (WHERE c.estado = 'publicado')::int AS published_concepts,
    count(*) FILTER (WHERE c.estado = 'borrador')::int AS draft_concepts
  FROM public.concepts c
  GROUP BY c.topic_id
), by_topic AS (
  SELECT
    t.numero AS topic,
    t.nombre AS title,
    COALESCE(q.all_questions, 0) AS all_questions,
    COALESCE(q.published_questions, 0) AS published_questions,
    COALESCE(q.linked_any, 0) AS linked_any,
    COALESCE(q.linked_eligible, 0) AS linked_eligible,
    COALESCE(q.linked_to_draft, 0) AS linked_to_draft,
    COALESCE(q.cross_topic_links, 0) AS cross_topic_links,
    COALESCE(q.eligible_concepts_with_question, 0) AS eligible_concepts_with_question,
    COALESCE(c.all_concepts, 0) AS all_concepts,
    COALESCE(c.published_concepts, 0) AS published_concepts,
    COALESCE(c.draft_concepts, 0) AS draft_concepts
  FROM public.topics t
  LEFT JOIN question_metrics q ON q.topic_id = t.id
  LEFT JOIN concept_metrics c ON c.topic_id = t.id
)
SELECT
  topic, title,
  published_questions, linked_any, linked_eligible, linked_to_draft,
  published_concepts, eligible_concepts_with_question, draft_concepts,
  cross_topic_links,
  ROUND(linked_eligible * 100.0 / NULLIF(published_questions,0), 1) AS eligible_percent
FROM by_topic
UNION ALL
SELECT
  999 AS topic, 'TOTAL' AS title,
  SUM(published_questions)::int,
  SUM(linked_any)::int,
  SUM(linked_eligible)::int,
  SUM(linked_to_draft)::int,
  SUM(published_concepts)::int,
  SUM(eligible_concepts_with_question)::int,
  SUM(draft_concepts)::int,
  SUM(cross_topic_links)::int,
  ROUND(SUM(linked_eligible) * 100.0 / NULLIF(SUM(published_questions),0), 1)
FROM by_topic
ORDER BY topic;
