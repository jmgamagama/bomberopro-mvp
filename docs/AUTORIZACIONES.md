# Autorizaciones permanentes y reparto del piloto

> Entra en vigor cuando JM fusiona esta PR. La fusión es consentimiento escrito solo para las excepciones documentadas aquí; ante cualquier duda prevalece la regla más restrictiva de `AGENTS.md`. JM puede revocar o ampliar cualquier línea con un comentario o una PR. Complementa `AGENTS.md` (reglas comunes) y `docs/ESTADO_VIVO.md` (estado).

## Objetivo del piloto (14 días)
10 alumnos reales estudian en la app y dan datos y opiniones. Todo lo que no ayude a eso se congela: máximo 2 PR abiertas a la vez; sin PR nuevas de contenido, herramientas ni gobernanza salvo que desbloqueen el piloto.
Éxito (el fijado en `ESTADO_VIVO.md`, sin cambios): 8 de 10 activan en 24 h; 5 de 10 estudian el día 3; ≥3 sesiones por alumno la primera semana; <1 error de contenido por cada 100 fichas. Además, 0 errores bloqueantes abiertos más de 48 h.

## Claude puede hacer sin preguntar a JM
1. Crear ramas, PR, issues, etiquetas y comentarios (nunca fusionar).
2. Aplicar migraciones y pruebas en **staging** (`fxhvgvehhekqeqpkxtrm`), solo SQL que esté en una PR.
3. Leer los **registros de Auth** de producción (solo diagnóstico de entrega de correo y errores). No leer ni exportar datos personales de `auth.users`.
4. Añadir a `piloto_invitados` en producción **solo** los correos que JM entregue por un canal privado, registrando antes el cambio en `qa_changes_20260923`. Esos correos nunca se escriben en el repositorio, issues, PR ni otros chats.
5. Ejecutar la tarea diaria de integración en la nube: revisar PR y CI, etiquetar y avisar a JM solo si hay una decisión suya o algo roto.

## Siempre con «sí» escrito de JM
Fusionar PR; desplegar; cualquier cambio en producción distinto del punto 4; auth, RLS, permisos y secretos; datos reales de alumnos; publicar contenido; gastar dinero; cambiar decisiones de producto cerradas; pasar el repo a privado. Nunca pegar claves ni contraseñas en chats, issues o PR.

## Reparto
| Agente | Etiqueta | Hace | Límite |
|---|---|---|---|
| Claude | `claude` | Integra y construye: acceso, correo, UI, tests, arquitectura (MIRA/FSRS, esquema) | Sin "sí" de JM no toca producción |
| Codex (agente de código de ChatGPT) | `codex` | Revisa cada PR (app de GitHub, automático) y arregla P0 | Tareas por `@codex` sin verificar; probar con una pequeña |
| ChatGPT (chat) | `chatgpt` | Mensajes y guía de bienvenida a alumnos, formulario semanal de feedback, textos de landing, segunda opinión de producto | Sin acceso al repo: trabaja desde una tarjeta de issue y JM pega el resultado |
| Grok | `grok` | Pruebas adversariales y casos límite | Bajo sesión |
| DeepSeek | `deepseek` | Borradores en volumen en el repo **privado** | Verificar toda fuente; no afirmar lo que no ha comprobado |
| Gemini | `gemini` | Investigación normativa y auditoría | Autonomía sin verificar |

Tres agentes (Claude, Codex, ChatGPT) cubren el camino crítico del piloto; el resto trabaja en tareas laterales que no bloquean.

## Cómo se da una tarea
Un issue con: objetivo, archivos, criterio de aceptación, qué no tocar, agente y prioridad (P0–P3). Quien lo ejecute abre una PR enlazada; Codex la revisa; JM fusiona. Máximo 3 ciclos de corrección por PR.
