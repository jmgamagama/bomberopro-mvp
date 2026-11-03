// @vitest-environment jsdom
// Fecha de examen prevista (la pone el alumno), por cuenta, y ritmo necesario.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from './localOwner';
import { CONVOCATORIA_CPEI_2026 } from '../data/convocatoria';
import {
  EXAM_DATE_STORAGE_KEY,
  computeExamPace,
  describeExamPace,
  getExamDate,
  isValidDateKey,
  setExamDate,
} from './studyPlan';

const hoy = new Date(2026, 9, 17, 12); // 17/10/2026

beforeEach(() => {
  window.localStorage.clear();
  resetLocalDataOwnerForTests();
  setLocalDataOwner('cuenta-a');
});
afterEach(() => resetLocalDataOwnerForTests());

describe('fecha de examen prevista', () => {
  it('la convocatoria sigue sin fecha oficial: no se inventa ninguna', () => {
    expect(CONVOCATORIA_CPEI_2026.fechaExamen).toBeNull();
    expect(getExamDate()).toBeNull();
    expect(describeExamPace(computeExamPace(getExamDate(), 100, hoy))).toMatch(/aún no se ha publicado/);
  });

  it('se guarda por cuenta, con la misma clave por cuenta que el SRS', () => {
    setExamDate('2027-03-15');
    expect(window.localStorage.getItem(`${EXAM_DATE_STORAGE_KEY}:cuenta-a`)).toBe('2027-03-15');
    setLocalDataOwner('cuenta-b');
    expect(getExamDate()).toBeNull();
    setLocalDataOwner(null);
    expect(getExamDate()).toBeNull();
    setLocalDataOwner('cuenta-a');
    expect(getExamDate()).toBe('2027-03-15');
    setExamDate(null);
    expect(getExamDate()).toBeNull();
  });

  it('rechaza fechas no válidas', () => {
    expect(isValidDateKey('2027-02-30')).toBe(false);
    expect(isValidDateKey('15/03/2027')).toBe(false);
    setExamDate('2027-13-01');
    expect(getExamDate()).toBeNull();
    window.localStorage.setItem(`${EXAM_DATE_STORAGE_KEY}:cuenta-a`, 'basura');
    expect(getExamDate()).toBeNull();
  });
});

describe('cuenta atrás y ritmo', () => {
  it('reparte las fichas sin consolidar entre los días que faltan', () => {
    const p = computeExamPace('2026-10-27', 95, hoy);
    expect(p).toEqual({ status: 'en-curso', examDate: '2026-10-27', daysLeft: 10, remaining: 95, perDay: 10, finalStretch: true });
    expect(describeExamPace(p)).toBe('Faltan 10 días para tu fecha prevista (27/10/2026). Te quedan 95 fichas por consolidar: unas 10 al día.');
  });

  it('tramo final a partir de 14 días', () => {
    expect(computeExamPace('2026-10-31', 1, hoy)).toMatchObject({ daysLeft: 14, finalStretch: true });
    expect(computeExamPace('2026-11-01', 1, hoy)).toMatchObject({ daysLeft: 15, finalStretch: false });
  });

  it('casos límite: mañana, hoy, pasada y todo consolidado', () => {
    expect(describeExamPace(computeExamPace('2026-10-18', 1, hoy))).toBe(
      'Falta 1 día para tu fecha prevista (18/10/2026). Te queda 1 ficha por consolidar: unas 1 al día.',
    );
    expect(computeExamPace('2026-10-17', 5, hoy).status).toBe('hoy');
    expect(describeExamPace(computeExamPace('2026-10-01', 5, hoy))).toBe('La fecha que pusiste (01/10/2026) ya ha pasado. Cámbiala o bórrala.');
    expect(describeExamPace(computeExamPace('2027-01-01', 0, hoy))).toMatch(/todas las fichas consolidadas/);
  });
});
