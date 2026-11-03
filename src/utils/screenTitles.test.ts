import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SCREEN_TITLES } from './screenTitles';

const leer = (ruta: string) => readFileSync(new URL(`../${ruta}`, import.meta.url), 'utf8');

describe('nombres de pantalla coherentes', () => {
  it('el encabezado de cada pantalla es el mismo nombre que usa el título de la pestaña', () => {
    expect(leer('components/StudyByTopic.tsx')).toContain(`'${SCREEN_TITLES.study_by_topic}'),`);
    expect(leer('components/MockExam.tsx')).toContain(`>${SCREEN_TITLES.mock_exam}</h2>`);
    expect(leer('components/ForgettingCurve.tsx')).toContain(`>${SCREEN_TITLES.forgetting_curve}</h2>`);
    expect(leer('components/TodayTraining.tsx')).toContain(`>${SCREEN_TITLES.today_training}</h2>`);
    expect(leer('components/ErrorPanel.tsx')).toContain(`>${SCREEN_TITLES.errors}</h2>`);
    expect(leer('components/AccountErrorPanel.tsx')).toContain(`>${SCREEN_TITLES.errors}</h2>`);
    expect(leer('components/Dashboard.tsx')).toContain(`>${SCREEN_TITLES.dashboard}</h1>`);
  });

  it('las entradas del menú usan esos mismos nombres', () => {
    const app = leer('App.tsx');
    for (const clave of ['errors', 'recuerdo', 'sesion_diaria', 'today_training', 'forgetting_curve', 'my_reports'] as const) {
      expect(app, `menú «Más»: ${clave}`).toContain(`label: '${SCREEN_TITLES[clave]}'`);
    }
    expect(app).toContain(`label: '${SCREEN_TITLES.dashboard}'`);
    expect(app).toContain(`label: '${SCREEN_TITLES.study_by_topic}'`);
    expect(app).toContain(`label: '${SCREEN_TITLES.mock_exam}'`);
  });

  it('no hay dos pantallas con el mismo nombre', () => {
    const nombres = Object.values(SCREEN_TITLES);
    expect(new Set(nombres).size).toBe(nombres.length);
  });
});
