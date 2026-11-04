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
    for (const n of [2, 3, 6, 7, 10, 12, 13, 22, 25, 28, 31, 32, 33, 34]) {
      const m = materialDeTema(n)!;
      expect(capasDisponibles(m), `T${n}`).toEqual(['esquema', 'completo']);
      const indice: { boe: string; bloques: { id: string; boe: string; preceptos: string[] }[] } = JSON.parse(readFileSync(`public/material/${m.carpeta}/${m.textoOficial!.file.replace('-texto-oficial.md', '-indice.json')}`, 'utf8'));
      expect(indice.bloques.map((b: { id: string }) => b.id)).toEqual(m.bloques.map((b) => b.id));
      for (const b of indice.bloques) {
        const esq = readFileSync(`public/material/${m.carpeta}/${b.id}-1-esquema.md`, 'utf8');
        for (const id of b.preceptos) expect(esq, `T${n} ${id}`).toContain(`act.php?id=${b.boe}#${id})`);
        const reg = m.bloques.find((x) => x.id === b.id)!;
        expect(reg.boe ?? indice.boe, `T${n} ${b.id}: norma del bloque`).toBe(b.boe);
        expect(m.fuentes.some((f) => f.boe === b.boe), `T${n}: la norma ${b.boe} está en sus fuentes`).toBe(true);
      }
    }
  });
  it('temas nuevos recortados al epígrafe (01/11/2026)', () => {
    const txt = (t: number, i = 0) => { const m = materialDeTema(t)!; return readFileSync(`public/material/${m.carpeta}/${m.bloques[i].capas.completo}`, 'utf8'); };
    expect(txt(12)).toContain('**4. Extintores de incendio**');
    expect(txt(12)).not.toContain('**5. Sistemas de bocas de incendio equipadas**');
    expect(txt(10)).toContain('**3. Sistemas de hidrantes contra incendios**');
    expect(txt(10)).not.toContain('**4. Extintores de incendio**');
    expect(txt(22)).toMatch(/\*\*4\. Disposiciones relativas a la utilización de los equipos de trabajo para la realización de trabajos temporales en altura/);
    expect(txt(22)).not.toContain('1. Condiciones generales de utilización de los equipos de trabajo');
    const cte = JSON.parse(readFileSync('public/material/tema32/cte-indice.json', 'utf8'));
    expect(cte.bloques.flatMap((b: { preceptos: string[] }) => b.preceptos)).toEqual(['a1', 'a2', 'a11', 'a12']);
    const rd97 = JSON.parse(readFileSync('public/material/tema25/rd97-indice.json', 'utf8'));
    expect(rd97.bloques.flatMap((b: { preceptos: string[] }) => b.preceptos)).toEqual(['a1', 'a2', 'a3', 'a20', 'a21', 'a22', 'a23']);
    for (const t of [10, 12, 13, 22, 25, 28, 32]) expect(materialDeTema(t)!.alcance, `T${t}`).toMatch(/epígrafe/);
  });

  it('las fuentes del material son del BOE; las demás, de boletines oficiales (DOE, BOP)', () => {
    for (const f of MATERIAL_TEMAS.flatMap((m) => m.fuentes)) {
      if (f.doe) {
        expect(f.boe).toMatch(/^DOE-\d{10}$/);
        expect(f.url).toMatch(/^https:\/\/(doe\.juntaex\.es\/pdfs\/doe|www\.juntaex\.es\/documents)\/.+\.pdf$/);
        expect(f.doe.pdfDoe).toMatch(/^https:\/\/doe\.juntaex\.es\/pdfs\/doe\/.+\.pdf$/);
      } else expect(f.url).toMatch(/^https:\/\/www\.boe\.es\/buscar\/act\.php\?id=BOE-A-\d{4}-\d+$/);
    }
    for (const f of Object.values(FUENTES_SIN_MATERIAL).flat()) {
      expect(f.url).toMatch(/^https:\/\/(doe\.juntaex\.es|www\.dip-badajoz\.es\/ficheros\/bop)\//);
    }
    expect(FUENTES_SIN_MATERIAL[40]).toBeUndefined();
  });

  it('temas del DOE (T20, T29, T30): texto del PDF oficial, enlazado por página, con la comprobación manual', () => {
    for (const n of [20, 29, 30]) {
      const m = materialDeTema(n)!;
      expect(capasDisponibles(m), `T${n}`).toEqual(['esquema', 'completo']);
      expect(m.alcance, `T${n}`).toMatch(/epígrafe/);
      const indice: { boe: string; bloques: { id: string; boe: string; preceptos: string[] }[] } = JSON.parse(readFileSync(`public/material/${m.carpeta}/${m.textoOficial!.file.replace('-texto-oficial.md', '-indice.json')}`, 'utf8'));
      expect(indice.bloques.map((b) => b.id)).toEqual(m.bloques.map((b) => b.id));
      for (const b of indice.bloques) {
        const f = m.fuentes.find((x) => x.boe === b.boe)!;
        expect(f?.doe, `T${n} ${b.id}`).toBeDefined();
        expect(m.bloques.find((x) => x.id === b.id)!.boe ?? indice.boe).toBe(b.boe);
        const esq = readFileSync(`public/material/${m.carpeta}/${b.id}-1-esquema.md`, 'utf8');
        expect(esq).toContain(`comprobado a mano el ${f.doe!.comprobado}`);
        if (n === 29) {
          // T29 usa una nota editorial legible; conserva las evidencias de vigencia y sus fuentes.
          expect(esq).toContain('Qué se buscó:');
          expect(esq).toContain('ficha ELI consultada');
          expect(esq).toContain('Decreto 39/2025');
          expect(esq).toContain('Resolución DOE n.º 201/2024');
          expect(esq).toContain('pendiente de confirmar');
          expect(esq).toContain('https://doe.juntaex.es/eli/es-ex/d/2019/10/15/187/dof/spa/pdf');
        } else {
          expect(esq).toContain(`Qué se buscó: ${f.doe!.busqueda}`);
          expect(esq).toContain(`(${f.doe!.pdfDoe})`);
        }
        expect((esq.match(/^- \[/gm) ?? []).length, `T${n} ${b.id}`).toBe(b.preceptos.length);
        expect(esq).toContain(`(${f.url}#page=`);
        const com = readFileSync(`public/material/${m.carpeta}/${b.id}-3-completo.md`, 'utf8');
        expect(com).not.toContain('BOE)');
      }
    }
    expect(materialDeTema(30)!.fuentes.map((f) => f.claves![0])).toEqual(['INUNCAEX', 'TRANSCAEX', 'RADIOCAEX', 'PLASISMEX']);
    // Las tablas no se copian: se remite a la página del PDF.
    const tablas = readFileSync('public/material/tema30/planes-03-3-completo.md', 'utf8');
    expect(tablas).toMatch(/^Tabla o figura: consúltala en el \[PDF oficial, pág\. \d+\]\(https:\/\/www\.juntaex\.es\/documents\/[^)]+#page=\d+\)\.$/m);
  });
});
