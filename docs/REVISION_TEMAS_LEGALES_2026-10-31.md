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
