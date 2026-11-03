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
  it('temas nuevos: RD 773/1997 (T13), RD 614/2001 (T28), CTE Parte I (T32); DB SI y ADR → solo el tema', () => {
    expect(destinoMaterial(13, 'RD 773/1997, Artículo 7. Utilización y mantenimiento. BOE-A-1997-12735: https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a7')?.bloque).toBe('rd773-01');
    expect(destinoMaterial(28, 'RD 614/2001, anexo I, tabla 1. BOE-A-2001-11881: https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani')?.bloque).toBe('rd614-02');
    expect(destinoMaterial(32, 'CTE (RD 314/2006), Parte I, Artículo 11. BOE-A-2006-5515: https://www.boe.es/buscar/act.php?id=BOE-A-2006-5515#a11')?.bloque).toBe('cte-02');
    expect(destinoMaterial(32, 'CTE DB SI, SI 5, pág. 40. DB SI del CTE')).toEqual({ tema: 32 });
    expect(destinoMaterial(25, 'ADR 2025, 1.2.1, «Grupo de embalaje», pág. 25. BOE-A-2025-77')).toEqual({ tema: 25 });
  });
  it('varias normas por tema (T28): cada ancla se busca solo en los bloques de su norma', () => {
    const rebt = (ancla: string, art = '') => `REBT (RD 842/2002), ${art}. BOE-A-2002-18099, texto consolidado: https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#${ancla}`;
    expect(destinoMaterial(28, rebt('a1-7', 'Artículo 15. Acometidas e instalaciones de enlace'))?.bloque).toBe('rd614-04');
    expect(destinoMaterial(28, rebt('a4', 'Artículo 4. Clasificación de las tensiones'))?.bloque).toBe('rd614-04');
    expect(destinoMaterial(28, 'RD 614/2001, Artículo 4. Técnicas. BOE-A-2001-11881: https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#a4')?.bloque).toBe('rd614-01');
    expect(destinoMaterial(28, rebt('ib-11', 'ITC-BT-11'))?.bloque).toBe('rd614-05');
    expect(destinoMaterial(28, rebt('ib-15', 'ITC-BT-15'))?.bloque).toBe('rd614-06');
    expect(destinoMaterial(28, rebt('ib-9', 'ITC-BT-09'))).toEqual({ tema: 28 });
    expect(destinoMaterial(28, 'REBT (RD 842/2002), Artículo 2. BOE-A-2002-18099')).toEqual({ tema: 28 });
  });
  it('normas del DOE (T20, T29, T30): la clave de la cita da la norma y el apartado del plan, el bloque', () => {
    const pdf = (f: string, p: number) => `texto íntegro oficial: https://www.juntaex.es/documents/77055/406857/${f}#page=${p}`;
    expect(destinoMaterial(29, `PLATERCAEX, IV.3.1, pág. 35. Decreto 187/2019 (DOE nº 247, de 26/12/2019); ${pdf('PLATERCAEX_2019_%2B%283%29.pdf', 35)}`))
      .toEqual({ tema: 29, bloque: 'platercaex-03', precepto: 's-iv-3-1', etiqueta: 'Apartado IV.3.1' });
    // La nota de vigencia trae un BOE (Norma Básica de 2023): no cambia la norma de la cita.
    expect(destinoMaterial(29, 'PLATERCAEX, V.2, pág. 47. Decreto 187/2019. Vigencia: RD 524/2023 (BOE-A-2023-14679, https://www.boe.es/buscar/act.php?id=BOE-A-2023-14679)')?.bloque).toBe('platercaex-04');
    expect(destinoMaterial(30, `INUNCAEX, cap. V, 2.1, pág. 333. Decreto 39/2025; ${pdf('INUNCAEX_2024.pdf', 333)}`))
      .toEqual({ tema: 30, bloque: 'planes-03', precepto: 's-v-2-1', etiqueta: 'Apartado V.2.1' });
    expect(destinoMaterial(30, 'TRANSCAEX, 4.4.4.1, pág. 140. Decreto 189/2019')?.bloque).toBe('planes-05');
    // Apartado sin bloque propio: el que lo contiene (RADIOCAEX 4.3.2 está dentro de 4.3; INUNCAEX cap. I, 2.3 dentro de 2).
    expect(destinoMaterial(30, `RADIOCAEX, 4.3.2, pág. 88. Decreto 200/2019; ${pdf('RADIOCAEX-+%281%29.pdf', 88)}`)).toMatchObject({ bloque: 'planes-09', precepto: 's-4-3' });
    expect(destinoMaterial(30, 'INUNCAEX, cap. I, 2.3, pág. 11. Decreto 39/2025')).toMatchObject({ bloque: 'planes-01', precepto: 's-i-2' });
    // Fuera del epígrafe recortado: solo el tema.
    expect(destinoMaterial(30, 'PLASISMEX, 1.3, pág. 15. Decreto 127/2009')).toEqual({ tema: 30 });
    expect(destinoMaterial(30, 'INUNCAEX, cap. I, 4, pág. 12. Decreto 39/2025')).toEqual({ tema: 30 });
    expect(destinoMaterial(29, 'PLATERCAEX, Introducción, pág. 5. Decreto 187/2019')).toEqual({ tema: 29 });
    expect(destinoMaterial(20, 'Plan INFOEX (Decreto 132/2022, mod. Decreto 136/2024), 1. La dirección del Plan INFOEX corresponderá, al Comité de Dirección…, art. 10.1. Decreto 136/2024, texto consolidado'))
      .toEqual({ tema: 20, bloque: 'infoex-02', precepto: 'a10', etiqueta: 'Artículo 10' });
    expect(destinoMaterial(30, 'Otro plan, 4.1, pág. 3')).toEqual({ tema: 30 });
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
