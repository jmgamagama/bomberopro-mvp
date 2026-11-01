/**
 * Informe del simulacro (01/11/2026): «Tu dominio por tema» y un plan de 7 días sacado de los fallos.
 * - Dominio: aciertos/fallos/blancos de ESTE simulacro (summarizeByTopic) junto al % dominado de
 *   «Tu progreso», calculado con la misma función (mapaTemas, src/utils/progresoMapa.ts).
 * - Plan de 7 días: las fichas relacionadas con cada fallo (fichasRelacionadas: mismo tema y
 *   artículo), sin repetir, repartidas de mañana a dentro de 7 días; los temas con más fallos van
 *   primero. Al aceptarlo se guardan como prioridad del plan de cada día (marcarPrioridadDias),
 *   que «Tu plan de hoy» ya lee. No toca CardSrs ni scheduleReview, ni el servidor.
 */
import type { RecallCard } from '../data/recallCards';
import type { RecallTopic } from '../data/recallRegistry';
import type { TopicSummary } from './examReport';
import { mapaTemas, type TemaProgreso } from './progresoMapa';
import { fichasRelacionadas } from './planDiario';
import type { SrsStore } from './recallSrs';

export const DIAS_PLAN_SIMULACRO = 7;

export interface DominioTema {
  numero: number;
  titulo: string;
  correct: number;
  incorrect: number;
  blank: number;
  total: number;
  /** % dominado de «Tu progreso» (null si el tema no tiene fichas visibles). */
  progreso: TemaProgreso | null;
}

export function dominioPorTema(byTopic: readonly TopicSummary[], topics: readonly RecallTopic[], srs: SrsStore, isVisible?: (d: string, c: string) => boolean): DominioTema[] {
  const conNumero = byTopic.filter((t): t is TopicSummary & { numero: number } => t.numero != null);
  const mapa = mapaTemas(topics.filter((t) => conNumero.some((b) => b.numero === t.tema)), srs, [], [], isVisible);
  return conNumero.map((b) => ({
    numero: b.numero, titulo: b.titulo, correct: b.correct, incorrect: b.incorrect, blank: b.blank, total: b.total,
    progreso: mapa.find((m) => m.tema === b.numero) ?? null,
  }));
}

export interface DiaPlan {
  /** 1 = mañana … 7. */
  offset: number;
  cards: RecallCard[];
  /** `T1` → nº de fichas ese día. */
  porTema: [string, number][];
}

export interface PlanSimulacro {
  dias: DiaPlan[];
  total: number;
  /** Fallos sin ninguna ficha relacionada (no entran en el plan). */
  fallosSinFichas: number;
}

export function planDesdeFallos(
  fallos: readonly { tema?: { numero: number } | null; fuente?: string }[],
  pool: readonly RecallCard[],
  dias: number = DIAS_PLAN_SIMULACRO,
): PlanSimulacro {
  const porTema = new Map<number, { fallos: number; cards: RecallCard[] }>();
  const vistas = new Set<string>();
  let fallosSinFichas = 0;
  for (const f of fallos) {
    const rel = fichasRelacionadas(f, pool);
    if (!f.tema || rel.length === 0) { fallosSinFichas++; continue; }
    const g = porTema.get(f.tema.numero) ?? { fallos: 0, cards: [] };
    g.fallos++;
    for (const c of rel) {
      const k = `${c.deckId}|${c.id}`;
      if (!vistas.has(k)) { vistas.add(k); g.cards.push(c); }
    }
    porTema.set(f.tema.numero, g);
  }
  const ordenadas = [...porTema].sort((a, b) => b[1].fallos - a[1].fallos || a[0] - b[0]).flatMap(([, g]) => g.cards);
  const total = ordenadas.length;
  const base = Math.floor(total / dias);
  const extra = total % dias;
  const out: DiaPlan[] = [];
  let i = 0;
  for (let d = 1; d <= dias; d++) {
    const n = base + (d <= extra ? 1 : 0);
    const cards = ordenadas.slice(i, i + n);
    i += n;
    const cuenta = new Map<string, number>();
    for (const c of cards) {
      const t = `T${(c.topicId ?? '').replace(/^tema/, '')}`;
      cuenta.set(t, (cuenta.get(t) ?? 0) + 1);
    }
    out.push({ offset: d, cards, porTema: [...cuenta] });
  }
  return { dias: out, total, fallosSinFichas };
}
