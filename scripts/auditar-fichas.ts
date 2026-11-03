/**
 * Genera docs/AUDITORIA_FICHAS.md: estado, fichas, % con enlace oficial y versión (huella
 * sha256) de cada mazo de recuerdo. Uso: `npm run auditar:fichas`. No usa red.
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { RECALL_DECKS, loadRawRecallDeckCards } from '../src/data/recallRegistry';
import { auditDeck, canonicalDeckContent, DECKS_SIN_ENLACE } from '../src/data/recallAudit';
import { SUPUESTOS } from '../src/data/supuestos/supuestosData';
import { getDeckRevision } from '../src/data/recallReview';
import { auditSupuestos, canonicalSupuestoContent } from '../src/data/supuestos/supuestosAudit';

const deckFingerprint = (content: string): string => createHash('sha256').update(content).digest('hex').slice(0, 16);

async function main() {
  const ids = new Map<string, string>();
  const rows: string[] = [];
  let problems = 0;
  for (const deck of RECALL_DECKS) {
    const cards = await loadRawRecallDeckCards(deck.id);
    const a = auditDeck(deck.id, deck.count, cards, ids);
    problems += a.problems.length;
    const link = cards.length ? `${Math.round((a.withLink / cards.length) * 100)} %` : '—';
    const nota = DECKS_SIN_ENLACE[deck.id] ? 'sin enlace público' : '';
    rows.push(`| ${deck.id} | ${deck.revision} | ${cards.length} | ${link} | ${a.problems.length} | \`${deckFingerprint(canonicalDeckContent(cards))}\` | ${nota} |`);
  }
  const supIssues = auditSupuestos(SUPUESTOS);
  const supRows = SUPUESTOS.map((sp) => {
    const n = supIssues.filter((i) => i.supuestoId === sp.id).length;
    const calc = sp.preguntas.filter((p) => p.tipo === 'calculo').length;
    return `| ${sp.id} | ${getDeckRevision(sp.id)} | ${sp.temas.map((t) => `T${t}`).join(', ')} | ${sp.preguntas.length} | ${calc} | ${n} | \`${deckFingerprint(canonicalSupuestoContent(sp))}\` |`;
  });
  const md = `# Auditoría editorial automática de las fichas

Generado con \`npm run auditar:fichas\` (scripts/auditar-fichas.ts). **No editar a mano.**

Reglas (src/data/recallAudit.ts): campos obligatorios (id, concepto, respuesta, fuente y localización), ids únicos en todo el registro, sin conceptos repetidos, enlaces solo de dominios oficiales, y los mazos sin enlace deben estar declarados.

**Versión** = huella sha256 (16 caracteres) del contenido del mazo. Si cambia una ficha de un mazo **revisado**, el test \`recallAudit.test.ts\` falla hasta que se regenere este informe. Así cada cambio en contenido publicado queda visible en el diff y hay que revisarlo.

Problemas detectados: **${problems}**.

| Mazo | Revisión | Fichas | Con enlace oficial | Problemas | Versión | Nota |
|---|---|---:|---:|---:|---|---|
${rows.join('\n')}

## Supuestos prácticos

Reglas (src/data/supuestos/supuestosAudit.ts): enunciado, temas de la parte específica (8-40), autoría «original», y en cada pregunta explicación, localización y fuente con enlace oficial (o educativo público admitido solo para fórmulas de física e hidráulica general sin fuente oficial: openstax.org, riunet.upv.es, recursos.edu.xunta.gal); test con 4 opciones distintas y una correcta; cálculo con fórmula y pasos cuya operación se recalcula y coincide con el resultado. Revisión por id en src/data/recallReview.ts (pendiente si no figura).

Problemas detectados: **${supIssues.length}**.

| Supuesto | Revisión | Temas | Preguntas | De cálculo | Problemas | Versión |
|---|---|---|---:|---:|---:|---|
${supRows.join('\n')}
`;
  writeFileSync(resolve(__dirname, '../docs/AUDITORIA_FICHAS.md'), md);
  console.log(`docs/AUDITORIA_FICHAS.md: ${RECALL_DECKS.length} mazos, ${problems} problemas; ${SUPUESTOS.length} supuestos, ${supIssues.length} problemas`);
}

main();
