# QA de Preview — 17/10/2026

## Resultado
**NO certificada para merge ni producción.** El E2E de navegador sigue pendiente.
En esta sesión no se han ejecutado escrituras en Supabase, creado cuentas ni modificado producción.
No se han cambiado variables de Vercel, fusionado PR ni promovido despliegues.

## Evidencia contrastada en esta sesión
- PR #110 abierto y en draft. Head inicial: `1397a3567b65f9d6880f70e31ec85d7fcf08f2f2`.
- Quality Gate de ese head: éxito, ejecución GitHub Actions **39050747787**.
  Los workflows auto-codex-review y Concept outbox acceptance figuran **skipped**;
  no contarlos como pruebas superadas.
- La URL solicitada https://bomberopro-6wj0mnme2-bombero-pro.vercel.app
  corresponde a `dpl_7o6XhDFef4njPU78sf8i9FPu8MaX`, READY, commit
  `272f29296eda021702e352d3e1286b95419828d6`, rama del PR #110.
  Está por detrás del head inicial. READY no demuestra aislamiento ni login.
- El conector de Vercel devolvió 403 al leer el bypass de protección
  (`read_protection_bypass`, endpoint de aliases de ese deployment).
  El listado bajo el equipo/proyecto explícitos también devolvió 403.
  El acceso público web no pudo recuperar la página.
- Navegador, terminal y runtime local no arrancaron por errores del sandbox de Windows:
  `helper_unknown_error: setup refresh had errors` y
  `orchestrator_helper_exit_nonzero`. No son fallos observados de BomberoPRO.
- La conversación recuperada contiene referencias sin el detalle completo de las
  pruebas anteriores. La migración 18 aplicada solo a staging se toma del informe
  previo/PR/issue; no se ha vuelto a certificar por SQL en esta sesión.

## Defecto corregido
`scripts/check-deploy-env.mjs` rechazaba variables ausentes y claves de servidor,
pero aceptaba cualquier URL HTTP(S), incluida producción durante un build Preview.
Ahora, cuando `VERCEL_ENV=preview`, exige el origen exacto
`https://fxhvgvehhekqeqpkxtrm.supabase.co`, sin ruta adicional, query ni fragmento.
La ejecución de build pasa explícitamente el contexto Vercel a esa validación.
`vercel.json` ya utiliza `npm run build:deploy`.

Se añadieron cinco pruebas Node de aceptación de staging, rechazo de producción y
otros destinos, compatibilidad de Production, rechazo de claves de servidor y
mensajes sin secretos. Quality Gate las ejecuta tras instalar dependencias.
Esto protege **nuevas compilaciones Preview**. No verifica retroactivamente
bundles ya desplegados ni demuestra que una clave publishable pertenezca al
proyecto correcto; eso requiere comprobar solicitudes reales y autenticación.

## Revisión de PR #108 y #117 / issues #118 y #109
- #108 mantiene el piloto de sesiones finitas apagado por defecto, separado del
  motor remoto de conceptos. Sus tiempos son orientativos y su progreso sigue
  siendo local. No usarlo como prueba de sincronización MIRA ni activarlo en producción.
  Se revisó el diff y sus tests; no se ejecutó su UX desde navegador.
- #117 agrega preguntas y conceptos por separado y une por concept_id. Distingue
  975 enlaces de 553 preguntas con concepto publicado (470 conceptos).
  Es una fotografía anterior, no un recuento nuevo. No publicar automáticamente
  los 422 enlaces a borradores ni inferir QA editorial a partir de cobertura.
- #118 permanece abierto: variables por rama y guard de build no sustituyen la
  inspección del bundle servido y de su tráfico.
- #109 permanece bloqueado en G0. Las otras rutas de preguntas y fichas públicas,
  clientes antiguos, dos dispositivos y rollback/PWA requieren su propia evidencia.

## Matriz de aceptación pendiente
| Caso | Estado en esta sesión | Evidencia que falta |
|---|---|---|
| Bundle efectivo exclusivamente staging | BLOQUEADO | URL inmutable del head nuevo, HTML y chunks, host Supabase y clave pública concordante |
| Login/logout con usuario ficticio | NO EJECUTADO | tráfico Auth a staging, aislamiento de cuenta |
| Sesión y preguntas sin soluciones previas | NO EJECUTADO | payload HTTP real antes de responder |
| Correcta/incorrecta y feedback seguro | NO EJECUTADO | POST de opción, respuesta del servidor y estado remoto |
| Reintentos/idempotencia concurrentes | NO EJECUTADO | misma clave, un recibo/evento y una actualización de memoria |
| Reportar y excluir contenido | NO EJECUTADO | reporte ficticio en staging y rechazo posterior |
| Offline/reconexión/cierre/cambio de cuenta | NO EJECUTADO | cola conservada, recuperación sin duplicación ni cruce de usuarios |
| PWA anterior/nueva y actualización | NO EJECUTADO | service worker real, cachés y compatibilidad con RPC revocado |
| Errores y UX móvil/teclado | NO EJECUTADO | mensajes, foco, recuperación y tamaños reales |

## Reanudación
1. Recuperar el runtime local y acceso de lectura a la Preview protegida del proyecto
   bomberopro-mvp en el equipo bombero-pro (sin desactivar la protección).
2. Obtener una URL inmutable cuyo SHA coincida con el head bajo prueba y su CI.
3. Antes de login/escrituras, inspeccionar bundle y solicitudes; abortar ante cualquier
   destino de producción. Usar bloqueo explícito del host productivo en el arnés E2E.
4. Usar exclusivamente una cuenta ficticia de staging y registrar IDs de prueba sin
   tokens/contraseñas. Completar la matriz y conciliar los contadores de staging.
5. Mantener PR en draft y producción intacta hasta cerrar todos los bloqueantes.
