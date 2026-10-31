#!/usr/bin/env bash
# Exporta a /workspace/audit_banco.jsonl todas las preguntas tipo test del repo (Postgres local).
OUT=${1:-/workspace/audit_banco.jsonl}
psql -h /tmp -p 55432 -U postgres -d bomberopro_audit -tA -c "
SELECT json_build_object('id', 'Q'||q.id, 'hash', q.hash_dedupe, 'origen', q.origen_archivo, 'tema', t.numero, 'nivel', q.nivel,
  'concepto', q.concept_id, 'cita', c.cita, 'fuente', q.fuente_normativa, 'enunciado', q.enunciado,
  'opciones', (SELECT json_agg(o->>'texto' ORDER BY o->>'letra') FROM jsonb_array_elements(q.opciones) o),
  'correcta', ascii(q.correcta)-97, 'estado', q.estado)
FROM public.questions q JOIN public.topics t ON t.id=q.topic_id LEFT JOIN public.concepts c ON c.id=q.concept_id
UNION ALL
SELECT json_build_object('id', id, 'hash', NULL, 'origen', origen, 'tema', tema, 'nivel', nivel, 'concepto', concepto, 'cita', cita,
  'fuente', NULL, 'enunciado', enunciado, 'opciones', opciones, 'correcta', correcta, 'estado', estado)
FROM audit.preguntas_sueltas" > "$OUT"
wc -l "$OUT"
