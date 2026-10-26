/**
 * Auditor B · Posición y longitud de la respuesta correcta en /workspace/audit_banco.jsonl
 * (índice desde 0). Umbrales: ninguna letra > 40 % en el conjunto o en un grupo nivel×nº de opciones
 * con n ≥ 30; chi-cuadrado (α = 0,01) no significativo; la correcta no puede ser la opción más larga
 * en más del 50 % (k = 3) / 65 % (k = 2) de las preguntas.
 * Escribe el detalle en audit/B_aprendizaje/banco_posicion.json.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { shuffleQuestionOptions, hasPositionalOptions } from '../../src/utils/shuffleOptions';

const BANCO = process.env.AUDIT_BANCO ?? '/workspace/audit_banco.jsonl';
type Row = { id: string; tema: number; nivel: number | string; opciones: string[]; correcta: number };
const rows: Row[] = existsSync(BANCO)
  ? readFileSync(BANCO, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
  : [];

function erfc(x: number): number {
  // Abramowitz-Stegun 7.1.26
  const t = 1 / (1 + 0.3275911 * x);
  const y = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return y * Math.exp(-x * x);
}
/** p-valor chi-cuadrado para df 1 o 2 (los únicos que hay: 2 o 3 opciones). */
function pChi(x: number, df: number): number {
  if (df === 1) return erfc(Math.sqrt(x / 2));
  if (df === 2) return Math.exp(-x / 2);
  if (df === 3) return erfc(Math.sqrt(x / 2)) + Math.sqrt((2 * x) / Math.PI) * Math.exp(-x / 2);
  throw new Error('df no soportado');
}
export function chi(obs: number[]) {
  const n = obs.reduce((a, b) => a + b, 0);
  const e = n / obs.length;
  const x2 = obs.reduce((a, o) => a + ((o - e) * (o - e)) / e, 0);
  return { n, obs, pct: obs.map((o) => +((100 * o) / n).toFixed(1)), chi2: +x2.toFixed(2), df: obs.length - 1, p: pChi(x2, obs.length - 1) };
}
function dist(sub: Row[], k: number) {
  const obs = Array.from({ length: k }, () => 0);
  for (const r of sub) obs[r.correcta]++;
  return chi(obs);
}
const nivelN = (n: number | string) => (typeof n === 'number' ? n : ({ N1: 1, N2: 2, N3: 3, facil: 1 } as Record<string, number>)[n] ?? 0);
for (const r of rows) r.nivel = nivelN(r.nivel);
const groups = new Map<string, Row[]>();
for (const r of rows) {
  for (const key of [`k${r.opciones.length}`, `N${r.nivel}·k${r.opciones.length}`, `T${r.tema}·N${r.nivel}·k${r.opciones.length}`]) {
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(r);
  }
}
const table = [...groups.entries()].map(([g, sub]) => ({ grupo: g, ...dist(sub, sub[0].opciones.length) }));

const longest = { k2: { n: 0, max: 0, strict: 0 }, k3: { n: 0, max: 0, strict: 0 }, k4: { n: 0, max: 0, strict: 0 } } as Record<string, { n: number; max: number; strict: number }>;
const ratios: number[] = [];
for (const r of rows) {
  const lens = r.opciones.map((o) => o.length);
  const m = Math.max(...lens);
  const s = longest[`k${lens.length}`];
  s.n++;
  if (lens[r.correcta] === m) s.max++;
  if (lens[r.correcta] === m && lens.filter((x) => x === m).length === 1) s.strict++;
  const others = lens.filter((_, i) => i !== r.correcta);
  ratios.push(lens[r.correcta] / (others.reduce((a, b) => a + b, 0) / others.length));
}
ratios.sort((a, b) => a - b);
const median = ratios[Math.floor(ratios.length / 2)];
const positional = rows.filter((r) => hasPositionalOptions(r.opciones));

writeFileSync(
  new URL('../B_aprendizaje/banco_posicion.json', import.meta.url),
  JSON.stringify({ total: rows.length, table, longest, ratioMedianaCorrectaVsDistractor: +median.toFixed(3), posicionales: positional.length }, null, 1),
);

describe.skipIf(rows.length === 0)('B · posición de la correcta (banco local)', () => {
  it('ninguna letra supera el 40 % (k=3) en ningún grupo nivel×k con n≥30', () => {
    const bad = table.filter((t) => t.n >= 30 && t.obs.length === 3 && Math.max(...t.pct) > 40);
    expect(bad.map((t) => `${t.grupo}: ${t.pct.join('/')} (n=${t.n})`)).toEqual([]);
  });
  it('ninguna letra supera el 60 % (k=2) en ningún grupo con n≥30', () => {
    const bad = table.filter((t) => t.n >= 30 && t.obs.length === 2 && Math.max(...t.pct) > 60);
    expect(bad.map((t) => `${t.grupo}: ${t.pct.join('/')} (n=${t.n})`)).toEqual([]);
  });
  it('chi-cuadrado no significativo (p ≥ 0,01) en el banco por nº de opciones y por nivel', () => {
    const bad = table.filter((t) => !t.grupo.startsWith('T') && t.p < 0.01);
    expect(bad.map((t) => `${t.grupo}: χ²=${t.chi2} df=${t.df} p=${t.p.toExponential(2)} ${t.pct.join('/')}`)).toEqual([]);
  });
  // Umbral: la correcta puede ser la más larga como mucho lo que da el azar (1/k) + 2,58 σ (α≈0,005 unilateral).
  for (const k of [2, 3] as const) {
    it(`la correcta no es la opción más larga más de lo esperable por azar (k=${k})`, () => {
      const s = longest[`k${k}`];
      const p0 = 1 / k;
      const limite = s.n * p0 + 2.58 * Math.sqrt(s.n * p0 * (1 - p0));
      expect(s.max, `${s.max}/${s.n} = ${((100 * s.max) / s.n).toFixed(1)} % (azar ${(100 * p0).toFixed(1)} %)`).toBeLessThanOrEqual(limite);
    });
  }
});

describe('B · el cliente baraja las opciones', () => {
  it('shuffleQuestionOptions reparte la correcta uniformemente (±5 pp) en 3 opciones', () => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    const counts = [0, 0, 0];
    for (let i = 0; i < 30000; i++) {
      const q = shuffleQuestionOptions({ options: ['A correcta', 'B', 'C'] }, rnd);
      counts[q.options.indexOf('A correcta')]++;
    }
    for (const c of counts) expect(Math.abs(c / 30000 - 1 / 3)).toBeLessThan(0.05);
  });
  it('las preguntas «posicionales» del banco NO se barajan (quedan con el sesgo de origen)', () => {
    // Informativo: si hay muchas, el sesgo de posición llega intacto al alumno.
    expect(positional.length).toBeLessThanOrEqual(Math.ceil(rows.length * 0.05));
  });
});

describe('B · demo (src/data/initialData.ts) sin barajar', () => {
  it('la correcta del prototipo no está en la misma posición en > 40 % y la demo la baraja', async () => {
    const { INITIAL_QUESTIONS } = await import('../../src/data/initialData');
    const pos = INITIAL_QUESTIONS.map((q) => q.options.indexOf(q.correct_answer));
    const first = pos.filter((p) => p === 0).length;
    const app = readFileSync(new URL('../../src/App.tsx', import.meta.url), 'utf8');
    // App.tsx usa INITIAL_QUESTIONS tal cual como pool del entrenamiento en demo.
    const sinBarajar = /useState<Question\[\]>\(INITIAL_QUESTIONS\)/.test(app) || /setDbQuestions\(INITIAL_QUESTIONS\)/.test(app);
    expect({ enPosicionA: `${first}/${pos.length}`, demoSinBarajar: sinBarajar }).toEqual({ enPosicionA: expect.not.stringMatching(/^(1[0-5]|[7-9])\/15$/), demoSinBarajar: false });
  });
});
