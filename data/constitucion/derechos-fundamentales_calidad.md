# Tema 1 · Igualdad y derechos fundamentales (arts. 14–29) — informe de calidad

Fecha: 29/10/2026. Autor del contenido: Claude, a partir del borrador sin revisar de la rama `claude/constitucion-titulo-i` (18/10), revisado entero contra el BOE. Publicación con el OK general de JM del 28/10/2026.

## Por qué este bloque va tercero
Es el tramo con más preguntas en el banco (120 publicadas que citan los arts. 14–29) y el de máxima protección constitucional (art. 53.2). Muchos de sus artículos se cruzan con los arts. 53–55 ya publicados.

## Fuente
`data/fuentes/BOE-A-1978-31229` (texto consolidado, actualización BOE 20/05/2026).

## Contenido
- `data/constitucion/derechos-fundamentales.json`: **52 conceptos y 156 preguntas** (uno por apartado o hecho examinable; cada concepto con nivel 1 de 2 opciones, nivel 2 de 3 tipo examen y nivel 3 de 3 con el matiz). 48 apartados cubiertos, todos los del tramo.
- Orden 400–910: detrás del Título Preliminar (10–240) y delante de los arts. 53–55 (5310–5520).
- Progresión por niveles (regla de JM del 28/10): el nivel 1 es el dato base (p. ej., «el domicilio es inviolable salvo flagrante delito»), el 2 la pregunta de examen y el 3 el matiz (p. ej., detención preventiva frente a prisión provisional). Los conceptos base de cada artículo van antes que los de detalle.

## Comprobaciones
1. **Validador** `validar_conceptos.py --desde a14 --hasta a29`: OK. Sin avisos de longitud; los únicos avisos son referencias `confundible_con` a conceptos de otros ficheros ya publicados (existen).
2. **Revisión propia contra el BOE** del borrador: 3 preguntas cambiadas antes de la revisión ciega (18.1 N3 «protección de datos» era discutible; 21.1 N3 redacción; 24.2 N3 «doble instancia» es discutible por la doctrina del Tribunal Constitucional y se cambió por el jurado, que está en el art. 125). Se quitaron 5 `confundible_con` a conceptos que aún no existen.
3. **Revisión ciega independiente**: 156/156 coincidencias. El revisor marcó 3 ambiguas y 4 con pista; se corrigieron las 7 y una segunda y tercera ronda ciega sobre las preguntas cambiadas dieron 7/7 y 5/5, sin ambigüedades ni errores.
4. **Pruebas locales**: `vinculos_derechos.pglite.mjs` (nueva), `vinculos_garantias`, `carga_compacta`, `carga_conceptos` y `vinculos`: en verde.

## Preguntas ya publicadas (120), revisadas una a una
Fichero `vinculos-produccion-derechos-fundamentales.json`:
- **60 se vinculan** a su concepto (nivel 2, o nivel 3 si son literales con trampa).
- **14 se corrigen**: 10 llevaban una opción referencial («Ambas son correctas», «Ninguna es correcta»…) o casi sinónima de la correcta y se sustituye por un distractor real; 4 explicaciones se corrigen. Una de ellas (4731) decía que **una «reforma de 1995» cambió el art. 15 y eliminó una excepción del estado de sitio: falso**, el art. 15 nunca se ha reformado. Otras dos tenían notas internas.
- **46 se retiran** con registro: duplicadas, con la correcta como opción referencial, o ambiguas (p. ej., 4720/7544/8198: «resolución judicial motivada» también es defendible para el secuestro; 4721: «el derecho de asociación no necesita autorización previa» es cierto aunque el art. 22 no lo diga; 8217: la Administración militar sí puede imponer sanciones privativas de libertad).

## Material
`public/material/constitucion/derechos-fundamentales-1-esquema.md`, `-2-desarrollo.md` y `-3-completo.md` (generado). La app aún no enlaza el material de bloques distintos del Título Preliminar.

## Cambio de script
`aplicar_vinculos.py` admite ahora corregir la **explicación** y **varias opciones** a la vez. La salida del fichero de los arts. 53–55 no cambia (comprobado byte a byte).

## Carga — publicado en producción el 29/10/2026
1. Staging: `cargar_conceptos.py … --estado publicado --compacto` y comprobación con un alumno simulado: un alumno nuevo recibe N1 y, tras acertarla, N2.
2. Producción: misma carga en 10 transacciones. Huellas md5 idénticas a la carga local: conceptos `4874de07561025fd4d99c8b1364a8572` (52) y preguntas `d0eafb7660710fe6e861e2125db0a2ae` (156).
3. Vínculos: `aplicar_vinculos.py` en 4 transacciones, 135 filas de registro en `qa_changes_20260923` sobre las 120 preguntas antiguas. Resultado: 74 vinculadas a su concepto y nivel, 46 retiradas como `duplicada`; 14 de las vinculadas con opciones o explicación corregidas.
4. Comprobado después: tema 1 pasa de 657 a 611 preguntas publicadas; correcciones de las 858, 916, 923, 4731 y 4746 en su sitio.

Marcha atrás: restaurar desde `qa_changes_20260923` las filas con motivo «revisión arts. 14-29 CE…» y poner en `borrador` los conceptos `CE-a14-*` … `CE-a29-*` y sus preguntas `CE:CE-a(14..29)-*`.
