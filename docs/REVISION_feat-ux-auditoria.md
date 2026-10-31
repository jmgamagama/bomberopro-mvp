# Notas para revisar feat/ux-auditoria

- **Commit intermedio que no compila:** `3475cdc` pasa `autoStart` a `MockExam`, prop que se añade en `a2ca0ef`. No se reescribe la historia; la punta compila. Para `git bisect`, saltar `3475cdc` (`git bisect skip 3475cdc`).
- **SEO:** canonical, `og:url`, `og:image` absoluta y `sitemap.xml` solo se emiten si el build define `VITE_SITE_URL` (no hay dominio de producción en el repo). Landing estática en `/oposiciones-bombero-badajoz-2026/`, generada desde `src/data/convocatoria.ts` por `scripts/seo.ts`; excluida del fallback de navegación del service worker.
- **Simulacro con cuenta:** el servidor (mig. 08) da 38 + 17; el cliente ahora fija 15 de T35-40 entre las 50 puntuables. Temporizador 60 min (anexo I). Sin cambios en Supabase.
- **e2e:** `e2e/invitado-360.cjs`, `e2e/axe-invitado.cjs`, `e2e/clics-invitado.cjs` (NODE_PATH=/workspace/pwa-e2e/node_modules, necesita `@axe-core/playwright`).
