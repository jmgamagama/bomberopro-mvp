// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Onboarding from './Onboarding';
import { planSummary, PLAN_LIMITS } from '../utils/plan';
import { getVisibleTopics } from '../data/recallRegistry';
import { getPreferredDeckId } from '../utils/studyPreferences';
import { getDailyMinutes } from '../utils/studyPlan';

afterEach(() => vi.unstubAllEnvs());

describe('Bienvenida del invitado', () => {
  it('«Probar un simulacro de muestra» lleva directo al simulacro (1 toque)', async () => {
    const onTryExam = vi.fn();
    render(<Onboarding onStart={() => {}} onSkip={() => {}} onTryExam={onTryExam} />);
    await userEvent.setup().click(screen.getByRole('button', { name: /probar un simulacro de muestra/i }));
    expect(onTryExam).toHaveBeenCalledTimes(1);
  });

  it('ir al simulacro conserva el tema y los minutos elegidos', async () => {
    const user = userEvent.setup();
    render(<Onboarding onStart={() => {}} onSkip={() => {}} onTryExam={() => {}} />);
    const topic = getVisibleTopics()[0];
    await user.click(screen.getByRole('radio', { name: new RegExp(`^${topic.shortLabel} ·`) }));
    await user.click(screen.getByRole('radio', { name: '20 min' }));
    await user.click(screen.getByRole('button', { name: /probar un simulacro de muestra/i }));
    expect(getPreferredDeckId()).toBe(topic.id);
    expect(getDailyMinutes()).toBe(20);
  });

  it('con planes: dice qué es gratis y qué es Pro con los textos de plan.ts', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    const onOpenPlanes = vi.fn();
    render(<Onboarding onStart={() => {}} onSkip={() => {}} onOpenPlanes={onOpenPlanes} />);
    expect(screen.getByText(planSummary('free'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(planSummary('pro').slice(0, 20)))).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /todos los temas de tu plan/i })).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ver planes' }));
    expect(onOpenPlanes).toHaveBeenCalled();
  });

  it('sin planes no aparece el resumen de planes', () => {
    vi.stubEnv('VITE_FEATURE_PLANES', '');
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    expect(screen.queryByText(planSummary('free'))).toBeNull();
  });

  it('el resumen sale de PLAN_LIMITS', () => {
    expect(planSummary('free')).toContain(`${PLAN_LIMITS.free.dailySessionSize} fichas al día`);
    expect(planSummary('pro')).toContain(`${PLAN_LIMITS.pro.dailySessionSize} fichas al día`);
  });
});
