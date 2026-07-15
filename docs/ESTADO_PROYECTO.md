# Estado del proyecto — BomberoPro / MIRA

Última actualización: 2026-07-15, por Claude (Cowork), al cierre de esta sesión.

## Repositorio

`jmgamagama/bomberopro-mvp` — rama por defecto `main`.

## Protección de rama `main`

Regla activa sobre `main`: requiere pull request antes de fusionar y requiere que los status checks pasen. Se retiró el requisito de "Require approvals" (bloqueaba todo merge porque el único usuario humano —jmgamagama— es a la vez owner y autor de cada PR, y GitHub no permite auto-aprobación). Con esto, jmgamagama puede fusionar sus propios PRs sin quedar bloqueado por sudo/approval loops.

## Pull requests fusionados en esta sesión

Todos fusionados a `main`, en este orden:

- **PR #5** — `[claude] Fix: el workflow de revision nunca se disparaba` (commit `762948a`). Corrige el trigger de `auto-codex-review.yml` para que se dispare en PRs contra `main`.
- **PR #3** — `[claude] Contrato de datos: pipeline Biblioteca Cognitiva -> repo` (commit `29ecbb6`). Añade `docs/pipeline-integration.md`, el esquema de datos que conecta el pipeline de generación de preguntas con el repo.
- **PR #6** — `[codex] Auditoria tecnica inicial de MIRA` (commit `78679e7`). Añade `AUDIT.md`, cierra el issue #2. Documenta qué es UI real vs. mock en el código exportado de AI Studio, dependencias sobrantes, huecos en el modelo de datos, y una lista de 8 decisiones bajo "Necesita Claude".
- **PR #7** — `[claude] Temario oficial CPEI Badajoz 2026 (Anexo I)` (commit `2e5ebcc`). Añade `data/temario/cpei-badajoz-2026-anexo1.md`: los 40 temas oficiales de la convocatoria, estructura del examen (55 preguntas, penalización, 30% de peso en temas 35-40), y objetivo de cobertura del banco de preguntas (~1.100-1.200 preguntas). Nota: temas 38-40 requieren documentos internos del CPEI (ITF/protocolos) no incluidos en las bases.
- **PR #8** — `[claude] Decisiones de arquitectura: respuesta al contrato v0 de AUDIT.md` (commit `93250b2`). Añade `docs/architecture-decisions.md`, resolviendo las 8 decisiones pendientes de PR #6: contrato frontend/backend, modelo de datos, alcance de `engine.ts`, persistencia (Supabase), motor de confianza, limpieza de dependencias, copy UX, blueprint de simulacros.

## Issues

- **Issue #2** (auditoría técnica) — cerrado vía PR #6. Se dejó un comentario con el resumen del contrato v0 y luz verde para que Codex abra su siguiente batch de PRs (limpieza de dependencias, copy UX, y lo que dependa de las demás decisiones).

## Decisiones de arquitectura tomadas (ver `docs/architecture-decisions.md`)

1. El cliente no debe recibir `correct_answer` al cargar una pregunta; requiere backend con RPC. No urgente para demo/piloto cerrado, bloqueante antes de vender acceso.
2. `src/types.ts` → `Question` se amplía con `fuente`, `version_convocatoria`, `tema`, `estado_qa`, `reportes[]`, mismo esquema que el pipeline.
3. `engine.ts` se mantiene como base canónica (SM-2 real); se retira el copy "calibrado" sin datos que lo respalden.
4. Persistencia real: Supabase (Postgres + Auth + RPC), no backend propio.
5. Motor de confianza se separa en `confianza_usuario`, `estado_qa`, `fuente_confianza`, `confianza_generacion`.
6. Dependencias a eliminar: `@google/genai`, `express`, `@types/express`, `dotenv`, `motion`, `tsx`; corregir `vite` duplicado; regenerar `package-lock.json` (vacío).
7. Copy UX: quitar claims sin validar ("calibrado", "oficial" en simulacros no oficiales).
8. Blueprint de simulacro: 55 preguntas (50+5 reserva), 30% de temas 35-40, sin repetición por sesión, RNG con semilla registrada.

## Estado de despliegue

No hay despliegue en producción todavía. El proyecto sigue en fase de desarrollo local/repositorio: no se ha configurado hosting, dominio, ni pipeline de CI/CD más allá del workflow de code review automático (`auto-codex-review.yml`). Supabase está autorizado por OAuth en la cuenta de GitHub del usuario pero la integración de código (`src/lib/supabase.ts`, `src/hooks/useDatabase.ts`) se está construyendo en una conversación separada de Antigravity, en curso al cierre de esta sesión — no confirmada como fusionada a `main` todavía.

## Pendiente / siguientes pasos

- Codex: PR de limpieza de dependencias (decisión 6) y de copy UX (decisión 7) — ya tiene luz verde, puede abrirlos directamente.
- Antigravity: ampliar `types.ts` con el esquema de la decisión 2, una vez esté fusionado el PR de esquema de Supabase que ya tiene en curso.
- Pendiente de decidir/ejecutar: integración real de Supabase a `main` (revisar que no choque con nada de lo fusionado en esta sesión — se confirmó que ninguno de los PRs #3/#5/#6/#7/#8 toca `src/lib/` ni `src/hooks/`, así que no hay riesgo de conflicto).
- Pendiente: conseguir los documentos internos del CPEI (ITF, protocolos, procedimientos) para poder generar preguntas de los temas 38-40.
- Pendiente: crédito/presupuesto para generación de banco de preguntas con IA (Gemini 2.5 Flash u otro modelo) — el usuario preguntó por esto, ver conversación para detalle de costes.

## Nota sobre continuidad

A partir de este punto, el trabajo de ingeniería sobre este repositorio continúa en Claude Code, no en otra sesión de Cowork. Esta sesión de Cowork se da por cerrada tras este commit.
