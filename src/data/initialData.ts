/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Microconcept, Question } from '../types';

export const INITIAL_TOPICS = [
  { id: 'T-CE', name: 'Constitución Española - Título Preliminar' },
  { id: 'T35', name: 'Tema 35 · Red de carreteras de Extremadura (provincia de Badajoz)' },
  { id: 'T38', name: 'Tema 38 · ITF CPEI: horario, vestuario/EPIs, limpieza y gestión de EPIs colectivos' },
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
  {
    id: "CPEI-T38-HOR-010",
    topic_id: 'T38',
    article: "PDF p. 3",
    text: "Según el resumen del horario diario, ¿en qué franja se revisan vehículos, herramientas y material colectivo? De 8:30 a 9:45.",
    explanation: "Ficha revisada del tema 38. Fuente: ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) — PDF p. 3.",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  {
    id: "CPEI-T38-HOR-034",
    topic_id: 'T38',
    article: "PDF p. 7",
    text: "Según la ITF Horario, ¿qué puede suponer un retraso injustificado y/o la acumulación de retrasos injustificados? La consideración de falta grave.",
    explanation: "Ficha revisada del tema 38. Fuente: ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) — PDF p. 7.",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
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
  {
    id: "CPEI-T39-SOP-005",
    topic_id: 'T39',
    article: "PDF p. 5",
    text: "¿Para qué sirve el icono Servicios/Ruta en el móvil? Para recibir en el teléfono el punto de intervención.",
    explanation: "Ficha revisada del tema 39. Fuente: Uso y manejo de la plataforma SOS — Módulo operativo (manual bomberos nuevo ingreso; PDF Drive FUENTE_OFICIAL_SOS_Operativo.pdf, 47 págs.) — PDF p. 5.",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  {
    id: "CPEI-T40-PT03-081",
    topic_id: 'T40',
    article: "PDF p. 23 (Hoja 16)",
    text: "¿Cuál es el número de emergencias de la línea telefónica propia del CPEI? 085.",
    explanation: "Ficha revisada del tema 40. Fuente: PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 23 (Hoja 16).",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  {
    id: "CPEI-T40-PT03-053",
    topic_id: 'T40',
    article: "PDF p. 17 (Hoja 10)",
    text: "¿Cuál es la dotación mínima en una intervención afectada por posible amianto friable? 2 binomios.",
    explanation: "Ficha revisada del tema 40. Fuente: PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 17 (Hoja 10).",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  },
  {
    id: "CPEI-T40-PT03-168",
    topic_id: 'T40',
    article: "PDF p. 43 (Hoja 36)",
    text: "¿Qué almacén de repuesto de urgencia atiende a los parques de Villafranca y Hornachos? Almendralejo.",
    explanation: "Ficha revisada del tema 40. Fuente: PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 43 (Hoja 36).",
    difficulty: 'media',
    confusion_risk: 'medio',
    type: 'dato literal'
  }
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
  {
    id: "Q-CPEI-T38-HOR-010",
    microconcept_id: "CPEI-T38-HOR-010",
    level: 'N1',
    type: 'test_literal',
    question: "Según el resumen del horario diario de la ITF Horario de actividades, ¿en qué franja se revisan vehículos, herramientas y material colectivo?",
    options: ["De 7:30 a 8:30.", "De 8:30 a 9:45.", "De 9:00 a 9:45."],
    correct_answer: "De 8:30 a 9:45.",
    explanation: "Ficha: «De 8:30 a 9:45.» Fuente: ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) — PDF p. 3.",
    fuente: "ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) — PDF p. 3",
    tema: { numero: 38, titulo: "ITF CPEI: horario, vestuario/EPIs, limpieza y gestión de EPIs colectivos" }
  },
  // Tema 38 · ficha CPEI-T38-HOR-034 (revisada)
  {
    id: "Q-CPEI-T38-HOR-034",
    microconcept_id: "CPEI-T38-HOR-034",
    level: 'N1',
    type: 'test_literal',
    question: "Según la ITF Horario de actividades, ¿qué puede suponer un retraso injustificado y/o la acumulación de retrasos injustificados?",
    options: ["La consideración de falta muy grave.", "Una amonestación por escrito.", "La consideración de falta grave."],
    correct_answer: "La consideración de falta grave.",
    explanation: "Ficha: «La consideración de falta grave.» Fuente: ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) — PDF p. 7.",
    fuente: "ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) — PDF p. 7",
    tema: { numero: 38, titulo: "ITF CPEI: horario, vestuario/EPIs, limpieza y gestión de EPIs colectivos" }
  },
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
  {
    id: "Q-CPEI-T39-SOP-005",
    microconcept_id: "CPEI-T39-SOP-005",
    level: 'N1',
    type: 'test_literal',
    question: "Según el manual del módulo operativo de SOS, ¿para qué sirve el icono Servicios/Ruta en el móvil?",
    options: ["Para enviar al CPEI la posición del vehículo.", "Para recibir en el teléfono el punto de intervención.", "Para consultar el historial de intervenciones del parque."],
    correct_answer: "Para recibir en el teléfono el punto de intervención.",
    explanation: "Ficha: «Para recibir en el teléfono el punto de intervención.» Fuente: Uso y manejo de la plataforma SOS — Módulo operativo (manual bomberos nuevo ingreso; PDF Drive FUENTE_OFICIAL_SOS_Operativo.pdf, 47 págs.) — PDF p. 5.",
    fuente: "Uso y manejo de la plataforma SOS — Módulo operativo (manual bomberos nuevo ingreso; PDF Drive FUENTE_OFICIAL_SOS_Operativo.pdf, 47 págs.) — PDF p. 5",
    tema: { numero: 39, titulo: "Protocolo de movilización CPEI + SOS operativo + SOS personal" }
  },
  // Tema 40 · ficha CPEI-T40-PT03-081 (revisada)
  {
    id: "Q-CPEI-T40-PT03-081",
    microconcept_id: "CPEI-T40-PT03-081",
    level: 'N1',
    type: 'test_literal',
    question: "Según el PT03, ¿cuál es el número de emergencias de la línea telefónica propia del CPEI?",
    options: ["112", "080", "085"],
    correct_answer: "085",
    explanation: "Ficha: «085.» Fuente: PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 23 (Hoja 16).",
    fuente: "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 23 (Hoja 16)",
    tema: { numero: 40, titulo: "Procedimientos de trabajo CPEI-Badajoz" }
  },
  // Tema 40 · ficha CPEI-T40-PT03-053 (revisada)
  {
    id: "Q-CPEI-T40-PT03-053",
    microconcept_id: "CPEI-T40-PT03-053",
    level: 'N1',
    type: 'test_literal',
    question: "Según el PT03, ¿cuál es la dotación mínima en una intervención afectada por posible amianto friable?",
    options: ["2 binomios", "1 binomio", "3 binomios"],
    correct_answer: "2 binomios",
    explanation: "Ficha: «2 binomios.» Fuente: PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 17 (Hoja 10).",
    fuente: "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 17 (Hoja 10)",
    tema: { numero: 40, titulo: "Procedimientos de trabajo CPEI-Badajoz" }
  },
  // Tema 40 · ficha CPEI-T40-PT03-168 (revisada)
  {
    id: "Q-CPEI-T40-PT03-168",
    microconcept_id: "CPEI-T40-PT03-168",
    level: 'N1',
    type: 'test_literal',
    question: "Según el PT03, ¿qué almacén de repuesto de urgencia atiende a los parques de Villafranca y Hornachos?",
    options: ["Don Benito", "Almendralejo", "Llerena"],
    correct_answer: "Almendralejo",
    explanation: "Ficha: «Almendralejo.» Fuente: PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 43 (Hoja 36).",
    fuente: "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) — PDF p. 43 (Hoja 36)",
    tema: { numero: 40, titulo: "Procedimientos de trabajo CPEI-Badajoz" }
  }
];
