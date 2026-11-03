import { describe, expect, it } from 'vitest';
import { findPendingCardLeaks } from './auditar-bundle-pendiente-lib';

describe('auditoría del bundle público de fichas pendientes', () => {
  const pending = {
    deckId: 'tema-ejemplo',
    card: { id: 'CARD-001', concepto: 'Pregunta pendiente completa', respuesta: 'Respuesta pendiente completa' },
  };

  it('detecta una ficha completa en un artefacto público', () => {
    expect(findPendingCardLeaks([pending], [{
      path: 'dist/assets/index.js',
      content: 'CARD-001 Pregunta pendiente completa Respuesta pendiente completa',
    }])).toEqual([{ deckId: 'tema-ejemplo', cardId: 'CARD-001', assetPath: 'dist/assets/index.js' }]);
  });

  it('no considera una fuga un ID que aparece solo en metadatos de revisión', () => {
    expect(findPendingCardLeaks([pending], [{
      path: 'dist/assets/index.js',
      content: 'CARD-001',
    }])).toEqual([]);
  });

  it('no combina ID, pregunta y respuesta repartidos entre archivos distintos', () => {
    expect(findPendingCardLeaks([pending], [
      { path: 'dist/assets/review.js', content: 'CARD-001' },
      { path: 'dist/assets/ui.js', content: 'Pregunta pendiente completa Respuesta pendiente completa' },
    ])).toEqual([]);
  });
});
