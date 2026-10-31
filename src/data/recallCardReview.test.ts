// @vitest-environment jsdom
// Fichas revisadas sueltas dentro de un mazo pendiente: el alumno ve solo esas; el propietario, todo.
import '../test/setup';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  REVIEWED_CARDS_IN_PENDING_DECKS,
  isCardOutOfSyllabus,
  isCardReviewedInPendingDeck,
  reviewedCardCount,
} from './recallCardReview';
import {
  REVIEWED_RECALL_DECKS,
  getRecallDeck,
  getVisibleDecks,
  isDeckVisible,
  loadRawRecallDeckCards,
  loadRecallDeckCards,
} from './recallRegistry';
import { setRevisionViewer } from '../utils/revisionAccess';

const LOTE = 'tema36-lote01';

beforeEach(() => {
  window.localStorage.clear();
  setRevisionViewer(null);
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', '');
  vi.stubEnv('VITE_REVISION_OWNERS', '');
});
afterEach(() => {
  setRevisionViewer(null);
  vi.unstubAllEnvs();
});

describe('fichas revisadas sueltas', () => {
  it('solo se declaran en mazos pendientes, existen y no están fuera del epígrafe', async () => {
    for (const [deck, ids] of Object.entries(REVIEWED_CARDS_IN_PENDING_DECKS)) {
      expect(getRecallDeck(deck).revision).toBe('pendiente');
      const raw = new Set((await loadRawRecallDeckCards(deck)).map((c) => c.id));
      for (const id of ids) {
        expect(raw.has(id), id).toBe(true);
        expect(isCardOutOfSyllabus(id), id).toBe(false);
      }
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('el mazo pendiente se publica al alumno como parcial, solo con sus fichas revisadas', async () => {
    const n = reviewedCardCount(LOTE);
    expect(n).toBeGreaterThan(0);
    const deck = REVIEWED_RECALL_DECKS.find((d) => d.id === LOTE);
    expect(deck).toMatchObject({ revision: 'revisado', parcial: true, count: n });
    expect(getRecallDeck(LOTE).revision).toBe('pendiente');
    expect(isDeckVisible(getRecallDeck(LOTE))).toBe(true);
    const cards = await loadRecallDeckCards(LOTE);
    expect(cards).toHaveLength(n);
    expect(cards.every((c) => isCardReviewedInPendingDeck(LOTE, c.id))).toBe(true);
  });

  it('una ficha sin revisar del mismo lote no llega al alumno', async () => {
    const raw = await loadRawRecallDeckCards(LOTE);
    const sinRevisar = raw.find((c) => !isCardReviewedInPendingDeck(LOTE, c.id))!;
    expect((await loadRecallDeckCards(LOTE)).some((c) => c.id === sinRevisar.id)).toBe(false);
  });

  it('el propietario ve el lote completo', async () => {
    vi.stubEnv('VITE_REVISION_OWNERS', 'owner-uuid');
    setRevisionViewer({ id: 'owner-uuid' });
    const raw = await loadRawRecallDeckCards(LOTE);
    expect(getVisibleDecks().find((d) => d.id === LOTE)?.parcial).toBeUndefined();
    expect(await loadRecallDeckCards(LOTE)).toHaveLength(raw.length);
  });
});
