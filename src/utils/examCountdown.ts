/** Días hasta el examen. Solo con fecha oficial en el repo (convocatoria.ts); si no, null. */
export function daysUntilExam(fechaExamen: string | null, now: Date = new Date()): number | null {
  if (!fechaExamen || !/^\d{4}-\d{2}-\d{2}$/.test(fechaExamen)) return null;
  const [y, m, d] = fechaExamen.split('-').map(Number);
  const exam = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((exam - today) / 86_400_000);
}

export function describeExamDate(fechaExamen: string | null, now: Date = new Date()): string {
  const days = daysUntilExam(fechaExamen, now);
  if (days === null) return 'Fecha del examen: pendiente de publicar';
  if (days < 0) return 'El examen ya se ha celebrado';
  if (days === 0) return 'El examen es hoy';
  return `Faltan ${days} ${days === 1 ? 'día' : 'días'} para el examen`;
}
