# Material por tema (esquema y texto oficial): estado y temas sin norma consolidada

Actualizado el 31/10/2026. El material se genera con `scripts/generar_material_boe.py scripts/material/temaNN.json`.
Solo usa el texto consolidado del BOE (`scripts/fuente_boe.py`, API de datos abiertos), recortado al epígrafe del
anexo I (BOP de Badajoz n.º 135, 17/07/2026). No genera la capa «desarrollo»: esa capa la redacta una persona.

| Tema | Norma | Versión BOE | Alcance generado |
|---|---|---|---|
| 1 | Constitución (BOE-A-1978-31229) | 20/05/2026 | piloto: 6 bloques con 3 capas (`scripts/generar_material.py` + redacción revisada) |
| 2 | Estatuto de Autonomía de Extremadura (BOE-A-2011-1638) | 30/10/2026 | Tít. Preliminar, I y II (arts. 1–48) |
| 3 | LBRL (BOE-A-1985-5392) | 05/10/2026 | Tít. III, organización y competencias (arts. 31–38) |
| 6 | LPRL (BOE-A-1995-24292) | 23/10/2026 | caps. I–IV (arts. 1–32 bis) |
| 7 | Ley 8/2011 de Extremadura (BOE-A-2011-6651) | 19/12/2025 | Tít. Preliminar, Tít. II y Tít. IV cap. II |
| 31 | RD 1215/1997 (BOE-A-1997-17824) | 18/12/2025 | completo, con anexos I y II |
| 33 | RIPCI, RD 513/2017 (BOE-A-2017-6606) | 19/12/2025 | arts. 1–2 y anexo I secc. 1.ª apdos. 2, 3, 5 y 6 |
| 34 | RD 164/2025 (BOE-A-2025-7190) | 20/12/2025 | completo, con anexos I–V |

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
