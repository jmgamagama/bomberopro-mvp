/**
 * Filtro de temas común a todas las listas de temas (Recuerdo, Bienvenida, Por Temas).
 * Busca por número («25», «t25», «tema 25») o por palabras del nombre, sin tildes ni mayúsculas.
 */
export function normalizeSearch(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function matchesTopic(query: string, tema: number, ...texts: readonly string[]): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const num = q.match(/^(?:t|tema)?\s*(\d{1,2})$/);
  if (num) return Number(num[1]) === tema;
  const hay = normalizeSearch(`tema ${tema} t${tema} ${texts.join(' ')}`);
  return q.split(' ').every((w) => hay.includes(w));
}
