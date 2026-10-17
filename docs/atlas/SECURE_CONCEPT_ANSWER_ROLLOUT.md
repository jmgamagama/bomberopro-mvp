# Despliegue seguro del corrector MIRA por conceptos (PR de migración 17)

## Por qué cambia
El endpoint legado `get_concept_session` entregaba `correct_answer`, `explanation` y `concept_respuesta` en preguntas de test ANTES de contestar; y `record_concept_event` admitía `p_correct` calculado en el navegador. Esto permite extraer respuestas o falsear dominio. La migración 17 y el cliente propuesto cambian únicamente la vía **de test por conceptos**.

## Nuevo contrato
- `get_concept_session_v2(p_topic,p_minutes)`: devuelve pregunta y opciones, sin `correct_answer`; para `formato='test'` oculta explicación y respuesta del concepto. Las fichas y recuerdo siguen mostrando su contenido.
- `submit_concept_answer(client_event_id,concept_id,question_id,selected_option,confidence,response_ms,session_id)`: **valida en servidor** opción+pregunta publicadas, calcula acierto y graba evento FSRS en una transacción; devuelve corrección y explicación una vez almacenada.
- `concept_answer_receipts`: registra resultado idempotente por usuario+evento. Una repetición de la misma clave/opción devuelve la evaluación anterior; con otra pregunta/opción se rechaza.
- `record_concept_event` continúa aceptando ficha y recuerdo; rechaza intentos de test con `p_correct` o `p_question_id`.
- Se revoca EXECUTE sobre `get_concept_session` para `authenticated`, `anon` y `PUBLIC`.

## Advertencias de compatibilidad
**No fusionar ni aplicar la migración 17 en producción unilateralmente.**
- Aplicar en **Supabase staging** con snapshot/backup, probar la UI correspondiente y los clientes antiguos. En cuanto se revoque el RPC anterior, una versión vieja del frontend no podrá iniciar sesiones de conceptos.
- Coordinar publicación de migration + frontend nuevo en ventana controlada y disponer de rollback. Un rollback que reabra el RPC antiguo restaura una vulnerabilidad; preferir restaurar el release íntegro si resulta imprescindible.
- PWA con caché antigua puede mantener JS viejo: comprobar service worker y política de actualización. Considerar bloquear app antigua con actualización obligatoria, no reabrir endpoint indefinidamente.
- Las colas locales antiguas pueden contener `p_correct` sin opción. Se conservarán como rechazadas para revisión, **no transformarlas en aciertos** ni borrarlas.
- No utilizar en producción hasta verificar en el Supabase real la firma, propietarios y permisos de las funciones, las políticas RLS y la fidelidad del esquema. Este PR se ha preparado por lectura del repositorio, no por ejecución remota de SQL.

## Test de aceptación
1. `npm run lint` / `npm run build` / `npm run test`.
2. PGlite: `node supabase/tests/concept_engine.pglite.mjs` y `node supabase/tests/concept_answer_secure.pglite.mjs`.
3. Staging bajo usuario de prueba: inspeccionar el **payload HTTP de la sesión**: no aparece ninguna solución de test; respuesta enviada es solo opción seleccionada; recibe solución después de confirmar.
4. Prueba A→B con misma cuenta, refresco, reintentos y caída de red: exactamente un evento, resultado estable y próxima revisión persistente.
5. Llamada arbitraria a `record_concept_event(kind=test,p_correct=true)` debe fallar; llamada a `get_concept_session` con rol autenticado debe fallar.
6. Sin sesión, `submit_concept_answer` no funciona. Preguntas borrador/revisión no pueden calificarse. Variantes y preguntas reportadas: comprobar contratos vigentes.
7. Regression checklist para `Entrenar`, `Por temas`, `Simulacro` y fichas locales: **estas rutas aún deben auditarse por separado**, ya que `record_attempt_v2` y otros RPC podrían aceptar booleanos de cliente.

## Alcance de seguridad
Esta fase **NO** resuelve por sí sola la exposición de respuestas en otras rutas ni crea entitlements server-side. Tampoco convierte el progreso local de fichas en remoto. Es un bloque de P0.4 que debe completarse con auditoría de todas las RPC antes de vender.

## Procedimiento sugerido
1. Abrir revisión de contrato con Claude/Codex (issue #75).
2. Validar migración en staging contra una copia anonimizada del esquema.
3. Ejecutar tests SQL, RLS, contrataciones y smoke E2E desde móvil/PC.
4. Corregir incidencias, aprobar un despliegue coordinado.
5. Tomar snapshot previo, aplicar migración 17 en staging, activar frontend actualizado, observar errores y decidir una ventana de producción.
6. Solo después, abordar unificación de fichas↔conceptos verificados y monetización.
