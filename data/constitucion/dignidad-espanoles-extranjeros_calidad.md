# Tema 1 · Dignidad, españoles y extranjeros (arts. 10–13) — informe de calidad

Fecha: 29/10/2026. Autor del contenido: Claude, a partir del borrador sin revisar de la rama `claude/constitucion-titulo-i` (18/10), revisado entero contra el BOE. Publicación con el OK general de JM del 28/10/2026.

## Por qué este bloque va ahora
Es la base del Título I: el art. 10 abre el Título y los arts. 11–13 son el Capítulo primero. Había 35 preguntas publicadas sobre estos artículos, sin concepto ni nivel.

## Fuente
`data/fuentes/BOE-A-1978-31229` (texto consolidado). El art. 13.2 está en la redacción de la **reforma de 27 de agosto de 1992** (BOE-A-1992-20403), que añadió el sufragio pasivo.

## Contenido
- `data/constitucion/dignidad-espanoles-extranjeros.json`: **10 conceptos y 30 preguntas**, uno por apartado. Cada concepto tiene un nivel 1 de 2 opciones, un nivel 2 de 3 opciones tipo examen y un nivel 3 de 3 opciones con el matiz. Cubre los 10 apartados del tramo.
- Orden 300–390: entre el Título Preliminar (10–240) y los arts. 14–29 (400–910).
- Progresión por niveles:
  - El nivel 1 es el dato base (p. ej., «el art. 13.4 regula el asilo» o «la mayoría de edad son 18 años»).
  - El nivel 2 es la pregunta de examen.
  - El nivel 3 es el matiz (p. ej., «la ley» frente a «ley orgánica»; «principio» de reciprocidad en la extradición frente a «criterios» en el sufragio municipal).

## Comprobaciones
1. **Validador** `validar_conceptos.py --desde a10 --hasta a13`: OK. Los únicos avisos son `confundible_con` a conceptos ya publicados en producción (CE-a1-1-valores, CE-a2-unidad, CE-a23-1-participacion y CE-a39-4-ninos), que se comprobaron allí.
2. **Revisión propia contra el BOE** del borrador: se cambiaron 2 preguntas antes de la revisión ciega. En la 11.3 N3, la explicación no cuadraba con las opciones. En la 12 N3, una opción estaba mal redactada.
3. **Revisión ciega independiente** de las 30 nuevas **y** de las 13 antiguas que se iban a quedar:
   - Ronda 1: **43/43 coincidencias, 0 errores**. Marcó 1 ambigua (4742), varias con pista y varias duplicadas. Se corrigieron las nuevas afectadas y se retiraron las antiguas afectadas.
   - Ronda 2, sobre las 12 cambiadas o que se quedaban: 12/12, sin ambigüedades. Se corrigieron 3 pistas en las nuevas y se retiraron las antiguas 917 y 6147.
   - Rondas 3 y 4, sobre las 6 y 3 cambiadas: 100 % de coincidencia, sin ambigüedades ni errores.
4. **Pruebas locales**: `vinculos_dignidad.pglite.mjs` (nueva) y el resto de pruebas PGlite, en verde.

## Preguntas ya publicadas (35), revisadas una a una
Fichero `vinculos-produccion-dignidad-espanoles-extranjeros.json`:
- **2 se corrigen** y se vinculan a su concepto:
  - **899**: tenía la opción referencial «Ninguna es correcta» y el enunciado decía «de una ley» en lugar de «de la ley».
  - **6151**: el enunciado decía «criterios» en lugar de «principio» de reciprocidad.
- **32 se retiran** con registro (`duplicada`), por uno de estos motivos:
  - duplicadas de las nuevas;
  - frases recortadas ciertas pero incompletas;
  - opciones referenciales;
  - con pista (una incluía «(expresión que no figura en el artículo)» en la correcta);
  - ambigua: la **4742** pedía la afirmación INCORRECTA y tenía dos.
- **1 queda fuera del temario** (`fuera_temario`): la **1421**, sobre el Título VIII, que no es del tema 1 (arts. 1–55) ni de ningún tema de CPEI Badajoz.
- La 841 (rúbrica del Capítulo primero) es correcta y sigue publicada sin concepto.

## Material
- `public/material/constitucion/dignidad-espanoles-extranjeros-1-esquema.md`
- `public/material/constitucion/dignidad-espanoles-extranjeros-2-desarrollo.md`
- `public/material/constitucion/dignidad-espanoles-extranjeros-3-completo.md`, generado con `generar_material.py`, que ahora incluye este bloque.

Todas las referencias a otros artículos (1.1, 2, 9.2, 9.3 y 23) se comprobaron contra el texto del BOE.

## Carga
Hecha el 29/10/2026:
- Staging: 10 conceptos y 30 preguntas publicados. Huellas md5 iguales a las locales (conceptos `e4b08efb4fac90131d335d166ea80fbd`, preguntas `a4432afb6cda1daa0350320d77837083`). Escalera de niveles probada con alumno simulado: sirve N1 y, tras acertar, N2.
- Producción, comprobación previa: huella de las 35 antiguas sin cambios (`47e8f057e8925699d6e72ffb335485e8`), ningún concepto de 10-13 cargado, 656 publicadas en el tema 1 y registro vacío.
- Producción, carga: huellas md5 iguales a staging.
- Producción, revisión de las antiguas, en una sola transacción: 38 filas en `qa_changes_20260923` (motivo «revisión arts. 10-13…»). Resultado: 899 y 6151 corregidas y vinculadas a `CE-a13-3-extradicion` (nivel 2), 32 retiradas como `duplicada` y 1421 pasada a `fuera_temario`.
- Producción, comprobación posterior: tema 1 publicado 653 (656 + 30 − 32 − 1). `get_concept_step_question('CE-a13-4-asilo')` sirve la pregunta de nivel 1, probado dentro de `rollback`.

Marcha atrás: restaurar desde `qa_changes_20260923` las filas con motivo «revisión arts. 10-13 CE…» y poner en `borrador` los conceptos `CE-a10-*` … `CE-a13-*` y sus preguntas `CE:CE-a1[0-3]-*`.
