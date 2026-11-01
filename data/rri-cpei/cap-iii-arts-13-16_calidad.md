# Tema 5 · RRI del CPEI · Cap. III, arts. 13-16 — informe de calidad

Fecha: 31/10/2026. Autor: Claude (redacción propia). Fuente y método: los mismos que `caps-i-ii_calidad.md`
(texto único vigente, BOP de Badajoz n.º 149, de 06/08/2012; `data/fuentes/BOP-BA-2012-5370/`).

## Por qué este tramo
- Obediencia, mando y jerarquía: base de los arts. 17-48 y del organigrama. El art. 15 (dependencia respecto de
  otras autoridades) fue la pregunta n.º 8 del examen CPEI 2023.
- El resto del capítulo III (arts. 17-22: instrucciones, circulares, impresos, partes y correspondencia) va en
  un bloque aparte.

## Recuentos
- 13 conceptos, 39 preguntas nuevas (13 por nivel). Orden 420-540. Prioridad 1: 8; 2: 3; 3: 2.
- 11 apartados del rango arts. 13-16, todos cubiertos.

## Validador
`python3 scripts/validar_conceptos.py data/rri-cpei/cap-iii-arts-13-16.json --desde a13 --hasta a16` → **OK**, sin
avisos (se alargaron distractores en 2 preguntas).

## Revisión ciega
- 45 preguntas (39 nuevas + 6 existentes que se vinculan), letras barajadas, clave aparte; agente independiente.
- Coincidencia: **45/45 (100 %)**.
- Marcó 1 como mejorable: `RRI-a13-2-consulta` N3 decía «¿qué afirmación es correcta?» sin decir sobre qué.
  Reescrito como «¿cómo deben cumplirse las instrucciones de los superiores?».

## Preguntas ya publicadas (`vinculos-produccion-cap-iii-arts-13-16.json`)
- 8 preguntas del tema 5 sobre arts. 13-16, revisadas contra el BOP: todas correctas.
- 6 se vinculan con nivel 2.
- 2 se despublican como duplicadas con registro: 12293 (igual que `RRI-a14-virtudes` N2) y 12296 (igual que
  `RRI-a16-3-colision` N3).

## Pruebas
- `vinculos_rri_cpei.pglite.mjs` carga ahora los dos bloques: 3/3 (incluye que el orden no se repita).
