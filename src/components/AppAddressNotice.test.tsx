// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AppAddressNotice from './AppAddressNotice';

describe('dirección de una instalación', () => {
  it.each(['bomberopro.com', 'www.bomberopro.com', 'localhost', '127.0.0.1', 'vercel.app.ejemplo.test'])('no avisa en %s', hostname => {
    render(<AppAddressNotice hostname={hostname} />);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it.each(['bomberopro-mvp.vercel.app', 'bomberopro-preview-123.vercel.app'])('identifica %s sin afirmar que sea staging ni mover datos', hostname => {
    localStorage.setItem('mira_fichas:demo', 'progreso local');
    render(<AppAddressNotice hostname={hostname} />);
    expect(screen.getByRole('complementary', { name: 'Dirección de esta instalación' })).toHaveTextContent(hostname);
    const link = screen.getByRole('link', { name: /Abrir bomberopro.com/ });
    expect(link).toHaveAttribute('href', 'https://bomberopro.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText(/Conserva esta instalación/)).toBeInTheDocument();
    expect(screen.getByText(/tendrás que iniciar sesión de nuevo/)).toBeInTheDocument();
    expect(localStorage.getItem('mira_fichas:demo')).toBe('progreso local');
    expect(screen.queryByText(/staging|versión antigua|versión de pruebas/i)).not.toBeInTheDocument();
  });
});
