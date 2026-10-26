// Imprime (JSON) los ids de fichas de mazos NO revisados. Uso: npx vite-node audit/checks/C_seguridad/fichas_pendientes.ts
import { RECALL_DECKS, loadRecallDeckCards } from '../../../src/data/recallRegistry';
const out: { deck: string; revision: string; ids: string[] }[] = [];
for (const d of RECALL_DECKS) {
  if (d.revision === 'revisado') continue;
  const cards = await loadRecallDeckCards(d.id);
  out.push({ deck: d.id, revision: d.revision, ids: cards.map((c: { id: string }) => c.id) });
}
process.stdout.write(JSON.stringify(out));
