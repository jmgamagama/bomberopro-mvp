import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TEMA8_RECALL_CARDS } from './tema8Recall';
import { TEMA9_RECALL_CARDS } from './tema9Recall';
import { TEMA12_LOTE02_RECALL_CARDS } from './tema12Lote02Recall';
import { TEMA13_LOTE02_RECALL_CARDS } from './tema13Lote02Recall';
import { TEMA22_LOTE02_RECALL_CARDS } from './tema22Lote02Recall';
import { getDeckRevision } from './recallReview';
import { getVisibleTotalCards, isCardVisible } from './recallRegistry';

/**
 * feat/insst-lotes (02/11/2026): fichas ocultas cuya única pega era citar al INSST (aceptado como fuente oficial el 01/11/2026),
 * cotejadas al literal con los PDF vigentes de insst.es (scripts/verificar-insst-lotes.py → data/verificacion/insst-lotes.json).
 */
const V = JSON.parse(readFileSync(resolve(__dirname, '../../data/verificacion/insst-lotes.json'), 'utf8')) as {
  script: string;
  fuentes: Record<string, { url: string; sha256: string }>;
  mazos: Record<string, { id: string; estado: string; respuesta: string; doc?: string; pagina?: number; motivo?: string }[]>;
};
const MAZOS = {
  tema8: TEMA8_RECALL_CARDS,
  tema9: TEMA9_RECALL_CARDS,
  'tema12-lote02': TEMA12_LOTE02_RECALL_CARDS,
  'tema13-lote02': TEMA13_LOTE02_RECALL_CARDS,
  'tema22-lote02': TEMA22_LOTE02_RECALL_CARDS,
} as const;
type Mazo = keyof typeof MAZOS;
const vistas = (m: Mazo) => MAZOS[m].filter((c) => isCardVisible(m, c.id)).length;

describe('INSST por lotes: se abren solo las fichas literales en la página citada', () => {
  it('la verificación cubre todas las fichas de los cinco mazos, con la respuesta actual', () => {
    expect(V.script).toBe('scripts/verificar-insst-lotes.py');
    for (const m of Object.keys(MAZOS) as Mazo[]) {
      const res = new Map(V.mazos[m].map((x) => [x.id, x]));
      expect([...res.keys()].sort(), m).toEqual(MAZOS[m].map((c) => c.id).sort());
      for (const c of MAZOS[m]) expect(res.get(c.id)!.respuesta, c.id).toBe(c.respuesta);
    }
  });

  it('cada PDF del INSST usado está identificado por URL de insst.es y sha256', () => {
    expect(Object.keys(V.fuentes).sort()).toEqual(['FSU05', 'FSU_ERA', 'GUIA_EPI', 'INSST_T33', 'INSST_T41', 'NTP099', 'NTP1170', 'NTP1218', 'NTP362', 'NTP536', 'NTP787', 'NTP809', 'NTP843']);
    for (const f of Object.values(V.fuentes)) {
      expect(f.url).toMatch(/^https:\/\/www\.insst\.es\//);
      expect(f.sha256).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it('cuántas se abren: T8 25 de 25, T9 17 de 84 (NTP 362 sigue oculta), T12-lote02 23, T13-lote02 47, T22-lote02 27', () => {
    expect((Object.keys(MAZOS) as Mazo[]).map(vistas)).toEqual([25, 17, 23, 47, 27]);
    expect(getVisibleTotalCards()).toBe(2857);
    expect(['tema8', 'tema12-lote02', 'tema13-lote02', 'tema22-lote02'].map(getDeckRevision)).toEqual(['revisado', 'revisado', 'revisado', 'revisado']);
    expect(getDeckRevision('tema9')).toBe('pendiente');
  });

  it('toda ficha visible que cita al INSST está «ok» con página; ninguna «no_literal» o «sin_pagina» es visible', () => {
    for (const m of Object.keys(MAZOS) as Mazo[]) {
      const res = new Map(V.mazos[m].map((x) => [x.id, x]));
      for (const c of MAZOS[m]) {
        const r = res.get(c.id)!;
        if (r.estado === 'no_insst') continue;
        expect(isCardVisible(m, c.id), `${m} ${c.id}`).toBe(r.estado === 'ok');
        if (r.estado === 'ok') expect(r.pagina, c.id).toBeGreaterThan(0);
        else expect(r.motivo, c.id).toBeTruthy();
      }
    }
  });

  it('T9: las 11 de la NTP 362 siguen ocultas (9 no literales, 2 literales pero sin página citada)', () => {
    const insst = V.mazos.tema9.filter((x) => x.estado !== 'no_insst');
    expect(insst).toHaveLength(11);
    expect(insst.filter((x) => x.estado === 'no_literal')).toHaveLength(9);
    expect(insst.filter((x) => x.estado === 'sin_pagina').map((x) => x.id).sort()).toEqual(['CPEI-T09-OF-0B46FCC3', 'CPEI-T09-OF-3869B3CE']);
    for (const x of insst) expect(isCardVisible('tema9', x.id)).toBe(false);
  });

  it('respuestas ajustadas al literal del PDF', () => {
    const r = (cards: readonly { id: string; respuesta: string }[], id: string) => cards.find((c) => c.id === id)!.respuesta;
    expect(r(TEMA8_RECALL_CARDS, 'CPEI-T08-OF-E2B5A638')).toBe('La concentración de sustancia en el aire (expresada en porcentaje en volumen y/o en masa por unidad de volumen) por debajo de la cual la atmósfera no es explosiva');
    expect(r(TEMA12_LOTE02_RECALL_CARDS, 'CPEI-T12-OF-C0FD5BBE')).toBe('Inferior a 38ºC');
    // El documento de explosiones es el Tema 41 del temario del INSST, no el «Tema 12».
    for (const c of TEMA8_RECALL_CARDS) expect(c.fuente).not.toMatch(/Tema 12 «Explosiones»/);
  });
});
