import { describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import { codigos, MAX_FICHAS_POR_CITA, norm, relacionar } from './relacionFichas';

const c = (id: string, tema: number, fuente: string, prompt = ''): RecallCard => ({ id, prompt, answer: '', fuente, deckId: `tema${tema}`, topicId: `tema${tema}` });
const CE = (id: string, art: number) => c(id, 1, `Constitución Española, Artículo ${art}, apdo. 1. BOE-A-1978-31229: https://www.boe.es/x · Constitución Española, Artículo ${art}, apdo. 1`);

describe('relacionar (criterios verificables)', () => {
  it('por artículo, exigiendo el mismo documento (antes bastaba el tema)', () => {
    const pool = [CE('a', 1), CE('b', 2), c('d', 1, 'Estatuto de Autonomía · Artículo 1')];
    const r = relacionar({ tema: { numero: 1 }, fuente: 'Constitución Española, art. 1.1' }, pool);
    expect(r).toMatchObject({ criterio: 'articulo', causa: null });
    expect(r.fichas.map((x) => x.id)).toEqual(['a']);
  });

  it('por la misma localización literal normalizada (página/hoja) y el mismo documento', () => {
    const doc = 'PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023)';
    const pool = [c('p1', 40, `${doc} · PDF p. 23 (Hoja 16)`), c('p2', 40, `${doc} · PDF p. 24 (Hoja 17)`), c('p3', 40, `PT01 Conducción · PDF p. 23 (Hoja 16)`)];
    const r = relacionar({ tema: { numero: 40 }, fuente: `${doc} — PDF  p. 23 (hoja 16).` }, pool);
    expect(r).toMatchObject({ criterio: 'localizacion' });
    expect(r.fichas.map((x) => x.id)).toEqual(['p1']);
  });

  it('cita demasiado amplia: se acota por el mismo código de carretera; si no, no relaciona', () => {
    const doc = 'Decreto 98/2008, catálogo';
    const pool = Array.from({ length: MAX_FICHAS_POR_CITA + 3 }, (_, i) => c(`r${i}`, 35, `${doc} · Decreto 98/2008, anexo`, `¿Qué categoría tiene la EX-${100 + i}?`));
    const q = { tema: { numero: 35 }, fuente: `${doc} — Decreto 98/2008, anexo` };
    expect(relacionar({ ...q, question: '¿Cuál es el itinerario de la EX-100?' }, pool)).toMatchObject({ criterio: 'codigo', fichas: [pool[0]] });
    expect(relacionar({ ...q, question: 'Sin código' }, pool)).toMatchObject({ fichas: [], causa: 'cita_amplia' });
  });

  it('causas: tema oculto, cita ilegible, sin ficha, sin tema', () => {
    const pool = [CE('a', 1)];
    expect(relacionar({ tema: { numero: 1 }, fuente: 'CE, art. 1' }, pool, () => false).causa).toBe('tema_oculto');
    expect(relacionar({ tema: { numero: 1 }, fuente: 'Constitución Española' }, pool).causa).toBe('cita_ilegible');
    expect(relacionar({ tema: { numero: 1 }, fuente: 'Constitución Española, art. 99' }, pool).causa).toBe('sin_ficha');
    expect(relacionar({ fuente: 'x' }, pool).causa).toBe('sin_tema');
  });

  it('normalización y códigos', () => {
    expect(norm('  PDF  p. 3 — Ánexo. ')).toBe('pdf p. 3 — anexo');
    expect([...codigos('La EX-100 y la BA-020; no «EX100»')]).toEqual(['EX-100', 'BA-020']);
  });
});
