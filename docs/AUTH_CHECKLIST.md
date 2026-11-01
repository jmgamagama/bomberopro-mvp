# Acceso (auth): lo que solo puede hacer José en los paneles

Rama `feat/auth-solida` (2026-11-01). El código ya está listo; esto es la parte de configuración.

Datos comprobados el 2026-11-01 en solo lectura (`GET /auth/v1/settings` con la anon key pública del bundle):

- Proyecto Supabase: `yndoaprnpkjqiggeyefz` → `https://yndoaprnpkjqiggeyefz.supabase.co`
- `email: true`, `google: false`, `apple: false`, `disable_signup: false`, `mailer_autoconfirm: false`
- App publicada: `https://bomberopro-mvp.vercel.app`

URL de vuelta que usa la app (todas en la raíz, con `?acceso=`):

| Flujo | redirectTo / emailRedirectTo |
|---|---|
| Confirmar registro | `https://bomberopro-mvp.vercel.app/?acceso=registro` |
| Recuperar contraseña | `https://bomberopro-mvp.vercel.app/?acceso=recuperar` |
| Google / Apple | `https://bomberopro-mvp.vercel.app/?acceso=oauth` |

La app usa el origen en el que está abierta (producción, preview o localhost). Si se abre desde algo que no sea http(s), usa `VITE_SITE_URL`.

---

## 1. Supabase (≈ 15 min, + SMTP ≈ 30 min)

Panel: https://supabase.com/dashboard/project/yndoaprnpkjqiggeyefz

### 1.1 Site URL y Redirect URLs — Authentication → URL Configuration
1. **Site URL**: `https://bomberopro-mvp.vercel.app` (sin barra final). Cuando haya dominio propio, cámbiala por él.
2. **Redirect URLs** → «Add URL», una por línea:
   - `https://bomberopro-mvp.vercel.app/**`
   - `http://localhost:3000/**` (desarrollo)
   - Si quieres que funcionen las previews de Vercel, añade su patrón tal como aparece en el panel de Vercel (p. ej. `https://bomberopro-mvp-*.vercel.app/**`; compruébalo, no lo he inventado).
   - Cuando haya dominio propio: `https://TU-DOMINIO/**`.
3. Guarda. Si una URL no está aquí, Supabase manda al alumno a la Site URL y se pierde el `?acceso=recuperar` → la pantalla de nueva contraseña no sale.

### 1.2 Plantillas de correo — Authentication → Email Templates
Las plantillas por defecto valen (usan `{{ .ConfirmationURL }}`, que ya incluye nuestro redirectTo). Solo traducirlas:
- **Confirm signup** — Asunto: `Confirma tu cuenta de BomberoPro`. Cuerpo: `<p>Pulsa para activar tu cuenta:</p><p><a href="{{ .ConfirmationURL }}">Activar mi cuenta</a></p><p>Si no has sido tú, ignora este correo.</p>`
- **Reset password** — Asunto: `Elige una contraseña nueva en BomberoPro`. Cuerpo: `<p>Pulsa para elegir una contraseña nueva. El enlace sirve una vez y caduca pronto.</p><p><a href="{{ .ConfirmationURL }}">Cambiar mi contraseña</a></p><p>Si no lo has pedido, ignora este correo.</p>`
- No cambies `{{ .ConfirmationURL }}` por `{{ .SiteURL }}`: se perdería el destino.

### 1.3 SMTP propio — Project Settings → Authentication → SMTP Settings (lo más importante)
El SMTP de serie de Supabase tiene un límite de envío por hora muy bajo (la documentación actual habla de unos pocos correos por hora en todo el proyecto) y es la causa típica de que «no llegue» el correo de recuperación o de registro. Comprueba la cifra en Authentication → Rate Limits.
1. Crea cuenta en un proveedor transaccional (Resend, Brevo, Postmark, Amazon SES…) y verifica el dominio de envío (registros SPF/DKIM en el DNS). Sin dominio propio verificado, ninguno entrega bien.
2. En Supabase activa «Enable Custom SMTP» y rellena con lo que te dé el proveedor: Host, Port (465 o 587), Username, Password, **Sender email** `no-responder@TU-DOMINIO`, **Sender name** `BomberoPro`.
3. Authentication → Rate Limits: sube «Rate limit for sending emails» (p. ej. 100/hora) — solo se puede con SMTP propio.
4. Prueba: en la app, «He olvidado la contraseña» con tu correo → debe llegar en < 1 min y abrir «Elige tu nueva contraseña».

### 1.4 Proveedores — Authentication → Sign In / Providers
- **Email**: ya activo. Deja «Confirm email» activado.
- **Google** y **Apple**: ver 2 y 3. El campo que te pedirán como «Callback URL (for OAuth)» es: `https://yndoaprnpkjqiggeyefz.supabase.co/auth/v1/callback`

---

## 2. Google Cloud OAuth (≈ 20 min)

Panel: https://console.cloud.google.com/
1. Crea (o elige) un proyecto «BomberoPro».
2. **APIs y servicios → Pantalla de consentimiento de OAuth** (Google Auth Platform → Branding): tipo **Externo**, nombre `BomberoPro`, correo de soporte el tuyo, dominio autorizado `vercel.app` (o tu dominio propio), enlaces a la política de privacidad. Ámbitos: solo `openid`, `email`, `profile` (no requieren revisión de Google). Pasa la app a **En producción** (si se queda en «Pruebas», solo entran los usuarios de prueba).
3. **Credenciales → Crear credenciales → ID de cliente de OAuth** → tipo **Aplicación web**:
   - **Orígenes de JavaScript autorizados**: `https://bomberopro-mvp.vercel.app` (y `http://localhost:3000` si quieres probar en local; tu dominio propio cuando lo haya).
   - **URIs de redireccionamiento autorizados**: `https://yndoaprnpkjqiggeyefz.supabase.co/auth/v1/callback`
4. Copia **Client ID** y **Client secret** → Supabase → Providers → Google → Enable, pega ambos, guarda.
5. Vercel → Project → Settings → Environment Variables (Production): `VITE_AUTH_GOOGLE=true` y redeploy. Sin esta variable el botón no aparece (por eso hoy no se ve nada roto).

---

## 3. Apple (≈ 45 min + alta en el programa, que puede tardar 24–48 h)

Requisito: **Apple Developer Program, 99 USD/año** (en España se cobra 99 €/año). Sin él no se puede.
Panel: https://developer.apple.com/account/resources

1. **Membership**: apunta tu **Team ID** (10 caracteres).
2. **Identifiers → + → App IDs** → «App» → descripción `BomberoPro`, Bundle ID `es.bomberopro.app` (o el que elijas) → marca **Sign In with Apple** → Register.
3. **Identifiers → + → Services IDs** → descripción `BomberoPro Web`, identificador `es.bomberopro.web` (este es el **Client ID** para Supabase) → Register → ábrelo → marca **Sign In with Apple** → **Configure**:
   - Primary App ID: el del paso 2.
   - **Domains and Subdomains**: `yndoaprnpkjqiggeyefz.supabase.co`
   - **Return URLs**: `https://yndoaprnpkjqiggeyefz.supabase.co/auth/v1/callback`
   - Save → Continue → Save.
4. **Keys → +** → nombre `BomberoPro Sign in`, marca **Sign In with Apple** → Configure → el App ID del paso 2 → Register → **Download** el `.p8` (solo se descarga una vez; guárdalo en tu gestor de contraseñas) y apunta el **Key ID**.
5. Supabase → Providers → Apple → Enable:
   - Client IDs: `es.bomberopro.web`
   - Secret Key: Supabase pide un JWT generado con el `.p8`, Team ID, Key ID y Services ID. En la propia página del proveedor Apple de Supabase hay un enlace/herramienta para generarlo a partir de esos cuatro datos. **Caduca a los 6 meses como máximo**: pon un recordatorio para regenerarlo o Apple dejará de funcionar sin aviso.
6. Vercel: `VITE_AUTH_APPLE=true` y redeploy.
7. Nota: Apple puede dar un correo de relay (`…@privaterelay.appleid.com`). Para que lleguen correos a esos usuarios hay que registrar el dominio de envío del SMTP en Apple (Services → Sign in with Apple for Email Communication).

---

## 4. Comprobación final (≈ 10 min, con un correo real tuyo)
1. Registro con correo nuevo → llega el correo → abre `¡Cuenta activada!`.
2. Salir → Entrar con correo y contraseña.
3. «He olvidado la contraseña» → correo → «Elige tu nueva contraseña» → guardar → entrar con la nueva.
4. Abrir otra vez el mismo enlace de recuperación → «Este enlace ya no funciona».
5. Continuar con Google / con Apple → vuelve dentro.
6. Como invitado responde algo → «Crear cuenta y guardar mi progreso» → entra → el progreso sigue.

Tiempo total de José: ~1 h 30 min sin Apple; +1 h y 99 €/año con Apple (más la espera del alta).
