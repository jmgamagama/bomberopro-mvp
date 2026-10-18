# Revisión humana de los mazos de recuerdo

El alumno solo ve publicados los mazos con **revisión humana completa** (`revision: 'revisado'`).
Los demás quedan **«pendiente de revisión»**: no aparecen en Recuerdo, la Sesión diaria, la
bienvenida, el tema prioritario ni las estadísticas del alumno.

- Estado por mazo: `src/data/recallReview.ts` (`REVIEWED_DECKS`; lo que no figura ahí es `pendiente`).
  Cada `RecallDeck` del registro y cada `RecallCard` llevan su campo `revision`.
- Filtro: `getVisibleDecks/Topics/Bloques/TotalCards` en `src/data/recallRegistry.ts`; `getAccessibleDecks`
  y `canAccessTopic` (plan) también excluyen los pendientes. Un tema con lotes mixtos solo muestra sus lotes revisados.

## Criterio

- **revisado**: los temas 35, 38, 39 y 40 (decisión del propietario) y los mazos cuyo informe de
  calidad indica que se revisaron a mano **todas** sus fichas (muestra = total).
- **pendiente**: el informe solo revisó una muestra (normalmente 20 fichas) o, como en el tema 36,
  solo hay comprobaciones automáticas. El tema 33 revisó a mano además sus 23 fichas numéricas,
  pero no las 67: sigue pendiente.

## Quién ve los pendientes (`src/utils/revisionAccess.ts`)

1. **Propietario**: la cuenta con sesión (la misma que `setProgressOwner` en `App.tsx`) cuyo `id` o
   `email` figure en `VITE_REVISION_OWNERS` (lista separada por comas, fijada en el build). Vacía por
   defecto: el repo no guarda el id ni el email de jmgamagama; hay que configurarlo en Vercel.
2. **Admin**: build con `VITE_FEATURE_REVISION_ADMIN=true` (p. ej. una preview interna). No usar en producción.
3. **Solo en `vite dev`**: `localStorage.mira_revision_admin_v1 = '1'`. En un build de producción se ignora.

Es un filtro de interfaz, no un control de acceso: las fichas pendientes siguen en el bundle JS.

## Estado por mazo

Visibles para el alumno: **804** de 3402 fichas.

| Mazo | Fichas | Estado | Visibles alumno | Motivo | Informe |
|---|---:|---|---:|---|---|
| `tema1` | 129 | pendiente | 0 | muestra de 20 de 129 revisada a mano | `/workspace/tema01_calidad.md` |
| `tema2` | 121 | pendiente | 0 | muestra de 20 de 121 revisada a mano | `/workspace/tema02_calidad.md` |
| `tema3` | 66 | pendiente | 0 | muestra de 20 de 66 revisada a mano | `/workspace/tema03_calidad.md` |
| `tema4` | 28 | pendiente | 0 | muestra de 20 de 28 revisada a mano | `/workspace/tema04_calidad.md` |
| `tema5` | 28 | pendiente | 0 | muestra de 20 de 28 revisada a mano | `/workspace/tema05_calidad.md` |
| `tema6` | 94 | pendiente | 0 | muestra de 20 de 94 revisada a mano | `/workspace/tema06_calidad.md` |
| `tema7` | 64 | pendiente | 0 | muestra de 20 de 64 revisada a mano | `/workspace/tema07_calidad.md` |
| `tema8` | 25 | pendiente | 0 | muestra de 20 de 25 revisada a mano | `/workspace/tema08_calidad.md` |
| `tema9` | 84 | pendiente | 0 | 84/84 revisadas a mano por el autor; falta revisión humana | `data/tema09/tema09_calidad.md` |
| `tema10` | 34 | pendiente | 0 | muestra de 20 de 34 revisada a mano | `/workspace/tema10_calidad.md` |
| `tema10-lote02` | 13 | revisado | 13 | 13/13 revisadas a mano | `/workspace/tema10_lote02_calidad.md` |
| `tema12` | 21 | pendiente | 0 | muestra de 20 de 21 revisada a mano | `/workspace/tema12_calidad.md` |
| `tema12-lote02` | 23 | pendiente | 0 | muestra de 20 de 23 revisada a mano | `/workspace/tema12_lote02_calidad.md` |
| `tema13` | 25 | pendiente | 0 | muestra de 20 de 25 revisada a mano | `/workspace/tema13_calidad.md` |
| `tema13-lote02` | 47 | pendiente | 0 | muestra de 20 de 47 revisada a mano, 0 errores (huecos CEP, INSST) | `/workspace/tema13_lote02_calidad.md` |
| `tema14` | 24 | pendiente | 0 | muestra de 20 de 24 revisada a mano | `/workspace/tema14_calidad.md` |
| `tema15` | 92 | pendiente | 0 | muestra de 20 de 92 revisada a mano, 0 errores (huecos CEP: INSST, RD 1644/2008, RD 1215/1997, ITC-BT-40) | `/workspace/tema15_calidad.md` |
| `tema16` | 48 | revisado | 48 | 48/48 revisadas ficha a ficha | `/workspace/tema16_calidad.md` |
| `tema16-lote02` | 21 | pendiente | 0 | muestra de 20 de 21 revisada a mano | `/workspace/tema16_lote02_calidad.md` |
| `tema17` | 14 | revisado | 14 | 14/14 revisadas a mano | `/workspace/tema17_calidad.md` |
| `tema20` | 24 | pendiente | 0 | muestra de 20 de 24 revisada a mano | `/workspace/tema20_calidad.md` |
| `tema21` | 42 | pendiente | 0 | muestra de 20 de 42 revisada a mano | `/workspace/tema21_calidad.md` |
| `tema21-lote02` | 73 | pendiente | 0 | muestra de 20 de 73 revisada a mano, 0 errores (huecos CEP, manual DGT) | `/workspace/tema21_lote02_calidad.md` |
| `tema22` | 33 | pendiente | 0 | muestra de 20 de 33 revisada a mano | `/workspace/tema22_calidad.md` |
| `tema22-lote02` | 27 | pendiente | 0 | muestra de 20 de 27 revisada a mano | `/workspace/tema22_lote02_calidad.md` |
| `tema23` | 21 | pendiente | 0 | muestra de 20 de 21 revisada a mano | `/workspace/tema23_calidad.md` |
| `tema23-lote02` | 23 | pendiente | 0 | 23 de 23 cotejadas con el texto oficial en dos pasadas, 0 errores; falta la revisión del propietario (áreas inundables: RDPH, RD 903/2010 y Directriz 2026) | `data/tema23/tema23_lote02_calidad.md` |
| `tema24` | 19 | revisado | 19 | 19/19 revisadas a mano | `/workspace/tema24_calidad.md` |
| `tema25` | 47 | pendiente | 0 | muestra de 20 de 47 revisada a mano | `/workspace/tema25_calidad.md` |
| `tema25-lote02` | 68 | pendiente | 0 | 68 de 68 cotejadas con la imagen de la página del BOE por el agente, 0 errores; falta la revisión del propietario (clasificación ADR, caps. 2.1 y 2.2) | `data/tema25/tema25_lote02_calidad.md` |
| `tema26` | 60 | pendiente | 0 | muestra de 20 de 60 revisada a mano | `/workspace/tema26_calidad.md` |
| `tema27` | 22 | pendiente | 0 | muestra de 20 de 22 revisada a mano | `/workspace/tema27_calidad.md` |
| `tema27-lote02` | 30 | pendiente | 0 | 30 de 30 cotejadas con el texto oficial en dos pasadas, 0 errores; falta la revisión del propietario (respuesta al fuego: DB SI y RD 842/2013) | `data/tema27/tema27_lote02_calidad.md` |
| `tema28` | 29 | pendiente | 0 | muestra de 20 de 29 revisada a mano | `/workspace/tema28_calidad.md` |
| `tema28-lote02` | 74 | pendiente | 0 | muestra de 20 de 74 revisada a mano, 0 errores (huecos CEP 38: REBT, RD 337/2014, RD 614/2001, NTP 400) | `/workspace/tema28_lote02_calidad.md` |
| `tema29` | 81 | pendiente | 0 | muestra de 20 de 81 revisada a mano | `/workspace/tema29_calidad.md` |
| `tema30` | 87 | pendiente | 0 | muestra de 20 de 87 revisada a mano | `/workspace/tema30_calidad.md` |
| `tema31` | 83 | pendiente | 0 | muestra de 20 de 83 revisada a mano | `/workspace/tema31_calidad.md` |
| `tema32` | 91 | pendiente | 0 | muestra de 20 de 91 revisada a mano | `/workspace/tema32_calidad.md` |
| `tema33` | 67 | pendiente | 0 | muestra de 20 de 67 revisada a mano | `/workspace/tema33_calidad.md` |
| `tema33-lote02` | 30 | pendiente | 0 | 30 de 30 cotejadas con el texto oficial en dos pasadas, 0 errores; falta la revisión del propietario (mantenimiento PCI: RIPCI anexo II y RD 809/2021) | `data/tema33/tema33_lote02_calidad.md` |
| `tema34-lote01` | 58 | pendiente | 0 | muestra de 20 de 58 revisada a mano | `/workspace/tema34_lote01_calidad.md` |
| `tema34-lote02` | 39 | pendiente | 0 | muestra de 20 de 39 revisada a mano | `/workspace/tema34_lote02_calidad.md` |
| `tema34-lote03` | 35 | pendiente | 0 | muestra de 20 de 35 revisada a mano | `/workspace/tema34_lote03_calidad.md` |
| `tema35` | 150 | revisado | 150 | decisión del propietario | `/workspace/tema35_calidad.md` |
| `tema36-lote01` | 78 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_calidad.md` |
| `tema36-lote02` | 79 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_lote02_calidad.md` |
| `tema36-lote03` | 78 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_lote03_calidad.md` |
| `tema36-lote04` | 78 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_lote04_calidad.md` |
| `tema36-lote05` | 50 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_lote05_calidad.md` |
| `tema36-lote06` | 55 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_lote06_calidad.md` |
| `tema36-lote07` | 55 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_lote07_calidad.md` |
| `tema36-lote08` | 55 | pendiente | 0 | solo comprobación automática (sin revisión manual ficha a ficha) | `/workspace/tema36_lote08_calidad.md` |
| `tema38` | 198 | revisado | 198 | decisión del propietario | `/workspace/tema38_cambios.md` |
| `tema39` | 149 | revisado | 149 | decisión del propietario | `/workspace/tema39_cambios.md` |
| `tema40` | 213 | revisado | 213 | decisión del propietario | `/workspace/tema40_validacion.md` |

Para publicar un mazo: revisar a mano todas sus fichas, dejarlo constar en su informe de calidad y
añadirlo a `REVIEWED_DECKS` (el test `src/data/recallReview.test.ts` fija la lista y el total).

## Supuestos prácticos

Los supuestos (`src/data/supuestos/`) siguen la misma regla: cada id pasa por `getDeckRevision` y, mientras no
figure en `REVIEWED_DECKS`, es **pendiente**. El alumno no los ve y la entrada «Supuestos» («Casos» en el móvil)
no aparece en su menú. El contenido va en un chunk aparte que también viaja en el build: es un filtro de interfaz.

| Supuesto | Preguntas | Estado | Motivo |
|---|---:|---|---|
| `supuesto-t21-ve-01` | 7 | pendiente | caso original nuevo, sin revisión humana (manual DGT) |
| `supuesto-t32-vivienda-01` | 9 | pendiente | caso original nuevo, sin revisión humana (CTE DB SI 5, INSST) |
| `supuesto-t33-agua-01` | 8 | pendiente | caso original nuevo, sin revisión humana (RIPCI); 3 cálculos |

Para publicar un supuesto: revisar a mano cada pregunta contra su fuente y añadir su id a `REVIEWED_DECKS`.

