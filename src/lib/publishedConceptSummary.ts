import { supabase } from './supabase';

/** Totales públicos del catálogo: preguntas publicadas y temas con preguntas (convocatoria CPEI Badajoz). */
export interface PublishedConceptSummary {
  preguntas: number;
  temas: number;
}

/**
 * Llama a `get_catalogo_publico` (migración 63): solo devuelve dos números, sin contenido.
 * Si falla, está offline o la respuesta no es válida, devuelve null y la web no anuncia cifras.
 * Sin respaldo local: el registro de fichas es otro inventario.
 */
export async function loadPublishedConceptSummary(signal: AbortSignal): Promise<PublishedConceptSummary | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc('get_catalogo_publico').abortSignal(signal);
    if (signal.aborted || error) return null;
    const row = Array.isArray(data) ? data[0] : data;
    const p = row?.preguntas;
    const t = row?.temas;
    if (!Number.isSafeInteger(p) || !Number.isSafeInteger(t) || p < 0 || t < 0) return null;
    return { preguntas: p, temas: t };
  } catch {
    return null;
  }
}
