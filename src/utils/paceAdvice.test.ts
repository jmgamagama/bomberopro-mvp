// Consejo honesto y motivador cuando el ritmo necesario no cabe en el tiempo elegido.
import { describe, expect, it } from 'vitest';
import { CONVOCATORIA_CPEI_2026 } from '../data/convocatoria';
import { HEAVY_PACE_CARDS, computeExamPace, describePaceAdvice, paceLimit } from './studyPlan';

const hoy = new Date(2026, 9, 17, 12);
const pace = (remaining: number, date = '2026-10-27') => computeExamPace(date, remaining, hoy); // 10 días

describe('consejo de ritmo', () => {
  it('el peso de los temas viene de las bases (no se inventa)', () => {
    const p = CONVOCATORIA_CPEI_2026.pesoTemasLocales;
    expect(p.texto).toBe(`El ${p.porcentaje} % de las preguntas del test versa sobre los temas ${p.temaDesde} a ${p.temaHasta}.`);
  });

  it('sin aviso si el ritmo cabe, sin fecha, en fecha pasada o con todo consolidado', () => {
    const base = { minutes: null, sessionSize: 30, cardsAt30: 45 };
    expect(describePaceAdvice({ ...base, pace: pace(400) })).toBeNull(); // 40/día = límite
    expect(describePaceAdvice({ ...base, pace: computeExamPace(null, 999, hoy) })).toBeNull();
    expect(describePaceAdvice({ ...base, pace: computeExamPace('2026-10-01', 999, hoy) })).toBeNull();
    expect(describePaceAdvice({ ...base, pace: pace(0) })).toBeNull();
    expect(describePaceAdvice({ ...base, minutes: 10, sessionSize: 15, pace: pace(150) })).toBeNull();
  });

  it('límite: lo que cabe en los minutos elegidos o unas 40 fichas', () => {
    expect(paceLimit(null, 30)).toBe(HEAVY_PACE_CARDS);
    expect(paceLimit(10, 15)).toBe(15);
  });

  it('con minutos y tema prioritario: céntrate en él y sube a 30 min', () => {
    const msg = describePaceAdvice({
      pace: pace(804),
      minutes: 10,
      sessionSize: 15,
      cardsAt30: 45,
      preferred: { label: 'el tema 40', remaining: 213 },
      weighted: { remaining: 710 },
    });
    expect(msg).toBe(
      'Es un ritmo alto: con 10 min al día caben unas 15 fichas. No hace falta llegar a todo para avanzar. ' +
        'Céntrate primero en el tema 40: te quedan 213 fichas, unas 22 al día. ' +
        'Si puedes, sube a 30 min al día (unas 45 fichas). Cada repaso cuenta.',
    );
  });

  it('sin tema prioritario: temas 35 a 40 con el dato oficial de las bases', () => {
    const msg = describePaceAdvice({ pace: pace(804), minutes: null, sessionSize: 30, cardsAt30: 45, weighted: { remaining: 710 } });
    expect(msg).toBe(
      'Es un ritmo alto: más de 40 fichas al día cuesta mantenerlo. No hace falta llegar a todo para avanzar. ' +
        'Empieza por los temas 35 a 40, que según las bases son el 30 % de las preguntas del test: te quedan 710 fichas, unas 71 al día. ' +
        'Elige uno como tema prioritario. Cada repaso cuenta.',
    );
  });

  it('sin tema prioritario ni temas con peso disponibles: elegir un tema; con 30 min no sugiere subir', () => {
    const msg = describePaceAdvice({ pace: pace(804), minutes: 30, sessionSize: 45, cardsAt30: 45, weighted: { remaining: 0 } });
    expect(msg).toBe(
      'Es un ritmo alto: con 30 min al día caben unas 45 fichas. No hace falta llegar a todo para avanzar. ' +
        'Elige un tema prioritario para avanzar por partes. Cada repaso cuenta.',
    );
  });
});

describe('filtro de medición del tiempo por ficha', () => {
  it('measuredElapsedMs: solo entre 3 s y 5 min', async () => {
    const { measuredElapsedMs, TIMED_MIN_MS, TIMED_MAX_MS } = await import('./recallReviewLog');
    expect(measuredElapsedMs(0, TIMED_MIN_MS - 1)).toBeUndefined();
    expect(measuredElapsedMs(0, TIMED_MIN_MS)).toBe(3_000);
    expect(measuredElapsedMs(0, TIMED_MAX_MS)).toBe(300_000);
    expect(measuredElapsedMs(0, TIMED_MAX_MS + 1)).toBeUndefined();
    expect(measuredElapsedMs(10, 5)).toBeUndefined();
  });
});
