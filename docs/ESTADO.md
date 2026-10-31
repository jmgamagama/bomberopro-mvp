# ESTADO — BomberoPro (máx. 30 líneas; fuente única de verdad)
Última verificación: 2026-10-31 (lectura de producción + prueba con rollback). Sustituye a `ESTADO_VIVO.md` (histórico).

## Entornos
- Producción: Vercel proyecto `bomberopro-mvp` (equipo `bombero-pro`, id `prj_NY5Zr7htY9brbWj6jlbzy7PHSfCB`), despliega al fusionar en `main`. Confirmado 31/10 por los despliegues con `target: production`. URL: `bomberopro-mvp.vercel.app` (`bomberopro.com` da 502).
- Supabase producción `yndoaprnpkjqiggeyefz` (solo con aprobación de JM). Staging `fxhvgvehhekqeqpkxtrm` (libre; desfasado). Ignorar los otros 2 proyectos Supabase (inactivos).

## En producción (observado)
- main = `ea6160a`; despliegue en verde. 11.319 preguntas publicadas, 20 cuentas.
- Migraciones hasta la 45 salvo 41 y 43 (ver abajo). Simulacro sin preguntas de 2 opciones (mig. 40): 0 en 40 simulacros, 55 por examen, sin clave en la respuesta.
- Release de seguridad #203 (mig. 38, 39, 45): corrección en servidor.
- Registro **abierto**: la mig. 41 no está aplicada.

## En staging
- Desfasado: faltan 30, 31, 33, 34, 39, 45, 41 y 47. Mig. 40 y 38 aplicadas (38: 31/10, huellas iguales a producción). 39 y 47 sin aplicar por falta de confirmación de Supabase.

## En curso
- #183 registro por invitación (borrador): staging bloqueado por una confirmación de Supabase al crear el disparador en `auth.users` (ver MANUAL).
- #194 retirar 124 preguntas (mig. 43/46, borrador). #153 y #179 cerradas el 31/10; tope de 150/día aplazado hasta que haya plan de pago. #209 (límite en conceptos, mig. 47).
- Paquete de lanzamiento: `docs/LANZAMIENTO.md` (esqueleto).

## Supuestos sin verificar
- Que los correos de Supabase llegan a alumnos (probablemente NO sin SMTP propio).
- Prueba completa del flujo del alumno en la app (Entrenar, Por temas, Errores, Simulacro).
