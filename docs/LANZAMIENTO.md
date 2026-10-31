# PAQUETE DE LANZAMIENTO (producción: JM aprueba una vez por paquete)
Estado: BORRADOR. Cuando esté listo, MANUAL.md recibe la línea «Aprobar paquete de lanzamiento».

## Cambios
| Orden | Cambio | Dónde | Comprobación en staging | Vuelta atrás |
|---|---|---|---|---|
| 1 | Registro solo por invitación + 4 correos (mig. 41) | PR #183, `aplicar-41-registro-invitados.sql` | PENDIENTE (bloqueada por confirmación de Supabase) | `41_registro_solo_invitados_down.sql` |
| 2 | Retirar 124 preguntas y corregir 14 (mig. 43 y 46) | PR #194 (borrador; CI 5/5 en verde, al día con main) | En producción, solo lectura 31/10: 138 de 138 preguntas con el texto auditado (huella md5 igual). Ensayo local con copia real de las 138 + 92 gemelas + 9 conceptos: OK (124 retiradas, 14 corregidas, 7 conceptos a borrador; repetir no cambia nada; marcha atrás devuelve texto y estado exactos). Ensayo en staging: guion listo en `/mnt/project-files/revisiones/194/ensayo-staging-43-46.sql` (10 preguntas reales, esquema aparte, termina con RESULTADO_OK y deshace todo); PENDIENTE de ejecutar (ver MANUAL) | `46_..._down.sql` y luego `43_..._down.sql`; cada cambio queda en `qa_changes_20260923` y `qa_concept_changes` |
| 3 | Límite también en estudio por conceptos + tope de 600 correcciones al día (mig. 47) | PR #209 | Local OK (Postgres 16, esquema de producción, con vuelta atrás); en staging PENDIENTE (confirmación de Supabase) | `47_limite_correcciones_conceptos_down.sql` (restaura la función de producción y 1.500/día) |
| 4 | Sesión de conceptos por niveles en cada bloque (mig. 48; columnas `bloque` y `requiere`) | rama local `local/fase4-niveles`, parche `/mnt/project-files/revisiones/probabilidad-niveles/48-49_motores_por_niveles.patch`; PR nueva tras la #194 | Local OK (8 pruebas: bloques 1-2-3, bases antes, bajar al 2 al fallar el 3, guardia, marcha atrás exacta). Staging PENDIENTE | `48_conceptos_por_niveles_down.sql` (restaura `_concept_session`, md5 de producción 80dd5896...) |
| 5 | «Practicar preguntas» por niveles (mig. 49) | igual que la 4 | Local OK (escalera, cierre y reapertura del nivel 3, guardia, marcha atrás). Staging PENDIENTE | `49_sesion_por_niveles_down.sql` (restaura `get_study_session`, md5 de producción f6839285...) |

## Antes de aprobar
- Orden de migraciones: 43, 46, 47, 48, 49 (la 41 va primero).
- La mig. 47 se despliega junto con el cliente de la PR #209.
- Staging igualado con producción (mig. 30, 31, 33, 34, 38, 39, 45).
- Copia o plan de vuelta atrás escrito para cada fila. Sin secretos en el repo.
- MANUAL: SMTP, «Confirm email» y contraseñas filtradas hechos.

## Después de aplicar
- Comprobar cuentas existentes y inicio de sesión; alta de un correo no invitado rechazada; correo invitado recibe confirmación.
- No compartir el enlace de registro ni escribir a alumnos hasta la confirmación de JM.
