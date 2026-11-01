/**
 * Mensajes de la pantalla de entrada. Traducen los errores de Supabase Auth a frases claras,
 * sin jerga, que digan al alumno qué hacer a continuación.
 */

export type ModoAcceso = 'entrar' | 'crear';

/** Lo que necesitamos de un error de Supabase Auth (AuthApiError o similar). */
export interface ErrorAuth {
  status?: number;
  code?: string;
  message?: string;
}

export interface MensajeAcceso {
  text: string;
  /** Qué ofrecer junto al mensaje: reenviar el correo de confirmación o pasar a «Entrar». */
  accion?: 'reenviar' | 'ir_a_entrar' | 'ir_a_crear';
}

const msg = (e: ErrorAuth) => (e.message ?? '').toLowerCase();

export function mensajeErrorAcceso(modo: ModoAcceso, e: ErrorAuth, registroAbierto: boolean): MensajeAcceso {
  if (e.code === 'over_email_send_rate_limit') {
    return { text: 'Hemos enviado varios correos seguidos a esta dirección. Espera unos minutos y vuelve a intentarlo.' };
  }
  if (e.status === 429 || e.code === 'over_request_rate_limit') {
    return { text: 'Demasiados intentos seguidos. Espera un minuto y vuelve a intentarlo.' };
  }
  if (e.code === 'email_address_invalid' || msg(e).includes('invalid format') || msg(e).includes('is invalid')) {
    return { text: 'Revisa el correo: parece que falta algo (por ejemplo, la @ o el dominio).' };
  }
  if (e.code === 'email_not_confirmed' || msg(e).includes('email not confirmed')) {
    return {
      text: 'Falta confirmar tu correo. Abre el enlace que te enviamos (mira también en Spam o Promociones).',
      accion: 'reenviar',
    };
  }
  if (e.code === 'email_address_not_authorized') {
    return { text: 'No hemos podido enviarte el correo de confirmación. Avisa a quien te invitó y lo resolvemos enseguida.' };
  }

  if (modo === 'crear') {
    if (e.code === 'weak_password' || msg(e).includes('password should be')) {
      return { text: 'La contraseña necesita al menos 6 caracteres.' };
    }
    if (e.code === 'user_already_exists' || e.code === 'email_exists') {
      return { text: 'No hemos podido activar la cuenta con esos datos. Si ya tienes una, entra en «Ya tengo cuenta»; si recibiste una invitación, contacta con el equipo.' };
    }
    if (e.code === 'signup_disabled') {
      return {
        text: registroAbierto
          ? 'Ahora mismo no se pueden crear cuentas. Inténtalo más tarde o contacta con el equipo.'
          : 'El registro está cerrado. Si tienes una invitación, contacta con el equipo para que te ayude a activar la cuenta.',
      };
    }
    // Auth puede devolver 500 tanto si falla un trigger como si hay una incidencia de servicio.
    // No permite saber si el correo está invitado; no atribuir el problema al alumno ni revelar la lista.
    if ((typeof e.status === 'number' && e.status >= 500) || e.code === 'unexpected_failure' || msg(e).includes('database error')) {
      return {
        text: 'No hemos podido completar el alta ahora. Inténtalo de nuevo más tarde; si tienes una invitación y sigue fallando, contacta con el equipo.',
      };
    }
    return { text: 'No hemos podido activar la cuenta. Revisa el correo y la contraseña e inténtalo de nuevo.' };
  }

  // Entrar
  if (e.code === 'invalid_credentials' || e.status === 400) {
    return {
      text: registroAbierto
        ? 'El correo o la contraseña no coinciden. Si no la recuerdas, pulsa «He olvidado la contraseña».'
        : 'El correo o la contraseña no coinciden. Si es tu primera vez, activa antes tu invitación; si no recuerdas la contraseña, pulsa «He olvidado la contraseña».',
      accion: registroAbierto ? undefined : 'ir_a_crear',
    };
  }
  return { text: 'No hemos podido entrar. Revisa tus datos e inténtalo de nuevo.' };
}

/** Error al pedir el enlace de acceso sin contraseña («He olvidado la contraseña»). */
export function mensajeErrorEnlace(e: ErrorAuth, registroAbierto: boolean): MensajeAcceso {
  if (e.status === 429 || e.code === 'over_email_send_rate_limit' || e.code === 'over_request_rate_limit') {
    return { text: 'Ya te hemos enviado un enlace hace poco. Mira tu correo o espera un minuto para pedir otro.' };
  }
  // shouldCreateUser: false → si no hay cuenta, Supabase responde «Signups not allowed for otp».
  if (e.code === 'otp_disabled' || e.code === 'user_not_found' || msg(e).includes('signups not allowed')) {
    return registroAbierto
      ? { text: 'No hemos podido enviar el enlace. Si es tu primera vez, crea una cuenta; si ya tienes una, revisa el correo e inténtalo de nuevo.' }
      : { text: 'No hemos podido enviar el enlace. Si es tu primera vez, necesitas una invitación; si sigue fallando, contacta con el equipo.' };
  }
  if (e.code === 'email_address_invalid') {
    return { text: 'Revisa el correo: parece que falta algo (por ejemplo, la @ o el dominio).' };
  }
  return { text: 'No hemos podido enviar el enlace. Revisa el correo escrito e inténtalo de nuevo.' };
}

/** Errores al solicitar el restablecimiento, sin revelar si la dirección tiene cuenta. */
export function mensajeErrorRecuperacion(e: ErrorAuth): MensajeAcceso {
  if (e.status === 429 || e.code === 'over_email_send_rate_limit' || e.code === 'over_request_rate_limit') {
    return { text: 'Ya se ha solicitado un correo hace poco. Espera unos minutos antes de volver a intentarlo.' };
  }
  if (e.code === 'email_address_invalid' || msg(e).includes('invalid format') || msg(e).includes('is invalid')) {
    return { text: 'Revisa el correo: parece que falta algo (por ejemplo, la @ o el dominio).' };
  }
  if ((typeof e.status === 'number' && e.status >= 500) || e.code === 'unexpected_failure') {
    return { text: 'No podemos enviar el correo ahora. Inténtalo de nuevo más tarde.' };
  }
  return { text: 'No hemos podido solicitar el cambio de contraseña. Revisa el correo e inténtalo de nuevo.' };
}

export const SIN_CONEXION = 'No hay conexión con BomberoPro. Comprueba tu internet e inténtalo de nuevo.';

/** Lee el enlace de invitación: /?invitacion=1&email=ana@ejemplo.es */
export function leerEnlaceInvitacion(search: string): { invitacion: boolean; email: string } {
  const p = new URLSearchParams(search);
  const email = (p.get('email') ?? '').trim().toLowerCase();
  const invitacion = p.has('invitacion') || p.has('invitación');
  return { invitacion, email: email.includes('@') ? email : '' };
}
