import { describe, expect, it } from 'vitest';
import { leerEnlaceInvitacion, mensajeErrorAcceso, mensajeErrorEnlace, mensajeErrorRecuperacion } from './mensajesAcceso';

describe('mensajes de la pantalla de entrada', () => {
  const jerga = /database|error|supabase|otp|status|500|422/i;

  it('ningún mensaje muestra jerga técnica', () => {
    const errores = [
      { status: 500, code: 'unexpected_failure', message: 'Database error saving new user' },
      { status: 400, code: 'invalid_credentials', message: 'Invalid login credentials' },
      { status: 400, code: 'email_not_confirmed', message: 'Email not confirmed' },
      { status: 422, code: 'weak_password', message: 'Password should be at least 6 characters' },
      { status: 429, code: 'over_email_send_rate_limit', message: 'email rate limit exceeded' },
      { status: 400, code: 'email_address_invalid', message: 'Email address "x" is invalid' },
      { status: 400, code: 'email_address_not_authorized', message: 'Email address not authorized' },
      { status: 503, message: 'Service unavailable' },
    ];
    for (const e of errores) {
      for (const modo of ['entrar', 'crear'] as const) {
        for (const abierto of [true, false]) expect(mensajeErrorAcceso(modo, e, abierto).text).not.toMatch(jerga);
      }
      expect(mensajeErrorEnlace(e, false).text).not.toMatch(jerga);
    }
  });

  it('un error interno durante el alta no afirma si el correo está invitado', () => {
    const errores = [
      { status: 500, code: 'unexpected_failure', message: 'Database error saving new user' },
      { status: 503, message: 'Service unavailable' },
    ];
    for (const e of errores) {
      for (const registroAbierto of [true, false]) {
        const mensaje = mensajeErrorAcceso('crear', e, registroAbierto).text;
        expect(mensaje).toMatch(/inténtalo de nuevo más tarde/i);
        expect(mensaje).not.toMatch(/no está en la lista|correo no invitado|grupo piloto/i);
      }
    }
  });

  it('el registro globalmente desactivado da una instrucción distinta de un fallo de servidor', () => {
    expect(mensajeErrorAcceso('crear', { status: 422, code: 'signup_disabled' }, false).text)
      .toMatch(/registro está cerrado/i);
    expect(mensajeErrorAcceso('crear', { status: 422, code: 'signup_disabled' }, true).text)
      .toMatch(/no se pueden crear cuentas/i);
  });

  it('contraseña corta, correo sin confirmar y límite de correos tienen su propio mensaje', () => {
    expect(mensajeErrorAcceso('crear', { status: 422, code: 'weak_password' }, false).text).toMatch(/6 caracteres/);
    expect(mensajeErrorAcceso('entrar', { status: 400, code: 'email_not_confirmed' }, false)).toMatchObject({ accion: 'reenviar' });
    expect(mensajeErrorAcceso('crear', { status: 429, code: 'over_email_send_rate_limit' }, false).text).toMatch(/varios correos/);
  });

  it('los errores del restablecimiento no revelan si el correo tiene una cuenta', () => {
    expect(mensajeErrorRecuperacion({ status: 429, code: 'over_email_send_rate_limit' }).text)
      .toMatch(/espera unos minutos/i);
    const interno = mensajeErrorRecuperacion({ status: 500, code: 'unexpected_failure' }).text;
    expect(interno).toMatch(/inténtalo de nuevo más tarde/i);
    expect(interno).not.toMatch(/cuenta|usuario|registrado/i);
  });

  it('lee el enlace de invitación y descarta correos mal formados', () => {
    expect(leerEnlaceInvitacion('?invitacion=1&email=%20Ana@Ejemplo.ES')).toEqual({ invitacion: true, email: 'ana@ejemplo.es' });
    expect(leerEnlaceInvitacion('?invitacion')).toEqual({ invitacion: true, email: '' });
    expect(leerEnlaceInvitacion('?email=sinarroba')).toEqual({ invitacion: false, email: '' });
    expect(leerEnlaceInvitacion('')).toEqual({ invitacion: false, email: '' });
  });
});
