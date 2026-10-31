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

## Pendiente (31/10/2026)

- Sin fichas: T11, T18 (T19 excluido).
- Cotejo automático OK, falta comprobar el alcance del epígrafe: T22 (anexo II RD 1215), T10 lote 1, T12, T14, T28.
- T33: 61 fichas del anexo I sección 1 del RIPCI; el epígrafe solo cubre abastecimiento, hidrantes, BIE y columna seca, así que hay que filtrar por apartado. T33-lote02 (arts. 21-22 y anexos II-III) queda fuera del epígrafe.
- Parciales: T23 20/21, T23-lote02 18/23, T13 18 OK + 7 sin enlace, T12 5 sin enlace, T28-lote02 12 sin enlace.
- Mayoría sin enlace a artículo: T9, T15, T27-lote02, T32.
- Sin texto consolidado en la API: T25 y T25-lote02 (BOE-A-2009-5490), T16-lote02 / T17 (BOE-A-2025-77).
- Fuente BOP/DOE, sin cotejar: T4, T5, T20, T21, T29, T30, T37 y el resto (T8, T26, T27).
| T10 | tema10 | RIPCI, RD 513/2017, BOE-A-2017-6606 | 34 | 34 | 0 | — | 0 | abastecimiento, hidrantes, BIE, columna seca (epígrafe T10) |
| T22 | tema22 | RD 1215/1997 anexo II.4, BOE-A-1997-17824 | 33 | 32 | 1 | — | 0 | normativa de trabajos en altura |
| T14 | tema14 | RGC BOE-A-2003-23514, RGV BOE-A-1999-1826, BOE-A-2021-4194 | 24 | 24 | 0 | — | 0 | normativa de aplicación de vehículos |
| T28 | tema28 | RD 614/2001, REBT, RD 223/2008 | 29 | 29 | 0 | — | 0 | definiciones, distancias de seguridad, redes |
| T12 | tema12 | RIPCI, BOE-A-2017-6606 | 21 | 16 | 0 | — | 5 ocultas (INSST, sin norma) | extintores, clases de fuego |
| T28 | tema28-lote02 | REBT, RD 337/2014, RD 614/2001 | 74 | 61 | 1 | — | 12 ocultas (NTP 400, sin norma) | redes, CT, instalaciones de enlace |
| T33 | tema33 | RIPCI, BOE-A-2017-6606 | 67 | 67 | 0 | — | 0 | arts. 1-2; anexo I secc. 1 apdos. 2, 3, 5 y 6 (filtrado por apartado: 0 fichas fuera). T33-lote02 (arts. 21-22, anexos II-III) sigue oculto: fuera del epígrafe |
| T23 | tema23 | Plan Estatal de Inundaciones BOE-A-2011-14277; Directriz Básica BOE-A-2026-9160 | 21 | 19 | 2 | — | 0 | enlace de 1 ficha corregido a BOE-A-2026-9160 |
