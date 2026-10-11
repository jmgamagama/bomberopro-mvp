# Integración estudio v2

Rama `integracion/estudio-v2` = `origin/main` (5c5eb03, PR #95) + cadena local `release/estudio-v1 … feat/temas-fase2-oficial` (fd6dc5a) + `fix/anexo1-bop` (225fec8).

## Conflictos resueltos
- `.gitignore`: se conservan ambas reglas (`content/`, `supabase/migrations/*_datos_*.sql` de main y `pwa-capturas/` nuestra).
- `vercel.json`: se conserva `buildCommand: npm run build:deploy` de main y las cabeceras de caché de la PWA (sw.js, manifest, index.html sin caché; assets inmutables).
- `src/App.tsx`: unión de pantallas. Main aporta `concept_t40` («Estudiar hoy») y `my_reports` («Mis reportes»); nosotros `recuerdo`, `sesion_diaria`, `ordena_pasos`, `onboarding`, `planes`. Se mantiene el arranque en bienvenida si no se completó el onboarding.
- `src/components/Dashboard.tsx`: botón `btn-nav-study` con destino y texto de main («Estudiar por temas» → `study_by_topic`) y nuestra altura táctil `min-h-11`.
- Lógica de Supabase, outbox (`useAttemptSync`, `conceptEngine`) y migraciones: sin cambios respecto a main.

## Funciones solapadas (ambas accesibles)
| Función | Origen | Acceso | Datos |
|---|---|---|---|
| **Estudiar hoy** (`concept_t40`, `ConceptStudy`) | Claude (#89, #91, #93) | Tarjeta grande en el panel, solo con sesión iniciada y Supabase | Motor de conceptos en servidor (temas 35, 39, 40), «una sola memoria» |
| **Sesión diaria** (`sesion_diaria`) | Nuestra | Navegación lateral/inferior y bienvenida | Fichas de recuerdo locales + repaso espaciado `mira_recall_srs_v1` (localStorage) |
| **Recuerdo** (`recuerdo`) | Nuestra | Navegación | Registro de fichas de todos los temas |

No se duplica navegación: «Estudiar hoy» sigue solo como tarjeta del panel; «Sesión diaria» solo en la barra de navegación.

## Cómo unificarlas después (propuesta, no implementada)
1. Mapear cada ficha de recuerdo a un `concept_id` del motor (donde exista) y que la valoración de la ficha emita un `concept_event` por la misma vía/outbox que el resto de pantallas («una sola memoria»).
2. Usar `mira_recall_srs_v1` solo como caché offline/invitado; con sesión, la fuente de verdad pasa a ser el servidor (migrar estados locales una vez, idempotente).
3. Fusionar en una sola entrada «Estudiar hoy» que mezcle preguntas del motor y fichas pendientes; mantener «Sesión diaria» como modo invitado/demo.
4. Esto requiere nueva migración y revisión de Codex/Claude: no hacerlo sin acordarlo.

## PWA
`pwa.config.ts`: todas las peticiones a Supabase (`*.supabase.co|in` y el dominio de `VITE_SUPABASE_URL`: REST, RPC, Auth, Storage) son `NetworkOnly` y quedan fuera del `navigateFallback`; el outbox vive en localStorage y no depende del service worker.

## Integrar después `feat/temas-fase3-oficial`
Sale de `feat/temas-fase2-oficial`, ya incluida aquí: `git fetch release && git merge release/feat/temas-fase3-oficial` sobre esta rama. Solo deberían aparecer conflictos en registros de temas (índice de fichas), sumando entradas de ambos lados. Repetir vitest, tsc, build y pwa-movil-check.

## Actualización: main f3b466a (#101) y fase 3 parcial (38cd56d)
- Fusionado origin/main f3b466a (#101 «UX móvil», Claude). Conflictos solo de clases CSS en `App.tsx`, `Dashboard.tsx` y `StudentConsultationModal.tsx`: se adoptan las de #101 (contraste/tamaños WCAG; ya incluyen `min-h-11`).
- Fusionado exactamente 38cd56d de `feat/temas-fase3-oficial` (temas 22, 25, 26, 29, 30 y 34 lotes 01-02) sin conflictos. Registro: 2406 fichas, 28 mazos, 20 temas.
- Para el resto de fase 3: `git fetch release && git merge release/feat/temas-fase3-oficial`.

## Actualización: fase 3 hasta 689431e
- origin/main sin cambios (f3b466a). Fusionado 689431e sin conflictos (temas 4, 5, 13, 14, 16 lote 2, 17, 20, 21, 23, 24 y 27).
- Registro: 2674 fichas, 39 mazos, 30 temas.

## Actualización: fase 4 hasta b3593d6
- origin/main sin cambios (f3b466a). Fusionado b3593d6 de `feat/temas-fase4-oficial` sin conflictos (temas 8, 10, 12 y 28).
- Registro: 2783 fichas, 43 mazos, 34 temas.

## Actualización: fase 5 hasta 3382d59 y main 1cbdf5f
- Fusionado 3382d59 de `feat/temas-fase5-oficial` sin conflictos (lote 3 del tema 34, lote 2 del tema 22, lote 2 de los temas 10 y 12).
- origin/main avanzó a 1cbdf5f (#102, Claude: registro de sesiones de estudio, migración 15). Fusionado sin conflictos; migración y lógica de sesiones sin tocar.
- Registro: 2881 fichas, 47 mazos, 34 temas.
