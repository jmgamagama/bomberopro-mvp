// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import type { ReactNode } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import VerEnEsquema, { AbrirMaterialContext } from './VerEnEsquema';
import FalloFichas from './FalloFichas';
import TuProgreso from './TuProgreso';
import { buscarPrecepto } from './MaterialTema';
import { renderMarkdown } from '../utils/miniMarkdown';

afterEach(cleanup);
const conAbrir = (ui: ReactNode, abrir = vi.fn()) => ({ abrir, ...render(<AbrirMaterialContext.Provider value={abrir}>{ui}</AbrirMaterialContext.Provider>) });

describe('«Ver en el esquema del tema»', () => {
  it('sin App (sin proveedor) no se muestra; con material abre el destino verificable', async () => {
    render(<VerEnEsquema tema={1} fuente="Constitución Española, art. 1.1" origen="esta ficha" />);
    expect(screen.queryByRole('button')).toBeNull();
    cleanup();
    const { abrir } = conAbrir(<VerEnEsquema tema={1} fuente="Constitución Española, art. 1.1" origen="esta ficha" />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ver en el esquema del tema 1 (Artículo 1)' }));
    expect(abrir).toHaveBeenCalledWith({ tema: 1, bloque: 'titulo-preliminar', precepto: 'a1', etiqueta: 'Artículo 1' }, 'esta ficha');
  });
  it('tema sin material: no hay enlace', () => {
    conAbrir(<VerEnEsquema tema={40} fuente="PT03 — PDF p. 23" origen="esta ficha" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
  it('en un fallo del simulacro aparece aunque no haya fichas relacionadas', () => {
    conAbrir(<FalloFichas id="q" tema={1} fuente="Constitución Española, art. 1.1" fichas={[]} />);
    expect(screen.getByRole('button', { name: /Ver en el esquema del tema 1/ })).toBeInTheDocument();
  });
  it('«Tu progreso»: acceso al material solo en los temas que lo tienen', async () => {
    const { abrir } = conAbrir(<TuProgreso onNavigateHome={vi.fn()} />);
    const botones = [...document.querySelectorAll('[data-material-tema]')].map((b) => Number(b.getAttribute('data-material-tema')));
    expect(botones.length).toBeGreaterThan(0);
    expect(botones.every((t) => [1, 2, 3, 6, 7, 31, 33, 34].includes(t))).toBe(true);
    await userEvent.setup().click(screen.getByRole('button', { name: `Material del tema ${botones[0]}` }));
    expect(abrir).toHaveBeenCalledWith({ tema: botones[0] }, 'Tu progreso');
  });
});

describe('buscarPrecepto sobre el material real', () => {
  const pinta = (f: string) => {
    const { container } = render(<div>{renderMarkdown(readFileSync(`public/material/${f}`, 'utf8'))}</div>);
    return container as HTMLElement;
  };
  it('esquema BOE: el enlace a su ancla', () => {
    expect(buscarPrecepto(pinta('tema06/lprl-02-1-esquema.md'), 'a5')?.textContent).toMatch(/^Artículo 5\. Objetivos/);
  });
  it('esquema de la Constitución: encabezado «Art. N» (también «Arts. 6 y 7») y línea «**17**»', () => {
    const tp = pinta('constitucion/titulo-preliminar-1-esquema.md');
    expect(buscarPrecepto(tp, 'a1')?.textContent).toMatch(/^Art\. 1 · /);
    expect(buscarPrecepto(tp, 'a7')?.textContent).toMatch(/^Arts\. 6 y 7/);
    cleanup();
    expect(buscarPrecepto(pinta('constitucion/derechos-fundamentales-1-esquema.md'), 'a17')?.textContent).toMatch(/^17 Libertad y seguridad/);
  });
  it('texto completo: «Artículo N»; y nada si no está', () => {
    const c = pinta('constitucion/titulo-preliminar-3-completo.md');
    expect(buscarPrecepto(c, 'a4')?.textContent).toBe('Artículo 4');
    expect(buscarPrecepto(c, 'a40')).toBeNull();
  });
});
