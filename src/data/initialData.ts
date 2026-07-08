/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Microconcept, Question } from '../types';

export const INITIAL_TOPICS = [
  { id: 'T-CE', name: 'Constitución Española - Título Preliminar' }
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
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // MC-ART1-001 (España se constituye en un Estado social y democrático de Derecho)
  {
    id: 'Q-ART1-001-N1',
    microconcept_id: 'MC-ART1-001',
    level: 'N1',
    type: 'test_literal',
    question: 'Según el Artículo 1.1 de la Constitución, España se constituye en un:',
    options: [
      'Estado social y democrático de Derecho',
      'Estado democrático y social de Derecho',
      'Estado social, de derecho y democrático',
      'Estado de Derecho constitucional y social'
    ],
    correct_answer: 'Estado social y democrático de Derecho',
    explanation: 'El artículo 1.1 establece textualmente que España se constituye en un "Estado social y democrático de Derecho" en este preciso orden.'
  },
  {
    id: 'Q-ART1-001-N2',
    microconcept_id: 'MC-ART1-001',
    level: 'N2',
    type: 'test_confusion',
    question: '¿Qué adjetivos definen exactamente al Estado español en el primer párrafo del Artículo 1 de la Constitución?',
    options: [
      'Social, democrático y de Derecho',
      'Libre, representativo y soberano',
      'Constitucional, monárquico y parlamentario',
      'Democrático, descentralizado y de Derecho'
    ],
    correct_answer: 'Social, democrático y de Derecho',
    explanation: 'La fórmula exacta de la Constitución Española es "social y democrático de Derecho".'
  },
  {
    id: 'Q-ART1-001-N3',
    microconcept_id: 'MC-ART1-001',
    level: 'N3',
    type: 'completar_huecos',
    question: 'Completa la fórmula del Artículo 1.1: "España se constituye en un Estado ________ y democrático de ________."',
    options: [
      'social / Derecho',
      'constitucional / justicia',
      'federal / soberanía',
      'autonómico / legalidad'
    ],
    correct_answer: 'social / Derecho',
    explanation: 'Los términos textuales omitidos son "social" (primer hueco) y "Derecho" (segundo hueco).'
  },

  // MC-ART1-002 (Valores superiores)
  {
    id: 'Q-ART1-002-N1',
    microconcept_id: 'MC-ART1-002',
    level: 'N1',
    type: 'test_literal',
    question: 'Según el artículo 1.1 de la Constitución Española, ¿cuáles son los valores superiores de su ordenamiento jurídico?',
    options: [
      'La libertad, la justicia, la igualdad y el pluralismo político.',
      'La libertad, la seguridad, la igualdad y la democracia.',
      'La justicia, la solidaridad, la igualdad y la autonomía.',
      'La legalidad, la libertad, la igualdad y la soberanía nacional.'
    ],
    correct_answer: 'La libertad, la justicia, la igualdad y el pluralismo político.',
    explanation: 'El artículo 1.1 cita de forma explícita e inequívoca estos cuatro valores superiores: libertad, justicia, igualdad y pluralismo político.'
  },
  {
    id: 'Q-ART1-002-N2',
    microconcept_id: 'MC-ART1-002',
    level: 'N2',
    type: 'pregunta_trampa',
    question: '¿Cuál de los siguientes NO es un valor superior del ordenamiento jurídico español enumerado en el Artículo 1.1?',
    options: [
      'La seguridad jurídica',
      'La justicia',
      'La igualdad',
      'El pluralismo político'
    ],
    correct_answer: 'La seguridad jurídica',
    explanation: 'Aunque la seguridad jurídica está protegida en el Artículo 9.3, no forma parte de los "valores superiores del ordenamiento jurídico" enumerados en el Artículo 1.1.'
  },
  {
    id: 'Q-ART1-002-N3',
    microconcept_id: 'MC-ART1-002',
    level: 'N3',
    type: 'discriminacion',
    question: 'Identifique la afirmación correcta respecto a los valores superiores consagrados en el Artículo 1.1 de la Constitución:',
    options: [
      'El pluralismo político es un valor superior, mientras que la democracia no se cita literalmente como tal.',
      'La solidaridad interterritorial se incluye entre estos cuatro valores fundamentales.',
      'La paz social es el cuarto valor superior junto a la libertad, justicia e igualdad.',
      'El ordenamiento jurídico propugna como valores superiores únicamente la libertad y la igualdad social.'
    ],
    correct_answer: 'El pluralismo político es un valor superior, mientras que la democracia no se cita literalmente como tal.',
    explanation: 'Exacto. El cuarto valor es "pluralismo político". La palabra "democracia" o "paz social" no aparece en esa lista taxativa.'
  },

  // MC-ART1-003 (Soberanía nacional pueblo español)
  {
    id: 'Q-ART1-003-N1',
    microconcept_id: 'MC-ART1-003',
    level: 'N1',
    type: 'verdadero_falso',
    question: '¿Es verdadero o falso que la soberanía nacional reside en las Cortes Generales como representantes legítimos?',
    options: [
      'Falso, reside en el pueblo español.',
      'Verdadero, según el artículo 1.2.',
      'Falso, reside en la Corona de España.',
      'Verdadero, compartida con el pueblo español.'
    ],
    correct_answer: 'Falso, reside en el pueblo español.',
    explanation: 'La soberanía nacional reside exclusivamente en el "pueblo español". Las Cortes Generales lo representan, pero no reside en ellas.'
  },
  {
    id: 'Q-ART1-003-N2',
    microconcept_id: 'MC-ART1-003',
    level: 'N2',
    type: 'test_confusion',
    question: 'Complete textualmente según el Artículo 1.2: "La soberanía nacional reside en ________, del que emanan los poderes del Estado."',
    options: [
      'el pueblo español',
      'la Nación española',
      'el Estado democrático',
      'los ciudadanos con derecho a voto'
    ],
    correct_answer: 'el pueblo español',
    explanation: 'La soberanía nacional reside "en el pueblo español", no "en los ciudadanos" ni "en la Nación española". El rigor literal es máximo.'
  },
  {
    id: 'Q-ART1-003-N3',
    microconcept_id: 'MC-ART1-003',
    level: 'N3',
    type: 'pregunta_inversa',
    question: 'Si afirmamos que "del pueblo español emanan los poderes del Estado", ¿qué principio fundamental consagrado en el Artículo 1.2 sustenta directamente esta afirmación?',
    options: [
      'Que la soberanía nacional reside en el pueblo español.',
      'La constitución de un Estado social de Derecho.',
      'La asunción de la Monarquía parlamentaria como forma política.',
      'El principio de legalidad de los órganos del Estado.'
    ],
    correct_answer: 'Que la soberanía nacional reside en el pueblo español.',
    explanation: 'El Artículo 1.2 conecta conceptualmente la soberanía del pueblo con el hecho de que de él emanen los poderes estatales.'
  },

  // MC-ART1-004 (Emanación de poderes)
  {
    id: 'Q-ART1-004-N1',
    microconcept_id: 'MC-ART1-004',
    level: 'N1',
    type: 'test_literal',
    question: 'Según la Constitución Española, ¿de dónde emanan los poderes del Estado?',
    options: [
      'Del pueblo español',
      'De la Constitución y de las Leyes',
      'De la Corona y el Parlamento',
      'Del poder legislativo nacional'
    ],
    correct_answer: 'Del pueblo español',
    explanation: 'El artículo 1.2 concluye: "...del que [el pueblo español] emanan los poderes del Estado".'
  },
  {
    id: 'Q-ART1-004-N2',
    microconcept_id: 'MC-ART1-004',
    level: 'N2',
    type: 'test_confusion',
    question: '¿Qué emana directamente del pueblo español según el Artículo 1.2 de la Constitución?',
    options: [
      'Los poderes del Estado',
      'La soberanía de las autonomías',
      'El poder judicial independiente',
      'Las leyes orgánicas del Estado'
    ],
    correct_answer: 'Los poderes del Estado',
    explanation: 'Emanan exactamente "los poderes del Estado".'
  },
  {
    id: 'Q-ART1-004-N3',
    microconcept_id: 'MC-ART1-004',
    level: 'N3',
    type: 'discriminacion',
    question: 'Analice la frase: "La soberanía reside en el Estado y de él emanan los poderes del pueblo". ¿Es constitucionalmente correcta?',
    options: [
      'No, es totalmente al revés: la soberanía reside en el pueblo español, y del pueblo emanan los poderes del Estado.',
      'Sí, es correcta conforme al Artículo 1.2.',
      'No, porque los poderes del Estado emanan de la Corona, no del Estado.',
      'Sí, pues el Estado y el pueblo son términos equivalentes en derecho constitucional.'
    ],
    correct_answer: 'No, es totalmente al revés: la soberanía reside en el pueblo español, y del pueblo emanan los poderes del Estado.',
    explanation: 'La relación causal constitucional es clara: el pueblo español ostenta la soberanía y de este emanan los poderes públicos.'
  },

  // MC-ART1-005 (Forma política)
  {
    id: 'Q-ART1-005-N1',
    microconcept_id: 'MC-ART1-005',
    level: 'N1',
    type: 'test_literal',
    question: 'Según el Artículo 1.3 de la Constitución, ¿cuál es la forma política del Estado español?',
    options: [
      'La Monarquía parlamentaria',
      'La Monarquía constitucional',
      'La República parlamentaria',
      'La Democracia parlamentaria'
    ],
    correct_answer: 'La Monarquía parlamentaria',
    explanation: 'El texto dice de manera literal e inequívoca: "La forma política del Estado español es la Monarquía parlamentaria."'
  },
  {
    id: 'Q-ART1-005-N2',
    microconcept_id: 'MC-ART1-005',
    level: 'N2',
    type: 'test_confusion',
    question: 'En un examen de oposición, un enunciado indica que la forma de gobierno es una "Monarquía representativa y demócrata". Según la precisión literal de la Constitución, este enunciado es:',
    options: [
      'Incorrecto, ya que la Constitución define textualmente la forma política como "Monarquía parlamentaria".',
      'Correcto, son términos sinónimos reconocidos por el Tribunal Constitucional.',
      'Parcialmente correcto, ya que solo falta añadir que es de carácter social.',
      'Incorrecto, la forma política de España es el "Estado de Derecho".'
    ],
    correct_answer: 'Incorrecto, ya que la Constitución define textualmente la forma política como "Monarquía parlamentaria".',
    explanation: 'En las oposiciones el rigor literal es estricto. La única fórmula correcta y textual en el Artículo 1.3 es "Monarquía parlamentaria".'
  },
  {
    id: 'Q-ART1-005-N3',
    microconcept_id: 'MC-ART1-005',
    level: 'N3',
    type: 'pregunta_inversa',
    question: '¿Qué aspecto del Estado español define exactamente el Artículo 1.3 cuando nombra a la "Monarquía parlamentaria"?',
    options: [
      'La forma política del Estado español',
      'La soberanía nacional compartida',
      'Los valores superiores del ordenamiento',
      'El modelo de división territorial'
    ],
    correct_answer: 'La forma política del Estado español',
    explanation: 'El Artículo 1.3 reza: "La forma política del Estado español es..." por lo que define específicamente la "forma política".'
  }
];
