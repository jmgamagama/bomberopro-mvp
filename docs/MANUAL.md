# MANUAL — solo lo que puede hacer JM (una acción por línea; al resolverse, se borra)
Formato: [prioridad 1-3] Acción | Dónde exacto | Minutos | Qué desbloquea

[1] Configurar correo propio: SMTP de Gmail con contraseña de aplicación (recomendado; deliverability suficiente para 10 alumnos) y poner la URL del sitio https://bomberopro-mvp.vercel.app | Supabase producción → Authentication → Emails → SMTP Settings; y Authentication → URL Configuration | 15 | Que los alumnos reciban el correo de confirmación. Sin esto nadie nuevo puede entrar.
[1] Contestar el aviso de Supabase en el hilo «Decidir PR 153 o 179 para check_answer», o pegar /mnt/project-files/revisiones/check-answer/ensayo-staging-39-47.sql en Supabase staging → SQL Editor (debe terminar con el error RESULTADO_OK, que deshace todo) | Hilo o SQL Editor de staging | 2 | Ensayo en staging de las migraciones 39 y 47.
[1] Probar como alumno con tu cuenta tras recargar: Entrenar, Por temas, Errores y Simulacro | https://bomberopro-mvp.vercel.app | 10 | Confirma el flujo completo del alumno (única prueba real pendiente).
[1] Activar «Confirm email» y «Prevent use of leaked passwords» | Supabase producción → Authentication → Sign In / Providers → Email, y Attack Protection | 3 | Evita altas con correo ajeno y contraseñas filtradas.
[1] Pegar y ejecutar `aplicar-41-registro-invitados.sql` (ya lleva tus 4 correos): primero en staging, comprobar que devuelve 4 y true, luego en producción | Supabase → SQL Editor, archivo `/mnt/project-files/revisiones/aplicar-41-registro-invitados.sql` | 5 | Cierra el registro al grupo piloto. Sustituye al paso «aprobar» de la #183.
[2] Comprobar por qué `bomberopro.com` da 502 | Vercel → proyecto bomberopro-mvp → Settings → Domains | 5 | Dominio propio y, después, correos con tu dominio.
[3] Pasar los correos de los alumnos | Chat | 2 | Cargarlos en la lista de invitados.
[3] Pasar el enlace Drive del Plan de Prevención CPEI (tema 37) y la URL del BOP nº 135 | Chat | 3 | Contenido del tema 37 y datos de la convocatoria.
