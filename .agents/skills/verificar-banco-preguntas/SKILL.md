---
name: verificar-banco-preguntas
description: Verificación automática de preguntas tipo test de BomberoPro contra fuente oficial (BOE, temario, normativa) antes de la revisión humana — estructura, duplicados, respuesta correcta con cita, ambigüedad, normativa derogada y cobertura por tema. Usar al generar, importar o auditar preguntas. Nunca publica: como máximo deja una pregunta lista para revisión humana.
---

# Verificar banco de preguntas — BomberoPro

Objetivo: que el revisor humano solo vea preguntas que ya tienen fuente localizada, y que ninguna pregunta errónea llegue al alumno.

Esta skill **prepara** la revisión humana; no la sustituye. Respeta `AGENTS.md`: las preguntas `borrador_ia` o `validado_automatico` no llegan al alumno hasta revisión humana.

## 0. Antes de tocar nada

1. Lee `AGENTS.md`, `docs/DECISIONS.md`, `docs/pipeline-integration.md` y `docs/supabase-contract.md`.
2. Comprueba el esquema **real** de la tabla de preguntas (migraciones en `supabase/migrations/` y entorno de prueba). No lo infieras de `src/types.ts`.
3. Identifica el campo de estado QA persistido y sus valores reales. Hoy conviven tres vocabularios y hay que mapearlos explícitamente, no asumir:
   - `docs/pipeline-integration.md`: `borrador_ia / validado_automatico / validado_humano`
   - `src/types.ts`: `borrador / revision / aprobada / rechazada`
   - Flujo editorial: `APTA / CORREGIR / DESCARTAR`
   Si el mapeo no está documentado, **para y repórtalo**. No inventes columnas ni estados: un cambio de esquema va en su propio PR con migración, entorno de prueba y recuperación.
4. Distingue siempre convocatoria CPEI Badajoz de Ayuntamiento de Badajoz: temarios y reglas distintos.

## 1. Capa 1 — Código (gratis, 100 % del lote)

Script determinista, sin LLM:

- **Estructura:** 4 opciones no vacías, `respuesta_correcta` en 0–3, tema, dificultad, `fuente` y `version_convocatoria` presentes.
- **Duplicados:** normaliza el enunciado (minúsculas, sin tildes ni puntuación, espacios colapsados), aplica `sha256` y compara. Para casi-duplicados, similitud de embeddings ≥ 0,95 si ya existen.
- **Señales de pregunta generada por IA:** la correcta es mucho más larga que las demás, "todas/ninguna de las anteriores", doble negación, enunciado muy corto.
- **Normativa sospechosa:** referencias a normas derogadas o sustituidas.

Lo que falla aquí se marca para `CORREGIR` o `DESCARTAR` con motivo. El resto pasa a la capa 2.

## 2. Capa 2 — Fuente (modelo barato + RAG)

Para cada pregunta, recupera como máximo 5 fragmentos normativos y pide **solo JSON**:

```json
{
  "respuesta_segun_fuente": 1,
  "coincide_con_banco": true,
  "cita": "Ley 31/1995, art. 15.1.a",
  "fragmento_id": "boe-1995-24292-art15",
  "ambigua": false,
  "otra_opcion_defendible": null,
  "confianza": 0.93
}
```

Regla dura: **sin `cita` y `fragmento_id` reales del índice no hay validación automática.** Si no aparece fuente, se marca para revisión con motivo `sin_fuente`; nunca se rellena con conocimiento general.

Candidata a `validado_automatico` (o su equivalente real): coincide con el banco, confianza ≥ 0,85, no ambigua y con cita.

## 3. Capa 3 — Segunda opinión (solo las dudosas)

Solo para confianza entre 0,6 y 0,85, desacuerdo con el banco o ambigüedad. Usa un modelo **distinto** al que generó la pregunta.

- Si ambos coinciden en que el banco está mal: propuesta `CORREGIR` con la respuesta correcta y la cita.
- Si discrepan: revisión humana prioritaria.

## 4. Lo que nunca hace esta skill

- Marcar una pregunta como `validado_humano` / `APTA` / `aprobada`, ni hacerla visible al alumno.
- Borrar preguntas o reescribir enunciados en la base de datos.
- Escribir en producción. Trabaja sobre exportación JSON o entorno de prueba; la carga se hace por el pipeline (`scripts/transform_pipeline.cjs`) con PR revisado.
- Validar temas cuya fuente es documentación interna del CPEI sin que esa fuente esté indexada (motivo `sin_fuente_interna`).

## 5. Informe (siempre)

| Tema | Total | Candidata a validado_automatico | CORREGIR | DESCARTAR | Sin fuente |
|---|---|---|---|---|---|

Además:
- Las 10 peores, con motivo y cita.
- Temas con menos de 50 preguntas validadas por humano (prioridad de generación).
- Tasa de error por generador (Claude / GPT / Antigravity), si el origen está registrado.
- Coste y tiempo del lote.

## Operativa

- Lotes de 50–100, idempotentes (saltar lo ya verificado con el mismo hash).
- Más de 500 preguntas: ejecutar en GitHub Actions, no en el portátil.
- Resultados como archivo en el PR o como propuesta, nunca como escritura directa en el banco.
