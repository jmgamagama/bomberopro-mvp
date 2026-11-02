# ESTADO — BomberoPro (máx. 30 líneas; fuente única de verdad)
Última verificación: 2026-10-31 (lectura de producción + prueba con rollback). Sustituye a `ESTADO_VIVO.md` (histórico).

## Entornos
- Producción: Vercel proyecto `bomberopro-mvp` (equipo `bombero-pro`, id `prj_NY5Zr7htY9brbWj6jlbzy7PHSfCB`), despliega al fusionar en `main`. Confirmado 31/10 por los despliegues con `target: production`. URL: `bomberopro-mvp.vercel.app` (`bomberopro.com` da 502).
- Supabase producción `yndoaprnpkjqiggeyefz` (solo con aprobación de JM). Staging `fxhvgvehhekqeqpkxtrm` (libre; desfasado). Ignorar los otros 2 proyectos Supabase (inactivos).

## En producción (observado)
- main = `ea6160a`; despliegue en verde. 11.319 preguntas publicadas, 20 cuentas.
- Migraciones hasta la 45 (verificado 02/11); faltan 43, 46, 47, 48, 49, 50. `main` ya trae su código (#194, #209, #215, #218 fusionadas 02/11). Simulacro sin preguntas de 2 opciones (mig. 40): 0 en 40 simulacros, 55 por examen, sin clave en la respuesta.
- Release de seguridad #203 (mig. 38, 39, 45): corrección en servidor.
- Registro **abierto** (la mig. 48 no está aplicada en producción).

## En staging
- Tiene 38, 39, 40, 42, 44, 45 y 47 (47 aplicada 02/11). Faltan 43, 46, 48, 49 y 50 (y 30, 31, 33, 34 históricas).

## En curso
- #194, #209, #215 y #218 fusionadas el 02/11 (código en `main`, migraciones sin aplicar en producción). Faltan en staging los ensayos de 43/46 y 48 y aplicar 49/50 (ver MANUAL).
- #153 y #179 cerradas el 31/10; tope de 150/día aplazado hasta que haya plan de pago. Tema 5: #212 (borrador) antes del contenido de arts. 17-22.
- Tema 5 (RRI CPEI): en producción solo el art. 1 en borrador (invisible); arts. 1-22 van en el paquete (fila 6).
- Paquete de lanzamiento: `docs/LANZAMIENTO.md` (esqueleto).

## Supuestos sin verificar
- Que los correos de Supabase llegan a alumnos (probablemente NO sin SMTP propio).
- Prueba completa del flujo del alumno en la app (Entrenar, Por temas, Errores, Simulacro).
