/**
 * Registro central de mazos de recuerdo (concepto → respuesta → fuente).
 *
 * Es la ÚNICA lista de temas/lotes de la app: la pantalla «Recuerdo», la Sesión
 * diaria, la bienvenida y la página de planes leen de aquí.
 *
 * El registro solo contiene METADATOS (título, nº de fichas…). Las fichas de cada
 * mazo viven en su propio módulo y se cargan BAJO DEMANDA con `loadRecallDeckCards`
 * (import dinámico → un fichero JS por mazo en el build). Así nunca se cargan los
 * 528 del tema 36 en un solo módulo, ni los 9.392 conceptos de MIRA, y no hay
 * preguntas tipo test.
 *
 * Para añadir un mazo nuevo:
 *   1. crea src/data/<mazo>Recall.ts con `<MAZO>_RECALL_META` y `<MAZO>_RECALL_CARDS`
 *      (mismo formato que los existentes);
 *   2. añade UNA entrada a DECK_SOURCES con sus metadatos y su `load` (import dinámico).
 *   Los tests comprueban que los metadatos coinciden con los del módulo.
 */

import { canAccessDeck, getPlan, type Plan } from '../utils/plan';

/** Ficha de recuerdo tal como viene de los JSON limpios de cada tema. */
export interface RecallSourceCard {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
}

interface RecallDeckMeta {
  tema: number;
  lote?: string;
  title: string;
  count: number;
  source: string;
}

interface DeckSource {
  meta: RecallDeckMeta;
  load: () => Promise<readonly RecallSourceCard[]>;
}

export interface RecallDeck {
  /** Identificador estable: `tema40`, `tema36-lote01`… */
  id: string;
  /** Tema al que pertenece (`tema36`): agrupa los lotes en la interfaz. */
  topicId: string;
  tema: number;
  lote?: string;
  /** Etiqueta corta: `T40`, `T36·1`… */
  shortLabel: string;
  /** Etiqueta corta dentro de su tema: `Lote 1` (o la de `shortLabel` si no hay lotes). */
  loteLabel: string;
  /** Nombre legible: `tema 40`, `tema 36 lote 01`. */
  label: string;
  title: string;
  /** Nombre sin el prefijo «Tema N · » (para listas y selectores). */
  name: string;
  /** Procedencia de los datos (uso interno; no se muestra al opositor). */
  source: string;
  count: number;
}

/** Bloque del temario (BOP Badajoz n.º 135/2026, anexo I): temas 1-7 parte común, 8-40 parte específica. */
export type RecallBloqueId = 'comun' | 'especifica';

export interface RecallTopic {
  /** `tema35`, `tema36`… */
  id: string;
  tema: number;
  bloque: RecallBloqueId;
  shortLabel: string;
  /** «Tema 36 (todos los lotes)» si tiene lotes; si no, el título del mazo. */
  title: string;
  name: string;
  count: number;
  decks: readonly RecallDeck[];
}

/** Nombre de los temas que se cargan por lotes (bloque del temario, tema36_lotes.md). */
const TOPIC_NAMES: Record<number, string> = {
  34: 'Reglamento de seguridad contra incendios en los establecimientos industriales (RD 164/2025)',
  36: 'Territorio de la provincia de Badajoz: municipios, límites, orografía e hidrografía',
};

const DECK_SOURCES: readonly DeckSource[] = [
  {
    meta: {
      tema: 21,
      title: "Tema 21 · Accidentes de tráfico: Procedimiento Unificado de Rescate (Manual básico DGT)",
      count: 42,
      source: "Fase 3 · Manual básico de rescate en accidentes de tráfico (DGT-APRAT, 2019), PDF oficial en dgt.es",
    },
    load: () => import('./tema21Recall').then((m) => m.TEMA21_RECALL_CARDS),
  },
  {
    meta: {
      tema: 22,
      title: "Tema 22 · Trabajos temporales en altura: RD 1215/1997, anexo II.4",
      count: 33,
      source: "Fase 3 · texto consolidado BOE-A-1997-17824 (RD 1215/1997, anexo II.4; últ. act. 18/12/2025)",
    },
    load: () => import('./tema22Recall').then((m) => m.TEMA22_RECALL_CARDS),
  },
  {
    meta: {
      tema: 25,
      title: "Tema 25 · Mercancías peligrosas: ADR 2025 (conceptos, cisternas, panel naranja, placas-etiquetas y actuación)",
      count: 47,
      source: "Fase 3 · ADR 2025, Anejos A y B (BOE-A-2025-77, BOE nº 3 de 03/01/2025)",
    },
    load: () => import('./tema25Recall').then((m) => m.TEMA25_RECALL_CARDS),
  },
  {
    meta: {
      tema: 26,
      title: "Tema 26 · Guías INSARAG Vol. II, Manual B: Operaciones",
      count: 60,
      source: "Fase 3 · Guías INSARAG 2020, Vol. II, Manual B: Operaciones (ONU-OCHA, versión oficial en español)",
    },
    load: () => import('./tema26Recall').then((m) => m.TEMA26_RECALL_CARDS),
  },
  {
    meta: {
      tema: 34,
      lote: 'lote02',
      title: "Tema 34 · RD 164/2025 (RSCIEI), lote 2: instalaciones de protección activa (anexo III)",
      count: 39,
      source: "Fase 3 · texto consolidado BOE-A-2025-7190 (reglamento, anexo III; últ. act. 20/12/2025)",
    },
    load: () => import('./tema34Lote02Recall').then((m) => m.TEMA34_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 34,
      lote: 'lote01',
      title: "Tema 34 · RD 164/2025 (RSCIEI), lote 1: articulado y caracterización (anexo I)",
      count: 58,
      source: "Fase 3 · texto consolidado BOE-A-2025-7190 (reglamento, arts. 1-18 y anexo I; últ. act. 20/12/2025)",
    },
    load: () => import('./tema34Lote01Recall').then((m) => m.TEMA34_LOTE01_RECALL_CARDS),
  },
  {
    meta: {
      tema: 32,
      title: "Tema 32 · CTE: objeto, ámbito, exigencias básicas SI y SUA, DB SI (SI 4 y SI 5) y DB SUA (SUA 4 y SUA 7)",
      count: 91,
      source: "Fase 2-3 · CTE Parte I (BOE-A-2006-5515, últ. act. 15/06/2022) y DB SI / DB SUA consolidados del Ministerio (codigotecnico.org)",
    },
    load: () => import('./tema32Recall').then((m) => m.TEMA32_RECALL_CARDS),
  },
  {
    meta: {
      tema: 30,
      title: "Tema 30 · Planes especiales de Extremadura: INUNCAEX, TRANSCAEX, RADIOCAEX y PLASISMEX",
      count: 87,
      source: "Fase 3 · textos íntegros oficiales en juntaex.es de INUNCAEX (Decreto 39/2025), TRANSCAEX (Decreto 189/2019), RADIOCAEX (Decreto 200/2019) y PLASISMEX (Decreto 127/2009)",
    },
    load: () => import('./tema30Recall').then((m) => m.TEMA30_RECALL_CARDS),
  },
  {
    meta: {
      tema: 29,
      title: "Tema 29 · PLATERCAEX: objetivo, alcance, estructura y operatividad",
      count: 81,
      source: "Fase 3 · PLATERCAEX (Decreto 187/2019, DOE nº 247 de 26/12/2019), texto íntegro oficial en juntaex.es (PDF de 31/01/2020)",
    },
    load: () => import('./tema29Recall').then((m) => m.TEMA29_RECALL_CARDS),
  },
  {
    meta: {
      tema: 2,
      title: "Tema 2 · El Estatuto de Autonomía de Extremadura",
      count: 121,
      source: "Fase 2 · texto consolidado BOE-A-2011-1638 (Estatuto, arts. 1-48; sin modificaciones registradas desde 29/01/2011)",
    },
    load: () => import('./tema2Recall').then((m) => m.TEMA2_RECALL_CARDS),
  },
  {
    meta: {
      tema: 33,
      title: "Tema 33 · RIPCI (RD 513/2017): abastecimiento de agua, hidrantes, BIE y columna seca",
      count: 67,
      source: "Fase 2 · texto consolidado BOE-A-2017-6606 (arts. 1-2 y anexo I, apdos. 2, 3, 5 y 6; últ. act. 03/09/2025)",
    },
    load: () => import('./tema33Recall').then((m) => m.TEMA33_RECALL_CARDS),
  },
  {
    meta: {
      tema: 7,
      title: "Tema 7 · Ley 8/2011 de Igualdad y contra la violencia de género en Extremadura",
      count: 64,
      source: "Fase 2 · texto consolidado BOE-A-2011-6651 (Tít. Preliminar, Tít. II y Tít. IV cap. II; sin modificaciones registradas desde 25/03/2011)",
    },
    load: () => import('./tema7Recall').then((m) => m.TEMA7_RECALL_CARDS),
  },
  {
    meta: {
      tema: 1,
      title: "Tema 1 · La Constitución Española de 1978: Título Preliminar y Título I",
      count: 129,
      source: "Fase 2 · texto consolidado BOE-A-1978-31229 (arts. 1-55; últ. act. 20/05/2026)",
    },
    load: () => import('./tema1Recall').then((m) => m.TEMA1_RECALL_CARDS),
  },
  {
    meta: {
      tema: 6,
      title: "Tema 6 · Ley 31/1995 de Prevención de Riesgos Laborales",
      count: 94,
      source: "Fase 2 · texto consolidado BOE-A-1995-24292 (caps. I-IV, arts. 1-32 bis; últ. act. 09/04/2026)",
    },
    load: () => import('./tema6Recall').then((m) => m.TEMA6_RECALL_CARDS),
  },
  {
    meta: {
      tema: 31,
      title: "Tema 31 · RD 1215/1997: utilización de los equipos de trabajo",
      count: 83,
      source: "Fase 2 · texto consolidado BOE-A-1997-17824 (arts. 1-6, disposiciones y anexos I-II; últ. act. 13/11/2004)",
    },
    load: () => import('./tema31Recall').then((m) => m.TEMA31_RECALL_CARDS),
  },
  {
    meta: {
      tema: 3,
      title: "Tema 3 · LBRL: la Provincia (organización y competencias)",
      count: 66,
      source: "Fase 2 · texto consolidado BOE-A-1985-5392 (Título III, arts. 31-38; últ. act. 03/10/2026)",
    },
    load: () => import('./tema3Recall').then((m) => m.TEMA3_RECALL_CARDS),
  },
  {
    meta: {
      tema: 16,
      title: 'Tema 16 · El código ICAO (alfabeto radiotelefónico) y códigos Q de la UIT',
      count: 48,
      source: 'BASE MIRA tema 16, subconjunto OACI/UIT revisado ficha a ficha (RR UIT 2024 ap. 14 y art. 32/53, Rec. UIT-R M.1172, OACI Anexo 10 vol. II)',
    },
    load: () => import('./tema16Recall').then((m) => m.TEMA16_RECALL_CARDS),
  },
  {
    meta: {
      tema: 35,
      title: 'Tema 35 · Red de carreteras de Extremadura (provincia de Badajoz)',
      count: 150,
      source: 'Decreto 98/2008 + Extremadura en Cifras (JSON limpio score 100%)',
    },
    load: () => import('./tema35Recall').then((m) => m.TEMA35_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote01',
      title: 'Tema 36 · Lote 01 — Núcleo de examen: marco, municipios clave, oro/hidro/embalses',
      count: 78,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote01Recall').then((m) => m.TEMA36_LOTE01_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote02',
      title: 'Tema 36 · Lote 02 — Municipios restantes (INE + población ≤5.000): Acedera → Esparragosa de Lares',
      count: 79,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote02Recall').then((m) => m.TEMA36_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote03',
      title: 'Tema 36 · Lote 03 — Municipios restantes (INE + población ≤5.000): Esparragosa de la Serena → Nogales',
      count: 78,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote03Recall').then((m) => m.TEMA36_LOTE03_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote04',
      title: 'Tema 36 · Lote 04 — Municipios restantes (INE + población ≤5.000): Oliva de Mérida → Táliga',
      count: 78,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote04Recall').then((m) => m.TEMA36_LOTE04_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote05',
      title: 'Tema 36 · Lote 05 — Municipios restantes (INE + población ≤5.000): Usagre → Zarza-Capilla',
      count: 50,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote05Recall').then((m) => m.TEMA36_LOTE05_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote06',
      title: 'Tema 36 · Lote 06 — Límites administrativos: Acedera → Granja de Torrehermosa',
      count: 55,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote06Recall').then((m) => m.TEMA36_LOTE06_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote07',
      title: 'Tema 36 · Lote 07 — Límites administrativos: Guadiana → Puebla de Sancho Pérez',
      count: 55,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote07Recall').then((m) => m.TEMA36_LOTE07_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote08',
      title: 'Tema 36 · Lote 08 — Límites administrativos: Puebla del Maestre → Zarza-Capilla',
      count: 55,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote08Recall').then((m) => m.TEMA36_LOTE08_RECALL_CARDS),
  },
  {
    meta: {
      tema: 38,
      title: 'Tema 38 · ITF CPEI: horario, vestuario/EPIs, limpieza y gestión de EPIs colectivos',
      count: 198,
      source: 'ITF oficiales CPEI (Horario 2022, Vestuario/Limpieza/Gestión EPIs 2026) rebuild desde PDFs',
    },
    load: () => import('./tema38Recall').then((m) => m.TEMA38_RECALL_CARDS),
  },
  {
    meta: {
      tema: 39,
      title: 'Tema 39 · Protocolo de movilización CPEI + SOS operativo + SOS personal',
      count: 149,
      source: 'Protocolo movilización BOP 224/2025 + SOS operativo/personal (rebuild desde PDFs oficiales)',
    },
    load: () => import('./tema39Recall').then((m) => m.TEMA39_RECALL_CARDS),
  },
  {
    meta: {
      tema: 40,
      title: 'Tema 40 · Procedimientos de trabajo CPEI-Badajoz',
      count: 213,
      source: 'PT01 conducción (26) + PT03 amianto oficial (187)',
    },
    load: () => import('./tema40Recall').then((m) => m.TEMA40_RECALL_CARDS),
  },
];

function defineDeck(meta: RecallDeckMeta): RecallDeck {
  const loteNumber = meta.lote ? meta.lote.replace(/^lote/i, '') : undefined;
  const shortLabel = `T${meta.tema}${loteNumber ? `·${Number(loteNumber)}` : ''}`;
  return {
    id: `tema${meta.tema}${meta.lote ? `-${meta.lote}` : ''}`,
    topicId: `tema${meta.tema}`,
    tema: meta.tema,
    lote: meta.lote,
    shortLabel,
    loteLabel: loteNumber ? `Lote ${Number(loteNumber)}` : shortLabel,
    label: `tema ${meta.tema}${loteNumber ? ` lote ${loteNumber}` : ''}`,
    title: meta.title,
    name: meta.title.replace(/^Tema\s+\d+\s*·\s*/, ''),
    source: meta.source,
    count: meta.count,
  };
}

const LOADERS = new Map<string, DeckSource['load']>();

/** Todos los mazos registrados, ordenados por tema y lote (solo metadatos). */
export const RECALL_DECKS: readonly RecallDeck[] = DECK_SOURCES.map((src) => {
  const deck = defineDeck(src.meta);
  if (LOADERS.has(deck.id)) throw new Error(`Mazo de recuerdo duplicado: ${deck.id}`);
  LOADERS.set(deck.id, src.load);
  return deck;
}).sort((a, b) => a.tema - b.tema || (a.lote ?? '').localeCompare(b.lote ?? ''));

const BLOQUE_LABELS: Record<RecallBloqueId, string> = { comun: 'Parte común', especifica: 'Parte específica' };

/** Bloque al que pertenece un tema del temario (1-7 común; 8-40 específica). */
export function bloqueDeTema(tema: number): RecallBloqueId {
  return tema <= 7 ? 'comun' : 'especifica';
}

/** Temas (agrupan los lotes de un mismo tema), ordenados por número de tema. */
export const RECALL_TOPICS: readonly RecallTopic[] = (() => {
  const byTema = new Map<number, RecallDeck[]>();
  for (const deck of RECALL_DECKS) {
    const list = byTema.get(deck.tema) ?? [];
    list.push(deck);
    byTema.set(deck.tema, list);
  }
  return [...byTema.entries()].map(([tema, decks]) => {
    const grouped = decks.some((d) => d.lote);
    return {
      id: `tema${tema}`,
      tema,
      bloque: bloqueDeTema(tema),
      shortLabel: `T${tema}`,
      title: grouped ? `Tema ${tema} (todos los lotes)` : decks[0].title,
      name: grouped ? TOPIC_NAMES[tema] ?? `Tema ${tema}` : decks[0].name,
      count: decks.reduce((n, d) => n + d.count, 0),
      decks,
    };
  });
})();

export interface RecallBloque {
  id: RecallBloqueId;
  /** «Parte común» / «Parte específica». */
  label: string;
  topics: readonly RecallTopic[];
  count: number;
}

/** Temas agrupados por bloque del temario (solo los bloques con algún tema cargado). */
export const RECALL_BLOQUES: readonly RecallBloque[] = (['comun', 'especifica'] as const)
  .map((id) => {
    const topics = RECALL_TOPICS.filter((t) => t.bloque === id);
    return { id, label: BLOQUE_LABELS[id], topics, count: topics.reduce((n, t) => n + t.count, 0) };
  })
  .filter((b) => b.topics.length > 0);

export function getRecallDeck(id: string): RecallDeck {
  const deck = RECALL_DECKS.find((d) => d.id === id);
  if (!deck) throw new Error(`Mazo de recuerdo desconocido: ${id}`);
  return deck;
}

export function getRecallTopic(id: string): RecallTopic | undefined {
  return RECALL_TOPICS.find((t) => t.id === id);
}

/** Tema (`tema36`) de un id de tema o de mazo (`tema36-lote02` → `tema36`). */
export function toTopicId(id: string | null | undefined): string | null {
  if (!id) return null;
  if (getRecallTopic(id)) return id;
  return RECALL_DECKS.find((d) => d.id === id)?.topicId ?? null;
}

/** Total de fichas de recuerdo registradas en la app. */
export const RECALL_TOTAL_CARDS = RECALL_DECKS.reduce((sum, d) => sum + d.count, 0);

/** Mazos accesibles para el plan dado (por defecto, el plan actual). */
export function getAccessibleDecks(plan: Plan = getPlan()): readonly RecallDeck[] {
  return RECALL_DECKS.filter((deck) => canAccessDeck(deck.id, plan));
}

/** Un tema es accesible si el plan incluye al menos uno de sus lotes. */
export function canAccessTopic(topic: RecallTopic, plan: Plan = getPlan()): boolean {
  return topic.decks.some((deck) => canAccessDeck(deck.id, plan));
}

const cardCache = new Map<string, readonly RecallSourceCard[]>();
const pending = new Map<string, Promise<readonly RecallSourceCard[]>>();

/** Fichas de un mazo ya cargado (o `undefined` si aún no se ha pedido). */
export function getLoadedDeckCards(id: string): readonly RecallSourceCard[] | undefined {
  return cardCache.get(id);
}

/** Carga (una sola vez) las fichas de un mazo: import dinámico de su módulo. */
export function loadRecallDeckCards(id: string): Promise<readonly RecallSourceCard[]> {
  const cached = cardCache.get(id);
  if (cached) return Promise.resolve(cached);
  const inFlight = pending.get(id);
  if (inFlight) return inFlight;
  const load = LOADERS.get(id);
  if (!load) return Promise.reject(new Error(`Mazo de recuerdo desconocido: ${id}`));
  const deck = getRecallDeck(id);
  const promise = load()
    .then((cards) => {
      if (cards.length !== deck.count) {
        throw new Error(`Mazo ${deck.label}: se esperaban ${deck.count} fichas y hay ${cards.length}`);
      }
      cardCache.set(id, cards);
      return cards;
    })
    .finally(() => pending.delete(id));
  pending.set(id, promise);
  return promise;
}

function joinEs(items: readonly string[]): string {
  return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

/** Resumen legible de los temas cargados: «16, 35, 36 (lotes 01 a 08), 38, 39 y 40». */
export function describeRecallCoverage(decks: readonly RecallDeck[] = RECALL_DECKS): string {
  const byTema = new Map<number, string[]>();
  for (const deck of decks) {
    const lotes = byTema.get(deck.tema) ?? [];
    if (deck.lote) lotes.push(deck.lote.replace(/^lote/i, ''));
    byTema.set(deck.tema, lotes);
  }
  const parts = [...byTema.entries()]
    .sort(([a], [b]) => a - b)
    .map(([tema, lotes]) => {
      if (lotes.length === 0) return String(tema);
      if (lotes.length === 1) return `${tema} (lote ${lotes[0]})`;
      const nums = lotes.map(Number).sort((a, b) => a - b);
      const consecutive = nums.every((n, i) => i === 0 || n === nums[i - 1] + 1);
      const sorted = [...lotes].sort();
      return consecutive
        ? `${tema} (lotes ${sorted[0]} a ${sorted[sorted.length - 1]})`
        : `${tema} (lotes ${joinEs(sorted)})`;
    });
  return joinEs(parts);
}
