// @vitest-environment jsdom
import '../test/setup';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecallHub from './RecallHub';
import Onboarding from './Onboarding';
import { getVisibleTopics } from '../data/recallRegistry';

describe('buscador de temas uniforme', () => {
  it('Recuerdo: filtra las pestañas por número y avisa si no hay resultados', async () => {
    const user = userEvent.setup();
    render(<RecallHub onNavigateHome={() => {}} />);
    const box = screen.getByRole('searchbox', { name: /buscar tema/i });
    const t = getVisibleTopics()[0];
    await user.type(box, String(t.tema));
    const tabs = within(screen.getByRole('tablist', { name: 'Temas de recuerdo' })).getAllByRole('tab');
    expect(tabs).toHaveLength(1);
    expect(tabs[0]).toHaveAccessibleName(new RegExp(`^${t.shortLabel} ·`));
    await user.clear(box);
    await user.type(box, 'zzzz');
    expect(screen.getByText(/ningún tema coincide/i)).toBeInTheDocument();
  });

  it('Bienvenida: el mismo buscador filtra los temas y mantiene «Todos los temas»', async () => {
    const user = userEvent.setup();
    render(<Onboarding onStart={() => {}} onSkip={() => {}} />);
    const t = getVisibleTopics()[0];
    await user.type(screen.getByRole('searchbox', { name: /buscar tema/i }), `tema ${t.tema}`);
    const radios = within(screen.getByRole('radiogroup', { name: 'Tema para la sesión diaria' })).getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveTextContent('Todos los temas');
  });
});
