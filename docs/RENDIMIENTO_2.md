# Rendimiento 2 (feat/rendimiento-2, 01/11/2026)

Medido con `e2e/medir-rendimiento.cjs` (Playwright + CDP) sobre `vite preview`: móvil 360×740, CPU 4x,
red 4G lenta (562,5 ms de latencia, 1,47 Mbit/s de bajada), caché fría, sin service worker; mediana de 5 cargas
de la portada de invitado (bienvenida). TTI = máx(FCP, fin de la última tarea larga).

| | 36b5e0b | 48c7e29 (antes) | feat/rendimiento-2 |
|---|---|---|---|
| LCP | 1376 ms | 1348 ms | 1372 ms |
| TTI | 2314 ms | 2380 ms | 2319 ms |
| JS transferido al arrancar | 179,5 KB (3) | 203,9 KB | 179,1 KB (3) |
| Chunk de entrada (gzip) | 126,22 kB | 151,20 kB | 125,77 kB |

Qué salía en el JS inicial y ahora se carga al usarlo: el material (VerEnEsquema, materialTemas,
materialPreceptos, materialEnContexto: App solo usa el índice `src/data/materialTemasIndice.ts`, generado),
las relaciones ficha↔artículo (`utils/fichasRelacionadas.ts`), los motivos de revisión de mazos
(`data/recallReviewMotivos.ts`), TrainScreen, la celebración, AccesoConfirmado, el diálogo de consulta y el
panel remoto (solo con cuenta). `src/jsInicial.test.ts` comprueba el grafo de imports estáticos.

Sin conexión (`e2e/sin-conexion-360.cjs`): plan de hoy, fichas, simulacro de muestra y material ya visto.
El material (public/material, .md/.json) no está en el precache; ahora se guarda al verlo (NetworkFirst,
caché `material-visto`): con red se sigue pidiendo a la red.
