// @vitest-environment jsdom
// Supuestos privados de la cuenta leídos de Supabase (tabla private_supuestos), con el cliente simulado.
import { render, screen, waitFor, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const { from, getSession, onAuthStateChange, rpc, filas } = vi.hoisted(() => ({
  from: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: () => {} } } })),
  rpc: vi.fn(),
  filas: { respuesta: (_t: string, _owner: unknown): Promise<unknown> | unknown => ({ data: [], error: null }) },
}));

/** Constructor encadenable: select/eq/order/limit devuelven el mismo objeto; al esperar, responde `filas`. */
function builder(tabla: string) {
  let owner: unknown = null;
  const b: Record<string, unknown> = {};
  for (const m of ['select', 'order', 'limit', 'in', 'neq', 'is', 'range', 'gte', 'lte', 'match']) b[m] = () => b;
  b.eq = (col: string, v: unknown) => {
    if (col === 'owner_id') owner = v;
    return b;
  };
  b.then = (ok: (v: unknown) => unknown, ko: (e: unknown) => unknown) => Promise.resolve().then(() => filas.respuesta(tabla, owner)).then(ok, ko);
  return b;
}

vi.mock('./supabase', () => ({
  supabase: {
    from: (t: string) => {
      from(t);
      return builder(t);
    },
    rpc: (...a: unknown[]) => rpc(...a),
    auth: { getSession, onAuthStateChange, signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn() },
  },
  isSupabaseConfigured: () => true,
}));

import App from '../App';
import { cargarSupuestosCuenta } from './privateSupuestos';
import { contarSupuestosPrivados, getSupuestosCuenta, leerSupuestosPrivados } from '../data/supuestos/supuestosPrivados';
import { setLocalDataOwner } from '../utils/localOwner';
import { completeOnboarding } from '../utils/onboarding';

const EJEMPLO = JSON.parse(readFileSync(join(process.cwd(), 'docs/ejemplos/supuestos-privados-EJEMPLO.json'), 'utf8'));
const supuestoEjemplo = (id = 'EJEMPLO-01', titulo = EJEMPLO.supuestos[0].titulo) => {
  const s = structuredClone(EJEMPLO.supuestos[0]);
  s.id = id;
  s.titulo = titulo;
  return s;
};
const filasDe = (...payloads: unknown[]) => ({ data: payloads.map((payload) => ({ payload })), error: null });
const llamadasTabla = () => from.mock.calls.filter(([t]) => t === 'private_supuestos').length;

beforeEach(() => {
  window.localStorage.clear();
  from.mockClear();
  rpc.mockReset();
  rpc.mockResolvedValue({ data: [], error: null });
  getSession.mockReset();
  filas.respuesta = () => ({ data: [], error: null });
  setLocalDataOwner(null);
});
afterEach(async () => {
  cleanup();
  setLocalDataOwner(null);
  await cargarSupuestosCuenta(null);
  window.location.hash = '';
});

describe('cargarSupuestosCuenta', () => {
  it('sin sesión no consulta la tabla', async () => {
    expect(await cargarSupuestosCuenta(null)).toEqual([]);
    expect(llamadasTabla()).toBe(0);
  });

  it('lee las filas de la cuenta, las valida con el esquema de importación y salta las inválidas', async () => {
    setLocalDataOwner('user-A');
    filas.respuesta = (t, owner) =>
      t === 'private_supuestos' && owner === 'user-A'
        ? filasDe(supuestoEjemplo('EJEMPLO-01'), { id: 'roto' }, 'no-es-objeto', supuestoEjemplo('EJEMPLO-02', 'EJEMPLO · Segundo'))
        : { data: [], error: null };
    const lista = await cargarSupuestosCuenta('user-A');
    expect(lista.map((s) => s.id)).toEqual(['EJEMPLO-01', 'EJEMPLO-02']);
    expect(lista.every((s) => s.autoria === 'privado')).toBe(true);
    expect(getSupuestosCuenta()).toHaveLength(2);
    expect(contarSupuestosPrivados()).toBe(2);
    // Solo en memoria: nada en localStorage.
    expect(leerSupuestosPrivados()).toEqual([]);
    expect(Object.keys(window.localStorage).filter((k) => k.includes('supuestos_privados'))).toEqual([]);
  });

  it('si la tabla no existe (migración sin aplicar) falla en silencio', async () => {
    setLocalDataOwner('user-A');
    for (const error of [
      { code: '42P01', message: 'relation "public.private_supuestos" does not exist' },
      { code: 'PGRST205', message: "Could not find the table 'public.private_supuestos'" },
    ]) {
      filas.respuesta = () => ({ data: null, error });
      expect(await cargarSupuestosCuenta('user-A')).toEqual([]);
      expect(contarSupuestosPrivados()).toBe(0);
    }
  });

  it('un error de red o una excepción no rompen nada', async () => {
    setLocalDataOwner('user-A');
    filas.respuesta = () => Promise.reject(new Error('Failed to fetch'));
    await expect(cargarSupuestosCuenta('user-A')).resolves.toEqual([]);
    filas.respuesta = () => {
      throw new Error('boom');
    };
    await expect(cargarSupuestosCuenta('user-A')).resolves.toEqual([]);
    expect(getSupuestosCuenta()).toEqual([]);
  });

  it('los supuestos de A no se ven al cambiar a B y una respuesta tardía de A se descarta', async () => {
    let soltarA!: (v: unknown) => void;
    filas.respuesta = (_t, owner) =>
      owner === 'user-A' ? new Promise((r) => (soltarA = r)) : filasDe(supuestoEjemplo('EJEMPLO-B', 'EJEMPLO · De B'));
    setLocalDataOwner('user-A');
    const pA = cargarSupuestosCuenta('user-A');
    await waitFor(() => expect(soltarA).toBeTypeOf('function'));
    setLocalDataOwner('user-B');
    await cargarSupuestosCuenta('user-B');
    soltarA(filasDe(supuestoEjemplo('EJEMPLO-A', 'EJEMPLO · De A')));
    expect(await pA).toEqual([]);
    expect(getSupuestosCuenta().map((s) => s.id)).toEqual(['EJEMPLO-B']);
    // Aunque la memoria tenga los de B, otra cuenta no los ve.
    setLocalDataOwner('user-C');
    expect(getSupuestosCuenta()).toEqual([]);
  });
});

describe('con la aplicación completa', () => {
  it('con sesión, sus supuestos aparecen en «Mis supuestos (privado)» junto a los importados y sale «Casos»', async () => {
    completeOnboarding('skipped');
    // Uno importado en local para esta cuenta.
    window.localStorage.setItem(
      'mira_supuestos_privados_v1:user-A',
      JSON.stringify([{ ...supuestoEjemplo('EJEMPLO-LOCAL', 'EJEMPLO · Local'), autoria: 'privado' }])
    );
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-A', email: 'a@example.com' } } }, error: null });
    filas.respuesta = (t, owner) =>
      t === 'private_supuestos' && owner === 'user-A' ? filasDe(supuestoEjemplo('EJEMPLO-CUENTA', 'EJEMPLO · De mi cuenta')) : { data: [], error: null };
    const user = userEvent.setup();
    render(<App />);
    const movil = await screen.findByRole('navigation', { name: 'Navegación móvil' });
    await user.click(await within(movil).findByRole('button', { name: 'Casos' }));
    expect(await screen.findByRole('heading', { name: 'Mis supuestos (privado)' })).toBeInTheDocument();
    const deCuenta = screen.getByRole('list', { name: 'Supuestos de mi cuenta' });
    expect(within(deCuenta).getByRole('button', { name: /EJEMPLO · De mi cuenta/ })).toHaveTextContent('En tu cuenta · solo tú');
    expect(within(deCuenta).queryByRole('button', { name: /Borrar/ })).toBeNull();
    expect(within(screen.getByRole('list', { name: 'Mis supuestos privados' })).getByRole('button', { name: /^EJEMPLO · Local/ })).toBeInTheDocument();

    await user.click(within(deCuenta).getByRole('button', { name: /EJEMPLO · De mi cuenta/ }));
    expect(screen.getByText('Material personal de tu cuenta (no se comparte).', { exact: false })).toBeInTheDocument();
    const p = (id: string) => document.querySelector<HTMLElement>(`[data-pregunta-id="${id}"]`)!;
    await user.click(within(p('EJEMPLO-01-p1')).getAllByRole('radio')[1]);
    await user.click(screen.getByRole('button', { name: /Corregir/ }));
    expect(document.querySelector('#supuesto-resultado')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('mira_supuestos_v1') ?? '{}')).toHaveProperty(['cuenta:EJEMPLO-CUENTA']);
  });

  it('si la tabla no existe, la app funciona igual y no sale «Casos» (alumno sin supuestos)', async () => {
    completeOnboarding('skipped');
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-A', email: 'a@example.com' } } }, error: null });
    filas.respuesta = (t) =>
      t === 'private_supuestos' ? { data: null, error: { code: 'PGRST205', message: 'not found' } } : { data: [], error: null };
    render(<App />);
    const movil = await screen.findByRole('navigation', { name: 'Navegación móvil' });
    await waitFor(() => expect(llamadasTabla()).toBeGreaterThan(0));
    expect(within(movil).queryByRole('button', { name: 'Casos' })).toBeNull();
  });
});
