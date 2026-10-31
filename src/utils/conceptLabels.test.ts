import { describe, expect, it } from 'vitest';
import { conceptTopicLabel, formatArticle } from './conceptLabels';

describe('conceptLabels', () => {
  it('usa el tema de la pregunta y, si no, el número del id', () => {
    expect(conceptTopicLabel('X', [{ microconcept_id: 'X', tema: { numero: 38, titulo: 'ITF' } }])).toBe('T38 · ITF');
    expect(conceptTopicLabel('CPEI-T35-S01-ABC')).toBe('Tema 35');
    expect(conceptTopicLabel('MC-ART1-001')).toBe('Constitución Española');
  });
  it('formatea artículos sin anteponer «Art.» a páginas o normas', () => {
    expect(formatArticle('1.1')).toBe('Art. 1.1');
    expect(formatArticle('PDF p. 7')).toBe('PDF p. 7');
    expect(formatArticle(undefined)).toBe('');
  });
});
