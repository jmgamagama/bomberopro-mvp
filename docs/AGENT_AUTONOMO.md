# Ejecución autónoma acotada

Este procedimiento permite que un agente complete tareas pequeñas y verificables en una rama. `TASKS.md` es una cola documental; no inicia por sí mismo un agente, una tarea programada ni un flujo de CI.

## Prompt de arranque

Pega este texto en el agente de terminal o IDE que estés usando:

```text
Actúa como agente de implementación de BomberoPRO. Trabaja en la rama indicada por el usuario y no fusiones cambios.

1. Lee AGENTS.md, docs/DECISIONS.md y TASKS.md. Comprueba que las decisiones siguen vigentes en el código de la rama.
2. Revisa la primera tarea PENDIENTE. Si ya está resuelta, verifica su evidencia y actualiza su estado sin duplicar código.
3. Para una tarea real, lee solo los archivos afectados, sus pruebas y la fuente enlazada por los criterios de aceptación. Implementa el cambio mínimo que cumpla esos criterios.
4. Ejecuta exactamente las comprobaciones de TASKS.md y las que exija AGENTS.md. No marques HECHA si una comprobación no se pudo ejecutar o falló.
5. Actualiza TASKS.md con el estado, los archivos y el resultado comprobable. Continúa con tareas independientes autorizadas, con un máximo de tres por ciclo.
6. Si falta una decisión, fuente, permiso o entorno, deja la tarea BLOQUEADA con la causa y sigue solo con otra tarea independiente.
7. No cambies el esquema de datos, no escribas en producción, no publiques contenido no revisado, no cambies el baremo sin fuente y revisión, no envíes comunicaciones externas y no fusiones PR.
8. No repitas una prueba fallida sin leer su salida; tras dos intentos de corrección sin avance, bloquea la tarea.
9. Al finalizar el ciclo, entrega un resumen breve con tareas, archivos, pruebas y bloqueos.

No leas el repositorio entero, no inventes trabajo para mantener el bucle y no prometas un ahorro fijo de tokens.
```

## Uso

- Mantén tareas pequeñas, con objetivo, archivos probables, criterio de aceptación y comando de comprobación.
- Limita cada lote a tareas relacionadas. El límite de tres permite continuidad sin dejar un bucle largo sin revisión.
- Si el agente admite compactar contexto, conserva antes un resumen de los cambios y del estado de la cola. El comando y la disponibilidad dependen del producto.
- Revisa el diff y los checks de la PR antes de fusionar. Los cambios en puntuación de examen, privacidad, datos o publicación de contenido requieren revisión humana según `AGENTS.md`.

## Límites observados en la propuesta inicial

- El repositorio ya tenía el contenedor móvil preparado con `dvh` e insets seguros.
- El baremo y sus pruebas unitarias ya existían; se reutilizan.
- `npm run test`, `npm run lint` y `npm run build` son los comandos del `package.json` actual. Comprueba de nuevo ese archivo si cambia el proyecto.
- Una cola Markdown coordina el trabajo, pero no mantiene despierto ni relanza por sí sola Cursor, Roo Code, Claude Code o Aider. Para ejecución desatendida hace falta un runner compatible y una política de límites y aprobación propia.
