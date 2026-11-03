// @vitest-environment jsdom
import '../test/setup';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import Onboarding from './Onboarding';
import { RECALL_TOPICS } from '../data/recallRegistry';
import { ONBOARDING_STORAGE_KEY, hasCompletedOnboarding } from '../utils/onboarding';
import { preferredDeckStorageKey, getPreferredDeckId } from '../utils/studyPreferences';

// Estos tests cubren el catálogo COMPLETO (vista de propietario/admin de revisión).
// La vista del alumno (solo mazos revisados) se prueba en src/data/recallReview.test.ts.
beforeEach(() => vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true'));
afterEach(() => vi.unstubAllEnvs());

describe('Onboarding', () => {
  beforeEach(() => window.localStorage.clear());

  it('presenta la convocatoria con datos de las bases y la fecha de examen sin publicar', () => {
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    const card = document.querySelector('#onboarding-convocatoria') as HTMLElement;
    expect(card).toHaveTextContent('Convocatoria CPEI Badajoz 2026 · 38 plazas');
    expect(card).toHaveTextContent('Conductor/a Bombero/a: 38 plazas (9 OEP 2024 + 29 OEP 2026)');
    expect(card).toHaveTextContent('BOP de Badajoz nº 135, de 17/07/2026, anuncio 2843/2026');
    expect(card).toHaveTextContent('Fecha de examen: aún sin publicar');
    // Dato con fuente oficial (bases, primera prueba).
    expect(card).toHaveTextContent('El 30 % de las preguntas del test versa sobre los temas 35 a 40.');
    expect(card).toHaveTextContent('Fuente: Bases, primera prueba (BOP nº 135, 17/07/2026)');
  });

  it('ofrece «Todos los temas» y un tema por opción (el 36 con todos sus lotes)', () => {
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    const group = screen.getByRole('radiogroup', { name: 'Tema para la sesión diaria' });
    const radios = within(group).getAllByRole('radio');
    expect(radios).toHaveLength(RECALL_TOPICS.length + 1);
    expect(radios[0]).toHaveTextContent('Todos los temas');
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    for (const topic of RECALL_TOPICS.filter((t) => t.decks.length === 1)) {
      expect(within(group).getByRole('radio', { name: new RegExp(`^${topic.shortLabel} ·`) })).toHaveTextContent(topic.name);
    }
    const t36 = RECALL_TOPICS.find((t) => t.id === 'tema36')!;
    const t36Radio = within(group).getByRole('radio', { name: /Tema 36 \(todos los lotes\)/ });
    expect(t36Radio).toHaveTextContent(`${t36.count} fichas · ${t36.decks.length} lotes`);
    expect(within(group).queryByRole('radio', { name: /T36·/ })).toBeNull();
    expect(RECALL_TOPICS.find((t) => t.id === 'tema40')!.name).toBe('Procedimientos de trabajo CPEI-Badajoz');
  });

  it('elegir «Tema 36 (todos los lotes)» guarda el tema completo', async () => {
    const user = userEvent.setup();
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    await user.click(screen.getByRole('radio', { name: /Tema 36 \(todos los lotes\)/ }));
    await user.click(screen.getByRole('button', { name: 'Empezar sesión diaria' }));
    expect(getPreferredDeckId()).toBe('tema36');
  });

  it('elegir tema + «Empezar sesión diaria» guarda preferencia y bandera y arranca', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<Onboarding onStart={onStart} onSkip={vi.fn()} />);
    await user.click(screen.getByRole('radio', { name: /T40/ }));
    await user.click(screen.getByRole('button', { name: 'Empezar sesión diaria' }));
    expect(onStart).toHaveBeenCalledOnce();
    expect(getPreferredDeckId()).toBe('tema40');
    expect(hasCompletedOnboarding()).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(ONBOARDING_STORAGE_KEY)!).outcome).toBe('started');
  });

  it('«Todos los temas» no guarda tema prioritario', async () => {
    const user = userEvent.setup();
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Empezar sesión diaria' }));
    expect(window.localStorage.getItem(preferredDeckStorageKey())).toBeNull();
  });

  it('«Saltar» marca la bienvenida como vista sin cambiar preferencias', async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    render(<Onboarding onStart={vi.fn()} onSkip={onSkip} />);
    await user.click(screen.getByRole('radio', { name: /T38/ }));
    await user.click(screen.getByRole('button', { name: 'Saltar' }));
    expect(onSkip).toHaveBeenCalledOnce();
    expect(JSON.parse(window.localStorage.getItem(ONBOARDING_STORAGE_KEY)!).outcome).toBe('skipped');
    expect(getPreferredDeckId()).toBeNull();
  });
});
