/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConfidenceLevel = 'baja' | 'media' | 'alta';

export type QuestionLevel = 'N1' | 'N2' | 'N3';

export type QuestionType =
  | 'test_literal'
  | 'test_confusion'
  | 'verdadero_falso'
  | 'completar_huecos'
  | 'pregunta_inversa'
  | 'ordenacion'
  | 'recuerdo_libre'
  | 'pregunta_trampa'
  | 'discriminacion';

export type MemoryStatus =
  | 'Nuevo'
  | 'En aprendizaje'
  | 'Débil'
  | 'Inseguro'
  | 'Falso dominio'
  | 'Consolidando'
  | 'Consolidado'
  | 'Dominado';

export type ErrorTag =
  | 'Error literal'
  | 'Confusión de conceptos'
  | 'Enumeración incompleta'
  | 'Exceso de confianza'
  | 'Lectura rápida'
  | 'Error por parecido entre opciones'
  | 'Falta de memoria activa';

export interface User {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Microconcept {
  id: string; // e.g. 'MC-ART1-001'
  topic_id: string;
  article: string; // e.g. '1.1'
  text: string;
  explanation: string;
  difficulty: 'baja' | 'media' | 'alta';
  confusion_risk: 'bajo' | 'medio' | 'alto' | 'muy alto';
  type: string; // e.g. 'definición constitucional', 'enumeración literal'
}

export interface Question {
  id: string;
  microconcept_id: string;
  level: QuestionLevel;
  type: QuestionType;
  question: string;
  options?: string[]; // empty for open questions like memory/ordering if applicable, but we will provide choices for tests
  correct_answer: string;
  explanation: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  question_id: string;
  microconcept_id: string;
  answer_user: string;
  correct: boolean;
  confidence: ConfidenceLevel;
  response_time_seconds: number;
  answer_changes: number;
  created_at: string; // ISO string
}

export interface MemoryState {
  user_id: string;
  microconcept_id: string;
  mastery_score: number; // Dominio Real: 0 to 100
  memory_stability: number; // in days
  retrievability: number; // 0 to 1
  status: MemoryStatus;
  last_review: string | null; // ISO string
  next_review: string | null; // ISO string
  consecutive_correct: number;
  recent_errors_count: number;
  error_tag?: ErrorTag | null;
}
