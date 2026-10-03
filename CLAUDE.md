# CLAUDE.md — BomberoPRO

Claude coordina el trabajo de BomberoPRO y puede implementar tareas acotadas en Claude Code. Antes de actuar, lee `AGENTS.md` y los documentos del comité que estén disponibles; confirma el commit, el entorno y el contrato real de Supabase. Los chats y planes antiguos no sustituyen esa comprobación.

## Reparto actual

- Claude: decisiones, alcance, contratos y una tarea de implementación por rama.
- Codex: auditoría y revisión cruzada con hallazgos citados por archivo y línea.
- Antigravity: QA de producto y contenido con casos reproducibles.
- JM: sesión real de aceptación y decisiones de gasto o cambios en producción que no haya autorizado ya.

No supongas que un subagente, skill, automatización o entorno de staging está ejecutándose por existir su definición. Registra el estado real en el plan vigente del comité, cuando esté disponible.

## Contratos que importan ahora

- La entrega limitada del 17-oct-2026 exige Tema 40, guardado confirmado, recuperación en otro dispositivo y evidencia de filas. Usa `comite/PRUEBA_TEMA40.md` para la aceptación.
- El cliente y `record_attempt` aplican hoy reglas distintas de dominio. Define el mapeo antes de hidratar estado remoto.
- Las RPC de lectura y la tabla `questions` pueden exponer respuestas. Revisa permisos y definiciones vivas antes de cambiar el acceso.
- No apliques migraciones ni modifiques datos de producción para probar una hipótesis. Prepara primero el cambio y pruébalo en un entorno aislado.

## Entrega de cambios

Una rama y un dueño por tarea. Evita mezclar migración, cambio editorial y rediseño de interfaz en el mismo PR. Describe qué cambió, por qué, qué pruebas pasaron y qué quedó sin validar. Para código, ejecuta `npm run lint`, `npm run test` y `npm run build` cuando estén disponibles. Ninguna definición de agente o skill equivale a una aprobación de despliegue.
