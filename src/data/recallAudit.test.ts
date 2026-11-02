// Auditoría editorial automática de todas las fichas de recuerdo y versión de los mazos publicados.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { RECALL_DECKS, loadRawRecallDeckCards, type RecallSourceCard } from './recallRegistry';
import { DECKS_SIN_ENLACE, auditDeck, canonicalDeckContent, citedUrls, isOfficialUrl } from './recallAudit';

const fingerprint = (cards: readonly RecallSourceCard[]) =>
  createHash('sha256').update(canonicalDeckContent(cards)).digest('hex').slice(0, 16);

const card = (over: Partial<RecallSourceCard>): RecallSourceCard => ({
  id: 'X-1',
  orden: 1,
  concepto: '¿Pregunta de prueba?',
  respuesta: 'respuesta de prueba',
  fuente: 'Norma de prueba https://www.boe.es/x',
  localizacion: 'art. 1',
  apartado: 'a',
  ...over,
});

describe('reglas de auditoría', () => {
  it('detecta campos vacíos, ids repetidos, conceptos repetidos y enlaces no oficiales', () => {
    const ids = new Map([['X-9', 'otro-mazo']]);
    const a = auditDeck(
      'prueba',
      4,
      [
        card({}),
        card({ id: 'X-2', concepto: '¿Segunda?', fuente: '' }),
        card({ id: 'X-9', concepto: '¿Otra?', localizacion: ' ' }),
        card({ id: 'X-4', concepto: '¿pregunta de prueba?', fuente: 'Blog https://ejemplo.com/a' }),
      ],
      ids,
    );
    expect(a.problems).toEqual([
      'X-2: sin fuente',
      'X-9: sin localización (artículo, página o apartado)',
      'X-9: id repetido (también en otro-mazo)',
      'X-4: concepto repetido en el mazo',
      'X-4: enlace no oficial https://ejemplo.com/a',
    ]);
  });

  it('exige declarar los mazos sin ningún enlace oficial', () => {
    const a = auditDeck('mazo-nuevo', 1, [card({ fuente: 'Documento sin enlace' })]);
    expect(a.problems).toEqual(['ninguna ficha cita enlace oficial y el mazo no consta en DECKS_SIN_ENLACE']);
    expect(isOfficialUrl('https://transparencia.dip-badajoz.es/x')).toBe(true);
    expect(isOfficialUrl('https://boe.es.ejemplo.com/x')).toBe(false);
  });
});

describe('todas las fichas del registro', () => {
  it('pasan la auditoría sin problemas', async () => {
    const ids = new Map<string, string>();
    const problems: string[] = [];
    for (const deck of RECALL_DECKS) {
      const a = auditDeck(deck.id, deck.count, await loadRawRecallDeckCards(deck.id), ids);
      problems.push(...a.problems.map((p) => `${deck.id}: ${p}`));
    }
    expect(problems).toEqual([]);
  });

  it('la lista de mazos sin enlace está al día (sin entradas sobrantes)', async () => {
    const ids = new Set(RECALL_DECKS.map((d) => d.id));
    for (const id of Object.keys(DECKS_SIN_ENLACE)) {
      expect(ids.has(id), id).toBe(true);
      const cards = await loadRawRecallDeckCards(id);
      expect(cards.some((c) => citedUrls(c).length > 0), id).toBe(false);
    }
  });

  it('la versión de cada mazo revisado coincide con docs/AUDITORIA_FICHAS.md (regenerar con npm run auditar:fichas)', async () => {
    const doc = readFileSync(resolve(__dirname, '../../docs/AUDITORIA_FICHAS.md'), 'utf-8');
    for (const deck of RECALL_DECKS) {
      const row = doc.split('\n').find((l) => l.startsWith(`| ${deck.id} |`));
      expect(row, `${deck.id} falta en el informe`).toBeDefined();
      if (deck.revision !== 'revisado') continue;
      expect(row, `${deck.id}: contenido publicado cambiado sin regenerar el informe`).toContain(
        `\`${fingerprint(await loadRawRecallDeckCards(deck.id))}\``,
      );
    }
  });
});
