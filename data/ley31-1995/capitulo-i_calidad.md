# Tema 6 · Ley 31/1995 · Capítulo I (arts. 1-4) — informe de calidad

**Epígrafe (BOP Badajoz n.º 135, 17/07/2026):** Ley 31/1995 de PRL: objeto, ámbito de aplicación y definiciones; política en materia de prevención; derechos y obligaciones; servicios de prevención. Este bloque cubre **objeto, ámbito y definiciones (arts. 1-4)**.

## Fuente
- Texto consolidado del BOE `BOE-A-1995-24292`, descargado por el workflow «Fuentes oficiales BOE» el 23/10/2026 (`data/fuentes/BOE-A-1995-24292/meta.json`, sha256 `d1d8f4b362d9…`).
- El art. 3.4 está **suprimido** (RD-ley 16/2022), por lo que no genera concepto.

## Recuentos reales
- 16 conceptos y 48 preguntas (una de cada nivel por concepto).
- Por artículo: art. 1 → 1; art. 2 → 2; art. 3 → 4; art. 4 → 9.
- El art. 4 tiene 8 definiciones. El «riesgo grave e inminente» se divide en 2 conceptos porque su párrafo sobre exposición a agentes («aunque los daños no se manifiesten de forma inmediata») es una trampa típica.

## Validador
`python3 scripts/validar_conceptos.py data/ley31-1995/capitulo-i.json --desde a1 --hasta a4` → **OK**: citas literales, todos los apartados vigentes cubiertos y sin avisos de longitud.

## Revisión ciega
- Un agente independiente respondió las 48 preguntas con las letras barajadas y solo con el texto oficial: **48/48 de coincidencia con la clave**.
- Marcó 3 detalles de redacción que podían dar pistas (concordancia del enunciado con las opciones). Están corregidos y el validador se volvió a ejecutar.

## Estado
- **Staging:** cargados 4 conceptos y 12 preguntas (arts. 1-3.1) para probar el cargador generalizado. El resto se carga con el mismo SQL.
- **Producción:** sin cargar. Pendiente de la aprobación de JM; después se carga como `publicado`, o como `borrador` si se quiere revisar en la app.
- **Pendiente:** vincular las 176 preguntas antiguas del tema 6 (paso 3 del protocolo) y los capítulos II-IV (arts. 5-32 bis).
