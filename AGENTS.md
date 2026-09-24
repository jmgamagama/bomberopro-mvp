# AGENTS.md — BomberoPRO

## Objetivo
Construir una plataforma de estudio para oposiciones de bomberos que ayude al alumno a volver a estudiar, aprender y comprobar su progreso con contenido fiable. La prioridad inicial es CPEI Badajoz. Distinguir siempre la convocatoria CPEI de la del Ayuntamiento de Badajoz: temarios y reglas de examen diferentes.

## Fuente de verdad
- Leer el código y el esquema actual antes de trabajar. Los documentos y chats antiguos pueden estar desactualizados.
- Para reglas de examen, normativa y respuestas, conservar fuente, versión, fecha y estado de revisión humana. Nunca presentar una pregunta generada como oficial.
- `docs/ESTADO_PROYECTO.md` es una fotografía histórica; verificar las decisiones contra `main`, migraciones y la base de datos antes de usarlas.
- No inferir el esquema real de Supabase a partir de nombres de TypeScript. Comprobar migraciones y entorno de prueba.

## Trabajo de Codex y otros agentes
Codex puede analizar, proponer, implementar y revisar mejoras de producto y arquitectura. Las decisiones con impacto en datos, algoritmo de estudio o experiencia del alumno deben explicarse en un PR y quedar sujetas a revisión antes de fusionar. Claude, Antigravity y Codex colaboran sobre el mismo contrato; ningún agente es la fuente de verdad por su nombre.

Para tareas independientes, usar ramas separadas y comunicar qué archivos toca cada agente. Evitar cambios concurrentes sobre la misma migración, componente o contrato de datos. No afirmar que otros agentes están ejecutando tareas si no se ha comprobado.

## Convenciones
- Stack actual: React 19, Vite, TypeScript y Supabase.
- Rama: `codex/<tipo>-<descripcion-corta>`.
- Etiquetas editoriales: `APTA / CORREGIR / DESCARTAR` en el flujo editorial; mapear explícitamente a los valores persistidos.
- Respetar la arquitectura y los contratos actuales; no mezclar en un PR una migración, un rediseño y cambios de contenido sin justificación.

## Comprobaciones
Antes de abrir un PR de código, ejecutar cuando sea posible:
```bash
npm ci
npm run lint
npm run build
npm run test
```
Documentar resultados y limitaciones reales. Para documentación aislada, revisar enlaces, coherencia y diff.

## Seguridad de contenido y datos
- Las preguntas `borrador_ia` o `validado_automatico` no deben llegar al alumno hasta revisión humana. Verificar filtros en consultas, RPC y vistas, no solo en la interfaz.
- No cargar datos en Supabase de producción ni modificar el esquema sin comprobar el contrato real, usar entorno de prueba y preparar una recuperación.
- No exponer la clave `service_role` en el frontend, commits, registros o artefactos. Mantenerla solo en ejecución de servidor segura.
- Mantener los IDs externos de preguntas separados de los IDs numéricos internos usados por RPC e intentos, salvo migración revisada.

## PR
Título breve con alcance. Describir qué cambió, por qué, cómo se comprobó y los riesgos pendientes. No fusionar automáticamente cambios que afecten datos, evaluación, selección adaptativa o visibilidad del banco de preguntas.
