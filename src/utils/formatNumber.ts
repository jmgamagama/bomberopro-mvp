/**
 * Números para el alumno en español: coma decimal y como mucho `maxDecimals` decimales
 * (sin ceros sobrantes: 0 → «0», 1.25 → «1,25», 7.338 → «7,34»).
 */
export function formatDecimal(value: number, maxDecimals = 2, minDecimals = 0): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
    useGrouping: false,
  }).format(value === 0 ? 0 : value);
}

/** Valor de la fórmula oficial con su signo y 3 decimales, como en las bases: «+0,200», «−0,066». */
export function formatPoints(value: number): string {
  const abs = formatDecimal(Math.abs(value), 3, 3);
  return `${value < 0 ? '−' : '+'}${abs}`;
}
