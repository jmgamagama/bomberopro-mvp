import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { CAPAS, FUENTES_SIN_MATERIAL, MATERIAL_TEMAS, capasDisponibles, materialDeTema } from './materialTemas';

describe('registro de material por tema', () => {
  it('cada fichero citado existe en public/material', () => {
    for (const m of MATERIAL_TEMAS) {
      const dir = `public/material/${m.carpeta}/`;
      if (m.textoOficial) expect(existsSync(dir + m.textoOficial.file), dir + m.textoOficial.file).toBe(true);
      for (const b of m.bloques) for (const c of CAPAS) {
        const f = b.capas[c.id];
        if (f) expect(existsSync(dir + f), dir + f).toBe(true);
      }
    }
  });
  it('T1 tiene las tres capas; T6 esquema y texto oficial, sin desarrollo (no se inventa)', () => {
    expect(capasDisponibles(materialDeTema(1)!)).toEqual(['esquema', 'desarrollo', 'completo']);
    expect(capasDisponibles(materialDeTema(6)!)).toEqual(['esquema', 'completo']);
  });
  it('T6: solo capítulos I-IV, cada artículo enlazado a su ancla del BOE', () => {
    const m = materialDeTema(6)!;
    expect(m.bloques).toHaveLength(4);
    const esq = m.bloques.map((b) => readFileSync(`public/material/tema06/${b.capas.esquema}`, 'utf8')).join('\n');
    const arts = [...esq.matchAll(/act\.php\?id=BOE-A-1995-24292#a(\d+(?:bis)?)\)/g)].map((x) => x[1]);
    expect(arts).toEqual([...Array.from({ length: 32 }, (_, i) => String(i + 1)), '32bis']);
  });
  it('temas generados del BOE: cada precepto del índice está enlazado en el esquema', () => {
    for (const n of [2, 3, 6, 7, 31, 33, 34]) {
      const m = materialDeTema(n)!;
      expect(capasDisponibles(m), `T${n}`).toEqual(['esquema', 'completo']);
      const indice = JSON.parse(readFileSync(`public/material/${m.carpeta}/${m.textoOficial!.file.replace('-texto-oficial.md', '-indice.json')}`, 'utf8'));
      expect(indice.bloques.map((b: { id: string }) => b.id)).toEqual(m.bloques.map((b) => b.id));
      for (const b of indice.bloques) {
        const esq = readFileSync(`public/material/${m.carpeta}/${b.id}-1-esquema.md`, 'utf8');
        for (const id of b.preceptos) expect(esq, `T${n} ${id}`).toContain(`act.php?id=${indice.boe}#${id})`);
      }
    }
  });
  it('las fuentes del material son del BOE; las demás, de boletines oficiales (DOE, BOP)', () => {
    for (const f of MATERIAL_TEMAS.flatMap((m) => m.fuentes)) expect(f.url).toMatch(/^https:\/\/www\.boe\.es\/buscar\/act\.php\?id=BOE-A-\d{4}-\d+$/);
    for (const f of Object.values(FUENTES_SIN_MATERIAL).flat()) {
      expect(f.url).toMatch(/^https:\/\/(doe\.juntaex\.es|www\.dip-badajoz\.es\/ficheros\/bop)\//);
    }
    expect(FUENTES_SIN_MATERIAL[40]).toBeUndefined();
  });
});
