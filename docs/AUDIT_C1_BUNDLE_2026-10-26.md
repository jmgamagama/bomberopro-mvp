# C1 · Mazos pendientes fuera del bundle (paso 1) · 26/10/2026

Auditoría `audit/2026-10-26.md`, ticket #1 (NPR 100). Antes, `check_dist.sh` encontraba 2.598 de 2.598 fichas pendientes en `dist/`, y el service worker las precacheaba (82 entradas, 2.750 KiB).

**Cambio:** `scripts/excluir-mazos-pendientes.ts`, un plugin de Vite que solo actúa en el build. En `vite build`, cada módulo de un mazo `pendiente` (según `src/data/recallReview.ts`) se sustituye por un *stub* con las mismas exportaciones, pero vacías. Además, en producción `canSeePendingDecks()` devuelve `false` salvo que se compile con `VITE_INCLUDE_PENDING_DECKS=true`, que queda solo para una build interna de revisión.

**Resultado:** 0 de 2.598 fichas pendientes en `dist/`; precache de 1.227 KiB. Dev y Vitest no cambian. Las fichas mantienen su estado de revisión.

**Lo que falta (paso 2):** los 8 mazos revisados, incluidos los Pro, siguen en el JS público. Para cerrar C1 hay que servir las fichas por una RPC autenticada que compruebe el plan en el servidor (tabla de *entitlements*) y quitar los chunks del precache. Para revisar los mazos pendientes en un despliegue hace falta una preview interna con `VITE_INCLUDE_PENDING_DECKS=true`; no vale el despliegue público.
