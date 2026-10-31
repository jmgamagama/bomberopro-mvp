// @vitest-environment jsdom
// «Material» solo aparece en los temas que tienen material y abre ese tema.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../test/setup';

const { rpc, from } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { rpc, from } }));
vi.mock('./StudentConsultationModal', () => ({ default: () => null }));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));

import StudyByTopic from './StudyByTopic';

describe('StudyByTopic · botón Material', () => {
  it('aparece en T6 y no en T11; abre el tema pulsado', async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    from.mockReturnValue({ select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [
      { id: 6, numero: 6, nombre: 'LPRL' }, { id: 11, numero: 11, nombre: 'Espumas' },
    ], error: null }) }) }) });
    const abrir = vi.fn();
    render(<StudyByTopic session={{ user: { id: 'u' } }} onNavigateHome={() => {}} onOpenMaterial={abrir} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Material del tema 6' }));
    expect(abrir).toHaveBeenCalledWith(6);
    expect(screen.queryByRole('button', { name: 'Material del tema 11' })).toBeNull();
  });
});
