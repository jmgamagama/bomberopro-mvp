// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import type { Attempt, Question } from '../types';
import { localDayNumber } from './localDate';
import type { CardSrs, SrsStore } from './recallSrs';
import { loadSrs, scheduleReview } from './recallSrs';
import {
  articuloDe, construirPlanDiario, fallosRecientesPorTema, frasePlan,
  loadPrioridad, marcarParaManana, minutosPlan, quitarPrioridad, SEGUNDOS_POR_FICHA_PLAN, SEGUNDOS_POR_PREGUNTA_PLAN,
} from './planDiario';
import { enlaceArticulo, fichasRelacionadas } from './fichasRelacionadas';

const date = new Date(2026, 10, 1, 10);
const today = localDayNumber(date);
const card = (deck: string, i: number, fuente = 'X'): RecallCard => ({ id: `${deck}-${i}`, prompt: `p${i}`, answer: 'a', fuente, deckId: deck, topicId: deck.split('-')[0], deckLabel: deck });
const st = (due: number, lastGrade: 0 | 1 | 2 = 2, lastReview = today - 1): CardSrs => ({ interval: 1, ease: 2.5, due, reps: 1, correct: 1, wrong: 0, lastGrade, lastReview });
const pool = [...Array.from({ length: 20 }, (_, i) => card('tema6', i)), ...Array.from({ length: 20 }, (_, i) => card('tema33', i))];

beforeEach(() => localStorage.clear());

describe('construirPlanDiario', () => {
  it('cuenta pendientes y nuevas con el estado real y nombra los temas', () => {
    const srs: SrsStore = { tema6: { 'tema6-0': st(today), 'tema6-1': st(today, 0) }, tema33: { 'tema33-0': st(today + 5) } };
    const p = construirPlanDiario(pool, { size: 10, srs, date, preguntasPendientes: 25 });
    expect(p.cards).toHaveLength(10);
    expect(p.pendientes).toBe(2);
    expect(p.nuevas + p.adelantadas).toBe(8);
    expect(p.preguntas).toBe(10);
    expect(p.minutos).toBe(minutosPlan(10, 10));
    expect(new Set(p.temas)).toEqual(new Set(['T6', 'T33']));
    expect(frasePlan(p)).toMatch(/^10 fichas \(2 pendientes de repaso y 8 nuevas\) del T(6|33) y el T(6|33), y 10 preguntas, unos 15 min\.$/);
  });

  it('minutos con las constantes documentadas', () => {
    expect(minutosPlan(25, 10)).toBe(Math.round((25 * SEGUNDOS_POR_FICHA_PLAN + 10 * SEGUNDOS_POR_PREGUNTA_PLAN) / 60));
    expect(minutosPlan(0, 0)).toBe(0);
  });

  it('prioriza el tema con más fallos recientes si no se eligió uno', () => {
    const srs: SrsStore = { tema33: { 'tema33-1': st(today + 1, 0, today - 2), 'tema33-2': st(today + 1, 0, today - 3) } };
    const fallos = fallosRecientesPorTema(pool, srs, [], [], date);
    expect(fallos.get('tema33')).toBe(2);
    const p = construirPlanDiario(pool, { size: 10, srs, date, fallos });
    expect(p.temaPorFallos).toBe('tema33');
    expect(p.cards.filter((c) => c.topicId === 'tema33').length).toBeGreaterThan(5);
  });

  it('cuenta preguntas de test falladas recientes por tema y descarta las antiguas', () => {
    const qs = [{ id: 'q1', tema: { numero: 6, titulo: '' } }] as Question[];
    const at = (d: Date, correct: boolean) => ({ question_id: 'q1', correct, created_at: d.toISOString() }) as Attempt;
    const old = new Date(2026, 8, 1);
    const f = fallosRecientesPorTema(pool, {}, [at(date, false), at(date, true), at(old, false)], qs, date);
    expect(f.get('tema6')).toBe(1);
  });
});

describe('prioridad de mañana', () => {
  it('«Repasar estas fichas» entra primero mañana, no hoy, y no toca el estado de repaso', () => {
    const before = JSON.stringify(loadSrs());
    expect(marcarParaManana([pool[39]], date)).toBe(1);
    expect(loadPrioridad()).toEqual({ 'tema33|tema33-19': today + 1 });
    expect(JSON.stringify(loadSrs())).toBe(before);
    const hoy = construirPlanDiario(pool, { size: 5, srs: {}, date, prioridad: loadPrioridad() });
    expect(hoy.cards[0].id).not.toBe('tema33-19');
    const manana = new Date(2026, 10, 2, 10);
    const p = construirPlanDiario(pool, { size: 5, srs: {}, date: manana, prioridad: loadPrioridad() });
    expect(p.cards[0].id).toBe('tema33-19');
    expect(p.pendientes).toBe(1);
    quitarPrioridad('tema33', 'tema33-19', date); // aún no es su día: se queda
    expect(Object.keys(loadPrioridad())).toHaveLength(1);
    quitarPrioridad('tema33', 'tema33-19', manana);
    expect(loadPrioridad()).toEqual({});
  });

  it('el algoritmo sigue igual (scheduleReview)', () => {
    expect(scheduleReview(undefined, 2, today).due).toBe(today + 1);
  });
});

describe('fallo → ficha y BOE', () => {
  it('artículo citado', () => {
    expect(articuloDe('Constitución Española, art. 1.1')).toBe('1');
    expect(articuloDe('Constitución Española, Artículo 14, apdo. 2')).toBe('14');
    expect(articuloDe('Artículo 1 y artículo 2')).toBeUndefined();
    expect(articuloDe(undefined)).toBeUndefined();
  });

  it('relaciona por tema y artículo y enlaza al BOE', () => {
    const ce = (i: number, art: number) => ({ ...card('tema1', i), fuente: `Constitución Española, Artículo ${art}, apdo. 1. BOE-A-1978-31229: https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a${art}` });
    const p = [ce(0, 1), ce(1, 1), ce(2, 2), card('tema6', 3, 'Artículo 1')];
    const q = { tema: { numero: 1 }, fuente: 'Constitución Española, art. 1.1' };
    expect(fichasRelacionadas(q, p).map((c) => c.id)).toEqual(['tema1-0', 'tema1-1']);
    expect(fichasRelacionadas({ tema: { numero: 1 }, fuente: 'Sin artículo' }, p)).toEqual([]);
    expect(enlaceArticulo(q.fuente)).toBe('https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a1');
    expect(enlaceArticulo('Protocolo de movilización')).toBeNull();
  });
});
