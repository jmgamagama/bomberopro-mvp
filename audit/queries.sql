-- audit/queries.sql — Fase 0 (reconocimiento). Auditoría 2026-10-24.
-- Solo lectura. Proyecto: bomberopro-prod (yndoaprnpkjqiggeyefz). Convocatoria CPEI Badajoz = 1.
-- Ejecutar en el editor SQL de Supabase o con psql. Ninguna consulta modifica datos.

-- Q0.1 Totales y estados -------------------------------------------------------
select
 (select count(*) from topics) topics,
 (select count(*) from questions) q_total,
 (select json_object_agg(estado,n) from (select coalesce(estado,'NULL') estado,count(*) n from questions group by 1) s) q_por_estado,
 (select json_object_agg(estado,n) from (select estado,count(*) n from concepts group by 1) s) c_por_estado,
 (select json_object_agg(o,n) from (select coalesce(origen_tipo,'NULL') o,count(*) n from questions where estado='publicada' group by 1) s) origen_publicadas;
-- Resultado 24/10: 11.139 preguntas; 9.786 publicadas; 727 conceptos publicados + 382 borrador.

-- Q0.2 Preguntas publicadas por tema y nivel, sin concepto, sin cita ----------
select t.convocatoria_id conv, t.numero tema,
 count(q.id) filter (where q.estado='publicada') pub,
 count(q.id) filter (where q.estado='publicada' and q.nivel=1) n1,
 count(q.id) filter (where q.estado='publicada' and q.nivel=2) n2,
 count(q.id) filter (where q.estado='publicada' and q.nivel=3) n3,
 count(q.id) filter (where q.estado='publicada' and q.concept_id is null) sin_concepto,
 count(q.id) filter (where q.estado='publicada' and coalesce(trim(q.fuente_normativa),'')='') sin_cita,
 count(q.id) filter (where q.estado='publicada' and coalesce(trim(q.explicacion),'')='') sin_explicacion,
 (select count(*) from concepts c where c.topic_id=t.id and c.estado='publicado') conceptos_publicados
from topics t left join questions q on q.topic_id=t.id
group by t.convocatoria_id,t.numero,t.id order by 1,2;

-- Q0.3 Conceptos: sin preguntas, con 3 niveles, sin versión fácil ------------
with cl as (
 select c.id, c.estado, t.numero tema,
  count(q.id) filter (where q.estado='publicada') qpub,
  count(distinct q.nivel) filter (where q.estado='publicada') niveles,
  bool_or(q.nivel=1 and q.estado='publicada') tiene_n1
 from concepts c join topics t on t.id=c.topic_id left join questions q on q.concept_id=c.id
 group by c.id,c.estado,t.numero)
select estado, count(*) conceptos,
 count(*) filter (where qpub=0) sin_preguntas,
 count(*) filter (where niveles=3) con_3_niveles,
 count(*) filter (where niveles=1) con_1_nivel,
 count(*) filter (where qpub>0 and not coalesce(tiene_n1,false)) sin_version_facil,
 round(100.0*count(*) filter (where niveles=3)/count(*),1) pct_3_niveles
from cl group by estado;
-- Resultado 24/10: publicados 727 → 3 niveles 24 (3,3 %), sin preguntas 233, sin nivel 1: 68.

-- Q0.4 Preguntas publicadas enlazadas a conceptos en BORRADOR (invisibles por RLS)
select t.numero tema, c.estado, count(*)
from questions q join topics t on t.id=q.topic_id join concepts c on c.id=q.concept_id
where q.estado='publicada' group by 1,2 order by 1,2;
-- Resultado 24/10: tema 36 → 90, tema 38 → 332 preguntas con concepto en borrador.

-- Q0.5 Integridad de opciones y posición de la correcta ------------------------
with p as (select * from questions where estado='publicada')
select 'correcta_no_existe_en_opciones' k, count(*) n from p
  where not exists (select 1 from jsonb_array_elements(opciones) o where lower(o->>'letra')=lower(trim(correcta)))
union all select 'letras_con_hueco', count(*) from p
  where (select string_agg(lower(o->>'letra'),'' order by lower(o->>'letra')) from jsonb_array_elements(opciones) o) not in ('ab','abc','abcd')
union all select 'posicion_'||pos, count(*) from (
  select (select ord from jsonb_array_elements(opciones) with ordinality e(o,ord) where lower(o->>'letra')=lower(trim(correcta))) pos from p) x group by pos
union all select 'n_opciones_'||jsonb_array_length(opciones), count(*) from p group by jsonb_array_length(opciones)
union all select 'correcta_es_la_mas_larga', count(*) from p
  where jsonb_array_length(opciones)>=3
    and (select o->>'letra' from jsonb_array_elements(opciones) o order by length(o->>'texto') desc limit 1)=lower(trim(correcta));
-- Resultado 24/10: 0 / 2.328 / pos1 3.454, pos2 3.077, pos3 2.858, pos4 397 / 3 opc 7.270, 4 opc 2.492, 2 opc 24 / más larga 4.490 (46,0 % vs 31,2 % esperado).

-- Q0.6 Calidad superficial ----------------------------------------------------
with p as (select * from questions where estado='publicada')
select 'enunciado_duplicado_exacto' k, count(*) from (select lower(trim(enunciado)) from p group by 1 having count(*)>1) d
union all select 'fuente_precisa_heuristica', count(*) from p where fuente_normativa ~* '(BOE|DOE|BOP|art[ií]culo|art\.|anexo|apartado|p[aá]g)'
union all select 'opcion_todas_ninguna', count(*) from p where opciones::text ~* '(todas las (anteriores|respuestas)|ninguna de las)'
union all select 'explicacion_menor_40c', count(*) from p where length(explicacion)<40
union all select 'menciona_caceres_ayto_spei', count(*) from p where (enunciado||explicacion||coalesce(fuente_normativa,'')) ~* '(c[aá]ceres|ayuntamiento de badajoz|SPEI|patrimonio hist)';
-- Resultado 24/10: 179 / 2.623 (26,8 %) / 243 / 231 / 28.

-- Q0.7 RLS y permisos ---------------------------------------------------------
select tablename, policyname, cmd, roles::text, qual, with_check from pg_policies where schemaname='public' order by 1,2;
select table_name, grantee, string_agg(privilege_type,',' order by privilege_type) priv
from information_schema.role_table_grants
where table_schema='public' and grantee in ('anon','authenticated') group by 1,2 order by 1,2;
