/**
 * Huellas centinela del material interno (issue #333). Sin texto de fichas: se prueba con frases
 * inventadas y se comprueba que la lista guardada coincide con los módulos internos actuales.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buscarFugas, fuentes, generarCentinelas, huellasDe, idsInternos, normalizar, VENTANA, type Centinelas } from './auditar-bundle-interno-lib';

const root = path.resolve(__dirname, '..');

describe('normalización y huellas', () => {
  it('ignora mayúsculas, tildes, signos y escapes \\u de esbuild', () => {
    expect(normalizar('Él  CAMIÓN, «rojo»\\u00e1!')).toEqual(['el', 'camion', 'rojo', 'a']);
    expect(normalizar('cami\\u00f3n')).toEqual(normalizar('camión'));
  });

  it('detecta una frase interna dentro de un bundle minificado y no da falsos positivos', () => {
    const interna = 'export const X = [{"respuesta": "La brigada inventada revisa el material ficticio cada martes a las nueve"}];';
    const publica = 'export const P = "Título público del tema";';
    const c = generarCentinelas([interna], [publica]);
    expect(c.huellas.length).toBeGreaterThan(0);
    const bundle = 'var a={r:"la brigada inventada revisa el material ficticio cada martes a las nueve"};';
    expect(buscarFugas([{ path: 'dist/x.js', content: bundle }], c)).toEqual([{ fichero: 'dist/x.js', coincidencias: expect.any(Number) }]);
    expect(buscarFugas([{ path: 'dist/y.js', content: 'var t="Título público del tema";' }], c)).toEqual([]);
  });

  it('descarta las ventanas que también están en código público', () => {
    const comun = 'uno dos tres cuatro cinco seis siete';
    const c = generarCentinelas([`"${comun}"`], [`'${comun}'`]);
    expect(c.huellas).toEqual([]);
    expect(huellasDe(comun.split(' '))).toHaveLength(1);
    expect(VENTANA).toBe(7);
  });

  it('reconoce los ids internos (T38, SOS del T39, T40) y no los públicos', () => {
    const ids = idsInternos('CPEI-T38-HOR-001 CPEI-T39-SOP-005 CPEI-T39-SPE-010 CPEI-T40-PT03-001 CPEI-T40-S02-ABC CPEI-T39-MOV-001 CPEI-T37-X-1');
    expect([...ids].sort()).toEqual(['CPEI-T38-HOR-001', 'CPEI-T39-SOP-005', 'CPEI-T39-SPE-010', 'CPEI-T40-PT03-001', 'CPEI-T40-S02-ABC']);
  });
});

describe('centinelas-mazos-internos.json', () => {
  it('está al día con los módulos internos (regenera con npm run auditar:bundle-interno -- --generar)', async () => {
    const guardado = JSON.parse(readFileSync(path.join(root, 'scripts', 'centinelas-mazos-internos.json'), 'utf8')) as Centinelas;
    const { internos, publicos } = await fuentes(root);
    // Cuando se retiren los .ts internos del repo (paso 5), la lista guardada sigue valiendo sola.
    if (internos.length === 0) return;
    // Toda frase interna actual debe tener su huella guardada (si cambian las fichas, regenerar).
    const guardadas = new Set(guardado.huellas);
    const faltan = generarCentinelas(internos, publicos).huellas.filter((h) => !guardadas.has(h));
    expect(faltan, 'regenera con npm run auditar:bundle-interno -- --generar').toEqual([]);
    expect(guardado.huellas.length).toBeGreaterThan(4000);
  });
});
