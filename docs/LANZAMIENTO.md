# PAQUETE DE LANZAMIENTO (producción: JM aprueba una vez por paquete)
Estado: BORRADOR. Cuando esté listo, MANUAL.md recibe la línea «Aprobar paquete de lanzamiento».

## Cambios
| Orden | Cambio | Dónde | Comprobación en staging | Vuelta atrás |
|---|---|---|---|---|
| 1 | Registro solo por invitación + 4 correos (mig. 41) | PR #183, `aplicar-41-registro-invitados.sql` | PENDIENTE (bloqueada por confirmación de Supabase) | `41_registro_solo_invitados_down.sql` |
| 2 | Retirar 124 preguntas (mig. 43 y 46) | PR #194 | PENDIENTE | Registro en `qa_changes_20260923`; down de cada migración |

## Antes de aprobar
- Staging igualado con producción (mig. 30, 31, 33, 34, 38, 39, 45).
- Copia o plan de vuelta atrás escrito para cada fila. Sin secretos en el repo.
- MANUAL: SMTP, «Confirm email» y contraseñas filtradas hechos.

## Después de aplicar
- Comprobar cuentas existentes y inicio de sesión; alta de un correo no invitado rechazada; correo invitado recibe confirmación.
- No compartir el enlace de registro ni escribir a alumnos hasta la confirmación de JM.
