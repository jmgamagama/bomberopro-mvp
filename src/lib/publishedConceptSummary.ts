import { supabase } from './supabase';

export interface PublishedConceptSummary {
  fichas: number;
  temas: number;
}

/** Revalidate when Welcome opens. Missing or denied RPCs leave the copy unnumbered. */
export async function loadPublishedConceptSummary(signal: AbortSignal): Promise<PublishedConceptSummary | null> {
  if (!supabase || signal.aborted) return null;
  try {
    const { data, error } = await supabase
      .rpc('catalogo_publicado_resumen', {}, { get: true })
      .abortSignal(signal);
    if (signal.aborted || error || !Array.isArray(data) || data.length !== 1) return null;

    const { conceptos_publicados: fichas, temas_publicados: temas } = data[0] ?? {};
    if (!Number.isSafeInteger(fichas) || !Number.isSafeInteger(temas) ||
        fichas < 0 || temas < 0 || temas > fichas || (fichas > 0 && temas === 0)) return null;
    return { fichas, temas };
  } catch {
    return null;
  }
}
