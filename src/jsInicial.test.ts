import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Recorre el grafo de imports ESTÁTICOS desde src/main.tsx (lo que acaba en el JS inicial).
 * Los import() dinámicos y los `import type` no cuentan. Ver docs del punto 29 del LEEME.
 */
const SRC = resolve(__dirname);
const EXT = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

function resolver(desde: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(desde), spec);
  if (existsSync(base) && /\.(t|j)sx?$/.test(base)) return base;
  for (const e of EXT) if (existsSync(base + e)) return base + e;
  return null;
}

function grafoInicial(): Set<string> {
  const vistos = new Set<string>();
  const pila = [resolve(SRC, 'main.tsx')];
  while (pila.length) {
    const f = pila.pop()!;
    if (vistos.has(f)) continue;
    vistos.add(f);
    const code = readFileSync(f, 'utf8');
    const re = /^\s*(?:import|export)\s+(?!type\b)(?:[^'";]*?\sfrom\s+)?['"]([^'"]+)['"]/gm;
    for (const m of code.matchAll(re)) {
      const r = resolver(f, m[1]);
      if (r) pila.push(r);
    }
  }
  return new Set([...vistos].map((f) => f.slice(SRC.length + 1)));
}

describe('JS inicial (rendimiento-2)', () => {
  const g = grafoInicial();
  it('incluye la portada', () => {
    expect(g.has('App.tsx')).toBe(true);
    expect(g.has('components/Dashboard.tsx')).toBe(true);
  });
  it.each([
    'data/materialTemas.ts',
    'data/materialPreceptos.ts',
    'utils/materialEnContexto.ts',
    'components/VerEnEsquema.tsx',
    'components/StudentConsultationDialog.tsx',
    'components/TrainScreen.tsx',
    'components/SessionCelebration.tsx',
    'components/AccesoConfirmado.tsx',
    'components/RemoteDashboard.tsx',
    'data/recallReviewMotivos.ts',
    'utils/relacionFichas.ts',
    'utils/fichasRelacionadas.ts',
  ])('no carga %s de forma estática', (f) => {
    expect(g.has(f)).toBe(false);
  });
});
