import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA37_RECALL_CARDS, TEMA37_RECALL_META } from './tema37Recall';
import { getDeckRevision } from './recallReview';
import { getRecallDeck, getTemasEnPreparacion, loadRecallDeckCards } from './recallRegistry';

// T37 (01/11/2026, feat/t37-abrir): 37 de 37 fichas literales en la página citada del Plan de prevención del CPEI,
// BOP de Badajoz nº 117, 22/06/2026, anuncio 2242/2026. Cotejo de solo lectura: scripts/verificar-t37-bop.py [--online].
const json = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema37/fichas_lote01.json'), 'utf-8')) as {
  url: string;
  fichas: typeof TEMA37_RECALL_CARDS;
};

describe('Tema 37 · Plan de prevención del CPEI', () => {
  it('el módulo coincide con el JSON de datos y con su metadato', () => {
    expect(TEMA37_RECALL_CARDS).toEqual(json.fichas);
    expect(TEMA37_RECALL_META.count).toBe(37);
    expect(getRecallDeck('tema37').count).toBe(37);
  });

  it('cada ficha cita el BOP nº 117, anuncio 2242/2026, con página y apartado', () => {
    expect(json.url).toBe('https://www.dip-badajoz.es/ficheros/bop/bopedictos/2026-06-22000000_2242.pdf');
    for (const c of TEMA37_RECALL_CARDS) {
      expect(c.fuente, c.id).toMatch(/BOP de Badajoz nº 117, de 22\/06\/2026, anuncio 2242\/2026/);
      expect(c.localizacion, c.id).toMatch(/^BOP nº 117, anuncio 2242\/2026, página \d+ de 77, apartado /);
      expect(c.concepto, c.id).toContain('?');
    }
  });

  it('las respuestas antes recortadas están completas', () => {
    const r = (id: string) => TEMA37_RECALL_CARDS.find((c) => c.id === id)!.respuesta;
    expect(r('CPEI-T37-L01-4660EB2EC9')).toMatch(/Puebla de la Calzada Parque Alburqueque$/);
    expect(r('CPEI-T37-L01-A597CC01FF')).toMatch(/Parque Castuera Parque Herrera del Duque$/);
    expect(r('CPEI-T37-L01-423B47B0B7')).toMatch(/^Comunicar al oficial .* por parte del trabajador\.$/);
    expect(TEMA37_RECALL_CARDS.every((c) => !/ de$/.test(c.respuesta))).toBe(true);
  });

  it('está revisado y publicado: ya no sale «En preparación»', async () => {
    expect(getDeckRevision('tema37')).toBe('revisado');
    expect(getTemasEnPreparacion().map((t) => t.tema)).not.toContain(37);
    expect(await loadRecallDeckCards('tema37')).toHaveLength(37);
  });
});
