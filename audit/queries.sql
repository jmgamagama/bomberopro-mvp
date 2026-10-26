-- Fase 0 · consultas de inventario sobre el Postgres LOCAL (bomberopro_audit, puerto 55432).
-- Montaje: audit/scripts/montar_pg_local.sh; audit/scripts/cargar_conceptos_local.sh;
--          npx vite-node audit/scripts/volcar_fuentes_ts.ts > /tmp/fuentes_ts.json && python3 audit/scripts/cargar_fuentes_ts_local.py /tmp/fuentes_ts.json
-- Ejecutar: psql -h /tmp -p 55432 -U postgres -d bomberopro_audit -f audit/queries.sql

-- Q1 Preguntas tipo test (public.questions) por tema y nivel
SELECT t.numero AS tema, count(*) total, count(*) FILTER (WHERE q.nivel=1) n1, count(*) FILTER (WHERE q.nivel=2) n2,
       count(*) FILTER (WHERE q.nivel=3) n3, count(*) FILTER (WHERE q.nivel IS NULL) sin_nivel
FROM public.questions q JOIN public.topics t ON t.id=q.topic_id GROUP BY t.numero ORDER BY 1;

-- Q2 Conceptos por tema y conceptos sin preguntas
SELECT t.numero tema, count(*) conceptos,
       count(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM public.questions q WHERE q.concept_id=c.id)) sin_preguntas
FROM public.concepts c JOIN public.topics t ON t.id=c.topic_id GROUP BY 1 ORDER BY 1;

-- Q3 Preguntas sin cita (sin fuente_normativa o con concepto sin cita literal)
SELECT count(*) FILTER (WHERE coalesce(trim(q.fuente_normativa),'')='') sin_fuente_normativa,
       count(*) FILTER (WHERE coalesce(trim(c.cita),'')='') sin_cita_literal_del_concepto
FROM public.questions q LEFT JOIN public.concepts c ON c.id=q.concept_id;

-- Q4 Preguntas sin concepto vinculado
SELECT count(*) FILTER (WHERE concept_id IS NULL) sin_concepto, count(*) total FROM public.questions;

-- Q5 Conceptos sin versión fácil (N1) o sin los 3 niveles
SELECT count(*) FILTER (WHERE NOT 1 = ANY(niv)) sin_n1, count(*) FILTER (WHERE NOT niv @> ARRAY[1,2,3]) sin_3_niveles, count(*) total
FROM (SELECT c.id, coalesce(array_agg(q.nivel) FILTER (WHERE q.nivel IS NOT NULL),'{}') niv
      FROM public.concepts c LEFT JOIN public.questions q ON q.concept_id=c.id GROUP BY c.id) s;

-- Q6 Nº de opciones por nivel
SELECT nivel, jsonb_array_length(opciones) n_opciones, count(*) FROM public.questions GROUP BY 1,2 ORDER BY 1,2;

-- Q7 Fichas de recuerdo por tema y estado de revisión (src/data/*Recall.ts)
SELECT tema, count(*) fichas, count(DISTINCT deck) mazos, string_agg(DISTINCT revision, ',') revision,
       count(*) FILTER (WHERE coalesce(trim(fuente),'')='' ) sin_fuente, count(*) FILTER (WHERE coalesce(trim(localizacion),'')='') sin_localizacion
FROM audit.recall_cards GROUP BY tema ORDER BY tema;

-- Q8 Totales de fichas por revisión
SELECT revision, count(*) fichas, count(DISTINCT deck) mazos FROM audit.recall_cards GROUP BY 1;

-- Q9 Temas 1-40 sin fichas y sin preguntas
SELECT g tema, (SELECT count(*) FROM audit.recall_cards r WHERE r.tema=g) fichas,
       (SELECT count(*) FROM public.questions q JOIN public.topics t ON t.id=q.topic_id WHERE t.numero=g) preguntas
FROM generate_series(1,40) g
WHERE NOT EXISTS (SELECT 1 FROM audit.recall_cards r WHERE r.tema=g)
   OR NOT EXISTS (SELECT 1 FROM public.questions q JOIN public.topics t ON t.id=q.topic_id WHERE t.numero=g) ORDER BY 1;

-- Q10 Otras preguntas sueltas (prototipo y export)
SELECT origen, nivel, count(*) FROM audit.preguntas_sueltas GROUP BY 1,2 ORDER BY 1,2;

-- Q11 IDs de fichas duplicados
SELECT id, count(*) FROM audit.recall_cards GROUP BY id HAVING count(*)>1;

-- Q12 Políticas RLS y tablas con RLS tras aplicar migraciones
SELECT schemaname, tablename, policyname, cmd, roles, qual FROM pg_policies ORDER BY 2,3;
SELECT relname, relrowsecurity FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind='r' ORDER BY 1;

-- Q13 Rastro de pgvector / embeddings en el esquema
SELECT count(*) extensiones_vector FROM pg_extension WHERE extname='vector';
SELECT table_name, column_name FROM information_schema.columns WHERE udt_name='vector' OR column_name ILIKE '%embedding%';
