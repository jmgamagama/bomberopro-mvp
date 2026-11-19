import { supabase } from './supabase';

export interface PublishedConceptSummary {
  fichas: number;
  temas: number;
}

/**
 * Only SELECTs topic IDs: count(*) and count(distinct topic_id) for published concepts.
 * Pagination avoids Supabase's row cap. NULL topics do not count, as in SQL.
 * Current production access is authenticated-only; denied/offline reads return null.
 * No registry fallback: recall cards are a different inventory.
 */
export async function loadPublishedConceptSummary(signal: AbortSignal): Promise<PublishedConceptSummary | null> {
  if (!supabase) return null;
  const topics = new Set<number | string>();
  let received = 0;
  let total: number | null = null;
  try {
    do {
      const { data, count, error } = await supabase
        .from('concepts')
        .select('topic_id', { count: 'exact' })
        .eq('estado', 'publicado')
        .order('id', { ascending: true })
        .range(received, received + 499)
        .abortSignal(signal);
      if (signal.aborted || error || !Array.isArray(data) || count === null ||
          !Number.isSafeInteger(count) || count < 0 ||
          (total !== null && total !== count)) return null;
      total = count;
      if (data.length === 0 && received < total) return null;
      for (const row of data) {
        if (row.topic_id !== null) {
          if (typeof row.topic_id !== 'number' && typeof row.topic_id !== 'string') return null;
          topics.add(row.topic_id);
        }
      }
      received += data.length;
      if (received > total) return null;
    } while (received < total);
    return { fichas: total, temas: topics.size };
  } catch {
    return null;
  }
}
