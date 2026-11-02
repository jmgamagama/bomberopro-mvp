# PAQUETE DE LANZAMIENTO (producción: JM aprueba una vez por paquete)
Estado: LISTO PARA REVISAR, con 3 pruebas en staging pendientes (ver abajo). Verificado el 02/11 leyendo `list_migrations` de los dos proyectos y `git log origin/main`.

## Situación real (observada)
- `main` ya contiene el código de #194, #209, #215 y #218 (fusionadas el 02/11 entre las 11:04 y las 11:41). El cliente se despliega desde `main`; **las migraciones NO están en producción**.
- Producción (`yndoaprnpkjqiggeyefz`) llega hasta la 45. Faltan 43, 46, 47, 48, 49 y 50.
- Staging (`fxhvgvehhekqeqpkxtrm`) tiene 38, 39, 40, 42, 44, 45 y 47. Faltan 43, 46, 48, 49 y 50 (y 30, 31, 33, 34, históricas).
- Compatibilidad del cliente con la BD de producción actual: por lectura del código, #209 solo añade un aviso cuando el servidor rechaza por límite y #218 solo añade un texto para el motivo `BAJA_NIVEL`; no llaman a nada nuevo. No probado en la app.

## Cambios, en el orden en que deben aplicarse
| Orden | Migración | Qué hace | Origen | Prueba en staging | Vuelta atrás |
|---|---|---|---|---|---|
| 1 | 43 y 46 | Retirar 124 preguntas con error y corregir 14 (auditorías) | #194 (fusionada) | Local OK con copia real (124 retiradas, 14 corregidas, 7 conceptos a borrador; repetir no cambia nada; vuelta atrás exacta). En producción, 31/10: 138 de 138 con el texto auditado. **Staging PENDIENTE**: `/mnt/project-files/revisiones/194/ensayo-staging-43-46.sql` | `46_..._down.sql` y luego `43_..._down.sql`; cambios en `qa_changes_20260923` y `qa_concept_changes` |
| 2 | 47 | Límite de correcciones también en conceptos; tope 600/día | #209 (fusionada) | **Staging OK** (aplicada 02/11, versión 20261102100617) | `47_limite_correcciones_conceptos_down.sql` (restaura 1.500/día) |
| 3 | 48 | Registro solo por invitación (disparador en `auth.users`) | #215 (fusionada) | Local OK (8 pruebas PGlite). **Staging PENDIENTE**: la herramienta pide confirmación para tocar `auth.users`; ensayo `/mnt/project-files/revisiones/registro-48/ensayo-staging-48.sql` | `48_registro_solo_invitados_down.sql` |
| 4 | 49 y 50 | Conceptos y «Practicar preguntas» por niveles 1-2-3 | #218 (fusionada) | Local OK según el hilo del banco. **Staging PENDIENTE** | `50_..._down.sql` y luego `49_..._down.sql` (restauran las funciones de producción) |
| 5 | (contenido, sin migración) | Tema 5 RRI CPEI arts. 1-22: publicar 54 conceptos y 162 preguntas, vincular 33, retirar 3 duplicadas | `docs/lanzamiento/tema5-rri-arts-1-16.md`, rama `claude/project-thread-tlkef6`; requiere #212 | Staging OK 31/10, huella idéntica | SQL de vuelta atrás en el mismo fichero, probado |

## Antes de aprobar (lo que falta)
1. Ejecutar en staging los ensayos 43/46 y 48 (ambos terminan con el error RESULTADO_OK, que deshace todo) y aplicar la 49 y la 50. Hecho esto, el paquete queda probado.
2. SMTP de Gmail, «Confirm email» y contraseñas filtradas activados en producción (MANUAL).
3. Lista final de correos de los alumnos (hoy solo los 4 de prueba). Se cargan con `insert into public.piloto_invitados(email) values ('...');` justo después de la 48.
4. Copia o plan de vuelta atrás: arriba, una por fila. Sin secretos en el repo.

## Al aprobar (orden de ejecución en producción)
43, 46, 47, 48 + correos, 49, 50, y por último el contenido del tema 5. Tras cada paso: comprobar `list_migrations` y una consulta de control.

## Después de aplicar
- Cuentas existentes y inicio de sesión intactos; alta de un correo no invitado rechazada; correo invitado recibe confirmación.
- Simulacro, Entrenar, Por temas y Errores como alumno.
- No compartir el enlace de registro ni escribir a alumnos hasta la confirmación de JM.
