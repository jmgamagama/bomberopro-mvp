# Operación: cómo se organizan los chats y agentes

Problema detectado (26/10/2026): ≥10 chats de BomberoPro con solapes (arquitectura, auditoría, contenido, plan, gestión). Cada uno reconstruye el estado desde cero (p. ej. buscar «los 3 arreglos» en otros chats) y `ESTADO_PROYECTO.md` llevaba 3 meses sin actualizarse.

## Estructura: 4 chats permanentes + 1 por tarea
| Chat (fijo) | Qué entra | Qué NO entra |
|---|---|---|
| **1 Producto y código** | features, UI, PRs, bugs, despliegues | contenido de temario |
| **2 Contenido** | cargar/revisar temas, preguntas, conceptos, fuentes BOE | cambios de código |
| **3 Calidad y seguridad** | auditorías, RLS, migraciones de corrección, KPIs | features nuevas |
| **4 Negocio y crecimiento** | precio, landing, marca, competencia, beta | código |
Todo lo demás (Alfredo, Eugenio Hermoso, SEPE, PC…) va en chats aparte, fuera de BomberoPro.
Tarea puntual grande → chat temporal que termina con un PR o un documento y se abandona.

## Reglas
1. **Un solo estado:** `docs/ESTADO_VIVO.md`. Al abrir un chat: «lee docs/ESTADO_VIVO.md». Al cerrar: actualizarlo (dueño + siguiente acción por punto).
2. **Una decisión, un sitio:** decisiones cerradas en `ESTADO_VIVO.md` (sección «Decisiones»); detalle técnico en `docs/DECISIONS.md`.
3. **Cada pendiente nombra a quien responde y dónde:** «JM → …» o «Claude → …».
4. **Cambios en BD:** siempre staging → test → producción, migración con `_down` y registro en `qa_changes_20260923`.
5. **Reparto de agentes** (CLAUDE.md): Claude = algoritmo/schema/decisiones; Codex = revisión de PRs y tests; Antigravity = vigilancia de convocatorias.
6. **Cierre de chat:** 5 líneas: hecho / verificado cómo / pendiente con dueño / riesgos / PR enlazadas.

## Arranque de cada chat (copiar/pegar)
- Producto: «Lee docs/ESTADO_VIVO.md y CLAUDE.md. Rol: CTO. Tarea: …»
- Contenido: «Lee docs/ESTADO_VIVO.md y usa la skill bomberopro-contenido-temario. Tema: …»
- Calidad: «Lee docs/ESTADO_VIVO.md y docs/AUDITORIA_PREMORTEM_2026-10-26.md. Rol: auditor. Regla: error >2 % ⇒ no lanzar.»
- Negocio: «Lee docs/ESTADO_VIVO.md. Rol: CEO/CMO. Objetivo: primeros 10 usuarios beta de pago.»
