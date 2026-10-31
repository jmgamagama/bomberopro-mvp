# Tema 5 · RRI del CPEI · Cap. III, arts. 17-22 — informe de calidad

Fecha: 31/10/2026. Autor: Claude (redacción propia). Fuente y método: los mismos que `caps-i-ii_calidad.md`
(texto único vigente, BOP de Badajoz n.º 149, de 06/08/2012; `data/fuentes/BOP-BA-2012-5370/`).

## Alcance y niveles
- Instrucciones, circulares y órdenes de servicio (art. 17), impresos normalizados (18), partes, informes y
  correspondencia (19), redacción y tramitación (20), expediente profesional (21) y novedades en los parques (22).
- Ninguno de estos artículos cayó en el examen CPEI 2023 (que preguntó arts. 6.2, 15, 35 y el organigrama).
  Prioridad 1 solo para lo más preguntable: definiciones de instrucción, circular y orden de servicio, forma de las
  órdenes, partes verbales o escritos, los cinco partes, parte de incidencias, parte de intervención y parte verbal
  inmediato de novedades. Los detalles de registro y formato van a prioridad 3.

## Recuentos
- 51 conceptos, 153 preguntas nuevas (51 por nivel). Orden 550-1050. Prioridad 1: 9; 2: 22; 3: 20.
- 50 apartados del rango arts. 17-22, todos cubiertos. En el art. 20, los párrafos sin número que siguen al
  apartado 2 (salida con enterado o visto bueno, firma del autor, libros diligenciados por el Gerente) se tratan
  como parte del apartado 2.

## Validador
`python3 scripts/validar_conceptos.py data/rri-cpei/cap-iii-arts-17-22.json --desde a17 --hasta a22` → **OK**, sin
avisos (se alargaron distractores en 37 preguntas para que la correcta no destaque por longitud).
Además, todas las citas entre comillas de las explicaciones se comprobaron por script contra el texto del BOP: 0 fallos.

## Revisión ciega
- 153 preguntas, letras barajadas, clave aparte; agente independiente.
- Coincidencia: **153/153 (100 %)**.
- Marcó 3 como ambiguas, todas del art. 17.13: la frase «caso en el que se divulgarán exclusivamente mediante los
  tablones» admite dos lecturas (¿se refiere a las circulares de general conocimiento o a las demás?). Se
  reescribieron las 3 para preguntar solo lo inequívoco: que las circulares no catalogadas de general conocimiento
  siguen el criterio de las instrucciones (entrega y «recibí») y qué medio de divulgación menciona el apartado.
  Segunda revisión ciega de las 3: 3/3, sin ambigüedad.
- 5 preguntas de nivel 2 se reescribieron porque repetían casi literalmente una pregunta ya publicada (12290,
  12298, 12300, 12309, 12321). Revisión ciega de las 5 nuevas versiones: 5/5, sin ambigüedad.

## Preguntas ya publicadas (`vinculos-produccion-cap-iii-arts-17-22.json`)
- 18 preguntas del tema 5 sobre arts. 17-22, revisadas una a una contra el BOP: todas correctas.
- Las 18 se vinculan con nivel 2. Ninguna se despublica.

## Hallazgos en el texto oficial
- Art. 18.7 remite al «punto 19 del artículo anterior» para los campos del registro, pero esos campos están en el
  art. 17.10. Ninguna pregunta depende de esa remisión.
- Erratas literales del BOP que se citan tal cual con [sic]: «lo colectivos» (17.7), «le Registro General» (19.17),
  «quedarán reflejado» (22.3).

## Pruebas
- `vinculos_rri_cpei.pglite.mjs` carga ahora los tres bloques: 3/3 (incluye que el orden no se repita).
