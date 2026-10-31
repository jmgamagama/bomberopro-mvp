# Auditoría editorial automática de las fichas

Generado con `npm run auditar:fichas` (scripts/auditar-fichas.ts). **No editar a mano.**

Reglas (src/data/recallAudit.ts): campos obligatorios (id, concepto, respuesta, fuente y localización), ids únicos en todo el registro, sin conceptos repetidos, enlaces solo de dominios oficiales, y los mazos sin enlace deben estar declarados.

**Versión** = huella sha256 (16 caracteres) del contenido del mazo. Si cambia una ficha de un mazo **revisado**, el test `recallAudit.test.ts` falla hasta que se regenere este informe. Así cada cambio en contenido publicado queda visible en el diff y hay que revisarlo.

Problemas detectados: **0**.

| Mazo | Revisión | Fichas | Con enlace oficial | Problemas | Versión | Nota |
|---|---|---:|---:|---:|---|---|
| tema1 | revisado | 129 | 100 % | 0 | `685c7d6dbcf833da` |  |
| tema2 | revisado | 121 | 100 % | 0 | `026de90d662228de` |  |
| tema3 | revisado | 66 | 100 % | 0 | `c4552f857057dbfc` |  |
| tema4 | pendiente | 28 | 100 % | 0 | `6e84da2108610bb2` |  |
| tema5 | pendiente | 28 | 100 % | 0 | `fc80511b9650598a` |  |
| tema6 | revisado | 94 | 100 % | 0 | `4fd29b1f6e6f146b` |  |
| tema7 | revisado | 64 | 100 % | 0 | `2bd953ad56a2fdc3` |  |
| tema8 | pendiente | 25 | 100 % | 0 | `5c8331e250016463` |  |
| tema9 | pendiente | 84 | 100 % | 0 | `eb372a5e7f210965` |  |
| tema10 | pendiente | 34 | 100 % | 0 | `735c9bacebb0513f` |  |
| tema10-lote02 | revisado | 13 | 100 % | 0 | `4dbd481541494ac3` |  |
| tema12 | pendiente | 21 | 100 % | 0 | `7ef9bc6244b177a0` |  |
| tema12-lote02 | pendiente | 23 | 100 % | 0 | `dee29796b90e5874` |  |
| tema13 | pendiente | 25 | 100 % | 0 | `1a00973aa68f0f00` |  |
| tema13-lote02 | pendiente | 47 | 100 % | 0 | `fb997e1f468503d0` |  |
| tema14 | pendiente | 24 | 100 % | 0 | `eddcc0cb7906176f` |  |
| tema15 | pendiente | 92 | 100 % | 0 | `49d4b07ff339ed47` |  |
| tema16 | revisado | 48 | 0 % | 0 | `6e058207cb7dd087` | sin enlace público |
| tema16-lote02 | pendiente | 21 | 100 % | 0 | `dc82c612be1668e9` |  |
| tema17 | revisado | 14 | 100 % | 0 | `412a879010d41acc` |  |
| tema20 | pendiente | 24 | 100 % | 0 | `0b4c4913afacc656` |  |
| tema21 | pendiente | 42 | 100 % | 0 | `0d98869be8aec3c7` |  |
| tema21-lote02 | pendiente | 73 | 100 % | 0 | `14c772aff03c5482` |  |
| tema22 | pendiente | 33 | 100 % | 0 | `5e2e70abd6843bc0` |  |
| tema22-lote02 | pendiente | 27 | 100 % | 0 | `5c1bd829625cfc84` |  |
| tema23 | pendiente | 21 | 100 % | 0 | `aa55537b5dd00923` |  |
| tema23-lote02 | pendiente | 23 | 100 % | 0 | `179b5ef08b1938d1` |  |
| tema24 | revisado | 19 | 100 % | 0 | `f51fe2a06a029c0d` |  |
| tema25 | pendiente | 47 | 100 % | 0 | `274647248a13635e` |  |
| tema25-lote02 | pendiente | 68 | 100 % | 0 | `807859d0d52d307a` |  |
| tema26 | pendiente | 60 | 100 % | 0 | `3b47c30a9a7bd1e3` |  |
| tema27 | pendiente | 22 | 100 % | 0 | `9c69d2a21da029c6` |  |
| tema27-lote02 | pendiente | 30 | 100 % | 0 | `bae9f0f2535c226d` |  |
| tema28 | pendiente | 29 | 100 % | 0 | `e98b803ecbc6ed49` |  |
| tema28-lote02 | pendiente | 74 | 100 % | 0 | `307cf0309ca112a2` |  |
| tema29 | pendiente | 81 | 100 % | 0 | `538f7dd425a9125c` |  |
| tema30 | pendiente | 87 | 100 % | 0 | `30ee8e6e235730f1` |  |
| tema31 | revisado | 83 | 100 % | 0 | `8ec0f4305c1c067e` |  |
| tema32 | pendiente | 91 | 100 % | 0 | `9987144bd4168be1` |  |
| tema33 | pendiente | 67 | 100 % | 0 | `a2cb9f71d99bcdfd` |  |
| tema33-lote02 | pendiente | 30 | 100 % | 0 | `0418d3d7fbefab3d` |  |
| tema34-lote01 | revisado | 58 | 100 % | 0 | `a7894a36cab2ce83` |  |
| tema34-lote02 | revisado | 39 | 100 % | 0 | `b16be4d6e3a6d0d7` |  |
| tema34-lote03 | revisado | 35 | 100 % | 0 | `e6043c354402ca67` |  |
| tema35 | revisado | 150 | 0 % | 0 | `c617a5e07121a39c` | sin enlace público |
| tema36-lote01 | pendiente | 78 | 0 % | 0 | `8bdacb7d2ae1b2ec` | sin enlace público |
| tema36-lote02 | pendiente | 80 | 0 % | 0 | `ff4503d4d19f3a0d` | sin enlace público |
| tema36-lote03 | pendiente | 80 | 0 % | 0 | `c8ed72a0d163e3a0` | sin enlace público |
| tema36-lote04 | pendiente | 78 | 0 % | 0 | `038d23043505f314` | sin enlace público |
| tema36-lote05 | pendiente | 50 | 0 % | 0 | `3d78a6518fc0e294` | sin enlace público |
| tema36-lote06 | pendiente | 55 | 0 % | 0 | `dec31a096fd4be45` | sin enlace público |
| tema36-lote07 | pendiente | 55 | 0 % | 0 | `48129d076a0c25a4` | sin enlace público |
| tema36-lote08 | pendiente | 55 | 0 % | 0 | `f6a303626f601434` | sin enlace público |
| tema37 | pendiente | 37 | 0 % | 0 | `3b203830ea5fbedb` | sin enlace público |
| tema38 | revisado | 198 | 0 % | 0 | `b6cea1fdfc24ec97` | sin enlace público |
| tema39 | revisado | 149 | 0 % | 0 | `968a1cd93a6f265f` | sin enlace público |
| tema40 | revisado | 213 | 0 % | 0 | `841cf5d962ed36ce` | sin enlace público |

## Supuestos prácticos

Reglas (src/data/supuestos/supuestosAudit.ts): enunciado, temas de la parte específica (8-40), autoría «original», y en cada pregunta explicación, localización y fuente con enlace oficial (o educativo público admitido solo para fórmulas de física e hidráulica general sin fuente oficial: openstax.org, riunet.upv.es, recursos.edu.xunta.gal); test con 4 opciones distintas y una correcta; cálculo con fórmula y pasos cuya operación se recalcula y coincide con el resultado. Revisión por id en src/data/recallReview.ts (pendiente si no figura).

Problemas detectados: **0**.

| Supuesto | Revisión | Temas | Preguntas | De cálculo | Problemas | Versión |
|---|---|---|---:|---:|---:|---|
| supuesto-t21-ve-01 | pendiente | T21 | 7 | 0 | 0 | `d6516d8552cfbf56` |
| supuesto-t32-vivienda-01 | pendiente | T32, T13 | 9 | 0 | 0 | `d858068759739993` |
| supuesto-t33-agua-01 | pendiente | T33 | 8 | 3 | 0 | `2000548d3cdf08ae` |
| supuesto-t9-hidrostatica-01 | pendiente | T9 | 6 | 4 | 0 | `cf29689716aedba2` |
| supuesto-t9-pascal-arquimedes-01 | pendiente | T9 | 6 | 4 | 0 | `e1700a96fc902da1` |
| supuesto-t9-caudal-01 | pendiente | T9 | 5 | 3 | 0 | `0cf5fb6a1621d64e` |
| supuesto-t9-bernoulli-perdidas-01 | pendiente | T9 | 7 | 4 | 0 | `10ba8497ef3a7f9d` |
| supuesto-t9-descarga-chorro-01 | pendiente | T9 | 5 | 3 | 0 | `ca2589ef1cd6b264` |
| supuesto-t9-bombeo-01 | pendiente | T9 | 6 | 3 | 0 | `7581b50bfa58e1f4` |
| supuesto-t22-poleas-01 | pendiente | T22 | 6 | 3 | 0 | `c56a7365926a0214` |
