# Material de normas del DOE (T20, T29 y T30)

Actualizado el 01/11/2026. El DOE no tiene API de texto consolidado ni de vigencia, así que el método cambia respecto al BOE en dos cosas: de dónde sale el texto y cómo se comprueba la vigencia. Todo lo demás (recorte al epígrafe, esquema con rúbricas literales, texto oficial, tablas remitidas a la fuente) es la misma lógica y el mismo generador.

## Cómo se genera

1. `python3 scripts/fuente_doe.py scripts/fuentes_doe/<ID>.json` descarga el PDF oficial (o lo lee con `--pdf`) y escribe `data/fuentes/<ID>/{meta.json,bloques.json,texto.md}` con el mismo formato que `scripts/fuente_boe.py`.
   - El texto sale de `pdftohtml -xml`. Se quitan cabeceras y pies repetidos y los números de página.
   - Los apartados («IV.3.1», «3.1.-», «Artículo 6») son los que lista la configuración, por tramos de páginas.
   - Las tablas, figuras y organigramas se sustituyen por una remisión a su página del PDF. Se detectan por columnas y algunas se marcan a mano en `tablas`, tras mirar la página.
   - **Comprobación literal:** cada párrafo extraído tiene que estar, en orden, en el texto de `pdftotext` de su página. Si alguno falla, el script termina con error. En la última ejecución pasaron el 100 % de los párrafos de las seis normas.
2. `python3 scripts/generar_material_boe.py scripts/material/tema{20,29,30}.json`: es el mismo generador. Si `meta.json` trae `"origen": "doe"`:
   - La cabecera cita el PDF del que sale el texto y la publicación en el DOE (con enlace al PDF del DOE), la fecha de la comprobación manual y lo que se buscó.
   - Cada rúbrica enlaza con su página del PDF (`#page=N`).
   - El material del BOE se regenera idéntico, byte a byte.
3. `npm run material:preceptos`.

## Las normas

| Tema | Id | Norma | De dónde sale el texto |
|---|---|---|---|
| 20 | DOE-2022040193 | Decreto 132/2022, Plan INFOEX (mod. Decreto 136/2024) | Texto consolidado oficial del DOE (22040193C.pdf, última modificación publicada el 05/11/2024) |
| 29 | DOE-2019040203 | Decreto 187/2019, PLATERCAEX | PDF del plan en juntaex.es (31/01/2020) |
| 30 | DOE-2025040069 | Decreto 39/2025, INUNCAEX | PDF del plan en juntaex.es (09/05/2025) |
| 30 | DOE-2019040205 | Decreto 189/2019, TRANSCAEX | PDF del plan en juntaex.es (25/03/2019) |
| 30 | DOE-2019040206 | Decreto 200/2019, RADIOCAEX | PDF del plan en juntaex.es (19/12/2019) |
| 30 | DOE-2009040140 | Decreto 127/2009, PLASISMEX | PDF del plan en juntaex.es (21/02/2013) |

**Remisión de los planes.** En el DOE solo están los decretos, de 1 a 4 páginas. Los decretos 187/2019, 189/2019, 200/2019 y 39/2025 remiten el texto íntegro del plan a la web de la Dirección General de Protección Civil y Emergencias (art. único.2). El DOE del Decreto 127/2009 (PLASISMEX) publica solo el decreto, y el texto del plan está en juntaex.es. Por eso el texto sale del PDF de juntaex.es, y en pantalla se enlazan los dos: el del plan y el del decreto en el DOE.

Los PDF de juntaex.es se descargaron de nuevo el 01/11/2026. Son el mismo fichero (sha256 en `meta.json`) con el que se hicieron las fichas.

## Vigencia (comprobación manual, 01/11/2026)

- **Fichas ELI** (`doe.juntaex.es/eli/es-ex/d/…`):
  - Los decretos de los planes solo tienen la versión original publicada.
  - El Decreto 132/2022 tiene la versión consolidada de 05/11/2024 (Decreto 136/2024) y ninguna posterior.
- **Búsqueda de decretos posteriores** que actualicen o deroguen cada plan: no se ha localizado ninguno.
  - El Decreto 39/2025 deroga el 188/2019, que era el INUNCAEX anterior.
  - La Junta anunció en octubre de 2026 que revisará los planes.
  - Para el PLASISMEX, la [Orden INT/1069/2026 (BOE-A-2026-21145)](https://www.boe.es/eli/es/o/2026/10/07/int1069), publicada el 10/10/2026 y efectiva desde el 11/10/2026, sustituye la Directriz sísmica de 1995 y establece que los planes se adapten en cuatro años; el PDF de PLASISMEX consultado aún hace referencia a la Directriz anterior.
- `python3 scripts/verificar_vigencia_boe.py` lista estas normas como «comprobado a mano» (no pueden pasar por la API del BOE). La tabla está en `docs/VIGENCIA_MATERIAL_BOE.md`.
- Lo que se buscó, por norma, está en `busqueda` de `scripts/fuentes_doe/<ID>.json`, y la pantalla lo muestra.

## «Ver en el esquema» desde las fichas

- La cita de la ficha empieza por la clave de la fuente («PLATERCAEX, IV.3.1, pág. 35…», «INUNCAEX, cap. V, 2.1…», «Plan INFOEX (…), art. 10.1»).
- El apartado citado da el bloque. Si el apartado no tiene bloque propio, vale el que lo contiene (RADIOCAEX 4.3.2 → 4.3).
- Resultado: llegan al bloque 24/24 fichas de T20, 80/81 de T29 y 84/87 de T30. Las 4 que no llegan citan la introducción del PLATERCAEX, el cap. I §4 del INUNCAEX y el 1.3 del PLASISMEX, que quedan fuera del recorte.
- En la comprobación de páginas, la página citada por la ficha está dentro del apartado al que lleva en 183 de las 188 fichas que llegan al bloque. Las otras 5 citan V.2 del PLATERCAEX en las págs. 49–50. Esas páginas son tablas, y en el material quedan como remisión al PDF.
