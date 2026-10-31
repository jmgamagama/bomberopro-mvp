#!/usr/bin/env bash
# Checks e2e del auditor D. Requiere `npm run build && npm run preview` (4173) y,
# para el perfil con planes, un build con VITE_FEATURE_PLANES=true servido en 4174:
#   VITE_FEATURE_PLANES=true npx vite build --configLoader runner --outDir /tmp/dist-planes
#   npx vite preview --port 4174 --outDir /tmp/dist-planes
# MAX_CLICKS (por defecto 3) = clics máximos permitidos hasta la primera pregunta.
set -u
cd "$(dirname "$0")"
export NODE_PATH=${NODE_PATH:-/workspace/pwa-e2e/node_modules}
B=${BASE:-http://localhost:4173}; BP=${BASE_PLANES:-http://localhost:4174}
rc=0
BASE=$B node perfil1_novato_movil.cjs || rc=1
BASE=$B node perfil2_repetidor_escritorio.cjs || rc=1
BASE=$B node perfil3_gratis_sin_registro.cjs || rc=1
BASE=$BP node perfil3_gratis_sin_registro.cjs || rc=1
BASE=$B node accesibilidad_axe.cjs || rc=1
exit $rc
