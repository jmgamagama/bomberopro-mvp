import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA16_RECALL_CARDS, TEMA16_RECALL_META } from './tema16Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema16/tema16_fichas_oaci_uit_48.json'), 'utf-8'),
) as {
  tema: number;
  estado: string;
  entran_tras_filtro: number;
  muestra_revisada: Array<{ id: string; veredicto: string }>;
  fichas: Array<{ id: string; orden: number; concepto: string; respuesta: string; fuente: string }>;
};

/** Apéndice 14 del Reglamento de Radiocomunicaciones de la UIT (= alfabeto OACI, Anexo 10 vol. II). */
const AP14: Record<string, string> = {
  A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India',
  J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo',
  S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
};

describe('tema 16 · subconjunto OACI/UIT', () => {
  it('carga exactamente las 48 fichas revisadas del JSON de calidad', () => {
    expect(TEMA16_RECALL_META).toMatchObject({ tema: 16, count: 48 });
    expect(fichasJson).toMatchObject({ tema: 16, estado: 'cargado', entran_tras_filtro: 48 });
    expect(TEMA16_RECALL_CARDS).toHaveLength(48);
    const json = [...fichasJson.fichas].sort((a, b) => a.orden - b.orden);
    expect(TEMA16_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      json.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
  });

  it('todas las fichas se revisaron una a una y todas son OK', () => {
    expect(fichasJson.muestra_revisada).toHaveLength(48);
    expect(fichasJson.muestra_revisada.every((r) => r.veredicto === 'OK')).toBe(true);
    expect(new Set(fichasJson.muestra_revisada.map((r) => r.id))).toEqual(new Set(TEMA16_RECALL_CARDS.map((c) => c.id)));
  });

  it('solo fuentes OACI/UIT, ids del tema 16 y sin duplicados', () => {
    expect(TEMA16_RECALL_CARDS.every((c) => /OACI|UIT/.test(c.fuente) && c.id.startsWith('CPEI-T16-'))).toBe(true);
    expect(new Set(TEMA16_RECALL_CARDS.map((c) => c.id)).size).toBe(48);
    expect(new Set(TEMA16_RECALL_CARDS.map((c) => c.concepto)).size).toBe(48);
  });

  it('el alfabeto coincide letra a letra con el apéndice 14 del RR', () => {
    const letras = TEMA16_RECALL_CARDS.flatMap((c) => {
      const m = c.concepto.match(/^¿Cómo se deletrea la letra ([A-Z]) en ICAO\?$/);
      return m ? [[m[1], c.respuesta] as const] : [];
    });
    expect(letras).toHaveLength(26);
    for (const [letra, palabra] of letras) expect(palabra).toBe(AP14[letra]);
  });

  it('ninguna pregunta queda sin sujeto', () => {
    expect(TEMA16_RECALL_CARDS.some((c) => /^¿(Cuándo se emplea|Qué tráfico prevalece|Cuándo usar ICAO)\?$/.test(c.concepto))).toBe(false);
  });

  it('se registra como mazo bajo demanda', async () => {
    expect(getRecallDeck('tema16').count).toBe(48);
    expect(await loadRecallDeckCards('tema16')).toBe(TEMA16_RECALL_CARDS);
  });
});
