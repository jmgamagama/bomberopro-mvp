/**
 * Preferencia local (localStorage) del tema prioritario de la sesión diaria. Sin Supabase.
 * La bandera de bienvenida vive en ./onboarding (módulo ligero).
 */
import { RECALL_DECKS } from '../data/recallRegistry';

export const PREFERRED_DECK_STORAGE_KEY = 'mira_tema_preferido_v1';

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** Id de mazo prioritario (p. ej. `tema40`) o `null` para «Todos los temas». */
export function getPreferredDeckId(): string | null {
  const id = storage()?.getItem(PREFERRED_DECK_STORAGE_KEY) ?? null;
  return id && RECALL_DECKS.some((d) => d.id === id) ? id : null;
}

export function setPreferredDeckId(id: string | null): void {
  const s = storage();
  if (!s) return;
  if (id && RECALL_DECKS.some((d) => d.id === id)) s.setItem(PREFERRED_DECK_STORAGE_KEY, id);
  else s.removeItem(PREFERRED_DECK_STORAGE_KEY);
}
