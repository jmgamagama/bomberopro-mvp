/**
 * Preferencia local (localStorage) del tema prioritario de la sesión diaria. Sin Supabase.
 * La bandera de bienvenida vive en ./onboarding (módulo ligero).
 *
 * Se guarda un id de TEMA (`tema40`, `tema36`). Un id de lote guardado por versiones
 * anteriores (`tema36-lote02`) se interpreta como su tema (`tema36`).
 */
import { toTopicId } from '../data/recallRegistry';

export const PREFERRED_DECK_STORAGE_KEY = 'mira_tema_preferido_v1';

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** Id del tema prioritario (p. ej. `tema40`, `tema36`) o `null` para «Todos los temas». */
export function getPreferredDeckId(): string | null {
  return toTopicId(storage()?.getItem(PREFERRED_DECK_STORAGE_KEY) ?? null);
}

export function setPreferredDeckId(id: string | null): void {
  const s = storage();
  if (!s) return;
  const topicId = toTopicId(id);
  if (topicId) s.setItem(PREFERRED_DECK_STORAGE_KEY, topicId);
  else s.removeItem(PREFERRED_DECK_STORAGE_KEY);
}
