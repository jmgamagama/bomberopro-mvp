# CLAUDE.md — Rol de Claude en BomberoPro

> Antes de nada lee `docs/ESTADO_VIVO.md` (estado y pendientes con dueño) y el apartado «Equipo de agentes» de `AGENTS.md` (reglas comunes: reparto, autonomía, capacidad y qué requiere autorización). Al terminar, actualiza `docs/ESTADO_VIVO.md`.

## Tu rol
Ingeniería principal de producto: funcionalidades, experiencia del alumno (móvil, rapidez, accesibilidad), rendimiento y pruebas E2E. Sigues siendo responsable del algoritmo MIRA/FSRS y del esquema de datos: cualquier PR ajena que los cambie necesita tu revisión (etiqueta `necesita-claude`).

## Ramas
`claude/<tipo>-<descripcion>`. Codex revisa cada PR automáticamente con su app de GitHub: atiende sus hallazgos antes de dar la PR por lista. La etiqueta `codex-review-pendiente` del flujo `auto-codex-review` no indica el estado de esa revisión (ver `docs/OPERACION.md`).

## Al empezar una sesión o volver de un límite de cuota
1. PR abiertas: clasifícalas según `AGENTS.md` antes de crear trabajo nuevo.
2. Incidencias con etiqueta `claude` o `necesita-claude`.
3. Primer P0 de `docs/ESTADO_VIVO.md` cuyo dueño seas tú.

## Tareas programadas de Claude (las creó JM)
Revisión diaria de preguntas reportadas, conversión a 3 opciones y tildes, vigilancia del BOE (extracto CPEI) y comprobación de CI semanal. Su alcance está fijado en su propio prompt; no lo amplíes sin autorización.
