# Tema 1 · Garantías y suspensión de los derechos (arts. 53–55) — informe de calidad

Fecha: 28/10/2026. Autor del contenido: Claude. Estado: **borrador, pendiente de revisión de JM** antes de cargarse y publicarse en producción.

## Por qué este bloque va segundo
En el banco publicado del tema 1, los arts. 53–55 acumulan 43 preguntas para solo 6 apartados (unas 7 por apartado), la mayor densidad del Título I. Además, el art. 53 es el «mapa» de protección de todo el título: estudiarlo pronto ordena el resto (arts. 10–52).

## Fuente
- Constitución Española, BOE-A-1978-31229, texto consolidado (última actualización publicada: 20/05/2026). sha256 del XML en `data/fuentes/BOE-A-1978-31229/meta.json`.
- Los arts. 53, 54 y 55 no se han modificado desde 1978 (una sola versión en el BOE).

## Contenido
| Pieza | Cantidad |
|---|---:|
| Conceptos | 22 (cubren los 6 apartados de los arts. 53–55) |
| Tarjetas | 22 (una por concepto) |
| Preguntas nuevas | 66 (3 por concepto: fácil de 2 opciones, normal y difícil de 3) |
| Preguntas existentes revisadas | 54: 43 de los arts. 53–55 y 11 sin artículo en la cita (19 se vinculan, 3 se corrigen y vinculan, 21 se despublican, 9 fuera de temario, 2 se reubican) |
| Material | esquema, desarrollo y texto completo con conceptos |

## Comprobaciones
1. **Validador automático** (`scripts/validar_conceptos.py --desde a53 --hasta a55`): citas literales, cobertura de los 6 apartados, un nivel de cada, 2 o 3 opciones, sin repetidas, la correcta no está en el enunciado ni es claramente la más larga. Resultado: **OK, sin avisos**.
2. **Revisión ciega** por un agente independiente con el texto del BOE y las 66 preguntas barajadas sin solución: **66/66 coinciden** con la clave y **0 marcadas** como ambiguas. A partir de sus comentarios se pulieron 3 redacciones sin cambiar la respuesta: la opción correcta de CE-a55-2-garantias N3 («debe prever» por «exige», que es literal), el enunciado de CE-a55-1-no-suspendibles N3 y la opción correcta de CE-a53-2-ambito N3 (ya no dice «reservados», que olvidaba el art. 30).
3. **Referencias cruzadas del material** (artículos, apartados y letras): comprobadas por script contra el BOE, sin errores.
4. **Pruebas locales**: `supabase/tests/vinculos_garantias.pglite.mjs` (nueva: carga junto al Título Preliminar sin pisarlo, deja todo en borrador y aplica la revisión con registro), `carga_conceptos.pglite.mjs` y `vinculos.pglite.mjs`: todas en verde.

## Errores encontrados en preguntas ya publicadas (se despublican con registro)
- **984**: afirma que el habeas corpus (17.4) no es suspendible «en ningún estado». Falso: el art. 55.1 incluye el art. 17 entero.
- **890 y 979**: la opción «plazo de la prisión provisional» (17.4) también es suspendible, así que «Ambas son correctas» sería defendible.
- **891**: el 17.3 sí puede suspenderse en el estado de sitio, y el enunciado dice «excepción o de sitio».
- **981**: pregunta qué puede «limitarse» en el estado de alarma; la LO 4/1981 sí permite limitar la circulación.
- **8234**: dos opciones correctas. **969, 970, 8224**: distractores casi sinónimos de la correcta. **8242**: «Las dos anteriores» y explicación con el artículo equivocado.
- Resto: duplicadas o con opciones referenciales («Ambas», «Ninguna vale»).

## Hallazgos fuera del tramo
- 8 preguntas publicadas del tema 1 tratan de los Títulos II, III, VI, VIII y IX (fuera del epígrafe de Badajoz, arts. 1–55); se marcan `fuera_temario`. También la 6811 (plazo del estado de excepción, LO 4/1981 y art. 116.3).
- La app solo muestra el material del Título Preliminar (`src/components/MaterialConstitucion.tsx` tiene los ficheros fijos). Para ver el esquema y el desarrollo de este bloque hace falta un selector de bloques; se hará cuando JM apruebe el contenido.

## Carga (cuando JM apruebe)
1. Staging: `python3 scripts/cargar_conceptos.py data/constitucion/garantias-suspension.json --estado publicado`.
2. Producción: `--estado borrador` y después `python3 scripts/aplicar_vinculos.py data/constitucion/vinculos-produccion-garantias-suspension.json`.
3. Publicar conceptos y preguntas nuevas tras el OK de JM.
