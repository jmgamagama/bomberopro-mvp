# TASKS.md — Cola de trabajo BomberoPRO

Actualizado: 03/11/2026. Fuente de proceso: `AGENTS.md` y `docs/DECISIONS.md`.

## Estados

- **PENDIENTE**: puede iniciarse cuando se cumplan sus dependencias.
- **EN CURSO**: un agente está trabajando en la tarea.
- **VERIFICANDO**: el cambio está hecho; faltan las comprobaciones obligatorias o CI.
- **BLOQUEADA**: falta una fuente, decisión o entorno. Registrar el motivo y no fingir que está terminada.
- **HECHA**: criterios aceptados y comprobaciones requeridas con resultado satisfactorio.

Una tarea puede quedar **HECHA · ya existía** cuando la auditoría encuentra una implementación que cumple sus criterios. Anota los archivos que lo demuestran; no dupliques esa funcionalidad.

## Cola actual

### AUTO-01 · Acción para revelar la ficha — VERIFICANDO

- **Objetivo:** que «Mostrar respuesta» sea la acción principal, con el azul institucional `#1b365d`, un área táctil de al menos 48 px y foco visible para teclado.
- **Archivos:** `src/components/DailySession.tsx`; `src/components/DailySession.plan.test.tsx`.
- **Aceptación:** el botón conserva el comportamiento de revelar y sus estilos pasan la comprobación automatizada.
- **Comprobaciones:** `npm run lint`, `npm run test`, `npm run build`.
- **Estado:** código preparado en una rama de revisión; pendiente del resultado de CI.

### AUTO-02 · Área segura móvil — HECHA · ya existía

- **Auditoría:** la raíz usa `min-h-dvh`; el contenido principal incluye `env(safe-area-inset-bottom)` y la navegación móvil aplica su propio inset.
- **Evidencia:** `src/App.tsx`. No se añade padding duplicado a cada pantalla.

### AUTO-03 · Baremo CPEI — HECHA · ya existía

- **Auditoría:** la puntuación pura está centralizada en `src/utils/examScoring.ts`; las bases de CPEI están registradas en `docs/DECISIONS.md`.
- **Evidencia:** `calculateExamScore`, `examScoreBreakdown`, `isExamPassed` y `scoreOutOfTen`. No se crea un segundo calculador.

### AUTO-04 · Casos límite del baremo — HECHA · ya existía

- **Auditoría:** `src/utils/examScoring.test.ts` cubre notas negativas, baremo oficial y el límite exacto de aprobado.
- **Aclaración:** el calculador no ordena aspirantes ni define desempates. No se inventa una regla de empate que no figure en las bases.

## Protocolo de ejecución

1. Trabaja en la primera tarea **PENDIENTE** y comprueba primero si ya está resuelta en la rama objetivo.
2. Lee los archivos afectados, sus pruebas y la fuente oficial o decisión asociada. Evita releer archivos ajenos a la tarea.
3. Mantén una tarea acotada por cambio y crea una rama `codex/<tipo>-<descripcion>`. No mezcles cambios editoriales, migraciones y rediseños sin motivo.
4. Ejecuta los comandos de comprobación indicados en la tarea. Si el entorno no permite ejecutarlos, deja la tarea en **VERIFICANDO** o **BLOQUEADA**, según corresponda; nunca la marques **HECHA**.
5. Al cerrar una tarea, registra archivos y evidencia concreta. Continúa con tareas independientes ya autorizadas, hasta un máximo de **3 tareas por ciclo**.
6. Si una prueba falla, lee el error y realiza hasta dos intentos de corrección con cambios razonados. Si sigue fallando o el entorno no puede verificarlo, bloquea la tarea y deja el diagnóstico.
7. No fusiones PR, no escribas en producción, no cambies datos o políticas de privacidad y no expongas preguntas no revisadas. Esas acciones requieren los controles definidos en `AGENTS.md`.
8. Detente ante requisitos ambiguos, fuentes oficiales ausentes, conflictos de decisiones o tareas que necesiten una decisión humana. No uses `git reset --hard` para salir de un problema.
9. Al terminar el ciclo, informa en pocas líneas qué quedó hecho, qué comprobaciones pasaron y qué bloquea lo demás. Usa compactación de contexto solo si la herramienta concreta la ofrece; no presupongas que todos los agentes tienen esa función.

No se fija una cuota de tokens ni un ahorro porcentual: el coste depende del modelo, las herramientas y el tamaño real de cada tarea.
