import { describe, expect, it } from 'vitest';
import { recommendTopic, summarizeByTopic } from './examReport';

const t = (numero: number) => ({ numero, titulo: `Tema ${numero}` });
describe('informe del simulacro por tema', () => {
  it('agrupa por tema, cuenta fallos y blancos y ordena por lo no acertado', () => {
    const s = summarizeByTopic([
      { tema: t(1), answered: true, correct: true },
      { tema: t(35), answered: true, correct: false },
      { tema: t(35), answered: false, correct: false },
      { tema: t(38), answered: true, correct: false },
      { tema: null, answered: true, correct: false },
    ]);
    expect(s[0]).toMatchObject({ numero: 35, total: 2, incorrect: 1, blank: 1, correct: 0 });
    expect(s.map((x) => x.numero)).toEqual([35, 38, null, 1]);
    expect(recommendTopic(s)?.numero).toBe(35);
  });
  it('sin fallos no recomienda nada', () => {
    expect(recommendTopic(summarizeByTopic([{ tema: t(2), answered: true, correct: true }]))).toBeNull();
  });
});
