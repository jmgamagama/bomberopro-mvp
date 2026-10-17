/**
 * Plan de estudio del alumno: fecha de examen PREVISTA que pone él mismo y ritmo necesario.
 * 100 % local y por cuenta (`<clave>:<userId|demo>`, igual que el repaso espaciado; ./localOwner).
 *
 * La fecha oficial del examen de la convocatoria CPEI Badajoz 2026 (BOP n.º 135, 17/07/2026,
 * anuncio 2843/2026) NO está publicada (src/data/convocatoria.ts, `fechaExamen: null`). Aquí
 * nunca se inventa: solo se usa la fecha que escribe el alumno, y la interfaz lo dice así.
 */
import { dayNumberFromKey, localDayNumber } from './localDate';
import { ownedKey, readOwned, writeOwned } from './localOwner';

export const EXAM_DATE_STORAGE_KEY = 'mira_fecha_examen_v1';
export const examDateStorageKey = (): string => ownedKey(EXAM_DATE_STORAGE_KEY);

/** Días antes del examen a partir de los cuales la sesión prioriza repasar sobre fichas nuevas. */
export const FINAL_STRETCH_DAYS = 14;

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** ¿Es una fecha real con formato YYYY-MM-DD? */
export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d && y >= 2000 && y <= 2100;
}

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

/** Fecha prevista (YYYY-MM-DD) que puso el alumno, o null. */
export function getExamDate(): string | null {
  if (!hasStorage()) return null;
  const raw = readOwned(EXAM_DATE_STORAGE_KEY);
  return isValidDateKey(raw) ? raw : null;
}

/** Guarda (o borra con null / valor no válido) la fecha prevista. */
export function setExamDate(value: string | null): void {
  if (!hasStorage()) return;
  try {
    writeOwned(EXAM_DATE_STORAGE_KEY, isValidDateKey(value) ? value : null);
  } catch {
    // Almacenamiento lleno o bloqueado: la app sigue sin fecha.
  }
}

/** Días naturales desde hoy hasta la fecha (0 = hoy; negativo = ya pasó). */
export function daysUntil(dateKey: string, today: Date = new Date()): number {
  return dayNumberFromKey(dateKey) - localDayNumber(today);
}

export type ExamPace =
  | { status: 'sin-fecha' }
  | { status: 'pasada'; examDate: string; daysLeft: number }
  | { status: 'hoy'; examDate: string; daysLeft: 0 }
  | { status: 'en-curso'; examDate: string; daysLeft: number; remaining: number; perDay: number; finalStretch: boolean };

/**
 * Cuenta atrás y ritmo: `remaining` fichas sin consolidar repartidas entre los días que faltan.
 * (Se cuenta hasta el día anterior al examen: con 1 día de margen, perDay = remaining.)
 */
export function computeExamPace(examDate: string | null, remaining: number, today: Date = new Date()): ExamPace {
  if (!examDate || !isValidDateKey(examDate)) return { status: 'sin-fecha' };
  const daysLeft = daysUntil(examDate, today);
  if (daysLeft < 0) return { status: 'pasada', examDate, daysLeft };
  if (daysLeft === 0) return { status: 'hoy', examDate, daysLeft: 0 };
  const rest = Math.max(0, remaining);
  return {
    status: 'en-curso',
    examDate,
    daysLeft,
    remaining: rest,
    perDay: Math.ceil(rest / daysLeft),
    finalStretch: daysLeft <= FINAL_STRETCH_DAYS,
  };
}

/** `2026-11-20` → `20/11/2026`. */
export function formatDateEs(dateKey: string): string {
  const [y, m, d] = dateKey.split('-');
  return `${d}/${m}/${y}`;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Texto sencillo de cuenta atrás y ritmo. */
export function describeExamPace(p: ExamPace): string {
  switch (p.status) {
    case 'sin-fecha':
      return 'Si quieres, pon la fecha que esperas para tu examen y te diremos a qué ritmo ir. La fecha oficial aún no se ha publicado.';
    case 'pasada':
      return `La fecha que pusiste (${formatDateEs(p.examDate)}) ya ha pasado. Cámbiala o bórrala.`;
    case 'hoy':
      return 'Hoy es la fecha que pusiste para tu examen. ¡Mucho ánimo!';
    case 'en-curso': {
      const faltan = `${p.daysLeft === 1 ? 'Falta' : 'Faltan'} ${plural(p.daysLeft, 'día', 'días')} para tu fecha prevista (${formatDateEs(p.examDate)}).`;
      if (p.remaining === 0) return `${faltan} Tienes todas las fichas consolidadas: sigue repasando las que te toquen.`;
      const quedan = `${p.remaining === 1 ? 'Te queda' : 'Te quedan'} ${plural(p.remaining, 'ficha', 'fichas')}`;
      return `${faltan} ${quedan} por consolidar: unas ${p.perDay} al día.`;
    }
  }
}
