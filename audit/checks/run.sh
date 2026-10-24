#!/usr/bin/env bash
# audit/checks/run.sh — Ejecuta todos los checks SQL de audit/checks/*.sql contra la base indicada.
#
# Uso:   AUDIT_DATABASE_URL="postgresql://audit_ro:...@db.<ref>.supabase.co:5432/postgres" bash audit/checks/run.sh
#
# Cada .sql devuelve filas: check | tipo | valor | umbral | ok
# Sale con código 1 si alguna fila tiene ok = false (bloqueante o trinquete que ha empeorado).
# Recomendado: usar un rol de SOLO LECTURA (ver audit/checks/README.md), nunca service_role.
set -euo pipefail

: "${AUDIT_DATABASE_URL:?Falta AUDIT_DATABASE_URL}"
DIR="$(cd "$(dirname "$0")" && pwd)"
fallos=0
resumen=""

for f in "$DIR"/*.sql; do
  echo "== $(basename "$f")"
  # -A sin alinear, -t sin cabecera, -F separador '|', ON_ERROR_STOP para que un SQL roto falle.
  salida="$(psql "$AUDIT_DATABASE_URL" -v ON_ERROR_STOP=1 -X -A -t -F '|' -f "$f")"
  while IFS='|' read -r check tipo valor umbral ok; do
    [ -z "${check:-}" ] && continue
    if [ "$ok" = "t" ]; then marca="OK  "; else marca="FALLA"; fallos=$((fallos+1)); fi
    linea="$marca  [$tipo] $check = $valor (umbral $umbral)"
    echo "  $linea"
    resumen+="| $marca | $tipo | $check | $valor | $umbral |"$'\n'
  done <<< "$salida"
done

# Resumen en la página de la ejecución de GitHub Actions
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "### Auditoría semanal BomberoPro"
    echo "| Estado | Tipo | Check | Valor | Umbral |"
    echo "|---|---|---|---|---|"
    printf '%s' "$resumen"
  } >> "$GITHUB_STEP_SUMMARY"
fi

if [ "$fallos" -gt 0 ]; then
  echo "❌ $fallos check(s) fuera de umbral"
  exit 1
fi
echo "✅ Todos los checks dentro de umbral"
