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

// T36 (01/11/2026): cada ficha de los lotes 01 a 08 está revisada o retirada con motivo; no queda ninguna «sin verificar».
// Cotejo en directo: scripts/verificar-t36-fuentes.py (INE tabla 2859 e IGN, WFS de Unidades Administrativas).
describe('Tema 36: ninguna ficha queda pendiente de verificar', () => {
  const VISIBLES: Record<string, number> = {
    'tema36-lote01': 56, 'tema36-lote02': 40, 'tema36-lote03': 40, 'tema36-lote04': 39,
    'tema36-lote05': 25, 'tema36-lote06': 55, 'tema36-lote07': 55, 'tema36-lote08': 55,
  };
  const FICHA_META = 'CPEI-T36-S03-887722957A';

  it('cada ficha está revisada o fuera del epígrafe, y las cifras por lote no cambian sin querer', async () => {
    let visibles = 0;
    let total = 0;
    for (const [deck, esperadas] of Object.entries(VISIBLES)) {
      const raw = await loadRawRecallDeckCards(deck);
      total += raw.length;
      for (const c of raw) {
        const revisada = isCardReviewedInPendingDeck(deck, c.id);
        const retirada = isCardOutOfSyllabus(c.id);
        expect(revisada !== retirada, `${deck} ${c.id}`).toBe(true);
      }
      expect(reviewedCardCount(deck), deck).toBe(esperadas);
      visibles += esperadas;
    }
    expect(total).toBe(531);
    expect(visibles).toBe(365);
  });

  it('las retiradas son solo los códigos INE (fuera del epígrafe) y la ficha meta', async () => {
    let codigos = 0;
    for (const deck of Object.keys(VISIBLES)) {
      for (const c of await loadRawRecallDeckCards(deck)) {
        if (!isCardOutOfSyllabus(c.id)) continue;
        if (c.id === FICHA_META) continue;
        expect(c.concepto, c.id).toMatch(/código INE del municipio/);
        codigos++;
      }
    }
    expect(codigos).toBe(165);
  });
});
