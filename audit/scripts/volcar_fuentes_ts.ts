// Vuelca a JSON (stdout) las fichas de recuerdo de todos los mazos y las 15 preguntas del prototipo (initialData.ts).
// Uso: npx vite-node audit/scripts/volcar_fuentes_ts.ts > /tmp/fuentes_ts.json
import { RECALL_DECKS, loadRecallDeckCards } from '../../src/data/recallRegistry';
import { INITIAL_QUESTIONS, INITIAL_MICROCONCEPTS } from '../../src/data/initialData';
const fichas: any[] = [];
for (const d of RECALL_DECKS) for (const c of await loadRecallDeckCards(d.id))
  fichas.push({ deck: d.id, tema: d.tema, revision: d.revision, ...c });
console.log(JSON.stringify({ fichas, initialQuestions: INITIAL_QUESTIONS, initialMicro: INITIAL_MICROCONCEPTS }));
