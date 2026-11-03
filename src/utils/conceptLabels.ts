/**
 * Etiquetas para el alumno en lugar de los identificadores internos (MC-ART1-001, CPEI-T35-…).
 */
interface WithTema {
  microconcept_id: string;
  tema?: { numero: number; titulo: string } | null;
}

/** «T35 · Red de carreteras…» a partir de la pregunta del concepto; si no hay, «Tema 35» por el id. */
export function conceptTopicLabel(conceptId: string, questions?: readonly WithTema[] | null): string {
  const tema = questions?.find((q) => q.microconcept_id === conceptId)?.tema;
  if (tema) return `T${tema.numero} · ${tema.titulo}`;
  const m = conceptId.match(/-T(\d+)-/);
  if (m) return `Tema ${Number(m[1])}`;
  if (/^MC-ART/.test(conceptId)) return 'Constitución Española';
  return 'Concepto';
}

/** «Art. 1.1» si es un artículo numerado; si no («PDF p. 7», «Ley 37/2015, art. 4.1»), tal cual. */
export function formatArticle(article?: string | null): string {
  if (!article) return '';
  return /^\d/.test(article.trim()) ? `Art. ${article.trim()}` : article.trim();
}
