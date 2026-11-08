# Operación: cómo se organizan los chats y agentes

Problema detectado (26/10/2026): ≥10 chats de BomberoPro con solapes (arquitectura, auditoría, contenido, plan, gestión). Cada uno reconstruye el estado desde cero (p. ej. buscar «los 3 arreglos» en otros chats) y `ESTADO_PROYECTO.md` llevaba 3 meses sin actualizarse.

## Estructura: 3 chats permanentes (un fundador solo no mantiene 4)
| Chat (fijo) | Qué entra | Qué NO entra |
|---|---|---|
| **Construir** | código, UI, PRs, migraciones, auditorías, seguridad, KPIs de calidad | cargar temario |
| **Contenido** | temas, conceptos, preguntas, fuentes BOE, enlazado | código |
| **Crecimiento** | precio, landing, marca, competencia, beta, convocatoria | código |
Tarea puntual grande → chat temporal que termina en un PR o documento y se abandona.
Todo lo demás (Alfredo, obra, SEPE, PC…) va en chats aparte, fuera de BomberoPro.

## Reglas
1. **Un solo estado:** `docs/ESTADO_VIVO.md`. Al abrir un chat: «lee docs/ESTADO_VIVO.md». Al cerrar: actualizarlo (dueño + siguiente acción por punto).
2. **Una decisión, un sitio:** decisiones cerradas en `ESTADO_VIVO.md` (sección «Decisiones»); detalle técnico en `docs/DECISIONS.md`.
3. **Cada pendiente nombra a quien responde y dónde:** «JM → …» o «Claude → …».
4. **Cambios en BD:** siempre staging → test → producción, migración con `_down` y registro en `qa_changes_20260923`.
5. **Reparto de agentes, autonomía y permisos:** `AGENTS.md`, apartado «Equipo de agentes». Aquí solo se registra el estado comprobado de cada uno (tabla de abajo).
6. **Cierre de chat:** 5 líneas: hecho / verificado cómo / pendiente con dueño / riesgos / PR enlazadas.

## Arranque de cada chat (copiar/pegar)
- Construir: «Lee docs/ESTADO_VIVO.md y CLAUDE.md. Rol: CTO y auditor (error >2 % ⇒ no lanzar). Tarea: …»
- Contenido: «Lee docs/ESTADO_VIVO.md y usa la skill bomberopro-contenido-temario. Tema: …»
- Crecimiento: «Lee docs/ESTADO_VIVO.md. Rol: CEO/CMO. Objetivo: primeros 10 usuarios beta de pago.»

## Autonomía comprobada de cada agente (08/11/2026)
Estados definidos en `AGENTS.md`. Se cambia solo con evidencia enlazada; lo no comprobado queda NO VERIFICADO.

| Agente | Estado | Evidencia / qué falta |
|---|---|---|
| Claude | AUTÓNOMO VERIFICADO (tareas programadas) · BAJO SESIÓN (código) | Tareas diarias con última ejecución correcta el 08/11: reportes de preguntas, 3 opciones y tildes, vigilancia BOE. La comprobación semanal de CI necesita el ordenador de JM y no se ejecuta desde el 26/10. Las PR de código (#265) salen de sesiones abiertas. |
| Codex | BAJO SESIÓN | Ramas `codex/` y PR #263. La revisión automática de `auto-codex-review.yml` **no funciona**: el paso termina en 0 s y no publica comentarios (ejecución del 08/11 en #265). Probable falta de `OPENAI_API_KEY`, que sería gasto de API; el nombre del paquete del CLI tampoco está comprobado. La etiqueta `codex-review-pendiente` solo indica que la PR viene de `claude/` o `antigravity/`. |
| Grok | BAJO SESIÓN | PR #264 (rama `grok/`), fusionada el 08/11. Ejecución desatendida sin comprobar. `auto-codex-review` no se activa para `grok/`. |
| Gemini | NO VERIFICADO | Sus auditorías llegan al repo a través de PR de otros (`docs/AUDITORIA_GEMINI_*`, #263). Sin ramas ni PR propias. |
| DeepSeek | NO VERIFICADO | Sin ramas ni commits en este repo. Su trabajo está en `bomberopro-editorial`, al que Claude no tiene acceso: falta comprobar la PR #2 allí. |
| Antigravity | NO VERIFICADO | Última rama `antigravity/` del 02/08. La vigilancia de convocatorias la hace la tarea programada de Claude, no Antigravity. |

Para subir a AUTÓNOMO VERIFICADO: una tarea asignada por incidencia y resuelta con PR sin que JM abra una conversación, sin coste de API adicional.
