import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA36_LOTE01_RECALL_CARDS } from './tema36Lote01Recall';
import { TEMA36_LOTE02_RECALL_CARDS } from './tema36Lote02Recall';
import { TEMA36_LOTE03_RECALL_CARDS } from './tema36Lote03Recall';
import { TEMA36_LOTE04_RECALL_CARDS } from './tema36Lote04Recall';
import { TEMA36_LOTE05_RECALL_CARDS } from './tema36Lote05Recall';
import { TEMA36_LOTE06_RECALL_CARDS, TEMA36_LOTE06_RECALL_META } from './tema36Lote06Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema36/fichas_lote06_55.json'), 'utf-8'),
) as {
  metadata: { lote: string; count: number };
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string; subtema: string; tipo_unidad: string }>;
};

const PREVIOUS = [...TEMA36_LOTE01_RECALL_CARDS, ...TEMA36_LOTE02_RECALL_CARDS, ...TEMA36_LOTE03_RECALL_CARDS, ...TEMA36_LOTE04_RECALL_CARDS, ...TEMA36_LOTE05_RECALL_CARDS];

describe('tema 36 lote 06 (Acedera → Granja de Torrehermosa)', () => {
  it('carga exactamente 55 fichas desde el JSON limpio', () => {
    expect(TEMA36_LOTE06_RECALL_META.count).toBe(55);
    expect(TEMA36_LOTE06_RECALL_META.lote).toBe('lote06');
    expect(fichasJson.metadata).toMatchObject({ lote: 'lote06', count: 55 });
    expect(TEMA36_LOTE06_RECALL_CARDS).toHaveLength(55);
    expect(fichasJson.fichas.every((c) => c.subtema === 'S03' && c.tipo_unidad === 'tabla territorial')).toBe(true);
    expect(TEMA36_LOTE06_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
  });

  it('coincide ficha a ficha con el JSON, sin duplicados', () => {
    expect(TEMA36_LOTE06_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
    expect(new Set(TEMA36_LOTE06_RECALL_CARDS.map((c) => c.id)).size).toBe(55);
    expect(new Set(TEMA36_LOTE06_RECALL_CARDS.map((c) => c.concepto)).size).toBe(55);
  });

  it('no solapa con los lotes anteriores (ids, conceptos ni códigos INE)', () => {
    const ids = new Set(PREVIOUS.map((c) => c.id));
    const conceptos = new Set(PREVIOUS.map((c) => c.concepto));
    expect(TEMA36_LOTE06_RECALL_CARDS.some((c) => ids.has(c.id) || conceptos.has(c.concepto))).toBe(false);
    const ine = (cards: readonly { respuesta: string }[]) => cards.map((c) => c.respuesta).filter((r) => /^06\d{3}$/.test(r));
    const prevIne = new Set(ine(PREVIOUS));
    expect(ine(TEMA36_LOTE06_RECALL_CARDS).some((r) => prevIne.has(r))).toBe(false);
  });

  it('límites: formato, sin autolímite y código INE del id igual al de la ficha S02 del municipio', () => {
    const norm = (n: string) => n.replace(/^(.+), (La|El|Los|Las)$/, '$2 $1');
    const ine = new Map<string, string>();
    for (const c of PREVIOUS) {
      const m = c.concepto.match(/^¿Cuál es el código INE del municipio de (.+)\?$/);
      if (m) ine.set(norm(m[1]), c.respuesta);
    }
    expect(ine.size).toBe(165);
    for (const c of TEMA36_LOTE06_RECALL_CARDS) {
      const mun = c.concepto.match(/^¿Con qué municipios o territorios limita (.+)\?$/)![1];
      expect(c.respuesta).toMatch(/^(Dentro de la provincia de Badajoz: [^.]+\.)?( ?Límite externo: [^.]+\.)?$/);
      const code = c.id.match(/^CPEI-T36-S03-MUN-(06\d{3})-LIM$/)![1];
      expect(code).toBe(ine.get(norm(mun)));
      expect(c.localizacion).toContain(`341106${code}`);
      const dentro = (c.respuesta.match(/^Dentro de la provincia de Badajoz: ([^.]+)\./)?.[1] ?? '').split(', ').filter(Boolean);
      expect(dentro.map(norm)).not.toContain(norm(mun));
      for (const v of dentro) expect(ine.has(norm(v))).toBe(true);
    }
  });

  it('entra por el registro central como lote 6 del tema 36', async () => {
    const deck = getRecallDeck('tema36-lote06');
    expect(deck.shortLabel).toBe('T36·6');
    expect(deck.count).toBe(55);
    expect(deck.topicId).toBe('tema36');
    expect(deck.loteLabel).toBe('Lote 6');
    // Lote revisado ficha a ficha entero: el alumno ve todas sus fichas.
    expect(await loadRecallDeckCards(deck.id)).toEqual(TEMA36_LOTE06_RECALL_CARDS);
  });
});
