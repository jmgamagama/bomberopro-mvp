// Anti-copia del lote 2: los casos originales no reutilizan texto ni cifras del material privado.
// El material privado NO está en el repo: se lee de fuera (por defecto /workspace/privado/supuestos_jose.json,
// o la ruta de SUPUESTOS_PRIVADOS_ORIGINALES). Si no existe, la comparación real se salta.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPUESTOS_LOTE2 } from './supuestosLote2';
import { cifrasDe, detectarCopias, limpiarEnunciadoPrivado, textoComparable } from './supuestosAudit';

const RUTA = process.env.SUPUESTOS_PRIVADOS_ORIGINALES ?? '/workspace/privado/supuestos_jose.json';
const hayPrivado = existsSync(RUTA);
const nuevos = SUPUESTOS_LOTE2.map((s) => ({ id: s.id, texto: textoComparable(s) }));

describe('detector anti-copia', () => {
  it('detecta un n-grama de 8 palabras aunque cambien tildes, mayúsculas y signos', () => {
    const r = detectarCopias(
      [{ id: 'nuevo', texto: 'Calcula, si puedes, la PRESION que soporta el fondo de un deposito abierto lleno.' }],
      [{ id: 'orig', texto: 'Otro texto: la presión que soporta el fondo de un depósito abierto, y más.' }],
    );
    expect(r.map((x) => x.motivo)).toEqual(['n-grama de 8 palabras en común: «la presion que soporta el fondo de un»']);
  });

  it('no salta con 7 palabras seguidas en común', () => {
    expect(detectarCopias([{ id: 'n', texto: 'uno dos tres cuatro cinco seis siete ocho' }], [{ id: 'o', texto: 'dos tres cuatro cinco seis siete ocho y otra' }])).toEqual([]);
    expect(detectarCopias([{ id: 'n', texto: 'a uno dos tres cuatro cinco seis siete b' }], [{ id: 'o', texto: 'c uno dos tres cuatro cinco seis siete d' }])).toEqual([]);
  });

  it('detecta que coinciden todas las cifras de un caso, sin contar exponentes ni números de página de la nota OCR', () => {
    expect([...cifrasDe('Depósito de 0,75 m3 a 21 m, 3 l/s y 1.000 ítems (cm2)')]).toEqual(['0.75', '21', '3', '1']);
    const orig = limpiarEnunciadoPrivado('Tubo de 0,75 m de radio a 21 m de altura. (Texto extraído por OCR: cotéjalo con X.pdf, pág. 9.)');
    expect([...cifrasDe(orig)].sort()).toEqual(['0.75', '21']);
    expect(detectarCopias([{ id: 'n', texto: 'Una cuba a 21 m con un tubo de 0.75 m' }], [{ id: 'o', texto: orig }])[0].motivo).toMatch(/todas las cifras/);
    expect(detectarCopias([{ id: 'n', texto: 'Una cuba a 21 m con un tubo de 0,8 m' }], [{ id: 'o', texto: orig }])).toEqual([]);
  });
});

describe.skipIf(!hayPrivado)(`lote 2 frente al material privado (${RUTA})`, () => {
  const originales = hayPrivado
    ? (JSON.parse(readFileSync(RUTA, 'utf8')).supuestos as { id: string; titulo: string; enunciado: string; preguntas: { enunciado: string }[] }[]).map((o) => ({
        id: o.id,
        // Sin el título: en la serie lo genera el conversor («ejercicio 06») y su número no es un dato del caso.
        texto: limpiarEnunciadoPrivado([o.enunciado, ...o.preguntas.map((p) => p.enunciado)].join('\n')),
      }))
    : [];

  it('se comparan los 7 casos con todos los originales', () => {
    expect(originales.length).toBeGreaterThan(0);
    expect(nuevos).toHaveLength(7);
  });

  it('ningún enunciado comparte 8 o más palabras seguidas con un original ni repite todas sus cifras', () => {
    expect(detectarCopias(nuevos, originales)).toEqual([]);
  });
});
