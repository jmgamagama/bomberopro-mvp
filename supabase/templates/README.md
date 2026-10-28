# Correos de acceso de BomberoPro (Supabase Auth)

Plantillas en español con la imagen de BomberoPro (azul marino #1E3A5F, naranja #C2410C, fondo #FAF8F5).
Se generan con `node scripts/generar-plantillas-correo.mjs`; para cambiar un texto, edítalo en el script
y vuelve a generarlas (no edites los .html a mano).

| Panel de Supabase (Email Templates) | Archivo | Asunto |
|---|---|---|
| Confirm signup | `confirmacion.html` | Activa tu cuenta de BomberoPro y empieza hoy |
| Invite user | `invitacion.html` | Te invitamos a preparar el CPEI Badajoz con BomberoPro |
| Magic Link | `enlace-acceso.html` | Tu enlace para entrar en BomberoPro |
| Reset Password | `recuperar.html` | Crea tu nueva contraseña de BomberoPro |

## Cómo vuelve el alumno a la app

- La app pide a Supabase que el enlace vuelva al mismo dominio en el que está (`src/lib/authRetorno.ts`):
  `https://<dominio>/?acceso=registro` (crear cuenta) y `?acceso=enlace` (entrar con enlace).
- Al volver, `App.tsx` muestra `AccesoConfirmado`: «¡Cuenta activada!», «Este enlace ya no funciona»
  (caducado o ya usado) o el formulario de contraseña (invitación y recuperar contraseña).
- Supabase solo respeta esa URL si está en **Redirect URLs**; si no, usa **Site URL**. Por eso hay que
  configurar las dos en cada proyecto (abajo).

## Configuración en el panel (primero staging, luego producción)

Staging = `fxhvgvehhekqeqpkxtrm` (lo usan las vistas previas de Vercel `*-bombero-pro.vercel.app`).
Producción = `yndoaprnpkjqiggeyefz` (`https://bomberopro-mvp.vercel.app`).

1. **Authentication → URL Configuration**
   - Staging: Site URL `http://localhost:3000` (solo se usa si falta la URL de vuelta; no poner la de
     producción, que usa otra base de datos); Redirect URLs `https://*-bombero-pro.vercel.app/**` y
     `http://localhost:3000/**`.
   - Producción: Site URL `https://bomberopro-mvp.vercel.app`; Redirect URLs `https://bomberopro-mvp.vercel.app/**`.
2. **Authentication → Emails → SMTP Settings**: activar SMTP propio (ver abajo). Sin él, Supabase solo
   entrega a los miembros del equipo del proyecto (`email_address_not_authorized`) y muy pocos por hora.
3. **Authentication → Emails → Templates**: en cada una de las 4 plantillas, pegar el asunto y el HTML.
4. **Authentication → Rate Limits**: tras activar el SMTP, subir «emails sent per hour» a 100.

## Remitente (SMTP)

- **Resend** (recomendado, requiere el DNS de bomberopro.com): host `smtp.resend.com`, puerto `465`,
  usuario `resend`, contraseña = API key de Resend; remitente `hola@bomberopro.com`, nombre `BomberoPro`.
- **Gmail** (sin dominio): host `smtp.gmail.com`, puerto `465`, usuario = la cuenta Gmail, contraseña = una
  «contraseña de aplicación» (requiere verificación en dos pasos); remitente = esa misma cuenta, nombre
  `BomberoPro`. Límite unos 500 correos al día.
