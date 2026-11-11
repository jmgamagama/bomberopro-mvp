// @vitest-environment jsdom
//
// QA adversarial (grok, 11/11/2026): errores de red en la pantalla de acceso.
// Supabase Auth NO lanza sin conexión: devuelve { error: AuthRetryableFetchError, status 0 } (502-504 con
// su estado). La app lo trataba como un error de datos («Revisa tus datos», «Revisa el correo escrito»)
// y una petición colgada dejaba el botón girando sin fin. Ahora: mensaje de conexión o de servicio y,
// si no hay respuesta en ACCESO_TIMEOUT_MS, aviso y formulario desbloqueado para reintentar.

import '../test/setup';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { signUp, signInWithPassword, signInWithOtp, resetPasswordForEmail, resend } = vi.hoisted(() => ({
  signUp: vi.fn(), signInWithPassword: vi.fn(), signInWithOtp: vi.fn(), resetPasswordForEmail: vi.fn(), resend: vi.fn(),
}));
vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signUp, signInWithPassword, signInWithOtp, resetPasswordForEmail, resend } },
}));

import Login from './Login';
import { ACCESO_TIMEOUT_MS } from '../lib/mensajesAcceso';

const sinRed = { data: { session: null, user: null }, error: { name: 'AuthRetryableFetchError', status: 0, message: 'Failed to fetch' } };
const caido = { data: { session: null, user: null }, error: { name: 'AuthRetryableFetchError', status: 503, message: '{}' } };
const error500 = { data: { session: null, user: null }, error: { name: 'AuthApiError', status: 500, code: 'unexpected_failure', message: 'Internal Server Error' } };
const CULPA = /revisa tus datos|revisa el correo|no coinciden|revisa el correo y la contraseña/i;

type Accion = 'entrar' | 'recuperar' | 'enlace' | 'activar';
const mockDe: Record<Accion, ReturnType<typeof vi.fn>> = { entrar: signInWithPassword, recuperar: resetPasswordForEmail, enlace: signInWithOtp, activar: signUp };

function hacer(accion: Accion) {
  render(<Login />);
  if (accion === 'activar') fireEvent.click(screen.getByRole('button', { name: /^activar invitación$/i }));
  fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'ana@example.com' } });
  if (accion === 'entrar' || accion === 'activar') {
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'secreto123' } });
    fireEvent.click(screen.getByRole('button', { name: /^(entrar|activar mi cuenta)$/i }));
  } else {
    fireEvent.click(screen.getByRole('button', { name: accion === 'recuperar' ? 'He olvidado la contraseña' : 'Entrar con enlace sin contraseña' }));
  }
}

beforeEach(() => Object.values(mockDe).forEach(m => m.mockReset()));
afterEach(() => { vi.useRealTimers(); });

describe('acceso con errores de red', () => {
  const acciones: Accion[] = ['entrar', 'recuperar', 'enlace', 'activar'];
  it.each(acciones)('%s sin conexión: dice que no hay conexión, no culpa a los datos', async (accion) => {
    mockDe[accion].mockResolvedValue(sinRed);
    hacer(accion);
    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toMatch(/conexión/i);
    expect(alerta.textContent).not.toMatch(CULPA);
  });

  it.each(acciones)('%s con el servicio caído (503 / 500): no culpa a los datos', async (accion) => {
    for (const r of [caido, error500]) {
      mockDe[accion].mockResolvedValue(r);
      const { unmount } = (hacer(accion), { unmount: () => document.body.replaceChildren() });
      const alerta = await screen.findByRole('alert');
      expect(alerta.textContent).not.toMatch(CULPA);
      expect(alerta.textContent).toMatch(/inténtalo de nuevo/i);
      unmount();
    }
  });

  it.each(acciones)('%s con la petición colgada: avisa y desbloquea el formulario', async (accion) => {
    vi.useFakeTimers();
    mockDe[accion].mockReturnValue(new Promise(() => {}));
    hacer(accion);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(ACCESO_TIMEOUT_MS + 10); });
    expect(screen.getByRole('alert').textContent).toMatch(/no hemos recibido respuesta/i);
    const boton = accion === 'recuperar' ? 'He olvidado la contraseña' : accion === 'enlace' ? 'Entrar con enlace sin contraseña' : /^(entrar|activar mi cuenta)$/i;
    expect(screen.getByRole('button', { name: boton })).toBeEnabled();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeEnabled();
  });

  it('un error de datos de verdad (400) sigue diciendo que revise sus datos', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, code: 'invalid_credentials', message: 'Invalid login credentials' } });
    hacer('entrar');
    expect((await screen.findByRole('alert')).textContent).toMatch(/no coinciden/i);
  });
});
