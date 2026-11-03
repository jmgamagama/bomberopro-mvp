import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA34_LOTE03_RECALL_CARDS, TEMA34_LOTE03_RECALL_META } from './tema34Lote03Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(readFileSync(resolve(__dirname, '../../data/tema34/tema34_lote03_fichas.json'), 'utf-8')) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  pct_errores_muestra: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('tema 34 · fase 2 (texto oficial consolidado)', () => {
  it('carga exactamente las fichas del JSON de calidad', () => {
    expect(TEMA34_LOTE03_RECALL_META).toMatchObject({ tema: 34, count: 35 });
    expect(fichasJson).toMatchObject({ tema: 34, estado: 'cargado', entran_tras_filtro: 35 });
    expect(TEMA34_LOTE03_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('muestra revisada a mano de al menos 20 fichas con un 5 % de errores como mucho', () => {
    expect(fichasJson.muestra_revisada.length).toBeGreaterThanOrEqual(Math.min(20, TEMA34_LOTE03_RECALL_CARDS.length));
    expect(fichasJson.pct_errores_muestra).toBeLessThanOrEqual(5);
    const ids = new Set(TEMA34_LOTE03_RECALL_CARDS.map((c) => c.id));
    expect(fichasJson.muestra_revisada.every((r) => ids.has(r.id))).toBe(true);
  });

  it('cada ficha cita norma, artículo y enlace oficial; sin duplicados ni respuesta en la pregunta', () => {
    expect(TEMA34_LOTE03_RECALL_CARDS.every((c) => /BOE\-A\-2025\-7190/.test(c.fuente) && /https:\/\/([a-z]+\.)?(boe\.es|doe\.juntaex\.es|juntaex\.es|codigotecnico\.org|unocha\.org|dgt\.es|insst\.es|dip-badajoz\.es|miteco\.gob\.es|eur-lex\.europa\.eu|itu\.int)/.test(c.fuente))).toBe(true);
    expect(TEMA34_LOTE03_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T34-OF-') && c.concepto.includes('?'))).toBe(true);
    expect(new Set(TEMA34_LOTE03_RECALL_CARDS.map((c) => c.id)).size).toBe(TEMA34_LOTE03_RECALL_CARDS.length);
    expect(new Set(TEMA34_LOTE03_RECALL_CARDS.map((c) => c.concepto)).size).toBe(TEMA34_LOTE03_RECALL_CARDS.length);
    expect(TEMA34_LOTE03_RECALL_CARDS.some((c) => c.concepto.toLowerCase().includes(c.respuesta.toLowerCase()))).toBe(false);
  });

  it('se registra como mazo bajo demanda', async () => {
    expect(getRecallDeck('tema34-lote03').count).toBe(35);
    expect(await loadRecallDeckCards('tema34-lote03')).toBe(TEMA34_LOTE03_RECALL_CARDS);
  });
});
