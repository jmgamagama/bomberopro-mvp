// @vitest-environment jsdom
import '../test/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const rpc = vi.fn();
vi.mock('./supabase', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a) } }));

import { CLASE_VACIA, formatearMinutos, lecturaTema, preparacionClase, textoWhatsApp, vincularTutor } from './tutor';

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


describe('clases del tutor', () => {
  it('la lista de preparación marca solo lo que está hecho', () => {
    const vacia = preparacionClase({ ...CLASE_VACIA, pide_lectura: false });
    expect(vacia.filter(x => x.hecho)).toHaveLength(0);
    const completa = preparacionClase({ ...CLASE_VACIA, fecha: '2026-11-20T17:00:00Z', temas: [1], aviso_alumnos: 'Traed el test', notas_tutor: 'Repaso oral' });
    expect(completa.every(x => x.hecho)).toBe(true);
  });

  it('el texto de WhatsApp incluye temas, aviso, enlaces y la ficha de lectura', () => {
    const t = textoWhatsApp(
      { ...CLASE_VACIA, titulo: 'Constitución', fecha: '2026-11-20T17:00:00Z', lugar: 'Aula 3', aviso_alumnos: 'Traed el test', enlaces: [{ titulo: 'Presentación', url: 'https://drive.google.com/x' }] },
      [{ numero: 1, nombre: 'Constitución Española' }],
    );
    expect(t).toContain('📚 Constitución');
    expect(t).toContain('Aula 3');
    expect(t).toContain('T1 · Constitución Española');
    expect(t).toContain('Traed el test');
    expect(t).toContain('Presentación: https://drive.google.com/x');
    expect(t).toContain('He leído el tema');
  });

  it('sin ficha de lectura no se pide en el texto', () => {
    expect(textoWhatsApp({ ...CLASE_VACIA, titulo: 'Repaso', pide_lectura: false }, [])).not.toContain('He leído el tema');
  });
});
