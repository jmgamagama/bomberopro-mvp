import { describe, expect, it } from 'vitest';
import { matchesTopic } from './topicSearch';

describe('buscador de temas', () => {
  it('vacío: todos los temas', () => expect(matchesTopic('  ', 25, 'Mercancías peligrosas')).toBe(true));
  it('por número exacto, con o sin «T»/«tema»', () => {
    for (const q of ['25', 't25', 'T 25', 'tema 25']) expect(matchesTopic(q, 25, 'ADR')).toBe(true);
    expect(matchesTopic('2', 25, 'ADR')).toBe(false);
    expect(matchesTopic('25', 2, 'ADR')).toBe(false);
  });
  it('por palabras, sin tildes ni mayúsculas y en cualquier orden', () => {
    expect(matchesTopic('mercancias', 25, 'Mercancías peligrosas')).toBe(true);
    expect(matchesTopic('PELIGROSAS merc', 25, 'Mercancías peligrosas')).toBe(true);
    expect(matchesTopic('hidrantes', 25, 'Mercancías peligrosas')).toBe(false);
  });
});
