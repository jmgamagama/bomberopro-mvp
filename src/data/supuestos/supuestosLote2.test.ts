// Lote 2 de supuestos originales: SEGUNDA implementación independiente de cada resultado.
// Aquí no se leen los pasos: se recalcula desde los datos físicos del enunciado con funciones propias
// (en unidades SI) y se compara con el resultado publicado. La auditoría, por su parte, recalcula
// la aritmética de cada paso (primera comprobación).
import { describe, expect, it } from 'vitest';
import { SUPUESTOS_LOTE2, FUENTES_LOTE2_VERIFICADAS } from './supuestosLote2';
import { auditSupuestos, tipoFuente } from './supuestosAudit';
import { getDeckRevision, REVIEWED_DECKS } from '../recallReview';
import type { PreguntaCalculo, PreguntaTest } from './supuestosTypes';

const G = 9.81;
const RHO = 1000;

// --- Física (implementación 2, sin reutilizar las operaciones de los pasos) ---
const presionHidrostatica = (rho: number, h: number) => rho * G * h; // Pa
const alturaDeColumna = (pPa: number, rho: number) => pPa / (rho * G); // m
const barAPa = (bar: number) => bar * 1e5;
const tuboEnU = (rhoLigero: number, hLigero: number, rhoDenso: number) => (rhoLigero * hLigero) / rhoDenso;
const pascalF2 = (f1: number, a1: number, a2: number) => f1 * (a2 / a1);
const empuje = (vol: number, rho = RHO) => rho * vol * G;
const caudal = (a: number, v: number) => a * v; // m³/s
const continuidad = (a1: number, v1: number, a2: number) => (a1 * v1) / a2;
const bernoulliP2 = (p1: number, v1: number, v2: number, rho = RHO) => p1 + 0.5 * rho * (v1 ** 2 - v2 ** 2);
const alturaTorricelli = (v: number) => v ** 2 / (2 * G);
const reaccionChorro = (a: number, v: number, rho = RHO) => rho * caudal(a, v) * v;
const energiaPotencial = (m: number, h: number) => m * G * h;
const potenciaHidraulica = (qM3s: number, hm: number, rho = RHO) => rho * G * qM3s * hm;
/** Darcy-Weisbach completo, para comprobar las proporciones con valores cualesquiera. */
const darcy = (f: number, l: number, q: number, d: number) => (8 * f * l * q ** 2) / (Math.PI ** 2 * G * d ** 5);

const esperado: Record<string, number> = {
  // 1 Hidrostática
  't9-hidrostatica-01-p2': presionHidrostatica(RHO, 3.6) / 1000, // kPa
  't9-hidrostatica-01-p3': alturaDeColumna(barAPa(2.4), RHO), // m
  't9-hidrostatica-01-p4': tuboEnU(870, 34, RHO), // cm (las alturas se escalan igual)
  't9-hidrostatica-01-p6': (barAPa(7.5) - presionHidrostatica(RHO, 14)) / 1e5, // bar
  // 2 Pascal y Arquímedes (secciones en cm²: la relación no depende de la unidad)
  't9-pascal-arquimedes-01-p1': pascalF2(220, 3, 120),
  't9-pascal-arquimedes-01-p3': pascalF2(13500, 120, 3),
  't9-pascal-arquimedes-01-p4': empuje(0.22),
  't9-pascal-arquimedes-01-p6': 270 * G - empuje(0.035),
  // 3 Caudal
  't9-caudal-01-p1': caudal(0.0012, 3.5) * 1000 * 60, // l/min
  't9-caudal-01-p3': 7.56 / caudal(0.0012, 3.5) / 60, // min (7560 l = 7,56 m³)
  't9-caudal-01-p4': continuidad(0.0012, 3.5, 0.0003),
  // 4 Bernoulli y pérdidas
  't9-bernoulli-perdidas-01-p2': bernoulliP2(310e3, 1.6, 4.8) / 1000, // kPa
  't9-bernoulli-perdidas-01-p3': (() => {
    // Bernoulli real en Pa y vuelta a mca, para no repetir la resta directa en mca
    const gamma = RHO * G;
    const p1 = 46 * gamma;
    const p2 = p1 - gamma * 11 - gamma * 2.8;
    return p2 / gamma;
  })(),
  't9-bernoulli-perdidas-01-p4': 3.15 - 2.72,
  't9-bernoulli-perdidas-01-p5': 1.9 * (darcy(0.018, 130, 0.004, 0.08) / darcy(0.018, 40, 0.004, 0.08)),
  // 5 Descarga y chorro
  't9-descarga-chorro-01-p2': alturaTorricelli(6),
  't9-descarga-chorro-01-p3': reaccionChorro(0.0008, 6),
  't9-descarga-chorro-01-p4': alturaTorricelli(17), // mismo resultado que v² = v0² − 2g·h con v = 0
  // 6 Bombeo
  't9-bombeo-01-p1': energiaPotencial(24 * RHO, 9) / 1000, // kJ
  't9-bombeo-01-p2': energiaPotencial(24 * RHO, 9) / 2500 / 60, // min
  't9-bombeo-01-p4': potenciaHidraulica(18 / 1000, 32) / 0.64 / 1000, // kW
  // 7 Poleas
  't22-poleas-01-p2': (64 * G) / 2,
  't22-poleas-01-p4': energiaPotencial(64, 8.5),
  't22-poleas-01-p5': energiaPotencial(64, 8.5) / 40,
};

const preguntas = SUPUESTOS_LOTE2.flatMap((s) => s.preguntas);
const calculos = preguntas.filter((p): p is PreguntaCalculo => p.tipo === 'calculo');
const tests = preguntas.filter((p): p is PreguntaTest => p.tipo === 'test');

describe('lote 2: contenido', () => {
  it('7 casos originales y 41 preguntas; la auditoría da 0 problemas', () => {
    expect(SUPUESTOS_LOTE2).toHaveLength(7);
    expect(preguntas).toHaveLength(41);
    expect(SUPUESTOS_LOTE2.every((s) => s.autoria === 'original')).toBe(true);
    expect(auditSupuestos(SUPUESTOS_LOTE2)).toEqual([]);
  });

  it('todos quedan pendientes de revisión (el alumno no los ve)', () => {
    for (const s of SUPUESTOS_LOTE2) {
      expect(REVIEWED_DECKS, s.id).not.toHaveProperty(s.id);
      expect(getDeckRevision(s.id), s.id).toBe('pendiente');
    }
  });

  it('cada enlace citado está en la lista verificada con curl y todas las fuentes de la lista se usan', () => {
    const usadas = new Set<string>();
    for (const p of preguntas)
      for (const u of p.fuente.match(/https?:\/\/[^\s)]+/g) ?? []) {
        const base = u.replace(/#page=\d+$/, '');
        expect(FUENTES_LOTE2_VERIFICADAS, `${p.id}: ${u}`).toContain(base);
        expect(tipoFuente(u), u).not.toBe('otra');
        usadas.add(base);
      }
    expect([...usadas].sort()).toEqual([...FUENTES_LOTE2_VERIFICADAS].sort());
  });

  it('una fuente oficial cuando existe: la conversión de bar cita el BOE y la potencia de bombas, la guía del IDAE', () => {
    const p = (id: string) => preguntas.find((x) => x.id === id)!;
    expect(p('t9-hidrostatica-01-p3').fuente).toContain('BOE-A-2010-927');
    for (const id of ['t9-bombeo-01-p4', 't9-bombeo-01-p5', 't9-bombeo-01-p6']) expect(tipoFuente(p(id).fuente.match(/https?:\/\/\S+/)![0])).toBe('oficial');
  });
});

describe('lote 2: resultados recalculados de forma independiente', () => {
  it('hay una segunda implementación para cada pregunta de cálculo', () => {
    expect(calculos.map((p) => p.id).sort()).toEqual(Object.keys(esperado).sort());
  });

  it.each(Object.entries(esperado))('%s coincide con la física recalculada', (id, valor) => {
    const p = calculos.find((x) => x.id === id)!;
    // Coincidencia prácticamente exacta (solo ruido de coma flotante), no solo dentro de la tolerancia.
    expect(Math.abs(p.resultado - valor)).toBeLessThan(1e-9 * Math.max(1, Math.abs(valor)));
    // La tolerancia admite el redondeo razonable a 2 decimales, pero no un error de unidades.
    expect(p.tolerancia).toBeLessThanOrEqual(Math.max(1, Math.abs(valor) * 0.002));
    expect(Math.abs(Math.round(valor * 100) / 100 - p.resultado)).toBeLessThanOrEqual(p.tolerancia);
  });

  it('las unidades del resultado son las que pide el enunciado', () => {
    for (const p of calculos) {
      const pedida = p.enunciado.match(/\(Resultado en ([^.)]+)\.\)/)?.[1];
      const normal = pedida === 'minutos' ? 'min' : pedida;
      expect(normal, p.id).toBe(p.unidad);
    }
  });
});

describe('lote 2: preguntas de test con una sola respuesta correcta', () => {
  it('las opciones numéricas: solo la correcta coincide con el valor recalculado', () => {
    const num = (o: string) => Number((o.match(/\d+(?:,\d+)?/)?.[0] ?? 'NaN').replace(',', '.'));
    // 252 l/min en m³/h
    const caudalM3h = caudal(0.0012, 3.5) * 3600;
    const q = tests.find((t) => t.id === 't9-caudal-01-p2')!;
    expect(q.opciones.filter((o) => Math.abs(num(o) - caudalM3h) < 1e-6)).toEqual([q.opciones[q.correcta]]);
    // Serie: suma de alturas para el mismo caudal
    const serie = tests.find((t) => t.id === 't9-bombeo-01-p5')!;
    expect(serie.opciones.filter((o) => num(o) === 30 + 30)).toEqual([serie.opciones[serie.correcta]]);
    // Paralelo: (2Q*, H*)
    const par = tests.find((t) => t.id === 't9-bombeo-01-p6')!;
    expect(par.opciones.filter((o) => o === `${2 * 7} l/s a 40 m c.a.`)).toEqual([par.opciones[par.correcta]]);
  });

  it('las de proporciones: el factor correcto sale de la fórmula y ningún otro lo cumple', () => {
    const factor = (o: string): number | null => {
      if (/no cambia|sería el mismo|es el mismo/.test(o)) return 1;
      let m = o.match(/multiplicar[íi]a por ([\d,]+)|multiplican por ([\d,]+)|multiplicarse por ([\d,]+)/);
      if (m) return Number((m[1] ?? m[2] ?? m[3]).replace(',', '.'));
      if (/duplic/.test(o)) return 2;
      if (/a la mitad|reduciría a la mitad|se reduce a la mitad/.test(o)) return 0.5;
      if (/cuarta parte/.test(o)) return 0.25;
      m = o.match(/dividen entre (\d+)/);
      if (m) return 1 / Number(m[1]);
      return null;
    };
    const casos: [string, number][] = [
      ['t9-pascal-arquimedes-01-p2', pascalF2(1, 1, 2 ** 2) / pascalF2(1, 1, 1)], // A ∝ d²
      ['t9-caudal-01-p5', continuidad(1, 1, 0.5 ** 2)], // v = Q/A, A ∝ d²
      ['t9-bernoulli-perdidas-01-p6', darcy(0.02, 50, 0.01, 0.1) / darcy(0.02, 50, 0.005, 0.1)],
      ['t9-bernoulli-perdidas-01-p7', darcy(0.02, 50, 0.01, 0.2) / darcy(0.02, 50, 0.01, 0.1)],
      ['t9-descarga-chorro-01-p5', Math.sqrt(4)], // h ∝ v²
      ['t9-bombeo-01-p3', energiaPotencial(1, 2) / energiaPotencial(1, 1)], // t ∝ m·g·h
    ];
    for (const [id, f] of casos) {
      const t = tests.find((x) => x.id === id)!;
      const factores = t.opciones.map((o) => (/raíz de 2/.test(o) ? Math.SQRT2 : factor(o)));
      expect(factores.every((x) => x !== null), `${id}: ${t.opciones.join(' | ')}`).toBe(true);
      const correctas = factores.map((x, i) => (Math.abs((x as number) - f) < 1e-9 ? i : -1)).filter((i) => i >= 0);
      expect(correctas, id).toEqual([t.correcta]);
    }
  });
});
