/**
 * Reparto del simulacro oficial según las bases (data/temario/cpei-badajoz-2026-anexo1.md):
 * 50 preguntas puntuables + 5 de reserva y «el 30 % de las preguntas … temas 35 a 40».
 * El servidor (get_blueprint_exam_questions, mig. 08) entrega 38 de T1-34 y 17 de T35-40 en orden
 * aleatorio; el cliente puntúa las 50 primeras, así que sin ordenar las reservas podían llevarse
 * preguntas de T35-40 y dejar las puntuables por debajo del 30 %. Aquí se fija el reparto.
 */
export const EXAM_SCORED_QUESTIONS = 50;
export const EXAM_RESERVE_QUESTIONS = 5;
export const EXAM_LOCAL_TOPICS_SHARE = 0.3;

type WithTema = { tema?: { numero: number } | null };
export const isLocalTopic = (q: WithTema) => !!q.tema && q.tema.numero >= 35 && q.tema.numero <= 40;

function shuffle<T>(a: T[], rnd: () => number): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export interface BlueprintResult<T> {
  questions: T[];
  /** Preguntas de T35-40 entre las puntuables y las que exige el 30 %. */
  localScored: number;
  localRequired: number;
  /** false si el banco no da para el examen completo o para el 30 % (se avisa al alumno). */
  complete: boolean;
}

export function arrangeBlueprint<T extends WithTema>(input: readonly T[], rnd: () => number = Math.random): BlueprintResult<T> {
  const scoredN = Math.min(EXAM_SCORED_QUESTIONS, input.length);
  const localRequired = Math.ceil(scoredN * EXAM_LOCAL_TOPICS_SHARE);
  const local = shuffle(input.filter(isLocalTopic), rnd);
  const general = shuffle(input.filter((q) => !isLocalTopic(q)), rnd);
  const localIn = Math.min(local.length, Math.max(localRequired, scoredN - general.length));
  const scored = shuffle([...local.slice(0, localIn), ...general.slice(0, scoredN - localIn)], rnd);
  const reserve = shuffle([...local.slice(localIn), ...general.slice(scoredN - localIn)], rnd);
  return {
    questions: [...scored, ...reserve],
    localScored: localIn,
    localRequired,
    complete: input.length >= EXAM_SCORED_QUESTIONS + EXAM_RESERVE_QUESTIONS && localIn >= localRequired,
  };
}
