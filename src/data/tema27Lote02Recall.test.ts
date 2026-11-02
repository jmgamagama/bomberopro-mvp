import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA27_LOTE02_RECALL_CARDS, TEMA27_LOTE02_RECALL_META } from './tema27Lote02Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema27/tema27_lote02_fichas.json'), 'utf-8')) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  pct_errores_muestra: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('tema 27 · lote02 · fase 2 (texto oficial consolidado)', () => {
  it('carga exactamente las fichas del JSON de calidad', () => {
    expect(TEMA27_LOTE02_RECALL_META).toMatchObject({ tema: 27, count: 30 });
    expect(fichasJson).toMatchObject({ tema: 27, estado: 'cargado', entran_tras_filtro: 30 });
    expect(TEMA27_LOTE02_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('muestra revisada a mano de al menos 20 fichas con un 5 % de errores como mucho', () => {
    expect(fichasJson.muestra_revisada.length).toBeGreaterThanOrEqual(Math.min(20, TEMA27_LOTE02_RECALL_CARDS.length));
    expect(fichasJson.pct_errores_muestra).toBeLessThanOrEqual(5);
    const ids = new Set(TEMA27_LOTE02_RECALL_CARDS.map((c) => c.id));
    expect(fichasJson.muestra_revisada.every((r) => ids.has(r.id))).toBe(true);
  });

  it('cada ficha cita norma, artículo y enlace oficial; sin duplicados ni respuesta en la pregunta', () => {
    expect(TEMA27_LOTE02_RECALL_CARDS.every((c) => /BOE\-A\-2013\-12323|DB SI del CTE/.test(c.fuente) && /https:\/\/([a-z]+\.)?(boe\.es|doe\.juntaex\.es|juntaex\.es|codigotecnico\.org|unocha\.org|dgt\.es|insst\.es|dip-badajoz\.es|miteco\.gob\.es|eur-lex\.europa\.eu|itu\.int)/.test(c.fuente))).toBe(true);
    expect(TEMA27_LOTE02_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T27-OF-') && c.concepto.includes('?'))).toBe(true);
    expect(new Set(TEMA27_LOTE02_RECALL_CARDS.map((c) => c.id)).size).toBe(TEMA27_LOTE02_RECALL_CARDS.length);
    expect(new Set(TEMA27_LOTE02_RECALL_CARDS.map((c) => c.concepto)).size).toBe(TEMA27_LOTE02_RECALL_CARDS.length);
    expect(TEMA27_LOTE02_RECALL_CARDS.some((c) => c.concepto.toLowerCase().includes(c.respuesta.toLowerCase()))).toBe(false);
  });

  it('se registra como mazo bajo demanda', async () => {
    expect(getRecallDeck('tema27-lote02').count).toBe(30);
    // Solo las 8 del RD 842/2013 (BOE); las 22 del CTE se filtran al cargar (recallCardReview.ts).
    expect(await loadRecallDeckCards('tema27-lote02')).toHaveLength(8);
  });
});
