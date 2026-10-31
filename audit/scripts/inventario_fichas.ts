// Inventario reproducible de las fichas de recuerdo (src/data/*Recall.ts) vía el registro central.
// Uso: npx vite-node audit/scripts/inventario_fichas.ts > /tmp/fichas.json
import { RECALL_DECKS, loadRecallDeckCards, RECALL_TOTAL_CARDS } from '../../src/data/recallRegistry';
const out: any[] = [];
for (const d of RECALL_DECKS) {
  const cards = await loadRecallDeckCards(d.id);
  out.push({ deck: d.id, tema: d.tema, revision: d.revision, metaCount: d.count, real: cards.length,
    sinFuente: cards.filter(c => !c.fuente?.trim()).length, sinLocalizacion: cards.filter(c => !c.localizacion?.trim()).length });
}
console.log(JSON.stringify({ total_meta: RECALL_TOTAL_CARDS, decks: out }));
