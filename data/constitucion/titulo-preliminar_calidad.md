# Tema 1 · Título Preliminar (arts. 1–9) — informe de calidad

Fecha: 17/10/2026. Autor del contenido: Claude. Estado: **borrador, pendiente de revisión de JM** antes de publicarse en producción.

## Fuente
- Constitución Española, BOE-A-1978-31229, texto consolidado descargado de la API de datos abiertos del BOE.
  Última actualización publicada: 20/05/2026. sha256 del XML en `data/fuentes/BOE-A-1978-31229/meta.json`.
- El workflow «Fuentes oficiales BOE» lo vuelve a comprobar cada lunes y abre un PR si cambia.

## Contenido
| Pieza | Cantidad |
|---|---:|
| Conceptos | 24 (cubren los 17 apartados de los arts. 1–9) |
| Tarjetas | 24 (una por concepto) |
| Preguntas nuevas | 72 (3 por concepto: fácil de 2 opciones, normal y difícil de 3) |
| Preguntas existentes revisadas | 80 (69 se vinculan, 4 se corrigen y vinculan, 5 duplicadas, 1 fuera de temario, 1 se reubica en el art. 10) |
| Material | esquema, desarrollo y texto completo con conceptos; texto oficial completo descargable |

## Comprobaciones
1. **Validador automático** (`scripts/validar_conceptos.py`): cada cita es literal del apartado del BOE que dice citar; todos los apartados tienen concepto; un nivel de cada; 2 o 3 opciones según nivel; sin opciones repetidas; la correcta no aparece en el enunciado; la correcta no es la opción claramente más larga (se corrigieron 10 casos). Resultado: **OK**.
2. **Revisión ciega** por un agente independiente que solo tenía el texto del BOE y las preguntas sin solución: respondió las 72; **72/72 coinciden** con la clave y **0 marcadas** como ambiguas. Dos casos límite comentados y mantenidos: «Ejército del Aire y del Espacio» (denominación posterior, la CE dice «Ejército del Aire») y la limitación de la sindicación de las Fuerzas Armadas (art. 28.1, no art. 7).
3. **Referencias cruzadas del desarrollo** (arts. 10, 28, 36, 66, 103, 104): comprobadas de forma automática contra el texto del BOE.
4. **Preguntas existentes**: revisadas una a una contra el BOE. Motivo de cada decisión en `vinculos-produccion-titulo-preliminar.json`.

## Hallazgos fuera del tramo (pendientes de decisión)
- ~467 preguntas publicadas del tema 1 citan arts. 56–169, fuera del epígrafe oficial de Badajoz (arts. 1–55).
- La pregunta 802 (art. 49) empieza por una nota interna «AVISO DE FUENTE…» visible para el alumno.
- 4.833 preguntas de 4 opciones se recortan a 3 al azar; en 2.154 hay opciones referenciales («Ambas», «A y B»…) y en 510 la correcta es una de ellas. Lo arregla la migración 20.
