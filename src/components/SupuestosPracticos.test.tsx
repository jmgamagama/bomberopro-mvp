// @vitest-environment jsdom
// Pantalla de supuestos prácticos y su entrada en el menú (solo si hay supuestos visibles).
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
vi.mock('../lib/supabase', () => ({ supabase: null }));
import App from '../App';
import SupuestosPracticos from './SupuestosPracticos';
import { SUPUESTOS } from '../data/supuestos/supuestosData';
import { completeOnboarding } from '../utils/onboarding';

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.unstubAllEnvs());

describe('SupuestosPracticos', () => {
  it('resuelve un supuesto, corrige en local y muestra resultado, pasos y fuente', async () => {
    vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true');
    const user = userEvent.setup();
    render(<SupuestosPracticos onNavigateHome={() => {}} />);
    const s = SUPUESTOS.find((x) => x.id === 'supuesto-t33-agua-01')!;
    const abrir = await screen.findByRole('button', { name: new RegExp(s.titulo) });
    await waitFor(() => expect(abrir).toBeEnabled());
    expect(abrir).toHaveTextContent('Pendiente de revisión');
    await user.click(abrir);
    expect(screen.getByRole('heading', { name: s.titulo })).toBeInTheDocument();

    for (const p of s.preguntas) {
      const li = document.querySelector<HTMLElement>(`[data-pregunta-id="${p.id}"]`)!;
      if (p.tipo === 'test') await user.click(within(li).getAllByRole('radio')[p.correcta]);
      else if (p.tipo === 'calculo') await user.type(within(li).getByRole('textbox'), p.id.endsWith('p5') ? '19.200' : String(p.resultado));
    }
    // Una errónea a propósito: cambia la última de test.
    const p7 = s.preguntas.find((p) => p.id === 't33-agua-01-p7')!;
    if (p7.tipo !== 'test') throw new Error('p7 debería ser test');
    await user.click(within(document.querySelector<HTMLElement>('[data-pregunta-id="t33-agua-01-p7"]')!).getAllByRole('radio')[(p7.correcta + 1) % 4]);

    await user.click(screen.getByRole('button', { name: /Corregir \(8\/8 respondidas\)/ }));
    const resultado = screen.getByRole('status');
    expect(resultado).toHaveTextContent('7/8');
    expect(screen.getAllByText('Correcta')).toHaveLength(7);
    expect(screen.getAllByText('Incorrecta')).toHaveLength(1);
    expect(document.body.textContent).toMatch(/2 × 160 = 320 l\/min.*320 × 60 = 19.200 l/);
    expect(screen.getAllByRole('link', { name: /Fuente oficial/ })[0]).toHaveAttribute('href', expect.stringMatching(/^https:\/\/www\.boe\.es\//));
    expect(JSON.parse(window.localStorage.getItem('mira_supuestos_v1')!)['supuesto-t33-agua-01']).toMatchObject({ aciertos: 7, total: 8 });

    await user.click(screen.getByRole('button', { name: /Repetir/ }));
    expect(screen.getByRole('button', { name: /Corregir \(0\/8 respondidas\)/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Otros supuestos' }));
    expect(await screen.findByText(/último: 7\/8/)).toBeInTheDocument();
  });

  it('sin supuestos visibles (alumno) muestra un aviso y no lista nada', () => {
    render(<SupuestosPracticos onNavigateHome={() => {}} />);
    expect(screen.getByText('Todavía no hay supuestos publicados.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Lista de supuestos' })).toBeNull();
  });
});

describe('entrada en el menú', () => {
  it('el alumno no ve «Supuestos» ni «Casos» (todos pendientes)', async () => {
    completeOnboarding('skipped');
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    expect(document.querySelector('#nav-btn-supuestos')).toBeNull();
    const movil = screen.getByRole('navigation', { name: 'Navegación móvil' });
    expect(within(movil).getAllByRole('button')).toHaveLength(5);
    await userEvent.setup().click(within(movil).getByRole('button', { name: 'Más' }));
    expect(screen.queryByRole('button', { name: /Casos prácticos/ })).toBeNull();
  });

  it('el build de revisión muestra la entrada en escritorio y móvil y abre la pantalla', async () => {
    vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true');
    completeOnboarding('skipped');
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    expect(document.querySelector('#nav-btn-supuestos')).not.toBeNull();
    const movil = screen.getByRole('navigation', { name: 'Navegación móvil' });
    expect(within(movil).getAllByRole('button')).toHaveLength(5);
    await user.click(within(movil).getByRole('button', { name: 'Más' }));
    await user.click(screen.getByRole('button', { name: /Casos prácticos/ }));
    expect(await screen.findByRole('heading', { name: 'Supuestos prácticos' })).toBeInTheDocument();
    expect(document.title).toBe('Supuestos prácticos | BomberoPro');
  });
});

describe('Mis supuestos (privado)', () => {
  const EJEMPLO = readFileSync(join(process.cwd(), 'docs/ejemplos/supuestos-privados-EJEMPLO.json'), 'utf8');
  const archivo = (texto: string, nombre = 'mis-casos.json') => new File([texto], nombre, { type: 'application/json' });

  afterEach(() => {
    window.location.hash = '';
  });

  it('el alumno llega por /#supuestos, importa, ve la entrada del menú, resuelve y borra', async () => {
    completeOnboarding('skipped');
    window.location.hash = '#supuestos';
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Mis supuestos (privado)' })).toBeInTheDocument();
    expect(screen.getByText(/Material personal que no se comparte/)).toBeInTheDocument();
    expect(screen.getByText('Todavía no hay supuestos publicados.')).toBeInTheDocument();
    expect(document.querySelector('#nav-btn-supuestos')).toBeNull();

    // Archivo con errores: no se importa nada y se explica por qué.
    await user.upload(screen.getByLabelText('Importar archivo JSON'), archivo('{"formato":"bomberopro-supuestos","version":1,"supuestos":[{"id":"x"}]}'));
    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('No se ha importado nada');
    expect(alerta).toHaveTextContent('supuestos[0].titulo: es obligatorio (texto)');

    await user.upload(screen.getByLabelText('Importar archivo JSON'), archivo(EJEMPLO));
    expect(await screen.findByText(/Importados 1 supuestos de «mis-casos.json» \(1 nuevos\)/)).toBeInTheDocument();
    expect(document.querySelector('#nav-btn-supuestos')).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /^EJEMPLO · Supuesto ficticio/ }));
    expect(screen.getByText('Mi supuesto (privado) · Tema 9')).toBeInTheDocument();
    const p = (id: string) => document.querySelector<HTMLElement>(`[data-pregunta-id="${id}"]`)!;
    await user.click(within(p('EJEMPLO-01-p1')).getAllByRole('radio')[1]);
    await user.type(within(p('EJEMPLO-01-p2')).getByRole('textbox'), '2.000');
    await user.type(within(p('EJEMPLO-01-p3')).getByRole('textbox'), '25');
    await user.type(within(p('EJEMPLO-01-p4')).getByRole('textbox'), 'Mi respuesta');
    await user.click(screen.getByRole('button', { name: /Corregir \(4\/4 respondidas\)/ }));
    expect(document.querySelector('#supuesto-resultado')).toHaveTextContent('2/4');
    expect(document.querySelector('#supuesto-resultado')).toHaveTextContent('Te quedan 1 preguntas de desarrollo por autoevaluar');
    expect(within(p('EJEMPLO-01-p4')).getByText(/respuesta modelo de prueba/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'La tenía bien' }));
    expect(document.querySelector('#supuesto-resultado')).toHaveTextContent('3/4');

    await user.click(screen.getByRole('button', { name: 'Otros supuestos' }));
    expect(await screen.findByText(/último: 3\/4/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Borrar «EJEMPLO/ }));
    await user.click(screen.getByRole('button', { name: 'Sí, borrar' }));
    expect(screen.queryByRole('list', { name: 'Mis supuestos privados' })).toBeNull();
    await waitFor(() => expect(document.querySelector('#nav-btn-supuestos')).toBeNull());
    expect(window.localStorage.getItem('mira_supuestos_privados_v1:demo')).toBeNull();
  });

  it('«Borrar todos» pide confirmación', async () => {
    const user = userEvent.setup();
    render(<SupuestosPracticos onNavigateHome={() => {}} />);
    await user.upload(screen.getByLabelText('Importar archivo JSON'), archivo(EJEMPLO));
    await screen.findByRole('list', { name: 'Mis supuestos privados' });
    await user.click(screen.getByRole('button', { name: /Borrar todos mis supuestos privados/ }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('list', { name: 'Mis supuestos privados' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Borrar todos mis supuestos privados/ }));
    await user.click(screen.getByRole('button', { name: 'Sí, borrar todos' }));
    expect(screen.queryByRole('list', { name: 'Mis supuestos privados' })).toBeNull();
  });
});
