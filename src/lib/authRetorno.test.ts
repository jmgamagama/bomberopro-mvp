import { describe, expect, it } from 'vitest';
import { leerRetornoAuth, urlRetornoAuth } from './authRetorno';

const base = 'https://bomberopro-mvp.vercel.app/';

describe('leerRetornoAuth', () => {
  it('reconoce la confirmación de cuenta (hash de Supabase con type=signup)', () => {
    expect(leerRetornoAuth(`${base}?acceso=registro#access_token=abc&refresh_token=r&type=signup`)).toEqual({ tipo: 'registro' });
  });

  it('reconoce invitación, recuperar contraseña y enlace mágico', () => {
    expect(leerRetornoAuth(`${base}#access_token=abc&type=invite`)).toEqual({ tipo: 'invitacion' });
    expect(leerRetornoAuth(`${base}#access_token=abc&type=recovery`)).toEqual({ tipo: 'recuperar' });
    expect(leerRetornoAuth(`${base}?acceso=enlace#access_token=abc&type=magiclink`)).toEqual({ tipo: 'enlace' });
  });

  it('usa ?acceso= cuando supabase-js ya ha limpiado el hash', () => {
    expect(leerRetornoAuth(`${base}?acceso=registro`)).toEqual({ tipo: 'registro' });
  });

  it('detecta el enlace caducado o ya usado (en el hash o en la query)', () => {
    expect(leerRetornoAuth(`${base}?acceso=registro#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid`))
      .toEqual({ tipo: 'error', codigo: 'otp_expired' });
    expect(leerRetornoAuth(`${base}?error=access_denied`)).toEqual({ tipo: 'error', codigo: 'access_denied' });
  });

  it('no confunde la navegación normal ni el hash #supuestos con un enlace de correo', () => {
    expect(leerRetornoAuth(base)).toBeNull();
    expect(leerRetornoAuth(`${base}#supuestos`)).toBeNull();
    expect(leerRetornoAuth(`${base}?acceso=otra-cosa`)).toBeNull();
    expect(leerRetornoAuth(`${base}#type=signup`)).toBeNull();
    expect(leerRetornoAuth('no es una url')).toBeNull();
  });
});

describe('urlRetornoAuth', () => {
  it('vuelve al mismo dominio en el que está la app, nunca a localhost fijo', () => {
    expect(urlRetornoAuth('registro', 'https://bomberopro-mvp.vercel.app')).toBe('https://bomberopro-mvp.vercel.app/?acceso=registro');
    expect(urlRetornoAuth('enlace', 'https://bomberopro-abc-bombero-pro.vercel.app')).toBe('https://bomberopro-abc-bombero-pro.vercel.app/?acceso=enlace');
  });
});
