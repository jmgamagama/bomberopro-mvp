-- Falla (ERROR, exit 3 con psql -v ON_ERROR_STOP=1) si en el esquema public:
--  a) alguna tabla no tiene RLS activado,
--  b) anon o PUBLIC tienen cualquier privilegio sobre alguna tabla/vista/secuencia,
--  c) alguna función SECURITY DEFINER no fija search_path,
--  d) alguna función SECURITY DEFINER es ejecutable por anon fuera de la lista blanca.
-- Uso: psql "$DB" -v ON_ERROR_STOP=1 -f audit/checks/C_seguridad/check_rls_grants.sql
-- Lista blanca de RPC para anon (decisión explícita, revisar si cambia):
--   log_funnel_event, get_concept_outline, get_concept_outline_tema
DO $$
DECLARE r record; errs text[] := '{}';
BEGIN
  FOR r IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
           WHERE n.nspname='public' AND c.relkind IN ('r','p') AND NOT c.relrowsecurity ORDER BY 1 LOOP
    errs := errs || format('SIN RLS: public.%s', r.relname);
  END LOOP;
  FOR r IN SELECT c.relname, c.relkind, a.grantee, string_agg(a.privilege_type, ',') privs
           FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace,
                LATERAL (SELECT CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE x.grantee::regrole::text END grantee, x.privilege_type
                         FROM aclexplode(c.relacl) x) a
           WHERE n.nspname='public' AND c.relkind IN ('r','p','v','m','S','f') AND a.grantee IN ('anon','PUBLIC')
           GROUP BY 1,2,3 ORDER BY 1 LOOP
    errs := errs || format('GRANT a %s en public.%s: %s', r.grantee, r.relname, r.privs);
  END LOOP;
  FOR r IN SELECT p.oid::regprocedure fn FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
           WHERE n.nspname='public' AND p.prosecdef
             AND NOT EXISTS (SELECT 1 FROM unnest(coalesce(p.proconfig,'{}')) c WHERE c LIKE 'search_path=%') LOOP
    errs := errs || format('SECURITY DEFINER sin search_path: %s', r.fn);
  END LOOP;
  FOR r IN SELECT p.oid::regprocedure fn FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
           WHERE n.nspname='public' AND p.prosecdef AND has_function_privilege('anon', p.oid, 'EXECUTE')
             AND p.proname NOT IN ('log_funnel_event','get_concept_outline','get_concept_outline_tema') LOOP
    errs := errs || format('SECURITY DEFINER ejecutable por anon: %s', r.fn);
  END LOOP;
  IF array_length(errs,1) > 0 THEN
    RAISE EXCEPTION E'check_rls_grants: % problemas\n%', array_length(errs,1), array_to_string(errs, E'\n');
  END IF;
  RAISE NOTICE 'check_rls_grants: OK';
END $$;
