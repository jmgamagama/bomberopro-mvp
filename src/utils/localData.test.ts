// @vitest-environment jsdom
// Exportar y borrar los datos de estudio locales del propietario actual.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from './localOwner';
import { GRADE_GOOD, loadSrs, recordRecallGrade } from './recallSrs';
import { loadReviewLog } from './recallReviewLog';
import { buildLocalDataExport, deleteLocalStudyData, ownedLocalKeys } from './localData';

const ls = () => window.localStorage;

beforeEach(() => {
  ls().clear();
  resetLocalDataOwnerForTests();
});
afterEach(() => resetLocalDataOwnerForTests());

function seed() {
  setLocalDataOwner('cuenta-b');
  recordRecallGrade('tema40', 'c9', GRADE_GOOD);
  setLocalDataOwner('cuenta-a');
  recordRecallGrade('tema40', 'c1', GRADE_GOOD);
  ls().setItem('bomberopro:pending-attempts:v1:cuenta-a', '[{"key":"k1"}]');
  ls().setItem('bomberopro:rejected-attempts:v1:cuenta-a', '[]');
  ls().setItem('bomberopro:concept-events:v1', JSON.stringify([{ userId: 'cuenta-a', n: 1 }, { userId: 'cuenta-b', n: 2 }]));
  ls().setItem('mira_onboarding_v1', 'hecho');
  ls().setItem('otra_app', 'x');
}

describe('exportar datos locales', () => {
  it('incluye solo los datos de la cuenta actual', () => {
    seed();
    const out = buildLocalDataExport(new Date('2026-10-11T10:00:00Z'));
    expect(out.propietario).toBe('cuenta-a');
    expect(out.exportado).toBe('2026-10-11T10:00:00.000Z');
    expect(Object.keys(out.datos).sort()).toEqual([
      'bomberopro:concept-events:v1',
      'bomberopro:pending-attempts:v1:cuenta-a',
      'bomberopro:rejected-attempts:v1:cuenta-a',
      'mira_recall_registro_v1:cuenta-a',
      'mira_recall_srs_v1:cuenta-a',
    ]);
    expect(out.datos['bomberopro:concept-events:v1']).toEqual([{ userId: 'cuenta-a', n: 1 }]);
    expect(JSON.stringify(out)).not.toContain('cuenta-b');
  });

  it('en demostración incluye las claves de demo', () => {
    setLocalDataOwner(null);
    ls().setItem('mira_demo_attempts_v2', '[]');
    recordRecallGrade('tema40', 'c1', GRADE_GOOD);
    expect(ownedLocalKeys()).toEqual(['mira_demo_attempts_v2', 'mira_recall_registro_v1:demo', 'mira_recall_srs_v1:demo']);
  });
});

describe('borrar datos locales', () => {
  it('borra lo de la cuenta actual y conserva respuestas pendientes y otras cuentas', () => {
    seed();
    const removed = deleteLocalStudyData();
    expect(removed).toContain('mira_recall_srs_v1:cuenta-a');
    expect(loadSrs()).toEqual({});
    expect(loadReviewLog()).toEqual([]);
    expect(ls().getItem('bomberopro:pending-attempts:v1:cuenta-a')).not.toBeNull();
    expect(ls().getItem('bomberopro:concept-events:v1')).not.toBeNull();
    expect(ls().getItem('mira_onboarding_v1')).toBe('hecho');
    expect(ls().getItem('otra_app')).toBe('x');
    setLocalDataOwner('cuenta-b');
    expect(loadSrs().tema40.c9).toBeDefined();
  });
});
