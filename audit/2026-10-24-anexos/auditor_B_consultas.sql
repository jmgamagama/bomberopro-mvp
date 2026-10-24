-- Consultas SOLO SELECT ejecutadas en prod (yndoaprnpkjqiggeyefz) el 2026-10-24.

-- Q1 Paridad repo↔prod: md5 de definiciones
select p.proname, md5(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' order by 1;

-- Q2 Banco publicado y enlace a conceptos
select q.estado, t.convocatoria_id, count(*) n, count(q.concept_id) con_concepto,
 count(*) filter (where c.estado='publicado') con_concepto_pub, count(*) filter (where c.estado is not null and c.estado<>'publicado') con_concepto_nopub
from questions q left join topics t on t.id=q.topic_id left join concepts c on c.id=q.concept_id group by 1,2 order by 1,2;

-- Q3 Cobertura de niveles por concepto (publicado / borrador)
with c as (select c.id, c.estado, (select array_agg(distinct coalesce(q.nivel,1) order by coalesce(q.nivel,1)) from questions q where q.concept_id=c.id and q.estado='publicada') niv,
  (select count(*) from questions q where q.concept_id=c.id and q.estado='publicada') nq from concepts c)
select estado, count(*), count(*) filter (where nq=0) sin_preg, count(*) filter (where nq=1) una_preg, count(*) filter (where niv @> array[1,2,3]) niv123,
 count(*) filter (where nq>0 and not (niv @> array[1])) sin_n1, count(*) filter (where niv=array[1]) solo1, count(*) filter (where niv=array[2]) solo2 from c group by 1;

-- Q4 Por tema y combinación de niveles (publicados)
with c as (select c.id, t.numero, (select array_agg(distinct coalesce(q.nivel,1) order by 1) from questions q where q.concept_id=c.id and q.estado='publicada') niv,
  (select count(*) from questions q where q.concept_id=c.id and q.estado='publicada') nq from concepts c join topics t on t.id=c.topic_id where c.estado='publicado')
select numero, coalesce(niv::text,'{}'), count(*), sum(nq), max(nq) from c group by 1,2 order by 1,2;

-- Q5 % del banco al que la escalera no puede aplicarse
with c as (select c.id, c.estado, (select count(*) from questions q where q.concept_id=c.id and q.estado='publicada') nq,
  (select count(distinct coalesce(q.nivel,1)) from questions q where q.concept_id=c.id and q.estado='publicada') nl from concepts c),
q as (select q.id, q.concept_id, c.estado, c.nq, c.nl from questions q left join c on c.id=q.concept_id where q.estado='publicada')
select count(*), count(*) filter (where concept_id is null) sin_concepto, count(*) filter (where estado='borrador') borrador, count(*) filter (where estado='publicado') pub,
 count(*) filter (where estado='publicado' and nq>=2) pub_alternativa, count(*) filter (where estado='publicado' and nl>=2) pub_2niveles from q;

-- Q6 Estructura de opciones (letras, huecos, clave válida, textos duplicados)
-- (ver cuerpo en auditor_B_aprendizaje.md §3)

-- Q7 Distribución por letra y por orden almacenado + chi² vs uniforme (por nº de opciones y por patrón de letras)
with q as (select (select string_agg(lower(trim(e->>'letra')),'' order by 1) from jsonb_array_elements(q.opciones) e) letras, lower(trim(q.correcta::text)) k
  from questions q join topics t on t.id=q.topic_id and t.convocatoria_id=1 where q.estado='publicada'),
a as (select letras, k, count(*) o from q group by 1,2), t as (select letras, sum(o) tt, length(letras) n from a group by 1)
select a.letras, a.k, a.o, round(100.0*a.o/t.tt,1), round(sum(power(a.o-t.tt/t.n,2)/(t.tt/t.n)) over (partition by a.letras),1) chi2, t.n-1 gl from a join t using(letras) order by 1,2;

-- Q8 Posición MOSTRADA en el subconjunto que el cliente NO baraja (regex POSITIONAL de shuffleOptions.ts),
--    con recorte 4→3 del servidor modelado como equiprobable; chi² vs uniforme
-- (ver cuerpo en el informe §3)

-- Q9 «Elegir la más larga» sobre lo que realmente se sirve (recorte 4→3 enumerado), y estrategia combinada
--    (si hay exactamente una opción referencial, elegirla; si no, la más larga)
-- (ver cuerpo en el informe §3)

-- Q10 Estado real de la escalera en prod
select (select count(distinct user_id) from user_concept_state), (select json_agg(x) from (select nivel_escalera, count(*) from user_concept_state group by 1) x),
 (select count(*) from concept_events), (select round(max(extract(epoch from due_at-last_review_at)/86400)::numeric,1) from user_concept_state);
with last as (select distinct on (e.user_id,e.concept_id) e.user_id,e.concept_id,e.correct,e.created_at,q.nivel from concept_events e join questions q on q.id=e.question_id where e.kind='test' order by e.user_id,e.concept_id,e.created_at desc,e.id desc)
select l.correct,l.nivel,s.nivel_escalera,count(*),min(l.created_at),max(l.created_at) from last l join user_concept_state s using(user_id,concept_id) group by 1,2,3;
select version,name from supabase_migrations.schema_migrations order by version desc limit 15;

-- Q11 Intervalo concedido por la primera recuperación tras la ficha
select e.grade, (e.s_before is null) primera, count(*), round(avg(extract(epoch from e.due_after-e.created_at)/86400)::numeric,2) dias,
 round(avg(extract(epoch from e.created_at-(select max(f.created_at) from concept_events f where f.user_id=e.user_id and f.concept_id=e.concept_id and f.kind='ficha' and f.created_at<=e.created_at)))/60) min_desde_ficha
from concept_events e where e.kind in ('test','recuerdo') group by 1,2 order by 2 desc,1;

-- Q12 Intentos sobre preguntas de conceptos en borrador (evidencia perdida)
select count(*), count(*) filter (where q.concept_id is null), count(*) filter (where c.estado='borrador'), count(*) filter (where c.estado='publicado')
from attempts a join questions q on q.id=a.question_id left join concepts c on c.id=q.concept_id where coalesce(a.modo,'')<>'simulacro';

-- Q13 Opciones que citan letras (el alumno nunca ve letras)
with q as (select q.id,q.opciones,(select string_agg(lower(trim(e->>'letra')),'' order by 1) from jsonb_array_elements(q.opciones) e) letras from questions q join topics t on t.id=q.topic_id and t.convocatoria_id=1 where q.estado='publicada')
select count(*) filter (where exists(select 1 from jsonb_array_elements(opciones) e where (e->>'texto') ~* '(\y[a-d]\)?\s+(y|e|o)\s+[a-d]\y|respuestas?\s+[a-d]\y|opci[oó]n(es)?\s+[a-d]\y)')) citan_letra,
 count(*) filter (where letras<>left('abcd',length(letras)) and exists(select 1 from jsonb_array_elements(opciones) e where (e->>'texto') ~* '\y[a-d]\)?\s+(y|e|o)\s+[a-d]\y')) citan_letra_con_hueco from q;
