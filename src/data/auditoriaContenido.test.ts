/** Regresiones de contenido de la auditoría 26/10/2026 (A-T29 y A-M035). */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RECALL_DECKS, loadRecallDeckCards } from './recallRegistry';

describe('A-T29 · ninguna ficha presenta como vigente una norma derogada', () => {
  it('quien cite el RD 407/1992 avisa de que está derogado por el RD 524/2023', async () => {
    const malas: string[] = [];
    for (const deck of RECALL_DECKS) {
      for (const c of await loadRecallDeckCards(deck.id)) {
        const txt = `${c.concepto} ${c.respuesta}`;
        if (/407\/1992/.test(txt) && !(/derogad/i.test(txt) && /524\/2023/.test(txt))) malas.push(c.id);
      }
    }
    expect(malas).toEqual([]);
  });
});

describe('A-M035 · la cita del art. 28.5 LPRL respalda la clave (ETT: formación y vigilancia de la salud)', () => {
  const data = JSON.parse(readFileSync(new URL('../../data/ley31-1995/capitulo-iii.json', import.meta.url), 'utf8'));
  const conceptos = Array.isArray(data) ? data : data.conceptos;
  const c = conceptos.find((x: { id: string }) => x.id === 'LPRL-a28-5-ett');
  it('la cita contiene la frase que da la clave de la N1', () => {
    expect(c.cita).toContain('La empresa de trabajo temporal será responsable del cumplimiento de las obligaciones en materia de formación y vigilancia de la salud');
    const n1 = c.preguntas.find((q: { nivel: number }) => q.nivel === 1);
    expect(n1.opciones[n1.correcta]).toBe('La empresa de trabajo temporal');
  });
  it('la cita sigue siendo literal del BOE consolidado (BOE-A-1995-24292, art. 28.5)', () => {
    const boe = readFileSync(new URL('../../data/fuentes/BOE-A-1995-24292/texto.md', import.meta.url), 'utf8').replace(/\s+/g, ' ');
    expect(boe).toContain(c.cita);
  });
});
