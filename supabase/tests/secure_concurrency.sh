#!/usr/bin/env bash
# Disposable PostgreSQL17 service only. No Supabase credentials required.
set -euo pipefail
psql -X -v ON_ERROR_STOP=1 -f supabase/tests/fixtures/secure_assessments.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/migrations/09_motor_conceptos_v1.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/migrations/17_correccion_en_servidor.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/migrations/18_conceptos_test_evaluacion_servidor.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/tests/fixtures/concept_outlines.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/migrations/27_secure_assessments.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/tests/fixtures/secure_concurrency.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/migrations/29_activate_secure_assessments.sql
psql -X -v ON_ERROR_STOP=1 -f supabase/tests/fixtures/secure_concurrency_setup.sql
psql -X -v ON_ERROR_STOP=1 -c "SELECT public.audit_grade('00000000-0000-0000-0000-00000000000a');" &
audit_pid_a=$!
psql -X -v ON_ERROR_STOP=1 -c "SELECT public.audit_grade('00000000-0000-0000-0000-00000000000b');" &
audit_pid_b=$!
wait "$audit_pid_a"
wait "$audit_pid_b"
psql -X -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN IF (SELECT count(*) FROM attempts)<>2 OR EXISTS(SELECT 1 FROM attempts WHERE nivel<>1) THEN RAISE EXCEPTION 'parallel_single_grading_failed'; END IF; END \$\$; SELECT public.audit_prepare_exams(); SELECT public.audit_issue('simulacro');"
psql -X -v ON_ERROR_STOP=1 -c "SELECT public.audit_finish('00000000-0000-0000-0000-00000000000a',false);" &
audit_pid_a=$!
psql -X -v ON_ERROR_STOP=1 -c "SELECT public.audit_finish('00000000-0000-0000-0000-00000000000b',true);" &
audit_pid_b=$!
wait "$audit_pid_a"
wait "$audit_pid_b"
psql -X -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN IF (SELECT count(*) FROM attempts)<>6 OR (SELECT count(*) FROM assessment_sessions WHERE completed_at IS NOT NULL)<>2 THEN RAISE EXCEPTION 'parallel_exam_grading_failed'; END IF; END \$\$;"
echo 'PASS PostgreSQL17 parallel answers, statistical level change and inverse-order exams'
