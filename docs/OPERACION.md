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
5. **Reparto de agentes** (CLAUDE.md): Claude = algoritmo/schema/decisiones; Codex = revisión de PRs y tests; Antigravity = vigilancia de convocatorias.
6. **Cierre de chat:** 5 líneas: hecho / verificado cómo / pendiente con dueño / riesgos / PR enlazadas.

## Arranque de cada chat (copiar/pegar)
- Construir: «Lee docs/ESTADO_VIVO.md y CLAUDE.md. Rol: CTO y auditor (error >2 % ⇒ no lanzar). Tarea: …»
- Contenido: «Lee docs/ESTADO_VIVO.md y usa la skill bomberopro-contenido-temario. Tema: …»
- Crecimiento: «Lee docs/ESTADO_VIVO.md. Rol: CEO/CMO. Objetivo: primeros 10 usuarios beta de pago.»
