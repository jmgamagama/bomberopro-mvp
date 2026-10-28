import { describe, expect, it, vi } from 'vitest';
import { applyUpdate, bundleFromHtml, type UpdatableRegistration } from './appUpdate';

const NEW = '/assets/index-NUEVO.js';
const OLD = '/assets/index-VIEJO.js';

/** Registro falso: el service worker nuevo tarda `installTicks` comprobaciones en instalarse. */
function fakeRegistration(installTicks: number) {
  let ticks = 0;
  const reg: UpdatableRegistration & { tick: () => void } = {
    get installing() { return ticks < installTicks ? {} : null; },
    waiting: null,
    update: vi.fn(async () => undefined),
    unregister: vi.fn(async () => true),
    tick: () => { ticks += 1; },
  };
  return reg;
}

function deps(reg: ReturnType<typeof fakeRegistration> | null, served: () => string | null) {
  const reload = vi.fn();
  return {
    reload,
    run: () => applyUpdate({
      getRegistration: async () => reg,
      servedBundle: async () => served(),
      liveBundle: async () => NEW,
      reload,
      sleep: async () => { reg?.tick(); },
      timeoutMs: 1000,
      pollMs: 100,
    }),
  };
}

describe('applyUpdate (botón «Actualizar»)', () => {
  it('sin service worker, recarga directamente', async () => {
    const d = deps(null, () => OLD);
    await expect(d.run()).resolves.toBe('sin-service-worker');
    expect(d.reload).toHaveBeenCalledTimes(1);
  });

  it('espera a que el service worker nuevo se instale antes de recargar', async () => {
    const reg = fakeRegistration(3);
    // Mientras se instala sirve la versión vieja; después, la nueva.
    const d = deps(reg, () => (reg.installing ? OLD : NEW));
    await expect(d.run()).resolves.toBe('service-worker-al-dia');
    expect(reg.update).toHaveBeenCalled();
    expect(reg.unregister).not.toHaveBeenCalled();
    expect(d.reload).toHaveBeenCalledTimes(1);
  });

  it('regresión 28-oct: si el service worker seguiría sirviendo la versión vieja, lo da de baja para que la recarga traiga la nueva', async () => {
    const reg = fakeRegistration(0);
    const d = deps(reg, () => OLD);
    await expect(d.run()).resolves.toBe('service-worker-dado-de-baja');
    expect(reg.unregister).toHaveBeenCalledTimes(1);
    expect(d.reload).toHaveBeenCalledTimes(1);
  });

  it('si la instalación no termina a tiempo (móvil lento), no deja al alumno esperando: da de baja y recarga', async () => {
    const reg = fakeRegistration(Infinity);
    const d = deps(reg, () => NEW);
    await expect(d.run()).resolves.toBe('service-worker-dado-de-baja');
    expect(reg.unregister).toHaveBeenCalledTimes(1);
    expect(d.reload).toHaveBeenCalledTimes(1);
  });

  it('si update() falla (sin red), sigue y recarga igualmente', async () => {
    const reg = fakeRegistration(0);
    reg.update = vi.fn(async () => { throw new Error('offline'); });
    const d = deps(reg, () => NEW);
    await expect(d.run()).resolves.toBe('service-worker-al-dia');
    expect(d.reload).toHaveBeenCalledTimes(1);
  });
});

describe('bundleFromHtml', () => {
  it('toma el script principal de index.html', () => {
    const html = '<head><script type="module" crossorigin src="/assets/index-DtHUaVEh.js"></script>'
      + '<link rel="stylesheet" crossorigin href="/assets/index-17dRwk8y.css"></head>';
    expect(bundleFromHtml(html)).toBe('/assets/index-DtHUaVEh.js');
  });

  it('devuelve null si no hay script principal', () => {
    expect(bundleFromHtml('<html></html>')).toBeNull();
  });
});
