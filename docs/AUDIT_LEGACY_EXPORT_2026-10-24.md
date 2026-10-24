# Cerrar exportación heredada · 24/10/2026

get_preparer_session_questions(integer) admite NULL sin límite y devuelve9786 preguntas con claves al rol authenticated sin comprobación de pago ni auth.uid. Se comprobó por conteo SQL, sin descargar el banco. App.tsx sí la usaba como fallback ante cualquier error del selector moderno. Este PR elimina ese fallback: se conserva el error visible y su reintento, sin reabrir permisos.

Migración26: revoca EXECUTE a PUBLIC,anon,authenticated; no elimina la función; el selector moderno de estudio conserva su contrato. Es idempotente y admite entornos donde no existe. Down restaura solo el permiso authenticated observado, y reabre la vulnerabilidad: no ejecutarlo automáticamente.

Tests PGlite con roles reales: los tres roles clientes pierden EXECUTE; usuario authenticated recibe42501 al invocar NULL; el propietario conserva acceso; otra RPC permanece ejecutable. Repetición y rollback controlados. Prueba remota en staging solo después de abrir PR; no producción hasta revisión, merge y aprobación escrita conforme AGENTS.md.

## Riesgo pendiente que este cambio no resuelve

get_study_session,get_topic_study_questions,get_blueprint_exam_questions aún entregan soluciones al cliente. Requieren migración coordinada y cambios de entrenamiento/temas/simulacro para devolver feedback solo tras contestar. Tampoco existe un control comercial de pago completo: no afirmar que este PR protege todo el banco. No sustituir autorización por ocultar botones ni rotar anon keys.


## Verificado en staging · 24/10/2026

Tras abrir PR#151 se aplicó26_close_legacy_preparer_export en bomberopro-staging (fxhvgvehhekqeqpkxtrm). El catálogo pasó de authenticated EXECUTE=true a false; PUBLIC y anon permanecen false. No hubo cambios en producción ni en preguntas. La migración fue registrada por la herramienta conectada; la CLI quedó descartada tras bloquearse su telemetría. Los tests de migración y roles también pasan en GitHub Actions.
