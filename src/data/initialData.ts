/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Microconcept, Question } from '../types';
import { INITIAL_MICROCONCEPTS_INTERNOS, INITIAL_QUESTIONS_INTERNOS } from './initialDataInterno';

/**
 * Las preguntas de muestra de T38, SOS (T39) y T40 salen de material interno del CPEI y viven en
 * ./initialDataInterno (mismo orden). Con VITE_INTERNAL_DECKS_FROM_SERVER (o la bandera Pro) no entran
 * en el build: la muestra de invitado se queda con las de fuente pública. Ver docs/MAZOS_INTERNOS_SERVIDOR.md.
 */
const INTERNAL_FROM_SERVER =
  import.meta.env.VITE_PRO_DECKS_FROM_SERVER === 'true' || import.meta.env.VITE_INTERNAL_DECKS_FROM_SERVER === 'true';

export const INITIAL_TOPICS = [
  { id: 'T-CE', name: 'Constitución Española - Título Preliminar' },
  { id: 'T35', name: 'Tema 35 · Red de carreteras de Extremadura (provincia de Badajoz)' },
  { id: 'T38', name: 'Tema 38 · ITF CPEI: horario, vestuario/EPIs y limpieza de EPIs' },
  { id: 'T39', name: 'Tema 39 · Protocolo de movilización CPEI + SOS operativo + SOS personal' },
  { id: 'T40', name: 'Tema 40 · Procedimientos de trabajo CPEI-Badajoz' }
];

export const INITIAL_MICROCONCEPTS: Microconcept[] = [
  {
    id: 'MC-ART1-001',
    topic_id: 'T-CE',
    article: '1.1',
    text: 'España se constituye en un Estado social y democrático de Derecho.',
    explanation: 'Define la naturaleza política y jurídica del Estado español. Ojo al orden literal de los adjetivos ("social y democrático", no al revés ni otros sinónimos como "constitucional" o "popular" en este punto).',
    difficulty: 'baja',
    confusion_risk: 'alto',
    type: 'definición constitucional'
  },
  {
    id: 'MC-ART1-002',
    topic_id: 'T-CE',
    article: '1.1',
    text: 'Los valores superiores del ordenamiento jurídico son la libertad, la justicia, la igualdad y el pluralismo político.',
    explanation: 'El ordenamiento jurídico español propugna exactamente cuatro valores superiores esenciales. Es común meter falsos valores como la solidaridad, la seguridad o la democracia en las preguntas trampa.',
    difficulty: 'alta',
    confusion_risk: 'muy alto',
    type: 'enumeración literal'
  },
  {
    id: 'MC-ART1-003',
    topic_id: 'T-CE',
    article: '1.2',
    text: 'La soberanía nacional reside en el pueblo español.',
    explanation: 'La soberanía nacional pertenece estrictamente al "pueblo español". Las trampas comunes cambian esto por "Estado español", "Nación española" o "Cortes Generales".',
    difficulty: 'baja',
    confusion_risk: 'medio',
    type: 'principio constitucional'
  },
  {
    id: 'MC-ART1-004',
    topic_id: 'T-CE',
    article: '1.2',
    text: 'Del pueblo español emanan los poderes del Estado.',
    explanation: 'Establece una relación de causalidad democrática: los poderes del Estado no son autónomos, surgen directa y legítimamente del pueblo.',
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'relación causal'
  },
  {
    id: 'MC-ART1-005',
    topic_id: 'T-CE',
    article: '1.3',
    text: 'La forma política del Estado español es la Monarquía parlamentaria.',
    explanation: 'Define la jefatura del Estado y el sistema de gobierno. Una trampa habitual es llamarla "Monarquía constitucional" o "Monarquía democrática", que aunque describe el régimen, no es el término literal de la Carta Magna.',
    difficulty: 'baja',
    confusion_risk: 'medio',
    type: 'forma política'
  },
  {
    id: "CPEI-T35-S01-D067024BDE",
    topic_id: 'T35',
    article: "Decreto 98/2008, anexo",
    text: "¿Qué tres categorías ordinarias emplea el catálogo? Red básica, red intercomarcal y red local.",
    explanation: "Ficha revisada del tema 35. Fuente: Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura — anexo, columna «Categoría»: básica, intercomarcal y local, además de autovía autonómica (DOE n.º 103, 29/05/2008, pp. 14496-14500).",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  {
    id: "CPEI-T35-S01-57F9BFBC83",
    topic_id: 'T35',
    article: "Ley 37/2015, art. 4.1",
    text: "¿Qué administración es titular de A y N de la Red de Carreteras del Estado? La Administración General del Estado, a través del ministerio competente en carreteras.",
    explanation: "Ficha revisada del tema 35. Fuente: Ley 37/2015, de 29 de septiembre, de carreteras (BOE-A-2015-10439) — art. 4.1 y anexo II (Catálogo de la Red de Carreteras del Estado).",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  {
    id: "CPEI-T35-S03-99DDF8B8E0",
    topic_id: 'T35',
    article: "Decreto 98/2008, anexo",
    text: "¿Cuál es el itinerario de la EX-100? Cáceres–Badajoz",
    explanation: "Ficha revisada del tema 35. Fuente: Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura — Decreto 98/2008, anexo.",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_MICROCONCEPTS_INTERNOS[0]]),
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_MICROCONCEPTS_INTERNOS[1]]),
  {
    id: "CPEI-T39-MOV-089",
    topic_id: 'T39',
    article: "PDF p. 26",
    text: "Para deletrear, ¿qué código fonético se utiliza? El código fonético internacional ICAO.",
    explanation: "Ficha revisada del tema 39. Fuente: Protocolo de movilización ante siniestros CPEI Badajoz (BOP Badajoz n.º 224, anuncio 4899/2025, 24/11/2025; 34 págs.; incluye protocolo de radiocomunicaciones y anexo SOS) — PDF p. 26.",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_MICROCONCEPTS_INTERNOS[2]]),
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_MICROCONCEPTS_INTERNOS[3]]),
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_MICROCONCEPTS_INTERNOS[4]]),
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_MICROCONCEPTS_INTERNOS[5]])
];

/**
 * Banco público local (simulacro de invitado y demo): 15 preguntas de 3 opciones (como las bases).
 * - 10 de los temas 35-40 (2026-10-28), creadas a partir de fichas YA REVISADAS
 *   (src/data/recallReview.ts: tema35, tema38, tema39, tema40; el 36 está pendiente y el 37 sin contenido).
 *   Reparto: T35 ×3, T38 ×2, T39 ×2, T40 ×3. La correcta es literal de la ficha y lleva su fuente;
 *   ningún distractor es más largo que la correcta (src/data/initialData.test.ts lo comprueba).
 * - 5 del artículo 1 de la Constitución (tema 1), una por microconcepto.
 */
export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'Q-ART1-001-N1',
    microconcept_id: 'MC-ART1-001',
    level: 'N1',
    type: 'test_literal',
    question: 'Según el Artículo 1.1 de la Constitución, España se constituye en un:',
    options: ["Estado social y democrático de Derecho", "Estado democrático y social de Derecho", "Estado social y liberal de Derecho"],
    correct_answer: 'Estado social y democrático de Derecho',
    explanation: 'El artículo 1.1 establece textualmente que España se constituye en un "Estado social y democrático de Derecho" en este preciso orden.',
    fuente: "Constitución Española, art. 1.1",
    cita: "España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político.",
    tema: { numero: 1, titulo: "La Constitución Española de 1978" }
  },
  {
    id: 'Q-ART1-002-N1',
    microconcept_id: 'MC-ART1-002',
    level: 'N1',
    type: 'test_literal',
    question: 'Según el artículo 1.1 de la Constitución Española, ¿cuáles son los valores superiores de su ordenamiento jurídico?',
    options: ["La libertad, la justicia, la igualdad y la soberanía nacional.", "La libertad, la justicia, la igualdad y el pluralismo político.", "La justicia, la solidaridad, la igualdad y la autonomía."],
    correct_answer: 'La libertad, la justicia, la igualdad y el pluralismo político.',
    explanation: 'El artículo 1.1 cita de forma explícita e inequívoca estos cuatro valores superiores: libertad, justicia, igualdad y pluralismo político.',
    fuente: "Constitución Española, art. 1.1",
    cita: "España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político.",
    tema: { numero: 1, titulo: "La Constitución Española de 1978" }
  },
  {
    id: 'Q-ART1-003-N3',
    microconcept_id: 'MC-ART1-003',
    level: 'N3',
    type: 'pregunta_inversa',
    question: 'Si afirmamos que "del pueblo español emanan los poderes del Estado", ¿qué principio fundamental consagrado en el Artículo 1.2 sustenta directamente esta afirmación?',
    options: ["La constitución de un Estado social de Derecho.", "El principio de legalidad y de jerarquía de los órganos del Estado.", "Que la soberanía nacional reside en el pueblo español."],
    correct_answer: 'Que la soberanía nacional reside en el pueblo español.',
    explanation: 'El Artículo 1.2 conecta conceptualmente la soberanía del pueblo con el hecho de que de él emanen los poderes estatales.',
    fuente: "Constitución Española, art. 1.2",
    cita: "La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.",
    tema: { numero: 1, titulo: "La Constitución Española de 1978" }
  },
  {
    id: 'Q-ART1-004-N1',
    microconcept_id: 'MC-ART1-004',
    level: 'N1',
    type: 'test_literal',
    question: 'Según la Constitución Española, ¿de dónde emanan los poderes del Estado?',
    options: ["Del Estado español", "Del pueblo español", "De la Constitución"],
    correct_answer: 'Del pueblo español',
    explanation: 'El artículo 1.2 concluye: "...del que [el pueblo español] emanan los poderes del Estado".',
    fuente: "Constitución Española, art. 1.2",
    cita: "La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.",
    tema: { numero: 1, titulo: "La Constitución Española de 1978" }
  },
  {
    id: 'Q-ART1-005-N1',
    microconcept_id: 'MC-ART1-005',
    level: 'N1',
    type: 'test_literal',
    question: 'Según el Artículo 1.3 de la Constitución, ¿cuál es la forma política del Estado español?',
    options: ["La República parlamentaria", "La Monarquía democrática", "La Monarquía parlamentaria"],
    correct_answer: 'La Monarquía parlamentaria',
    explanation: 'El texto dice de manera literal e inequívoca: "La forma política del Estado español es la Monarquía parlamentaria."',
    fuente: "Constitución Española, art. 1.3",
    cita: "La forma política del Estado español es la Monarquía parlamentaria.",
    tema: { numero: 1, titulo: "La Constitución Española de 1978" }
  },
  // Tema 35 · ficha CPEI-T35-S01-D067024BDE (revisada)
  {
    id: "Q-CPEI-T35-S01-D067024BDE",
    microconcept_id: "CPEI-T35-S01-D067024BDE",
    level: 'N1',
    type: 'test_literal',
    question: "Según el Decreto 98/2008, ¿qué tres categorías ordinarias emplea el catálogo de carreteras de Extremadura?",
    options: ["Red básica, red complementaria y red local.", "Red básica, red intercomarcal y red local.", "Red estatal, red regional y red local."],
    correct_answer: "Red básica, red intercomarcal y red local.",
    explanation: "Ficha: «Red básica, red intercomarcal y red local.» Fuente: Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura — anexo, columna «Categoría»: básica, intercomarcal y local, además de autovía autonómica (DOE n.º 103, 29/05/2008, pp. 14496-14500).",
    fuente: "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura — anexo, columna «Categoría»: básica, intercomarcal y local, además de autovía autonómica (DOE n.º 103, 29/05/2008, pp. 14496-14500)",
    tema: { numero: 35, titulo: "Red de carreteras de Extremadura (provincia de Badajoz)" }
  },
  // Tema 35 · ficha CPEI-T35-S01-57F9BFBC83 (revisada)
  {
    id: "Q-CPEI-T35-S01-57F9BFBC83",
    microconcept_id: "CPEI-T35-S01-57F9BFBC83",
    level: 'N1',
    type: 'test_literal',
    question: "¿Qué administración es titular de las carreteras A y N de la Red de Carreteras del Estado?",
    options: ["La Junta de Extremadura, a través de su consejería competente en materia de carreteras.", "La Administración General del Estado, a través del ministerio competente en carreteras.", "Las Diputaciones Provinciales, a través de sus servicios provinciales de vías y obras."],
    correct_answer: "La Administración General del Estado, a través del ministerio competente en carreteras.",
    explanation: "Ficha: «La Administración General del Estado, a través del ministerio competente en carreteras.» Fuente: Ley 37/2015, de 29 de septiembre, de carreteras (BOE-A-2015-10439) — art. 4.1 y anexo II (Catálogo de la Red de Carreteras del Estado).",
    fuente: "Ley 37/2015, de 29 de septiembre, de carreteras (BOE-A-2015-10439) — art. 4.1 y anexo II (Catálogo de la Red de Carreteras del Estado)",
    tema: { numero: 35, titulo: "Red de carreteras de Extremadura (provincia de Badajoz)" }
  },
  // Tema 35 · ficha CPEI-T35-S03-99DDF8B8E0 (revisada)
  {
    id: "Q-CPEI-T35-S03-99DDF8B8E0",
    microconcept_id: "CPEI-T35-S03-99DDF8B8E0",
    level: 'N1',
    type: 'test_literal',
    question: "Según el catálogo del Decreto 98/2008, ¿cuál es el itinerario de la EX-100?",
    options: ["Cáceres–Badajoz", "Mérida–Guareña", "Olivenza–Cheles"],
    correct_answer: "Cáceres–Badajoz",
    explanation: "Ficha: «Cáceres–Badajoz» Fuente: Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura — Decreto 98/2008, anexo.",
    fuente: "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura — Decreto 98/2008, anexo",
    tema: { numero: 35, titulo: "Red de carreteras de Extremadura (provincia de Badajoz)" }
  },
  // Tema 38 · ficha CPEI-T38-HOR-010 (revisada)
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_QUESTIONS_INTERNOS[0]]),
  // Tema 38 · ficha CPEI-T38-HOR-034 (revisada)
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_QUESTIONS_INTERNOS[1]]),
  // Tema 39 · ficha CPEI-T39-MOV-089 (revisada)
  {
    id: "Q-CPEI-T39-MOV-089",
    microconcept_id: "CPEI-T39-MOV-089",
    level: 'N1',
    type: 'test_literal',
    question: "Según el protocolo de radiocomunicaciones del CPEI, para deletrear, ¿qué código fonético se utiliza?",
    options: ["El código fonético internacional ICAO.", "El alfabeto fonético propio del CPEI de Badajoz.", "El código Morse internacional."],
    correct_answer: "El código fonético internacional ICAO.",
    explanation: "Ficha: «El código fonético internacional ICAO.» Fuente: Protocolo de movilización ante siniestros CPEI Badajoz (BOP Badajoz n.º 224, anuncio 4899/2025, 24/11/2025; 34 págs.; incluye protocolo de radiocomunicaciones y anexo SOS) — PDF p. 26.",
    fuente: "Protocolo de movilización ante siniestros CPEI Badajoz (BOP Badajoz n.º 224, anuncio 4899/2025, 24/11/2025; 34 págs.; incluye protocolo de radiocomunicaciones y anexo SOS) — PDF p. 26",
    tema: { numero: 39, titulo: "Protocolo de movilización CPEI + SOS operativo + SOS personal" }
  },
  // Tema 39 · ficha CPEI-T39-SOP-005 (revisada). Sustituye a SPE-010 (SOS Módulo de personal, fuera del epígrafe del tema 39).
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_QUESTIONS_INTERNOS[2]]),
  // Tema 40 · ficha CPEI-T40-PT03-081 (revisada)
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_QUESTIONS_INTERNOS[3]]),
  // Tema 40 · ficha CPEI-T40-PT03-053 (revisada)
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_QUESTIONS_INTERNOS[4]]),
  // Tema 40 · ficha CPEI-T40-PT03-168 (revisada)
  ...(INTERNAL_FROM_SERVER ? [] : [INITIAL_QUESTIONS_INTERNOS[5]])
];
