/** Utilidades de fecha LOCAL (día natural del opositor), sin zonas UTC de por medio. */

/** Fecha local YYYY-MM-DD. */
export function toLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Nº de día absoluto (días desde 1970-01-01) para una fecha local YYYY-MM-DD. */
export function dayNumberFromKey(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Nº de día absoluto de la fecha local de `date`. */
export function localDayNumber(date: Date = new Date()): number {
  return dayNumberFromKey(toLocalDateKey(date));
}
