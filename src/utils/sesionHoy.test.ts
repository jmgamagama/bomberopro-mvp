// @vitest-environment jsdom
// Inicio del invitado (01/11/2026): resumen de la sesión diaria con las cifras del dispositivo, solo lectura.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resumenSesionHoy, tamanoSesionHoy, textoSesionHoy, type SesionHoyResumen } from './sesionHoy';
import { getAccessibleDecks, getRecallDeck, loadRecallDeckCards } from '../data/recallRegistry';
import { OUT_OF_SYLLABUS_CARDS } from '../data/recallCardReview';
import { saveSrs, type CardSrs, type SrsStore } from './recallSrs';
import { saveDailyStreak } from './dailySession';
import { localDayNumber } from './localDate';
import { getDailySessionSize, getPlan } from './plan';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from './localOwner';

const NOW = new Date(2026, 10, 1, 9, 0); // 1/11/2026, hora local
const TODAY = localDayNumber(NOW);
const st = (due: number, lastGrade: 0 | 1 | 2 = 2): CardSrs => ({ interval: 1, ease: 2.5, due, reps: 1, correct: 1, wrong: 0, lastGrade, lastReview: due - 1 });
const sinRacha = { lastCompletedDate: null, streakCount: 0 };

beforeEach(() => {
  window.localStorage.clear();
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', '');
  vi.stubEnv('VITE_REVISION_OWNERS', '');
  resetLocalDataOwnerForTests();
  setLocalDataOwner(null);
});
afterEach(() => {
  vi.unstubAllEnvs();
  resetLocalDataOwnerForTests();
});

describe('resumenSesionHoy', () => {
  it('cuenta las de hoy (vencidas y falladas), las de mañana y las vistas, sin fichas ocultas ni mazos desconocidos', async () => {
    const ids = (await loadRecallDeckCards('tema40')).map((c) => c.id);
    // Un mazo revisado con fichas retiradas por estar fuera del epígrafe: no cuentan.
    const conRetiradas = Object.keys(OUT_OF_SYLLABUS_CARDS).find((d) => getRecallDeck(d).revision === 'revisado' && getAccessibleDecks().some((x) => x.id === d))!;
    expect(conRetiradas).toBeTruthy();
    const store: SrsStore = {
      tema40: {
        [ids[0]]: st(TODAY - 3), // vencida
        [ids[1]]: st(TODAY, 0), // fallada que ya toca
        [ids[2]]: st(TODAY + 1), // mañana
        [ids[3]]: st(TODAY + 5), // más adelante
      },
      [conRetiradas]: { [OUT_OF_SYLLABUS_CARDS[conRetiradas][0]]: st(TODAY - 1) },
      'mazo-que-no-existe': { x: st(TODAY - 1) },
    };
    const r = resumenSesionHoy(NOW, store, sinRacha, 30);
    expect(r).toEqual({ vistas: 4, hoy: 2, manana: 3, hechaHoy: false, racha: 0, tamanoSesion: 30 });
  });

  it('racha: viva si se completó hoy o ayer; una antigua no se muestra', () => {
    expect(resumenSesionHoy(NOW, {}, { lastCompletedDate: '2026-11-01', streakCount: 4 }, 30)).toMatchObject({ hechaHoy: true, racha: 4 });
    expect(resumenSesionHoy(NOW, {}, { lastCompletedDate: '2026-10-31', streakCount: 3 }, 30)).toMatchObject({ hechaHoy: false, racha: 3 });
    expect(resumenSesionHoy(NOW, {}, { lastCompletedDate: '2026-10-29', streakCount: 7 }, 30)).toMatchObject({ hechaHoy: false, racha: 0 });
  });

  it('por defecto lee el dispositivo del invitado y no escribe nada', async () => {
    const ids = (await loadRecallDeckCards('tema40')).map((c) => c.id);
    saveSrs({ tema40: { [ids[0]]: st(TODAY - 1), [ids[1]]: st(TODAY + 2) } });
    saveDailyStreak({ lastCompletedDate: '2026-10-31', streakCount: 2 });
    const antes = JSON.stringify({ ...window.localStorage });
    const r = resumenSesionHoy(NOW);
    expect(r).toMatchObject({ vistas: 2, hoy: 1, manana: 1, racha: 2, hechaHoy: false });
    expect(r.tamanoSesion).toBe(tamanoSesionHoy());
    expect(tamanoSesionHoy()).toBe(getDailySessionSize(getPlan())); // sin minutos elegidos: el del plan
    expect(JSON.stringify({ ...window.localStorage })).toBe(antes);
  });
});

describe('textoSesionHoy', () => {
  const base: SesionHoyResumen = { vistas: 0, hoy: 0, manana: 0, hechaHoy: false, racha: 0, tamanoSesion: 30 };

  it('sin nada repasado: invita a empezar, con el tamaño de la sesión', () => {
    expect(textoSesionHoy(base)).toEqual({
      frase: 'Hasta 30 fichas de repaso de todos los temas. Sin cuenta: se guarda en este dispositivo.',
      boton: 'Empezar sesión diaria',
      empiezaDirecto: true,
    });
  });

  it('con fichas para hoy: cuántas, y la racha si sigue viva', () => {
    const t = textoSesionHoy({ ...base, vistas: 30, hoy: 12, manana: 12, racha: 2 });
    expect(t.frase).toBe('Hoy te toca repasar 12 fichas que ya viste. Llevas una racha de 2 días: haz la de hoy para que siga.');
    expect(t.boton).toBe('Seguir con la sesión diaria');
    expect(t.empiezaDirecto).toBe(true);
    expect(textoSesionHoy({ ...base, vistas: 1, hoy: 1, manana: 1 }).frase).toBe('Hoy te toca repasar 1 ficha que ya viste.');
  });

  it('si hay más pendientes que sitio, dice cuántas trae la sesión', () => {
    expect(textoSesionHoy({ ...base, vistas: 2000, hoy: 1500, manana: 1500 }).frase)
      .toBe('Hoy te toca repasar 1.500 fichas que ya viste. La sesión de hoy trae 30 fichas, empezando por esas.');
  });

  it('con fichas vistas pero ninguna para hoy', () => {
    expect(textoSesionHoy({ ...base, vistas: 30, manana: 0 }).frase)
      .toBe('Hoy no te vence ninguna de las 30 fichas que ya viste: la sesión trae hasta 30 fichas nuevas o de repaso.');
  });

  it('ya hecha hoy: lo dice, cuántas tocan mañana, y abre la sesión sin empezarla', () => {
    expect(textoSesionHoy({ ...base, vistas: 30, manana: 30, hechaHoy: true, racha: 1 })).toEqual({
      frase: 'Hoy ya has hecho tu sesión. Mañana te tocan 30 fichas: vuelve para que sume tu racha.',
      boton: 'Abrir la sesión diaria',
      empiezaDirecto: false,
    });
    expect(textoSesionHoy({ ...base, vistas: 30, hechaHoy: true, racha: 5 }).frase)
      .toBe('Hoy ya has hecho tu sesión. Llevas una racha de 5 días. Vuelve mañana para que sume tu racha.');
  });

  it('sin planes, precios ni «Pro»', () => {
    const casos: SesionHoyResumen[] = [base, { ...base, vistas: 3, hoy: 3 }, { ...base, vistas: 3 }, { ...base, hechaHoy: true, manana: 2 }];
    for (const c of casos) expect(textoSesionHoy(c).frase).not.toMatch(/€|Pro\b|gratis|plan/i);
  });
});
