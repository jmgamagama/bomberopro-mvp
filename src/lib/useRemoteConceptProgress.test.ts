// @vitest-environment jsdom
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
const { rpc, getSession, setHeader } = vi.hoisted(() => ({ rpc: vi.fn(), getSession: vi.fn(), setHeader: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: {
  auth: { getSession },
  rpc: (...args: unknown[]) => { const reply = rpc(...args); return { setHeader: (name: string, value: string) => { setHeader(name, value); return reply; } }; },
} }));
import { useRemoteConceptProgress } from './useRemoteConceptProgress';
afterEach(cleanup);
const data = { total: 703, por_aprender: 698, aprendiendo: 2, debil: 3, dominado: 0, consolidado: 0, vencidos: 1, dominio_ponderado: 0.01 };
const session = (id: string) => ({ data: { session: { user: { id }, access_token: 'token-' + id } }, error: null });
beforeEach(() => { rpc.mockReset(); setHeader.mockReset(); getSession.mockReset(); getSession.mockResolvedValue(session('A')); });
describe('lectura de progreso por cuenta', () => {
  it('no consulta el backend en demo', async () => {
    renderHook(() => useRemoteConceptProgress(null, true));
    expect(rpc).not.toHaveBeenCalled();
  });
  it('pide todos los temas con token de la cuenta y devuelve sus datos', async () => {
    rpc.mockResolvedValue({ data, error: null });
    const { result } = renderHook(() => useRemoteConceptProgress('A', true));
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(rpc).toHaveBeenCalledWith('get_concept_progress', { p_topic: null });
    expect(setHeader).toHaveBeenCalledWith('Authorization', 'Bearer token-A');
  });
  it('un fallo no convierte un error en progreso vacío', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: 'PGRST301' } });
    const { result } = renderHook(() => useRemoteConceptProgress('A', true));
    await waitFor(() => expect(result.current.state.status).toBe('error'));
  });
  it('descarta el resultado tardío de A después de cambiar a B', async () => {
    let resolveA!: (value: unknown) => void;
    rpc.mockImplementationOnce(() => new Promise(resolve => { resolveA = resolve; }));
    const { result, rerender } = renderHook(({ owner }) => useRemoteConceptProgress(owner, true), { initialProps: { owner: 'A' } });
    await waitFor(() => expect(resolveA).toBeTypeOf('function'));
    getSession.mockResolvedValue(session('B'));
    rpc.mockResolvedValue({ data: { ...data, total: 800 }, error: null });
    rerender({ owner: 'B' });
    await waitFor(() => expect(result.current.state).toEqual({ status: 'ready', data: { ...data, total: 800 } }));
    await act(async () => resolveA({ data, error: null }));
    expect(result.current.state).toEqual({ status: 'ready', data: { ...data, total: 800 } });
  });
  it('vuelve a leer el progreso al regresar de estudiar', async () => {
    rpc.mockResolvedValue({ data, error: null });
    const { result, rerender } = renderHook(({ active }) => useRemoteConceptProgress('A', active), { initialProps: { active: true } });
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    rerender({ active: false });
    rpc.mockResolvedValue({ data: { ...data, aprendiendo: 3 }, error: null });
    rerender({ active: true });
    await waitFor(() => expect(result.current.state).toEqual({ status: 'ready', data: { ...data, aprendiendo: 3 } }));
    expect(rpc).toHaveBeenCalledTimes(2);
  });
});
