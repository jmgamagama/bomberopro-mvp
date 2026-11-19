/**
 * Muestra local de invitado: microconceptos y preguntas creados a partir de fichas REVISADAS de
 * material interno del CPEI (T38 ITF, T39 plataforma SOS, T40 PT03). Movidos sin cambios desde
 * initialData.ts, que los inserta en su posición original; se excluyen del build con
 * VITE_INTERNAL_DECKS_FROM_SERVER (ver initialData.ts).
 */
import { Microconcept, Question } from '../types';

export const INITIAL_MICROCONCEPTS_INTERNOS: Microconcept[] = [
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

export const INITIAL_QUESTIONS_INTERNOS: Question[] = [
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
    tema: { numero: 38, titulo: "ITF CPEI: horario, vestuario/EPIs y limpieza de EPIs" }
  },
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
    tema: { numero: 38, titulo: "ITF CPEI: horario, vestuario/EPIs y limpieza de EPIs" }
  },
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
