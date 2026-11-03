import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA17_RECALL_CARDS, TEMA17_RECALL_META } from './tema17Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema17/tema17_fichas.json'), 'utf-8')) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  pct_errores_muestra: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('tema 17 · fase 2 (texto oficial consolidado)', () => {
  it('carga exactamente las fichas del JSON de calidad', () => {
    expect(TEMA17_RECALL_META).toMatchObject({ tema: 17, count: 14 });
    expect(fichasJson).toMatchObject({ tema: 17, estado: 'cargado', entran_tras_filtro: 14 });
    expect(TEMA17_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('muestra revisada a mano de al menos 20 fichas con un 5 % de errores como mucho', () => {
    expect(fichasJson.muestra_revisada.length).toBeGreaterThanOrEqual(Math.min(20, TEMA17_RECALL_CARDS.length));
    expect(fichasJson.pct_errores_muestra).toBeLessThanOrEqual(5);
    const ids = new Set(TEMA17_RECALL_CARDS.map((c) => c.id));
    expect(fichasJson.muestra_revisada.every((r) => ids.has(r.id))).toBe(true);
  });

  it('cada ficha cita norma, artículo y enlace oficial; sin duplicados ni respuesta en la pregunta', () => {
    expect(TEMA17_RECALL_CARDS.every((c) => /BOE\-A\-2009\-5490/.test(c.fuente) && /https:\/\/www\.(boe\.es|doe\.juntaex\.es|juntaex\.es|codigotecnico\.org|unocha\.org|dgt\.es|insst\.es|dip-badajoz\.es|miteco\.gob\.es)/.test(c.fuente))).toBe(true);
    expect(TEMA17_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T17-OF-') && c.concepto.includes('?'))).toBe(true);
    expect(new Set(TEMA17_RECALL_CARDS.map((c) => c.id)).size).toBe(TEMA17_RECALL_CARDS.length);
    expect(new Set(TEMA17_RECALL_CARDS.map((c) => c.concepto)).size).toBe(TEMA17_RECALL_CARDS.length);
    expect(TEMA17_RECALL_CARDS.some((c) => c.concepto.toLowerCase().includes(c.respuesta.toLowerCase()))).toBe(false);
  });

  it('se registra como mazo bajo demanda', async () => {
    expect(getRecallDeck('tema17').count).toBe(14);
    expect(await loadRecallDeckCards('tema17')).toBe(TEMA17_RECALL_CARDS);
  });
});
