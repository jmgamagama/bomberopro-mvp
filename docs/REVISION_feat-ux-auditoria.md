# Notas para revisar feat/ux-auditoria

- **Commit intermedio que no compila:** `3475cdc` pasa `autoStart` a `MockExam`, prop que se añade en `a2ca0ef`. No se reescribe la historia; la punta compila. Para `git bisect`, saltar `3475cdc` (`git bisect skip 3475cdc`).
- **SEO:** canonical, `og:url`, `og:image` absoluta y `sitemap.xml` solo se emiten si el build define `VITE_SITE_URL` (no hay dominio de producción en el repo). Landing estática en `/oposiciones-bombero-badajoz-2026/`, generada desde `src/data/convocatoria.ts` por `scripts/seo.ts`; excluida del fallback de navegación del service worker.
- **Simulacro con cuenta:** el servidor (mig. 08) da 38 + 17; el cliente ahora fija 15 de T35-40 entre las 50 puntuables. Temporizador 60 min (anexo I). Sin cambios en Supabase.
- **e2e:** `e2e/invitado-360.cjs`, `e2e/axe-invitado.cjs`, `e2e/clics-invitado.cjs` (NODE_PATH=/workspace/pwa-e2e/node_modules, necesita `@axe-core/playwright`).
- **Commit intermedio (2):** `19dc4bc` importa `components/Skeleton`, que se añade en `d8f9165`; no compila por sí solo. Para bisect: `git bisect skip 19dc4bc`.
- **Supabase diferido (`src/lib/supabase.ts`):** misma API síncrona (`auth.*`, `rpc`, `from`) sobre un import dinámico. Sin sesión guardada (`sb-*-auth-token`) ni tokens en la URL, `getSession` responde «sin sesión» sin cargar supabase-js y las RPC (embudo) esperan al `requestIdleCallback`. Revisar si se añade otro método del cliente (p. ej. `channel`, `storage`): habría que exponerlo en la fachada.
- **Lighthouse:** con throttling simulado (lantern) el LCP sale ~2,3 s porque la pasada sin throttling ejecuta el JS antes del primer pintado y el shell no llega a contar; con `--throttling-method=devtools` (red y CPU reales) el LCP es el shell: 1,3 s.
