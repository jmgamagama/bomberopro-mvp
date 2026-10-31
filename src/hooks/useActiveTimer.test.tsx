// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useActiveTimer } from './useActiveTimer';

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  document.dispatchEvent(new Event('visibilitychange'));
}

describe('useActiveTimer', () => {
  beforeEach(() => { vi.useFakeTimers(); setVisibility('visible'); });
  afterEach(() => { vi.useRealTimers(); setVisibility('visible'); });

  it('con la pestaña oculta el tiempo no corre', () => {
    const { result } = renderHook(() => useActiveTimer('p1'));
    act(() => { vi.advanceTimersByTime(5_000); });
    act(() => { setVisibility('hidden'); });
    act(() => { vi.advanceTimersByTime(10 * 60 * 1000); });
    act(() => { setVisibility('visible'); });
    act(() => { vi.advanceTimersByTime(3_000); });
    expect(result.current.getElapsedMs()).toBe(8_000);
  });

  it('running=false lo detiene (ya respondida) y conserva el valor', () => {
    const { result, rerender } = renderHook(({ running }) => useActiveTimer('p1', { running }), { initialProps: { running: true } });
    act(() => { vi.advanceTimersByTime(4_000); });
    rerender({ running: false });
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current.getElapsedMs()).toBe(4_000);
  });

  it('cambiar de pregunta reinicia a cero', () => {
    const { result, rerender } = renderHook(({ key }) => useActiveTimer(key), { initialProps: { key: 'p1' } });
    act(() => { vi.advanceTimersByTime(30_000); });
    rerender({ key: 'p2' });
    expect(result.current.getElapsedMs()).toBeLessThan(1_000);
  });

  it('si se abre con la pestaña oculta, no empieza hasta que se ve', () => {
    setVisibility('hidden');
    const { result } = renderHook(() => useActiveTimer('p1'));
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current.getElapsedMs()).toBe(0);
    act(() => { setVisibility('visible'); });
    act(() => { vi.advanceTimersByTime(2_000); });
    expect(result.current.getElapsedMs()).toBe(2_000);
  });

  it('con display refresca elapsedMs cada segundo', () => {
    const { result } = renderHook(() => useActiveTimer('p1', { display: true }));
    act(() => { vi.advanceTimersByTime(3_000); });
    expect(result.current.elapsedMs).toBe(3_000);
  });
});
