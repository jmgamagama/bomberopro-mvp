import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA16_LOTE02_RECALL_CARDS } from './tema16Lote02Recall';
import { TEMA22_LOTE02_RECALL_CARDS } from './tema22Lote02Recall';
import { getDeckRevision } from './recallReview';
import { REVIEWED_DECKS } from './recallReviewMotivos';
import { getVisibleTotalCards, isCardVisible } from './recallRegistry';

/**
 * feat/t16-lote02 (02/11/2026): el mazo `tema16-lote02` cita el Reglamento de Radiocomunicaciones de la UIT (ed. 2024),
 * cotejado al literal (scripts/verificar-t16-lote02.py → data/verificacion/t16-lote02.json). José aceptó la UIT como fuente oficial
 * el 02/11/2026 (feat/t16-abrir-uit) y se abren las 21.
 * Ver docs/REVISION_T16_LOTE02_2026-11-02.md.
 */
const V = JSON.parse(readFileSync(resolve(__dirname, '../../data/verificacion/t16-lote02.json'), 'utf8')) as {
  script: string;
  fuentes: Record<string, { url: string; aceptada: boolean; sha256?: string; sha256_texto_xml?: string }>;
  resumen: { fichas: number; literal_rr: number; literal_boe: number; abiertas: number };
  fichas: { id: string; respuesta: string; rr: string; pagina_rr: number; boe_literal: string[]; fuente_aceptada: boolean; estado: string }[];
};

describe('tema16-lote02 · cotejo con el RR de la UIT (fuente aceptada el 02/11/2026)', () => {
  it('el informe cubre exactamente las 21 fichas del mazo, con la misma respuesta', () => {
    expect(V.script).toBe('scripts/verificar-t16-lote02.py');
    expect(V.fichas.map((f) => [f.id, f.respuesta])).toEqual(TEMA16_LOTE02_RECALL_CARDS.map((c) => [c.id, c.respuesta]));
    expect(V.resumen).toEqual({ fichas: 21, literal_rr: 21, literal_boe: 5, abiertas: 21 });
  });

  it('las 21 son literales en la página citada del PDF de la UIT, y la UIT es fuente aceptada', () => {
    expect(V.fichas.every((f) => f.rr === 'literal' && f.pagina_rr >= 18 && f.pagina_rr <= 36)).toBe(true);
    expect(V.fuentes.RR2024_vol1.aceptada).toBe(true);
    expect(V.fichas.every((f) => f.fuente_aceptada === true && f.estado === 'abierta')).toBe(true);
    expect(TEMA16_LOTE02_RECALL_CARDS.every((c) => c.fuente.includes('itu.int') && !/boe\.es/.test(c.fuente))).toBe(true);
  });

  it('el mazo está revisado y las 21 son visibles para el alumno; total visible 2.857 → 2.878', () => {
    expect(getDeckRevision('tema16-lote02')).toBe('revisado');
    expect(REVIEWED_DECKS['tema16-lote02']?.informe).toBe('docs/REVISION_T16_LOTE02_2026-11-02.md');
    expect(TEMA16_LOTE02_RECALL_CARDS.filter((c) => isCardVisible('tema16-lote02', c.id))).toHaveLength(21);
    expect(getVisibleTotalCards()).toBe(2878);
  });
});

describe('tema22-lote02 · fichas de la NTP 809 y normas sustituidas', () => {
  const ntp809 = TEMA22_LOTE02_RECALL_CARDS.filter((c) => /809/.test(c.fuente));
  it('son 6 y ninguna presenta el RD 1407/1992 ni la Directiva 89/686/CEE (sustituidos por el Reglamento (UE) 2016/425)', () => {
    expect(ntp809).toHaveLength(6);
    expect(ntp809.every((c) => c.concepto.startsWith('Según la NTP 809'))).toBe(true);
    expect(ntp809.some((c) => /1407|89\/686|Directiva|Real Decreto|R\.\s?D\./i.test(c.concepto + ' ' + c.respuesta))).toBe(false);
    expect(ntp809.every((c) => isCardVisible('tema22-lote02', c.id))).toBe(true);
  });
});
