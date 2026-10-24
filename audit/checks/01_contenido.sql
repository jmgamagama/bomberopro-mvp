-- audit/checks/01_contenido.sql
-- Integridad del banco publicado (CPEI Badajoz, convocatoria 1). Solo lectura.
-- Cada fila: check | tipo | valor | umbral | ok
--   tipo = 'bloqueante' → debe cumplirse ya; si falla, la Action falla.
--   tipo = 'trinquete'  → umbral = valor medido el 2026-10-24; falla solo si EMPEORA.
--                         Bajar el umbral a mano cada vez que se mejore (nunca subirlo).
with p as (
  select q.* from questions q join topics t on t.id = q.topic_id
  where q.estado = 'publicada' and t.convocatoria_id = 1
),
m as (
  select
    (select count(*) from p where not exists (
        select 1 from jsonb_array_elements(opciones) o
        where lower(o->>'letra') = lower(trim(correcta)))) as correcta_inexistente,
    (select count(*) from p where coalesce(trim(fuente_normativa),'') = '') as sin_fuente,
    (select count(*) from p where coalesce(trim(explicacion),'') = '') as sin_explicacion,
    (select count(*) from p where jsonb_array_length(opciones) < 3) as menos_de_3_opciones,
    (select count(*) from p where exists (
        select 1 from jsonb_array_elements(opciones) o where coalesce(trim(o->>'texto'),'') = '')) as opcion_vacia,
    (select count(*) from (select lower(trim(enunciado)) from p group by 1 having count(*) > 1) d) as enunciados_duplicados,
    (select count(*) from p where (enunciado || coalesce(explicacion,'') || coalesce(fuente_normativa,''))
        ~* '(c[aá]ceres|ayuntamiento de badajoz|SPEI|patrimonio hist)') as menciona_otra_convocatoria,
    -- Notas internas de QA/generación que ve el alumno (medido 24/10: 148; p. ej. ids 592, 1819, 2106, 3083, 7058)
    (select count(*) from p where explicacion ~ '(AVISO|NOTA DE|NOTA:|\[REVISAR|\[TODO|TODO:|PENDIENTE|CORRECCIÓN DE CONTENIDO)'
                              or explicacion ~* '(\merrata\M|se corrige|en el original|el documento (fuente|original)|mal transcrit|seg[uú]n el pdf|borrador)') as texto_interno_visible,
    (select round(100.0 * count(*) filter (where fuente_normativa ~* '(BOE|DOE|BOP|art[ií]culo|art\.|anexo|apartado|p[aá]g)') / nullif(count(*),0), 1) from p) as pct_fuente_precisa,
    -- Pista "la correcta es la más larga": observado / esperado por azar (1/n opciones)
    (select round( (count(*) filter (where (select o->>'letra' from jsonb_array_elements(opciones) o
                                           order by length(o->>'texto') desc limit 1) = lower(trim(correcta))))::numeric
                 / nullif(sum(1.0 / jsonb_array_length(opciones)), 0), 2)
       from p where jsonb_array_length(opciones) >= 3) as ratio_correcta_mas_larga
)
select 'correcta_inexistente'       as "check", 'bloqueante' tipo, correcta_inexistente::numeric valor, 0::numeric umbral, correcta_inexistente = 0 ok from m
union all select 'sin_fuente',        'bloqueante', sin_fuente, 0, sin_fuente = 0 from m
union all select 'sin_explicacion',   'bloqueante', sin_explicacion, 0, sin_explicacion = 0 from m
union all select 'opcion_vacia',      'bloqueante', opcion_vacia, 0, opcion_vacia = 0 from m
union all select 'texto_interno_visible (objetivo 0)', 'trinquete', texto_interno_visible, 148, texto_interno_visible <= 148 from m
union all select 'menos_de_3_opciones', 'trinquete', menos_de_3_opciones, 24, menos_de_3_opciones <= 24 from m
union all select 'enunciados_duplicados', 'trinquete', enunciados_duplicados, 179, enunciados_duplicados <= 179 from m
union all select 'menciona_otra_convocatoria', 'trinquete', menciona_otra_convocatoria, 28, menciona_otra_convocatoria <= 28 from m
union all select 'pct_fuente_precisa (mín.)', 'trinquete', pct_fuente_precisa, 26.8, pct_fuente_precisa >= 26.8 from m
union all select 'ratio_correcta_mas_larga (objetivo ≤1.15)', 'trinquete', ratio_correcta_mas_larga, 1.47, ratio_correcta_mas_larga <= 1.47 from m;
