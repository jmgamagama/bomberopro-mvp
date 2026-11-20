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
function queryFixture(rows: { estado: string; topic_id: number | null }[]) {
  const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    expect(url.pathname).toBe('/rest/v1/concepts');
    expect(init?.method ?? 'GET').toBe('GET');
    expect(url.searchParams.get('select')).toBe('topic_id');
    expect(url.searchParams.get('estado')).toBe('eq.publicado');
    expect(url.searchParams.get('order')).toBe('id.asc');
    expect(new Headers(init?.headers).get('prefer')).toContain('count=exact');
    const published = rows.filter((r) => r.estado === 'publicado');
    const offset = Number(url.searchParams.get('offset'));
    const limit = Number(url.searchParams.get('limit'));
    const data = published.slice(offset, offset + limit).map(({ topic_id }) => ({ topic_id }));
    return new Response(JSON.stringify(data), { headers: {
      'content-type': 'application/json',
      'content-range': `${offset}-${offset + data.length - 1}/${published.length}`,
    } });
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

  it('la web muestra el count exacto y los temas distintos de la consulta, con paginación', async () => {
    const rows = [
      ...Array.from({ length: 1308 }, (_, i) => ({ estado: 'publicado', topic_id: i % 11 + 1 })),
      { estado: 'borrador_ia', topic_id: 99 },
    ];
    const query = queryFixture(rows);
    render(<Onboarding onStart={() => {}} onSkip={() => {}} cuenta />);
    const valor = document.getElementById('onboarding-valor')!;
    expect(valor).toHaveTextContent('Fichas por temas');
    expect(valor).toHaveAttribute('aria-busy', 'true');
    const published = rows.filter((row) => row.estado === 'publicado');
    const count = new Intl.NumberFormat('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions).format(published.length);
    const distinctTopics = new Set(published.map((row) => row.topic_id)).size;
    await waitFor(() => expect(valor).toHaveTextContent(`${count} fichas publicadas en ${distinctTopics} temas`));
    expect(valor).toHaveAttribute('aria-busy', 'false');
    expect(query).toHaveBeenCalledTimes(3);
    expect(valor).toHaveTextContent(/fuente oficial/);
    expect(valor.textContent).not.toMatch(/revisadas|2\.886|34 temas|€|gratis|pro\b/i);
  });

  it('la bienvenida invitada no anuncia el inventario editorial ni el total local', async () => {
    queryFixture([{ estado: 'publicado', topic_id: 1 }]);
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    const valor = document.getElementById('onboarding-valor')!;
    await waitFor(() => expect(valor).toHaveAttribute('aria-busy', 'false'));
    expect(valor).toHaveTextContent('Fichas por temas');
    expect(valor.textContent).not.toMatch(/\d/);
    expect(screen.getByRole('radio', { name: 'Todos los temas' })).toBeInTheDocument();
  });

  it('sin Supabase mantiene el texto sin cifra ni promesa de revisión', async () => {
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    const valor = document.getElementById('onboarding-valor')!;
    await waitFor(() => expect(valor).toHaveTextContent('Fichas por temas'));
    expect(valor.textContent).not.toMatch(/\d|revisadas/);
  });

  it('una denegación de acceso o un fallo de red deja la web utilizable sin cifras', async () => {
    queryFixture([]);
    const query = vi.spyOn(client.value!, 'from').mockImplementation(() => { throw new Error('permission denied / offline'); });
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    await waitFor(() => expect(query).toHaveBeenCalled());
    expect(document.getElementById('onboarding-valor')!).toHaveTextContent('Fichas por temas');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Saltar' }));
  });

  it('count(distinct topic_id) ignora NULL y los duplicados', async () => {
    queryFixture([{ estado: 'publicado', topic_id: 1 }, { estado: 'publicado', topic_id: 1 }, { estado: 'publicado', topic_id: null }]);
    expect(await loadPublishedConceptSummary(new AbortController().signal)).toEqual({ fichas: 3, temas: 1 });
  });

  it('un inventario vacío es cero, no el registro de fichas local', async () => {
    queryFixture([]);
    expect(await loadPublishedConceptSummary(new AbortController().signal)).toEqual({ fichas: 0, temas: 0 });
  });

  it.each([null, -1, 1308])('count inválido o página incompleta (%s) no produce cifras parciales', async (count) => {
    queryFixture([]);
    vi.spyOn(client.value!, 'from').mockReturnValue({
      select: () => ({ eq: () => ({ order: () => ({ range: () => ({ abortSignal: () => Promise.resolve({ data: [], count, error: null }) }) }) }) }),
    } as never);
    expect(await loadPublishedConceptSummary(new AbortController().signal)).toBeNull();
  });

  it('cancela una consulta lenta y conserva el texto sin cifra', async () => {
    queryFixture([]);
    let aborted = false;
    vi.spyOn(client.value!, 'from').mockReturnValue({
      select: () => ({ eq: () => ({ order: () => ({ range: () => ({
        abortSignal: (signal: AbortSignal) => new Promise((resolve) => {
          signal.addEventListener('abort', () => {
            aborted = true;
            resolve({ data: null, count: null, error: { message: 'aborted' } });
          });
        }),
      }) }) }) }),
    } as never);
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
    expect(valor).toHaveTextContent('Fichas por temas');
    expect(valor).not.toHaveTextContent(/sin cuenta/i);
  });
});
