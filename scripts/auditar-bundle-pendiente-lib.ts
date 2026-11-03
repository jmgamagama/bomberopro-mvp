interface PublicAsset {
  path: string;
  content: string;
}

export interface RecallCardPayload {
  id: string;
  concepto: string;
  respuesta: string;
}

export interface PendingCardLeak {
  deckId: string;
  cardId: string;
  assetPath: string;
}

/**
 * Busca el registro completo de una ficha pendiente en cada archivo público.
 * Los IDs por sí solos pueden aparecer en las listas de revisión/cuarentena y no revelan la ficha.
 */
export function findPendingCardLeaks(
  cards: readonly { deckId: string; card: RecallCardPayload }[],
  assets: readonly PublicAsset[],
): PendingCardLeak[] {
  const leaks: PendingCardLeak[] = [];

  for (const { deckId, card } of cards) {
    if (!card.id || !card.concepto || !card.respuesta) continue;
    for (const asset of assets) {
      if (
        asset.content.includes(card.id) &&
        asset.content.includes(card.concepto) &&
        asset.content.includes(card.respuesta)
      ) {
        leaks.push({ deckId, cardId: card.id, assetPath: asset.path });
      }
    }
  }

  return leaks;
}
