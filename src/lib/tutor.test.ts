// @vitest-environment jsdom
import '../test/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const rpc = vi.fn();
vi.mock('./supabase', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a) } }));

import { formatearMinutos, lecturaTema, vincularTutor } from './tutor';

describe('formatearMinutos', () => {
  it('usa minutos por debajo de una hora y horas con minutos de dos cifras por encima', () => {
    expect(formatearMinutos(0)).toBe('0 min');
    expect(formatearMinutos(12.4)).toBe('12 min');
    expect(formatearMinutos(65)).toBe('1 h 05 min');
    expect(formatearMinutos(26 * 60)).toBe('26 h 00 min');
  });
});

describe('lecturaTema', () => {
  it('no emite lectura con menos de 10 respuestas', () => {
    expect(lecturaTema({ respuestas: 9, aciertos_pct: 100, seguro_y_falla: 0 }).etiqueta).toBe('Pocos datos');
    expect(lecturaTema({ respuestas: 30, aciertos_pct: null, seguro_y_falla: 0 }).etiqueta).toBe('Pocos datos');
  });
  it('separa consolidado, en progreso y refuerzo por umbrales', () => {
    expect(lecturaTema({ respuestas: 20, aciertos_pct: 80, seguro_y_falla: 0 }).etiqueta).toBe('Consolidado');
    expect(lecturaTema({ respuestas: 20, aciertos_pct: 79, seguro_y_falla: 0 }).etiqueta).toBe('En progreso');
    expect(lecturaTema({ respuestas: 20, aciertos_pct: 60, seguro_y_falla: 0 }).etiqueta).toBe('En progreso');
    expect(lecturaTema({ respuestas: 20, aciertos_pct: 59, seguro_y_falla: 0 }).etiqueta).toBe('Necesita refuerzo');
  });
});

describe('vincularTutor', () => {
  beforeEach(() => rpc.mockReset());
  it('devuelve el tutor cuando el código es válido', async () => {
    rpc.mockResolvedValue({ data: { ok: true, tutor_id: 't1', tutor_nombre: 'Roberto' }, error: null });
    expect(await vincularTutor('abc')).toEqual({ ok: true, tutor_id: 't1', tutor_nombre: 'Roberto' });
    expect(rpc).toHaveBeenCalledWith('vincular_tutor', { p_codigo: 'abc' });
  });
  it('distingue código inválido, código propio, límite de intentos y fallo de red', async () => {
    rpc.mockResolvedValueOnce({ data: { ok: false, motivo: 'codigo_invalido' }, error: null });
    expect(await vincularTutor('x')).toEqual({ ok: false, motivo: 'codigo_invalido' });
    rpc.mockResolvedValueOnce({ data: { ok: false, motivo: 'propio' }, error: null });
    expect(await vincularTutor('x')).toEqual({ ok: false, motivo: 'propio' });
    rpc.mockResolvedValueOnce({ data: null, error: { message: 'rate_limited' } });
    expect(await vincularTutor('x')).toEqual({ ok: false, motivo: 'limite' });
    rpc.mockRejectedValueOnce(new Error('network'));
    expect(await vincularTutor('x')).toEqual({ ok: false, motivo: 'error' });
  });
});
