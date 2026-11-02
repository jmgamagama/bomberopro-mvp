# Temas «En preparación» y apertura del T37 (01/11/2026, rama feat/t37-abrir)

`getTemasEnPreparacion()` (src/data/recallRegistry.ts) lista los temas 1-40 sin ningún mazo visible para un alumno
(sin cuenta de propietario ni de administrador de revisión). Tras Merge 38 (handoff b1a16eb) salían **7 temas**;
con esta rama salen **6**.

| Tema | Epígrafe | Mazo(s) | Por qué no se ve | Qué haría falta |
| --- | --- | --- | --- | --- |
| 5 | Reglamento de Régimen Interno del CPEI | `tema5` (28, pendiente) | El BOP nº 145 de 01/08/2022 (anuncio 3393/2022) solo publica la exposición pública de una modificación del RRI, sin texto; no consta aprobación definitiva publicada (revisados los BOP de 02/08 a 31/12/2022). Fuente de las fichas: texto único del RRI, BOP nº 149 de 06/08/2012, anuncio 5370/2012 (`data/fuentes/BOP-BA-2012-5370`); no se sabe si la modificación de 2022 llegó a aprobarse y cambia algún artículo. | Que José consiga el texto vigente del RRI (enlace oficial o BOP con la aprobación definitiva de la modificación) o decida aceptar el texto de 2012 como vigente. |
| 11 | Instalaciones de extinción con espuma | — | No hay fichas ni fuente oficial o aceptada localizada en el repo para este epígrafe. | Aceptar una fuente (manual con permiso escrito o documento técnico oficial gratuito) y crear el mazo. |
| 18 | Incendios estructurales | — | No hay fichas: solo en manuales (CPEI, CCOO, CEIS Guadalajara) sin permiso por escrito guardado (docs/PERMISOS_FUENTES.md). | Guardar la autorización por escrito del titular o aceptar otra fuente oficial gratuita. |
| 19 | Incendios industriales | — | Excluido por encargo. | — (no se toca). |
| 21 | Accidentes de tráfico y excarcelación | `tema21` (42), `tema21-lote02` (73), pendientes | Manual de la DGT-APRAT (2019): no es BOE/DOE/BOP ni fuente aceptada; `tema21` solo tiene muestra de 20 de 42 revisada. | Decisión de José: aceptar el «Manual básico de rescate en accidentes de tráfico» (DGT, NIPO 128-19-003-4) como fuente oficial, igual que INSST/INSARAG. Con eso se cotejarían al literal como en T26. |
| 25 | Mercancías peligrosas (ADR) | `tema25` (47), `tema25-lote02` (68), pendientes | ADR (BOE-A-2009-5490 y siguientes) sin texto consolidado en boe.es: no se puede comprobar su «última actualización publicada»; el lote 02 está cotejado con la imagen del BOE pero falta la revisión del propietario (clasificación ADR, caps. 2.1 y 2.2). El RD 97/2014 (BOE-A-2014-2110) sí tiene consolidado. | Decisión de José: qué edición del ADR vale como vigente (BOE de la enmienda en vigor o la publicación del Ministerio) o revisar él el lote 02. Alternativa sin decisión: rehacer fichas solo del RD 97/2014 (no se ha hecho aquí: sería contenido nuevo). |
| ~~37~~ | Plan de prevención del CPEI-Badajoz | `tema37` (37) | **Abierto en esta rama** (ver abajo). | El «mapa descargable» del epígrafe no aparece en el BOP. |

Mazos sueltos que siguen ocultos dentro de temas ya visibles (no salen «En preparación» porque el tema tiene otro
mazo publicado): `tema9` (17 de 84 visibles; las 11 de la NTP 362 siguen ocultas, ver docs/REVISION_INSST_LOTES_2026-11-02.md), `tema16-lote02`
(sin cotejar; `tema12-lote02`, `tema13-lote02`, `tema22-lote02` y las 23 INSST de T8 se abren el 02/11/2026 en feat/insst-lotes), `tema15` (36 + 56 INSST según
recallCardReview.ts) y las fichas «fuera del epígrafe» de T26, T33, T35, T36, T38 y T39.

## T37: por qué se elige y qué se ha hecho

- Es de los temas 35-40 (30 % del examen) y el único de ellos aún en preparación.
- Fuente: Plan de prevención de riesgos laborales del CPEI, **aprobación definitiva publicada en el BOP de Badajoz
  nº 117, de 22/06/2026, anuncio 2242/2026**. Boletín oficial, el mismo tipo de fuente ya usada en T4 (BOP nº 206/2025).
  El PDF publicado (https://www.dip-badajoz.es/ficheros/bop/bopedictos/2026-06-22000000_2242.pdf) se descargó el
  01/11/2026 y es idéntico byte a byte (SHA-256 `8fba5670…adfa30c2`) a `data/fuentes/BOP-BA-2026-2242/anuncio.pdf`.
  No hay versión posterior: es la aprobación definitiva de junio de 2026.
- Cotejo: `python3 scripts/verificar-t37-bop.py --online` (solo lectura) exige que cada respuesta esté entera y
  seguida en la página citada. Resultado: **37 de 37**. Además se leyó cada ficha a mano frente a su párrafo:
  - CPEI-T37-L01-4660EB2EC9 y A597CC01FF (parques de cada PRA): la respuesta se cortaba en el primer parque; se
    completa con la fila literal de la tabla («… Parque Puebla de la Calzada Parque Alburqueque» —errata del BOP— y
    «… Parque Castuera Parque Herrera del Duque»).
  - CPEI-T37-L01-423B47B0B7 (autorización de uso de equipos): la respuesta acababa en «por parte del Jefe/a de» y no
    decía quién autoriza. Se sustituye por la función literal del Jefe/a de Servicio de Formación (pág. 15): «Comunicar
    al oficial … proceda a la autorización del uso del equipo de trabajo por parte del trabajador.»
  - CPEI-T37-L01-67FF18856D: se completa hasta «último recurso preventivo que adoptarán las personas trabajadoras».
  - CPEI-T37-L01-91DD951A0A: la pregunta decía «encabeza»; pasa a «¿Qué parque consorciado forma parte de la zona 4?».
  - Las erratas del original («almenos», «fuciones», «nombramieno») se mantienen por ser cita literal.
- Resultado: `tema37` pasa a «revisado» (recallReview.ts y recallReviewMotivos.ts). Fichas visibles: 2.700 → **2.737**.
  Test nuevo: src/data/tema37Recall.test.ts.
