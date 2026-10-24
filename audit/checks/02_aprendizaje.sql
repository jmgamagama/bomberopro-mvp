-- audit/checks/02_aprendizaje.sql
-- Cobertura de la escalera adaptativa (fallo → mismo concepto más fácil; acierto → sube). Solo lectura.
-- Mismo formato: check | tipo | valor | umbral | ok. Trinquete = valor del 2026-10-24; falla si empeora.
with cl as (
  select c.id, c.estado,
    count(q.id) filter (where q.estado = 'publicada') qpub,
    count(distinct q.nivel) filter (where q.estado = 'publicada') niveles,
    bool_or(q.nivel = 1 and q.estado = 'publicada') tiene_n1
  from concepts c
  join topics t on t.id = c.topic_id and t.convocatoria_id = 1
  left join questions q on q.concept_id = c.id
  group by c.id, c.estado
),
pub as (select * from cl where estado = 'publicado'),
banco as (
  select q.* from questions q join topics t on t.id = q.topic_id
  where q.estado = 'publicada' and t.convocatoria_id = 1
),
m as (
  select
    (select round(100.0 * count(*) filter (where niveles = 3) / nullif(count(*),0), 1) from pub) pct_conceptos_3_niveles,
    (select count(*) from pub where qpub = 0) conceptos_publicados_sin_preguntas,
    (select count(*) from pub where qpub > 0 and not coalesce(tiene_n1,false)) conceptos_sin_nivel_facil,
    (select round(100.0 * count(*) filter (where concept_id is null) / nullif(count(*),0), 1) from banco) pct_banco_sin_concepto,
    -- Preguntas publicadas cuyo concepto está en borrador: el alumno no puede ver el concepto (RLS)
    (select count(*) from banco b join concepts c on c.id = b.concept_id where c.estado <> 'publicado') preguntas_con_concepto_borrador,
    -- Concepto enlazado a una pregunta de OTRO tema
    (select count(*) from banco b join concepts c on c.id = b.concept_id where c.topic_id <> b.topic_id) concepto_de_otro_tema,
    (select round(100.0 * count(*) filter (where nivel = 1) / nullif(count(*),0), 1) from banco) pct_banco_nivel_1
)
select 'pct_conceptos_3_niveles (mín.)' "check", 'trinquete' tipo, pct_conceptos_3_niveles valor, 3.3 umbral, pct_conceptos_3_niveles >= 3.3 ok from m
union all select 'conceptos_publicados_sin_preguntas', 'trinquete', conceptos_publicados_sin_preguntas, 233, conceptos_publicados_sin_preguntas <= 233 from m
union all select 'conceptos_sin_nivel_facil', 'trinquete', conceptos_sin_nivel_facil, 68, conceptos_sin_nivel_facil <= 68 from m
union all select 'pct_banco_sin_concepto', 'trinquete', pct_banco_sin_concepto, 88.6, pct_banco_sin_concepto <= 88.6 from m
union all select 'preguntas_con_concepto_borrador', 'trinquete', preguntas_con_concepto_borrador, 422, preguntas_con_concepto_borrador <= 422 from m
union all select 'concepto_de_otro_tema', 'bloqueante', concepto_de_otro_tema, 0, concepto_de_otro_tema = 0 from m
union all select 'pct_banco_nivel_1 (máx.)', 'trinquete', pct_banco_nivel_1, 94.6, pct_banco_nivel_1 <= 94.6 from m;
