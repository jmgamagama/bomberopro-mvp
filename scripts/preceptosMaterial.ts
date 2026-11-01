/**
 * Genera src/data/materialPreceptos.ts: de qué norma del BOE es cada bloque del «Material por tema» y qué preceptos
 * (ancla de la URL, p. ej. «a5», «a32bis») tiene. Un tema puede tener bloques de varias normas (T28: RD 614/2001 y REBT). Fuente:
 *  - public/material/<carpeta>/*-indice.json (lo escribe scripts/generar_material_boe.py), o
 *  - para bloques sin índice (T1), los encabezados «## Artículo N» del texto completo del bloque.
 * Lo usa scripts/generar-preceptos-material.ts (npm run material:preceptos) y lo comprueba un test.
 */
import fs from 'node:fs';
import path from 'node:path';
import { MATERIAL_TEMAS } from '../src/data/materialTemas';

export type BloquePreceptos = { boe: string; preceptos: string[] };

export function calcularPreceptos(raiz = process.cwd()): Record<number, Record<string, BloquePreceptos>> {
  const out: Record<number, Record<string, BloquePreceptos>> = {};
  for (const m of MATERIAL_TEMAS) {
    const dir = path.join(raiz, 'public/material', m.carpeta);
    const indice = fs.readdirSync(dir).find((f) => f.endsWith('-indice.json'));
    const porBloque: Record<string, BloquePreceptos> = {};
    const idx = indice ? (JSON.parse(fs.readFileSync(path.join(dir, indice), 'utf8')) as { boe: string; bloques: { id: string; boe?: string; preceptos: string[] }[] }) : null;
    const principal = idx?.boe ?? m.fuentes[0]?.boe ?? '';
    for (const b of m.bloques) {
      const deIndice = idx?.bloques.find((x) => x.id === b.id);
      if (deIndice) { porBloque[b.id] = { boe: deIndice.boe ?? principal, preceptos: [...deIndice.preceptos] }; continue; }
      const completo = b.capas.completo ? fs.readFileSync(path.join(dir, b.capas.completo), 'utf8') : '';
      porBloque[b.id] = { boe: principal, preceptos: [...completo.matchAll(/^#{2,3} Artículo (\d+)(?:\s*(bis|ter))?\b/gm)].map((x) => `a${x[1]}${x[2] ?? ''}`) };
    }
    out[m.tema] = porBloque;
  }
  return out;
}

export function fuenteTs(datos: Record<number, Record<string, BloquePreceptos>>): string {
  return `// Generado por scripts/generar-preceptos-material.ts (npm run material:preceptos). No editar a mano.
// Norma (identificador BOE) y preceptos (ancla BOE) de cada bloque del material, por tema.
export const PRECEPTOS_MATERIAL: Readonly<Record<number, Readonly<Record<string, { readonly boe: string; readonly preceptos: readonly string[] }>>>> = ${JSON.stringify(datos, null, 2)};
`;
}

