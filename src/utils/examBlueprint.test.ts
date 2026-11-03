import { describe, expect, it } from 'vitest';
import { arrangeBlueprint, isLocalTopic } from './examBlueprint';
import { EXAM_DURATION_SECONDS } from './examTimer';

const q = (n: number, i: number) => ({ id: `${n}-${i}`, tema: { numero: n } });
// Lo que entrega get_blueprint_exam_questions: 38 de T1-34 y 17 de T35-40, en orden aleatorio.
const servidor = () => [...Array.from({ length: 38 }, (_, i) => q(1 + (i % 34), i)), ...Array.from({ length: 17 }, (_, i) => q(35 + (i % 6), i))];

describe('reparto del simulacro oficial (bases CPEI Badajoz 2026)', () => {
  it('55 preguntas y al menos el 30 % de T35-40 entre las 50 puntuables, con cualquier orden', () => {
    for (let seed = 0; seed < 200; seed++) {
      let s = seed + 1;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      const input = servidor().sort(() => rnd() - 0.5);
      const r = arrangeBlueprint(input, rnd);
      expect(r.questions).toHaveLength(55);
      expect(new Set(r.questions.map((x) => x.id)).size).toBe(55);
      expect(r.questions.slice(0, 50).filter(isLocalTopic).length).toBeGreaterThanOrEqual(15);
      expect(r.complete).toBe(true);
    }
  });
  it('si el banco no da para el 30 % lo marca como incompleto', () => {
    const r = arrangeBlueprint([...Array.from({ length: 50 }, (_, i) => q(2, i)), ...Array.from({ length: 5 }, (_, i) => q(36, i))]);
    expect(r.complete).toBe(false);
    expect(r.localScored).toBe(5);
  });
  it('temporizador oficial: 60 minutos', () => expect(EXAM_DURATION_SECONDS).toBe(3600));
});
