# Prueba de registro por invitación en staging

Este procedimiento es para cuentas de prueba propias en **staging**. La migración 48 está propuesta en un PR borrador y todavía no se ha aplicado. No usar correos de alumnos ni producción durante esta prueba.

## Antes de probar

- Resolver primero el orden de las migraciones 46 y 47; la 48 depende de ese orden.
- Aplicar la 48 en staging siguiendo el procedimiento de migración del proyecto y comprobar el resultado antes de probar la interfaz.
- Confirmar en Supabase Auth que el registro por correo está permitido, que la confirmación del correo es obligatoria y que la URL de retorno de staging está autorizada.
- Confirmar que el envío de correo está configurado para staging. La prueba PGlite no verifica SMTP ni plantillas.
- Desplegar la interfaz de staging con `VITE_REGISTRO_ABIERTO` desactivado y comprobar que `piloto_config.registro_cerrado` sigue en `true`.
- Usar dos direcciones controladas por el equipo: una permitida en la lista y otra que no esté permitida.

## Recorrido de prueba

1. Añadir la dirección de prueba permitida a `public.piloto_invitados` desde el panel de staging. Normalizarla a minúsculas y eliminar espacios. No guardar contraseñas ni tokens en esa tabla.
2. Abrir el enlace genérico de staging `/?invitacion=1`. El correo no debe formar parte de la URL.
3. En «Activar invitación», introducir el mismo correo permitido y crear una contraseña.
4. Confirmar que llega el correo de verificación, que el enlace vuelve al dominio de staging y que la cuenta puede entrar después de confirmar la dirección.
5. Repetir con la dirección no permitida. No debe crearse una cuenta; la interfaz debe mostrar un mensaje neutral y permitir contactar con el equipo.
6. Comprobar que una cuenta de prueba ya existente puede iniciar sesión sin volver a registrarse.
7. Probar «He olvidado la contraseña»: el correo debe abrir el flujo para elegir una contraseña nueva.
8. Probar «Entrar con enlace sin contraseña» por separado. Un enlace caducado debe ofrecer una acción clara para volver a pedirlo.
9. Cerrar sesión, volver a abrir la aplicación y comprobar que la sesión se restaura; después cerrar sesión de nuevo.

## Criterio de aceptación

La prueba pasa si solo la dirección permitida puede completar el registro, la confirmación y los enlaces de acceso vuelven a staging, una cuenta existente conserva el acceso y los errores no revelan si una dirección ajena pertenece al grupo.

Registrar el resultado, fecha, versión desplegada y configuración comprobada en el PR. No copiar los correos de prueba, enlaces con tokens ni contraseñas al repositorio o a los logs.

## Límites del mecanismo

- La lista de permitidos no envía invitaciones ni tiene una interfaz administrativa; el alta permitida usa el registro normal y el correo de confirmación de Supabase.
- La lista no es de un solo uso. Si se revoca una invitación, hay que retirar su dirección con el procedimiento administrativo acordado.
- La prueba local con PGlite no sustituye este recorrido de Supabase Auth y correo reales.
- No fusionar ni aplicar en producción como parte de esta prueba.
