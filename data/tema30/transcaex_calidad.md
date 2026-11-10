# TRANSCAEX (Decreto 189/2019) — informe de calidad

- **Fuente**: texto oficial del DOE del plan (tema 30). Citas literales validadas por script.
- **Alcance**: capítulos 1 a 5 (objeto, definiciones, organización, grupos de acción, operatividad). No cubre anexos ni listados de municipios.
- **Recuentos**: 66 conceptos, 198 preguntas (N1 2 opciones, N2 y N3 3 opciones). Prioridad 1: 34, 2: 25, 3: 7. Orden 1100–1750. Estado: borrador.
- **Validador** `scripts/validar_conceptos.py`: OK, sin avisos de longitud.
- **Revisión ciega**: agente independiente, 198 preguntas (exámenes A y B, clave aparte). Coincidencia con la clave en 197 de 198; discrepancia en A088 (distractores míos mal construidos, no eran grupos de acción oficiales).
  - Marcadas como dudosas: A088, B024 (el apdo. 4.3.5 condiciona a la petición de la Dirección y el 5.4.3.2 no), B042 (dos opciones casi iguales). Las tres se reescribieron (B024 ahora cita el apdo. 4.3.5) y una segunda revisión ciega las dio por correctas y sin ambigüedad.
- **Observaciones del texto oficial** (no afectan a las preguntas): errata «Piscosocial» en el 4.4.4; el 4.4.4.6 llama «Grupo de Acción Social» al Psicosocial; el párrafo inicial del 4.4.4 cita el Plan Territorial.
- **Límite**: las preguntas de las 3 reescrituras fueron revisadas solo por la segunda pasada de un único revisor.
- **Pruebas**: `node supabase/tests/conceptos_tema30_planes.pglite.mjs` OK con INUNCAEX y TRANSCAEX.
