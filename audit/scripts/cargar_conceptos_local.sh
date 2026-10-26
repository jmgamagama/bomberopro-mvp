#!/usr/bin/env bash
# Carga en el Postgres LOCAL los conceptos+preguntas del repo con el generador oficial (scripts/cargar_conceptos.py).
cd "$(dirname "$0")/../.."
for f in data/constitucion/titulo-preliminar.json data/ley31-1995/capitulo-*.json; do
  if sql=$(python3 scripts/cargar_conceptos.py "$f" --estado borrador --crear-tema 2>/tmp/cc.err); then
    echo "$sql" | psql -h /tmp -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -q >/dev/null && echo "OK   $f $(echo "$sql" | tail -2 | head -1)" || echo "FAIL carga $f"
  else echo "FAIL validador $f :: $(tail -3 /tmp/cc.err | tr '\n' ' ')"; fi
done
