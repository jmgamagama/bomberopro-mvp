#!/usr/bin/env bash
# Postgres 17 local (apt) en el puerto 55432; aplica stub + migraciones (sin *_down) y registra fallos.
set -u
export PATH=/usr/lib/postgresql/17/bin:$PATH
P="psql -h /tmp -p 55432 -U postgres -v ON_ERROR_STOP=1 -q"
cd "$(dirname "$0")/../.."
psql -h /tmp -p 55432 -U postgres -qc "drop database if exists bomberopro_audit" -c "create database bomberopro_audit"
$P -d bomberopro_audit -f audit/sql/00_base_stub.sql
for f in $(ls supabase/migrations/*.sql | grep -v '_down.sql' | sort -V); do
  if out=$($P -d bomberopro_audit -1 -f "$f" 2>&1); then echo "OK   $f"; else echo "FAIL $f :: $(echo "$out" | grep -m1 ERROR)"; fi
done
