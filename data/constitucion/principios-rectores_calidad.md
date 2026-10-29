# Tema 1 · Principios rectores de la política social y económica (arts. 39–52) — informe de calidad

Fecha: 29/10/2026. Autor del contenido: Claude, a partir del borrador sin revisar de la rama `claude/constitucion-titulo-i` (18/10), revisado entero contra el BOE. Publicación con el OK general de JM del 28/10/2026.

## Por qué este bloque va cuarto
Es el siguiente tramo con más preguntas en el banco (70 publicadas que citan los arts. 39–52) y se apoya en el art. 53.3, ya publicado, que fija el valor de estos principios.

## Fuente
`data/fuentes/BOE-A-1978-31229` (texto consolidado, actualización BOE 20/05/2026). El art. 49 está en la redacción de la **reforma de 15 de febrero de 2024** (BOE-A-2024-3099).

## Contenido
- `data/constitucion/principios-rectores.json`: **26 conceptos y 78 preguntas** (uno por apartado; cada concepto con nivel 1 de 2 opciones, nivel 2 de 3 tipo examen y nivel 3 de 3 con el matiz). 26 apartados cubiertos, todos los del tramo.
- Orden 1120–1370: detrás de los arts. 14–29 (400–910), con hueco para los arts. 30–38 (920–1110), y delante de los arts. 53–55 (5310–5520).
- Progresión por niveles (regla de JM del 28/10): el nivel 1 es el dato base (p. ej., «el art. 43 reconoce el derecho a la protección de la salud»), el 2 la pregunta de examen y el 3 el matiz (p. ej., «protección de la salud» frente a «derecho a la salud»; «el Estado» del art. 42 frente a «los poderes públicos»).

## Comprobaciones
1. **Validador** `validar_conceptos.py --desde a39 --hasta a52`: OK, sin avisos de longitud. Los únicos avisos son `confundible_con` a conceptos ya publicados de otros ficheros; se quitaron 5 que apuntaban a conceptos que aún no existen (arts. 10, 33, 35, 36 y 38).
2. **Revisión propia contra el BOE** del borrador: 5 preguntas cambiadas antes de la revisión ciega (39.4 N3 repetía la N1; 40.2 N2 y 46 N2 tenían la correcta claramente más larga o distractores solapados; 42 N3 tenía un distractor discutible).
3. **Revisión ciega independiente** de las 78 nuevas **y** de las 39 antiguas que se iban a quedar: **117/117 coincidencias, 0 errores**. El revisor marcó 2 ambiguas y 5 con pista: se corrigieron o retiraron las 7. Segunda ronda ciega sobre las 6 cambiadas: 6/6, sin ambigüedades, con 2 pistas; tercera ronda sobre esas 2: se cambió la nueva (art. 39.3 N2) y se retiró la antigua 4765.
4. **Pruebas locales**: `vinculos_principios.pglite.mjs` (nueva), `vinculos_derechos`, `vinculos_garantias`, `carga_compacta`, `carga_conceptos` y `vinculos`: en verde.

## Preguntas ya publicadas (70), revisadas una a una
Fichero `vinculos-produccion-principios-rectores.json`:
- **20 se vinculan** a su concepto (nivel 2, o nivel 3 si son literales con trampa).
- **17 se corrigen** y se vinculan: opciones casi sinónimas de la correcta («solidaridad social», «mantenerlo», «proporcione», «garantizan», «interés social»), frases recortadas ciertas pero incompletas, opciones referenciales («Las dos anteriores son correctas», «Ninguna es correcta»), dos enunciados (862, 919) y una explicación que citaba mal el art. 49.2 (4777).
- **33 se retiran** con registro: duplicadas, con la correcta como opción referencial, ambiguas o con pista. Una tenía un **error**: la **4761** decía que el art. 46 prevé sanción penal «y, en su caso, administrativa»; el art. 46 solo prevé la ley penal (lo administrativo es del art. 45.3).

## Material
`public/material/constitucion/principios-rectores-1-esquema.md`, `-2-desarrollo.md` y `-3-completo.md` (generado con `generar_material.py`, que ahora incluye este bloque). Todas las referencias a otros artículos (7, 9.2, 15, 20.1.b, 27.10, 35.1, 53.2 y 53.3) se comprobaron contra el texto del BOE.

## Fuera del tramo
- 1421 («Capítulo Primero del Título VIII») está publicada en el tema 1, pero el Título VIII no es del tema 1 (arts. 1–55). Queda para la revisión del banco.

## Carga
Publicado en producción el 29/10/2026.
- Staging: carga completa y huella idéntica; un alumno simulado recibe el nivel 1 (art. 51.3) y, tras acertarlo, el nivel 2.
- Producción: 26 conceptos (md5 `9d7ab4aa8414ac0af74f7f164b60dcb1`) y 78 preguntas (md5 `a9e01f990624fc626cf3457b250afbec`), iguales a staging. Comprobado que un alumno nuevo recibe primero el nivel 1.
- 70 preguntas antiguas: 37 vinculadas (17 de ellas corregidas) y 33 retiradas como `duplicada`; 89 filas de registro en `qa_changes_20260923`.
- Tema 1 publicado: 611 → 656 preguntas (611 + 78 − 33).

Marcha atrás: restaurar desde `qa_changes_20260923` las filas con motivo «revisión arts. 39-52 CE…» y poner en `borrador` los conceptos `CE-a39-*` … `CE-a52-*` y sus preguntas `CE:CE-a(39..52)-*`.
