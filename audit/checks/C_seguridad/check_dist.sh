#!/usr/bin/env bash
# Falla (exit 1) si dist/ contiene patrones de secretos o fichas de mazos pendientes de revisión.
# Uso: npm run build && bash audit/checks/C_seguridad/check_dist.sh [dist]
set -uo pipefail
DIST="${1:-dist}"; ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
[ -d "$DIST" ] || { echo "No existe $DIST (ejecuta npm run build)"; exit 2; }
fail=0
# 1) Secretos: claves de servidor de Supabase, JWT con role service_role, claves de proveedores.
PAT='sb_secret_[A-Za-z0-9_-]{10,}|sbp_[A-Za-z0-9]{20,}|SUPABASE_SERVICE_ROLE|service_role_key|sk-[A-Za-z0-9_-]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{35}|xai-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk_live_[A-Za-z0-9]{20,}|rk_live_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{20,}'
if hits=$(grep -rEo "$PAT" "$DIST" 2>/dev/null | sed -E 's/(:.{12}).*/\1…/' | sort -u); [ -n "$hits" ]; then
  echo "FALLO secretos en $DIST:"; echo "$hits"; fail=1; fi
# JWT cuyo payload diga role=service_role
for jwt in $(grep -rEoh 'eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' "$DIST" 2>/dev/null | sort -u); do
  p=$(echo "$jwt" | cut -d. -f2 | tr '_-' '/+'); while [ $(( ${#p} % 4 )) -ne 0 ]; do p="$p="; done
  if echo "$p" | base64 -d 2>/dev/null | grep -q '"role" *: *"service_role"'; then echo "FALLO JWT service_role en $DIST"; fail=1; fi
done
# Correos en el bundle (p. ej. VITE_REVISION_OWNERS): aviso, no fallo
emails=$(grep -rEoh '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}' "$DIST/assets" 2>/dev/null | sort -u | grep -vE '@(example|sentry|2x|3x)' || true)
[ -n "$emails" ] && { echo "AVISO correos en el bundle:"; echo "$emails"; }
# 2) Fichas pendientes
tmp=$(mktemp); npx vite-node audit/checks/C_seguridad/fichas_pendientes.ts > "$tmp" 2>/dev/null || { echo "No se pudo listar fichas pendientes"; exit 2; }
python3 - "$tmp" "$DIST" <<'PY' || fail=1
import json,sys,glob
decks=json.load(open(sys.argv[1])); blob=''.join(open(f,encoding='utf-8',errors='ignore').read() for f in glob.glob(sys.argv[2]+'/**/*.js',recursive=True))
total=sum(len(d['ids']) for d in decks); leaked=[(d['deck'],sum(1 for i in d['ids'] if '"'+i+'"' in blob)) for d in decks]
n=sum(x for _,x in leaked)
print(f"Fichas de mazos pendientes: {total} en {len(decks)} mazos; presentes en dist: {n}")
if n: print("FALLO mazos pendientes en dist:", ', '.join(f"{d}={x}" for d,x in leaked if x)); sys.exit(1)
PY
rm -f "$tmp"
[ $fail -eq 0 ] && echo "OK dist limpio" ; exit $fail
