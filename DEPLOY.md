# Despliegue de release/auditoria-mejoras

Rama de integración local (sin push). Nada de esto se ha aplicado en Supabase real.

## 1. Orden de aplicación de migraciones

Todas son idempotentes y tienen su `_down.sql`. Se aplican en orden numérico; las que ya estén
aplicadas en producción (31–36 vienen de `main`) se pueden volver a pasar sin efecto.

| N.º | Archivo | Rama de origen | Notas |
|----:|---------|----------------|-------|
| 31 | `31_cerrar_recalculo_dificultad.sql` | fix/c4-revoke-recalculate-difficulty | — |
| 32 | `32_escalera_sin_subir_al_fallar.sql` | fix/escalera-niveles | — |
| 33 | `33_rpc_claves_sin_anon.sql` | fix/c2-rpc-claves-sin-anon | — |
| 34 | `34_opciones_dos_anteriores.sql` | main (#175) | — |
| 35 | `35_todas_anteriores_incoherentes.sql` | main (#177) | — |
| 36 | `36_endurecer_permisos_anon.sql` | main (#177) | — |
| 37 | `37_eventos_embudo_ampliados.sql` | feat/embudo-conversion | Requiere la 22. Independiente del cliente. |
| 38 | `38_correccion_servidor_y_fichas_pro.sql` | fix/c1c2-servidor (**antes 34**) | **Rompe clientes antiguos**: ver §2. |
| 39 | `39_limite_correcciones.sql` | fix/c2-limite-consultas (**antes 35**) | Requiere la 38. |

Renumeración: en las ramas, `34_correccion_servidor_y_fichas_pro` y `35_limite_correcciones`
chocaban con la 34 y la 35 de `main`; pasan a 38 y 39 (archivos, `_down`, tests SQL y comentarios
del cliente actualizados).

Para deshacer: los `_down.sql` en orden inverso (39 → 31). Probado en local.

## 2. La 38 se despliega a la vez que el cliente

La 38 retira EXECUTE a `get_blueprint_exam_questions`, `get_study_session` y
`get_topic_study_questions` (las RPC que devolvían la clave). El cliente de esta rama usa ya
`get_*_v2`, `check_answer` y `grade_exam`. Por tanto:

1. Desplegar el cliente de esta rama (Vercel) **y**, en la misma ventana, aplicar 38 y 39.
2. Un cliente viejo con la 38 aplicada no puede cargar sesiones ni simulacros; un cliente nuevo sin
   la 38 tampoco (las v2 no existen). Minimizar la ventana; el service worker puede servir el
   cliente viejo hasta que se recargue.
3. 31–37 pueden aplicarse antes, en cualquier momento.

## 3. Banderas (variables de build en Vercel)

| Variable | Valor en producción | Motivo |
|----------|--------------------|--------|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | las de producción | `npm run build:deploy` lo comprueba. |
| `VITE_PRO_DECKS_FROM_SERVER` | **sin poner (false)** | Solo encender cuando `recall_cards` esté cargada (paso pendiente; la 38 no carga fichas). Encendida antes, los mazos Pro quedan vacíos. |
| `VITE_INCLUDE_PENDING_DECKS` | **sin poner** | Si se pone, los mazos pendientes vuelven al bundle público. |
| `VITE_FEATURE_REVISION_ADMIN` | sin poner | Solo para previews internas. |
| `VITE_REVISION_OWNERS` | id/correo del propietario | Quién ve los mazos pendientes con sesión. |
| `VITE_FEATURE_PLANES` | decisión de negocio (por defecto apagada) | Página de planes. |

Ninguna bandera hay que *encender* para esta release; las críticas son dejar las dos primeras
de la tabla (tras las de Supabase) sin poner.

## 4. Comprobaciones

Antes (local):
- `npx vitest run` (761 tests), `npm run build`, `npm run auditar:fichas` (0 problemas).
- Tests SQL: `for t in supabase/tests/sql/*.sql; do psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f $t; done` (todos en BEGIN…ROLLBACK).
- Cadena 31→39 dos veces y downs 39→31 sobre una copia (`CREATE DATABASE x TEMPLATE bomberopro_audit`).
- e2e: build con `VITE_SUPABASE_URL=http://127.0.0.1:9`, `vite preview` y `node e2e/invitado-360.cjs`.
- Bundle: `rg -l CPEI-T36 dist` debe dar 0 (mazos pendientes fuera).

Después (producción):
- Con anon: `get_blueprint_exam_questions` → permission denied; `log_funnel_event('landing_view', …)` sin error.
- Con un usuario: simulacro completo (preguntas sin clave, nota con `grade_exam`), sesión diaria, estudio por tema.
- `SELECT event, count(*) FROM funnel_events WHERE created_at > now() - interval '1 day' GROUP BY 1;` muestra los eventos nuevos.
- `answer_check_log` crece al corregir; superar el límite da el aviso P0429 en la app.
- Vigilar errores 42883/42501 en los logs de Supabase durante la ventana de §2.
