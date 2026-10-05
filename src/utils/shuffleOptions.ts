import type { Question } from '../types';

/**
 * Baraja el orden de las opciones de cada pregunta al mostrarla.
 *
 * Por qué: el banco se generó con IA y la opción correcta tiende a ir en primera
 * posición (a: 33 %, d: 12 % en el banco publicado; en algunos temas casi la mitad).
 * Si el orden es fijo, el alumno aprende la posición en vez del contenido.
 *
 * La corrección compara por texto (`option === correct_answer`), así que cambiar el
 * orden no altera qué respuesta es la buena.
 *
 * Las preguntas cuyas opciones se refieren a otras por su posición ("todas las
 * anteriores", "a y b son correctas"…) se dejan en su orden original, porque al
 * barajarlas dejarían de tener sentido.
 */
const POSITIONAL = /(anteriores|ambas|las dos|\b[a-d]\)?\s+(y|e|o)\s+[a-d]\b|respuestas?\s+[a-d]\b|opci[oó]n(es)?\s+[a-d]\b)/i;

export const hasPositionalOptions = (options: string[]): boolean =>
  options.some(o => POSITIONAL.test(o));

export function shuffleArray<T>(items: T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffleQuestionOptions<Q extends Pick<Question, 'options'>>(
  question: Q,
  random: () => number = Math.random,
): Q {
  const options = question.options;
  if (!options || options.length < 2 || hasPositionalOptions(options)) return question;
  return { ...question, options: shuffleArray(options, random) };
}

export function shuffleAllOptions<Q extends Pick<Question, 'options'>>(
  questions: Q[],
  random: () => number = Math.random,
): Q[] {
  return questions.map(q => shuffleQuestionOptions(q, random));
}
