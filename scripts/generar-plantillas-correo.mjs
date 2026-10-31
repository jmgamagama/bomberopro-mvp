// Genera las plantillas de correo de Supabase Auth con la imagen de BomberoPro.
//   node scripts/generar-plantillas-correo.mjs
// Salida: supabase/templates/*.html (se pegan en Supabase → Authentication → Email Templates).
// Variables de Supabase (Go templates): {{ .ConfirmationURL }}, {{ .Email }}.
// HTML de correo: tablas y estilos en línea, sin CSS externo ni SVG (Gmail/Outlook no los soportan).
import { writeFileSync } from 'node:fs';

const AZUL = '#1E3A5F';
const NARANJA = '#C2410C';
const FONDO = '#FAF8F5';
const TEXTO = '#1F2937';
const SUAVE = '#4B5563';
const APP = 'https://bomberopro-mvp.vercel.app';
const LOGO = `${APP}/icons/icon-192.png`;
const FUENTE = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const parrafo = (html) =>
  `<p style="margin:0 0 16px;font-family:${FUENTE};font-size:16px;line-height:1.6;color:${TEXTO};">${html}</p>`;

function plantilla({ asunto, previo, titulo, intro, boton, despues, cita, aviso, motivo }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${asunto}</title>
</head>
<body style="margin:0;padding:0;background:${FONDO};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${FONDO};">${previo}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FONDO};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E7E2DA;">
<tr><td align="center" style="background:${AZUL};padding:28px 24px 24px;">
<img src="${LOGO}" width="56" height="56" alt="" style="display:block;border:0;border-radius:14px;margin:0 auto 12px;">
<div style="font-family:${FUENTE};font-size:24px;font-weight:800;color:#FFFFFF;letter-spacing:-0.3px;">BomberoPro</div>
<div style="font-family:${FUENTE};font-size:14px;color:#DCE6F2;margin-top:4px;">Tu preparación para el CPEI Badajoz</div>
</td></tr>
<tr><td style="height:4px;background:${NARANJA};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:32px 28px 8px;">
<h1 style="margin:0 0 16px;font-family:${FUENTE};font-size:24px;line-height:1.3;color:${AZUL};font-weight:800;">${titulo}</h1>
${intro.map(parrafo).join('\n')}
</td></tr>
<tr><td align="center" style="padding:8px 28px 24px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="${NARANJA}" style="border-radius:12px;">
<a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:16px 32px;font-family:${FUENTE};font-size:17px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:12px;">${boton}</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 28px 8px;">
${despues.map(parrafo).join('\n')}
${cita ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;"><tr>
<td style="border-left:4px solid ${NARANJA};background:#FFF7ED;padding:14px 16px;border-radius:0 8px 8px 0;font-family:${FUENTE};font-size:16px;line-height:1.5;color:${AZUL};font-style:italic;">${cita}</td>
</tr></table>` : ''}
<p style="margin:0 0 16px;font-family:${FUENTE};font-size:14px;line-height:1.5;color:${SUAVE};">${aviso}</p>
<p style="margin:0 0 24px;font-family:${FUENTE};font-size:13px;line-height:1.5;color:${SUAVE};">¿El botón no funciona? Copia y pega este enlace en tu navegador:<br>
<a href="{{ .ConfirmationURL }}" style="color:${AZUL};word-break:break-all;">{{ .ConfirmationURL }}</a></p>
</td></tr>
<tr><td style="background:#F3F0EB;padding:20px 28px;">
<p style="margin:0 0 8px;font-family:${FUENTE};font-size:12px;line-height:1.5;color:${SUAVE};">${motivo}</p>
<p style="margin:0;font-family:${FUENTE};font-size:12px;line-height:1.5;color:${SUAVE};">BomberoPro · Preparación de oposiciones de bombero · <a href="${APP}" style="color:${AZUL};">${APP.replace('https://', '')}</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`;
}

const CITA = '«La plaza no se gana el día del examen: se gana cada día que te sientas a estudiar.»';

export const PLANTILLAS = {
  confirmacion: {
    panel: 'Confirm signup',
    asunto: 'Activa tu cuenta de BomberoPro y empieza hoy',
    previo: 'Un clic y tu cuenta queda activada. Tu camino hacia la plaza empieza aquí.',
    titulo: 'Ya casi estás dentro',
    intro: [
      'Acabas de dar el primer paso para conseguir tu plaza de bombero. Solo falta confirmar que este correo es tuyo.',
    ],
    boton: 'Activar mi cuenta',
    despues: [
      'Cada día tendrás una sesión corta con lo que estás a punto de olvidar del temario del CPEI Badajoz. Sin estudiar a ciegas y sin perder tiempo.',
    ],
    cita: CITA,
    aviso: 'Por seguridad, el enlace solo sirve una vez y caduca al cabo de un tiempo. Si ya no funciona, entra en la app y pide uno nuevo.',
    motivo: 'Recibes este correo porque se creó una cuenta en BomberoPro con {{ .Email }}. Si no fuiste tú, ignóralo: la cuenta no se activará.',
  },
  invitacion: {
    panel: 'Invite user',
    asunto: 'Te invitamos a preparar el CPEI Badajoz con BomberoPro',
    previo: 'Tienes una plaza en el grupo piloto de BomberoPro. Acepta la invitación con un clic.',
    titulo: 'Tienes una invitación',
    intro: [
      'Te hemos elegido para el grupo piloto de BomberoPro, la plataforma que te ayuda a preparar la oposición de bombero del CPEI Badajoz estudiando cada día lo que más necesitas.',
    ],
    boton: 'Aceptar invitación',
    despues: [
      'Al abrir el enlace entrarás directamente y podrás elegir tu contraseña. Tu opinión durante el piloto nos ayudará a construir la mejor herramienta para opositores como tú.',
    ],
    cita: CITA,
    aviso: 'La invitación es personal: solo sirve una vez y caduca al cabo de un tiempo. Si ya no funciona, contesta a quien te invitó y te enviaremos otra.',
    motivo: 'Recibes este correo porque te han invitado a BomberoPro con {{ .Email }}. Si no esperabas esta invitación, ignóralo.',
  },
  'enlace-acceso': {
    panel: 'Magic Link',
    asunto: 'Tu enlace para entrar en BomberoPro',
    previo: 'Entra en BomberoPro con un clic, sin contraseña.',
    titulo: 'Entra con un clic',
    intro: [
      'Has pedido entrar en BomberoPro sin contraseña. Pulsa el botón y seguirás justo donde lo dejaste.',
    ],
    boton: 'Entrar en BomberoPro',
    despues: [],
    cita: '',
    aviso: 'El enlace solo sirve una vez y caduca al cabo de un tiempo. Si ya no funciona, pide otro desde la pantalla de entrada.',
    motivo: 'Recibes este correo porque alguien pidió entrar en BomberoPro con {{ .Email }}. Si no fuiste tú, ignóralo: nadie podrá entrar sin abrir este enlace.',
  },
  recuperar: {
    panel: 'Reset Password',
    asunto: 'Crea tu nueva contraseña de BomberoPro',
    previo: 'Elige una contraseña nueva y sigue preparando tu plaza.',
    titulo: 'Elige una contraseña nueva',
    intro: [
      'Nos has pedido cambiar la contraseña de tu cuenta. Pulsa el botón, escribe la nueva y vuelve a tu preparación sin perder nada de tu progreso.',
    ],
    boton: 'Crear contraseña nueva',
    despues: [],
    cita: '',
    aviso: 'El enlace solo sirve una vez y caduca al cabo de un tiempo. Si ya no funciona, pide otro desde la pantalla de entrada.',
    motivo: 'Recibes este correo porque se pidió cambiar la contraseña de {{ .Email }} en BomberoPro. Si no fuiste tú, ignóralo: tu contraseña no cambiará.',
  },
};

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [nombre, datos] of Object.entries(PLANTILLAS)) {
    const ruta = new URL(`../supabase/templates/${nombre}.html`, import.meta.url);
    writeFileSync(ruta, plantilla(datos));
    console.log(`${datos.panel.padEnd(16)} → supabase/templates/${nombre}.html  ·  Asunto: ${datos.asunto}`);
  }
}
