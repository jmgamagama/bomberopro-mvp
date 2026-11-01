/**
 * Genera src/data/materialPreceptos.ts: qué preceptos del BOE (ancla de la URL, p. ej. «a5», «a32bis») hay
 * en cada bloque del «Material por tema». Fuente:
 *  - public/material/<carpeta>/*-indice.json (lo escribe scripts/generar_material_boe.py), o
 *  - para bloques sin índice (T1), los encabezados «## Artículo N» del texto completo del bloque.
 * Lo usa scripts/generar-preceptos-material.ts (npm run material:preceptos) y lo comprueba un test.
 */
import fs from 'node:fs';
import path from 'node:path';
import { MATERIAL_TEMAS } from '../src/data/materialTemas';

export function calcularPreceptos(raiz = process.cwd()): Record<number, Record<string, string[]>> {
  const out: Record<number, Record<string, string[]>> = {};
  for (const m of MATERIAL_TEMAS) {
    const dir = path.join(raiz, 'public/material', m.carpeta);
    const indice = fs.readdirSync(dir).find((f) => f.endsWith('-indice.json'));
    const porBloque: Record<string, string[]> = {};
    const idx = indice ? (JSON.parse(fs.readFileSync(path.join(dir, indice), 'utf8')) as { bloques: { id: string; preceptos: string[] }[] }) : null;
    for (const b of m.bloques) {
      const deIndice = idx?.bloques.find((x) => x.id === b.id)?.preceptos;
      if (deIndice) { porBloque[b.id] = [...deIndice]; continue; }
      const completo = b.capas.completo ? fs.readFileSync(path.join(dir, b.capas.completo), 'utf8') : '';
      porBloque[b.id] = [...completo.matchAll(/^#{2,3} Artículo (\d+)(?:\s*(bis|ter))?\b/gm)].map((x) => `a${x[1]}${x[2] ?? ''}`);
    }
    out[m.tema] = porBloque;
  }
  return out;
}

export function fuenteTs(datos: Record<number, Record<string, string[]>>): string {
  return `// Generado por scripts/generar-preceptos-material.ts (npm run material:preceptos). No editar a mano.
// Preceptos (ancla BOE) de cada bloque del material, por tema.
export const PRECEPTOS_MATERIAL: Readonly<Record<number, Readonly<Record<string, readonly string[]>>>> = ${JSON.stringify(datos, null, 2)};
`;
}

