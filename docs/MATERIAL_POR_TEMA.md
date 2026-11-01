# Material por tema (esquema y texto oficial): estado de los 40 temas

Actualizado el 01/11/2026. El material se genera con `scripts/generar_material_boe.py scripts/material/temaNN.json`.
Solo usa el texto consolidado del BOE (`scripts/fuente_boe.py`, API de datos abiertos), recortado al epígrafe del
anexo I (BOP de Badajoz n.º 135, 17/07/2026; `data/temario/cpei-badajoz-2026-anexo1.md`). No genera la capa
«desarrollo»: esa capa la redacta una persona. La vigencia se comprueba con `python3 scripts/verificar_vigencia_boe.py`
(resultado en `docs/VIGENCIA_MATERIAL_BOE.md`).

Criterio para generar un tema: su epígrafe cita una norma, o pide algo («hidrantes», «distancias de seguridad en función
de la tensión», «normativa de los EPI»…) que regula una norma concreta con texto consolidado en el BOE. Se genera solo la
parte de la norma que pide el epígrafe. Cuando el epígrafe se apoya en documentos que no están en el BOE consolidado
(normas UNE, DOUE, DOE, BOP, guías del INSST, documentos internos), no se genera nada y se deja anotado abajo.

## Temas con material

| Tema | Norma | Versión BOE | Alcance generado |
|---|---|---|---|
| 1 | Constitución (BOE-A-1978-31229) | 20/05/2026 | piloto: 6 bloques con 3 capas (`scripts/generar_material.py` + redacción revisada). **Ojo:** el BOE publica una actualización del 29/10/2026 (ver más abajo) |
| 2 | Estatuto de Autonomía de Extremadura (BOE-A-2011-1638) | 30/10/2026 | Tít. Preliminar, I y II (arts. 1–48) |
| 3 | LBRL (BOE-A-1985-5392) | 05/10/2026 | Tít. III, organización y competencias (arts. 31–38) |
| 6 | LPRL (BOE-A-1995-24292) | 23/10/2026 | caps. I–IV (arts. 1–32 bis) |
| 7 | Ley 8/2011 de Extremadura (BOE-A-2011-6651) | 19/12/2025 | Tít. Preliminar, Tít. II y Tít. IV cap. II |
| 10 | RIPCI, RD 513/2017 (BOE-A-2017-6606) | 19/12/2025 | anexo I secc. 1.ª apdos. 2, 3, 5 y 6 (abastecimiento de agua, hidrantes, BIE, columna seca) |
| 12 | RIPCI, RD 513/2017 (BOE-A-2017-6606) | 19/12/2025 | anexo I secc. 1.ª apdo. 4 (extintores: clasificación, emplazamiento y distribución) |
| 13 | RD 773/1997, EPI (BOE-A-1997-12735) | 18/12/2025 | arts. 1–10 y anexos I–IV |
| 22 | RD 1215/1997 (BOE-A-1997-17824) | 18/12/2025 | anexo II apdo. 4, trabajos temporales en altura (RD 2177/2004) |
| 25 | RD 97/2014, mercancías peligrosas por carretera (BOE-A-2014-2110) | 26/06/2026 | cap. I (arts. 1–3) y cap. IV, actuación en caso de avería o accidente (arts. 20–23) |
| 28 | RD 614/2001, riesgo eléctrico (BOE-A-2001-11881) | 18/12/2025 | arts. 1–6 y anexos I–VI (definiciones y distancias, trabajos sin/en tensión, maniobras, proximidad, emplazamientos con riesgo de incendio o explosión) |
| 31 | RD 1215/1997 (BOE-A-1997-17824) | 18/12/2025 | completo, con anexos I y II |
| 32 | CTE, RD 314/2006 (BOE-A-2006-5515) | 18/12/2025 | Parte I: arts. 1–2 (objeto y ámbito), 11 (SI 1–6) y 12 (SUA 1–9) |
| 33 | RIPCI, RD 513/2017 (BOE-A-2017-6606) | 19/12/2025 | arts. 1–2 y anexo I secc. 1.ª apdos. 2, 3, 5 y 6 |
| 34 | RD 164/2025 (BOE-A-2025-7190) | 20/12/2025 | completo, con anexos I–V |

## Lo que falta en los temas con material (no se inventa)

- **T10, T12:** el agua, lanzas, mangueras y monitor (T10), y las normas UNE-EN 3-7 y UNE-EN 1866-1 (T12), no son normas del BOE.
- **T13:** el Reglamento (UE) 2016/425 está en el DOUE, no en el BOE consolidado. Las normas UNE de EPI de bomberos y las guías del INSST no son normas.
- **T25:** la clasificación, los códigos de peligro y las etiquetas están en el ADR. El BOE lo publica como texto enmendado de los anejos A y B (p. ej. BOE-A-2025-77), sin versión consolidada en la API. Las fichas del tema citan el ADR, así que «Ver en el esquema» abre el tema sin resaltar.
- **T28:** la parte de redes de baja tensión, acometidas e instalaciones de enlace está en el REBT (RD 842/2002, BOE-A-2002-18099, consolidado), y la de alta tensión en el RD 337/2014 y el RD 223/2008. No se han generado porque el material de un tema admite hoy una sola norma: los anclajes del BOE (#a1…) chocarían entre normas en `materialPreceptos.ts`. Hay que añadir antes el identificador BOE a cada bloque. Queda como siguiente paso.
- **T32:** los documentos básicos DB SI y DB SUA (SI 4, SI 5, SUA 4, SUA 7) son la Parte II del CTE. El texto consolidado del BOE solo los cita, y su texto está en el portal del CTE (codigotecnico.org). Solo se ha generado la Parte I.

## Temas sin material porque su epígrafe no se apoya en una norma consolidada del BOE

| Tema | Por qué |
|---|---|
| 4 | Estructura orgánica de la Diputación de Badajoz: el epígrafe no cita norma y no hay ninguna en el BOE consolidado (es organización provincial). |
| 5 | Organigrama y Reglamento de Régimen Interno del CPEI: BOP de Badajoz (`data/fuentes/BOP-BA-2012-5370`), no en el BOE. |
| 8, 9, 11 | Teoría del fuego, hidráulica y espumas: contenido técnico sin norma (las UNE no son del BOE). |
| 14 | Vehículos contra incendios: normas UNE-EN 1846, no BOE. |
| 15, 16 | Material de rescate y comunicaciones: técnico; el código ICAO no es una norma del BOE. |
| 17, 18 | Socorrismo e incendios estructurales: técnico. |
| 19 | Excluido por encargo. |
| 20, 21, 23 | Incendios forestales, accidentes de tráfico e inundaciones: el epígrafe no cita norma (contenido técnico y operativo). |
| 24 | Himenópteros: pide «marco legal» sin citar norma; no se elige una por nuestra cuenta (la vespa velutina figura en el Catálogo de especies exóticas invasoras, RD 630/2013, pero el epígrafe no lo dice). Pendiente de que JM confirme. |
| 26 | Guías INSARAG (ONU): no es una norma del BOE. |
| 27 | Construcción y patología: técnico. |
| 29, 30 | PLATERCAEX y planes especiales de la CAEX: decretos publicados en el DOE, sin API de texto consolidado. |
| 35–40 | Ver la sección siguiente. |

## Temas 35-40 sin esquema generado (no se inventa nada)

- **T35 · Red de carreteras de Extremadura (provincia de Badajoz).**
  - El epígrafe no cita ninguna norma: remite al mapa de la Junta (ciudadano.gobex.es).
  - El catálogo vigente es el **Decreto 98/2008**, de 23 de mayo, por el que se aprueba el nuevo Catálogo de las Carreteras de titularidad de la Junta de Extremadura. Se publicó en el DOE n.º 103, de 29/05/2008: https://doe.juntaex.es/pdfs/doe/2008/1030o/08040108.pdf (HTTP 200, PDF de 7 páginas).
  - El DOE no tiene API de texto consolidado, así que no se puede comprobar si hay modificaciones posteriores. Además, el catálogo es una tabla en PDF.
  - Tampoco está identificado el catálogo de la red provincial de la Diputación de Badajoz.
  - Se enlaza el PDF del DOE como fuente. Para hacer el esquema hace falta que JM confirme las normas que valen (Decreto 98/2008, Ley 37/2015 y el catálogo provincial) y extraer las tablas con revisión humana.
- **T38 · ITF del CPEI.** Fuera de este encargo. Son PDF internos sin publicación oficial.
- **T39 · Sistemáticas y protocolos.**
  - El Protocolo de movilización (con el de radiocomunicaciones) está publicado en el BOP de Badajoz n.º 224, anuncio 4899/2025, del 24/11/2025: https://www.dip-badajoz.es/ficheros/bop/bopedictos/2025-11-24000000_4899.pdf (HTTP 200).
  - El BOP no está en el BOE ni en el DOE, así que este método no lo cubre. Se enlaza como fuente.
  - El «Manual software de navegación S.O.S. Profesional» no tiene publicación oficial localizada.
- **T40 · Procedimientos de trabajo (PT01 conducción, PT03 amianto).** Son documentos internos del CPEI (PDF firmados) sin publicación oficial localizada. No hay enlace ni esquema.

## Constitución (T1): actualización del BOE pendiente

La API del BOE da para BOE-A-1978-31229 `fecha_actualizacion` 29/10/2026, y el material del T1 se generó con la del
20/05/2026. El T1 es el piloto con desarrollo redactado a mano y queda fuera de esta pieza, así que no se ha regenerado.
Hay que revisar qué cambió y regenerarlo con `scripts/generar_material.py`, con revisión humana del desarrollo.
