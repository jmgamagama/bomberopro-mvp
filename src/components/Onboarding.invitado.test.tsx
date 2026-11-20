// @vitest-environment jsdom
import '../test/setup';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Onboarding from './Onboarding';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadPublishedConceptSummary } from '../lib/publishedConceptSummary';

const client = vi.hoisted(() => ({ value: null as SupabaseClient | null }));
vi.mock('../lib/supabase', () => ({ get supabase() { return client.value; } }));
beforeEach(() => { client.value = null; });

let fixtureId = 0;
function rpcFixture(body: unknown, status = 200) {
  const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    expect(url.pathname).toBe('/rest/v1/rpc/get_catalogo_publico');
    expect(init?.method).toBe('POST');
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  });
  client.value = createClient('https://fixture.supabase.co', 'fictional-anon-key', {
    global: { fetch }, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: `fictional-${++fixtureId}` },
  });
  return fetch;
}
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

  it('la web muestra las preguntas publicadas y los temas que devuelve la función pública', async () => {
    const rpc = rpcFixture([{ preguntas: 11195, temas: 40 }]);
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    const valor = document.getElementById('onboarding-valor')!;
    expect(valor).toHaveTextContent('Preguntas por temas');
    expect(valor).toHaveAttribute('aria-busy', 'true');
    await waitFor(() => expect(valor).toHaveTextContent('11.195 preguntas publicadas · 40 temas'));
    expect(valor).toHaveAttribute('aria-busy', 'false');
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(valor).toHaveTextContent(/fuente normativa/);
    expect(valor).toHaveTextContent('Empiezas sin cuenta.');
    expect(valor.textContent).not.toMatch(/revisadas|1\.660|13 temas|34 temas|€|gratis|pro\b/i);
  });

  it('sin Supabase mantiene el texto sin cifra ni promesa de revisión', async () => {
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    const valor = document.getElementById('onboarding-valor')!;
    await waitFor(() => expect(valor).toHaveTextContent('Preguntas por temas'));
    expect(valor.textContent).not.toMatch(/\d|revisadas/);
  });

  it('un fallo de red o de acceso deja la web utilizable sin cifras', async () => {
    rpcFixture({ message: 'permission denied' }, 401);
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    const valor = document.getElementById('onboarding-valor')!;
    await waitFor(() => expect(valor).toHaveAttribute('aria-busy', 'false'));
    expect(valor).toHaveTextContent('Preguntas por temas');
    expect(valor.textContent).not.toMatch(/\d/);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Saltar' }));
  });

  it.each([[[]], [[{ preguntas: -1, temas: 40 }]], [[{ preguntas: '11195', temas: 40 }]], [[{ preguntas: 5.5, temas: 2 }]]])(
    'una respuesta inválida (%j) no produce cifras', async (body) => {
      rpcFixture(body);
      expect(await loadPublishedConceptSummary(new AbortController().signal)).toBeNull();
    });

  it('una respuesta válida se devuelve tal cual, también con ceros', async () => {
    rpcFixture([{ preguntas: 0, temas: 0 }]);
    expect(await loadPublishedConceptSummary(new AbortController().signal)).toEqual({ preguntas: 0, temas: 0 });
  });

  it('cancela una consulta lenta y conserva el texto sin cifra', async () => {
    let aborted = false;
    const fetch = vi.fn((_i: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_res, rej) => {
      init?.signal?.addEventListener('abort', () => { aborted = true; rej(new DOMException('aborted', 'AbortError')); });
    }));
    client.value = createClient('https://fixture.supabase.co', 'fictional-anon-key', {
      global: { fetch }, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: `fictional-${++fixtureId}` },
    });
    vi.useFakeTimers();
    try {
      render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
      await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
      expect(aborted).toBe(true);
      expect(document.getElementById('onboarding-valor')!).toHaveAttribute('aria-busy', 'false');
      expect(document.getElementById('onboarding-valor')!.textContent).not.toMatch(/\d/);
    } finally { vi.useRealTimers(); }
  });

  it('con cuenta no dice «sin cuenta»', () => {
    render(<Onboarding onStart={() => {}} onSkip={() => {}} cuenta />);
    const valor = document.getElementById('onboarding-valor')!;
    expect(valor).toHaveTextContent('Preguntas por temas');
    expect(valor).not.toHaveTextContent(/sin cuenta/i);
  });
});
