import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA23_RECALL_CARDS, TEMA23_RECALL_META } from './tema23Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema23/tema23_fichas.json'), 'utf-8')) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  pct_errores_muestra: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('tema 23 · fase 2 (texto oficial consolidado)', () => {
  it('carga exactamente las fichas del JSON de calidad', () => {
    expect(TEMA23_RECALL_META).toMatchObject({ tema: 23, count: 21 });
    expect(fichasJson).toMatchObject({ tema: 23, estado: 'cargado', entran_tras_filtro: 21 });
    expect(TEMA23_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('muestra revisada a mano de al menos 20 fichas con un 5 % de errores como mucho', () => {
    expect(fichasJson.muestra_revisada.length).toBeGreaterThanOrEqual(Math.min(20, TEMA23_RECALL_CARDS.length));
    expect(fichasJson.pct_errores_muestra).toBeLessThanOrEqual(5);
    const ids = new Set(TEMA23_RECALL_CARDS.map((c) => c.id));
    expect(fichasJson.muestra_revisada.every((r) => ids.has(r.id))).toBe(true);
  });

  it('cada ficha cita norma, artículo y enlace oficial; sin duplicados ni respuesta en la pregunta', () => {
    expect(TEMA23_RECALL_CARDS.every((c) => /BOE\-A\-2011\-14277/.test(c.fuente) && /https:\/\/([a-z]+\.)?(boe\.es|doe\.juntaex\.es|juntaex\.es|codigotecnico\.org|unocha\.org|dgt\.es|insst\.es|dip-badajoz\.es|miteco\.gob\.es|eur-lex\.europa\.eu)/.test(c.fuente))).toBe(true);
    expect(TEMA23_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T23-OF-') && c.concepto.includes('?'))).toBe(true);
    expect(new Set(TEMA23_RECALL_CARDS.map((c) => c.id)).size).toBe(TEMA23_RECALL_CARDS.length);
    expect(new Set(TEMA23_RECALL_CARDS.map((c) => c.concepto)).size).toBe(TEMA23_RECALL_CARDS.length);
    expect(TEMA23_RECALL_CARDS.some((c) => c.concepto.toLowerCase().includes(c.respuesta.toLowerCase()))).toBe(false);
  });

  it('se registra como mazo bajo demanda', async () => {
    expect(getRecallDeck('tema23').count).toBe(21);
    expect(await loadRecallDeckCards('tema23')).toBe(TEMA23_RECALL_CARDS);
  });
});
