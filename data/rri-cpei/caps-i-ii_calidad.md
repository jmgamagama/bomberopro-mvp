# Tema 5 · RRI del CPEI · Caps. I-II (arts. 1-12) — informe de calidad

Fecha: 31/10/2026. Autor: Claude (redacción propia). Estado: en borrador hasta la carga.

## Por qué este tema
- Es el tema con más preguntas en el examen real de la misma oposición: 5 de 50 en CPEI 2023 (n.º 5, 6, 8, 9 y 10;
  ver `revisiones/probabilidad-niveles/examenes-historicos.tsv`). La n.º 6 es literalmente el art. 6.2 (categorías).
- No tenía estudio por conceptos: 182 preguntas publicadas, ninguna ligada a concepto ni con nivel 3.

## Fuente oficial
- Reglamento de Régimen Interno del CPEI, **texto único vigente** publicado en el BOP de Badajoz n.º 149, de
  06/08/2012, anuncio 5370/2012 (integra la modificación de los arts. 6.1.d y 25 aprobada el 21/05/2012).
- Descargado de dip-badajoz.es con `scripts/fuente_bop.py BOP-BA-2012-5370` (nuevo; mismo formato que
  `fuente_boe.py`) → `data/fuentes/BOP-BA-2012-5370/` (HTML original, `bloques.json`, `texto.md`, `meta.json` con sha256).
- No se ha encontrado ninguna modificación posterior publicada (búsqueda web del 31/10/2026).
- Descartado como fuente el PDF del Drive «7-REGLAMENTO CPEI BADAJOZ.pdf»: es un manual basado en la versión de
  2006, no el texto oficial vigente.

## Recuentos
- 41 conceptos, 123 preguntas nuevas (41 por nivel). Orden 10-410. Prioridad 1: 14; 2: 21; 3: 6.
- 31 apartados del rango arts. 1-12, todos cubiertos.

## Validador
`python3 scripts/validar_conceptos.py data/rri-cpei/caps-i-ii.json --desde a1 --hasta a12` → **OK**, sin avisos
(se alargaron distractores en 6 preguntas en las que la correcta era la más larga).

## Revisión ciega
- 150 preguntas (123 nuevas + 27 existentes que se vinculan), letras barajadas, clave aparte; un agente
  independiente respondió solo con el texto oficial.
- Coincidencia: **150/150 (100 %)**.
- Marcó 2 como mejorables (la correcta seguía siendo la única defendible) y se corrigieron:
  - `RRI-a2-4-expedicion` N3: el enunciado decía «autoridad local»; el art. 2.4 habla de «la autoridad que en dicho
    lugar tenga encomendada la dirección de las tareas». Reescrito.
  - `RRI-a11-1-finalidad` N2: la opción decía «aptitud»; el BOP dice literalmente «actitud psicofísica». Se usa el
    literal.

## Preguntas ya publicadas (`vinculos-produccion-caps-i-ii.json`)
- 28 preguntas del tema 5 sobre arts. 1-12, revisadas una a una contra el BOP: todas correctas.
- 27 se vinculan a su concepto con **nivel 2** (tienen 3 opciones, formato de examen; estaban como nivel 1).
- 1 se despublica como duplicada con registro (7002, mismo hecho que 12354 con peores distractores).
- 6989 (qué regula el Capítulo Segundo) no cita artículo: se deja sin vincular.

## Hallazgos fuera del tramo
- Las 154 preguntas restantes del tema 5 tratan los arts. 13-48 (bloques siguientes) y el organigrama.
- 14 preguntas del **organigrama (2022)**: el organigrama no está publicado en ningún boletín, solo como gráfico en
  la web del CPEI. Quedan sin concepto hasta tener un documento oficial fechado.
- El art. 6.2 sigue llamando «Conductor Mecánico Bombero» a la categoría básica; la plaza convocada en 2026 se
  denomina «Conductor/a Bombero/a». Las preguntas citan siempre «según el Reglamento» para que no haya conflicto.

## Material
- Pendiente: el visor de material de la app solo está conectado a la Constitución (`MaterialConstitucion.tsx`).
  Las tarjetas de concepto ya llevan la cita literal del artículo.

## Pruebas
- `node supabase/tests/vinculos_rri_cpei.pglite.mjs` (nueva, en CI): 3/3. Carga en el tema 5 por número, cita el
  BOP y no el BOE, formato compacto idéntico, vínculos con registro.
- `carga_conceptos`, `vinculos` y `carga_compacta` siguen pasando; el SQL de la Constitución no cambia (md5 igual).
