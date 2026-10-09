# Codex — persistencia por conceptos, 9 octubre 2026

PR #95, rama codex/fix-concept-outbox-retention, base main b7a138a. Alcance: src/lib/conceptEngine.ts, su test y ConceptStudy.tsx. La UX general la trabaja otro chat en codex/fix-student-ux: evitar solapamientos.

Hallazgos estáticos: MAX_TRIES eliminaba evidencias tras ocho fallos; el envío sobrescribía un snapshot viejo de la cola; no verificaba cuenta antes de RPC; errores permanentes desaparecían; la pantalla no reintentaba al reconectar.

Corrección: serializar operaciones; guardar antes de esperar la red; releer cola y retirar únicamente la clave confirmada; conservar evidencias rechazadas para revisión y avisar; reintentar al volver conexión y cada 30 s. Guardado confirmado se deduce de la respuesta RPC, no de la desaparición local. Sin almacenamiento, envío directo respeta la cola previa y muestra limitación si falla. Cada petición comprueba userId y fija Authorization al token de esa sesión; un cambio posterior de cuenta no convierte un evento A en evento B.

setHeader existe en la versión fijada @supabase/postgrest-js 2.110.8; fuente oficial: https://github.com/supabase/supabase-js/blob/v2.110.8/packages/core/postgrest-js/src/PostgrestBuilder.ts#L224 . Ningún token real se escribe ni registra.

Regresiones añadidas: más de ocho fallos, otra sesión activa, evento añadido durante envío pendiente, token A fijado aunque cambie sesión a B, desaparición del almacenamiento sin confirmación RPC. Validación final pendiente en CI. exec_command no inicia por setup refresh/helper_unknown_error; node_repl tampoco inicia (kernel). No SQL nuevo, merge ni despliegue productivo de esta corrección.

Gates antes de integrar: CI sobre HEAD final, revisión, E2E con conexión interrumpida y cuenta A/B en preview autenticada, y comprobación de fila única. Serialización es de este módulo, no candado entre dos pestañas; no afirmar cobertura de carreras entre pestañas. La UI multi-tema actual procede de #93/#94 y debe repetir aceptación actualizada.

Actualización: PR #97 UX integrado por el otro chat. PR #96 revisado y fusionado aquí tras Quality Gate success (37892791672), main@11708b5. PR #95 incorpora un ensayo Chromium remoto sobre el build de la rama y Supabase productivo, con cuenta QA .invalid. Comprueba evidencia conservada offline, retry al reconectar, fin de sesión y segundo contexto móvil aislado. Sus resultados reales están pendientes del workflow Concept outbox acceptance. No usar el ensayo como prueba en dispositivos físicos ni R7/R30.
