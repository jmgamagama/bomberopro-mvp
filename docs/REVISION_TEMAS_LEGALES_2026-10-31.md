# Revisión de temas normativos contra su fuente oficial (31/10/2026)

**Método**, ficha a ficha y sin cambiar el contenido:
1. Vigencia. Cada norma se comprueba por su número BOE con la API de datos abiertos del BOE (`/legislacion-consolidada/id/{BOE}/metadatos`). En todas consta: estatus de derogación N, de anulación N, vigencia agotada N y consolidación «Finalizado».
2. Texto. Se descarga el texto consolidado vigente (`/texto`, última versión de cada bloque) y se localiza el bloque del ancla de la ficha (`#aN`).
3. Cotejo. La respuesta tiene que aparecer en el artículo citado de forma literal o casi literal (al menos el 60 % de sus trigramas, con revisión a mano de esas fichas). Además, el número de artículo de la pregunta tiene que coincidir con el bloque.
4. Epígrafe. Los artículos citados tienen que estar dentro del epígrafe del anexo I (BOP de Badajoz nº 135, de 17/07/2026).
5. Muestra. Se leen a mano al menos 5 fichas al azar por mazo.

| Tema | Mazo | Norma (BOE) | Fichas | Literales | Casi literales | Revisadas a mano | Errores | Epígrafe |
|---|---|---|---:|---:|---:|---:|---:|---|
| T1 | tema1 | Constitución, BOE-A-1978-31229 (act. 29/10/2026) | 129 | 125 | 3 | 1 + muestra | 0 | arts. 1-55 (Tít. Preliminar y Tít. I) |
| T2 | tema2 | Estatuto de Autonomía de Extremadura, BOE-A-2011-1638 (act. 30/10/2026) | 121 | 112 | 6 | 3 + muestra | 0 | arts. 1-48 (Tít. Preliminar, I y II) |
| T3 | tema3 | LBRL, BOE-A-1985-5392 (act. 05/10/2026) | 66 | 54 | 11 | 1 + muestra | 0 | arts. 31-38 (Título III, la Provincia) |
| T6 | tema6 | LPRL, BOE-A-1995-24292 (act. 23/10/2026) | 94 | 86 | 8 | muestra | 0 | arts. 1-32 bis (caps. I-IV) |
| T7 | tema7 | Ley 8/2011 de Extremadura, BOE-A-2011-6651 (act. 19/12/2025) | 64 | 60 | 4 | muestra | 0 | arts. 1-4, 21-32 y 78-83 |
| T31 | tema31 | RD 1215/1997, BOE-A-1997-17824 (act. 18/12/2025) | 83 | 73 | 10 | muestra | 0 | RD completo |
| T34 | tema34-lote01/02/03 | RSCIEI, RD 164/2025, BOE-A-2025-7190 (act. 20/12/2025) | 132 | 129 | 3 | muestra | 0 | RD completo |

## Pendiente (31/10/2026, actualizado 2.ª tanda)

- Sin fichas: T11, T18 (T19 excluido).
- Ocultas por no tener norma oficial (INSST): 5 de T12 y 12 de T28-lote02 (NTP 400). Se verían si se acepta el INSST como fuente o se rehacen contra RD 614/2001.
- T33-lote02 (arts. 21-22, anexos II-III RIPCI): fuera del epígrafe, sigue oculto.
- T23-lote02: 18 de 23 con respaldo; 10 por debajo del umbral, sin revisar.
- Mayoría sin enlace a artículo: T9, T15, T27-lote02, T32.
- Sin texto consolidado en la API: T25 y T25-lote02 (BOE-A-2009-5490).
- T5 (28/28 literales con el RRI, BOP nº 149 de 06/08/2012): NO abierto. El BOP nº 145 de 01/08/2022 (anuncio 3393/2022) publica la aprobación inicial de una modificación puntual del RRI cuyo texto no consta publicado; no se puede confirmar que el texto de 2012 sea el vigente.
- T20 (Plan INFOEX): 15 de 24 con respaldo en el Decreto 136/2024 (DOE); 9 por debajo del umbral, falta descargar el texto del Decreto 132/2022 y cotejarlas.
- T21 y T21-lote02: la fuente es el Manual básico de rescate de la DGT, no BOE/DOE/BOP; quedan ocultos.
- Fuente BOP/DOE, sin cotejar: T29, T30, T37; resto sin revisar: T8, T26, T27, lotes 02 de T12, T13, T22.

| T10 | tema10 | RIPCI, RD 513/2017, BOE-A-2017-6606 | 34 | 34 | 0 | — | 0 | abastecimiento, hidrantes, BIE, columna seca (epígrafe T10) |
| T22 | tema22 | RD 1215/1997 anexo II.4, BOE-A-1997-17824 | 33 | 32 | 1 | — | 0 | normativa de trabajos en altura |
| T14 | tema14 | RGC BOE-A-2003-23514, RGV BOE-A-1999-1826, BOE-A-2021-4194 | 24 | 24 | 0 | — | 0 | normativa de aplicación de vehículos |
| T28 | tema28 | RD 614/2001, REBT, RD 223/2008 | 29 | 29 | 0 | — | 0 | definiciones, distancias de seguridad, redes |
| T12 | tema12 | RIPCI, BOE-A-2017-6606 | 21 | 16 | 0 | — | 5 ocultas (INSST, sin norma) | extintores, clases de fuego |
| T28 | tema28-lote02 | REBT, RD 337/2014, RD 614/2001 | 74 | 61 | 1 | — | 12 ocultas (NTP 400, sin norma) | redes, CT, instalaciones de enlace |
| T33 | tema33 | RIPCI, BOE-A-2017-6606 | 67 | 67 | 0 | — | 0 | arts. 1-2; anexo I secc. 1 apdos. 2, 3, 5 y 6 (filtrado por apartado: 0 fichas fuera). T33-lote02 (arts. 21-22, anexos II-III) sigue oculto: fuera del epígrafe |
| T23 | tema23 | Plan Estatal de Inundaciones BOE-A-2011-14277; Directriz Básica BOE-A-2026-9160 | 21 | 19 | 2 | — | 0 | enlace de 1 ficha corregido a BOE-A-2026-9160 |
| T13 | tema13 | RD 773/1997 (BOE-A-1997-12735) y Reglamento (UE) 2016/425 (DOUE-L-2016-80531, boe.es) | 25 | 23 | 2 | — | 0 | 7 enlaces añadidos al texto del DOUE en boe.es |
| T4 | tema4 | Acuerdo de reorganización, BOP Badajoz nº 206 (29/10/2025), anuncio 4611/2025 | 28 | 28 | 0 | — | 0 | áreas, servicios, OOAA y consorcios (epígrafe T4) |
| T20 | tema20 | Plan INFOEX: Decreto 132/2022 (DOE 210/2022) mod. Decreto 136/2024 (DOE 215/2024) | 24 | 24 | 0 | — | 0 | arts. 6, 7, 10-13 y 16 |
| T23 | tema23-lote02 | RDPH, RD 903/2010, Directriz 2026 | 23 | 9 | 6 | 8 a mano | 0 | 3 respuestas literalizadas; art. 14 apdo. 3 corregido |
| T29 | tema29 | PLATERCAEX, Decreto 187/2019 (DOE 247/2019) | 81 | 73 | 7 | 1 a mano | 0 | objetivo, alcance, estructura, operatividad |
| T30 | tema30 | INUNCAEX (D. 39/2025, DOE 94), TRANSCAEX, RADIOCAEX, PLASISMEX (DOE 247 y 111) | 87 | 86 | 1 | — | 0 | definición, objetivos, estructura, operatividad |
