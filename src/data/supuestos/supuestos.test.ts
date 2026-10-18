// @vitest-environment jsdom
// Supuestos prácticos: contenido auditado, índice coherente, corrección local y revisión.
import '../../test/setup';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SUPUESTOS } from './supuestosData';
import { SUPUESTOS_INDEX, getVisibleSupuestos, loadSupuestos } from './supuestosRegistry';
import { auditSupuesto, auditSupuestos, evaluarOperacion } from './supuestosAudit';
import {
  SUPUESTOS_STORAGE_KEY,
  corregirSupuesto,
  esCorrecta,
  guardarResultado,
  leerUltimosResultados,
  parseNumeroUsuario,
} from './supuestosCorreccion';
import { REVIEWED_DECKS } from '../recallReview';
import { setRevisionViewer } from '../../utils/revisionAccess';
import type { PreguntaCalculo, Supuesto } from './supuestosTypes';

function jsonFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? jsonFiles(p) : p.endsWith('.json') ? [p] : [];
  });
}

describe('contenido de los supuestos', () => {
  it('pasa la auditoría editorial sin incidencias', () => {
    expect(auditSupuestos(SUPUESTOS)).toEqual([]);
  });

  it('son 3 casos originales, con al menos un cálculo con fórmula oficial', () => {
    expect(SUPUESTOS).toHaveLength(3);
    expect(SUPUESTOS.every((s) => s.autoria === 'original')).toBe(true);
    expect(SUPUESTOS.flatMap((s) => s.preguntas).some((p) => p.tipo === 'calculo')).toBe(true);
  });

  it('cada enlace citado ya se usa en las fichas de recuerdo (fuentes conocidas)', () => {
    const corpus = jsonFiles(join(process.cwd(), 'data')).map((f) => readFileSync(f, 'utf8')).join('\n');
    for (const s of SUPUESTOS)
      for (const p of s.preguntas) {
        const url = p.fuente.match(/https?:\/\/\S+/)![0];
        expect(corpus.includes(url), `${p.id}: ${url}`).toBe(true);
      }
  });

  it('no cita material del CEP ni del CPEI', () => {
    const texto = JSON.stringify(SUPUESTOS).toLowerCase();
    for (const prohibido of ['cep ', 'cpei', 'cualificación en técnicas', 'academia']) expect(texto).not.toContain(prohibido);
  });

  it('el índice ligero coincide con el contenido', () => {
    expect(
      SUPUESTOS_INDEX.map(({ id, titulo, temas, numPreguntas }) => ({ id, titulo, temas, numPreguntas })),
    ).toEqual(SUPUESTOS.map((s) => ({ id: s.id, titulo: s.titulo, temas: s.temas, numPreguntas: s.preguntas.length })));
  });

  it('loadSupuestos carga el mismo contenido', async () => {
    expect(await loadSupuestos()).toBe(SUPUESTOS);
  });
});

describe('auditoría de supuestos', () => {
  const base = SUPUESTOS[2];
  it('detecta un paso de cálculo mal hecho, una opción repetida y un enlace no oficial', () => {
    const calc = base.preguntas.find((p) => p.tipo === 'calculo') as PreguntaCalculo;
    const roto: Supuesto = {
      ...base,
      temas: [3],
      preguntas: [
        { ...calc, pasos: [{ ...calc.pasos[0], resultado: 26 }] },
        { ...SUPUESTOS[0].preguntas[0], fuente: `${SUPUESTOS[0].preguntas[0].localizacion}. https://example.com/x` },
        ...(SUPUESTOS[0].preguntas[1].tipo === 'test'
          ? [{ ...SUPUESTOS[0].preguntas[1], opciones: ['a', 'a', 'b', 'c'] as const }]
          : []),
      ],
    };
    const problemas = auditSupuesto(roto).map((i) => i.problema).join(' | ');
    expect(problemas).toMatch(/fuera de la parte específica/);
    expect(problemas).toMatch(/paso 1: 20 \+ 5 ≠ 26/);
    expect(problemas).toMatch(/enlace no oficial/);
    expect(problemas).toMatch(/opciones repetidas/);
  });

  it('evaluarOperacion calcula sin eval', () => {
    expect(evaluarOperacion('2 × 160 × 60')).toBe(19200);
    expect(evaluarOperacion('(20 + 5) * 2')).toBe(50);
    expect(evaluarOperacion('7,5 / 2,5')).toBe(3);
    expect(evaluarOperacion('2 + alert(1)')).toBeNull();
  });
});

describe('corrección local', () => {
  it('parseNumeroUsuario admite formatos españoles y unidades', () => {
    expect(parseNumeroUsuario('19.200')).toBe(19200);
    expect(parseNumeroUsuario('19 200 l')).toBe(19200);
    expect(parseNumeroUsuario('30000')).toBe(30000);
    expect(parseNumeroUsuario('25 m')).toBe(25);
    expect(parseNumeroUsuario('3,5')).toBe(3.5);
    expect(parseNumeroUsuario('abc')).toBeNull();
    expect(parseNumeroUsuario('')).toBeNull();
  });

  it('corrige test y cálculo y da el resultado', () => {
    const s = SUPUESTOS[2];
    const respuestas: Record<string, number | string> = {};
    for (const p of s.preguntas) respuestas[p.id] = p.tipo === 'test' ? p.correcta : p.tipo === 'calculo' ? String(p.resultado) : '';
    expect(corregirSupuesto(s, respuestas)).toMatchObject({ aciertos: s.preguntas.length, total: s.preguntas.length, proporcion: 1 });
    const primera = s.preguntas[0];
    expect(esCorrecta(primera, '26')).toBe(false);
    expect(esCorrecta(primera, undefined)).toBe(false);
    expect(corregirSupuesto(s, {}).aciertos).toBe(0);
  });

  it('guarda el último resultado solo en este dispositivo', () => {
    window.localStorage.clear();
    guardarResultado('supuesto-x', { aciertos: 2, total: 3, proporcion: 2 / 3, porPregunta: {} }, new Date('2026-10-18T10:00:00Z'));
    expect(leerUltimosResultados()['supuesto-x']).toEqual({ aciertos: 2, total: 3, fecha: '2026-10-18T10:00:00.000Z' });
    window.localStorage.setItem(SUPUESTOS_STORAGE_KEY, '{roto');
    expect(leerUltimosResultados()).toEqual({});
  });
});

describe('revisión por mazo', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setRevisionViewer(null);
  });
  afterEach(() => vi.unstubAllEnvs());

  it('los 3 supuestos están pendientes y el alumno no ve ninguno', () => {
    for (const s of SUPUESTOS_INDEX) {
      expect(s.revision).toBe('pendiente');
      expect(REVIEWED_DECKS[s.id]).toBeUndefined();
    }
    expect(getVisibleSupuestos()).toEqual([]);
  });

  it('el build de administrador de revisión los ve todos', () => {
    vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true');
    expect(getVisibleSupuestos()).toHaveLength(3);
  });
});

describe('informe de auditoría', () => {
  it('cada supuesto figura en docs/AUDITORIA_FICHAS.md y, si está revisado, con su versión al día', async () => {
    const { createHash } = await import('node:crypto');
    const { canonicalSupuestoContent } = await import('./supuestosAudit');
    const doc = readFileSync(join(process.cwd(), 'docs/AUDITORIA_FICHAS.md'), 'utf-8');
    for (const s of SUPUESTOS) {
      const row = doc.split('\n').find((l) => l.startsWith(`| ${s.id} |`));
      expect(row, `${s.id} falta en el informe`).toBeDefined();
      const idx = SUPUESTOS_INDEX.find((x) => x.id === s.id)!;
      if (idx.revision !== 'revisado') continue;
      const huella = createHash('sha256').update(canonicalSupuestoContent(s)).digest('hex').slice(0, 16);
      expect(row, `${s.id}: contenido publicado cambiado sin regenerar el informe`).toContain(`\`${huella}\``);
    }
  });
});
