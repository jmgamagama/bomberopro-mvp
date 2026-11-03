/** Resumen por tema del intento de simulacro y recomendación de qué estudiar (solo con datos del intento). */
export interface TopicResultInput {
  tema?: { numero: number; titulo: string } | null;
  answered: boolean;
  correct: boolean;
}

export interface TopicSummary {
  numero: number | null;
  titulo: string;
  total: number;
  correct: number;
  incorrect: number;
  blank: number;
}

export function summarizeByTopic(results: readonly TopicResultInput[]): TopicSummary[] {
  const map = new Map<string, TopicSummary>();
  for (const r of results) {
    const key = r.tema ? String(r.tema.numero) : 'otras';
    const s = map.get(key) ?? { numero: r.tema?.numero ?? null, titulo: r.tema?.titulo ?? 'Preguntas sin tema asignado', total: 0, correct: 0, incorrect: 0, blank: 0 };
    s.total++;
    if (!r.answered) s.blank++;
    else if (r.correct) s.correct++;
    else s.incorrect++;
    map.set(key, s);
  }
  const missed = (s: TopicSummary) => s.incorrect + s.blank;
  return [...map.values()].sort((a, b) => missed(b) - missed(a) || missed(b) / b.total - missed(a) / a.total || (a.numero ?? 99) - (b.numero ?? 99));
}

/** Tema con más preguntas sin acertar (fallos + blancos), o null si se acertó todo. */
export function recommendTopic(summary: readonly TopicSummary[]): TopicSummary | null {
  const first = summary.find((s) => s.numero !== null && s.incorrect + s.blank > 0) ?? summary.find((s) => s.incorrect + s.blank > 0);
  return first ?? null;
}
