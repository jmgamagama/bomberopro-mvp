import { useEffect, useState } from 'react';
import { getLoadedDeckCards, loadRecallDeckCards, type RecallSourceCard } from '../data/recallRegistry';

export type DeckCardsState =
  | { status: 'loading'; cards: null }
  | { status: 'ready'; cards: readonly RecallSourceCard[] }
  | { status: 'error'; cards: null };

/** Fichas de un mazo, cargadas bajo demanda (import dinámico de su módulo). */
export function useRecallDeckCards(deckId: string): DeckCardsState {
  const [state, setState] = useState<{ id: string; value: DeckCardsState }>(() => {
    const cached = getLoadedDeckCards(deckId);
    return { id: deckId, value: cached ? { status: 'ready', cards: cached } : { status: 'loading', cards: null } };
  });

  useEffect(() => {
    let alive = true;
    const cached = getLoadedDeckCards(deckId);
    if (cached) {
      setState({ id: deckId, value: { status: 'ready', cards: cached } });
      return;
    }
    setState({ id: deckId, value: { status: 'loading', cards: null } });
    loadRecallDeckCards(deckId).then(
      (cards) => alive && setState({ id: deckId, value: { status: 'ready', cards } }),
      () => alive && setState({ id: deckId, value: { status: 'error', cards: null } }),
    );
    return () => {
      alive = false;
    };
  }, [deckId]);

  if (state.id !== deckId) {
    const cached = getLoadedDeckCards(deckId);
    return cached ? { status: 'ready', cards: cached } : { status: 'loading', cards: null };
  }
  return state.value;
}
