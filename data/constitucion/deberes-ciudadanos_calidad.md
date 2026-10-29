# Informe de calidad · Derechos y deberes de los ciudadanos (arts. 30-38 CE)

Tema 1 de CPEI Badajoz 2026 (arts. 1-55 CE). Bloque: Título I, Capítulo segundo, Sección 2.ª.

## Fuente
Texto consolidado del BOE (BOE-A-1978-31229, actualización del 20/05/2026), en `data/fuentes/BOE-A-1978-31229/`. Redacción propia a partir del borrador `titulo-i.json`, revisado concepto a concepto.

## Contenido
- 20 conceptos (orden 920-1110), uno por apartado; 9 artículos y 20 apartados cubiertos.
- 60 preguntas: una por nivel en cada concepto (nivel 1 con 2 opciones; niveles 2 y 3 con 3 opciones).
- Cambios sobre el borrador: 9 preguntas reescritas. Se quitaron una referencia al art. 103.3, que está fuera del temario, varias preguntas que repetían otras y varias pistas.
- Material: `public/material/constitucion/deberes-ciudadanos-1-esquema.md`, `-2-desarrollo.md` y `-3-completo.md` (este último generado). Las referencias cruzadas a los arts. 6, 7, 8, 22, 28, 39, 40, 47, 51, 52, 53 y 55 se comprobaron por script contra el BOE.

## Validador
`python3 scripts/validar_conceptos.py data/constitucion/deberes-ciudadanos.json --desde a30 --hasta a38`: OK, sin avisos propios. Los únicos avisos son de `confundible_con` que apuntan a conceptos de otros ficheros, y todos existen.

## Revisión ciega
Cada ronda la hizo un revisor independiente, solo con el texto del BOE y las preguntas barajadas, sin la clave.

| Ronda | Preguntas | Coincidencia | Hallazgos |
|---|---|---|---|
| 1 | 72 (60 nuevas + 12 antiguas candidatas a vincular) | 72/72 | 0 ambiguas, 0 errores, 4 con pista y varias repetidas |
| 2 | 4 reescritas | 4/4 | 1 con pista y 1 con distractores flojos |
| 3 | 2 reescritas | 2/2 | 1 con pista (se adivinaba por eliminación) |
| 4 | 1 reescrita | 1/1 | Sin hallazgos |

Arreglos tras la revisión:
- Pistas corregidas en las preguntas nuevas: 30.3 N3, 34.1 N1, 34.1 N2 y 37.1 N3.
- Antiguas que pasan a retirarse en vez de vincularse: 7. Cinco repetían a las nuevas (825, 827, 829, 864 y 8244) y dos tenían una pista (866, con distractores absurdos, y 904, que cita un «apartado 8» del art. 22, que no existe).

## Preguntas antiguas de producción (40)
Están en `vinculos-produccion-deberes-ciudadanos.json`. Cada una tiene su motivo.
- **5 vinculadas** a concepto y nivel: 4787 y 8235 (30.1), 833 (31.2), 926 (33.3) y 877 (38).
- **35 retiradas** como `duplicada`, con registro. Los motivos:
  - opciones referenciales («Ambas», «Todas las anteriores», «Ninguna»);
  - pistas por la longitud de la correcta o por distractores absolutos;
  - opciones ciertas pero incompletas;
  - repeticiones de las preguntas nuevas.
- **1 error** entre las retiradas: la 8231 daba como única correcta la b, pero la a y la c también son ciertas por la remisión del art. 34.2 al art. 22.

## Pruebas locales
- `node supabase/tests/vinculos_deberes.pglite.mjs`: 3 pruebas superadas.
- Pasan las 19 pruebas PGlite del repositorio.

## Carga
Hecha el 29/10/2026.
- **Staging:** 20 conceptos y 60 preguntas publicados, en 3 tramos de 7, 7 y 6 conceptos.
  - Huellas md5 iguales a las locales: conceptos `639c21a1639581e32fef79d554dddedc`, preguntas `2bd36867e3c3383dc3c39e0357d73599`.
  - Escalera de niveles probada con alumno simulado: sirve N1 y, tras acertar, N2.
- **Producción, comprobación previa:**
  - Las 40 antiguas estaban publicadas y sin concepto (huella `59ab6f71f446ceac82fbd5c1de41478b`).
  - No había ningún concepto de 30-38.
  - Tema 1 publicado: 653. Registro vacío.
- **Producción, carga:** huellas md5 iguales a staging. Tema 1 publicado: 713.
- **Producción, revisión de las antiguas:**
  - Una sola transacción, con 40 filas en `qa_changes_20260923` (motivo «revisión arts. 30-38…»).
  - Resultado: 5 vinculadas y 35 en `duplicada`.
  - Tema 1 publicado: **678** (653 + 60 − 35).
- **Producción, comprobación posterior:**
  - En el tema 1 solo quedan 3 preguntas publicadas sin concepto: 841, 880 y 884, sobre los nombres de los capítulos.
  - `get_concept_step_question('CE-a30-4-catastrofe')` sirve la de nivel 1, probado dentro de `rollback`.

## Marcha atrás
1. Restaurar desde `qa_changes_20260923` las filas con motivo «revisión arts. 30-38 CE…».
2. Poner en `borrador` los conceptos `CE-a30-*` … `CE-a38-*` y sus preguntas `CE:CE-a3[0-8]-*`.
