# Tema 5 · RRI del CPEI · Caps. IV-VIII, arts. 23-34 — informe de calidad

Fecha: 01/11/2026. Autor: Claude (redacción propia). Fuente y método: los mismos que `caps-i-ii_calidad.md`
(texto único vigente, BOP de Badajoz n.º 149, de 06/08/2012; `data/fuentes/BOP-BA-2012-5370/`).

## Alcance y niveles
- Uniformidad y vestuario (arts. 23-24), organización de los parques (25-26), funcionamiento en los parques
  (27-32: régimen interior, salidas, siniestros, relevos y guardias), deberes específicos del personal operativo (33)
  y responsabilidad (34, primer artículo del cap. VIII; el 35-48 ya está en `cap-iii-arts-35-48.json`).
- Prioridad 1 para lo más preguntado en producción y lo que se confunde: clasificación de parques (central, comarcal,
  local) y sus guardias, quién autoriza la permanencia en el parque, a quién se comunica la salida (jefe o
  emisorista), uso y reposición del uniforme, y las reglas de relevo y guardia del art. 32.

## Recuentos
- 70 conceptos, 210 preguntas nuevas (70 por nivel). Orden 1060-1474, dentro del hueco reservado (1060-1590).
  Prioridad 1: 27; 2: 33; 3: 10.
- 21 apartados del rango arts. 23-34, todos cubiertos.

## Validador
`python3 scripts/validar_conceptos.py data/rri-cpei/caps-iv-vii-arts-23-34.json --desde a23 --hasta a34` → **OK**, sin
avisos (había 42 avisos de longitud en el primer borrador; se reescribieron las opciones). Todas las citas entre
comillas de las explicaciones se comprobaron por script contra el texto del BOP: 0 fallos.

## Revisión ciega
- 210 preguntas, letras barajadas, clave aparte; agente independiente.
- Primera pasada: 209/210 y 1 marcada como ambigua: art. 28.3, nivel 1 (permanencia en el parque). Se reescribió
  como «¿está permitida en los parques la permanencia continuada de los miembros del Consorcio?» (Sí).
- Segunda revisión ciega: 1/1. Resultado final: **210/210 (100 %)**.
- Ninguna pregunta nueva repite la redacción de las ya publicadas: se reescribieron dos (art. 28.2 nivel 2 y 28.3
  nivel 3) porque copiaban un distractor o la redacción de las 12639 y 12649.

## Preguntas ya publicadas (`vinculos-produccion-caps-iv-vii-arts-23-34.json`)
- 74 preguntas del tema 5 sobre los arts. 23-34, revisadas una a una contra el BOP: todas correctas. Incluye las
  12331, 12627 y 12656, que estaban pendientes de auditar: cuadran con el art. 32.
- 70 se vinculan con nivel 2 (65 estaban en nivel 1).
- 4 duplicadas se despublican con registro (se conserva la de la columna derecha): 6993 (=12638), 6995 (=12653),
  6996 (=11960) y 6997 (=12652).

## Hallazgos en el texto oficial
- Erratas literales del BOP que se citan tal cual con [sic]: «C.P.E.I..» (25) y «Emisorísta» (28.2).
- Fuera del tramo: la pregunta 6992 dice que el reglamento es de 2006 (manual antiguo); queda para auditar.

## Pruebas
- `vinculos_rri_cpei.pglite.mjs` carga ahora los cinco bloques: 3/3.
