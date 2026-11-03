/**
 * Auditoría editorial automática de las fichas de recuerdo (adaptado de ATLAS V2 §7.4,
 * «controles automáticos» antes de la revisión humana). Funciones puras, sin red.
 *
 * Reglas:
 * - id, concepto, respuesta y fuente no vacíos; localización (artículo, página o apartado) no vacía;
 * - ids únicos en todo el registro; sin conceptos repetidos dentro del mazo;
 * - todo enlace citado pertenece a un dominio oficial de OFFICIAL_DOMAINS;
 * - un mazo sin enlaces debe constar en DECKS_SIN_ENLACE (fuente oficial sin enlace público citado).
 *
 * La «versión» de un mazo es la huella sha256 de su contenido (ver scripts/auditar-fichas.ts y
 * docs/AUDITORIA_FICHAS.md): cualquier cambio en una ficha publicada cambia la huella.
 */
import type { RecallSourceCard } from './recallRegistry';

/** Dominios oficiales admitidos en las fuentes (subdominios incluidos). */
export const OFFICIAL_DOMAINS = [
  'boe.es',
  'juntaex.es',
  'insst.es',
  'codigotecnico.org',
  'unocha.org',
  'dgt.es',
  'dip-badajoz.es',
  'itu.int',
  'europa.eu',
  'miteco.gob.es',
] as const;

/**
 * Mazos cuya fuente es un documento oficial citado por nombre, edición y página, pero sin
 * enlace público en la ficha. Deuda editorial: conviene añadir el enlace oficial cuando exista.
 */
export const DECKS_SIN_ENLACE: Readonly<Record<string, string>> = {
  tema16: 'OACI Anexo 10 y Reglamento de Radiocomunicaciones de la UIT, citados sin enlace',
  tema35: 'Decreto 98/2008 y Mapa Oficial de Carreteras, citados sin enlace',
  'tema36-lote01': 'INE, SITEX e IGN citados sin enlace',
  'tema36-lote02': 'INE (población por municipios) citado sin enlace',
  'tema36-lote03': 'INE (población por municipios) citado sin enlace',
  'tema36-lote04': 'INE (población por municipios) citado sin enlace',
  'tema36-lote05': 'INE (población por municipios) citado sin enlace',
  'tema36-lote06': 'IGN-CNIG (límites administrativos) citado sin enlace',
  'tema36-lote07': 'IGN-CNIG (límites administrativos) citado sin enlace',
  'tema36-lote08': 'IGN-CNIG (límites administrativos) citado sin enlace',
  tema38: 'instrucciones técnicas (ITF) del CPEI citadas por edición y página',
  tema39: 'protocolo de movilización (BOP Badajoz 224/2025) y manuales SOS del CPEI citados sin enlace',
  tema40: 'procedimientos de trabajo (PT) del CPEI citados por edición y página',
  tema37: 'Plan de prevención del CPEI citado por BOP nº 117, anuncio 2242/2026, y página',
};

const URL_RE = /https?:\/\/[^\s)·,;"'<>]+/g;

export function citedUrls(card: RecallSourceCard): string[] {
  return `${card.fuente} ${card.localizacion ?? ''}`.match(URL_RE) ?? [];
}

export function isOfficialUrl(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
}

export interface DeckAudit {
  deckId: string;
  cards: number;
  withLink: number;
  problems: string[];
}

const blank = (s: unknown) => typeof s !== 'string' || s.trim() === '';

/** Audita un mazo. `globalIds` acumula ids entre mazos para detectar repetidos. */
export function auditDeck(
  deckId: string,
  expectedCount: number,
  cards: readonly RecallSourceCard[],
  globalIds: Map<string, string> = new Map(),
): DeckAudit {
  const problems: string[] = [];
  if (cards.length !== expectedCount) problems.push(`tiene ${cards.length} fichas y el registro declara ${expectedCount}`);
  const prompts = new Set<string>();
  let withLink = 0;
  for (const c of cards) {
    const ref = c.id || '(sin id)';
    if (blank(c.id)) problems.push('ficha sin id');
    if (blank(c.concepto)) problems.push(`${ref}: concepto vacío`);
    if (blank(c.respuesta)) problems.push(`${ref}: respuesta vacía`);
    if (blank(c.fuente)) problems.push(`${ref}: sin fuente`);
    if (blank(c.localizacion)) problems.push(`${ref}: sin localización (artículo, página o apartado)`);
    const other = globalIds.get(c.id);
    if (other) problems.push(`${ref}: id repetido (también en ${other})`);
    else if (!blank(c.id)) globalIds.set(c.id, deckId);
    const prompt = (c.concepto ?? '').trim().toLowerCase();
    if (prompt && prompts.has(prompt)) problems.push(`${ref}: concepto repetido en el mazo`);
    prompts.add(prompt);
    const urls = citedUrls(c);
    if (urls.length > 0) withLink++;
    for (const u of urls) if (!isOfficialUrl(u)) problems.push(`${ref}: enlace no oficial ${u}`);
  }
  if (withLink === 0 && cards.length > 0 && !DECKS_SIN_ENLACE[deckId]) {
    problems.push('ninguna ficha cita enlace oficial y el mazo no consta en DECKS_SIN_ENLACE');
  }
  return { deckId, cards: cards.length, withLink, problems };
}

/** Contenido canónico de un mazo para calcular su huella (orden y campos fijos). */
export function canonicalDeckContent(cards: readonly RecallSourceCard[]): string {
  return JSON.stringify(cards.map((c) => [c.id, c.concepto, c.respuesta, c.fuente, c.localizacion, c.apartado]));
}
