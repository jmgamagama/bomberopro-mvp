import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reiniciarSolicitudAlmacenamiento, solicitarAlmacenamientoPersistente } from './almacenamientoPersistente';

function mockStorage(storage: unknown) {
  Object.defineProperty(navigator, 'storage', { value: storage, configurable: true });
}

describe('solicitarAlmacenamientoPersistente', () => {
  beforeEach(() => reiniciarSolicitudAlmacenamiento());
  afterEach(() => mockStorage(undefined));

  it('pide persistencia al navegador y devuelve su respuesta', async () => {
    const persist = vi.fn(() => Promise.resolve(true));
    mockStorage({ persist, persisted: () => Promise.resolve(false) });
    expect(await solicitarAlmacenamientoPersistente()).toBe(true);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('no vuelve a pedirla en la misma sesión', async () => {
    const persist = vi.fn(() => Promise.resolve(true));
    mockStorage({ persist, persisted: () => Promise.resolve(false) });
    await solicitarAlmacenamientoPersistente();
    await solicitarAlmacenamientoPersistente();
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('si ya era persistente, no pregunta de nuevo', async () => {
    const persist = vi.fn(() => Promise.resolve(true));
    mockStorage({ persist, persisted: () => Promise.resolve(true) });
    expect(await solicitarAlmacenamientoPersistente()).toBe(true);
    expect(persist).not.toHaveBeenCalled();
  });

  it('no falla si el navegador no lo soporta', async () => {
    mockStorage(undefined);
    expect(await solicitarAlmacenamientoPersistente()).toBe(false);
  });

  it('no lanza si persist() se rechaza', async () => {
    mockStorage({ persist: () => Promise.reject(new Error('bloqueado')), persisted: () => Promise.resolve(false) });
    expect(await solicitarAlmacenamientoPersistente()).toBe(false);
  });
});
