# AGENTS.md — BomberoPRO

## Objetivo
Construir una plataforma de estudio para oposiciones de bomberos que ayude al alumno a volver a estudiar, aprender y comprobar su progreso con contenido fiable. La prioridad inicial es CPEI Badajoz. Distinguir siempre la convocatoria CPEI de la del Ayuntamiento de Badajoz: temarios y reglas de examen diferentes.

## Fuente de verdad
- Leer el código y el esquema actual antes de trabajar. Los documentos y chats antiguos pueden estar desactualizados.
- Para reglas de examen, normativa y respuestas, conservar fuente, versión, fecha y estado de revisión humana. Nunca presentar una pregunta generada como oficial.
- `docs/ESTADO_PROYECTO.md` es una fotografía histórica; verificar las decisiones contra `main`, migraciones y la base de datos antes de usarlas.
- No inferir el esquema real de Supabase a partir de nombres de TypeScript. Comprobar migraciones y entorno de prueba.

## Equipo de agentes (reglas comunes, desde 08/11/2026)
Este apartado es el contrato común. `CLAUDE.md`, `docs/OPERACION.md`, `docs/AGENT_AUTONOMO.md` y `TASKS.md` remiten aquí y solo añaden lo específico. Ningún agente es fuente de verdad por su nombre: manda la evidencia (código, migraciones, fuente oficial, CI).

| Agente | Propietario preferente de | Etiqueta |
|---|---|---|
| Claude Code / Cowork | ingeniería principal: funcionalidades, UX, rendimiento, E2E; tareas programadas de revisión de contenido | `claude` |
| Codex / ChatGPT | integración técnica, revisión independiente de PR, CI, coordinación de la cola, corrección de defectos | `codex` |
| DeepSeek | producción editorial: conceptos, fichas, preguntas, fuentes y sus correcciones (siempre como borrador) | `deepseek` |
| Gemini | auditoría independiente: normativa, seguridad, análisis adversarial; no diseña arquitectura nueva | `gemini` |
| Grok | pruebas adversariales, reproducción de fallos y su corrección en rama propia | `grok` |
| Antigravity | ejecución local y automatizaciones compatibles con su entorno | `antigravity` |

«Propietario preferente» no es monopolio: cualquiera puede tocar cualquier archivo si antes comprueba en GitHub que no hay otra PR abierta sobre él. Si la hay, comenta en esa PR o abre una incidencia en vez de editar en paralelo. Nunca empujar a la rama de otro agente.

**Autonomía (verificada, no declarada).** Estados: AUTÓNOMO VERIFICADO (recibe tareas y entrega sin conversación abierta), OPERATIVO BAJO SESIÓN (crea ramas y PR, pero solo mientras JM tiene una sesión abierta) y NO VERIFICADO. Solo se sube de estado con evidencia enlazada. Estado actual y evidencia: `docs/OPERACION.md`. No se asume que una suscripción incluye API o ejecución desatendida, y no se construyen puentes de pago entre agentes. No afirmar que otro agente está trabajando si no se ve en GitHub.

**Coordinación.** Toda tarea vive en una incidencia o en `TASKS.md` con: dueño (etiqueta de agente), prioridad (P0-P3 en el título), criterio de aceptación, comprobaciones y estado (`PENDIENTE / EN CURSO / VERIFICANDO / BLOQUEADA / HECHA`). Las PR dicen lo mismo en su descripción. Prioridades: P0 estabilidad del piloto CPEI y recorrido de estudio E2E; después contenido verificado, MIRA, métricas de aprendizaje, experiencia visual y captación.

**Capacidad.** Una PR de producto activa por frente (aplicación, editorial) y, en paralelo, una auditoría independiente. Las PR solo documentales o editoriales aisladas pueden convivir si no tocan los mismos archivos ni dependen de un despliegue. Antes de crear trabajo nuevo, revisar las PR abiertas y clasificarlas: fusionable / requiere corrección / duplicada / obsoleta / bloqueada. Clasificar no es cerrar: cerrar o fusionar lo decide JM.

**Sin pedir permiso:** investigar y corregir defectos, crear ramas y PR, ejecutar pruebas, reparar CI, actualizar documentación y evidencias. Reintentos: máximo 3 ciclos de corrección por fallo; después, BLOQUEADA con diagnóstico. No repetir una prueba sin leer su salida.

**Con autorización escrita de JM:** fusionar; desplegar; tocar producción, autenticación, RLS, permisos, secretos o datos reales; publicar contenido al alumno; contratar servicios o generar gasto; cambiar decisiones de producto cerradas en `docs/ESTADO_VIVO.md`. Excepción ya autorizada: las tareas programadas de Claude que JM creó para el banco de preguntas (revisar reportes, pasar a 3 opciones, tildes) escriben en producción con registro previo en `qa_changes_20260923`; ampliar su alcance requiere nueva autorización. Agrupar las preguntas a JM en una sola lista («JM →» en `docs/ESTADO_VIVO.md`); no interrumpirle por decisiones técnicas reversibles.

## Convenciones
- Stack actual: React 19, Vite, TypeScript y Supabase.
- Rama: `<agente>/<tipo>-<descripcion-corta>` (`claude/`, `codex/`, `deepseek/`, `gemini/`, `grok/`, `antigravity/`).
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
- Fichas de recuerdo: `src/data/recallAudit.test.ts` exige fuente, localización, ids únicos y enlaces solo de dominios oficiales. Si cambias un mazo revisado, ejecuta `npm run auditar:fichas` y explica el cambio en el PR (la versión del mazo cambia en `docs/AUDITORIA_FICHAS.md`). No añadas dominios a `OFFICIAL_DOMAINS` sin comprobar que son oficiales.
- Los datos de estudio locales (`mira_*:<userId|demo>`) no salen del dispositivo. Enviarlos al servidor o añadir analítica exige una migración nueva revisada, consentimiento y actualizar `docs/legal/` (borradores sin revisión legal).

## Skills compartidas
Las skills del proyecto están en `.agents/skills/` (Codex, Antigravity y cualquier agente que lea esa ruta) y en `.claude/skills/` (Claude Code), en las mismas versiones; `node scripts/check-editorial-skills.mjs` comprueba que la editorial es idéntica. `skills-lock.json` registra su origen. Las externas se actualizan en rama y con revisión del diff, nunca con `npx skills update -y` automático (detalle en `docs/SKILLS_MULTIAGENTE.md`).
- Toda pregunta nueva, importada o modificada pasa por `verificar-banco-preguntas` antes de la revisión humana. Esa skill nunca aprueba para el alumno.
- Todo cambio de esquema, RLS, RPC o migración sigue `supabase-postgres-best-practices` y `supabase` (oficiales de Supabase); no sustituyen las pruebas ni la revisión.
- El código React sigue `vercel-react-best-practices`; ignorar las reglas específicas de Next.js (el proyecto usa Vite).
- No instalar skills de terceros sin revisar su contenido en un PR: se ejecutan con todos los permisos del agente.

## PR
Título breve con alcance. Describir qué cambió, por qué, cómo se comprobó y los riesgos pendientes. No fusionar automáticamente cambios que afecten datos, evaluación, selección adaptativa o visibilidad del banco de preguntas.

## Migraciones y bases de datos (regla común, desde 18/10/2026)
- Antes de crear una migración, mirar `supabase/migrations` en `main` y usar el **siguiente número libre**. La comprobación `scripts/check-migrations.mjs` (CI) rechaza números repetidos.
- Si dos PR abiertos usan el mismo número, renumera el que se fusione después y avisa en ambos PR.
- **Staging solo recibe SQL que está en un PR**; producción solo SQL ya fusionado en `main` y con aprobación escrita de JM.
- Toda migración lleva su `_down.sql`. Los cambios de datos registran el valor anterior en `qa_changes_20260923`; nunca se borran preguntas, se despublican.
