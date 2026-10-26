// C2, paso 2 (auditoría 2026-10-26): las preguntas del servidor llegan sin clave y se corrigen en él.
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { checkAnswer, fetchKeyless, gradeExam, hasLocalKey, toKeylessQuestion, withRevealedKey } from './secureQuestions';
import { isDeckBundled } from '../data/recallRegistry';

const local = INITIAL_QUESTIONS[0];
const keyless = toKeylessQuestion({ ...local, id: 7, respuesta_correcta: 'x', explicacion: 'y', correcta: 'a' });

describe('secureQuestions', () => {
  it('toKeylessQuestion quita toda clave y explicación', () => {
    expect(keyless.correct_answer).toBe('');
    expect(keyless.explanation).toBe('');
    expect(keyless.id).toBe('7');
    expect(Object.keys(keyless)).not.toEqual(expect.arrayContaining(['respuesta_correcta', 'explicacion', 'correcta']));
    expect(hasLocalKey(keyless)).toBe(false);
    expect(hasLocalKey(local)).toBe(true);
  });

  it('fetchKeyless descarta la clave aunque el servidor la enviara y propaga errores', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [local], error: null });
    const [q] = await fetchKeyless({ rpc }, 'get_exam_questions_v2', { p_seed: 0.3 });
    expect(rpc).toHaveBeenCalledWith('get_exam_questions_v2', { p_seed: 0.3 });
    expect(q.correct_answer).toBe('');
    const failing = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } });
    await expect(fetchKeyless({ rpc: failing }, 'get_study_session_v2', {})).rejects.toEqual({ message: 'boom' });
  });

  it('checkAnswer: muestra local en el navegador, sin clave en el servidor', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { acierto: true, correct_answer: 'A', explanation: 'E' }, error: null });
    const offline = await checkAnswer({ rpc }, local, local.correct_answer);
    expect(offline.correct).toBe(true);
    expect(rpc).not.toHaveBeenCalled();
    const remote = await checkAnswer({ rpc }, keyless, 'A');
    expect(rpc).toHaveBeenCalledWith('check_answer', { p_question_id: 7, p_respuesta: 'A' });
    expect(remote).toEqual({ questionId: '7', correct: true, correctAnswer: 'A', explanation: 'E' });
    expect(withRevealedKey(keyless, remote)).toMatchObject({ correct_answer: 'A', explanation: 'E' });
    await expect(checkAnswer(null, keyless, 'A')).resolves.toMatchObject({ correct: false });
  });

  it('gradeExam manda solo las preguntas sin clave y exige conexión para ellas', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { detalle: [{ question_id: '7', acierto: false, correct_answer: 'B', explanation: null }] }, error: null });
    const out = await gradeExam({ rpc }, [local, keyless], { [local.id]: local.correct_answer, '7': 'A' });
    expect(rpc).toHaveBeenCalledWith('grade_exam', { p_answers: [{ question_id: '7', respuesta: 'A' }] });
    expect(out[local.id].correct).toBe(true);
    expect(out['7']).toMatchObject({ correct: false, correctAnswer: 'B' });
    await expect(gradeExam(null, [keyless], {})).rejects.toThrow(/conexión/);
  });

  it('las pantallas ya no llaman a las RPC que devuelven la clave', () => {
    for (const f of ['../components/MockExam.tsx', '../components/StudyByTopic.tsx', '../components/TrainScreen.tsx', '../App.tsx']) {
      const src = readFileSync(new URL(f, import.meta.url), 'utf8');
      expect(src, f).not.toMatch(/rpc\(\s*'(get_blueprint_exam_questions|get_study_session|get_topic_study_questions)'/);
    }
  });
});

describe('C1: mazos empaquetados', () => {
  it('sin la bandera se empaqueta todo; con ella, solo los gratis', () => {
    expect(isDeckBundled('tema1', false)).toBe(true);
    expect(isDeckBundled('tema40', true)).toBe(true);
    expect(isDeckBundled('tema1', true)).toBe(false);
    expect(isDeckBundled('tema36-lote01', true)).toBe(false);
  });
});
