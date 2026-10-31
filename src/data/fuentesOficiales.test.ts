import { describe, expect, it } from 'vitest';
import { boeUrl, nombreDocumento, resolverFuente } from './fuentesOficiales';

describe('fuentes oficiales', () => {
  it('da nombre a los códigos de documento de la base de datos', () => {
    for (const c of ['EAEXT', 'LBRL', 'LIEXT', 'RD1215', 'RIPCI', 'RSCIEI']) expect(nombreDocumento(c)).not.toBe(c);
    expect(nombreDocumento('XYZ')).toBe('XYZ');
  });
  it('usa la URL oficial de los datos y le añade el artículo citado', () => {
    const f = resolverFuente('Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 2. BOE-A-1995-24292, texto consolidado: https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292');
    expect(f.url).toBe('https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a3');
    expect(f.texto).not.toContain('https://');
    expect(f.etiqueta).toBe('Ver en el BOE');
  });
  it('deduce el enlace del identificador BOE-A y respeta «bis»', () => {
    expect(resolverFuente('LPRL, Artículo 32 bis. BOE-A-1995-24292').url).toBe(boeUrl('BOE-A-1995-24292', '32bis'));
  });
  it('sin artículo único no pone ancla', () => {
    expect(resolverFuente('RD 1215/1997, anexo II, 4.3.3.b. BOE-A-1997-17824').url).toBe(boeUrl('BOE-A-1997-17824'));
  });
  it('no inventa enlaces', () => {
    expect(resolverFuente('PT01 Procedimiento de trabajo: conducción de vehículos CPEI, edición 1').url).toBeNull();
    expect(resolverFuente('Ficha', 'D98').url).toBeNull();
    expect(resolverFuente('Ficha', 'CE').url).toBe(boeUrl('BOE-A-1978-31229'));
  });
});
