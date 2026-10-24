-- audit/checks/03_seguridad.sql — permisos, RLS y exposición del banco. Solo lectura.
-- Formato: check | tipo | valor | umbral | ok  (ver 01_contenido.sql).
-- Necesita un rol con lectura de catálogo y de auth.users (count, sin datos personales).
with f as (
  select p.oid, p.proname, pg_get_function_result(p.oid) res, p.prosecdef, p.proconfig
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'
),
m as (
  select
    (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity) tablas_sin_rls,
    (select count(*) from information_schema.role_table_grants
      where table_schema = 'public' and grantee in ('anon','authenticated')
        and table_name in ('questions','concepts') and privilege_type <> 'SELECT') escritura_contenido,
    (select count(*) from information_schema.role_table_grants
      where table_schema = 'public' and grantee in ('anon','authenticated') and table_name = 'questions') grants_directos_questions,
    (select count(*) from f where has_function_privilege('anon', oid, 'execute')
        and res ~* '(correct_answer|correcta|explanation|explicacion)') rpc_anon_devuelve_solucion,
    -- Medido 24/10: 5 (get_blueprint_exam_questions, get_concept_session_v2, get_preparer_session_questions,
    -- get_study_session, get_topic_study_questions). Objetivo: solo las que topan p_limit en servidor.
    (select count(*) from f where has_function_privilege('authenticated', oid, 'execute')
        and res ~* '(correct_answer|correcta|explanation|explicacion)') rpc_auth_devuelve_solucion,
    -- Descarga masiva: la RPC sin tope de p_limit no debe ser ejecutable por alumnos.
    (select count(*) from f where proname = 'get_preparer_session_questions'
        and has_function_privilege('authenticated', oid, 'execute')) preparer_ejecutable,
    (select count(*) from f where prosecdef and not coalesce(array_to_string(proconfig, ',') ~ 'search_path', false)) secdef_sin_search_path,
    (select count(distinct table_name) from information_schema.role_table_grants
      where table_schema = 'public' and grantee = 'anon' and privilege_type in ('UPDATE','DELETE','TRUNCATE')) anon_con_update_delete,
    (select count(distinct table_name) from information_schema.role_table_grants
      where table_schema = 'public' and grantee in ('anon','authenticated') and privilege_type = 'SELECT'
        and (table_name like 'qa\_%' or table_name like 'backup\_%')) select_en_qa_o_backup,
    -- Altas confirmadas al instante en los últimos 7 días (confirmación por email desactivada).
    (select count(*) from auth.users where created_at > now() - interval '7 days'
        and email_confirmed_at - created_at < interval '5 seconds') altas_autoconfirmadas_7d
)
select 'tablas_sin_rls' "check", 'bloqueante' tipo, tablas_sin_rls::numeric valor, 0::numeric umbral, tablas_sin_rls = 0 ok from m
union all select 'escritura_alumno_en_questions_concepts', 'bloqueante', escritura_contenido, 0, escritura_contenido = 0 from m
union all select 'grants_directos_en_questions', 'bloqueante', grants_directos_questions, 0, grants_directos_questions = 0 from m
union all select 'rpc_anon_devuelve_solucion', 'bloqueante', rpc_anon_devuelve_solucion, 0, rpc_anon_devuelve_solucion = 0 from m
union all select 'secdef_sin_search_path', 'bloqueante', secdef_sin_search_path, 0, secdef_sin_search_path = 0 from m
union all select 'preparer_sin_tope_ejecutable (objetivo 0)', 'trinquete', preparer_ejecutable, 1, preparer_ejecutable <= 1 from m
union all select 'rpc_auth_devuelve_solucion', 'trinquete', rpc_auth_devuelve_solucion, 5, rpc_auth_devuelve_solucion <= 5 from m
union all select 'anon_con_update_delete (objetivo 0; hoy: leads)', 'trinquete', anon_con_update_delete, 1, anon_con_update_delete <= 1 from m
union all select 'select_en_qa_o_backup (objetivo 0; hoy: qa_changes_20260923)', 'trinquete', select_en_qa_o_backup, 1, select_en_qa_o_backup <= 1 from m
union all select 'altas_autoconfirmadas_7d', 'bloqueante', altas_autoconfirmadas_7d, 0, altas_autoconfirmadas_7d = 0 from m;
