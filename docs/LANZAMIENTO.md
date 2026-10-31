# PAQUETE DE LANZAMIENTO (producción: JM aprueba una vez por paquete)
Estado: BORRADOR. Cuando esté listo, MANUAL.md recibe la línea «Aprobar paquete de lanzamiento».

## Cambios
| Orden | Cambio | Dónde | Comprobación en staging | Vuelta atrás |
|---|---|---|---|---|
| 1 | Registro solo por invitación + 4 correos (mig. 41) | PR #183, `aplicar-41-registro-invitados.sql` | PENDIENTE (bloqueada por confirmación de Supabase) | `41_registro_solo_invitados_down.sql` |
| 2 | Retirar 124 preguntas (mig. 43 y 46) | PR #194 | PENDIENTE | Registro en `qa_changes_20260923`; down de cada migración |
| 3 | Límite también en estudio por conceptos + tope de 600 correcciones al día (mig. 47) | PR #209 | Local OK (Postgres 16, esquema de producción, con vuelta atrás); en staging PENDIENTE (confirmación de Supabase) | `47_limite_correcciones_conceptos_down.sql` (restaura la función de producción y 1.500/día) |

## Antes de aprobar
- La mig. 47 se despliega junto con el cliente de la PR #209.
- Staging igualado con producción (mig. 30, 31, 33, 34, 38, 39, 45).
- Copia o plan de vuelta atrás escrito para cada fila. Sin secretos en el repo.
- MANUAL: SMTP, «Confirm email» y contraseñas filtradas hechos.

## Después de aplicar
- Comprobar cuentas existentes y inicio de sesión; alta de un correo no invitado rechazada; correo invitado recibe confirmación.
- No compartir el enlace de registro ni escribir a alumnos hasta la confirmación de JM.
