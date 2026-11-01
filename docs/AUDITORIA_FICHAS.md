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
| tema4 | revisado | 28 | 100 % | 0 | `6e84da2108610bb2` |  |
| tema5 | pendiente | 28 | 100 % | 0 | `fc80511b9650598a` |  |
| tema6 | revisado | 94 | 100 % | 0 | `4fd29b1f6e6f146b` |  |
| tema7 | revisado | 64 | 100 % | 0 | `2bd953ad56a2fdc3` |  |
| tema8 | revisado | 25 | 100 % | 0 | `775feee7881687b1` |  |
| tema9 | pendiente | 84 | 100 % | 0 | `481d0a4b586c9b6e` |  |
| tema10 | revisado | 34 | 100 % | 0 | `f52036b2833262cf` |  |
| tema10-lote02 | revisado | 13 | 100 % | 0 | `4dbd481541494ac3` |  |
| tema12 | revisado | 21 | 100 % | 0 | `6cdecd270c4079b5` |  |
| tema12-lote02 | pendiente | 23 | 100 % | 0 | `dee29796b90e5874` |  |
| tema13 | revisado | 25 | 100 % | 0 | `876e7cc074a4b819` |  |
| tema13-lote02 | pendiente | 47 | 100 % | 0 | `fb997e1f468503d0` |  |
| tema14 | revisado | 24 | 100 % | 0 | `21120d7cc971c334` |  |
| tema15 | pendiente | 92 | 100 % | 0 | `17289f984caed4f2` |  |
| tema16 | revisado | 48 | 0 % | 0 | `6e058207cb7dd087` | sin enlace público |
| tema16-lote02 | pendiente | 21 | 100 % | 0 | `dc82c612be1668e9` |  |
| tema17 | revisado | 14 | 100 % | 0 | `412a879010d41acc` |  |
| tema20 | revisado | 24 | 100 % | 0 | `0b4c4913afacc656` |  |
| tema21 | pendiente | 42 | 100 % | 0 | `0d98869be8aec3c7` |  |
| tema21-lote02 | pendiente | 73 | 100 % | 0 | `14c772aff03c5482` |  |
| tema22 | revisado | 33 | 100 % | 0 | `4a7fbc8f71edcd76` |  |
| tema22-lote02 | pendiente | 27 | 100 % | 0 | `5c1bd829625cfc84` |  |
| tema23 | revisado | 21 | 100 % | 0 | `4c6f711686cc4600` |  |
| tema23-lote02 | revisado | 23 | 100 % | 0 | `e103c613e915b985` |  |
| tema24 | revisado | 19 | 100 % | 0 | `664efe61a3312d95` |  |
| tema25 | pendiente | 47 | 100 % | 0 | `274647248a13635e` |  |
| tema25-lote02 | pendiente | 68 | 100 % | 0 | `807859d0d52d307a` |  |
| tema26 | revisado | 60 | 100 % | 0 | `3b47c30a9a7bd1e3` |  |
| tema27 | revisado | 22 | 100 % | 0 | `9c69d2a21da029c6` |  |
| tema27-lote02 | revisado | 30 | 100 % | 0 | `bae9f0f2535c226d` |  |
| tema28 | revisado | 29 | 100 % | 0 | `e559867e765bc635` |  |
| tema28-lote02 | revisado | 74 | 100 % | 0 | `b3bfdb127ded0df4` |  |
| tema29 | revisado | 81 | 100 % | 0 | `538f7dd425a9125c` |  |
| tema30 | revisado | 87 | 100 % | 0 | `30ee8e6e235730f1` |  |
| tema31 | revisado | 83 | 100 % | 0 | `8ec0f4305c1c067e` |  |
| tema32 | revisado | 91 | 100 % | 0 | `3bfb92cf5edc7674` |  |
| tema33 | revisado | 67 | 100 % | 0 | `a2cb9f71d99bcdfd` |  |
| tema33-lote02 | revisado | 30 | 100 % | 0 | `77e12ce543806e65` |  |
| tema34-lote01 | revisado | 58 | 100 % | 0 | `76aba034b055485a` |  |
| tema34-lote02 | revisado | 39 | 100 % | 0 | `68e2bb75aee5d96b` |  |
| tema34-lote03 | revisado | 35 | 100 % | 0 | `4dcbf919cfd72248` |  |
| tema35 | revisado | 150 | 0 % | 0 | `c617a5e07121a39c` | sin enlace público |
| tema36-lote01 | pendiente | 78 | 0 % | 0 | `04f5dd8c7594fdf6` | sin enlace público |
| tema36-lote02 | pendiente | 80 | 0 % | 0 | `ff4503d4d19f3a0d` | sin enlace público |
| tema36-lote03 | pendiente | 80 | 0 % | 0 | `c8ed72a0d163e3a0` | sin enlace público |
| tema36-lote04 | pendiente | 78 | 0 % | 0 | `038d23043505f314` | sin enlace público |
| tema36-lote05 | pendiente | 50 | 0 % | 0 | `3d78a6518fc0e294` | sin enlace público |
| tema36-lote06 | pendiente | 55 | 0 % | 0 | `dec31a096fd4be45` | sin enlace público |
| tema36-lote07 | pendiente | 55 | 0 % | 0 | `48129d076a0c25a4` | sin enlace público |
| tema36-lote08 | pendiente | 55 | 0 % | 0 | `f6a303626f601434` | sin enlace público |
| tema37 | revisado | 37 | 0 % | 0 | `6d0345414c1918e5` | sin enlace público |
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
