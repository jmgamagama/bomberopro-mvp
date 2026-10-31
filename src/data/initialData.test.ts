// Banco público local (simulacro de invitado): reparto por temas y calidad del formato test.
import { describe, expect, it } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from './initialData';
import { getDeckRevision } from './recallReview';
import { TEMA35_RECALL_CARDS } from './tema35Recall';
import { TEMA38_RECALL_CARDS } from './tema38Recall';
import { TEMA39_RECALL_CARDS } from './tema39Recall';
import { TEMA40_RECALL_CARDS } from './tema40Recall';

const CARDS = new Map([...TEMA35_RECALL_CARDS, ...TEMA38_RECALL_CARDS, ...TEMA39_RECALL_CARDS, ...TEMA40_RECALL_CARDS].map(c => [c.id, c]));
const norm = (s: string) => s.trim().replace(/\.$/, '').toLowerCase();

describe('INITIAL_QUESTIONS', () => {
  it('15 preguntas: 10 de los temas 35-40 (sin el 37) y 5 del resto', () => {
    expect(INITIAL_QUESTIONS).toHaveLength(15);
    const locales = INITIAL_QUESTIONS.filter(q => (q.tema?.numero ?? 0) >= 35);
    expect(locales).toHaveLength(10);
    const porTema = locales.reduce<Record<number, number>>((m, q) => ({ ...m, [q.tema!.numero]: (m[q.tema!.numero] ?? 0) + 1 }), {});
    expect(porTema).toEqual({ 35: 3, 38: 2, 39: 2, 40: 3 });
    expect(porTema[37]).toBeUndefined();
    expect(new Set(INITIAL_QUESTIONS.map(q => q.id)).size).toBe(15);
  });

  it('formato del examen: 3 opciones distintas, con la correcta entre ellas', () => {
    for (const q of INITIAL_QUESTIONS) {
      expect(q.options, q.id).toHaveLength(3);
      expect(new Set(q.options).size, q.id).toBe(3);
      expect(q.options, q.id).toContain(q.correct_answer);
      expect(q.fuente, q.id).toBeTruthy();
      expect(INITIAL_MICROCONCEPTS.some(m => m.id === q.microconcept_id), q.id).toBe(true);
    }
  });

  it('las de los temas 35-40 salen de fichas revisadas, con su respuesta y su fuente', () => {
    for (const q of INITIAL_QUESTIONS.filter(x => (x.tema?.numero ?? 0) >= 35)) {
      const card = CARDS.get(q.microconcept_id);
      expect(card, q.id).toBeDefined();
      expect(getDeckRevision(`tema${q.tema!.numero}`), q.id).toBe('revisado');
      expect(norm(card!.respuesta), q.id).toBe(norm(q.correct_answer));
      expect(q.fuente, q.id).toContain(card!.fuente);
      expect(q.fuente, q.id).toContain(card!.localizacion);
    }
  });

  it('la longitud no delata la correcta: es la más larga (sin empate) en el 40 % o menos', () => {
    const masLarga = INITIAL_QUESTIONS.filter(q => {
      const L = q.options!.map(o => o.length);
      const max = Math.max(...L);
      return q.correct_answer.length === max && L.filter(l => l === max).length === 1;
    });
    expect(masLarga.length / INITIAL_QUESTIONS.length).toBeLessThanOrEqual(0.4);
  });

  it('ninguna pregunta del tema 39 sale del SOS «Módulo de personal» (fuera del epígrafe)', () => {
    for (const q of INITIAL_QUESTIONS) expect(q.fuente ?? '', q.id).not.toMatch(/Módulo de personal/);
  });

  it('todas tienen tema del anexo I', () => {
    for (const q of INITIAL_QUESTIONS) expect(q.tema?.numero, q.id).toBeGreaterThanOrEqual(1);
  });

  it('la posición de la correcta varía', () => {
    const pos = new Set(INITIAL_QUESTIONS.map(q => q.options!.indexOf(q.correct_answer)));
    expect(pos.size).toBe(3);
  });
});
