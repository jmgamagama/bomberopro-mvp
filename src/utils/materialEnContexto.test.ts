import { describe, expect, it } from 'vitest';
import { destinoMaterial, etiquetaPrecepto, mismoDocumento, preceptoDe, temaNumero } from './materialEnContexto';
import { PRECEPTOS_MATERIAL } from '../data/materialPreceptos';
import { calcularPreceptos } from '../../scripts/preceptosMaterial';

const T2 = 'Estatuto de Autonomía de Extremadura, Artículo 17. Elecciones, apdo. 4. BOE-A-2011-1638, texto consolidado: https://www.boe.es/buscar/act.php?id=BOE-A-2011-1638#a17';

describe('material en contexto: relación verificable fuente → bloque del material', () => {
  it('materialPreceptos.ts está al día con los índices y textos de public/material', () => {
    expect(PRECEPTOS_MATERIAL).toEqual(calcularPreceptos());
  });
  it('ficha con ancla BOE del mismo documento → bloque y artículo', () => {
    expect(destinoMaterial(2, T2)).toEqual({ tema: 2, bloque: 'eaex-04', precepto: 'a17', etiqueta: 'Artículo 17' });
  });
  it('pregunta del simulacro sin BOE: mismo nombre de documento y su artículo', () => {
    expect(destinoMaterial(1, 'Constitución Española, art. 1.1')).toEqual({ tema: 1, bloque: 'titulo-preliminar', precepto: 'a1', etiqueta: 'Artículo 1' });
    expect(destinoMaterial(1, 'Constitución Española, art. 24.2')?.bloque).toBe('derechos-fundamentales');
  });
  it('artículo fuera del material (RIPCI art. 21) → solo el tema', () => {
    expect(destinoMaterial(33, 'RD 513/2017 (RIPCI), Artículo 21. Mantenimiento. BOE-A-2017-6606: https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#a21')).toEqual({ tema: 33 });
  });
  it('otro documento en un tema con material, o cita sin artículo → solo el tema', () => {
    expect(destinoMaterial(6, 'Ley 37/2015 (BOE-A-2015-10439), art. 5')).toEqual({ tema: 6 });
    expect(destinoMaterial(1, 'CE, art. 1')).toEqual({ tema: 1 });
    expect(destinoMaterial(1, 'Constitución Española')).toEqual({ tema: 1 });
    expect(destinoMaterial(1, 'Constitución Española, arts. 1 y 2')).toEqual({ tema: 1 });
  });
  it('tema sin material → sin enlace', () => {
    expect(destinoMaterial(40, 'PT03 — PDF p. 23')).toBeNull();
    expect(destinoMaterial(null, T2)).toBeNull();
  });
  it('piezas', () => {
    expect(temaNumero('tema34')).toBe(34);
    expect(temaNumero('tema36-lote01')).toBeNull();
    expect(preceptoDe('… #a32bis')).toBeNull();
    expect(preceptoDe('https://www.boe.es/buscar/act.php?id=X#a32bis')).toBe('a32bis');
    expect(preceptoDe('Ley 7/1985, art. 32 bis')).toBe('a32bis');
    expect(etiquetaPrecepto('a32bis')).toBe('Artículo 32 bis');
    expect(etiquetaPrecepto('ani')).toBeUndefined();
    expect(mismoDocumento(6, 'Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales, art. 14')).toBe(true);
  });
});
