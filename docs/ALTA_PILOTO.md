# Alta manual de los 10 alumnos del piloto

> Sin datos personales: los correos y contraseñas nunca se escriben aquí, en issues, PR ni chats. Solo se aplica con la autorización descrita en `docs/AUTORIZACIONES.md`. Aportación de DeepSeek, comprobada contra `supabase/migrations/48_registro_solo_invitados.sql`.

## Dos condiciones (con una sola, el alumno no entra)
1. **Invitado antes que usuario.** El trigger `a_exigir_invitacion_piloto` rechaza el alta de `auth.users` si el correo no está en `piloto_invitados`. Se inserta primero (correo en minúsculas), registrando el cambio en `qa_changes_20260923`.
2. **Cuenta ya confirmada.** Supabase → Authentication → Add user, con «Auto Confirm User» marcado. Sin eso, `signInWithPassword` devuelve `email_not_confirmed` y el alumno no puede entrar.

Crear usuarios por API (`auth.admin.createUser` con `email_confirm: true`) exige `service_role`: solo desde un script local de servidor, nunca en el frontend ni pegada en un chat. Para 10 cuentas basta el panel.

## Pasos
1. JM entrega los correos por un canal privado.
2. Insertar en `piloto_invitados`; crear cada usuario con contraseña propia y «Auto Confirm User».
3. Cada contraseña se entrega por un canal privado individual (no por grupo).
4. **Antes de avisar a nadie, probar una cuenta de punta a punta en un móvil real:** entrar, responder, salir, volver a entrar.
5. Avisar a los alumnos. Entran con contraseña; no prometer «recuperar por correo» ni enlace mágico hasta verificar el SMTP. Si alguien olvida la contraseña, JM la restablece desde el panel.
