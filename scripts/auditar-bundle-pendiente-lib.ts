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
  assetPaths: string[];
}

/**
 * Busca si los tres campos de una ficha pendiente aparecen en el conjunto de archivos públicos.
 * Vite puede repartir módulos entre chunks; la separación física entre archivos no hace que el
 * contenido deje de ser descargable o reconstruible por el navegador.
 */
export function findPendingCardLeaks(
  cards: readonly { deckId: string; card: RecallCardPayload }[],
  assets: readonly PublicAsset[],
): PendingCardLeak[] {
  const leaks: PendingCardLeak[] = [];

  for (const { deckId, card } of cards) {
    if (!card.id || !card.concepto || !card.respuesta) continue;
    const fields = [card.id, card.concepto, card.respuesta];
    const fieldAssets = fields.map((field) => assets.filter((asset) => asset.content.includes(field)));
    if (fieldAssets.some((matches) => matches.length === 0)) continue;

    leaks.push({
      deckId,
      cardId: card.id,
      assetPaths: [...new Set(fieldAssets.flatMap((matches) => matches.map(({ path }) => path)))].sort(),
    });
  }

  return leaks;
}
