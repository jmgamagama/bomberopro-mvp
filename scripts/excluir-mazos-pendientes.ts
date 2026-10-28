/**
 * C1 (auditoría 26/10/2026), paso 1: los mazos «pendientes de revisión» NO viajan en el bundle de producción.
 *
 * Antes, las 3.402 fichas (incluidas las 2.598 de mazos pendientes) iban en el JS público y el service
 * worker las precacheaba; el filtro `isDeckVisible` era solo de interfaz. Este plugin de Vite sustituye,
 * en `vite build`, cada módulo de un mazo pendiente por un stub con las mismas exportaciones vacías.
 *
 * - `vite dev` y Vitest no usan el plugin (apply: 'build').
 * - Una build interna de revisión puede incluirlos con VITE_INCLUDE_PENDING_DECKS=true.
 * - Los mazos revisados (gratis o Pro) siguen en el bundle. Paso 2 pendiente: servir las fichas desde el
 *   servidor con comprobación de plan (ver audit/2026-10-26.md, ticket #1).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { getDeckRevision } from '../src/data/recallReview';

/** Extrae de recallRegistry.ts el par (id de mazo → módulo) de cada entrada de DECK_SOURCES. */
export function deckModulesFromRegistry(source: string): { deckId: string; module: string }[] {
  const out: { deckId: string; module: string }[] = [];
  // `load` puede llevar delante la bandera de la migración 38 (PRO_DECKS_FROM_SERVER ? serverOnlyDeck() : …).
  const re = /meta:\s*\{([^{}]*?)\},\s*load:\s*\(\)\s*=>\s*(?:PRO_DECKS_FROM_SERVER\s*\?\s*serverOnlyDeck\(\)\s*:\s*)?import\('\.\/([\w-]+)'\)/g;
  for (const m of source.matchAll(re)) {
    const tema = /tema:\s*(\d+)/.exec(m[1])?.[1];
    const lote = /lote:\s*['"]([\w-]+)['"]/.exec(m[1])?.[1];
    if (!tema) continue;
    out.push({ deckId: `tema${tema}${lote ? `-${lote}` : ''}`, module: m[2] });
  }
  return out;
}

/** Módulos (sin extensión) de los mazos pendientes de revisión. */
export function pendingDeckModules(source: string): Set<string> {
  return new Set(deckModulesFromRegistry(source).filter((d) => getDeckRevision(d.deckId) !== 'revisado').map((d) => d.module));
}

/** Código del stub: mismas exportaciones, sin fichas. */
export function stubFor(original: string): string {
  const names = [...original.matchAll(/export const (\w+)/g)].map((m) => m[1]);
  return names.map((n) => `export const ${n} = ${/CARDS$/.test(n) ? '[]' : '{}'};`).join('\n') + '\n';
}

export function excluirMazosPendientes(opts: { include?: boolean; root?: string } = {}): Plugin {
  const root = opts.root ?? process.cwd();
  const dataDir = path.join(root, 'src', 'data');
  let pending = new Set<string>();
  return {
    name: 'bomberopro-excluir-mazos-pendientes',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      pending = opts.include ? new Set() : pendingDeckModules(readFileSync(path.join(dataDir, 'recallRegistry.ts'), 'utf8'));
    },
    load(id) {
      const file = id.split('?')[0];
      if (path.dirname(file) !== dataDir) return null;
      const mod = path.basename(file).replace(/\.tsx?$/, '');
      if (!pending.has(mod)) return null;
      return stubFor(readFileSync(file, 'utf8'));
    },
  };
}
