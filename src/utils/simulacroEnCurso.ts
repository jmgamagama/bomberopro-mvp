/**
 * Simulacro a medias que sobrevive a una pérdida de sesión (cierre de sesión en otra pestaña u otro
 * dispositivo, o renovación del token rechazada). Al perderse la sesión la app muestra el acceso y
 * desmonta el simulacro; sin esto se perdían todas sus respuestas.
 *
 * - Solo en memoria de ESTA pestaña: no se escribe en localStorage ni sale del dispositivo, y no
 *   sobrevive a una recarga (eso sigue avisándose con beforeunload).
 * - Uno por cuenta (id de usuario): otra cuenta nunca recibe el intento de otra.
 * - Se descarta al terminar el simulacro o cuando el alumno sale a propósito y lo confirma.
 */
import type { ConfidenceLevel, Question } from '../types';

export interface SimulacroEnCurso {
  questions: Question[];
  answers: Record<string, string>;
  confidences: Record<string, ConfidenceLevel>;
  responseTimes: Record<string, number>;
  answerChanges: Record<string, number>;
  currentIdx: number;
  startTime: number;
  sampleMode: boolean;
  blueprintWarning: string | null;
  examSeed: number | null;
}

const enCurso = new Map<string, SimulacroEnCurso>();

export function guardarSimulacroEnCurso(cuenta: string, s: SimulacroEnCurso): void {
  enCurso.set(cuenta, s);
}

export function recuperarSimulacroEnCurso(cuenta: string): SimulacroEnCurso | null {
  return enCurso.get(cuenta) ?? null;
}

/** Sin cuenta: descarta todos (salida voluntaria confirmada en esta pestaña). */
export function descartarSimulacroEnCurso(cuenta?: string): void {
  if (cuenta === undefined) enCurso.clear();
  else enCurso.delete(cuenta);
}
