import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA6_RECALL_CARDS, TEMA6_RECALL_META } from './tema6Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema06/tema06_fichas.json'), 'utf-8')) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  pct_errores_muestra: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('tema 6 · fase 2 (texto oficial consolidado)', () => {
  it('carga exactamente las fichas del JSON de calidad', () => {
    expect(TEMA6_RECALL_META).toMatchObject({ tema: 6, count: 94 });
    expect(fichasJson).toMatchObject({ tema: 6, estado: 'cargado', entran_tras_filtro: 94 });
    expect(TEMA6_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('muestra revisada a mano de al menos 20 fichas con un 5 % de errores como mucho', () => {
    expect(fichasJson.muestra_revisada.length).toBeGreaterThanOrEqual(20);
    expect(fichasJson.pct_errores_muestra).toBeLessThanOrEqual(5);
    const ids = new Set(TEMA6_RECALL_CARDS.map((c) => c.id));
    expect(fichasJson.muestra_revisada.every((r) => ids.has(r.id))).toBe(true);
  });

  it('cada ficha cita norma, artículo y enlace oficial; sin duplicados ni respuesta en la pregunta', () => {
    expect(TEMA6_RECALL_CARDS.every((c) => /BOE\-A\-1995\-24292/.test(c.fuente) && /https:\/\/www\.(boe|doe)\.(es|juntaex\.es)/.test(c.fuente))).toBe(true);
    expect(TEMA6_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T06-OF-') && c.concepto.includes('?'))).toBe(true);
    expect(new Set(TEMA6_RECALL_CARDS.map((c) => c.id)).size).toBe(TEMA6_RECALL_CARDS.length);
    expect(new Set(TEMA6_RECALL_CARDS.map((c) => c.concepto)).size).toBe(TEMA6_RECALL_CARDS.length);
    expect(TEMA6_RECALL_CARDS.some((c) => c.concepto.toLowerCase().includes(c.respuesta.toLowerCase()))).toBe(false);
  });

  it('se registra como mazo bajo demanda', async () => {
    expect(getRecallDeck('tema6').count).toBe(94);
    expect(await loadRecallDeckCards('tema6')).toBe(TEMA6_RECALL_CARDS);
  });
});
