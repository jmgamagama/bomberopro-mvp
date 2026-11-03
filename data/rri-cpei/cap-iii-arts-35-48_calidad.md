# Tema 5 · RRI del CPEI · Cap. III, arts. 35-48 — informe de calidad

Fecha: 01/11/2026. Autor: Claude (redacción propia). Fuente y método: los mismos que `caps-i-ii_calidad.md`
(texto único vigente, BOP de Badajoz n.º 149, de 06/08/2012; `data/fuentes/BOP-BA-2012-5370/`).

## Alcance y niveles
- Régimen disciplinario (arts. 35-36), recompensas (37), principios de actuación y cadena de mando (38-39), guardias,
  formación y departamentos (40-42), injerencias, vehículos, aceptación y limpieza (43-46), seguridad y salud
  laboral (47) y bomberos voluntarios (48).
- El art. 35 cayó en el examen CPEI 2023: cada una de las 40 faltas es un concepto propio (14 muy graves, 18 graves,
  8 leves). Prioridad 1 para las faltas más preguntables y para los pares que se confunden: intoxicación (muy grave)
  frente a beber estando de servicio (grave); normas de incompatibilidad (muy grave) frente a plazos (grave); tres
  faltas graves en un año (muy grave) frente a tres leves (grave); diez horas al mes; tercera falta de asistencia.
- Prioridad 1 también para la regla de mando en actuaciones conjuntas (39), la ignorancia no excusa (38), los EPIs
  que no salen del parque (47.7), el seguro (47.8) y la medalla de servicios distinguidos (37.2).

## Recuentos
- 84 conceptos, 252 preguntas nuevas (84 por nivel). Orden 1600-2430 (los arts. 23-34 irán entre 1060 y 1590).
  Prioridad 1: 18; 2: 54; 3: 12.
- 65 apartados del rango arts. 35-48, todos cubiertos.
- El art. 35 numera tres listas que empiezan cada una en 1. `scripts/validar_conceptos.py` las distingue ahora con
  un prefijo sacado de su encabezado («mg», «g», «l»). Comprobado que el resultado de los demás ficheros no cambia.

## Validador
`python3 scripts/validar_conceptos.py data/rri-cpei/cap-iii-arts-35-48.json --desde a35 --hasta a48` → **OK**, sin
avisos. Todas las citas entre comillas de las explicaciones se comprobaron por script contra el texto del BOP: 0 fallos.

## Revisión ciega
- 252 preguntas, letras barajadas, clave aparte; agente independiente.
- Primera pasada: 251/252 coincidencias y 1 marcada como ambigua.
  - Falta grave 12, nivel 3 («doce horas en un mes»): el revisor vio defendible también la falta leve 4. Se reescribió
    citando el supuesto del texto (mínimo de diez horas al mes acumuladas).
  - Falta grave 11, nivel 1: el revisor falló una pregunta que citaba un párrafo muy largo. Se acortó el enunciado.
- Segunda revisión ciega de las 2: 2/2, sin ambigüedad. Resultado final: **252/252 (100 %)**.
- Ninguna pregunta nueva repite la redacción de las ya publicadas. La de nivel 3 sobre las diez horas se reescribió
  porque era casi igual que la 12367.

## Preguntas ya publicadas (`vinculos-produccion-cap-iii-arts-35-48.json`)
- 33 preguntas del tema 5 sobre los arts. 35-48, revisadas una a una contra el BOP: todas correctas, todas con 3 opciones.
- Las 33 se vinculan con nivel 2 (26 estaban en nivel 1). Ninguna se despublica.

## Hallazgos en el texto oficial
- Erratas literales del BOP que se citan tal cual con [sic]: «rglamento» (35), «ingerencia» por ingestión (35,
  falta muy grave 6), «recompensan» (37.4), «C.E.P.E.I.» (38), «máximos responsable… garantizará» (42).
- Falta grave 9: «que efectúe al normal funcionamiento» (por «afecte»). Ninguna pregunta depende de ese verbo.

## Pruebas
- `vinculos_rri_cpei.pglite.mjs` carga ahora los cuatro bloques: 3/3.
