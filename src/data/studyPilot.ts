import { INITIAL_MICROCONCEPTS } from './initialData';

export const STUDY_PILOT = {
  id: 'cpei-badajoz-2026-t1-art1-v1',
  title: 'CPEI Badajoz · Tema 1 · Artículo 1',
  convocatoriaVersion: 'CPEI Badajoz 2026',
  sourceTitle: 'Constitución Española, artículo 1',
  sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a1',
  sourceCheckedAt: '2026-09-26',
  sourceGlobalUpdate: '2026-05-20',
  qaStatus: 'Pendiente de revisión humana',
  article: [
    '1. España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político.',
    '2. La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.',
    '3. La forma política del Estado español es la Monarquía parlamentaria.',
  ],
} as const;

const ART1_CONCEPT_IDS = [
  'MC-ART1-001',
  'MC-ART1-002',
  'MC-ART1-003',
  'MC-ART1-004',
  'MC-ART1-005',
] as const;

// Preserve the existing concept objects and their editorial wording.
export const STUDY_PILOT_CONCEPTS = ART1_CONCEPT_IDS.map((id) => {
  const concept = INITIAL_MICROCONCEPTS.find((item) => item.id === id);
  if (!concept) throw new Error(`Missing pilot concept: ${id}`);
  return concept;
});
