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
import { CONVOCATORIA_CPEI_2026 } from '../data/convocatoria';

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

// ── Sesión por minutos ──────────────────────────────────────────────────────────────────────

export const DAILY_MINUTES_STORAGE_KEY = 'mira_minutos_dia_v1';
export const dailyMinutesStorageKey = (): string => ownedKey(DAILY_MINUTES_STORAGE_KEY);
export const DAILY_MINUTES_OPTIONS = [10, 20, 30] as const;
export type DailyMinutes = (typeof DAILY_MINUTES_OPTIONS)[number];

/**
 * Segundos por ficha cuando aún no hay datos propios: 40 s (leer la pregunta, intentar recordar,
 * mostrar la respuesta, compararla con la fuente y autoevaluarse). Es una estimación prudente:
 * mejor acabar antes que pasarse del tiempo elegido. Con 40 s: 10 min ≈ 15 fichas,
 * 20 min ≈ 30 (la sesión de siempre) y 30 min ≈ 45.
 */
export const DEFAULT_SECONDS_PER_CARD = 40;
/** Repasos cronometrados necesarios para usar el tiempo propio del alumno. */
export const MIN_TIMED_SAMPLES = 10;
/** Se usan los últimos N repasos cronometrados (el ritmo cambia con la práctica). */
export const TIMED_WINDOW = 100;
/** Repasos de menos de 3 s (toque sin leer) o más de 5 min (pausa) no cuentan para la media. */
export const MIN_SAMPLE_MS = 3_000;
export const MAX_SAMPLE_MS = 300_000;
/** Límites del tiempo por ficha estimado y del tamaño de la sesión por minutos. */
export const MIN_SECONDS_PER_CARD = 10;
export const MAX_SECONDS_PER_CARD = 120;
export const MIN_SESSION_CARDS = 5;
export const MAX_SESSION_CARDS = 90;

export function getDailyMinutes(): DailyMinutes | null {
  if (!hasStorage()) return null;
  const n = Number(readOwned(DAILY_MINUTES_STORAGE_KEY));
  return (DAILY_MINUTES_OPTIONS as readonly number[]).includes(n) ? (n as DailyMinutes) : null;
}

/** Guarda los minutos al día (null = sesión de siempre, por número de fichas). */
export function setDailyMinutes(value: number | null): void {
  if (!hasStorage()) return;
  const ok = value !== null && (DAILY_MINUTES_OPTIONS as readonly number[]).includes(value);
  try {
    writeOwned(DAILY_MINUTES_STORAGE_KEY, ok ? String(value) : null);
  } catch {
    // Almacenamiento lleno o bloqueado.
  }
}

export interface PaceEstimate {
  secondsPerCard: number;
  /** 'registro' = mediana de tus repasos; 'inicial' = DEFAULT_SECONDS_PER_CARD. */
  source: 'registro' | 'inicial';
  samples: number;
}

/** Tiempo por ficha: mediana de los últimos repasos cronometrados del registro local. */
export function estimateSecondsPerCard(log: readonly { ms?: number }[]): PaceEstimate {
  const samples = log
    .filter((e) => typeof e.ms === 'number' && e.ms >= MIN_SAMPLE_MS && e.ms <= MAX_SAMPLE_MS)
    .slice(-TIMED_WINDOW)
    .map((e) => e.ms as number)
    .sort((a, b) => a - b);
  if (samples.length < MIN_TIMED_SAMPLES) {
    return { secondsPerCard: DEFAULT_SECONDS_PER_CARD, source: 'inicial', samples: samples.length };
  }
  const mid = Math.floor(samples.length / 2);
  const median = samples.length % 2 ? samples[mid] : (samples[mid - 1] + samples[mid]) / 2;
  const secs = Math.round(median / 1000);
  return {
    secondsPerCard: Math.min(MAX_SECONDS_PER_CARD, Math.max(MIN_SECONDS_PER_CARD, secs)),
    source: 'registro',
    samples: samples.length,
  };
}

/** Fichas que caben en `minutes` minutos a `secondsPerCard` segundos por ficha. */
export function cardsForMinutes(minutes: number, secondsPerCard: number): number {
  const n = Math.floor((minutes * 60) / Math.max(1, secondsPerCard));
  return Math.min(MAX_SESSION_CARDS, Math.max(MIN_SESSION_CARDS, n));
}

/**
 * Tamaño de la sesión diaria. Sin minutos elegidos: el del plan (30, o 10 en Gratis), como siempre.
 * Con minutos: las fichas que caben según tu ritmo; en el plan Gratis nunca supera su límite.
 */
export function resolveDailySessionSize(
  planSize: number,
  minutes: number | null,
  log: readonly { ms?: number }[],
  isFreePlan: boolean,
): number {
  if (minutes === null) return planSize;
  const n = cardsForMinutes(minutes, estimateSecondsPerCard(log).secondsPerCard);
  return isFreePlan ? Math.min(planSize, n) : n;
}

/** ¿Toca el tramo final (repasar antes que fichas nuevas)? Incluye el propio día del examen. */
export function isFinalStretch(examDate: string | null, today: Date = new Date()): boolean {
  if (!examDate || !isValidDateKey(examDate)) return false;
  const d = daysUntil(examDate, today);
  return d >= 0 && d <= FINAL_STRETCH_DAYS;
}

// ── Consejo cuando el ritmo es demasiado alto ───────────────────────────────────────────────

/** Por encima de unas 40 fichas nuevas o pendientes al día, el ritmo cuesta mantenerlo. */
export const HEAVY_PACE_CARDS = 40;

export interface PaceAdviceInput {
  pace: ExamPace;
  /** Minutos al día elegidos (null = sesión de siempre). */
  minutes: number | null;
  /** Fichas de la sesión con los minutos elegidos (tras límites del plan). */
  sessionSize: number;
  /** Fichas que cabrían con 30 min (para sugerir subir el tiempo). */
  cardsAt30: number;
  /** Tema prioritario y sus fichas por consolidar, si lo hay. */
  preferred?: { label: string; remaining: number } | null;
  /**
   * Fichas por consolidar de los temas con peso oficial (temas 35 a 40: el 30 % del test según las
   * bases, src/data/convocatoria.ts). Solo se usa si no hay tema prioritario.
   */
  weighted?: { remaining: number } | null;
}

/** Límite a partir del cual el ritmo se considera excesivo. */
export function paceLimit(minutes: number | null, sessionSize: number): number {
  return minutes !== null ? sessionSize : HEAVY_PACE_CARDS;
}

/**
 * Mensaje honesto y motivador cuando el ritmo necesario supera lo que cabe al día, con una
 * alternativa concreta. null si el ritmo es asumible o no hay fecha en curso.
 * No inventa pesos de temas: solo cita el dato oficial de las bases (temas 35 a 40) o, si hay,
 * el tema prioritario del alumno.
 */
export function describePaceAdvice(input: PaceAdviceInput): string | null {
  const { pace, minutes, sessionSize, cardsAt30 } = input;
  if (pace.status !== 'en-curso' || pace.remaining === 0) return null;
  const limit = paceLimit(minutes, sessionSize);
  if (pace.perDay <= limit) return null;
  const perDay = (n: number) => Math.ceil(n / pace.daysLeft);
  const parts: string[] = [
    minutes !== null
      ? `Es un ritmo alto: con ${minutes} min al día caben unas ${sessionSize} fichas. No hace falta llegar a todo para avanzar.`
      : `Es un ritmo alto: más de ${HEAVY_PACE_CARDS} fichas al día cuesta mantenerlo. No hace falta llegar a todo para avanzar.`,
  ];
  const { preferred, weighted } = input;
  const peso = CONVOCATORIA_CPEI_2026.pesoTemasLocales;
  if (preferred && preferred.remaining > 0) {
    parts.push(`Céntrate primero en ${preferred.label}: te quedan ${preferred.remaining} fichas, unas ${perDay(preferred.remaining)} al día.`);
  } else if (weighted && weighted.remaining > 0 && weighted.remaining < pace.remaining) {
    parts.push(
      `Empieza por los temas ${peso.temaDesde} a ${peso.temaHasta}, que según las bases son el ${peso.porcentaje} % de las preguntas del test: te quedan ${weighted.remaining} fichas, unas ${perDay(weighted.remaining)} al día. Elige uno como tema prioritario.`,
    );
  } else {
    parts.push('Elige un tema prioritario para avanzar por partes.');
  }
  if (minutes !== null && minutes < 30 && cardsAt30 > sessionSize) {
    parts.push(`Si puedes, sube a 30 min al día (unas ${cardsAt30} fichas).`);
  }
  parts.push('Cada repaso cuenta.');
  return parts.join(' ');
}
