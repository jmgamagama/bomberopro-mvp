/**
 * Fuentes oficiales: nombre de cada documento (código de la tabla `concepts.documento`) y enlace al
 * texto oficial. Solo se enlaza lo verificable:
 *  - una URL oficial que ya venga en los datos (boe.es, doe.juntaex.es, dip-badajoz.es/bop), o
 *  - una URL deducida del identificador BOE-A-AAAA-NNNNN → https://www.boe.es/buscar/act.php?id=…
 * Nunca se inventa un enlace: si no hay ni URL ni identificador, se muestra solo el texto.
 */

export interface DocumentoOficial {
  nombre: string;
  /** Identificador BOE del texto consolidado (si lo hay). */
  boe?: string;
}

/** Códigos de documento que usa la base de datos → nombre legible (y BOE si consta en data/fuentes). */
export const DOCUMENTOS_OFICIALES: Readonly<Record<string, DocumentoOficial>> = {
  CE: { nombre: 'Constitución Española', boe: 'BOE-A-1978-31229' },
  EAEXT: { nombre: 'Estatuto de Autonomía de Extremadura (LO 1/2011)', boe: 'BOE-A-2011-1638' },
  LBRL: { nombre: 'Ley 7/1985 Reguladora de las Bases del Régimen Local', boe: 'BOE-A-1985-5392' },
  LPRL: { nombre: 'Ley 31/1995 de Prevención de Riesgos Laborales', boe: 'BOE-A-1995-24292' },
  LIEXT: { nombre: 'Ley 8/2011 de Igualdad entre mujeres y hombres y contra la violencia de género en Extremadura', boe: 'BOE-A-2011-6651' },
  RD1215: { nombre: 'Real Decreto 1215/1997 · Equipos de trabajo', boe: 'BOE-A-1997-17824' },
  RIPCI: { nombre: 'Real Decreto 513/2017 · Reglamento de instalaciones de protección contra incendios (RIPCI)', boe: 'BOE-A-2017-6606' },
  RSCIEI: { nombre: 'Real Decreto 164/2025 · Reglamento de seguridad contra incendios en los establecimientos industriales', boe: 'BOE-A-2025-7190' },
  D98: { nombre: 'Decreto 98/2008 · Catálogo de carreteras' },
  MOV: { nombre: 'Protocolo de movilización' },
  RAD: { nombre: 'Procedimiento de radiocomunicaciones' },
  SOS: { nombre: 'Aplicación SOS' },
  PT01: { nombre: 'PT01 · Conducción' },
  PT03: { nombre: 'PT03 · Amianto' },
};

export function nombreDocumento(codigo: string): string {
  return DOCUMENTOS_OFICIALES[codigo]?.nombre ?? codigo;
}

const BOE_ID = /BOE-A-\d{4}-\d+/;
const URL_OFICIAL = /https?:\/\/(?:www\.)?(?:boe\.es|doe\.juntaex\.es|bop\.dip-badajoz\.es|www\.dip-badajoz\.es)[^\s)»"]*/i;

export function boeUrl(id: string, articulo?: string): string {
  return `https://www.boe.es/buscar/act.php?id=${id}${articulo ? `#a${articulo}` : ''}`;
}

/** Ancla BOE de un artículo citado («Artículo 32 bis» → «32bis»), solo si la cita es inequívoca. */
function articuloCitado(texto: string): string | undefined {
  const m = texto.match(/\bArt(?:ículo|\.)\s*(\d+)(?:\s*(bis|ter|quater))?\b/gi);
  if (!m || m.length !== 1) return undefined;
  const p = /(\d+)(?:\s*(bis|ter|quater))?/i.exec(m[0].replace(/^\D+/, ''))!;
  return p[1] + (p[2] ? p[2].toLowerCase() : '');
}

export interface FuenteResuelta {
  /** Texto de la fuente sin la URL en bruto. */
  texto: string;
  url: string | null;
  /** Etiqueta del enlace: «BOE» o «texto oficial». */
  etiqueta: string;
}

/** Saca el enlace oficial de un texto de fuente (o de un código de documento) sin inventarlo. */
export function resolverFuente(fuente: string | null | undefined, documento?: string | null): FuenteResuelta {
  const original = (fuente ?? '').trim();
  const urlEnTexto = URL_OFICIAL.exec(original)?.[0]?.replace(/[.,;]+$/, '') ?? null;
  const texto = original.replace(URL_OFICIAL, '').replace(/[:\s]+$/, '').replace(/\s{2,}/g, ' ').trim();
  const id = BOE_ID.exec(original)?.[0] ?? (documento ? DOCUMENTOS_OFICIALES[documento]?.boe : undefined);
  let url: string | null = null;
  if (urlEnTexto) {
    url = urlEnTexto;
    if (/boe\.es\/buscar\/act\.php\?id=BOE-A-/i.test(url) && !url.includes('#')) {
      const art = articuloCitado(texto);
      if (art) url += `#a${art}`;
    }
  } else if (id) {
    url = boeUrl(id, articuloCitado(texto));
  }
  const etiqueta = url && /boe\.es/i.test(url) ? 'Ver en el BOE' : 'Ver texto oficial';
  return { texto: texto || original, url, etiqueta };
}
