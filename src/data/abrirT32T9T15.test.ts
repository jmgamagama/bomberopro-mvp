import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TEMA32_RECALL_CARDS } from './tema32Recall';
import { TEMA9_RECALL_CARDS } from './tema9Recall';
import { TEMA15_RECALL_CARDS } from './tema15Recall';
import { getDeckRevision } from './recallReview';
import { isCardVisible } from './recallRegistry';

/** Comprobación literal del 01/11/2026 (scripts/verificar-fichas-literal.py): solo se ven las fichas «ok». */
const V = JSON.parse(readFileSync(resolve(__dirname, '../../data/verificacion/abrir-t32-t9-t15.json'), 'utf8')) as {
  mazos: Record<string, { id: string; estado: string }[]>;
};
const MAZOS = { tema32: TEMA32_RECALL_CARDS, tema9: TEMA9_RECALL_CARDS, tema15: TEMA15_RECALL_CARDS } as const;
const ACEPTADA = /https:\/\/www\.(boe\.es\/buscar\/act\.php\?id=BOE-A-\d{4}-\d+#[\w-]+|codigotecnico\.org\/pdf\/Documentos\/\w+\/DB\w+\.pdf#page=\d+)/;

describe('T32, T9 y T15: se abren solo las fichas literales con fuente aceptada', () => {
  it.each(Object.keys(MAZOS))('%s: la verificación cubre todas sus fichas', (m) => {
    // T32 se publica entero; T9 y T15 siguen pendientes y solo viajan en el bundle sus fichas abiertas.
    expect(getDeckRevision(m)).toBe(m === 'tema32' ? 'revisado' : 'pendiente');
    expect(V.mazos[m].map((x) => x.id).sort()).toEqual(MAZOS[m as keyof typeof MAZOS].map((c) => c.id).sort());
  });
  it('cuántas se abren: T32 91 de 91, T9 17 de 84, T15 36 de 92', () => {
    const vistas = (m: keyof typeof MAZOS) => MAZOS[m].filter((c) => isCardVisible(m, c.id)).length;
    expect([vistas('tema32'), vistas('tema9'), vistas('tema15')]).toEqual([91, 17, 36]);
  });
  it.each(Object.keys(MAZOS))('%s: visible ⇔ «ok» en la comprobación literal, con cita y enlace a BOE o CTE', (m) => {
    const estado = new Map(V.mazos[m].map((x) => [x.id, x.estado]));
    for (const c of MAZOS[m as keyof typeof MAZOS]) {
      const visible = isCardVisible(m, c.id);
      expect(visible, c.id).toBe(estado.get(c.id) === 'ok');
      if (visible) expect(c.fuente, c.id).toMatch(ACEPTADA);
    }
  });
  it('ninguna ficha visible cita al INSST, al IDAE/MITECO ni a EUR-Lex', () => {
    for (const [m, cards] of Object.entries(MAZOS)) {
      for (const c of cards.filter((x) => isCardVisible(m, x.id))) expect(c.fuente).not.toMatch(/insst|miteco|idae|eur-lex/i);
    }
  });
});
