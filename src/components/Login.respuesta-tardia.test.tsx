// @vitest-environment jsdom
//
// QA adversarial (grok, 11/11/2026), revisión de #295: respuesta TARDÍA de una petición de acceso que llega
// después del tiempo límite (ACCESO_TIMEOUT_MS). La petición original no se cancela, así que puede terminar
// mientras el alumno ya está reintentando. Se exige:
//  (a) éxito tardío: no deja la pantalla incoherente (la sesión la acepta App por onAuthStateChange; Login lo ignora);
//  (b) error tardío: no pisa el mensaje ni el estado («cargando») de un reintento en curso;
//  (c) sin doble envío y sin actualizar estado tras desmontar la pantalla.

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

type Accion = 'entrar' | 'recuperar' | 'enlace' | 'activar';
const ACCIONES: Accion[] = ['entrar', 'recuperar', 'enlace', 'activar'];
const mockDe: Record<Accion, ReturnType<typeof vi.fn>> = { entrar: signInWithPassword, recuperar: resetPasswordForEmail, enlace: signInWithOtp, activar: signUp };
const nombreBoton = (a: Accion) => (a === 'recuperar' ? 'He olvidado la contraseña' : a === 'enlace' ? 'Entrar con enlace sin contraseña' : /^(entrar|activar mi cuenta)$/i);

/** Promesa controlable: simula una petición en vuelo que termina cuando el test quiere. */
function diferida<T>() {
  let resolver!: (v: T) => void;
  const promesa = new Promise<T>(r => { resolver = r; });
  return { promesa, resolver };
}
const exito: Record<Accion, unknown> = {
  entrar: { data: { session: { user: { id: 'u1' } }, user: { id: 'u1' } }, error: null },
  recuperar: { data: {}, error: null },
  enlace: { data: {}, error: null },
  activar: { data: { session: null, user: { id: 'u1' } }, error: null }, // alta pendiente de confirmar correo
};
const error500 = { data: { session: null, user: null }, error: { name: 'AuthApiError', status: 500, code: 'unexpected_failure', message: 'x' } };
const error400 = { data: { session: null, user: null }, error: { status: 400, code: 'invalid_credentials', message: 'Invalid login credentials' } };

function preparar(accion: Accion) {
  const vista = render(<Login />);
  if (accion === 'activar') fireEvent.click(screen.getByRole('button', { name: /^activar invitación$/i }));
  fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'ana@example.com' } });
  if (accion === 'entrar' || accion === 'activar') fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'secreto123' } });
  return vista;
}
const boton = (accion: Accion): HTMLElement => (accion === 'entrar' || accion === 'activar'
  ? document.querySelector('button[type="submit"]') as HTMLElement // su texto cambia a «cargando» en vuelo
  : screen.getByRole('button', { name: nombreBoton(accion) }));
const pulsar = (accion: Accion) => fireEvent.click(boton(accion));
const alertas = () => screen.queryAllByRole('alert').map(a => a.textContent ?? '');
const estados = () => screen.queryAllByRole('status').map(a => a.textContent ?? '');
const cargando = (accion: Accion) => boton(accion).hasAttribute('disabled');
const modo = () => screen.getByRole('group', { name: 'Tipo de acceso' }).querySelector('[aria-pressed="true"]')?.textContent;

beforeEach(() => { vi.useFakeTimers(); Object.values(mockDe).forEach(m => m.mockReset()); });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

async function agotarTiempo() {
  await act(async () => { vi.advanceTimersByTime(ACCESO_TIMEOUT_MS + 10); });
}

describe('respuesta tardía tras el tiempo límite', () => {
  it.each(ACCIONES)('%s: error tardío de la 1.ª petición no pisa el reintento en curso; gana la respuesta del reintento', async (accion) => {
    const primera = diferida<unknown>(); const segunda = diferida<unknown>();
    mockDe[accion].mockReturnValueOnce(primera.promesa).mockReturnValueOnce(segunda.promesa);
    preparar(accion); const modoInicial = modo();
    pulsar(accion);
    await agotarTiempo();
    expect(alertas().join(' ')).toMatch(/no hemos recibido respuesta/i);
    pulsar(accion); // reintento: queda en vuelo
    expect(cargando(accion)).toBe(true);
    expect(alertas()).toEqual([]);
    await act(async () => { primera.resolver(error500); });
    expect(alertas()).toEqual([]); // el 500 tardío no aparece
    expect(cargando(accion)).toBe(true); // ni desbloquea el reintento a medias
    await act(async () => { segunda.resolver(accion === 'entrar' ? error400 : exito[accion]); });
    if (accion === 'activar') {
      // Alta pendiente de confirmar: la pantalla pasa a «Revisa tu correo» con el resultado del REINTENTO.
      expect(screen.getByRole('heading', { name: 'Revisa tu correo' })).toBeInTheDocument();
    } else {
      expect(cargando(accion)).toBe(false);
      if (accion === 'entrar') expect(alertas().join(' ')).toMatch(/no coinciden/i);
      else expect(alertas()).toEqual([]);
    }
    if (accion !== 'activar') expect(modo()).toBe(modoInicial);
    expect(mockDe[accion]).toHaveBeenCalledTimes(2);
  });

  it.each(ACCIONES)('%s: éxito tardío de la 1.ª petición durante el reintento no pisa su resultado (error del reintento visible)', async (accion) => {
    const primera = diferida<unknown>(); const segunda = diferida<unknown>();
    mockDe[accion].mockReturnValueOnce(primera.promesa).mockReturnValueOnce(segunda.promesa);
    preparar(accion); const modoInicial = modo();
    pulsar(accion);
    await agotarTiempo();
    pulsar(accion);
    await act(async () => { primera.resolver(exito[accion]); });
    expect(estados().join(' ')).not.toMatch(/recibirás|recibirá|si ana@example.com/i);
    expect(screen.queryByRole('heading', { name: 'Revisa tu correo' })).not.toBeInTheDocument();
    await act(async () => { segunda.resolver(error500); });
    expect(alertas().join(' ')).toMatch(/inténtalo de nuevo/i);
    expect(modo()).toBe(modoInicial);
    expect(mockDe[accion]).toHaveBeenCalledTimes(2);
  });

  it.each(ACCIONES)('%s: éxito tardío sin reintento deja el aviso de tiempo límite y un formulario usable (sin estado a medias)', async (accion) => {
    const primera = diferida<unknown>();
    mockDe[accion].mockReturnValueOnce(primera.promesa).mockResolvedValueOnce(error400);
    preparar(accion); const modoInicial = modo();
    pulsar(accion);
    await agotarTiempo();
    await act(async () => { primera.resolver(exito[accion]); });
    // Login no cambia de modo, no muestra «Revisa tu correo» ni se queda cargando. Con sesión (entrar),
    // la entrada la hace App al recibir SIGNED_IN (onAuthStateChange), igual que una respuesta a tiempo.
    expect(cargando(accion)).toBe(false);
    expect(modo()).toBe(modoInicial);
    expect(screen.queryByRole('heading', { name: 'Revisa tu correo' })).not.toBeInTheDocument();
    expect(alertas().join(' ')).toMatch(/no hemos recibido respuesta/i);
    pulsar(accion); // un reintento posterior funciona con normalidad
    await act(async () => {});
    expect(mockDe[accion]).toHaveBeenCalledTimes(2);
  });

  it.each(ACCIONES)('%s: sin doble envío mientras la petición está en vuelo (doble toque y Enter)', async (accion) => {
    mockDe[accion].mockReturnValue(new Promise(() => {}));
    preparar(accion);
    pulsar(accion);
    pulsar(accion);
    fireEvent.submit(screen.getByLabelText(/correo electrónico/i).closest('form')!);
    expect(mockDe[accion]).toHaveBeenCalledTimes(1);
  });

  it.each(ACCIONES)('%s: al desmontar con la petición en vuelo, ni el tiempo límite ni la respuesta tardía actualizan la pantalla', async (accion) => {
    const primera = diferida<unknown>();
    mockDe[accion].mockReturnValueOnce(primera.promesa);
    const errores = vi.spyOn(console, 'error');
    const vista = preparar(accion);
    pulsar(accion);
    vista.unmount();
    await agotarTiempo();
    await act(async () => { primera.resolver(error500); });
    expect(errores).not.toHaveBeenCalled();
    // Volver a la pantalla: formulario limpio, sin mensajes heredados de la petición anterior.
    preparar(accion);
    expect(alertas()).toEqual([]);
    expect(cargando(accion)).toBe(false);
  });

  it.each(ACCIONES)('%s: 429 dice que espere, no culpa a los datos', async (accion) => {
    mockDe[accion].mockResolvedValue({ data: { session: null, user: null }, error: { status: 429, code: 'over_request_rate_limit', message: 'rate limit' } });
    preparar(accion);
    pulsar(accion);
    await act(async () => {});
    expect(alertas().join(' ')).toMatch(/espera|hace poco/i);
    expect(alertas().join(' ')).not.toMatch(/revisa tus datos|no coinciden/i);
  });
});
