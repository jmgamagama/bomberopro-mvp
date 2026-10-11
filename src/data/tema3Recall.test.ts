import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA3_RECALL_CARDS, TEMA3_RECALL_META } from './tema3Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema03/tema03_fichas.json'), 'utf-8')) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  pct_errores_muestra: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('tema 3 · fase 2 (texto oficial consolidado)', () => {
  it('carga exactamente las fichas del JSON de calidad', () => {
    expect(TEMA3_RECALL_META).toMatchObject({ tema: 3, count: 66 });
    expect(fichasJson).toMatchObject({ tema: 3, estado: 'cargado', entran_tras_filtro: 66 });
    expect(TEMA3_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('muestra revisada a mano de al menos 20 fichas con un 5 % de errores como mucho', () => {
    expect(fichasJson.muestra_revisada.length).toBeGreaterThanOrEqual(20);
    expect(fichasJson.pct_errores_muestra).toBeLessThanOrEqual(5);
    const ids = new Set(TEMA3_RECALL_CARDS.map((c) => c.id));
    expect(fichasJson.muestra_revisada.every((r) => ids.has(r.id))).toBe(true);
  });

  it('cada ficha cita norma, artículo y enlace oficial; sin duplicados ni respuesta en la pregunta', () => {
    expect(TEMA3_RECALL_CARDS.every((c) => /BOE\-A\-1985\-5392/.test(c.fuente) && /https:\/\/www\.(boe|doe)\.(es|juntaex\.es)/.test(c.fuente))).toBe(true);
    expect(TEMA3_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T03-OF-') && c.concepto.includes('?'))).toBe(true);
    expect(new Set(TEMA3_RECALL_CARDS.map((c) => c.id)).size).toBe(TEMA3_RECALL_CARDS.length);
    expect(new Set(TEMA3_RECALL_CARDS.map((c) => c.concepto)).size).toBe(TEMA3_RECALL_CARDS.length);
    expect(TEMA3_RECALL_CARDS.some((c) => c.concepto.toLowerCase().includes(c.respuesta.toLowerCase()))).toBe(false);
  });

  it('se registra como mazo bajo demanda', async () => {
    expect(getRecallDeck('tema3').count).toBe(66);
    expect(await loadRecallDeckCards('tema3')).toBe(TEMA3_RECALL_CARDS);
  });
});
