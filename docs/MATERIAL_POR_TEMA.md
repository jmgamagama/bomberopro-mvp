# Material de estudio por tema: cobertura, capas y fuentes

Actualizado el 03/11/2026. El material se genera con `scripts/generar_material_boe.py scripts/material/temaNN.json`.
Usa el texto consolidado del BOE (para T7, acompañado por la publicación original en el DOE; y, desde el 01/11/2026, por los PDF oficiales de T20, T29 y T30: `docs/MATERIAL_DOE.md`) (`scripts/fuente_boe.py`: API de datos abiertos para vigencia y página consolidada oficial para su fecha publicada), recortado al epígrafe del
anexo I (BOP de Badajoz n.º 135, 17/07/2026; `data/temario/cpei-badajoz-2026-anexo1.md`). El generador no crea la capa
«desarrollo»; se añade solo cuando una persona la redacta y revisa. La vigencia se comprueba con `python3 scripts/verificar_vigencia_boe.py`
(resultado en `docs/VIGENCIA_MATERIAL_BOE.md`).

Criterio para generar un tema: su epígrafe cita una norma, o pide algo («hidrantes», «distancias de seguridad en función
de la tensión», «normativa de los EPI»…) que regula una norma concreta con texto consolidado en el BOE. Se genera solo la
parte de la norma que pide el epígrafe. Cuando el epígrafe se apoya en documentos que no están en el BOE consolidado
(normas UNE, DOUE, DOE, BOP, guías del INSST, documentos internos), no se genera nada y se deja anotado abajo.

## Capas y cobertura actual

La app organiza el estudio en **Esquema → Desarrollo → Texto oficial**, además de enlazar y permitir descargar la fuente oficial. El tercer panel contiene un extracto literal limitado al epígrafe del temario; no equivale al texto íntegro de la norma. La norma íntegra se ofrece por separado cuando está disponible.

A 03/11/2026 hay material registrado para **18 de los 40 temas**. El Tema 1 es el único con las tres capas en sus seis bloques; los otros 17 tienen esquema y extracto normativo, pero todavía no desarrollo registrado en la app. Hay 51 borradores de desarrollo, pendientes de revisión humana, distribuidos entre T2 (6), T3 (2), T6 (4), T7 (3), T10 (1), T12 (1), T13 (1), T20 (4), T22 (1), T25 (2), T28 (6), T29 (4), T31 (3), T32 (3), T33 (2) y T34 (8). Los borradores cubren alcances parciales y no se computan como capas publicadas. Los 22 temas restantes están pendientes de material estructurado por las razones documentales que se detallan abajo.

El Tema 1 sirve como patrón de secuencia pedagógica y desglose por artículos. Se ha afinado la tercera capa para que contenga solo norma literal: las preguntas de repaso pertenecen al estudio de conceptos y no deben mezclarse con una fuente jurídica. El estándar ampliado está en [ESTANDAR_MATERIAL_TEMAS.md](ESTANDAR_MATERIAL_TEMAS.md).

## Temas con material

| Tema | Norma | Versión BOE | Alcance generado |
|---|---|---|---|
| 1 | Constitución (BOE-A-1978-31229) | 20/05/2026 | piloto: 6 bloques con 3 capas (`scripts/generar_material.py` + redacción revisada) |
| 2 | Estatuto de Autonomía de Extremadura (BOE-A-2011-1638) | 29/01/2011 | Tít. Preliminar, I y II (arts. 1–48) |
| 3 | LBRL (BOE-A-1985-5392) | 03/10/2026 | Tít. III, organización y competencias (arts. 31–38) |
| 6 | LPRL (BOE-A-1995-24292) | 09/04/2026 | caps. I–IV (arts. 1–32 bis) |
| 7 | Ley 8/2011 de Extremadura (DOE n.º 59; BOE-A-2011-6651) | 25/03/2011 (publicación original DOE y última actualización consolidada BOE) | Tít. Preliminar, Tít. II y Tít. IV cap. II |
| 10 | RIPCI, RD 513/2017 (BOE-A-2017-6606) | 03/09/2025 | anexo I secc. 1.ª apdos. 2, 3, 5 y 6 (abastecimiento de agua, hidrantes, BIE, columna seca) |
| 12 | RIPCI, RD 513/2017 (BOE-A-2017-6606) | 03/09/2025 | anexo I secc. 1.ª apdo. 4 (extintores: clasificación, emplazamiento y distribución) |
| 13 | RD 773/1997, EPI (BOE-A-1997-12735) | 08/12/2021 | arts. 1–10 y anexos I–IV |
| 20 | Plan INFOEX, Decreto 132/2022 (DOE-2022040193, texto consolidado del DOE) | DOE, últ. modif. 05/11/2024; comprobado a mano el 01/11/2026 | caps. II–VII (arts. 4–20). El epígrafe no cita norma: se genera la que citan las fichas del tema. Ver `docs/MATERIAL_DOE.md` |
| 22 | RD 1215/1997 (BOE-A-1997-17824) | 13/11/2004 | anexo II apdo. 4, trabajos temporales en altura (RD 2177/2004) |
| 25 | RD 97/2014, mercancías peligrosas por carretera (BOE-A-2014-2110) | 04/12/2024 | cap. I (arts. 1–3) y cap. IV, actuación en caso de avería o accidente (arts. 20–23) |
| 28 | RD 614/2001, riesgo eléctrico (BOE-A-2001-11881) | 21/06/2001 | arts. 1–6 y anexos I–VI (definiciones y distancias, trabajos sin/en tensión, maniobras, proximidad, emplazamientos con riesgo de incendio o explosión). **+ REBT, RD 842/2002 (BOE-A-2002-18099), 03/09/2025**, baja tensión, acometidas e instalaciones de enlace: Reglamento arts. 4, 8 y 15; ITC-BT-06, 07, 08 y 11; ITC-BT-12 a 17. Sin alta tensión (RD 337/2014, RD 223/2008) |
| 29 | PLATERCAEX, Decreto 187/2019 (DOE-2019040203; texto del plan en el PDF oficial de la Junta, al que remite el decreto) | PDF de 31/01/2020; comprobado a mano el 01/11/2026 | caps. I (I.1–I.2), IV (IV.1–IV.3.5) y V (V.1–V.5) |
| 30 | INUNCAEX, Decreto 39/2025 (DOE-2025040069); TRANSCAEX, Decreto 189/2019 (DOE-2019040205); RADIOCAEX, Decreto 200/2019 (DOE-2019040206); PLASISMEX, Decreto 127/2009 (DOE-2009040140). Texto de cada plan en el PDF oficial de la Junta | comprobado a mano el 01/11/2026 | definición y objetivos, estructura y organización, operatividad de cada plan (INUNCAEX cap. I §2, IV y V; TRANSCAEX 1.1–1.2, 4 y 5; RADIOCAEX 1.3, 3 y 4; PLASISMEX 1.2, 3 y 4) |
| 31 | RD 1215/1997 (BOE-A-1997-17824) | 13/11/2004 | completo, con anexos I y II |
| 32 | CTE, RD 314/2006 (BOE-A-2006-5515) | 15/06/2022 | Parte I: arts. 1–2 (objeto y ámbito), 11 (SI 1–6) y 12 (SUA 1–9) |
| 33 | RIPCI, RD 513/2017 (BOE-A-2017-6606) | 03/09/2025 | arts. 1–2 y anexo I secc. 1.ª apdos. 2, 3, 5 y 6 |
| 34 | RD 164/2025 (BOE-A-2025-7190) | 10/04/2025 | ocho bloques: artículo y disposiciones, capítulos I–VI y anexos I–V; el extracto sustituye 24 tablas por avisos y menciona 25 figuras no reproducidas, pendientes de cotejo con el PDF oficial |

## Lo que falta en los temas con material (no se inventa)

- **T10:** el extracto BOE cubre solo el anexo I, sección 1.ª, apdos. 2, 3, 5 y 6 del RIPCI (abastecimiento, hidrantes, BIE y columna seca). Propiedades térmicas y procedimientos con agua, potencia del fuego/extintora, mangueras, acoplamientos, lanzas, accesorios y monitor requieren una fuente técnica específica y validada; las referencias a normas UNE en la RIPCI no reproducen su contenido.
- **T12:** el borrador cubre solo el apdo. 4 del anexo I, sección 1.ª, de la RIPCI. El epígrafe también pide mecanismos y agentes de extinción, cargas nominales y tiempo de utilización; las exigencias técnicas de UNE-EN 3-7 y UNE-EN 1866-1 no están reproducidas en el BOE. Esos contenidos quedan pendientes de fuentes autorizadas y revisión.
- **T33:** los arts. 1–2 y el bloque de los apdos. 2, 3, 5 y 6 de la RIPCI tienen desarrollo borrador por separado; el segundo bloque comparte alcance normativo con T10 y sus cambios deben coordinarse.
- **T13:** el material público actual solo extrae el RD 773/1997, cuyo art. 2.2.b excluye «los equipos de los servicios de socorro y salvamento». Un borrador separado del Reglamento (UE) 2016/425 (versión EUR-Lex consolidada a 29/05/2026) cubre únicamente categorías de riesgo y conformidad del producto; esta norma no desarrolla uso, mantenimiento, EPR ni maniobras con ERA. Faltan fuentes autorizadas para las características específicas de EPI bomberil, las normas UNE/armonizadas, las guías del INSST y los procedimientos operativos.
- **T22:** el borrador cubre solo el anexo II, apartado 4, del RD 1215/1997: utilización preventiva de equipos en trabajos temporales en altura. No desarrolla rescates en espacios confinados, técnicas y material de salvamento, SAS, nudos, poleas, líneas de vida, factor de caída ni caducidad; hacen falta fuentes técnicas y operativas validadas.
- **T31:** el desarrollo abarca articulado, anexos I y II del RD 1215/1997. El apartado 4 del anexo II se solapa con el bloque de altura de T22; se deben revisar coordinadamente.
- **T25:** dos borradores parciales cubren los arts. 1–3 y 20–23 del RD 97/2014, no todo el epígrafe. Clasificación ADR, códigos y etiquetas, depósitos/cisternas, BLEVE y boilover necesitan material separado; el [ADR 2025 oficial](https://publicaciones.transportes.gob.es/acuerdo-sobre-transporte-internacional-de-mercancias-peligrosas-por-carretera-adr-2025) no es el texto consolidado del real decreto. El BOE confirma que la última actualización publicada del RD 97/2014 es 04/12/2024; se alinea con esa fecha el campo `version` de `rd97-indice.json`, que mostraba erróneamente 26/06/2026.
- **T28:** seis borradores parciales explican el marco del RD 614/2001 y las ITC-BT incluidas. La parte de alta tensión (RD 337/2014 y RD 223/2008) no se ha generado; el encargo de material limitó REBT a baja tensión, acometidas e instalaciones de enlace. Las ITC-BT-09, 18 y 24, citadas por algunas fichas, quedan fuera del epígrafe. Los extractos de T28 omiten 32 tablas: una del anexo I del RD 614/2001 y 31 de los bloques REBT; las 13 figuras no reproducidas pertenecen a las ITC de redes. Faltan fuentes técnicas autorizadas para desarrollar de forma completa EPI/material de aislamiento y detección, agentes extintores y procedimientos operativos.
- **T20, T29 y T30 (DOE):** las tablas, figuras y organigramas no se copian: se remite a su página del PDF. Quedan fuera del recorte la introducción del PLATERCAEX, el cap. I §4 del INUNCAEX y el 1.3 del PLASISMEX (ámbito): las 4 fichas que los citan abren solo el tema.
- **T32:** el material público cubre solo la Parte I (arts. 1–2, 11 y 12); DB-SI 4, SI 5, SUA 4 y SUA 7 están en la Parte II. El RD 164/2025 modificó parcialmente DB-SI, por lo que cualquier desarrollo técnico de SI debe usar el documento vigente del portal oficial del CTE, no inferirse del extracto BOE de Parte I. DB-SUA también debe consultarse en su fuente oficial. Se ha preparado un desarrollo parcial de objetivos, no de soluciones ni parámetros.

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
| 21, 23 | Accidentes de tráfico e inundaciones: el epígrafe no cita norma (contenido técnico y operativo). |
| 24 | Himenópteros: pide «marco legal» sin citar norma; no se elige una por nuestra cuenta (la vespa velutina figura en el Catálogo de especies exóticas invasoras, RD 630/2013, pero el epígrafe no lo dice). Pendiente de que JM confirme. |
| 26 | Guías INSARAG (ONU): no es una norma del BOE. |
| 27 | Construcción y patología: técnico. |
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

## Constitución (T1): versión del 29/10/2026

Se ha comparado bloque a bloque con la del 20/05/2026 (ver `docs/CE_2026-10-29.md`). Ningún texto cambia: los 210 bloques
son iguales y `texto.xml` es idéntico byte a byte. Solo cambia la fecha de actualización. Se ha regenerado la versión, y el
desarrollo, las fichas y los conceptos siguen igual.

## Varias normas por tema

Cada bloque guarda su identificador BOE: `boe` en la especificación (`scripts/material/temaNN.json`, si no, el del tema),
en el `-indice.json`, en `materialTemas.ts` y en `materialPreceptos.ts`. Con eso, «Ver en el esquema» busca el ancla de
una cita solo en los bloques de la norma citada. Hace falta porque el art. 4 del RD 614/2001 y el art. 4 del REBT tienen
la misma ancla (`a4`). Un bloque puede tomar preceptos sueltos con `"ids"` en lugar de `desde`/`hasta`.
