# Auditoría editorial automática de las fichas

Generado con `npm run auditar:fichas` (scripts/auditar-fichas.ts). **No editar a mano.**

Reglas (src/data/recallAudit.ts): campos obligatorios (id, concepto, respuesta, fuente y localización), ids únicos en todo el registro, sin conceptos repetidos, enlaces solo de dominios oficiales, y los mazos sin enlace deben estar declarados.

**Versión** = huella sha256 (16 caracteres) del contenido del mazo. Si cambia una ficha de un mazo **revisado**, el test `recallAudit.test.ts` falla hasta que se regenere este informe. Así cada cambio en contenido publicado queda visible en el diff y hay que revisarlo.

Problemas detectados: **0**.

| Mazo | Revisión | Fichas | Con enlace oficial | Problemas | Versión | Nota |
|---|---|---:|---:|---:|---|---|
| tema1 | pendiente | 129 | 100 % | 0 | `685c7d6dbcf833da` |  |
| tema2 | pendiente | 121 | 100 % | 0 | `f30711142bf017a4` |  |
| tema3 | pendiente | 66 | 100 % | 0 | `c4552f857057dbfc` |  |
| tema4 | pendiente | 28 | 100 % | 0 | `6e84da2108610bb2` |  |
| tema5 | pendiente | 28 | 100 % | 0 | `fc80511b9650598a` |  |
| tema6 | pendiente | 94 | 100 % | 0 | `4fd29b1f6e6f146b` |  |
| tema7 | pendiente | 64 | 100 % | 0 | `2bd953ad56a2fdc3` |  |
| tema8 | pendiente | 25 | 100 % | 0 | `5c8331e250016463` |  |
| tema10 | pendiente | 34 | 100 % | 0 | `735c9bacebb0513f` |  |
| tema10-lote02 | revisado | 13 | 100 % | 0 | `4dbd481541494ac3` |  |
| tema12 | pendiente | 21 | 100 % | 0 | `7ef9bc6244b177a0` |  |
| tema12-lote02 | pendiente | 23 | 100 % | 0 | `dee29796b90e5874` |  |
| tema13 | pendiente | 25 | 100 % | 0 | `1a00973aa68f0f00` |  |
| tema14 | pendiente | 24 | 100 % | 0 | `eddcc0cb7906176f` |  |
| tema16 | revisado | 48 | 0 % | 0 | `74010679e9276413` | sin enlace público |
| tema16-lote02 | pendiente | 21 | 100 % | 0 | `dc82c612be1668e9` |  |
| tema17 | revisado | 14 | 100 % | 0 | `412a879010d41acc` |  |
| tema20 | pendiente | 24 | 100 % | 0 | `0b4c4913afacc656` |  |
| tema21 | pendiente | 42 | 100 % | 0 | `0d98869be8aec3c7` |  |
| tema22 | pendiente | 33 | 100 % | 0 | `5e2e70abd6843bc0` |  |
| tema22-lote02 | pendiente | 27 | 100 % | 0 | `5c1bd829625cfc84` |  |
| tema23 | pendiente | 21 | 100 % | 0 | `9942d77c7ee61310` |  |
| tema24 | revisado | 19 | 100 % | 0 | `f51fe2a06a029c0d` |  |
| tema25 | pendiente | 47 | 100 % | 0 | `274647248a13635e` |  |
| tema26 | pendiente | 60 | 100 % | 0 | `3b47c30a9a7bd1e3` |  |
| tema27 | pendiente | 22 | 100 % | 0 | `9c69d2a21da029c6` |  |
| tema28 | pendiente | 29 | 100 % | 0 | `e98b803ecbc6ed49` |  |
| tema29 | pendiente | 81 | 100 % | 0 | `f6e9a173591edc29` |  |
| tema30 | pendiente | 87 | 100 % | 0 | `30ee8e6e235730f1` |  |
| tema31 | pendiente | 83 | 100 % | 0 | `8ec0f4305c1c067e` |  |
| tema32 | pendiente | 91 | 100 % | 0 | `9987144bd4168be1` |  |
| tema33 | pendiente | 67 | 100 % | 0 | `a2cb9f71d99bcdfd` |  |
| tema34-lote01 | pendiente | 58 | 100 % | 0 | `a7894a36cab2ce83` |  |
| tema34-lote02 | pendiente | 39 | 100 % | 0 | `b16be4d6e3a6d0d7` |  |
| tema34-lote03 | pendiente | 35 | 100 % | 0 | `e6043c354402ca67` |  |
| tema35 | revisado | 150 | 0 % | 0 | `70aba486bdd2dfd3` | sin enlace público |
| tema36-lote01 | pendiente | 78 | 0 % | 0 | `33e5e544a29d04ef` | sin enlace público |
| tema36-lote02 | pendiente | 79 | 0 % | 0 | `65599e0668094088` | sin enlace público |
| tema36-lote03 | pendiente | 78 | 0 % | 0 | `94e284e4be58bdae` | sin enlace público |
| tema36-lote04 | pendiente | 78 | 0 % | 0 | `038d23043505f314` | sin enlace público |
| tema36-lote05 | pendiente | 50 | 0 % | 0 | `3d78a6518fc0e294` | sin enlace público |
| tema36-lote06 | pendiente | 55 | 0 % | 0 | `dec31a096fd4be45` | sin enlace público |
| tema36-lote07 | pendiente | 55 | 0 % | 0 | `48129d076a0c25a4` | sin enlace público |
| tema36-lote08 | pendiente | 55 | 0 % | 0 | `f6a303626f601434` | sin enlace público |
| tema38 | revisado | 198 | 0 % | 0 | `b6cea1fdfc24ec97` | sin enlace público |
| tema39 | revisado | 149 | 0 % | 0 | `968a1cd93a6f265f` | sin enlace público |
| tema40 | revisado | 213 | 0 % | 0 | `d1d2b93c30b34dce` | sin enlace público |
