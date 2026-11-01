// @vitest-environment jsdom
/**
 * Los 7 flujos de acceso con Supabase simulado (feat/auth-solida):
 * registro, entrar, recuperar contraseña, Google, Apple, cerrar sesión e invitado → cuenta.
 */
import './test/setup';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({
  signUp: vi.fn(), signInWithPassword: vi.fn(), signInWithOtp: vi.fn(), resend: vi.fn(),
  resetPasswordForEmail: vi.fn(), signInWithOAuth: vi.fn(), updateUser: vi.fn(),
}));
vi.mock('./lib/supabase', () => ({ supabase: { auth }, isSupabaseConfigured: () => true }));

import Login from './components/Login';
import AccesoConfirmado from './components/AccesoConfirmado';
import { baseRetorno, leerRetornoAuth, urlRetornoAuth } from './lib/authRetorno';
import { explicarErrorRetorno, mensajeErrorNuevaContrasena } from './lib/mensajesAcceso';
import { hasGuestSignupIntent, markGuestSignupIntent, migrateGuestProgress } from './utils/guestProgress';

beforeEach(() => { Object.values(auth).forEach((f) => f.mockReset()); localStorage.clear(); sessionStorage.clear(); });
afterEach(() => vi.unstubAllEnvs());

describe('1. Registro con correo', () => {
  it('envía el alta con vuelta a /?acceso=registro y no la duplica con doble toque', async () => {
    vi.stubEnv('VITE_REGISTRO_ABIERTO', 'true');
    let fin!: (v: unknown) => void;
    auth.signUp.mockReturnValue(new Promise((ok) => { fin = ok; }));
    const user = userEvent.setup();
    render(<Login initialMode="crear" />);
    await user.type(screen.getByLabelText(/correo electrónico/i), 'Ana@Ejemplo.es ');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'secreta1');
    const form = screen.getByRole('button', { name: /crear mi cuenta/i }).closest('form')!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(auth.signUp).toHaveBeenCalledTimes(1);
    expect(auth.signUp).toHaveBeenCalledWith({ email: 'ana@ejemplo.es', password: 'secreta1', options: { emailRedirectTo: expect.stringMatching(/\/\?acceso=registro$/) } });
    fin({ data: { user: { identities: [{}] }, session: null }, error: null });
    expect(await screen.findByRole('heading', { name: 'Revisa tu correo' })).toBeInTheDocument();
  });
});

describe('2. Entrar con correo', () => {
  it('credenciales malas: mensaje claro en español', async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: { status: 400, code: 'invalid_credentials', message: 'Invalid login credentials' } });
    const user = userEvent.setup();
    render(<Login />);
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@ejemplo.es');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'mala123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/no coinciden/i);
  });
});

describe('3. Recuperar contraseña', () => {
  it('pide el correo con redirectTo a /?acceso=recuperar', async () => {
    auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
    const user = userEvent.setup();
    render(<Login />);
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@ejemplo.es');
    await user.click(screen.getByRole('button', { name: 'He olvidado la contraseña' }));
    expect(auth.resetPasswordForEmail).toHaveBeenCalledWith('ana@ejemplo.es', { redirectTo: expect.stringMatching(/\/\?acceso=recuperar$/) });
    expect(auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it('reconoce la vuelta implícita (#type=recovery) y la PKCE (?code=…&acceso=recuperar)', () => {
    expect(leerRetornoAuth('https://x.es/#access_token=a&type=recovery')).toEqual({ tipo: 'recuperar' });
    expect(leerRetornoAuth('https://x.es/?acceso=recuperar&code=abc')).toEqual({ tipo: 'recuperar' });
    expect(leerRetornoAuth('https://x.es/?acceso=recuperar#error=access_denied&error_code=otp_expired')).toEqual({ tipo: 'error', codigo: 'otp_expired' });
    expect(explicarErrorRetorno('otp_expired')).toMatch(/caducado o ya se usó/);
  });

  it('con sesión del enlace: guarda la nueva contraseña con updateUser', async () => {
    auth.updateUser.mockResolvedValueOnce({ data: {}, error: { code: 'same_password', status: 422 } }).mockResolvedValueOnce({ data: {}, error: null });
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'recuperar' }} conSesion onContinuar={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Elige tu nueva contraseña' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Nueva contraseña'), 'nueva123');
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/ya es tu contraseña actual/i);
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect(await screen.findByText(/contraseña guardada/i)).toBeInTheDocument();
    expect(auth.updateUser).toHaveBeenLastCalledWith({ password: 'nueva123' });
  });

  it('sin sesión (enlace caducado u otro navegador): no dice «cuenta activada»', () => {
    render(<AccesoConfirmado retorno={{ tipo: 'recuperar' }} conSesion={false} onContinuar={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'No hemos podido abrir el enlace' })).toBeInTheDocument();
    expect(screen.queryByText(/tu correo está confirmado/i)).toBeNull();
    expect(mensajeErrorNuevaContrasena({ status: 401 })).toMatch(/caducado/);
  });
});

describe.each([['google', 'VITE_AUTH_GOOGLE', 'Continuar con Google'], ['apple', 'VITE_AUTH_APPLE', 'Continuar con Apple']] as const)('4/5. OAuth %s', (provider, flag, etiqueta) => {
  it('sin flag no hay botón (proveedor apagado en Supabase)', () => {
    render(<Login />);
    expect(screen.queryByRole('button', { name: etiqueta })).toBeNull();
  });

  it('con flag: abre el proveedor con vuelta a /?acceso=oauth y explica si está desactivado', async () => {
    vi.stubEnv(flag, 'true');
    auth.signInWithOAuth.mockResolvedValue({ data: {}, error: { status: 400, code: 'validation_failed', message: 'Unsupported provider: provider is not enabled' } });
    const user = userEvent.setup();
    render(<Login />);
    await user.click(screen.getByRole('button', { name: etiqueta }));
    expect(auth.signInWithOAuth).toHaveBeenCalledWith({ provider, options: { redirectTo: expect.stringMatching(/\/\?acceso=oauth$/) } });
    expect(await screen.findByRole('alert')).toHaveTextContent(/aún no está disponible/i);
  });

  it('vuelta con error (cancelado) se explica como OAuth, no como enlace caducado', () => {
    const r = leerRetornoAuth('https://x.es/?acceso=oauth&error=access_denied&error_description=cancel');
    expect(r).toEqual({ tipo: 'error', codigo: 'oauth_access_denied' });
    expect(explicarErrorRetorno('oauth_access_denied')).toMatch(/Google o Apple/);
  });
});

describe('URL de vuelta', () => {
  it('usa el origen http(s) y si no VITE_SITE_URL', () => {
    expect(baseRetorno('https://preview.vercel.app', 'https://bomberopro.es')).toBe('https://preview.vercel.app');
    expect(baseRetorno('capacitor://localhost', 'https://bomberopro.es')).toBe('https://bomberopro.es');
    expect(urlRetornoAuth('recuperar', 'https://bomberopro.es/')).toBe('https://bomberopro.es/?acceso=recuperar');
  });
});

describe('7. Invitado → cuenta', () => {
  it('con la marca de intención, el progreso del invitado se copia a la cuenta sin pisar nada', () => {
    localStorage.setItem('mira_demo_attempts_v2', '[{"id":1}]');
    localStorage.setItem('bomberopro:racha:demo', '3');
    localStorage.setItem('mira_attempts_v1:u1', '[{"id":9}]');
    expect(migrateGuestProgress('u1')).toEqual([]);
    markGuestSignupIntent();
    expect(hasGuestSignupIntent()).toBe(true);
    migrateGuestProgress('u1');
    expect(localStorage.getItem('bomberopro:racha:u1')).toBe('3');
    expect(localStorage.getItem('mira_attempts_v1:u1')).toBe('[{"id":9}]');
    expect(localStorage.getItem('mira_demo_attempts_v2')).toBe('[{"id":1}]');
  });
});
