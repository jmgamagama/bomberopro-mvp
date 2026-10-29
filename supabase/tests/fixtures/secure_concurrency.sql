-- Run only after fixture+17+27 in the disposable database named audit.
DO $$ BEGIN IF current_database()<>'audit' THEN RAISE EXCEPTION 'disposable_audit_database_required'; END IF; END $$;
INSERT INTO assessment_entitlements SELECT id,true,now()+interval '1 day',1000 FROM auth.users;
UPDATE assessment_rollout SET client_ready_at=now(),note='Synthetic PostgreSQL17 concurrency test, not release approval';
