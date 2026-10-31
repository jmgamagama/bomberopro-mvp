// Contraste WCAG AA de la paleta Variante A. Lee los colores de index.css, así que si alguien cambia
// la marca y un texto deja de leerse bien, este test falla antes de llegar a los alumnos.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'index.css'), 'utf8');

function variable(nombre: string): string {
  const m = css.match(new RegExp(`--${nombre}:\\s*([^;]+);`));
  if (!m) throw new Error(`Falta --${nombre} en index.css`);
  const valor = m[1].trim();
  const ref = valor.match(/^var\(--([\w-]+)\)$/);
  return ref ? variable(ref[1]) : valor;
}

function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const BLANCO = '#ffffff';
// Fondo más oscuro sobre el que se ha visto texto secundario (tarjetas tintadas del panel de errores).
const TARJETA_TINTADA = '#f3f3f3';

// [descripción, texto, fondo, mínimo] — 4,5 texto normal; 3 iconos y bordes de foco.
const pares: Array<[string, string, string, number]> = [
  ['texto blanco en botón principal', BLANCO, variable('color-indigo-600'), 4.5],
  ['texto blanco en botón principal (hover)', BLANCO, variable('color-indigo-700'), 4.5],
  ['texto azul sobre el fondo', variable('color-indigo-600'), variable('color-fondo'), 4.5],
  ['texto azul oscuro en chip indigo-50', variable('color-indigo-700'), variable('color-indigo-50'), 4.5],
  ['texto indigo-500 sobre el fondo', variable('color-indigo-500'), variable('color-fondo'), 4.5],
  ['texto naranja sobre blanco', variable('color-orange-600'), BLANCO, 4.5],
  ['texto naranja sobre el fondo', variable('color-orange-600'), variable('color-fondo'), 4.5],
  ['texto blanco en botón naranja', BLANCO, variable('color-orange-600'), 4.5],
  ['«Solo tests» (orange-700) sobre blanco', variable('color-orange-700'), BLANCO, 4.5],
  ['texto secundario slate-500 sobre el fondo', variable('color-slate-500'), variable('color-fondo'), 4.5],
  ['texto secundario slate-500 en tarjeta tintada', variable('color-slate-500'), TARJETA_TINTADA, 4.5],
  ['anillo de foco indigo-500 sobre el fondo', variable('color-indigo-500'), variable('color-fondo'), 3],
];

describe('Paleta Variante A · contraste WCAG AA', () => {
  it.each(pares)('%s', (_desc, texto, fondo, minimo) => {
    expect(contraste(texto, fondo)).toBeGreaterThanOrEqual(minimo);
  });

  it('detecta el fallo original: slate-500 de Tailwind no llega a 4,5 sobre el fondo cálido', () => {
    expect(contraste('#62748e', variable('color-fondo'))).toBeLessThan(4.5);
  });
});

// slate-400 (#90a1b9) da ≈2,6:1 sobre blanco: no vale para texto ni iconos. Solo se admite sobre el
// panel oscuro de desarrollo del inicio (Dashboard.tsx, fondo slate-900), donde sí pasa.
describe('textos pequeños sin grises ni colores demasiado claros', () => {
  const componentes = import.meta.glob('./components/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

  it('ningún componente usa text-slate-400 sobre fondo claro', () => {
    const conGrisClaro = Object.entries(componentes)
      .filter(([ruta]) => !ruta.endsWith('.test.tsx') && !ruta.endsWith('/Dashboard.tsx'))
      .filter(([, codigo]) => /\btext-slate-400\b/.test(codigo))
      .map(([ruta]) => ruta);
    expect(conGrisClaro).toEqual([]);
  });

  it('Curva de olvido: el porcentaje de recuperabilidad usa tonos -700 (pasan AA sobre blanco)', () => {
    const curva = componentes['./components/ForgettingCurve.tsx'];
    expect(curva).toMatch(/'text-emerald-700'/);
    expect(curva).not.toMatch(/'text-(emerald|blue|amber|rose)-500'/);
  });
});
