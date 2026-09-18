// @vitest-environment jsdom

import '../test/setup';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StudentConsultation, {
  StudentConsultationModal,
  CONSULTATION_REASONS,
} from './StudentConsultationModal';

describe('StudentConsultationModal', () => {
  it('no se muestra cuando isOpen es false', () => {
    render(<StudentConsultationModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('abre un diálogo accesible con los cuatro motivos requeridos y el aviso de revisión', () => {
    render(<StudentConsultationModal isOpen={true} onClose={vi.fn()} context="Dashboard" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'consultation-dialog-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'consultation-dialog-description');

    // Explica brevemente que el equipo revisará la consulta
    expect(
      screen.getByText(/el equipo revisará tu consulta de forma personalizada/i),
    ).toBeInTheDocument();

    // Comprobar los 4 motivos exactos
    CONSULTATION_REASONS.forEach((reason) => {
      expect(screen.getByRole('radio', { name: new RegExp(reason, 'i') })).toBeInTheDocument();
    });
  });

  it('genera un enlace mailto dirigido a ahoraopositando@gmail.com con asunto contextual', async () => {
    const user = userEvent.setup();
    render(
      <StudentConsultationModal
        isOpen={true}
        onClose={vi.fn()}
        defaultReason="Tests y simulacros"
        context="Simulacro 1"
      />,
    );

    const mailLink = screen.getByRole('link', { name: /abrir correo con asunto preparado/i });
    expect(mailLink).toHaveAttribute('href');

    const href = mailLink.getAttribute('href') || '';
    expect(href).toContain('mailto:ahoraopositando@gmail.com');
    expect(decodeURIComponent(href)).toContain('Consulta: Tests y simulacros (Simulacro 1)');

    // Cambiar a "Pruebas físicas y psicotécnicos"
    const fisicasRadio = screen.getByRole('radio', { name: /pruebas físicas y psicotécnicos/i });
    await user.click(fisicasRadio);

    const updatedHref = mailLink.getAttribute('href') || '';
    expect(decodeURIComponent(updatedHref)).toContain('Consulta: Pruebas físicas y psicotécnicos (Simulacro 1)');
  });

  it('incluye notas del opositor en el cuerpo del correo sin persistir en base de datos', async () => {
    const user = userEvent.setup();
    render(
      <StudentConsultationModal
        isOpen={true}
        onClose={vi.fn()}
        defaultReason="Temario y estudio"
        context="Tema 3"
      />,
    );

    const textarea = screen.getByPlaceholderText(/escribe brevemente tu duda/i);
    await user.type(textarea, 'Tengo dudas sobre los artículos 2 y 3.');

    const mailLink = screen.getByRole('link', { name: /abrir correo con asunto preparado/i });
    const href = decodeURIComponent(mailLink.getAttribute('href') || '');
    expect(href).toContain('Tengo dudas sobre los artículos 2 y 3.');
  });

  it('permite cerrar el diálogo mediante botón de cerrar, cancelar y tecla Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <StudentConsultationModal isOpen={true} onClose={onClose} />,
    );

    // Cerrar con botón X
    await user.click(screen.getByLabelText(/cerrar diálogo de consulta/i));
    expect(onClose).toHaveBeenCalledTimes(1);

    // Cerrar con botón Cancelar
    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalledTimes(2);

    // Cerrar con Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);

    // Si se cierra, desaparece
    rerender(<StudentConsultationModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('StudentConsultation componente contenedor', () => {
  it('renderiza la variante card y abre el modal al interactuar', async () => {
    const user = userEvent.setup();
    render(<StudentConsultation variant="card" context="Dashboard" />);

    expect(screen.getByText('¿Dudas en tu preparación?')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /consultar al equipo/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renderiza la variante button, abre el modal y devuelve el foco al cerrarse con Escape', async () => {
    const user = userEvent.setup();
    render(<StudentConsultation variant="button" context="Entrenamiento" />);

    const button = screen.getByRole('button', { name: /consultar duda/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Pulsar Escape para cerrar
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    // El foco regresa al botón disparador
    expect(document.activeElement).toBe(button);
  });
});
