// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.hoisted(() => vi.fn());
const order = vi.hoisted(() => vi.fn());
vi.mock('./supabase', () => ({
  supabase: {
    rpc,
    from: () => ({ select: () => ({ eq: () => ({ order }) }) }),
  },
}));

import { CLAVE_RESUMEN, CLAVE_TEMAS, pedirResumen, pedirTemas, reiniciarTemasCacheParaPruebas, resumenEnCache, temasEnCache } from './temasCache';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';

const tema = (numero: number) => ({ id: numero, numero, nombre: `Tema ${numero}` });
const fila = (t: number) => ({ tema: t, nombre: `Tema ${t}`, total: 3, dominados: 1, preguntas: 9 });

describe('caché de «Temas»', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reiniciarTemasCacheParaPruebas();
    resetLocalDataOwnerForTests();
    rpc.mockReset();
    order.mockReset();
  });

  it('sin nada guardado no devuelve nada; tras pedir, devuelve al instante y lo guarda en el dispositivo', async () => {
    order.mockResolvedValue({ data: [tema(1), tema(2)], error: null });
    expect(temasEnCache()).toBeNull();
    await pedirTemas();
    expect(temasEnCache()).toHaveLength(2);
    // «Nueva visita»: la memoria se pierde pero localStorage conserva lo último que llegó bien.
    reiniciarTemasCacheParaPruebas();
    expect(temasEnCache()).toHaveLength(2);
    expect(window.localStorage.getItem(CLAVE_TEMAS)).toContain('Tema 1');
  });

  it('no duplica peticiones mientras hay una en vuelo', async () => {
    order.mockResolvedValue({ data: [tema(1)], error: null });
    await Promise.all([pedirTemas(), pedirTemas(), pedirTemas()]);
    expect(order).toHaveBeenCalledTimes(1);
  });

  it('si la petición falla, conserva lo que había y no inventa nada', async () => {
    order.mockResolvedValueOnce({ data: [tema(1)], error: null });
    await pedirTemas();
    order.mockResolvedValueOnce({ data: null, error: { message: 'x' } });
    expect(await pedirTemas()).toBeNull();
    expect(temasEnCache()).toHaveLength(1);
    order.mockRejectedValueOnce(new Error('sin red'));
    expect(await pedirTemas()).toBeNull();
    expect(temasEnCache()).toHaveLength(1);
  });

  it('descarta datos dañados en localStorage', () => {
    window.localStorage.setItem(CLAVE_TEMAS, '{no es json');
    expect(temasEnCache()).toBeNull();
    reiniciarTemasCacheParaPruebas();
    window.localStorage.setItem(CLAVE_TEMAS, JSON.stringify([{ id: 'a' }]));
    expect(temasEnCache()).toBeNull();
  });

  it('el resumen es por cuenta: otra cuenta o la demo nunca ve el de la anterior', async () => {
    rpc.mockResolvedValue({ data: [fila(1), fila(2)], error: null });
    setLocalDataOwner('alumno-a');
    await pedirResumen();
    expect(Object.keys(resumenEnCache() ?? {})).toEqual(['1', '2']);
    expect(window.localStorage.getItem(`${CLAVE_RESUMEN}:alumno-a`)).not.toBeNull();

    setLocalDataOwner('alumno-b');
    expect(resumenEnCache()).toBeNull();
    setLocalDataOwner(null);
    expect(resumenEnCache()).toBeNull();
    setLocalDataOwner('alumno-a');
    expect(resumenEnCache()).not.toBeNull();
  });

  it('una respuesta de error del resumen no borra la caché', async () => {
    rpc.mockResolvedValueOnce({ data: [fila(1)], error: null });
    setLocalDataOwner('alumno-a');
    await pedirResumen();
    rpc.mockResolvedValueOnce({ data: null, error: { message: 'x' } });
    expect(await pedirResumen()).toBeNull();
    expect(resumenEnCache()).not.toBeNull();
  });
});
