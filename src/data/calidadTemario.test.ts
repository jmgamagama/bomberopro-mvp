// Validadores del temario en trinquete: el baseline recoge los fallos heredados y el test solo falla si aparece uno nuevo.
// Actualizar el baseline (solo tras corregir fallos, nunca para tapar uno nuevo): npm run calidad:temario:baseline
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  anotarDiferenciasAnexo,
  FALLOS_FICHA,
  FALLOS_MATERIAL,
  diferenciaEpigrafe,
  epigrafesRepo,
  fallosFicha,
  fallosMaterial,
  type FalloFicha,
  type FalloMaterial,
} from './calidadTemario';
import { MATERIAL_TEMAS } from './materialTemas';
import { RECALL_DECKS, loadRawRecallDeckCards } from './recallRegistry';
import { EPIGRAFES_BOP_135_2026 } from './temarioOficialBop135';

const ROOT = resolve(__dirname, '../..');
const BASELINE_PATH = resolve(__dirname, 'calidadTemario.baseline.json');
const ACTUALIZAR = process.env.ACTUALIZAR_BASELINE_TEMARIO === '1';

interface Baseline {
  _leeme: string;
  fichas: Record<FalloFicha, Record<string, string[]>>;
  material: Record<FalloMaterial, string[]>;
  anexo: Record<string, { diferencia: string; nota: string }>;
}

const leerBaseline = (): Baseline => JSON.parse(readFileSync(BASELINE_PATH, 'utf-8')) as Baseline;

async function fallosActualesFichas(): Promise<Baseline['fichas']> {
  const out = Object.fromEntries(FALLOS_FICHA.map((f) => [f, {} as Record<string, string[]>])) as Baseline['fichas'];
  for (const deck of RECALL_DECKS) {
    for (const c of await loadRawRecallDeckCards(deck.id)) {
      for (const f of fallosFicha(c)) (out[f][deck.id] ??= []).push(c.id);
    }
  }
  return out;
}

function ficherosMaterial(): { ruta: string; capa: 'esquema' | 'desarrollo' }[] {
  const out: { ruta: string; capa: 'esquema' | 'desarrollo' }[] = [];
  for (const t of MATERIAL_TEMAS)
    for (const b of t.bloques)
      for (const capa of ['esquema', 'desarrollo'] as const) {
        const f = b.capas[capa];
        if (f) out.push({ ruta: `public/material/${t.carpeta}/${f}`, capa });
      }
  return out;
}

function fallosActualesMaterial(): Baseline['material'] {
  const out = Object.fromEntries(FALLOS_MATERIAL.map((f) => [f, [] as string[]])) as Baseline['material'];
  for (const { ruta, capa } of ficherosMaterial()) {
    for (const f of fallosMaterial(readFileSync(resolve(ROOT, ruta), 'utf-8'), capa)) out[f].push(ruta);
  }
  return out;
}

function diferenciasAnexo(): Record<string, string> {
  const repo = epigrafesRepo(readFileSync(resolve(ROOT, 'data/temario/cpei-badajoz-2026-anexo1.md'), 'utf-8'));
  const out: Record<string, string> = {};
  for (let t = 1; t <= 40; t++) {
    const d = diferenciaEpigrafe(EPIGRAFES_BOP_135_2026[t], repo[t] ?? '');
    if (d) out[`T${t}`] = d;
  }
  return out;
}

/** Pares «tipo · clave» para comparar con el baseline. */
const pares = (fichas: Baseline['fichas'], material: Baseline['material']) => [
  ...Object.entries(fichas).flatMap(([f, porMazo]) =>
    Object.entries(porMazo).flatMap(([mazo, ids]) => ids.map((id) => `fichas · ${f} · ${mazo} · ${id}`)),
  ),
  ...Object.entries(material).flatMap(([f, rutas]) => rutas.map((r) => `material · ${f} · ${r}`)),
];

describe('reglas de los validadores', () => {
  it('anexo: una diferencia nueva exige explicación nueva al regenerar el baseline', () => {
    expect(anotarDiferenciasAnexo(
      { T1: '+igual', T37: '+nuevo', T40: '+primero' },
      {
        T1: { diferencia: '+igual', nota: 'Justificación vigente' },
        T37: { diferencia: '+mapa +descargable', nota: 'Nota sobre mapa descargable' },
        T12: { diferencia: '+resuelto', nota: 'Ya no aparece' },
      },
    )).toEqual({
      T1: { diferencia: '+igual', nota: 'Justificación vigente' },
      T37: { diferencia: '+nuevo', nota: 'PENDIENTE: explicar' },
      T40: { diferencia: '+primero', nota: 'PENDIENTE: explicar' },
    });
    expect(anotarDiferenciasAnexo({ T37: '+nuevo' })).toEqual({
      T37: { diferencia: '+nuevo', nota: 'PENDIENTE: explicar' },
    });
  });

  it('fichas: acepta una cita breve con norma y enlace', () => {
    expect(
      fallosFicha({
        fuente: 'Constitución Española, BOE-A-1978-31229 https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229',
        localizacion: 'art. 1.1',
      }),
    ).toEqual([]);
    expect(fallosFicha({ fuente: 'ITF Horario de actividades del CPEI, ed. 2024', localizacion: 'pág. 3' })).toEqual([
      'fuente_sin_url',
    ]);
  });

  it('fichas: detecta párrafos pegados, citas sin referencia y localizaciones largas', () => {
    const parrafo = 'El extintor se coloca cerca. Debe estar visible. Se revisa cada año. Hay que señalizarlo bien. '.repeat(4);
    expect(fallosFicha({ fuente: parrafo, localizacion: 'x'.repeat(201) })).toEqual([
      'fuente_larga',
      'fuente_parrafo',
      'fuente_sin_referencia',
      'fuente_sin_url',
      'localizacion_larga',
    ]);
    expect(fallosFicha({ fuente: 'Apuntes del curso', localizacion: 'tema 2' })).toContain('fuente_sin_referencia');
  });

  it('material: el Tema 1 (patrón de referencia) pasa todas las reglas', () => {
    const t1 = ficherosMaterial().filter((f) => f.ruta.startsWith('public/material/constitucion/'));
    expect(t1.length).toBeGreaterThanOrEqual(12);
    for (const { ruta, capa } of t1) expect(fallosMaterial(readFileSync(resolve(ROOT, ruta), 'utf-8'), capa), ruta).toEqual([]);
  });

  it('material: detecta un esquema reducido a un enlace y sin formato', () => {
    const md = [
      '# Norma X (art. 11) · Esquema',
      '',
      'Texto consolidado del BOE (BOE-A-2006-5515). Fuente oficial: [RD 314/2006](https://www.boe.es/x).',
      '',
      '1 precepto. Cada rúbrica (literal) enlaza con el BOE.',
      '',
      '- [Artículo 11. Exigencias básicas](https://www.boe.es/x#a11)',
    ].join('\n');
    expect(fallosMaterial(md, 'esquema')).toEqual(['sin_secciones', 'negritas_bajas', 'esquema_solo_enlaces']);
    expect(fallosMaterial('# Bloque · Esquema\n## A\n**uno', 'desarrollo')).toEqual([
      'h1_sin_capa',
      'negritas_bajas',
      'negritas_desemparejadas',
    ]);
  });

  it('anexo: ignora tildes, puntuación y la nota final del repo', () => {
    expect(diferenciaEpigrafe('Título Preliminar. Garantías.', 'Titulo Preliminar, garantias — peso alto')).toBe('');
    expect(diferenciaEpigrafe('Plan de prevención del CPEI.', 'Plan de prevencion del CPEI. Mapa descargable.')).toBe(
      '+mapa +descargable',
    );
  });
});

describe('trinquete del temario (calidadTemario.baseline.json)', () => {
  it('no aparecen fallos nuevos en fichas, material ni anexo I', async () => {
    const fichas = await fallosActualesFichas();
    const material = fallosActualesMaterial();
    const anexo = diferenciasAnexo();

    if (ACTUALIZAR) {
      const prev = existsSync(BASELINE_PATH) ? leerBaseline() : undefined;
      const nuevo: Baseline = {
        _leeme:
          'Fallos heredados del temario (trinquete). Generado por calidadTemario.test.ts con npm run calidad:temario:baseline. ' +
          'Solo debe encoger: no lo regeneres para tapar un fallo nuevo. En «anexo», cada diferencia lleva una nota escrita a mano.',
        fichas,
        material,
        anexo: anotarDiferenciasAnexo(anexo, prev?.anexo),
      };
      writeFileSync(BASELINE_PATH, `${JSON.stringify(nuevo, null, 1)}\n`);
      return;
    }

    const base = leerBaseline();
    const actuales = pares(fichas, material);
    const permitidos = new Set(pares(base.fichas, base.material));
    const nuevos = actuales.filter((p) => !permitidos.has(p));
    const actualesSet = new Set(actuales);
    const resueltos = [...permitidos].filter((p) => !actualesSet.has(p));
    if (resueltos.length > 0) {
      console.warn(
        `calidadTemario: ${resueltos.length} fallos del baseline ya no aparecen. Actualiza el baseline con ` +
          `npm run calidad:temario:baseline para que no vuelvan. Ejemplos:\n  ${resueltos.slice(0, 10).join('\n  ')}`,
      );
    }
    expect(nuevos, 'fallos nuevos frente al baseline (corrígelos; no amplíes el baseline)').toEqual([]);

    const anexoBase = Object.fromEntries(Object.entries(base.anexo).map(([t, v]) => [t, v.diferencia]));
    expect(anexo, 'la transcripción del anexo I difiere del BOP 135/2026 de forma no documentada').toEqual(anexoBase);
    for (const [t, v] of Object.entries(base.anexo)) expect(v.nota, `${t}: nota sin explicar`).not.toMatch(/PENDIENTE/);
  });
});
