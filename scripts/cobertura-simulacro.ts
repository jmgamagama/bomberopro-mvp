/** Genera docs/FICHAS_FALTAN_SIMULACRO.md. Uso: `npm run cobertura:simulacro`. No usa red. */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { INITIAL_QUESTIONS } from '../src/data/initialData';
import { getVisibleDecks, getVisibleTopics } from '../src/data/recallRegistry';
import { loadRecallPool } from '../src/data/recallCards';
import { COBERTURA_ANTES, coberturaSimulacro, informeMarkdown } from '../src/utils/coberturaSimulacro';

async function main() {
  const pool = await loadRecallPool(getVisibleDecks());
  const vis = new Set(getVisibleTopics().map((t) => t.id));
  const c = coberturaSimulacro(INITIAL_QUESTIONS, pool, (t) => vis.has(t));
  writeFileSync(resolve('docs/FICHAS_FALTAN_SIMULACRO.md'), informeMarkdown(c, COBERTURA_ANTES));
  console.log(`docs/FICHAS_FALTAN_SIMULACRO.md: ${c.con} de ${c.total} preguntas con ficha (${c.pct} %)`);
}
main().catch((e) => { console.error(e); process.exit(1); });
