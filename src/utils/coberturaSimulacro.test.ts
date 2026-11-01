// Cobertura del simulacro de muestra (01/11/2026): antes 6/15 (40 %), ahora 15/15, y el informe al día.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { getVisibleDecks, getVisibleTopics } from '../data/recallRegistry';
import { loadRecallPool } from '../data/recallCards';
import { COBERTURA_ANTES, coberturaSimulacro, informeMarkdown } from './coberturaSimulacro';

describe('cobertura pregunta → ficha del simulacro de muestra', () => {
  it('todas las preguntas tienen ficha relacionada y docs/FICHAS_FALTAN_SIMULACRO.md está al día', async () => {
    const pool = await loadRecallPool(getVisibleDecks());
    const vis = new Set(getVisibleTopics().map((t) => t.id));
    const c = coberturaSimulacro(INITIAL_QUESTIONS, pool, (t) => vis.has(t));
    expect(c.total).toBe(INITIAL_QUESTIONS.length);
    expect(c.con).toBe(c.total);
    expect(c.con).toBeGreaterThan(COBERTURA_ANTES.con);
    // Ninguna relación es masiva: cada fallo lleva a un grupo concreto de fichas.
    expect(Math.max(...c.filas.map((f) => f.rel.fichas.length))).toBeLessThanOrEqual(12);
    expect(readFileSync(resolve('docs/FICHAS_FALTAN_SIMULACRO.md'), 'utf8')).toBe(informeMarkdown(c, COBERTURA_ANTES));
  });
});
