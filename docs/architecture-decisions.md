# Decisiones de arquitectura — respuesta al "Necesita Claude" de AUDIT.md (PR #6)

Este documento resuelve las 8 decisiones que Codex marco como bloqueadas en `AUDIT.md` (auditoria de MIRA, issue #2). Sirve de base para las siguientes tareas de implementacion de Codex y Antigravity.

## 1. Contrato frontend/backend para preguntas

El cliente no debe recibir `correct_answer` en el payload inicial de la pregunta. Hoy MIRA no tiene backend, asi que esto no es corregible sin infraestructura nueva (ver decision 4). Objetivo: el cliente pide una pregunta (sin respuesta correcta), el usuario responde, y un endpoint server-side devuelve `correcto: boolean` + `explicacion`. No es urgente para una demo/piloto cerrado, pero es bloqueante antes de vender acceso a clientes reales (riesgo 1 de AUDIT.md).

## 2. Modelo de datos: fuente, tema, QA, versionado, reportes

Ya resuelto en gran parte por `docs/pipeline-integration.md` y `data/temario/cpei-badajoz-2026-anexo1.md`. Ampliar `src/types.ts` -> `Question` con: `fuente`, `version_convocatoria`, `tema` (numero + titulo segun la taxonomia oficial), `estado_qa`, `reportes[]`. Mismo esquema en app y en pipeline, sin traducir entre dos formatos distintos.

## 3. engine.ts: ¿canonico o placeholder?

Es un placeholder razonable, no basura: implementa conceptos reales de SM-2 (recuperabilidad, estabilidad, seleccion adaptativa). Decision: se mantiene como base canonica, no se reescribe desde cero. Pero se retira cualquier texto de producto que afirme que esta "calibrado" (no hay datos reales que lo respalden todavia) — ver decision 7.

## 4. Persistencia real

Decision: Supabase (Postgres + Auth + RPC) en vez de backend propio desde cero. Es el camino mas barato y rapido para un fundador solo, tiene capa gratuita suficiente para el piloto, y resuelve a la vez la decision 1 (RPC server-side que no expone la respuesta correcta).

## 5. Alcance del motor de confianza

Se separan 4 conceptos que hoy se mezclan bajo "confianza":
- `confianza_usuario`: ya existe, autoinformada por intento.
- `estado_qa`: estado editorial del contenido (ya en el esquema del pipeline).
- `fuente_confianza`: fiabilidad de la fuente (bases oficiales / ITF oficial > legislacion general > fuente no verificada).
- `confianza_generacion`: solo aplica a preguntas generadas por IA — ya implementado en `extractor.py` via el enrutado a `revision_humana.csv`.

## 6. Politica de dependencias

Eliminar (confirmado sin uso en AUDIT.md): `@google/genai`, `express`, `@types/express`, `dotenv`, `motion`, `tsx`. Corregir `vite` duplicado en `dependencies`/`devDependencies`. Regenerar `package-lock.json` (esta vacio). Esto es mecanico y de bajo riesgo — apto para asignarselo a Codex como tarea acotada.

## 7. UX para claims sin validar

Cambiar copy que promete mas de lo que hay:
- "Algoritmo cognitivo MIRA calibrado" -> "Algoritmo de repeticion espaciada (basado en SM-2)"
- Quitar "oficial" de cualquier simulacro que no este construido exclusivamente con preguntas de examenes oficiales reales.

Esto evita un riesgo de publicidad enganosa cuando haya clientes de pago.

## 8. Blueprint de simulacros

Con el temario de Badajoz ya en el repo, esto se puede definir en concreto:
- 55 preguntas por simulacro (50 + 5 de reserva, igual que el examen real)
- 30% de las preguntas de los temas 35-40 (peso real segun las bases)
- Sin repeticion dentro de una misma sesion
- Semilla de aleatoriedad (RNG) guardada por intento, para poder reproducir y auditar cualquier simulacro despues

## Siguiente paso

Estas decisiones desbloquean la siguiente tarea de Codex (limpieza de dependencias, decision 6) y la de Antigravity (ampliar `types.ts` con el esquema de la decision 2, una vez el PR de esquema este fusionado a main).
