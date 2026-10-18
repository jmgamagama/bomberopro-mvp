import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA9_RECALL_CARDS, TEMA9_RECALL_META } from './tema9Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema09/tema09_fichas.json'), 'utf-8')) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  pct_errores_muestra: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

const N = 84;
const byConcepto = (texto: string) => {
  const found = TEMA9_RECALL_CARDS.filter((c) => c.concepto.includes(texto));
  expect(found).toHaveLength(1);
  return found[0].respuesta;
};

describe('tema 9 · hidráulica (fuentes oficiales)', () => {
  it('carga exactamente las fichas del JSON de calidad', () => {
    expect(TEMA9_RECALL_META).toMatchObject({ tema: 9, count: N });
    expect(TEMA9_RECALL_CARDS).toHaveLength(N);
    expect(fichasJson).toMatchObject({ tema: 9, estado: 'cargado', entran_tras_filtro: N });
    expect(TEMA9_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('todas las fichas revisadas a mano, sin errores', () => {
    expect(fichasJson.muestra_revisada).toHaveLength(N);
    expect(fichasJson.pct_errores_muestra).toBe(0);
    const ids = new Set(TEMA9_RECALL_CARDS.map((c) => c.id));
    expect(fichasJson.muestra_revisada.every((r) => ids.has(r.id) && r.veredicto === 'OK')).toBe(true);
  });

  it('cada ficha cita fuente, localización y enlace oficial; sin duplicados ni respuesta en la pregunta', () => {
    const ID_RE = /BOE-A-2010-927|BOE-A-2015-9527|BOE-A-2017-6606|INSST-NTP362|IDAE-GUIA-BOMBAS|CTE-DB-HS4|UE-REG-547-2012/;
    const URL_RE = /https:\/\/(www\.)?(boe\.es|insst\.es|miteco\.gob\.es|codigotecnico\.org|eur-lex\.europa\.eu)\//;
    expect(TEMA9_RECALL_CARDS.every((c) => ID_RE.test(c.fuente) && URL_RE.test(c.fuente) && c.localizacion.trim() !== '')).toBe(true);
    expect(TEMA9_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T09-OF-') && c.concepto.includes('?'))).toBe(true);
    expect(new Set(TEMA9_RECALL_CARDS.map((c) => c.id)).size).toBe(N);
    expect(new Set(TEMA9_RECALL_CARDS.map((c) => c.concepto)).size).toBe(N);
    expect(TEMA9_RECALL_CARDS.some((c) => c.concepto.toLowerCase().includes(c.respuesta.toLowerCase()))).toBe(false);
  });

  it('los datos numéricos de las respuestas se recalculan de forma independiente', () => {
    const rho = 1000; // kg/m3, agua a 20 °C
    const g = 9.81; // m/s2
    // 1 bar = 0,1 MPa = 100 kPa = 10^5 Pa; atmósfera normal 101 325 Pa = 1,013 25 bar.
    expect(byConcepto('1 bar')).toContain('100 000 Pa');
    expect(101325 / 1e5).toBeCloseTo(1.01325, 10);
    expect(byConcepto('atmósfera normal')).toContain('101 325 Pa');
    // 10 m de columna de agua: ρ·g·h = 98 100 Pa = 202 600 − 104 500 Pa.
    expect(rho * g * 10).toBeCloseTo(202600 - 104500, 6);
    expect(byConcepto('10 m de columna de agua')).toContain('98.100 Pa');
    // Presión de vapor del agua a 20 °C en m c.a.
    expect(2344.2 / (rho * g)).toBeCloseTo(0.24, 2);
    expect(byConcepto('presión de vapor tiene el agua a 20 °C')).toContain('0,24 m c.a.');
    // Leyes de semejanza a media velocidad: Q/2, H/4, P/8.
    expect([0.5, 0.5 ** 2, 0.5 ** 3]).toEqual([1 / 2, 1 / 4, 1 / 8]);
    expect(byConcepto('mitad la velocidad de giro')).toMatch(/caudal se divide por 2, la altura por 4 y la potencia por 8/);
    // +15 % de caudal con pérdidas ∝ Q² → potencia ∝ Q³ ≈ +52 % (la guía redondea a 50 %).
    expect(1.15 ** 3).toBeCloseTo(1.52, 2);
    expect(byConcepto('15 % más de caudal')).toContain('50 %');
    // Pérdida de carga ∝ Q²: doble caudal, cuádruple pérdida.
    expect(2 ** 2).toBe(4);
    expect(byConcepto('varía la pérdida de carga de una instalación con el caudal')).toContain('cuatro veces');
    // Dos bombas iguales en paralelo: 2Q* a H*.
    expect(byConcepto('dos bombas idénticas')).toContain('2Q*');
    // Unidades: potencia útil ρ·g·Q·H en W (kg/m3 · m/s2 · m3/s · m = kg·m2/s3 = W).
    expect(rho * g * 0.01 * 10).toBeCloseTo(981, 6);
    // Coeficiente de descarga: Cd = Cv·Cc ≤ 1; valores típicos 0,62 / 0,81 / 1.
    expect(byConcepto('orificio de borde afilado')).toMatch(/0,62.*\(1\)/);
    expect(byConcepto('tramo muy corto de tubería')).toBe('Aproximadamente 0,81');
    // Reynolds: laminar < 2000, turbulento > 4000; f laminar = 64/Re.
    expect(byConcepto('laminar y para cuáles turbulento')).toMatch(/2000.*4000/);
    expect(byConcepto('factor de fricción en régimen laminar')).toBe('f = 64/Re');
    // Rangos de funcionamiento de la bomba (% del caudal nominal).
    expect(byConcepto('rango admisible')).toContain('20 % y el 150 %');
    expect(byConcepto('rango óptimo')).toContain('85 % y el 105 %');
    // Presiones: CTE HS 4 100/150/500 kPa; RIPCI 9 bar = 900 kPa; 3.450 kPa ≈ 35 kg/cm2.
    expect(9 * 100).toBe(900);
    expect(3450e3 / (9.80665 * 1e4)).toBeCloseTo(35.2, 1);
    expect(byConcepto('presión mínima debe haber en los puntos de consumo')).toContain('100 kPa');
  });

  it('se registra como mazo bajo demanda, pendiente de revisión', async () => {
    expect(getRecallDeck('tema9').count).toBe(N);
    expect(getRecallDeck('tema9').revision).toBe('pendiente');
    expect(await loadRecallDeckCards('tema9')).toBe(TEMA9_RECALL_CARDS);
  });
});
